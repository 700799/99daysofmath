import { describe, it, expect } from 'vitest';
import { migrateProgress, ARCADE_UNITS } from '../src/state/progress';

describe('migrateProgress v18 -> v19 (new arcade units)', () => {
  it('backfills level/streak/miss for the new units, keeping old values', () => {
    const migrated = migrateProgress(
      { arcadeLevels: { '6.RP': 4 }, arcadeStreak: { '6.RP': 3 }, arcadeMiss: {} },
      18,
    ) as Record<string, any>;
    expect(migrated.arcadeLevels['6.RP']).toBe(4); // preserved
    expect(migrated.arcadeStreak['6.RP']).toBe(3);
    for (const u of ARCADE_UNITS) {
      expect(migrated.arcadeLevels[u]).toBeGreaterThanOrEqual(1);
      expect(migrated.arcadeStreak[u]).toBe(u === '6.RP' ? 3 : 0);
      expect(migrated.arcadeMiss[u]).toBe(0);
    }
  });

  it('includes Geometry, Statistics and Grade-5 review in the unit list', () => {
    expect(ARCADE_UNITS).toContain('6.G');
    expect(ARCADE_UNITS).toContain('6.SP');
    expect(ARCADE_UNITS).toContain('g5');
  });
});
