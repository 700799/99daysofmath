import type { HintLevel } from '../types/problem';
import type { Stars } from '../state/progress';

export const TIER_PENALTY: Record<HintLevel, number> = {
  nudge: 1,
  guide: 2,
  reveal: 4,
};

export const MISTAKE_PENALTY = 3;
export const BASE_XP = 10;
export const MIN_XP = 3;

export function maxLevelUsed(levels: HintLevel[]): HintLevel | null {
  if (levels.length === 0) return null;
  let max: HintLevel = 'nudge';
  for (const l of levels) {
    if (l === 'reveal') return 'reveal';
    if (l === 'guide' && max === 'nudge') max = 'guide';
  }
  return max;
}

export function computeXPGain(
  hintLevels: HintLevel[],
  mistakes: number,
): number {
  const max = maxLevelUsed(hintLevels);
  const hintPenalty = max ? TIER_PENALTY[max] : 0;
  return Math.max(MIN_XP, BASE_XP - hintPenalty - mistakes * MISTAKE_PENALTY);
}

export function computeStars(
  hintTierTotals: { nudge: number; guide: number; reveal: number },
  totalMistakes: number,
  problemsAttempted: number,
): Stars {
  if (problemsAttempted === 0) return 0;
  const usedReveal = hintTierTotals.reveal > 0;
  const usedGuide = hintTierTotals.guide > 0;
  const nudges = hintTierTotals.nudge;

  if (totalMistakes === 0 && !usedGuide && !usedReveal && nudges <= 1) return 3;
  if (usedReveal) return Math.min(2, 2) as Stars;
  if (totalMistakes <= 1 && hintTierTotals.guide <= 1) return 2;
  return 1;
}
