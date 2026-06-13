import { describe, it, expect } from 'vitest';
import {
  addDaysISO,
  intervalForBox,
  scheduleAfter,
  SRS_INTERVALS_DAYS,
  SRS_MAX_BOX,
} from '../src/utils/srs';

describe('addDaysISO', () => {
  it('advances calendar dates and crosses month boundaries', () => {
    expect(addDaysISO('2026-05-01', 1)).toBe('2026-05-02');
    expect(addDaysISO('2026-05-31', 1)).toBe('2026-06-01');
    expect(addDaysISO('2026-05-10', 7)).toBe('2026-05-17');
  });
});

describe('intervalForBox', () => {
  it('maps each box to its interval and clamps out-of-range', () => {
    expect(intervalForBox(0)).toBe(0);
    expect(intervalForBox(3)).toBe(7);
    expect(intervalForBox(99)).toBe(SRS_INTERVALS_DAYS[SRS_INTERVALS_DAYS.length - 1]);
    expect(intervalForBox(-5)).toBe(0);
  });
});

describe('scheduleAfter', () => {
  const today = '2026-05-01';

  it('a miss resets to box 0 due the same day', () => {
    expect(scheduleAfter(3, false, today)).toEqual({ box: 0, due: '2026-05-01' });
  });

  it('a correct review climbs one box with a wider interval', () => {
    expect(scheduleAfter(0, true, today)).toEqual({ box: 1, due: '2026-05-02' }); // +1
    expect(scheduleAfter(2, true, today)).toEqual({ box: 3, due: '2026-05-08' }); // +7
  });

  it('graduates out of the queue at the top box', () => {
    const r = scheduleAfter(SRS_MAX_BOX - 1, true, today);
    expect(r.box).toBe(SRS_MAX_BOX);
    expect(r.due).toBeNull();
  });
});
