import { DOMAINS, type Domain } from '../types/problem';
import { courseOfDomain, getCourse } from '../data/courses';

// ── Where "back" goes ──────────────────────────────────────────────────────
// Every screen below Home has a parent in the hierarchy the app presents: a
// drill sits under its unit, a unit under its section, a game under the
// arcade. This maps a path to that parent so the header can offer a real
// step back instead of dumping the student on Home.
//
// Deliberately NOT browser history: a deep link, a shared URL, a redirect
// (/trail/SAT -> /sat), or a page reached by two different routes all make
// history(-1) land somewhere unpredictable. The hierarchy is stable.

export interface ParentLink {
  /** Route one level up. */
  to: string;
  /** Short name of that destination, rendered as "← {label}". */
  label: string;
}

/**
 * Compact names for the back link. DOMAIN_LABELS are written for page
 * headings ("Expressions & Equations") and are too long to sit beside the
 * stats badges in the header, so trails get a short name here.
 */
const DOMAIN_BACK_LABEL: Record<Domain, string> = {
  '5.F': 'Gr-5',
  '6.RP': 'Ratios',
  '6.NS': 'Numbers',
  '6.EE': 'Expressions',
  '6.G': 'Geometry',
  '6.SP': 'Statistics',
  A1: 'Algebra 1',
  GEO: 'Geometry',
  TRIG: 'Trig',
  PC: 'Precalculus',
  SAT: 'SAT Math',
};

const HOME: ParentLink = { to: '/', label: 'Home' };

function isDomain(s: string | undefined): s is Domain {
  return !!s && (DOMAINS as string[]).includes(s);
}

/**
 * One level up from `pathname`. Returns null for Home, which has no parent.
 */
export function parentOf(pathname: string): ParentLink | null {
  const seg = pathname.split('/').filter(Boolean);
  if (seg.length === 0) return null;

  switch (seg[0]) {
    // ── the SAT section, its own tree under /sat ──
    case 'sat': {
      if (seg.length === 1) return HOME;
      // A recovery set is built by, and launched from, that test's analysis.
      if (seg[1] === 'recovery' && seg[2]) {
        return { to: `/sat/analysis/${seg[2]}`, label: 'Analysis' };
      }
      return { to: '/sat', label: 'SAT Math' };
    }

    // ── /unit/:domain/:unit[/results] — the drill and its results screen ──
    // Both step up to the page the drill was launched from, rather than the
    // results stepping back into the drill and restarting it.
    case 'unit': {
      const domain = seg[1];
      if (!isDomain(domain)) return HOME;
      const unit = seg[2];
      if (domain === 'SAT') {
        return unit
          ? { to: `/sat/unit/${unit}`, label: `Unit ${unit}` }
          : { to: '/sat', label: 'SAT Math' };
      }
      return { to: `/trail/${domain}`, label: DOMAIN_BACK_LABEL[domain] };
    }

    // ── /finals[/:courseId[/:n]] — each course has its own five finals ──
    case 'finals': {
      if (seg.length === 1) return HOME;
      if (seg.length === 2) return { to: '/finals', label: 'Finals' };
      const course = getCourse(seg[1]);
      return course
        ? { to: `/finals/${course.id}`, label: course.short }
        : { to: '/finals', label: 'Finals' };
    }

    case 'review':
      return seg.length > 1 ? { to: '/review', label: 'Review' } : HOME;

    case 'arcade':
      return seg.length > 1 ? { to: '/arcade', label: 'Arcade' } : HOME;

    // A trail steps up to its course when that course gathers more than one
    // strand — a 6th-grade trail back to 6th Grade Common Core, say — and
    // otherwise straight to Home, since a one-strand course page is itself
    // just a redirect to the trail.
    case 'trail': {
      const domain = seg[1];
      if (!isDomain(domain)) return HOME;
      const course = courseOfDomain(domain);
      if (!course || course.strands.length < 2) return HOME;
      return { to: `/course/${course.id}`, label: course.short };
    }

    case 'course':
      return HOME;

    // The practice test steps back to the prep hub that launched it.
    case 'map5':
      return seg.length > 1 ? { to: '/map5', label: 'MAP prep' } : HOME;

    // Every other top-level page answers to Home.
    default:
      return HOME;
  }
}

// ── The whole trail ────────────────────────────────────────────────────────
// The back link steps up one level; the breadcrumb shows every level, so a
// student three screens deep can see where they are and jump straight to
// any point above — a drill's unit, its course, or Home — without stepping.

/**
 * Every ancestor of `pathname`, Home first, ending at its parent. Empty on
 * Home. Built by walking `parentOf` upwards, so it can never disagree with
 * the back link.
 */
export function trailOf(pathname: string): ParentLink[] {
  const out: ParentLink[] = [];
  let p = parentOf(pathname);
  // A hierarchy is finite; the bound is only insurance against a cycle.
  for (let i = 0; p && i < 8; i++) {
    out.unshift(p);
    p = parentOf(p.to);
  }
  return out;
}

const ARCADE_NAMES: Record<string, string> = {
  connect4: 'Connect 4', tictactoe: 'Tic-Tac-Toe', mathpop: 'Math Pop', speedlab: 'Speed Lab',
  starhop: 'Star Hop', leapfrog: 'Leap Frog', racer2: 'Racer 2', kpop: 'K-Pop', wheel: 'Prize Wheel',
};

/** The current page's own name — the last, unlinked crumb. */
export function titleOf(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean);
  if (seg.length === 0) return 'Home';
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  switch (seg[0]) {
    // Google sign-in lands here for a moment on its way to Settings.
    case 'sso-callback':
      return 'Signing in';
    case 'sat':
      if (seg.length === 1) return 'SAT Math';
      if (seg[1] === 'tips') return 'Tips';
      if (seg[1] === 'unit') return `Unit ${seg[2]}`;
      if (seg[1] === 'test') return `Test ${seg[2]}`;
      if (seg[1] === 'analysis') return 'Analysis';
      if (seg[1] === 'recovery') return 'Recovery';
      return cap(seg[1]);
    case 'unit':
      if (seg[3] === 'results') return 'Results';
      // a SAT drill sits under its unit playbook, which already says "Unit n"
      return seg[1] === 'SAT' ? 'Drill' : `Unit ${seg[2]}`;
    case 'trail': {
      const d = seg[1];
      if (!isDomain(d)) return 'Trail';
      const course = courseOfDomain(d);
      // a one-strand course is its trail; a strand of a bigger course keeps
      // its own name
      return course && course.strands.length === 1 ? course.short : DOMAIN_BACK_LABEL[d];
    }
    case 'course':
      return getCourse(seg[1] ?? '')?.short ?? 'Course';
    case 'finals':
      if (seg.length === 1) return 'Finals';
      if (seg.length === 2) return getCourse(seg[1])?.short ?? 'Finals';
      return `Quiz ${seg[2]}`;
    case 'review':
      return seg.length > 1 && isDomain(seg[1]) ? DOMAIN_BACK_LABEL[seg[1]] : 'Review';
    case 'arcade':
      return seg.length > 1 ? (ARCADE_NAMES[seg[1]] ?? cap(seg[1])) : 'Arcade';
    case 'map5':
      return seg.length > 1 ? 'Practice test' : 'MAP prep';
    case 'mix': return 'Daily Mix';
    case 'test': return 'Mock Test';
    case 'mathematicians': return 'Mathematicians';
    default:
      return cap(seg[0]);
  }
}
