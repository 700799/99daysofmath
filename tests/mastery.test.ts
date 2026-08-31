import { describe, it, expect } from 'vitest';
import { clusterOf, skillBreakdown, recommendedFocus } from '../src/utils/mastery';
import { estimateRit, RIT_MIN, RIT_MAX } from '../src/utils/mockTest';
import type { Problem, Domain } from '../src/types/problem';
import type { ProblemStat } from '../src/state/progress';

function mkProblem(id: string, domain: Domain, standard: string): Problem {
  return {
    id,
    domain,
    standard,
    unit: 1,
    orderInUnit: 1,
    difficulty: 2,
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

function stat(attempts: number, correct: number): ProblemStat {
  return {
    attempts,
    correct,
    lastResult: correct >= attempts ? 'correct' : 'wrong',
    lastSeen: '2026-05-01',
    box: 0,
    due: null,
  };
}

describe('clusterOf', () => {
  it('reduces a standard to its cluster', () => {
    expect(clusterOf('6.RP.A.3.c')).toBe('6.RP.A');
    expect(clusterOf('6.EE.B.7')).toBe('6.EE.B');
    expect(clusterOf('6.G.A.1')).toBe('6.G.A');
  });
});

describe('skillBreakdown', () => {
  const problems = [
    mkProblem('a', '6.RP', '6.RP.A.1'),
    mkProblem('b', '6.RP', '6.RP.A.3'),
    mkProblem('c', '6.NS', '6.NS.B.4'),
    mkProblem('d', '6.G', '6.G.A.1'),
  ];

  it('aggregates by cluster and flags <3 attempts as unassessed', () => {
    const stats: Record<string, ProblemStat> = {
      a: stat(2, 2),
      b: stat(2, 1), // 6.RP.A total: 4 attempts, 3 correct = 75%
      c: stat(1, 0), // 6.NS.B: 1 attempt → unassessed
    };
    const { byCluster, byDomain } = skillBreakdown(stats, problems);

    const rpA = byCluster.find((c) => c.key === '6.RP.A')!;
    expect(rpA.attempts).toBe(4);
    expect(rpA.correct).toBe(3);
    expect(rpA.accuracy).toBeCloseTo(0.75);
    expect(rpA.level).toBe('on-track');

    const nsB = byCluster.find((c) => c.key === '6.NS.B')!;
    expect(nsB.level).toBe('unassessed');

    const rp = byDomain.find((d) => d.key === '6.RP')!;
    expect(rp.attempts).toBe(4);
  });

  it('includes every known cluster even with no data', () => {
    const { byCluster } = skillBreakdown({}, problems);
    expect(byCluster.length).toBe(40);
    expect(byCluster.every((c) => c.level === 'unassessed')).toBe(true);
  });
});

describe('recommendedFocus', () => {
  it('returns the lowest-accuracy assessed cluster', () => {
    const problems = [mkProblem('a', '6.RP', '6.RP.A.1'), mkProblem('b', '6.G', '6.G.A.1')];
    const stats = { a: stat(4, 4), b: stat(4, 1) };
    const { byCluster } = skillBreakdown(stats, problems);
    expect(recommendedFocus(byCluster)!.key).toBe('6.G.A');
  });

  it('returns null when nothing is assessed', () => {
    const { byCluster } = skillBreakdown({}, [mkProblem('a', '6.RP', '6.RP.A.1')]);
    expect(recommendedFocus(byCluster)).toBeNull();
  });
});

describe('estimateRit', () => {
  it('rises with accuracy', () => {
    expect(estimateRit(0.9, 2)).toBeGreaterThan(estimateRit(0.4, 2));
  });
  it('clamps to the plausible band', () => {
    expect(estimateRit(0, 1)).toBeGreaterThanOrEqual(RIT_MIN);
    expect(estimateRit(1, 3)).toBeLessThanOrEqual(RIT_MAX);
  });
  it('places ~70% near on-grade level', () => {
    const r = estimateRit(0.7, 2);
    expect(r).toBeGreaterThanOrEqual(220);
    expect(r).toBeLessThanOrEqual(230);
  });
});
