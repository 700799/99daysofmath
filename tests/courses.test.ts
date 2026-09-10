import { describe, it, expect } from 'vitest';
import {
  COURSES,
  getCourse,
  courseDomains,
  courseHref,
  courseOfDomain,
  type CourseId,
} from '../src/data/courses';
import { DOMAINS, TRAIL_DOMAINS, CORE_DOMAINS, type Domain } from '../src/types/problem';

// Home is a shelf of courses, not of content tags. The registry has to cover
// every domain, name each one once, and point somewhere real.

describe('the course shelf', () => {
  it('is the seven courses, in the order Home shows them', () => {
    expect(COURSES.map((c) => c.id)).toEqual([
      'sat', 'precalc', 'trig', 'algebra1', 'geometry', 'grade6', 'grade5',
    ] satisfies CourseId[]);
  });

  it('every course is findable by id, and nothing else is', () => {
    for (const c of COURSES) expect(getCourse(c.id)?.id).toBe(c.id);
    expect(getCourse('nope')).toBeNull();
    expect(getCourse('')).toBeNull();
  });

  it('every course carries the copy its card needs', () => {
    for (const c of COURSES) {
      expect(c.name.length, c.id).toBeGreaterThan(3);
      expect(c.short.length, c.id).toBeGreaterThan(2);
      expect(c.kicker.length, c.id).toBeGreaterThan(5);
      expect(c.blurb.length, c.id).toBeGreaterThan(60);
      expect(c.emoji.length, c.id).toBeGreaterThan(0);
      expect(c.color, c.id).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(c.strands.length, c.id).toBeGreaterThan(0);
    }
  });

  it('course names and back labels are short enough for the header', () => {
    for (const c of COURSES) expect(c.short.length, `${c.id} -> "${c.short}"`).toBeLessThanOrEqual(12);
  });
});

describe('courses cover the content', () => {
  it('every domain belongs to exactly one course that owns it', () => {
    for (const d of DOMAINS) {
      const owners = COURSES.filter((c) => c.strands.some((s) => s.domain === d && !s.borrowed));
      expect(owners.map((c) => c.id), `${d} owners`).toHaveLength(1);
    }
  });

  it('every strand of every course is a real domain', () => {
    for (const c of COURSES) {
      for (const s of c.strands) {
        expect(DOMAINS, `${c.id}/${s.domain}`).toContain(s.domain);
        expect(s.label.length, `${c.id}/${s.domain}`).toBeGreaterThan(2);
      }
    }
  });

  it('the five 6th-grade Common Core strands stay together and complete', () => {
    // Geometry borrows 6.G, but the Common Core standards must not lose it.
    const g6 = getCourse('grade6')!;
    expect(courseDomains(g6)).toEqual(['6.RP', '6.NS', '6.EE', '6.G', '6.SP']);
  });

  it('Geometry runs from the 6th-grade foundations into the high-school course', () => {
    const geo = getCourse('geometry')!;
    expect(courseDomains(geo)).toEqual(['6.G', 'GEO']);
    expect(geo.strands[0].borrowed, '6.G is borrowed, not moved').toBe(true);
    expect(geo.strands[1].borrowed).toBeFalsy();
  });

  it('a borrowed strand still answers to the course that owns it', () => {
    expect(courseOfDomain('6.G')?.id).toBe('grade6');
    expect(courseOfDomain('GEO')?.id).toBe('geometry');
    expect(courseOfDomain('TRIG')?.id).toBe('trig');
    expect(courseOfDomain('SAT')?.id).toBe('sat');
  });

  it('the shared assessments keep the six grade-level domains they always had', () => {
    // Regrouping the shelf must not change what Finals / Mock / Daily Mix pull.
    expect(CORE_DOMAINS).toEqual(['5.F', '6.RP', '6.NS', '6.EE', '6.G', '6.SP']);
  });
});

describe('where a course card points', () => {
  it('SAT goes to its own section', () => {
    expect(courseHref(getCourse('sat')!)).toBe('/sat');
  });

  it('a single-strand course goes straight to its trail, skipping a pointless page', () => {
    expect(courseHref(getCourse('algebra1')!)).toBe('/trail/A1');
    expect(courseHref(getCourse('precalc')!)).toBe('/trail/PC');
    expect(courseHref(getCourse('trig')!)).toBe('/trail/TRIG');
    expect(courseHref(getCourse('grade5')!)).toBe('/trail/5.F');
  });

  it('a multi-strand course gets a course page', () => {
    expect(courseHref(getCourse('grade6')!)).toBe('/course/grade6');
    expect(courseHref(getCourse('geometry')!)).toBe('/course/geometry');
  });

  it('every trail a course links to is a domain that has a trail', () => {
    for (const c of COURSES) {
      const href = courseHref(c);
      if (!href.startsWith('/trail/')) continue;
      expect(TRAIL_DOMAINS, href).toContain(href.slice('/trail/'.length) as Domain);
    }
  });
});
