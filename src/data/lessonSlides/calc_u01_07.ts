import type { LessonSlide, SlideBank } from './types';
import { AMB, EMR, INK, ROSE, SKY, VIO, W, areaModel, arrow, art, axes, band, circle, dot, flow, line, machine, text } from '../slideArt';
import type { Axes, Range } from '../slideArt';

// AP Calculus AB slide decks, units 1-7: limits from graphs and tables, limit
// laws, continuity and the IVT, limits at infinity, the derivative as a limit,
// the derivative rules, and the chain rule with the trig derivatives. The
// numbers on every slide are the numbers in src/data/calc/lessons_u01_07.ts.

// ── drawing helpers shared by the seven decks ──────────────────────────────

/** A grid with hand-picked tick marks, so a figure's numbers are the lesson's numbers. */
function grid(r: Range, tx: number[], ty: number[], o: { xLabel?: string; yLabel?: string; tickText?: (v: number, axis: 'x' | 'y') => string } = {}): Axes {
  return axes(r, { ticks: { x: tx, y: ty }, grid: true, pad: 40, xLabel: o.xLabel ?? 'x', yLabel: o.yLabel ?? 'y', tickText: o.tickText });
}

/** A hollow point: the hole a graph has where the function is not defined. */
const hollow = (ax: Axes, x: number, y: number, col = AMB) => circle(ax.X(x), ax.Y(y), 5, col, 'none', 2.6);
/** A filled point: the value the function actually takes. */
const solid = (ax: Axes, x: number, y: number, col = EMR) => dot(ax.X(x), ax.Y(y), 5, col);
/** Dashed guides from a point back to both axes. */
const guides = (ax: Axes, x: number, y: number, col = ROSE) =>
  line(ax.X(x), ax.Y(y), ax.X(x), ax.Y(Math.max(0, Math.min(y, 0))), col, 1.6, '4 4', 0.8) +
  line(ax.X(x), ax.Y(y), ax.X(Math.max(0, Math.min(x, 0))), ax.Y(y), col, 1.6, '4 4', 0.8);
/** A label placed in data coordinates. */
const lab = (ax: Axes, x: number, y: number, s: string, o: { size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; op?: number } = {}) =>
  text(ax.X(x), ax.Y(y), s, { size: 12, ...o });
/** An arrow along a curve, from x1 to x2, to show the approach. */
const creep = (ax: Axes, f: (x: number) => number, x1: number, x2: number, col = SKY) => arrow(ax.X(x1), ax.Y(f(x1)), ax.X(x2), ax.Y(f(x2)), col, 2.4);
/** A function with a gap cut out around x = c, so a hole shows as a real gap in the ink. */
const cut = (f: (x: number) => number, c: number, eps = 0.07) => (x: number) => (Math.abs(x - c) < eps ? NaN : f(x));
/** Only the part of a function left of c, or right of c. */
const leftOf = (f: (x: number) => number, c: number, eps = 0.05) => (x: number) => (x < c - eps ? f(x) : NaN);
const rightOf = (f: (x: number) => number, c: number, eps = 0.05) => (x: number) => (x > c + eps ? f(x) : NaN);
/** The straight line through (a, f(a)) with slope m. */
const tangentLine = (a: number, fa: number, m: number) => (x: number) => fa + m * (x - a);
/** Tick labels in quarter turns: 1 → π/2, 2 → π, … */
const qt = (v: number) =>
  ({ '-2': '−π', '-1': '−π/2', 0: '0', 1: 'π/2', 2: 'π', 3: '3π/2', 4: '2π', 5: '5π/2', 6: '3π' } as Record<string, string>)[String(v)] ?? '';
const qsin = (u: number) => Math.sin((u * Math.PI) / 2);
const qcos = (u: number) => Math.cos((u * Math.PI) / 2);

/** A caption-less title line across the top of a figure. */
const title = (s: string, col = VIO) => text(W / 2, 18, s, { size: 12, fill: col });

// ---------------- CALC-1 — Limits from graphs and tables ----------------
const CALC_1: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Where is the graph heading?',
    body: 'A limit asks where the heights of a graph are HEADING as x creeps toward a number, not what happens when it gets there. Today you will read limits off graphs, off tables and off two-piece formulas. One picture does most of the work: a line with a hole in it.',
    art: (() => {
      const ax = grid({ x: [-1, 5], y: [-1, 7] }, [1, 2, 3, 4], [2, 4, 6]);
      const f = (x: number) => x + 2;
      return art(
        'The line y = x + 2 with a hollow circle at (2, 4) and arrows sliding along the line toward the hole from both sides',
        ax.body +
          title('the limit is 4, the value is missing') +
          ax.curve(cut(f, 2), AMB, 2.8) +
          guides(ax, 2, 4) +
          creep(ax, f, 0.4, 1.4) +
          creep(ax, f, 3.6, 2.6) +
          hollow(ax, 2, 4) +
          lab(ax, 2.25, 4.9, 'heading to 4', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = (x² − 4)/(x − 2)', { size: 12, fill: AMB, anchor: 'end' }),
        'Both arrows slide toward height 4. The hole at x = 2 changes nothing: the limit is 4.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to c} f(x) = L',
      note: 'Read it aloud: "as x heads to c, f(x) heads to L." It is a sentence about neighbors, not about the point.',
      parts: [
        { sym: 'x \\to c', means: 'x creeps toward c from both sides, never landing on it', tone: 'accent' },
        { sym: 'f(x)', means: 'the heights of the graph while x is creeping', tone: 'warn' },
        { sym: 'L', means: 'the one height those heights settle toward', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'A destination, not an arrival',
    body: 'Picture a car driving along the graph toward x = 2. The limit is the height the car is aiming for. Whether the road actually has a point there, or a stray dot somewhere else, does not change where the car was aiming. Here g heads to 4 even though g(2) = 1.',
    why: 'The limit is built only from the heights at x-values NEAR 2, such as 1.9, 1.99, 2.01 and 2.1, and none of those is x = 2 itself. The point at x = 2 is a different input, so moving it or deleting it changes g(2) but cannot change any of the nearby heights.',
    art: (() => {
      const ax = grid({ x: [-1, 5], y: [-1, 7] }, [1, 2, 3, 4], [2, 4, 6]);
      const f = (x: number) => x + 2;
      return art(
        'The line y = x + 2 with a hole at (2, 4) and a lone filled dot below it at (2, 1)',
        ax.body +
          title('the dot does not move the limit') +
          ax.curve(cut(f, 2), AMB, 2.8) +
          guides(ax, 2, 4) +
          hollow(ax, 2, 4) +
          solid(ax, 2, 1, EMR) +
          lab(ax, 2.25, 4.7, 'limit 4', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 2.25, 1.1, 'g(2) = 1', { fill: EMR, anchor: 'start' }) +
          text(W - 24, 40, 'y = g(x)', { size: 12, fill: AMB, anchor: 'end' }),
        'The neighbors head to 4. The value at 2 is 1. A limit and a value can disagree.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to 2} g(x) = 4 \\quad \\text{but} \\quad g(2) = 1',
      note: 'Two different questions with two different answers. The limit asks about the approach; g(2) asks about the point.',
      parts: [
        { sym: '\\lim_{x \\to 2} g(x)', means: 'where the heights are heading: 4', tone: 'ok' },
        { sym: 'g(2)', means: 'the actual dot at x = 2: height 1', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Cover the point with your thumb',
    body: 'Put your thumb over x = 2 so you cannot see what happens there. Now trace the graph in from the left and in from the right. Whatever height both traces are aiming at is the limit. What happens AT x = 2 is covered up, and that is exactly the point.',
    why: 'Covering the point copies the definition: a limit only looks at x-values close to c but never equal to c. If your answer survives with the point hidden, it cannot depend on that point. That is why a hole, a missing value and a stray dot all give the same limit.',
    art: (() => {
      const ax = grid({ x: [-1, 5], y: [-1, 7] }, [1, 2, 3, 4], [2, 4, 6]);
      const f = (x: number) => x + 2;
      return art(
        'The line y = x + 2 with an amber band covering x = 2 like a thumb, and arrows tracing toward the band from both sides',
        ax.body +
          title('what happens at x = 2 is covered') +
          ax.curve(f, AMB, 2.8) +
          band(ax.X(1.7), ax.Y(7), ax.X(2.3) - ax.X(1.7), ax.Y(-1) - ax.Y(7), VIO) +
          creep(ax, f, 0.2, 1.3) +
          creep(ax, f, 3.8, 2.7) +
          lab(ax, 2, 6.6, 'thumb', { fill: VIO }) +
          lab(ax, 1.1, 4.6, 'from the left', { fill: SKY, anchor: 'end' }) +
          lab(ax, 3.1, 4.1, 'from the right', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = x + 2', { size: 12, fill: AMB, anchor: 'end' }),
        'Both traces aim at height 4, so the limit is 4 whatever hides under the thumb.',
      );
    })(),
    compare: {
      cols: [
        { title: 'What the limit sees', lines: ['Every x near 2', 'Heights heading to 4', 'Both sides of the approach'], tone: 'ok' },
        { title: 'What the limit ignores', lines: ['The point x = 2 itself', 'A hole there', 'A stray dot there'], tone: 'warn' },
      ],
      note: 'If covering one point changes your answer, you were reading the value, not the limit.',
    },
  },
  {
    kind: 'concept',
    head: 'One-sided limits',
    body: 'Sometimes the two traces aim at different heights. A ONE-SIDED limit reads just one of them. x → 3⁻ means x comes in from the left, from numbers smaller than 3. x → 3⁺ means x comes in from the right. Here the left trace heads to 6 and the right trace heads to 5.',
    why: 'A two-sided approach hides which side a height came from, so we name each side. On the left piece 2x, the heights at x = 2.9 and 2.99 are 5.8 and 5.98, creeping up to 6. On the right piece x + 2, the heights at 3.1 and 3.01 are 5.1 and 5.01, creeping down to 5.',
    art: (() => {
      const ax = grid({ x: [0, 6], y: [0, 8] }, [1, 2, 3, 4, 5], [2, 4, 6, 8]);
      const L = (x: number) => 2 * x;
      const R = (x: number) => x + 2;
      return art(
        'A graph of 2x for x less than 3 ending at a hollow point (3, 6), and x + 2 for x greater than 3 starting at a hollow point (3, 5)',
        ax.body +
          title('two traces, two different targets') +
          ax.curve(leftOf(L, 3), AMB, 2.8) +
          ax.curve(rightOf(R, 3), SKY, 2.8) +
          line(ax.X(0), ax.Y(6), ax.X(3), ax.Y(6), ROSE, 1.6, '4 4', 0.8) +
          line(ax.X(0), ax.Y(5), ax.X(3), ax.Y(5), ROSE, 1.6, '4 4', 0.8) +
          creep(ax, L, 1.6, 2.5, AMB) +
          creep(ax, R, 4.6, 3.6, SKY) +
          hollow(ax, 3, 6, AMB) +
          hollow(ax, 3, 5, SKY) +
          lab(ax, 2.85, 6.9, 'from the left → 6', { fill: AMB, anchor: 'end' }) +
          lab(ax, 3.2, 4.2, 'from the right → 5', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'left piece: 2x', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'right piece: x + 2', { size: 12, fill: SKY, anchor: 'end' }),
        'The left-hand limit is 6 and the right-hand limit is 5. Each side gets its own answer.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to 3^-} f(x) = 6 \\qquad \\lim_{x \\to 3^+} f(x) = 5',
      note: 'The little minus and plus say which side you came from. They are not signs on the number 3.',
      parts: [
        { sym: 'x \\to 3^-', means: 'from the left: x = 2.9, 2.99, 2.999…', tone: 'warn' },
        { sym: 'x \\to 3^+', means: 'from the right: x = 3.1, 3.01, 3.001…', tone: 'accent' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Both sides must agree',
    body: 'The two-sided limit exists only when the left trace and the right trace aim at the SAME height. If they disagree, the limit does not exist: we write DNE. Two different formulas can still agree, like x² and 6 − x meeting at height 4 when x = 2.',
    why: 'A limit is ONE number that the heights settle toward. If the left traces settle at 6 and the right traces settle at 5, the heights keep splitting between two targets and never settle, so no single number deserves the name. Agreement of the two sides is exactly the settling condition.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [0, 6] }, [1, 2, 3], [2, 4, 6]);
      const L = (x: number) => x * x;
      const R = (x: number) => 6 - x;
      return art(
        'The parabola x squared for x less than 2 and the line 6 minus x for x at least 2 meeting at a filled point (2, 4)',
        ax.body +
          title('different formulas, same target') +
          ax.curve(leftOf(L, 2, 0.02), AMB, 2.8) +
          ax.curve(rightOf(R, 2, 0.02), SKY, 2.8) +
          guides(ax, 2, 4) +
          creep(ax, L, 0.9, 1.6, AMB) +
          creep(ax, R, 3.3, 2.5, SKY) +
          solid(ax, 2, 4, EMR) +
          lab(ax, 2.2, 4.9, 'both sides → 4', { fill: EMR, anchor: 'start' }) +
          text(W - 24, 40, 'x² on the left', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, '6 − x on the right', { size: 12, fill: SKY, anchor: 'end' }),
        'Left: x² → 4. Right: 6 − x → 4. They agree, so the limit is 4.',
      );
    })(),
    compare: {
      cols: [
        { title: 'Sides agree', tex: '4 = 4', lines: ['Left → 4, right → 4', 'The limit EXISTS', 'Its value is 4'], tone: 'ok' },
        { title: 'Sides disagree', tex: '6 \\ne 5', lines: ['Left → 6, right → 5', 'The limit does NOT exist', 'Write DNE, not 5.5'], tone: 'bad' },
      ],
      note: 'A limit is one number. Two different targets means there is no such number.',
    },
  },
  {
    kind: 'concept',
    head: 'Tables: sneak up on the number',
    body: 'No graph? Build a table. To find the limit as x → 3, try x = 2.9, 2.99, 2.999 from the left and x = 3.1, 3.01, 3.001 from the right. Watch what the outputs settle toward. For (x² − 9)/(x − 3) both columns squeeze toward 6.',
    why: 'A table samples the graph: each row is one point on the curve, and rows 0.1, 0.01 and 0.001 away show the trend. Here the top factors as (x − 3)(x + 3), so the outputs equal x + 3, namely 5.9, 5.99, 5.999 on the left. A table suggests the limit; algebra later proves it.',
    art: (() => {
      const ax = grid({ x: [1, 5], y: [2, 8] }, [2, 3, 4], [4, 6, 8]);
      const f = (x: number) => x + 3;
      return art(
        'The line y = x + 3 with a hole at (3, 6), dots at (2.5, 5.5) and (3.5, 6.5) creeping toward the hole from each side',
        ax.body +
          title('the outputs squeeze toward 6') +
          ax.curve(cut(f, 3), AMB, 2.8) +
          guides(ax, 3, 6) +
          solid(ax, 2.5, 5.5, SKY) +
          solid(ax, 3.5, 6.5, SKY) +
          creep(ax, f, 2.6, 2.85, SKY) +
          creep(ax, f, 3.4, 3.15, SKY) +
          hollow(ax, 3, 6) +
          lab(ax, 2.4, 6.1, '(2.5, 5.5)', { fill: SKY, anchor: 'end' }) +
          lab(ax, 3.6, 5.9, '(3.5, 6.5)', { fill: SKY, anchor: 'start' }) +
          lab(ax, 3, 7.1, 'hole at (3, 6)', { fill: ROSE }) +
          text(W - 24, 40, 'y = (x² − 9)/(x − 3)', { size: 12, fill: AMB, anchor: 'end' }),
        'Each dot is a row of the table. The closer x gets to 3, the closer the height gets to 6.',
      );
    })(),
    table: {
      head: ['x', '(x² − 9)/(x − 3)'],
      rows: [['2.9', '5.9'], ['2.99', '5.99'], ['2.999', '5.999'], ['3.001', '6.001'], ['3.01', '6.01'], ['3.1', '6.1']],
      note: 'Read down the right column from both ends: the numbers close in on 6 from below and from above.',
    },
    formula: {
      tex: 'x = 3 \\pm 0.1,\\ 3 \\pm 0.01,\\ 3 \\pm 0.001 \\quad \\Rightarrow \\quad f(x) \\to 6',
      note: 'Each input is ten times closer to 3 than the last, and each output lands ten times closer to 6.',
      parts: [
        { sym: '3 - 0.1,\\ 3 - 0.01', means: 'the left column, creeping up to 3', tone: 'warn' },
        { sym: '3 + 0.1,\\ 3 + 0.01', means: 'the right column, creeping down to 3', tone: 'accent' },
        { sym: 'f(x) \\to 6', means: 'what both columns settle toward: the limit', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: the hole at x = 2',
    body: 'f(x) = (x² − 4)/(x − 2) has a hole at x = 2, so you cannot just plug in 2. What height do the nearby points aim at from each side?',
    steps: {
      steps: [
        { tex: 'f(x) = \\frac{x^2 - 4}{x - 2}', text: 'Try x = 2 first. The bottom is 2 − 2 = 0 and you cannot divide by zero, so f(2) does not exist. That is a hole, so the limit must come from the neighbors.' },
        { tex: 'x = 1.9 \\Rightarrow f(x) = 3.9', text: 'Pick an x just left of 2, like 1.9. The top is 3.61 − 4 = −0.39 and the bottom is −0.1, so f(1.9) = 3.9. Heights from the left sit just under 4.' },
        { tex: 'x = 2.1 \\Rightarrow f(x) = 4.1', text: 'Pick an x just right of 2, like 2.1. The top is 4.41 − 4 = 0.41 and the bottom is 0.1, so f(2.1) = 4.1. Heights from the right sit just over 4.' },
        { tex: '3.9,\\ 3.99,\\ 3.999 \\to 4 \\leftarrow 4.001,\\ 4.01,\\ 4.1', text: 'Move even closer on both sides and the outputs tighten around 4: from the left they rise toward it and from the right they fall toward it. Both sides settle on the same height, 4.' },
      ],
      answer: '\\lim_{x \\to 2} f(x) = 4',
    },
    table: {
      head: ['x', 'f(x)'],
      rows: [['1.9', '3.9'], ['1.99', '3.99'], ['2.01', '4.01'], ['2.1', '4.1']],
      note: 'The hole sits at (2, 4); the table never lands on it, and never needs to.',
    },
  },
  {
    kind: 'example',
    head: 'A stray dot',
    body: 'A graph of g heads toward height 4 as x → 2, but there is a lone dot at (2, 1). Does the dot change the limit, and what is g(2)?',
    steps: {
      steps: [
        { tex: 'x \\to 2^-:\\ g(x) \\to 4', text: 'Trace the graph in from the left, with your thumb covering x = 2. The heights you see all head toward 4, so the left-hand limit is 4.' },
        { tex: 'x \\to 2^+:\\ g(x) \\to 4', text: 'Trace in from the right the same way. Those heights also head toward 4, so the right-hand limit is 4 as well.' },
        { tex: '\\lim_{x \\to 2} g(x) = 4', text: 'The two one-sided limits agree, both are 4, so the two-sided limit exists and equals 4. The lone dot never entered the argument.' },
        { tex: 'g(2) = 1', text: 'The value g(2) is just the height of the dot at x = 2, which is 1. A limit and a value answer different questions, so they can disagree.' },
      ],
      answer: '\\text{limit } 4,\\quad g(2) = 1',
    },
  },
  {
    kind: 'example',
    head: 'Two formulas, one seam',
    body: 'f(x) = x + 1 for x < 1 and f(x) = 4 − x for x > 1. What happens to f as x → 1? The formula changes at 1, so check each side with its own rule.',
    art: (() => {
      const ax = grid({ x: [-1, 3], y: [0, 5] }, [-1, 1, 2, 3], [1, 2, 3, 4, 5]);
      const L = (x: number) => x + 1;
      const R = (x: number) => 4 - x;
      return art(
        'The line x + 1 for x less than 1 ending at a hollow point (1, 2), and the line 4 minus x for x greater than 1 starting at a hollow point (1, 3), with the gap between them marked',
        ax.body +
          title('left 2, right 3: no agreement') +
          ax.curve(leftOf(L, 1), AMB, 2.8) +
          ax.curve(rightOf(R, 1), SKY, 2.8) +
          line(ax.X(1), ax.Y(2), ax.X(1), ax.Y(3), ROSE, 2.4, '3 3') +
          creep(ax, L, -0.2, 0.6, AMB) +
          creep(ax, R, 2.3, 1.5, SKY) +
          hollow(ax, 1, 2, AMB) +
          hollow(ax, 1, 3, SKY) +
          lab(ax, 0.85, 1.5, 'left → 2', { fill: AMB, anchor: 'end' }) +
          lab(ax, 1.15, 3.6, 'right → 3', { fill: SKY, anchor: 'start' }) +
          lab(ax, 1.15, 2.45, 'gap', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'x + 1 on the left', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, '4 − x on the right', { size: 12, fill: SKY, anchor: 'end' }),
        'The two pieces miss each other by 1. No single height fits both traces, so the limit is DNE.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'x \\to 1^-:\\ x + 1 \\to 1 + 1 = 2', text: 'Just left of 1 (x < 1) the function uses the rule x + 1. Putting 1 into it gives 1 + 1 = 2, so the left-hand limit is 2.' },
        { tex: 'x \\to 1^+:\\ 4 - x \\to 4 - 1 = 3', text: 'Just right of 1 (x > 1) the function uses the other rule, 4 − x. Putting 1 into it gives 4 − 1 = 3, so the right-hand limit is 3.' },
        { tex: '2 \\ne 3', text: 'Compare the sides: 2 is not 3. A limit must be one number that both sides head to, so with two different targets there is no limit and we write DNE.' },
      ],
      answer: '\\text{DNE (left 2, right 3)}',
    },
  },
  {
    kind: 'example',
    head: 'Another way: read a table',
    body: 'Find the limit of (x² − 9)/(x − 3) as x → 3 without a graph. Build a table of inputs creeping toward 3 from each side and watch where the outputs go.',
    table: {
      head: ['x', 'x² − 9', 'x − 3', 'quotient'],
      rows: [['2.9', '−0.59', '−0.1', '5.9'], ['2.99', '−0.0599', '−0.01', '5.99'], ['3.01', '0.0601', '0.01', '6.01'], ['3.1', '0.61', '0.1', '6.1']],
      note: 'Top and bottom both shrink to 0, but their ratio settles on 6.',
    },
    steps: {
      steps: [
        { tex: 'x = 2.9:\\ \\frac{8.41 - 9}{2.9 - 3} = \\frac{-0.59}{-0.1} = 5.9', text: 'Start one step left of 3 with x = 2.9. The top is 8.41 − 9 = −0.59 and the bottom is −0.1, and a negative over a negative is positive, giving 5.9.' },
        { tex: 'x = 2.99:\\ \\frac{-0.0599}{-0.01} = 5.99', text: 'Move closer with x = 2.99. The top is −0.0599 and the bottom is −0.01, so the quotient is 5.99. Getting closer to 3 moved the output closer to 6.' },
        { tex: 'x = 3.1:\\ \\frac{0.61}{0.1} = 6.1', text: 'Now cross to the right with x = 3.1. The top is 9.61 − 9 = 0.61 and the bottom is 0.1, so the quotient is 6.1, just above 6.' },
        { tex: 'x = 3.01:\\ \\frac{0.0601}{0.01} = 6.01', text: 'Move closer on the right with x = 3.01. The top is 0.0601 and the bottom is 0.01, giving 6.01. Both sides close in on 6, so the limit is 6.' },
      ],
      answer: '\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = 6',
    },
  },
  {
    kind: 'example',
    head: 'Two formulas that agree',
    body: 'g(x) = x² for x < 2 and g(x) = 6 − x for x ≥ 2. Do the two formulas head to the same height as x → 2? Check each side with its own rule.',
    steps: {
      steps: [
        { tex: 'x \\to 2^-:\\ x^2 \\to 2^2 = 4', text: 'For x just left of 2 the rule is x². Putting 2 into it gives 2² = 4, so the left-hand limit is 4.' },
        { tex: 'x \\to 2^+:\\ 6 - x \\to 6 - 2 = 4', text: 'For x just right of 2 the rule is 6 − x. Putting 2 into it gives 6 − 2 = 4, so the right-hand limit is 4.' },
        { tex: '4 = 4', text: 'Both one-sided limits equal 4. Two different formulas can still aim at the same height, and since the sides agree, the two-sided limit exists.' },
        { tex: 'g(2) = 6 - 2 = 4', text: 'As a bonus, g(2) uses the second piece because of the ≥ sign, so g(2) = 6 − 2 = 4. Limit and value match, so the graph has no break at x = 2.' },
      ],
      answer: '\\lim_{x \\to 2} g(x) = 4',
    },
  },
  {
    kind: 'example',
    head: 'A one-sided limit from a formula',
    body: 'What is the limit of |x − 2|/(x − 2) as x → 2 from the left? The absolute value bars hide a sign, so decide the sign first, then simplify.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [-2, 2] }, [1, 2, 3], [-1, 1]);
      return art(
        'A flat line at height minus 1 for x less than 2 and a flat line at height 1 for x greater than 2, with hollow points at x = 2 on both',
        ax.body +
          title('|x − 2|/(x − 2) is a two-step graph') +
          ax.curve(leftOf(() => -1, 2), AMB, 2.8) +
          ax.curve(rightOf(() => 1, 2), SKY, 2.8) +
          creep(ax, () => -1, 0.6, 1.5, AMB) +
          creep(ax, () => 1, 3.4, 2.5, SKY) +
          hollow(ax, 2, -1, AMB) +
          hollow(ax, 2, 1, SKY) +
          lab(ax, 1.0, -1.5, '−1 on the left', { fill: AMB }) +
          lab(ax, 3.0, 1.5, '+1 on the right', { fill: SKY }),
        'Coming from the left the heights are all −1, so the left-hand limit is −1. From the right they are all +1.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'x < 2 \\Rightarrow x - 2 < 0', text: 'Approaching from the left means x < 2, so x − 2 is a small negative number. We need that sign to know what the absolute value does.' },
        { tex: '|x - 2| = -(x - 2)', text: 'Absolute value turns a negative into its positive twin, so for a negative x − 2 we get |x − 2| = −(x − 2). The minus sign is what makes the result positive.' },
        { tex: '\\frac{-(x - 2)}{x - 2} = -1', text: 'Put that in the fraction. The top −(x − 2) and the bottom x − 2 share the factor (x − 2), which cancels because x ≠ 2, leaving −1 for every x on the left.' },
        { tex: '\\lim_{x \\to 2^-} \\frac{|x - 2|}{x - 2} = -1', text: 'The function equals the constant −1 at every x left of 2, and a constant\'s heights never change, so the left-hand limit is −1.' },
      ],
      answer: '-1',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the parking garage',
    body: 'A garage charges $3 for each hour or part of an hour. C(t) is the cost after t hours. What does C(t) approach as t → 1 from each side? Sketch the staircase first.',
    art: (() => {
      const ax = grid({ x: [0, 3.5], y: [0, 10] }, [1, 2, 3], [3, 6, 9], { xLabel: 't', yLabel: 'cost' });
      return art(
        'A staircase graph: cost 3 dollars up to one hour, 6 dollars up to two hours, 9 dollars up to three hours, with a jump at t equals 1',
        ax.body +
          title('the price jumps at t = 1') +
          ax.curve((x) => (x > 0.02 && x < 0.98 ? 3 : NaN), AMB, 2.8) +
          ax.curve((x) => (x > 1.05 && x < 1.98 ? 6 : NaN), SKY, 2.8) +
          ax.curve((x) => (x > 2.05 && x < 2.98 ? 9 : NaN), EMR, 2.8) +
          solid(ax, 1, 3, AMB) +
          hollow(ax, 1, 6, SKY) +
          solid(ax, 2, 6, SKY) +
          hollow(ax, 2, 9, EMR) +
          solid(ax, 3, 9, EMR) +
          creep(ax, () => 3, 0.3, 0.8, AMB) +
          creep(ax, () => 6, 1.8, 1.3, SKY) +
          lab(ax, 0.9, 4.0, 'left → $3', { fill: AMB, anchor: 'end' }) +
          lab(ax, 1.15, 7.0, 'right → $6', { fill: SKY, anchor: 'start' }),
        'Just under one hour the cost is $3; just over, it is $6. The staircase jumps, so the limit at t = 1 is DNE.',
      );
    })(),
    steps: {
      steps: [
        { tex: 't \\to 1^-:\\ C(t) = 3', text: 'At 0.9 or 0.99 hours you are still inside the first hour, so you owe one $3 charge. Every time just before 1 hour costs $3, so the left-hand limit is 3.' },
        { tex: 't \\to 1^+:\\ C(t) = 6', text: 'At 1.01 hours a second hour has begun, and any part of an hour counts as a full one, so a second $3 is added. Times just after 1 hour cost $6, so the right-hand limit is 6.' },
        { tex: '3 \\ne 6', text: 'The left-hand limit 3 and the right-hand limit 6 differ, so the heights do not settle on one number. The staircase jumps at t = 1, so the two-sided limit does not exist.' },
      ],
      answer: '\\text{left } 3,\\ \\text{right } 6,\\ \\text{limit DNE}',
    },
  },
  {
    kind: 'protip',
    head: 'Trace with two fingers',
    body: 'Put one finger on the graph far to the left of c and one far to the right. Slide both toward c at the same time and stop just before you touch it. If both fingers are at the same height, that height is the limit. If not, say DNE and name each one-sided limit.',
    compare: {
      cols: [
        { title: 'Left finger', tex: 'x \\to c^-', lines: ['Slides in from smaller x', 'Reads the left-hand limit', 'Stops just short of c'], tone: 'warn' },
        { title: 'Right finger', tex: 'x \\to c^+', lines: ['Slides in from larger x', 'Reads the right-hand limit', 'Stops just short of c'], tone: 'accent' },
        { title: 'Same height?', tex: 'L', lines: ['Yes: the limit is L', 'No: DNE', 'Never touch c itself'], tone: 'ok' },
      ],
      note: 'The fingers never land on c. That is how you stop a hole or a stray dot from fooling you.',
    },
  },
  {
    kind: 'protip',
    head: 'Make the table squeeze',
    body: 'A good limit table has three entries on each side, each ten times closer than the last. For (x² − 1)/(x − 1) as x → 1, the graph is the line y = x + 1 with a hole, and the table shows the heights closing in on 2 from both directions.',
    table: {
      head: ['x', '(x² − 1)/(x − 1)'],
      rows: [['0.9', '1.9'], ['0.99', '1.99'], ['0.999', '1.999'], ['1.001', '2.001'], ['1.01', '2.01'], ['1.1', '2.1']],
      mark: 2,
      note: 'Each row is ten times closer to 1 and ten times closer to 2. The limit is 2.',
    },
    formula: {
      tex: 'x = c \\pm 0.1,\\ c \\pm 0.01,\\ c \\pm 0.001',
      note: 'Six inputs, three on each side, each a decimal place closer than the one before.',
      parts: [
        { sym: 'c - 0.1,\\ c - 0.01', means: 'the left column, creeping up to c', tone: 'warn' },
        { sym: 'c + 0.1,\\ c + 0.01', means: 'the right column, creeping down to c', tone: 'accent' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: the limit is not the value',
    body: 'Students see a dot at (2, 1) and answer "the limit is 1." The dot is g(2), the VALUE. The limit is where the rest of the graph is heading, which here is 4. Ask yourself: if I erased the dot, where would the car be aiming?',
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\lim_{x \\to 2} g(x) = 1', lines: ['Reads the dot', 'That is g(2), not the limit', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '\\lim_{x \\to 2} g(x) = 4', lines: ['Reads the neighbors', 'The dot is ignored', 'Right'], tone: 'ok' },
      ],
      note: 'A limit can be 4 when the value is 1, or when there is no value at all.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: DNE is not the average',
    body: 'When the left trace heads to 2 and the right trace heads to 3, some students answer 2.5. There is no height that both traces aim at, so there is no limit. The answer is DNE, together with the two one-sided limits.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\tfrac{2 + 3}{2} = 2.5', lines: ['Splits the difference', 'No trace heads to 2.5', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '\\text{DNE}', lines: ['Left-hand limit 2', 'Right-hand limit 3', 'Right'], tone: 'ok' },
      ],
      note: 'A limit is one height both sides agree on. Disagreement means no limit, not a compromise.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: a hole on a seam',
    body: 'f(x) = (x² − 1)/(x − 1) for x < 1 and f(x) = 3x − 1 for x > 1. Find the limit as x → 1. The left piece is 0/0 at 1, so simplify it first, then compare the two sides.',
    art: (() => {
      const ax = grid({ x: [-1, 3], y: [-1, 6] }, [-1, 1, 2, 3], [2, 4, 6]);
      const L = (x: number) => x + 1;
      const R = (x: number) => 3 * x - 1;
      return art(
        'The line x + 1 for x less than 1 and the steeper line 3x minus 1 for x greater than 1, meeting at a hollow point (1, 2)',
        ax.body +
          title('two pieces, one hole, one limit') +
          ax.curve(leftOf(L, 1), AMB, 2.8) +
          ax.curve(rightOf(R, 1), SKY, 2.8) +
          guides(ax, 1, 2) +
          creep(ax, L, -0.4, 0.5, AMB) +
          creep(ax, R, 1.8, 1.35, SKY) +
          hollow(ax, 1, 2, ROSE) +
          lab(ax, 1.2, 1.3, 'both pieces → 2', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'x + 1 on the left', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, '3x − 1 on the right', { size: 12, fill: SKY, anchor: 'end' }),
        'The pieces have different slopes but aim at the same hole. The limit is 2; f(1) does not exist.',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\frac{x^2 - 1}{x - 1} = \\frac{(x - 1)(x + 1)}{x - 1} = x + 1', text: 'The left piece gives 0/0 at x = 1, so factor the top as a difference of squares, (x − 1)(x + 1). The (x − 1) cancels for x ≠ 1, leaving x + 1.' },
        { tex: 'x \\to 1^-:\\ x + 1 \\to 2', text: 'As x approaches 1 from the left, the simplified rule x + 1 heads to 1 + 1 = 2. Cancelling removed only the single point x = 1, which a limit never looks at.' },
        { tex: 'x \\to 1^+:\\ 3x - 1 \\to 3(1) - 1 = 2', text: 'As x approaches 1 from the right, the rule is 3x − 1, a polynomial, so just substitute: 3(1) − 1 = 2. The right-hand limit is 2.' },
        { tex: '2 = 2', text: 'Both one-sided limits equal 2. When left and right agree, the two-sided limit exists and equals that shared height, so the limit is 2.' },
        { tex: 'f(1)\\ \\text{undefined}', text: 'Neither piece includes x = 1, so f(1) is undefined. That is fine: a limit describes where the heights head, and it can exist even when the function has no value at the point.' },
      ],
      answer: '\\lim_{x \\to 1} f(x) = 2',
    },
  },
  {
    kind: 'summary',
    head: 'Limits: where, not what',
    body: 'A limit is the height a graph is heading for, read with the point itself covered up. Check the left side and the right side separately. If they agree, that shared height is the limit; if they disagree, the limit does not exist. A table of inputs creeping toward c shows the same thing in numbers.',
    formula: {
      tex: '\\lim_{x \\to c} f(x) = L \\iff \\lim_{x \\to c^-} f(x) = L = \\lim_{x \\to c^+} f(x)',
      note: 'One two-sided limit is really two one-sided limits that happen to agree.',
      parts: [
        { sym: 'x \\to c^-', means: 'trace in from the left', tone: 'warn' },
        { sym: 'x \\to c^+', means: 'trace in from the right', tone: 'accent' },
        { sym: 'f(c)', means: 'the value at c: not part of the limit at all', tone: 'plain' },
      ],
    },
    table: {
      head: ['Graph near c', 'Left', 'Right', 'Limit'],
      rows: [['line with a hole at (2, 4)', '4', '4', '4'], ['hole at (2, 4), dot at (2, 1)', '4', '4', '4'], ['x + 1 then 4 − x at x = 1', '2', '3', 'DNE'], ['garage cost at t = 1', '$3', '$6', 'DNE']],
    },
  },
];

// ---------------- CALC-2 — Limit laws and algebraic limits ----------------
const CALC_2: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Limits you can compute exactly',
    body: 'Graphs and tables suggest a limit; algebra proves it. Today you will plug in when you can, and when plugging in gives the puzzle 0/0 you will factor, rationalize or squeeze your way to the exact answer. The hole in this graph has a precise height, 6, and algebra finds it.',
    art: (() => {
      const ax = grid({ x: [-1, 6], y: [-1, 9] }, [1, 2, 3, 4, 5], [3, 6, 9]);
      const f = (x: number) => x + 3;
      return art(
        'The line y = x + 3 with a hole at (3, 6), labelled as the place where plugging in gives 0 over 0',
        ax.body +
          title('plugging in x = 3 gives 0/0, the limit is 6') +
          ax.curve(cut(f, 3), AMB, 2.8) +
          guides(ax, 3, 6) +
          hollow(ax, 3, 6, ROSE) +
          lab(ax, 3.25, 6.9, '0/0 here', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 3.25, 5.2, 'limit 6', { fill: EMR, anchor: 'start' }) +
          text(W - 24, 40, 'y = (x² − 9)/(x − 3)', { size: 12, fill: AMB, anchor: 'end' }),
        'Substitution fails at the hole, but the line y = x + 3 tells you the height the graph is heading for.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to c} f(x) = f(c) \\quad \\text{when } f \\text{ is continuous at } c',
      note: 'Direct substitution: for a polynomial, or any nice function where it is defined, the limit is just the value.',
      parts: [
        { sym: 'f(c)', means: 'plug c straight in: the first thing to try', tone: 'ok' },
        { sym: '\\tfrac{0}{0}', means: 'what you get at a hole: a signal to do more algebra', tone: 'warn' },
        { sym: '\\tfrac{5}{0}', means: 'a nonzero top over zero: no cancelling, the graph blows up', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Limit laws: limits respect arithmetic',
    body: 'If f heads to 1 and g heads to 2, then f + g heads to 3, f − g heads to −1, f · g heads to 2 and f/g heads to 1/2. The limit of a sum is the sum of the limits, and so on. The one rule: a quotient needs a bottom whose limit is not 0.',
    why: 'Heights near c are just numbers that are almost L and almost M. Numbers that are nearly 1 and nearly 2 add to something nearly 3, and the same holds for differences and products. A quotient works too unless the bottom is nearly 0, where tiny errors blow up.',
    art: (() => {
      const ax = grid({ x: [-1, 4], y: [-1, 5] }, [1, 2, 3], [1, 2, 3, 4]);
      return art(
        'Three lines on one grid: f(x) = x, g(x) = 2 and their sum x + 2, with the three heights at x = 1 marked as 1, 2 and 3',
        ax.body +
          title('at x = 1: 1 + 2 = 3') +
          ax.curve((x) => x, SKY, 2.4) +
          ax.curve(() => 2, EMR, 2.4) +
          ax.curve((x) => x + 2, AMB, 2.8) +
          line(ax.X(1), ax.Y(0), ax.X(1), ax.Y(3), ROSE, 1.6, '4 4', 0.8) +
          solid(ax, 1, 1, SKY) +
          solid(ax, 1, 2, EMR) +
          solid(ax, 1, 3, AMB) +
          lab(ax, 1.2, 3.55, '1 + 2 = 3', { fill: AMB, anchor: 'start' }) +
          text(W - 24, 40, 'f + g = x + 2', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'f(x) = x', { size: 12, fill: SKY, anchor: 'end' }) +
          text(W - 24, 74, 'g(x) = 2', { size: 12, fill: EMR, anchor: 'end' }),
        'The sum line sits exactly one f-height above the g line everywhere, so its limit is the sum of the two limits.',
      );
    })(),
    formula: {
      tex: '\\lim (f \\pm g) = \\lim f \\pm \\lim g \\qquad \\lim (f \\cdot g) = \\lim f \\cdot \\lim g \\qquad \\lim \\frac{f}{g} = \\frac{\\lim f}{\\lim g}',
      note: 'Take the limit of each piece, then combine the pieces. The quotient law needs lim g ≠ 0.',
      parts: [
        { sym: '\\lim f \\pm \\lim g', means: 'sum and difference laws', tone: 'accent' },
        { sym: '\\lim f \\cdot \\lim g', means: 'product law, which also gives constant multiples', tone: 'ok' },
        { sym: '\\lim g \\ne 0', means: 'the quotient law\'s one condition', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Direct substitution first',
    body: 'Polynomials have no holes, jumps or breaks, so their limits are just their values: plug in and you are done. The same goes for rational, root and trig functions anywhere they are defined. For f(x) = 2x² − x the limit at 3 is f(3) = 18 − 3 = 15, and the graph agrees.',
    why: 'A continuous function has no hole, jump or break, so the heights near c are close to the height at c itself, which makes f(c) exactly where the neighbors head. For 2x² − x, the neighbor x = 3.01 gives about 15.11, very close to f(3) = 15.',
    art: (() => {
      const ax = grid({ x: [-1, 4], y: [-2, 18] }, [1, 2, 3], [5, 10, 15]);
      const f = (x: number) => 2 * x * x - x;
      return art(
        'The parabola y = 2x squared minus x with the point (3, 15) marked and dashed guides to both axes',
        ax.body +
          title('no hole, so the limit is the value') +
          ax.curve(f, AMB, 2.8) +
          guides(ax, 3, 15) +
          creep(ax, f, 2.0, 2.7, SKY) +
          solid(ax, 3, 15, EMR) +
          lab(ax, 2.85, 16.4, 'f(3) = 15', { fill: EMR, anchor: 'end' }) +
          text(W - 24, 40, 'y = 2x² − x', { size: 12, fill: AMB, anchor: 'end' }),
        'The curve passes straight through (3, 15). Heading there and being there are the same thing.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to 3} (2x^2 - x) = 2(3)^2 - 3 = 15',
      note: 'For a polynomial the limit is one substitution away.',
      parts: [
        { sym: '2x^2 - x', means: 'a polynomial: continuous everywhere', tone: 'accent' },
        { sym: '2(3)^2 - 3', means: 'replace every x with 3', tone: 'ok' },
        { sym: '15', means: 'the limit AND the value', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: '0/0 means "keep working"',
    body: 'When substitution gives 0/0, you have hit an INDETERMINATE form. It does not mean the answer is 0 and it does not mean undefined. It means the top and bottom share a factor that is hiding the real answer. A nonzero top over 0, like 20/0, is different: that is a blow-up.',
    why: 'Zero over zero says the top and bottom shrink to nothing together, and the answer depends on how fast each one shrinks. For (x² − 9)/(x − 3) the top shrinks 6 times as fast as the bottom near 3, so the ratio settles at 6, not 0 and not undefined.',
    art: (() => {
      const ax = grid({ x: [-5, 5], y: [-3, 3] }, [-4, -2, 2, 4], [-2, 2]);
      const f = (x: number) => (x - 3) / (x + 2);
      return art(
        'The graph of (x squared minus 5x plus 6) over (x squared minus 4): a hole at (2, minus one quarter) and a vertical asymptote at x equals minus 2',
        ax.body +
          title('two kinds of zero on the bottom') +
          line(ax.X(-2), ax.Y(-3), ax.X(-2), ax.Y(3), ROSE, 2, '6 5') +
          ax.curve(cut(f, 2, 0.12), AMB, 2.8) +
          hollow(ax, 2, -0.25, EMR) +
          lab(ax, 2.2, 0.6, '0/0: a hole', { fill: EMR, anchor: 'start' }) +
          lab(ax, -2.3, 1.9, '20/0: blows up', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 57, 'y = (x² − 5x + 6)/(x² − 4)', { size: 12, fill: AMB, anchor: 'end' }),
        'At x = 2 both top and bottom are 0: a hole with a limit. At x = −2 only the bottom is 0: a vertical asymptote.',
      );
    })(),
    compare: {
      cols: [
        { title: '0/0', tex: '\\tfrac{0}{0}', lines: ['Indeterminate', 'A shared factor is hiding', 'Factor, rationalize or squeeze'], tone: 'warn' },
        { title: 'nonzero/0', tex: '\\tfrac{20}{0}', lines: ['Infinite', 'Nothing to cancel', 'Vertical asymptote'], tone: 'bad' },
        { title: '0/nonzero', tex: '\\tfrac{0}{5}', lines: ['Just 0', 'Not a puzzle at all', 'The limit is 0'], tone: 'ok' },
      ],
      note: 'Only 0/0 asks for more algebra. The other two are already answers.',
    },
  },
  {
    kind: 'concept',
    head: 'Factor and cancel',
    body: 'The fraction (x² − 25)/(x − 5) equals x + 5 for every x except 5, because (x − 5)(x + 5)/(x − 5) cancels. Cancelling does not change where the graph is heading; it only removes the one point that was never there. So the limit at 5 is 5 + 5 = 10.',
    why: 'The cancelled fraction and the original are the same number at every x except 5, so their neighbors have identical heights. A limit looks only at neighbors, so it cannot tell the two apart. Test it: at x = 5.01 the original fraction gives 10.01, just like x + 5.',
    art: (() => {
      const ax = grid({ x: [0, 8], y: [0, 14] }, [2, 4, 5, 6], [5, 10]);
      const f = (x: number) => x + 5;
      return art(
        'The line y = x + 5 with a single hollow point at (5, 10), the only place it differs from (x squared minus 25) over (x minus 5)',
        ax.body +
          title('cancel the factor, keep the hole in mind') +
          ax.curve(cut(f, 5, 0.1), AMB, 2.8) +
          guides(ax, 5, 10) +
          hollow(ax, 5, 10, ROSE) +
          lab(ax, 5.2, 11.3, 'hole at (5, 10)', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 4.8, 8.3, 'the limit is 10', { fill: EMR, anchor: 'end' }) +
          text(W - 24, 40, 'y = (x² − 25)/(x − 5)', { size: 12, fill: AMB, anchor: 'end' }),
        'Same line as y = x + 5, one point missing. The limit at 5 is the height of the missing point: 10.',
      );
    })(),
    formula: {
      tex: '\\frac{x^2 - 25}{x - 5} = \\frac{(x - 5)(x + 5)}{x - 5} = x + 5 \\quad (x \\ne 5)',
      note: 'Factor the top, cancel the shared factor, then substitute into what is left.',
      parts: [
        { sym: '(x - 5)(x + 5)', means: 'difference of squares: the hidden shared factor appears', tone: 'accent' },
        { sym: 'x \\ne 5', means: 'the cancelled factor was zero only at 5, so the graph has a hole there', tone: 'warn' },
        { sym: 'x + 5 \\to 10', means: 'substitute 5 into the simplified form', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Rationalize, or squeeze',
    body: 'A square root will not factor, so multiply top and bottom by its CONJUGATE: √x − 2 times √x + 2 is x − 4, and now something cancels. A function that wiggles forever, like sin(1/x), gets SQUEEZED between two tame functions that share a limit.',
    why: 'A conjugate works because (a − b)(a + b) = a² − b², which turns a root into a plain polynomial and exposes the shared factor. The squeeze works because a function stuck between two others that head to the same height is forced to head there too, however much it wiggles.',
    art: flow(
      [
        { label: 'Plug in c', color: SKY },
        { label: '0/0?', color: ROSE },
        { label: 'do algebra', color: AMB },
        { label: 'Plug in again', color: EMR },
      ],
      { title: 'the algebraic-limit routine', horizontal: true, caption: 'Substitute first. Only an indeterminate 0/0 sends you to the algebra box: factor, conjugate or squeeze.' },
    ),
    formula: {
      tex: '\\frac{\\sqrt{x} - 2}{x - 4} \\cdot \\frac{\\sqrt{x} + 2}{\\sqrt{x} + 2} = \\frac{x - 4}{(x - 4)(\\sqrt{x} + 2)} = \\frac{1}{\\sqrt{x} + 2}',
      note: 'Multiplying by the conjugate over itself multiplies by 1, so nothing changes except the form.',
      parts: [
        { sym: '\\sqrt{x} + 2', means: 'the conjugate: same terms, opposite sign in the middle', tone: 'accent' },
        { sym: '(\\sqrt{x} - 2)(\\sqrt{x} + 2) = x - 4', means: 'the root disappears, and a factor you can cancel appears', tone: 'ok' },
        { sym: '-x^2 \\le x^2 \\sin\\tfrac{1}{x} \\le x^2', means: 'the squeeze: two fences that both head to 0', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: just substitute',
    body: 'Find the limit of 2x² − x as x → 3. This is a polynomial, so ask whether you can simply plug the number in.',
    steps: {
      steps: [
        { tex: '2x^2 - x\\ \\text{is a polynomial}', text: 'Polynomials have no holes, jumps or breaks, so they are continuous everywhere. For a continuous function the limit equals the value, which makes direct substitution allowed.' },
        { tex: '2(3)^2 - 3', text: 'Replace every x in 2x² − x with 3. Keep the parentheses, so the expression reads 2(3)² − 3 and the square applies to the 3 only.' },
        { tex: '2(9) - 3 = 18 - 3', text: 'Follow the order of operations: square first to get 9, then multiply by 2 to get 18, and only then subtract 3.' },
        { tex: '= 15', text: 'Finish the arithmetic: 18 − 3 = 15. Because the function is continuous at 3, the limit equals the value, so the limit is 15.' },
      ],
      answer: '15',
    },
  },
  {
    kind: 'example',
    head: '0/0, so factor',
    body: 'Find the limit of (x² − 9)/(x − 3) as x → 3. Plug in first and see what comes out before you decide what to do next.',
    steps: {
      steps: [
        { tex: '\\frac{3^2 - 9}{3 - 3} = \\frac{0}{0}', text: 'Substituting x = 3 gives (9 − 9)/(3 − 3) = 0/0. That indeterminate form is a signal to keep working, not an answer, because a common factor is hiding.' },
        { tex: 'x^2 - 9 = (x - 3)(x + 3)', text: 'Factor the top with the difference of squares, a² − b² = (a − b)(a + b), using a = x and b = 3. That makes the top (x − 3)(x + 3).' },
        { tex: '\\frac{(x - 3)(x + 3)}{x - 3} = x + 3', text: 'Cancel the shared factor x − 3 from top and bottom. This is allowed because a limit only looks at x near 3, never equal to 3, so x − 3 is not zero.' },
        { tex: '\\lim_{x \\to 3} (x + 3) = 3 + 3', text: 'The simplified expression x + 3 is a polynomial with no trouble at 3, so direct substitution now works: 3 + 3 = 6.' },
      ],
      answer: '6',
    },
    table: {
      head: ['x', '(x² − 9)/(x − 3)', 'x + 3'],
      rows: [['2.9', '5.9', '5.9'], ['2.99', '5.99', '5.99'], ['3', 'undefined', '6'], ['3.01', '6.01', '6.01']],
      mark: 2,
      note: 'The two columns agree everywhere except at x = 3, which is exactly the point a limit ignores.',
    },
  },
  {
    kind: 'example',
    head: 'Factor top AND bottom',
    body: 'Find the limit of (x² − 5x + 6)/(x² − 4) as x → 2. Both the top and the bottom may need factoring, so plug in first to see why.',
    steps: {
      steps: [
        { tex: '\\frac{4 - 10 + 6}{4 - 4} = \\frac{0}{0}', text: 'Substitute x = 2: the top is 4 − 10 + 6 = 0 and the bottom is 4 − 4 = 0. Getting 0/0 means both parts share the hidden factor (x − 2).' },
        { tex: 'x^2 - 5x + 6 = (x - 2)(x - 3)', text: 'Factor the top. Look for two numbers that multiply to 6 and add to −5; those are −2 and −3, so the top is (x − 2)(x − 3).' },
        { tex: 'x^2 - 4 = (x - 2)(x + 2)', text: 'Factor the bottom with the difference of squares, a² − b² = (a − b)(a + b), using a = x and b = 2, to get (x − 2)(x + 2).' },
        { tex: '\\frac{(x - 2)(x - 3)}{(x - 2)(x + 2)} = \\frac{x - 3}{x + 2}', text: 'Cancel the shared factor (x − 2). It is not zero when x is merely near 2, so cancelling is safe and leaves (x − 3)/(x + 2).' },
        { tex: '\\frac{2 - 3}{2 + 2} = \\frac{-1}{4}', text: 'Now substitute 2 into the simplified fraction. The top is 2 − 3 = −1 and the bottom is 2 + 2 = 4, so the limit is −1/4.' },
      ],
      answer: '-\\tfrac{1}{4}',
    },
  },
  {
    kind: 'example',
    head: 'Rationalize the root',
    body: 'Find the limit of (√x − 2)/(x − 4) as x → 4. A square root on top will not factor, so you need a different trick.',
    art: (() => {
      const ax = grid({ x: [0, 9], y: [0, 0.6] }, [1, 4, 9], [0.25, 0.5], { tickText: (v) => String(v) });
      const f = (x: number) => 1 / (Math.sqrt(x) + 2);
      return art(
        'The slowly falling curve 1 over (root x plus 2) with a hole at (4, 0.25)',
        ax.body +
          title('after rationalizing: y = 1/(√x + 2), with a hole') +
          ax.curve(cut(f, 4, 0.12), AMB, 2.8) +
          guides(ax, 4, 0.25) +
          hollow(ax, 4, 0.25, ROSE) +
          lab(ax, 4.3, 0.33, 'hole at (4, 0.25)', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = (√x − 2)/(x − 4)', { size: 12, fill: AMB, anchor: 'end' }),
        'The original fraction and 1/(√x + 2) are the same graph except at x = 4. The hole sits at height 1/4.',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\frac{\\sqrt{4} - 2}{4 - 4} = \\frac{0}{0}', text: 'Substituting x = 4 gives (2 − 2)/(4 − 4) = 0/0. Nothing factors because of the root, so we need another way to expose the hidden common factor.' },
        { tex: '\\frac{\\sqrt{x} - 2}{x - 4} \\cdot \\frac{\\sqrt{x} + 2}{\\sqrt{x} + 2}', text: 'Multiply top and bottom by the conjugate √x + 2. This is the same as multiplying by 1, so the value is unchanged, but it lets the root disappear.' },
        { tex: '= \\frac{x - 4}{(x - 4)(\\sqrt{x} + 2)}', text: 'On top, (√x − 2)(√x + 2) = x − 4, because (a − b)(a + b) = a² − b² and squaring a root gives back the number inside. The bottom stays a product.' },
        { tex: '= \\frac{1}{\\sqrt{x} + 2}', text: 'Cancel the (x − 4) from top and bottom, since x is near 4 but not equal to it. That leaves 1/(√x + 2).' },
        { tex: '\\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}', text: 'Substitute x = 4 into 1/(√x + 2). That gives 1/(2 + 2) = 1/4, and the bottom is no longer 0, so the limit is 1/4.' },
      ],
      answer: '\\tfrac{1}{4}',
    },
  },
  {
    kind: 'example',
    head: 'Another way: the squeeze',
    body: 'Find the limit of x² sin(1/x) as x → 0. The sine wiggles forever near 0, so neither substitution nor factoring works. Trap it between two simpler functions instead.',
    art: (() => {
      const ax = grid({ x: [-1, 1], y: [-1, 1] }, [-0.5, 0.5], [-1, 1], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The wiggling curve x squared times sine of 1 over x trapped between the parabolas y = x squared and y = minus x squared, which pinch together at the origin',
        ax.body +
          title('two fences pinch the wiggle to 0') +
          ax.curve((x) => x * x, SKY, 2, '5 4') +
          ax.curve((x) => -x * x, SKY, 2, '5 4') +
          ax.curve((x) => (x === 0 ? 0 : x * x * Math.sin(1 / x)), AMB, 2.2) +
          dot(ax.X(0), ax.Y(0), 5, ROSE) +
          lab(ax, 0.68, 0.72, 'y = x²', { fill: SKY, anchor: 'start' }) +
          lab(ax, 0.68, -0.82, 'y = −x²', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'x² sin(1/x)', { size: 12, fill: AMB, anchor: 'end' }),
        'The wiggle never escapes the two parabolas, and the parabolas both reach 0 at the origin.',
      );
    })(),
    steps: {
      steps: [
        { tex: '-1 \\le \\sin\\tfrac{1}{x} \\le 1', text: 'Sine never leaves the interval from −1 to 1, whatever goes inside it. That includes sin(1/x), which wiggles wildly near 0 but stays between those bounds.' },
        { tex: '-x^2 \\le x^2 \\sin\\tfrac{1}{x} \\le x^2', text: 'Multiply all three parts by x². Since x² is never negative, the inequalities keep their direction, giving −x² ≤ x² sin(1/x) ≤ x².' },
        { tex: '\\lim_{x \\to 0} (-x^2) = 0 = \\lim_{x \\to 0} x^2', text: 'Take the limit of each fence as x → 0. Both −x² and x² head to 0, since polynomials are continuous, so the two fences close in on the same height.' },
        { tex: '\\lim_{x \\to 0} x^2 \\sin\\tfrac{1}{x} = 0', text: 'By the squeeze theorem, a function trapped between two functions that both head to 0 must also head to 0, however much it wiggles. So the limit is 0.' },
      ],
      answer: '0',
    },
  },
  {
    kind: 'example',
    head: 'A limit at a negative number',
    body: 'Find the limit of (x² − x − 6)/(x + 2) as x → −2. Be careful with the signs when you substitute a negative number.',
    steps: {
      steps: [
        { tex: '\\frac{(-2)^2 - (-2) - 6}{-2 + 2} = \\frac{0}{0}', text: 'Substitute x = −2 with parentheses around it. Then (−2)² = 4 and −(−2) = +2, so the top is 4 + 2 − 6 = 0 and the bottom is 0, giving 0/0.' },
        { tex: 'x^2 - x - 6 = (x - 3)(x + 2)', text: 'Factor the top into two numbers that multiply to −6 and add to −1. Those are −3 and 2, so x² − x − 6 = (x − 3)(x + 2).' },
        { tex: '\\frac{(x - 3)(x + 2)}{x + 2} = x - 3', text: 'Cancel the shared factor (x + 2), which is not zero when x is only near −2, and the fraction becomes x − 3.' },
        { tex: '-2 - 3 = -5', text: 'Substitute x = −2 into x − 3, which gives −2 − 3 = −5. A polynomial has no trouble at any input, so the limit is −5.' },
      ],
      answer: '-5',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the falling ball',
    body: 'A dropped ball falls s(t) = 16t² feet in t seconds. Its average speed from t = 1 to time t is (16t² − 16)/(t − 1). What does that average speed approach as t → 1? Sketch it: the two points slide together, so the average becomes the speed at one instant.',
    art: (() => {
      const ax = grid({ x: [0, 2.5], y: [0, 80] }, [1, 2], [20, 40, 60, 80], { xLabel: 't', yLabel: 's' });
      const f = (x: number) => 16 * x * x;
      return art(
        'The parabola s = 16 t squared with a secant line from (1, 16) to (1.5, 36) of slope 40 and the tangent line at (1, 16) of slope 32',
        ax.body +
          title('secant slopes close in on the tangent slope') +
          ax.curve(f, AMB, 2.8) +
          ax.curve(tangentLine(1, 16, 40), SKY, 2, '5 4') +
          ax.curve(tangentLine(1, 16, 32), ROSE, 2.4) +
          solid(ax, 1, 16, EMR) +
          solid(ax, 1.5, 36, SKY) +
          lab(ax, 0.9, 44, 'secant slope 40', { fill: SKY, anchor: 'end' }) +
          lab(ax, 2.45, 40, 'tangent slope 32', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 's = 16t²', { size: 12, fill: AMB, anchor: 'end' }),
        'From t = 1 to 1.5 the average speed is 40 ft/s. As the second point slides to t = 1 the slopes head to 32.',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\frac{16(1)^2 - 16}{1 - 1} = \\frac{0}{0}', text: 'Substituting t = 1 gives 0/0, because the two points have merged and a slope needs two different points. That signals a hidden common factor, so factor instead.' },
        { tex: '16t^2 - 16 = 16(t^2 - 1) = 16(t - 1)(t + 1)', text: 'Pull out the common factor 16 first, then factor t² − 1 as a difference of squares. That gives 16(t − 1)(t + 1) on top.' },
        { tex: '\\frac{16(t - 1)(t + 1)}{t - 1} = 16(t + 1)', text: 'Cancel the (t − 1) from top and bottom, valid because t is near 1 but not equal to it. What is left is 16(t + 1).' },
        { tex: '16(1 + 1) = 32', text: 'Substitute t = 1 into 16(t + 1) to get 16(2) = 32. The ball is falling at 32 feet per second at the instant t = 1.' },
      ],
      answer: '32\\ \\text{ft/s}',
    },
  },
  {
    kind: 'protip',
    head: 'Always try substitution first',
    body: 'Before any algebra, plug the number in and look at what comes out. A plain number is your answer. 0/0 sends you to factoring, conjugates or the squeeze. A nonzero number over 0 means the graph blows up, and no algebra will change that.',
    compare: {
      cols: [
        { title: 'A number', tex: '\\tfrac{6}{3} = 2', lines: ['Done', 'The limit is that number'], tone: 'ok' },
        { title: '0/0', tex: '\\tfrac{0}{0}', lines: ['Keep working', 'Factor, conjugate or squeeze'], tone: 'warn' },
        { title: 'c/0, c ≠ 0', tex: '\\tfrac{5}{0}', lines: ['Infinite limit', 'Check each side\'s sign'], tone: 'bad' },
      ],
      note: 'Ten seconds of substitution tells you which of the three situations you are in.',
    },
  },
  {
    kind: 'protip',
    head: 'Cancelling changes the graph by one point',
    body: 'When you cancel (x − 3) from (x² − 9)/(x − 3), you get x + 3, a function that IS defined at 3. The two graphs match everywhere except at the single point x = 3. Since a limit never looks at that point, the two functions have the same limit there.',
    formula: {
      tex: '\\frac{x^2 - 9}{x - 3} = x + 3 \\ \\text{ for all } x \\ne 3 \\quad \\Longrightarrow \\quad \\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = \\lim_{x \\to 3} (x + 3)',
      note: 'Equal everywhere near c means equal limits at c. The point c itself is not "near c".',
      parts: [
        { sym: 'x \\ne 3', means: 'the one input where the two formulas differ', tone: 'warn' },
        { sym: '\\lim_{x \\to 3}', means: 'only cares about inputs near 3, never 3 itself', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: 0/0 is not 0',
    body: 'Students substitute, see 0/0, and write "0" or "undefined". Neither is the limit. 0/0 is a signal, not a value: the limit of (x² − 9)/(x − 3) at 3 is 6, not 0. Finish the algebra before you write an answer.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\tfrac{0}{0} = 0', lines: ['Treats 0/0 as a number', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '\\tfrac{0}{0} \\Rightarrow \\text{factor} \\Rightarrow 6', lines: ['0/0 means simplify first', 'The hole has height 6', 'Right'], tone: 'ok' },
      ],
      note: 'Every 0/0 problem in this unit has a real number hiding behind it. Go find it.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: you cannot cancel your way out of 5/0',
    body: 'Only 0/0 hides a shared factor. If substituting gives 5/0, the top is not zero at c, so (x − c) is not a factor of the top and nothing cancels. The graph has a vertical asymptote there: the limit is infinite or does not exist, and that IS the answer.',
    compare: {
      cols: [
        { title: 'Shared factor', tex: '\\frac{(x - 2)(x + 1)}{x - 2}', lines: ['Top is 0 at x = 2', 'Cancel: limit 3'], tone: 'ok' },
        { title: 'No shared factor', tex: '\\frac{x + 3}{x - 2}', lines: ['Top is 5 at x = 2', 'Nothing cancels', 'Vertical asymptote at x = 2'], tone: 'bad' },
      ],
      note: 'A factor cancels only when it appears on the top AND the bottom. Check the top at c before you start cancelling.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: a root inside a root',
    body: 'Find the limit of (√(x + 9) − 3)/x as x → 0. A root hides inside the top, so combine a conjugate with some cancelling.',
    art: (() => {
      const ax = grid({ x: [-8, 8], y: [0, 0.4] }, [-4, 4], [0.1, 0.2, 0.3], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => 1 / (Math.sqrt(x + 9) + 3);
      return art(
        'The gently falling curve 1 over (root of x plus 9, plus 3) with a hole on the y-axis at height one sixth',
        ax.body +
          title('the hole sits on the y-axis at height 1/6') +
          ax.curve(cut(f, 0, 0.2), AMB, 2.8) +
          line(ax.X(-8), ax.Y(1 / 6), ax.X(0), ax.Y(1 / 6), ROSE, 1.6, '4 4', 0.8) +
          hollow(ax, 0, 1 / 6, ROSE) +
          lab(ax, 0.6, 0.235, 'hole at (0, 1/6)', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = (√(x + 9) − 3)/x', { size: 12, fill: AMB, anchor: 'end' }),
        'Away from x = 0 the function is 1/(√(x + 9) + 3). At x = 0 that formula gives 1/6, the height of the hole.',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\frac{\\sqrt{0 + 9} - 3}{0} = \\frac{0}{0}', text: 'Substituting x = 0 gives (3 − 3)/0 = 0/0, which is indeterminate. Nothing can factor out of a square root, so we try its conjugate.' },
        { tex: '\\frac{\\sqrt{x + 9} - 3}{x} \\cdot \\frac{\\sqrt{x + 9} + 3}{\\sqrt{x + 9} + 3}', text: 'Multiply top and bottom by the conjugate √(x + 9) + 3. That is multiplying by 1, so the value does not change, but it clears the root from the top.' },
        { tex: '= \\frac{(x + 9) - 9}{x(\\sqrt{x + 9} + 3)}', text: 'On top, use (a − b)(a + b) = a² − b² with a = √(x + 9) and b = 3. That gives (x + 9) − 9, and the root is gone.' },
        { tex: '= \\frac{x}{x(\\sqrt{x + 9} + 3)} = \\frac{1}{\\sqrt{x + 9} + 3}', text: 'Simplify the top to x, then cancel it with the x on the bottom, since x is near 0 but not equal to 0. This leaves 1/(√(x + 9) + 3).' },
        { tex: '\\frac{1}{\\sqrt{9} + 3} = \\frac{1}{3 + 3} = \\frac{1}{6}', text: 'Substitute x = 0: the bottom becomes √9 + 3 = 3 + 3 = 6 and is no longer 0, so the limit is 1/6.' },
      ],
      answer: '\\tfrac{1}{6}',
    },
  },
  {
    kind: 'summary',
    head: 'Algebraic limits: substitute, then simplify',
    body: 'Plug in first. A number is the answer. 0/0 means a shared factor is hiding: factor it out, or rationalize with a conjugate, or squeeze between two fences. A nonzero number over 0 is a vertical asymptote, and the limit laws let you take limits piece by piece.',
    formula: {
      tex: '\\frac{0}{0} \\ \\Rightarrow\\ \\text{factor } \\big| \\text{ conjugate } \\big| \\text{ squeeze }\\ \\Rightarrow\\ \\text{substitute again}',
      note: 'The whole unit in one line. The algebra only ever removes the shared factor; the limit was always there.',
      parts: [
        { sym: '(x - c)', means: 'the factor shared by top and bottom when substitution gives 0/0', tone: 'accent' },
        { sym: '\\sqrt{a} + b', means: 'the conjugate that turns a root difference into a² − b²', tone: 'ok' },
        { sym: 'g \\le f \\le h', means: 'two fences with the same limit trap f', tone: 'warn' },
      ],
    },
    table: {
      head: ['Limit', 'Substitution gives', 'Tool', 'Answer'],
      rows: [['2x² − x at 3', '15', 'none needed', '15'], ['(x² − 9)/(x − 3) at 3', '0/0', 'factor', '6'], ['(√x − 2)/(x − 4) at 4', '0/0', 'conjugate', '1/4'], ['x² sin(1/x) at 0', 'no value', 'squeeze', '0']],
    },
  },
];

// ---------------- CALC-3 — Continuity and the Intermediate Value Theorem ----------------
const CALC_3: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Unbroken graphs keep promises',
    body: 'A continuous graph is one you can draw without lifting your pencil. Today you will test a function for breaks with three quick checks, name the kind of break you find, and use the unbroken ones to guarantee that an equation has a solution. If it was 50°F at 6 am and 70°F at noon, some moment read exactly 60°F.',
    art: (() => {
      const ax = grid({ x: [6, 12], y: [40, 80] }, [8, 10, 12], [50, 60, 70, 80], { xLabel: 'hour', yLabel: '°F' });
      const T = (t: number) => 60 + 10 * Math.sin(((t - 9) * Math.PI) / 6) + 3 * Math.sin(((t - 6) * Math.PI) / 3);
      return art(
        'A smooth temperature curve rising from 50 degrees at 6 am to 70 degrees at noon, crossing the dashed line at 60 degrees at 9 am',
        ax.body +
          title('a continuous reading cannot skip 60') +
          line(ax.X(6), ax.Y(60), ax.X(12), ax.Y(60), ROSE, 1.6, '5 4', 0.8) +
          ax.curve(T, AMB, 2.8) +
          solid(ax, 6, 50, SKY) +
          solid(ax, 12, 70, SKY) +
          solid(ax, 9, 60, ROSE) +
          lab(ax, 6.3, 52.5, '6 am: 50°F', { fill: SKY, anchor: 'start' }) +
          lab(ax, 11.8, 73, 'noon: 70°F', { fill: SKY, anchor: 'end' }) +
          lab(ax, 9.2, 57.5, 'exactly 60°F here', { fill: ROSE, anchor: 'start' }),
        'The curve starts below 60 and ends above it. Being unbroken, it has to cross the 60 line somewhere.',
      );
    })(),
    formula: {
      tex: 'f \\text{ continuous at } c \\iff \\lim_{x \\to c} f(x) = f(c)',
      note: 'One equation, three checks: the value exists, the limit exists, and they are the same number.',
      parts: [
        { sym: 'f(c)', means: 'check 1: the function has a value at c', tone: 'accent' },
        { sym: '\\lim_{x \\to c} f(x)', means: 'check 2: the two sides agree on a limit', tone: 'warn' },
        { sym: '=', means: 'check 3: the limit and the value are equal', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Three conditions, one pencil',
    body: 'f is continuous at c when f(c) exists, the limit as x → c exists, and the two are equal. Picture the pencil: it arrives at height f(c) from both sides and finds a point waiting there. Here x + 1 and 3x − 3 both reach height 3 at x = 2, and f(2) = 3 is the point that seals the seam.',
    why: 'Each condition guards against a different way of lifting the pencil. If f(c) is missing, there is no point to land on. If the sides disagree, the pencil has to jump. If the limit and the value differ, the pencil arrives at one height while the dot sits at another.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [0, 8] }, [1, 2, 3], [2, 4, 6, 8]);
      const L = (x: number) => x + 1;
      const R = (x: number) => 3 * x - 3;
      return art(
        'The line x + 1 for x less than 2 and the steeper line 3x minus 3 for x at least 2 joined at a filled point (2, 3)',
        ax.body +
          title('value, limit, match: continuous at 2') +
          ax.curve(leftOf(L, 2, 0.02), AMB, 2.8) +
          ax.curve(rightOf(R, 2, 0.02), SKY, 2.8) +
          guides(ax, 2, 3) +
          creep(ax, L, 0.6, 1.5, AMB) +
          creep(ax, R, 3.3, 2.6, SKY) +
          solid(ax, 2, 3, EMR) +
          lab(ax, 2.2, 2.2, 'f(2) = 3', { fill: EMR, anchor: 'start' }) +
          text(W - 24, 40, 'left piece: x + 1', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'right piece: 3x − 3', { size: 12, fill: SKY, anchor: 'end' }),
        'Left limit 3, right limit 3, value 3. The pencil never lifts.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to 2^-} f(x) = 3, \\quad \\lim_{x \\to 2^+} f(x) = 3, \\quad f(2) = 3',
      note: 'Three numbers, all equal. If any one is missing or different, the graph breaks at 2.',
      parts: [
        { sym: '2 + 1 = 3', means: 'the left piece arriving at the seam', tone: 'warn' },
        { sym: '3(2) - 3 = 3', means: 'the right piece arriving at the seam', tone: 'accent' },
        { sym: 'f(2) = 3', means: 'the point itself, from the piece that includes x = 2', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Three ways to break',
    body: 'A HOLE is a removable break: the limit exists, but f(c) is missing or sits somewhere else. A JUMP is when the one-sided limits disagree. An INFINITE break is a vertical asymptote, where the heights blow up. Each one fails a different check.',
    why: 'The three breaks differ in what goes wrong near c. In a hole the neighbors agree but the point is missing, so a single dot would repair it. In a jump the sides disagree, so no single dot could fix both. In an asymptote the heights grow without bound, so there is nothing to plug in.',
    art: (() => {
      let b = title('three ways a graph breaks');
      const panel = (i: number) => 22 + i * 124;
      const top = 62, bot = 186;
      for (let i = 0; i < 3; i++) {
        const x0 = panel(i);
        b += line(x0, bot, x0 + 112, bot, INK, 1.4, undefined, 0.5) + line(x0 + 10, top, x0 + 10, bot, INK, 1.4, undefined, 0.5);
      }
      // hole
      let x0 = panel(0);
      const hy = (bot - 20 + top + 20) / 2;
      b += line(x0 + 14, bot - 20, x0 + 55, hy + 5, AMB, 2.6);
      b += line(x0 + 67, hy - 5, x0 + 108, top + 20, AMB, 2.6);
      b += circle(x0 + 61, hy, 5, AMB, 'none', 2.6);
      b += text(x0 + 56, 214, 'hole', { size: 13, fill: AMB });
      b += text(x0 + 56, 234, 'limit exists', { size: 11, op: 0.7 });
      // jump
      x0 = panel(1);
      b += line(x0 + 14, bot - 18, x0 + 58, bot - 44, SKY, 2.6);
      b += dot(x0 + 60, bot - 45, 5, SKY);
      b += line(x0 + 62, top + 36, x0 + 108, top + 14, SKY, 2.6);
      b += circle(x0 + 60, top + 37, 5, SKY, 'none', 2.6);
      b += text(x0 + 56, 214, 'jump', { size: 13, fill: SKY });
      b += text(x0 + 56, 234, 'sides disagree', { size: 11, op: 0.7 });
      // infinite
      x0 = panel(2);
      const m = x0 + 60;
      b += line(m, top, m, bot, ROSE, 1.8, '5 4');
      b += `<path d="M ${x0 + 14} ${bot - 16} Q ${m - 14} ${bot - 20} ${m - 5} ${top}" fill="none" stroke="${ROSE}" stroke-width="2.6"/>`;
      b += `<path d="M ${m + 5} ${bot} Q ${m + 14} ${top + 20} ${x0 + 108} ${top + 16}" fill="none" stroke="${ROSE}" stroke-width="2.6"/>`;
      b += text(x0 + 56, 214, 'infinite', { size: 13, fill: ROSE });
      b += text(x0 + 56, 234, 'blows up', { size: 11, op: 0.7 });
      return art('Three small graphs side by side: a line with a hole, two pieces that jump, and two branches shooting off along a dashed vertical asymptote', b, 'Hole: the limit exists but the point is missing. Jump: the sides disagree. Infinite: no finite limit at all.');
    })(),
    compare: {
      cols: [
        { title: 'Hole (removable)', tex: '\\lim \\text{ exists}', lines: ['f(c) missing or misplaced', 'Fails check 1 or 3', 'Fixable by redefining f(c)'], tone: 'ok' },
        { title: 'Jump', tex: '\\lim_{c^-} \\ne \\lim_{c^+}', lines: ['Sides disagree', 'Fails check 2', 'Cannot be fixed'], tone: 'warn' },
        { title: 'Infinite', tex: '\\lim = \\pm\\infty', lines: ['Vertical asymptote', 'Fails check 2', 'Cannot be fixed'], tone: 'bad' },
      ],
      note: 'Only a hole can be repaired, because only a hole has a limit to fill it with.',
    },
  },
  {
    kind: 'concept',
    head: 'Which functions are continuous?',
    body: 'Polynomials, eˣ, sin x and cos x are continuous everywhere: no inputs are off limits. Rational functions, ln x, √x and tan x are continuous wherever they are defined, so their only breaks are at inputs that are not allowed. The polynomial x³ − x never breaks; 1/x breaks at x = 0 because 1/0 is not allowed.',
    why: 'Continuity can only fail where an operation is not allowed: dividing by zero, a square root of a negative, or ln of zero or less. A polynomial only adds and multiplies, which are always allowed. A rational function also divides, so it breaks only where the bottom is zero.',
    art: (() => {
      const ax = grid({ x: [-3, 3], y: [-4, 4] }, [-2, -1, 1, 2], [-2, 2], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The smooth cubic y = x cubed minus x drawn across the whole grid next to y = 1 over x, which breaks into two branches at the dashed vertical asymptote x = 0',
        ax.body +
          title('smooth everywhere vs. broken at x = 0') +
          line(ax.X(0), ax.Y(-4), ax.X(0), ax.Y(4), ROSE, 1.8, '5 4', 0.7) +
          ax.curve((x) => x * x * x - x, EMR, 2.8) +
          ax.curve((x) => (Math.abs(x) < 0.2 ? NaN : 1 / x), AMB, 2.4) +
          text(W - 24, 40, 'y = x³ − x', { size: 12, fill: EMR, anchor: 'end' }) +
          text(W - 24, 57, 'y = 1/x', { size: 12, fill: AMB, anchor: 'end' }),
        'The cubic is one unbroken stroke. The reciprocal is two strokes, because 1/0 is not a number.',
      );
    })(),
    formula: {
      tex: '\\text{continuous on its domain:}\\quad \\frac{p(x)}{q(x)},\\ \\ln x,\\ \\sqrt{x},\\ \\tan x',
      note: 'To find the breaks of one of these, find the inputs it refuses: q(x) = 0, x ≤ 0 for ln, x < 0 for the root, cos x = 0 for tan.',
      parts: [
        { sym: 'x^n,\\ e^x,\\ \\sin x,\\ \\cos x', means: 'continuous for every real x: never a break', tone: 'ok' },
        { sym: 'q(x) = 0', means: 'where a rational function breaks: a hole or an asymptote', tone: 'warn' },
        { sym: 'x \\le 0', means: 'where ln x is not even defined', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Piecewise seams: solve for k',
    body: 'A two-piece function can only break at the seam, so check there: left limit, right limit and value must all match. When a piece has an unknown constant k, set the two sides equal and solve. For kx + 1 on the left and x² on the right of x = 3, k = 8/3 makes both pieces reach height 9.',
    why: 'Inside each piece the formula is already continuous, so the only danger is the seam, where one formula hands off to the other. The left piece must arrive at the exact height where the right piece starts, and setting them equal forces that. Check: with k = 8/3, (8/3)(3) + 1 = 9, which equals 3² = 9.',
    art: (() => {
      const ax = grid({ x: [0, 5], y: [0, 16] }, [1, 2, 3, 4], [4, 8, 12, 16]);
      const L = (x: number) => (8 / 3) * x + 1;
      const R = (x: number) => x * x;
      return art(
        'The line (8/3)x + 1 for x less than 3 and the parabola x squared for x at least 3 meeting at a filled point (3, 9)',
        ax.body +
          title('k = 8/3 seals the seam at (3, 9)') +
          ax.curve(leftOf(L, 3, 0.02), AMB, 2.8) +
          ax.curve(rightOf(R, 3, 0.02), SKY, 2.8) +
          guides(ax, 3, 9) +
          solid(ax, 3, 9, EMR) +
          lab(ax, 2.85, 10.6, 'sealed at (3, 9)', { fill: EMR, anchor: 'end' }) +
          text(W - 24, 40, 'left: (8/3)x + 1', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'right: x²', { size: 12, fill: SKY, anchor: 'end' }),
        'With k = 8/3 the line climbs to exactly 9 at x = 3, which is where the parabola starts.',
      );
    })(),
    formula: {
      tex: '\\underbrace{3k + 1}_{\\text{left limit}} = \\underbrace{3^2}_{\\text{right limit and } f(3)} \\quad \\Rightarrow \\quad k = \\tfrac{8}{3}',
      note: 'Plug the seam x-value into both pieces and set them equal. One equation, one unknown.',
      parts: [
        { sym: '3k + 1', means: 'the left piece evaluated at the seam', tone: 'warn' },
        { sym: '3^2 = 9', means: 'the right piece at the seam, which also gives f(3)', tone: 'accent' },
        { sym: 'k = \\tfrac{8}{3}', means: 'the one value that makes the heights match', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The Intermediate Value Theorem',
    body: 'If f is continuous on [a, b], it takes EVERY value between f(a) and f(b). The pencil cannot get from one height to the other without passing through everything in between. In particular, if f(a) and f(b) have opposite signs, the graph must cross zero: there is a root in (a, b).',
    why: 'A path drawn without lifting the pencil from height f(a) to height f(b) must cross every height in between, just as a hiker climbing from 100 ft to 300 ft must pass 200 ft. If one end is below zero and the other above, zero is in between, so a continuous graph must cross the axis.',
    art: (() => {
      const ax = grid({ x: [0, 2.5], y: [-2, 6] }, [1, 2], [-1, 1, 3, 5], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => x * x * x - x - 1;
      return art(
        'The curve y = x cubed minus x minus 1 passing through (1, minus 1) below the axis and (2, 5) above it, crossing zero between them',
        ax.body +
          title('negative at 1, positive at 2: a root between') +
          ax.curve(f, AMB, 2.8) +
          solid(ax, 1, -1, SKY) +
          solid(ax, 2, 5, SKY) +
          dot(ax.X(1.3247), ax.Y(0), 5.5, ROSE) +
          lab(ax, 0.95, -1.5, 'f(1) = −1', { fill: SKY, anchor: 'end' }) +
          lab(ax, 1.95, 5.3, 'f(2) = 5', { fill: SKY, anchor: 'end' }) +
          lab(ax, 1.45, 0.7, 'root here', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = x³ − x − 1', { size: 12, fill: AMB, anchor: 'end' }),
        'To climb from −1 to 5 without lifting the pencil, the curve has to cross height 0.',
      );
    })(),
    formula: {
      tex: 'f \\text{ continuous on } [a, b],\\ f(a) < N < f(b) \\ \\Rightarrow\\ f(c) = N \\text{ for some } c \\in (a, b)',
      note: 'The IVT says a solution exists and where to look for it. It does not say what the solution is.',
      parts: [
        { sym: '[a, b]', means: 'a closed interval where the graph is unbroken', tone: 'accent' },
        { sym: 'N', means: 'any target height between the two endpoint heights', tone: 'warn' },
        { sym: 'c', means: 'the input where the graph hits that height: it exists, somewhere inside', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: is there a hole?',
    body: 'Is f(x) = (x² − 4)/(x − 2) continuous at x = 2? Run the three checks in order: does the value exist, does the limit exist, and are they equal?',
    steps: {
      steps: [
        { tex: 'f(2) = \\frac{4 - 4}{2 - 2} = \\frac{0}{0}', text: 'Check 1 is whether f(2) exists. The bottom is 2 − 2 = 0, so f(2) is 0/0 and undefined. Continuity needs a value, so f already fails here.' },
        { tex: '\\frac{(x - 2)(x + 2)}{x - 2} = x + 2', text: 'Still find the limit, because it names the kind of break. Factor the top as (x − 2)(x + 2) and cancel (x − 2), valid for x ≠ 2, which leaves x + 2.' },
        { tex: '\\lim_{x \\to 2} f(x) = 2 + 2 = 4', text: 'Check 2 is whether the limit exists. Substituting 2 into x + 2 gives 4, so the limit is 4. It exists, so check 2 passes.' },
        { tex: '\\text{limit } 4,\\ f(2)\\ \\text{missing}', text: 'A limit that exists at a point with no value is a hole, which is a removable discontinuity. Defining f(2) = 4 would repair it.' },
      ],
      answer: '\\text{no: a hole at } x = 2',
    },
  },
  {
    kind: 'example',
    head: 'Check a seam',
    body: 'f(x) = x + 1 for x < 2 and f(x) = 3x − 3 for x ≥ 2. Is f continuous at x = 2? The formula changes at 2, so check the seam with all three conditions.',
    table: {
      head: ['Check', 'Compute', 'Result'],
      rows: [['left limit', '2 + 1', '3'], ['right limit', '3(2) − 3', '3'], ['value f(2)', 'piece with ≥: 3(2) − 3', '3']],
      note: 'Three matching 3s. Any mismatch would have meant a break.',
    },
    steps: {
      steps: [
        { tex: '\\lim_{x \\to 2^-} (x + 1) = 3', text: 'Close to 2 on the left the rule is x + 1, a polynomial, so substituting gives the left-hand limit 2 + 1 = 3.' },
        { tex: '\\lim_{x \\to 2^+} (3x - 3) = 3', text: 'Close to 2 on the right the rule is 3x − 3, so the right-hand limit is 3(2) − 3 = 3. It matches the left, so the two-sided limit exists and is 3.' },
        { tex: 'f(2) = 3(2) - 3 = 3', text: 'The value f(2) comes from the piece that includes x = 2. The ≥ sign puts it in the second piece, so f(2) = 3(2) − 3 = 3.' },
        { tex: '3 = 3 = 3', text: 'All three checks pass: the value exists, the limit exists, and 3 = 3 = 3. Limit equals value is exactly the definition of continuous at 2.' },
      ],
      answer: '\\text{yes, continuous at } 2',
    },
  },
  {
    kind: 'example',
    head: 'Solve for k',
    body: 'f(x) = kx + 1 for x < 3 and f(x) = x² for x ≥ 3. Find k so that f is continuous. A graph can only break at the seam, so make the two heights match there.',
    steps: {
      steps: [
        { tex: '\\lim_{x \\to 3^-} (kx + 1) = 3k + 1', text: 'Find the left-hand limit by putting x = 3 into the left piece kx + 1. That gives 3k + 1, an expression with k still in it.' },
        { tex: '\\lim_{x \\to 3^+} x^2 = 9 = f(3)', text: 'Find the right-hand limit with the right piece x², which gives 3² = 9. The ≥ sign includes 3 in this piece, so 9 is also the value f(3).' },
        { tex: '3k + 1 = 9', text: 'For f to be continuous, the left-hand limit must equal the value so the pieces meet with no gap. Set 3k + 1 equal to 9.' },
        { tex: '3k = 8', text: 'Solve for k. First subtract 1 from both sides to undo the + 1, which leaves 3k = 8.' },
        { tex: 'k = \\tfrac{8}{3}', text: 'Divide both sides by 3 to undo the multiplication, giving k = 8/3. Check: (8/3)(3) + 1 = 9, which matches x² = 9.' },
      ],
      answer: 'k = \\tfrac{8}{3}',
    },
  },
  {
    kind: 'example',
    head: 'Hole or asymptote?',
    body: 'Classify every discontinuity of g(x) = (x − 1)/(x² − 1). A rational function can only break where the bottom is zero, so start there.',
    art: (() => {
      const ax = grid({ x: [-4, 4], y: [-3, 3] }, [-2, 1, 2], [-2, -1, 1, 2], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => 1 / (x + 1);
      return art(
        'The graph of 1 over (x plus 1) with a dashed vertical asymptote at x = minus 1 and a hollow point at (1, one half)',
        ax.body +
          title('one zero cancels, one does not') +
          line(ax.X(-1), ax.Y(-3), ax.X(-1), ax.Y(3), ROSE, 2, '6 5') +
          ax.curve(cut(f, 1, 0.1), AMB, 2.8) +
          hollow(ax, 1, 0.5, EMR) +
          lab(ax, 1.2, 1.1, 'hole at (1, 1/2)', { fill: EMR, anchor: 'start' }) +
          lab(ax, -1.2, 2.5, 'x = −1', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'y = (x − 1)/(x² − 1)', { size: 12, fill: AMB, anchor: 'end' }),
        'The cancelled factor leaves a hole at x = 1. The factor that stays makes an asymptote at x = −1.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'x^2 - 1 = (x - 1)(x + 1)', text: 'Factor the bottom with the difference of squares: x² − 1 = (x − 1)(x + 1). That shows the bottom is zero at x = 1 and at x = −1.' },
        { tex: '\\frac{x - 1}{(x - 1)(x + 1)} = \\frac{1}{x + 1},\\ x \\ne 1', text: 'The factor x − 1 appears on both top and bottom, so it cancels for x ≠ 1. A cancelled factor means a hole at x = 1, not an asymptote.' },
        { tex: '\\lim_{x \\to 1} g(x) = \\frac{1}{1 + 1} = \\frac{1}{2}', text: 'The simplified function 1/(x + 1) gives 1/(1 + 1) = 1/2 at x = 1, so the limit exists. The hole sits at height 1/2, which is why it is removable.' },
        { tex: 'x = -1:\\ \\frac{1}{0}', text: 'The factor x + 1 stays on the bottom and nothing cancels it. At x = −1 the top is −2, not 0, over a bottom heading to 0, so the heights blow up: a vertical asymptote.' },
      ],
      answer: '\\text{hole at } x = 1,\\ \\text{asymptote at } x = -1',
    },
  },
  {
    kind: 'example',
    head: 'Another way: fill the hole',
    body: 'g(x) = (x² − 16)/(x − 4) has a hole at x = 4. What value should g(4) be given to fill it? Skip the three checks: the hole sits exactly at the limit\'s height.',
    steps: {
      steps: [
        { tex: '\\frac{x^2 - 16}{x - 4} = \\frac{(x - 4)(x + 4)}{x - 4} = x + 4', text: 'Factor the top as a difference of squares, (x − 4)(x + 4), and cancel the (x − 4). This is allowed for x ≠ 4, and it leaves x + 4.' },
        { tex: '\\lim_{x \\to 4} g(x) = 4 + 4 = 8', text: 'Find the limit at the hole. Substituting 4 into x + 4 gives 8. The hole sits at height 8, because the heights nearby are heading there.' },
        { tex: 'g(4) := 8', text: 'Define g(4) to be 8. The := means we are choosing that value on purpose, to plug the hole at exactly the height the neighbors aim for.' },
        { tex: '\\lim_{x \\to 4} g(x) = g(4) = 8', text: 'Now the limit, 8, equals the value g(4) = 8, so all three checks pass and the repaired function is continuous at x = 4.' },
      ],
      answer: 'g(4) = 8',
    },
  },
  {
    kind: 'example',
    head: 'IVT guarantees a root',
    body: 'Show that f(x) = x³ − x − 1 has a root between x = 1 and x = 2. You cannot solve this cubic by hand, so use the IVT to prove one exists.',
    table: {
      head: ['x', 'x³ − x − 1', 'sign'],
      rows: [['1', '1 − 1 − 1 = −1', '−'], ['1.5', '3.375 − 1.5 − 1 = 0.875', '+'], ['2', '8 − 2 − 1 = 5', '+']],
      mark: 1,
      note: 'The sign already flips between 1 and 1.5, so the root is in (1, 1.5). Halving the interval again would pin it further.',
    },
    steps: {
      steps: [
        { tex: 'f(1) = 1^3 - 1 - 1 = -1 < 0', text: 'Evaluate the left end: f(1) = 1 − 1 − 1 = −1. This is below zero, so the graph starts under the x-axis.' },
        { tex: 'f(2) = 2^3 - 2 - 1 = 5 > 0', text: 'Evaluate the right end: f(2) = 8 − 2 − 1 = 5. This is above zero, so the graph ends above the x-axis.' },
        { tex: 'x^3 - x - 1\\ \\text{is a polynomial}', text: 'The IVT only works for continuous functions. A polynomial has no breaks, so f is continuous on [1, 2] and the theorem applies.' },
        { tex: '-1 < 0 < 5 \\ \\Rightarrow\\ f(c) = 0', text: 'Since 0 sits between f(1) = −1 and f(2) = 5, the IVT says f takes the value 0 somewhere in (1, 2). That is a root, even though we did not find it.' },
      ],
      answer: '\\text{a root exists in } (1, 2)',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the thermometer',
    body: 'At 6 am it was 50°F; at noon it was 70°F. Must there have been a moment when it was exactly 60°F? Sketch the temperature curve and ask whether it could skip a value.',
    steps: {
      steps: [
        { tex: 'T(6) = 50,\\quad T(12) = 70', text: 'Write down what you know: T(6) = 50 and T(12) = 70. These are the two ends of the curve you sketch.' },
        { tex: 'T\\ \\text{is continuous}', text: 'Temperature cannot teleport; it changes smoothly, so T is continuous. That is the condition the IVT needs, and the physical situation gives it to us.' },
        { tex: '50 < 60 < 70', text: 'Check whether the target lies between the endpoint values: 50 < 60 < 70, so 60 is a height the curve has to pass.' },
        { tex: 'T(c) = 60\\ \\text{for some } c \\in (6, 12)', text: 'The IVT then guarantees some time c between 6 am and noon with T(c) = 60. It proves the moment exists without saying exactly when.' },
      ],
      answer: '\\text{yes, by the IVT}',
    },
  },
  {
    kind: 'protip',
    head: 'Three checks, in order',
    body: 'Run the checks in the order that fails fastest. Is f(c) defined? If not, stop: not continuous. Does the limit exist? Compute both sides. Are they equal? Only if all three pass is the function continuous at c. Naming which check failed names the kind of break.',
    art: flow(
      [
        { label: 'Is f(c) defined?', color: SKY },
        { label: 'Does the limit exist?', color: AMB },
        { label: 'Are they equal?', color: VIO },
        { label: 'Continuous at c', color: EMR },
      ],
      { title: 'the continuity checklist', caption: 'Fail at the first box: hole or no value. Fail at the second: jump or asymptote. Fail at the third: a misplaced dot.' },
    ),
    compare: {
      cols: [
        { title: 'Fails check 1', lines: ['f(c) undefined', 'Usually a hole'], tone: 'warn' },
        { title: 'Fails check 2', lines: ['No limit', 'Jump or asymptote'], tone: 'bad' },
        { title: 'Fails check 3', lines: ['Limit ≠ value', 'A dot in the wrong place'], tone: 'accent' },
      ],
    },
  },
  {
    kind: 'protip',
    head: 'Count the breaks of a rational function',
    body: 'For a rational function, every discontinuity is a zero of the bottom. For f(x) = (x + 3)/((x − 2)(x + 5)) nothing cancels, so each bottom zero is a vertical asymptote. Two zeros, two breaks. If a factor had cancelled, that break would have been a hole instead, but it still counts as a discontinuity.',
    steps: {
      steps: [
        { tex: '(x - 2)(x + 5) = 0', text: 'Every break of a rational function is where the bottom is zero, so set the bottom equal to 0. A product is zero when either factor is.' },
        { tex: 'x = 2\\ \\text{or}\\ x = -5', text: 'Solve each factor: x − 2 = 0 gives x = 2, and x + 5 = 0 gives x = −5. Those are the only two places the function can break.' },
        { tex: 'x + 3 \\ne 0\\ \\text{at either}', text: 'Check the top at each candidate. It is 2 + 3 = 5 at x = 2 and −5 + 3 = −2 at x = −5. Neither is 0, so nothing cancels.' },
        { tex: '\\text{two vertical asymptotes}', text: 'A nonzero top over a bottom heading to 0 blows up, so both candidates are vertical asymptotes, which are infinite discontinuities.' },
      ],
      answer: '2\\ \\text{discontinuities}',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: a limit does not mean continuity',
    body: 'Students compute a limit, get a number, and conclude the function is continuous there. A limit is only one of the three checks. (x² − 4)/(x − 2) has limit 4 at x = 2 and is NOT continuous there, because f(2) does not exist. That is exactly what a hole is.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\lim_{x \\to 2} f(x) = 4\\ \\Rightarrow\\ \\text{continuous}', lines: ['Checks only the limit', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '\\lim = 4\\ \\text{but}\\ f(2)\\ \\text{undefined}', lines: ['Check 1 fails', 'A hole: not continuous', 'Right'], tone: 'ok' },
      ],
      note: 'Every hole in this course has a limit. Having a limit is the easy part.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: the IVT needs continuity',
    body: 'f(x) = 1/x has f(−1) = −1 and f(1) = 1, so it goes from negative to positive on [−1, 1]. Yet it never equals 0. The IVT does not apply, because 1/x is not continuous at x = 0: it jumps over zero by way of the asymptote. Always state continuity before you use the theorem.',
    art: (() => {
      const ax = grid({ x: [-1.5, 1.5], y: [-4, 4] }, [-1, 1], [-2, 2], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The two branches of y = 1 over x with the points (minus 1, minus 1) and (1, 1) marked and a dashed asymptote on the y-axis between them',
        ax.body +
          title('from −1 to 1 without ever being 0') +
          line(ax.X(0), ax.Y(-4), ax.X(0), ax.Y(4), ROSE, 1.8, '5 4', 0.7) +
          ax.curve((x) => (Math.abs(x) < 0.22 ? NaN : 1 / x), AMB, 2.6) +
          solid(ax, -1, -1, SKY) +
          solid(ax, 1, 1, SKY) +
          lab(ax, -1.05, -1.6, 'f(−1) = −1', { fill: SKY, anchor: 'end' }) +
          lab(ax, 1.05, 1.6, 'f(1) = 1', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = 1/x', { size: 12, fill: AMB, anchor: 'end' }),
        'The sign changes, but the graph escapes to infinity instead of crossing the axis. No continuity, no guarantee.',
      );
    })(),
    compare: {
      cols: [
        { title: 'Looks like', tex: 'f(-1) < 0 < f(1)\\ \\Rightarrow\\ \\text{root}', lines: ['Skips the continuity check', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '\\tfrac{1}{x} \\ne 0\\ \\text{ever}', lines: ['Not continuous on [−1, 1]', 'IVT does not apply', 'Right'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: seal the seam, then use it',
    body: 'f(x) = 2x + k for x < 1 and f(x) = x² + 4 for x ≥ 1. Find k so f is continuous, then show f takes the value 7 somewhere on [0, 2]. Fix the seam first, because the IVT needs continuity.',
    art: (() => {
      const ax = grid({ x: [-1, 3], y: [0, 14] }, [-1, 1, 2, 3], [5, 10], { tickText: (v) => String(v).replace('-', '−') });
      const L = (x: number) => 2 * x + 3;
      const R = (x: number) => x * x + 4;
      return art(
        'The line 2x + 3 for x less than 1 joined to the parabola x squared plus 4 for x at least 1 at the filled point (1, 5), with the height 7 marked by a dashed line',
        ax.body +
          title('k = 3 makes the pieces meet at (1, 5)') +
          line(ax.X(-1), ax.Y(7), ax.X(3), ax.Y(7), ROSE, 1.6, '5 4', 0.8) +
          ax.curve(leftOf(L, 1, 0.02), AMB, 2.8) +
          ax.curve(rightOf(R, 1, 0.02), SKY, 2.8) +
          solid(ax, 1, 5, EMR) +
          dot(ax.X(Math.sqrt(3)), ax.Y(7), 5.5, ROSE) +
          lab(ax, 1.2, 4.0, 'sealed at (1, 5)', { fill: EMR, anchor: 'start' }) +
          lab(ax, -0.9, 7.9, 'height 7', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'left: 2x + 3', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'right: x² + 4', { size: 12, fill: SKY, anchor: 'end' }),
        'Once the seam is sealed the graph is unbroken from (0, 3) to (2, 8), so it must cross height 7 on the way.',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\lim_{x \\to 1^-} (2x + k) = 2 + k', text: 'Find the left-hand limit at the seam by putting x = 1 into the left piece 2x + k, which gives 2 + k.' },
        { tex: '\\lim_{x \\to 1^+} (x^2 + 4) = 5 = f(1)', text: 'Put x = 1 into the right piece x² + 4 to get 1 + 4 = 5. Since ≥ includes 1 in this piece, 5 is also the value f(1).' },
        { tex: '2 + k = 5 \\ \\Rightarrow\\ k = 3', text: 'For continuity the left limit must equal 5, so set 2 + k = 5. Subtract 2 from both sides to get k = 3.' },
        { tex: 'f(0) = 2(0) + 3 = 3,\\quad f(2) = 2^2 + 4 = 8', text: 'Now evaluate the endpoints of [0, 2]: f(0) = 2(0) + 3 = 3 on the left piece, and f(2) = 2² + 4 = 8 on the right piece.' },
        { tex: '3 < 7 < 8,\\ f\\ \\text{continuous} \\ \\Rightarrow\\ f(c) = 7', text: 'f is now continuous on [0, 2], and 7 lies between f(0) = 3 and f(2) = 8. The IVT guarantees some c in (0, 2) with f(c) = 7. (It is c = √3, since c² + 4 = 7.)' },
      ],
      answer: 'k = 3;\\ f(c) = 7 \\text{ for some } c \\in (0, 2)',
    },
  },
  {
    kind: 'summary',
    head: 'Continuity, in three checks',
    body: 'f is continuous at c when f(c) exists, the limit exists, and they are equal. A hole fails the value check and can be repaired; a jump or an asymptote fails the limit check and cannot. Piecewise seams are solved by matching heights. And a continuous function on [a, b] hits every value between f(a) and f(b): that is the IVT.',
    formula: {
      tex: '\\lim_{x \\to c} f(x) = f(c) \\qquad\\qquad f(a) < N < f(b) \\ \\Rightarrow\\ \\exists\\, c:\\ f(c) = N',
      note: 'Left: the definition of continuous at a point. Right: what continuity on an interval buys you.',
      parts: [
        { sym: 'f(c)', means: 'must exist, and must equal the limit', tone: 'accent' },
        { sym: '\\lim_{x \\to c}', means: 'both one-sided limits, agreeing', tone: 'warn' },
        { sym: 'N', means: 'any value between the endpoint values is reached', tone: 'ok' },
      ],
    },
    table: {
      head: ['Function', 'At', 'Break?', 'Kind'],
      rows: [['(x² − 4)/(x − 2)', 'x = 2', 'yes', 'hole, limit 4'], ['x + 1 then 3x − 3', 'x = 2', 'no', 'continuous'], ['(x − 1)/(x² − 1)', 'x = −1', 'yes', 'vertical asymptote'], ['1/x', 'x = 0', 'yes', 'infinite: IVT fails']],
    },
  },
];

// ---------------- CALC-4 — Limits at infinity, asymptotes and infinite limits ----------------
const CALC_4: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'The far ends and the blow-ups',
    body: 'Zoom out and most graphs settle down: far to the right and far to the left they flatten onto a horizontal line. Zoom in near a forbidden input and some graphs explode upward or downward. Today you will read both behaviors from a formula: horizontal asymptotes from limits at infinity, vertical asymptotes from infinite limits.',
    art: (() => {
      const ax = grid({ x: [-6, 6], y: [-6, 10] }, [-4, -2, 2, 4], [-4, 3, 6, 9], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => (3 * x * x + 5) / (x * x - 1);
      return art(
        'The graph of (3x squared plus 5) over (x squared minus 1): it flattens onto the dashed line y = 3 far left and far right, and shoots off at dashed vertical asymptotes x = 1 and x = minus 1',
        ax.body +
          title('far out the heights flatten onto y = 3') +
          line(ax.X(-6), ax.Y(3), ax.X(6), ax.Y(3), ROSE, 2, '6 5') +
          line(ax.X(1), ax.Y(-6), ax.X(1), ax.Y(10), ROSE, 1.6, '5 4', 0.7) +
          line(ax.X(-1), ax.Y(-6), ax.X(-1), ax.Y(10), ROSE, 1.6, '5 4', 0.7) +
          ax.curve((x) => (Math.abs(Math.abs(x) - 1) < 0.1 ? NaN : f(x)), AMB, 2.6) +
          lab(ax, 5.8, 3.8, 'y = 3', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 57, 'y = (3x² + 5)/(x² − 1)', { size: 12, fill: AMB, anchor: 'end' }),
        'Two vertical asymptotes near the middle, one horizontal asymptote at y = 3 out at the ends.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to \\infty} f(x) = L \\quad\\Longleftrightarrow\\quad y = L \\text{ is a horizontal asymptote}',
      note: 'A limit at infinity is a question about the far right of the graph. The answer is the height it flattens onto.',
      parts: [
        { sym: 'x \\to \\infty', means: 'x grows without bound: 100, 1000, a million…', tone: 'accent' },
        { sym: 'L', means: 'the height the graph settles toward out there', tone: 'ok' },
        { sym: 'x \\to -\\infty', means: 'the same question for the far left; the answer can differ', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Small pieces melt away',
    body: 'As x → ∞, 1/x → 0, 1/x² → 0 and 1/√x → 0: a fixed top over a growing bottom shrinks to nothing. Both of these graphs flatten onto the x-axis, y = 0. Every limit at infinity in this unit comes down to spotting which pieces melt away like this.',
    why: 'Take 1/x. At x = 10 it is 0.1, at x = 1000 it is 0.001, and at x = 1,000,000 it is 0.000001. The top stays fixed while the bottom grows, so each share shrinks. A fixed number cut into ever more shares gets as small as you like.',
    art: (() => {
      const ax = grid({ x: [0, 8], y: [0, 3] }, [2, 4, 6, 8], [1, 2, 3]);
      return art(
        'The curves y = 1 over x and y = 1 over x squared both falling toward the x-axis as x grows, with an arrow sliding along toward height 0',
        ax.body +
          title('both flatten onto y = 0, the x-axis') +
          ax.curve((x) => (x < 0.25 ? NaN : 1 / x), AMB, 2.8) +
          ax.curve((x) => (x < 0.5 ? NaN : 1 / (x * x)), SKY, 2.6) +
          creep(ax, (x) => 1 / x, 5, 7.4, AMB) +
          lab(ax, 4.0, 0.55, '1/x → 0', { fill: AMB, anchor: 'start' }) +
          lab(ax, 2.6, 1.3, '1/x² → 0 faster', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = 1/x', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'y = 1/x²', { size: 12, fill: SKY, anchor: 'end' }),
        'At x = 100, 1/x is 0.01 and 1/x² is 0.0001. Far enough out, both are as good as zero.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to \\infty} \\frac{1}{x} = 0, \\qquad \\lim_{x \\to \\infty} \\frac{1}{x^2} = 0, \\qquad \\lim_{x \\to \\infty} \\frac{c}{x^n} = 0',
      note: 'Any constant divided by any positive power of x heads to 0. This is the only limit fact the rest of the unit needs.',
      parts: [
        { sym: 'c', means: 'any fixed number on top, even a huge one', tone: 'accent' },
        { sym: 'x^n,\\ n > 0', means: 'any growing power on the bottom', tone: 'warn' },
        { sym: '0', means: 'where every such piece ends up', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Divide by the highest power',
    body: 'To find the limit of a fraction as x → ∞, divide every term on top and bottom by the highest power of x in the bottom. The big terms become constants and the small terms become c/xⁿ pieces that melt to 0. For (3x² + 5)/(x² − 1) that leaves (3 + 0)/(1 − 0) = 3.',
    why: 'Dividing top and bottom by the same nonzero number never changes a fraction: 6/2 divided through by 2 is 3/1. Choosing the highest power of x turns each leading term into a plain number and every smaller term into a c/xⁿ piece that melts to 0, so only the leading coefficients remain.',
    art: (() => {
      const ax = grid({ x: [0, 22], y: [2, 4] }, [5, 10, 15, 20], [3, 4]);
      const f = (x: number) => (3 * x * x + 5) / (x * x - 1);
      return art(
        'The right-hand tail of (3x squared plus 5) over (x squared minus 1), with points at x = 5, 10 and 20 getting closer to the dashed line y = 3',
        ax.body +
          title('the 5/x² and 1/x² pieces melt away') +
          line(ax.X(0), ax.Y(3), ax.X(22), ax.Y(3), ROSE, 2, '6 5') +
          ax.curve((x) => (x < 1.4 ? NaN : f(x)), AMB, 2.8) +
          solid(ax, 5, f(5), SKY) +
          solid(ax, 10, f(10), SKY) +
          solid(ax, 20, f(20), SKY) +
          lab(ax, 5.4, 3.5, '(5, 3.33)', { fill: SKY, anchor: 'start' }) +
          lab(ax, 10, 3.3, '(10, 3.08)', { fill: SKY }) +
          lab(ax, 19.6, 3.25, '(20, 3.02)', { fill: SKY, anchor: 'end' }) +
          lab(ax, 21.6, 2.8, 'y = 3', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'y = (3x² + 5)/(x² − 1)', { size: 12, fill: AMB, anchor: 'end' }),
        'At x = 5 the height is 3.33; at x = 20 it is 3.02. The gap to y = 3 is the melting 5/x² and 1/x² pieces.',
      );
    })(),
    formula: {
      tex: '\\frac{3x^2 + 5}{x^2 - 1} = \\frac{3 + \\frac{5}{x^2}}{1 - \\frac{1}{x^2}} \\ \\xrightarrow{\\ x \\to \\infty\\ }\\ \\frac{3 + 0}{1 - 0} = 3',
      note: 'Dividing top and bottom by the same x² does not change the fraction; it only reveals which terms matter.',
      parts: [
        { sym: '\\div x^2', means: 'the highest power in the bottom, applied to every term', tone: 'accent' },
        { sym: '\\tfrac{5}{x^2},\\ \\tfrac{1}{x^2}', means: 'the small pieces: both melt to 0', tone: 'warn' },
        { sym: '\\tfrac{3}{1}', means: 'what is left: the leading coefficients', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The degree rule',
    body: 'Compare the degree of the top with the degree of the bottom. Top smaller: the bottom wins and the limit is 0. Degrees equal: the limit is the ratio of the leading coefficients. Top bigger: the top wins, the heights run off to ±∞, and there is no horizontal asymptote.',
    why: 'For huge x only the highest powers matter, because x³ dwarfs x², which dwarfs x. A polynomial behaves like its leading term, so the fraction behaves like a·xᵐ over b·xⁿ. If n > m that shrinks to 0, if m = n it is a/b, and if m > n it grows without bound.',
    art: (() => {
      const ax = grid({ x: [0, 8], y: [-1, 8] }, [2, 4, 6, 8], [3, 6], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'Three curves on one grid: (5x plus 2) over (x squared plus 7) sinking to 0, (3x squared plus 5) over (x squared minus 1) flattening onto the dashed line y = 3, and (x cubed minus 1) over (x plus 2) climbing off the top',
        ax.body +
          title('three fractions, three fates') +
          line(ax.X(0), ax.Y(3), ax.X(8), ax.Y(3), ROSE, 1.6, '6 5', 0.8) +
          ax.curve((x) => (5 * x + 2) / (x * x + 7), SKY, 2.6) +
          ax.curve((x) => (x < 1.25 ? NaN : (3 * x * x + 5) / (x * x - 1)), AMB, 2.6) +
          ax.curve((x) => (x * x * x - 1) / (x + 2), VIO, 2.6) +
          text(W - 24, 40, 'bottom wins → 0', { size: 12, fill: SKY, anchor: 'end' }) +
          text(W - 24, 57, 'equal degrees → 3', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 74, 'top wins → ∞', { size: 12, fill: VIO, anchor: 'end' }),
        'Same grid, three rational functions. Only the degrees decide which way each tail goes.',
      );
    })(),
    compare: {
      cols: [
        { title: 'Top degree smaller', tex: '\\frac{5x + 2}{x^2 + 7} \\to 0', lines: ['Bottom grows faster', 'Horizontal asymptote y = 0'], tone: 'accent' },
        { title: 'Degrees equal', tex: '\\frac{3x^2 + 5}{x^2 - 1} \\to \\tfrac{3}{1}', lines: ['Ratio of leading coefficients', 'Horizontal asymptote y = 3'], tone: 'ok' },
        { title: 'Top degree bigger', tex: '\\frac{x^3 - 1}{x + 2} \\to \\infty', lines: ['Top grows faster', 'No horizontal asymptote'], tone: 'warn' },
      ],
      note: 'The degree rule is the divide-by-the-highest-power trick with the work already done.',
    },
  },
  {
    kind: 'concept',
    head: 'Infinite limits: vertical asymptotes',
    body: 'When the bottom of a fraction heads to 0 while the top does not, the heights blow up. We write lim f(x) = ∞ or −∞ as x → c, and the graph has a VERTICAL ASYMPTOTE at x = c. For 1/(x − 2) the forbidden input is x = 2, and the two branches shoot off in opposite directions.',
    why: 'Near x = 2 the bottom x − 2 is a tiny number such as 0.01 or 0.0001, and dividing 1 by a tiny number gives a huge one: 1/0.01 = 100 and 1/0.0001 = 10,000. The closer x gets to 2, the larger the output grows, and no finite height can contain it.',
    art: (() => {
      const ax = grid({ x: [-1, 5], y: [-5, 5] }, [1, 2, 3, 4], [-2, 2], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The graph of 1 over (x minus 2): the left branch plunges down and the right branch climbs up along the dashed vertical asymptote x = 2',
        ax.body +
          title('a vertical asymptote at x = 2') +
          line(ax.X(2), ax.Y(-5), ax.X(2), ax.Y(5), ROSE, 2, '6 5') +
          ax.curve((x) => (Math.abs(x - 2) < 0.18 ? NaN : 1 / (x - 2)), AMB, 2.8) +
          lab(ax, 2.35, 4.2, '→ +∞', { fill: EMR, anchor: 'start' }) +
          lab(ax, 1.65, -4.4, '→ −∞', { fill: VIO, anchor: 'end' }) +
          text(W - 24, 40, 'y = 1/(x − 2)', { size: 12, fill: AMB, anchor: 'end' }),
        'Just right of 2 the bottom is a tiny positive number, so the heights shoot up. Just left, tiny negative, so they plunge.',
      );
    })(),
    formula: {
      tex: '\\lim_{x \\to 2^+} \\frac{1}{x - 2} = +\\infty, \\qquad \\lim_{x \\to 2^-} \\frac{1}{x - 2} = -\\infty',
      note: 'Infinity is not a number the limit equals; it is a description of heights growing without bound.',
      parts: [
        { sym: '\\tfrac{1}{\\text{tiny}}', means: 'a fixed top over a bottom heading to 0: enormous', tone: 'accent' },
        { sym: '\\tfrac{1}{0.001} = 1000', means: 'from the right: tiny positive bottom, huge positive height', tone: 'ok' },
        { sym: '\\tfrac{1}{-0.001} = -1000', means: 'from the left: tiny negative bottom, huge negative height', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Check each side separately',
    body: 'The sign of the bottom decides whether a branch shoots up or down, so test each side of a vertical asymptote on its own. 1/(x − 2) goes −∞ then +∞. But 1/(x − 2)² has a squared bottom that is positive on both sides, so both branches climb to +∞.',
    why: 'The sign of the bottom decides the direction. Just left of 2, x − 2 is tiny and negative, so 1/(x − 2) is hugely negative; just right it is tiny and positive. A square makes the bottom positive on both sides: at x = 1.99, (−0.01)² = 0.0001 and 1/0.0001 = 10,000, and the same on the right.',
    art: (() => {
      const ax = grid({ x: [-1, 5], y: [0, 6] }, [1, 2, 3, 4], [2, 4, 6]);
      return art(
        'The graph of 1 over (x minus 2) squared: both branches climb toward the dashed vertical asymptote at x = 2',
        ax.body +
          title('a squared bottom is never negative') +
          line(ax.X(2), ax.Y(0), ax.X(2), ax.Y(6), ROSE, 2, '6 5') +
          ax.curve((x) => (Math.abs(x - 2) < 0.3 ? NaN : 1 / ((x - 2) * (x - 2))), AMB, 2.8) +
          lab(ax, 2.4, 5.4, '+∞ on both sides', { fill: EMR, anchor: 'start' }) +
          text(W - 24, 40, 'y = 1/(x − 2)²', { size: 12, fill: AMB, anchor: 'end' }),
        'Left or right of 2, (x − 2)² is a tiny positive number, so both branches go the same way: up.',
      );
    })(),
    compare: {
      cols: [
        { title: 'Bottom changes sign', tex: '\\frac{1}{x - 2}', lines: ['Left: negative → −∞', 'Right: positive → +∞', 'Two-sided limit DNE'], tone: 'warn' },
        { title: 'Bottom stays positive', tex: '\\frac{1}{(x - 2)^2}', lines: ['Left: positive → +∞', 'Right: positive → +∞', 'Both branches climb'], tone: 'ok' },
      ],
      note: 'Plug in a number a hair left of c and a hair right of c. The sign you get is the direction of that branch.',
    },
  },
  {
    kind: 'example',
    head: 'Start simple: equal degrees',
    body: 'Find the limit of (3x² + 5)/(x² − 1) as x → ∞. You cannot substitute ∞, so compare the powers of x and divide by the biggest one.',
    steps: {
      steps: [
        { tex: '\\frac{3x^2 + 5}{x^2 - 1}', text: 'Compare degrees first. The top has x² and the bottom has x², so they match, which tells us the answer will be a ratio of leading coefficients.' },
        { tex: '= \\frac{3 + \\frac{5}{x^2}}{1 - \\frac{1}{x^2}}', text: 'Divide every term on top and bottom by x², the highest power in the bottom. This does not change the fraction\'s value, and it turns each term into a number or a c/x² piece.' },
        { tex: '\\tfrac{5}{x^2} \\to 0,\\quad \\tfrac{1}{x^2} \\to 0', text: 'As x grows without bound, 5/x² and 1/x² both shrink toward 0, because a fixed top over a growing bottom melts away.' },
        { tex: '\\frac{3 + 0}{1 - 0} = 3', text: 'Substitute the melted values: (3 + 0)/(1 − 0) = 3. What remains is the ratio of leading coefficients, 3/1, so the horizontal asymptote is y = 3.' },
      ],
      answer: '3',
    },
    table: {
      head: ['x', '3x² + 5', 'x² − 1', 'quotient'],
      rows: [['10', '305', '99', '3.0808'], ['100', '30 005', '9 999', '3.0008'], ['1000', '3 000 005', '999 999', '3.000008']],
      note: 'Each extra zero in x pulls the quotient a hundred times closer to 3.',
    },
  },
  {
    kind: 'example',
    head: 'The bottom wins',
    body: 'Find the limit of (5x + 2)/(x² + 7) as x → ∞. The bottom has the higher power, so ask which side grows faster.',
    steps: {
      steps: [
        { tex: '\\frac{5x + 2}{x^2 + 7}', text: 'The top has degree 1 and the bottom has degree 2. The bottom grows faster, so we expect the fraction to shrink toward 0.' },
        { tex: '= \\frac{\\frac{5}{x} + \\frac{2}{x^2}}{1 + \\frac{7}{x^2}}', text: 'Divide every term by x², the highest power of x in the bottom. The top becomes 5/x + 2/x² and the bottom becomes 1 + 7/x².' },
        { tex: '\\to \\frac{0 + 0}{1 + 0}', text: 'Every piece with x in the denominator melts to 0 as x → ∞. Putting in those limits gives (0 + 0)/(1 + 0).' },
        { tex: '= 0', text: 'That is 0/1 = 0. The horizontal asymptote is y = 0, the x-axis, which confirms that the bottom wins.' },
      ],
      answer: '0',
    },
  },
  {
    kind: 'example',
    head: 'The top wins',
    body: 'Find the limit of (x³ − 1)/(x + 2) as x → ∞. The top has the higher power, so predict who wins before you compute.',
    steps: {
      steps: [
        { tex: '\\frac{x^3 - 1}{x + 2}', text: 'The top has degree 3 and the bottom has degree 1. The top is the faster grower, so we expect the heights to run off to infinity.' },
        { tex: '= \\frac{x^2 - \\frac{1}{x}}{1 + \\frac{2}{x}}', text: 'Divide every term by x, the highest power in the bottom. The top becomes x² − 1/x and the bottom becomes 1 + 2/x.' },
        { tex: '\\to \\frac{x^2 - 0}{1 + 0} = x^2', text: 'The pieces 1/x and 2/x melt to 0, but x² does not melt. The fraction behaves like x²/1 = x², which keeps growing.' },
        { tex: 'x^2 \\to \\infty', text: 'Since x² grows without bound, the limit is ∞. Because the heights never settle on a number, there is no horizontal asymptote.' },
      ],
      answer: '\\infty\\ \\text{(no horizontal asymptote)}',
    },
  },
  {
    kind: 'example',
    head: 'Both sides of a vertical asymptote',
    body: 'Find the one-sided limits of 1/(x − 2) as x → 2. The bottom heads to 0, so check its sign on each side.',
    table: {
      head: ['x', 'x − 2', '1/(x − 2)'],
      rows: [['1.9', '−0.1', '−10'], ['1.99', '−0.01', '−100'], ['2.01', '0.01', '100'], ['2.1', '0.1', '10']],
      note: 'Left column: ever more negative. Right column: ever more positive. No single height is approached.',
    },
    steps: {
      steps: [
        { tex: 'x = 1.99:\\ \\frac{1}{-0.01} = -100', text: 'Test a hair left of 2, say x = 1.99. The bottom is 1.99 − 2 = −0.01, a tiny negative number, so the fraction is 1/(−0.01) = −100.' },
        { tex: '\\lim_{x \\to 2^-} \\frac{1}{x - 2} = -\\infty', text: 'Closer to 2 from the left, the bottom is an even tinier negative number, so the heights get more negative without limit. The left-hand limit is −∞.' },
        { tex: 'x = 2.01:\\ \\frac{1}{0.01} = 100', text: 'Test a hair right of 2, say x = 2.01. The bottom is 0.01, a tiny positive number, so the fraction is 1/0.01 = 100.' },
        { tex: '\\lim_{x \\to 2^+} \\frac{1}{x - 2} = +\\infty', text: 'Closer to 2 from the right, the bottom is an even tinier positive number, so the heights grow without limit. The right-hand limit is +∞, and the branches go opposite ways.' },
      ],
      answer: '\\text{left } -\\infty,\\ \\text{right } +\\infty',
    },
  },
  {
    kind: 'example',
    head: 'Another way: a square root up top',
    body: 'Find the limit of √(4x² + 1)/(x + 3) as x → ∞. A root on top makes the degree unclear, so estimate first, then do it exactly.',
    art: (() => {
      const ax = grid({ x: [0, 20], y: [0, 3] }, [5, 10, 15, 20], [1, 2, 3]);
      const f = (x: number) => Math.sqrt(4 * x * x + 1) / (x + 3);
      return art(
        'The curve root of (4x squared plus 1) over (x plus 3) rising from one third and flattening toward the dashed line y = 2',
        ax.body +
          title('rising toward the asymptote y = 2') +
          line(ax.X(0), ax.Y(2), ax.X(20), ax.Y(2), ROSE, 2, '6 5') +
          ax.curve(f, AMB, 2.8) +
          creep(ax, f, 12, 17, SKY) +
          lab(ax, 19.6, 2.3, 'y = 2', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'y = √(4x² + 1)/(x + 3)', { size: 12, fill: AMB, anchor: 'end' }),
        'The root grows like 2x and the bottom like x, so the ratio settles at 2.',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\sqrt{4x^2 + 1} \\approx \\sqrt{4x^2} = 2x\\ \\ (x > 0)', text: 'Estimate first: for huge x the +1 is tiny next to 4x², so √(4x² + 1) is about √(4x²) = 2x. The top acts like 2x and the bottom like x, so expect 2.' },
        { tex: '\\frac{\\sqrt{4x^2 + 1}}{x + 3} = \\frac{\\sqrt{\\frac{4x^2 + 1}{x^2}}}{\\frac{x + 3}{x}}', text: 'Now be exact: divide top and bottom by x. Dividing the root by x means moving x inside the root as x², which is fine because x is positive.' },
        { tex: '= \\frac{\\sqrt{4 + \\frac{1}{x^2}}}{1 + \\frac{3}{x}}', text: 'Simplify: inside the root (4x² + 1)/x² = 4 + 1/x², and on the bottom (x + 3)/x = 1 + 3/x.' },
        { tex: '\\to \\frac{\\sqrt{4 + 0}}{1 + 0} = \\frac{2}{1} = 2', text: 'As x → ∞ the pieces 1/x² and 3/x melt to 0, leaving √4/1 = 2. The horizontal asymptote on the right is y = 2.' },
      ],
      answer: '2',
    },
  },
  {
    kind: 'example',
    head: 'Where is the vertical asymptote?',
    body: 'At what x does f(x) = (x + 1)/(x − 5) have a vertical asymptote? Find where the bottom is zero, then check the top.',
    art: (() => {
      const ax = grid({ x: [-2, 12], y: [-6, 8] }, [5, 10], [-4, 4], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The graph of (x plus 1) over (x minus 5) with a dashed vertical asymptote at x = 5 and a dashed horizontal asymptote at y = 1',
        ax.body +
          title('x = 5 makes the bottom zero') +
          line(ax.X(5), ax.Y(-6), ax.X(5), ax.Y(8), ROSE, 2, '6 5') +
          line(ax.X(-2), ax.Y(1), ax.X(12), ax.Y(1), SKY, 1.6, '6 5', 0.8) +
          ax.curve((x) => (Math.abs(x - 5) < 0.45 ? NaN : (x + 1) / (x - 5)), AMB, 2.8) +
          lab(ax, 5.4, 7.2, 'x = 5', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 11.7, 1.8, 'y = 1', { fill: SKY, anchor: 'end' }) +
          text(W - 24, 40, 'y = (x + 1)/(x − 5)', { size: 12, fill: AMB, anchor: 'end' }),
        'Vertical asymptote where the bottom is zero; horizontal asymptote at the ratio of leading coefficients, 1/1.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'x - 5 = 0 \\ \\Rightarrow\\ x = 5', text: 'A vertical asymptote needs a bottom that heads to 0, so set x − 5 = 0 and solve to get x = 5.' },
        { tex: 'x + 1 = 6 \\ne 0\\ \\text{at } x = 5', text: 'Check the top at x = 5: 5 + 1 = 6, which is not 0. A nonzero top means nothing cancels, so x = 5 is not a hole.' },
        { tex: '\\frac{6}{\\text{tiny}} \\to \\pm\\infty', text: 'A nonzero number like 6 divided by a number heading to 0 gets enormous in size, either +∞ or −∞ depending on the side.' },
        { tex: '\\text{vertical asymptote } x = 5', text: 'So x = 5 is a vertical asymptote. As a bonus, the degrees are equal, so the horizontal asymptote is the ratio of leading coefficients, y = 1/1 = 1.' },
      ],
      answer: 'x = 5',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the fish pond',
    body: 'A fish population follows P(t) = 1000/(1 + 9e^(−t)), t in years. What population does the lake approach in the long run? Sketch an S-curve first.',
    art: (() => {
      const ax = grid({ x: [0, 10], y: [0, 1200] }, [2, 4, 6, 8, 10], [500, 1000], { xLabel: 't', yLabel: 'P' });
      const P = (t: number) => 1000 / (1 + 9 * Math.exp(-t));
      return art(
        'An S-shaped population curve starting at 100 fish and levelling off toward the dashed line at 1000 fish',
        ax.body +
          title('the pond levels off at its carrying capacity') +
          line(ax.X(0), ax.Y(1000), ax.X(10), ax.Y(1000), ROSE, 2, '6 5') +
          ax.curve(P, AMB, 2.8) +
          solid(ax, 0, 100, SKY) +
          lab(ax, 0.3, 190, 'start: 100 fish', { fill: SKY, anchor: 'start' }) +
          lab(ax, 9.8, 1090, 'ceiling: 1000 fish', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'P = 1000/(1 + 9e^(−t))', { size: 12, fill: AMB, anchor: 'end' }),
        'The curve can get as close to 1000 as it likes but never crosses it: that is what a horizontal asymptote is.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'P(0) = \\frac{1000}{1 + 9} = 100', text: 'Start with t = 0 for the sketch: e⁰ = 1, so P(0) = 1000/(1 + 9) = 100. The curve starts at 100 fish.' },
        { tex: 't \\to \\infty \\ \\Rightarrow\\ e^{-t} \\to 0', text: 'As t grows, e^(−t) = 1/eᵗ becomes tiny, because eᵗ in the bottom grows without bound. So e^(−t) → 0.' },
        { tex: '1 + 9e^{-t} \\to 1 + 0 = 1', text: 'The 9e^(−t) piece melts away too, so the bottom 1 + 9e^(−t) settles at 1 + 0 = 1.' },
        { tex: 'P(t) \\to \\frac{1000}{1} = 1000', text: 'With the bottom heading to 1, P(t) → 1000/1 = 1000 fish. The horizontal asymptote y = 1000 is the lake\'s carrying capacity, the ceiling the population levels off at.' },
      ],
      answer: '1000\\ \\text{fish}',
    },
  },
  {
    kind: 'protip',
    head: 'Compare growth, not values',
    body: 'A limit at infinity is a race between the top and the bottom. Ask which grows faster. Higher power beats lower power; any exponential eˣ beats any power; any power beats ln x. The winner decides the fate: bottom wins → 0, tie → ratio of coefficients, top wins → infinite.',
    compare: {
      cols: [
        { title: 'Slowest', tex: '\\ln x', lines: ['Grows, but barely', 'Loses to every power'], tone: 'plain' },
        { title: 'Middle', tex: 'x,\\ x^2,\\ x^3', lines: ['Higher power wins', 'Equal powers tie'], tone: 'accent' },
        { title: 'Fastest', tex: 'e^x', lines: ['Beats every power', 'e^(−x) → 0 fastest of all'], tone: 'ok' },
      ],
      note: 'The fish pond is this rule in action: e^(−t) melted to 0 while the constants stayed put.',
    },
  },
  {
    kind: 'protip',
    head: 'Rewrite √(x²) as |x|',
    body: 'When a square root is on top and you want the x → −∞ side, remember √(x²) = |x|, which equals −x for negative x. Pulling x inside the root as x² hides a sign: for x < 0 you must write x = −√(x²). That is why a root function can have different horizontal asymptotes on the left and the right.',
    formula: {
      tex: '\\sqrt{x^2} = |x| = \\begin{cases} x & x \\ge 0 \\\\ -x & x < 0 \\end{cases}',
      note: 'For x → −∞, dividing by x means dividing the root by −√(x²). The sign flips.',
      parts: [
        { sym: 'x > 0', means: 'the right side: √(4x²) = 2x, limit +2', tone: 'ok' },
        { sym: 'x < 0', means: 'the left side: √(4x²) = −2x, limit −2', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: equal degrees is not 1',
    body: 'Students see matching degrees and answer "1" because the powers cancel. The powers cancel, but their coefficients stay. (7x² − x)/(2x² + 3) → 7/2, not 1. The horizontal asymptote is y = 7/2.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\frac{7x^2 - x}{2x^2 + 3} \\to 1', lines: ['Cancels the x² and forgets the rest', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '\\frac{7 - \\frac{1}{x}}{2 + \\frac{3}{x^2}} \\to \\frac{7}{2}', lines: ['The coefficients remain', 'Right'], tone: 'ok' },
      ],
      note: 'Divide by x² and look at what is left: 7 on top, 2 on the bottom.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: the −∞ side can flip',
    body: 'For √(4x² + 1)/(x + 3), the limit as x → ∞ is 2, but as x → −∞ it is −2. Far to the left, x is negative while the square root is positive, so the fraction is negative. The graph has two different horizontal asymptotes, y = 2 on the right and y = −2 on the left.',
    art: (() => {
      const ax = grid({ x: [-20, 20], y: [-4, 4] }, [-10, 10], [-2, 2], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => Math.sqrt(4 * x * x + 1) / (x + 3);
      return art(
        'The curve root of (4x squared plus 1) over (x plus 3) across both sides: it flattens onto y = 2 far right and onto y = minus 2 far left, with a vertical asymptote at x = minus 3',
        ax.body +
          title('√(x²) is |x|, so the left side flips sign') +
          line(ax.X(-20), ax.Y(2), ax.X(20), ax.Y(2), ROSE, 2, '6 5') +
          line(ax.X(-20), ax.Y(-2), ax.X(20), ax.Y(-2), ROSE, 2, '6 5') +
          line(ax.X(-3), ax.Y(-4), ax.X(-3), ax.Y(4), ROSE, 1.4, '4 4', 0.6) +
          ax.curve((x) => (Math.abs(x + 3) < 0.9 ? NaN : f(x)), AMB, 2.6) +
          lab(ax, 19.5, 2.6, 'y = 2 on the right', { fill: ROSE, anchor: 'end' }) +
          lab(ax, -19.5, -2.8, 'y = −2 on the left', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 57, 'y = √(4x² + 1)/(x + 3)', { size: 12, fill: AMB, anchor: 'end' }),
        'Positive root over a negative x: the left tail settles at −2, not 2.',
      );
    })(),
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\lim_{x \\to -\\infty} = 2', lines: ['Copies the right-hand answer', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '\\lim_{x \\to -\\infty} = -2', lines: ['Root positive, x negative', 'Right'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: the cost per gadget',
    body: 'The average cost per gadget after making t thousand of them is C(t) = (40t + 5)/(t + 2) dollars. What does the cost approach as t → ∞, and when is it within $1 of that? First find the limit, then rewrite the formula to measure the gap.',
    art: (() => {
      const ax = grid({ x: [0, 20], y: [0, 50] }, [5, 10, 15, 20], [10, 20, 30, 40, 50], { xLabel: 't', yLabel: '$' });
      const C = (t: number) => (40 * t + 5) / (t + 2);
      return art(
        'The average-cost curve (40t plus 5) over (t plus 2) rising from 2.5 dollars and flattening toward the dashed line at 40 dollars',
        ax.body +
          title('the average cost settles toward $40') +
          line(ax.X(0), ax.Y(40), ax.X(20), ax.Y(40), ROSE, 2, '6 5') +
          ax.curve(C, AMB, 2.8) +
          creep(ax, C, 12, 17, SKY) +
          lab(ax, 19.6, 43.5, 'cost → $40', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'C = (40t + 5)/(t + 2)', { size: 12, fill: AMB, anchor: 'end' }),
        'At t = 20 the average cost is $36.59, still climbing toward the $40 ceiling it never reaches.',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\frac{40t + 5}{t + 2} = \\frac{40 + \\frac{5}{t}}{1 + \\frac{2}{t}} \\to \\frac{40}{1} = 40', text: 'Degrees are equal, so divide by t: (40 + 5/t)/(1 + 2/t). The small pieces melt to 0, leaving 40/1 = 40, the ratio of leading coefficients.' },
        { tex: '\\frac{40t + 5}{t + 2} = \\frac{40(t + 2) - 75}{t + 2} = 40 - \\frac{75}{t + 2}', text: 'To measure the gap, split off the limit. 40(t + 2) = 40t + 80, and 5 − 80 = −75, so the fraction equals 40 − 75/(t + 2).' },
        { tex: '\\frac{75}{t + 2} < 1', text: 'Within $1 of 40 means the gap from 40 is less than 1. The gap is 75/(t + 2), which is positive, so we need 75/(t + 2) < 1.' },
        { tex: 't + 2 > 75 \\ \\Rightarrow\\ t > 73', text: 'Multiply both sides by t + 2, which is positive so the inequality keeps its direction, to get 75 < t + 2. Subtract 2 to get t > 73.' },
      ],
      answer: '\\$40;\\ \\text{within } \\$1 \\text{ after } t > 73\\ (\\text{thousand})',
    },
  },
  {
    kind: 'summary',
    head: 'Asymptotes, horizontal and vertical',
    body: 'Far out, divide by the highest power and let the c/xⁿ pieces melt: the degree rule gives 0, the ratio of leading coefficients, or ±∞. Near a zero of the bottom that does not cancel, the heights blow up: a vertical asymptote, with each side checked on its own. And on the far left, remember √(x²) = |x|.',
    table: {
      head: ['Degrees', 'Example', 'Limit as x → ∞', 'Horizontal asymptote'],
      rows: [['top < bottom', '(5x + 2)/(x² + 7)', '0', 'y = 0'], ['top = bottom', '(3x² + 5)/(x² − 1)', '3', 'y = 3'], ['top > bottom', '(x³ − 1)/(x + 2)', '∞', 'none']],
    },
    formula: {
      tex: '\\lim_{x \\to \\infty} \\frac{a x^n + \\dots}{b x^n + \\dots} = \\frac{a}{b} \\qquad\\qquad \\frac{\\text{nonzero}}{\\to 0} \\Rightarrow \\text{vertical asymptote}',
      note: 'Left: the equal-degree case of the degree rule. Right: the test for a vertical asymptote.',
      parts: [
        { sym: '\\tfrac{a}{b}', means: 'leading coefficients, top over bottom', tone: 'ok' },
        { sym: '\\tfrac{c}{x^n} \\to 0', means: 'why every lower-order term disappears', tone: 'accent' },
        { sym: 'x \\to c^{\\pm}', means: 'test each side of a vertical asymptote for its sign', tone: 'warn' },
      ],
    },
  },
];

// ---------------- CALC-5 — The derivative as a limit; tangent lines and rates of change ----------------
const CALC_5: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'From average speed to speed right now',
    body: 'A speedometer does not measure how far you went in an hour; it reports your speed at this instant. Today you will build that idea from scratch: the slope between two points on a curve is an average rate, and as the second point slides into the first, those slopes settle on one number. That number is the derivative, the slope of the tangent line.',
    art: (() => {
      const ax = grid({ x: [-1, 3], y: [-1, 6] }, [1, 2], [2, 4, 6], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => x * x;
      return art(
        'The parabola y = x squared with a dashed secant line through (1, 1) and (2, 4) of slope 3, and the tangent line at (1, 1) of slope 2',
        ax.body +
          title('secant slope 3, tangent slope 2') +
          ax.curve(f, AMB, 2.8) +
          ax.curve(tangentLine(1, 1, 3), SKY, 2, '5 4') +
          ax.curve(tangentLine(1, 1, 2), ROSE, 2.4) +
          solid(ax, 1, 1, EMR) +
          solid(ax, 2, 4, SKY) +
          lab(ax, 1.2, 0.6, '(1, 1)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 1.8, 4.4, '(2, 4)', { fill: SKY, anchor: 'end' }) +
          lab(ax, 2.7, 5.0, 'secant', { fill: SKY, anchor: 'start' }) +
          lab(ax, 2.95, 3.9, 'tangent', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'y = x²', { size: 12, fill: AMB, anchor: 'end' }),
        'The secant through two points has slope 3. The tangent, which touches only at (1, 1), has slope 2.',
      );
    })(),
    formula: {
      tex: "f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h}",
      note: 'The derivative at a: the limit of secant slopes as the second point slides into the first.',
      parts: [
        { sym: 'f(a + h) - f(a)', means: 'the rise between the two points', tone: 'accent' },
        { sym: 'h', means: 'the run between them, shrinking to 0', tone: 'warn' },
        { sym: "f'(a)", means: 'the slope the secants settle on: the tangent slope', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Average rate = secant slope',
    body: 'The AVERAGE rate of change of f over [a, b] is rise over run between the two endpoints: (f(b) − f(a))/(b − a). On the graph that is the slope of the SECANT line through the two points. For y = x² from x = 1 to x = 3 the secant climbs 8 over a run of 2, so the average rate is 4.',
    why: 'Slope is rise over run, and average rate of change is the same idea: how much the output changed divided by how much the input changed. A car that goes 120 miles in 2 hours has averaged 60 mph, however fast it went in between. The secant line is the straight route with that steady rate.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [0, 10] }, [1, 2, 3], [3, 6, 9]);
      return art(
        'The parabola y = x squared with a secant line through (1, 1) and (3, 9), and a rise-over-run staircase showing run 2 and rise 8',
        ax.body +
          title('secant slope = (9 − 1)/(3 − 1) = 4') +
          ax.curve((x) => x * x, AMB, 2.8) +
          ax.curve(tangentLine(1, 1, 4), SKY, 2.2, '5 4') +
          line(ax.X(1), ax.Y(1), ax.X(3), ax.Y(1), ROSE, 2.2) +
          line(ax.X(3), ax.Y(1), ax.X(3), ax.Y(9), ROSE, 2.2) +
          solid(ax, 1, 1, EMR) +
          solid(ax, 3, 9, EMR) +
          lab(ax, 1.25, 0.7, '(1, 1)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 2.75, 9.35, '(3, 9)', { fill: EMR, anchor: 'end' }) +
          lab(ax, 2, 0.5, 'run 2', { fill: ROSE }) +
          lab(ax, 3.1, 5, 'rise 8', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = x²', { size: 12, fill: AMB, anchor: 'end' }),
        'Two points, one straight line between them. Its slope, 8/2 = 4, is the average rate of change on [1, 3].',
      );
    })(),
    formula: {
      tex: '\\text{average rate on } [a, b] = \\frac{f(b) - f(a)}{b - a}',
      note: 'Rise over run between two points on the curve. No limit yet: this is ordinary slope.',
      parts: [
        { sym: 'f(b) - f(a)', means: 'the rise: how much the output changed', tone: 'accent' },
        { sym: 'b - a', means: 'the run: how much the input changed', tone: 'warn' },
        { sym: '\\tfrac{8}{2} = 4', means: 'for x² on [1, 3]: the secant slope', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Slide the second point in',
    body: 'Keep the first point at (1, 1) and let the second point slide toward it. With h = 2 the secant slope is 4. With h = 1 it is 3. With h = 0.5 it is 2.5. The slopes head to 2, and the secants tilt toward one special line: the tangent. The INSTANTANEOUS rate is that limit.',
    why: 'Each secant slope is an average taken over a shorter stretch than the one before. As the stretch shrinks, the averages stop changing much, like a speed timed over one second, then a thousandth of a second. The single number they settle on is the speed at that instant.',
    art: (() => {
      const ax = grid({ x: [0, 3.5], y: [0, 10] }, [1, 2, 3], [2, 4, 6, 8]);
      return art(
        'The parabola y = x squared with three dashed secants from (1, 1) to points at h = 2, h = 1 and h = 0.5, all tilting toward the solid tangent line of slope 2',
        ax.body +
          title('secant slopes 4, 3, 2.5 … → tangent slope 2') +
          ax.curve((x) => x * x, AMB, 2.8) +
          ax.curve(tangentLine(1, 1, 4), SKY, 1.8, '5 4') +
          ax.curve(tangentLine(1, 1, 3), SKY, 1.8, '5 4') +
          ax.curve(tangentLine(1, 1, 2.5), SKY, 1.8, '5 4') +
          ax.curve(tangentLine(1, 1, 2), ROSE, 2.6) +
          solid(ax, 1, 1, EMR) +
          solid(ax, 3, 9, SKY) +
          solid(ax, 2, 4, SKY) +
          solid(ax, 1.5, 2.25, SKY) +
          lab(ax, 2.75, 9.4, 'h = 2', { fill: SKY, anchor: 'end' }) +
          lab(ax, 2.15, 3.6, 'h = 1', { fill: SKY, anchor: 'start' }) +
          lab(ax, 1.7, 1.7, 'h = 0.5', { fill: SKY, anchor: 'start' }) +
          lab(ax, 3.4, 5.0, 'tangent, slope 2', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'y = x²', { size: 12, fill: AMB, anchor: 'end' }),
        'Each smaller h gives a secant closer to the tangent. The limit of the slopes is the slope of the tangent.',
      );
    })(),
    table: {
      head: ['h', 'second point', 'secant slope'],
      rows: [['2', '(3, 9)', '(9 − 1)/2 = 4'], ['1', '(2, 4)', '(4 − 1)/1 = 3'], ['0.5', '(1.5, 2.25)', '(2.25 − 1)/0.5 = 2.5'], ['0.1', '(1.1, 1.21)', '(1.21 − 1)/0.1 = 2.1'], ['→ 0', '→ (1, 1)', '→ 2']],
      mark: 4,
      note: 'The slopes are 2 + h every time. As h → 0 they settle on 2.',
    },
    compare: {
      cols: [
        { title: 'Average rate', tex: '\\frac{f(1 + h) - f(1)}{h}', lines: ['Two points, h apart', 'A secant slope', 'Depends on h'], tone: 'accent' },
        { title: 'Instantaneous rate', tex: "f'(1) = \\lim_{h \\to 0}", lines: ['The points merge', 'The tangent slope', 'One number: 2'], tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The definition of the derivative',
    body: 'Write the secant slope with the second point at x + h: rise f(x + h) − f(x) over run h. Then take the limit as h → 0. That limit is f′(x), the derivative. An equivalent form puts the second point at x and the fixed point at a: f′(a) = lim of (f(x) − f(a))/(x − a) as x → a.',
    why: 'The rise is the change f(x + h) − f(x), and the run is the gap h between the two points. You cannot set h = 0 directly, since that gives 0/0, so you let h shrink toward 0 and read the number the slopes head toward. The alternate form is the same slope with h = x − a.',
    art: (() => {
      const ax = grid({ x: [0.5, 2], y: [0.5, 3] }, [1, 1.6], [1, 2.56], { tickText: (v) => String(v) });
      return art(
        'A close-up of y = x squared between x = 1 and x = 1.6, with the run h and the rise f(1 + h) minus f(1) drawn as the legs of a right triangle under the secant',
        ax.body +
          title('this secant has slope (f(1+h) − f(1)) / h') +
          ax.curve((x) => x * x, AMB, 2.8) +
          ax.curve(tangentLine(1, 1, 2.6), SKY, 2, '5 4') +
          line(ax.X(1), ax.Y(1), ax.X(1.6), ax.Y(1), ROSE, 2.2) +
          line(ax.X(1.6), ax.Y(1), ax.X(1.6), ax.Y(2.56), ROSE, 2.2) +
          solid(ax, 1, 1, EMR) +
          solid(ax, 1.6, 2.56, SKY) +
          lab(ax, 1.3, 0.82, 'h', { fill: ROSE, size: 14 }) +
          lab(ax, 1.65, 1.7, 'f(1+h) − f(1)', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 0.95, 1.25, '(1, 1)', { fill: EMR, anchor: 'end' }) +
          lab(ax, 1.55, 2.85, '(1+h, f(1+h))', { fill: SKY, anchor: 'end' }) +
          text(W - 24, 40, 'y = x²', { size: 12, fill: AMB, anchor: 'end' }),
        'Here h = 0.6: the run is 0.6, the rise is 2.56 − 1 = 1.56, and the secant slope is 1.56/0.6 = 2.6.',
      );
    })(),
    formula: {
      tex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h} \\qquad f'(a) = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}",
      note: 'Two spellings of the same limit. The first gives a formula in x; the second is handy at one specific point a.',
      parts: [
        { sym: 'f(x + h)', means: 'the height a little further along', tone: 'accent' },
        { sym: '\\tfrac{\\cdots}{h}', means: 'divide the rise by the run: a secant slope', tone: 'warn' },
        { sym: '\\lim_{h \\to 0}', means: 'shrink the run to nothing: the tangent slope', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The tangent line',
    body: 'f′(a) is the slope of the tangent line at x = a, and (a, f(a)) is a point on it. Point-slope form writes the line at once: y = f(a) + f′(a)(x − a). For y = x² at x = 2 the point is (2, 4) and the slope is 4, so the tangent is y = 4x − 4.',
    why: 'A line is determined by a point and a slope. The tangent touches the curve at (a, f(a)), and the derivative supplies the slope there. Put both into point-slope form, y − f(a) = f′(a)(x − a), and add f(a) to both sides. For y = x² at 2 this gives y − 4 = 4(x − 2).',
    art: (() => {
      const ax = grid({ x: [-1, 4], y: [-5, 10] }, [1, 2, 3], [-4, 4, 8], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The parabola y = x squared with its tangent line at (2, 4), which is the line y = 4x minus 4',
        ax.body +
          title('tangent at x = 2: slope 4 through (2, 4)') +
          ax.curve((x) => x * x, AMB, 2.8) +
          ax.curve(tangentLine(2, 4, 4), ROSE, 2.4) +
          guides(ax, 2, 4) +
          solid(ax, 2, 4, EMR) +
          lab(ax, 1.8, 4.9, '(2, 4)', { fill: EMR, anchor: 'end' }) +
          lab(ax, 3.2, 6.2, 'y = 4x − 4', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = x²', { size: 12, fill: AMB, anchor: 'end' }),
        'The tangent touches the curve at (2, 4) and has the same steepness the curve has right there.',
      );
    })(),
    formula: {
      tex: "y = f(a) + f'(a)\\,(x - a)",
      note: 'Point-slope form with the derivative as the slope. Every tangent-line problem is: find the point, find the slope, write this.',
      parts: [
        { sym: '(a, f(a))', means: 'the point of tangency: plug a into f', tone: 'accent' },
        { sym: "f'(a)", means: 'the slope: plug a into the derivative', tone: 'warn' },
        { sym: 'y = 4 + 4(x - 2)', means: 'for x² at 2, which simplifies to y = 4x − 4', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Where the derivative fails',
    body: 'A tangent line needs the secant slopes to settle on ONE number. At a corner they settle on two different numbers, one from each side. At a cusp or a vertical tangent they run off to infinity. At a break there is no second point to approach. Differentiable implies continuous, but a continuous graph like y = |x| can still have a corner.',
    why: 'The derivative is a limit, and a limit exists only if both sides agree on one number. At the corner of y = |x| the secant slopes from the left are −1 and from the right are +1, so there is no single tangent slope. At a break, one side has no neighboring points to approach.',
    art: (() => {
      const ax = grid({ x: [-3, 3], y: [-1, 3] }, [-2, -1, 1, 2], [1, 2, 3], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The V-shaped graph of y equals the absolute value of x, with slope minus 1 on the left arm, slope plus 1 on the right arm and a corner at the origin',
        ax.body +
          title('two slopes meet: no single tangent') +
          ax.curve((x) => Math.abs(x), AMB, 2.8) +
          dot(ax.X(0), ax.Y(0), 5.5, ROSE) +
          lab(ax, -1.6, 2.1, 'slope −1', { fill: SKY, anchor: 'end' }) +
          lab(ax, 1.6, 2.1, 'slope +1', { fill: SKY, anchor: 'start' }) +
          lab(ax, 0, -0.75, 'corner: not differentiable', { fill: ROSE }) +
          text(W - 24, 40, 'y = |x|', { size: 12, fill: AMB, anchor: 'end' }),
        'From the left the secant slopes are all −1; from the right they are all +1. No agreement, no derivative at 0.',
      );
    })(),
    compare: {
      cols: [
        { title: 'Corner', tex: 'y = |x|', lines: ['Left slope −1, right slope +1', 'Continuous but not differentiable'], tone: 'warn' },
        { title: 'Cusp or vertical tangent', tex: 'y = x^{1/3}', lines: ['Slopes run off to ±∞', 'Continuous but not differentiable'], tone: 'warn' },
        { title: 'Break', tex: '\\text{hole, jump, asymptote}', lines: ['Not even continuous', 'So certainly not differentiable'], tone: 'bad' },
      ],
      note: 'Differentiable ⇒ continuous. The arrow does not run backwards: |x| is the standard counterexample.',
    },
  },
  {
    kind: 'example',
    head: 'Start simple: f′(1) for f(x) = x²',
    body: 'Use the limit definition to find f′(1) for f(x) = x². Build the secant slope between x = 1 and x = 1 + h, simplify it, then let h → 0.',
    steps: {
      steps: [
        { tex: 'f(1 + h) = (1 + h)^2 = 1 + 2h + h^2', text: 'Replace x by 1 + h in f(x) = x² and expand with (a + b)² = a² + 2ab + b². That gives 1 + 2h + h².' },
        { tex: 'f(1 + h) - f(1) = 2h + h^2', text: 'Subtract f(1) = 1 from f(1 + h). The 1\'s cancel, which leaves 2h + h², the rise of the secant line.' },
        { tex: '\\frac{2h + h^2}{h} = \\frac{h(2 + h)}{h} = 2 + h', text: 'Divide by h to get the secant slope. Factor h out of the top and cancel it with the h on the bottom, leaving 2 + h. This works for any h that is not 0.' },
        { tex: "f'(1) = \\lim_{h \\to 0} (2 + h) = 2", text: 'Now let h → 0. The expression 2 + h has no h in a denominator anymore, so it simply heads to 2, and f′(1) = 2.' },
      ],
      answer: "f'(1) = 2",
    },
  },
  {
    kind: 'example',
    head: 'f′(x) for every x at once',
    body: 'f(x) = x². Find f′(x) for every x from the definition. Follow the same steps as before, but keep x as a letter instead of a number.',
    steps: {
      steps: [
        { tex: 'f(x + h) = (x + h)^2 = x^2 + 2xh + h^2', text: 'Replace x by x + h and expand: (x + h)² = x² + 2xh + h². Now x is a letter, not a number, so there are three terms.' },
        { tex: 'f(x + h) - f(x) = 2xh + h^2', text: 'Subtract f(x) = x². The x² terms cancel, and the rise that is left is 2xh + h².' },
        { tex: '\\frac{2xh + h^2}{h} = 2x + h', text: 'Divide by h. Every term on the top has an h, so factor it out and cancel it with the h on the bottom, which gives 2x + h.' },
        { tex: "f'(x) = \\lim_{h \\to 0} (2x + h) = 2x", text: 'Let h → 0. The h in 2x + h disappears and f′(x) = 2x. Check: at x = 1 this gives 2, matching the previous slide.' },
      ],
      answer: "f'(x) = 2x",
    },
  },
  {
    kind: 'example',
    head: 'A reciprocal: f(x) = 1/x',
    body: 'Find f′(x) for f(x) = 1/x from the definition. The rise is a difference of two fractions, so you will need a common denominator.',
    steps: {
      steps: [
        { tex: '\\frac{1}{x + h} - \\frac{1}{x} = \\frac{x - (x + h)}{x(x + h)}', text: 'The rise is 1/(x + h) − 1/x. Subtract the fractions using the common denominator x(x + h), so the top is x − (x + h).' },
        { tex: '= \\frac{-h}{x(x + h)}', text: 'Simplify the top: x − (x + h) = x − x − h = −h. Now the whole rise is −h over x(x + h).' },
        { tex: '\\frac{1}{h} \\cdot \\frac{-h}{x(x + h)} = \\frac{-1}{x(x + h)}', text: 'Divide by h, which is the same as multiplying by 1/h. The h on top cancels the h in 1/h and leaves −1/(x(x + h)).' },
        { tex: "f'(x) = \\lim_{h \\to 0} \\frac{-1}{x(x + h)} = \\frac{-1}{x \\cdot x}", text: 'Let h → 0. The h in the bottom disappears, leaving −1/(x · x). Therefore f′(x) = −1/x².' },
      ],
      answer: "f'(x) = -\\frac{1}{x^2}",
    },
  },
  {
    kind: 'example',
    head: 'Write the tangent line',
    body: 'Write the equation of the tangent line to y = x² at x = 2. A line needs a point and a slope, so find both.',
    steps: {
      steps: [
        { tex: 'f(2) = 2^2 = 4', text: 'Find the point by plugging x = 2 into f: f(2) = 2² = 4, so the tangent touches the curve at (2, 4).' },
        { tex: "f'(x) = 2x \\ \\Rightarrow\\ f'(2) = 4", text: 'Find the slope with the derivative. Since f′(x) = 2x, the slope at x = 2 is f′(2) = 2(2) = 4.' },
        { tex: 'y - 4 = 4(x - 2)', text: 'Write point-slope form, y − y₁ = m(x − x₁), using the point (2, 4) and the slope 4.' },
        { tex: 'y = 4x - 8 + 4 = 4x - 4', text: 'Distribute the 4 to get 4x − 8, then add 4 to both sides to move it across. This gives y = 4x − 4.' },
      ],
      answer: 'y = 4x - 4',
    },
  },
  {
    kind: 'example',
    head: 'Another way: the alternate form',
    body: 'f(x) = √x. Use the alternate form to find f′(4). It lets x approach 4 directly instead of using h.',
    art: (() => {
      const ax = grid({ x: [0, 9], y: [0, 4] }, [1, 4, 9], [1, 2, 3, 4]);
      return art(
        'The curve y = root x with its tangent line at (4, 2), a shallow line of slope one quarter',
        ax.body +
          title('the tangent to √x at (4, 2) has slope 1/4') +
          ax.curve((x) => Math.sqrt(x), AMB, 2.8) +
          ax.curve(tangentLine(4, 2, 0.25), ROSE, 2.4) +
          guides(ax, 4, 2) +
          solid(ax, 4, 2, EMR) +
          lab(ax, 4.3, 1.55, '(4, 2)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 8.6, 3.6, 'slope 1/4', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'y = √x', { size: 12, fill: AMB, anchor: 'end' }),
        'Secants from (4, 2) to nearby points on the root curve have slopes 1/(√x + 2), which head to 1/4.',
      );
    })(),
    steps: {
      steps: [
        { tex: "f'(4) = \\lim_{x \\to 4} \\frac{\\sqrt{x} - 2}{x - 4}", text: 'The alternate form is the limit of (f(x) − f(a))/(x − a) as x → a. With a = 4 and f(4) = 2 this is (√x − 2)/(x − 4), and substituting gives 0/0.' },
        { tex: '\\frac{\\sqrt{x} - 2}{x - 4} \\cdot \\frac{\\sqrt{x} + 2}{\\sqrt{x} + 2} = \\frac{x - 4}{(x - 4)(\\sqrt{x} + 2)}', text: 'A root will not factor, so multiply top and bottom by the conjugate √x + 2. The top becomes x − 4, by (a − b)(a + b) = a² − b².' },
        { tex: '= \\frac{1}{\\sqrt{x} + 2}', text: 'Cancel the (x − 4) on the top and bottom, which leaves 1/(√x + 2). The 0/0 problem is gone.' },
        { tex: "f'(4) = \\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}", text: 'Substitute x = 4: 1/(√4 + 2) = 1/(2 + 2) = 1/4. So the tangent at (4, 2) has slope 1/4.' },
      ],
      answer: "f'(4) = \\tfrac{1}{4}",
    },
  },
  {
    kind: 'example',
    head: 'Average rate on an interval',
    body: 'f(x) = x² + 3x. What is the average rate of change on [1, 3]? Find the heights at the two ends, then take rise over run.',
    table: {
      head: ['x', 'x²', '3x', 'f(x)'],
      rows: [['1', '1', '3', '4'], ['3', '9', '9', '18']],
      note: 'Two rows, because an average rate needs exactly two points.',
    },
    steps: {
      steps: [
        { tex: 'f(1) = 1 + 3 = 4', text: 'Find the left endpoint height: f(1) = 1² + 3(1) = 1 + 3 = 4. This is the starting height of the secant.' },
        { tex: 'f(3) = 9 + 9 = 18', text: 'Find the right endpoint height: f(3) = 3² + 3(3) = 9 + 9 = 18. This is the ending height.' },
        { tex: '\\frac{f(3) - f(1)}{3 - 1} = \\frac{18 - 4}{2}', text: 'Average rate is rise over run: the change in f is 18 − 4, and the change in x is 3 − 1 = 2.' },
        { tex: '= \\frac{14}{2} = 7', text: 'Divide: 14/2 = 7. The average rate of change is 7, the slope of the secant line through (1, 4) and (3, 18).' },
      ],
      answer: '7',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the thrown ball',
    body: 'A ball thrown upward has height h(t) = 64t − 16t² feet after t seconds. Find the average velocity on [1, 2] and the instantaneous velocity at t = 1. Sketch the arc first: a chord gives the average, a tangent gives the instant.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [0, 70] }, [1, 2, 3, 4], [20, 40, 60], { xLabel: 't', yLabel: 'h' });
      const h = (t: number) => 64 * t - 16 * t * t;
      return art(
        'The arc of a thrown ball, h = 64t minus 16 t squared, with a dashed chord from (1, 48) to (2, 64) of slope 16 and the steeper tangent line at t = 1 of slope 32',
        ax.body +
          title('from t = 1: average 16 ft/s, instantaneous 32 ft/s') +
          ax.curve(h, AMB, 2.8) +
          ax.curve(tangentLine(1, 48, 16), SKY, 2, '5 4') +
          ax.curve(tangentLine(1, 48, 32), ROSE, 2.4) +
          solid(ax, 1, 48, EMR) +
          solid(ax, 2, 64, SKY) +
          lab(ax, 2.3, 52, 'secant slope 16', { fill: SKY, anchor: 'start' }) +
          lab(ax, 0.95, 66, 'tangent slope 32', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'h = 64t − 16t²', { size: 12, fill: AMB, anchor: 'end' }),
        'The chord from t = 1 to t = 2 rises 16 feet in 1 second. The tangent at t = 1 rises twice as fast.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'h(1) = 64 - 16 = 48,\\quad h(2) = 128 - 64 = 64', text: 'Find the heights: h(1) = 64 − 16 = 48 and h(2) = 128 − 64 = 64. These are the two points on the arc.' },
        { tex: '\\frac{64 - 48}{2 - 1} = 16\\ \\text{ft/s}', text: 'Average velocity is rise over run, the slope of the chord: (64 − 48)/(2 − 1) = 16 ft/s.' },
        { tex: 'h(1 + k) - h(1) = 64(1 + k) - 16(1 + k)^2 - 48 = 32k - 16k^2', text: 'For the instant, use the definition with a small time k after t = 1. Expand 64(1 + k) − 16(1 + k)² − 48 = 64 + 64k − 16 − 32k − 16k² − 48, which simplifies to 32k − 16k².' },
        { tex: '\\frac{32k - 16k^2}{k} = 32 - 16k', text: 'Divide by the run k to get the secant slope: factor k out of 32k − 16k² and cancel it to get 32 − 16k.' },
        { tex: "h'(1) = \\lim_{k \\to 0} (32 - 16k) = 32\\ \\text{ft/s}", text: 'Let k → 0. The 16k disappears and h′(1) = 32 ft/s. The ball is moving faster at t = 1 than its average over the second, because it is slowing down.' },
      ],
      answer: '\\text{average } 16\\ \\text{ft/s},\\quad \\text{instantaneous } 32\\ \\text{ft/s}',
    },
  },
  {
    kind: 'protip',
    head: 'Simplify before h → 0',
    body: 'The definition always starts as 0/0, so the whole game is to cancel the h on the bottom before you take the limit. Expand, subtract so the non-h terms vanish, factor h out of what is left, cancel, and only then let h → 0. Do these in order and the limit is always a simple substitution.',
    art: flow(
      [
        { label: 'expand f(x + h)', color: SKY },
        { label: 'subtract f(x)', color: AMB },
        { label: 'divide by h, cancel it', color: VIO },
        { label: 'let h → 0', color: EMR },
      ],
      { title: 'the derivative-by-definition routine', caption: 'Every term that survives the subtraction has an h in it. That is what makes the cancel step work.' },
    ),
    formula: {
      tex: '\\frac{f(x + h) - f(x)}{h} \\ \\xrightarrow{\\text{algebra}}\\ \\text{something with no } h \\text{ underneath} \\ \\xrightarrow{\\ h \\to 0\\ }\\ f\'(x)',
      note: 'If you still have h on the bottom when you take the limit, you are not done simplifying.',
      parts: [
        { sym: '2xh + h^2', means: 'what survives the subtraction for x²: every term has an h', tone: 'accent' },
        { sym: '2x + h', means: 'after cancelling: safe to set h = 0 now', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'protip',
    head: 'Tangent lines: point, then slope',
    body: 'Every tangent-line question is two lookups and one formula. Plug a into f for the point. Plug a into f′ for the slope. Write y = f(a) + f′(a)(x − a) and simplify. For y = x² at x = 3 that is y = 9 + 6(x − 3) = 6x − 9, so the tangent crosses the y-axis at −9.',
    steps: {
      steps: [
        { tex: 'f(3) = 9', text: 'Plug a = 3 into f to get the point of tangency: f(3) = 3² = 9, so the point is (3, 9).' },
        { tex: "f'(3) = 2(3) = 6", text: 'Plug a = 3 into the derivative to get the slope. Since f′(x) = 2x, f′(3) = 2(3) = 6.' },
        { tex: 'y = 9 + 6(x - 3)', text: 'Put the point and slope into point-slope form, y = f(a) + f′(a)(x − a). That gives y = 9 + 6(x − 3).' },
        { tex: 'y = 6x - 18 + 9 = 6x - 9', text: 'Distribute the 6 to get 6x − 18 and add 9, so y = 6x − 9. The y-intercept is −9, matching the body.' },
      ],
      answer: 'y = 6x - 9',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: setting h = 0 too early',
    body: 'Students write (f(x + 0) − f(x))/0 and stop, or decide the derivative is 0 because the top is 0. The 0/0 you get is the same signal as in the limits unit: simplify first. The h cancels every time, and what remains is the derivative.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\frac{f(x + 0) - f(x)}{0} = \\frac{0}{0}', lines: ['Sets h = 0 before cancelling', 'Wrong: undefined'], tone: 'bad' },
        { title: 'Actually', tex: '\\frac{2xh + h^2}{h} = 2x + h \\to 2x', lines: ['Cancel the h first', 'Then h → 0 is harmless', 'Right'], tone: 'ok' },
      ],
      note: 'h → 0 means h gets close to 0, never equal to 0. Divide by it while it is still nonzero.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: average is not instantaneous',
    body: 'The average velocity on [1, 2] was 16 ft/s and the velocity at t = 1 was 32 ft/s. Students report one when asked for the other. Average rate uses two points and a plain slope. Instantaneous rate uses a limit as the two points merge. Different questions, different numbers.',
    compare: {
      cols: [
        { title: 'Average rate', tex: '\\frac{h(2) - h(1)}{2 - 1} = 16', lines: ['Two points', 'Secant slope', 'An interval'], tone: 'accent' },
        { title: 'Instantaneous rate', tex: "h'(1) = 32", lines: ['One point', 'Tangent slope', 'An instant'], tone: 'ok' },
      ],
      note: 'If the question names an interval, it wants a secant. If it names an instant, it wants a derivative.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: a cart\'s velocity',
    body: 'A cart has position s(t) = 5t² meters after t seconds. Find its velocity at t = 2 from the definition, then write the tangent line to the position graph there. Velocity is the derivative of position.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [0, 80] }, [1, 2, 3, 4], [20, 40, 60, 80], { xLabel: 't', yLabel: 's' });
      return art(
        'The position curve s = 5 t squared with its tangent line at (2, 20), which has slope 20',
        ax.body +
          title('velocity is the slope of the tangent at t = 2') +
          ax.curve((t) => 5 * t * t, AMB, 2.8) +
          ax.curve(tangentLine(2, 20, 20), ROSE, 2.4) +
          guides(ax, 2, 20) +
          solid(ax, 2, 20, EMR) +
          lab(ax, 2.2, 14, '(2, 20)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 3.9, 46, 'slope 20 m/s', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 's = 5t²', { size: 12, fill: AMB, anchor: 'end' }),
        'At t = 2 the cart is 20 m along and the position curve is climbing at 20 m per second.',
      );
    })(),
    steps: {
      steps: [
        { tex: 's(2 + h) = 5(2 + h)^2 = 5(4 + 4h + h^2) = 20 + 20h + 5h^2', text: 'Replace t by 2 + h and expand: (2 + h)² = 4 + 4h + h², and multiplying by 5 gives 20 + 20h + 5h².' },
        { tex: 's(2 + h) - s(2) = 20h + 5h^2', text: 'Subtract s(2) = 5(4) = 20. The 20\'s cancel, so the rise is 20h + 5h².' },
        { tex: '\\frac{20h + 5h^2}{h} = 20 + 5h', text: 'Divide by h to get the secant slope. Factor h out of the top, cancel it, and what remains is 20 + 5h.' },
        { tex: "s'(2) = \\lim_{h \\to 0} (20 + 5h) = 20\\ \\text{m/s}", text: 'Let h → 0. The 5h melts away, so s′(2) = 20. Velocity is the derivative of position, so the cart moves at 20 m/s at t = 2.' },
        { tex: 'y = 20 + 20(t - 2) = 20t - 20', text: 'For the tangent line, the point is (2, s(2)) = (2, 20) and the slope is 20. Point-slope gives y = 20 + 20(t − 2), which simplifies to 20t − 20.' },
      ],
      answer: "s'(2) = 20\\ \\text{m/s};\\quad y = 20t - 20",
    },
  },
  {
    kind: 'summary',
    head: 'The derivative, in one limit',
    body: 'Average rate is a secant slope: rise over run between two points. Let the second point slide into the first and the secant slopes settle on the tangent slope, the derivative. Compute it from the definition by simplifying until the h cancels, then write tangent lines with y = f(a) + f′(a)(x − a). Corners, cusps, vertical tangents and breaks are where it fails.',
    formula: {
      tex: "f'(a) = \\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h} \\qquad y = f(a) + f'(a)(x - a)",
      note: 'The definition on the left, its most common use on the right.',
      parts: [
        { sym: '\\tfrac{f(a + h) - f(a)}{h}', means: 'a secant slope: the average rate over a run of h', tone: 'accent' },
        { sym: "f'(a)", means: 'the tangent slope: the instantaneous rate at a', tone: 'ok' },
        { sym: '(a, f(a))', means: 'the point every tangent line passes through', tone: 'warn' },
      ],
    },
    table: {
      head: ['f(x)', 'f′(x) from the definition', 'Key algebra move'],
      rows: [['x²', '2x', 'expand (x + h)², cancel x²'], ['1/x', '−1/x²', 'common denominator x(x + h)'], ['√x', '1/(2√x)', 'conjugate √x + √a'], ['64t − 16t²', '64 − 32t', 'expand, every term keeps an h']],
    },
  },
];

// ---------------- CALC-6 — Derivative rules: power, product, quotient, e^x and ln x ----------------
const CALC_6: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'Derivatives without the limit',
    body: 'Last unit every derivative took a page of algebra. This unit replaces that with a handful of rules, one per shape of formula: powers, sums, products, quotients, eˣ and ln x. The derivative of x² is 2x: at every x, the slope of the parabola is read straight off the line y = 2x.',
    art: (() => {
      const ax = grid({ x: [-3, 3], y: [-6, 9] }, [-2, -1, 1, 2], [-4, 4, 8], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The parabola y = x squared and the line y = 2x on one grid; at x = 1.5 the parabola has a tangent of slope 3 and the line has height 3',
        ax.body +
          title('the slope of x² at any x is 2x') +
          ax.curve((x) => x * x, AMB, 2.8) +
          ax.curve((x) => 2 * x, SKY, 2.4) +
          ax.curve((x) => (x > 0.6 && x < 2.4 ? 2.25 + 3 * (x - 1.5) : NaN), ROSE, 2.4) +
          solid(ax, 1.5, 2.25, EMR) +
          solid(ax, 1.5, 3, SKY) +
          lab(ax, 1.1, 3.4, 'slope 3', { fill: ROSE, anchor: 'end' }) +
          lab(ax, 1.75, 2.0, 'height 3', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = x²', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, "y′ = 2x", { size: 12, fill: SKY, anchor: 'end' }),
        'Wherever you stand on the parabola, the line y = 2x tells you how steep it is there.',
      );
    })(),
    formula: {
      tex: '\\frac{d}{dx}\\, x^n = n\\,x^{n - 1}',
      note: 'The power rule: bring the exponent down in front, then lower the exponent by one.',
      parts: [
        { sym: 'n', means: 'the old exponent, which becomes the new coefficient', tone: 'accent' },
        { sym: 'n - 1', means: 'the new exponent: one less than before', tone: 'warn' },
        { sym: 'x^2 \\to 2x^1', means: 'the parabola\'s slope line, as promised', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The power rule',
    body: 'd/dx of xⁿ is n·xⁿ⁻¹ for any real exponent n, not just whole numbers. Rewrite roots and reciprocals as powers first: √x = x^(1/2) and 1/x² = x⁻². For x³ the derivative is 3x², so at x = 1 the cubic has slope 3, exactly the height of 3x² there.',
    why: 'Expand (x + h)³ and the rise over x³ is 3x²h + 3xh² + h³. Dividing by h leaves 3x² + 3xh + h², and letting h → 0 kills everything but 3x². The exponent comes down as a count of which of the three factors grows, and one power of x is used up.',
    art: (() => {
      const ax = grid({ x: [-2, 2], y: [-4, 8] }, [-1, 1], [-2, 4, 8], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The cubic y = x cubed with its tangent at (1, 1) of slope 3, and the parabola y = 3x squared passing through (1, 3)',
        ax.body +
          title('x³ has slope 3 at x = 1, and 3x² has height 3 there') +
          ax.curve((x) => x * x * x, AMB, 2.8) +
          ax.curve((x) => 3 * x * x, SKY, 2.2) +
          ax.curve((x) => (x > 0.3 && x < 1.7 ? 1 + 3 * (x - 1) : NaN), ROSE, 2.4) +
          solid(ax, 1, 1, EMR) +
          solid(ax, 1, 3, SKY) +
          lab(ax, 1.15, 0.3, 'slope 3', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 1.15, 3.3, 'value 3', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = x³', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, "y′ = 3x²", { size: 12, fill: SKY, anchor: 'end' }),
        'The derivative is itself a function: 3x² reports the slope of x³ at every x at once.',
      );
    })(),
    formula: {
      tex: '\\frac{d}{dx}\\, x^3 = 3x^2 \\qquad \\frac{d}{dx}\\, x^{1/2} = \\tfrac{1}{2}x^{-1/2} \\qquad \\frac{d}{dx}\\, x^{-2} = -2x^{-3}',
      note: 'Same rule three times. Negative and fractional exponents follow it exactly.',
      parts: [
        { sym: 'x^{1/2} = \\sqrt{x}', means: 'a root is a fractional power', tone: 'accent' },
        { sym: 'x^{-2} = \\tfrac{1}{x^2}', means: 'a reciprocal is a negative power', tone: 'warn' },
        { sym: '-2x^{-3} = -\\tfrac{2}{x^3}', means: 'subtracting 1 from −2 gives −3', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Constants, multiples and sums',
    body: 'A constant has slope 0, so it differentiates to 0. A constant multiple rides along: (3x⁴)′ = 3 · 4x³. A sum differentiates term by term. Together: (3x⁴ − 2x + 7)′ = 12x³ − 2 + 0. In the picture, the flat line y = 7 has slope 0 and the line −2x + 7 has slope −2 everywhere.',
    why: 'A constant never changes, so its rise is 0 and its slope is 0. A multiple stretches the graph vertically, which stretches every slope by the same factor. A sum\'s rise is the two rises added together, so the slopes add too. That lets you handle each term alone.',
    art: (() => {
      const ax = grid({ x: [-1, 5], y: [-2, 10] }, [1, 2, 3, 4], [4, 8], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The flat line y = 7 and the falling line y = minus 2x plus 7 on one grid, labelled slope 0 and slope minus 2',
        ax.body +
          title('a constant is flat; a line keeps its slope') +
          ax.curve(() => 7, EMR, 2.6) +
          ax.curve((x) => -2 * x + 7, SKY, 2.6) +
          lab(ax, 4.6, 7.7, 'slope 0', { fill: EMR, anchor: 'end' }) +
          lab(ax, 3.3, 1.8, 'slope −2', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = 7', { size: 12, fill: EMR, anchor: 'end' }) +
          text(W - 24, 57, 'y = −2x + 7', { size: 12, fill: SKY, anchor: 'end' }),
        'The +7 shifts a graph up but adds no steepness, so it contributes 0 to the derivative. The −2x contributes −2.',
      );
    })(),
    formula: {
      tex: '(c)\' = 0 \\qquad (c\\,f)\' = c\\,f\' \\qquad (f + g)\' = f\' + g\'',
      note: 'These three let you differentiate any polynomial one term at a time.',
      parts: [
        { sym: '(7)\' = 0', means: 'constants vanish', tone: 'plain' },
        { sym: '(3x^4)\' = 3 \\cdot 4x^3 = 12x^3', means: 'the 3 waits while the power rule works', tone: 'accent' },
        { sym: '(-2x)\' = -2', means: 'x¹ differentiates to 1, times the coefficient', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The product rule',
    body: 'The derivative of a product is NOT the product of the derivatives. Picture a rectangle with sides f and g. When both sides grow a little, the new area comes from two strips: one of width Δf and height g, the other of width f and height Δg. So (fg)′ = f′g + fg′: each factor takes a turn being differentiated while the other waits.',
    why: 'The area grows by two long strips and one tiny corner of size Δf·Δg. The corner is so small that dividing by Δx and letting Δx → 0 sends it to 0, which is why only the two strips survive. Check with x · x: 1·x + x·1 = 2x, the derivative of x².',
    art: areaModel(
      [{ label: 'f', w: 5 }, { label: 'Δf', w: 1 }],
      [{ label: 'g', h: 3 }, { label: 'Δg', h: 1 }],
      [['f · g', 'Δf · g'], ['f · Δg', 'tiny']],
      { title: 'a rectangle f by g, growing on two sides', total: 'new area ≈ Δf · g + f · Δg', caption: 'The two strips are the two terms of the product rule. The corner piece Δf · Δg is too small to matter in the limit.' },
    ),
    formula: {
      tex: '(f\\,g)\' = f\'\\,g + f\\,g\'',
      note: 'Derivative of the first times the second, plus the first times the derivative of the second.',
      parts: [
        { sym: 'f\'\\,g', means: 'the strip where f changed and g stayed put', tone: 'accent' },
        { sym: 'f\\,g\'', means: 'the strip where g changed and f stayed put', tone: 'ok' },
        { sym: 'f\'\\,g\'', means: 'NOT the answer: that is only the vanishing corner', tone: 'bad' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The quotient rule',
    body: 'For a fraction f/g the derivative is (f′g − fg′)/g²: top-prime times bottom, minus top times bottom-prime, all over the bottom squared. The order in the subtraction matters. For y = x/(x² + 1) the rule gives y′ = (1 − x²)/(x² + 1)², which is 0 at x = 1 and x = −1, exactly where the graph has its peak and its valley.',
    why: 'Write f/g as f times 1/g and use the product rule. The derivative of 1/g is −g′/g², so the total is f′/g − fg′/g². Putting both terms over the common denominator g² gives (f′g − fg′)/g². That explains why the bottom is squared and why the order of subtraction matters.',
    art: (() => {
      const ax = grid({ x: [-4, 4], y: [-1, 1] }, [-2, 2], [-0.5, 0.5], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => x / (x * x + 1);
      return art(
        'The S-shaped curve y = x over (x squared plus 1) with horizontal dashed tangents at its peak (1, 0.5) and its valley (minus 1, minus 0.5)',
        ax.body +
          title('the derivative is 0 at the peak and the valley') +
          ax.curve(f, AMB, 2.8) +
          line(ax.X(0.3), ax.Y(0.5), ax.X(1.7), ax.Y(0.5), ROSE, 2, '5 4') +
          line(ax.X(-1.7), ax.Y(-0.5), ax.X(-0.3), ax.Y(-0.5), ROSE, 2, '5 4') +
          solid(ax, 1, 0.5, EMR) +
          solid(ax, -1, -0.5, EMR) +
          lab(ax, 1.3, 0.75, '(1, 0.5): slope 0', { fill: ROSE, anchor: 'start' }) +
          lab(ax, -1.3, -0.75, '(−1, −0.5): slope 0', { fill: ROSE, anchor: 'end' }) +
          text(W - 24, 40, 'y = x/(x² + 1)', { size: 12, fill: AMB, anchor: 'end' }),
        'Flat tangents where 1 − x² = 0. The quotient rule found both turning points.',
      );
    })(),
    formula: {
      tex: '\\left(\\frac{f}{g}\\right)\' = \\frac{f\'\\,g - f\\,g\'}{g^2}',
      note: 'Say it as a chant: "low d-high minus high d-low, over low squared."',
      parts: [
        { sym: 'f\'\\,g', means: 'low d-high: the bottom times the derivative of the top, first', tone: 'accent' },
        { sym: '-\\,f\\,g\'', means: 'minus high d-low: the top times the derivative of the bottom', tone: 'warn' },
        { sym: 'g^2', means: 'the bottom squared, never differentiated', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'eˣ and ln x',
    body: 'Two facts carry every exponential and logarithm rule later on. d/dx of eˣ is eˣ: the curve\'s slope at any point equals its height, so at (0, 1) the slope is 1. And d/dx of ln x is 1/x: at (1, 0) the slope is 1/1 = 1. The two tangent lines in the picture are mirror images, like the curves themselves.',
    why: 'The number e is the one base whose curve has slope exactly 1 where it crosses the y-axis, at height 1. Every other point is just a rescaled copy, so the slope equals the height everywhere. The log is the mirror image across y = x, which turns a slope m into 1/m: at (1, 0) the slope is 1.',
    art: (() => {
      const ax = grid({ x: [-2, 4], y: [-2, 4] }, [-1, 1, 2, 3], [-1, 1, 2, 3], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The curves y = e to the x and y = natural log of x with their tangent lines at (0, 1) and (1, 0), both of slope 1',
        ax.body +
          title('eˣ has slope 1 at (0, 1); ln x has slope 1 at (1, 0)') +
          ax.curve((x) => Math.exp(x), AMB, 2.8) +
          ax.curve((x) => (x <= 0.02 ? NaN : Math.log(x)), SKY, 2.8) +
          ax.curve(tangentLine(0, 1, 1), ROSE, 2, '5 4') +
          ax.curve(tangentLine(1, 0, 1), ROSE, 2, '5 4') +
          solid(ax, 0, 1, EMR) +
          solid(ax, 1, 0, EMR) +
          lab(ax, -1.9, 2.3, 'slope 1 at (0, 1)', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 3.9, -1.5, 'slope 1 at (1, 0)', { fill: ROSE, anchor: 'end' }) +
          lab(ax, 1.0, 3.5, 'y = eˣ', { fill: AMB, anchor: 'start' }) +
          lab(ax, 3.3, 1.0, 'y = ln x', { fill: SKY, anchor: 'start' }),
        'eˣ: slope equals height everywhere. ln x: slope equals 1/x, so it flattens as x grows.',
      );
    })(),
    formula: {
      tex: '\\frac{d}{dx}\\, e^x = e^x \\qquad\\qquad \\frac{d}{dx}\\, \\ln x = \\frac{1}{x}',
      note: 'The only two facts to memorize in this unit that do not come from the power rule.',
      parts: [
        { sym: 'e^x', means: 'its own derivative: slope equals height', tone: 'accent' },
        { sym: '\\tfrac{1}{x}', means: 'the slope of ln x: 1 at x = 1, 1/4 at x = 4', tone: 'ok' },
        { sym: 'x > 0', means: 'ln x only exists there, so its derivative does too', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: a polynomial',
    body: 'Differentiate f(x) = 3x⁴ − 2x + 7. A sum can be differentiated one term at a time, so pick the right rule for each piece.',
    steps: {
      steps: [
        { tex: '(3x^4)\' = 3 \\cdot 4x^{3} = 12x^3', text: 'Use the power rule on 3x⁴: bring the exponent 4 down as a multiplier, lower the exponent by one to 3, and keep the 3 in front. That gives 3 · 4x³ = 12x³.' },
        { tex: '(-2x)\' = -2 \\cdot 1x^{0} = -2', text: 'Differentiate −2x, which is −2x¹. The power rule brings down the 1 and leaves x⁰ = 1, so the result is just −2, the slope of the line.' },
        { tex: '(7)\' = 0', text: 'A constant like 7 never changes, so its slope is 0 and the whole term vanishes.' },
        { tex: 'f\'(x) = 12x^3 - 2 + 0', text: 'Add the pieces back together, which the sum rule allows: 12x³ − 2 + 0 = 12x³ − 2.' },
      ],
      answer: 'f\'(x) = 12x^3 - 2',
    },
  },
  {
    kind: 'example',
    head: 'Roots and reciprocals',
    body: 'Differentiate √x and 1/x². Neither looks like a power yet, so rewrite them as powers first.',
    table: {
      head: ['Original', 'As a power', 'Power rule', 'Cleaned up'],
      rows: [['√x', 'x^(1/2)', '(1/2)x^(−1/2)', '1/(2√x)'], ['1/x²', 'x⁻²', '−2x⁻³', '−2/x³'], ['1/x', 'x⁻¹', '−1x⁻²', '−1/x²']],
      mark: 1,
      note: 'The last row matches the limit-definition answer from the previous unit. The rule and the definition agree.',
    },
    steps: {
      steps: [
        { tex: '\\sqrt{x} = x^{1/2}', text: 'A square root is a power of one half, so write √x = x^(1/2). Now the power rule applies.' },
        { tex: '\\tfrac{1}{2} x^{1/2 - 1} = \\tfrac{1}{2} x^{-1/2} = \\frac{1}{2\\sqrt{x}}', text: 'Apply the power rule: bring down 1/2 and lower the exponent by 1 to −1/2. Then rewrite the negative exponent as a reciprocal root, giving 1/(2√x).' },
        { tex: '\\frac{1}{x^2} = x^{-2}', text: 'A reciprocal moves a power to the bottom, so 1/x² = x⁻². The exponent is now a negative number, which the power rule accepts.' },
        { tex: '-2 x^{-2 - 1} = -2x^{-3} = -\\frac{2}{x^3}', text: 'Apply the power rule: bring down −2 and lower the exponent by 1, since −2 − 1 = −3. Then rewrite x⁻³ as 1/x³ to get −2/x³.' },
      ],
      answer: '\\frac{1}{2\\sqrt{x}} \\quad\\text{and}\\quad -\\frac{2}{x^3}',
    },
  },
  {
    kind: 'example',
    head: 'Product rule: x²eˣ',
    body: 'Differentiate y = x²eˣ. Two functions are multiplied here, not a single power, so you need the product rule.',
    steps: {
      steps: [
        { tex: 'f = x^2,\\quad g = e^x', text: 'The expression is x² times eˣ, so it is a product. Name f = x² and g = eˣ so each can be differentiated on its own.' },
        { tex: 'f\' = 2x,\\quad g\' = e^x', text: 'Differentiate each factor separately: f′ = 2x by the power rule, and g′ = eˣ because eˣ is its own derivative.' },
        { tex: 'y\' = f\'g + fg\' = 2x \\cdot e^x + x^2 \\cdot e^x', text: 'Use the product rule (fg)′ = f′g + fg′, so each factor takes a turn being differentiated while the other waits: 2x · eˣ + x² · eˣ.' },
        { tex: '= x e^x (2 + x)', text: 'Both terms contain x·eˣ, so factor it out to get x·eˣ(2 + x). This step is optional, but it makes the answer shorter and easier to set equal to zero.' },
      ],
      answer: 'y\' = 2x e^x + x^2 e^x',
    },
  },
  {
    kind: 'example',
    head: 'Quotient rule: x/(x² + 1)',
    body: 'Differentiate y = x/(x² + 1). A fraction with x on both top and bottom calls for the quotient rule.',
    steps: {
      steps: [
        { tex: 'f = x,\\ g = x^2 + 1,\\quad f\' = 1,\\ g\' = 2x', text: 'Name the top f = x and the bottom g = x² + 1. Differentiate each: f′ = 1 by the power rule, and g′ = 2x.' },
        { tex: 'y\' = \\frac{f\'g - fg\'}{g^2} = \\frac{1 \\cdot (x^2 + 1) - x \\cdot 2x}{(x^2 + 1)^2}', text: 'Use the quotient rule, low d-high minus high d-low over low squared. That is (f′g − fg′)/g², which here is (1·(x² + 1) − x·2x)/(x² + 1)².' },
        { tex: '= \\frac{x^2 + 1 - 2x^2}{(x^2 + 1)^2}', text: 'Multiply out the top: 1·(x² + 1) = x² + 1, and x·2x = 2x². So the top is x² + 1 − 2x².' },
        { tex: '= \\frac{1 - x^2}{(x^2 + 1)^2}', text: 'Combine like terms: x² − 2x² = −x², so the top is 1 − x². The bottom stays as (x² + 1)².' },
      ],
      answer: 'y\' = \\frac{1 - x^2}{(x^2 + 1)^2}',
    },
  },
  {
    kind: 'example',
    head: 'Tangent to ln x at x = 1',
    body: 'Find the tangent line to y = ln x at x = 1. A tangent needs a point and a slope, so get the point from ln and the slope from its derivative.',
    art: (() => {
      const ax = grid({ x: [0, 5], y: [-2, 3] }, [1, 2, 3, 4], [-1, 1, 2], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The curve y = natural log of x with its tangent line y = x minus 1 touching it at (1, 0)',
        ax.body +
          title('the tangent to ln x at (1, 0) is y = x − 1') +
          ax.curve((x) => (x <= 0.02 ? NaN : Math.log(x)), AMB, 2.8) +
          ax.curve(tangentLine(1, 0, 1), ROSE, 2.4) +
          solid(ax, 1, 0, EMR) +
          lab(ax, 1.2, -0.45, '(1, 0)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 3.9, 2.4, 'y = x − 1', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = ln x', { size: 12, fill: AMB, anchor: 'end' }),
        'ln x crosses the x-axis at 1 with slope 1/1 = 1, so its tangent there is the 45-degree line through (1, 0).',
      );
    })(),
    steps: {
      steps: [
        { tex: '\\ln 1 = 0', text: 'Find the point by plugging x = 1 into ln x. Since ln 1 = 0, the tangent touches the curve at (1, 0).' },
        { tex: 'y\' = \\frac{1}{x} \\ \\Rightarrow\\ y\'(1) = 1', text: 'The derivative of ln x is 1/x, so the slope at x = 1 is 1/1 = 1, a 45-degree line.' },
        { tex: 'y - 0 = 1 \\cdot (x - 1)', text: 'Write point-slope form, y − y₁ = m(x − x₁), with the point (1, 0) and slope 1: y − 0 = 1(x − 1).' },
        { tex: 'y = x - 1', text: 'Simplify by dropping the − 0 and the 1 in front: y = x − 1. This is the tangent line.' },
      ],
      answer: 'y = x - 1',
    },
  },
  {
    kind: 'example',
    head: 'Another way: rewrite instead of the quotient rule',
    body: 'h(x) = (2x + 1)/x. Find h′(1). The quotient rule works, but the bottom is a single term, so splitting the fraction may be faster.',
    steps: {
      steps: [
        { tex: 'h(x) = \\frac{2x + 1}{x} = \\frac{2x}{x} + \\frac{1}{x} = 2 + x^{-1}', text: 'Because the bottom is one term, split the fraction into 2x/x + 1/x. The first piece simplifies to 2 and 1/x = x⁻¹, so h = 2 + x⁻¹.' },
        { tex: 'h\'(x) = 0 + (-1)x^{-2} = -\\frac{1}{x^2}', text: 'Differentiate term by term. The constant 2 goes to 0, and the power rule on x⁻¹ gives −1 · x⁻², which is −1/x².' },
        { tex: '\\text{check: } \\frac{2 \\cdot x - (2x + 1) \\cdot 1}{x^2} = \\frac{-1}{x^2}', text: 'Check with the quotient rule: (2·x − (2x + 1)·1)/x² = −1/x². It lands in the same place, so the shortcut agrees.' },
        { tex: 'h\'(1) = -\\frac{1}{1^2} = -1', text: 'Substitute x = 1 into −1/x²: −1/1² = −1. So h′(1) = −1.' },
      ],
      answer: 'h\'(1) = -1',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: mug revenue',
    body: 'A shop sells q(t) = 100 + 10t mugs per day at price p(t) = 20 − t dollars, t days after launch. Revenue is R = p · q. How fast is revenue changing on day 2? Sketch revenue over time: it is a falling price times rising sales, so use the product rule.',
    art: (() => {
      const ax = grid({ x: [0, 10], y: [1800, 2400] }, [2, 4, 6, 8, 10], [2000, 2200, 2400], { xLabel: 't', yLabel: '$' });
      const R = (t: number) => (20 - t) * (100 + 10 * t);
      return art(
        'The revenue curve R = (20 minus t)(100 plus 10t) rising to a peak near day 5, with the tangent line at day 2 of slope 60 dollars per day',
        ax.body +
          title('revenue on day 2 is rising at $60 per day') +
          ax.curve(R, AMB, 2.8) +
          ax.curve(tangentLine(2, 2160, 60), ROSE, 2.4) +
          solid(ax, 2, 2160, EMR) +
          lab(ax, 2.2, 2105, '(2, $2160)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 4.6, 2340, 'slope $60/day', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'R = (20 − t)(100 + 10t)', { size: 12, fill: AMB, anchor: 'end' }),
        'On day 2 the price is $18 and sales are 120 mugs: revenue $2160, climbing $60 a day.',
      );
    })(),
    table: {
      head: ['Day t', 'price p', 'mugs q', 'revenue R'],
      rows: [['0', '20', '100', '2000'], ['2', '18', '120', '2160'], ['5', '15', '150', '2250'], ['8', '12', '180', '2160']],
      mark: 1,
      note: 'Revenue climbs early and falls later. The derivative on day 2 says how fast it is climbing right then.',
    },
    steps: {
      steps: [
        { tex: 'p\' = -1,\\quad q\' = 10', text: 'Differentiate each factor: p′ = −1 because the price falls $1 a day, and q′ = 10 because sales rise 10 mugs a day.' },
        { tex: 'p(2) = 18,\\quad q(2) = 120', text: 'Find the values on day 2: p(2) = 20 − 2 = 18 dollars and q(2) = 100 + 20 = 120 mugs.' },
        { tex: 'R\' = p\'q + pq\'', text: 'Revenue is a product p · q, so use the product rule R′ = p′q + pq′. Each factor takes a turn being differentiated.' },
        { tex: 'R\'(2) = (-1)(120) + (18)(10) = -120 + 180', text: 'Substitute: p′q = (−1)(120) = −120 is the loss from the price cut on 120 mugs, and pq′ = (18)(10) = 180 is the gain from 10 more mugs at $18 each.' },
        { tex: '= 60', text: 'Add them: −120 + 180 = 60. Revenue is rising by $60 per day on day 2.' },
      ],
      answer: '\\$60\\ \\text{per day}',
    },
  },
  {
    kind: 'protip',
    head: 'Rewrite before you differentiate',
    body: 'Most "hard" derivatives are easy ones in disguise. Turn roots into fractional powers, reciprocals into negative powers, and split a fraction with a one-term bottom. Spend ten seconds rewriting and the power rule does the rest.',
    compare: {
      cols: [
        { title: 'Roots', tex: '\\sqrt{x} = x^{1/2},\\ \\sqrt[3]{x} = x^{1/3}', lines: ['Fractional powers', 'Then the power rule'], tone: 'accent' },
        { title: 'Reciprocals', tex: '\\tfrac{1}{x^2} = x^{-2},\\ \\tfrac{3}{x} = 3x^{-1}', lines: ['Negative powers', 'Then the power rule'], tone: 'ok' },
        { title: 'One-term bottoms', tex: '\\tfrac{2x + 1}{x} = 2 + x^{-1}', lines: ['Split the fraction', 'No quotient rule needed'], tone: 'warn' },
      ],
      note: 'Save the quotient rule for bottoms with two or more terms, like x² + 1.',
    },
  },
  {
    kind: 'protip',
    head: 'Say the quotient rule out loud',
    body: 'The quotient rule is the one students scramble, so attach words to it. "Low d-high minus high d-low, over low squared." Low is the bottom, high is the top, and d means differentiate. Saying it in that order puts the minus sign in the right place every time.',
    formula: {
      tex: '\\left(\\frac{\\text{high}}{\\text{low}}\\right)\' = \\frac{\\text{low} \\cdot d(\\text{high}) - \\text{high} \\cdot d(\\text{low})}{\\text{low}^2}',
      note: 'For x/(x² + 1): low is x² + 1, high is x, d(high) = 1, d(low) = 2x.',
      parts: [
        { sym: '\\text{low} \\cdot d(\\text{high})', means: '(x² + 1) · 1: comes first', tone: 'accent' },
        { sym: '-\\ \\text{high} \\cdot d(\\text{low})', means: '− x · 2x: comes second, with the minus', tone: 'warn' },
        { sym: '\\text{low}^2', means: '(x² + 1)²: the bottom squared', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'trap',
    head: 'Trap: (fg)′ is not f′g′',
    body: 'It is tempting to differentiate each factor and multiply. Test it on x · x: the product is x², whose derivative is 2x. But 1 · 1 = 1, not 2x. The product rule f′g + fg′ gives 1 · x + x · 1 = 2x, which is right.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '(x \\cdot x)\' = 1 \\cdot 1 = 1', lines: ['Product of derivatives', 'Wrong: x² has slope 2x'], tone: 'bad' },
        { title: 'Actually', tex: '(x \\cdot x)\' = 1 \\cdot x + x \\cdot 1 = 2x', lines: ['Product rule', 'Matches the power rule', 'Right'], tone: 'ok' },
      ],
      note: 'Two strips, not a corner. Each factor gets its turn while the other waits.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: swapping the order in the quotient rule',
    body: 'Writing fg′ − f′g instead of f′g − fg′ flips the sign of every quotient-rule answer. For x/(x² + 1) the correct top is (x² + 1) − 2x² = 1 − x². Swapped, you get 2x² − (x² + 1) = x² − 1, the negative of the truth, and the peak at x = 1 would look like a valley.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '\\frac{f g\' - f\' g}{g^2} = \\frac{x^2 - 1}{(x^2 + 1)^2}', lines: ['Top differentiated second', 'Wrong sign everywhere'], tone: 'bad' },
        { title: 'Actually', tex: '\\frac{f\' g - f g\'}{g^2} = \\frac{1 - x^2}{(x^2 + 1)^2}', lines: ['Top differentiated first', 'Right'], tone: 'ok' },
      ],
      note: 'Check with a sign: x/(x² + 1) is increasing at x = 0, so y′(0) must be positive. 1 − 0 = 1 passes; 0 − 1 fails.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: slope and tangent in one go',
    body: 'f(x) = 4x³ − 5x. Find f′(2), then write the tangent line at x = 2. You need the derivative for the slope and the original function for the point.',
    art: (() => {
      const ax = grid({ x: [-1, 3], y: [-10, 40] }, [-1, 1, 2, 3], [10, 20, 30, 40], { tickText: (v) => String(v).replace('-', '−') });
      return art(
        'The cubic y = 4x cubed minus 5x with its steep tangent line at (2, 22), slope 43',
        ax.body +
          title('f′(2) = 43: the tangent at (2, 22)') +
          ax.curve((x) => 4 * x * x * x - 5 * x, AMB, 2.8) +
          ax.curve(tangentLine(2, 22, 43), ROSE, 2.4) +
          guides(ax, 2, 22) +
          solid(ax, 2, 22, EMR) +
          lab(ax, 1.85, 24, '(2, 22)', { fill: EMR, anchor: 'end' }) +
          lab(ax, 2.45, 32, 'slope 43', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = 4x³ − 5x', { size: 12, fill: AMB, anchor: 'end' }),
        'At x = 2 the cubic is climbing 43 units of height per unit of x, so its tangent is nearly vertical on this grid.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'f\'(x) = 4 \\cdot 3x^2 - 5 = 12x^2 - 5', text: 'Differentiate term by term with the power rule: 4x³ gives 4 · 3x² = 12x², and −5x gives −5. So f′(x) = 12x² − 5.' },
        { tex: 'f\'(2) = 12(4) - 5 = 48 - 5 = 43', text: 'Substitute x = 2 into f′: 12(4) − 5 = 48 − 5 = 43. That is the slope of the tangent.' },
        { tex: 'f(2) = 4(8) - 5(2) = 32 - 10 = 22', text: 'Substitute x = 2 into f (not f′) to find the height: 4(8) − 5(2) = 32 − 10 = 22. The tangent touches the curve at (2, 22).' },
        { tex: 'y = 22 + 43(x - 2)', text: 'Write point-slope form with the point (2, 22) and slope 43: y = 22 + 43(x − 2).' },
        { tex: 'y = 43x - 86 + 22 = 43x - 64', text: 'Distribute the 43 to get 43x − 86, then add 22. That gives y = 43x − 64.' },
      ],
      answer: 'f\'(2) = 43;\\quad y = 43x - 64',
    },
  },
  {
    kind: 'summary',
    head: 'One rule per shape',
    body: 'Power rule for xⁿ, with roots and reciprocals rewritten as powers first. Constants vanish, multiples ride along, sums split term by term. Products use f′g + fg′, quotients use (f′g − fg′)/g², and the two special facts are (eˣ)′ = eˣ and (ln x)′ = 1/x. Look at the shape of the formula, pick the rule, and the limit is already done for you.',
    table: {
      head: ['Shape', 'Rule', 'Example'],
      rows: [['xⁿ', 'n xⁿ⁻¹', '(3x⁴)′ = 12x³'], ['f · g', 'f′g + fg′', '(x²eˣ)′ = 2xeˣ + x²eˣ'], ['f / g', '(f′g − fg′)/g²', '(x/(x² + 1))′ = (1 − x²)/(x² + 1)²'], ['eˣ, ln x', 'eˣ, 1/x', 'slope of ln x at 4 is 1/4']],
    },
    formula: {
      tex: '(x^n)\' = n x^{n-1} \\quad (fg)\' = f\'g + fg\' \\quad \\left(\\tfrac{f}{g}\\right)\' = \\tfrac{f\'g - fg\'}{g^2} \\quad (e^x)\' = e^x \\quad (\\ln x)\' = \\tfrac{1}{x}',
      note: 'The whole unit on one line.',
      parts: [
        { sym: 'n x^{n-1}', means: 'exponent down in front, exponent minus one', tone: 'accent' },
        { sym: 'f\'g + fg\'', means: 'each factor takes a turn', tone: 'ok' },
        { sym: 'f\'g - fg\'', means: 'top first, then minus', tone: 'warn' },
      ],
    },
  },
];

// ---------------- CALC-7 — The chain rule and trig derivatives ----------------
const CALC_7: LessonSlide[] = [
  {
    kind: 'objective',
    head: 'A function inside a function',
    body: 'sin(3x), (2x + 1)³ and e^(x²) are all one machine feeding another: an inner function g runs first, and an outer function f acts on its output. The chain rule differentiates the whole chain by multiplying the slopes of the two machines. Along the way you will learn the derivatives of all six trig functions.',
    art: machine('x', 'g then f', 'f(g(x))', { title: 'two machines bolted together', caption: 'x goes into g; what comes out goes into f. The chain rule multiplies the two slopes.' }),
    formula: {
      tex: "\\frac{d}{dx}\\, f(g(x)) = f'(g(x)) \\cdot g'(x)",
      note: 'Differentiate the outside, keep the inside exactly as it was, then multiply by the derivative of the inside.',
      parts: [
        { sym: "f'(g(x))", means: 'the outer derivative, with the inner function still sitting inside it', tone: 'accent' },
        { sym: "g'(x)", means: 'the inner derivative: the factor students forget', tone: 'warn' },
        { sym: '\\cdot', means: 'multiply, because the slopes stack', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Spot the layers',
    body: 'Before differentiating, name the layers from the outside in. In sin(3x) the outer layer is sine and the inner layer is 3x. In (2x + 1)³ the outer layer is the cube and the inner layer is 2x + 1. Ask: if I plugged in a number, what would I compute last? That last operation is the outer layer.',
    why: 'A composite is a chain of operations done one after another, so the derivative has to undo that order, from the last operation back to the first. Ask what you would compute last for a specific number: for sin(3x) at x = 2, you find 3x = 6 first and sin 6 last, so sine is the outer layer.',
    art: flow(
      [
        { label: 'x', color: SKY },
        { label: '× 2, then + 1', color: AMB },
        { label: 'cube it', color: EMR },
      ],
      { title: 'the layers of (2x + 1)³', horizontal: true, caption: 'Inner layer first: double and add one. Outer layer last: cube. The chain rule peels them in reverse.' },
    ),
    compare: {
      cols: [
        { title: 'sin(3x)', tex: '\\sin(\\underbrace{3x}_{\\text{inner}})', lines: ['Outer: sin', 'Inner: 3x', 'Inner derivative: 3'], tone: 'accent' },
        { title: '(2x + 1)³', tex: '(\\underbrace{2x + 1}_{\\text{inner}})^3', lines: ['Outer: cube', 'Inner: 2x + 1', 'Inner derivative: 2'], tone: 'ok' },
        { title: 'e^(x²)', tex: 'e^{\\overbrace{x^2}^{\\text{inner}}}', lines: ['Outer: eᵘ', 'Inner: x²', 'Inner derivative: 2x'], tone: 'warn' },
      ],
      note: 'The inner layer is whatever sits where a plain x would be in the basic function.',
    },
  },
  {
    kind: 'concept',
    head: 'Why the slopes multiply',
    body: 'Compare sin x with sin(3x). The inner 3x runs through its values three times as fast, so the wave is squeezed to a third of the width and every slope is three times steeper. At x = 0, sin x has slope 1 and sin(3x) has slope 3. The outer derivative cos(3x) gives the shape of the slope; the inner derivative 3 gives the scale.',
    why: 'Rates multiply along a chain, like gears. If x moves 1 unit, u = 3x moves 3 units, and sine changes by cos u for each unit of u, so sine changes by cos u times 3 for each unit of x. A 3-to-1 first gear times the second gear\'s ratio gives the total ratio.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [-1.5, 1.5] }, [1, 2, 3, 4], [-1, 1], { tickText: (v, a) => (a === 'x' ? qt(v) : String(v).replace('-', '−')) });
      return art(
        'The sine wave and the squeezed wave sine of 3x on one grid, with short tangent segments at the origin of slope 1 and slope 3',
        ax.body +
          title('the inner 3 makes every slope three times steeper') +
          ax.curve((u) => qsin(u), AMB, 2.8) +
          ax.curve((u) => qsin(3 * u), SKY, 2.2) +
          ax.curve((u) => (u < 0.5 ? (Math.PI / 2) * u : NaN), ROSE, 2.4) +
          ax.curve((u) => (u < 0.3 ? 3 * (Math.PI / 2) * u : NaN), ROSE, 2.4) +
          lab(ax, 0.45, 1.35, 'slope 3', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 0.75, 0.45, 'slope 1', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = sin x', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'y = sin 3x', { size: 12, fill: SKY, anchor: 'end' }),
        'Three full waves of sin 3x fit in one wave of sin x, so sin 3x is three times as steep everywhere.',
      );
    })(),
    formula: {
      tex: '\\frac{d}{dx}\\, \\sin(3x) = \\cos(3x) \\cdot 3 = 3\\cos(3x)',
      note: 'Outer derivative cos, inside kept as 3x, times the inner derivative 3.',
      parts: [
        { sym: '\\cos(3x)', means: 'the outer derivative with the inside untouched', tone: 'accent' },
        { sym: '3', means: 'the inner derivative: how fast 3x changes', tone: 'warn' },
        { sym: '3\\cos(0) = 3', means: 'at x = 0: three times the slope of plain sine', tone: 'ok' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The general power, exponential and log rules',
    body: 'Three patterns cover most chain-rule problems. General power: (uⁿ)′ = n·uⁿ⁻¹·u′. General exponential: (eᵘ)′ = eᵘ·u′. General log: (ln u)′ = u′/u. Each is the plain rule with u in place of x and an extra factor of u′. For ln(x² + 1), u = x² + 1 and u′ = 2x, so the slope at x = 1 is 2/(1 + 1) = 1.',
    why: 'Each rule is just the chain rule with a particular outer function. For uⁿ the outer derivative is n·uⁿ⁻¹, for eᵘ it is eᵘ, and for ln u it is 1/u, and the extra factor u′ is the inner derivative. Check ln(x² + 1): outer 1/(x² + 1) times inner 2x gives 2x/(x² + 1).',
    art: (() => {
      const ax = grid({ x: [-3, 3], y: [-1, 3] }, [-2, -1, 1, 2], [1, 2, 3], { tickText: (v) => String(v).replace('-', '−') });
      const f = (x: number) => Math.log(x * x + 1);
      return art(
        'The U-shaped curve y = natural log of (x squared plus 1) with its tangent at (1, ln 2) of slope 1',
        ax.body +
          title('the slope of ln(x² + 1) at x = 1 is 2·1/(1 + 1) = 1') +
          ax.curve(f, AMB, 2.8) +
          ax.curve(tangentLine(1, Math.LN2, 1), ROSE, 2.4) +
          solid(ax, 1, Math.LN2, EMR) +
          lab(ax, 1.2, 0.35, '(1, ln 2)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 2.4, 1.6, 'slope 1', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'y = ln(x² + 1)', { size: 12, fill: AMB, anchor: 'end' }),
        'u′/u with u = x² + 1: the slope is 2x/(x² + 1), which equals 1 at x = 1.',
      );
    })(),
    formula: {
      tex: "(u^n)' = n\\,u^{n-1}\\,u' \\qquad (e^u)' = e^u\\,u' \\qquad (\\ln u)' = \\frac{u'}{u}",
      note: 'Same as the plain rules, with the inside kept and an inner derivative multiplied on.',
      parts: [
        { sym: 'n\\,u^{n-1}\\,u\'', means: '(2x + 1)³ → 3(2x + 1)² · 2', tone: 'accent' },
        { sym: 'e^u\\,u\'', means: 'e^(x²) → e^(x²) · 2x', tone: 'ok' },
        { sym: '\\tfrac{u\'}{u}', means: 'ln(x² + 1) → 2x/(x² + 1)', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'The six trig derivatives',
    body: 'In radians: sin → cos, cos → −sin, tan → sec², sec → sec·tan, csc → −csc·cot, cot → −csc². The picture shows the first one: wherever sin x is climbing, cos x is positive; where sin x peaks, cos x is 0; where sin x falls, cos x is negative. The slope of sine IS cosine. Every "co" function picks up a minus sign.',
    why: 'The tan, sec, csc and cot rules follow from sine and cosine with the quotient rule. For example, tan x = sin x/cos x gives (cos x · cos x − sin x · (−sin x))/cos²x = 1/cos²x = sec²x. The minus signs on the co-functions appear because cosine falls where sine rises.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [-1.5, 1.5] }, [1, 2, 3, 4], [-1, 1], { tickText: (v, a) => (a === 'x' ? qt(v) : String(v).replace('-', '−')) });
      return art(
        'The sine and cosine waves on one grid, with the peak of sine at pi over 2 marked where cosine crosses zero',
        ax.body +
          title('the slope of sin x is cos x') +
          ax.curve((u) => qsin(u), AMB, 2.8) +
          ax.curve((u) => qcos(u), SKY, 2.4) +
          line(ax.X(0.6), ax.Y(1), ax.X(1.4), ax.Y(1), ROSE, 2, '5 4') +
          solid(ax, 1, 1, EMR) +
          solid(ax, 1, 0, SKY) +
          lab(ax, 1.05, 1.3, 'sin peaks: slope 0', { fill: ROSE, anchor: 'start' }) +
          lab(ax, 1.15, -0.6, 'cos = 0 here', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = sin x', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, 'y = cos x', { size: 12, fill: SKY, anchor: 'end' }),
        'At π/2 the sine wave is flat and the cosine wave is 0. Everywhere, the height of cos is the slope of sin.',
      );
    })(),
    table: {
      head: ['f(x)', 'f′(x)', 'Memory hook'],
      rows: [['sin x', 'cos x', 'sin climbs where cos is positive'], ['cos x', '−sin x', '"co" brings a minus'], ['tan x', 'sec² x', 'quotient rule on sin/cos'], ['sec x', 'sec x tan x', 'sec stays, tan joins'], ['csc x', '−csc x cot x', 'co-version of sec, with a minus'], ['cot x', '−csc² x', 'co-version of tan, with a minus']],
      note: 'Radians only. In degrees every one of these would pick up a factor of π/180.',
    },
    formula: {
      tex: "(\\sin x)' = \\cos x \\qquad (\\cos x)' = -\\sin x \\qquad (\\tan x)' = \\sec^2 x",
      note: 'The three to know cold; the other three follow the same pattern with a minus on the co-functions.',
      parts: [
        { sym: '\\sin x \\to \\cos x', means: 'the slope of sine is cosine: no sign change', tone: 'ok' },
        { sym: '\\cos x \\to -\\sin x', means: 'cosine falls just after its peak, so the minus', tone: 'warn' },
        { sym: '\\tan x \\to \\sec^2 x', means: 'always positive: tangent only ever climbs', tone: 'accent' },
      ],
    },
  },
  {
    kind: 'concept',
    head: 'Layers stack',
    body: 'A function can have three or more layers. sin²(3x) means (sin(3x))²: the outer layer is the square, the middle layer is sine, the inner layer is 3x. Peel from the outside in and multiply all three derivatives: 2 sin(3x) · cos(3x) · 3. Each layer contributes one factor.',
    why: 'The chain rule handles one pair of layers at a time, so with three layers you apply it twice: peel the outer layer, then treat the middle layer as the new outer function and peel again. Each peel leaves one factor, which is why the answer for sin²(3x) has three factors: 2 sin(3x), cos(3x) and 3.',
    art: flow(
      [
        { label: 'inner: 3x  → derivative 3', color: SKY },
        { label: 'middle: sin( )  → derivative cos( )', color: AMB },
        { label: 'outer: ( )²  → derivative 2( )', color: EMR },
      ],
      { title: 'the three layers of sin²(3x)', caption: 'Multiply the three derivatives, keeping every inside as it was: 2 sin(3x) · cos(3x) · 3.' },
    ),
    formula: {
      tex: '\\frac{d}{dx}\\, \\sin^2(3x) = \\underbrace{2\\sin(3x)}_{\\text{outer}} \\cdot \\underbrace{\\cos(3x)}_{\\text{middle}} \\cdot \\underbrace{3}_{\\text{inner}}',
      note: 'Three layers, three factors. The insides stay put at every step.',
      parts: [
        { sym: '2\\sin(3x)', means: 'derivative of the square, with sin(3x) kept inside', tone: 'accent' },
        { sym: '\\cos(3x)', means: 'derivative of sine, with 3x kept inside', tone: 'ok' },
        { sym: '3', means: 'derivative of the innermost 3x', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'example',
    head: 'Start simple: (2x + 1)³',
    body: 'Differentiate y = (2x + 1)³. A power of a bracket is a function inside a function, so use the chain rule.',
    steps: {
      steps: [
        { tex: 'u = 2x + 1,\\quad y = u^3', text: 'Name the layers. The inside is u = 2x + 1, which is computed first, and the outside is the cube y = u³, applied last.' },
        { tex: '\\frac{dy}{du} = 3u^2 = 3(2x + 1)^2', text: 'Differentiate the outer layer with the power rule, treating u like a plain variable: 3u². Keep the inside in place, so this is 3(2x + 1)².' },
        { tex: 'u\' = 2', text: 'Differentiate the inside layer: u = 2x + 1 is a line with slope 2, so the inner derivative is u′ = 2.' },
        { tex: 'y\' = 3(2x + 1)^2 \\cdot 2 = 6(2x + 1)^2', text: 'Multiply the outer derivative by the inner derivative, which is the chain rule: 3(2x + 1)² · 2 = 6(2x + 1)².' },
      ],
      answer: 'y\' = 6(2x + 1)^2',
    },
  },
  {
    kind: 'example',
    head: 'sin(3x)',
    body: 'Differentiate y = sin(3x). Sine is applied to 3x, so this is a chain, not a plain sine.',
    steps: {
      steps: [
        { tex: 'u = 3x,\\quad y = \\sin u', text: 'Name the layers. The inside is u = 3x, computed first, and the outside is y = sin u, applied last.' },
        { tex: '\\frac{dy}{du} = \\cos u = \\cos(3x)', text: 'Differentiate the outside: the derivative of sin is cos. Keep the inside in place, so the result is cos(3x), not cos x.' },
        { tex: 'u\' = 3', text: 'Differentiate the inside: u = 3x is a line with slope 3, so the inner derivative is u′ = 3.' },
        { tex: 'y\' = \\cos(3x) \\cdot 3 = 3\\cos(3x)', text: 'Multiply the two derivatives, which is the chain rule: cos(3x) · 3 = 3cos(3x). At x = 0 this slope is 3, matching the squeezed wave.' },
      ],
      answer: 'y\' = 3\\cos(3x)',
    },
  },
  {
    kind: 'example',
    head: 'e^(x²)',
    body: 'Differentiate y = e^(x²). The exponent is itself a function of x, so this is a chain.',
    steps: {
      steps: [
        { tex: 'u = x^2,\\quad y = e^u', text: 'Name the layers. The inside is u = x², computed first, and the outside is y = eᵘ, applied last.' },
        { tex: '\\frac{dy}{du} = e^u = e^{x^2}', text: 'Differentiate the outside: eᵘ is its own derivative, so it stays eᵘ. Keep the inside in place, so it is e^(x²).' },
        { tex: 'u\' = 2x', text: 'Differentiate the inside u = x² with the power rule: bring down the 2 and lower the exponent to 1, so u′ = 2x.' },
        { tex: 'y\' = e^{x^2} \\cdot 2x', text: 'Multiply the outer derivative by the inner derivative, as the chain rule says: e^(x²) · 2x = 2x·e^(x²).' },
      ],
      answer: 'y\' = 2x\\,e^{x^2}',
    },
  },
  {
    kind: 'example',
    head: 'ln(x² + 1)',
    body: 'Differentiate y = ln(x² + 1). The log is applied to x² + 1, so this is a chain.',
    steps: {
      steps: [
        { tex: 'u = x^2 + 1,\\quad y = \\ln u', text: 'Name the layers. The inside is u = x² + 1, computed first, and the outside is y = ln u, applied last.' },
        { tex: '\\frac{dy}{du} = \\frac{1}{u} = \\frac{1}{x^2 + 1}', text: 'Differentiate the outside: the derivative of ln u is 1/u. Keep the inside in place, so this is 1/(x² + 1).' },
        { tex: 'u\' = 2x', text: 'Differentiate the inside u = x² + 1 with the power rule and the constant rule: u′ = 2x + 0 = 2x.' },
        { tex: 'y\' = \\frac{1}{x^2 + 1} \\cdot 2x = \\frac{2x}{x^2 + 1}', text: 'Multiply by the chain rule: (1/(x² + 1)) · 2x = 2x/(x² + 1). This matches the shortcut (ln u)′ = u′/u.' },
      ],
      answer: 'y\' = \\frac{2x}{x^2 + 1}',
    },
  },
  {
    kind: 'example',
    head: 'cos²x',
    body: 'Differentiate y = cos²x. This means (cos x)², a square wrapped around a cosine, so there are two layers.',
    art: (() => {
      const ax = grid({ x: [0, 4], y: [-1.5, 1.5] }, [1, 2, 3, 4], [-1, 1], { tickText: (v, a) => (a === 'x' ? qt(v) : String(v).replace('-', '−')) });
      return art(
        'The hump-shaped curve y = cosine squared x and its derivative minus 2 sine x cosine x, which dips to minus 1 at pi over 4 where the hump falls fastest',
        ax.body +
          title('cos²x falls fastest at π/4, where y′ = −1') +
          ax.curve((u) => qcos(u) * qcos(u), AMB, 2.8) +
          ax.curve((u) => -2 * qsin(u) * qcos(u), SKY, 2.2) +
          solid(ax, 0.5, 0.5, EMR) +
          solid(ax, 0.5, -1, SKY) +
          lab(ax, 0.6, -1.3, 'steepest drop: −1', { fill: SKY, anchor: 'start' }) +
          text(W - 24, 40, 'y = cos²x', { size: 12, fill: AMB, anchor: 'end' }) +
          text(W - 24, 57, "y′ = −2 sin x cos x", { size: 12, fill: SKY, anchor: 'end' }),
        'Where the hump descends most steeply, at π/4, the derivative bottoms out at −2 · (√2/2)(√2/2) = −1.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'y = (\\cos x)^2,\\quad u = \\cos x', text: 'Read cos²x as (cos x)². The square is applied last, so it is the outer layer, and the inside is u = cos x.' },
        { tex: '\\frac{dy}{du} = 2u = 2\\cos x', text: 'Differentiate the outside with the power rule: u² goes to 2u. Keep the inside in place, so this is 2cos x.' },
        { tex: 'u\' = -\\sin x', text: 'Differentiate the inside: the derivative of cos x is −sin x. The minus sign belongs to cosine, so do not drop it.' },
        { tex: 'y\' = 2\\cos x \\cdot (-\\sin x) = -2\\sin x \\cos x', text: 'Multiply by the chain rule: 2cos x · (−sin x) = −2 sin x cos x. (This also equals −sin 2x.)' },
      ],
      answer: 'y\' = -2\\sin x \\cos x',
    },
  },
  {
    kind: 'example',
    head: 'Another way: a layer table',
    body: 'y = (x² + 3)⁴. Find y′ at x = 1. Instead of writing the rule, list the layers and multiply their derivatives.',
    table: {
      head: ['Layer', 'Derivative', 'Value at x = 1'],
      rows: [['outer: ( )⁴', '4( )³, inside kept', '4 · (1 + 3)³ = 4 · 64 = 256'], ['inner: x² + 3', '2x', '2 · 1 = 2'], ['product', '4(x² + 3)³ · 2x', '256 · 2 = 512']],
      mark: 2,
      note: 'One row per layer. The answer is the product of the derivative column, evaluated at the point.',
    },
    steps: {
      steps: [
        { tex: 'y\' = 4(x^2 + 3)^3 \\cdot 2x', text: 'Use the general power rule (uⁿ)′ = n·uⁿ⁻¹·u′ with u = x² + 3 and n = 4. The outer factor is 4(x² + 3)³ and the inner factor is 2x.' },
        { tex: 'x = 1:\\ 4(1 + 3)^3 \\cdot 2(1)', text: 'To evaluate at x = 1, substitute 1 into both factors. The inside becomes 1 + 3 = 4, and the inner derivative 2x becomes 2.' },
        { tex: '= 4 \\cdot 64 \\cdot 2', text: 'Cube the 4: 4³ = 4 · 4 · 4 = 64. So the expression becomes 4 · 64 · 2.' },
        { tex: '= 512', text: 'Multiply: 4 · 64 = 256, then 256 · 2 = 512. So y′(1) = 512.' },
      ],
      answer: 'y\'(1) = 512',
    },
  },
  {
    kind: 'example',
    head: 'Picture it first: the Ferris wheel',
    body: 'A Ferris wheel seat has height h(t) = 10 + 8 sin(πt/6) meters after t minutes. How fast is it rising at t = 0? Sketch the wave first: the seat starts at the midline and climbs, so expect a positive rate.',
    art: (() => {
      const ax = grid({ x: [0, 12], y: [0, 20] }, [3, 6, 9, 12], [5, 10, 15, 20], { xLabel: 't', yLabel: 'h' });
      const h = (t: number) => 10 + 8 * Math.sin((Math.PI * t) / 6);
      return art(
        'One full wave of the seat height 10 plus 8 sine of pi t over 6, from height 10 up to 18, down to 2 and back, with the tangent at t = 0 of slope about 4.19',
        ax.body +
          title('at t = 0 the seat rises 4π/3 ≈ 4.19 m per minute') +
          ax.curve(h, AMB, 2.8) +
          ax.curve(tangentLine(0, 10, (4 * Math.PI) / 3), ROSE, 2.4) +
          solid(ax, 0, 10, EMR) +
          solid(ax, 3, 18, SKY) +
          lab(ax, 0.3, 8.6, '(0, 10)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 2.6, 19.2, 'slope 4.19 m/min', { fill: ROSE, anchor: 'start' }) +
          text(W - 24, 40, 'h = 10 + 8 sin(πt/6)', { size: 12, fill: AMB, anchor: 'end' }),
        'The seat passes the hub height of 10 m at t = 0, which is where a sine wave is steepest.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'u = \\tfrac{\\pi t}{6},\\quad h = 10 + 8\\sin u', text: 'Name the inside u = πt/6, the angle the sine acts on. The height is then h = 10 + 8 sin u.' },
        { tex: '\\frac{dh}{du} = 8\\cos u', text: 'Differentiate the outside: the constant 10 goes to 0, and 8 sin u goes to 8 cos u since sine goes to cosine. Keep the inside in place.' },
        { tex: 'u\' = \\tfrac{\\pi}{6}', text: 'Differentiate the inside: u = πt/6 is a line in t with slope π/6, so u′ = π/6.' },
        { tex: 'h\'(t) = 8\\cos\\!\\left(\\tfrac{\\pi t}{6}\\right) \\cdot \\tfrac{\\pi}{6} = \\tfrac{4\\pi}{3}\\cos\\!\\left(\\tfrac{\\pi t}{6}\\right)', text: 'Multiply by the chain rule: 8 · π/6 = 8π/6 = 4π/3, so h′(t) = (4π/3) cos(πt/6).' },
        { tex: 'h\'(0) = \\tfrac{4\\pi}{3} \\cdot \\cos 0 = \\tfrac{4\\pi}{3} \\approx 4.19', text: 'Evaluate at t = 0: the inside is 0 and cos 0 = 1, so h′(0) = 4π/3 ≈ 4.19 meters per minute. The rate is positive, so the seat is rising.' },
      ],
      answer: '\\tfrac{4\\pi}{3} \\approx 4.19\\ \\text{m/min}',
    },
  },
  {
    kind: 'protip',
    head: 'Outside, keep, inside',
    body: 'Chant it: differentiate the OUTSIDE, KEEP the inside, multiply by the derivative of the INSIDE. Three beats, every time. If a layer has its own layers, repeat the chant on it. When you finish, count your factors: there should be one for every layer.',
    art: flow(
      [
        { label: 'outer derivative', color: SKY },
        { label: 'keep the inside', color: AMB },
        { label: '× inner derivative', color: EMR },
      ],
      { title: 'the chain-rule chant', horizontal: true, caption: 'For sin(3x): cos, then (3x) inside it, then × 3.' },
    ),
    formula: {
      tex: "\\big(f(g(x))\\big)' = \\underbrace{f'}_{\\text{outside}}\\underbrace{(g(x))}_{\\text{keep}} \\cdot \\underbrace{g'(x)}_{\\text{inside}}",
      note: 'The middle beat is the one that keeps the answer honest: the inside is copied, never differentiated in place.',
      parts: [
        { sym: 'f\'', means: 'the rule for the outer function alone', tone: 'accent' },
        { sym: '(g(x))', means: 'copied exactly, untouched', tone: 'ok' },
        { sym: 'g\'(x)', means: 'one extra factor for the inner layer', tone: 'warn' },
      ],
    },
  },
  {
    kind: 'protip',
    head: 'Radians, always',
    body: 'The trig derivatives only hold in radians. The fact behind them is that sin x has slope exactly 1 at x = 0, which is true in radians and false in degrees. If a problem hands you degrees, convert to radians before differentiating, or the chain rule will hand you a stray factor of π/180.',
    compare: {
      cols: [
        { title: 'Radians', tex: '(\\sin x)\' = \\cos x', lines: ['slope of sin at 0 is 1', 'Clean rules'], tone: 'ok' },
        { title: 'Degrees', tex: '(\\sin x^\\circ)\' = \\tfrac{\\pi}{180}\\cos x^\\circ', lines: ['slope of sin at 0 is 0.01745', 'A stray factor everywhere'], tone: 'bad' },
      ],
      note: 'sin(x°) = sin(πx/180), so in degrees the chain rule itself produces the π/180.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: forgetting the inside derivative',
    body: 'The most common chain-rule error is stopping after the outer step: writing (sin 5x)′ = cos 5x. The inside 5x changes five times as fast as x, so the slope is five times bigger: 5cos 5x. At x = 0 that is the difference between slope 1 and slope 5.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '(\\sin 5x)\' = \\cos 5x', lines: ['Outer step only', 'Slope 1 at x = 0', 'Wrong'], tone: 'bad' },
        { title: 'Actually', tex: '(\\sin 5x)\' = 5\\cos 5x', lines: ['Outer times inner', 'Slope 5 at x = 0', 'Right'], tone: 'ok' },
      ],
      note: 'Whenever the inside is anything other than a plain x, there is an inner derivative to multiply on.',
    },
  },
  {
    kind: 'trap',
    head: 'Trap: the minus belongs to cosine',
    body: 'Students put the minus sign on the wrong function: (sin x)′ = −cos x or (cos x)′ = sin x. Check with the picture: at x = 0, sine is climbing (slope +1) and cos 0 = +1, so sin → cos with no minus. Cosine at 0 is at its peak and about to fall, so its derivative −sin x is correct.',
    compare: {
      cols: [
        { title: 'Looks like', tex: '(\\cos x)\' = \\sin x', lines: ['Just past x = 0, cos falls but sin x > 0', 'Signs disagree: wrong'], tone: 'bad' },
        { title: 'Actually', tex: '(\\cos x)\' = -\\sin x', lines: ['Falling cosine, negative slope', 'Right'], tone: 'ok' },
      ],
      note: 'sin → cos, cos → −sin. Every "co" function (cos, cot, csc) carries the minus.',
    },
  },
  {
    kind: 'challenge',
    head: 'Extra credit: the slope of tan x',
    body: 'Find the slope of y = tan x at x = π/4, and the tangent line there. Use the tan derivative, then find the slope and the point with exact values.',
    art: (() => {
      const ax = grid({ x: [-1, 3], y: [-4, 4] }, [-1, 1, 2, 3], [-2, 2], { tickText: (v, a) => (a === 'x' ? qt(v) : String(v).replace('-', '−')) });
      return art(
        'Two branches of y = tangent x between dashed vertical asymptotes, with the tangent line of slope 2 touching the curve at (pi over 4, 1)',
        ax.body +
          title('tan x has slope sec²(π/4) = 2 at x = π/4') +
          line(ax.X(-1), ax.Y(-4), ax.X(-1), ax.Y(4), ROSE, 1.6, '5 4', 0.6) +
          line(ax.X(1), ax.Y(-4), ax.X(1), ax.Y(4), ROSE, 1.6, '5 4', 0.6) +
          line(ax.X(3), ax.Y(-4), ax.X(3), ax.Y(4), ROSE, 1.6, '5 4', 0.6) +
          ax.curve((u) => (Math.abs(((u + 1) % 2) - 1) < 0.08 ? NaN : Math.tan((u * Math.PI) / 2)), AMB, 2.6) +
          ax.curve((u) => (u > -0.4 && u < 1.1 ? 1 + Math.PI * (u - 0.5) : NaN), EMR, 2.4) +
          solid(ax, 0.5, 1, EMR) +
          lab(ax, 0.6, 0.5, '(π/4, 1)', { fill: EMR, anchor: 'start' }) +
          lab(ax, 0.95, 3.2, 'slope 2', { fill: EMR, anchor: 'end' }) +
          text(W - 24, 40, 'y = tan x', { size: 12, fill: AMB, anchor: 'end' }),
        'At π/4 the tangent curve passes height 1 and is climbing at slope 2, twice as steep as at the origin.',
      );
    })(),
    steps: {
      steps: [
        { tex: 'y\' = \\sec^2 x = \\frac{1}{\\cos^2 x}', text: 'The derivative of tan x is sec²x, and since sec x = 1/cos x, that equals 1/cos²x. This lets us evaluate with a known cosine value.' },
        { tex: '\\cos\\tfrac{\\pi}{4} = \\tfrac{\\sqrt{2}}{2} \\ \\Rightarrow\\ \\cos^2\\tfrac{\\pi}{4} = \\tfrac{2}{4} = \\tfrac{1}{2}', text: 'Use cos(π/4) = √2/2 and square it: (√2/2)² = 2/4 = 1/2. Remember to square both the numerator and the denominator.' },
        { tex: 'y\'\\!\\left(\\tfrac{\\pi}{4}\\right) = \\frac{1}{1/2} = 2', text: 'Take the reciprocal: the slope is 1/(1/2) = 2. At x = π/4 the tangent has slope 2, steeper than the 45-degree slope of 1.' },
        { tex: '\\tan\\tfrac{\\pi}{4} = 1 \\ \\Rightarrow\\ \\text{point } \\left(\\tfrac{\\pi}{4}, 1\\right)', text: 'Find the point: tan(π/4) = 1, since sine and cosine are equal at π/4. The tangent touches the curve at (π/4, 1).' },
        { tex: 'y = 1 + 2\\left(x - \\tfrac{\\pi}{4}\\right)', text: 'Write point-slope form with the point (π/4, 1) and slope 2: y = 1 + 2(x − π/4).' },
      ],
      answer: '\\text{slope } 2;\\quad y = 1 + 2\\left(x - \\tfrac{\\pi}{4}\\right)',
    },
  },
  {
    kind: 'summary',
    head: 'Peel the layers, multiply the slopes',
    body: 'Name the layers from the outside in. Differentiate the outside, keep the inside, multiply by the inside\'s derivative, and repeat if a layer has layers of its own. The general power, exponential and log rules are the chain rule pre-packaged. The six trig derivatives, in radians, finish the toolkit: sin → cos, cos → −sin, tan → sec², and the co-functions carry a minus.',
    formula: {
      tex: "\\big(f(g(x))\\big)' = f'(g(x)) \\cdot g'(x)",
      note: 'One rule, applied as many times as there are layers.',
      parts: [
        { sym: "f'(g(x))", means: 'outside differentiated, inside kept', tone: 'accent' },
        { sym: "g'(x)", means: 'one more factor for the inner layer', tone: 'warn' },
        { sym: '(\\sin u)\' = \\cos u \\cdot u\'', means: 'every trig derivative, with its inner factor', tone: 'ok' },
      ],
    },
    table: {
      head: ['Function', 'Layers (outer → inner)', 'Derivative'],
      rows: [['(2x + 1)³', 'cube, 2x + 1', '6(2x + 1)²'], ['sin(3x)', 'sin, 3x', '3cos(3x)'], ['e^(x²)', 'eᵘ, x²', '2x·e^(x²)'], ['ln(x² + 1)', 'ln, x² + 1', '2x/(x² + 1)'], ['cos²x', 'square, cos x', '−2 sin x cos x']],
    },
  },
];

export const CALC_SLIDES_U01_07: SlideBank = {
  'CALC-1': CALC_1,
  'CALC-2': CALC_2,
  'CALC-3': CALC_3,
  'CALC-4': CALC_4,
  'CALC-5': CALC_5,
  'CALC-6': CALC_6,
  'CALC-7': CALC_7,
};
