import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DOMAINS,
  DOMAIN_LABELS,
  DOMAIN_DESCRIPTIONS,
  DOMAIN_COLORS,
  DOMAIN_EMOJI,
} from '../types/problem';
import { useProgress } from '../state/progress';
import { useDomainSummary } from '../hooks/useProblems';

export function Home() {
  const { data: summary, loading, error } = useDomainSummary();
  const progress = useProgress((s) => s.byDomain);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-extrabold text-slate-900">
          Pick a trail
        </h1>
        <p className="text-slate-600 mt-1">
          Five 6th-grade Common Core domains. Each trail unlocks unit by unit.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 mb-4">
          Couldn't load problem bank: {error.message}
        </div>
      )}

      <div className="space-y-3">
        {DOMAINS.map((d, i) => {
          const dp = progress[d];
          const counts = summary?.find((s) => s.domain === d);
          const earned = dp
            ? Object.values(dp.unitStars).reduce<number>(
                (a, b) => a + (b as number),
                0,
              )
            : 0;
          return (
            <motion.div
              key={d}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/trail/${d}`}
                className="block rounded-3xl p-5 shadow-sm border border-slate-200 bg-white hover:shadow-md transition-shadow"
                style={{ borderLeftWidth: 8, borderLeftColor: DOMAIN_COLORS[d] }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{DOMAIN_EMOJI[d]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-extrabold text-lg text-slate-900">
                      {DOMAIN_LABELS[d]}
                    </div>
                    <div className="text-xs font-display font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                      {d}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {DOMAIN_DESCRIPTIONS[d]}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      {loading
                        ? 'Loading…'
                        : counts
                          ? `${counts.count} problems · ${counts.units} units`
                          : 'No problems yet'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                      <span>⭐</span>
                      <span className="font-display font-bold text-amber-900 text-sm">
                        {earned}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
