import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Checkmate Lab — sharp "only-move" positions you PLAY OUT to the finish. Each turn
// you CHOOSE your move from a few candidates. The right move wins (often mates!);
// a WRONG move is punished — the computer plays on and CHECKMATES YOU, move by move,
// right on the board, then you can try again. No chess engine: every line is
// hand-authored and machine-verified with chess.js so the mates are exact.

type Piece = { color: 'w' | 'b'; type: 'k' | 'q' | 'r' | 'b' | 'n' | 'p' };
type Board = (Piece | null)[][];

// SOLID (filled) glyphs for BOTH colours, differentiated by fill + outline, so
// white pieces stay readable on light squares too.
const SOLID: Record<string, string> = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };

interface BustMove { from: string; to: string; says: string; you?: boolean } // you = auto-played forced White reply; else = computer (Black)
interface MoveOption {
  from: string;
  to: string;
  label: string; // short move name, e.g. 'Nxh3'
  desc: string; // the idea, shown on the button
  because: string; // caption after choosing (why it works / why it loses)
  correct?: boolean;
  reply?: { from: string; to: string; says: string }; // opponent's forced answer on a correct, multi-move line
  bust?: BustMove[]; // wrong move → the computer's forced mate, played to checkmate
}
interface Ply { hint: string; options: MoveOption[] }
interface Puzzle {
  concept: string;
  title: string;
  lesson: string;
  material: string;
  fen: string; // piece placement only (rank 8 → rank 1)
  plies: Ply[]; // usually one — your move
  win: string; // shown when the whole line is solved
}

const PUZZLES: Puzzle[] = [
  {
    concept: 'DEFENCE',
    title: 'Snatch the Attacker',
    lesson: 'Black’s queen is one move from ...Qxh2#. You have exactly ONE move that saves you — and it wins the queen! Pick wrong and the computer mates you.',
    material: 'You: King + Knight (+3 pawns)  ·  Foe: King + Queen + 2 Bishops',
    fen: '6k1/2b2ppp/b7/6N1/8/7q/5PPP/6K1',
    plies: [
      {
        hint: 'Black threatens ...Qxh2# (the bishop on a6 covers the f1 escape). Remove the mating queen.',
        options: [
          { from: 'g5', to: 'h3', label: 'Nxh3', desc: 'Knight grabs the queen', correct: true, because: 'The knight snaps off the mating queen — the attack is over and you’re up a queen.' },
          { from: 'g5', to: 'e4', label: 'Ne4', desc: 'Centralise the knight', because: 'Too slow — you ignored the threat.', bust: [{ from: 'h3', to: 'h2', says: 'Qxh2#! The bishop on a6 covers f1 — the king has nowhere to run.' }] },
          { from: 'g1', to: 'h1', label: 'Kh1', desc: 'Hide in the corner', because: 'The corner is no safer.', bust: [{ from: 'h3', to: 'h2', says: 'Qxh2#! Checkmate in the corner.' }] },
        ],
      },
    ],
    win: 'Nxh3! You grab the mating queen and the whole attack collapses.',
  },
  {
    concept: 'RACE',
    title: 'Mate in One — First!',
    lesson: 'Both kings are in danger — it’s a race. You have a mate in one, and so does Black. Whoever strikes first wins. Find YOUR mate!',
    material: 'You: King + Queen (+3 pawns)  ·  Foe: King + Queen + Knight + Bishop',
    fen: '6k1/5ppp/b7/8/6nq/8/4QPPP/6K1',
    plies: [
      {
        hint: 'You have a checkmate right now. Deliver it before Black plays ...Qxh2#.',
        options: [
          { from: 'e2', to: 'e8', label: 'Qe8#', desc: 'Check on the back rank', correct: true, because: 'Checkmate! Black’s king is walled in by its own f7/g7/h7 pawns.' },
          { from: 'g1', to: 'h1', label: 'Kh1', desc: 'Dodge to the corner', because: 'You blinked — now Black strikes.', bust: [{ from: 'h4', to: 'h2', says: 'Qxh2#! Supported by the knight on g4, with the bishop covering f1.' }] },
          { from: 'e2', to: 'e3', label: 'Qe3', desc: 'Guard the third rank', because: 'Too slow — you had mate and missed it.', bust: [{ from: 'h4', to: 'h2', says: 'Qxh2#! Black got there first.' }] },
        ],
      },
    ],
    win: 'Qe8#! You struck first — the back-rank mate lands before Black’s.',
  },
  {
    concept: 'ARABIAN MATE',
    title: 'Break the Arabian Net',
    lesson: 'A rook and knight weave the deadly “Arabian mate” in the corner: Black threatens ...Rxh2#, with the knight on f3 guarding h2 and g1. One capture breaks the net.',
    material: 'You: King + Queen (+3 pawns)  ·  Foe: King + Rook + Knight',
    fen: '6kr/p4pp1/8/8/8/5n2/P5PP/Q6K',
    plies: [
      {
        hint: 'Black threatens ...Rxh2# (the knight on f3 supports h2 and covers g1). Take the knight that glues the mate together.',
        options: [
          { from: 'g2', to: 'f3', label: 'gxf3', desc: 'Pawn takes the knight', correct: true, because: 'The knight was the glue — now ...Rxh2+ is simply Kxh2. You’re winning.' },
          { from: 'a2', to: 'a3', label: 'a3', desc: 'Push a queenside pawn', because: 'You ignored the mate.', bust: [{ from: 'h8', to: 'h2', says: 'Rxh2#! The Arabian mate — the rook mates, the knight covers g1.' }] },
          { from: 'a1', to: 'b1', label: 'Qb1', desc: 'Reposition the queen', because: 'Wrong side of the board.', bust: [{ from: 'h8', to: 'h2', says: 'Rxh2#! Your queen was a mile from your king.' }] },
        ],
      },
    ],
    win: 'gxf3! You capture the knight and the Arabian net falls apart.',
  },
  {
    concept: 'SMOTHERED MATE',
    title: 'Stop the Smother',
    lesson: 'Your own rook and pawns box your king in — a knight on f2 would be a SMOTHERED mate! Black’s knight is one hop away. Capture it before it lands.',
    material: 'You: King + Queen + Rook (+3 pawns)  ·  Foe: King + Rook + Knight',
    fen: '2r3k1/p4ppp/8/8/4n3/1Q1P4/P5PP/6RK',
    plies: [
      {
        hint: 'Black threatens ...Nf2# (your king is smothered by Rg1 and the g2/h2 pawns). Take the knight!',
        options: [
          { from: 'd3', to: 'e4', label: 'dxe4', desc: 'Pawn takes the knight', correct: true, because: 'The smothering knight is gone — your king can breathe and you’re up material.' },
          { from: 'a2', to: 'a3', label: 'a3', desc: 'Push a pawn', because: 'A quiet move loses on the spot.', bust: [{ from: 'e4', to: 'f2', says: 'Nf2#! The classic smothered mate — your own pieces trap your king.' }] },
          { from: 'b3', to: 'b7', label: 'Qb7', desc: 'Swing the queen out', because: 'Wandering off — and mate is instant.', bust: [{ from: 'e4', to: 'f2', says: 'Nf2#! Smothered while your queen went sightseeing.' }] },
        ],
      },
    ],
    win: 'dxe4! You remove the smothering knight before it can spring the trap.',
  },
  {
    concept: 'LONG DIAGONAL',
    title: 'Guard the Long Diagonal',
    lesson: 'Black’s queen on b7 and knight on f4 both aim at g2 — ...Qxg2# is threatened. Take the knight that supports the mating square.',
    material: 'You: King + Rook + Knight (+3 pawns)  ·  Foe: King + Queen + Rook',
    fen: '2r3k1/pq3ppp/8/8/5n2/7N/P4PPP/R5K1',
    plies: [
      {
        hint: 'Black threatens ...Qxg2# (the knight on f4 supports g2). Capture the supporting knight.',
        options: [
          { from: 'h3', to: 'f4', label: 'Nxf4', desc: 'Knight takes knight', correct: true, because: 'Without its support, ...Qxg2+ is just Kxg2. The threat is gone.' },
          { from: 'h3', to: 'g5', label: 'Ng5', desc: 'Leap toward the king', because: 'You left f4 alone — mate follows.', bust: [{ from: 'b7', to: 'g2', says: 'Qxg2#! Supported by the knight on f4 — the king can’t escape.' }] },
          { from: 'a2', to: 'a3', label: 'a3', desc: 'Push a pawn', because: 'Doing nothing loses instantly.', bust: [{ from: 'b7', to: 'g2', says: 'Qxg2#! The long diagonal was left wide open.' }] },
        ],
      },
    ],
    win: 'Nxf4! You eliminate the knight guarding g2 and the mate threat vanishes.',
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
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'play' | 'solved' | 'busted'>('play');
  const [picked, setPicked] = useState<number | null>(null); // chosen option index
  const [bustNote, setBustNote] = useState(''); // live caption during the mate playback
  const [bustDone, setBustDone] = useState(false); // true once the mate has landed
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };

  // cancelable timers (fixes the old no-cleanup setTimeout during playback)
  const timers = useRef<number[]>([]);
  const clearTimers = () => { timers.current.forEach((t) => clearTimeout(t)); timers.current = []; };
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); timers.current.push(id); return id; };
  useEffect(() => clearTimers, []);

  const ply = puzzle.plies[step];

  const loadPuzzle = (i: number) => {
    clearTimers();
    setBoard(parseFEN(PUZZLES[i].fen));
    setStep(0);
    setStatus('play');
    setPicked(null);
    setBustNote('');
    setBustDone(false);
    setLastMove(null);
    setShowHint(false);
  };

  const choose = (optIdx: number) => {
    if (status !== 'play' || picked !== null) return;
    const opt = ply.options[optIdx];
    setPicked(optIdx);
    setShowHint(false);
    const afterMove = applyMove(board, opt.from, opt.to);
    setBoard(afterMove);
    setLastMove({ from: opt.from, to: opt.to });

    if (opt.correct) {
      sfx.step(); buzz(HAPTIC.tap);
      const isLast = step === puzzle.plies.length - 1;
      if (isLast) {
        setStatus('solved');
        setSolvedCount((n) => n + 1);
        later(() => { sfx.win(); buzz(HAPTIC.win); }, 260);
      } else if (opt.reply) {
        // (reserved for future multi-move lines) auto-play the forced reply
        const reply = opt.reply;
        setBustNote(reply.says);
        later(() => {
          setBoard((b) => applyMove(b, reply.from, reply.to));
          setLastMove({ from: reply.from, to: reply.to });
          setStep((s) => s + 1);
          setPicked(null);
          sfx.pickup();
        }, 950);
      }
      return;
    }

    // WRONG: the computer plays on and mates you, move by move, to the end.
    setStatus('busted');
    setBustNote(opt.because);
    sfx.lose(); buzz(HAPTIC.heavy);
    const bust = opt.bust ?? [];
    let work = afterMove;
    bust.forEach((mv, i) => {
      later(() => {
        work = applyMove(work, mv.from, mv.to);
        setBoard(work);
        setLastMove({ from: mv.from, to: mv.to });
        setBustNote(mv.says);
        const isFinal = i === bust.length - 1;
        if (isFinal) {
          sfx.boss();
          later(() => { sfx.explode(); buzz(HAPTIC.explode); }, 220);
          setBustDone(true);
        } else if (mv.you) {
          sfx.step(); buzz(HAPTIC.tap);
        } else {
          sfx.hurt(); buzz(HAPTIC.light);
        }
      }, 900 * (i + 1));
    });
    if (bust.length === 0) setBustDone(true);
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
    clearTimers();
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
          scoreLine={`${solvedCount}/${PUZZLES.length} mates found!`}
          onReplay={reset}
        />
      </div>
    );
  }

  const correctOpt = ply.options.find((o) => o.correct);
  const hintFrom = showHint && status === 'play' ? correctOpt?.from : null;
  const hintTo = showHint && status === 'play' ? correctOpt?.to : null;

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

      {/* board (display only — you move by choosing below) */}
      <div className="relative mx-auto w-full max-w-[360px]">
        <div className="grid grid-cols-8 overflow-hidden rounded-lg border-4 border-amber-900 shadow-lg">
          {board.map((row, r) =>
            row.map((piece, c) => {
              const sq = rcSq(r, c);
              const dark = (r + c) % 2 === 1;
              const isHintFrom = hintFrom === sq;
              const isHintTo = hintTo === sq;
              const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
              const ring = isHintFrom
                ? 'outline outline-4 -outline-offset-4 outline-amber-400'
                : isHintTo
                  ? 'outline outline-4 -outline-offset-4 outline-emerald-400'
                  : isLast
                    ? 'outline outline-4 -outline-offset-4 outline-sky-400/80'
                    : '';
              return (
                <div
                  key={sq}
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
                </div>
              );
            }),
          )}
        </div>
        {(status === 'solved' || status === 'busted') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`pointer-events-none absolute inset-0 rounded-lg ${status === 'solved' ? 'bg-emerald-400/25' : `bg-rose-500/${bustDone ? '35' : '20'}`}`}
          />
        )}
      </div>

      {/* status + move choices */}
      <div className="mx-auto mt-3 max-w-md">
        {status === 'play' && (
          <>
            <p className="text-center text-sm font-display font-bold text-slate-700">{ply.hint}</p>
            <div className="mt-3 grid gap-2">
              {ply.options.map((o, i) => (
                <button
                  key={o.from + o.to}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => choose(i)}
                  className={`flex items-center justify-between rounded-2xl border-4 px-4 py-3 text-left font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 ${
                    showHint && o.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-800 bg-white text-slate-900'
                  }`}
                >
                  <span className="text-lg tabular-nums">{o.label}</span>
                  <span className="ml-3 text-xs font-bold text-slate-500">{o.desc}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowHint((v) => !v)}
              className="mt-3 min-h-10 w-full rounded-2xl border-2 border-amber-300 bg-amber-50 font-display font-extrabold text-amber-700 active:translate-y-0.5"
            >
              {showHint ? '🙈 Hide the answer' : '💡 Show me the move'}
            </button>
          </>
        )}

        {status === 'solved' && (
          <div className="text-center">
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-display font-bold text-emerald-800">✔ {puzzle.win}</p>
            <button type="button" onClick={next} className="mt-3 min-h-12 w-full rounded-2xl bg-emerald-500 font-display text-lg font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
              {idx >= PUZZLES.length - 1 ? 'Finish 🏁' : 'Next puzzle ▶'}
            </button>
          </div>
        )}

        {status === 'busted' && (
          <div className="text-center">
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-display font-bold text-rose-800">
              {bustDone ? '☠ ' : '⚠ '}{bustNote}
            </p>
            {bustDone && (
              <>
                <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="mt-2 font-display text-xl font-black text-rose-600">
                  ☠ Checkmate — the computer beat you!
                </motion.p>
                <button type="button" onClick={retry} className="mt-3 min-h-12 w-full rounded-2xl bg-indigo-500 font-display text-lg font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
                  ↺ Try again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
