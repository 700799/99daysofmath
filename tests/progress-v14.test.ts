import { describe, it, expect } from 'vitest';
import { useProgress, migrateProgress, type ArcadeConfig } from '../src/state/progress';

describe('migrateProgress v13 -> v14 (challenge + time-budget + game visibility)', () => {
  it('seeds the new arcadeConfig fields with defaults', () => {
    const snap = {
      arcadeConfig: {
        lessonsPerSession: 1,
        startLevel: 1,
        livesPerSession: 3,
        checkProblems: 2,
        adminPin: '13680',
        unlimited: false,
      },
    };
    const migrated = migrateProgress(snap, 13) as { arcadeConfig: ArcadeConfig };
    const cfg = migrated.arcadeConfig;
    expect(cfg.challengeInterval).toBe(20);
    expect(cfg.challengeCount).toBe(3);
    expect(cfg.challengeLevel).toBe(2);
    expect(cfg.minLessonSeconds).toBe(0);
    expect(cfg.earnRatio).toBe(1);
    expect(cfg.hiddenGames).toEqual([]);
    // existing fields untouched
    expect(cfg.adminPin).toBe('13680');
  });

  it('preserves custom values already present on v14 snapshots', () => {
    const snap = {
      arcadeConfig: {
        lessonsPerSession: 2,
        startLevel: 3,
        livesPerSession: 5,
        checkProblems: 3,
        adminPin: '9999',
        unlimited: true,
        challengeInterval: 60,
        challengeCount: 1,
        challengeLevel: 5,
        minLessonSeconds: 120,
        earnRatio: 2,
        hiddenGames: ['snake'],
      },
    };
    const migrated = migrateProgress(snap, 14) as { arcadeConfig: ArcadeConfig };
    expect(migrated.arcadeConfig.challengeInterval).toBe(60);
    expect(migrated.arcadeConfig.hiddenGames).toEqual(['snake']);
    expect(migrated.arcadeConfig.earnRatio).toBe(2);
  });

  it('fresh state has the v14 defaults', () => {
    const cfg = useProgress.getState().arcadeConfig;
    expect(cfg.challengeInterval).toBe(120); // v17: 2-minute speed-round default
    expect(cfg.challengeCount).toBe(3);
    expect(cfg.earnRatio).toBe(1);
    expect(Array.isArray(cfg.hiddenGames)).toBe(true);
  });
});
