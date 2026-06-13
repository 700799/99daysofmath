import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  useProgress,
  migrateProgress,
  ARCADE_DAILY_CAP_SECONDS,
  MATH_UNLOCK_SECONDS,
} from '../src/state/progress';

function setToday(iso: string) {
  vi.setSystemTime(new Date(`${iso}T12:00:00`));
}

function fresh() {
  useProgress.getState().resetAll();
}

describe('arcade daily cap (v9)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-06-01');
    fresh();
  });
  afterEach(() => vi.useRealTimers());

  it('starts unlocked with full 3-min budget on a fresh day', () => {
    const s = useProgress.getState();
    expect(s.isArcadeLocked()).toBe(false);
    expect(s.arcadeRemainingSeconds()).toBe(ARCADE_DAILY_CAP_SECONDS);
    expect(s.mathRemainingSeconds()).toBe(0);
  });

  it('tickArcadeSeconds counts down and locks once the cap is hit', () => {
    useProgress.getState().tickArcadeSeconds(60);
    expect(useProgress.getState().arcadeRemainingSeconds()).toBe(120);
    expect(useProgress.getState().isArcadeLocked()).toBe(false);

    useProgress.getState().tickArcadeSeconds(120);
    expect(useProgress.getState().arcadeRemainingSeconds()).toBe(0);
    expect(useProgress.getState().isArcadeLocked()).toBe(true);
    expect(useProgress.getState().mathRemainingSeconds()).toBe(MATH_UNLOCK_SECONDS);
  });

  it('tickMathSeconds only counts while locked', () => {
    useProgress.getState().tickMathSeconds(300);
    // Not locked yet — credit must not accrue ahead of time.
    expect(useProgress.getState().mathRemainingSeconds()).toBe(0);

    useProgress.getState().tickArcadeSeconds(ARCADE_DAILY_CAP_SECONDS);
    expect(useProgress.getState().isArcadeLocked()).toBe(true);

    useProgress.getState().tickMathSeconds(300);
    expect(useProgress.getState().mathRemainingSeconds()).toBe(MATH_UNLOCK_SECONDS - 300);
  });

  it('reaching MATH_UNLOCK_SECONDS unlocks and resets the day', () => {
    useProgress.getState().tickArcadeSeconds(ARCADE_DAILY_CAP_SECONDS);
    expect(useProgress.getState().isArcadeLocked()).toBe(true);

    useProgress.getState().tickMathSeconds(MATH_UNLOCK_SECONDS);
    expect(useProgress.getState().isArcadeLocked()).toBe(false);
    expect(useProgress.getState().arcadeRemainingSeconds()).toBe(ARCADE_DAILY_CAP_SECONDS);
    expect(useProgress.getState().mathRemainingSeconds()).toBe(0);
  });

  it('rolls over the budget on a new day', () => {
    useProgress.getState().tickArcadeSeconds(ARCADE_DAILY_CAP_SECONDS);
    expect(useProgress.getState().isArcadeLocked()).toBe(true);
    setToday('2026-06-02');
    expect(useProgress.getState().isArcadeLocked()).toBe(false);
    expect(useProgress.getState().arcadeRemainingSeconds()).toBe(ARCADE_DAILY_CAP_SECONDS);

    // Subsequent ticks land on the new day's budget.
    useProgress.getState().tickArcadeSeconds(30);
    expect(useProgress.getState().arcadeRemainingSeconds()).toBe(ARCADE_DAILY_CAP_SECONDS - 30);
  });
});

describe('migrateProgress v8 -> v9', () => {
  it('seeds arcadeBudget with safe defaults', () => {
    const v8Snapshot = {
      arcadeDaily: { date: null, played: [], varietyAwarded: [] },
      arcadeTotals: {},
      lastWheelSpinDate: null,
      c4Wins: 0,
      finalsResults: {},
    };
    const migrated = migrateProgress(v8Snapshot, 8) as { arcadeBudget?: unknown };
    expect(migrated.arcadeBudget).toEqual({
      date: null,
      secondsPlayed: 0,
      lockedAt: null,
      mathSecondsTowardUnlock: 0,
    });
  });
});
