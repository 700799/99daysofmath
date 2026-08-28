import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLesson, type Lesson } from '../data/lessons';
import { DOMAIN_EMOJI, DOMAIN_LABELS, type Domain } from '../types/problem';
import { LessonVideo } from './LessonVideo';
import { ReadAloud } from './ReadAloud';

interface Props {
  domain: Domain;
  unit: number;
  open: boolean;
  onClose: () => void;
  onOpenLesson?: () => void; // present when launched from the Unit screen
}

type Tab = 'concept' | 'videos';

// Bottom-sheet drawer: "Explain the concept" — concept bullets on one tab,
// the unit's Manim videos on the other.
export function ConceptHelp({ domain, unit, open, onClose, onOpenLesson }: Props) {
  const [tab, setTab] = useState<Tab>('concept');
  const lesson = getLesson(domain, unit);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="concept-help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px]"
          onClick={onClose}
          role="dialog"
          aria-label={`Concept help: ${domain} unit ${unit}`}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 600) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-surface rounded-t-3xl shadow-2xl flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* drag handle */}
            <div className="pt-2.5 pb-1 flex justify-center shrink-0 cursor-grab">
              <div className="w-10 h-1.5 rounded-full bg-line-strong" />
            </div>

            <div className="px-5 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-accent">
                    {DOMAIN_EMOJI[domain]} {DOMAIN_LABELS[domain]} · Unit {unit}
                  </div>
                  <h2 className="text-lg font-display font-extrabold text-ink truncate">
                    {lesson ? lesson.title : 'Concept help'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="shrink-0 w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-2 text-ink-muted font-display font-extrabold"
                >
                  ✕
                </button>
              </div>

              {/* tabs */}
              <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1">
                {(
                  [
                    ['concept', '📖 Concept'],
                    ['videos', '🎬 Videos'],
                  ] as [Tab, string][]
                ).map(([t, label]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    aria-pressed={tab === t}
                    className={[
                      'min-h-10 rounded-xl font-display font-extrabold text-sm transition-colors',
                      tab === t ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-4 overflow-y-auto">
              {!lesson ? (
                <EmptyHelp />
              ) : tab === 'concept' ? (
                <ConceptTab lesson={lesson} onOpenLesson={onOpenLesson} />
              ) : (
                <VideosTab lesson={lesson} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmptyHelp() {
  return (
    <div className="text-center py-8 text-ink-muted">
      <div className="text-4xl">📚</div>
      <p className="mt-2 text-sm font-display font-bold">
        No lesson is wired to this unit yet — check the Video library on Home.
      </p>
    </div>
  );
}

function ConceptTab({ lesson, onOpenLesson }: { lesson: Lesson; onOpenLesson?: () => void }) {
  return (
    <div>
      <p className="text-sm text-ink-muted">{lesson.objective}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-ink-muted">
          The key idea
        </div>
        <ReadAloud text={[lesson.objective, ...lesson.concept]} label="Read aloud" />
      </div>
      <ol className="mt-2 space-y-2.5">
        {lesson.concept.map((c, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent-soft text-accent font-display font-extrabold text-sm flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-sm text-ink leading-snug">{c}</span>
          </li>
        ))}
      </ol>

      <div className="mt-4 text-[10px] font-display font-extrabold uppercase tracking-wider text-ink-muted">
        Quick worked examples
      </div>
      <div className="mt-2 space-y-2">
        {lesson.examples.map((ex, i) => (
          <details key={i} className="rounded-2xl bg-surface-2 border border-line p-3">
            <summary className="text-sm font-display font-bold text-ink cursor-pointer">
              {ex.q}
            </summary>
            <ol className="mt-2 space-y-1">
              {ex.steps.map((s, j) => (
                <li key={j} className="flex gap-2 text-sm text-ink-muted">
                  <span className="text-ink-dim font-display font-bold w-4 shrink-0">{j + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-ok-soft text-ok font-display font-extrabold text-sm rounded-full px-3 py-1">
              ✅ {ex.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-warn-soft border border-warn/40 p-3 text-sm">
        <span className="font-display font-bold text-warn">⚠️ Watch out: </span>
        <span className="text-warn">{lesson.watchOut}</span>
      </div>

      {onOpenLesson && (
        <button
          type="button"
          onClick={onOpenLesson}
          className="mt-4 w-full min-h-12 rounded-2xl bg-duo-blue hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
        >
          📘 Open the full lesson
        </button>
      )}
    </div>
  );
}

function VideosTab({ lesson }: { lesson: Lesson }) {
  const videos = lesson.videos ?? [];
  if (videos.length === 0) {
    return (
      <div className="text-center py-8 text-ink-muted">
        <div className="text-4xl">🎬</div>
        <p className="mt-2 text-sm font-display font-bold">
          Videos for this unit are coming soon — read the Concept tab meanwhile.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {videos.map((v) => (
        <div key={v.src}>
          <div className="text-sm font-display font-extrabold text-ink mb-1.5">
            ▶ {v.title}
          </div>
          <LessonVideo
            src={v.src}
            title={v.title}
            objective={lesson.objective}
            points={lesson.concept}
          />
        </div>
      ))}
      <p className="text-xs text-ink-muted text-center">
        Tap to watch full-screen — the key idea shows right beside the animation.
      </p>
    </div>
  );
}
