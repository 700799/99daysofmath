import { createContext, useContext, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '../../components/Mascot';
import { Mascot as CharMascot, gameMascot } from './Mascots';
import { MilestoneQuiz } from './MilestoneQuiz';
import { Confetti } from '../../components/Celebration';
import { StickerCelebration } from '../../components/StickerCelebration';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Provided by the lesson gate (ArcadeWarmup). When present, an in-game "Play
// again" routes back through a fresh lesson rather than restarting in place, and
// `paused` is true while a mid-game math challenge overlay is showing.
export const ArcadeSessionContext = createContext<{
  requestReplay: () => void;
  paused?: boolean;
} | null>(null);
export function useArcadeSession() {
  return useContext(ArcadeSessionContext);
}

// Real-time/timed games read this ref at the top of their game loop to freeze
// while a mid-game challenge overlay is up. Returns a ref that always mirrors the
// current paused flag, so loops can check it without re-subscribing each frame.
export function useArcadePausedRef(): MutableRefObject<boolean> {
  const session = useArcadeSession();
  const ref = useRef(false);
  ref.current = !!session?.paused;
  return ref;
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
  { id: 'shootout', path: '/arcade/shootout', emoji: '💥', name: 'Angle Cannon', blurb: 'Aim the cannon by angle. Knock targets down!', baseXp: 5, gradient: 'from-orange-500 to-amber-600' },
  { id: 'runner', path: '/arcade/runner', emoji: '🏃', name: 'Math Runner', blurb: 'Right lane, right answer.', baseXp: 8, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'platformer', path: '/arcade/platformer', emoji: '🍄', name: 'Platformer', blurb: '8 levels. Stomp to the flag.', baseXp: 10, gradient: 'from-pink-500 to-rose-600' },
  { id: 'racer', path: '/arcade/racer', emoji: '🏎️', name: 'Race Car', blurb: 'Dodge cones. Grab fuel.', baseXp: 9, gradient: 'from-rose-500 to-orange-500' },
  { id: 'digger', path: '/arcade/digger', emoji: '⛏️', name: 'Gem Digger', blurb: 'Dig for gems. Dodge monsters.', baseXp: 10, gradient: 'from-amber-600 to-yellow-700' },
  { id: 'tiles', path: '/arcade/2048', emoji: '🔢', name: '2048', blurb: 'Merge tiles to 2048.', baseXp: 10, gradient: 'from-yellow-500 to-amber-600' },
  { id: 'snake', path: '/arcade/snake', emoji: '🐍', name: 'Math Snake', blurb: 'Eat the right answer.', baseXp: 10, gradient: 'from-lime-500 to-green-700' },
  { id: 'bricks', path: '/arcade/bricks', emoji: '🧱', name: 'Brick Breaker', blurb: 'Bounce and smash bricks.', baseXp: 10, gradient: 'from-violet-500 to-indigo-700' },
  { id: 'sudoku', path: '/arcade/sudoku', emoji: '🧩', name: 'Sudoku', blurb: 'Fill the 9×9 grid.', baseXp: 10, gradient: 'from-slate-500 to-slate-700' },
  { id: 'tetris', path: '/arcade/tetris', emoji: '👾', name: 'Alien Tetris', blurb: 'Stack & clear the aliens.', baseXp: 10, gradient: 'from-purple-500 to-fuchsia-700' },
  { id: 'boba', path: '/arcade/boba', emoji: '🧋', name: 'Boba Shop', blurb: 'Mix drinks by ratio.', baseXp: 10, gradient: 'from-pink-500 to-rose-600' },
  { id: 'sushi', path: '/arcade/sushi', emoji: '🍣', name: 'Sushi Match', blurb: 'Match 3 sushi.', baseXp: 10, gradient: 'from-red-500 to-pink-600' },
  { id: 'tictactoe', path: '/arcade/tictactoe', emoji: '🐕', name: 'Tic Tac Toe', blurb: 'Dogs vs cats. Bigger beats smaller.', baseXp: 8, gradient: 'from-amber-400 to-orange-500' },
  { id: 'kpop', path: '/arcade/kpop', emoji: '🎤', name: 'K-Pop Dress-Up', blurb: 'Memorize & match the look.', baseXp: 10, gradient: 'from-fuchsia-500 to-pink-600' },
  { id: 'survival', path: '/arcade/survival', emoji: '🏕️', name: 'Forest Survival', blurb: 'Last as many days as you can.', baseXp: 12, gradient: 'from-green-700 to-emerald-900' },
  { id: 'fruit', path: '/arcade/fruit', emoji: '🍉', name: 'Fruit Slice', blurb: 'Swipe to slice. Dodge bombs!', baseXp: 10, gradient: 'from-lime-500 to-red-500' },
  { id: 'town', path: '/arcade/town', emoji: '🏙️', name: 'Pocket Town', blurb: 'Build a city. Grow the tiers.', baseXp: 12, gradient: 'from-sky-500 to-emerald-600' },
  { id: 'sumo', path: '/arcade/sumo', emoji: '🛐', name: 'Sumo Math', blurb: 'Fast ×÷^ duel. Shove him out!', baseXp: 12, gradient: 'from-amber-500 to-rose-700' },
  { id: 'monster', path: '/arcade/monster', emoji: '🐲', name: 'Monster Rogue', blurb: 'Catch critters. Climb the gauntlet.', baseXp: 14, gradient: 'from-violet-500 to-indigo-800' },
  { id: 'turbo', path: '/arcade/racer2', emoji: '🏎️', name: 'Turbo Dash', blurb: 'Mode-7 racer. Beat the clock.', baseXp: 12, gradient: 'from-sky-500 to-indigo-700' },
  { id: 'wordle', path: '/arcade/wordle', emoji: '🟩', name: 'Word Guess', blurb: 'Crack the 5-letter word in 6 tries.', baseXp: 10, gradient: 'from-green-500 to-emerald-700' },
  { id: 'hero', path: '/arcade/hero', emoji: '🦸', name: 'Hero Rescue', blurb: 'Pull pins in the right order. Solve to act.', baseXp: 12, gradient: 'from-amber-500 to-rose-700' },
  { id: 'escape', path: '/arcade/escape', emoji: '🔐', name: 'Logic Escape', blurb: 'Crack the logic puzzles. Escape before time runs out!', baseXp: 12, gradient: 'from-slate-700 to-amber-700' },
  { id: 'tank', path: '/arcade/tank', emoji: '🎯', name: 'Tank Attack', blurb: 'Aim with angle + power. Blast the evil robots!', baseXp: 12, gradient: 'from-stone-600 to-emerald-800' },
  { id: 'rig', path: '/arcade/rig', emoji: '🛻', name: 'Desert Rig', blurb: 'Defend the War Rig! Solve fast to fire.', baseXp: 12, gradient: 'from-amber-600 to-orange-800' },
  { id: 'mathpop', path: '/arcade/mathpop', emoji: '🫧', name: 'Math Pop', blurb: 'Pop bubbles that add up to the target!', baseXp: 10, gradient: 'from-sky-500 to-cyan-600' },
  { id: 'dress', path: '/arcade/dress', emoji: '👗', name: 'Dress to Impress', blurb: 'Style the theme. Match the palette ratio. Walk the runway!', baseXp: 12, gradient: 'from-fuchsia-500 to-violet-600' },
  { id: 'taiko', path: '/arcade/taiko', emoji: '🥁', name: 'Taiko Tap', blurb: 'Tap the drum notes on the beat!', baseXp: 10, gradient: 'from-red-500 to-orange-600' },
  { id: 'shinobi', path: '/arcade/shinobi', emoji: '🥷', name: 'Shinobi Match', blurb: 'Match runes to fend off the foes.', baseXp: 12, gradient: 'from-slate-700 to-rose-700' },
  { id: 'speedlab', path: '/arcade/speedlab', emoji: '🚀', name: 'Speed Lab', blurb: 'Drive the d = r × t formula!', baseXp: 12, gradient: 'from-slate-800 to-cyan-700' },
  { id: 'fraction', path: '/arcade/fraction', emoji: '🍕', name: 'Fraction Pizzeria', blurb: 'Serve each pizza fraction!', baseXp: 10, gradient: 'from-amber-500 to-orange-600' },
];

// Premium games: locked until bought with coins in the Shop (id → coin price).
export const PREMIUM_GAMES: Record<string, number> = {
  tank: 120,
  dress: 120,
  hero: 100,
  turbo: 100,
};

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
  const earnRatio = useProgress((s) => s.arcadeConfig.earnRatio);
  const ratio = play > 0 ? lesson / play : lesson > 0 ? Infinity : 0;
  const ratioLabel = play === 0 && lesson === 0 ? '—' : `${ratio.toFixed(1)} : 1`;
  const total = play + lesson;
  const lessonPct = total > 0 ? Math.round((lesson / total) * 100) : 50;
  // Game time earned from lessons but not yet spent (when the time budget is on).
  const remaining = earnRatio > 0 ? Math.max(0, lesson * earnRatio - play) : null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2 text-[11px] font-display font-bold text-slate-500">
        <span className="text-indigo-600">📘 {fmtClock(lesson)}</span>
        <div className="flex-1 h-1.5 rounded-full bg-emerald-200 overflow-hidden" title="lessons vs games">
          <div className="h-full bg-indigo-500" style={{ width: `${lessonPct}%` }} />
        </div>
        <span className="text-emerald-600">🎮 {fmtClock(play)}</span>
        <span className="tabular-nums text-slate-400">L:G {ratioLabel}</span>
      </div>
      {remaining !== null && (
        <div className="text-[11px] font-display font-extrabold tabular-nums text-emerald-700">
          ⏳ Game time left: {fmtClock(remaining)}
        </div>
      )}
    </div>
  );
}

// Shared end-of-game card: score, XP breakdown (incl. half-XP repeats and
// variety bonuses), sticker celebration, replay + "try a different game" nudge.
// --- end-card reaction effects (pure SVG, app mascot style) ---
function Sparkle({ x, y, s, c = '#fff7cc' }: { x: number; y: number; s: number; c?: string }) {
  return (
    <path
      transform={`translate(${x},${y}) scale(${s})`}
      d="M0,-8 C1,-2 2,-1 8,0 C2,1 1,2 0,8 C-1,2 -2,1 -8,0 C-2,-1 -1,-2 0,-8 Z"
      fill={c}
      stroke="#f59e0b"
      strokeWidth={1}
    />
  );
}
function Shuriken({ x, y, r, rot }: { x: number; y: number; r: number; rot: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`}>
      <path
        d={`M0,-${r} L${r * 0.32},-${r * 0.32} L${r},0 L${r * 0.32},${r * 0.32} L0,${r} L-${r * 0.32},${r * 0.32} L-${r},0 L-${r * 0.32},-${r * 0.32} Z`}
        fill="#64748b"
        stroke="#1f2937"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <circle cx={0} cy={0} r={r * 0.18} fill="#1e293b" />
    </g>
  );
}
function ActionLines({ cx, cy, n, r0, r1, color, w }: { cx: number; cy: number; n: number; r0: number; r1: number; color: string; w: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r0}
            y1={cy + Math.sin(a) * r0}
            x2={cx + Math.cos(a) * r1}
            y2={cy + Math.sin(a) * r1}
            stroke={color}
            strokeWidth={w}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}
function TrophyIcon({ size = 54 }: { size?: number }) {
  return (
    <svg viewBox="0 0 88 60" width={size} height={(size * 60) / 88} style={{ overflow: 'visible' }} aria-hidden>
      <g stroke="#1f2937" strokeWidth={4} strokeLinejoin="round">
        <path d="M30 6 H58 V18 Q58 36 44 38 Q30 36 30 18 Z" fill="#fcd34d" />
        <path d="M30 10 Q18 10 20 20 Q22 27 31 26" fill="none" />
        <path d="M58 10 Q70 10 68 20 Q66 27 57 26" fill="none" />
        <rect x="39" y="38" width="10" height="8" fill="#f59e0b" />
        <rect x="30" y="46" width="28" height="7" rx="2" fill="#f59e0b" />
        <path d="M44 16 l1.6 3.4 3.8 .4 -2.8 2.6 .8 3.7 -3.4 -2 -3.4 2 .8 -3.7 -2.8 -2.6 3.8 -.4 Z" fill="#fff7cc" stroke="none" />
      </g>
    </svg>
  );
}

// Win/lose reaction scene over the score: action lines + sparkles/trophy (win)
// or red speed-lines + flying shuriken + a KO'd game mascot (lose).
function ReactionScene({ win, gameId }: { win: boolean; gameId: string }) {
  return (
    <div className="relative mx-auto" style={{ width: 240, height: 144 }}>
      <svg viewBox="0 0 240 144" className="absolute inset-0 h-full w-full" style={{ overflow: 'visible' }} aria-hidden>
        {win ? (
          <>
            <g opacity={0.5}><ActionLines cx={120} cy={66} n={28} r0={44} r1={150} color="#fcd34d" w={3} /></g>
            <Sparkle x={34} y={28} s={1.5} />
            <Sparkle x={206} y={40} s={1.8} />
            <Sparkle x={26} y={104} s={1.2} />
            <Sparkle x={212} y={108} s={1.4} />
          </>
        ) : (
          <>
            <g opacity={0.45}><ActionLines cx={120} cy={66} n={30} r0={40} r1={160} color="#fca5a5" w={3} /></g>
            <Shuriken x={36} y={28} r={12} rot={20} />
            <Shuriken x={202} y={24} r={9} rot={60} />
            <Shuriken x={24} y={108} r={10} rot={15} />
            <g stroke="#6366f1" strokeWidth={3} fill="none" opacity={0.6}>
              <path d="M150 24 q12 -8 20 2" />
              <path d="M198 92 q10 8 0 18" />
            </g>
          </>
        )}
      </svg>
      <div className="absolute inset-0 flex items-end justify-center gap-1">
        <Mascot mood={win ? 'cheer' : 'happy'} size={102} />
        <motion.div
          initial={{ scale: 0, rotate: win ? -12 : 18 }}
          animate={{ scale: 1, rotate: win ? 0 : 14 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 14 }}
        >
          <CharMascot kind={gameMascot(gameId)} size={86} expr={win ? 'cheer' : 'ko'} />
        </motion.div>
      </div>
      {win && (
        <motion.div
          className="absolute"
          style={{ right: 2, top: 2 }}
          initial={{ scale: 0, y: -8, rotate: -12 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 12 }}
        >
          <TrophyIcon size={52} />
        </motion.div>
      )}
    </div>
  );
}

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
  const [showStickers, setShowStickers] = useState(true);
  const [bonusDone, setBonusDone] = useState(false);
  // Central end-of-game sound + haptic so every game gets feedback.
  useEffect(() => {
    if (win) sfx.win();
    else sfx.lose();
    haptic(win ? HAPTIC.win : HAPTIC.death);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center relative"
    >
      {showStickers && outcome.earned.length > 0 && (
        <StickerCelebration stickerIds={outcome.earned} onDone={() => setShowStickers(false)} />
      )}
      {win && <Confetti count={24} />}
      <ReactionScene win={win} gameId={gameId} />
      <div className="-mt-1 flex justify-center">
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 13 }}
          className={`inline-block rounded-full px-5 py-1.5 font-display text-lg font-extrabold text-white shadow-[0_3px_0_0_rgba(0,0,0,0.15)] ${win ? 'bg-rose-500' : 'bg-indigo-700'}`}
        >
          {win ? 'WINNER!' : 'Try again!'}
        </motion.span>
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
      {!bonusDone && <MilestoneQuiz onDone={() => setBonusDone(true)} len="word" label="📖 Milestone story problem!" />}
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
