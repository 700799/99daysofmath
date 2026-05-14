import { useParams, useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DOMAINS, type Domain } from '../types/problem';
import { StarRating } from '../components/StarRating';
import type { Stars } from '../state/progress';

interface ResultsState {
  stars: Stars;
  missedCount: number;
  total: number;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-5xl mb-3">🏆</div>
      <h1 className="text-3xl font-display font-extrabold text-slate-900">
        Unit complete!
      </h1>
      <p className="text-slate-600 mt-1">
        {domain} · Unit {unit}
      </p>

      <div className="mt-6 flex justify-center">
        <StarRating stars={state.stars} size="lg" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="text-2xl font-display font-extrabold text-green-800">
            {correct}
          </div>
          <div className="text-xs font-display font-bold text-green-700 uppercase tracking-wider">
            Correct
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="text-2xl font-display font-extrabold text-red-800">
            {state.missedCount}
          </div>
          <div className="text-xs font-display font-bold text-red-700 uppercase tracking-wider">
            Missed
          </div>
        </div>
      </div>

      <Link
        to={`/trail/${domain}`}
        className="mt-8 inline-block w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-sm"
      >
        Back to trail
      </Link>
    </motion.div>
  );
}
