import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot, type MascotMood } from './Mascot';

interface Props {
  onDone: () => void;
}

const CARDS: { emoji: string; mood: MascotMood; title: string; body: string }[] = [
  {
    emoji: '🗺️',
    mood: 'happy',
    title: 'Welcome to 99 Days of Math!',
    body: 'Pick a trail to practice 6th-grade math. Each trail has units full of problems with hints and step-by-step help.',
  },
  {
    emoji: '⭐',
    mood: 'cheer',
    title: 'Earn stars & stickers',
    body: 'Answer without hints or mistakes to earn 3 stars. Collect 78 stickers across streaks, accuracy, XP, and more!',
  },
  {
    emoji: '⚡',
    mood: 'proud',
    title: 'Hit your daily goal',
    body: 'Earn XP every day to fill your goal ring and build a streak. A little practice each day adds up fast.',
  },
];

export function Onboarding({ onDone }: Props) {
  const [i, setI] = useState(0);
  const card = CARDS[i];
  const last = i === CARDS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-6"
        role="dialog"
        aria-label="Welcome tour"
      >
        <motion.div
          key={i}
          initial={{ scale: 0.85, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          className="bg-white rounded-3xl px-7 py-8 text-center max-w-sm w-full shadow-2xl"
        >
          <div className="flex justify-center">
            <Mascot mood={card.mood} size={88} oneShot />
          </div>
          <div className="text-5xl mt-2">{card.emoji}</div>
          <h2 className="text-xl font-display font-extrabold text-slate-900 mt-3">
            {card.title}
          </h2>
          <p className="text-slate-600 mt-2 text-sm">{card.body}</p>

          <div className="flex justify-center gap-2 mt-5">
            {CARDS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === i ? 'bg-duo-green' : 'bg-slate-300'}`}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => (last ? onDone() : setI(i + 1))}
              className="w-full min-h-12 px-6 py-2.5 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
            >
              {last ? "Let's go!" : 'Next'}
            </button>
            {!last && (
              <button
                type="button"
                onClick={onDone}
                className="text-sm font-display font-bold text-slate-400 hover:text-slate-600"
              >
                Skip
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
