import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';
import { lessonKey, lessonAnswerMatches, type Lesson, type WorkedExample, type PracticeQuestion } from '../data/lessons';
import { DOMAIN_EMOJI } from '../types/problem';
import { stickerById } from '../utils/encouragement';
import { Mascot } from './Mascot';

interface Props {
  lesson: Lesson;
  onClose: () => void;
  onStart?: () => void;
}

const LESSON_XP = 8;

export function LessonCard({ lesson, onClose, onStart }: Props) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const key = lessonKey(lesson.domain, lesson.unit);
  const [alreadyDone] = useState(() => useProgress.getState().lessonsViewed.includes(key));
  const [phase, setPhase] = useState<'learn' | 'reward'>('learn');
  const [earned, setEarned] = useState<string[]>([]);

  const finish = () => {
    if (alreadyDone) {
      (onStart ?? onClose)();
      return;
    }
    const got = completeLesson(key);
    setEarned(got);
    setPhase('reward');
  };

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
            <RewardView
              xp={LESSON_XP}
              earned={earned}
              onStart={onStart}
              onClose={onClose}
            />
          ) : (
            <>
              <div className="text-center">
                <div className="text-4xl">{DOMAIN_EMOJI[lesson.domain]} 📘</div>
                <div className="text-xs font-display font-extrabold uppercase tracking-wider text-sky-600 mt-1">
                  Learn first · {lesson.domain} · Unit {lesson.unit}
                </div>
                <h2 className="text-xl font-display font-extrabold text-slate-900 mt-1">
                  {lesson.title}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{lesson.objective}</p>
              </div>

              <SectionLabel>How it works</SectionLabel>
              <ol className="space-y-2">
                {lesson.concept.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-display font-extrabold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{s}</span>
                  </li>
                ))}
              </ol>

              <SectionLabel>Worked examples</SectionLabel>
              <div className="space-y-2">
                {lesson.examples.map((ex, i) => (
                  <ExampleItem key={i} ex={ex} />
                ))}
              </div>

              <SectionLabel>Try it yourself</SectionLabel>
              <div className="space-y-3">
                {lesson.practice.map((p, i) => (
                  <PracticeItem key={i} item={p} index={i + 1} />
                ))}
              </div>

              <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm">
                <span className="font-display font-bold text-amber-800">⚠️ Watch out: </span>
                <span className="text-amber-900">{lesson.watchOut}</span>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={finish}
                  className="w-full min-h-12 px-6 py-2.5 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
                >
                  {alreadyDone ? (onStart ? 'Start practice' : 'Got it!') : onStart ? 'Finish & practice' : 'Finish lesson'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm font-display font-bold text-slate-400 hover:text-slate-600"
                >
                  Maybe later
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 mb-2 text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-500">
      {children}
    </div>
  );
}

function ExampleItem({ ex }: { ex: WorkedExample }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
      <div className="text-sm font-display font-bold text-slate-900">{ex.q}</div>
      {open ? (
        <div className="mt-2">
          <ol className="space-y-1">
            {ex.steps.map((s, i) => (
              <li key={i} className="text-sm text-slate-700">
                <span className="text-slate-400 font-display font-bold mr-1.5">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="text-sm text-green-700 font-display font-extrabold mt-1.5">
            Answer: {ex.answer}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-1.5 text-xs font-display font-bold text-sky-700 underline underline-offset-2"
        >
          Show step-by-step
        </button>
      )}
    </div>
  );
}

function PracticeItem({ item, index }: { item: PracticeQuestion; index: number }) {
  const [val, setVal] = useState('');
  const [checked, setChecked] = useState(false);
  const correct = lessonAnswerMatches(val, item.answers);

  return (
    <div className="rounded-2xl border-2 border-slate-200 p-3">
      <div className="text-sm font-display font-bold text-slate-900">
        <span className="text-sky-600">Q{index}.</span> {item.q}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          inputMode="text"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setChecked(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && val.trim()) setChecked(true);
          }}
          placeholder="Your answer"
          className="flex-1 min-w-0 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-display font-bold text-slate-900 focus:border-duo-blue focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!val.trim()}
          className="shrink-0 px-4 rounded-xl bg-duo-blue hover:bg-blue-600 disabled:bg-slate-200 text-white font-display font-extrabold text-sm transition-colors disabled:cursor-not-allowed"
        >
          Check
        </button>
      </div>
      {checked && (
        <div className="mt-2">
          <div
            className={`text-sm font-display font-extrabold ${
              correct ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {correct ? '✅ Correct!' : '🤔 Not quite — here is how:'}
          </div>
          <ol className="mt-1 space-y-1">
            {item.steps.map((s, i) => (
              <li key={i} className="text-sm text-slate-700">
                <span className="text-slate-400 font-display font-bold mr-1.5">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="text-sm text-green-700 font-display font-extrabold mt-1">
            Answer: {item.answers[0]}
          </div>
        </div>
      )}
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
      <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-2">Lesson complete!</h2>
      <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 font-display font-extrabold px-4 py-2 rounded-full">
        ⚡ +{xp} XP
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
