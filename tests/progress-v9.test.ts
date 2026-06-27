import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useProgress, migrateProgress } from '../src/state/progress';

function setToday(iso: string) {
  vi.setSystemTime(new Date(`${iso}T12:00:00`));
}

function fresh() {
  useProgress.getState().resetAll();
}

// The old daily 3-min arcade cap / 15-min math-unlock was replaced by the
// lesson-to-play gate, so the arcade is never time-locked. We still track
// play-time stats.
describe('arcade time tracking (cap replaced by lesson gate)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-06-01');
    fresh();
  });
  afterEach(() => vi.useRealTimers());

  it('is never time-locked, no matter how long you play', () => {
    const s = useProgress.getState();
    expect(s.isArcadeLocked()).toBe(false);
    useProgress.getState().tickArcadeSeconds(10_000);
    expect(useProgress.getState().isArcadeLocked()).toBe(false);
  });

  it('tickArcadeSeconds accrues lifetime play seconds', () => {
    useProgress.getState().tickArcadeSeconds(60);
    useProgress.getState().tickArcadeSeconds(30);
    expect(useProgress.getState().cumArcadeSeconds).toBe(90);
  });

  it('tracks lesson time, app time, and points cumulatively', () => {
    useProgress.getState().tickLessonSeconds(45);
    useProgress.getState().tickAppSeconds(120);
    useProgress.getState().addArcadePoints(250);
    const s = useProgress.getState();
    expect(s.cumLessonSeconds).toBe(45);
    expect(s.cumAppSeconds).toBe(120);
    expect(s.cumArcadePoints).toBe(250);
  });
});

describe('arcadeConfig (v11)', () => {
  beforeEach(() => fresh());

  it('has sensible defaults', () => {
    const c = useProgress.getState().arcadeConfig;
    expect(c.lessonsPerSession).toBe(1);
    expect(c.startLevel).toBe(1);
    expect(c.livesPerSession).toBe(3);
    expect(c.checkProblems).toBe(2);
  });

  it('setArcadeConfig merges a partial update', () => {
    useProgress.getState().setArcadeConfig({ lessonsPerSession: 2, startLevel: 3 });
    const c = useProgress.getState().arcadeConfig;
    expect(c.lessonsPerSession).toBe(2);
    expect(c.startLevel).toBe(3);
    expect(c.livesPerSession).toBe(3); // untouched
  });

  it('migrate v10 -> v11 seeds arcadeConfig + cumulative counters', () => {
    const migrated = migrateProgress({}, 10) as {
      arcadeConfig?: { lessonsPerSession: number };
      cumArcadeSeconds?: number;
      cumLessonSeconds?: number;
      cumArcadePoints?: number;
      cumAppSeconds?: number;
    };
    expect(migrated.arcadeConfig?.lessonsPerSession).toBe(1);
    expect(migrated.cumArcadeSeconds).toBe(0);
    expect(migrated.cumLessonSeconds).toBe(0);
    expect(migrated.cumArcadePoints).toBe(0);
    expect(migrated.cumAppSeconds).toBe(0);
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
