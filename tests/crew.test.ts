import { describe, it, expect } from 'vitest';
import { CREW, crewUnlocked, crewSvgMarkup } from '../src/components/crew/crewData';
import { bayInfo, orderedBays, resumeCourse, BAY_ORDER } from '../src/components/launch/launchMath';
import { COURSES } from '../src/data/courses';

describe('bay crew', () => {
  it('has ten members with unique ids and rising unlock thresholds', () => {
    expect(CREW).toHaveLength(10);
    expect(new Set(CREW.map((m) => m.id)).size).toBe(10);
    const at = CREW.map((m) => m.unlockAt);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(at[0]).toBe(0);
  });
  it('unlocks by sticker count', () => {
    expect(crewUnlocked(0).map((m) => m.id)).toEqual(['butter']);
    expect(crewUnlocked(5)).toHaveLength(4);
    expect(crewUnlocked(999)).toHaveLength(10);
  });
  it('draws every member with eyes, a body and a brain', () => {
    for (const m of CREW) {
      const svg = crewSvgMarkup(m);
      expect(svg).toContain('crew-body');
      expect(svg).toContain('crew-brain');
      expect(svg).toContain(m.eyes === 'happy' ? 'crew-eyes' : 'crew-eye');
    }
  });
});

describe('launch bay', () => {
  it('has one bay per course, in grade order', () => {
    expect(BAY_ORDER).toHaveLength(COURSES.length);
    expect(new Set(BAY_ORDER)).toEqual(new Set(COURSES.map((c) => c.id)));
    expect(orderedBays({}).map((b) => b.course.id)).toEqual(BAY_ORDER);
  });
  it('fills from stars and finds the next unit', () => {
    const pc = COURSES.find((c) => c.id === 'precalc')!;
    expect(bayInfo(pc, {}).pct).toBe(0);
    const stars: Record<number, number> = {};
    for (let u = 1; u <= 7; u++) stars[u] = 3;
    const info = bayInfo(pc, { PC: { unitStars: stars } });
    expect(info.pct).toBe(50);
    expect(info.nextUnit).toBe(8);
    expect(info.nextDomain).toBe('PC');
  });
  it('resumes the chosen course, else the furthest unfinished one', () => {
    const bays = orderedBays({ TRIG: { unitStars: { 1: 3, 2: 3 } }, A1: { unitStars: { 1: 1 } } });
    expect(resumeCourse(bays, 'sat').course.id).toBe('sat');
    expect(resumeCourse(bays, null).course.id).toBe('trig');
    expect(resumeCourse(orderedBays({}), null).course.id).toBe('grade5');
  });
});
