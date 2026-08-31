import { describe, it, expect } from 'vitest';
import { SAT_MOCK_TESTS, allQuestions } from '../src/data/sat/tests';
import type { SatTestQuestion } from '../src/data/sat/tests/types';
import { SAT_AREA_INFO } from '../src/data/sat/blueprint';
import {
  isCorrect,
  diagnoseTest,
  selectRecoveryProblems,
  buildPlan,
  type TestDiagnosis,
} from '../src/utils/satAnalysis';
import type { Problem } from '../src/types/problem';

// The analysis is the bridge from "you scored 610" to "here is exactly what
// to do" — so its diagnosis math, its signal detection, and above all its
// customized problem selection have to be right, stable, and honest.

const TEST1 = SAT_MOCK_TESTS[0];
const QS = allQuestions(TEST1);

/** Answers that get every question right. */
function perfectAnswers(qs: SatTestQuestion[]): Record<string, string> {
  return Object.fromEntries(qs.map((q) => [q.id, q.answer]));
}

/** Perfect except the given ids, which get a plausible wrong answer. */
function missing(qs: SatTestQuestion[], ids: string[]): Record<string, string> {
  const a = perfectAnswers(qs);
  for (const id of ids) {
    const q = qs.find((x) => x.id === id)!;
    a[id] = q.answerType === 'multiple-choice' ? (q.answer === 'A' ? 'B' : 'A') : '999999';
  }
  return a;
}

/** A minimal synthetic SAT drill pool: 10 problems per unit, mixed difficulty. */
function syntheticPool(): Problem[] {
  const pool: Problem[] = [];
  for (let unit = 1; unit <= 18; unit++) {
    for (let i = 1; i <= 10; i++) {
      pool.push({
        id: `SAT.${String((unit - 1) * 10 + i).padStart(3, '0')}`,
        domain: 'SAT',
        unit,
        orderInUnit: i,
        standard: 'SAT.TEST.1',
        difficulty: (i <= 4 ? 1 : i <= 8 ? 2 : 3) as 1 | 2 | 3,
        prompt: 'p',
        answerType: 'numeric',
        primaryAnswer: '1',
        alternativeAnswers: [],
        acceptanceMode: 'normalized',
        hint: 'h',
        explanation: ['a', 'b'],
        tags: [],
        estimatedSeconds: 60,
      } as Problem);
    }
  }
  return pool;
}

describe('satAnalysis — isCorrect', () => {
  it('accepts the letter for multiple choice, case- and space-insensitively', () => {
    const q = QS.find((x) => x.answerType === 'multiple-choice')!;
    expect(isCorrect(q, q.answer)).toBe(true);
    expect(isCorrect(q, ` ${q.answer.toLowerCase()} `)).toBe(true);
    expect(isCorrect(q, q.answer === 'A' ? 'B' : 'A')).toBe(false);
    expect(isCorrect(q, undefined)).toBe(false);
  });

  it('accepts numeric answers in equivalent forms', () => {
    const q = QS.find((x) => x.answerType === 'numeric')!;
    expect(isCorrect(q, q.answer)).toBe(true);
    expect(isCorrect(q, `  ${q.answer} `)).toBe(true);
    expect(isCorrect(q, '')).toBe(false);
  });
});

describe('satAnalysis — diagnosis', () => {
  it('a perfect test yields no weak units, full marks, and a clean signal', () => {
    const d = diagnoseTest(QS, perfectAnswers(QS));
    expect(d.correct).toBe(44);
    expect(d.weak).toEqual([]);
    expect(d.strong.length).toBeGreaterThan(0);
    expect(d.signals.some((s) => s.kind === 'clean')).toBe(true);
  });

  it('per-unit totals reconcile with the whole test', () => {
    const d = diagnoseTest(QS, perfectAnswers(QS));
    expect(d.units.reduce((s, u) => s + u.total, 0)).toBe(44);
    for (const u of d.units) {
      expect(SAT_AREA_INFO[u.area].units).toContain(u.unit);
    }
  });

  it('missed questions land in their unit and rank it weak', () => {
    // Miss every question of the unit with the most questions on test 1.
    const byUnit = new Map<number, SatTestQuestion[]>();
    for (const q of QS) byUnit.set(q.unit, [...(byUnit.get(q.unit) ?? []), q]);
    const [bigUnit, bigQs] = [...byUnit.entries()].sort((a, b) => b[1].length - a[1].length)[0];
    const d = diagnoseTest(QS, missing(QS, bigQs.map((q) => q.id)));
    expect(d.weak.length).toBeGreaterThan(0);
    expect(d.weak[0].unit).toBe(bigUnit);
    expect(d.weak[0].missed).toHaveLength(bigQs.length);
    expect(d.weak[0].pointsOnTable).toBeGreaterThan(0);
    // The wrecked unit cannot simultaneously be listed as strong.
    expect(d.strong.map((u) => u.unit)).not.toContain(bigUnit);
  });

  it('weak units are ranked by points on the table, descending', () => {
    const ids = [QS[0].id, QS[1].id, QS[7].id];
    const d = diagnoseTest(QS, missing(QS, ids));
    for (let i = 1; i < d.weak.length; i++) {
      expect(d.weak[i - 1].pointsOnTable).toBeGreaterThanOrEqual(d.weak[i].pointsOnTable);
    }
  });

  it('blanks are counted and trigger the timing signal', () => {
    const a = perfectAnswers(QS);
    delete a[QS[3].id];
    delete a[QS[10].id];
    delete a[QS[20].id];
    const d = diagnoseTest(QS, a);
    expect(d.signals.some((s) => s.kind === 'blanks')).toBe(true);
    expect(d.units.reduce((s, u) => s + u.blank, 0)).toBe(3);
  });

  it('easy questions answered wrong trigger the careless signal', () => {
    const easies = QS.filter((q) => q.difficulty === 1 && q.answerType === 'multiple-choice').slice(0, 3);
    const d = diagnoseTest(QS, missing(QS, easies.map((q) => q.id)));
    expect(d.signals.some((s) => s.kind === 'careless')).toBe(true);
  });

  it('misses that are all difficulty-3 trigger the hard-wall signal, not careless', () => {
    const hards = QS.filter((q) => q.difficulty === 3).slice(0, 4);
    const d = diagnoseTest(QS, missing(QS, hards.map((q) => q.id)));
    expect(d.signals.some((s) => s.kind === 'hard-wall')).toBe(true);
    expect(d.signals.some((s) => s.kind === 'careless')).toBe(false);
  });

  it('tips are picked, deduplicated, and capped', () => {
    const hards = QS.filter((q) => q.difficulty === 3).slice(0, 4);
    const d = diagnoseTest(QS, missing(QS, hards.map((q) => q.id)));
    expect(d.tips.length).toBeGreaterThan(0);
    expect(d.tips.length).toBeLessThanOrEqual(8);
    expect(new Set(d.tips.map((t) => t.id)).size).toBe(d.tips.length);
  });

  it('every mock test diagnoses without error on an all-blank result', () => {
    for (const t of SAT_MOCK_TESTS) {
      const qs = allQuestions(t);
      const d = diagnoseTest(qs, {});
      expect(d.correct).toBe(0);
      expect(d.weak.reduce((s, u) => s + u.missed.length, 0)).toBe(44);
    }
  });
});

describe('satAnalysis — customized problem selection', () => {
  const pool = syntheticPool();

  function diagWithMisses(ids: string[]): TestDiagnosis {
    return diagnoseTest(QS, missing(QS, ids));
  }

  it('selects 10 problems, all from the SAT bank', () => {
    const d = diagWithMisses([QS[0].id, QS[8].id]);
    const picks = selectRecoveryProblems(d, pool);
    expect(picks).toHaveLength(10);
    for (const p of picks) expect(p.problem.domain).toBe('SAT');
  });

  it('draws only from weak units, weighted toward the bigger bleeders', () => {
    const byUnit = new Map<number, SatTestQuestion[]>();
    for (const q of QS) byUnit.set(q.unit, [...(byUnit.get(q.unit) ?? []), q]);
    const sorted = [...byUnit.entries()].sort((a, b) => b[1].length - a[1].length);
    const [bigUnit, bigQs] = sorted[0];
    const smallEntry = sorted.find(([u, qs]) => u !== bigUnit && qs.length >= 1)!;
    const d = diagWithMisses([...bigQs.map((q) => q.id), smallEntry[1][0].id]);

    const picks = selectRecoveryProblems(d, pool);
    const pickedUnits = new Set(picks.map((p) => p.problem.unit));
    const weakUnits = new Set(d.weak.map((u) => u.unit));
    for (const u of pickedUnits) expect(weakUnits).toContain(u);

    const fromBig = picks.filter((p) => p.problem.unit === bigUnit).length;
    const fromSmall = picks.filter((p) => p.problem.unit === smallEntry[0]).length;
    expect(fromBig).toBeGreaterThan(fromSmall);
    expect(fromSmall).toBeGreaterThanOrEqual(1);
  });

  it('a unit with easy misses rebuilds from easy problems; a hard-only unit drills the top end', () => {
    const easyMiss = QS.find((q) => q.difficulty === 1)!;
    const dEasy = diagWithMisses([easyMiss.id]);
    const easyPicks = selectRecoveryProblems(dEasy, pool).filter((p) => p.problem.unit === easyMiss.unit);
    expect(easyPicks[0].problem.difficulty).toBe(1);

    const hardMiss = QS.find((q) => q.difficulty === 3)!;
    const dHard = diagnoseTest(QS, missing(QS, [hardMiss.id]));
    const hardPicks = selectRecoveryProblems(dHard, pool).filter((p) => p.problem.unit === hardMiss.unit);
    expect(hardPicks[0].problem.difficulty).toBe(3);
  });

  it('every pick carries a reason written from the student’s own numbers', () => {
    const d = diagWithMisses([QS[0].id]);
    for (const p of selectRecoveryProblems(d, pool)) {
      expect(p.reason.length).toBeGreaterThan(20);
    }
  });

  it('is deterministic — the same result always builds the same set', () => {
    const d = diagWithMisses([QS[0].id, QS[5].id, QS[9].id]);
    const a = selectRecoveryProblems(d, pool).map((p) => p.problem.id);
    const b = selectRecoveryProblems(d, pool).map((p) => p.problem.id);
    expect(a).toEqual(b);
  });

  it('a perfect test gets a stretch set: 10 hard problems across 10 different units', () => {
    const d = diagnoseTest(QS, perfectAnswers(QS));
    const picks = selectRecoveryProblems(d, pool);
    expect(picks).toHaveLength(10);
    for (const p of picks) expect(p.problem.difficulty).toBe(3);
    expect(new Set(picks.map((p) => p.problem.unit)).size).toBe(10);
  });

  it('an all-blank test still fills the set from the biggest bleeders', () => {
    const d = diagnoseTest(QS, {});
    const picks = selectRecoveryProblems(d, pool);
    expect(picks).toHaveLength(10);
  });
});

describe('satAnalysis — the recovery plan', () => {
  it('leads with the custom set, then the top weak units in rank order', () => {
    const byUnit = new Map<number, SatTestQuestion[]>();
    for (const q of QS) byUnit.set(q.unit, [...(byUnit.get(q.unit) ?? []), q]);
    const [bigUnit, bigQs] = [...byUnit.entries()].sort((a, b) => b[1].length - a[1].length)[0];
    const d = diagnoseTest(QS, missing(QS, bigQs.map((q) => q.id)));
    const plan = buildPlan(d, 1);
    expect(plan.length).toBeGreaterThanOrEqual(3);
    expect(plan[0].to).toBe('/sat/recovery/1');
    expect(plan[1].to).toBe(`/sat/unit/${bigUnit}`);
    // The plan always ends by scheduling the re-test.
    expect(plan[plan.length - 1].to).toMatch(/^\/sat\/test\//);
  });

  it('after test 5 the re-test step points back at test 5 rather than a sixth test', () => {
    const d = diagnoseTest(QS, perfectAnswers(QS));
    const plan = buildPlan(d, 5);
    expect(plan[plan.length - 1].to).toBe('/sat/test/5');
  });
});
