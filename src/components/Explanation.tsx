import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathText } from './MathText';
import { useProgress } from '../state/progress';

interface AltExplanation {
  title: string;
  steps: string[];
}

interface Props {
  steps: string[];
  alternatives?: AltExplanation[];
}

// Think-time cover: hides the worked solution for a configurable delay so the
// student tries the problem first, then auto-reveals. Delay is set by the
// grown-ups in Settings (arcadeConfig.answerRevealSeconds; 0 = instant).
function ThinkTimeCover({ total, left }: { total: number; left: number }) {
  const pct = total > 0 ? Math.max(0, Math.min(1, left / total)) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 text-center"
    >
      <div className="text-3xl">🧠</div>
      <div className="mt-2 font-display font-extrabold text-amber-900">
        Give it a try first!
      </div>
      <p className="text-sm text-amber-800/90 mt-1">
        Work it out yourself — the step-by-step answer appears in a moment.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-2xl font-display font-extrabold tabular-nums text-amber-900">
          {left}s
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-amber-200 overflow-hidden">
        <motion.div
          className="h-full bg-amber-500"
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.25, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

export function Explanation({ steps, alternatives }: Props) {
  const [openAlt, setOpenAlt] = useState<number | null>(null);
  const delay = useProgress((s) => s.arcadeConfig.answerRevealSeconds) ?? 15;
  const [revealed, setRevealed] = useState(delay <= 0);
  const [left, setLeft] = useState(delay);

  useEffect(() => {
    if (delay <= 0) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    setLeft(delay);
    const start = Date.now();
    const id = window.setInterval(() => {
      const rem = Math.max(0, delay - Math.round((Date.now() - start) / 1000));
      setLeft(rem);
      if (rem <= 0) {
        window.clearInterval(id);
        setRevealed(true);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [delay]);

  if (!revealed) {
    return <ThinkTimeCover total={delay} left={left} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-4 space-y-3"
    >
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📘</span>
          <span className="font-display font-extrabold text-blue-900">
            Step-by-step
          </span>
        </div>
        <ol className="space-y-2 list-decimal list-inside text-slate-800">
          {steps.map((step, i) => (
            <li key={i}>
              <MathText text={step} />
            </li>
          ))}
        </ol>
      </div>

      {alternatives && alternatives.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-display font-bold uppercase tracking-wider text-slate-500 pl-1">
            Another way to think about it
          </div>
          {alternatives.map((alt, i) => {
            const open = openAlt === i;
            return (
              <div
                key={i}
                className="bg-purple-50 border-2 border-purple-200 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenAlt(open ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 min-h-12 text-left hover:bg-purple-100 transition-colors"
                >
                  <span className="flex items-center gap-2 font-display font-bold text-purple-900">
                    <span>💡</span>
                    <span>{alt.title}</span>
                  </span>
                  <span className="text-purple-700 font-display font-bold text-lg">
                    {open ? '−' : '+'}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <ol className="px-5 pb-4 space-y-2 list-decimal list-inside text-slate-800">
                        {alt.steps.map((step, j) => (
                          <li key={j}>
                            <MathText text={step} />
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
