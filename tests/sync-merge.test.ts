import { describe, it, expect } from 'vitest';
import { mergeProgress } from '../src/state/sync';

// mergeProgress must never lose progress: numbers take the max, arrays union,
// booleans OR, nested objects recurse, ISO-date strings keep the later one.
describe('mergeProgress (cloud sync)', () => {
  it('returns local unchanged when remote is empty/missing', () => {
    const local = { xp: 50, stickers: ['a'] };
    expect(mergeProgress(local, null)).toEqual(local);
    expect(mergeProgress(local, {})).toEqual(local);
  });

  it('takes the max of numeric fields', () => {
    const merged = mergeProgress({ xp: 50, bestStreak: 3 }, { xp: 120, bestStreak: 1 });
    expect(merged.xp).toBe(120);
    expect(merged.bestStreak).toBe(3);
  });

  it('unions arrays without duplicates', () => {
    const merged = mergeProgress({ stickers: ['a', 'b'] }, { stickers: ['b', 'c'] });
    expect(merged.stickers).toEqual(['a', 'b', 'c']);
  });

  it('ORs one-time boolean flags', () => {
    expect(mergeProgress({ onboardingComplete: false }, { onboardingComplete: true }).onboardingComplete).toBe(true);
    expect(mergeProgress({ allTrailsBonusGranted: true }, { allTrailsBonusGranted: false }).allTrailsBonusGranted).toBe(true);
  });

  it('recurses into nested progress objects, maxing leaves', () => {
    const local = { byDomain: { rp: { unitsUnlocked: 2, unitStars: { 1: 3, 2: 1 } } } };
    const remote = { byDomain: { rp: { unitsUnlocked: 5, unitStars: { 2: 3, 3: 2 } } } };
    const merged = mergeProgress(local, remote) as typeof local;
    expect(merged.byDomain.rp.unitsUnlocked).toBe(5);
    expect(merged.byDomain.rp.unitStars).toEqual({ 1: 3, 2: 3, 3: 2 });
  });

  it('keeps the later ISO date for problem stats and prefers higher counts', () => {
    const local = { problemStats: { p1: { attempts: 3, correct: 2, lastSeen: '2026-06-01' } } };
    const remote = { problemStats: { p1: { attempts: 5, correct: 1, lastSeen: '2026-06-10' } } };
    const merged = mergeProgress(local, remote) as typeof local;
    expect(merged.problemStats.p1.attempts).toBe(5);
    expect(merged.problemStats.p1.correct).toBe(2);
    expect(merged.problemStats.p1.lastSeen).toBe('2026-06-10');
  });

  it('keeps the current device sound preference', () => {
    expect(mergeProgress({ soundEnabled: false }, { soundEnabled: true }).soundEnabled).toBe(false);
    expect(mergeProgress({ soundEnabled: true }, { soundEnabled: false }).soundEnabled).toBe(true);
  });
});
