import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Math Snake — steer the snake to eat the food labelled with the correct
// answer to the shown problem. Right answer = grow + score; a wrong answer, a
// wall, or biting yourself costs a life. Speeds up as you grow.

const COLS = 17;
const ROWS = 13;
const TILE = 20;
const W = COLS * TILE;
const H = ROWS * TILE;

type Cell = { c: number; r: number };
type Food = Cell & { val: number; correct: boolean };
type Dir = { dx: number; dy: number };
const UP: Dir = { dx: 0, dy: -1 };
const DOWN: Dir = { dx: 0, dy: 1 };
const LEFT: Dir = { dx: -1, dy: 0 };
const RIGHT: Dir = { dx: 1, dy: 0 };

function makeProblem(): { text: string; answer: number } {
  const op = ['+', '−', '×'][Math.floor(Math.random() * 3)];
  let a = 0,
    b = 0,
    answer = 0;
  if (op === '+') {
    a = 5 + Math.floor(Math.random() * 30);
    b = 5 + Math.floor(Math.random() * 30);
    answer = a + b;
  } else if (op === '−') {
    a = 20 + Math.floor(Math.random() * 40);
    b = 5 + Math.floor(Math.random() * (a - 5));
    answer = a - b;
  } else {
    a = 3 + Math.floor(Math.random() * 9);
    b = 3 + Math.floor(Math.random() * 9);
    answer = a * b;
  }
  return { text: `${a} ${op} ${b}`, answer };
}

export function Snake() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const snakeRef = useRef<Cell[]>([]);
  const dirRef = useRef<Dir>(RIGHT);
  const nextDirRef = useRef<Dir>(RIGHT);
  const foodsRef = useRef<Food[]>([]);
  const problemRef = useRef(makeProblem());
  const scoreRef = useRef(0);
  const eatenRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const level = () => config.startLevel + Math.floor(eatenRef.current / 5);
  const stepInterval = () => Math.max(0.08, 0.22 - snakeRef.current.length * 0.004 - level() * 0.01);

  const occupied = (c: number, r: number) =>
    snakeRef.current.some((s) => s.c === c && s.r === r);

  const placeFoods = () => {
    const prob = makeProblem();
    problemRef.current = prob;
    const wrongs = new Set<number>();
    while (wrongs.size < 2) {
      const drift = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 4));
      const w = prob.answer + drift;
      if (w !== prob.answer && w > 0) wrongs.add(w);
    }
    const vals: { val: number; correct: boolean }[] = [
      { val: prob.answer, correct: true },
      ...Array.from(wrongs).map((val) => ({ val, correct: false })),
    ];
    const foods: Food[] = [];
    for (const v of vals) {
      let c = 0,
        r = 0,
        tries = 0;
      do {
        c = Math.floor(Math.random() * COLS);
        r = Math.floor(Math.random() * ROWS);
        tries++;
      } while ((occupied(c, r) || foods.some((f) => f.c === c && f.r === r)) && tries < 50);
      foods.push({ c, r, ...v });
    }
    foodsRef.current = foods;
  };

  const resetSnake = () => {
    const cx = Math.floor(COLS / 2);
    const cy = Math.floor(ROWS / 2);
    snakeRef.current = [
      { c: cx, r: cy },
      { c: cx - 1, r: cy },
      { c: cx - 2, r: cy },
    ];
    dirRef.current = RIGHT;
    nextDirRef.current = RIGHT;
  };

  const startRef = useRef(false);
  if (!startRef.current) {
    startRef.current = true;
    resetSnake();
    placeFoods();
  }

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    sfx.lose();
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 30) + 1));
    setOutcome(recordArcadePlay('snake', xp));
  };

  const loseLife = () => {
    livesRef.current -= 1;
    sfx.hurt(); buzz(HAPTIC.death);
    if (livesRef.current <= 0) {
      finish();
      return false;
    }
    resetSnake();
    placeFoods();
    return true;
  };

  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();
    const step = () => {
      const d = nextDirRef.current;
      // prevent reversing
      const cur = dirRef.current;
      if (!(d.dx === -cur.dx && d.dy === -cur.dy)) dirRef.current = d;
      const dir = dirRef.current;
      const head = snakeRef.current[0];
      const nh = { c: head.c + dir.dx, r: head.r + dir.dy };
      if (nh.c < 0 || nh.c >= COLS || nh.r < 0 || nh.r >= ROWS || occupied(nh.c, nh.r)) {
        loseLife();
        return;
      }
      const fi = foodsRef.current.findIndex((f) => f.c === nh.c && f.r === nh.r);
      if (fi >= 0) {
        const f = foodsRef.current[fi];
        if (f.correct) {
          snakeRef.current.unshift(nh); // grow
          scoreRef.current += 10;
          eatenRef.current += 1;
          sfx.coin(); buzz(HAPTIC.pickup);
          placeFoods();
        } else {
          loseLife(); // wrong answer
        }
      } else {
        snakeRef.current.unshift(nh);
        snakeRef.current.pop();
      }
    };
    const tick = (now: number) => {
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      accRef.current += dt;
      let guard = 0;
      while (accRef.current >= stepInterval() && guard++ < 4) {
        accRef.current -= stepInterval();
        step();
        if (doneRef.current) return; // game over mid-step → stop the loop
      }
      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      let d: Dir | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w') d = UP;
      else if (e.key === 'ArrowDown' || e.key === 's') d = DOWN;
      else if (e.key === 'ArrowLeft' || e.key === 'a') d = LEFT;
      else if (e.key === 'ArrowRight' || e.key === 'd') d = RIGHT;
      if (d) {
        e.preventDefault();
        nextDirRef.current = d;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const reset = () => {
    scoreRef.current = 0;
    eatenRef.current = 0;
    livesRef.current = config.livesPerSession;
    accRef.current = 0;
    doneRef.current = false;
    resetSnake();
    placeFoods();
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Math Snake" emoji="🐍" />
        <ArcadeEndCard
          gameId="snake"
          outcome={outcome}
          win={eatenRef.current >= 10}
          scoreLine={`${scoreRef.current} points · ${eatenRef.current} eaten`}
          onReplay={reset}
        />
      </div>
    );
  }

  const snake = snakeRef.current;

  return (
    <div>
      <ArcadeHeader title="Math Snake" emoji="🐍" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-emerald-700">Eat: <b>{problemRef.current.text}</b></span>
      </div>

      <GameStage theme="snake" className="max-w-sm mx-auto p-2">
      <div
        className="relative mx-auto rounded-xl bg-emerald-950/90 overflow-hidden"
        style={{ width: '100%', aspectRatio: `${W} / ${H}` }}
      >
        <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
          {foodsRef.current.map((f, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center font-display font-extrabold text-slate-900"
              style={{ left: f.c * TILE, top: f.r * TILE, width: TILE, height: TILE, fontSize: TILE - 5 }}
            >
              <span className="absolute" aria-hidden>🍰</span>
              <span className="relative text-white" style={{ fontSize: 11, textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>{f.val}</span>
            </div>
          ))}
          {snake.map((s, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                left: s.c * TILE,
                top: s.r * TILE,
                width: TILE,
                height: TILE,
                fontSize: TILE - 3,
                zIndex: i === 0 ? 2 : 1,
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))',
              }}
            >
              {i === 0 ? '🐷' : '🐖'}
            </div>
          ))}
        </div>
      </div>
      </GameStage>

      <div className="mt-3 grid grid-cols-3 gap-1.5 w-44 mx-auto select-none">
        <span />
        <Pad label="↑" onPress={() => (nextDirRef.current = UP)} />
        <span />
        <Pad label="←" onPress={() => (nextDirRef.current = LEFT)} />
        <Pad label="↓" onPress={() => (nextDirRef.current = DOWN)} />
        <Pad label="→" onPress={() => (nextDirRef.current = RIGHT)} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Eat the food with the right answer. Avoid walls, yourself, and wrong answers!
      </p>
    </div>
  );
}

function Pad({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      onTouchStart={(e) => {
        e.preventDefault();
        onPress();
      }}
      onMouseDown={onPress}
      className="min-h-11 rounded-xl bg-white border-2 border-slate-200 text-xl font-display font-extrabold text-slate-700 active:bg-slate-100"
    >
      {label}
    </button>
  );
}
