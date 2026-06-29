import { describe, it, expect } from 'vitest';
import { useProgress, migrateProgress } from '../src/state/progress';

describe('migrateProgress v16 -> v17 (adaptive arcade)', () => {
  it('seeds the adaptive unit/level/mastery fields', () => {
    const migrated = migrateProgress({ xp: 1 }, 16) as Record<string, any>;
    expect(migrated.arcadeUnit).toBe('mixed');
    expect(migrated.arcadeLevels.mixed).toBe(1);
    expect(migrated.arcadeStreak['6.RP']).toBe(0);
    expect(migrated.arcadeMiss['6.EE']).toBe(0);
  });

  it('keeps an existing challenge interval but seeds 120 when none was set', () => {
    const kept = migrateProgress({
      arcadeConfig: {
        lessonsPerSession: 1, startLevel: 1, livesPerSession: 3, checkProblems: 2,
        adminPin: '13680', unlimited: false, challengeInterval: 30, challengeCount: 3,
        challengeLevel: 2, minLessonSeconds: 0, earnRatio: 1, hiddenGames: [], storyInterval: 5,
      },
    }, 16) as { arcadeConfig: { challengeInterval: number } };
    expect(kept.arcadeConfig.challengeInterval).toBe(30);

    const seeded = migrateProgress({
      arcadeConfig: {
        lessonsPerSession: 1, startLevel: 1, livesPerSession: 3, checkProblems: 2,
        adminPin: '13680', unlimited: false, challengeCount: 3,
        challengeLevel: 2, minLessonSeconds: 0, earnRatio: 1, hiddenGames: [], storyInterval: 5,
      },
    }, 16) as { arcadeConfig: { challengeInterval: number } };
    expect(seeded.arcadeConfig.challengeInterval).toBe(120);
  });

  it('recordArcadeAnswer adapts the level up after 5 correct and down after 3 wrong', () => {
    const st = useProgress.getState();
    st.resetArcadeMastery();
    st.setArcadeUnit('6.RP');
    // 5 correct in a row → level 2, streak resets
    for (let i = 0; i < 4; i++) st.recordArcadeAnswer('6.RP', true);
    expect(useProgress.getState().arcadeLevels['6.RP']).toBe(1);
    expect(useProgress.getState().arcadeStreak['6.RP']).toBe(4);
    const up = st.recordArcadeAnswer('6.RP', true);
    expect(up.level).toBe(2);
    expect(useProgress.getState().arcadeLevels['6.RP']).toBe(2);
    expect(useProgress.getState().arcadeStreak['6.RP']).toBe(0);
    // 3 wrong in a row → back down to level 1
    st.recordArcadeAnswer('6.RP', false);
    st.recordArcadeAnswer('6.RP', false);
    const down = st.recordArcadeAnswer('6.RP', false);
    expect(down.level).toBe(1);
    expect(useProgress.getState().arcadeLevels['6.RP']).toBe(1);
  });

  it('never drops below level 1 or rises above level 5', () => {
    const st = useProgress.getState();
    st.resetArcadeMastery();
    st.setArcadeUnit('6.NS');
    for (let i = 0; i < 6; i++) st.recordArcadeAnswer('6.NS', false);
    expect(useProgress.getState().arcadeLevels['6.NS']).toBe(1);
    for (let i = 0; i < 60; i++) st.recordArcadeAnswer('6.NS', true);
    expect(useProgress.getState().arcadeLevels['6.NS']).toBe(5);
  });
});
