import type { SlideArt, SlideBank } from './types';
import {
  AMB, EMR, INK, ROSE, SKY, VIO, W,
  arcPath, art, axes, balancePoint, boxPlot, circle, dot, draws, fades, flow, histogram, line,
  lineGraph, numberLine, path, pie, polygon, prism, rad, rect, rightMark, rightTriangle,
  shapeBox, sortedRow, text, triHeight, triangle, unitCircle,
} from '../slideArt';

// SAT Math slide decks, units 13-18: one-variable data, two-variable data and
// probability, angles and triangles, area and volume, right-triangle trig, and
// circles.

// ── figures only these decks need ──────────────────────────────────────────

/** A point on a ray from (cx, cy) at `deg` degrees (y up), `r` pixels out. */
const at = (cx: number, cy: number, deg: number, r: number): [number, number] => [
  cx + r * Math.cos(rad(deg)),
  cy - r * Math.sin(rad(deg)),
];

/** Two lines crossing: vertical angles equal, neighbours supplementary. */
function crossingLines(): SlideArt {
  const cx = 200, cy = 140;
  const ray = (deg: number) => at(cx, cy, deg, 150);
  let b = text(W / 2, 22, 'Vertical angles match', { size: 12, fill: VIO });
  const [a1x, a1y] = ray(30), [a2x, a2y] = ray(210);
  const [b1x, b1y] = ray(145), [b2x, b2y] = ray(325);
  b += draws(line(a2x, a2y, a1x, a1y, INK, 2.4), 320);
  b += draws(line(b2x, b2y, b1x, b1y, INK, 2.4), 320, 0.2);
  b += path(arcPath(cx, cy, 26, 30, 145), SKY, 2.4) + path(arcPath(cx, cy, 26, 210, 325), SKY, 2.4);
  b += path(arcPath(cx, cy, 34, 145, 210), ROSE, 2.4) + path(arcPath(cx, cy, 34, -35, 30), ROSE, 2.4);
  const lab = (deg: number, s: string, c: string) => {
    const [x, y] = at(cx, cy, deg, 56);
    return fades(text(x, y + 5, s, { size: 14, fill: c }), 0.5);
  };
  b += lab(87.5, '115°', SKY) + lab(267.5, '115°', SKY) + lab(177.5, '65°', ROSE) + lab(357.5, '65°', ROSE);
  return art('Two straight lines crossing, making a pair of 115 degree angles opposite each other and a pair of 65 degree angles opposite each other', b, 'Opposite angles are equal; side-by-side angles make 180°.');
}

/** Two parallel lines cut by a transversal at 72°. */
function parallelCut(): SlideArt {
  const y1 = 90, y2 = 180, xLow = 180;
  const k = 1 / Math.tan(rad(72));
  const xAt = (y: number) => xLow + (y2 - y) * k;
  let b = text(W / 2, 22, 'Only two angle sizes', { size: 12, fill: VIO });
  b += line(40, y1, 360, y1, SKY, 2.6) + line(40, y2, 360, y2, SKY, 2.6);
  b += text(352, y1 - 8, 'parallel', { size: 11, fill: SKY, anchor: 'end' });
  b += draws(line(xAt(240), 240, xAt(40), 40, INK, 2.4), 230);
  const up = xAt(y1);
  b += path(arcPath(up, y1, 22, 0, 72), AMB, 2.4) + path(arcPath(up, y1, 30, 72, 180), EMR, 2.4);
  b += path(arcPath(xLow, y2, 22, 0, 72), AMB, 2.4);
  const lab = (x: number, y: number, deg: number, r: number, s: string, c: string) => {
    const [px, py] = at(x, y, deg, r);
    return fades(text(px, py + 5, s, { size: 13, fill: c }), 0.5);
  };
  b += lab(up, y1, 30, 50, '72°', AMB) + lab(up, y1, 128, 50, '108°', EMR) + lab(xLow, y2, 30, 50, '72°', AMB);
  return art('Two parallel lines crossed by a transversal; the matching corners are both 72 degrees and the neighbouring angle is 108 degrees', b, 'Every angle is 72° or 108°, and the two sizes add to 180°.');
}

/** A triangle with its base extended: the exterior angle is the two far angles. */
function exteriorAngle(): SlideArt {
  const A: [number, number] = [70, 210], B: [number, number] = [270, 210];
  const ac = (200 * Math.sin(rad(50))) / Math.sin(rad(75));
  const C = at(A[0], A[1], 55, ac);
  let b = text(W / 2, 22, 'Outside = the two far insides', { size: 12, fill: VIO });
  b += polygon([A, B, C], AMB, `${AMB}18`, 2.6);
  b += line(B[0], B[1], 370, B[1], INK, 2.4, '6 5');
  b += path(arcPath(A[0], A[1], 26, 0, 55), SKY, 2.4);
  b += path(arcPath(C[0], C[1], 22, 235, 310), SKY, 2.4);
  b += path(arcPath(B[0], B[1], 28, 0, 130), ROSE, 2.6);
  b += text(A[0] + 44, A[1] - 10, '55°', { size: 13, fill: SKY });
  b += text(C[0] + 2, C[1] + 44, '75°', { size: 13, fill: SKY });
  b += fades(text(B[0] + 42, B[1] - 40, '130°', { size: 14, fill: ROSE }), 0.5);
  return art('A triangle with angles of 55 and 75 degrees; its base is extended past the third corner, making an exterior angle of 130 degrees', b, 'The exterior angle is 55° + 75°, not the 50° beside it.');
}

/** A 10 × 8 rectangle with a 4 × 3 hole. */
function rectWithHole(): SlideArt {
  const x0 = 90, y0 = 46, s = 22;
  let b = text(W / 2, 24, 'Whole minus hole', { size: 12, fill: VIO });
  b += rect(x0, y0, 10 * s, 8 * s, AMB, `${AMB}22`, 2.6, 4);
  b += rect(x0 + 5 * s, y0 + 2 * s, 4 * s, 3 * s, ROSE, 'none', 2.4, 3);
  b += text(x0 + 7 * s, y0 + 3.5 * s + 5, '4 × 3', { size: 13, fill: ROSE });
  b += text(x0 + 5 * s, y0 + 8 * s + 20, '10', { size: 13, fill: EMR });
  b += text(x0 - 10, y0 + 4 * s + 4, '8', { size: 13, fill: SKY, anchor: 'end' });
  b += fades(text(x0 + 2.5 * s, y0 + 6 * s + 6, '80 − 12', { size: 15, fill: VIO }), 0.5);
  return art('A 10 by 8 rectangle with a 4 by 3 rectangular hole cut out of it', b, 'Find the big area, then take away the hole.');
}

/** Two data sets with the same mean and very different spread. */
function spreadRows(): SlideArt {
  const X = (v: number) => 40 + ((v - 10) / 80) * 320;
  let b = text(W / 2, 22, 'Same mean, different spread', { size: 12, fill: VIO });
  const row = (y: number, vals: number[], c: string, name: string) => {
    let r = line(X(10), y, X(90), y, INK, 1.6, undefined, 0.5);
    for (const v of vals) r += fades(dot(X(v), y - 10, 7, c), 0.3);
    r += text(X(10), y - 26, name, { size: 12, fill: c, anchor: 'start' });
    return r;
  };
  b += row(100, [48, 50, 52], SKY, 'Set A: 48, 50, 52');
  b += row(190, [20, 50, 80], ROSE, 'Set B: 20, 50, 80');
  for (const v of [10, 30, 50, 70, 90]) b += text(X(v), 214, String(v), { size: 11, op: 0.7 });
  b += line(X(50), 60, X(50), 200, VIO, 1.6, '5 5');
  b += text(X(50) + 6, 56, 'mean 50', { size: 11, fill: VIO, anchor: 'start' });
  return art('Two rows of dots: set A bunched tightly around 50 and set B spread from 20 to 80, both with mean 50', b, 'Set B sits farther from its mean, so its standard deviation is larger.');
}

/** A circle drawn on true-scale axes: (x − 2)² + (y + 1)² = 9. */
function circleOnGrid(): SlideArt {
  const ax = axes({ x: [-5, 8.92], y: [-5, 3] }, { ticks: { x: [-4, -2, 4, 6, 8], y: [-4, -2, 2] }, grid: true, xLabel: 'x', yLabel: 'y' });
  const px = 348 / 13.92;
  let b = text(392, 16, '(x − 2)² + (y + 1)² = 9', { size: 12, fill: VIO, anchor: 'end' }) + ax.body;
  b += draws(circle(ax.X(2), ax.Y(-1), 3 * px, AMB, `${AMB}14`, 2.8), 520);
  b += dot(ax.X(2), ax.Y(-1), 5, ROSE);
  b += line(ax.X(2), ax.Y(-1), ax.X(5), ax.Y(-1), EMR, 2.4);
  b += text(ax.X(3.5), ax.Y(-1) + 18, 'radius 3', { size: 11, fill: EMR });
  b += text(ax.X(2) - 8, ax.Y(-1) + 18, '(2, −1)', { size: 11, fill: ROSE, anchor: 'end' });
  return art('A circle of radius 3 centred at the point (2, −1) on a coordinate grid', b, 'Center (2, −1), radius 3: read both straight from the equation.');
}

/** A sector: a 60° slice of a circle of radius 9. */
function sector(deg: number, label: string, title: string, caption: string): SlideArt {
  const cx = 200, cy = 146, r = 96;
  let b = text(W / 2, 22, title, { size: 12, fill: VIO });
  b += circle(cx, cy, r, INK, 'none', 2, '5 5');
  const [x1, y1] = at(cx, cy, 0, r), [x2, y2] = at(cx, cy, deg, r);
  b += fades(path(`M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${deg > 180 ? 1 : 0} 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`, AMB, 2.6, `${AMB}33`), 0.2);
  b += path(arcPath(cx, cy, r, 0, deg), ROSE, 4);
  b += path(arcPath(cx, cy, 24, 0, deg), SKY, 2.2);
  const [lx, ly] = at(cx, cy, deg / 2, 42);
  b += text(lx, ly + 5, `${deg}°`, { size: 13, fill: SKY });
  const [ax2, ay2] = at(cx, cy, deg / 2, r + 20);
  b += text(ax2 + 4, ay2 + 4, label, { size: 13, fill: ROSE, anchor: 'start' });
  b += text(cx + r / 2, cy + 18, 'r = 9', { size: 12, fill: EMR });
  return art(`A circle of radius 9 with a ${deg} degree sector shaded and its arc highlighted`, b, caption);
}

/** A tangent line meets the radius at a right angle. */
function tangentLine(): SlideArt {
  const cx = 170, cy = 140, r = 80;
  const [tx, ty] = at(cx, cy, 40, r);
  const dir = 130;
  const [e1x, e1y] = at(tx, ty, dir, 90), [e2x, e2y] = at(tx, ty, dir + 180, 90);
  let b = text(W / 2, 248, 'Radius ⟂ tangent', { size: 12, fill: VIO });
  b += circle(cx, cy, r, AMB, `${AMB}14`, 2.6);
  b += dot(cx, cy, 4.5, INK);
  b += line(cx, cy, tx, ty, EMR, 2.6);
  b += draws(line(e2x, e2y, e1x, e1y, ROSE, 2.6), 260);
  b += rightMark(tx, ty, 220, 310, 11);
  b += text(e2x + 6, e2y + 4, 'tangent', { size: 12, fill: ROSE, anchor: 'start' });
  const [mx, my] = at(cx, cy, 40, r / 2);
  b += text(mx - 14, my + 4, 'radius', { size: 12, fill: EMR, anchor: 'end' });
  return art('A circle with a radius drawn to the point where a tangent line touches, marked with a right angle', b, 'The right angle hands you a right triangle for Pythagoras.');
}


export const SAT_SLIDES_U13_18: SlideBank = {
  // ---------------- SAT-13 — One-variable data ----------------
  'SAT-13': [
    {
      kind: 'objective',
      head: 'The middle, two ways',
      body: 'For the data 3, 7, 8, 10, 22 the mean is 10 but the median is 8. One big value pulled the mean up and left the median alone. You will learn which center to trust, how to judge spread, and how outliers move things.',
      art: balancePoint([3, 7, 8, 10, 22], 10, { lo: 0, hi: 25, median: 8, title: 'The mean balances; the median sits in the middle', caption: 'The 22 drags the balance point to the right of the median.' }),
    },
    {
      kind: 'concept',
      head: 'Mean and median',
      body: 'The MEAN adds everything and divides by how many there are. The MEDIAN is the middle value once the data are SORTED. With an even count, average the two middle values.',
      formula: { tex: '\\bar{x} = \\frac{\\text{sum of values}}{n}', note: 'The mean shares the total out equally.', parts: [{ sym: '\\bar{x}', means: 'the mean, often read as "x-bar"', tone: 'accent' }, { sym: 'n', means: 'how many values there are', tone: 'ok' }] },
      art: sortedRow([3, 7, 8, 10, 22], { middle: 2, label: 'median 8', title: 'Sorted: the middle one wins', caption: 'Five values, so the third is the median.' }),
    },
    {
      kind: 'concept',
      head: 'Outliers drag the mean, not the median',
      body: 'The mean uses every value, so one extreme value pulls it hard. The median only cares about position, so it barely moves. For skewed data, the median describes a typical value better.',
      compare: {
        cols: [
          { title: 'Mean', lines: ['Uses every value', 'Pulled toward outliers'], tone: 'warn' },
          { title: 'Median', lines: ['Uses only position', 'Resists outliers'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Skew: which way the tail runs',
      body: 'When a few values stretch far to the right, the data are skewed right. The long tail pulls the mean above the median. A tail to the left pulls the mean below it.',
      art: histogram(['0–10', '10–20', '20–30', '30–40', '40–50', '50–60'], [9, 7, 4, 2, 1, 1], { title: 'Skewed right', yLabel: 'count', caption: 'The tail on the right pulls the mean past the median.' }),
    },
    {
      kind: 'concept',
      head: 'Standard deviation measures spread',
      body: 'Standard deviation is roughly the typical distance from the mean. Tightly bunched data have a small one; spread-out data have a large one. On the SAT you compare them by eye — no calculating.',
      art: spreadRows(),
    },
    {
      kind: 'example',
      head: 'Mean and median of 3, 7, 8, 10, 22',
      body: 'Add them and divide by 5 for the mean.\nThe list is already sorted, so the median is the middle value.\nMean 10, median 8.',
      steps: { steps: [{ tex: '3 + 7 + 8 + 10 + 22 = 50', text: 'The sum of all five values.' }, { tex: '50 \\div 5 = 10', text: 'Divide by how many there are.' }, { tex: '\\text{median} = 8', text: 'The third of five sorted values.' }], answer: '\\bar{x} = 10,\\ \\text{median} = 8' },
    },
    {
      kind: 'example',
      head: 'Change the outlier: 22 becomes 12',
      body: 'The sum drops by 10, from 50 to 40, so the mean falls to 8. The sorted list is 3, 7, 8, 10, 12 — the middle value is still 8. The mean moved; the median did not.',
      table: { head: ['Data', 'Mean', 'Median'], rows: [['3, 7, 8, 10, 22', '10', '8'], ['3, 7, 8, 10, 12', '8', '8']], mark: 1, note: 'Only the mean noticed the change.' },
    },
    {
      kind: 'example',
      head: 'What fifth score makes the average 88?',
      body: 'Four tests average 85, so they total 340. Five tests averaging 88 must total 440. The fifth score is the difference: 100.',
      formula: { tex: '\\begin{gathered} 5(88) - 4(85) \\\\ = 440 - 340 = 100 \\end{gathered}', note: 'Work with totals, not averages.', parts: [{ sym: '5(88)', means: 'the total five tests need', tone: 'accent' }, { sym: '4(85)', means: 'the total the first four already have', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: balance the shortfalls',
      body: 'Each of the four tests is 3 points short of 88, so together they are 12 points short. The fifth test has to make up the whole gap: 88 + 12 = 100.',
      steps: { steps: [{ tex: '4 \\times (88 - 85) = 12', text: 'Four tests, each 3 below the target.' }, { tex: '88 + 12 = 100', text: 'The fifth covers the gap.' }], answer: '100' },
    },
    {
      kind: 'example',
      head: 'An even count: 4, 9, 1, 7, 12, 6',
      body: 'Sort first: 1, 4, 6, 7, 9, 12. Six values means two middles, 6 and 7. Their average is 6.5, so the median is 6.5.',
      art: sortedRow([1, 4, 6, 7, 9, 12], { middle: [2, 3], label: 'median (6 + 7) ÷ 2 = 6.5', title: 'Two middles: average them', caption: 'With an even count the median may not be in the list.' }),
    },
    {
      kind: 'example',
      head: 'Picture it first: household incomes',
      body: 'Incomes are skewed right: most are moderate, a few are huge. Sketch the box plot and the long right whisker jumps out. Those few big values pull the mean above the median.',
      art: boxPlot([20, 35, 45, 70, 150], 0, 160, { title: 'A long whisker to the right', step: 20, caption: 'In thousands of dollars. The median is 45; the mean is higher.' }),
    },
    {
      kind: 'protip',
      head: 'New-mean questions: use sums',
      body: 'Averages cannot be added, but totals can. Turn every mean into a sum, add or remove values, then divide by the new count.',
      formula: { tex: '\\bar{x}_{\\text{new}} = \\frac{\\text{old sum} + \\text{new value}}{n + 1}', note: 'Sum, adjust, divide.', parts: [{ sym: '\\text{old sum}', means: 'the old mean times the old count', tone: 'accent' }, { sym: 'n + 1', means: 'the count after adding one value', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Sort before the median',
      body: 'The middle of an unsorted list is just whatever happened to land there. In 4, 9, 1, 7, 12 the middle entry is 1, but the real median is 7. Always sort first.',
      compare: {
        cols: [
          { title: 'Unsorted', tex: '4, 9, 1, 7, 12', lines: ['Middle entry 1: wrong'], tone: 'bad' },
          { title: 'Sorted', tex: '1, 4, 7, 9, 12', lines: ['Middle entry 7: right'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: remove a value',
      body: 'Six numbers have a mean of 20. One number, 50, is removed. What is the mean of the five that are left?',
      steps: { steps: [{ tex: '6 \\times 20 = 120', text: 'The total of all six.' }, { tex: '120 - 50 = 70', text: 'Remove the 50 from the total.' }, { tex: '70 \\div 5 = 14', text: 'Divide by the new count.' }], answer: '14' },
    },
    {
      kind: 'summary',
      head: 'One-variable data, wrapped up',
      body: 'Mean is sum over count; median is the middle of the sorted list. Outliers and skew drag the mean toward the tail. Standard deviation is spread from the mean. For new means, work with sums.',
      table: { head: ['Change', 'Mean', 'Median'], rows: [['add a big outlier', 'rises a lot', 'barely moves'], ['right skew', 'above median', '—'], ['left skew', 'below median', '—']] },
    },
  ],

  // ---------------- SAT-14 — Two-variable data, probability, and inference ----------------
  'SAT-14': [
    {
      kind: 'objective',
      head: 'A line through a cloud of points',
      body: 'A scatterplot shows two measurements for each item. The line of best fit, y = 2.5x + 10, summarizes the trend and makes predictions. You will also read two-way tables and judge what a survey can prove.',
      art: lineGraph([{ m: 2.5, b: 10, label: 'y = 2.5x + 10', color: SKY }], { range: { x: [0, 10], y: [0, 40] }, points: [{ x: 1, y: 14 }, { x: 2, y: 13 }, { x: 3, y: 19 }, { x: 4, y: 18 }, { x: 5, y: 24 }, { x: 6, y: 23 }, { x: 7, y: 29 }, { x: 8, y: 28 }, { x: 9, y: 34 }], title: 'The trend, in one line', caption: 'Points scatter above and below the line of best fit.' }),
    },
    {
      kind: 'concept',
      head: 'Predict with the line, read its slope',
      body: 'To predict, plug x into the line of best fit. The slope is the PREDICTED change in y for each 1-unit increase in x — a prediction, not a promise about any single point.',
      formula: { tex: '\\hat{y} = mx + b', note: 'The hat means predicted, not measured.', parts: [{ sym: 'm', means: 'predicted change in y for each 1 in x', tone: 'accent' }, { sym: 'b', means: 'predicted y when x is zero', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Probability: favorable over total',
      body: 'Probability is the number of outcomes you want divided by the number possible. The hard part on the SAT is choosing the right TOTAL, which the wording of the question picks.',
      formula: { tex: 'P = \\frac{\\text{favorable}}{\\text{total}}', note: 'Always a number from 0 to 1.', parts: [{ sym: '\\text{favorable}', means: 'the outcomes the question asks about', tone: 'accent' }, { sym: '\\text{total}', means: 'the group the question limits you to', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Two-way tables',
      body: 'A two-way table sorts people by two questions at once. Each row and column has a total. "Given that" tells you to use one row or column as the whole.',
      table: { head: ['', 'Sport', 'No sport', 'Total'], rows: [['Juniors', '24', '36', '60'], ['Seniors', '56', '84', '140'], ['Total', '80', '120', '200']], mark: 0, note: 'Given junior: only the top row counts.' },
    },
    {
      kind: 'concept',
      head: 'What a study can justify',
      body: 'A RANDOM SAMPLE lets you generalize to the population it came from — and only that one. Only RANDOM ASSIGNMENT to groups lets you say one thing CAUSES another.',
      art: flow([{ label: 'Random sample → generalize', color: SKY }, { label: 'to that population only', color: AMB }, { label: 'Random assignment → cause', color: EMR }], { title: 'What each design earns you', horizontal: false, caption: 'Sampling earns generalization; assignment earns cause.' }),
    },
    {
      kind: 'example',
      head: 'Predict: y = 2.5x + 10 at x = 8',
      body: 'Substitute 8 for x.\nMultiply, then add the intercept.\nThe predicted value is 30.',
      steps: { steps: [{ tex: '2.5(8) = 20', text: 'The slope times x.' }, { tex: '20 + 10 = 30', text: 'Add the intercept.' }], answer: '\\hat{y} = 30' },
    },
    {
      kind: 'example',
      head: 'A conditional: P(sport | junior)',
      body: 'Given junior means the whole is the 60 juniors.\nOf them, 24 play a sport.\nSo the probability is 24 ÷ 60 = 0.4.',
      steps: { steps: [{ tex: '\\text{total} = 60', text: 'Given junior: use the junior row only.' }, { tex: '\\frac{24}{60} = 0.4', text: 'Juniors who play, over all juniors.' }], answer: '0.4' },
    },
    {
      kind: 'example',
      head: 'Another way: shrink the table',
      body: 'Cross out every row the "given" rules out. What is left is a small table with just the juniors. Now it is an ordinary probability: 24 out of 60.',
      table: { head: ['', 'Sport', 'No sport', 'Total'], rows: [['Juniors', '24', '36', '60'], ['(seniors crossed out)', '—', '—', '—']], mark: 0, note: 'The given shrinks the world to one row.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a bag of marbles',
      body: 'A bag has 5 red and 3 blue marbles. Draw it as a circle cut into 8 equal slices, 5 of them red. The chance of red is 5 out of 8.',
      art: pie([{ label: '5 red', part: 5, color: ROSE }, { label: '3 blue', part: 3, color: SKY }], { title: '5 of 8 slices are red', caption: 'P(red) = 5/8.' }),
    },
    {
      kind: 'example',
      head: 'Can the survey speak for the whole school?',
      body: 'A random sample of 9th graders found most like pizza. That sample represents 9th graders — not seniors, not the whole school. The conclusion can only reach as far as the sample.',
      compare: {
        cols: [
          { title: 'Justified', lines: ['Most 9th graders at the school like pizza'], tone: 'ok' },
          { title: 'Not justified', lines: ['Most students at the school like pizza'], tone: 'bad' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'A margin of error: 52% ± 4%',
      body: 'A poll estimates 52% support with a 4% margin of error. The true value is plausibly anywhere from 48% to 56%. Since 48% is possible, the poll cannot say a majority supports it.',
      art: numberLine(44, 60, [{ at: 52, label: '52%', color: ROSE }], { step: 2, span: { from: 48, to: 56, label: 'plausible: 48% to 56%' }, title: 'Estimate plus or minus 4', caption: 'The range crosses 50%, so a majority is not certain.' }),
    },
    {
      kind: 'protip',
      head: 'Say the slope as a sentence',
      body: 'Interpretation questions want the slope in words with units. "Each additional hour of study is associated with a predicted 2.5-point increase." Predicted, and per one unit.',
      formula: { tex: 'm = \\frac{\\Delta \\hat{y}}{\\Delta x}', note: 'Predicted change in y for each 1-unit change in x.', parts: [{ sym: '\\Delta \\hat{y}', means: 'the predicted change in the output', tone: 'accent' }, { sym: '\\Delta x', means: 'one more unit of the input', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'The "given" sets the denominator',
      body: 'P(sport | junior) and P(junior | sport) sound alike but use different totals. The first divides by the 60 juniors; the second by the 80 athletes.',
      compare: {
        cols: [
          { title: 'Given junior', tex: '\\frac{24}{60} = 0.4', lines: ['Out of all juniors'], tone: 'accent' },
          { title: 'Given sport', tex: '\\frac{24}{80} = 0.3', lines: ['Out of all athletes'], tone: 'warn' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: P(junior | sport)',
      body: 'Using the same table, a student is chosen from those who play a sport. What is the probability the student is a junior?',
      steps: { steps: [{ tex: '\\text{total} = 80', text: 'Given sport: use the sport column.' }, { tex: '\\frac{24}{80}', text: 'Juniors who play, over all who play.' }], answer: '0.3' },
    },
    {
      kind: 'summary',
      head: 'Two-variable data, wrapped up',
      body: 'Predict by plugging into the line of best fit; its slope is a predicted change per unit. Probability is favorable over total, and "given" picks the total. Random samples generalize; random assignment shows cause.',
      table: { head: ['Wording', 'Means'], rows: [['given A', 'divide by the A total'], ['random sample', 'generalize to that population'], ['random assignment', 'can conclude cause'], ['± margin', 'a range of plausible values']] },
    },
  ],

  // ---------------- SAT-15 — Lines, angles, and triangles ----------------
  'SAT-15': [
    {
      kind: 'objective',
      head: 'Every angle is hiding in a rule',
      body: 'A triangle with angles 48° and 67° has a third angle of 65°, because the three always add to 180°. A handful of rules like that answers nearly every angle question. You will learn them and spot which one applies.',
      art: triangle({ A: '48°', B: '67°', C: '65°', title: 'Three angles, always 180°', caption: '48 + 67 + 65 = 180.' }),
    },
    {
      kind: 'concept',
      head: 'Straight lines and vertical angles',
      body: 'Angles that make a straight line add to 180°. When two lines cross, the angles opposite each other are equal. So one angle tells you all four.',
      art: crossingLines(),
    },
    {
      kind: 'concept',
      head: 'Parallel lines: only two sizes',
      body: 'When a line cuts across two parallel lines, every angle it makes is one of just two sizes. The small ones are equal, the big ones are equal, and one of each adds to 180°.',
      art: parallelCut(),
      formula: { tex: 'a + b = 180^\\circ', note: 'The acute and obtuse angles are supplementary.', parts: [{ sym: 'a', means: 'the acute size, repeated at every crossing', tone: 'accent' }, { sym: 'b', means: 'the obtuse size, 180° minus a', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The exterior angle theorem',
      body: 'Extend one side of a triangle. The outside angle equals the sum of the two inside angles FARTHEST from it. It skips the triangle-sum step entirely.',
      art: exteriorAngle(),
      formula: { tex: '\\text{exterior} = \\text{far angle}_1 + \\text{far angle}_2', note: 'The two interior angles not touching it.', parts: [{ sym: '\\text{far angle}_1', means: 'an interior angle away from the exterior one', tone: 'accent' }, { sym: '\\text{exterior}', means: 'the angle outside, on the extended side', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Supplementary: one angle is 115°',
      body: 'The two angles make a straight line.\nA straight line is 180°.\nThe other angle is 65°.',
      steps: { steps: [{ tex: 'x + 115 = 180', text: 'Angles on a line add to 180°.' }, { tex: 'x = 180 - 115', text: 'Subtract the known angle.' }], answer: '65^\\circ' },
    },
    {
      kind: 'example',
      head: 'Third angle: 48° and 67°',
      body: 'The three angles of a triangle add to 180°.\nAdd the two you know.\nSubtract from 180°.',
      steps: { steps: [{ tex: '48 + 67 = 115', text: 'The two known angles.' }, { tex: '180 - 115 = 65', text: 'What is left for the third.' }], answer: '65^\\circ' },
    },
    {
      kind: 'example',
      head: 'Exterior 130°, one far angle 55°',
      body: 'The exterior angle equals the sum of the two far angles. So 130 = 55 + x, and the other far angle is 75°.',
      formula: { tex: '130 = 55 + x \\;\\Rightarrow\\; x = 75^\\circ', note: 'One step with the exterior angle theorem.', parts: [{ sym: '130', means: 'the exterior angle', tone: 'accent' }, { sym: '55 + x', means: 'the two far interior angles', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: use the straight line',
      body: 'No theorem needed. The angle beside the 130° exterior is 180 − 130 = 50° inside the triangle. Then the triangle sum gives 180 − 55 − 50 = 75°. Same answer.',
      steps: { steps: [{ tex: '180 - 130 = 50', text: 'The interior angle next to the exterior one.' }, { tex: '180 - 55 - 50 = 75', text: 'The triangle sum does the rest.' }], answer: '75^\\circ' },
    },
    {
      kind: 'example',
      head: 'Parallel lines: find the partner',
      body: 'One angle at a crossing is 72°. Its co-interior partner — between the parallels, on the same side — is supplementary. So it is 108°.',
      table: { head: ['Angle pair', 'Relationship', 'Partner of 72°'], rows: [['corresponding', 'equal', '72°'], ['alternate interior', 'equal', '72°'], ['co-interior', 'add to 180°', '108°']], mark: 2, note: 'Equal, or adding to 180° — nothing else.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: an isosceles triangle',
      body: 'The vertex angle is 40° and the two base angles are equal. Sketch it and label the base angles b. Then 2b + 40 = 180, so each base angle is 70°.',
      art: triangle({ A: 'b', B: 'b', C: '40°', shape: [[100, 210], [300, 210], [200, 50]], a: 'equal', b: 'equal', title: 'Equal sides, equal base angles', caption: '2b + 40 = 180, so b = 70°.' }),
    },
    {
      kind: 'example',
      head: 'Angles in a ratio: x, 2x, 3x',
      body: 'The three angles add to 180°, so x + 2x + 3x = 180. That is 6x = 180, and x = 30°. The angles are 30°, 60°, and 90°.',
      formula: { tex: 'x + 2x + 3x = 180 \\;\\Rightarrow\\; x = 30', note: 'Add the parts, then share out the 180°.', parts: [{ sym: '6x', means: 'the three angles together', tone: 'accent' }, { sym: '180', means: 'what every triangle\'s angles add to', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Spot equal sides, mark equal angles',
      body: 'Tick marks or the word "isosceles" mean two equal sides — and the angles opposite them are equal too. Mark them the moment you see them; the problem often solves itself.',
      art: flow([{ label: 'See equal sides', color: SKY }, { label: 'Mark the opposite angles equal', color: AMB }, { label: 'Use the 180° sum', color: EMR }], { title: 'The isosceles move', caption: 'Equal sides always come with equal angles.' }),
    },
    {
      kind: 'trap',
      head: 'The exterior angle is not its neighbor',
      body: 'The exterior angle equals the two FAR angles. The interior angle right next to it is its supplement, not its equal. Mixing them up gives 50° instead of 130°.',
      compare: {
        cols: [
          { title: 'Wrong partner', lines: ['Exterior = the angle beside it'], tone: 'bad' },
          { title: 'Right partners', lines: ['Exterior = the two far angles'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: two unknowns',
      body: 'In a triangle, one angle is 20° more than another, and the third angle is 70°. Find the smallest angle.',
      steps: { steps: [{ tex: 'x + (x + 20) + 70 = 180', text: 'Call the smallest x.' }, { tex: '2x + 90 = 180', text: 'Combine like terms.' }, { tex: '2x = 90', text: 'Subtract 90.' }], answer: '45^\\circ' },
    },
    {
      kind: 'summary',
      head: 'Angles and triangles, wrapped up',
      body: 'A straight line is 180° and vertical angles are equal. Parallel lines make only two angle sizes that add to 180°. Triangle angles add to 180°, and an exterior angle equals the two far interior angles.',
      table: { head: ['Rule', 'Says'], rows: [['straight line', 'adds to 180°'], ['vertical angles', 'equal'], ['triangle', 'adds to 180°'], ['exterior angle', 'sum of the two far angles']] },
    },
  ],

  // ---------------- SAT-16 — Area, volume, and similarity ----------------
  'SAT-16': [
    {
      kind: 'objective',
      head: 'Double the sides, quadruple the area',
      body: 'A 2 × 2 square holds four 1 × 1 squares, not two. Area and volume grow faster than length when a shape is scaled. You will use the area and volume formulas and scale them correctly.',
      art: shapeBox('2', '2', { wUnits: 2, hUnits: 2, grid: true, inside: '4', title: 'Twice the side, four times the area', caption: 'Scaling lengths by 2 scales area by 2² = 4.' }),
    },
    {
      kind: 'concept',
      head: 'Area formulas',
      body: 'A rectangle is length times width. A triangle is half of base times height, with the height at a right angle to the base. A circle is π r squared.',
      compare: {
        cols: [
          { title: 'Rectangle', tex: 'A = lw', lines: ['length × width'], tone: 'accent' },
          { title: 'Triangle', tex: 'A = \\tfrac{1}{2}bh', lines: ['half base × height'], tone: 'ok' },
          { title: 'Circle', tex: 'A = \\pi r^2', lines: ['pi × radius squared'], tone: 'warn' },
        ],
      },
      art: triHeight('base 12', 'height 5', { inside: 'A = 30', title: 'Height meets the base at a right angle', caption: 'Half of 12 × 5 is 30.' }),
    },
    {
      kind: 'concept',
      head: 'Volume: base area times height',
      body: 'A prism or cylinder is a stack of identical layers, so its volume is the area of the base times the height. A cone or pyramid is exactly one third of its matching prism.',
      formula: { tex: 'V = Bh, \\qquad V_{\\text{cone}} = \\tfrac{1}{3}Bh', note: 'Pointed solids hold a third as much.', parts: [{ sym: 'B', means: 'the area of the base layer', tone: 'accent' }, { sym: '\\tfrac{1}{3}', means: 'for a cone or pyramid only', tone: 'ok' }] },
      art: prism('4', '3', '5', { inside: 'V = 60', layers: 5, title: 'Five layers of 12', caption: 'Base 4 × 3 = 12, stacked 5 high: 60.' }),
    },
    {
      kind: 'concept',
      head: 'Similar figures scale by k, k², k³',
      body: 'If every length is multiplied by k, areas multiply by k² and volumes by k³. Area has two dimensions and volume has three, so the scale factor is used that many times.',
      table: { head: ['Measure', 'Scale by', 'When k = 3'], rows: [['length', 'k', '×3'], ['area', 'k²', '×9'], ['volume', 'k³', '×27']], note: 'One factor of k per dimension.' },
    },
    {
      kind: 'example',
      head: 'A cylinder: r = 3, h = 10',
      body: 'The base is a circle, so B = πr².\nMultiply by the height.\nThe volume is 90π.',
      steps: { steps: [{ tex: 'B = \\pi(3)^2 = 9\\pi', text: 'Area of the circular base.' }, { tex: 'V = 9\\pi \\times 10', text: 'Stack it 10 high.' }], answer: '90\\pi' },
    },
    {
      kind: 'example',
      head: 'A hole in a rectangle',
      body: 'A 10 × 8 rectangle has a 4 × 3 hole cut out. Find the whole area, 80, and subtract the hole, 12. The area left is 68.',
      art: rectWithHole(),
      formula: { tex: '10 \\times 8 - 4 \\times 3 = 68', note: 'Whole minus hole.', parts: [{ sym: '10 \\times 8', means: 'the whole rectangle, before the cut', tone: 'accent' }, { sym: '4 \\times 3', means: 'the hole, taken away', tone: 'bad' }] },
    },
    {
      kind: 'example',
      head: 'Similar triangles, area 5, scale 3',
      body: 'Areas scale by the square of the scale factor.\n3² = 9.\nThe larger triangle has area 45.',
      steps: { steps: [{ tex: 'k^2 = 3^2 = 9', text: 'Area uses the scale factor squared.' }, { tex: '5 \\times 9 = 45', text: 'Scale the small area.' }], answer: '45' },
    },
    {
      kind: 'example',
      head: 'Another way: count the copies',
      body: 'Scale a small square by 3 and nine copies of it fill the big one. So any area scaled by 3 is nine times as big: 5 becomes 45. The picture IS the rule.',
      art: shapeBox('3', '3', { wUnits: 3, hUnits: 3, grid: true, inside: '9 copies', title: 'Scale by 3: nine small squares', caption: 'Three across and three down makes nine.' }),
    },
    {
      kind: 'example',
      head: 'Similar triangles: find the side',
      body: 'Sides 4 and 6 correspond, so the scale factor is 6 ÷ 4 = 1.5. The small triangle\'s side of 10 matches a big side of 10 × 1.5 = 15.',
      formula: { tex: '\\frac{6}{4} = \\frac{x}{10} \\;\\Rightarrow\\; x = 15', note: 'Match corresponding sides, big over small both times.', parts: [{ sym: '6/4', means: 'the scale factor from small to big', tone: 'accent' }, { sym: 'x/10', means: 'the unknown big side over its small partner', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a cone of ice cream',
      body: 'A cone has radius 3 and height 4. Picture the cylinder it fits in: 9π × 4 = 36π. The cone is one third of that: 12π.',
      table: { head: ['Solid', 'Volume'], rows: [['cylinder, r = 3, h = 4', '36π'], ['cone, same r and h', '⅓ × 36π = 12π']], mark: 1, note: 'A cone always holds a third of its cylinder.' },
    },
    {
      kind: 'protip',
      head: 'The reference sheet has the formulas',
      body: 'Every area and volume formula you need is printed at the start of the test. Your job is knowing WHICH one and plugging in carefully — and remembering that k² and k³ are not on it.',
      art: flow([{ label: 'Name the shape', color: SKY }, { label: 'Pick the formula', color: AMB }, { label: 'Scaled? Use k² or k³', color: EMR }], { title: 'Area and volume in three moves', caption: 'The scaling rule is the one thing you must bring yourself.' }),
    },
    {
      kind: 'trap',
      head: 'Doubling sides does not double area',
      body: 'Double every length of a cube and its volume becomes 2³ = 8 times as large. Answering "2 times" is the trap the question is built around.',
      compare: {
        cols: [
          { title: 'Tempting', tex: 'V \\times 2', lines: ['Treated volume like length'], tone: 'bad' },
          { title: 'Correct', tex: 'V \\times 2^3 = 8V', lines: ['Three dimensions, three factors'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: volume ratio from area ratio',
      body: 'Two similar solids have surface areas in the ratio 4 : 9. What is the ratio of their volumes? Find the length ratio first.',
      steps: { steps: [{ tex: 'k^2 = \\tfrac{9}{4} \\Rightarrow k = \\tfrac{3}{2}', text: 'Take the square root of the area ratio.' }, { tex: 'k^3 = \\tfrac{27}{8}', text: 'Cube it for volume.' }], answer: '8 : 27' },
    },
    {
      kind: 'summary',
      head: 'Area, volume, and similarity, wrapped up',
      body: 'Area: lw, ½bh, πr². Volume: base area times height, and a third of that for cones and pyramids. Composite shapes add pieces or subtract holes. Scale lengths by k, areas by k², volumes by k³.',
      formula: { tex: 'L \\times k,\\quad A \\times k^2,\\quad V \\times k^3', note: 'One factor of k for each dimension.', parts: [{ sym: 'k^2', means: 'area has two dimensions', tone: 'accent' }, { sym: 'k^3', means: 'volume has three', tone: 'ok' }] },
    },
  ],

  // ---------------- SAT-17 — Right triangles and trigonometry ----------------
  'SAT-17': [
    {
      kind: 'objective',
      head: 'The triangle with a square corner',
      body: 'A right triangle with legs 9 and 12 has a hypotenuse of exactly 15. Right triangles show up all over the SAT. You will use Pythagoras, two special triangles, and sine, cosine, and tangent.',
      art: rightTriangle({ opp: '9', adj: '12', hyp: '15', shape: { opp: 3, adj: 4 }, title: 'A 9-12-15 right triangle', caption: 'Three times the famous 3-4-5.' }),
    },
    {
      kind: 'concept',
      head: 'The Pythagorean theorem',
      body: 'In a right triangle, the two legs squared add up to the hypotenuse squared. The hypotenuse is the longest side, across from the right angle.',
      formula: { tex: 'a^2 + b^2 = c^2', note: 'Only for right triangles.', parts: [{ sym: 'a, b', means: 'the two legs that form the right angle', tone: 'accent' }, { sym: 'c', means: 'the hypotenuse, opposite the right angle', tone: 'ok' }] },
      art: rightTriangle({ opp: 'a', adj: 'b', hyp: 'c', shape: { opp: 2.4, adj: 4 }, title: 'Legs a and b, hypotenuse c', caption: 'c is always the side across from the square corner.' }),
    },
    {
      kind: 'concept',
      head: 'Triples you should know',
      body: 'Some right triangles have whole-number sides. Spot one and skip the square roots. Multiples work too: 6-8-10 is just 3-4-5 doubled.',
      table: { head: ['Triple', 'Check'], rows: [['3, 4, 5', '9 + 16 = 25'], ['5, 12, 13', '25 + 144 = 169'], ['8, 15, 17', '64 + 225 = 289'], ['6, 8, 10', '3-4-5 doubled']] },
    },
    {
      kind: 'concept',
      head: 'Two special right triangles',
      body: 'Their sides always keep the same ratio. The 45-45-90 is half a square. The 30-60-90 is half an equilateral triangle. Both are on the reference sheet.',
      compare: {
        cols: [
          { title: '45-45-90', tex: 'x,\\ x,\\ x\\sqrt{2}', lines: ['Two equal legs', 'Hypotenuse is leg × √2'], tone: 'accent' },
          { title: '30-60-90', tex: 'x,\\ x\\sqrt{3},\\ 2x', lines: ['Short leg x', 'Hypotenuse is twice it'], tone: 'ok' },
        ],
      },
      art: rightTriangle({ opp: 'x', adj: 'x', hyp: 'x√2', shape: { opp: 1, adj: 1 }, title: 'Half a square: 45-45-90', caption: 'Equal legs, hypotenuse √2 times as long.' }),
    },
    {
      kind: 'concept',
      head: 'SOH-CAH-TOA',
      body: 'Stand at an angle θ. The side across from you is opposite, the leg touching you is adjacent, and the longest side is the hypotenuse. Each trig ratio divides two of them.',
      formula: { tex: '\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}},\\ \\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}},\\ \\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}', note: 'SOH, CAH, TOA.', parts: [{ sym: '\\text{opp}', means: 'the side across from the angle', tone: 'accent' }, { sym: '\\text{adj}', means: 'the leg that touches the angle', tone: 'ok' }] },
      art: rightTriangle({ opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse', angle: 'θ', title: 'Named from the angle θ', caption: 'Change the angle and opposite and adjacent swap.' }),
    },
    {
      kind: 'example',
      head: 'Find the hypotenuse: legs 9 and 12',
      body: 'Square the legs and add.\nTake the square root.\nThe hypotenuse is 15.',
      steps: { steps: [{ tex: '9^2 + 12^2 = 81 + 144', text: 'Square each leg.' }, { tex: '= 225', text: 'Add them.' }, { tex: '\\sqrt{225} = 15', text: 'Take the square root.' }], answer: 'c = 15' },
    },
    {
      kind: 'example',
      head: 'Another way: spot the triple',
      body: 'Divide 9 and 12 by 3 and you get 3 and 4. That is the 3-4-5 triple, scaled by 3. So the hypotenuse is 5 × 3 = 15 — no squaring needed.',
      table: { head: ['', 'Leg', 'Leg', 'Hyp'], rows: [['3-4-5', '3', '4', '5'], ['× 3', '9', '12', '15']], mark: 1, note: 'Scale the whole triple together.' },
    },
    {
      kind: 'example',
      head: 'Find a leg: hypotenuse 13, leg 5',
      body: 'When you know the hypotenuse, SUBTRACT.\nThe other leg squared is 169 − 25.\nThe leg is 12.',
      steps: { steps: [{ tex: 'b^2 = 13^2 - 5^2', text: 'Hypotenuse squared minus the known leg squared.' }, { tex: 'b^2 = 144', text: '169 − 25.' }], answer: 'b = 12' },
    },
    {
      kind: 'example',
      head: 'A 30-60-90 with hypotenuse 10',
      body: 'The hypotenuse is 2x, so x = 5. The short leg is 5, across from 30°. The long leg is 5√3, across from 60°.',
      art: rightTriangle({ opp: '5', adj: '5√3', hyp: '10', angle: '30°', shape: { opp: 1, adj: 1.732 }, title: 'Short leg 5, long leg 5√3', caption: 'The short leg sits across from the 30° angle.' }),
    },
    {
      kind: 'example',
      head: 'A sine: opposite 8, hypotenuse 17',
      body: 'SOH: sine is opposite over hypotenuse. That is 8/17. The third side is 15, making the 8-15-17 triple.',
      formula: { tex: '\\sin\\theta = \\frac{8}{17}', note: 'Opposite over hypotenuse.', parts: [{ sym: '8', means: 'the side opposite the angle', tone: 'accent' }, { sym: '17', means: 'the hypotenuse', tone: 'ok' }] },
      art: rightTriangle({ opp: '8', adj: '15', hyp: '17', angle: 'θ', shape: { opp: 8, adj: 15 }, title: 'The 8-15-17 triangle', caption: 'sin θ = 8/17, cos θ = 15/17, tan θ = 8/15.' }),
    },
    {
      kind: 'example',
      head: 'Complementary angles: sin x° = cos 25°',
      body: 'The two acute angles of a right triangle add to 90°. The sine of one is the cosine of the other. So x = 90 − 25 = 65.',
      formula: { tex: '\\sin x^\\circ = \\cos(90^\\circ - x^\\circ)', note: 'Sine and cosine swap between complementary angles.', parts: [{ sym: '90 - x', means: 'the other acute angle', tone: 'accent' }, { sym: 'x = 65', means: 'because 90 − 65 = 25', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Complementary angles swap sine and cosine',
      body: 'If sin A = cos B, then A + B = 90°. The SAT asks this almost every test. Recognize it and you are done in seconds.',
      art: flow([{ label: 'See sin A = cos B', color: SKY }, { label: 'So A + B = 90°', color: AMB }, { label: 'Subtract to find the angle', color: EMR }], { title: 'The co-function shortcut', caption: 'The opposite side for one angle is the adjacent side for the other.' }),
    },
    {
      kind: 'trap',
      head: 'c is always the hypotenuse',
      body: 'With a hypotenuse 13 and a leg 5, writing 5² + 13² = c² gives √194, a hypotenuse LONGER than it should be. The hypotenuse goes alone on the right.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '5^2 + 13^2 = c^2', lines: ['Treated 13 as a leg'], tone: 'bad' },
          { title: 'Right', tex: '5^2 + b^2 = 13^2', lines: ['13 is the hypotenuse'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a ladder against a wall',
      body: 'A 13-foot ladder leans on a wall with its foot 5 feet from the wall. How high up the wall does it reach? Picture the right triangle: the ladder is the hypotenuse.',
      steps: { steps: [{ tex: 'h^2 + 5^2 = 13^2', text: 'Ladder is the hypotenuse.' }, { tex: 'h^2 = 144', text: '169 − 25.' }], answer: 'h = 12\\text{ ft}' },
    },
    {
      kind: 'summary',
      head: 'Right triangles and trig, wrapped up',
      body: 'a² + b² = c², with c the hypotenuse. Know 3-4-5, 5-12-13, and 8-15-17. 45-45-90 is x, x, x√2 and 30-60-90 is x, x√3, 2x. SOH-CAH-TOA, and sin x = cos(90 − x).',
      table: { head: ['Tool', 'Use when'], rows: [['a² + b² = c²', 'two sides known'], ['special triangles', 'a 45° or 30°/60° angle'], ['SOH-CAH-TOA', 'an angle and one side'], ['sin x = cos(90 − x)', 'sine equals cosine']] },
    },
  ],

  // ---------------- SAT-18 — Circles ----------------
  'SAT-18': [
    {
      kind: 'objective',
      head: 'A circle is a center and a radius',
      body: 'The equation (x − 2)² + (y + 1)² = 9 draws a circle centered at (2, −1) with radius 3. You will read circles from equations, complete the square when they are scrambled, and find arcs and sectors.',
      art: circleOnGrid(),
    },
    {
      kind: 'concept',
      head: 'Standard form of a circle',
      body: 'Every point on the circle is exactly r away from the center (h, k). Pythagoras turns that distance into an equation. The right side is r SQUARED.',
      formula: { tex: '(x - h)^2 + (y - k)^2 = r^2', note: 'Center (h, k), radius r.', parts: [{ sym: '(h,\\,k)', means: 'the center — flip both signs you see', tone: 'accent' }, { sym: 'r^2', means: 'the radius squared, so take its root', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Arcs and sectors are fractions of the circle',
      body: 'A 60° angle is 60/360 = 1/6 of the full turn. So its arc is 1/6 of the circumference and its sector is 1/6 of the area.',
      formula: { tex: '\\text{arc} = \\frac{\\theta}{360} \\cdot 2\\pi r, \\quad \\text{sector} = \\frac{\\theta}{360} \\cdot \\pi r^2', note: 'The same fraction, applied to two different wholes.', parts: [{ sym: '\\theta/360', means: 'what fraction of the circle the angle takes', tone: 'accent' }, { sym: '2\\pi r', means: 'the full circumference, for an arc', tone: 'ok' }] },
      art: sector(60, 'arc 3π', 'A 60° slice is 1/6 of the circle', 'The arc is 1/6 of the 18π circumference: 3π.'),
    },
    {
      kind: 'concept',
      head: 'Radians: 180° is π',
      body: 'Radians measure an angle by arc length on a circle of radius 1. Half a turn, 180°, is π radians. So 60° is π/3 and 90° is π/2.',
      formula: { tex: '180^\\circ = \\pi \\text{ rad}', note: 'Multiply by π/180 to go from degrees to radians.', parts: [{ sym: '\\pi', means: 'half a turn, in radians', tone: 'accent' }, { sym: '\\pi/180', means: 'the conversion factor from degrees', tone: 'ok' }] },
      art: unitCircle(60, { label: 'π/3', caption: 'A 60° turn on a unit circle sweeps an arc of length π/3.' }),
    },
    {
      kind: 'example',
      head: 'Read it: (x − 2)² + (y + 5)² = 36',
      body: 'Flip the signs inside to get the center: (2, −5). The right side is r², so r = √36 = 6.',
      formula: { tex: '(x - 2)^2 + (y + 5)^2 = 36', note: 'Center (2, −5), radius 6.', parts: [{ sym: 'y + 5', means: 'k = −5: the sign flips', tone: 'accent' }, { sym: '36', means: 'r² = 36, so r = 6', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Complete the square: x² + 6x + y² − 4y = 12',
      body: 'Group x-terms and y-terms.\nAdd the square of half of each middle coefficient to BOTH sides.\nRead the radius from the new right side.',
      steps: { steps: [{ tex: '(x^2 + 6x + 9) + (y^2 - 4y + 4) = 12 + 9 + 4', text: 'Add 9 and 4 to both sides.' }, { tex: '(x + 3)^2 + (y - 2)^2 = 25', text: 'Write each group as a square.' }], answer: 'r = 5' },
    },
    {
      kind: 'example',
      head: 'Arc length: 60° in a circle of radius 9',
      body: '60° is 1/6 of the circle.\nThe full circumference is 2π(9) = 18π.\nOne sixth of that is 3π.',
      steps: { steps: [{ tex: '\\frac{60}{360} = \\frac{1}{6}', text: 'The fraction of the circle.' }, { tex: '\\frac{1}{6} \\times 18\\pi = 3\\pi', text: 'That fraction of the circumference.' }], answer: '3\\pi' },
    },
    {
      kind: 'example',
      head: 'Another way: use radians',
      body: 'Convert 60° to π/3 radians. In radians, arc length is just radius times angle: s = rθ = 9 × π/3 = 3π. Same answer, no fraction of 360.',
      formula: { tex: 's = r\\theta = 9 \\cdot \\frac{\\pi}{3} = 3\\pi', note: 'Only works with θ in radians.', parts: [{ sym: 'r', means: 'the radius, 9', tone: 'accent' }, { sym: '\\theta', means: 'the angle in radians, π/3', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a quarter of a pizza',
      body: 'A 90° sector of a circle with radius 4 is one quarter of the whole. Sketch it: the whole area is 16π, so the sector is 16π ÷ 4 = 4π.',
      art: pie([{ label: '90°: 4π', part: 1, color: AMB }, { label: 'the other 3/4', part: 3, color: SKY }], { title: 'A 90° sector is 1/4', caption: 'One quarter of 16π is 4π.' }),
    },
    {
      kind: 'example',
      head: 'Degrees to radians: 135°',
      body: 'Multiply by π/180. 135/180 simplifies to 3/4. So 135° is 3π/4 radians.',
      table: { head: ['Degrees', 'Radians'], rows: [['90°', 'π/2'], ['135°', '3π/4'], ['180°', 'π'], ['360°', '2π']], mark: 1, note: 'Each is the degree measure times π/180.' },
    },
    {
      kind: 'protip',
      head: 'A radius meets a tangent at 90°',
      body: 'A tangent line touches the circle at one point, and the radius to that point is perpendicular to it. That right angle is a gift: it hands you a right triangle for Pythagoras.',
      art: tangentLine(),
    },
    {
      kind: 'trap',
      head: 'The right side is r squared',
      body: 'In (x + 1)² + (y − 3)² = 49, the radius is 7, not 49. Choices with 49 as the radius are there to catch anyone who forgets the square.',
      compare: {
        cols: [
          { title: 'Wrong', tex: 'r = 49', lines: ['Forgot the square'], tone: 'bad' },
          { title: 'Right', tex: 'r = \\sqrt{49} = 7', lines: ['Take the square root'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a hidden circle',
      body: 'Find the center and radius of x² + y² − 8x + 6y = 0. Complete the square in x and in y, adding the same amounts to both sides.',
      steps: { steps: [{ tex: '(x^2 - 8x + 16) + (y^2 + 6y + 9) = 0 + 16 + 9', text: 'Half of −8 squared is 16; half of 6 squared is 9.' }, { tex: '(x - 4)^2 + (y + 3)^2 = 25', text: 'Center (4, −3).' }], answer: 'r = 5' },
    },
    {
      kind: 'summary',
      head: 'Circles, wrapped up',
      body: '(x − h)² + (y − k)² = r² has center (h, k) and radius r. Complete the square to find them when the equation is expanded. Arcs and sectors are θ/360 of the circle, and in radians arc length is rθ.',
      table: { head: ['Want', 'Use'], rows: [['center, radius', 'standard form'], ['arc length', '(θ/360) · 2πr'], ['sector area', '(θ/360) · πr²'], ['radians', '180° = π']] },
    },
  ],
};
