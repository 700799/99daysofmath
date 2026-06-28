import { useEffect } from 'react';
import { motion } from 'framer-motion';

// A short, springy intro card shown before each lesson and each game. Big emoji
// hero + title; auto-dismisses after ~1.3s or on tap. Purely cosmetic.
export function HeroSplash({
  emoji,
  name,
  subtitle,
  gradient = 'from-fuchsia-500 to-indigo-600',
  onDone,
  duration = 1300,
}: {
  emoji: string;
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
        {emoji}
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
