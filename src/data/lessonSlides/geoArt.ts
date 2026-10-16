import type { SlideArt } from './types';
import {
  AMB, EMR, INK, ROSE, SKY, VIO, W,
  arcPath, art, axes, brace, circle, dot, draws, fades, line, path, polygon, rad, rightMark, text,
} from '../slideArt';

// Figures the Geometry and Trigonometry decks share: segments on a line, angle
// pairs, parallel lines, polygons, circle angles, congruent and similar
// triangles, and shapes moved around a coordinate grid. All draw on the same
// 400 × 260 canvas in the shared palette.

type Pt = [number, number];

/** A point `r` pixels from (cx, cy) at `deg` degrees, y up. */
export const polar = (cx: number, cy: number, deg: number, r: number): Pt => [
  cx + r * Math.cos(rad(deg)),
  cy - r * Math.sin(rad(deg)),
];

const title = (s: string) => text(W / 2, 22, s, { size: 12, fill: VIO });

/** Points along a straight line, with braces for the lengths between them. */
export function segmentFig(
  pts: { at: number; label: string; color?: string }[],
  lengths: { from: number; to: number; label: string; color?: string }[],
  o: { title: string; caption: string; lo?: number; hi?: number; ends?: boolean },
): SlideArt {
  const lo = o.lo ?? Math.min(...pts.map((p) => p.at));
  const hi = o.hi ?? Math.max(...pts.map((p) => p.at));
  const X = (v: number) => 50 + ((v - lo) / Math.max(1e-9, hi - lo)) * 300;
  const y = 120;
  let b = title(o.title);
  b += draws(line(30, y, 370, y, INK, 2.4), 340);
  if (o.ends !== false) b += line(24, y, 34, y - 5, INK, 2) + line(24, y, 34, y + 5, INK, 2) + line(376, y, 366, y - 5, INK, 2) + line(376, y, 366, y + 5, INK, 2);
  for (const p of pts) {
    b += dot(X(p.at), y, 5.5, p.color ?? AMB);
    b += text(X(p.at), y - 16, p.label, { size: 14, fill: p.color ?? INK });
  }
  lengths.forEach((l, i) => {
    b += fades(brace(X(l.from), X(l.to), y + 26 + i * 40, l.label, l.color ?? (i ? EMR : SKY), 13), 0.3 + i * 0.2);
  });
  return art(`Points ${pts.map((p) => p.label).join(', ')} on a straight line with the lengths between them marked`, b, o.caption);
}

/** An angle at a vertex, optionally split by an inner ray. */
export function angleFig(
  deg: number,
  o: { label: string; title: string; caption: string; split?: { at: number; a: string; b: string }; names?: [string, string, string] },
): SlideArt {
  const vx = 120, vy = 200, R = 200;
  let b = title(o.title);
  const [ex, ey] = polar(vx, vy, deg, R * 0.82);
  b += draws(line(vx, vy, vx + R * 1.2, vy, INK, 2.6), 260);
  b += draws(line(vx, vy, ex, ey, INK, 2.6), 220, 0.15);
  b += dot(vx, vy, 4.5, INK);
  if (o.split) {
    const [sx, sy] = polar(vx, vy, o.split.at, R * 0.9);
    b += line(vx, vy, sx, sy, SKY, 2.2, '6 5');
    b += path(arcPath(vx, vy, 46, 0, o.split.at), EMR, 2.4) + path(arcPath(vx, vy, 58, o.split.at, deg), AMB, 2.4);
    const [ax1, ay1] = polar(vx, vy, o.split.at / 2, 78);
    const [ax2, ay2] = polar(vx, vy, (o.split.at + deg) / 2, 90);
    b += text(ax1 + 4, ay1 + 5, o.split.a, { size: 13, fill: EMR, anchor: 'start' });
    b += text(ax2, ay2 + 5, o.split.b, { size: 13, fill: AMB, anchor: 'start' });
    b += fades(text(330, 236, o.label, { size: 13, fill: ROSE }), 0.5);
  } else {
    if (Math.abs(deg - 90) < 0.5) b += rightMark(vx, vy, 0, 90, 16);
    else b += path(arcPath(vx, vy, 40, 0, deg), ROSE, 2.6);
    const [lx, ly] = polar(vx, vy, deg / 2, 64);
    b += fades(text(lx + 6, ly + 5, o.label, { size: 15, fill: ROSE, anchor: 'start' }), 0.4);
  }
  if (o.names) {
    const [n1, n2, n3] = o.names;
    b += text(ex, ey - 12, n1, { size: 13 });
    b += text(vx - 10, vy + 18, n2, { size: 13, anchor: 'end' });
    b += text(vx + R * 1.2 - 6, vy + 18, n3, { size: 13, anchor: 'end' });
  }
  return art(`An angle of ${o.label} drawn at a vertex`, b, o.caption);
}

/** Two lines crossing at `a` degrees: vertical angles equal, neighbours add to 180. */
export function crossingFig(a: number, o: { title: string; caption: string; labels?: [string, string] }): SlideArt {
  const cx = 200, cy = 146, R = 112;
  const [l1, l2] = o.labels ?? [`${a}°`, `${180 - a}°`];
  let b = title(o.title);
  const r1 = 20, r2 = r1 + a;
  const end = (d: number) => polar(cx, cy, d, R);
  const [p1x, p1y] = end(r1), [q1x, q1y] = end(r1 + 180), [p2x, p2y] = end(r2), [q2x, q2y] = end(r2 + 180);
  b += draws(line(q1x, q1y, p1x, p1y, INK, 2.4), 320) + draws(line(q2x, q2y, p2x, p2y, INK, 2.4), 320, 0.15);
  b += path(arcPath(cx, cy, 26, r1, r2), SKY, 2.4) + path(arcPath(cx, cy, 26, r1 + 180, r2 + 180), SKY, 2.4);
  b += path(arcPath(cx, cy, 34, r2, r1 + 180), ROSE, 2.4) + path(arcPath(cx, cy, 34, r2 + 180, r1 + 360), ROSE, 2.4);
  const lab = (d: number, s: string, c: string) => {
    const [x, y] = polar(cx, cy, d, 60);
    return fades(text(x, y + 5, s, { size: 14, fill: c }), 0.5);
  };
  b += lab(r1 + a / 2, l1, SKY) + lab(r1 + a / 2 + 180, l1, SKY);
  b += lab(r2 + (180 - a) / 2, l2, ROSE) + lab(r2 + (180 - a) / 2 + 180, l2, ROSE);
  return art(`Two lines crossing to make vertical angles of ${l1} and ${l2}`, b, o.caption);
}

/**
 * Two parallel lines cut by a transversal at `acute` degrees. `mode` picks the
 * pair that is marked: corresponding (same seat at both crossings), alternate
 * interior (the Z, between the lines on opposite sides) or co-interior (the C,
 * between the lines on the same side).
 */
export function parallelFig(acute: number, o: { title: string; caption: string; mode?: 'corr' | 'alt' | 'co'; obtuseLabel?: string; acuteLabel?: string }): SlideArt {
  const y1 = 90, y2 = 180, xLow = 170;
  const k = 1 / Math.tan(rad(acute));
  const xAt = (y: number) => xLow + (y2 - y) * k;
  const aL = o.acuteLabel ?? `${acute}°`, oL = o.obtuseLabel ?? `${180 - acute}°`;
  let b = title(o.title);
  b += line(40, y1, 360, y1, SKY, 2.6) + line(40, y2, 360, y2, SKY, 2.6);
  b += line(320, y1 - 4, 328, y1, SKY, 2) + line(320, y1 + 4, 328, y1, SKY, 2) + line(320, y2 - 4, 328, y2, SKY, 2) + line(320, y2 + 4, 328, y2, SKY, 2);
  b += draws(line(xAt(242), 242, xAt(40), 40, INK, 2.4), 230);
  const up = xAt(y1);
  const mark = (x: number, y: number, a1: number, a2: number, s: string, c: string, r = 22) => {
    const [px, py] = polar(x, y, (a1 + a2) / 2, 48);
    return path(arcPath(x, y, r, a1, a2), c, 2.4) + fades(text(px, py + 5, s, { size: 13, fill: c }), 0.5);
  };
  const mode = o.mode ?? 'corr';
  if (mode === 'corr') {
    b += mark(up, y1, 0, acute, aL, AMB) + mark(xLow, y2, 0, acute, aL, AMB) + mark(up, y1, acute, 180, oL, EMR, 30);
  } else if (mode === 'alt') {
    b += mark(up, y1, 180, 180 + acute, aL, AMB) + mark(xLow, y2, 0, acute, aL, AMB);
  } else {
    b += mark(up, y1, 180 + acute, 360, oL, EMR, 30) + mark(xLow, y2, 0, acute, aL, AMB);
  }
  return art(`Two parallel lines cut by a transversal, making angles of ${aL} and ${oL}`, b, o.caption);
}

/** A triangle with two far angles and its extended side's exterior angle. */
export function exteriorFig(a: number, c: number, o: { title: string; caption: string }): SlideArt {
  const A: Pt = [70, 210], B: Pt = [270, 210];
  const bAng = 180 - a - c;
  const ac = (200 * Math.sin(rad(bAng))) / Math.sin(rad(c));
  const C = polar(A[0], A[1], a, ac);
  let b = title(o.title);
  b += polygon([A, B, C], AMB, `${AMB}18`, 2.6);
  b += line(B[0], B[1], 372, B[1], INK, 2.4, '6 5');
  b += path(arcPath(A[0], A[1], 26, 0, a), SKY, 2.4);
  const toA = (Math.atan2(-(A[1] - C[1]), A[0] - C[0]) * 180) / Math.PI;
  const toB = (Math.atan2(-(B[1] - C[1]), B[0] - C[0]) * 180) / Math.PI;
  b += path(arcPath(C[0], C[1], 22, toA + 360, toB + 360), SKY, 2.4);
  b += path(arcPath(B[0], B[1], 28, 0, 180 - bAng), ROSE, 2.6);
  b += text(A[0] + 46, A[1] - 10, `${a}°`, { size: 13, fill: SKY });
  b += text(C[0] + 2, C[1] + 44, `${c}°`, { size: 13, fill: SKY });
  b += fades(text(B[0] + 44, B[1] - 40, `${a + c}°`, { size: 14, fill: ROSE }), 0.5);
  return art(`A triangle with angles of ${a} and ${c} degrees and an exterior angle of ${a + c} degrees`, b, o.caption);
}

/** A regular polygon with an optional label inside and one exterior angle. */
export function polygonFig(n: number, o: { title: string; caption: string; inside?: string; exterior?: string; interior?: string }): SlideArt {
  const cx = 200, cy = 142, R = 82;
  const pts: Pt[] = Array.from({ length: n }, (_, i) => polar(cx, cy, -90 - 180 / n + (360 * i) / n, R));
  let b = title(o.title);
  b += fades(polygon(pts, AMB, `${AMB}1c`, 2.6), 0.1);
  if (o.inside) b += text(cx, cy + 6, o.inside, { size: 15, fill: VIO });
  if (o.exterior) {
    const [p0, p1] = [pts[0], pts[1]];
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
    const ext: Pt = [p1[0] + dx * 0.55, p1[1] + dy * 0.55];
    b += line(p1[0], p1[1], ext[0], ext[1], INK, 2.2, '6 5');
    b += fades(text(p1[0] + 16, p1[1] + 24, o.exterior, { size: 13, fill: ROSE, anchor: 'start' }), 0.5);
  }
  if (o.interior) b += text(cx, cy + (o.inside ? 28 : 6), o.interior, { size: 13, fill: EMR });
  return art(`A regular polygon with ${n} sides`, b, o.caption);
}

/** A circle with a central angle and an inscribed angle on the same arc. */
export function circleAnglesFig(arc: number, o: { title: string; caption: string; central?: string; inscribed?: string; arcLabel?: string }): SlideArt {
  const cx = 200, cy = 140, R = 90;
  const a1 = -90 - arc / 2, a2 = -90 + arc / 2;
  const P1 = polar(cx, cy, a1, R), P2 = polar(cx, cy, a2, R), T = polar(cx, cy, 90, R);
  let b = title(o.title);
  b += circle(cx, cy, R, INK, 'none', 2);
  b += path(arcPath(cx, cy, R, a1, a2), ROSE, 4.5);
  if (o.central) {
    b += line(cx, cy, P1[0], P1[1], SKY, 2.4) + line(cx, cy, P2[0], P2[1], SKY, 2.4) + dot(cx, cy, 4, SKY);
    b += path(arcPath(cx, cy, 20, a1, a2), SKY, 2.2);
    b += text(cx, cy + 40, o.central, { size: 13, fill: SKY });
  }
  if (o.inscribed) {
    b += line(T[0], T[1], P1[0], P1[1], EMR, 2.4) + line(T[0], T[1], P2[0], P2[1], EMR, 2.4) + dot(T[0], T[1], 4, EMR);
    b += text(T[0], T[1] + 50, o.inscribed, { size: 13, fill: EMR });
  }
  if (o.arcLabel) b += fades(text(cx, cy + R + 22, o.arcLabel, { size: 13, fill: ROSE }), 0.4);
  return art(`A circle with an arc of ${arc} degrees and the angles that stand on it`, b, o.caption);
}

/** A shaded sector of a circle with its arc highlighted. */
export function sectorFig(deg: number, o: { title: string; caption: string; arcLabel: string; radius: string }): SlideArt {
  const cx = 200, cy = 146, r = 90;
  let b = title(o.title);
  b += circle(cx, cy, r, INK, 'none', 2, '5 5');
  const [x1, y1] = polar(cx, cy, 0, r), [x2, y2] = polar(cx, cy, deg, r);
  b += fades(path(`M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${deg > 180 ? 1 : 0} 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`, AMB, 2.6, `${AMB}33`), 0.2);
  b += path(arcPath(cx, cy, r, 0, deg), ROSE, 4);
  const [lx, ly] = polar(cx, cy, deg / 2, 40);
  b += text(lx, ly + 5, `${deg}°`, { size: 13, fill: SKY });
  const [ax2, ay2] = polar(cx, cy, deg / 2, r + 18);
  b += text(ax2 + 4, ay2 + 4, o.arcLabel, { size: 13, fill: ROSE, anchor: 'start' });
  b += text(cx + r / 2, cy + 18, o.radius, { size: 12, fill: EMR });
  return art(`A circle with a ${deg} degree sector shaded`, b, o.caption);
}

/** A tangent meeting a radius at a right angle. */
export function tangentFig(o: { title: string; caption: string; radius?: string; tangent?: string; far?: string }): SlideArt {
  const cx = 160, cy = 132, r = 76;
  const [tx, ty] = polar(cx, cy, 40, r);
  const [e1x, e1y] = polar(tx, ty, 130, 92), [e2x, e2y] = polar(tx, ty, 310, 112);
  let b = text(W / 2, 250, o.title, { size: 12, fill: VIO });
  b += circle(cx, cy, r, AMB, `${AMB}14`, 2.6) + dot(cx, cy, 4.5, INK);
  b += line(cx, cy, tx, ty, EMR, 2.6);
  b += draws(line(e1x, e1y, e2x, e2y, ROSE, 2.6), 240);
  b += rightMark(tx, ty, 220, 310, 11);
  if (o.far) b += line(cx, cy, e2x, e2y, SKY, 2.2, '6 5') + text(e2x + 8, e2y + 4, o.far, { size: 12, fill: SKY, anchor: 'start' });
  b += text(e1x + 10, e1y + 4, o.tangent ?? 'tangent', { size: 12, fill: ROSE, anchor: 'start' });
  const [mx, my] = polar(cx, cy, 40, r / 2);
  b += text(mx - 12, my + 4, o.radius ?? 'radius', { size: 12, fill: EMR, anchor: 'end' });
  return art('A circle with a radius drawn to the point where a tangent line touches it, marked with a right angle', b, o.caption);
}

/** Two triangles with matching tick marks: what a congruence or similarity criterion needs. */
export function twinTriangles(o: {
  title: string;
  caption: string;
  scale?: number;
  sides?: [string, string, string];
  sides2?: [string, string, string];
  ticks?: [number, number, number];
  arcs?: [number, number, number];
  right?: boolean;
}): SlideArt {
  const k = o.scale ?? 1;
  const base: Pt[] = o.right ? [[0, 0], [100, 0], [0, -80]] : [[0, 0], [110, 0], [38, -78]];
  const place = (ox: number, oy: number, s: number): Pt[] => base.map(([x, y]) => [ox + x * s, oy + y * s]);
  const s2 = Math.min(k, 1.5);
  const L = place(34, 200, 1), Rt = place(208, 200, s2);
  let b = title(o.title);
  b += polygon(L, AMB, `${AMB}18`, 2.6) + fades(polygon(Rt, SKY, `${SKY}18`, 2.6), 0.3);
  const mid = (P: Pt[], i: number): Pt => { const j = (i + 1) % 3; return [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2]; };
  const tickAt = (P: Pt[], i: number, n: number) => {
    const j = (i + 1) % 3;
    const dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len, nx = -uy * 6, ny = ux * 6;
    const [mx, my] = mid(P, i);
    let t = '';
    for (let q = 0; q < n; q++) { const off = (q - (n - 1) / 2) * 5; t += line(mx + ux * off - nx, my + uy * off - ny, mx + ux * off + nx, my + uy * off + ny, ROSE, 2); }
    return t;
  };
  const arcAt = (P: Pt[], i: number, n: number) => {
    const prev = P[(i + 2) % 3], next = P[(i + 1) % 3];
    const a1 = (Math.atan2(-(next[1] - P[i][1]), next[0] - P[i][0]) * 180) / Math.PI;
    const a2 = (Math.atan2(-(prev[1] - P[i][1]), prev[0] - P[i][0]) * 180) / Math.PI;
    let lo = a1, hi = a2;
    if (((hi - lo) % 360 + 360) % 360 > 180) [lo, hi] = [hi, lo];
    if (hi < lo) hi += 360;
    let t = '';
    for (let q = 0; q < n; q++) t += path(arcPath(P[i][0], P[i][1], 16 + q * 5, lo, hi), EMR, 2);
    return t;
  };
  for (const P of [L, Rt]) {
    (o.ticks ?? [0, 0, 0]).forEach((n, i) => { if (n) b += tickAt(P, i, n); });
    (o.arcs ?? [0, 0, 0]).forEach((n, i) => { if (n) b += arcAt(P, i, n); });
    if (o.right) b += rightMark(P[0][0], P[0][1], 0, 90, 10);
  }
  const lab = (P: Pt[], labels: [string, string, string] | undefined, color: string) => {
    if (!labels) return '';
    let t = '';
    labels.forEach((s, i) => {
      if (!s) return;
      const [mx, my] = mid(P, i);
      const off: Pt = i === 0 ? [0, 18] : i === 1 ? [12, -2] : [-12, -2];
      t += text(mx + off[0], my + off[1], s, { size: 12, fill: color, anchor: i === 0 ? 'middle' : i === 1 ? 'start' : 'end' });
    });
    return t;
  };
  b += lab(L, o.sides, AMB) + lab(Rt, o.sides2 ?? o.sides, SKY);
  return art('Two triangles side by side with matching marks on the parts that are equal', b, o.caption);
}

/** Shapes drawn on a coordinate grid: for transformations and coordinate proofs. */
export function gridShapes(
  shapes: { pts: Pt[]; color?: string; label?: string; dash?: boolean }[],
  o: { title: string; caption: string; range: { x: [number, number]; y: [number, number] }; mirror?: { x?: number; y?: number; diag?: boolean } },
): SlideArt {
  const r = o.range;
  const seq = (lo: number, hi: number, most: number) => {
    const st = Math.max(1, Math.ceil((hi - lo) / most));
    const out: number[] = [];
    for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) out.push(v);
    return out;
  };
  const ax = axes(r, { ticks: { x: seq(r.x[0], r.x[1], 10), y: seq(r.y[0], r.y[1], 8) }, grid: true, pad: 30, xLabel: 'x', yLabel: 'y' });
  let b = text(W / 2, 16, o.title, { size: 12, fill: VIO }) + ax.body;
  if (o.mirror?.x !== undefined) b += line(ax.X(o.mirror.x), ax.Y(r.y[0]), ax.X(o.mirror.x), ax.Y(r.y[1]), ROSE, 2, '6 5');
  if (o.mirror?.y !== undefined) b += line(ax.X(r.x[0]), ax.Y(o.mirror.y), ax.X(r.x[1]), ax.Y(o.mirror.y), ROSE, 2, '6 5');
  if (o.mirror?.diag) { const lo = Math.max(r.x[0], r.y[0]), hi = Math.min(r.x[1], r.y[1]); b += line(ax.X(lo), ax.Y(lo), ax.X(hi), ax.Y(hi), ROSE, 2, '6 5'); }
  shapes.forEach((s, i) => {
    const col = s.color ?? (i ? SKY : AMB);
    const pp = s.pts.map(([x, y]) => [ax.X(x), ax.Y(y)] as Pt);
    b += fades(s.dash ? path(`M ${pp.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L ')} Z`, col, 2.4, `${col}14`, '6 4') : polygon(pp, col, `${col}22`, 2.6), 0.2 + i * 0.3);
    if (s.label) {
      const cx = pp.reduce((t, p) => t + p[0], 0) / pp.length, cy = pp.reduce((t, p) => t + p[1], 0) / pp.length;
      b += text(cx, cy + 5, s.label, { size: 12, fill: col });
    }
  });
  return art('Shapes drawn on a coordinate grid to show how a figure moves', b, o.caption);
}
