import { describe, it, expect } from 'vitest';
import {
  computeXPGain,
  computeStars,
  TIER_PENALTY,
  BASE_XP,
  MIN_XP,
} from '../src/utils/hintEconomics';

describe('computeXPGain', () => {
  it('no hints, no mistakes → base XP', () => {
    expect(computeXPGain([], 0)).toBe(BASE_XP);
  });

  it('one nudge → base − 1', () => {
    expect(computeXPGain(['nudge'], 0)).toBe(BASE_XP - TIER_PENALTY.nudge);
  });

  it('one guide → base − 2', () => {
    expect(computeXPGain(['guide'], 0)).toBe(BASE_XP - TIER_PENALTY.guide);
  });

  it('one reveal → base − 4', () => {
    expect(computeXPGain(['reveal'], 0)).toBe(BASE_XP - TIER_PENALTY.reveal);
  });

  it('nudge then guide then reveal counts only worst tier', () => {
    expect(computeXPGain(['nudge', 'guide', 'reveal'], 0)).toBe(
      BASE_XP - TIER_PENALTY.reveal,
    );
  });

  it('one mistake → base − 3', () => {
    expect(computeXPGain([], 1)).toBe(BASE_XP - 3);
  });

  it('floor at MIN_XP', () => {
    expect(computeXPGain(['reveal'], 5)).toBe(MIN_XP);
  });

  it('legacy single hint (guide) + one mistake', () => {
    expect(computeXPGain(['guide'], 1)).toBe(BASE_XP - 2 - 3);
  });
});

describe('computeStars', () => {
  const fresh = { nudge: 0, guide: 0, reveal: 0 };

  it('perfect — no hints, no mistakes', () => {
    expect(computeStars(fresh, 0, 10)).toBe(3);
  });

  it('one nudge tolerated → still 3 stars', () => {
    expect(computeStars({ ...fresh, nudge: 1 }, 0, 10)).toBe(3);
  });

  it('two nudges → 2 stars', () => {
    expect(computeStars({ ...fresh, nudge: 2 }, 0, 10)).toBe(2);
  });

  it('one guide → 2 stars', () => {
    expect(computeStars({ ...fresh, guide: 1 }, 0, 10)).toBe(2);
  });

  it('one mistake → 2 stars', () => {
    expect(computeStars(fresh, 1, 10)).toBe(2);
  });

  it('one reveal anywhere caps at 2', () => {
    expect(computeStars({ ...fresh, reveal: 1 }, 0, 10)).toBe(2);
  });

  it('two mistakes → 1 star', () => {
    expect(computeStars(fresh, 2, 10)).toBe(1);
  });

  it('two guides → 1 star', () => {
    expect(computeStars({ ...fresh, guide: 2 }, 0, 10)).toBe(1);
  });

  it('zero problems → 0 stars', () => {
    expect(computeStars(fresh, 0, 0)).toBe(0);
  });
});
