import { motion } from 'framer-motion';

export type MascotMood = 'happy' | 'thinking' | 'cheer' | 'oops' | 'sleep';

interface Props {
  mood: MascotMood;
  size?: number;
}

export function Mascot({ mood, size = 96 }: Props) {
  const animation =
    mood === 'cheer'
      ? { rotate: [-8, 8, -8, 8, 0], y: [0, -8, 0, -4, 0] }
      : mood === 'happy'
        ? { y: [0, -4, 0] }
        : mood === 'oops'
          ? { x: [-3, 3, -2, 2, 0] }
          : mood === 'thinking'
            ? { rotate: [0, -2, 0, 2, 0] }
            : {};

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={animation}
      transition={{
        duration: mood === 'cheer' ? 0.7 : 1.2,
        repeat: mood === 'thinking' ? Infinity : 0,
        repeatType: 'loop',
      }}
      className="inline-block"
    >
      <OwlSVG mood={mood} />
    </motion.div>
  );
}

function OwlSVG({ mood }: { mood: MascotMood }) {
  const eyesClosed = mood === 'sleep';
  const browAngle = mood === 'oops' ? -10 : mood === 'cheer' ? 6 : 0;
  const mouth =
    mood === 'cheer' || mood === 'happy'
      ? 'M40 64 Q50 76 60 64'
      : mood === 'oops'
        ? 'M42 70 Q50 64 58 70'
        : 'M44 68 L56 68';

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="50" cy="58" rx="38" ry="36" fill="#58CC02" />
      <ellipse cx="50" cy="64" rx="28" ry="26" fill="#FFFBEA" />
      {/* Ears (tufts) */}
      <path
        d="M20 30 L18 14 L34 24 Z"
        fill="#46A302"
        transform={`rotate(${browAngle} 25 24)`}
      />
      <path
        d="M80 30 L82 14 L66 24 Z"
        fill="#46A302"
        transform={`rotate(${-browAngle} 75 24)`}
      />
      {/* Eyes */}
      <circle cx="38" cy="46" r="10" fill="white" stroke="#0F172A" strokeWidth="2" />
      <circle cx="62" cy="46" r="10" fill="white" stroke="#0F172A" strokeWidth="2" />
      {eyesClosed ? (
        <>
          <path d="M30 46 Q38 50 46 46" stroke="#0F172A" strokeWidth="2" fill="none" />
          <path d="M54 46 Q62 50 70 46" stroke="#0F172A" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <circle cx="38" cy="47" r="4" fill="#0F172A" />
          <circle cx="62" cy="47" r="4" fill="#0F172A" />
          <circle cx="40" cy="45" r="1.5" fill="white" />
          <circle cx="64" cy="45" r="1.5" fill="white" />
        </>
      )}
      {/* Beak */}
      <polygon points="50,52 45,60 55,60" fill="#FF9600" stroke="#0F172A" strokeWidth="1.5" />
      {/* Mouth (when relevant) */}
      <path d={mouth} stroke="#0F172A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cheeks for cheer */}
      {mood === 'cheer' && (
        <>
          <circle cx="28" cy="62" r="4" fill="#FF9EC4" opacity="0.7" />
          <circle cx="72" cy="62" r="4" fill="#FF9EC4" opacity="0.7" />
        </>
      )}
      {/* Feet */}
      <path d="M40 92 L36 96 L44 96 Z" fill="#FF9600" />
      <path d="M60 92 L56 96 L64 96 Z" fill="#FF9600" />
    </svg>
  );
}
