import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// A short "math break" the parent can schedule during play: a quick fact about a
// famous mathematician or a fun math story/fact. Factual one-liners (not from any
// copyrighted text). Shown as an overlay; tap Continue to resume the game.

type Break = { emoji: string; title: string; body: string };

const PEOPLE: Break[] = [
  { emoji: '📐', title: 'Euclid (~300 BC)', body: 'He wrote “The Elements,” which taught geometry with step-by-step proofs for over 2,000 years.' },
  { emoji: '🍎', title: 'Isaac Newton', body: 'He helped invent calculus — the math of how things change and move.' },
  { emoji: '📊', title: 'Leonhard Euler', body: 'One of the most productive mathematicians ever; we still use his symbols like e and π today.' },
  { emoji: '🔢', title: 'Carl Friedrich Gauss', body: 'As a child he added 1+2+…+100 in seconds by pairing numbers into tens of equal sums.' },
  { emoji: '💻', title: 'Ada Lovelace', body: 'She wrote the first computer algorithm — long before computers existed!' },
  { emoji: '🌀', title: 'Katherine Johnson', body: 'Her hand calculations helped send astronauts safely to space and back.' },
  { emoji: '♾️', title: 'Emmy Noether', body: 'A brilliant algebraist whose ideas connect symmetry to the laws of physics.' },
  { emoji: '🔺', title: 'Pythagoras', body: 'Famous for the rule about right triangles: a² + b² = c².' },
  { emoji: '🧮', title: 'Al-Khwarizmi', body: 'The word “algorithm” comes from his name, and “algebra” from his book’s title.' },
  { emoji: '🎼', title: 'Srinivasa Ramanujan', body: 'A self-taught genius who discovered thousands of amazing number patterns.' },
];

const FACTS: Break[] = [
  { emoji: '🥧', title: 'Pi never ends', body: 'π = 3.14159… goes on forever and never repeats. It links every circle to its width.' },
  { emoji: '0️⃣', title: 'The power of zero', body: 'Zero took a long time to invent — it lets us write big numbers like 105 and 1000.' },
  { emoji: '🐚', title: 'Fibonacci spirals', body: '1, 1, 2, 3, 5, 8, 13… each number is the sum of the two before. You can find it in pinecones and shells!' },
  { emoji: '♾️', title: 'Infinity is weird', body: 'There are infinitely many numbers — and even more numbers between 0 and 1 than you can count!' },
  { emoji: '✖️', title: 'Multiplying by 9', body: 'The digits of 9× answers always add up to 9: 9×3=27, and 2+7=9.' },
  { emoji: '🔷', title: 'Prime numbers', body: 'A prime can only be divided by 1 and itself: 2, 3, 5, 7, 11… and there are infinitely many.' },
  { emoji: '⚖️', title: 'Symmetry', body: 'Math describes symmetry — the balanced patterns in snowflakes, butterflies, and faces.' },
];

// Remember which breaks have been shown so a forced break is one they haven't
// seen yet; once every break has been seen, the pool resets.
const ALL_BREAKS: Break[] = [...PEOPLE, ...FACTS];
const seenBreaks = new Set<string>();
function pickUnseen(): Break {
  let pool = ALL_BREAKS.filter((b) => !seenBreaks.has(b.title));
  if (pool.length === 0) { seenBreaks.clear(); pool = ALL_BREAKS; }
  const item = pool[Math.floor(Math.random() * pool.length)];
  seenBreaks.add(item.title);
  return item;
}

export function MathBreak({ onDone, minSeconds = 0 }: { onDone: () => void; minSeconds?: number }) {
  const [item] = useState(pickUnseen);
  const [left, setLeft] = useState(Math.max(0, Math.round(minSeconds)));
  useEffect(() => {
    if (left <= 0) return;
    const id = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(id);
  }, [left]);
  const ready = left <= 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
        className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl"
      >
        <div className="text-xs font-display font-extrabold uppercase tracking-wider text-indigo-500">
          🧠 Math Break
        </div>
        <div className="text-5xl mt-2">{item.emoji}</div>
        <div className="mt-2 font-display font-extrabold text-lg text-slate-900">{item.title}</div>
        <div className="mt-1 text-sm text-slate-600 leading-snug">{item.body}</div>
        <button
          type="button"
          onClick={onDone}
          disabled={!ready}
          className="mt-5 w-full min-h-12 rounded-2xl bg-emerald-500 enabled:hover:bg-emerald-600 text-white font-display font-extrabold shadow enabled:active:translate-y-0.5 disabled:bg-slate-300"
        >
          {ready ? 'Keep playing ▶' : `Read… ${left}s`}
        </button>
      </motion.div>
    </div>
  );
}
