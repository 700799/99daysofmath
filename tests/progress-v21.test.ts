import { describe, it, expect } from 'vitest';
import { migrateProgress } from '../src/state/progress';

describe('migrateProgress v20 -> v21 (think-time answer reveal)', () => {
  it('seeds the 15-second default when missing', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { lessonScreenSeconds: 6 } },
      20,
    ) as Record<string, any>;
    expect(migrated.arcadeConfig.answerRevealSeconds).toBe(15);
  });

  it('preserves an existing admin-set value', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { answerRevealSeconds: 30 } },
      20,
    ) as Record<string, any>;
    expect(migrated.arcadeConfig.answerRevealSeconds).toBe(30);
  });

  it('allows 0 (instant) to be kept', () => {
    const migrated = migrateProgress(
      { arcadeConfig: { answerRevealSeconds: 0 } },
      20,
    ) as Record<string, any>;
    expect(migrated.arcadeConfig.answerRevealSeconds).toBe(0);
  });
});
