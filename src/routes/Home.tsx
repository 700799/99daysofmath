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
import { Mascot } from '../components/Mascot';

export function Home() {
  const { data: summary, loading, error } = useDomainSummary();
  const progress = useProgress((s) => s.byDomain);
  const stickers = useProgress((s) => s.stickers);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Mascot mood="happy" size={72} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Pick a trail!
          </h1>
          <p className="text-slate-600 mt-0.5 text-sm sm:text-base">
            Five 6th-grade math trails. Earn stars, stickers, and XP.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-800 mb-4">
          Couldn't load problems: {error.message}
        </div>
      )}

      <Link
        to="/mix"
        className="block mb-4 rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-4xl sm:text-5xl">🎲</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-extrabold text-lg sm:text-xl">
              Daily Mix
            </div>
            <div className="text-xs sm:text-sm opacity-90 mt-0.5">
              5 random problems across all domains — great MAP prep.
            </div>
          </div>
          <div className="text-2xl shrink-0">→</div>
        </div>
      </Link>

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
                className="block rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                style={{
                  borderLeftWidth: 10,
                  borderLeftColor: DOMAIN_COLORS[d],
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="text-4xl sm:text-5xl">{DOMAIN_EMOJI[d]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-extrabold text-base sm:text-lg text-slate-900">
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
                          ? `${counts.count} problems · ${counts.units} unit${counts.units === 1 ? '' : 's'}`
                          : 'Coming soon'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-full">
                      <span aria-hidden="true">⭐</span>
                      <span className="font-display font-extrabold text-amber-900 text-sm tabular-nums">
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

      <Link
        to="/settings"
        className="mt-6 inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
      >
        ⚙️ Settings
      </Link>

      {stickers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl" aria-hidden="true">🎒</span>
            <div>
              <div className="font-display font-extrabold text-slate-900">
                Sticker book
              </div>
              <div className="text-xs text-slate-500">
                {stickers.length} earned
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {stickers.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 bg-gradient-to-br from-yellow-100 to-pink-100 border-2 border-pink-200 px-3 py-1.5 rounded-full font-display font-bold text-slate-800 text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
