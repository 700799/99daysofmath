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
describe('every course is taught with pictures, not just prose', () => {
  const DECKED = LESSONS.filter((l) => (l.slides ?? []).length > 0);

  it('covers every course, Precalculus included', () => {
    const units = new Map<string, number>();
    for (const l of DECKED) units.set(l.domain, (units.get(l.domain) ?? 0) + 1);
    expect(Object.fromEntries(units)).toEqual({
      '5.F': 6,
      '6.RP': 11,
      '6.NS': 10,
      '6.EE': 10,
      '6.G': 10,
      '6.SP': 10,
      A1: 14,
      PC: 14,
    });
  });

  it('every unit has something drawn, at least three times', () => {
    for (const l of DECKED) {
      const n = (l.slides ?? []).filter((s) => s.art).length;
      expect(n, `${lessonKey(l.domain, l.unit)} has ${n} drawings`).toBeGreaterThanOrEqual(3);
    }
  });

  it('half of every deck carries a block, not just prose', () => {
    for (const l of DECKED) {
      const s = l.slides ?? [];
      const withBlock = s.filter((x) => x.formula || x.compare || x.steps || x.table || x.art).length;
      expect(withBlock / s.length, `${lessonKey(l.domain, l.unit)}: ${withBlock}/${s.length} slides`).toBeGreaterThanOrEqual(0.5);
    }
  });

  it('every unit states its rules in a framed formula, at least three times', () => {
    for (const l of DECKED) {
      const n = (l.slides ?? []).filter((s) => s.formula).length;
      expect(n, `${lessonKey(l.domain, l.unit)} has ${n} formula blocks`).toBeGreaterThanOrEqual(3);
    }
  });

  it('every unit walks at least two examples step by step', () => {
    for (const l of DECKED) {
      const n = (l.slides ?? []).filter((s) => s.steps).length;
      expect(n, `${lessonKey(l.domain, l.unit)} has ${n} worked step blocks`).toBeGreaterThanOrEqual(2);
    }
  });

  it('the opening slide of every unit leads with a picture', () => {
    for (const l of DECKED) {
      const opener = (l.slides ?? [])[0];
      const lead = !!(opener.art || opener.formula);
      expect(lead, `${lessonKey(l.domain, l.unit)} opens on "${opener.head}" with nothing to look at`).toBe(true);
    }
  });

  it('a symbol that gets its own box gets its own explanation', () => {
    for (const l of DECKED) {
      for (const s of l.slides ?? []) {
        for (const p of s.formula?.parts ?? []) {
          expect(p.sym.length, `${lessonKey(l.domain, l.unit)} · "${s.head}": an empty symbol box`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('Algebra 1 teaches negative numbers, not just minus signs', () => {
  const A1 = LESSONS.filter((l) => l.domain === 'A1');
  // A genuine negative value, not the minus inside "7x − 4": a sign that opens a
  // term, or the word itself.
  const NEGATIVE = /(?:^|[\s(=,{])[\u2212-]\d|negative/i;
  const textOf = (s: (typeof A1)[number]['slides'] extends (infer T)[] | undefined ? T : never) =>
    [s.head, s.body, JSON.stringify(s.steps ?? ''), JSON.stringify(s.formula ?? '')].join(' ');

  it('covers all fourteen units', () => {
    expect(A1.length).toBe(14);
  });

  it('every unit works at least two examples that involve a negative value', () => {
    for (const l of A1) {
      const n = (l.slides ?? []).filter((s) => s.kind === 'example' && NEGATIVE.test(textOf(s))).length;
      expect(n, `${lessonKey(l.domain, l.unit)} has ${n} negative-number examples`).toBeGreaterThanOrEqual(2);
    }
  });

  it('the course as a whole leans on them heavily', () => {
    const n = A1.flatMap((l) => l.slides ?? []).filter((s) => s.kind === 'example' && NEGATIVE.test(textOf(s))).length;
    expect(n, `only ${n} negative-number examples across Algebra 1`).toBeGreaterThanOrEqual(30);
  });

  it('three quarters of every algebra deck is illustrated', () => {
    for (const l of A1) {
      const s = l.slides ?? [];
      const drawn = s.filter((x) => x.art).length;
      expect(drawn / s.length, `${lessonKey(l.domain, l.unit)}: ${drawn}/${s.length} drawn`).toBeGreaterThanOrEqual(0.75);
    }
  });

  it('the pictures that explain signs are actually used', () => {
    const svg = A1.flatMap((l) => l.slides ?? [])
      .map((s) => s.art?.svg ?? '')
      .join('');
    // zero-pair chips, a signed walk along the line, and the sign-rule grid
    expect(svg, 'no chip figure shows a zero pair cancelling').toMatch(/chips? cancel|zero pair/);
    expect(svg, 'no figure walks the number line').toMatch(/start \u2212?\d/);
    expect(svg, 'no figure states the sign rules').toMatch(/same signs give/);
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

  // A figure survives dark mode two ways: ink that is `currentColor` and so
  // follows the card, or one of the six fixed accents, each chosen to read
  // against a light and a dark background. Any OTHER colour is a hue someone
  // picked for one theme and will disappear in the other.
  const PALETTE = ['currentColor', '#F59E0B', '#0EA5E9', '#10B981', '#F43F5E', '#8B5CF6', '#fff'];

  it('is drawn only in colours that survive both themes', () => {
    for (const { where, art } of DRAWN) {
      let rest = art.svg;
      for (const c of PALETTE) rest = rest.split(c).join('·');
      const strays = [...rest.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:black|white|gray|grey|navy|slate)\b/g)].map((m) => m[0]);
      expect(strays, `${where} uses ${strays.join(', ')}, which is outside the palette`).toEqual([]);
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

describe('a drawing agrees with the slide it sits on', () => {
  const DECKED = LESSONS.filter((l) => (l.slides ?? []).length > 0);
  const norm = (s: string) => s.replace(/−/g, '-').replace(/\s+/g, '');
  /** Every "x > -5" style claim in a piece of text. */
  const claims = (s: string) =>
    [...norm(s).matchAll(/\b([a-z])(>=|<=|≥|≤|>|<|=)(-?\d+(?:\.\d+)?)/g)].map((m) => m[1] + m[2] + m[3]);

  it('never states one answer in the prose and a different one in the picture', () => {
    for (const l of DECKED) {
      for (const s of l.slides ?? []) {
        if (!s.art) continue;
        const inBody = claims(`${s.head} ${s.body}`);
        const inArt = claims(s.art.svg.replace(/<[^>]+>/g, ' '));
        for (const a of inArt) {
          const sameVar = inBody.filter((b) => b[0] === a[0]);
          if (!sameVar.length) continue;
          expect(
            sameVar,
            `${lessonKey(l.domain, l.unit)} · "${s.head}": the figure says ${a}, the words say ${sameVar.join(', ')}`,
          ).toContain(a);
        }
      }
    }
  });
});
