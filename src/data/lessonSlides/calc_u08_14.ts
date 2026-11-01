import type { LessonSlide, SlideArt, SlideBank } from './types';
import type { Axes, Range } from '../slideArt';
import { AMB, EMR, INK, ROSE, SKY, VIO, W, arrow, art, axes, brace, circle, dot, flow, line, path, polygon, rect, rightTriangle, text, walk } from '../slideArt';

// AP Calculus AB slide decks, units 8-14: implicit differentiation and
// related rates, the Mean Value Theorem and curve sketching, optimization and
// motion, Riemann sums, antiderivatives and the Fundamental Theorem,
// u-substitution and area between curves, and volumes with accumulation.
// Every number here matches the lesson in src/data/calc/lessons_u08_14.ts.

// ── drawing kit for calculus ───────────────────────────────────────────────

type Fn = (x: number) => number;
const r1 = (n: number) => (Math.round(n * 10) / 10).toString();

/** A headline on the figure itself. */
const cap = (s: string) => text(W / 2, 16, s, { size: 12, fill: VIO });

/** Axes with a headline above them. */
function grid(r: Range, ticks: { x?: number[]; y?: number[] }, o: { tickText?: (v: number, axis: 'x' | 'y') => string; xLabel?: string; yLabel?: string } = {}): Axes {
  return axes(r, { ticks, grid: true, pad: 30, ...o });
}

/** The region between two curves on [a, b], filled. */
function shade(ax: Axes, top: Fn, bottom: Fn, a: number, b: number, color = AMB, alpha = '33'): string {
  const n = 48;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    pts.push(`${r1(ax.X(x))},${r1(ax.Y(top(x)))}`);
  }
  for (let i = n; i >= 0; i--) {
    const x = a + ((b - a) * i) / n;
    pts.push(`${r1(ax.X(x))},${r1(ax.Y(bottom(x)))}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${color}${alpha}" stroke="none"/>`;
}

/** Riemann rectangles under f on [a, b]: n strips, heights read at the left, right or middle. */
function riemann(ax: Axes, f: Fn, a: number, b: number, n: number, mode: 'left' | 'right' | 'mid', color = SKY): string {
  const d = (b - a) / n;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x0 = a + i * d;
    const xs = mode === 'left' ? x0 : mode === 'right' ? x0 + d : x0 + d / 2;
    const h = f(xs);
    const y1 = ax.Y(Math.max(h, 0));
    const y2 = ax.Y(Math.min(h, 0));
    if (y2 - y1 < 0.5) continue;
    s += `<rect x="${r1(ax.X(x0))}" y="${r1(y1)}" width="${r1(ax.X(x0 + d) - ax.X(x0))}" height="${r1(y2 - y1)}" fill="${color}33" stroke="${color}" stroke-width="1.6"/>`;
  }
  return s;
}

/** Trapezoids under f on [a, b]. */
function trapezoids(ax: Axes, f: Fn, a: number, b: number, n: number, color = EMR): string {
  const d = (b - a) / n;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x0 = a + i * d, x1 = x0 + d;
    s += polygon([[ax.X(x0), ax.Y(0)], [ax.X(x0), ax.Y(f(x0))], [ax.X(x1), ax.Y(f(x1))], [ax.X(x1), ax.Y(0)]], color, `${color}33`, 1.6);
  }
  return s;
}

/** A segment in data coordinates. */
function seg(ax: Axes, x1: number, y1: number, x2: number, y2: number, color = INK, w = 2, dash?: string): string {
  return line(ax.X(x1), ax.Y(y1), ax.X(x2), ax.Y(y2), color, w, dash);
}

/** Text at a data point, nudged by pixels. */
function at(ax: Axes, x: number, y: number, s: string, o: { dx?: number; dy?: number; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end'; op?: number } = {}): string {
  return text(ax.X(x) + (o.dx ?? 0), ax.Y(y) + (o.dy ?? 0), s, { size: o.size ?? 11, fill: o.color ?? INK, anchor: o.anchor ?? 'middle', op: o.op });
}

/** A marked point with a label beside it. */
function mark(ax: Axes, x: number, y: number, label?: string, o: { dx?: number; dy?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; size?: number } = {}): string {
  const col = o.color ?? ROSE;
  return dot(ax.X(x), ax.Y(y), 5, col) + (label ? at(ax, x, y, label, { dx: o.dx ?? 0, dy: o.dy ?? -12, color: col, anchor: o.anchor, size: o.size }) : '');
}

function ell(cx: number, cy: number, rx: number, ry: number, stroke: string, fill = 'none', w = 2, dash?: string): string {
  return `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(Math.max(rx, 0.5))}" ry="${r1(Math.max(ry, 0.5))}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

/** A circle drawn to the axes' own scales. */
function circleOn(ax: Axes, cx: number, cy: number, r: number, color = AMB, fill = 'none'): string {
  return ell(ax.X(cx), ax.Y(cy), ax.X(cx + r) - ax.X(cx), ax.Y(cy) - ax.Y(cy + r), color, fill, 2.8);
}

/**
 * A solid of revolution about the x-axis: the profile f and its mirror, the
 * end discs drawn as ellipses, and one slice highlighted at x = slice. An
 * inner profile turns the slice into a washer.
 */
function solid(ax: Axes, f: Fn, a: number, b: number, o: { inner?: Fn; slice?: number; color?: string } = {}): string {
  const col = o.color ?? AMB;
  const y0 = ax.Y(0);
  let s = shade(ax, f, (x) => -f(x), a, b, col, '22');
  if (o.inner) s += shade(ax, o.inner, (x) => -o.inner!(x), a, b, SKY, '33');
  const within = (g: Fn): Fn => (x) => (x >= a - 1e-9 && x <= b + 1e-9 ? g(x) : NaN);
  s += ax.curve(within(f), col, 2.4) + ax.curve(within((x) => -f(x)), col, 2.4);
  if (o.inner) s += ax.curve(within(o.inner), SKY, 2, '4 3') + ax.curve(within((x) => -o.inner!(x)), SKY, 2, '4 3');
  if (f(a) > 0.01) s += ell(ax.X(a), y0, 11, y0 - ax.Y(f(a)), col, `${col}22`, 2.2);
  s += ell(ax.X(b), y0, 11, y0 - ax.Y(f(b)), col, `${col}22`, 2.2);
  if (o.inner && o.inner(b) > 0.01) s += ell(ax.X(b), y0, 11, y0 - ax.Y(o.inner(b)), SKY, `${SKY}44`, 2);
  if (o.slice !== undefined) {
    const c = o.slice;
    s += ell(ax.X(c), y0, 11, y0 - ax.Y(f(c)), ROSE, `${ROSE}55`, 2.4);
    if (o.inner) s += ell(ax.X(c), y0, 11, y0 - ax.Y(o.inner(c)), SKY, `${SKY}88`, 2.2);
  }
  return s;
}

/** The ladder against the wall. */
function ladder(o: { base: string; wall: string; hyp: string; title: string; caption: string; rates?: boolean; alt: string }): SlideArt {
  const wx = 110, fy = 215, k = 17;
  const bx = wx + 6 * k, ty = fy - 8 * k;
  let b = cap(o.title);
  b += line(wx, 46, wx, fy, INK, 2.4) + line(wx, fy, 370, fy, INK, 2.4);
  for (let y = 56; y < fy; y += 16) b += line(wx - 10, y + 10, wx, y, INK, 1.2, undefined, 0.35);
  for (let x = wx + 10; x < 362; x += 16) b += line(x, fy + 10, x + 10, fy, INK, 1.2, undefined, 0.35);
  b += line(wx, ty, bx, fy, AMB, 4);
  b += dot(wx, ty, 5, ROSE) + dot(bx, fy, 5, EMR);
  b += text((wx + bx) / 2, fy + 24, o.base, { size: 12, fill: EMR });
  b += text(wx - 16, (ty + fy) / 2 + 4, o.wall, { size: 12, fill: ROSE, anchor: 'end' });
  b += text((wx + bx) / 2 + 14, (ty + fy) / 2 - 8, o.hyp, { size: 12, fill: AMB, anchor: 'start' });
  if (o.rates) {
    b += arrow(bx + 10, fy - 14, bx + 50, fy - 14, EMR, 2.2) + text(bx + 30, fy - 22, '1 ft/s', { size: 11, fill: EMR });
    b += arrow(wx + 14, ty + 10, wx + 14, ty + 50, ROSE, 2.2) + text(wx + 22, ty + 36, '?', { size: 13, fill: ROSE, anchor: 'start' });
  }
  return art(o.alt, b, o.caption);
}

/** A conical tank, part full. */
function cone(o: { top: string; height: string; r: string; h: string; level: number; title: string; caption: string; inflow?: string; alt: string }): SlideArt {
  const cx = 200, apexY = 222, rimY = 62, R = 88, Hh = apexY - rimY;
  let b = cap(o.title);
  const wy = apexY - o.level * Hh, wr = R * o.level;
  b += polygon([[cx - wr, wy], [cx + wr, wy], [cx, apexY]], 'none', `${SKY}44`, 0);
  b += ell(cx, wy, wr, wr * 0.16, SKY, `${SKY}66`, 2);
  b += line(cx - R, rimY, cx, apexY, INK, 2.4) + line(cx + R, rimY, cx, apexY, INK, 2.4);
  b += ell(cx, rimY, R, 14, INK, 'none', 2.4);
  b += line(cx, rimY, cx + R, rimY, AMB, 2, '4 3') + text(cx + R / 2, rimY + 16, o.top, { size: 11, fill: AMB });
  b += line(cx + R + 22, rimY, cx + R + 22, apexY, INK, 1.6) + text(cx + R + 30, (rimY + apexY) / 2 + 4, o.height, { size: 11, anchor: 'start' });
  b += line(cx, wy, cx + wr, wy, ROSE, 2) + text(cx + wr / 2, wy - 8, o.r, { size: 11, fill: ROSE });
  b += line(cx, wy, cx, apexY, EMR, 1.6, '4 3');
  const hx = cx - R - 22;
  b += line(hx, wy, hx, apexY, EMR, 2) + line(hx - 5, wy, hx + 5, wy, EMR, 2) + line(hx - 5, apexY, hx + 5, apexY, EMR, 2);
  b += line(hx + 5, wy, cx - wr, wy, EMR, 1.2, '3 3', 0.6);
  b += text(hx - 8, (wy + apexY) / 2 + 4, o.h, { size: 11, fill: EMR, anchor: 'end' });
  if (o.inflow) b += arrow(118, 30, 146, 56, SKY, 2.2) + text(28, 40, o.inflow, { size: 11, fill: SKY, anchor: 'start' });
  return art(o.alt, b, o.caption);
}

/** A sign chart: a line, the points where the sign can change, and the sign in each gap. */
function signChart(lo: number, hi: number, pts: { at: number; label: string }[], regions: { sign: '+' | '−'; word: string }[], o: { title: string; caption: string; alt: string; name?: string }): SlideArt {
  const y = 140, x0 = 70, x1 = 360;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  let b = cap(o.title);
  b += arrow(x0 - 14, y, x1 + 14, y, INK, 2) + arrow(x1 + 14, y, x0 - 14, y, INK, 2);
  b += text(x0 - 30, y + 5, o.name ?? 'f′', { size: 14, fill: VIO, anchor: 'end' });
  const edges = [lo, ...pts.map((p) => p.at), hi];
  regions.forEach((r, i) => {
    const mx = (X(edges[i]) + X(edges[i + 1])) / 2;
    const col = r.sign === '+' ? EMR : ROSE;
    b += text(mx, y - 22, r.sign, { size: 22, fill: col });
    b += text(mx, y + 34, r.word, { size: 11, fill: col });
  });
  for (const p of pts) {
    b += line(X(p.at), y - 10, X(p.at), y + 10, INK, 2);
    b += dot(X(p.at), y, 5, AMB);
    b += text(X(p.at), y + 62, p.label, { size: 12, fill: AMB });
  }
  return art(o.alt, b, o.caption);
}

// ── CALC-8 — Implicit differentiation and related rates ───────────────────

/** An x-range and y-range with the same pixels per unit, so a circle is round. */
const EQ: Range = { x: [-8.6, 9.9], y: [-5.21, 5.21] };

const circleTangent = (): SlideArt => {
  const ax = grid(EQ, { x: [-5, 5], y: [] });
  const t: Fn = (x) => 4 - 0.75 * (x - 3);
  return art(
    'The circle x squared plus y squared equals 25, with its tangent line at the point (3, 4) sloping down to the right',
    cap('x² + y² = 25 and its tangent at (3, 4)') +
      ax.body +
      circleOn(ax, 0, 0, 5, AMB) +
      seg(ax, 1.5, t(1.5), 9.5, t(9.5), ROSE, 2.4) +
      seg(ax, 0, 0, 3, 4, SKY, 2, '4 3') +
      mark(ax, 3, 4, '(3, 4)', { dx: 36, dy: 14, color: ROSE }) +
      at(ax, 7.4, 2.3, 'slope −3/4', { color: ROSE, size: 11 }) +
      at(ax, 7.0, -3.8, 'x² + y² = 25', { color: AMB, size: 11 }),
    'No formula y = … gives the whole circle, yet the tangent slope is easy to find.',
  );
};

const slopeField = (): SlideArt => {
  const ax = grid(EQ, { x: [-5, 5], y: [-5, 5] });
  const tang = (x: number, y: number) => {
    const m = -x / y;
    const dx = 1.1 / Math.sqrt(1 + m * m);
    return seg(ax, x - dx, y - m * dx, x + dx, y + m * dx, ROSE, 2.6) + dot(ax.X(x), ax.Y(y), 4, ROSE);
  };
  return art(
    'The circle with short tangent segments drawn at four points, each with slope minus x over y',
    cap('dy/dx = −x/y: a different slope at every point') +
      ax.body +
      circleOn(ax, 0, 0, 5, AMB) +
      tang(3, 4) + tang(4, -3) + tang(-3, 4) + tang(-4, -3) +
      at(ax, 3, 4, '−3/4', { dx: 28, dy: -8, color: ROSE }) +
      at(ax, 4, -3, '4/3', { dx: 26, dy: 14, color: ROSE }) +
      at(ax, -3, 4, '3/4', { dx: -26, dy: -8, color: ROSE }) +
      at(ax, -4, -3, '−4/3', { dx: -28, dy: 14, color: ROSE }),
    'Both x and y appear in the slope, so you need the whole point, not just x.',
  );
};

const perpendicular = (): SlideArt => {
  const ax = grid({ x: [-1.5, 8.5], y: [-0.6, 5.03] }, { x: [2, 4, 6, 8], y: [2, 4] });
  const t: Fn = (x) => 4 - 0.75 * (x - 3);
  return art(
    'The radius from the origin to (3, 4) and the tangent line there, meeting at a right angle',
    cap('Radius slope 4/3, tangent slope −3/4') +
      ax.body +
      circleOn(ax, 0, 0, 5, AMB) +
      seg(ax, 0, 0, 3, 4, SKY, 2.6) +
      seg(ax, 1.7, t(1.7), 8.3, t(8.3), ROSE, 2.6) +
      mark(ax, 3, 4, '(3, 4)', { dx: 30, dy: -4, color: ROSE }) +
      at(ax, 2.4, 1.5, 'radius 4/3', { color: SKY }) +
      at(ax, 6.3, 2.4, 'tangent −3/4', { color: ROSE }),
    'The two slopes multiply to −1, so the implicit answer passes the geometry check.',
  );
};

const balloon = (): SlideArt => {
  const cx = 160, cy = 138, R = 72;
  let b = cap('Radius grows 2 cm/s. How fast does volume grow?');
  b += circle(cx, cy, R, ROSE, `${ROSE}22`, 2.6);
  b += polygon([[cx - 7, cy + R + 2], [cx + 7, cy + R + 2], [cx, cy + R + 14]], ROSE, `${ROSE}66`, 2);
  b += line(cx, cy, cx + R, cy, INK, 2) + dot(cx, cy, 3.5) + text(cx + R / 2, cy - 8, 'r = 5 cm', { size: 12 });
  for (const a of [45, 135, 225, 315]) {
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    b += arrow(cx + (R + 6) * c, cy - (R + 6) * s, cx + (R + 26) * c, cy - (R + 26) * s, EMR, 2.2);
  }
  b += text(312, 106, 'V = (4/3)πr³', { size: 13, fill: VIO });
  b += text(312, 134, 'radius: +2 cm/s', { size: 12, fill: EMR });
  b += text(312, 162, 'volume: ? cm³/s', { size: 12, fill: AMB });
  return art('A spherical balloon of radius 5 cm with arrows showing it expanding outward', b, 'Draw it, name the variables, then write the one equation that links them.');
};

const U8: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Curves that will not solve for y',
    body: 'A circle is x² + y² = 25, and no single formula y = … gives the whole thing. Today you will find slopes on curves like this anyway, with implicit differentiation. Then you will link two rates that change together, like a ladder sliding down a wall.',
    art: circleTangent(),
    formula: {
      tex: '\\frac{d}{dx}\\big(y^{2}\\big) = 2y\\,\\frac{dy}{dx}',
      note: 'The one new move: every y-term picks up a dy/dx when you differentiate.',
      parts: [
        { sym: 'y^{2}', means: 'a term with y in it — y depends on x', tone: 'accent' },
        { sym: '2y', means: 'the ordinary power rule', tone: 'ok' },
        { sym: '\\tfrac{dy}{dx}', means: 'the chain-rule tag, because y is a function of x', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Differentiate both sides',
    body: 'Treat y as a function of x that you simply have not written out. Differentiate every term on both sides with respect to x. Whenever you differentiate a y-term, the chain rule tacks on a factor of dy/dx: the derivative of y² is 2y·dy/dx.',
    why: 'Since y depends on x, y² is really (y(x))², a function inside a function. The chain rule differentiates the outside (squaring gives 2y) and then multiplies by the derivative of the inside, which is dy/dx. A plain x has inside derivative dx/dx = 1, so it needs no extra tag.',
    art: flow([{ label: 'y²', color: AMB }, { label: 'power rule: 2y', color: SKY }, { label: 'chain tag: × dy/dx', color: ROSE }], { horizontal: true, title: 'What happens to a y-term', caption: 'Power rule first, then the dy/dx tag. An x-term needs no tag because dx/dx = 1.' }),
    formula: {
      tex: 'x^{2} + y^{2} = 25 \;\\Longrightarrow\; 2x + 2y\\,\\frac{dy}{dx} = 0',
      note: 'The x-term differentiates as usual; the y-term carries its tag; the constant 25 becomes 0.',
      parts: [
        { sym: '2x', means: 'derivative of x², no tag needed', tone: 'ok' },
        { sym: '2y\\,\\tfrac{dy}{dx}', means: 'derivative of y², with its tag', tone: 'warn' },
        { sym: '0', means: 'a constant has derivative zero', tone: 'plain' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Then solve for dy/dx',
    body: 'After differentiating, dy/dx is just an unknown in a linear equation. Collect every dy/dx term on one side, factor dy/dx out, and divide by what is left. The answer usually has both x and y in it, so a slope needs the whole point.',
    why: 'After differentiating, dy/dx appears only to the first power, multiplied by other things, so the equation is linear in it and ordinary algebra can isolate it. Check at (3, 4): −x/y gives −3/4, which matches the tangent you see on the circle and is perpendicular to the radius slope 4/3.',
    art: slopeField(),
    compare: {
      cols: [
        { title: 'Collect', tex: '2y\\,\\tfrac{dy}{dx} = -2x', lines: ['Move the x-term across'], tone: 'accent' },
        { title: 'Divide', tex: '\\tfrac{dy}{dx} = -\\tfrac{2x}{2y}', lines: ['Divide by the coefficient'], tone: 'ok' },
        { title: 'Simplify', tex: '\\tfrac{dy}{dx} = -\\tfrac{x}{y}', lines: ['Cancel the 2s'], tone: 'warn' },
      ],
      note: 'Three algebra moves, every time: collect, factor out dy/dx, divide.',
    },
  },
  {
    kind: 'concept',
    head: 'Related rates: everything depends on time',
    body: 'When x and y both change with time t, differentiate the equation with respect to t instead. Now EVERY variable picks up its own rate: x² becomes 2x·dx/dt and y² becomes 2y·dy/dt. One equation links the quantities, so its derivative links their rates.',
    why: 'The equation x² + y² = 100 is true at every moment, so both sides stay equal as time passes. Two things that are always equal must change at equal rates, so you may differentiate both sides with respect to t. Each variable is a function of time, so the chain rule gives it its own rate.',
    art: ladder({ base: 'x', wall: 'y', hyp: '10 ft', title: 'x² + y² = 100 at every instant', caption: 'As the base slides out, the top slides down. Both lengths are functions of t.', alt: 'A 10 foot ladder leaning on a wall, with the base distance labelled x and the height labelled y' }),
    formula: {
      tex: '2x\\,\\frac{dx}{dt} + 2y\\,\\frac{dy}{dt} = 0',
      note: 'The time-derivative of x² + y² = 100. Each variable carries its own rate.',
      parts: [
        { sym: '\\tfrac{dx}{dt}', means: 'how fast the base slides out', tone: 'ok' },
        { sym: '\\tfrac{dy}{dt}', means: 'how fast the top slides down', tone: 'bad' },
        { sym: '0', means: 'the ladder length never changes', tone: 'plain' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The recipe, and the units that check it',
    body: 'Draw a picture, name the variables, write ONE equation linking them, differentiate with respect to t, and only THEN plug in the numbers. Units are a free check: every rate is something per time, and a negative rate means the quantity is shrinking.',
    why: 'Plugging in a number early freezes a quantity that is really moving, and the derivative of a frozen number is zero, so its rate vanishes. Keeping letters until after differentiating preserves every rate. Units help because a rate with respect to t is always a quantity per time.',
    art: flow([{ label: 'Draw it and name the variables', color: SKY }, { label: 'Write one equation linking them', color: AMB }, { label: 'Differentiate with respect to t', color: VIO }, { label: 'Plug in the numbers LAST', color: EMR }], { title: 'The related-rates recipe', caption: 'Anything that changes stays a letter until the derivative is done.' }),
    formula: {
      tex: '\\frac{d}{dt}\\big[\\,r^{3}\\big] = 3r^{2}\\,\\frac{dr}{dt}',
      note: 'With respect to t, every variable is an inside function, so every term ends with a rate.',
      parts: [
        { sym: 'r^{3}', means: 'the quantity as a function of time', tone: 'accent' },
        { sym: '3r^{2}', means: 'the ordinary power rule', tone: 'ok' },
        { sym: '\\tfrac{dr}{dt}', means: 'the rate of the variable inside', tone: 'warn' },
      ],
    },
    table: {
      head: ['Quantity', 'Its rate', 'Units'],
      rows: [['radius r', 'dr/dt', 'cm/s'], ['volume V', 'dV/dt', 'cm³/s'], ['height h', 'dh/dt', 'ft/min'], ['distance x', 'dx/dt', 'ft/s']],
      note: 'Read the units off the question before you compute: they tell you which rate you are after.',
    },
  },
  {
    kind: 'example',
    head: 'Start simple: the circle',
    body: 'You have a circle that cannot be written as one formula y = …, and you want its slope dy/dx. Differentiate both sides, tag every y-term, then solve for dy/dx.',
    steps: {
      steps: [
        { tex: '2x + 2y\\,\\tfrac{dy}{dx} = 0', text: 'Differentiate each term with respect to x. The x² gives 2x, and y² gives 2y times dy/dx by the chain rule because y depends on x. The constant 25 gives 0.' },
        { tex: '2y\\,\\tfrac{dy}{dx} = -2x', text: 'Move the 2x to the right side by subtracting it from both sides. That leaves the only term containing dy/dx alone on the left, ready to be isolated.' },
        { tex: '\\tfrac{dy}{dx} = -\\tfrac{2x}{2y} = -\\tfrac{x}{y}', text: 'Divide both sides by 2y to isolate dy/dx, then cancel the common factor 2. The slope depends on both x and y, so you need the whole point to use it.' },
      ],
      answer: '\\dfrac{dy}{dx} = -\\dfrac{x}{y}',
    },
  },
  {
    kind: 'example',
    head: 'A slope at a point: (3, 4)',
    body: 'What is the slope of the tangent to x² + y² = 25 at the point (3, 4)? Use the implicit derivative, then check the answer against the geometry of the radius.',
    art: perpendicular(),
    steps: {
      steps: [
        { tex: '\\tfrac{dy}{dx} = -\\tfrac{x}{y}', text: 'Start from dy/dx = −x/y, found on the last slide. It gives the slope of the tangent at any point on the circle, so we only have to feed it a point.' },
        { tex: '-\\tfrac{3}{4}', text: 'Plug in x = 3 and y = 4. The point (3, 4) really is on the circle, since 9 + 16 = 25, so the formula applies and gives −3/4.' },
        { tex: '\\tfrac{4}{3}\\cdot\\left(-\\tfrac{3}{4}\\right) = -1', text: 'Check: radius slope times tangent slope is −1, so they are perpendicular.' },
      ],
      answer: '\\text{slope } -\\tfrac{3}{4}',
    },
  },
  {
    kind: 'example',
    head: 'A product inside: xy = 12',
    body: 'Find dy/dx for xy = 12 and evaluate it at (3, 4). The left side multiplies two things that both depend on x, so which differentiation rule do you need?',
    steps: {
      steps: [
        { tex: '(1)(y) + x\\,\\tfrac{dy}{dx} = 0', text: 'The left side is x times y, so use the product rule: (derivative of x) times y, plus x times (derivative of y). The derivative of y is dy/dx, and the constant 12 gives 0.' },
        { tex: 'x\\,\\tfrac{dy}{dx} = -y', text: 'Subtract y from both sides to move it across. That leaves the only term containing dy/dx on the left, so we can isolate it next.' },
        { tex: '\\tfrac{dy}{dx} = -\\tfrac{y}{x}', text: 'Divide both sides by x to get dy/dx alone. This is allowed because x is never zero on this curve, since xy = 12.' },
        { tex: '-\\tfrac{4}{3}', text: 'Plug in x = 3 and y = 4, which lies on the curve because 3 × 4 = 12. The slope there is −4 over 3, so the curve is falling.' },
      ],
      answer: '\\dfrac{dy}{dx} = -\\dfrac{y}{x} = -\\dfrac{4}{3}\\ \\text{at } (3, 4)',
    },
  },
  {
    kind: 'example',
    head: 'Another way: solve for y first',
    body: 'For xy = 12 you can also solve for y first and use the ordinary power rule. Does that route give the same slope at x = 3 as implicit differentiation?',
    steps: {
      steps: [
        { tex: 'y = 12x^{-1}', text: 'Since this curve can be solved for y, divide both sides of xy = 12 by x to get y = 12/x. Write it as 12x⁻¹ so the power rule applies.' },
        { tex: '\\tfrac{dy}{dx} = -12x^{-2} = -\\tfrac{12}{x^{2}}', text: 'Apply the power rule to 12x⁻¹: bring down the exponent −1, multiply by 12, and lower the exponent to −2. This is ordinary differentiation, so no dy/dx tag is needed.' },
        { tex: '-\\tfrac{12}{9} = -\\tfrac{4}{3}', text: 'Plug in x = 3 to get −12/9, which reduces to −4/3. It matches the implicit method, which is a good sign that both are right.' },
        { tex: '-\\tfrac{y}{x} = -\\tfrac{12/x}{x} = -\\tfrac{12}{x^{2}}', text: 'The implicit answer becomes the explicit one once you substitute y = 12/x.' },
      ],
      answer: '-\\tfrac{4}{3}\\ \\text{either way}',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the balloon',
    body: 'A spherical balloon is inflated so its radius grows at 2 cm/s. How fast is the volume growing at the moment r = 5 cm? Draw it, name r and V, and find the one equation that links them.',
    art: balloon(),
    steps: {
      steps: [
        { tex: 'V = \\tfrac{4}{3}\\pi r^{3}', text: 'Volume and radius are linked by the sphere volume formula. Write that one equation first, because everything else comes from differentiating it.' },
        { tex: '\\tfrac{dV}{dt} = 4\\pi r^{2}\\,\\tfrac{dr}{dt}', text: 'Differentiate with respect to t: the r³ becomes 3r² times dr/dt, and 3 cancels the 1/3.' },
        { tex: '4\\pi(5)^{2}(2) = 4\\pi \\cdot 25 \\cdot 2', text: 'Now plug in r = 5 and dr/dt = 2. We wait until after differentiating because r changes with time, and a plugged-in number would have lost its rate.' },
        { tex: '200\\pi \\approx 628.3', text: 'Multiply 4 × 25 × 2 to get 200, so the volume grows at 200π cm³/s, about 628.3. The units are volume per time, as a rate of volume should be.' },
      ],
      answer: '\\dfrac{dV}{dt} = 200\\pi \\approx 628.3\\ \\text{cm}^{3}\\text{/s}',
    },
  },
  {
    kind: 'example',
    head: 'The sliding ladder',
    body: 'A 10 ft ladder leans on a wall and its base slides away at 1 ft/s. How fast is the top sliding down when the base is 6 ft from the wall? Link the two lengths with one equation, differentiate in time, then plug in.',
    art: ladder({ base: 'x = 6 ft', wall: 'y = 8 ft', hyp: '10 ft', title: 'Base out at 1 ft/s: how fast does the top drop?', caption: 'Find y from the Pythagorean theorem before you plug in: 36 + y² = 100 gives y = 8.', rates: true, alt: 'A 10 foot ladder with its base 6 feet from the wall and its top 8 feet up, the base moving outward at 1 foot per second' }),
    steps: {
      steps: [
        { tex: 'x^{2} + y^{2} = 100', text: 'The ladder, the wall and the floor form a right triangle, and the ladder is the hypotenuse, always 10 ft. So x² + y² = 100 holds at every instant.' },
        { tex: '2x\\,\\tfrac{dx}{dt} + 2y\\,\\tfrac{dy}{dt} = 0', text: 'Differentiate both sides with respect to t. Both x and y change with time, so each term gets its own rate by the chain rule, and the constant 100 becomes 0.' },
        { tex: 'y = \\sqrt{100 - 36} = 8', text: 'Find the height at this moment from the original equation: when x = 6, y² = 100 − 36 = 64, so y = 8. We need y as a number before solving.' },
        { tex: '2(6)(1) + 2(8)\\,\\tfrac{dy}{dt} = 0', text: 'Plug x = 6, dx/dt = 1 and y = 8 into the differentiated equation. Now that the differentiating is finished, the numbers are safe to use.' },
        { tex: '16\\,\\tfrac{dy}{dt} = -12 \;\\Rightarrow\; \\tfrac{dy}{dt} = -\\tfrac{3}{4}', text: 'Solve: 16 dy/dt = −12, so dy/dt = −3/4. The minus sign means y is shrinking, so the top of the ladder moves down the wall.' },
      ],
      answer: '\\dfrac{dy}{dt} = -\\dfrac{3}{4}\\ \\text{ft/s (down at 0.75 ft/s)}',
    },
  },
  {
    kind: 'example',
    head: 'The conical tank',
    body: 'Water pours into a cone-shaped tank (height 12 ft, top radius 6 ft) at 3 ft³/min. How fast is the level rising when the water is 4 ft deep? Remove the extra variable r first, then differentiate.',
    art: cone({ top: '6 ft', height: '12 ft', r: 'r = 2 ft', h: 'h = 4 ft', level: 1 / 3, title: 'Water in a cone: r is always h/2', caption: 'The water is a smaller cone, similar to the tank, so r/h = 6/12.', inflow: '3 ft³/min', alt: 'A conical tank 12 feet tall with top radius 6 feet, filled with water to a depth of 4 feet where the water radius is 2 feet' }),
    steps: {
      steps: [
        { tex: '\\tfrac{r}{h} = \\tfrac{6}{12} \;\\Rightarrow\; r = \\tfrac{h}{2}', text: 'The water forms a smaller cone similar to the tank, so its radius to height ratio matches the tank: r/h = 6/12. That gives r = h/2 at every depth.' },
        { tex: 'V = \\tfrac{1}{3}\\pi\\left(\\tfrac{h}{2}\\right)^{2}h = \\tfrac{\\pi}{12}h^{3}', text: 'Substitute r = h/2 into the cone volume formula. This leaves V in terms of h alone, which is exactly the variable whose rate we want.' },
        { tex: '\\tfrac{dV}{dt} = \\tfrac{\\pi}{4}h^{2}\\,\\tfrac{dh}{dt}', text: 'Differentiate with respect to t. The power rule turns h³ into 3h² and the chain rule adds dh/dt, and 3 times π/12 simplifies to π/4.' },
        { tex: '3 = \\tfrac{\\pi}{4}(16)\\,\\tfrac{dh}{dt} = 4\\pi\\,\\tfrac{dh}{dt}', text: 'Plug in dV/dt = 3 and h = 4. Then (π/4)(16) simplifies to 4π, so the equation becomes 3 = 4π times dh/dt.' },
        { tex: '\\tfrac{dh}{dt} = \\tfrac{3}{4\\pi} \\approx 0.24', text: 'Divide both sides by 4π to get dh/dt = 3/(4π), about 0.24 ft/min. The rate is positive, so the water level is rising, as it should be.' },
      ],
      answer: '\\dfrac{dh}{dt} = \\dfrac{3}{4\\pi} \\approx 0.24\\ \\text{ft/min}',
    },
  },
  {
    kind: 'protip',
    head: 'Get down to one variable before differentiating',
    body: 'In the cone, V depends on both r and h, but only dV/dt and dh/dt are in the question. Use the geometry (similar triangles) to eliminate the extra variable FIRST. One variable in, one clean derivative out.',
    compare: {
      cols: [
        { title: 'Two variables', tex: 'V = \\tfrac{1}{3}\\pi r^{2}h', lines: ['Differentiating needs dr/dt too', 'Nobody told you dr/dt'], tone: 'bad' },
        { title: 'One variable', tex: 'V = \\tfrac{\\pi}{12}h^{3}', lines: ['Only dh/dt appears', 'Exactly what was asked'], tone: 'ok' },
      ],
      note: 'A relationship like r = h/2 is the bridge that removes the variable you were not asked about.',
    },
  },
  {
    kind: 'protip',
    head: 'Read the sign as a direction',
    body: 'A negative rate is not a mistake; it is information. dy/dt = −3/4 says the top of the ladder is moving down at 0.75 ft/s. State the number AND the direction in your answer, with units.',
    formula: {
      tex: '\\frac{dy}{dt} = -\\frac{3}{4}\\ \\text{ft/s}',
      note: 'Magnitude 0.75 ft/s, direction down.',
      parts: [
        { sym: '-', means: 'y is shrinking: the top moves toward the floor', tone: 'bad' },
        { sym: '\\tfrac{3}{4}', means: 'the speed of the top at that instant', tone: 'ok' },
        { sym: '\\text{ft/s}', means: 'length per time, as every rate must be', tone: 'plain' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: dropping the dy/dx',
    body: 'Students differentiate x² + y² = 25 and write 2x + 2y = 0. That treats y like a constant, which it is not. The derivative of y² is 2y·dy/dx. The dy/dx is the whole point: without it there is nothing to solve for.',
    compare: {
      cols: [
        { title: 'Wrong', tex: '2x + 2y = 0', lines: ['No dy/dx anywhere', 'Says y = −x, nonsense for a circle'], tone: 'bad' },
        { title: 'Right', tex: '2x + 2y\\,\\tfrac{dy}{dx} = 0', lines: ['y² carries its tag', 'Solve to get −x/y'], tone: 'ok' },
      ],
      note: 'Every y-term gets a dy/dx. Every one.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: plugging in too early',
    body: 'In the ladder problem, if you set x = 6 BEFORE differentiating, you get 36 + y² = 100, and the derivative of 36 is zero. The rate dx/dt vanishes and the problem breaks. A quantity that changes with time must stay a variable until the derivative is done.',
    compare: {
      cols: [
        { title: 'Too early', tex: '36 + y^{2} = 100', lines: ['dx/dt is gone', '2y·dy/dt = 0 gives nonsense'], tone: 'bad' },
        { title: 'Just right', tex: '2x\\,\\tfrac{dx}{dt} + 2y\\,\\tfrac{dy}{dt} = 0', lines: ['Differentiate first', 'Then x = 6, y = 8, dx/dt = 1'], tone: 'ok' },
      ],
      note: 'Only a number that NEVER changes, like the ladder length 10, may go in before differentiating.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: two cars leaving town',
    body: 'One car drives east at 40 mph and another north at 30 mph, both leaving the same intersection at noon. How fast is the distance between them growing at 1 p.m.? Use the right triangle they make.',
    art: rightTriangle({ adj: '40 mi east', opp: '30 mi north', hyp: 'z = 50 mi', shape: { opp: 3, adj: 4 }, title: 'x² + y² = z² at every instant', caption: 'A 3-4-5 triangle scaled by 10: the legs grow at 40 and 30 mph.', alt: 'A right triangle with legs 40 miles east and 30 miles north and hypotenuse z = 50 miles' }),
    steps: {
      steps: [
        { tex: 'x^{2} + y^{2} = z^{2}', text: 'The one equation: the cars and the intersection form a right triangle.' },
        { tex: '2x\\,\\tfrac{dx}{dt} + 2y\\,\\tfrac{dy}{dt} = 2z\\,\\tfrac{dz}{dt}', text: 'Differentiate both sides with respect to t. All three lengths x, y and z change with time, so each term gets its own rate by the chain rule.' },
        { tex: 'x\\,\\tfrac{dx}{dt} + y\\,\\tfrac{dy}{dt} = z\\,\\tfrac{dz}{dt}', text: 'Divide every term by 2. The common factor 2 appears in all three terms, so removing it keeps the equation true and shortens the arithmetic.' },
        { tex: 'z = \\sqrt{40^{2} + 30^{2}} = 50', text: 'Find z at 1 p.m. In one hour the cars have gone x = 40 and y = 30 miles, and the Pythagorean theorem gives z = 50.' },
        { tex: '40(40) + 30(30) = 50\\,\\tfrac{dz}{dt}', text: 'Plug in dx/dt = 40 and dy/dt = 30 along with x = 40, y = 30 and z = 50. The differentiating is done, so every number is now safe to use.' },
        { tex: '\\tfrac{dz}{dt} = \\tfrac{2500}{50} = 50', text: 'Add 1600 + 900 = 2500, then divide by 50 to get dz/dt = 50 mph. The cars separate at 50 mph, and the sign is positive because the distance is growing.' },
      ],
      answer: '\\dfrac{dz}{dt} = 50\\ \\text{mph}',
    },
  },
  {
    kind: 'summary',
    head: 'Tags and rates, wrapped up',
    body: 'Implicit differentiation: differentiate both sides, tag every y-term with dy/dx, then collect, factor and divide. Related rates: draw, name, write one equation, differentiate with respect to t, and plug in LAST. Check units, and read a negative rate as a direction.',
    table: {
      head: ['Step', 'Implicit', 'Related rates'],
      rows: [
        ['Differentiate', 'with respect to x', 'with respect to t'],
        ['Tag', 'y-terms get dy/dx', 'every variable gets d□/dt'],
        ['Solve', 'for dy/dx', 'for the rate asked'],
        ['Plug in', 'the point (x, y)', 'the numbers, last'],
      ],
      note: 'Same chain rule, two uses. In both, a changing quantity stays a letter until after the derivative.',
    },
  },
];


// ── CALC-9 — Mean Value Theorem, extrema and curve sketching ──────────────

const cubic: Fn = (x) => x * x * x - 3 * x;

const cubicSketch = (): SlideArt => {
  const ax = grid({ x: [-3, 3], y: [-4.5, 4.5] }, { x: [-2, -1, 1, 2], y: [-4, -2, 2, 4] });
  return art(
    'The curve y equals x cubed minus 3x with its local maximum at (−1, 2), local minimum at (1, −2) and inflection point at the origin marked',
    cap('f(x) = x³ − 3x: a high, a low and a bend') +
      ax.body +
      ax.curve(cubic, AMB, 2.8) +
      mark(ax, -1, 2, 'max (−1, 2)', { dy: -12, color: EMR }) +
      mark(ax, 1, -2, 'min (1, −2)', { dy: 22, color: ROSE }) +
      dot(ax.X(0), ax.Y(0), 5, VIO) +
      line(ax.X(0) - 6, ax.Y(0) - 6, ax.X(0) - 36, ax.Y(3.6) + 6, VIO, 1.4) +
      at(ax, 0, 3.6, 'inflection (0, 0)', { dx: -40, color: VIO, anchor: 'end' }),
    'Rising, then falling, then rising again. The bend flips from frown to smile at the origin.',
  );
};

const mvtFig = (): SlideArt => {
  const ax = grid({ x: [0, 5], y: [0, 18] }, { x: [1, 2, 3, 4], y: [4, 8, 12, 16] });
  const sq: Fn = (x) => x * x;
  const tan: Fn = (x) => 6.25 + 5 * (x - 2.5);
  return art(
    'The parabola y equals x squared on the interval from 1 to 4, with the secant line through the endpoints and a parallel tangent line at c = 2.5',
    cap('Secant slope 5, and a tangent with the same slope') +
      ax.body +
      ax.curve(sq, AMB, 2.8) +
      seg(ax, 1, 1, 4, 16, SKY, 2.2, '6 4') +
      seg(ax, 1.5, tan(1.5), 3.5, tan(3.5), ROSE, 2.6) +
      mark(ax, 1, 1, '(1, 1)', { dx: -10, dy: -6, color: SKY, anchor: 'end' }) +
      mark(ax, 4, 16, '(4, 16)', { dx: 30, dy: -6, color: SKY }) +
      mark(ax, 2.5, 6.25, 'c = 2.5', { dx: 32, dy: 16, color: ROSE }) +
      at(ax, 3.2, 15.6, 'secant, slope 5', { color: SKY, anchor: 'end' }) +
      at(ax, 3.5, 11.25, 'tangent, slope 5', { color: ROSE, dx: 8, anchor: 'start' }),
    'Somewhere between the endpoints the instant rate equals the average rate.',
  );
};

const threeShapes = (): SlideArt => {
  let b = cap('What the sign change of f′ tells you');
  const panel = (cx: number, d: string, col: string, label: string, word: string) => {
    return path(d, col, 3) + dot(cx, cx === 200 ? 189 : cx === 70 ? 92 : 190, 5, col) + text(cx, 232, label, { size: 12, fill: col }) + text(cx, 56, word, { size: 12, fill: col });
  };
  b += panel(70, 'M 30 170 Q 70 14 110 170', EMR, '+ → −', 'local MAX');
  b += panel(200, 'M 160 110 Q 200 268 240 110', ROSE, '− → +', 'local MIN');
  b += path('M 290 180 C 330 180 330 100 370 100', VIO, 3) + dot(330, 140, 5, VIO) + text(330, 232, '+ → +', { size: 12, fill: VIO }) + text(330, 56, 'neither', { size: 12, fill: VIO });
  b += line(30, 150, 110, 150, INK, 1.2, '4 3', 0.4) + line(160, 150, 240, 150, INK, 1.2, '4 3', 0.4) + line(290, 150, 370, 150, INK, 1.2, '4 3', 0.4);
  return art('Three small curves: a hump where the slope goes from positive to negative, a cup where it goes from negative to positive, and a flat step where it stays positive', b, 'Only a genuine sign change makes a max or a min. A flat spot with no change is neither.');
};

const concavityFig = (): SlideArt => {
  const ax = grid({ x: [-2.2, 2.2], y: [-6, 6] }, { x: [-2, -1, 1, 2], y: [-4, 4] });
  return art(
    'The curve y equals x cubed, concave down on the left, concave up on the right, with the inflection point at the origin',
    cap('f″ < 0 bends down, f″ > 0 bends up') +
      ax.body +
      ax.curve((x) => x * x * x, AMB, 2.8) +
      at(ax, -1.2, 4, 'concave down', { color: ROSE, size: 12 }) +
      at(ax, 1.2, -4, 'concave up', { color: EMR, size: 12 }) +
      dot(ax.X(0), ax.Y(0), 5, VIO) +
      seg(ax, 0.08, -0.25, 0.75, -1.9, VIO, 1.4, '3 3') +
      at(ax, 0.9, -2.4, 'inflection', { color: VIO }),
    'Concave down holds no water; concave up holds water. The switch is the inflection point.',
  );
};

const candidatesFig = (): SlideArt => {
  const ax = grid({ x: [-0.3, 3.4], y: [-4, 20] }, { x: [1, 2, 3], y: [5, 10, 15] });
  return art(
    'The curve x cubed minus 3x on the closed interval from 0 to 3, with the endpoint values 0 and 18 and the interior minimum of −2 marked',
    cap('On [0, 3]: compare the endpoints and the critical point') +
      ax.body +
      seg(ax, 3, 0, 3, 18, INK, 1.2, '4 3') +
      ax.curve((x) => (x >= 0 && x <= 3 ? cubic(x) : NaN), AMB, 2.8) +
      mark(ax, 0, 0, 'f(0) = 0', { dx: 34, dy: -10, color: SKY }) +
      mark(ax, 1, -2, 'f(1) = −2, the min', { dx: 20, dy: 20, color: ROSE }) +
      mark(ax, 3, 18, 'f(3) = 18, the max', { dx: -10, dy: 4, color: EMR, anchor: 'end' }),
    'The biggest value sits at the right endpoint, where f′ is not zero at all.',
  );
};

const quarticFig = (): SlideArt => {
  const ax = grid({ x: [-3, 3], y: [-10, 12] }, { x: [-2, -1, 1, 2], y: [-8, -4, 4, 8] });
  const q: Fn = (x) => x ** 4 - 6 * x * x;
  return art(
    'The W-shaped curve x to the fourth minus 6x squared, with its two inflection points at (−1, −5) and (1, −5) marked',
    cap('f(x) = x⁴ − 6x²: the bend flips twice') +
      ax.body +
      ax.curve(q, AMB, 2.8) +
      mark(ax, -1, -5, '(−1, −5)', { dx: -10, dy: 4, color: VIO, anchor: 'end' }) +
      mark(ax, 1, -5, '(1, −5)', { dx: 10, dy: 4, color: VIO, anchor: 'start' }) +
      at(ax, -2, 8, 'concave up', { color: EMR }) +
      at(ax, 2, 8, 'concave up', { color: EMR }) +
      at(ax, 0, -2, 'concave down', { color: ROSE }),
    'f″ = 12x² − 12 is zero at x = ±1 and changes sign there, so both are inflection points.',
  );
};

const carFig = (): SlideArt => {
  const ax = grid({ x: [0, 2.4], y: [0, 180] }, { x: [1, 2], y: [50, 100, 150] }, { xLabel: 'hours', yLabel: 'miles' });
  const s: Fn = (t) => 75 * t + 20 * Math.sin(Math.PI * t);
  return art(
    'A position graph for a two hour drive covering 150 miles, with the straight secant line of average speed 75 and a parallel tangent where the speedometer read 75',
    cap('150 miles in 2 hours: average speed 75 mph') +
      ax.body +
      ax.curve((t) => (t <= 2 ? s(t) : NaN), AMB, 2.8) +
      seg(ax, 0, 0, 2, 150, SKY, 2, '6 4') +
      seg(ax, 0.1, 20 + 75 * 0.1, 0.9, 20 + 75 * 0.9, ROSE, 2.6) +
      mark(ax, 2, 150, '150 mi at 2 h', { dx: -10, dy: -14, color: SKY, anchor: 'end' }) +
      mark(ax, 0.5, s(0.5), undefined, { color: ROSE }) +
      at(ax, 0.5, s(0.5), 'slope 75 mph', { color: ROSE, dy: -32 }),
    'The curve must somewhere be parallel to the dashed average line, so the speed hit exactly 75.',
  );
};

const cubic2Fig = (): SlideArt => {
  const ax = grid({ x: [-0.5, 4.5], y: [-2, 6] }, { x: [1, 2, 3, 4], y: [2, 4] });
  const g: Fn = (x) => x * x * x - 6 * x * x + 9 * x;
  return art(
    'The curve x cubed minus 6x squared plus 9x with its local maximum (1, 4), inflection point (2, 2) and local minimum (3, 0) marked',
    cap('f(x) = x³ − 6x² + 9x, fully analysed') +
      ax.body +
      ax.curve(g, AMB, 2.8) +
      mark(ax, 1, 4, 'max (1, 4)', { dy: -12, color: EMR }) +
      mark(ax, 3, 0, 'min (3, 0)', { dy: 34, color: ROSE }) +
      mark(ax, 2, 2, 'inflection (2, 2)', { dx: 12, dy: 4, color: VIO, anchor: 'start' }),
    'Max at 1, min at 3, and the bend flips exactly halfway between them at x = 2.',
  );
};

const U9: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Read a graph from its derivative',
    body: 'A curve rises, falls and bends, and its derivatives tell you exactly where. Today you will locate highs and lows with f′, bends with f″, and the one spot the Mean Value Theorem promises. By the end you can sketch f(x) = x³ − 3x from its derivatives alone.',
    art: cubicSketch(),
    formula: {
      tex: 'f\\,\\text{rises where } f\\,\\!\\prime > 0, \\quad \\text{bends up where } f\\,\\!\\prime\\prime > 0',
      note: 'Two derivatives, two questions: which way is it going, and which way is it bending?',
      parts: [
        { sym: 'f\\,\\!\\prime', means: 'the slope — positive rising, negative falling', tone: 'ok' },
        { sym: 'f\\,\\!\\prime\\prime', means: 'the bend — positive concave up, negative concave down', tone: 'accent' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The Mean Value Theorem',
    body: 'If f is continuous on [a, b] and differentiable on (a, b), some c between a and b has f′(c) equal to the average rate (f(b) − f(a))/(b − a). Somewhere, the instant rate equals the average rate. For f(x) = x² on [1, 4] the secant slope is 5, and the tangent at c = 2.5 matches it.',
    why: 'Picture the secant line joining the two ends of the graph. Slide a parallel line toward the curve until it just touches; at that touching point the tangent has the secant slope. Continuity and differentiability are what guarantee the touching point exists, since a jump or a corner could dodge it.',
    art: mvtFig(),
    formula: {
      tex: 'f\\,\\!\\prime(c) = \\frac{f(b) - f(a)}{b - a}',
      note: 'Tangent slope at c equals secant slope across the whole interval.',
      parts: [
        { sym: 'f\\,\\!\\prime(c)', means: 'the instant rate at one special point c', tone: 'warn' },
        { sym: '\\tfrac{f(b)-f(a)}{b-a}', means: 'the average rate: rise over run between the ends', tone: 'accent' },
        { sym: 'c', means: 'strictly between a and b — the theorem promises it exists', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Critical points: where f′ is zero or undefined',
    body: 'A critical point is an x in the domain where f′(x) = 0 or f′(x) does not exist. A local max or min can only happen at a critical point or an endpoint. For f(x) = x³ − 3x, f′(x) = 3x² − 3 = 0 at x = −1 and x = 1, and the sign chart shows f′ positive, then negative, then positive.',
    why: 'At the top of a smooth hill the curve is momentarily flat, so its slope is zero, and at a sharp corner the slope does not exist. Anywhere else the slope is defined and non-zero, so you are still climbing or descending and cannot be at a peak or valley. That is why only these points need checking.',
    art: signChart(-3, 3, [{ at: -1, label: 'x = −1' }, { at: 1, label: 'x = 1' }], [{ sign: '+', word: 'rising' }, { sign: '−', word: 'falling' }, { sign: '+', word: 'rising' }], { title: 'Sign chart of f′(x) = 3x² − 3 = 3(x − 1)(x + 1)', caption: 'Test one number in each gap: f′(−2) = 9, f′(0) = −3, f′(2) = 9.', alt: 'A sign chart for the derivative 3x squared minus 3, positive left of −1, negative between −1 and 1, positive right of 1' }),
    formula: {
      tex: 'f\\,\\!\\prime(x) = 3x^{2} - 3 = 3(x - 1)(x + 1) = 0',
      note: 'Factor the derivative; its zeros are the candidates for a max or min.',
      parts: [
        { sym: 'x = -1', means: 'f′ goes + to −: the curve stops rising', tone: 'ok' },
        { sym: 'x = 1', means: 'f′ goes − to +: the curve stops falling', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The First Derivative Test',
    body: 'Look at the sign of f′ on each side of a critical point. If f′ changes from + to −, the point is a local MAX: the curve rose and then fell. From − to +, a local MIN. If f′ does not change sign, it is neither, just a flat moment on the way through.',
    why: 'Positive slope means climbing and negative slope means descending. Climbing then descending leaves you on a peak, and descending then climbing leaves you in a valley. If the slope keeps the same sign you keep going the same way through the flat spot, so there is no peak or valley there.',
    art: threeShapes(),
    compare: {
      cols: [
        { title: '+ then −', tex: '\\text{local max}', lines: ['Rising, then falling', 'Top of a hill'], tone: 'ok' },
        { title: '− then +', tex: '\\text{local min}', lines: ['Falling, then rising', 'Bottom of a valley'], tone: 'bad' },
        { title: 'No change', tex: '\\text{neither}', lines: ['Flat for an instant', 'Like x³ at 0'], tone: 'plain' },
      ],
      note: 'The sign CHANGE is what matters, not f′ = 0 by itself.',
    },
  },
  {
    kind: 'concept',
    head: 'The second derivative reads the bend',
    body: 'f″ > 0 means concave up: the curve holds water and every tangent sits below it. f″ < 0 means concave down. An INFLECTION POINT is where the concavity flips, so f″ changes sign there. For y = x³, f″ = 6x, negative on the left and positive on the right: inflection at the origin.',
    why: 'The second derivative is the derivative of the slope. If it is positive the slopes keep increasing, so tangent lines tilt more and more upward as you move right, which makes a cup shape. If it is negative the slopes keep decreasing and the curve caps over like a frown.',
    art: concavityFig(),
    formula: {
      tex: 'f\\,\\!\\prime\\prime > 0 \\Rightarrow \\text{concave up}, \\qquad f\\,\\!\\prime\\prime < 0 \\Rightarrow \\text{concave down}',
      note: 'The derivative of the slope: is the slope itself increasing or decreasing?',
      parts: [
        { sym: 'f\\,\\!\\prime\\prime > 0', means: 'slopes are increasing — a smile', tone: 'ok' },
        { sym: 'f\\,\\!\\prime\\prime < 0', means: 'slopes are decreasing — a frown', tone: 'bad' },
        { sym: 'f\\,\\!\\prime\\prime = 0', means: 'a possible inflection — check that the sign flips', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Closed interval: the Candidates Test',
    body: 'On a closed interval [a, b] a continuous function always has an absolute max and min. Find them by evaluating f at every critical point inside the interval AND at both endpoints, then pick the biggest and smallest. On [0, 3] the candidates for x³ − 3x are x = 0, x = 1 and x = 3.',
    why: 'The Extreme Value Theorem says a continuous function on [a, b] reaches a highest and a lowest value. If the highest point is in the interior, the curve is flat or cornered there, so it is a critical point. Otherwise it must be at an end, which is why the candidates are critical points plus endpoints.',
    art: candidatesFig(),
    table: {
      head: ['Candidate', 'Why it is a candidate', 'f(x)'],
      rows: [['x = 0', 'left endpoint', '0'], ['x = 1', 'critical point, f′ = 0', '−2'], ['x = 3', 'right endpoint', '18']],
      mark: 2,
      note: 'Absolute max 18 at x = 3; absolute min −2 at x = 1. x = −1 is a critical point but it is outside [0, 3].',
    },
    formula: {
      tex: '\\max_{[a,b]} f = \\max\\{f(a),\\ f(c_1),\\ f(c_2),\\ \\ldots,\\ f(b)\\}',
      note: 'Endpoints and critical points. Nothing else can win.',
      parts: [
        { sym: 'f(a),\\ f(b)', means: 'the two endpoints — always on the list', tone: 'accent' },
        { sym: 'f(c_i)', means: 'each critical point INSIDE the interval', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: the MVT point for x² on [1, 4]',
    body: 'Find the number c that the Mean Value Theorem promises for f(x) = x² on [1, 4]. Compare the average rate over the interval with the instant rate f′(c).',
    steps: {
      steps: [
        { tex: 'f(4) = 16,\\quad f(1) = 1', text: 'Evaluate f(x) = x² at both endpoints: f(4) = 16 and f(1) = 1. These two points are the ends of the secant line whose slope we need.' },
        { tex: '\\tfrac{f(4) - f(1)}{4 - 1} = \\tfrac{15}{3} = 5', text: 'The average rate of change is rise over run between the ends, (16 − 1)/(4 − 1) = 5. This is the secant slope, and the MVT says some tangent matches it.' },
        { tex: 'f\\,\\!\\prime(x) = 2x', text: 'Differentiate with the power rule to get f′(x) = 2x. This gives the instant rate at any point, which we will set equal to the average rate.' },
        { tex: '2c = 5 \;\\Rightarrow\; c = 2.5', text: 'Set f′(c) = 5, so 2c = 5 and c = 2.5. The theorem needs c strictly between 1 and 4, and 2.5 is, so it is the promised point.' },
      ],
      answer: 'c = 2.5',
    },
  },
  {
    kind: 'example',
    head: 'Find and classify the critical points',
    body: 'Find the critical points of f(x) = x³ − 3x and decide whether each is a max, a min or neither. Find where f′ = 0, then use the sign of f′ on each side.',
    steps: {
      steps: [
        { tex: 'f\\,\\!\\prime(x) = 3x^{2} - 3 = 3(x - 1)(x + 1)', text: 'Differentiate with the power rule and factor out 3. Factoring turns f′ into a product, so its zeros can be read off directly.' },
        { tex: 'x = -1,\\quad x = 1', text: 'Set f′ = 0 and solve: each factor gives one zero. The critical points are x = −1 and x = 1, the only places the slope can change sign.' },
        { tex: 'f\\,\\!\\prime(-2) = 9 > 0,\\quad f\\,\\!\\prime(0) = -3 < 0,\\quad f\\,\\!\\prime(2) = 9 > 0', text: 'Test one point in each of the three gaps, here −2, 0 and 2, to get the sign of f′. Between critical points f′ cannot change sign, so one test point speaks for the whole gap.' },
        { tex: 'f(-1) = -1 + 3 = 2', text: 'The sign goes + to − at x = −1, so the curve rose and then fell: a local max. Its height is f(−1) = −1 + 3 = 2.' },
        { tex: 'f(1) = 1 - 3 = -2', text: 'The sign goes − to + at x = 1, so the curve fell and then rose: a local min. Its height is f(1) = 1 − 3 = −2.' },
      ],
      answer: '\\text{local max } (-1, 2),\\ \\text{local min } (1, -2)',
    },
  },
  {
    kind: 'example',
    head: 'Absolute extremes on [0, 3]',
    body: 'Find the absolute maximum and minimum of f(x) = x³ − 3x on the closed interval [0, 3]. List every candidate (critical points inside, plus both endpoints), then compare their heights.',
    steps: {
      steps: [
        { tex: 'x = 1 \\ \\text{(inside)},\\quad x = -1 \\ \\text{(outside, discard)}', text: 'The critical points come from f′ = 0, namely x = ±1. Only points inside [0, 3] count, so keep x = 1 and discard x = −1.' },
        { tex: 'f(0) = 0', text: 'Evaluate f at the left endpoint. Endpoints are always candidates on a closed interval, because the function may be largest or smallest right at an edge.' },
        { tex: 'f(1) = 1 - 3 = -2', text: 'Evaluate f at the critical point x = 1 to get 1 − 3 = −2. A critical point is the only interior place where an extreme can hide.' },
        { tex: 'f(3) = 27 - 9 = 18', text: 'Evaluate f at the right endpoint x = 3 to get 27 − 9 = 18. This is the other edge candidate.' },
        { tex: '18 > 0 > -2', text: 'Compare the three values 0, −2 and 18. The Extreme Value Theorem guarantees the largest and smallest are among them, so the max is 18 and the min is −2.' },
      ],
      answer: '\\text{max } 18 \\text{ at } x = 3,\\quad \\text{min } {-2} \\text{ at } x = 1',
    },
  },
  {
    kind: 'example',
    head: 'Where does x³ − 3x bend the other way?',
    body: 'Find the inflection point of f(x) = x³ − 3x, where the curve switches from bending one way to bending the other. Use the second derivative and check that its sign really flips.',
    steps: {
      steps: [
        { tex: 'f\\,\\!\\prime(x) = 3x^{2} - 3', text: 'Differentiate with the power rule to get f′(x) = 3x² − 3. This is the slope function, and concavity is about how this slope itself changes.' },
        { tex: 'f\\,\\!\\prime\\prime(x) = 6x', text: 'Differentiate again to get f″(x) = 6x. The second derivative says whether the slope is increasing (concave up) or decreasing (concave down).' },
        { tex: '6x = 0 \;\\Rightarrow\; x = 0', text: 'Set f″ = 0 to find where the bend might flip: 6x = 0 gives x = 0. A flip can only happen where f″ is zero or undefined.' },
        { tex: 'f\\,\\!\\prime\\prime(-1) = -6 < 0,\\quad f\\,\\!\\prime\\prime(1) = 6 > 0', text: 'Test one point on each side. f″(−1) = −6 is negative and f″(1) = 6 is positive, so the sign flips and x = 0 is a true inflection, not just a zero.' },
        { tex: 'f(0) = 0', text: 'Find the height with f(0) = 0. An inflection point is a point on the curve, so it needs both coordinates: (0, 0).' },
      ],
      answer: '\\text{inflection point } (0, 0)',
    },
  },
  {
    kind: 'example',
    head: 'Concave up where? f(x) = x⁴ − 6x²',
    body: 'On what intervals is f(x) = x⁴ − 6x² concave up? Find f″, mark where it is zero, and read off where it is positive.',
    art: quarticFig(),
    steps: {
      steps: [
        { tex: 'f\\,\\!\\prime(x) = 4x^{3} - 12x', text: 'Differentiate with the power rule: x⁴ gives 4x³ and 6x² gives 12x. This is the slope function, which we differentiate once more.' },
        { tex: 'f\\,\\!\\prime\\prime(x) = 12x^{2} - 12 = 12(x - 1)(x + 1)', text: 'Differentiate again and factor: 12x² − 12 = 12(x − 1)(x + 1). Factoring shows the zeros x = ±1, where the concavity might switch.' },
        { tex: 'f\\,\\!\\prime\\prime(-2) = 36 > 0,\\quad f\\,\\!\\prime\\prime(0) = -12 < 0,\\quad f\\,\\!\\prime\\prime(2) = 36 > 0', text: 'Test a point in each gap, since f″ cannot change sign between its zeros. It is positive at −2, negative at 0 and positive at 2, so the curve is concave up outside ±1.' },
        { tex: 'f(\\pm 1) = 1 - 6 = -5', text: 'Because f″ changes sign at x = ±1, both are inflection points. Their height is f(±1) = 1 − 6 = −5, matching the dots on the graph.' },
      ],
      answer: '\\text{concave up on } (-\\infty, -1) \\cup (1, \\infty)',
    },
  },
  {
    kind: 'example',
    head: 'Another way: the Second Derivative Test',
    body: 'Classify the critical points of x³ − 3x without drawing a sign chart. Plug each critical point into f″ and read the sign.',
    steps: {
      steps: [
        { tex: 'f\\,\\!\\prime\\prime(x) = 6x', text: 'Differentiate twice to get f″(x) = 6x. The second derivative tells which way the curve bends at each critical point, so no sign chart is needed.' },
        { tex: 'f\\,\\!\\prime\\prime(-1) = -6 < 0', text: 'At the critical point x = −1, f″ = −6 is negative, so the curve is concave down there. A flat spot that bends down is the top of a hill: a local MAX.' },
        { tex: 'f\\,\\!\\prime\\prime(1) = 6 > 0', text: 'At x = 1, f″ = 6 is positive, so the curve is concave up. A flat spot that bends up is the bottom of a valley: a local MIN.' },
      ],
      answer: '\\text{max at } x = -1,\\ \\text{min at } x = 1',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the speeding driver',
    body: 'A car covers 150 miles in 2 hours on a highway with a 70 mph limit. Can the driver truthfully say they never exceeded the limit? Sketch position against time and compare slopes.',
    art: carFig(),
    steps: {
      steps: [
        { tex: '\\tfrac{150 - 0}{2 - 0} = 75 \\ \\text{mph}', text: 'Average speed is total distance over total time: 150 miles in 2 hours is 75 mph. This is the slope of the straight line joining the ends of the position graph.' },
        { tex: 's \\ \\text{continuous and differentiable}', text: 'Position is continuous and differentiable, because a car cannot teleport or change speed instantly, so the hypotheses of the Mean Value Theorem are met.' },
        { tex: 's\\,\\!\\prime(c) = 75 \\ \\text{for some } c \\in (0, 2)', text: 'The MVT then gives a time c where the instant rate s′(c) equals the average rate. So at some instant the speedometer read exactly 75 mph.' },
        { tex: '75 > 70', text: 'Compare with the limit: 75 is bigger than 70, so at that instant the driver was speeding and the claim of never exceeding the limit fails.' },
      ],
      answer: '\\text{No: at some moment the speed was exactly 75 mph}',
    },
  },
  {
    kind: 'protip',
    head: 'Build a sign chart every time',
    body: 'Find where f′ (or f″) is zero or undefined, mark those points on a line, and test ONE easy number in each gap. The signs tell the whole story: + means rising (or concave up), − means falling (or concave down). It takes thirty seconds and prevents every classification mistake.',
    art: flow([{ label: 'Solve f′(x) = 0 (or undefined)', color: SKY }, { label: 'Mark those x on a number line', color: AMB }, { label: 'Test one number in each gap', color: VIO }, { label: 'Read: + rising, − falling', color: EMR }], { title: 'The sign-chart routine', caption: 'The same routine with f″ gives concavity and inflection points.' }),
    compare: {
      cols: [
        { title: 'Chart of f′', lines: ['+ : f rising', '− : f falling', 'sign change: max or min'], tone: 'accent' },
        { title: 'Chart of f″', lines: ['+ : concave up', '− : concave down', 'sign change: inflection'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: f′ = 0 does not guarantee a max or min',
    body: 'y = x³ has f′(0) = 0, but 0 is not a max or a min: the curve just flattens for an instant and keeps climbing. f′ is positive on both sides. Always check that the sign of f′ actually changes before you call a critical point a max or min.',
    compare: {
      cols: [
        { title: 'Assumed', tex: 'f\\,\\!\\prime(0) = 0 \\Rightarrow \\text{extreme}', lines: ['Skips the sign check', 'Wrong for y = x³'], tone: 'bad' },
        { title: 'Checked', tex: 'f\\,\\!\\prime = 3x^{2} \\ge 0 \\text{ both sides}', lines: ['No sign change', 'Neither max nor min'], tone: 'ok' },
      ],
      note: 'Critical point means candidate. The sign chart decides.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: forgetting the endpoints',
    body: 'On a closed interval the biggest value is often at an ENDPOINT, where f′ is not zero at all. On [0, 3], x³ − 3x has its only interior critical point at x = 1 with value −2, yet the absolute max is 18 at x = 3. Leave out the endpoints and you miss the answer completely.',
    compare: {
      cols: [
        { title: 'Critical points only', tex: 'f(1) = -2', lines: ['Reports −2 as the max', 'Wrong'], tone: 'bad' },
        { title: 'Candidates test', tex: 'f(0),\\ f(1),\\ f(3)', lines: ['0, −2, 18', 'Max 18, min −2'], tone: 'ok' },
      ],
      note: 'Endpoints always go on the list, no derivative needed.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: analyse f(x) = x³ − 6x² + 9x completely',
    body: 'Find every local extreme and the inflection point of f(x) = x³ − 6x² + 9x. Use f′ for the highs and lows and f″ for the bend.',
    art: cubic2Fig(),
    steps: {
      steps: [
        { tex: 'f\\,\\!\\prime(x) = 3x^{2} - 12x + 9 = 3(x - 1)(x - 3)', text: 'Differentiate with the power rule and factor out 3, giving 3(x − 1)(x − 3). The zeros x = 1 and x = 3 are the critical points.' },
        { tex: 'f\\,\\!\\prime(0) = 9 > 0,\\quad f\\,\\!\\prime(2) = -3 < 0,\\quad f\\,\\!\\prime(4) = 9 > 0', text: 'Test one point in each gap: f′(0) = 9, f′(2) = −3 and f′(4) = 9. The signs + − + show f rising, then falling, then rising.' },
        { tex: 'f(1) = 1 - 6 + 9 = 4', text: 'The sign goes + to − at x = 1, so f stops rising and starts falling: a local max, of height f(1) = 1 − 6 + 9 = 4.' },
        { tex: 'f(3) = 27 - 54 + 27 = 0', text: 'The sign goes − to + at x = 3, so f stops falling and starts rising: a local min, of height f(3) = 27 − 54 + 27 = 0.' },
        { tex: 'f\\,\\!\\prime\\prime(x) = 6x - 12 = 0 \;\\Rightarrow\; x = 2', text: 'Differentiate again: f″(x) = 6x − 12 is zero at x = 2, negative before it and positive after, so the concavity flips there.' },
        { tex: 'f(2) = 8 - 24 + 18 = 2', text: 'Because the concavity flips, x = 2 is an inflection point. Its height is f(2) = 8 − 24 + 18 = 2, so the point is (2, 2), halfway between the max and the min.' },
      ],
      answer: '\\text{max } (1, 4),\\ \\text{min } (3, 0),\\ \\text{inflection } (2, 2)',
    },
  },
  {
    kind: 'summary',
    head: 'Slopes, bends and the MVT, wrapped up',
    body: 'The MVT promises a c where the tangent slope equals the secant slope. Critical points are where f′ is zero or undefined; a sign change in f′ makes a max or min. f″ reads concavity, and a sign change in f″ is an inflection point. On a closed interval, test the critical points AND the endpoints.',
    table: {
      head: ['Question', 'Tool', 'Read it as'],
      rows: [
        ['Rising or falling?', 'sign of f′', '+ rising, − falling'],
        ['Max or min?', 'f′ sign change', '+→− max, −→+ min'],
        ['Bending which way?', 'sign of f″', '+ up, − down'],
        ['Inflection?', 'f″ sign change', 'the bend flips'],
        ['Absolute extremes on [a, b]?', 'candidates test', 'critical points and endpoints'],
      ],
    },
  },
];


// ── CALC-10 — Optimization and motion ─────────────────────────────────────

const areaParabola = (): SlideArt => {
  const ax = grid({ x: [0, 220], y: [0, 12] }, { x: [50, 100, 150, 200] , y: [4, 8, 12] }, { xLabel: 'x (m)', yLabel: 'area, thousands of m²' });
  const A: Fn = (x) => (200 * x - x * x) / 1000;
  return art(
    'The area of a rectangular pen with 400 metres of fence, plotted against one side x: a parabola peaking at x = 100 with area 10,000 square metres',
    cap('A(x) = x(200 − x): the biggest pen') +
      ax.body +
      ax.curve((x) => (x <= 200 ? A(x) : NaN), AMB, 2.8) +
      seg(ax, 100, 0, 100, 10, EMR, 1.4, '4 3') +
      mark(ax, 100, 10, 'max 10,000 m² at x = 100', { dy: -12, color: EMR }) +
      at(ax, 32, 1.2, 'A′ > 0', { color: SKY, size: 12 }) +
      at(ax, 168, 1.2, 'A′ < 0', { color: ROSE, size: 12 }),
    'The derivative is zero at the very top, where the area stops growing and starts shrinking.',
  );
};

const penFig = (): SlideArt => {
  let b = cap('400 m of fence: 2x + 2y = 400, so y = 200 − x');
  b += rect(96, 64, 208, 128, AMB, `${AMB}22`, 3, 4);
  b += text(200, 54, 'x', { size: 15, fill: SKY }) + text(200, 214, 'x', { size: 15, fill: SKY });
  b += text(84, 134, '200 − x', { size: 13, fill: EMR, anchor: 'end' }) + text(316, 134, '200 − x', { size: 13, fill: EMR, anchor: 'start' });
  b += text(200, 134, 'A = x(200 − x)', { size: 15, fill: VIO });
  b += text(200, 244, 'two variables in, one variable out', { size: 11, op: 0.7 });
  return art('A rectangle with the top and bottom sides labelled x and the left and right sides labelled 200 minus x, with its area written inside', b, 'The constraint turns y into 200 − x, so the area depends on x alone.');
};

const boxCurve = (): SlideArt => {
  const ax = grid({ x: [0, 6.6], y: [0, 150] }, { x: [1, 2, 3, 4, 5, 6], y: [50, 100] }, { xLabel: 'x (in)', yLabel: 'V (in³)' });
  const V: Fn = (x) => x * (12 - 2 * x) ** 2;
  return art(
    'The volume of an open box made from a 12 inch square, plotted against the corner cut x, rising to 128 cubic inches at x = 2 and falling to zero at x = 6',
    cap('V(x) = x(12 − 2x)² on its real domain 0 < x < 6') +
      ax.body +
      ax.curve((x) => (x <= 6 ? V(x) : NaN), AMB, 2.8) +
      seg(ax, 2, 0, 2, 128, EMR, 1.4, '4 3') +
      mark(ax, 2, 128, 'max 128 at x = 2', { dy: -12, color: EMR }) +
      mark(ax, 6, 0, 'x = 6: no box', { dx: -8, dy: -14, color: ROSE, anchor: 'end' }) +
      mark(ax, 0, 0, undefined, { color: ROSE }),
    'V′ = 0 at x = 2 and at x = 6, but x = 6 cuts the sheet into nothing. Only x = 2 is a real answer.',
  );
};

const speedGrid = (): SlideArt => {
  let b = cap('Speeding up or slowing down? Compare the signs');
  const X0 = 120, Y0 = 62, CW = 118, RH = 64;
  b += text(X0 + CW / 2, Y0 - 10, 'a positive', { size: 12, fill: EMR }) + text(X0 + CW * 1.5 + 10, Y0 - 10, 'a negative', { size: 12, fill: ROSE });
  b += text(X0 - 10, Y0 + RH / 2 + 4, 'v positive', { size: 12, fill: EMR, anchor: 'end' }) + text(X0 - 10, Y0 + RH * 1.5 + 14, 'v negative', { size: 12, fill: ROSE, anchor: 'end' });
  const cell = (c: number, r: number, same: boolean) => {
    const x = X0 + c * (CW + 10), y = Y0 + r * (RH + 10);
    const col = same ? EMR : AMB;
    return rect(x, y, CW, RH, col, `${col}22`, 2.4, 10) + text(x + CW / 2, y + RH / 2 + 5, same ? 'speeding up' : 'slowing down', { size: 13, fill: col });
  };
  b += cell(0, 0, true) + cell(1, 0, false) + cell(0, 1, false) + cell(1, 1, true);
  b += text(W / 2, 232, 'same signs: faster · different signs: slower', { size: 11, op: 0.7 });
  return art('A two by two grid: velocity positive or negative against acceleration positive or negative, with the matching-sign cells reading speeding up and the mismatched cells reading slowing down', b, 'A positive acceleration slows a particle that is moving left, because it pushes against the motion.');
};

const riverPen = (): SlideArt => {
  let b = cap('Three sides of fence: 2x + y = 120, so y = 120 − 2x');
  for (let x = 60; x < 340; x += 20) b += path(`M ${x} 52 q 5 -6 10 0 q 5 6 10 0`, SKY, 2);
  b += text(200, 42, 'river (no fence needed)', { size: 11, fill: SKY });
  b += line(110, 60, 110, 190, AMB, 3.5) + line(290, 60, 290, 190, AMB, 3.5) + line(110, 190, 290, 190, AMB, 3.5);
  b += rect(110, 60, 180, 130, 'none', `${AMB}18`, 0, 0);
  b += text(96, 130, 'x', { size: 15, fill: EMR, anchor: 'end' }) + text(304, 130, 'x', { size: 15, fill: EMR, anchor: 'start' });
  b += text(200, 212, 'y = 120 − 2x', { size: 13, fill: ROSE });
  b += text(200, 130, 'A = x(120 − 2x)', { size: 14, fill: VIO });
  b += text(200, 244, 'best: x = 30, y = 60, area 1800 m²', { size: 11, op: 0.75 });
  return art('A rectangular pen against a river, fenced on two sides of length x and one side of length 120 minus 2x', b, 'The river is the fourth side, so the constraint has only one y.');
};

const velocityFig = (): SlideArt => {
  const ax = grid({ x: [0, 4.5], y: [-2, 4] }, { x: [4], y: [2, 4] }, { xLabel: 't', yLabel: 'v' });
  const v: Fn = (t) => t * t - 4 * t + 3;
  return art(
    'The velocity graph v equals t squared minus 4t plus 3, positive before t = 1, negative between t = 1 and t = 3, positive after, with its lowest point at t = 2',
    cap('v(t) = t² − 4t + 3: where is the particle slowing down?') +
      ax.body +
      shade(ax, v, () => 0, 1, 3, ROSE, '22') +
      ax.curve(v, AMB, 2.8) +
      mark(ax, 1, 0, 't = 1', { dy: 18, color: ROSE }) +
      mark(ax, 3, 0, 't = 3', { dy: 18, color: ROSE }) +
      mark(ax, 2, -1, 'a = 0 at t = 2', { dy: 22, color: VIO }) +
      at(ax, 0.9, 2.4, 'v positive', { color: EMR }) +
      at(ax, 3.3, 3.4, 'v positive', { color: EMR }) +
      at(ax, 2, -0.4, 'v negative', { color: ROSE }),
    'The slope of this graph is a. Slowing down happens where v and a have opposite signs.',
  );
};

const U10: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'The best value, and the moving particle',
    body: 'Optimization means finding the biggest or smallest value of something real: the most area, the least material. Motion means reading velocity and acceleration from a position function. Both run on the same engine: a derivative set to zero tells you where something stops changing.',
    art: areaParabola(),
    formula: {
      tex: 'A(x) = 200x - x^{2}, \\qquad A\\,\\!\\prime(x) = 200 - 2x = 0 \;\\Rightarrow\; x = 100',
      note: 'The pen with 400 m of fence is biggest when it is a 100 m square: 10,000 m².',
      parts: [
        { sym: 'A(x)', means: 'the quantity to optimize, in ONE variable', tone: 'accent' },
        { sym: 'A\\,\\!\\prime = 0', means: 'the top of the hill: area stops growing', tone: 'ok' },
        { sym: 'x = 100', means: 'the critical point, then check it is a max', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The optimization recipe',
    body: 'Draw it and name the variables. Write the quantity you want to optimize. Use the CONSTRAINT to get that quantity down to ONE variable. Then set the derivative to zero and solve. For the 400 m pen: 2x + 2y = 400 gives y = 200 − x, so A = x(200 − x).',
    why: 'Calculus differentiates a function of one variable, so the constraint is needed to turn two variables into one. The fence length ties y to x, so the area depends on x alone. At the best x the area curve is at the top of a hill, where its slope A′ is zero.',
    art: penFig(),
    formula: {
      tex: '2x + 2y = 400 \;\\Rightarrow\; y = 200 - x \;\\Rightarrow\; A = x(200 - x)',
      note: 'Constraint, substitute, differentiate. The constraint is what removes the second variable.',
      parts: [
        { sym: '2x + 2y = 400', means: 'the constraint: a fixed amount of fence', tone: 'accent' },
        { sym: 'y = 200 - x', means: 'solve the constraint for one variable', tone: 'ok' },
        { sym: 'A = x(200 - x)', means: 'the quantity to optimize, now in x alone', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Check the domain and the endpoints',
    body: 'A candidate with x = 0 or a negative length is not a real answer. For a box folded from a 12 inch sheet, V′ = 0 at x = 2 and at x = 6, but x = 6 cuts the whole sheet away. The real domain is 0 < x < 6, and the best value can also sit at an endpoint of the domain, so always look there too.',
    why: 'A derivative of zero only says the graph is flat there, not that the point is allowed or best. A real box needs positive side lengths, so x = 6 (no box) is not a useful answer. On a limited domain the maximum may also sit at an edge, so compare all candidates by their values.',
    art: boxCurve(),
    compare: {
      cols: [
        { title: 'x = 2', tex: 'V = 2 \\cdot 8^{2} = 128', lines: ['Inside the domain', 'The maximum'], tone: 'ok' },
        { title: 'x = 6', tex: 'V = 6 \\cdot 0^{2} = 0', lines: ['V′ = 0 here too', 'No box at all: a minimum'], tone: 'bad' },
        { title: 'x = 0', tex: 'V = 0', lines: ['Endpoint', 'Nothing folded up'], tone: 'plain' },
      ],
      note: 'A zero derivative only finds candidates. The picture, or a second-derivative check, says which one wins.',
    },
  },
  {
    kind: 'concept',
    head: 'Motion on a line: s, v, a',
    body: 'Position s(t) says where the particle is. Velocity v(t) = s′(t) says how fast and which way: positive means moving right, negative means moving left. Acceleration a(t) = v′(t) says how the velocity is changing. SPEED is |v|, which never has a sign.',
    why: 'Velocity is how fast position changes, so it is the derivative of position, and acceleration is how fast velocity changes, so it is the derivative of velocity. The sign carries direction: if s is increasing then v is positive and the particle moves right. Speed ignores direction, so it is |v|.',
    art: flow([{ label: 's(t) position', color: SKY }, { label: 'v(t) = s′(t) velocity', color: AMB }, { label: 'a(t) = v′(t) acceleration', color: ROSE }], { horizontal: true, title: 'Differentiate to move right along the chain', caption: 'Each arrow is one derivative. Speed is the absolute value of v.' }),
    formula: {
      tex: 'v(t) = s\\,\\!\\prime(t), \\qquad a(t) = v\\,\\!\\prime(t) = s\\,\\!\\prime\\prime(t), \\qquad \\text{speed} = |v(t)|',
      note: 'Velocity has a direction; speed does not.',
      parts: [
        { sym: 'v > 0', means: 'moving right (or up)', tone: 'ok' },
        { sym: 'v < 0', means: 'moving left (or down)', tone: 'bad' },
        { sym: 'v = 0', means: 'at rest for an instant — often a turn-around', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Speeding up or slowing down?',
    body: 'A particle speeds up when v and a have the SAME sign, because the acceleration pushes along the motion. It slows down when their signs differ. A positive acceleration does not by itself mean speeding up: if the particle is moving left, a positive a is a brake.',
    why: 'Acceleration is the rate of change of velocity. If v is positive and a is positive, v grows, so the particle moves right faster. If v is negative and a is positive, v rises toward zero, such as −6 becoming −4, so the speed falls. Same signs grow |v|; different signs shrink it.',
    art: speedGrid(),
    compare: {
      cols: [
        { title: 'Same sign', tex: 'v \\cdot a > 0', lines: ['Acceleration pushes along the motion', 'Speed |v| grows'], tone: 'ok' },
        { title: 'Different signs', tex: 'v \\cdot a < 0', lines: ['Acceleration pushes against the motion', 'Speed |v| shrinks'], tone: 'bad' },
      ],
      note: 'Multiply the two signs: positive product means speeding up.',
    },
    table: {
      head: ['v', 'a', 'Result'],
      rows: [['+', '+', 'speeding up'], ['−', '−', 'speeding up'], ['+', '−', 'slowing down'], ['−', '+', 'slowing down']],
      mark: 3,
      note: 'Same sign: faster. Different signs: slower. Check both signs every time.',
    },
  },
  {
    kind: 'concept',
    head: 'Displacement is not distance',
    body: 'DISPLACEMENT is s(end) − s(start): where you finished relative to where you began. DISTANCE adds up every leg separately, so every turn-around (where v = 0) matters. A particle that goes 0 to 4, back to 0, then out to 4 again has displacement 4 but travels 12.',
    why: 'Displacement looks only at the two ends of the trip, so any backtracking cancels out. Distance measures every step, so a leftward leg must count as positive length. That is why you cut at the zeros of v: within each leg the particle never reverses, so |Δs| is exactly the length walked.',
    art: walk(-1, 5, 0, [{ by: 4, label: 'leg 1: +4' }, { by: -4, label: 'leg 2: −4' }, { by: 4, label: 'leg 3: +4' }], { title: 'Three legs on the number line', caption: 'Displacement 4 − 0 = 4. Distance 4 + 4 + 4 = 12.', answerLabel: 'ends at 4' }),
    compare: {
      cols: [
        { title: 'Displacement', tex: 's(4) - s(0) = 4', lines: ['End minus start', 'Can be zero or negative'], tone: 'accent' },
        { title: 'Distance', tex: '|4| + |{-4}| + |4| = 12', lines: ['Sum of every leg', 'Never negative'], tone: 'ok' },
      ],
      note: 'Split the trip wherever v = 0, measure each leg, then add the absolute values.',
    },
  },
  {
    kind: 'example',
    head: 'Start simple: the 400 m pen',
    body: 'You have 400 m of fence for a rectangular pen. What dimensions give the largest area? Write the area, use the fence constraint to reach one variable, then set the derivative to zero.',
    steps: {
      steps: [
        { tex: '2x + 2y = 400 \;\\Rightarrow\; y = 200 - x', text: 'The fence is 400 m in total, so the perimeter equation 2x + 2y = 400 is the constraint. Solve it for y to get y = 200 − x, which will remove one variable.' },
        { tex: 'A = x(200 - x) = 200x - x^{2}', text: 'Put y = 200 − x into the area formula A = xy. That gives A in terms of x alone, which is what we need in order to differentiate.' },
        { tex: 'A\\,\\!\\prime = 200 - 2x = 0 \;\\Rightarrow\; x = 100', text: 'Differentiate with the power rule and set A′ = 0, because the top of the area curve has a flat tangent. 200 − 2x = 0 gives x = 100.' },
        { tex: 'A\\,\\!\\prime\\prime = -2 < 0', text: 'Check the second derivative: A″ = −2 is negative, so the area graph is concave down at x = 100. That makes the critical point a maximum, not a minimum.' },
        { tex: 'y = 200 - 100 = 100,\\quad A = 100 \\cdot 100 = 10{,}000', text: 'Back-substitute to find y = 200 − 100 = 100, and multiply to get the area 100 × 100 = 10,000. The best pen is a square.' },
      ],
      answer: '100\\ \\text{m} \\times 100\\ \\text{m},\\ \\text{area } 10{,}000\\ \\text{m}^{2}',
    },
  },
  {
    kind: 'example',
    head: 'A pen against a river',
    body: 'A pen beside a river needs fence on only three sides, and you have 120 m of fence. What is the largest possible area? Be careful: the constraint is not the same as for the four-sided pen.',
    art: riverPen(),
    steps: {
      steps: [
        { tex: '2x + y = 120 \;\\Rightarrow\; y = 120 - 2x', text: 'The river replaces one side, so only three sides need fence: two of length x and one of length y. The constraint is 2x + y = 120, so y = 120 − 2x.' },
        { tex: 'A = x(120 - 2x) = 120x - 2x^{2}', text: 'Substitute y into the area A = xy to get A = x(120 − 2x) = 120x − 2x². Now A depends on x alone and can be differentiated.' },
        { tex: 'A\\,\\!\\prime = 120 - 4x = 0 \;\\Rightarrow\; x = 30', text: 'Differentiate with the power rule and set A′ = 0 to find the flat top of the area curve: 120 − 4x = 0 gives x = 30.' },
        { tex: 'y = 120 - 60 = 60', text: 'Go back to the constraint to find the third side: y = 120 − 2(30) = 60. This is the side parallel to the river.' },
        { tex: 'A = 30 \\cdot 60 = 1800', text: 'Multiply 30 × 60 to get the area 1800 m². The second derivative A″ = −4 is negative, which confirms this is a maximum.' },
      ],
      answer: '1800\\ \\text{m}^{2}\\ (30\\ \\text{m by } 60\\ \\text{m})',
    },
  },
  {
    kind: 'example',
    head: 'The open box: a product-rule derivative',
    body: 'Cut equal squares of side x from the corners of a 12 in by 12 in sheet and fold up the sides. What x gives the box with the biggest volume? Write V in terms of x, then differentiate.',
    steps: {
      steps: [
        { tex: 'V = x(12 - 2x)^{2},\\quad 0 < x < 6', text: 'The cut-out squares have side x, so the base is 12 − 2x on each side and the height is x. The volume is V = x(12 − 2x)², and x must stay between 0 and 6.' },
        { tex: 'V\\,\\!\\prime = (12 - 2x)^{2} + x \\cdot 2(12 - 2x)(-2)', text: 'Differentiate with the product rule: (first)′ times second, plus first times (second)′. The chain rule handles the squared bracket, which gives 2(12 − 2x)(−2).' },
        { tex: '= (12 - 2x)\\big[(12 - 2x) - 4x\\big] = (12 - 2x)(12 - 6x)', text: 'Factor out the common (12 − 2x) from both terms. A product of factors is easy to set to zero, because each factor can be zero separately.' },
        { tex: '12 - 2x = 0 \\Rightarrow x = 6, \\qquad 12 - 6x = 0 \\Rightarrow x = 2', text: 'Set each factor to zero: x = 6 and x = 2. But x = 6 uses up the whole sheet and leaves no box (V = 0), so only x = 2 is a real candidate.' },
        { tex: 'V(2) = 2 \\cdot 8^{2} = 128', text: 'Evaluate V(2) = 2 · 8² = 128. The base is 12 − 4 = 8 on each side, so the box is 8 by 8 by 2, and 128 beats the zero at both ends of the domain.' },
      ],
      answer: 'x = 2\\ \\text{in},\\quad V = 128\\ \\text{in}^{3}',
    },
  },
  {
    kind: 'example',
    head: 'Another way: the vertex of a parabola',
    body: 'A = 200x − x² is a downward parabola. Can you find its maximum without calculus, using the vertex formula? Compare the result with the derivative method.',
    steps: {
      steps: [
        { tex: 'A = -x^{2} + 200x', text: 'Write the area in standard form ax² + bx + c. Here A = −x² + 200x, so a = −1 and b = 200, and since a is negative the parabola opens down and its vertex is a maximum.' },
        { tex: 'x = -\\tfrac{b}{2a} = -\\tfrac{200}{-2} = 100', text: 'Use the vertex formula x = −b/(2a), which locates the line of symmetry of the parabola. It gives −200/(−2) = 100, the same x as the derivative method.' },
        { tex: 'A(100) = -10{,}000 + 20{,}000 = 10{,}000', text: 'Evaluate A(100) = −10,000 + 20,000 = 10,000, the same maximum as before. Both methods agree, but only calculus works when the function is not a parabola.' },
      ],
      answer: 'x = 100,\\ A = 10{,}000\\ \\text{m}^{2}',
    },
  },
  {
    kind: 'example',
    head: 'When is the particle at rest?',
    body: 'A particle moves along a line with s(t) = t³ − 6t² + 9t for t ≥ 0. When is it at rest? Find the velocity, then solve for where it is zero.',
    steps: {
      steps: [
        { tex: 'v(t) = s\\,\\!\\prime(t) = 3t^{2} - 12t + 9', text: 'Velocity is the derivative of position, so differentiate s(t) = t³ − 6t² + 9t with the power rule. This gives v(t) = 3t² − 12t + 9.' },
        { tex: '= 3(t^{2} - 4t + 3)', text: 'The particle is at rest when v = 0. Pull out the common factor 3 first, which does not change where v is zero but makes the factoring easier.' },
        { tex: '= 3(t - 1)(t - 3)', text: 'Factor the quadratic t² − 4t + 3 into two brackets whose constants multiply to 3 and add to −4, namely −1 and −3.' },
        { tex: 'v = 0 \;\\Rightarrow\; t = 1 \\text{ or } t = 3', text: 'Set each factor to zero, since a product is zero only when one of its factors is. So v = 0 at t = 1 and t = 3, the only instants the particle is at rest.' },
      ],
      answer: 't = 1\\ \\text{and}\\ t = 3',
    },
  },
  {
    kind: 'example',
    head: 'Speeding up at t = 4?',
    body: 'For the same particle, s(t) = t³ − 6t² + 9t, is it speeding up or slowing down at t = 4? Find the signs of both velocity and acceleration, then compare them.',
    steps: {
      steps: [
        { tex: 'v(4) = 3(4)^{2} - 12(4) + 9 = 48 - 48 + 9 = 9', text: 'Evaluate the velocity at t = 4: 3(16) − 48 + 9 = 9. It is positive, so the particle is moving to the right at that moment.' },
        { tex: 'a(t) = v\\,\\!\\prime(t) = 6t - 12', text: 'Differentiate the velocity to get the acceleration, since a = v′. The power rule gives a(t) = 6t − 12.' },
        { tex: 'a(4) = 24 - 12 = 12', text: 'Evaluate a(4) = 24 − 12 = 12. The acceleration is positive, so the velocity is increasing at that moment.' },
        { tex: '(+)(+) \;\\Rightarrow\; \\text{speeding up}', text: 'Compare the signs: v and a are both positive. When velocity and acceleration have the same sign, the push is along the motion, so the particle is speeding up.' },
      ],
      answer: '\\text{speeding up: } v = 9 \\text{ and } a = 12 \\text{ share a sign}',
    },
  },
  {
    kind: 'example',
    head: 'Total distance from t = 0 to t = 4',
    body: 'For the same particle, find the total distance traveled from t = 0 to t = 4 and compare it with the displacement. Split the trip wherever the particle turns around.',
    table: {
      head: ['t', 's(t) = t³ − 6t² + 9t', 'position'],
      rows: [['0', '0 − 0 + 0', '0'], ['1', '1 − 6 + 9', '4'], ['3', '27 − 54 + 27', '0'], ['4', '64 − 96 + 36', '4']],
      note: 'Evaluate s at the start, every turn-around, and the end.',
    },
    steps: {
      steps: [
        { tex: 't = 1,\\ t = 3', text: 'The particle can turn around only where v = 0, which we found at t = 1 and t = 3. Split the trip there so each leg moves in one direction only.' },
        { tex: '|s(1) - s(0)| = |4 - 0| = 4', text: 'Leg 1 runs from t = 0 to 1, moving right since v > 0. Its length is |s(1) − s(0)| = |4 − 0| = 4.' },
        { tex: '|s(3) - s(1)| = |0 - 4| = 4', text: 'Leg 2 runs from t = 1 to 3, moving left since v < 0. Its length is |s(3) − s(1)| = |0 − 4| = 4, and the absolute value makes it positive.' },
        { tex: '|s(4) - s(3)| = |4 - 0| = 4', text: 'Leg 3 runs from t = 3 to 4, moving right again since v > 0. Its length is |s(4) − s(3)| = |4 − 0| = 4.' },
        { tex: '4 + 4 + 4 = 12', text: 'Add the three leg lengths to get the distance 12. Displacement, end minus start, is only 4 − 0 = 4, because the leftward leg undoes the first rightward one.' },
      ],
      answer: '\\text{distance } 12,\\quad \\text{displacement } 4',
    },
  },
  {
    kind: 'protip',
    head: 'Draw the trip on a number line',
    body: 'Before computing distance, sketch the motion: mark s at the start, at every time v = 0, and at the end, then draw the hops. The picture shows the back-tracking that displacement hides, and it tells you exactly which legs to add.',
    formula: {
      tex: '\\text{distance} = \\sum_{\\text{legs}} |s(t_{i+1}) - s(t_i)|, \\qquad \\text{displacement} = s(b) - s(a)',
      note: 'Cut at the zeros of v, take absolute values, add.',
      parts: [
        { sym: 't_i', means: 'the times when v = 0, plus the two ends', tone: 'accent' },
        { sym: '|\\,\\cdot\\,|', means: 'every leg counts as positive length', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: speed is not velocity',
    body: 'Velocity −5 is FASTER than velocity 3: speed is |v|, so the speeds are 5 and 3. A question about "how fast" wants speed; a question about "which way" wants the sign of v. Mixing them up flips the answer to every speeding-up question.',
    compare: {
      cols: [
        { title: 'Velocity', tex: 'v = -5', lines: ['Moving left', 'Has a sign'], tone: 'accent' },
        { title: 'Speed', tex: '|v| = 5', lines: ['Five units per second', 'Never negative'], tone: 'ok' },
      ],
      note: 'Speeding up means |v| is increasing, which is exactly when v and a share a sign.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: positive acceleration does not mean speeding up',
    body: 'If v = −6 and a = 2, the particle is moving left while the acceleration pushes right. The speed drops from 6 toward 0: it is SLOWING DOWN even though a is positive. Compare the signs of v and a; never judge from a alone.',
    compare: {
      cols: [
        { title: 'v = −6, a = 2', tex: '(-)(+)', lines: ['Different signs', 'Slowing down'], tone: 'bad' },
        { title: 'v = 6, a = 2', tex: '(+)(+)', lines: ['Same signs', 'Speeding up'], tone: 'ok' },
      ],
      note: 'The same acceleration can be a brake or a boost. The direction of motion decides.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: when is it slowing down?',
    body: 'A particle has velocity v(t) = t² − 4t + 3 for 0 ≤ t ≤ 4. On which intervals is it slowing down? Find the sign of v and of a on each stretch, then compare them.',
    art: velocityFig(),
    steps: {
      steps: [
        { tex: 'v(t) = (t - 1)(t - 3)', text: 'Factor v to find where it changes sign. It is a parabola opening up with zeros at 1 and 3, so v is positive outside [1, 3] and negative between.' },
        { tex: 'a(t) = v\\,\\!\\prime(t) = 2t - 4', text: 'Acceleration is the slope of the v graph: negative before t = 2, positive after.' },
        { tex: '0 \\le t < 1:\\ v > 0,\\ a < 0', text: 'On 0 ≤ t < 1, v is positive but a is negative. Opposite signs mean the acceleration pushes against the motion, so the particle is slowing down.' },
        { tex: '1 < t < 2:\\ v < 0,\\ a < 0', text: 'On 1 < t < 2, v is negative and a is negative. Same signs mean the push is along the motion, so the particle is speeding up while moving left.' },
        { tex: '2 < t < 3:\\ v < 0,\\ a > 0', text: 'On 2 < t < 3, v is still negative but a is now positive. Opposite signs again, so the particle slows down as it approaches its turn-around at t = 3.' },
        { tex: '3 < t \\le 4:\\ v > 0,\\ a > 0', text: 'On 3 < t ≤ 4, v is positive and a is positive. Same signs, so the particle speeds up while moving right.' },
      ],
      answer: '\\text{slowing down on } [0, 1) \\text{ and } (2, 3)',
    },
  },
  {
    kind: 'summary',
    head: 'Optimization and motion, wrapped up',
    body: 'To optimize: draw, name, write the quantity, use the constraint to reach one variable, set the derivative to zero, and check the domain and endpoints. For motion: v = s′, a = v′, speed is |v|, at rest when v = 0, speeding up when v and a share a sign, and distance adds every leg between turn-arounds.',
    table: {
      head: ['Question', 'Do this'],
      rows: [
        ['Biggest or smallest?', 'one variable, derivative = 0, check domain'],
        ['At rest?', 'solve v(t) = 0'],
        ['Speeding up?', 'same sign for v and a'],
        ['Displacement?', 's(end) − s(start)'],
        ['Distance?', 'add |Δs| over every leg between zeros of v'],
      ],
    },
  },
];

// ── CALC-11 — Riemann sums and the definite integral ──────────────────────

const sq: Fn = (x) => x * x;

const sqFig = (n: number, mode: 'left' | 'right' | 'mid', title: string, note: string, caption: string, alt: string): SlideArt => {
  const ax = grid({ x: [0, 2.3], y: [0, 4.5] }, { x: [0.5, 1, 1.5, 2], y: [1, 2, 3, 4] });
  const col = mode === 'left' ? SKY : mode === 'right' ? ROSE : EMR;
  return art(alt, cap(title) + ax.body + riemann(ax, sq, 0, 2, n, mode, col) + ax.curve(sq, AMB, 2.8) + at(ax, 0.75, 3.6, note, { size: 12, color: VIO }), caption);
};

const trapFig = (): SlideArt => {
  const ax = grid({ x: [0, 2.3], y: [0, 4.5] }, { x: [0.5, 1, 1.5, 2], y: [1, 2, 3, 4] });
  return art(
    'Four trapezoids under the parabola y equals x squared from 0 to 2, their slanted tops joining the curve at each strip edge',
    cap('Trapezoid rule, n = 4: slanted tops hug the curve') + ax.body + trapezoids(ax, sq, 0, 2, 4, EMR) + ax.curve(sq, AMB, 2.8) + at(ax, 0.75, 3.6, 'T₄ = 2.75', { size: 12, color: VIO }),
    'Each top is a straight line between two points on the curve, so the error is tiny.',
  );
};

const signedFig = (): SlideArt => {
  const ax = grid({ x: [-0.3, 3.4], y: [-1.5, 2.5] }, { x: [1, 2, 3], y: [-1, 1, 2] });
  const f: Fn = (x) => x - 1;
  return art(
    'The line y equals x minus 1 from 0 to 3, with the small triangle below the axis shaded red and the larger triangle above shaded green',
    cap('Below the axis counts negative, above counts positive') +
      ax.body +
      shade(ax, () => 0, f, 0, 1, ROSE, '44') +
      shade(ax, f, () => 0, 1, 3, EMR, '44') +
      ax.curve((x) => (x >= 0 && x <= 3 ? f(x) : NaN), AMB, 2.8) +
      at(ax, 0.55, -0.72, '−0.5', { color: ROSE, size: 12 }) +
      at(ax, 2.35, 0.55, '+2', { color: EMR, size: 13 }) +
      at(ax, 1.8, 2.1, 'total: 2 − 0.5 = 1.5', { color: VIO, size: 12 }),
    'Two triangles: ½ · 1 · 1 = 0.5 below the axis and ½ · 2 · 2 = 2 above.',
  );
};

const triFig = (): SlideArt => {
  const ax = grid({ x: [0, 4.6], y: [0, 9] }, { x: [1, 2, 3, 4], y: [2, 4, 6, 8] });
  return art(
    'The line y equals 2x from 0 to 4, with the triangle beneath it shaded; base 4, height 8, area 16',
    cap('∫₀⁴ 2x dx by geometry: a triangle') +
      ax.body +
      shade(ax, (x) => 2 * x, () => 0, 0, 4, SKY, '33') +
      ax.curve((x) => (x <= 4 ? 2 * x : NaN), AMB, 2.8) +
      seg(ax, 4, 0, 4, 8, SKY, 1.6, '4 3') +
      at(ax, 2.9, 2.3, '½ · 4 · 8 = 16', { color: VIO, size: 13 }) +
      at(ax, 4, 8, 'height 8', { dx: 10, dy: 4, color: SKY, anchor: 'start' }) +
      at(ax, 2, 0, 'base 4', { dy: -8, color: SKY }),
    'When the region is a familiar shape, skip the rectangles and use its area formula.',
  );
};

const speedFig = (): SlideArt => {
  const ax = grid({ x: [0, 7], y: [0, 26] }, { x: [2, 4, 6], y: [10, 20] }, { xLabel: 't (s)', yLabel: 'm/s' });
  const data: [number, number][] = [[0, 10], [2, 14], [4, 20], [6, 22]];
  let b = cap('Speedometer readings: left sum uses 10, 14, 20') + ax.body;
  for (let i = 0; i < 3; i++) {
    const [t, v] = data[i];
    b += `<rect x="${r1(ax.X(t))}" y="${r1(ax.Y(v))}" width="${r1(ax.X(t + 2) - ax.X(t))}" height="${r1(ax.Y(0) - ax.Y(v))}" fill="${SKY}33" stroke="${SKY}" stroke-width="1.6"/>`;
    b += at(ax, t + 1, v / 2, `${v} × 2`, { color: SKY, size: 12 });
  }
  for (const [t, v] of data) b += dot(ax.X(t), ax.Y(v), 5, AMB);
  b += at(ax, 6, 22, '22 unused', { dx: 10, dy: 4, color: ROSE, anchor: 'start' });
  b += at(ax, 3, 24.5, '(10 + 14 + 20) × 2 = 88 m', { color: VIO, size: 12 });
  return art('Four speedometer readings at two second intervals, with three left-edge rectangles of heights 10, 14 and 20 shaded under them', b, 'Each rectangle is speed × time = distance. The last reading never gets used in a left sum.');
};

const dataTrap = (): SlideArt => {
  const ax = grid({ x: [0, 4.6], y: [0, 10] }, { x: [1, 2, 3, 4], y: [2, 4, 6, 8] });
  const ys = [2, 5, 7, 8, 8];
  const f: Fn = (x) => { const i = Math.min(Math.floor(x), 3); return ys[i] + (ys[i + 1] - ys[i]) * (x - i); };
  let b = cap('Trapezoids through five data points') + ax.body + trapezoids(ax, f, 0, 4, 4, EMR);
  ys.forEach((y, i) => { b += dot(ax.X(i), ax.Y(y), 5, AMB) + (i ? at(ax, i, y, String(y), { dy: -10, color: AMB, size: 12 }) : ''); });
  b += at(ax, 2.3, 9.3, 'T₄ = 25', { color: VIO, size: 13 });
  return art('Five data points at x equals 0 through 4 with heights 2, 5, 7, 8 and 8, joined by straight segments, and the four trapezoids under them shaded', b, 'With only a table, trapezoids are the natural estimate: connect the dots and add the areas.');
};

const U11: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Area under a curve, one rectangle at a time',
    body: 'The area under a curve is hard to measure directly, so chop it into thin rectangles and add them up. That total is a Riemann sum. Make the rectangles thinner and thinner and the sum settles on one number: the definite integral. Today you will build those sums and read their limit.',
    art: sqFig(4, 'left', 'Left Riemann sum, n = 4, under y = x²', 'L₄ = 1.75', 'Four rectangles, heights read at the left edge of each strip. The curve rises, so they fall short.', 'Four rectangles under the parabola y equals x squared from 0 to 2, each with its height taken at the left edge of its strip'),
    formula: {
      tex: '\\int_{a}^{b} f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i)\\,\\Delta x',
      note: 'The definite integral IS the limit of Riemann sums.',
      parts: [
        { sym: '\\Delta x', means: 'the width of each strip, (b − a)/n', tone: 'accent' },
        { sym: 'f(x_i)', means: 'the height of rectangle i, read from the curve', tone: 'ok' },
        { sym: 'n \\to \\infty', means: 'thinner and thinner strips', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Chop it into strips',
    body: 'Split [a, b] into n equal strips of width Δx = (b − a)/n. Stand a rectangle on each strip and add their areas: height times width, summed. For y = x² on [0, 2] with n = 4, Δx = 0.5 and the strip edges are 0, 0.5, 1, 1.5, 2.',
    art: sqFig(4, 'right', 'Right Riemann sum, n = 4: heights at the right edges', 'R₄ = 3.75', 'The same four strips, but each rectangle reaches up to the curve at its right edge, so they overshoot.', 'Four rectangles under the parabola from 0 to 2, each with its height taken at the right edge of its strip, poking above the curve'),
    formula: {
      tex: '\\Delta x = \\frac{b - a}{n} = \\frac{2 - 0}{4} = 0.5',
      note: 'Every rectangle has the same width; only the heights differ.',
      parts: [
        { sym: 'b - a', means: 'the length of the interval', tone: 'accent' },
        { sym: 'n', means: 'how many strips you chop it into', tone: 'ok' },
        { sym: '0.5', means: 'the width of each strip here', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Left, right or midpoint',
    body: 'A LEFT sum reads each height at the left edge of its strip, a RIGHT sum at the right edge, a MIDPOINT sum at the middle. For a rising curve, left underestimates and right overestimates, and the truth sits between them. Midpoint is usually closest.',
    art: sqFig(4, 'mid', 'Midpoint sum, n = 4: heights at the strip centres', 'M₄ = 2.625', 'Each rectangle overshoots on one side and falls short on the other, and the errors nearly cancel.', 'Four rectangles under the parabola from 0 to 2, each with its height taken at the middle of its strip, crossing the curve'),
    compare: {
      cols: [
        { title: 'Left', tex: 'f(x_{i-1})\\,\\Delta x', lines: ['Heights 0, 0.25, 1, 2.25', 'L₄ = 1.75, too low'], tone: 'accent' },
        { title: 'Right', tex: 'f(x_i)\\,\\Delta x', lines: ['Heights 0.25, 1, 2.25, 4', 'R₄ = 3.75, too high'], tone: 'bad' },
        { title: 'Midpoint', tex: 'f(\\bar{x}_i)\\,\\Delta x', lines: ['Heights at 0.25, 0.75, …', 'M₄ = 2.625, close'], tone: 'ok' },
      ],
      note: 'The true area is 8/3 ≈ 2.667. All three are estimates of the same thing.',
    },
  },
  {
    kind: 'concept',
    head: 'Let the strips shrink: the definite integral',
    body: 'As n grows, the rectangles get skinny and the gaps between left, right and the curve close up. With n = 16 the left sum is already 2.42 and the right sum 2.92, squeezing toward 8/3 ≈ 2.67. The limit as n → ∞ is the DEFINITE INTEGRAL, written ∫₀² x² dx.',
    art: sqFig(16, 'left', 'Left sum with n = 16: the gaps are closing', 'L₁₆ ≈ 2.42', 'Sixteen thin rectangles. Compare with the four fat ones two slides ago: much less is missing.', 'Sixteen thin rectangles under the parabola from 0 to 2, following the curve closely with only slivers of white above them'),
    formula: {
      tex: '\\int_{0}^{2} x^{2}\\,dx = \\lim_{n\\to\\infty} L_n = \\lim_{n\\to\\infty} R_n = \\frac{8}{3}',
      note: 'Left and right sums pinch together, and their common limit is the integral.',
      parts: [
        { sym: '\\int_{0}^{2}', means: 'from a = 0 to b = 2 — the limits of integration', tone: 'accent' },
        { sym: 'x^{2}\\,dx', means: 'height times a vanishingly thin width', tone: 'ok' },
        { sym: '\\tfrac{8}{3}', means: 'the exact area, about 2.667', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The integral is signed area',
    body: 'A region below the x-axis counts NEGATIVE. The integral of x − 1 from 0 to 3 is not the total shaded area 2.5: the triangle below the axis contributes −0.5 and the one above contributes +2, so the integral is 1.5. The integral of x − 2 from 0 to 2 is −2, not 2.',
    art: signedFig(),
    formula: {
      tex: '\\int_{0}^{3} (x - 1)\\,dx = -\\tfrac{1}{2} + 2 = \\tfrac{3}{2}',
      note: 'Area above minus area below.',
      parts: [
        { sym: '-\\tfrac{1}{2}', means: 'the triangle from 0 to 1, under the axis', tone: 'bad' },
        { sym: '+2', means: 'the triangle from 1 to 3, above the axis', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Properties, and geometry shortcuts',
    body: 'Integrals obey simple rules: ∫ₐᵃ f = 0, swapping the limits flips the sign, constants pull out front, and ∫ₐᵇ + ∫ᵇᶜ = ∫ₐᶜ. And if f is a familiar shape, a line or a half circle, compute the integral with geometry: ∫₀⁴ 2x dx is a triangle with base 4 and height 8, so it is 16.',
    art: triFig(),
    formula: {
      tex: '\\int_{0}^{4} 2x\\,dx = \\tfrac{1}{2}\\cdot 4 \\cdot 8 = 16',
      note: 'A triangle with base 4 and height 8. No rectangles needed when the shape is familiar.',
      parts: [
        { sym: '4', means: 'the base: the length of the interval', tone: 'accent' },
        { sym: '8', means: 'the height: f(4) = 2 · 4', tone: 'ok' },
      ],
    },
    table: {
      head: ['Property', 'In symbols', 'Why'],
      rows: [
        ['Zero width', '∫ₐᵃ f = 0', 'no region at all'],
        ['Flip the limits', '∫ᵇₐ f = −∫ₐᵇ f', 'Δx changes sign'],
        ['Constant out front', '∫ k·f = k∫ f', 'every rectangle scales by k'],
        ['Join intervals', '∫ₐᵇ f + ∫ᵇᶜ f = ∫ₐᶜ f', 'strips side by side'],
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: a left sum with n = 4',
    body: 'Estimate the area under f(x) = x² on [0, 2] with a LEFT Riemann sum, n = 4.\nΔx = 0.5, and the left edges are 0, 0.5, 1, 1.5 with heights 0, 0.25, 1, 2.25.\nThe heights sum to 3.5, so the area is about 3.5 × 0.5 = 1.75, an underestimate.',
    table: {
      head: ['strip', 'left edge', 'height f(x)'],
      rows: [['[0, 0.5]', '0', '0'], ['[0.5, 1]', '0.5', '0.25'], ['[1, 1.5]', '1', '1'], ['[1.5, 2]', '1.5', '2.25']],
      note: 'Sum of the heights: 0 + 0.25 + 1 + 2.25 = 3.5.',
    },
    steps: {
      steps: [
        { tex: '\\Delta x = \\tfrac{2 - 0}{4} = 0.5', text: 'Width of each strip.' },
        { tex: 'f(0) + f(0.5) + f(1) + f(1.5) = 0 + 0.25 + 1 + 2.25 = 3.5', text: 'Add the four left-edge heights.' },
        { tex: 'L_4 = 3.5 \\times 0.5 = 1.75', text: 'Multiply the sum of heights by the common width.' },
      ],
      answer: 'L_4 = 1.75\\ \\text{(an underestimate)}',
    },
  },
  {
    kind: 'example',
    head: 'The same strips, a right sum',
    body: 'Same curve, same four strips, but a RIGHT Riemann sum.\nRight edges 0.5, 1, 1.5, 2 have heights 0.25, 1, 2.25, 4, which sum to 7.5.\nArea ≈ 7.5 × 0.5 = 3.75, an overestimate. The true area 8/3 ≈ 2.67 sits between 1.75 and 3.75.',
    steps: {
      steps: [
        { tex: 'x = 0.5,\\ 1,\\ 1.5,\\ 2', text: 'The right edge of each strip.' },
        { tex: '0.25 + 1 + 2.25 + 4 = 7.5', text: 'Add the four heights.' },
        { tex: 'R_4 = 7.5 \\times 0.5 = 3.75', text: 'Multiply by Δx.' },
        { tex: '1.75 < \\tfrac{8}{3} < 3.75', text: 'The truth is trapped between the left and right sums.' },
      ],
      answer: 'R_4 = 3.75\\ \\text{(an overestimate)}',
    },
  },
  {
    kind: 'example',
    head: 'The midpoint sum',
    body: 'Same curve, same four strips, but heights read at the midpoints 0.25, 0.75, 1.25, 1.75.\nThe heights are 0.0625, 0.5625, 1.5625, 3.0625, which sum to 5.25.\nArea ≈ 5.25 × 0.5 = 2.625, very close to 8/3 ≈ 2.667.',
    steps: {
      steps: [
        { tex: '\\bar{x} = 0.25,\\ 0.75,\\ 1.25,\\ 1.75', text: 'The middle of each strip.' },
        { tex: '0.25^{2} = 0.0625,\\quad 0.75^{2} = 0.5625', text: 'Square the first two midpoints.' },
        { tex: '1.25^{2} = 1.5625,\\quad 1.75^{2} = 3.0625', text: 'Square the last two.' },
        { tex: '0.0625 + 0.5625 + 1.5625 + 3.0625 = 5.25', text: 'Add the heights.' },
        { tex: 'M_4 = 5.25 \\times 0.5 = 2.625', text: 'Multiply by Δx.' },
      ],
      answer: 'M_4 = 2.625',
    },
  },
  {
    kind: 'example',
    head: 'The trapezoid rule',
    body: 'Use the trapezoid rule with n = 4 on the same curve.\nEach strip becomes a trapezoid whose top joins two points on the curve, with area (Δx/2)(left height + right height).\nAdding them: (0.5/2)[f(0) + 2f(0.5) + 2f(1) + 2f(1.5) + f(2)] = 0.25 × 11 = 2.75.',
    art: trapFig(),
    steps: {
      steps: [
        { tex: 'T_n = \\tfrac{\\Delta x}{2}\\big[f(x_0) + 2f(x_1) + \\cdots + 2f(x_{n-1}) + f(x_n)\\big]', text: 'Interior heights are shared by two trapezoids, so they count twice.' },
        { tex: '\\tfrac{0.5}{2} = 0.25', text: 'Half the strip width.' },
        { tex: '0 + 2(0.25) + 2(1) + 2(2.25) + 4 = 0 + 0.5 + 2 + 4.5 + 4 = 11', text: 'The bracket.' },
        { tex: 'T_4 = 0.25 \\times 11 = 2.75', text: 'Multiply.' },
      ],
      answer: 'T_4 = 2.75',
    },
  },
  {
    kind: 'example',
    head: 'Another way: average the left and right sums',
    body: 'A trapezoid sum is exactly the average of the left and right sums, because each trapezoid is the average of the two rectangles on its strip.\n(L₄ + R₄)/2 = (1.75 + 3.75)/2 = 5.5/2 = 2.75.\nSame 2.75 with no new arithmetic, and a quick check on the long formula.',
    steps: {
      steps: [
        { tex: 'T_n = \\tfrac{L_n + R_n}{2}', text: 'Each trapezoid averages the left and right rectangles on its strip.' },
        { tex: '\\tfrac{1.75 + 3.75}{2} = \\tfrac{5.5}{2}', text: 'Plug in the two sums already computed.' },
        { tex: '= 2.75', text: 'Matches the direct formula.' },
      ],
      answer: 'T_4 = 2.75',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: speedometer readings',
    body: 'A car speedometer reads 10, 14, 20 and 22 m/s at t = 0, 2, 4 and 6 s. Estimate the distance traveled with a left Riemann sum.\nSketch the readings as bars: each bar is speed × 2 seconds = distance covered in that interval.\nLeft heights 10, 14, 20 (the final 22 is never used): (10 + 14 + 20) × 2 = 88 m. A right sum gives 112 m; the truth is between.',
    art: speedFig(),
    steps: {
      steps: [
        { tex: '\\Delta t = 2\\ \\text{s}', text: 'Readings every two seconds.' },
        { tex: '10 + 14 + 20 = 44', text: 'Left heights: the first three readings.' },
        { tex: '44 \\times 2 = 88\\ \\text{m}', text: 'Speed times time is distance.' },
        { tex: '(14 + 20 + 22) \\times 2 = 112\\ \\text{m}', text: 'The right sum, for comparison. The car sped up, so left is low and right is high.' },
      ],
      answer: '\\approx 88\\ \\text{m (left sum)}',
    },
  },
  {
    kind: 'example',
    head: 'Signed area by geometry',
    body: 'Compute the integral of (x − 1) from 0 to 3 using geometry.\nThe line crosses the axis at x = 1. From 0 to 1 the triangle sits below the axis: area ½ · 1 · 1 = 0.5, counted as −0.5.\nFrom 1 to 3 the triangle is above: ½ · 2 · 2 = 2. Total signed area: 2 − 0.5 = 1.5.',
    steps: {
      steps: [
        { tex: 'x - 1 = 0 \;\\Rightarrow\; x = 1', text: 'Where the line crosses the axis: split there.' },
        { tex: '\\tfrac{1}{2}(1)(1) = 0.5 \;\\to\; -0.5', text: 'The triangle from 0 to 1 lies below the axis.' },
        { tex: '\\tfrac{1}{2}(2)(2) = 2', text: 'The triangle from 1 to 3 lies above.' },
        { tex: '-0.5 + 2 = 1.5', text: 'Add the signed pieces.' },
      ],
      answer: '\\int_{0}^{3} (x - 1)\\,dx = 1.5',
    },
  },
  {
    kind: 'protip',
    head: 'Rising curve: left is low, right is high',
    body: 'When f is increasing, every left rectangle sits under the curve and every right rectangle pokes above it, so L < true < R. For a decreasing curve the roles swap. Knowing which way the error goes lets you sanity-check an estimate in one glance.',
    compare: {
      cols: [
        { title: 'f increasing', lines: ['Left sum: underestimate', 'Right sum: overestimate'], tone: 'ok' },
        { title: 'f decreasing', lines: ['Left sum: overestimate', 'Right sum: underestimate'], tone: 'accent' },
      ],
      note: 'The right sum minus the left sum is always [f(b) − f(a)]·Δx, which shrinks to zero as n grows.',
    },
  },
  {
    kind: 'protip',
    head: 'Set up the table before you add',
    body: 'Write Δx first. Then list the sample points, then their heights, in a table. Add the heights, and multiply by Δx ONCE at the end. Multiplying every height by Δx separately works too, but it is four times the arithmetic and four chances to slip.',
    formula: {
      tex: 'S = \\Delta x \\cdot \\big[f(x_1) + f(x_2) + \\cdots + f(x_n)\\big]',
      note: 'Factor out the common width and multiply once.',
      parts: [
        { sym: '\\Delta x', means: 'compute it first: (b − a)/n', tone: 'accent' },
        { sym: 'f(x_i)', means: 'the heights from your table', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: using the last value in a left sum',
    body: 'A left sum uses f at the LEFT edge of every strip, so with four strips on [0, 2] it uses f(0), f(0.5), f(1), f(1.5) and never f(2). Including f(2) gives five heights for four strips, which is not a Riemann sum of anything.',
    compare: {
      cols: [
        { title: 'Five heights', tex: '0 + 0.25 + 1 + 2.25 + 4', lines: ['Mixes left and right', 'Wrong'], tone: 'bad' },
        { title: 'Four heights', tex: '0 + 0.25 + 1 + 2.25', lines: ['One per strip', 'L₄ = 3.5 × 0.5 = 1.75'], tone: 'ok' },
      ],
      note: 'n strips means n heights. Count them.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: forgetting Δx, or forgetting the sign',
    body: 'Two classic slips. Adding the heights and stopping gives 3.5 instead of 1.75: the sum of heights must be multiplied by the width. And below the axis, area counts NEGATIVE: the integral of x − 2 from 0 to 2 is −2, not 2.',
    compare: {
      cols: [
        { title: 'Forgot Δx', tex: '3.5', lines: ['Just the heights', 'Should be 3.5 × 0.5'], tone: 'bad' },
        { title: 'Forgot the sign', tex: '\\int_{0}^{2}(x - 2)\\,dx = 2', lines: ['The triangle is below the axis', 'Should be −2'], tone: 'bad' },
      ],
      note: 'Height × width, and keep the sign of the height.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: an integral from a table',
    body: 'A function is known only at five points: f(0) = 2, f(1) = 5, f(2) = 7, f(3) = 8, f(4) = 8. Estimate ∫₀⁴ f(x) dx with the trapezoid rule.\nΔx = 1. Connect the dots and add the four trapezoids.\nT₄ = (1/2)[2 + 2(5) + 2(7) + 2(8) + 8] = (1/2)(50) = 25.',
    art: dataTrap(),
    table: {
      head: ['x', '0', '1', '2', '3', '4'],
      rows: [['f(x)', '2', '5', '7', '8', '8'], ['weight', '1', '2', '2', '2', '1']],
      note: 'End values count once, interior values twice.',
    },
    steps: {
      steps: [
        { tex: '\\Delta x = \\tfrac{4 - 0}{4} = 1', text: 'Four strips of width 1.' },
        { tex: '2 + 2(5) + 2(7) + 2(8) + 8', text: 'Ends once, interior points twice.' },
        { tex: '= 2 + 10 + 14 + 16 + 8 = 50', text: 'Add the weighted heights.' },
        { tex: 'T_4 = \\tfrac{1}{2} \\times 50 = 25', text: 'Multiply by Δx/2.' },
        { tex: 'L_4 = 22,\\quad R_4 = 28', text: 'Check: the trapezoid estimate is their average, (22 + 28)/2 = 25.' },
      ],
      answer: '\\int_{0}^{4} f(x)\\,dx \\approx 25',
    },
  },
  {
    kind: 'summary',
    head: 'Riemann sums, wrapped up',
    body: 'Chop [a, b] into n strips of width Δx = (b − a)/n, read a height on each strip (left, right or midpoint), add the heights, multiply by Δx. As n → ∞ the sum becomes the definite integral: signed area, negative below the axis. Use geometry when the region is a triangle or a rectangle.',
    table: {
      head: ['Method on x², [0, 2], n = 4', 'Value'],
      rows: [['Left sum L₄', '1.75'], ['Right sum R₄', '3.75'], ['Midpoint sum M₄', '2.625'], ['Trapezoid T₄', '2.75'], ['Exact integral', '8/3 ≈ 2.667']],
      mark: 4,
      note: 'Every estimate brackets the same exact value.',
    },
  },
];


// ── CALC-12 — Antiderivatives and the Fundamental Theorem ─────────────────

const areaX2 = (): SlideArt => {
  const ax = grid({ x: [0, 2.3], y: [0, 4.5] }, { x: [0.5, 1, 1.5, 2], y: [1, 2, 3, 4] });
  return art(
    'The region under the parabola y equals x squared from 0 to 2, shaded, with its exact area eight thirds written in',
    cap('∫₀² x² dx = F(2) − F(0), with F(x) = x³/3') + ax.body + shade(ax, sq, () => 0, 0, 2, AMB, '44') + ax.curve(sq, AMB, 2.8) + at(ax, 0.75, 3.6, 'exact area 8/3 ≈ 2.667', { size: 12, color: VIO }) + at(ax, 1.45, 0.7, '8/3', { size: 15, color: VIO }),
    'No rectangles: one antiderivative, two plug-ins, one subtraction.',
  );
};

const familyFig = (): SlideArt => {
  const ax = grid({ x: [-2.5, 2.5], y: [-2, 6] }, { x: [-2, -1, 1, 2], y: [2, 4] });
  let b = cap('Three antiderivatives of 2x: same slope everywhere') + ax.body;
  const cols = [SKY, AMB, EMR];
  [1, 0, -1].forEach((c, i) => {
    const F: Fn = (x) => x * x + c;
    b += ax.curve(F, cols[i], 2.6);
    b += seg(ax, 0.55, F(1) - 0.9, 1.45, F(1) + 0.9, ROSE, 2.4);
    b += dot(ax.X(1), ax.Y(F(1)), 4, ROSE);
    b += at(ax, 2.0, F(2), c === 1 ? 'x² + 1' : c === 0 ? 'x²' : 'x² − 1', { dx: 8, dy: 4, color: cols[i], anchor: 'start' });
  });
  b += at(ax, -1.6, 4.6, 'tangents all have slope 2', { color: ROSE, size: 11 });
  return art('Three parabolas, x squared plus 1, x squared, and x squared minus 1, stacked one unit apart, each with a short tangent segment of slope 2 drawn at x = 1', b, 'Shifting a curve up or down never changes its slope, so F(x) + C is also an antiderivative.');
};

const cosFig = (): SlideArt => {
  const ax = grid({ x: [0, 3.4], y: [-1.5, 1.5] }, { x: [Math.PI / 2, Math.PI], y: [-1, 1] }, { tickText: (v, axis) => (axis === 'x' ? (v > 2 ? 'π' : 'π/2') : String(v)) });
  return art(
    'The cosine curve from 0 to pi, with the region between 0 and pi over 2 shaded and labelled area 1',
    cap('∫₀^(π/2) cos x dx = sin(π/2) − sin 0 = 1') + ax.body + shade(ax, Math.cos, () => 0, 0, Math.PI / 2, EMR, '44') + ax.curve(Math.cos, AMB, 2.8) + at(ax, 0.72, 0.42, 'area 1', { size: 14, color: EMR }) + at(ax, 2.5, 0.9, 'y = cos x', { color: AMB, size: 12 }),
    'The antiderivative of cos x is sin x, and sin rises from 0 to 1 across this interval.',
  );
};

const ftc2Fig = (): SlideArt => {
  const ax = grid({ x: [0, 2.4], y: [0, 3.2] }, { x: [1, 2], y: [1, 2, 3] });
  const F: Fn = (x) => (x * x * x) / 3;
  return art(
    'The antiderivative F of x equals x cubed over 3, with F(0) = 0 and F(2) = 8/3 marked and the rise between them drawn as an arrow',
    cap('The integral is the RISE of an antiderivative') +
      ax.body +
      ax.curve(F, SKY, 2.8) +
      seg(ax, 2, 0, 2, 8 / 3, INK, 1.2, '4 3') +
      arrow(ax.X(2.15), ax.Y(0.05), ax.X(2.15), ax.Y(8 / 3 - 0.05), VIO, 2.4) +
      mark(ax, 0, 0, 'F(0) = 0', { dx: 36, dy: -10, color: SKY }) +
      mark(ax, 2, 8 / 3, 'F(2) = 8/3', { dx: -10, dy: -2, color: SKY, anchor: 'end' }) +
      at(ax, 1.0, 2.5, 'rise 8/3 − 0 = 8/3', { color: VIO, size: 12 }) +
      at(ax, 0.6, 1.4, 'F(x) = x³/3', { color: SKY, size: 12 }),
    'Plug in the top limit, subtract the bottom. That rise equals the area under f.',
  );
};

const ftc1Fig = (): SlideArt => {
  const ax = grid({ x: [0, 4.6], y: [0, 7] }, { x: [1, 2, 3, 4], y: [2, 4, 6] });
  const f: Fn = (t) => (t * t) / 4 + 1;
  return art(
    'A curve with the region under it shaded from 0 up to a movable right edge x, labelled g of x equals the area so far',
    cap('g(x) = ∫₀ˣ f(t) dt accumulates area as x moves right') +
      ax.body +
      shade(ax, f, () => 0, 0, 2.5, SKY, '44') +
      ax.curve(f, AMB, 2.8) +
      seg(ax, 2.5, 0, 2.5, f(2.5), SKY, 2) +
      arrow(ax.X(2.6), ax.Y(0.5), ax.X(3.3), ax.Y(0.5), SKY, 2) +
      at(ax, 2.5, 0, 'x', { dy: 18, color: SKY, size: 13 }) +
      at(ax, 1.25, 0.95, 'g(x) = area so far', { color: SKY, size: 12 }) +
      at(ax, 3.6, 5.6, 'y = f(t)', { color: AMB, size: 12 }),
    'Nudge x right and the area grows by a strip of height f(x). That is why g′(x) = f(x).',
  );
};

const recipFig = (): SlideArt => {
  const ax = grid({ x: [0, 3.6], y: [0, 2.6] }, { x: [1, 2], y: [1, 2] });
  const f: Fn = (x) => 1 / x;
  const E = Math.E;
  return art(
    'The curve y equals 1 over x with the region from 1 to e shaded and labelled area 1',
    cap('∫₁ᵉ (1/x) dx = ln e − ln 1 = 1') +
      ax.body +
      shade(ax, f, () => 0, 1, E, AMB, '44') +
      ax.curve((x) => (x >= 0.4 ? f(x) : NaN), AMB, 2.8) +
      seg(ax, E, 0, E, f(E), INK, 1.2, '4 3') +
      at(ax, E, 0, 'e ≈ 2.72', { dy: 18, color: VIO }) +
      at(ax, 1.8, 0.3, 'area 1', { size: 14, color: VIO }) +
      at(ax, 3.1, 0.75, 'y = 1/x', { color: AMB, size: 12 }),
    'The antiderivative of 1/x is ln|x|, and ln e = 1 while ln 1 = 0.',
  );
};

const rateFig = (): SlideArt => {
  const ax = grid({ x: [0, 5.6], y: [0, 22] }, { x: [1, 2, 3, 4, 5], y: [10, 20] }, { xLabel: 't (min)', yLabel: 'L/min' });
  return art(
    'The rate line r equals 4t from 0 to 5 minutes, with the triangle beneath it shaded and labelled 50 litres',
    cap('Rate r(t) = 4t: the area under it is the total') +
      ax.body +
      shade(ax, (t) => 4 * t, () => 0, 0, 5, SKY, '33') +
      ax.curve((t) => (t <= 5 ? 4 * t : NaN), AMB, 2.8) +
      seg(ax, 5, 0, 5, 20, SKY, 1.6, '4 3') +
      at(ax, 3.6, 5, 'area 50 L', { size: 14, color: VIO }) +
      at(ax, 5, 20, 'r(5) = 20', { dx: -10, dy: 4, color: SKY, anchor: 'end' }),
    'Integral by FTC: 2t² from 0 to 5 is 50. Geometry check: ½ · 5 · 20 = 50.',
  );
};

const rootFig = (): SlideArt => {
  const ax = grid({ x: [0, 4.6], y: [0, 7] }, { x: [1, 2, 3, 4], y: [2, 4, 6] });
  const f: Fn = (x) => 3 * Math.sqrt(x);
  return art(
    'The curve y equals 3 root x with the region from 1 to 4 shaded and labelled area 14',
    cap('∫₁⁴ 3√x dx = 2x^(3/2) from 1 to 4 = 16 − 2 = 14') +
      ax.body +
      shade(ax, f, () => 0, 1, 4, EMR, '44') +
      ax.curve(f, AMB, 2.8) +
      seg(ax, 1, 0, 1, f(1), INK, 1.2, '4 3') +
      seg(ax, 4, 0, 4, f(4), INK, 1.2, '4 3') +
      at(ax, 2.5, 1.6, 'area 14', { size: 14, color: VIO }) +
      at(ax, 0.9, 5.4, 'y = 3√x', { color: AMB, size: 12 }),
    'A fractional power: add 1 to ½ to get 3/2, then divide by 3/2.',
  );
};

const U12: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Run differentiation backwards',
    body: 'An antiderivative of f is any function whose derivative is f. The Fundamental Theorem says that is all you need to find an area exactly: evaluate the antiderivative at the top limit, subtract its value at the bottom. Today you learn to find antiderivatives and use F(b) − F(a).',
    art: areaX2(),
    formula: {
      tex: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a), \\qquad F\\,\\!\\prime = f',
      note: 'The Fundamental Theorem of Calculus, part 2.',
      parts: [
        { sym: 'F', means: 'any antiderivative of f', tone: 'accent' },
        { sym: 'F(b)', means: 'its value at the top limit', tone: 'ok' },
        { sym: 'F(a)', means: 'its value at the bottom limit, subtracted', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'A whole family of antiderivatives',
    body: 'The derivative of x² is 2x. So is the derivative of x² + 1 and of x² − 1, because a constant differentiates to zero. Every antiderivative of 2x is x² + C for some constant C. The graphs are the same parabola slid up or down, and at x = 1 every one of them has slope 2.',
    art: familyFig(),
    formula: {
      tex: '\\int 2x\\,dx = x^{2} + C',
      note: 'The indefinite integral names the whole family at once.',
      parts: [
        { sym: '\\int \\ldots dx', means: 'find all antiderivatives of what is inside', tone: 'accent' },
        { sym: 'x^{2}', means: 'one antiderivative: its derivative is 2x', tone: 'ok' },
        { sym: '+\\,C', means: 'any constant — shifting up or down keeps the slope', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Reverse the power rule',
    body: 'Differentiating xⁿ multiplies by the power and lowers it by one. Antidifferentiating does the opposite in the opposite order: add one to the power, then divide by the new power. So the antiderivative of xⁿ is xⁿ⁺¹/(n + 1) + C, for every n except −1.',
    art: flow([{ label: 'xⁿ', color: AMB }, { label: 'power + 1', color: SKY }, { label: '÷ new power', color: VIO }, { label: '+ C', color: EMR }], { horizontal: true, title: 'Power rule in reverse', caption: 'Check by differentiating: (n + 1)xⁿ/(n + 1) = xⁿ.' }),
    formula: {
      tex: '\\int x^{n}\\,dx = \\frac{x^{n+1}}{n + 1} + C \\qquad (n \\neq -1)',
      note: 'Up one, divide by the new power. For n = −1 the rule would divide by zero; that case is ln|x|.',
      parts: [
        { sym: 'n + 1', means: 'the new, higher power', tone: 'ok' },
        { sym: '\\tfrac{1}{n+1}', means: 'undoes the factor the power rule would create', tone: 'accent' },
        { sym: 'n \\neq -1', means: 'the one exception: 1/x integrates to ln|x|', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The special ones to memorise',
    body: 'A few antiderivatives do not come from the power rule. 1/x gives ln|x| + C. eˣ gives eˣ + C. cos x gives sin x + C. And sin x gives −cos x + C, with the minus sign, because the derivative of cos x is −sin x. Across [0, π/2] the area under cos x is sin(π/2) − sin 0 = 1.',
    art: cosFig(),
    table: {
      head: ['f(x)', 'Antiderivative F(x)', 'Check: F′(x)'],
      rows: [['xⁿ (n ≠ −1)', 'xⁿ⁺¹/(n + 1) + C', 'xⁿ'], ['1/x', 'ln|x| + C', '1/x'], ['eˣ', 'eˣ + C', 'eˣ'], ['cos x', 'sin x + C', 'cos x'], ['sin x', '−cos x + C', 'sin x']],
      mark: 4,
      note: 'The sine row carries the minus sign. Differentiate your answer to be sure.',
    },
    formula: {
      tex: '\\int \\sin x\\,dx = -\\cos x + C, \\qquad \\int \\cos x\\,dx = \\sin x + C',
      note: 'The two trig antiderivatives, with the sign where it belongs.',
      parts: [
        { sym: '-\\cos x', means: 'differentiates to sin x, so the minus is required', tone: 'bad' },
        { sym: '\\sin x', means: 'differentiates to cos x, no sign change', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'FTC part 2: plug in the top, subtract the bottom',
    body: 'To evaluate a definite integral, find ANY antiderivative F, then compute F(b) − F(a). The integral is the rise of F across the interval. For x² on [0, 2], F(x) = x³/3 rises from F(0) = 0 to F(2) = 8/3, so the area is 8/3. No rectangles needed.',
    art: ftc2Fig(),
    formula: {
      tex: '\\int_{0}^{2} x^{2}\\,dx = \\Big[\\tfrac{x^{3}}{3}\\Big]_{0}^{2} = \\tfrac{8}{3} - 0 = \\tfrac{8}{3}',
      note: 'The square bracket means: evaluate at the top, subtract the value at the bottom.',
      parts: [
        { sym: '\\big[\\,\\cdot\\,\\big]_{0}^{2}', means: 'F(2) − F(0)', tone: 'accent' },
        { sym: '\\tfrac{8}{3}', means: 'F at the top limit: 2³/3', tone: 'ok' },
        { sym: '0', means: 'F at the bottom limit: 0³/3', tone: 'plain' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'FTC part 1, and the net change idea',
    body: 'Define g(x) = ∫ₐˣ f(t) dt, the area accumulated from a up to x. Then g′(x) = f(x): accumulating and differentiating undo each other. Turned around, the integral of a RATE is the NET CHANGE: integrate velocity and you get displacement, integrate a flow rate and you get the amount that flowed in.',
    art: ftc1Fig(),
    compare: {
      cols: [
        { title: 'Part 1', tex: '\\tfrac{d}{dx}\\int_{a}^{x} f(t)\\,dt = f(x)', lines: ['Differentiate the accumulated area', 'You get the integrand back'], tone: 'accent' },
        { title: 'Part 2', tex: '\\int_{a}^{b} F\\,\\!\\prime(x)\\,dx = F(b) - F(a)', lines: ['Integrate a rate of change', 'You get the net change'], tone: 'ok' },
      ],
      note: 'Two faces of one fact: derivative and integral are inverse operations.',
    },
  },
  {
    kind: 'example',
    head: 'Start simple: the antiderivative of 3x² + 2x',
    body: 'Find the antiderivative of 3x² + 2x.\nTerm by term: 3x² becomes 3 · x³/3 = x³, and 2x becomes 2 · x²/2 = x².\nAdd the constant: x³ + x² + C. Check: the derivative of x³ + x² is 3x² + 2x.',
    steps: {
      steps: [
        { tex: '\\int 3x^{2}\\,dx = 3 \\cdot \\tfrac{x^{3}}{3} = x^{3}', text: 'Power up to 3, divide by 3; the 3s cancel.' },
        { tex: '\\int 2x\\,dx = 2 \\cdot \\tfrac{x^{2}}{2} = x^{2}', text: 'Power up to 2, divide by 2; the 2s cancel.' },
        { tex: 'x^{3} + x^{2} + C', text: 'Add the pieces and the constant.' },
        { tex: '\\tfrac{d}{dx}(x^{3} + x^{2} + C) = 3x^{2} + 2x', text: 'Check by differentiating.' },
      ],
      answer: 'x^{3} + x^{2} + C',
    },
  },
  {
    kind: 'example',
    head: 'The exact area under x² on [0, 2]',
    body: 'Evaluate ∫₀² x² dx exactly.\nAn antiderivative is x³/3. F(2) − F(0) = 8/3 − 0 = 8/3.\nThat is about 2.667, right between the Riemann estimates 1.75 and 3.75 from Unit 11.',
    steps: {
      steps: [
        { tex: 'F(x) = \\tfrac{x^{3}}{3}', text: 'Reverse power rule: up to 3, divide by 3.' },
        { tex: 'F(2) = \\tfrac{2^{3}}{3} = \\tfrac{8}{3}', text: 'Evaluate at the top limit.' },
        { tex: 'F(0) = \\tfrac{0^{3}}{3} = 0', text: 'Evaluate at the bottom limit.' },
        { tex: '\\tfrac{8}{3} - 0 = \\tfrac{8}{3} \\approx 2.667', text: 'Subtract. It lands between the left sum 1.75 and the right sum 3.75.' },
      ],
      answer: '\\int_{0}^{2} x^{2}\\,dx = \\tfrac{8}{3}',
    },
  },
  {
    kind: 'example',
    head: 'A logarithm appears: ∫₁ᵉ 1/x dx',
    body: 'Evaluate the integral of 1/x from 1 to e.\nThe power rule fails for x⁻¹, so use the special antiderivative ln|x|.\nln e − ln 1 = 1 − 0 = 1.',
    art: recipFig(),
    steps: {
      steps: [
        { tex: 'F(x) = \\ln|x|', text: 'The one power the reverse power rule cannot handle.' },
        { tex: 'F(e) = \\ln e = 1', text: 'Top limit: e is the number whose natural log is 1.' },
        { tex: 'F(1) = \\ln 1 = 0', text: 'Bottom limit.' },
        { tex: '1 - 0 = 1', text: 'Subtract.' },
      ],
      answer: '\\int_{1}^{e} \\frac{1}{x}\\,dx = 1',
    },
  },
  {
    kind: 'example',
    head: 'A trig integral: ∫₀^(π/2) cos x dx',
    body: 'Evaluate the integral of cos x from 0 to π/2.\nAn antiderivative of cos x is sin x.\nsin(π/2) − sin 0 = 1 − 0 = 1.',
    steps: {
      steps: [
        { tex: 'F(x) = \\sin x', text: 'The derivative of sin x is cos x.' },
        { tex: 'F(\\tfrac{\\pi}{2}) = \\sin\\tfrac{\\pi}{2} = 1', text: 'Top limit.' },
        { tex: 'F(0) = \\sin 0 = 0', text: 'Bottom limit.' },
        { tex: '1 - 0 = 1', text: 'Subtract.' },
      ],
      answer: '\\int_{0}^{\\pi/2} \\cos x\\,dx = 1',
    },
  },
  {
    kind: 'example',
    head: 'Another way: pin down C with an initial condition',
    body: 'f′(x) = 2x + 1 and f(1) = 4. Find f(x).\nAntidifferentiate to get the family f(x) = x² + x + C, then use the given point to find which member it is.\n1 + 1 + C = 4 gives C = 2, so f(x) = x² + x + 2. Check: f′ = 2x + 1 and f(1) = 4.',
    steps: {
      steps: [
        { tex: 'f(x) = \\int (2x + 1)\\,dx = x^{2} + x + C', text: 'The whole family of antiderivatives.' },
        { tex: 'f(1) = 1^{2} + 1 + C = 4', text: 'Impose the initial condition.' },
        { tex: '2 + C = 4 \;\\Rightarrow\; C = 2', text: 'Solve for the constant.' },
        { tex: 'f(x) = x^{2} + x + 2', text: 'Check: f′(x) = 2x + 1 and f(1) = 1 + 1 + 2 = 4.' },
      ],
      answer: 'f(x) = x^{2} + x + 2',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: water flowing in',
    body: 'Water flows into a tank at r(t) = 4t litres per minute. How much water enters during the first 5 minutes?\nSketch the rate: a line from 0 up to r(5) = 20. The total is the area under it, a triangle.\nBy the FTC: ∫₀⁵ 4t dt = [2t²]₀⁵ = 50 − 0 = 50 litres. Geometry agrees: ½ · 5 · 20 = 50.',
    art: rateFig(),
    steps: {
      steps: [
        { tex: '\\text{total} = \\int_{0}^{5} 4t\\,dt', text: 'The integral of a rate is the net change.' },
        { tex: 'F(t) = 4 \\cdot \\tfrac{t^{2}}{2} = 2t^{2}', text: 'Antiderivative.' },
        { tex: 'F(5) - F(0) = 2(25) - 0 = 50', text: 'Top minus bottom.' },
        { tex: '\\tfrac{1}{2}(5)(20) = 50', text: 'Geometry check: a triangle with base 5 and height 20.' },
      ],
      answer: '50\\ \\text{litres}',
    },
  },
  {
    kind: 'protip',
    head: 'Check every antiderivative by differentiating',
    body: 'Antidifferentiation is guess-and-check, and the check is free: differentiate your answer and see if you get the integrand back. If you got x³ + x² + C for 3x² + 2x, differentiate it: 3x² + 2x. Done. If the check fails, you catch the slip before it costs anything.',
    art: flow([{ label: 'integrand f(x)', color: AMB }, { label: 'guess F(x) + C', color: SKY }, { label: 'differentiate F', color: VIO }, { label: 'got f back? done', color: EMR }], { horizontal: true, title: 'The free check', caption: 'A wrong sign or a missing factor shows up the moment you differentiate.' }),
  },
  {
    kind: 'protip',
    head: 'Indefinite gets + C, definite gets a number',
    body: 'An indefinite integral ∫ f(x) dx is a family of functions and always ends in + C. A definite integral ∫ₐᵇ f(x) dx is a single number, and the C cancels in F(b) − F(a), so you may leave it out there. Know which kind you are computing before you start.',
    compare: {
      cols: [
        { title: 'Indefinite', tex: '\\int 2x\\,dx = x^{2} + C', lines: ['A family of functions', 'Always + C'], tone: 'accent' },
        { title: 'Definite', tex: '\\int_{1}^{3} 2x\\,dx = 9 - 1 = 8', lines: ['One number', 'The C cancels'], tone: 'ok' },
      ],
      note: '(F(b) + C) − (F(a) + C) = F(b) − F(a): any C you add disappears.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: the sign on sin and cos',
    body: 'The antiderivative of sin x is −cos x, with a minus, while the antiderivative of cos x is sin x, with no minus. Students flip these constantly. Differentiate to check: d/dx(−cos x) = sin x. The sign is right when the check works.',
    compare: {
      cols: [
        { title: 'Wrong', tex: '\\int \\sin x\\,dx = \\cos x + C', lines: ['Check: d/dx(cos x) = −sin x', 'Sign is off'], tone: 'bad' },
        { title: 'Right', tex: '\\int \\sin x\\,dx = -\\cos x + C', lines: ['Check: d/dx(−cos x) = sin x', 'Matches'], tone: 'ok' },
      ],
      note: 'So ∫₀^π sin x dx = [−cos x]₀^π = −(−1) − (−1) = 2.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: F(bottom) − F(top)',
    body: 'It is F(top) − F(bottom), never the other way round. Reversing the order flips the sign of every definite integral, turning an area of 8/3 into −8/3. Write the bracket with the top limit above the bottom, evaluate top first, then subtract.',
    compare: {
      cols: [
        { title: 'Reversed', tex: 'F(0) - F(2) = -\\tfrac{8}{3}', lines: ['Negative area for a region above the axis', 'Wrong'], tone: 'bad' },
        { title: 'Correct', tex: 'F(2) - F(0) = \\tfrac{8}{3}', lines: ['Top first, then subtract the bottom', 'Right'], tone: 'ok' },
      ],
      note: 'A positive function on [a, b] must give a positive integral. Use that as a sanity check.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: a fractional power',
    body: 'Evaluate ∫₁⁴ 3√x dx.\nWrite √x as x^(1/2). Add 1 to the power: 3/2. Divide by 3/2, which is multiplying by 2/3, so the antiderivative is 3 · (2/3)x^(3/2) = 2x^(3/2).\nF(4) − F(1) = 2 · 8 − 2 · 1 = 16 − 2 = 14.',
    art: rootFig(),
    steps: {
      steps: [
        { tex: '3\\sqrt{x} = 3x^{1/2}', text: 'Write the root as a power.' },
        { tex: '\\tfrac{1}{2} + 1 = \\tfrac{3}{2}', text: 'Add one to the power.' },
        { tex: '3 \\cdot \\tfrac{x^{3/2}}{3/2} = 3 \\cdot \\tfrac{2}{3}x^{3/2} = 2x^{3/2}', text: 'Divide by the new power: dividing by 3/2 is multiplying by 2/3.' },
        { tex: 'F(4) = 2 \\cdot 4^{3/2} = 2 \\cdot 8 = 16', text: '4^(3/2) is (√4)³ = 2³ = 8.' },
        { tex: 'F(1) = 2 \\cdot 1 = 2', text: 'Bottom limit.' },
        { tex: '16 - 2 = 14', text: 'Subtract.' },
      ],
      answer: '\\int_{1}^{4} 3\\sqrt{x}\\,dx = 14',
    },
  },
  {
    kind: 'summary',
    head: 'Antiderivatives and the FTC, wrapped up',
    body: 'An antiderivative F has F′ = f, and there is a whole family F + C. Reverse the power rule (up one, divide by the new power), memorise the special ones, and check by differentiating. FTC part 2: ∫ₐᵇ f = F(b) − F(a). FTC part 1: the derivative of an accumulated area is the integrand. An initial condition pins down C, and the integral of a rate is the net change.',
    formula: {
      tex: '\\int_{a}^{b} f(x)\\,dx = F(b) - F(a), \\qquad \\frac{d}{dx}\\int_{a}^{x} f(t)\\,dt = f(x)',
      note: 'Both parts of the Fundamental Theorem on one line.',
      parts: [
        { sym: 'F(b) - F(a)', means: 'top minus bottom: the exact area', tone: 'ok' },
        { sym: '+\\,C', means: 'on every indefinite integral', tone: 'warn' },
        { sym: 'g\\,\\!\\prime(x) = f(x)', means: 'accumulate, then differentiate, and you are back', tone: 'accent' },
      ],
    },
  },
];

// ── CALC-13 — u-substitution and area between curves ──────────────────────

const betweenFig = (): SlideArt => {
  const ax = grid({ x: [-0.2, 1.3], y: [-0.2, 1.3] }, { x: [0.5, 1], y: [0.5, 1] });
  return art(
    'The line y equals x and the parabola y equals x squared between 0 and 1, with the thin region between them shaded and labelled area one sixth',
    cap('Area between y = x and y = x² on [0, 1]') +
      ax.body +
      shade(ax, (x) => x, sq, 0, 1, EMR, '55') +
      ax.curve((x) => x, SKY, 2.8) +
      ax.curve(sq, AMB, 2.8) +
      at(ax, 0.45, 0.75, 'y = x', { color: SKY, size: 12 }) +
      at(ax, 0.8, 0.42, 'y = x²', { color: AMB, size: 12 }) +
      at(ax, 0.55, 0.4, 'area 1/6', { color: EMR, size: 12 }) +
      mark(ax, 1, 1, '(1, 1)', { dx: 28, dy: -4, color: ROSE }) +
      mark(ax, 0, 0, undefined, { color: ROSE }),
    'Top minus bottom, integrated between the crossings at 0 and 1.',
  );
};

const braceFig = (): SlideArt => {
  let b = cap('Spot u and du inside the integrand');
  b += text(72, 118, '∫', { size: 30, fill: INK });
  b += text(150, 118, '(x² + 1)³', { size: 22, fill: AMB });
  b += text(215, 118, '·', { size: 22, fill: INK });
  b += text(265, 118, '2x dx', { size: 22, fill: EMR });
  b += brace(98, 204, 146, 'u = x² + 1', AMB, 13);
  b += brace(230, 300, 146, 'du = 2x dx', EMR, 13);
  b += text(200, 212, '= ∫ u³ du = u⁴/4 + C', { size: 15, fill: VIO });
  b += text(200, 240, 'the derivative of the inside is sitting right there', { size: 11, op: 0.7 });
  return art('The integral of x squared plus 1 cubed times 2x dx, with a brace under the inside function labelled u and a brace under 2x dx labelled du', b, 'u is the inside function; du is its derivative times dx. Both must be present.');
};

const halfFig = (): SlideArt => {
  let b = cap('Missing a constant? Borrow it');
  b += rect(30, 84, 150, 60, SKY, `${SKY}22`, 2.4, 12) + text(105, 108, 'need', { size: 11, fill: SKY }) + text(105, 130, 'du = 2x dx', { size: 15, fill: SKY });
  b += rect(220, 84, 150, 60, ROSE, `${ROSE}22`, 2.4, 12) + text(295, 108, 'have', { size: 11, fill: ROSE }) + text(295, 130, 'x dx', { size: 15, fill: ROSE });
  b += arrow(214, 114, 186, 114, VIO, 2.4);
  b += text(200, 170, 'x dx = ½ du', { size: 16, fill: VIO });
  b += text(200, 198, 'so ∫ x·e^(x²) dx = ½ ∫ eᵘ du', { size: 13, fill: INK });
  b += text(200, 226, 'the ½ waits out front', { size: 11, op: 0.7 });
  return art('Two boxes: the du you need, 2x dx, and the x dx you actually have, with the fix x dx equals one half du written beneath', b, 'Only a missing CONSTANT can be borrowed this way. A missing x cannot.');
};

const limitsFig = (): SlideArt => {
  const ax = grid({ x: [0, 1.3], y: [0, 2.6] }, { x: [0.5, 1], y: [1, 2] }, { xLabel: 'x', yLabel: 'u' });
  const u: Fn = (x) => x * x + 1;
  return art(
    'The graph of u equals x squared plus 1, showing that x = 0 maps to u = 1 and x = 1 maps to u = 2',
    cap('u = x² + 1 sends the x-limits to new u-limits') +
      ax.body +
      ax.curve(u, AMB, 2.8) +
      seg(ax, 1, 0, 1, 2, SKY, 1.4, '4 3') +
      seg(ax, 0, 2, 1, 2, SKY, 1.4, '4 3') +
      mark(ax, 0, 1, 'x = 0 → u = 1', { dx: 54, dy: -8, color: ROSE }) +
      mark(ax, 1, 2, 'x = 1 → u = 2', { dx: -10, dy: -8, color: ROSE, anchor: 'end' }),
    'Plug each old limit into u. Then integrate in u and never switch back.',
  );
};

const enclosedFig = (): SlideArt => {
  const ax = grid({ x: [-2, 3], y: [-1, 5] }, { x: [-1, 1, 2], y: [1, 2, 3, 4] });
  const L: Fn = (x) => x + 2;
  return art(
    'The line y equals x plus 2 and the parabola y equals x squared, crossing at (−1, 1) and (2, 4), with the region trapped between them shaded',
    cap('Enclosed by y = x + 2 and y = x²') +
      ax.body +
      shade(ax, L, sq, -1, 2, EMR, '44') +
      ax.curve(L, SKY, 2.8) +
      ax.curve(sq, AMB, 2.8) +
      mark(ax, -1, 1, '(−1, 1)', { dx: -10, dy: -4, color: ROSE, anchor: 'end' }) +
      mark(ax, 2, 4, '(2, 4)', { dx: 10, dy: 2, color: ROSE, anchor: 'start' }) +
      at(ax, 0.5, 1.4, 'area 9/2', { color: EMR, size: 13 }) +
      at(ax, 0.2, 3.4, 'y = x + 2', { color: SKY, size: 12 }) +
      at(ax, 2.5, 2.4, 'y = x²', { color: AMB, size: 12 }),
    'Crossings at x = −1 and x = 2 are the limits; between them the line is on top.',
  );
};

const testPointFig = (): SlideArt => {
  const ax = grid({ x: [-0.2, 1.3], y: [-0.2, 1.3] }, { x: [0.5, 1], y: [0.5, 1] });
  return art(
    'The line y equals x and the parabola y equals x squared on [0, 1], with a vertical strip at x = 0.5 from the parabola up to the line showing top minus bottom',
    cap('Which curve is on top? Test x = 0.5') +
      ax.body +
      shade(ax, (x) => x, sq, 0, 1, EMR, '33') +
      ax.curve((x) => x, SKY, 2.8) +
      ax.curve(sq, AMB, 2.8) +
      seg(ax, 0.5, 0.25, 0.5, 0.5, ROSE, 3.5) +
      mark(ax, 0.5, 0.5, '0.5 on the line', { dx: -12, dy: -2, color: SKY, anchor: 'end' }) +
      mark(ax, 0.5, 0.25, '0.25 on the parabola', { dx: 12, dy: 12, color: AMB, anchor: 'start' }) +
      at(ax, 0.5, 0.375, 'strip height 0.25', { dx: 60, color: ROSE, size: 11 }),
    'The strip height is top − bottom = x − x²; integrate that from 0 to 1.',
  );
};

const fourFig = (): SlideArt => {
  const ax = grid({ x: [-3, 3], y: [-1, 5] }, { x: [-2, -1, 1, 2], y: [1, 2, 3] });
  return art(
    'The horizontal line y equals 4 and the parabola y equals x squared, with the bowl-shaped region between them from −2 to 2 shaded and labelled area 32 over 3',
    cap('Between y = 4 and y = x²: crossings at x = ±2') +
      ax.body +
      shade(ax, () => 4, sq, -2, 2, SKY, '44') +
      ax.curve(() => 4, SKY, 2.8) +
      ax.curve(sq, AMB, 2.8) +
      mark(ax, -2, 4, '(−2, 4)', { dx: -10, dy: 16, color: ROSE, anchor: 'end' }) +
      mark(ax, 2, 4, '(2, 4)', { dx: 10, dy: 16, color: ROSE, anchor: 'start' }) +
      at(ax, 0, 2.2, 'area 32/3', { color: SKY, size: 13 }) +
      at(ax, 2.6, 4.45, 'y = 4', { color: SKY, size: 12 }),
    'Solve x² = 4 for the limits, then integrate 4 − x² from −2 to 2.',
  );
};

const U13: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Undo the chain rule, then measure between curves',
    body: 'u-substitution runs the chain rule backwards: pick the inside function as u, rewrite the integral in u, and it becomes one you already know. Then you will put integrals to work measuring the region trapped between two curves: top minus bottom, between the crossings.',
    art: betweenFig(),
    formula: {
      tex: '\\text{Area} = \\int_{a}^{b} \\big(\\text{top}(x) - \\text{bottom}(x)\\big)\\,dx',
      note: 'Every thin strip has height top − bottom; add them up from one crossing to the other.',
      parts: [
        { sym: 'a,\\ b', means: 'where the curves cross — the limits', tone: 'accent' },
        { sym: '\\text{top} - \\text{bottom}', means: 'the height of a strip, always positive', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'u-substitution reverses the chain rule',
    body: 'The chain rule says the derivative of F(g(x)) is F′(g(x)) · g′(x). So an integrand of the form f(inside) · (derivative of inside) comes from a chain rule. Pick u = the inside function, compute du = u′(x) dx, and rewrite the whole integral in terms of u.',
    art: flow([{ label: 'pick u = inside', color: AMB }, { label: 'du = u′(x) dx', color: EMR }, { label: 'rewrite all in u', color: SKY }, { label: 'integrate, back to x', color: VIO }], { horizontal: true, title: 'The four moves of u-substitution', caption: 'Nothing with an x may survive the rewrite: every piece becomes u or du.' }),
    formula: {
      tex: '\\int f\\big(g(x)\\big)\\,g\\,\\!\\prime(x)\\,dx = \\int f(u)\\,du, \\qquad u = g(x)',
      note: 'The chain rule, read right to left.',
      parts: [
        { sym: 'u = g(x)', means: 'the inside function', tone: 'accent' },
        { sym: 'du = g\\,\\!\\prime(x)\\,dx', means: 'its derivative, with the dx attached', tone: 'ok' },
        { sym: 'f(u)\\,du', means: 'a plain integral in u with no x left', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The test: is du really there?',
    body: 'After choosing u, the leftover factor must be du, or a constant times du. For ∫ 2x(x² + 1)³ dx, u = x² + 1 gives du = 2x dx, and 2x dx IS sitting in the integrand. The integral becomes ∫ u³ du. If the leftover is not a constant multiple of du, u-substitution is not the tool.',
    art: braceFig(),
    compare: {
      cols: [
        { title: 'Works', tex: '\\int 2x(x^{2}+1)^{3}\\,dx', lines: ['u = x² + 1, du = 2x dx', 'du is present'], tone: 'ok' },
        { title: 'Does not work', tex: '\\int (x^{2}+1)^{3}\\,dx', lines: ['u = x² + 1 needs 2x dx', 'No x factor to supply it'], tone: 'bad' },
      ],
      note: 'Expand the second one instead, or use a different method. Substitution needs du.',
    },
  },
  {
    kind: 'concept',
    head: 'A missing constant is fine',
    body: 'If du = 2x dx but the integrand only has x dx, write x dx = du/2 and pull the 1/2 out front. For ∫ x·e^(x²) dx, u = x² gives du = 2x dx, so the integral is (1/2)∫ eᵘ du = (1/2)eᵘ + C. Only constants can be borrowed this way; a missing x cannot.',
    art: halfFig(),
    formula: {
      tex: 'x\\,dx = \\tfrac{1}{2}\\,du \\quad\\Longrightarrow\\quad \\int x\\,e^{x^{2}}\\,dx = \\tfrac{1}{2}\\int e^{u}\\,du',
      note: 'Solve du = 2x dx for the piece you actually have.',
      parts: [
        { sym: '\\tfrac{1}{2}', means: 'the borrowed constant, parked outside', tone: 'accent' },
        { sym: 'e^{u}\\,du', means: 'the clean integral that is left', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Definite integral? Change the limits too',
    body: 'For a definite integral, convert the limits along with everything else: plug the old x-limits into u. With u = x² + 1, x = 0 gives u = 1 and x = 1 gives u = 2. Then ∫₀¹ 2x(x² + 1)³ dx = ∫₁² u³ du, and you never have to switch back to x.',
    art: limitsFig(),
    formula: {
      tex: '\\int_{0}^{1} 2x(x^{2}+1)^{3}\\,dx = \\int_{1}^{2} u^{3}\\,du',
      note: 'New variable, new limits. The two integrals are the same number.',
      parts: [
        { sym: 'x = 0 \\to u = 1', means: 'plug the bottom x-limit into u', tone: 'accent' },
        { sym: 'x = 1 \\to u = 2', means: 'plug the top x-limit into u', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Area between curves: top minus bottom',
    body: 'Find where the curves cross first; those crossings are the limits. Between them, the height of a thin strip is top − bottom, so the area is ∫ₐᵇ (top − bottom) dx. For y = x + 2 and y = x², the crossings are x = −1 and x = 2, the line is on top, and the area is 9/2. If the curves swap places, split at the crossing.',
    art: enclosedFig(),
    formula: {
      tex: '\\int_{-1}^{2} \\big[(x + 2) - x^{2}\\big]\\,dx = \\tfrac{9}{2}',
      note: 'Line on top, parabola underneath, from one crossing to the other.',
      parts: [
        { sym: '-1,\\ 2', means: 'solutions of x² = x + 2', tone: 'accent' },
        { sym: '(x + 2) - x^{2}', means: 'top minus bottom: test x = 0 gives 2 − 0 > 0', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: ∫ 2x(x² + 1)³ dx',
    body: 'Find the antiderivative of 2x(x² + 1)³.\nu = x² + 1, so du = 2x dx, and the integrand becomes u³ du.\n∫ u³ du = u⁴/4 + C. Back to x: (x² + 1)⁴/4 + C.',
    steps: {
      steps: [
        { tex: 'u = x^{2} + 1', text: 'The inside function.' },
        { tex: 'du = 2x\\,dx', text: 'Differentiate u; the 2x dx is exactly what is left over.' },
        { tex: '\\int u^{3}\\,du = \\tfrac{u^{4}}{4} + C', text: 'Reverse power rule in u.' },
        { tex: '\\tfrac{(x^{2}+1)^{4}}{4} + C', text: 'Substitute back. Check: the derivative is (x² + 1)³ · 2x.' },
      ],
      answer: '\\tfrac{(x^{2}+1)^{4}}{4} + C',
    },
  },
  {
    kind: 'example',
    head: 'Borrow a constant: ∫ x·e^(x²) dx',
    body: 'Find the antiderivative of x·e^(x²).\nu = x², du = 2x dx, but only x dx is present, so x dx = du/2.\nThe integral is (1/2)∫ eᵘ du = (1/2)eᵘ + C = (1/2)e^(x²) + C.',
    steps: {
      steps: [
        { tex: 'u = x^{2},\\quad du = 2x\\,dx', text: 'Inside function and its differential.' },
        { tex: 'x\\,dx = \\tfrac{1}{2}\\,du', text: 'Solve for the piece you have.' },
        { tex: '\\tfrac{1}{2}\\int e^{u}\\,du = \\tfrac{1}{2}e^{u} + C', text: 'The constant waits outside; eᵘ is its own antiderivative.' },
        { tex: '\\tfrac{1}{2}e^{x^{2}} + C', text: 'Back to x. Check: the derivative is ½ · e^(x²) · 2x = x e^(x²).' },
      ],
      answer: '\\tfrac{1}{2}e^{x^{2}} + C',
    },
  },
  {
    kind: 'example',
    head: 'Definite, with new limits',
    body: 'Evaluate ∫₀¹ 2x(x² + 1)³ dx.\nu = x² + 1. New limits: x = 0 gives u = 1, x = 1 gives u = 2.\n∫₁² u³ du = [u⁴/4]₁² = 16/4 − 1/4 = 15/4.',
    table: {
      head: ['x-limit', 'u = x² + 1'],
      rows: [['x = 0', 'u = 0 + 1 = 1'], ['x = 1', 'u = 1 + 1 = 2']],
      note: 'Convert both limits before integrating.',
    },
    steps: {
      steps: [
        { tex: 'u = x^{2} + 1,\\quad du = 2x\\,dx', text: 'Substitution.' },
        { tex: 'x = 0 \\to u = 1,\\quad x = 1 \\to u = 2', text: 'Convert the limits.' },
        { tex: '\\int_{1}^{2} u^{3}\\,du = \\Big[\\tfrac{u^{4}}{4}\\Big]_{1}^{2}', text: 'Integrate in u.' },
        { tex: '\\tfrac{16}{4} - \\tfrac{1}{4} = \\tfrac{15}{4}', text: 'Top minus bottom.' },
      ],
      answer: '\\tfrac{15}{4} = 3.75',
    },
  },
  {
    kind: 'example',
    head: 'Another way: go back to x, then plug in',
    body: 'Same integral, keeping the original limits.\nThe antiderivative in x is (x² + 1)⁴/4. Evaluate it at x = 1 and x = 0.\n(2⁴)/4 − (1⁴)/4 = 16/4 − 1/4 = 15/4. Same answer; just never mix x-limits with a u-antiderivative.',
    steps: {
      steps: [
        { tex: 'F(x) = \\tfrac{(x^{2}+1)^{4}}{4}', text: 'The antiderivative from the first example, back in x.' },
        { tex: 'F(1) = \\tfrac{(1 + 1)^{4}}{4} = \\tfrac{16}{4}', text: 'Top x-limit.' },
        { tex: 'F(0) = \\tfrac{(0 + 1)^{4}}{4} = \\tfrac{1}{4}', text: 'Bottom x-limit.' },
        { tex: '\\tfrac{16}{4} - \\tfrac{1}{4} = \\tfrac{15}{4}', text: 'Agrees with the u-limits route.' },
      ],
      answer: '\\tfrac{15}{4}',
    },
  },
  {
    kind: 'example',
    head: 'A trig inside: ∫ cos(3x) dx',
    body: 'Find the antiderivative of cos(3x).\nu = 3x, du = 3 dx, so dx = du/3.\n(1/3)∫ cos u du = (1/3) sin u + C = (1/3) sin(3x) + C.',
    steps: {
      steps: [
        { tex: 'u = 3x,\\quad du = 3\\,dx', text: 'The inside is 3x.' },
        { tex: 'dx = \\tfrac{1}{3}\\,du', text: 'Only dx is present, so borrow the 3.' },
        { tex: '\\tfrac{1}{3}\\int \\cos u\\,du = \\tfrac{1}{3}\\sin u + C', text: 'Antiderivative of cos is sin.' },
        { tex: '\\tfrac{1}{3}\\sin(3x) + C', text: 'Back to x. Check: derivative is ⅓ · cos(3x) · 3 = cos(3x).' },
      ],
      answer: '\\tfrac{1}{3}\\sin(3x) + C',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: between y = x and y = x²',
    body: 'Find the area between y = x and y = x² on [0, 1].\nSketch both: they meet at (0, 0) and (1, 1). Test x = 0.5: the line gives 0.5, the parabola gives 0.25, so the line is on top.\nArea = ∫₀¹ (x − x²) dx = [x²/2 − x³/3]₀¹ = 1/2 − 1/3 = 1/6.',
    art: testPointFig(),
    steps: {
      steps: [
        { tex: 'x = x^{2} \;\\Rightarrow\; x = 0,\\ 1', text: 'Crossings give the limits.' },
        { tex: '0.5 > 0.25', text: 'At x = 0.5 the line is above the parabola.' },
        { tex: '\\int_{0}^{1} (x - x^{2})\\,dx = \\Big[\\tfrac{x^{2}}{2} - \\tfrac{x^{3}}{3}\\Big]_{0}^{1}', text: 'Integrate top minus bottom.' },
        { tex: '\\tfrac{1}{2} - \\tfrac{1}{3} = \\tfrac{3}{6} - \\tfrac{2}{6} = \\tfrac{1}{6}', text: 'Evaluate; the bottom limit gives 0.' },
      ],
      answer: '\\text{area} = \\tfrac{1}{6}',
    },
  },
  {
    kind: 'example',
    head: 'A region with limits you must find',
    body: 'Find the area enclosed by y = x + 2 and y = x².\nCrossings: x² = x + 2 gives (x − 2)(x + 1) = 0, so x = −1 and x = 2. At x = 0 the line is on top (2 > 0).\nArea = ∫₋₁² (x + 2 − x²) dx = [x²/2 + 2x − x³/3] from −1 to 2 = 10/3 − (−7/6) = 27/6 = 9/2.',
    steps: {
      steps: [
        { tex: 'x^{2} - x - 2 = 0 \;\\Rightarrow\; (x - 2)(x + 1) = 0', text: 'Set the curves equal and factor.' },
        { tex: 'x = -1,\\quad x = 2', text: 'The limits of integration.' },
        { tex: 'F(x) = \\tfrac{x^{2}}{2} + 2x - \\tfrac{x^{3}}{3}', text: 'Antiderivative of (x + 2) − x².' },
        { tex: 'F(2) = 2 + 4 - \\tfrac{8}{3} = \\tfrac{10}{3}', text: 'Top limit.' },
        { tex: 'F(-1) = \\tfrac{1}{2} - 2 + \\tfrac{1}{3} = -\\tfrac{7}{6}', text: 'Bottom limit.' },
        { tex: '\\tfrac{10}{3} + \\tfrac{7}{6} = \\tfrac{20}{6} + \\tfrac{7}{6} = \\tfrac{27}{6} = \\tfrac{9}{2}', text: 'Subtract: a minus a negative is a plus.' },
      ],
      answer: '\\text{area} = \\tfrac{9}{2} = 4.5',
    },
  },
  {
    kind: 'protip',
    head: 'u is the inside; du must appear',
    body: 'Look for a function inside another: inside a power, an exponent, a trig function. That inside is u. Then check that its derivative (times a constant) is multiplied on. If both are there, substitution will work; if the derivative is missing an x, it will not.',
    table: {
      head: ['Integrand', 'u', 'du', 'Works?'],
      rows: [['2x(x² + 1)³', 'x² + 1', '2x dx', 'yes'], ['x·e^(x²)', 'x²', '2x dx = 2(x dx)', 'yes, borrow ½'], ['cos(3x)', '3x', '3 dx', 'yes, borrow ⅓'], ['(x² + 1)³', 'x² + 1', '2x dx — no x present', 'no']],
      mark: 3,
      note: 'Row four is the one that fools people. Expand it instead.',
    },
  },
  {
    kind: 'protip',
    head: 'Test a point between the crossings',
    body: 'After finding the crossings, plug one easy x from between them into both curves. The bigger value is the top curve on that whole stretch, because the curves cannot swap without crossing. One test point settles top and bottom for the entire integral.',
    compare: {
      cols: [
        { title: 'y = x + 2 vs y = x²', tex: 'x = 0:\\ 2 > 0', lines: ['Line on top', 'Integrate (x + 2) − x²'], tone: 'ok' },
        { title: 'y = x vs y = x²', tex: 'x = 0.5:\\ 0.5 > 0.25', lines: ['Line on top', 'Integrate x − x²'], tone: 'accent' },
      ],
      note: 'If top − bottom ever came out negative, you have the curves the wrong way round.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: x-limits on a u-antiderivative',
    body: 'The classic error: substitute u = x² + 1, integrate to u⁴/4, then plug in the ORIGINAL limits 0 and 1 as if they were u-values. That gives 1/4 − 0 = 1/4, which is wrong. Either convert the limits to u (1 and 2) or convert the antiderivative back to x. Never mix.',
    compare: {
      cols: [
        { title: 'Mixed up', tex: '\\Big[\\tfrac{u^{4}}{4}\\Big]_{0}^{1} = \\tfrac{1}{4}', lines: ['x-limits on a u-function', 'Wrong'], tone: 'bad' },
        { title: 'Consistent', tex: '\\Big[\\tfrac{u^{4}}{4}\\Big]_{1}^{2} = \\tfrac{15}{4}', lines: ['u-limits on a u-function', 'Right'], tone: 'ok' },
      ],
      note: 'Write the new limits the moment you write u.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: substituting when du is not there',
    body: '∫ (x² + 1)³ dx has no 2x factor, so u = x² + 1 leaves an x in the integrand that cannot be written in terms of u alone. Students sometimes "pull the x outside" the integral. You cannot: only constants come out. This one must be expanded and integrated term by term.',
    compare: {
      cols: [
        { title: 'Illegal', tex: '\\tfrac{1}{2x}\\int u^{3}\\,du', lines: ['x is not a constant', 'Cannot leave the integral'], tone: 'bad' },
        { title: 'Legal', tex: '\\int (x^{6} + 3x^{4} + 3x^{2} + 1)\\,dx', lines: ['Expand the cube', 'Power rule on each term'], tone: 'ok' },
      ],
      note: 'The test from earlier: is du, up to a constant, actually in the integrand?',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: the bowl under y = 4',
    body: 'Find the area between y = 4 and y = x².\nCrossings: x² = 4 gives x = −2 and x = 2, and the line y = 4 is on top (at x = 0, 4 > 0).\nArea = ∫₋₂² (4 − x²) dx = [4x − x³/3]₋₂² = (8 − 8/3) − (−8 + 8/3) = 32/3.',
    art: fourFig(),
    steps: {
      steps: [
        { tex: 'x^{2} = 4 \;\\Rightarrow\; x = \\pm 2', text: 'Crossings are the limits.' },
        { tex: '4 - x^{2} \\ge 0 \\text{ on } [-2, 2]', text: 'The line is on top: at x = 0 it is 4 against 0.' },
        { tex: 'F(x) = 4x - \\tfrac{x^{3}}{3}', text: 'Antiderivative of 4 − x².' },
        { tex: 'F(2) = 8 - \\tfrac{8}{3} = \\tfrac{16}{3}', text: 'Top limit.' },
        { tex: 'F(-2) = -8 + \\tfrac{8}{3} = -\\tfrac{16}{3}', text: 'Bottom limit.' },
        { tex: '\\tfrac{16}{3} - \\left(-\\tfrac{16}{3}\\right) = \\tfrac{32}{3}', text: 'Subtract. Symmetry check: twice the area on [0, 2], 2 · 16/3.' },
      ],
      answer: '\\text{area} = \\tfrac{32}{3} \\approx 10.67',
    },
  },
  {
    kind: 'summary',
    head: 'Substitution and area, wrapped up',
    body: 'u-substitution: u is the inside function, du = u′ dx must appear (a missing constant may be borrowed), rewrite everything in u, integrate, and either convert the limits or convert back to x. Area between curves: find the crossings, test a point to see which curve is on top, integrate top minus bottom, and split if they swap.',
    table: {
      head: ['Task', 'Recipe'],
      rows: [
        ['∫ f(inside) · inside′ dx', 'u = inside, du = inside′ dx'],
        ['Only x dx when du = 2x dx', 'x dx = ½ du, pull ½ out'],
        ['Definite integral in u', 'convert the limits: plug x into u'],
        ['Area between curves', 'crossings → limits; ∫ (top − bottom) dx'],
      ],
    },
  },
];


// ── CALC-14 — Volumes and accumulation ────────────────────────────────────

const rt: Fn = (x) => Math.sqrt(x);

const sqrtSolid = (): SlideArt => {
  const ax = grid({ x: [0, 4.8], y: [-2.8, 2.8] }, { x: [1, 2, 3, 4], y: [] });
  return art(
    'The region under y equals root x from 0 to 4 spun around the x-axis into a trumpet-shaped solid, with one disc at x = 2.5 highlighted',
    cap('Spin y = √x about the x-axis: V = 8π') + ax.body + solid(ax, rt, 0, 4, { slice: 2.5 }) + at(ax, 0.9, 1.6, 'r = √x', { color: AMB, size: 12 }) + at(ax, 2.5, -2.3, 'one disc', { color: ROSE, size: 12 }),
    'Every cross-section is a circle, so stack the discs along the axis.',
  );
};

const sliceFlow = (): SlideArt =>
  flow([{ label: 'Slice thin', color: SKY }, { label: 'Area A(x)', color: AMB }, { label: 'Add: ∫A dx', color: EMR }], { horizontal: true, title: 'Every volume here is the same idea', caption: 'Volume = thin slice area times thickness, added up with an integral.' });

const coneSolid = (): SlideArt => {
  const ax = grid({ x: [0, 3.6], y: [-3.4, 3.4] }, { x: [1, 2, 3], y: [] });
  return art(
    'The line y equals x from 0 to 3 spun about the x-axis into a cone with radius 3 and height 3, with one disc highlighted at x = 2',
    cap('Spin y = x on [0, 3]: a cone, V = 9π') + ax.body + solid(ax, (x) => x, 0, 3, { slice: 2 }) + at(ax, 1.0, 1.6, 'r = x', { color: AMB, size: 12 }) + at(ax, 2, -2.9, 'disc radius 2', { color: ROSE, size: 12 }),
    'The disc radius at x is just x, so the area is πx².',
  );
};

const washerSolid = (): SlideArt => {
  const ax = grid({ x: [0, 1.3], y: [-1.3, 1.3] }, { x: [0.5, 1], y: [] });
  return art(
    'The region between y equals x and y equals x squared from 0 to 1 spun about the x-axis into a hollowed solid, with one washer ring highlighted at x = 0.6',
    cap('Spin the gap between y = x and y = x²') + ax.body + solid(ax, (x) => x, 0, 1, { inner: sq, slice: 0.6 }) + at(ax, 0.3, 0.75, 'R = x', { color: AMB, size: 12 }) + at(ax, 0.3, -0.75, 'r = x²', { color: SKY, size: 12 }) + at(ax, 0.6, -1.15, 'one washer', { color: ROSE, size: 12 }),
    'The outer curve makes the big circle; the inner curve cuts out the hole.',
  );
};

const washerStrip = (): SlideArt => {
  const ax = grid({ x: [-0.2, 1.3], y: [-0.2, 1.3] }, { x: [0.5, 1], y: [0.5, 1] });
  return art(
    'The region between y equals x and y equals x squared with a vertical strip at x = 0.6 whose top is the outer radius R and whose bottom is the inner radius r',
    cap('Outer radius R = x, inner radius r = x²') + ax.body + shade(ax, (x) => x, sq, 0, 1, EMR, '33') + ax.curve((x) => x, AMB, 2.8) + ax.curve(sq, SKY, 2.8) + seg(ax, 0.6, 0, 0.6, 0.6, AMB, 2.6) + seg(ax, 0.6, 0, 0.6, 0.36, SKY, 4) + at(ax, 0.6, 0.6, 'R = 0.6', { dx: -12, dy: -8, color: AMB, anchor: 'end' }) + at(ax, 0.6, 0.18, 'r = 0.36', { dx: 12, dy: 4, color: SKY, anchor: 'start' }),
    'Measured from the x-axis: R reaches the line, r reaches the parabola.',
  );
};

const crossFig = (): SlideArt => {
  const ax = grid({ x: [0, 4.6], y: [0, 3] }, { x: [1, 2, 3, 4], y: [1, 2] });
  const c = 2.5, side = Math.sqrt(c);
  const px = ax.X(c), py = ax.Y(side);
  let b = cap('Square cross-sections on the base under y = √x') + ax.body + shade(ax, rt, () => 0, 0, 4, SKY, '33') + ax.curve(rt, AMB, 2.8);
  b += seg(ax, c, 0, c, side, ROSE, 3.5);
  b += `<rect x="${r1(px)}" y="${r1(py - 40)}" width="40" height="40" fill="${ROSE}44" stroke="${ROSE}" stroke-width="2" transform="translate(0 0)"/>`;
  b += at(ax, 3.9, 2.45, 'side s = √x', { color: ROSE, size: 12 }) + at(ax, 3.9, 2.05, 'A(x) = x', { color: VIO, size: 13 });
  return art('The region under y equals root x from 0 to 4 with a vertical strip at x = 2.5 and a square standing on that strip, its side equal to the strip length', b, 'The strip length is the side of the square, so its area is (√x)² = x.');
};

const accumFig = (): SlideArt => {
  const ax = grid({ x: [0, 3.8], y: [0, 22] }, { x: [1, 2, 3], y: [6, 12, 18] }, { xLabel: 't (min)', yLabel: 'L/min' });
  return art(
    'The rate line r equals 6t from 0 to 3 minutes with the triangle under it shaded as 27 litres of change, added on top of the 20 litres already in the tank',
    cap('Amount now = starting amount + area under the rate') + ax.body + shade(ax, (t) => 6 * t, () => 0, 0, 3, SKY, '44') + ax.curve((t) => (t <= 3 ? 6 * t : NaN), AMB, 2.8) + seg(ax, 3, 0, 3, 18, SKY, 1.6, '4 3') + at(ax, 2.2, 4, 'change 27 L', { color: VIO, size: 13 }) + at(ax, 1.4, 17.5, '20 + 27 = 47 L', { color: EMR, size: 13 }),
    'The integral gives only the CHANGE. Add the 20 litres that were already there.',
  );
};

const avgFig = (): SlideArt => {
  const ax = grid({ x: [0, 3.6], y: [0, 10.5] }, { x: [1, 2, 3], y: [3, 6, 9] });
  const x0 = ax.X(0), x1 = ax.X(3), yt = ax.Y(3), yb = ax.Y(0);
  return art(
    'The parabola y equals x squared on 0 to 3 with its area of 9 shaded, and a dashed rectangle of height 3 with the same area, touching the curve at x = root 3',
    cap('Average value of x² on [0, 3] is 3') + ax.body + shade(ax, sq, () => 0, 0, 3, SKY, '33') + ax.curve((x) => (x <= 3 ? sq(x) : NaN), AMB, 2.8) +
      `<rect x="${r1(x0)}" y="${r1(yt)}" width="${r1(x1 - x0)}" height="${r1(yb - yt)}" fill="none" stroke="${VIO}" stroke-width="2.2" stroke-dasharray="6 4"/>` +
      mark(ax, Math.sqrt(3), 3, 'f(√3) = 3', { dx: -10, dy: -10, color: ROSE, anchor: 'end' }) + at(ax, 0.9, 1.3, 'area 9', { color: SKY, size: 13 }) + at(ax, 0.9, 4.6, 'height 3, width 3', { color: VIO, size: 11 }),
    'The rectangle and the curve enclose the same area, 9, so the rectangle height 3 is the average value.',
  );
};

const challengeSolid = (): SlideArt => {
  const ax = grid({ x: [0, 2.4], y: [-4.6, 4.6] }, { x: [1, 2], y: [] });
  return art(
    'The region under y equals x squared from 0 to 2 spun about the x-axis into a flared trumpet solid, with a disc highlighted at x = 1.5',
    cap('Spin y = x² on [0, 2]: V = 32π/5') + ax.body + solid(ax, sq, 0, 2, { slice: 1.5 }) + at(ax, 0.8, 1.5, 'r = x²', { color: AMB, size: 12 }) + at(ax, 1.5, -3.6, 'disc area πx⁴', { color: ROSE, size: 11 }),
    'The radius x² squared gives x⁴, so the integrand is πx⁴.',
  );
};

const U14: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Build solids, track totals',
    body: 'Spin a flat region around an axis and you get a solid. Slice it into thin pieces, find the area of one piece, and add them with an integral. The same tool tracks a total that builds up over time: start amount plus the integral of the rate.',
    art: sqrtSolid(),
    formula: {
      tex: 'V = \\int_{a}^{b} A(x)\\,dx',
      note: 'Volume is the integral of the slice area.',
      parts: [
        { sym: 'A(x)', means: 'the area of one slice at position x', tone: 'accent' },
        { sym: 'dx', means: 'the thickness of each slice', tone: 'ok' },
        { sym: '\\int_{a}^{b}', means: 'add every slice from a to b', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Slice, measure one slice, add',
    body: 'Every volume formula here is the same idea. Cut the solid into thin pieces of thickness dx. Find the area A(x) of one piece. Add them all with V = ∫ A(x) dx. Only the shape of the slice changes: a disc, a ring, a square.',
    art: sliceFlow(),
    formula: {
      tex: 'dV = A(x)\\,dx \;\\Longrightarrow\; V = \\int_{a}^{b} A(x)\\,dx',
      note: 'A thin slab has volume area times thickness. The integral adds the slabs.',
      parts: [
        { sym: 'dV', means: 'the volume of one thin slab', tone: 'accent' },
        { sym: 'A(x)\\,dx', means: 'its area times its thickness', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Discs: revolve the region under a curve',
    body: 'Revolve the region under y = f(x) around the x-axis. Each slice is a disc of radius f(x), so its area is π[f(x)]². For y = x on [0, 3] the solid is a cone with radius 3 and height 3, and the radius at x is just x.',
    art: coneSolid(),
    formula: {
      tex: 'V = \\pi \\int_{a}^{b} [f(x)]^{2}\\,dx',
      note: 'Square the radius first, then integrate. Pi comes out front.',
      parts: [
        { sym: 'f(x)', means: 'the radius of the disc at x', tone: 'accent' },
        { sym: '\\pi\\,[f(x)]^{2}', means: 'area of that disc', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Washers: when there is a hole',
    body: 'If there is a gap between the region and the axis, each slice is a ring with an outer radius R and an inner radius r. Its area is the big circle minus the hole: πR² − πr². Square each radius, then subtract; never subtract first.',
    art: washerSolid(),
    formula: {
      tex: 'V = \\pi \\int_{a}^{b} \\big(R^{2} - r^{2}\\big)\\,dx',
      note: 'R reaches the far curve, r reaches the near curve, both measured from the axis.',
      parts: [
        { sym: 'R', means: 'outer radius: distance from the axis to the far edge', tone: 'accent' },
        { sym: 'r', means: 'inner radius: distance from the axis to the hole', tone: 'warn' },
        { sym: 'R^{2} - r^{2}', means: 'squares first, then subtract', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Cross-sections: squares standing on a base',
    body: 'Sometimes the slices are squares, semicircles or triangles standing on a flat base region. The length s(x) of the strip across the base is the side of the shape. For squares, A(x) = s², and there is no pi because nothing is revolved.',
    art: crossFig(),
    compare: {
      cols: [
        { title: 'Square', tex: 'A = s^{2}', lines: ['Side s = strip length', 'No pi'], tone: 'ok' },
        { title: 'Semicircle', tex: 'A = \\tfrac{\\pi}{8}s^{2}', lines: ['Diameter s', 'Half of a circle'], tone: 'accent' },
        { title: 'Equilateral triangle', tex: 'A = \\tfrac{\\sqrt{3}}{4}s^{2}', lines: ['Side s', 'Triangle on the strip'], tone: 'warn' },
      ],
      note: 'Find s(x), turn it into an area A(x), then integrate.',
    },
  },
  {
    kind: 'concept',
    head: 'Accumulation: start plus the integral of the rate',
    body: 'The integral of a rate is the net CHANGE, not the amount on hand. So amount at time t = starting amount + the integral of the rate from 0 to t. A tank that holds 20 L and fills at 6t L/min has 20 + 27 = 47 L after 3 minutes.',
    art: accumFig(),
    formula: {
      tex: 'Q(t) = Q(0) + \\int_{0}^{t} r(u)\\,du',
      note: 'Where you started, plus how much changed.',
      parts: [
        { sym: 'Q(0)', means: 'the amount already there at time zero', tone: 'accent' },
        { sym: '\\int_{0}^{t} r\\,du', means: 'net change: area under the rate', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: spin y = √x',
    body: 'Revolve the region under y = √x from 0 to 4 about the x-axis.\nThe disc radius is √x, so A(x) = π(√x)² = πx.\nV = π∫₀⁴ x dx = π[x²/2]₀⁴ = 8π ≈ 25.1.',
    steps: {
      steps: [
        { tex: 'A(x) = \\pi\\big(\\sqrt{x}\\big)^{2} = \\pi x', text: 'Square the radius: the square root and the square cancel.' },
        { tex: 'V = \\pi\\int_{0}^{4} x\\,dx', text: 'Pull pi out front.' },
        { tex: '\\pi\\Big[\\tfrac{x^{2}}{2}\\Big]_{0}^{4} = \\pi\\left(\\tfrac{16}{2} - 0\\right)', text: 'Antiderivative of x, then top minus bottom.' },
        { tex: '8\\pi \\approx 25.13', text: 'Eight times pi.' },
      ],
      answer: 'V = 8\\pi \\approx 25.13',
    },
  },
  {
    kind: 'example',
    head: 'Another way: check with the cone formula',
    body: 'Revolve y = x on [0, 3] about the x-axis. By discs, V = π∫₀³ x² dx = π[x³/3]₀³ = 9π.\nThe solid is a cone with radius 3 and height 3, and the cone formula (1/3)πr²h gives (1/3)π(9)(3) = 9π.\nTwo routes, one answer: the integral is just the cone formula in disguise.',
    steps: {
      steps: [
        { tex: 'V = \\pi\\int_{0}^{3} x^{2}\\,dx = \\pi\\Big[\\tfrac{x^{3}}{3}\\Big]_{0}^{3}', text: 'Discs of radius x.' },
        { tex: '\\pi\\cdot\\tfrac{27}{3} = 9\\pi', text: 'Evaluate.' },
        { tex: '\\tfrac{1}{3}\\pi r^{2} h = \\tfrac{1}{3}\\pi(3)^{2}(3) = 9\\pi', text: 'The geometry formula for a cone, r = 3 and h = 3.' },
      ],
      answer: 'V = 9\\pi\\ \\text{both ways}',
    },
  },
  {
    kind: 'example',
    head: 'A washer: the gap between y = x and y = x²',
    body: 'The region between y = x and y = x² on [0, 1] is revolved about the x-axis.\nThe line is higher, so R = x and r = x². At x = 0.6 that is R = 0.6 and r = 0.36.\nV = π∫₀¹ (x² − x⁴) dx = π(1/3 − 1/5) = 2π/15 ≈ 0.42.',
    art: washerStrip(),
    steps: {
      steps: [
        { tex: 'R = x,\\quad r = x^{2}', text: 'The line is the outer edge; the parabola is the inner edge.' },
        { tex: 'R^{2} - r^{2} = x^{2} - x^{4}', text: 'Square each radius, then subtract.' },
        { tex: 'V = \\pi\\Big[\\tfrac{x^{3}}{3} - \\tfrac{x^{5}}{5}\\Big]_{0}^{1}', text: 'Antiderivative of x² − x⁴.' },
        { tex: '\\pi\\left(\\tfrac{1}{3} - \\tfrac{1}{5}\\right) = \\pi\\cdot\\tfrac{5 - 3}{15}', text: 'Common denominator 15.' },
        { tex: '\\tfrac{2\\pi}{15} \\approx 0.419', text: 'Simplify.' },
      ],
      answer: 'V = \\tfrac{2\\pi}{15} \\approx 0.419',
    },
  },
  {
    kind: 'example',
    head: 'Square cross-sections',
    body: 'A solid has as its base the region under y = √x from 0 to 4, and cross-sections perpendicular to the x-axis are squares.\nEach square has side s = √x, so A(x) = (√x)² = x.\nV = ∫₀⁴ x dx = 8. No pi this time: the slices are squares, not discs.',
    steps: {
      steps: [
        { tex: 's(x) = \\sqrt{x}', text: 'The strip across the base is the side of the square.' },
        { tex: 'A(x) = s^{2} = x', text: 'Area of a square.' },
        { tex: 'V = \\int_{0}^{4} x\\,dx = \\Big[\\tfrac{x^{2}}{2}\\Big]_{0}^{4}', text: 'Integrate the slice area.' },
        { tex: '\\tfrac{16}{2} - 0 = 8', text: 'Evaluate.' },
      ],
      answer: 'V = 8',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: water in a tank',
    body: 'A tank holds 20 L at t = 0 and water flows in at r(t) = 6t L/min. How much is in the tank at t = 3 min?\nSketch the rate: a line up to 18 at t = 3, and the water that arrives is the triangle under it.\nAmount = 20 + ∫₀³ 6t dt = 20 + 27 = 47 L.',
    steps: {
      steps: [
        { tex: 'Q(3) = 20 + \\int_{0}^{3} 6t\\,dt', text: 'Starting amount plus net change.' },
        { tex: '\\int_{0}^{3} 6t\\,dt = \\Big[3t^{2}\\Big]_{0}^{3} = 27', text: 'Antiderivative 3t², then 27 − 0.' },
        { tex: '\\tfrac{1}{2}(3)(18) = 27', text: 'Geometry check: a triangle with base 3 and height 18.' },
        { tex: '20 + 27 = 47', text: 'Add what was already there.' },
      ],
      answer: '47\\ \\text{L}',
    },
  },
  {
    kind: 'example',
    head: 'Average value of x² on [0, 3]',
    body: 'The average value of f on [a, b] is (1/(b − a)) times the integral of f.\nThe integral of x² from 0 to 3 is 27/3 = 9, so the average is 9/3 = 3.\nCheck: f(√3) = 3, so the function reaches its own average inside the interval.',
    art: avgFig(),
    steps: {
      steps: [
        { tex: '\\tfrac{1}{3 - 0}\\int_{0}^{3} x^{2}\\,dx', text: 'One over the interval length, times the integral.' },
        { tex: '\\int_{0}^{3} x^{2}\\,dx = \\tfrac{3^{3}}{3} = 9', text: 'The area under the curve.' },
        { tex: '\\tfrac{9}{3} = 3', text: 'Divide by the width.' },
        { tex: 'x^{2} = 3 \;\\Rightarrow\; x = \\sqrt{3} \\approx 1.73', text: 'Where f hits the average, inside [0, 3].' },
      ],
      answer: '\\text{average value} = 3',
    },
  },
  {
    kind: 'protip',
    head: 'Name R, r and A(x) before integrating',
    body: 'Sketch the region, draw one strip, and label what you see: the radius of a disc, the two radii of a washer, or the side of a cross-section. Write the area A(x) on its own line, simplify it, and only then integrate. Most mistakes happen in A(x), not in the integral.',
    formula: {
      tex: '\\text{average value} = \\frac{1}{b - a}\\int_{a}^{b} f(x)\\,dx',
      note: 'The height of the rectangle that has the same area as the region under f.',
      parts: [
        { sym: '\\tfrac{1}{b-a}', means: 'divide by the width of the interval', tone: 'accent' },
        { sym: '\\int_{a}^{b} f\\,dx', means: 'the total area under f', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'protip',
    head: 'Check a volume against a solid you know',
    body: 'A disc volume can often be checked with geometry. Spin y = 2 on [0, 5] and you get a cylinder: π(2²)(5) = 20π, and the integral π∫₀⁵ 4 dx also gives 20π. If your integral disagrees with a shape you recognise, hunt the slip.',
    table: {
      head: ['Region spun', 'Integral', 'Solid', 'Volume'],
      rows: [['y = 2, [0, 5]', 'π∫ 4 dx', 'cylinder', '20π'], ['y = x, [0, 3]', 'π∫ x² dx', 'cone', '9π'], ['y = √x, [0, 4]', 'π∫ x dx', 'trumpet', '8π']],
      mark: 0,
      note: 'The first two have a textbook formula to compare with.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: (R − r)² is not R² − r²',
    body: 'A washer has area π(R² − r²). Students write π(R − r)² instead, which treats the ring like a single disc of radius R − r. With R = x and r = x², (x − x²)² = x² − 2x³ + x⁴, which is not x² − x⁴. Square each radius, THEN subtract.',
    compare: {
      cols: [
        { title: 'Wrong', tex: '\\pi\\,(R - r)^{2}', lines: ['Subtracts radii first', 'Gives x² − 2x³ + x⁴'], tone: 'bad' },
        { title: 'Right', tex: '\\pi\\,(R^{2} - r^{2})', lines: ['Big circle minus the hole', 'Gives x² − x⁴'], tone: 'ok' },
      ],
      note: 'Area of the ring = area of the outer disc minus area of the inner disc.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: forgetting the starting amount',
    body: 'The integral of a rate is the CHANGE, not the total. The tank had 20 L before any water flowed in, and the integral says only 27 L arrived. Answering 27 L ignores what was already there. Always add the starting amount.',
    compare: {
      cols: [
        { title: 'Change only', tex: '\\int_{0}^{3} 6t\\,dt = 27', lines: ['Just what flowed in', 'Not the amount on hand'], tone: 'bad' },
        { title: 'Total on hand', tex: '20 + 27 = 47', lines: ['Start plus change', 'The tank contains 47 L'], tone: 'ok' },
      ],
      note: 'Ask: is the question about the change, or about the amount now?',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: spin y = x² on [0, 2]',
    body: 'The region under y = x² from 0 to 2 is revolved about the x-axis. Find the volume.\nThe disc radius is x², so the disc area is π(x²)² = πx⁴.\nV = π∫₀² x⁴ dx = π[x⁵/5]₀² = 32π/5 ≈ 20.11.',
    art: challengeSolid(),
    steps: {
      steps: [
        { tex: 'r = x^{2}', text: 'The curve is the disc radius.' },
        { tex: 'A(x) = \\pi\\big(x^{2}\\big)^{2} = \\pi x^{4}', text: 'Square the radius: powers multiply, 2 times 2 is 4.' },
        { tex: 'V = \\pi\\int_{0}^{2} x^{4}\\,dx = \\pi\\Big[\\tfrac{x^{5}}{5}\\Big]_{0}^{2}', text: 'Integrate.' },
        { tex: '\\pi\\cdot\\tfrac{32}{5} = \\tfrac{32\\pi}{5}', text: '2⁵ is 32.' },
        { tex: '\\tfrac{32\\pi}{5} \\approx 20.11', text: 'As a decimal.' },
      ],
      answer: 'V = \\tfrac{32\\pi}{5} \\approx 20.11',
    },
  },
  {
    kind: 'summary',
    head: 'Volumes and accumulation, wrapped up',
    body: 'Slice, find A(x), integrate. Discs: π[f(x)]². Washers: π(R² − r²). Cross-sections: area from the strip length, such as s². Accumulation: starting amount plus the integral of the rate. Average value: the integral divided by the interval length.',
    table: {
      head: ['Situation', 'Slice area A(x)', 'Example result'],
      rows: [
        ['Disc', 'π[f(x)]²', '√x on [0, 4]: 8π'],
        ['Washer', 'π(R² − r²)', 'x and x² on [0, 1]: 2π/15'],
        ['Square cross-section', 's²', '√x base on [0, 4]: 8'],
        ['Accumulation', 'Q(0) + ∫ rate', '20 + 27 = 47 L'],
        ['Average value', '(1/(b−a)) ∫ f', 'x² on [0, 3]: 3'],
      ],
    },
  },
];

export const CALC_SLIDES_U08_14: SlideBank = { 'CALC-8': U8, 'CALC-9': U9, 'CALC-10': U10, 'CALC-11': U11, 'CALC-12': U12, 'CALC-13': U13, 'CALC-14': U14 };
