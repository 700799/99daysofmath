// Drawn figures for the illustrated Math Stories, group 2. Keyed by story id
// (the old video file name). Each array holds one figure per beat, in order,
// then one more for the closing "What you learned" slide.
import type { MathFigure } from '../mathFigure';
import { tex, draw, label, line, arrow, arc, rightAngle, INK, DIM, HI, OK, NO, SKY } from '../mathFigure';

// ── local helpers ──────────────────────────────────────────────────────────

const DARK = '#1e1b4b'; // text drawn on a bright fill
const SILVER = '#cbd5e1';

/** A rectangle. */
function rect(x: number, y: number, w: number, h: number, o: { stroke?: string; fill?: string; sw?: number; rx?: number; opacity?: number } = {}): string {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 0}" fill="${o.fill ?? 'none'}"` +
    `${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 3}"` : ''}${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`
  );
}

/** A filled dot. */
function dot(cx: number, cy: number, r: number, fill = INK, extra = ''): string {
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${fill}"${extra}/>`;
}

/** A polygon or polyline through points. */
function poly(pts: [number, number][], o: { stroke?: string; fill?: string; sw?: number; open?: boolean; opacity?: number } = {}): string {
  const p = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return `<${o.open ? 'polyline' : 'polygon'} points="${p}" fill="${o.fill ?? 'none'}" stroke="${o.stroke ?? INK}" stroke-width="${o.sw ?? 3}"${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`;
}

/** A quadratic-curve hop from (x1, y) to (x2, y) bulging up to `peak`. */
function hop(x1: number, x2: number, y: number, peak: number, stroke = HI, w = 2.5): string {
  const cy = 2 * peak - y;
  return `<path d="M ${x1} ${y} Q ${(x1 + x2) / 2} ${cy} ${x2} ${y}" fill="none" stroke="${stroke}" stroke-width="${w}"/>`;
}

/** n points evenly round a circle, the first at the top. */
function ring(n: number, cx: number, cy: number, r: number, turn = 0): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + turn + (2 * Math.PI * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
}

/** Every chord between n points: the complete graph. */
function allPairs(pts: [number, number][], stroke = DIM, w = 1.5, opacity = 1): string {
  let out = '';
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++)
      out += `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="${stroke}" stroke-width="${w}" opacity="${opacity}"/>`;
  return out;
}

/** A crown outline sitting on (x, base), width w. */
function crown(x: number, base: number, w: number, h: number, fill = HI): string {
  const s = w / 6;
  return poly(
    [
      [x, base], [x, base - h * 0.75], [x + s, base - h * 0.45], [x + 2 * s, base - h], [x + 3 * s, base - h * 0.45],
      [x + 4 * s, base - h], [x + 5 * s, base - h * 0.45], [x + w, base - h * 0.75], [x + w, base],
    ],
    { fill, stroke: fill, sw: 2 },
  );
}

/** An open-topped container (tub, cup, cylinder) as three sides. */
function cup(x: number, y: number, w: number, h: number, stroke = INK): string {
  return poly([[x, y], [x, y + h], [x + w, y + h], [x + w, y]], { open: true, stroke, sw: 3 });
}

/** A simple platform balance with two level pans; returns the drawing. */
function balance(beamY: number): string {
  return (
    poly([[200, beamY], [175, 290], [225, 290]], { fill: '#a5b4fc33', stroke: DIM, sw: 3 }) +
    line(40, beamY, 360, beamY, INK, 4) +
    line(140, 290, 260, 290, DIM, 3)
  );
}

// ── 6.EE-1 · Penny doubles every day ──────────────────────────────────────

const pennyX = (n: number) => 50 + ((n - 1) / 29) * 320;
const pennyCurve = (top: number, bottom: number) =>
  `<path d="${Array.from({ length: 30 }, (_, i) => {
    const v = 2 ** i / 2 ** 29;
    return `${i === 0 ? 'M' : 'L'} ${pennyX(i + 1).toFixed(1)} ${(bottom - v * (bottom - top)).toFixed(1)}`;
  }).join(' ')}" fill="none" stroke="${HI}" stroke-width="4"/>`;

const PENNY: MathFigure[] = [
  draw(
    'Two offers side by side: a stack of bills worth one million dollars now, or one penny that doubles each day for 30 days',
    label(200, 38, 'Which offer wins?', { size: 18, fill: HI }) +
      rect(25, 62, 160, 190, { stroke: DIM, rx: 12 }) +
      [0, 1, 2, 3, 4].map((i) => rect(55, 175 - i * 18, 100, 14, { fill: OK, rx: 3, opacity: 0.85 - i * 0.08 })).join('') +
      label(105, 92, 'cash now', { size: 13, fill: DIM }) +
      label(105, 228, '$1,000,000', { size: 16, fill: OK }) +
      label(200, 162, 'or', { size: 15, fill: DIM }) +
      rect(215, 62, 160, 190, { stroke: DIM, rx: 12 }) +
      label(295, 92, 'penny today', { size: 13, fill: DIM }) +
      [1, 2, 4].map((c, row) =>
        label(240, 128 + row * 30, `d${row + 1}`, { size: 12, fill: DIM }) +
          Array.from({ length: c }, (_, k) => dot(270 + k * 22, 124 + row * 30, 8, HI)).join(''),
      ).join('') +
      label(295, 228, '× 2 for 30 days', { size: 14, fill: HI }) +
      label(200, 292, '1¢ that doubles every day', { size: 14, fill: DIM }),
  ),
  draw(
    'Graph of the penny’s value over 30 days: the curve hugs the axis for weeks, then shoots up past a dashed one-million-dollar line near the end',
    line(50, 270, 375, 270, DIM, 3) + line(50, 270, 50, 50, DIM, 3) +
      line(50, 270 - 220 / 5.37, 375, 270 - 220 / 5.37, OK, 2.5, '7 5') +
      label(56, 220, '$1,000,000', { size: 12, fill: OK, anchor: 'start' }) +
      pennyCurve(50, 270) +
      label(150, 258, 'starts slow…', { size: 13, fill: DIM }) +
      label(330, 80, '…then scary fast', { size: 14, fill: HI, anchor: 'end' }) +
      label(50, 292, 'day 1', { size: 12, fill: DIM }) +
      label(362, 292, 'day 30', { size: 12, fill: DIM }) +
      label(200, 30, 'doubling is an exponent', { size: 16, fill: HI }),
  ),
  draw(
    'A table of the penny on chosen days: day 1 is 1 cent, day 5 is 16 cents, day 10 is $5.12, day 20 is $5,242.88, day 30 is still to come',
    label(90, 70, 'day', { size: 13, fill: DIM }) +
      label(230, 70, 'the penny is worth', { size: 13, fill: DIM }) +
      line(40, 82, 360, 82, DIM, 2) +
      ([
        ['1', '1¢', ''],
        ['5', '16¢', ''],
        ['10', '$5.12', 'about $5'],
        ['20', '$5,242.88', 'about $5,000'],
        ['30', 'BOOM', ''],
      ] as const).map(([d, v, note], i) => {
        const y = 115 + i * 38;
        const last = i === 4;
        return label(90, y, d, { size: 16, fill: last ? NO : INK }) +
          label(190, y, v, { size: 16, fill: last ? NO : i >= 2 ? HI : INK }) +
          (note ? label(310, y, note, { size: 12, fill: DIM }) : '');
      }).join('') +
      line(130, 98, 130, 280, DIM, 2) +
      label(200, 306, 'each day: × 2', { size: 14, fill: OK }),
  ),
  draw(
    'Two horizontal bars: the cash offer of $1,000,000 is short; the penny on day 30, $5,368,709.12, is more than five times as long',
    label(200, 38, 'the penny wins', { size: 18, fill: HI }) +
      label(40, 92, 'cash: $1,000,000', { size: 14, fill: OK, anchor: 'start' }) +
      rect(40, 102, 300 / 5.3687, 34, { fill: OK, rx: 4 }) +
      label(40, 178, 'penny, day 30: $5,368,709.12', { size: 14, fill: HI, anchor: 'start' }) +
      rect(40, 188, 300, 34, { fill: HI, rx: 4 }) +
      [1, 2, 3, 4, 5].map((k) => line(40 + (k * 300) / 5.3687, 188, 40 + (k * 300) / 5.3687, 222, DARK, 2)).join('') +
      label(200, 256, 'more than 5 × the million', { size: 14, fill: INK }) +
      label(200, 290, '2²⁹ = 536,870,912 pennies', { size: 14, fill: DIM }),
  ),
  tex(
    [
      '\\text{day } n:\\; 1 \\times 2^{\\,n-1} \\text{ cents}',
      '\\text{day } 30:\\; 2^{29} = 536{,}870{,}912 \\text{ cents}',
      '= \\$5{,}368{,}709.12',
    ],
    'Exponents count repeated multiplication',
  ),
  draw(
    'The day-30 total as one bar split by when the money arrived: the last day adds half of it, day 29 a quarter, day 28 an eighth, and all earlier days a sliver',
    label(200, 50, 'day 30 adds half the total', { size: 16, fill: HI }) +
      label(280, 122, '+ $2.68 million', { size: 13, fill: HI }) +
      label(160, 122, '+ $1.34M', { size: 12, fill: OK }) +
      rect(200, 138, 160, 56, { fill: HI }) +
      rect(120, 138, 80, 56, { fill: OK }) +
      rect(80, 138, 40, 56, { fill: SKY }) +
      rect(60, 138, 20, 56, { fill: DIM }) +
      rect(40, 138, 20, 56, { fill: DIM, opacity: 0.5 }) +
      rect(40, 138, 320, 56, { stroke: INK, sw: 2 }) +
      label(280, 172, 'day 30', { size: 15, fill: DARK }) +
      label(160, 172, 'day 29', { size: 13, fill: DARK }) +
      label(100, 172, '28', { size: 12, fill: DARK }) +
      line(40, 208, 40, 216, DIM, 2) + line(360, 208, 360, 216, DIM, 2) + line(40, 216, 360, 216, DIM, 2) +
      label(200, 240, 'total on day 30: $5.37 million', { size: 13, fill: DIM }) +
      label(200, 288, 'each double = everything before it', { size: 14, fill: OK }),
  ),
  draw(
    'Adding versus multiplying over 30 days: a line growing $100 a day stays flat on the axis at $3,000 while the doubling curve rockets to $5.37 million',
    line(50, 260, 375, 260, DIM, 3) + line(50, 260, 50, 60, DIM, 3) +
      pennyCurve(60, 260) +
      line(50, 257, 370, 255, NO, 3) +
      label(200, 34, 'adding vs multiplying', { size: 16, fill: INK }) +
      label(320, 74, '× 2 a day: $5.37 million', { size: 13, fill: HI, anchor: 'end' }) +
      label(200, 228, '+ $100 a day: only $3,000', { size: 13, fill: NO }) +
      label(50, 282, 'day 1', { size: 12, fill: DIM }) +
      label(362, 282, 'day 30', { size: 12, fill: DIM }) +
      label(200, 308, 'a straight line can’t keep up', { size: 13, fill: DIM }),
  ),
  draw(
    'A doubling tree of cells: one cell splits into 2, then 4, then 8, then 16',
    (() => {
      const rows = [70, 118, 166, 214, 262];
      let out = '';
      rows.forEach((y, k) => {
        const m = 2 ** k;
        const xs = Array.from({ length: m }, (_, i) => 30 + ((i + 0.5) * 280) / m);
        if (k > 0) {
          const pxs = Array.from({ length: m / 2 }, (_, i) => 30 + ((i + 0.5) * 280) / (m / 2));
          xs.forEach((x, i) => (out += line(pxs[Math.floor(i / 2)], rows[k - 1], x, y, DIM, 1.5)));
        }
        out += xs.map((x) => dot(x, y, k === 4 ? 6 : 9, k === 4 ? OK : SKY)).join('');
        out += label(352, y + 5, String(m), { size: 15, fill: k === 4 ? OK : INK });
      });
      return out;
    })() +
      label(200, 30, '1 cell → 16 cells in 4 doublings', { size: 14, fill: HI }) +
      label(200, 302, 'bacteria, savings, viral videos: × 2', { size: 13, fill: DIM }),
  ),
  draw(
    'Three bars after six steps from 1: adding 3 each time reaches 19, doubling reaches 64, tripling reaches 729',
    label(200, 40, 'start at 1, take 6 steps', { size: 16, fill: HI }) +
      ([
        ['+ 3 each step: 19', 19, NO],
        ['× 2 each step: 64', 64, SKY],
        ['× 3 each step: 729', 729, OK],
      ] as const).map(([t, v, c], i) => {
        const y = 100 + i * 70;
        return label(40, y - 12, t, { size: 14, fill: c, anchor: 'start' }) +
          rect(40, y, Math.max(4, (v / 729) * 320), 30, { fill: c, rx: 4 });
      }).join('') +
      label(200, 300, 'exponents leave adding far behind', { size: 14, fill: INK }),
  ),
];

// ── 6.EE-6 · Fibonacci's rabbits ──────────────────────────────────────────

/** The squares 1, 1, 2, 3, 5, 8 tiled into a 13 × 8 rectangle, with the spiral. */
function fibTiling(): string {
  const sizes = [1, 1, 2, 3, 5, 8];
  const sides = ['first', 'right', 'top', 'left', 'bottom', 'right'];
  let [x0, y0, x1, y1] = [0, 0, 1, 1];
  const sq: { x: number; y: number; s: number; side: string }[] = [{ x: 0, y: 0, s: 1, side: 'first' }];
  for (let i = 1; i < sizes.length; i++) {
    const s = sizes[i];
    const side = sides[i];
    let x = 0, y = 0;
    if (side === 'right') { x = x1; y = y0; x1 += s; }
    if (side === 'top') { x = x0; y = y0 - s; y0 -= s; }
    if (side === 'left') { x = x0 - s; y = y0; x0 -= s; }
    if (side === 'bottom') { x = x0; y = y1; y1 += s; }
    sq.push({ x, y, s, side });
  }
  const u = 24;
  const X = (x: number) => 44 + (x + 3) * u;
  const Y = (y: number) => 62 + (y + 2) * u;
  let out = '';
  let arcs = '';
  sq.forEach(({ x, y, s, side }, i) => {
    out += rect(X(x), Y(y), s * u, s * u, { stroke: i === 5 ? HI : DIM, sw: 2, fill: i === 5 ? '#fbbf2414' : 'none' });
    out += label(X(x + s / 2), Y(y + s / 2) + [4, 4, 5, 5, 7, 9][i], String(s), { size: [12, 12, 14, 16, 22, 28][i], fill: i === 5 ? HI : INK });
    // start, centre and end of the quarter arc, in unit coordinates
    const [sx, sy, ex, ey] =
      side === 'right' ? [x, y + s, x + s, y] :
      side === 'top' ? [x + s, y + s, x, y] :
      side === 'left' ? [x + s, y, x, y + s] :
      [x, y, x + s, y + s];
    arcs += `${i === 0 ? `M ${X(sx)} ${Y(sy)} ` : ''}A ${s * u} ${s * u} 0 0 0 ${X(ex)} ${Y(ey)} `;
  });
  return out + `<path d="${arcs}" fill="none" stroke="${OK}" stroke-width="3"/>`;
}

const FIB: MathFigure[] = [
  draw(
    'A strip of 12 month boxes: month 1 holds one pair of rabbits, month 12 holds a question mark',
    label(200, 45, 'Italy, 1202', { size: 17, fill: HI }) +
      label(200, 88, 'one pair; a new pair every month', { size: 14, fill: INK }) +
      Array.from({ length: 12 }, (_, i) =>
        rect(32 + i * 28, 140, 26, 40, { stroke: i === 0 || i === 11 ? HI : DIM, sw: 2, rx: 3 }) +
          label(45 + i * 28, 200, String(i + 1), { size: 11, fill: DIM }),
      ).join('') +
      dot(41, 160, 5, OK) + dot(50, 160, 5, OK) +
      label(353, 167, '?', { size: 20, fill: HI }) +
      arrow(60, 125, 340, 125, DIM, 2) +
      label(200, 224, 'month', { size: 12, fill: DIM }) +
      label(200, 272, 'pairs after 12 months?', { size: 16, fill: HI }),
    'Fibonacci’s puzzle, 1202',
  ),
  draw(
    'Rows of rabbit pairs for months 1 to 6: 1, 1, 2, 3, 5, 8. Grown pairs carry over, and every grown pair adds a newborn pair',
    ([
      [0, 1], [1, 0], [1, 1], [2, 1], [3, 2], [5, 3],
    ] as const).map(([a, y], k) => {
      const row = 46 + k * 40;
      let out = label(36, row + 5, `month ${k + 1}`, { size: 12, fill: DIM, anchor: 'start' });
      for (let i = 0; i < a + y; i++) {
        const cx = 128 + i * 26;
        out += i < a ? dot(cx, row, 9, HI) : `<circle cx="${cx}" cy="${row}" r="8" fill="none" stroke="${OK}" stroke-width="3"/>`;
      }
      out += label(364, row + 5, String(a + y), { size: 15, fill: k === 5 ? HI : INK, anchor: 'end' });
      return out;
    }).join('') +
      label(200, 296, '8 = 5 (last month) + 3 (two ago)', { size: 14, fill: OK }),
    'Filled = grown pair, ring = newborn pair',
  ),
  draw(
    'The sequence 1, 1, 2, 3, 5, 8, 13, 21 in boxes; under each box from the third on is the sum that made it, and arcs show 5 and 8 making 13',
    label(200, 50, 'each = sum of the two before', { size: 16, fill: HI }) +
      [1, 1, 2, 3, 5, 8, 13, 21].map((v, i) => {
        const x = 22 + i * 45;
        const hot = i >= 4 && i <= 6;
        return rect(x, 120, 40, 44, { stroke: hot ? HI : DIM, sw: 2, rx: 5 }) +
          label(x + 20, 149, String(v), { size: 16, fill: i === 6 ? HI : INK }) +
          (i >= 2 ? label(x + 20, 190, `${[1, 1, 2, 3, 5, 8, 13][i - 2]}+${[1, 1, 2, 3, 5, 8, 13][i - 1]}`, { size: 11, fill: DIM }) : '');
      }).join('') +
      hop(222, 312, 116, 88, OK) + hop(267, 312, 116, 98, OK) +
      label(200, 250, '1, 1, 2, 3, 5, 8, 13, 21, …', { size: 16, fill: INK }),
  ),
  draw(
    'Seeds placed like a sunflower head, each turned 137.5 degrees from the last; one of the spiral arms is highlighted',
    (() => {
      let out = '';
      for (let k = 1; k <= 220; k++) {
        const a = (k * 137.508 * Math.PI) / 180;
        const r = 8.1 * Math.sqrt(k);
        const hot = k % 21 === 0;
        const hot2 = k % 34 === 0;
        out += dot(200 + r * Math.cos(a), 160 + r * Math.sin(a), hot || hot2 ? 4.5 : 3.2, hot ? HI : hot2 ? OK : DIM);
      }
      return out;
    })() +
      label(200, 22, 'each seed turns 137.5°', { size: 14, fill: HI }) +
      label(200, 308, 'spirals come in 21s, 34s, 55s', { size: 14, fill: OK }),
    'Sunflower seeds spiral in Fibonacci counts',
  ),
  tex(['13 + 21 = 34', '21 + 34 = 55', '34 + 55 = 89', '55 + 89 = 144', '\\text{month } 12:\\; 144 \\text{ pairs}'], 'Keep adding the last two'),
  tex(['\\text{next} = \\text{previous} + \\text{one before}', 'F_n = F_{n-1} + F_{n-2}', 'F_1 = F_2 = 1'], 'The whole list fits in one rule: a recurrence'),
  draw(
    'From 5 and 8 two branches: 5 plus 8 equals 13 is right; 8 plus 8 equals 16 is wrong',
    rect(130, 50, 60, 44, { stroke: SKY, sw: 3, rx: 6 }) + rect(210, 50, 60, 44, { stroke: SKY, sw: 3, rx: 6 }) +
      label(160, 80, '5', { size: 20 }) + label(240, 80, '8', { size: 20 }) +
      arrow(170, 102, 110, 160, OK) + arrow(230, 102, 290, 160, NO) +
      rect(40, 168, 140, 50, { stroke: OK, sw: 3, rx: 8 }) +
      label(110, 200, '5 + 8 = 13', { size: 17, fill: OK }) +
      rect(220, 168, 140, 50, { stroke: NO, sw: 3, rx: 8 }) +
      label(290, 200, '8 + 8 = 16', { size: 17, fill: NO }) +
      line(230, 172, 350, 214, NO, 2.5) +
      label(110, 246, 'last two terms', { size: 13, fill: OK }) +
      label(290, 246, 'a term plus itself', { size: 13, fill: NO }) +
      label(200, 294, 'add the LAST TWO', { size: 16, fill: HI }),
  ),
  draw(
    'Ratios of neighbouring Fibonacci numbers plotted in turn: 1, 2, 1.5, 1.67, 1.6, 1.625, 1.615, 1.619, 1.618, zig-zagging onto a dashed line at 1.618',
    (() => {
      const F = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
      const Y = (r: number) => 240 - (r - 1) * 180;
      const pts = F.slice(1).map((f, i) => [56 + i * 36, Y(f / F[i])] as [number, number]);
      return (
        line(40, 240, 370, 240, DIM, 2) +
        line(40, Y(1.618), 370, Y(1.618), HI, 2.5, '7 5') +
        label(392, Y(1.618) - 8, '1.618', { size: 13, fill: HI, anchor: 'end' }) +
        label(34, 245, '1', { size: 12, fill: DIM, anchor: 'end' }) +
        label(34, 65, '2', { size: 12, fill: DIM, anchor: 'end' }) +
        poly(pts, { open: true, stroke: SKY, sw: 2.5 }) +
        pts.map(([x, y], i) => dot(x, y, 5, i >= 6 ? OK : INK)).join('')
      );
    })() +
      label(200, 32, 'neighbour ratios → 1.618', { size: 16, fill: HI }) +
      label(72, 296, '21÷13 ≈ 1.615', { size: 12, fill: OK }) +
      label(200, 296, '34÷21 ≈ 1.619', { size: 12, fill: OK }) +
      label(328, 296, '55÷34 ≈ 1.618', { size: 12, fill: OK }),
    'The golden ratio',
  ),
  draw(
    'Squares of side 1, 1, 2, 3, 5 and 8 tiled into a 13 by 8 rectangle, each new side the sum of the last two, with a spiral through them',
    label(200, 36, 'each new square = last two sides added', { size: 14, fill: HI }) +
      fibTiling() +
      label(200, 290, 'a rule from earlier terms: a recurrence', { size: 14, fill: OK }),
  ),
];

// ── 6.EE-9 · The handshake problem ────────────────────────────────────────

const H20 = ring(20, 200, 170, 108);
const H6 = ring(6, 200, 150, 95);
const NAMES = ['A', 'B', 'C', 'D', 'E', 'F'];

const HANDS: MathFigure[] = [
  draw(
    'Twenty dots in a circle with a faint line joining every pair; the 19 lines from one person are highlighted',
    allPairs(H20, DIM, 1, 0.35) +
      H20.slice(1).map(([x, y]) => line(H20[0][0], H20[0][1], x, y, HI, 1.5)).join('') +
      H20.map(([x, y], i) => dot(x, y, 6, i === 0 ? HI : INK)).join('') +
      label(200, 34, '20 friends, every pair once', { size: 15, fill: INK }) +
      label(200, 306, 'how many lines?', { size: 15, fill: HI }),
  ),
  draw(
    'Six people as the corners of a hexagon with a line between every pair: 15 lines',
    allPairs(H6, SKY, 2.5) +
      H6.map(([x, y], i) => dot(x, y, 9, HI) + label(200 + (x - 200) * 1.24, 150 + (y - 150) * 1.24 + 5, NAMES[i], { size: 14, fill: INK })).join('') +
      label(200, 302, '6 people: 15 handshakes', { size: 16, fill: HI }),
  ),
  draw(
    'A 6 by 6 grid of who-shakes-whom: the diagonal is crossed out, leaving 30 cells, and the cells above the diagonal, 15 of them, are the real handshakes',
    (() => {
      const x0 = 110, y0 = 62, c = 30;
      let out = '';
      for (let r = 0; r < 6; r++) {
        out += label(x0 - 12, y0 + r * c + 20, NAMES[r], { size: 12, fill: DIM });
        out += label(x0 + r * c + 15, y0 - 10, NAMES[r], { size: 12, fill: DIM });
        for (let k = 0; k < 6; k++) {
          const x = x0 + k * c, y = y0 + r * c;
          if (r === k) out += rect(x, y, c, c, { stroke: DIM, sw: 1 }) + line(x + 7, y + 7, x + c - 7, y + c - 7, NO, 2) + line(x + c - 7, y + 7, x + 7, y + c - 7, NO, 2);
          else out += rect(x + 2, y + 2, c - 4, c - 4, { fill: k > r ? OK : SKY, opacity: k > r ? 0.9 : 0.35, rx: 3 });
        }
      }
      out += rect(x0 + c, y0, c, c, { stroke: HI, sw: 3 }) + rect(x0, y0 + c, c, c, { stroke: HI, sw: 3 });
      return out;
    })() +
      label(200, 270, 'each of 6 meets 5: 6 × 5 = 30', { size: 14, fill: INK }) +
      label(200, 300, 'A–B and B–A are one: 30 ÷ 2 = 15', { size: 14, fill: OK }),
  ),
  tex(['20 \\times 19 \\div 2 = 380 \\div 2 = 190', '\\text{handshakes} = \\dfrac{n(n-1)}{2}'], 'One formula, any size of party'),
  draw(
    'Two pairs of bars: people go from 20 to 100, five times as many; handshakes go from 190 to 4,950, about twenty-six times as many',
    line(40, 260, 360, 260, DIM, 3) +
      rect(68, 260 - 36, 44, 36, { fill: SKY, rx: 3 }) + rect(128, 80, 44, 180, { fill: SKY, rx: 3 }) +
      label(90, 216, '20', { size: 14 }) + label(150, 72, '100', { size: 14 }) +
      rect(228, 260 - 7, 44, 7, { fill: OK, rx: 2 }) + rect(288, 80, 44, 180, { fill: OK, rx: 2 }) +
      label(250, 245, '190', { size: 14 }) + label(310, 72, '4,950', { size: 14 }) +
      label(120, 284, 'people', { size: 13, fill: SKY }) + label(280, 284, 'handshakes', { size: 13, fill: OK }) +
      label(120, 36, '× 5', { size: 18, fill: SKY }) + label(280, 36, '× 26', { size: 18, fill: HI }) +
      label(200, 310, '100 × 99 ÷ 2 = 4,950', { size: 13, fill: DIM }),
  ),
  draw(
    'Two small networks: 4 cities joined by 6 direct flights, and 5 teams joined by 10 round-robin games',
    allPairs(ring(4, 110, 150, 62, Math.PI / 4), SKY, 2.5) +
      ring(4, 110, 150, 62, Math.PI / 4).map(([x, y]) => dot(x, y, 8, HI)).join('') +
      allPairs(ring(5, 290, 152, 66), OK, 2.5) +
      ring(5, 290, 152, 66).map(([x, y]) => dot(x, y, 8, HI)).join('') +
      label(200, 40, 'spot “every pair”', { size: 16, fill: HI }) +
      label(110, 252, '4 cities: 6 flights', { size: 13, fill: SKY }) +
      label(290, 252, '5 teams: 10 games', { size: 13, fill: OK }) +
      label(110, 280, '4 × 3 ÷ 2 = 6', { size: 14, fill: INK }) +
      label(290, 280, '5 × 4 ÷ 2 = 10', { size: 14, fill: INK }),
  ),
  draw(
    'Ana and Ben joined by two arrows, Ana to Ben and Ben to Ana, which are the same single handshake; 380 counts every handshake twice, so halve it to 190',
    dot(80, 130, 16, SKY) + dot(320, 130, 16, SKY) +
      label(80, 172, 'Ana', { size: 15 }) + label(320, 172, 'Ben', { size: 15 }) +
      arrow(104, 116, 296, 116, NO) + arrow(296, 144, 104, 144, NO) +
      label(200, 102, 'Ana → Ben', { size: 13, fill: NO }) +
      label(200, 168, 'Ben → Ana', { size: 13, fill: NO }) +
      label(200, 210, '= 1 handshake', { size: 17, fill: OK }) +
      label(200, 256, '20 × 19 = 380 counts each twice', { size: 14, fill: NO }) +
      label(200, 292, '380 ÷ 2 = 190', { size: 17, fill: OK }),
  ),
  draw(
    'Small cases drawn in a row: 2 people make 1 line, 3 make 3, 4 make 6, 5 make 10, leading to the formula n(n − 1) ÷ 2',
    label(200, 40, 'test tiny cases, spot the pattern', { size: 14, fill: INK }) +
      ([2, 3, 4, 5] as const).map((n, i) => {
        const cx = 62 + i * 92;
        const pts = n === 2 ? ([[cx - 26, 125], [cx + 26, 125]] as [number, number][]) : ring(n, cx, 128, 32, n === 4 ? Math.PI / 4 : 0);
        return allPairs(pts, SKY, 2) + pts.map(([x, y]) => dot(x, y, 6, HI)).join('') +
          label(cx, 196, `n = ${n}`, { size: 13, fill: DIM }) +
          label(cx, 228, String((n * (n - 1)) / 2), { size: 20, fill: HI });
      }).join('') +
      label(200, 288, 'n people → n(n − 1) ÷ 2', { size: 17, fill: OK }),
  ),
  tex(['\\dfrac{n(n-1)}{2}', 'n = 6 \\;\\to\\; 15', 'n = 20 \\;\\to\\; 190', 'n = 100 \\;\\to\\; 4950'], 'Spot the pattern once; the formula answers every size'),
];

// ── 6.EE-10 · The chessboard rice puzzle ──────────────────────────────────

const CHESS: MathFigure[] = [
  draw(
    'An 8 by 8 chessboard of 64 squares with one grain of rice on the first square',
    Array.from({ length: 64 }, (_, i) => {
      const r = Math.floor(i / 8), c = i % 8;
      return (r + c) % 2 ? rect(88 + c * 28, 50 + r * 28, 28, 28, { fill: DIM, opacity: 0.35 }) : '';
    }).join('') +
      rect(88, 50, 224, 224, { stroke: INK, sw: 3 }) +
      rect(88, 50, 28, 28, { stroke: HI, sw: 3 }) +
      `<ellipse cx="102" cy="64" rx="4" ry="7" fill="${HI}"/>` +
      label(80, 69, 'start', { size: 12, fill: HI, anchor: 'end' }) +
      label(200, 32, 'the reward: rice on the board', { size: 15, fill: INK }) +
      label(200, 302, '64 squares', { size: 16, fill: HI }),
  ),
  draw(
    'The first eight squares of the board holding 1, 2, 4, 8, 16, 32, 64 and 128 grains, each double the one before',
    label(200, 50, 'double on every square', { size: 16, fill: HI }) +
      [1, 2, 4, 8, 16, 32, 64, 128].map((g, i) => {
        const x = 24 + i * 44;
        let grains = '';
        if (g <= 8) {
          const cols = g === 1 ? 1 : 2;
          for (let k = 0; k < g; k++) {
            const gx = x + 22 + (cols === 1 ? 0 : (k % 2) * 14 - 7);
            const rows = Math.ceil(g / cols);
            const gy = 132 + (Math.floor(k / cols) - (rows - 1) / 2) * 9;
            grains += `<ellipse cx="${gx}" cy="${gy}" rx="3" ry="4" fill="${HI}"/>`;
          }
        }
        return rect(x, 110, 44, 44, { stroke: DIM, sw: 2, fill: i % 2 ? '#a5b4fc22' : 'none' }) + grains +
          label(x + 22, 100, String(i + 1), { size: 11, fill: DIM }) +
          label(x + 22, 180, String(g), { size: 14, fill: g > 8 ? HI : INK }) +
          (i > 0 ? label(x, 206, '×2', { size: 11, fill: OK }) : '');
      }).join('') +
      label(200, 248, '… all 64 squares', { size: 14, fill: DIM }) +
      label(200, 290, 'the king: “such a small request”', { size: 13, fill: NO }),
  ),
  draw(
    'A table of grains: square 10 holds 512 (1,023 so far), square 20 holds 524,288 (over a million so far), square 32 holds 2,147,483,648, about 2.1 billion',
    label(200, 34, 'filling the board', { size: 16, fill: HI }) +
      label(70, 72, 'square', { size: 12, fill: DIM }) +
      label(200, 72, 'on that square', { size: 12, fill: DIM }) +
      label(330, 72, 'total so far', { size: 12, fill: DIM }) +
      line(30, 84, 380, 84, DIM, 2) +
      ([
        ['1', '1', '1'],
        ['10', '512', '1,023'],
        ['20', '524,288', '1,048,575'],
        ['32', '2,147,483,648', '4,294,967,295'],
      ] as const).map(([s, on, tot], i) => {
        const y = 118 + i * 40;
        return label(70, y, s, { size: 15 }) +
          label(200, y, on, { size: 13, fill: i === 3 ? HI : INK }) +
          label(330, y, tot, { size: 13, fill: i === 2 ? OK : DIM });
      }).join('') +
      label(200, 276, 'by square 20: over a million', { size: 13, fill: OK }) +
      label(200, 304, 'square 32: about 2.1 billion', { size: 13, fill: HI }),
  ),
  tex(
    ['\\text{square } 64:\\; 2^{63} \\text{ grains}', '2^{63} = 9{,}223{,}372{,}036{,}854{,}775{,}808', '\\approx 9 \\text{ quintillion}'],
    'More rice than has ever existed on Earth',
  ),
  draw(
    'Hops along the board every 10 squares: square 1 holds 1 grain, square 11 holds 1,024, square 21 about a million, square 31 about a billion; each hop multiplies by 1,024',
    label(200, 45, '10 doublings ≈ × 1,000', { size: 16, fill: HI }) +
      line(30, 180, 370, 180, DIM, 3) +
      [50, 150, 250, 350].map((x, i) =>
        dot(x, 180, 8, i === 3 ? HI : SKY) +
          label(x, 212, `sq ${1 + i * 10}`, { size: 13, fill: DIM }) +
          label(x, 244, ['1 grain', '1,024', '≈1 million', '≈1 billion'][i], { size: 13, fill: i === 3 ? HI : INK }) +
          (i < 3 ? hop(x + 6, x + 94, 168, 136, OK) + label(x + 50, 126, '× 1,024', { size: 13, fill: OK }) : ''),
      ).join('') +
      label(200, 292, 'square n holds 2ⁿ⁻¹ grains', { size: 14, fill: INK }),
  ),
  draw(
    'A ten-step staircase labelled 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, with the top step 2 to the tenth, about 1,000, highlighted',
    label(20, 58, '2, 4, 8, … 1024', { size: 15, fill: INK, anchor: 'start' }) +
      Array.from({ length: 10 }, (_, k) => {
        const i = k + 1;
        const x = 30 + k * 34;
        const top = 270 - 20 * i;
        return rect(x, top, 32, 20 * i, { fill: i === 10 ? HI : SKY, opacity: i === 10 ? 1 : 0.55, rx: 2 }) +
          label(x + 16, top - 7, String(2 ** i), { size: 12, fill: i === 10 ? HI : INK }) +
          label(x + 16, 264, `2${['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '¹⁰'][k]}`, { size: 11, fill: DARK });
      }).join('') +
      label(352, 38, 'about 1,000', { size: 13, fill: HI }) +
      label(200, 300, '2¹⁰ = 1024 ≈ 1,000', { size: 15, fill: OK }),
  ),
  draw(
    'Adding 2 versus doubling, drawn as bars on the same scale: 2, 4, 6, 8, 10, 12 barely rise while 2, 4, 8, 16, 32, 64 shoot up; by square 64 adding reaches 128 and doubling reaches 9,223,372,036,854,775,808',
    label(105, 34, 'adding 2', { size: 14, fill: NO }) + label(295, 34, 'doubling', { size: 14, fill: HI }) +
      line(25, 220, 185, 220, DIM, 2) + line(215, 220, 375, 220, DIM, 2) +
      [1, 2, 3, 4, 5, 6].map((k) => {
        const add = 2 * k, dbl = 2 ** k;
        const xa = 32 + (k - 1) * 25, xd = 222 + (k - 1) * 25;
        return rect(xa, 220 - add * 2.34, 20, add * 2.34, { fill: NO, rx: 2 }) +
          label(xa + 10, 212 - add * 2.34, String(add), { size: 11, fill: NO }) +
          rect(xd, 220 - dbl * 2.34, 20, dbl * 2.34, { fill: HI, rx: 2 }) +
          label(xd + 10, 212 - dbl * 2.34, String(dbl), { size: 11, fill: HI });
      }).join('') +
      label(105, 248, 'square 64: 128', { size: 13, fill: NO }) +
      label(295, 248, 'square 64:', { size: 13, fill: HI }) +
      label(200, 292, '9,223,372,036,854,775,808', { size: 15, fill: HI }),
  ),
  draw(
    'Data sizes as a row of boxes, KB, MB, GB, TB, each 1,024 times the one before: 2 to the 10th, 20th, 30th and 40th bytes',
    label(200, 45, 'each jump = 10 doublings', { size: 16, fill: HI }) +
      ['KB', 'MB', 'GB', 'TB'].map((u, i) => {
        const cx = 60 + i * 93;
        return rect(cx - 33, 150, 66, 50, { stroke: SKY, sw: 3, rx: 8 }) +
          label(cx, 182, u, { size: 18, fill: INK }) +
          label(cx, 228, `2${['¹⁰', '²⁰', '³⁰', '⁴⁰'][i]} bytes`, { size: 13, fill: DIM }) +
          (i < 3 ? hop(cx + 10, cx + 83, 146, 110, OK) + label(cx + 46, 100, '× 1,024', { size: 12, fill: OK }) : '');
      }).join('') +
      label(200, 286, '1,024 ≈ 1,000', { size: 16, fill: OK }),
  ),
  draw(
    'A table of nine rows, each doubling the last: 1, 2, 4, 8, 16, 32, 64, 128, 256, with a bar for each value that grows faster and faster',
    label(200, 24, 'each row doubles the last', { size: 14, fill: HI }) +
      Array.from({ length: 9 }, (_, i) => {
        const v = 2 ** i;
        const y = 52 + i * 28;
        return label(30, y + 5, String(i + 1), { size: 12, fill: DIM }) +
          label(92, y + 5, String(v), { size: 14, fill: i === 8 ? HI : INK, anchor: 'end' }) +
          rect(104, y - 9, Math.max(2, (v / 256) * 260), 18, { fill: i === 8 ? HI : SKY, rx: 3 });
      }).join('') +
      label(200, 306, 'row 9 is 256 × row 1', { size: 14, fill: OK }),
  ),
];

// ── 6.G-1 · The Egyptian 3-4-5 triangle ────────────────────────────────────

/** Grid lines across the quadrilateral a-b-c-d (a→b and d→c are opposite sides), n cells each way. */
function gridIn(a: [number, number], b: [number, number], c: [number, number], d: [number, number], n: number, stroke = DIM): string {
  const lerp = (p: [number, number], q: [number, number], t: number): [number, number] => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  let out = '';
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const [x1, y1] = lerp(a, b, t), [x2, y2] = lerp(d, c, t);
    const [x3, y3] = lerp(a, d, t), [x4, y4] = lerp(b, c, t);
    out += line(+x1.toFixed(1), +y1.toFixed(1), +x2.toFixed(1), +y2.toFixed(1), stroke, 1) + line(+x3.toFixed(1), +y3.toFixed(1), +x4.toFixed(1), +y4.toFixed(1), stroke, 1);
  }
  return out + poly([a, b, c, d], { stroke, sw: 2.5 });
}

// The 2-4-5 triangle: side 4 along the base, side 2 at 108.2° to it.
const T245A: [number, number] = [100, 240];
const T245B: [number, number] = [280, 240];
const T245C: [number, number] = [100 + 90 * Math.cos((108.21 * Math.PI) / 180), 240 - 90 * Math.sin((108.21 * Math.PI) / 180)];

const EGYPT: MathFigure[] = [
  draw(
    'The square base of a pyramid seen from above, diagonals to the apex, with a right angle marked at each of the four corners',
    rect(120, 80, 160, 160, { stroke: HI, sw: 3, fill: '#fbbf2410' }) +
      line(120, 80, 280, 240, DIM, 1.5) + line(280, 80, 120, 240, DIM, 1.5) +
      rightAngle(120, 80, 1, 1, 16, OK) + rightAngle(280, 80, -1, 1, 16, OK) +
      rightAngle(120, 240, 1, -1, 16, OK) + rightAngle(280, 240, -1, -1, 16, OK) +
      label(100, 72, '90°', { size: 13, fill: OK }) + label(300, 72, '90°', { size: 13, fill: OK }) +
      label(100, 262, '90°', { size: 13, fill: OK }) + label(300, 262, '90°', { size: 13, fill: OK }) +
      label(200, 34, 'Great Pyramid base, from above', { size: 14, fill: INK }) +
      label(200, 300, 'tools: just rope and rocks', { size: 13, fill: DIM }),
  ),
  draw(
    'A loop of rope with 12 evenly spaced knots pulled into a triangle with sides of 3, 4 and 5 knot-lengths, with the right angle marked',
    (() => {
      const A: [number, number] = [90, 260], B: [number, number] = [290, 260], C: [number, number] = [90, 110];
      const knots: [number, number][] = [];
      for (let i = 0; i < 4; i++) knots.push([90 + i * 50, 260]);
      for (let i = 0; i < 5; i++) knots.push([290 - i * 40, 260 - i * 30]);
      for (let i = 0; i < 3; i++) knots.push([90, 110 + i * 50]);
      return poly([A, B, C], { stroke: HI, sw: 4 }) + rightAngle(90, 260, 1, -1, 16, OK) +
        knots.map(([x, y]) => dot(x, y, 6, INK)).join('');
    })() +
      label(190, 290, '4', { size: 20, fill: HI }) +
      label(64, 192, '3', { size: 20, fill: HI }) +
      label(203, 172, '5', { size: 20, fill: HI }) +
      label(200, 44, '12 knots: 3 + 4 + 5', { size: 16, fill: INK }),
  ),
  draw(
    'A 3-4-5 right triangle with a square built on each side: 3 by 3 is 9 small squares, 4 by 4 is 16, and the square on the long side is 25',
    gridIn([84, 134], [150, 134], [150, 200], [84, 200], 3, SKY) +
      gridIn([150, 200], [238, 200], [238, 288], [150, 288], 4, OK) +
      gridIn([150, 134], [238, 200], [304, 112], [216, 46], 5, HI) +
      poly([[150, 200], [238, 200], [150, 134]], { stroke: INK, sw: 3 }) +
      rightAngle(150, 200, 1, -1, 12, INK) +
      label(117, 172, '9', { size: 18, fill: SKY }) +
      label(194, 251, '16', { size: 18, fill: OK }) +
      label(227, 129, '25', { size: 18, fill: HI }) +
      label(320, 236, '9 + 16 = 25', { size: 15, fill: INK }) +
      label(320, 266, '3² + 4² = 5²', { size: 15, fill: OK }) +
      label(64, 40, '90°', { size: 14, fill: INK }) +
      label(64, 60, 'opposite 5', { size: 12, fill: DIM }),
  ),
  draw(
    'Two boards meeting at a corner seen from above, with marks at 3 feet and 4 feet and a tape stretched 5 feet between them to prove the corner square',
    rect(72, 40, 18, 228, { fill: '#a5b4fc44', stroke: DIM, sw: 2 }) +
      rect(90, 250, 270, 18, { fill: '#a5b4fc44', stroke: DIM, sw: 2 }) +
      line(330, 244, 330, 256, HI, 3) + line(84, 70, 96, 70, HI, 3) +
      line(90, 70, 330, 250, HI, 3, '8 6') +
      rightAngle(90, 250, 1, -1, 16, OK) +
      label(210, 292, '4 ft', { size: 15, fill: INK }) +
      label(48, 164, '3 ft', { size: 15, fill: INK }) +
      label(232, 140, '5 ft', { size: 17, fill: HI }) +
      label(240, 40, 'builder’s check: 3, 4, 5', { size: 15, fill: INK }),
  ),
  draw(
    'Three nested right triangles sharing one corner: 3-4-5, 6-8-10 and 9-12-15, all the same shape',
    poly([[60, 280], [300, 280], [60, 100]], { stroke: HI, sw: 3, fill: '#fbbf2412' }) +
      poly([[60, 280], [220, 280], [60, 160]], { stroke: OK, sw: 3 }) +
      poly([[60, 280], [140, 280], [60, 220]], { stroke: SKY, sw: 3 }) +
      rightAngle(60, 280, 1, -1, 14, INK) +
      label(114, 233, '3-4-5', { size: 12, fill: SKY }) +
      label(156, 203, '6-8-10', { size: 12, fill: OK }) +
      label(198, 172, '9-12-15', { size: 12, fill: HI }) +
      label(282, 60, '30-40-50: a whole site', { size: 13, fill: INK }) +
      label(282, 86, 'same × on all sides: still 90°', { size: 12, fill: OK }) +
      label(140, 302, '4', { size: 12, fill: DIM }) + label(220, 302, '8', { size: 12, fill: DIM }) + label(300, 302, '12', { size: 12, fill: DIM }) +
      label(44, 224, '3', { size: 12, fill: DIM }) + label(44, 164, '6', { size: 12, fill: DIM }) + label(44, 104, '9', { size: 12, fill: DIM }),
  ),
  draw(
    'Testing two corners: on the left, marks at 3 and 4 have a diagonal of exactly 5, so the corner is square; on the right the corner is too wide and the diagonal is about 5.4',
    label(200, 36, 'mark 3 and 4, measure across', { size: 15, fill: INK }) +
      poly([[50, 135], [50, 240], [190, 240]], { open: true, stroke: INK, sw: 4 }) +
      line(50, 135, 190, 240, OK, 3, '7 5') +
      rightAngle(50, 240, 1, -1, 14, OK) +
      label(36, 194, '3', { size: 15 }) + label(120, 264, '4', { size: 15 }) + label(132, 176, '5', { size: 17, fill: OK }) +
      poly([[211.8, 136.6], [230, 240], [370, 240]], { open: true, stroke: INK, sw: 4 }) +
      line(211.8, 136.6, 370, 240, NO, 3, '7 5') +
      arc(230, 240, 24, 0, 100, NO, 2.5) +
      label(206, 194, '3', { size: 15, anchor: 'end' }) + label(300, 264, '4', { size: 15 }) + label(304, 176, '5.4', { size: 17, fill: NO }) +
      label(120, 296, '5: square', { size: 14, fill: OK }) +
      label(300, 296, 'not 5: not square', { size: 14, fill: NO }),
  ),
  draw(
    'A triangle with sides 2, 4 and 5: the angle opposite the 5 is about 108 degrees, not 90, because 4 plus 16 is 20, not 25',
    poly([T245A, T245B, T245C], { stroke: NO, sw: 3.5 }) +
      arc(T245A[0], T245A[1], 22, 0, 108.2, NO, 2.5) +
      label(190, 264, '4', { size: 16 }) +
      label(72, 204, '2', { size: 16, anchor: 'end' }) +
      label(190, 180, '5', { size: 16 }) +
      label(130, 216, '108°', { size: 13, fill: NO }) +
      label(200, 50, '2² + 4² = 4 + 16 = 20', { size: 16, fill: INK }) +
      label(200, 82, '20 ≠ 25 = 5²', { size: 16, fill: NO }) +
      label(200, 296, 'no right angle', { size: 15, fill: NO }),
  ),
  draw(
    'Two brick walls on a floor: the left meets the floor at 90 degrees and stands straight; the right leans, meeting the floor at 78 degrees',
    (() => {
      const bricks = (ox: number) =>
        Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: r % 2 ? 3 : 2 }, (_, k) => {
            const w = 40;
            const x = r % 2 ? [0, 20, 60][k] : k * 40;
            const ww = r % 2 ? (k === 1 ? 40 : 20) : w;
            return rect(ox + x, -(r + 1) * 20, ww, 20, { fill: '#f472b633', stroke: INK, sw: 1.5 });
          }).join(''),
        ).join('');
      return (
        line(25, 250, 375, 250, DIM, 3) +
        `<g transform="translate(70,250)">${bricks(0)}</g>` +
        `<g transform="translate(220,250) skewX(-12)">${bricks(0)}</g>` +
        rightAngle(150, 250, 1, -1, 16, OK) +
        arc(300, 250, 26, 0, 78, NO, 2.5)
      );
    })() +
      label(188, 228, '90°', { size: 13, fill: OK }) +
      label(346, 230, '78°', { size: 13, fill: NO }) +
      label(110, 282, 'stands straight', { size: 13, fill: OK }) +
      label(280, 282, 'leans', { size: 13, fill: NO }) +
      label(200, 40, 'square corners keep walls upright', { size: 14, fill: INK }),
  ),
  tex(['3^2 + 4^2 = 9 + 16 = 25 = 5^2', '(3k)^2 + (4k)^2 = (5k)^2', '\\Rightarrow\\ \\text{a } 90^\\circ \\text{ corner, every time}'], 'Ancient tech, still works'),
];

// ── 6.G-3 · Archimedes & the golden crown ─────────────────────────────────

const ARCH: MathFigure[] = [
  draw(
    'A balance with a lump of gold on one side and a crown on the other, perfectly level',
    balance(230) +
      line(90, 230, 90, 222, INK, 3) + line(310, 230, 310, 222, INK, 3) +
      line(50, 222, 130, 222, INK, 4) + line(270, 222, 350, 222, INK, 4) +
      rect(66, 178, 48, 42, { fill: HI, rx: 10 }) +
      crown(276, 220, 68, 50) +
      label(90, 160, 'gold lump', { size: 13, fill: HI }) +
      label(310, 156, 'crown', { size: 13, fill: HI }) +
      label(200, 44, 'same weight… same gold?', { size: 16, fill: INK }) +
      label(200, 100, 'or was silver mixed in?', { size: 14, fill: NO }),
  ),
  draw(
    'Two cubes of equal weight: a small gold cube and a noticeably bigger silver cube',
    (() => {
      const cube = (x: number, s: number, fill: string) => {
        const d = s * 0.25;
        const top = 240 - s;
        return rect(x, top, s, s, { fill, stroke: DARK, sw: 1.5 }) +
          poly([[x, top], [x + d, top - d], [x + s + d, top - d], [x + s, top]], { fill, stroke: DARK, sw: 1.5, opacity: 0.8 }) +
          poly([[x + s, top], [x + s + d, top - d], [x + s + d, 240 - d], [x + s, 240]], { fill, stroke: DARK, sw: 1.5, opacity: 0.6 });
      };
      return line(30, 240, 370, 240, DIM, 3) + cube(75, 60, HI) + cube(225, 74, SILVER);
    })() +
      label(110, 268, 'gold', { size: 15, fill: HI }) +
      label(270, 268, 'silver', { size: 15, fill: SILVER }) +
      label(200, 50, 'equal weight, unequal volume', { size: 15, fill: INK }) +
      label(200, 300, 'silver needs MORE space', { size: 14, fill: OK }),
  ),
  draw(
    'A tub filled to the brim; an object sinks in and the water that spills into a tray has exactly the object’s volume',
    cup(90, 110, 140, 150) +
      rect(93, 112, 134, 145, { fill: SKY, opacity: 0.45 }) +
      rect(130, 170, 60, 60, { fill: HI, rx: 4 }) +
      `<path d="M 232 112 Q 262 110 266 150 L 268 200" fill="none" stroke="${SKY}" stroke-width="4"/>` +
      cup(260, 200, 100, 50) +
      rect(265, 208, 90, 40, { fill: SKY, opacity: 0.7 }) +
      label(160, 205, 'object', { size: 12, fill: DARK }) +
      label(310, 186, 'spill', { size: 13, fill: SKY }) +
      label(200, 44, 'in goes the object…', { size: 15, fill: INK }) +
      label(200, 72, '…out spills its own volume', { size: 15, fill: HI }) +
      label(160, 288, 'tub full to the brim', { size: 13, fill: DIM }) +
      label(310, 288, 'spill = volume', { size: 13, fill: OK }),
  ),
  draw(
    'Two full tubs: dunking a lump of pure gold spills a little water, dunking the crown of the same weight spills more',
    cup(40, 120, 120, 100) + rect(43, 122, 114, 95, { fill: SKY, opacity: 0.45 }) +
      rect(80, 180, 40, 30, { fill: HI, rx: 6 }) +
      cup(240, 120, 120, 100) + rect(243, 122, 114, 95, { fill: SKY, opacity: 0.45 }) +
      crown(266, 212, 68, 52) +
      line(160, 122, 160, 240, SKY, 2, '4 4') + line(360, 122, 360, 240, SKY, 2, '4 4') +
      cup(60, 240, 80, 40) + rect(63, 266, 74, 12, { fill: SKY, opacity: 0.8 }) +
      cup(260, 240, 80, 40) + rect(263, 254, 74, 24, { fill: SKY, opacity: 0.8 }) +
      label(100, 104, 'pure gold', { size: 13, fill: HI }) +
      label(300, 104, 'the crown', { size: 13, fill: HI }) +
      label(200, 42, 'same weight, bigger spill', { size: 15, fill: INK }) +
      label(200, 306, 'more volume → silver inside', { size: 14, fill: NO }),
  ),
  draw(
    'Two measuring cylinders: 1,000 grams of gold fills about 52 mL, 1,000 grams of silver fills about 95 mL',
    [0, 20, 40, 60, 80, 100].map((v) => line(96, 260 - v * 2, 104, 260 - v * 2, DIM, 2) + label(90, 264 - v * 2, String(v), { size: 11, fill: DIM, anchor: 'end' })).join('') +
      [0, 20, 40, 60, 80, 100].map((v) => line(236, 260 - v * 2, 244, 260 - v * 2, DIM, 2)).join('') +
      rect(103, 260 - 52 * 2, 54, 52 * 2, { fill: HI, opacity: 0.75 }) +
      rect(243, 260 - 95 * 2, 54, 95 * 2, { fill: SILVER, opacity: 0.75 }) +
      cup(100, 50, 60, 210) + cup(240, 50, 60, 210) +
      label(168, 161, '52 mL', { size: 14, fill: HI, anchor: 'start' }) +
      label(308, 75, '95 mL', { size: 14, fill: SILVER, anchor: 'start' }) +
      label(130, 286, '1,000 g gold', { size: 13, fill: HI }) +
      label(270, 286, '1,000 g silver', { size: 13, fill: SILVER }) +
      label(200, 26, 'same weight, nearly double the space', { size: 14, fill: INK }),
    'The water each one pushes aside',
  ),
  draw(
    'A measuring cup at 200 mL before, and at 260 mL after a rock is dropped in; the 60 mL rise is the rock’s volume',
    cup(70, 80, 80, 180) + rect(73, 140, 74, 117, { fill: SKY, opacity: 0.5 }) +
      cup(250, 80, 80, 180) + rect(253, 104, 74, 153, { fill: SKY, opacity: 0.5 }) +
      poly([[268, 252], [262, 226], [280, 206], [306, 212], [314, 236], [300, 254]], { fill: DIM, stroke: INK, sw: 2 }) +
      label(64, 145, '200 mL', { size: 12, fill: INK, anchor: 'end' }) +
      label(244, 109, '260 mL', { size: 12, fill: INK, anchor: 'end' }) +
      arrow(160, 190, 235, 190, HI) + label(197, 178, 'drop in', { size: 12, fill: HI }) +
      line(342, 104, 342, 140, HI, 3) + line(336, 104, 348, 104, HI, 2) + line(336, 140, 348, 140, HI, 2) +
      line(250, 140, 330, 140, DIM, 1.5, '4 4') +
      label(348, 127, '60 mL', { size: 13, fill: HI, anchor: 'start' }) +
      label(110, 284, 'before', { size: 13, fill: DIM }) + label(290, 284, 'after', { size: 13, fill: DIM }) +
      label(200, 40, '260 − 200 = 60 mL', { size: 16, fill: HI }) +
      label(200, 310, 'the rise IS the volume', { size: 14, fill: OK }),
  ),
  draw(
    'A level balance: a huge box of 1 kg of feathers on one side and a tiny 1 kg cube of gold on the other',
    balance(240) +
      rect(45, 112, 90, 126, { fill: '#a5b4fc22', stroke: INK, sw: 2.5, rx: 4 }) +
      [0, 1, 2, 3, 4].map((i) => `<path d="M ${60 + (i % 2) * 20} ${130 + i * 22} q 25 -14 50 0" fill="none" stroke="${INK}" stroke-width="2"/>`).join('') +
      rect(309, 216, 22, 22, { fill: HI, rx: 2 }) +
      label(90, 96, '1 kg feathers', { size: 13, fill: INK }) +
      label(320, 200, '1 kg gold', { size: 13, fill: HI }) +
      label(200, 40, 'same weight, different volume', { size: 15, fill: INK }) +
      label(200, 70, 'weight ≠ volume', { size: 15, fill: NO }),
  ),
  draw(
    'Bar chart of density in grams per millilitre: gold about 19, silver 10.5, water 1',
    line(40, 260, 360, 260, DIM, 3) +
      ([
        ['gold', 19, '19 g/mL', HI],
        ['silver', 10.5, '10.5 g/mL', SILVER],
        ['water', 1, '1 g/mL', SKY],
      ] as const).map(([n, v, t, c], i) => {
        const x = 100 + i * 100;
        return rect(x - 30, 260 - v * 9, 60, v * 9, { fill: c, rx: 3 }) +
          label(x, 252 - v * 9, t, { size: 13, fill: c }) +
          label(x, 284, n, { size: 14, fill: INK });
      }).join('') +
      label(200, 36, 'density = weight ÷ volume', { size: 15, fill: HI }),
  ),
  tex(
    [
      '\\text{volume} = \\text{level after} - \\text{level before}',
      '\\text{gold: } \\dfrac{1000 \\text{ g}}{52 \\text{ mL}} \\approx 19 \\text{ g/mL}',
      '\\text{silver: } \\dfrac{1000 \\text{ g}}{95 \\text{ mL}} \\approx 10.5 \\text{ g/mL}',
    ],
    'Water measures the space anything takes up',
  ),
];

export const STORY_FIGURES_G2: Record<string, MathFigure[]> = {
  '6.EE-1-story.mp4': PENNY,
  '6.EE-6-story.mp4': FIB,
  '6.EE-9-story.mp4': HANDS,
  '6.EE-10-story.mp4': CHESS,
  '6.G-1-story.mp4': EGYPT,
  '6.G-3-story.mp4': ARCH,
};
