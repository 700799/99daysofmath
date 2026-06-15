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
import { useDisplayName } from '../state/auth';
import { useDomainSummary } from '../hooks/useProblems';
import { Mascot } from '../components/Mascot';
import { DailyQuestRing } from '../components/DailyQuestRing';
import { PracticeHeatmap } from '../components/PracticeHeatmap';
import { Onboarding } from '../components/Onboarding';

export function Home() {
  const { data: summary, loading, error } = useDomainSummary();
  const progress = useProgress((s) => s.byDomain);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const todaysXp = useProgress((s) => s.todaysXp());
  const practiceDates = useProgress((s) => s.practiceDates);
  const xpByDate = useProgress((s) => s.xpByDate);
  const onboardingComplete = useProgress((s) => s.onboardingComplete);
  const markOnboardingDone = useProgress((s) => s.markOnboardingDone);
  const displayName = useDisplayName();

  return (
    <div>
      {!onboardingComplete && <Onboarding onDone={markOnboardingDone} />}

      <div className="mb-6 flex items-center gap-3">
        <Mascot mood="happy" size={72} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Pick a trail, {displayName}!
          </h1>
          <p className="text-slate-600 mt-0.5 text-sm sm:text-base">
            Gr-5 foundations plus five 6th-grade trails. Earn stars, stickers, and XP.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-800 mb-4">
          Couldn't load problems: {error.message}
        </div>
      )}

      {/* Daily quest with progress bar and Settings */}
      <div className="mb-6 rounded-3xl p-4 sm:p-5 bg-white border-2 border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-display font-extrabold text-slate-900">
              {todaysXp >= dailyGoal ? 'Daily goal complete! 🎉' : 'Daily goal'}
            </div>
            <div className="text-sm text-slate-600 mt-0.5">
              {todaysXp >= dailyGoal
                ? `Nice — ${todaysXp} XP today.`
                : `${todaysXp} / ${dailyGoal} XP today. Keep going!`}
            </div>
          </div>
          <Link
            to="/settings"
            className="shrink-0 w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center text-xl"
            aria-label="Settings"
            title="Settings"
          >
            ⚙️
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all ${
              todaysXp >= dailyGoal ? 'bg-duo-green' : 'bg-duo-blue'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((todaysXp / dailyGoal) * 100, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Feature cards - unified 2-column layout */}
      <div className="mb-6">
        <div className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-500 mb-3">
          🎓 Learn & Practice
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/videos"
            className="block rounded-2xl p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <div className="text-2xl">📘</div>
            <div className="font-display font-extrabold text-sm mt-2">Lessons</div>
            <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Step-by-step</div>
          </Link>
          <Link
            to="/mathematicians"
            className="block rounded-2xl p-3 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <div className="text-2xl">🧑‍🔬</div>
            <div className="font-display font-extrabold text-sm mt-2">Mathematicians</div>
            <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Famous minds</div>
          </Link>
          <Link
            to="/stories"
            className="block rounded-2xl p-3 bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <div className="text-2xl">🌟</div>
            <div className="font-display font-extrabold text-sm mt-2">Math Stories</div>
            <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">History</div>
          </Link>
          <Link
            to="/practice"
            className="block rounded-2xl p-3 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <div className="text-2xl">🧠</div>
            <div className="font-display font-extrabold text-sm mt-2">Practice</div>
            <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Adaptive</div>
          </Link>
          <Link
            to="/arcade"
            className="block rounded-2xl p-3 bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <div className="text-2xl">🕹️</div>
            <div className="font-display font-extrabold text-sm mt-2">Arcade</div>
            <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Games</div>
          </Link>
          <Link
            to="/finals"
            className="block rounded-2xl p-3 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <div className="text-2xl">🏆</div>
            <div className="font-display font-extrabold text-sm mt-2">Finals</div>
            <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Quizzes</div>
          </Link>
        </div>
      </div>

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


      <PracticeHeatmap practiceDates={practiceDates} xpByDate={xpByDate} />
    </div>
  );
}
