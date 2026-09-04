import { DOMAINS, type Domain } from '../types/problem';

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

    case 'finals':
      return seg.length > 1 ? { to: '/finals', label: 'Finals' } : HOME;

    case 'review':
      return seg.length > 1 ? { to: '/review', label: 'Review' } : HOME;

    case 'arcade':
      return seg.length > 1 ? { to: '/arcade', label: 'Arcade' } : HOME;

    // Trails and every other top-level page answer to Home.
    default:
      return HOME;
  }
}
