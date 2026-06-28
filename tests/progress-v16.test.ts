import { describe, it, expect } from 'vitest';
import { useProgress, migrateProgress, type ArcadeConfig } from '../src/state/progress';

describe('migrateProgress v15 -> v16 (new game progress + story breaks)', () => {
  it('seeds the new game-progress fields', () => {
    const migrated = migrateProgress({ xp: 1 }, 15) as Record<string, unknown>;
    expect(migrated.monsterMaxWave).toBe(0);
    expect(migrated.shinobiMaxLevel).toBe(0);
    expect(migrated.racerMaxStage).toBe(0);
  });

  it('seeds storyInterval on an existing arcadeConfig', () => {
    const snap = {
      arcadeConfig: {
        lessonsPerSession: 1, startLevel: 1, livesPerSession: 3, checkProblems: 2,
        adminPin: '13680', unlimited: false, challengeInterval: 20, challengeCount: 3,
        challengeLevel: 2, minLessonSeconds: 0, earnRatio: 1, hiddenGames: [],
      },
    };
    const migrated = migrateProgress(snap, 15) as { arcadeConfig: ArcadeConfig };
    expect(migrated.arcadeConfig.storyInterval).toBe(5);
  });

  it('fresh state has v16 defaults + only-increase setters', () => {
    const st = useProgress.getState();
    expect(st.monsterMaxWave).toBe(0);
    expect(st.arcadeConfig.storyInterval).toBe(5);
    st.setRacerMaxStage(3);
    expect(useProgress.getState().racerMaxStage).toBe(3);
    st.setRacerMaxStage(1);
    expect(useProgress.getState().racerMaxStage).toBe(3);
  });
});
