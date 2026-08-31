import { describe, it, expect } from 'vitest';
import { migrateProgress } from '../src/state/progress';

describe('migrateProgress v22 -> v23 (Precalculus domain + arcade unit)', () => {
  it('seeds byDomain.PC when missing', () => {
    const migrated = migrateProgress(
      { byDomain: { A1: { unitsUnlocked: 4, unitStars: { 1: 3 }, missedProblemIds: [] } } },
      22,
    ) as Record<string, any>;
    expect(migrated.byDomain['PC']).toEqual({
      unitsUnlocked: 1,
      unitStars: {},
      missedProblemIds: [],
    });
    expect(migrated.byDomain['A1'].unitsUnlocked).toBe(4);
  });

  it('preserves an existing PC record', () => {
    const migrated = migrateProgress(
      { byDomain: { PC: { unitsUnlocked: 9, unitStars: { 3: 2 }, missedProblemIds: ['PC.021'] } } },
      22,
    ) as Record<string, any>;
    expect(migrated.byDomain['PC'].unitsUnlocked).toBe(9);
    expect(migrated.byDomain['PC'].missedProblemIds).toEqual(['PC.021']);
  });

  it("seeds the arcade 'pc' unit across the per-unit mastery maps", () => {
    const migrated = migrateProgress(
      { arcadeLevels: { a1: 3 }, arcadeStreak: {}, arcadeMiss: {} },
      22,
    ) as Record<string, any>;
    expect(migrated.arcadeLevels['pc']).toBe(1);
    expect(migrated.arcadeStreak['pc']).toBe(0);
    expect(migrated.arcadeMiss['pc']).toBe(0);
    expect(migrated.arcadeLevels['a1']).toBe(3);
  });
});
