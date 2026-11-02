import { describe, it, expect } from 'vitest';
import { migrateProgress } from '../src/state/progress';

type Migrated = { byDomain: Record<string, { unitsUnlocked: number; unitStars: Record<string, number>; missedProblemIds: string[] }> };

// AP Calculus AB and AP Statistics arrive at version 31. An install from
// before then has no trail record for either, and would otherwise crash the
// first time a page read it.
describe('progress v31 migration', () => {
  it('seeds byDomain.CALC and byDomain.STAT when missing', () => {
    const migrated = migrateProgress({ byDomain: { PC: { unitsUnlocked: 2, unitStars: {}, missedProblemIds: [] } } }, 30) as Migrated;
    for (const d of ['CALC', 'STAT']) {
      expect(migrated.byDomain[d]).toEqual({ unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] });
    }
    expect(migrated.byDomain['PC'].unitsUnlocked).toBe(2);
  });

  it('preserves an existing record', () => {
    const migrated = migrateProgress(
      { byDomain: { CALC: { unitsUnlocked: 6, unitStars: { 3: 2 }, missedProblemIds: ['CALC.021'] } } },
      30,
    ) as Migrated;
    expect(migrated.byDomain['CALC'].unitsUnlocked).toBe(6);
    expect(migrated.byDomain['CALC'].missedProblemIds).toEqual(['CALC.021']);
    expect(migrated.byDomain['STAT'].unitsUnlocked).toBe(1);
  });
});
