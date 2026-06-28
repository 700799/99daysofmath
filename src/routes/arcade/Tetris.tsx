import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Alien Tetris — falling tetrominoes made of cute aliens. Clear full rows;
// it speeds up every 10 lines. One game = one session.

const COLS = 10;
const ROWS = 16;
const TILE = 20;
const W = COLS * TILE;
const H = ROWS * TILE;

type Piece = { m: number[][]; e: string; color: string };
const PIECES: Piece[] = [
  { m: [[1, 1, 1, 1]], e: '🛸', color: '#0e7490' }, // I
  { m: [[1, 1], [1, 1]], e: '👽', color: '#a16207' }, // O
  { m: [[0, 1, 0], [1, 1, 1]], e: '👾', color: '#6d28d9' }, // T
  { m: [[0, 1, 1], [1, 1, 0]], e: '🦠', color: '#15803d' }, // S
  { m: [[1, 1, 0], [0, 1, 1]], e: '🐙', color: '#b91c1c' }, // Z
  { m: [[1, 0, 0], [1, 1, 1]], e: '🤖', color: '#1d4ed8' }, // J
  { m: [[0, 0, 1], [1, 1, 1]], e: '⭐', color: '#c2410c' }, // L
];

type Active = { pi: number; m: number[][]; x: number; y: number };

function rotateCW(m: number[][]): number[][] {
  const rows = m.length;
  const cols = m[0].length;
  const out: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out[c][rows - 1 - r] = m[r][c];
  return out;
}

function emptyBoard(): number[][] {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

export function Tetris() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const boardRef = useRef<number[][]>(emptyBoard());
  const activeRef = useRef<Active | null>(null);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const softRef = useRef(false);
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  useArcadeClock(!!outcome);

  const level = () => 1 + Math.floor(linesRef.current / 10);
  const dropInterval = () => (softRef.current ? 0.05 : Math.max(0.08, 0.6 - level() * 0.05));

  const collide = (m: number[][], x: number, y: number): boolean => {
    for (let r = 0; r < m.length; r++)
      for (let c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        const gr = y + r;
        const gc = x + c;
        if (gc < 0 || gc >= COLS || gr >= ROWS) return true;
        if (gr >= 0 && boardRef.current[gr][gc]) return true;
      }
    return false;
  };

  const spawn = (): boolean => {
    const pi = Math.floor(Math.random() * PIECES.length);
    const m = PIECES[pi].m.map((r) => [...r]);
    const x = Math.floor((COLS - m[0].length) / 2);
    const y = -m.length + 1;
    if (collide(m, x, y + 1) && collide(m, x, y)) {
      // can't even appear → game over
      return false;
    }
    activeRef.current = { pi, m, x, y };
    return true;
  };

  const lockPiece = () => {
    const a = activeRef.current;
    if (!a) return;
    for (let r = 0; r < a.m.length; r++)
      for (let c = 0; c < a.m[r].length; c++) {
        if (!a.m[r][c]) continue;
        const gr = a.y + r;
        const gc = a.x + c;
        if (gr < 0) {
          finish();
          return;
        }
        boardRef.current[gr][gc] = a.pi + 1;
      }
    // clear full lines
    const kept = boardRef.current.filter((row) => row.some((v) => v === 0));
    const cleared = ROWS - kept.length;
    if (cleared > 0) {
      const add = [0, 40, 100, 300, 1200][cleared] * level();
      scoreRef.current += add;
      linesRef.current += cleared;
      while (kept.length < ROWS) kept.unshift(new Array(COLS).fill(0));
      boardRef.current = kept;
    }
    if (!spawn()) finish();
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 200) + 1));
    setOutcome(recordArcadePlay('tetris', xp));
  };

  const startRef = useRef(false);
  if (!startRef.current) {
    startRef.current = true;
    spawn();
  }

  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      accRef.current += dt;
      let guard = 0;
      while (accRef.current >= dropInterval() && guard++ < 4) {
        accRef.current -= dropInterval();
        const a = activeRef.current;
        if (!a) break;
        if (!collide(a.m, a.x, a.y + 1)) a.y += 1;
        else lockPiece();
        if (doneRef.current) return;
      }
      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const moveX = (dx: number) => {
    const a = activeRef.current;
    if (a && !collide(a.m, a.x + dx, a.y)) {
      a.x += dx;
      redraw();
    }
  };
  const rotate = () => {
    const a = activeRef.current;
    if (!a) return;
    const nm = rotateCW(a.m);
    for (const kick of [0, -1, 1, -2, 2]) {
      if (!collide(nm, a.x + kick, a.y)) {
        a.m = nm;
        a.x += kick;
        redraw();
        return;
      }
    }
  };
  const hardDrop = () => {
    const a = activeRef.current;
    if (!a) return;
    while (!collide(a.m, a.x, a.y + 1)) a.y += 1;
    lockPiece();
    redraw();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveX(-1);
      else if (e.key === 'ArrowRight' || e.key === 'd') moveX(1);
      else if (e.key === 'ArrowUp' || e.key === 'w') rotate();
      else if (e.key === 'ArrowDown' || e.key === 's') softRef.current = true;
      else if (e.key === ' ') {
        e.preventDefault();
        hardDrop();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's') softRef.current = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const reset = () => {
    boardRef.current = emptyBoard();
    scoreRef.current = 0;
    linesRef.current = 0;
    accRef.current = 0;
    doneRef.current = false;
    softRef.current = false;
    spawn();
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Alien Tetris" emoji="👾" />
        <ArcadeEndCard
          gameId="tetris"
          outcome={outcome}
          win={linesRef.current >= 10}
          scoreLine={`${scoreRef.current} points · ${linesRef.current} lines`}
          onReplay={reset}
        />
      </div>
    );
  }

  // compose render board with active piece overlaid
  const view = boardRef.current.map((row) => [...row]);
  const a = activeRef.current;
  if (a) {
    for (let r = 0; r < a.m.length; r++)
      for (let c = 0; c < a.m[r].length; c++) {
        if (!a.m[r][c]) continue;
        const gr = a.y + r;
        const gc = a.x + c;
        if (gr >= 0 && gr < ROWS && gc >= 0 && gc < COLS) view[gr][gc] = a.pi + 1;
      }
  }

  return (
    <div>
      <ArcadeHeader title="Alien Tetris" emoji="👾" />
      <div className="flex justify-between items-center mb-2 max-w-[260px] mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-emerald-700">Lines {linesRef.current}</span>
        <span className="text-indigo-600">Lvl {level()}</span>
      </div>

      <div
        className="mx-auto bg-slate-900 grid"
        style={{
          width: '100%',
          maxWidth: W,
          aspectRatio: `${W} / ${H}`,
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 1,
        }}
      >
        {view.flatMap((row, r) =>
          row.map((v, c) => (
            <div
              key={`${r}-${c}`}
              className="flex items-center justify-center"
              style={{ background: v ? PIECES[v - 1].color : '#0f172a', fontSize: 12 }}
            >
              {v ? PIECES[v - 1].e : ''}
            </div>
          )),
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5 max-w-xs mx-auto select-none">
        <Pad label="←" onPress={() => moveX(-1)} />
        <Pad label="↻" onPress={rotate} />
        <Pad label="→" onPress={() => moveX(1)} />
        <Pad label="⤓" onPress={hardDrop} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Move ← →, rotate ↻, hard-drop ⤓. Fill rows to clear the aliens!
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
      className="min-h-12 rounded-xl bg-white border-2 border-slate-200 text-xl font-display font-extrabold text-slate-700 active:bg-slate-100"
    >
      {label}
    </button>
  );
}
