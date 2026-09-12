import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAngleFigure, type AngleFigure } from '../scripts/figures/angleFigures';
import TRIG from '../scripts/figures/specs/TRIG';
import GEO from '../scripts/figures/specs/GEO';
import PC from '../scripts/figures/specs/PC';
import type { Problem } from '../src/types/problem';

// Every problem about an angle gets a picture of the situation it describes.
// Trigonometry, Geometry and Precalculus shipped with none at all — 420
// problems about triangles, circles and waves, and not one drawing — so this
// is the bar that keeps the pictures there, and keeps them honest.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALL: Problem[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'public', 'data', 'problems.json'), 'utf-8'),
);
const byId = new Map(ALL.map((p) => [p.id, p]));

const SPECS: Record<string, Record<string, AngleFigure>> = { TRIG, GEO, PC };

/** Which units of each course describe a picture, and so must all carry one. */
const PICTURED_UNITS: Record<string, number[]> = {
  TRIG: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  GEO: [2, 3, 6, 7, 8, 9, 10, 11, 12, 14],
  PC: [8, 9, 10, 11, 12],
};

describe('coverage', () => {
  for (const [domain, units] of Object.entries(PICTURED_UNITS)) {
    it(`${domain}: every problem in an angle unit has a figure spec`, () => {
      const missing = ALL.filter((p) => p.domain === domain && units.includes(p.unit) && !SPECS[domain][p.id]).map((p) => p.id);
      expect(missing, `no figure for ${missing.join(', ')}`).toEqual([]);
    });

    it(`${domain}: every spec names a real problem`, () => {
      for (const id of Object.keys(SPECS[domain])) expect(byId.has(id), id).toBe(true);
    });

    it(`${domain}: the generated diagram is in the built content`, () => {
      for (const id of Object.keys(SPECS[domain])) {
        const p = byId.get(id)!;
        expect(p.diagram?.kind, id).toBe('inline-svg');
      }
    });
  }
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
  return stack.length === 0 ? true : `never closed <${stack.join('>, <')}>`;
}

describe('every figure', () => {
  const ALL_SPECS = Object.entries(SPECS).flatMap(([d, m]) => Object.entries(m).map(([id, spec]) => [d, id, spec] as const));

  it('renders without throwing', () => {
    for (const [, id, spec] of ALL_SPECS) {
      expect(() => renderAngleFigure(spec), id).not.toThrow();
    }
  });

  it('is a self-contained, well-formed SVG that draws in the theme colour', () => {
    for (const [, id, spec] of ALL_SPECS) {
      const { svg, alt } = renderAngleFigure(spec);
      expect(svg.startsWith('<svg '), id).toBe(true);
      expect(svg.trimEnd().endsWith('</svg>'), id).toBe(true);
      expect(svg, id).toMatch(/viewBox="0 0 \d+ \d+"/);
      expect(wellFormed(svg), id).toBe(true);
      // Nothing fetched; the card must draw the same offline. (The SVG
      // namespace is the one URL that belongs there.)
      const body = svg.replace('xmlns="http://www.w3.org/2000/svg"', '');
      expect(body, `${id} loads something external`).not.toMatch(/<script|href=|xlink:|url\(|https?:/);
      // Ink is currentColor so the figure follows light and dark. Hard-coded
      // near-black ink is the thing that made the older 6th-grade diagrams
      // vanish on a dark card.
      expect(svg, `${id} hard-codes its ink`).not.toMatch(/#0f172a|#000\b|black/i);
      expect(alt.length, `${id} has no description for a screen reader`).toBeGreaterThan(12);
    }
  });

  it('never runs a label off the canvas', () => {
    for (const [, id, spec] of ALL_SPECS) {
      const { svg } = renderAngleFigure(spec);
      const [, w] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg)!.map(Number);
      for (const m of svg.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)) {
        const [, a, txt] = m;
        const at = (n: string, d: string) => new RegExp(`${n}="([^"]*)"`).exec(a)?.[1] ?? d;
        const x = Number(at('x', '0'));
        const size = Number(at('font-size', '14'));
        const anchor = at('text-anchor', 'middle');
        const width = txt.length * size * 0.6;
        const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
        expect(left, `${id}: "${txt}" starts off the left edge`).toBeGreaterThanOrEqual(-2);
        expect(left + width, `${id}: "${txt}" runs past the right edge`).toBeLessThanOrEqual(w + 2);
      }
    }
  });

  it('never writes the answer on the picture', () => {
    // The givens may well be the digits of the answer — the 45-45-90 triangle
    // with legs 1 IS how you read off tan 45°. What must not appear is the
    // unknown already filled in: a label that says "c = 7" when c is asked.
    for (const [, id, spec] of ALL_SPECS) {
      const p = byId.get(id)!;
      const { svg } = renderAngleFigure(spec);
      const labels = [...svg.matchAll(/<text [^>]*>([^<]*)<\/text>/g)].map((m) => m[1].trim());
      const answer = p.primaryAnswer.trim();
      if (!/^-?\d+(\.\d+)?$/.test(answer)) continue;
      const leak = labels.find((l) => new RegExp(`=\\s*${answer.replace('.', '\\.')}\\s*(°|ft|m|in|cm|km|h)?$`).test(l));
      expect(leak, `${id}: "${leak}" hands over the answer ${answer}`).toBeUndefined();
    }
  });
});

describe('the unknown is visible', () => {
  it('most figures carry a "?" where the question points', () => {
    const all = Object.values(SPECS).flatMap((m) => Object.entries(m));
    const withQ = all.filter(([, spec]) => renderAngleFigure(spec).svg.includes('?')).length;
    expect(withQ / all.length).toBeGreaterThan(0.6);
  });
});
