import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isEquivalent } from '../src/data/normalize';
import type { Problem } from '../src/types/problem';

// Exercises the real grading engine (isEquivalent) against the shipped problem
// bank — the file the app actually fetches at runtime. validate:content checks
// the JSON *shape* (schema, unique ids, MC structure) but never runs the grader,
// so a schema-valid problem whose own answer the normalizer rejects would still
// pass CI and be unwinnable in the app. This locks that invariant down.
const problems = JSON.parse(
  readFileSync(new URL('../public/data/problems.json', import.meta.url), 'utf8'),
) as Problem[];

describe('shipped problem bank', () => {
  it('is non-empty', () => {
    expect(problems.length).toBeGreaterThan(0);
  });

  for (const p of problems) {
    describe(`${p.id} (${p.answerType})`, () => {
      it('grades its own primaryAnswer as correct', () => {
        expect(isEquivalent(p.primaryAnswer, p)).toBe(true);
      });

      for (const alt of p.alternativeAnswers) {
        it(`grades alternative answer "${alt}" as correct`, () => {
          expect(isEquivalent(alt, p)).toBe(true);
        });
      }

      // For multiple choice, confirm the grader actually discriminates: a wrong
      // choice id must not be accepted.
      if (p.answerType === 'multiple-choice') {
        const wrong = (p.choices ?? []).find((c) => !c.correct);
        it('rejects an incorrect choice', () => {
          expect(wrong).toBeDefined();
          if (wrong) expect(isEquivalent(wrong.id, p)).toBe(false);
        });
      }
    });
  }
});
