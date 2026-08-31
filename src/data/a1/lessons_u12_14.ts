import type { Lesson } from '../lessons';

// A1 Units 12-14 — Polynomials, Factoring, Quadratics.
export const A1_LESSONS_U12_14: Lesson[] = [
  {
    domain: 'A1', unit: 12, title: 'Polynomials: combine and multiply',
    objective: 'Add, subtract, and multiply polynomials.',
    concept: [
      'LIKE TERMS are the same kind of sticker — you can only count apples with apples: 4x + 3x = 7x, but x² and x never mix.',
      'To ADD polynomials, sort the stickers into piles and combine each pile.',
      'To SUBTRACT, the minus sign DISTRIBUTES: it hits EVERY term in the second parentheses.',
      'To MULTIPLY, distribute — hand a snack to everyone inside: x(x + 5) = x² + 5x.',
      'For binomial × binomial, draw the AREA MODEL: a garden rectangle split into 4 patches, one little area per patch.',
      'When SUBTRACTING polynomials, the minus sign visits every term of the second one — it knocks on every door, not just the first.',
    ],
    examples: [
      {
        q: 'Add (3x + 4) + (2x + 5).',
        steps: [
          'Sort into piles: x-terms together, plain numbers together.',
          'x pile: 3x + 2x = 5x.',
          'Number pile: 4 + 5 = 9.',
        ],
        answer: '5x + 9',
      },
      {
        q: 'Subtract (5x + 7) − (2x + 3).',
        steps: [
          'The minus hits BOTH terms in the second group: 5x + 7 − 2x − 3.',
          'x pile: 5x − 2x = 3x.',
          'Number pile: 7 − 3 = 4.',
        ],
        answer: '3x + 4',
      },
      {
        q: 'A garden is (x + 3) m by (x + 2) m. Multiply to find its area.',
        steps: [
          'Split the garden into 4 patches: cut the length into x and 3, the width into x and 2.',
          'Patch areas: x·x = x², x·2 = 2x, 3·x = 3x, 3·2 = 6.',
          'Add them: x² + 2x + 3x + 6, then combine the strips: 2x + 3x = 5x.',
        ],
        answer: 'x² + 5x + 6',
      },
      {
        q: 'Multiply 2x(3x + 4).',
        steps: [
          'The 2x hands a snack to both terms inside.',
          '2x × 3x = 6x² (numbers multiply, x × x = x²).',
          '2x × 4 = 8x.',
        ],
        answer: '6x² + 8x',
      },
      { q: 'Add (3x² + 2x) + (x² + 5x).', steps: ['Match the like terms: 3x² with x², and 2x with 5x.', '3x² + x² = 4x² and 2x + 5x = 7x.', 'Answer: 4x² + 7x.'], answer: '4x² + 7x' },
      { q: 'Multiply (x + 2)(x + 5).', steps: ['Garden model: x·x = x², x·5 = 5x, 2·x = 2x, 2·5 = 10.', 'Middle terms join: 5x + 2x = 7x.', 'x² + 7x + 10.'], answer: 'x² + 7x + 10' },
    ],
    practice: [
      {
        q: 'Simplify: (4x + 6) − (x + 2)',
        answers: ['3x + 4', '3x+4', '4 + 3x'],
        steps: ['Distribute the minus: 4x + 6 − x − 2.', 'Combine: 4x − x = 3x and 6 − 2 = 4.'],
      },
      {
        q: 'Multiply: (x + 4)(x + 1)',
        answers: ['x² + 5x + 4', 'x²+5x+4', 'x^2 + 5x + 4', 'x^2+5x+4'],
        steps: ['Area model: patches x², 1x, 4x, and 4.', 'Combine the strips: 1x + 4x = 5x.'],
      },
      { q: 'Add (2x + 3) + (4x + 1). Answer like “6x + 4”.', answers: ['6x + 4', '6x+4', '4 + 6x'], steps: ['2x + 4x = 6x.', '3 + 1 = 4.'] },
      { q: 'Multiply (x + 1)(x + 3). Answer like “x^2 + 4x + 3”.', answers: ['x^2 + 4x + 3', 'x^2+4x+3'], steps: ['x·x = x²; outer + inner = 3x + x = 4x; 1·3 = 3.', 'x² + 4x + 3.'] },
    ],
    watchOut: 'When you subtract, the minus must hit EVERY term: (5x + 7) − (2x + 3) is 5x + 7 − 2x − 3, not 5x + 7 − 2x + 3.',
  },
  {
    domain: 'A1', unit: 13, title: 'Factoring: un-multiply it',
    objective: 'Factor with GCF and number pairs.',
    concept: [
      'Factoring is UN-multiplying: run the area model backwards — you know the garden\'s area, you find its sides.',
      'ALWAYS pull out the GCF first — the biggest thing every term shares: 6x + 12 = 6(x + 2).',
      'For x² + bx + c: hunt for two numbers that MULTIPLY to c and ADD to b.',
      'DIFFERENCE OF SQUARES is a shortcut: a² − b² = (a + b)(a − b), because the middle strips cancel.',
      'Always CHECK by multiplying back out — if you don\'t land on the original, hunt again.',
      'Factoring is un-multiplying, so the CHECK is multiplying back — expand your answer and it must match the original, term for term.',
    ],
    examples: [
      {
        q: 'You have 6x + 12 tickets to split into equal gift bags. Factor to see the biggest split.',
        steps: [
          'Find what both terms share: 6x = 6·x and 12 = 6·2, so the GCF is 6.',
          'Pull the 6 out front: 6( ? + ? ).',
          'Fill the blanks with what is left: 6(x + 2) — six bags, each with x + 2 tickets.',
        ],
        answer: '6(x + 2)',
      },
      {
        q: 'A banner has area x² + 7x + 12. Factor to find its sides.',
        steps: [
          'Hunt for two numbers that MULTIPLY to 12 and ADD to 7.',
          'Pairs for 12: 1 and 12 (adds 13), 2 and 6 (adds 8), 3 and 4 (adds 7). Winner: 3 and 4.',
          'Write the sides: (x + 3)(x + 4). Check: x² + 4x + 3x + 12 = x² + 7x + 12.',
        ],
        answer: '(x + 3)(x + 4)',
      },
      {
        q: 'Factor x² − 25.',
        steps: [
          'Spot the pattern: x² is a square, and 25 = 5², with a minus between — a DIFFERENCE of squares.',
          'Use a² − b² = (a + b)(a − b) with a = x and b = 5.',
          'Check: (x + 5)(x − 5) = x² − 5x + 5x − 25 = x² − 25. The middle cancels.',
        ],
        answer: '(x + 5)(x − 5)',
      },
      {
        q: 'Factor x² − x − 6.',
        steps: [
          'Hunt: two numbers that multiply to −6 and add to −1.',
          'Product is negative, so the signs differ; sum is negative, so the bigger number is negative.',
          'The pair is −3 and +2: (x − 3)(x + 2).',
        ],
        answer: '(x − 3)(x + 2)',
      },
      { q: 'Factor x² + 7x + 10.', steps: ['Hunt two numbers: multiply to 10, add to 7.', '2 and 5 do both jobs.', '(x + 2)(x + 5). Check: expands back to x² + 7x + 10. ✓'], answer: '(x + 2)(x + 5)' },
      { q: 'Factor x² − 9.', steps: ['A square minus a square — the special pattern.', 'x² − 3² = (x + 3)(x − 3).', 'The middle terms cancel on the way back: +3x − 3x = 0. ✓'], answer: '(x + 3)(x − 3)' },
    ],
    practice: [
      {
        q: 'Factor: 4x + 8',
        answers: ['4(x + 2)', '4(x+2)'],
        steps: ['The GCF of 4x and 8 is 4.', 'Pull it out: 4(x + 2).'],
      },
      {
        q: 'Factor: x² + 6x + 8',
        answers: ['(x + 2)(x + 4)', '(x+2)(x+4)', '(x + 4)(x + 2)', '(x+4)(x+2)'],
        steps: ['Two numbers that multiply to 8 and add to 6: that is 2 and 4.', 'Write the sides: (x + 2)(x + 4).'],
      },
      { q: 'Factor x² + 5x + 6. Answer like “(x + 2)(x + 3)”.', answers: ['(x + 2)(x + 3)', '(x+2)(x+3)', '(x + 3)(x + 2)', '(x+3)(x+2)'], steps: ['Two numbers that multiply to 6 and add to 5: 2 and 3.', '(x + 2)(x + 3).'] },
      { q: 'What two numbers multiply to 12 and add to 7? Answer like “3 and 4”.', answers: ['3 and 4', '34', '4 and 3', '43'], steps: ['Try the factor pairs of 12: 1&12, 2&6, 3&4.', '3 + 4 = 7 — that’s the pair.'] },
    ],
    watchOut: 'Check the signs: x² − x − 6 needs numbers that multiply to −6 and add to −1 (that is −3 and +2), not +3 and −2.',
  },
  {
    domain: 'A1', unit: 14, title: 'Quadratics: the parabola',
    objective: 'Solve quadratic equations two ways.',
    concept: [
      'y = x² graphs as a PARABOLA — the U-shaped path of every thrown ball.',
      'A square equation has TWO answers: x² = 25 gives x = 5 AND x = −5 — two ways to land.',
      'The ZERO-PRODUCT rule: if two things multiply to zero, one of them IS zero.',
      'To solve by FACTORING: get 0 on one side, factor, then set each factor to zero.',
      'The VERTEX is the highest or lowest point of the U — the top of the ball\'s arc.',
      'The parabola is symmetric: the vertex sits exactly halfway between the two x-intercepts, like the fold line of a folded paper.',
    ],
    examples: [
      {
        q: 'Solve x² = 25. Give both solutions.',
        steps: [
          'Ask: what number times itself gives 25?',
          '5 × 5 = 25, and (−5) × (−5) = 25 too — negatives square to positives.',
          'So x = 5 or x = −5. Squares always have two roots.',
        ],
        answer: 'x = 5 or x = −5',
      },
      {
        q: 'Solve (x − 3)(x + 5) = 0.',
        steps: [
          'Two things multiply to zero, so one of them IS zero.',
          'Either x − 3 = 0, giving x = 3.',
          'Or x + 5 = 0, giving x = −5.',
        ],
        answer: 'x = 3 or x = −5',
      },
      {
        q: 'Solve x² − 5x + 6 = 0 by factoring.',
        steps: [
          'Hunt: two numbers that multiply to 6 and add to −5. That is −2 and −3.',
          'Factor: (x − 2)(x − 3) = 0.',
          'Zero-product rule: x = 2 or x = 3.',
        ],
        answer: 'x = 2 or x = 3',
      },
      {
        q: 'A ball is dropped: h = 45 − 5t². When does it hit the ground?',
        steps: [
          'Hitting the ground means h = 0: solve 45 − 5t² = 0.',
          'Move and divide: 5t² = 45, so t² = 9.',
          't = 3 or t = −3, but time can\'t be negative — it lands at t = 3 seconds.',
        ],
        answer: '3 seconds',
      },
      { q: 'For y = (x − 2)(x − 6): where does it cross the x-axis, and where is the vertex?', steps: ['Crossings where a factor is zero: x = 2 and x = 6.', 'The vertex is halfway: x = 4.', 'y at x = 4: (2)(−2) = −4 → vertex (4, −4).'], answer: 'Crosses at 2 and 6; vertex (4, −4)' },
      { q: 'A ball’s height is h = −(t − 3)² + 9. What is its highest point?', steps: ['The squared part is never negative, and the minus flips it downhill.', 'Its best moment is when the square is 0, at t = 3.', 'Highest point: h = 9.'], answer: 'Height 9, at t = 3' },
    ],
    practice: [
      {
        q: 'Solve x² = 49. Give the POSITIVE solution.',
        answers: ['7', 'x = 7', 'x=7'],
        steps: ['7 × 7 = 49 (and −7 works too).', 'The positive solution is 7.'],
      },
      {
        q: 'Solve (x − 6)(x + 2) = 0. Give the POSITIVE solution.',
        answers: ['6', 'x = 6', 'x=6'],
        steps: ['Set each factor to zero: x = 6 or x = −2.', 'The positive one is 6.'],
      },
      { q: 'For y = x² − 4: at which POSITIVE x does it cross the x-axis?', answers: ['2'], steps: ['Crossing means y = 0: x² = 4.', 'x = 2 or −2; the positive one is 2.'] },
      { q: 'The zeros of a parabola are 1 and 7. What is the x-value of the vertex?', answers: ['4'], steps: ['The vertex is halfway between the zeros.', '(1 + 7) ÷ 2 = 4.'] },
    ],
    watchOut: 'x² = 25 has TWO solutions, 5 and −5 — writing only x = 5 misses half the answer unless the question asks for the positive one.',
  },
];
