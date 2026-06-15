import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

const COLS = 7;
const ROWS = 6;
type Cell = 0 | 1 | 2; // 0 empty, 1 player, 2 owl
type Board = Cell[][]; // [row][col], row 0 = top

// Theme definitions with animal pairs
interface Theme {
  name: string;
  player: string; // emoji for player pieces
  owl: string;    // emoji for owl pieces
}

const THEMES: Theme[] = [
  { name: 'Chickens vs Sheep', player: '🐔', owl: '🐑' },
  { name: 'Dinosaurs vs Birds', player: '🦕', owl: '🦅' },
  { name: 'Cats vs Dogs', player: '🐱', owl: '🐶' },
  { name: 'Frogs vs Fish', player: '🐸', owl: '🐟' },
  { name: 'Classic', player: '🔴', owl: '🟢' },
];

const emptyBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));

const isBoardEmpty = (board: Board): boolean =>
  board.every((row) => row.every((cell) => cell === 0));

function dropRow(board: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

function winner(board: Board): Cell {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (v === 0) continue;
      for (const [dr, dc] of dirs) {
        let n = 1;
        while (
          n < 4 &&
          r + dr * n >= 0 &&
          r + dr * n < ROWS &&
          c + dc * n >= 0 &&
          c + dc * n < COLS &&
          board[r + dr * n][c + dc * n] === v
        )
          n++;
        if (n >= 4) return v;
      }
    }
  }
  return 0;
}

function isFull(board: Board): boolean {
  return board[0].every((c) => c !== 0);
}

// Owl AI: win if possible → block the player's win → otherwise prefer columns
// that don't gift the player a win, weighted toward the center.
function owlMove(board: Board): number {
  const legal: number[] = [];
  for (let c = 0; c < COLS; c++) if (dropRow(board, c) >= 0) legal.push(c);

  const tryMove = (col: number, who: Cell): Board => {
    const b = board.map((row) => [...row]) as Board;
    b[dropRow(b, col)][col] = who;
    return b;
  };

  for (const c of legal) if (winner(tryMove(c, 2)) === 2) return c; // take the win
  for (const c of legal) if (winner(tryMove(c, 1)) === 1) return c; // block

  // Avoid moves that let the player win immediately on top.
  const safe = legal.filter((c) => {
    const b = tryMove(c, 2);
    for (const c2 of legal) {
      const r2 = dropRow(b, c2);
      if (r2 < 0) continue;
      const b2 = b.map((row) => [...row]) as Board;
      b2[r2][c2] = 1;
      if (winner(b2) === 1) return false;
    }
    return true;
  });
  const pool = safe.length > 0 ? safe : legal;
  // Center-weighted random pick.
  const weights = pool.map((c) => 4 - Math.abs(3 - c));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

type Phase = 'playing' | 'owl-thinking' | 'done';

export function ConnectFour() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [phase, setPhase] = useState<Phase>('playing');
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem('c4_theme');
    return saved ? Math.min(parseInt(saved), THEMES.length - 1) : 0;
  });
  const [showThemeSelector, setShowThemeSelector] = useState(!outcome && result === null && phase === 'playing');
  useArcadeClock(!!outcome);
  const recordedRef = useRef(false);
  const theme = THEMES[themeIdx];

  const finish = (res: 'win' | 'lose' | 'draw', finalBoard: Board) => {
    setBoard(finalBoard);
    setResult(res);
    setPhase('done');
    if (!recordedRef.current) {
      recordedRef.current = true;
      const baseXp = res === 'win' ? 5 : res === 'draw' ? 3 : 2;
      setOutcome(recordArcadePlay('connect4', baseXp, { c4Win: res === 'win' }));
    }
  };

  const selectTheme = (idx: number) => {
    setThemeIdx(idx);
    localStorage.setItem('c4_theme', idx.toString());
    setShowThemeSelector(false);
  };

  const play = (col: number) => {
    if (phase !== 'playing' || showThemeSelector) return;
    const r = dropRow(board, col);
    if (r < 0) return;
    const b1 = board.map((row) => [...row]) as Board;
    b1[r][col] = 1;
    if (winner(b1) === 1) return finish('win', b1);
    if (isFull(b1)) return finish('draw', b1);

    setBoard(b1);
    setPhase('owl-thinking');
    setTimeout(() => {
      const c2 = owlMove(b1);
      const b2 = b1.map((row) => [...row]) as Board;
      b2[dropRow(b2, c2)][c2] = 2;
      if (winner(b2) === 2) return finish('lose', b2);
      if (isFull(b2)) return finish('draw', b2);
      setBoard(b2);
      setPhase('playing');
    }, 450);
  };

  const reset = () => {
    setBoard(emptyBoard());
    setPhase('playing');
    setResult(null);
    setOutcome(null);
    recordedRef.current = false;
    setShowThemeSelector(true);
  };

  return (
    <div>
      <ArcadeHeader title="Connect Four" emoji={theme.player} />
      {phase === 'done' && outcome ? (
        <ArcadeEndCard
          gameId="connect4"
          outcome={outcome}
          win={result === 'win'}
          scoreLine={
            result === 'win'
              ? 'You beat the owl! 🎉'
              : result === 'draw'
                ? 'A draw — nice defense!'
                : 'The owl got you this time!'
          }
          onReplay={reset}
        />
      ) : (
        <>
          {showThemeSelector && result === null && isBoardEmpty(board) && (
            <div className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
              <p className="text-sm font-display font-bold text-slate-900 mb-3">Pick your opponent:</p>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectTheme(idx)}
                    className={`p-3 rounded-xl text-sm font-display font-bold transition-all ${
                      themeIdx === idx
                        ? 'bg-white ring-2 ring-blue-500 shadow-lg'
                        : 'bg-white/50 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{t.player}</span>
                    <span className="text-slate-700">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm text-slate-600 mb-3">
            {phase === 'owl-thinking'
              ? '🦉 The owl is thinking…'
              : `Your move — tap a column. You are ${theme.player}`}
          </p>
          <div className="bg-blue-600 rounded-3xl p-2.5 max-w-sm mx-auto shadow-inner">
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: COLS }).map((_, c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Drop in column ${c + 1}`}
                  onClick={() => play(c)}
                  disabled={phase !== 'playing' || dropRow(board, c) < 0 || showThemeSelector}
                  className="flex flex-col gap-1.5 disabled:cursor-not-allowed group"
                >
                  {Array.from({ length: ROWS }).map((__, r) => {
                    const v = board[r][c];
                    return (
                      <div
                        key={r}
                        className="aspect-square rounded-full bg-blue-800 group-enabled:group-hover:bg-blue-700 flex items-center justify-center text-xl"
                      >
                        <AnimatePresence>
                          {v !== 0 && (
                            <motion.div
                              initial={{ y: -40 * (r + 1), opacity: 0.8 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                              className="w-[86%] h-[86%] flex items-center justify-center text-lg"
                            >
                              {v === 1 ? theme.player : theme.owl}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            Win: +5 XP · Draw: +3 · Loss: +2 — first win earns the {theme.player} sticker!
          </p>
        </>
      )}
    </div>
  );
}
