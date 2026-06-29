import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot, type MascotKind } from './Mascots';

// A short, springy intro card shown before each lesson and each game. Big mascot
// (or emoji) hero + title; auto-dismisses after ~1.3s or on tap. Purely cosmetic.
export function HeroSplash({
  emoji,
  mascot,
  name,
  subtitle,
  gradient = 'from-fuchsia-500 to-indigo-600',
  onDone,
  duration = 1300,
}: {
  emoji: string;
  mascot?: MascotKind;
  name: string;
  subtitle?: string;
  gradient?: string;
  onDone: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const id = window.setTimeout(onDone, duration);
    return () => window.clearTimeout(id);
  }, [onDone, duration]);

  return (
    <motion.button
      type="button"
      onClick={onDone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${gradient} text-white`}
    >
      <motion.div
        initial={{ scale: 0.3, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="text-7xl drop-shadow-lg"
      >
        {mascot ? <Mascot kind={mascot} size={120} expr="cheer" /> : emoji}
      </motion.div>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-4 font-display font-extrabold text-3xl drop-shadow"
      >
        {name}
      </motion.div>
      {subtitle && (
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="mt-1 font-display font-bold text-white/85"
        >
          {subtitle}
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-10 text-xs font-display font-bold text-white/70"
      >
        tap to skip
      </motion.div>
    </motion.button>
  );
}

// A 3·2·1·GO! countdown with a cheering monkey mascot, shown before every game
// starts (and while it runs, the game is held paused). Calls onDone after "GO!".
const MONKEY_CHEERS = ['Get ready!', 'You got this!', "Let's go!", 'Have fun!', 'Go go go!'];

export function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  const [cheer] = useState(() => MONKEY_CHEERS[Math.floor(Math.random() * MONKEY_CHEERS.length)]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setN((v) => {
        if (v <= 1) {
          window.clearInterval(id);
          window.setTimeout(onDone, 650);
          return 0; // 0 → render "GO!"
        }
        return v - 1;
      });
    }, 750);
    return () => window.clearInterval(id);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900/55 backdrop-blur-[1px]">
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [-6, 6, -6] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        className="drop-shadow-lg"
      >
        <Mascot kind="monkey" size={84} expr="cheer" />
      </motion.div>
      <div className="mt-1 font-display font-extrabold text-white drop-shadow">{cheer}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={n}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16 }}
          className="mt-2 font-display font-extrabold text-white drop-shadow-lg"
          style={{ fontSize: 96, lineHeight: 1 }}
        >
          {n > 0 ? n : 'GO!'}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
