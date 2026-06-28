import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useProgress } from '../../state/progress';
import { ArcadeHeader } from './shared';

// ── Types ────────────────────────────────────────────────────────────────────

type Size = 1 | 2 | 3;           // 1=small  2=medium  3=big
type Player = 'dog' | 'cat';
type Piece = { player: Player; size: Size };
type Cell = Piece[];              // stack — last element is the visible top
type Board = Cell[][];

interface Supply { big: number; med: number; small: number }
type SupKey = keyof Supply;

const FRESH: Supply = { big: 2, med: 2, small: 2 };
const KEY_TO_SIZE: Record<SupKey, Size> = { big: 3, med: 2, small: 1 };
const SIZE_TO_KEY: Record<Size, SupKey> = { 3: 'big', 2: 'med', 1: 'small' };

type Phase = 'math' | 'playing' | 'dragon' | 'done';
type DragonAnim = 'hidden' | 'enter' | 'chomp' | 'exit';

interface MathQ { q: string; a: number }

// ── Piece visuals ─────────────────────────────────────────────────────────────

const DOG: Record<Size, string> = { 3: '🐕', 2: '🐶', 1: '🦴' };
const CAT: Record<Size, string> = { 3: '🐈', 2: '😺', 1: '🐾' };
const emoji = (p: Player, s: Size) => (p === 'dog' ? DOG : CAT)[s];

const SIZE_LABEL: Record<Size, string> = { 3: 'Big', 2: 'Med', 1: 'Small' };

// ── Board helpers ─────────────────────────────────────────────────────────────

/** 3→win3, 5→win4, 7→win5 */
function boardN(level: number) { return level <= 3 ? 3 : level <= 6 ? 5 : 7; }
function winLen(n: number) { return n === 3 ? 3 : n === 5 ? 4 : 5; }

const makeBoard = (n: number): Board =>
  Array.from({ length: n }, () => Array.from({ length: n }, (): Cell => []));

const top = (cell: Cell): Piece | null => cell.length ? cell[cell.length - 1] : null;

const canPlace = (cell: Cell, size: Size): boolean => {
  const t = top(cell);
  return !t || size > t.size;
};

function checkWinner(board: Board, n: number): Player | 'draw' | null {
  const wn = winLen(n);
  const owner = (r: number, c: number): Player | null => top(board[r][c])?.player ?? null;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const p = owner(r, c);
      if (!p) continue;
      for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
        let cnt = 1, nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < n && nc >= 0 && nc < n && owner(nr, nc) === p) {
          cnt++; nr += dr; nc += dc;
        }
        if (cnt >= wn) return p;
      }
    }
  }
  return null;
}

function findWinLine(board: Board, n: number, p: Player): [number, number][] {
  const wn = winLen(n);
  const owner = (r: number, c: number) => top(board[r][c])?.player;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (owner(r, c) !== p) continue;
      for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
        const cells: [number,number][] = [[r,c]];
        let nr = r+dr, nc = c+dc;
        while (nr>=0&&nr<n&&nc>=0&&nc<n&&owner(nr,nc)===p) { cells.push([nr,nc]); nr+=dr; nc+=dc; }
        if (cells.length >= wn) return cells;
      }
    }
  }
  return [];
}

function hasMove(sup: Supply, board: Board, _n: number): boolean {
  return (['big','med','small'] as SupKey[]).some(k =>
    sup[k] > 0 &&
    board.some(row => row.some(cell => canPlace(cell, KEY_TO_SIZE[k])))
  );
}

// ── Math problems ─────────────────────────────────────────────────────────────

const rnd = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

function makeMath(level: number): MathQ {
  if (level <= 1) {
    const a = rnd(1, 10), b = rnd(1, 10);
    return { q: `${a} + ${b} = ?`, a: a + b };
  }
  if (level === 2) {
    const b = rnd(1, 15), a = b + rnd(0, 15);
    return { q: `${a} − ${b} = ?`, a: a - b };
  }
  if (level === 3) {
    const a = rnd(2, 5), b = rnd(2, 5);
    return { q: `${a} × ${b} = ?`, a: a * b };
  }
  if (level === 4) {
    const a = rnd(3, 9), b = rnd(3, 9);
    return { q: `${a} × ${b} = ?`, a: a * b };
  }
  if (level === 5) {
    const b = rnd(2, 9), ans = rnd(2, 12);
    return { q: `${b * ans} ÷ ${b} = ?`, a: ans };
  }
  if (level <= 7) {
    const a = rnd(2,9), b = rnd(2,9), c = rnd(1,20);
    return { q: `${a} × ${b} + ${c} = ?`, a: a*b+c };
  }
  if (level <= 9) {
    const a = rnd(3,9), b = rnd(2,9), c = rnd(2,a*b-1);
    return { q: `${a} × ${b} − ${c} = ?`, a: a*b-c };
  }
  // Level 10+: solve for n
  const coef = rnd(2,6), ans = rnd(3,15);
  return { q: `${coef} × n = ${coef*ans} → n = ?`, a: ans };
}

// ── AI ────────────────────────────────────────────────────────────────────────

interface Move { r: number; c: number; size: Size }

function aiMove(board: Board, sup: Supply, n: number, level: number): Move | null {
  const diff = Math.min(3, Math.floor((level - 1) / 2));
  // 0=random 1=block/win 2=strategic 3=hard

  const all: Move[] = [];
  (['big','med','small'] as SupKey[]).forEach(k => {
    if (!sup[k]) return;
    const size = KEY_TO_SIZE[k];
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (canPlace(board[r][c], size)) all.push({ r, c, size });
  });
  if (!all.length) return null;

  const rand = () => all[Math.floor(Math.random() * all.length)];
  const sim = (m: Move, p: Player) => {
    const b = board.map(row => row.map(cell => [...cell]));
    b[m.r][m.c] = [...b[m.r][m.c], { player: p, size: m.size }];
    return b;
  };

  if (diff === 0) return rand();

  // Win immediately
  for (const m of all) if (checkWinner(sim(m,'cat'),n)==='cat') return m;

  if (diff === 1) return rand();

  // Block dog win
  for (const m of all) {
    const dogM: Move = { ...m };
    const b = board.map(row => row.map(cell => [...cell]));
    b[dogM.r][dogM.c] = [...b[dogM.r][dogM.c], { player: 'dog', size: dogM.size }];
    if (checkWinner(b,n)==='dog') {
      const block = all.find(cm => cm.r===m.r && cm.c===m.c);
      if (block) return block;
    }
  }

  const center = Math.floor(n/2);
  if (diff === 2) {
    const cp = all.find(m => m.r===center && m.c===center);
    if (cp && Math.random()>0.35) return cp;
    return rand();
  }

  // Hard: score each move
  const wn = winLen(n);
  let best = rand(), bestScore = -Infinity;
  for (const m of all) {
    let score = 0;
    const dist = Math.max(Math.abs(m.r-center), Math.abs(m.c-center));
    score += (n - dist) * 3;
    score += m.size * 4;
    const b = sim(m,'cat');
    for (const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]] as [number,number][]) {
      let cnt=1, nr=m.r+dr, nc=m.c+dc;
      while (nr>=0&&nr<n&&nc>=0&&nc<n&&top(b[nr][nc])?.player==='cat'){cnt++;nr+=dr;nc+=dc;}
      nr=m.r-dr;nc=m.c-dc;
      while (nr>=0&&nr<n&&nc>=0&&nc<n&&top(b[nr][nc])?.player==='cat'){cnt++;nr-=dr;nc-=dc;}
      score += cnt * 12;
      if (cnt >= wn-1) score += 60;
    }
    if (score > bestScore) { bestScore=score; best=m; }
  }
  return best;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TicTacToe() {
  const { recordArcadePlay } = useProgress();

  const [level, setLevel]         = useState(1);
  const [phase, setPhase]         = useState<Phase>('math');
  const [mathQ, setMathQ]         = useState<MathQ>(() => makeMath(1));
  const [mathInput, setMathInput] = useState('');
  const [mathWrong, setMathWrong] = useState(false);
  const [mathGlow, setMathGlow]   = useState(false);   // brief green flash on correct

  const n = boardN(level);
  const [board, setBoard]               = useState<Board>(() => makeBoard(3));
  const [dogSup, setDogSup]             = useState<Supply>({ ...FRESH });
  const [catSup, setCatSup]             = useState<Supply>({ ...FRESH });
  const [current, setCurrent]           = useState<Player>('dog');
  const [selSize, setSelSize]           = useState<Size | null>(null);
  const [winner, setWinner]             = useState<Player | 'draw' | null>(null);
  const [winCells, setWinCells]         = useState<[number,number][]>([]);
  const [dragon, setDragon]             = useState<DragonAnim>('hidden');
  const [celebrating, setCelebrating]   = useState(false);
  const [boardShake, setBoardShake]     = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current=[]; };
  const later = (fn: ()=>void, ms: number) => {
    const t = setTimeout(fn, ms);
    timerRef.current.push(t);
  };

  useEffect(() => () => clearTimers(), []);

  // ── Game start ───────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    clearTimers();
    const newN = boardN(level);
    setBoard(makeBoard(newN));
    setDogSup({ ...FRESH });
    setCatSup({ ...FRESH });
    setCurrent('dog');
    setSelSize(null);
    setWinner(null);
    setWinCells([]);
    setDragon('hidden');
    setCelebrating(false);
    setBoardShake(false);
    setPhase('playing');
  }, [level]);

  // ── Math gate ────────────────────────────────────────────────────────────

  const submitMath = () => {
    const val = parseInt(mathInput, 10);
    if (isNaN(val) || val !== mathQ.a) {
      setMathWrong(true);
      setTimeout(() => { setMathWrong(false); setMathInput(''); }, 700);
      return;
    }
    setMathGlow(true);
    setTimeout(() => { setMathGlow(false); startGame(); }, 500);
  };

  // ── End game sequence ────────────────────────────────────────────────────

  const endGame = useCallback((w: Player | 'draw', finalBoard: Board) => {
    setWinner(w);
    if (w !== 'draw') setWinCells(findWinLine(finalBoard, boardN(level), w));
    setPhase('dragon');
    setBoardShake(true);

    setDragon('enter');
    later(() => setDragon('chomp'), 900);
    later(() => { setBoardShake(false); setDragon('exit'); }, 2200);
    later(() => {
      setDragon('hidden');
      setCelebrating(true);
      setPhase('done');
      recordArcadePlay('tictactoe', 8);
      if (w === 'dog') setLevel(l => l + 1);
    }, 3200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, recordArcadePlay]);

  // ── Dog move ─────────────────────────────────────────────────────────────

  const handleCell = (r: number, c: number) => {
    if (phase !== 'playing' || current !== 'dog' || selSize === null) return;
    if (!canPlace(board[r][c], selSize)) return;

    const nb = board.map(row => row.map(cell => [...cell]));
    nb[r][c] = [...nb[r][c], { player: 'dog', size: selSize }];
    const ns: Supply = { ...dogSup, [SIZE_TO_KEY[selSize]]: dogSup[SIZE_TO_KEY[selSize]] - 1 };

    setBoard(nb);
    setDogSup(ns);
    setSelSize(null);

    const w = checkWinner(nb, n);
    if (w) { endGame(w, nb); return; }
    if (!hasMove(catSup, nb, n) && !hasMove(ns, nb, n)) { endGame('draw', nb); return; }
    setCurrent('cat');
  };

  // ── Cat (AI) move ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing' || current !== 'cat') return;
    const delay = Math.max(350, 800 - level * 40);
    const t = setTimeout(() => {
      const move = aiMove(board, catSup, n, level);
      if (!move) { endGame(checkWinner(board, n) ?? 'draw', board); return; }

      const nb = board.map(row => row.map(cell => [...cell]));
      nb[move.r][move.c] = [...nb[move.r][move.c], { player: 'cat', size: move.size }];
      const ns: Supply = { ...catSup, [SIZE_TO_KEY[move.size]]: catSup[SIZE_TO_KEY[move.size]] - 1 };

      setBoard(nb);
      setCatSup(ns);

      const w = checkWinner(nb, n);
      if (w) { endGame(w, nb); return; }
      if (!hasMove(ns, nb, n) && !hasMove(dogSup, nb, n)) { endGame('draw', nb); return; }
      setCurrent('dog');
    }, delay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase]);

  // ── Play again ────────────────────────────────────────────────────────────

  const playAgain = () => {
    setMathQ(makeMath(level));
    setMathInput('');
    setCelebrating(false);
    setPhase('math');
  };

  // ── Cell sizing ───────────────────────────────────────────────────────────

  const cellPx = n === 3 ? 88 : n === 5 ? 64 : 50;
  const boardPx = n * cellPx + (n - 1) * 4;   // cells + gaps

  const diff = Math.min(3, Math.floor((level - 1) / 2));
  const diffLabel = ['Easy', 'Medium', 'Hard', 'Expert'][diff];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="pb-8">
      <ArcadeHeader title="Tic Tac Toe" emoji="🐕" />

      {/* ── MATH GATE ── */}
      <AnimatePresence mode="wait">
        {phase === 'math' && (
          <motion.div
            key="math"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-6 pt-6 px-4"
          >
            {/* level badge */}
            <div className="flex gap-3 items-center">
              <span className="bg-amber-100 text-amber-800 font-display font-extrabold text-sm px-3 py-1 rounded-full">
                Level {level}
              </span>
              <span className="bg-violet-100 text-violet-800 font-display font-bold text-sm px-3 py-1 rounded-full">
                {n}×{n} · {diffLabel}
              </span>
            </div>

            <motion.div
              animate={mathWrong ? { x: [-8,8,-6,6,-3,3,0] } : mathGlow ? { scale:[1,1.04,1] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-full max-w-sm rounded-3xl p-7 shadow-xl border-2 transition-colors ${
                mathWrong ? 'bg-red-50 border-red-300' : mathGlow ? 'bg-green-50 border-green-400' : 'bg-white border-slate-200'
              }`}
            >
              <div className="text-4xl text-center mb-3">🧮</div>
              <p className="text-center text-xs font-display font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                Solve to unlock level {level}
              </p>
              <p className="text-center text-2xl font-display font-extrabold text-slate-800 mb-5">
                {mathQ.q}
              </p>
              <input
                type="tel"
                inputMode="numeric"
                value={mathInput}
                onChange={e => setMathInput(e.target.value.replace(/[^0-9\-]/g,''))}
                onKeyDown={e => e.key === 'Enter' && submitMath()}
                placeholder="Your answer…"
                className="w-full text-center text-xl font-bold rounded-2xl border-2 border-slate-200 px-4 py-3 mb-4 focus:outline-none focus:border-amber-400 bg-slate-50"
              />
              <button
                onClick={submitMath}
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-white rounded-2xl py-3 text-lg font-display font-extrabold transition-all"
              >
                {mathGlow ? '✓ Correct!' : 'Play →'}
              </button>
            </motion.div>

            {level > 1 && (
              <p className="text-slate-400 text-sm text-center">
                🏆 Level {level-1} cleared! Next board: {n}×{n}
              </p>
            )}
          </motion.div>
        )}

        {/* ── PLAYING + DRAGON ── */}
        {(phase === 'playing' || phase === 'dragon') && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 pt-3 px-2"
          >
            {/* turn / status bar */}
            <div className={`px-5 py-2 rounded-full font-display font-extrabold text-sm border-2 transition-colors ${
              current === 'dog'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-violet-50 border-violet-300 text-violet-800'
            }`}>
              {current === 'dog' ? '🐕 Your turn — pick a piece!' : '🐈 Cat is thinking…'}
            </div>

            {/* board */}
            <motion.div
              animate={boardShake ? {
                x: [0, -10, 10, -8, 8, -5, 5, -3, 3, 0],
                rotate: [0, -2, 2, -1.5, 1.5, 0],
              } : {}}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${n}, ${cellPx}px)`,
                gap: 4,
                width: boardPx,
              }}
            >
              {board.map((row, r) =>
                row.map((cell, c) => {
                  const t = top(cell);
                  const canDrop = phase === 'playing' && current === 'dog' && selSize !== null && canPlace(cell, selSize);
                  const blocked = phase === 'playing' && current === 'dog' && selSize !== null && !canPlace(cell, selSize);
                  const winning = winCells.some(([wr,wc]) => wr===r && wc===c);

                  return (
                    <motion.button
                      key={`${r}-${c}`}
                      onClick={() => handleCell(r, c)}
                      animate={winning ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 0.55 }}
                      className={[
                        'relative flex items-center justify-center rounded-xl border-2 transition-all select-none',
                        `h-[${cellPx}px]`,
                        canDrop  ? 'bg-green-50 border-green-400 cursor-pointer hover:bg-green-100 shadow-md shadow-green-200' : '',
                        blocked  ? 'bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed' : '',
                        winning  ? 'bg-yellow-50 border-yellow-400 shadow-lg shadow-yellow-200' : '',
                        !canDrop && !blocked && !winning ? 'bg-white border-slate-200 hover:border-slate-300' : '',
                        t ? (t.player === 'dog' ? 'border-amber-300' : 'border-violet-300') : '',
                      ].join(' ')}
                      style={{ height: cellPx }}
                    >
                      {/* top piece */}
                      {t && (
                        <motion.span
                          key={`${r}-${c}-${cell.length}`}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="select-none"
                          style={{ fontSize: t.size === 3 ? cellPx * 0.52 : t.size === 2 ? cellPx * 0.42 : cellPx * 0.32 }}
                        >
                          {emoji(t.player, t.size)}
                        </motion.span>
                      )}

                      {/* "+" hint for empty valid cell */}
                      {!t && canDrop && (
                        <span className="text-green-400 font-black" style={{ fontSize: cellPx * 0.45 }}>+</span>
                      )}

                      {/* stack depth badge */}
                      {cell.length > 1 && (
                        <span className="absolute top-0.5 right-0.5 bg-slate-700 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                          {cell.length}
                        </span>
                      )}
                    </motion.button>
                  );
                })
              )}
            </motion.div>

            {/* dog piece selector */}
            {phase === 'playing' && current === 'dog' && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3"
              >
                {(['big','med','small'] as SupKey[]).map(k => {
                  const sz = KEY_TO_SIZE[k];
                  const cnt = dogSup[k];
                  const sel = selSize === sz;
                  return (
                    <motion.button
                      key={k}
                      disabled={cnt === 0}
                      onClick={() => setSelSize(sel ? null : sz)}
                      whileTap={cnt > 0 ? { scale: 0.9 } : {}}
                      animate={sel ? { scale: 1.12 } : { scale: 1 }}
                      className={[
                        'flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border-2 transition-all',
                        cnt === 0 ? 'opacity-25 cursor-not-allowed border-transparent bg-transparent' :
                        sel       ? 'border-green-400 bg-green-100 shadow-md shadow-green-200' :
                                    'border-amber-200 bg-white hover:border-amber-400',
                      ].join(' ')}
                    >
                      <span style={{ fontSize: sz === 3 ? 30 : sz === 2 ? 24 : 18 }}>{DOG[sz]}</span>
                      <span className="text-[10px] font-display font-extrabold text-slate-600 uppercase">{SIZE_LABEL[sz]}</span>
                      <span className="text-[10px] font-bold text-slate-400">×{cnt}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            {/* cat supply — always visible so the player can plan */}
            <div className="flex gap-4 text-xs text-slate-500 items-center">
              <span className="font-bold">🐈 Cat:</span>
              {(['big','med','small'] as SupKey[]).map(k => (
                <span key={k} className={catSup[k] === 0 ? 'opacity-25' : ''}>
                  {CAT[KEY_TO_SIZE[k]]}×{catSup[k]}
                </span>
              ))}
            </div>

            {/* level / win info */}
            <div className="text-xs text-slate-400 font-display font-bold text-center">
              Level {level} · {n}×{n} · {diffLabel} · Need {winLen(n)} in a row
            </div>
          </motion.div>
        )}

        {/* ── DONE / CELEBRATION ── */}
        {phase === 'done' && celebrating && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="flex flex-col items-center gap-6 pt-8 px-4"
          >
            {winner === 'dog' && (
              <>
                {/* bouncing winner dog */}
                <motion.div
                  animate={{ y: [0, -24, 0], rotate: [0, 12, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 0.75 }}
                  className="text-[96px]"
                >
                  🐕
                </motion.div>
                <div className="text-center">
                  <div className="text-4xl font-display font-black text-amber-500 mb-1">YOU WIN! 🎉</div>
                  <div className="text-slate-500 font-display font-bold">Level {level-1} cleared!</div>
                </div>
              </>
            )}
            {winner === 'cat' && (
              <>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                  className="text-[88px]"
                >
                  🐈
                </motion.div>
                <div className="text-center">
                  <div className="text-3xl font-display font-black text-violet-600 mb-1">Cat wins! 😤</div>
                  <div className="text-slate-500 font-display font-bold">Try again — same level!</div>
                </div>
              </>
            )}
            {winner === 'draw' && (
              <>
                <div className="text-[80px]">🤝</div>
                <div className="text-3xl font-display font-black text-slate-600">Draw!</div>
              </>
            )}

            <button
              onClick={playAgain}
              className="px-10 py-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white rounded-2xl text-xl font-display font-extrabold shadow-lg shadow-amber-200 transition-all"
            >
              {winner === 'dog' ? `Level ${level} →` : 'Try Again!'}
            </button>

            <Link to="/arcade" className="text-slate-400 text-sm hover:text-slate-600 font-display font-bold">
              ← Back to arcade
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DRAGON OVERLAY ── */}
      <AnimatePresence>
        {dragon !== 'hidden' && (
          <motion.div
            key="dragon-overlay"
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* red tint flash */}
            <motion.div
              className="absolute inset-0 bg-red-600/20"
              animate={dragon === 'chomp' ? { opacity: [0, 0.5, 0, 0.4, 0] } : { opacity: 0 }}
              transition={{ duration: 1.0 }}
            />

            {/* dragon sliding in */}
            <motion.div
              className="absolute"
              style={{ bottom: '30%', right: '-2rem' }}
              initial={{ x: '110vw' }}
              animate={{
                x: dragon === 'enter' || dragon === 'chomp' ? '0vw' : '110vw',
              }}
              transition={{ duration: dragon === 'enter' ? 0.7 : 1.0, type: 'spring', stiffness: 120, damping: 18 }}
            >
              <motion.div
                animate={dragon === 'chomp'
                  ? { scale: [1, 1.5, 0.85, 1.4, 1], rotate: [0, -12, 12, -8, 8, 0] }
                  : { scale: 1, rotate: 0 }}
                transition={{ duration: 1.1 }}
                style={{ fontSize: '9rem', lineHeight: 1 }}
                className="drop-shadow-2xl select-none"
              >
                🐉
              </motion.div>
            </motion.div>

            {/* CHOMP! text */}
            <AnimatePresence>
              {dragon === 'chomp' && (
                <motion.div
                  key="chomp"
                  initial={{ scale: 0, opacity: 0, rotate: -20 }}
                  animate={{ scale: [0, 1.4, 1], opacity: 1, rotate: -15 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-[28%] left-[10%] text-5xl sm:text-7xl font-black text-red-500 drop-shadow-lg"
                  style={{ fontFamily: 'Impact, sans-serif', WebkitTextStroke: '2px white' }}
                >
                  CHOMP! 🔥
                </motion.div>
              )}
            </AnimatePresence>

            {/* loser label — shows who got eaten */}
            <AnimatePresence>
              {dragon === 'chomp' && winner !== 'draw' && (
                <motion.div
                  key="eaten"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-center"
                >
                  <div className="bg-black/70 text-white rounded-2xl px-5 py-3 text-lg font-display font-extrabold">
                    {winner === 'dog'
                      ? '🐉 Dragon eats the cat! 🐈'
                      : '🐉 Dragon eats the dog! 🐕'}
                  </div>
                </motion.div>
              )}
              {dragon === 'chomp' && winner === 'draw' && (
                <motion.div
                  key="eaten-draw"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-[28%] left-1/2 -translate-x-1/2"
                >
                  <div className="bg-black/70 text-white rounded-2xl px-5 py-3 text-lg font-display font-extrabold">
                    🐉 Dragon eats everyone!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WIN CONFETTI ── */}
      <AnimatePresence>
        {celebrating && winner === 'dog' && (
          <motion.div
            key="confetti"
            className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 4 }}
          >
            {['🎉','⭐','✨','🌟','🎊','🏆','🐕','💛','🎈','🥇'].map((e, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl select-none"
                initial={{
                  x: `${5 + i * 10}vw`,
                  y: '110vh',
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  y: `-20vh`,
                  rotate: (i % 2 ? 1 : -1) * (180 + i * 30),
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.8 + i * 0.18,
                  delay: i * 0.08,
                  ease: 'easeOut',
                }}
              >
                {e}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
