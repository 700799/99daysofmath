import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pickFinalQuiz, FINAL_QUIZ_COUNT, FINAL_QUIZ_SIZE } from '../src/utils/finals';
import { CORE_DOMAINS, type Problem } from '../src/types/problem';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALL: Problem[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'public', 'data', 'problems.json'), 'utf-8'),
);

describe('final quizzes', () => {
  const quizzes = Array.from({ length: FINAL_QUIZ_COUNT }, (_, i) =>
    pickFinalQuiz(ALL, i + 1),
  );

  it('each quiz has exactly 20 questions', () => {
    for (const q of quizzes) expect(q).toHaveLength(FINAL_QUIZ_SIZE);
  });

  it('selection is deterministic across calls', () => {
    const again = pickFinalQuiz(ALL, 3).map((p) => p.id);
    expect(quizzes[2].map((p) => p.id)).toEqual(again);
  });

  it('the five quizzes never share a question', () => {
    const seen = new Set<string>();
    for (const q of quizzes) {
      for (const p of q) {
        expect(seen.has(p.id), p.id).toBe(false);
        seen.add(p.id);
      }
    }
    expect(seen.size).toBe(FINAL_QUIZ_COUNT * FINAL_QUIZ_SIZE);
  });

  it('every quiz draws from all six core (grade-level) domains — never Algebra 1', () => {
    for (const q of quizzes) {
      const domains = new Set(q.map((p) => p.domain));
      for (const d of CORE_DOMAINS) expect(domains.has(d), d).toBe(true);
      expect(domains.has('A1')).toBe(false);
    }
  });

  it('every quiz is challenge-weighted (≥5 hard, ≤5 easy)', () => {
    for (const [i, q] of quizzes.entries()) {
      const d3 = q.filter((p) => p.difficulty === 3).length;
      const d1 = q.filter((p) => p.difficulty === 1).length;
      expect(d3, `quiz ${i + 1} d3`).toBeGreaterThanOrEqual(5);
      expect(d1, `quiz ${i + 1} d1`).toBeLessThanOrEqual(5);
    }
  });
});
