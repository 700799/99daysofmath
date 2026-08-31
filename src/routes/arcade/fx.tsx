import {
  createContext,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Shared arcade "juice" kit: real themed backgrounds, particle bursts, floating
// score pops, screen shake, and glossy tile styling. Dependency-free beyond
// framer-motion (already a project dependency). Used across every arcade game to
// replace flat colored boards with lively, consistent scenes.
// ---------------------------------------------------------------------------

export type StageTheme =
  | 'sky'
  | 'night'
  | 'ocean'
  | 'court'
  | 'cave'
  | 'space'
  | 'counter'
  | 'candy'
  | 'meadow';

// Map each game id to a themed scene so backgrounds feel intentional.
export const GAME_THEME: Record<string, StageTheme> = {
  runner: 'meadow',
  frogger: 'meadow',
  platformer: 'sky',
  racer: 'sky',
  tetris: 'night',
  snake: 'night',
  hippo: 'night',
  zapper: 'night',
  fishing: 'ocean',
  sushi: 'counter',
  boba: 'counter',
  shootout: 'court',
  digger: 'cave',
  tiles: 'space',
  bubbles: 'ocean',
  bricks: 'space',
  taiko: 'night',
  sudoku: 'candy',
  tangram: 'candy',
  memory: 'candy',
  connect4: 'candy',
  wheel: 'candy',
  tictactoe: 'meadow',
  kpop: 'candy',
  survival: 'meadow',
  fruit: 'ocean',
  survivors: 'night',
  town: 'candy',
  rogue: 'cave',
  space: 'space',
  sumo: 'meadow',
  monster: 'night',
  shinobi: 'night',
  turbo: 'sky',
  blitz: 'meadow',
  asteroids: 'space',
  wordle: 'meadow',
  hero: 'cave',
  escape: 'cave',
  tank: 'sky',
  rig: 'sky',
  mathpop: 'ocean',
  dress: 'candy',
};

interface SceneSpec {
  bg: string; // CSS background (gradient)
  deco: { emoji: string; top: string; size: number; dur: number; delay: number; drift: number }[];
}

const SCENES: Record<StageTheme, SceneSpec> = {
  sky: {
    bg: 'linear-gradient(180deg,#bae6fd 0%,#e0f2fe 55%,#dcfce7 100%)',
    deco: [
      { emoji: '☁️', top: '8%', size: 34, dur: 26, delay: 0, drift: 1 },
      { emoji: '☁️', top: '22%', size: 26, dur: 34, delay: 4, drift: 1 },
      { emoji: '🌤️', top: '4%', size: 30, dur: 40, delay: 2, drift: -1 },
    ],
  },
  meadow: {
    bg: 'linear-gradient(180deg,#bae6fd 0%,#d9f99d 70%,#86efac 100%)',
    deco: [
      { emoji: '☁️', top: '10%', size: 30, dur: 28, delay: 0, drift: 1 },
      { emoji: '🦋', top: '40%', size: 22, dur: 18, delay: 3, drift: -1 },
      { emoji: '🌸', top: '70%', size: 20, dur: 24, delay: 1, drift: 1 },
    ],
  },
  night: {
    bg: 'linear-gradient(180deg,#1e1b4b 0%,#312e81 60%,#4c1d95 100%)',
    deco: [
      { emoji: '⭐', top: '12%', size: 18, dur: 30, delay: 0, drift: 1 },
      { emoji: '✨', top: '28%', size: 16, dur: 22, delay: 2, drift: -1 },
      { emoji: '🌙', top: '6%', size: 28, dur: 50, delay: 1, drift: 1 },
    ],
  },
  ocean: {
    bg: 'linear-gradient(180deg,#7dd3fc 0%,#38bdf8 50%,#0369a1 100%)',
    deco: [
      { emoji: '🫧', top: '70%', size: 18, dur: 16, delay: 0, drift: 1 },
      { emoji: '🐠', top: '45%', size: 24, dur: 26, delay: 3, drift: -1 },
      { emoji: '🐚', top: '85%', size: 20, dur: 30, delay: 1, drift: 1 },
    ],
  },
  court: {
    bg: 'linear-gradient(180deg,#fed7aa 0%,#fdba74 55%,#c2410c 100%)',
    deco: [
      { emoji: '🏀', top: '14%', size: 24, dur: 24, delay: 0, drift: 1 },
      { emoji: '✨', top: '34%', size: 16, dur: 20, delay: 2, drift: -1 },
    ],
  },
  cave: {
    bg: 'linear-gradient(180deg,#78350f 0%,#451a03 60%,#1c1917 100%)',
    deco: [
      { emoji: '💎', top: '60%', size: 18, dur: 28, delay: 0, drift: 1 },
      { emoji: '✨', top: '30%', size: 14, dur: 22, delay: 2, drift: -1 },
      { emoji: '🪨', top: '80%', size: 22, dur: 36, delay: 1, drift: 1 },
    ],
  },
  space: {
    bg: 'linear-gradient(180deg,#0f172a 0%,#1e293b 55%,#4338ca 100%)',
    deco: [
      { emoji: '⭐', top: '16%', size: 16, dur: 26, delay: 0, drift: 1 },
      { emoji: '🪐', top: '8%', size: 30, dur: 48, delay: 2, drift: -1 },
      { emoji: '✨', top: '40%', size: 14, dur: 20, delay: 1, drift: 1 },
    ],
  },
  counter: {
    bg: 'linear-gradient(180deg,#fbcfe8 0%,#fce7f3 55%,#fef9c3 100%)',
    deco: [
      { emoji: '🧋', top: '12%', size: 26, dur: 30, delay: 0, drift: 1 },
      { emoji: '🍡', top: '34%', size: 22, dur: 26, delay: 2, drift: -1 },
      { emoji: '✨', top: '60%', size: 16, dur: 20, delay: 1, drift: 1 },
    ],
  },
  candy: {
    bg: 'linear-gradient(180deg,#ddd6fe 0%,#fbcfe8 55%,#bfdbfe 100%)',
    deco: [
      { emoji: '🍬', top: '14%', size: 22, dur: 28, delay: 0, drift: 1 },
      { emoji: '⭐', top: '36%', size: 16, dur: 22, delay: 2, drift: -1 },
      { emoji: '🌈', top: '6%', size: 28, dur: 44, delay: 1, drift: 1 },
    ],
  },
};

/**
 * Wraps a game's play area in a real themed background scene (gradient + drifting
 * decorative characters) and a rounded, shadowed frame. Pass the game id or a
 * theme key; unknown ids fall back to a soft candy theme.
 */
export function GameStage({
  theme,
  children,
  className = '',
  style,
}: {
  theme: StageTheme | string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const key = (GAME_THEME[theme] ?? (theme as StageTheme)) in SCENES
    ? (GAME_THEME[theme] ?? (theme as StageTheme))
    : 'candy';
  const scene = SCENES[key as StageTheme];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className={`relative overflow-hidden rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${className}`}
      style={{ background: scene.bg, ...style }}
    >
      {/* drifting decorative characters for depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {scene.deco.map((d, i) => (
          <motion.div
            key={i}
            className="absolute select-none opacity-70"
            style={{ top: d.top, fontSize: d.size, left: '-12%' }}
            animate={{ x: ['0vw', '120vw'], y: [0, d.drift * 8, 0] }}
            transition={{
              duration: d.dur,
              delay: d.delay,
              repeat: Infinity,
              ease: 'linear',
              y: { duration: d.dur / 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
            }}
          >
            {d.emoji}
          </motion.div>
        ))}
      </div>
      {/* soft inner vignette */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.12)' }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

// --- particle bursts ------------------------------------------------------

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  emoji?: string;
  color?: string;
  size: number;
}

interface BurstApi {
  burst: (x: number, y: number, opts?: { emoji?: string; color?: string; count?: number }) => void;
  particles: Particle[];
}

const BurstContext = createContext<BurstApi | null>(null);

/**
 * Lightweight particle system. Call `burst(x, y, {...})` at a screen point (px,
 * relative to the BurstLayer's positioned parent) on a key event. Render
 * `<BurstLayer/>` once inside the same relatively-positioned container.
 */
export function useBurst(): BurstApi {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const burst = useCallback(
    (x: number, y: number, opts?: { emoji?: string; color?: string; count?: number }) => {
      const count = opts?.count ?? 12;
      const next: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const ang = (Math.PI * 2 * i) / count + (i % 2 ? 0.3 : 0);
        const spd = 28 + (i % 4) * 14;
        next.push({
          id: idRef.current++,
          x,
          y,
          dx: Math.cos(ang) * spd,
          dy: Math.sin(ang) * spd,
          emoji: opts?.emoji,
          color: opts?.color ?? '#fbbf24',
          size: opts?.emoji ? 18 + (i % 3) * 4 : 8 + (i % 3) * 3,
        });
      }
      setParticles((p) => [...p, ...next]);
      const ids = new Set(next.map((n) => n.id));
      window.setTimeout(() => setParticles((p) => p.filter((q) => !ids.has(q.id))), 700);
    },
    [],
  );
  return { burst, particles };
}

export function BurstLayer({ api }: { api: BurstApi }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-30" aria-hidden>
      <AnimatePresence>
        {api.particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
            animate={{ x: p.x + p.dx, y: p.y + p.dy + 30, scale: 0.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="absolute left-0 top-0 select-none"
            style={
              p.emoji
                ? { fontSize: p.size }
                : { width: p.size, height: p.size, borderRadius: 9999, background: p.color }
            }
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- floating score pops --------------------------------------------------

export interface ScorePopItem {
  id: number;
  x: number;
  y: number;
  text: string;
  color?: string;
}

export function useScorePops() {
  const [pops, setPops] = useState<ScorePopItem[]>([]);
  const idRef = useRef(0);
  const pop = useCallback((x: number, y: number, text: string, color?: string) => {
    const id = idRef.current++;
    setPops((p) => [...p, { id, x, y, text, color }]);
    window.setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 900);
  }, []);
  return { pops, pop };
}

export function ScorePopLayer({ pops }: { pops: ScorePopItem[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-30" aria-hidden>
      <AnimatePresence>
        {pops.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 0, scale: 0.6 }}
            animate={{ y: p.y - 44, opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute left-0 top-0 font-display font-extrabold text-lg drop-shadow"
            style={{ color: p.color ?? '#16a34a' }}
          >
            {p.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- screen shake ---------------------------------------------------------

/**
 * Brief screen-shake. Spread `style` onto the element you want to shake and call
 * `shake()` on a damaging hit.
 */
export function useShake(): { style: CSSProperties; shake: () => void } {
  const [on, setOn] = useState(false);
  const shake = useCallback(() => {
    setOn(true);
    window.setTimeout(() => setOn(false), 320);
  }, []);
  const style: CSSProperties = on ? { animation: 'arcade-shake 0.32s ease-in-out' } : {};
  return { style, shake };
}

// --- combos / streaks -----------------------------------------------------

export interface ComboApi {
  combo: number; // current streak length
  mult: number; // score multiplier derived from the streak
  hit: () => number; // register a success; returns the new streak length
  reset: () => void; // break the streak (call on a miss/mistake)
}

/**
 * Shared streak/combo tracker so every action game gets consistent combos.
 * Call `hit()` on each success (within `windowMs` of the previous hit to keep the
 * streak alive), `reset()` on a miss. `mult` climbs by 1 every `step` hits up to
 * `max`. Pair with <ComboChip combo={combo}/> for a 🔥 HUD badge.
 */
export function useCombo(opts?: { windowMs?: number; step?: number; max?: number }): ComboApi {
  const windowMs = opts?.windowMs ?? 2500;
  const step = opts?.step ?? 3;
  const max = opts?.max ?? 5;
  const [combo, setCombo] = useState(0);
  const comboRef = useRef(0);
  const lastRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    comboRef.current = 0;
    setCombo(0);
  }, []);
  const hit = useCallback(() => {
    const now = performance.now();
    comboRef.current = now - lastRef.current <= windowMs ? comboRef.current + 1 : 1;
    lastRef.current = now;
    setCombo(comboRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      comboRef.current = 0;
      setCombo(0);
    }, windowMs);
    return comboRef.current;
  }, [windowMs]);
  const mult = Math.min(max, 1 + Math.floor(Math.max(0, combo - 1) / step));
  return { combo, mult, hit, reset };
}

/** Animated 🔥 combo badge; renders only once the streak is worth showing (≥2). */
export function ComboChip({ combo, className = '' }: { combo: number; className?: string }) {
  return (
    <AnimatePresence>
      {combo >= 2 && (
        <motion.div
          key="combo"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16 }}
          className={`pointer-events-none z-30 select-none rounded-full bg-orange-500/90 px-3 py-1 font-display text-sm font-extrabold text-white shadow-lg ${className}`}
        >
          🔥 {combo}× combo
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- glossy tiles ---------------------------------------------------------

/** Glossy gradient + glow tile style for grid games. */
export function tileStyle(color: string, glow = false): CSSProperties {
  return {
    background: `linear-gradient(160deg, ${color} 0%, ${shade(color, -16)} 100%)`,
    boxShadow: glow
      ? `inset 0 2px 4px rgba(255,255,255,0.45), 0 2px 6px rgba(0,0,0,0.18), 0 0 12px ${color}aa`
      : 'inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 5px rgba(0,0,0,0.18)',
  };
}

// Darken/lighten a #rrggbb hex by a percent (-100..100).
function shade(hex: string, pct: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return hex;
  const adj = (v: number) => Math.max(0, Math.min(255, Math.round(v + (pct / 100) * 255)));
  const r = adj(parseInt(m[1], 16));
  const g = adj(parseInt(m[2], 16));
  const b = adj(parseInt(m[3], 16));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

// Directional finger-swipe (and tap) for any board element. Pointer-capture based
// so it works on touch (avoids the `e.buttons === 0` pitfall). Spread the returned
// handlers onto the play-area element.
export function useSwipe(
  onDir: (d: 'up' | 'down' | 'left' | 'right') => void,
  opts?: { threshold?: number; onTap?: () => void },
) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const threshold = opts?.threshold ?? 24;
  return {
    onPointerDown: (e: ReactPointerEvent) => {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: ReactPointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) {
        opts?.onTap?.();
        return;
      }
      onDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    },
  };
}

export { BurstContext };
