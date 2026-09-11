import { motion, useReducedMotion } from 'framer-motion';
import { Astronaut, type AstronautProps } from './astro/Astronaut';

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

// What each mood looks like on the astronaut. The props are mathematics —
// a calculator, π, a graph — never money.
const LOOK: Record<MascotMood, Omit<AstronautProps, 'size'>> = {
  happy: { expr: 'happy' },
  thinking: { expr: 'thinking', prop: 'calculator' },
  cheer: { expr: 'cheer', pose: 'arms-up', sparkle: true },
  oops: { expr: 'oops' },
  sleep: { expr: 'sleep' },
  helpful: { expr: 'happy', pose: 'point', prop: 'pi' },
  coach: { expr: 'happy', pose: 'point', prop: 'sigma', star: true },
  mentor: { expr: 'happy', glasses: true, prop: 'graph' },
  proud: { expr: 'cheer', pose: 'arms-up', star: true, sparkle: true },
  wow: { expr: 'wow' },
};

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
      aria-label={`Astronaut mascot, ${mood}`}
      role="img"
    >
      <Astronaut {...LOOK[mood]} square size={size} title={`Astronaut mascot ${mood}`} />
    </motion.div>
  );
}
