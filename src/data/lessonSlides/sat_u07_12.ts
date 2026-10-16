import type { SlideBank } from './types';
import {
  AMB, EMR, ROSE, SKY, VIO,
  areaModel, bars, doubleLine, flow, funcGraph, parabola, pie, shapeBox, tape,
} from '../slideArt';

// SAT Math slide decks, units 7-12: quadratic equations, quadratic graphs,
// nonlinear systems and polynomials, exponential models, ratios and units, and
// percentages.

export const SAT_SLIDES_U07_12: SlideBank = {
  // ---------------- SAT-7 — Quadratic equations and the discriminant ----------------
  'SAT-7': [
    {
      kind: 'objective',
      head: 'Where a parabola meets zero',
      body: 'Solving x² − 5x + 6 = 0 means finding where the curve touches the x-axis: x = 2 or x = 3. A quadratic can have two answers, one, or none. You will solve them three ways and count them without solving.',
      art: parabola({ a: 1, b: -5, c: 6 }, { range: { x: [-1, 6], y: [-2, 8] }, roots: [2, 3], vertex: false, label: 'y = x² − 5x + 6', title: 'The solutions are the crossings', caption: 'Each place the curve meets the axis is one solution.' }),
    },
    {
      kind: 'concept',
      head: 'Get zero on one side first',
      body: 'Every method starts from ax² + bx + c = 0. If a product equals zero, one of its factors must be zero. That is the zero-product rule, and it turns one quadratic into two small equations.',
      formula: { tex: '\\begin{gathered} (x - r)(x - s) = 0 \\\\ x = r \\ \\text{or} \\ x = s \\end{gathered}', note: 'A product is zero only when a factor is zero.', parts: [{ sym: 'x - r', means: 'set this factor to zero to get x = r', tone: 'accent' }, { sym: 'x - s', means: 'and this one to get x = s', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Factoring: multiply to c, add to b',
      body: 'For x² − 5x + 6, look for two numbers that MULTIPLY to 6 and ADD to −5. That is −2 and −3. The area model shows why: the corner pieces are x² and 6, and the two middle strips add to −5x.',
      art: areaModel([{ label: 'x', w: 2 }, { label: '−3', w: 1.1 }], [{ label: 'x', h: 1.4 }, { label: '−2', h: 0.9 }], [['x²', '−3x'], ['−2x', '+6']], { title: '(x − 2)(x − 3)', total: '−3x − 2x = −5x', caption: 'The two strips make the middle term; the corner makes the constant.' }),
    },
    {
      kind: 'concept',
      head: 'The quadratic formula always works',
      body: 'When factoring is not obvious, use the formula. It works for every quadratic, and it lives on the SAT reference sheet. The part under the root decides how many answers there are.',
      formula: { tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', note: 'The ± gives the two solutions.', parts: [{ sym: 'b^2 - 4ac', means: 'the discriminant: it counts the real solutions', tone: 'accent' }, { sym: '\\pm', means: 'one solution with plus, one with minus', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The discriminant counts solutions',
      body: 'If b² − 4ac is positive there are two real solutions, if it is zero there is one, and if it is negative there are none. On a graph, that is crossing twice, touching once, or floating clear.',
      art: funcGraph([{ f: (x) => x * x - 3, label: 'two', color: EMR }, { f: (x) => x * x, label: 'one', color: SKY }, { f: (x) => x * x + 2, label: 'none', color: ROSE }], { range: { x: [-3, 3], y: [-4, 7] }, title: 'Cross, touch, or miss', caption: 'Positive, zero, and negative discriminants.' }),
    },
    {
      kind: 'example',
      head: 'Factor it: x² − 5x + 6 = 0',
      body: 'Find two numbers that multiply to 6 and add to −5.\nWrite the factors and set each to zero.\nThe solutions are x = 2 and x = 3.',
      steps: { steps: [{ tex: '(-2)(-3) = 6,\\ \\ -2 + (-3) = -5', text: 'Find the pair that fits both.' }, { tex: '(x - 2)(x - 3) = 0', text: 'Write the factors.' }, { tex: 'x = 2 \\text{ or } x = 3', text: 'Each factor equal to zero.' }], answer: 'x = 2,\\ 3' },
    },
    {
      kind: 'example',
      head: 'A negative solution: x² + 2x − 15 = 0',
      body: 'Multiply to −15 and add to 2: that is 5 and −3. So (x + 5)(x − 3) = 0. The solutions are x = −5 and x = 3, one on each side of zero.',
      art: parabola({ a: 1, b: 2, c: -15 }, { range: { x: [-7, 5], y: [-18, 8] }, roots: [-5, 3], vertex: false, title: 'Roots on both sides of zero', caption: 'A negative constant means one root is negative and one is positive.' }),
    },
    {
      kind: 'example',
      head: 'Use the formula: x² − 4x − 1 = 0',
      body: 'This does not factor nicely, so read off a, b, and c.\nWork out the discriminant first.\nThen finish the formula and simplify the root.',
      steps: { steps: [{ tex: 'a = 1,\\ b = -4,\\ c = -1', text: 'Read the coefficients, signs included.' }, { tex: 'b^2 - 4ac = 16 + 4 = 20', text: 'The discriminant is positive: two answers.' }, { tex: 'x = \\frac{4 \\pm \\sqrt{20}}{2}', text: 'Put it in the formula; √20 = 2√5.' }], answer: 'x = 2 \\pm \\sqrt{5}' },
    },
    {
      kind: 'example',
      head: 'Another way: complete the square',
      body: 'Solve x² − 4x − 1 = 0 without the formula. Move the 1 over, then add the square of half of −4 to both sides. The left side becomes a perfect square, and x = 2 ± √5 again.',
      steps: { steps: [{ tex: 'x^2 - 4x + 4 = 1 + 4', text: 'Add (−4 ÷ 2)² = 4 to both sides.' }, { tex: '(x - 2)^2 = 5', text: 'The left side is now a square.' }, { tex: 'x - 2 = \\pm\\sqrt{5}', text: 'Take the root, keeping both signs.' }], answer: 'x = 2 \\pm \\sqrt{5}' },
    },
    {
      kind: 'example',
      head: 'Count without solving: 2x² + 3x + 5 = 0',
      body: 'The question only asks HOW MANY real solutions. Compute b² − 4ac: 9 − 40 = −31. It is negative, so there are no real solutions.',
      formula: { tex: 'b^2 - 4ac = 3^2 - 4(2)(5) = -31', note: 'Negative: the parabola never reaches the axis.', parts: [{ sym: '3^2', means: 'b squared, always positive or zero', tone: 'accent' }, { sym: '-31', means: 'negative, so zero real solutions', tone: 'bad' }] },
    },
    {
      kind: 'example',
      head: 'Exactly one solution: x² + 6x + c = 0',
      body: 'One solution means the discriminant is zero. So 36 − 4c = 0, and c = 9. Check: x² + 6x + 9 is (x + 3)², a perfect square.',
      formula: { tex: '6^2 - 4c = 0 \\;\\Rightarrow\\; c = 9', note: 'Set the discriminant equal to zero and solve.', parts: [{ sym: '6^2', means: 'the square of the middle coefficient', tone: 'accent' }, { sym: 'c = 9', means: 'makes the quadratic a perfect square', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a rectangle of area 40',
      body: 'A rectangle is 3 cm longer than it is wide, with area 40. Sketch it: width w, length w + 3. So w(w + 3) = 40, which is w² + 3w − 40 = 0, and (w + 8)(w − 5) = 0. The width is 5 cm.',
      art: shapeBox('w + 3', 'w', { wUnits: 8, hUnits: 5, inside: 'area 40', title: 'Width w, length w + 3', caption: 'A length cannot be negative, so throw out −8.' }),
    },
    {
      kind: 'protip',
      head: 'Sum and product without solving',
      body: 'For ax² + bx + c = 0, the solutions add to −b/a and multiply to c/a. A question asking for "the sum of the solutions" is a ten-second question.',
      formula: { tex: 'r + s = -\\frac{b}{a}, \\qquad rs = \\frac{c}{a}', note: 'Read them straight from the coefficients.', parts: [{ sym: '-b/a', means: 'the sum of the two solutions', tone: 'accent' }, { sym: 'c/a', means: 'the product of the two solutions', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'A square root has two signs',
      body: 'x² = 16 has two solutions, 4 and −4, because both square to 16. Writing only 4 loses half the answer — and "sum of the solutions" questions depend on it.',
      compare: {
        cols: [
          { title: 'Half the answer', tex: 'x^2 = 16 \\Rightarrow x = 4', lines: ['Forgot the negative root'], tone: 'bad' },
          { title: 'Both answers', tex: 'x^2 = 16 \\Rightarrow x = \\pm 4', lines: ['(−4)² is also 16'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: the sum of the solutions',
      body: 'What is the sum of the solutions of 3x² − 12x + 7 = 0? You could use the formula twice and add. Or use −b/a and be done in one line.',
      steps: { steps: [{ tex: 'a = 3,\\ b = -12', text: 'Read the first two coefficients.' }, { tex: '-\\frac{b}{a} = \\frac{12}{3}', text: 'Sum of solutions is −b/a.' }], answer: '4' },
    },
    {
      kind: 'summary',
      head: 'Quadratic equations, wrapped up',
      body: 'Set it equal to zero. Factor when two numbers multiply to c and add to b; otherwise use the formula or complete the square. The discriminant counts solutions, and −b/a and c/a give their sum and product.',
      table: { head: ['b² − 4ac', 'Real solutions'], rows: [['positive', 'two'], ['zero', 'one'], ['negative', 'none']] },
    },
  ],

  // ---------------- SAT-8 — Quadratic graphs: forms and features ----------------
  'SAT-8': [
    {
      kind: 'objective',
      head: 'Three numbers every parabola hides',
      body: 'The parabola y = x² − 6x + 5 has a vertex at (3, −4), zeros at x = 1 and x = 5, and a y-intercept of 5. Each form of the equation shows one of these for free. You will learn which form shows which.',
      art: parabola({ a: 1, b: -6, c: 5 }, { range: { x: [-1, 7], y: [-6, 8] }, roots: [1, 5], title: 'Vertex, zeros, and intercept', caption: 'Three features, three forms of the same equation.' }),
    },
    {
      kind: 'concept',
      head: 'Each form shows one feature',
      body: 'The same parabola can be written three ways. Standard form shows the y-intercept. Vertex form shows the turning point. Factored form shows where it crosses the x-axis.',
      compare: {
        cols: [
          { title: 'Standard', tex: 'ax^2 + bx + c', lines: ['y-intercept is c'], tone: 'accent' },
          { title: 'Vertex', tex: 'a(x - h)^2 + k', lines: ['vertex is (h, k)'], tone: 'ok' },
          { title: 'Factored', tex: 'a(x - r)(x - s)', lines: ['zeros are r and s'], tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'The sign of a sets the direction',
      body: 'When a is positive the parabola opens UP like a cup, and the vertex is the lowest point. When a is negative it opens DOWN, and the vertex is the highest point — a maximum.',
      art: funcGraph([{ f: (x) => x * x - 2, label: 'a > 0: up', color: SKY }, { f: (x) => -x * x + 2, label: 'a < 0: down', color: ROSE }], { range: { x: [-3, 3], y: [-5, 5] }, title: 'Cup or cap', caption: 'A positive a holds water; a negative a spills it.' }),
    },
    {
      kind: 'concept',
      head: 'The vertex sits halfway between the zeros',
      body: 'A parabola is symmetric, so its axis runs through the middle. For y = x² − 2x − 8, the zeros are −2 and 4, and halfway is 1. That is also −b/2a.',
      formula: { tex: 'x_{\\text{vertex}} = -\\frac{b}{2a} = \\frac{r + s}{2}', note: 'Average the zeros, or use −b/2a.', parts: [{ sym: '-b/2a', means: 'works straight from standard form', tone: 'accent' }, { sym: '(r + s)/2', means: 'the midpoint of the two zeros', tone: 'ok' }] },
      art: parabola({ a: 1, b: -2, c: -8 }, { range: { x: [-4, 6], y: [-11, 8] }, roots: [-2, 4], title: 'Symmetric about x = 1', caption: 'Halfway between −2 and 4 is 1.' }),
    },
    {
      kind: 'example',
      head: 'Read the vertex: y = (x − 3)² + 5',
      body: 'Vertex form is a(x − h)² + k. The number inside is subtracted, so h is +3, not −3. The number outside is k. The vertex is (3, 5).',
      formula: { tex: 'y = (x - 3)^2 + 5', note: 'Vertex (3, 5): flip the sign inside, keep the one outside.', parts: [{ sym: 'x - 3', means: 'h = 3, the opposite of the sign you see', tone: 'accent' }, { sym: '+5', means: 'k = 5, exactly as written', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Read the zeros: y = (x + 2)(x − 6)',
      body: 'Each factor is zero at one x-value. x + 2 = 0 at x = −2, and x − 6 = 0 at x = 6. The vertex is halfway, at x = 2.',
      art: parabola({ a: 1, b: -4, c: -12 }, { range: { x: [-4, 8], y: [-18, 8] }, roots: [-2, 6], title: 'Zeros at −2 and 6', caption: 'Halfway between them, at x = 2, is the vertex.' }),
    },
    {
      kind: 'example',
      head: 'Find the vertex: y = x² − 8x + 10',
      body: 'Standard form hides the vertex, so compute it.\nFirst x = −b/2a.\nThen plug that x back in for y.',
      steps: { steps: [{ tex: 'x = -\\frac{-8}{2(1)} = 4', text: 'The x-coordinate from −b/2a.' }, { tex: 'y = 16 - 32 + 10 = -6', text: 'Substitute x = 4.' }], answer: '(4,\\,-6)' },
    },
    {
      kind: 'example',
      head: 'Another way: average the zeros',
      body: 'For y = (x − 1)(x − 7), you do not need to multiply out. The zeros are 1 and 7, so the vertex is at x = 4. Plug in: (3)(−3) = −9. The vertex is (4, −9).',
      table: { head: ['Step', 'Value'], rows: [['zeros', '1 and 7'], ['midpoint x', '(1 + 7) ÷ 2 = 4'], ['y at x = 4', '(3)(−3) = −9']], mark: 2, note: 'Two short lines instead of expanding.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a thrown ball',
      body: 'A ball\'s height is h(t) = −16t² + 64t feet after t seconds. Sketch it: a is negative, so it arcs up and comes down. The top is at t = 2, and h(2) = 64 feet.',
      art: parabola({ a: -16, b: 64, c: 0 }, { range: { x: [0, 5], y: [0, 80] }, xLabel: 't', yLabel: 'h', title: 'Up for 2 seconds, down for 2', caption: 'The vertex of a downward parabola is its maximum.' }),
    },
    {
      kind: 'example',
      head: 'Standard to vertex: y = x² + 6x + 5',
      body: 'Complete the square. Half of 6 is 3, and 3² is 9. Add and subtract 9 so the value does not change. The vertex is (−3, −4).',
      steps: { steps: [{ tex: 'x^2 + 6x + 9 - 9 + 5', text: 'Add and subtract (6 ÷ 2)² = 9.' }, { tex: '(x + 3)^2 - 4', text: 'Group the square; −9 + 5 = −4.' }], answer: 'y = (x + 3)^2 - 4' },
    },
    {
      kind: 'protip',
      head: 'The y-intercept is free',
      body: 'Set x = 0 and every x-term disappears. In standard form, the y-intercept is just c. For y = 2x² − 3x + 7, it is 7 — no work at all.',
      formula: { tex: 'y(0) = a(0)^2 + b(0) + c = c', note: 'Every term with x vanishes at zero.', parts: [{ sym: 'c', means: 'the height where the curve crosses the y-axis', tone: 'accent' }, { sym: 'x = 0', means: 'the y-axis is where x is zero', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'The sign inside flips',
      body: 'In vertex form, (x − 3) means the vertex is at x = +3, and (x + 3) means x = −3. Reading the sign as written puts the vertex on the wrong side.',
      compare: {
        cols: [
          { title: 'Read as written', tex: '(x + 3)^2 \\to h = 3', lines: ['Wrong side of the axis'], tone: 'bad' },
          { title: 'Flip it', tex: '(x + 3)^2 \\to h = -3', lines: ['x + 3 is zero at −3'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: find a',
      body: 'A parabola has vertex (2, 3) and passes through (4, 11). Find a in y = a(x − 2)² + 3. Plug in the point you know and solve for the one unknown.',
      steps: { steps: [{ tex: '11 = a(4 - 2)^2 + 3', text: 'Substitute the point (4, 11).' }, { tex: '8 = 4a', text: 'Subtract 3; (4 − 2)² is 4.' }], answer: 'a = 2' },
    },
    {
      kind: 'summary',
      head: 'Quadratic graphs, wrapped up',
      body: 'Standard form gives the y-intercept, vertex form the vertex, and factored form the zeros. The sign of a says up or down. The vertex sits halfway between the zeros, at x = −b/2a.',
      table: { head: ['Want', 'Look at'], rows: [['y-intercept', 'c in standard form'], ['vertex', '(h, k) in vertex form'], ['zeros', 'r and s in factored form'], ['max or min', 'the sign of a']] },
    },
  ],

  // ---------------- SAT-9 — Nonlinear systems, polynomials, rational equations ----------------
  'SAT-9': [
    {
      kind: 'objective',
      head: 'When a line meets a curve',
      body: 'The parabola y = x² and the line y = x + 6 cross at two points, (3, 9) and (−2, 4). Finding them is a quadratic in disguise. You will also read factors from zeros and solve equations with x in a denominator.',
      art: funcGraph([{ f: (x) => x * x, label: 'y = x²', color: AMB }, { f: (x) => x + 6, label: 'y = x + 6', color: SKY }], { range: { x: [-4, 4], y: [-1, 12] }, points: [{ x: 3, y: 9, label: '(3, 9)', color: VIO }, { x: -2, y: 4, label: '(−2, 4)', color: VIO }], title: 'Two crossings', caption: 'Each crossing is a solution of the system.' }),
    },
    {
      kind: 'concept',
      head: 'A line can meet a parabola 0, 1, or 2 times',
      body: 'Set the two expressions equal and you get a quadratic. Its discriminant tells you how many times they meet — just like a quadratic equation.',
      art: funcGraph([{ f: (x) => x * x, color: AMB }, { f: (x) => x + 2, label: 'twice', color: EMR }, { f: (x) => 2 * x - 1, label: 'once', color: SKY }, { f: (x) => x - 2, label: 'never', color: ROSE }], { range: { x: [-3, 4], y: [-4, 9] }, title: 'Cross, touch, or miss', caption: 'The line that just touches is tangent to the curve.' }),
    },
    {
      kind: 'concept',
      head: 'The Factor Theorem',
      body: 'If plugging a into a polynomial gives zero, then (x − a) is one of its factors. And a zero of the factor is a zero of the graph. Factors and zeros are the same information.',
      formula: { tex: 'p(a) = 0 \\iff (x - a) \\text{ is a factor}', note: 'Zeros and factors come in matching pairs.', parts: [{ sym: 'p(a) = 0', means: 'the graph crosses the x-axis at a', tone: 'accent' }, { sym: 'x - a', means: 'the matching factor, with the sign flipped', tone: 'ok' }] },
      art: funcGraph([{ f: (x) => (x + 1) * (x - 2) * (x - 5) / 2, color: VIO }], { range: { x: [-2, 6], y: [-10, 10] }, zeros: [{ at: -1, label: 'x + 1' }, { at: 2, label: 'x − 2' }, { at: 5, label: 'x − 5' }], title: 'Each zero names a factor', caption: 'Zeros at −1, 2, and 5 mean factors (x + 1), (x − 2), (x − 5).' }),
    },
    {
      kind: 'concept',
      head: 'The Remainder Theorem',
      body: 'Dividing p(x) by (x − a) leaves a remainder of exactly p(a). So you never need long division to find a remainder — just plug in.',
      formula: { tex: '\\begin{gathered} p(x) \\div (x - a) \\\\ \\text{leaves remainder } p(a) \\end{gathered}', note: 'Plug in the number that makes the divisor zero.', parts: [{ sym: 'x - a', means: 'the divisor; it is zero at x = a', tone: 'accent' }, { sym: 'p(a)', means: 'the remainder, found by substitution', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Solve y = x² and y = x + 6',
      body: 'Both equal y, so set them equal.\nMove everything to one side and factor.\nFind y for each x.',
      steps: { steps: [{ tex: 'x^2 = x + 6', text: 'Set the two expressions equal.' }, { tex: '(x - 3)(x + 2) = 0', text: 'Rearrange to x² − x − 6 = 0 and factor.' }, { tex: 'x = 3 \\text{ or } x = -2', text: 'Then y = 9 or y = 4.' }], answer: '(3,\\,9),\\ (-2,\\,4)' },
    },
    {
      kind: 'example',
      head: 'Is (x − 2) a factor of x³ − 4x² + x + 6?',
      body: 'By the Factor Theorem, just check p(2). If it is zero, (x − 2) is a factor.',
      steps: { steps: [{ tex: 'p(2) = 8 - 16 + 2 + 6', text: 'Substitute x = 2.' }, { tex: 'p(2) = 0', text: 'It comes out to zero.' }], answer: '\\text{Yes}' },
    },
    {
      kind: 'example',
      head: 'A remainder in one line',
      body: 'Find the remainder when x² + 3x − 5 is divided by x − 2. The Remainder Theorem says it is p(2). That is 4 + 6 − 5 = 5.',
      table: { head: ['Term', 'At x = 2'], rows: [['x²', '4'], ['3x', '6'], ['−5', '−5'], ['p(2)', '5']], mark: 3, note: 'No long division needed.' },
    },
    {
      kind: 'example',
      head: 'Cross-multiply: 6/x = 3/(x − 2)',
      body: 'With one fraction on each side, cross-multiply.\nSolve the linear equation that results.\nCheck that no denominator becomes zero.',
      steps: { steps: [{ tex: '6(x - 2) = 3x', text: 'Cross-multiply.' }, { tex: '6x - 12 = 3x', text: 'Distribute the 6.' }, { tex: '3x = 12', text: 'Gather the x-terms; x = 4 is not 0 or 2.' }], answer: 'x = 4' },
    },
    {
      kind: 'example',
      head: 'Another way: test the choices',
      body: 'Instead of cross-multiplying 6/x = 3/(x − 2), try the answer choices. At x = 4, the left is 1.5 and the right is 1.5 — they match. Choices that zero a denominator are out at once.',
      table: { head: ['x', '6/x', '3/(x − 2)'], rows: [['2', '3', 'undefined'], ['4', '1.5', '1.5'], ['6', '1', '0.75']], mark: 1, note: 'Only x = 4 makes the sides equal.' },
    },
    {
      kind: 'example',
      head: 'From zeros to factors',
      body: 'A polynomial has zeros at −1, 2, and 5. Each zero a gives a factor (x − a), so −1 gives (x + 1). The polynomial is a multiple of (x + 1)(x − 2)(x − 5).',
      formula: { tex: '(x + 1)(x - 2)(x - 5)', note: 'Flip the sign of each zero to write its factor.', parts: [{ sym: 'x + 1', means: 'from the zero at −1', tone: 'accent' }, { sym: 'x - 5', means: 'from the zero at 5', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Read factors and zeros both ways',
      body: 'See a factor (x − 3)? There is a zero at 3. See a zero at −4? There is a factor (x + 4). Most polynomial questions are just this translation.',
      art: flow([{ label: 'factor (x − a)', color: SKY }, { label: 'zero at x = a', color: AMB }, { label: 'graph crosses at a', color: EMR }], { title: 'Three names for one fact', caption: 'A factor, a zero, and a crossing all say the same thing.' }),
    },
    {
      kind: 'trap',
      head: 'An answer that breaks a denominator',
      body: 'Solving x/(x − 3) = 3/(x − 3) + 2 gives x = 3. But x = 3 makes the denominators zero, so it is not allowed. The equation has no solution — the graphs never meet.',
      art: funcGraph([{ f: (x) => x / (x - 3), label: 'left side', color: SKY }, { f: (x) => 3 / (x - 3) + 2, label: 'right side', color: ROSE }], { range: { x: [-2, 8], y: [-6, 8] }, vAsymptotes: [{ at: 3, label: 'x = 3 banned' }], title: 'Always one apart', caption: 'The two sides are parallel curves, split by the banned value.' }),
    },
    {
      kind: 'challenge',
      head: 'Extra credit: when does the line just touch?',
      body: 'For what value of b does y = 2x + b touch y = x² at exactly one point? Set them equal and make the discriminant zero.',
      steps: { steps: [{ tex: 'x^2 - 2x - b = 0', text: 'Set x² = 2x + b and move terms over.' }, { tex: '(-2)^2 - 4(1)(-b) = 0', text: 'One meeting point: discriminant zero.' }, { tex: '4 + 4b = 0', text: 'Simplify and solve for b.' }], answer: 'b = -1' },
    },
    {
      kind: 'summary',
      head: 'Nonlinear systems and polynomials, wrapped up',
      body: 'Set a line equal to a curve and solve the quadratic. A zero at a means a factor (x − a), and dividing by (x − a) leaves p(a). Clear denominators, then throw out any answer that makes one zero.',
      table: { head: ['Fact', 'Means'], rows: [['p(a) = 0', '(x − a) is a factor'], ['p(x) ÷ (x − a)', 'remainder p(a)'], ['x zeroes a denominator', 'not a solution']] },
    },
  ],

  // ---------------- SAT-10 — Exponential functions, growth, and decay ----------------
  'SAT-10': [
    {
      kind: 'objective',
      head: 'Adding versus multiplying',
      body: 'A line grows by adding the same amount each step. An exponential grows by MULTIPLYING by the same factor, so it starts slow and then races ahead. The SAT asks you to build these models and read their numbers.',
      art: funcGraph([{ f: (x) => 3 * x + 2, label: 'linear: +3 each step', color: SKY }, { f: (x) => 2 * Math.pow(2, x), label: 'exponential: ×2 each step', color: ROSE }], { range: { x: [0, 4], y: [0, 34] }, title: 'Slow start, fast finish', caption: 'By x = 4 the exponential is more than double the line.' }),
    },
    {
      kind: 'concept',
      head: 'The model a · bˣ',
      body: 'Every exponential model has two numbers. The start a is the value at x = 0. The factor b is what you multiply by each step.',
      formula: { tex: 'y = a \\cdot b^{x}', note: 'Start at a, multiply by b each step.', parts: [{ sym: 'a', means: 'the starting amount, when x is zero', tone: 'accent' }, { sym: 'b', means: 'the growth factor for each step', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Percent change becomes a factor',
      body: 'Growing by 5% keeps all of it plus 5% more: the factor is 1.05. Shrinking by 5% keeps only 95%: the factor is 0.95. The factor is always what REMAINS.',
      compare: {
        cols: [
          { title: 'Growth by r', tex: 'b = 1 + r', lines: ['5% up → 1.05', 'b is bigger than 1'], tone: 'ok' },
          { title: 'Decay by r', tex: 'b = 1 - r', lines: ['5% down → 0.95', 'b is between 0 and 1'], tone: 'bad' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Decay gets close to zero but never reaches it',
      body: 'Halving 100 again and again gives 50, 25, 12.5, and so on. It keeps shrinking but never hits zero, because half of something is still something.',
      art: funcGraph([{ f: (x) => 100 * Math.pow(0.5, x), color: EMR }], { range: { x: [0, 6], y: [0, 110] }, hAsymptote: { at: 0 }, points: [{ x: 1, y: 50, label: '50', color: SKY }, { x: 2, y: 25, label: '25', color: SKY }], title: 'Halving every step', caption: 'The curve flattens toward the axis without touching it.' }),
    },
    {
      kind: 'example',
      head: 'Build a model: a town growing 3%',
      body: 'A town of 2,000 people grows 3% a year. The start is 2,000. The factor is 1 + 0.03 = 1.03. So P(t) = 2000(1.03)ᵗ.',
      formula: { tex: 'P(t) = 2000(1.03)^{t}', note: 'Start times factor to the number of years.', parts: [{ sym: '2000', means: 'the population at t = 0', tone: 'accent' }, { sym: '1.03', means: 'keep 100% and add 3% each year', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Decay: a $900 phone losing 20% a year',
      body: 'Losing 20% leaves 80%, so the factor is 0.8.\nTwo years means multiply by 0.8 twice.\nThe phone is worth $576.',
      steps: { steps: [{ tex: 'b = 1 - 0.20 = 0.8', text: 'The factor is what remains.' }, { tex: '900(0.8)^2 = 900(0.64)', text: 'Two years of decay.' }], answer: '\\$576' },
    },
    {
      kind: 'example',
      head: 'Doubling every 4 hours',
      body: 'Bacteria start at 100 and double every 4 hours. In 12 hours there are 12 ÷ 4 = 3 doublings. So 100 · 2³ = 800 bacteria.',
      formula: { tex: 'N = 100 \\cdot 2^{t/4}', note: 'The exponent counts how many doublings have happened.', parts: [{ sym: 't/4', means: 'hours divided by the doubling time', tone: 'accent' }, { sym: '2', means: 'doubling means a factor of 2', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: count the doublings in a table',
      body: 'Skip the formula and just double every 4 hours. Hour 0: 100. Hour 4: 200. Hour 8: 400. Hour 12: 800. The table and the formula agree.',
      table: { head: ['Hours', 'Bacteria'], rows: [['0', '100'], ['4', '200'], ['8', '400'], ['12', '800']], mark: 3, note: 'Each row doubles the one before.' },
    },
    {
      kind: 'example',
      head: 'Read the percent: f(t) = 50(0.9)ᵗ',
      body: 'The factor 0.9 is below 1, so this is decay. It keeps 90% each step, which means it loses 10%. The answer is a 10% decrease per step.',
      art: bars([{ name: 'f(t)', vals: [50, 45, 40.5, 36.45], color: VIO }], { labels: ['t = 0', 't = 1', 't = 2', 't = 3'], title: 'Keep 90% each step', caption: 'Every bar is 90% of the one before it.' }),
    },
    {
      kind: 'example',
      head: 'Linear or exponential? 3, 6, 12, 24',
      body: 'Check the differences first: 3, 6, 12 — not equal, so not linear. Now check the ratios: 2, 2, 2 — equal. That is exponential with factor 2.',
      table: { head: ['x', 'y', 'Difference', 'Ratio'], rows: [['0', '3', '—', '—'], ['1', '6', '+3', '×2'], ['2', '12', '+6', '×2'], ['3', '24', '+12', '×2']], note: 'Equal ratios mean exponential.' },
    },
    {
      kind: 'protip',
      head: 'Find the factor, then the percent',
      body: 'Whenever you see a · bˣ, turn b into a percent. Subtract 1 from b: 1.07 means up 7%, and 0.85 means down 15%. That answers most interpretation questions.',
      art: flow([{ label: 'Find b in a · bˣ', color: SKY }, { label: 'Compute b − 1', color: AMB }, { label: 'Positive: growth. Negative: decay', color: EMR }], { title: 'Reading the rate', caption: '1.07 − 1 = 0.07: seven percent growth.' }),
    },
    {
      kind: 'trap',
      head: 'A 20% loss is 0.8, not 0.2',
      body: 'The factor is what you KEEP. Using 0.2 for a 20% decrease would leave only a fifth of the value after one step, when 80% should remain.',
      compare: {
        cols: [
          { title: 'Wrong factor', tex: '900(0.2) = 180', lines: ['Kept only 20%'], tone: 'bad' },
          { title: 'Right factor', tex: '900(0.8) = 720', lines: ['Lost 20%, kept 80%'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: compound interest',
      body: 'You deposit $1,000 at 6% interest compounded yearly. What is the balance after 2 years? Build the factor, then apply it twice.',
      steps: { steps: [{ tex: 'b = 1.06', text: 'Keep it all and add 6%.' }, { tex: '1000(1.06)^2 = 1000(1.1236)', text: 'Two years of growth.' }], answer: '\\$1{,}123.60' },
    },
    {
      kind: 'summary',
      head: 'Exponential models, wrapped up',
      body: 'Linear adds a constant; exponential multiplies by one. In a · bˣ, a is the start and b is the factor. Growth by r% uses 1 + r, decay uses 1 − r. Equal ratios in a table mean exponential.',
      table: { head: ['Phrase', 'Factor b'], rows: [['grows 5%', '1.05'], ['shrinks 5%', '0.95'], ['doubles', '2'], ['halves', '0.5']] },
    },
  ],

  // ---------------- SAT-11 — Ratios, rates, proportions, and units ----------------
  'SAT-11': [
    {
      kind: 'objective',
      head: 'Scale it up without losing the units',
      body: 'A car goes 35 miles on each gallon. Line up miles against gallons and every pair keeps the same ratio. Ratio questions are about keeping that match, and unit questions are about keeping labels honest.',
      art: doubleLine({ label: 'miles', vals: [0, 35, 70, 105, 140] }, { label: 'gallons', vals: [0, 1, 2, 3, 4] }, { title: '35 miles for every gallon', mark: 2, caption: 'Move along both lines together and the ratio never changes.' }),
    },
    {
      kind: 'concept',
      head: 'A proportion: two equal ratios',
      body: 'A proportion says two ratios are the same. Keep the same unit in the same spot on both sides, then cross-multiply to solve.',
      formula: { tex: '\\frac{a}{b} = \\frac{c}{d} \\;\\Rightarrow\\; ad = bc', note: 'Cross-multiplying clears both fractions at once.', parts: [{ sym: 'a/b', means: 'the ratio you know, units in order', tone: 'accent' }, { sym: 'ad = bc', means: 'the cross products are equal', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Converting: multiply by a clever 1',
      body: '12 inches over 1 foot equals 1, so multiplying by it changes the units but not the amount. Choose the fraction so the unit you want gone is on the bottom and cancels.',
      formula: { tex: '3\\text{ ft} \\times \\frac{12\\text{ in}}{1\\text{ ft}} = 36\\text{ in}', note: 'Feet cancel feet, leaving inches.', parts: [{ sym: '\\tfrac{12\\text{ in}}{1\\text{ ft}}', means: 'a fraction equal to 1, with feet on the bottom', tone: 'accent' }, { sym: '36\\text{ in}', means: 'the same length, new units', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'A ratio splits a whole into parts',
      body: 'Red to blue in a 2 : 3 ratio means every group of 5 marbles has 2 red and 3 blue. With 40 marbles, one part is 40 ÷ 5 = 8. So there are 16 red and 24 blue.',
      art: tape([{ label: 'red', boxes: 2, each: '8', color: ROSE }, { label: 'blue', boxes: 3, each: '8', color: SKY }], { title: '2 : 3 with 40 in all', total: '5 parts, each part is 8', caption: 'Find one part, then count parts.' }),
    },
    {
      kind: 'example',
      head: 'Unit rate: 210 miles on 6 gallons',
      body: 'Find the miles for ONE gallon first.\nThen multiply by the new number of gallons.\nThe car goes 350 miles on 10 gallons.',
      steps: { steps: [{ tex: '210 \\div 6 = 35', text: 'Miles per gallon: the unit rate.' }, { tex: '35 \\times 10 = 350', text: 'Scale up to 10 gallons.' }], answer: '350\\text{ miles}' },
    },
    {
      kind: 'example',
      head: 'Another way: scale the whole ratio',
      body: 'Skip the unit rate. Going from 6 gallons to 10 multiplies by 10/6. Multiply the miles by the same thing: 210 × 10/6 = 350. Same answer, one step.',
      table: { head: ['Gallons', 'Miles'], rows: [['6', '210'], ['× 10/6', '× 10/6'], ['10', '350']], mark: 2, note: 'Multiply both columns by the same factor and the ratio holds.' },
    },
    {
      kind: 'example',
      head: 'Solve a proportion: 3/8 = x/56',
      body: 'Cross-multiply to clear the fractions.\nThen divide.\nx = 21.',
      steps: { steps: [{ tex: '8x = 3 \\cdot 56', text: 'Cross-multiply.' }, { tex: '8x = 168', text: 'Multiply out.' }], answer: 'x = 21' },
    },
    {
      kind: 'example',
      head: 'Chain conversions: 90 km/h in m/s',
      body: 'Two units to change, so use two clever 1s. Kilometers become meters with 1000/1. Hours become seconds with 1/3600. The answer is 25 meters per second.',
      formula: { tex: '90\\,\\tfrac{\\text{km}}{\\text{h}} \\cdot \\tfrac{1000\\text{ m}}{1\\text{ km}} \\cdot \\tfrac{1\\text{ h}}{3600\\text{ s}} = 25\\,\\tfrac{\\text{m}}{\\text{s}}', note: 'Every unwanted unit appears once on top and once on the bottom.', parts: [{ sym: '\\tfrac{1000\\text{ m}}{1\\text{ km}}', means: 'cancels kilometers, brings in meters', tone: 'accent' }, { sym: '\\tfrac{1\\text{ h}}{3600\\text{ s}}', means: 'cancels hours, brings in seconds', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: boys and girls, 4 : 5',
      body: 'A class of 36 has boys to girls 4 : 5. Draw 4 boxes for boys and 5 for girls: 9 boxes in all. Each box is 36 ÷ 9 = 4 students. Girls fill 5 boxes: 20 girls.',
      art: tape([{ label: 'boys', boxes: 4, each: '4', color: SKY }, { label: 'girls', boxes: 5, each: '4', color: AMB }], { title: '9 equal boxes make 36', total: 'girls: 5 × 4 = 20', caption: 'The drawing turns a ratio into a division.' }),
    },
    {
      kind: 'example',
      head: 'A map scale: 1 inch to 25 miles',
      body: 'Two towns are 3.2 inches apart on the map. Each inch stands for 25 miles, so multiply: 3.2 × 25 = 80. The towns are 80 miles apart.',
      table: { head: ['Map (in)', 'Real (mi)'], rows: [['1', '25'], ['2', '50'], ['3.2', '80']], mark: 2, note: 'Every inch is another 25 miles.' },
    },
    {
      kind: 'protip',
      head: 'Write the units on every number',
      body: 'Carry the units through the arithmetic. If they cancel down to the unit the question asks for, your setup is right. If not, a fraction is upside down.',
      art: flow([{ label: 'Label every number', color: SKY }, { label: 'Cancel matching units', color: AMB }, { label: 'Check what is left', color: EMR }], { title: 'Units as a checker', caption: 'Leftover units reveal a flipped fraction before you finish.' }),
    },
    {
      kind: 'trap',
      head: 'Keep the same unit in the same spot',
      body: 'In a proportion, miles over gallons must equal miles over gallons. Flip one side and the equation is still solvable — it just gives the wrong answer.',
      compare: {
        cols: [
          { title: 'Mismatched', tex: '\\frac{210}{6} = \\frac{10}{x}', lines: ['miles/gal = gal/miles'], tone: 'bad' },
          { title: 'Matched', tex: '\\frac{210}{6} = \\frac{x}{10}', lines: ['miles/gal = miles/gal'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 60 mph in feet per second',
      body: 'There are 5,280 feet in a mile and 3,600 seconds in an hour. Convert 60 miles per hour to feet per second.',
      steps: { steps: [{ tex: '60 \\times 5280 = 316{,}800', text: 'Miles to feet: feet per hour.' }, { tex: '316{,}800 \\div 3600', text: 'Hours to seconds.' }], answer: '88\\text{ ft/s}' },
    },
    {
      kind: 'summary',
      head: 'Ratios and units, wrapped up',
      body: 'Find a unit rate or scale the whole ratio. In a proportion keep units in matching spots and cross-multiply. Convert by multiplying by fractions equal to 1. For a ratio a : b, find one part first.',
      formula: { tex: '\\frac{a}{b} = \\frac{c}{d} \\;\\Rightarrow\\; ad = bc', note: 'The one equation behind every proportion.', parts: [{ sym: 'a/b', means: 'the known ratio', tone: 'accent' }, { sym: 'c/d', means: 'the ratio with the unknown, units in the same order', tone: 'ok' }] },
    },
  ],

  // ---------------- SAT-12 — Percentages, percent change, and interest ----------------
  'SAT-12': [
    {
      kind: 'objective',
      head: 'Percents are multipliers',
      body: 'A price goes from $50 to $62 — a 24% increase. On the SAT almost every percent question gets easier if you turn the percent into a number to multiply by. You will learn percent of, percent change, and working backward.',
      art: bars([{ name: 'price', vals: [50, 62], color: SKY }], { labels: ['before', 'after'], title: '$50 up to $62', caption: 'The extra $12 is 24% of the original $50.' }),
    },
    {
      kind: 'concept',
      head: 'Percent of means multiply',
      body: 'Percent means per hundred, so 35% is 0.35. "35% of 240" means 0.35 × 240. Every "percent of" question is a multiplication in disguise.',
      formula: { tex: '\\text{part} = \\frac{p}{100} \\times \\text{whole}', note: 'Change the percent to a decimal, then multiply.', parts: [{ sym: 'p/100', means: 'the percent as a decimal: 35% is 0.35', tone: 'accent' }, { sym: '\\text{whole}', means: 'the amount you are taking a percent of', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'A change is a multiplier',
      body: 'Going up 15% keeps the whole and adds 15%: multiply by 1.15. Going down 15% keeps 85%: multiply by 0.85. One multiplication replaces "find the percent, then add or subtract."',
      compare: {
        cols: [
          { title: 'Up 15%', tex: '\\times 1.15', lines: ['100% + 15%'], tone: 'ok' },
          { title: 'Down 15%', tex: '\\times 0.85', lines: ['100% − 15%'], tone: 'bad' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Percent change divides by the original',
      body: 'To find a percent change, take the change and divide by where you STARTED. From 50 to 62, the change is 12 and the start is 50, so it is 24%.',
      formula: { tex: '\\%\\text{ change} = \\frac{\\text{new} - \\text{old}}{\\text{old}}', note: 'Always divide by the original amount.', parts: [{ sym: '\\text{new} - \\text{old}', means: 'how much it changed', tone: 'accent' }, { sym: '\\text{old}', means: 'the starting value, always the denominator', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Changes in a row multiply',
      body: 'Up 10% and then down 10% is not a wash. It is 1.1 × 0.9 = 0.99, so you end 1% lower than you started. Chain the multipliers; never add the percents.',
      art: flow([{ label: 'Start: $100', color: SKY }, { label: '× 1.1 → $110', color: EMR }, { label: '× 0.9 → $99', color: ROSE }], { title: 'Up 10%, then down 10%', caption: 'The second 10% is taken from a bigger number.' }),
    },
    {
      kind: 'example',
      head: 'Percent of: 35% of 240',
      body: 'Write 35% as 0.35.\nMultiply by 240.\nThe answer is 84.',
      steps: { steps: [{ tex: '35\\% = 0.35', text: 'Move the decimal two places left.' }, { tex: '0.35 \\times 240 = 84', text: 'Percent of means multiply.' }], answer: '84' },
    },
    {
      kind: 'example',
      head: 'Percent change: $50 to $62',
      body: 'Find the change, then divide by the ORIGINAL price.\nConvert the decimal to a percent.\nIt is a 24% increase.',
      steps: { steps: [{ tex: '62 - 50 = 12', text: 'The change.' }, { tex: '12 \\div 50 = 0.24', text: 'Divide by the original.' }], answer: '24\\%' },
    },
    {
      kind: 'example',
      head: 'Work backward: $90 after 25% off',
      body: 'After 25% off, you pay 75% of the original. So 0.75p = 90. Divide by 0.75: the original price was $120.',
      formula: { tex: '0.75p = 90 \\;\\Rightarrow\\; p = \\frac{90}{0.75} = 120', note: 'Undo a multiplier by dividing by it.', parts: [{ sym: '0.75', means: 'what is left after 25% comes off', tone: 'accent' }, { sym: 'p', means: 'the original price you are looking for', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: test the choices',
      body: 'For "$90 after 25% off," try each choice for the original. 25% off $120 is $120 − $30 = $90. That matches. No equation needed — just check each choice.',
      table: { head: ['Original', '25% off', 'Price paid'], rows: [['$112.50', '$28.13', '$84.38'], ['$120', '$30', '$90'], ['$135', '$33.75', '$101.25']], mark: 1, note: 'Only $120 lands on $90.' },
    },
    {
      kind: 'example',
      head: 'Up 20%, then down 20%',
      body: 'Multiply the factors: 1.2 × 0.8 = 0.96. The stock keeps 96% of its value — a 4% loss overall, even though the percents look like they cancel.',
      table: { head: ['Step', 'Value of $100'], rows: [['start', '$100'], ['× 1.2', '$120'], ['× 0.8', '$96']], mark: 2, note: 'A 4% net loss.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: 18 out of 72',
      body: '18 is what percent of 72? Draw 72 as a circle and see how much 18 fills. 18 goes into 72 exactly four times, so it is one quarter: 25%.',
      art: pie([{ label: '18', part: 1, color: AMB }, { label: '54', part: 3, color: SKY }], { title: '18 is one quarter of 72', caption: 'One of four equal parts is 25%.' }),
    },
    {
      kind: 'protip',
      head: 'Reverse percents: divide',
      body: 'When the question gives the price AFTER a change and asks for the price before, divide by the multiplier. After a 20% discount it costs $64? The original was 64 ÷ 0.8 = $80.',
      formula: { tex: '\\text{original} = \\frac{\\text{after}}{\\text{multiplier}}', note: 'Undo the change by dividing.', parts: [{ sym: '\\text{after}', means: 'the price the question gives you', tone: 'accent' }, { sym: '\\text{multiplier}', means: '0.8 for 20% off, 1.1 for 10% up', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Divide by the original, not the new',
      body: 'From 50 to 62 is 12 ÷ 50 = 24%. Dividing by 62 gives about 19%, and that wrong answer is in the choices on purpose.',
      compare: {
        cols: [
          { title: 'Wrong base', tex: '\\frac{12}{62} \\approx 19\\%', lines: ['Divided by the new value'], tone: 'bad' },
          { title: 'Right base', tex: '\\frac{12}{50} = 24\\%', lines: ['Divided by the original'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: tax, then tip',
      body: 'A $60 meal has 8% tax. Then you tip 20% on the total with tax. What do you pay? Chain the two multipliers.',
      steps: { steps: [{ tex: '60 \\times 1.08 = 64.80', text: 'Add 8% tax.' }, { tex: '64.80 \\times 1.20', text: 'Add a 20% tip on the taxed total.' }], answer: '\\$77.76' },
    },
    {
      kind: 'summary',
      head: 'Percentages, wrapped up',
      body: 'Percent of means multiply. A change of r% multiplies by 1 + r or 1 − r. Percent change divides by the original. Changes in a row multiply, and to work backward, divide by the multiplier.',
      table: { head: ['Question', 'Move'], rows: [['p% of n', 'multiply by p/100'], ['up or down r%', 'multiply by 1 ± r'], ['percent change', '(new − old) ÷ old'], ['price before a change', 'divide by the multiplier']] },
    },
  ],
};
