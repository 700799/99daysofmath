import { describe, it, expect } from 'vitest';
import { migrateProgress } from '../src/state/progress';

describe('migrateProgress v19 -> v20 (per-screen lesson read time)', () => {
  // v20 seeded 6s, but v30 turned the read gate off by default. An install that
  // never chose a value ends the migration chain with it off.
  it('ends up OFF for an install that never chose a read time', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { storyInterval: 5 } },
      19,
    ) as Record<string, any>;
    expect(migrated.arcadeConfig.lessonScreenSeconds).toBe(0);
  });

  it('preserves an existing admin-set value', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { lessonScreenSeconds: 10 } },
      19,
    ) as Record<string, any>;
    expect(migrated.arcadeConfig.lessonScreenSeconds).toBe(10);
  });

  it('allows 0 (off) to be kept', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { lessonScreenSeconds: 0 } },
      19,
    ) as Record<string, any>;
    expect(migrated.arcadeConfig.lessonScreenSeconds).toBe(0);
  });

  it('seeds an empty videosWatched ledger for coin rewards', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { storyInterval: 5 } },
      19,
    ) as Record<string, any>;
    expect(migrated.videosWatched).toEqual([]);
  });
});

describe('migrateProgress v29 -> v30 (the read gate ships off)', () => {
  it('clears the old 6-second default', () => {
    const migrated = migrateProgress({ arcadeConfig: { lessonScreenSeconds: 6 } }, 29) as Record<string, any>;
    expect(migrated.arcadeConfig.lessonScreenSeconds).toBe(0);
  });

  it('leaves a deliberately chosen read time alone', () => {
    for (const n of [4, 8, 10]) {
      const migrated = migrateProgress({ arcadeConfig: { lessonScreenSeconds: n } }, 29) as Record<string, any>;
      expect(migrated.arcadeConfig.lessonScreenSeconds, `chose ${n}s`).toBe(n);
    }
  });

  it('leaves an install that had already switched it off alone', () => {
    const migrated = migrateProgress({ arcadeConfig: { lessonScreenSeconds: 0 } }, 29) as Record<string, any>;
    expect(migrated.arcadeConfig.lessonScreenSeconds).toBe(0);
  });
});
