import { useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Sudoku. One verified base puzzle is relabelled by a random digit permutation
// each game (which preserves validity and the unique solution), giving variety
// from a single source. Tap a cell, then a number; givens are locked and
// conflicts highlight red. Fill the grid correctly to win.

const BASE_PUZZLE =
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const BASE_SOLUTION =
  '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

function shuffledDigits(): number[] {
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newGame(): { cells: number[]; given: boolean[]; solution: number[] } {
  const perm = shuffledDigits(); // maps digit d -> perm[d-1]
  const cells: number[] = [];
  const given: boolean[] = [];
  const solution: number[] = [];
  for (let i = 0; i < 81; i++) {
    const pv = BASE_PUZZLE[i];
    const sv = Number(BASE_SOLUTION[i]);
    solution.push(perm[sv - 1]);
    if (pv === '0') {
      cells.push(0);
      given.push(false);
    } else {
      cells.push(perm[Number(pv) - 1]);
      given.push(true);
    }
  }
  return { cells, given, solution };
}

function conflicts(cells: number[]): boolean[] {
  const bad = new Array(81).fill(false);
  const mark = (idxs: number[]) => {
    for (let i = 0; i < idxs.length; i++) {
      for (let j = i + 1; j < idxs.length; j++) {
        const a = idxs[i];
        const b = idxs[j];
        if (cells[a] !== 0 && cells[a] === cells[b]) {
          bad[a] = true;
          bad[b] = true;
        }
      }
    }
  };
  for (let r = 0; r < 9; r++) mark(Array.from({ length: 9 }, (_, c) => r * 9 + c));
  for (let c = 0; c < 9; c++) mark(Array.from({ length: 9 }, (_, r) => r * 9 + c));
  for (let br = 0; br < 3; br++)
    for (let bc = 0; bc < 3; bc++) {
      const idxs: number[] = [];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) idxs.push((br * 3 + r) * 9 + (bc * 3 + c));
      mark(idxs);
    }
  return bad;
}

export function Sudoku() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [game, setGame] = useState(newGame);
  const [cells, setCells] = useState<number[]>(game.cells);
  const [sel, setSel] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  // transient per-entry feedback: which cell was just placed and whether it matched
  const [feedback, setFeedback] = useState<{ cell: number; ok: boolean } | null>(null);
  useArcadeClock(!!outcome);

  const bad = conflicts(cells);
  const filled = cells.every((v) => v !== 0);
  const solved = filled && cells.every((v, i) => v === game.solution[i]);

  const place = (n: number) => {
    if (sel == null || game.given[sel] || outcome) return;
    const next = [...cells];
    next[sel] = n;
    setCells(next);
    // immediate right/wrong feedback for the placed number (not for erasing)
    if (n !== 0) {
      const ok = n === game.solution[sel];
      const cell = sel;
      setFeedback({ cell, ok });
      window.setTimeout(
        () => setFeedback((f) => (f && f.cell === cell ? null : f)),
        900,
      );
    }
    if (next.every((v, i) => v === game.solution[i])) {
      addArcadePoints(100);
      setOutcome(recordArcadePlay('sudoku', 15));
    }
  };

  const reset = () => {
    const g = newGame();
    setGame(g);
    setCells(g.cells);
    setSel(null);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Sudoku" emoji="🧩" />
        <ArcadeEndCard
          gameId="sudoku"
          outcome={outcome}
          win
          scoreLine="🎉 Solved it!"
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Sudoku" emoji="🧩" />

      <button
        type="button"
        onClick={() => setShowHelp((s) => !s)}
        className="mb-2 text-sm font-display font-bold text-blue-700"
      >
        {showHelp ? '− Hide how to play' : 'ℹ️ How to play'}
      </button>
      {showHelp && (
        <div className="mb-3 rounded-2xl bg-blue-50 border-2 border-blue-100 p-3 text-sm text-slate-700 max-w-md mx-auto">
          Fill every empty square with a number <b>1–9</b> so that each <b>row</b>, each
          <b> column</b>, and each <b>3×3 box</b> contains all of 1–9 with no repeats. Tap a
          square, then tap a number. Dark numbers are given and can't change; clashes turn red.
        </div>
      )}

      <div className="h-7 mb-1 flex items-center justify-center">
        {feedback && (
          <span
            className={`font-display font-extrabold text-sm px-3 py-1 rounded-full ${
              feedback.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {feedback.ok ? '✓ Correct!' : '✗ Try again'}
          </span>
        )}
      </div>

      <div
        className="mx-auto bg-slate-900 p-[2px] grid"
        style={{
          width: '100%',
          maxWidth: 360,
          aspectRatio: '1 / 1',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: 1,
        }}
      >
        {cells.map((v, i) => {
          const r = Math.floor(i / 9);
          const c = i % 9;
          const selected = sel === i;
          const sameVal = sel != null && v !== 0 && cells[sel] === v;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              className="flex items-center justify-center font-display font-extrabold"
              style={{
                background:
                  feedback && feedback.cell === i
                    ? feedback.ok
                      ? '#bbf7d0'
                      : '#fecaca'
                    : selected
                      ? '#bfdbfe'
                      : sameVal
                        ? '#e0e7ff'
                        : (Math.floor(r / 3) + Math.floor(c / 3)) % 2 === 0
                          ? '#ffffff'
                          : '#f1f5f9',
                color: bad[i] ? '#dc2626' : game.given[i] ? '#0f172a' : '#2563eb',
                fontSize: 18,
                // thicker separators between 3x3 boxes
                marginTop: r % 3 === 0 && r !== 0 ? 2 : 0,
                marginLeft: c % 3 === 0 && c !== 0 ? 2 : 0,
              }}
            >
              {v || ''}
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-9 gap-1 max-w-sm mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => place(n)}
            className="min-h-11 rounded-lg bg-white border-2 border-slate-200 font-display font-extrabold text-slate-800 active:bg-slate-100"
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => place(0)}
          className="w-full min-h-11 rounded-lg bg-slate-100 font-display font-extrabold text-slate-700"
        >
          Erase
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        {filled && !solved ? 'All filled — fix the red clashes!' : 'Each row, column, and box: 1–9, no repeats.'}
      </p>
    </div>
  );
}
