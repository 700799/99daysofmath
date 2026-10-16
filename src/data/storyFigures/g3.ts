// Drawn figures for the illustrated Math Stories, group 3. Keyed by story id
// (the old video file name). Each array holds one figure per beat, in order,
// then one more for the closing "What you learned" slide.
import type { MathFigure } from '../mathFigure';
import { tex, draw, label, line, arrow, arc, INK, DIM, HI, OK, NO, SKY } from '../mathFigure';

// ── local helpers ──────────────────────────────────────────────────────────

const f1 = (n: number) => n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
const DARK = '#1e1b4b';

/** Corner points of a regular n-gon; `rot` is the screen angle of the first corner. */
function ngonPts(n: number, cx: number, cy: number, r: number, rot = -90): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = rad(rot + (360 * i) / n);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
}

/** A polygon through the given points. */
function poly(p: [number, number][], stroke = INK, fill = 'none', w = 3, extra = ''): string {
  return `<polygon points="${p.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${extra}/>`;
}

/** A regular n-gon. */
function ngon(n: number, cx: number, cy: number, r: number, o: { stroke?: string; fill?: string; w?: number; rot?: number } = {}): string {
  return poly(ngonPts(n, cx, cy, r, o.rot ?? -90), o.stroke ?? INK, o.fill ?? 'none', o.w ?? 3);
}

function circle(cx: number, cy: number, r: number, stroke = INK, fill = 'none', w = 3, extra = ''): string {
  return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${extra}/>`;
}

function dot(cx: number, cy: number, r = 6, fill = HI): string {
  return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${fill}"/>`;
}

function rect(x: number, y: number, w: number, h: number, stroke = INK, fill = 'none', sw = 3, rx = 0): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function ellipse(cx: number, cy: number, rx: number, ry: number, stroke = INK, fill = 'none', w = 3, extra = ''): string {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${extra}/>`;
}

function path(d: string, stroke = INK, w = 3, fill = 'none', extra = ''): string {
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"${extra}/>`;
}

/** An arrow from (x1,y1) toward (x2,y2), stopping `cut` short of both ends. */
function arrowTo(x1: number, y1: number, x2: number, y2: number, cut: number, stroke = HI, w = 3): string {
  const L = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / L;
  const uy = (y2 - y1) / L;
  return arrow(+f1(x1 + ux * cut), +f1(y1 + uy * cut), +f1(x2 - ux * cut), +f1(y2 - uy * cut), stroke, w);
}

/** The eye-shaped hole of a donut drawn flat. */
function hole(cx: number, cy: number, halfW: number, stroke = INK): string {
  return path(`M ${cx - halfW} ${cy} Q ${cx} ${cy - halfW * 0.45} ${cx + halfW} ${cy} M ${cx - halfW * 0.8} ${cy - 2} Q ${cx} ${cy + halfW * 0.4} ${cx + halfW * 0.8} ${cy - 2}`, stroke, 3);
}

/** Pointy-top hexagon grid: `cols` × `rows` cells of circumradius r, odd rows shifted. */
function hexGrid(x0: number, y0: number, r: number, cols: number, rows: number, stroke = HI, w = 2.5, fill = 'none'): string {
  const dx = Math.sqrt(3) * r;
  let out = '';
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      out += ngon(6, x0 + i * dx + (j % 2 ? dx / 2 : 0), y0 + j * 1.5 * r, r, { stroke, w, fill });
    }
  }
  return out;
}

/** An oblique (cabinet) box: front w×h at (x, y), depth drawn up-right by d. */
function box(x: number, y: number, w: number, h: number, d: number, stroke = INK, frontFill = 'none'): string {
  return (
    rect(x, y, w, h, stroke, frontFill, 3) +
    poly([[x, y], [x + d, y - d], [x + w + d, y - d], [x + w, y]], stroke, 'none', 3) +
    poly([[x + w, y], [x + w + d, y - d], [x + w + d, y + h - d], [x + w, y + h]], stroke, 'none', 3)
  );
}

/** A gear outline with n teeth. */
function gear(cx: number, cy: number, r: number, n: number, stroke = INK): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i;
    for (const [da, rr] of [[0, r - 6], [0.2, r], [0.5, r], [0.7, r - 6]] as [number, number][]) {
      const t = rad(a + da * (360 / n));
      pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)]);
    }
  }
  return poly(pts, stroke, 'none', 2.5) + circle(cx, cy, 5, stroke, stroke, 1);
}

/** A clock face showing h:m. */
function clock(cx: number, cy: number, r: number, h: number, m: number, color: string): string {
  let out = circle(cx, cy, r, color, 'none', 3);
  for (let i = 0; i < 12; i++) {
    const a = rad(i * 30);
    out += line(+f1(cx + (r - 10) * Math.sin(a)), +f1(cy - (r - 10) * Math.cos(a)), +f1(cx + r * Math.sin(a)), +f1(cy - r * Math.cos(a)), DIM, i % 3 ? 2 : 3.5);
  }
  const ha = rad((h + m / 60) * 30);
  const ma = rad(m * 6);
  out += line(cx, cy, +f1(cx + r * 0.5 * Math.sin(ha)), +f1(cy - r * 0.5 * Math.cos(ha)), INK, 5);
  out += line(cx, cy, +f1(cx + r * 0.8 * Math.sin(ma)), +f1(cy - r * 0.8 * Math.cos(ma)), color, 3);
  return out + dot(cx, cy, 5, color);
}

/** A horizontal timeline from `a` to `b` with labelled marks above or below. */
function timeline(a: number, b: number, marks: { at: number; text: string; up: boolean; hi?: boolean }[], fmt: (n: number) => string, y = 170): string {
  const x = (n: number) => 40 + ((n - a) / (b - a)) * 320;
  let out = line(40, y, 360, y, DIM, 3);
  out += label(40, y + 30, fmt(a), { size: 12, fill: DIM }) + label(360, y + 30, fmt(b), { size: 12, fill: DIM });
  for (const m of marks) {
    const px = x(m.at);
    out += line(px, y, px, m.up ? y - 45 : y + 50, m.hi ? HI : DIM, 2);
    out += dot(px, y, m.hi ? 9 : 6, m.hi ? HI : INK);
    out += label(+f1(px), m.up ? y - 57 : y + 70, m.text, { size: 13, fill: m.hi ? HI : INK });
  }
  return out;
}

// ── Hypatia ────────────────────────────────────────────────────────────────

const hypatia: MathFigure[] = [
  // 1 Ancient Egypt, 350 AD
  draw(
    'A simple map: the Mediterranean Sea above the Egyptian coast, the Nile running up to its delta, and Alexandria marked on the coast',
    path('M 0 150 Q 60 140 110 160 Q 160 178 200 172 Q 250 165 290 175 Q 340 185 400 170 L 400 0 L 0 0 Z', SKY, 2, '#60a5fa22') +
      path('M 250 320 Q 245 270 240 230 Q 236 205 228 180', SKY, 4) +
      path('M 236 205 Q 218 190 210 174', SKY, 3) +
      path('M 236 205 Q 250 190 258 168', SKY, 3) +
      dot(200, 172, 9, HI) +
      label(200, 95, 'Mediterranean Sea', { size: 16, fill: SKY }) +
      label(188, 202, 'Alexandria', { size: 15, fill: HI, anchor: 'end' }) +
      label(262, 272, 'Nile', { size: 14, fill: SKY, anchor: 'start' }) +
      label(110, 262, 'EGYPT', { size: 15, fill: DIM }) +
      label(200, 36, 'born c. 350 AD', { size: 17, fill: HI }),
    'Alexandria, home of the great library',
  ),
  // 2 Her dad's bet
  draw(
    "Euclid's first construction: two circles of the same radius through each other's centres, whose crossing point makes an equilateral triangle",
    circle(160, 190, 80, DIM, 'none', 2.5) +
      circle(240, 190, 80, DIM, 'none', 2.5) +
      poly([[160, 190], [240, 190], [200, 120.7]], HI, '#fbbf2422', 3.5) +
      dot(160, 190, 5, INK) + dot(240, 190, 5, INK) + dot(200, 120.7, 5, INK) +
      label(150, 212, 'A', { size: 15 }) + label(250, 212, 'B', { size: 15 }) + label(200, 102, 'C', { size: 15 }) +
      label(200, 36, 'lesson one: Euclid, Book I', { size: 15, fill: DIM }) +
      label(200, 300, 'AB = BC = CA, by compass alone', { size: 14, fill: HI }),
    'Taught math exactly as he would teach a son',
  ),
  // 3 The shapes nobody could explain
  draw(
    'A regular triangle, square, pentagon and hexagon in a row with their corner angles 60, 90, 108 and 120 degrees',
    ngon(3, 55, 160, 40, { stroke: HI }) +
      ngon(4, 150, 160, 42, { stroke: HI, rot: -45 }) +
      ngon(5, 250, 160, 42, { stroke: HI }) +
      ngon(6, 345, 160, 42, { stroke: HI }) +
      label(55, 230, 'triangle', { size: 13 }) +
      label(150, 230, 'square', { size: 13 }) +
      label(250, 230, 'pentagon', { size: 13 }) +
      label(345, 230, 'hexagon', { size: 13 }) +
      label(55, 258, '60°', { size: 15, fill: OK }) +
      label(150, 258, '90°', { size: 15, fill: OK }) +
      label(250, 258, '108°', { size: 15, fill: OK }) +
      label(345, 258, '120°', { size: 15, fill: OK }) +
      label(200, 292, 'each corner angle', { size: 13, fill: DIM }) +
      label(200, 50, 'regular: every side and angle equal', { size: 15, fill: HI }),
  ),
  // 4 Why polygons matter
  draw(
    'Three uses of polygons: a hexagonal pillar seen from above, a sailor measuring the angle up to a star, and a painter’s floor of lines meeting at one point',
    ngon(6, 70, 160, 42, { stroke: HI, fill: '#fbbf2418', rot: 0 }) +
      ngon(6, 70, 160, 22, { stroke: DIM, w: 2, rot: 0 }) +
      line(140, 210, 260, 210, DIM, 3) +
      line(150, 210, 240, 115, HI, 3) +
      arc(150, 210, 32, 0, 46.5, OK, 3) +
      ngon(5, 244, 108, 10, { stroke: INK, fill: INK, w: 1 }) +
      label(196, 200, 'angle', { size: 12, fill: OK, anchor: 'start' }) +
      line(275, 220, 390, 220, DIM, 2.5) +
      line(275, 220, 332, 115, SKY, 2.5) + line(305, 220, 332, 115, SKY, 2) + line(360, 220, 332, 115, SKY, 2) + line(390, 220, 332, 115, SKY, 2.5) +
      line(297, 180, 368, 180, SKY, 2) + line(312, 152, 352, 152, SKY, 2) +
      dot(332, 115, 5, HI) +
      label(70, 260, 'builders', { size: 14 }) +
      label(200, 260, 'sailors', { size: 14 }) +
      label(332, 260, 'painters', { size: 14 }) +
      label(70, 284, 'pillars', { size: 12, fill: DIM }) +
      label(200, 284, 'star angles', { size: 12, fill: DIM }) +
      label(332, 284, 'perspective', { size: 12, fill: DIM }) +
      label(200, 44, 'polygons: the LEGO bricks', { size: 17, fill: HI }),
  ),
  // 5 Slicing a cone
  draw(
    'A cone cut two ways: a level slice gives a circle, a tilted slice gives an ellipse',
    line(110, 50, 40, 270, INK, 3) + line(110, 50, 180, 270, INK, 3) +
      ellipse(110, 270, 70, 12, DIM, 'none', 2.5) +
      ellipse(110, 140, 28.6, 7, OK, '#34d39933', 3) +
      line(57.5, 215, 149.8, 175, HI, 3.5) +
      circle(300, 105, 40, OK, '#34d39922', 3.5) +
      ellipse(300, 222, 62, 30, HI, '#fbbf2422', 3.5) +
      arrowTo(140, 140, 258, 108, 6, OK, 2.5) +
      arrowTo(152, 192, 236, 220, 6, HI, 2.5) +
      label(300, 170, 'level slice: circle', { size: 13, fill: OK }) +
      label(300, 280, 'tilted slice: ellipse', { size: 13, fill: HI }) +
      label(110, 306, 'one cone', { size: 14, fill: DIM }),
    'One solid, a whole family of curves',
  ),
  // 6 Famous teacher
  draw(
    'Arrows from Italy, Greece, Syria and Persia all pointing to Alexandria, where students came to learn',
    dot(60, 92, 7, INK) + dot(165, 78, 7, INK) + dot(290, 110, 7, INK) + dot(360, 160, 7, INK) +
      label(60, 74, 'Italy', { size: 14 }) +
      label(165, 60, 'Greece', { size: 14 }) +
      label(290, 92, 'Syria', { size: 14 }) +
      label(360, 142, 'Persia', { size: 14 }) +
      arrowTo(60, 92, 200, 245, 14, SKY, 2.5) +
      arrowTo(165, 78, 200, 245, 14, SKY, 2.5) +
      arrowTo(290, 110, 200, 245, 14, SKY, 2.5) +
      arrowTo(360, 160, 200, 245, 14, SKY, 2.5) +
      dot(200, 245, 10, HI) +
      label(200, 280, 'Alexandria', { size: 15, fill: HI }) +
      label(200, 306, 'age 30: the top teacher', { size: 13, fill: DIM }) +
      label(200, 26, 'months of travel to her class', { size: 14, fill: DIM }),
  ),
  // 7 Her style
  draw(
    'An astrolabe: a circle marked in degrees with a sighting arm raised 40 degrees above the horizon toward a star',
    circle(170, 180, 100, INK, '#ece9ff0d', 3) +
      Array.from({ length: 36 }, (_, i) => {
        const a = rad(i * 10);
        const r1 = i % 3 ? 92 : 86;
        return line(+f1(170 + r1 * Math.cos(a)), +f1(180 - r1 * Math.sin(a)), +f1(170 + 100 * Math.cos(a)), +f1(180 - 100 * Math.sin(a)), DIM, 1.5);
      }).join('') +
      line(60, 180, 282, 180, DIM, 2.5, '6 5') +
      line(170, 180, 284.9, 83.6, HI, 4) +
      ngon(5, 296, 74, 10, { stroke: HI, fill: HI, w: 1 }) +
      arc(170, 180, 46, 0, 40, OK, 3) +
      dot(170, 180, 6, INK) +
      label(240, 170, '40°', { size: 15, fill: OK }) +
      label(312, 68, 'star', { size: 14, fill: HI, anchor: 'start' }) +
      label(290, 200, 'horizon', { size: 12, fill: DIM, anchor: 'start' }) +
      label(170, 304, 'her astrolabe', { size: 14 }) +
      label(160, 36, 'sight the star, read the angle', { size: 15, fill: HI }),
    'Tools so students could SEE the math',
  ),
  // 8 Dangerous times
  draw(
    'A timeline from 350 AD to 415 AD: born around 350, top teacher at 30, and 415 AD; 415 minus 350 is 65 years',
    timeline(340, 425, [
      { at: 350, text: 'born', up: true },
      { at: 380, text: 'teacher, age 30', up: false },
      { at: 415, text: '415 AD', up: true, hi: true },
    ], (n) => `${n}`) +
      label(200, 40, 'she stays neutral and keeps teaching', { size: 14, fill: DIM }) +
      label(200, 296, '415 − 350 = 65 years', { size: 15, fill: HI }),
  ),
  // 9 Her math survives
  draw(
    'A chain of copies: her work in 415 AD is copied by students, carried to new schools, and reaches today, about 1,600 years later',
    ['415 AD', 'copied', 'carried', 'today'].map((t, i) => {
      const x = 14 + i * 98;
      return rect(x, 125, 82, 50, i === 3 ? OK : INK, 'none', 2.5, 8) + label(x + 41, 156, t, { size: 14, fill: i === 3 ? OK : INK });
    }).join('') +
      [0, 1, 2].map((i) => arrow(98 + i * 98, 150, 110 + i * 98, 150, HI, 2.5)).join('') +
      line(55, 205, 55, 220, DIM, 2) + line(349, 205, 349, 220, DIM, 2) + line(55, 220, 349, 220, DIM, 2) +
      label(200, 252, '2026 − 415 ≈ 1,600 years', { size: 16, fill: HI }) +
      label(200, 70, 'polygons and conic sections', { size: 14, fill: DIM }) +
      label(200, 96, 'her commentaries survive', { size: 15 }),
  ),
  // 10 Why she matters
  draw(
    'A triangle with angles 50, 60 and 70 degrees; they add to 180 for anyone who measures',
    poly([[70, 250], [330, 250], [224, 66.5]], INK, '#ece9ff0d', 3) +
      arc(70, 250, 40, 0, 50, HI, 3) +
      arc(330, 250, 36, 120, 60, HI, 3) +
      arc(224, 66.5, 32, 240, 60, HI, 3) +
      label(126, 240, '50°', { size: 15, fill: HI }) +
      label(280, 240, '60°', { size: 15, fill: HI }) +
      label(224, 120, '70°', { size: 15, fill: HI }) +
      label(200, 290, '50 + 60 + 70 = 180', { size: 17, fill: OK }) +
      label(200, 312, 'the same answer for everyone', { size: 13, fill: DIM }) +
      label(200, 36, 'same rules for anyone', { size: 15, fill: DIM }),
  ),
  // 11 Polygon math you can do
  draw(
    'A regular hexagon split from its centre into 6 identical triangles, each with area 4, total 24',
    ngonPts(6, 200, 160, 105, 0).map(([x, y]) => line(200, 160, +f1(x), +f1(y), DIM, 2)).join('') +
      ngon(6, 200, 160, 105, { stroke: HI, w: 3.5, rot: 0 }) +
      ngonPts(6, 200, 160, 62, 30).map(([x, y]) => label(+f1(x), +f1(y + 7), '4', { size: 20, fill: OK })).join('') +
      label(200, 302, '6 × 4 = 24', { size: 20, fill: HI }) +
      label(200, 34, 'split from the center', { size: 14, fill: DIM }),
  ),
  // 12 Pro tip: cut shapes apart
  draw(
    'A house-shaped pentagon cut into a 6 by 4 rectangle (area 24) and a triangle with base 6 and height 3 (area 9), total 33',
    rect(110, 160, 180, 120, INK, '#60a5fa1a', 3) +
      poly([[110, 160], [290, 160], [200, 70]], INK, '#34d3991a', 3) +
      line(104, 160, 296, 160, HI, 3, '8 6') +
      line(320, 70, 320, 160, DIM, 2, '5 5') + line(312, 70, 328, 70, DIM, 2) + line(312, 160, 328, 160, DIM, 2) +
      label(200, 228, '6 × 4 = 24', { size: 16, fill: SKY }) +
      label(200, 134, '½ × 6 × 3 = 9', { size: 12, fill: OK }) +
      label(200, 304, '6', { size: 15 }) +
      label(86, 226, '4', { size: 15 }) +
      label(338, 121, '3', { size: 15 }) +
      label(200, 38, '24 + 9 = 33', { size: 18, fill: HI }),
    'Cut along the dashed line, solve each piece, add',
  ),
  // 13 Trap: "regular" means special
  draw(
    'A regular hexagon with equal tick-marked sides beside a lopsided hexagon with unequal sides and angles',
    ngon(6, 105, 150, 72, { stroke: OK, w: 3.5 }) +
      ngonPts(6, 105, 150, 72).map(([x, y], i, a) => {
        const [x2, y2] = a[(i + 1) % 6];
        const mx = (x + x2) / 2, my = (y + y2) / 2;
        const nx = (mx - 105) / 62, ny = (my - 150) / 62;
        return line(+f1(mx - nx * 8), +f1(my - ny * 8), +f1(mx + nx * 8), +f1(my + ny * 8), OK, 2.5);
      }).join('') +
      poly([[222, 125], [270, 82], [372, 108], [356, 196], [300, 220], [236, 186]], NO, 'none', 3.5) +
      label(105, 252, 'regular', { size: 15, fill: OK }) +
      label(300, 252, 'not regular', { size: 15, fill: NO }) +
      label(105, 274, '6 sides', { size: 12, fill: DIM }) +
      label(300, 274, 'still 6 sides', { size: 12, fill: DIM }) +
      label(200, 306, 'regular = equal sides AND equal angles', { size: 13, fill: HI }) +
      label(200, 40, 'both are hexagons', { size: 15 }),
  ),
  // 14 Her legacy in your app
  draw(
    'A triangle with base 8 and height 5 inside an 8 by 5 rectangle; the triangle is half the rectangle, area 20',
    rect(80, 90, 240, 150, DIM, 'none', 2, 0).replace('/>', ' stroke-dasharray="7 6"/>') +
      poly([[80, 240], [320, 240], [230, 90]], HI, '#fbbf2422', 3.5) +
      line(230, 90, 230, 240, OK, 2.5, '6 5') +
      `<path d="M 230 226 L 244 226 L 244 240" fill="none" stroke="${OK}" stroke-width="2"/>` +
      label(200, 264, '8', { size: 16 }) +
      label(244, 170, '5', { size: 16, fill: OK, anchor: 'start' }) +
      label(200, 298, '½ × 8 × 5 = 20', { size: 17, fill: HI }) +
      label(200, 60, 'a triangle is half its box', { size: 14, fill: DIM }),
  ),
  // learned
  tex(
    ['\\text{angle sum} = (n-2)\\times 180^\\circ', '\\text{triangle: } 1 \\times 180^\\circ = 180^\\circ', '\\text{square: } 2 \\times 180^\\circ = 360^\\circ', '\\text{hexagon: } 4 \\times 180^\\circ = 720^\\circ'],
    'Polygon rules that have worked for 1,600 years',
  ),
];

// ── Maryam Mirzakhani ──────────────────────────────────────────────────────

const mirzakhani: MathFigure[] = [
  // 1 Tehran, Iran, 1977
  draw(
    'A timeline of Maryam Mirzakhani’s life: born in Tehran in 1977, Olympiad gold in 1994, Fields Medal in 2014',
    timeline(1975, 2020, [
      { at: 1977, text: 'born, Tehran', up: true, hi: true },
      { at: 1994, text: 'Olympiad gold', up: false },
      { at: 2014, text: 'Fields Medal', up: true },
    ], (n) => `${n}`) +
      label(200, 40, '1977: a kid who loves stories', { size: 15, fill: DIM }) +
      label(200, 300, 'she planned to be a writer', { size: 14, fill: HI }),
  ),
  // 2 Math finds her
  draw(
    'A 3 by 3 grid of squares: 9 small squares, 4 two-by-two squares and 1 big square make 14 squares in all',
    Array.from({ length: 4 }, (_, i) => line(125 + i * 50, 70, 125 + i * 50, 220, DIM, 2) + line(125, 70 + i * 50, 275, 70 + i * 50, DIM, 2)).join('') +
      rect(125, 70, 150, 150, HI, 'none', 4) +
      rect(131, 76, 88, 88, OK, '#34d39922', 3) +
      label(200, 44, 'puzzle: how many squares?', { size: 15, fill: HI }) +
      label(200, 256, '9 small + 4 medium + 1 big = 14', { size: 14 }) +
      label(200, 290, 'a drill just says 3 × 3 = 9', { size: 13, fill: DIM }),
  ),
  // 3 Olympiad champion
  draw(
    'Two gold medals: 1994 at age 17 and 1995 at age 18, at the International Math Olympiad',
    [130, 270].map((x, i) =>
      poly([[x - 28, 62], [x - 8, 62], [x + 2, 104], [x - 14, 104]], SKY, SKY, 1) +
      poly([[x + 28, 62], [x + 8, 62], [x - 2, 104], [x + 14, 104]], NO, NO, 1) +
      circle(x, 150, 50, '#f59e0b', HI, 3) +
      circle(x, 150, 38, DARK, 'none', 2) +
      label(x, 157, i ? '1995' : '1994', { size: 18, fill: DARK }) +
      label(x, 228, i ? 'age 18' : 'age 17', { size: 15, fill: HI }) +
      label(x, 250, 'gold', { size: 13, fill: DIM }),
    ).join('') +
      label(200, 36, 'International Math Olympiad', { size: 15 }) +
      label(200, 292, 'first Iranian girl on the team', { size: 14, fill: OK }),
  ),
  // 4 Off to Harvard
  draw(
    'A huge sheet of paper with a doodle of a two-holed surface and closed curves drawn around and through it',
    rect(30, 50, 340, 220, DIM, '#ece9ff0d', 2.5, 4) +
      ellipse(200, 170, 140, 64, INK, 'none', 3) +
      hole(140, 168, 30) + hole(260, 168, 30) +
      ellipse(140, 166, 52, 30, HI, 'none', 2.5) +
      ellipse(200, 170, 12, 62, OK, 'none', 2.5, ' stroke-dasharray="6 5"') +
      ellipse(260, 166, 52, 30, SKY, 'none', 2.5) +
      label(200, 80, 'curves on a curved surface', { size: 13, fill: HI }) +
      label(200, 298, 'giant paper on the office floor', { size: 14, fill: DIM }),
    'Draw it big',
  ),
  // 5 Her question
  draw(
    'Three curved surfaces: a saddle that bends two ways, a donut with 1 hole and a pretzel with 2 holes',
    path('M 20 130 Q 70 170 120 130', INK, 3) + path('M 20 200 Q 70 160 120 200', INK, 3) +
      line(20, 130, 20, 200, INK, 3) + line(120, 130, 120, 200, INK, 3) +
      path('M 20 165 Q 70 150 120 165', HI, 2, 'none', ' stroke-dasharray="5 4"') +
      path('M 70 142 Q 62 165 70 188', OK, 2, 'none', ' stroke-dasharray="5 4"') +
      ellipse(200, 165, 56, 36, INK, 'none', 3) + hole(200, 163, 24) +
      ellipse(330, 165, 60, 34, INK, 'none', 3) + hole(308, 163, 15) + hole(352, 163, 15) +
      label(70, 240, 'saddle', { size: 14 }) +
      label(200, 240, 'donut', { size: 14 }) +
      label(330, 240, 'pretzel', { size: 14 }) +
      label(70, 264, 'bends two ways', { size: 12, fill: DIM }) +
      label(200, 264, '1 hole', { size: 12, fill: DIM }) +
      label(330, 264, '2 holes', { size: 12, fill: DIM }) +
      label(200, 56, 'surface area? how does it bend?', { size: 15, fill: HI }),
  ),
  // 6 Nets, but curved
  draw(
    'A cross-shaped net of 6 squares folds into a cube; Maryam asked what the net of a surface that bends everywhere looks like',
    [[60, 60], [60, 100], [60, 140], [60, 180], [20, 100], [100, 100]].map(([x, y]) => rect(x, y, 40, 40, HI, '#fbbf241a', 2.5)).join('') +
      arrow(160, 140, 215, 140, OK, 3) +
      label(188, 124, 'fold', { size: 13, fill: OK }) +
      box(240, 120, 70, 70, 28, HI, '#fbbf241a') +
      label(80, 250, 'flat net', { size: 14 }) +
      label(290, 250, 'cube', { size: 14 }) +
      label(200, 36, '6 squares fold into a cube', { size: 14, fill: DIM }) +
      label(200, 294, 'a surface that bends everywhere: ?', { size: 14, fill: HI }),
  ),
  // 7 Why curves matter
  draw(
    'A square grid pulled inward around a heavy ball, showing how mass curves space',
    (() => {
      const warp = (x: number, y: number): [number, number] => {
        const dx = x - 200, dy = y - 165;
        const d = Math.hypot(dx, dy) || 1;
        const pull = 34 * Math.exp(-(d * d) / (2 * 70 * 70));
        return [x - (dx / d) * pull, y - (dy / d) * pull];
      };
      let out = '';
      for (let gy = 65; gy <= 265; gy += 25) {
        const p = Array.from({ length: 33 }, (_, i) => warp(40 + i * 10, gy));
        out += path(p.map(([x, y], i) => `${i ? 'L' : 'M'} ${f1(x)} ${f1(y)}`).join(' '), SKY, 1.5);
      }
      for (let gx = 40; gx <= 360; gx += 32) {
        const p = Array.from({ length: 21 }, (_, i) => warp(gx, 65 + i * 10));
        out += path(p.map(([x, y], i) => `${i ? 'L' : 'M'} ${f1(x)} ${f1(y)}`).join(' '), SKY, 1.5);
      }
      return out;
    })() +
      circle(200, 165, 20, HI, HI, 2) +
      label(200, 40, 'mass curves the space around it', { size: 15, fill: HI }) +
      label(200, 300, 'curved geometry explains gravity', { size: 14, fill: DIM }),
  ),
  // 8 The breakthrough
  draw(
    'A donut with two closed loops drawn on it: one around the tube and one around the hole',
    ellipse(200, 165, 150, 80, INK, '#ece9ff0d', 3) +
      hole(200, 160, 52) +
      ellipse(200, 162, 102, 46, HI, 'none', 3) +
      ellipse(100, 165, 16, 70, OK, 'none', 3) +
      label(200, 34, 'count the closed loops', { size: 16, fill: HI }) +
      label(100, 270, 'tube loop', { size: 14, fill: OK }) +
      label(300, 270, 'hole loop', { size: 14, fill: HI }) +
      label(200, 302, 'her proof: how that count grows', { size: 13, fill: DIM }),
    'A theorem nobody had cracked before',
  ),
  // 9 Fields Medal, 2014
  draw(
    'Sixty dots for about sixty Fields Medalists in 90 years, with one highlighted: Maryam in 2014, the first woman',
    Array.from({ length: 60 }, (_, i) => {
      const x = 52 + (i % 12) * 27, y = 90 + Math.floor(i / 12) * 30;
      return i === 59 ? dot(x, y, 11, HI) : dot(x, y, 7, DIM);
    }).join('') +
      label(200, 46, '≈ 60 winners in 90 years', { size: 15 }) +
      label(200, 260, '2014: the first woman', { size: 17, fill: HI }) +
      label(200, 292, 'Maryam, age 37', { size: 14, fill: DIM }),
  ),
  // 10 Her secret
  draw(
    'A circle approximated by regular polygons with 6, 12 and 48 sides: the slower, finer drawing reveals the curve',
    [[70, 6], [200, 12], [330, 48]].map(([x, n]) =>
      circle(x, 150, 52, DIM, 'none', 1.5, ' stroke-dasharray="4 4"') + ngon(n, x, 150, 52, { stroke: HI, w: 2.5 }) +
      label(x, 232, `${n} sides`, { size: 14 }),
    ).join('') +
      arrow(126, 150, 142, 150, OK, 2.5) + arrow(256, 150, 272, 150, OK, 2.5) +
      label(200, 50, 'slow, finer drawing finds the curve', { size: 15, fill: DIM }) +
      label(200, 286, 'the beauty comes with time', { size: 15, fill: HI }),
  ),
  // 11 Why she matters
  draw(
    'A rising path from age 13, failing a math test, to age 14 loving a puzzle, age 17 Olympiad gold, and age 37 the Fields Medal',
    line(72, 250, 83, 214, OK, 3) + line(83, 214, 115, 164, OK, 3) + line(115, 164, 328, 82, OK, 3) +
      dot(72, 250, 8, NO) + dot(83, 214, 7, INK) + dot(115, 164, 7, INK) + dot(328, 82, 10, HI) +
      line(328, 82, 375, 64, OK, 2.5, '6 6') +
      label(30, 280, '13: failed a test', { size: 13, fill: NO, anchor: 'start' }) +
      label(98, 222, '14: loved a puzzle', { size: 13, anchor: 'start' }) +
      label(130, 170, '17: Olympiad gold', { size: 13, anchor: 'start' }) +
      label(318, 66, '37: Fields Medal', { size: 13, fill: HI, anchor: 'end' }) +
      label(200, 36, 'math belongs to everyone', { size: 15, fill: DIM }),
  ),
  // 12 Nets you can try
  draw(
    'The net of a cereal box 8 by 3 by 10: two faces of 80, two of 30 and two of 24, which add to a surface area of 268',
    rect(150, 40, 64, 24, INK, '#60a5fa22', 2.5) +
      rect(150, 64, 64, 80, INK, '#fbbf241a', 2.5) +
      rect(150, 144, 64, 24, INK, '#60a5fa22', 2.5) +
      rect(150, 168, 64, 80, INK, '#fbbf241a', 2.5) +
      rect(126, 64, 24, 80, INK, '#34d3991f', 2.5) +
      rect(214, 64, 24, 80, INK, '#34d3991f', 2.5) +
      label(182, 110, '80', { size: 15, fill: HI }) +
      label(182, 214, '80', { size: 15, fill: HI }) +
      label(182, 57, '24', { size: 12, fill: SKY }) +
      label(182, 161, '24', { size: 12, fill: SKY }) +
      label(138, 108, '30', { size: 12, fill: OK }) +
      label(226, 108, '30', { size: 12, fill: OK }) +
      label(320, 100, '80 + 80', { size: 15, fill: HI }) +
      label(320, 130, '+ 30 + 30', { size: 15, fill: OK }) +
      label(320, 160, '+ 24 + 24', { size: 15, fill: SKY }) +
      label(320, 200, '= 268', { size: 20 }) +
      label(80, 110, 'box', { size: 13, fill: DIM }) +
      label(80, 128, '8 × 3 × 10', { size: 12, fill: DIM }) +
      label(200, 290, 'the six faces add to the surface area', { size: 13, fill: DIM }),
  ),
  // 13 Pro tip: go slow on purpose
  draw(
    'A tiny box sketch where nothing can be seen beside a big box drawing with every edge labelled 4, 3 and 2',
    box(40, 150, 24, 18, 10, DIM) +
      label(62, 205, 'too small', { size: 12, fill: NO }) +
      box(170, 120, 140, 105, 40, HI, '#fbbf241a') +
      label(240, 250, '4', { size: 16 }) +
      label(155, 178, '3', { size: 16 }) +
      label(348, 108, '2', { size: 16, anchor: 'start' }) +
      label(200, 40, 'slow down, draw it big', { size: 17, fill: HI }) +
      label(200, 296, 'big: every face and edge shows', { size: 14, fill: OK }),
  ),
  // 14 Trap: area vs surface area
  draw(
    'A cube with 2-unit edges: one face has area 2 times 2 equals 4, and all six faces give 6 times 4 equals 24',
    box(130, 130, 100, 100, 50, INK, '#fbbf2440') +
      label(180, 252, '2', { size: 16 }) +
      label(114, 186, '2', { size: 16 }) +
      label(180, 186, '4', { size: 22, fill: HI }) +
      label(200, 40, 'one face: 2 × 2 = 4', { size: 16, fill: HI }) +
      label(200, 292, 'surface area: 6 × 4 = 24', { size: 17, fill: OK }),
  ),
  // 15 Her legacy in your app
  draw(
    'A path from a cube with 6 flat faces, to a donut with 1 hole, to a curved sphere standing for the universe',
    box(42, 135, 44, 44, 18, HI) +
      ellipse(200, 150, 52, 32, INK, 'none', 3) + hole(200, 148, 22) +
      circle(330, 150, 44, SKY, '#60a5fa1a', 3) + ellipse(330, 150, 44, 13, SKY, 'none', 1.5) +
      arrow(116, 150, 140, 150, OK, 2.5) + arrow(258, 150, 280, 150, OK, 2.5) +
      label(70, 228, 'cube', { size: 14 }) +
      label(200, 228, 'donut', { size: 14 }) +
      label(330, 228, 'universe', { size: 14 }) +
      label(70, 252, '6 flat faces', { size: 12, fill: DIM }) +
      label(200, 252, 'curved, 1 hole', { size: 12, fill: DIM }) +
      label(330, 252, 'curved space', { size: 12, fill: DIM }) +
      label(200, 50, 'from nets to curved surfaces', { size: 15, fill: HI }) +
      label(200, 296, 'she kept walking', { size: 14, fill: OK }),
  ),
  // learned
  tex(
    ['\\text{surface area} = \\text{sum of every face}', '\\text{cube: } 6 \\times 2^2 = 24', '\\text{box: } 2(80) + 2(30) + 2(24) = 268', '\\text{sphere: } 4\\pi r^2'],
    'Nets and surface area work for any shape, even curvy ones',
  ),
];

// ── Honeycombs ─────────────────────────────────────────────────────────────

const honeycomb: MathFigure[] = [
  // 1 Inside a hive
  draw(
    'A honeycomb of hexagonal cells with one cell highlighted to show its 6 walls',
    hexGrid(30, 52, 26, 8, 5, HI, 2.5, '#fbbf2414') +
      ngon(6, 30 + 3 * 45.03 + 22.5, 52 + 2 * 39, 26, { stroke: OK, w: 4.5, fill: '#34d39944' }) +
      label(200, 266, 'every cell: 6 walls', { size: 16, fill: OK }) +
      label(200, 298, 'built for ≈ 100 million years', { size: 14, fill: DIM }),
  ),
  // 2 Why not squares?
  draw(
    'Three ways to fill a panel: circles leave wasted gaps, squares tile, and hexagons tile with the least wall',
    rect(10, 80, 120, 120, NO, '#f472b655', 2) +
      Array.from({ length: 16 }, (_, i) => circle(25 + (i % 4) * 30, 95 + Math.floor(i / 4) * 30, 15, INK, '#312e81', 2)).join('') +
      Array.from({ length: 5 }, (_, i) => line(140 + i * 30, 80, 140 + i * 30, 200, INK, 2) + line(140, 80 + i * 30, 260, 80 + i * 30, INK, 2)).join('') +
      hexGrid(287, 95, 15, 4, 5, OK, 2) +
      label(70, 230, 'circles', { size: 14, fill: NO }) +
      label(200, 230, 'squares', { size: 14 }) +
      label(330, 230, 'hexagons', { size: 14, fill: OK }) +
      label(70, 254, 'gaps wasted', { size: 12, fill: DIM }) +
      label(200, 254, 'more wall', { size: 12, fill: DIM }) +
      label(330, 254, 'least wall', { size: 12, fill: DIM }) +
      label(200, 44, 'same area: which uses least wall?', { size: 15, fill: HI }),
  ),
  // 3 Why it matters
  draw(
    'Eight one-gram blocks of honey turn into one gram of wax',
    Array.from({ length: 8 }, (_, i) => rect(40 + (i % 4) * 36, 110 + Math.floor(i / 4) * 36, 30, 30, HI, '#fbbf2455', 2, 4)).join('') +
      arrow(195, 143, 255, 143, INK, 3) +
      rect(280, 113, 60, 60, INK, '#ece9ff33', 3, 4) +
      label(110, 210, '8 g honey', { size: 16, fill: HI }) +
      label(310, 210, '1 g wax', { size: 16 }) +
      label(200, 50, 'bees eat honey to make wax', { size: 15, fill: DIM }) +
      label(200, 286, 'less wall = less wax = more honey', { size: 14, fill: OK }),
  ),
  // 4 Bees know math
  draw(
    'A broken timeline: bees found hexagons by trial and error about 100 million years ago; mathematicians proved hexagons are best in 1999',
    line(40, 170, 180, 170, DIM, 3) + line(212, 170, 360, 170, DIM, 3) +
      line(176, 182, 188, 158, DIM, 2.5) + line(206, 182, 218, 158, DIM, 2.5) +
      dot(60, 170, 9, HI) + dot(340, 170, 9, OK) +
      ngon(6, 60, 110, 18, { stroke: HI }) +
      label(40, 214, '≈ 100 million years ago', { size: 13, anchor: 'start' }) +
      label(40, 238, 'bees: trial and error', { size: 12, fill: DIM, anchor: 'start' }) +
      label(360, 140, '1999: proved', { size: 14, fill: OK, anchor: 'end' }) +
      label(360, 116, 'mathematicians', { size: 12, fill: DIM, anchor: 'end' }) +
      label(200, 290, 'the bees knew first', { size: 17, fill: HI }),
  ),
  // 5 Compare the perimeters
  draw(
    'Bar chart of wall needed to enclose area 10: triangle about 15, square 12.6, hexagon about 11.8',
    ngon(3, 50, 95, 22, { stroke: INK }) + ngon(4, 50, 165, 22, { stroke: INK, rot: -45 }) + ngon(6, 50, 235, 22, { stroke: OK }) +
      rect(90, 76, 270, 38, NO, '#f472b644', 2, 4) +
      rect(90, 146, 227, 38, SKY, '#60a5fa44', 2, 4) +
      rect(90, 216, 212, 38, OK, '#34d39955', 2, 4) +
      label(366, 101, '15', { size: 15, fill: NO, anchor: 'start' }) +
      label(325, 171, '12.6', { size: 15, fill: SKY, anchor: 'start' }) +
      label(310, 241, '11.8', { size: 15, fill: OK, anchor: 'start' }) +
      label(200, 40, 'each shape encloses area 10', { size: 15 }) +
      label(200, 290, 'wall needed (perimeter)', { size: 13, fill: DIM }),
    'Six sides wins',
  ),
  // 6 Pro tip: only 3 shapes tile
  draw(
    'At one corner, 6 triangles of 60 degrees, 4 squares of 90 degrees, or 3 hexagons of 120 degrees each make exactly 360 degrees',
    ngonPts(6, 70, 150, 48, 0).map(([x, y]) => line(70, 150, +f1(x), +f1(y), HI, 2.5)).join('') +
      ngon(6, 70, 150, 48, { stroke: HI, rot: 0, w: 2.5 }) +
      rect(158, 108, 42, 42, HI, 'none', 2.5) + rect(200, 108, 42, 42, HI, 'none', 2.5) +
      rect(158, 150, 42, 42, HI, 'none', 2.5) + rect(200, 150, 42, 42, HI, 'none', 2.5) +
      ngon(6, 330, 122, 28, { stroke: HI, w: 2.5 }) +
      ngon(6, 330 - 28 * 0.866, 164, 28, { stroke: HI, w: 2.5 }) +
      ngon(6, 330 + 28 * 0.866, 164, 28, { stroke: HI, w: 2.5 }) +
      dot(70, 150, 6, OK) + dot(200, 150, 6, OK) + dot(330, 150, 6, OK) +
      label(70, 240, '6 × 60° = 360°', { size: 12, fill: OK }) +
      label(200, 240, '4 × 90° = 360°', { size: 12, fill: OK }) +
      label(330, 240, '3 × 120° = 360°', { size: 12, fill: OK }) +
      label(70, 268, 'triangles', { size: 13 }) +
      label(200, 268, 'squares', { size: 13 }) +
      label(330, 268, 'hexagons', { size: 13 }) +
      label(200, 50, 'corners must make 360°', { size: 16, fill: HI }),
  ),
  // 7 Trap: pentagons don't fit
  draw(
    'Three regular pentagons around one point use 3 times 108 equals 324 degrees and leave a 36 degree gap',
    (() => {
      const V: [number, number] = [200, 165];
      const s = 70;
      let out = poly([V, [V[0] + 80 * Math.cos(rad(72)), V[1] - 80 * Math.sin(rad(72))], [V[0] + 80 * Math.cos(rad(108)), V[1] - 80 * Math.sin(rad(108))]], NO, '#f472b666', 2);
      for (const start of [108, 216, 324]) {
        const pts: [number, number][] = [V];
        let [x, y] = V;
        for (let k = 0; k < 4; k++) {
          const a = rad(start + 72 * k);
          x += s * Math.cos(a);
          y -= s * Math.sin(a);
          pts.push([x, y]);
        }
        out += poly(pts, HI, '#fbbf241a', 3);
      }
      return out;
    })() +
      dot(200, 165, 6, INK) +
      label(166, 160, '108°', { size: 12 }) +
      label(200, 200, '108°', { size: 12 }) +
      label(234, 160, '108°', { size: 12 }) +
      label(200, 50, 'gap: 36°', { size: 16, fill: NO }) +
      line(200, 58, 200, 88, NO, 2) +
      label(200, 302, '3 × 108° = 324°, not 360°', { size: 15, fill: HI }),
  ),
  // 8 Hexagons all around you
  draw(
    'A cross-section of a honeycomb panel: two thin skins with a hexagon core between them',
    rect(30, 80, 340, 14, INK, '#ece9ff55', 2) +
      rect(30, 222, 340, 14, INK, '#ece9ff55', 2) +
      hexGrid(48, 115, 18, 10, 4, HI, 2) +
      label(200, 66, 'thin skin', { size: 13, fill: DIM }) +
      label(200, 30, 'honeycomb panel', { size: 16, fill: HI }) +
      label(200, 268, 'hexagon core: strong and light', { size: 14, fill: OK }) +
      label(200, 298, 'aircraft, cardboard, mirrors', { size: 12, fill: DIM }),
  ),
  // learned
  tex(
    ['3 \\times 120^\\circ = 360^\\circ \\;\\text{(no gaps)}', '\\text{area } 10:\\; 15 > 12.6 > 11.8', '\\text{hexagon} = \\text{least wall}'],
    'Shape choice matters: hexagons pack space most efficiently',
  ),
];

// ── Benjamin Banneker ──────────────────────────────────────────────────────

const banneker: MathFigure[] = [
  // 1 Maryland, 1731
  draw(
    'Fifty-two squares for the weeks of one year, with only 6 highlighted: all the school Banneker ever had',
    Array.from({ length: 52 }, (_, i) => rect(31 + (i % 13) * 26, 100 + Math.floor(i / 13) * 26, 22, 22, i < 6 ? HI : DIM, i < 6 ? HI : 'none', 1.5, 3)).join('') +
      label(200, 44, 'born 1731, Maryland', { size: 17, fill: HI }) +
      label(200, 236, 'one year = 52 weeks', { size: 13, fill: DIM }) +
      label(200, 280, 'his whole schooling: 6 weeks', { size: 16, fill: HI }),
  ),
  // 2 He teaches himself
  draw(
    'An open borrowed book: one page works 47 times 23 equals 1081, the other shows a 3-4-5 right triangle used in surveying',
    poly([[200, 72], [40, 62], [40, 250], [200, 260]], DIM, '#ece9ff0d', 2.5) +
      poly([[200, 72], [360, 62], [360, 250], [200, 260]], DIM, '#ece9ff0d', 2.5) +
      label(150, 110, '47', { size: 16, anchor: 'end' }) +
      label(150, 134, '× 23', { size: 16, anchor: 'end' }) +
      line(90, 142, 156, 142, INK, 2) +
      label(150, 164, '141', { size: 16, anchor: 'end' }) +
      label(150, 188, '940', { size: 16, anchor: 'end' }) +
      line(90, 196, 156, 196, INK, 2) +
      label(150, 220, '1081', { size: 16, fill: OK, anchor: 'end' }) +
      poly([[240, 210], [330, 210], [330, 100]], HI, 'none', 3) +
      `<path d="M 316 210 L 316 196 L 330 196" fill="none" stroke="${HI}" stroke-width="2"/>` +
      label(285, 232, '4', { size: 14 }) +
      label(342, 160, '3', { size: 14, anchor: 'start' }) +
      label(268, 150, '5', { size: 14, anchor: 'end' }) +
      label(200, 40, 'borrowed books', { size: 15, fill: DIM }) +
      label(200, 292, 'by candlelight, every problem', { size: 14, fill: HI }),
  ),
  // 3 The wooden clock
  draw(
    'A clock face beside two meshing gears; he carved the clock at age 22 in 1753 and it ran for 40 years, to 1793',
    clock(110, 165, 80, 10, 10, HI) +
      gear(275, 130, 45, 18) +
      gear(325, 180, 30, 12, DIM) +
      label(200, 36, 'carved from wood, age 22', { size: 15, fill: HI }) +
      label(300, 245, 'every gear drawn', { size: 12, fill: DIM }) +
      label(200, 292, '1753 → 1793: 40 years', { size: 16, fill: OK }),
  ),
  // 4 Stars on the ceiling
  draw(
    'A solar eclipse: the Sun, the Moon and the Earth in one line, with the Moon’s shadow falling on the Earth',
    circle(30, 160, 70, HI, '#fbbf2455', 3) +
      line(40, 92, 330, 170, DIM, 1.5, '5 5') + line(40, 228, 330, 150, DIM, 1.5, '5 5') +
      poly([[230, 150], [230, 170], [314, 160]], DARK, DARK, 1) +
      circle(230, 160, 11, INK, INK, 1) +
      circle(340, 160, 30, SKY, '#60a5fa44', 3) +
      dot(312, 160, 5, NO) +
      label(48, 262, 'Sun', { size: 15, fill: HI }) +
      label(230, 132, 'Moon', { size: 14 }) +
      label(340, 214, 'Earth', { size: 14, fill: SKY }) +
      label(200, 40, 'predict the exact moment', { size: 16, fill: HI }) +
      label(200, 292, 'Sun, Moon, Earth in one line', { size: 14, fill: DIM }),
  ),
  // 5 The almanac
  draw(
    'An almanac table of four days with sunrise times 6.35, 6.33, 6.32, 6.30 hours and high-tide times as decimals',
    rect(60, 62, 280, 180, DIM, '#ece9ff0d', 2, 6) +
      line(60, 96, 340, 96, DIM, 2) + line(140, 62, 140, 242, DIM, 1.5) + line(240, 62, 240, 242, DIM, 1.5) +
      label(100, 85, 'day', { size: 13, fill: DIM }) +
      label(190, 85, 'sunrise', { size: 13, fill: DIM }) +
      label(290, 85, 'high tide', { size: 13, fill: DIM }) +
      [['Mon', '6.35', '2.15'], ['Tue', '6.33', '2.98'], ['Wed', '6.32', '3.80'], ['Thu', '6.30', '4.63']].map(([d, s, t], i) =>
        label(100, 128 + i * 34, d, { size: 15 }) + label(190, 128 + i * 34, s, { size: 15, fill: HI }) + label(290, 128 + i * 34, t, { size: 15, fill: SKY }),
      ).join('') +
      label(200, 40, 'a page of his almanac (hours)', { size: 14, fill: DIM }) +
      label(200, 286, 'thousands of decimals, by hand', { size: 15, fill: HI }),
  ),
  // 6 Why decimals matter
  draw(
    'A number line from 6.0 to 6.6 hours with sunrise at 6.32 and a band from 6.27 to 6.37 showing that 0.05 hour is 3 minutes',
    rect(184, 158, 53, 24, NO, '#f472b655', 1.5) +
      line(40, 170, 360, 170, INK, 3) +
      [0, 1, 2, 3, 4, 5, 6].map((k) => line(40 + k * 53.33, 162, 40 + k * 53.33, 178, INK, 2) + label(+f1(40 + k * 53.33), 202, `6.${k}`, { size: 12, fill: DIM })).join('') +
      line(210.7, 140, 210.7, 182, HI, 3) + dot(210.7, 170, 6, HI) +
      label(210, 128, '6.32', { size: 17, fill: HI }) +
      label(200, 44, 'sunrise at 6.32 hours', { size: 16 }) +
      label(200, 76, '6 hours + 32 hundredths', { size: 13, fill: DIM }) +
      label(200, 246, 'off by 0.05 h = 3 minutes', { size: 15, fill: NO }) +
      label(200, 286, '0.05 × 60 = 3', { size: 14, fill: DIM }),
  ),
  // 7 Surveying D.C.
  draw(
    'The ten-mile square of Washington, D.C., drawn as a diamond with 10-mile sides and an area of 100 square miles',
    poly([[200, 59], [306, 165], [200, 271], [94, 165]], HI, '#fbbf241a', 3.5) +
      `<path d="M 104 155 L 114 165 L 104 175" fill="none" stroke="${OK}" stroke-width="2"/>` +
      dot(200, 59, 6, INK) + dot(306, 165, 6, INK) + dot(200, 271, 6, INK) + dot(94, 165, 6, INK) +
      label(262, 104, '10 mi', { size: 14, anchor: 'start' }) +
      label(138, 236, '10 mi', { size: 14, anchor: 'end' }) +
      label(200, 158, '10 × 10', { size: 14 }) +
      label(200, 182, '= 100 sq mi', { size: 14, fill: HI }) +
      label(200, 30, '1791: the ten-mile square', { size: 15, fill: HI }) +
      label(200, 304, 'corners fixed by star sightings', { size: 12, fill: DIM }),
  ),
  // 8 The famous letter
  draw(
    'Banneker sends a letter with his almanac to Jefferson as proof',
    rect(14, 125, 106, 50, INK, 'none', 2.5, 8) + label(67, 156, 'Banneker', { size: 14 }) +
      rect(280, 125, 106, 50, INK, 'none', 2.5, 8) + label(333, 156, 'Jefferson', { size: 14 }) +
      arrow(124, 150, 274, 150, HI, 3) +
      rect(172, 122, 56, 36, HI, DARK, 2.5, 3) + path('M 172 122 L 200 142 L 228 122', HI, 2.5) +
      rect(176, 186, 48, 58, OK, DARK, 2.5, 3) +
      line(184, 202, 216, 202, OK, 1.5) + line(184, 214, 216, 214, OK, 1.5) + line(184, 226, 216, 226, OK, 1.5) +
      label(200, 270, 'letter + almanac', { size: 14, fill: DIM }) +
      label(200, 50, 'the almanac as proof', { size: 17, fill: HI }) +
      label(200, 300, '1791', { size: 14, fill: DIM }),
  ),
  // 9 Jefferson replies
  draw(
    'Jefferson writes back to Banneker and forwards the almanac across the Atlantic to the French Academy of Sciences in Paris',
    dot(70, 90, 9, INK) + dot(70, 240, 9, INK) + dot(330, 165, 10, SKY) +
      label(70, 70, 'Banneker', { size: 14 }) +
      label(70, 274, 'Jefferson', { size: 14 }) +
      arrow(70, 226, 70, 106, OK, 3) +
      label(82, 172, 'reply', { size: 13, fill: OK, anchor: 'start' }) +
      arrowTo(70, 240, 330, 165, 14, HI, 3) +
      label(202, 164, 'almanac forwarded', { size: 13, fill: HI }) +
      label(330, 140, 'Paris', { size: 15, fill: SKY }) +
      label(320, 200, 'French Academy', { size: 13 }) +
      label(320, 220, 'of Sciences', { size: 12, fill: DIM }) +
      path('M 160 262 q 12 -8 24 0 t 24 0 t 24 0 t 24 0', SKY, 2) +
      path('M 170 280 q 12 -8 24 0 t 24 0 t 24 0', SKY, 2) +
      label(210, 306, 'Atlantic', { size: 13, fill: SKY }),
  ),
  // 10 Decimals = precision
  draw(
    'A place-value chart for 6.32: ones, tenths, hundredths, thousandths; each place is ten times finer, from 60 minutes to 6 minutes to 36 seconds to 3.6 seconds',
    [['ones', '6', '1 h', '60 min'], ['tenths', '3', '0.1 h', '6 min'], ['hundredths', '2', '0.01 h', '36 s'], ['thousandths', '?', '0.001 h', '3.6 s']].map(([n, d, p, m], i) => {
      const cx = [70, 170, 260, 350][i];
      return rect(cx - 38, 110, 76, 76, i === 3 ? DIM : HI, 'none', 2.5, 6) +
        label(cx, 96, n, { size: 12, fill: DIM }) +
        label(cx, 163, d, { size: 34, fill: i === 3 ? DIM : HI }) +
        label(cx, 216, p, { size: 12 }) +
        label(cx, 262, m, { size: 12, fill: SKY });
    }).join('') +
      dot(120, 172, 5, INK) +
      label(120, 240, '÷10', { size: 12, fill: OK }) +
      label(215, 240, '÷10', { size: 12, fill: OK }) +
      label(305, 240, '÷10', { size: 12, fill: OK }) +
      label(200, 44, 'each place: 10× more precise', { size: 15, fill: HI }) +
      label(200, 300, 'one place in minutes or seconds', { size: 12, fill: DIM }),
  ),
  // 11 Decimal precision, worked out
  draw(
    'Zooming in: on a line from 6 to 7 hours, 6.3 only says somewhere in a 6-minute window; zoomed to 6.30 through 6.40, 6.32 pins a 36-second window',
    rect(136, 100, 32, 20, HI, '#fbbf2466', 1.5) +
      line(40, 110, 360, 110, INK, 3) +
      Array.from({ length: 11 }, (_, k) => line(40 + k * 32, 104, 40 + k * 32, 116, DIM, 2)).join('') +
      label(40, 140, '6', { size: 13, fill: DIM }) + label(360, 140, '7', { size: 13, fill: DIM }) + label(152, 140, '6.3', { size: 13, fill: HI }) +
      line(136, 120, 40, 222, DIM, 1.5, '5 5') + line(168, 120, 360, 222, DIM, 1.5, '5 5') +
      rect(104, 220, 32, 20, OK, '#34d39966', 1.5) +
      line(40, 230, 360, 230, INK, 3) +
      Array.from({ length: 11 }, (_, k) => line(40 + k * 32, 224, 40 + k * 32, 236, DIM, 2)).join('') +
      label(52, 260, '6.30', { size: 12, fill: DIM }) + label(348, 260, '6.40', { size: 12, fill: DIM }) + label(120, 260, '6.32', { size: 12, fill: OK }) +
      label(200, 70, '6.3 → a 6-minute window', { size: 15, fill: HI }) +
      label(200, 296, '6.32 → a 36-second window', { size: 15, fill: OK }),
    'Each digit divides the uncertainty by ten',
  ),
  // 12 Pro tip: estimate, then refine
  draw(
    'Three steps from a rough estimate of 6 hours, to 6.3, to 6.32, checking at each step',
    [['6', 'estimate'], ['6.3', 'check, adjust'], ['6.32', 'check, adjust']].map(([v, t], i) => {
      const x = 20 + i * 135;
      return rect(x, 120, 90, 60, i === 2 ? OK : HI, 'none', 3, 10) +
        label(x + 45, 160, v, { size: 24, fill: i === 2 ? OK : HI }) +
        label(x + 45, 210, t, { size: 12, fill: DIM });
    }).join('') +
      arrow(116, 150, 149, 150, INK, 3) + arrow(251, 150, 284, 150, INK, 3) +
      label(132, 106, 'finer', { size: 12, fill: SKY }) + label(267, 106, 'finer', { size: 12, fill: SKY }) +
      label(200, 50, 'coarse → fine', { size: 18, fill: HI }) +
      label(200, 276, 'big errors get caught early', { size: 15, fill: OK }),
  ),
  // 13 Trap: decimals aren't minutes
  draw(
    'Two clocks: 6:32 is the wrong reading of 6.32 hours; the right one is 6:19, because 0.32 times 60 is about 19 minutes',
    clock(100, 150, 70, 6, 32, NO) +
      clock(300, 150, 70, 6, 19, OK) +
      label(100, 252, '6:32', { size: 18, fill: NO }) +
      label(300, 252, '6:19', { size: 18, fill: OK }) +
      label(100, 282, 'NOT 6 h 32 min', { size: 12, fill: NO }) +
      label(300, 282, '0.32 × 60 ≈ 19 min', { size: 12, fill: OK }) +
      label(200, 42, '6.32 hours = ?', { size: 17, fill: HI }),
  ),
  // 14 Self-taught is still taught
  draw(
    'A graph of skill over time: a head-start line rises slowly while a steady-practice line starting lower climbs past it',
    line(50, 270, 370, 270, DIM, 2.5) + line(50, 270, 50, 50, DIM, 2.5) +
      line(50, 150, 370, 120, NO, 3) +
      line(50, 250, 370, 60, OK, 4) +
      dot(250, 131, 7, HI) +
      label(360, 48, 'steady practice', { size: 13, fill: OK, anchor: 'end' }) +
      label(365, 142, 'head start', { size: 13, fill: NO, anchor: 'end' }) +
      label(272, 166, 'catches up', { size: 12, fill: HI }) +
      label(56, 38, 'skill', { size: 12, fill: DIM }) +
      label(368, 292, 'time', { size: 12, fill: DIM, anchor: 'end' }) +
      label(56, 292, 'him: 6 weeks + a candle', { size: 12, fill: OK, anchor: 'start' }),
    'Curiosity plus steady practice',
  ),
  // learned
  tex(
    ['6.32\\text{ h} = 6\\text{ h} + 0.32 \\times 60\\text{ min}', '\\approx 6\\text{ h } 19\\text{ min}', '0.1\\text{ h} = 6\\text{ min}, \\quad 0.01\\text{ h} = 36\\text{ s}'],
    'Decimals turn "about 6 hours" into "exactly 6.32 hours"',
  ),
];

export const STORY_FIGURES_G3: Record<string, MathFigure[]> = {
  '6.G-2-story.mp4': hypatia,
  '6.G-4-story.mp4': mirzakhani,
  '6.G-6-story.mp4': honeycomb,
  '6.NS-1-story.mp4': banneker,
};
