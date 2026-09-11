import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  pickFinalQuiz,
  finalKey,
  FINAL_QUIZ_COUNT,
  FINAL_QUIZ_SIZE,
  LEGACY_FINALS_COURSE,
} from '../src/utils/finals';
import { COURSES, courseDomains } from '../src/data/courses';
import { migrateProgress } from '../src/state/progress';
import type { Problem } from '../src/types/problem';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALL: Problem[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'public', 'data', 'problems.json'), 'utf-8'),
);

// The Final Challenge used to be 6th-grade Common Core only, so a student
// working through Trigonometry or the SAT had no final for what they were
// actually studying. Every course now has its own five.
describe.each(COURSES.map((c) => [c.id, c] as const))('%s finals', (_id, course) => {
  const quizzes = Array.from({ length: FINAL_QUIZ_COUNT }, (_, i) =>
    pickFinalQuiz(ALL, course.id, i + 1),
  );

  it(`has ${FINAL_QUIZ_COUNT} quizzes of exactly ${FINAL_QUIZ_SIZE} questions`, () => {
    for (const q of quizzes) expect(q).toHaveLength(FINAL_QUIZ_SIZE);
  });

  it('selection is deterministic across calls', () => {
    const again = pickFinalQuiz(ALL, course.id, 3).map((p) => p.id);
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

  it('draws only from this course, and from every one of its strands', () => {
    const mine = new Set<string>(courseDomains(course));
    for (const q of quizzes) {
      const used = new Set(q.map((p) => p.domain));
      for (const d of used) expect(mine.has(d), `${d} is not in ${course.id}`).toBe(true);
      for (const d of mine) expect(used.has(d as never), `${course.id} missed ${d}`).toBe(true);
    }
  });

  it('is challenge-weighted (≥5 hard, ≤5 easy)', () => {
    for (const [i, q] of quizzes.entries()) {
      const d3 = q.filter((p) => p.difficulty === 3).length;
      const d1 = q.filter((p) => p.difficulty === 1).length;
      expect(d3, `quiz ${i + 1} d3`).toBeGreaterThanOrEqual(5);
      expect(d1, `quiz ${i + 1} d1`).toBeLessThanOrEqual(5);
    }
  });
});

describe('across courses', () => {
  it('gives every course on the shelf its own finals', () => {
    for (const c of COURSES) {
      expect(pickFinalQuiz(ALL, c.id, 1).length, c.id).toBe(FINAL_QUIZ_SIZE);
    }
  });

  it('two courses sharing a strand do not serve the same quiz', () => {
    // Geometry borrows 6.G from 6th Grade Common Core.
    const geo = pickFinalQuiz(ALL, 'geometry', 1).map((p) => p.id);
    const g6 = pickFinalQuiz(ALL, 'grade6', 1).map((p) => p.id);
    expect(geo).not.toEqual(g6);
  });

  it('files results under the course, so quiz 1 of two courses cannot collide', () => {
    expect(finalKey('trig', 1)).not.toBe(finalKey('grade6', 1));
  });
});

describe('results from before finals were per course', () => {
  it('are filed under 6th-grade Common Core, not dropped', () => {
    const old = {
      finalsResults: { 1: { best: 18, completedAt: '2026-01-02' }, 4: { best: 11, completedAt: '2026-02-03' } },
    } as Record<string, unknown>;
    const next = migrateProgress(old, 28) as Record<string, unknown>;
    const results = next.finalsResults as Record<string, { best: number }>;
    expect(results[finalKey(LEGACY_FINALS_COURSE, 1)].best).toBe(18);
    expect(results[finalKey(LEGACY_FINALS_COURSE, 4)].best).toBe(11);
    expect(Object.keys(results)).toHaveLength(2);
  });

  it('leaves already-keyed results alone', () => {
    const state = { finalsResults: { 'trig:2': { best: 9, completedAt: '2026-03-04' } } } as Record<string, unknown>;
    const next = migrateProgress(state, 28) as Record<string, unknown>;
    expect((next.finalsResults as Record<string, { best: number }>)['trig:2'].best).toBe(9);
  });
});
