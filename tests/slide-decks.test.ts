import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import katex from 'katex';
import { LESSONS, lessonKey } from '../src/data/lessons';
import { MATHEMATICIAN_DECKS } from '../src/data/mathematicianDecks';
import stories from '../src/data/mathStories.json';

// The story-style slide rewrite: every lesson carries a 12–22-slide deck with
// an example ladder (base case → harder → multi-step → "Another way" alternate
// approach → visualize-first word problem) plus an "Extra credit" challenge,
// every story is expanded (≥7 beats, meaty bodies), and every mathematician
// has a 12–20-slide deck.

// Geometry and Trigonometry ship text-first: their problem banks and lessons
// are complete, but their slide decks are a later phase — the same way Algebra
// 1 and Precalculus shipped before theirs were authored. Every lesson that DOES
// carry a deck still has to meet the full bar below, and the list is asserted
// exactly, so a deck cannot go missing anywhere else without this failing.
const TEXT_FIRST_DOMAINS: string[] = ['GEO', 'TRIG'];
const DECKED = LESSONS.filter((l) => !TEXT_FIRST_DOMAINS.includes(l.domain));

describe('lesson slide decks', () => {
  it('only the text-first courses are without a deck', () => {
    const without = LESSONS.filter((l) => !(l.slides?.length ?? 0)).map((l) => l.domain);
    expect([...new Set(without)].sort()).toEqual([...TEXT_FIRST_DOMAINS].sort());
    expect(DECKED.length).toBeGreaterThan(60);
  });

  it('every lesson has 12–22 slides with non-empty head/body', () => {
    for (const l of DECKED) {
      const key = lessonKey(l.domain, l.unit);
      expect(l.slides, `${key} has no slide deck`).toBeDefined();
      const s = l.slides!;
      expect(s.length, `${key} has ${s.length} slides`).toBeGreaterThanOrEqual(12);
      expect(s.length, `${key} has ${s.length} slides`).toBeLessThanOrEqual(22);
      for (const sl of s) {
        expect(sl.head.length, `${key} empty head`).toBeGreaterThan(0);
        expect(sl.body.length, `${key} "${sl.head}" body too short`).toBeGreaterThan(40);
      }
    }
  });

  it('every deck covers the full arc: objective, concept, example, protip, trap, challenge, summary', () => {
    for (const l of DECKED) {
      const key = lessonKey(l.domain, l.unit);
      const kinds = new Set((l.slides ?? []).map((s) => s.kind));
      for (const k of ['objective', 'concept', 'example', 'protip', 'trap', 'challenge', 'summary'] as const) {
        expect(kinds.has(k), `${key} missing a ${k} slide`).toBe(true);
      }
    }
  });

  it('decks have enough teaching depth (3+ concepts, 6+ examples)', () => {
    for (const l of DECKED) {
      const key = lessonKey(l.domain, l.unit);
      const by = (k: string) => (l.slides ?? []).filter((s) => s.kind === k).length;
      expect(by('concept'), `${key} concepts`).toBeGreaterThanOrEqual(3);
      expect(by('example'), `${key} examples`).toBeGreaterThanOrEqual(6);
    }
  });

  it('every deck shows an alternate problem-solving approach ("Another way…")', () => {
    for (const l of DECKED) {
      const key = lessonKey(l.domain, l.unit);
      const hasAlt = (l.slides ?? []).some(
        (s) => s.kind === 'example' && s.head.toLowerCase().startsWith('another way'),
      );
      expect(hasAlt, `${key} has no "Another way" alternate-approach example`).toBe(true);
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
  it('all 13 mathematicians have a 12–20-slide deck', () => {
    expect(MATHEMATICIAN_DECKS.length).toBe(13);
    for (const d of MATHEMATICIAN_DECKS) {
      expect(d.slides.length, `${d.name} slides`).toBeGreaterThanOrEqual(12);
      expect(d.slides.length, `${d.name} slides`).toBeLessThanOrEqual(20);
      expect(d.tieIn.length, `${d.name} tieIn`).toBeGreaterThan(0);
      for (const s of d.slides) {
        expect(s.head.length, `${d.name} empty head`).toBeGreaterThan(0);
        expect(s.body.length, `${d.name} "${s.head}" body`).toBeGreaterThan(40);
      }
    }
  });

  it('deck ids match the names on the Mathematicians page', () => {
    const expected = ['Euclid', 'Isaac Newton', 'Leonhard Euler', 'Carl Friedrich Gauss', 'Srinivasa Ramanujan', 'Emmy Noether', 'David Hilbert', 'Georg Cantor', 'Al-Khwarizmi', 'Thales of Miletus', 'Hipparchus', 'John Napier', 'George Pólya'];
    const ids = MATHEMATICIAN_DECKS.map((d) => d.id);
    for (const name of expected) expect(ids, `missing deck for ${name}`).toContain(name);
  });
});

// ── The figures ────────────────────────────────────────────────────────────
// Slides used to carry an emoji scene: a library and a wave for "a teacher in
// Alexandria", a crown and a road for "no royal road". They set a mood and
// taught nothing, so the illustration pane — half the screen — was wasted.
// Every slide now carries a figure that IS the mathematics, and these are the
// bars that keep it that way.

/** Tags must nest properly, or the browser renders something else entirely. */
function svgIsWellFormed(svg: string): true | string {
  const stack: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
    const [, closing, tag, , selfClosing] = m;
    if (selfClosing) continue;
    if (closing) {
      if (stack.pop() !== tag) return `unbalanced </${tag}>`;
    } else {
      stack.push(tag);
    }
  }
  return stack.length === 0 ? true : `never closed: <${stack.join('>, <')}>`;
}

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;

describe('the figure on every slide', () => {
  const SLIDES = MATHEMATICIAN_DECKS.flatMap((d) => d.slides.map((s) => [d.name, s] as const));

  it('exists — no slide is left with nothing to look at', () => {
    for (const [name, s] of SLIDES) {
      expect(s.figure, `${name} · "${s.head}"`).toBeTruthy();
      expect(['math', 'svg'], `${name} · "${s.head}"`).toContain(s.figure.kind);
    }
  });

  it('carries actual mathematics when it is typeset', () => {
    for (const [name, s] of SLIDES) {
      if (s.figure.kind !== 'math') continue;
      const where = `${name} · "${s.head}"`;
      expect(s.figure.tex.length, where).toBeGreaterThan(0);
      for (const line of s.figure.tex) {
        expect(line.trim().length, where).toBeGreaterThan(2);
        // A number, a relation, or a LaTeX macro — prose alone is not a figure.
        expect(line, `${where}: "${line}" has no mathematics in it`).toMatch(
          /[0-9=<>]|\\[a-zA-Z]/,
        );
        // A single backslash in a single-quoted TS string is an escape, not
        // TeX: '\frac' silently becomes a TAB. Catch that before it ships.
        expect(line, `${where}: "${line}" has a control character`).not.toMatch(
          /[\u0000-\u001f]/,
        );
      }
    }
  });

  it('actually typesets — every line is valid TeX, not a red error', () => {
    for (const [name, s] of SLIDES) {
      if (s.figure.kind !== 'math') continue;
      for (const line of s.figure.tex) {
        expect(
          () => katex.renderToString(line, { throwOnError: true, output: 'html' }),
          `${name} · "${s.head}": ${line}`,
        ).not.toThrow();
      }
    }
  });

  it('is a real, self-contained drawing when it is drawn', () => {
    for (const [name, s] of SLIDES) {
      if (s.figure.kind !== 'svg') continue;
      const where = `${name} · "${s.head}"`;
      const { svg, alt } = s.figure;
      expect(svg.startsWith('<svg '), where).toBe(true);
      expect(svg.trimEnd().endsWith('</svg>'), where).toBe(true);
      // One canvas for all of them, so every figure scales the same way.
      expect(svg, where).toContain('viewBox="0 0 400 320"');
      expect(svgIsWellFormed(svg), where).toBe(true);
      // Nothing may be fetched: the pane must draw the same offline.
      expect(svg, `${where} loads something external`).not.toMatch(/<script|href=|xlink:|url\(|http/);
      // It has to actually draw something, not just hold text.
      expect(svg, `${where} draws no shapes`).toMatch(/<(line|rect|circle|path|polygon)/);
      expect(alt.length, `${where} has no description for a screen reader`).toBeGreaterThan(12);
    }
  });


  // A label wider than the canvas is simply clipped by the viewBox — the end
  // of the sentence vanishes with no error anywhere. Width is estimated from
  // the character count at a deliberately generous 0.62 em, so a label that
  // passes here has room to spare in the real font.
  it('never runs a label off the edge of the canvas', () => {
    const TEXT = /<text ([^>]*)>([^<]*)<\/text>/g;
    const attr = (a: string, n: string, d: string) =>
      new RegExp(`${n}="([^"]*)"`).exec(a)?.[1] ?? d;
    for (const [name, s] of SLIDES) {
      if (s.figure.kind !== 'svg') continue;
      for (const m of s.figure.svg.matchAll(TEXT)) {
        const [, a, raw] = m;
        const text = raw.replace(/&#160;/g, ' ');
        const x = Number(attr(a, 'x', '0'));
        const size = Number(attr(a, 'font-size', '15'));
        const anchor = attr(a, 'text-anchor', 'start');
        const w = text.length * size * 0.62;
        const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
        const where = `${name} · "${s.head}": "${text}"`;
        expect(left, `${where} starts off the left edge`).toBeGreaterThanOrEqual(0);
        expect(left + w, `${where} runs past the right edge`).toBeLessThanOrEqual(400);
      }
    }
  });


  // Two labels that land on top of each other render as unreadable mush, and
  // nothing errors. Boxes are estimated the same generous way as above.
  it('never stacks two labels on top of each other', () => {
    for (const [name, s] of SLIDES) {
      if (s.figure.kind !== 'svg') continue;
      const boxes = [...s.figure.svg.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)]
        .map(([, a, raw]) => {
          const text = raw.replace(/&#160;/g, ' ');
          const at = (n: string, d: string) => new RegExp(`${n}="([^"]*)"`).exec(a)?.[1] ?? d;
          const x = Number(at('x', '0'));
          const y = Number(at('y', '0'));
          const size = Number(at('font-size', '15'));
          const anchor = at('text-anchor', 'start');
          const w = text.length * size * 0.6;
          const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
          return { text, x1: left, x2: left + w, y1: y - size * 0.78, y2: y + size * 0.22 };
        })
        .filter((b) => b.text.trim().length > 0);
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const overlap =
            Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 2 &&
            Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 2;
          expect(
            overlap,
            `${name} · "${s.head}": "${a.text}" sits on top of "${b.text}"`,
          ).toBe(false);
        }
      }
    }
  });

  it('says something, not just sets a mood', () => {
    for (const [name, s] of SLIDES) {
      const where = `${name} · "${s.head}"`;
      const text = s.figure.kind === 'math' ? s.figure.tex.join(' ') : s.figure.svg;
      expect(EMOJI.test(text), `${where} is decorated with emoji instead of drawn`).toBe(false);
      if (s.figure.caption) {
        expect(s.figure.caption.length, `${where} caption`).toBeGreaterThan(12);
      }
    }
  });

  it('is different on every slide — no figure is reused to fill a gap', () => {
    for (const d of MATHEMATICIAN_DECKS) {
      const seen = new Set<string>();
      for (const s of d.slides) {
        const key = s.figure.kind === 'math' ? s.figure.tex.join('|') : s.figure.svg;
        expect(seen.has(key), `${d.name} · "${s.head}" repeats an earlier figure`).toBe(false);
        seen.add(key);
      }
    }
  });

  it('is drawn, not only typeset, several times in every deck', () => {
    for (const d of MATHEMATICIAN_DECKS) {
      const drawn = d.slides.filter((s) => s.figure.kind === 'svg').length;
      expect(drawn, `${d.name} has only ${drawn} drawn figures`).toBeGreaterThanOrEqual(5);
    }
  });

  it('the emoji-scene field is gone, not merely unused', () => {
    const src = readFileSync(new URL('../src/data/mathematicianDecks.ts', import.meta.url), 'utf8');
    expect(src, 'a slide can still carry a decorative emoji scene').not.toMatch(/\bvisual\b/);
  });
});
