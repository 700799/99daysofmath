import { describe, it, expect } from 'vitest';
import {
  MAP5_STRANDS,
  MAP5_TIPS,
  MAP5_UNIT_COUNT,
  MAP5_TEST_SIZE,
  MAP5_RIT_MIN,
  MAP5_RIT_MAX,
  estimateMap5Rit,
  map5Band,
  strandOfUnit,
  strandOf,
  isAboveGrade,
  map5Domains,
  getStrand,
} from '../src/data/map5';
import { UNIT_COUNT_BY_DOMAIN } from '../src/utils/encouragement';

// The MAP prep surface re-shelves the 5.F course into the four instructional
// areas NWEA reports. If a unit falls outside that mapping it becomes
// invisible to the score breakdown, so the cover is asserted both ways.

describe('the four instructional areas', () => {
  it('are the four NWEA reports for Math 2-5', () => {
    expect(MAP5_STRANDS.map((s) => s.key)).toEqual(['NO', 'OA', 'MD', 'GEO']);
    expect(MAP5_STRANDS.map((s) => s.name)).toEqual([
      'Number and Operations',
      'Operations and Algebraic Thinking',
      'Measurement and Data',
      'Geometry',
    ]);
  });

  it('cover every 5.F unit exactly once', () => {
    const seen = MAP5_STRANDS
      .flatMap((s) => s.sources.filter((src) => src.domain === '5.F'))
      .flatMap((src) => src.units)
      .sort((a, b) => a - b);
    expect(seen).toEqual(Array.from({ length: MAP5_UNIT_COUNT }, (_, i) => i + 1));
    expect(new Set(seen).size, 'a unit is claimed by two strands').toBe(seen.length);
  });

  it('match the unit count the rest of the app believes 5.F has', () => {
    expect(UNIT_COUNT_BY_DOMAIN['5.F']).toBe(MAP5_UNIT_COUNT);
  });

  it('every unit resolves to a strand, and nothing outside the course does', () => {
    for (let u = 1; u <= MAP5_UNIT_COUNT; u++) {
      expect(strandOfUnit(u), `unit ${u}`).not.toBeNull();
    }
    expect(strandOfUnit(0)).toBeNull();
    expect(strandOfUnit(MAP5_UNIT_COUNT + 1)).toBeNull();
  });

  it('carry the copy the hub needs, and weights that sum to one', () => {
    for (const s of MAP5_STRANDS) {
      expect(s.blurb.length, s.key).toBeGreaterThan(60);
      expect(s.sources.length, s.key).toBeGreaterThan(0);
      expect(s.color, s.key).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(getStrand(s.key)).toBe(s);
    }
    const total = MAP5_STRANDS.reduce((a, s) => a + s.weight, 0);
    expect(total).toBeCloseTo(1, 2);
  });

  it('weights Number and Operations heaviest, as the grade-5 test does', () => {
    const heaviest = [...MAP5_STRANDS].sort((a, b) => b.weight - a.weight)[0];
    expect(heaviest.key).toBe('NO');
  });
});

describe('reaching above grade level', () => {
  // MAP Growth is adaptive over a bank that runs past the tested grade, so
  // prep that stopped at 5th grade would cap the ceiling exactly where the
  // interesting part starts. Every strand continues into 6th-grade Common Core.
  it('every strand continues into a 6th-grade Common Core domain', () => {
    for (const s of MAP5_STRANDS) {
      const above = s.sources.filter((src) => src.above);
      expect(above.length, `${s.name} has no stretch content`).toBeGreaterThan(0);
      for (const src of above) expect(src.domain).toMatch(/^6\./);
    }
  });

  it('draws on the 5th-grade course and all five 6th-grade strands', () => {
    expect([...map5Domains()].sort()).toEqual(
      ['5.F', '6.EE', '6.G', '6.NS', '6.RP', '6.SP'],
    );
  });

  it('knows which content is above grade level', () => {
    expect(isAboveGrade('5.F', 1)).toBe(false);
    expect(isAboveGrade('5.F', 16)).toBe(false);
    for (const d of ['6.RP', '6.NS', '6.EE', '6.G', '6.SP'] as const) {
      expect(isAboveGrade(d, 1), d).toBe(true);
      expect(isAboveGrade(d, 10), d).toBe(true);
    }
    // Content the prep does not draw on is not "above grade" — it is absent.
    expect(isAboveGrade('A1', 1)).toBe(false);
  });

  it('files 6th-grade content under the strand that continues it', () => {
    expect(strandOf('6.NS', 3)?.key).toBe('NO');
    expect(strandOf('6.RP', 3)?.key).toBe('NO');
    expect(strandOf('6.EE', 3)?.key).toBe('OA');
    expect(strandOf('6.SP', 3)?.key).toBe('MD');
    expect(strandOf('6.G', 3)?.key).toBe('GEO');
  });

  it('answering above-grade questions correctly raises the estimate', () => {
    const grounded = estimateMap5Rit(0.8, 2, 0);
    const reaching = estimateMap5Rit(0.8, 2, 0.4);
    expect(reaching).toBeGreaterThan(grounded);
  });

  it('never lets reaching up lower a score', () => {
    for (const a of [0.2, 0.5, 0.9]) {
      expect(estimateMap5Rit(a, 2, 0.5)).toBeGreaterThanOrEqual(estimateMap5Rit(a, 2, 0));
    }
  });

  it('tops out only for a student working accurately a year ahead', () => {
    // Perfect on grade-level alone should NOT reach the top band; that band is
    // reserved for actually answering 6th-grade questions right.
    expect(map5Band(estimateMap5Rit(1, 2, 0)).label).not.toBe('Working a year ahead');
    expect(map5Band(estimateMap5Rit(1, 3, 0.6)).label).toBe('Working a year ahead');
  });
});

describe('the RIT estimate', () => {
  it('rises with accuracy and never leaves the grade-5 band', () => {
    let prev = -Infinity;
    for (const a of [0, 0.25, 0.5, 0.75, 1]) {
      const r = estimateMap5Rit(a, 2);
      expect(r).toBeGreaterThanOrEqual(prev);
      expect(r).toBeGreaterThanOrEqual(MAP5_RIT_MIN);
      expect(r).toBeLessThanOrEqual(MAP5_RIT_MAX);
      prev = r;
    }
  });

  it('rewards the same accuracy on a harder set', () => {
    expect(estimateMap5Rit(0.7, 3)).toBeGreaterThan(estimateMap5Rit(0.7, 1));
  });

  it('clamps nonsense input rather than producing a nonsense score', () => {
    expect(estimateMap5Rit(-5, 2)).toBeGreaterThanOrEqual(MAP5_RIT_MIN);
    expect(estimateMap5Rit(99, 3)).toBeLessThanOrEqual(MAP5_RIT_MAX);
  });

  it('lands a typical 5th grader in an on-track band, not a failing one', () => {
    // Around half right on a middling set is what the adaptive test aims for.
    const band = map5Band(estimateMap5Rit(0.55, 2));
    expect(['On track', 'On track, upper half', 'Building']).toContain(band.label);
  });

  it('gives every band a label and real advice', () => {
    for (const rit of [MAP5_RIT_MIN, 190, 200, 212, 225, MAP5_RIT_MAX]) {
      const b = map5Band(rit);
      expect(b.label.length, `${rit}`).toBeGreaterThan(4);
      expect(b.blurb.length, `${rit}`).toBeGreaterThan(60);
    }
  });

  it('bands climb monotonically with the estimate', () => {
    const order = ['Getting started', 'Building', 'On track', 'On track, upper half', 'Stretching past grade level', 'Working a year ahead'];
    let lastIdx = -1;
    for (let rit = MAP5_RIT_MIN; rit <= MAP5_RIT_MAX; rit++) {
      const idx = order.indexOf(map5Band(rit).label);
      expect(idx, `rit ${rit} has an unknown band`).toBeGreaterThanOrEqual(0);
      expect(idx, `band went backwards at rit ${rit}`).toBeGreaterThanOrEqual(lastIdx);
      lastIdx = idx;
    }
  });
});

describe('the adaptive-test strategy', () => {
  it('is a real set of tips, each with substance', () => {
    expect(MAP5_TIPS.length).toBeGreaterThanOrEqual(6);
    for (const t of MAP5_TIPS) {
      expect(t.title.length, t.title).toBeGreaterThan(10);
      expect(t.body.length, t.title).toBeGreaterThan(80);
      expect(t.emoji.length).toBeGreaterThan(0);
    }
  });

  it('covers what is specific to an adaptive, untimed test', () => {
    const all = MAP5_TIPS.map((t) => `${t.title} ${t.body}`).join(' ').toLowerCase();
    expect(all, 'says the test gets harder when you do well').toMatch(/harder/);
    expect(all, 'says there is no timer').toMatch(/not timed|no timer|no clock/);
    expect(all, 'says you cannot go back').toMatch(/go back|cannot go back/);
    expect(all, 'says to guess rather than leave blank').toMatch(/guess/);
  });

  it('serves a test long enough to reach every strand', () => {
    expect(MAP5_TEST_SIZE).toBeGreaterThanOrEqual(MAP5_STRANDS.length * 4);
  });
});
