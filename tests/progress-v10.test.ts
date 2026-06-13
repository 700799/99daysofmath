import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useProgress, migrateProgress } from '../src/state/progress';

function setToday(iso: string) {
  vi.setSystemTime(new Date(`${iso}T12:00:00`));
}

function fresh() {
  useProgress.getState().resetAll();
}

describe('platformer progression (v10)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-06-01');
    fresh();
  });
  afterEach(() => vi.useRealTimers());

  it('starts at level 0', () => {
    expect(useProgress.getState().platformerMaxLevel).toBe(0);
  });

  it('setPlatformerMaxLevel only goes up — never resets backwards', () => {
    useProgress.getState().setPlatformerMaxLevel(3);
    expect(useProgress.getState().platformerMaxLevel).toBe(3);
    useProgress.getState().setPlatformerMaxLevel(1);
    expect(useProgress.getState().platformerMaxLevel).toBe(3);
    useProgress.getState().setPlatformerMaxLevel(5);
    expect(useProgress.getState().platformerMaxLevel).toBe(5);
  });
});

describe('migrateProgress v9 -> v10', () => {
  it('seeds platformerMaxLevel with 0', () => {
    const snap = {
      arcadeBudget: { date: null, secondsPlayed: 0, lockedAt: null, mathSecondsTowardUnlock: 0 },
    };
    const migrated = migrateProgress(snap, 9) as { platformerMaxLevel?: number };
    expect(migrated.platformerMaxLevel).toBe(0);
  });

  it('preserves existing platformerMaxLevel on v10 snapshots', () => {
    const snap = { platformerMaxLevel: 4 };
    const migrated = migrateProgress(snap, 10) as { platformerMaxLevel?: number };
    expect(migrated.platformerMaxLevel).toBe(4);
  });
});
