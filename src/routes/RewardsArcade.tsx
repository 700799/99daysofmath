import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../state/progress';
import {
  REWARD_GAMES,
  isGameUnlocked,
  starsUntilUnlock,
  tallyTrophies,
  MEDAL_ICONS,
  MEDAL_LABEL,
  type RewardGameMeta,
} from '../rewards/economy';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/registry';

export function RewardsArcade() {
  const coins = useProgress((s) => s.coins);
  const trophies = useProgress((s) => s.trophies);
  const totalStars = useProgress((s) => s.totalStars());
  const tally = tallyTrophies(trophies);

  const games = [...REWARD_GAMES].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Icon name="party" size={40} />
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">Rewards Arcade</h1>
          <p className="text-slate-600 mt-0.5">
            Finish units on the trails to earn coins, then play to win trophies!
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <StatCard icon="coin" value={coins} label="Coins" tone="bg-amber-50 border-amber-200 text-amber-900" toneLabel="text-amber-700" />
        <StatCard icon="trophy" value={tally.total} label="Trophies" tone="bg-violet-50 border-violet-200 text-violet-900" toneLabel="text-violet-700" />
        <StatCard icon="star" value={totalStars} label="Stars" tone="bg-sky-50 border-sky-200 text-sky-900" toneLabel="text-sky-700" />
      </div>

      <div className="space-y-4">
        {games.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GameCard game={g} totalStars={totalStars} />
          </motion.div>
        ))}
      </div>

      {tally.total > 0 && (
        <div className="mt-6">
          <div className="text-sm font-display font-bold text-slate-700 mb-2">Trophy case</div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-around text-center">
            {(['gold', 'silver', 'bronze'] as const).map((m) => (
              <div key={m}>
                <div className="flex justify-center">
                  <Icon name={MEDAL_ICONS[m]} size={36} label={`${MEDAL_LABEL[m]} medal`} />
                </div>
                <div className="text-xl font-display font-extrabold text-slate-900 tabular-nums">
                  {tally[m]}
                </div>
                <div className="text-xs font-display font-bold text-slate-500 uppercase tracking-wider">
                  {MEDAL_LABEL[m]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
  toneLabel,
}: {
  icon: IconName;
  value: number;
  label: string;
  tone: string;
  toneLabel: string;
}) {
  return (
    <div className={`flex-1 border rounded-2xl p-4 text-center ${tone}`}>
      <div className="flex justify-center">
        <Icon name={icon} size={28} />
      </div>
      <div className="text-2xl font-display font-extrabold tabular-nums mt-1">{value}</div>
      <div className={`text-xs font-display font-bold uppercase tracking-wider ${toneLabel}`}>
        {label}
      </div>
    </div>
  );
}

function GameCard({ game, totalStars }: { game: RewardGameMeta; totalStars: number }) {
  const unlocked = isGameUnlocked(totalStars, game.id);
  const need = starsUntilUnlock(totalStars, game.id);
  const featured = Boolean(game.featured);

  const inner = (
    <div
      className={[
        'relative rounded-3xl border bg-white overflow-hidden transition-shadow',
        unlocked ? 'border-slate-200 hover:shadow-md' : 'border-slate-200 opacity-80',
        featured ? 'p-6' : 'p-5',
      ].join(' ')}
      style={{ borderLeftWidth: 8, borderLeftColor: game.accent }}
    >
      {featured && (
        <div
          className="absolute top-0 right-0 text-[10px] font-display font-extrabold uppercase tracking-wider text-white px-3 py-1 rounded-bl-xl"
          style={{ backgroundColor: game.accent }}
        >
          Featured
        </div>
      )}
      <div className="flex items-center gap-4">
        <Icon name={unlocked ? game.icon : 'lock'} size={featured ? 60 : 48} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <div className={`font-display font-extrabold text-slate-900 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {game.name}
          </div>
          <div className="text-sm text-slate-600 mt-0.5">{game.tagline}</div>
          {!unlocked && (
            <div className="text-xs font-display font-bold text-amber-600 mt-2 flex items-center gap-1">
              <span>Earn {need} more</span>
              <Icon name="star" size={14} label="stars" />
              <span>to unlock</span>
            </div>
          )}
        </div>
        {unlocked && (
          <div
            className="shrink-0 flex items-center gap-1.5 px-5 py-3 rounded-2xl text-white font-display font-extrabold shadow-sm"
            style={{ backgroundColor: game.accent }}
          >
            <span>Play</span>
            <Icon name="play" size={14} />
          </div>
        )}
      </div>
    </div>
  );

  if (!unlocked) return inner;
  return (
    <Link to={`/rewards/${game.id}`} className="block">
      {inner}
    </Link>
  );
}
