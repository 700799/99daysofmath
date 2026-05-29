// Quick mental-math challenges for the reward games. Kept separate from the
// graded problem bank: these are fast, single-step, always integer-valued, and
// generated on the fly so a board game or race never runs out.

export type RNG = () => number; // returns a float in [0, 1)

export type ChallengeDifficulty = 1 | 2 | 3;

export interface Challenge {
  /** Display string, e.g. "7 × 8". Uses ×, ÷, − for a clean look. */
  prompt: string;
  /** The single correct integer answer. */
  answer: number;
}

function randInt(rng: RNG, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Generate one mental-math challenge tuned for a 5th–6th grader.
 *  - 1 (Easy):   addition / subtraction within ~20
 *  - 2 (Medium): times tables to 12, two-digit ± , simple division
 *  - 3 (Hard):   two-digit × one-digit, harder division, two-step add
 * Every challenge has a non-negative integer answer.
 */
export function makeChallenge(
  difficulty: ChallengeDifficulty,
  rng: RNG = Math.random,
): Challenge {
  if (difficulty === 1) {
    if (rng() < 0.5) {
      const a = randInt(rng, 2, 12);
      const b = randInt(rng, 2, 12);
      return { prompt: `${a} + ${b}`, answer: a + b };
    }
    const a = randInt(rng, 6, 20);
    const b = randInt(rng, 1, a);
    return { prompt: `${a} − ${b}`, answer: a - b };
  }

  if (difficulty === 2) {
    const r = rng();
    if (r < 0.5) {
      const a = randInt(rng, 3, 12);
      const b = randInt(rng, 3, 12);
      return { prompt: `${a} × ${b}`, answer: a * b };
    }
    if (r < 0.8) {
      const a = randInt(rng, 21, 89);
      const b = randInt(rng, 11, 49);
      return rng() < 0.5
        ? { prompt: `${a} + ${b}`, answer: a + b }
        : { prompt: `${a + b} − ${b}`, answer: a };
    }
    const b = randInt(rng, 2, 9);
    const q = randInt(rng, 2, 9);
    return { prompt: `${b * q} ÷ ${b}`, answer: q };
  }

  // difficulty === 3
  const r = rng();
  if (r < 0.45) {
    const a = randInt(rng, 11, 29);
    const b = randInt(rng, 3, 9);
    return { prompt: `${a} × ${b}`, answer: a * b };
  }
  if (r < 0.75) {
    const b = randInt(rng, 3, 12);
    const q = randInt(rng, 4, 12);
    return { prompt: `${b * q} ÷ ${b}`, answer: q };
  }
  const a = randInt(rng, 12, 60);
  const b = randInt(rng, 12, 60);
  const c = randInt(rng, 2, 20);
  return { prompt: `${a} + ${b} − ${c}`, answer: a + b - c };
}

/** True when `input` (raw text) matches the challenge's integer answer. */
export function isChallengeCorrect(input: string, challenge: Challenge): boolean {
  const cleaned = input.replace(/[−–—]/g, '-').trim();
  if (cleaned === '') return false;
  const value = Number(cleaned);
  return Number.isFinite(value) && value === challenge.answer;
}
