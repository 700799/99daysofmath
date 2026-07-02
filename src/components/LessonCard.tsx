import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, LESSON_COINS } from '../state/progress';
import {
  lessonKey,
  lessonAnswerMatches,
  type Lesson,
  type LessonSlide,
  type WorkedExample,
  type PracticeQuestion,
} from '../data/lessons';
import { LessonVideo } from './LessonVideo';
import { ReadAloud } from './ReadAloud';
import { DOMAIN_EMOJI } from '../types/problem';
import { stickerById } from '../utils/encouragement';
import { Mascot } from './Mascot';

interface Props {
  lesson: Lesson;
  onClose: () => void;
  onStart?: () => void;
}

const LESSON_XP = 8;

type Page =
  | { kind: 'intro' }
  | { kind: 'video'; idx: number }
  | { kind: 'concept' }
  | { kind: 'slide'; idx: number }
  | { kind: 'example'; idx: number }
  | { kind: 'practice'; idx: number }
  | { kind: 'watchout' };

// Story-style deck: ONE video (the "idea" Manim animation) after the objective,
// then the authored slides (concepts → examples → pro tips), then interactive
// practice, then the trap/summary slides + watch-out. Lessons without an
// authored `slides` deck fall back to the legacy page set (all videos).
function buildPages(lesson: Lesson): Page[] {
  const vids = lesson.videos ?? [];
  const slides = lesson.slides ?? [];
  const pages: Page[] = [{ kind: 'intro' }];

  if (slides.length > 0) {
    const idxOf = (s: LessonSlide) => slides.indexOf(s);
    const objectives = slides.filter((s) => s.kind === 'objective');
    const middle = slides.filter((s) => s.kind === 'concept' || s.kind === 'example' || s.kind === 'protip');
    const tail = slides.filter((s) => s.kind === 'trap' || s.kind === 'summary');
    objectives.forEach((s) => pages.push({ kind: 'slide', idx: idxOf(s) }));
    if (vids.length > 0) pages.push({ kind: 'video', idx: 0 }); // the one lesson video
    middle.forEach((s) => pages.push({ kind: 'slide', idx: idxOf(s) }));
    lesson.practice.forEach((_, i) => pages.push({ kind: 'practice', idx: i }));
    tail.forEach((s) => pages.push({ kind: 'slide', idx: idxOf(s) }));
    pages.push({ kind: 'watchout' });
    return pages;
  }

  // legacy layout (no slide deck authored)
  if (vids.length > 0) pages.push({ kind: 'video', idx: 0 });
  pages.push({ kind: 'concept' });
  lesson.examples.forEach((_, i) => pages.push({ kind: 'example', idx: i }));
  if (vids.length > 1) pages.push({ kind: 'video', idx: 1 });
  lesson.practice.forEach((_, i) => pages.push({ kind: 'practice', idx: i }));
  for (let i = 2; i < vids.length; i++) pages.push({ kind: 'video', idx: i });
  pages.push({ kind: 'watchout' });
  return pages;
}

// Breadcrumb sections — pages roll up into these for the trail at the top.
const SECTION_ORDER = ['Intro', 'Key idea', 'Examples', 'Try it', 'Wrap-up'] as const;
type SectionName = (typeof SECTION_ORDER)[number];

function sectionOfSlide(kind: LessonSlide['kind']): SectionName {
  if (kind === 'objective') return 'Intro';
  if (kind === 'concept') return 'Key idea';
  if (kind === 'example' || kind === 'protip') return 'Examples';
  return 'Wrap-up'; // trap | summary
}

function makeSectionOf(lesson: Lesson): (page: Page) => SectionName {
  const slides = lesson.slides ?? [];
  return (page: Page): SectionName => {
    if (page.kind === 'intro') return 'Intro';
    if (page.kind === 'concept') return 'Key idea';
    if (page.kind === 'slide') return sectionOfSlide(slides[page.idx]?.kind ?? 'concept');
    // Video pages roll into the section they support so the breadcrumb
    // structure stays at 5 fixed sections.
    if (page.kind === 'video') {
      if (page.idx === 0) return 'Key idea';
      if (page.idx === 1) return 'Examples';
      return 'Wrap-up';
    }
    if (page.kind === 'example') return 'Examples';
    if (page.kind === 'practice') return 'Try it';
    return 'Wrap-up';
  };
}

// Minimum read time per page kind (seconds) before Next unlocks. The deck
// still ONLY advances on a button press — this just stops click-through.
// Scaled by the admin's lessonScreenSeconds (default 6 = 1×; 0 disables).
function baseSecsFor(page: Page, lesson: Lesson): number {
  if (page.kind === 'slide') {
    const k = (lesson.slides ?? [])[page.idx]?.kind;
    if (k === 'example') return 8;
    if (k === 'concept') return 5;
    return 3; // objective | protip | trap | summary
  }
  if (page.kind === 'example' || page.kind === 'practice') return 8;
  if (page.kind === 'concept') return 5;
  return 3; // intro | video | watchout
}

interface PracticeState {
  val: string;
  checked: boolean;
}

export function LessonCard({ lesson, onClose, onStart }: Props) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const key = lessonKey(lesson.domain, lesson.unit);
  const [alreadyDone] = useState(() =>
    useProgress.getState().lessonsViewed.includes(key),
  );
  const [phase, setPhase] = useState<'learn' | 'reward'>('learn');
  const [earned, setEarned] = useState<string[]>([]);

  const pages = buildPages(lesson);
  const [pageIndex, setPageIndex] = useState(0);
  const [exampleOpen, setExampleOpen] = useState<Record<number, boolean>>({});
  const [practiceState, setPracticeState] = useState<Record<number, PracticeState>>({});

  // Per-slide minimum read time (anti-click-through): 8s example slides, 5s
  // concept/explanation slides, 3s short slides. The admin's lessonScreenSeconds
  // scales the pacing (6 = 1×; 0 = off). The deck still advances only on press.
  const screenSecs = useProgress((s) => s.arcadeConfig.lessonScreenSeconds ?? 6);
  const [remain, setRemain] = useState(0);
  useEffect(() => {
    if (phase !== 'learn' || screenSecs <= 0) {
      setRemain(0);
      return;
    }
    const secs = Math.max(1, Math.round(baseSecsFor(pages[pageIndex], lesson) * (screenSecs / 6)));
    setRemain(secs);
    const id = setInterval(() => {
      setRemain((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, screenSecs, phase]);

  const finish = () => {
    if (alreadyDone) {
      (onStart ?? onClose)();
      return;
    }
    const got = completeLesson(key);
    setEarned(got);
    setPhase('reward');
  };

  const isLast = pageIndex === pages.length - 1;
  const isFirst = pageIndex === 0;
  const primaryLabel = isLast
    ? alreadyDone
      ? onStart
        ? 'Start practice'
        : 'Got it!'
      : onStart
        ? 'Finish & practice'
        : 'Finish lesson'
    : 'Next →';

  const goNext = () => (isLast ? finish() : setPageIndex((i) => i + 1));
  const goBack = () => setPageIndex((i) => Math.max(0, i - 1));

  const current = pages[pageIndex];
  const sectionOf = makeSectionOf(lesson);

  return (
    <AnimatePresence>
      <motion.div
        key="lesson"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 sm:p-6"
        role="dialog"
        aria-label={`Lesson: ${lesson.title}`}
      >
        <motion.div
          initial={{ scale: 0.9, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="bg-white rounded-3xl px-5 sm:px-6 py-6 max-w-md w-full shadow-2xl max-h-[92vh] overflow-y-auto"
        >
          {phase === 'reward' ? (
            <RewardView xp={LESSON_XP} earned={earned} onStart={onStart} onClose={onClose} />
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-sky-600 truncate">
                  📘 {lesson.domain} · Unit {lesson.unit}
                </div>
                <div className="shrink-0 text-[10px] font-display font-bold text-slate-400 tabular-nums">
                  {pageIndex + 1} / {pages.length}
                </div>
              </div>

              <Breadcrumbs
                pages={pages}
                pageIndex={pageIndex}
                sectionOf={sectionOf}
                onJump={(idx) => setPageIndex(idx)}
              />

              <div className="mt-3 min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pageIndex}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                  >
                    {current.kind === 'intro' && <IntroPage lesson={lesson} />}
                    {current.kind === 'video' && lesson.videos?.[current.idx] && (
                      <VideoPage
                        src={lesson.videos[current.idx].src}
                        title={lesson.videos[current.idx].title}
                      />
                    )}
                    {current.kind === 'concept' && <ConceptPage lesson={lesson} />}
                    {current.kind === 'slide' && lesson.slides?.[current.idx] && (
                      <SlidePage slide={lesson.slides[current.idx]} />
                    )}
                    {current.kind === 'example' && (
                      <ExamplePage
                        ex={lesson.examples[current.idx]}
                        index={current.idx}
                        total={lesson.examples.length}
                        open={!!exampleOpen[current.idx]}
                        onReveal={() =>
                          setExampleOpen((s) => ({ ...s, [current.idx]: true }))
                        }
                      />
                    )}
                    {current.kind === 'practice' && (
                      <PracticePage
                        item={lesson.practice[current.idx]}
                        index={current.idx}
                        total={lesson.practice.length}
                        state={practiceState[current.idx] ?? { val: '', checked: false }}
                        onChange={(s) =>
                          setPracticeState((all) => ({ ...all, [current.idx]: s }))
                        }
                      />
                    )}
                    {current.kind === 'watchout' && (
                      <WatchOutPage lesson={lesson} hasPractice={!!onStart} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isFirst}
                  className="flex-1 min-h-12 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300 text-slate-700 font-display font-extrabold transition-colors disabled:cursor-not-allowed"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={remain > 0}
                  className="flex-1 min-h-12 px-4 py-2.5 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:active:translate-y-0 text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all disabled:cursor-not-allowed"
                >
                  {remain > 0 ? `Read… ${remain}s` : primaryLabel}
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full text-sm font-display font-bold text-slate-400 hover:text-slate-600"
              >
                Maybe later
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Breadcrumbs({
  pages,
  pageIndex,
  sectionOf,
  onJump,
}: {
  pages: Page[];
  pageIndex: number;
  sectionOf: (page: Page) => SectionName;
  onJump: (idx: number) => void;
}) {
  const activeSection = sectionOf(pages[pageIndex]);
  const activeSectionIdx = SECTION_ORDER.indexOf(activeSection);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [pageIndex]);

  return (
    <nav
      aria-label="Lesson sections"
      className="mt-2 flex items-center gap-1 overflow-x-auto -mx-1 px-1 pb-1"
    >
      {SECTION_ORDER.map((sec, sIdx) => {
        const firstIdx = pages.findIndex((p) => sectionOf(p) === sec);
        if (firstIdx === -1) return null;
        const isActive = sec === activeSection;
        const isPast = !isActive && sIdx < activeSectionIdx;
        const pagesInSection = pages.filter((p) => sectionOf(p) === sec);
        const subTotal = pagesInSection.length;
        const subIdx = isActive
          ? pages.slice(0, pageIndex + 1).filter((p) => sectionOf(p) === sec).length
          : 0;
        const label =
          isActive && subTotal > 1
            ? `${sec} ${subIdx}/${subTotal}`
            : sec;
        // Every section is freely clickable — kids should be able to jump
        // anywhere in the lesson, not be gated. Future sections still look
        // visually distinct (lighter slate) so the current progress is clear.
        return (
          <div key={sec} className="flex items-center gap-1 shrink-0">
            {sIdx > 0 && (
              <span
                aria-hidden="true"
                className={`text-xs ${sIdx <= activeSectionIdx ? 'text-slate-400' : 'text-slate-300'}`}
              >
                ›
              </span>
            )}
            <button
              ref={isActive ? activeRef : undefined}
              type="button"
              onClick={() => onJump(firstIdx)}
              aria-current={isActive ? 'step' : undefined}
              className={[
                'text-[10px] font-display font-extrabold uppercase tracking-wider px-2 py-1 rounded-full transition-colors whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-duo-green text-white shadow-sm'
                  : isPast
                    ? 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                    : 'text-slate-500 bg-slate-50 hover:bg-slate-100',
              ].join(' ')}
            >
              {isPast && <span className="mr-0.5">✓</span>}
              {label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function IntroPage({ lesson }: { lesson: Lesson }) {
  return (
    <div className="text-center">
      <div className="text-5xl">{DOMAIN_EMOJI[lesson.domain]} 📘</div>
      <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-sky-600 mt-2">
        Learn first
      </div>
      <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-1 leading-tight">
        {lesson.title}
      </h2>
      <p className="text-sm text-slate-600 mt-2">{lesson.objective}</p>
      <div className="mt-3 flex justify-center">
        <ReadAloud text={[lesson.title, lesson.objective]} />
      </div>
      <div className="mt-5 rounded-2xl bg-sky-50 border border-sky-200 p-3 text-sm text-sky-900 text-left">
        <div className="font-display font-extrabold text-sky-700 text-xs uppercase tracking-wider">
          What's in this lesson
        </div>
        <ul className="mt-1.5 space-y-1 text-sm">
          <li>• The key idea</li>
          <li>• {lesson.examples.length} worked examples with step-by-step solutions</li>
          <li>• {lesson.practice.length} short questions to try</li>
        </ul>
      </div>
    </div>
  );
}

function VideoPage({ src, title }: { src: string; title: string }) {
  return (
    <div>
      <PageTitle eyebrow="Animation" title={title} />
      <div className="mt-3">
        <LessonVideo src={src} title={title} />
      </div>
      <p className="text-xs text-slate-500 text-center mt-2">
        Plays once and stops on the last frame — tap ↻ Replay to watch again.
      </p>
    </div>
  );
}

function ConceptPage({ lesson }: { lesson: Lesson }) {
  return (
    <div>
      <PageTitle eyebrow="The key idea" title="How it works" />
      <div className="mt-2">
        <ReadAloud text={lesson.concept} label="Read these aloud" />
      </div>
      <ol className="mt-3 space-y-3">
        {lesson.concept.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-display font-extrabold text-sm flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-[15px] text-slate-800 leading-snug">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// One story-style slide: a kind badge, a big headline, and ~3 readable
// sentences. Renders lesson `slides` decks (the math-stories format).
const SLIDE_STYLE: Record<LessonSlide['kind'], { badge: string; emoji: string; card: string; badgeCls: string }> = {
  objective: { badge: "Today's goal", emoji: '🎯', card: 'bg-sky-50 border-sky-200', badgeCls: 'bg-sky-200 text-sky-900' },
  concept: { badge: 'How it works', emoji: '💡', card: 'bg-blue-50 border-blue-200', badgeCls: 'bg-blue-200 text-blue-900' },
  example: { badge: 'Worked example', emoji: '✏️', card: 'bg-emerald-50 border-emerald-200', badgeCls: 'bg-emerald-200 text-emerald-900' },
  protip: { badge: 'Pro tip', emoji: '⭐', card: 'bg-violet-50 border-violet-200', badgeCls: 'bg-violet-200 text-violet-900' },
  trap: { badge: 'Trap to avoid', emoji: '⚠️', card: 'bg-amber-50 border-amber-200', badgeCls: 'bg-amber-200 text-amber-900' },
  summary: { badge: 'Summary', emoji: '🏁', card: 'bg-green-50 border-green-200', badgeCls: 'bg-green-200 text-green-900' },
};

function SlidePage({ slide }: { slide: LessonSlide }) {
  const st = SLIDE_STYLE[slide.kind];
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-display font-extrabold uppercase tracking-wider ${st.badgeCls}`}>
          <span aria-hidden="true">{st.emoji}</span> {st.badge}
        </span>
        <ReadAloud text={[slide.head, slide.body]} label="" />
      </div>
      <div className={`mt-3 rounded-2xl border-2 p-4 ${st.card}`}>
        <h3 className="text-xl font-display font-extrabold leading-tight text-slate-900">{slide.head}</h3>
        <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-slate-800">{slide.body}</p>
      </div>
    </div>
  );
}

function ExamplePage({
  ex,
  index,
  total,
  open,
  onReveal,
}: {
  ex: WorkedExample;
  index: number;
  total: number;
  open: boolean;
  onReveal: () => void;
}) {
  const [ansShown, setAnsShown] = useState(false);
  useEffect(() => setAnsShown(false), [index, open]);
  return (
    <div>
      <PageTitle eyebrow={`Worked example ${index + 1} of ${total}`} title="Try in your head first" />
      <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-base font-display font-extrabold text-slate-900 flex-1">{ex.q}</div>
          <ReadAloud
            text={open ? [ex.q, ...ex.steps, `Answer: ${ex.answer}`] : [ex.q]}
            label=""
          />
        </div>
        {open ? (
          <div className="mt-3">
            <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Step-by-step
            </div>
            <ol className="space-y-1.5">
              {ex.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-800">
                  <span className="text-slate-400 font-display font-bold w-4 shrink-0">
                    {i + 1}.
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            {ansShown ? (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-green-100 text-green-800 font-display font-extrabold text-sm rounded-full px-3 py-1">
                ✅ Answer: {ex.answer}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAnsShown(true)}
                className="mt-3 w-full min-h-11 px-4 py-2 rounded-xl bg-white border-2 border-green-200 text-green-700 font-display font-extrabold text-sm hover:bg-green-50 transition-colors"
              >
                👁 Reveal the final answer
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onReveal}
            className="mt-3 w-full min-h-11 px-4 py-2 rounded-xl bg-white border-2 border-sky-200 text-sky-700 font-display font-extrabold text-sm hover:bg-sky-50 transition-colors"
          >
            Show step-by-step →
          </button>
        )}
      </div>
    </div>
  );
}

function PracticePage({
  item,
  index,
  total,
  state,
  onChange,
}: {
  item: PracticeQuestion;
  index: number;
  total: number;
  state: PracticeState;
  onChange: (s: PracticeState) => void;
}) {
  const correct = lessonAnswerMatches(state.val, item.answers);
  return (
    <div>
      <PageTitle eyebrow={`Try it · question ${index + 1} of ${total}`} title="Your turn" />
      <div className="mt-3 rounded-2xl border-2 border-slate-200 p-4">
        <div className="text-base font-display font-extrabold text-slate-900">{item.q}</div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            inputMode="text"
            value={state.val}
            onChange={(e) => onChange({ val: e.target.value, checked: false })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && state.val.trim()) onChange({ ...state, checked: true });
            }}
            placeholder="Your answer"
            className="flex-1 min-w-0 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-display font-bold text-slate-900 focus:border-duo-blue focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onChange({ ...state, checked: true })}
            disabled={!state.val.trim()}
            className="shrink-0 px-4 rounded-xl bg-duo-blue hover:bg-blue-600 disabled:bg-slate-200 text-white font-display font-extrabold text-sm transition-colors disabled:cursor-not-allowed"
          >
            Check
          </button>
        </div>
        {state.checked && (
          <div className="mt-3">
            <div
              className={`text-sm font-display font-extrabold ${correct ? 'text-green-700' : 'text-red-700'}`}
            >
              {correct ? '✅ Correct!' : '🤔 Not quite — here is how:'}
            </div>
            <ol className="mt-2 space-y-1.5">
              {item.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-800">
                  <span className="text-slate-400 font-display font-bold w-4 shrink-0">
                    {i + 1}.
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-green-100 text-green-800 font-display font-extrabold text-sm rounded-full px-3 py-1">
              Answer: {item.answers[0]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WatchOutPage({ lesson, hasPractice }: { lesson: Lesson; hasPractice: boolean }) {
  return (
    <div>
      <PageTitle eyebrow="Before you go" title="Watch out for this" />
      <div className="mt-3 rounded-2xl bg-amber-50 border-2 border-amber-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-3xl">⚠️</div>
          <ReadAloud text={lesson.watchOut} label="" />
        </div>
        <p className="text-sm text-amber-900 mt-1.5 leading-snug">{lesson.watchOut}</p>
      </div>
      <div className="mt-3 text-sm text-slate-600 text-center">
        {hasPractice ? 'Ready? Finish to earn XP and start practice.' : 'Tap finish to earn your XP.'}
      </div>
    </div>
  );
}

function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-500">
        {eyebrow}
      </div>
      <h3 className="text-lg font-display font-extrabold text-slate-900 mt-0.5">{title}</h3>
    </div>
  );
}

function RewardView({
  xp,
  earned,
  onStart,
  onClose,
}: {
  xp: number;
  earned: string[];
  onStart?: () => void;
  onClose: () => void;
}) {
  const stickers = earned.map((id) => stickerById(id)).filter((s) => !!s);
  return (
    <div className="text-center py-2">
      <div className="flex justify-center">
        <Mascot mood="proud" size={96} oneShot />
      </div>
      <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-2">
        Lesson complete!
      </h2>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 font-display font-extrabold px-4 py-2 rounded-full">
          ⚡ +{xp} XP
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-display font-extrabold px-4 py-2 rounded-full">
          🪙 +{LESSON_COINS} coins
        </div>
      </div>
      {stickers.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-display font-extrabold uppercase tracking-wider text-pink-700">
            New sticker{stickers.length > 1 ? 's' : ''}!
          </div>
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            {stickers.map((s) => (
              <span
                key={s!.id}
                className="inline-flex items-center gap-1 bg-gradient-to-br from-yellow-100 to-pink-100 border-2 border-pink-200 px-3 py-1.5 rounded-full font-display font-bold text-slate-800 text-sm"
              >
                <span aria-hidden="true">{s!.emoji}</span>
                {s!.label}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => (onStart ?? onClose)()}
          className="w-full min-h-12 px-6 py-2.5 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
        >
          {onStart ? 'Start practice' : 'Done'}
        </button>
      </div>
    </div>
  );
}
