import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Bubble Pop — a number bubble shooter. Aim with the sweeping arrow, tap to
// fire; land 3+ of the same number together to pop them. Clear the board to
// win; let bubbles reach the bottom and you lose a life.

const COLS = 7;
const ROWS = 11;
const TILE = 42;
const W = COLS * TILE;
const H = ROWS * TILE;
const PALETTE = 5; // numbers 1..5
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7'];

const AIM_MIN = -150;
const AIM_MAX = -30;
const SWEEP = 90; // deg/sec

export function BubblePop() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const gridRef = useRef<number[][]>([]);
  const nextRef = useRef(1);
  const angleRef = useRef(AIM_MIN);
  const dirRef = useRef(1);
  const scoreRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const buildGrid = () => {
    const g: number[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
    const startRows = 3 + Math.min(3, config.startLevel - 1);
    for (let r = 0; r < startRows; r++)
      for (let c = 0; c < COLS; c++) g[r][c] = 1 + Math.floor(Math.random() * PALETTE);
    gridRef.current = g;
  };

  const presentNumbers = (): number[] => {
    const set = new Set<number>();
    for (const row of gridRef.current) for (const v of row) if (v) set.add(v);
    return [...set];
  };
  const pickNext = () => {
    const present = presentNumbers();
    nextRef.current = present.length
      ? present[Math.floor(Math.random() * present.length)]
      : 1 + Math.floor(Math.random() * PALETTE);
  };

  const startRef = useRef(false);
  if (!startRef.current) {
    startRef.current = true;
    buildGrid();
    pickNext();
  }

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 40) + 1));
    setOutcome(recordArcadePlay('bubbles', xp));
  };

  // arrow sweep
  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();
    const loop = (now: number) => {
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      let a = angleRef.current + dirRef.current * SWEEP * dt;
      if (a >= AIM_MAX) {
        a = AIM_MAX;
        dirRef.current = -1;
      } else if (a <= AIM_MIN) {
        a = AIM_MIN;
        dirRef.current = 1;
      }
      angleRef.current = a;
      redraw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const floodSame = (sr: number, sc: number, val: number): [number, number][] => {
    const seen = new Set<string>();
    const out: [number, number][] = [];
    const stack: [number, number][] = [[sr, sc]];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
      const k = `${r},${c}`;
      if (seen.has(k)) continue;
      if (gridRef.current[r][c] !== val) continue;
      seen.add(k);
      out.push([r, c]);
      stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
    }
    return out;
  };

  const shoot = () => {
    if (outcome) return;
    const rad = (angleRef.current * Math.PI) / 180;
    let x = W / 2;
    let y = H;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);
    let lastEmpty: [number, number] | null = null;
    for (let step = 0; step < 2000; step++) {
      x += dx * 3;
      y += dy * 3;
      if (x < TILE / 2) {
        x = TILE / 2;
      } // clamp to walls (no bounce for predictability)
      if (x > W - TILE / 2) {
        x = W - TILE / 2;
      }
      const c = Math.max(0, Math.min(COLS - 1, Math.floor(x / TILE)));
      const r = Math.floor(y / TILE);
      if (r < 0) {
        if (lastEmpty) break;
        lastEmpty = [0, c];
        break;
      }
      if (r < ROWS && gridRef.current[r][c]) {
        break; // hit a bubble — settle at lastEmpty
      }
      if (r >= 0 && r < ROWS) lastEmpty = [r, c];
      if (y < 0) break;
    }
    if (!lastEmpty) {
      pickNext();
      return;
    }
    const [pr, pc] = lastEmpty;
    const val = nextRef.current;
    gridRef.current[pr][pc] = val;
    const group = floodSame(pr, pc, val);
    if (group.length >= 3) {
      for (const [r, c] of group) gridRef.current[r][c] = 0;
      scoreRef.current += group.length * 10;
    }
    // lose a life if anything reached the bottom row
    if (gridRef.current[ROWS - 1].some((v) => v)) {
      livesRef.current -= 1;
      if (livesRef.current <= 0) {
        finish();
        return;
      }
      buildGrid();
    }
    // win if cleared
    if (gridRef.current.every((row) => row.every((v) => !v))) {
      scoreRef.current += 100;
      finish();
      return;
    }
    pickNext();
    redraw();
  };

  const reset = () => {
    scoreRef.current = 0;
    livesRef.current = config.livesPerSession;
    doneRef.current = false;
    buildGrid();
    pickNext();
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Bubble Pop" emoji="🫧" />
        <ArcadeEndCard
          gameId="bubbles"
          outcome={outcome}
          win={gridRef.current.every((row) => row.every((v) => !v))}
          scoreLine={`${scoreRef.current} points`}
          onReplay={reset}
        />
      </div>
    );
  }

  const grid = gridRef.current;

  return (
    <div>
      <ArcadeHeader title="Bubble Pop" emoji="🫧" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-slate-600">Next:
          <span
            className="ml-1 inline-flex items-center justify-center rounded-full text-white"
            style={{ width: 22, height: 22, background: COLORS[(nextRef.current - 1) % COLORS.length] }}
          >
            {nextRef.current}
          </span>
        </span>
      </div>

      <GameStage theme="bubbles" className="max-w-sm mx-auto p-2">
      <div
        className="relative mx-auto rounded-xl bg-slate-800/85 overflow-hidden"
        style={{ width: '100%', aspectRatio: `${W} / ${H}` }}
      >
        <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
          {grid.flatMap((row, r) =>
            row.map((v, c) =>
              v ? (
                <div
                  key={`${r}-${c}`}
                  className="absolute rounded-full flex items-center justify-center text-white font-display font-extrabold"
                  style={{
                    left: c * TILE + 3,
                    top: r * TILE + 3,
                    width: TILE - 6,
                    height: TILE - 6,
                    background: COLORS[(v - 1) % COLORS.length],
                    fontSize: 16,
                  }}
                >
                  {v}
                </div>
              ) : null,
            ),
          )}
          {/* aim arrow */}
          <div
            className="absolute"
            style={{
              left: W / 2,
              top: H - 6,
              transform: `rotate(${angleRef.current}deg)`,
              transformOrigin: '0 50%',
            }}
          >
            <div className="flex items-center">
              <div style={{ width: 56, height: 4 }} className="bg-white/80 rounded-full" />
              <div className="text-white -ml-1" style={{ fontSize: 16 }}>▶</div>
            </div>
          </div>
          {/* loaded bubble */}
          <div
            className="absolute rounded-full flex items-center justify-center text-white font-display font-extrabold"
            style={{
              left: W / 2 - 14,
              top: H - 30,
              width: 28,
              height: 28,
              background: COLORS[(nextRef.current - 1) % COLORS.length],
              fontSize: 15,
            }}
          >
            {nextRef.current}
          </div>
        </div>
      </div>
      </GameStage>

      <div className="max-w-sm mx-auto mt-4">
        <button
          type="button"
          onClick={shoot}
          className="w-full min-h-14 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-display font-extrabold text-2xl shadow active:translate-y-0.5"
        >
          POP! 🫧
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Time the arrow and fire. Match 3+ of the same number to pop them!
      </p>
    </div>
  );
}
