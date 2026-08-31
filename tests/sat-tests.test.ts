import { describe, it, expect } from 'vitest';
import { SAT_MOCK_TESTS, getMockTest, allQuestions, MODULE_QUESTIONS } from '../src/data/sat/tests';
import { SAT_AREAS, SAT_AREA_INFO, type SatArea } from '../src/data/sat/blueprint';

// The mock tests promise to be *realistic*, which means the structure has to
// hold: two modules of 22, the published blueprint weighting, a valid answer
// for every question, and an explanation that actually lands on that answer.

const ALL = SAT_MOCK_TESTS.flatMap(allQuestions);

describe('SAT mock tests — structure', () => {
  it('there are 5 tests, each 2 modules of 22 questions', () => {
    expect(SAT_MOCK_TESTS).toHaveLength(5);
    for (const t of SAT_MOCK_TESTS) {
      expect(t.module1, `test ${t.n} module 1`).toHaveLength(MODULE_QUESTIONS);
      expect(t.module2, `test ${t.n} module 2`).toHaveLength(MODULE_QUESTIONS);
      expect(allQuestions(t)).toHaveLength(44);
    }
  });

  it('tests are numbered 1-5 and retrievable by number', () => {
    expect(SAT_MOCK_TESTS.map((t) => t.n)).toEqual([1, 2, 3, 4, 5]);
    for (let n = 1; n <= 5; n++) expect(getMockTest(n)?.n).toBe(n);
    expect(getMockTest(6)).toBeNull();
  });

  it('every question id is globally unique', () => {
    const ids = ALL.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('module and position metadata match where the question actually sits', () => {
    for (const t of SAT_MOCK_TESTS) {
      t.module1.forEach((q, i) => {
        expect(q.module, q.id).toBe(1);
        expect(q.n, q.id).toBe(i + 1);
      });
      t.module2.forEach((q, i) => {
        expect(q.module, q.id).toBe(2);
        expect(q.n, q.id).toBe(i + 1);
      });
    }
  });

  it('every test carries a title and a blurb that says what it is for', () => {
    for (const t of SAT_MOCK_TESTS) {
      expect(t.title.length, `test ${t.n}`).toBeGreaterThan(10);
      expect(t.blurb.length, `test ${t.n}`).toBeGreaterThan(80);
    }
  });
});

describe('SAT mock tests — blueprint fidelity', () => {
  it('each test matches the published per-area question counts', () => {
    for (const t of SAT_MOCK_TESTS) {
      const counts = new Map<SatArea, number>();
      for (const q of allQuestions(t)) counts.set(q.area, (counts.get(q.area) ?? 0) + 1);
      for (const a of SAT_AREAS) {
        expect(counts.get(a) ?? 0, `test ${t.n} area ${a}`).toBe(SAT_AREA_INFO[a].perTest);
      }
    }
  });

  it('every module contains all four areas, so neither is lopsided', () => {
    for (const t of SAT_MOCK_TESTS) {
      for (const [i, mod] of [t.module1, t.module2].entries()) {
        const areas = new Set(mod.map((q) => q.area));
        for (const a of SAT_AREAS) {
          expect(areas.has(a), `test ${t.n} module ${i + 1} is missing ${a}`).toBe(true);
        }
      }
    }
  });

  it('difficulty escalates from module 1 to module 2, as the adaptive form does', () => {
    for (const t of SAT_MOCK_TESTS) {
      const avg = (qs: typeof t.module1) => qs.reduce((s, q) => s + q.difficulty, 0) / qs.length;
      expect(avg(t.module2), `test ${t.n}`).toBeGreaterThan(avg(t.module1));
    }
  });

  it('roughly a quarter of questions are student-produced, as on the real test', () => {
    for (const t of SAT_MOCK_TESTS) {
      const numeric = allQuestions(t).filter((q) => q.answerType === 'numeric').length;
      expect(numeric / 44, `test ${t.n}`).toBeGreaterThanOrEqual(0.2);
      expect(numeric / 44, `test ${t.n}`).toBeLessThanOrEqual(0.65);
    }
  });
});

describe('SAT mock tests — answer integrity', () => {
  it('every multiple-choice question offers 4 lettered choices', () => {
    for (const q of ALL.filter((x) => x.answerType === 'multiple-choice')) {
      const ids = (q.choices ?? []).map((c) => c.id);
      expect(ids, q.id).toEqual(['A', 'B', 'C', 'D']);
      for (const c of q.choices ?? []) expect(c.label.length, `${q.id} choice ${c.id}`).toBeGreaterThan(0);
    }
  });

  it('every multiple-choice answer names one of its own choices', () => {
    for (const q of ALL.filter((x) => x.answerType === 'multiple-choice')) {
      expect(['A', 'B', 'C', 'D'], `${q.id} answer "${q.answer}"`).toContain(q.answer);
    }
  });

  it('every numeric answer parses as a number or a fraction', () => {
    const parses = (s: string) => /^-?(\d+\.?\d*|\.\d+|\d+\/\d+)$/.test(s.trim());
    for (const q of ALL.filter((x) => x.answerType === 'numeric')) {
      expect(parses(q.answer), `${q.id} answer "${q.answer}"`).toBe(true);
      for (const alt of q.alternativeAnswers ?? []) {
        expect(parses(alt), `${q.id} alternative "${alt}"`).toBe(true);
      }
      expect(q.choices, `${q.id} is numeric but carries choices`).toBeUndefined();
    }
  });

  it('every numeric alternative agrees in value with the primary answer', () => {
    const value = (s: string): number => {
      const f = s.trim().match(/^(-?\d+)\/(\d+)$/);
      return f ? Number(f[1]) / Number(f[2]) : Number(s.trim());
    };
    for (const q of ALL.filter((x) => x.answerType === 'numeric')) {
      const target = value(q.answer);
      const tol = Math.max(q.tolerance ?? 0, 1e-9);
      for (const alt of q.alternativeAnswers ?? []) {
        expect(Math.abs(value(alt) - target), `${q.id}: "${alt}" vs "${q.answer}"`).toBeLessThanOrEqual(tol);
      }
    }
  });

  it("every numeric answer appears in its own explanation", () => {
    // The check that catches a stated answer drifting from the derivation.
    const failures: string[] = [];
    for (const q of ALL.filter((x) => x.answerType === 'numeric')) {
      const raw = q.explanation.join(' ');
      const keepBraces = raw.replace(/[,\\]/g, '');
      const dropBraces = raw.replace(/[,{}\\]/g, '');
      const candidates = [q.answer, q.answer.replace(/^-/, ''), ...(q.alternativeAnswers ?? [])];
      // Fractions are written in the prose as \tfrac{a}{b}, so accept the parts too.
      const frac = q.answer.match(/^-?(\d+)\/(\d+)$/);
      if (frac) candidates.push(`{${frac[1]}}{${frac[2]}}`);
      for (const alt of q.alternativeAnswers ?? []) {
        const f = alt.match(/^-?(\d+)\/(\d+)$/);
        if (f) candidates.push(`{${f[1]}}{${f[2]}}`);
      }
      if (!candidates.some((c) => keepBraces.includes(c) || dropBraces.includes(c))) {
        failures.push(`${q.id}: answer "${q.answer}" never appears in its explanation`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('SAT mock tests — teaching quality', () => {
  it('every question has a stepped explanation', () => {
    for (const q of ALL) {
      expect(q.explanation.length, q.id).toBeGreaterThanOrEqual(2);
      for (const step of q.explanation) expect(step.length, q.id).toBeGreaterThan(10);
    }
  });

  it('every question carries a transferable pro tip', () => {
    for (const q of ALL) {
      expect(q.proTip.length, q.id).toBeGreaterThan(40);
    }
  });

  it('pro tips are not copy-pasted across a test', () => {
    for (const t of SAT_MOCK_TESTS) {
      const tips = allQuestions(t).map((q) => q.proTip);
      const unique = new Set(tips).size;
      // A little repetition across 44 questions is fine; wholesale duplication is not.
      expect(unique / tips.length, `test ${t.n}`).toBeGreaterThan(0.9);
    }
  });

  it('no text carries a stray control character from a mis-escaped LaTeX macro', () => {
    // `'$\tfrac{1}{2}$'` in a TS single-quoted string is a TAB followed by
    // "frac", not a fraction. This catches that whole class of escaping bug.
    const control = /[\t\n\r\f\v\b\0]/;
    const failures: string[] = [];
    for (const q of ALL) {
      const texts = [
        q.prompt,
        ...(q.choices ?? []).map((c) => c.label),
        ...q.explanation,
        q.proTip,
      ];
      for (const t of texts) {
        if (control.test(t)) failures.push(`${q.id}: control character in ${JSON.stringify(t.slice(0, 60))}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('carries 220 fully-formed questions in total', () => {
    expect(ALL).toHaveLength(220);
  });
});
