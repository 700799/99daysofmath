import { useParams, useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DOMAINS, type Domain } from '../types/problem';
import { StarRating } from '../components/StarRating';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import type { Stars } from '../state/progress';

interface ResultsState {
  stars: Stars;
  missedCount: number;
  total: number;
  xpEarned: number;
  sticker: string;
}

export function UnitResults() {
  const { domain, unit } = useParams<{ domain: string; unit: string }>();
  const { state } = useLocation() as { state: ResultsState | null };

  if (!domain || !DOMAINS.includes(domain as Domain) || !unit) {
    return <Navigate to="/" replace />;
  }
  if (!state) {
    return <Navigate to={`/trail/${domain}`} replace />;
  }

  const correct = state.total - state.missedCount;
  const perfect = state.stars === 3;

  return (
    <div className="relative">
      {perfect && <Confetti count={24} />}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center">
          <Mascot mood={perfect ? 'cheer' : 'happy'} size={120} />
        </div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 mt-2">
          {perfect ? 'Perfect unit!' : 'Unit complete!'}
        </h1>
        <p className="text-slate-600 mt-1">
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

        {state.sticker && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.3 }}
            className="mt-6 mx-auto inline-block"
          >
            <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 border-4 border-pink-300 rounded-3xl px-6 py-4">
              <div className="text-xs font-display font-extrabold uppercase tracking-wider text-pink-700">
                New sticker
              </div>
              <div className="text-2xl font-display font-extrabold text-slate-900 mt-1">
                {state.sticker}
              </div>
            </div>
          </motion.div>
        )}

        <Link
          to={`/trail/${domain}`}
          className="mt-8 inline-block w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
        >
          Back to trail
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
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
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
