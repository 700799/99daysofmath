/**
 * The drawing primitives every figure is built from: a fixed palette that
 * reads on a light and a dark card, and the handful of SVG shapes the figure
 * modules compose. Ink is `currentColor`, so a figure follows the card's text
 * colour; the accents are fixed hues chosen to work against both.
 */

export const INK = 'currentColor';
export const AMB = '#F59E0B';
export const SKY = '#0EA5E9';
export const EMR = '#10B981';
export const ROSE = '#F43F5E';
export const VIO = '#8B5CF6';
export const FONT = 'Nunito, ui-rounded, system-ui, sans-serif';

export const rad = (d: number) => (d * Math.PI) / 180;
export const f = (n: number) => (Math.round(n * 10) / 10).toString();

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function text(
  x: number,
  y: number,
  s: string,
  opts: { size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; op?: number } = {},
): string {
  const { size = 14, fill = INK, anchor = 'middle', weight = 700, op } = opts;
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<text x="${f(x)}" y="${f(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${o}>${esc(s)}</text>`;
}

export function line(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2, dash?: string, op?: number): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}"${d}${o}/>`;
}

export function circle(cx: number, cy: number, r: number, stroke = INK, fill = 'none', w = 2, dash?: string, op?: number): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : '';
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${d}${o}/>`;
}

export function dot(cx: number, cy: number, r = 4.5, fill = INK): string {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${fill}"/>`;
}

export function path(d: string, stroke = INK, w = 2, fill = 'none', dash?: string, op?: number): string {
  const da = dash ? ` stroke-dasharray="${dash}"` : '';
  const o = op !== undefined ? ` opacity="${op}"` : '';
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${da}${o}/>`;
}

export function polygon(pts: [number, number][], stroke = INK, fill = 'none', w = 2.5): string {
  return `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
}

/** Arrowhead at (x2,y2) pointing along (x1,y1)→(x2,y2). */
export function head(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2, L = 9): string {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const s = 0.5;
  const a = [x2 - L * Math.cos(ang - s), y2 - L * Math.sin(ang - s)];
  const b = [x2 - L * Math.cos(ang + s), y2 - L * Math.sin(ang + s)];
  return line(a[0], a[1], x2, y2, stroke, w) + line(b[0], b[1], x2, y2, stroke, w);
}

export function arrow(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 2): string {
  return line(x1, y1, x2, y2, stroke, w) + head(x1, y1, x2, y2, stroke, w);
}

/** Point at mathematical angle `deg` (counterclockwise, y up) on a circle. */
export function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
}

/** Arc of a circle from angle a1 to a2 (degrees, counterclockwise if a2 > a1). */
export function arcPath(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const [x1, y1] = pt(cx, cy, r, a1);
  const [x2, y2] = pt(cx, cy, r, a2);
  const sweepDeg = a2 - a1;
  const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
  // SVG sweep-flag 1 is clockwise on screen, which is a decreasing math angle.
  const sweep = sweepDeg > 0 ? 0 : 1;
  return `M ${f(x1)} ${f(y1)} A ${f(r)} ${f(r)} 0 ${large} ${sweep} ${f(x2)} ${f(y2)}`;
}

export function svg(w: number, h: number, alt: string, body: string): { svg: string; alt: string } {
  return {
    alt,
    svg:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" ` +
      `font-family="${FONT}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`,
  };
}

export const TICK = (x: number, y: number, ang: number, col = INK): string => {
  const [dx, dy] = [Math.cos(rad(ang + 90)) * 5, -Math.sin(rad(ang + 90)) * 5];
  return line(x - dx, y - dy, x + dx, y + dy, col, 2.2);
};

export function rightMark(x: number, y: number, dirA: number, dirB: number, s = 12): string {
  const [ax, ay] = [Math.cos(rad(dirA)) * s, -Math.sin(rad(dirA)) * s];
  const [bx, by] = [Math.cos(rad(dirB)) * s, -Math.sin(rad(dirB)) * s];
  return path(`M ${f(x + ax)} ${f(y + ay)} L ${f(x + ax + bx)} ${f(y + ay + by)} L ${f(x + bx)} ${f(y + by)}`, INK, 1.8);
}

/** A tick of approval, drawn rather than typed: no font has to have the glyph. */
export function check(x: number, y: number, s = 8, col = EMR): string {
  return path(`M ${f(x - s)} ${f(y)} L ${f(x - s * 0.25)} ${f(y + s * 0.7)} L ${f(x + s)} ${f(y - s * 0.8)}`, col, 2.6);
}

/** A cross, drawn. Used both for "no" and for the marks on a line plot. */
export function cross(x: number, y: number, s = 7, col = ROSE, w = 2.6): string {
  return line(x - s, y - s, x + s, y + s, col, w) + line(x + s, y - s, x - s, y + s, col, w);
}
