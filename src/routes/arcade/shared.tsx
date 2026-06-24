import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '../../components/Mascot';
import { Confetti } from '../../components/Celebration';
import { StickerCelebration } from '../../components/StickerCelebration';
import type { ArcadePlayOutcome } from '../../state/progress';

export interface ArcadeGameDef {
  id: string;
  path: string;
  emoji: string;
  name: string;
  blurb: string;
  baseXp: number;
  gradient: string; // tailwind gradient classes for the tile
}

export const ARCADE_GAMES: ArcadeGameDef[] = [
  { id: 'connect4', path: '/arcade/connect4', emoji: '🔴', name: 'Connect 4', blurb: 'Beat the owl.', baseXp: 5, gradient: 'from-red-500 to-rose-600' },
  { id: 'wheel', path: '/arcade/wheel', emoji: '🎡', name: 'Prize Wheel', blurb: 'One spin a day.', baseXp: 0, gradient: 'from-fuchsia-500 to-purple-600' },
  { id: 'memory', path: '/arcade/memory', emoji: '🃏', name: 'Memory', blurb: 'Match all 8 pairs.', baseXp: 8, gradient: 'from-sky-500 to-blue-600' },
  { id: 'shootout', path: '/arcade/shootout', emoji: '🏀', name: 'Shootout', blurb: 'Score 8 baskets in 30s.', baseXp: 5, gradient: 'from-orange-500 to-amber-600' },
  { id: 'zapper', path: '/arcade/zapper', emoji: '🧟', name: 'Zapper', blurb: 'Tap the zombies!', baseXp: 6, gradient: 'from-lime-500 to-green-600' },
  { id: 'fishing', path: '/arcade/fishing', emoji: '🎣', name: 'Fishing', blurb: 'Drop the hook.', baseXp: 6, gradient: 'from-cyan-500 to-teal-600' },
  { id: 'runner', path: '/arcade/runner', emoji: '🏃', name: 'Math Runner', blurb: 'Right lane, right answer.', baseXp: 8, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'platformer', path: '/arcade/platformer', emoji: '🍄', name: 'Platformer', blurb: '8 levels. Stomp to the flag.', baseXp: 10, gradient: 'from-pink-500 to-rose-600' },
  { id: 'racer', path: '/arcade/racer', emoji: '🏎️', name: 'Race Car', blurb: 'Dodge cones. Grab fuel.', baseXp: 9, gradient: 'from-rose-500 to-orange-500' },
  { id: 'tictactoe', path: '/arcade/tictactoe', emoji: '🐕', name: 'Tic Tac Toe', blurb: 'Dogs vs cats. Bigger beats smaller.', baseXp: 8, gradient: 'from-amber-400 to-orange-500' },
];

export function ArcadeHeader({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h1 className="text-xl font-display font-extrabold text-slate-900">
        {emoji} {title}
      </h1>
      <Link
        to="/arcade"
        className="text-sm font-display font-bold text-slate-500 hover:text-slate-700"
      >
        ← Arcade
      </Link>
    </div>
  );
}

// Shared end-of-game card: score, XP breakdown (incl. half-XP repeats and
// variety bonuses), sticker celebration, replay + "try a different game" nudge.
export function ArcadeEndCard({
  outcome,
  scoreLine,
  win,
  onReplay,
  gameId,
}: {
  outcome: ArcadePlayOutcome;
  scoreLine: string;
  win: boolean;
  onReplay: () => void;
  gameId: string;
}) {
  const others = ARCADE_GAMES.filter((g) => g.id !== gameId).slice(0, 3);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center relative"
    >
      {outcome.earned.length > 0 && (
        <StickerCelebration stickerIds={outcome.earned} onDone={() => {}} />
      )}
      {win && <Confetti count={24} />}
      <div className="flex justify-center">
        <Mascot mood={win ? 'cheer' : 'happy'} size={110} />
      </div>
      <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-2">
        {scoreLine}
      </h2>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-900 font-display font-extrabold text-sm px-3 py-1.5 rounded-full">
          ⚡ +{outcome.xpAwarded} XP{outcome.repeatToday ? ' (repeat — half)' : ''}
        </span>
        {outcome.varietyBonus > 0 && (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 font-display font-extrabold text-sm px-3 py-1.5 rounded-full">
            🎪 Variety bonus +{outcome.varietyBonus} XP
          </span>
        )}
      </div>
      {outcome.repeatToday && (
        <p className="text-xs text-slate-500 mt-2">
          Tip: a game you haven't played today pays full XP!
        </p>
      )}
      <button
        type="button"
        onClick={onReplay}
        className="mt-5 w-full max-w-xs min-h-12 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
      >
        Play again
      </button>
      <div className="mt-4">
        <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Or try a different game for full XP
        </div>
        <div className="flex justify-center gap-2">
          {others.map((g) => (
            <Link
              key={g.id}
              to={g.path}
              className="min-h-11 inline-flex items-center gap-1.5 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-full px-3 py-1.5 font-display font-bold text-sm text-slate-800"
            >
              {g.emoji} {g.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
