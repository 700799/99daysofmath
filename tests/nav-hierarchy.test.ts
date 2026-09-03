import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parentOf } from '../src/utils/navHierarchy';
import { DOMAINS, TRAIL_DOMAINS } from '../src/types/problem';

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
  it('a trail steps back to Home', () => {
    for (const d of TRAIL_DOMAINS) {
      expect(parentOf(`/trail/${d}`), d).toEqual({ to: '/', label: 'Home' });
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

  it('a final quiz steps back to the finals list', () => {
    expect(parentOf('/finals/2')).toEqual({ to: '/finals', label: 'Finals' });
    expect(parentOf('/finals')).toEqual({ to: '/', label: 'Home' });
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
