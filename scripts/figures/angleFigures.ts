/**
 * Figures for problems about angles — trigonometry, geometry, precalculus.
 *
 * A problem carries a one-line spec ({ kind: 'right', opp: '3', adj: '4',
 * hyp: '5', angle: 'θ' }); this turns it into an inline SVG at build time.
 * Ten-odd kinds cover the shapes that angle problems actually describe, so
 * three hundred problems become three hundred specs rather than three
 * hundred drawings.
 *
 * Ink is `currentColor`, so a figure follows the card's text colour in light
 * and dark. Accents are fixed hues that read on both.
 */

export type AngleFigure =
  | GeoFigure
  | StandardAngle
  | UnitCircle
  | RightTriangle
  | Sector
  | Wave
  | Triangle
  | SSA
  | Clock
  | Compass
  | Quadrants
  | Ferris;

/** An angle in standard position, quadrants marked. */
export interface StandardAngle {
  kind: 'standard';
  /** The angle drawn; past ±360 it spirals. */
  deg: number;
  label?: string;
  /** Also draw the reference angle to the nearest x-axis. */
  ref?: boolean;
  /** Name the initial side, terminal side and vertex. */
  parts?: boolean;
}

export interface UnitAngle {
  deg: number;
  label?: string;
  color?: string;
  /** Coordinates written beside the point. */
  point?: string;
}

/** The unit circle with one or more angles on it. */
export interface UnitCircle {
  kind: 'unit';
  angles: UnitAngle[];
  /** Drop a dashed leg to the x-axis from the first angle's point and label the legs. */
  legs?: { x?: string; y?: string; r?: string };
  /** A horizontal line y = c, with its label. */
  hline?: { y: number; label: string };
  vline?: { x: number; label: string };
  /** The line y = x. */
  diag?: boolean;
  /** A highlighted arc of the circle, in degrees. */
  rangeArc?: { from: number; to: number; label?: string };
  /** Label on the radius (defaults to nothing; "1" or "30 m"). */
  radius?: string;
}

/** A right triangle, right angle at C (bottom right), acute angle A at bottom left. */
export interface RightTriangle {
  kind: 'right';
  opp?: string;
  adj?: string;
  hyp?: string;
  /** Label at the acute angle; `angleAt` says which one. */
  angle?: string;
  angleAt?: 'A' | 'B';
  /** Angle of depression at B: a dashed horizontal and the arc below it. */
  depression?: string;
  /** Actual proportions, so the picture matches the numbers. */
  shape?: { opp: number; adj: number };
  /** Draw a ground line (ramps, ladders, trees). */
  ground?: boolean;
  /** Observer's instrument height: a short offset under A. */
  eye?: string;
  /** Vertex names. */
  names?: { A?: string; B?: string; C?: string };
}

/** A sector or arc of a circle with a central angle. */
export interface Sector {
  kind: 'sector';
  deg: number;
  r: string;
  angle: string;
  arc?: string;
  shade?: boolean;
  area?: string;
}

export interface WaveCurve {
  fn: 'sin' | 'cos' | 'tan' | 'sec';
  a?: number;
  b?: number;
  /** Phase shift, in x units (positive = right). */
  h?: number;
  k?: number;
  color?: string;
  label?: string;
}

/** Graph of one or more trig functions. */
export interface Wave {
  kind: 'wave';
  curves: WaveCurve[];
  /** 'deg' ticks every 90, 'rad' every π/2, 't' plain numbers. */
  unit: 'deg' | 'rad' | 't';
  xMax: number;
  xMin?: number;
  yMin?: number;
  yMax?: number;
  midline?: string;
  amplitude?: string;
  period?: string;
  max?: string;
  min?: string;
  zeros?: boolean;
  asymptotes?: boolean;
  hline?: { y: number; label: string };
  points?: { x: number; y: number; label: string }[];
  xLabel?: string;
  yLabel?: string;
  /** Tick spacing on the x axis; chosen from the unit when omitted. */
  xStep?: number;
}

/** An oblique triangle drawn to scale from whatever is given. */
export interface Triangle {
  kind: 'triangle';
  /** Enough to fix the shape: SSS, SAS, ASA/AAS (angles in degrees). */
  shape: { a?: number; b?: number; c?: number; A?: number; B?: number; C?: number };
  /** What is written on each part; omit to leave it blank. */
  labels: { a?: string; b?: string; c?: string; A?: string; B?: string; C?: string };
  names?: [string, string, string];
  /** Draw the altitude from C. */
  height?: string;
  /** Tick marks on sides that are equal. */
  equal?: ('a' | 'b' | 'c')[];
  /** Extend a side past this vertex and mark the exterior angle. */
  exterior?: { at: 'A' | 'B' | 'C'; label: string };
  /** The segment joining the midpoints of CA and CB, labelled. */
  midsegment?: string;
}

/** The ambiguous case: angle A, side b, side a swinging from C. */
export interface SSA {
  kind: 'ssa';
  A: number;
  a: number;
  b: number;
  labels?: { A?: string; a?: string; b?: string };
}

export interface Clock {
  kind: 'clock';
  from: number;
  to: number;
  label?: string;
}

export interface Compass {
  kind: 'compass';
  deg: number;
  label: string;
}

/** The four quadrants with the sign of x and y in each. */
export interface Quadrants {
  kind: 'quadrants';
}

export interface Ferris {
  kind: 'ferris';
  diameter: string;
  clearance: string;
  centre?: string;
  period?: string;
}

// ── drawing helpers ────────────────────────────────────────────────────────

const INK = 'currentColor';
const AMB = '#F59E0B';
const SKY = '#0EA5E9';
const EMR = '#10B981';
const ROSE = '#F43F5E';
const VIO = '#8B5CF6';
const FONT = 'Nunito, ui-rounded, system-ui, sans-serif';

const rad = (d: number) => (d * Math.PI) / 180;
const f = (n: number) => (Math.round(n * 10) / 10).toString();

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function text(
  x: number,
  y: number,
  s: string,
  opts: { size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; op?: number } = {},
): string {
  const { size = 14, fill = INK, anchor = 'middle', weight = 700, op } = opts;
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<text x="${f(x)}" y="${f(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${o}>${esc(s)}</text>`;
}

function line(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2, dash?: string, op?: number): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}"${d}${o}/>`;
}

function circle(cx: number, cy: number, r: number, stroke = INK, fill = 'none', w = 2, dash?: string, op?: number): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${d}${o}/>`;
}

function dot(cx: number, cy: number, r = 4.5, fill = INK): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${fill}"/>`;
}

function path(d: string, stroke = INK, w = 2, fill = 'none', dash?: string, op?: number): string {
  const da = dash ? ` stroke-dasharray="${dash}"` : '';
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${da}${o}/>`;
}

function polygon(pts: [number, number][], stroke = INK, fill = 'none', w = 2.5): string {
  return `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
}

/** Arrowhead at (x2,y2) pointing along (x1,y1)→(x2,y2). */
function head(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2, L = 9): string {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const s = 0.5;
  const a = [x2 - L * Math.cos(ang - s), y2 - L * Math.sin(ang - s)];
  const b = [x2 - L * Math.cos(ang + s), y2 - L * Math.sin(ang + s)];
  return line(a[0], a[1], x2, y2, stroke, w) + line(b[0], b[1], x2, y2, stroke, w);
}

function arrow(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2): string {
  return line(x1, y1, x2, y2, stroke, w) + head(x1, y1, x2, y2, stroke, w);
}

/** Point at mathematical angle `deg` (counterclockwise, y up) on a circle. */
function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
}

/** Arc of a circle from angle a1 to a2 (degrees, counterclockwise if a2 > a1). */
function arcPath(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a2);
  const sweepDeg = a2 - a1;
  const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
  // SVG sweep-flag 1 is clockwise on screen, which is a decreasing math angle.
  const sweep = sweepDeg > 0 ? 0 : 1;
  return `M ${f(x1)} ${f(y1)} A ${f(r)} ${f(r)} 0 ${large} ${sweep} ${f(x2)} ${f(y2)}`;
}

/** A spiral arc for angles past a full turn, ending with an arrowhead. */
function spiral(cx: number, cy: number, r0: number, deg: number, stroke: string): string {
  const n = Math.max(24, Math.ceil(Math.abs(deg) / 5));
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (deg * i) / n;
    const r = r0 + (Math.abs(t) / 360) * 13;
    pts.push(pt(cx, cy, r, t));
  }
  const d = 'M ' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L ');
  const [ax, ay] = pts[pts.length - 2];
  const [bx, by] = pts[pts.length - 1];
  return path(d, stroke, 2.5) + head(ax, ay, bx, by, stroke, 2.5);
}

function svg(w: number, h: number, alt: string, body: string): { svg: string; alt: string } {
  return {
    alt,
    svg:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" ` +
      `font-family="${FONT}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`,
  };
}

function axes(cx: number, cy: number, R: number, op = 0.45): string {
  return (
    arrow(cx - R - 14, cy, cx + R + 14, cy, INK, 1.6).replace(/opacity/g, '') +
    arrow(cx, cy + R + 14, cx, cy - R - 14, INK, 1.6)
  ).replace(/<line/g, `<line opacity="${op}"`);
}

function quadrantLabels(cx: number, cy: number, R: number): string {
  const d = R * 0.78;
  return (
    text(cx + d, cy - d, 'I', { size: 13, op: 0.45 }) +
    text(cx - d, cy - d, 'II', { size: 13, op: 0.45 }) +
    text(cx - d, cy + d + 8, 'III', { size: 13, op: 0.45 }) +
    text(cx + d, cy + d + 8, 'IV', { size: 13, op: 0.45 })
  );
}

// ── kinds ──────────────────────────────────────────────────────────────────

function drawStandard(s: StandardAngle): { svg: string; alt: string } {
  const W = 300, H = 300, cx = 150, cy = 150, R = 100;
  let b = axes(cx, cy, R) + quadrantLabels(cx, cy, R);
  b += circle(cx, cy, R, INK, 'none', 1, '4 5', 0.3);
  // initial side, drawn heavier than the axis
  b += line(cx, cy, cx + R, cy, INK, 3.5);
  const [tx, ty] = pt(cx, cy, R, s.deg);
  b += line(cx, cy, tx, ty, AMB, 3.5) + dot(tx, ty, 5, AMB);
  const turns = Math.abs(s.deg) > 360;
  if (turns) {
    b += spiral(cx, cy, 26, s.deg, AMB);
  } else {
    const r = 34;
    b += path(arcPath(cx, cy, r, 0, s.deg), AMB, 2.5);
    const [ex, ey] = pt(cx, cy, r, s.deg);
    const [px, py] = pt(cx, cy, r, s.deg - Math.sign(s.deg) * 6);
    b += head(px, py, ex, ey, AMB, 2.5);
  }
  const label = s.label ?? `${s.deg}°`;
  // Put the label half-way round, outside the arc.
  if (turns) {
    const rEnd = 26 + (Math.abs(s.deg) / 360) * 13;
    const [lx, ly] = pt(cx, cy, rEnd + 22, s.deg - Math.sign(s.deg) * 28);
    b += text(lx, ly + 5, label, { size: 15, fill: AMB });
  } else {
    const [lx, ly] = pt(cx, cy, 58, s.deg / 2);
    b += text(lx, ly + 5, label, { size: 15, fill: AMB });
  }
  if (s.ref) {
    const norm = ((s.deg % 360) + 360) % 360;
    const axis = norm > 90 && norm < 270 ? 180 : norm >= 270 ? 360 : 0;
    const r = 52;
    const a1 = Math.min(norm, axis), a2 = Math.max(norm, axis);
    b += path(arcPath(cx, cy, r, a1, a2), EMR, 2.5, 'none', '4 3');
    const below = norm > 180;
    // tucked inside the circle beside the axis, on the side away from the ray
    b += text(axis === 180 ? cx - R + 2 : cx + R - 2, cy + (below ? -10 : 20), 'ref = ?', {
      size: 13, fill: EMR, anchor: axis === 180 ? 'start' : 'end',
    });
    if (axis === 180) b += line(cx, cy, cx - R, cy, EMR, 2, '4 3');
  }
  if (s.parts) {
    b += text(cx + 60, cy + 18, 'initial side', { size: 12, anchor: 'middle', op: 0.8 });
    const [mx, my] = pt(cx, cy, R + 22, s.deg);
    b += text(mx, my + 4, 'terminal side', { size: 12, fill: AMB });
    b += text(cx - 6, cy + 16, 'vertex', { size: 12, anchor: 'end', op: 0.8 });
  }
  return svg(W, H, `An angle of ${label} in standard position`, b);
}

function drawUnit(s: UnitCircle): { svg: string; alt: string } {
  const W = 300, H = 300, cx = 150, cy = 150, R = 100;
  let b = axes(cx, cy, R) + circle(cx, cy, R, INK, 'none', 2);
  for (const [x, y, l, ax, ay] of [
    [cx + R, cy, '1', 0, 16], [cx - R, cy, '−1', 0, 16], [cx, cy - R, '1', -12, 4], [cx, cy + R, '−1', -14, 4],
  ] as [number, number, string, number, number][]) {
    b += line(x - (ax ? 0 : 0), y - (ax ? 5 : 0), x, y + (ax ? 5 : 0), INK, 1.5, undefined, 0.5);
    b += text(x + ax, y + ay, l, { size: 11, op: 0.6 });
  }
  if (s.diag) {
    b += line(cx - R - 8, cy + R + 8, cx + R + 8, cy - R - 8, VIO, 1.5, '5 4');
    b += text(cx + R - 8, cy - R - 10, 'y = x', { size: 12, fill: VIO });
  }
  if (s.rangeArc) {
    const { from, to, label } = s.rangeArc;
    b += path(arcPath(cx, cy, R, from, to), EMR, 7, 'none', undefined, 0.85);
    if (label) b += text(cx, H - 6, label, { size: 12, fill: EMR });
  }
  if (s.hline) {
    const y = cy - s.hline.y * R;
    b += line(cx - R - 10, y, cx + R + 10, y, ROSE, 2, '6 4');
    b += text(cx, 16, s.hline.label, { size: 12, fill: ROSE });
  }
  if (s.vline) {
    const x = cx + s.vline.x * R;
    b += line(x, cy - R - 10, x, cy + R + 10, ROSE, 2, '6 4');
    b += text(cx, 16, s.vline.label, { size: 12, fill: ROSE });
  }
  s.angles.forEach((a, i) => {
    const col = a.color ?? (i === 0 ? AMB : i === 1 ? SKY : VIO);
    const [px, py] = pt(cx, cy, R, a.deg);
    b += line(cx, cy, px, py, col, 3);
    b += dot(px, py, 5.5, col);
    const r = 30;
    if (i === 0) {
      if (Math.abs(a.deg) > 1) b += path(arcPath(cx, cy, r, 0, a.deg), col, 2);
      if (a.label && Math.abs(a.deg) <= 1) {
        b += text(cx + 40, cy - 10, a.label, { size: 13, fill: col });
      } else if (a.label && Math.abs(a.deg) < 40) {
        const [lx, ly] = pt(cx, cy, r + 8, a.deg / 2);
        b += text(lx + 2, ly + 5, a.label, { size: 13, fill: col, anchor: 'start' });
      } else if (a.label) {
        const [lx, ly] = pt(cx, cy, r + 15, a.deg / 2);
        b += text(lx, ly + 5, a.label, { size: 13, fill: col });
      }
    } else if (a.label && !a.point) {
      // later angles are named beside their point, where nothing else sits
      const [lx, ly] = pt(cx, cy, R + 20, a.deg);
      b += text(lx, ly + 5, a.label, { size: 13, fill: col });
    }
    if (a.point) {
      const w = a.point.length * 7.5;
      const right = Math.cos(rad(a.deg)) >= 0;
      const oy = Math.sin(rad(a.deg)) >= 0 ? -10 : 18;
      if ((right && px + 10 + w <= W - 2) || (!right && px - 10 - w >= 2)) {
        b += text(px + (right ? 10 : -10), py + oy, a.point, { size: 13, fill: col, anchor: right ? 'start' : 'end' });
      } else {
        // no room beside the point: centre it above or below instead
        const x = Math.min(W - w / 2 - 2, Math.max(w / 2 + 2, px));
        b += text(x, py + (oy < 0 ? -12 : 22), a.point, { size: 13, fill: col });
      }
    }
    if (i === 0 && s.legs) {
      b += line(px, py, px, cy, SKY, 2, '5 4');
      b += line(cx, cy, px, cy, EMR, 3);
      if (s.legs.y) {
        const w = s.legs.y.length * 7.5;
        const outside = px >= cx ? px + 10 + w <= W - 2 : px - 10 - w >= 2;
        // straight up the axis, the arc label sits to the right: go left
        const right = Math.abs(px - cx) < 12 ? false : outside ? px >= cx : px < cx;
        b += text(px + (right ? 10 : -10), (py + cy) / 2 + 5, s.legs.y, { size: 13, fill: SKY, anchor: right ? 'start' : 'end' });
      }
      if (s.legs.x) b += text((cx + px) / 2, cy + (py <= cy ? 18 : -8), s.legs.x, { size: 13, fill: EMR });
      if (s.legs.r) {
        const [mx, my] = pt(cx, cy, R / 2, a.deg);
        const nx = -Math.sin(rad(a.deg)) * 12, ny = -Math.cos(rad(a.deg)) * 12;
        b += text(mx + nx, my + ny + 4, s.legs.r, { size: 13, fill: col });
      }
    }
  });
  if (s.radius && !s.legs?.r && s.angles[0]) {
    const a = s.angles[0].deg;
    const [mx, my] = pt(cx, cy, R / 2, a);
    const nx = -Math.sin(rad(a)) * 12, ny = -Math.cos(rad(a)) * 12;
    b += text(mx + nx, my + ny + 4, s.radius, { size: 13, fill: AMB });
  }
  const names = s.angles.map((a) => a.label || `${a.deg}°`).filter((n) => n.trim()).join(', ');
  return svg(W, H, `The unit circle with the angle${s.angles.length > 1 ? 's' : ''} ${names} marked`, b);
}

function drawRight(s: RightTriangle): { svg: string; alt: string } {
  const W = 360, H = 250;
  const shape = s.shape ?? { opp: 3, adj: 4 };
  const scale = Math.min(215 / shape.adj, 150 / shape.opp);
  const adj = shape.adj * scale, opp = shape.opp * scale;
  const Cx = 80 + Math.max(0, (215 - adj) / 2) + adj, Cy = 195;
  const Ax = Cx - adj, Ay = Cy, Bx = Cx, By = Cy - opp;
  let b = '';
  if (s.ground) b += line(30, Cy + 6, W - 30, Cy + 6, INK, 2.5, undefined, 0.5);
  if (s.eye) {
    // the observer's instrument sits above the ground: show that step at A
    b += line(Ax, Ay, Ax, Cy + 26, INK, 2, '4 3');
    b += line(30, Cy + 26, W - 30, Cy + 26, INK, 2.5, undefined, 0.5);
    b += line(Cx, Cy, Cx, Cy + 26, INK, 2, '4 3');
    b += text(Ax - 8, Cy + 20, s.eye, { size: 12, anchor: 'end', op: 0.8 });
  }
  b += polygon([[Ax, Ay], [Bx, By], [Cx, Cy]], AMB, `${AMB}22`, 3);
  b += path(`M ${f(Cx - 14)} ${f(Cy)} L ${f(Cx - 14)} ${f(Cy - 14)} L ${f(Cx)} ${f(Cy - 14)}`, INK, 1.8);
  const angleAt = s.angleAt ?? 'A';
  if (s.angle) {
    if (angleAt === 'A') {
      const A = Math.atan2(opp, adj) * (180 / Math.PI);
      b += path(arcPath(Ax, Ay, 30, 0, A), SKY, 2.5);
      if (A < 20) {
        // too flat for a label inside: put it just above the hypotenuse
        const [lx, ly] = pt(Ax, Ay, 62, A / 2 + 14);
        b += text(lx, ly + 5, s.angle, { size: 14, fill: SKY, anchor: 'start' });
      } else if (A < 60) {
        const [lx, ly] = pt(Ax, Ay, 36, A / 2);
        b += text(lx + 2, ly + 5, s.angle, { size: 14, fill: SKY, anchor: 'start' });
      } else {
        const [lx, ly] = pt(Ax, Ay, 48, A / 2);
        b += text(lx, ly + 5, s.angle, { size: 14, fill: SKY });
      }
    } else {
      const Bang = Math.atan2(adj, opp) * (180 / Math.PI);
      b += path(arcPath(Bx, By, 30, 270, 270 - Bang), SKY, 2.5);
      const [lx, ly] = pt(Bx, By, 48, 270 - Bang / 2);
      b += text(lx, ly + 5, s.angle, { size: 14, fill: SKY });
    }
  }
  if (s.depression) {
    b += line(Bx, By, Bx - adj - 10, By, INK, 2, '6 4', 0.7);
    const Bang = Math.atan2(opp, adj) * (180 / Math.PI);
    b += path(arcPath(Bx, By, 34, 180, 180 + Bang), SKY, 2.5);
    const [lx, ly] = pt(Bx, By, 56, 180 + Bang / 2);
    b += text(lx, ly + 5, s.depression, { size: 14, fill: SKY });
  }
  if (s.adj) b += text((Ax + Cx) / 2, Cy + (s.ground || s.eye ? 22 : 20) + (s.eye ? 18 : 0), s.adj, { size: 14 });
  if (s.opp) b += text(Cx + 10, (By + Cy) / 2 + 5, s.opp, { size: 14, anchor: 'start' });
  if (s.hyp) {
    const mx = (Ax + Bx) / 2, my = (Ay + By) / 2;
    const nx = -opp / Math.hypot(opp, adj), ny = -adj / Math.hypot(opp, adj);
    b += text(mx + nx * 16, my + ny * 16 + 5, s.hyp, { size: 14 });
  }
  const n = s.names ?? {};
  if (n.A) b += text(Ax - 12, Ay + 5, n.A, { size: 13, op: 0.8 });
  if (n.B) b += text(Bx + 2, By - 10, n.B, { size: 13, op: 0.8 });
  if (n.C) b += text(Cx + 12, Cy + 16, n.C, { size: 13, op: 0.8 });
  const parts = [s.opp && `opposite ${s.opp}`, s.adj && `adjacent ${s.adj}`, s.hyp && `hypotenuse ${s.hyp}`].filter(Boolean).join(', ');
  return svg(W, H, `A right triangle with ${parts || 'its sides labelled'}`, b);
}

function drawSector(s: Sector): { svg: string; alt: string } {
  // wider than the circle needs, so an arc label on the far side has room
  const W = 340, H = 300, cx = 170, cy = 150, R = 100;
  let b = circle(cx, cy, R, INK, 'none', 2, undefined, 0.5);
  const [ex, ey] = pt(cx, cy, R, s.deg);
  if (s.shade) {
    b += path(`M ${cx} ${cy} L ${cx + R} ${cy} ${arcPath(cx, cy, R, 0, s.deg).replace(/^M[^A]*/, '')} Z`, 'none', 0, `${AMB}33`);
  }
  b += line(cx, cy, cx + R, cy, INK, 2.5) + line(cx, cy, ex, ey, INK, 2.5);
  b += path(arcPath(cx, cy, R, 0, s.deg), AMB, 5);
  b += path(arcPath(cx, cy, 30, 0, Math.min(s.deg, 355)), SKY, 2.2);
  if (s.deg < 90) {
    const [lx, ly] = pt(cx, cy, 38, s.deg / 2);
    b += text(lx + 2, ly + 5, s.angle, { size: 14, fill: SKY, anchor: 'start' });
  } else {
    const [lx, ly] = pt(cx, cy, 50, s.deg / 2);
    b += text(lx, ly + 5, s.angle, { size: 14, fill: SKY });
  }
  // radius label sits half-way along the initial radius, just below it
  b += text(cx + R / 2, cy + 18, s.r, { size: 14 });
  if (s.arc) {
    const mid = s.deg / 2;
    const [ax, ay] = pt(cx, cy, R + 12, mid);
    const right = Math.cos(rad(mid)) >= 0;
    b += text(ax + (right ? 2 : -2), ay + 5, s.arc, { size: 14, fill: AMB, anchor: right ? 'start' : 'end' });
  }
  if (s.area) {
    const [ax, ay] = pt(cx, cy, R * 0.62, s.deg / 2);
    b += text(ax, ay + 5, s.area, { size: 13, fill: AMB });
  }
  b += dot(cx, cy, 4);
  return svg(W, H, `A circle of radius ${s.r} with a central angle of ${s.angle}`, b);
}

function drawWave(s: Wave): { svg: string; alt: string } {
  const W = 360, H = 236;
  const labelled = s.curves.filter((c) => c.label).length;
  const L = 44, Rm = 18, T = 20 + labelled * 14, B = 44;
  const xMin = s.xMin ?? 0, xMax = s.xMax;
  let yMin = s.yMin, yMax = s.yMax;
  if (yMin === undefined || yMax === undefined) {
    let lo = Infinity, hi = -Infinity;
    for (const c of s.curves) {
      const a = Math.abs(c.a ?? 1), k = c.k ?? 0;
      const span = c.fn === 'tan' || c.fn === 'sec' ? 3 : a;
      lo = Math.min(lo, k - span); hi = Math.max(hi, k + span);
    }
    if (s.hline) { lo = Math.min(lo, s.hline.y); hi = Math.max(hi, s.hline.y); }
    const pad = (hi - lo) * 0.18 || 1;
    yMin = yMin ?? Math.min(0, lo - pad); yMax = yMax ?? Math.max(0, hi + pad);
  }
  const X = (x: number) => L + ((x - xMin) / (xMax - xMin)) * (W - L - Rm);
  const Y = (y: number) => T + ((yMax! - y) / (yMax! - yMin!)) * (H - T - B);
  let b = '';
  // axes
  const y0 = Y(0);
  b += arrow(L - 8, y0, W - 6, y0, INK, 1.5).replace(/<line/g, '<line opacity="0.55"');
  b += arrow(L, H - B + 6, L, T - 8, INK, 1.5).replace(/<line/g, '<line opacity="0.55"');
  // x ticks
  const span = xMax - xMin;
  const step = s.xStep ?? (s.unit === 'deg' ? (span > 360 ? 180 : 90) : s.unit === 'rad' ? (span > 2 * Math.PI ? Math.PI : Math.PI / 2) : span / 4);
  for (let x = xMin + step; x <= xMax + 1e-9; x += step) {
    const px = X(x);
    b += line(px, y0 - 4, px, y0 + 4, INK, 1.2, undefined, 0.6);
    let lab: string;
    if (s.unit === 'deg') lab = `${Math.round(x)}°`;
    else if (s.unit === 'rad') {
      const q = Math.round(x / (Math.PI / 2));
      lab = q === 2 ? 'π' : q === 4 ? '2π' : q % 2 === 0 ? `${q / 2}π` : q === 1 ? 'π/2' : `${q}π/2`;
    } else lab = f(x);
    b += text(px, H - B + 18, lab, { size: 11, op: 0.75 });
  }
  // y ticks: max and min of first curve, plus midline
  const c0 = s.curves[0];
  const a0 = Math.abs(c0.a ?? 1), k0 = c0.k ?? 0;
  for (const yv of [k0 + a0, k0, k0 - a0]) {
    if (yv < yMin! || yv > yMax! || c0.fn === 'tan') continue;
    b += line(L - 4, Y(yv), L + 4, Y(yv), INK, 1.2, undefined, 0.6);
    b += text(L - 8, Y(yv) + 4, f(yv), { size: 11, anchor: 'end', op: 0.75 });
  }
  // curves
  const N = 260;
  s.curves.forEach((c, i) => {
    const col = c.color ?? (i === 0 ? AMB : i === 1 ? SKY : VIO);
    const a = c.a ?? 1, bb = c.b ?? 1, h = c.h ?? 0, k = c.k ?? 0;
    const toRad = s.unit === 'deg' ? rad : (x: number) => x;
    let d = '';
    let pen = false;
    for (let i2 = 0; i2 <= N; i2++) {
      const x = xMin + ((xMax - xMin) * i2) / N;
      const u = toRad(bb * (x - h));
      let y: number;
      if (c.fn === 'sin') y = a * Math.sin(u) + k;
      else if (c.fn === 'cos') y = a * Math.cos(u) + k;
      else if (c.fn === 'tan') y = a * Math.tan(u) + k;
      else y = a / Math.cos(u) + k;
      if (!isFinite(y) || y > yMax! + 1 || y < yMin! - 1) { pen = false; continue; }
      d += `${pen ? ' L' : ' M'} ${f(X(x))} ${f(Y(y))}`;
      pen = true;
    }
    b += path(d.trim(), col, 2.6);
    if (c.label) b += text(W - Rm - 2, 14 + i * 14, c.label, { size: 12, fill: col, anchor: 'end' });
    if (s.asymptotes && (c.fn === 'tan' || c.fn === 'sec')) {
      // where cos(u) = 0: u = π/2 + nπ
      const per = s.unit === 'deg' ? 180 / bb : Math.PI / bb;
      const first = h + per / 2;
      for (let x = first - per * 10; x <= xMax; x += per) {
        if (x < xMin) continue;
        b += line(X(x), T, X(x), H - B, ROSE, 1.5, '5 4');
      }
    }
  });
  if (s.midline !== undefined) {
    b += line(L, Y(k0), W - Rm, Y(k0), EMR, 1.8, '6 4');
    b += text(W - Rm - 2, Y(k0) - 6, s.midline, { size: 12, fill: EMR, anchor: 'end' });
  }
  if (s.amplitude !== undefined) {
    const per = s.unit === 'deg' ? 360 / (c0.b ?? 1) : (2 * Math.PI) / (c0.b ?? 1);
    const amp = c0.a ?? 1;
    const peak = (c0.h ?? 0) + (c0.fn === 'cos' ? 0 : per / 4);
    // second peak, else the first trough, else the first peak — anything but
    // the spot where the max marker sits
    const spots = [
      { x: peak + per, y: k0 + amp },
      { x: peak + per / 2, y: k0 - amp },
      { x: peak, y: k0 + amp },
    ].filter((p) => p.x >= xMin && p.x <= xMax);
    const spot = spots[0] ?? { x: xMin + per / 4, y: k0 + amp };
    const xa = spot.x;
    const top = spot.y;
    b += line(X(xa), Y(k0), X(xa), Y(top), SKY, 2.2);
    b += line(X(xa) - 5, Y(top), X(xa) + 5, Y(top), SKY, 2.2);
    b += line(X(xa) - 5, Y(k0), X(xa) + 5, Y(k0), SKY, 2.2);
    b += text(X(xa) + 9, (Y(k0) + Y(top)) / 2 + 4, s.amplitude, { size: 12, fill: SKY, anchor: 'start' });
  }
  if (s.period !== undefined) {
    const per = s.unit === 'deg' ? 360 / (c0.b ?? 1) : (2 * Math.PI) / (c0.b ?? 1);
    const x1 = c0.h ?? 0, x2 = x1 + per;
    const yy = T + 6;
    b += line(X(x1), yy, X(x2), yy, VIO, 2.2);
    b += line(X(x1), yy - 5, X(x1), yy + 5, VIO, 2.2) + line(X(x2), yy - 5, X(x2), yy + 5, VIO, 2.2);
    b += text((X(x1) + X(x2)) / 2, yy - 4 + 12 + 2, s.period, { size: 12, fill: VIO });
  }
  if (s.max !== undefined || s.min !== undefined) {
    const per = s.unit === 'deg' ? 360 / (c0.b ?? 1) : (2 * Math.PI) / (c0.b ?? 1);
    const sgn = (c0.a ?? 1) >= 0 ? 1 : -1;
    const xmax = (c0.h ?? 0) + (c0.fn === 'cos' ? (sgn > 0 ? 0 : per / 2) : sgn > 0 ? per / 4 : (3 * per) / 4);
    const xmin = xmax + per / 2;
    const mark = (xx: number, yy: number, label: string, below: boolean) => {
      const nearAxis = X(xx) < L + 30;
      b += dot(X(xx), yy, 5, ROSE);
      // a dot at the very top gets its label beside it, not on the curve
      if (below && !nearAxis && yy < T + 34) b += text(X(xx) + 9, yy + 4, label, { size: 12, fill: ROSE, anchor: 'start' });
      else b += text(nearAxis ? X(xx) + 9 : X(xx), below ? yy + 20 : yy - 10, label, { size: 12, fill: ROSE, anchor: nearAxis ? 'start' : 'middle' });
    };
    if (s.max !== undefined) { const xx = xmax >= xMin ? xmax : xmax + per; const yy = Y(k0 + a0); mark(xx, yy, s.max, yy < T + 34); }
    if (s.min !== undefined) { const xx = xmin <= xMax ? xmin : xmin - per; mark(xx, Y(k0 - a0), s.min, true); }
  }
  if (s.zeros) {
    const per = s.unit === 'deg' ? 360 / (c0.b ?? 1) : (2 * Math.PI) / (c0.b ?? 1);
    const start = (c0.h ?? 0) + (c0.fn === 'cos' ? per / 4 : 0);
    for (let x = start; x <= xMax + 1e-9; x += per / 2) if (x >= xMin) b += dot(X(x), Y(k0), 5, ROSE);
  }
  if (s.hline) {
    b += line(L, Y(s.hline.y), W - Rm, Y(s.hline.y), ROSE, 1.8, '6 4');
    b += text(L + 6, Y(s.hline.y) - 6, s.hline.label, { size: 12, fill: ROSE, anchor: 'start' });
  }
  for (const p of s.points ?? []) {
    b += dot(X(p.x), Y(p.y), 5, ROSE);
    b += text(X(p.x), Y(p.y) - 10, p.label, { size: 12, fill: ROSE });
  }
  if (s.xLabel) b += text((L + W - Rm) / 2, H - B + 36, s.xLabel, { size: 12, op: 0.75 });
  if (s.yLabel) b += text(L + 8, T + 2, s.yLabel, { size: 12, anchor: 'start', op: 0.75 });
  const names = s.curves.map((c) => c.label ?? `a ${c.fn} wave`).join(' and ');
  const marks = [s.max, s.min, s.midline, s.amplitude, s.period, s.hline?.label].filter(Boolean).join(', ');
  return svg(W, H, `Graph of ${names}${marks ? `, with ${marks} marked` : ''}`, b);
}

/** Solve a triangle from any three parts (at least one side). Angles in degrees. */
function solveTriangle(g: Triangle['shape']): { a: number; b: number; c: number; A: number; B: number; C: number } {
  let { a, b, c, A, B, C } = g;
  const d2r = rad, r2d = (r: number) => (r * 180) / Math.PI;
  const cosLaw = (x: number, y: number, ang: number) => Math.sqrt(x * x + y * y - 2 * x * y * Math.cos(d2r(ang)));
  const angFromSides = (opp: number, x: number, y: number) => r2d(Math.acos((x * x + y * y - opp * opp) / (2 * x * y)));
  // SSS
  if (a !== undefined && b !== undefined && c !== undefined) {
    A = angFromSides(a, b, c); B = angFromSides(b, a, c); C = 180 - A - B;
    return { a, b, c, A, B, C };
  }
  // SAS
  if (a !== undefined && b !== undefined && C !== undefined) { c = cosLaw(a, b, C); return solveTriangle({ a, b, c }); }
  if (a !== undefined && c !== undefined && B !== undefined) { b = cosLaw(a, c, B); return solveTriangle({ a, b, c }); }
  if (b !== undefined && c !== undefined && A !== undefined) { a = cosLaw(b, c, A); return solveTriangle({ a, b, c }); }
  // two angles + a side
  const angles = [A, B, C].filter((x) => x !== undefined).length;
  if (angles >= 2) {
    if (A === undefined) A = 180 - B! - C!;
    if (B === undefined) B = 180 - A - C!;
    if (C === undefined) C = 180 - A - B;
    const side = a !== undefined ? a / Math.sin(d2r(A)) : b !== undefined ? b / Math.sin(d2r(B)) : c! / Math.sin(d2r(C));
    return { a: side * Math.sin(d2r(A)), b: side * Math.sin(d2r(B)), c: side * Math.sin(d2r(C)), A, B, C };
  }
  // SSA: take the acute solution
  if (A !== undefined && a !== undefined && b !== undefined) {
    B = r2d(Math.asin((b * Math.sin(d2r(A))) / a)); C = 180 - A - B;
    return solveTriangle({ a, b, A, B, C });
  }
  throw new Error('triangle: not enough to fix the shape');
}

function drawTriangle(s: Triangle): { svg: string; alt: string } {
  const W = 360, H = 250;
  const t = solveTriangle(s.shape);
  // A bottom-left, B bottom-right, C above.
  const Cx0 = t.b * Math.cos(rad(t.A)), Cy0 = t.b * Math.sin(rad(t.A));
  const minX = Math.min(0, Cx0), maxX = Math.max(t.c, Cx0);
  const scale = Math.min(250 / (maxX - minX), 150 / Cy0);
  const ox = 55 + (250 - (maxX - minX) * scale) / 2 - minX * scale;
  const baseY = 200;
  const A: [number, number] = [ox, baseY];
  const B: [number, number] = [ox + t.c * scale, baseY];
  const C: [number, number] = [ox + Cx0 * scale, baseY - Cy0 * scale];
  let b = polygon([A, B, C], AMB, `${AMB}22`, 3);
  const names = s.names ?? ['A', 'B', 'C'];
  b += text(A[0] - 12, A[1] + 16, names[0], { size: 13, op: 0.85 });
  b += text(B[0] + 12, B[1] + 16, names[1], { size: 13, op: 0.85 });
  b += text(C[0], C[1] - 10, names[2], { size: 13, op: 0.85 });
  const side = (P: [number, number], Q: [number, number], label: string | undefined, away: [number, number]) => {
    if (!label) return '';
    const mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2;
    // push the label away from the triangle's centroid
    const dx = mx - away[0], dy = my - away[1];
    const n = Math.hypot(dx, dy) || 1;
    const off = label.length > 3 ? 24 : 18;
    return text(mx + (dx / n) * off, my + (dy / n) * off + 5, label, { size: 14, fill: label.includes('?') ? ROSE : INK });
  };
  const G: [number, number] = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  b += side(B, C, s.labels.a, G) + side(A, C, s.labels.b, G) + side(A, B, s.labels.c, G);
  // an algebraic angle label does not fit beside its arc: name the angle there
  // and spell it out underneath
  const captions: string[] = [];
  const angleLabel = (which: 'A' | 'B' | 'C', label: string | undefined): string | undefined => {
    if (!label || label.length <= 5) return label;
    captions.push(`∠${names['ABC'.indexOf(which)]} = ${label}`);
    return names['ABC'.indexOf(which)];
  };
  const la = angleLabel('A', s.labels.A), lb = angleLabel('B', s.labels.B), lc = angleLabel('C', s.labels.C);
  const angle = (P: [number, number], from: number, sweep: number, label: string | undefined) => {
    if (!label) return '';
    const col = label.includes('?') ? ROSE : SKY;
    const r = 22;
    let out = path(arcPath(P[0], P[1], r, from, from + sweep), col, 2.2);
    const [lx, ly] = pt(P[0], P[1], r + 20, from + sweep / 2);
    out += text(lx, ly + 5, label, { size: 13, fill: col });
    return out;
  };
  b += angle(A, 0, t.A, la);
  b += angle(B, 180 - t.B, t.B, lb);
  const dirCA = Math.atan2(-(A[1] - C[1]), A[0] - C[0]) * (180 / Math.PI);
  b += angle(C, dirCA, t.C, lc);
  for (const side of s.equal ?? []) {
    const [P, Q] = side === 'a' ? [B, C] : side === 'b' ? [A, C] : [A, B];
    const ang = Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * (180 / Math.PI);
    b += TICK((P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2, ang, AMB);
  }
  if (s.exterior) {
    const V = s.exterior.at === 'A' ? A : s.exterior.at === 'B' ? B : C;
    const from = s.exterior.at === 'A' ? B : s.exterior.at === 'B' ? A : A;
    const dir = Math.atan2(-(V[1] - from[1]), V[0] - from[0]) * (180 / Math.PI);
    const [ex, ey] = pt(V[0], V[1], 70, dir);
    b += line(V[0], V[1], ex, ey, INK, 2, '5 4');
    const other = s.exterior.at === 'A' ? C : s.exterior.at === 'B' ? C : B;
    const dOther = Math.atan2(-(other[1] - V[1]), other[0] - V[0]) * (180 / Math.PI);
    let lo = dOther, hi = dir; if (hi < lo) hi += 360; if (hi - lo > 180) { [lo, hi] = [hi, lo + 360]; }
    let exLabel = s.exterior.label;
    if (exLabel.length > 5) { captions.push(`exterior angle at ${names['ABC'.indexOf(s.exterior.at)]} = ${exLabel}`); exLabel = 'ext'; }
    b += angleArc(V[0], V[1], lo, hi, exLabel, 26, EMR);
  }
  if (captions.length) b += text(W / 2, H - 8, captions.join(' · '), { size: 11, op: 0.85 });
  if (s.midsegment) {
    const M1: [number, number] = [(C[0] + A[0]) / 2, (C[1] + A[1]) / 2], M2: [number, number] = [(C[0] + B[0]) / 2, (C[1] + B[1]) / 2];
    b += line(M1[0], M1[1], M2[0], M2[1], SKY, 2.5) + dot(M1[0], M1[1], 4, SKY) + dot(M2[0], M2[1], 4, SKY);
    b += text((M1[0] + M2[0]) / 2, (M1[1] + M2[1]) / 2 - 8, s.midsegment, { size: 13, fill: SKY });
  }
  if (s.height) {
    b += line(C[0], C[1], C[0], baseY, EMR, 2, '5 4');
    b += text(C[0] + 16, (C[1] + baseY) / 2 + 4, s.height, { size: 13, fill: EMR, anchor: 'start' });
  }
  const given = Object.entries(s.labels).filter(([, v]) => v).map(([k, v]) => `${k} = ${v}`).join(', ');
  const nm = names.every((n) => n.length === 1) ? names.join('') : names.join(', ');
  return svg(W, H, `Triangle ${nm} with ${given}`, b);
}

function drawSSA(s: SSA): { svg: string; alt: string } {
  const W = 360, H = 250;
  const scale = Math.min(170 / s.b, 110 / (s.b * Math.sin(rad(s.A))));
  const A: [number, number] = [60, 200];
  const C: [number, number] = [A[0] + s.b * scale * Math.cos(rad(s.A)), A[1] - s.b * scale * Math.sin(rad(s.A))];
  const r = s.a * scale;
  // where the swing of a meets the base ray
  const h = C[1] - A[1]; // negative
  const dx = Math.sqrt(Math.max(0, r * r - h * h));
  const B1: [number, number] = [C[0] - dx, A[1]];
  const B2: [number, number] = [C[0] + dx, A[1]];
  let b = line(A[0], A[1], W - 30, A[1], INK, 2, undefined, 0.6);
  b += line(A[0], A[1], C[0], C[1], AMB, 3);
  b += path(arcPath(C[0], C[1], r, 200, 340), SKY, 1.8, 'none', '5 4');
  b += line(C[0], C[1], B1[0], B1[1], SKY, 2.5) + line(C[0], C[1], B2[0], B2[1], SKY, 2.5);
  b += dot(B1[0], B1[1], 5, ROSE) + dot(B2[0], B2[1], 5, ROSE) + dot(C[0], C[1], 4.5) + dot(A[0], A[1], 4.5);
  b += path(arcPath(A[0], A[1], 24, 0, s.A), SKY, 2.2);
  const [lx, ly] = pt(A[0], A[1], 44, s.A / 2);
  b += text(lx, ly + 5, s.labels?.A ?? `${s.A}°`, { size: 13, fill: SKY });
  b += text((A[0] + C[0]) / 2 - 12, (A[1] + C[1]) / 2 - 6, s.labels?.b ?? `b = ${s.b}`, { size: 13, fill: AMB, anchor: 'end' });
  b += text((C[0] + B2[0]) / 2 + 14, (C[1] + B2[1]) / 2, s.labels?.a ?? `a = ${s.a}`, { size: 13, fill: SKY, anchor: 'start' });
  b += text(B1[0], B1[1] + 20, 'B₁', { size: 12, fill: ROSE }) + text(B2[0], B2[1] + 20, 'B₂', { size: 12, fill: ROSE });
  b += text(C[0], C[1] - 10, 'C', { size: 13, op: 0.85 }) + text(A[0] - 12, A[1] + 16, 'A', { size: 13, op: 0.85 });
  return svg(W, H, `Angle A with side b fixed and side a swinging to two possible positions for B`, b);
}

function drawClock(s: Clock): { svg: string; alt: string } {
  const W = 300, H = 300, cx = 150, cy = 150, R = 105;
  let b = circle(cx, cy, R, INK, 'none', 2.5);
  const hourAngle = (h: number) => 90 - h * 30;
  for (let h = 1; h <= 12; h++) {
    const [x1, y1] = pt(cx, cy, R - 10, hourAngle(h));
    const [x2, y2] = pt(cx, cy, R, hourAngle(h));
    b += line(x1, y1, x2, y2, INK, 2);
    const [tx, ty] = pt(cx, cy, R - 24, hourAngle(h));
    b += text(tx, ty + 5, String(h), { size: 13, op: 0.8 });
  }
  b += path(`M ${cx} ${cy} L ${f(pt(cx, cy, R - 34, hourAngle(s.from))[0])} ${f(pt(cx, cy, R - 34, hourAngle(s.from))[1])} ${arcPath(cx, cy, R - 34, hourAngle(s.from), hourAngle(s.to)).replace(/^M[^A]*/, '')} Z`, 'none', 0, `${AMB}33`);
  const [fx, fy] = pt(cx, cy, R - 40, hourAngle(s.from));
  b += line(cx, cy, fx, fy, INK, 3, '5 4', 0.5);
  const [hx, hy] = pt(cx, cy, R - 40, hourAngle(s.to));
  b += line(cx, cy, hx, hy, AMB, 5) + dot(cx, cy, 5);
  b += path(arcPath(cx, cy, 40, hourAngle(s.from), hourAngle(s.to)), AMB, 2.5);
  const [lx, ly] = pt(cx, cy, 58, (hourAngle(s.from) + hourAngle(s.to)) / 2);
  b += text(lx, ly + 5, s.label ?? '?', { size: 15, fill: AMB });
  return svg(W, H, `A clock face with the hour hand swept from ${s.from} to ${s.to}`, b);
}

function drawCompass(s: Compass): { svg: string; alt: string } {
  const W = 300, H = 300, cx = 150, cy = 150, R = 100;
  let b = circle(cx, cy, R, INK, 'none', 2, undefined, 0.6);
  for (const [lab, ang] of [['N', 90], ['E', 0], ['S', 270], ['W', 180]] as [string, number][]) {
    const [x, y] = pt(cx, cy, R + 18, ang);
    b += text(x, y + 5, lab, { size: 14, op: 0.85 });
    const [x1, y1] = pt(cx, cy, R, ang);
    b += line(cx, cy, x1, y1, INK, 1.5, '4 4', 0.4);
  }
  b += line(cx, cy, cx, cy - R, INK, 3.5);
  const math = 90 - s.deg;
  const [tx, ty] = pt(cx, cy, R, math);
  b += arrow(cx, cy, tx, ty, AMB, 3.5);
  b += path(arcPath(cx, cy, 44, 90, math), AMB, 2.5);
  const [lx, ly] = pt(cx, cy, 64, (90 + math) / 2);
  b += text(lx, ly + 5, s.label, { size: 14, fill: AMB });
  b += text(cx, cy + R + 40, 'bearings turn clockwise from north', { size: 11, op: 0.7 });
  return svg(W, H, `A compass with a bearing of ${s.label} measured clockwise from north`, b);
}

function drawQuadrants(): { svg: string; alt: string } {
  const W = 300, H = 300, cx = 150, cy = 150, R = 100;
  let b = axes(cx, cy, R, 0.7) + circle(cx, cy, R, INK, 'none', 1.5, '4 5', 0.35);
  const cell = (dx: number, dy: number, name: string, sx: string, sy: string) => {
    const x = cx + dx * 62, y = cy + dy * 62;
    return (
      text(x, y - 12, name, { size: 16, fill: AMB }) +
      text(x, y + 10, `x ${sx}`, { size: 13 }) +
      text(x, y + 28, `y ${sy}`, { size: 13 })
    );
  };
  b += cell(1, -1, 'I', '> 0', '> 0') + cell(-1, -1, 'II', '< 0', '> 0') + cell(-1, 1, 'III', '< 0', '< 0') + cell(1, 1, 'IV', '> 0', '< 0');
  b += text(cx, H - 8, 'cos θ takes the sign of x, sin θ of y', { size: 11, op: 0.75 });
  return svg(W, H, 'The four quadrants with the sign of x and y in each', b);
}

function drawFerris(s: Ferris): { svg: string; alt: string } {
  const W = 360, H = 260, cx = 122, cy = 118, R = 88;
  const groundY = cy + R + 26;
  let b = line(20, groundY, W - 20, groundY, INK, 2.5, undefined, 0.6);
  b += circle(cx, cy, R, AMB, `${AMB}18`, 3);
  for (let k = 0; k < 8; k++) {
    const [x, y] = pt(cx, cy, R, k * 45);
    b += line(cx, cy, x, y, AMB, 1.2, undefined, 0.6);
  }
  b += dot(cx, cy, 5, AMB);
  b += line(cx - 40, groundY, cx, cy, INK, 2, undefined, 0.5) + line(cx + 40, groundY, cx, cy, INK, 2, undefined, 0.5);
  // diameter
  b += line(cx - R, cy, cx + R, cy, SKY, 2, '5 4');
  b += text(cx, cy - 8, s.diameter, { size: 13, fill: SKY });
  // clearance
  b += line(cx + R + 22, cy + R, cx + R + 22, groundY, EMR, 2);
  b += text(cx + R + 28, (cy + R + groundY) / 2 + 4, s.clearance, { size: 12, fill: EMR, anchor: 'start' });
  b += dot(cx, cy + R, 5, ROSE) + text(cx, cy + R + 18, 'you board here', { size: 11, fill: ROSE });
  if (s.centre) {
    b += line(cx + R + 60, cy, cx + R + 60, groundY, VIO, 2);
    b += text(cx + R + 66, (cy + groundY) / 2 + 4, s.centre, { size: 12, fill: VIO, anchor: 'start' });
  }
  if (s.period) b += text(W / 2, groundY + 22, s.period, { size: 12, op: 0.8 });
  return svg(W, H, `A Ferris wheel, ${s.diameter}, with its lowest seat ${s.clearance} above the ground`, b);
}

export function renderAngleFigure(fig: AngleFigure): { svg: string; alt: string } {
  switch (fig.kind) {
    case 'pair': case 'transversal': case 'polygon': case 'quad': case 'circle': case 'shape': case 'similar': case 'grid':
      return renderGeoFigure(fig);
    case 'standard': return drawStandard(fig);
    case 'unit': return drawUnit(fig);
    case 'right': return drawRight(fig);
    case 'sector': return drawSector(fig);
    case 'wave': return drawWave(fig);
    case 'triangle': return drawTriangle(fig);
    case 'ssa': return drawSSA(fig);
    case 'clock': return drawClock(fig);
    case 'compass': return drawCompass(fig);
    case 'quadrants': return drawQuadrants();
    case 'ferris': return drawFerris(fig);
  }
}

// ── geometry kinds ─────────────────────────────────────────────────────────

/** Two angles in a relationship: a corner, a line, a crossing, a shared ray. */
export interface AnglePair {
  kind: 'pair';
  variant: 'complementary' | 'linear' | 'vertical' | 'adjacent' | 'bisector' | 'named' | 'supp-comp';
  a?: string;
  b?: string;
  /** The whole angle, for adjacent/bisector. */
  total?: string;
  /** The angle drawn (degrees) for the first part, so the picture is honest. */
  deg?: number;
}

export interface TransversalAngle {
  at: 'U' | 'L';
  q: 'NE' | 'NW' | 'SW' | 'SE';
  label: string;
}

/** Two lines cut by a transversal, with chosen angles labelled. */
export interface Transversal {
  kind: 'transversal';
  angles: TransversalAngle[];
  /** Arrow marks saying the lines are parallel (default true). */
  parallel?: boolean;
  caption?: string;
}

/** A regular polygon. */
export interface Polygon {
  kind: 'polygon';
  n: number;
  interior?: string;
  exterior?: string;
  /** Diagonals from one vertex, cutting it into triangles. */
  fan?: boolean;
  /** Only three consecutive sides, so the count is not given away. */
  partial?: boolean;
  side?: string;
  caption?: string;
}

/** A quadrilateral with its parts labelled. */
export interface Quad {
  kind: 'quad';
  variant: 'parallelogram' | 'trapezoid' | 'rectangle' | 'rhombus' | 'rect-rhombus' | 'rhombus-diagonals';
  labels?: Record<string, string>;
  names?: [string, string, string, string];
}

/** A circle theorem set up. */
export interface CircleFig {
  kind: 'circle';
  variant: 'slices' | 'central-inscribed' | 'semicircle' | 'chord' | 'tangent' | 'cyclic';
  n?: number;
  labels?: Record<string, string>;
}

export interface GridPoint { x: number; y: number; label?: string; color?: string }
/** A coordinate grid with points, arrows and lines. */
export interface Grid {
  kind: 'grid';
  points: GridPoint[];
  /** [from, to] indices into points; a dashed arrow with an optional label. */
  arrows?: { from: number; to: number; label?: string }[];
  /** Solid segment between two points, labelled. */
  segments?: { from: number; to: number; label?: string }[];
  /** Line through two points, extended. */
  lines?: { from: number; to: number; label?: string; color?: string; dashed?: boolean }[];
  /** A rotation arc about the origin from one point to another. */
  arcs?: { from: number; to: number; label?: string }[];
  /** Join the points in order as a polygon. */
  polygon?: boolean;
  range?: { x: [number, number]; y: [number, number] };
}

/** A shape whose area or a length is asked for. */
export interface Shape {
  kind: 'shape';
  variant:
    | 'triangle' | 'parallelogram' | 'trapezoid' | 'circle' | 'lshape' | 'pentagon'
    | 'square-circle' | 'rect-semicircle' | 'square-quarter' | 'rectangle' | 'square'
    | 'no-triangle' | 'scale';
  labels?: Record<string, string>;
  /** Proportions, where the labels are not numbers. */
  dims?: Record<string, number>;
}

/** Two similar triangles, or a shadow set-up. */
export interface Similar {
  kind: 'similar';
  variant: 'angles' | 'sides' | 'shadow' | 'sas' | 'inside' | 'areas';
  labels?: Record<string, string>;
}

export type GeoFigure = AnglePair | Transversal | Polygon | Quad | CircleFig | Grid | Shape | Similar;

const TICK = (x: number, y: number, ang: number, col = INK): string => {
  const [dx, dy] = [Math.cos(rad(ang + 90)) * 5, -Math.sin(rad(ang + 90)) * 5];
  return line(x - dx, y - dy, x + dx, y + dy, col, 2.2);
};

function rightMark(x: number, y: number, dirA: number, dirB: number, s = 12): string {
  const [ax, ay] = [Math.cos(rad(dirA)) * s, -Math.sin(rad(dirA)) * s];
  const [bx, by] = [Math.cos(rad(dirB)) * s, -Math.sin(rad(dirB)) * s];
  return path(`M ${f(x + ax)} ${f(y + ay)} L ${f(x + ax + bx)} ${f(y + ay + by)} L ${f(x + bx)} ${f(y + by)}`, INK, 1.8);
}

function angleArc(x: number, y: number, from: number, to: number, label: string | undefined, r = 26, col = SKY): string {
  let out = path(arcPath(x, y, r, from, to), col, 2.4);
  if (label) {
    const mid = (from + to) / 2;
    const [lx, ly] = pt(x, y, r + 18 + (label.length > 4 ? 6 : 0), mid);
    out += text(lx, ly + 5, label, { size: 13, fill: label.includes('?') ? ROSE : col });
  }
  return out;
}

function drawPair(s: AnglePair): { svg: string; alt: string } {
  const W = 360, H = 240;
  let b = '';
  const V: [number, number] = [150, 180];
  const ray = (ang: number, len = 150, col = INK) => {
    const [x, y] = pt(V[0], V[1], len, ang);
    return line(V[0], V[1], x, y, col, 3);
  };
  // An algebraic label does not fit beside an arc: number the arc instead and
  // spell the labels out underneath.
  const notes: string[] = [];
  const short = (label: string | undefined, n: number): string | undefined => {
    if (!label || label.length <= 4) return label;
    notes.push(`∠${n} = ${label}`);
    return String(n);
  };
  const a = short(s.a, 1), bl = short(s.b, 2);
  const cap = () => {
    if (s.total) notes.push(`whole angle = ${s.total}`);
    return notes.length ? text(W / 2, H - 8, notes.join(' · '), { size: 11, op: 0.85 }) : '';
  };
  switch (s.variant) {
    case 'complementary': {
      const d = s.deg ?? 35;
      b += ray(0) + ray(90) + ray(d, 140, AMB) + rightMark(V[0], V[1], 0, 90);
      b += angleArc(V[0], V[1], 0, d, a, 40) + angleArc(V[0], V[1], d, 90, bl, 58, EMR) + cap();
      return svg(W, H, `Two angles sharing a ray inside a right angle: ${s.a} and ${s.b}`, b);
    }
    case 'linear': {
      const d = s.deg ?? 110;
      b += line(20, V[1], 340, V[1], INK, 3) + ray(d, 130, AMB);
      b += angleArc(V[0], V[1], 0, d, a, 36) + angleArc(V[0], V[1], d, 180, bl, 52, EMR) + cap();
      return svg(W, H, `Two angles on a straight line: ${s.a} and ${s.b}`, b);
    }
    case 'vertical': {
      const d = s.deg ?? 65;
      const C: [number, number] = [180, 125];
      const l = (ang: number) => {
        const [x1, y1] = pt(C[0], C[1], 150, ang);
        const [x2, y2] = pt(C[0], C[1], 150, ang + 180);
        return line(x1, y1, x2, y2, INK, 3);
      };
      b += l(0) + l(d);
      b += angleArc(C[0], C[1], 0, d, a, 34) + angleArc(C[0], C[1], 180, 180 + d, bl, 34, EMR) + cap();
      return svg(W, H, `Two lines crossing, with the angles opposite each other marked: ${s.a} and ${s.b}`, b);
    }
    case 'adjacent':
    case 'bisector': {
      const d1 = s.deg ?? 32, d2 = s.variant === 'bisector' ? d1 : 41;
      b += ray(0) + ray(d1, 140, AMB) + ray(d1 + d2);
      b += angleArc(V[0], V[1], 0, d1, a, 40) + angleArc(V[0], V[1], d1, d1 + d2, bl, 62, EMR);
      if (s.variant === 'bisector') {
        for (const [ang, r] of [[d1 / 2, 40], [d1 + d2 / 2, 58]] as [number, number][]) {
          const [x, y] = pt(V[0], V[1], r, ang);
          b += TICK(x, y, ang + 90, SKY);
        }
      }
      if (s.total) b += path(arcPath(V[0], V[1], 100, 0, d1 + d2), ROSE, 2, 'none', '5 4');
      const [ax, ay] = pt(V[0], V[1], 162, 0), [dx, dy] = pt(V[0], V[1], 150, d1), [cx2, cy2] = pt(V[0], V[1], 162, d1 + d2);
      b += text(ax, ay + 5, 'A', { size: 13, op: 0.8 }) + text(dx + 8, dy, 'D', { size: 13, fill: AMB }) + text(cx2, cy2, 'C', { size: 13, op: 0.8 });
      b += text(V[0] - 10, V[1] + 16, 'B', { size: 13, op: 0.8 });
      b += cap();
      return svg(W, H, `Ray BD inside angle ABC, splitting it into ${s.a} and ${s.b}`, b);
    }
    case 'named': {
      b += ray(0) + ray(50);
      const [ax, ay] = pt(V[0], V[1], 110, 0), [cx2, cy2] = pt(V[0], V[1], 110, 50);
      b += dot(ax, ay, 4.5) + dot(cx2, cy2, 4.5) + dot(V[0], V[1], 4.5, AMB);
      b += text(ax, ay + 20, 'A', { size: 15 }) + text(cx2 + 14, cy2, 'C', { size: 15 }) + text(V[0] - 12, V[1] + 16, 'B', { size: 15, fill: AMB });
      b += angleArc(V[0], V[1], 0, 50, '?', 30);
      return svg(W, H, 'An angle with vertex B whose sides pass through A and C', b);
    }
    case 'supp-comp': {
      const d = s.deg ?? 40;
      const Lp: [number, number] = [80, 170], R: [number, number] = [230, 170];
      const rayAt = (P: [number, number], ang: number, len: number, col = INK) => { const [x, y] = pt(P[0], P[1], len, ang); return line(P[0], P[1], x, y, col, 3); };
      b += rayAt(Lp, 0, 90) + rayAt(Lp, 90, 90) + rayAt(Lp, d, 85, AMB) + rightMark(Lp[0], Lp[1], 0, 90);
      b += angleArc(Lp[0], Lp[1], 0, d, 'θ', 30, AMB) + angleArc(Lp[0], Lp[1], d, 90, 'complement', 48, EMR);
      b += line(R[0] - 10, R[1], R[0] + 120, R[1], INK, 3) + rayAt(R, d, 85, AMB);
      b += angleArc(R[0], R[1], 0, d, 'θ', 30, AMB) + angleArc(R[0], R[1], d, 180, 'supplement', 48, ROSE);
      b += text(Lp[0] + 40, 218, 'adds to 90°', { size: 12, op: 0.75 }) + text(R[0] + 50, 218, 'adds to 180°', { size: 12, op: 0.75 });
      return svg(W, H, 'The same angle with its complement (to 90°) and its supplement (to 180°)', b);
    }
  }
}

function drawTransversal(s: Transversal): { svg: string; alt: string } {
  const W = 360, H = 260;
  const ang = 62;
  const mid: [number, number] = [180, 140];
  const yU = 90, yL = 190;
  const xAt = (y: number) => mid[0] + ((mid[1] - y) / Math.sin(rad(ang))) * Math.cos(rad(ang));
  const U: [number, number] = [xAt(yU), yU], L: [number, number] = [xAt(yL), yL];
  let b = line(30, yU, 330, yU, INK, 3) + line(30, yL, 330, yL, INK, 3);
  const [tx1, ty1] = pt(mid[0], mid[1], 118, ang), [tx2, ty2] = pt(mid[0], mid[1], 118, ang + 180);
  b += line(tx1, ty1, tx2, ty2, AMB, 3);
  if (s.parallel !== false) {
    for (const y of [yU, yL]) b += head(280, y, 300, y, INK, 2.2) + head(290, y, 310, y, INK, 2.2);
  } else {
    b += text(320, yU - 10, 'parallel?', { size: 12, fill: ROSE, anchor: 'end' });
  }
  const spans: Record<string, [number, number]> = { NE: [0, ang], NW: [ang, 180], SW: [180, 180 + ang], SE: [180 + ang, 360] };
  const notes: string[] = [];
  s.angles.forEach((a, i) => {
    const P = a.at === 'U' ? U : L;
    const [from, to] = spans[a.q];
    const col = i === 0 ? SKY : EMR;
    b += path(arcPath(P[0], P[1], 22, from, to), col, 2.4);
    let label = a.label;
    if (label.length > 4) { notes.push(`∠${i + 1} = ${label}`); label = String(i + 1); }
    const [lx, ly] = pt(P[0], P[1], 44, (from + to) / 2);
    b += text(lx, ly + 5, label, { size: 13, fill: label.includes('?') ? ROSE : col });
  });
  const cap = [s.caption, notes.join(' · ')].filter(Boolean).join('   ');
  if (cap) b += text(W / 2, H - 10, cap, { size: 12, op: 0.85 });
  const named = s.angles.map((a) => a.label).join(' and ');
  return svg(W, H, `Two lines cut by a transversal, with the angles ${named} marked`, b);
}

function drawPolygon(s: Polygon): { svg: string; alt: string } {
  const W = 300, H = 280, cx = 150, cy = 140, R = 95;
  const start = -90 + 180 / s.n;
  const verts: [number, number][] = Array.from({ length: s.n }, (_, k) => pt(cx, cy, R, start + (k * 360) / s.n));
  let b = '';
  const inner = 180 - 360 / s.n;
  if (s.partial) {
    // three sides only, with the ends trailing off
    const p = verts.slice(0, 4);
    b += path('M ' + p.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L '), AMB, 3);
    const tail = (P: [number, number], Q: [number, number]) => line(P[0], P[1], P[0] + (P[0] - Q[0]) * 0.6, P[1] + (P[1] - Q[1]) * 0.6, AMB, 3, '4 6');
    b += tail(p[0], p[1]) + tail(p[3], p[2]);
    const V = verts[1];
    const dA = Math.atan2(-(verts[0][1] - V[1]), verts[0][0] - V[0]) * (180 / Math.PI);
    const dB = Math.atan2(-(verts[2][1] - V[1]), verts[2][0] - V[0]) * (180 / Math.PI);
    if (s.interior) b += angleArc(V[0], V[1], dB, dB + inner, s.interior, 24);
    void dA;
  } else {
    b += polygon(verts, AMB, `${AMB}18`, 3);
    if (s.fan) for (let k = 2; k < s.n - 1; k++) b += line(verts[0][0], verts[0][1], verts[k][0], verts[k][1], SKY, 1.8, '5 4');
    if (s.interior) {
      const V = verts[1];
      const dB = Math.atan2(-(verts[2][1] - V[1]), verts[2][0] - V[0]) * (180 / Math.PI);
      b += angleArc(V[0], V[1], dB, dB + inner, s.interior, 22);
    }
    if (s.exterior) {
      const V = verts[1], P = verts[0];
      const dir = Math.atan2(-(V[1] - P[1]), V[0] - P[0]) * (180 / Math.PI);
      const [ex, ey] = pt(V[0], V[1], 60, dir);
      b += line(V[0], V[1], ex, ey, INK, 2, '5 4');
      const dB = Math.atan2(-(verts[2][1] - V[1]), verts[2][0] - V[0]) * (180 / Math.PI);
      b += angleArc(V[0], V[1], dir, dB + 360 * (dB < dir ? 1 : 0), s.exterior, 24, EMR);
    }
    if (s.side) b += text((verts[0][0] + verts[s.n - 1][0]) / 2, (verts[0][1] + verts[s.n - 1][1]) / 2 - 8, s.side, { size: 13 });
  }
  if (s.caption) b += text(cx, H - 8, s.caption, { size: 12, op: 0.85 });
  return svg(W, H, `A regular polygon with ${s.partial ? 'some of its' : s.n} sides${s.interior ? `, interior angle ${s.interior}` : ''}${s.exterior ? `, exterior angle ${s.exterior}` : ''}`, b);
}

function drawQuad(s: Quad): { svg: string; alt: string } {
  const W = 360, H = 240;
  const L = s.labels ?? {};
  const names = s.names ?? ['A', 'B', 'C', 'D'];
  let b = '';
  const nameAt = (P: [number, number], n: string, dx: number, dy: number) => text(P[0] + dx, P[1] + dy, n, { size: 13, op: 0.85 });
  if (s.variant === 'parallelogram' || s.variant === 'rhombus' || s.variant === 'rhombus-diagonals') {
    const A: [number, number] = [60, 190], B: [number, number] = [230, 190], C: [number, number] = [300, 70], D: [number, number] = [130, 70];
    const rh = s.variant !== 'parallelogram';
    const pts = rh ? ([[70, 130], [180, 200], [290, 130], [180, 60]] as [number, number][]) : [A, B, C, D];
    b += polygon(pts, AMB, `${AMB}18`, 3);
    if (s.variant === 'rhombus-diagonals') {
      b += line(pts[0][0], pts[0][1], pts[2][0], pts[2][1], SKY, 2, '5 4') + line(pts[1][0], pts[1][1], pts[3][0], pts[3][1], SKY, 2, '5 4');
      b += rightMark(180, 130, 0, 90, 10);
      for (const [P, Q] of [[pts[0], [180, 130]], [[180, 130], pts[2]]] as [[number, number], [number, number]][]) b += TICK((P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2, 0, SKY);
      for (const [P, Q] of [[pts[1], [180, 130]], [[180, 130], pts[3]]] as [[number, number], [number, number]][]) { b += TICK((P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2, 90, SKY); b += TICK((P[0] + Q[0]) / 2 + 3, (P[1] + Q[1]) / 2, 90, SKY); }
      b += text(180, 226, 'diagonals bisect each other at 90°, but are not equal', { size: 11, op: 0.8 });
    }
    b += nameAt(pts[0], names[0], -14, 6) + nameAt(pts[1], names[1], rh ? 0 : 14, rh ? 18 : 6) + nameAt(pts[2], names[2], 14, rh ? 6 : -4) + nameAt(pts[3], names[3], rh ? 0 : -14, rh ? -10 : -4);
    if (!rh) {
      if (L.A) b += angleArc(A[0], A[1], 0, 60, L.A, 24);
      if (L.B) b += angleArc(B[0], B[1], 60, 180, L.B, 24, EMR);
      if (L.AB) b += text((A[0] + B[0]) / 2, A[1] + 20, L.AB, { size: 13 });
      if (L.CD) b += text((C[0] + D[0]) / 2, C[1] - 10, L.CD, { size: 13, fill: L.CD.includes('?') ? ROSE : INK });
      b += head(130, 190, 150, 190, INK, 2) + head(200, 70, 220, 70, INK, 2);
    }
    const what = s.variant === 'parallelogram' ? 'Parallelogram' : 'Rhombus';
    const how = s.variant === 'rhombus-diagonals' ? 'with both diagonals drawn' : 'with its parts labelled';
    return svg(W, H, `${what} ${names.join('')}, ${how}`, b);
  }
  if (s.variant === 'trapezoid') {
    const A: [number, number] = [50, 190], B: [number, number] = [310, 190], C: [number, number] = [250, 70], D: [number, number] = [110, 70];
    b += polygon([A, B, C, D], AMB, `${AMB}18`, 3);
    if (L.mid) {
      const M1: [number, number] = [(A[0] + D[0]) / 2, 130], M2: [number, number] = [(B[0] + C[0]) / 2, 130];
      b += line(M1[0], M1[1], M2[0], M2[1], SKY, 2.5, '6 4') + dot(M1[0], M1[1], 4, SKY) + dot(M2[0], M2[1], 4, SKY);
      b += text(180, 124, L.mid, { size: 13, fill: L.mid.includes('?') ? ROSE : SKY });
    }
    if (L.top) b += text(180, 60, L.top, { size: 13 });
    if (L.bottom) b += text(180, 212, L.bottom, { size: 13 });
    if (L.h) { b += line(250, 70, 250, 190, EMR, 2, '5 4'); b += text(262, 135, L.h, { size: 13, fill: EMR, anchor: 'start' }); }
    return svg(W, H, `A trapezoid with parallel sides ${L.top} and ${L.bottom}`, b);
  }
  // rectangle vs rhombus, side by side, each with its diagonals
  const rect: [number, number][] = [[30, 170], [170, 170], [170, 80], [30, 80]];
  const rhom: [number, number][] = [[200, 125], [265, 185], [330, 125], [265, 65]];
  b += polygon(rect, AMB, `${AMB}18`, 3) + polygon(rhom, SKY, `${SKY}18`, 3);
  b += line(30, 170, 170, 80, INK, 1.8, '5 4') + line(30, 80, 170, 170, INK, 1.8, '5 4');
  b += line(200, 125, 330, 125, INK, 1.8, '5 4') + line(265, 185, 265, 65, INK, 1.8, '5 4');
  b += text(100, 200, 'rectangle', { size: 13, fill: AMB }) + text(265, 210, 'rhombus', { size: 13, fill: SKY });
  return svg(W, H, 'A rectangle and a rhombus, each with both diagonals drawn', b);
}

function drawCircleFig(s: CircleFig): { svg: string; alt: string } {
  const W = 320, H = 300, cx = 160, cy = 150, R = 105;
  const L = s.labels ?? {};
  let b = circle(cx, cy, R, INK, 'none', 2.5);
  switch (s.variant) {
    case 'slices': {
      const n = s.n ?? 8;
      for (let k = 0; k < n; k++) { const [x, y] = pt(cx, cy, R, (k * 360) / n); b += line(cx, cy, x, y, INK, 2, undefined, 0.7); }
      b += path(`M ${cx} ${cy} L ${cx + R} ${cy} ${arcPath(cx, cy, R, 0, 360 / n).replace(/^M[^A]*/, '')} Z`, 'none', 0, `${AMB}55`);
      b += angleArc(cx, cy, 0, 360 / n, L.angle ?? '?', 34, AMB);
      return svg(W, H, `A circle cut into ${n} equal slices from the centre, one slice shaded`, b);
    }
    case 'central-inscribed': {
      const a1 = 20, a2 = 100, inscribed = 235;
      const [x1, y1] = pt(cx, cy, R, a1), [x2, y2] = pt(cx, cy, R, a2), [px, py] = pt(cx, cy, R, inscribed);
      b += path(arcPath(cx, cy, R, a1, a2), AMB, 6);
      b += line(cx, cy, x1, y1, INK, 2) + line(cx, cy, x2, y2, INK, 2) + dot(cx, cy, 4);
      b += line(px, py, x1, y1, SKY, 2) + line(px, py, x2, y2, SKY, 2) + dot(px, py, 5, SKY);
      b += angleArc(cx, cy, a1, a2, L.central, 30, AMB);
      const d1 = Math.atan2(-(y1 - py), x1 - px) * (180 / Math.PI), d2 = Math.atan2(-(y2 - py), x2 - px) * (180 / Math.PI);
      b += angleArc(px, py, d1, d2, L.inscribed, 30, SKY);
      b += text(cx, cy + 18, 'O', { size: 12, op: 0.8 });
      return svg(W, H, `A central angle ${L.central} and an inscribed angle ${L.inscribed} on the same arc`, b);
    }
    case 'semicircle': {
      const A: [number, number] = [cx - R, cy], B: [number, number] = [cx + R, cy], C = pt(cx, cy, R, 125);
      b += line(A[0], A[1], B[0], B[1], INK, 2.5) + dot(cx, cy, 4);
      b += line(A[0], A[1], C[0], C[1], SKY, 2.5) + line(B[0], B[1], C[0], C[1], SKY, 2.5);
      b += dot(A[0], A[1], 5) + dot(B[0], B[1], 5) + dot(C[0], C[1], 5, SKY);
      b += text(A[0] - 14, A[1] + 5, 'A', { size: 14 }) + text(B[0] + 14, B[1] + 5, 'B', { size: 14 }) + text(C[0] - 4, C[1] - 12, 'C', { size: 14, fill: SKY });
      const d1 = Math.atan2(-(A[1] - C[1]), A[0] - C[0]) * (180 / Math.PI), d2 = Math.atan2(-(B[1] - C[1]), B[0] - C[0]) * (180 / Math.PI);
      b += angleArc(C[0], C[1], d2, d1 + 360, L.angle ?? '?', 26, SKY);
      b += text(cx, cy + 20, 'diameter', { size: 12, op: 0.75 });
      return svg(W, H, 'A triangle inscribed in a circle with one side a diameter', b);
    }
    case 'chord': {
      const half = 0.923 * R; // 24/26 of the diameter, like the 13-24 chord
      const y = cy - Math.sqrt(R * R - half * half);
      b += line(cx - half, y, cx + half, y, AMB, 3);
      b += line(cx, cy, cx, y, ROSE, 2, '5 4') + rightMark(cx, y, 0, -90, 9);
      b += line(cx, cy, cx + half, y, INK, 2, '4 4', 0.7) + dot(cx, cy, 4);
      if (L.r) b += text(cx + half / 2 + 12, (cy + y) / 2 + 12, L.r, { size: 13 });
      if (L.chord) b += text(cx, y - 10, L.chord, { size: 13, fill: AMB });
      if (L.dist) b += text(cx - 10, (cy + y) / 2 + 5, L.dist, { size: 13, fill: ROSE, anchor: 'end' });
      b += text(cx, cy + 18, 'O', { size: 12, op: 0.8 });
      return svg(W, H, `A chord of ${L.chord} in a circle of radius ${L.r}, with its distance from the centre marked`, b);
    }
    case 'tangent': {
      // the circle sits left so the external point fits on the canvas
      const cxs = cx - 60;
      const P: [number, number] = [W - 26, cy + 10];
      b = circle(cxs, cy, 80, INK, 'none', 2.5);
      const d = Math.hypot(P[0] - cxs, P[1] - cy);
      const ang = Math.atan2(-(P[1] - cy), P[0] - cxs) * (180 / Math.PI) + (Math.acos(80 / d) * 180) / Math.PI;
      const T = pt(cxs, cy, 80, ang);
      b += line(cxs, cy, P[0], P[1], INK, 2, '5 4') + line(P[0], P[1], T[0], T[1], AMB, 3) + line(cxs, cy, T[0], T[1], SKY, 2);
      b += rightMark(T[0], T[1], ang, ang - 90, 9);
      b += dot(cxs, cy, 4) + dot(P[0], P[1], 5) + dot(T[0], T[1], 5, AMB);
      b += text(cxs, cy + 18, 'O', { size: 13 }) + text(P[0] + 4, P[1] + 20, 'P', { size: 13 }) + text(T[0] + 4, T[1] - 12, 'T', { size: 13, fill: AMB });
      if (L.r) b += text((cxs + T[0]) / 2 - 12, (cy + T[1]) / 2 - 6, L.r, { size: 13, fill: SKY });
      if (L.op) b += text((cxs + P[0]) / 2, (cy + P[1]) / 2 + 20, L.op, { size: 13 });
      if (L.pt) b += text((P[0] + T[0]) / 2 + 12, (P[1] + T[1]) / 2 - 8, L.pt, { size: 13, fill: ROSE });
      return svg(W, H, `A tangent from point P touching the circle at T, with OP ${L.op} and radius ${L.r}`, b);
    }
    case 'cyclic': {
      const angs = [160, 60, 340, 250];
      const Ps = angs.map((a) => pt(cx, cy, R, a));
      b += polygon(Ps, AMB, `${AMB}15`, 2.5);
      const nm = ['W', 'X', 'Y', 'Z'];
      Ps.forEach((P, i) => { const [ox, oy] = pt(0, 0, 16, angs[i]); b += dot(P[0], P[1], 4.5) + text(P[0] + ox, P[1] + oy + 5, nm[i], { size: 13 }); });
      const arcAt = (i: number, label: string | undefined, col: string) => {
        if (!label) return '';
        const P = Ps[i], Q = Ps[(i + 3) % 4], Rr = Ps[(i + 1) % 4];
        const d1 = Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * (180 / Math.PI), d2 = Math.atan2(-(Rr[1] - P[1]), Rr[0] - P[0]) * (180 / Math.PI);
        let lo = d1, hi = d2; if (hi < lo) hi += 360; if (hi - lo > 180) { [lo, hi] = [hi, lo + 360]; }
        return angleArc(P[0], P[1], lo, hi, label, 20, col);
      };
      b += arcAt(0, L.W, SKY) + arcAt(2, L.Y, EMR) + arcAt(1, L.X, SKY) + arcAt(3, L.Z, EMR);
      return svg(W, H, 'A quadrilateral with all four corners on a circle', b);
    }
  }
}

function drawGrid(s: Grid): { svg: string; alt: string } {
  const W = 320, H = 300;
  const xs = s.points.map((p) => p.x), ys = s.points.map((p) => p.y);
  const rx = s.range?.x ?? [Math.min(-1, ...xs) - 1, Math.max(1, ...xs) + 1];
  const ry = s.range?.y ?? [Math.min(-1, ...ys) - 1, Math.max(1, ...ys) + 1];
  const pad = 28;
  const unit = Math.min((W - 2 * pad) / (rx[1] - rx[0]), (H - 2 * pad) / (ry[1] - ry[0]));
  const ox = pad + ((W - 2 * pad) - unit * (rx[1] - rx[0])) / 2, oy = pad + ((H - 2 * pad) - unit * (ry[1] - ry[0])) / 2;
  const X = (x: number) => ox + (x - rx[0]) * unit, Y = (y: number) => oy + (ry[1] - y) * unit;
  let b = '';
  for (let x = Math.ceil(rx[0]); x <= rx[1]; x++) b += line(X(x), Y(ry[0]), X(x), Y(ry[1]), INK, 1, undefined, x === 0 ? 0.7 : 0.18);
  for (let y = Math.ceil(ry[0]); y <= ry[1]; y++) b += line(X(rx[0]), Y(y), X(rx[1]), Y(y), INK, 1, undefined, y === 0 ? 0.7 : 0.18);
  const step = unit < 22 ? 2 : 1;
  for (let x = Math.ceil(rx[0]); x <= rx[1]; x += step) if (x !== 0) b += text(X(x), Y(0) + 14, String(x), { size: 10, op: 0.6 });
  for (let y = Math.ceil(ry[0]); y <= ry[1]; y += step) if (y !== 0) b += text(X(0) - 8, Y(y) + 4, String(y), { size: 10, op: 0.6, anchor: 'end' });
  const P = (i: number): [number, number] => [X(s.points[i].x), Y(s.points[i].y)];
  for (const l of s.lines ?? []) {
    const [x1, y1] = P(l.from), [x2, y2] = P(l.to);
    const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1;
    const ex = (dx / n) * 400, ey = (dy / n) * 400;
    b += line(x1 - ex, y1 - ey, x2 + ex, y2 + ey, l.color ?? SKY, 2.2, l.dashed ? '6 4' : undefined);
    if (l.label) {
      const fits = x2 + 10 + l.label.length * 7.2 <= W - 2;
      b += text(fits ? x2 + 10 : x2 - 10, y2 - 8, l.label, { size: 12, fill: l.color ?? SKY, anchor: fits ? 'start' : 'end' });
    }
  }
  if (s.polygon) b += polygon(s.points.map((_, i) => P(i)), AMB, `${AMB}18`, 2.5);
  for (const sg of s.segments ?? []) {
    const [x1, y1] = P(sg.from), [x2, y2] = P(sg.to);
    b += line(x1, y1, x2, y2, AMB, 2.5);
    if (sg.label) b += text((x1 + x2) / 2 + 10, (y1 + y2) / 2 - 8, sg.label, { size: 13, fill: sg.label.includes('?') ? ROSE : AMB, anchor: 'start' });
  }
  for (const a of s.arrows ?? []) {
    const [x1, y1] = P(a.from), [x2, y2] = P(a.to);
    b += arrow(x1, y1, x2, y2, VIO, 2.2) .replace(/<line /, '<line stroke-dasharray="6 4" ');
    if (a.label) b += text((x1 + x2) / 2, (y1 + y2) / 2 - 10, a.label, { size: 12, fill: VIO });
  }
  for (const a of s.arcs ?? []) {
    const [x1, y1] = P(a.from), [x2, y2] = P(a.to);
    const r1 = Math.hypot(x1 - X(0), y1 - Y(0));
    const a1 = Math.atan2(-(y1 - Y(0)), x1 - X(0)) * (180 / Math.PI), a2 = Math.atan2(-(y2 - Y(0)), x2 - X(0)) * (180 / Math.PI);
    b += path(arcPath(X(0), Y(0), r1, a1, a2 < a1 ? a2 + 360 : a2), VIO, 2.2, 'none', '6 4');
    const [ex, ey] = pt(X(0), Y(0), r1, a2), [px, py] = pt(X(0), Y(0), r1, a2 - 6);
    b += head(px, py, ex, ey, VIO, 2.2);
    if (a.label) { const [lx, ly] = pt(X(0), Y(0), r1 + 16, (a1 + (a2 < a1 ? a2 + 360 : a2)) / 2); b += text(lx, ly + 4, a.label, { size: 12, fill: VIO }); }
  }
  s.points.forEach((p, i) => {
    const [x, y] = P(i);
    const col = p.color ?? (i === 0 ? AMB : ROSE);
    b += dot(x, y, 5.5, col);
    if (p.label) {
      // beside the point, on whichever side has room
      const fits = x + 8 + p.label.length * 7.2 <= W - 2;
      b += text(fits ? x + 8 : x - 8, y - 8, p.label, { size: 12, fill: col, anchor: fits ? 'start' : 'end' });
    }
  });
  const named = s.points.filter((p) => p.label).map((p) => p.label).join(', ');
  return svg(W, H, `A coordinate grid showing ${named}`, b);
}

function drawShape(s: Shape): { svg: string; alt: string } {
  const W = 360, H = 240;
  const L = s.labels ?? {};
  const D = s.dims ?? {};
  let b = '';
  const lab = (x: number, y: number, t: string | undefined, col = INK, anchor: 'start' | 'middle' | 'end' = 'middle') =>
    t ? text(x, y, t, { size: 13, fill: t.includes('?') ? ROSE : col, anchor }) : '';
  switch (s.variant) {
    case 'triangle': {
      const bw = D.b ?? 14, hh = D.h ?? 9; const sc = Math.min(240 / bw, 150 / hh);
      const A: [number, number] = [60, 200], B: [number, number] = [60 + bw * sc, 200], C: [number, number] = [60 + bw * sc * 0.42, 200 - hh * sc];
      b += polygon([A, B, C], AMB, `${AMB}18`, 3) + line(C[0], C[1], C[0], 200, EMR, 2, '5 4') + rightMark(C[0], 200, 0, 90, 9);
      b += lab((A[0] + B[0]) / 2, 222, L.b) + lab(C[0] + 10, (C[1] + 200) / 2 + 4, L.h, EMR, 'start') + lab((A[0] + B[0]) / 2, C[1] - 12, L.area, AMB);
      return svg(W, H, `A triangle with base ${L.b} and height ${L.h}`, b);
    }
    case 'parallelogram': {
      const bw = D.b ?? 12, hh = D.h ?? 7; const sc = Math.min(220 / bw, 140 / hh);
      const A: [number, number] = [50, 200], B: [number, number] = [50 + bw * sc, 200], C: [number, number] = [B[0] + 50, 200 - hh * sc], Dd: [number, number] = [100, 200 - hh * sc];
      b += polygon([A, B, C, Dd], AMB, `${AMB}18`, 3) + line(Dd[0], Dd[1], Dd[0], 200, EMR, 2, '5 4') + rightMark(Dd[0], 200, 0, 90, 9);
      b += lab((A[0] + B[0]) / 2, 222, L.b) + lab(Dd[0] + 10, (Dd[1] + 200) / 2 + 4, L.h, EMR, 'start') + lab((A[0] + C[0]) / 2 + 20, (A[1] + C[1]) / 2 + 4, L.area, AMB);
      return svg(W, H, `A parallelogram with base ${L.b} and height ${L.h}`, b);
    }
    case 'trapezoid': {
      const tw = D.top ?? 6, bw = D.bottom ?? 10, hh = D.h ?? 5; const sc = Math.min(240 / bw, 140 / hh);
      const A: [number, number] = [60, 200], B: [number, number] = [60 + bw * sc, 200], off = ((bw - tw) * sc) / 2;
      const C: [number, number] = [B[0] - off, 200 - hh * sc], Dd: [number, number] = [A[0] + off, 200 - hh * sc];
      b += polygon([A, B, C, Dd], AMB, `${AMB}18`, 3) + line(Dd[0], Dd[1], Dd[0], 200, EMR, 2, '5 4') + rightMark(Dd[0], 200, 0, 90, 9);
      b += lab((A[0] + B[0]) / 2, 222, L.bottom) + lab((C[0] + Dd[0]) / 2, Dd[1] - 10, L.top) + lab(Dd[0] + 10, (Dd[1] + 200) / 2 + 4, L.h, EMR, 'start') + lab((A[0] + B[0]) / 2, 150, L.area, AMB);
      return svg(W, H, `A trapezoid with parallel sides ${L.top} and ${L.bottom} and height ${L.h}`, b);
    }
    case 'circle': {
      b += circle(180, 118, 90, AMB, `${AMB}18`, 3) + dot(180, 118, 4);
      if (L.r) { b += line(180, 118, 270, 118, INK, 2.2); b += lab(225, 110, L.r); }
      if (L.d) { b += line(90, 118, 270, 118, INK, 2.2); b += lab(180, 110, L.d); }
      b += lab(180, 228, L.area, AMB);
      return svg(W, H, `A circle with ${L.r ? `radius ${L.r}` : `diameter ${L.d}`}`, b);
    }
    case 'lshape': {
      const sc = 20; const w = (D.w ?? 10) * sc, h = (D.h ?? 6) * sc, cw = (D.cw ?? 4) * sc, ch = (D.ch ?? 3) * sc;
      const x0 = 70, y0 = 200;
      b += polygon([[x0, y0], [x0 + w, y0], [x0 + w, y0 - h + ch], [x0 + w - cw, y0 - h + ch], [x0 + w - cw, y0 - h], [x0, y0 - h]], AMB, `${AMB}18`, 3);
      b += lab(x0 + w / 2, y0 + 20, L.w) + lab(x0 - 10, y0 - h / 2 + 4, L.h, INK, 'end');
      b += lab(x0 + w - cw / 2, y0 - h - 10, L.cw) + lab(x0 + w + 10, y0 - h + ch / 2 + 4, L.ch, INK, 'start');
      b += path(`M ${x0 + w - cw} ${y0 - h} L ${x0 + w} ${y0 - h} L ${x0 + w} ${y0 - h + ch}`, INK, 1.5, 'none', '4 4', 0.5);
      return svg(W, H, `An L-shaped region: a ${L.w} by ${L.h} rectangle with a ${L.cw} by ${L.ch} corner removed`, b);
    }
    case 'pentagon': {
      const cx = 180, cy = 125, R = 92;
      const pts = Array.from({ length: 5 }, (_, k) => pt(cx, cy, R, 90 + k * 72));
      b += polygon(pts, AMB, `${AMB}18`, 3);
      const m: [number, number] = [(pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2];
      b += line(cx, cy, m[0], m[1], EMR, 2, '5 4') + dot(cx, cy, 4) + rightMark(m[0], m[1], 180, 90, 8);
      b += lab(cx + 14, (cy + m[1]) / 2 + 4, L.apothem, EMR, 'start') + lab(m[0], m[1] + 20, L.side);
      return svg(W, H, `A regular pentagon with side ${L.side} and apothem ${L.apothem}`, b);
    }
    case 'square-circle': {
      b += polygon([[80, 30], [280, 30], [280, 230], [80, 230]], AMB, `${AMB}18`, 3) + circle(180, 130, 100, SKY, `${SKY}22`, 2.5);
      b += lab(180, 22, L.side) + lab(180, 135, L.d ?? '', SKY);
      if (L.d) b += line(80, 130, 280, 130, SKY, 1.5, '5 4');
      return svg(W, H, `A square of side ${L.side} with a circle inside touching all four sides`, b);
    }
    case 'rect-semicircle': {
      const w = 120, h = 160, x0 = 120, y0 = 220;
      b += polygon([[x0, y0], [x0 + w, y0], [x0 + w, y0 - h], [x0, y0 - h]], AMB, `${AMB}18`, 3);
      b += path(`${arcPath(x0 + w / 2, y0 - h, w / 2, 0, 180)} Z`, SKY, 2.5, `${SKY}22`);
      b += lab(x0 + w / 2, y0 + 20, L.w) + lab(x0 - 10, y0 - h / 2 + 4, L.h, INK, 'end');
      return svg(W, H, `A ${L.w} wide by ${L.h} tall rectangle with a semicircle on top`, b);
    }
    case 'square-quarter': {
      const s0 = 170, x0 = 95, y0 = 215;
      b += polygon([[x0, y0], [x0 + s0, y0], [x0 + s0, y0 - s0], [x0, y0 - s0]], AMB, `${AMB}18`, 3);
      b += path(`M ${x0} ${y0} L ${x0 + s0} ${y0} ${arcPath(x0, y0, s0, 0, 90).replace(/^M[^A]*/, '')} Z`, SKY, 2.5, `${SKY}33`);
      b += lab(x0 + s0 / 2, y0 + 20, L.side) + lab(x0 + 60, y0 - 40, 'painted', SKY);
      return svg(W, H, `A square of side ${L.side} with a quarter circle drawn from one corner`, b);
    }
    case 'rectangle':
    case 'square': {
      const ww = D.w ?? (s.variant === 'square' ? 1 : 12), hh = D.h ?? (s.variant === 'square' ? 1 : 9); const sc = Math.min(220 / ww, 150 / hh);
      const w = ww * sc, h = hh * sc, x0 = (W - w) / 2, y0 = 200;
      b += polygon([[x0, y0], [x0 + w, y0], [x0 + w, y0 - h], [x0, y0 - h]], AMB, `${AMB}18`, 3);
      if (L.diag) { b += line(x0, y0, x0 + w, y0 - h, SKY, 2.5); b += lab(x0 + w / 2 + 16, y0 - h / 2 - 8, L.diag, SKY, 'start'); }
      b += lab(x0 + w / 2, y0 + 20, L.w ?? L.side) + lab(x0 - 10, y0 - h / 2 + 4, L.h ?? L.side, INK, 'end');
      return svg(W, H, `A ${s.variant} ${L.w ?? L.side} by ${L.h ?? L.side}${L.diag ? ' with its diagonal' : ''}`, b);
    }
    case 'no-triangle': {
      const a = D.a ?? 4, bb = D.b ?? 5, c = D.c ?? 9; const sc = 240 / c;
      const A: [number, number] = [60, 190], B: [number, number] = [60 + c * sc, 190];
      b += line(A[0], A[1], B[0], B[1], AMB, 3) + lab((A[0] + B[0]) / 2, 212, L.c);
      b += path(arcPath(A[0], A[1], a * sc, 10, 120), SKY, 2, 'none', '6 4') + path(arcPath(B[0], B[1], bb * sc, 60, 170), EMR, 2, 'none', '6 4');
      const [ax, ay] = pt(A[0], A[1], a * sc, 70), [bx, by] = pt(B[0], B[1], bb * sc, 110);
      b += line(A[0], A[1], ax, ay, SKY, 3) + line(B[0], B[1], bx, by, EMR, 3);
      b += lab(ax - 10, ay - 6, L.a, SKY, 'end') + lab(bx + 10, by - 6, L.b, EMR, 'start');
      b += text(180, 40, 'the two short sides cannot reach each other', { size: 12, fill: ROSE });
      return svg(W, H, `Sides ${L.a} and ${L.b} swung from the ends of a side ${L.c}, failing to meet`, b);
    }
    case 'scale': {
      b += line(40, 120, 250, 120, AMB, 4) + dot(40, 120, 5) + dot(250, 120, 5) + lab(145, 108, L.map, AMB);
      b += line(40, 190, 100, 190, INK, 3) + line(40, 184, 40, 196, INK, 2) + line(100, 184, 100, 196, INK, 2) + lab(70, 178, L.scale);
      b += lab(145, 150, L.real);
      return svg(W, H, `A map line of ${L.map} beside a scale bar of ${L.scale}`, b);
    }
  }
}

function drawSimilar(s: Similar): { svg: string; alt: string } {
  const W = 360, H = 240;
  const L = s.labels ?? {};
  let b = '';
  const lab = (x: number, y: number, t: string | undefined, col = INK, anchor: 'start' | 'middle' | 'end' = 'middle') =>
    t ? text(x, y, t, { size: 12, fill: t.includes('?') ? ROSE : col, anchor }) : '';
  const tri = (A: [number, number], B: [number, number], C: [number, number], col: string, marks: boolean) => {
    let o = polygon([A, B, C], col, `${col}18`, 2.5);
    if (marks) {
      const arcAt = (P: [number, number], Q: [number, number], Rr: [number, number], r: number, double: boolean) => {
        const d1 = Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * (180 / Math.PI), d2 = Math.atan2(-(Rr[1] - P[1]), Rr[0] - P[0]) * (180 / Math.PI);
        let lo = d1, hi = d2; if (hi < lo) hi += 360; if (hi - lo > 180) { [lo, hi] = [hi, lo + 360]; }
        let oo = path(arcPath(P[0], P[1], r, lo, hi), SKY, 2);
        if (double) oo += path(arcPath(P[0], P[1], r + 5, lo, hi), SKY, 2);
        return oo;
      };
      o += arcAt(A, B, C, 14, false) + arcAt(B, A, C, 14, true);
    }
    return o;
  };
  if (s.variant === 'shadow') {
    const g = 200;
    b += line(20, g, 340, g, INK, 2.5, undefined, 0.5);
    // small object and its shadow, big object and its shadow, sun rays parallel
    const small = { x: 60, h: 50, sh: 34 }, big = { x: 190, h: 140, sh: 95 };
    for (const [o, hl, sl, col] of [[small, L.h1, L.s1, AMB], [big, L.h2, L.s2, SKY]] as [typeof small, string | undefined, string | undefined, string][]) {
      b += line(o.x, g, o.x, g - o.h, col, 4) + line(o.x, g, o.x + o.sh, g, EMR, 4);
      b += line(o.x, g - o.h, o.x + o.sh, g, INK, 1.5, '5 4', 0.6);
      b += lab(o.x - 8, g - o.h / 2 + 4, hl, col, 'end') + lab(o.x + o.sh / 2, g + 18, sl, EMR);
    }
    b += text(300, 40, 'same sun,', { size: 12, op: 0.75 }) + text(300, 56, 'same moment', { size: 12, op: 0.75 });
    return svg(W, H, `Two objects and their shadows at the same moment: ${L.h1} with shadow ${L.s1}, ${L.h2} with shadow ${L.s2}`, b);
  }
  if (s.variant === 'inside') {
    const A: [number, number] = [180, 40], B: [number, number] = [60, 210], C: [number, number] = [320, 210];
    const t = 0.4;
    const Dd: [number, number] = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], E: [number, number] = [A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t];
    b += polygon([A, B, C], AMB, `${AMB}18`, 2.5) + line(Dd[0], Dd[1], E[0], E[1], SKY, 2.5);
    b += head(200, 210, 220, 210, INK, 2) + head((Dd[0] + E[0]) / 2 - 10, Dd[1], (Dd[0] + E[0]) / 2 + 10, Dd[1], INK, 2);
    for (const [P, n, dx, dy] of [[A, 'A', 0, -8], [B, 'B', -12, 6], [C, 'C', 12, 6], [Dd, 'D', -12, 4], [E, 'E', 12, 4]] as [[number, number], string, number, number][]) b += text(P[0] + dx, P[1] + dy, n, { size: 13, op: 0.85 });
    b += lab((A[0] + Dd[0]) / 2 - 14, (A[1] + Dd[1]) / 2, L.AD, INK, 'end') + lab((Dd[0] + B[0]) / 2 - 14, (Dd[1] + B[1]) / 2, L.DB, INK, 'end');
    b += lab((A[0] + E[0]) / 2 + 14, (A[1] + E[1]) / 2, L.AE, INK, 'start') + lab((E[0] + C[0]) / 2 + 14, (E[1] + C[1]) / 2, L.EC, INK, 'start');
    return svg(W, H, `Triangle ABC with DE parallel to BC; AD ${L.AD}, DB ${L.DB}, AE ${L.AE}, EC ${L.EC}`, b);
  }
  // two triangles side by side
  const sm: [[number, number], [number, number], [number, number]] = [[30, 190], [130, 190], [95, 120]];
  const k = 1.6;
  const bg: [[number, number], [number, number], [number, number]] = [[170, 190], [170 + 100 * k, 190], [170 + 65 * k, 190 - 70 * k]];
  b += tri(sm[0], sm[1], sm[2], AMB, s.variant === 'angles' || s.variant === 'sas') + tri(bg[0], bg[1], bg[2], SKY, s.variant === 'angles' || s.variant === 'sas');
  const sideLab = (T: typeof sm, key: string, i: number, j: number, dx: number, dy: number) => {
    const t = L[key];
    const k2 = t && t.length > 3 ? 1.9 : 1;
    return lab((T[i][0] + T[j][0]) / 2 + dx * k2, (T[i][1] + T[j][1]) / 2 + dy, t);
  };
  b += sideLab(sm, 'c1', 0, 1, 0, 18) + sideLab(sm, 'b1', 0, 2, -14, 0) + sideLab(sm, 'a1', 1, 2, 16, 0);
  b += sideLab(bg, 'c2', 0, 1, 0, 18) + sideLab(bg, 'b2', 0, 2, -16, 0) + sideLab(bg, 'a2', 1, 2, 18, 0);
  if (L.n1) b += text(80, 60, L.n1, { size: 13, fill: AMB });
  if (L.n2) b += text(260, 60, L.n2, { size: 13, fill: SKY });
  if (L.area1) b += text(90, 172, L.area1, { size: 12, fill: AMB });
  if (L.area2) b += text(270, 160, L.area2, { size: 12, fill: L.area2.includes('?') ? ROSE : SKY });
  if (L.caption) b += text(W / 2, H - 10, L.caption, { size: 12, op: 0.8 });
  return svg(W, H, `Two similar triangles, ${L.n1 ?? 'small'} and ${L.n2 ?? 'large'}`, b);
}

export function renderGeoFigure(fig: GeoFigure): { svg: string; alt: string } {
  switch (fig.kind) {
    case 'pair': return drawPair(fig);
    case 'transversal': return drawTransversal(fig);
    case 'polygon': return drawPolygon(fig);
    case 'quad': return drawQuad(fig);
    case 'circle': return drawCircleFig(fig);
    case 'grid': return drawGrid(fig);
    case 'shape': return drawShape(fig);
    case 'similar': return drawSimilar(fig);
  }
}
