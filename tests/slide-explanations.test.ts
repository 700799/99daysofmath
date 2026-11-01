import { describe, it, expect } from 'vitest';
import { LESSONS } from '../src/data/lessons';

// A worked example is only as useful as its explanation. The decks used to show
// the mathematics with a three-word label ("Pythagorean identity.") and, on
// roughly half the example slides, no worked steps at all. A student could see
// WHAT was done and had to guess WHY. These bars make every step say what was
// done and the reason it is allowed, and give every key idea a "why it works".
//
// A domain earns its place in EXPLAINED once its decks are rewritten to this
// standard. While a pass is in progress, EXPLAIN_ONLY="TRIG:1-7,GEO" checks
// just those decks (a domain, or DOMAIN:from-to).

const EXPLAINED: string[] = ['GEO', 'TRIG', 'PC', 'A1', 'SAT', '5.F'];

const only = (process.env.EXPLAIN_ONLY ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const specs = [...EXPLAINED, ...only];

function inScope(domain: string, unit: number): boolean {
  return specs.some((s) => {
    const [d, range] = s.split(':');
    if (d !== domain) return false;
    if (!range) return true;
    const [a, b] = range.split('-').map(Number);
    return unit >= a && unit <= (b ?? a);
  });
}

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const DECKS = LESSONS.filter((l) => (l.slides ?? []).length > 0 && inScope(l.domain, l.unit));

describe('slide explanations', () => {
  if (DECKS.length === 0) {
    it('has no domains switched on yet', () => expect(DECKS).toHaveLength(0));
    return;
  }

  it('every example and challenge shows worked steps ending in an answer', () => {
    const bad: string[] = [];
    for (const l of DECKS) {
      for (const s of l.slides!) {
        if (s.kind !== 'example' && s.kind !== 'challenge') continue;
        if (!s.steps || s.steps.steps.length < 3 || !s.steps.answer) bad.push(`${l.domain}-${l.unit} "${s.head}": needs 3+ steps and an answer`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('every step says what was done and why (10+ words)', () => {
    const bad: string[] = [];
    for (const l of DECKS) {
      for (const s of l.slides!) {
        (s.steps?.steps ?? []).forEach((st, i) => {
          const n = words(st.text);
          if (n < 10) bad.push(`${l.domain}-${l.unit} "${s.head}" step ${i + 1}: only ${n} words ("${st.text}")`);
        });
      }
    }
    expect(bad).toEqual([]);
  });

  it('every key idea explains why it works (25+ words)', () => {
    const bad: string[] = [];
    for (const l of DECKS) {
      for (const s of l.slides!) {
        if (s.kind !== 'concept') continue;
        const n = words(s.why ?? '');
        if (n < 25) bad.push(`${l.domain}-${l.unit} "${s.head}": why has ${n} words`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('a why-box is never just the body again', () => {
    const bad: string[] = [];
    for (const l of DECKS) {
      for (const s of l.slides!) {
        if (s.why && s.body.includes(s.why.slice(0, 40))) bad.push(`${l.domain}-${l.unit} "${s.head}"`);
      }
    }
    expect(bad).toEqual([]);
  });
});
