import type { LessonSlide, SlideBank } from './types';
import type { SlideArt } from './types';
import { AMB, EMR, INK, ROSE, SKY, VIO, W, arrow, art, axes, bars, balancePoint, boxPlot, dot, dotPlot, draws, fades, flow, histogram, line, path, pie, rect, sortedRow, text } from '../slideArt';
import type { Range } from '../slideArt';

// AP Statistics slide decks, units 1-7: describing data, center and spread,
// the normal model, regression, sampling, experiments, and probability rules.
// Every data set drawn here is the one the matching lesson works, so the deck
// and the lesson say the same numbers.

const f = (n: number) => (Math.round(n * 100) / 100).toString();
const sgn = (n: number) => f(n).replace('-', '−');

/**
 * A normal curve over a baseline marked at μ ± 1σ, 2σ, 3σ, with an optional
 * shaded region under it and dashed marks at the values a question names.
 */
function normalFig(o: {
  mu: number;
  sigma: number;
  shade?: [number, number];
  shadeColor?: string;
  shadeLabel?: { text: string; at: number; y?: number };
  marks?: { at: number; label: string; color?: string }[];
  tickText?: (k: number) => string;
  title?: string;
  caption?: string;
  alt: string;
}): SlideArt {
  const { mu, sigma } = o;
  const lo = mu - 3.6 * sigma, hi = mu + 3.6 * sigma;
  const x0 = 36, x1 = W - 36, base = 196, peakH = 118;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const pdf = (v: number) => Math.exp(-0.5 * ((v - mu) / sigma) ** 2);
  const Y = (v: number) => base - peakH * pdf(v);
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  b += line(x0 - 10, base, x1 + 10, base, INK, 1.8);
  const col = o.shadeColor ?? SKY;
  if (o.shade) {
    const a = Math.max(lo, Math.min(...o.shade));
    const z = Math.min(hi, Math.max(...o.shade));
    const n = 60;
    let d = `M ${f(X(a))} ${f(base)}`;
    for (let i = 0; i <= n; i++) {
      const v = a + ((z - a) * i) / n;
      d += ` L ${f(X(v))} ${f(Y(v))}`;
    }
    d += ` L ${f(X(z))} ${f(base)} Z`;
    b += fades(path(d, col, 1.5, `${col}55`), 0.3);
  }
  const n = 120;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const v = lo + ((hi - lo) * i) / n;
    d += `${i ? ' L' : 'M'} ${f(X(v))} ${f(Y(v))}`;
  }
  b += draws(path(d, AMB, 2.8), 700);
  for (let k = -3; k <= 3; k++) {
    const v = mu + k * sigma;
    b += line(X(v), base - 4, X(v), base + 4, INK, 1.4, undefined, 0.55);
    b += text(X(v), base + 18, o.tickText ? o.tickText(k) : sgn(v), { size: 10, op: 0.7 });
  }
  for (const m of o.marks ?? []) {
    const mc = m.color ?? ROSE;
    b += line(X(m.at), base, X(m.at), Y(m.at), mc, 2, '5 4');
    b += text(X(m.at), base + 38, m.label, { size: 11, fill: mc });
  }
  if (o.shadeLabel) b += text(X(o.shadeLabel.at), o.shadeLabel.y ?? 172, o.shadeLabel.text, { size: 12, fill: col });
  return art(o.alt, b, o.caption);
}

/** A scatterplot, optionally with a fitted line and one residual drawn in. */
function scatterFig(
  pts: { x: number; y: number }[],
  o: {
    range: Range;
    ticks: { x: number[]; y: number[] };
    fit?: { a: number; b: number; label: string; at: [number, number]; anchor?: 'start' | 'middle' | 'end' };
    resid?: { x: number; y: number; label: string };
    mean?: { x: number; y: number; label: string; anchor?: 'start' | 'middle' | 'end'; dx?: number; dy?: number; hollow?: boolean };
    xLabel?: string;
    yLabel?: string;
    title?: string;
    caption?: string;
    alt: string;
  },
): SlideArt {
  const ax = axes(o.range, { ticks: o.ticks, grid: true, pad: 36, xLabel: o.xLabel, yLabel: o.yLabel });
  let b = (o.title ? text(W / 2, 18, o.title, { size: 12, fill: VIO }) : '') + ax.body;
  if (o.fit) {
    b += draws(ax.curve((x) => o.fit!.a + o.fit!.b * x, SKY, 2.6), 600, 0.2);
    b += text(ax.X(o.fit.at[0]), ax.Y(o.fit.at[1]), o.fit.label, { size: 12, fill: SKY, anchor: o.fit.anchor ?? 'middle' });
  }
  pts.forEach((p, i) => {
    b += fades(dot(ax.X(p.x), ax.Y(p.y), 5.5, AMB), 0.15 + i * 0.08);
  });
  if (o.resid && o.fit) {
    const yhat = o.fit.a + o.fit.b * o.resid.x;
    b += line(ax.X(o.resid.x), ax.Y(o.resid.y), ax.X(o.resid.x), ax.Y(yhat), ROSE, 3);
    b += dot(ax.X(o.resid.x), ax.Y(o.resid.y), 6, ROSE);
    b += text(ax.X(o.resid.x) + 10, (ax.Y(o.resid.y) + ax.Y(yhat)) / 2 + 4, o.resid.label, { size: 11, fill: ROSE, anchor: 'start' });
  }
  if (o.mean) {
    const m = o.mean;
    b += m.hollow ? `<circle cx="${f(ax.X(m.x))}" cy="${f(ax.Y(m.y))}" r="6" fill="none" stroke="${ROSE}" stroke-width="2.4"/>` : dot(ax.X(m.x), ax.Y(m.y), 6, EMR);
    b += text(ax.X(m.x) + (m.dx ?? 10), ax.Y(m.y) + (m.dy ?? 18), m.label, { size: 11, fill: m.hollow ? ROSE : EMR, anchor: m.anchor ?? 'start' });
  }
  return art(o.alt, b, o.caption);
}

/** Two overlapping circles with the count in each region. */
function vennFig(o: { A: string; B: string; onlyA: string; both: string; onlyB: string; neither?: string; title?: string; caption?: string; alt: string }): SlideArt {
  const cy = 142, r = 68;
  let b = o.title ? text(W / 2, 26, o.title, { size: 13, fill: VIO }) : '';
  b += rect(52, 44, 296, 196, INK, 'none', 1.4, 8);
  b += fades(`<circle cx="162" cy="${cy}" r="${r}" fill="${SKY}33" stroke="${SKY}" stroke-width="2.4"/>`, 0.1);
  b += fades(`<circle cx="238" cy="${cy}" r="${r}" fill="${AMB}33" stroke="${AMB}" stroke-width="2.4"/>`, 0.25);
  b += text(136, 62, o.A, { size: 13, fill: SKY });
  b += text(264, 62, o.B, { size: 13, fill: AMB });
  b += text(124, cy + 6, o.onlyA, { size: 16, fill: SKY });
  b += text(200, cy + 6, o.both, { size: 16, fill: VIO });
  b += text(276, cy + 6, o.onlyB, { size: 16, fill: AMB });
  if (o.neither) b += text(304, 228, o.neither, { size: 11, op: 0.7 });
  return art(o.alt, b, o.caption);
}

/** A two-stage tree: two first branches, each splitting in two, with the end products. */
function treeFig(o: { first: [string, string]; second: [[string, string], [string, string]]; ends: [string, string, string, string]; hot?: number[]; title?: string; caption?: string; alt: string }): SlideArt {
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  const root: [number, number] = [40, 130];
  const L1: [number, number][] = [[150, 80], [150, 180]];
  const L2: [number, number][] = [[270, 50], [270, 110], [270, 150], [270, 210]];
  const seg = (p: [number, number], q: [number, number], col: string, delay: number) =>
    draws(line(p[0], p[1], q[0], q[1], col, 2.2), 140, delay);
  b += seg(root, L1[0], SKY, 0) + seg(root, L1[1], SKY, 0);
  b += text(95, 97, o.first[0], { size: 11, fill: SKY });
  b += text(95, 168, o.first[1], { size: 11, fill: SKY });
  b += seg(L1[0], L2[0], AMB, 0.4) + seg(L1[0], L2[1], AMB, 0.4) + seg(L1[1], L2[2], AMB, 0.4) + seg(L1[1], L2[3], AMB, 0.4);
  b += text(210, 57, o.second[0][0], { size: 11, fill: AMB });
  b += text(210, 105, o.second[0][1], { size: 11, fill: AMB });
  b += text(210, 157, o.second[1][0], { size: 11, fill: AMB });
  b += text(210, 205, o.second[1][1], { size: 11, fill: AMB });
  b += dot(root[0], root[1], 5, INK);
  for (const p of L1) b += dot(p[0], p[1], 4.5, SKY);
  L2.forEach((p, i) => {
    const hot = o.hot?.includes(i);
    b += dot(p[0], p[1], 4.5, hot ? ROSE : AMB);
    b += fades(text(284, p[1] + 4, o.ends[i], { size: 11, fill: hot ? ROSE : INK, anchor: 'start', op: hot ? undefined : 0.75 }), 0.9);
  });
  return art(o.alt, b, o.caption);
}

/** The 36 outcomes of two dice, with the ones in an event shaded. */
function diceGrid(hot: (first: number, second: number) => boolean, o: { title?: string; caption?: string; alt: string; note?: string }): SlideArt {
  const s = 20, gx = 130, gy = 66;
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  b += text(gx + 3 * s, 44, 'second die', { size: 10, op: 0.65 });
  b += text(96, gy + 3 * s + 4, 'first die', { size: 10, op: 0.65, anchor: 'end' });
  let count = 0;
  for (let c = 1; c <= 6; c++) b += text(gx + (c - 0.5) * s, gy - 8, String(c), { size: 10, op: 0.7 });
  for (let r = 1; r <= 6; r++) {
    b += text(gx - 8, gy + (r - 0.5) * s + 4, String(r), { size: 10, op: 0.7, anchor: 'end' });
    for (let c = 1; c <= 6; c++) {
      const h = hot(r, c);
      if (h) count++;
      b += fades(rect(gx + (c - 1) * s, gy + (r - 1) * s, s, s, h ? ROSE : INK, h ? `${ROSE}66` : 'none', h ? 2 : 1, 3), 0.02 * (r * 6 + c));
    }
  }
  b += text(W / 2, 212, o.note ?? `${count} of 36 outcomes shaded`, { size: 12, fill: ROSE });
  return art(o.alt, b, o.caption);
}

/** A population drawn as a grid of dots, with the chosen individuals marked. */
function popGrid(
  n: number,
  cols: number,
  picked: number[],
  o: { numbered?: boolean; rowLabels?: string[]; colors?: Record<number, string>; title?: string; caption?: string; alt: string; note?: string },
): SlideArt {
  const rows = Math.ceil(n / cols);
  const dx = 26, dy = Math.min(34, 150 / Math.max(1, rows - 1));
  const x0 = (W - (cols - 1) * dx) / 2 + 10, y0 = 72;
  let b = o.title ? text(W / 2, 28, o.title, { size: 13, fill: VIO }) : '';
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const x = x0 + c * dx, y = y0 + r * dy;
    const label = i + 1;
    const hot = picked.includes(label);
    const col = o.colors?.[label] ?? (hot ? ROSE : INK);
    b += fades(hot ? dot(x, y, 9, col) : `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="none" stroke="${INK}" stroke-width="1.6" opacity="0.5"/>`, 0.02 * i);
    if (o.numbered) b += text(x, y + 3, String(label).padStart(2, '0'), { size: 8, fill: hot ? '#fff' : INK, op: hot ? undefined : 0.6 });
  }
  (o.rowLabels ?? []).forEach((t, r) => {
    b += text(x0 - 24, y0 + r * dy + 4, t, { size: 11, op: 0.7, anchor: 'end' });
  });
  if (o.note) b += text(W / 2, 240, o.note, { size: 12, fill: ROSE });
  return art(o.alt, b, o.caption);
}

// ---------------- STAT-1 — Describing categorical and quantitative data ----------------
const STAT_1: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Pictures that tell the truth about data',
    body: 'Twenty students name a favorite lunch; 24 students report a commute time. Today you will pick the right graph for each kind of variable, read it, and describe its shape in plain words. The right picture makes a pile of numbers talk.',
    art: bars([{ name: 'students', vals: [8, 6, 4, 2], color: SKY }], { labels: ['pizza', 'tacos', 'salad', 'other'], title: 'Favorite lunch of 20 students', caption: 'Pizza 8, tacos 6, salad 4, other 2 — a categorical variable on a bar graph.' }),
  },
  {
    kind: 'concept',
    head: 'Two kinds of variables',
    body: 'A CATEGORICAL variable sorts individuals into groups: eye color, favorite lunch. A QUANTITATIVE variable is a number you can average: height, commute time. A number used as a label, like a jersey number or a zip code, is still categorical — averaging zip codes means nothing.',
    why: 'Arithmetic only makes sense on numbers that measure an amount. Adding 2 siblings and 3 siblings gives 5 siblings, a real quantity, but adding two zip codes gives a number that names no place at all. Asking whether the average would mean anything tests exactly this.',
    compare: {
      cols: [
        { title: 'Categorical', lines: ['Names a group', 'Eye color, lunch, zip code', 'Count how many in each group'], tone: 'accent' },
        { title: 'Quantitative', lines: ['Measures an amount', 'Height, commute, siblings', 'Averaging makes sense'], tone: 'ok' },
      ],
      note: 'Ask: would the AVERAGE mean anything? If not, the variable is categorical, even if it is written with digits.',
    },
  },
  {
    kind: 'concept',
    head: 'Categorical data: counts and percents',
    body: 'Categorical data lives in a frequency table, a bar graph, or a pie chart. The RELATIVE FREQUENCY of a group is its count divided by the total. Pizza is 8 of 20 students: 8 ÷ 20 = 0.40, or 40% of the class.',
    why: 'A raw count means little until you know the total: 8 out of 20 is a big share, but 8 out of 2,000 is tiny. Dividing by the total puts every group on the same scale of parts of one whole, which is why all the shares must add up to 1.',
    formula: {
      tex: '\\text{relative frequency} = \\frac{\\text{count}}{\\text{total}} = \\frac{8}{20} = 0.40',
      note: 'Every group\'s relative frequency adds to 1 — the whole pie.',
      parts: [
        { sym: '8', means: 'how many chose pizza', tone: 'accent' },
        { sym: '20', means: 'everyone who was asked', tone: 'ok' },
        { sym: '0.40', means: '40% — the size of the pizza slice', tone: 'warn' },
      ],
    },
    art: pie([{ label: 'pizza', part: 8 }, { label: 'tacos', part: 6 }, { label: 'salad', part: 4 }, { label: 'other', part: 2 }], { title: 'The same 20 lunches as a pie', caption: '8 + 6 + 4 + 2 = 20, so 40% + 30% + 20% + 10% = 100%.' }),
  },
  {
    kind: 'concept',
    head: 'Quantitative data: dot plots and histograms',
    body: 'Quantitative data lives in a DOT PLOT (one dot per value), a STEMPLOT, or a HISTOGRAM. Fifteen students report how many pets they have: four say 0, six say 1, three say 2, one says 3 and one says 4. The dot plot shows every single value.',
    why: 'A number line shows how far apart values are, which a list of categories cannot. Stacking a dot or a bar over each value shows where the data pile up, where they thin out and where there are gaps, and that picture of the pile is the shape of the distribution.',
    art: dotPlot([0, 1, 2, 3, 4], [4, 6, 3, 1, 1], { title: 'Pets owned by 15 students', unit: 'number of pets', caption: 'Count the dots: 4 + 6 + 3 + 1 + 1 = 15 students. The tallest stack is at 1 pet.' }),
  },
  {
    kind: 'concept',
    head: 'Describe it with SOCS',
    body: 'Describe any distribution with SOCS: Shape, Outliers, Center, Spread — always in context. Shape is symmetric, skewed right, or skewed left, and it can be unimodal (one peak), bimodal (two peaks), or roughly uniform (flat).',
    why: 'Two data sets can share the same mean and still look nothing alike, so one number is never enough. SOCS forces four questions, what pattern, anything odd, what is typical and how much do values vary, so the description captures the whole distribution and not just one piece of it.',
    compare: {
      cols: [
        { title: 'Symmetric', lines: ['Mirror image around the middle', 'Mean ≈ median'], tone: 'ok' },
        { title: 'Skewed right', lines: ['Long tail toward HIGH values', 'Mean > median'], tone: 'warn' },
        { title: 'Skewed left', lines: ['Long tail toward LOW values', 'Mean < median'], tone: 'bad' },
      ],
      note: 'Shape first, then outliers, then a number for center and a number for spread.',
    },
  },
  {
    kind: 'concept',
    head: 'Skew is named for the tail',
    body: 'The skew is named for the TAIL, not the peak. A long tail stretching toward the high values is skewed RIGHT. That tail drags the mean toward it, so in a skewed-right distribution the mean sits above the median.',
    why: 'The mean is the balance point of the data, so a few far-out values in the tail act like a long lever and drag it toward them. The median only counts positions, so it stays with the bulk. Try 1, 2, 3, 4, 100: the mean is 22 but the median is still 3.',
    formula: {
      tex: '\\text{tail to the right} \;\\Rightarrow\; \\text{skewed right} \;\\Rightarrow\; \\bar{x} > \\text{median}',
      note: 'The mean chases the tail; the median stays put with the pile.',
      parts: [
        { sym: '\\text{tail}', means: 'the thin stretched-out side of the graph', tone: 'warn' },
        { sym: '\\bar{x}', means: 'the mean, pulled toward the tail', tone: 'bad' },
        { sym: '\\text{median}', means: 'the middle value, which barely moves', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Classify three variables',
    body: 'Number of siblings, eye color, zip code. For each one, decide whether it is categorical or quantitative.\nThe test is simple: ask whether averaging the values would mean anything.',
    steps: {
      steps: [
        { tex: '\\text{siblings: an average such as } 2.3 \\text{ makes sense}', text: 'Number of siblings is a count, and an average like 2.3 siblings per family has a real meaning. It measures an amount, so it is quantitative.' },
        { text: 'Eye color only sorts people into named groups such as brown or blue. You cannot add or average colors, so the variable is categorical.' },
        { tex: '\\text{the average of } 90210 \\text{ and } 10001 \\text{ means nothing}', text: 'A zip code is written with digits, but it is only a label for a place. Averaging two zip codes names no place, so zip code is categorical even though it looks like a number.' },
      ],
      answer: '\\text{quantitative, categorical, categorical}',
    },
    table: {
      head: ['variable', 'could you average it?', 'type'],
      rows: [['number of siblings', 'yes — 2.3 siblings makes sense', 'quantitative'], ['eye color', 'no', 'categorical'], ['zip code', 'no — a label made of digits', 'categorical']],
      mark: 2,
      note: 'Digits do not make a variable quantitative. Meaning does.',
    },
  },
  {
    kind: 'example',
    head: 'Relative frequency of pizza',
    body: 'Favorite lunch of 20 students: pizza 8, tacos 6, salad 4, other 2. What fraction and what percent of the class chose pizza?',
    steps: {
      steps: [
        { tex: '8 + 6 + 4 + 2 = 20', text: 'Add all the group counts first to confirm the total of 20 students. A relative frequency always divides by the whole group, so the total must be right.' },
        { tex: '\\frac{8}{20} = 0.40', text: 'Divide the pizza count by the total. Relative frequency means what part of the whole, so it is count over total, and 8 out of 20 is 0.40.' },
        { tex: '0.40 = 40\\%', text: 'Multiply the decimal by 100 to get a percent, which moves the decimal point two places to the right. So 0.40 becomes 40%, the share of the class that chose pizza.' },
      ],
      answer: '0.40 \\ (40\\%)',
    },
  },
  {
    kind: 'example',
    head: 'Shape of 24 commute times',
    body: 'Commute times in 10-minute bins: 0–10: 9 students, 10–20: 7, 20–30: 4, 30–40: 3, 40–50: 1. Describe the shape of the distribution.',
    steps: {
      steps: [
        { tex: '9 + 7 + 4 + 3 + 1 = 24', text: 'Add the bar heights to make sure they cover all 24 students. This also shows that the tallest bar, 9, is the first one, at 0–10 minutes.' },
        { text: 'The bars start tallest on the left and shrink steadily to the right, so there is one peak, at 0–10 minutes. One peak means the distribution is unimodal.' },
        { text: 'The thin tail stretches toward the high commute times on the right. Skew is named for the tail and not for the pile, so a tail on the right means skewed right.' },
        { text: 'Say it in context: most students live close to school and a few live far away, and those few are what stretch the tail out to 40–50 minutes.' },
      ],
      answer: '\\text{skewed right, one peak at 0–10 minutes}',
    },
    art: histogram(['0–10', '10–20', '20–30', '30–40', '40–50'], [9, 7, 4, 3, 1], { mark: 0, yLabel: 'count', title: 'Commute time (minutes), 24 students', caption: 'Bars touch because minutes are continuous. The long thin tail on the right names the skew.' }),
  },
  {
    kind: 'example',
    head: 'Median of the pets data',
    body: 'Pets: 0 pets 4 students, 1 pet 6, 2 pets 3, 3 pets 1, 4 pets 1. Find the median and the shape.',
    steps: {
      steps: [
        { tex: '\\frac{15 + 1}{2} = 8', text: 'With n = 15 values the median sits in position (15 + 1) ÷ 2 = 8, because that leaves seven values below it and seven above it.' },
        { tex: '0,0,0,0,1,1,1,\\mathbf{1},1,1,2,2,2,3,4', text: 'Write the values in order, repeating each one as many times as students reported it. Positions 5 through 10 are all 1, and position 8 is one of them.' },
        { tex: '\\text{median} = 1', text: 'The 8th value is 1, so the median is 1 pet. At least half the students own 1 pet or fewer, and at least half own 1 pet or more.' },
        { text: 'The peak is at 1 pet and a thin tail stretches up to 4 pets on the right. A tail on the right means the shape is skewed right.' },
      ],
      answer: '\\text{median } 1 \\text{ pet; skewed right}',
    },
    art: sortedRow([0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 4], { middle: 7, label: 'the 8th of 15 values', title: 'Fifteen values in order', caption: 'Seven values sit on each side of the 8th one, so the median is 1 pet.' }),
  },
  {
    kind: 'example',
    head: 'Another way: count up the stacks',
    body: 'You do not have to write out all 15 values. Use the frequency table to find which stack holds the middle position.',
    steps: {
      steps: [
        { tex: '\\frac{15 + 1}{2} = 8', text: 'The middle position of 15 values is (15 + 1) ÷ 2 = 8. All we need is to find which stack in the table contains the 8th value.' },
        { tex: '4,\\quad 4 + 6 = 10', text: 'Add the counts running down the table. Zero pets covers positions 1–4, and adding the six one-pet students reaches position 10, so running totals tell you which positions each row owns.' },
        { tex: '4 < 8 \\le 10', text: 'Position 8 is past the end of the 0-pet stack, which stops at 4, but inside the 1-pet stack, which runs to 10. So the 8th value must be a 1.' },
      ],
      answer: '\\text{median} = 1 \\text{ pet}',
    },
    table: {
      head: ['pets', 'count', 'positions covered'],
      rows: [['0', '4', '1–4'], ['1', '6', '5–10'], ['2', '3', '11–13'], ['3', '1', '14'], ['4', '1', '15']],
      mark: 1,
      note: 'The 8th position lands inside the 1-pet row, so the median is 1.',
    },
  },
  {
    kind: 'example',
    head: 'A two-way table: conditional percent',
    body: 'Fifty students were asked whether they prefer online or in-person class. Prefers online: 10th grade 12, 11th grade 18. Prefers in person: 10th grade 13, 11th grade 7. What percent of 11th graders prefer online, and how does that compare with 10th graders?',
    steps: {
      steps: [
        { tex: '18 + 7 = 25', text: 'Stay inside the 11th-grade row, because the question says of 11th graders. That row total, 25, is the new whole we will divide by.' },
        { tex: '\\frac{18}{25} = 0.72', text: 'Divide the 11th graders who prefer online by all 25 eleventh graders. This is a conditional percent, so the bottom is the row total and not the 50 students altogether.' },
        { tex: '\\frac{12}{25} = 0.48', text: 'Do the same in the 10th-grade row to compare: 12 of 25 prefer online, which is 48%. Both rows have 25 students, so the two percents are a fair comparison.' },
        { tex: '72\\% - 48\\% = 24\\%', text: 'So 72% of 11th graders but only 48% of 10th graders prefer online, a 24-point gap between the grades.' },
      ],
      answer: '72\\% \\text{ of 11th graders (vs. } 48\\% \\text{ of 10th)}',
    },
    table: {
      head: ['', 'online', 'in person', 'total'],
      rows: [['10th grade', '12', '13', '25'], ['11th grade', '18', '7', '25'], ['total', '30', '20', '50']],
      mark: 1,
      note: '"Of 11th graders" means the 11th-grade row is the whole: 18 of 25.',
    },
    formula: {
      tex: 'P(\\text{online} \\mid \\text{11th}) = \\frac{18}{25} = 0.72',
      note: 'A conditional percent divides by the row (or column) total, not by the grand total.',
      parts: [
        { sym: '18', means: '11th graders who prefer online', tone: 'accent' },
        { sym: '25', means: 'all 11th graders — the condition', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: exam scores',
    body: 'Scores of 24 students: 50–60: 1, 60–70: 2, 70–80: 4, 80–90: 9, 90–100: 8. Sketch the bars before you say anything. Which way does the tail point?',
    steps: {
      steps: [
        { tex: '1 + 2 + 4 + 9 + 8 = 24', text: 'Check that the heights add to 24 students, then sketch five touching bars. The two tallest bars, 9 and 8, are the two on the right.' },
        { text: 'The bars are tall on the right and shrink toward the low scores on the left, leaving one long thin tail pointing left toward 50–60.' },
        { text: 'Skew is named for the tail and not for the pile of tall bars. A tail on the left means skewed left, even though most of the data sit on the right.' },
        { tex: '\\bar{x} < \\text{median}', text: 'The few low scores pull the mean down while the median stays with the pile, so the mean ends up below the median.' },
      ],
      answer: '\\text{skewed left; mean} < \\text{median}',
    },
    art: histogram(['50–60', '60–70', '70–80', '80–90', '90–100'], [1, 2, 4, 9, 8], { mark: 0, yLabel: 'count', title: 'Exam scores, 24 students', caption: 'The thin tail is on the LOW side, so this is skewed left and the mean sits below the median.' }),
  },
  {
    kind: 'protip',
    head: 'Say it in context, every time',
    body: 'A full description never says just "skewed right." It says "the distribution of commute times is skewed right with a single peak at 0–10 minutes; the typical student lives about 10 minutes away, and times range from 0 to 50 minutes." Shape, outliers, center, spread — with the variable named.',
    art: flow([{ label: 'Shape: symmetric, skewed, peaks' }, { label: 'Outliers: any value far from the rest?' }, { label: 'Center: median or mean, in units' }, { label: 'Spread: range or IQR, in units' }], { title: 'SOCS, in order, in context', caption: 'Four sentences, each naming the variable and its units.' }),
  },
  {
    kind: 'trap',
    head: 'Trap: naming the skew after the pile',
    body: 'A histogram with its tall bars on the right and a long thin tail to the left looks "heavy on the right," so students call it skewed right. It is skewed LEFT. Skew follows the tail. The exam-score histogram, piled up at 80–100 with a tail down to 50, is skewed left and its mean is below its median.',
    compare: {
      cols: [
        { title: 'Looks like', lines: ['"The bars are tall on the right"', '"so it is skewed right"', 'Wrong'], tone: 'bad' },
        { title: 'Actually', lines: ['The thin tail stretches LEFT', 'Skewed left', 'Mean < median'], tone: 'ok' },
      ],
      note: 'Find the long thin side. That side is the name of the skew.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: bar graph or histogram?',
    body: 'A bar graph shows separate CATEGORIES (pizza, tacos, salad) and its bars have gaps between them; their order does not matter. A histogram groups a QUANTITATIVE variable into equal bins and its bars touch, because 10–20 minutes ends exactly where 20–30 begins. Check the horizontal axis before you describe shape — a bar graph has no shape to describe.',
    compare: {
      cols: [
        { title: 'Bar graph', lines: ['Categories on the axis', 'Gaps between bars', 'No "skew" — order is arbitrary'], tone: 'accent' },
        { title: 'Histogram', lines: ['Number line on the axis', 'Bars touch', 'Shape, center, spread apply'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: marginal, then conditional',
    body: 'From the same two-way table (online: 12 and 18; in person: 13 and 7; 50 students in all), what percent of ALL students prefer online? And of the students who prefer online, what percent are 11th graders? Watch which group goes on the bottom.',
    steps: {
      steps: [
        { tex: '12 + 18 = 30', text: 'Add the online column: 12 tenth graders plus 18 eleventh graders gives 30 students who prefer online. A total like this on the edge of the table is a marginal count.' },
        { tex: '\\frac{30}{50} = 0.60', text: 'For the marginal percent, divide by the grand total of 50. The question says all students, so everyone belongs in the denominator, and 60% prefer online.' },
        { tex: '\\frac{18}{30} = 0.60', text: 'For the conditional percent, restrict to the 30 who prefer online, which is the new whole. Of them 18 are eleventh graders, and 18 ÷ 30 is 0.60, or 60%.' },
        { text: 'Both answers happen to be 60%, but only by coincidence of these numbers. One divides by all 50 students and the other by the 30 online students, so they answer different questions.' },
      ],
      answer: '60\\%\\ \\text{and}\\ 60\\%',
    },
  },
  {
    kind: 'summary',
    head: 'Graphs, shape, and the right words',
    body: 'Categorical variables get bar graphs and pie charts, read with relative frequencies. Quantitative variables get dot plots and histograms, described with SOCS. Skew is named for the tail, and the mean follows the tail. In a two-way table, a conditional percent divides by a row or column total.',
    table: {
      head: ['variable', 'graph', 'describe with'],
      rows: [['categorical', 'bar graph, pie chart', 'counts, relative frequencies'], ['quantitative', 'dot plot, histogram', 'shape, outliers, center, spread'], ['two categorical', 'two-way table', 'marginal and conditional percents']],
    },
  },
];

// ---------------- STAT-2 — Center, spread, boxplots and outliers ----------------

/** The club-meeting ages as a box plot, with 45 sitting past the fence as its own dot. */
const agesBoxFig = (() => {
  const lo = 10, hi = 48, y = 130, x0 = 44, x1 = W - 30;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  let b = text(W / 2, 30, 'Ages 12, 14, 15, 15, 16, 18, 20, 45', { size: 13, fill: VIO });
  b += line(X(12), y, X(14.5), y, INK, 2) + line(X(19), y, X(20), y, INK, 2);
  b += line(X(12), y - 14, X(12), y + 14, INK, 2.4) + line(X(20), y - 14, X(20), y + 14, INK, 2.4);
  b += fades(rect(X(14.5), y - 26, X(19) - X(14.5), 52, SKY, `${SKY}33`, 2.6, 5), 0.25);
  b += line(X(15.5), y - 26, X(15.5), y + 26, ROSE, 3.4);
  b += line(X(25.75), y - 44, X(25.75), y + 44, VIO, 2, '5 4');
  b += fades(dot(X(45), y, 6.5, ROSE), 0.6);
  const yy = 214;
  b += arrow(x0 - 14, yy, x1 + 12, yy, INK, 1.8);
  for (let v = 10; v <= 45; v += 5) {
    b += line(X(v), yy - 4, X(v), yy + 4, INK, 1.4, undefined, 0.55);
    b += text(X(v), yy + 18, String(v), { size: 10, op: 0.65 });
  }
  b += text(X(12), y + 44, 'min', { size: 10, op: 0.7 });
  b += text(X(14.5), y + 44, 'Q1', { size: 10, fill: SKY });
  b += text(X(19), y + 44, 'Q3', { size: 10, fill: SKY });
  b += text(X(15.5), y - 34, 'median', { size: 11, fill: ROSE });
  b += text(X(25.75), y - 54, 'fence 25.75', { size: 11, fill: VIO });
  b += text(X(45), y - 34, 'outlier 45', { size: 11, fill: ROSE });
  return art('A box plot of eight ages with the whisker stopping at 20, a dashed fence at 25.75 and the value 45 drawn as a separate outlier dot', b, 'The whisker stops at 20, the last value inside the fence. The 45 gets its own dot.');
})();

/** The deviations of 3, 5, 5, 8, 9 from their mean of 6, as arrows. */
const deviationsFig = (() => {
  const lo = 2, hi = 10, y = 150, x0 = 46, x1 = W - 34;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  let b = text(W / 2, 28, 'Deviations from the mean', { size: 13, fill: VIO });
  b += line(x0 - 10, y, x1 + 10, y, INK, 2);
  for (let v = lo; v <= hi; v++) {
    b += line(X(v), y - 5, X(v), y + 5, INK, 1.4, undefined, 0.55);
    b += text(X(v), y + 22, String(v), { size: 10, op: 0.65 });
  }
  b += line(X(6), 56, X(6), y, ROSE, 2, '5 4');
  b += text(X(6), 46, 'mean 6', { size: 12, fill: ROSE });
  b += fades(dot(X(3), y - 12, 6, AMB), 0.1) + fades(dot(X(5), y - 12, 6, AMB), 0.2) + fades(dot(X(5), y - 28, 6, AMB), 0.3) + fades(dot(X(8), y - 12, 6, AMB), 0.4) + fades(dot(X(9), y - 12, 6, AMB), 0.5);
  b += draws(arrow(X(6), 104, X(3), 104, SKY, 2.4), 120, 0.6) + text(X(4.5), 96, '−3', { size: 12, fill: SKY });
  b += draws(arrow(X(6), 82, X(5), 82, SKY, 2.4), 40, 0.7) + text(X(5.5), 74, '−1 (twice)', { size: 12, fill: SKY });
  b += draws(arrow(X(6), 104, X(8), 104, EMR, 2.4), 80, 0.8) + text(X(7), 96, '+2', { size: 12, fill: EMR });
  b += draws(arrow(X(6), 82, X(9), 82, EMR, 2.4), 120, 0.9) + text(X(7.5), 74, '+3', { size: 12, fill: EMR });
  b += text(W / 2, 236, 'squared: 9, 1, 1, 4, 9 → sum 24', { size: 12, op: 0.75 });
  return art('The values 3, 5, 5, 8 and 9 on a number line with arrows from the mean of 6 to each value showing deviations of minus 3, minus 1, minus 1, plus 2 and plus 3', b, 'Each arrow is a deviation x − x̄. Squaring makes them all positive; their sum is 24.');
})();

const STAT_2: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'One number for the middle, one for the spread',
    body: 'Seven students spent 4, 6, 7, 8, 10, 12 and 16 minutes on homework. Today you will find the center two ways, measure the spread three ways, draw a boxplot, and decide with a rule — not a feeling — whether a value is an outlier.',
    art: balancePoint([4, 6, 7, 8, 10, 12, 16], 9, { lo: 3, hi: 17, median: 8, title: 'Homework minutes: 4, 6, 7, 8, 10, 12, 16', caption: 'The beam balances at the mean, 9. The median, 8, is the 4th of the 7 values.' }),
  },
  {
    kind: 'concept',
    head: 'Mean and median',
    body: 'The MEAN is the balance point: add the values and divide by n. The MEDIAN is the middle value once the data are sorted; when n is even, average the two middle values. For 4, 6, 7, 8, 10, 12, 16 the mean is 63 ÷ 7 = 9 and the median is the 4th value, 8.',
    why: 'Picture the values as equal weights on a ruler: the mean is the point where the ruler balances, so one distant weight pulls it strongly. The median only asks which value has half the data on each side, so how big the extreme values are does not matter, just their order.',
    formula: {
      tex: '\\bar{x} = \\frac{\\sum x}{n} = \\frac{63}{7} = 9',
      note: 'The median needs no formula — just sort and count to the middle.',
      parts: [
        { sym: '\\sum x', means: 'add up every value: 4 + 6 + 7 + 8 + 10 + 12 + 16 = 63', tone: 'accent' },
        { sym: 'n', means: 'how many values there are: 7', tone: 'ok' },
        { sym: '\\bar{x}', means: 'the mean, read "x-bar"', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Quartiles and the IQR',
    body: 'QUARTILES cut the sorted data into quarters. Q1 is the median of the lower half and Q3 the median of the upper half; when n is odd, leave the overall median out of both halves. The IQR = Q3 − Q1 is the width of the middle 50%.',
    why: 'Q1, the median and Q3 split the sorted data into four groups with equal counts. The IQR measures the width of the middle two groups together, so it ignores the extremes in both tails. That makes it a measure of spread that one wild value cannot stretch.',
    formula: {
      tex: '\\text{IQR} = Q_3 - Q_1 = 12 - 6 = 6',
      note: 'For 4, 6, 7 | 8 | 10, 12, 16: the lower half has median 6, the upper half has median 12.',
      parts: [
        { sym: 'Q_1', means: 'median of the lower half, 4, 6, 7 → 6', tone: 'accent' },
        { sym: 'Q_3', means: 'median of the upper half, 10, 12, 16 → 12', tone: 'ok' },
        { sym: '\\text{IQR}', means: 'the spread of the middle half of the data', tone: 'warn' },
      ],
    },
    art: sortedRow([4, 6, 7, 8, 10, 12, 16], { middle: 3, label: 'median 8 — left out of both halves', title: 'Sort, find the middle, then halve', caption: 'Lower half 4, 6, 7 gives Q1 = 6. Upper half 10, 12, 16 gives Q3 = 12.' }),
  },
  {
    kind: 'concept',
    head: 'Standard deviation: typical distance from the mean',
    body: 'The STANDARD DEVIATION s is roughly the typical distance of a value from the mean. Find each deviation x − x̄, square it, add them up, divide by n − 1, and take the square root. A small s means the values huddle near the mean; a large s means they are spread out.',
    why: 'Deviations from the mean always add to zero, because the mean balances the distances on each side, so we square them to make every distance count. Dividing by n − 1 instead of n corrects for data being closer to their own mean than to the true one. The square root brings back the original units.',
    formula: {
      tex: 's = \\sqrt{\\dfrac{\\sum (x - \\bar{x})^{2}}{n - 1}}',
      note: 'Squaring stops the negatives from cancelling the positives; the square root brings the units back.',
      parts: [
        { sym: 'x - \\bar{x}', means: 'a deviation — how far one value sits from the mean', tone: 'accent' },
        { sym: 'n - 1', means: 'one less than the count, for a sample', tone: 'warn' },
        { sym: '\\sqrt{\\ }', means: 'undo the squaring so s is in the original units', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Five numbers, one boxplot, one outlier rule',
    body: 'The FIVE-NUMBER SUMMARY (min, Q1, median, Q3, max) draws a BOXPLOT: the box holds the middle half, the whiskers reach the smallest and largest values that are not outliers. The 1.5 × IQR RULE: a value is an outlier if it is below Q1 − 1.5·IQR or above Q3 + 1.5·IQR.',
    why: 'The box shows how wide the middle half of the data is, so a value more than one and a half box-widths beyond the box is far from where most of the data live. The 1.5 is a convention, not a law, but it flags the few values well outside the pack and ignores ordinary stragglers.',
    formula: {
      tex: '\\text{fences:}\\quad Q_1 - 1.5\\,\\text{IQR} \\qquad Q_3 + 1.5\\,\\text{IQR}',
      note: 'For the homework data: 6 − 9 = −3 and 12 + 9 = 21. Nothing lies outside, so no outliers.',
      parts: [
        { sym: '1.5\\,\\text{IQR}', means: 'one and a half box-widths: 1.5 × 6 = 9', tone: 'accent' },
        { sym: 'Q_3 + 9 = 21', means: 'the upper fence — 16 is inside it', tone: 'ok' },
      ],
    },
    art: boxPlot([4, 6, 8, 12, 16], 2, 18, { step: 2, title: 'Homework minutes: 4, 6, 8, 12, 16', caption: 'Box from Q1 = 6 to Q3 = 12, median line at 8, whiskers to 4 and 16.' }),
  },
  {
    kind: 'example',
    head: 'Mean and median of the homework minutes',
    body: 'Homework minutes: 4, 6, 7, 8, 10, 12, 16. Find the mean and the median, and say which one the 16 pulls more.',
    steps: {
      steps: [
        { tex: '4 + 6 + 7 + 8 + 10 + 12 + 16 = 63', text: 'Add all seven values. The mean is the total shared out equally, so the sum comes first, and the seven values add up to 63.' },
        { tex: '63 \\div 7 = 9', text: 'Divide the total by n = 7, the number of values, to share it equally. This gives the mean, x̄ = 9 minutes, the balance point of the data.' },
        { tex: '4, 6, 7, \\mathbf{8}, 10, 12, 16', text: 'The list is already sorted, which the median requires. With 7 values the middle is position (7 + 1) ÷ 2 = 4, and the 4th value is 8.' },
        { text: 'The mean, 9, is a little above the median, 8, because the large value 16 pulls the balance point toward the high side, while the median ignores how big the 16 is.' },
      ],
      answer: '\\bar{x} = 9,\\ \\text{median} = 8',
    },
  },
  {
    kind: 'example',
    head: 'Five-number summary and IQR',
    body: 'Same data: 4, 6, 7, 8, 10, 12, 16. Find the five-number summary and the IQR.',
    steps: {
      steps: [
        { tex: '\\min = 4,\\quad \\text{median} = 8,\\quad \\max = 16', text: 'The list is sorted, so the smallest and largest values sit at the ends: min = 4 and max = 16. The median of 7 values is the 4th one, 8.' },
        { tex: 'Q_1 = 6', text: 'Split at the median and leave it out of both halves, because n is odd. The lower half is 4, 6, 7, and its middle value is Q1 = 6.' },
        { tex: 'Q_3 = 12', text: 'The upper half is 10, 12, 16, and its middle value is Q3 = 12. So a quarter of the data lie above 12 and a quarter below 6.' },
        { tex: '\\text{IQR} = 12 - 6 = 6', text: 'Subtract Q1 from Q3 to get the width of the middle half. It is a width, so it must be positive, which is why we subtract and never add: 12 − 6 = 6 minutes.' },
      ],
      answer: '4,\\ 6,\\ 8,\\ 12,\\ 16;\\quad \\text{IQR} = 6',
    },
  },
  {
    kind: 'example',
    head: 'Standard deviation of 3, 5, 5, 8, 9',
    body: 'Find the standard deviation of 3, 5, 5, 8, 9. The deviations from the mean are the building blocks, so start there.',
    steps: {
      steps: [
        { tex: '\\bar{x} = \\frac{3 + 5 + 5 + 8 + 9}{5} = \\frac{30}{5} = 6', text: 'Find the mean first, because standard deviation measures distance from it. The values add to 30, and 30 ÷ 5 = 6.' },
        { tex: '-3,\\ -1,\\ -1,\\ 2,\\ 3', text: 'Subtract the mean from every value to get its deviation. They add to 0, which is a good check, because the mean balances the distances above and below.' },
        { tex: '9 + 1 + 1 + 4 + 9 = 24', text: 'Square every deviation and add them up. Squaring makes all the terms positive so they cannot cancel, and it makes far-away values count extra.' },
        { tex: '\\frac{24}{5 - 1} = 6', text: 'Divide by n − 1 = 4, not by 5, because this is a sample and the deviations are measured from x̄ instead of the true mean. The result, 6, is the variance.' },
        { tex: 's = \\sqrt{6} \\approx 2.45', text: 'Take the square root to undo the squaring and return to the original units. A typical value sits about 2.45 away from the mean.' },
      ],
      answer: 's = \\sqrt{6} \\approx 2.45',
    },
    art: deviationsFig,
    table: {
      head: ['x', 'x − x̄', '(x − x̄)²'],
      rows: [['3', '−3', '9'], ['5', '−1', '1'], ['5', '−1', '1'], ['8', '2', '4'], ['9', '3', '9'], ['sum', '0', '24']],
      mark: 5,
      note: 'Deviations always add to 0 — that is why we square them. 24 ÷ 4 = 6, and √6 ≈ 2.45.',
    },
  },
  {
    kind: 'example',
    head: 'Is 45 an outlier?',
    body: 'Ages at a club meeting: 12, 14, 15, 15, 16, 18, 20, 45. Use the 1.5 × IQR rule to decide whether 45 is an outlier.',
    steps: {
      steps: [
        { tex: '\\text{median} = \\frac{15 + 16}{2} = 15.5', text: 'There are 8 ages, an even number, so the median averages the 4th and 5th values, 15 and 16. This splits the list into two halves of 4 with nothing left out.' },
        { tex: 'Q_1 = \\tfrac{14 + 15}{2} = 14.5,\\quad Q_3 = \\tfrac{18 + 20}{2} = 19', text: 'Take the median of each half. The lower half 12, 14, 15, 15 gives 14.5 and the upper half 16, 18, 20, 45 gives 19, each by averaging its middle two values.' },
        { tex: '\\text{IQR} = 19 - 14.5 = 4.5', text: 'Subtract to get the IQR, the width of the box: 19 − 14.5 = 4.5 years. The outlier rule is measured in these box-widths.' },
        { tex: '1.5 \\times 4.5 = 6.75', text: 'The rule allows values up to one and a half box-widths beyond the box: 1.5 × 4.5 = 6.75 years. A value farther out than that is unusually far from the middle half.' },
        { tex: '19 + 6.75 = 25.75, \\quad 14.5 - 6.75 = 7.75', text: 'Add 6.75 to Q3 for the upper fence, 25.75, and subtract it from Q1 for the lower fence, 7.75. The 45 is beyond 25.75, and nothing is below 7.75.' },
      ],
      answer: '\\text{yes: } 45 > 25.75',
    },
    art: agesBoxFig,
  },
  {
    kind: 'example',
    head: 'Another way: count box-widths past Q3',
    body: 'Instead of computing a fence, ask how many IQRs above Q3 the suspicious value sits, using Q3 = 19 and IQR = 4.5.',
    steps: {
      steps: [
        { tex: '45 - 19 = 26', text: 'Find how far the 45 sits above Q3 by subtracting: 45 − 19 = 26 years. The fence is measured from the edge of the box, so Q3 is the starting point.' },
        { tex: '26 \\div 4.5 \\approx 5.8', text: 'Divide by the IQR to count that distance in box-widths: 26 ÷ 4.5 ≈ 5.8. The rule is stated in box-widths, so this puts the distance in the same units as the rule.' },
        { tex: '5.8 > 1.5', text: 'Compare with the cutoff of 1.5 box-widths. Since 5.8 is far larger than 1.5, the value is well beyond the fence, the same verdict as before: an outlier.' },
      ],
      answer: '\\text{outlier}',
    },
  },
  {
    kind: 'example',
    head: 'What the 45 does to the mean',
    body: 'For the club ages 12, 14, 15, 15, 16, 18, 20, 45, compare the mean and median with and without the 45. Which one is resistant to the outlier?',
    steps: {
      steps: [
        { tex: '\\frac{155}{8} \\approx 19.4', text: 'With all 8 ages the total is 155, so the mean is 155 ÷ 8 ≈ 19.4, which is larger than seven of the eight ages.' },
        { tex: '\\frac{15 + 16}{2} = 15.5', text: 'The median of the 8 ages averages the 4th and 5th values, 15 and 16, giving 15.5. It depends only on those middle positions, not on how big the 45 is.' },
        { tex: '\\frac{110}{7} \\approx 15.7,\\quad \\text{median} = 15', text: 'Now remove the 45. The total drops to 110 for 7 ages, so the mean is about 15.7, and the median is the 4th value, 15.' },
        { tex: '19.4 - 15.7 \\approx 3.7,\\quad 15.5 - 15 = 0.5', text: 'Compare the changes. The mean moved by about 3.7 years but the median by only 0.5, so the median is resistant to the outlier and the mean is not.' },
      ],
      answer: '\\text{mean moves } 3.7;\\ \\text{median moves } 0.5',
    },
    table: {
      head: ['', 'mean', 'median'],
      rows: [['with 45 (n = 8)', '155 ÷ 8 ≈ 19.4', '15.5'], ['without 45 (n = 7)', '110 ÷ 7 ≈ 15.7', '15'], ['change', 'about 3.7', '0.5']],
      mark: 2,
      note: 'One wild value drags the mean toward itself. The median barely notices.',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: two classes, one test',
    body: 'Class A: median 78, IQR 10. Class B: median 85, IQR 20. Sketch two boxplots, then compare the two classes in center and in spread.',
    steps: {
      steps: [
        { text: 'Sketch a number line and draw each box. Class B\'s median line, 85, sits to the right of Class A\'s, 78, so B\'s whole box is shifted to the right.' },
        { tex: '85 - 78 = 7', text: 'Compare centers with centers: the medians differ by 7, so the typical student in Class B scored 7 points higher than the typical student in Class A.' },
        { tex: '\\text{IQR}_A = 10 < \\text{IQR}_B = 20', text: 'Compare spreads with spreads. The IQR is the width of the box, and A\'s is 10 against B\'s 20, so A\'s middle half is packed into half the width.' },
        { text: 'State the conclusion in context: Class B did better typically, but Class A was more consistent. Name the class with every number so the comparison is clear.' },
      ],
      answer: '\\text{B: higher center; A: smaller spread}',
    },
    compare: {
      cols: [
        { title: 'Class A', lines: ['median 78', 'IQR 10 — a narrow box', 'more consistent'], tone: 'accent' },
        { title: 'Class B', lines: ['median 85', 'IQR 20 — a wide box', 'higher typical score'], tone: 'ok' },
      ],
      note: 'Compare centers with centers and spreads with spreads, and say which class each number belongs to.',
    },
  },
  {
    kind: 'protip',
    head: 'The standard deviation recipe',
    body: 'Students lose the thread in the middle of a standard deviation. Run the same five moves every time, and write the deviations in a column so you can check that they add to zero before you square anything.',
    art: flow([{ label: 'Find the mean' }, { label: 'Subtract it from every value' }, { label: 'Square each deviation and add' }, { label: 'Divide by n − 1, then square root' }], { title: 'Five moves, same order every time', caption: 'For 3, 5, 5, 8, 9: mean 6, squares add to 24, 24 ÷ 4 = 6, s = √6 ≈ 2.45.' }),
  },
  {
    kind: 'trap',
    head: 'Trap: n instead of n − 1, and Q1 + Q3',
    body: 'Two slips cost the most points. Dividing the squared deviations by n gives a slightly-too-small answer (24 ÷ 5 = 4.8 instead of 6); a sample standard deviation divides by n − 1. And the IQR is Q3 MINUS Q1 — a width, never a sum. Sort before you find any median or quartile.',
    compare: {
      cols: [
        { title: 'Wrong', lines: ['variance = 24 ÷ 5 = 4.8', 'IQR = 6 + 12 = 18'], tone: 'bad' },
        { title: 'Right', lines: ['variance = 24 ÷ 4 = 6', 'IQR = 12 − 6 = 6'], tone: 'ok' },
      ],
      note: 'Sample standard deviation: n − 1 on the bottom. IQR: subtract, and it must come out positive.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: reporting the mean next to an outlier',
    body: 'When the ages included the 45, the mean of 19.4 described nobody — seven of the eight people were 20 or under. Skewed data or outliers call for the median and the IQR, which are resistant. Mean and standard deviation are for roughly symmetric data with no outliers.',
    compare: {
      cols: [
        { title: 'Resistant', lines: ['median', 'IQR', 'use with skew or outliers'], tone: 'ok' },
        { title: 'Not resistant', lines: ['mean', 'standard deviation', 'use when symmetric, no outliers'], tone: 'warn' },
      ],
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: add a value, keep the mean',
    body: 'Add one more homework time to 4, 6, 7, 8, 10, 12, 16 so the mean stays exactly 9. What happens to the median?',
    steps: {
      steps: [
        { tex: '8 \\times 9 = 72', text: 'After adding one value there are 8 values, and a mean of 9 means a total of 8 × 9 = 72. The mean is total divided by n, so the total is mean times n.' },
        { tex: '72 - 63 = 9', text: 'The old total was 63, so the new value must be 72 − 63 = 9. That makes sense: adding a value equal to the mean cannot move the balance point.' },
        { tex: '4, 6, 7, 8, 9, 10, 12, 16', text: 'Insert the 9 in order, because the median needs a sorted list. The new 9 lands between the 8 and the 10.' },
        { tex: '\\tfrac{8 + 9}{2} = 8.5', text: 'With 8 values the median is the average of the 4th and 5th values, 8 and 9, which is 8.5. The mean held still at 9, but the median moved up from 8.' },
      ],
      answer: '\\text{add } 9;\\ \\text{median } 8 \\to 8.5',
    },
  },
  {
    kind: 'summary',
    head: 'Center, spread, and what to trust',
    body: 'Mean and median measure center; standard deviation, IQR and range measure spread. The five-number summary draws the boxplot, and the 1.5 × IQR rule decides which dots sit outside the whiskers. When the data are skewed or hold an outlier, report the resistant pair: median and IQR.',
    table: {
      head: ['measure', 'what it is', 'resistant?'],
      rows: [['mean', 'sum ÷ n', 'no'], ['median', 'middle of the sorted list', 'yes'], ['standard deviation', 'typical distance from the mean (÷ n − 1)', 'no'], ['IQR', 'Q3 − Q1, width of the middle half', 'yes']],
    },
  },
];

// ---------------- STAT-3 — The normal distribution and z-scores ----------------
const STAT_3: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'The bell curve, and where a score sits on it',
    body: 'Test scores follow N(500, 100): a bell curve centered at 500 with standard deviation 100. A score of 650 sits 1.5 standard deviations above the mean, so z = 1.5. Today you will turn any value into a z-score and any z-score into an area under the curve.',
    art: normalFig({ mu: 500, sigma: 100, marks: [{ at: 650, label: 'x = 650, z = 1.5' }], title: 'Scores are N(500, 100)', caption: 'The ticks are one standard deviation apart. 650 is one and a half of them past 500.', alt: 'A normal curve centered at 500 with ticks every 100 and a dashed line at 650 labelled z equals 1.5' }),
  },
  {
    kind: 'concept',
    head: 'Two numbers describe the whole curve',
    body: 'A NORMAL distribution is a symmetric bell curve described by its mean μ, the center, and its standard deviation σ, the distance from the center out to where the curve changes from steep to flat. We write N(μ, σ). N(500, 100) and N(64.5, 2.5) are the same shape, just relabelled.',
    why: 'Every normal curve has the same bell shape, and only its center and its scale change. Changing μ slides the whole curve left or right, and changing σ stretches or squeezes it. So two numbers are enough to rebuild any normal curve from the one standard bell.',
    formula: {
      tex: 'N(\\mu,\\ \\sigma)',
      note: 'Same bell every time; μ slides it along the axis and σ stretches it wider or squeezes it narrower.',
      parts: [
        { sym: '\\mu', means: 'the mean — the peak and the line of symmetry', tone: 'accent' },
        { sym: '\\sigma', means: 'the standard deviation — one tick on the axis', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The empirical rule: 68–95–99.7',
    body: 'About 68% of values lie within 1σ of the mean, 95% within 2σ, and 99.7% within 3σ. Whatever is left over is split evenly between the two tails: beyond 2σ there is 5% in total, so 2.5% on each side.',
    why: 'The bell is built so that most values cluster near the center and the tails thin out fast. Measured in standard deviations from the mean, the share inside 1, 2 and 3 steps is always the same, 68%, 95% and 99.7%, whatever the units and whatever μ and σ are.',
    formula: {
      tex: '\\mu \\pm 1\\sigma:\\ 68\\%\\qquad \\mu \\pm 2\\sigma:\\ 95\\%\\qquad \\mu \\pm 3\\sigma:\\ 99.7\\%',
      note: 'Halve the leftover for one tail: (100 − 95)/2 = 2.5% beyond 2σ on one side.',
      parts: [
        { sym: '68\\%', means: 'between 400 and 600 for N(500, 100)', tone: 'accent' },
        { sym: '95\\%', means: 'between 300 and 700', tone: 'ok' },
        { sym: '2.5\\%', means: 'above 700 — half of the 5% left over', tone: 'warn' },
      ],
    },
    art: normalFig({ mu: 500, sigma: 100, shade: [400, 600], shadeLabel: { text: '68%', at: 500, y: 150 }, title: 'Within one standard deviation', caption: 'The shaded middle, 400 to 600, holds about 68% of all scores.', alt: 'A normal curve centered at 500 with the region from 400 to 600 shaded and labelled 68 percent' }),
  },
  {
    kind: 'concept',
    head: 'The z-score counts standard deviations',
    body: 'A Z-SCORE says how many standard deviations a value sits from the mean: z = (x − μ)/σ. Negative z means below the mean. Because z has no units, it lets you compare a test score with a height, or a score on one test with a score on another.',
    why: 'Subtracting μ moves the center of the data to 0, and dividing by σ rescales one standard deviation to exactly 1. Every normal distribution is relabelled onto the same standard scale, which is why one table serves them all and why values from different variables can be compared.',
    formula: {
      tex: 'z = \\frac{x - \\mu}{\\sigma}',
      note: 'Subtract the center, then divide by one tick.',
      parts: [
        { sym: 'x - \\mu', means: 'how far the value is from the mean, in original units', tone: 'accent' },
        { sym: '\\sigma', means: 'the size of one standard deviation', tone: 'ok' },
        { sym: 'z', means: 'the distance measured in standard deviations', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The table gives the area to the LEFT',
    body: 'The standard normal table (or normalcdf) gives the AREA TO THE LEFT of a z-score — the proportion of values below x. For an area to the right, subtract from 1. For an area between two values, subtract the two left-areas. Always sketch and shade before you compute.',
    why: 'Area under the curve is the proportion of values, and the total area is 1. The table lists the area from the far left edge up to z, which is everything below x. Anything else, above or between, is built from these left-areas by subtracting from 1 or subtracting two of them.',
    art: normalFig({ mu: 0, sigma: 1, shade: [-3.6, 1], shadeLabel: { text: 'area to the left of z', at: -0.9, y: 170 }, tickText: (k) => (k === 0 ? '0' : k > 0 ? String(k) : `−${-k}`), marks: [{ at: 1, label: 'z' }], title: 'The standard normal curve, N(0, 1)', caption: 'The table reports the shaded part: everything below the z you look up.', alt: 'The standard normal curve with everything to the left of z equals 1 shaded' }),
  },
  {
    kind: 'concept',
    head: 'Going backwards: from a percent to a value',
    body: 'Some questions start with the area: "what score is the top 10%?" Find the z with that area to its LEFT (invNorm), then unstandardize: x = μ + zσ. Top 10% means 90% is to the left, which is z ≈ 1.28.',
    why: 'The z-score formula is just an equation, z = (x − μ)/σ, so to find x we undo it step by step: multiply by σ to cancel the division, then add μ to cancel the subtraction. Finding z from the percent is the same table, read in reverse.',
    formula: {
      tex: 'x = \\mu + z\\,\\sigma',
      note: 'The z-score formula solved for x. A negative z makes the second term negative on its own.',
      parts: [
        { sym: 'z', means: 'looked up from the area, not computed from a value', tone: 'accent' },
        { sym: 'z\\,\\sigma', means: 'how far from the mean, back in original units', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'The z-score of 650',
    body: 'Scores are N(500, 100). What is the z-score of a score of 650, and what does it tell you?',
    steps: {
      steps: [
        { tex: 'z = \\frac{x - \\mu}{\\sigma}', text: 'Start from the z-score rule. It counts how many standard deviations a value sits from the mean, so it works for every normal distribution.' },
        { tex: 'z = \\frac{650 - 500}{100}', text: 'Substitute x = 650, the mean μ = 500 and σ = 100. The top subtracts the mean to find the distance from the center, and the bottom measures that distance in units of σ.' },
        { tex: 'z = \\frac{150}{100} = 1.5', text: 'Divide: 150 ÷ 100 = 1.5. The answer is positive because 650 is above the mean, and it says 650 is one and a half standard deviations above 500.' },
      ],
      answer: 'z = 1.5',
    },
  },
  {
    kind: 'example',
    head: 'Empirical rule: between 400 and 600, and above 700',
    body: 'For N(500, 100), about what percent of scores lie between 400 and 600, and about what percent score above 700?',
    steps: {
      steps: [
        { tex: '400 = 500 - 1(100),\\quad 600 = 500 + 1(100)', text: 'Write the endpoints in standard deviations from the mean. Since σ = 100, the numbers 400 and 600 are exactly 1σ below and 1σ above 500, so the 1σ part of the rule applies.' },
        { tex: '68\\%', text: 'The empirical rule says about 68% of values lie within 1σ of the mean, so about 68% of the scores are between 400 and 600.' },
        { tex: '700 = 500 + 2(100)', text: 'Now 700 is exactly 2σ above the mean. The rule says 95% lie within 2σ, so 100% − 95% = 5% lie outside, split between the two tails.' },
        { tex: '\\frac{5\\%}{2} = 2.5\\%', text: 'The curve is symmetric, so the two tails are equal. Half of the 5% is in the upper tail, so about 2.5% of scores are above 700.' },
      ],
      answer: '68\\%\\ \\text{between 400 and 600;}\\ 2.5\\%\\ \\text{above 700}',
    },
    art: normalFig({ mu: 500, sigma: 100, shade: [700, 860], shadeColor: ROSE, shadeLabel: { text: '2.5%', at: 745, y: 172 }, marks: [{ at: 700, label: 'x = 700, z = 2', color: VIO }], title: 'The tail above 700', caption: '5% lies beyond 2σ in both tails together, so 2.5% sits in this one.', alt: 'A normal curve centered at 500 with the small tail to the right of 700 shaded and labelled 2.5 percent' }),
  },
  {
    kind: 'example',
    head: 'Proportion below 650',
    body: 'For N(500, 100), what proportion of scores are below 650? Standardize first, then use the area to the left.',
    steps: {
      steps: [
        { tex: 'z = \\frac{650 - 500}{100} = 1.5', text: 'Standardize 650 with z = (x − μ)/σ, so the table, which is built for the standard normal curve, can be used. Here z = 1.5.' },
        { tex: 'P(z < 1.5) = 0.9332', text: 'Look up z = 1.5. The table gives the area to the LEFT of z, which is exactly the proportion of scores below 650, so no adjusting is needed.' },
        { tex: '1 - 0.9332 = 0.0668', text: 'If the question had asked for scores above 650, we would subtract from 1 because the total area is 1. For below, the answer stays 0.9332, about 93.3%, with 6.7% above.' },
      ],
      answer: '0.9332',
    },
    art: normalFig({ mu: 500, sigma: 100, shade: [140, 650], shadeLabel: { text: '0.9332', at: 450, y: 150 }, marks: [{ at: 650, label: 'x = 650, z = 1.5' }], title: 'Below 650', caption: 'Shade left of 650 — that is exactly what the table reports for z = 1.5.', alt: 'A normal curve centered at 500 with everything left of 650 shaded and labelled 0.9332' }),
  },
  {
    kind: 'example',
    head: 'Between two values: women\'s heights',
    body: 'Adult women\'s heights are N(64.5, 2.5) inches. What proportion are between 62 and 67 inches?',
    steps: {
      steps: [
        { tex: 'z_{62} = \\frac{62 - 64.5}{2.5} = -1,\\quad z_{67} = \\frac{67 - 64.5}{2.5} = 1', text: 'Standardize both ends with z = (x − μ)/σ. The value 62 gives z = −1 and 67 gives z = 1, so they sit one σ on either side of the mean.' },
        { tex: 'P(z < 1) = 0.8413,\\quad P(z < -1) = 0.1587', text: 'The table gives only areas to the left, so look up both ends. The area left of z = 1 is 0.8413 and the area left of z = −1 is 0.1587.' },
        { tex: '0.8413 - 0.1587 = 0.6826', text: 'The big left-area covers everything below 67 and the small one covers everything below 62. Subtracting removes the part below 62 and leaves the middle: 0.6826.' },
      ],
      answer: '0.6826',
    },
    art: normalFig({ mu: 64.5, sigma: 2.5, shade: [62, 67], shadeLabel: { text: '0.6826', at: 64.5, y: 150 }, marks: [{ at: 62, label: 'z = −1' }, { at: 67, label: 'z = 1' }], title: 'Heights are N(64.5, 2.5) inches', caption: '62 and 67 are each one standard deviation from 64.5, so the middle is about 68%.', alt: 'A normal curve centered at 64.5 with the region from 62 to 67 shaded and labelled 0.6826' }),
  },
  {
    kind: 'example',
    head: 'Another way: notice the empirical rule',
    body: 'Before reaching for the table, check whether the endpoints 62 and 67 land on whole standard deviations of the N(64.5, 2.5) curve.',
    steps: {
      steps: [
        { tex: 'z_{62} = -1,\\quad z_{67} = 1', text: 'Standardize the endpoints: (62 − 64.5)/2.5 = −1 and (67 − 64.5)/2.5 = 1. Both are whole numbers, exactly one σ from the mean.' },
        { tex: '\\mu \\pm 1\\sigma \\Rightarrow 68\\%', text: 'When both ends are the same whole number of σ on either side of the mean, the empirical rule applies directly. For ±1σ it says about 68% of values.' },
        { tex: '0.8413 - 0.1587 = 0.6826 \\approx 68\\%', text: 'Check with the table: 0.8413 − 0.1587 = 0.6826, which rounds to about 68%. The rule is a quick estimate and the table is more precise, and here they agree.' },
      ],
      answer: '\\approx 68\\%',
    },
    table: {
      head: ['z-scores', 'empirical rule', 'table'],
      rows: [['−1 to 1', '68%', '0.6826'], ['−2 to 2', '95%', '0.9544'], ['−3 to 3', '99.7%', '0.9974']],
      mark: 0,
      note: 'Whole-number z-scores are the rule\'s home turf. Anything like z = 1.5 needs the table.',
    },
  },
  {
    kind: 'example',
    head: 'The top 10% cutoff',
    body: 'For N(500, 100), what score puts you in the top 10%? Work backwards from the area to a score.',
    steps: {
      steps: [
        { tex: '\\text{area left} = 0.90', text: 'The table gives areas to the left, so convert. If 10% of scores are above the cutoff, then 90% are below it, so the area to the left is 0.90.' },
        { tex: 'z \\approx 1.28', text: 'Find 0.90 inside the table, or use invNorm, reading it in reverse to get z. The closest area is at z ≈ 1.28, positive because the cutoff is above the mean.' },
        { tex: 'x = \\mu + z\\sigma = 500 + 1.28 \\times 100 = 628', text: 'Unstandardize with x = μ + zσ, the z-score formula solved for x. Multiplying z by σ turns standard deviations back into points, and adding the mean puts the answer on the score scale.' },
      ],
      answer: '\\approx 628',
    },
    art: normalFig({ mu: 500, sigma: 100, shade: [628, 860], shadeColor: EMR, shadeLabel: { text: 'top 10%', at: 700, y: 172 }, marks: [{ at: 628, label: 'cutoff 628', color: EMR }], title: 'Where does the top 10% begin?', caption: '90% of the area sits left of the dashed line, 10% to its right.', alt: 'A normal curve centered at 500 with the region to the right of 628 shaded and labelled top 10 percent' }),
  },
  {
    kind: 'example',
    head: 'Picture it first: rejected chip bags',
    body: 'Bags are filled N(10, 0.2) ounces and a bag under 9.7 oz is rejected. What proportion of bags are rejected? Sketch the curve, mark 9.7 on the left, and shade below it.',
    steps: {
      steps: [
        { tex: 'z = \\frac{9.7 - 10}{0.2} = -1.5', text: 'Standardize: (9.7 − 10)/0.2 = −0.3/0.2 = −1.5. The z is negative because 9.7 is below the mean, 1.5 standard deviations to the left.' },
        { tex: 'P(z < -1.5) = 0.0668', text: 'Rejected bags are those below 9.7, which is an area to the left, so the table applies directly with no subtraction. The area left of z = −1.5 is 0.0668.' },
        { tex: '0.0668 \\approx 6.7\\%', text: 'Convert to a percent: 0.0668 is about 6.7%, so roughly 7 bags in every 100 are rejected. A thin left tail makes sense for a cutoff 1.5σ below the mean.' },
      ],
      answer: '0.0668',
    },
    art: normalFig({ mu: 10, sigma: 0.2, shade: [9.28, 9.7], shadeColor: ROSE, shadeLabel: { text: '0.0668', at: 9.55, y: 172 }, marks: [{ at: 9.7, label: '9.7 oz, z = −1.5' }], title: 'Bag weights are N(10, 0.2) oz', caption: 'The rejected bags are the thin left tail below 9.7 ounces.', alt: 'A normal curve centered at 10 with the tail below 9.7 shaded and labelled 0.0668' }),
  },
  {
    kind: 'protip',
    head: 'Draw, mark, shade — then compute',
    body: 'Every normal problem is the same four moves. Draw the bell and mark μ. Mark the value you were given. Shade the region the question describes. Only then standardize and look up the area. The sketch tells you whether your answer should be big or small before the table does.',
    art: flow([{ label: 'Draw the curve, mark μ and the σ ticks' }, { label: 'Mark the value x (or the cutoff)' }, { label: 'Shade: left, right, or between?' }, { label: 'Standardize, look up, adjust' }], { title: 'The same four moves, every time', caption: 'If the shaded part looks small and your answer is 0.93, you shaded the wrong side.' }),
  },
  {
    kind: 'trap',
    head: 'Trap: reading the wrong side of the table',
    body: 'The table always gives the area to the LEFT. The proportion of scores above 650 is 1 − 0.9332 = 0.0668, not 0.9332. A quick sanity check: a value above the mean has more than half the area to its left, so "above" must be less than 0.5.',
    compare: {
      cols: [
        { title: 'Below 650', tex: 'P(z < 1.5) = 0.9332', lines: ['Straight from the table', 'Big — most scores are below'], tone: 'ok' },
        { title: 'Above 650', tex: '1 - 0.9332 = 0.0668', lines: ['Subtract from 1', 'Small — only the right tail'], tone: 'warn' },
      ],
      note: 'The two areas must add to 1. If yours do not, you read the table for the wrong side.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: unstandardizing with the wrong sign',
    body: 'Going backwards, always use x = μ + zσ. The sign of z does the work: for the bottom 10%, z ≈ −1.28 and x = 500 + (−1.28)(100) = 372. Writing μ − zσ with a positive z gives the right number by accident here and the wrong one everywhere else.',
    compare: {
      cols: [
        { title: 'Top 10%', tex: '500 + 1.28(100) = 628', lines: ['z is positive', 'cutoff above the mean'], tone: 'ok' },
        { title: 'Bottom 10%', tex: '500 + (-1.28)(100) = 372', lines: ['z is negative', 'cutoff below the mean'], tone: 'accent' },
      ],
      note: 'One formula, two signs of z. Never flip the formula; let z carry the sign.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: between 350 and 700',
    body: 'For N(500, 100), what proportion of scores lie between 350 and 700? The ends are different numbers of σ from the mean, so plan to use the table.',
    steps: {
      steps: [
        { tex: 'z_{350} = \\frac{350 - 500}{100} = -1.5,\\quad z_{700} = \\frac{700 - 500}{100} = 2', text: 'Standardize both ends: 350 gives z = −1.5 and 700 gives z = 2. They are different distances from the mean, so one empirical-rule percent will not do.' },
        { tex: 'P(z < 2) = 0.9772', text: 'Look up the area left of the upper end, z = 2. It is 0.9772, and it covers everything below 700.' },
        { tex: 'P(z < -1.5) = 0.0668', text: 'Look up the area left of the lower end, z = −1.5. It is 0.0668 and covers everything below 350, which is more than we want to count.' },
        { tex: '0.9772 - 0.0668 = 0.9104', text: 'Subtract the small area from the big one so only the middle is left. That is 0.9104, so about 91% of scores are between 350 and 700.' },
      ],
      answer: '0.9104',
    },
  },
  {
    kind: 'summary',
    head: 'Standardize, then shade',
    body: 'A normal distribution is N(μ, σ). The z-score z = (x − μ)/σ measures distance from the mean in standard deviations. The table gives the area to the left of z; subtract from 1 for the right, subtract two left-areas for between. To go backwards, look up z from the area and unstandardize with x = μ + zσ.',
    table: {
      head: ['z', 'area to the left', 'where it came up'],
      rows: [['−1.5', '0.0668', 'chip bags under 9.7 oz'], ['−1', '0.1587', 'heights under 62 in'], ['1', '0.8413', 'heights under 67 in'], ['1.28', '0.90', 'top 10% cutoff, 628'], ['1.5', '0.9332', 'scores under 650']],
    },
  },
];

// ---------------- STAT-4 — Scatterplots, correlation and least-squares regression ----------------
const STUDY = [{ x: 1, y: 60 }, { x: 2, y: 65 }, { x: 3, y: 75 }, { x: 4, y: 80 }, { x: 5, y: 90 }];
const STUDY_RANGE: Range = { x: [0, 6], y: [50, 95] };
const STUDY_TICKS = { x: [1, 2, 3, 4, 5], y: [50, 60, 70, 80, 90] };

const STAT_4: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Two variables, one line through the cloud',
    body: 'Five students studied 1, 2, 3, 4 and 5 hours and scored 60, 65, 75, 80 and 90. Today you will describe the pattern, measure how tight it is with r, fit the least-squares line, and then use that line carefully — predicting inside the data and never far beyond it.',
    art: scatterFig(STUDY, { range: STUDY_RANGE, ticks: STUDY_TICKS, xLabel: 'hours', yLabel: 'score', title: 'Hours studied vs. test score', caption: 'Five points climbing to the right in nearly a straight line: positive, linear, strong.', alt: 'A scatterplot of five points at (1, 60), (2, 65), (3, 75), (4, 80) and (5, 90) rising to the right' }),
  },
  {
    kind: 'concept',
    head: 'Reading a scatterplot',
    body: 'A SCATTERPLOT shows two quantitative variables: the EXPLANATORY variable x on the horizontal axis and the RESPONSE y on the vertical. Describe it with direction (positive or negative), form (linear or curved), strength (how tightly the points hug the form), and any unusual points.',
    why: 'Each point is one individual measured twice, so the cloud shows whether the two measurements move together. Direction says whether they rise together, form says whether a straight line is a fair summary, and strength says how closely a single line follows the points.',
    compare: {
      cols: [
        { title: 'Direction', lines: ['Positive: up to the right', 'Negative: down to the right'], tone: 'accent' },
        { title: 'Form', lines: ['Linear: a straight band', 'Curved: bends'], tone: 'ok' },
        { title: 'Strength', lines: ['Strong: a tight band', 'Weak: a loose cloud'], tone: 'warn' },
      ],
      note: 'Say all three, then mention outliers, then name the variables in context.',
    },
  },
  {
    kind: 'concept',
    head: 'Correlation r',
    body: 'The CORRELATION r measures the direction and strength of a LINEAR relationship. It is always between −1 and 1, has no units, and does not change if you swap x and y or change units. Near 0 is weak; near ±1 is strong. For the study data r = 0.993 — very strong and positive.',
    why: 'The correlation r is built from z-scores: it averages the products of each point\'s x z-score and y z-score. Points up-right or down-left give positive products and the others negative, so r measures how consistently the points follow a line. Z-scores have no units, so r has none either.',
    formula: {
      tex: '-1 \\le r \\le 1',
      note: 'The sign gives the direction, the size gives the strength. r = −0.9 is stronger than r = 0.4.',
      parts: [
        { sym: 'r > 0', means: 'the points rise to the right', tone: 'ok' },
        { sym: 'r < 0', means: 'the points fall to the right', tone: 'bad' },
        { sym: '|r| \\approx 1', means: 'the points nearly sit on a line', tone: 'accent' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The least-squares regression line',
    body: 'The LEAST-SQUARES LINE ŷ = a + bx makes the sum of the squared residuals as small as possible. Its slope is b = r·(s_y/s_x), and it always passes through the point of means (x̄, ȳ), so a = ȳ − b·x̄. For the study data that line is ŷ = 51.5 + 7.5x.',
    why: 'Of all possible lines, the least-squares line has the smallest total of squared vertical misses, so large misses are punished hard. Forcing it through (x̄, ȳ) balances the misses above and below. The slope r·s_y/s_x says that one s_x step in x moves the prediction only r steps of s_y in y.',
    formula: {
      tex: '\\hat{y} = a + bx,\\qquad b = r\\,\\frac{s_y}{s_x},\\qquad a = \\bar{y} - b\\,\\bar{x}',
      note: 'The hat on ŷ says "predicted". The line is a model, not a list of the actual scores.',
      parts: [
        { sym: 'b', means: 'the slope — predicted change in y per 1 unit of x', tone: 'accent' },
        { sym: 'a', means: 'the intercept — predicted y when x = 0', tone: 'ok' },
        { sym: '(\\bar{x}, \\bar{y})', means: 'the point of means, always on the line: (3, 74)', tone: 'warn' },
      ],
    },
    art: scatterFig(STUDY, { range: STUDY_RANGE, ticks: STUDY_TICKS, xLabel: 'hours', yLabel: 'score', fit: { a: 51.5, b: 7.5, label: 'ŷ = 51.5 + 7.5x', at: [4.1, 56], anchor: 'start' }, mean: { x: 3, y: 74, label: '(x̄, ȳ) = (3, 74)' }, title: 'The least-squares line through the point of means', caption: 'The line passes through (3, 74) and climbs 7.5 points for every extra hour.', alt: 'The five study points with the least-squares line y-hat equals 51.5 plus 7.5x drawn through them and the point of means (3, 74) marked' }),
  },
  {
    kind: 'concept',
    head: 'Residuals: actual minus predicted',
    body: 'A RESIDUAL is actual − predicted, y − ŷ. Positive means the point sits above the line; negative means below. The residuals of a least-squares line always add to zero. And r² is the fraction of the variation in y that the linear relationship with x explains.',
    why: 'A residual measures the miss of one prediction, in the units of y: how far above or below the line the actual point sits. A least-squares line balances its positive and negative misses, so they sum to zero, and r² compares the size of the leftover misses with the total variation in y.',
    formula: {
      tex: '\\text{residual} = y - \\hat{y}',
      note: 'Actual first, predicted second. The student who studied 2 hours scored 65 against a prediction of 66.5: residual −1.5.',
      parts: [
        { sym: 'y', means: 'what actually happened — the data point', tone: 'accent' },
        { sym: '\\hat{y}', means: 'what the line said would happen', tone: 'ok' },
        { sym: 'r^{2}', means: 'share of the variation in y explained by x', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Describe the scatterplot',
    body: 'Hours studied and test score: (1, 60), (2, 65), (3, 75), (4, 80), (5, 90). Describe the relationship using direction, form and strength.',
    steps: {
      steps: [
        { text: 'Direction: as the hours go up, the scores go up, so the points rise from left to right and the association is positive.' },
        { text: 'Form: the five points nearly line up along a straight band instead of bending, so a straight line is a fair summary and the form is linear.' },
        { text: 'Strength: the points hug that line closely with very little scatter, so the relationship is strong. A loose cloud would be weak.' },
        { text: 'Unusual points: none stands apart from the pattern. Put it in context: more hours studied goes with higher test scores.' },
      ],
      answer: '\\text{positive, linear, strong}',
    },
  },
  {
    kind: 'example',
    head: 'Find the regression line',
    body: 'For the same data, x̄ = 3 and ȳ = 74. The deviations give Σ(x − x̄)(y − ȳ) = 75 and Σ(x − x̄)² = 10. Find the least-squares line.',
    steps: {
      steps: [
        { tex: 'b = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{\\sum (x - \\bar{x})^{2}} = \\frac{75}{10} = 7.5', text: 'For the slope, divide the sum of the x-deviation times y-deviation products by the sum of squared x-deviations. This formula gives the line with the smallest squared residuals.' },
        { tex: 'a = \\bar{y} - b\\,\\bar{x} = 74 - 7.5(3) = 51.5', text: 'The least-squares line always passes through the point of means (3, 74). Substitute that point to solve for the intercept: 74 − 22.5 = 51.5.' },
        { tex: '\\hat{y} = 51.5 + 7.5x', text: 'Write the line using ŷ with a hat, because it gives predicted scores and not actual ones. The slope 7.5 is the predicted gain in score per extra hour.' },
      ],
      answer: '\\hat{y} = 51.5 + 7.5x',
    },
  },
  {
    kind: 'example',
    head: 'Interpret the slope and the intercept',
    body: 'ŷ = 51.5 + 7.5x, where x is hours studied and y is the score. Interpret the slope and the intercept in context.',
    steps: {
      steps: [
        { tex: 'b = 7.5', text: 'The slope is the number multiplying x. It is the change in ŷ when x goes up by 1, so each extra hour of study changes the predicted score by 7.5 points.' },
        { text: 'The slope is positive, so the predicted score rises. Use the word predicted, because the line is a model of an average pattern and not a promise for each student.' },
        { tex: 'a = 51.5 + 7.5(0) = 51.5', text: 'The intercept is ŷ when x = 0, found by putting 0 into the line. A student who studies 0 hours is predicted to score 51.5.' },
        { text: 'Check whether the intercept makes sense: 0 hours is just outside the data, which run from 1 to 5 hours. Treat it as where the line starts and not as a precise prediction.' },
      ],
      answer: '+7.5\\ \\text{points per hour;}\\ 51.5\\ \\text{at 0 hours (predicted)}',
    },
    compare: {
      cols: [
        { title: 'Slope 7.5', lines: ['Per extra hour of study,', 'predicted score rises 7.5 points'], tone: 'accent' },
        { title: 'Intercept 51.5', lines: ['At 0 hours of study,', 'predicted score is 51.5'], tone: 'ok' },
      ],
      note: 'Every interpretation names both variables, their units, and the word "predicted."',
    },
  },
  {
    kind: 'example',
    head: 'Predict, then find a residual',
    body: 'Using ŷ = 51.5 + 7.5x, predict the score for 3.5 hours, then find the residual for the student who studied 2 hours and scored 65.',
    steps: {
      steps: [
        { tex: '\\hat{y} = 51.5 + 7.5(3.5) = 77.75', text: 'Substitute x = 3.5 into the line. This is 3.5 hours, inside the data range of 1 to 5 hours, so predicting here is safe: 51.5 + 26.25 = 77.75.' },
        { tex: '\\hat{y} = 51.5 + 7.5(2) = 66.5', text: 'For the residual, first find the line\'s prediction at this student\'s x = 2 hours: 51.5 + 15 = 66.5. The residual compares this with what really happened.' },
        { tex: '65 - 66.5 = -1.5', text: 'Subtract actual minus predicted: 65 − 66.5 = −1.5. The negative sign says the point is below the line, so the student scored 1.5 points under the prediction.' },
      ],
      answer: '77.75;\\ \\text{residual } -1.5',
    },
    art: scatterFig(STUDY, { range: STUDY_RANGE, ticks: STUDY_TICKS, xLabel: 'hours', yLabel: 'score', fit: { a: 51.5, b: 7.5, label: 'ŷ = 51.5 + 7.5x', at: [4.1, 56], anchor: 'start' }, resid: { x: 2, y: 65, label: 'residual −1.5' }, title: 'The 2-hour student sits just below the line', caption: 'Predicted 66.5, actual 65: the short red segment is the residual, −1.5.', alt: 'The study scatterplot with its regression line and a short vertical segment from the point (2, 65) down to the line marking a residual of minus 1.5' }),
  },
  {
    kind: 'example',
    head: 'Another way: slope from r and the two SDs',
    body: 'Without the cross-product sum, the slope still comes from b = r·(s_y/s_x). Use r = 0.993 and find the two standard deviations first.',
    steps: {
      steps: [
        { tex: 's_x = \\sqrt{\\tfrac{10}{4}} \\approx 1.58,\\quad s_y = \\sqrt{\\tfrac{570}{4}} \\approx 11.94', text: 'Find each standard deviation with the n − 1 formula. The squared x-deviations add to 10 and the squared y-deviations to 570, giving s_x ≈ 1.58 hours and s_y ≈ 11.94 points.' },
        { tex: 'b = r\\,\\frac{s_y}{s_x} = 0.993 \\times \\frac{11.94}{1.58} \\approx 7.5', text: 'Multiply r by the ratio s_y/s_x. The ratio converts standard deviations of y per standard deviation of x into points per hour, giving a slope of about 7.5.' },
        { tex: 'a = 74 - 7.5(3) = 51.5', text: 'Find the intercept as before. The line passes through the point of means (3, 74), so a = 74 − 22.5 = 51.5, and the line matches the first method.' },
      ],
      answer: '\\hat{y} = 51.5 + 7.5x',
    },
  },
  {
    kind: 'example',
    head: 'r² says how much the line explains',
    body: 'For the study data, r ≈ 0.993. Find and interpret r².',
    steps: {
      steps: [
        { tex: 'r^{2} = \\frac{75^{2}}{10 \\cdot 570} = \\frac{5625}{5700} \\approx 0.987', text: 'Square the correlation, using the unrounded r = 75/√5700 ≈ 0.9934 so rounding does not creep in. Squaring also removes the sign, so r² is always between 0 and 1.' },
        { text: 'Read r² as a share: it is the fraction of the variation in y that is accounted for by the linear relationship with x. So 0.987 means 98.7%.' },
        { tex: '1 - 0.987 = 0.013', text: 'The rest, 1 − 0.987 = 0.013 or 1.3%, is variation the line cannot explain. It shows up as the scatter of the points around the line.' },
        { text: 'Write the interpretation in context: 98.7% of the variation in test scores is explained by the linear relationship with hours studied.' },
      ],
      answer: '98.7\\%\\ \\text{of the variation in score is explained by hours}',
    },
    formula: {
      tex: 'r^{2} = \\frac{5625}{5700} \\approx 0.987',
      note: '"98.7% of the variation in score is explained by the linear relationship with hours studied."',
      parts: [
        { sym: 'r^{2}', means: 'always between 0 and 1, never negative', tone: 'accent' },
        { sym: '1 - r^{2}', means: 'the 1.3% left unexplained — the residual scatter', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: 20 hours of studying',
    body: 'A classmate uses ŷ = 51.5 + 7.5x to predict the score after 20 hours of studying. Sketch where x = 20 lands compared with the data, then decide whether to trust the answer.',
    steps: {
      steps: [
        { tex: '\\hat{y} = 51.5 + 7.5(20) = 51.5 + 150 = 201.5', text: 'Substitute x = 20 into the line. The arithmetic is fine, but the result, 201.5, is an impossible test score.' },
        { tex: '20 \\gg 5', text: 'Compare 20 hours with the data, which only cover 1 to 5 hours. Predicting far outside the range of the data is called extrapolation.' },
        { text: 'We only know the line fits where we have data. Out there the relationship may bend or level off, so nothing supports the line. Do not trust the prediction.' },
      ],
      answer: '201.5 \\text{ — impossible; extrapolation}',
    },
    art: scatterFig(STUDY, { range: { x: [0, 22], y: [40, 215] }, ticks: { x: [5, 10, 15, 20], y: [50, 100, 150, 200] }, xLabel: 'hours', yLabel: 'score', fit: { a: 51.5, b: 7.5, label: 'ŷ = 51.5 + 7.5x', at: [8, 60], anchor: 'start' }, mean: { x: 20, y: 201.5, label: 'predicted 201.5?', anchor: 'end', dx: -12, dy: 4, hollow: true }, title: 'The data stop at 5 hours; the line does not', caption: 'All five points huddle at the left. At 20 hours the line predicts 201.5 — a score that cannot exist.', alt: 'The five study points clustered at the left of a wide scatterplot with the regression line extended far to the right to a hollow point at 20 hours and 201.5 points' }),
  },
  {
    kind: 'protip',
    head: 'Interpretation sentences that score full marks',
    body: 'Graders look for three things in every interpretation: the word PREDICTED, both variables named, and units. "For each additional hour studied, the predicted test score increases by 7.5 points." Use the same template for the intercept and for r², and you will never lose the point.',
    art: flow([{ label: 'Slope: "for each extra 1 [x-unit], predicted y changes by b"' }, { label: 'Intercept: "when x = 0, predicted y is a" (if x = 0 makes sense)' }, { label: 'r²: "___% of the variation in y is explained by x"' }, { label: 'Residual: "the actual y was ___ above/below the prediction"' }], { title: 'Four sentences to memorize', caption: 'Fill the blanks with the context — hours, points, students — every time.' }),
  },
  {
    kind: 'trap',
    head: 'Trap: predicted minus actual',
    body: 'Residual is ACTUAL minus PREDICTED, in that order. For the 2-hour student: 65 − 66.5 = −1.5, a point below the line. Flip the order and you get +1.5, which says the student beat the prediction when they did not. The sign is the whole story of a residual.',
    compare: {
      cols: [
        { title: 'Wrong order', tex: '66.5 - 65 = +1.5', lines: ['Says: above the line', 'The point is actually below'], tone: 'bad' },
        { title: 'Right order', tex: '65 - 66.5 = -1.5', lines: ['Negative: below the line', 'Matches the picture'], tone: 'ok' },
      ],
      note: 'Check against the plot: a point below the line must have a negative residual.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: a strong r proves nothing about cause',
    body: 'r = 0.993 says the points hug a line. It does not say that studying caused the scores — maybe motivated students both study more and score higher. Correlation is never causation, and a strong correlation never licenses a prediction far outside the data either.',
    compare: {
      cols: [
        { title: 'r can tell you', lines: ['direction of the pattern', 'how linear and tight it is', 'how well x predicts y inside the data'], tone: 'ok' },
        { title: 'r cannot tell you', lines: ['that x causes y', 'anything about curved patterns', 'what happens outside the data'], tone: 'bad' },
      ],
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: all five residuals',
    body: 'Find every residual for ŷ = 51.5 + 7.5x and add them up. What do you notice?',
    steps: {
      steps: [
        { tex: '\\hat{y}: 59,\\ 66.5,\\ 74,\\ 81.5,\\ 89', text: 'Plug each x = 1, 2, 3, 4, 5 into the line to get the predicted scores. Each one is 51.5 plus 7.5 times x, which gives 59, 66.5, 74, 81.5 and 89.' },
        { tex: '1,\\ -1.5,\\ 1,\\ -1.5,\\ 1', text: 'Subtract predicted from actual for each point, since a residual is actual minus predicted: 60 − 59, 65 − 66.5, 75 − 74, 80 − 81.5 and 90 − 89.' },
        { tex: '1 - 1.5 + 1 - 1.5 + 1 = 0', text: 'Add the five residuals. The positive ones total 3 and the negative ones total −3, so they cancel to exactly 0.' },
        { text: 'This is no accident. The least-squares line balances the misses above and below it, so its residuals always sum to zero, and the point of means (3, 74) has residual 0.' },
      ],
      answer: '\\sum \\text{residuals} = 0',
    },
    table: {
      head: ['x', 'y', 'ŷ', 'y − ŷ'],
      rows: [['1', '60', '59', '1'], ['2', '65', '66.5', '−1.5'], ['3', '75', '74', '1'], ['4', '80', '81.5', '−1.5'], ['5', '90', '89', '1'], ['sum', '370', '370', '0']],
      mark: 5,
      note: 'The residuals sum to 0, and the point of means (3, 74) has residual exactly 0.',
    },
  },
  {
    kind: 'summary',
    head: 'Describe, fit, interpret, beware',
    body: 'Describe a scatterplot by direction, form, strength and unusual points. r measures linear strength between −1 and 1. The least-squares line ŷ = a + bx has slope b = r·s_y/s_x and passes through (x̄, ȳ). Residual = actual − predicted; r² is the share of variation explained. Never extrapolate, and never read cause into correlation.',
    formula: {
      tex: '\\hat{y} = 51.5 + 7.5x,\\qquad r = 0.993,\\qquad r^{2} \\approx 0.987',
      note: 'The study-hours model in one line: slope, correlation, and the share it explains.',
      parts: [
        { sym: '7.5', means: 'predicted points per extra hour', tone: 'accent' },
        { sym: '51.5', means: 'predicted score at 0 hours', tone: 'ok' },
        { sym: '0.987', means: '98.7% of score variation explained by hours', tone: 'warn' },
      ],
    },
  },
];

// ---------------- STAT-5 — Sampling: random samples, bias and survey design ----------------
const STAT_5: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Ask a few, learn about everyone',
    body: 'A school of 1,200 students surveys 100 of them and 62% want a later start time. Today you will name the population and the sample, choose individuals with a random digit table, tell stratified from cluster from systematic sampling, and spot the biases that make a survey lie.',
    art: popGrid(40, 10, [5, 9, 20, 31, 6], { numbered: true, title: 'Forty students, five chosen at random', note: 'SRS: 05, 09, 20, 31, 06', caption: 'Every student had the same chance. The five chosen ones are filled in.', alt: 'A grid of forty numbered circles with students 05, 06, 09, 20 and 31 filled in as the random sample' }),
  },
  {
    kind: 'concept',
    head: 'Population, sample, parameter, statistic',
    body: 'The POPULATION is everyone you want to know about; the SAMPLE is the part you actually measure. A PARAMETER describes the population (p, μ) and is usually unknown. A STATISTIC describes the sample (p̂, x̄) and is what you compute. The 62% came from the 100 surveyed, so it is a statistic.',
    why: 'We cannot measure everyone, so we measure a sample and use it to estimate a fact about the population. The statistic changes from sample to sample, but the parameter is one fixed number. That is why the symbols differ: p̂ for what we computed, p for what we want to know.',
    formula: {
      tex: '\\hat{p} = \\frac{62}{100} = 0.62',
      note: 'The hat means "from the sample." The population proportion p, of all 1,200 students, stays unknown.',
      parts: [
        { sym: '\\hat{p}', means: 'the sample proportion — a statistic', tone: 'accent' },
        { sym: 'p', means: 'the population proportion — a parameter', tone: 'ok' },
        { sym: '100', means: 'the sample size n', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'A simple random sample',
    body: 'A SIMPLE RANDOM SAMPLE (SRS) of size n gives every group of n individuals the same chance of being chosen. Number the population, then read a random digit table or use a random number generator, skipping numbers that are too big and numbers you have already used.',
    why: 'Because every group of n has the same chance, no kind of student is favored and nothing the researcher prefers can sneak in. Skipping labels over 40 just ignores digits that match nobody, and skipping repeats keeps all the chosen students different from each other.',
    table: {
      head: ['step', 'what you do'],
      rows: [['label', 'number the population 01 to 40'], ['read', 'take two digits at a time from the table'], ['filter', 'skip labels over 40 and repeats'], ['stop', 'when you have n labels']],
      note: 'Two-digit labels because the population has 40 members; three digits for 100 to 999.',
    },
  },
  {
    kind: 'concept',
    head: 'Stratified, cluster, systematic',
    body: 'STRATIFIED sampling splits the population into similar groups (strata) and takes an SRS from each, so every group is represented. CLUSTER sampling picks whole groups at random and measures everyone in them. SYSTEMATIC sampling takes every kth individual after a random start.',
    why: 'Similar individuals give similar answers, so sampling inside each stratum guarantees every group appears and steadies the estimate. A cluster should look like a miniature of the whole population, so measuring a few whole clusters is cheaper yet still representative. A systematic sample is random only through its starting point.',
    compare: {
      cols: [
        { title: 'Stratified', lines: ['groups alike inside', 'SRS from EVERY group'], tone: 'accent' },
        { title: 'Cluster', lines: ['each group a mini-population', 'SOME groups, everyone in them'], tone: 'ok' },
        { title: 'Systematic', lines: ['random start', 'then every kth one'], tone: 'warn' },
      ],
      note: 'Stratified: a few from each. Cluster: all from a few.',
    },
    art: popGrid(40, 10, [2, 5, 9, 11, 14, 18, 23, 26, 30, 32, 35, 39], { rowLabels: ['9th', '10th', '11th', '12th'], title: 'Stratified: an SRS inside every grade', note: 'three chosen from each grade', caption: 'Each row is a grade. Three students are drawn at random from every row, so no grade is missed.', alt: 'Four rows of ten circles labelled 9th to 12th grade, with three filled circles chosen in every row' }),
  },
  {
    kind: 'concept',
    head: 'Bias: a design that leans one way',
    body: 'BIAS is a flaw in the design that pushes results in one direction. VOLUNTARY RESPONSE lets people choose themselves. CONVENIENCE takes whoever is easy to reach. UNDERCOVERAGE leaves part of the population with no chance of being picked. NONRESPONSE happens when chosen people do not answer.',
    why: 'Bias means the errors lean one way instead of canceling out. Each of these designs gives some people a bigger or smaller chance of landing in the sample than others, so the sample systematically differs from the population, and in a predictable direction.',
    table: {
      head: ['bias', 'what goes wrong', 'example'],
      rows: [['voluntary response', 'people with strong opinions pick themselves', 'click "yes" or "no" on a website'], ['convenience', 'only the easy-to-reach are asked', 'shoppers at one mall at noon'], ['undercoverage', 'some people can never be chosen', 'phone survey misses those with no phone'], ['nonresponse', 'chosen people refuse or cannot be reached', '40% of the mailed surveys never return']],
    },
  },
  {
    kind: 'concept',
    head: 'Response bias, and why bigger does not mean better',
    body: 'RESPONSE BIAS comes from the question itself: leading wording, a sensitive topic, or an interviewer\'s tone. Random chance causes VARIABILITY, which a bigger sample shrinks. A bigger sample does NOT shrink bias — ten thousand self-selected clicks are still a voluntary response sample.',
    why: 'Chance errors average out as n grows, because random ups and downs cancel each other. A bias leans the same way for every respondent, so collecting more answers only gives you more copies of the same mistake, measured more precisely. Bias has to be removed by the design.',
    formula: {
      tex: '\\text{variability} \\downarrow \\text{ as } n \\uparrow \\qquad\\qquad \\text{bias: unchanged by } n',
      note: 'Only the design fixes bias; only random selection lets you generalize to the population.',
      parts: [
        { sym: '\\text{variability}', means: 'sample-to-sample wobble from chance alone', tone: 'ok' },
        { sym: '\\text{bias}', means: 'a systematic lean baked into the design', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Population, sample, or statistic?',
    body: 'A school of 1,200 students surveys 100 of them; 62% of those surveyed want a later start time. Name the population and the sample, and decide whether 62% is a parameter or a statistic.',
    steps: {
      steps: [
        { text: 'Population: the whole group we want to learn about, which here is all 1,200 students at the school.' },
        { text: 'Sample: the part of the population we actually measured, which here is the 100 students surveyed. We use it to learn about everyone.' },
        { tex: '\\hat{p} = 0.62', text: 'The 62% was computed from the sample, so it is a statistic, p̂ = 0.62. The parameter p, the percent of all 1,200 students who want a later start, stays unknown.' },
      ],
      answer: '\\text{statistic}',
    },
  },
  {
    kind: 'example',
    head: 'An SRS from a random digit table',
    body: 'Choose an SRS of 5 from 40 students using the line 41050 92031 06449 05059.',
    steps: {
      steps: [
        { tex: '01,\\ 02,\\ \\ldots,\\ 40', text: 'Label the students 01 to 40. Use two-digit labels because 40 has two digits, so every student has a label of the same length.' },
        { tex: '41 \\mid 05 \\mid 09 \\mid 20 \\mid 31 \\mid 06', text: 'Read the digits two at a time. The first pair, 41, is over 40, so it matches no student and is skipped.' },
        { tex: '05,\\ 09,\\ 20,\\ 31,\\ 06', text: 'Keep each new label that is 40 or below, and skip repeats so that no student is chosen twice. The pairs 05, 09, 20, 31 and 06 all qualify.' },
        { text: 'Stop as soon as you have five labels. The remaining pairs 44, 90, 50 and 59 are never needed, so the sample is students 05, 09, 20, 31 and 06.' },
      ],
      answer: '05,\\ 09,\\ 20,\\ 31,\\ 06',
    },
    table: {
      head: ['pair', 'keep?'],
      rows: [['41', 'skip — over 40'], ['05', 'keep (1st)'], ['09', 'keep (2nd)'], ['20', 'keep (3rd)'], ['31', 'keep (4th)'], ['06', 'keep (5th) — done']],
      mark: 5,
      note: 'Five labels in hand, so 44, 90, 50 and 59 are never read.',
    },
  },
  {
    kind: 'example',
    head: 'Plan A or plan B: name the design',
    body: 'A principal wants student opinions on the cafeteria. Plan A: an SRS of 10 from each grade, 9–12. Plan B: pick 3 homerooms at random and survey everyone in them. Name each design.',
    steps: {
      steps: [
        { text: 'Both plans first split the school into groups, so the question is what happens next: are SOME people taken from EVERY group, or EVERYONE from SOME groups?' },
        { text: 'Plan A takes 10 students from each of the four grades, using an SRS inside each grade. Every grade gets a voice, which is stratified random sampling.' },
        { text: 'Plan B picks three whole homerooms at random and surveys everyone inside them. It chooses entire groups rather than individual people, which is cluster sampling.' },
        { text: 'Compare the goals: stratified sampling guarantees each grade is represented, while cluster sampling saves time because only three rooms need to be visited.' },
      ],
      answer: '\\text{A: stratified;}\\ \\text{B: cluster}',
    },
    compare: {
      cols: [
        { title: 'Plan A — stratified', lines: ['strata = grades', '10 from EACH grade', 'every grade represented'], tone: 'accent' },
        { title: 'Plan B — cluster', lines: ['clusters = homerooms', 'ALL of 3 random homerooms', 'cheap: three rooms to visit'], tone: 'ok' },
      ],
    },
    art: popGrid(40, 8, [1, 2, 3, 4, 5, 6, 7, 8, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], { rowLabels: ['room 1', 'room 2', 'room 3', 'room 4', 'room 5'], title: 'Cluster: three whole homerooms', note: 'rooms 1, 3, 4 drawn — everyone inside is surveyed', caption: 'Plan B picks rooms, not students. Whole rows light up.', alt: 'Five rows of eight circles labelled room 1 to room 5, with every circle in rooms 1, 3 and 4 filled in' }),
  },
  {
    kind: 'example',
    head: '88% say taxes are too high',
    body: 'A news website asks readers to click "yes" or "no" on whether taxes are too high; 88% click yes. What kind of bias is this, and which way does it push the result?',
    steps: {
      steps: [
        { text: 'Ask who chose the respondents. Nobody did: readers decided for themselves whether to click, and the site did not select them.' },
        { text: 'A sample made of people who choose themselves is a voluntary response sample. People with strong feelings are far more likely to bother to respond, so their voices are over-represented.' },
        { text: 'Find the direction: angry readers click more, so the 88% probably overstates the proportion of all people who think taxes are too high.' },
        { text: 'Counting more clicks cannot repair this, because the design is the flaw. Only random selection of who is asked could remove the bias.' },
      ],
      answer: '\\text{voluntary response bias; overstates}',
    },
    compare: {
      cols: [
        { title: 'What happened', lines: ['readers selected themselves', 'the angry click more', '88% is inflated'], tone: 'bad' },
        { title: 'What would fix it', lines: ['the site chooses who to ask', 'an SRS of its readers', 'follow up with non-responders'], tone: 'ok' },
      ],
      note: 'Name the bias AND the direction: this one overstates how many think taxes are too high.',
    },
  },
  {
    kind: 'example',
    head: 'Another way: a random number generator',
    body: 'Instead of a digit table, ask a calculator for random integers from 1 to 40 until you have five different ones. Suppose it gives 17, 3, 3, 28, 40, 9. Which students are in the sample?',
    steps: {
      steps: [
        { text: 'Label the students 1 to 40 and have the calculator pick random integers in that range. No label is too large, so nothing is skipped for size.' },
        { text: 'Keep 17, then 3. The second 3 is a repeat, and an SRS cannot choose the same student twice, so skip it.' },
        { text: 'Keep 28 and 40. The 40 is allowed because the range runs from 1 up to and including 40.' },
        { text: 'Keep 9 to reach five different students, then stop. Any method that gives every group of five the same chance is an SRS, so this is as valid as the table.' },
      ],
      answer: '17,\\ 3,\\ 28,\\ 40,\\ 9',
    },
    table: {
      head: ['generated', 'keep?'],
      rows: [['17', 'keep'], ['3', 'keep'], ['3', 'skip — repeat'], ['28', 'keep'], ['40', 'keep — 40 is allowed'], ['9', 'keep — five in hand']],
      mark: 2,
      note: 'With a generator there is nothing to skip for size, only repeats.',
    },
  },
  {
    kind: 'example',
    head: 'A question that answers itself',
    body: 'A survey asks: "Do you agree that overpaid athletes should be taxed more?" What is wrong with the question, and how would you fix it?',
    steps: {
      steps: [
        { text: 'Read the wording for loaded words. "Overpaid" is a verdict hiding inside the question, telling the respondent what to think before they answer.' },
        { text: 'Wording that pushes people toward one answer is a leading question, and it causes response bias. The answers lean toward yes because of the question, not because of true opinions.' },
        { text: 'Fix it by removing the loaded word and offering both sides: "Should professional athletes pay a higher tax rate?" Neutral wording lets people give their own opinion.' },
      ],
      answer: '\\text{leading question; rewrite it neutrally}',
    },
    compare: {
      cols: [
        { title: 'Leading', lines: ['"Do you agree that OVERPAID athletes…"', 'pushes toward yes'], tone: 'bad' },
        { title: 'Neutral', lines: ['"Should professional athletes pay a higher tax rate?"', 'no verdict in the wording'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: every 10th shopper',
    body: 'A store wants a systematic sample of 50 of the 500 shoppers who enter today. Picture the shoppers in a line of 500. Find the gap and describe how to choose them.',
    steps: {
      steps: [
        { tex: '500 \\div 50 = 10', text: 'Divide the population by the sample size: 500 ÷ 50 = 10. Taking every 10th shopper from a line of 500 gives exactly 50, so the gap is k = 10.' },
        { tex: '\\text{start} \\in \\{1, \\ldots, 10\\},\\ \\text{say } 7', text: 'Choose the starting point at random from 1 to 10, say 7. That one random choice is what makes the sample random, because every later pick follows from it.' },
        { tex: '7,\\ 17,\\ 27,\\ \\ldots,\\ 497', text: 'Add 10 each time: 7, 17, 27, 37 and so on up to 497. That is 50 shoppers, one from each block of ten.' },
      ],
      answer: '\\text{every 10th shopper from a random start}',
    },
    formula: {
      tex: 'k = \\frac{N}{n} = \\frac{500}{50} = 10',
      note: 'Random start from 1 to k, then every kth individual.',
      parts: [
        { sym: 'N', means: 'the population size, 500 shoppers', tone: 'accent' },
        { sym: 'n', means: 'the sample size you want, 50', tone: 'ok' },
        { sym: 'k', means: 'the gap between chosen shoppers', tone: 'warn' },
      ],
    },
    art: popGrid(50, 10, [7, 17, 27, 37, 47], { numbered: true, title: 'Every 10th shopper after a random start of 7', note: 'k = 10: shoppers 7, 17, 27, 37, 47, …', caption: 'The first fifty shoppers in the line. One random start, then a fixed gap.', alt: 'Five rows of ten numbered circles with shoppers 7, 17, 27, 37 and 47 filled in — one in each row' }),
  },
  {
    kind: 'protip',
    head: 'Name the bias, then say which way it leans',
    body: 'A full-credit answer about bias has two parts: what the flaw is, and the direction it pushes the result. "Voluntary response bias; people angry about taxes are more likely to click, so 88% overstates the true proportion." Never stop at the name.',
    art: flow([{ label: 'Who could never be chosen? → undercoverage' }, { label: 'Who chose themselves? → voluntary response' }, { label: 'Who was asked only because they were handy? → convenience' }, { label: 'Did the wording push an answer? → response bias' }], { title: 'Four questions to find the flaw', caption: 'Ask them in order, then state whether the estimate is too high or too low.' }),
  },
  {
    kind: 'trap',
    head: 'Trap: a bigger sample cures bias',
    body: 'Ten thousand clicks feel more trustworthy than a hundred, but if the clickers chose themselves the sample is still a voluntary response sample. Sample size shrinks chance variability. It does nothing to a design flaw. Only the DESIGN fixes bias; only randomness lets you generalize.',
    compare: {
      cols: [
        { title: 'Bigger n fixes', lines: ['sample-to-sample variability', 'the margin of error'], tone: 'ok' },
        { title: 'Bigger n does NOT fix', lines: ['voluntary response', 'undercoverage', 'leading questions'], tone: 'bad' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: mixing up stratified and cluster',
    body: 'Both designs start by splitting the population into groups. The difference is what happens next. Stratified takes SOME from EVERY group. Cluster takes EVERY member of SOME groups. Ten from each grade is stratified; all of three homerooms is cluster.',
    compare: {
      cols: [
        { title: 'Stratified', lines: ['some from every group', 'groups chosen on purpose', 'goal: represent every group'], tone: 'accent' },
        { title: 'Cluster', lines: ['everyone from some groups', 'groups chosen at random', 'goal: save time and travel'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: a proportional stratified sample',
    body: 'The 1,200 students are 400 ninth graders, 300 tenth, 300 eleventh and 200 twelfth. Take a stratified sample of 120 in which each grade is represented in proportion to its size.',
    steps: {
      steps: [
        { tex: '\\frac{120}{1200} = 0.10', text: 'Find the overall sampling fraction: 120 of 1,200 is 0.10, or 10%. Proportional sampling uses the same fraction in every grade, so each grade appears as it does in the school.' },
        { tex: '0.10 \\times 400 = 40,\\quad 0.10 \\times 300 = 30', text: 'Apply 10% to the ninth and tenth graders: 0.10 × 400 = 40 ninth graders and 0.10 × 300 = 30 tenth graders.' },
        { tex: '0.10 \\times 300 = 30,\\quad 0.10 \\times 200 = 20', text: 'Apply 10% to the eleventh and twelfth graders: 0.10 × 300 = 30 eleventh graders and 0.10 × 200 = 20 twelfth graders.' },
        { tex: '40 + 30 + 30 + 20 = 120', text: 'Check the total: the grade samples must add to the 120 we wanted, and they do. Each group is then chosen by an SRS within its own grade.' },
      ],
      answer: '40,\\ 30,\\ 30,\\ 20',
    },
  },
  {
    kind: 'summary',
    head: 'Random selection is the whole game',
    body: 'A statistic from the sample estimates a parameter of the population. An SRS gives every group of n the same chance; stratified, cluster and systematic designs use randomness differently. Bias is a design flaw that no sample size can cure, and only random selection lets the sample speak for the population.',
    table: {
      head: ['design', 'how it chooses', 'example here'],
      rows: [['SRS', 'labels + random digits, skip big and repeats', '05, 09, 20, 31, 06 of 40'], ['stratified', 'an SRS from every group', '10 from each grade'], ['cluster', 'whole groups at random', '3 homerooms, everyone in them'], ['systematic', 'random start, every kth', 'every 10th shopper from 7']],
    },
  },
];

// ---------------- STAT-6 — Experiments vs observational studies; randomization, confounding ----------------

/** Breakfast, sleep and grades: the confounder points at both. */
const confoundFig = (() => {
  let b = text(W / 2, 28, 'Which one raised the grades?', { size: 13, fill: VIO });
  b += fades(rect(60, 150, 110, 40, SKY, `${SKY}22`, 2.4, 10), 0.1) + text(115, 175, 'breakfast', { size: 13, fill: SKY });
  b += fades(rect(230, 150, 110, 40, EMR, `${EMR}22`, 2.4, 10), 0.2) + text(285, 175, 'grades', { size: 13, fill: EMR });
  b += fades(rect(145, 56, 110, 40, ROSE, `${ROSE}22`, 2.4, 10), 0.3) + text(200, 81, 'sleep', { size: 13, fill: ROSE });
  b += draws(arrow(170, 96, 122, 148, ROSE, 2.4), 80, 0.5);
  b += draws(arrow(230, 96, 278, 148, ROSE, 2.4), 80, 0.5);
  b += line(172, 170, 226, 170, INK, 2, '6 5', 0.6) + text(200, 162, '?', { size: 14, op: 0.7 });
  b += text(W / 2, 226, 'sleep is tangled with breakfast — a confounder', { size: 12, op: 0.75 });
  return art('Three boxes: breakfast and grades side by side with a dashed question mark between them, and sleep above with arrows pointing to both', b, 'Breakfast eaters also sleep more. Either one could explain the higher grades.');
})();

/** Twenty walkers, two soles each: the matched pairs design, five walkers shown. */
const pairsFig = (() => {
  const order = ['XY', 'YX', 'YX', 'XY', 'YX'];
  let b = text(W / 2, 28, 'Each walker wears both soles; a coin picks the foot', { size: 12, fill: VIO });
  order.forEach((o, i) => {
    const cx = 50 + i * 75;
    b += text(cx - 15, 94, 'L', { size: 9, op: 0.6 }) + text(cx + 15, 94, 'R', { size: 9, op: 0.6 });
    [o[0], o[1]].forEach((m, k) => {
      const x = cx - 30 + k * 32;
      const col = m === 'X' ? SKY : AMB;
      b += fades(rect(x, 104, 28, 28, col, `${col}33`, 2.2, 6), 0.15 * i + 0.1 * k);
      b += text(x + 14, 123, m, { size: 13, fill: col });
    });
    b += text(cx, 156, `walker ${i + 1}`, { size: 10, op: 0.7 });
  });
  b += text(W / 2, 200, 'X = sole material X     Y = sole material Y', { size: 11, op: 0.75 });
  b += text(W / 2, 226, 'compare the two soles within each walker, then average', { size: 11, fill: EMR });
  return art('Five walkers, each with a left and right box marked X or Y in a random order, showing both sole materials worn by every person', b, 'Every walker is a block of two. The left-right assignment is randomized by coin flip.');
})();

const STAT_6: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Who gets what? Let chance decide',
    body: 'Forty tomato plants and two fertilizers: twenty plants get A and twenty get B, chosen by random numbers. Today you will tell an experiment from an observational study, name confounding variables, and design an experiment that can actually prove cause and effect.',
    art: popGrid(40, 10, [1, 4, 6, 7, 10, 12, 15, 16, 19, 21, 22, 25, 28, 29, 31, 34, 35, 38, 39, 40], { title: 'Forty tomato plants, split by chance', note: 'filled = fertilizer A (20), hollow = fertilizer B (20)', caption: 'A random number generator picked the twenty A plants. The rest get B.', alt: 'A grid of forty circles with twenty filled in at random for fertilizer A and twenty hollow for fertilizer B' }),
  },
  {
    kind: 'concept',
    head: 'Observe, or impose?',
    body: 'In an OBSERVATIONAL STUDY you record what people already do. In an EXPERIMENT you IMPOSE a treatment on the subjects and watch the response. Only an experiment can show cause and effect, because only an experiment controls who gets which treatment.',
    why: 'In an observational study the subjects sort themselves into groups, so the groups may differ in many ways besides the one you study. Only when researchers assign the treatment by chance can the groups be made alike, so that any difference in response can be traced to the treatment.',
    compare: {
      cols: [
        { title: 'Observational study', lines: ['subjects choose their own group', 'researchers only record', 'shows association'], tone: 'warn' },
        { title: 'Experiment', lines: ['researchers assign the treatment', 'chance decides who gets what', 'can show cause'], tone: 'ok' },
      ],
      note: 'The test question: did the researchers DECIDE who got the treatment?',
    },
  },
  {
    kind: 'concept',
    head: 'Factors, levels, treatments, response',
    body: 'The EXPLANATORY variable, or FACTOR, is what you change; its LEVELS are the values it takes. The RESPONSE is what you measure. A TREATMENT is one combination of levels: fertilizer A or B crossed with daily or weekly watering makes 2 × 2 = 4 treatments.',
    why: 'A treatment is what is actually done to a subject, so it must name a level of every factor at once. With two fertilizers and two watering schedules, each plant gets one fertilizer and one schedule, which is 2 choices times 2 choices, or 4 different combinations.',
    formula: {
      tex: '\\text{treatments} = (\\text{levels of factor 1}) \\times (\\text{levels of factor 2}) = 2 \\times 2 = 4',
      note: 'Every combination is its own treatment: A-daily, A-weekly, B-daily, B-weekly.',
      parts: [
        { sym: '2', means: 'fertilizer levels: A, B', tone: 'accent' },
        { sym: '\\times\\, 2', means: 'watering levels: daily, weekly', tone: 'ok' },
        { sym: '4', means: 'treatment groups to randomize plants into', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Confounding: two explanations tangled together',
    body: 'A CONFOUNDING variable is tangled up with the explanatory variable, so you cannot tell which one caused the response. Students who eat breakfast may also sleep more. If breakfast eaters earn higher grades, was it the breakfast or the sleep? Breakfast and sleep are confounded.',
    why: 'If two things always change together, the response cannot be credited to either one alone. Breakfast eaters differ in sleep as well, so higher grades could come from either. The two are mixed, and no amount of extra data can separate them. Only the design can.',
    art: confoundFig,
  },
  {
    kind: 'concept',
    head: 'Three principles of good design',
    body: 'COMPARISON: use a control group or several treatments, so there is something to compare against. RANDOM ASSIGNMENT: let chance decide who gets what, which spreads confounders evenly across the groups. REPLICATION: use enough subjects in each group that chance differences average out.',
    why: 'Without a comparison you do not know what would have happened anyway. Random assignment makes groups alike on every variable, even ones nobody thought to measure. Replication matters because a few subjects can differ by luck, but across many subjects the luck evens out.',
    formula: {
      tex: '\\text{compare} \;+\; \\text{randomize} \;+\; \\text{replicate}',
      note: 'Random assignment is what handles confounding: the groups start out alike in sleep, income, everything.',
      parts: [
        { sym: '\\text{compare}', means: 'two or more groups, often one a control', tone: 'accent' },
        { sym: '\\text{randomize}', means: 'chance assigns subjects to treatments', tone: 'ok' },
        { sym: '\\text{replicate}', means: 'many subjects per group — here 20 plants each', tone: 'warn' },
      ],
    },
    art: flow([{ label: 'Comparison: a control or several treatments' }, { label: 'Random assignment: chance makes the groups alike' }, { label: 'Replication: enough subjects in each group' }], { title: 'The three principles, in order', caption: 'An experiment missing any one of these cannot claim cause.' }),
  },
  {
    kind: 'concept',
    head: 'Placebo, blinding, blocking',
    body: 'A PLACEBO is a fake treatment, because people often improve just from taking "something." BLINDING keeps subjects (single-blind) or subjects and evaluators (double-blind) from knowing who got which treatment. BLOCKING groups similar subjects first and randomizes within each block; MATCHED PAIRS is blocking with two.',
    why: 'People who believe they are being treated often feel better, and evaluators who know the groups may rate them differently, so expectations act like a hidden treatment. A placebo gives everyone the same expectation, blinding hides the group from those who judge, and blocking removes a known source of variation before randomizing.',
    compare: {
      cols: [
        { title: 'Placebo + blinding', lines: ['controls expectations', 'subjects and doctors cannot nudge the result'], tone: 'accent' },
        { title: 'Blocking', lines: ['group alike subjects first', 'randomize inside each block', 'removes a known source of variation'], tone: 'ok' },
        { title: 'Matched pairs', lines: ['blocks of two, or one person twice', 'both treatments per pair'], tone: 'warn' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Coffee and heart disease',
    body: 'Researchers look at hospital records and find that people who drink 3+ cups of coffee a day have less heart disease. Is this an experiment or an observational study, and can we conclude coffee prevents heart disease?',
    steps: {
      steps: [
        { text: 'Who decided how much coffee each person drank? The people themselves.' },
        { text: 'So nothing was imposed — the researchers only recorded. Observational.' },
        { text: 'Confounders lurk: exercise, income, age could travel with coffee habits.' },
      ],
      answer: '\\text{observational study — association only}',
    },
  },
  {
    kind: 'example',
    head: 'Design the tomato experiment',
    body: 'You have 40 tomato plants and two fertilizers, A and B. Design a completely randomized experiment to compare them.',
    steps: {
      steps: [
        { tex: '1, 2, \\ldots, 40', text: 'Label every plant 1 to 40 so that each one can be selected by its number. Labels let a random number generator do the assigning, with no one choosing by hand.' },
        { tex: '20 \\to A,\\quad 20 \\to B', text: 'Use a random number generator to pick 20 different labels for fertilizer A, and give the other 20 plants fertilizer B. Chance, not the experimenter, decides, which balances confounders across groups.' },
        { text: 'Keep light, water and soil the same for every plant. Then the fertilizer is the only systematic difference between the groups, so any difference in growth can be credited to it.' },
        { tex: '\\bar{x}_A \\text{ vs } \\bar{x}_B', text: 'After 8 weeks, measure each plant\'s height and compare the two mean heights. Comparing the groups is what shows the effect of one fertilizer against the other.' },
      ],
      answer: '\\text{randomize, control conditions, compare means}',
    },
    art: flow([{ label: 'Number the plants 1 to 40' }, { label: 'Random numbers: 20 get A, the other 20 get B' }, { label: 'Same light, water and soil for all' }, { label: 'After 8 weeks, compare the mean heights' }], { title: 'A completely randomized design', caption: 'Say HOW you randomize — "a random number generator" — not just that you did.' }),
  },
  {
    kind: 'example',
    head: 'Two factors, four treatments',
    body: 'An experiment tests fertilizer type (A, B) and watering (daily, weekly) on plant growth. Name the factors and the response, and count the treatments.',
    steps: {
      steps: [
        { text: 'Factors are what the researchers change. Fertilizer type has 2 levels, A and B, and the watering schedule has 2 levels, daily and weekly.' },
        { text: 'The response is what is measured to see the effect: plant growth, such as the height gained. It is not something the researchers set.' },
        { tex: '2 \\times 2 = 4', text: 'A treatment is one combination of levels, one from each factor, so count treatments by multiplying the numbers of levels: 2 × 2 = 4.' },
        { text: 'List them to check: A-daily, A-weekly, B-daily and B-weekly. With 40 plants, randomly assign 10 plants to each of the four treatments so the groups are equal in size.' },
      ],
      answer: '2 \\text{ factors, } 4 \\text{ treatments}',
    },
    table: {
      head: ['', 'daily watering', 'weekly watering'],
      rows: [['fertilizer A', 'A-daily', 'A-weekly'], ['fertilizer B', 'B-daily', 'B-weekly']],
      note: 'Each cell is a treatment. With 40 plants, randomize 10 into each cell.',
    },
  },
  {
    kind: 'example',
    head: 'Breakfast and grades: find the confounder',
    body: 'A study finds students who eat breakfast earn higher grades. Name a possible confounding variable and explain how it could be the real cause.',
    steps: {
      steps: [
        { text: 'This is an observational study: students chose for themselves whether to eat breakfast. Because the groups chose themselves, they may differ in other ways too.' },
        { text: 'Pick a variable that differs between the groups: breakfast eaters may also sleep more hours, or have more support at home.' },
        { text: 'Check that it also affects the response: more sleep helps students concentrate, so it tends to raise grades on its own.' },
        { text: 'Because sleep goes along with breakfast and also affects grades, the two effects are mixed up. We cannot tell which one raised the grades, which makes sleep a confounder.' },
      ],
      answer: '\\text{sleep: differs between groups and affects grades}',
    },
    compare: {
      cols: [
        { title: 'Explanatory', lines: ['eats breakfast or not', 'chosen by the student'], tone: 'accent' },
        { title: 'Confounder', lines: ['hours of sleep (or home support)', 'differs between the two groups', 'also affects grades'], tone: 'bad' },
      ],
      note: 'A confounder must do two things: differ between the groups AND affect the response.',
    },
  },
  {
    kind: 'example',
    head: 'Another way: block before you randomize',
    body: 'Suppose half the 40 tomato plants sit on a sunny bench and half on a shady one. Instead of hoping chance balances the sunlight, block on it. How do you randomize?',
    steps: {
      steps: [
        { tex: '\\text{block 1: sunny (20)},\\quad \\text{block 2: shady (20)}', text: 'Group the plants by the bench they sit on, since sunlight is a known source of variation. The sunny plants form one block and the shady plants form another.' },
        { tex: '10 \\to A,\\ 10 \\to B \\text{ in each block}', text: 'Within each block, randomly assign 10 plants to A and 10 to B. Randomizing inside blocks keeps both fertilizers equally represented in sun and shade.' },
        { tex: '\\bar{x}_A - \\bar{x}_B \\text{ per bench}', text: 'Compare A with B within each bench first, then combine. Each comparison is made under equal light, so bench-to-bench differences cannot pass for a fertilizer effect.' },
      ],
      answer: '\\text{randomized block design}',
    },
    art: popGrid(40, 10, [2, 3, 6, 9, 11, 13, 14, 17, 18, 20, 21, 24, 25, 28, 30, 32, 33, 36, 37, 39], { rowLabels: ['sunny', 'sunny', 'shady', 'shady'], title: 'Blocked by bench, randomized inside each', note: 'filled = A: 10 on each bench; hollow = B', caption: 'Ten A plants and ten B plants on the sunny bench, and the same on the shady bench.', alt: 'Four rows of ten circles, the top two rows labelled sunny and the bottom two shady, with ten filled circles in each pair of rows' }),
  },
  {
    kind: 'example',
    head: 'A sugar pill and a blindfold',
    body: 'A company tests a new headache pill. Why give half the subjects a sugar pill, and why keep both the subjects and the doctors from knowing who got which?',
    steps: {
      steps: [
        { text: 'Placebo control: measures how much improvement comes from expectation alone.' },
        { text: 'Blind the subjects: hoping the pill works can itself reduce reported pain.' },
        { text: 'Blind the doctors too: an evaluator who knows the group may rate pain differently.' },
      ],
      answer: '\\text{placebo control, double-blind}',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: one walker, two soles',
    body: 'A shoe company compares two sole materials for wear. Each of 20 volunteers wears material X on one foot and Y on the other, the foot chosen by coin flip. Name the design and say why it beats giving 10 people each material.',
    steps: {
      steps: [
        { text: 'Picture one walker: both feet take the same steps over the same ground, so the two soles face exactly the same conditions. Differences in walking habits are removed by the design.' },
        { text: 'Each person is a block of two measurements and both treatments are given to every pair, so this is a matched pairs design.' },
        { text: 'Flip a coin for each walker to decide which foot gets X. Random assignment inside each pair stops a left-foot or right-foot habit from being mistaken for a material effect.' },
        { text: 'Compare the wear of X and Y within each walker, then average the differences. People vary widely in how hard they walk, and pairing cancels that variation, so this beats giving 10 people each material.' },
      ],
      answer: '\\text{matched pairs design}',
    },
    art: pairsFig,
  },
  {
    kind: 'protip',
    head: 'Describe a design in three labelled boxes',
    body: 'When a question says "describe an experiment," graders look for three things: how subjects were randomly assigned (say the method), what each group received, and what response was measured and compared. A quick diagram with those three boxes earns the points faster than a paragraph.',
    art: flow([{ label: 'Random assignment — say how: numbers, generator, coin' }, { label: 'Group 1: treatment A · Group 2: treatment B or placebo' }, { label: 'Measure the response and compare the groups' }], { title: 'The three-box diagram', caption: 'Add "double-blind" or "blocked by ___" when the situation calls for it.' }),
  },
  {
    kind: 'trap',
    head: 'Trap: random sampling vs random assignment',
    body: 'Random SAMPLING chooses who is in the study; random ASSIGNMENT decides who gets which treatment. They do different jobs. Sampling lets you generalize to the population; assignment lets you claim cause. An experiment on volunteers with random assignment can prove cause for those volunteers — but not generalize to everyone.',
    compare: {
      cols: [
        { title: 'Random sampling', lines: ['who gets INTO the study', 'buys: generalize to population'], tone: 'accent' },
        { title: 'Random assignment', lines: ['who gets WHICH treatment', 'buys: cause and effect'], tone: 'ok' },
      ],
      note: 'An experiment without random assignment still proves nothing, however large.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: "they signed up, so it worked"',
    body: 'Students who sign up for tutoring score higher than those who do not. That is not evidence tutoring works: the students chose tutoring themselves, and the motivated ones are the ones who sign up. Motivation is confounded with tutoring. Only random assignment to tutoring or no tutoring could settle it.',
    compare: {
      cols: [
        { title: 'Self-selected', lines: ['students chose tutoring', 'motivation rides along', 'cannot conclude cause'], tone: 'bad' },
        { title: 'Randomly assigned', lines: ['a coin picks who is tutored', 'motivation balanced across groups', 'can conclude cause'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: three fertilizers, two schedules, two benches',
    body: 'An experiment uses 3 fertilizers and 2 watering schedules on 60 plants, blocked by two benches of 30. How many treatments, how many plants per treatment, and how many per treatment on each bench?',
    steps: {
      steps: [
        { tex: '3 \\times 2 = 6', text: 'Treatments are all the combinations of one level from each factor, so multiply: 3 fertilizers times 2 schedules makes 6 treatments.' },
        { tex: '60 \\div 6 = 10', text: 'Divide the 60 plants equally among the 6 treatments, so each treatment gets 60 ÷ 6 = 10 plants. Equal groups make for fair comparisons.' },
        { tex: '30 \\div 6 = 5', text: 'Blocking repeats the design on each bench. A bench has 30 plants shared among 6 treatments, so each treatment gets 30 ÷ 6 = 5 plants on that bench.' },
        { tex: '5 \\times 2 = 10', text: 'Check: 5 plants per treatment on each of 2 benches gives 5 × 2 = 10 plants per treatment, which matches the overall figure.' },
      ],
      answer: '6;\\ 10;\\ 5',
    },
    formula: {
      tex: '3 \\times 2 = 6 \\text{ treatments},\\qquad \\frac{60}{6} = 10 \\text{ per treatment},\\qquad \\frac{30}{6} = 5 \\text{ per treatment per bench}',
      note: 'Blocking does not change the number of treatments — it repeats the whole design inside every block.',
      parts: [
        { sym: '6', means: 'every fertilizer with every schedule', tone: 'accent' },
        { sym: '5', means: 'plants in each of the 6 cells on each bench', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'summary',
    head: 'Impose, randomize, compare',
    body: 'An experiment imposes treatments; an observational study only records. Treatments are every combination of factor levels. Random assignment spreads confounders evenly, a control group gives a comparison, and replication tames chance. Placebos and blinding control expectations; blocking and matched pairs remove known variation.',
    table: {
      head: ['idea', 'what it does', 'example here'],
      rows: [['random assignment', 'balances confounders across groups', '20 plants to A, 20 to B by random numbers'], ['control / placebo', 'something to compare against', 'the sugar pill'], ['double-blind', 'nobody\'s expectations nudge the result', 'headache pill trial'], ['blocking / matched pairs', 'removes known variation', 'benches; one walker, two soles']],
    },
  },
];

// ---------------- STAT-7 — Probability rules, conditional probability and independence ----------------
const STAT_7: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'The rules that combine chances',
    body: 'Roll two dice: 11 of the 36 equally likely outcomes show at least one six. Today you will combine events with the complement, addition and multiplication rules, read a conditional probability off a table or a tree, and test whether two events are independent.',
    art: diceGrid((a, b) => a === 6 || b === 6, { title: 'At least one six: 11 of the 36 rolls', caption: 'The last row and the last column hold every roll with a six; the corner is counted once.', alt: 'A six by six grid of the outcomes of two dice with the eleven cells showing at least one six shaded' }),
  },
  {
    kind: 'concept',
    head: 'Sample space and the complement rule',
    body: 'A probability is a number from 0 to 1, and the probabilities of all the outcomes in the SAMPLE SPACE add to 1. The COMPLEMENT of A is "not A", so P(not A) = 1 − P(A). "At least one" problems are almost always easiest through the complement, "none."',
    why: 'Exactly one of A happens or A does not happen on every trial, so their probabilities use up the whole total of 1. That makes 1 − P(A) the quickest route when A is complicated: at least one six has many cases to count, but no sixes has just one.',
    formula: {
      tex: 'P(A^{c}) = 1 - P(A)',
      note: '"At least one six" is the complement of "no sixes": 1 − 25/36 = 11/36.',
      parts: [
        { sym: 'A^{c}', means: 'the complement — everything that is not A', tone: 'accent' },
        { sym: '1', means: 'the whole sample space', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The addition rule',
    body: 'P(A or B) = P(A) + P(B) − P(A and B). The overlap gets added twice when you add P(A) and P(B), so subtract it once. If A and B are MUTUALLY EXCLUSIVE — they cannot both happen — the overlap is 0 and the rule is just P(A) + P(B).',
    why: 'In the Venn picture, P(A) counts everything in circle A and P(B) counts everything in circle B, so the overlap lies in both circles and gets counted twice. Subtracting P(A and B) once leaves every outcome counted exactly once. Check: 55 + 50 = 105 students, minus 30 gives 75.',
    formula: {
      tex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
      note: 'Read ∪ as "or" and ∩ as "and." Draw the two circles and the subtraction explains itself.',
      parts: [
        { sym: 'A \\cup B', means: 'in A, in B, or in both', tone: 'accent' },
        { sym: 'A \\cap B', means: 'in both — the overlap, counted twice without the minus', tone: 'warn' },
      ],
    },
    art: vennFig({ A: 'A', B: 'B', onlyA: 'A only', both: 'A and B', onlyB: 'B only', neither: 'neither', title: 'P(A or B) covers three regions', caption: 'Adding P(A) and P(B) counts the middle twice. Subtract it once.', alt: 'Two overlapping circles labelled A and B with the regions A only, A and B, and B only, and the word neither outside' }),
  },
  {
    kind: 'concept',
    head: 'Conditional probability',
    body: 'P(A | B) is the chance of A once you know B happened: P(A | B) = P(A and B) / P(B). Knowing B shrinks the world to the B outcomes, so B goes in the denominator. In a two-way table, "given B" means stay inside the B row or column.',
    why: 'Once you know B happened, outcomes outside B are impossible, so B becomes the whole world and should have probability 1. Dividing P(A and B) by P(B) rescales B up to 1. In the sport and music table, that is 30 of the 55 athletes.',
    formula: {
      tex: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}',
      note: 'The vertical bar reads "given." The event after it is the new whole.',
      parts: [
        { sym: 'A \\mid B', means: 'A, given that B happened', tone: 'accent' },
        { sym: 'P(B)', means: 'the denominator — the condition shrinks the sample space to B', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The multiplication rule and trees',
    body: 'P(A and B) = P(A) · P(B | A): the chance of the first thing, times the chance of the second given the first. A tree diagram does exactly this — multiply along a branch for "and," then add the branches that fit the event for "or."',
    why: 'To get both A and B, A must happen first and then B must happen in the world where A happened. A branch of a tree does exactly this: the first fraction is the share of cases that go down it and the second is the share of those that continue. A share of a share is multiplication, so (3/5)(2/4) = 3/10.',
    formula: {
      tex: 'P(A \\cap B) = P(A)\\, P(B \\mid A)',
      note: 'Along a branch, multiply. Across branches, add.',
      parts: [
        { sym: 'P(A)', means: 'the first stage of the tree', tone: 'accent' },
        { sym: 'P(B \\mid A)', means: 'the second stage, knowing how the first came out', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Independence',
    body: 'A and B are INDEPENDENT when knowing one changes nothing about the other: P(A | B) = P(A), which is the same as P(A and B) = P(A)·P(B). Drawing with replacement keeps draws independent; drawing without replacement does not. Mutually exclusive events with positive probability are never independent.',
    why: 'Independent means learning that B happened leaves the chance of A unchanged, P(A | B) = P(A). Putting that into the multiplication rule gives P(A and B) = P(A)P(B). Mutually exclusive events are the opposite, since if B happens then A is impossible, so knowing B changes the chance of A to 0.',
    compare: {
      cols: [
        { title: 'Independent', lines: ['P(A | B) = P(A)', 'P(A and B) = P(A)·P(B)', 'knowing B tells you nothing'], tone: 'ok' },
        { title: 'Mutually exclusive', lines: ['P(A and B) = 0', 'knowing B rules A out', 'the opposite of independent'], tone: 'bad' },
      ],
      note: 'Test independence with numbers, never with a feeling.',
    },
  },
  {
    kind: 'example',
    head: 'At least one six on two dice',
    body: 'Two dice are rolled. What is the probability of at least one six? Think about which event is easier to count.',
    steps: {
      steps: [
        { tex: 'P(\\text{no six on one die}) = \\tfrac{5}{6}', text: 'The complement of at least one six is no sixes, which is easier because it is a single case. Start with one die: five faces out of six are not a six, so the chance is 5/6.' },
        { tex: 'P(\\text{no sixes}) = \\tfrac{5}{6} \\cdot \\tfrac{5}{6} = \\tfrac{25}{36}', text: 'The two dice do not affect each other, so the events are independent and probabilities multiply. No six on both dice has probability 5/6 times 5/6, which is 25/36.' },
        { tex: '1 - \\tfrac{25}{36} = \\tfrac{11}{36}', text: 'Apply the complement rule, P(A) = 1 − P(not A), because at least one six and no sixes together make up every outcome. This gives 11/36, about 0.306.' },
      ],
      answer: '\\tfrac{11}{36} \\approx 0.306',
    },
  },
  {
    kind: 'example',
    head: 'Sport or music?',
    body: 'Of 100 students, 55 play a sport, 50 play music, and 30 do both. Find P(sport or music).',
    steps: {
      steps: [
        { tex: 'P(S) = 0.55,\\ P(M) = 0.50,\\ P(S \\cap M) = 0.30', text: 'Turn the counts into probabilities by dividing each by 100: P(S) = 0.55, P(M) = 0.50 and P(S and M) = 0.30.' },
        { tex: '0.55 + 0.50 - 0.30', text: 'Add P(S) and P(M), then subtract the overlap. The 30 students who do both are in both counts, so they were counted twice, and the addition rule takes them out once.' },
        { tex: '= 0.75', text: 'The arithmetic gives 0.75. Check with the Venn diagram: 25 sport only plus 30 both plus 20 music only makes 75 of the 100 students who play at least one.' },
      ],
      answer: '0.75',
    },
    art: vennFig({ A: 'sport', B: 'music', onlyA: '25', both: '30', onlyB: '20', neither: 'neither 25', title: '100 students: sport, music, or both', caption: 'Sport only 25, both 30, music only 20: that is 75 in the circles and 25 outside.', alt: 'Two overlapping circles labelled sport and music with 25 in sport only, 30 in the overlap, 20 in music only and 25 outside' }),
  },
  {
    kind: 'example',
    head: 'Given a sport, how likely is music?',
    body: 'Same 100 students. Given that a student plays a sport, what is the probability they also play music?',
    steps: {
      steps: [
        { tex: 'P(M \\mid S) = \\frac{P(M \\cap S)}{P(S)}', text: 'The word given tells us to restrict to the sport players, so the formula divides by the probability of the condition: P(M | S) = P(M and S) / P(S).' },
        { tex: '= \\frac{0.30}{0.55} = \\frac{30}{55}', text: 'Substitute the values from before: 0.30 over 0.55. Multiplying top and bottom by 100 turns it into a count: 30 of the 55 athletes.' },
        { tex: '\\approx 0.545', text: 'Divide: 30 ÷ 55 ≈ 0.545, a bit more than half. The condition shrank the world to the 55 students in the sport circle.' },
      ],
      answer: '\\tfrac{30}{55} \\approx 0.545',
    },
  },
  {
    kind: 'example',
    head: 'Are sport and music independent?',
    body: 'Are playing a sport and playing music independent for these 100 students? Compare P(M | S) with P(M) to decide.',
    steps: {
      steps: [
        { text: 'Independence means knowing one event does not change the chance of the other, so the test is whether P(M | S) equals P(M).' },
        { tex: 'P(M \\mid S) = \\frac{30}{55} \\approx 0.545', text: 'From the previous example, the probability of music given sport is 30 ÷ 55 ≈ 0.545, found by restricting to the 55 athletes.' },
        { tex: 'P(M) = \\frac{50}{100} = 0.50', text: 'Compare with the overall probability of music, 50 ÷ 100 = 0.50, which uses all 100 students.' },
        { tex: '0.545 \\ne 0.50', text: 'The numbers differ, so knowing a student plays a sport does change the chance they play music. Equivalently, P(S)·P(M) = 0.275 but P(S and M) = 0.30.' },
      ],
      answer: '\\text{not independent: } 0.545 \\ne 0.50',
    },
    compare: {
      cols: [
        { title: 'If independent', tex: 'P(M \\mid S) = P(M) = 0.50', lines: ['knowing sport changes nothing'], tone: 'plain' },
        { title: 'Actually', tex: 'P(M \\mid S) \\approx 0.545', lines: ['0.545 ≠ 0.50', 'not independent'], tone: 'warn' },
      ],
      note: 'Or compare P(S)·P(M) = 0.275 with P(S and M) = 0.30. Either test, same verdict.',
    },
  },
  {
    kind: 'example',
    head: 'Marbles without replacement',
    body: 'A bag has 3 red and 2 blue marbles. Two are drawn without replacement. Find P(both red) and P(one of each color).',
    steps: {
      steps: [
        { tex: 'P(RR) = \\tfrac{3}{5} \\cdot \\tfrac{2}{4} = \\tfrac{6}{20} = \\tfrac{3}{10}', text: 'For red-red, multiply along the branch. The first draw is red with probability 3/5. With one red gone, 2 reds remain among 4 marbles, so the second is red with probability 2/4.' },
        { tex: 'P(RB) = \\tfrac{3}{5} \\cdot \\tfrac{2}{4} = \\tfrac{6}{20},\\quad P(BR) = \\tfrac{2}{5} \\cdot \\tfrac{3}{4} = \\tfrac{6}{20}', text: 'One of each can happen two ways: red then blue, or blue then red. Each is a branch multiplied the same way, and the second-draw fractions change because one marble is gone.' },
        { tex: '\\tfrac{6}{20} + \\tfrac{6}{20} = \\tfrac{12}{20} = \\tfrac{3}{5}', text: 'The two orders are different branches that cannot both occur, so add them. We multiply along branches and add across branches.' },
        { tex: 'P(BB) = \\tfrac{2}{5} \\cdot \\tfrac{1}{4} = \\tfrac{2}{20},\\quad \\tfrac{6 + 6 + 6 + 2}{20} = 1', text: 'Check: blue-blue is 2/5 times 1/4 = 2/20, and all four branches add to 20/20 = 1, so they account for every possible outcome.' },
      ],
      answer: 'P(RR) = \\tfrac{3}{10},\\quad P(\\text{one each}) = \\tfrac{3}{5}',
    },
    art: treeFig({ first: ['R 3/5', 'B 2/5'], second: [['R 2/4', 'B 2/4'], ['R 3/4', 'B 1/4']], ends: ['RR: 6/20', 'RB: 6/20', 'BR: 6/20', 'BB: 2/20'], hot: [1, 2], title: '3 red, 2 blue, two draws, no replacement', caption: 'The second-draw fractions have 4 on the bottom: one marble is gone. The two highlighted branches are "one of each."', alt: 'A tree diagram with first draw red 3/5 or blue 2/5, second draw fractions out of 4, and the four end products 6/20, 6/20, 6/20 and 2/20' }),
  },
  {
    kind: 'example',
    head: 'Another way: count equally likely pairs',
    body: 'Forget the order and count PAIRS of marbles instead. Five marbles make equally likely pairs; count the ones that fit each event.',
    steps: {
      steps: [
        { tex: '\\binom{5}{2} = 10', text: 'If two marbles are drawn at random, every pair of marbles is equally likely. The number of pairs from 5 marbles is 5 choose 2, which is 10, so 10 goes on the bottom.' },
        { tex: '\\binom{3}{2} = 3 \\Rightarrow P(RR) = \\tfrac{3}{10}', text: 'Red-red pairs: choose 2 of the 3 reds, which is 3 choose 2 = 3 ways. So P(RR) = 3/10, the same answer as the tree.' },
        { tex: '3 \\times 2 = 6 \\Rightarrow P(\\text{one each}) = \\tfrac{6}{10} = \\tfrac{3}{5}', text: 'One of each: pair any of the 3 reds with any of the 2 blues, which is 3 × 2 = 6 pairs. So P(one of each) = 6/10 = 3/5.' },
        { tex: '\\binom{2}{2} = 1 \\Rightarrow P(BB) = \\tfrac{1}{10}', text: 'Blue-blue has only 1 pair, so its probability is 1/10. The counts 3 + 6 + 1 make all 10 pairs. Counting pairs avoids multiplying changing fractions.' },
      ],
      answer: '\\tfrac{3}{10},\\ \\tfrac{3}{5},\\ \\tfrac{1}{10}',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: a positive test',
    body: '10% of people have a condition. The test is positive for 90% of people who have it and for 20% of people who do not. A random person tests positive. Draw the tree before you compute, then find the chance they have the condition.',
    steps: {
      steps: [
        { tex: 'P(\\text{have} \\cap +) = 0.10 \\times 0.90 = 0.09', text: 'Follow the branch have it, then test positive, and multiply: 0.10 × 0.90 = 0.09. The multiplication rule says P(A and B) = P(A)·P(B | A).' },
        { tex: 'P(\\text{not} \\cap +) = 0.90 \\times 0.20 = 0.18', text: 'Follow not have it, then test positive, the false positives: 0.90 × 0.20 = 0.18. This branch is bigger because 90% of people are healthy, so a 20% false-alarm rate hits many people.' },
        { tex: 'P(+) = 0.09 + 0.18 = 0.27', text: 'A positive test can arrive by either branch, and the branches cannot both happen, so add them. The probability of a positive test is 0.27.' },
        { tex: 'P(\\text{have} \\mid +) = \\frac{0.09}{0.27} = \\frac{1}{3}', text: 'For have it given positive, the positive branches are the new whole, so divide: 0.09 ÷ 0.27 = 1/3. Most positives are false positives because the condition is rare.' },
      ],
      answer: '\\tfrac{1}{3} \\approx 0.333',
    },
    art: treeFig({ first: ['have 0.10', 'not 0.90'], second: [['+ 0.90', '− 0.10'], ['+ 0.20', '− 0.80']], ends: ['have, +: 0.09', 'have, −: 0.01', 'not, +: 0.18', 'not, −: 0.72'], hot: [0, 2], title: 'Positive tests come from two branches', caption: 'Of the 0.27 who test positive, only 0.09 have the condition: one third.', alt: 'A tree diagram: have 0.10 or not 0.90, then positive or negative, with the two positive branches 0.09 and 0.18 highlighted' }),
  },
  {
    kind: 'protip',
    head: 'Table for "given," tree for "then"',
    body: 'When a problem hands you counts in groups — sport, music, both — build a two-way table or Venn diagram and read conditionals by staying in one row. When a problem happens in stages — draw, then draw again; have it, then test — build a tree and multiply along the branches.',
    art: flow([{ label: 'Counts in categories? → two-way table or Venn' }, { label: 'Stages, one after another? → tree diagram' }, { label: '"Given": shrink to that row, column or branch set' }, { label: '"At least one": go through the complement' }], { title: 'Pick the picture that fits the problem', caption: 'The picture chooses the formula for you.' }),
  },
  {
    kind: 'trap',
    head: 'Trap: mutually exclusive means independent',
    body: 'It is the opposite. Disjoint events cannot both happen, so knowing one happened changes the other\'s probability to 0 — the strongest dependence there is. Rolling a 2 and rolling a 5 on one die are mutually exclusive, and P(2 | 5) = 0, not 1/6.',
    compare: {
      cols: [
        { title: 'Mutually exclusive', tex: 'P(A \\cap B) = 0', lines: ['one happening kills the other', 'P(A | B) = 0 ≠ P(A)'], tone: 'bad' },
        { title: 'Independent', tex: 'P(A \\cap B) = P(A)P(B)', lines: ['one happening changes nothing', 'overlap is NOT zero (unless P = 0)'], tone: 'ok' },
      ],
      note: 'Events with positive probability cannot be both disjoint and independent.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: P(A | B) is not P(B | A)',
    body: 'P(positive | have) = 0.90 and P(have | positive) = 1/3 — very different numbers. The event after the bar is the denominator, the new whole. "Of the people who tested positive" and "of the people who have it" are different groups, so they give different fractions.',
    compare: {
      cols: [
        { title: 'P(+ | have) = 0.90', lines: ['whole = people who have it', 'how good the test is at catching it'], tone: 'accent' },
        { title: 'P(have | +) = 1/3', lines: ['whole = people who tested positive', 'what a positive result actually means'], tone: 'warn' },
      ],
      note: 'Ask: who is the "of" group? That group goes on the bottom.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: at least one six in three rolls',
    body: 'Roll a die three times. What is the probability of at least one six? Use the complement.',
    steps: {
      steps: [
        { tex: 'P(\\text{no six}) = \\left(\\tfrac{5}{6}\\right)^{3} = \\tfrac{125}{216}', text: 'The complement of at least one six is no six in all three rolls. The rolls are independent, so multiply 5/6 three times to get 125/216.' },
        { tex: '1 - \\tfrac{125}{216} = \\tfrac{91}{216}', text: 'Subtract from 1 using the complement rule, since the two events together cover every outcome: 1 − 125/216 = 91/216.' },
        { tex: '\\approx 0.421', text: 'Convert to a decimal for comparison: 91 ÷ 216 ≈ 0.421, up from 11/36 ≈ 0.306 with two dice. More rolls give more chances to see a six.' },
      ],
      answer: '\\tfrac{91}{216} \\approx 0.421',
    },
  },
  {
    kind: 'summary',
    head: 'Four rules, two pictures',
    body: 'Complement: P(not A) = 1 − P(A). Addition: P(A or B) = P(A) + P(B) − P(A and B). Conditional: P(A | B) = P(A and B)/P(B). Multiplication: P(A and B) = P(A)·P(B | A). Independence means P(A | B) = P(A). Tables and Venn diagrams handle categories; trees handle stages.',
    table: {
      head: ['rule', 'formula', 'used here'],
      rows: [['complement', 'P(not A) = 1 − P(A)', '1 − 25/36 = 11/36'], ['addition', 'P(A) + P(B) − P(A and B)', '0.55 + 0.50 − 0.30 = 0.75'], ['conditional', 'P(A and B) / P(B)', '0.30 / 0.55 ≈ 0.545'], ['multiplication', 'P(A) · P(B | A)', '3/5 × 2/4 = 3/10'], ['independence', 'P(A | B) = P(A)', '0.545 ≠ 0.50 → not independent']],
    },
  },
];

export const STAT_SLIDES_U01_07: SlideBank = {
  'STAT-1': STAT_1,
  'STAT-2': STAT_2,
  'STAT-3': STAT_3,
  'STAT-4': STAT_4,
  'STAT-5': STAT_5,
  'STAT-6': STAT_6,
  'STAT-7': STAT_7,
};
