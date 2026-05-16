import { motion } from 'framer-motion';

const EMOJIS = ['⭐', '🎉', '✨', '🌟', '💫', '🎊', '🦄', '🚀'];

interface Props {
  count?: number;
}

export function Confetti({ count = 16 }: Props) {
  const pieces = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const emoji = EMOJIS[i % EMOJIS.length];
        const angle = (i / count) * Math.PI * 2;
        const distance = 120 + Math.random() * 80;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 40;
        const delay = (i % 6) * 0.02;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-2xl select-none"
            initial={{ opacity: 1, x: -12, y: -12, scale: 0.5, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              x: dx,
              y: dy,
              scale: [0.5, 1.2, 1],
              rotate: Math.random() > 0.5 ? 360 : -360,
            }}
            transition={{ duration: 1.1, delay, ease: 'easeOut' }}
            aria-hidden="true"
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}
