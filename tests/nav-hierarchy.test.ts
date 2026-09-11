import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parentOf, trailOf, titleOf } from '../src/utils/navHierarchy';
import { DOMAINS, TRAIL_DOMAINS } from '../src/types/problem';
import { COURSES } from '../src/data/courses';

// The header's back link is the only way out of a nested screen that doesn't
// throw away where you were, so every route has to resolve to a real parent —
// and that parent has to be a route the app actually serves.

/** Route patterns declared in App.tsx, e.g. "/unit/:domain/:unit". */
function declaredRoutes(): string[] {
  const src = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  return [...src.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
}

/** Does `path` match one of the declared route patterns? */
function isServedRoute(path: string): boolean {
  const segs = path.split('/').filter(Boolean);
  return declaredRoutes().some((pattern) => {
    if (pattern === '*') return false; // the 404 catch-all is not a destination
    const p = pattern.split('/').filter(Boolean);
    if (p.length !== segs.length) return false;
    return p.every((seg, i) => seg.startsWith(':') || seg === segs[i]);
  });
}

describe('parentOf — Home', () => {
  it('Home has no parent', () => {
    expect(parentOf('/')).toBeNull();
    expect(parentOf('')).toBeNull();
  });
});

describe('parentOf — the SAT section', () => {
  it('the hub steps back to Home', () => {
    expect(parentOf('/sat')).toEqual({ to: '/', label: 'Home' });
  });

  it('every page inside the section steps back to the hub', () => {
    for (const path of ['/sat/tips', '/sat/unit/7', '/sat/test/3', '/sat/analysis/3']) {
      expect(parentOf(path), path).toEqual({ to: '/sat', label: 'SAT Math' });
    }
  });

  it('a recovery set steps back to the analysis that built it', () => {
    expect(parentOf('/sat/recovery/4')).toEqual({ to: '/sat/analysis/4', label: 'Analysis' });
  });

  it('a SAT drill steps back to its unit playbook, not the hub', () => {
    // The regression this all exists for: /trail/SAT redirects to the hub, so
    // quitting a drill used to skip the playbook it was launched from.
    expect(parentOf('/unit/SAT/12')).toEqual({ to: '/sat/unit/12', label: 'Unit 12' });
    expect(parentOf('/unit/SAT/12/results')).toEqual({ to: '/sat/unit/12', label: 'Unit 12' });
  });
});

describe('parentOf — trails and drills', () => {
  it('a strand of a multi-strand course steps back to that course', () => {
    for (const d of ['6.RP', '6.NS', '6.EE', '6.SP'] as const) {
      expect(parentOf(`/trail/${d}`), d).toEqual({ to: '/course/grade6', label: '6th Grade' });
    }
    expect(parentOf('/trail/GEO')).toEqual({ to: '/course/geometry', label: 'Geometry' });
  });

  it('a borrowed strand answers to the course that owns it', () => {
    // 6.G opens the Geometry course but belongs to 6th Grade Common Core, so
    // back must not quietly move it out of the Common Core standards.
    expect(parentOf('/trail/6.G')).toEqual({ to: '/course/grade6', label: '6th Grade' });
  });

  it('a course that is its own single strand steps back to Home', () => {
    for (const d of ['5.F', 'A1', 'PC', 'TRIG'] as const) {
      expect(parentOf(`/trail/${d}`), d).toEqual({ to: '/', label: 'Home' });
    }
  });

  it('a course page steps back to Home', () => {
    expect(parentOf('/course/grade6')).toEqual({ to: '/', label: 'Home' });
    expect(parentOf('/course/geometry')).toEqual({ to: '/', label: 'Home' });
  });

  it('every trail resolves to some parent', () => {
    for (const d of TRAIL_DOMAINS) {
      expect(parentOf(`/trail/${d}`), d).not.toBeNull();
    }
  });

  it('every non-SAT drill steps back to its own trail', () => {
    for (const d of TRAIL_DOMAINS) {
      const p = parentOf(`/unit/${d}/3`);
      expect(p?.to, d).toBe(`/trail/${d}`);
      expect(p?.label.length, d).toBeGreaterThan(0);
    }
  });

  it('a results screen steps up to the same place as its drill, never back into it', () => {
    for (const d of DOMAINS) {
      expect(parentOf(`/unit/${d}/5/results`), d).toEqual(parentOf(`/unit/${d}/5`));
    }
  });

  it('back labels are short enough to sit in the header', () => {
    for (const d of DOMAINS) {
      const label = parentOf(`/unit/${d}/1`)!.label;
      expect(label.length, `${d} -> "${label}"`).toBeLessThanOrEqual(12);
    }
  });
});

describe('parentOf — the other sections', () => {
  it('a game steps back to the arcade', () => {
    expect(parentOf('/arcade/snake')).toEqual({ to: '/arcade', label: 'Arcade' });
    expect(parentOf('/arcade')).toEqual({ to: '/', label: 'Home' });
  });

  it('a final quiz steps back to its own course\'s finals, not the shelf', () => {
    expect(parentOf('/finals/trig/2')).toEqual({ to: '/finals/trig', label: 'Trigonometry' });
    expect(parentOf('/finals/grade6/5')).toEqual({ to: '/finals/grade6', label: '6th Grade' });
    expect(parentOf('/finals/trig')).toEqual({ to: '/finals', label: 'Finals' });
    expect(parentOf('/finals')).toEqual({ to: '/', label: 'Home' });
  });

  it('a pre-course finals link still steps somewhere real', () => {
    expect(parentOf('/finals/2')).toEqual({ to: '/finals', label: 'Finals' });
  });

  it('a scoped review steps back to the review picker', () => {
    expect(parentOf('/review/6.RP')).toEqual({ to: '/review', label: 'Review' });
    expect(parentOf('/review')).toEqual({ to: '/', label: 'Home' });
  });

  it('every remaining top-level page steps back to Home', () => {
    for (const path of ['/mix', '/test', '/practice', '/report', '/videos', '/stories',
      '/mathematicians', '/settings', '/shop', '/rewards']) {
      expect(parentOf(path), path).toEqual({ to: '/', label: 'Home' });
    }
  });

  it('an unknown path still offers a way out', () => {
    expect(parentOf('/nope/nowhere')).toEqual({ to: '/', label: 'Home' });
  });
});

describe('parentOf — robustness', () => {
  it('a trailing slash does not change the answer', () => {
    expect(parentOf('/sat/unit/7/')).toEqual(parentOf('/sat/unit/7'));
    expect(parentOf('/arcade/')).toEqual(parentOf('/arcade'));
  });

  it('a malformed domain segment still resolves rather than throwing', () => {
    expect(parentOf('/unit/NOT_A_DOMAIN/3')).toEqual({ to: '/', label: 'Home' });
    expect(parentOf('/unit')).toEqual({ to: '/', label: 'Home' });
  });

  it('every parent target is a route the app actually serves', () => {
    const samples = [
      '/sat', '/sat/tips', '/sat/unit/7', '/sat/test/3', '/sat/analysis/3', '/sat/recovery/4',
      '/unit/SAT/12', '/unit/SAT/12/results', '/arcade/snake', '/finals/2', '/review/6.RP',
      ...COURSES.map((c) => `/finals/${c.id}`),
      ...COURSES.map((c) => `/finals/${c.id}/3`),
      ...DOMAINS.map((d) => `/trail/${d}`),
      ...DOMAINS.map((d) => `/unit/${d}/3`),
    ];
    for (const path of samples) {
      const parent = parentOf(path);
      expect(parent, path).not.toBeNull();
      expect(isServedRoute(parent!.to), `${path} -> ${parent!.to} is not a declared route`).toBe(true);
    }
  });
});

// ── The breadcrumb ─────────────────────────────────────────────────────────
// "It's hard to go back to the menus": the back link only steps up one
// level, so a student in a drill was three taps from Home and could not see
// the way. The trail shows every level and links each one.

describe('trailOf — the whole way up', () => {
  it('is empty on Home', () => {
    expect(trailOf('/')).toEqual([]);
  });

  it('a drill in a multi-strand course: Home › course › strand', () => {
    expect(trailOf('/unit/6.RP/3').map((c) => c.label)).toEqual(['Home', '6th Grade', 'Ratios']);
    expect(trailOf('/unit/6.RP/3').map((c) => c.to)).toEqual(['/', '/course/grade6', '/trail/6.RP']);
  });

  it('a drill in a one-strand course: Home › trail', () => {
    expect(trailOf('/unit/TRIG/3').map((c) => c.to)).toEqual(['/', '/trail/TRIG']);
  });

  it('a final quiz: Home › Finals › course', () => {
    expect(trailOf('/finals/trig/2').map((c) => c.to)).toEqual(['/', '/finals', '/finals/trig']);
  });

  it('a SAT drill: Home › SAT Math › its unit playbook', () => {
    expect(trailOf('/unit/SAT/12').map((c) => c.to)).toEqual(['/', '/sat', '/sat/unit/12']);
  });

  it('a recovery set: Home › SAT Math › the analysis that built it', () => {
    expect(trailOf('/sat/recovery/4').map((c) => c.to)).toEqual(['/', '/sat', '/sat/analysis/4']);
  });

  it('always starts at Home and ends at the parent', () => {
    for (const path of ['/arcade/snake', '/review/6.RP', '/map5/test', '/course/geometry', '/finals/grade6/5']) {
      const trail = trailOf(path);
      expect(trail[0], path).toEqual({ to: '/', label: 'Home' });
      expect(trail[trail.length - 1], path).toEqual(parentOf(path));
    }
  });

  it('every crumb links to a route the app serves', () => {
    const samples = [
      '/unit/6.RP/3', '/unit/TRIG/3/results', '/unit/SAT/12', '/sat/recovery/4', '/finals/trig/2',
      '/arcade/snake', '/review/6.RP', '/map5/test', '/trail/6.G',
      ...COURSES.map((c) => `/finals/${c.id}/1`),
    ];
    for (const path of samples) {
      for (const c of trailOf(path)) {
        expect(isServedRoute(c.to), `${path}: crumb ${c.to} is not a declared route`).toBe(true);
      }
    }
  });
});

describe('titleOf — the current page, as the last crumb', () => {
  it('names the page a student is on', () => {
    expect(titleOf('/unit/TRIG/3')).toBe('Unit 3');
    expect(titleOf('/unit/6.RP/3/results')).toBe('Results');
    expect(titleOf('/trail/TRIG')).toBe('Trigonometry');
    expect(titleOf('/trail/6.RP')).toBe('Ratios');
    expect(titleOf('/course/grade6')).toBe('6th Grade');
    expect(titleOf('/finals/trig/2')).toBe('Quiz 2');
    expect(titleOf('/finals/trig')).toBe('Trigonometry');
    expect(titleOf('/sat/unit/7')).toBe('Unit 7');
    // the drill under that playbook must not read "Unit 7 › Unit 7"
    expect(titleOf('/unit/SAT/7')).toBe('Drill');
    expect(titleOf('/sat/recovery/4')).toBe('Recovery');
    expect(titleOf('/arcade/connect4')).toBe('Connect 4');
    expect(titleOf('/map5/test')).toBe('Practice test');
  });

  it('never leaves a page nameless', () => {
    const src = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
    const routes = [...src.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((r) => r !== '*');
    for (const r of routes) {
      const concrete = r.replace(':domain', '6.RP').replace(':unit', '3').replace(':n', '2').replace(':courseId', 'trig').replace(':id', 'grade6');
      const title = titleOf(concrete);
      expect(title.length, `${r} -> "${title}"`).toBeGreaterThan(1);
      expect(title, `${r} -> "${title}"`).not.toMatch(/^[a-z]/);
    }
  });
});
