import { describe, it, expect } from 'vitest';
import { useProgress, migrateProgress } from '../src/state/progress';

describe('migrateProgress v14 -> v15 (new games + achievements + haptics)', () => {
  it('seeds the new fields with defaults', () => {
    const snap = { xp: 5 };
    const migrated = migrateProgress(snap, 14) as Record<string, unknown>;
    expect(migrated.survivorsMaxStage).toBe(0);
    expect(migrated.rogueMaxDepth).toBe(0);
    expect(migrated.townMaxTier).toBe(0);
    expect(migrated.spaceMaxLevel).toBe(0);
    expect(migrated.achievementPoints).toBe(0);
    expect(migrated.hapticsEnabled).toBe(true);
    expect(migrated.xp).toBe(5);
  });

  it('preserves existing values on v15 snapshots', () => {
    const snap = { spaceMaxLevel: 7, achievementPoints: 120, hapticsEnabled: false };
    const migrated = migrateProgress(snap, 15) as Record<string, unknown>;
    expect(migrated.spaceMaxLevel).toBe(7);
    expect(migrated.achievementPoints).toBe(120);
    expect(migrated.hapticsEnabled).toBe(false);
  });

  it('fresh state has v15 defaults and only-increase setters', () => {
    const st = useProgress.getState();
    expect(st.achievementPoints).toBe(0);
    expect(st.hapticsEnabled).toBe(true);
    st.setSpaceMaxLevel(4);
    expect(useProgress.getState().spaceMaxLevel).toBe(4);
    st.setSpaceMaxLevel(2);
    expect(useProgress.getState().spaceMaxLevel).toBe(4);
    st.addAchievement(15);
    expect(useProgress.getState().achievementPoints).toBeGreaterThanOrEqual(15);
  });
});
