import type { Problem } from '../types/problem';
import { COURSES, getCourse, courseDomains, type CourseId } from '../data/courses';

export const FINAL_QUIZ_COUNT = 5;
export const FINAL_QUIZ_SIZE = 20;

// Every course gets its own Final Challenge. The quizzes used to be 6th-grade
// Common Core only, which left a student working through Trigonometry or the
// SAT with no final for what they were actually studying.
export const FINALS_COURSES: CourseId[] = COURSES.map((c) => c.id);

/**
 * Where a result is filed. Results used to be keyed by quiz number alone; a
 * course now goes in front of it, and the store migrates the old numeric keys
 * onto the course they actually were.
 */
export function finalKey(courseId: CourseId, quizN: number): string {
  return `${courseId}:${quizN}`;
}

/** The course the pre-course finals belonged to, for migrating old results. */
export const LEGACY_FINALS_COURSE: CourseId = 'grade6';

// Deterministic PRNG so a course's quizzes are stable across visits/devices.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A course's own seed offset, so two courses sharing a domain differ. */
function courseSeed(courseId: string): number {
  let h = 0;
  for (let i = 0; i < courseId.length; i++) h = (Math.imul(h, 31) + courseId.charCodeAt(i)) | 0;
  return Math.abs(h) % 100_000;
}

// How many questions each of a course's strands contributes to quiz n. Derived
// from FINAL_QUIZ_SIZE so the total always holds — 6th grade's five strands
// give 4+4+4+4+4, Geometry's two give 10+10, a single-strand course gives 20 —
// and rotated per quiz so the "heavy" strands vary.
function quotaFor(strandCount: number, quizN: number): number[] {
  const floor = Math.floor(FINAL_QUIZ_SIZE / strandCount);
  const extra = FINAL_QUIZ_SIZE - floor * strandCount;
  const base = Array.from({ length: strandCount }, (_, i) => floor + (i < extra ? 1 : 0));
  const rot = (quizN - 1) % base.length;
  return base.map((_, i) => base[(i + rot) % base.length]);
}

/**
 * Build one of a course's five non-overlapping 20-question finals:
 *  1. per strand, deterministically shuffle then order difficulty-descending;
 *  2. deal each strand's list round-robin into 5 buckets, so the five quizzes
 *     can never share a question and each gets an even difficulty spread;
 *  3. quiz n takes its quota from each strand's bucket n, hardest first, and
 *     tops up from the rest of bucket n if a strand is short on content;
 *  4. the final order is a seeded shuffle.
 */
export function pickFinalQuiz(
  all: Problem[],
  courseId: CourseId,
  quizN: number,
): Problem[] {
  const course = getCourse(courseId);
  if (!course) return [];
  const n = Math.min(Math.max(1, quizN), FINAL_QUIZ_COUNT);
  const domains = courseDomains(course);
  const quota = quotaFor(domains.length, n);
  const offset = courseSeed(courseId);

  const buckets = domains.map((domain, di) =>
    seededShuffle(
      all.filter((p) => p.domain === domain),
      mulberry32(987_001 + offset + di * 101),
    )
      .sort((a, b) => b.difficulty - a.difficulty)
      .filter((_, i) => i % FINAL_QUIZ_COUNT === n - 1),
  );

  const picked: Problem[] = [];
  const used = new Set<string>();
  buckets.forEach((bucket, di) => {
    for (const p of bucket.slice(0, quota[di])) {
      picked.push(p);
      used.add(p.id);
    }
  });

  // A strand with little content would otherwise shorten the quiz. Top up from
  // whatever else is in THIS quiz's buckets, so no other quiz loses a question.
  if (picked.length < FINAL_QUIZ_SIZE) {
    const rest = buckets
      .flat()
      .filter((p) => !used.has(p.id))
      .sort((a, b) => b.difficulty - a.difficulty);
    for (const p of rest) {
      if (picked.length >= FINAL_QUIZ_SIZE) break;
      picked.push(p);
      used.add(p.id);
    }
  }

  return seededShuffle(picked, mulberry32(555_000 + offset + n));
}
