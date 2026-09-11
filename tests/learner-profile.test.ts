import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  GRADE_LEVELS,
  AGE_RANGE,
  COURSES,
  COURSE_FIT,
  getCourse,
} from '../src/data/courses';
import { useProgress, migrateProgress } from '../src/state/progress';

// Before a student starts we ask age, grade, and where they want to begin.
// The third is a CHOICE, never derived from the first two: a 5th grader may be
// doing Algebra 1 and a 9th grader may need fractions, so a grade-to-course
// rule would be wrong for both and would open the app by telling a kid what
// level they are.

describe('what we ask', () => {
  it('offers every grade from 4th-or-below to 12th, in order', () => {
    expect(GRADE_LEVELS.map((g) => g.value)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const g of GRADE_LEVELS) expect(g.label.length, `${g.value}`).toBeGreaterThan(2);
  });

  it('offers an age range a 5th grader through a senior fits inside', () => {
    expect(AGE_RANGE.min).toBeLessThanOrEqual(8);
    expect(AGE_RANGE.max).toBeGreaterThanOrEqual(17);
    expect(AGE_RANGE.max).toBeGreaterThan(AGE_RANGE.min);
  });
});

describe('the course a student picks', () => {
  it('describes every course by what you can already do, not by a school year', () => {
    for (const c of COURSES) {
      const fit = COURSE_FIT[c.id];
      expect(fit, c.id).toBeTruthy();
      expect(fit.length, c.id).toBeGreaterThan(30);
      // A fit line naming a grade would smuggle the old assumption back in.
      expect(fit, `${c.id} describes a school year instead of an ability`).not.toMatch(
        /\b(\d+(st|nd|rd|th) grade(r)?|grade \d+)\b/i,
      );
    }
  });

  it('covers every course on the shelf, so none is unpickable', () => {
    expect(Object.keys(COURSE_FIT).sort()).toEqual(COURSES.map((c) => c.id).sort());
  });

  it('every fit line is distinct, so the choice is actually informative', () => {
    expect(new Set(Object.values(COURSE_FIT)).size).toBe(COURSES.length);
  });
});

describe('nothing infers a course from a grade', () => {
  // The guard for the mistake this replaced: grade is stored as context only.
  const SOURCES = [
    'src/data/courses.ts',
    'src/components/Onboarding.tsx',
    'src/routes/Home.tsx',
    'src/routes/Settings.tsx',
  ];

  it('the grade-to-course mapping is gone, not merely unused', async () => {
    const courses = await import('../src/data/courses');
    expect(Object.keys(courses)).not.toContain('courseForGrade');
    expect(Object.keys(courses)).not.toContain('recommendationReason');
  });

  it('no surface derives a starting course from age or grade', () => {
    for (const f of SOURCES) {
      const src = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
      expect(src, `${f} still maps a grade to a course`).not.toMatch(/courseForGrade/);
    }
  });
});

describe('the stored profile', () => {
  beforeEach(() => {
    useProgress.setState({
      age: null,
      gradeLevel: null,
      startingCourse: null,
      onboardingComplete: false,
    });
  });

  it('starts empty, so a new student is asked', () => {
    const s = useProgress.getState();
    expect(s.age).toBeNull();
    expect(s.gradeLevel).toBeNull();
    expect(s.startingCourse).toBeNull();
  });

  it('records the answers, keeping the choice independent of the grade', () => {
    // A 5th grader starting Algebra 1 — the case a grade rule would have broken.
    useProgress.getState().setLearnerProfile(10, 5);
    useProgress.getState().setStartingCourse('algebra1');
    const s = useProgress.getState();
    expect(s.gradeLevel).toBe(5);
    expect(s.startingCourse).toBe('algebra1');
  });

  it('accepts a 9th grader starting in 6th-grade Common Core', () => {
    useProgress.getState().setLearnerProfile(15, 9);
    useProgress.getState().setStartingCourse('grade6');
    expect(useProgress.getState().startingCourse).toBe('grade6');
  });

  it('only ever stores a course that exists', () => {
    for (const c of COURSES) {
      useProgress.getState().setStartingCourse(c.id);
      expect(getCourse(useProgress.getState().startingCourse!)).not.toBeNull();
    }
  });

  it('can be changed later, without touching age or grade', () => {
    useProgress.getState().setLearnerProfile(10, 5);
    useProgress.getState().setStartingCourse('grade5');
    useProgress.getState().setStartingCourse('algebra1');
    const s = useProgress.getState();
    expect(s.startingCourse).toBe('algebra1');
    expect(s.age).toBe(10);
    expect(s.gradeLevel).toBe(5);
  });

  it('migrates an existing install to "not asked yet" rather than a guess', () => {
    const old = { onboardingComplete: true, xp: 400 } as Record<string, unknown>;
    const migrated = migrateProgress(old, 27) as Record<string, unknown>;
    expect(migrated.age).toBeNull();
    expect(migrated.gradeLevel).toBeNull();
    expect(migrated.startingCourse).toBeNull();
    expect(migrated.onboardingComplete, 'their tour state survives').toBe(true);
    expect(migrated.xp, 'their progress survives').toBe(400);
  });

  it('leaves an already-answered profile alone on migration', () => {
    const existing = { age: 12, gradeLevel: 7, startingCourse: 'sat' } as Record<string, unknown>;
    const migrated = migrateProgress(existing, 27) as Record<string, unknown>;
    expect(migrated.age).toBe(12);
    expect(migrated.gradeLevel).toBe(7);
    expect(migrated.startingCourse).toBe('sat');
  });
});
