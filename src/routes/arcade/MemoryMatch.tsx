import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

const EMOJI = ['➗', '📐', '🔢', '⚖️', '📊', '🧮', '🎯', '⭐'];

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

type Pos = { x: number; y: number; rot: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function deal(): Card[] {
  return shuffle([...EMOJI, ...EMOJI]).map((emoji, id) => ({ id, emoji, matched: false }));
}

// Scatter the 16 cards over the mountain: each card gets its own 4×4 cell (so
// they never overlap) but is nudged + rotated for a playful, hand-tossed look.
function makeLayout(): Pos[] {
  const cells = shuffle(Array.from({ length: 16 }, (_, i) => i));
  return cells.map((cell) => {
    const col = cell % 4;
    const row = Math.floor(cell / 4);
    const x = 13 + col * 24.7 + (Math.random() - 0.5) * 7;
    const y = 12 + row * 24 + (Math.random() - 0.5) * 7;
    const rot = (Math.random() - 0.5) * 20;
    return { x, y, rot };
  });
}

// Cartoon Mt. Fuji backdrop with bold outlines, a red rising sun and clouds.
function MountainBg() {
  return (
    <svg
      viewBox="0 0 100 120"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="mm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#fef9c3" />
        </linearGradient>
        <linearGradient id="mm-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="120" fill="url(#mm-sky)" />
      {/* rising sun */}
      <circle cx="74" cy="26" r="13" fill="#f87171" stroke="#1f2937" strokeWidth="2.5" />
      {/* clouds */}
      <g fill="#ffffff" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round">
        <path d="M10 30 q-1 -7 7 -7 q2 -6 9 -4 q5 -3 8 3 q7 -1 6 6 Z" />
        <path d="M60 14 q-1 -5 6 -5 q2 -4 7 -2 q5 -2 6 4 Z" />
      </g>
      {/* back hills */}
      <path d="M0 92 Q26 74 52 92 T100 90 L100 120 L0 120 Z" fill="#86efac" stroke="#1f2937" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Mt. Fuji */}
      <path d="M16 104 Q40 44 50 40 Q60 44 84 104 Z" fill="url(#mm-mtn)" stroke="#1f2937" strokeWidth="3" strokeLinejoin="round" />
      {/* snow cap */}
      <path d="M37 64 Q44 60 50 58 Q56 60 63 64 Q58 62 54 66 Q50 62 46 66 Q42 62 37 64 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
      {/* foreground meadow */}
      <path d="M0 110 Q50 102 100 110 L100 120 L0 120 Z" fill="#4ade80" stroke="#1f2937" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function MemoryMatch() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [cards, setCards] = useState<Card[]>(deal);
  const [layout, setLayout] = useState<Pos[]>(makeLayout);
  const [faceUp, setFaceUp] = useState<number[]>([]); // ids currently flipped
  const [flips, setFlips] = useState(0);
  const [locked, setLocked] = useState(false);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const doneRef = useRef(false);

  const allMatched = cards.every((c) => c.matched);

  const flip = (id: number) => {
    if (locked || outcome) return;
    const card = cards.find((c) => c.id === id)!;
    if (card.matched || faceUp.includes(id)) return;

    const next = [...faceUp, id];
    setFaceUp(next);
    if (next.length === 2) {
      setFlips((f) => f + 1);
      const [a, b] = next.map((i) => cards.find((c) => c.id === i)!);
      if (a.emoji === b.emoji) {
        const updated = cards.map((c) =>
          c.id === a.id || c.id === b.id ? { ...c, matched: true } : c,
        );
        setCards(updated);
        setFaceUp([]);
        if (updated.every((c) => c.matched) && !doneRef.current) {
          doneRef.current = true;
          const totalFlips = flips + 1;
          // ≤10 pair-flips is sharp play → full 8 XP; ≤14 → 6; else 4.
          const baseXp = totalFlips <= 10 ? 8 : totalFlips <= 14 ? 6 : 4;
          setTimeout(() => setOutcome(recordArcadePlay('memory', baseXp)), 350);
        }
      } else {
        setLocked(true);
        setTimeout(() => {
          setFaceUp([]);
          setLocked(false);
        }, 750);
      }
    }
  };

  const reset = () => {
    setCards(deal());
    setLayout(makeLayout());
    setFaceUp([]);
    setFlips(0);
    setLocked(false);
    setOutcome(null);
    doneRef.current = false;
  };

  return (
    <div>
      <ArcadeHeader title="Memory Match" emoji="🃏" />
      {outcome && allMatched ? (
        <ArcadeEndCard
          gameId="memory"
          outcome={outcome}
          win
          scoreLine={`All 8 pairs in ${flips} flips!`}
          onReplay={reset}
        />
      ) : (
        <>
          <p className="text-sm text-slate-600 mb-3">
            Flip two cards — find all 8 pairs hidden on the mountain. Fewer flips, more XP! Flips:{' '}
            <span className="font-display font-extrabold text-slate-900 tabular-nums">{flips}</span>
          </p>
          <div className="relative mx-auto aspect-[5/6] w-full max-w-md overflow-hidden rounded-3xl border-2 border-blue-200 shadow-inner">
            <MountainBg />
            {cards.map((card) => {
              const up = card.matched || faceUp.includes(card.id);
              const p = layout[card.id] ?? { x: 50, y: 50, rot: 0 };
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => flip(card.id)}
                  aria-label={up ? card.emoji : 'Hidden card'}
                  className="absolute h-[15%] w-[18%] [perspective:600px]"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
                    zIndex: up ? 20 : 10,
                  }}
                >
                  <motion.div
                    animate={{ rotateY: up ? 180 : 0, scale: up && !card.matched ? 1.08 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full w-full [transform-style:preserve-3d]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl border-2 border-blue-800 bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-display font-extrabold text-white shadow-md [backface-visibility:hidden]">
                      ?
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 text-2xl shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                        card.matched ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      {card.emoji}
                    </div>
                  </motion.div>
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            ≤10 flips: +8 XP · ≤14: +6 · otherwise +4
          </p>
        </>
      )}
    </div>
  );
}
