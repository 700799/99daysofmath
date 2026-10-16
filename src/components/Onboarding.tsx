import { motion, AnimatePresence } from 'framer-motion';
import { COURSES, COURSE_FIT, type CourseId } from '../data/courses';

interface Props {
  /** Called with the course the learner tapped. */
  onDone: (course: CourseId) => void;
  /** Highlighted when someone already has a course. */
  initialCourse?: CourseId | null;
}

/**
 * First-visit course picker. One screen, one tap: no questions about the
 * learner and no tour. Age and grade remain optional in Settings.
 */
export function Onboarding({ onDone, initialCourse = null }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        key="onboarding"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Choose a course"
      >
        <motion.div
          initial={{ scale: 0.85, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-surface px-6 py-7 shadow-2xl sm:px-7"
        >
          <h2 className="text-center font-display text-xl font-extrabold text-ink">
            Pick a course
          </h2>
          <p className="mx-auto mt-1.5 max-w-[19rem] text-center text-sm text-ink-muted">
            You can switch any time, and nothing is locked.
          </p>

          <div className="mt-4 space-y-2">
            {COURSES.map((c) => {
              const on = initialCourse === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onDone(c.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${
                    on ? 'border-accent bg-accent-soft' : 'border-line bg-surface-2 hover:border-accent/50'
                  }`}
                >
                  <span className="text-2xl leading-none">{c.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[13.5px] font-extrabold text-ink">
                      {c.name}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-muted">
                      {COURSE_FIT[c.id]}
                    </span>
                  </span>
                  {on && <span className="shrink-0 text-accent">✓</span>}
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
