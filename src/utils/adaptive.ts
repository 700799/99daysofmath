import type { Problem } from '../types/problem';
import type { ProblemStat } from '../state/progress';

export const PRACTICE_SIZE = 10;

// Adjust the running target difficulty after an answer (computer-adaptive-style):
// climb on a correct answer, drop further on a miss, clamped to the 1..3 scale.
export function nextTarget(target: number, correct: boolean): number {
  const t = correct ? target + 0.5 : target - 0.7;
  return Math.max(1, Math.min(3, t));
}

// Pick the next problem closest to the target difficulty, never repeating one
// already seen this session, with a small nudge toward problems the student has
// struggled with (and a touch of jitter so sessions vary).
export function pickAdaptiveProblem(
  pool: Problem[],
  seenIds: Set<string>,
  targetDifficulty: number,
  problemStats: Record<string, ProblemStat>,
): Problem | null {
  const available = pool.filter((p) => !seenIds.has(p.id));
  if (available.length === 0) return null;
  const target = Math.max(1, Math.min(3, targetDifficulty));

  let best: Problem | null = null;
  let bestScore = -Infinity;
  for (const p of available) {
    const diffPenalty = Math.abs(p.difficulty - target) * 2;
    const st = problemStats[p.id];
    const struggle = st && st.attempts > 0 ? 1 - st.correct / st.attempts : 0.3;
    const score = -diffPenalty + struggle + Math.random() * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}
