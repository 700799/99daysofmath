import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

interface MemoryTheme {
  name: string;
  emoji: string[];
}

const THEMES: MemoryTheme[] = [
  {
    name: 'Math',
    emoji: ['➗', '📐', '🔢', '⚖️', '📊', '🧮', '🎯', '⭐'],
  },
  {
    name: 'Animals',
    emoji: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  },
  {
    name: 'Sports',
    emoji: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🥎'],
  },
  {
    name: 'Food',
    emoji: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍓', '🍒', '🍰'],
  },
  {
    name: 'Space',
    emoji: ['🌟', '🌙', '⭐', '☄️', '🪐', '🛸', '🚀', '🛰️'],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function deal(emoji: string[]): Card[] {
  return shuffle([...emoji, ...emoji]).map((e, id) => ({ id, emoji: e, matched: false }));
}

export function MemoryMatch() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem('memory_theme');
    return saved ? Math.min(parseInt(saved), THEMES.length - 1) : 0;
  });
  const [showThemeSelector, setShowThemeSelector] = useState(true);
  const theme = THEMES[themeIdx];
  const [cards, setCards] = useState<Card[]>(() => deal(theme.emoji));
  const [faceUp, setFaceUp] = useState<number[]>([]); // ids currently flipped
  const [flips, setFlips] = useState(0);
  const [locked, setLocked] = useState(false);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const doneRef = useRef(false);

  const selectTheme = (idx: number) => {
    setThemeIdx(idx);
    localStorage.setItem('memory_theme', idx.toString());
    setShowThemeSelector(false);
    setCards(deal(THEMES[idx].emoji));
  };

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
    setCards(deal(theme.emoji));
    setFaceUp([]);
    setFlips(0);
    setLocked(false);
    setOutcome(null);
    doneRef.current = false;
    setShowThemeSelector(true);
  };

  return (
    <div>
      <ArcadeHeader title={`${theme.name} Memory`} emoji="🃏" />
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
          {showThemeSelector && (
            <div className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
              <p className="text-sm font-display font-bold text-slate-900 mb-3">Pick your emoji set:</p>
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
                    <span className="text-2xl block mb-1">{t.emoji[0]}</span>
                    <span className="text-slate-700">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
                  disabled={showThemeSelector}
                  aria-label={up ? card.emoji : 'Hidden card'}
                  className="aspect-square [perspective:600px] disabled:opacity-50"
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
