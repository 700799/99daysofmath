// The figure that sits beside a slide of a mathematician's story or a math
// story. A figure has to BE the mathematics — a diagram you can reason from, a
// worked line, a count, a construction — never a mood. Shared by every deck
// and story file so they all draw on the same canvas in the same palette.

/** What gets drawn in the illustration pane. */
export type MathFigure =
  /** Typeset mathematics: the identity, sum, or worked line being told. */
  | { kind: 'math'; tex: string[]; caption?: string }
  /** A drawn figure on a fixed 400×320 canvas, in the player's palette. */
  | { kind: 'svg'; svg: string; alt: string; caption?: string };

// The palette the figures are drawn in, against the player's indigo pane.
export const INK = '#ece9ff'; // lines and labels
export const DIM = '#a5b4fc'; // secondary lines, axes, grids
export const HI = '#fbbf24'; // the thing to look at
export const OK = '#34d399'; // a result, a match, a yes
export const NO = '#f472b6'; // a contrast, a failure, a no
export const SKY = '#60a5fa'; // a second series

/** Typeset mathematics. */
export function tex(lines: string[], caption?: string): MathFigure {
  return { kind: 'math', tex: lines, caption };
}

/**
 * A drawn figure. The viewBox is fixed here so every figure scales the same
 * way, and text defaults to readable ink on the dark pane.
 */
export function draw(alt: string, body: string, caption?: string): MathFigure {
  return {
    kind: 'svg',
    alt,
    caption,
    svg:
      `<svg viewBox="0 0 400 320" width="100%" height="100%" ` +
      `font-family="ui-rounded, system-ui, -apple-system, sans-serif" ` +
      `font-weight="700" font-size="15" fill="${INK}" stroke-linecap="round" ` +
      `stroke-linejoin="round">${body}</svg>`,
  };
}

// ── small drawing helpers ──────────────────────────────────────────────────

/** A text label. Widths are checked by the tests, so keep labels short. */
export function label(x: number, y: number, text: string, o: { size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end' } = {}): string {
  return `<text x="${x}" y="${y}" font-size="${o.size ?? 15}" fill="${o.fill ?? INK}" text-anchor="${o.anchor ?? 'middle'}">${text}</text>`;
}

/** A straight line. */
export function line(x1: number, y1: number, x2: number, y2: number, stroke = INK, w = 3, dash?: string): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

/** A line with an arrowhead at its end. */
export function arrow(x1: number, y1: number, x2: number, y2: number, stroke = HI, w = 3): string {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 10;
  const p = (t: number) => `${(x2 - h * Math.cos(a - t)).toFixed(1)},${(y2 - h * Math.sin(a - t)).toFixed(1)}`;
  return line(x1, y1, x2, y2, stroke, w) + `<polygon points="${x2},${y2} ${p(0.5)} ${p(-0.5)}" fill="${stroke}"/>`;
}

/** A small square marking a right angle at (x, y), opening along the axes given. */
export function rightAngle(x: number, y: number, dx: number, dy: number, s = 14, stroke = HI): string {
  return `<path d="M ${x + dx * s} ${y} L ${x + dx * s} ${y + dy * s} L ${x} ${y + dy * s}" fill="none" stroke="${stroke}" stroke-width="2.5"/>`;
}

/** An arc of angle `deg` around (cx, cy), starting at `from` degrees (math convention, y up). */
export function arc(cx: number, cy: number, r: number, from: number, deg: number, stroke = HI, w = 3): string {
  const rad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(from));
  const y1 = cy - r * Math.sin(rad(from));
  const x2 = cx + r * Math.cos(rad(from + deg));
  const y2 = cy - r * Math.sin(rad(from + deg));
  const large = Math.abs(deg) > 180 ? 1 : 0;
  const sweep = deg > 0 ? 0 : 1;
  return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${w}"/>`;
}
