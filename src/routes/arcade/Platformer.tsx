import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Minimal 2D Mario-style platformer. Tile-based level, gravity + jump physics,
// Goomba enemies (stomp from above), math-coin questions, and a flag at the
// end. All-SVG/emoji rendering. ~45 s playthrough.

const TILE = 28;
const VIEW_W = 360;
const VIEW_H = 232;
const GRAVITY = 1400;
const JUMP_VY = -540;
const MOVE_SPEED = 170;
const ENEMY_SPEED = 50;

// Levels: . air, T ground/brick, P platform, G goomba spawn, C math-coin,
// F flagpole. Each row is 30 cols × 8 rows. Difficulty ramps with index:
// more enemies, longer pits, narrower platforms.
// prettier-ignore
const LEVELS: string[][] = [
  // Level 1 — easy intro, one pit, two goombas
  [
    '..............................',
    '..............................',
    '...........C.................F',
    '..............P.P.P..........F',
    '......C.................C....F',
    '..........TT........TT..PP...F',
    '........G............G.......F',
    'TTTTTTTTTTTTTT..TTTTTTTTTTTTTT',
  ],
  // Level 2 — narrower pit, three goombas
  [
    '..............................',
    '...........C..................',
    '.......P..........C..........F',
    '...........PP..PP.............F',
    '.....C.................C.....F',
    '....G......TT.....TTTT.G.....F',
    '..G..............G............',
    'TTTTTTT...TTTTT...TTTTTTTTTTTT',
  ],
  // Level 3 — two pits, more coins
  [
    '..............................',
    '.....C.........C........C....F',
    '..........P...........P......F',
    '....PP........PPP.............',
    '............C................F',
    '.......G..........G..........F',
    '.G..........G.................',
    'TTTTT..TTTTT...TTTTT...TTTTTTT',
  ],
  // Level 4 — floating platforms, sky path
  [
    '..............................',
    '..C........C...........C.....F',
    '...PPP....PP....PPP....PP....F',
    '..............................',
    '......C....C....C....C......F',
    '.....PP...PP...PP...PP........',
    '..G....G....G....G....G......F',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],
  // Level 5 — wide pit, you have to jump precisely
  [
    '..............................',
    '...........C..................',
    '.....P............P..........F',
    '.........C...........C......F',
    '............PP........PP....F',
    '...G..G.................G...F',
    'G.......G............G.G....F',
    'TTTTTT......TTTT......TTTTTTT',
  ],
  // Level 6 — many enemies
  [
    '...............C..............',
    '...........P............P....F',
    '.....C........C.....C.........',
    '....PP....PP....PP....PP.....F',
    '..G..G..G..G..G..G..G..G..G..',
    '...G..G..G..G..G..G..G..G....',
    '..............................',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],
  // Level 7 — coins galore + two pits + goombas
  [
    '..C..C..C..C..C..C..C..C..C..',
    '.PP..PP..PP..PP..PP..PP..PP..F',
    '..............................',
    '.....C............C..........F',
    '......PPP..........PPP........',
    '..G......G......G......G....F',
    'G............G.............G.',
    'TTTT...TTTTTT....TTTTT..TTTTT',
  ],
  // Level 8 — boss-ish: three pits, lots of enemies, narrow platforms
  [
    '..C..........C..........C....F',
    'P............P............PP.F',
    '.....C............C..........F',
    '....PP............PP..........',
    '....G..G......G..G......G....F',
    'G..G..G..G..G..G..G..G..G..G..',
    '..............................',
    'TTT..TTT..TTT...TTT..TTT.TTTTT',
  ],
];

export const PLATFORMER_LEVEL_COUNT = LEVELS.length;

type Vec = { x: number; y: number };
type Player = Vec & { vx: number; vy: number; onGround: boolean; invuln: number };
type Enemy = Vec & { vx: number; alive: boolean };
type Coin = Vec & { id: number; collected: boolean; question: string; correct: number; choices: number[] };

function makeMathCoin(id: number, x: number, y: number): Coin {
  const a = 2 + Math.floor(Math.random() * 9);
  const b = 2 + Math.floor(Math.random() * 9);
  const correct = a * b;
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const drift = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 7));
    const w = correct + drift;
    if (w !== correct && w > 0) wrongs.add(w);
  }
  const choices = [correct, ...Array.from(wrongs)];
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  return { id, x, y, collected: false, question: `${a} × ${b}`, correct, choices };
}

// Parse level once at module load — every game session uses fresh copies.
function buildLevel(idx: number): {
  walls: { x: number; y: number; w: number; h: number }[];
  enemySpawns: Vec[];
  coinSpawns: Vec[];
  flagX: number;
  levelW: number;
} {
  const LEVEL = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, idx))];
  const levelW = LEVEL[0].length * TILE;
  const walls: { x: number; y: number; w: number; h: number }[] = [];
  const enemySpawns: Vec[] = [];
  const coinSpawns: Vec[] = [];
  let flagX = levelW;
  for (let row = 0; row < LEVEL.length; row++) {
    for (let col = 0; col < LEVEL[row].length; col++) {
      const ch = LEVEL[row][col];
      const x = col * TILE;
      const y = row * TILE;
      if (ch === 'T' || ch === 'P') walls.push({ x, y, w: TILE, h: TILE });
      if (ch === 'G') enemySpawns.push({ x, y: y - 4 });
      if (ch === 'C') coinSpawns.push({ x, y });
      if (ch === 'F') flagX = Math.min(flagX, x);
    }
  }
  return { walls, enemySpawns, coinSpawns, flagX, levelW };
}

export function Platformer() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const setPlatformerMaxLevel = useProgress((s) => s.setPlatformerMaxLevel);
  const platformerMaxLevel = useProgress((s) => s.platformerMaxLevel ?? 0);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLevel = (() => {
    const fromUrl = parseInt(searchParams.get('level') || '', 10);
    if (Number.isFinite(fromUrl) && fromUrl >= 0 && fromUrl < LEVELS.length) return fromUrl;
    return Math.min(platformerMaxLevel, LEVELS.length - 1);
  })();
  const [levelIdx, setLevelIdx] = useState(initialLevel);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const level = useRef(buildLevel(levelIdx));
  const playerRef = useRef<Player>({ x: TILE, y: TILE * 5, vx: 0, vy: 0, onGround: false, invuln: 0 });
  const enemiesRef = useRef<Enemy[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const livesRef = useRef(3);
  const cameraRef = useRef(0);
  const inputRef = useRef({ left: false, right: false, jump: false });
  const stompXpRef = useRef(0);
  const correctCoinXpRef = useRef(0);
  const reachedFlagRef = useRef(false);
  const pausedQuestionRef = useRef<Coin | null>(null);
  const rafRef = useRef(0);
  const lastTickRef = useRef(performance.now());

  const [pendingQuestion, setPendingQuestion] = useState<Coin | null>(null);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  // Reset level objects on mount / replay.
  const initWorld = () => {
    const lv = level.current;
    playerRef.current = { x: TILE, y: TILE * 5, vx: 0, vy: 0, onGround: false, invuln: 0 };
    enemiesRef.current = lv.enemySpawns.map((s) => ({ ...s, vx: -ENEMY_SPEED, alive: true }));
    coinsRef.current = lv.coinSpawns.map((s, i) => makeMathCoin(i, s.x, s.y));
    livesRef.current = 3;
    cameraRef.current = 0;
    stompXpRef.current = 0;
    correctCoinXpRef.current = 0;
    reachedFlagRef.current = false;
    pausedQuestionRef.current = null;
    setPendingQuestion(null);
    setOutcome(null);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => initWorld(), []);

  // Input
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') inputRef.current.jump = true;
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') inputRef.current.jump = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Main loop
  useEffect(() => {
    if (outcome) return;
    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      if (pausedQuestionRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const p = playerRef.current;
      const input = inputRef.current;

      // Horizontal velocity
      p.vx = (input.left ? -MOVE_SPEED : 0) + (input.right ? MOVE_SPEED : 0);
      // Jump
      if (input.jump && p.onGround) {
        p.vy = JUMP_VY;
        p.onGround = false;
      }
      // Gravity
      p.vy += GRAVITY * dt;

      // Integrate + collide
      p.x += p.vx * dt;
      // Horizontal collision
      for (const w of level.current.walls) {
        if (rectOverlap(p.x, p.y, 18, 22, w.x, w.y, w.w, w.h)) {
          if (p.vx > 0) p.x = w.x - 18;
          else if (p.vx < 0) p.x = w.x + w.w;
          p.vx = 0;
        }
      }
      p.y += p.vy * dt;
      p.onGround = false;
      for (const w of level.current.walls) {
        if (rectOverlap(p.x, p.y, 18, 22, w.x, w.y, w.w, w.h)) {
          if (p.vy > 0) {
            p.y = w.y - 22;
            p.vy = 0;
            p.onGround = true;
          } else if (p.vy < 0) {
            p.y = w.y + w.h;
            p.vy = 0;
          }
        }
      }
      // Bounds: don't fall through bottom; pit kills.
      if (p.y > VIEW_H + 32) {
        livesRef.current -= 1;
        if (livesRef.current <= 0) {
          finish();
          return;
        }
        playerRef.current = { x: TILE, y: TILE * 5, vx: 0, vy: 0, onGround: false, invuln: 1.0 };
      }
      if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);

      // Enemies
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        e.x += e.vx * dt;
        // Reverse at walls (lazy: turn on touching a wall).
        for (const w of level.current.walls) {
          if (rectOverlap(e.x, e.y, 22, 22, w.x, w.y, w.w, w.h)) {
            if (e.vx > 0) e.x = w.x - 22;
            else if (e.vx < 0) e.x = w.x + w.w;
            e.vx = -e.vx;
          }
        }
        // Collide with player
        if (rectOverlap(p.x, p.y, 18, 22, e.x, e.y, 22, 22)) {
          if (p.vy > 80) {
            // Stomp
            e.alive = false;
            p.vy = JUMP_VY * 0.7;
            stompXpRef.current += 1;
          } else if (p.invuln <= 0) {
            livesRef.current -= 1;
            p.invuln = 1.2;
            p.vy = JUMP_VY * 0.4;
            if (livesRef.current <= 0) {
              finish();
              return;
            }
          }
        }
      }

      // Math coins
      for (const c of coinsRef.current) {
        if (c.collected) continue;
        if (rectOverlap(p.x, p.y, 18, 22, c.x, c.y, 22, 22)) {
          c.collected = true;
          pausedQuestionRef.current = c;
          setPendingQuestion(c);
        }
      }

      // Flag
      if (p.x >= level.current.flagX) {
        reachedFlagRef.current = true;
        finish();
        return;
      }

      // Camera: follow player, clamp to level.
      const target = p.x - VIEW_W * 0.35;
      cameraRef.current = Math.max(0, Math.min(target, level.current.levelW - VIEW_W));

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const finish = () => {
    const reach = reachedFlagRef.current ? 10 + levelIdx * 2 : 0;
    const xp = Math.max(
      1,
      livesRef.current * 3 + stompXpRef.current + correctCoinXpRef.current * 2 + reach,
    );
    if (reachedFlagRef.current && levelIdx >= platformerMaxLevel) {
      setPlatformerMaxLevel(Math.min(LEVELS.length - 1, levelIdx + 1));
    }
    setOutcome(recordArcadePlay('platformer', xp));
  };

  const advanceLevel = () => {
    const next = levelIdx + 1;
    if (next >= LEVELS.length) return;
    setLevelIdx(next);
    level.current = buildLevel(next);
    setSearchParams({ level: String(next) }, { replace: true });
    initWorld();
  };

  const restartLevel = () => {
    level.current = buildLevel(levelIdx);
    initWorld();
  };

  const answerCoin = (coin: Coin, pick: number) => {
    if (pick === coin.correct) correctCoinXpRef.current += 1;
    pausedQuestionRef.current = null;
    setPendingQuestion(null);
  };

  if (outcome) {
    const hasNext = reachedFlagRef.current && levelIdx + 1 < LEVELS.length;
    return (
      <div>
        <ArcadeHeader title={`Math Platformer · Level ${levelIdx + 1}`} emoji="🍄" />
        <ArcadeEndCard
          gameId="platformer"
          outcome={outcome}
          win={reachedFlagRef.current}
          scoreLine={
            reachedFlagRef.current
              ? `Level ${levelIdx + 1} cleared! 🚩  ${livesRef.current}❤️ left · ${stompXpRef.current} stomps`
              : `Game over on level ${levelIdx + 1} — ${stompXpRef.current} stomps`
          }
          onReplay={restartLevel}
        />
        {hasNext && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={advanceLevel}
              className="inline-flex items-center gap-2 rounded-full bg-duo-green hover:bg-green-600 text-white font-display font-extrabold text-lg px-6 h-12 shadow-lg active:translate-y-0.5 transition"
            >
              Level {levelIdx + 2} →
            </button>
          </div>
        )}
        {reachedFlagRef.current && !hasNext && (
          <div className="mt-3 text-center text-sm font-display font-extrabold text-amber-700">
            🏆 You beat every level!
          </div>
        )}
      </div>
    );
  }

  const p = playerRef.current;
  const cam = cameraRef.current;

  return (
    <div>
      <ArcadeHeader title={`Math Platformer · Level ${levelIdx + 1} of ${LEVELS.length}`} emoji="🍄" />
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-display font-extrabold text-slate-900">
          {'❤️'.repeat(livesRef.current)}
          {'🤍'.repeat(Math.max(0, 3 - livesRef.current))}
        </div>
        <div className="text-sm font-display font-bold text-slate-600 tabular-nums">
          👟 {stompXpRef.current} · 🪙 {correctCoinXpRef.current}
        </div>
      </div>

      <div
        className="relative mx-auto rounded-2xl bg-gradient-to-b from-sky-300 to-sky-100 border-2 border-slate-200 overflow-hidden select-none"
        style={{ width: '100%', maxWidth: VIEW_W, height: VIEW_H }}
      >
        {/* Walls */}
        {level.current.walls.map((w, i) => (
          <div
            key={i}
            className="absolute bg-amber-700 border border-amber-900"
            style={{ left: w.x - cam, top: w.y, width: w.w, height: w.h }}
          />
        ))}
        {/* Flag */}
        <div
          className="absolute text-3xl"
          style={{ left: level.current.flagX - cam - 6, top: VIEW_H - TILE - 32 }}
        >
          🚩
        </div>
        {/* Coins */}
        {coinsRef.current
          .filter((c) => !c.collected)
          .map((c) => (
            <div
              key={c.id}
              className="absolute text-xl animate-pulse"
              style={{ left: c.x - cam, top: c.y }}
            >
              🪙
            </div>
          ))}
        {/* Enemies */}
        {enemiesRef.current
          .filter((e) => e.alive)
          .map((e, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{ left: e.x - cam, top: e.y - 2 }}
            >
              👾
            </div>
          ))}
        {/* Player */}
        <div
          className="absolute text-2xl"
          style={{
            left: p.x - cam,
            top: p.y - 4,
            opacity: p.invuln > 0 ? 0.5 : 1,
          }}
        >
          🍄
        </div>
      </div>

      {/* Controls (touch) */}
      <div className="mt-3 max-w-sm mx-auto grid grid-cols-3 gap-2">
        <button
          type="button"
          onTouchStart={() => (inputRef.current.left = true)}
          onTouchEnd={() => (inputRef.current.left = false)}
          onMouseDown={() => (inputRef.current.left = true)}
          onMouseUp={() => (inputRef.current.left = false)}
          onMouseLeave={() => (inputRef.current.left = false)}
          className="min-h-14 rounded-2xl bg-white border-2 border-slate-200 text-2xl font-display font-extrabold"
        >
          ←
        </button>
        <button
          type="button"
          onTouchStart={() => (inputRef.current.jump = true)}
          onTouchEnd={() => (inputRef.current.jump = false)}
          onMouseDown={() => (inputRef.current.jump = true)}
          onMouseUp={() => (inputRef.current.jump = false)}
          onMouseLeave={() => (inputRef.current.jump = false)}
          className="min-h-14 rounded-2xl bg-pink-500 text-white text-lg font-display font-extrabold"
        >
          JUMP
        </button>
        <button
          type="button"
          onTouchStart={() => (inputRef.current.right = true)}
          onTouchEnd={() => (inputRef.current.right = false)}
          onMouseDown={() => (inputRef.current.right = true)}
          onMouseUp={() => (inputRef.current.right = false)}
          onMouseLeave={() => (inputRef.current.right = false)}
          className="min-h-14 rounded-2xl bg-white border-2 border-slate-200 text-2xl font-display font-extrabold"
        >
          →
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Stomp 👾 from above, grab 🪙 for a math question, reach the 🚩.
      </p>

      {pendingQuestion && (
        <CoinQuestion coin={pendingQuestion} onAnswer={answerCoin} />
      )}
    </div>
  );
}

function CoinQuestion({ coin, onAnswer }: { coin: Coin; onAnswer: (coin: Coin, pick: number) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 max-w-sm w-full mx-4">
        <div className="text-center text-3xl">🪙</div>
        <div className="mt-2 text-center text-2xl font-display font-extrabold text-slate-900">
          {coin.question} = ?
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {coin.choices.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onAnswer(coin, c)}
              className="min-h-12 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-display font-extrabold text-lg"
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-center text-[11px] text-slate-500 mt-3">
          Correct = +2 XP. Wrong = no penalty, no bonus.
        </p>
      </div>
    </div>
  );
}

function rectOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
