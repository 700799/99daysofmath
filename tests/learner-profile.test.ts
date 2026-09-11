import { describe, it, expect, beforeEach } from 'vitest';
import {
  GRADE_LEVELS,
  AGE_RANGE,
  COURSES,
  courseForGrade,
  recommendationReason,
  getCourse,
} from '../src/data/courses';
import { useProgress, migrateProgress } from '../src/state/progress';

// Age and grade are asked before a student starts, so the shelf can point
// somewhere instead of leaving a 10-year-old choosing between SAT prep and
// fractions. The answers only ever suggest — nothing is locked.

describe('the grade picker', () => {
  it('covers 4th-or-below through 12th, in order, with no gaps', () => {
    expect(GRADE_LEVELS.map((g) => g.value)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const g of GRADE_LEVELS) expect(g.label.length, `${g.value}`).toBeGreaterThan(2);
  });

  it('offers an age range a 5th grader through a senior fits inside', () => {
    expect(AGE_RANGE.min).toBeLessThanOrEqual(8);
    expect(AGE_RANGE.max).toBeGreaterThanOrEqual(17);
    expect(AGE_RANGE.max).toBeGreaterThan(AGE_RANGE.min);
  });
});

describe('what a grade is pointed at', () => {
  it('suggests a course that actually exists for every grade offered', () => {
    for (const g of GRADE_LEVELS) {
      const id = courseForGrade(g.value);
      expect(getCourse(id), `grade ${g.value} -> ${id}`).not.toBeNull();
    }
  });

  it('follows the usual sequence', () => {
    expect(courseForGrade(4)).toBe('grade5');
    expect(courseForGrade(5)).toBe('grade5');
    expect(courseForGrade(6)).toBe('grade6');
    expect(courseForGrade(7)).toBe('grade6');
    expect(courseForGrade(8)).toBe('algebra1');
    expect(courseForGrade(9)).toBe('algebra1');
    expect(courseForGrade(10)).toBe('geometry');
    expect(courseForGrade(11)).toBe('sat');
    expect(courseForGrade(12)).toBe('sat');
  });

  it('never moves a student backwards as the grades climb', () => {
    // Against the teaching sequence, NOT the Home display order — Home lists
    // the shelf advanced-first and puts Geometry after Algebra 1, which is the
    // opposite of the order they are taught in.
    const SEQUENCE = ['grade5', 'grade6', 'algebra1', 'geometry', 'trig', 'precalc', 'sat'];
    let lastIdx = -1;
    for (const g of GRADE_LEVELS) {
      const idx = SEQUENCE.indexOf(courseForGrade(g.value));
      expect(idx, `grade ${g.value} suggests something outside the sequence`).toBeGreaterThanOrEqual(0);
      expect(idx, `grade ${g.value} went backwards`).toBeGreaterThanOrEqual(lastIdx);
      lastIdx = idx;
    }
  });

  it('the teaching sequence names every course exactly once', () => {
    const SEQUENCE = ['grade5', 'grade6', 'algebra1', 'geometry', 'trig', 'precalc', 'sat'];
    expect([...SEQUENCE].sort()).toEqual([...COURSES.map((c) => c.id)].sort());
  });

  it('gives a reason for every grade, not a generic one', () => {
    const reasons = GRADE_LEVELS.map((g) => recommendationReason(g.value));
    for (const r of reasons) expect(r.length).toBeGreaterThan(30);
    expect(new Set(reasons).size, 'reasons should differ by stage').toBeGreaterThanOrEqual(4);
  });

  it('handles a grade outside the picker without throwing', () => {
    expect(getCourse(courseForGrade(1))).not.toBeNull();
    expect(getCourse(courseForGrade(20))).not.toBeNull();
  });
});

describe('the stored profile', () => {
  beforeEach(() => {
    useProgress.setState({ age: null, gradeLevel: null, onboardingComplete: false });
  });

  it('starts empty, so a new student is asked', () => {
    const s = useProgress.getState();
    expect(s.age).toBeNull();
    expect(s.gradeLevel).toBeNull();
  });

  it('records both answers together', () => {
    useProgress.getState().setLearnerProfile(10, 5);
    const s = useProgress.getState();
    expect(s.age).toBe(10);
    expect(s.gradeLevel).toBe(5);
  });

  it('can be changed later, for a birthday or a new school year', () => {
    useProgress.getState().setLearnerProfile(10, 5);
    useProgress.getState().setLearnerProfile(11, 6);
    expect(useProgress.getState().gradeLevel).toBe(6);
    expect(courseForGrade(useProgress.getState().gradeLevel!)).toBe('grade6');
  });

  it('migrates an existing install to "not asked yet" rather than a guess', () => {
    // Someone who finished the old tour has no age or grade. Inventing one
    // would point them at the wrong course, so they are asked once instead.
    const old = { onboardingComplete: true, xp: 400 } as Record<string, unknown>;
    const migrated = migrateProgress(old, 27) as Record<string, unknown>;
    expect(migrated.age).toBeNull();
    expect(migrated.gradeLevel).toBeNull();
    expect(migrated.onboardingComplete, 'their tour state survives').toBe(true);
    expect(migrated.xp, 'their progress survives').toBe(400);
  });

  it('leaves an already-answered profile alone on migration', () => {
    const existing = { age: 12, gradeLevel: 7 } as Record<string, unknown>;
    const migrated = migrateProgress(existing, 27) as Record<string, unknown>;
    expect(migrated.age).toBe(12);
    expect(migrated.gradeLevel).toBe(7);
  });
});
