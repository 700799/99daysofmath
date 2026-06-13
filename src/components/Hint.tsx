import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MathText } from './MathText';
import type { HintStep, HintLevel } from '../types/problem';

interface Props {
  tiers: HintStep[];
  onReveal?: (level: HintLevel, tierIndex: number) => void;
  onExplain?: () => void; // opens the "Explain the concept" drawer
}

const TIER_BADGE: Record<HintLevel, string> = {
  nudge: 'Nudge',
  guide: 'Guide',
  reveal: 'Reveal',
};

const TIER_STYLES: Record<HintLevel, string> = {
  nudge: 'bg-amber-50 border-amber-200',
  guide: 'bg-orange-50 border-orange-300',
  reveal: 'bg-rose-50 border-rose-300',
};

const TIER_BADGE_STYLES: Record<HintLevel, string> = {
  nudge: 'bg-amber-200 text-amber-900',
  guide: 'bg-orange-200 text-orange-900',
  reveal: 'bg-rose-200 text-rose-900',
};

export function Hint({ tiers, onReveal, onExplain }: Props) {
  const [revealed, setRevealed] = useState(0);

  if (tiers.length === 0) return null;

  const reveal = () => {
    if (revealed >= tiers.length) return;
    const next = revealed + 1;
    setRevealed(next);
    onReveal?.(tiers[next - 1].level, next - 1);
  };

  const more = revealed < tiers.length;
  const buttonLabel =
    revealed === 0
      ? 'Show hint'
      : more
        ? 'Need another hint?'
        : 'Hide hints';

  const handleClick = () => {
    if (more) {
      reveal();
    } else {
      setRevealed(0);
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClick}
        className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-display font-bold text-sm transition-colors"
      >
        <span>💡</span>
        <span>{buttonLabel}</span>
      </button>
      <AnimatePresence initial={false}>
        {revealed > 0 && (
          <motion.div
            key="hint-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden flex flex-col gap-2"
          >
            {tiers.slice(0, revealed).map((tier, i) => (
              <div
                key={`tier-${i}`}
                className={`border rounded-2xl p-4 text-slate-800 ${TIER_STYLES[tier.level]}`}
              >
                {tiers.length > 1 && (
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span
                      className={`inline-block text-xs font-display font-bold px-2 py-1 rounded-full ${TIER_BADGE_STYLES[tier.level]}`}
                    >
                      {TIER_BADGE[tier.level]}
                    </span>
                    {tier.title && (
                      <span className="inline-block text-xs font-display font-extrabold px-2 py-1 rounded-full bg-violet-100 text-violet-800">
                        {tier.title}
                      </span>
                    )}
                  </div>
                )}
                <MathText text={tier.text} />
              </div>
            ))}
            {!more && onExplain && (
              <button
                type="button"
                onClick={onExplain}
                className="self-start min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 font-display font-bold text-sm transition-colors"
              >
                Still stuck? 📖 Explain the concept
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
