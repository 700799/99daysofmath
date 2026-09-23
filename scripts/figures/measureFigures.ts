/**
 * Figures for the problems that are about a *thing*: a beam with three marks
 * on it, two triangles a builder says are identical, a box whose volume is
 * asked for, a claim and the one example that breaks it, a jug of juice on a
 * line plot.
 *
 * The angle library (angleFigures.ts) draws what angle problems describe.
 * This one draws the rest of geometry and measurement: segments, congruence,
 * solids, nets, composite areas, coordinate circles, conversions, patterns
 * and shape families — the same one-line-spec-per-problem idea.
 */
import {
  INK, AMB, SKY, EMR, ROSE, VIO, rad, f, text, line, circle, dot, path, polygon,
  arrow, arcPath, svg, TICK, rightMark, check, cross,
} from './draw.js';

export type MeasureFigure =
  | Segment
  | Congruence
  | Solid
  | Net
  | Logic
  | CircleEq
  | Composite
  | LinePlot
  | Convert
  | Pattern
  | ShapeFamily;

/** Points on one straight line: a beam, a trail, a number line. */
export interface Segment {
  kind: 'segment';
  variant: 'between' | 'numberline' | 'notation' | 'rays';
  /** 'between': the points in order, left to right. */
  points?: string[];
  /** What is written under each gap between consecutive points. */
  parts?: (string | undefined)[];
  /** What is written under the whole run, in a brace. */
  whole?: string;
  /** Mark the middle point as the midpoint (tick marks on both halves). */
  mid?: boolean;
  /** 'numberline': the span drawn and the marks on it. */
  range?: [number, number];
  at?: { x: number; label?: string; color?: string }[];
  /** Mark the midpoint of the first two marks, with this label. */
  midLabel?: string;
  /** Span bracket between the first two marks. */
  span?: string;
  caption?: string;
}

/** Two triangles with the matching parts marked. */
export interface Congruence {
  kind: 'congruence';
  /** Which parts carry marks; 'shared' draws two triangles on a common side. */
  variant: 'sss' | 'sas' | 'asa' | 'aas' | 'hl' | 'ssa' | 'aaa' | 'shared' | 'cpctc' | 'angles';
  labels?: Record<string, string>;
  /** False draws a cross and says the marks do not force one shape. */
  ok?: boolean;
  caption?: string;
}

/** A solid whose volume or surface area is asked for. */
export interface Solid {
  kind: 'solid';
  variant:
    | 'prism' | 'cube' | 'cylinder' | 'cone' | 'sphere' | 'pyramid'
    | 'cone-hemisphere' | 'stack' | 'scale' | 'cubes' | 'two-cylinders';
  labels?: Record<string, string>;
  dims?: Record<string, number>;
  caption?: string;
}

/** A solid unfolded flat, so every face can be counted. */
export interface Net {
  kind: 'net';
  variant: 'cube' | 'prism';
  labels?: Record<string, string>;
  caption?: string;
}

/** A claim, its rearrangements, and what breaks it. */
export interface Logic {
  kind: 'logic';
  variant: 'conditional' | 'converse' | 'inverse' | 'contrapositive' | 'counterexample' | 'chain' | 'steps';
  p?: string;
  q?: string;
  claim?: string;
  /** 'chain' links, or 'steps' lines, or the counterexample itself. */
  items?: string[];
  /** Which part to highlight: the hypothesis or the conclusion. */
  mark?: 'p' | 'q';
  caption?: string;
}

/** A circle drawn on a coordinate grid from its equation. */
export interface CircleEq {
  kind: 'circle-eq';
  h: number;
  k: number;
  r: number;
  labels?: { centre?: string; r?: string; eq?: string };
}

/** Rectangles joined, stacked or cut out of one another. */
export interface Composite {
  kind: 'composite';
  variant: 'side-by-side' | 'stacked' | 'cut-out' | 'house' | 'tee' | 'corner-cut' | 'inside';
  dims: Record<string, number>;
  labels?: Record<string, string>;
  /** Draw the perimeter heavy rather than shading the area. */
  perimeter?: boolean;
  caption?: string;
}

/** A line plot: a tick for each measurement, stacked over the scale. */
export interface LinePlot {
  kind: 'lineplot';
  ticks: string[];
  counts: number[];
  unit?: string;
  caption?: string;
}

/** One unit turned into another, or a unit chosen from a few. */
export interface Convert {
  kind: 'convert';
  variant?: 'ladder' | 'pick';
  from?: { n: string; unit: string };
  to?: { n: string; unit: string };
  factor?: string;
  dir?: '×' | '÷';
  /** 'pick': the thing being measured and the units on offer. */
  thing?: string;
  options?: string[];
  caption?: string;
}

/** A number pattern drawn as hops along a line. */
export interface Pattern {
  kind: 'pattern';
  start: number;
  step: number;
  n: number;
  /** A second pattern drawn under the first, for comparison. */
  second?: { start: number; step: number };
  ask?: string;
  caption?: string;
}

export type ShapeName =
  | 'square' | 'rhombus' | 'rectangle' | 'trapezoid' | 'parallelogram'
  | 'right' | 'isosceles' | 'equilateral' | 'scalene' | 'obtuse';

/** A row of shapes, for "which name fits" and "which one breaks the claim". */
export interface ShapeFamily {
  kind: 'shapes';
  items: { name?: string; shape: ShapeName; mark?: 'yes' | 'no' | 'ask'; angles?: string[] }[];
  caption?: string;
}

// ── small helpers ──────────────────────────────────────────────────────────

const lab = (
  x: number,
  y: number,
  t: string | undefined,
  col = INK,
  anchor: 'start' | 'middle' | 'end' = 'middle',
  size = 13,
): string => (t ? text(x, y, t, { size, fill: t.includes('?') ? ROSE : col, anchor }) : '');

/** A rounded box with a line of text in it. */
function box(x: number, y: number, w: number, h: number, t: string, col = INK, size = 13): string {
  return (
    `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="9" fill="${col === INK ? 'none' : `${col}14`}" stroke="${col}" stroke-width="2"/>` +
    text(x + w / 2, y + h / 2 + size * 0.36, t, { size, fill: col })
  );
}

/** Wrap a sentence to `per` characters a line, at most `max` lines. */
function wrap(s: string, per: number, max = 3): string[] {
  const words = s.split(' ');
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > per && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) out.push(cur);
  return out.length <= max ? out : [...out.slice(0, max - 1), out.slice(max - 1).join(' ')];
}

/** Several lines of text centred on (x, y), returning the SVG. */
function lines(x: number, y: number, ls: string[], col = INK, size = 13): string {
  return ls.map((l, i) => text(x, y + i * (size + 4), l, { size, fill: col })).join('');
}

/** A tick-mark brace under a run, with the label below it. */
function brace(x1: number, x2: number, y: number, t: string | undefined, col = INK): string {
  let o = line(x1, y, x2, y, col, 1.6) + line(x1, y - 5, x1, y + 5, col, 1.6) + line(x2, y - 5, x2, y + 5, col, 1.6);
  o += lab((x1 + x2) / 2, y + 18, t, col);
  return o;
}

/** A box drawn in isometric: front face, top and side. Returns the corners. */
function isoBox(x: number, y: number, w: number, h: number, d: number, col = AMB, hidden = true) {
  const dx = d * 0.55, dy = -d * 0.4;
  const A: [number, number] = [x, y];               // front bottom-left
  const B: [number, number] = [x + w, y];           // front bottom-right
  const C: [number, number] = [x + w, y - h];       // front top-right
  const D: [number, number] = [x, y - h];           // front top-left
  const Ct: [number, number] = [C[0] + dx, C[1] + dy];
  const Dt: [number, number] = [D[0] + dx, D[1] + dy];
  const Bt: [number, number] = [B[0] + dx, B[1] + dy];
  let b = polygon([D, Dt, Ct, C], col, `${col}10`, 2);      // top
  b += polygon([C, Ct, Bt, B], col, `${col}18`, 2);          // right side
  b += polygon([A, B, C, D], col, `${col}26`, 2.6);          // front
  // the three hidden edges, dashed
  const At: [number, number] = [A[0] + dx, A[1] + dy];
  if (hidden) {
    b += line(At[0], At[1], Dt[0], Dt[1], col, 1.4, '4 4', 0.5);
    b += line(At[0], At[1], Bt[0], Bt[1], col, 1.4, '4 4', 0.5);
    b += line(A[0], A[1], At[0], At[1], col, 1.4, '4 4', 0.5);
  }
  return { b, A, B, C, D, Ct, Dt, Bt, dx, dy };
}

/** An ellipse, for the lids and bases of round solids. */
function ellipse(cx: number, cy: number, rx: number, ry: number, stroke = AMB, fill = 'none', w = 2.4, dash?: string, op?: number): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${d}${o}/>`;
}

/** The front half of an ellipse (the visible rim of a base). */
function rimFront(cx: number, cy: number, rx: number, ry: number, col = AMB): string {
  return path(`M ${f(cx - rx)} ${f(cy)} A ${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy)}`, col, 2.4);
}
function rimBack(cx: number, cy: number, rx: number, ry: number, col = AMB): string {
  return path(`M ${f(cx - rx)} ${f(cy)} A ${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(cy)}`, col, 1.6, 'none', '5 4', 0.55);
}

// ── segments ───────────────────────────────────────────────────────────────

function drawSegment(s: Segment): { svg: string; alt: string } {
  const W = 360, H = 200;
  let b = '';
  switch (s.variant) {
    case 'between': {
      const names = s.points ?? ['A', 'B', 'C'];
      const y = 96;
      const x0 = 46, x1 = W - 46;
      const xs = names.map((_, i) => x0 + ((x1 - x0) * i) / (names.length - 1));
      b += line(x0 - 16, y, x1 + 16, y, INK, 1.4, '5 5', 0.35);
      b += line(x0, y, x1, y, AMB, 3.4);
      names.forEach((n, i) => {
        b += dot(xs[i], y, 5.5, i === 0 || i === names.length - 1 ? INK : SKY);
        b += lab(xs[i], y - 16, n, i === 0 || i === names.length - 1 ? INK : SKY, 'middle', 14);
      });
      (s.parts ?? []).forEach((p, i) => {
        if (!p || i + 1 >= xs.length) return;
        b += lab((xs[i] + xs[i + 1]) / 2, y + 24, p, SKY);
      });
      if (s.mid) {
        const m = Math.floor(names.length / 2);
        for (let i = 0; i < names.length - 1; i++) {
          const mx = (xs[i] + xs[i + 1]) / 2;
          b += TICK(mx, y, 0, EMR);
          if (i === m) b += TICK(mx + 5, y, 0, EMR);
        }
      }
      if (s.whole) b += brace(x0, x1, y + 48, s.whole, AMB);
      b += lab(W / 2, 176, s.caption, INK, 'middle', 12);
      return svg(W, H, `Points ${names.join(', ')} in order on one straight line`, b);
    }
    case 'numberline': {
      const [lo, hi] = s.range ?? [0, 10];
      const y = 108, x0 = 40, x1 = W - 40;
      const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
      b += arrow(x0 - 14, y, x1 + 14, y, INK, 2);
      b += arrow(x1 + 14, y, x0 - 14, y, INK, 2);
      const step = Math.max(1, Math.round((hi - lo) / 10));
      for (let v = Math.ceil(lo); v <= hi; v += step) {
        b += line(X(v), y - 6, X(v), y + 6, INK, 1.6, undefined, 0.6);
        b += text(X(v), y + 24, String(v), { size: 11, op: 0.65 });
      }
      const at = s.at ?? [];
      at.forEach((m) => {
        const col = m.color ?? AMB;
        b += dot(X(m.x), y, 6.5, col);
        b += lab(X(m.x), y - 18, m.label, col, 'middle', 14);
      });
      if (s.midLabel && at.length >= 2) {
        const mx = (at[0].x + at[1].x) / 2;
        b += dot(X(mx), y, 6, EMR);
        b += lab(X(mx), y - 40, s.midLabel, EMR);
        b += line(X(mx), y - 30, X(mx), y - 10, EMR, 1.6, '4 3');
        b += TICK((X(at[0].x) + X(mx)) / 2, y, 0, EMR) + TICK((X(mx) + X(at[1].x)) / 2, y, 0, EMR);
      }
      if (s.span && at.length >= 2) b += brace(X(at[0].x), X(at[1].x), y + 44, s.span, SKY);
      b += lab(W / 2, 178, s.caption, INK, 'middle', 12);
      return svg(W, H, `A number line from ${lo} to ${hi} with marks on it`, b);
    }
    case 'notation': {
      // the name on the left, the drawing in the middle, what the ends do on
      // the right — all three short enough to stay on the canvas
      const rows: [string, string, string][] = [
        ['line', 'both ways', 'both'],
        ['ray', 'one way', 'right'],
        ['segment', 'both ends', 'none'],
      ];
      rows.forEach(([name, note, ends], i) => {
        const y = 52 + i * 48, x0 = 140, x1 = 250;
        if (ends === 'both') b += arrow(x0 - 24, y, x1 + 24, y, INK, 2) + arrow(x1 + 24, y, x0 - 24, y, INK, 2);
        if (ends === 'right') b += line(x0, y, x1, y, INK, 2) + arrow(x0, y, x1 + 24, y, INK, 2);
        b += line(x0, y, x1, y, AMB, 3.4);
        b += dot(x0, y, 5.5) + dot(x1, y, 5.5);
        b += lab(x0, y - 14, 'A', INK, 'middle', 12) + lab(x1, y - 14, 'B', INK, 'middle', 12);
        b += lab(40, y + 5, name, SKY, 'start');
        b += lab(278, y + 5, note, INK, 'start', 10);
      });
      b += lab(W / 2, 24, s.caption ?? 'three ways to name a piece of a line', INK, 'middle', 12);
      return svg(W, H, 'A line, a ray and a segment through the same two points A and B', b);
    }
    case 'rays': {
      const y = 100, cx = W / 2;
      b += arrow(cx, y, 40, y, AMB, 3.4) + arrow(cx, y, W - 40, y, SKY, 3.4);
      b += dot(cx, y, 6.5) + dot(96, y, 5, AMB) + dot(W - 96, y, 5, SKY);
      b += lab(cx, y - 18, 'B', INK, 'middle', 15);
      b += lab(96, y - 16, 'A', AMB, 'middle', 14) + lab(W - 96, y - 16, 'C', SKY, 'middle', 14);
      b += lab(110, y + 30, 'ray BA', AMB, 'middle', 12) + lab(W - 110, y + 30, 'ray BC', SKY, 'middle', 12);
      b += lab(W / 2, 168, s.caption ?? 'same endpoint, opposite directions', INK, 'middle', 12);
      return svg(W, H, 'Two rays from the same point B going in opposite directions', b);
    }
  }
}

// ── congruence ─────────────────────────────────────────────────────────────

/** One triangle with ticks on chosen sides and arcs on chosen angles. */
function markedTriangle(
  ox: number,
  oy: number,
  scale: number,
  opts: { sides?: number[]; angles?: number[]; right?: boolean; labels?: (string | undefined)[]; col?: string; flip?: boolean },
): string {
  const col = opts.col ?? AMB;
  // a fixed, comfortable scalene shape; right triangles get a square corner
  const shape: [number, number][] = opts.right
    ? [[0, 0], [1, 0], [0, -0.72]]
    : [[0, 0], [1.05, 0], [0.32, -0.78]];
  const P = shape.map(([x, y]) => [ox + (opts.flip ? 1.05 - x : x) * scale, oy + y * scale] as [number, number]);
  let b = polygon(P, col, `${col}1e`, 2.8);
  if (opts.right) b += rightMark(P[0][0], P[0][1], 0, 90, 11);
  const mid = (i: number, j: number): [number, number] => [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2];
  const ang = (i: number, j: number) => (Math.atan2(-(P[j][1] - P[i][1]), P[j][0] - P[i][0]) * 180) / Math.PI;
  // sides: 0 = bottom (0-1), 1 = right (1-2), 2 = left (2-0)
  const ends: [number, number][] = [[0, 1], [1, 2], [2, 0]];
  (opts.sides ?? []).forEach((si, k) => {
    const [i, j] = ends[si];
    const [mx, my] = mid(i, j);
    const a = ang(i, j);
    const n = k + 1;
    for (let t = 0; t < n; t++) {
      const off = (t - (n - 1) / 2) * 6;
      b += TICK(mx + Math.cos(rad(a)) * off, my - Math.sin(rad(a)) * off, a, EMR);
    }
  });
  (opts.angles ?? []).forEach((vi, k) => {
    const [i, j] = [[1, 2], [2, 0], [0, 1]][vi];
    const a1 = ang(vi, i);
    let d = ang(vi, j) - a1;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    const n = k + 1;
    for (let t = 0; t < n; t++) {
      b += path(arcPath(P[vi][0], P[vi][1], 20 + t * 5, a1, a1 + d), SKY, 2);
    }
  });
  (opts.labels ?? []).forEach((t, si) => {
    if (!t) return;
    const [i, j] = ends[si];
    const [mx, my] = mid(i, j);
    const outward = si === 0 ? [0, 20] : si === 1 ? [20, -2] : [-20, -2];
    b += lab(mx + outward[0], my + outward[1], t, INK, 'middle', 12);
  });
  return b;
}

function drawCongruence(s: Congruence): { svg: string; alt: string } {
  const W = 360, H = 230;
  const L = s.labels ?? {};
  let b = '';
  const ok = s.ok ?? true;
  if (s.variant === 'shared') {
    // two triangles on a common side: the bridge truss / kite
    const A: [number, number] = [60, 180], C: [number, number] = [300, 180];
    const B: [number, number] = [180, 60], D: [number, number] = [180, 180];
    b += polygon([A, B, D], AMB, `${AMB}1e`, 2.8) + polygon([C, B, D], SKY, `${SKY}1e`, 2.8);
    b += line(B[0], B[1], D[0], D[1], VIO, 3.4);
    b += lab(B[0] + 14, 124, L.shared ?? 'BD', VIO, 'start', 13);
    b += lab(A[0] - 6, A[1] + 18, L.A ?? 'A', INK) + lab(C[0] + 6, C[1] + 18, L.C ?? 'C', INK);
    b += lab(B[0], B[1] - 14, L.B ?? 'B', INK) + lab(D[0], D[1] + 20, L.D ?? 'D', INK);
    b += TICK((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 45, EMR) + TICK((C[0] + B[0]) / 2, (C[1] + B[1]) / 2, 135, EMR);
    b += TICK((A[0] + D[0]) / 2, 180, 0, ROSE) + TICK((C[0] + D[0]) / 2, 180, 0, ROSE);
    b += TICK((A[0] + D[0]) / 2 + 6, 180, 0, ROSE) + TICK((C[0] + D[0]) / 2 + 6, 180, 0, ROSE);
    b += lab(W / 2, 30, s.caption ?? 'the two triangles share side BD', VIO, 'middle', 12);
    return svg(W, H, 'Two triangles meeting along a shared side BD, with matching sides tick-marked', b);
  }
  const plan: Record<string, { sides: number[]; angles: number[]; right?: boolean }> = {
    sss: { sides: [0, 1, 2], angles: [] },
    sas: { sides: [0, 1], angles: [1] },
    asa: { sides: [0], angles: [0, 1] },
    aas: { sides: [1], angles: [0, 1] },
    hl: { sides: [0, 1], angles: [], right: true },
    ssa: { sides: [0, 1], angles: [0] },
    aaa: { sides: [], angles: [0, 1, 2] },
    cpctc: { sides: [0, 1], angles: [1] },
    angles: { sides: [], angles: [] },
  };
  const p = plan[s.variant];
  const sc = 118;
  b += markedTriangle(42, 176, sc, { ...p, col: AMB, labels: [L.a, L.b, L.c] });
  b += markedTriangle(212, 176, sc, { ...p, col: SKY, labels: [L.d, L.e, L.f] });
  if (s.variant === 'angles') {
    // the vertices of the two triangles markedTriangle just drew, so a
    // measure written at a corner sits at that corner
    b += lab(30, 188, L.A, AMB, 'middle', 12) + lab(178, 188, L.B, AMB, 'middle', 12) + lab(80, 74, L.C, AMB, 'middle', 12);
    b += lab(200, 188, L.D, SKY, 'middle', 12) + lab(346, 188, L.E, SKY, 'middle', 12) + lab(250, 74, L.F, SKY, 'middle', 12);
  }
  b += lab(100, 206, L.left ?? '△ABC', AMB, 'middle', 13);
  b += lab(270, 206, L.right ?? '△DEF', SKY, 'middle', 13);
  if (!ok) {
    b += cross(W / 2, 36, 11, ROSE, 3);
    b += lab(W / 2, 64, s.caption ?? 'these marks still allow two different triangles', ROSE, 'middle', 12);
  } else if (s.caption) {
    b += lab(W / 2, 30, s.caption, INK, 'middle', 12);
  }
  return svg(W, H, `Two triangles with the matching parts marked (${s.variant.toUpperCase()})`, b);
}

// ── solids ─────────────────────────────────────────────────────────────────

function drawSolid(s: Solid): { svg: string; alt: string } {
  const W = 360, H = 250;
  const L = s.labels ?? {};
  const D = s.dims ?? {};
  let b = '';
  switch (s.variant) {
    case 'prism':
    case 'cube': {
      const cube = s.variant === 'cube';
      const l = D.l ?? (cube ? 1 : 4), w = D.w ?? (cube ? 1 : 3), h = D.h ?? (cube ? 1 : 3);
      const sc = cube ? 110 : Math.min(150 / Math.max(l, 1), 120 / Math.max(h, 1), 150 / Math.max(w, 1), 46);
      const bw = l * sc, bh = h * sc, bd = w * sc;
      const x = (W - bw - bd * 0.55) / 2, y = 190;
      const g = isoBox(x, y, bw, bh, bd);
      b += g.b;
      b += lab(x + bw / 2, y + 24, cube ? undefined : L.l, INK);
      b += lab(x - 12, y - bh / 2 + 4, cube ? undefined : L.h, INK, 'end');
      b += lab(x + bw + bd * 0.3 + 16, y - bd * 0.2 + 12, cube ? undefined : L.w, INK, 'start');
      if (cube) b += lab(x + bw / 2, y + 24, L.edge ?? L.s, INK);
      b += lab(W / 2, 40, L.v ?? L.sa, AMB, 'middle', 15);
      b += lab(W / 2, 232, s.caption, INK, 'middle', 12);
      return svg(W, H, cube ? `A cube with edge ${L.edge ?? L.s ?? ''}` : `A rectangular prism ${L.l} by ${L.w} by ${L.h}`, b);
    }
    case 'cylinder': {
      const cx = 180, top = 62, bot = 196, rx = 62, ry = 20;
      b += line(cx - rx, top, cx - rx, bot, AMB, 2.4) + line(cx + rx, top, cx + rx, bot, AMB, 2.4);
      b += `<rect x="${cx - rx}" y="${top}" width="${rx * 2}" height="${bot - top}" fill="${AMB}18" stroke="none"/>`;
      b += rimBack(cx, bot, rx, ry) + rimFront(cx, bot, rx, ry);
      b += ellipse(cx, top, rx, ry, AMB, `${AMB}10`);
      b += line(cx, top, cx + rx, top, SKY, 2.2) + dot(cx, top, 3.5, SKY);
      b += lab(cx + rx / 2, top - 8, L.r, SKY);
      b += line(cx + rx + 20, top, cx + rx + 20, bot, EMR, 2) + line(cx + rx + 15, top, cx + rx + 25, top, EMR, 2) + line(cx + rx + 15, bot, cx + rx + 25, bot, EMR, 2);
      b += lab(cx + rx + 30, (top + bot) / 2 + 4, L.h, EMR, 'start');
      b += lab(W / 2, 34, L.v, AMB, 'middle', 15);
      b += lab(W / 2, 232, s.caption, INK, 'middle', 12);
      return svg(W, H, `A cylinder of radius ${L.r} and height ${L.h}`, b);
    }
    case 'cone': {
      const cx = 176, apex = 54, bot = 196, rx = 58, ry = 18;
      b += polygon([[cx - rx, bot], [cx, apex], [cx + rx, bot]], AMB, `${AMB}1e`, 2.4);
      b += rimBack(cx, bot, rx, ry) + rimFront(cx, bot, rx, ry);
      b += line(cx, apex, cx, bot, EMR, 2, '5 4') + rightMark(cx, bot, 0, 90, 10);
      b += line(cx, bot, cx + rx, bot, SKY, 2.2);
      b += lab(cx + rx / 2, bot - 10, L.r, SKY);
      b += lab(cx - 10, (apex + bot) / 2, L.h, EMR, 'end');
      b += lab(W / 2, 34, L.v, AMB, 'middle', 15);
      b += lab(W / 2, 234, s.caption, INK, 'middle', 12);
      return svg(W, H, `A cone of radius ${L.r} and height ${L.h}`, b);
    }
    case 'sphere': {
      const cx = 180, cy = 130, R = 84;
      b += circle(cx, cy, R, AMB, `${AMB}1e`, 2.8);
      b += ellipse(cx, cy, R, R * 0.28, AMB, 'none', 1.6, '5 4', 0.55);
      b += line(cx, cy, cx + R, cy, SKY, 2.4) + dot(cx, cy, 4, SKY);
      b += lab(cx + R / 2, cy - 8, L.r, SKY);
      b += lab(W / 2, 34, L.v, AMB, 'middle', 15);
      b += lab(W / 2, 238, s.caption, INK, 'middle', 12);
      return svg(W, H, `A sphere of radius ${L.r}`, b);
    }
    case 'pyramid': {
      const cx = 176, apex = 50, bot = 190, hw = 74, dx = 34, dy = -22;
      const FL: [number, number] = [cx - hw, bot], FR: [number, number] = [cx + hw, bot];
      const BL: [number, number] = [FL[0] + dx, FL[1] + dy], BR: [number, number] = [FR[0] + dx, FR[1] + dy];
      const AP: [number, number] = [cx + dx / 2, apex];
      b += polygon([FL, FR, BR, BL], AMB, `${AMB}12`, 1.8);
      b += line(BL[0], BL[1], BR[0], BR[1], AMB, 1.4, '4 4', 0.5);
      b += polygon([FL, FR, AP], AMB, `${AMB}26`, 2.6);
      b += line(FR[0], FR[1], AP[0], AP[1], AMB, 2.4) + line(BR[0], BR[1], AP[0], AP[1], AMB, 2);
      b += line(BL[0], BL[1], AP[0], AP[1], AMB, 1.4, '4 4', 0.5);
      const base: [number, number] = [cx + dx / 2, bot + dy / 2];
      b += line(AP[0], AP[1], base[0], base[1], EMR, 2, '5 4') + rightMark(base[0], base[1], 0, 90, 9);
      b += lab(cx, bot + 22, L.s ?? L.base, INK);
      b += lab(AP[0] + 18, apex + 8, L.h, EMR, 'start');
      b += lab(W / 2, 30, L.v, AMB, 'middle', 15);
      b += lab(W / 2, 234, s.caption, INK, 'middle', 12);
      return svg(W, H, `A pyramid on a square base of side ${L.s ?? L.base} with height ${L.h}`, b);
    }
    case 'cone-hemisphere': {
      const cx = 176, rx = 56, ry = 17, rim = 130, apex = 226;
      b += polygon([[cx - rx, rim], [cx, apex], [cx + rx, rim]], AMB, `${AMB}1e`, 2.4);
      b += path(`M ${cx - rx} ${rim} A ${rx} ${rx} 0 0 1 ${cx + rx} ${rim}`, SKY, 2.6, `${SKY}22`);
      b += ellipse(cx, rim, rx, ry, SKY, 'none', 1.6, '5 4', 0.6);
      b += line(cx, rim, cx + rx, rim, VIO, 2.2) + lab(cx + rx / 2, rim + 20, L.r, VIO);
      b += line(cx - rx - 20, rim, cx - rx - 20, apex, EMR, 2) + line(cx - rx - 25, rim, cx - rx - 15, rim, EMR, 2) + line(cx - rx - 25, apex, cx - rx - 15, apex, EMR, 2);
      b += lab(cx - rx - 30, (rim + apex) / 2, L.h, EMR, 'end');
      b += lab(cx + rx + 26, 86, L.top ?? 'hemisphere', SKY, 'start', 12);
      b += lab(cx + rx + 26, 180, L.bottom ?? 'cone', AMB, 'start', 12);
      b += lab(W / 2, 34, L.v, INK, 'middle', 14);
      return svg(W, H, `A cone of radius ${L.r} and height ${L.h} topped by a hemisphere of the same radius`, b);
    }
    case 'stack': {
      const sc = 22;
      const w1 = (D.l1 ?? 6) * sc, h1 = (D.h1 ?? 3) * sc, d1 = (D.w1 ?? 2) * sc;
      const w2 = (D.l2 ?? 4) * sc, h2 = (D.h2 ?? 2) * sc, d2 = (D.w2 ?? 2) * sc;
      const x = 70, y = 200;
      const g1 = isoBox(x, y, w1, h1, d1, AMB);
      // centred on the lower box's top face, and drawn after it so it covers it
      const x2 = x + (w1 - w2) / 2 + (d1 - d2) * 0.275;
      const g2 = isoBox(x2, y - h1, w2, h2, d2, SKY);
      b += g1.b + g2.b;
      b += lab(x + w1 / 2, y + 24, L.l1, AMB);
      b += lab(x - 12, y - h1 / 2 + 4, L.h1, AMB, 'end');
      b += lab(x + w1 + d1 * 0.3 + 14, y - d1 * 0.25 + 10, L.w1, AMB, 'start', 12);
      b += lab(x2 + w2 / 2, y - h1 - h2 - 12, L.l2, SKY);
      b += lab(x2 - 10, y - h1 - h2 / 2 + 4, L.h2, SKY, 'end');
      b += lab(W / 2, 236, s.caption ?? 'two boxes joined: add the volumes', INK, 'middle', 12);
      return svg(W, H, 'Two rectangular boxes joined into one solid', b);
    }
    case 'scale': {
      const k = D.k ?? 2;
      const sc = 26;
      const g1 = isoBox(40, 190, 2 * sc, 2 * sc, 1.6 * sc, AMB);
      const big = Math.min(k, 3);
      const g2 = isoBox(180, 190, 2 * sc * big * 0.55, 2 * sc * big * 0.55, 1.6 * sc * big * 0.55, SKY);
      b += g1.b + g2.b;
      b += lab(40 + sc, 214, L.small ?? 'edge s', AMB);
      b += lab(180 + sc * big * 0.55, 214, L.big ?? `edge ${k}s`, SKY);
      b += lab(W / 2, 36, L.ask ?? `every edge × ${k}`, VIO, 'middle', 14);
      b += lab(W / 2, 238, s.caption ?? 'area grows by the square, volume by the cube', INK, 'middle', 12);
      return svg(W, H, `A small solid and a similar one with every edge ${k} times as long`, b);
    }
    case 'two-cylinders': {
      // two cans of the same shape, different sizes: the ratio question
      const h1 = D.h1 ?? 3, h2 = D.h2 ?? 5;
      const tall = 140 / h2;
      const draw = (cx: number, h: number, col: string) => {
        const rx = (h * tall) / 3.2, ry = rx * 0.3, bot = 196, top = bot - h * tall;
        let o = `<rect x="${f(cx - rx)}" y="${f(top)}" width="${f(rx * 2)}" height="${f(h * tall)}" fill="${col}18" stroke="none"/>`;
        o += line(cx - rx, top, cx - rx, bot, col, 2.4) + line(cx + rx, top, cx + rx, bot, col, 2.4);
        o += rimBack(cx, bot, rx, ry, col) + rimFront(cx, bot, rx, ry, col) + ellipse(cx, top, rx, ry, col, `${col}10`);
        return { o, top };
      };
      const a = draw(96, h1, AMB);
      const c = draw(254, h2, SKY);
      b += a.o + c.o;
      b += lab(96, 218, L.small ?? `${h1} in tall`, AMB);
      b += lab(254, 218, L.big ?? `${h2} in tall`, SKY);
      b += lab(W / 2, 34, L.ask ?? 'same shape, different size', VIO, 'middle', 14);
      b += lab(W / 2, 240, s.caption ?? 'volume ratio = the cube of the length ratio', INK, 'middle', 12);
      return svg(W, H, `Two cylinders of the same shape, ${h1} and ${h2} units tall`, b);
    }
    case 'cubes': {
      // one box with the unit cubes ruled on the three faces you can see:
      // a wall of separate little boxes just turns to mush
      const nx = D.l ?? 4, ny = D.h ?? 3, nz = D.w ?? 5;
      // the depth foreshortens upward, so height and depth share the budget
      const u = Math.min(190 / nx, 130 / (ny + nz * 0.4), 34);
      const bw = nx * u, bh = ny * u, bd = nz * u;
      const g = isoBox((W - bw - bd * 0.55) / 2, 186, bw, bh, bd, AMB);
      b += g.b;
      const [dx, dy] = [g.dx, g.dy];
      const [ax, ay] = g.A;
      for (let i = 1; i < nx; i++) {
        b += line(ax + i * u, ay, ax + i * u, ay - bh, AMB, 1, undefined, 0.5);            // front, down
        b += line(ax + i * u + dx, ay - bh + dy, ax + i * u, ay - bh, AMB, 1, undefined, 0.5); // top, back
      }
      for (let j = 1; j < ny; j++) {
        b += line(ax, ay - j * u, ax + bw, ay - j * u, AMB, 1, undefined, 0.5);            // front, across
        b += line(ax + bw, ay - j * u, ax + bw + dx, ay - j * u + dy, AMB, 1, undefined, 0.5); // side, back
      }
      for (let k = 1; k < nz; k++) {
        const t = k / nz;
        b += line(ax + bw + dx * t, ay - bh + dy * t, ax + dx * t, ay - bh + dy * t, AMB, 1, undefined, 0.5); // top, across
        b += line(ax + bw + dx * t, ay - bh + dy * t, ax + bw + dx * t, ay + dy * t, AMB, 1, undefined, 0.5); // side, down
      }
      b += lab(W / 2, 32, L.v ?? `${nx} × ${ny} × ${nz} unit cubes`, AMB, 'middle', 14);
      b += lab(W / 2, 232, s.caption ?? 'count the cubes: that is the volume', INK, 'middle', 12);
      return svg(W, H, `A box built from ${nx} by ${ny} by ${nz} unit cubes`, b);
    }
  }
}

// ── nets ───────────────────────────────────────────────────────────────────

function drawNet(s: Net): { svg: string; alt: string } {
  const W = 360, H = 250;
  const L = s.labels ?? {};
  let b = '';
  const cell = (x: number, y: number, w: number, h: number, t: string | undefined, col: string) =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="3" fill="${col}1e" stroke="${col}" stroke-width="2.2"/>` +
    (t ? text(x + w / 2, y + h / 2 + 5, t, { size: 12, fill: col }) : '');
  if (s.variant === 'cube') {
    // a cross: one column of four, one square either side of the second.
    // It sits left of centre so the count has a column of its own.
    const u = 48, x0 = 126, y0 = 44;
    const places: [number, number, string][] = [
      [x0, y0, '1'], [x0, y0 + u, '2'], [x0, y0 + 2 * u, '3'], [x0, y0 + 3 * u, '4'],
      [x0 - u, y0 + u, '5'], [x0 + u, y0 + u, '6'],
    ];
    places.forEach(([x, y, t]) => { b += cell(x, y, u, u, t, AMB); });
    b += lab(x0 + u / 2, 30, L.title ?? 'a cube unfolded', INK, 'middle', 13);
    b += lines(292, 128, wrap(L.count ?? '6 faces', 14, 2), SKY, 12);
    b += lab(W / 2, 246, s.caption, INK, 'middle', 12);
    return svg(W, H, 'A net of a cube: six squares in a cross', b);
  }
  // rectangular prism: two rows — the four sides, plus top and bottom
  const uw = 58, uh = 46, x0 = 62, y0 = 86;
  const side = [L.l ?? 'l', L.w ?? 'w', L.l ?? 'l', L.w ?? 'w'];
  side.forEach((t, i) => { b += cell(x0 + i * uw, y0, uw, uh, t, AMB); });
  b += cell(x0, y0 - uh, uw, uh, L.top ?? 'top', SKY);
  b += cell(x0, y0 + uh, uw, uh, L.bottom ?? 'bottom', SKY);
  b += lab(W / 2, 26, L.title ?? 'the box unfolded: every face, flat', INK, 'middle', 13);
  b += lab(x0 + 4 * uw + 14, y0 + uh / 2 + 4, L.h ?? 'h', EMR, 'start', 12);
  b += line(x0 + 4 * uw + 6, y0, x0 + 4 * uw + 6, y0 + uh, EMR, 2);
  b += lab(W / 2, 220, L.sa, AMB, 'middle', 14);
  b += lab(W / 2, 240, s.caption ?? 'surface area = the area of all six faces', INK, 'middle', 12);
  return svg(W, H, 'A net of a rectangular prism: four side faces in a row with the top and bottom', b);
}

// ── logic ──────────────────────────────────────────────────────────────────

function drawLogic(s: Logic): { svg: string; alt: string } {
  const W = 360, H = 230;
  let b = '';
  const P = s.p ?? 'P', Q = s.q ?? 'Q';
  const pair = (y: number, left: string, right: string, lcol: string, rcol: string, tag?: string) => {
    let o = '';
    const lw = 138, rw = 138;
    const ll = wrap(left, 19, 3), rl = wrap(right, 19, 3);
    const h = Math.max(46, 20 + Math.max(ll.length, rl.length) * 16);
    const wash = (c: string) => (c === INK ? 'none' : `${c}14`);
    o += `<rect x="18" y="${f(y)}" width="${lw}" height="${f(h)}" rx="9" fill="${wash(lcol)}" stroke="${lcol}" stroke-width="2"/>`;
    o += lines(18 + lw / 2, y + h / 2 - ((ll.length - 1) * 16) / 2 + 4, ll, lcol, 12);
    o += `<rect x="${f(W - 18 - rw)}" y="${f(y)}" width="${rw}" height="${f(h)}" rx="9" fill="${wash(rcol)}" stroke="${rcol}" stroke-width="2"/>`;
    o += lines(W - 18 - rw / 2, y + h / 2 - ((rl.length - 1) * 16) / 2 + 4, rl, rcol, 12);
    o += arrow(18 + lw + 6, y + h / 2, W - 18 - rw - 6, y + h / 2, INK, 2.2);
    if (tag) o += lab(W / 2, y - 8, tag, INK, 'middle', 11);
    return { o, h };
  };
  switch (s.variant) {
    case 'conditional': {
      const r = pair(70, P, Q, s.mark === 'q' ? INK : AMB, s.mark === 'q' ? AMB : INK);
      b += r.o;
      b += lab(87, 54, 'hypothesis (if …)', s.mark === 'q' ? INK : AMB, 'middle', 11);
      b += lab(W - 87, 54, 'conclusion (then …)', s.mark === 'q' ? AMB : INK, 'middle', 11);
      b += lab(W / 2, 32, s.caption ?? 'every "if … then" has these two halves', INK, 'middle', 12);
      return svg(W, H, 'An if-then statement split into its hypothesis and its conclusion', b);
    }
    case 'converse':
    case 'inverse':
    case 'contrapositive': {
      const neg = s.variant !== 'converse';
      const swap = s.variant !== 'inverse';
      const p2 = neg ? `not ${P}` : P;
      const q2 = neg ? `not ${Q}` : Q;
      const r1 = pair(58, P, Q, AMB, SKY, 'original');
      b += r1.o;
      const y2 = 58 + r1.h + 34;
      const r2 = swap ? pair(y2, q2, p2, SKY, AMB, s.variant) : pair(y2, p2, q2, AMB, SKY, s.variant);
      b += r2.o;
      if (swap) {
        b += path(`M 150 ${f(58 + r1.h)} C 120 ${f(y2 - 10)} 250 ${f(58 + r1.h + 8)} 250 ${f(y2)}`, VIO, 1.8, 'none', '5 4');
        b += path(`M 250 ${f(58 + r1.h)} C 280 ${f(y2 - 10)} 110 ${f(58 + r1.h + 8)} 110 ${f(y2)}`, VIO, 1.8, 'none', '5 4');
      }
      b += lab(W / 2, 28, s.caption ?? (swap ? 'swap the two halves' : 'negate both halves'), VIO, 'middle', 12);
      return svg(W, H, `An if-then statement and its ${s.variant}`, b);
    }
    case 'counterexample': {
      const cl = wrap(s.claim ?? 'every … is …', 40, 2);
      b += `<rect x="20" y="28" width="${W - 40}" height="${f(20 + cl.length * 17)}" rx="10" fill="${SKY}10" stroke="${SKY}" stroke-width="2"/>`;
      b += lines(W / 2, 50, cl, SKY, 13);
      const y0 = 34 + cl.length * 17 + 22;
      b += lab(W / 2, y0, 'one example that breaks it:', INK, 'middle', 12);
      const items = s.items ?? ['?'];
      const cw = Math.min(120, (W - 60) / items.length);
      items.forEach((t, i) => {
        const x = W / 2 - (items.length * cw) / 2 + i * cw;
        b += `<rect x="${f(x + 6)}" y="${f(y0 + 14)}" width="${f(cw - 12)}" height="52" rx="10" fill="${ROSE}12" stroke="${ROSE}" stroke-width="2.4"/>`;
        b += text(x + cw / 2, y0 + 48, t, { size: 18, fill: ROSE });
      });
      b += cross(W / 2 - 74, y0 + 88, 7, ROSE);
      b += lab(W / 2 + 8, y0 + 92, 'so the claim is false', ROSE, 'middle', 13);
      return svg(W, H, `A claim with a counterexample that makes it false`, b);
    }
    case 'chain': {
      const items = s.items ?? ['AB', 'CD', 'EF'];
      const cw = 82, gap = 32;
      const total = items.length * cw + (items.length - 1) * gap;
      const x0 = (W - total) / 2;
      items.forEach((t, i) => {
        const x = x0 + i * (cw + gap);
        b += box(x, 74, cw, 44, t, i === 0 || i === items.length - 1 ? AMB : SKY, 14);
        if (i < items.length - 1) b += text(x + cw + gap / 2, 102, '=', { size: 20, fill: INK });
      });
      b += path(`M ${f(x0 + 20)} 136 C ${f(W / 2)} 180 ${f(W / 2)} 180 ${f(x0 + total - 20)} 136`, EMR, 2.4, 'none', '6 4');
      b += lab(W / 2, 200, s.caption ?? 'so the first equals the last', EMR, 'middle', 13);
      b += lab(W / 2, 46, 'each link is given', INK, 'middle', 12);
      return svg(W, H, `A chain of equal quantities: ${items.join(' = ')}`, b);
    }
    case 'steps': {
      const items = s.items ?? [];
      items.forEach((t, i) => {
        const y = 40 + i * 44;
        b += `<rect x="24" y="${f(y)}" width="${W - 48}" height="36" rx="8" fill="${i === items.length - 1 ? `${EMR}14` : 'none'}" stroke="${i === items.length - 1 ? EMR : INK}" stroke-width="${i === items.length - 1 ? 2.2 : 1.6}" opacity="${i === items.length - 1 ? 1 : 0.6}"/>`;
        b += text(W / 2, y + 23, t, { size: 13, fill: i === items.length - 1 ? EMR : INK });
        if (i < items.length - 1) b += arrow(W / 2, y + 38, W / 2, y + 42, INK, 1.6);
      });
      return svg(W, H, 'The steps of a short two-column proof, in order', b);
    }
  }
}

// ── a circle from its equation ─────────────────────────────────────────────

function drawCircleEq(s: CircleEq): { svg: string; alt: string } {
  const W = 320, H = 300;
  const L = s.labels ?? {};
  const span = Math.max(Math.abs(s.h) + s.r, Math.abs(s.k) + s.r) + 2;
  const u = 120 / span;
  const cx = 160, cy = 168;
  const X = (v: number) => cx + v * u, Y = (v: number) => cy - v * u;
  let b = '';
  const gstep = u < 16 ? 2 : 1;
  for (let v = -Math.floor(span); v <= Math.floor(span); v += gstep) {
    if (v === 0) continue;
    b += line(X(v), cy - 128, X(v), cy + 128, INK, 0.8, undefined, 0.16);
    b += line(cx - 132, Y(v), cx + 132, Y(v), INK, 0.8, undefined, 0.16);
  }
  b += arrow(cx - 136, cy, cx + 136, cy, INK, 1.6) + arrow(cx, cy + 132, cx, cy - 132, INK, 1.6);
  b += text(cx + 132, cy + 18, 'x', { size: 12, op: 0.6 }) + text(cx - 14, cy - 126, 'y', { size: 12, op: 0.6 });
  b += circle(X(s.h), Y(s.k), s.r * u, AMB, `${AMB}14`, 3);
  b += dot(X(s.h), Y(s.k), 5.5, ROSE);
  b += line(X(s.h), Y(s.k), X(s.h + s.r), Y(s.k), SKY, 2.4);
  b += lab(X(s.h + s.r / 2), Y(s.k) - 9, L.r ?? `r = ${s.r}`, SKY);
  b += lab(X(s.h), Y(s.k) + 20, L.centre ?? `(${s.h}, ${s.k})`, ROSE);
  b += lab(W / 2, 26, L.eq, INK, 'middle', 14);
  return svg(W, H, `A circle of radius ${s.r} centred at (${s.h}, ${s.k}) on a coordinate grid`, b);
}

// ── composite areas ────────────────────────────────────────────────────────

function drawComposite(s: Composite): { svg: string; alt: string } {
  const W = 360, H = 240;
  const D = s.dims;
  const L = s.labels ?? {};
  let b = '';
  const rect = (x: number, y: number, w: number, h: number, col: string, fill = 0x1e) =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${col}${fill.toString(16)}" stroke="${col}" stroke-width="2.6"/>`;
  switch (s.variant) {
    case 'side-by-side': {
      const { w1, h1, w2, h2 } = D as Record<string, number>;
      const sc = Math.min(250 / (w1 + w2), 130 / Math.max(h1, h2));
      const x0 = (W - (w1 + w2) * sc) / 2, y0 = 190;
      b += rect(x0, y0 - h1 * sc, w1 * sc, h1 * sc, AMB);
      b += rect(x0 + w1 * sc, y0 - h2 * sc, w2 * sc, h2 * sc, SKY);
      b += lab(x0 + (w1 * sc) / 2, y0 + 20, L.w1, AMB) + lab(x0 - 10, y0 - (h1 * sc) / 2 + 4, L.h1, AMB, 'end');
      b += lab(x0 + w1 * sc + (w2 * sc) / 2, y0 + 20, L.w2, SKY);
      b += lab(x0 + (w1 + w2) * sc + 10, y0 - (h2 * sc) / 2 + 4, L.h2, SKY, 'start');
      b += lab(W / 2, 36, L.total ?? 'total area = ?', INK, 'middle', 14);
      return svg(W, H, `Two rectangles side by side: ${L.w1} by ${L.h1} and ${L.w2} by ${L.h2}`, b);
    }
    case 'stacked': {
      const { w1, h1, w2, h2 } = D as Record<string, number>;
      const sc = Math.min(230 / Math.max(w1, w2), 120 / (h1 + h2));
      const y0 = 200, x0 = (W - w1 * sc) / 2;
      b += rect(x0, y0 - h1 * sc, w1 * sc, h1 * sc, AMB);
      const x2 = (W - w2 * sc) / 2;
      b += rect(x2, y0 - h1 * sc - h2 * sc, w2 * sc, h2 * sc, SKY);
      b += lab(x0 + (w1 * sc) / 2, y0 + 20, L.w1, AMB) + lab(x0 - 10, y0 - (h1 * sc) / 2 + 4, L.h1, AMB, 'end');
      b += lab(x2 + (w2 * sc) / 2, y0 - h1 * sc - h2 * sc - 10, L.w2, SKY);
      b += lab(x2 - 10, y0 - h1 * sc - (h2 * sc) / 2 + 4, L.h2, SKY, 'end');
      b += lab(W / 2, 34, L.total ?? 'total area = ?', INK, 'middle', 14);
      return svg(W, H, `A ${L.w2} by ${L.h2} rectangle stacked on a ${L.w1} by ${L.h1} rectangle`, b);
    }
    case 'cut-out':
    case 'inside': {
      const { w, h, cw, ch } = D as Record<string, number>;
      const sc = Math.min(240 / w, 130 / h);
      const x0 = (W - w * sc) / 2, y0 = 190;
      b += rect(x0, y0 - h * sc, w * sc, h * sc, AMB);
      const ix = x0 + (s.variant === 'cut-out' ? w * sc * 0.2 : 0);
      const iy = y0 - ch * sc - (s.variant === 'cut-out' ? h * sc * 0.22 : 0);
      b += `<rect x="${f(ix)}" y="${f(iy)}" width="${f(cw * sc)}" height="${f(ch * sc)}" fill="${ROSE}22" stroke="${ROSE}" stroke-width="2.6"${s.variant === 'cut-out' ? ' stroke-dasharray="6 4"' : ''}/>`;
      b += lab(x0 + (w * sc) / 2, y0 + 20, L.w, AMB) + lab(x0 - 10, y0 - (h * sc) / 2 + 4, L.h, AMB, 'end');
      b += lab(ix + (cw * sc) / 2, iy - 8, L.cw, ROSE, 'middle', 12);
      b += lab(ix + cw * sc + 8, iy + (ch * sc) / 2 + 4, L.ch, ROSE, 'start', 12);
      b += lab(W / 2, 34, L.total ?? (s.variant === 'cut-out' ? 'area left = ?' : 'area outside the inner piece = ?'), INK, 'middle', 13);
      return svg(W, H, `A ${L.w} by ${L.h} rectangle with a ${L.cw} by ${L.ch} piece ${s.variant === 'cut-out' ? 'cut out' : 'inside it'}`, b);
    }
    case 'house': {
      const { w, h, rh } = D as Record<string, number>;
      const sc = Math.min(210 / w, 110 / (h + rh));
      const x0 = (W - w * sc) / 2, y0 = 200;
      b += rect(x0, y0 - h * sc, w * sc, h * sc, AMB);
      b += polygon([[x0, y0 - h * sc], [x0 + w * sc, y0 - h * sc], [x0 + (w * sc) / 2, y0 - h * sc - rh * sc]], SKY, `${SKY}1e`, 2.6);
      b += line(x0 + (w * sc) / 2, y0 - h * sc, x0 + (w * sc) / 2, y0 - h * sc - rh * sc, EMR, 1.8, '5 4');
      b += lab(x0 + (w * sc) / 2, y0 + 20, L.w, AMB) + lab(x0 - 10, y0 - (h * sc) / 2 + 4, L.h, AMB, 'end');
      b += lab(x0 + (w * sc) / 2 + 12, y0 - h * sc - (rh * sc) / 2 + 4, L.rh, EMR, 'start', 12);
      b += lab(W / 2, 34, L.total ?? 'total area = ?', INK, 'middle', 14);
      return svg(W, H, `A rectangle ${L.w} by ${L.h} with a triangular roof of height ${L.rh}`, b);
    }
    case 'tee': {
      const { w1, h1, w2, h2 } = D as Record<string, number>;
      const sc = Math.min(210 / Math.max(w1, w2), 110 / (h1 + h2));
      const y0 = 196, topY = y0 - h2 * sc - h1 * sc;
      const x1 = (W - w1 * sc) / 2;
      b += rect(x1, topY, w1 * sc, h1 * sc, AMB);
      const x2 = (W - w2 * sc) / 2;
      b += rect(x2, topY + h1 * sc, w2 * sc, h2 * sc, SKY);
      b += lab(x1 + (w1 * sc) / 2, topY - 10, L.w1, AMB) + lab(x1 - 10, topY + (h1 * sc) / 2 + 4, L.h1, AMB, 'end');
      b += lab(x2 + (w2 * sc) / 2, y0 + 20, L.w2, SKY) + lab(x2 + w2 * sc + 10, topY + h1 * sc + (h2 * sc) / 2 + 4, L.h2, SKY, 'start');
      b += lab(W / 2, 34, L.total ?? 'total area = ?', INK, 'middle', 14);
      return svg(W, H, `A T-shape: a ${L.w1} by ${L.h1} bar over a ${L.w2} by ${L.h2} stem`, b);
    }
    case 'corner-cut': {
      const { w, h, cw, ch } = D as Record<string, number>;
      const sc = Math.min(230 / w, 120 / h);
      const x0 = (W - w * sc) / 2, y0 = 190;
      const pts: [number, number][] = [
        [x0, y0], [x0 + w * sc, y0], [x0 + w * sc, y0 - (h - ch) * sc],
        [x0 + (w - cw) * sc, y0 - (h - ch) * sc], [x0 + (w - cw) * sc, y0 - h * sc], [x0, y0 - h * sc],
      ];
      b += polygon(pts, s.perimeter ? EMR : AMB, s.perimeter ? `${EMR}10` : `${AMB}1e`, s.perimeter ? 3.4 : 2.6);
      b += path(`M ${f(x0 + (w - cw) * sc)} ${f(y0 - h * sc)} L ${f(x0 + w * sc)} ${f(y0 - h * sc)} L ${f(x0 + w * sc)} ${f(y0 - (h - ch) * sc)}`, ROSE, 1.6, 'none', '5 4', 0.7);
      b += lab(x0 + (w * sc) / 2, y0 + 20, L.w, INK) + lab(x0 - 10, y0 - (h * sc) / 2 + 4, L.h, INK, 'end');
      b += lab(x0 + (w - cw / 2) * sc, y0 - h * sc - 8, L.cw, ROSE, 'middle', 12);
      b += lab(x0 + w * sc + 8, y0 - (h - ch / 2) * sc + 4, L.ch, ROSE, 'start', 12);
      b += lab(W / 2, 34, L.total ?? (s.perimeter ? 'distance all the way round = ?' : 'area = ?'), INK, 'middle', 13);
      return svg(W, H, `An L-shape: a ${L.w} by ${L.h} rectangle with a ${L.cw} by ${L.ch} corner removed`, b);
    }
  }
}

// ── line plot ──────────────────────────────────────────────────────────────

function drawLinePlot(s: LinePlot): { svg: string; alt: string } {
  const W = 360, H = 230;
  let b = '';
  const y = 178, x0 = 50, x1 = W - 40;
  const n = s.ticks.length;
  const X = (i: number) => x0 + ((x1 - x0) * i) / Math.max(1, n - 1);
  b += arrow(x0 - 18, y, x1 + 16, y, INK, 2);
  s.ticks.forEach((t, i) => {
    b += line(X(i), y - 6, X(i), y + 6, INK, 2);
    b += text(X(i), y + 24, t, { size: 13 });
    for (let k = 0; k < s.counts[i]; k++) {
      b += cross(X(i), y - 20 - k * 17, 6, AMB, 2.4);
    }
  });
  if (s.unit) b += lab(W / 2, y + 46, s.unit, INK, 'middle', 12);
  b += lab(W / 2, 26, s.caption ?? 'one mark for each measurement', INK, 'middle', 12);
  return svg(W, H, `A line plot with ${s.counts.reduce((a, c) => a + c, 0)} marks over ${s.ticks.join(', ')}`, b);
}

// ── unit conversion ────────────────────────────────────────────────────────

function drawConvert(s: Convert): { svg: string; alt: string } {
  const W = 360, H = 210;
  let b = '';
  if (s.variant === 'pick') {
    const opts = s.options ?? [];
    b += lab(W / 2, 40, s.thing ?? '', INK, 'middle', 15);
    const cw = Math.min(104, (W - 40) / Math.max(1, opts.length));
    opts.forEach((o, i) => {
      const x = W / 2 - (opts.length * cw) / 2 + i * cw;
      b += box(x + 5, 74, cw - 10, 46, o, SKY, 13);
    });
    b += text(W / 2, 148, '?', { size: 24, fill: ROSE });
    b += lab(W / 2, 182, s.caption ?? 'which unit is the right size for it?', INK, 'middle', 12);
    return svg(W, H, `The choice of unit for measuring ${s.thing ?? 'something'}`, b);
  }
  const from = s.from ?? { n: '1', unit: 'unit' };
  const to = s.to ?? { n: '?', unit: 'unit' };
  const fit = (t: string) => (t.length > 7 ? 14 : 22);
  b += box(26, 74, 128, 56, '', AMB);
  b += text(90, 100, from.n, { size: fit(from.n), fill: AMB });
  b += text(90, 120, from.unit, { size: 12, fill: AMB });
  b += box(W - 154, 74, 128, 56, '', EMR);
  b += text(W - 90, 100, to.n, { size: fit(to.n), fill: to.n.includes('?') ? ROSE : EMR });
  b += text(W - 90, 120, to.unit, { size: 12, fill: EMR });
  b += arrow(160, 102, 200, 102, VIO, 2.4);
  b += lab(180, 60, `${s.dir ?? '×'} ${s.factor ?? ''}`, VIO, 'middle', 14);
  b += lab(W / 2, 170, s.caption, INK, 'middle', 12);
  return svg(W, H, `${from.n} ${from.unit} converted to ${to.unit}`, b);
}

// ── number pattern ─────────────────────────────────────────────────────────

function drawPattern(s: Pattern): { svg: string; alt: string } {
  const W = 360, H = s.second ? 230 : 190;
  let b = '';
  const row = (y: number, start: number, step: number, col: string, tag: string) => {
    let o = '';
    const show = Math.min(s.n, 5);
    const x0 = 44, x1 = W - 52;
    const X = (i: number) => x0 + ((x1 - x0) * i) / (show - 1 + 0.6);
    o += line(x0 - 16, y, x1 + 22, y, INK, 1.6, undefined, 0.4);
    for (let i = 0; i < show; i++) {
      const v = start + i * step;
      o += dot(X(i), y, 6, col);
      o += text(X(i), y + 22, String(v), { size: 13, fill: col });
      if (i < show - 1) {
        const mx = (X(i) + X(i + 1)) / 2;
        o += path(`M ${f(X(i))} ${f(y - 4)} Q ${f(mx)} ${f(y - 26)} ${f(X(i + 1))} ${f(y - 4)}`, col, 2);
        o += text(mx, y - 28, `+${step}`, { size: 11, fill: col });
      }
    }
    o += text(x1 + 26, y + 5, '…', { size: 16, op: 0.6 });
    o += lab(26, y + 5, tag, col, 'end', 12);
    return o;
  };
  b += row(s.second ? 92 : 108, s.start, s.step, AMB, s.second ? 'A' : '');
  if (s.second) b += row(168, s.second.start, s.second.step, SKY, 'B');
  if (s.ask) b += lab(W / 2, 38, s.ask, ROSE, 'middle', 13);
  b += lab(W / 2, H - 12, s.caption, INK, 'middle', 12);
  return svg(W, H, `A number pattern starting at ${s.start} and adding ${s.step} each step`, b);
}

// ── shape families ─────────────────────────────────────────────────────────

function shapeOutline(name: ShapeName, cx: number, cy: number, r: number, col: string): string {
  const P: Record<ShapeName, [number, number][]> = {
    square: [[-1, 1], [1, 1], [1, -1], [-1, -1]],
    rectangle: [[-1.3, 0.72], [1.3, 0.72], [1.3, -0.72], [-1.3, -0.72]],
    rhombus: [[-1.25, 0.6], [0.55, 0.6], [1.25, -0.6], [-0.55, -0.6]],
    parallelogram: [[-1.3, 0.62], [0.7, 0.62], [1.3, -0.62], [-0.7, -0.62]],
    trapezoid: [[-1.3, 0.66], [1.3, 0.66], [0.66, -0.66], [-0.66, -0.66]],
    right: [[-1, 0.8], [1, 0.8], [-1, -0.85]],
    isosceles: [[-1, 0.8], [1, 0.8], [0, -0.85]],
    equilateral: [[-1, 0.7], [1, 0.7], [0, -0.73]],
    scalene: [[-1.1, 0.8], [1.1, 0.8], [0.45, -0.8]],
    obtuse: [[-1.2, 0.7], [1.2, 0.7], [-0.75, -0.7]],
  };
  const pts = P[name].map(([x, y]) => [cx + x * r, cy + y * r] as [number, number]);
  let b = polygon(pts, col, `${col}1e`, 2.6);
  if (name === 'square' || name === 'rectangle') {
    b += rightMark(pts[3][0], pts[3][1], 0, -90, 9);
  }
  if (name === 'right') b += rightMark(pts[0][0], pts[0][1], 0, -90, 9);
  if (name === 'square' || name === 'rhombus') {
    // all four sides equal
    for (let i = 0; i < 4; i++) {
      const [a, c] = [pts[i], pts[(i + 1) % 4]];
      const ang = (Math.atan2(-(c[1] - a[1]), c[0] - a[0]) * 180) / Math.PI;
      b += TICK((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, ang, EMR);
    }
  }
  if (name === 'equilateral' || name === 'isosceles') {
    const set = name === 'equilateral' ? [0, 1, 2] : [1, 2];
    set.forEach((i) => {
      const [a, c] = [pts[i], pts[(i + 1) % 3]];
      const ang = (Math.atan2(-(c[1] - a[1]), c[0] - a[0]) * 180) / Math.PI;
      b += TICK((a[0] + c[0]) / 2, (a[1] + c[1]) / 2, ang, EMR);
    });
  }
  if (name === 'trapezoid') {
    b += TICK(cx, cy - r * 0.66, 0, SKY) + TICK(cx, cy + r * 0.66, 0, SKY);
  }
  return b;
}

function drawShapeFamily(s: ShapeFamily): { svg: string; alt: string } {
  const W = 360, H = 220;
  const items = s.items;
  let b = '';
  const cw = Math.min(118, (W - 20) / items.length);
  const r = Math.min(40, cw * 0.36);
  items.forEach((it, i) => {
    const cx = W / 2 - (items.length * cw) / 2 + i * cw + cw / 2;
    const col = it.mark === 'no' ? ROSE : it.mark === 'ask' ? VIO : AMB;
    b += shapeOutline(it.shape, cx, 100, r, col);
    if (it.name) b += lab(cx, 158, it.name, col, 'middle', 13);
    // the angles on one line under the name, so nothing lands on anything else
    if (it.angles?.length) b += lab(cx, 178, it.angles.join(' · '), INK, 'middle', 11);
    if (it.mark === 'yes') b += check(cx, 198, 8, EMR);
    if (it.mark === 'no') b += cross(cx, 198, 8, ROSE);
    if (it.mark === 'ask') b += text(cx, 204, '?', { size: 17, fill: VIO });
  });
  b += lab(W / 2, 36, s.caption, INK, 'middle', 12);
  return svg(W, H, `A row of shapes: ${items.map((i) => i.name ?? i.shape).join(', ')}`, b);
}

// ── dispatch ───────────────────────────────────────────────────────────────

export function renderMeasureFigure(fig: MeasureFigure): { svg: string; alt: string } {
  switch (fig.kind) {
    case 'segment': return drawSegment(fig);
    case 'congruence': return drawCongruence(fig);
    case 'solid': return drawSolid(fig);
    case 'net': return drawNet(fig);
    case 'logic': return drawLogic(fig);
    case 'circle-eq': return drawCircleEq(fig);
    case 'composite': return drawComposite(fig);
    case 'lineplot': return drawLinePlot(fig);
    case 'convert': return drawConvert(fig);
    case 'pattern': return drawPattern(fig);
    case 'shapes': return drawShapeFamily(fig);
  }
}
