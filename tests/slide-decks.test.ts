import { describe, it, expect } from 'vitest';
import { LESSONS, lessonKey } from '../src/data/lessons';
import { MATHEMATICIAN_DECKS } from '../src/data/mathematicianDecks';
import stories from '../src/data/mathStories.json';

// The story-style slide rewrite: every lesson carries a 12–20-slide deck,
// every story is expanded (≥7 beats, meaty bodies), and every mathematician
// has a 12–20-slide deck.

describe('lesson slide decks', () => {
  it('every lesson has 12–20 slides with non-empty head/body', () => {
    for (const l of LESSONS) {
      const key = lessonKey(l.domain, l.unit);
      expect(l.slides, `${key} has no slide deck`).toBeDefined();
      const s = l.slides!;
      expect(s.length, `${key} has ${s.length} slides`).toBeGreaterThanOrEqual(12);
      expect(s.length, `${key} has ${s.length} slides`).toBeLessThanOrEqual(20);
      for (const sl of s) {
        expect(sl.head.length, `${key} empty head`).toBeGreaterThan(0);
        expect(sl.body.length, `${key} "${sl.head}" body too short`).toBeGreaterThan(40);
      }
    }
  });

  it('every deck covers the full arc: objective, concept, example, protip, trap, summary', () => {
    for (const l of LESSONS) {
      const key = lessonKey(l.domain, l.unit);
      const kinds = new Set((l.slides ?? []).map((s) => s.kind));
      for (const k of ['objective', 'concept', 'example', 'protip', 'trap', 'summary'] as const) {
        expect(kinds.has(k), `${key} missing a ${k} slide`).toBe(true);
      }
    }
  });

  it('decks have enough teaching depth (3+ concepts, 5+ examples)', () => {
    for (const l of LESSONS) {
      const key = lessonKey(l.domain, l.unit);
      const by = (k: string) => (l.slides ?? []).filter((s) => s.kind === k).length;
      expect(by('concept'), `${key} concepts`).toBeGreaterThanOrEqual(3);
      expect(by('example'), `${key} examples`).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('expanded math stories', () => {
  it('every story has ≥7 beats and every beat body has ≥20 words', () => {
    expect(stories.length).toBeGreaterThanOrEqual(23);
    for (const st of stories as { title: string; beats: { head: string; body: string }[] }[]) {
      expect(st.beats.length, `${st.title} beats`).toBeGreaterThanOrEqual(7);
      for (const b of st.beats) {
        const words = b.body.trim().split(/\s+/).length;
        expect(words, `${st.title} · "${b.head}" only ${words} words`).toBeGreaterThanOrEqual(20);
      }
    }
  });
});

describe('mathematician decks', () => {
  it('all 8 mathematicians have a 12–20-slide deck with visuals', () => {
    expect(MATHEMATICIAN_DECKS.length).toBe(8);
    for (const d of MATHEMATICIAN_DECKS) {
      expect(d.slides.length, `${d.name} slides`).toBeGreaterThanOrEqual(12);
      expect(d.slides.length, `${d.name} slides`).toBeLessThanOrEqual(20);
      expect(d.tieIn.length, `${d.name} tieIn`).toBeGreaterThan(0);
      for (const s of d.slides) {
        expect(s.head.length, `${d.name} empty head`).toBeGreaterThan(0);
        expect(s.body.length, `${d.name} "${s.head}" body`).toBeGreaterThan(40);
        expect(s.visual.length, `${d.name} "${s.head}" visual`).toBeGreaterThan(0);
      }
    }
  });

  it('deck ids match the names on the Mathematicians page', () => {
    const expected = ['Euclid', 'Isaac Newton', 'Leonhard Euler', 'Carl Friedrich Gauss', 'Srinivasa Ramanujan', 'Emmy Noether', 'David Hilbert', 'Georg Cantor'];
    const ids = MATHEMATICIAN_DECKS.map((d) => d.id);
    for (const name of expected) expect(ids, `missing deck for ${name}`).toContain(name);
  });
});
