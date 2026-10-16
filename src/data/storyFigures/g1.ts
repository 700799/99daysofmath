// Drawn figures for the illustrated Math Stories, group 1. Keyed by story id
// (the old video file name). Each array holds one figure per beat, in order,
// then one more for the closing "What you learned" slide.
import type { MathFigure } from '../mathFigure';
import { tex, draw, label, line, arrow, rightAngle, arc, INK, DIM, HI, OK, NO, SKY } from '../mathFigure';

// Dark ink for text sitting on a bright fill, and a true red for Florence's wedges.
const DARK = '#1e1b4b';
const RED = '#f87171';

// ── local drawing helpers ──────────────────────────────────────────────────

const n = (v: number) => String(Math.round(v * 10) / 10);
const commas = (v: number) => v.toLocaleString('en-US');

function rect(x: number, y: number, w: number, h: number, fill: string, extra = ''): string {
  return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
}

function dot(cx: number, cy: number, r: number, fill: string, extra = ''): string {
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
}

function poly(points: [number, number][], fill: string, extra = ''): string {
  return `<polygon points="${points.map(([x, y]) => `${n(x)},${n(y)}`).join(' ')}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
}

function polyline(points: [number, number][], stroke: string, w = 3, extra = ''): string {
  return `<path d="${points.map(([x, y], i) => `${i ? 'L' : 'M'} ${n(x)} ${n(y)}`).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${w}"${extra ? ' ' + extra : ''}/>`;
}

/** A pie/rose wedge; angles in degrees, clockwise from 12 o'clock. */
function wedge(cx: number, cy: number, r: number, a0: number, a1: number, fill: string, extra = ''): string {
  const p = (a: number) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `<path d="M ${n(cx)} ${n(cy)} L ${n(x0)} ${n(y0)} A ${n(r)} ${n(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n(x1)} ${n(y1)} Z" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
}

type Bar = { v: number; name: string; fill?: string; val?: string; valFill?: string };

/** A vertical bar chart with a value over each bar and a name under it. */
function bars(items: Bar[], o: { x0?: number; x1?: number; base?: number; top?: number; max?: number; w?: number; nameSize?: number; valSize?: number } = {}): string {
  const x0 = o.x0 ?? 40;
  const x1 = o.x1 ?? 360;
  const base = o.base ?? 260;
  const top = o.top ?? 80;
  const max = o.max ?? Math.max(...items.map((b) => b.v));
  const slot = (x1 - x0) / items.length;
  const bw = o.w ?? slot * 0.6;
  let out = line(x0, base, x1, base, DIM, 2);
  items.forEach((b, i) => {
    const cx = x0 + slot * (i + 0.5);
    const h = Math.max(2, (b.v / max) * (base - top));
    out += rect(cx - bw / 2, base - h, bw, h, b.fill ?? SKY, 'rx="3"');
    if (b.val !== '') out += label(cx, base - h - 8, b.val ?? String(b.v), { size: o.valSize ?? 14, fill: b.valFill ?? b.fill ?? INK });
    if (b.name) out += label(cx, base + 20, b.name, { size: o.nameSize ?? 13, fill: DIM });
  });
  return out;
}

/** A horizontal timeline from `a` to `b`; marks alternate above and below. */
function timeline(a: number, b: number, marks: { at: number; text: string; hi?: boolean }[], fmt: (v: number) => string, y = 170): string {
  const x = (v: number) => 40 + ((v - a) / (b - a)) * 320;
  let out = line(40, y, 360, y, DIM, 3);
  out += label(40, y + 30, fmt(a), { size: 12, fill: DIM }) + label(360, y + 30, fmt(b), { size: 12, fill: DIM });
  marks.forEach((m, i) => {
    const px = x(m.at);
    const up = i % 2 === 0;
    out += dot(px, y, m.hi ? 9 : 6, m.hi ? HI : INK);
    out += line(px, y, px, up ? y - 50 : y + 50, m.hi ? HI : DIM, 2);
    out += label(px, up ? y - 62 : y + 74, m.text, { size: 13, fill: m.hi ? HI : INK });
  });
  return out;
}

/** A tic-tac-toe board; cells 0..8 read left to right, top to bottom. */
function board(x: number, y: number, s: number, o: { fill?: Record<number, string>; text?: Record<number, [string, string]>; size?: number } = {}): string {
  const c = s / 3;
  let out = '';
  for (const [i, f] of Object.entries(o.fill ?? {})) {
    const k = Number(i);
    out += rect(x + (k % 3) * c + 3, y + Math.floor(k / 3) * c + 3, c - 6, c - 6, f, 'rx="6"');
  }
  for (let k = 1; k < 3; k++) out += line(x + k * c, y, x + k * c, y + s, INK, 3) + line(x, y + k * c, x + s, y + k * c, INK, 3);
  for (const [i, [t, f]] of Object.entries(o.text ?? {})) {
    const k = Number(i);
    const sz = o.size ?? Math.round(c * 0.45);
    out += label(x + (k % 3 + 0.5) * c, y + (Math.floor(k / 3) + 0.5) * c + sz * 0.35, t, { size: sz, fill: f });
  }
  return out;
}

/** Centre of cell k on a board. */
const cellAt = (x: number, y: number, s: number, k: number): [number, number] => [x + ((k % 3) + 0.5) * (s / 3), y + (Math.floor(k / 3) + 0.5) * (s / 3)];

/** A winning line through cells a..b, stretched a little past their centres. */
function winLine(x: number, y: number, s: number, a: number, b: number, stroke: string, w = 5, dash?: string): string {
  const [x1, y1] = cellAt(x, y, s, a);
  const [x2, y2] = cellAt(x, y, s, b);
  const dx = (x2 - x1) * 0.18;
  const dy = (y2 - y1) * 0.18;
  return line(x1 - dx, y1 - dy, x2 + dx, y2 + dy, stroke, w, dash);
}

/** An X drawn in a cell. */
function xMark(cx: number, cy: number, r: number, stroke = HI): string {
  return line(cx - r, cy - r, cx + r, cy + r, stroke, 5) + line(cx - r, cy + r, cx + r, cy - r, stroke, 5);
}

/** An O drawn in a cell. */
function oMark(cx: number, cy: number, r: number, stroke = SKY): string {
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="none" stroke="${stroke}" stroke-width="5"/>`;
}

/** A 10 × 10 hundred-grid with the first `k` squares (row by row) shaded. */
function hundred(x: number, y: number, cell: number, k: number, fill: string): string {
  let out = '';
  for (let i = 0; i < 100; i++) {
    const cx = x + (i % 10) * cell;
    const cy = y + Math.floor(i / 10) * cell;
    out += rect(cx + 1, cy + 1, cell - 2, cell - 2, i < k ? fill : DIM, i < k ? '' : 'opacity="0.25"');
  }
  return out;
}

/** A tiny soldier: a head and a body. */
function soldier(x: number, y: number, fill: string): string {
  return dot(x, y - 14, 6, fill) + rect(x - 7, y - 6, 14, 20, fill, 'rx="5"');
}

/** Tally marks in groups of five. */
function tally(x: number, y: number, count: number, stroke = INK): string {
  let out = '';
  for (let g = 0; g * 5 < count; g++) {
    const inGroup = Math.min(5, count - g * 5);
    const gx = x + g * 44;
    for (let k = 0; k < Math.min(4, inGroup); k++) out += line(gx + k * 8, y - 10, gx + k * 8, y + 10, stroke, 2.5);
    if (inGroup === 5) out += line(gx - 4, y + 8, gx + 28, y - 8, stroke, 2.5);
  }
  return out;
}

/** Chance that at least two of `people` share a birthday. */
function sharedBirthday(people: number): number {
  let none = 1;
  for (let i = 0; i < people; i++) none *= (365 - i) / 365;
  return 1 - none;
}

// ── 5.F-3 · the pizza size scam ────────────────────────────────────────────

const pizzaRim = (cx: number, cy: number, r: number, fill = '#fbbf2433', stroke = HI) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;

const PIZZA: MathFigure[] = [
  draw(
    'Two 7-inch pizzas for 12 dollars next to one 14-inch pizza for 12 dollars, drawn to scale',
    label(200, 36, 'same price: which is more pizza?', { size: 15, fill: HI }) +
      pizzaRim(85, 160, 35) + pizzaRim(165, 160, 35) + pizzaRim(300, 160, 70) +
      line(50, 160, 120, 160, INK, 2, '5 4') + line(130, 160, 200, 160, INK, 2, '5 4') + line(230, 160, 370, 160, INK, 2, '5 4') +
      label(85, 212, '7 in', { size: 13 }) + label(165, 212, '7 in', { size: 13 }) + label(300, 252, '14 in', { size: 14 }) +
      label(125, 106, 'two 7-inch', { size: 13, fill: DIM }) + label(300, 72, 'one 14-inch', { size: 13, fill: DIM }) +
      label(125, 262, '$12', { size: 20, fill: OK }) + label(300, 292, '$12', { size: 20, fill: OK }),
  ),
  draw(
    'A circle of radius r with one r by r square, and a circle of radius 2r with a 2r by 2r square split into four r by r squares',
    label(200, 40, 'A = π × r × r', { size: 18, fill: HI }) +
      pizzaRim(90, 170, 40, 'none', DIM) + rect(90, 130, 40, 40, HI, 'opacity="0.45"') + line(90, 170, 130, 170, INK, 2.5) +
      label(110, 188, 'r', { size: 13 }) + label(110, 156, 'r²', { size: 13, fill: INK }) +
      pizzaRim(280, 170, 80, 'none', DIM) + rect(280, 90, 80, 80, HI, 'opacity="0.45"') +
      line(320, 90, 320, 170, INK, 1.5) + line(280, 130, 360, 130, INK, 1.5) + line(280, 170, 360, 170, INK, 2.5) +
      label(300, 115, 'r²', { size: 13 }) + label(340, 115, 'r²', { size: 13 }) + label(300, 155, 'r²', { size: 13 }) + label(340, 155, 'r²', { size: 13 }) +
      label(320, 190, '2r', { size: 13 }) +
      arrow(145, 220, 205, 220, OK, 2.5) + label(175, 210, '×2', { size: 14, fill: OK }) +
      label(90, 284, '1 × r²', { size: 16 }) + label(280, 284, '2 × 2 = 4 × r²', { size: 16, fill: HI }),
  ),
  draw(
    'Bar chart of pizza area: one 7-inch is 38 square inches, two 7-inch is 76, one 14-inch is 154',
    label(200, 36, 'square inches of food', { size: 15, fill: HI }) +
      bars(
        [
          { v: 38, name: 'one 7-in', val: '38' },
          { v: 76, name: 'two 7-in', val: '76' },
          { v: 154, name: 'one 14-in', val: '154', fill: HI },
        ],
        { x0: 30, x1: 350, top: 70, max: 154 },
      ) +
      line(170, 260 - (77 / 154) * 190, 350, 260 - (77 / 154) * 190, INK, 2, '6 5') +
      label(356, 165 + 4, 'half', { size: 13, anchor: 'start' }) +
      label(200, 300, 'same $12 each side', { size: 13, fill: DIM }),
  ),
  draw(
    'Two 7-inch pizzas fit side by side inside one 14-inch pizza, leaving 78 square inches over',
    label(200, 30, 'the big one holds both, and more', { size: 15, fill: HI }) +
      pizzaRim(200, 165, 110, '#fbbf2440') +
      `<circle cx="145" cy="165" r="55" fill="${SKY}" fill-opacity="0.55" stroke="${INK}" stroke-width="2"/>` +
      `<circle cx="255" cy="165" r="55" fill="${SKY}" fill-opacity="0.55" stroke="${INK}" stroke-width="2"/>` +
      label(145, 171, '38', { size: 17 }) + label(255, 171, '38', { size: 17 }) +
      label(200, 88, '78 more', { size: 14, fill: HI }) + label(200, 250, '78 more', { size: 14, fill: HI }) +
      label(200, 304, '154 = 76 + 78 in²', { size: 15 }),
  ),
  tex(
    [
      'A = \\pi r^2 \\approx 3 \\times r \\times r',
      '7\\text{-in}: \\; 3 \\times 3.5 \\times 3.5 \\approx 37\\ \\text{in}^2',
      '14\\text{-in}: \\; 3 \\times 7 \\times 7 = 147\\ \\text{in}^2',
      '147 \\div 37 \\approx 4',
    ],
    'Twice the radius, four times the pizza',
  ),
  draw(
    'Bar chart of square inches per dollar: two small pizzas give about 6, the big pizza gives about 13',
    label(200, 36, 'square inches per dollar', { size: 15, fill: HI }) +
      bars(
        [
          { v: 76 / 12, name: 'two 7-in', val: '≈ 6', fill: SKY },
          { v: 154 / 12, name: 'one 14-in', val: '≈ 13', fill: OK },
        ],
        { x0: 60, x1: 340, top: 80, base: 250, max: 13, w: 90 },
      ) +
      label(130, 296, '76 ÷ 12', { size: 14 }) + label(270, 296, '154 ÷ 12', { size: 14 }),
  ),
  draw(
    'The diameter doubles from 7 to 14 inches, but the area goes from 38 to 154 square inches, four times as much',
    label(20, 50, 'length', { size: 14, fill: SKY, anchor: 'start' }) +
      line(60, 90, 130, 90, SKY, 5) + line(200, 90, 340, 90, SKY, 5) +
      line(60, 82, 60, 98, SKY, 3) + line(130, 82, 130, 98, SKY, 3) + line(200, 82, 200, 98, SKY, 3) + line(340, 82, 340, 98, SKY, 3) +
      label(95, 75, '7 in', { size: 13 }) + label(270, 75, '14 in', { size: 13 }) +
      label(165, 96, '×2', { size: 16, fill: SKY }) +
      line(20, 130, 380, 130, DIM, 1.5, '4 6') +
      label(20, 160, 'area', { size: 14, fill: HI, anchor: 'start' }) +
      pizzaRim(95, 225, 35) + pizzaRim(270, 225, 70) +
      label(95, 230, '38 in²', { size: 12 }) + label(270, 231, '154 in²', { size: 16 }) +
      label(165, 231, '×4', { size: 18, fill: HI }),
  ),
  draw(
    'A 40-inch and a 50-inch TV screen drawn to scale: 1.25 times the size gives 1.56 times the screen area',
    label(200, 36, 'TV: 40 in vs 50 in', { size: 16, fill: HI }) +
      label(110, 75, 'size ×1.25', { size: 15, fill: SKY }) + label(290, 75, 'area ×1.56', { size: 15, fill: HI }) +
      rect(60, 125, 240, 135, HI, 'opacity="0.18"') + `<rect x="60" y="125" width="240" height="135" fill="none" stroke="${HI}" stroke-width="3"/>` +
      rect(60, 152, 192, 108, SKY, 'opacity="0.35"') + `<rect x="60" y="152" width="192" height="108" fill="none" stroke="${SKY}" stroke-width="3"/>` +
      line(60, 260, 300, 125, HI, 2, '6 5') + line(60, 260, 252, 152, SKY, 2, '6 5') +
      label(306, 120, '50 in', { size: 14, fill: HI, anchor: 'start' }) + label(246, 172, '40 in', { size: 13, fill: INK, anchor: 'end' }) +
      label(200, 300, '1.25 × 1.25 ≈ 1.56', { size: 14 }),
  ),
  draw(
    'Graph of size scale against growth: length grows as 1, 2, 3, 4 while area grows as 1, 4, 9, 16',
    label(200, 30, 'area grows with the SQUARE', { size: 16, fill: HI }) +
      line(60, 270, 370, 270, DIM, 2) + line(60, 270, 60, 60, DIM, 2) +
      polyline([1, 2, 3, 4].map((k) => [60 + k * 75, 270 - k * 12.5]), SKY, 3) +
      polyline(Array.from({ length: 31 }, (_, i) => { const k = 1 + i * 0.1; return [60 + k * 75, 270 - k * k * 12.5]; }), HI, 4) +
      [1, 2, 3, 4].map((k) => dot(60 + k * 75, 270 - k * k * 12.5, 6, HI) + dot(60 + k * 75, 270 - k * 12.5, 5, SKY) + label(60 + k * 75, 292, `×${k}`, { size: 13, fill: DIM })).join('') +
      label(285, 145, '9', { size: 14, fill: HI, anchor: 'end' }) + label(210, 210, '4', { size: 14, fill: HI, anchor: 'end' }) + label(345, 66, '16', { size: 14, fill: HI, anchor: 'end' }) +
      label(372, 232, '×4', { size: 13, fill: SKY, anchor: 'end' }) +
      label(80, 90, 'area', { size: 14, fill: HI, anchor: 'start' }) + label(80, 115, 'length', { size: 14, fill: SKY, anchor: 'start' }) +
      label(20, 300, 'size', { size: 12, fill: DIM, anchor: 'start' }),
  ),
];

// ── 5.F-6 · the Olympic running shortcut ───────────────────────────────────

const lightGrid = (x0: number, y0: number, x1: number, y1: number, step: number) => {
  let out = '';
  for (let x = x0; x <= x1; x += step) out += line(x, y0, x, y1, DIM, 1, '2 5');
  for (let y = y0; y <= y1; y += step) out += line(x0, y, x1, y, DIM, 1, '2 5');
  return out;
};

const SHORTCUT: MathFigure[] = [
  draw(
    'On a grid, the runner can go east 3 metres then north 4 metres, or cut straight across from A to B',
    lightGrid(60, 60, 260, 260, 40) +
      line(100, 260, 220, 260, SKY, 5) + line(220, 260, 220, 100, SKY, 5) +
      line(100, 260, 220, 100, HI, 4, '9 6') +
      dot(100, 260, 8, INK) + dot(220, 100, 8, INK) +
      label(86, 290, 'A', { size: 16 }) + label(220, 84, 'B', { size: 16 }) +
      label(160, 290, '3 m', { size: 14, fill: SKY }) + label(232, 185, '4 m', { size: 14, fill: SKY, anchor: 'start' }) +
      label(145, 168, '?', { size: 22, fill: HI }) +
      label(280, 140, 'the L', { size: 14, fill: SKY, anchor: 'start' }) + label(280, 165, 'or the', { size: 14, fill: DIM, anchor: 'start' }) +
      label(280, 190, 'diagonal', { size: 14, fill: HI, anchor: 'start' }),
  ),
  draw(
    'The L path unrolled is 3 plus 4 equals 7 metres; the diagonal is shorter by an unknown amount',
    label(40, 80, 'L path: 3 + 4 = 7 m', { size: 15, fill: SKY, anchor: 'start' }) +
      rect(40, 95, 120, 30, SKY, 'rx="3"') + rect(160, 95, 160, 30, OK, 'rx="3" opacity="0.8"') +
      Array.from({ length: 8 }, (_, i) => line(40 + i * 40, 92, 40 + i * 40, 128, DARK, 2) + label(40 + i * 40, 148, String(i), { size: 12, fill: DIM })).join('') +
      label(40, 200, 'diagonal: ? m', { size: 15, fill: HI, anchor: 'start' }) +
      `<rect x="40" y="215" width="200" height="30" rx="3" fill="${HI}" opacity="0.25" stroke="${HI}" stroke-width="2.5" stroke-dasharray="7 5"/>` +
      label(140, 236, 'shorter...', { size: 13 }) +
      line(320, 210, 320, 250, DIM, 2, '4 4') +
      label(285, 236, '?', { size: 20, fill: HI }) +
      label(200, 295, 'but by exactly how much?', { size: 14, fill: DIM }),
  ),
  draw(
    'A 3-4-5 right triangle with squares on each side: 9 plus 16 equals 25',
    poly([[120, 190], [180, 110], [100, 50], [40, 130]], HI, 'opacity="0.35"') +
      rect(120, 190, 60, 60, SKY, 'opacity="0.45"') + rect(180, 110, 80, 80, OK, 'opacity="0.45"') +
      poly([[120, 190], [180, 190], [180, 110]], 'none', `stroke="${INK}" stroke-width="3"`) +
      rightAngle(180, 190, -1, -1) +
      label(150, 226, '3²=9', { size: 14 }) + label(220, 156, '4²=16', { size: 14 }) + label(110, 126, '5²=25', { size: 15 }) +
      label(330, 120, '9 + 16 = 25', { size: 16 }) + label(330, 160, '√25 = 5', { size: 16 }) +
      label(330, 210, 'diagonal = 5 m', { size: 15, fill: HI }) + label(330, 250, 'saves 7 − 5 = 2', { size: 13, fill: OK }),
  ),
  draw(
    'A coordinate plane with points (0, 0) and (3, 4): 3 right and 4 up are the legs, the distance 5 is the hypotenuse',
    line(70, 270, 360, 270, DIM, 2) + line(70, 270, 70, 40, DIM, 2) +
      [1, 2, 3, 4, 5].map((k) => line(70 + k * 50, 265, 70 + k * 50, 275, DIM, 2) + label(70 + k * 50, 292, String(k), { size: 12, fill: DIM })).join('') +
      [1, 2, 3, 4].map((k) => line(65, 270 - k * 50, 75, 270 - k * 50, DIM, 2) + label(56, 274 - k * 50, String(k), { size: 12, fill: DIM, anchor: 'end' })).join('') +
      line(70, 270, 220, 270, SKY, 5) + line(220, 270, 220, 70, OK, 5) + line(70, 270, 220, 70, HI, 4) +
      rightAngle(220, 270, -1, -1) +
      dot(70, 270, 7, INK) + dot(220, 70, 7, INK) +
      label(232, 66, '(3, 4)', { size: 14, anchor: 'start' }) +
      label(165, 255, '3 right', { size: 13, fill: SKY }) + label(232, 175, '4 up', { size: 13, fill: OK, anchor: 'start' }) +
      label(130, 160, '5', { size: 18, fill: HI, anchor: 'end' }) +
      label(300, 130, 'distance = 5', { size: 15, fill: HI }),
  ),
  draw(
    'A 3-4-5 right triangle inside a 6-8-10 right triangle sharing a corner: the same shape doubled',
    poly([[60, 270], [192, 270], [192, 94]], HI, `opacity="0.2" stroke="${HI}" stroke-width="3"`) +
      poly([[60, 270], [126, 270], [126, 182]], SKY, `opacity="0.5" stroke="${SKY}" stroke-width="3"`) +
      rightAngle(192, 270, -1, -1) + rightAngle(126, 270, -1, -1, 12, SKY) +
      label(93, 292, '3', { size: 14, fill: SKY }) + label(160, 292, '6', { size: 14, fill: HI }) +
      label(114, 236, '4', { size: 14, fill: SKY, anchor: 'end' }) + label(204, 186, '8', { size: 14, fill: HI, anchor: 'start' }) +
      label(80, 214, '5', { size: 14, fill: SKY, anchor: 'end' }) + label(110, 156, '10', { size: 14, fill: HI, anchor: 'end' }) +
      label(305, 110, '36 + 64 = 100', { size: 14 }) + label(305, 140, '√100 = 10', { size: 15, fill: HI }) +
      label(305, 200, '3-4-5 × 2', { size: 14, fill: SKY }) + label(305, 225, '= 6-8-10', { size: 14, fill: HI }),
  ),
  draw(
    'Left: legs 3 and 4 meeting at a right angle give a third side of 5. Right: legs 3 and 4 meeting at 120 degrees give about 6.1, not 5',
    label(100, 50, 'right angle', { size: 15, fill: OK }) + label(300, 50, 'no right angle', { size: 15, fill: NO }) +
      line(200, 70, 200, 300, DIM, 1.5, '4 6') +
      poly([[40, 240], [115, 240], [115, 140]], 'none', `stroke="${INK}" stroke-width="3"`) + line(40, 240, 115, 140, OK, 4) +
      rightAngle(115, 240, -1, -1) +
      label(78, 260, '3', { size: 14 }) + label(127, 195, '4', { size: 14, anchor: 'start' }) + label(66, 182, '5', { size: 15, fill: OK, anchor: 'end' }) +
      poly([[225, 240], [300, 240], [350, 153.4]], 'none', `stroke="${INK}" stroke-width="3"`) + line(225, 240, 350, 153.4, NO, 4) +
      arc(300, 240, 18, 0, 60, HI, 2.5) + arc(300, 240, 18, 60, 120, HI, 2.5) +
      label(262, 260, '3', { size: 14 }) + label(337, 210, '4', { size: 14, anchor: 'start' }) +
      label(300, 274, '120°', { size: 12, fill: HI }) +
      label(100, 296, 'side = 5', { size: 15, fill: OK }) + label(300, 300, 'side ≈ 6.1', { size: 15, fill: NO }),
  ),
  tex(
    [
      '3 + 4 = 7 \\quad \\text{(the L, not the diagonal)}',
      '3^2 + 4^2 = 9 + 16 = 25',
      '\\sqrt{25} = 5 < 7',
    ],
    'Square, add, then take the root',
  ),
  draw(
    'A game screen with two characters 12 pixels across and 5 up: the distance between them is 13',
    `<rect x="40" y="50" width="320" height="240" rx="12" fill="none" stroke="${DIM}" stroke-width="3"/>` +
      lightGrid(80, 110, 320, 250, 20) +
      line(80, 250, 320, 250, SKY, 4) + line(320, 250, 320, 150, OK, 4) + line(80, 250, 320, 150, HI, 4) +
      rightAngle(320, 250, -1, -1) +
      dot(80, 250, 12, SKY) + dot(320, 150, 12, NO) +
      label(200, 274, '12', { size: 15, fill: SKY }) + label(334, 205, '5', { size: 15, fill: OK, anchor: 'start' }) +
      label(185, 192, '13', { size: 16, fill: HI }) +
      label(200, 86, '√(144 + 25) = √169 = 13', { size: 15, fill: HI }),
  ),
  draw(
    'Paired bars: legs 3 and 4 give an L of 7 but a diagonal of 5; legs 6 and 8 give 14 versus 10; legs 5 and 12 give 17 versus 13',
    label(120, 36, 'L path', { size: 14, fill: NO }) + label(260, 36, 'diagonal', { size: 14, fill: OK }) +
      rect(80, 26, 14, 14, NO, 'rx="2"') + rect(205, 26, 14, 14, OK, 'rx="2"') +
      line(30, 260, 370, 260, DIM, 2) +
      [[3, 4], [6, 8], [5, 12]].map(([a, b], i) => {
        const cx = 85 + i * 115;
        const L = a + b;
        const d = Math.hypot(a, b);
        const h = (v: number) => (v / 17) * 180;
        return rect(cx - 36, 260 - h(L), 32, h(L), NO, 'rx="3"') + rect(cx + 4, 260 - h(d), 32, h(d), OK, 'rx="3"') +
          label(cx - 20, 252 - h(L), String(L), { size: 13, fill: NO }) + label(cx + 20, 252 - h(d), String(d), { size: 13, fill: OK }) +
          label(cx, 282, `legs ${a}, ${b}`, { size: 13, fill: DIM });
      }).join('') +
      label(200, 308, 'the diagonal always wins', { size: 13, fill: HI }),
  ),
];

// ── 6.RP-2 · baseball batting average ──────────────────────────────────────

const BATTING: MathFigure[] = [
  draw(
    'A number line from 0 to 1 with .300 marked at three tenths of the way',
    label(200, 60, '“batting three hundred” = .300', { size: 15, fill: HI }) +
      line(50, 180, 350, 180, INK, 3) +
      Array.from({ length: 11 }, (_, i) => line(50 + i * 30, i % 5 === 0 ? 168 : 173, 50 + i * 30, i % 5 === 0 ? 192 : 187, INK, 2)).join('') +
      label(50, 215, '0', { size: 14 }) + label(200, 215, '0.5', { size: 14 }) + label(350, 215, '1', { size: 14 }) +
      dot(140, 180, 9, HI) + line(140, 170, 140, 140, HI, 2) + label(140, 128, '0.300', { size: 18, fill: HI }) +
      label(200, 270, 'less than 1, so not 300 of anything', { size: 13, fill: DIM }),
  ),
  draw(
    'A bar of 500 at-bats split into ten blocks of 50, three blocks shaded for 150 hits: 150 divided by 500 is 0.300',
    label(200, 50, 'hits ÷ at-bats', { size: 18, fill: HI }) +
      label(200, 112, '500 at-bats', { size: 14 }) +
      Array.from({ length: 10 }, (_, i) => rect(40 + i * 32 + 1, 125, 30, 50, i < 3 ? HI : DIM, i < 3 ? 'rx="3"' : 'rx="3" opacity="0.35"') + label(56 + i * 32, 155, '50', { size: 11, fill: i < 3 ? DARK : INK })).join('') +
      line(41, 190, 135, 190, HI, 2.5) + label(88, 212, '150 hits', { size: 14, fill: HI }) +
      label(200, 272, '150 ÷ 500 = 0.300', { size: 18, fill: OK }),
  ),
  draw(
    'A ratio table scaling 150 hits in 500 at-bats down to 30 in 100, 3 in 10, and 0.3 hits in 1 at-bat',
    label(150, 60, 'at-bats', { size: 15, fill: DIM }) + label(260, 60, 'hits', { size: 15, fill: DIM }) +
      rect(95, 232, 220, 34, HI, 'rx="6" opacity="0.25"') +
      [['500', '150'], ['100', '30'], ['10', '3'], ['1', '0.3']].map(([a, h], i) => label(150, 105 + i * 50, a, { size: 18, fill: i === 3 ? HI : INK }) + label(260, 105 + i * 50, h, { size: 18, fill: i === 3 ? HI : INK })).join('') +
      ['÷5', '÷10', '÷10'].map((t, i) => arrow(95, 95 + i * 50, 95, 133 + i * 50, SKY, 2) + label(84, 120 + i * 50, t, { size: 13, fill: SKY, anchor: 'end' }) + arrow(315, 95 + i * 50, 315, 133 + i * 50, SKY, 2) + label(326, 120 + i * 50, t, { size: 13, fill: SKY, anchor: 'start' })).join('') +
      label(200, 300, '0.3 hits per ONE at-bat', { size: 15, fill: HI }),
  ),
  draw(
    'Strips comparing a typical hitter, 1 hit in 4 tries, with an elite hitter, 3 hits in 10 tries',
    label(50, 75, 'typical: 1 in 4 = .250', { size: 15, fill: SKY, anchor: 'start' }) +
      Array.from({ length: 4 }, (_, i) => rect(50 + i * 75 + 2, 90, 71, 40, SKY, i < 1 ? 'rx="4"' : 'rx="4" opacity="0.2"')).join('') +
      label(50, 180, 'elite: 3 in 10 = .300', { size: 15, fill: HI, anchor: 'start' }) +
      Array.from({ length: 10 }, (_, i) => rect(50 + i * 30 + 2, 195, 26, 40, HI, i < 3 ? 'rx="3"' : 'rx="3" opacity="0.2"')).join('') +
      label(200, 285, '.300 > .250', { size: 18, fill: OK }),
  ),
  draw(
    'Horizontal bars: Player A has 90 hits in 300 at-bats, 0.300; Player B has 120 hits in 480 at-bats, 0.250',
    label(60, 88, 'A: 90 hits in 300', { size: 14, anchor: 'start' }) +
      `<rect x="60" y="100" width="187.5" height="40" rx="4" fill="none" stroke="${DIM}" stroke-width="2"/>` + rect(60, 100, 56.25, 40, HI, 'rx="4"') +
      label(262, 127, '0.300', { size: 18, fill: HI, anchor: 'start' }) +
      label(60, 188, 'B: 120 hits in 480', { size: 14, anchor: 'start' }) +
      `<rect x="60" y="200" width="300" height="40" rx="4" fill="none" stroke="${DIM}" stroke-width="2"/>` + rect(60, 200, 75, 40, SKY, 'rx="4"') +
      label(360, 268, '0.250', { size: 18, fill: SKY, anchor: 'end' }) +
      label(30, 127, 'A', { size: 16, fill: HI }) + label(30, 227, 'B', { size: 16, fill: SKY }) +
      label(60, 268, 'shaded = hits', { size: 12, fill: DIM, anchor: 'start' }) +
      label(200, 305, 'A is better per try', { size: 14, fill: OK }),
  ),
  tex(
    [
      '\\text{per one} = \\text{total} \\div \\text{count}',
      '\\$3.00 \\div 12 \\text{ oz} = \\$0.25 \\text{ per oz}',
      '84 \\text{ points} \\div 4 \\text{ games} = 21 \\text{ per game}',
      '300 \\text{ km} \\div 20 \\text{ L} = 15 \\text{ km per L}',
    ],
    'Divide the total by the count',
  ),
  draw(
    'Two bar charts: by total hits B looks better, 120 to 90; per at-bat A is better, 0.300 to 0.250',
    label(110, 50, 'total hits', { size: 14, fill: DIM }) + label(290, 50, 'hits per at-bat', { size: 14, fill: DIM }) +
      line(200, 60, 200, 300, DIM, 1.5, '4 6') +
      bars([{ v: 90, name: 'A', fill: HI }, { v: 120, name: 'B', fill: SKY }], { x0: 30, x1: 190, base: 250, top: 90, max: 120 }) +
      bars([{ v: 0.3, name: 'A', fill: HI, val: '.300' }, { v: 0.25, name: 'B', fill: SKY, val: '.250' }], { x0: 210, x1: 370, base: 250, top: 90, max: 0.3 }) +
      label(110, 300, 'B wins?', { size: 15, fill: NO }) + label(290, 300, 'A wins', { size: 15, fill: OK }),
  ),
  draw(
    'A hundred-grid with 30 squares shaded: 0.300 times 100 is 30, so .300 is 30 percent',
    label(200, 45, 'batting .300 = 30%', { size: 17, fill: HI }) +
      hundred(40, 80, 17, 30, HI) +
      label(300, 120, '0.300 × 100 = 30', { size: 14 }) +
      label(300, 165, '30 of 100 squares', { size: 13, fill: DIM }) +
      label(300, 220, '= 30%', { size: 24, fill: OK }),
  ),
  draw(
    'A double number line: 1, 5 and 10 at-bats line up with 0.3, 1.5 and 3 hits',
    label(200, 50, 'per ONE: 0.3 hits per at-bat', { size: 16, fill: HI }) +
      line(80, 130, 360, 130, OK, 3) + line(80, 210, 360, 210, SKY, 3) +
      label(15, 135, 'hits', { size: 13, fill: OK, anchor: 'start' }) + label(15, 215, 'at-bats', { size: 13, fill: SKY, anchor: 'start' }) +
      rect(94, 100, 28, 140, HI, 'rx="6" opacity="0.25"') +
      [[0, '0', '0'], [1, '0.3', '1'], [5, '1.5', '5'], [10, '3', '10']].map(([k, h, a]) => {
        const x = 80 + Number(k) * 28;
        return line(x, 122, x, 138, OK, 2.5) + line(x, 202, x, 218, SKY, 2.5) + line(x, 140, x, 200, DIM, 1.5, '3 4') +
          label(x, 112, String(h), { size: 14, fill: k === 1 ? HI : INK }) + label(x, 240, String(a), { size: 14, fill: k === 1 ? HI : INK });
      }).join('') +
      label(200, 290, 'unit rate: how much for ONE', { size: 14, fill: DIM }),
  ),
];

// ── 6.RP-4 · Turing's secret codes ─────────────────────────────────────────

const ENGLISH = [['E', 13], ['T', 9], ['A', 8], ['O', 7.5], ['I', 7], ['N', 6.7]] as const;

function profile(x0: number, values: number[], fill: string): string {
  const slot = 160 / 6;
  const h = (v: number) => (v / 14) * 130;
  let out = line(x0, 240, x0 + 160, 240, DIM, 2);
  values.forEach((v, i) => {
    const cx = x0 + slot * (i + 0.5);
    out += rect(cx - 8, 240 - h(v), 16, h(v), fill, 'rx="2"');
    out += line(cx - 12, 240 - h(ENGLISH[i][1]), cx + 12, 240 - h(ENGLISH[i][1]), HI, 2.5, '4 3');
    out += label(cx, 258, ENGLISH[i][0], { size: 12, fill: DIM });
  });
  return out;
}

const TURING: MathFigure[] = [
  draw(
    'Three Enigma rotors with 26 positions each: 26 times 26 times 26 is 17,576 settings for the wheels alone',
    label(200, 45, 'Enigma’s wheels', { size: 16, fill: HI }) +
      [90, 200, 310].map((cx) => `<circle cx="${cx}" cy="140" r="44" fill="none" stroke="${SKY}" stroke-width="4"/>` +
        Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * 2 * Math.PI; return line(cx + 36 * Math.sin(a), 140 - 36 * Math.cos(a), cx + 44 * Math.sin(a), 140 - 44 * Math.cos(a), SKY, 1.5); }).join('') +
        label(cx, 148, '26', { size: 22 })).join('') +
      label(145, 148, '×', { size: 18, fill: DIM }) + label(255, 148, '×', { size: 18, fill: DIM }) +
      label(200, 225, '26 × 26 × 26 = 17,576', { size: 17, fill: OK }) +
      label(200, 270, 'plus plugs and wheel order:', { size: 13, fill: DIM }) +
      label(200, 295, 'billions of settings', { size: 15, fill: HI }),
  ),
  draw(
    'Bar chart of English letter frequency: E 13 percent, T 9, A 8, O, I and N about 7, and Z almost zero',
    label(200, 36, 'how often each letter appears', { size: 15, fill: HI }) +
      bars(
        [
          { v: 13, name: 'E', fill: HI, val: '13%' },
          { v: 9, name: 'T', val: '9%' },
          { v: 8, name: 'A', val: '8%' },
          { v: 7.5, name: 'O', val: '' },
          { v: 7, name: 'I', val: '' },
          { v: 6.7, name: 'N', val: '' },
          { v: 0.1, name: 'Z', fill: NO, val: '0.1%' },
        ],
        { x0: 30, x1: 370, top: 80, max: 13, nameSize: 15 },
      ) +
      label(200, 305, 'in English text', { size: 13, fill: DIM }),
  ),
  draw(
    'Two letter-count charts against the dashed English pattern: a wrong setting gives a mismatched profile, the right setting matches',
    label(100, 60, 'wrong setting', { size: 15, fill: NO }) + label(300, 60, 'right setting', { size: 15, fill: OK }) +
      profile(20, [4, 10, 3, 6, 2, 8], NO) + profile(220, [12.5, 9.4, 7.8, 7.7, 6.8, 6.9], OK) +
      label(100, 290, 'no match', { size: 14, fill: NO }) + label(300, 290, 'fingerprint!', { size: 14, fill: OK }) +
      label(200, 34, 'dashes = English ratios', { size: 13, fill: HI }),
  ),
  draw(
    'A timeline of the Second World War from 1939 to 1945, with an estimated two or more extra years without codebreaking',
    line(40, 170, 360, 170, DIM, 3) +
      rect(240, 158, 60, 24, NO, 'opacity="0.35"') + line(240, 170, 300, 170, NO, 3, '6 5') +
      [[1939, 'war begins', false], [1945, 'war ends', true], [1947, 'without? (est.)', false]].map(([yr, t, hi], i) => {
        const x = 60 + (Number(yr) - 1939) * 30;
        const up = i !== 2;
        return dot(x, 170, hi ? 9 : 6, hi ? OK : INK) + line(x, 170, x, up ? 120 : 220, hi ? OK : DIM, 2) +
          label(x, up ? 108 : 244, String(t), { size: 13, fill: hi ? OK : i === 2 ? NO : INK }) + label(x, up ? 90 : 262, String(yr), { size: 13, fill: DIM });
      }).join('') +
      label(270, 205, '2+ yrs', { size: 13, fill: HI }) +
      label(200, 40, 'counting letters shortened the war', { size: 14, fill: HI }),
  ),
  draw(
    'A grid of 100 letters with 13 marked as E and 2 marked as Z',
    hundred(30, 70, 18, 0, DIM) +
      [3, 11, 17, 24, 30, 38, 45, 52, 59, 66, 74, 83, 91].map((i) => rect(30 + (i % 10) * 18 + 1, 70 + Math.floor(i / 10) * 18 + 1, 16, 16, HI) + label(39 + (i % 10) * 18, 83 + Math.floor(i / 10) * 18, 'E', { size: 11, fill: DARK })).join('') +
      [47, 78].map((i) => rect(30 + (i % 10) * 18 + 1, 70 + Math.floor(i / 10) * 18 + 1, 16, 16, NO) + label(39 + (i % 10) * 18, 83 + Math.floor(i / 10) * 18, 'Z', { size: 11, fill: DARK })).join('') +
      label(200, 40, 'tally 100 letters', { size: 15, fill: HI }) +
      label(300, 120, 'E: 13 of 100', { size: 15, fill: HI }) + label(300, 150, '= 13%', { size: 15, fill: HI }) +
      label(300, 210, 'Z: only 1 or 2', { size: 15, fill: NO }) +
      label(120, 285, '100 letters', { size: 13, fill: DIM }),
  ),
  draw(
    'Line chart of the share of E as the sample grows from 10 to 10,000 letters: it swings wildly at first, then settles at 13 percent',
    label(200, 34, 'share of E as the sample grows', { size: 14, fill: HI }) +
      line(60, 260, 360, 260, DIM, 2) + line(60, 260, 60, 60, DIM, 2) +
      line(60, 260 - 13 * 4.75, 360, 260 - 13 * 4.75, OK, 2, '6 5') + label(52, 202, '13%', { size: 12, fill: OK, anchor: 'end' }) +
      label(52, 264, '0%', { size: 12, fill: DIM, anchor: 'end' }) + label(52, 74, '40%', { size: 12, fill: DIM, anchor: 'end' }) +
      polyline([[10, 30], [30, 3], [100, 9], [300, 15.7], [1000, 12.4], [3000, 13.3], [10000, 12.9]].map(([s, p]) => [70 + ((Math.log10(s) - 1) / 3) * 280, 260 - p * 4.75]), SKY, 3) +
      [[10, 30], [30, 3], [100, 9], [300, 15.7], [1000, 12.4], [3000, 13.3], [10000, 12.9]].map(([s, p]) => dot(70 + ((Math.log10(s) - 1) / 3) * 280, 260 - p * 4.75, 5, s < 50 ? NO : SKY)).join('') +
      [[10, '10'], [100, '100'], [1000, '1,000'], [10000, '10,000']].map(([s, t]) => label(70 + ((Math.log10(Number(s)) - 1) / 3) * 280, 282, String(t), { size: 12, fill: DIM })).join('') +
      label(84, 116, 'tiny sample: 30%?', { size: 13, fill: NO, anchor: 'start' }) +
      label(330, 175, 'steady', { size: 13, fill: OK }) +
      label(215, 308, 'letters in sample', { size: 12, fill: DIM }),
  ),
  draw(
    'The word fizz has 2 Zs out of 4 letters, 50 percent, while English overall has about 0.1 percent Z',
    ['F', 'I', 'Z', 'Z'].map((c, i) => rect(110 + i * 48, 62, 40, 48, c === 'Z' ? NO : DIM, c === 'Z' ? 'rx="6"' : 'rx="6" opacity="0.3"') + label(130 + i * 48, 95, c, { size: 22, fill: c === 'Z' ? DARK : INK })).join('') +
      label(200, 40, '2 of 4 letters are Z', { size: 15, fill: HI }) +
      label(110, 192, 'fizz', { size: 14, anchor: 'end' }) + rect(120, 175, 200, 26, NO, 'rx="3"') + label(330, 194, '50%', { size: 15, fill: NO, anchor: 'start' }) +
      label(110, 247, 'English', { size: 14, anchor: 'end' }) + rect(120, 230, 2, 26, SKY) + label(132, 249, '≈ 0.1%', { size: 15, fill: SKY, anchor: 'start' }) +
      label(200, 296, 'small sample, loud wrong claim', { size: 14, fill: DIM }),
  ),
  draw(
    'A monitoring chart: a ratio stays inside the expected band for nine days, then jumps far above it and is flagged',
    label(200, 36, 'expected ratio vs what we see', { size: 14, fill: HI }) +
      rect(60, 260 - 7 * 9, 300, 4 * 9, OK, 'opacity="0.18"') +
      label(66, 210, 'expected', { size: 12, fill: OK, anchor: 'start' }) +
      line(60, 260, 360, 260, DIM, 2) + line(60, 260, 60, 60, DIM, 2) +
      polyline([5, 6, 5, 4, 6, 5, 5, 6, 5, 17, 19, 6].map((v, i) => [75 + i * 25, 260 - v * 9]), SKY, 3) +
      [5, 6, 5, 4, 6, 5, 5, 6, 5, 17, 19, 6].map((v, i) => dot(75 + i * 25, 260 - v * 9, v > 7 ? 7 : 4, v > 7 ? NO : SKY)).join('') +
      label(300, 76, 'drift: flag it!', { size: 14, fill: NO }) +
      label(210, 285, 'day', { size: 12, fill: DIM }),
  ),
  draw(
    'A bar of 100 letters split into 13 E and 87 other letters: the ratio E to everything else is 13 to 87',
    label(200, 50, 'in every 100 letters', { size: 15, fill: DIM }) +
      rect(40, 100, 41.6, 60, HI, 'rx="3"') + rect(83, 100, 277, 60, SKY, 'rx="3" opacity="0.5"') +
      label(61, 136, 'E', { size: 18, fill: DARK }) + label(221, 136, 'everything else', { size: 15 }) +
      label(61, 186, '13', { size: 16, fill: HI }) + label(221, 186, '87', { size: 16, fill: SKY }) +
      label(200, 240, 'E : rest = 13 : 87', { size: 20, fill: HI }) +
      label(200, 280, 'about 1 : 7, a clue', { size: 14, fill: OK }),
  ),
];

// ── 6.RP-5 · soccer penalty kicks ──────────────────────────────────────────

const KICKS = Array.from({ length: 20 }, (_, i) => ![0, 1, 8, 13, 17].includes(i));

const PENALTY: MathFigure[] = [
  draw(
    'Top view of a goal 8 yards wide with the penalty spot 12 yards out',
    line(30, 60, 370, 60, INK, 3) +
      `<rect x="140" y="42" width="120" height="18" fill="${DIM}" fill-opacity="0.25" stroke="${INK}" stroke-width="3"/>` +
      line(140, 32, 260, 32, DIM, 1.5) + label(200, 26, '8 yd', { size: 13, fill: DIM }) +
      rect(185, 64, 30, 10, SKY, 'rx="4"') +
      line(110, 60, 110, 240, HI, 2) + line(102, 60, 118, 60, HI, 2) + line(102, 240, 118, 240, HI, 2) +
      label(100, 156, '12 yd', { size: 15, fill: HI, anchor: 'end' }) +
      line(200, 240, 200, 80, DIM, 1.5, '5 6') +
      dot(200, 240, 9, INK) +
      label(200, 272, 'penalty spot', { size: 13, fill: DIM }) +
      label(310, 170, 'scored ≈ 75%', { size: 15, fill: OK }),
  ),
  draw(
    'Front view of the goal in three zones: the keeper dives left before the kick while the ball goes right',
    label(200, 40, 'keeper must guess BEFORE the kick', { size: 14, fill: HI }) +
      `<rect x="60" y="110" width="280" height="110" fill="none" stroke="${INK}" stroke-width="4"/>` +
      line(153, 110, 153, 220, DIM, 1.5, '5 5') + line(247, 110, 247, 220, DIM, 1.5, '5 5') +
      label(107, 100, 'left', { size: 13, fill: DIM }) + label(200, 100, 'middle', { size: 13, fill: DIM }) + label(293, 100, 'right', { size: 13, fill: DIM }) +
      soldier(200, 200, SKY) + arrow(185, 190, 95, 190, NO, 3) + label(125, 212, 'dive', { size: 13, fill: NO }) +
      dot(200, 290, 9, INK) + arrow(206, 282, 300, 150, OK, 3) + label(310, 145, 'goal', { size: 13, fill: OK, anchor: 'start' }) +
      label(300, 300, 'wrong guess', { size: 13, fill: NO }),
  ),
  draw(
    'Four kicks, three goals and one miss, beside a strip shaded 75 percent: 3 out of 4 is 75 out of 100',
    [0, 1, 2, 3].map((i) => dot(80 + i * 80, 100, 26, i < 3 ? OK : 'none', i < 3 ? '' : `stroke="${NO}" stroke-width="3"`) + label(80 + i * 80, 150, i < 3 ? 'goal' : 'miss', { size: 13, fill: i < 3 ? OK : NO })).join('') +
      rect(50, 190, 225, 30, OK, 'rx="3"') + `<rect x="50" y="190" width="300" height="30" rx="3" fill="none" stroke="${INK}" stroke-width="2"/>` +
      [125, 200, 275].map((x) => line(x, 190, x, 220, DARK, 2)).join('') +
      label(50, 240, '0%', { size: 12, fill: DIM }) + label(275, 240, '75%', { size: 12, fill: OK }) + label(350, 240, '100%', { size: 12, fill: DIM }) +
      label(200, 285, '3/4 = 75/100 = 75%', { size: 18, fill: HI }),
  ),
  draw(
    'A pie chart: 75 percent of penalties scored, 25 percent saved by the keeper',
    wedge(150, 170, 100, 90, 360, OK, 'opacity="0.75"') + wedge(150, 170, 100, 0, 90, NO) +
      `<circle cx="150" cy="170" r="100" fill="none" stroke="${INK}" stroke-width="2"/>` +
      label(118, 210, '75% scored', { size: 14, fill: DARK }) + label(190, 140, '25%', { size: 16, fill: DARK }) +
      label(325, 120, 'saves', { size: 14, fill: DIM }) + label(325, 160, '1 in 4', { size: 22, fill: NO }) + label(325, 195, '= 25%', { size: 16, fill: NO }),
  ),
  draw(
    'Eight penalty kicks, six of them shaded as expected goals: 0.75 times 8 is 6',
    label(200, 45, '8 penalties at 75%', { size: 16, fill: DIM }) +
      Array.from({ length: 8 }, (_, i) => dot(80 + (i % 4) * 80, 100 + Math.floor(i / 4) * 75, 26, i < 6 ? OK : 'none', i < 6 ? '' : `stroke="${DIM}" stroke-width="3"`)).join('') +
      Array.from({ length: 6 }, (_, i) => label(80 + (i % 4) * 80, 106 + Math.floor(i / 4) * 75, String(i + 1), { size: 16, fill: DARK })).join('') +
      label(200, 255, '0.75 × 8 = 6 goals', { size: 20, fill: HI }) +
      label(200, 292, 'rate × chances = prediction', { size: 13, fill: DIM }),
  ),
  tex(
    [
      '75\\% = \\frac{75}{100} = \\frac{3}{4} = 0.75',
      '\\tfrac{3}{4} \\text{ of } 8 = 6 \\qquad 0.75 \\times 8 = 6',
    ],
    'One number, three costumes',
  ),
  draw(
    'Twenty kicks by a 75 percent kicker: two misses in a row at the start, but 15 goals out of 20 over the season',
    label(200, 40, 'one 75% kicker, 20 kicks', { size: 15, fill: HI }) +
      line(29, 96, 86, 96, NO, 2.5) + label(29, 84, '2 misses in a row', { size: 13, fill: NO, anchor: 'start' }) +
      KICKS.map((g, i) => dot(40 + (i % 10) * 35, 120 + Math.floor(i / 10) * 50, 13, g ? OK : 'none', g ? '' : `stroke="${NO}" stroke-width="3"`)).join('') +
      label(200, 235, 'first 4 kicks: 2 of 4 = 50%', { size: 13, fill: NO }) +
      label(200, 275, 'all 20: 15 of 20 = 75%', { size: 16, fill: OK }),
  ),
  draw(
    'A goal split into six zones showing where one kicker put the last 20 penalties: 45 percent low left',
    label(200, 45, 'one kicker’s last 20 penalties', { size: 14, fill: HI }) +
      [[2, 1, 1], [9, 2, 5]].map((row, r) => row.map((c, k) => {
        const pct = (c / 20) * 100;
        return rect(60 + k * 93.3 + 3, 85 + r * 75 + 3, 87.3, 69, HI, `rx="4" opacity="${(0.12 + pct / 60).toFixed(2)}"`) +
          label(60 + k * 93.3 + 46.7, 85 + r * 75 + 44, `${pct}%`, { size: 17, fill: pct >= 25 ? DARK : INK });
      }).join('')).join('') +
      `<rect x="60" y="85" width="280" height="150" fill="none" stroke="${INK}" stroke-width="4"/>` +
      label(200, 270, 'keeper’s best guess: low left', { size: 14, fill: OK }) +
      label(200, 300, '9 of 20 = 45%', { size: 14, fill: DIM }),
  ),
  draw(
    'A hundred-grid with 75 squares shaded: 75 out of 100 is 75 percent, the same as 3 in 4',
    label(200, 45, 'percent = out of 100', { size: 17, fill: HI }) +
      hundred(40, 80, 17, 75, OK) +
      label(300, 125, '75 out of 100', { size: 15 }) +
      label(300, 175, '= 75%', { size: 24, fill: HI }) +
      label(300, 220, '= 3 in 4', { size: 15, fill: SKY }),
  ),
];

// ── 6.SP-1 · tic-tac-toe strategy ──────────────────────────────────────────

const LINES: [number, number][] = [[0, 2], [3, 5], [6, 8], [0, 6], [1, 7], [2, 8], [0, 8], [2, 6]];

const TICTAC: MathFigure[] = [
  draw(
    'A tic-tac-toe board with X in the centre square as the first move',
    label(200, 40, 'move 1: the center', { size: 16, fill: HI }) +
      board(110, 70, 180, { fill: { 4: '#fbbf2433' } }) + xMark(200, 160, 18) +
      label(200, 290, 'habit, or math?', { size: 14, fill: DIM }),
  ),
  draw(
    'All 8 winning lines on a tic-tac-toe board: 3 rows, 3 columns and 2 diagonals',
    board(110, 50, 180) +
      [0, 1, 2].map((r) => winLine(110, 50, 180, LINES[r][0], LINES[r][1], SKY, 4)).join('') +
      [3, 4, 5].map((c) => winLine(110, 50, 180, LINES[c][0], LINES[c][1], OK, 4)).join('') +
      [6, 7].map((d) => winLine(110, 50, 180, LINES[d][0], LINES[d][1], HI, 4)).join('') +
      label(110, 256, 'rows', { size: 13, fill: SKY }) + label(200, 256, 'columns', { size: 13, fill: OK }) + label(300, 256, 'diagonals', { size: 13, fill: HI }) +
      label(200, 292, '3 + 3 + 2 = 8 lines', { size: 18, fill: INK }),
  ),
  draw(
    'Each square scored by how many winning lines pass through it: corners 3, edges 2, centre 4',
    label(200, 36, 'winning lines through each square', { size: 14, fill: DIM }) +
      board(110, 55, 180, { text: { 0: ['3', OK], 1: ['2', SKY], 2: ['3', OK], 3: ['2', SKY], 4: ['4', HI], 5: ['2', SKY], 6: ['3', OK], 7: ['2', SKY], 8: ['3', OK] }, size: 30 }) +
      label(110, 275, 'corner 3', { size: 14, fill: OK }) + label(200, 275, 'center 4', { size: 14, fill: HI }) + label(290, 275, 'edge 2', { size: 14, fill: SKY }),
  ),
  draw(
    'Bar chart of winning lines per square: centre 4, corner 3, edge 2',
    label(200, 36, 'pick the highest count', { size: 15, fill: HI }) +
      bars(
        [
          { v: 4, name: 'center', fill: HI },
          { v: 3, name: 'corner', fill: OK },
          { v: 2, name: 'edge', fill: SKY },
        ],
        { x0: 40, x1: 360, top: 80, max: 4, valSize: 18 },
      ) +
      label(200, 305, 'winning lines', { size: 13, fill: DIM }),
  ),
  draw(
    'Left: the centre square lies on its row, its column and both diagonals, 4 lines. Right: a corner lies on a row, a column and one diagonal, 3 lines',
    label(105, 50, 'center: 4', { size: 16, fill: HI }) + label(295, 50, 'corner: 3', { size: 16, fill: OK }) +
      board(30, 75, 150, { fill: { 4: '#fbbf2455' } }) +
      [[3, 5], [1, 7], [0, 8], [2, 6]].map(([a, b]) => winLine(30, 75, 150, a, b, HI, 4)).join('') +
      board(220, 75, 150, { fill: { 0: '#34d39955' } }) +
      [[0, 2], [0, 6], [0, 8]].map(([a, b]) => winLine(220, 75, 150, a, b, OK, 4)).join('') +
      label(105, 262, 'row, column, 2 diags', { size: 12, fill: DIM }) + label(295, 262, 'row, column, 1 diag', { size: 12, fill: DIM }) +
      label(200, 300, '4 > 3', { size: 16, fill: INK }),
  ),
  draw(
    'After X takes the centre, O in a corner keeps 2 winning lines open, O on an edge keeps only 1',
    label(200, 34, 'X has the center. Where should O go?', { size: 13, fill: DIM }) +
      board(30, 70, 150) + xMark(105, 145, 12) + oMark(55, 95, 13) +
      winLine(30, 70, 150, 0, 2, OK, 4) + winLine(30, 70, 150, 0, 6, OK, 4) + winLine(30, 70, 150, 0, 8, NO, 3, '6 6') +
      board(220, 70, 150) + xMark(295, 145, 12) + oMark(295, 95, 13) +
      winLine(220, 70, 150, 0, 2, OK, 4) + winLine(220, 70, 150, 1, 7, NO, 3, '6 6') +
      label(105, 256, 'corner: 2 open', { size: 14, fill: OK }) + label(295, 256, 'edge: 1 open', { size: 14, fill: NO }) +
      label(200, 296, 'dashed = blocked by X', { size: 13, fill: DIM }),
  ),
  draw(
    'An edge square touches only 2 winning lines, fewer than a corner with 3 or the centre with 4',
    label(130, 45, 'looks central...', { size: 15, fill: DIM }) +
      board(40, 70, 180, { fill: { 1: '#f472b655' } }) +
      winLine(40, 70, 180, 0, 2, NO, 4) + winLine(40, 70, 180, 1, 7, NO, 4) +
      label(310, 120, 'edge: 2 lines', { size: 14, fill: NO }) + label(310, 160, 'corner: 3 lines', { size: 14, fill: OK }) +
      label(310, 200, 'center: 4 lines', { size: 14, fill: HI }) +
      label(200, 296, 'edges are the weakest squares', { size: 14, fill: NO }),
  ),
  draw(
    'The start of the tic-tac-toe game tree: 9 first moves, then 8 replies to each; 255,168 possible games in all',
    dot(240, 60, 9, HI) +
      Array.from({ length: 9 }, (_, i) => line(240, 60, 120 + i * 30, 130, DIM, 1.5) + dot(120 + i * 30, 130, 6, INK)).join('') +
      Array.from({ length: 8 }, (_, i) => line(240, 130, 140 + i * 30, 205, DIM, 1.5) + dot(140 + i * 30, 205, 5, SKY)).join('') +
      dot(240, 130, 8, HI) +
      label(15, 65, 'empty', { size: 13, fill: DIM, anchor: 'start' }) +
      label(15, 135, '9 moves', { size: 13, anchor: 'start' }) + label(15, 210, '8 replies', { size: 13, fill: SKY, anchor: 'start' }) +
      label(200, 255, '255,168 games in all', { size: 17, fill: HI }) +
      label(200, 292, 'perfect play every time: a draw', { size: 13, fill: OK }),
  ),
  draw(
    'Three small boards ranking the squares: centre on 4 lines, corner on 3, edge on 2',
    label(200, 40, 'count the options, pick the most', { size: 15, fill: HI }) +
      board(30, 100, 100, { fill: { 4: HI } }) + board(150, 100, 100, { fill: { 0: OK } }) + board(270, 100, 100, { fill: { 1: SKY } }) +
      label(80, 85, '4 lines', { size: 14, fill: HI }) + label(200, 85, '3 lines', { size: 14, fill: OK }) + label(320, 85, '2 lines', { size: 14, fill: SKY }) +
      label(80, 228, 'center', { size: 14 }) + label(200, 228, 'corner', { size: 14 }) + label(320, 228, 'edge', { size: 14 }) +
      label(140, 160, '>', { size: 20, fill: DIM }) + label(260, 160, '>', { size: 20, fill: DIM }) +
      label(200, 285, 'best first move: center', { size: 15, fill: OK }),
  ),
];

// ── 6.SP-4 · the birthday paradox ──────────────────────────────────────────

const dayX = (d: number) => 40 + (d / 365) * 320;
const dayLine = () =>
  line(40, 190, 360, 190, INK, 3) +
  [0, 100, 200, 300, 365].map((d) => line(dayX(d), 182, dayX(d), 198, INK, 2) + label(dayX(d), 220, String(d), { size: 12, fill: DIM })).join('') +
  label(200, 250, 'people in the room', { size: 13, fill: DIM });

const BIRTHDAY: MathFigure[] = [
  draw(
    'A number line from 0 to 365 people with a question mark: how many for a 50/50 chance of a shared birthday?',
    label(200, 50, 'how many people for a 50/50', { size: 15, fill: HI }) +
      label(200, 75, 'chance that two share a birthday?', { size: 14, fill: HI }) +
      dayLine() +
      label(200, 150, '?', { size: 34, fill: HI }) + arrow(200, 158, 200, 182, HI, 2.5) +
      label(200, 295, 'lock in your guess', { size: 14, fill: OK }),
  ),
  draw(
    'On the 0 to 365 number line most people guess about 180, half of 365, but the true answer is far smaller',
    label(200, 50, 'most guess half of 365', { size: 15, fill: DIM }) +
      dayLine() +
      dot(dayX(180), 190, 9, NO) + line(dayX(180), 180, dayX(180), 130, NO, 2) + label(dayX(180), 118, '≈ 180', { size: 16, fill: NO }) +
      arrow(dayX(170), 160, dayX(30), 160, OK, 3) + label(105, 148, 'way smaller!', { size: 14, fill: OK }) +
      label(200, 295, '365 ÷ 2 ≈ 183 is the wrong idea', { size: 13, fill: NO }),
  ),
  draw(
    '23 people around a circle with a line for every pair: 23 times 22 divided by 2 is 253 pairs',
    (() => {
      const pts = Array.from({ length: 23 }, (_, i) => [140 + 110 * Math.sin((i / 23) * 2 * Math.PI), 165 - 110 * Math.cos((i / 23) * 2 * Math.PI)] as [number, number]);
      let out = '';
      for (let i = 0; i < 23; i++) for (let j = i + 1; j < 23; j++) out += `<line x1="${n(pts[i][0])}" y1="${n(pts[i][1])}" x2="${n(pts[j][0])}" y2="${n(pts[j][1])}" stroke="${SKY}" stroke-width="0.7" opacity="0.55"/>`;
      return out + pts.map(([x, y]) => dot(x, y, 5, HI)).join('');
    })() +
      label(330, 110, '23 people', { size: 15, fill: HI }) + label(330, 160, '23 × 22 ÷ 2', { size: 14 }) +
      label(330, 200, '= 253 pairs', { size: 16, fill: SKY }) + label(330, 245, 'each line is', { size: 12, fill: DIM }) + label(330, 263, 'a chance', { size: 12, fill: DIM }),
  ),
  draw(
    'Curve of the chance of a shared birthday against group size: 51 percent at 23 people, 89 percent at 40, 99 percent at 60',
    (() => {
      const X = (p: number) => 60 + p * 4.3;
      const Y = (q: number) => 270 - q * 200;
      let out = line(60, 270, 370, 270, DIM, 2) + line(60, 270, 60, 60, DIM, 2) + line(60, Y(0.5), 370, Y(0.5), DIM, 1.5, '5 5');
      out += label(52, 274, '0%', { size: 12, fill: DIM, anchor: 'end' }) + label(52, Y(0.5) + 4, '50%', { size: 12, fill: DIM, anchor: 'end' }) + label(52, Y(1) + 4, '100%', { size: 12, fill: DIM, anchor: 'end' });
      out += polyline(Array.from({ length: 71 }, (_, p) => [X(p), Y(sharedBirthday(p))]), SKY, 3.5);
      out += [[23, '51%'], [40, '89%'], [60, '99%']].map(([p, t]) => {
        const x = X(Number(p));
        const y = Y(sharedBirthday(Number(p)));
        return dot(x, y, 7, HI) + line(x, y, x, 270, HI, 1.5, '3 4') + label(x, 290, String(p), { size: 13, fill: HI }) + label(x + 10, y + 22, String(t), { size: 14, fill: HI, anchor: 'start' });
      }).join('');
      return out + label(215, 40, 'chance someone shares', { size: 14, fill: DIM }) + label(215, 310, 'people', { size: 12, fill: DIM });
    })(),
  ),
  draw(
    'A 23 by 23 table of every person against every other: the diagonal is the same person, and the cells above it are the 253 different pairs',
    (() => {
      let out = '';
      for (let r = 0; r < 23; r++) for (let c = 0; c < 23; c++) {
        const fill = c > r ? HI : c < r ? SKY : NO;
        out += rect(30 + c * 8, 70 + r * 8, 7, 7, fill, c < r ? 'opacity="0.3"' : c === r ? 'opacity="0.8"' : '');
      }
      return out;
    })() +
      label(122, 50, '23 people × 23 people', { size: 13, fill: DIM }) +
      label(310, 95, '23 × 22 = 506', { size: 15 }) + label(310, 118, 'orderings', { size: 12, fill: DIM }) +
      label(310, 160, 'Ana-Ben = Ben-Ana', { size: 12, fill: SKY }) +
      label(310, 205, '506 ÷ 2 = 253', { size: 16, fill: HI }) + label(310, 228, 'pairs', { size: 12, fill: HI }) +
      label(122, 280, 'gold half = 253 pairs', { size: 13, fill: HI }),
  ),
  tex(
    [
      'P(\\text{no match}) = \\frac{365}{365}\\cdot\\frac{364}{365}\\cdot\\frac{363}{365}\\cdots\\frac{343}{365}',
      'P(\\text{no match}) \\approx 0.493',
      'P(\\text{match}) = 1 - 0.493 = 0.507 \\approx 51\\%',
    ],
    'Flip the question: find the chance of NO match first',
  ),
  draw(
    'Two curves: the chance that any two people match passes 50 percent at 23 people, but the chance someone matches YOUR birthday needs 253',
    (() => {
      const X = (p: number) => 60 + p;
      const Y = (q: number) => 270 - q * 200;
      let out = line(60, 270, 370, 270, DIM, 2) + line(60, 270, 60, 60, DIM, 2) + line(60, Y(0.5), 370, Y(0.5), DIM, 1.5, '5 5');
      out += label(52, 274, '0%', { size: 12, fill: DIM, anchor: 'end' }) + label(52, Y(0.5) + 4, '50%', { size: 12, fill: DIM, anchor: 'end' }) + label(52, Y(1) + 4, '100%', { size: 12, fill: DIM, anchor: 'end' });
      out += polyline(Array.from({ length: 101 }, (_, i) => [X(i), Y(sharedBirthday(i))]), SKY, 3.5);
      out += polyline(Array.from({ length: 31 }, (_, i) => [X(i * 10), Y(1 - Math.pow(364 / 365, i * 10))]), NO, 3.5);
      out += dot(X(23), Y(0.5), 7, SKY) + label(X(23), 290, '23', { size: 13, fill: SKY });
      out += dot(X(253), Y(0.5), 7, NO) + label(X(253), 290, '253', { size: 13, fill: NO });
      return out + label(110, 60, 'any two match', { size: 14, fill: SKY, anchor: 'start' }) + label(330, 205, 'matches MY day', { size: 14, fill: NO, anchor: 'end' }) + label(170, 290, 'people', { size: 12, fill: DIM });
    })(),
  ),
  draw(
    'A table of collision sizes: 365 birthdays match by 23 people, 10,000 PINs by about 118 tries, 4.3 billion codes by about 77,000 tries',
    label(200, 36, 'random collisions come early', { size: 15, fill: HI }) +
      label(210, 75, 'possible', { size: 12, fill: DIM }) + label(330, 75, '50% match at', { size: 12, fill: DIM }) +
      [['birthdays', '365', '23'], ['4-digit PINs', '10,000', '≈ 118'], ['32-bit codes', '4.3 billion', '≈ 77,000']].map(([a, b, c], i) =>
        line(20, 88 + i * 50, 380, 88 + i * 50, DIM, 1, '3 5') +
        label(20, 120 + i * 50, a, { size: 14, anchor: 'start' }) + label(210, 120 + i * 50, b, { size: 14, fill: SKY }) + label(330, 120 + i * 50, c, { size: 15, fill: OK })).join('') +
      label(200, 280, 'about 1.2 × √(possible)', { size: 16, fill: HI }),
  ),
  draw(
    'Line chart of people against pairs from 0 to 40: people grow in a straight line, pairs curve up to 780; at 23 people there are 253 pairs',
    (() => {
      const X = (p: number) => 60 + p * 7.5;
      const Y = (v: number) => 270 - v * 0.25;
      let out = line(60, 270, 370, 270, DIM, 2) + line(60, 270, 60, 60, DIM, 2);
      out += polyline(Array.from({ length: 41 }, (_, p) => [X(p), Y((p * (p - 1)) / 2)]), HI, 4);
      out += polyline([[X(0), Y(0)], [X(40), Y(40)]], SKY, 4);
      out += line(X(23), 270, X(23), Y(253), DIM, 1.5, '3 4') + dot(X(23), Y(253), 7, HI) + dot(X(23), Y(23), 6, SKY);
      out += label(X(23) - 10, Y(253) - 6, '253 pairs', { size: 14, fill: HI, anchor: 'end' }) + label(X(23) - 6, Y(23) - 12, '23', { size: 13, fill: SKY, anchor: 'end' });
      out += label(X(40), 50, '780', { size: 14, fill: HI, anchor: 'end' }) + label(X(40), 246, '40 people', { size: 13, fill: SKY, anchor: 'end' });
      out += label(X(0), 290, '0', { size: 12, fill: DIM }) + label(X(23), 290, '23', { size: 12, fill: DIM }) + label(X(40), 290, '40', { size: 12, fill: DIM });
      return out + label(200, 30, 'pairs outrun people', { size: 15, fill: HI });
    })(),
  ),
];

// ── 6.SP-9 · Florence Nightingale ──────────────────────────────────────────

// Her figures for the first year of the war, April 1854 to March 1855.
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const DISEASE = [1, 12, 11, 359, 828, 788, 503, 844, 1725, 2761, 2120, 1205];
const WOUNDS = [0, 0, 0, 0, 1, 81, 132, 287, 114, 83, 42, 32];
const OTHER = [5, 9, 6, 23, 30, 70, 128, 106, 131, 324, 361, 172];
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

/** A rose: one 30° wedge per month, wedge AREA proportional to deaths. */
function rose(layers: { data: number[]; fill: string; opacity: number }[], cx = 200, cy = 160, maxR = 115): string {
  const maxV = Math.max(...layers.flatMap((l) => l.data));
  const r = (v: number) => Math.sqrt(v / maxV) * maxR;
  let out = '';
  for (let m = 0; m < 12; m++) {
    const order = [...layers].sort((a, b) => b.data[m] - a.data[m]);
    for (const l of order) if (l.data[m] > 0) out += wedge(cx, cy, Math.max(r(l.data[m]), 1.5), m * 30, m * 30 + 30, l.fill, `fill-opacity="${l.opacity}" stroke="${INK}" stroke-width="1"`);
  }
  return out;
}

const roseLabel = (m: number, rr: number, text: string, fill: string, cx = 200, cy = 160) => {
  const a = ((m * 30 + 15) * Math.PI) / 180;
  return label(cx + rr * Math.sin(a), cy - rr * Math.cos(a) + 5, text, { size: 13, fill });
};

const NIGHTINGALE: MathFigure[] = [
  draw(
    'A timeline from 1800 to 1920: born 1820, Crimean War 1854, Royal Statistical Society 1859, died 1910',
    label(200, 40, 'Florence Nightingale', { size: 16, fill: HI }) +
      timeline(1800, 1920, [
        { at: 1820, text: 'born 1820', hi: true },
        { at: 1854, text: 'war 1854' },
        { at: 1859, text: 'RSS 1859' },
        { at: 1910, text: 'dies 1910' },
      ], String),
  ),
  draw(
    'Her age on a number line: 0 in 1820, 16 in 1836 when she chose nursing, 34 in 1854 when the war began',
    label(200, 40, 'her age', { size: 16, fill: DIM }) +
      timeline(0, 40, [
        { at: 0, text: 'born' },
        { at: 16, text: 'nurse! (16)', hi: true },
        { at: 34, text: 'war (34)' },
      ], (a) => `age ${a}`, 160) +
      label(200, 290, '1820 + 16 = 1836', { size: 17, fill: HI }),
  ),
  draw(
    'Bar chart of British army deaths from April 1854 to March 1855: 11,157 from disease, 772 from wounds, 1,365 from other causes',
    label(200, 34, 'deaths, Apr 1854 to Mar 1855', { size: 14, fill: HI }) +
      bars(
        [
          { v: sum(DISEASE), name: 'disease', fill: RED, val: commas(sum(DISEASE)) },
          { v: sum(WOUNDS), name: 'wounds', fill: SKY, val: commas(sum(WOUNDS)) },
          { v: sum(OTHER), name: 'other', fill: DIM, val: commas(sum(OTHER)) },
        ],
        { x0: 40, x1: 360, top: 70, base: 255 },
      ) +
      label(200, 302, 'most did NOT die of battle wounds', { size: 13, fill: DIM }),
  ),
  draw(
    'A ledger page with a tally of deaths by cause: disease 17, wounds 2, other 3',
    `<rect x="40" y="55" width="320" height="220" rx="8" fill="${INK}" fill-opacity="0.07" stroke="${DIM}" stroke-width="2"/>` +
      label(200, 40, 'write down EVERY death', { size: 15, fill: HI }) +
      label(60, 85, 'cause', { size: 12, fill: DIM, anchor: 'start' }) + label(340, 85, 'count', { size: 12, fill: DIM, anchor: 'end' }) +
      line(50, 95, 350, 95, DIM, 1.5) +
      label(60, 135, 'disease', { size: 14, fill: RED, anchor: 'start' }) + tally(140, 130, 17, RED) + label(340, 135, '17', { size: 15, fill: RED, anchor: 'end' }) +
      label(60, 185, 'wounds', { size: 14, fill: SKY, anchor: 'start' }) + tally(140, 180, 2, SKY) + label(340, 185, '2', { size: 15, fill: SKY, anchor: 'end' }) +
      label(60, 235, 'other', { size: 14, fill: INK, anchor: 'start' }) + tally(140, 230, 3, INK) + label(340, 235, '3', { size: 15, anchor: 'end' }) +
      label(200, 300, 'a sample page', { size: 12, fill: DIM }),
  ),
  draw(
    'Twenty soldiers in five groups of four, one in each group marked: 1 in 4 was dying',
    label(200, 45, 'of every 4 soldiers...', { size: 15, fill: DIM }) +
      Array.from({ length: 20 }, (_, i) => {
        const g = Math.floor(i / 4);
        const k = i % 4;
        return soldier(48 + g * 76 + k * 16, 130 + (g % 2) * 0, k === 3 ? RED : SKY);
      }).join('') +
      Array.from({ length: 5 }, (_, g) => `<rect x="${32 + g * 76}" y="100" width="64" height="56" rx="8" fill="none" stroke="${DIM}" stroke-width="1.5"/>`).join('') +
      label(200, 210, '1 in 4 = 25% dying', { size: 18, fill: RED }) +
      label(200, 260, 'from disease, not bullets', { size: 14, fill: INK }),
  ),
  draw(
    'A dense table of monthly deaths by cause from April 1854 to March 1855, hard to read at a glance',
    label(60, 50, 'month', { size: 12, fill: DIM }) + label(170, 50, 'disease', { size: 12, fill: DIM }) + label(260, 50, 'wounds', { size: 12, fill: DIM }) + label(340, 50, 'other', { size: 12, fill: DIM }) +
      line(30, 58, 370, 58, DIM, 1) +
      MONTHS.map((m, i) => label(60, 76 + i * 17, m, { size: 12, fill: DIM }) + label(170, 76 + i * 17, commas(DISEASE[i]), { size: 12 }) + label(260, 76 + i * 17, String(WOUNDS[i]), { size: 12 }) + label(340, 76 + i * 17, String(OTHER[i]), { size: 12 })).join('') +
      label(200, 300, 'columns of numbers: where is the story?', { size: 13, fill: NO }),
  ),
  draw(
    'A rose diagram: twelve wedges, one per month from April 1854 to March 1855, each wedge bigger when more soldiers died',
    rose([{ data: MONTHS.map((_, i) => DISEASE[i] + WOUNDS[i] + OTHER[i]), fill: SKY, opacity: 0.6 }]) +
      roseLabel(9, 134, 'Jan', HI) + roseLabel(0, 30, 'Apr', DIM) + roseLabel(3, 78, 'Jul', DIM) + roseLabel(6, 95, 'Oct', DIM) +
      label(200, 302, '1 wedge = 1 month; bigger = more deaths', { size: 13, fill: HI }),
  ),
  draw(
    'The rose diagram split by cause: huge red disease wedges with thin blue wound slivers inside',
    rose([
      { data: DISEASE, fill: RED, opacity: 0.75 },
      { data: WOUNDS, fill: SKY, opacity: 0.95 },
    ]) +
      rect(100, 290, 14, 14, RED) + label(122, 302, 'disease', { size: 14, fill: RED, anchor: 'start' }) +
      rect(230, 290, 14, 14, SKY) + label(252, 302, 'wounds', { size: 14, fill: SKY, anchor: 'start' }),
  ),
  draw(
    'Bar chart of the hospital death rate: 42 percent before the reforms, 2 percent after',
    label(200, 36, 'hospital death rate', { size: 15, fill: HI }) +
      bars(
        [
          { v: 42, name: 'before', fill: RED, val: '42%' },
          { v: 2, name: 'after', fill: OK, val: '2%' },
        ],
        { x0: 60, x1: 340, top: 80, base: 250, w: 90 },
      ) +
      label(200, 300, 'clean water, bandages, food', { size: 13, fill: DIM }),
  ),
  draw(
    'A timeline from 1830 to 1870: the statistical society founded 1834, the war 1854, Florence elected the first woman member in 1859',
    label(200, 40, 'the statistics club', { size: 16, fill: DIM }) +
      timeline(1830, 1870, [
        { at: 1834, text: 'founded 1834' },
        { at: 1854, text: 'war 1854' },
        { at: 1859, text: 'first woman: 1859', hi: true },
      ], String) +
      label(200, 300, '25 years with no women', { size: 13, fill: DIM }),
  ),
  draw(
    'The same January 1855 numbers shown as a table and as a bar chart: the bars make disease jump out',
    label(95, 50, 'table', { size: 15, fill: DIM }) + label(285, 50, 'picture', { size: 15, fill: HI }) +
      label(40, 110, 'disease', { size: 13, anchor: 'start' }) + label(160, 110, '2,761', { size: 13, anchor: 'end' }) +
      label(40, 145, 'wounds', { size: 13, anchor: 'start' }) + label(160, 145, '83', { size: 13, anchor: 'end' }) +
      label(40, 180, 'other', { size: 13, anchor: 'start' }) + label(160, 180, '324', { size: 13, anchor: 'end' }) +
      arrow(170, 150, 210, 150, HI, 2.5) +
      bars(
        [
          { v: 2761, name: 'disease', fill: RED, val: '' },
          { v: 83, name: 'wounds', fill: SKY, val: '' },
          { v: 324, name: 'other', fill: DIM, val: '' },
        ],
        { x0: 215, x1: 375, top: 75, base: 245, nameSize: 12 },
      ) +
      label(200, 300, 'Jan 1855: the truth jumps out', { size: 14, fill: OK }),
  ),
  draw(
    'Thirty-four squares, 33 red for disease and 1 blue for wounds: in January 1855, 2,761 disease deaths to 83 wound deaths is about 33 to 1',
    Array.from({ length: 34 }, (_, i) => rect(40 + (i % 7) * 26, 80 + Math.floor(i / 7) * 26, 22, 22, i < 33 ? RED : SKY, 'rx="3"')).join('') +
      label(131, 50, 'January 1855', { size: 15, fill: DIM }) +
      label(305, 110, 'disease 2,761', { size: 14, fill: RED }) + label(305, 140, 'wounds 83', { size: 14, fill: SKY }) +
      label(305, 180, '2,761 ÷ 83 ≈ 33', { size: 13 }) +
      label(305, 225, '33 : 1', { size: 24, fill: HI }) +
      label(131, 245, '1 square ≈ 83 deaths', { size: 12, fill: DIM }),
  ),
  draw(
    'Matching chart to question: comparing groups uses bars, change over time uses a line, parts of a whole use a pie',
    [['compare groups?', 'bars'], ['change over time?', 'line'], ['part of a whole?', 'pie']].map(([q, c], i) => {
      const y = 85 + i * 85;
      let icon = '';
      if (i === 0) icon = rect(250, y - 10, 18, 30, SKY) + rect(274, y - 30, 18, 50, SKY) + rect(298, y - 20, 18, 40, SKY);
      if (i === 1) icon = polyline([[250, y + 15], [268, y], [286, y + 5], [304, y - 20], [320, y - 28]], OK, 3.5);
      if (i === 2) icon = wedge(285, y - 5, 28, 0, 250, HI, 'fill-opacity="0.8"') + wedge(285, y - 5, 28, 250, 360, NO);
      return label(30, y + 5, q, { size: 14, anchor: 'start' }) + arrow(180, y, 228, y, DIM, 2) + icon + label(362, y + 5, c, { size: 13, fill: HI });
    }).join('') +
      label(200, 300, 'pick the picture that answers it', { size: 13, fill: DIM }),
  ),
  draw(
    'The same two numbers, 50 and 55, drawn twice: with the axis starting at 48 the gap looks huge, with the axis at 0 it looks small',
    label(105, 45, 'axis starts at 48', { size: 13, fill: NO }) + label(295, 45, 'axis starts at 0', { size: 13, fill: OK }) +
      line(200, 60, 200, 300, DIM, 1.5, '4 6') +
      line(40, 250, 180, 250, DIM, 2) + line(40, 250, 40, 70, DIM, 2) + label(34, 254, '48', { size: 12, fill: DIM, anchor: 'end' }) +
      rect(65, 250 - 2 * 25, 40, 2 * 25, SKY) + rect(125, 250 - 7 * 25, 40, 7 * 25, NO) +
      label(85, 192, '50', { size: 13 }) + label(145, 67, '55', { size: 13 }) +
      line(230, 250, 370, 250, DIM, 2) + line(230, 250, 230, 70, DIM, 2) + label(224, 254, '0', { size: 12, fill: DIM, anchor: 'end' }) +
      rect(255, 250 - 50 * 3, 40, 50 * 3, SKY) + rect(315, 250 - 55 * 3, 40, 55 * 3, OK) +
      label(275, 92, '50', { size: 13 }) + label(335, 77, '55', { size: 13 }) +
      label(105, 285, 'looks 3× bigger', { size: 13, fill: NO }) + label(295, 285, 'only 10% more', { size: 13, fill: OK }),
  ),
  draw(
    'A dashboard line chart of weekly infections rising past an alert line, then falling after the hospital acts in week 6',
    (() => {
      const data = [8, 9, 11, 14, 18, 23, 20, 15, 11, 8, 6, 5];
      const X = (i: number) => 70 + i * 26;
      const Y = (v: number) => 260 - v * 7.5;
      return label(200, 36, 'weekly infections', { size: 15, fill: HI }) +
        line(60, 260, 370, 260, DIM, 2) + line(60, 260, 60, 60, DIM, 2) +
        line(60, Y(15), 370, Y(15), NO, 2, '6 5') + label(366, Y(15) - 8, 'alert line', { size: 12, fill: NO, anchor: 'end' }) +
        polyline(data.map((v, i) => [X(i), Y(v)]), SKY, 3.5) +
        data.map((v, i) => dot(X(i), Y(v), 4.5, v > 15 ? NO : SKY)).join('') +
        line(X(5), Y(23) - 8, X(5), 260, HI, 2, '3 4') + label(X(5) + 8, 76, 'act here', { size: 13, fill: HI, anchor: 'start' }) +
        label(X(0), 280, '1', { size: 12, fill: DIM }) + label(X(5), 280, '6', { size: 12, fill: DIM }) + label(X(11), 280, '12', { size: 12, fill: DIM }) +
        label(215, 304, 'week', { size: 12, fill: DIM });
    })(),
  ),
  draw(
    'Monthly bars from April 1854 to March 1855: disease deaths in red tower over wound deaths in blue, peaking at 2,761 in January',
    (() => {
      const X = (i: number) => 52 + i * 26;
      const H = (v: number) => (v / 2761) * 190;
      let out = line(40, 260, 370, 260, DIM, 2);
      MONTHS.forEach((m, i) => {
        out += rect(X(i), 260 - H(DISEASE[i]), 11, Math.max(1.5, H(DISEASE[i])), RED) + rect(X(i) + 12, 260 - Math.max(1.5, H(WOUNDS[i])), 9, Math.max(1.5, H(WOUNDS[i])), SKY);
        out += label(X(i) + 10, 278, m[0], { size: 11, fill: DIM });
      });
      return out + label(X(9) - 6, 62, 'Jan: 2,761', { size: 14, fill: RED, anchor: 'end' }) +
        rect(70, 290, 14, 14, RED) + label(90, 302, 'disease', { size: 13, fill: RED, anchor: 'start' }) +
        rect(200, 290, 14, 14, SKY) + label(220, 302, 'wounds', { size: 13, fill: SKY, anchor: 'start' }) +
        label(200, 34, 'a picture tells the story', { size: 15, fill: HI });
    })(),
  ),
];

export const STORY_FIGURES_G1: Record<string, MathFigure[]> = {
  '5.F-3-story.mp4': PIZZA,
  '5.F-6-story.mp4': SHORTCUT,
  '6.RP-2-story.mp4': BATTING,
  '6.RP-4-story.mp4': TURING,
  '6.RP-5-story.mp4': PENALTY,
  '6.SP-1-story.mp4': TICTAC,
  '6.SP-4-story.mp4': BIRTHDAY,
  '6.SP-9-story.mp4': NIGHTINGALE,
};
