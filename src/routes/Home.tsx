import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TRAIL_DOMAINS,
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
  itemListElement: TRAIL_DOMAINS.map((d, i) => ({
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
    title: 'Math10x — Free Math for Grades 5-6, Algebra 1, Precalculus & SAT Prep',
    description:
      'Math10x makes math click for grades 5-6 and beyond: clear lessons, worked examples, and practice across ratios, fractions, geometry, statistics, Algebra 1, Precalculus, and full Digital SAT Math prep — plus an arcade of games kids unlock by learning.',
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
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink">
            Pick a trail, {displayName}!
          </h1>
          <p className="text-ink-muted mt-0.5 text-sm sm:text-base">
            Gr-5 foundations, five 6th-grade trails, Algebra 1, Precalculus, and SAT Math prep. Earn stars, stickers, and XP.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-bad-soft border-2 border-bad/40 rounded-2xl p-4 text-bad mb-4">
          Couldn't load problems: {error.message}
        </div>
      )}

      {/* Daily quest */}
      <div className="mb-4 rounded-3xl p-4 sm:p-5 bg-surface border-2 border-line flex items-center gap-4">
        <DailyQuestRing current={todaysXp} goal={dailyGoal} size={56} compact />
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold text-ink">
            {todaysXp >= dailyGoal ? 'Daily goal complete! 🎉' : 'Daily goal'}
          </div>
          <div className="text-sm text-ink-muted">
            {todaysXp >= dailyGoal
              ? `Nice — ${todaysXp} XP today.`
              : `${todaysXp} / ${dailyGoal} XP today. Keep going!`}
          </div>
        </div>
      </div>

      {/* Video Library */}
      <div className="mt-6 mb-4 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        🎬 Video
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Link
          to="/videos"
          className="block rounded-2xl p-3 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">📘</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Lessons</div>
          <div className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">Step-by-step</div>
        </Link>
        <Link
          to="/mathematicians"
          className="block rounded-2xl p-3 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🧑‍🔬</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Mathematicians</div>
          <div className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">Famous minds</div>
        </Link>
        <Link
          to="/stories"
          className="block rounded-2xl p-3 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🌟</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Math Stories</div>
          <div className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">History</div>
        </Link>
        <Link
          to="/settings"
          className="block rounded-2xl p-3 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">⚙️</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Settings</div>
          <div className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">Preferences</div>
        </Link>
      </div>

      {/* Shop banner */}
      <Link
        to="/shop"
        className="mb-4 flex items-center gap-3 rounded-3xl p-4 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <div className="text-3xl">🛍️</div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold">Coin Shop</div>
          <div className="text-xs text-ink-muted">Dress up your avatar &amp; unlock games!</div>
        </div>
        <div className="rounded-full bg-warn-soft text-warn px-3 py-1.5 font-mono font-semibold tabular-nums whitespace-nowrap">
          🪙 {coins.toLocaleString()}
        </div>
      </Link>
      <Link
        to="/rewards"
        className="mb-4 -mt-2 flex items-center gap-2 rounded-2xl px-4 py-2 bg-surface border border-line text-ink font-display font-semibold text-sm hover:border-line-strong transition-colors"
      >
        🏆 My Collection <span className="text-ink-dim font-bold">· rewards, power-ups & your avatar</span>
      </Link>

      {/* Core Play Tiles */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link
          to="/practice"
          className="block rounded-2xl p-3 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🧠</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Practice</div>
          <div className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">Adaptive</div>
        </Link>
        <Link
          to="/arcade"
          className="block rounded-2xl p-3 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🕹️</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Arcade</div>
          <div className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">Games</div>
        </Link>
        <Link
          to="/finals"
          className="block rounded-2xl p-3 bg-surface border border-line text-ink shadow-sm hover:shadow-md hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-2xl">🏆</div>
          <div className="font-display font-extrabold text-xs sm:text-sm mt-1">Finals</div>
          <div className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">Quizzes</div>
        </Link>
      </div>

      {/* SAT Math — its own section, not a trail */}
      <Link
        to="/sat"
        className="mb-4 block rounded-3xl border-2 border-line bg-surface p-4 sm:p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        style={{ borderLeftWidth: 10, borderLeftColor: DOMAIN_COLORS.SAT }}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="text-4xl sm:text-5xl">🎯</div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-extrabold text-ink sm:text-lg">SAT Math</div>
            <div className="mt-0.5 text-xs font-display font-bold uppercase tracking-wider text-ink-muted">
              Digital SAT prep
            </div>
            <div className="mt-1 text-sm text-ink-muted">
              The full blueprint: 18 unit playbooks, 180 practice questions with worked
              explanations, 100+ strategy tips, and 5 full-length mock tests with scoring.
            </div>
            <div className="mt-2 text-xs text-ink-muted">180 problems · 18 units · 5 mock tests</div>
          </div>
        </div>
      </Link>

      <div className="space-y-3">
        {TRAIL_DOMAINS.map((d, i) => {
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
                className="block rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-line bg-surface hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                style={{
                  borderLeftWidth: 10,
                  borderLeftColor: DOMAIN_COLORS[d],
                }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="text-4xl sm:text-5xl">{DOMAIN_EMOJI[d]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-extrabold text-base sm:text-lg text-ink">
                      {DOMAIN_LABELS[d]}
                    </div>
                    <div className="text-xs font-display font-bold text-ink-muted uppercase tracking-wider mt-0.5">
                      {d}
                    </div>
                    <div className="text-sm text-ink-muted mt-1">
                      {DOMAIN_DESCRIPTIONS[d]}
                    </div>
                    <div className="text-xs text-ink-muted mt-2">
                      {loading
                        ? 'Loading…'
                        : counts
                          ? `${counts.count} problems · ${counts.units} unit${counts.units === 1 ? '' : 's'}`
                          : 'Coming soon'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 bg-warn-soft px-2.5 py-1 rounded-full">
                      <span aria-hidden="true">⭐</span>
                      <span className="font-display font-extrabold text-warn text-sm tabular-nums">
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
