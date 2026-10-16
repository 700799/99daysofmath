import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { STORIES } from '../src/data/stories';
import { STORY_FIGURES } from '../src/data/storyFigures';
import type { MathFigure } from '../src/data/mathFigure';

// Math Stories play in the same player as the Famous Mathematicians: big words
// on one half, the mathematics drawn on the other. The 6th-grade stories used to
// show a video there instead, which stayed black until it loaded and locked
// Continue while it played. Each now carries a drawn figure per beat, held to
// the same bars as the mathematician figures.

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;

function svgIsWellFormed(svg: string): true | string {
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

const boxesOf = (f: MathFigure) =>
  f.kind !== 'svg'
    ? []
    : [...f.svg.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)]
        .map(([, a, raw]) => {
          const text = raw.replace(/&#160;/g, ' ').replace(/&[a-z]+;/g, 'x');
          const at = (n: string, d: string) => new RegExp(`(?:^|\\s)${n}="([^"]*)"`).exec(a)?.[1] ?? d;
          const x = Number(at('x', '0'));
          const y = Number(at('y', '0'));
          const size = Number(at('font-size', '15'));
          const anchor = at('text-anchor', 'start');
          const w = text.length * size * 0.62;
          const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
          return { text, size, x1: left, x2: left + w, y1: y - size * 0.78, y2: y + size * 0.22 };
        })
        .filter((b) => b.text.trim().length > 0);

function checkFigure(where: string, f: MathFigure) {
  if (f.kind === 'math') {
    expect(f.tex.length, where).toBeGreaterThan(0);
    for (const line of f.tex) {
      expect(line, `${where}: "${line}" has no mathematics in it`).toMatch(/[0-9=<>]|\\[a-zA-Z]/);
      expect(line, `${where}: "${line}" has a control character`).not.toMatch(/[\u0000-\u001f]/);
      expect(() => katex.renderToString(line, { throwOnError: true, output: 'html' }), `${where}: ${line}`).not.toThrow();
    }
    return;
  }
  const { svg, alt } = f;
  expect(svg.startsWith('<svg '), where).toBe(true);
  expect(svg.trimEnd().endsWith('</svg>'), where).toBe(true);
  expect(svg, where).toContain('viewBox="0 0 400 320"');
  expect(svgIsWellFormed(svg), `${where}: ${svgIsWellFormed(svg)}`).toBe(true);
  expect(svg, `${where} loads something external`).not.toMatch(/<script|href=|xlink:|url\(|http/);
  expect(svg, `${where} draws no shapes`).toMatch(/<(line|rect|circle|path|polygon|ellipse)/);
  expect(alt.length, `${where} has no description for a screen reader`).toBeGreaterThan(12);
  expect(EMOJI.test(svg), `${where} is decorated with emoji instead of drawn`).toBe(false);
  const boxes = boxesOf(f);
  for (const b of boxes) {
    expect(b.size, `${where}: "${b.text}" is too small to read on a phone`).toBeGreaterThanOrEqual(11);
    expect(b.x1, `${where}: "${b.text}" starts off the left edge`).toBeGreaterThanOrEqual(0);
    expect(b.x2, `${where}: "${b.text}" runs past the right edge`).toBeLessThanOrEqual(400);
    expect(b.y1, `${where}: "${b.text}" starts above the top`).toBeGreaterThanOrEqual(0);
    expect(b.y2, `${where}: "${b.text}" runs below the bottom`).toBeLessThanOrEqual(320);
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const overlap = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 2 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 2;
      expect(overlap, `${where}: "${a.text}" sits on top of "${b.text}"`).toBe(false);
    }
  }
}

describe('every story is illustrated like a mathematician deck', () => {
  for (const s of STORIES) {
    describe(s.id, () => {
      it('has a figure on every beat and on "What you learned"', () => {
        for (const b of s.beats) expect(b.figure, `${s.title} · "${b.head}" has nothing to look at`).toBeTruthy();
        expect(s.learnedFigure, `${s.title} has no figure for "What you learned"`).toBeTruthy();
        if (s.videoSrc) {
          expect(STORY_FIGURES[s.id]?.length, `${s.id} needs one figure per beat plus one`).toBe(s.beats.length + 1);
        }
      });

      it('every figure is valid, legible and inside the canvas', () => {
        s.beats.forEach((b, i) => b.figure && checkFigure(`${s.id} beat ${i + 1} "${b.head}"`, b.figure));
        if (s.learnedFigure) checkFigure(`${s.id} learned`, s.learnedFigure);
      });

      it('never repeats a figure, and draws (not only typesets) most of them', () => {
        const figs = [...s.beats.map((b) => b.figure!), ...(s.videoSrc ? [s.learnedFigure!] : [])].filter(Boolean);
        const keys = figs.map((f) => (f.kind === 'math' ? f.tex.join('|') : f.svg));
        expect(new Set(keys).size, `${s.id} repeats a figure`).toBe(keys.length);
        const drawn = figs.filter((f) => f.kind === 'svg').length;
        expect(drawn, `${s.id} has only ${drawn} drawn figures`).toBeGreaterThanOrEqual(Math.min(5, Math.ceil(figs.length / 2)));
      });

      it('has its own icon', () => {
        expect(s.emoji, s.id).not.toBe('🌟');
      });
    });
  }
});
