import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';
import { lessonKey, type Lesson } from '../data/lessons';
import { DOMAIN_EMOJI } from '../types/problem';

interface Props {
  lesson: Lesson;
  onClose: () => void;
  onStart?: () => void;
}

export function LessonCard({ lesson, onClose, onStart }: Props) {
  const markLessonViewed = useProgress((s) => s.markLessonViewed);

  useEffect(() => {
    markLessonViewed(lessonKey(lesson.domain, lesson.unit));
  }, [lesson, markLessonViewed]);

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
          className="bg-white rounded-3xl px-6 py-7 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        >
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

          <ol className="mt-4 space-y-2">
            {lesson.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-display font-extrabold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700">{s}</span>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3">
            <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-500">
              Worked example
            </div>
            <div className="text-sm font-display font-bold text-slate-900 mt-1">
              {lesson.example.q}
            </div>
            <div className="text-sm text-green-700 font-display font-bold mt-1">
              {lesson.example.a}
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm">
            <span className="font-display font-bold text-amber-800">⚠️ Watch out: </span>
            <span className="text-amber-900">{lesson.watchOut}</span>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {onStart && (
              <button
                type="button"
                onClick={onStart}
                className="w-full min-h-12 px-6 py-2.5 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
              >
                Start practice
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-display font-bold text-slate-400 hover:text-slate-600"
            >
              {onStart ? 'Maybe later' : 'Got it!'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
