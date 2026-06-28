import { useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { GameStage } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Sushi Match — a cute match-3. Swap adjacent sushi to line up 3+; cascades
// score more. A fixed number of moves per game.

const COLS = 7;
const ROWS = 8;
const TILE = 40;
const W = COLS * TILE;
const H = ROWS * TILE;
const SUSHI = ['🍣', '🍙', '🍤', '🍱', '🥟', '🍡'];
const MOVES = 20;

type Grid = number[][];

function randTile(): number {
  return Math.floor(Math.random() * SUSHI.length);
}

function findMatches(g: Grid): boolean[][] {
  const m = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 2; c++) {
      const v = g[r][c];
      if (v >= 0 && v === g[r][c + 1] && v === g[r][c + 2]) {
        m[r][c] = m[r][c + 1] = m[r][c + 2] = true;
      }
    }
  for (let c = 0; c < COLS; c++)
    for (let r = 0; r < ROWS - 2; r++) {
      const v = g[r][c];
      if (v >= 0 && v === g[r + 1][c] && v === g[r + 2][c]) {
        m[r][c] = m[r + 1][c] = m[r + 2][c] = true;
      }
    }
  return m;
}

// Clear matches, apply gravity + refill, once. Returns cells cleared.
function collapseOnce(g: Grid): number {
  const m = findMatches(g);
  let cleared = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (m[r][c]) cleared++;
  if (!cleared) return 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (m[r][c]) g[r][c] = -1;
  for (let c = 0; c < COLS; c++) {
    const col: number[] = [];
    for (let r = ROWS - 1; r >= 0; r--) if (g[r][c] >= 0) col.push(g[r][c]);
    for (let r = ROWS - 1; r >= 0; r--) g[r][c] = col[ROWS - 1 - r] ?? randTile();
  }
  return cleared;
}

function resolveAll(g: Grid): number {
  let total = 0;
  let guard = 0;
  for (;;) {
    const c = collapseOnce(g);
    if (!c || guard++ > 50) break;
    total += c;
  }
  return total;
}

function initGrid(): Grid {
  const g: Grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, randTile));
  // settle any starting matches without scoring
  let guard = 0;
  while (findMatches(g).some((row) => row.some(Boolean)) && guard++ < 50) collapseOnce(g);
  return g;
}

export function SushiMatch() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [grid, setGrid] = useState<Grid>(initGrid);
  const [sel, setSel] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(MOVES);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const finish = (finalScore: number) => {
    addArcadePoints(finalScore);
    const xp = Math.max(1, Math.min(20, Math.floor(finalScore / 40) + 1));
    setOutcome(recordArcadePlay('sushi', xp));
  };

  const tap = (r: number, c: number) => {
    if (outcome) return;
    if (!sel) {
      setSel({ r, c });
      return;
    }
    const adj = Math.abs(sel.r - r) + Math.abs(sel.c - c) === 1;
    if (!adj) {
      setSel({ r, c });
      return;
    }
    const g = grid.map((row) => [...row]);
    [g[sel.r][sel.c], g[r][c]] = [g[r][c], g[sel.r][sel.c]];
    const cleared = resolveAll(g);
    setSel(null);
    if (cleared > 0) {
      setGrid(g);
      const ns = score + cleared * 5;
      setScore(ns);
      const nm = moves - 1;
      setMoves(nm);
      if (nm <= 0) finish(ns);
    }
    // invalid swap (no match) → leave board as-is
  };

  const reset = () => {
    setGrid(initGrid());
    setSel(null);
    setScore(0);
    setMoves(MOVES);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Sushi Match" emoji="🍣" />
        <ArcadeEndCard
          gameId="sushi"
          outcome={outcome}
          win={score >= 150}
          scoreLine={`${score} points`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Sushi Match" emoji="🍣" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-slate-700 tabular-nums">⭐ {score}</span>
        <span className="text-indigo-600 tabular-nums">Moves {moves}</span>
      </div>

      <GameStage theme="counter" className="mx-auto p-2" style={{ maxWidth: W + 16 }}>
      <div
        className="mx-auto bg-amber-100/90 rounded-xl p-1 grid"
        style={{
          width: '100%',
          aspectRatio: `${W} / ${H}`,
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 2,
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((v, c) => {
            const selected = sel?.r === r && sel?.c === c;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => tap(r, c)}
                className="flex items-center justify-center rounded-lg"
                style={{
                  background: selected ? '#fde68a' : '#fffbeb',
                  outline: selected ? '2px solid #f59e0b' : 'none',
                  fontSize: 22,
                }}
              >
                {SUSHI[v] ?? ''}
              </button>
            );
          }),
        )}
      </div>
      </GameStage>
      <p className="text-center text-xs text-slate-500 mt-2">
        Tap two neighbours to swap. Line up 3+ to clear them. Make them count!
      </p>
    </div>
  );
}
