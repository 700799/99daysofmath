import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathText } from './MathText';

interface AltExplanation {
  title: string;
  steps: string[];
}

interface Props {
  steps: string[];
  alternatives?: AltExplanation[];
}

// Explanations are always available — kids can read the "how & why" at any time.
// The configurable think-time pause lives on the ANSWER reveal instead (see Hint),
// so the worked steps here never sit behind a countdown.
export function Explanation({ steps, alternatives }: Props) {
  const [openAlt, setOpenAlt] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-4 space-y-3"
    >
      <div className="bg-accent-soft border-2 border-accent/35 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📘</span>
          <span className="font-display font-extrabold text-accent">
            Step-by-step
          </span>
        </div>
        {/* One bounded box per step, with the number in its own chip. A flat
            list-decimal run made every step look like the same sentence. */}
        <ol className="space-y-1.5 nums-tabular">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-2.5 rounded-xl border-2 border-line bg-surface px-2.5 py-2">
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent font-display text-2xs font-extrabold text-on-accent">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 text-[15px] leading-snug text-ink">
                <MathText text={step} />
              </span>
            </li>
          ))}
        </ol>
      </div>

      {alternatives && alternatives.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-display font-bold uppercase tracking-wider text-ink-muted pl-1">
            Another way to think about it
          </div>
          {alternatives.map((alt, i) => {
            const open = openAlt === i;
            return (
              <div
                key={i}
                className="bg-accent-soft border-2 border-accent/35 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenAlt(open ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 min-h-12 text-left hover:bg-accent-soft transition-colors"
                >
                  <span className="flex items-center gap-2 font-display font-bold text-accent">
                    <span>💡</span>
                    <span>{alt.title}</span>
                  </span>
                  <span className="text-accent font-display font-bold text-lg">
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
                      <ol className="px-5 pb-4 space-y-2 list-decimal list-inside text-ink">
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
