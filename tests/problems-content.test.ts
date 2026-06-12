import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isEquivalent } from '../src/data/normalize';
import { DOMAINS, type Problem } from '../src/types/problem';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_PATH = path.resolve(__dirname, '..', 'public', 'data', 'problems.json');

const PROBLEMS: Problem[] = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf-8'));

const EXPECTED_BY_DOMAIN: Record<string, { count: number; units: number }> = {
  '5.F': { count: 60, units: 6 },
  '6.RP': { count: 100, units: 10 },
  '6.NS': { count: 100, units: 10 },
  '6.EE': { count: 100, units: 10 },
  '6.G': { count: 100, units: 10 },
  '6.SP': { count: 100, units: 10 },
};

describe('problems bank — structure', () => {
  it('contains exactly 560 problems', () => {
    expect(PROBLEMS).toHaveLength(560);
  });

  it('every id is globally unique', () => {
    const ids = new Set(PROBLEMS.map((p) => p.id));
    expect(ids.size).toBe(PROBLEMS.length);
  });

  it('every domain has its expected problem count', () => {
    const counts = new Map<string, number>();
    for (const p of PROBLEMS) counts.set(p.domain, (counts.get(p.domain) ?? 0) + 1);
    for (const d of DOMAINS) {
      expect(counts.get(d), d).toBe(EXPECTED_BY_DOMAIN[d].count);
    }
  });

  it('every (domain, unit) has exactly 10 problems with orderInUnit 1..10 unique', () => {
    const bucket = new Map<string, Problem[]>();
    for (const p of PROBLEMS) {
      const key = `${p.domain}:${p.unit}`;
      const arr = bucket.get(key) ?? [];
      arr.push(p);
      bucket.set(key, arr);
    }
    for (const d of DOMAINS) {
      for (let u = 1; u <= EXPECTED_BY_DOMAIN[d].units; u++) {
        const arr = bucket.get(`${d}:${u}`) ?? [];
        expect(arr, `${d}:${u}`).toHaveLength(10);
        const orders = arr.map((p) => p.orderInUnit).sort((a, b) => a - b);
        expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      }
    }
  });
});

describe('problems bank — 5.F Foundations quality bar', () => {
  const foundations = PROBLEMS.filter((p) => p.domain === '5.F');

  it('covers the six Gr-5 MAP gap areas with 60 problems', () => {
    expect(foundations).toHaveLength(60);
    const clusters = new Set(foundations.map((p) => p.standard.split('.').slice(0, 3).join('.')));
    for (const c of ['5.NBT.A', '5.NBT.B', '5.NF.A', '5.NF.B', '5.MD.A', '5.MD.C', '5.G.A', '5.OA.B', '5.MD.B']) {
      expect(clusters.has(c), c).toBe(true);
    }
  });

  it('every 5.F problem has 3+ hints and a multi-step explanation', () => {
    const failures: string[] = [];
    for (const p of foundations) {
      if (!Array.isArray(p.hints) || p.hints.length < 3) failures.push(`${p.id}: hints`);
      if (!Array.isArray(p.explanation) || p.explanation.length < 2) failures.push(`${p.id}: explanation`);
    }
    expect(failures).toEqual([]);
  });

  it('every difficulty-3 5.F problem has a 4-step titled hint series', () => {
    const failures: string[] = [];
    for (const p of foundations.filter((q) => q.difficulty === 3)) {
      if ((p.hints?.length ?? 0) !== 4) failures.push(`${p.id}: expected 4 hints`);
      else if (!p.hints!.some((h) => h.title)) failures.push(`${p.id}: no titled hint`);
    }
    expect(failures).toEqual([]);
  });

  it('at least 10 5.F problems carry diagrams', () => {
    const withDiagrams = foundations.filter((p) => p.diagram);
    expect(withDiagrams.length).toBeGreaterThanOrEqual(10);
  });
});

describe('problems bank — multiple-choice integrity', () => {
  it('every MC problem has exactly one correct choice whose id equals primaryAnswer', () => {
    const mcProblems = PROBLEMS.filter((p) => p.answerType === 'multiple-choice');
    expect(mcProblems.length).toBeGreaterThan(0);
    const errors: string[] = [];
    for (const p of mcProblems) {
      if (!Array.isArray(p.choices) || p.choices.length < 2) {
        errors.push(`${p.id}: MC needs ≥2 choices`);
        continue;
      }
      const correct = p.choices.filter((c) => c.correct);
      if (correct.length !== 1) {
        errors.push(`${p.id}: must have exactly 1 correct choice (got ${correct.length})`);
        continue;
      }
      if (correct[0].id !== p.primaryAnswer) {
        errors.push(`${p.id}: primaryAnswer "${p.primaryAnswer}" must equal correct id "${correct[0].id}"`);
      }
    }
    expect(errors).toEqual([]);
  });
});

describe('problems bank — every answer self-accepts', () => {
  it('isEquivalent(primaryAnswer, problem) is true for every problem', () => {
    const failures: string[] = [];
    for (const p of PROBLEMS) {
      if (!isEquivalent(p.primaryAnswer, p)) {
        failures.push(`${p.id}: primaryAnswer "${p.primaryAnswer}" not accepted`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('every alternativeAnswers entry is accepted', () => {
    const failures: string[] = [];
    for (const p of PROBLEMS) {
      for (const alt of p.alternativeAnswers ?? []) {
        if (!isEquivalent(alt, p)) {
          failures.push(`${p.id}: alt "${alt}" not accepted`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('problems bank — units 7-10 quality bar', () => {
  const advanced = PROBLEMS.filter((p) => p.unit >= 7);

  it('there are 200 problems across units 7-10', () => {
    expect(advanced).toHaveLength(200);
  });

  it('every unit-7-10 problem has 3 or 4 non-descending hint tiers', () => {
    const failures: string[] = [];
    const order: Record<string, number> = { nudge: 1, guide: 2, reveal: 3 };
    for (const p of advanced) {
      const len = p.hints?.length ?? 0;
      if (!Array.isArray(p.hints) || len < 3 || len > 4) {
        failures.push(`${p.id}: expected 3 or 4 hint tiers, got ${len}`);
        continue;
      }
      let last = 0;
      for (const h of p.hints) {
        const n = order[h.level];
        if (n < last) {
          failures.push(`${p.id}: hint tiers must be non-descending (saw "${h.level}" after a later tier)`);
          break;
        }
        last = n;
      }
    }
    expect(failures).toEqual([]);
  });

  it('every unit-7-10 problem has a multi-step explanation (≥2 steps)', () => {
    const failures: string[] = [];
    for (const p of advanced) {
      if (!Array.isArray(p.explanation) || p.explanation.length < 2) {
        failures.push(`${p.id}: explanation needs ≥2 steps (got ${p.explanation?.length ?? 0})`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('at least 55% of unit-7-10 problems have alternativeExplanations', () => {
    const withAlts = advanced.filter(
      (p) => Array.isArray(p.alternativeExplanations) && p.alternativeExplanations.length >= 1,
    );
    const ratio = withAlts.length / advanced.length;
    expect(ratio).toBeGreaterThanOrEqual(0.55);
  });
});

describe('problems bank — Round 6 challenge upgrades (no zero-d3 standards)', () => {
  const MAP_TARGET_STANDARDS = [
    '6.EE.A.2.a',
    '6.EE.A.2.b',
    '6.EE.B.8',
    '6.NS.B.2',
    '6.NS.C.6.a',
    '6.NS.C.6.b',
    '6.NS.C.6.c',
    '6.NS.C.7.b',
    '6.SP.A.1',
  ];

  it('every MAP-gap standard has at least one d3 problem', () => {
    const failures: string[] = [];
    for (const std of MAP_TARGET_STANDARDS) {
      const d3 = PROBLEMS.filter((p) => p.standard === std && p.difficulty === 3);
      if (d3.length === 0) failures.push(std);
    }
    expect(failures).toEqual([]);
  });

  it('every MAP-gap d3 problem carries the "MAP-practice" tag and ≥1 alternativeExplanation', () => {
    const failures: string[] = [];
    for (const std of MAP_TARGET_STANDARDS) {
      const d3 = PROBLEMS.filter((p) => p.standard === std && p.difficulty === 3);
      for (const p of d3) {
        if (!(p.tags ?? []).includes('MAP-practice')) failures.push(`${p.id}: missing MAP-practice tag`);
        if (!Array.isArray(p.alternativeExplanations) || p.alternativeExplanations.length < 1) {
          failures.push(`${p.id}: missing alternativeExplanations`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('problems bank — Round 6 hint enrichment invariants', () => {
  it('every problem has at least 3 hints (legacy singletons enriched)', () => {
    const failures: string[] = [];
    for (const p of PROBLEMS) {
      if (!Array.isArray(p.hints) || p.hints.length < 3) {
        failures.push(`${p.id}: only ${p.hints?.length ?? 0} hint(s)`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('every difficulty-3 problem across all domains has exactly 4 hints', () => {
    const failures: string[] = [];
    for (const p of PROBLEMS.filter((q) => q.difficulty === 3)) {
      if ((p.hints?.length ?? 0) !== 4) {
        failures.push(`${p.id} (${p.domain}): expected 4 hints, got ${p.hints?.length ?? 0}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('every difficulty-3 problem carries at least one titled hint', () => {
    const failures: string[] = [];
    for (const p of PROBLEMS.filter((q) => q.difficulty === 3)) {
      if (!(p.hints ?? []).some((h) => !!h.title)) {
        failures.push(`${p.id} (${p.domain}): no titled hint`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('all hint series are non-descending in tier (nudge→guide→reveal)', () => {
    const order: Record<string, number> = { nudge: 1, guide: 2, reveal: 3 };
    const failures: string[] = [];
    for (const p of PROBLEMS) {
      let last = 0;
      for (const h of p.hints ?? []) {
        const n = order[h.level];
        if (n < last) {
          failures.push(`${p.id}: tier dropped at "${h.level}"`);
          break;
        }
        last = n;
      }
    }
    expect(failures).toEqual([]);
  });
});
