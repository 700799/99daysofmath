import { describe, it, expect } from 'vitest';
import { migrateProgress } from '../src/state/progress';

describe('migrateProgress v21 -> v22 (Algebra 1 domain + arcade unit)', () => {
  it('seeds byDomain.A1 when missing', () => {
    const migrated = migrateProgress(
      {
        byDomain: {
          '6.RP': { unitsUnlocked: 3, unitStars: { 1: 3 }, missedProblemIds: [] },
        },
      },
      21,
    ) as Record<string, any>;
    expect(migrated.byDomain['A1']).toEqual({
      unitsUnlocked: 1,
      unitStars: {},
      missedProblemIds: [],
    });
    // existing progress untouched
    expect(migrated.byDomain['6.RP'].unitsUnlocked).toBe(3);
    expect(migrated.byDomain['6.RP'].unitStars[1]).toBe(3);
  });

  it('preserves an existing A1 record', () => {
    const migrated = migrateProgress(
      {
        byDomain: {
          A1: { unitsUnlocked: 5, unitStars: { 2: 2 }, missedProblemIds: ['A1.014'] },
        },
      },
      21,
    ) as Record<string, any>;
    expect(migrated.byDomain['A1'].unitsUnlocked).toBe(5);
    expect(migrated.byDomain['A1'].unitStars[2]).toBe(2);
    expect(migrated.byDomain['A1'].missedProblemIds).toEqual(['A1.014']);
  });

  it("seeds the arcade 'a1' unit in every per-unit mastery map", () => {
    const migrated = migrateProgress(
      {
        arcadeLevels: { '6.RP': 4 },
        arcadeStreak: { '6.RP': 2 },
        arcadeMiss: { '6.RP': 1 },
      },
      21,
    ) as Record<string, any>;
    expect(migrated.arcadeLevels['a1']).toBe(1);
    expect(migrated.arcadeStreak['a1']).toBe(0);
    expect(migrated.arcadeMiss['a1']).toBe(0);
    // existing values preserved
    expect(migrated.arcadeLevels['6.RP']).toBe(4);
    expect(migrated.arcadeStreak['6.RP']).toBe(2);
    expect(migrated.arcadeMiss['6.RP']).toBe(1);
  });

  it("preserves existing 'a1' arcade values", () => {
    const migrated = migrateProgress({ arcadeLevels: { a1: 7 } }, 21) as Record<string, any>;
    expect(migrated.arcadeLevels['a1']).toBe(7);
  });
});
