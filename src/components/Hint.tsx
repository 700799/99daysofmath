import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MathText } from './MathText';
import { useProgress } from '../state/progress';
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
  // Think-time pause applies to the ANSWER reveal only: before the final "Reveal"
  // tier unlocks, a short countdown nudges the student to try first. Set by the
  // grown-ups in Settings (arcadeConfig.answerRevealSeconds; 0 = instant).
  const delay = useProgress((s) => s.arcadeConfig.answerRevealSeconds) ?? 15;
  const [left, setLeft] = useState(0);

  const nextTier = tiers[revealed]; // the tier the button would reveal next
  const gateNext = !!nextTier && nextTier.level === 'reveal' && delay > 0;

  // run the think-time countdown while the next tier to reveal is the answer
  useEffect(() => {
    if (!gateNext) { setLeft(0); return; }
    setLeft(delay);
    const start = Date.now();
    const id = window.setInterval(() => {
      const rem = Math.max(0, delay - Math.round((Date.now() - start) / 1000));
      setLeft(rem);
      if (rem <= 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [gateNext, delay, revealed]);

  if (tiers.length === 0) return null;

  const locked = gateNext && left > 0; // answer reveal held during think-time

  const reveal = () => {
    if (revealed >= tiers.length) return;
    const next = revealed + 1;
    setRevealed(next);
    onReveal?.(tiers[next - 1].level, next - 1);
  };

  const more = revealed < tiers.length;
  const buttonLabel = !more
    ? 'Hide hints'
    : locked
      ? `🧠 Think first… answer in ${left}s`
      : nextTier?.level === 'reveal'
        ? 'Reveal the answer'
        : revealed === 0
          ? 'Show hint'
          : 'Need another hint?';

  const handleClick = () => {
    if (!more) { setRevealed(0); return; }
    if (locked) return;
    reveal();
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={locked}
        className={`min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-full font-display font-bold text-sm transition-colors ${
          locked ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
        }`}
      >
        <span>{locked ? '⏳' : '💡'}</span>
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
