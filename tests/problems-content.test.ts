import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isEquivalent } from '../src/data/normalize';
import { DOMAINS, type Problem } from '../src/types/problem';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS_PATH = path.resolve(__dirname, '..', 'public', 'data', 'problems.json');

const PROBLEMS: Problem[] = JSON.parse(fs.readFileSync(PROBLEMS_PATH, 'utf-8'));

describe('problems bank — structure', () => {
  it('contains exactly 500 problems', () => {
    expect(PROBLEMS).toHaveLength(500);
  });

  it('every id is globally unique', () => {
    const ids = new Set(PROBLEMS.map((p) => p.id));
    expect(ids.size).toBe(PROBLEMS.length);
  });

  it('each of the 5 domains has exactly 100 problems', () => {
    const counts = new Map<string, number>();
    for (const p of PROBLEMS) counts.set(p.domain, (counts.get(p.domain) ?? 0) + 1);
    for (const d of DOMAINS) {
      expect(counts.get(d)).toBe(100);
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
      for (let u = 1; u <= 10; u++) {
        const arr = bucket.get(`${d}:${u}`) ?? [];
        expect(arr).toHaveLength(10);
        const orders = arr.map((p) => p.orderInUnit).sort((a, b) => a - b);
        expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      }
    }
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

  it('every unit-7-10 problem has 3 ascending hint tiers', () => {
    const failures: string[] = [];
    const order: Record<string, number> = { nudge: 1, guide: 2, reveal: 3 };
    for (const p of advanced) {
      if (!Array.isArray(p.hints) || p.hints.length !== 3) {
        failures.push(`${p.id}: expected exactly 3 hint tiers, got ${p.hints?.length ?? 0}`);
        continue;
      }
      let last = 0;
      for (const h of p.hints) {
        const n = order[h.level];
        if (n <= last) {
          failures.push(`${p.id}: hint tiers not strictly ascending at "${h.level}"`);
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
