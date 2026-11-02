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
      why: 'Knowing that a product equals 6 tells you almost nothing, because 2 · 3, 1 · 6, and 12 · 0.5 all work. But if a product equals 0, one factor must be 0, because you cannot multiply nonzero numbers and land on zero. That is why zero must be alone on one side.',
    },
    {
      kind: 'concept',
      head: 'Factoring: multiply to c, add to b',
      body: 'For x² − 5x + 6, look for two numbers that MULTIPLY to 6 and ADD to −5. That is −2 and −3. The area model shows why: the corner pieces are x² and 6, and the two middle strips add to −5x.',
      art: areaModel([{ label: 'x', w: 2 }, { label: '−3', w: 1.1 }], [{ label: 'x', h: 1.4 }, { label: '−2', h: 0.9 }], [['x²', '−3x'], ['−2x', '+6']], { title: '(x − 2)(x − 3)', total: '−3x − 2x = −5x', caption: 'The two strips make the middle term; the corner makes the constant.' }),
      why: 'Multiply (x + m)(x + n) and you get x² + (m + n)x + mn. The middle coefficient is the sum m + n and the constant is the product mn. So finding the factors means finding two numbers with that product and that sum. Check with (x − 2)(x − 3): the sum is −5 and the product is 6.',
    },
    {
      kind: 'concept',
      head: 'The quadratic formula always works',
      body: 'When factoring is not obvious, use the formula. It works for every quadratic, and it lives on the SAT reference sheet. The part under the root decides how many answers there are.',
      formula: { tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', note: 'The ± gives the two solutions.', parts: [{ sym: 'b^2 - 4ac', means: 'the discriminant: it counts the real solutions', tone: 'accent' }, { sym: '\\pm', means: 'one solution with plus, one with minus', tone: 'ok' }] },
      why: 'The formula comes from completing the square on ax² + bx + c = 0 in general, so it works for any coefficients. Quick check with x² − 5x + 6: the discriminant is 25 − 24 = 1, so x = (5 ± 1) ÷ 2, which gives 3 and 2. Those are the same answers factoring gives.',
    },
    {
      kind: 'concept',
      head: 'The discriminant counts solutions',
      body: 'If b² − 4ac is positive there are two real solutions, if it is zero there is one, and if it is negative there are none. On a graph, that is crossing twice, touching once, or floating clear.',
      art: funcGraph([{ f: (x) => x * x - 3, label: 'two', color: EMR }, { f: (x) => x * x, label: 'one', color: SKY }, { f: (x) => x * x + 2, label: 'none', color: ROSE }], { range: { x: [-3, 3], y: [-4, 7] }, title: 'Cross, touch, or miss', caption: 'Positive, zero, and negative discriminants.' }),
      why: 'The discriminant sits under the square root in the formula. A positive number has two square roots, so ± gives two different answers. Zero has only one root, so the plus and minus answers are the same. A negative number has no real square root, because squaring never gives a negative.',
    },
    {
      kind: 'example',
      head: 'Factor it: x² − 5x + 6 = 0',
      body: 'Solve x² − 5x + 6 = 0 by factoring. What two numbers do you need, and how do the factors give the solutions?',
      steps: { steps: [{ tex: '(-2)(-3) = 6,\\ \\ -2 + (-3) = -5', text: 'Look for two numbers that multiply to the constant, 6, and add to the middle coefficient, −5. This works because (x + m)(x + n) expands to x² + (m + n)x + mn. Both must be negative, since the product is positive and the sum is negative.' }, { tex: '(x - 2)(x - 3) = 0', text: 'Write the factors using those numbers. Multiply them back out to check: x² − 3x − 2x + 6 = x² − 5x + 6, which matches the original.' }, { tex: 'x - 2 = 0 \\text{ or } x - 3 = 0', text: 'Use the zero-product rule: if two things multiply to zero, at least one of them is zero. That is why the right side had to be 0 before factoring.' }, { tex: 'x = 2 \\text{ or } x = 3', text: 'Solve each small equation by adding the number to both sides. Test-day move: the solutions add to −b/a = 5 and multiply to c/a = 6, and 2 and 3 do both.' }], answer: 'x = 2,\\ 3' },
    },
    {
      kind: 'example',
      head: 'A negative solution: x² + 2x − 15 = 0',
      body: 'Solve x² + 2x − 15 = 0. The constant is negative, so what does that say about the two solutions?',
      art: parabola({ a: 1, b: 2, c: -15 }, { range: { x: [-7, 5], y: [-18, 8] }, roots: [-5, 3], vertex: false, title: 'Roots on both sides of zero', caption: 'A negative constant means one root is negative and one is positive.' }),
      steps: { steps: [{ tex: '5 \\cdot (-3) = -15,\\ \\ 5 + (-3) = 2', text: 'Find two numbers that multiply to c = −15 and add to b = 2. A negative product means one number is positive and one is negative, and the positive one must be larger because the sum is positive. That gives 5 and −3.' }, { tex: '(x + 5)(x - 3) = 0', text: 'Write the factors. Check by expanding: x² − 3x + 5x − 15 = x² + 2x − 15, so the factoring is correct.' }, { tex: 'x + 5 = 0 \\text{ or } x - 3 = 0', text: 'Apply the zero-product rule: a product is zero only when one factor is zero, so set each factor equal to zero separately.' }, { tex: 'x = -5 \\text{ or } x = 3', text: 'Solve each one. Notice the factor (x + 5) gives x = −5, the opposite sign. Quick check: the solutions should add to −b/a = −2, and −5 + 3 = −2.' }], answer: 'x = -5,\\ 3' },
    },
    {
      kind: 'example',
      head: 'Use the formula: x² − 4x − 1 = 0',
      body: 'This one does not factor with whole numbers. Read a, b, and c, check the discriminant, and finish the formula.',
      steps: { steps: [{ tex: 'a = 1,\\ b = -4,\\ c = -1', text: 'Read the coefficients from ax² + bx + c = 0, signs included. The x² term has an invisible 1, and the minus signs belong to b and c. Dropping a sign here ruins everything after it.' }, { tex: 'b^2 - 4ac = (-4)^2 - 4(1)(-1) = 16 + 4 = 20', text: 'Work out the discriminant first. Squaring −4 gives +16, and −4 times 1 times −1 is −(−4) = +4. It is positive, so there are two real solutions.' }, { tex: 'x = \\frac{-(-4) \\pm \\sqrt{20}}{2(1)} = \\frac{4 \\pm \\sqrt{20}}{2}', text: 'Put the numbers into the quadratic formula. The −b becomes −(−4) = 4, and the bottom is 2a = 2.' }, { tex: '\\sqrt{20} = \\sqrt{4 \\cdot 5} = 2\\sqrt{5}', text: 'Simplify the root by pulling out the perfect square 4, because √(4·5) = √4 · √5. Then 4 ± 2√5 over 2 divides every term by 2, leaving 2 ± √5.' }], answer: 'x = 2 \\pm \\sqrt{5}' },
    },
    {
      kind: 'example',
      head: 'Another way: complete the square',
      body: 'Solve x² − 4x − 1 = 0 without the formula. Move the constant over, then build a perfect square on the left.',
      steps: { steps: [{ tex: 'x^2 - 4x = 1', text: 'Add 1 to both sides so the x-terms are alone. Adding the same thing to both sides keeps the equation balanced.' }, { tex: 'x^2 - 4x + 4 = 1 + 4', text: 'Add (−4 ÷ 2)² = 4 to both sides. Half of the x-coefficient, squared, is exactly the number that makes x² − 4x into a perfect square trinomial. You must add it to both sides to stay balanced.' }, { tex: '(x - 2)^2 = 5', text: 'Factor the left side as (x − 2)², since (x − 2)(x − 2) = x² − 4x + 4. The right side is 1 + 4 = 5.' }, { tex: 'x - 2 = \\pm\\sqrt{5}', text: 'Take the square root of both sides. Keep both signs, because both +√5 and −√5 square to 5.' }, { tex: 'x = 2 \\pm \\sqrt{5}', text: 'Add 2 to both sides. This matches the quadratic formula result, which is a good check that both methods agree.' }], answer: 'x = 2 \\pm \\sqrt{5}' },
    },
    {
      kind: 'example',
      head: 'Count without solving: 2x² + 3x + 5 = 0',
      body: 'The question only asks how many real solutions there are. You do not need to find them.',
      formula: { tex: 'b^2 - 4ac = 3^2 - 4(2)(5) = -31', note: 'Negative: the parabola never reaches the axis.', parts: [{ sym: '3^2', means: 'b squared, always positive or zero', tone: 'accent' }, { sym: '-31', means: 'negative, so zero real solutions', tone: 'bad' }] },
      steps: { steps: [{ tex: 'a = 2,\\ b = 3,\\ c = 5', text: 'Read the coefficients. For a count question you only need these three numbers, so there is no reason to solve the equation.' }, { tex: 'b^2 - 4ac = 3^2 - 4(2)(5) = 9 - 40', text: 'Compute the discriminant. It is the expression under the square root in the quadratic formula, so its sign decides whether the square root exists.' }, { tex: '9 - 40 = -31', text: 'Subtract. The result is negative, and no real number squared is negative, so the square root in the formula is not a real number.' }, { tex: '\\text{no real solutions}', text: 'Conclude zero real solutions. Test-day move: this takes about ten seconds, and it is much faster than solving. It also means the parabola floats above the x-axis.' }], answer: '0\\text{ real solutions}' },
    },
    {
      kind: 'example',
      head: 'Exactly one solution: x² + 6x + c = 0',
      body: 'For what value of c does x² + 6x + c = 0 have exactly one solution? Link "one solution" to the discriminant.',
      formula: { tex: '6^2 - 4c = 0 \\;\\Rightarrow\\; c = 9', note: 'Set the discriminant equal to zero and solve.', parts: [{ sym: '6^2', means: 'the square of the middle coefficient', tone: 'accent' }, { sym: 'c = 9', means: 'makes the quadratic a perfect square', tone: 'ok' }] },
      steps: { steps: [{ tex: 'b^2 - 4ac = 0', text: 'One solution happens when the plus and minus in the quadratic formula give the same number. That only occurs when the square root part is 0, so the discriminant must equal zero.' }, { tex: '6^2 - 4(1)(c) = 0', text: 'Substitute a = 1 and b = 6. The unknown is c, so this is now an ordinary equation in c.' }, { tex: '36 - 4c = 0 \\;\\Rightarrow\\; 4c = 36', text: 'Square 6 to get 36, then add 4c to both sides to move it across.' }, { tex: 'c = 9', text: 'Divide both sides by 4. Check: x² + 6x + 9 = (x + 3)², a perfect square with the single solution x = −3. Test-day move: take half of b, 3, and square it.' }], answer: 'c = 9' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a rectangle of area 40',
      body: 'A rectangle is 3 cm longer than it is wide, and its area is 40 square cm. Sketch it, name the width w, and find w.',
      art: shapeBox('w + 3', 'w', { wUnits: 8, hUnits: 5, inside: 'area 40', title: 'Width w, length w + 3', caption: 'A length cannot be negative, so throw out −8.' }),
      steps: { steps: [{ tex: 'w(w + 3) = 40', text: 'Label the width w and the length w + 3. Area is length times width, so set the product equal to 40.' }, { tex: 'w^2 + 3w - 40 = 0', text: 'Distribute the w and move 40 to the left. The equation must equal zero before you can factor and use the zero-product rule.' }, { tex: '(w + 8)(w - 5) = 0', text: 'Find two numbers that multiply to −40 and add to 3: they are 8 and −5. Then the zero-product rule gives w = −8 or w = 5.' }, { tex: 'w = 5', text: 'Reject w = −8, because a length cannot be negative. The picture is what tells you to throw it out.' }, { tex: '5 \\times 8 = 40', text: 'Check: the length is w + 3 = 8, and 5 × 8 = 40. Test-day move: if the choices are numbers, try 5 first, since 5 × 8 is quick to see.' }], answer: 'w = 5\\text{ cm}' },
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
      body: 'What is the sum of the solutions of 3x² − 12x + 7 = 0? You could solve with the formula twice and add, but there is a faster way.',
      steps: { steps: [{ tex: 'a = 3,\\ b = -12,\\ c = 7', text: 'Read the coefficients, keeping the minus sign on b. The sum formula needs a and b.' }, { tex: 'b^2 - 4ac = 144 - 84 = 60', text: 'Check that real solutions exist at all. The discriminant is 60, which is positive, so there are two real solutions to add.' }, { tex: 'r + s = -\\frac{b}{a}', text: 'Use the sum of solutions rule. In the formula the two answers are −b/2a plus and minus the same root, so the roots cancel when added and leave 2 · (−b/2a) = −b/a.' }, { tex: '-\\frac{-12}{3} = 4', text: 'Substitute: −(−12) ÷ 3 = 12 ÷ 3 = 4. Test-day move: this is a ten-second answer. Solving fully would give 2 ± √(15)/3, which adds to 4 as well.' }], answer: '4' },
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
      why: 'Each form is built so one number stands alone. At x = 0 every x-term in standard form disappears, leaving c. In vertex form, (x − h)² is never negative and is zero when x = h, so the vertex is at h with height k. In factored form, the product is zero exactly when x = r or x = s.',
    },
    {
      kind: 'concept',
      head: 'The sign of a sets the direction',
      body: 'When a is positive the parabola opens UP like a cup, and the vertex is the lowest point. When a is negative it opens DOWN, and the vertex is the highest point — a maximum.',
      art: funcGraph([{ f: (x) => x * x - 2, label: 'a > 0: up', color: SKY }, { f: (x) => -x * x + 2, label: 'a < 0: down', color: ROSE }], { range: { x: [-3, 3], y: [-5, 5] }, title: 'Cup or cap', caption: 'A positive a holds water; a negative a spills it.' }),
      why: 'For large x the term ax² beats the bx and c terms. If a is positive, ax² is positive on both sides, so the curve climbs both ways and the vertex is a low point. If a is negative, both sides fall, so the vertex is a high point. Try y = −x² + 2: at x = 0 it is 2, and at x = 3 it is −7.',
    },
    {
      kind: 'concept',
      head: 'The vertex sits halfway between the zeros',
      body: 'A parabola is symmetric, so its axis runs through the middle. For y = x² − 2x − 8, the zeros are −2 and 4, and halfway is 1. That is also −b/2a.',
      formula: { tex: 'x_{\\text{vertex}} = -\\frac{b}{2a} = \\frac{r + s}{2}', note: 'Average the zeros, or use −b/2a.', parts: [{ sym: '-b/2a', means: 'works straight from standard form', tone: 'accent' }, { sym: '(r + s)/2', means: 'the midpoint of the two zeros', tone: 'ok' }] },
      art: parabola({ a: 1, b: -2, c: -8 }, { range: { x: [-4, 6], y: [-11, 8] }, roots: [-2, 4], title: 'Symmetric about x = 1', caption: 'Halfway between −2 and 4 is 1.' }),
      why: 'A parabola is a mirror image across its axis, so any two points at the same height are the same distance from the axis. The two zeros are both at height 0, so the axis is exactly between them. In the formula, the zeros are −b/2a plus and minus the same amount, so their average is −b/2a.',
    },
    {
      kind: 'example',
      head: 'Read the vertex: y = (x − 3)² + 5',
      body: 'Find the vertex of y = (x − 3)² + 5. Vertex form shows it without any work if you read the signs correctly.',
      formula: { tex: 'y = (x - 3)^2 + 5', note: 'Vertex (3, 5): flip the sign inside, keep the one outside.', parts: [{ sym: 'x - 3', means: 'h = 3, the opposite of the sign you see', tone: 'accent' }, { sym: '+5', means: 'k = 5, exactly as written', tone: 'ok' }] },
      steps: { steps: [{ tex: 'y = a(x - h)^2 + k', text: 'Match the equation to vertex form. The vertex is (h, k), so you only need to read off h and k.' }, { tex: 'x - 3 = x - h \\;\\Rightarrow\\; h = 3', text: 'Compare the inside. The form has x − h, so x − 3 means h = 3. The sign flips from what you see, because x − h is zero when x = h.' }, { tex: 'k = 5', text: 'The number added outside is k exactly as written, with no sign flip. It is the height of the vertex.' }, { tex: '(x - 3)^2 \\ge 0 \\;\\Rightarrow\\; y \\ge 5', text: 'Check that it makes sense: a square is never negative, so y is smallest when x = 3, where the square is 0 and y = 5.' }], answer: '(3,\\,5)' },
    },
    {
      kind: 'example',
      head: 'Read the zeros: y = (x + 2)(x − 6)',
      body: 'Find the zeros and the vertex of y = (x + 2)(x − 6) without expanding it.',
      art: parabola({ a: 1, b: -4, c: -12 }, { range: { x: [-4, 8], y: [-18, 8] }, roots: [-2, 6], title: 'Zeros at −2 and 6', caption: 'Halfway between them, at x = 2, is the vertex.' }),
      steps: { steps: [{ tex: 'x + 2 = 0 \\text{ or } x - 6 = 0', text: 'The zeros are where y = 0. By the zero-product rule, y is zero exactly when one factor is zero, so set each factor to zero.' }, { tex: 'x = -2 \\text{ or } x = 6', text: 'Solve each. Notice the signs flip: (x + 2) gives −2, and (x − 6) gives +6.' }, { tex: 'x = \\frac{-2 + 6}{2} = 2', text: 'A parabola is symmetric, so its vertex lies on the line halfway between the zeros. Average them: (−2 + 6) ÷ 2 = 2.' }, { tex: 'y = (2 + 2)(2 - 6) = 4(-4) = -16', text: 'Plug x = 2 into the original to get the vertex height. The result is negative, which fits a cup-shaped parabola that dips below the axis between its zeros.' }], answer: '\\text{zeros } -2,\\ 6;\\ \\text{vertex } (2,\\,-16)' },
    },
    {
      kind: 'example',
      head: 'Find the vertex: y = x² − 8x + 10',
      body: 'The vertex is hidden in standard form, so compute it. Find the x-coordinate first, then the y-coordinate.',
      steps: { steps: [{ tex: 'a = 1,\\ b = -8', text: 'Read a and b from standard form. The formula for the vertex needs only these two.' }, { tex: 'x = -\\frac{b}{2a} = -\\frac{-8}{2(1)} = 4', text: 'Use x = −b/2a. It is the average of the two zeros (−b ± √…) ÷ 2a, because the plus and minus parts cancel. The vertex is on the axis of symmetry, which is exactly there.' }, { tex: 'y = 4^2 - 8(4) + 10', text: 'Put x = 4 back into the original equation to get the y-coordinate. The vertex is a point on the curve, so it must satisfy the equation.' }, { tex: 'y = 16 - 32 + 10 = -6', text: 'Compute carefully: 16 − 32 = −16, then −16 + 10 = −6. Test-day move: type the function into the graphing calculator and read the minimum.' }], answer: '(4,\\,-6)' },
    },
    {
      kind: 'example',
      head: 'Another way: average the zeros',
      body: 'Find the vertex of y = (x − 1)(x − 7). You do not need to multiply it out, because the factors already show the zeros.',
      table: { head: ['Step', 'Value'], rows: [['zeros', '1 and 7'], ['midpoint x', '(1 + 7) ÷ 2 = 4'], ['y at x = 4', '(3)(−3) = −9']], mark: 2, note: 'Two short lines instead of expanding.' },
      steps: { steps: [{ tex: 'x - 1 = 0 \\text{ or } x - 7 = 0', text: 'Read the zeros from the factored form. Each factor is zero at one x-value, so the zeros are x = 1 and x = 7.' }, { tex: 'x = \\frac{1 + 7}{2} = 4', text: 'Average the zeros. A parabola is a mirror image on both sides of its axis, so the vertex is exactly halfway between the two crossings.' }, { tex: 'y = (4 - 1)(4 - 7) = (3)(-3)', text: 'Substitute x = 4 into the factored form. This is easier than expanding to x² − 8x + 7 first.' }, { tex: 'y = -9', text: 'Multiply: 3 times −3 is −9. Test-day move: this is two short lines, and expanding would be four.' }], answer: '(4,\\,-9)' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a thrown ball',
      body: 'A ball height is h(t) = −16t² + 64t feet after t seconds. Sketch the shape, then find the highest point.',
      art: parabola({ a: -16, b: 64, c: 0 }, { range: { x: [0, 5], y: [0, 80] }, xLabel: 't', yLabel: 'h', title: 'Up for 2 seconds, down for 2', caption: 'The vertex of a downward parabola is its maximum.' }),
      steps: { steps: [{ tex: 'a = -16 < 0', text: 'Read the sign of a. It is negative, so the parabola opens downward like a cap, and the vertex is the highest point. That is why the ball goes up and then comes back down.' }, { tex: 't = -\\frac{b}{2a} = -\\frac{64}{2(-16)} = 2', text: 'Use t = −b/2a to find when the top happens. Another way: h(t) = −16t(t − 4) has zeros at 0 and 4, and the halfway time is 2.' }, { tex: 'h(2) = -16(4) + 64(2)', text: 'Put t = 2 into the formula to get the height. The question asks for the height, not the time, so you need this second step.' }, { tex: 'h(2) = -64 + 128 = 64', text: 'Compute: −16 times 4 is −64, and 64 times 2 is 128. The ball peaks at 64 feet after 2 seconds, and it lands at t = 4.' }], answer: '64\\text{ feet}' },
    },
    {
      kind: 'example',
      head: 'Standard to vertex: y = x² + 6x + 5',
      body: 'Rewrite y = x² + 6x + 5 in vertex form by completing the square. Add and subtract the same number so the value does not change.',
      steps: { steps: [{ tex: '\\left(\\tfrac{6}{2}\\right)^2 = 9', text: 'Take half of the x-coefficient and square it. This is the number that turns x² + 6x into a perfect square.' }, { tex: 'y = x^2 + 6x + 9 - 9 + 5', text: 'Add 9 and subtract 9. Adding and subtracting the same number is the same as adding 0, so the equation is unchanged.' }, { tex: 'y = (x + 3)^2 - 9 + 5', text: 'Group the first three terms as (x + 3)², because (x + 3)(x + 3) = x² + 6x + 9. Leave −9 + 5 alone for now.' }, { tex: 'y = (x + 3)^2 - 4', text: 'Combine −9 + 5 = −4. The vertex is (−3, −4), because the inside sign flips. Check: −b/2a = −3, and y(−3) = 9 − 18 + 5 = −4.' }], answer: 'y = (x + 3)^2 - 4' },
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
      body: 'A parabola has vertex (2, 3) and passes through (4, 11). Find a in y = a(x − 2)² + 3. Use the point you know to solve for the one unknown.',
      steps: { steps: [{ tex: '11 = a(4 - 2)^2 + 3', text: 'Substitute the point (4, 11) for x and y. Any point on the parabola must satisfy its equation, and this gives an equation with only a left.' }, { tex: '11 = a(2)^2 + 3 = 4a + 3', text: 'Simplify inside the parentheses first: 4 − 2 = 2, and 2² = 4. So the right side is 4a + 3.' }, { tex: '8 = 4a', text: 'Subtract 3 from both sides to get the term with a alone. 11 − 3 = 8.' }, { tex: 'a = 2', text: 'Divide both sides by 4. Check: with a = 2, y at x = 4 is 2(4) + 3 = 11, and a is positive, so the parabola opens up from the vertex.' }], answer: 'a = 2' },
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
      why: 'A crossing point has the same x and y on both graphs, so setting the two expressions equal finds it. That leaves a quadratic in x, which has at most two solutions. Check: x² = x + 2 gives x² − x − 2 = 0, discriminant 9, so two crossings. Using x² = x − 2 gives discriminant −7, so none.',
    },
    {
      kind: 'concept',
      head: 'The Factor Theorem',
      body: 'If plugging a into a polynomial gives zero, then (x − a) is one of its factors. And a zero of the factor is a zero of the graph. Factors and zeros are the same information.',
      formula: { tex: 'p(a) = 0 \\iff (x - a) \\text{ is a factor}', note: 'Zeros and factors come in matching pairs.', parts: [{ sym: 'p(a) = 0', means: 'the graph crosses the x-axis at a', tone: 'accent' }, { sym: 'x - a', means: 'the matching factor, with the sign flipped', tone: 'ok' }] },
      art: funcGraph([{ f: (x) => (x + 1) * (x - 2) * (x - 5) / 2, color: VIO }], { range: { x: [-2, 6], y: [-10, 10] }, zeros: [{ at: -1, label: 'x + 1' }, { at: 2, label: 'x − 2' }, { at: 5, label: 'x − 5' }], title: 'Each zero names a factor', caption: 'Zeros at −1, 2, and 5 mean factors (x + 1), (x − 2), (x − 5).' }),
      why: 'Dividing by (x − a) gives p(x) = (x − a)q(x) + r, where r is the remainder. Put in x = a and the first part is 0, so p(a) = r. If p(a) = 0, the remainder is 0, so (x − a) divides evenly. Check with x² − 5x + 6: p(2) = 4 − 10 + 6 = 0, and (x − 2) is a factor.',
    },
    {
      kind: 'concept',
      head: 'The Remainder Theorem',
      body: 'Dividing p(x) by (x − a) leaves a remainder of exactly p(a). So you never need long division to find a remainder — just plug in.',
      formula: { tex: '\\begin{gathered} p(x) \\div (x - a) \\\\ \\text{leaves remainder } p(a) \\end{gathered}', note: 'Plug in the number that makes the divisor zero.', parts: [{ sym: 'x - a', means: 'the divisor; it is zero at x = a', tone: 'accent' }, { sym: 'p(a)', means: 'the remainder, found by substitution', tone: 'ok' }] },
      why: 'Division gives p(x) = (x − a)q(x) + r. If you substitute x = a, the term (x − a)q(x) becomes 0 times something, which is 0, and only r is left. Check: x² − 1 divided by x − 3 gives (x + 3) with remainder 8, since (x − 3)(x + 3) + 8 = x² − 1. And p(3) = 9 − 1 = 8.',
    },
    {
      kind: 'example',
      head: 'Solve y = x² and y = x + 6',
      body: 'The curve and the line are both equal to y. Find where they meet by making them equal to each other.',
      steps: { steps: [{ tex: 'x^2 = x + 6', text: 'Both expressions equal y at a crossing point, so they equal each other there. This is substitution, and it leaves one equation in x only.' }, { tex: 'x^2 - x - 6 = 0', text: 'Subtract x and 6 from both sides to get zero on one side. A quadratic must be set to zero before you can factor it.' }, { tex: '(x - 3)(x + 2) = 0', text: 'Factor: find two numbers that multiply to −6 and add to −1, which are −3 and 2. Then the zero-product rule gives x = 3 or x = −2.' }, { tex: 'y = x + 6 = 9 \\text{ or } 4', text: 'Find y for each x. Use the line, because it is easier than squaring. Check with the parabola: 3² = 9 and (−2)² = 4, which agree.' }], answer: '(3,\\,9),\\ (-2,\\,4)' },
    },
    {
      kind: 'example',
      head: 'Is (x − 2) a factor of x³ − 4x² + x + 6?',
      body: 'Is (x − 2) a factor of x³ − 4x² + x + 6? By the Factor Theorem, you only need to check p(2).',
      steps: { steps: [{ tex: 'p(x) = x^3 - 4x^2 + x + 6', text: 'Name the polynomial. The Factor Theorem says (x − 2) is a factor exactly when p(2) = 0, so you only need to evaluate at 2.' }, { tex: 'p(2) = 2^3 - 4(2)^2 + 2 + 6 = 8 - 16 + 2 + 6', text: 'Substitute x = 2 everywhere. Do the powers first: 2³ = 8 and 2² = 4, so 4 times 4 is 16.' }, { tex: '8 - 16 + 2 + 6 = 0', text: 'Add left to right: 8 − 16 = −8, then −8 + 2 = −6, then −6 + 6 = 0.' }, { tex: 'p(2) = 0 \\Rightarrow (x - 2) \\text{ is a factor}', text: 'The remainder is zero, so (x − 2) divides evenly. Test-day move: this is one substitution, and it is far faster than long division.' }], answer: '\\text{Yes}' },
    },
    {
      kind: 'example',
      head: 'A remainder in one line',
      body: 'Find the remainder when x² + 3x − 5 is divided by x − 2. The Remainder Theorem lets you skip long division.',
      table: { head: ['Term', 'At x = 2'], rows: [['x²', '4'], ['3x', '6'], ['−5', '−5'], ['p(2)', '5']], mark: 3, note: 'No long division needed.' },
      steps: { steps: [{ tex: 'x - 2 = 0 \\Rightarrow x = 2', text: 'Find the number that makes the divisor zero. The Remainder Theorem says the remainder is p at that number.' }, { tex: 'p(2) = 2^2 + 3(2) - 5', text: 'Substitute 2 for x. This works because p(x) = (x − 2)q(x) + r, and the first part vanishes at x = 2.' }, { tex: 'p(2) = 4 + 6 - 5 = 5', text: 'Add up: 4 + 6 = 10, then 10 − 5 = 5. The remainder is 5. Check: (x − 2)(x + 5) + 5 = x² + 3x − 10 + 5 = x² + 3x − 5.' }], answer: '5' },
    },
    {
      kind: 'example',
      head: 'Cross-multiply: 6/x = 3/(x − 2)',
      body: 'With one fraction on each side, you can cross-multiply. Solve the equation that results, then check that no denominator becomes zero.',
      steps: { steps: [{ tex: '6(x - 2) = 3x', text: 'Cross-multiply. This is the same as multiplying both sides by x(x − 2), which cancels both denominators. It is allowed as long as x is not 0 or 2.' }, { tex: '6x - 12 = 3x', text: 'Distribute the 6 across the parentheses: 6 times x is 6x, and 6 times −2 is −12.' }, { tex: '3x = 12', text: 'Subtract 3x from both sides and add 12 to both sides, which gets the x-terms together and the numbers on the other side.' }, { tex: 'x = 4', text: 'Divide both sides by 3. Now check: x = 4 is not 0 or 2, so no denominator is zero. In the original, 6/4 = 1.5 and 3/2 = 1.5.' }], answer: 'x = 4' },
    },
    {
      kind: 'example',
      head: 'Another way: test the choices',
      body: 'Instead of cross-multiplying 6/x = 3/(x − 2), try the answer choices. Substitute each value into both sides.',
      table: { head: ['x', '6/x', '3/(x − 2)'], rows: [['2', '3', 'undefined'], ['4', '1.5', '1.5'], ['6', '1', '0.75']], mark: 1, note: 'Only x = 4 makes the sides equal.' },
      steps: { steps: [{ tex: 'x = 2: \\ \\tfrac{3}{2 - 2} = \\tfrac{3}{0}', text: 'Throw out any choice that zeros a denominator. At x = 2 the right side is undefined, so it cannot be a solution. This saves work at once.' }, { tex: 'x = 4: \\ \\tfrac{6}{4} = 1.5, \\ \\tfrac{3}{4 - 2} = 1.5', text: 'Try the next choice. Both sides are 1.5, so they are equal, and x = 4 satisfies the equation.' }, { tex: 'x = 6: \\ \\tfrac{6}{6} = 1, \\ \\tfrac{3}{4} = 0.75', text: 'Check another choice to be sure. The sides differ (1 versus 0.75), so x = 6 fails.' }, { tex: 'x = 4', text: 'Pick the choice that works. Test-day move: plugging in choices is slower than algebra for hard problems but very safe when the algebra looks messy.' }], answer: 'x = 4' },
    },
    {
      kind: 'example',
      head: 'From zeros to factors',
      body: 'A polynomial has zeros at −1, 2, and 5. Write a polynomial that has them, using the Factor Theorem.',
      formula: { tex: '(x + 1)(x - 2)(x - 5)', note: 'Flip the sign of each zero to write its factor.', parts: [{ sym: 'x + 1', means: 'from the zero at −1', tone: 'accent' }, { sym: 'x - 5', means: 'from the zero at 5', tone: 'ok' }] },
      steps: { steps: [{ tex: 'p(a) = 0 \\iff (x - a) \\text{ is a factor}', text: 'Start from the Factor Theorem. A zero at a means a factor (x − a), and each zero gives one factor.' }, { tex: '-1 \\to (x + 1),\\ \\ 2 \\to (x - 2),\\ \\ 5 \\to (x - 5)', text: 'Write a factor for each zero. For −1 the factor is x − (−1) = x + 1, so the sign flips. A factor is zero at the opposite of the number you see.' }, { tex: 'p(x) = a(x + 1)(x - 2)(x - 5)', text: 'Multiply the factors together. A constant a in front is allowed, because multiplying by a number does not move any zero.' }, { tex: 'p(-1) = p(2) = p(5) = 0', text: 'Check each zero: at x = −1 the first factor is 0, at x = 2 the second is 0, and at x = 5 the third is 0. So every zero is accounted for.' }], answer: 'p(x) = a(x + 1)(x - 2)(x - 5)' },
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
      steps: { steps: [{ tex: 'x^2 = 2x + b', text: 'Set the two expressions equal. A shared point has the same y-value on both graphs.' }, { tex: 'x^2 - 2x - b = 0', text: 'Move everything to the left so the equation equals zero. Now the quadratic has a = 1, a middle coefficient of −2, and a constant of −b, where b is the unknown.' }, { tex: '(-2)^2 - 4(1)(-b) = 0', text: 'Touching at one point means exactly one solution, so the discriminant is 0. Substitute a = 1, the middle coefficient −2, and the constant −b into b² − 4ac.' }, { tex: '4 + 4b = 0', text: 'Simplify: (−2)² = 4, and −4 times −b is +4b. So the equation is 4 + 4b = 0.' }, { tex: 'b = -1', text: 'Subtract 4 and divide by 4. Check: x² − 2x + 1 = (x − 1)², a perfect square with one solution x = 1. There y = 1 for both graphs.' }], answer: 'b = -1' },
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
      why: 'At x = 0 the power b⁰ equals 1, so y = a, which makes a the starting value. Every time x goes up by 1, you multiply by one more b. For y = 5 · 3ˣ the values are 5, 15, 45, 135, and each is 3 times the one before.',
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
      why: 'Growing by 5% means adding 5% of the amount to itself: A + 0.05A. Factoring out A gives A(1 + 0.05) = 1.05A. Shrinking by 5% is A − 0.05A = 0.95A. For example, 5% more than 200 is 200 + 10 = 210, and 200 times 1.05 is also 210.',
    },
    {
      kind: 'concept',
      head: 'Decay gets close to zero but never reaches it',
      body: 'Halving 100 again and again gives 50, 25, 12.5, and so on. It keeps shrinking but never hits zero, because half of something is still something.',
      art: funcGraph([{ f: (x) => 100 * Math.pow(0.5, x), color: EMR }], { range: { x: [0, 6], y: [0, 110] }, hAsymptote: { at: 0 }, points: [{ x: 1, y: 50, label: '50', color: SKY }, { x: 2, y: 25, label: '25', color: SKY }], title: 'Halving every step', caption: 'The curve flattens toward the axis without touching it.' }),
      why: 'Each step multiplies by a positive factor less than 1, and a positive number times a positive number is still positive. So the value shrinks every time but cannot reach 0. Halving 100 gives 50, 25, 12.5, 6.25, and 3.125. These values keep falling, but each one is half of something positive.',
    },
    {
      kind: 'example',
      head: 'Build a model: a town growing 3%',
      body: 'A town of 2,000 people grows 3% a year. Write a model P(t) for the population after t years.',
      formula: { tex: 'P(t) = 2000(1.03)^{t}', note: 'Start times factor to the number of years.', parts: [{ sym: '2000', means: 'the population at t = 0', tone: 'accent' }, { sym: '1.03', means: 'keep 100% and add 3% each year', tone: 'ok' }] },
      steps: { steps: [{ tex: 'a = 2000', text: 'The starting amount is the value at t = 0, which is the 2,000 people today. This is the a in a · bᵗ.' }, { tex: 'b = 1 + 0.03 = 1.03', text: 'Find the yearly factor. Growing 3% means keeping 100% and adding 3%, so each year the population is 1.03 times the year before.' }, { tex: '2000(1.03) = 2060,\\ \\ 2060(1.03) = 2121.8', text: 'Check the pattern for the first two years. Each year multiplies by 1.03 again, so after t years you have multiplied t times.' }, { tex: 'P(t) = 2000(1.03)^{t}', text: 'Write the repeated multiplication as a power. Test-day move: the model is the start times the factor to the power of the number of years.' }], answer: 'P(t) = 2000(1.03)^{t}' },
    },
    {
      kind: 'example',
      head: 'Decay: a $900 phone losing 20% a year',
      body: 'A $900 phone loses 20% of its value each year. Find its value after 2 years.',
      steps: { steps: [{ tex: 'b = 1 - 0.20 = 0.8', text: 'The factor is what you keep. Losing 20% leaves 80%, so each year the value is multiplied by 0.8, not 0.2.' }, { tex: 'V = 900(0.8)^t', text: 'Write the model: the start is 900, and the factor is applied once per year, so the exponent is the number of years.' }, { tex: '900(0.8)^2 = 900(0.64)', text: 'Put in t = 2. First square the factor: 0.8 times 0.8 is 0.64.' }, { tex: '900 \\times 0.64 = 576', text: 'Multiply: 900 times 0.64 is 576. Check year by year: 900 × 0.8 = 720, then 720 × 0.8 = 576.' }], answer: '\\$576' },
    },
    {
      kind: 'example',
      head: 'Doubling every 4 hours',
      body: 'Bacteria start at 100 and double every 4 hours. How many are there after 12 hours?',
      formula: { tex: 'N = 100 \\cdot 2^{t/4}', note: 'The exponent counts how many doublings have happened.', parts: [{ sym: 't/4', means: 'hours divided by the doubling time', tone: 'accent' }, { sym: '2', means: 'doubling means a factor of 2', tone: 'ok' }] },
      steps: { steps: [{ tex: 'N = 100 \\cdot 2^{t/4}', text: 'Write the model. The factor is 2 because the amount doubles, and the exponent counts doublings, which is hours divided by the 4 hours it takes to double.' }, { tex: '\\frac{12}{4} = 3', text: 'Put in t = 12. The exponent is 3, so there are 3 doublings in 12 hours.' }, { tex: 'N = 100 \\cdot 2^3 = 100 \\cdot 8', text: 'Compute the power: 2³ = 2 times 2 times 2, which is 8.' }, { tex: 'N = 800', text: 'Multiply 100 by 8. Test-day move: for small numbers just double three times, 100, 200, 400, 800.' }], answer: '800' },
    },
    {
      kind: 'example',
      head: 'Another way: count the doublings in a table',
      body: 'Skip the formula and build a table. Start at 100 and double at every 4-hour mark until you reach 12 hours.',
      table: { head: ['Hours', 'Bacteria'], rows: [['0', '100'], ['4', '200'], ['8', '400'], ['12', '800']], mark: 3, note: 'Each row doubles the one before.' },
      steps: { steps: [{ tex: '\\text{hour } 0:\\ 100', text: 'Begin with the starting amount. At hour 0 nothing has doubled yet, so there are 100.' }, { tex: '\\text{hour } 4:\\ 200,\\ \\ \\text{hour } 8:\\ 400', text: 'Double once for each 4 hours. Doubling means multiplying by 2, so 100 becomes 200, and 200 becomes 400.' }, { tex: '\\text{hour } 12:\\ 800', text: 'Double once more to reach 12 hours. This is the third doubling, and 400 times 2 is 800.' }, { tex: '100 \\cdot 2^3 = 800', text: 'Compare with the formula. Three doublings is 2³ = 8, and 100 times 8 is 800, so both methods agree.' }], answer: '800' },
    },
    {
      kind: 'example',
      head: 'Read the percent: f(t) = 50(0.9)ᵗ',
      body: 'In f(t) = 50(0.9)ᵗ, what percent does the value change by each step?',
      art: bars([{ name: 'f(t)', vals: [50, 45, 40.5, 36.45], color: VIO }], { labels: ['t = 0', 't = 1', 't = 2', 't = 3'], title: 'Keep 90% each step', caption: 'Every bar is 90% of the one before it.' }),
      steps: { steps: [{ tex: 'b = 0.9', text: 'Find the factor, the number being raised to the power t. In a · bᵗ, b is what you multiply by each step.' }, { tex: '0.9 < 1', text: 'Compare b with 1. A factor below 1 shrinks the value, so this is decay, not growth.' }, { tex: '1 - 0.9 = 0.1', text: 'Subtract the factor from 1 to get the rate. The function keeps 90% each step, so it loses 10%.' }, { tex: '50 \\to 45', text: 'Check with numbers. At t = 0 the value is 50, and at t = 1 it is 45, a drop of 5, which is 10% of 50.' }], answer: '\\text{decreases by } 10\\%' },
    },
    {
      kind: 'example',
      head: 'Linear or exponential? 3, 6, 12, 24',
      body: 'Is the pattern 3, 6, 12, 24 linear or exponential? Compare the differences and the ratios.',
      table: { head: ['x', 'y', 'Difference', 'Ratio'], rows: [['0', '3', '—', '—'], ['1', '6', '+3', '×2'], ['2', '12', '+6', '×2'], ['3', '24', '+12', '×2']], note: 'Equal ratios mean exponential.' },
      steps: { steps: [{ tex: '6 - 3 = 3,\\ \\ 12 - 6 = 6,\\ \\ 24 - 12 = 12', text: 'Check the differences first. A linear pattern adds the same amount every time, and these differences keep changing, so it is not linear.' }, { tex: '\\tfrac{6}{3} = 2,\\ \\ \\tfrac{12}{6} = 2,\\ \\ \\tfrac{24}{12} = 2', text: 'Now check the ratios. An exponential pattern multiplies by the same factor every time, and each ratio here is 2.' }, { tex: 'y = 3 \\cdot 2^{x}', text: 'Write the model. The start is 3 and the factor is 2. Check with x = 3: 3 × 8 = 24, which matches the table.' }], answer: '\\text{exponential, factor } 2' },
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
      steps: { steps: [{ tex: 'b = 1 + 0.06 = 1.06', text: 'Build the yearly factor. Keeping all the money and adding 6% interest means multiplying by 1.06.' }, { tex: 'A = 1000(1.06)^t', text: 'Write the model. Compounded means interest is added to the balance each year, so next year interest is earned on a bigger amount. That is why it is exponential, not linear.' }, { tex: '1.06^2 = 1.1236', text: 'Put in t = 2 and square the factor: 1.06 times 1.06 is 1.1236.' }, { tex: '1000 \\times 1.1236 = 1123.60', text: 'Multiply by 1000, which moves the decimal point three places. Check: year 1 is $1,060, and year 2 adds 6% of 1,060, which is $63.60, giving $1,123.60.' }], answer: '\\$1{,}123.60' },
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
      why: 'Start with a/b = c/d and multiply both sides by b · d. On the left the b cancels, leaving a · d. On the right the d cancels, leaving c · b. So cross-multiplying is just clearing both denominators. Check: 2/3 = 4/6 gives 2 · 6 = 12 and 3 · 4 = 12.',
    },
    {
      kind: 'concept',
      head: 'Converting: multiply by a clever 1',
      body: '12 inches over 1 foot equals 1, so multiplying by it changes the units but not the amount. Choose the fraction so the unit you want gone is on the bottom and cancels.',
      formula: { tex: '3\\text{ ft} \\times \\frac{12\\text{ in}}{1\\text{ ft}} = 36\\text{ in}', note: 'Feet cancel feet, leaving inches.', parts: [{ sym: '\\tfrac{12\\text{ in}}{1\\text{ ft}}', means: 'a fraction equal to 1, with feet on the bottom', tone: 'accent' }, { sym: '36\\text{ in}', means: 'the same length, new units', tone: 'ok' }] },
      why: 'Since 12 inches and 1 foot are the same length, the fraction 12 in / 1 ft is a number divided by itself, which is 1. Multiplying by 1 never changes an amount, only how it is written. Putting feet on the bottom lets them cancel with feet on top, just like common factors.',
    },
    {
      kind: 'concept',
      head: 'A ratio splits a whole into parts',
      body: 'Red to blue in a 2 : 3 ratio means every group of 5 marbles has 2 red and 3 blue. With 40 marbles, one part is 40 ÷ 5 = 8. So there are 16 red and 24 blue.',
      art: tape([{ label: 'red', boxes: 2, each: '8', color: ROSE }, { label: 'blue', boxes: 3, each: '8', color: SKY }], { title: '2 : 3 with 40 in all', total: '5 parts, each part is 8', caption: 'Find one part, then count parts.' }),
      why: 'A 2 : 3 ratio means the whole is cut into 2 + 3 = 5 equal pieces, with red getting 2 of them and blue 3. Since the pieces are equal, one piece is the total divided by 5. For 40 marbles that is 8, so red is 2 × 8 = 16 and blue is 3 × 8 = 24, which adds back to 40.',
    },
    {
      kind: 'example',
      head: 'Unit rate: 210 miles on 6 gallons',
      body: 'A car goes 210 miles on 6 gallons. How far does it go on 10 gallons? Find the miles for one gallon first.',
      steps: { steps: [{ tex: '210 \\div 6 = 35', text: 'Divide miles by gallons to get the unit rate. This tells you how many miles one gallon buys, and the units are miles per gallon.' }, { tex: '35\\ \\tfrac{\\text{mi}}{\\text{gal}}', text: 'Name the units. Writing them keeps the setup honest, since miles over gallons is the rate the problem needs.' }, { tex: '35 \\times 10 = 350', text: 'Multiply the rate by 10 gallons. The gallons cancel, leaving miles, which is the unit the question asks for.' }, { tex: '\\tfrac{350}{10} = 35', text: 'Check by dividing back: 350 miles over 10 gallons is 35 miles per gallon, the same rate. Test-day move: scale the whole ratio instead.' }], answer: '350\\text{ miles}' },
    },
    {
      kind: 'example',
      head: 'Another way: scale the whole ratio',
      body: 'Skip the unit rate for 210 miles on 6 gallons. Scale the whole ratio up to 10 gallons in one move.',
      table: { head: ['Gallons', 'Miles'], rows: [['6', '210'], ['× 10/6', '× 10/6'], ['10', '350']], mark: 2, note: 'Multiply both columns by the same factor and the ratio holds.' },
      steps: { steps: [{ tex: '\\tfrac{10}{6}', text: 'Find the scale factor. Going from 6 gallons to 10 gallons multiplies the gallons by 10/6.' }, { tex: '210 \\times \\tfrac{10}{6}', text: 'Multiply the miles by the same factor. A ratio stays the same only if both parts are scaled by the same number.' }, { tex: '\\tfrac{2100}{6}', text: 'Multiply the top first: 210 times 10 is 2100. Then divide by 6.' }, { tex: '2100 \\div 6 = 350', text: 'Divide: 6 goes into 2100 exactly 350 times. This matches the unit-rate answer, and it needs only one calculation.' }], answer: '350\\text{ miles}' },
    },
    {
      kind: 'example',
      head: 'Solve a proportion: 3/8 = x/56',
      body: 'Solve 3/8 = x/56. Both fractions have the same units in the same spot, so you can cross-multiply.',
      steps: { steps: [{ tex: '\\tfrac{3}{8} = \\tfrac{x}{56}', text: 'Check that the ratios match in the same order, the top with the top and the bottom with the bottom. Then it is safe to cross-multiply.' }, { tex: '8x = 3 \\cdot 56', text: 'Cross-multiply. This is the same as multiplying both sides by 8 and 56, which clears the denominators.' }, { tex: '8x = 168', text: 'Multiply 3 by 56 to get 168, since 3 times 50 is 150 and 3 times 6 is 18.' }, { tex: 'x = \\tfrac{168}{8} = 21', text: 'Divide both sides by 8 to undo the multiplication. Check: 21/56 simplifies to 3/8 when you divide top and bottom by 7. Test-day move: 56 is 8 × 7, so x is 3 × 7.' }], answer: 'x = 21' },
    },
    {
      kind: 'example',
      head: 'Chain conversions: 90 km/h in m/s',
      body: 'Convert 90 km/h to meters per second. Two units change, so you need two fractions that equal 1.',
      formula: { tex: '90\\,\\tfrac{\\text{km}}{\\text{h}} \\cdot \\tfrac{1000\\text{ m}}{1\\text{ km}} \\cdot \\tfrac{1\\text{ h}}{3600\\text{ s}} = 25\\,\\tfrac{\\text{m}}{\\text{s}}', note: 'Every unwanted unit appears once on top and once on the bottom.', parts: [{ sym: '\\tfrac{1000\\text{ m}}{1\\text{ km}}', means: 'cancels kilometers, brings in meters', tone: 'accent' }, { sym: '\\tfrac{1\\text{ h}}{3600\\text{ s}}', means: 'cancels hours, brings in seconds', tone: 'ok' }] },
      steps: { steps: [{ tex: '90\\,\\tfrac{\\text{km}}{\\text{h}} \\cdot \\tfrac{1000\\text{ m}}{1\\text{ km}}', text: 'Convert kilometers to meters. Put km on the bottom of the fraction so it cancels with the km on top. 1000 m equals 1 km, so the fraction is worth 1.' }, { tex: '= 90{,}000\\,\\tfrac{\\text{m}}{\\text{h}}', text: 'Multiply 90 by 1000. The kilometers have cancelled, so you now have meters per hour.' }, { tex: '\\cdot \\tfrac{1\\text{ h}}{3600\\text{ s}}', text: 'Convert hours to seconds. Put hours on top so they cancel with the hours on the bottom. There are 60 × 60 = 3600 seconds in an hour.' }, { tex: '\\tfrac{90{,}000}{3600} = 25', text: 'Divide 90,000 by 3600. Test-day move: divide km/h by 3.6 to get m/s, and 90 ÷ 3.6 = 25.' }], answer: '25\\,\\tfrac{\\text{m}}{\\text{s}}' },
    },
    {
      kind: 'example',
      head: 'Picture it first: boys and girls, 4 : 5',
      body: 'A class of 36 has boys to girls in the ratio 4 : 5. Draw boxes for each group, then find the number of girls.',
      art: tape([{ label: 'boys', boxes: 4, each: '4', color: SKY }, { label: 'girls', boxes: 5, each: '4', color: AMB }], { title: '9 equal boxes make 36', total: 'girls: 5 × 4 = 20', caption: 'The drawing turns a ratio into a division.' }),
      steps: { steps: [{ tex: '4 + 5 = 9', text: 'Count the boxes in the picture: 4 for boys and 5 for girls make 9 equal boxes. The ratio says the groups are made of equal-sized parts.' }, { tex: '36 \\div 9 = 4', text: 'Divide the whole class by the number of boxes to find the size of one box. Equal boxes must share the 36 evenly.' }, { tex: '5 \\times 4 = 20', text: 'Girls fill 5 boxes, so multiply 5 by the size of a box.' }, { tex: '16 + 20 = 36', text: 'Check that the parts add back to the whole: 4 × 4 = 16 boys, and 16 + 20 is 36. Test-day move: girls are 5/9 of the class, and 5/9 of 36 is 20.' }], answer: '20\\text{ girls}' },
    },
    {
      kind: 'example',
      head: 'A map scale: 1 inch to 25 miles',
      body: 'Two towns are 3.2 inches apart on a map where 1 inch stands for 25 miles. How far apart are they in real life?',
      table: { head: ['Map (in)', 'Real (mi)'], rows: [['1', '25'], ['2', '50'], ['3.2', '80']], mark: 2, note: 'Every inch is another 25 miles.' },
      steps: { steps: [{ tex: '\\tfrac{25\\text{ mi}}{1\\text{ in}}', text: 'Write the scale as a rate. It tells you miles per inch, so every inch on the map is worth 25 real miles.' }, { tex: '3.2\\text{ in} \\times 25\\,\\tfrac{\\text{mi}}{\\text{in}}', text: 'Multiply the map distance by the rate. The inches cancel, which leaves miles, the unit the question wants.' }, { tex: '3 \\times 25 + 0.2 \\times 25 = 75 + 5', text: 'Split 3.2 into 3 and 0.2 to multiply by hand. 0.2 times 25 is 5, because 0.2 is one fifth of 25.' }, { tex: '75 + 5 = 80', text: 'Add the two parts. Test-day move: 25 is a quarter of 100, so 3.2 × 100 = 320 and 320 ÷ 4 = 80.' }], answer: '80\\text{ miles}' },
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
      body: 'Convert 60 miles per hour to feet per second. There are 5,280 feet in a mile and 3,600 seconds in an hour.',
      steps: { steps: [{ tex: '60\\,\\tfrac{\\text{mi}}{\\text{h}} \\cdot \\tfrac{5280\\text{ ft}}{1\\text{ mi}}', text: 'Convert miles to feet. Miles go on the bottom of the fraction so they cancel with the miles on top.' }, { tex: '60 \\times 5280 = 316{,}800\\ \\tfrac{\\text{ft}}{\\text{h}}', text: 'Multiply: 60 times 5280 is 316,800. This is feet per hour, since only the distance unit has changed.' }, { tex: '\\cdot \\tfrac{1\\text{ h}}{3600\\text{ s}}', text: 'Convert hours to seconds. Hours go on top so they cancel with the hours on the bottom of the rate.' }, { tex: '316{,}800 \\div 3600 = 88', text: 'Divide: 3600 times 88 is 316,800. Test-day move: 60 mph is exactly 88 ft/s, so the factor is 5280/3600, or 22/15.' }], answer: '88\\text{ ft/s}' },
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
      why: 'Percent means per hundred, so 35% is 35 out of every 100, which is 0.35. The word "of" in math means multiply, just as half of 240 is 1/2 × 240. So 35% of 240 is 0.35 × 240. Split it to check: 10% is 24, so 30% is 72 and 5% is 12, which total 84.',
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
      why: 'Going up 15% means the new amount is A + 0.15A. Factor out A and you get A(1 + 0.15) = 1.15A. Going down is A − 0.15A = 0.85A. For example, 15% off $200 is $200 − $30 = $170, and $200 × 0.85 is also $170.',
    },
    {
      kind: 'concept',
      head: 'Percent change divides by the original',
      body: 'To find a percent change, take the change and divide by where you STARTED. From 50 to 62, the change is 12 and the start is 50, so it is 24%.',
      formula: { tex: '\\%\\text{ change} = \\frac{\\text{new} - \\text{old}}{\\text{old}}', note: 'Always divide by the original amount.', parts: [{ sym: '\\text{new} - \\text{old}', means: 'how much it changed', tone: 'accent' }, { sym: '\\text{old}', means: 'the starting value, always the denominator', tone: 'ok' }] },
      why: 'A percent compares an amount to a base, and for change the natural base is where you started. The same $50 change is a gain of 100% going from $50 to $100, but a loss of only 50% going from $100 to $50, because the starting amounts are different. Dividing by the old value keeps that comparison fair.',
    },
    {
      kind: 'concept',
      head: 'Changes in a row multiply',
      body: 'Up 10% and then down 10% is not a wash. It is 1.1 × 0.9 = 0.99, so you end 1% lower than you started. Chain the multipliers; never add the percents.',
      art: flow([{ label: 'Start: $100', color: SKY }, { label: '× 1.1 → $110', color: EMR }, { label: '× 0.9 → $99', color: ROSE }], { title: 'Up 10%, then down 10%', caption: 'The second 10% is taken from a bigger number.' }),
      why: 'Each percent is taken from the amount at that moment, not from the original. From $100, up 10% gives $110, and then down 10% takes off 10% of $110, which is $11, not $10. That leaves $99. Each step multiplies, 1.1 × 0.9 = 0.99, so adding the percents would give the wrong answer.',
    },
    {
      kind: 'example',
      head: 'Percent of: 35% of 240',
      body: 'What is 35% of 240? Change the percent to a decimal, then multiply.',
      steps: { steps: [{ tex: '35\\% = \\tfrac{35}{100} = 0.35', text: 'Percent means per hundred, so divide by 100. Dividing by 100 moves the decimal point two places to the left.' }, { tex: '0.35 \\times 240', text: 'The word "of" means multiply, so multiply the decimal by the whole amount, which is 240.' }, { tex: '0.30(240) + 0.05(240) = 72 + 12', text: 'Split 0.35 into 0.30 + 0.05 to do it by hand. 0.30 of 240 is 72 (three tenths), and 0.05 of 240 is 12 (half of a tenth, 24 ÷ 2).' }, { tex: '72 + 12 = 84', text: 'Add the two pieces. Test-day move: find 10% by moving the decimal (24), then 30% is 72 and 5% is 12.' }], answer: '84' },
    },
    {
      kind: 'example',
      head: 'Percent change: $50 to $62',
      body: 'A price goes from $50 to $62. What is the percent change? Find the change, then divide by the original price.',
      steps: { steps: [{ tex: '62 - 50 = 12', text: 'Subtract the old value from the new value. This gives the size of the change in dollars, and it is positive, so the price went up.' }, { tex: '\\tfrac{12}{50}', text: 'Divide the change by the original price. The original is the base because the percent describes growth from where you started.' }, { tex: '\\tfrac{12}{50} = \\tfrac{24}{100} = 0.24', text: 'Double the top and bottom to get a denominator of 100. That turns the fraction into a decimal quickly, 0.24.' }, { tex: '0.24 = 24\\%', text: 'Multiply by 100 to change a decimal to a percent. It is positive, so it is an increase. Test-day move: 62 ÷ 50 = 1.24, and 1.24 means 24% more.' }], answer: '24\\%' },
    },
    {
      kind: 'example',
      head: 'Work backward: $90 after 25% off',
      body: 'After 25% off, a jacket costs $90. What was the original price? Write the discount as a multiplier and undo it.',
      formula: { tex: '0.75p = 90 \\;\\Rightarrow\\; p = \\frac{90}{0.75} = 120', note: 'Undo a multiplier by dividing by it.', parts: [{ sym: '0.75', means: 'what is left after 25% comes off', tone: 'accent' }, { sym: 'p', means: 'the original price you are looking for', tone: 'ok' }] },
      steps: { steps: [{ tex: '100\\% - 25\\% = 75\\% = 0.75', text: 'A 25% discount means you pay 75% of the original, so the multiplier is 0.75.' }, { tex: '0.75p = 90', text: 'Let p be the original price. The price paid is 0.75 times p, and the problem says that equals 90.' }, { tex: 'p = \\tfrac{90}{0.75}', text: 'Undo the multiplication by dividing both sides by 0.75. Division is the opposite of multiplication, so it isolates p.' }, { tex: 'p = 120', text: 'Divide: 0.75 goes into 90 exactly 120 times. Check: 0.75 × 120 = 90. Test-day move: 90 is three quarters, so one quarter is 30 and the whole is 120.' }], answer: '\\$120' },
    },
    {
      kind: 'example',
      head: 'Another way: test the choices',
      body: 'For "$90 after 25% off," try each choice for the original price. Take 25% off and see which one gives $90.',
      table: { head: ['Original', '25% off', 'Price paid'], rows: [['$112.50', '$28.13', '$84.38'], ['$120', '$30', '$90'], ['$135', '$33.75', '$101.25']], mark: 1, note: 'Only $120 lands on $90.' },
      steps: { steps: [{ tex: '\\$120 \\times 0.25 = \\$30', text: 'Try the middle choice first. 25% is one quarter, so a quarter of $120 is $30, the discount.' }, { tex: '\\$120 - \\$30 = \\$90', text: 'Subtract the discount from the original. The price paid is $90, which is exactly what the problem says.' }, { tex: '\\$112.50 \\to \\$84.38,\\ \\ \\$135 \\to \\$101.25', text: 'Check the others to be sure. 75% of $112.50 is about $84.38 and 75% of $135 is $101.25, neither of which is $90.' }, { tex: '\\$120', text: 'Choose the one that works. Test-day move: testing the middle choice first tells you whether to go higher or lower.' }], answer: '\\$120' },
    },
    {
      kind: 'example',
      head: 'Up 20%, then down 20%',
      body: 'A stock rises 20% and then falls 20%. Does it return to its starting value? Multiply the two factors.',
      table: { head: ['Step', 'Value of $100'], rows: [['start', '$100'], ['× 1.2', '$120'], ['× 0.8', '$96']], mark: 2, note: 'A 4% net loss.' },
      steps: { steps: [{ tex: '\\text{up } 20\\% \\to 1.2,\\ \\ \\text{down } 20\\% \\to 0.8', text: 'Turn each change into a multiplier. Up 20% keeps 100% and adds 20%, and down 20% keeps 80%.' }, { tex: '1.2 \\times 0.8', text: 'Chain the multipliers by multiplying them. Each change applies to the result of the one before, so they multiply, not add.' }, { tex: '1.2 \\times 0.8 = 0.96', text: 'Compute 12 × 8 = 96 and place the decimal two places over. The result is 0.96, below 1.' }, { tex: '100\\% - 96\\% = 4\\%', text: 'Read the result. The stock keeps 96%, a net loss of 4%. The 20% drop is taken from a bigger number than the 20% rise was. Check: $100 becomes $120, then $96.' }], answer: '\\text{a } 4\\%\\text{ loss overall}' },
    },
    {
      kind: 'example',
      head: 'Picture it first: 18 out of 72',
      body: '18 is what percent of 72? Draw 72 as a circle and see how much of it 18 fills.',
      art: pie([{ label: '18', part: 1, color: AMB }, { label: '54', part: 3, color: SKY }], { title: '18 is one quarter of 72', caption: 'One of four equal parts is 25%.' }),
      steps: { steps: [{ tex: '\\tfrac{\\text{part}}{\\text{whole}} = \\tfrac{18}{72}', text: 'Put the part over the whole. A percent compares a piece to the full amount, and here the piece is 18 and the whole is 72.' }, { tex: '72 \\div 18 = 4', text: 'See how many 18s fit in 72. Four equal pieces make the whole, which is what the circle shows.' }, { tex: '\\tfrac{18}{72} = \\tfrac{1}{4} = 0.25', text: 'One piece out of four is one quarter. Dividing top and bottom by 18 simplifies the fraction to 1/4, which is 0.25 as a decimal.' }, { tex: '0.25 = 25\\%', text: 'Multiply by 100 to write it as a percent. Test-day move: a quarter is 25%, which is a fact worth memorizing.' }], answer: '25\\%' },
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
      steps: { steps: [{ tex: '60 \\times 1.08 = 64.80', text: 'Add 8% tax by multiplying by 1.08, which is 100% plus 8%. The meal plus tax is $64.80.' }, { tex: '64.80 \\times 1.20', text: 'The tip is 20% of the total with tax, not of the original $60. So multiply the new amount by 1.20.' }, { tex: '64.80 + 12.96 = 77.76', text: 'Compute: 20% of 64.80 is 12.96, since 64.80 ÷ 5 = 12.96. Adding it to 64.80 gives 77.76.' }, { tex: '60 \\times 1.08 \\times 1.20 = 60 \\times 1.296', text: 'Check with one combined multiplier. 1.08 × 1.20 = 1.296, and 60 × 1.296 = 77.76. Adding the percents (28%) would give $76.80, which is wrong.' }], answer: '\\$77.76' },
    },
    {
      kind: 'summary',
      head: 'Percentages, wrapped up',
      body: 'Percent of means multiply. A change of r% multiplies by 1 + r or 1 − r. Percent change divides by the original. Changes in a row multiply, and to work backward, divide by the multiplier.',
      table: { head: ['Question', 'Move'], rows: [['p% of n', 'multiply by p/100'], ['up or down r%', 'multiply by 1 ± r'], ['percent change', '(new − old) ÷ old'], ['price before a change', 'divide by the multiplier']] },
    },
  ],
};
