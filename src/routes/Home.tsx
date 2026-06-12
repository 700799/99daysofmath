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
import { DailyQuestRing } from '../components/DailyQuestRing';
import { PracticeHeatmap } from '../components/PracticeHeatmap';
import { Onboarding } from '../components/Onboarding';
import { recommendNextUnit } from '../utils/recommendations';
import {
  STICKER_DEFS,
  TOTAL_STICKERS,
  type StickerCategory,
  type StickerDef,
} from '../utils/encouragement';

const CATEGORY_LABELS: Record<StickerCategory, string> = {
  unit: 'Units',
  streak: 'Streak',
  accuracy: 'Accuracy',
  xp: 'XP',
  mastery: 'Mastery',
  challenge: 'Challenges',
};

const CATEGORY_ORDER: StickerCategory[] = [
  'unit',
  'streak',
  'accuracy',
  'xp',
  'mastery',
  'challenge',
];

export function Home() {
  const { data: summary, loading, error } = useDomainSummary();
  const progress = useProgress((s) => s.byDomain);
  const stickers = useProgress((s) => s.stickers);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const todaysXp = useProgress((s) => s.todaysXp());
  const practiceDates = useProgress((s) => s.practiceDates);
  const xpByDate = useProgress((s) => s.xpByDate);
  const dueReview = useProgress((s) => s.dueReviewCount());
  const onboardingComplete = useProgress((s) => s.onboardingComplete);
  const markOnboardingDone = useProgress((s) => s.markOnboardingDone);

  const rec = recommendNextUnit(progress);

  return (
    <div>
      {!onboardingComplete && <Onboarding onDone={markOnboardingDone} />}

      <div className="mb-6 flex items-center gap-3">
        <Mascot mood="happy" size={72} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Pick a trail!
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

      {/* Due for review */}
      {dueReview > 0 && (
        <Link
          to="/review"
          className="block mb-4 rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-4xl sm:text-5xl">📅</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-display font-bold uppercase tracking-wider opacity-90">
                Smart review
              </div>
              <div className="font-display font-extrabold text-lg sm:text-xl">
                {dueReview} {dueReview === 1 ? 'problem' : 'problems'} due today
              </div>
              <div className="text-xs sm:text-sm opacity-90 mt-0.5">
                Lock in the ones you missed — timed for memory.
              </div>
            </div>
            <div className="text-2xl shrink-0">→</div>
          </div>
        </Link>
      )}

      {/* Recommended next */}
      {rec && (
        <Link
          to={rec.allMastered ? '/test' : `/unit/${rec.domain}/${rec.unit}`}
          className="block mb-4 rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-4xl sm:text-5xl">{rec.allMastered ? '🎓' : DOMAIN_EMOJI[rec.domain]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-display font-bold uppercase tracking-wider opacity-90">
                Recommended next
              </div>
              <div className="font-display font-extrabold text-lg sm:text-xl">
                {rec.allMastered ? 'Mock MAP test' : `${DOMAIN_LABELS[rec.domain]} · Unit ${rec.unit}`}
              </div>
              <div className="text-xs sm:text-sm opacity-90 mt-0.5">{rec.reason}</div>
            </div>
            <div className="text-2xl shrink-0">→</div>
          </div>
        </Link>
      )}

      {/* Adaptive Practice + Daily Mix + Mock Test */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Link
          to="/practice"
          className="block rounded-3xl p-4 bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-3xl">🧠</div>
          <div className="font-display font-extrabold text-lg mt-1">Adaptive Practice</div>
          <div className="text-xs opacity-90 mt-0.5">Questions tune to your level, MAP-style.</div>
        </Link>
        <Link
          to="/mix"
          className="block rounded-3xl p-4 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-3xl">🎲</div>
          <div className="font-display font-extrabold text-lg mt-1">Daily Mix</div>
          <div className="text-xs opacity-90 mt-0.5">5 random problems across all domains.</div>
        </Link>
        <Link
          to="/test"
          className="block rounded-3xl p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <div className="text-3xl">🎓</div>
          <div className="font-display font-extrabold text-lg mt-1">Mock MAP Test</div>
          <div className="text-xs opacity-90 mt-0.5">18 timed questions with a score estimate.</div>
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

      <div className="mt-6 flex items-center gap-4">
        <Link
          to="/report"
          className="inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
        >
          📊 Progress report
        </Link>
        <Link
          to="/videos"
          className="inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
        >
          🎬 Video library
        </Link>
        <Link
          to="/settings"
          className="inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
        >
          ⚙️ Settings
        </Link>
      </div>

      <PracticeHeatmap practiceDates={practiceDates} xpByDate={xpByDate} />

      <StickerBook earnedIds={stickers} />
    </div>
  );
}

function StickerBook({ earnedIds }: { earnedIds: string[] }) {
  const earnedSet = new Set(earnedIds);
  const byCategory = new Map<StickerCategory, StickerDef[]>();
  for (const def of STICKER_DEFS) {
    const list = byCategory.get(def.category) ?? [];
    list.push(def);
    byCategory.set(def.category, list);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl" aria-hidden="true">🎒</span>
        <div>
          <div className="font-display font-extrabold text-slate-900">
            Sticker book
          </div>
          <div className="text-xs text-slate-500">
            {earnedIds.length} / {TOTAL_STICKERS} earned
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {CATEGORY_ORDER.map((cat) => {
          const defs = byCategory.get(cat) ?? [];
          if (defs.length === 0) return null;
          const catEarned = defs.filter((d) => earnedSet.has(d.id)).length;
          return (
            <div key={cat}>
              <div className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                {CATEGORY_LABELS[cat]} · {catEarned}/{defs.length}
              </div>
              <div className="flex flex-wrap gap-2">
                {defs.map((def) => {
                  const got = earnedSet.has(def.id);
                  return (
                    <span
                      key={def.id}
                      title={def.hint ?? def.label}
                      className={
                        got
                          ? 'inline-flex items-center gap-1 bg-gradient-to-br from-yellow-100 to-pink-100 border-2 border-pink-200 px-3 py-1.5 rounded-full font-display font-bold text-slate-800 text-sm'
                          : 'inline-flex items-center gap-1 bg-slate-100 border-2 border-slate-200 px-3 py-1.5 rounded-full font-display font-bold text-slate-400 text-sm opacity-60'
                      }
                    >
                      <span aria-hidden="true">{got ? def.emoji : '🔒'}</span>
                      <span>{def.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
