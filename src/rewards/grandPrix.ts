// Tuning + payout for the Math Grand Prix race reward. The race is real-time:
// CPU karts creep forward steadily while the player only advances by answering
// math challenges, so solving quickly is what wins the race.

import type { IconName } from '../icons/registry';

export const GRAND_PRIX_CONFIG = {
  /** Track distance in abstract units the karts race across. */
  trackLength: 100,
  /** Distance a correct answer boosts the player's kart. */
  boostPerCorrect: 11,
  /** Distance lost on a wrong answer (kart briefly stalls/slips back). */
  penaltyPerWrong: 3,
  /** CPU speeds in units per second (tuned so a steady solver wins). */
  cpuSpeeds: [4.6, 5.4],
  /** Small jitter (± fraction) applied to CPU speed each tick. */
  cpuJitter: 0.35,
  rivals: [
    { name: 'Turbo', icon: 'turtle' },
    { name: 'Zoom', icon: 'rabbit' },
  ] as { name: string; icon: IconName }[],
};

/** Persistent coin payout for finishing the race in `place` (1-based). */
export function grandPrixPayout(place: number): number {
  if (place <= 1) return 25;
  if (place === 2) return 12;
  return 6;
}
