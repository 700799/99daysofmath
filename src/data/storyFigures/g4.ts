// Drawn figures for the illustrated Math Stories, group 4. Keyed by story id
// (the old video file name). Each array holds one figure per beat, in order,
// then one more for the closing "What you learned" slide.
import type { MathFigure } from '../mathFigure';
import { tex, draw, label, line, arrow, rightAngle, INK, DIM, HI, OK, NO, SKY } from '../mathFigure';

const DARK = '#1e1b4b';

/** A horizontal timeline from `a` to `b`; each mark's label sits at its own height `y`. */
function timeline(a: number, b: number, marks: { at: number; text: string; y: number; hi?: boolean; sub?: string }[]): string {
  const x = (n: number) => 40 + ((n - a) / (b - a)) * 320;
  let out = line(30, 170, 370, 170, DIM, 3);
  for (const m of marks) {
    const px = Number(x(m.at).toFixed(1));
    const up = m.y < 170;
    out += line(px, 170, px, up ? m.y + 8 : m.y - 18, m.hi ? HI : DIM, 2);
    out += `<circle cx="${px}" cy="170" r="${m.hi ? 9 : 6}" fill="${m.hi ? HI : INK}"/>`;
    out += label(px, m.y, m.text, { size: 13, fill: m.hi ? HI : INK });
    if (m.sub) out += label(px, up ? m.y - 18 : m.y + 18, m.sub, { size: 12, fill: DIM });
  }
  return out;
}

/** A coordinate grid with origin at screen (ox, oy); returns the drawing and the coordinate maps. */
function plane(o: { ox: number; oy: number; sx: number; sy: number; x0?: number; x1: number; y0?: number; y1: number; nums?: boolean; names?: boolean }) {
  const x0 = o.x0 ?? 0, y0 = o.y0 ?? 0;
  const X = (v: number) => Number((o.ox + v * o.sx).toFixed(1));
  const Y = (v: number) => Number((o.oy - v * o.sy).toFixed(1));
  let svg = '';
  for (let i = x0; i <= o.x1; i++) svg += `<line x1="${X(i)}" y1="${Y(y0)}" x2="${X(i)}" y2="${Y(o.y1)}" stroke="${DIM}" stroke-width="1" stroke-opacity="0.3"/>`;
  for (let j = y0; j <= o.y1; j++) svg += `<line x1="${X(x0)}" y1="${Y(j)}" x2="${X(o.x1)}" y2="${Y(j)}" stroke="${DIM}" stroke-width="1" stroke-opacity="0.3"/>`;
  svg += arrow(X(x0), Y(0), X(o.x1) + 16, Y(0), INK, 2.5) + arrow(X(0), Y(y0), X(0), Y(o.y1) - 16, INK, 2.5);
  if (o.nums !== false) {
    for (let i = x0; i <= o.x1; i++) if (i !== 0) svg += label(X(i), Y(0) + 18, String(i).replace('-', '−'), { size: 11, fill: DIM });
    for (let j = y0; j <= o.y1; j++) if (j !== 0) svg += label(X(0) - 8, Y(j) + 4, String(j).replace('-', '−'), { size: 11, fill: DIM, anchor: 'end' });
    svg += label(X(0) - 8, Y(0) + 16, '0', { size: 11, fill: DIM, anchor: 'end' });
  }
  if (o.names !== false) svg += label(X(o.x1) + 22, Y(0) + 5, 'x', { size: 15, fill: DIM, anchor: 'start' }) + label(X(0), Y(o.y1) - 22, 'y', { size: 15, fill: DIM });
  return { svg, X, Y };
}

/** An oblique cube whose front face has its bottom-left corner at (x, y) and side s. */
function cube(x: number, y: number, s: number, fill: string): string {
  const d = s * 0.35;
  const f = `${x},${y} ${x + s},${y} ${x + s},${y - s} ${x},${y - s}`;
  const t = `${x},${y - s} ${x + s},${y - s} ${x + s + d},${y - s - d} ${x + d},${y - s - d}`;
  const r = `${x + s},${y} ${x + s + d},${y - d} ${x + s + d},${y - s - d} ${x + s},${y - s}`;
  return (
    `<polygon points="${t}" fill="${fill}" fill-opacity="0.55" stroke="${fill}" stroke-width="2"/>` +
    `<polygon points="${r}" fill="${fill}" fill-opacity="0.3" stroke="${fill}" stroke-width="2"/>` +
    `<polygon points="${f}" fill="${fill}" fill-opacity="0.4" stroke="${fill}" stroke-width="2"/>`
  );
}

/** A small fly seen from above, centred at (x, y). */
function fly(x: number, y: number, c = INK): string {
  return (
    `<ellipse cx="${x - 7}" cy="${y - 6}" rx="8" ry="5" fill="${SKY}" fill-opacity="0.45" transform="rotate(-30 ${x - 7} ${y - 6})"/>` +
    `<ellipse cx="${x + 7}" cy="${y - 6}" rx="8" ry="5" fill="${SKY}" fill-opacity="0.45" transform="rotate(30 ${x + 7} ${y - 6})"/>` +
    `<ellipse cx="${x}" cy="${y + 1}" rx="4" ry="7" fill="${c}"/>` +
    `<circle cx="${x}" cy="${y - 8}" r="3.5" fill="${c}"/>`
  );
}

/** A dot with a coordinate label. */
function pt(x: number, y: number, c: string, r = 6): string {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
}

/** A rounded box. */
function box(x: number, y: number, w: number, h: number, c: string, fillOpacity = 0.15): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c}" fill-opacity="${fillOpacity}" stroke="${c}" stroke-width="2.5"/>`;
}

/** A horizontal integer number line from `a` to `b`, between screen x 40 and 360 at height y. */
function numberLine(a: number, b: number, y: number, hiZero = true): { svg: string; X: (v: number) => number } {
  const X = (v: number) => Number((40 + ((v - a) / (b - a)) * 320).toFixed(1));
  let svg = arrow(X(0), y, 22, y, INK, 3) + arrow(X(0), y, 378, y, INK, 3);
  for (let v = a; v <= b; v++) {
    const z = v === 0 && hiZero;
    svg += line(X(v), y - (z ? 12 : 8), X(v), y + (z ? 12 : 8), z ? HI : INK, z ? 4 : 2.5);
    svg += label(X(v), y + 30, String(v).replace('-', '−'), { size: z ? 16 : 13, fill: z ? HI : v < 0 ? NO : v > 0 ? OK : INK });
  }
  return { svg, X };
}

// ── 6.NS-3 · Ramanujan's taxi number ─────────────────────────────────────

const RAMANUJAN: MathFigure[] = [
  draw(
    'A timeline of Ramanujan’s life: born in India in 1887, writes to Hardy in 1913, ill in a London hospital in 1918',
    label(200, 42, 'Srinivasa Ramanujan', { size: 17, fill: HI }) +
      timeline(1880, 1925, [
        { at: 1887, text: '1887 born, India', y: 118 },
        { at: 1913, text: '1913 writes to Hardy', y: 238 },
        { at: 1918, text: '1918 hospital, London', y: 118, hi: true },
      ]) +
      label(200, 300, 'self-taught, then Cambridge', { size: 13, fill: DIM }),
  ),
  draw(
    'A factor tree splitting 1729 into 7 times 247, and 247 into 13 times 19',
    label(200, 30, 'taxi 1729: a dull number?', { size: 14, fill: DIM }) +
      label(200, 78, '1729', { size: 26, fill: HI }) +
      line(185, 86, 135, 132, DIM, 2.5) + line(215, 86, 265, 132, DIM, 2.5) +
      label(125, 160, '7', { size: 22 }) + label(275, 160, '247', { size: 22 }) +
      line(262, 168, 225, 208, DIM, 2.5) + line(290, 168, 325, 208, DIM, 2.5) +
      label(215, 236, '13', { size: 22 }) + label(335, 236, '19', { size: 22 }) +
      `<circle cx="125" cy="152" r="20" fill="none" stroke="${OK}" stroke-width="2.5"/>` +
      `<circle cx="215" cy="228" r="20" fill="none" stroke="${OK}" stroke-width="2.5"/>` +
      `<circle cx="335" cy="228" r="20" fill="none" stroke="${OK}" stroke-width="2.5"/>` +
      label(200, 294, '1729 = 7 × 13 × 19', { size: 16, fill: OK }),
  ),
  draw(
    'Cubes drawn to scale: a 1-cube and a 12-cube make 1729, and a 9-cube and a 10-cube also make 1729',
    cube(40, 135, 7, SKY) + label(44, 158, '1³', { size: 14 }) +
      label(78, 105, '+', { size: 22 }) +
      cube(100, 135, 84, HI) + label(142, 100, '12³', { size: 20 }) +
      label(310, 105, '= 1729', { size: 22, fill: HI }) +
      cube(30, 285, 63, SKY) + label(61, 260, '9³', { size: 20 }) +
      label(125, 255, '+', { size: 22 }) +
      cube(145, 285, 70, OK) + label(180, 257, '10³', { size: 20 }) +
      label(310, 255, '= 1729', { size: 22, fill: OK }),
  ),
  draw(
    'Two bars of equal height 1,729: one made of 1 plus 1,728, the other of 729 plus 1,000',
    line(176, 50, 380, 50, HI, 2, '6 5') +
      label(380, 40, '1,729', { size: 15, fill: HI, anchor: 'end' }) +
      `<rect x="90" y="54" width="80" height="216" fill="${SKY}" fill-opacity="0.55" stroke="${SKY}" stroke-width="2"/>` +
      `<rect x="90" y="50" width="80" height="4" fill="${HI}"/>` +
      label(76, 58, '1', { size: 15, fill: HI, anchor: 'end' }) +
      label(130, 166, '1,728', { size: 16 }) +
      `<rect x="230" y="50" width="80" height="94" fill="${OK}" fill-opacity="0.55" stroke="${OK}" stroke-width="2"/>` +
      `<rect x="230" y="144" width="80" height="126" fill="${SKY}" fill-opacity="0.55" stroke="${SKY}" stroke-width="2"/>` +
      label(270, 102, '729', { size: 16 }) + label(270, 212, '1,000', { size: 16 }) +
      line(60, 270, 360, 270, DIM, 3) +
      label(130, 295, '1 + 1,728', { size: 14 }) + label(270, 295, '729 + 1,000', { size: 14 }),
  ),
  tex(
    ['12^3 = 12 \\times 12 \\times 12', '= 144 \\times 12 = 1728', '9^3 = 729 \\qquad 10^3 = 1000', '1 + 1728 = 729 + 1000 = 1729'],
    'Two different cube pairs, one shared sum',
  ),
  draw(
    'A table of the cubes of 1 to 12; 1 and 1728 are highlighted as one pair, 729 and 1000 as another, both summing to 1729',
    label(200, 34, 'n on top, n³ below', { size: 14, fill: DIM }) +
      Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const x = 26 + (i % 6) * 60, y = i < 6 ? 52 : 142;
        const c = n === 1 || n === 12 ? HI : n === 9 || n === 10 ? OK : DIM;
        return box(x, y, 54, 72, c, c === DIM ? 0.06 : 0.2) +
          label(x + 27, y + 24, String(n), { size: 14, fill: c === DIM ? DIM : c }) +
          label(x + 27, y + 54, String(n ** 3), { size: 15 });
      }).join('') +
      label(200, 258, '1 + 1728 = 1729', { size: 16, fill: HI }) +
      label(200, 290, '729 + 1000 = 1729', { size: 16, fill: OK }),
  ),
  draw(
    'Comparison: 12 cubed is a 12 by 12 by 12 cube of 1,728, while 12 times 3 is only three rows of 12, which is 36',
    label(105, 50, '12³', { size: 22, fill: OK }) +
      cube(30, 230, 110, OK) +
      label(105, 262, '12 × 12 × 12', { size: 14 }) + label(105, 290, '= 1,728', { size: 16, fill: OK }) +
      label(200, 180, '≠', { size: 30, fill: DIM }) +
      label(300, 50, '12 × 3', { size: 22, fill: NO }) +
      [0, 1, 2].map((r) => Array.from({ length: 12 }, (_, c) => `<rect x="${246 + c * 9}" y="${150 + r * 10}" width="7" height="7" fill="${NO}"/>`).join('')).join('') +
      label(300, 262, '3 rows of 12', { size: 14 }) + label(300, 290, '= 36', { size: 16, fill: NO }),
  ),
  draw(
    'Bars showing how many digits the smallest number written as a sum of two cubes in 1, 2, 3 and 4 ways has: 2, 1,729, 87,539,319 and 6,963,472,309,248',
    label(200, 40, 'smallest sum of two cubes in…', { size: 14, fill: DIM }) +
      [
        ['1 way', '2', 1],
        ['2 ways', '1,729', 4],
        ['3 ways', '87,539,319', 8],
        ['4 ways', '6,963,472,309,248', 13],
      ].map(([w, v, d], i) => {
        const y = 80 + i * 55;
        const c = i === 1 ? HI : SKY;
        return label(20, y + 14, String(w), { size: 13, fill: i === 1 ? HI : INK, anchor: 'start' }) +
          `<rect x="86" y="${y}" width="${Number(d) * 10}" height="20" rx="3" fill="${c}"/>` +
          label(94 + Number(d) * 10, y + 15, String(v), { size: 13, fill: i === 1 ? HI : INK, anchor: 'start' });
      }).join('') +
      label(200, 302, 'bar length = number of digits', { size: 12, fill: DIM }),
  ),
  draw(
    'The number 1729 in a circle with five hidden facts around it: 1 cubed plus 12 cubed, 9 cubed plus 10 cubed, 7 times 13 times 19, 19 times 91, and digits summing to 19',
    `<circle cx="200" cy="160" r="44" fill="${HI}" fill-opacity="0.18" stroke="${HI}" stroke-width="3"/>` +
      label(200, 168, '1729', { size: 22, fill: HI }) +
      line(166, 132, 120, 82, DIM, 2) + line(234, 132, 280, 82, DIM, 2) +
      line(156, 160, 132, 160, DIM, 2) + line(244, 160, 268, 160, DIM, 2) + line(200, 204, 200, 262, DIM, 2) +
      label(95, 70, '1³ + 12³', { size: 15, fill: OK }) + label(305, 70, '9³ + 10³', { size: 15, fill: OK }) +
      label(76, 165, '7 × 13 × 19', { size: 14 }) + label(318, 165, '19 × 91', { size: 14 }) +
      label(200, 286, 'digits: 1+7+2+9 = 19', { size: 14, fill: SKY }),
  ),
];

// ── 6.NS-4 · The invention of zero ───────────────────────────────────────

const zeroBoard = (y: number, digits: string[], n: string): string =>
  label(40, y + 40, n, { size: 18, fill: HI }) +
  ['H', 'T', 'O'].map((h, i) => label(110 + i * 60, y - 6, h, { size: 12, fill: DIM })).join('') +
  [0, 1, 2].map((i) => `<rect x="${80 + i * 60}" y="${y}" width="60" height="56" fill="none" stroke="${DIM}" stroke-width="2"/>`).join('') +
  digits.map((d, i) => (d ? label(110 + i * 60, y + 38, d, { size: 24 }) : '')).join('') +
  arrow(250, y + 28, 288, y + 28, DIM, 2.5) +
  label(340, y + 37, '2 5', { size: 24, fill: NO });

const ZERO: MathFigure[] = [
  draw(
    'Place-value boards for 205 and 25; with no zero symbol, the empty tens column vanishes and both are written 2 5',
    label(340, 34, 'no zero:', { size: 13, fill: DIM }) +
      zeroBoard(56, ['2', '', '5'], '205') +
      zeroBoard(166, ['', '2', '5'], '25') +
      label(200, 292, '205 and 25 look the same', { size: 15, fill: NO }),
  ),
  tex(
    ['a + 0 = a', 'a - 0 = a', 'a - a = 0', 'a \\times 0 = 0'],
    'Brahmagupta, 628 AD: zero is a number, with rules',
  ),
  draw(
    'A vertical number line from 4 down to minus 4 with zero as the anchor: positive values above zero, negative values below it',
    line(150, 40, 150, 285, INK, 3) +
      [4, 3, 2, 1, 0, -1, -2, -3, -4].map((v) => {
        const y = 162 - v * 28;
        const z = v === 0;
        return line(z ? 136 : 142, y, z ? 164 : 158, y, z ? HI : INK, z ? 4 : 2.5) +
          label(128, y + 5, (v > 0 ? '+' : '') + String(v).replace('-', '−'), { size: z ? 16 : 13, fill: z ? HI : v > 0 ? OK : NO, anchor: 'end' });
      }).join('') +
      line(166, 162, 196, 162, HI, 2, '6 5') +
      label(204, 167, '0 = the anchor', { size: 14, fill: HI, anchor: 'start' }) +
      `<rect x="176" y="40" width="200" height="100" rx="8" fill="${OK}" fill-opacity="0.1"/>` +
      `<rect x="176" y="184" width="200" height="100" rx="8" fill="${NO}" fill-opacity="0.1"/>` +
      label(276, 80, 'above zero: +', { size: 15, fill: OK }) + label(276, 108, 'warm, savings', { size: 12, fill: DIM }) +
      label(276, 226, 'below zero: −', { size: 15, fill: NO }) + label(276, 254, 'cold, debts, depths', { size: 12, fill: DIM }),
  ),
  draw(
    'The number 13 in binary, 1101: four bit boxes under place values 8, 4, 2, 1, where the 0 marks an empty twos place',
    label(200, 46, 'computers count in 1s and 0s', { size: 15, fill: DIM }) +
      ['8', '4', '2', '1'].map((p, i) => label(80 + i * 80, 100, p, { size: 14, fill: DIM })).join('') +
      ['1', '1', '0', '1'].map((b, i) => box(48 + i * 80, 112, 64, 64, b === '0' ? HI : SKY, 0.15) + label(80 + i * 80, 156, b, { size: 30, fill: b === '0' ? HI : INK })).join('') +
      label(200, 226, '8 + 4 + 0 + 1 = 13', { size: 18, fill: OK }) +
      label(200, 276, 'the 0 says: no 2 here', { size: 14, fill: HI }),
  ),
  draw(
    'Base-ten blocks for 507 — five hundreds squares, an empty tens column, seven ones — next to 57, with five tens rods and seven ones',
    label(100, 30, 'hundreds', { size: 12, fill: DIM }) + label(210, 30, 'tens', { size: 12, fill: DIM }) + label(300, 30, 'ones', { size: 12, fill: DIM }) +
      [0, 1, 2, 3, 4].map((i) => `<rect x="${58 + (i % 3) * 29}" y="${46 + Math.floor(i / 3) * 29}" width="26" height="26" fill="${SKY}" fill-opacity="0.6" stroke="${SKY}" stroke-width="1.5"/>`).join('') +
      `<rect x="182" y="46" width="56" height="55" rx="6" fill="none" stroke="${HI}" stroke-width="2.5" stroke-dasharray="6 5"/>` +
      Array.from({ length: 7 }, (_, i) => `<rect x="${276 + (i % 4) * 13}" y="${60 + Math.floor(i / 4) * 13}" width="10" height="10" fill="${OK}"/>`).join('') +
      label(100, 130, '5', { size: 20 }) + label(210, 130, '0', { size: 20, fill: HI }) + label(300, 130, '7', { size: 20 }) +
      label(372, 92, '507', { size: 18, fill: HI }) +
      line(30, 150, 370, 150, DIM, 1.5, '4 6') +
      Array.from({ length: 5 }, (_, i) => `<rect x="${186 + i * 11}" y="170" width="8" height="56" fill="${SKY}" fill-opacity="0.6" stroke="${SKY}" stroke-width="1.5"/>`).join('') +
      Array.from({ length: 7 }, (_, i) => `<rect x="${276 + (i % 4) * 13}" y="${185 + Math.floor(i / 4) * 13}" width="10" height="10" fill="${OK}"/>`).join('') +
      label(210, 254, '5', { size: 20 }) + label(300, 254, '7', { size: 20 }) +
      label(372, 210, '57', { size: 18 }) +
      label(200, 298, 'the 0 shouts: no tens here!', { size: 14, fill: HI }),
  ),
  (() => {
    const { svg, X } = numberLine(-5, 5, 170);
    return draw(
      'A number line from minus 5 to 5 anchored at zero: minus 3 sits three steps left of zero and minus 1 one step left, so minus 3 is less',
      label(200, 56, '−3 < −1', { size: 24, fill: HI }) +
        svg +
        pt(X(-3), 170, NO, 8) + pt(X(-1), 170, SKY, 8) +
        arrow(X(0), 132, X(-3) + 2, 132, NO, 2.5) + label((X(0) + X(-3)) / 2, 120, '3 left of 0', { size: 13, fill: NO }) +
        arrow(X(0), 228, X(-1) + 2, 228, SKY, 2.5) + label(X(-0.5), 252, '1 left of 0', { size: 13, fill: SKY }) +
        label(200, 296, 'farther left = less', { size: 15, fill: DIM }),
    );
  })(),
  draw(
    'Three panels: 5 plus 0 is still 5, 5 times 0 wipes to 0, and 5 divided by 0 is forbidden',
    [
      ['5 + 0 = 5', 'no change', OK],
      ['5 × 0 = 0', 'wipes to 0', HI],
      ['5 ÷ 0 = ?', 'forbidden', NO],
    ].map(([e, f, c], i) => {
      const cx = 72 + i * 128;
      return box(cx - 60, 70, 120, 150, String(c), 0.08) + label(cx, 50, String(e), { size: 15, fill: String(c) }) + label(cx, 250, String(f), { size: 14, fill: String(c) });
    }).join('') +
      Array.from({ length: 5 }, (_, i) => pt(42 + i * 15, 130, OK, 5)).join('') +
      label(72, 165, '+ nothing', { size: 12, fill: DIM }) +
      Array.from({ length: 5 }, (_, i) => pt(170 + i * 15, 115, DIM, 5)).join('') +
      arrow(200, 132, 200, 165, HI, 2.5) + label(200, 198, '0', { size: 24, fill: HI }) +
      `<circle cx="328" cy="145" r="34" fill="none" stroke="${NO}" stroke-width="4"/>` + line(304, 169, 352, 121, NO, 4) +
      label(200, 296, 'zero has sharp rules', { size: 15, fill: DIM }),
  ),
  draw(
    'A timeline of zero’s journey: Brahmagupta in India in 628, al-Khwarizmi in Baghdad around 825, Fibonacci in Europe around 1200, and today’s phones',
    label(200, 36, 'how zero travelled', { size: 15, fill: DIM }) +
      timeline(560, 2080, [
        { at: 628, text: '628 India', y: 118, hi: true, sub: 'Brahmagupta' },
        { at: 825, text: 'c. 825 Baghdad', y: 234, sub: 'al-Khwarizmi' },
        { at: 1200, text: 'c. 1200 Europe', y: 118, sub: 'Fibonacci' },
        { at: 2026, text: 'today', y: 234, sub: 'your phone' },
      ]),
  ),
  (() => {
    const { svg } = numberLine(-5, 5, 170);
    return draw(
      'The number line with zero as its anchor: positive numbers shaded to the right, negative numbers shaded to the left',
      `<rect x="20" y="120" width="174" height="100" rx="10" fill="${NO}" fill-opacity="0.12"/>` +
        `<rect x="206" y="120" width="174" height="100" rx="10" fill="${OK}" fill-opacity="0.12"/>` +
        svg +
        `<circle cx="200" cy="170" r="10" fill="${HI}"/>` +
        label(200, 70, 'zero is the anchor', { size: 18, fill: HI }) +
        arrow(160, 140, 60, 140, NO, 3) + label(110, 270, 'negatives: left', { size: 14, fill: NO }) +
        arrow(240, 140, 340, 140, OK, 3) + label(290, 270, 'positives: right', { size: 14, fill: OK }),
    );
  })(),
];

// ── 6.NS-5 · Katherine Johnson & Apollo ──────────────────────────────────

const JOHNSON: MathFigure[] = [
  draw(
    'A timeline of Katherine Johnson’s life: born 1918, hired at NASA’s forerunner in 1953, John Glenn’s flight 1962, Apollo 11 in 1969, Medal of Freedom at 97 in 2015',
    label(200, 40, 'Katherine Johnson', { size: 17, fill: HI }) +
      timeline(1910, 2025, [
        { at: 1918, text: '1918 born', y: 118 },
        { at: 1953, text: '1953 hired', y: 234 },
        { at: 1962, text: '1962 Glenn', y: 118 },
        { at: 1969, text: '1969 Apollo 11', y: 280, hi: true },
        { at: 2015, text: '2015 Medal, 97', y: 118 },
      ]) +
      label(200, 66, 'a human computer: math by hand', { size: 13, fill: DIM }),
  ),
  (() => {
    const p = plane({ ox: 50, oy: 270, sx: 30, sy: 30, x1: 9, y1: 7 });
    return draw(
      'A coordinate plane with Earth at (1, 1), a spacecraft at (4, 3) and the Moon at (8, 6)',
      p.svg +
        `<circle cx="${p.X(1)}" cy="${p.Y(1)}" r="14" fill="${SKY}"/>` + label(p.X(1) + 22, p.Y(1) - 12, 'Earth (1, 1)', { size: 13, anchor: 'start' }) +
        `<circle cx="${p.X(8)}" cy="${p.Y(6)}" r="10" fill="${INK}"/>` + label(p.X(8), p.Y(6) - 18, 'Moon (8, 6)', { size: 13 }) +
        `<polygon points="${p.X(4) - 8},${p.Y(3) + 7} ${p.X(4) + 9},${p.Y(3) - 8} ${p.X(4) + 2},${p.Y(3) + 9}" fill="${HI}"/>` +
        label(p.X(4) + 14, p.Y(3) - 12, 'ship (4, 3)', { size: 13, fill: HI, anchor: 'start' }),
    );
  })(),
  (() => {
    const pts = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t) => {
      const u = 1 - t;
      const x = u ** 3 * 80 + 3 * u * u * t * 120 + 3 * u * t * t * 320 + t ** 3 * 330;
      const y = u ** 3 * 230 + 3 * u * u * t * 60 + 3 * u * t * t * 40 + t ** 3 * 90;
      return [Number(x.toFixed(1)), Number(y.toFixed(1))];
    });
    return draw(
      'A curved rocket path from Earth to the Moon made of plotted points, with arrows showing Earth’s gravity pulling on it the whole way',
      line(30, 290, 380, 290, DIM, 2) + line(30, 290, 30, 20, DIM, 2) +
        `<circle cx="70" cy="250" r="34" fill="${SKY}"/>` + label(70, 256, 'Earth', { size: 13, fill: DARK }) +
        `<circle cx="340" cy="96" r="16" fill="${INK}"/>` + label(340, 136, 'Moon', { size: 13 }) +
        `<path d="M 80 230 C 120 60 320 40 330 90" fill="none" stroke="${HI}" stroke-width="3" stroke-dasharray="2 7"/>` +
        pts.map(([x, y]) => pt(x, y, HI, 5)).join('') +
        pts.slice(2, 6).map(([x, y]) => {
          const dx = 70 - x, dy = 250 - y, L = Math.hypot(dx, dy);
          return arrow(x, y, Number((x + (dx / L) * 34).toFixed(1)), Number((y + (dy / L) * 34).toFixed(1)), NO, 2);
        }).join('') +
        label(pts[2][0] - 14, pts[2][1] - 2, '(x, y)', { size: 13, fill: HI, anchor: 'end' }) +
        label(250, 222, 'gravity pulls', { size: 14, fill: NO }) +
        label(250, 244, 'toward Earth', { size: 14, fill: NO }) +
        label(200, 310, 'every point of the curve, calculated', { size: 12, fill: DIM }),
    );
  })(),
  draw(
    'Glenn’s 1962 orbit of Earth, and a check: the machine’s numbers go to Katherine, who re-checks them by hand before the go',
    label(200, 30, 'Friendship 7, 1962', { size: 15, fill: HI }) +
      `<circle cx="110" cy="170" r="48" fill="${SKY}"/>` + label(110, 176, 'Earth', { size: 13, fill: DARK }) +
      `<ellipse cx="110" cy="170" rx="88" ry="64" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="5 6"/>` +
      pt(198, 170, HI, 7) + label(110, 262, 'orbit', { size: 13, fill: DIM }) +
      box(240, 58, 140, 52, DIM, 0.1) + label(310, 90, 'machine', { size: 14 }) +
      arrow(310, 112, 310, 140, DIM, 2.5) +
      box(240, 144, 140, 52, HI, 0.15) + label(310, 176, 'Katherine', { size: 14, fill: HI }) +
      arrow(310, 198, 310, 226, OK, 2.5) +
      box(240, 230, 140, 52, OK, 0.2) + label(310, 262, 'numbers agree', { size: 13, fill: OK }) +
      label(110, 300, 'then: GO', { size: 15, fill: OK }),
  ),
  draw(
    'Apollo 11’s round trip: out from Earth, around the Moon, and back home, July 1969',
    `<circle cx="70" cy="190" r="36" fill="${SKY}"/>` + label(70, 196, 'Earth', { size: 13, fill: DARK }) +
      `<circle cx="320" cy="150" r="20" fill="${INK}"/>` + label(360, 206, 'Moon', { size: 13 }) +
      `<path d="M 104 175 C 180 110 270 100 316 124" fill="none" stroke="${HI}" stroke-width="3"/>` +
      `<path d="M 316 124 C 360 130 362 178 320 176" fill="none" stroke="${INK}" stroke-width="3"/>` +
      `<path d="M 320 176 C 270 230 170 240 104 206" fill="none" stroke="${OK}" stroke-width="3"/>` +
      arrow(200, 122, 212, 118, HI, 3) + arrow(214, 226, 200, 226, OK, 3) +
      label(200, 100, 'out', { size: 15, fill: HI }) + label(200, 258, 'home safely', { size: 15, fill: OK }) +
      label(200, 44, 'Apollo 11, July 1969', { size: 17, fill: HI }) +
      label(200, 300, 'a moving point (x, y)', { size: 13, fill: DIM }),
  ),
  (() => {
    const p = plane({ ox: 60, oy: 270, sx: 55, sy: 34, x1: 5, y1: 6 });
    const P: [number, number][] = [[0, 0], [1, 4], [2, 6], [3, 6], [4, 4], [5, 0]];
    return draw(
      'The points (0, 0), (1, 4), (2, 6), (3, 6), (4, 4) and (5, 0) plotted and joined into an arch-shaped trajectory',
      p.svg +
        `<polyline points="${P.map(([x, y]) => `${p.X(x)},${p.Y(y)}`).join(' ')}" fill="none" stroke="${HI}" stroke-width="3"/>` +
        P.map(([x, y]) => pt(p.X(x), p.Y(y), OK, 6)).join('') +
        P.map(([x, y]) => {
          const side = x === 0 ? -8 : x === 1 || x === 5 ? -10 : x === 4 ? 10 : 0;
          const anchor = side < 0 ? 'end' : side > 0 ? 'start' : 'middle';
          return label(p.X(x) + side, p.Y(y) - (x === 0 ? 14 : 12), `(${x}, ${y})`, { size: 12, fill: INK, anchor });
        }).join(''),
    );
  })(),
  draw(
    'Two graphs of the same arch: the left one has no axis labels and means nothing, the right one is labelled downrange distance and altitude',
    [30, 220].map((x0, i) =>
      arrow(x0, 240, x0 + 150, 240, INK, 2.5) + arrow(x0, 240, x0, 80, INK, 2.5) +
      `<path d="M ${x0} 240 Q ${x0 + 70} 60 ${x0 + 140} 240" fill="none" stroke="${i ? OK : NO}" stroke-width="3"/>`,
    ).join('') +
      label(100, 50, 'no labels', { size: 15, fill: NO }) + label(110, 150, '?', { size: 36, fill: NO }) +
      label(300, 50, 'labelled', { size: 15, fill: OK }) +
      label(226, 76, 'altitude (y)', { size: 12, fill: OK, anchor: 'start' }) +
      label(300, 264, 'downrange (x)', { size: 12, fill: OK }) +
      label(100, 296, 'what is this?', { size: 13, fill: DIM }) + label(300, 296, 'a rocket climbs', { size: 13, fill: DIM }),
  ),
  (() => {
    const p = plane({ ox: 50, oy: 270, sx: 34, sy: 34, x1: 6, y1: 6 });
    return draw(
      'The point (3, 5): across 3, then up 5. Plotting it the wrong way round gives (5, 3), a different point',
      p.svg +
        arrow(p.X(0), p.Y(0) - 3, p.X(3), p.Y(0) - 3, OK, 3) + arrow(p.X(3), p.Y(0), p.X(3), p.Y(5) + 4, OK, 3) +
        pt(p.X(3), p.Y(5), OK, 8) + pt(p.X(5), p.Y(3), NO, 8) +
        label(286, 86, '(3, 5)', { size: 18, fill: OK, anchor: 'start' }) +
        label(286, 108, 'across 3, up 5', { size: 12, anchor: 'start' }) +
        label(286, 160, '(5, 3)', { size: 18, fill: NO, anchor: 'start' }) +
        label(286, 182, 'not the same', { size: 12, anchor: 'start' }) +
        label(286, 222, 'x first,', { size: 13, fill: HI, anchor: 'start' }) +
        label(286, 240, 'runs across', { size: 13, fill: HI, anchor: 'start' }),
    );
  })(),
  draw(
    'Katherine Johnson’s three tools: geometry (a right triangle), coordinates (a point on axes) and arithmetic (27.5 + 14.8 = 42.3), honoured with the Medal of Freedom at 97',
    label(70, 60, 'geometry', { size: 14, fill: HI }) + label(200, 60, 'coordinates', { size: 14, fill: SKY }) + label(330, 60, 'arithmetic', { size: 14, fill: OK }) +
      `<polygon points="20,220 120,220 120,110" fill="${HI}" fill-opacity="0.15" stroke="${HI}" stroke-width="3"/>` + rightAngle(120, 220, -1, -1) +
      arrow(150, 220, 260, 220, INK, 2.5) + arrow(150, 220, 150, 100, INK, 2.5) +
      line(150, 150, 220, 150, SKY, 2, '4 4') + line(220, 220, 220, 150, SKY, 2, '4 4') + pt(220, 150, SKY, 7) +
      label(220, 134, '(x, y)', { size: 13, fill: SKY }) +
      label(372, 130, '27.5', { size: 18, anchor: 'end' }) + label(372, 160, '+ 14.8', { size: 18, anchor: 'end' }) +
      line(300, 172, 376, 172, INK, 2.5) + label(372, 200, '42.3', { size: 18, fill: OK, anchor: 'end' }) +
      label(200, 290, 'Medal of Freedom, age 97', { size: 15, fill: HI }),
  ),
  (() => {
    const p = plane({ ox: 50, oy: 260, sx: 40, sy: 40, x1: 7, y1: 5, nums: false, names: false });
    return draw(
      'Any location on the coordinate plane is pinned by two numbers: a spacecraft at (x, y), x across from the origin and y up',
      p.svg +
        line(p.X(5), p.Y(0), p.X(5), p.Y(4), HI, 2.5, '6 5') + line(p.X(0), p.Y(4), p.X(5), p.Y(4), HI, 2.5, '6 5') +
        `<polygon points="${p.X(5) - 10},${p.Y(4) + 9} ${p.X(5) + 11},${p.Y(4) - 10} ${p.X(5) + 2},${p.Y(4) + 11}" fill="${HI}"/>` +
        label(p.X(5) + 18, p.Y(4) - 14, '(x, y)', { size: 18, fill: HI, anchor: 'start' }) +
        label(p.X(2.5), p.Y(0) + 24, 'x across', { size: 14, fill: OK }) +
        label(p.X(0) + 8, p.Y(2) + 5, 'y up', { size: 14, fill: OK, anchor: 'start' }) +
        `<circle cx="${p.X(0)}" cy="${p.Y(0)}" r="9" fill="${SKY}"/>` +
        label(p.X(0) + 4, p.Y(0) + 46, 'home (0, 0)', { size: 13, fill: SKY, anchor: 'start' }) +
        label(200, 30, 'two numbers pin any point', { size: 15, fill: DIM }),
    );
  })(),
];

// ── 6.NS-7 · Gauss adds 1 to 100 ─────────────────────────────────────────

const GAUSS: MathFigure[] = [
  draw(
    'A timeline of Gauss’s life: born 1777, adds 1 to 100 at age 7 around 1784, publishes his great number book in 1801, dies 1855',
    label(200, 32, 'Carl Friedrich Gauss, Germany', { size: 15, fill: HI }) +
      timeline(1770, 1860, [
        { at: 1777, text: '1777 born', y: 118 },
        { at: 1784, text: '1784 age 7', y: 234, hi: true, sub: 'adds 1 to 100' },
        { at: 1801, text: '1801 great book', y: 82 },
        { at: 1855, text: '1855 dies', y: 234 },
      ]),
  ),
  draw(
    'A hundred chart of the numbers 1 to 100 in ten rows of ten, all to be added one by one',
    Array.from({ length: 100 }, (_, i) => {
      const x = 50 + (i % 10) * 30, y = 20 + Math.floor(i / 10) * 25;
      const end = i === 0 || i === 99;
      return `<rect x="${x}" y="${y}" width="28" height="23" rx="3" fill="${end ? HI : SKY}" fill-opacity="${end ? 0.5 : 0.15}"/>` + label(x + 14, y + 16, String(i + 1), { size: 11, fill: end ? INK : INK });
    }).join('') +
      label(200, 296, '1 + 2 + 3 + … + 100 = ?', { size: 16, fill: HI }),
  ),
  draw(
    'The numbers 1, 2, 3 … 98, 99, 100 with arcs pairing the ends: 1 + 100, 2 + 99, 3 + 98, each pair making 101',
    [[40, 360, 82, HI], [85, 315, 122, OK], [130, 270, 162, SKY]].map(([a, b, peak, c]) =>
      `<path d="M ${a} 200 Q 200 ${2 * Number(peak) - 200} ${b} 200" fill="none" stroke="${c}" stroke-width="3"/>` +
      label(200, Number(peak) - 6, '101', { size: 14, fill: String(c) }),
    ).join('') +
      ['1', '2', '3', '…', '98', '99', '100'].map((n, i) => label([40, 85, 130, 200, 270, 315, 360][i], 226, n, { size: 20 })).join('') +
      label(200, 282, 'every pair makes 101', { size: 15, fill: HI }) +
      label(200, 306, '100 numbers = 50 pairs', { size: 13, fill: DIM }),
  ),
  tex(
    ['\\underbrace{101 + 101 + \\cdots + 101}_{50 \\text{ pairs}}', '= 50 \\times 101 = 5050'],
    'One multiplication instead of 99 additions',
  ),
  draw(
    'Ten bars for the pairs 1 + 20 up to 10 + 11: each bar is made of two parts that always total 21, so the sum is 10 times 21 = 210',
    Array.from({ length: 10 }, (_, k) => {
      const a = k + 1, b = 20 - k, y = 34 + k * 22;
      return label(62, y + 13, `${a} + ${b}`, { size: 12, anchor: 'end' }) +
        `<rect x="70" y="${y}" width="${a * 12}" height="17" fill="${SKY}"/>` +
        `<rect x="${70 + a * 12}" y="${y}" width="${b * 12}" height="17" fill="${HI}" fill-opacity="0.8"/>` +
        label(330, y + 13, '21', { size: 12, fill: OK, anchor: 'start' });
    }).join('') +
      label(200, 282, '10 pairs × 21 = 210', { size: 17, fill: OK }) +
      label(200, 306, 'n × (n + 1) ÷ 2 = 20 × 21 ÷ 2', { size: 12, fill: DIM }),
  ),
  draw(
    'The numbers 1 to 8 reordered into pairs (1, 8), (2, 7), (3, 6), (4, 5), each making 9, so the total is 4 times 9 = 36',
    label(200, 36, 'addition doesn’t care about order', { size: 14, fill: DIM }) +
      Array.from({ length: 8 }, (_, i) => box(30 + i * 44, 56, 36, 36, SKY, 0.15) + label(48 + i * 44, 81, String(i + 1), { size: 17 })).join('') +
      [0, 1, 2, 3].map((g) => {
        const gx = 30 + g * 88, cols = [HI, OK, SKY, NO];
        const a = g, b = 7 - g;
        return line(48 + a * 44, 94, gx + 18, 176, cols[g], 2) + line(48 + b * 44, 94, gx + 58, 176, cols[g], 2) +
          box(gx, 180, 36, 36, cols[g], 0.2) + box(gx + 40, 180, 36, 36, cols[g], 0.2) +
          label(gx + 18, 205, String(a + 1), { size: 17 }) + label(gx + 58, 205, String(b + 1), { size: 17 }) +
          label(gx + 38, 242, '= 9', { size: 15, fill: cols[g] });
      }).join('') +
      label(200, 292, '4 × 9 = 36', { size: 20, fill: OK }),
  ),
  draw(
    'One hundred dots grouped two at a time make only 50 pairs, so the answer is 50 times 101 = 5,050, not 100 times 101 = 10,100',
    Array.from({ length: 50 }, (_, k) => {
      const x = 20 + (k % 5) * 38, y = 46 + Math.floor(k / 5) * 23;
      return `<rect x="${x}" y="${y}" width="34" height="18" rx="9" fill="none" stroke="${HI}" stroke-width="1.5"/>` +
        pt(x + 9, y + 9, INK, 4.5) + pt(x + 25, y + 9, INK, 4.5);
    }).join('') +
      label(116, 30, '100 dots', { size: 13, fill: DIM }) +
      label(236, 82, '100 numbers', { size: 14, anchor: 'start' }) +
      label(236, 106, '= 50 pairs', { size: 16, fill: HI, anchor: 'start' }) +
      label(236, 160, '50 × 101', { size: 16, fill: OK, anchor: 'start' }) +
      label(236, 184, '= 5,050', { size: 16, fill: OK, anchor: 'start' }) +
      label(236, 238, '100 × 101', { size: 16, fill: NO, anchor: 'start' }) +
      line(232, 232, 330, 232, NO, 2.5) +
      label(236, 262, '= 10,100', { size: 16, fill: NO, anchor: 'start' }) +
      label(236, 286, 'double: wrong', { size: 13, fill: NO, anchor: 'start' }),
  ),
  (() => {
    const f = (x: number) => 250 - 170 * Math.exp(-((x - 200) ** 2) / (2 * 55 * 55));
    const d = Array.from({ length: 61 }, (_, i) => { const x = 30 + i * (340 / 60); return `${i ? 'L' : 'M'} ${x.toFixed(1)} ${f(x).toFixed(1)}`; }).join(' ');
    const mid = Array.from({ length: 23 }, (_, i) => { const x = 145 + i * 5; return `L ${x.toFixed(1)} ${f(x).toFixed(1)}`; }).join(' ');
    return draw(
      'Gauss’s bell curve from statistics, with the middle 68 percent of values, within one step of the mean, shaded',
      `<path d="M 145 250 ${mid} L 255 250 Z" fill="${OK}" fill-opacity="0.25"/>` +
        line(20, 250, 380, 250, DIM, 3) +
        `<path d="${d}" fill="none" stroke="${HI}" stroke-width="4"/>` +
        line(200, 250, 200, 80, DIM, 2, '5 5') +
        label(200, 200, '68%', { size: 18, fill: OK }) +
        label(200, 272, 'mean', { size: 13, fill: DIM }) +
        label(200, 40, 'the Gaussian bell curve', { size: 16, fill: HI }) +
        label(200, 304, 'statistics, astronomy, algebra…', { size: 13, fill: DIM }),
    );
  })(),
  draw(
    'Two staircases of 1 to 10 squares fit together into a 10 by 11 rectangle of 110 squares, so one staircase, 1 + 2 + … + 10, is 55',
    Array.from({ length: 10 }, (_, c) =>
      Array.from({ length: 11 }, (_, r) => {
        const mine = r < c + 1;
        return `<rect x="${40 + c * 18}" y="${248 - (r + 1) * 18}" width="16" height="16" fill="${mine ? HI : SKY}" fill-opacity="${mine ? 0.85 : 0.35}"/>`;
      }).join(''),
    ).join('') +
      label(129, 270, '10', { size: 13, fill: DIM }) + label(26, 153, '11', { size: 13, fill: DIM }) +
      label(238, 76, 'two staircases', { size: 13, fill: DIM, anchor: 'start' }) +
      label(238, 100, 'make 10 × 11', { size: 14, anchor: 'start' }) +
      label(238, 124, '= 110', { size: 14, anchor: 'start' }) +
      label(238, 176, '1 + 2 + … + 10', { size: 13, fill: HI, anchor: 'start' }) +
      label(238, 202, '= 110 ÷ 2 = 55', { size: 15, fill: OK, anchor: 'start' }) +
      label(200, 302, 'pattern, not brute force', { size: 15, fill: HI }),
  ),
];

// ── 6.NS-10 · The fly that invented coordinates ──────────────────────────

const ceiling = (extra = ''): string => `<rect x="40" y="50" width="320" height="220" rx="4" fill="${DIM}" fill-opacity="0.08" stroke="${INK}" stroke-width="3"/>${extra}`;

const DESCARTES: MathFigure[] = [
  draw(
    'A timeline of René Descartes: born 1596, publishes La Géométrie with coordinates in 1637, dies 1650',
    label(200, 36, 'René Descartes, France', { size: 16, fill: HI }) +
      timeline(1590, 1660, [
        { at: 1596, text: '1596 born', y: 118 },
        { at: 1637, text: '1637 the fly', y: 234, hi: true, sub: 'La Géométrie' },
        { at: 1650, text: '1650 dies', y: 118 },
      ]),
  ),
  draw(
    'A rectangular ceiling with a fly’s wandering dotted path from one corner, across the middle and back',
    ceiling() +
      label(200, 36, 'the ceiling', { size: 14, fill: DIM }) +
      `<path d="M 70 240 C 120 200 90 120 160 110 S 300 70 330 80 C 340 140 250 150 200 160 S 140 220 230 230" fill="none" stroke="${DIM}" stroke-width="2.5" stroke-dasharray="3 7"/>` +
      fly(232, 228) +
      label(200, 296, 'corner, across the middle, back again', { size: 13, fill: DIM }),
  ),
  draw(
    'The fly on the ceiling with vague descriptions around it — near the middle? a bit left? — none of which says exactly where it is',
    ceiling() + fly(230, 150) +
      label(130, 100, 'near the middle?', { size: 13, fill: NO }) +
      label(300, 210, 'a bit left?', { size: 13, fill: NO }) +
      label(120, 230, 'over there?', { size: 13, fill: NO }) +
      label(200, 300, 'no pointing: how to say where?', { size: 14, fill: HI }),
  ),
  draw(
    'From the ceiling’s corner, the fly is 5 tiles across and 3 tiles up: two numbers fix it exactly',
    ceiling(
      Array.from({ length: 7 }, (_, i) => line(80 + i * 40, 50, 80 + i * 40, 270, DIM, 1)).join('') +
        Array.from({ length: 5 }, (_, j) => line(40, 230 - j * 40, 360, 230 - j * 40, DIM, 1)).join(''),
    ) +
      `<circle cx="40" cy="270" r="9" fill="${HI}"/>` + label(40, 296, 'corner', { size: 13, fill: HI }) +
      arrow(40, 262, 240, 262, OK, 3) + arrow(240, 262, 240, 160, SKY, 3) +
      fly(240, 150) +
      label(140, 296, 'across 5', { size: 14, fill: OK }) +
      label(252, 214, 'up 3', { size: 14, fill: SKY, anchor: 'start' }) +
      label(200, 34, 'two numbers: 5 across, 3 up', { size: 15, fill: HI }),
  ),
  (() => {
    const p = plane({ ox: 50, oy: 260, sx: 40, sy: 40, x1: 7, y1: 5 });
    const P: [number, number, string][] = [[2, 4, HI], [5, 1, OK], [6, 3, SKY]];
    return draw(
      'A coordinate plane with x across and y up, and three points named by ordered pairs: (2, 4), (5, 1) and (6, 3)',
      p.svg +
        P.map(([x, y, c]) => pt(p.X(x), p.Y(y), c, 7) + label(p.X(x), p.Y(y) - 14, `(${x}, ${y})`, { size: 14, fill: c })).join('') +
        label(200, 300, 'x across, y up: (x, y)', { size: 14, fill: DIM }),
    );
  })(),
  (() => {
    const p = plane({ ox: 200, oy: 160, sx: 30, sy: 30, x0: -4, x1: 4, y0: -4, y1: 4, nums: false });
    return draw(
      'The line y = x + 1 and the circle x² + y² = 4 drawn on a coordinate plane: each shape is an equation in x and y',
      p.svg +
        line(p.X(-4), p.Y(-3), p.X(3), p.Y(4), HI, 3) +
        `<circle cx="${p.X(0)}" cy="${p.Y(0)}" r="60" fill="none" stroke="${SKY}" stroke-width="3"/>` +
        pt(p.X(2), p.Y(3), HI, 5) + pt(p.X(-3), p.Y(-2), HI, 5) +
        label(300, 66, 'y = x + 1', { size: 15, fill: HI, anchor: 'start' }) +
        label(330, 250, 'x² + y² = 4', { size: 14, fill: SKY }),
    );
  })(),
  (() => {
    const X = (x: number) => 285 + x * 22, Y = (y: number) => 250 - y * 40;
    const curve = Array.from({ length: 41 }, (_, i) => { const x = -2.2 + i * 0.11; return `${i ? 'L' : 'M'} ${X(x).toFixed(1)} ${Y(x * x).toFixed(1)}`; }).join(' ');
    return draw(
      'Algebra and geometry joined: a table of x and y = x² on the left, the same pairs plotted as a parabola on the right',
      label(85, 36, 'algebra', { size: 16, fill: HI }) + label(285, 36, 'geometry', { size: 16, fill: SKY }) +
        label(60, 70, 'x', { size: 15, fill: DIM }) + label(115, 70, 'y = x²', { size: 15, fill: DIM }) +
        line(30, 80, 150, 80, DIM, 2) + line(85, 56, 85, 206, DIM, 2) +
        [-2, -1, 0, 1, 2].map((x, i) => label(60, 102 + i * 24, String(x).replace('-', '−'), { size: 15 }) + label(115, 102 + i * 24, String(x * x), { size: 15, fill: HI })).join('') +
        arrow(160, 140, 200, 140, OK, 3) + arrow(200, 160, 160, 160, OK, 3) +
        line(225, 250, 350, 250, DIM, 2) + line(285, 260, 285, 70, DIM, 2) +
        `<path d="${curve}" fill="none" stroke="${SKY}" stroke-width="3"/>` +
        [-2, -1, 0, 1, 2].map((x) => pt(X(x), Y(x * x), HI, 5)).join('') +
        label(200, 296, 'equations become pictures', { size: 14, fill: OK }),
    );
  })(),
  draw(
    'Three-dimensional axes x, y and z with the point (4, 3, 2) reached by going 4 along x, 3 along y and 2 up z',
    arrow(80, 250, 370, 250, INK, 2.5) + arrow(80, 250, 190, 173, INK, 2.5) + arrow(80, 250, 80, 60, INK, 2.5) +
      label(372, 274, 'x', { size: 15, fill: DIM }) + label(198, 160, 'y', { size: 15, fill: DIM }) + label(64, 66, 'z', { size: 15, fill: DIM }) +
      line(80, 250, 220, 250, OK, 4) + line(220, 250, 280, 208, SKY, 4) + line(280, 208, 280, 128, HI, 4) +
      line(220, 250, 220, 170, DIM, 1.5, '4 4') + line(220, 170, 280, 128, DIM, 1.5, '4 4') + line(80, 170, 220, 170, DIM, 1.5, '4 4') +
      pt(280, 128, HI, 8) +
      label(150, 274, '4', { size: 15, fill: OK }) + label(262, 244, '3', { size: 15, fill: SKY }) + label(294, 174, '2', { size: 15, fill: HI, anchor: 'start' }) +
      label(294, 120, '(4, 3, 2)', { size: 17, fill: HI, anchor: 'start' }) +
      label(200, 34, 'add height: (x, y, z)', { size: 16, fill: HI }),
  ),
  (() => {
    const p = plane({ ox: 50, oy: 270, sx: 40, sy: 40, x1: 7, y1: 5, nums: false });
    return draw(
      'A coordinate plane with Earth near the origin, the Moon up and to the right, and a spacecraft’s curved path between them marked as a point (x, y)',
      p.svg +
        `<circle cx="${p.X(1)}" cy="${p.Y(1)}" r="22" fill="${SKY}"/>` + label(p.X(1) + 28, p.Y(1) + 16, 'Earth', { size: 13, fill: SKY, anchor: 'start' }) +
        `<circle cx="${p.X(6)}" cy="${p.Y(4)}" r="12" fill="${INK}"/>` + label(p.X(6), p.Y(4) - 20, 'Moon', { size: 13 }) +
        `<path d="M ${p.X(1.5)} ${p.Y(1.5)} C ${p.X(2.5)} ${p.Y(4.5)} ${p.X(4.5)} ${p.Y(5)} ${p.X(5.6)} ${p.Y(4.2)}" fill="none" stroke="${HI}" stroke-width="3"/>` +
        pt(p.X(3.2), p.Y(4.04), HI, 7) +
        line(p.X(3.2), p.Y(4.04), p.X(3.2), p.Y(0), HI, 1.5, '4 4') + line(p.X(3.2), p.Y(4.04), p.X(0), p.Y(4.04), HI, 1.5, '4 4') +
        label(p.X(3.2) + 12, p.Y(4.04) + 24, '(x, y)', { size: 15, fill: HI, anchor: 'start' }) +
        label(220, 34, 'Apollo 11, 1969: same idea', { size: 15, fill: DIM }),
    );
  })(),
  (() => {
    const p = plane({ ox: 50, oy: 270, sx: 30, sy: 30, x1: 10, y1: 7, nums: false, names: false });
    return draw(
      'Graph paper with two axes: x runs right and y runs up from the origin',
      p.svg +
        arrow(p.X(0), p.Y(0), p.X(10) + 16, p.Y(0), OK, 4) + arrow(p.X(0), p.Y(0), p.X(0), p.Y(7) - 16, SKY, 4) +
        label(p.X(10), p.Y(0) - 14, 'x runs right', { size: 15, fill: OK, anchor: 'end' }) +
        label(p.X(0) + 14, p.Y(7) - 2, 'y runs up', { size: 15, fill: SKY, anchor: 'start' }) +
        `<circle cx="${p.X(0)}" cy="${p.Y(0)}" r="7" fill="${HI}"/>` +
        label(p.X(0) + 12, p.Y(0) + 30, 'origin', { size: 13, fill: HI }) +
        label(230, 160, 'every graph, every grid', { size: 15, fill: DIM }),
    );
  })(),
  (() => {
    const p = plane({ ox: 50, oy: 260, sx: 40, sy: 40, x1: 6, y1: 5 });
    return draw(
      'Two flies on a tiled ceiling: one at (4, 2), four right and two up, and another at (2, 4), a completely different spot',
      p.svg +
        line(p.X(4), p.Y(0), p.X(4), p.Y(2), HI, 2, '5 4') + line(p.X(0), p.Y(2), p.X(4), p.Y(2), HI, 2, '5 4') +
        line(p.X(2), p.Y(0), p.X(2), p.Y(4), SKY, 2, '5 4') + line(p.X(0), p.Y(4), p.X(2), p.Y(4), SKY, 2, '5 4') +
        fly(p.X(4), p.Y(2) + 4, HI) + fly(p.X(2), p.Y(4) + 4, SKY) +
        label(p.X(4) + 16, p.Y(2) - 8, '(4, 2)', { size: 16, fill: HI, anchor: 'start' }) +
        label(p.X(2) + 16, p.Y(4) - 8, '(2, 4)', { size: 16, fill: SKY, anchor: 'start' }) +
        label(200, 34, 'order matters', { size: 16, fill: HI }),
    );
  })(),
  (() => {
    const p = plane({ ox: 50, oy: 260, sx: 40, sy: 40, x1: 6, y1: 5 });
    return draw(
      'Plotting (5, 3): first run 5 along the x-axis, then jump 3 up',
      p.svg +
        arrow(p.X(0), p.Y(0), p.X(5), p.Y(0), OK, 5) + arrow(p.X(5), p.Y(0), p.X(5), p.Y(3) + 6, SKY, 5) +
        pt(p.X(5), p.Y(3), HI, 8) +
        label(p.X(2.5), p.Y(0) - 12, '1st: run 5', { size: 14, fill: OK }) +
        label(p.X(5) - 10, p.Y(1.5), '2nd: jump 3', { size: 14, fill: SKY, anchor: 'end' }) +
        label(p.X(5), p.Y(3) - 16, '(5, 3)', { size: 18, fill: HI }) +
        label(200, 34, 'run before you jump', { size: 16, fill: HI }),
    );
  })(),
  draw(
    'The same fly measured from two different origins: from corner A it is at (5, 3), from point B it is at (2, 1)',
    Array.from({ length: 8 }, (_, i) => line(60 + i * 40, 60, 60 + i * 40, 260, DIM, 1)).join('') +
      Array.from({ length: 6 }, (_, j) => line(60, 60 + j * 40, 340, 60 + j * 40, DIM, 1)).join('') +
      line(60, 260, 260, 260, HI, 3, '6 5') + line(260, 260, 260, 146, HI, 3, '6 5') +
      line(180, 180, 260, 180, SKY, 3, '6 5') + line(260, 180, 260, 146, SKY, 3) +
      `<circle cx="60" cy="260" r="9" fill="${HI}"/>` + label(44, 286, 'A (0, 0)', { size: 13, fill: HI }) +
      `<circle cx="180" cy="180" r="9" fill="${SKY}"/>` + label(168, 204, 'B', { size: 14, fill: SKY, anchor: 'end' }) +
      fly(260, 140) +
      label(110, 40, 'from A: (5, 3)', { size: 15, fill: HI }) +
      label(290, 40, 'from B: (2, 1)', { size: 15, fill: SKY }) +
      label(250, 302, 'fix the origin first', { size: 14, fill: DIM }),
  ),
  draw(
    'Four uses of coordinates around the pair (x, y): a graph, a GPS map point, an animation path, and a rocket trajectory',
    `<circle cx="200" cy="160" r="40" fill="${HI}" fill-opacity="0.15" stroke="${HI}" stroke-width="3"/>` + label(200, 166, '(x, y)', { size: 17, fill: HI }) +
      // graph
      arrow(40, 110, 120, 110, INK, 2) + arrow(40, 110, 40, 40, INK, 2) + line(46, 104, 112, 52, OK, 3) + label(80, 134, 'graphs', { size: 13 }) +
      // GPS
      Array.from({ length: 4 }, (_, i) => line(280 + i * 26, 40, 280 + i * 26, 110, DIM, 1) + line(280, 40 + i * 23.3, 358, 40 + i * 23.3, DIM, 1)).join('') +
      `<path d="M 332 86 C 320 70 322 56 332 56 C 342 56 344 70 332 86 Z" fill="${NO}"/>` + label(320, 134, 'GPS', { size: 13 }) +
      // animation
      [0, 1, 2, 3].map((i) => `<circle cx="${50 + i * 24}" cy="${270 - [0, 30, 40, 30][i]}" r="7" fill="${SKY}" fill-opacity="${0.3 + i * 0.23}"/>`).join('') + label(86, 298, 'animation', { size: 13 }) +
      // rocket
      `<path d="M 280 280 Q 320 200 365 210" fill="none" stroke="${HI}" stroke-width="3"/>` + pt(365, 210, HI, 5) + label(320, 298, 'rockets', { size: 13 }) +
      line(170, 135, 128, 108, DIM, 1.5, '4 4') + line(230, 135, 272, 108, DIM, 1.5, '4 4') + line(170, 185, 128, 220, DIM, 1.5, '4 4') + line(230, 185, 272, 220, DIM, 1.5, '4 4'),
  ),
  (() => {
    const p = plane({ ox: 50, oy: 260, sx: 40, sy: 40, x1: 7, y1: 5 });
    return draw(
      'Any point on a plane is two numbers: the fly at (6, 4) is 6 across and 4 up from the origin',
      p.svg +
        line(p.X(6), p.Y(0), p.X(6), p.Y(4), HI, 2.5, '6 5') + line(p.X(0), p.Y(4), p.X(6), p.Y(4), HI, 2.5, '6 5') +
        fly(p.X(6), p.Y(4) + 4, HI) +
        label(p.X(6), p.Y(4) - 20, '(6, 4)', { size: 18, fill: HI }) +
        label(p.X(3), p.Y(4) - 10, 'x = 6', { size: 14, fill: OK }) +
        label(p.X(6) + 10, p.Y(2), 'y = 4', { size: 14, fill: OK, anchor: 'start' }) +
        label(200, 34, 'one point = two numbers', { size: 16, fill: HI }),
    );
  })(),
];

export const STORY_FIGURES_G4: Record<string, MathFigure[]> = {
  '6.NS-3-story.mp4': RAMANUJAN,
  '6.NS-4-story.mp4': ZERO,
  '6.NS-5-story.mp4': JOHNSON,
  '6.NS-7-story.mp4': GAUSS,
  '6.NS-10-story.mp4': DESCARTES,
};
