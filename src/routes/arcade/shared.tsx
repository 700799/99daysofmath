import { createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '../../components/Mascot';
import { Confetti } from '../../components/Celebration';
import { StickerCelebration } from '../../components/StickerCelebration';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';

// Provided by the lesson gate (ArcadeWarmup). When present, an in-game "Play
// again" routes back through a fresh lesson rather than restarting in place.
export const ArcadeSessionContext = createContext<{ requestReplay: () => void } | null>(null);
export function useArcadeSession() {
  return useContext(ArcadeSessionContext);
}

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
  { id: 'hippo', path: '/arcade/hippo', emoji: '🦛', name: 'Hungry Hippo', blurb: 'Munch the maze. Dodge ghosts.', baseXp: 10, gradient: 'from-indigo-500 to-purple-600' },
  { id: 'frogger', path: '/arcade/frogger', emoji: '🐸', name: 'Leap Frog', blurb: 'Cross traffic and river.', baseXp: 10, gradient: 'from-green-500 to-emerald-600' },
  { id: 'digger', path: '/arcade/digger', emoji: '⛏️', name: 'Gem Digger', blurb: 'Dig for gems. Dodge monsters.', baseXp: 10, gradient: 'from-amber-600 to-yellow-700' },
  { id: 'tiles', path: '/arcade/2048', emoji: '🔢', name: '2048', blurb: 'Merge tiles to 2048.', baseXp: 10, gradient: 'from-yellow-500 to-amber-600' },
  { id: 'snake', path: '/arcade/snake', emoji: '🐍', name: 'Math Snake', blurb: 'Eat the right answer.', baseXp: 10, gradient: 'from-lime-500 to-green-700' },
];

export function ArcadeHeader({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3">
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
      <BalanceClock />
    </div>
  );
}

function fmtClock(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

// A small lifetime readout shown on every arcade screen (games + the lesson
// gate): time spent playing vs. learning, and the running lessons:games ratio,
// so the 50/50 balance is always visible.
export function BalanceClock() {
  const play = useProgress((s) => s.cumArcadeSeconds);
  const lesson = useProgress((s) => s.cumLessonSeconds);
  const ratio = play > 0 ? lesson / play : lesson > 0 ? Infinity : 0;
  const ratioLabel = play === 0 && lesson === 0 ? '—' : `${ratio.toFixed(1)} : 1`;
  const total = play + lesson;
  const lessonPct = total > 0 ? Math.round((lesson / total) * 100) : 50;
  return (
    <div className="mt-2 flex items-center gap-2 text-[11px] font-display font-bold text-slate-500">
      <span className="text-indigo-600">📘 {fmtClock(lesson)}</span>
      <div className="flex-1 h-1.5 rounded-full bg-emerald-200 overflow-hidden" title="lessons vs games">
        <div className="h-full bg-indigo-500" style={{ width: `${lessonPct}%` }} />
      </div>
      <span className="text-emerald-600">🎮 {fmtClock(play)}</span>
      <span className="tabular-nums text-slate-400">L:G {ratioLabel}</span>
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
  const session = useArcadeSession();
  const replay = session ? session.requestReplay : onReplay;
  const replayLabel = session ? '📚 Learn & play again' : 'Play again';
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
        onClick={replay}
        className="mt-5 w-full max-w-xs min-h-12 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
      >
        {replayLabel}
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
