import { motion, useReducedMotion } from 'framer-motion';

export type MascotMood =
  | 'happy'
  | 'thinking'
  | 'cheer'
  | 'oops'
  | 'sleep'
  | 'helpful'
  | 'coach'
  | 'mentor'
  | 'proud'
  | 'wow';

interface Props {
  mood: MascotMood;
  size?: number;
  oneShot?: boolean;
}

type AnimSpec = {
  rotate?: number[];
  x?: number[];
  y?: number[];
  scale?: number[];
};

const MOOD_ANIMATIONS: Record<MascotMood, AnimSpec> = {
  cheer: { rotate: [-8, 8, -8, 8, 0], y: [0, -8, 0, -4, 0] },
  happy: { y: [0, -4, 0] },
  oops: { x: [-3, 3, -2, 2, 0] },
  thinking: { rotate: [0, -2, 0, 2, 0] },
  helpful: { y: [0, -3, 0], rotate: [0, -3, 0] },
  coach: { scale: [1, 1.06, 1], y: [0, -2, 0] },
  mentor: { y: [0, -2, 0], rotate: [-1, 1, -1, 0] },
  proud: { scale: [1, 1.15, 1], y: [0, -10, 0] },
  wow: { scale: [1, 1.18, 1] },
  sleep: {},
};

const REPEATING: Set<MascotMood> = new Set(['thinking']);

export function Mascot({ mood, size = 96, oneShot = false }: Props) {
  const reduce = useReducedMotion();
  const animation = reduce ? {} : MOOD_ANIMATIONS[mood];
  const repeat = !oneShot && REPEATING.has(mood) ? Infinity : 0;

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={animation}
      transition={{
        duration: mood === 'cheer' || mood === 'wow' ? 0.7 : 1.2,
        repeat,
        repeatType: 'loop',
      }}
      className="inline-block"
      aria-label={`Owl mascot, ${mood}`}
      role="img"
    >
      <OwlSVG mood={mood} />
    </motion.div>
  );
}

function OwlSVG({ mood }: { mood: MascotMood }) {
  const eyesClosed = mood === 'sleep';
  const eyesWide = mood === 'wow';
  const browAngle =
    mood === 'oops'
      ? -10
      : mood === 'cheer' || mood === 'proud'
        ? 6
        : mood === 'helpful' || mood === 'coach' || mood === 'mentor'
          ? 4
          : 0;
  const mouth = mouthForMood(mood);
  const eyeRadius = eyesWide ? 12 : 10;
  const pupilRadius = eyesWide ? 5 : 4;

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <title>{`Owl mascot ${mood}`}</title>
      {/* Body */}
      <ellipse cx="50" cy="58" rx="38" ry="36" fill="#5F8C5A" />
      <ellipse cx="50" cy="64" rx="28" ry="26" fill="#F2EFE6" />
      {/* Ears (tufts) */}
      <path
        d="M20 30 L18 14 L34 24 Z"
        fill="#4C7247"
        transform={`rotate(${browAngle} 25 24)`}
      />
      <path
        d="M80 30 L82 14 L66 24 Z"
        fill="#4C7247"
        transform={`rotate(${-browAngle} 75 24)`}
      />
      {/* Eyes */}
      <circle cx="38" cy="46" r={eyeRadius} fill="white" stroke="#15171B" strokeWidth="2" />
      <circle cx="62" cy="46" r={eyeRadius} fill="white" stroke="#15171B" strokeWidth="2" />
      {eyesClosed ? (
        <>
          <path d="M30 46 Q38 50 46 46" stroke="#15171B" strokeWidth="2" fill="none" />
          <path d="M54 46 Q62 50 70 46" stroke="#15171B" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <circle cx="38" cy="47" r={pupilRadius} fill="#15171B" />
          <circle cx="62" cy="47" r={pupilRadius} fill="#15171B" />
          <circle cx="40" cy="45" r="1.5" fill="white" />
          <circle cx="64" cy="45" r="1.5" fill="white" />
        </>
      )}
      {/* Beak */}
      <polygon points="50,52 45,60 55,60" fill="#B07C4F" stroke="#15171B" strokeWidth="1.5" />
      {/* Mouth */}
      <path d={mouth} stroke="#15171B" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Accessories */}
      {(mood === 'cheer' || mood === 'proud') && (
        <>
          <circle cx="28" cy="62" r="4" fill="#C98BA5" opacity="0.7" />
          <circle cx="72" cy="62" r="4" fill="#C98BA5" opacity="0.7" />
        </>
      )}
      {mood === 'mentor' && (
        <>
          {/* Glasses bridge over the eyes */}
          <circle cx="38" cy="46" r="11" fill="none" stroke="#15171B" strokeWidth="1.5" />
          <circle cx="62" cy="46" r="11" fill="none" stroke="#15171B" strokeWidth="1.5" />
          <line x1="48" y1="46" x2="52" y2="46" stroke="#15171B" strokeWidth="1.5" />
        </>
      )}
      {mood === 'coach' && (
        // tiny whistle hanging
        <>
          <line x1="50" y1="70" x2="40" y2="84" stroke="#15171B" strokeWidth="1.5" />
          <circle cx="40" cy="86" r="3" fill="#C0C0C0" stroke="#15171B" strokeWidth="1" />
        </>
      )}
      {mood === 'helpful' && (
        // small raised wing pointer (right side)
        <path
          d="M78 60 Q88 50 92 56 L86 64 Z"
          fill="#4C7247"
          stroke="#15171B"
          strokeWidth="1"
        />
      )}
      {mood === 'proud' && (
        // sparkles
        <>
          <text x="16" y="20" fontSize="10" fill="#C9A227">✦</text>
          <text x="80" y="22" fontSize="10" fill="#C9A227">✦</text>
        </>
      )}
      {mood === 'wow' && (
        // exclamation sparks
        <>
          <text x="18" y="22" fontSize="14" fill="#A8443C">!</text>
          <text x="78" y="22" fontSize="14" fill="#A8443C">!</text>
        </>
      )}
      {/* Feet */}
      <path d="M40 92 L36 96 L44 96 Z" fill="#B07C4F" />
      <path d="M60 92 L56 96 L64 96 Z" fill="#B07C4F" />
    </svg>
  );
}

function mouthForMood(mood: MascotMood): string {
  switch (mood) {
    case 'cheer':
    case 'happy':
    case 'helpful':
    case 'proud':
      return 'M40 64 Q50 76 60 64';
    case 'oops':
      return 'M42 70 Q50 64 58 70';
    case 'wow':
      return 'M46 66 Q50 76 54 66 Q50 70 46 66';
    case 'coach':
    case 'mentor':
      return 'M44 66 Q50 70 56 66';
    case 'thinking':
    case 'sleep':
    default:
      return 'M44 68 L56 68';
  }
}
