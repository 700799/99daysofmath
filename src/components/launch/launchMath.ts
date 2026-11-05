import { COURSES, courseDomains, type Course, type CourseId } from '../../data/courses';
import { UNIT_COUNT_BY_DOMAIN } from '../../utils/encouragement';
import type { Domain } from '../../types/problem';

/** Bays run left to right from 5th grade up to the AP courses. */
export const BAY_ORDER: CourseId[] = ['grade5', 'grade6', 'algebra1', 'geometry', 'trig', 'precalc', 'sat', 'calcab', 'apstats'];

type StarsByDomain = Partial<Record<Domain, { unitStars: Record<number, number> } | undefined>>;

export interface BayInfo {
  course: Course;
  /** 0–100, stars earned over stars available (3 per unit). */
  pct: number;
  /** First unit in the course's last domain that is not yet at 3 stars. */
  nextUnit: number;
  /** The domain that unit belongs to. */
  nextDomain: Domain;
}

export function bayInfo(course: Course, byDomain: StarsByDomain): BayInfo {
  // A course that only borrows a strand (Geometry's 6.G foundations) still
  // counts it, so the bay fills the way the course page does.
  const domains = courseDomains(course);
  let earned = 0;
  let possible = 0;
  let nextDomain: Domain = domains[domains.length - 1];
  let nextUnit = 1;
  let foundNext = false;
  for (const d of domains) {
    const units = UNIT_COUNT_BY_DOMAIN[d] ?? 0;
    const stars = byDomain[d]?.unitStars ?? {};
    possible += units * 3;
    for (let u = 1; u <= units; u++) {
      const s = Math.min(3, Number(stars[u] ?? 0));
      earned += s;
      if (!foundNext && s < 3) {
        foundNext = true;
        nextDomain = d;
        nextUnit = u;
      }
    }
  }
  if (!foundNext) nextUnit = UNIT_COUNT_BY_DOMAIN[nextDomain] ?? 1;
  const pct = possible ? Math.round((earned / possible) * 100) : 0;
  return { course, pct, nextUnit, nextDomain };
}

/**
 * The course the resume card points at: the one the student picked if they
 * picked one, otherwise the most-progressed unfinished course, otherwise the
 * first bay.
 */
export function resumeCourse(bays: BayInfo[], chosen: string | null): BayInfo {
  const picked = bays.find((b) => b.course.id === chosen);
  if (picked) return picked;
  const inProgress = bays.filter((b) => b.pct > 0 && b.pct < 100).sort((a, b) => b.pct - a.pct);
  return inProgress[0] ?? bays[0];
}

export function orderedBays(byDomain: StarsByDomain): BayInfo[] {
  return BAY_ORDER.map((id) => COURSES.find((c) => c.id === id)!)
    .filter(Boolean)
    .map((c) => bayInfo(c, byDomain));
}
