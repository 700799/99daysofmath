import { useState } from 'react';
import { useParams, useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DOMAINS, type Domain } from '../types/problem';
import { StarRating } from '../components/StarRating';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import { StickerCelebration } from '../components/StickerCelebration';
import { stickerById } from '../utils/encouragement';
import { parentOf } from '../utils/navHierarchy';
import type { Stars } from '../state/progress';

interface ResultsState {
  stars: Stars;
  missedCount: number;
  total: number;
  xpEarned: number;
  unitBonus?: number;
  trailBonus?: number;
  allTrailsBonus?: number;
  sticker: string;
  newStickerIds?: string[];
}

export function UnitResults() {
  const { domain, unit } = useParams<{ domain: string; unit: string }>();
  const { state } = useLocation() as { state: ResultsState | null };
  const [celebrated, setCelebrated] = useState(false);

  if (!domain || !DOMAINS.includes(domain as Domain) || !unit) {
    return <Navigate to="/" replace />;
  }
  if (!state) {
    // Opened directly, with no run behind it — send them up a level.
    return <Navigate to={parentOf(`/unit/${domain}/${unit}`)?.to ?? '/'} replace />;
  }

  const backTo = parentOf(`/unit/${domain}/${unit}`) ?? { to: '/', label: 'Home' };
  const correct = state.total - state.missedCount;
  const perfect = state.stars === 3;
  const newStickerIds = state.newStickerIds ?? [];

  return (
    <div className="relative">
      {!celebrated && newStickerIds.length > 0 && (
        <StickerCelebration stickerIds={newStickerIds} onDone={() => setCelebrated(true)} />
      )}
      {perfect && <Confetti count={24} />}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center">
          <Mascot mood={perfect ? 'cheer' : 'happy'} size={120} />
        </div>
        <h1 className="text-3xl font-display font-extrabold text-ink mt-2">
          {perfect ? 'Perfect unit!' : 'Unit complete!'}
        </h1>
        <p className="text-ink-muted mt-1">
          {domain} · Unit {unit}
        </p>

        <div className="mt-6 flex justify-center">
          <StarRating stars={state.stars} size="lg" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatBox value={correct} label="Correct" tone="green" />
          <StatBox value={state.missedCount} label="Missed" tone="red" />
          <StatBox value={state.xpEarned} label="XP" tone="yellow" />
        </div>

        {((state.unitBonus ?? 0) > 0 || (state.trailBonus ?? 0) > 0 || (state.allTrailsBonus ?? 0) > 0) && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {(state.unitBonus ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 bg-warn-soft text-warn font-display font-extrabold text-sm px-3 py-1.5 rounded-full">
                🎁 Unit bonus +{state.unitBonus} XP
              </span>
            )}
            {(state.trailBonus ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 bg-ok-soft text-ok font-display font-extrabold text-sm px-3 py-1.5 rounded-full">
                🏁 Trail complete +{state.trailBonus} XP
              </span>
            )}
            {(state.allTrailsBonus ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 bg-accent-soft text-accent font-display font-extrabold text-sm px-3 py-1.5 rounded-full">
                👑 ALL trails done +{state.allTrailsBonus} XP
              </span>
            )}
          </div>
        )}

        {state.newStickerIds && state.newStickerIds.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 items-center">
            <div className="text-xs font-display font-extrabold uppercase tracking-wider text-pink-700">
              {state.newStickerIds.length === 1 ? 'New sticker' : 'New stickers'}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {state.newStickerIds.map((id, i) => {
                const def = stickerById(id);
                if (!def) return null;
                return (
                  <motion.div
                    key={id}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 14,
                      delay: 0.2 + i * 0.15,
                    }}
                  >
                    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 border-4 border-pink-300 rounded-3xl px-5 py-3 text-center">
                      <div className="text-3xl">{def.emoji}</div>
                      <div className="text-sm font-display font-extrabold text-ink mt-1">
                        {def.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <Link
          to={backTo.to}
          className="mt-8 inline-block w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
        >
          Back to {backTo.label}
        </Link>
      </motion.div>
    </div>
  );
}

function StatBox({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: 'green' | 'red' | 'yellow';
}) {
  const styles = {
    green: 'bg-ok-soft border-ok/40 text-ok',
    red: 'bg-bad-soft border-bad/40 text-bad',
    yellow: 'bg-warn-soft border-warn/40 text-warn',
  }[tone];
  return (
    <div className={`border-2 rounded-2xl p-3 ${styles}`}>
      <div className="text-2xl font-display font-extrabold tabular-nums">
        {value}
      </div>
      <div className="text-xs font-display font-bold uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
