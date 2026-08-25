import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DOMAINS,
  DOMAIN_LABELS,
  DOMAIN_DESCRIPTIONS,
  DOMAIN_COLORS,
  DOMAIN_EMOJI,
  domainCourseName,
} from '../types/problem';
import { useProgress } from '../state/progress';
import { useDisplayName } from '../state/auth';
import { useDomainSummary } from '../hooks/useProblems';
import { Mascot } from '../components/Mascot';
import { DailyQuestRing } from '../components/DailyQuestRing';
import { PracticeHeatmap } from '../components/PracticeHeatmap';
import { Onboarding } from '../components/Onboarding';
import { HowItWorks } from '../components/HowItWorks';
import { useSeo, SITE_URL, SITE_NAME } from '../lib/seo';

const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Math10x math trails',
  itemListElement: DOMAINS.map((d, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Course',
      name: domainCourseName(d),
      description: DOMAIN_DESCRIPTIONS[d],
      url: `${SITE_URL}/trail/${d}`,
      provider: { '@type': 'EducationalOrganization', name: SITE_NAME, url: `${SITE_URL}/` },
    },
  })),
};

export function Home() {
  useSeo({
    title: 'Math10x — Free 5th & 6th Grade Math: Video Lessons, Practice & an Arcade',
    description:
      'Math10x makes 5th and 6th grade math click: clear animated video lessons, worked examples, and practice — plus an arcade of games kids unlock by learning.',
    canonicalPath: '/',
    jsonLd: HOME_JSON_LD,
  });
  const { data: summary, loading, error } = useDomainSummary();
  const progress = useProgress((s) => s.byDomain);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const todaysXp = useProgress((s) => s.todaysXp());
  const practiceDates = useProgress((s) => s.practiceDates);
  const xpByDate = useProgress((s) => s.xpByDate);
  const onboardingComplete = useProgress((s) => s.onboardingComplete);
  const coins = useProgress((s) => s.coins);
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
            Gr-5 foundations, five 6th-grade trails — and all-new Algebra 1. Earn stars, stickers, and XP.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-800 mb-4">
          Couldn't load problems: {error.message}
        </div>
      )}

      {/* Daily quest */}
      <div className="mb-4 rounded-3xl p-4 sm:p-5 bg-white border-2 border-slate-200 flex items-center gap-4">
        <DailyQuestRing current={todaysXp} goal={dailyGoal} size={56} compact />
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold text-slate-900">
            {todaysXp >= dailyGoal ? 'Daily goal complete! 🎉' : 'Daily goal'}
          </div>
          <div className="text-sm text-slate-600">
            {todaysXp >= dailyGoal
              ? `Nice — ${todaysXp} XP today.`
              : `${todaysXp} / ${dailyGoal} XP today. Keep going!`}
          </div>
        </div>
      </div>

      {/* Video Library */}
      <div className="mt-6 mb-4 text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
        🎬 Video
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Link
          to="/videos"
          className="block rounded-2xl p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">📘</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Lessons</div>
          <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Step-by-step</div>
        </Link>
        <Link
          to="/mathematicians"
          className="block rounded-2xl p-3 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🧑‍🔬</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Mathematicians</div>
          <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Famous minds</div>
        </Link>
        <Link
          to="/stories"
          className="block rounded-2xl p-3 bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🌟</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Math Stories</div>
          <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">History</div>
        </Link>
        <Link
          to="/settings"
          className="block rounded-2xl p-3 bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">⚙️</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Settings</div>
          <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Preferences</div>
        </Link>
      </div>

      {/* Shop banner */}
      <Link
        to="/shop"
        className="mb-4 flex items-center gap-3 rounded-3xl p-4 bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <div className="text-3xl">🛍️</div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold">Coin Shop</div>
          <div className="text-xs opacity-90">Dress up your avatar & unlock games!</div>
        </div>
        <div className="rounded-full bg-white/25 px-3 py-1.5 font-display font-extrabold tabular-nums whitespace-nowrap">
          🪙 {coins.toLocaleString()}
        </div>
      </Link>
      <Link
        to="/rewards"
        className="mb-4 -mt-2 flex items-center gap-2 rounded-2xl px-4 py-2 bg-white border-2 border-amber-200 text-amber-800 font-display font-extrabold text-sm hover:border-amber-300 transition-colors"
      >
        🏆 My Collection <span className="text-slate-400 font-bold">· rewards, power-ups & your avatar</span>
      </Link>

      {/* Core Play Tiles */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link
          to="/practice"
          className="block rounded-2xl p-3 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🧠</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Practice</div>
          <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Adaptive</div>
        </Link>
        <Link
          to="/arcade"
          className="block rounded-2xl p-3 bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🕹️</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Arcade</div>
          <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Games</div>
        </Link>
        <Link
          to="/finals"
          className="block rounded-2xl p-3 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🏆</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Finals</div>
          <div className="text-[10px] opacity-90 mt-0.5 line-clamp-1">Quizzes</div>
        </Link>
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

      <HowItWorks />
    </div>
  );
}
