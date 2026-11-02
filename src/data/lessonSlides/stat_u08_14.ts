import type { SlideArt, SlideBank } from './types';
import type { Range } from '../slideArt';
import {
  AMB, EMR, INK, ROSE, SKY, VIO, W, H,
  arrow, art, axes, balancePoint, bars, dot, dotPlot, draws, fades, flow, line, numberLine, path, polygon, rect, rightTriangle, slides, text,
} from '../slideArt';

// AP Statistics slide decks, units 8-14: random variables, binomial and
// geometric distributions, sampling distributions and the CLT, confidence
// intervals, significance tests, two-sample and chi-square tests, and
// inference for regression. Every number here matches the lesson in
// src/data/stat/lessons_u08_14.ts, so deck and lesson teach the same unit.

const rd = (n: number) => Math.round(n * 10) / 10;
const fmt2 = (v: number) => (Math.round(v * 100) / 100).toFixed(2);
const fmt3 = (v: number) => (Math.round(v * 1000) / 1000).toFixed(3);
const plain = (v: number) => String(Math.round(v * 100) / 100);

// ── the figures statistics is drawn with ───────────────────────────────────

/**
 * A normal curve centred at mu with standard deviation sd, with tails or a
 * middle band shaded. Tick marks sit at mu, mu ± sd and mu ± 2sd. Marks are
 * dashed verticals with a label at the top; labels float over a shaded area.
 */
function bell(
  mu: number,
  sd: number,
  o: {
    alt: string;
    title?: string;
    caption?: string;
    shade?: [number, number][];
    marks?: { at: number; label: string }[];
    labels?: { text: string; at: number; y?: number }[];
    fmt?: (v: number) => string;
    span?: number;
    color?: string;
  },
): SlideArt {
  const span = o.span ?? 3.6;
  const lo = mu - span * sd, hi = mu + span * sd;
  const L = 34, R = 18, B = 34, top = 44;
  const X = (v: number) => L + ((v - lo) / (hi - lo)) * (W - L - R);
  const Y = (p: number) => H - B - (p * (H - B - top)) / 1.2;
  const pdf = (x: number) => Math.exp(-0.5 * ((x - mu) / sd) ** 2);
  const fmt = o.fmt ?? plain;
  const col = o.color ?? SKY;
  let b = o.title ? text(W / 2, 24, o.title, { size: 13, fill: VIO }) : '';
  b += arrow(L - 8, Y(0), W - R + 8, Y(0), INK, 1.8);
  for (let k = -2; k <= 2; k++) {
    const v = mu + k * sd;
    b += line(X(v), Y(0) - 4, X(v), Y(0) + 4, INK, 1.6, undefined, 0.6);
    b += text(X(v), Y(0) + 18, fmt(v), { size: 11, op: 0.7 });
  }
  for (const [a0, z0] of o.shade ?? []) {
    const a = Math.max(lo, a0), z = Math.min(hi, z0);
    const pts: [number, number][] = [[X(a), Y(0)]];
    for (let i = 0; i <= 40; i++) {
      const x = a + ((z - a) * i) / 40;
      pts.push([X(x), Y(pdf(x))]);
    }
    pts.push([X(z), Y(0)]);
    b += fades(polygon(pts, col, `${col}55`, 1.4), 0.3);
  }
  const d: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const x = lo + ((hi - lo) * i) / 160;
    d.push(`${i ? 'L' : 'M'} ${rd(X(x))} ${rd(Y(pdf(x)))}`);
  }
  b += draws(path(d.join(' '), AMB, 2.8), 800);
  for (const m of o.marks ?? []) {
    b += line(X(m.at), Y(0), X(m.at), 50, ROSE, 1.8, '5 4');
    b += text(X(m.at), 42, m.label, { size: 12, fill: ROSE });
  }
  for (const l of o.labels ?? []) b += text(X(l.at), l.y ?? 120, l.text, { size: 12, fill: col });
  return art(o.alt, b, o.caption);
}

/** A chi-square density for `df` degrees of freedom with its right tail shaded. */
function chiCurve(
  df: number,
  o: {
    alt: string;
    title?: string;
    caption?: string;
    from?: number;
    xMax?: number;
    marks?: { at: number; label: string }[];
    labels?: { text: string; at: number; y?: number }[];
  },
): SlideArt {
  const xMax = o.xMax ?? 16;
  const L = 34, R = 18, B = 34, top = 44;
  const X = (v: number) => L + (v / xMax) * (W - L - R);
  const g = (x: number) => Math.pow(x, df / 2 - 1) * Math.exp(-x / 2);
  const peak = g(Math.max(df - 2, 0.05));
  const Y = (v: number) => H - B - ((g(v) / peak) * (H - B - top)) / 1.2;
  let b = o.title ? text(W / 2, 24, o.title, { size: 13, fill: VIO }) : '';
  b += arrow(L - 8, Y(0), W - R + 8, H - B, INK, 1.8);
  for (let v = 0; v <= xMax; v += 4) {
    b += line(X(v), H - B - 4, X(v), H - B + 4, INK, 1.6, undefined, 0.6);
    b += text(X(v), H - B + 18, String(v), { size: 11, op: 0.7 });
  }
  if (o.from !== undefined) {
    const pts: [number, number][] = [[X(o.from), H - B]];
    for (let i = 0; i <= 40; i++) {
      const x = o.from + ((xMax - o.from) * i) / 40;
      pts.push([X(x), Y(x)]);
    }
    pts.push([X(xMax), H - B]);
    b += fades(polygon(pts, SKY, `${SKY}55`, 1.4), 0.3);
  }
  const d: string[] = [];
  for (let i = 1; i <= 160; i++) {
    const x = (xMax * i) / 160;
    d.push(`${i === 1 ? 'M' : 'L'} ${rd(X(x))} ${rd(Y(x))}`);
  }
  b += draws(path(d.join(' '), AMB, 2.8), 800);
  for (const m of o.marks ?? []) {
    b += line(X(m.at), H - B, X(m.at), 50, ROSE, 1.8, '5 4');
    b += text(X(m.at), 42, m.label, { size: 12, fill: ROSE });
  }
  for (const l of o.labels ?? []) b += text(X(l.at), l.y ?? 120, l.text, { size: 12, fill: SKY });
  return art(o.alt, b, o.caption);
}

/** A probability distribution as bars, each bar labelled with its probability. */
function pmf(
  labels: string[],
  probs: number[],
  o: { alt: string; title?: string; caption?: string; mark?: number[]; fmt?: (p: number) => string; xLabel?: string },
): SlideArt {
  const base = 200, top = 70, x0 = 44, x1 = W - 24;
  const n = probs.length;
  const slot = (x1 - x0) / n;
  const bw = Math.min(44, slot * 0.7);
  const max = Math.max(...probs);
  const fmt = o.fmt ?? fmt3;
  let b = o.title ? text(W / 2, 26, o.title, { size: 13, fill: VIO }) : '';
  b += line(x0, base, x1, base, INK, 1.8, undefined, 0.6);
  probs.forEach((p, i) => {
    const h = ((base - top) * p) / max;
    const cx = x0 + slot * (i + 0.5);
    const col = o.mark?.includes(i) ? ROSE : SKY;
    b += slides(rect(cx - bw / 2, base - h, bw, h, col, `${col}44`, 2, 3), 0, 14, 0.1 + i * 0.06);
    b += text(cx, base - h - 7, fmt(p), { size: 11, fill: col });
    b += text(cx, base + 18, labels[i], { size: 11, op: 0.7 });
  });
  if (o.xLabel) b += text(W / 2, base + 40, o.xLabel, { size: 12, op: 0.7 });
  return art(o.alt, b, o.caption);
}

/** A scatterplot with the least-squares line through it, and one residual drawn if asked. */
function scatterLine(
  pts: { x: number; y: number }[],
  m: number,
  b0: number,
  o: {
    alt: string;
    range: Range;
    ticks: { x: number[]; y: number[] };
    title?: string;
    caption?: string;
    xLabel?: string;
    yLabel?: string;
    lineLabel?: { text: string; x: number; y: number };
    hi?: { x: number; y: number; label: string };
  },
): SlideArt {
  const ax = axes(o.range, { ticks: o.ticks, grid: true, pad: 30, xLabel: o.xLabel, yLabel: o.yLabel });
  let b = (o.title ? text(W / 2, 16, o.title, { size: 12, fill: VIO }) : '') + ax.body;
  b += draws(ax.curve((x) => m * x + b0, AMB, 2.8), 700);
  pts.forEach((p, i) => {
    b += fades(dot(ax.X(p.x), ax.Y(p.y), 5, SKY), 0.1 + i * 0.05);
  });
  if (o.lineLabel) b += text(ax.X(o.lineLabel.x), ax.Y(o.lineLabel.y), o.lineLabel.text, { size: 12, fill: AMB, anchor: 'start' });
  if (o.hi) {
    const yhat = m * o.hi.x + b0;
    b += line(ax.X(o.hi.x), ax.Y(yhat), ax.X(o.hi.x), ax.Y(o.hi.y), ROSE, 2.4);
    b += dot(ax.X(o.hi.x), ax.Y(o.hi.y), 6, ROSE);
    b += text(ax.X(o.hi.x) + 10, ax.Y((yhat + o.hi.y) / 2) + 4, o.hi.label, { size: 11, fill: ROSE, anchor: 'start' });
  }
  return art(o.alt, b, o.caption);
}

/** Several confidence intervals for the same estimate stacked over one scale. */
function intervalStack(
  rows: { label: string; lo: number; hi: number; color: string }[],
  scale: [number, number],
  o: { alt: string; title?: string; caption?: string; center?: { at: number; label: string }; fmt?: (v: number) => string },
): SlideArt {
  const x0 = 80, x1 = W - 30, yAxis = 222;
  const X = (v: number) => x0 + ((v - scale[0]) / (scale[1] - scale[0])) * (x1 - x0);
  const fmt = o.fmt ?? fmt3;
  let b = o.title ? text(W / 2, 24, o.title, { size: 13, fill: VIO }) : '';
  b += arrow(x0 - 14, yAxis, x1 + 12, yAxis, INK, 1.8);
  const step = (scale[1] - scale[0]) / 4;
  for (let i = 0; i <= 4; i++) {
    const v = scale[0] + i * step;
    b += line(X(v), yAxis - 4, X(v), yAxis + 4, INK, 1.4, undefined, 0.55);
    b += text(X(v), yAxis + 18, plain(v), { size: 10, op: 0.65 });
  }
  if (o.center) {
    b += line(X(o.center.at), 56, X(o.center.at), yAxis - 6, ROSE, 1.6, '4 4');
    b += text(X(o.center.at), 48, o.center.label, { size: 12, fill: ROSE });
  }
  rows.forEach((r, i) => {
    const y = 90 + i * 46;
    b += text(x0 - 20, y + 4, r.label, { size: 12, fill: r.color, anchor: 'end' });
    b += draws(line(X(r.lo), y, X(r.hi), y, r.color, 4), X(r.hi) - X(r.lo), 0.1 * i);
    b += line(X(r.lo), y - 8, X(r.lo), y + 8, r.color, 2.4) + line(X(r.hi), y - 8, X(r.hi), y + 8, r.color, 2.4);
    b += text(X(r.lo), y - 13, fmt(r.lo), { size: 11, fill: r.color });
    b += text(X(r.hi), y - 13, fmt(r.hi), { size: 11, fill: r.color });
  });
  return art(o.alt, b, o.caption);
}

/** Twenty intervals from twenty samples laid across the true value: all but one capture it. */
function captureStrips(o: { alt: string; title?: string; caption?: string }): SlideArt {
  const cx = 200, half = 48;
  const offsets = [-12, 20, -30, 8, 36, -22, 4, -40, 26, -6, 62, 14, -18, 30, -34, 10, -26, 40, -2, 18];
  let b = o.title ? text(W / 2, 24, o.title, { size: 13, fill: VIO }) : '';
  b += line(cx, 48, cx, 236, ROSE, 2, '5 4');
  b += text(cx, 42, 'true p', { size: 12, fill: ROSE });
  offsets.forEach((off, i) => {
    const y = 58 + i * 9.2;
    const miss = Math.abs(off) > half;
    const col = miss ? ROSE : SKY;
    b += fades(line(cx + off - half, y, cx + off + half, y, col, 3), 0.05 * i);
    b += fades(dot(cx + off, y, 2.6, col), 0.05 * i);
    if (miss) b += text(cx + off + half + 10, y + 4, 'misses', { size: 11, fill: ROSE, anchor: 'start' });
  });
  return art(o.alt, b, o.caption);
}

export const STAT_SLIDES_U08_14: SlideBank = {
  // ---------------- STAT-8 — Random variables, expected value and variance ----------------
  'STAT-8': [
    {
      kind: 'objective',
      head: 'A number for every outcome',
      body: 'Roll a four-sided die and you get 1, 2, 3 or 4, each with probability 1/4. Today you will find the long-run average of a chance outcome, measure how much it wanders, and combine two chance outcomes into one.',
      art: pmf(['1', '2', '3', '4'], [0.25, 0.25, 0.25, 0.25], {
        alt: 'Four equal bars of height 0.25 over the faces 1, 2, 3 and 4 of a fair four-sided die',
        title: 'A fair four-sided die',
        fmt: fmt2,
        xLabel: 'the roll, X',
        caption: 'Every face is equally likely. The long-run average is 2.5, a value the die never shows.',
      }),
    },
    {
      kind: 'concept',
      head: 'What a random variable is',
      body: 'A random variable X turns each outcome of a chance process into a number. A discrete one comes with a table: every value X can take and its probability. The probabilities must add to exactly 1.',
      why: 'The probabilities must total 1 because exactly one outcome happens every time the process runs, so all the rows together cover the whole certain event. A table that sums to 0.9 or 1.1 describes something impossible. In the cars table, 0.10 + 0.40 + 0.35 + 0.15 = 1.00, so every household lands in exactly one row.',
      table: {
        head: ['cars per household, x', 'P(x)'],
        rows: [['0', '0.10'], ['1', '0.40'], ['2', '0.35'], ['3', '0.15'], ['total', '1.00']],
        mark: 4,
        note: 'Check the total first. If the probabilities do not add to 1, the table is wrong.',
      },
    },
    {
      kind: 'concept',
      head: 'Expected value is a weighted average',
      body: 'The expected value μ is the average you would see over millions of repeats. Multiply every value by its probability and add. It does not have to be a value X can actually take: a die averaging 2.5 never lands on 2.5.',
      why: 'Imagine 100 households from the cars table: about 10 have 0 cars, 40 have 1, 35 have 2 and 15 have 3. That is 0 + 40 + 70 + 45 = 155 cars, or 1.55 per household. Multiplying each value by its probability does the same job as dividing that total by 100, which is why expected value is the average of a huge number of repeats.',
      formula: {
        tex: '\\mu_X = E(X) = \\sum x \\cdot P(x)',
        note: 'Each value, weighted by how often it happens, all added up.',
        parts: [
          { sym: 'x', means: 'one value the variable can take', tone: 'accent' },
          { sym: 'P(x)', means: 'how likely that value is; the weight', tone: 'ok' },
          { sym: '\\mu_X', means: 'the long-run average of X', tone: 'warn' },
        ],
      },
      art: balancePoint([1, 2, 3, 4], 2.5, {
        lo: 0,
        hi: 5,
        title: 'The mean is the balance point',
        alt: 'The values 1, 2, 3 and 4 as equal weights on a beam that balances at 2.5',
        caption: 'Equal weights at 1, 2, 3 and 4 balance exactly at 2.5.',
      }),
    },
    {
      kind: 'concept',
      head: 'Variance and standard deviation',
      body: 'Variance measures spread: take each deviation from the mean, square it, weight it by its probability and add. The standard deviation σ is the square root, so it comes back in the same units as X.',
      why: 'Plain deviations from the mean always cancel out, because the values above the mean balance the values below it. Squaring makes every deviation positive, so far-away values pile up into a real measure of spread and count more than close ones. The square root at the end puts the answer back in the original units, such as cars instead of cars squared.',
      formula: {
        tex: '\\sigma_X^{2} = \\sum (x - \\mu_X)^{2}\\, P(x), \\qquad \\sigma_X = \\sqrt{\\sigma_X^{2}}',
        note: 'Squared distances from the mean, weighted by probability.',
        parts: [
          { sym: '(x - \\mu_X)^{2}', means: 'how far a value sits from the mean, squared', tone: 'accent' },
          { sym: '\\sigma_X^{2}', means: 'the variance, in squared units', tone: 'warn' },
          { sym: '\\sigma_X', means: 'the standard deviation, in the units of X', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Linear change: Y = a + bX',
      body: 'Add a constant and every value shifts, so the mean shifts, but the spread does not move. Multiply by b and both the mean and the standard deviation get multiplied by b (the SD by |b|).',
      why: 'Adding 3 to every value slides the whole picture along the number line without changing how far values sit from each other, so the mean moves and the spread does not. Multiplying by 2.5 stretches every gap by 2.5, so distances from the mean grow by 2.5 too. The variance grows by 2.5 squared, and its root brings the SD to 2.5 times the old one.',
      formula: {
        tex: '\\mu_{a+bX} = a + b\\,\\mu_X, \\qquad \\sigma_{a+bX} = |b|\\,\\sigma_X',
        note: 'The shift a reaches the mean only; the scale b reaches both.',
        parts: [
          { sym: 'a', means: 'shifts the mean; does nothing to the spread', tone: 'accent' },
          { sym: 'b', means: 'scales the mean and the SD', tone: 'ok' },
        ],
      },
      compare: {
        cols: [
          { title: 'Add 3', tex: 'Y = X + 3', lines: ['mean goes up 3', 'SD unchanged'], tone: 'accent' },
          { title: 'Multiply by 2.5', tex: 'Y = 2.5X', lines: ['mean × 2.5', 'SD × 2.5'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Combining two random variables',
      body: 'For X + Y the means add; for X − Y the means subtract. If X and Y are independent, the variances ADD in both cases. Standard deviations never add directly.',
      why: 'Totals add, so the average of a total is the total of the averages. Spread behaves differently: when X and Y are independent, a high X is just as likely to meet a low Y as a high one, so their swings partly cancel. That is why variances add and SDs do not. SDs of 6 and 8 combine to 10, not 14.',
      formula: {
        tex: '\\mu_{X+Y} = \\mu_X + \\mu_Y, \\qquad \\sigma_{X+Y}^{2} = \\sigma_X^{2} + \\sigma_Y^{2}',
        note: 'Means add. Variances add (when X and Y are independent). Then take the root.',
        parts: [
          { sym: '\\mu_{X+Y}', means: 'the mean of the total: just add the means', tone: 'accent' },
          { sym: '\\sigma_{X+Y}^{2}', means: 'the variance of the total: add the variances', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Start simple: a four-sided die',
      body: 'A fair four-sided die shows 1, 2, 3 or 4. What is the expected value of one roll, and how can it be a number the die never shows?',
      steps: {
        steps: [
          { tex: 'P(x) = \\tfrac{1}{4} \\text{ for each face}', text: 'A fair die makes every face equally likely. The four probabilities must add to 1, so each face gets weight 1/4.' },
          { tex: '\\mu = 1\\left(\\tfrac14\\right) + 2\\left(\\tfrac14\\right) + 3\\left(\\tfrac14\\right) + 4\\left(\\tfrac14\\right)', text: 'Multiply each value by its probability and add. That is the definition of expected value: each face counts in proportion to how often it shows up.' },
          { tex: '\\mu = \\tfrac{1}{4}(1 + 2 + 3 + 4) = \\tfrac{10}{4}', text: 'Add the four products. Every weight is 1/4, so you can factor it out, add 1 + 2 + 3 + 4 = 10, and divide by 4.' },
          { tex: '\\mu = 2.5', text: 'Read 10/4 as 2.5. This is a long-run average over many rolls, so it does not have to be a face of the die. It is the balance point of the four bars.' },
        ],
        answer: '\\mu = 2.5',
      },
    },
    {
      kind: 'example',
      head: 'Spread of the same die',
      body: 'Find the variance and standard deviation of the four-sided die, whose mean is 2.5. Which deviations do you need, and how do the probabilities weight them?',
      steps: {
        steps: [
          { tex: 'x - 2.5 = -1.5,\\ -0.5,\\ 0.5,\\ 1.5', text: 'Subtract the mean 2.5 from each face to see how far it sits from the centre. The signs differ because the mean is in the middle of the faces.' },
          { tex: '(x - 2.5)^{2} = 2.25,\\ 0.25,\\ 0.25,\\ 2.25', text: 'Square every deviation so the negatives stop cancelling the positives. Squaring also makes a far-away face count much more than a close one.' },
          { tex: '\\sigma^{2} = \\tfrac14(2.25 + 0.25 + 0.25 + 2.25) = \\tfrac{5}{4} = 1.25', text: 'Weight each squared deviation by its probability 1/4 and add. This weighted average of squared distances is the variance, and the table shows the same total.' },
          { tex: '\\sigma = \\sqrt{1.25} \\approx 1.12', text: 'Take the square root to undo the squaring. The standard deviation is in the same units as X, so a roll typically lands about 1.12 away from 2.5.' },
        ],
        answer: '\\sigma^{2} = 1.25,\\ \\sigma \\approx 1.12',
      },
      table: {
        head: ['x', 'x − 2.5', '(x − 2.5)²', '× 1/4'],
        rows: [['1', '−1.5', '2.25', '0.5625'], ['2', '−0.5', '0.25', '0.0625'], ['3', '0.5', '0.25', '0.0625'], ['4', '1.5', '2.25', '0.5625'], ['sum', '', '', '1.25']],
        mark: 4,
        note: 'σ² = 1.25, so σ = √1.25 ≈ 1.12.',
      },
    },
    {
      kind: 'example',
      head: 'A raffle ticket',
      body: 'A raffle sells 100 tickets at $2 each; one ticket wins $100. Let X be your net gain. What do you expect to gain or lose per ticket?',
      steps: {
        steps: [
          { tex: 'X = 100 - 2 = 98 \\quad\\text{or}\\quad X = -2', text: 'Net gain subtracts the ticket price from the prize. Winning nets 100 − 2 = $98, and losing leaves you down $2. Use net gain, since the $2 is spent either way.' },
          { tex: 'P(\\text{win}) = \\tfrac{1}{100} = 0.01,\\quad P(\\text{lose}) = 0.99', text: 'One ticket wins out of 100, so P(win) is 0.01. The other 99 tickets lose, so P(lose) is 0.99, and the two probabilities add to 1.' },
          { tex: 'E(X) = 98(0.01) + (-2)(0.99)', text: 'Multiply each net gain by its probability and add. This weighted average is the expected value, so the rare big win is counted only 1% of the time.' },
          { tex: '0.98 - 1.98 = -1.00', text: 'Finish the arithmetic: 98 × 0.01 is 0.98 and −2 × 0.99 is −1.98. The negative answer means that over many tickets you lose about a dollar on each.' },
        ],
        answer: 'E(X) = -\\$1.00',
      },
    },
    {
      kind: 'example',
      head: 'Cars per household',
      body: 'X is the number of cars in a household, with probabilities 0.10, 0.40, 0.35 and 0.15 for 0, 1, 2 and 3 cars. Find the mean and the standard deviation.',
      steps: {
        steps: [
          { tex: '0.10 + 0.40 + 0.35 + 0.15 = 1.00', text: 'Check that the probabilities add to 1 before computing anything. They do, so this is a valid distribution and the formulas can be used.' },
          { tex: '\\mu = 0(0.10) + 1(0.40) + 2(0.35) + 3(0.15) = 0.40 + 0.70 + 0.45 = 1.55', text: 'Multiply each number of cars by its probability and add. The zero-car row adds nothing, and the mean 1.55 sits between the two tall bars.' },
          { tex: '\\sigma^{2} = (0-1.55)^{2}(0.10) + (1-1.55)^{2}(0.40) + (2-1.55)^{2}(0.35) + (3-1.55)^{2}(0.15)', text: 'For each row square the distance from 1.55 and weight it by that row probability. This is the variance definition applied one row at a time.' },
          { tex: '= 0.2403 + 0.1210 + 0.0709 + 0.3154 = 0.7475', text: 'Add the four weighted squares. They are 0.2403, 0.1210, 0.0709 and 0.3154, which give a variance of 0.7475 squared cars.' },
          { tex: '\\sigma = \\sqrt{0.7475} \\approx 0.865', text: 'Take the square root to return to cars. A typical household is about 0.865 cars away from the mean of 1.55.' },
        ],
        answer: '\\mu = 1.55,\\ \\sigma \\approx 0.865',
      },
      art: pmf(['0', '1', '2', '3'], [0.1, 0.4, 0.35, 0.15], {
        alt: 'Bars of height 0.10, 0.40, 0.35 and 0.15 over 0, 1, 2 and 3 cars per household',
        title: 'Cars per household',
        fmt: fmt2,
        xLabel: 'cars, X',
        caption: 'The mean 1.55 sits between the two tall bars; the SD 0.865 says a typical household is within about one car of it.',
      }),
    },
    {
      kind: 'example',
      head: 'Another way: the shortcut for variance',
      body: 'Instead of squaring every deviation, can you get the cars variance from σ² = E(X²) − μ²? Square the values first, then subtract the squared mean.',
      steps: {
        steps: [
          { tex: 'E(X^{2}) = 0^{2}(0.10) + 1^{2}(0.40) + 2^{2}(0.35) + 3^{2}(0.15)', text: 'Square each value of X, not the probabilities, and weight the squares by P(x). The values 0, 1, 2, 3 square to 0, 1, 4, 9.' },
          { tex: 'E(X^{2}) = 0 + 0.40 + 1.40 + 1.35 = 3.15', text: 'Add the four products: 0.40, 1.40 and 1.35 total 3.15. This is the average of the squared values, which is larger than the square of the average.' },
          { tex: '\\mu^{2} = 1.55^{2} = 2.4025', text: 'Square the mean from the earlier example. The formula subtracts the mean squared, so be sure to square the 1.55 and not just use it as is.' },
          { tex: '\\sigma^{2} = 3.15 - 2.4025 = 0.7475', text: 'Subtract. The answer matches the long method because expanding Σ(x − μ)²P(x) gives E(X²) − 2μ² + μ², which simplifies to E(X²) − μ².' },
        ],
        answer: '\\sigma^{2} = 0.7475',
      },
      formula: {
        tex: '\\sigma^{2} = E(X^{2}) - \\mu^{2}',
        note: 'Weight the squared values by probability, then subtract the mean squared.',
        parts: [
          { sym: 'E(X^{2})', means: 'the sum of x² times P(x)', tone: 'accent' },
          { sym: '\\mu^{2}', means: 'the expected value, squared', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Taxi fare: F = 3 + 2.5X',
      body: 'A ride of X miles has mean 6 and SD 2 miles; the fare is F = 3 + 2.5X dollars. What are the mean and SD of the fare?',
      steps: {
        steps: [
          { tex: '\\mu_F = 3 + 2.5(6) = 3 + 15 = 18', text: 'Use the linear rule for the mean: the mean of a + bX is a + b times the mean of X. Both the $3 flat charge and the per-mile rate move the average fare.' },
          { text: 'The +3 is added to every fare, so all fares shift together and the gaps between them stay the same. A flat charge therefore cannot change the spread at all.' },
          { tex: '\\sigma_F = |2.5| \\cdot 2 = 5', text: 'The multiplier 2.5 stretches every gap between fares by 2.5, so the SD is multiplied by |b| = 2.5. Use the absolute value because a spread is never negative.' },
          { tex: '\\mu_F = \\$18,\\quad \\sigma_F = \\$5', text: 'Put it together: a typical ride costs about $18, give or take about $5. The units are dollars because F is a fare.' },
        ],
        answer: '\\mu_F = \\$18,\\ \\sigma_F = \\$5',
      },
    },
    {
      kind: 'example',
      head: 'Picture it first: coffees all day',
      body: 'A café sells X coffees in the morning (mean 40, SD 6) and Y in the afternoon (mean 50, SD 8), independently. What are the mean and SD of the day total? Picture the SDs as the legs of a right triangle.',
      steps: {
        steps: [
          { tex: '\\mu_T = 40 + 50 = 90', text: 'Means always add for a total, whether or not the variables are independent. The café averages 90 coffees a day.' },
          { tex: '6^{2} = 36,\\quad 8^{2} = 64', text: 'Standard deviations cannot be added, but variances can when X and Y are independent. So first square each SD to get the two variances.' },
          { tex: '\\sigma_T^{2} = 36 + 64 = 100', text: 'Add the variances. Independence is what makes this legal: the morning and afternoon swings do not line up, so their squared spreads simply add.' },
          { tex: '\\sigma_T = \\sqrt{100} = 10', text: 'Take the root to get back to coffees. The answer is 10, not 6 + 8 = 14, just as the hypotenuse of a 6-8-10 triangle is shorter than the two legs added.' },
        ],
        answer: '\\mu_T = 90,\\ \\sigma_T = 10',
      },
      art: rightTriangle({
        adj: 'σ = 6',
        opp: 'σ = 8',
        hyp: 'σ = 10',
        shape: { opp: 8, adj: 6 },
        title: 'SDs combine like the legs of a right triangle',
        alt: 'A right triangle with legs labelled SD 6 and SD 8 and hypotenuse labelled SD 10',
        caption: '6² + 8² = 10²: adding variances is the Pythagorean theorem in disguise.',
      }),
    },
    {
      kind: 'protip',
      head: 'Square, add, then root',
      body: 'Whenever two independent variables combine, go through variances. Square each SD, add, then take the square root. Writing the three steps down stops the tempting mistake of adding the SDs.',
      steps: {
        steps: [
          { tex: '6^{2} = 36,\\quad 8^{2} = 64', text: 'Square each standard deviation first. Variance is the quantity that adds for independent variables, so turn the 6 and the 8 into 36 and 64.' },
          { tex: '36 + 64 = 100', text: 'Add the two variances. This is allowed only when X and Y are independent; if they were linked, an extra term would be needed.' },
          { tex: '\\sqrt{100} = 10', text: 'Take the square root of the total. The root converts squared units back to ordinary units, giving an SD you can compare with 6 and 8.' },
        ],
        answer: '\\sigma_{X+Y} = 10',
      },
    },
    {
      kind: 'trap',
      head: 'X − Y still ADDS the variances',
      body: 'Subtracting two independent variables does not shrink the spread. The uncertainty in each one piles up either way. The mean subtracts, but the variance of X − Y is σ_X² + σ_Y², the same as for X + Y.',
      formula: {
        tex: '\\sigma_{X-Y}^{2} = \\sigma_X^{2} + \\sigma_Y^{2}',
        note: 'A plus sign, even for a difference.',
        parts: [
          { sym: '\\mu_{X-Y}', means: 'does subtract: μ_X − μ_Y', tone: 'ok' },
          { sym: '\\sigma_{X-Y}^{2}', means: 'never subtracts: variances add', tone: 'bad' },
        ],
      },
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\sigma_{X-Y} = 8 - 6 = 2', lines: ['Subtracting SDs'], tone: 'bad' },
          { title: 'Right', tex: '\\sigma_{X-Y} = \\sqrt{36 + 64} = 10', lines: ['Add the variances, then root'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: an ordinary six-sided die',
      body: 'Find μ and σ for one roll of a fair six-sided die. Which variance formula is quicker here, and why?',
      steps: {
        steps: [
          { tex: '\\mu = \\tfrac{1 + 2 + 3 + 4 + 5 + 6}{6} = \\tfrac{21}{6} = 3.5', text: 'Every face has probability 1/6, so factor that out and add the faces to get 21. Then 21/6 = 3.5, the balance point of the six bars.' },
          { tex: 'E(X^{2}) = \\tfrac{1 + 4 + 9 + 16 + 25 + 36}{6} = \\tfrac{91}{6} \\approx 15.17', text: 'For the shortcut, square each face and average the squares. The squares add to 91, and 91/6 is about 15.17.' },
          { tex: '\\sigma^{2} = \\tfrac{91}{6} - 3.5^{2} = 15.17 - 12.25 \\approx 2.92', text: 'Subtract the squared mean 3.5² = 12.25. The shortcut E(X²) − μ² saves finding six separate deviations, so it is quicker here.' },
          { tex: '\\sigma = \\sqrt{2.92} \\approx 1.71', text: 'Take the root to return to pips on the die. A roll typically lands about 1.7 away from 3.5.' },
        ],
        answer: '\\mu = 3.5,\\ \\sigma \\approx 1.71',
      },
    },
    {
      kind: 'summary',
      head: 'Random variables, wrapped up',
      body: 'Expected value is a probability-weighted average. Variance is the weighted average of squared deviations; the SD is its root. Shifts move the mean only, multipliers scale both, and independent variables combine by adding variances, never SDs.',
      table: {
        head: ['Situation', 'Mean', 'SD'],
        rows: [
          ['X itself', 'Σ x·P(x)', '√Σ (x − μ)²P(x)'],
          ['a + bX', 'a + bμ_X', '|b|σ_X'],
          ['X + Y (indep.)', 'μ_X + μ_Y', '√(σ_X² + σ_Y²)'],
          ['X − Y (indep.)', 'μ_X − μ_Y', '√(σ_X² + σ_Y²)'],
        ],
        note: 'The last two rows share an SD on purpose: variances add either way.',
      },
    },
  ],

  // ---------------- STAT-9 — Binomial and geometric distributions ----------------
  'STAT-9': [
    {
      kind: 'objective',
      head: 'Counting successes',
      body: 'Flip a fair coin four times and count the heads. Exactly 2 heads happens 6 ways out of 16, a probability of 0.375. Today you will compute probabilities like this with a formula, and handle the cousin question: how long until the first success?',
      art: pmf(['0', '1', '2', '3', '4'], [0.0625, 0.25, 0.375, 0.25, 0.0625], {
        alt: 'Bars showing the probabilities 0.0625, 0.25, 0.375, 0.25 and 0.0625 of 0 to 4 heads in four coin flips, with the bar at 2 heads highlighted',
        title: 'Heads in 4 flips of a fair coin',
        mark: [2],
        fmt: (p) => p.toFixed(4),
        xLabel: 'number of heads',
        caption: 'The middle bar is 6/16 = 0.375: six of the sixteen orderings have exactly two heads.',
      }),
    },
    {
      kind: 'concept',
      head: 'BINS: the four conditions',
      body: 'A count X is binomial when the setting passes four checks. Binary outcomes, Independent trials, a fixed Number of trials n, and the Same probability p of success every time. Coin flips, free throws and defective parts all qualify.',
      why: 'Each condition protects one step of the formula. Independence and the same p let us multiply single-trial probabilities together, a fixed n lets us count orderings out of n, and binary outcomes mean each trial is just success or failure. If one fails, say p changes after every draw, the product p^k(1 − p)^(n − k) no longer describes the situation.',
      table: {
        head: ['Letter', 'Condition', 'Coin flips'],
        rows: [
          ['B', 'Binary: success or failure', 'heads or tails'],
          ['I', 'Independent trials', 'one flip does not affect the next'],
          ['N', 'Number of trials fixed', 'n = 4 flips'],
          ['S', 'Same p every trial', 'p = 0.5 each time'],
        ],
        note: 'Pass all four and X, the number of successes, is binomial.',
      },
    },
    {
      kind: 'concept',
      head: 'The binomial formula',
      body: 'The probability of exactly k successes has three pieces. C(n, k) counts the orderings the successes can land in, p^k pays for the successes, and (1 − p)^(n − k) pays for the failures.',
      why: 'Take 4 flips and 2 heads. One particular ordering, HHTT, has probability 0.5 × 0.5 × 0.5 × 0.5 = (0.5)²(0.5)². Every other ordering with two heads has the same probability, and the orderings cannot happen together, so we add that probability once per ordering. There are C(4, 2) = 6 of them, which is why the count multiplies the probability.',
      formula: {
        tex: 'P(X = k) = \\binom{n}{k}\\, p^{k}\\,(1 - p)^{\\,n-k}',
        note: 'Orderings × successes × failures.',
        parts: [
          { sym: '\\binom{n}{k}', means: 'how many orderings put k successes among n trials', tone: 'accent' },
          { sym: 'p^{k}', means: 'the probability of the k successes', tone: 'ok' },
          { sym: '(1-p)^{n-k}', means: 'the probability of the n − k failures', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Mean and SD of a binomial',
      body: 'You do not need the full table to know the centre and spread. The mean is np: 50 parts at a 10% defect rate average 5 defects. The standard deviation is √(np(1 − p)).',
      why: 'A binomial count is the sum of n separate trials, each worth 1 for a success and 0 for a failure. One trial averages p, so n trials average np. One trial has variance p(1 − p), and independent variances add, so the count has variance np(1 − p). The square root of that is the SD.',
      formula: {
        tex: '\\mu_X = np, \\qquad \\sigma_X = \\sqrt{np(1-p)}',
        note: 'Centre and spread straight from n and p.',
        parts: [
          { sym: 'np', means: 'trials times success rate: the expected count', tone: 'accent' },
          { sym: '\\sqrt{np(1-p)}', means: 'the typical distance from that count', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Geometric: waiting for the first success',
      body: 'A geometric variable Y counts trials UNTIL the first success. The first success on trial k needs k − 1 failures first, then one success. On average you wait 1/p trials.',
      why: 'To need exactly k trials, the first k − 1 must all fail and trial k must succeed. Independent trials multiply, so that is (1 − p) used k − 1 times, then one factor of p. The mean 1/p matches common sense: if p = 1/6, a six shows up about once per 6 rolls, so you expect to wait about 6 rolls.',
      formula: {
        tex: 'P(Y = k) = (1-p)^{\\,k-1}\\,p, \\qquad \\mu_Y = \\frac{1}{p}',
        note: 'Failures first, then the one success that ends the wait.',
        parts: [
          { sym: '(1-p)^{k-1}', means: 'k − 1 failures in a row', tone: 'warn' },
          { sym: 'p', means: 'the success on trial k', tone: 'ok' },
          { sym: '1/p', means: 'the average number of trials you wait', tone: 'accent' },
        ],
      },
      compare: {
        cols: [
          { title: 'Binomial', lines: ['n is fixed', 'X counts successes', 'X = 0, 1, …, n'], tone: 'accent' },
          { title: 'Geometric', lines: ['n is not fixed', 'Y counts trials to first success', 'Y = 1, 2, 3, …'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Two rules that save you',
      body: 'Sampling without replacement is close enough to independent when the sample is under 10% of the population. And any "at least one" question is faster as 1 − P(none).',
      why: 'Drawing without replacement slightly changes p after each draw, because one item has been removed. When the sample is under 10% of the population that change is tiny, so the trials are nearly independent. For at least one, the cases 1, 2, 3 and so on are many, but the only other case is none, and all probabilities total 1, so 1 − P(none) gives the answer in one step.',
      compare: {
        cols: [
          { title: '10% condition', lines: ['n ≤ 10% of the population', 'treat draws as independent', 'binomial is fine'], tone: 'accent' },
          { title: 'At least one', tex: '1 - P(\\text{none})', lines: ['one subtraction', 'instead of adding every case'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Start simple: 2 heads in 4 flips',
      body: 'Flip a fair coin 4 times. What is the probability of exactly 2 heads? Name n, p and k, then multiply the number of orderings by the probability of one ordering.',
      steps: {
        steps: [
          { tex: 'X \\sim B(4,\\ 0.5),\\quad k = 2', text: 'Check BINS: each flip is heads or tails, flips are independent, n = 4 is fixed, and p = 0.5 every time. So X, the number of heads, is binomial with k = 2.' },
          { tex: '\\binom{4}{2} = \\tfrac{4 \\cdot 3}{2 \\cdot 1} = 6', text: 'Count the orderings of two heads among four flips: HHTT, HTHT, HTTH, THHT, THTH, TTHH. The binomial coefficient C(4, 2) gives the same six without listing.' },
          { tex: '(0.5)^{2}(0.5)^{2} = \\tfrac{1}{16}', text: 'Each ordering has two heads and two tails. Because flips are independent we may multiply, so every ordering has the same probability 1/16.' },
          { tex: '6 \\cdot \\tfrac{1}{16} = 0.375', text: 'The six orderings cannot happen together, so add their equal probabilities: 6 times 1/16 is 6/16 = 0.375.' },
        ],
        answer: 'P(X = 2) = 0.375',
      },
    },
    {
      kind: 'example',
      head: 'Free throws: exactly 4 of 5',
      body: 'A player makes 80% of free throws. In 5 shots, what is the probability of exactly 4 makes? Write n, p and k first, then use the binomial formula.',
      steps: {
        steps: [
          { tex: 'X \\sim B(5,\\ 0.8),\\quad k = 4', text: 'Each shot is a make or a miss, shots are assumed independent, n = 5 is fixed and p = 0.8 each time. So the binomial formula applies with k = 4.' },
          { tex: '\\binom{5}{4} = 5', text: 'The one miss can be shot 1, 2, 3, 4 or 5, so there are five orderings. C(5, 4) counts them without listing.' },
          { tex: '(0.8)^{4} = 0.4096,\\quad (0.2)^{1} = 0.2', text: 'Four makes multiply to 0.8⁴ = 0.4096, and the one miss contributes 1 − 0.8 = 0.2. Multiplying is allowed because shots are independent.' },
          { tex: '5 \\times 0.4096 \\times 0.2 = 0.4096', text: 'Multiply orderings by the probability of one ordering. 0.4096 × 0.2 = 0.08192, and five of those make 0.4096.' },
        ],
        answer: 'P(X = 4) = 0.4096',
      },
    },
    {
      kind: 'example',
      head: 'At least 4 of 5',
      body: 'Same shooter, 5 shots at p = 0.8. What is the probability of at least 4 makes? Which bars of the distribution do you add?',
      steps: {
        steps: [
          { tex: 'P(X \\ge 4) = P(X = 4) + P(X = 5)', text: 'At least 4 means exactly 4 or exactly 5 makes. These cannot both happen, so we can add their probabilities.' },
          { tex: 'P(X = 4) = \\binom54 (0.8)^{4}(0.2) = 0.4096', text: 'Use the binomial formula for k = 4, exactly as in the last example. The probability is 0.4096.' },
          { tex: 'P(X = 5) = \\binom55 (0.8)^{5}(0.2)^{0} = 0.32768', text: 'For k = 5 there is only one ordering, so C(5, 5) = 1. There are no misses, and (0.2)⁰ = 1, so the result is just 0.8⁵ = 0.32768.' },
          { tex: '0.4096 + 0.32768 = 0.73728 \\approx 0.737', text: 'Add the two bars. The answer is about 0.737, so this shooter makes at least 4 of 5 roughly 74% of the time.' },
        ],
        answer: 'P(X \\ge 4) \\approx 0.737',
      },
      art: pmf(['0', '1', '2', '3', '4', '5'], [0.00032, 0.0064, 0.0512, 0.2048, 0.4096, 0.32768], {
        alt: 'Bars for 0 to 5 made free throws out of 5 at an 80% rate, with the bars at 4 and 5 highlighted',
        title: 'Makes in 5 shots, n = 5, p = 0.8',
        mark: [4, 5],
        fmt: (p) => p.toFixed(4),
        xLabel: 'free throws made',
        caption: 'The two highlighted bars add to 0.4096 + 0.3277 ≈ 0.737.',
      }),
    },
    {
      kind: 'example',
      head: 'Defects on a factory line',
      body: 'A line has a 10% defect rate. In a batch of 50 parts, how many defects should you expect, give or take? Check BINS, then use the shortcuts for the mean and SD.',
      steps: {
        steps: [
          { tex: 'X \\sim B(50,\\ 0.1)', text: 'Each part is defective or not, parts are independent on a long production line, n = 50 is fixed and p = 0.1. So the number of defects is binomial.' },
          { tex: '\\mu = np = 50(0.1) = 5', text: 'Use mean = np. Each of the 50 parts is defective with probability 0.1, so on average 50 × 0.1 = 5 parts are bad.' },
          { tex: '\\sigma^{2} = np(1-p) = 50(0.1)(0.9) = 4.5', text: 'Variance is np(1 − p). One part has variance p(1 − p) = 0.09, and 50 independent parts add, giving 50 × 0.09 = 4.5.' },
          { tex: '\\sigma = \\sqrt{4.5} \\approx 2.12', text: 'Take the square root of the variance. A batch typically has 5 defects, give or take about 2.' },
        ],
        answer: '\\mu = 5,\\ \\sigma \\approx 2.12',
      },
    },
    {
      kind: 'example',
      head: 'Another way: "at least one" by the complement',
      body: 'A spam filter misses 20% of spam. Of 3 spam emails, what is the chance at least one gets through? Can you avoid adding three separate cases?',
      steps: {
        steps: [
          { tex: 'P(\\text{at least 1}) = 1 - P(\\text{none})', text: '“At least one gets through” and “none get through” cover every possibility between them, so their probabilities add to 1. Find the single easy case and subtract.' },
          { tex: 'P(\\text{none}) = (0.8)^{3} = 0.512', text: 'None get through means the filter catches all 3. Each is caught with probability 0.8, independently, so multiply: 0.8 × 0.8 × 0.8 = 0.512.' },
          { tex: '1 - 0.512 = 0.488', text: 'Subtract from 1. One subtraction replaces adding the three cases for 1, 2 and 3 emails getting through.' },
          { tex: '0.384 + 0.096 + 0.008 = 0.488', text: 'Check with the long way from the table. Adding the three cases gives the same 0.488, so the shortcut is trustworthy.' },
        ],
        answer: 'P(\\text{at least one}) = 0.488',
      },
      table: {
        head: ['emails through', 'probability'],
        rows: [['0', '(0.8)³ = 0.512'], ['1', '3(0.2)(0.8)² = 0.384'], ['2', '3(0.2)²(0.8) = 0.096'], ['3', '(0.2)³ = 0.008']],
        mark: 0,
        note: 'One subtraction, 1 − 0.512, replaces adding the other three rows.',
      },
    },
    {
      kind: 'example',
      head: 'Rolling for a six',
      body: 'Roll a fair die until a 6 appears. What is the chance the first 6 comes on the 3rd roll, and how many rolls should you expect to wait?',
      steps: {
        steps: [
          { tex: 'p = \\tfrac{1}{6}', text: 'Rolling until the first success is geometric, not binomial, because the number of trials is not fixed. A six has probability 1/6 on every roll.' },
          { tex: 'P(Y = 3) = \\left(\\tfrac56\\right)^{2}\\left(\\tfrac16\\right)', text: 'The first six on roll 3 means rolls 1 and 2 are not sixes, 5/6 each, and roll 3 is a six, 1/6. Independent rolls multiply.' },
          { tex: '\\tfrac{25}{216} \\approx 0.116', text: 'Multiply: 25/36 times 1/6 is 25/216, which is about 0.116. Each bar in the picture is 5/6 of the one before it.' },
          { tex: '\\mu_Y = \\tfrac{1}{p} = 6', text: 'The expected wait is 1/p. A six appears about once in every 6 rolls, so you expect to roll 6 times, though any single wait can be much shorter or longer.' },
        ],
        answer: 'P(Y = 3) \\approx 0.116,\\ \\mu_Y = 6',
      },
      art: pmf(['1', '2', '3', '4', '5', '6'], [1 / 6, 5 / 36, 25 / 216, 125 / 1296, 625 / 7776, 3125 / 46656], {
        alt: 'Bars shrinking from 0.167 down to 0.067 over rolls 1 to 6, showing when the first six arrives, with roll 3 highlighted',
        title: 'Roll on which the first 6 appears',
        mark: [2],
        xLabel: 'roll number (the tail goes on forever)',
        caption: 'Each bar is 5/6 of the one before. The highlighted bar is 25/216 ≈ 0.116.',
      }),
    },
    {
      kind: 'example',
      head: 'Picture it first: the inspector',
      body: 'A shipment of 10,000 bulbs is 5% defective. An inspector tests 20 at random. What is the chance of no defects, and how many defects should be expected? Check independence first.',
      steps: {
        steps: [
          { tex: '20 \\le 10\\%\\ \\text{of}\\ 10{,}000 = 1000', text: 'Bulbs are drawn without replacement, which would break independence. But 20 is far under 10% of 10,000, so the trials are close enough to independent.' },
          { tex: 'X \\sim B(20,\\ 0.05)', text: 'Each bulb is defective or not, n = 20 is fixed and p = 0.05 is nearly the same each draw. So the number of defects is binomial.' },
          { tex: 'P(X = 0) = \\binom{20}{0}(0.05)^{0}(0.95)^{20} \\approx 0.358', text: 'Zero defects has one ordering, and no defects contributes a factor of 1. So only the twenty good bulbs in a row count: 0.95²⁰ is about 0.358.' },
          { tex: '\\mu = np = 20(0.05) = 1', text: 'The expected number of defects is np. About one bad bulb per inspection, even though the most likely single outcome is zero.' },
        ],
        answer: 'P(X = 0) \\approx 0.358',
      },
    },
    {
      kind: 'protip',
      head: 'Say BINS out loud before you compute',
      body: 'On the exam, name the setting first: binary, independent, fixed n, same p. Then write n, p and k before touching the formula. Half the lost points in this unit come from using a binomial formula where the trials were not fixed.',
      art: flow(
        [{ label: 'Binary', color: SKY }, { label: 'Independent', color: AMB }, { label: 'Number fixed', color: EMR }, { label: 'Same p', color: VIO }],
        { horizontal: true, title: 'The four checks of a binomial setting', alt: 'Four boxes in a row reading Binary, Independent, Number fixed and Same p', caption: 'Pass all four, then write down n, p and k.' },
      ),
    },
    {
      kind: 'trap',
      head: 'Binomial or geometric?',
      body: 'Binomial counts successes in a FIXED number of trials. Geometric counts TRIALS until the first success, so n is not fixed and the variable starts at 1. "How many sixes in 10 rolls" is binomial; "how many rolls until a six" is geometric.',
      compare: {
        cols: [
          { title: '"How many sixes in 10 rolls?"', tex: 'X \\sim B(10, \\tfrac{1}{6})', lines: ['fixed n = 10', 'counts successes'], tone: 'accent' },
          { title: '"How many rolls until a six?"', tex: 'P(Y = k) = (\\tfrac{5}{6})^{k-1}\\tfrac{1}{6}', lines: ['no fixed n', 'counts trials'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: at least one six in four rolls',
      body: 'Roll a fair die four times. What is the probability of at least one six? Decide whether adding cases or using the complement is shorter.',
      steps: {
        steps: [
          { tex: 'P(\\text{at least one}) = 1 - P(\\text{no six})', text: 'At least one six has four cases (one, two, three or four sixes). Its complement, no sixes at all, is a single case, so subtract that one from 1.' },
          { tex: 'P(\\text{no six}) = \\left(\\tfrac{5}{6}\\right)^{4} = \\tfrac{625}{1296}', text: 'Each roll avoids a six with probability 5/6. The four rolls are independent, so multiply four copies of 5/6 to get 625/1296.' },
          { tex: '1 - \\tfrac{625}{1296} = \\tfrac{671}{1296}', text: 'Subtract from 1 by writing 1 as 1296/1296, so the fractions share a denominator: 1296 − 625 = 671.' },
          { tex: '\\tfrac{671}{1296} \\approx 0.518', text: 'Divide to get a decimal. The result is a little better than a coin flip, which is surprising for four rolls of a 1-in-6 chance.' },
        ],
        answer: 'P(\\text{at least one six}) \\approx 0.518',
      },
    },
    {
      kind: 'summary',
      head: 'Binomial and geometric, wrapped up',
      body: 'Binomial: fixed n, count the successes, P(X = k) = C(n, k)p^k(1 − p)^(n − k), mean np, SD √(np(1 − p)). Geometric: count trials to the first success, P(Y = k) = (1 − p)^(k − 1)p, mean 1/p. "At least one" is 1 − P(none).',
      table: {
        head: ['', 'Binomial X', 'Geometric Y'],
        rows: [
          ['counts', 'successes in n trials', 'trials until first success'],
          ['P(= k)', 'C(n, k)p^k(1 − p)^(n − k)', '(1 − p)^(k − 1)p'],
          ['mean', 'np', '1/p'],
          ['SD', '√(np(1 − p))', '√(1 − p)/p'],
        ],
      },
    },
  ],

  // ---------------- STAT-10 — Sampling distributions and the Central Limit Theorem ----------------
  'STAT-10': [
    {
      kind: 'objective',
      head: 'One statistic, many samples',
      body: 'Exam scores have mean 70. Take a random sample of n = 36 students, compute the sample mean, and repeat. The means pile up around 70 in a bell shape. Today you will describe that pile: its centre, its spread, and when it is normal.',
      art: dotPlot([64, 66, 68, 70, 72, 74, 76], [1, 3, 6, 9, 6, 3, 1], {
        title: 'Sample means from 29 samples',
        mark: 3,
        unit: 'mean score x̄ of each sample (n = 36)',
        alt: 'A dot plot of 29 sample means stacked over 64 to 76, highest at 70',
        caption: 'Each dot is one sample. The pile is centred on the population mean 70.',
      }),
    },
    {
      kind: 'concept',
      head: 'Parameter versus statistic',
      body: 'A parameter describes the population: p or μ. It is fixed, but unknown. A statistic describes one sample: p̂ or x̄. It is known, but changes from sample to sample. Inference uses the statistic you have to learn about the parameter you want.',
      why: 'A parameter is one fixed number because there is only one population. A statistic comes from whichever sample you happened to draw, so a different sample gives a different value. That sample-to-sample wobble is why we need a sampling distribution: it tells us how far a statistic usually lands from the parameter it estimates.',
      compare: {
        cols: [
          { title: 'Parameter', tex: 'p,\\ \\mu', lines: ['describes the population', 'fixed and unknown'], tone: 'accent' },
          { title: 'Statistic', tex: '\\hat{p},\\ \\bar{x}', lines: ['describes one sample', 'known, but varies'], tone: 'ok' },
        ],
        note: 'The sampling distribution is the distribution of the statistic over ALL possible samples of size n.',
      },
    },
    {
      kind: 'concept',
      head: 'The sampling distribution of p̂',
      body: 'Sample proportions centre on the true p and spread out by √(p(1 − p)/n). The shape is approximately normal when both np and n(1 − p) are at least 10, the Large Counts condition.',
      why: 'A sample proportion is a count of successes divided by n, and the count has mean np and SD √(np(1 − p)). Dividing both by n gives a mean of p and an SD of √(p(1 − p)/n), so p̂ is centred on p and clings tighter as n grows. Large Counts makes the count symmetric enough to look normal.',
      formula: {
        tex: '\\mu_{\\hat{p}} = p, \\qquad \\sigma_{\\hat{p}} = \\sqrt{\\frac{p(1-p)}{n}}',
        note: 'Unbiased centre, and a spread that shrinks with √n.',
        parts: [
          { sym: '\\mu_{\\hat{p}} = p', means: 'p̂ is unbiased: on average it hits p', tone: 'accent' },
          { sym: '\\sqrt{p(1-p)/n}', means: 'the standard deviation of p̂', tone: 'ok' },
          { sym: 'np \\ge 10,\\ n(1-p) \\ge 10', means: 'Large Counts: then the shape is about normal', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'The sampling distribution of x̄',
      body: 'Sample means centre on μ and have standard deviation σ/√n. If the population itself is normal, x̄ is normal for any sample size, even n = 2.',
      why: 'Averaging n values lets the highs and lows cancel. Variances of independent values add, so the sum has variance nσ², and dividing by n divides the variance by n², leaving σ²/n. The root of that is σ/√n. If the population is normal, a sum of normals is normal, so x̄ is normal at any n.',
      formula: {
        tex: '\\mu_{\\bar{x}} = \\mu, \\qquad \\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}}',
        note: 'Divide the population SD by the square root of n, never by n.',
        parts: [
          { sym: '\\mu_{\\bar{x}} = \\mu', means: 'x̄ is unbiased for μ', tone: 'accent' },
          { sym: '\\sigma/\\sqrt{n}', means: 'averaging shrinks the spread', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'The Central Limit Theorem',
      body: 'For a large enough sample, n ≥ 30 is the usual rule, x̄ is approximately normal no matter what shape the population has. Clinic waits are strongly skewed, but the means of n = 50 patients form a tight bell.',
      why: 'One value from a skewed population can land far out in the long tail. A mean of 50 values mixes a few long waits with many short ones, which pulls the average toward the middle. A far-out mean would need many extreme values at once, which is rare, so the means pile up in a symmetric bell even though single values do not.',
      art: (() => {
        const ax = axes({ x: [0, 12], y: [0, 1.1] }, { ticks: { x: [2, 4, 6, 8, 10, 12] }, pad: 40, xLabel: 'minutes' });
        return art(
          'A right-skewed population curve and, on the same axes, a tall narrow normal curve of sample means centred at 4',
          text(W / 2, 22, 'A skewed population, a normal x̄', { size: 13, fill: VIO }) +
            ax.body +
            draws(ax.curve((x) => 0.4 * (x / 2) * Math.exp(1 - x / 2), ROSE, 2.6), 800) +
            draws(ax.curve((x) => 0.95 * Math.exp(-0.5 * ((x - 4) / 0.424) ** 2), SKY, 2.8), 800, 0.4) +
            text(ax.X(7.6), ax.Y(0.36), 'population: skewed', { size: 12, fill: ROSE }) +
            text(ax.X(5.0), ax.Y(0.9), 'x̄ for n = 50', { size: 12, fill: SKY, anchor: 'start' }),
          'The population keeps its skew. The sample means do not.',
        );
      })(),
      compare: {
        cols: [
          { title: 'Population', lines: ['any shape', 'mean μ, SD σ'], tone: 'warn' },
          { title: 'x̄, n ≥ 30', lines: ['approximately normal', 'mean μ, SD σ/√n'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Start simple: the SD of x̄',
      body: 'Exam scores have μ = 70 and σ = 12. For samples of 36 students, how much does the sample mean x̄ vary from sample to sample?',
      steps: {
        steps: [
          { tex: '\\sigma = 12,\\quad n = 36', text: 'Name what is given. The population SD 12 describes one student, and the sample size 36 tells us how many scores are averaged together.' },
          { tex: '\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{12}{\\sqrt{36}}', text: 'Use the SD of a sample mean, σ/√n. We divide by the root of n because variances shrink to σ²/n when averaging, and then the square root gives σ/√n.' },
          { tex: '\\sigma_{\\bar{x}} = \\frac{12}{6} = 2', text: 'Take √36 = 6 and divide. Be careful to divide by 6, not by 36. The sample mean varies six times less than a single score.' },
          { tex: '\\mu_{\\bar{x}} = 70,\\quad \\sigma_{\\bar{x}} = 2', text: 'Read the result: a typical sample mean misses 70 by about 2 points. A single student typically misses by 12 points, so averaging pays off.' },
        ],
        answer: '\\sigma_{\\bar{x}} = 2',
      },
    },
    {
      kind: 'example',
      head: 'Describe the sampling distribution of p̂',
      body: 'In a city, 60% of adults own a bike. For random samples of 100 adults, describe the centre, spread and shape of the sample proportion p̂.',
      steps: {
        steps: [
          { tex: '\\mu_{\\hat{p}} = p = 0.6', text: 'The centre of p̂ is the true proportion, because sample proportions are unbiased. On average they land right on 0.6.' },
          { tex: '\\sigma_{\\hat{p}} = \\sqrt{\\tfrac{0.6(0.4)}{100}} = \\sqrt{0.0024} \\approx 0.049', text: 'Use √(p(1 − p)/n). First p(1 − p) = 0.24, then divide by n = 100 to get 0.0024, then take the square root.' },
          { tex: 'np = 60 \\ge 10,\\quad n(1-p) = 40 \\ge 10', text: 'Check Large Counts: expect 60 owners and 40 non-owners, both at least 10. The 100 adults are also under 10% of a city, so the SD formula applies.' },
          { tex: '\\hat{p} \\approx N(0.6,\\ 0.049)', text: 'Because Large Counts holds, the shape is approximately normal. Put the three facts together: centre 0.6, SD 0.049, normal shape.' },
        ],
        answer: '\\text{approximately normal, mean } 0.6,\\ \\text{SD } 0.049',
      },
      art: bell(0.6, 0.049, {
        alt: 'A normal curve centred at 0.60 with tick marks at 0.50, 0.55, 0.60, 0.65 and 0.70',
        title: 'Sampling distribution of p̂, bikes',
        fmt: fmt2,
        marks: [{ at: 0.6, label: 'mean 0.6' }],
        caption: 'Centre 0.6, one SD is 0.049, shape approximately normal.',
      }),
    },
    {
      kind: 'example',
      head: 'A sample mean above 73?',
      body: 'Same exam: μ = 70, σ = 12, n = 36. What is the chance that a sample mean lands above 73?',
      steps: {
        steps: [
          { tex: 'n = 36 \\ge 30', text: 'Check the shape first. With n at least 30 the Central Limit Theorem says x̄ is approximately normal, even if individual scores are not.' },
          { tex: '\\mu_{\\bar{x}} = 70,\\quad \\sigma_{\\bar{x}} = \\tfrac{12}{\\sqrt{36}} = 2', text: 'The sample mean is centred at μ = 70 and has SD σ/√n = 12/6 = 2. This SD, not 12, describes how means vary.' },
          { tex: 'z = \\frac{73 - 70}{2} = 1.5', text: 'Standardize with the SD of x̄. We are asking about a mean of 36 scores, so 73 is 1.5 standard deviations of x̄ above the centre.' },
          { tex: 'P(Z > 1.5) = 1 - 0.9332 = 0.0668', text: 'The table gives the area to the left of 1.5, which is 0.9332. We want the upper tail, so subtract that from 1.' },
        ],
        answer: 'P(\\bar{x} > 73) = 0.0668',
      },
      art: bell(70, 2, {
        alt: 'A normal curve centred at 70 with standard deviation 2 and the tail beyond 73 shaded',
        title: 'P(x̄ > 73) when μ = 70 and σ_x̄ = 2',
        shade: [[73, 80]],
        marks: [{ at: 73, label: 'x̄ = 73' }],
        labels: [{ text: 'P = 0.0668', at: 75.3 }, { text: 'z = 1.5', at: 73, y: 160 }],
        caption: 'Three points above the mean is 1.5 standard deviations of x̄.',
      }),
    },
    {
      kind: 'example',
      head: 'A sample proportion of 0.65 or more?',
      body: 'Bikes again: p = 0.6 and n = 100. What is the chance that a sample has p̂ of 0.65 or more? Check the shape before using the normal table.',
      steps: {
        steps: [
          { tex: 'np = 60 \\ge 10,\\quad n(1-p) = 40 \\ge 10', text: 'Large Counts holds, so p̂ is approximately normal and the z-table may be used. Without this check the table could be misleading.' },
          { tex: '\\sigma_{\\hat{p}} = \\sqrt{\\tfrac{0.6(0.4)}{100}} \\approx 0.049', text: 'Find the SD of p̂ with √(p(1 − p)/n), using the true p = 0.6 because we are asking what would happen if p really is 0.6.' },
          { tex: 'z = \\frac{0.65 - 0.60}{0.049} \\approx 1.02', text: 'Standardize by subtracting the centre and dividing by the SD of p̂. The sample proportion 0.65 is about 1.02 SDs above 0.6.' },
          { tex: 'P(Z > 1.02) = 1 - 0.8461 = 0.1539', text: 'The table gives 0.8461 to the left of 1.02. Subtract from 1 for the upper tail: roughly a 15% chance, so not unusual.' },
        ],
        answer: 'P(\\hat{p} \\ge 0.65) \\approx 0.154',
      },
    },
    {
      kind: 'example',
      head: 'Another way: think in √n',
      body: 'With n = 36 the SD of x̄ was 2. How many students are needed to cut it to 1? Work with the square root rather than with n itself.',
      steps: {
        steps: [
          { tex: '\\frac{12}{\\sqrt{n}} = 1', text: 'Write the goal as an equation. We want the SD of x̄, σ/√n with σ = 12, to equal 1, and we solve for n.' },
          { tex: '\\sqrt{n} = 12', text: 'Multiply both sides by √n and then divide by 1, so √n = 12. Compare with the old √36 = 6: the root has to double to halve the SD.' },
          { tex: 'n = 12^{2} = 144', text: 'Square both sides to undo the square root. That gives n = 144, so we need 144 students.' },
          { tex: '144 = 4 \\times 36', text: 'Notice 144 is 4 times 36. Because of the root, halving the SD costs four times the data. Doubling n would only shrink the SD by a factor of √2, about 1.41.' },
        ],
        answer: 'n = 144',
      },
      table: {
        head: ['n', '√n', 'SD of x̄ = 12/√n'],
        rows: [['36', '6', '2'], ['144', '12', '1'], ['576', '24', '0.5']],
        mark: 1,
        note: 'Every time n is multiplied by 4, the SD is cut in half.',
      },
    },
    {
      kind: 'example',
      head: 'Picture it first: the skewed clinic',
      body: 'Waiting times are strongly right-skewed with μ = 4 and σ = 3 minutes. For n = 50 patients, what is P(x̄ > 5)? Picture the bell of means, not the skewed population.',
      steps: {
        steps: [
          { tex: 'n = 50 \\ge 30', text: 'The population is skewed, so check the sample size instead. With n at least 30 the CLT makes x̄ approximately normal anyway.' },
          { tex: '\\sigma_{\\bar{x}} = \\frac{3}{\\sqrt{50}} \\approx 0.424', text: 'The SD of x̄ is σ/√n. The root of 50 is about 7.07, and 3/7.07 is about 0.424 minutes.' },
          { tex: 'z = \\frac{5 - 4}{0.424} \\approx 2.36', text: 'Standardize with the SD of x̄: a mean of 5 is 1 minute above 4, and that is about 2.36 standard deviations of x̄.' },
          { tex: 'P(Z > 2.36) = 1 - 0.9909 \\approx 0.009', text: 'The table gives 0.9909 to the left, so the upper tail is about 0.009. Averages of 50 waits above 5 minutes are very rare.' },
        ],
        answer: 'P(\\bar{x} > 5) \\approx 0.009',
      },
      art: bell(4, 0.424, {
        alt: 'A normal curve centred at 4 minutes with standard deviation 0.42 and the small tail beyond 5 shaded',
        title: 'Clinic waits: x̄ for n = 50',
        fmt: fmt2,
        shade: [[5, 9]],
        marks: [{ at: 5, label: 'x̄ = 5' }],
        labels: [{ text: 'P ≈ 0.009', at: 5.3, y: 110 }],
        caption: 'The CLT turns a skewed population into a bell for x̄ once n is 30 or more.',
      }),
    },
    {
      kind: 'protip',
      head: 'Check the shape before you use the table',
      body: 'A z-table is only honest when the sampling distribution is approximately normal. For p̂, check np ≥ 10 and n(1 − p) ≥ 10. For x̄, check that the population is normal or that n ≥ 30. Write the check down; graders look for it.',
      compare: {
        cols: [
          { title: 'For p̂', lines: ['np ≥ 10', 'n(1 − p) ≥ 10'], tone: 'accent' },
          { title: 'For x̄', lines: ['population normal, or', 'n ≥ 30 (the CLT)'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Divide by √n, not n',
      body: 'The SD of the sample mean is σ/√n. Dividing by n instead makes the spread look far too small: 12/36 = 0.33 instead of 12/√36 = 2. The CLT is also about the sample mean, not the population: a skewed population stays skewed.',
      formula: {
        tex: '\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{12}{\\sqrt{36}} = 2',
        note: 'The root sign is the whole point: averaging 36 scores cuts the spread by 6, not by 36.',
        parts: [
          { sym: '\\sqrt{n}', means: 'the root of the sample size, here 6', tone: 'ok' },
          { sym: 'n', means: 'dividing by this is the classic mistake', tone: 'bad' },
        ],
      },
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\frac{12}{36} = 0.33', lines: ['divided by n'], tone: 'bad' },
          { title: 'Right', tex: '\\frac{12}{\\sqrt{36}} = 2', lines: ['divided by √n'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: one person versus nine',
      body: 'IQ scores are normal with μ = 100 and σ = 15. Compare P(one person scores above 110) with P(the mean of 9 people is above 110).',
      steps: {
        steps: [
          { tex: 'z = \\frac{110 - 100}{15} \\approx 0.67', text: 'For one person, standardize with σ = 15. Scores are normal, so no CLT is needed. 110 is about two-thirds of an SD above the mean.' },
          { tex: 'P(Z > 0.67) = 1 - 0.7486 = 0.2514', text: 'Read the area to the left from the table and subtract from 1. About a 1 in 4 chance that a single person scores above 110.' },
          { tex: '\\sigma_{\\bar{x}} = \\frac{15}{\\sqrt{9}} = 5', text: 'For a mean of 9 people, use σ/√n. Since the population is normal, x̄ is normal even with n = 9, with SD 5.' },
          { tex: 'z = \\frac{110 - 100}{5} = 2,\\quad P = 1 - 0.9772 = 0.0228', text: 'Standardize with the SD 5 of x̄. 110 is now 2 SDs above 100, which leaves only 0.0228 in the upper tail.' },
        ],
        answer: '0.2514 \\text{ versus } 0.0228',
      },
    },
    {
      kind: 'summary',
      head: 'Sampling distributions, wrapped up',
      body: 'Statistics vary from sample to sample; the sampling distribution describes how. Both p̂ and x̄ are unbiased, and their SDs shrink with √n. p̂ is about normal under Large Counts; x̄ is normal if the population is, or by the CLT when n ≥ 30.',
      table: {
        head: ['Statistic', 'Mean', 'SD', 'Normal when'],
        rows: [
          ['p̂', 'p', '√(p(1 − p)/n)', 'np ≥ 10 and n(1 − p) ≥ 10'],
          ['x̄', 'μ', 'σ/√n', 'population normal, or n ≥ 30'],
        ],
        note: 'Quadruple n to halve either SD.',
      },
    },
  ],

  // ---------------- STAT-11 — Confidence intervals for proportions and means ----------------
  'STAT-11': [
    {
      kind: 'objective',
      head: 'Estimate, plus or minus',
      body: 'In a random sample of 100 adults, 60 own a bike. The sample says 0.60, but the true proportion could be a little higher or lower. Today you will turn one sample into a range, 0.504 to 0.696, and say exactly what the 95% means.',
      art: bell(0.6, 0.049, {
        alt: 'A normal curve centred at 0.60 with the middle 95% between 0.504 and 0.696 shaded',
        title: 'A 95% confidence interval for p',
        fmt: fmt2,
        shade: [[0.504, 0.696]],
        marks: [{ at: 0.504, label: '0.504' }, { at: 0.696, label: '0.696' }],
        labels: [{ text: '95%', at: 0.6, y: 150 }],
        caption: 'Estimate 0.60, margin of error 1.96 × 0.049 ≈ 0.096 on each side.',
      }),
    },
    {
      kind: 'concept',
      head: 'The anatomy of an interval',
      body: 'Every confidence interval has the same shape: an estimate in the middle, plus or minus a margin of error. The margin of error is a critical value times a standard error. Change the confidence level and only the critical value changes.',
      why: 'The estimate is our best single guess, but samples vary, so we surround it with a cushion. The standard error measures the typical sampling wobble, and the critical value says how many wobbles of cushion we need to be 90%, 95% or 99% sure the method captures the parameter. Changing the confidence level changes only how many SEs wide the cushion is.',
      formula: {
        tex: '\\text{estimate} \;\\pm\; (\\text{critical value}) \\times (\\text{standard error})',
        note: 'The right-hand product is the margin of error.',
        parts: [
          { sym: '\\text{estimate}', means: 'p̂ or x̄, the centre of the interval', tone: 'accent' },
          { sym: 'z^{*} \\text{ or } t^{*}', means: 'set by the confidence level', tone: 'ok' },
          { sym: '\\text{SE}', means: 'how much the estimate varies from sample to sample', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Proportions use z*',
      body: 'For a proportion the standard error is √(p̂(1 − p̂)/n), and the critical value comes from the normal curve. Conditions: a random sample, the 10% condition, and at least 10 successes and 10 failures.',
      why: 'The sampling distribution of p̂ is approximately normal, and 95% of a normal curve lies within 1.96 SDs of its centre. So p̂ lands within 1.96 SEs of p about 95% of the time, which also means p lies within 1.96 SEs of p̂ about 95% of the time. We use p̂ inside the SE because we do not know p.',
      formula: {
        tex: '\\hat{p} \\pm z^{*}\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}',
        note: 'z* = 1.645 for 90%, 1.960 for 95%, 2.576 for 99%.',
        parts: [
          { sym: '\\hat{p}', means: 'the sample proportion', tone: 'accent' },
          { sym: 'z^{*}', means: 'the critical value for the level', tone: 'ok' },
          { sym: 'n\\hat{p} \\ge 10,\\ n(1-\\hat{p}) \\ge 10', means: 'the check that the normal curve applies', tone: 'warn' },
        ],
      },
      table: {
        head: ['Confidence', 'z*'],
        rows: [['90%', '1.645'], ['95%', '1.960'], ['99%', '2.576']],
        mark: 1,
        note: 'Higher confidence, bigger z*, wider interval.',
      },
    },
    {
      kind: 'concept',
      head: 'Means use t*',
      body: 'For a mean you must estimate σ with the sample SD s, and that extra uncertainty is paid for with a t critical value, df = n − 1. Conditions: random, 10%, and a normal population or n ≥ 30 (or no strong skew and no outliers in a small sample).',
      why: 'Replacing σ with s adds extra variation, because s itself changes from sample to sample, especially in small samples. The t curve has heavier tails to pay for that, so t* is larger than z*. As n grows s becomes a reliable estimate and the t curve sits close to the normal one. For 95% and df = 15, t* = 2.131 against z* = 1.960.',
      formula: {
        tex: '\\bar{x} \\pm t^{*}\\,\\frac{s}{\\sqrt{n}}, \\qquad df = n - 1',
        note: 't* is a little bigger than z*, and the gap closes as n grows.',
        parts: [
          { sym: 's/\\sqrt{n}', means: 'the standard error of x̄, using s for σ', tone: 'accent' },
          { sym: 't^{*}', means: 'from the t table with n − 1 degrees of freedom', tone: 'ok' },
        ],
      },
      compare: {
        cols: [
          { title: 'Proportion', tex: 'z^{*}', lines: ['σ of p̂ comes from p̂ itself', 'normal curve'], tone: 'accent' },
          { title: 'Mean', tex: 't^{*},\\ df = n - 1', lines: ['s stands in for σ', 't curve, heavier tails'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'What 95% actually means',
      body: 'The 95% is about the METHOD. Imagine many random samples, each turned into an interval. About 95% of those intervals capture the true p; about 5% miss. You have one of them and do not know which kind it is.',
      why: 'Think of each interval as a net thrown at a fixed target. The target p never moves; every sample throws a differently placed net. The method is built so that 95% of the nets catch the target. After you throw one net you cannot see whether it caught the target, but you do know how often this kind of net succeeds.',
      art: captureStrips({
        alt: 'Twenty horizontal confidence intervals stacked across a dashed vertical line at the true proportion; nineteen cross the line and one misses it',
        title: 'Twenty samples, twenty intervals',
        caption: 'Nineteen of twenty capture the true p. That long-run capture rate is the confidence level.',
      }),
    },
    {
      kind: 'example',
      head: 'Start simple: 60 bikes in 100',
      body: 'In a random sample of 100 adults, 60 own a bike. Build a 95% confidence interval for the proportion of all adults who own a bike.',
      steps: {
        steps: [
          { tex: 'n\\hat{p} = 60 \\ge 10,\\quad n(1-\\hat{p}) = 40 \\ge 10', text: 'Check the conditions first: the sample is random, 100 is under 10% of all adults, and there are at least 10 successes and 10 failures. So the normal model is fine.' },
          { tex: '\\hat{p} = \\tfrac{60}{100} = 0.60', text: 'The sample proportion is the estimate, and it sits at the centre of the interval because the interval is symmetric around it.' },
          { tex: '\\text{SE} = \\sqrt{\\tfrac{0.6(0.4)}{100}} = \\sqrt{0.0024} \\approx 0.049', text: 'The standard error measures how much p̂ typically wobbles. We use p̂ for p, since the true p is unknown when building an interval.' },
          { tex: '\\text{ME} = 1.96 \\times 0.049 \\approx 0.096', text: 'Multiply the SE by z* = 1.96, the critical value that captures the middle 95% of a normal curve. This product is the margin of error.' },
          { tex: '0.60 \\pm 0.096', text: 'Go 0.096 below and 0.096 above the estimate: 0.60 − 0.096 = 0.504 and 0.60 + 0.096 = 0.696.' },
        ],
        answer: '(0.504,\\ 0.696)',
      },
    },
    {
      kind: 'example',
      head: 'Say it in words',
      body: 'Interpret the interval (0.504, 0.696) and the 95% level in words. What three things must a good interpretation name?',
      steps: {
        steps: [
          { text: 'Name the parameter: the true proportion of ALL adults who own a bike. The interval is a statement about the whole population, not about the 100 people sampled.' },
          { text: 'Interpret the interval: we are 95% confident that the interval from 0.504 to 0.696 captures the true proportion of adults who own a bike. The word captures keeps the interval as the thing that varies.' },
          { text: 'Interpret the level separately: if we took many random samples of 100 adults and built an interval from each, about 95% of those intervals would capture the true proportion.' },
          { text: 'Avoid saying there is a 95% chance p is in this interval. Once the interval is computed, p is either inside or not, and the 95% describes how often the method succeeds.' },
        ],
        answer: '\\text{We are 95\\% confident the interval } (0.504,\\ 0.696) \\text{ captures the true proportion}',
      },
      compare: {
        cols: [
          { title: 'The interval', lines: ['"We are 95% confident that', 'the interval (0.504, 0.696) captures', 'the true proportion of bike owners."'], tone: 'ok' },
          { title: 'The level', lines: ['"In repeated sampling, about 95%', 'of intervals made this way', 'capture the true proportion."'], tone: 'accent' },
        ],
        note: 'Parameter, context, and the word "captures". Those three things earn the points.',
      },
    },
    {
      kind: 'example',
      head: 'A 90% interval for voters',
      body: 'Of 400 randomly chosen voters, 100 support a measure. Build a 90% confidence interval for the proportion of all voters who support it.',
      steps: {
        steps: [
          { tex: 'n\\hat{p} = 100 \\ge 10,\\quad n(1-\\hat{p}) = 300 \\ge 10', text: 'Check the conditions: the sample is random, 400 is under 10% of all voters, and there are at least 10 successes and 10 failures.' },
          { tex: '\\hat{p} = \\tfrac{100}{400} = 0.25,\\quad z^{*} = 1.645', text: 'The estimate is 100/400. A 90% level leaves 5% in each tail, so z* = 1.645, which is smaller than 1.96 because we ask for less confidence.' },
          { tex: '\\text{SE} = \\sqrt{\\tfrac{0.25(0.75)}{400}} \\approx 0.0217', text: 'Compute p̂(1 − p̂) = 0.1875, divide by 400 to get 0.00046875, and take the square root to get the standard error 0.0217.' },
          { tex: '\\text{ME} = 1.645(0.0217) \\approx 0.036', text: 'Multiply the critical value by the SE to get the margin of error, about 0.036, or 3.6 percentage points.' },
          { tex: '0.25 \\pm 0.036', text: 'Subtract and add the margin of error: 0.25 − 0.036 = 0.214 and 0.25 + 0.036 = 0.286.' },
        ],
        answer: '(0.214,\\ 0.286)',
      },
    },
    {
      kind: 'example',
      head: 'Flour bags: a t-interval',
      body: 'A random sample of 16 bags has mean 50.0 oz and SD 8.0 oz; weights are roughly normal. Build a 95% confidence interval for the mean weight of all bags.',
      steps: {
        steps: [
          { text: 'Check the conditions: the sample is random, 16 is under 10% of all bags, and the weights are roughly normal. That matters because n = 16 is too small for the CLT to rescue us.' },
          { tex: 'df = 16 - 1 = 15 \\Rightarrow t^{*} = 2.131', text: 'The population SD is unknown, so use a t critical value with df = n − 1 = 15. At 95%, the t table gives 2.131, a little larger than z* = 1.96.' },
          { tex: '\\text{SE} = \\frac{8}{\\sqrt{16}} = 2', text: 'The standard error of x̄ is s/√n, using the sample SD s = 8 in place of σ. The root of 16 is 4, so the SE is 2 oz.' },
          { tex: '\\text{ME} = 2.131 \\times 2 \\approx 4.26', text: 'Multiply the critical value by the SE. The margin of error is 4.26 oz.' },
          { tex: '50 \\pm 4.26', text: 'Subtract and add the margin of error: 50 − 4.26 = 45.74 and 50 + 4.26 = 54.26.' },
        ],
        answer: '(45.74,\\ 54.26)\\text{ oz}',
      },
      art: bell(50, 2, {
        alt: 'A bell curve centred at 50 ounces with the middle band from 45.74 to 54.26 shaded',
        title: '95% t-interval for the mean, df = 15',
        shade: [[45.74, 54.26]],
        marks: [{ at: 45.74, label: '45.74' }, { at: 54.26, label: '54.26' }],
        labels: [{ text: 't* = 2.131', at: 50, y: 150 }],
        caption: 'The standard error is 8/√16 = 2 oz; t* = 2.131 stretches it to a margin of 4.26.',
      }),
    },
    {
      kind: 'example',
      head: 'Another way: read the interval backwards',
      body: 'An interval for a proportion is reported as (0.42, 0.50). What were p̂ and the margin of error? Work from the two endpoints.',
      steps: {
        steps: [
          { tex: '\\text{width} = 0.50 - 0.42 = 0.08', text: 'The interval runs from p̂ − ME to p̂ + ME, so its width is 2 times the margin of error. Start by subtracting the endpoints.' },
          { tex: '\\text{ME} = \\tfrac{0.08}{2} = 0.04', text: 'Divide the width by 2 to get the margin of error, since the margin is added once on each side of the estimate.' },
          { tex: '\\hat{p} = \\tfrac{0.42 + 0.50}{2} = 0.46', text: 'The estimate sits exactly at the midpoint, so average the two endpoints. This works because the interval is symmetric around p̂.' },
          { tex: '0.46 \\pm 0.04 = (0.42,\\ 0.50)', text: 'Check by rebuilding the interval from your answers. 0.46 − 0.04 = 0.42 and 0.46 + 0.04 = 0.50, which matches.' },
        ],
        answer: '\\hat{p} = 0.46,\\ \\text{ME} = 0.04',
      },
    },
    {
      kind: 'example',
      head: 'Sleep: 25 students',
      body: 'A random sample of 25 students sleeps a mean of 7.2 hours with SD 1.5 hours. Build a 95% confidence interval for the mean nightly sleep of all students.',
      steps: {
        steps: [
          { text: 'Check the conditions: random sample, 25 is under 10% of all students. Because n is below 30, we would also look at a graph of the data for no strong skew or outliers; assume that is fine here.' },
          { tex: 'df = 25 - 1 = 24 \\Rightarrow t^{*} = 2.064', text: 'Use a t critical value because σ is unknown. With df = n − 1 = 24, the 95% value is 2.064.' },
          { tex: '\\text{SE} = \\tfrac{1.5}{\\sqrt{25}} = 0.30', text: 'The standard error is the sample SD over the root of n. The root of 25 is 5, so 1.5/5 = 0.30 hours.' },
          { tex: '\\text{ME} = 2.064(0.30) \\approx 0.62', text: 'Multiply the critical value by the SE: 2.064 × 0.30 = 0.6192, about 0.62 hours.' },
          { tex: '7.2 \\pm 0.62', text: 'Subtract and add the margin of error: 7.2 − 0.62 = 6.58 and 7.2 + 0.62 = 7.82.' },
        ],
        answer: '(6.58,\\ 7.82)\\text{ hours}',
      },
    },
    {
      kind: 'example',
      head: 'Picture it first: how many to poll?',
      body: 'A pollster wants a 95% interval with margin of error at most 0.03 and no guess for p. How many people must be polled? Picture the margin shrinking as n grows.',
      steps: {
        steps: [
          { tex: '1.96\\sqrt{\\tfrac{\\hat{p}(1-\\hat{p})}{n}} \\le 0.03', text: 'Start from the margin of error formula and ask that it be at most 0.03. We then solve this inequality for n.' },
          { tex: '\\hat{p}(1-\\hat{p}) = 0.5(0.5) = 0.25', text: 'With no guess for p, use p̂ = 0.5. That makes p̂(1 − p̂) as large as possible, 0.25, so the sample size will be big enough whatever p turns out to be.' },
          { tex: 'n \\ge \\left(\\tfrac{1.96}{0.03}\\right)^{2}(0.25) = 4268.4 \\times 0.25 \\approx 1067.1', text: 'Square both sides to remove the root and move n to the left. Now 1.96/0.03 is about 65.33, its square is about 4268.4, and times 0.25 gives about 1067.1.' },
          { tex: 'n = 1068', text: 'Round UP, never down. A sample of 1067 would give a margin of error just above 0.03, so only 1068 people guarantee it is at most 0.03.' },
        ],
        answer: 'n = 1068',
      },
      formula: {
        tex: 'n = \\left(\\frac{z^{*}}{\\text{ME}}\\right)^{2} \\hat{p}(1-\\hat{p})',
        note: 'With no guess, p̂ = 0.5 makes p̂(1 − p̂) as big as it can be: 0.25.',
        parts: [
          { sym: 'z^{*}/\\text{ME}', means: 'the margin you want, in critical values', tone: 'accent' },
          { sym: '0.25', means: 'the safest value of p̂(1 − p̂)', tone: 'ok' },
        ],
      },
      table: {
        head: ['Margin of error', 'n needed (95%, p̂ = 0.5)'],
        rows: [['0.05', '385'], ['0.03', '1068'], ['0.02', '2401']],
        mark: 1,
        note: 'Cutting the margin from 0.05 to 0.03 nearly triples the sample.',
      },
    },
    {
      kind: 'protip',
      head: 'Wider or narrower?',
      body: 'Two dials move the width. Raise the confidence level and z* grows, so the interval widens. Take a larger sample and the standard error shrinks, so it narrows. Same bikes data at three levels: the 99% interval is the widest.',
      art: intervalStack(
        [
          { label: '90%', lo: 0.519, hi: 0.681, color: EMR },
          { label: '95%', lo: 0.504, hi: 0.696, color: SKY },
          { label: '99%', lo: 0.474, hi: 0.726, color: VIO },
        ],
        [0.4, 0.8],
        {
          alt: 'Three confidence intervals for the same sample proportion 0.6 stacked over one scale: 90% is the narrowest and 99% the widest',
          title: 'Same sample, three confidence levels',
          center: { at: 0.6, label: 'p̂ = 0.6' },
          caption: 'z* = 1.645, 1.960 and 2.576 times the same SE of 0.049.',
        },
      ),
    },
    {
      kind: 'trap',
      head: 'Not "a 95% chance p is in here"',
      body: 'The parameter does not move; the interval does. Once you have an interval, p is either in it or not. Confidence describes how often the method succeeds, not a probability about this one interval. And the interval is about the parameter, never about individuals.',
      compare: {
        cols: [
          { title: 'Wrong', lines: ['"There is a 95% chance', 'p is between 0.504 and 0.696."', '"95% of adults are in this range."'], tone: 'bad' },
          { title: 'Right', lines: ['"We are 95% confident the interval', 'captures the true proportion', 'of all adults who own a bike."'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: the bikes at 99%',
      body: 'Redo the bike interval (p̂ = 0.60, n = 100) at 99% confidence. What changes, and what stays the same?',
      steps: {
        steps: [
          { tex: '\\hat{p} = 0.60,\\quad \\text{SE} = 0.049', text: 'The estimate and the standard error come from the same data, so they do not change. Only the critical value depends on the confidence level.' },
          { tex: 'z^{*} = 2.576', text: 'A 99% level leaves only 0.5% in each tail, so we must go farther out on the normal curve: z* = 2.576, bigger than 1.96.' },
          { tex: '\\text{ME} = 2.576 \\times 0.049 \\approx 0.126', text: 'Multiply the larger critical value by the same SE. The margin of error grows from 0.096 to 0.126.' },
          { tex: '0.60 \\pm 0.126', text: 'Subtract and add the new margin: 0.60 − 0.126 = 0.474 and 0.60 + 0.126 = 0.726. It is about 0.03 wider on each side than at 95%.' },
        ],
        answer: '(0.474,\\ 0.726)',
      },
    },
    {
      kind: 'summary',
      head: 'Confidence intervals, wrapped up',
      body: 'Estimate ± critical value × SE. Proportions use z* and √(p̂(1 − p̂)/n); means use t* with df = n − 1 and s/√n. Interpret the interval about the parameter in context, and the level as a long-run capture rate. Plan n with p̂ = 0.5 and round up.',
      table: {
        head: ['', 'Proportion', 'Mean'],
        rows: [
          ['estimate', 'p̂', 'x̄'],
          ['SE', '√(p̂(1 − p̂)/n)', 's/√n'],
          ['critical value', 'z*: 1.645, 1.960, 2.576', 't*, df = n − 1'],
          ['conditions', 'random, 10%, 10 successes and failures', 'random, 10%, normal or n ≥ 30'],
        ],
      },
    },
  ],

  // ---------------- STAT-12 — Significance tests: hypotheses, p-values and errors ----------------
  'STAT-12': [
    {
      kind: 'objective',
      head: 'Is the coin fair?',
      body: 'A coin lands heads 60 times in 100 flips. Chance alone could do that, or the coin could be bent. Today you will weigh the evidence: if the coin were fair, how often would 60 or more heads happen? That number, the p-value, decides.',
      art: bell(0.5, 0.05, {
        alt: 'A normal curve centred at 0.50 with standard deviation 0.05, both tails beyond 0.40 and 0.60 shaded',
        title: 'If the coin is fair, how extreme is 0.60?',
        fmt: fmt2,
        shade: [[0.6, 0.7], [0.3, 0.4]],
        marks: [{ at: 0.6, label: 'p̂ = 0.60' }, { at: 0.4, label: '0.40' }],
        labels: [{ text: '0.0228', at: 0.64 }, { text: '0.0228', at: 0.36 }],
        caption: 'Two tails of 0.0228 each: a p-value of 0.0456.',
      }),
    },
    {
      kind: 'concept',
      head: 'Hypotheses are about parameters',
      body: 'H0 says "nothing special" with an equals sign: p = 0.5 or μ = 500. Ha is what you suspect: less than, greater than, or not equal. Write both about the parameter, before you look at the data.',
      why: 'We assume H0 is true and ask whether the data make that assumption look foolish, like a trial that starts by presuming innocence. That only works if H0 is one exact claim, which is why it uses an equals sign. Hypotheses are about the parameter, not p̂, because p̂ is already known, and writing them before seeing the data stops us choosing Ha to fit the result.',
      formula: {
        tex: 'H_0:\\ p = 0.5 \\qquad H_a:\\ p \\ne 0.5',
        note: 'Null: the coin is fair. Alternative: it is not, in either direction.',
        parts: [
          { sym: 'H_0', means: 'the claim being tested; always an equals sign', tone: 'accent' },
          { sym: 'H_a', means: 'what the data might show instead', tone: 'ok' },
          { sym: 'p', means: 'the parameter, never the statistic p̂', tone: 'warn' },
        ],
      },
      compare: {
        cols: [
          { title: 'One-sided', tex: 'H_a:\\ p < 0.8', lines: ['a direction is suspected', 'one tail'], tone: 'accent' },
          { title: 'Two-sided', tex: 'H_a:\\ p \\ne 0.5', lines: ['any difference counts', 'two tails'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'The test statistic',
      body: 'The test statistic measures how far the data sit from H0, in standard errors. For a proportion, the SE uses the null value p0. For a mean, s stands in for σ and the statistic is a t with df = n − 1.',
      why: 'A raw gap such as 0.60 − 0.50 = 0.10 means little until you know how much p̂ normally varies. Dividing by the standard error turns the gap into a count of standard errors, a z or t that sits on a common scale. For a proportion the SE uses p0, because the test works in a world where H0 is true and p0 is the proportion in that world.',
      formula: {
        tex: 'z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}}, \\qquad t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}',
        note: 'Observed minus hypothesized, over the standard error.',
        parts: [
          { sym: '\\hat{p} - p_0', means: 'how far the sample is from the null claim', tone: 'accent' },
          { sym: '\\sqrt{p_0(1-p_0)/n}', means: 'the SE if H0 is true: use p0, not p̂', tone: 'warn' },
          { sym: 's/\\sqrt{n}', means: 'the SE of x̄; t has df = n − 1', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'The p-value',
      body: 'The p-value is the probability, IF H0 were true, of a statistic at least as extreme as the one you got. A two-sided test counts both tails, so double the one-tail area. Small p-value: the data would be surprising under H0.',
      why: 'The curve shows what sample results look like if H0 is true. The p-value is the area in the tails beyond our result, the share of those results at least as extreme as ours. A small area means a result like ours would rarely happen by chance, which casts doubt on H0. A two-sided test counts extremes in both directions, so the one-tail area is doubled.',
      art: bell(0, 1, {
        alt: 'A standard normal curve with both tails beyond 2 and minus 2 shaded, each tail labelled 0.0228',
        title: 'Two-sided p-value: 2 × 0.0228 = 0.0456',
        fmt: (v) => plain(v).replace('-', '−'),
        shade: [[2, 4], [-4, -2]],
        marks: [{ at: 2, label: '2.0' }, { at: -2, label: '−2.0' }],
        labels: [{ text: '0.0228', at: 2.8 }, { text: '0.0228', at: -2.8 }],
        caption: 'A statistic of 2.0 standard errors leaves 0.0228 in each tail.',
      }),
    },
    {
      kind: 'concept',
      head: 'Decide at α, conclude in context',
      body: 'Pick a significance level α before testing, usually 0.05. If the p-value is at or below α, reject H0: there is convincing evidence for Ha. Otherwise fail to reject H0; you never "accept" it. Then say what that means for the coin, the bags, the customers.',
      why: 'The level α is the false-alarm rate you are willing to tolerate. You choose it first so you cannot move the bar after seeing the result. If the p-value is at most α, the data are rarer than your tolerance. A large p-value only shows a lack of evidence, since a small sample can miss a real effect, so we say fail to reject rather than accept.',
      compare: {
        cols: [
          { title: 'p-value ≤ α', lines: ['reject H0', '"convincing evidence that…"'], tone: 'ok' },
          { title: 'p-value > α', lines: ['fail to reject H0', '"not enough evidence that…"'], tone: 'warn' },
        ],
        note: 'Both conclusions end with the parameter, in the words of the problem.',
      },
    },
    {
      kind: 'concept',
      head: 'Two kinds of error',
      body: 'A Type I error rejects a true H0; its probability is α. A Type II error fails to reject a false H0; its probability is β. Power is 1 − β, the chance of catching a real effect, and it rises with a bigger sample, a bigger α, or a bigger true effect.',
      why: 'If H0 is true and you test at α = 0.05, about 5% of samples land in the rejection region by chance, which is the Type I error rate. If H0 is false the test can still miss it when the sample is small or noisy, which is a Type II error. Moving the cutoff trades one error for the other: a stricter cutoff makes false alarms rarer but real effects easier to miss.',
      table: {
        head: ['', 'Reject H0', 'Fail to reject H0'],
        rows: [['H0 is true', 'Type I error (prob. α)', 'correct'], ['H0 is false', 'correct (power = 1 − β)', 'Type II error (prob. β)']],
        note: 'Lowering α makes Type I rarer but Type II more common.',
      },
      formula: {
        tex: 'P(\\text{Type I}) = \\alpha, \\qquad P(\\text{Type II}) = \\beta, \\qquad \\text{power} = 1 - \\beta',
        note: 'Power is the probability the test rejects when it should.',
        parts: [
          { sym: '\\alpha', means: 'false alarm rate, set by you', tone: 'bad' },
          { sym: '\\beta', means: 'missed effect rate', tone: 'warn' },
          { sym: '1 - \\beta', means: 'power: grows with n', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Start simple: 60 heads in 100',
      body: 'A coin lands heads 60 times in 100 flips. Test at α = 0.05 whether the coin is fair. Follow the four steps: state, plan, do, conclude.',
      steps: {
        steps: [
          { tex: 'H_0:\\ p = 0.5,\\quad H_a:\\ p \\ne 0.5', text: 'State the hypotheses about the true proportion p of heads. The alternative is two-sided because we want to detect a bent coin in either direction.' },
          { tex: 'np_0 = 50 \\ge 10,\\quad n(1-p_0) = 50 \\ge 10', text: 'Plan: this is a one-sample z-test for a proportion. The flips are random and independent, and under H0 we expect 50 heads and 50 tails, both at least 10.' },
          { tex: 'z = \\frac{0.60 - 0.50}{\\sqrt{0.5(0.5)/100}} = \\frac{0.10}{0.05} = 2.0', text: 'Do: the SE uses p0 = 0.5 because we assume H0 is true. A gap of 0.10 is two standard errors above fair.' },
          { tex: 'p\\text{-value} = 2(0.0228) = 0.0456', text: 'The area above z = 2.0 is 0.0228. Since Ha is two-sided, the equally extreme low tail counts too, so double it.' },
          { tex: '0.0456 < 0.05', text: 'Conclude: the p-value is below α, so reject H0. There is convincing evidence that the coin is not fair, that is, that the true proportion of heads is not 0.5.' },
        ],
        answer: '0.0456 < 0.05:\\ \\text{reject } H_0',
      },
    },
    {
      kind: 'example',
      head: 'Satisfaction below 80%?',
      body: 'A company claims 80% of customers are satisfied; in a random sample of 200, only 150 are. Is there evidence that satisfaction is below 80%?',
      steps: {
        steps: [
          { tex: 'H_0:\\ p = 0.8,\\quad H_a:\\ p < 0.8', text: 'State the hypotheses. The question asks whether satisfaction is below the claim, so Ha has one direction and the test is one-sided.' },
          { tex: 'np_0 = 160 \\ge 10,\\quad n(1-p_0) = 40 \\ge 10', text: 'Plan: a one-sample z-test for a proportion. The sample is random, 200 is under 10% of customers, and under H0 we expect 160 satisfied and 40 not, both at least 10.' },
          { tex: '\\text{SE} = \\sqrt{\\tfrac{0.8(0.2)}{200}} = \\sqrt{0.0008} \\approx 0.0283', text: 'Compute the SE using p0 = 0.8, since the test assumes H0 is true. Multiply 0.8 by 0.2, divide by 200, and take the root.' },
          { tex: 'z = \\frac{0.75 - 0.80}{0.0283} \\approx -1.77', text: 'The sample proportion is 150/200 = 0.75. The negative z shows it lies 1.77 standard errors below the claim.' },
          { tex: 'P(Z < -1.77) = 0.0384 < 0.05', text: 'Only the lower tail counts because Ha says less than. The area is 0.0384, below α = 0.05, so reject H0. There is evidence that satisfaction is below 80%.' },
        ],
        answer: '0.0384 < 0.05:\\ \\text{reject } H_0',
      },
      art: bell(0.8, 0.0283, {
        alt: 'A normal curve centred at 0.80 with the left tail below 0.75 shaded',
        title: 'Under H₀, how often is p̂ this low?',
        fmt: fmt2,
        shade: [[0.6, 0.75]],
        marks: [{ at: 0.75, label: 'p̂ = 0.75' }],
        labels: [{ text: 'p-value 0.038', at: 0.728 }],
        caption: 'One tail only, because Ha points one way: p < 0.8.',
      }),
    },
    {
      kind: 'example',
      head: 'Rice bags: a t-test',
      body: 'Bags are labelled 500 g. A random sample of 16 has mean 495 g and SD 8 g; weights are roughly normal. Is there evidence the bags are underfilled?',
      steps: {
        steps: [
          { tex: 'H_0:\\ \\mu = 500,\\quad H_a:\\ \\mu < 500', text: 'State the hypotheses about the mean. Underfilled means below the label, so the alternative is one-sided and uses the less-than sign.' },
          { text: 'Plan: a one-sample t-test for a mean, because σ is unknown. The sample is random, 16 is under 10% of bags, and weights are roughly normal, which matters because n is small.' },
          { tex: 't = \\frac{495 - 500}{8/\\sqrt{16}} = \\frac{-5}{2} = -2.5', text: 'The SE is s/√n = 8/4 = 2. The sample mean is 5 g below the label, which is 2.5 standard errors low, so t is negative.' },
          { tex: 'df = 15:\\ P(t_{15} < -2.5) \\approx 0.012', text: 'With df = n − 1 = 15, the left-tail area beyond −2.5 on the t curve is about 0.012. Only one tail counts since Ha is one-sided.' },
          { tex: '0.012 < 0.05', text: 'The p-value is below α, so reject H0. There is convincing evidence that the true mean fill is less than 500 g.' },
        ],
        answer: '0.012 < 0.05:\\ \\text{reject } H_0',
      },
    },
    {
      kind: 'example',
      head: 'Cereal protein: two-sided t',
      body: 'A box claims 10 g of protein per serving. A random sample of 25 servings has mean 10.4 g and SD 1.5 g. Is there evidence the true mean differs from 10 g?',
      steps: {
        steps: [
          { tex: 'H_0:\\ \\mu = 10,\\quad H_a:\\ \\mu \\ne 10', text: 'State the hypotheses. The question asks whether the mean differs, in either direction, so the alternative is two-sided.' },
          { tex: 't = \\frac{10.4 - 10}{1.5/\\sqrt{25}} = \\frac{0.4}{0.3} \\approx 1.33', text: 'The SE is s/√n = 1.5/5 = 0.3. The sample mean is only about 1.33 standard errors from the claim, not far for a sample mean.' },
          { tex: 'df = 24:\\ p\\text{-value} \\approx 2(0.0975) = 0.195', text: 'With df = 24 the upper tail beyond 1.33 is about 0.0975. The test is two-sided, so double it to include the matching low tail.' },
          { tex: '0.195 > 0.05', text: 'The p-value is larger than α, so fail to reject H0. There is not enough evidence the mean differs from 10 g. The claim survives, but we have not proven it.' },
        ],
        answer: '\\text{fail to reject } H_0',
      },
    },
    {
      kind: 'example',
      head: 'Another way: let a confidence interval decide',
      body: 'For the coin, can a 95% confidence interval reach the same verdict as the two-sided test? Build it and see whether 0.5 is inside.',
      steps: {
        steps: [
          { tex: '\\text{SE} = \\sqrt{\\tfrac{0.6(0.4)}{100}} \\approx 0.049', text: 'An interval uses p̂ = 0.6 in the SE, because it estimates the true p and so does not assume anything about H0. This is a different SE from the test.' },
          { tex: '0.6 \\pm 1.96(0.049) = (0.504,\\ 0.696)', text: 'Multiply 1.96 by 0.049 to get a margin of 0.096, then go that far each side of 0.6.' },
          { tex: '0.5 \\notin (0.504,\\ 0.696)', text: 'The null value 0.5 is outside the interval. A 95% interval holds only the values that are plausible at the 5% level, so 0.5 is not plausible.' },
          { tex: '\\text{reject } p = 0.5', text: 'This agrees with the two-sided test at α = 0.05, which also rejected. The two SEs differ slightly, so a result very close to the cutoff could split, but here they match.' },
        ],
        answer: '\\text{reject } p = 0.5',
      },
      compare: {
        cols: [
          { title: 'Test', tex: 'z = 2.0,\\ p = 0.0456', lines: ['SE uses p0 = 0.5', 'reject at α = 0.05'], tone: 'accent' },
          { title: 'Interval', tex: '(0.504,\\ 0.696)', lines: ['SE uses p̂ = 0.6', '0.5 is outside: reject'], tone: 'ok' },
        ],
        note: 'A 95% interval and a two-sided test at α = 0.05 reach the same verdict.',
      },
    },
    {
      kind: 'example',
      head: 'Picture it first: the smoke detector',
      body: 'A smoke detector tests H0: “no fire” against Ha: “fire”. What do Type I and Type II errors mean here, and which is worse?',
      steps: {
        steps: [
          { tex: '\\text{Type I: reject true } H_0', text: 'A Type I error rejects a true H0: the alarm sounds although there is no fire. The cost is annoyance and a wasted evacuation, and its probability is α.' },
          { tex: '\\text{Type II: miss a false } H_0', text: 'A Type II error fails to reject a false H0: a real fire and a silent detector. The cost is danger to life, and its probability is β.' },
          { text: 'Compare the costs. Missing a real fire is far worse than a false alarm, so here Type II is the error we most want to avoid.' },
          { tex: '\\text{raise } \\alpha \\Rightarrow \\text{lower } \\beta,\\ \\text{power} = 1 - \\beta \\text{ rises}', text: 'Use a larger α. A more sensitive detector sounds more easily, so it misses fewer real fires, which means a smaller β and more power, at the price of more false alarms.' },
        ],
        answer: '\\text{Type II is worse: accept a larger } \\alpha \\text{ to gain power}',
      },
      table: {
        head: ['', 'Alarm sounds (reject H0)', 'Silent (fail to reject)'],
        rows: [['No fire', 'Type I: false alarm', 'correct'], ['Fire', 'correct', 'Type II: missed fire']],
        mark: 1,
        note: 'Decide which error hurts more, then set α to protect against it.',
      },
    },
    {
      kind: 'protip',
      head: 'Four steps, every time',
      body: 'State the hypotheses and the parameter. Plan: name the test and check its conditions. Do: statistic, df if any, p-value. Conclude: compare to α and answer the question in context. A test with all four steps earns full credit even when the arithmetic slips.',
      art: flow(
        [{ label: 'State', color: SKY }, { label: 'Plan', color: AMB }, { label: 'Do', color: EMR }, { label: 'Conclude', color: VIO }],
        { horizontal: true, title: 'The four-step significance test', alt: 'Four boxes in a row reading State, Plan, Do and Conclude', caption: 'Hypotheses, conditions, calculation, conclusion in context.' },
      ),
    },
    {
      kind: 'trap',
      head: 'The p-value is not P(H0 is true)',
      body: 'A p-value of 0.0456 does NOT mean there is a 4.56% chance the coin is fair. It means that IF the coin were fair, data this extreme would happen 4.56% of the time. And "fail to reject" is not "accept": a big p-value is a lack of evidence, not proof of H0.',
      compare: {
        cols: [
          { title: 'Wrong', lines: ['"There is a 4.6% chance H0 is true."', '"p > 0.05, so H0 is true."'], tone: 'bad' },
          { title: 'Right', lines: ['"If H0 were true, data this extreme', 'would occur 4.6% of the time."', '"Not enough evidence against H0."'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: the same p̂, four times the data',
      body: 'A coin shows p̂ = 0.55. Test H0: p = 0.5 against p ≠ 0.5 with n = 100, then with n = 400. Does the sample size change the verdict?',
      steps: {
        steps: [
          { tex: 'n = 100:\\ \\text{SE} = \\sqrt{\\tfrac{0.25}{100}} = 0.05,\\ z = \\frac{0.05}{0.05} = 1.0', text: 'With 100 flips the gap of 0.05 is exactly one standard error, since the SE under H0 is 0.05. That is a very common amount of chance wobble.' },
          { tex: 'p\\text{-value} = 2(0.1587) = 0.317', text: 'The upper tail beyond z = 1.0 is 0.1587. Double it for the two-sided test. A p-value of 0.317 is above 0.05, so fail to reject.' },
          { tex: 'n = 400:\\ \\text{SE} = \\sqrt{\\tfrac{0.25}{400}} = 0.025', text: 'Four times the data halves the SE, because the SE shrinks with √n. The gap of 0.05 stays the same size.' },
          { tex: 'z = \\frac{0.05}{0.025} = 2.0,\\ p\\text{-value} = 0.0456', text: 'Now the same gap is two standard errors, so the p-value drops to 0.0456, below 0.05, and we reject. Bigger samples can detect smaller gaps.' },
        ],
        answer: '\\text{fail to reject at } n = 100;\\ \\text{reject at } n = 400',
      },
    },
    {
      kind: 'summary',
      head: 'Significance tests, wrapped up',
      body: 'Hypotheses about a parameter, written before the data. A test statistic in standard errors, using p0 for a proportion or s/√n with df = n − 1 for a mean. A p-value computed assuming H0, doubled for two-sided tests. Compare to α, conclude in context, and know which error you fear more.',
      table: {
        head: ['Step', 'What to write'],
        rows: [
          ['State', 'H0: p = p0 (or μ = μ0); Ha with <, > or ≠'],
          ['Plan', 'one-sample z for p or t for μ; check conditions'],
          ['Do', 'z or t, df, p-value (double if two-sided)'],
          ['Conclude', 'p ≤ α: reject; p > α: fail to reject; in context'],
        ],
      },
    },
  ],

  // ---------------- STAT-13 — Two-sample tests and chi-square tests ----------------
  'STAT-13': [
    {
      kind: 'objective',
      head: 'Compare two groups',
      body: 'In a drug trial, 60 of 100 treated patients improved versus 45 of 100 on a placebo. Is a 15-point gap real, or could two equal groups drift that far apart by chance? Today you will compare two proportions, two means, paired data, and whole tables of counts.',
      art: pmf(['drug (60 of 100)', 'placebo (45 of 100)'], [0.6, 0.45], {
        alt: 'Two bars: 0.60 of the drug group improved and 0.45 of the placebo group improved',
        title: 'Improvement rate in each group',
        fmt: fmt2,
        xLabel: 'proportion who improved',
        caption: 'A gap of 0.15. The test asks how many standard errors that is.',
      }),
    },
    {
      kind: 'concept',
      head: 'Two proportions: pool first',
      body: 'To test H0: p1 = p2, act as if the two groups share one rate. Pool the successes to estimate it, build the standard error from the pooled rate, and measure the gap p̂1 − p̂2 in those standard errors.',
      why: 'H0 says the two groups share the same success rate, so under H0 the best estimate of that one rate uses all the data: total successes over total people. The SE must describe a world where H0 is true, so it uses the pooled rate. The factor 1/n1 + 1/n2 appears because the difference of two independent proportions has a variance equal to the sum of their variances.',
      formula: {
        tex: 'z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}_c(1-\\hat{p}_c)\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}}, \\qquad \\hat{p}_c = \\frac{x_1 + x_2}{n_1 + n_2}',
        note: 'Under H0 the groups share one proportion, so one pooled estimate goes in the SE.',
        parts: [
          { sym: '\\hat{p}_1 - \\hat{p}_2', means: 'the observed gap between the groups', tone: 'accent' },
          { sym: '\\hat{p}_c', means: 'all successes over all trials', tone: 'ok' },
          { sym: '\\tfrac{1}{n_1} + \\tfrac{1}{n_2}', means: 'two samples, two doses of variability', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Two means',
      body: 'For independent samples, the difference of means has standard error √(s1²/n1 + s2²/n2). By hand use the conservative df, the smaller of n1 − 1 and n2 − 1; technology computes a larger df and a slightly smaller p-value.',
      why: 'The difference of two independent sample means has a variance equal to the sum of their variances, s1²/n1 + s2²/n2. This is the same add-the-variances rule as for combining random variables, and SDs never add directly, so everything sits under one square root. Using the smaller df is a safe choice, because a smaller df gives fatter tails and a larger p-value.',
      formula: {
        tex: 't = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\dfrac{s_1^{2}}{n_1} + \\dfrac{s_2^{2}}{n_2}}}, \\qquad df = \\min(n_1 - 1,\\ n_2 - 1)',
        note: 'Variances add under the root, one from each sample.',
        parts: [
          { sym: '\\bar{x}_1 - \\bar{x}_2', means: 'the gap between the sample means', tone: 'accent' },
          { sym: 's_i^{2}/n_i', means: 'each sample\'s share of the variance', tone: 'ok' },
          { sym: '\\min(n_1 - 1, n_2 - 1)', means: 'the conservative df for hand work', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Paired data is one sample',
      body: 'Before-and-after scores on the SAME students are not two independent groups. Subtract to get one list of differences, then run a one-sample t-test on those differences with df = n − 1.',
      why: 'When the same person appears twice, a high scorer tends to be high in both lists, so the two lists are not independent. Taking each person difference removes that person-to-person variation and leaves one honest list of numbers. A one-sample t on those differences then tests whether the average change is zero.',
      compare: {
        cols: [
          { title: 'Two independent samples', lines: ['different people in each group', 'two-sample t', 'SE from both variances'], tone: 'accent' },
          { title: 'Paired', lines: ['same people measured twice', 'one-sample t on differences', 'df = n − 1 pairs'], tone: 'ok' },
        ],
        note: 'Ask: does each value in one list have a natural partner in the other? If yes, it is paired.',
      },
    },
    {
      kind: 'concept',
      head: 'Chi-square adds up surprise',
      body: 'For counts in categories, compare what you observed with what H0 predicts in every cell. Square each gap, scale it by the expected count, and add. A big total means the table is far from H0; the test is always right-tailed.',
      why: 'If H0 is true, observed counts should land near the expected counts, so every gap O − E should be small. Gaps are positive or negative, so squaring stops them cancelling. Dividing by E makes a gap of 5 matter more where you expect 10 than where you expect 1000. The total is never negative and only large totals are evidence against H0, so the test is right-tailed.',
      formula: {
        tex: '\\chi^{2} = \\sum \\frac{(O - E)^{2}}{E}',
        note: 'One term per cell, all added. Bigger is more evidence against H0.',
        parts: [
          { sym: 'O', means: 'the observed count in a cell', tone: 'accent' },
          { sym: 'E', means: 'the count H0 expects there (every E ≥ 5)', tone: 'ok' },
          { sym: '(O-E)^{2}/E', means: 'that cell\'s contribution to the total', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Expected counts and degrees of freedom',
      body: 'Goodness-of-fit tests one categorical variable: expected = n × claimed proportion, df = categories − 1. Independence or homogeneity tests a two-way table: expected = row total × column total / grand total, df = (rows − 1)(columns − 1).',
      why: 'Expected counts assume H0. If two variables are unrelated, every row should split across the columns in the same proportions, so a cell expects its row share times the column total, which is row × column / grand total. Degrees of freedom count how many cells can vary freely once the totals are fixed: with 6 faces and a fixed total, only 5 can be chosen freely.',
      table: {
        head: ['Test', 'Expected count', 'df', 'Critical value (α = 0.05)'],
        rows: [
          ['goodness-of-fit, 6 faces', 'n × claimed proportion', '6 − 1 = 5', '11.070'],
          ['independence, 2 × 2 table', 'row × column / total', '(2 − 1)(2 − 1) = 1', '3.841'],
          ['goodness-of-fit, 3 colours', 'n × claimed proportion', '3 − 1 = 2', '5.991'],
        ],
        note: 'Critical values at α = 0.05: 3.841 (df 1), 5.991 (df 2), 7.815 (df 3), 9.488 (df 4), 11.070 (df 5).',
      },
    },
    {
      kind: 'example',
      head: 'Start simple: the drug trial',
      body: 'In a drug trial, 60 of 100 treated patients improved versus 45 of 100 on a placebo. Is there evidence that the drug raises the improvement rate?',
      steps: {
        steps: [
          { tex: 'H_0:\\ p_1 = p_2,\\quad H_a:\\ p_1 > p_2', text: 'State the hypotheses about the two true improvement rates. The alternative is one-sided because the question asks whether the drug raises the rate.' },
          { tex: 'n_1\\hat{p}_c = 52.5,\\ n_1(1-\\hat{p}_c) = 47.5\\ \\text{(same for group 2)}', text: 'Plan: a two-proportion z-test. The patients are randomly assigned, and with the pooled rate every group has at least 10 expected improvements and 10 expected non-improvements.' },
          { tex: '\\hat{p}_c = \\frac{60 + 45}{100 + 100} = 0.525', text: 'Pool all the improvements: 105 successes out of 200 patients. H0 says both groups share one rate, so the pooled estimate is our best guess of it.' },
          { tex: '\\text{SE} = \\sqrt{0.525(0.475)\\left(\\tfrac{1}{100} + \\tfrac{1}{100}\\right)} \\approx 0.0706', text: 'Put the pooled rate in the standard error, because the SE describes a world where H0 is true. The two (1/n) terms account for both groups.' },
          { tex: 'z = \\frac{0.60 - 0.45}{0.0706} \\approx 2.12,\\quad P(Z > 2.12) = 0.017', text: 'The 15-point gap is about 2.12 standard errors. Only the upper tail counts, since Ha says greater, and its area is 0.017, below 0.05, so reject H0.' },
        ],
        answer: '0.017 < 0.05:\\ \\text{reject } H_0',
      },
    },
    {
      kind: 'example',
      head: 'Two classes, two means',
      body: 'Class A (n = 25) averaged 78 with SD 10; Class B (n = 36) averaged 72 with SD 12, independent random samples. Is there evidence that the class means differ?',
      steps: {
        steps: [
          { tex: 'H_0:\\ \\mu_1 = \\mu_2,\\quad H_a:\\ \\mu_1 \\ne \\mu_2', text: 'State the hypotheses. The classes are independent random samples, not matched pairs, so a two-sample t-test is the right plan. The alternative is two-sided because any difference counts.' },
          { tex: '\\text{SE} = \\sqrt{\\tfrac{10^{2}}{25} + \\tfrac{12^{2}}{36}} = \\sqrt{4 + 4} \\approx 2.83', text: 'Add the two variances of the sample means, s²/n for each class, then take the root. The variances add, but the SDs never do.' },
          { tex: 't = \\frac{78 - 72}{2.83} \\approx 2.12', text: 'The 6-point gap between the sample means divided by the SE tells us it is about 2.12 standard errors from zero.' },
          { tex: 'df = 24:\\ p\\text{-value} \\approx 0.044', text: 'By hand use the conservative df, the smaller of 24 and 35. The two tails of a t curve beyond 2.12 hold about 0.044 in total.' },
          { tex: '0.044 < 0.05', text: 'The p-value is below α, so reject H0. There is convincing evidence that the two class means differ.' },
        ],
        answer: '0.044 < 0.05:\\ \\text{reject } H_0',
      },
    },
    {
      kind: 'example',
      head: 'Tutoring: before and after',
      body: 'Eight students take a test before and after tutoring. The after − before differences have mean 3.0 and SD 4.0 points. Is there evidence that tutoring improved scores?',
      steps: {
        steps: [
          { text: 'Decide the design. The same eight students were measured twice, so each before score has a natural partner. This is paired data, and we work with the list of differences.' },
          { tex: 'H_0:\\ \\mu_d = 0,\\quad H_a:\\ \\mu_d > 0', text: 'State hypotheses about the mean difference μd. Ha is one-sided because the question asks whether tutoring improved scores, which means after − before is positive.' },
          { tex: 't = \\frac{3.0}{4/\\sqrt{8}} = \\frac{3.0}{1.41} \\approx 2.12,\\quad df = 7', text: 'Run a one-sample t on the differences. The SE is s_d/√n = 4/2.83 = 1.41, so the mean gain is 2.12 standard errors above 0, with df = n − 1 = 7.' },
          { tex: 'P(t_{7} > 2.12) \\approx 0.036', text: 'Only the upper tail counts, since Ha says the gain is positive. The area beyond 2.12 on a t curve with 7 df is about 0.036.' },
          { tex: '0.036 < 0.05', text: 'The p-value is below α, so reject H0. There is convincing evidence that tutoring raises mean scores.' },
        ],
        answer: '0.036 < 0.05:\\ \\text{reject } H_0',
      },
    },
    {
      kind: 'example',
      head: 'Is the die fair?',
      body: 'A die is rolled 60 times: faces 1 to 6 come up 8, 12, 9, 14, 7, 10 times. Is there evidence that the die is unfair?',
      steps: {
        steps: [
          { tex: 'H_0:\\ \\text{each face has probability } \\tfrac16', text: 'State the hypotheses. H0 says the die is fair with every face at 1/6, and Ha says at least one face has a different probability. A goodness-of-fit test fits because we have one categorical variable.' },
          { tex: 'E = 60 \\cdot \\tfrac{1}{6} = 10', text: 'Compute expected counts from H0 as n times the claimed proportion: 10 for every face. Each is at least 5, so the chi-square test is allowed.' },
          { tex: '(O - E)^{2} = 4,\\ 4,\\ 1,\\ 16,\\ 9,\\ 0', text: 'Subtract expected from observed for each face and square: for example 8 − 10 = −2, which squares to 4. Squaring stops the over and under gaps from cancelling.' },
          { tex: '\\chi^{2} = \\tfrac{4 + 4 + 1 + 16 + 9 + 0}{10} = 3.4', text: 'Divide each squared gap by E = 10 and add them all up. Because every E is 10, one division of the total 34 by 10 gives 3.4.' },
          { tex: 'df = 6 - 1 = 5:\\ 3.4 < 11.070,\\ p \\approx 0.64', text: 'With df = 6 − 1 = 5, the critical value is 11.070. Our total is far below it, and the right-tail p-value is about 0.64, above 0.05, so fail to reject H0.' },
        ],
        answer: '\\text{fail to reject } H_0',
      },
      table: {
        head: ['face', 'O', 'E', '(O − E)²/E'],
        rows: [['1', '8', '10', '0.4'], ['2', '12', '10', '0.4'], ['3', '9', '10', '0.1'], ['4', '14', '10', '1.6'], ['5', '7', '10', '0.9'], ['6', '10', '10', '0.0'], ['total', '60', '60', '3.4']],
        mark: 6,
        note: 'χ² = 3.4 is far below the df = 5 critical value of 11.070.',
      },
      art: chiCurve(5, {
        alt: 'A right-skewed chi-square curve with 5 degrees of freedom, shaded to the right of 3.4, with the critical value 11.07 marked',
        title: 'χ² curve with df = 5',
        from: 3.4,
        marks: [{ at: 3.4, label: 'χ² = 3.4' }, { at: 11.07, label: 'crit 11.07' }],
        labels: [{ text: 'p ≈ 0.64', at: 8.5 }],
        caption: 'Most of the curve lies beyond 3.4: a fair die gives a total this big about 64% of the time.',
      }),
    },
    {
      kind: 'example',
      head: 'Dogs or cats: a two-way table',
      body: 'Group A: 30 prefer dogs, 20 prefer cats. Group B: 20 dogs, 30 cats. Is preference associated with group? Use a chi-square test for independence.',
      steps: {
        steps: [
          { tex: 'H_0:\\ \\text{preference and group are independent}', text: 'State the hypotheses. H0 says group and preference have no association, and Ha says they do. A two-way table of counts calls for a chi-square test of independence.' },
          { tex: 'E = \\frac{50 \\times 50}{100} = 25', text: 'Expected count is row total times column total over grand total. Every row and column total is 50, so every cell expects 25, which is at least 5.' },
          { tex: '\\frac{(30 - 25)^{2}}{25} = 1', text: 'Every cell is off by exactly 5 from its expected 25 (30 and 20 against 25), and each squared gap 25 divided by 25 contributes 1.' },
          { tex: '\\chi^{2} = 1 + 1 + 1 + 1 = 4.0', text: 'Add the four cell contributions to get the chi-square statistic 4.0.' },
          { tex: 'df = (2-1)(2-1) = 1:\\ 4.0 > 3.841,\\ p \\approx 0.046', text: 'With df = (rows − 1)(columns − 1) = 1, the critical value is 3.841. Our 4.0 is beyond it, and p is about 0.046 < 0.05, so reject H0. Evidence of an association.' },
        ],
        answer: '\\text{reject } H_0:\\ \\text{evidence of an association}',
      },
      art: bars([{ name: 'dogs', vals: [30, 20], color: SKY }, { name: 'cats', vals: [20, 30], color: AMB }], {
        labels: ['Group A', 'Group B'],
        title: 'Preference by group',
        alt: 'Grouped bars: Group A has 30 dog people and 20 cat people, Group B has 20 dog people and 30 cat people',
        caption: 'Under H0 every cell would be 25. Each cell is off by 5, contributing 25/25 = 1.',
      }),
      table: {
        head: ['', 'dogs O (E)', 'cats O (E)'],
        rows: [['Group A', '30 (25)', '20 (25)'], ['Group B', '20 (25)', '30 (25)']],
        note: 'Four cells, each (±5)²/25 = 1, so χ² = 4.0.',
      },
    },
    {
      kind: 'example',
      head: 'Another way: the same question as a z-test',
      body: 'Check the dog/cat result with a two-proportion z-test on “prefers dogs”: p̂A = 0.6 and p̂B = 0.4. Do the two tests agree?',
      steps: {
        steps: [
          { tex: '\\hat{p}_c = \\tfrac{30 + 20}{50 + 50} = 0.5', text: 'Pool the dog lovers from both groups: 50 out of 100 people. Under H0 the two groups share this one rate.' },
          { tex: '\\text{SE} = \\sqrt{0.5(0.5)\\left(\\tfrac{1}{50} + \\tfrac{1}{50}\\right)} = \\sqrt{0.01} = 0.1', text: 'Use the pooled rate in the standard error. The two groups of 50 contribute 1/50 each, so the quantity under the root is 0.25 × 0.04 = 0.01.' },
          { tex: 'z = \\frac{0.6 - 0.4}{0.1} = 2.0', text: 'The 0.2 gap is 2 standard errors. The two-sided p-value is 2(0.0228) = 0.046, the same as the chi-square p-value.' },
          { tex: 'z^{2} = 4.0 = \\chi^{2}', text: 'Square the z: it equals the chi-square statistic 4.0. For a 2 × 2 table the two tests are algebraically the same test, so they always agree.' },
        ],
        answer: 'z = 2.0,\\ z^{2} = \\chi^{2}',
      },
    },
    {
      kind: 'example',
      head: 'Picture it first: pick the test',
      body: 'Before any arithmetic, picture the data. Which test fits each kind of data? Naming the picture is the Plan step, and it is where most tests go wrong.',
      steps: {
        steps: [
          { text: 'Ask first: are the data counts sorted into categories, or measurements or success rates? Counts across categories call for chi-square; success rates call for z procedures; measurements call for t procedures.' },
          { text: 'For rates or measurements, ask how many groups there are. Two separate groups of people mean a two-sample test: two-proportion z for yes/no data, two-sample t for numbers.' },
          { text: 'If one group of people is measured twice, or the data come in natural pairs, subtract to get differences and run a paired test: a one-sample t on the differences.' },
          { text: 'Check that test conditions before computing: random sample or assignment, the 10% condition, and large enough counts or sample size, with expected counts at least 5 for chi-square.' },
        ],
        answer: '\\text{Match the data picture to the test, then check conditions}',
      },
      table: {
        head: ['The data look like…', 'Test'],
        rows: [
          ['60 of 100 improved vs 45 of 100', 'two-proportion z'],
          ['class A scores vs class B scores', 'two-sample t'],
          ['each student before and after', 'paired t on differences'],
          ['60 rolls sorted into six faces', 'chi-square goodness-of-fit'],
          ['a 2 × 2 table of group by preference', 'chi-square for independence'],
        ],
      },
    },
    {
      kind: 'protip',
      head: 'Expected counts come from H0, not from the data',
      body: 'In a two-way table the expected count for a cell is its row total times its column total, divided by the grand total. Write every expected count down and check each one is at least 5 before computing χ². That check is part of the Plan step.',
      formula: {
        tex: 'E = \\frac{(\\text{row total})(\\text{column total})}{\\text{grand total}}',
        note: 'What the cell would hold if the two variables had nothing to do with each other.',
        parts: [
          { sym: '\\text{row} \\times \\text{column}', means: 'the two margins the cell sits in', tone: 'accent' },
          { sym: '\\text{grand total}', means: 'everyone in the table', tone: 'ok' },
        ],
      },
      art: flow(
        [{ label: 'Observed table', color: SKY }, { label: 'Expected from H0', color: AMB }, { label: 'Σ (O − E)²/E', color: EMR }, { label: 'Compare to df', color: VIO }],
        { horizontal: true, title: 'A chi-square test, start to finish', alt: 'Four boxes in a row: observed table, expected from H0, sum of (O minus E) squared over E, compare to the df critical value', caption: 'Counts in, one number out, judged against the right df.' },
      ),
    },
    {
      kind: 'trap',
      head: 'Paired is not two-sample, and percents are not counts',
      body: 'Before/after on the same people is PAIRED: one sample of differences, not two samples. And a chi-square test runs on COUNTS, never on percentages, dividing by the EXPECTED count in every cell, not the observed one.',
      compare: {
        cols: [
          { title: 'Wrong', lines: ['two-sample t on before vs after', 'χ² from percentages', 'dividing by O'], tone: 'bad' },
          { title: 'Right', lines: ['one-sample t on the differences', 'χ² from raw counts', 'dividing by E'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: three colours of candy',
      body: 'A maker claims 50% red, 30% blue and 20% green. A bag of 100 has 42 red, 38 blue and 20 green. Is there evidence the claimed mix is wrong? Test at α = 0.05.',
      steps: {
        steps: [
          { tex: 'E = 100(0.5),\\ 100(0.3),\\ 100(0.2) = 50,\\ 30,\\ 20', text: 'Expected counts come from the claim: the bag size times each claimed proportion. All three are at least 5, so chi-square is allowed.' },
          { tex: '\\frac{(42-50)^{2}}{50} = \\tfrac{64}{50} = 1.28', text: 'Red is 8 below its expectation. Square the gap to get 64 and divide by 50, so red adds 1.28 to the total.' },
          { tex: '\\frac{(38-30)^{2}}{30} = \\tfrac{64}{30} \\approx 2.13,\\quad \\frac{(20-20)^{2}}{20} = 0', text: 'Blue is 8 above its expectation, so it adds 64/30 = 2.13. Green hit its expected count exactly and adds nothing.' },
          { tex: '\\chi^{2} = 1.28 + 2.13 + 0 \\approx 3.41', text: 'Add the three contributions to get the chi-square statistic, about 3.41.' },
          { tex: 'df = 3 - 1 = 2:\\ 3.41 < 5.991,\\ p \\approx 0.18', text: 'With df = 3 − 1 = 2, the critical value is 5.991. The 3.41 falls short of it, and p is about 0.18 > 0.05, so fail to reject H0. The claimed mix is plausible.' },
        ],
        answer: '\\text{fail to reject } H_0',
      },
    },
    {
      kind: 'summary',
      head: 'Comparing groups, wrapped up',
      body: 'Two proportions: pool, then z. Two means: t with variances added under the root, conservative df. Paired data: one-sample t on differences. Categories: χ² = Σ(O − E)²/E, right-tailed, df from the number of categories or (rows − 1)(columns − 1).',
      table: {
        head: ['Test', 'Statistic', 'df'],
        rows: [
          ['two proportions', 'z with pooled p̂c', 'normal'],
          ['two means', 't = (x̄1 − x̄2)/√(s1²/n1 + s2²/n2)', 'min(n1 − 1, n2 − 1)'],
          ['paired', 't = d̄/(sd/√n)', 'n − 1'],
          ['goodness-of-fit', 'χ² = Σ(O − E)²/E', 'categories − 1'],
          ['independence', 'χ² = Σ(O − E)²/E', '(rows − 1)(columns − 1)'],
        ],
      },
    },
  ],

  // ---------------- STAT-14 — Inference for regression and reading the free-response ----------------
  'STAT-14': [
    {
      kind: 'objective',
      head: 'Is the slope real?',
      body: 'Twenty students reported study hours and exam scores, and the least-squares line is ŷ = 12.5 + 2.40x. A different twenty students would give a slightly different slope. Today you will test whether the true slope could be zero, build an interval for it, and write the answer the way the free-response graders want.',
      art: scatterLine(
        [{ x: 2, y: 18 }, { x: 3, y: 17 }, { x: 4, y: 24 }, { x: 5, y: 22 }, { x: 6, y: 29 }, { x: 7, y: 27 }, { x: 8, y: 33 }, { x: 9, y: 36 }, { x: 10, y: 40 }, { x: 11, y: 37 }, { x: 12, y: 42 }],
        2.4,
        12.5,
        {
          alt: 'A scatterplot of exam score against study hours rising from left to right, with the least-squares line y hat equals 12.5 plus 2.40 x drawn through it',
          range: { x: [0, 14], y: [0, 50] },
          ticks: { x: [2, 4, 6, 8, 10, 12, 14], y: [10, 20, 30, 40, 50] },
          title: 'Exam score vs. study hours',
          xLabel: 'hours',
          yLabel: 'score',
          lineLabel: { text: 'ŷ = 12.5 + 2.40x', x: 0.6, y: 44 },
          caption: 'The sample slope is 2.40 points per hour. The question is whether the population slope β is 0.',
        },
      ),
    },
    {
      kind: 'concept',
      head: 'The model and the sample line',
      body: 'The population follows μy = α + βx: for each x, the mean response sits on a line with true slope β. The sample line ŷ = a + bx estimates it. b is our estimate of β, and SEb says how much b would wander from sample to sample.',
      why: 'Real data scatter around a line, so we imagine the mean score for each number of hours lies exactly on a true line with slope β. Our 20 students give a sample line that lands near that line but not on it. The slope b is one draw from a sampling distribution centred at β, and SEb measures how far b typically lands from β.',
      formula: {
        tex: '\\mu_y = \\alpha + \\beta x \\qquad\\longrightarrow\\qquad \\hat{y} = a + bx',
        note: 'Greek letters for the population, Latin letters for the sample.',
        parts: [
          { sym: '\\beta', means: 'the true slope, fixed and unknown', tone: 'accent' },
          { sym: 'b', means: 'the sample slope, our estimate of β', tone: 'ok' },
          { sym: 'SE_b', means: 'the standard error of b, from the output', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Reading computer output',
      body: 'The Coef column holds a (the Constant row) and b (the x-variable row). SE Coef beside b is SEb. S is the standard deviation of the residuals, and R-Sq is r². The equation is ŷ = 12.5 + 2.40(hours).',
      why: 'Software prints its numbers in a fixed layout, so the same few spots answer every question. The Constant row gives the intercept a, the variable row gives the slope b, and SE Coef beside it is SEb. T is Coef divided by SE Coef, so you can check it: 2.40/0.60 = 4.00. S measures the typical miss of a prediction, in the units of y.',
      table: {
        head: ['Predictor', 'Coef', 'SE Coef', 'T', 'P'],
        rows: [['Constant', '12.5', '3.2', '3.91', '0.001'], ['Hours', '2.40', '0.60', '4.00', '0.001']],
        mark: 1,
        note: 'S = 4.1, R-Sq = 47.0%, n = 20. The Hours row is the slope: b = 2.40, SEb = 0.60.',
      },
    },
    {
      kind: 'concept',
      head: 'Conditions: LINER',
      body: 'Linear pattern in the scatterplot, Independent observations, Normal residuals, Equal spread of residuals across x, Random sample. Check the scatterplot for the L and the residual plot for the N and the E.',
      why: 'The t procedures assume the points scatter around a line in the same way at every x. A curved pattern means the line is the wrong model, and a fan shape means the SE is wrong for some x values. Skewed residuals matter for small n, and non-independent observations make the SE too small. Each condition protects the SE and the p-value.',
      table: {
        head: ['Letter', 'Condition', 'Where to look'],
        rows: [
          ['L', 'Linear relationship', 'scatterplot, residual plot has no curve'],
          ['I', 'Independent observations', 'design; 10% condition if sampling'],
          ['N', 'Normal residuals', 'histogram or dotplot of residuals'],
          ['E', 'Equal SD of residuals for every x', 'residual plot has no fan shape'],
          ['R', 'Random sample or assignment', 'the problem statement'],
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Interval and test for the slope',
      body: 'The slope gets the usual recipe: estimate ± t* × SE, with df = n − 2 because two parameters were estimated. The test of H0: β = 0 asks whether there is any linear relationship at all; its statistic is b divided by SEb.',
      why: 'A slope of 0 means y does not change with x on average, so H0: β = 0 says there is no linear relationship. Dividing b by SEb counts how many standard errors the slope is from 0, the same pattern as other t tests. We spend two degrees of freedom because the line has two estimated numbers, the intercept and the slope, so df = n − 2.',
      formula: {
        tex: 'b \\pm t^{*}\\,SE_b, \\qquad t = \\frac{b - 0}{SE_b}, \\qquad df = n - 2',
        note: 'Most output prints this t and its two-sided p-value in the slope row.',
        parts: [
          { sym: 't^{*} SE_b', means: 'the margin of error for the slope', tone: 'accent' },
          { sym: 'b/SE_b', means: 'how many standard errors b is from zero', tone: 'ok' },
          { sym: 'n - 2', means: 'degrees of freedom: n minus two estimated coefficients', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Four steps on the free-response',
      body: 'Every inference question is answered the same way. State the parameter and the hypotheses (or the interval you will build). Plan the procedure and check the conditions. Do the calculation: statistic, df, p-value. Conclude in context at α.',
      why: 'Graders award points for each part of an argument: a named parameter, a justified method, a correct calculation, and a conclusion tied to the question. A correct number without conditions or context shows only a piece of the reasoning. Following the same four steps every time makes sure no point is left behind and stops you forgetting a condition under pressure.',
      art: flow(
        [
          { label: 'State: parameter, hypotheses', color: SKY },
          { label: 'Plan: name the test, check LINER', color: AMB },
          { label: 'Do: t = b/SE, df = n − 2, p-value', color: EMR },
          { label: 'Conclude: in context, at α', color: VIO },
        ],
        { title: 'The free-response template', alt: 'Four stacked boxes: state the parameter and hypotheses, plan and check conditions, do the calculation, conclude in context', caption: 'Graders score each step. Skipping one costs points even when the number is right.' },
      ),
    },
    {
      kind: 'example',
      head: 'Start simple: write the line, read the slope',
      body: 'The output gives ŷ = 12.5 + 2.40(hours). How do you read the slope, the intercept and r² in the context of study hours and exam score?',
      steps: {
        steps: [
          { tex: '\\hat{y} = 12.5 + 2.40x', text: 'Read the Coef column: the Constant row is the intercept a = 12.5 and the Hours row is the slope b = 2.40. The line is ŷ = a + bx.' },
          { tex: 'b = 2.40 \\text{ points per hour}', text: 'The slope is the predicted change in y for one more unit of x. Say each extra hour is associated with a predicted 2.40-point rise, not causes, since we only observed students.' },
          { tex: '\\hat{y}(0) = 12.5', text: 'The intercept is the predicted score at 0 hours. Treat it with care: the data run from 2 to 12 hours, so 0 hours is outside the data and is only the starting point of the line.' },
          { tex: 'r^{2} = 0.47', text: 'Read r² as a share: about 47% of the variation in exam scores is explained by the linear relationship with hours. The other 53% comes from other things.' },
        ],
        answer: '\\hat{y} = 12.5 + 2.40x',
      },
    },
    {
      kind: 'example',
      head: 'Test the slope',
      body: 'Is there a linear relationship between hours and score? Use the output: b = 2.40, SEb = 0.60, n = 20. Test H0: β = 0 at α = 0.05.',
      steps: {
        steps: [
          { tex: 'H_0:\\ \\beta = 0,\\quad H_a:\\ \\beta \\ne 0', text: 'State the hypotheses about the true slope β. H0 says hours tell us nothing about score on average. The question asks for any linear relationship, so Ha is two-sided.' },
          { text: 'Plan and check LINER: a linear pattern in the scatterplot, independent students, no curve or fan in the residual plot, roughly normal residuals, and a random sample. Assume these hold here.' },
          { tex: 't = \\frac{2.40 - 0}{0.60} = 4.0,\\quad df = 20 - 2 = 18', text: 'Divide the slope by its standard error: it is 4 standard errors from 0. Two coefficients were estimated, so df = n − 2 = 18.' },
          { tex: 'p\\text{-value} \\approx 0.001', text: 'On a t curve with 18 df, the area in both tails beyond ±4.0 is about 0.001, matching the P column in the output.' },
          { tex: '0.001 < 0.05', text: 'The p-value is below α, so reject H0. There is convincing evidence of a linear relationship between hours studied and exam score.' },
        ],
        answer: '0.001 < 0.05:\\ \\text{reject } H_0',
      },
      art: bell(0, 1, {
        alt: 'A t curve with both far tails beyond 4.0 and minus 4.0 shaded, so little area that the p-value is about 0.001',
        title: 't curve, df = 18: the tails beyond ±4.0',
        fmt: (v) => plain(v).replace('-', '−'),
        span: 4.8,
        shade: [[4, 5], [-5, -4]],
        marks: [{ at: 4, label: 't = 4.0' }, { at: -4, label: '−4.0' }],
        labels: [{ text: 'p ≈ 0.001', at: 0, y: 150 }],
        caption: 'Four standard errors from zero leaves almost nothing in the tails.',
      }),
    },
    {
      kind: 'example',
      head: 'A 95% interval for the slope',
      body: 'Build a 95% confidence interval for the true slope β, using b = 2.40, SEb = 0.60 and n = 20.',
      steps: {
        steps: [
          { text: 'The same LINER conditions as for the test must hold before we build the interval. Assume the scatterplot and residual plot look fine for these 20 students.' },
          { tex: 'df = 20 - 2 = 18 \\Rightarrow t^{*} = 2.101', text: 'The line used two estimated numbers, the intercept and the slope, so df = n − 2 = 18. The 95% critical value from the t table is 2.101.' },
          { tex: '\\text{ME} = 2.101 \\times 0.60 \\approx 1.26', text: 'Multiply the critical value by the standard error of the slope to get the margin of error 1.26.' },
          { tex: '2.40 \\pm 1.26 = (1.14,\\ 3.66)', text: 'Subtract and add the margin from b: 2.40 − 1.26 = 1.14 and 2.40 + 1.26 = 3.66. We are 95% confident the true slope lies in this range.' },
        ],
        answer: '(1.14,\\ 3.66)\\text{ points per hour}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: let the interval decide',
      body: 'Use (1.14, 3.66) to reach the test conclusion without a p-value. Is 0 a plausible value for the slope?',
      steps: {
        steps: [
          { tex: 'H_0:\\ \\beta = 0', text: 'The null value of the slope is 0, so ask whether 0 sits inside the 95% interval. Only values inside are plausible at the 5% level.' },
          { tex: '0 \\notin (1.14,\\ 3.66)', text: 'Every value in the interval is positive and 0 lies to the left of it. So 0 is not a plausible slope.' },
          { tex: '\\text{reject } H_0 \\text{ at } \\alpha = 0.05', text: 'A 95% interval and a two-sided test at α = 0.05 give the same verdict, so we reject H0. This matches the t-test with p ≈ 0.001.' },
        ],
        answer: '\\text{reject } H_0:\\ \\beta = 0',
      },
      compare: {
        cols: [
          { title: 't-test', tex: 't = 4.0,\\ p \\approx 0.001', lines: ['reject H0: β = 0'], tone: 'accent' },
          { title: '95% interval', tex: '(1.14,\\ 3.66)', lines: ['0 is outside', 'reject H0: β = 0'], tone: 'ok' },
        ],
        note: 'We are 95% confident the true slope is between 1.14 and 3.66 points per hour.',
      },
    },
    {
      kind: 'example',
      head: 'Predict, then find the residual',
      body: 'A student who studied 10 hours scored 40. What does the line predict for 10 hours, and how far from the line is this student?',
      steps: {
        steps: [
          { tex: '\\hat{y} = 12.5 + 2.40(10)', text: 'Put x = 10 into the least-squares line. This gives the score the line predicts for a student who studied 10 hours.' },
          { tex: '\\hat{y} = 12.5 + 24 = 36.5', text: 'Multiply first, then add: 2.40 × 10 = 24, and 12.5 + 24 = 36.5. This is the predicted score, a typical value, not a guarantee.' },
          { tex: '\\text{residual} = y - \\hat{y} = 40 - 36.5 = +3.5', text: 'A residual is actual minus predicted. Subtract the prediction from the real score of 40, which gives +3.5.' },
          { text: 'The positive residual means the student scored 3.5 points above the line, the vertical gap from the dot down to the line in the picture.' },
        ],
        answer: '\\hat{y} = 36.5,\\ \\text{residual} = +3.5',
      },
      art: scatterLine(
        [{ x: 2, y: 18 }, { x: 3, y: 17 }, { x: 4, y: 24 }, { x: 5, y: 22 }, { x: 6, y: 29 }, { x: 7, y: 27 }, { x: 8, y: 33 }, { x: 9, y: 36 }, { x: 11, y: 37 }, { x: 12, y: 42 }],
        2.4,
        12.5,
        {
          alt: 'The same scatterplot and line, with the point at 10 hours and 40 points highlighted and a vertical segment of 3.5 drawn down to the line',
          range: { x: [0, 14], y: [0, 50] },
          ticks: { x: [2, 4, 6, 8, 10, 12, 14], y: [10, 20, 30, 40, 50] },
          title: 'Predicted 36.5, actual 40',
          xLabel: 'hours',
          yLabel: 'score',
          lineLabel: { text: 'ŷ = 12.5 + 2.40x', x: 0.6, y: 44 },
          hi: { x: 10, y: 40, label: 'residual +3.5' },
          caption: 'The residual is the vertical gap from the point down to the line.',
        },
      ),
    },
    {
      kind: 'example',
      head: 'Picture it first: car weight and fuel',
      body: 'Output for predicting fuel economy (miles per gallon) from car weight (n = 12) shows slope b = −0.85 with SE 0.30. Is 0 a plausible slope? Build a 90% interval and picture it on a number line.',
      steps: {
        steps: [
          { tex: 'df = 12 - 2 = 10 \\Rightarrow t^{*} = 1.812', text: 'Two coefficients were estimated, so df = n − 2 = 10. At 90% confidence the t table gives t* = 1.812, which is smaller than for 95%.' },
          { tex: '\\text{ME} = 1.812 \\times 0.30 \\approx 0.54', text: 'Multiply the critical value by the SE of the slope: 1.812 × 0.30 = 0.5436, about 0.54.' },
          { tex: '-0.85 \\pm 0.54 = (-1.39,\\ -0.31)', text: 'Subtract and add the margin from b = −0.85: −0.85 − 0.54 = −1.39 and −0.85 + 0.54 = −0.31.' },
          { text: 'Look at the number line. The whole interval is negative and 0 is not inside, so 0 is not a plausible slope: heavier cars are associated with lower fuel economy.' },
        ],
        answer: '(-1.39,\\ -0.31)',
      },
      art: numberLine(-2, 0, [{ at: -0.85, label: 'slope −0.85', color: AMB }], {
        step: 1,
        title: '90% interval for the slope, df = 10',
        span: { from: -1.39, to: -0.31, label: '(−1.39, −0.31)' },
        alt: 'A number line from minus 2 to 0 with the slope estimate minus 0.85 marked and the interval from minus 1.39 to minus 0.31 highlighted, stopping short of zero',
        caption: 'The interval ends at −0.31, short of 0, so zero is ruled out at the 90% level.',
      }),
    },
    {
      kind: 'protip',
      head: 'Say "associated with", and stay in context',
      body: 'A regression slope never proves cause. Interpret it as "each additional hour of study is associated with a predicted 2.40-point increase in score, on average." Name x, name y, use the units, and keep the words predicted and associated.',
      compare: {
        cols: [
          { title: 'Wrong', lines: ['"Studying one more hour causes', 'a 2.40-point rise."', '"The slope is 2.40."'], tone: 'bad' },
          { title: 'Right', lines: ['"Each extra hour of study is associated', 'with a predicted increase of 2.40', 'points in exam score, on average."'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'The slope test uses n − 2',
      body: 'A one-sample t uses df = n − 1. Regression estimates two things, the intercept and the slope, so the slope test and interval use df = n − 2. With n = 20 that is 18, and t* = 2.101, not the 2.093 of df = 19.',
      formula: {
        tex: 'df = n - 2',
        note: 'Two coefficients estimated, two degrees of freedom spent.',
        parts: [
          { sym: 'n - 1', means: 'one-sample mean: only x̄ was estimated', tone: 'warn' },
          { sym: 'n - 2', means: 'regression: a and b were both estimated', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a slope that just misses',
      body: 'Output shows a slope of 3.0 with SE 1.5 from n = 22 points. Test H0: β = 0 at α = 0.05, then check the verdict with a 95% interval.',
      steps: {
        steps: [
          { tex: 't = \\frac{3.0}{1.5} = 2.0,\\quad df = 22 - 2 = 20', text: 'Divide the slope by its SE: it is 2 standard errors from 0. Two coefficients were estimated, so df = n − 2 = 20.' },
          { tex: '2.0 < t^{*} = 2.086', text: 'Compare with the critical value for 95% and df = 20, which is 2.086. Our t is just short of it, so the result is not quite significant.' },
          { tex: 'p\\text{-value} \\approx 0.059 > 0.05', text: 'The two-sided p-value for t = 2.0 with 20 df is about 0.059, above α, so fail to reject H0. There is not quite enough evidence of a linear relationship.' },
          { tex: '3.0 \\pm 2.086(1.5) = (-0.13,\\ 6.13)', text: 'Check with the interval: the margin is 2.086 × 1.5 = 3.13. The interval reaches below 0, so 0 is plausible, which agrees with the test.' },
        ],
        answer: '\\text{fail to reject } H_0:\\ \\beta = 0',
      },
    },
    {
      kind: 'summary',
      head: 'Regression inference, wrapped up',
      body: 'Read a, b and SEb off the output; the line is ŷ = a + bx. Check LINER. Test H0: β = 0 with t = b/SEb and df = n − 2; build b ± t*SEb. Interpret slope, r² and p-values in context with "associated with", and answer every free-response in four steps.',
      table: {
        head: ['Want', 'Use', 'df'],
        rows: [
          ['the line', 'ŷ = a + bx from the Coef column', ''],
          ['test of slope', 't = b/SEb, two-sided p-value', 'n − 2'],
          ['interval for slope', 'b ± t*·SEb', 'n − 2'],
          ['a residual', 'actual − predicted', ''],
        ],
        note: 'State, Plan, Do, Conclude. Every time.',
      },
    },
  ],
};
