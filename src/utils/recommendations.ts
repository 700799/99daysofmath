import { DOMAINS, type Domain } from '../types/problem';
import { UNIT_COUNT_BY_DOMAIN } from './encouragement';

interface DomainProgressLike {
  unitsUnlocked: number;
  unitStars: Record<number, number>;
}

export interface Recommendation {
  domain: Domain;
  unit: number;
  reason: string;
  allMastered: boolean;
}

// Suggest the most useful next unit to practice.
// Heuristic priority:
//   1. Lowest-starred unlocked unit (≤1 star) → "Improve your stars"
//   2. The newest unlocked unit not yet completed → "Continue your progress"
//   3. Everything strong → suggest a mock test ("Try a mock test")
export function recommendNextUnit(
  byDomain: Record<Domain, DomainProgressLike>,
): Recommendation | null {
  let weakest: { domain: Domain; unit: number; stars: number } | null = null;
  let frontier: { domain: Domain; unit: number } | null = null;

  for (const domain of DOMAINS) {
    const dp = byDomain[domain];
    if (!dp) continue;
    // Trails are open — consider every unit in the domain.
    for (let unit = 1; unit <= UNIT_COUNT_BY_DOMAIN[domain]; unit++) {
      const stars = dp.unitStars[unit] ?? 0;
      // Track the weakest unlocked unit by stars.
      if (weakest === null || stars < weakest.stars) {
        weakest = { domain, unit, stars };
      }
      // Track the first not-yet-started unit (0 stars) as a progress frontier.
      if (stars === 0 && frontier === null) {
        frontier = { domain, unit };
      }
    }
  }

  if (weakest && weakest.stars <= 1) {
    return {
      domain: weakest.domain,
      unit: weakest.unit,
      reason: weakest.stars === 0 ? 'Start a new unit' : 'Improve your stars',
      allMastered: false,
    };
  }

  if (frontier) {
    return {
      domain: frontier.domain,
      unit: frontier.unit,
      reason: 'Continue your progress',
      allMastered: false,
    };
  }

  // Everything unlocked is at ≥2 stars — suggest a mock test instead.
  if (weakest) {
    return {
      domain: weakest.domain,
      unit: weakest.unit,
      reason: 'Try a mock test to check your skills',
      allMastered: true,
    };
  }

  return null;
}
