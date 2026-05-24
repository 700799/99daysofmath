import { DOMAINS, type Problem } from '../types/problem';

export const MOCK_TEST_SIZE = 15;
const PER_DOMAIN = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick a balanced mock test: PER_DOMAIN problems from each of the 5 domains,
// spread across difficulties where possible, then shuffled into one sequence.
export function pickMockTestProblems(all: Problem[]): Problem[] {
  const picks: Problem[] = [];
  for (const domain of DOMAINS) {
    const inDomain = all.filter((p) => p.domain === domain);
    const byDifficulty = [1, 2, 3].map((d) =>
      shuffle(inDomain.filter((p) => p.difficulty === d)),
    );
    const chosen: Problem[] = [];
    // Take one from each difficulty bucket first for a spread.
    for (const bucket of byDifficulty) {
      if (chosen.length < PER_DOMAIN && bucket.length > 0) {
        chosen.push(bucket.pop()!);
      }
    }
    // Fill any remaining slots from the leftover pool.
    const leftover = shuffle(inDomain.filter((p) => !chosen.includes(p)));
    while (chosen.length < PER_DOMAIN && leftover.length > 0) {
      chosen.push(leftover.pop()!);
    }
    picks.push(...chosen);
  }
  return shuffle(picks);
}

export type RitZone = {
  label: string;
  tone: 'green' | 'blue' | 'yellow' | 'orange';
  blurb: string;
};

// Rough, encouraging mapping from accuracy → MAP-style readiness label.
// NOT an official RIT score — a motivational estimate only.
export function ritZone(accuracy: number): RitZone {
  if (accuracy >= 0.9)
    return {
      label: 'Above grade level',
      tone: 'green',
      blurb: "You're crushing 6th-grade math — keep stretching!",
    };
  if (accuracy >= 0.7)
    return {
      label: 'On grade level',
      tone: 'blue',
      blurb: "Right on track for the MAP test. Nice work!",
    };
  if (accuracy >= 0.5)
    return {
      label: 'Approaching',
      tone: 'yellow',
      blurb: 'Getting there — review the misses and try again.',
    };
  return {
    label: 'Building skills',
    tone: 'orange',
    blurb: "Every expert started here. Practice a few units and retake!",
  };
}
