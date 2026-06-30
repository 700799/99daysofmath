import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Checkmate Lab — curated "compelled loss" endgame puzzles. You're given a big
// material lead, but only ONE move wins; any other move and the computer punishes
// you. No chess engine: each position is hand-authored with a single solution and
// a scripted refutation, so the teaching is exact.

type Piece = { color: 'w' | 'b'; type: 'k' | 'q' | 'r' | 'b' | 'n' | 'p' };
type Board = (Piece | null)[][];

// Use the SOLID (filled) glyphs for BOTH colours and differentiate by fill +
// outline stroke, so white pieces stay readable on light squares too.
const SOLID: Record<string, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

interface Puzzle {
  concept: string;
  title: string;
  lesson: string;
  material: string;
  fen: string; // piece placement only (rank 8 → rank 1)
  from: string;
  to: string;
  idea: string; // shown on the correct move
  refute: string; // shown on any wrong move
}

const PUZZLES: Puzzle[] = [
  {
    concept: 'ZUGZWANG',
    title: 'The Compelled Win',
    lesson: 'You are up a whole queen — but only ONE move actually wins. A careless move lets the lone king wriggle free (even stalemate!). Having more material means nothing if your move doesn’t land.',
    material: 'You: King + Queen (+2 pawns)  ·  Foe: lone King',
    fen: '7k/8/6K1/8/8/8/2PP4/1Q6',
    from: 'b1', to: 'b8',
    idea: 'Qb8#! The queen pins the king to the back rank while your king covers g7 and h7. Checkmate.',
    refute: 'Any other move and the cornered king slips to g8/h7 — or you stalemate it and throw the win. The computer holds the draw and grinds you down.',
  },
  {
    concept: 'BACK RANK',
    title: 'The Trapped King',
    lesson: 'The enemy king is boxed in by its own pawns — outnumbered on the back rank. One rook is all it takes.',
    material: 'You: King + Rook (+3 pawns)  ·  Foe: King + 3 pawns',
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1',
    from: 'a1', to: 'a8',
    idea: 'Ra8#! The king’s own f7/g7/h7 pawns wall it in, so the rook on the 8th rank is mate.',
    refute: 'Give the king a luft or waste a tempo and it makes a hole with ...g6/...h6 and escapes. The computer consolidates and wins.',
  },
  {
    concept: 'QUEEN SACRIFICE',
    title: 'Game of the Century',
    lesson: 'Sometimes you GIVE UP your queen to force mate. In 1956 a 13-year-old Bobby Fischer stunned Donald Byrne with a queen offer. Here the queen sac forces a smothered mate.',
    material: 'You: King + Queen + Knight  ·  Foe: King + Rook + 2 pawns',
    fen: '5r1k/6pp/7N/8/8/1Q6/8/6K1',
    from: 'b3', to: 'g8',
    idea: 'Qg8+!! Rxg8 is forced — the king can’t take because your knight guards g8 — then Nf7# is a smothered mate. The immortal queen sacrifice.',
    refute: 'Refuse the sacrifice and the king escapes to g8; your attack fizzles and the computer’s extra rook takes over.',
  },
  {
    concept: '3 MINORS vs QUEEN',
    title: 'Death by a Thousand Cuts',
    lesson: 'Three minor pieces can out-coordinate a lone queen. A well-placed knight forks the king and queen at once — the queen is worth more, but it can’t be everywhere.',
    material: 'You: King + Knight + 2 Bishops  ·  Foe: King + Queen + 3 pawns',
    fen: '2q3k1/5ppp/8/3N4/8/8/1B6/5BK1',
    from: 'd5', to: 'e7',
    idea: 'Ne7+! A royal fork — check on g8 AND attack the queen on c8. The king must move, then Nxc8 wins the queen.',
    refute: 'Any quiet move and the queen swings into your position with check; one piece can’t hold against Her Majesty. The computer wins.',
  },
  {
    concept: 'SUPPORTED MATE',
    title: 'Queen & Bishop Duet',
    lesson: 'A queen alone can’t mate — but with one friend covering the escape squares, it’s lights out. Find the partner.',
    material: 'You: King + Queen + Bishop  ·  Foe: King + 2 pawns',
    fen: '6k1/5p1p/8/8/8/8/1B6/3Q2K1',
    from: 'd1', to: 'd8',
    idea: 'Qd8#! The bishop on b2 covers g7 and h8, the queen covers f8 and gives check — the king has no square.',
    refute: 'Without the bishop’s help the king strolls to g7/h8. Burn a move and the computer untangles and defends.',
  },
];

function parseFEN(placement: string): Board {
  return placement.split('/').map((row) => {
    const cells: (Piece | null)[] = [];
    for (const ch of row) {
      if (/\d/.test(ch)) for (let k = 0; k < Number(ch); k++) cells.push(null);
      else cells.push({ color: ch === ch.toUpperCase() ? 'w' : 'b', type: ch.toLowerCase() as Piece['type'] });
    }
    return cells;
  });
}
const sqRC = (sq: string): [number, number] => [8 - Number(sq[1]), sq.charCodeAt(0) - 97];
const rcSq = (r: number, c: number) => `${String.fromCharCode(97 + c)}${8 - r}`;

function applyMove(board: Board, from: string, to: string): Board {
  const b = board.map((row) => row.slice());
  const [fr, fc] = sqRC(from);
  const [tr, tc] = sqRC(to);
  b[tr][tc] = b[fr][fc];
  b[fr][fc] = null;
  return b;
}

export function ChessPuzzle() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const [idx, setIdx] = useState(0);
  const puzzle = PUZZLES[idx];
  const [board, setBoard] = useState<Board>(() => parseFEN(puzzle.fen));
  const [sel, setSel] = useState<string | null>(null);
  const [status, setStatus] = useState<'play' | 'solved' | 'wrong'>('play');
  const [solvedCount, setSolvedCount] = useState(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };

  const loadPuzzle = (i: number) => {
    setBoard(parseFEN(PUZZLES[i].fen));
    setSel(null);
    setStatus('play');
  };

  const tryMove = (from: string, to: string) => {
    if (from === puzzle.from && to === puzzle.to) {
      setBoard((b) => applyMove(b, from, to));
      setStatus('solved');
      setSel(null);
      setSolvedCount((n) => n + 1);
      sfx.win(); buzz(HAPTIC.win);
    } else {
      setStatus('wrong');
      setSel(null);
      sfx.lose(); buzz(HAPTIC.death);
    }
  };

  const onSquare = (r: number, c: number) => {
    if (status !== 'play') return;
    const sq = rcSq(r, c);
    const piece = board[r][c];
    if (sel) {
      if (sq === sel) { setSel(null); return; }
      if (piece && piece.color === 'w') { setSel(sq); return; } // reselect
      tryMove(sel, sq);
    } else if (piece && piece.color === 'w') {
      setSel(sq);
      sfx.pickup();
    }
  };

  const next = () => {
    if (idx >= PUZZLES.length - 1) {
      const xp = Math.max(2, Math.min(20, solvedCount * 4));
      setOutcome(recordArcadePlay('chess', xp));
      return;
    }
    const ni = idx + 1;
    setIdx(ni);
    loadPuzzle(ni);
  };

  const retry = () => loadPuzzle(idx);

  const reset = () => {
    setIdx(0);
    loadPuzzle(0);
    setSolvedCount(0);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Checkmate Lab" emoji="♟️" />
        <ArcadeEndCard
          gameId="chess"
          outcome={outcome}
          win={solvedCount >= PUZZLES.length}
          scoreLine={`${solvedCount}/${PUZZLES.length} endgames cracked!`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Checkmate Lab" emoji="♟️" />

      <div className="mx-auto mb-2 max-w-md rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-display font-extrabold uppercase tracking-wider text-white">
            {puzzle.concept}
          </span>
          <span className="text-xs font-display font-bold text-slate-500">Puzzle {idx + 1}/{PUZZLES.length}</span>
        </div>
        <div className="mt-1 font-display text-lg font-extrabold text-slate-900">{puzzle.title}</div>
        <p className="mt-1 text-xs text-slate-600">{puzzle.lesson}</p>
        <p className="mt-1 text-[11px] font-display font-bold text-amber-700">⚖️ {puzzle.material}</p>
      </div>

      {/* board */}
      <div className="relative mx-auto w-full max-w-[360px]">
        <div className="grid grid-cols-8 overflow-hidden rounded-lg border-4 border-amber-900 shadow-lg">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const sq = rcSq(r, c);
              const dark = (r + c) % 2 === 1;
              const isSel = sel === sq;
              return (
                <button
                  key={sq}
                  type="button"
                  onClick={() => onSquare(r, c)}
                  className={`relative flex aspect-square items-center justify-center ${dark ? 'bg-teal-700' : 'bg-amber-50'} ${isSel ? 'outline outline-4 -outline-offset-4 outline-yellow-400' : ''}`}
                  style={{ lineHeight: 1 }}
                >
                  {piece && (
                    <span
                      className="select-none"
                      style={{
                        fontSize: '32px',
                        lineHeight: 1,
                        color: piece.color === 'w' ? '#f8fafc' : '#0f172a',
                        WebkitTextStroke: piece.color === 'w' ? '2px #0f172a' : '1.5px #f1f5f9',
                        paintOrder: 'stroke',
                        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.35))',
                      }}
                    >
                      {SOLID[piece.type]}
                    </span>
                  )}
                </button>
              );
            }),
          )}
        </div>
        {status !== 'play' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`pointer-events-none absolute inset-0 rounded-lg ${status === 'solved' ? 'bg-emerald-400/25' : 'bg-rose-500/25'}`}
          />
        )}
      </div>

      {/* status + controls */}
      <div className="mx-auto mt-3 max-w-md text-center">
        {status === 'play' && (
          <p className="text-sm font-display font-bold text-slate-600">
            White to play — that’s you. Find the one move that wins.
          </p>
        )}
        {status === 'solved' && (
          <>
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-display font-bold text-emerald-800">✔ {puzzle.idea}</p>
            <button type="button" onClick={next} className="mt-3 min-h-12 w-full rounded-2xl bg-emerald-500 font-display text-lg font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
              {idx >= PUZZLES.length - 1 ? 'Finish 🏁' : 'Next puzzle ▶'}
            </button>
          </>
        )}
        {status === 'wrong' && (
          <>
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-display font-bold text-rose-800">✘ {puzzle.refute}</p>
            <button type="button" onClick={retry} className="mt-3 min-h-12 w-full rounded-2xl bg-indigo-500 font-display text-lg font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
              ↺ Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
