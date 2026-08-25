import { CORE_DOMAINS, type Problem } from '../types/problem';

export const FINAL_QUIZ_COUNT = 5;
export const FINAL_QUIZ_SIZE = 20;

// Deterministic PRNG so the five quizzes are stable across visits/devices.
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

// How many questions each CORE domain contributes to quiz n. Derived from
// FINAL_QUIZ_SIZE so the total always holds (6 domains → 4+4+3+3+3+3 = 20);
// rotates per quiz so the "heavy" domains vary. Finals deliberately draw from
// CORE_DOMAINS only — Algebra 1 has its own trail and stays out of MAP prep.
function quotaFor(quizN: number): number[] {
  const n = CORE_DOMAINS.length;
  const floor = Math.floor(FINAL_QUIZ_SIZE / n);
  const extra = FINAL_QUIZ_SIZE - floor * n;
  const base = CORE_DOMAINS.map((_, i) => floor + (i < extra ? 1 : 0));
  const rot = (quizN - 1) % base.length;
  return base.map((_, i) => base[(i + rot) % base.length]);
}

// Build the five non-overlapping 20-question sets:
//  1. per domain, deterministically shuffle then order difficulty-descending;
//  2. deal each domain's list round-robin into 5 buckets (no overlap, even
//     difficulty spread);
//  3. quiz n takes its quota from each domain's bucket n, hardest first;
//  4. the final order is a seeded shuffle.
export function pickFinalQuiz(all: Problem[], quizN: number): Problem[] {
  const n = Math.min(Math.max(1, quizN), FINAL_QUIZ_COUNT);
  const quota = quotaFor(n);
  const picked: Problem[] = [];

  CORE_DOMAINS.forEach((domain, di) => {
    const rand = mulberry32(987_001 + di * 101);
    const pool = seededShuffle(
      all.filter((p) => p.domain === domain),
      rand,
    ).sort((a, b) => b.difficulty - a.difficulty);
    const bucket = pool.filter((_, i) => i % FINAL_QUIZ_COUNT === n - 1);
    picked.push(...bucket.slice(0, quota[di]));
  });

  return seededShuffle(picked, mulberry32(555_000 + n));
}
