import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../state/progress';
import {
  REWARD_GAMES,
  isGameUnlocked,
  starsUntilUnlock,
  tallyTrophies,
  MEDAL_EMOJI,
  type RewardGameMeta,
} from '../rewards/economy';

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
      <div className="mb-4">
        <h1 className="text-3xl font-display font-extrabold text-slate-900">🎉 Rewards Arcade</h1>
        <p className="text-slate-600 mt-1">
          Finish units on the trails to earn 🪙 coins, then play to win trophies!
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <div className="text-2xl">🪙</div>
          <div className="text-2xl font-display font-extrabold text-amber-900 tabular-nums">{coins}</div>
          <div className="text-xs font-display font-bold text-amber-700 uppercase tracking-wider">Coins</div>
        </div>
        <div className="flex-1 bg-violet-50 border border-violet-200 rounded-2xl p-4 text-center">
          <div className="text-2xl">🏆</div>
          <div className="text-2xl font-display font-extrabold text-violet-900 tabular-nums">{tally.total}</div>
          <div className="text-xs font-display font-bold text-violet-700 uppercase tracking-wider">Trophies</div>
        </div>
        <div className="flex-1 bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center">
          <div className="text-2xl">⭐</div>
          <div className="text-2xl font-display font-extrabold text-sky-900 tabular-nums">{totalStars}</div>
          <div className="text-xs font-display font-bold text-sky-700 uppercase tracking-wider">Stars</div>
        </div>
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
          <div className="text-sm font-display font-bold text-slate-700 mb-2">🏅 Trophy case</div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-around text-center">
            <Medal emoji={MEDAL_EMOJI.gold} label="Gold" count={tally.gold} />
            <Medal emoji={MEDAL_EMOJI.silver} label="Silver" count={tally.silver} />
            <Medal emoji={MEDAL_EMOJI.bronze} label="Bronze" count={tally.bronze} />
          </div>
        </div>
      )}
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
          ★ Featured
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className={featured ? 'text-6xl' : 'text-5xl'}>{unlocked ? game.emoji : '🔒'}</div>
        <div className="flex-1 min-w-0">
          <div className={`font-display font-extrabold text-slate-900 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {game.name}
          </div>
          <div className="text-sm text-slate-600 mt-0.5">{game.tagline}</div>
          {!unlocked && (
            <div className="text-xs font-display font-bold text-amber-600 mt-2">
              Earn {need} more ⭐ to unlock
            </div>
          )}
        </div>
        {unlocked && (
          <div
            className="shrink-0 px-5 py-3 rounded-2xl text-white font-display font-extrabold shadow-sm"
            style={{ backgroundColor: game.accent }}
          >
            Play ▶
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

function Medal({ emoji, label, count }: { emoji: string; label: string; count: number }) {
  return (
    <div>
      <div className="text-3xl">{emoji}</div>
      <div className="text-xl font-display font-extrabold text-slate-900 tabular-nums">{count}</div>
      <div className="text-xs font-display font-bold text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
