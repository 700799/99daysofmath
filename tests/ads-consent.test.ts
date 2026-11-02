import { describe, it, expect, beforeEach } from 'vitest';
import { adsAllowedOn, AD_DOMAINS, AD_COURSES } from '../src/lib/ads';
import { useConsent, adsConsented } from '../src/state/consent';

// Ads are confined to the high-school courses whose students are old enough,
// and gated on the cookie notice. These are the rules that keep them there.

describe('where ads may appear', () => {
  it('only the trig, precalculus and SAT courses', () => {
    expect([...AD_DOMAINS].sort()).toEqual(['CALC', 'PC', 'SAT', 'STAT', 'TRIG']);
    expect([...AD_COURSES].sort()).toEqual(['apstats', 'calcab', 'precalc', 'sat', 'trig']);
  });

  it('hubs, trails, units, results, reviews and finals lists of those courses', () => {
    for (const p of [
      '/sat', '/sat/tips', '/sat/unit/3', '/sat/analysis/1', '/sat/recovery/1',
      '/trail/TRIG', '/trail/PC', '/unit/TRIG/2', '/unit/PC/14/results', '/unit/SAT/5',
      '/review/TRIG', '/review/PC', '/review/SAT', '/course/trig', '/course/precalc', '/course/sat',
      '/finals/trig', '/finals/precalc', '/finals/sat',
      '/trail/CALC', '/trail/STAT', '/unit/CALC/5', '/unit/STAT/12', '/finals/calcab', '/finals/apstats',
    ]) expect(adsAllowedOn(p), p).toBe(true);
  });

  it('never on a timed test', () => {
    for (const p of ['/sat/test/1', '/finals/trig/2', '/finals/sat/1', '/finals/calcab/3', '/test']) {
      expect(adsAllowedOn(p), p).toBe(false);
    }
  });

  it('never in the younger courses or on shared pages', () => {
    for (const p of [
      '/', '/trail/5.F', '/trail/6.RP', '/trail/A1', '/trail/GEO', '/unit/6.NS/3', '/unit/A1/14',
      '/course/grade5', '/course/grade6', '/course/algebra1', '/course/geometry', '/finals/algebra1',
      '/review', '/review/6.G', '/stories', '/mathematicians', '/arcade', '/arcade/snake', '/videos',
      '/mix', '/practice', '/report', '/settings', '/shop', '/rewards', '/privacy', '/map5', '/nope',
    ]) expect(adsAllowedOn(p), p).toBe(false);
  });
});

describe('the cookie choice', () => {
  beforeEach(() => useConsent.getState().reset());

  it('starts unanswered, and ads need an explicit yes', () => {
    expect(useConsent.getState().choice).toBeNull();
    expect(adsConsented(null)).toBe(false);
    expect(adsConsented('essential')).toBe(false);
    expect(adsConsented('all')).toBe(true);
  });

  it('records the answer with a date, and can be reset to ask again', () => {
    useConsent.getState().allowAll();
    expect(useConsent.getState().choice).toBe('all');
    expect(useConsent.getState().decidedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    useConsent.getState().essentialOnly();
    expect(useConsent.getState().choice).toBe('essential');
    useConsent.getState().reset();
    expect(useConsent.getState().choice).toBeNull();
    expect(useConsent.getState().decidedAt).toBeNull();
  });
});
