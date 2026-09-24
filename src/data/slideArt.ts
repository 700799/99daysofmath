/**
 * The drawings that sit on a lesson slide.
 *
 * A slide figure has to BE the mathematics — the curve the rule describes, the
 * triangle the ratio is read off, the machine the function is. Ink is
 * `currentColor`, so a figure follows the card's text colour in light and dark
 * the way the problem diagrams do; the accents are fixed hues chosen to read
 * against both. One canvas, 400×260, so every figure scales the same way.
 */
import type { SlideArt } from './lessonSlides/types';

export const INK = 'currentColor';
export const AMB = '#F59E0B';
export const SKY = '#0EA5E9';
export const EMR = '#10B981';
export const ROSE = '#F43F5E';
export const VIO = '#8B5CF6';

export const W = 400;
export const H = 260;

const f = (n: number) => (Math.round(n * 10) / 10).toString();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const rad = (d: number) => (d * Math.PI) / 180;

// ── primitives ─────────────────────────────────────────────────────────────

export function text(
  x: number,
  y: number,
  s: string,
  o: { size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; op?: number } = {},
): string {
  const { size = 13, fill = INK, anchor = 'middle', op } = o;
  return `<text x="${f(x)}" y="${f(y)}" font-size="${size}" font-weight="700" fill="${fill}" text-anchor="${anchor}"${op !== undefined ? ` opacity="${op}"` : ''}>${esc(s)}</text>`;
}

export function line(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2, dash?: string, op?: number): string {
  return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}${op !== undefined ? ` opacity="${op}"` : ''}/>`;
}

export function circle(cx: number, cy: number, r: number, stroke = INK, fill = 'none', w = 2, dash?: string): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

export function dot(cx: number, cy: number, r = 4.5, fill = INK): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"/>`;
}

export function path(d: string, stroke = INK, w = 2.4, fill = 'none', dash?: string, op?: number): string {
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}${op !== undefined ? ` opacity="${op}"` : ''}/>`;
}

export function polygon(pts: [number, number][], stroke = INK, fill = 'none', w = 2.4): string {
  return `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
}

export function rect(x: number, y: number, w: number, h: number, stroke = INK, fill = 'none', sw = 2, r = 6): string {
  return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

/** Arrowhead at (x2,y2), pointing along (x1,y1)→(x2,y2). */
export function head(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2, L = 8): string {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = 0.5;
  return (
    line(x2 - L * Math.cos(a - s), y2 - L * Math.sin(a - s), x2, y2, stroke, w) +
    line(x2 - L * Math.cos(a + s), y2 - L * Math.sin(a + s), x2, y2, stroke, w)
  );
}

export function arrow(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2): string {
  return line(x1, y1, x2, y2, stroke, w) + head(x1, y1, x2, y2, stroke, w);
}

/** A small square marking a right angle at (x,y), opening along dirA and dirB. */
export function rightMark(x: number, y: number, dirA: number, dirB: number, s = 11): string {
  const [ax, ay] = [Math.cos(rad(dirA)) * s, -Math.sin(rad(dirA)) * s];
  const [bx, by] = [Math.cos(rad(dirB)) * s, -Math.sin(rad(dirB)) * s];
  return path(`M ${f(x + ax)} ${f(y + ay)} L ${f(x + ax + bx)} ${f(y + ay + by)} L ${f(x + bx)} ${f(y + by)}`, INK, 1.8);
}

/** Arc from a1 to a2 degrees (counterclockwise, y up) around (cx, cy). */
export function arcPath(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const p = (a: number) => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
  const [x1, y1] = p(a1);
  const [x2, y2] = p(a2);
  const d = a2 - a1;
  return `M ${f(x1)} ${f(y1)} A ${f(r)} ${f(r)} 0 ${Math.abs(d) > 180 ? 1 : 0} ${d > 0 ? 0 : 1} ${f(x2)} ${f(y2)}`;
}

/** Wrap a body in the shared canvas. */
export function art(alt: string, body: string, caption?: string): SlideArt {
  return {
    alt,
    caption,
    svg:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" ` +
      `font-family="Nunito, ui-rounded, system-ui, sans-serif" stroke-linecap="round" ` +
      `stroke-linejoin="round">${body}</svg>`,
  };
}

// ── a set of axes you can plot on ──────────────────────────────────────────

export interface Range {
  x: [number, number];
  y: [number, number];
}

export interface Axes {
  X: (v: number) => number;
  Y: (v: number) => number;
  body: string;
  /** Sample `fn` across the x range and return a path, clipped to the y range. */
  curve: (fn: (x: number) => number, stroke?: string, w?: number, dash?: string) => string;
}

/**
 * Axes with an arrow on each end and optional tick labels. `pad` leaves room
 * at the top for a headline label on the figure itself.
 */
export function axes(
  r: Range,
  o: { xLabel?: string; yLabel?: string; ticks?: { x?: number[]; y?: number[] }; grid?: boolean; pad?: number; tickText?: (v: number, axis: 'x' | 'y') => string } = {},
): Axes {
  const top = o.pad ?? 26;
  const L = 34, R = 18, B = 34;
  const X = (v: number) => L + ((v - r.x[0]) / (r.x[1] - r.x[0])) * (W - L - R);
  const Y = (v: number) => H - B - ((v - r.y[0]) / (r.y[1] - r.y[0])) * (H - B - top);
  let b = '';
  if (o.grid) {
    for (const v of o.ticks?.x ?? []) b += line(X(v), Y(r.y[0]), X(v), Y(r.y[1]), INK, 1, undefined, 0.14);
    for (const v of o.ticks?.y ?? []) b += line(X(r.x[0]), Y(v), X(r.x[1]), Y(v), INK, 1, undefined, 0.14);
  }
  const y0 = Math.min(Math.max(0, r.y[0]), r.y[1]);
  const x0 = Math.min(Math.max(0, r.x[0]), r.x[1]);
  b += arrow(X(r.x[0]), Y(y0), X(r.x[1]) + 8, Y(y0), INK, 1.8);
  b += arrow(X(x0), Y(r.y[0]), X(x0), Y(r.y[1]) - 8, INK, 1.8);
  const tt = o.tickText ?? ((v: number) => String(v));
  for (const v of o.ticks?.x ?? []) {
    if (v === x0) continue;
    b += line(X(v), Y(y0) - 4, X(v), Y(y0) + 4, INK, 1.6, undefined, 0.6);
    b += text(X(v), Y(y0) + 18, tt(v, 'x'), { size: 11, op: 0.7 });
  }
  for (const v of o.ticks?.y ?? []) {
    if (v === y0) continue;
    b += line(X(x0) - 4, Y(v), X(x0) + 4, Y(v), INK, 1.6, undefined, 0.6);
    b += text(X(x0) - 8, Y(v) + 4, tt(v, 'y'), { size: 11, op: 0.7, anchor: 'end' });
  }
  if (o.xLabel) b += text(X(r.x[1]) + 6, Y(y0) - 8, o.xLabel, { size: 12, op: 0.75, anchor: 'end' });
  if (o.yLabel) b += text(X(x0) + 14, Y(r.y[1]) - 2, o.yLabel, { size: 12, op: 0.75, anchor: 'start' });

  const curve = (fn: (x: number) => number, stroke = AMB, w = 2.8, dash?: string) => {
    const n = 160;
    const segs: string[] = [];
    let cur: string[] = [];
    for (let i = 0; i <= n; i++) {
      const x = r.x[0] + ((r.x[1] - r.x[0]) * i) / n;
      const y = fn(x);
      if (!Number.isFinite(y) || y < r.y[0] - 1e-9 || y > r.y[1] + 1e-9) {
        if (cur.length > 1) segs.push(cur.join(' '));
        cur = [];
        continue;
      }
      cur.push(`${cur.length ? 'L' : 'M'} ${f(X(x))} ${f(Y(y))}`);
    }
    if (cur.length > 1) segs.push(cur.join(' '));
    return segs.map((d) => path(d, stroke, w, 'none', dash)).join('');
  };

  return { X, Y, body: b, curve };
}

// ── whole figures the Precalculus decks reach for again and again ──────────

/** input → [ rule ] → output. The picture of what a function IS. */
export function machine(
  inLabel: string,
  ruleLabel: string,
  outLabel: string,
  o: { caption?: string; title?: string; alt?: string } = {},
): SlideArt {
  const cy = 140;
  let b = o.title ? text(W / 2, 34, o.title, { size: 13, fill: VIO }) : '';
  b += rect(24, cy - 26, 74, 52, SKY, `${SKY}1e`, 2.4, 12);
  b += text(61, cy + 6, inLabel, { size: 17, fill: SKY });
  b += arrow(104, cy, 144, cy, INK, 2.4);
  b += rect(150, cy - 34, 104, 68, AMB, `${AMB}1e`, 2.8, 14);
  b += text(202, cy + 7, ruleLabel, { size: 17, fill: AMB });
  b += arrow(260, cy, 300, cy, INK, 2.4);
  b += rect(306, cy - 26, 74, 52, EMR, `${EMR}1e`, 2.4, 12);
  b += text(343, cy + 6, outLabel, { size: 17, fill: EMR });
  b += text(61, cy - 38, 'input', { size: 11, op: 0.7 });
  b += text(202, cy - 46, 'rule', { size: 11, op: 0.7 });
  b += text(343, cy - 38, 'output', { size: 11, op: 0.7 });
  return art(o.alt ?? `A function machine: ${inLabel} goes in, the rule ${ruleLabel} is applied, ${outLabel} comes out`, b, o.caption);
}

/** A right triangle with the sides and the acute angle named. */
export function rightTriangle(
  o: { opp?: string; adj?: string; hyp?: string; angle?: string; shape?: { opp: number; adj: number }; caption?: string; alt?: string; names?: boolean } = {},
): SlideArt {
  const sh = o.shape ?? { opp: 3, adj: 4 };
  const sc = Math.min(250 / sh.adj, 150 / sh.opp);
  const Ax = 70, Ay = 210;
  const Cx = Ax + sh.adj * sc, Cy = Ay;
  const Bx = Cx, By = Ay - sh.opp * sc;
  let b = polygon([[Ax, Ay], [Cx, Cy], [Bx, By]], AMB, `${AMB}18`, 2.8);
  b += rightMark(Cx, Cy, 180, 90, 12);
  if (o.adj) b += text((Ax + Cx) / 2, Ay + 20, o.adj, { size: 13, fill: EMR });
  if (o.opp) b += text(Cx + 12, (Cy + By) / 2 + 4, o.opp, { size: 13, fill: SKY, anchor: 'start' });
  if (o.hyp) b += text((Ax + Bx) / 2 - 14, (Ay + By) / 2 - 6, o.hyp, { size: 13, fill: VIO, anchor: 'end' });
  if (o.angle) {
    const a = Math.atan2(Ay - By, Bx - Ax) * (180 / Math.PI);
    b += path(arcPath(Ax, Ay, 30, 0, a), ROSE, 2.4);
    b += text(Ax + 40, Ay - 12, o.angle, { size: 14, fill: ROSE, anchor: 'start' });
  }
  if (o.names) b += text((Ax + Cx) / 2, 34, 'opposite · adjacent · hypotenuse', { size: 11, op: 0.65 });
  return art(o.alt ?? `A right triangle with legs ${o.adj ?? ''} and ${o.opp ?? ''} and hypotenuse ${o.hyp ?? ''}`, b, o.caption);
}

/** The unit circle with one angle drawn and its point named. */
export function unitCircle(
  deg: number,
  o: { label?: string; point?: string; legs?: boolean; caption?: string; alt?: string } = {},
): SlideArt {
  const cx = 200, cy = 132, R = 92;
  const px = cx + R * Math.cos(rad(deg));
  const py = cy - R * Math.sin(rad(deg));
  let b = circle(cx, cy, R, INK, 'none', 1.8, '4 5');
  b += arrow(cx - R - 20, cy, cx + R + 20, cy, INK, 1.6);
  b += arrow(cx, cy + R + 20, cx, cy - R - 20, INK, 1.6);
  if (o.legs) {
    b += line(px, py, px, cy, SKY, 2.4, '5 4');
    b += line(cx, cy, px, cy, EMR, 3);
    b += text((cx + px) / 2, cy + (py <= cy ? 18 : -8), 'cos θ', { size: 12, fill: EMR });
    b += text(px + (px >= cx ? 8 : -8), (py + cy) / 2 + 4, 'sin θ', { size: 12, fill: SKY, anchor: px >= cx ? 'start' : 'end' });
  }
  b += line(cx, cy, px, py, AMB, 3);
  b += path(arcPath(cx, cy, 30, 0, deg), ROSE, 2.4);
  b += dot(px, py, 5, AMB);
  if (o.label) {
    const [lx, ly] = [cx + 44 * Math.cos(rad(deg / 2)), cy - 44 * Math.sin(rad(deg / 2))];
    b += text(lx, ly + 4, o.label, { size: 13, fill: ROSE });
  }
  if (o.point) {
    const right = Math.cos(rad(deg)) >= 0;
    b += text(px + (right ? 10 : -10), py - 10, o.point, { size: 12, fill: AMB, anchor: right ? 'start' : 'end' });
  }
  b += text(46, 250, 'radius 1', { size: 11, op: 0.65, anchor: 'start' });
  return art(o.alt ?? `The unit circle with an angle of ${deg} degrees drawn from the positive x-axis`, b, o.caption);
}

/** A number line with marks on it. */
export function numberLine(
  lo: number,
  hi: number,
  marks: { at: number; label?: string; color?: string }[],
  o: { step?: number; caption?: string; alt?: string; title?: string } = {},
): SlideArt {
  const y = 150, x0 = 40, x1 = W - 40;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  let b = o.title ? text(W / 2, 40, o.title, { size: 13, fill: VIO }) : '';
  b += arrow(x0 - 16, y, x1 + 16, y, INK, 2) + arrow(x1 + 16, y, x0 - 16, y, INK, 2);
  const step = o.step ?? Math.max(1, Math.round((hi - lo) / 10));
  for (let v = Math.ceil(lo); v <= hi; v += step) {
    b += line(X(v), y - 5, X(v), y + 5, INK, 1.5, undefined, 0.55);
    b += text(X(v), y + 22, String(v), { size: 11, op: 0.65 });
  }
  for (const m of marks) {
    const col = m.color ?? AMB;
    b += dot(X(m.at), y, 6, col);
    if (m.label) b += text(X(m.at), y - 16, m.label, { size: 13, fill: col });
  }
  return art(o.alt ?? `A number line from ${lo} to ${hi} with points marked on it`, b, o.caption);
}

/** Bars climbing, so "adds the same" and "multiplies by the same" look different. */
export function bars(
  series: { name: string; vals: number[]; color?: string }[],
  o: { labels?: string[]; caption?: string; alt?: string; title?: string } = {},
): SlideArt {
  const base = 206, top = 58;
  const n = series[0].vals.length;
  const max = Math.max(...series.flatMap((s) => s.vals));
  const groupW = (W - 70) / n;
  const bw = Math.min(22, (groupW - 10) / series.length);
  let b = o.title ? text(W / 2, 30, o.title, { size: 13, fill: VIO }) : '';
  b += line(40, base, W - 24, base, INK, 1.8, undefined, 0.6);
  series.forEach((s, si) => {
    const col = s.color ?? (si === 0 ? SKY : AMB);
    s.vals.forEach((v, i) => {
      const h = ((base - top) * v) / max;
      const x = 48 + i * groupW + si * (bw + 3);
      b += rect(x, base - h, bw, h, col, `${col}44`, 2, 3);
    });
    b += rect(W - 132 + si * 66, 40, 10, 10, col, `${col}44`, 2, 2);
    b += text(W - 118 + si * 66, 49, s.name, { size: 11, fill: col, anchor: 'start' });
  });
  (o.labels ?? []).forEach((t, i) => {
    b += text(48 + i * groupW + (series.length * bw) / 2, base + 18, t, { size: 11, op: 0.65 });
  });
  return art(o.alt ?? `Bar charts comparing ${series.map((s) => s.name).join(' and ')}`, b, o.caption);
}

/** An oblique triangle, for the Law of Sines and the Law of Cosines. */
export function triangle(
  o: { A?: string; B?: string; C?: string; a?: string; b?: string; c?: string; shape?: [number, number][]; caption?: string; alt?: string } = {},
): SlideArt {
  const P = o.shape ?? ([[60, 200], [330, 200], [150, 70]] as [number, number][]);
  let b = polygon(P, AMB, `${AMB}18`, 2.8);
  for (const [x, y] of P) b += dot(x, y, 4, INK);
  const mid = (i: number, j: number): [number, number] => [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2];
  // vertices A (bottom-left), B (bottom-right), C (apex)
  if (o.A) b += text(P[0][0] - 12, P[0][1] + 6, o.A, { size: 14, fill: ROSE, anchor: 'end' });
  if (o.B) b += text(P[1][0] + 12, P[1][1] + 6, o.B, { size: 14, fill: ROSE, anchor: 'start' });
  if (o.C) b += text(P[2][0], P[2][1] - 12, o.C, { size: 14, fill: ROSE });
  if (o.c) { const [x, y] = mid(0, 1); b += text(x, y + 20, o.c, { size: 13, fill: SKY }); }
  if (o.a) { const [x, y] = mid(1, 2); b += text(x + 16, y, o.a, { size: 13, fill: EMR, anchor: 'start' }); }
  if (o.b) { const [x, y] = mid(2, 0); b += text(x - 16, y, o.b, { size: 13, fill: VIO, anchor: 'end' }); }
  return art(o.alt ?? 'A triangle with its three angles and three sides labelled', b, o.caption);
}
