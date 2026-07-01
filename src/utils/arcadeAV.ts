import { useProgress } from '../state/progress';
import { tone, sweep, noiseBurst } from './sound';

// Arcade audio + haptics layer. Sounds are procedurally synthesized via WebAudio
// (no asset files — offline-friendly and tiny) and gated by the `soundEnabled`
// setting. Haptics use navigator.vibrate, gated by `hapticsEnabled`. Games call
// these freely; gating happens here.

function soundOn(): boolean {
  try {
    return useProgress.getState().soundEnabled;
  } catch {
    return false;
  }
}

function hapticsOn(): boolean {
  try {
    return useProgress.getState().hapticsEnabled !== false;
  } catch {
    return true;
  }
}

/** Fire a vibration pattern if haptics are enabled and supported. */
export function haptic(pattern: number | number[]): void {
  if (!hapticsOn()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

export const HAPTIC = {
  light: 8,
  tap: 12,
  hit: 18,
  pickup: 10,
  heavy: 35,
  explode: [0, 30, 25, 45] as number[],
  levelUp: [0, 20, 40, 25, 60] as number[],
  death: [0, 90, 50, 90] as number[],
  win: [0, 40, 30, 40, 30, 80] as number[],
};

// --- synthesized sound effects ---
export const sfx = {
  shoot() {
    if (!soundOn()) return;
    sweep(880, 320, 0.12, 0, 'square', 0.08);
  },
  laser() {
    if (!soundOn()) return;
    sweep(1200, 200, 0.18, 0, 'sawtooth', 0.07);
  },
  hit() {
    if (!soundOn()) return;
    tone(240, 0.07, 0, 'square', 0.1);
  },
  explode() {
    if (!soundOn()) return;
    noiseBurst(0.3, 0, 0.2, 900);
    tone(90, 0.25, 0, 'triangle', 0.12);
  },
  coin() {
    if (!soundOn()) return;
    tone(880, 0.06, 0, 'square', 0.08);
    tone(1320, 0.1, 0.06, 'square', 0.08);
  },
  pickup() {
    if (!soundOn()) return;
    sweep(500, 1100, 0.18, 0, 'sine', 0.1);
  },
  powerup() {
    if (!soundOn()) return;
    tone(523, 0.08, 0, 'square', 0.09);
    tone(659, 0.08, 0.07, 'square', 0.09);
    tone(988, 0.16, 0.14, 'square', 0.09);
  },
  levelUp() {
    if (!soundOn()) return;
    tone(523, 0.1, 0, 'triangle', 0.12);
    tone(659, 0.1, 0.1, 'triangle', 0.12);
    tone(784, 0.1, 0.2, 'triangle', 0.12);
    tone(1046, 0.28, 0.3, 'triangle', 0.12);
  },
  hurt() {
    if (!soundOn()) return;
    sweep(400, 110, 0.22, 0, 'triangle', 0.13);
  },
  step() {
    if (!soundOn()) return;
    tone(180, 0.03, 0, 'sine', 0.05);
  },
  build() {
    if (!soundOn()) return;
    tone(160, 0.06, 0, 'square', 0.08);
    tone(320, 0.05, 0.05, 'sine', 0.06);
  },
  // one raspy back-and-forth saw stroke through wood
  saw() {
    if (!soundOn()) return;
    sweep(1100, 700, 0.28, 0, 'sawtooth', 0.12);
    noiseBurst(0.25, 0.02, 0.07, 2200);
  },
  // short snap when a board is cut clean through
  cut() {
    if (!soundOn()) return;
    tone(200, 0.05, 0, 'square', 0.11);
    noiseBurst(0.12, 0, 0.12, 1500);
  },
  boss() {
    if (!soundOn()) return;
    noiseBurst(0.5, 0, 0.12, 400);
    tone(70, 0.5, 0, 'sawtooth', 0.12);
  },
  win() {
    if (!soundOn()) return;
    tone(523, 0.12, 0, 'square', 0.12);
    tone(659, 0.12, 0.12, 'square', 0.12);
    tone(784, 0.12, 0.24, 'square', 0.12);
    tone(1046, 0.34, 0.36, 'square', 0.12);
  },
  lose() {
    if (!soundOn()) return;
    tone(440, 0.16, 0, 'triangle', 0.12);
    tone(330, 0.16, 0.14, 'triangle', 0.12);
    tone(220, 0.34, 0.28, 'triangle', 0.12);
  },
};
