import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// 2048 — slide and merge numbered tiles. Pure math (doubling/addition), and
// famously addictive. Turn-based, so no RAF; one board = one session.

type Grid = number[][];

const TILE_COLORS: Record<number, string> = {
  0: '#cdc1b4',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

function emptyGrid(): Grid {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function clone(g: Grid): Grid {
  return g.map((r) => [...r]);
}

function spawn(g: Grid): Grid {
  const empties: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] === 0) empties.push([r, c]);
  if (!empties.length) return g;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = clone(g);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

// Slide+merge one row toward the left. Returns the new row and points gained.
function slideRow(row: number[]): { row: number[]; gained: number } {
  const nums = row.filter((v) => v !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      out.push(merged);
      gained += merged;
      i++;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < 4) out.push(0);
  return { row: out, gained };
}

function transpose(g: Grid): Grid {
  const t = emptyGrid();
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) t[c][r] = g[r][c];
  return t;
}

type Dir = 'left' | 'right' | 'up' | 'down';

function move(g: Grid, dir: Dir): { grid: Grid; gained: number; moved: boolean } {
  let work = clone(g);
  if (dir === 'up' || dir === 'down') work = transpose(work);
  if (dir === 'right' || dir === 'down') work = work.map((r) => [...r].reverse());
  let gained = 0;
  work = work.map((r) => {
    const res = slideRow(r);
    gained += res.gained;
    return res.row;
  });
  if (dir === 'right' || dir === 'down') work = work.map((r) => [...r].reverse());
  if (dir === 'up' || dir === 'down') work = transpose(work);
  const moved = JSON.stringify(work) !== JSON.stringify(g);
  return { grid: work, gained, moved };
}

function anyMoves(g: Grid): boolean {
  return (['left', 'right', 'up', 'down'] as Dir[]).some((d) => move(g, d).moved);
}

function freshBoard(): Grid {
  return spawn(spawn(emptyGrid()));
}

export function Twenty48() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [grid, setGrid] = useState<Grid>(freshBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  // The keydown effect re-registers every render and the D-pad calls this from
  // render, so `grid`/`score` here are always current.
  const doMove = (dir: Dir) => {
    if (outcome || pausedRef.current) return;
    const { grid: ng, gained, moved } = move(grid, dir);
    if (!moved) return;
    const withSpawn = spawn(ng);
    const ns = score + gained;
    setGrid(withSpawn);
    setScore(ns);
    setBest((b) => Math.max(b, ns));
    if (!anyMoves(withSpawn)) {
      addArcadePoints(ns);
      const xp = Math.max(1, Math.min(20, Math.floor(ns / 100)));
      setOutcome(recordArcadePlay('tiles', xp));
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      let d: Dir | null = null;
      if (e.key === 'ArrowLeft' || e.key === 'a') d = 'left';
      else if (e.key === 'ArrowRight' || e.key === 'd') d = 'right';
      else if (e.key === 'ArrowUp' || e.key === 'w') d = 'up';
      else if (e.key === 'ArrowDown' || e.key === 's') d = 'down';
      if (d) {
        e.preventDefault();
        doMove(d);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const reset = () => {
    setGrid(freshBoard());
    setScore(0);
    setOutcome(null);
  };

  const won = grid.some((r) => r.some((v) => v >= 2048));

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="2048" emoji="🔢" />
        <ArcadeEndCard
          gameId="tiles"
          outcome={outcome}
          win={won}
          scoreLine={won ? `🎉 You hit 2048! ${score} points` : `${score} points`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="2048" emoji="🔢" />
      <div className="flex justify-between items-center mb-2 max-w-xs mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-slate-700 tabular-nums">⭐ {score}</span>
        <span className="text-amber-600 tabular-nums">Best {best}</span>
      </div>

      <div
        className="mx-auto rounded-2xl bg-[#bbada0] p-2 touch-none"
        style={{ width: '100%', maxWidth: 320 }}
        onPointerDown={(e) => {
          swipeRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = swipeRef.current;
          swipeRef.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
          if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? 'right' : 'left');
          else doMove(dy > 0 ? 'down' : 'up');
        }}
      >
        <div className="grid grid-cols-4 gap-2" style={{ aspectRatio: '1 / 1' }}>
          {grid.flatMap((row, r) =>
            row.map((v, c) => (
              <div
                key={`${r}-${c}`}
                className="rounded-lg flex items-center justify-center font-display font-extrabold"
                style={{
                  background: TILE_COLORS[v] ?? '#3c3a32',
                  color: v <= 4 ? '#776e65' : '#f9f6f2',
                  fontSize: v >= 1000 ? 20 : v >= 100 ? 24 : 28,
                }}
              >
                {v > 0 ? v : ''}
              </div>
            )),
          )}
        </div>
      </div>

      {/* D-pad */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 w-44 mx-auto select-none">
        <span />
        <Pad label="↑" onPress={() => doMove('up')} />
        <span />
        <Pad label="←" onPress={() => doMove('left')} />
        <Pad label="↓" onPress={() => doMove('down')} />
        <Pad label="→" onPress={() => doMove('right')} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Slide tiles; equal numbers merge and add up. Reach 2048!
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
