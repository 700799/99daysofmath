import { describe, it, expect } from 'vitest';
import { nextTarget, pickAdaptiveProblem } from '../src/utils/adaptive';
import type { Problem } from '../src/types/problem';

function mkProblem(id: string, difficulty: 1 | 2 | 3): Problem {
  return {
    id,
    domain: '6.RP',
    standard: '6.RP.A.1',
    unit: 1,
    orderInUnit: 1,
    difficulty,
    prompt: '',
    answerType: 'numeric',
    primaryAnswer: '',
    alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hint: '',
    explanation: [],
    tags: [],
    estimatedSeconds: 30,
  } as Problem;
}

describe('nextTarget', () => {
  it('rises after a correct answer and falls after a wrong one', () => {
    expect(nextTarget(2, true)).toBeGreaterThan(2);
    expect(nextTarget(2, false)).toBeLessThan(2);
  });
  it('clamps to the 1..3 scale', () => {
    expect(nextTarget(3, true)).toBe(3);
    expect(nextTarget(1, false)).toBe(1);
  });
});

describe('pickAdaptiveProblem', () => {
  const pool = [
    mkProblem('e1', 1),
    mkProblem('e2', 1),
    mkProblem('m1', 2),
    mkProblem('h1', 3),
    mkProblem('h2', 3),
  ];

  it('never repeats a problem already seen this session', () => {
    const seen = new Set<string>();
    const picks: string[] = [];
    for (let i = 0; i < pool.length; i++) {
      const p = pickAdaptiveProblem(pool, seen, 2, {});
      expect(p).not.toBeNull();
      expect(seen.has(p!.id)).toBe(false);
      seen.add(p!.id);
      picks.push(p!.id);
    }
    expect(new Set(picks).size).toBe(pool.length);
    expect(pickAdaptiveProblem(pool, seen, 2, {})).toBeNull();
  });

  it('targets the requested difficulty', () => {
    // With target 3, the difficulty gap dominates the small jitter/struggle terms.
    const p = pickAdaptiveProblem(pool, new Set<string>(), 3, {});
    expect(p!.difficulty).toBe(3);
  });
});
