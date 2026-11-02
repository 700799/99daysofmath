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
      why: 'Picture the mean as sharing: pool every value into one pile and deal it out evenly, so each of the n values gets the same amount. The median ignores size and only counts places, so half the data must sit below it and half above. Sorting is what makes "middle place" mean "middle size".',
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
      why: 'Change the biggest value from 22 to 220 in 3, 7, 8, 10, 22. The sum jumps by 198, so the mean leaps from 10 to 49.6. But 220 is still the largest, still last in line, so the median is still 8. Size feeds the mean; only rank feeds the median.',
    },
    {
      kind: 'concept',
      head: 'Skew: which way the tail runs',
      body: 'When a few values stretch far to the right, the data are skewed right. The long tail pulls the mean above the median. A tail to the left pulls the mean below it.',
      art: histogram(['0–10', '10–20', '20–30', '30–40', '40–50', '50–60'], [9, 7, 4, 2, 1, 1], { title: 'Skewed right', yLabel: 'count', caption: 'The tail on the right pulls the mean past the median.' }),
      why: 'The median is set by counting, so the few far-right values only count as "above the middle", no matter how far out they are. The mean feels their distance, because big numbers add big amounts to the sum. So a right tail raises the mean past the median, and a left tail drops it below.',
    },
    {
      kind: 'concept',
      head: 'Standard deviation measures spread',
      body: 'Standard deviation is roughly the typical distance from the mean. Tightly bunched data have a small one; spread-out data have a large one. On the SAT you compare them by eye — no calculating.',
      art: spreadRows(),
      why: 'Set A (48, 50, 52) and Set B (20, 50, 80) both have mean 50. Every A value is within 2 of 50, but the B values are 30 away at the ends. Larger typical distance from the mean means a larger standard deviation, so B wins. You only need to judge which set sits farther from its mean.',
    },
    {
      kind: 'example',
      head: 'Mean and median of 3, 7, 8, 10, 22',
      body: 'Find the mean and the median of the list. The mean needs a total and a count; the median needs the list in order.',
      steps: { steps: [
        { tex: '3 + 7 + 8 + 10 + 22 = 50', text: 'Add every value first. The mean shares the total out equally, so you need the total of all five numbers before you can share it.' },
        { tex: '50 \\div 5 = 10', text: 'Divide the total by how many values there are. There are 5 values, so each one gets 10 when the 50 is shared evenly. That is the mean.' },
        { tex: '3,\\ 7,\\ \\mathbf{8},\\ 10,\\ 22', text: 'Check that the list is sorted, smallest to largest. It is, and the median is the value in the middle place, so it only makes sense on a sorted list.' },
        { tex: '\\text{median} = 8', text: 'With 5 values the middle is the 3rd, since two values sit on each side of it. The 3rd value is 8. Notice 22 pulled the mean above the median.' },
      ], answer: '\\bar{x} = 10,\\ \\text{median} = 8' },
    },
    {
      kind: 'example',
      head: 'Change the outlier: 22 becomes 12',
      body: 'The 22 is replaced by 12. Which of the mean and the median notice the change?',
      table: { head: ['Data', 'Mean', 'Median'], rows: [['3, 7, 8, 10, 22', '10', '8'], ['3, 7, 8, 10, 12', '8', '8']], mark: 1, note: 'Only the mean noticed the change.' },
      steps: { steps: [
        { tex: '3 + 7 + 8 + 10 + 12 = 40', text: 'Add the new list. The sum dropped by 10 because we swapped 22 for 12, and the mean always follows the sum.' },
        { tex: '40 \\div 5 = 8', text: 'Divide by the same count of 5. The mean fell from 10 to 8, because the mean uses the actual size of every value, including the one we changed.' },
        { tex: '3,\\ 7,\\ \\mathbf{8},\\ 10,\\ 12', text: 'The list is still in order and 8 is still the third value. The median only looks at position, and the largest value is still the largest.' },
        { tex: '\\text{median} = 8', text: 'So the median did not move at all. That is why the median resists outliers while the mean does not. On test day, you can skip the arithmetic and just say the mean changes, the median stays.' },
      ], answer: '\\text{mean } 10 \\to 8,\\ \\text{median stays } 8' },
    },
    {
      kind: 'example',
      head: 'What fifth score makes the average 88?',
      body: 'Four tests average 85 and you want the five-test average to be 88. What must the fifth score be? Averages cannot be added, so turn them into totals.',
      formula: { tex: '\\begin{gathered} 5(88) - 4(85) \\\\ = 440 - 340 = 100 \\end{gathered}', note: 'Work with totals, not averages.', parts: [{ sym: '5(88)', means: 'the total five tests need', tone: 'accent' }, { sym: '4(85)', means: 'the total the first four already have', tone: 'ok' }] },
      steps: { steps: [
        { tex: '4 \\times 85 = 340', text: 'A mean is a total divided by a count, so multiply back: total = mean times count. The first four tests total 340 points.' },
        { tex: '5 \\times 88 = 440', text: 'Do the same for the goal. Five tests averaging 88 must total 440 points, because 440 shared among 5 tests is 88 each.' },
        { tex: '440 - 340 = 100', text: 'The fifth score is whatever is missing between the total you have and the total you need, so subtract.' },
        { tex: '\\tfrac{340 + 100}{5} = 88', text: 'Check by averaging all five scores again: 440 divided by 5 is 88. A score of 100 is possible, so the answer is allowed.' },
      ], answer: '100' },
    },
    {
      kind: 'example',
      head: 'Another way: balance the shortfalls',
      body: 'Same question, no big totals. Measure how far each of the four tests is from the target of 88 and see what the fifth must make up.',
      steps: { steps: [
        { tex: '88 - 85 = 3', text: 'Each of the four tests is 3 points below the target of 88. The target is the mean we want, so distance from it is what matters.' },
        { tex: '4 \\times 3 = 12', text: 'Four tests, each 3 short, are 12 points short in all. The mean balances when the shortfalls and surpluses cancel out.' },
        { tex: '88 + 12 = 100', text: 'The fifth test must be 12 points ABOVE the target to cancel the 12-point shortfall, so it is 88 plus 12.' },
      ], answer: '100' },
    },
    {
      kind: 'example',
      head: 'An even count: 4, 9, 1, 7, 12, 6',
      body: 'Find the median of this list of six numbers. It is not sorted yet.',
      art: sortedRow([1, 4, 6, 7, 9, 12], { middle: [2, 3], label: 'median (6 + 7) ÷ 2 = 6.5', title: 'Two middles: average them', caption: 'With an even count the median may not be in the list.' }),
      steps: { steps: [
        { tex: '1,\\ 4,\\ 6,\\ 7,\\ 9,\\ 12', text: 'Sort from smallest to largest first. The median is the middle by position, so the order must be right before you count places.' },
        { tex: '6 \\text{ values} \\Rightarrow \\text{3rd and 4th}', text: 'Six values have no single middle. Three sit on the left and three on the right, so the two in the center are the 3rd and 4th.' },
        { tex: '\\frac{6 + 7}{2} = 6.5', text: 'Average those two middle values. The point halfway between them splits the data evenly, so that is the median, even though 6.5 is not in the list.' },
      ], answer: '6.5' },
    },
    {
      kind: 'example',
      head: 'Picture it first: household incomes',
      body: 'Household incomes, in thousands of dollars, have the box plot below. Is the mean above or below the median? Sketch before calculating.',
      art: boxPlot([20, 35, 45, 70, 150], 0, 160, { title: 'A long whisker to the right', step: 20, caption: 'In thousands of dollars. The median is 45; the mean is higher.' }),
      steps: { steps: [
        { tex: '\\text{median} = 45', text: 'The line inside the box is the median. Half of households earn less than 45 thousand and half earn more.' },
        { tex: '70 \\to 150', text: 'Look at the right whisker. It stretches from 70 to 150, far longer than the left whisker, so a few very high incomes stretch the data to the right.' },
        { tex: '\\text{mean} > \\text{median}', text: 'The mean uses the size of every value, so those few huge incomes pull it up. The median only counts places, so it stays at 45.' },
      ], answer: '\\text{skewed right: mean} > \\text{median}' },
    },
    {
      kind: 'protip',
      head: 'New-mean questions: use sums',
      body: 'Averages cannot be added, but totals can. Turn every mean into a sum, add or remove values, then divide by the new count.',
      formula: { tex: '\\bar{x}_{\\text{new}} = \\frac{\\text{old sum} + \\text{new value}}{n + 1}', note: 'Sum, adjust, divide.', parts: [{ sym: '\\text{old sum}', means: 'the old mean times the old count', tone: 'accent' }, { sym: 'n + 1', means: 'the count after adding one value', tone: 'ok' }] },
      why: 'A mean is just total divided by count, so multiplying the mean by the count gives back the total. Totals add and subtract honestly, while two means with different counts cannot simply be averaged. Always go to the sum, change it, and divide by the new count.',
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
      why: 'The median means that half the values are smaller and half are larger. In the unsorted list, the middle entry 1 has four values above it and none below, so it cannot be a center. Only sorting puts the smaller half on one side.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: remove a value',
      body: 'Six numbers have a mean of 20. One number, 50, is removed. What is the mean of the five that are left?',
      steps: { steps: [
        { tex: '6 \\times 20 = 120', text: 'Turn the mean into a total, since totals can be adjusted. Mean times count gives the sum of all six numbers: 120.' },
        { tex: '120 - 50 = 70', text: 'Remove the 50 by subtracting it from the total. What is left is the sum of the five remaining numbers.' },
        { tex: '70 \\div 5 = 14', text: 'Divide by the new count of 5, not the old 6, because the mean is always the total shared among the numbers actually present.' },
        { tex: '14 < 20', text: 'Sense check: 50 was far above the old mean of 20, so removing it should lower the mean. 14 is lower, which agrees.' },
      ], answer: '14' },
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
      why: 'The line is drawn to run through the middle of the cloud, not through every dot, so real points land above and below it. Slope is rise over run, so a slope of 2.5 means that moving 1 step right moves the line 2.5 up. That is a trend for the whole group, not a rule for one point.',
    },
    {
      kind: 'concept',
      head: 'Probability: favorable over total',
      body: 'Probability is the number of outcomes you want divided by the number possible. The hard part on the SAT is choosing the right TOTAL, which the wording of the question picks.',
      formula: { tex: 'P = \\frac{\\text{favorable}}{\\text{total}}', note: 'Always a number from 0 to 1.', parts: [{ sym: '\\text{favorable}', means: 'the outcomes the question asks about', tone: 'accent' }, { sym: '\\text{total}', means: 'the group the question limits you to', tone: 'ok' }] },
      why: 'If every outcome is equally likely, each one gets an equal share of the chance, so the wanted outcomes get their count times that share. A bag with 8 marbles gives each marble a 1/8 share, and 5 red marbles hold 5 of those shares. The favorable count can never exceed the total, so the answer stays between 0 and 1.',
    },
    {
      kind: 'concept',
      head: 'Two-way tables',
      body: 'A two-way table sorts people by two questions at once. Each row and column has a total. "Given that" tells you to use one row or column as the whole.',
      table: { head: ['', 'Sport', 'No sport', 'Total'], rows: [['Juniors', '24', '36', '60'], ['Seniors', '56', '84', '140'], ['Total', '80', '120', '200']], mark: 0, note: 'Given junior: only the top row counts.' },
      why: 'Every person lands in exactly one cell, so the cells in a row add up to that row total, and the row totals add up to the grand total (24 + 36 = 60, 60 + 140 = 200). "Given that" says the person is already known to be in that group. Everyone outside it is impossible, so only that row or column can be the total.',
    },
    {
      kind: 'concept',
      head: 'What a study can justify',
      body: 'A RANDOM SAMPLE lets you generalize to the population it came from — and only that one. Only RANDOM ASSIGNMENT to groups lets you say one thing CAUSES another.',
      art: flow([{ label: 'Random sample → generalize', color: SKY }, { label: 'to that population only', color: AMB }, { label: 'Random assignment → cause', color: EMR }], { title: 'What each design earns you', horizontal: false, caption: 'Sampling earns generalization; assignment earns cause.' }),
      why: 'A random sample gives every member of the population an equal chance of being picked, so the sample looks like the group it came from. Random assignment shuffles who gets which treatment, so other differences (age, health, effort) spread evenly across the groups. Then only the treatment can explain a difference in results.',
    },
    {
      kind: 'example',
      head: 'Predict: y = 2.5x + 10 at x = 8',
      body: 'Use the line of best fit to predict y when x is 8.',
      steps: { steps: [
        { tex: '\\hat{y} = 2.5(8) + 10', text: 'Substitute 8 for x. The line of best fit gives the predicted y for any x, so putting the x-value in is how you make a prediction.' },
        { tex: '2.5(8) = 20', text: 'Multiply first, before adding. Order of operations says multiplication comes before addition, and the slope 2.5 is multiplying x.' },
        { tex: '20 + 10 = 30', text: 'Add the intercept 10, the predicted y when x is 0. The answer is a prediction, so real data at x = 8 may differ a little, like the dot at 28 on the graph.' },
      ], answer: '\\hat{y} = 30' },
    },
    {
      kind: 'example',
      head: 'A conditional: P(sport | junior)',
      body: 'A student is chosen from the juniors in the table. What is the probability the student plays a sport?',
      steps: { steps: [
        { tex: '\\text{total} = 60', text: 'The words "given junior" mean the student is already known to be a junior. So the whole group is the junior row, 60 students, not all 200.' },
        { tex: '\\text{favorable} = 24', text: 'Favorable means juniors who play a sport. Read the Sport column in the junior row: 24 students.' },
        { tex: '\\frac{24}{60} = \\frac{2}{5} = 0.4', text: 'Divide favorable by total, then simplify. Dividing top and bottom by 12 gives 2/5, which is 0.4 as a decimal.' },
      ], answer: '0.4' },
    },
    {
      kind: 'example',
      head: 'Another way: shrink the table',
      body: 'Same question as before, with a different method: cross out everything the "given" rules out, so the leftover table is your whole world.',
      table: { head: ['', 'Sport', 'No sport', 'Total'], rows: [['Juniors', '24', '36', '60'], ['(seniors crossed out)', '—', '—', '—']], mark: 0, note: 'The given shrinks the world to one row.' },
      steps: { steps: [
        { tex: '\\text{cross out seniors}', text: 'The given says junior, so seniors are impossible. Crossing out their row removes outcomes that cannot happen from the count.' },
        { tex: '\\text{what remains: } 24,\\ 36', text: 'Only the junior row is left. It is a small table with two cells: 24 who play and 36 who do not.' },
        { tex: '\\frac{24}{24 + 36} = \\frac{24}{60} = 0.4', text: 'Now it is an ordinary probability of favorable over total. This matches the first method, and it is a quick test-day habit that stops you grabbing the wrong total.' },
      ], answer: '0.4' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a bag of marbles',
      body: 'A bag has 5 red and 3 blue marbles. What is the probability that one marble drawn at random is red?',
      art: pie([{ label: '5 red', part: 5, color: ROSE }, { label: '3 blue', part: 3, color: SKY }], { title: '5 of 8 slices are red', caption: 'P(red) = 5/8.' }),
      steps: { steps: [
        { tex: '5 + 3 = 8', text: 'Count all the marbles to get the total. Each marble is equally likely to be drawn, so each one is an equal slice of the whole chance.' },
        { tex: '\\text{favorable} = 5', text: 'Favorable means red, and there are 5 red marbles. Those are the slices that count as a win.' },
        { tex: '\\frac{5}{8} = 0.625', text: 'Favorable over total gives 5/8. It is between 0 and 1, as every probability must be, and more than half because red is the larger group.' },
      ], answer: '\\tfrac58' },
    },
    {
      kind: 'example',
      head: 'Can the survey speak for the whole school?',
      body: 'A random sample of 9th graders found that most like pizza. Which conclusion does that justify?',
      compare: {
        cols: [
          { title: 'Justified', lines: ['Most 9th graders at the school like pizza'], tone: 'ok' },
          { title: 'Not justified', lines: ['Most students at the school like pizza'], tone: 'bad' },
        ],
      },
      steps: { steps: [
        { text: 'Find the population the sample was drawn from. Only 9th graders were sampled, so 9th graders are the group the sample can speak for.' },
        { text: 'Check that the sample is random. It is, so every 9th grader had an equal chance of being picked and the results can be generalized to that group.' },
        { text: 'Compare the conclusion with that group. "Most 9th graders" stays inside it, but "most students" reaches seniors, who had no chance to be picked, so it goes too far.' },
      ], answer: '\\text{Most 9th graders like pizza}' },
    },
    {
      kind: 'example',
      head: 'A margin of error: 52% ± 4%',
      body: 'A poll estimates 52% support with a margin of error of 4%. Can we say that a majority supports the idea?',
      art: numberLine(44, 60, [{ at: 52, label: '52%', color: ROSE }], { step: 2, span: { from: 48, to: 56, label: 'plausible: 48% to 56%' }, title: 'Estimate plus or minus 4', caption: 'The range crosses 50%, so a majority is not certain.' }),
      steps: { steps: [
        { tex: '52 - 4 = 48,\\quad 52 + 4 = 56', text: 'Subtract and add the margin of error to the estimate. The true value is plausibly anywhere in that whole range, not just at 52%.' },
        { tex: '48\\% \\text{ to } 56\\%', text: 'So the plausible values run from 48% to 56%. The poll is an estimate from a sample, which is why it comes with a range.' },
        { tex: '48 < 50 < 56', text: 'A majority means more than 50%. The range includes values below 50%, such as 48%, so a majority is possible but not certain.' },
      ], answer: '\\text{No: a majority is not certain}' },
    },
    {
      kind: 'protip',
      head: 'Say the slope as a sentence',
      body: 'Interpretation questions want the slope in words with units. "Each additional hour of study is associated with a predicted 2.5-point increase." Predicted, and per one unit.',
      formula: { tex: 'm = \\frac{\\Delta \\hat{y}}{\\Delta x}', note: 'Predicted change in y for each 1-unit change in x.', parts: [{ sym: '\\Delta \\hat{y}', means: 'the predicted change in the output', tone: 'accent' }, { sym: '\\Delta x', means: 'one more unit of the input', tone: 'ok' }] },
      why: 'Slope is the change in y divided by the change in x, so it is already a "per one unit" number. Because the line only predicts the trend, say "predicted" and "associated with", never "causes". Wrong answer choices often drop the unit or the word predicted.',
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
      why: 'The word after "given" names the group you already know the person belongs to. That group is the whole world, so it is the denominator. Swap the two words and you swap the group, which is why the same 24 gives 0.4 one way and 0.3 the other.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: P(junior | sport)',
      body: 'Using the same table, a student is chosen from those who play a sport. What is the probability the student is a junior?',
      steps: { steps: [
        { tex: '\\text{total} = 80', text: 'The words "given sport" make the Sport column the whole group. The total at the bottom of that column is 80 students.' },
        { tex: '\\text{favorable} = 24', text: 'Favorable means juniors who play a sport. That is the junior cell in the Sport column: 24 students.' },
        { tex: '\\frac{24}{80} = \\frac{3}{10}', text: 'Divide favorable by total and simplify by dividing top and bottom by 8. Notice it is different from P(sport | junior) because the total is different.' },
        { tex: '\\frac{3}{10} = 0.3', text: 'Convert to a decimal. Test-day move: if the choices include both 0.4 and 0.3, check which group the "given" names before you pick.' },
      ], answer: '0.3' },
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
      why: 'A straight line is half a full turn, which is 180°. In the picture, the 115° angle and its neighbor share a line, so the neighbor is 65°. The angle opposite 115° is also beside that same 65°, so it must be 115° as well. That is why opposite angles match.',
    },
    {
      kind: 'concept',
      head: 'Parallel lines: only two sizes',
      body: 'When a line cuts across two parallel lines, every angle it makes is one of just two sizes. The small ones are equal, the big ones are equal, and one of each adds to 180°.',
      art: parallelCut(),
      formula: { tex: 'a + b = 180^\\circ', note: 'The acute and obtuse angles are supplementary.', parts: [{ sym: 'a', means: 'the acute size, repeated at every crossing', tone: 'accent' }, { sym: 'b', means: 'the obtuse size, 180° minus a', tone: 'ok' }] },
      why: 'Parallel lines point in exactly the same direction, so the transversal meets each of them at the same slant. Slide the top crossing straight down onto the bottom one, and the angles land on top of each other, so they are equal. Within one crossing, neighbors share a straight line and add to 180°, giving just two sizes.',
    },
    {
      kind: 'concept',
      head: 'The exterior angle theorem',
      body: 'Extend one side of a triangle. The outside angle equals the sum of the two inside angles FARTHEST from it. It skips the triangle-sum step entirely.',
      art: exteriorAngle(),
      formula: { tex: '\\text{exterior} = \\text{far angle}_1 + \\text{far angle}_2', note: 'The two interior angles not touching it.', parts: [{ sym: '\\text{far angle}_1', means: 'an interior angle away from the exterior one', tone: 'accent' }, { sym: '\\text{exterior}', means: 'the angle outside, on the extended side', tone: 'ok' }] },
      why: 'The exterior angle and the inside angle beside it sit on a straight line, so exterior = 180 minus that inside angle. The triangle sum says the other two angles add to 180 minus that same inside angle. Both equal the same thing, so the exterior angle equals the two far angles. In the figure, 55 + 75 = 130.',
    },
    {
      kind: 'example',
      head: 'Supplementary: one angle is 115°',
      body: 'Two angles sit side by side on a straight line, and one of them is 115°. Find the other.',
      steps: { steps: [
        { tex: 'x + 115 = 180', text: 'Angles that make a straight line add to 180°, because a straight line is half of a full 360° turn. Call the unknown angle x.' },
        { tex: 'x = 180 - 115', text: 'Subtract 115 from both sides to get x alone. Doing the same thing to both sides keeps the equation true.' },
        { tex: 'x = 65', text: 'Compute 180 minus 115. Sense check: 65 + 115 = 180, and 65 is acute while 115 is obtuse, as it should be on a line. On test day, just do 180 minus the known angle in your head.' },
      ], answer: '65^\\circ' },
    },
    {
      kind: 'example',
      head: 'Third angle: 48° and 67°',
      body: 'A triangle has two angles of 48° and 67°. Find the third angle.',
      steps: { steps: [
        { tex: 'x + 48 + 67 = 180', text: 'The three angles of any triangle add to 180°. Write that as an equation with x as the unknown third angle.' },
        { tex: '48 + 67 = 115', text: 'Add the two known angles first to combine them into one number, so the equation has fewer pieces.' },
        { tex: 'x = 180 - 115 = 65', text: 'Subtract that sum from 180 to find what is left for the third angle. The leftover is the third angle because the total must be exactly 180.' },
        { tex: '48 + 67 + 65 = 180', text: 'Check by adding all three angles. They make 180, so the answer works. Test-day move: subtract both known angles from 180 in one go.' },
      ], answer: '65^\\circ' },
    },
    {
      kind: 'example',
      head: 'Exterior 130°, one far angle 55°',
      body: 'A triangle has an exterior angle of 130°, and one of the two far interior angles is 55°. Find the other far angle.',
      formula: { tex: '130 = 55 + x \\;\\Rightarrow\\; x = 75^\\circ', note: 'One step with the exterior angle theorem.', parts: [{ sym: '130', means: 'the exterior angle', tone: 'accent' }, { sym: '55 + x', means: 'the two far interior angles', tone: 'ok' }] },
      steps: { steps: [
        { tex: '\\text{exterior} = \\text{far}_1 + \\text{far}_2', text: 'The exterior angle theorem says an exterior angle equals the sum of the two interior angles that do not touch it.' },
        { tex: '130 = 55 + x', text: 'Put in the numbers. The 130° is the exterior angle and 55° is one far angle, so the other far angle is the unknown x.' },
        { tex: 'x = 130 - 55 = 75', text: 'Subtract 55 from both sides to get x alone. This one step is faster on test day than finding the neighbor angle and using the triangle sum.' },
      ], answer: '75^\\circ' },
    },
    {
      kind: 'example',
      head: 'Another way: use the straight line',
      body: 'Same triangle, but pretend you have forgotten the exterior angle theorem. You can rebuild the answer from the two basic rules.',
      steps: { steps: [
        { tex: '180 - 130 = 50', text: 'The exterior angle and the interior angle next to it make a straight line, so they add to 180. The inside neighbor is 50°.' },
        { tex: '55 + x + 50 = 180', text: 'Now use the triangle sum. The three interior angles are 55°, 50° and the unknown x, and they must add to 180°.' },
        { tex: 'x = 180 - 55 - 50 = 75', text: 'Subtract the two known angles from 180. This gives the same 75° as the theorem, which is a good check that the theorem is not magic.' },
      ], answer: '75^\\circ' },
    },
    {
      kind: 'example',
      head: 'Parallel lines: find the partner',
      body: 'One angle at a crossing is 72°. Which angles are also 72° and which are 108°? The rule is that partners are either equal or add to 180°.',
      table: { head: ['Angle pair', 'Relationship', 'Partner of 72°'], rows: [['corresponding', 'equal', '72°'], ['alternate interior', 'equal', '72°'], ['co-interior', 'add to 180°', '108°']], mark: 2, note: 'Equal, or adding to 180° — nothing else.' },
      steps: { steps: [
        { text: 'Parallel lines cut by a transversal make only two angle sizes, so every partner of the 72° angle is either 72° or something that adds with it to 180°.' },
        { tex: '\\text{corresponding} = 72^\\circ', text: 'Corresponding angles are in the same spot at each crossing. Parallel lines slant the same way, so they are equal. Alternate interior angles are also equal.' },
        { tex: '180 - 72 = 108', text: 'Co-interior angles sit between the parallels on the same side, so they form a straight-line pair with the 72° angle and add to 180. That makes the partner 108°.' },
      ], answer: '108^\\circ' },
    },
    {
      kind: 'example',
      head: 'Picture it first: an isosceles triangle',
      body: 'An isosceles triangle has a vertex angle of 40°. Find each base angle. Sketch it and label the two equal base angles b.',
      art: triangle({ A: 'b', B: 'b', C: '40°', shape: [[100, 210], [300, 210], [200, 50]], a: 'equal', b: 'equal', title: 'Equal sides, equal base angles', caption: '2b + 40 = 180, so b = 70°.' }),
      steps: { steps: [
        { text: 'The two equal sides sit opposite the two base angles, so the base angles are equal. Label both of them b.' },
        { tex: 'b + b + 40 = 180', text: 'The angles of a triangle add to 180°. Write that using the two b angles and the 40° vertex angle.' },
        { tex: '2b = 140', text: 'Combine the two b terms into 2b, then subtract 40 from both sides to keep the equation balanced.' },
        { tex: 'b = 70', text: 'Divide both sides by 2. Check: 70 + 70 + 40 = 180. Quick test-day move: subtract the vertex angle from 180, then halve it.' },
      ], answer: '70^\\circ' },
    },
    {
      kind: 'example',
      head: 'Angles in a ratio: x, 2x, 3x',
      body: 'The angles of a triangle are in the ratio 1 : 2 : 3. Find all three. Write them as x, 2x and 3x.',
      formula: { tex: 'x + 2x + 3x = 180 \\;\\Rightarrow\\; x = 30', note: 'Add the parts, then share out the 180°.', parts: [{ sym: '6x', means: 'the three angles together', tone: 'accent' }, { sym: '180', means: 'what every triangle\'s angles add to', tone: 'ok' }] },
      steps: { steps: [
        { tex: 'x + 2x + 3x = 180', text: 'A ratio 1 : 2 : 3 means the angles are x, 2x and 3x for one shared x. The triangle sum says they add to 180°.' },
        { tex: '6x = 180', text: 'Combine like terms. One x plus two x plus three x is six x, because all three terms are the same kind of thing.' },
        { tex: 'x = 30', text: 'Divide both sides by 6 to get x alone. Each part of the ratio is worth 30°.' },
        { tex: '30^\\circ,\\ 60^\\circ,\\ 90^\\circ', text: 'Multiply to get 2x = 60 and 3x = 90. Check: 30 + 60 + 90 = 180. On test day, 180 divided by the 6 ratio parts gives the part size right away.' },
      ], answer: '30^\\circ,\\ 60^\\circ,\\ 90^\\circ' },
    },
    {
      kind: 'protip',
      head: 'Spot equal sides, mark equal angles',
      body: 'Tick marks or the word "isosceles" mean two equal sides — and the angles opposite them are equal too. Mark them the moment you see them; the problem often solves itself.',
      art: flow([{ label: 'See equal sides', color: SKY }, { label: 'Mark the opposite angles equal', color: AMB }, { label: 'Use the 180° sum', color: EMR }], { title: 'The isosceles move', caption: 'Equal sides always come with equal angles.' }),
      why: 'Fold an isosceles triangle down its middle and the two equal sides land on each other, so the angles at the bottom must land on each other too. Equal sides force equal angles opposite them. Marking them turns two unknowns into one, which is what makes the 180° sum solvable.',
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
      why: 'The exterior angle and the inside angle next to it sit on one straight line, so they add to 180 and are never equal unless both are 90. The inside neighbor here is 50°, and 130 + 50 = 180. Equality only holds between the exterior angle and the two far angles added together.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: two unknowns',
      body: 'In a triangle, one angle is 20° more than another, and the third angle is 70°. Find the smallest angle.',
      steps: { steps: [
        { tex: 'x + (x + 20) + 70 = 180', text: 'Call the smaller of the two related angles x, so the other is x + 20. The three angles of a triangle add to 180°, which gives this equation.' },
        { tex: '2x + 90 = 180', text: 'Combine like terms: x plus x is 2x, and 20 plus 70 is 90. Grouping like terms makes the equation shorter to solve.' },
        { tex: '2x = 90', text: 'Subtract 90 from both sides to move the plain numbers away from the x term. Both sides stay equal because we did the same thing to each.' },
        { tex: 'x = 45', text: 'Divide both sides by 2. The angles are then 45°, 65° and 70°, which add to 180°. The smallest is 45°, not the 70° we were handed.' },
      ], answer: '45^\\circ' },
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
      why: 'A rectangle is rows of unit squares, l squares per row and w rows. Any triangle fits exactly inside a rectangle of the same base and height, taking up half of it, so its area is half of base times height. A circle uses r squared because area counts squares, which are two lengths multiplied, and π is the fixed ratio that fits the curve.',
    },
    {
      kind: 'concept',
      head: 'Volume: base area times height',
      body: 'A prism or cylinder is a stack of identical layers, so its volume is the area of the base times the height. A cone or pyramid is exactly one third of its matching prism.',
      formula: { tex: 'V = Bh, \\qquad V_{\\text{cone}} = \\tfrac{1}{3}Bh', note: 'Pointed solids hold a third as much.', parts: [{ sym: 'B', means: 'the area of the base layer', tone: 'accent' }, { sym: '\\tfrac{1}{3}', means: 'for a cone or pyramid only', tone: 'ok' }] },
      art: prism('4', '3', '5', { inside: 'V = 60', layers: 5, title: 'Five layers of 12', caption: 'Base 4 × 3 = 12, stacked 5 high: 60.' }),
      why: 'Each layer of a prism has the same area B, and stacking h layers of thickness 1 gives B times h units of space. A cone narrows to a point, so its layers shrink as you go up. Exactly three cones of the same base and height fill one matching cylinder, so a cone holds one third.',
    },
    {
      kind: 'concept',
      head: 'Similar figures scale by k, k², k³',
      body: 'If every length is multiplied by k, areas multiply by k² and volumes by k³. Area has two dimensions and volume has three, so the scale factor is used that many times.',
      table: { head: ['Measure', 'Scale by', 'When k = 3'], rows: [['length', 'k', '×3'], ['area', 'k²', '×9'], ['volume', 'k³', '×27']], note: 'One factor of k per dimension.' },
      why: 'Area is length times width, and both of those lengths get multiplied by k, so area gets k times k. Volume is length times width times height, so it gets three factors of k. Check with a cube: a 1-by-1-by-1 cube scaled by 3 is 3 by 3 by 3, which holds 27 small cubes.',
    },
    {
      kind: 'example',
      head: 'A cylinder: r = 3, h = 10',
      body: 'Find the volume of a cylinder with radius 3 and height 10. Think of it as a stack of circles.',
      steps: { steps: [
        { tex: 'V = Bh', text: 'A cylinder is a stack of identical layers, so its volume is the base area B times the height h.' },
        { tex: 'B = \\pi(3)^2 = 9\\pi', text: 'The base is a circle, so use the circle area formula pi r squared. Square the radius first: 3 squared is 9. Leave pi as a symbol so the answer stays exact.' },
        { tex: 'V = 9\\pi \\times 10 = 90\\pi', text: 'Multiply the base area by the height of 10 to stack that many layers. If the choices are numbers, 90 times 3.14 is about 283. This formula is on the reference sheet, so you do not have to memorize it.' },
      ], answer: '90\\pi' },
    },
    {
      kind: 'example',
      head: 'A hole in a rectangle',
      body: 'A 10 × 8 rectangle has a 4 × 3 hole cut out. Find the area that is left. Find the whole, then take away the hole.',
      art: rectWithHole(),
      formula: { tex: '10 \\times 8 - 4 \\times 3 = 68', note: 'Whole minus hole.', parts: [{ sym: '10 \\times 8', means: 'the whole rectangle, before the cut', tone: 'accent' }, { sym: '4 \\times 3', means: 'the hole, taken away', tone: 'bad' }] },
      steps: { steps: [
        { tex: '10 \\times 8 = 80', text: 'Find the area of the whole rectangle as if there were no hole, using length times width.' },
        { tex: '4 \\times 3 = 12', text: 'Find the area of the hole with the same rectangle formula. The hole is also a rectangle.' },
        { tex: '80 - 12 = 68', text: 'Subtract, because the hole removes area that was part of the whole. Areas can be added and subtracted since they just count squares. On test day, the shaded area is always the whole minus the cut-out.' },
      ], answer: '68' },
    },
    {
      kind: 'example',
      head: 'Similar triangles, area 5, scale 3',
      body: 'A triangle has area 5. A similar triangle has every side 3 times as long. What is its area?',
      steps: { steps: [
        { tex: 'k = 3', text: 'The scale factor k is how many times longer each side is. Here every length is multiplied by 3.' },
        { tex: 'k^2 = 3^2 = 9', text: 'Area has two dimensions, so the scale factor is used twice. Areas grow by k squared, which is 9.' },
        { tex: '5 \\times 9 = 45', text: 'Multiply the original area by 9. A common slip is to multiply by 3 and get 15, which only works for lengths.' },
      ], answer: '45' },
    },
    {
      kind: 'example',
      head: 'Another way: count the copies',
      body: 'Same question, answered with a picture. Scale a small square by 3 and see how many copies of it fit inside.',
      art: shapeBox('3', '3', { wUnits: 3, hUnits: 3, grid: true, inside: '9 copies', title: 'Scale by 3: nine small squares', caption: 'Three across and three down makes nine.' }),
      steps: { steps: [
        { text: 'Stretch the shape by 3 in both directions. The new shape is 3 times as wide and 3 times as tall as the original.' },
        { tex: '3 \\times 3 = 9', text: 'Three copies fit across the width and three fit down the height, so 3 times 3, or 9 copies of the original fill the new shape.' },
        { tex: '9 \\times 5 = 45', text: 'Each copy has area 5, so the new area is 9 times 5. This matches the k squared rule and shows why the rule is true.' },
      ], answer: '45' },
    },
    {
      kind: 'example',
      head: 'Similar triangles: find the side',
      body: 'Two similar triangles: a side of 4 on the small one matches a side of 6 on the big one. A side of 10 on the small triangle matches what on the big one?',
      formula: { tex: '\\frac{6}{4} = \\frac{x}{10} \\;\\Rightarrow\\; x = 15', note: 'Match corresponding sides, big over small both times.', parts: [{ sym: '6/4', means: 'the scale factor from small to big', tone: 'accent' }, { sym: 'x/10', means: 'the unknown big side over its small partner', tone: 'ok' }] },
      steps: { steps: [
        { tex: '\\frac{6}{4} = 1.5', text: 'Similar triangles have all sides in the same ratio. Matching sides 4 and 6 give the scale factor: big over small is 1.5.' },
        { tex: '\\frac{x}{10} = 1.5', text: 'The same factor applies to every pair of matching sides, so the unknown big side over its small partner 10 must also be 1.5. Keep big over small in both ratios.' },
        { tex: 'x = 10 \\times 1.5 = 15', text: 'Multiply both sides by 10 to get x alone. Check: 15 over 10 is 1.5, the same as 6 over 4.' },
      ], answer: 'x = 15' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a cone of ice cream',
      body: 'A cone has radius 3 and height 4. Find its volume. Picture the cylinder with the same base and height that it fits inside.',
      table: { head: ['Solid', 'Volume'], rows: [['cylinder, r = 3, h = 4', '36π'], ['cone, same r and h', '⅓ × 36π = 12π']], mark: 1, note: 'A cone always holds a third of its cylinder.' },
      steps: { steps: [
        { tex: 'B = \\pi(3)^2 = 9\\pi', text: 'Start with the base, a circle of radius 3. Its area is pi times radius squared, which is 9 pi.' },
        { tex: 'V_{\\text{cylinder}} = 9\\pi \\times 4 = 36\\pi', text: 'The matching cylinder has volume base times height. This is the easier solid to picture, and the cone sits inside it.' },
        { tex: 'V_{\\text{cone}} = \\tfrac{1}{3}(36\\pi) = 12\\pi', text: 'A cone holds exactly one third of the matching cylinder, because three cones fill it. Dividing 36 pi by 3 gives 12 pi. Do not use the radius and height without the one third.' },
      ], answer: '12\\pi' },
    },
    {
      kind: 'protip',
      head: 'The reference sheet has the formulas',
      body: 'Every area and volume formula you need is printed at the start of the test. Your job is knowing WHICH one and plugging in carefully — and remembering that k² and k³ are not on it.',
      art: flow([{ label: 'Name the shape', color: SKY }, { label: 'Pick the formula', color: AMB }, { label: 'Scaled? Use k² or k³', color: EMR }], { title: 'Area and volume in three moves', caption: 'The scaling rule is the one thing you must bring yourself.' }),
      why: 'The reference sheet lists the area and volume formulas, so memorizing them is not where points are won. The errors come from picking the wrong shape or forgetting that scaling changes area and volume by more than the scale factor. Naming the shape first and checking for scaling second catches most mistakes.',
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
      why: 'Take a 1-by-1-by-1 cube and double it to 2 by 2 by 2. Eight of the small cubes fit inside, two layers of four. Length doubled, but volume went up eight-fold because each of the three dimensions doubled.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: volume ratio from area ratio',
      body: 'Two similar solids have surface areas in the ratio 4 : 9. What is the ratio of their volumes? Find the length ratio first.',
      steps: { steps: [
        { tex: 'k^2 = \\tfrac{9}{4}', text: 'Surface area is an area, so it scales by k squared. Going from the first solid to the second, the area ratio 9 over 4 equals k squared.' },
        { tex: 'k = \\tfrac{3}{2}', text: 'Take the square root of both sides to undo the square. The square root of 9 is 3 and of 4 is 2, so each length is 3/2 times as long.' },
        { tex: 'k^3 = \\left(\\tfrac{3}{2}\\right)^3 = \\tfrac{27}{8}', text: 'Volume has three dimensions, so cube the length ratio. 3 cubed is 27 and 2 cubed is 8, so the second solid has 27/8 the volume of the first.' },
        { tex: '8 : 27', text: 'The question asked for the first solid to the second, so flip it. Test-day shortcut: the volume ratio is the area ratio raised to the power 3/2, which is 2 cubed to 3 cubed.' },
      ], answer: '8 : 27' },
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
      why: 'Draw a square on each side of the triangle. The theorem says the two small squares have exactly as much area as the big square on the hypotenuse. Check with 3, 4, 5: the squares have areas 9 and 16, and together they make 25, the square on the 5.',
    },
    {
      kind: 'concept',
      head: 'Triples you should know',
      body: 'Some right triangles have whole-number sides. Spot one and skip the square roots. Multiples work too: 6-8-10 is just 3-4-5 doubled.',
      table: { head: ['Triple', 'Check'], rows: [['3, 4, 5', '9 + 16 = 25'], ['5, 12, 13', '25 + 144 = 169'], ['8, 15, 17', '64 + 225 = 289'], ['6, 8, 10', '3-4-5 doubled']] },
      why: 'A triple is a set of whole numbers that happens to satisfy a squared plus b squared equals c squared, so the square root comes out clean. Multiplying every side by the same number scales the whole triangle without changing its shape, so the equation still holds: 36 + 64 = 100. Recognizing a triple replaces a calculation with a lookup.',
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
      why: 'Cut a square along its diagonal: with legs x, Pythagoras gives x squared plus x squared, which is 2x squared, so the diagonal is x times the square root of 2. Cut an equilateral triangle of side 2x down the middle and the short leg is x, the hypotenuse is 2x, and the other leg is x times the square root of 3 by Pythagoras.',
    },
    {
      kind: 'concept',
      head: 'SOH-CAH-TOA',
      body: 'Stand at an angle θ. The side across from you is opposite, the leg touching you is adjacent, and the longest side is the hypotenuse. Each trig ratio divides two of them.',
      formula: { tex: '\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}},\\ \\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}},\\ \\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}', note: 'SOH, CAH, TOA.', parts: [{ sym: '\\text{opp}', means: 'the side across from the angle', tone: 'accent' }, { sym: '\\text{adj}', means: 'the leg that touches the angle', tone: 'ok' }] },
      art: rightTriangle({ opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse', angle: 'θ', title: 'Named from the angle θ', caption: 'Change the angle and opposite and adjacent swap.' }),
      why: 'All right triangles with the same angle θ are similar, so their side ratios are identical whatever the size. That is why one number, sin θ, can stand for opposite over hypotenuse in a tiny triangle or a huge one. Opposite and adjacent depend on which angle you stand at; the hypotenuse never changes.',
    },
    {
      kind: 'example',
      head: 'Find the hypotenuse: legs 9 and 12',
      body: 'A right triangle has legs 9 and 12. Find the hypotenuse using the Pythagorean theorem.',
      steps: { steps: [
        { tex: '9^2 + 12^2 = c^2', text: 'The theorem says the legs squared add to the hypotenuse squared. It applies because the triangle has a right angle, and 9 and 12 are the legs.' },
        { tex: '81 + 144', text: 'Square each leg: 9 times 9 is 81 and 12 times 12 is 144. Square before adding, since the exponents act on each leg separately.' },
        { tex: 'c^2 = 225', text: 'Add the two squares to get the hypotenuse squared. This is the area of the big square, not yet the length.' },
        { tex: 'c = \\sqrt{225} = 15', text: 'Take the positive square root, because a length cannot be negative. Test-day move: 9 and 12 are 3 times 3 and 4, so it is a 3-4-5 triple, giving 15 with no calculation.' },
      ], answer: 'c = 15' },
    },
    {
      kind: 'example',
      head: 'Another way: spot the triple',
      body: 'Same triangle, no squaring. Look for a famous triple hiding in the numbers 9 and 12.',
      table: { head: ['', 'Leg', 'Leg', 'Hyp'], rows: [['3-4-5', '3', '4', '5'], ['× 3', '9', '12', '15']], mark: 1, note: 'Scale the whole triple together.' },
      steps: { steps: [
        { tex: '9 \\div 3 = 3,\\quad 12 \\div 3 = 4', text: 'Divide both legs by their common factor 3. This shrinks the triangle to a smaller one with the same shape.' },
        { tex: '3,\\ 4,\\ 5', text: 'The reduced legs 3 and 4 are the famous 3-4-5 right triangle, whose hypotenuse is 5. You verified it before: 9 plus 16 equals 25.' },
        { tex: '5 \\times 3 = 15', text: 'Scale back up. Multiplying every side of a triple by the same number keeps it a right triangle, so the hypotenuse is 5 times 3. This saves time on test day.' },
      ], answer: 'c = 15' },
    },
    {
      kind: 'example',
      head: 'Find a leg: hypotenuse 13, leg 5',
      body: 'A right triangle has hypotenuse 13 and one leg 5. Find the other leg. When you know the hypotenuse, you subtract.',
      steps: { steps: [
        { tex: '5^2 + b^2 = 13^2', text: 'Write the theorem with the hypotenuse alone on the right side. The 13 is the longest side, so it is c, not a leg.' },
        { tex: 'b^2 = 13^2 - 5^2 = 169 - 25', text: 'Subtract 5 squared from both sides to isolate b squared. Square 13 to get 169 and square 5 to get 25.' },
        { tex: 'b^2 = 144', text: 'Do the subtraction. 169 minus 25 is 144, so the unknown leg squared is 144.' },
        { tex: 'b = \\sqrt{144} = 12', text: 'Take the positive square root. Test-day move: 5 and 13 belong to the 5-12-13 triple, so the missing leg is 12 at once.' },
      ], answer: 'b = 12' },
    },
    {
      kind: 'example',
      head: 'A 30-60-90 with hypotenuse 10',
      body: 'A 30-60-90 triangle has a hypotenuse of 10. Find the short leg and the long leg. The sides are in the ratio x, x√3, 2x.',
      art: rightTriangle({ opp: '5', adj: '5√3', hyp: '10', angle: '30°', shape: { opp: 1, adj: 1.732 }, title: 'Short leg 5, long leg 5√3', caption: 'The short leg sits across from the 30° angle.' }),
      steps: { steps: [
        { tex: '2x = 10', text: 'In a 30-60-90 triangle the hypotenuse is twice the short leg. Call the short leg x, so the hypotenuse is 2x, and here it is 10.' },
        { tex: 'x = 5', text: 'Divide both sides by 2. The short leg is 5, and it sits across from the smallest angle, 30°.' },
        { tex: 'x\\sqrt{3} = 5\\sqrt{3}', text: 'The long leg is the short leg times the square root of 3, from the ratio x, x root 3, 2x. It is across from 60°.' },
        { tex: '5^2 + (5\\sqrt{3})^2 = 25 + 75 = 100', text: 'Check with Pythagoras: 25 plus 75 is 100, which is 10 squared. Test-day move: use the ratio from the reference sheet instead of solving with sine.' },
      ], answer: '5 \\text{ and } 5\\sqrt{3}' },
    },
    {
      kind: 'example',
      head: 'A sine: opposite 8, hypotenuse 17',
      body: 'A right triangle has an angle θ with opposite side 8 and hypotenuse 17. Find sin θ, and the other trig ratios if you can.',
      formula: { tex: '\\sin\\theta = \\frac{8}{17}', note: 'Opposite over hypotenuse.', parts: [{ sym: '8', means: 'the side opposite the angle', tone: 'accent' }, { sym: '17', means: 'the hypotenuse', tone: 'ok' }] },
      art: rightTriangle({ opp: '8', adj: '15', hyp: '17', angle: 'θ', shape: { opp: 8, adj: 15 }, title: 'The 8-15-17 triangle', caption: 'sin θ = 8/17, cos θ = 15/17, tan θ = 8/15.' }),
      steps: { steps: [
        { tex: '\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}', text: 'SOH says sine is opposite over hypotenuse. This ratio is the same for every right triangle with this angle.' },
        { tex: '\\sin\\theta = \\frac{8}{17}', text: 'Put in the two sides we were given. The 8 is across from the angle and the 17 is the longest side. Sine needs no third side.' },
        { tex: '8^2 + b^2 = 17^2 \\Rightarrow b = 15', text: 'If cosine or tangent is wanted, find the adjacent side with Pythagoras: 289 minus 64 is 225, and the square root is 15. This is the 8-15-17 triple.' },
        { tex: '\\cos\\theta = \\tfrac{15}{17},\\ \\tan\\theta = \\tfrac{8}{15}', text: 'Then CAH gives adjacent over hypotenuse and TOA gives opposite over adjacent. The fraction 8/17 cannot be simplified, so leave it as is.' },
      ], answer: '\\sin\\theta = \\tfrac{8}{17}' },
    },
    {
      kind: 'example',
      head: 'Complementary angles: sin x° = cos 25°',
      body: 'If sin x° = cos 25°, what is x? The two acute angles of a right triangle are complementary.',
      formula: { tex: '\\sin x^\\circ = \\cos(90^\\circ - x^\\circ)', note: 'Sine and cosine swap between complementary angles.', parts: [{ sym: '90 - x', means: 'the other acute angle', tone: 'accent' }, { sym: 'x = 65', means: 'because 90 − 65 = 25', tone: 'ok' }] },
      steps: { steps: [
        { text: 'The two acute angles of a right triangle add to 90°, because all three angles add to 180° and the right angle uses 90° of that.' },
        { text: 'The side opposite one acute angle is the side adjacent to the other. Sine is opposite over hypotenuse and cosine is adjacent over hypotenuse, so the sine of one angle equals the cosine of the other.' },
        { tex: 'x + 25 = 90', text: 'So if sin x equals cos 25, the angles x and 25 are the two acute angles of one right triangle, and they add to 90.' },
        { tex: 'x = 90 - 25 = 65', text: 'Subtract 25 from both sides. Test-day move: whenever sine equals cosine in a question, add the angles and set the sum to 90 without drawing anything.' },
      ], answer: 'x = 65' },
    },
    {
      kind: 'protip',
      head: 'Complementary angles swap sine and cosine',
      body: 'If sin A = cos B, then A + B = 90°. The SAT asks this almost every test. Recognize it and you are done in seconds.',
      art: flow([{ label: 'See sin A = cos B', color: SKY }, { label: 'So A + B = 90°', color: AMB }, { label: 'Subtract to find the angle', color: EMR }], { title: 'The co-function shortcut', caption: 'The opposite side for one angle is the adjacent side for the other.' }),
      why: 'In a right triangle, the leg that is opposite angle A is the leg next to angle B, and both ratios use the same hypotenuse. So sin A and cos B are the same fraction. Since the two acute angles always add to 90, sine of one equals cosine of the other.',
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
      why: 'The hypotenuse is the longest side of a right triangle, so no leg can be as long as it. Putting 13 with the legs gives c about 13.9, which is longer than the supposed hypotenuse. If a leg is longer than the side you are calling the hypotenuse, you have swapped them.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a ladder against a wall',
      body: 'A 13-foot ladder leans on a wall with its foot 5 feet from the wall. How high up the wall does it reach? Picture the right triangle: the ladder is the hypotenuse.',
      steps: { steps: [
        { text: 'The wall is vertical and the ground is horizontal, so they meet at a right angle. The ladder, the wall and the ground form a right triangle, and the ladder is the hypotenuse because it faces the right angle.' },
        { tex: 'h^2 + 5^2 = 13^2', text: 'Use the Pythagorean theorem with the unknown height h and the 5-foot distance as the legs, and the 13-foot ladder alone on the right.' },
        { tex: 'h^2 = 169 - 25 = 144', text: 'Subtract 25 from both sides to isolate h squared. 13 squared is 169, so the leftover is 144.' },
        { tex: 'h = \\sqrt{144} = 12', text: 'Take the positive square root since a height cannot be negative. Test-day move: 5 and 13 are part of the 5-12-13 triple, so the answer is 12 feet right away.' },
      ], answer: 'h = 12\\text{ ft}' },
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
      why: 'For a point (x, y) on the circle, the horizontal gap from the center is x − h and the vertical gap is y − k. Those are the legs of a right triangle whose hypotenuse is the radius, so Pythagoras gives (x − h) squared plus (y − k) squared equals r squared. The sign flips because x − 2 is zero at x = 2, so the center is at +2.',
    },
    {
      kind: 'concept',
      head: 'Arcs and sectors are fractions of the circle',
      body: 'A 60° angle is 60/360 = 1/6 of the full turn. So its arc is 1/6 of the circumference and its sector is 1/6 of the area.',
      formula: { tex: '\\text{arc} = \\frac{\\theta}{360} \\cdot 2\\pi r, \\quad \\text{sector} = \\frac{\\theta}{360} \\cdot \\pi r^2', note: 'The same fraction, applied to two different wholes.', parts: [{ sym: '\\theta/360', means: 'what fraction of the circle the angle takes', tone: 'accent' }, { sym: '2\\pi r', means: 'the full circumference, for an arc', tone: 'ok' }] },
      art: sector(60, 'arc 3π', 'A 60° slice is 1/6 of the circle', 'The arc is 1/6 of the 18π circumference: 3π.'),
      why: 'A full turn is 360°, so an angle of θ degrees cuts off θ out of 360 equal pieces of the circle. Each piece takes the same share of the edge and of the inside. So the arc is that fraction of the circumference and the sector is that fraction of the area.',
    },
    {
      kind: 'concept',
      head: 'Radians: 180° is π',
      body: 'Radians measure an angle by arc length on a circle of radius 1. Half a turn, 180°, is π radians. So 60° is π/3 and 90° is π/2.',
      formula: { tex: '180^\\circ = \\pi \\text{ rad}', note: 'Multiply by π/180 to go from degrees to radians.', parts: [{ sym: '\\pi', means: 'half a turn, in radians', tone: 'accent' }, { sym: '\\pi/180', means: 'the conversion factor from degrees', tone: 'ok' }] },
      art: unitCircle(60, { label: 'π/3', caption: 'A 60° turn on a unit circle sweeps an arc of length π/3.' }),
      why: 'The whole edge of a circle of radius 1 has length 2π, and that is a full turn of 360°. So half the edge is π and a half turn of 180° is π radians. Any angle is the same fraction of π as it is of 180°, which makes the conversion factor π over 180.',
    },
    {
      kind: 'example',
      head: 'Read it: (x − 2)² + (y + 5)² = 36',
      body: 'Find the center and radius of the circle with equation (x − 2)² + (y + 5)² = 36.',
      formula: { tex: '(x - 2)^2 + (y + 5)^2 = 36', note: 'Center (2, −5), radius 6.', parts: [{ sym: 'y + 5', means: 'k = −5: the sign flips', tone: 'accent' }, { sym: '36', means: 'r² = 36, so r = 6', tone: 'ok' }] },
      steps: { steps: [
        { tex: '(x - h)^2 + (y - k)^2 = r^2', text: 'Compare with standard form, which has minus signs inside the brackets. Matching the pattern lets you read the center and radius straight off.' },
        { tex: 'x - 2 \\Rightarrow h = 2', text: 'The x bracket already has the form x minus h, so h is 2.' },
        { tex: 'y + 5 = y - (-5) \\Rightarrow k = -5', text: 'Rewrite plus 5 as minus negative 5 to match the pattern. That is why the sign flips: the center is (2, −5), not (2, 5).' },
        { tex: 'r^2 = 36 \\Rightarrow r = 6', text: 'The right side is r squared, not r. Take the positive square root of 36, since a radius is a length. On test day, flip the signs and root the number.' },
      ], answer: '\\text{center } (2, -5),\\ r = 6' },
    },
    {
      kind: 'example',
      head: 'Complete the square: x² + 6x + y² − 4y = 12',
      body: 'Find the center and radius of x² + 6x + y² − 4y = 12. Group the x-terms and y-terms, then add the square of half of each middle coefficient to BOTH sides.',
      steps: { steps: [
        { tex: '(x^2 + 6x) + (y^2 - 4y) = 12', text: 'Group the x-terms together and the y-terms together. Completing the square works on one variable at a time.' },
        { tex: '\\left(\\tfrac{6}{2}\\right)^2 = 9,\\quad \\left(\\tfrac{-4}{2}\\right)^2 = 4', text: 'Take half of each middle coefficient and square it. Half of 6 is 3, squared is 9. Half of −4 is −2, squared is 4. These are the numbers that make each group a perfect square.' },
        { tex: '(x^2 + 6x + 9) + (y^2 - 4y + 4) = 12 + 9 + 4', text: 'Add 9 and 4 to both sides, not just the left. Adding the same amount to both sides keeps the equation true.' },
        { tex: '(x + 3)^2 + (y - 2)^2 = 25', text: 'Rewrite each group as a square: x squared plus 6x plus 9 is (x + 3) squared, and y squared minus 4y plus 4 is (y − 2) squared. The right side is 12 plus 9 plus 4, which is 25.' },
        { tex: 'r = \\sqrt{25} = 5', text: 'Read off the center (−3, 2), flipping the signs. The radius is the square root of 25. Test-day move: only the right side needs the sum, so just add 12, 9 and 4.' },
      ], answer: '\\text{center } (-3, 2),\\ r = 5' },
    },
    {
      kind: 'example',
      head: 'Arc length: 60° in a circle of radius 9',
      body: 'Find the length of an arc of 60° in a circle of radius 9. The arc is the same fraction of the circumference as the angle is of 360°.',
      steps: { steps: [
        { tex: '\\frac{60}{360} = \\frac{1}{6}', text: 'A full turn is 360°, so 60° is 60 out of 360 of the circle. Dividing top and bottom by 60 gives one sixth.' },
        { tex: 'C = 2\\pi(9) = 18\\pi', text: 'Find the whole circumference with 2 pi r. The arc is a piece of this whole, so you need the whole first.' },
        { tex: '\\frac{1}{6} \\times 18\\pi = 3\\pi', text: 'Take that same fraction of the circumference, because an angle that takes one sixth of the turn cuts off one sixth of the edge. Eighteen pi divided by 6 is 3 pi.' },
      ], answer: '3\\pi' },
    },
    {
      kind: 'example',
      head: 'Another way: use radians',
      body: 'Same arc, with radians. Convert 60° to radians, then use arc length s = rθ, which only works when θ is in radians.',
      formula: { tex: 's = r\\theta = 9 \\cdot \\frac{\\pi}{3} = 3\\pi', note: 'Only works with θ in radians.', parts: [{ sym: 'r', means: 'the radius, 9', tone: 'accent' }, { sym: '\\theta', means: 'the angle in radians, π/3', tone: 'ok' }] },
      steps: { steps: [
        { tex: '60 \\times \\frac{\\pi}{180} = \\frac{\\pi}{3}', text: 'Multiply by pi over 180 to change degrees into radians, since 180° equals pi radians. Simplify: 60 over 180 is one third.' },
        { tex: 's = r\\theta', text: 'In radians, the angle is arc length divided by radius, so arc length is radius times angle. This works only in radians, never in degrees.' },
        { tex: 's = 9 \\cdot \\frac{\\pi}{3} = 3\\pi', text: 'Multiply 9 by pi over 3. Nine divided by 3 is 3, so the arc is 3 pi. This matches the fraction method and skips the 360.' },
      ], answer: '3\\pi' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a quarter of a pizza',
      body: 'A 90° sector of a circle has radius 4. Find its area. Sketch it first: 90° is one quarter of a full turn.',
      art: pie([{ label: '90°: 4π', part: 1, color: AMB }, { label: 'the other 3/4', part: 3, color: SKY }], { title: 'A 90° sector is 1/4', caption: 'One quarter of 16π is 4π.' }),
      steps: { steps: [
        { tex: '\\frac{90}{360} = \\frac{1}{4}', text: 'A full turn is 360°, so a 90° wedge is one quarter of the circle. The picture shows one slice out of four equal slices.' },
        { tex: 'A = \\pi(4)^2 = 16\\pi', text: 'Find the area of the whole circle with pi r squared. The sector is part of this whole, so find the whole first.' },
        { tex: '\\frac{1}{4} \\times 16\\pi = 4\\pi', text: 'Take that same fraction of the whole area, because one quarter of the turn sweeps one quarter of the inside. Sixteen pi divided by 4 is 4 pi.' },
      ], answer: '4\\pi' },
    },
    {
      kind: 'example',
      head: 'Degrees to radians: 135°',
      body: 'Convert 135° to radians. Multiply by π/180, since 180° equals π radians.',
      table: { head: ['Degrees', 'Radians'], rows: [['90°', 'π/2'], ['135°', '3π/4'], ['180°', 'π'], ['360°', '2π']], mark: 1, note: 'Each is the degree measure times π/180.' },
      steps: { steps: [
        { tex: '135 \\times \\frac{\\pi}{180}', text: 'Multiply by pi over 180. Since 180° is pi radians, this factor equals one in disguise, so the angle is unchanged and only the units change.' },
        { tex: '\\frac{135}{180} = \\frac{3}{4}', text: 'Simplify the fraction. Both 135 and 180 divide by 45: 135 over 45 is 3 and 180 over 45 is 4.' },
        { tex: '\\frac{3\\pi}{4}', text: 'So 135° is three quarters of pi. Sense check: 135 is three quarters of 180, and 180° is pi, so three quarters of pi fits. Test-day move: write the angle as a fraction of 180.' },
      ], answer: '\\tfrac{3\\pi}{4}' },
    },
    {
      kind: 'protip',
      head: 'A radius meets a tangent at 90°',
      body: 'A tangent line touches the circle at one point, and the radius to that point is perpendicular to it. That right angle is a gift: it hands you a right triangle for Pythagoras.',
      art: tangentLine(),
      why: 'Every other point on a tangent line is outside the circle, so farther from the center than the radius. The touching point is the closest one on the line, and the shortest path from the center to a line is the perpendicular. So the radius to the touching point must meet the tangent at 90°.',
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
      why: 'The equation comes from Pythagoras: the two squared gaps add to the squared distance to the center. So the number on the right is a squared distance, an area-like number, not the distance. A point 7 units right of the center is (7)² = 49 away in squared terms.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a hidden circle',
      body: 'Find the center and radius of x² + y² − 8x + 6y = 0. Complete the square in x and in y, adding the same amounts to both sides.',
      steps: { steps: [
        { tex: '(x^2 - 8x) + (y^2 + 6y) = 0', text: 'Group the x-terms and y-terms. The equation is in expanded form, so we need to complete the square to read the center.' },
        { tex: '\\left(\\tfrac{-8}{2}\\right)^2 = 16,\\quad \\left(\\tfrac{6}{2}\\right)^2 = 9', text: 'Half of −8 is −4, squared is 16. Half of 6 is 3, squared is 9. Those are the amounts that make each group a perfect square.' },
        { tex: '(x^2 - 8x + 16) + (y^2 + 6y + 9) = 0 + 16 + 9', text: 'Add 16 and 9 to both sides. Adding the same to both sides keeps the equation balanced, and the right side becomes 25.' },
        { tex: '(x - 4)^2 + (y + 3)^2 = 25', text: 'Rewrite each group as a square. Flip the signs to read the center (4, −3). The right side is r squared, so r is the square root of 25.' },
        { tex: 'r = 5', text: 'Take the positive root. Sense check: the circle passes through the origin, since 0 satisfies the original equation, and the distance from (4, −3) to (0, 0) is 5.' },
      ], answer: '\\text{center } (4, -3),\\ r = 5' },
    },
    {
      kind: 'summary',
      head: 'Circles, wrapped up',
      body: '(x − h)² + (y − k)² = r² has center (h, k) and radius r. Complete the square to find them when the equation is expanded. Arcs and sectors are θ/360 of the circle, and in radians arc length is rθ.',
      table: { head: ['Want', 'Use'], rows: [['center, radius', 'standard form'], ['arc length', '(θ/360) · 2πr'], ['sector area', '(θ/360) · πr²'], ['radians', '180° = π']] },
    },
  ],
};
