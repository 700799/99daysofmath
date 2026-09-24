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
// ── motion ─────────────────────────────────────────────────────────────────
// A figure that draws itself shows the ORDER of the idea: the axes, then the
// curve sweeping out, then the label arriving to name what you just watched.
// It is CSS, not SMIL, so one media query can switch all of it off for anyone
// who asks their device for less movement — and a still figure is the same
// figure, just already finished.

/** Mark a piece so it sweeps itself on, left to right. `len` is its rough length. */
export function draws(body: string, len = 900, delay = 0): string {
  return `<g class="sa-draw" style="--sa-len:${f(len)};--sa-d:${f(delay)}s">${body}</g>`;
}

/** Mark a piece so it fades and rises in, after everything before it. */
export function fades(body: string, delay = 0.35): string {
  return `<g class="sa-fade" style="--sa-d:${f(delay)}s">${body}</g>`;
}

/** Mark a piece so it beats gently — the one thing the slide wants you to see. */
export function beats(body: string): string {
  return `<g class="sa-beat">${body}</g>`;
}

/** Mark a piece so it slides in from (dx, dy). */
export function slides(body: string, dx: number, dy: number, delay = 0.3): string {
  return `<g class="sa-slide" style="--sa-x:${f(dx)}px;--sa-y:${f(dy)}px;--sa-d:${f(delay)}s">${body}</g>`;
}

const MOTION_CSS =
  '.sa-draw{stroke-dasharray:var(--sa-len);stroke-dashoffset:var(--sa-len);' +
  'animation:sa-draw 1.1s ease-out var(--sa-d,0s) forwards}' +
  '@keyframes sa-draw{to{stroke-dashoffset:0}}' +
  '.sa-fade{opacity:0;animation:sa-fade .5s ease-out var(--sa-d,0s) forwards}' +
  '@keyframes sa-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}' +
  '.sa-slide{opacity:0;animation:sa-slide .6s cubic-bezier(.2,.8,.2,1) var(--sa-d,0s) forwards}' +
  '@keyframes sa-slide{from{opacity:0;transform:translate(var(--sa-x,0),var(--sa-y,0))}to{opacity:1;transform:translate(0,0)}}' +
  '.sa-beat{animation:sa-beat 2.4s ease-in-out .8s infinite}' +
  '@keyframes sa-beat{0%,70%,100%{opacity:1}85%{opacity:.35}}' +
  '@media (prefers-reduced-motion:reduce){' +
  '.sa-draw,.sa-fade,.sa-slide,.sa-beat{animation:none;stroke-dashoffset:0;opacity:1;transform:none}}';

/**
 * Wrap a body in the shared canvas. The stylesheet ships inside every figure
 * so a drawing is still one self-contained string with nothing to fetch.
 */
export function art(alt: string, body: string, caption?: string): SlideArt {
  const styled = body.includes('sa-') ? `<style>${MOTION_CSS}</style>` : '';
  return {
    alt,
    caption,
    svg:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" ` +
      `font-family="Nunito, ui-rounded, system-ui, sans-serif" stroke-linecap="round" ` +
      `stroke-linejoin="round">${styled}${body}</svg>`,
  };
}

// ── annotation ─────────────────────────────────────────────────────────────

/**
 * A label on a leader line, pointing at a spot in the figure. `dir` says which
 * way the leader leaves the point; the label sits at the far end of it.
 */
export function callout(
  x: number,
  y: number,
  label: string,
  o: { dir?: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right'; len?: number; color?: string; size?: number } = {},
): string {
  const { dir = 'up', len = 34, color = ROSE, size = 12 } = o;
  const V: Record<string, [number, number]> = {
    up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
    'up-left': [-0.75, -0.75], 'up-right': [0.75, -0.75],
  };
  const [ux, uy] = V[dir];
  const tx = x + ux * len;
  const ty = y + uy * len;
  const anchor = ux < -0.2 ? 'end' : ux > 0.2 ? 'start' : 'middle';
  const pad = ux < -0.2 ? -6 : ux > 0.2 ? 6 : 0;
  return (
    line(x + ux * 7, y + uy * 7, tx, ty, color, 1.8) +
    dot(x, y, 3.6, color) +
    text(tx + pad, ty + (uy < -0.2 ? -3 : uy > 0.2 ? 11 : 4), label, { size, fill: color, anchor })
  );
}

/** A brace under a run, with the label beneath it — for "this bit is x". */
export function brace(x1: number, x2: number, y: number, label: string, color = INK, size = 12): string {
  return (
    line(x1, y, x2, y, color, 1.8) +
    line(x1, y - 5, x1, y + 5, color, 1.8) +
    line(x2, y - 5, x2, y + 5, color, 1.8) +
    text((x1 + x2) / 2, y + 16, label, { size, fill: color })
  );
}

/** A soft banded highlight behind part of a figure. */
export function band(x: number, y: number, w: number, h: number, color = AMB): string {
  return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="6" fill="${color}22"/>`;
}

/** A small pill of text — for a value sitting on a chart. */
export function pill(x: number, y: number, label: string, color = AMB, size = 12): string {
  const w = label.length * size * 0.62 + 14;
  return (
    `<rect x="${f(x - w / 2)}" y="${f(y - size * 0.86)}" width="${f(w)}" height="${f(size * 1.5)}" rx="${f(size * 0.75)}" fill="${color}" />` +
    `<text x="${f(x)}" y="${f(y + size * 0.34)}" font-size="${size}" font-weight="800" fill="#fff" text-anchor="middle">${esc(label)}</text>`
  );
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
  o: { opp?: string; adj?: string; hyp?: string; angle?: string; shape?: { opp: number; adj: number }; caption?: string; alt?: string; names?: boolean; title?: string } = {},
): SlideArt {
  const sh = o.shape ?? { opp: 3, adj: 4 };
  const sc = Math.min(250 / sh.adj, 150 / sh.opp);
  const Ax = 70, Ay = 210;
  const Cx = Ax + sh.adj * sc, Cy = Ay;
  const Bx = Cx, By = Ay - sh.opp * sc;
  let b = o.title ? text(W / 2, 26, o.title, { size: 13, fill: VIO }) : '';
  b += polygon([[Ax, Ay], [Cx, Cy], [Bx, By]], AMB, `${AMB}18`, 2.8);
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
  o: { step?: number; caption?: string; alt?: string; title?: string; span?: { from: number; to: number; label: string } } = {},
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
  if (o.span) {
    const a = Math.min(o.span.from, o.span.to);
    const z = Math.max(o.span.from, o.span.to);
    b += draws(line(X(a), y, X(z), y, ROSE, 4), X(z) - X(a));
    b += brace(X(a), X(z), y + 44, o.span.label, ROSE, 13);
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
  });
  // the legend is laid out from the names themselves, so a long one still fits
  const size = Math.max(9, Math.min(11, (W - 76) / series.reduce((a, s) => a + s.name.length + 4, 0) / 0.58));
  const widths = series.map((s) => s.name.length * size * 0.58 + 20);
  let lx = Math.max(40, W - 24 - widths.reduce((a, w) => a + w, 0));
  series.forEach((s, si) => {
    const col = s.color ?? (si === 0 ? SKY : AMB);
    b += rect(lx, 40, 10, 10, col, `${col}44`, 2, 2);
    b += text(lx + 15, 49, s.name, { size, fill: col, anchor: 'start' });
    lx += widths[si];
  });
  (o.labels ?? []).forEach((t, i) => {
    b += text(48 + i * groupW + (series.length * bw) / 2, base + 18, t, { size: 11, op: 0.65 });
  });
  return art(o.alt ?? `Bar charts comparing ${series.map((s) => s.name).join(' and ')}`, b, o.caption);
}

/** An oblique triangle, for the Law of Sines and the Law of Cosines. */
export function triangle(
  o: { A?: string; B?: string; C?: string; a?: string; b?: string; c?: string; shape?: [number, number][]; caption?: string; alt?: string; title?: string } = {},
): SlideArt {
  const P = o.shape ?? ([[60, 200], [330, 200], [150, 70]] as [number, number][]);
  let b = o.title ? text(W / 2, 26, o.title, { size: 13, fill: VIO }) : '';
  b += polygon(P, AMB, `${AMB}18`, 2.8);
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

// ── the charts the rest of the courses live on ─────────────────────────────

/** A dot plot: one dot per value, stacked over the scale. */
export function dotPlot(
  ticks: (string | number)[],
  counts: number[],
  o: { title?: string; caption?: string; alt?: string; unit?: string; mark?: number } = {},
): SlideArt {
  const y = 196, x0 = 48, x1 = W - 34;
  const X = (i: number) => x0 + ((x1 - x0) * i) / Math.max(1, ticks.length - 1);
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  b += line(x0 - 18, y, x1 + 14, y, INK, 2);
  ticks.forEach((t, i) => {
    b += line(X(i), y - 5, X(i), y + 5, INK, 1.6, undefined, 0.6);
    b += text(X(i), y + 20, String(t), { size: 11, op: 0.7 });
    const col = i === o.mark ? ROSE : AMB;
    for (let k = 0; k < counts[i]; k++) {
      b += fades(dot(X(i), y - 14 - k * 15, 5.5, col), 0.2 + k * 0.06 + i * 0.05);
    }
  });
  if (o.unit) b += text(W / 2, y + 40, o.unit, { size: 12, op: 0.7 });
  const n = counts.reduce((a, c) => a + c, 0);
  return art(o.alt ?? `A dot plot of ${n} values over ${ticks.join(', ')}`, b, o.caption);
}

/** A histogram: bars touching, one per interval. */
export function histogram(
  labels: string[],
  vals: number[],
  o: { title?: string; caption?: string; alt?: string; mark?: number; yLabel?: string } = {},
): SlideArt {
  const base = 196, top = 54, x0 = 48, x1 = W - 26;
  const bw = (x1 - x0) / vals.length;
  const max = Math.max(...vals);
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  b += line(x0, top - 6, x0, base, INK, 1.8) + line(x0, base, x1, base, INK, 1.8);
  vals.forEach((v, i) => {
    const h = ((base - top) * v) / max;
    const col = i === o.mark ? ROSE : SKY;
    b += slides(rect(x0 + i * bw, base - h, bw - 2, h, col, `${col}44`, 2, 3), 0, 16, 0.1 + i * 0.07);
    b += text(x0 + i * bw + bw / 2, base + 18, labels[i], { size: 10, op: 0.7 });
    b += text(x0 + i * bw + bw / 2, base - h - 7, String(v), { size: 11, fill: col });
  });
  if (o.yLabel) b += text(x0 - 10, top + 2, o.yLabel, { size: 11, op: 0.7, anchor: 'end' });
  return art(o.alt ?? `A histogram with bars ${vals.join(', ')}`, b, o.caption);
}

/** A box plot over a scale: min, Q1, median, Q3, max. */
export function boxPlot(
  five: [number, number, number, number, number],
  lo: number,
  hi: number,
  o: { title?: string; caption?: string; alt?: string; labels?: boolean; step?: number } = {},
): SlideArt {
  const [min, q1, med, q3, max] = five;
  const y = 130, x0 = 44, x1 = W - 30;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  let b = o.title ? text(W / 2, 30, o.title, { size: 13, fill: VIO }) : '';
  b += line(X(min), y, X(q1), y, INK, 2) + line(X(q3), y, X(max), y, INK, 2);
  b += line(X(min), y - 14, X(min), y + 14, INK, 2.4) + line(X(max), y - 14, X(max), y + 14, INK, 2.4);
  b += fades(rect(X(q1), y - 26, X(q3) - X(q1), 52, SKY, `${SKY}33`, 2.6, 5), 0.25);
  b += beats(line(X(med), y - 26, X(med), y + 26, ROSE, 3.4));
  const yy = 214;
  b += arrow(x0 - 14, yy, x1 + 12, yy, INK, 1.8);
  const step = o.step ?? Math.max(1, Math.round((hi - lo) / 8));
  for (let v = Math.ceil(lo); v <= hi; v += step) {
    b += line(X(v), yy - 4, X(v), yy + 4, INK, 1.4, undefined, 0.55);
    b += text(X(v), yy + 18, String(v), { size: 10, op: 0.65 });
  }
  if (o.labels !== false) {
    b += text(X(min), y - 34, 'min', { size: 10, op: 0.7 });
    b += text(X(q1), y + 44, 'Q1', { size: 10, fill: SKY });
    b += text(X(med), y - 34, 'median', { size: 11, fill: ROSE });
    b += text(X(q3), y + 44, 'Q3', { size: 10, fill: SKY });
    b += text(X(max), y - 34, 'max', { size: 10, op: 0.7 });
  }
  return art(o.alt ?? `A box plot from ${min} to ${max} with median ${med}`, b, o.caption);
}

/** A pie, for percents and parts of a whole. */
export function pie(
  slicesIn: { label: string; part: number; color?: string }[],
  o: { title?: string; caption?: string; alt?: string } = {},
): SlideArt {
  const cx = 138, cy = 140, R = 78;
  const total = slicesIn.reduce((a, s) => a + s.part, 0);
  const PAL = [AMB, SKY, EMR, VIO, ROSE];
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  let a0 = 90;
  slicesIn.forEach((s, i) => {
    const sweep = (s.part / total) * 360;
    const a1 = a0 - sweep;
    const col = s.color ?? PAL[i % PAL.length];
    const [px, py] = [cx + R * Math.cos(rad(a0)), cy - R * Math.sin(rad(a0))];
    const [qx, qy] = [cx + R * Math.cos(rad(a1)), cy - R * Math.sin(rad(a1))];
    const big = sweep > 180 ? 1 : 0;
    b += fades(
      `<path d="M ${f(cx)} ${f(cy)} L ${f(px)} ${f(py)} A ${R} ${R} 0 ${big} 1 ${f(qx)} ${f(qy)} Z" fill="${col}66" stroke="${col}" stroke-width="2.2"/>`,
      0.12 * i,
    );
    const ly = 66 + i * 26;
    b += rect(258, ly - 9, 12, 12, col, `${col}66`, 2, 3);
    b += text(276, ly + 1, `${s.label} ${Math.round((s.part / total) * 100)}%`, { size: 12, anchor: 'start' });
    a0 = a1;
  });
  return art(o.alt ?? `A pie chart split into ${slicesIn.map((s) => s.label).join(', ')}`, b, o.caption);
}

/** A double number line — the picture of a ratio or a rate. */
export function doubleLine(
  top: { label: string; vals: (string | number)[] },
  bottom: { label: string; vals: (string | number)[] },
  o: { title?: string; caption?: string; alt?: string; mark?: number } = {},
): SlideArt {
  const longest = Math.max(top.label.length, bottom.label.length);
  const x0 = Math.max(62, 30 + longest * 6.6);
  const x1 = W - 34;
  const n = top.vals.length;
  const X = (i: number) => x0 + ((x1 - x0) * i) / Math.max(1, n - 1);
  let b = o.title ? text(W / 2, 30, o.title, { size: 13, fill: VIO }) : '';
  const rows: [typeof top, number, string][] = [[top, 108, SKY], [bottom, 178, EMR]];
  for (const [row, y, col] of rows) {
    b += arrow(x0 - 16, y, x1 + 14, y, INK, 2);
    b += text(x0 - 22, y - 14, row.label, { size: 11, fill: col, anchor: 'end' });
    row.vals.forEach((v, i) => {
      const hot = i === o.mark;
      b += line(X(i), y - 6, X(i), y + 6, INK, 1.6, undefined, 0.6);
      b += dot(X(i), y, hot ? 6 : 4.5, hot ? ROSE : col);
      b += text(X(i), y === 108 ? y - 14 : y + 22, String(v), { size: 12, fill: hot ? ROSE : col });
    });
  }
  for (let i = 0; i < n; i++) b += line(X(i), 116, X(i), 170, INK, 1, '3 4', 0.3);
  return art(o.alt ?? `A double number line pairing ${top.label} with ${bottom.label}`, b, o.caption);
}

/** A tape diagram: equal boxes, for ratios and part-to-whole. */
export function tape(
  rows: { label: string; boxes: number; each?: string; color?: string }[],
  o: { title?: string; caption?: string; alt?: string; total?: string } = {},
): SlideArt {
  const maxBoxes = Math.max(...rows.map((r) => r.boxes));
  // the row labels hang off the left, so the boxes only get what they leave
  const x0 = Math.max(96, 14 + Math.max(...rows.map((r) => r.label.length)) * 7.4);
  const bw = Math.min(46, (W - x0 - 26) / maxBoxes);
  const bh = rows.length > 2 ? 34 : 42;
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  rows.forEach((r, i) => {
    const y = 58 + i * (bh + 14);
    const col = r.color ?? (i === 0 ? SKY : AMB);
    b += text(x0 - 10, y + bh / 2 + 4, r.label, { size: 12, fill: col, anchor: 'end' });
    for (let k = 0; k < r.boxes; k++) {
      b += slides(rect(x0 + k * bw, y, bw - 3, bh, col, `${col}33`, 2.2, 5), -10, 0, 0.1 + k * 0.05 + i * 0.12);
      if (r.each) b += text(x0 + k * bw + (bw - 3) / 2, y + bh / 2 + 4, r.each, { size: 11, fill: col });
    }
  });
  const foot = 58 + rows.length * (bh + 14) + 4;
  if (o.total) b += brace(x0, x0 + maxBoxes * bw - 3, foot, o.total, INK, 12);
  // a faint ground line, so the diagram sits on the card rather than floating
  else b += line(x0 - 4, foot, x0 + maxBoxes * bw + 1, foot, INK, 1.5, undefined, 0.3);
  return art(o.alt ?? `A tape diagram with ${rows.map((r) => `${r.boxes} boxes for ${r.label}`).join(' and ')}`, b, o.caption);
}

/** A bar split into equal parts, with some shaded — a fraction you can see. */
export function fractionBar(
  parts: number,
  shaded: number,
  o: { label?: string; second?: { parts: number; shaded: number; label?: string }; caption?: string; alt?: string; title?: string } = {},
): SlideArt {
  const x0 = 40, wTot = W - 80;
  let b = o.title ? text(W / 2, 30, o.title, { size: 13, fill: VIO }) : '';
  const row = (y: number, p: number, sh: number, col: string, label?: string) => {
    let o2 = '';
    const bw = wTot / p;
    for (let i = 0; i < p; i++) {
      o2 += fades(rect(x0 + i * bw, y, bw, 46, col, i < sh ? `${col}66` : 'none', 2.2, 4), 0.08 * i);
    }
    if (label) o2 += text(W / 2, y + 68, label, { size: 14, fill: col });
    return o2;
  };
  b += row(o.second ? 62 : 96, parts, shaded, AMB, o.label ?? `${shaded}/${parts}`);
  if (o.second) b += row(160, o.second.parts, o.second.shaded, SKY, o.second.label ?? `${o.second.shaded}/${o.second.parts}`);
  return art(o.alt ?? `A bar in ${parts} equal parts with ${shaded} shaded`, b, o.caption);
}

/** An area model: a rectangle cut into pieces, one per partial product. */
export function areaModel(
  cols: { label: string; w: number }[],
  rows: { label: string; h: number }[],
  cells: string[][],
  o: { caption?: string; alt?: string; title?: string; total?: string } = {},
): SlideArt {
  // the row labels hang off the left, so the grid only gets what they leave
  const x0 = Math.max(74, 16 + Math.max(...rows.map((r) => r.label.length)) * 8);
  const y0 = 74;
  const totW = Math.min(280, W - x0 - 26);
  const totH = 118;
  const sw = totW / cols.reduce((a, c) => a + c.w, 0);
  const sh = totH / rows.reduce((a, r) => a + r.h, 0);
  let b = o.title ? text(W / 2, 30, o.title, { size: 13, fill: VIO }) : '';
  let yy = y0;
  rows.forEach((r, ri) => {
    let xx = x0;
    const rh = r.h * sh;
    b += text(x0 - 10, yy + rh / 2 + 4, r.label, { size: 13, fill: SKY, anchor: 'end' });
    cols.forEach((c, ci) => {
      const cw = c.w * sw;
      const col = (ri + ci) % 2 ? EMR : AMB;
      b += fades(rect(xx, yy, cw, rh, col, `${col}2e`, 2, 3), 0.1 * (ri * cols.length + ci));
      b += text(xx + cw / 2, yy + rh / 2 + 5, cells[ri][ci], { size: 13, fill: col });
      if (ri === 0) b += text(xx + cw / 2, y0 - 12, c.label, { size: 13, fill: AMB });
      xx += cw;
    });
    yy += rh;
  });
  if (o.total) b += text(W / 2, yy + 32, o.total, { size: 15, fill: VIO });
  return art(o.alt ?? `An area model split into ${rows.length} by ${cols.length} pieces`, b, o.caption);
}

/** A balance scale — the picture of why you do the same to both sides. */
export function balance(
  left: string,
  right: string,
  o: { caption?: string; alt?: string; title?: string; note?: string } = {},
): SlideArt {
  const cy = 118, span = 118;
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  b += line(W / 2 - span, cy, W / 2 + span, cy, INK, 3);
  b += polygon([[W / 2, cy], [W / 2 - 22, cy + 66], [W / 2 + 22, cy + 66]], INK, 'none', 2.4);
  b += line(W / 2 - 40, cy + 66, W / 2 + 40, cy + 66, INK, 2.6);
  const pan = (x: number, label: string, col: string, d: number) => {
    let o2 = line(x, cy, x, cy + 24, INK, 1.8);
    o2 += fades(rect(x - 62, cy + 24, 124, 44, col, `${col}22`, 2.6, 10), d);
    o2 += text(x, cy + 52, label, { size: 16, fill: col });
    return o2;
  };
  b += pan(W / 2 - span + 8, left, SKY, 0.2);
  b += pan(W / 2 + span - 8, right, EMR, 0.35);
  b += beats(text(W / 2, cy - 14, '=', { size: 22, fill: ROSE }));
  if (o.note) b += text(W / 2, 236, o.note, { size: 12, op: 0.75 });
  return art(o.alt ?? `A balance scale holding ${left} on one side and ${right} on the other`, b, o.caption);
}

/** A coordinate grid with points plotted and optionally joined. */
export function plotGrid(
  pts: { x: number; y: number; label?: string; color?: string }[],
  o: { range?: Range; join?: boolean; shape?: boolean; caption?: string; alt?: string; title?: string; xLabel?: string; yLabel?: string } = {},
): SlideArt {
  const r = o.range ?? { x: [0, 8], y: [0, 8] };
  // a wide range gets a coarser tick step, or the numbers pile onto each other
  const seq = (lo: number, hi: number, most: number) => {
    const st = Math.max(1, Math.ceil((hi - lo) / most));
    const out: number[] = [];
    for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) out.push(v);
    return out;
  };
  const ticks = { x: seq(r.x[0], r.x[1], 10), y: seq(r.y[0], r.y[1], 8) };
  const ax = axes(r, { ticks, grid: true, pad: 30, xLabel: o.xLabel, yLabel: o.yLabel });
  let b = (o.title ? text(W / 2, 18, o.title, { size: 12, op: 0.7 }) : '') + ax.body;
  if (o.shape && pts.length > 2) {
    b += fades(polygon(pts.map((p) => [ax.X(p.x), ax.Y(p.y)] as [number, number]), AMB, `${AMB}22`, 2.6), 0.3);
  } else if (o.join && pts.length > 1) {
    b += draws(path(pts.map((p, i) => `${i ? 'L' : 'M'} ${f(ax.X(p.x))} ${f(ax.Y(p.y))}`).join(' '), AMB, 2.8), 700);
  }
  pts.forEach((p, i) => {
    const col = p.color ?? AMB;
    b += fades(dot(ax.X(p.x), ax.Y(p.y), 5.5, col), 0.15 + i * 0.1);
    if (p.label) b += text(ax.X(p.x), ax.Y(p.y) - 12, p.label, { size: 11, fill: col });
  });
  return art(o.alt ?? `A coordinate grid with the points ${pts.map((p) => `(${p.x}, ${p.y})`).join(', ')} plotted`, b, o.caption);
}

/** A labelled rectangle — area, perimeter, the base of most 6th-grade geometry. */
export function shapeBox(
  wLabel: string,
  hLabel: string,
  o: { wUnits?: number; hUnits?: number; inside?: string; caption?: string; alt?: string; title?: string; grid?: boolean } = {},
): SlideArt {
  const wu = o.wUnits ?? 5, hu = o.hUnits ?? 3;
  // the height label hangs off the left, so the box only gets what it leaves
  const gutter = 16 + hLabel.length * 8;
  const sc = Math.min((W - gutter - 16) / wu, 250 / wu, 120 / hu);
  const bw = wu * sc, bh = hu * sc;
  const x0 = Math.min(Math.max((W - bw) / 2, gutter), W - 16 - bw), y0 = 66;
  let b = o.title ? text(W / 2, 30, o.title, { size: 13, fill: VIO }) : '';
  b += fades(rect(x0, y0, bw, bh, AMB, `${AMB}22`, 2.8, 4), 0.15);
  if (o.grid) {
    for (let i = 1; i < wu; i++) b += line(x0 + i * sc, y0, x0 + i * sc, y0 + bh, AMB, 1, undefined, 0.45);
    for (let j = 1; j < hu; j++) b += line(x0, y0 + j * sc, x0 + bw, y0 + j * sc, AMB, 1, undefined, 0.45);
  }
  b += text(x0 + bw / 2, y0 + bh + 22, wLabel, { size: 13, fill: EMR });
  b += text(x0 - 10, y0 + bh / 2 + 4, hLabel, { size: 13, fill: SKY, anchor: 'end' });
  if (o.inside) b += beats(text(x0 + bw / 2, y0 + bh / 2 + 6, o.inside, { size: 17, fill: VIO }));
  return art(o.alt ?? `A rectangle ${wLabel} wide and ${hLabel} tall`, b, o.caption);
}

/** A stack of labelled steps flowing downward — a procedure you can see. */
export function flow(
  steps: { label: string; color?: string }[],
  o: { caption?: string; alt?: string; title?: string; horizontal?: boolean } = {},
): SlideArt {
  const PAL = [SKY, AMB, EMR, VIO];
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  if (o.horizontal) {
    const bw = (W - 40 - (steps.length - 1) * 22) / steps.length;
    steps.forEach((s, i) => {
      const x = 20 + i * (bw + 22);
      const col = s.color ?? PAL[i % PAL.length];
      b += slides(rect(x, 104, bw, 56, col, `${col}22`, 2.4, 10), -12, 0, 0.12 * i);
      // a label wider than its box would spill onto the next one
      const size = Math.max(9, Math.min(13, ((bw - 10) / s.label.length) / 0.6));
      b += text(x + bw / 2, 137, s.label, { size, fill: col });
      if (i < steps.length - 1) b += arrow(x + bw + 3, 132, x + bw + 19, 132, INK, 2.2);
    });
  } else {
    const bh = Math.min(46, (196 - steps.length * 10) / steps.length);
    steps.forEach((s, i) => {
      const y = 52 + i * (bh + 14);
      const col = s.color ?? PAL[i % PAL.length];
      b += slides(rect(56, y, W - 112, bh, col, `${col}22`, 2.4, 10), 0, -10, 0.12 * i);
      const size = Math.max(9, Math.min(13, ((W - 128) / s.label.length) / 0.6));
      b += text(W / 2, y + bh / 2 + 5, s.label, { size, fill: col });
      if (i < steps.length - 1) b += arrow(W / 2, y + bh + 1, W / 2, y + bh + 11, INK, 2);
    });
  }
  return art(o.alt ?? `A flow of steps: ${steps.map((s) => s.label).join(', then ')}`, b, o.caption);
}

// ── the figures 6th-grade geometry is made of ──────────────────────────────

/**
 * A triangle with its height drawn in as a dashed perpendicular. This is the
 * picture behind A = ½bh: the height stands straight up from the base, and the
 * right-angle mark says so even when the apex leans past the base.
 */
export function triHeight(
  baseLabel: string,
  heightLabel: string,
  o: { apex?: number; inside?: string; caption?: string; alt?: string; title?: string; box?: boolean } = {},
): SlideArt {
  const x0 = 62, x1 = 330, yB = 196, yT = 78;
  const ax = o.apex ?? 0.34;
  const px = x0 + (x1 - x0) * ax;
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  if (o.box) {
    b += rect(x0, yT, x1 - x0, yB - yT, SKY, `${SKY}10`, 1.8, 3);
    b += text(x1 - 4, yT - 8, 'the whole box', { size: 11, fill: SKY, anchor: 'end' });
  }
  b += fades(polygon([[x0, yB], [x1, yB], [px, yT]], AMB, `${AMB}22`, 2.8), 0.15);
  b += line(px, yT, px, yB, EMR, 2.2, '5 5');
  b += rightMark(px, yB, 1, -1, 12);
  b += text(W / 2, yB + 26, baseLabel, { size: 13, fill: AMB });
  b += text(px + 10, (yT + yB) / 2, heightLabel, { size: 13, fill: EMR, anchor: 'start' });
  if (o.inside) b += beats(text(x0 + 44, yB - 26, o.inside, { size: 15, fill: VIO, anchor: 'start' }));
  return art(o.alt ?? `A triangle with base ${baseLabel} and a dashed height ${heightLabel} meeting it at a right angle`, b, o.caption);
}

/**
 * A rectangular prism drawn in a shallow oblique view, with its three edges
 * labelled. Optionally a layer of unit cubes is shaded on the bottom face —
 * the picture of "volume is how many layers fit".
 */
export function prism(
  lLabel: string,
  wLabel: string,
  hLabel: string,
  o: { inside?: string; layers?: number; caption?: string; alt?: string; title?: string } = {},
): SlideArt {
  const x = 89, y = 96, bw = 176, bh = 96, dx = 46, dy = -34;
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  // back edges first so the front face sits on top of them
  b += line(x + dx, y + dy, x + dx + bw, y + dy, AMB, 1.8, '4 4', 0.65);
  b += line(x + dx, y + dy, x + dx, y + dy + bh, AMB, 1.8, '4 4', 0.65);
  b += line(x, y + bh, x + dx, y + dy + bh, AMB, 1.8, '4 4', 0.65);
  b += fades(rect(x, y, bw, bh, AMB, `${AMB}1e`, 2.6, 3), 0.15);
  b += fades(polygon([[x, y], [x + dx, y + dy], [x + dx + bw, y + dy], [x + bw, y]], SKY, `${SKY}1e`, 2.4), 0.3);
  b += fades(polygon([[x + bw, y], [x + dx + bw, y + dy], [x + dx + bw, y + dy + bh], [x + bw, y + bh]], EMR, `${EMR}1e`, 2.4), 0.45);
  if (o.layers) {
    for (let i = 1; i <= o.layers; i++) {
      const ly = y + bh - (i * bh) / (o.layers + 1);
      b += line(x + 4, ly, x + bw - 4, ly, ROSE, 1.4, '3 4', 0.8);
    }
    b += text(x - 8, y + bh - 10, `${o.layers} layers`, { size: 11, fill: ROSE, anchor: 'end' });
  }
  b += text(x + bw / 2, y + bh + 22, lLabel, { size: 13, fill: AMB });
  b += text(x + bw + dx + 10, y + dy + bh / 2, hLabel, { size: 13, fill: EMR, anchor: 'start' });
  b += text(x + dx + bw / 2, y + dy - 12, wLabel, { size: 13, fill: SKY });
  if (o.inside) b += beats(text(W / 2, 240, o.inside, { size: 15, fill: VIO }));
  return art(o.alt ?? `A box ${lLabel} long, ${wLabel} deep and ${hLabel} tall`, b, o.caption);
}

/**
 * The net of a box, unfolded into a cross. Every face is visible at once —
 * which is the whole reason nets exist when you are adding up surface area.
 */
export function boxNet(
  faces: { top?: string; bottom?: string; left?: string; right?: string; front?: string; back?: string },
  o: { total?: string; caption?: string; alt?: string; title?: string } = {},
): SlideArt {
  const s = 52, cx = 148, cy = 76;
  let b = o.title ? text(W / 2, 26, o.title, { size: 13, fill: VIO }) : '';
  const cell = (col: number, row: number, label: string | undefined, color: string, d: number) => {
    if (label === undefined) return '';
    const X = cx + col * s, Y = cy + row * s;
    return fades(rect(X, Y, s, s, color, `${color}26`, 2.2, 4), d) + text(X + s / 2, Y + s / 2 + 5, label, { size: 12, fill: color });
  };
  b += cell(0, 0, faces.top, SKY, 0.15);
  b += cell(-1, 1, faces.left, EMR, 0.25);
  b += cell(0, 1, faces.front, AMB, 0.35);
  b += cell(1, 1, faces.right, EMR, 0.45);
  b += cell(2, 1, faces.back, AMB, 0.55);
  b += cell(0, 2, faces.bottom, SKY, 0.65);
  const n = Object.values(faces).filter((v) => v !== undefined).length;
  b += text(W / 2, 246, o.total ?? `${n} faces, all flat at once`, { size: 13, fill: VIO });
  return art(o.alt ?? `The net of a box, unfolded flat into ${n} faces`, b, o.caption);
}

/**
 * A composite figure cut into named pieces along a dashed seam. Pass the
 * outline once and the cut lines separately, so the same drawing can show
 * either "split and add" or "box it in and subtract".
 */
export function composite(
  outline: [number, number][],
  o: {
    cuts?: [number, number, number, number][];
    pieces?: { x: number; y: number; label: string; color?: string }[];
    ghost?: [number, number][];
    caption?: string;
    alt?: string;
    title?: string;
  } = {},
): SlideArt {
  let b = o.title ? text(W / 2, 26, o.title, { size: 13, fill: VIO }) : '';
  if (o.ghost) b += polygon(o.ghost, SKY, `${SKY}0f`, 1.8);
  b += fades(polygon(outline, AMB, `${AMB}22`, 2.8), 0.15);
  for (const [x1, y1, x2, y2] of o.cuts ?? []) b += line(x1, y1, x2, y2, ROSE, 2, '6 5');
  (o.pieces ?? []).forEach((p, i) => {
    b += fades(text(p.x, p.y, p.label, { size: 13, fill: p.color ?? EMR }), 0.3 + i * 0.12);
  });
  return art(o.alt ?? 'A composite figure cut into simpler pieces along a dashed line', b, o.caption);
}

/**
 * A sorted row of values with the middle one marked — the picture of finding
 * a median. `cross` strikes out the matched pairs working in from both ends.
 */
export function sortedRow(
  values: (string | number)[],
  o: { middle?: number | [number, number]; cross?: number; label?: string; caption?: string; alt?: string; title?: string } = {},
): SlideArt {
  const n = values.length;
  const gap = 8;
  const bw = Math.min(58, (W - 48 - (n - 1) * gap) / n);
  const totW = n * bw + (n - 1) * gap;
  const x0 = (W - totW) / 2, y = 104, bh = 54;
  const mid = o.middle === undefined ? [] : Array.isArray(o.middle) ? o.middle : [o.middle];
  let b = o.title ? text(W / 2, 32, o.title, { size: 13, fill: VIO }) : '';
  values.forEach((v, i) => {
    const x = x0 + i * (bw + gap);
    const struck = o.cross !== undefined && (i < o.cross || i >= n - o.cross);
    const col = mid.includes(i) ? ROSE : struck ? INK : SKY;
    b += fades(rect(x, y, bw, bh, col, mid.includes(i) ? `${ROSE}26` : struck ? 'none' : `${SKY}18`, 2.4, 6), 0.1 * i);
    b += text(x + bw / 2, y + bh / 2 + 6, String(v), { size: 15, fill: col, op: struck ? 0.45 : undefined });
    if (struck) b += line(x + 6, y + bh / 2, x + bw - 6, y + bh / 2, INK, 2, undefined, 0.5);
  });
  if (o.cross) {
    b += text(x0 + bw / 2, y - 12, 'cross off', { size: 11, op: 0.65 });
    b += text(x0 + totW - bw / 2, y - 12, 'cross off', { size: 11, op: 0.65 });
  }
  if (mid.length) {
    const a = x0 + mid[0] * (bw + gap);
    const z = x0 + mid[mid.length - 1] * (bw + gap) + bw;
    b += brace(a, z, y + bh + 22, o.label ?? 'the middle', ROSE, 13);
  } else if (o.label) {
    b += text(W / 2, y + bh + 34, o.label, { size: 13, fill: VIO });
  }
  return art(o.alt ?? `The sorted values ${values.join(', ')} in a row`, b, o.caption);
}

/**
 * Values as weights on a beam, balanced at the mean. This is what "the mean
 * shares it out evenly" looks like — and why one far-off value tips it.
 */
export function balancePoint(
  values: number[],
  mean: number,
  o: { lo?: number; hi?: number; median?: number; caption?: string; alt?: string; title?: string; note?: string } = {},
): SlideArt {
  const lo = o.lo ?? Math.min(...values, mean) - 1;
  const hi = o.hi ?? Math.max(...values, mean) + 1;
  const y = 124, x0 = 46, x1 = W - 34;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  let b = o.title ? text(W / 2, 30, o.title, { size: 13, fill: VIO }) : '';
  b += line(x0 - 10, y, x1 + 10, y, INK, 3);
  const step = Math.max(1, Math.round((hi - lo) / 9));
  for (let v = Math.ceil(lo); v <= hi; v += step) {
    b += line(X(v), y, X(v), y + 6, INK, 1.4, undefined, 0.5);
    // the fulcrum stands where the mean is, so that tick keeps its number to itself
    if (Math.abs(X(v) - X(mean)) > 15) b += text(X(v), y + 22, String(v), { size: 10, op: 0.6 });
  }
  const stack: Record<number, number> = {};
  values.forEach((v, i) => {
    stack[v] = (stack[v] ?? 0) + 1;
    b += fades(dot(X(v), y - 12 - (stack[v] - 1) * 16, 6, AMB), 0.15 + i * 0.08);
  });
  b += beats(polygon([[X(mean), y + 4], [X(mean) - 15, y + 46], [X(mean) + 15, y + 46]], ROSE, `${ROSE}33`, 2.6));
  b += text(X(mean), y + 66, `mean ${mean}`, { size: 12, fill: ROSE });
  if (o.median !== undefined) {
    b += line(X(o.median), y - 58, X(o.median), y - 6, EMR, 2.4, '5 4');
    b += text(X(o.median), y - 66, `median ${o.median}`, { size: 12, fill: EMR });
  }
  if (o.note) b += text(W / 2, 234, o.note, { size: 12, op: 0.75 });
  return art(o.alt ?? `The values ${values.join(', ')} on a beam balanced at ${mean}`, b, o.caption);
}

/**
 * A straight line on axes, annotated the way Algebra 1 reads one: the
 * y-intercept marked, and the rise-over-run staircase drawn between two
 * points so the slope is something you can count rather than recall.
 */
export function lineGraph(
  lines: { m: number; b: number; label?: string; color?: string; dash?: string }[],
  o: {
    range?: Range;
    slopeFrom?: number;
    slopeRun?: number;
    showIntercept?: boolean;
    points?: { x: number; y: number; label?: string; color?: string }[];
    caption?: string;
    alt?: string;
    title?: string;
    xLabel?: string;
    yLabel?: string;
  } = {},
): SlideArt {
  const r = o.range ?? { x: [-1, 7], y: [-1, 9] };
  // a wide range gets a coarser tick step, or the numbers pile onto each other
  const seq = (lo: number, hi: number, most: number) => {
    const st = Math.max(1, Math.ceil((hi - lo) / most));
    const out: number[] = [];
    for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) out.push(v);
    return out;
  };
  const ticks = { x: seq(r.x[0], r.x[1], 10), y: seq(r.y[0], r.y[1], 8) };
  const ax = axes(r, { ticks, grid: true, pad: 40, xLabel: o.xLabel ?? 'x', yLabel: o.yLabel ?? 'y' });
  let b = (o.title ? text(W / 2, 18, o.title, { size: 12, fill: VIO }) : '') + ax.body;
  const PAL = [AMB, SKY, EMR, VIO];
  const taken: number[] = [];
  // the y-intercept gets its label first, so a line label never lands on it
  const L0 = lines[0];
  if (L0 && o.showIntercept !== false && L0.b >= r.y[0] && L0.b <= r.y[1] && r.x[0] <= 0 && r.x[1] >= 0) {
    taken.push(ax.Y(L0.b) - 10);
  }
  lines.forEach((L, i) => {
    const col = L.color ?? PAL[i % PAL.length];
    b += draws(ax.curve((x) => L.m * x + L.b, col, 2.8, L.dash), 600, 0.1 * i);
    // Park the label just above the line, at the end where the text will trail
    // off DOWNHILL of it — otherwise the line climbs straight through the words.
    const yAt = (x: number) => L.m * x + L.b;
    const top = r.y[1] - 0.9, bot = r.y[0] + 0.7;
    let xe = L.m < 0 ? r.x[0] + 0.5 : r.x[1] - 0.5;
    if (yAt(xe) > top && L.m !== 0) xe = (top - L.b) / L.m;
    else if (yAt(xe) < bot && L.m !== 0) xe = (bot - L.b) / L.m;
    xe = Math.min(Math.max(xe, r.x[0] + 0.4), r.x[1] - 0.4);
    const ye = Math.min(Math.max(yAt(xe), bot), top);
    const anchor: 'start' | 'end' = L.m < 0 ? 'start' : 'end';
    // near the top of the frame the label would land on the title, so it drops below the line
    let ly = ax.Y(ye) - 10 < 46 ? ax.Y(ye) + 18 : ax.Y(ye) - 10;
    // two lines that clamp to the same edge would otherwise share one label slot
    while (taken.some((t) => Math.abs(t - ly) < 17)) ly += 18;
    taken.push(ly);
    if (L.label) b += text(ax.X(xe), ly, L.label, { size: 12, fill: col, anchor });
  });
  if (lines.length && o.slopeFrom !== undefined) {
    const L = lines[0];
    const run = o.slopeRun ?? 1;
    const x1 = o.slopeFrom, x2 = x1 + run;
    const y1 = L.m * x1 + L.b, y2 = L.m * x2 + L.b;
    b += line(ax.X(x1), ax.Y(y1), ax.X(x2), ax.Y(y1), ROSE, 2.4);
    b += line(ax.X(x2), ax.Y(y1), ax.X(x2), ax.Y(y2), ROSE, 2.4);
    // sitting the run label under the step would drop it onto the axis numbers
    const ry = Math.abs(ax.Y(y1) - ax.Y(0)) < 22 ? ax.Y(y1) - 9 : ax.Y(y1) + 16;
    b += text((ax.X(x1) + ax.X(x2)) / 2, ry, `run ${run}`, { size: 11, fill: ROSE });
    b += text(ax.X(x2) + 8, (ax.Y(y1) + ax.Y(y2)) / 2 + 4, `rise ${f(y2 - y1)}`, { size: 11, fill: ROSE, anchor: 'start' });
  }
  if (lines.length && o.showIntercept !== false) {
    const L = lines[0];
    if (L.b >= r.y[0] && L.b <= r.y[1] && r.x[0] <= 0 && r.x[1] >= 0) {
      b += beats(dot(ax.X(0), ax.Y(L.b), 5.5, VIO));
      b += text(ax.X(0) + 10, ax.Y(L.b) - 10, `(0, ${f(L.b)})`, { size: 11, fill: VIO, anchor: 'start' });
    }
  }
  (o.points ?? []).forEach((p, i) => {
    const col = p.color ?? EMR;
    const px = ax.X(p.x);
    b += fades(dot(px, ax.Y(p.y), 5.5, col), 0.3 + i * 0.1);
    // a label centred on a point near an edge would hang off the canvas
    const anchor = px > W - 74 ? 'end' : px < 74 ? 'start' : 'middle';
    const lx = anchor === 'end' ? px + 8 : anchor === 'start' ? px - 8 : px;
    if (p.label) b += text(lx, ax.Y(p.y) - 12, p.label, { size: 11, fill: col, anchor });
  });
  return art(o.alt ?? `A graph of the line ${lines.map((L) => `y = ${L.m}x + ${L.b}`).join(' and ')}`, b, o.caption);
}

/**
 * A parabola with its roots and vertex called out — the three things a
 * quadratic question ever asks about, all on one picture.
 */
export function parabola(
  q: { a: number; b: number; c: number },
  o: { range?: Range; roots?: number[]; vertex?: boolean; label?: string; caption?: string; alt?: string; title?: string; xLabel?: string; yLabel?: string } = {},
): SlideArt {
  const r = o.range ?? { x: [-5, 5], y: [-6, 10] };
  // a wide range gets a coarser tick step, or the numbers pile onto each other
  const stepX = Math.max(1, Math.ceil((r.x[1] - r.x[0]) / 8));
  const stepY = Math.max(1, Math.ceil((r.y[1] - r.y[0]) / 7));
  const seq = (lo: number, hi: number, st: number) => {
    const out: number[] = [];
    for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) out.push(v);
    return out;
  };
  // a root gets its own label under the axis, so that tick keeps its number quiet
  const roots = o.roots ?? [];
  const ax = axes(r, {
    ticks: { x: seq(r.x[0], r.x[1], stepX), y: seq(r.y[0], r.y[1], stepY) },
    grid: true,
    pad: 40,
    xLabel: o.xLabel ?? 'x',
    yLabel: o.yLabel ?? 'y',
    tickText: (v, axis) => (axis === 'x' && roots.some((rt) => Math.abs(rt - v) < 0.51) ? '' : String(v)),
  });
  let b = (o.title ? text(W / 2, 18, o.title, { size: 12, fill: VIO }) : '') + ax.body;
  b += draws(ax.curve((x) => q.a * x * x + q.b * x + q.c, AMB, 3), 900);
  const axisX = ax.X(Math.min(Math.max(0, r.x[0]), r.x[1]));
  for (const x of roots) {
    b += fades(dot(ax.X(x), ax.Y(0), 6, ROSE), 0.4);
    // a root sitting on the y-axis would put its label among the y tick numbers
    const onAxis = Math.abs(ax.X(x) - axisX) < 20;
    b += text(ax.X(x) + (onAxis ? 8 : 0), ax.Y(0) + 40, `x = ${f(x)}`, {
      size: 11,
      fill: ROSE,
      anchor: onAxis ? 'start' : 'middle',
    });
  }
  if (o.vertex !== false) {
    const vx = -q.b / (2 * q.a);
    const vy = q.a * vx * vx + q.b * vx + q.c;
    if (vx >= r.x[0] && vx <= r.x[1] && vy >= r.y[0] && vy <= r.y[1]) {
      b += beats(dot(ax.X(vx), ax.Y(vy), 6, EMR));
      b += text(ax.X(vx), ax.Y(vy) + (q.a > 0 ? 22 : -14), `vertex (${f(vx)}, ${f(vy)})`, { size: 11, fill: EMR });
    }
  }
  if (o.label) b += text(W - 24, 42, o.label, { size: 12, fill: AMB, anchor: 'end' });
  return art(o.alt ?? `A parabola curving ${q.a > 0 ? 'upward' : 'downward'} on a coordinate grid`, b, o.caption);
}

/**
 * Any curve on axes: polynomials, rationals, waves, logs. Asymptotes, zeros
 * and a single highlighted point are annotations rather than separate figures,
 * so one deck can tell a whole story on one canvas.
 */
export function funcGraph(
  curves: { f: (x: number) => number; label?: string; color?: string; dash?: string }[],
  o: {
    range?: Range;
    vAsymptotes?: { at: number; label?: string }[];
    hAsymptote?: { at: number; label?: string };
    zeros?: { at: number; label?: string }[];
    points?: { x: number; y: number; label?: string; color?: string; hollow?: boolean }[];
    caption?: string;
    alt?: string;
    title?: string;
    xLabel?: string;
    yLabel?: string;
    xTickText?: (v: number) => string;
  } = {},
): SlideArt {
  const r = o.range ?? { x: [-5, 5], y: [-5, 5] };
  const seq = (lo: number, hi: number, most: number) => {
    const st = Math.max(1, Math.ceil((hi - lo) / most));
    const out: number[] = [];
    for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) out.push(v);
    return out;
  };
  const ax = axes(r, {
    ticks: { x: seq(r.x[0], r.x[1], 8), y: seq(r.y[0], r.y[1], 6) },
    grid: true,
    pad: 40,
    xLabel: o.xLabel ?? 'x',
    yLabel: o.yLabel ?? 'y',
    tickText: (v, axis) => (axis === 'x' && o.xTickText ? o.xTickText(v) : String(v)),
  });
  let b = (o.title ? text(W / 2, 18, o.title, { size: 12, fill: VIO }) : '') + ax.body;
  for (const a of o.vAsymptotes ?? []) {
    b += line(ax.X(a.at), ax.Y(r.y[0]), ax.X(a.at), ax.Y(r.y[1]), ROSE, 2, '6 5');
    if (a.label) b += text(ax.X(a.at) + 6, ax.Y(r.y[1]) + 12, a.label, { size: 11, fill: ROSE, anchor: 'start' });
  }
  if (o.hAsymptote) {
    b += line(ax.X(r.x[0]), ax.Y(o.hAsymptote.at), ax.X(r.x[1]), ax.Y(o.hAsymptote.at), ROSE, 2, '6 5');
    if (o.hAsymptote.label) b += text(ax.X(r.x[1]) - 4, ax.Y(o.hAsymptote.at) - 8, o.hAsymptote.label, { size: 11, fill: ROSE, anchor: 'end' });
  }
  const PAL = [AMB, SKY, EMR, VIO];
  curves.forEach((c, i) => {
    const col = c.color ?? PAL[i % PAL.length];
    b += draws(ax.curve(c.f, col, 2.8, c.dash), 900, 0.1 * i);
    if (c.label) b += text(W - 24, 40 + i * 17, c.label, { size: 12, fill: col, anchor: 'end' });
  });
  for (const z of o.zeros ?? []) {
    b += fades(dot(ax.X(z.at), ax.Y(0), 5.5, ROSE), 0.4);
    if (z.label) b += text(ax.X(z.at), ax.Y(0) + 36, z.label, { size: 11, fill: ROSE });
  }
  (o.points ?? []).forEach((p, i) => {
    const col = p.color ?? EMR;
    const px = ax.X(p.x);
    b += p.hollow ? circle(px, ax.Y(p.y), 5, col, 'none', 2.4) : fades(dot(px, ax.Y(p.y), 5.5, col), 0.35 + i * 0.1);
    const anchor = px > W - 80 ? 'end' : px < 80 ? 'start' : 'middle';
    const lx = anchor === 'end' ? px + 8 : anchor === 'start' ? px - 8 : px;
    if (p.label) b += text(lx, ax.Y(p.y) - 12, p.label, { size: 11, fill: col, anchor });
  });
  return art(o.alt ?? 'A curve drawn on a coordinate grid with its key features marked', b, o.caption);
}
