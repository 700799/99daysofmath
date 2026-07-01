import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Checkmate Lab — curated "compelled win" endgames you PLAY OUT step by step.
// You choose each of your moves; the opponent's forced reply is auto-played, and
// the line runs to checkmate (or winning the queen). No chess engine: every line
// is hand-authored and verified, so the teaching is exact. A wrong move shows the
// refutation and restarts the line.

type Piece = { color: 'w' | 'b'; type: 'k' | 'q' | 'r' | 'b' | 'n' | 'p' };
type Board = (Piece | null)[][];

// SOLID (filled) glyphs for BOTH colours, differentiated by fill + outline, so
// white pieces stay readable on light squares too.
const SOLID: Record<string, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

interface Ply {
  from: string;
  to: string;
  hint: string; // what the player should do this step
  reply?: { from: string; to: string; says: string }; // opponent's forced answer
}
interface Puzzle {
  concept: string;
  title: string;
  lesson: string;
  material: string;
  fen: string; // piece placement only (rank 8 → rank 1)
  line: Ply[]; // your moves, in order; last one ends it
  win: string; // shown when the whole line is completed
  refute: string; // shown on any wrong move
}

const PUZZLES: Puzzle[] = [
  {
    concept: 'ZUGZWANG',
    title: 'The Compelled Win',
    lesson: 'You are up a whole queen — but only ONE move wins. A careless move lets the lone king wriggle free (even stalemate!). More material means nothing if your move doesn’t land.',
    material: 'You: King + Queen (+2 pawns)  ·  Foe: lone King',
    fen: '7k/8/6K1/8/8/8/2PP4/1Q6',
    line: [
      { from: 'b1', to: 'b8', hint: 'Pin the king to the back rank with the queen — your own king already guards g7 and h7.' },
    ],
    win: 'Qb8#! The queen seals the 8th rank while your king covers the escape squares. Checkmate.',
    refute: 'Any other move and the cornered king slips to g8/h7 — or you stalemate it and throw the win.',
  },
  {
    concept: 'BACK RANK',
    title: 'The Trapped King',
    lesson: 'The enemy king is boxed in by its own pawns — outnumbered on the back rank. One rook is all it takes.',
    material: 'You: King + Rook (+3 pawns)  ·  Foe: King + 3 pawns',
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1',
    line: [
      { from: 'a1', to: 'a8', hint: 'The king’s own f7/g7/h7 pawns wall it in — swing the rook to the 8th rank.' },
    ],
    win: 'Ra8#! The king is mated on the back rank by its own pawns.',
    refute: 'Waste a tempo and the king makes luft with ...g6/...h6 and escapes. The computer consolidates.',
  },
  {
    concept: 'QUEEN SACRIFICE',
    title: 'Game of the Century',
    lesson: 'Sometimes you GIVE UP your queen to force mate. In 1956 a 13-year-old Bobby Fischer stunned Donald Byrne with a queen offer. Here a queen sac forces a smothered mate.',
    material: 'You: King + Queen + Knight  ·  Foe: King + Rook + 2 pawns',
    fen: '5r1k/6pp/7N/8/8/1Q6/8/6K1',
    line: [
      { from: 'b3', to: 'g8', hint: 'Offer the queen with check on g8. The king can’t take (your knight guards g8) — so the rook must.', reply: { from: 'f8', to: 'g8', says: '…Rxg8 — forced. The rook is dragged onto g8, smothering its own king.' } },
      { from: 'h6', to: 'f7', hint: 'Now spring the smothered mate — leap the knight in.' },
    ],
    win: 'Nf7#! Buried by its own rook and pawns — the immortal smothered mate.',
    refute: 'Without the queen sacrifice the king escapes to g8 and your attack fizzles; the extra rook takes over.',
  },
  {
    concept: '3 MINORS vs QUEEN',
    title: 'Death by a Thousand Cuts',
    lesson: 'Three minor pieces can out-coordinate a lone queen. A knight forks the king and queen at once — the queen is worth more, but it can’t be everywhere.',
    material: 'You: King + Knight + 2 Bishops  ·  Foe: King + Queen + 3 pawns',
    fen: '2q3k1/5ppp/8/3N4/8/8/1B6/5BK1',
    line: [
      { from: 'd5', to: 'e7', hint: 'Find the royal fork — check the king AND hit the queen with one knight move.', reply: { from: 'g8', to: 'f8', says: '…the king must step out of check, abandoning the queen.' } },
      { from: 'e7', to: 'c8', hint: 'Collect Her Majesty!' },
    ],
    win: 'Nxc8! Three little pieces just won the queen — the one fork she couldn’t escape.',
    refute: 'Any quiet move and the queen swings in with check; one piece can’t hold against Her Majesty.',
  },
  {
    concept: 'SUPPORTED MATE',
    title: 'Queen & Bishop Duet',
    lesson: 'A queen alone can’t mate — but with one friend covering the escape squares, it’s lights out. Find the partner.',
    material: 'You: King + Queen + Bishop  ·  Foe: King + 2 pawns',
    fen: '6k1/5p1p/8/8/8/8/1B6/3Q2K1',
    line: [
      { from: 'd1', to: 'd8', hint: 'Your bishop on b2 already covers g7 and h8 — bring the queen to the back rank with check.' },
    ],
    win: 'Qd8#! The bishop guards g7/h8, the queen takes f8 and checks — no square left.',
    refute: 'Without the bishop’s help the king strolls to g7/h8. Burn a move and the computer defends.',
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
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'play' | 'reply' | 'solved' | 'wrong'>('play');
  const [replyNote, setReplyNote] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };

  const ply = puzzle.line[step];

  const loadPuzzle = (i: number) => {
    setBoard(parseFEN(PUZZLES[i].fen));
    setSel(null);
    setStep(0);
    setStatus('play');
    setReplyNote('');
    setShowHint(false);
  };

  const tryMove = (from: string, to: string) => {
    if (status !== 'play') return;
    const cur = puzzle.line[step];
    if (from === cur.from && to === cur.to) {
      setBoard((b) => applyMove(b, from, to));
      setSel(null);
      setShowHint(false);
      sfx.step(); buzz(HAPTIC.tap);
      const isLast = step === puzzle.line.length - 1;
      if (isLast) {
        setStatus('solved');
        setSolvedCount((n) => n + 1);
        sfx.win(); buzz(HAPTIC.win);
      } else if (cur.reply) {
        setStatus('reply');
        setReplyNote(cur.reply.says);
        const reply = cur.reply;
        const nextStep = step + 1;
        window.setTimeout(() => {
          setBoard((b) => applyMove(b, reply.from, reply.to));
          setStep(nextStep);
          setStatus('play');
          sfx.pickup();
        }, 950);
      }
    } else {
      setStatus('wrong');
      setSel(null);
      setShowHint(false);
      sfx.lose(); buzz(HAPTIC.death);
    }
  };

  const onSquare = (r: number, c: number) => {
    if (status !== 'play') return;
    const sq = rcSq(r, c);
    const piece = board[r][c];
    if (sel) {
      if (sq === sel) { setSel(null); return; }
      if (piece && piece.color === 'w') { setSel(sq); return; }
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

  const hintFrom = showHint && status === 'play' ? ply.from : null;
  const hintTo = showHint && status === 'play' ? ply.to : null;
  const multi = puzzle.line.length > 1;

  return (
    <div>
      <ArcadeHeader title="Checkmate Lab" emoji="♟️" gameId="chess" />

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
              const isHintFrom = hintFrom === sq;
              const isHintTo = hintTo === sq;
              const ring = isSel
                ? 'outline outline-4 -outline-offset-4 outline-yellow-400'
                : isHintFrom
                  ? 'outline outline-4 -outline-offset-4 outline-amber-400'
                  : isHintTo
                    ? 'outline outline-4 -outline-offset-4 outline-emerald-400'
                    : '';
              return (
                <button
                  key={sq}
                  type="button"
                  onClick={() => onSquare(r, c)}
                  className={`relative flex aspect-square items-center justify-center ${dark ? 'bg-teal-700' : 'bg-amber-50'} ${ring}`}
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
        {(status === 'solved' || status === 'wrong') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`pointer-events-none absolute inset-0 rounded-lg ${status === 'solved' ? 'bg-emerald-400/25' : 'bg-rose-500/25'}`}
          />
        )}
      </div>

      {/* status + controls */}
      <div className="mx-auto mt-3 max-w-md text-center">
        {(status === 'play' || status === 'reply') && (
          <>
            {multi && (
              <div className="mb-1 text-[11px] font-display font-extrabold uppercase tracking-widest text-indigo-500">
                Your move {step + 1} of {puzzle.line.length}
              </div>
            )}
            {status === 'reply' ? (
              <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-display font-bold text-slate-700">{replyNote}</p>
            ) : (
              <>
                <p className="text-sm font-display font-bold text-slate-700">{ply.hint}</p>
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="mt-2 min-h-10 rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 font-display font-extrabold text-amber-700 active:translate-y-0.5"
                >
                  {showHint ? '🙈 Hide the move' : '💡 Show me the move'}
                </button>
              </>
            )}
          </>
        )}
        {status === 'solved' && (
          <>
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-display font-bold text-emerald-800">✔ {puzzle.win}</p>
            <button type="button" onClick={next} className="mt-3 min-h-12 w-full rounded-2xl bg-emerald-500 font-display text-lg font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
              {idx >= PUZZLES.length - 1 ? 'Finish 🏁' : 'Next puzzle ▶'}
            </button>
          </>
        )}
        {status === 'wrong' && (
          <>
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-display font-bold text-rose-800">✘ {puzzle.refute}</p>
            <button type="button" onClick={retry} className="mt-3 min-h-12 w-full rounded-2xl bg-indigo-500 font-display text-lg font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
              ↺ Replay the line
            </button>
          </>
        )}
      </div>
    </div>
  );
}
