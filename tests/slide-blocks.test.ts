import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { LESSONS, lessonKey } from '../src/data/lessons';
import type { LessonSlide } from '../src/data/lessonSlides/types';

// A slide used to be a headline and a paragraph, so the rule being taught sat
// in the middle of a sentence and looked like every other sentence. Slides now
// carry VISUAL BLOCKS — the formula typeset big with each symbol named, two
// ideas side by side, a worked run one box per step, a table, a drawing. These
// are the bars that keep those blocks correct and readable.

const ALL: { where: string; slide: LessonSlide }[] = LESSONS.flatMap((l) =>
  (l.slides ?? []).map((s) => ({ where: `${lessonKey(l.domain, l.unit)} · "${s.head}"`, slide: s })),
);

/** Every piece of TeX anywhere on a slide, with where it came from. */
function texOf(s: LessonSlide): string[] {
  const out: string[] = [];
  if (s.formula) {
    out.push(s.formula.tex);
    for (const p of s.formula.parts ?? []) out.push(p.sym);
  }
  for (const c of s.compare?.cols ?? []) if (c.tex) out.push(c.tex);
  for (const st of s.steps?.steps ?? []) if (st.tex) out.push(st.tex);
  if (s.steps?.answer) out.push(s.steps.answer);
  return out;
}

describe('the mathematics on a slide typesets', () => {
  it('every formula, symbol, column, step and answer is valid TeX', () => {
    for (const { where, slide } of ALL) {
      for (const t of texOf(slide)) {
        expect(t.trim().length, `${where}: empty TeX`).toBeGreaterThan(0);
        // A single backslash in a single-quoted TS string is an escape, not
        // TeX: '\frac' silently becomes a TAB. Catch that before it ships.
        expect(t, `${where}: "${t}" has a control character`).not.toMatch(/[\u0000-\u001f]/);
        expect(
          () => katex.renderToString(t, { throwOnError: true, output: 'html' }),
          `${where}: ${t}`,
        ).not.toThrow();
      }
    }
  });

  it('a formula names what its symbols do, and a step says what it did', () => {
    for (const { where, slide } of ALL) {
      for (const p of slide.formula?.parts ?? []) {
        expect(p.means.length, `${where}: symbol ${p.sym} has no explanation`).toBeGreaterThan(8);
      }
      for (const st of slide.steps?.steps ?? []) {
        expect(st.text.length, `${where}: a step says nothing`).toBeGreaterThan(8);
      }
      if (slide.steps) expect(slide.steps.steps.length, `${where}: steps`).toBeGreaterThanOrEqual(2);
    }
  });

  it('no prose leaks an escape sequence a TS string swallowed', () => {
    for (const { where, slide } of ALL) {
      const prose = [
        slide.formula?.note,
        ...(slide.formula?.parts ?? []).map((p) => p.means),
        ...(slide.compare?.cols ?? []).flatMap((c) => [c.title, ...c.lines]),
        slide.compare?.note,
        ...(slide.steps?.steps ?? []).map((s) => s.text),
        slide.table?.note,
        ...(slide.table?.head ?? []),
        ...(slide.table?.rows ?? []).flat(),
        slide.art?.caption,
        slide.art?.alt,
      ].filter(Boolean) as string[];
      for (const t of prose) {
        expect(t, `${where}: "${t}" shows a raw escape instead of the character`).not.toMatch(
          /\\[unx][0-9a-fA-F]/,
        );
      }
    }
  });

  it('a comparison holds two or three things, each with something to read', () => {
    for (const { where, slide } of ALL) {
      if (!slide.compare) continue;
      const n = slide.compare.cols.length;
      expect(n, `${where}: ${n} columns`).toBeGreaterThanOrEqual(2);
      expect(n, `${where}: ${n} columns`).toBeLessThanOrEqual(3);
      for (const c of slide.compare.cols) {
        expect(c.title.length, `${where}: a column has no title`).toBeGreaterThan(2);
        expect(c.lines.length, `${where}: "${c.title}" is empty`).toBeGreaterThan(0);
      }
    }
  });

  it('a table is rectangular and points at something', () => {
    for (const { where, slide } of ALL) {
      const t = slide.table;
      if (!t) continue;
      expect(t.rows.length, `${where}: empty table`).toBeGreaterThan(1);
      for (const r of t.rows) {
        expect(r.length, `${where}: a row has ${r.length} cells, header has ${t.head.length}`).toBe(t.head.length);
      }
      if (t.mark !== undefined) {
        expect(t.mark, `${where}: mark ${t.mark} is outside the table`).toBeLessThan(t.rows.length);
        expect(t.mark, `${where}: mark ${t.mark}`).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

// Precalculus is the course that asked for this: every rule in it is a formula
// and every idea has a picture, so a deck of paragraphs was the wrong shape for
// it. These are the bars that keep the visuals there.
describe('the Precalculus decks are visual', () => {
  const PC = LESSONS.filter((l) => l.domain === 'PC');

  it('covers all fourteen units', () => {
    expect(PC.length).toBe(14);
  });

  it('most of every deck carries a block, not just prose', () => {
    for (const l of PC) {
      const s = l.slides ?? [];
      const withBlock = s.filter((x) => x.formula || x.compare || x.steps || x.table || x.art).length;
      expect(withBlock / s.length, `${lessonKey(l.domain, l.unit)}: ${withBlock}/${s.length} slides`).toBeGreaterThanOrEqual(0.5);
    }
  });

  it('every unit states its rules in a framed formula, at least three times', () => {
    for (const l of PC) {
      const n = (l.slides ?? []).filter((s) => s.formula).length;
      expect(n, `${lessonKey(l.domain, l.unit)} has ${n} formula blocks`).toBeGreaterThanOrEqual(3);
    }
  });

  it('every unit has something drawn, at least twice', () => {
    for (const l of PC) {
      const n = (l.slides ?? []).filter((s) => s.art).length;
      expect(n, `${lessonKey(l.domain, l.unit)} has ${n} drawings`).toBeGreaterThanOrEqual(2);
    }
  });

  it('every unit walks at least two examples step by step', () => {
    for (const l of PC) {
      const n = (l.slides ?? []).filter((s) => s.steps).length;
      expect(n, `${lessonKey(l.domain, l.unit)} has ${n} worked step blocks`).toBeGreaterThanOrEqual(2);
    }
  });
});

/** Tags must nest properly, or the browser renders something else entirely. */
function wellFormed(svg: string): true | string {
  const stack: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
    const [, closing, tag, , selfClosing] = m;
    if (selfClosing) continue;
    if (closing) {
      if (stack.pop() !== tag) return `unbalanced </${tag}>`;
    } else stack.push(tag);
  }
  return stack.length === 0 ? true : `never closed: <${stack.join('>, <')}>`;
}

/** Where each label sits, at a deliberately generous width estimate. */
function boxesOf(svg: string) {
  return [...svg.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)]
    .map(([, a, raw]) => {
      const t = raw.replace(/&#160;/g, ' ');
      const at = (n: string, d: string) => new RegExp(`${n}="([^"]*)"`).exec(a)?.[1] ?? d;
      const x = Number(at('x', '0'));
      const y = Number(at('y', '0'));
      const size = Number(at('font-size', '13'));
      const anchor = at('text-anchor', 'middle');
      const w = t.length * size * 0.6;
      const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
      return { t, x1: left, x2: left + w, y1: y - size * 0.78, y2: y + size * 0.22 };
    })
    .filter((b) => b.t.trim().length > 0);
}

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;

describe('the drawing on a slide', () => {
  const DRAWN = ALL.filter((a) => a.slide.art).map((a) => ({ where: a.where, art: a.slide.art! }));

  it('is a real, self-contained SVG on the shared canvas', () => {
    for (const { where, art } of DRAWN) {
      expect(art.svg.startsWith('<svg '), where).toBe(true);
      expect(art.svg.trimEnd().endsWith('</svg>'), where).toBe(true);
      expect(art.svg, where).toContain('viewBox="0 0 400 260"');
      expect(wellFormed(art.svg), where).toBe(true);
      // Nothing fetched: the slide must draw the same offline. (The SVG
      // namespace is the one URL that belongs there.)
      const body = art.svg.replace('xmlns="http://www.w3.org/2000/svg"', '');
      expect(body, `${where} loads something external`).not.toMatch(/<script|href=|xlink:|url\(|https?:/);
      expect(art.svg, `${where} draws no shapes`).toMatch(/<(line|rect|circle|path|polygon|ellipse)/);
      expect(art.alt.length, `${where} has no description for a screen reader`).toBeGreaterThan(12);
      expect(EMOJI.test(art.svg), `${where} is decorated with emoji instead of drawn`).toBe(false);
    }
  });

  it('follows the card into dark mode — ink is currentColor, never hard-coded', () => {
    for (const { where, art } of DRAWN) {
      expect(art.svg, `${where} hard-codes its ink`).not.toMatch(/#0f172a|#000\b|#111|black|white/i);
      expect(art.svg, `${where} never uses the card's own ink`).toContain('currentColor');
    }
  });

  it('never runs a label off the canvas', () => {
    for (const { where, art } of DRAWN) {
      for (const b of boxesOf(art.svg)) {
        expect(b.x1, `${where}: "${b.t}" starts off the left edge`).toBeGreaterThanOrEqual(-2);
        expect(b.x2, `${where}: "${b.t}" runs past the right edge`).toBeLessThanOrEqual(402);
        expect(b.y1, `${where}: "${b.t}" sits above the top edge`).toBeGreaterThanOrEqual(0);
        expect(b.y2, `${where}: "${b.t}" hangs off the bottom edge`).toBeLessThanOrEqual(260);
      }
    }
  });

  it('never stacks two labels on top of each other', () => {
    for (const { where, art } of DRAWN) {
      const boxes = boxesOf(art.svg);
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const over =
            Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 2 &&
            Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 2;
          expect(over, `${where}: "${a.t}" sits on top of "${b.t}"`).toBe(false);
        }
      }
    }
  });

  it('is different on every slide of a deck — no drawing fills a gap twice', () => {
    for (const l of LESSONS) {
      const seen = new Set<string>();
      for (const s of l.slides ?? []) {
        if (!s.art) continue;
        const key = lessonKey(l.domain, l.unit);
        expect(seen.has(s.art.svg), `${key} · "${s.head}" repeats an earlier drawing`).toBe(false);
        seen.add(s.art.svg);
      }
    }
  });
});
