import { describe, it, expect } from 'vitest';
import { migrateProgress } from '../src/state/progress';

describe('migrateProgress v19 -> v20 (per-screen lesson read time)', () => {
  it('seeds the 6-second default when missing', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { storyInterval: 5 } },
      19,
    ) as Record<string, any>;
    expect(migrated.arcadeConfig.lessonScreenSeconds).toBe(6);
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
