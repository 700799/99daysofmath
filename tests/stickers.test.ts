import { describe, it, expect } from 'vitest';
import {
  checkAllEarning,
  STICKER_DEFS,
  TOTAL_STICKERS,
} from '../src/utils/encouragement';
import { DOMAINS, type Domain } from '../src/types/problem';

const blankDomainCounts = (): Record<Domain, number> =>
  DOMAINS.reduce((acc, d) => ({ ...acc, [d]: 0 }), {} as Record<Domain, number>);

const baseCtx = () => ({
  xp: 0,
  dailyStreak: 0,
  bestSessionStreak: 0,
  totalPerfectUnits: 0,
  byDomainUnitsCompleted: blankDomainCounts(),
  alreadyEarned: new Set<string>(),
});

describe('STICKER_DEFS', () => {
  it('has 58 total stickers', () => {
    // 30 unit + 8 streak + 4 accuracy + 5 XP + 6 mastery + 5 challenge
    expect(TOTAL_STICKERS).toBe(58);
  });

  it('every sticker ID is unique', () => {
    const ids = new Set(STICKER_DEFS.map((s) => s.id));
    expect(ids.size).toBe(STICKER_DEFS.length);
  });
});

describe('checkAllEarning — streak family', () => {
  it('awards streak-3 at dailyStreak 3', () => {
    const earned = checkAllEarning({ ...baseCtx(), dailyStreak: 3 });
    expect(earned).toContain('streak-3');
    expect(earned).not.toContain('streak-7');
  });

  it('does not re-award streak-3 if already earned', () => {
    const earned = checkAllEarning({
      ...baseCtx(),
      dailyStreak: 3,
      alreadyEarned: new Set(['streak-3']),
    });
    expect(earned).not.toContain('streak-3');
  });

  it('awards multiple streak stickers when crossing several thresholds', () => {
    const earned = checkAllEarning({ ...baseCtx(), dailyStreak: 30 });
    expect(earned).toEqual(
      expect.arrayContaining(['streak-3', 'streak-7', 'streak-14', 'streak-30']),
    );
    expect(earned).not.toContain('streak-50');
  });

  it('awards combo-10 at bestSessionStreak 10', () => {
    const earned = checkAllEarning({ ...baseCtx(), bestSessionStreak: 10 });
    expect(earned).toContain('combo-10');
  });
});

describe('checkAllEarning — XP family', () => {
  it('xp-100 at xp ≥ 100', () => {
    const earned = checkAllEarning({ ...baseCtx(), xp: 100 });
    expect(earned).toContain('xp-100');
    expect(earned).not.toContain('xp-250');
  });

  it('xp-2500 awards all lower tiers too', () => {
    const earned = checkAllEarning({ ...baseCtx(), xp: 2500 });
    expect(earned).toEqual(
      expect.arrayContaining(['xp-100', 'xp-250', 'xp-500', 'xp-1000', 'xp-2500']),
    );
  });
});

describe('checkAllEarning — accuracy family', () => {
  it('awards acc-perfect-1 on first 3-star unit', () => {
    const earned = checkAllEarning(
      { ...baseCtx(), totalPerfectUnits: 1 },
      { domain: '6.RP', unit: 1, stars: 3, mistakesTotal: 0 },
    );
    expect(earned).toContain('acc-perfect-1');
  });

  it('awards acc-no-mistakes-unit when unit done with 0 mistakes', () => {
    const earned = checkAllEarning(
      { ...baseCtx() },
      { domain: '6.RP', unit: 1, stars: 2, mistakesTotal: 0 },
    );
    expect(earned).toContain('acc-no-mistakes-unit');
  });

  it('does NOT award acc-no-mistakes-unit when there were mistakes', () => {
    const earned = checkAllEarning(
      { ...baseCtx() },
      { domain: '6.RP', unit: 1, stars: 1, mistakesTotal: 1 },
    );
    expect(earned).not.toContain('acc-no-mistakes-unit');
  });
});

describe('checkAllEarning — mastery family', () => {
  it('awards mastery-6.RP when 6 units in 6.RP completed at ≥ 2 stars', () => {
    const counts = blankDomainCounts();
    counts['6.RP'] = 6;
    const earned = checkAllEarning({
      ...baseCtx(),
      byDomainUnitsCompleted: counts,
    });
    expect(earned).toContain('mastery-6.RP');
    expect(earned).not.toContain('mastery-grand');
  });

  it('awards mastery-grand when all 5 domains completed', () => {
    const counts = blankDomainCounts();
    for (const d of DOMAINS) counts[d] = 6;
    const earned = checkAllEarning({
      ...baseCtx(),
      byDomainUnitsCompleted: counts,
    });
    expect(earned).toContain('mastery-grand');
    expect(earned).toContain('mastery-6.RP');
  });
});

describe('checkAllEarning — unit stickers', () => {
  it('awards unit sticker on 3-star unit completion', () => {
    const earned = checkAllEarning(baseCtx(), {
      domain: '6.RP',
      unit: 1,
      stars: 3,
      mistakesTotal: 0,
    });
    expect(earned).toContain('unit:6.RP:1');
  });

  it('does NOT award unit sticker for fewer than 3 stars', () => {
    const earned = checkAllEarning(baseCtx(), {
      domain: '6.RP',
      unit: 1,
      stars: 2,
      mistakesTotal: 0,
    });
    expect(earned).not.toContain('unit:6.RP:1');
  });
});

describe('checkAllEarning — challenge family', () => {
  it('awards mock-test-1 after a mock test', () => {
    const earned = checkAllEarning({ ...baseCtx(), mockTestsCompleted: 1 });
    expect(earned).toContain('mock-test-1');
  });

  it('awards quest-1 when daily quest streak ≥ 1', () => {
    const earned = checkAllEarning({ ...baseCtx(), dailyQuestStreak: 1 });
    expect(earned).toContain('quest-1');
    expect(earned).not.toContain('quest-streak-7');
  });

  it('awards quest-streak-7 at a 7-day quest streak', () => {
    const earned = checkAllEarning({ ...baseCtx(), dailyQuestStreak: 7 });
    expect(earned).toContain('quest-1');
    expect(earned).toContain('quest-streak-7');
  });

  it('awards freeze-saved when a freeze has been used', () => {
    const earned = checkAllEarning({ ...baseCtx(), freezeUsedEver: true });
    expect(earned).toContain('freeze-saved');
  });

  it('awards lesson-explorer after finishing 5 lessons', () => {
    expect(checkAllEarning({ ...baseCtx(), lessonsCompleted: 4 })).not.toContain('lesson-explorer');
    expect(checkAllEarning({ ...baseCtx(), lessonsCompleted: 5 })).toContain('lesson-explorer');
  });

  it('awards no challenge stickers in the default context', () => {
    const earned = checkAllEarning(baseCtx());
    expect(earned).not.toContain('mock-test-1');
    expect(earned).not.toContain('quest-1');
    expect(earned).not.toContain('freeze-saved');
    expect(earned).not.toContain('lesson-explorer');
  });
});
