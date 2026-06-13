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

export function MemoryMatch() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [cards, setCards] = useState<Card[]>(deal);
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
            Flip two cards — find all 8 pairs. Fewer flips, more XP! Flips:{' '}
            <span className="font-display font-extrabold text-slate-900 tabular-nums">{flips}</span>
          </p>
          <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto">
            {cards.map((card) => {
              const up = card.matched || faceUp.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => flip(card.id)}
                  aria-label={up ? card.emoji : 'Hidden card'}
                  className="aspect-square [perspective:600px]"
                >
                  <motion.div
                    animate={{ rotateY: up ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full [transform-style:preserve-3d]"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 border-2 border-blue-700 flex items-center justify-center text-white text-2xl font-display font-extrabold [backface-visibility:hidden]">
                      ?
                    </div>
                    <div
                      className={`absolute inset-0 rounded-2xl border-2 flex items-center justify-center text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                        card.matched ? 'bg-green-50 border-green-300' : 'bg-white border-slate-200'
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
