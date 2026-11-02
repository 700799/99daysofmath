// Where ads may appear, and how they are configured.
//
// The app is used by children from 5th grade up, so ads are confined to the
// courses whose students are in high school: Trigonometry, Precalculus,
// SAT Math, AP Calculus AB and AP Statistics. Nothing in the 5th-grade, 6th-grade, Algebra 1 or Geometry
// sections, nothing on shared pages (Home, Stories, Arcade, Settings), and
// nothing on a timed test. Ads also load only after the visitor allows
// advertising cookies (see state/consent.ts).
import { courseOfDomain } from '../data/courses';
import { DOMAINS, type Domain } from '../types/problem';

/** The strands whose pages may carry an ad. */
export const AD_DOMAINS: readonly Domain[] = ['TRIG', 'PC', 'SAT', 'CALC', 'STAT'];

/** The course ids those strands belong to, for /course and /finals routes. */
export const AD_COURSES: readonly string[] = AD_DOMAINS.flatMap((d) => {
  const c = courseOfDomain(d);
  return c ? [c.id] : [];
});

/** AdSense publisher id (ca-pub-…) and ad unit id, set in the environment. */
export const ADSENSE_CLIENT = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim() || '';
export const ADSENSE_SLOT = (import.meta.env.VITE_ADSENSE_SLOT as string | undefined)?.trim() || '';
export const adsConfigured = /^ca-pub-\d+$/.test(ADSENSE_CLIENT) && ADSENSE_SLOT.length > 0;

function isDomain(s: string | undefined): s is Domain {
  return !!s && (DOMAINS as string[]).includes(s);
}

/**
 * Whether the page at `pathname` may carry an ad. Hubs, trails, unit pages,
 * results and reviews of the ad courses qualify; their timed tests do not.
 */
export function adsAllowedOn(pathname: string): boolean {
  const seg = pathname.split('/').filter(Boolean);
  if (seg.length === 0) return false;
  switch (seg[0]) {
    case 'sat':
      return seg[1] !== 'test';
    case 'trail':
    case 'review':
      return isDomain(seg[1]) && AD_DOMAINS.includes(seg[1]);
    case 'unit':
      return isDomain(seg[1]) && AD_DOMAINS.includes(seg[1]);
    case 'course':
      return AD_COURSES.includes(seg[1] ?? '');
    case 'finals':
      // The course's finals list, not a final in progress.
      return seg.length === 2 && AD_COURSES.includes(seg[1]);
    default:
      return false;
  }
}
