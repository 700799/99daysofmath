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
    ],
    watchOut: 'x² = 25 has TWO solutions, 5 and −5 — writing only x = 5 misses half the answer unless the question asks for the positive one.',
  },
];
