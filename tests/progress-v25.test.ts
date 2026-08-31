import { describe, it, expect } from 'vitest';
import { migrateProgress } from '../src/state/progress';

describe('migrateProgress v24 -> v25 (SAT Math section)', () => {
  it('seeds byDomain.SAT when missing', () => {
    const migrated = migrateProgress(
      { byDomain: { PC: { unitsUnlocked: 5, unitStars: { 2: 3 }, missedProblemIds: [] } } },
      24,
    ) as Record<string, any>;
    expect(migrated.byDomain['SAT']).toEqual({
      unitsUnlocked: 1,
      unitStars: {},
      missedProblemIds: [],
    });
    // Existing course progress is untouched.
    expect(migrated.byDomain['PC'].unitsUnlocked).toBe(5);
  });

  it('preserves an existing SAT record rather than resetting it', () => {
    const migrated = migrateProgress(
      { byDomain: { SAT: { unitsUnlocked: 12, unitStars: { 4: 3 }, missedProblemIds: ['SAT.041'] } } },
      24,
    ) as Record<string, any>;
    expect(migrated.byDomain['SAT'].unitsUnlocked).toBe(12);
    expect(migrated.byDomain['SAT'].unitStars).toEqual({ 4: 3 });
    expect(migrated.byDomain['SAT'].missedProblemIds).toEqual(['SAT.041']);
  });

  it('seeds an empty mock-test ledger and tip-read list', () => {
    const migrated = migrateProgress({}, 24) as Record<string, any>;
    expect(migrated.satTests).toEqual({});
    expect(migrated.satBestScaled).toBe(0);
    expect(migrated.satTipsRead).toEqual([]);
  });

  it('preserves mock-test results already recorded', () => {
    const existing = {
      satTests: { 1: { correct: 30, total: 44, scaled: 610, seconds: 3200, completedAt: 'x', answers: {} } },
      satBestScaled: 610,
      satTipsRead: ['fmt-modules'],
    };
    const migrated = migrateProgress(existing, 24) as Record<string, any>;
    expect(migrated.satTests[1].scaled).toBe(610);
    expect(migrated.satBestScaled).toBe(610);
    expect(migrated.satTipsRead).toEqual(['fmt-modules']);
  });

  it('runs the SAT step for anyone upgrading from well before v24', () => {
    const migrated = migrateProgress({ byDomain: {} }, 10) as Record<string, any>;
    expect(migrated.byDomain['SAT']).toBeDefined();
    expect(migrated.satTests).toEqual({});
    // and the v24 theme default still lands
    expect(migrated.theme).toBe('light');
  });
});
