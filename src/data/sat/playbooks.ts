import type { SatArea } from './blueprint';

// ── Unit playbooks ─────────────────────────────────────────────────────────
// One per unit. Deliberately *not* the kid-facing slide deck used by the
// grade-5/6 trails: an SAT student wants a briefing, not a story — what the
// College Board actually asks, the methods in the order you should reach for
// them, worked examples, the facts to have memorized, the traps the question
// writers build, how to use Desmos here, and what the question should cost you
// in seconds.

export interface PlaybookMethod {
  name: string;
  steps: string[];
}

export interface PlaybookExample {
  q: string;
  steps: string[];
  answer: string;
}

export interface SatPlaybook {
  unit: number;
  area: SatArea;
  title: string;
  /** What the College Board asks here, and why it is worth your time. */
  overview: string;
  /** Roughly how many of the 44 scored questions come from this unit. */
  frequency: string;
  /** Named methods, ordered by what to try first. */
  methods: PlaybookMethod[];
  examples: PlaybookExample[];
  /** Facts to have cold before test day. */
  mustKnow: string[];
  /** The specific mistakes this unit is engineered to catch. */
  traps: string[];
  /** How the built-in graphing calculator helps — or does not — here. */
  desmos: string;
  /** What a question from this unit should cost you. */
  timing: string;
  /** The self-check: "you have mastered this unit when…". */
  mastery: string[];
}

export const SAT_PLAYBOOKS: SatPlaybook[] = [
  // ─────────────────────────── ALGEBRA ───────────────────────────
  {
    unit: 1,
    area: 'ALG',
    title: 'Linear Equations in One Variable',
    overview:
      'The most basic question type on the test, and the foundation for everything in Algebra. Beyond straight solving, the College Board tests whether you understand when an equation has no solution or infinitely many — a concept question dressed up as a computation.',
    frequency: 'About 2-3 questions per section, usually early in a module.',
    methods: [
      {
        name: 'Solve by undoing, in reverse order',
        steps: [
          'Clear parentheses and fractions first — or divide by an outside factor if the whole side is multiplied by it.',
          'Collect variable terms on the side that keeps the coefficient positive; collect constants on the other.',
          'Divide by the coefficient. Substitute your answer back to confirm.',
        ],
      },
      {
        name: 'Backsolve from the choices',
        steps: [
          'When the choices are plain numbers, test one instead of solving forward.',
          'Start with B or C: since choices are ordered, one test usually tells you which direction to move.',
          'This is immune to sign and distribution errors, which is why it is often the better route.',
        ],
      },
      {
        name: 'Count solutions without solving',
        steps: [
          'Simplify both sides to the form ax + b and cx + d.',
          'Different coefficients (a ≠ c): exactly one solution.',
          'Same coefficient, different constants: no solution. Same coefficient and same constant: infinitely many.',
        ],
      },
    ],
    examples: [
      {
        q: 'Solve 4x + 9 = 7x − 12.',
        steps: [
          'Subtract 4x from both sides to keep the x-coefficient positive: 9 = 3x − 12.',
          'Add 12: 21 = 3x.',
          'Divide by 3: x = 7. Check: 4(7) + 9 = 37 and 7(7) − 12 = 37 ✓',
        ],
        answer: 'x = 7',
      },
      {
        q: 'For what value of k does kx + 8 = 3x − 5 have no solution?',
        steps: [
          'Gather the x terms: (k − 3)x = −13.',
          'If k ≠ 3 you can divide and get exactly one solution.',
          'If k = 3 the equation reads 0 = −13, which is false for every x — no solution.',
        ],
        answer: 'k = 3',
      },
      {
        q: 'Solve 6 − 2(x − 3) = 4x.',
        steps: [
          'Distribute the −2 into BOTH terms: 6 − 2x + 6 = 4x, so 12 − 2x = 4x.',
          'Add 2x to both sides: 12 = 6x.',
          'x = 2. Check: 6 − 2(−1) = 8 and 4(2) = 8 ✓',
        ],
        answer: 'x = 2',
      },
      {
        q: 'For what value of c does 5x + c = 5(x − 2) have infinitely many solutions?',
        steps: [
          'Expand the right side: 5x − 10.',
          'Infinitely many solutions means the sides are identical, and the 5x terms already match.',
          'So the constants must match: c = −10.',
        ],
        answer: 'c = −10',
      },
    ],
    mustKnow: [
      'No solution ⟺ same slope, different constant (parallel lines that never meet).',
      'Infinitely many ⟺ the two sides are literally the same expression.',
      'To solve a literal equation, treat every other letter as if it were a number. The steps do not change.',
      'To clear fractions, multiply EVERY term by the least common denominator — including the terms that had no fraction.',
    ],
    traps: [
      'Distributing a negative and dropping the sign on the second term.',
      'Solving for x when the question asks for 3x − 1, or for a different variable entirely.',
      'Reading "no solution" as "x = 0". Those are completely different answers, and both appear as choices.',
      'Distributing a factor into only the first term inside the parentheses.',
      'Answering “x = 0” for an equation that has no solution — a value and no-value are different claims, and both appear as choices.',
    ],
    desmos:
      'Graph the left side as y₁ and the right side as y₂, then click the intersection. This solves any single-variable equation and doubles as a check when the algebra is uncertain. Parallel lines with no intersection is what "no solution" looks like.',
    timing:
      '30-45 seconds. If you are past a minute on a one-variable linear equation, you have made an arithmetic error — restart cleanly rather than hunting for it.',
    mastery: [
      'You can solve any linear equation — fractions, decimals, parentheses — in under 45 seconds, and your check costs under ten.',
      'Shown ax + b = cx + d, you can say how many solutions it has without solving anything.',
      'You reach for backsolving the moment the choices are plain numbers, and for algebra when they are not.',
    ],
  },
  {
    unit: 2,
    area: 'ALG',
    title: 'Linear Functions and Rate of Change',
    overview:
      'Function notation plus interpretation. About half the questions here are pure computation — evaluate f(3), find the slope — and about half ask what a number *means* in a real context. The interpretation questions are free points once you learn to say the units out loud.',
    frequency: 'About 3-4 questions per section, split between computation and interpretation.',
    methods: [
      {
        name: 'Evaluate function notation',
        steps: [
          'f(3) is an instruction: replace every x with 3.',
          'Respect order of operations — the exponent or coefficient applies where it is written, not to the whole expression.',
          'For f(a) = f(3) + 4, collapse the known side to a single number first, then solve.',
        ],
      },
      {
        name: 'Interpret slope and intercept in context',
        steps: [
          'Slope is always a rate: y-units per x-unit. Say those units out loud.',
          'The y-intercept is the value at input zero — the starting amount, the fixed fee, the initial height.',
          'The x-intercept is where the output hits zero — break-even, the moment the tank empties, the year the value runs out.',
        ],
      },
      {
        name: 'Build a linear function from two values',
        steps: [
          'Read f(a) = b as the point (a, b).',
          'Slope is the change in output over the change in input.',
          'Then use one point to find the intercept — or just step along the slope to the input you need.',
        ],
      },
    ],
    examples: [
      {
        q: 'A moving company charges C(t) = 32t + 150. What does 32 represent?',
        steps: [
          'C is in dollars and t is in hours, so the coefficient of t has units of dollars per hour.',
          'That is the cost of each additional hour of work.',
          'The 150 is what you owe at t = 0 — the fixed charge.',
        ],
        answer: 'The cost per hour of work.',
      },
      {
        q: 'A candle is 18 cm tall after 2 hours and 10.5 cm after 5 hours. How tall was it before it was lit?',
        steps: [
          'Rate: (10.5 − 18) / (5 − 2) = −2.5 cm per hour.',
          '"Before it was lit" means t = 0, which is 2 hours before the 18 cm reading.',
          'Going backwards adds height: 18 + 2(2.5) = 23 cm.',
        ],
        answer: '23 cm',
      },
      {
        q: 'A linear function f has slope 4, and f(2) = 5. What is f(0)?',
        steps: [
          'Moving from x = 2 back to x = 0 is two steps left.',
          'Each step left subtracts the slope: 5 − 4 − 4 = −3.',
          'So f(0) = −3 — which is also the y-intercept, so f(x) = 4x − 3.',
        ],
        answer: 'f(0) = −3',
      },
      {
        q: 'A plant\'s height is modeled by P(t) = 12t + 80, in millimeters, t days after purchase. What does 80 represent?',
        steps: [
          'Set t = 0: P(0) = 80, before any days pass.',
          'So 80 is the plant\'s height in millimeters at the moment of purchase.',
          'The 12 is the growth rate — millimeters per day — and “height after one day” would be 92, not 12 or 80.',
        ],
        answer: 'The height at purchase: 80 mm',
      },
    ],
    mustKnow: [
      'Slope = (y₂ − y₁)/(x₂ − x₁). Keep both subtractions in the same order.',
      'In y = mx + b, m is the rate and b is the starting value.',
      'A linear function has a constant rate of change — equal steps in x give equal steps in y.',
      'f(0) is the y-intercept; the x solving f(x) = 0 is the x-intercept. One is an output, the other an input — questions deliberately swap them.',
    ],
    traps: [
      'Subtracting the y-values in one order and the x-values in the other, flipping the sign of the slope.',
      'Confusing "the cost of a one-hour job" (32 + 150) with "the cost per hour" (32).',
      'On interpretation questions, every wrong choice is a true statement about a different feature of the model.',
      'Evaluating f(−3) when the question asks for the x that makes f(x) = −3 — input and output reversed.',
      'Computing a slope from a table with the columns read in opposite orders, which gives the reciprocal or the wrong sign.',
    ],
    desmos:
      'Enter the function and use the table view to read several values at once. For "find x when f(x) = 17", graph y = f(x) and y = 17 and click the intersection.',
    timing:
      'Computation: 30 seconds. Interpretation: 45-60 seconds, most of it spent reading carefully rather than calculating.',
    mastery: [
      'You can produce slope, intercept, or any value of a linear function from two points, a table, or a sentence — whichever the question hands you.',
      'You interpret slope and both intercepts in context by naming their units first.',
      'You can step along a slope to any input without rebuilding the whole equation.',
    ],
  },
  {
    unit: 3,
    area: 'ALG',
    title: 'Linear Equations in Two Variables',
    overview:
      'Moving fluently between slope-intercept, standard, and point-slope form, and building a line from a description. The parallel and perpendicular conditions appear on nearly every test, and they are the most reliably learnable points in this unit.',
    frequency: 'About 3 questions per section.',
    methods: [
      {
        name: 'Convert standard form to slope-intercept',
        steps: [
          'Isolate the y term, then divide every term by its coefficient.',
          'Watch both signs when dividing by a negative.',
          'Shortcut: for Ax + By = C, the slope is −A/B, the x-intercept is C/A, and the y-intercept is C/B.',
        ],
      },
      {
        name: 'Build a line from two points',
        steps: [
          'Compute the slope from the two points.',
          'Substitute either point into y = mx + b and solve for b.',
          'Verify with the *other* point — this catches an arithmetic slip immediately.',
        ],
      },
      {
        name: 'Apply the parallel and perpendicular conditions',
        steps: [
          'Parallel: identical slopes.',
          'Perpendicular: negative reciprocal — flip the fraction AND change the sign.',
          'Then substitute the given point to find the new intercept.',
        ],
      },
    ],
    examples: [
      {
        q: 'Line ℓ is 5x − 2y = 8. Line m is perpendicular to ℓ through (5, 1). Find m\'s y-intercept.',
        steps: [
          'Convert ℓ: −2y = −5x + 8, so y = (5/2)x − 4 and the slope is 5/2.',
          'Perpendicular slope: −2/5.',
          'Substitute (5, 1): 1 = −2/5(5) + b = −2 + b, so b = 3.',
        ],
        answer: 'b = 3',
      },
      {
        q: 'In 3x + ky = 12, the slope is 3/2. Find k.',
        steps: [
          'The slope of Ax + By = C is −A/B, so here it is −3/k.',
          'Set −3/k = 3/2 and cross-multiply: −6 = 3k.',
          'k = −2. Note the target slope was positive while the numerator was, so k had to be negative.',
        ],
        answer: 'k = −2',
      },
      {
        q: 'Find the equation of the line through (2, 5) parallel to 3x + y = 7.',
        steps: [
          'Rewrite the given line: y = −3x + 7, so its slope is −3, and parallel means the same slope.',
          'Substitute (2, 5) into y = −3x + b: 5 = −6 + b, so b = 11.',
          'The line is y = −3x + 11.',
        ],
        answer: 'y = −3x + 11',
      },
      {
        q: 'The line y = mx + 4 passes through (6, 1). What is m?',
        steps: [
          'The point (0, 4) is on the line — the equation displays its intercept.',
          'Slope between (0, 4) and (6, 1): (1 − 4) ÷ (6 − 0) = −3/6.',
          'm = −1/2.',
        ],
        answer: 'm = −1/2',
      },
    ],
    mustKnow: [
      'Slope-intercept y = mx + b, standard Ax + By = C, point-slope y − y₁ = m(x − x₁).',
      'Perpendicular slopes multiply to −1.',
      'A point with x = 0 IS the y-intercept — no work needed.',
      'Point-slope form y − y₁ = m(x − x₁) writes the line in one move when you have a slope and a point — no solving for b.',
    ],
    traps: [
      'Doing only half the perpendicular rule. One distractor flips without negating; another negates without flipping.',
      'Sign errors when dividing a standard-form equation by a negative coefficient.',
      'Stopping at the equation when the question asked for one specific feature of it.',
      'Swapping the intercept shortcuts: for Ax + By = C the x-intercept is C/A and the y-intercept is C/B — not the other way round.',
      'Verifying a candidate line against only one of the two given points; one distractor always passes through exactly one.',
    ],
    desmos:
      'Type equations in any form — Desmos accepts 3x + 2y = 12 directly. To test a candidate equation against given points, graph it and see whether the points sit on the line.',
    timing:
      '45-60 seconds. Multi-step perpendicular questions can run to 90 seconds and are worth the time — they are very gettable.',
    mastery: [
      'You can move between slope-intercept, standard, and point-slope form in either direction without hesitation.',
      'Parallel and perpendicular conversions are automatic: same slope; flip AND negate.',
      'Given any two facts about a line — two points, a point and a slope, a description — you can produce its equation inside a minute.',
    ],
  },
  {
    unit: 4,
    area: 'ALG',
    title: 'Systems of Two Linear Equations',
    overview:
      'Solving by substitution or elimination, plus the question type that asks how many solutions exist without asking you to find them. That second type is answered in about fifteen seconds once you know the ratio test.',
    frequency: 'About 2-3 questions per section, including at least one word problem.',
    methods: [
      {
        name: 'Choose the method before you start',
        steps: [
          'A variable already isolated, or trivially isolatable? Substitute.',
          'Coefficients already equal or opposite? Add or subtract to eliminate.',
          'Neither? Scale one or both equations to create a matching pair, then eliminate.',
        ],
      },
      {
        name: 'Count solutions with the ratio test',
        steps: [
          'For a₁x + b₁y = c₁ and a₂x + b₂y = c₂, compare a₂/a₁, b₂/b₁, and c₂/c₁.',
          'All three equal: the same line, infinitely many solutions.',
          'The first two equal but the third different: parallel lines, no solution. Otherwise: exactly one.',
        ],
      },
      {
        name: 'Backsolve word problems',
        steps: [
          'When the choices are prices or counts, test one in the first equation to get the partner value.',
          'Then check that pair in the second equation.',
          'One substitution and one check often beats scaling two equations.',
        ],
      },
    ],
    examples: [
      {
        q: '3 adult and 2 child tickets cost $34; 2 adult and 5 child cost $41. Find the adult price.',
        steps: [
          'Write 3a + 2c = 34 and 2a + 5c = 41.',
          'Scale to a common c coefficient of 10: 15a + 10c = 170 and 4a + 10c = 82.',
          'Subtract: 11a = 88, so a = $8 (and c = $5). Check both equations ✓',
        ],
        answer: '$8',
      },
      {
        q: 'The system kx + 3y = 9 and 2x + y = 5 has no solution. Find k.',
        steps: [
          'No solution means parallel: equal slopes.',
          'Slopes are −k/3 and −2, so −k/3 = −2 and k = 6.',
          'Confirm they are parallel and not identical: 6x + 3y = 9 reduces to 2x + y = 3, whose constant differs from 5 ✓',
        ],
        answer: 'k = 6',
      },
      {
        q: 'The sum of two numbers is 30 and their difference is 6. What is the larger number?',
        steps: [
          'Write x + y = 30 and x − y = 6, with x the larger.',
          'Add the equations: 2x = 36, so x = 18.',
          'Check: 18 + 12 = 30 and 18 − 12 = 6 ✓',
        ],
        answer: '18',
      },
      {
        q: 'For what value of k does the system kx + 2y = 10 and 3x + y = 5 have infinitely many solutions?',
        steps: [
          'Infinitely many means one equation is a multiple of the other.',
          'Doubling the second gives 6x + 2y = 10 — the 2y and the 10 already match the first.',
          'So k = 6. (Had the constants differed, the same k would give no solution instead.)',
        ],
        answer: 'k = 6',
      },
    ],
    mustKnow: [
      'A solution must satisfy BOTH equations. Always check the second one.',
      'Parallel (same slope, different intercept) = no solution. Identical = infinitely many.',
      'The SAT often wants x + y or 2x − y rather than x alone — sometimes reachable by adding the equations directly.',
      'Adding the two equations as written is always legal — and on SAT systems the requested combination often appears immediately when you do.',
    ],
    traps: [
      'Solving for x and stopping when the question asked for y.',
      'Confusing "no solution" with "infinitely many" — the coefficients decide whether the lines are parallel, and the constant decides whether they are the same line.',
      'Assigning variables to the wrong quantities in a word problem. Write "a = adult price" explicitly.',
      'Adding the equations when subtracting is what cancels — check whether the matching coefficients are equal or opposite first.',
      'Reporting the first variable you solve for when the question asks for the other one, or for a combination like x + y.',
    ],
    desmos:
      'Enter both equations exactly as written and click the intersection point — Desmos labels the coordinates. If the lines never cross, you can see the "no solution" case rather than deducing it.',
    timing:
      '60 seconds for a clean system, 90 for a word problem. The "how many solutions" type should take 15-20 seconds with the ratio test.',
    mastery: [
      'You pick substitution or elimination by looking, not by habit, and the choice saves you a step.',
      'The ratio test answers “how many solutions” in fifteen seconds without solving.',
      'You can turn a two-sentence word problem into a system, solve it, and answer the exact quantity asked.',
    ],
  },
  {
    unit: 5,
    area: 'ALG',
    title: 'Linear Inequalities and Systems',
    overview:
      'Half translation, half algebra. Most of the difficulty is turning constraint language into the right symbol, and most of the errors come from one rule: multiplying or dividing by a negative flips the inequality.',
    frequency: 'About 2-3 questions per section, usually including one modeling question.',
    methods: [
      {
        name: 'Solve like an equation, with one exception',
        steps: [
          'Every step is identical to solving an equation.',
          'The single exception: multiplying or dividing both sides by a negative reverses the direction.',
          'Better still, rearrange so the variable coefficient stays positive and the rule never comes up.',
        ],
      },
      {
        name: 'Translate constraint language',
        steps: [
          '"At least", "no less than", "minimum of" → ≥. "At most", "no more than", "maximum of" → ≤.',
          '"More than", "exceeds", "over" → strict >. "Less than", "under", "below" → strict <.',
          'The phrases containing "no" or "at" allow equality; the bare comparison words do not.',
        ],
      },
      {
        name: 'Test points against a system',
        steps: [
          'A solution must satisfy every inequality, so check each candidate against all of them.',
          'Stop as soon as one fails — no need to check the rest.',
          'x = 0 is the cheapest test point whenever it is not a boundary.',
        ],
      },
    ],
    examples: [
      {
        q: 'How many integer values of x satisfy −3 < (x − 4)/2 ≤ 1?',
        steps: [
          'Multiply all three parts by 2: −6 < x − 4 ≤ 2.',
          'Add 4 throughout: −2 < x ≤ 6.',
          'The left bound is strict, so x runs from −1 to 6: that is 6 − (−1) + 1 = 8 integers.',
        ],
        answer: '8',
      },
      {
        q: 'A cart holds 7 lb of equipment and can carry at most 40 lb total. Boxes weigh 3 lb. Greatest number of boxes?',
        steps: [
          '"At most 40" gives 3b + 7 ≤ 40.',
          'Subtract 7: 3b ≤ 33, so b ≤ 11.',
          'The division is exact and ≤ permits equality, so 11 boxes hits the limit precisely.',
        ],
        answer: '11 boxes',
      },
      {
        q: 'Solve 5 − 3x > 2x − 10.',
        steps: [
          'Add 3x to both sides so the coefficient stays positive: 5 > 5x − 10.',
          'Add 10: 15 > 5x, so 3 > x.',
          'All x < 3 — and no flip was ever needed, because we never divided by a negative.',
        ],
        answer: 'x < 3',
      },
      {
        q: 'What is the greatest integer x with 4(x − 2) ≤ 18?',
        steps: [
          'Divide by 4 first: x − 2 ≤ 4.5.',
          'Add 2: x ≤ 6.5.',
          'The greatest INTEGER at or below 6.5 is 6 — round a maximum down, never up.',
        ],
        answer: '6',
      },
    ],
    mustKnow: [
      'Multiplying or dividing by a negative reverses the inequality. Nothing else does.',
      'For a compound inequality, operate on all three parts simultaneously.',
      'Counting integers from a to b inclusive gives b − a + 1 — the "+1" is what people forget.',
      'For a maximum under ≤ take the floor of the bound; for a minimum under ≥ take the ceiling. The context (boxes, people, tickets) forces whole numbers.',
    ],
    traps: [
      'Forgetting the flip. This is the single most common algebra error on the test.',
      'Using a strict inequality where the wording permits equality, which changes whether a boundary value counts.',
      'Giving a fractional answer when the context (boxes, people, tickets) demands a whole number.',
      'Rounding a fractional bound up for a maximum — whole items round DOWN under ≤, even from 6.9.',
      'Translating “no more than” with a strict <, which wrongly throws away the boundary value.',
    ],
    desmos:
      'Desmos shades inequalities. Type the whole system and the solution region is where the shading overlaps; then plot candidate points and see which land inside. This turns an algebra check into a glance.',
    timing:
      '45 seconds to solve, 60-75 for a modeling or counting question. The counting questions deserve the extra time — fencepost errors are easy here.',
    mastery: [
      'You can solve any linear inequality and state which side of the boundary survives — and the flip rule never catches you, because you keep coefficients positive.',
      'Constraint language translates itself: at least, at most, exceeds, no more than each map to one symbol instantly.',
      'You test candidate points against a system in seconds, starting from x = 0 whenever it is legal.',
    ],
  },

  // ──────────────────────── ADVANCED MATH ────────────────────────
  {
    unit: 6,
    area: 'ADV',
    title: 'Equivalent Expressions and Exponents',
    overview:
      'Rewriting rather than solving. Exponent rules, radicals, factoring patterns, and rational expressions. These questions look short and are often multi-step, which makes them a common source of time loss.',
    frequency: 'About 3 questions per section.',
    methods: [
      {
        name: 'The three exponent rules',
        steps: [
          'Same base multiplied: add the exponents. Divided: subtract them.',
          'A power raised to a power: multiply the exponents.',
          'A negative exponent means reciprocal; a fractional exponent means a root, with the denominator as the root index.',
        ],
      },
      {
        name: 'Recognize the factoring patterns',
        steps: [
          'Difference of squares: a² − b² = (a + b)(a − b). By far the most common on the SAT.',
          'Perfect square trinomial: a² ± 2ab + b² = (a ± b)².',
          'For ax² + bx + c, find two numbers multiplying to ac and adding to b.',
        ],
      },
      {
        name: 'Pick numbers when the choices contain variables',
        steps: [
          'Choose a value for x that is small but not special — avoid 0, 1, and any number already in the problem.',
          'Compute the target, then evaluate each choice at the same value.',
          'If two choices survive, run a second value — a negative or a fraction usually breaks the tie.',
        ],
      },
    ],
    examples: [
      {
        q: 'Simplify (x² − 4)/(x + 2) for x ≠ −2.',
        steps: [
          'Factor the numerator as a difference of squares: (x + 2)(x − 2).',
          'The expression becomes (x + 2)(x − 2)/(x + 2).',
          'Cancel the common factor: x − 2.',
        ],
        answer: 'x − 2',
      },
      {
        q: 'Evaluate 27^(2/3).',
        steps: [
          'The denominator 3 is the root; the numerator 2 is the power.',
          'Cube root first to keep numbers small: ∛27 = 3.',
          'Then square: 3² = 9.',
        ],
        answer: '9',
      },
      {
        q: 'Simplify (x⁴)³ ÷ x⁵.',
        steps: [
          'Power of a power multiplies: (x⁴)³ = x¹².',
          'Division subtracts: x¹² ÷ x⁵ = x⁷.',
          'Two rules, applied in the order the expression presents them.',
        ],
        answer: 'x⁷',
      },
      {
        q: 'Write √(x⁹) as a single power of x.',
        steps: [
          'A square root is the exponent 1/2: √(x⁹) = (x⁹)^(1/2).',
          'Multiply the exponents: x^(9/2).',
          'The rule runs both ways — x^(9/2) unpacks to “the square root of x⁹” on sight.',
        ],
        answer: 'x^(9/2)',
      },
    ],
    mustKnow: [
      'x⁻ⁿ = 1/xⁿ, and x^(m/n) is the nth root of x to the mth power.',
      'A variable with no written exponent has exponent 1.',
      'You may cancel factors, never terms — which is why factoring comes first.',
      '√a · √b = √(ab): split a radical at its largest perfect-square factor to simplify it, and multiply radicals by merging them.',
    ],
    traps: [
      'Adding exponents when the rule calls for multiplying them, or vice versa.',
      'In (2x³)², forgetting to square the coefficient as well as the variable.',
      'Reading a negative exponent as a negative number.',
      'Applying an outside exponent to only one factor of a product — (2x³)² must square the 2 as well.',
      '“Cancelling” terms across a + sign; only factors multiplying the whole top and bottom may cancel.',
    ],
    desmos:
      'Less useful here than anywhere else on the test — the answers are expressions, not numbers. But you can verify an equivalence by graphing both expressions and confirming the curves coincide.',
    timing:
      '30-45 seconds. If picking numbers is faster than the algebra, pick numbers.',
    mastery: [
      'The three exponent rules are reflexes, including negative and fractional exponents in both directions.',
      'You spot difference-of-squares and perfect-square patterns on sight and factor before you cancel, every time.',
      'When the choices contain variables, you pick a number and test — and you know which numbers make bad test values.',
    ],
  },
  {
    unit: 7,
    area: 'ADV',
    title: 'Quadratic Equations and the Discriminant',
    overview:
      'Solving quadratics three ways, plus the discriminant questions that ask how many real solutions exist — or what value of a parameter forces exactly one. Those parameter questions are a reliable feature of the harder module.',
    frequency: 'About 3 questions per section, at least one involving the discriminant.',
    methods: [
      {
        name: 'Try factoring first',
        steps: [
          'Set the equation equal to zero and factor out any common term.',
          'Look for a difference of squares or a perfect square, then for a pair multiplying to ac and adding to b.',
          'If nothing appears within about fifteen seconds, switch to the formula or to Desmos.',
        ],
      },
      {
        name: 'The quadratic formula',
        steps: [
          'x = (−b ± √(b² − 4ac)) / 2a. The entire numerator sits over 2a.',
          'Compute the discriminant first — it tells you the number of solutions before you finish.',
          'Not on the reference sheet. Memorize it.',
        ],
      },
      {
        name: 'Discriminant as a solution counter',
        steps: [
          'b² − 4ac > 0: two distinct real solutions.',
          '= 0: exactly one (a repeated root; the parabola is tangent to the x-axis).',
          '< 0: no real solutions. Questions asking for "exactly one solution" are asking you to set it to zero.',
        ],
      },
    ],
    examples: [
      {
        q: 'In kx² + 12x + 9 = 0, find k so there is exactly one real solution.',
        steps: [
          'One real solution means the discriminant is zero: 12² − 4(k)(9) = 0.',
          '144 − 36k = 0, so k = 4.',
          'Check: 4x² + 12x + 9 = (2x + 3)², a perfect square with the single root x = −3/2 ✓',
        ],
        answer: 'k = 4',
      },
      {
        q: 'Solve (x − 3)² = 16.',
        steps: [
          'Take the square root of both sides, keeping both signs: x − 3 = ±4.',
          'x − 3 = 4 gives x = 7; x − 3 = −4 gives x = −1.',
          'Both check in the original equation.',
        ],
        answer: 'x = 7 or x = −1',
      },
      {
        q: 'Without solving, find the sum and product of the roots of x² − 10x + 21 = 0.',
        steps: [
          'For x² + bx + c, the roots sum to −b and multiply to c.',
          'Sum = 10, product = 21.',
          'That pair is 3 and 7 — the factoring found by arithmetic instead of trial.',
        ],
        answer: 'Sum 10, product 21 (roots 3 and 7)',
      },
      {
        q: 'Solve 3x² = 27.',
        steps: [
          'Divide by 3: x² = 9.',
          'Take the square root with BOTH signs: x = ±3.',
          'Two solutions — an x² equation with a positive right side always has a pair.',
        ],
        answer: 'x = 3 or x = −3',
      },
    ],
    mustKnow: [
      'The quadratic formula, exactly. It is not provided.',
      'Sum of roots = −b/a; product of roots = c/a. These answer sum-and-product questions without solving.',
      'Taking a square root introduces ±. Every time.',
      'Every quadratic tool — factoring, the formula, the discriminant — requires the equation to equal zero first. Rearranging IS step one.',
    ],
    traps: [
      'Dividing both sides by x, which silently destroys the solution x = 0.',
      'Writing only the positive root after taking a square root.',
      'Misplacing 2a so that it divides only the radical instead of the whole numerator.',
      'Setting each factor equal to the constant instead of zero — (x − 2)(x − 5) = 8 does NOT mean x − 2 = 8. Move everything to one side first.',
      'Reading a, b, c off an equation that is not yet in “= 0” form and computing the wrong discriminant.',
    ],
    desmos:
      'Graph y = the quadratic and click the x-intercepts. For a parameter question, add a slider for k and drag until the parabola just touches the axis — this makes "exactly one solution" visible rather than abstract.',
    timing:
      '60-75 seconds. Discriminant questions are faster (45 seconds) once you recognize the pattern.',
    mastery: [
      'You factor what factors within fifteen seconds and switch to the formula or Desmos without regret when it does not.',
      'The discriminant answers every “how many solutions” and “find k for exactly one” question in under a minute.',
      'Sum-and-product lets you answer root questions without ever finding the roots.',
    ],
  },
  {
    unit: 8,
    area: 'ADV',
    title: 'Quadratic Graphs: Forms and Features',
    overview:
      'Each form of a quadratic displays exactly one feature. A whole question type asks only whether you know which form shows what — no computation at all. The rest are vertex, maximum, and minimum questions, including projectile models.',
    frequency: 'About 3 questions per section.',
    methods: [
      {
        name: 'Match the form to the feature',
        steps: [
          'Standard ax² + bx + c displays the y-intercept, c.',
          'Factored a(x − p)(x − q) displays the zeros, p and q.',
          'Vertex a(x − h)² + k displays the vertex, (h, k).',
        ],
      },
      {
        name: 'Find the vertex from standard form',
        steps: [
          'The axis of symmetry is x = −b/2a.',
          'Substitute that x back into the function to get the vertex y-value.',
          'If the quadratic is factored, the vertex x is just the average of the two zeros.',
        ],
      },
      {
        name: 'Complete the square',
        steps: [
          'For x² + bx, halve b and square it.',
          'Add that number and subtract it again so the value is unchanged.',
          'The first three terms fold into a perfect square, leaving vertex form.',
        ],
      },
    ],
    examples: [
      {
        q: 'A ball\'s height is h(t) = −16t² + 64t. Find the maximum height.',
        steps: [
          'The leading coefficient is negative, so the vertex is a maximum.',
          'Vertex at t = −64/(2 · −16) = 2 seconds.',
          'h(2) = −64 + 128 = 64 feet.',
        ],
        answer: '64 feet',
      },
      {
        q: 'Rewrite x² + 6x + 1 in vertex form.',
        steps: [
          'Half of 6 is 3; 3² = 9. Add and subtract 9.',
          '(x² + 6x + 9) − 9 + 1 = (x + 3)² − 8.',
          'The vertex is (−3, −8).',
        ],
        answer: '(x + 3)² − 8',
      },
      {
        q: 'Describe the graph of y = 2(x − 3)² + 1.',
        steps: [
          'Vertex form: the vertex is (3, 1).',
          'a = 2 is positive, so it opens upward and the vertex is a minimum.',
          'Minimum value 1, at x = 3; no x-intercepts, since the whole graph sits above y = 1 > 0.',
        ],
        answer: 'Opens up, vertex (3, 1), minimum value 1',
      },
      {
        q: 'Find the zeros and the maximum of f(x) = −x² + 6x − 5.',
        steps: [
          'Factor out the negative: f(x) = −(x² − 6x + 5) = −(x − 1)(x − 5), so the zeros are 1 and 5.',
          'The vertex sits midway between them, at x = 3.',
          'f(3) = −9 + 18 − 5 = 4 — a maximum, since the parabola opens down.',
        ],
        answer: 'Zeros 1 and 5; maximum 4 at x = 3',
      },
    ],
    mustKnow: [
      'Vertex at x = −b/2a, which is also the midpoint of the zeros.',
      'a > 0 opens up (minimum); a < 0 opens down (maximum).',
      'In a(x − h)² + k the sign of h is opposite how it reads inside the parentheses.',
      'In every form, the y-intercept is f(0) — for standard form that is c, with no work at all.',
    ],
    traps: [
      'Giving the vertex x-coordinate when the question asked for the maximum *value* (the y-coordinate), or the reverse.',
      'Sign errors on h — (x + 3)² has vertex x = −3.',
      'Forgetting that the zeros alone do not determine a parabola; a third point is needed to pin down a.',
      'Reading a(x + h)² as having vertex +h; the vertex x is what zeroes the inside, so (x + 3)² means x = −3.',
      'Assuming the y-intercept is the vertex; they coincide only when b = 0 and the axis is the y-axis itself.',
    ],
    desmos:
      'Graph the quadratic and click the turning point — Desmos labels the vertex exactly. Only fall back on completing the square when the question wants the rewritten *expression* rather than a number.',
    timing:
      '45-90 seconds. "Which form displays…" questions should take 20 seconds; projectile models take the longest.',
    mastery: [
      'You read the right feature straight out of the right form and convert between forms when the question demands a different one.',
      'Vertex, axis, zeros, intercept, max or min: you can produce all five for any quadratic in about a minute.',
      'Projectile questions are vertex questions to you now — you go straight to −b/2a or the midpoint of the zeros.',
    ],
  },
  {
    unit: 9,
    area: 'ADV',
    title: 'Nonlinear Systems, Polynomials, and Rational Equations',
    overview:
      'Where curves meet, what a zero tells you about a factor, and equations with variables in denominators or under radicals. The extraneous-solution check is not optional here — it is the point of several questions.',
    frequency: 'About 3 questions per section, concentrated in the harder module.',
    methods: [
      {
        name: 'Solve a nonlinear system by substitution',
        steps: [
          'Set the two expressions for y equal to each other.',
          'Rearrange into a standard quadratic and solve.',
          'The discriminant counts the intersections: two, one (tangent), or none.',
        ],
      },
      {
        name: 'Use the Factor Theorem',
        steps: [
          'p(a) = 0 ⟺ (x − a) is a factor of p(x). The sign flips.',
          'Given one zero, divide it out to reduce a cubic to a quadratic you can factor.',
          'Integer zeros can only be divisors of the constant term, which keeps the search short.',
        ],
      },
      {
        name: 'Clear denominators, then check',
        steps: [
          'Multiply through by the common denominator to remove fractions.',
          'Solve the resulting equation.',
          'Substitute back: any value making an original denominator zero is disqualified, and squaring can invent solutions.',
        ],
      },
    ],
    examples: [
      {
        q: 'Solve √(x + 7) = x − 5.',
        steps: [
          'Square both sides: x + 7 = x² − 10x + 25, so x² − 11x + 18 = 0.',
          'Factor: (x − 9)(x − 2) = 0, giving x = 9 or x = 2.',
          'Check both: x = 9 gives 4 = 4 ✓; x = 2 gives 3 = −3 ✗. Only x = 9 survives.',
        ],
        answer: 'x = 9',
      },
      {
        q: 'The line y = k meets y = x² − 6x + 5 at exactly one point. Find k.',
        steps: [
          'A horizontal line touches a parabola exactly once only at the vertex.',
          'The vertex is at x = 6/2 = 3.',
          'y = 9 − 18 + 5 = −4, so k = −4.',
        ],
        answer: 'k = −4',
      },
      {
        q: 'Solve 2/(x + 1) = 4/(x + 4).',
        steps: [
          'Cross-multiply: 2(x + 4) = 4(x + 1).',
          '2x + 8 = 4x + 4, so x = 2.',
          'Check the denominators at x = 2: 3 and 6, neither zero — the solution stands.',
        ],
        answer: 'x = 2',
      },
      {
        q: 'A polynomial is written p(x) = (x − 2)(x + 5)q(x) for some polynomial q. What can you conclude?',
        steps: [
          'Each displayed factor forces a zero: p(2) = 0 and p(−5) = 0, whatever q is.',
          'So the graph crosses or touches the x-axis at 2 and −5.',
          'About other zeros you can conclude nothing — q may contribute more.',
        ],
        answer: 'p(2) = 0 and p(−5) = 0',
      },
    ],
    mustKnow: [
      '"p(3) = 0", "3 is a zero", "the graph passes through (3, 0)", and "(x − 3) divides p(x)" all say the same thing.',
      'Squaring both sides can create solutions the original rejects — always substitute back.',
      'Degrees add when polynomials are multiplied.',
      'Squaring both sides is safe only when both sides are known nonnegative — which is exactly why the check afterwards is mandatory, not optional.',
    ],
    traps: [
      'Skipping the extraneous check on a radical or rational equation. The invented solution is always an answer choice.',
      'Getting the sign backwards on the Factor Theorem: a zero of 3 means the factor (x − 3), not (x + 3).',
      'Forgetting that a value making a denominator zero is excluded no matter what the algebra says.',
      'Multiplying only one side of an equation by the common denominator.',
      'Reporting “two solutions” for a radical equation before substituting both back — squaring routinely invents one.',
    ],
    desmos:
      'The strongest use case on the whole test. Graph both curves and click the intersections — this answers "how many solutions" instantly and gives the coordinates. For polynomials, graph and read the x-intercepts rather than dividing by hand.',
    timing:
      '75-100 seconds. These are among the most expensive questions on the test; flag one rather than sinking two minutes into it.',
    mastery: [
      'You solve rational and radical equations with the extraneous check built into your hands, not bolted on.',
      'The Factor Theorem\'s four phrasings — zero, root, factor, point on the graph — are one fact to you.',
      'Curve-meets-line questions go straight to a quadratic and its discriminant, or straight to Desmos, whichever is faster today.',
    ],
  },
  {
    unit: 10,
    area: 'ADV',
    title: 'Exponential Functions, Growth, and Decay',
    overview:
      'Building and reading a·bˣ models. Most errors here are not algebra — they are misreading what the base means as a percentage, or what the exponent counts.',
    frequency: 'About 2-3 questions per section.',
    methods: [
      {
        name: 'Convert a percent rate to a base',
        steps: [
          'Growth: base = 1 + r. A 7% increase gives 1.07.',
          'Decay: base = 1 − r. A 12% loss gives 0.88 — what remains, not what is lost.',
          'b > 1 is growth; 0 < b < 1 is decay.',
        ],
      },
      {
        name: 'Make the exponent count periods',
        steps: [
          'The exponent counts growth periods, not time units.',
          'If the period is p time units, the exponent is t/p — divide, never multiply.',
          'Verify by setting t = p: you should get exactly one growth step.',
        ],
      },
      {
        name: 'Distinguish linear from exponential',
        steps: [
          'Take differences between consecutive outputs. Constant differences mean linear.',
          'Take ratios. Constant ratios mean exponential.',
          'Both checks take ten seconds together and settle any "which model fits" question.',
        ],
      },
    ],
    examples: [
      {
        q: 'A population of 2,000 doubles every 5 hours. Model P after t hours.',
        steps: [
          'Doubling makes the base 2, and the initial value is 2,000.',
          'In t hours there are t/5 doubling periods.',
          'P = 2000(2)^(t/5). Check at t = 5: 2000 · 2 = 4000 ✓',
        ],
        answer: 'P = 2000(2)^(t/5)',
      },
      {
        q: 'f(x) = abˣ with f(1) = 12 and f(3) = 48. Find a.',
        steps: [
          'Divide the two: f(3)/f(1) = b² = 48/12 = 4, so b = 2.',
          'Substitute back: a(2) = 12, so a = 6.',
          'The function is f(x) = 6 · 2ˣ.',
        ],
        answer: 'a = 6',
      },
      {
        q: 'A machine\'s value drops 8% per year from $300. Model its value after t years.',
        steps: [
          'An 8% loss keeps 92%, so the yearly multiplier is 0.92.',
          'V = 300(0.92)^t.',
          'Check one year: 300 × 0.92 = 276, which is indeed 8% ($24) below 300 ✓',
        ],
        answer: 'V = 300(0.92)^t',
      },
      {
        q: 'Compare f(x) = 5·2ˣ with g(x) = 5 + 2x at x = 4.',
        steps: [
          'f(4) = 5 · 16 = 80 — four doublings.',
          'g(4) = 5 + 8 = 13 — four additions of 2.',
          'Same start, same “2”, wildly different growth: multiplying compounds, adding does not.',
        ],
        answer: 'f(4) = 80 versus g(4) = 13',
      },
    ],
    mustKnow: [
      'In a·bˣ, a is the initial value (the output at x = 0) and b is the per-period multiplier.',
      'Growth A = a(1 + r)^t; decay A = a(1 − r)^t; compounded n times a year, A = a(1 + r/n)^(nt).',
      'Anything nonzero to the power 0 equals 1.',
      'After n periods the total multiplier is bⁿ, and stepping backwards one period divides by b — which is how you recover f(0) from a table that starts at f(1).',
    ],
    traps: [
      'Reading a base of 0.85 as "decreases by 85%" when it means "decreases by 15%".',
      'Multiplying the exponent by the period instead of dividing.',
      'Modelling a percent change as repeated addition — that is linear, and it will be a choice.',
      'Reading “increases by a factor of 3” as +3 rather than ×3.',
      'Applying the percent to the original amount every period — that is simple interest, and the model is then linear, not exponential.',
    ],
    desmos:
      'Graph a candidate model and check a known value from the problem. For fitting a model to a table, enter the data and use y₁ ~ ab^x₁ to get a and b directly.',
    timing:
      '60-75 seconds. Model-selection questions go faster if you compute the expected value after one period and test the choices against it.',
    mastery: [
      'You convert between a percent rate and a base multiplier in both directions without pausing.',
      'The exponent always counts periods in your models, and you verify by substituting one full period.',
      'Given any two values of an exponential function, you can recover both a and b inside ninety seconds.',
    ],
  },

  // ───────── PROBLEM-SOLVING AND DATA ANALYSIS ─────────
  {
    unit: 11,
    area: 'PSDA',
    title: 'Ratios, Rates, Proportions, and Units',
    overview:
      'Setting up proportions and chaining unit conversions. The arithmetic is never the hard part; the difficulty is deciding which way to divide, and dimensional analysis decides that for you.',
    frequency: 'About 2 questions per section.',
    methods: [
      {
        name: 'Set up a proportion with matching units',
        steps: [
          'Put the same unit in the same position in both fractions — cups over cookies equals cups over cookies.',
          'Cross-multiply and solve.',
          'If one denominator divides evenly into the other, scale directly instead; it is faster.',
        ],
      },
      {
        name: 'Chain conversions so units cancel',
        steps: [
          'Write each conversion factor as a fraction, oriented so the unwanted unit cancels diagonally.',
          'Multiply straight across.',
          'If the surviving units are not the ones requested, a factor is upside down — fix it before computing.',
        ],
      },
      {
        name: 'Reduce to a single-unit rate',
        steps: [
          'For work problems, compute output per machine-hour (or per person-day) first.',
          'Multiply that rate by the new total of machine-hours.',
          'This is harder to get backwards than scaling two factors separately.',
        ],
      },
    ],
    examples: [
      {
        q: 'Convert 60 miles per hour to feet per second (5,280 ft per mile, 3,600 s per hour).',
        steps: [
          'Write the chain: (60 mi/hr) × (5280 ft / 1 mi) × (1 hr / 3600 s).',
          'Miles cancel and hours cancel, leaving feet per second.',
          '(60 × 5280)/3600 = 88 ft/s.',
        ],
        answer: '88 ft/s',
      },
      {
        q: 'Three machines make 120 parts in 4 hours. How many do five machines make in 6 hours?',
        steps: [
          'Total effort was 3 × 4 = 12 machine-hours for 120 parts.',
          'So the rate is 10 parts per machine-hour.',
          'The new job is 5 × 6 = 30 machine-hours: 300 parts.',
        ],
        answer: '300 parts',
      },
      {
        q: '3 pounds of apples cost $7.50. What do 8 pounds cost at the same rate?',
        steps: [
          'Unit price first: 7.50 ÷ 3 = $2.50 per pound.',
          '8 × 2.50 = $20.',
          'Through the unit rate in two steps — and the intermediate $2.50/lb is easy to sanity-check.',
        ],
        answer: '$20',
      },
      {
        q: 'A car uses 6 gallons over 180 miles. How many gallons for 300 miles at the same rate?',
        steps: [
          'Efficiency: 180 ÷ 6 = 30 miles per gallon.',
          '300 ÷ 30 = 10 gallons.',
          'Or scale directly: 300 miles is 180 × 5/3, so gas is 6 × 5/3 = 10 ✓',
        ],
        answer: '10 gallons',
      },
    ],
    mustKnow: [
      'A unit rate is "per one" — divide the total by the number of units.',
      'Units cancel like algebraic factors. That is what makes them a free error check.',
      'Scale factors apply to lengths directly; watch for a unit change at the end of the question.',
      'Unit price, speed, density, and efficiency are one structure: amount ÷ base. Find the per-one rate and most of these questions become one multiplication.',
    ],
    traps: [
      'Dividing when you should multiply. Predict whether the answer should be bigger or smaller first.',
      'Answering in the units the problem gave rather than the units it asked for.',
      'Two-step questions where the scale work is obvious and the unit conversion is not.',
      'Averaging two rates when the question needs total ÷ total — a round trip at 30 and 60 mph does NOT average 45.',
      'Building a proportion with mismatched positions: cups over cookies must equal cups over cookies, never its flip on one side only.',
    ],
    desmos:
      'Useful only as a calculator here. The work is in the setup, which Desmos cannot do for you.',
    timing:
      '45-75 seconds. Multi-factor conversions take longer and are worth writing out fully.',
    mastery: [
      'You default to the unit rate and know when direct scaling is faster.',
      'Conversion chains come out with the right units because you cancel them like factors, every time.',
      'Work problems reduce to machine-hours (or person-days) in your first line.',
    ],
  },
  {
    unit: 12,
    area: 'PSDA',
    title: 'Percentages, Percent Change, and Interest',
    overview:
      'Percent of, percent change, reverse percent, and successive multipliers. Almost every question in this unit is built on one asymmetry: the percentage is taken from a base, and the base changes.',
    frequency: 'About 2 questions per section.',
    methods: [
      {
        name: 'Use multipliers, not two-step arithmetic',
        steps: [
          'An increase of r% is a multiplier of (1 + r/100); a decrease is (1 − r/100).',
          'One multiplication replaces "find the change, then add it", with no chance of forgetting the second step.',
          'Multipliers also chain, which is what makes successive changes easy.',
        ],
      },
      {
        name: 'Reverse a percent by dividing',
        steps: [
          'If the result after a change is known, divide by the multiplier to recover the original.',
          'After a 25% discount, 0.75p = 60 gives p = 80.',
          'Never add the percentage back — that uses the wrong base and lands on a trap answer.',
        ],
      },
      {
        name: 'Chain successive changes by multiplying',
        steps: [
          'Up 20% then down 20% is 1.20 × 0.80 = 0.96 — a 4% net loss, not a wash.',
          'Two discounts of 20% and 10% give 0.80 × 0.90 = 0.72, a 28% total discount, not 30%.',
          'Successive changes never add.',
        ],
      },
    ],
    examples: [
      {
        q: 'A $200 item is discounted 20%, then a further 10% comes off the sale price. Final price?',
        steps: [
          'First discount: 200 × 0.80 = $160.',
          'Second discount applies to $160: 160 × 0.90 = $144.',
          'Or combine: 200 × 0.72 = $144.',
        ],
        answer: '$144',
      },
      {
        q: 'A number increased by 30% is 156. Find the original.',
        steps: [
          'Increasing by 30% multiplies by 1.30, so 1.30n = 156.',
          'Divide: n = 156 / 1.3 = 120.',
          'Check: 30% of 120 is 36, and 120 + 36 = 156 ✓',
        ],
        answer: '120',
      },
      {
        q: 'A meal costs $60 plus 8% tax. What is the total?',
        steps: [
          'Adding 8% means multiplying by 1.08.',
          '60 × 1.08 = $64.80.',
          'Same machinery as a markup — tax, tip, markup, and interest are all “× (1 + r)”.',
        ],
        answer: '$64.80',
      },
      {
        q: 'A reading drops from 250 to 190. What is the percent decrease?',
        steps: [
          'The change is 250 − 190 = 60.',
          'Divide by the ORIGINAL: 60 ÷ 250 = 0.24.',
          'A 24% decrease. (60 ÷ 190 ≈ 32% is the trap that divides by the new value.)',
        ],
        answer: '24% decrease',
      },
    ],
    mustKnow: [
      'part = percent × whole. Every percent question is this with one unknown.',
      'Percent change = (new − old)/old. Always divide by the ORIGINAL.',
      'Compound interest: A = P(1 + r)^t, applying the multiplier once per period.',
      '“100% more” doubles; “200% more” triples. “Of” multiplies; “more than” adds the original back on.',
    ],
    traps: [
      'Dividing by the new value instead of the original when computing percent change.',
      'Adding successive percentages together.',
      'Answering with the amount of the increase when the question wanted the new total.',
      'Confusing percentage points with percent: 20% → 30% is a rise of 10 points but a 50 percent increase.',
      'Taking a percent of the wrong base mid-problem — write down whose 15% it is before computing anything.',
    ],
    desmos:
      'A straightforward calculator here. The value is in setting up the right multiplier, not in the arithmetic.',
    timing:
      '45-80 seconds. Reverse-percent and successive-change questions are the slowest and the most commonly missed.',
    mastery: [
      'You move between a percent, its decimal, and its multiplier without friction, in both directions.',
      'Reverse-percent questions trigger division by the multiplier — adding the percent back never tempts you.',
      'You chain successive changes by multiplying and can say the net percent change of any two steps.',
    ],
  },
  {
    unit: 13,
    area: 'PSDA',
    title: 'One-Variable Data: Center, Spread, and Shape',
    overview:
      'Mean, median, range, and standard deviation — but conceptually rather than computationally. The SAT never asks you to calculate a standard deviation; it asks you to compare two data sets, or to predict what an outlier does.',
    frequency: 'About 2 questions per section.',
    methods: [
      {
        name: 'Work with totals, not averages',
        steps: [
          'sum = mean × count. Rearranging this solves nearly every average question.',
          'Adding or removing a value: adjust the sum and the count, then divide again.',
          '"What score is needed to reach an average of X" is a totals question.',
        ],
      },
      {
        name: 'Read skew to compare mean and median',
        steps: [
          'Right-skewed (a high straggler): mean > median.',
          'Left-skewed (a low straggler): mean < median.',
          'Symmetric: roughly equal. The mean chases outliers; the median ignores them.',
        ],
      },
      {
        name: 'Compare standard deviations by inspection',
        steps: [
          'Standard deviation measures typical distance from the mean.',
          'Tightly clustered data has a small deviation; widely spread data has a large one.',
          'Equal means tell you nothing about spread — that is exactly why the question gives both sets the same mean.',
        ],
      },
    ],
    examples: [
      {
        q: 'Five tests average 82. What score on a sixth raises the average to 84?',
        steps: [
          'Current sum: 5 × 82 = 410. Required sum: 6 × 84 = 504.',
          'The new score must be 504 − 410 = 94.',
          'Or: lifting five tests by 2 points each needs 10 extra, so 84 + 10 = 94.',
        ],
        answer: '94',
      },
      {
        q: 'A set of 8 numbers has mean 15. Remove the value 22. New mean?',
        steps: [
          'Sum is 8 × 15 = 120.',
          'After removing 22: 98 across 7 numbers.',
          '98 / 7 = 14. It fell because 22 was above the old mean.',
        ],
        answer: '14',
      },
      {
        q: 'Five values have a mean of 24. Four of them are 20, 22, 25, and 27. Find the fifth.',
        steps: [
          'Total needed: 5 × 24 = 120.',
          'The four known values sum to 94.',
          'The fifth is 120 − 94 = 26.',
        ],
        answer: '26',
      },
      {
        q: 'Four values have a mean of 10. A fifth value of 10 is added. What is the new mean?',
        steps: [
          'Old sum 40; new sum 50 over 5 values.',
          'New mean = 10 — unchanged.',
          'Adding a value equal to the mean never moves it; above raises it, below lowers it.',
        ],
        answer: '10 — unchanged',
      },
    ],
    mustKnow: [
      'Sort before finding a median. With an even count, average the middle two.',
      'The median is resistant to outliers; the mean is not.',
      'Range = maximum − minimum, and it uses only the two extremes.',
      'Adding a value above the mean pulls it up, below pulls it down, equal leaves it fixed — direction first, arithmetic second.',
    ],
    traps: [
      'Taking the median of an unsorted list.',
      'Averaging the value column of a frequency table instead of weighting by frequency.',
      'Assuming equal means imply similar spread, or that a larger mean implies a larger standard deviation.',
      'Finding a frequency table\'s median by eyeballing the value column instead of counting up to the middle person.',
      'Concluding that a larger range implies a larger standard deviation — one outlier stretches the range while the rest of the data stays tight.',
    ],
    desmos:
      'Enter a list L = [4, 7, 7, 9] and use mean(L), median(L), stdev(L). Useful when a frequency table makes the arithmetic tedious.',
    timing:
      '45-90 seconds. Conceptual comparisons should take 30 seconds; frequency-table means take the longest.',
    mastery: [
      'Every average question becomes a totals question in your first line: sum = mean × count.',
      'You predict what an added or removed value does to mean and median before computing anything.',
      'You compare standard deviations by looking at clustering, and you can defend the comparison in one sentence.',
    ],
  },
  {
    unit: 14,
    area: 'PSDA',
    title: 'Two-Variable Data, Probability, and Inference',
    overview:
      'Scatterplots, lines of best fit, two-way tables, and what a study is actually entitled to conclude. The probability questions are read off tables, so the only real difficulty is choosing the correct denominator.',
    frequency: 'About 2-3 questions per section.',
    methods: [
      {
        name: 'Find the denominator before the numerator',
        steps: [
          'The phrase after "of" or "from" names the group you are restricted to.',
          '"Of all students" means the grand total; "of those who chose A" means that row or column total.',
          'Circle the denominator in the table, then read off the numerator.',
        ],
      },
      {
        name: 'Read a line of best fit',
        steps: [
          'Predicted value: substitute into the line. Actual value: read the data point.',
          'Residual = actual − predicted. A positive residual means the point sits above the line.',
          'The slope is a rate with units; the intercept is the value at input zero.',
        ],
      },
      {
        name: 'Decide what a study justifies',
        steps: [
          'Random selection from a population lets you generalize to that population — and no further.',
          'Random assignment to treatments lets you claim cause.',
          'Neither one gives you the other, and a study without random assignment can only show association.',
        ],
      },
    ],
    examples: [
      {
        q: 'A line of best fit is y = 3x + 8. A data point is (6, 30). Find the residual.',
        steps: [
          'Predicted: 3(6) + 8 = 26.',
          'Actual: 30.',
          'Residual = 30 − 26 = 4, so the point lies above the line.',
        ],
        answer: '4',
      },
      {
        q: 'A poll estimates 48% support with a margin of error of 3 points. Which values are consistent?',
        steps: [
          'The interval is 48 ± 3, or 45% to 51%.',
          'Any value inside that interval is consistent with the poll.',
          'A value like 53% falls outside and is not supported.',
        ],
        answer: '45% through 51%',
      },
      {
        q: 'The probability of rain is 0.3. What is the probability of no rain?',
        steps: [
          '“No rain” is the complement of “rain”.',
          'P(not A) = 1 − P(A) = 1 − 0.3 = 0.7.',
          'On tables, the same idea: the “not” count is the total minus the counted row.',
        ],
        answer: '0.7',
      },
      {
        q: 'A best-fit line for library visits (y) against distance in km (x) has slope −0.8. Interpret it.',
        steps: [
          'Slope units: visits per kilometer.',
          'Each additional kilometer of distance predicts about 0.8 FEWER visits.',
          'The sign carries the direction; the number carries the size — an interpretation needs both.',
        ],
        answer: '≈0.8 fewer visits per extra km',
      },
    ],
    mustKnow: [
      'Probability = favorable / total, where the total is whatever group the question restricts you to.',
      'A larger sample narrows the margin of error.',
      'Correlation is not causation — unless the study randomly assigned the treatment.',
      'Residual = actual − predicted. Positive means the point sits above the line and the model under-predicted.',
    ],
    traps: [
      'Using the grand total when the question conditions on a row or column.',
      'Confusing the predicted value with the observed one.',
      'Over-generalizing from a sample drawn from one school or one group of volunteers.',
      'Reading a strong correlation as proof of cause — without random assignment it is association, full stop.',
      'Trusting a best-fit prediction far outside the data\'s x-range; the line is only evidence where the data lives.',
    ],
    desmos:
      'For a scatterplot question, enter the data in a table and type y₁ ~ mx₁ + b — Desmos returns the least-squares slope and intercept. This turns a line-of-best-fit question into a typing exercise.',
    timing:
      '55-90 seconds. Most of that is reading. Inference questions are pure reading and should take no calculation at all.',
    mastery: [
      'You name the denominator before touching a two-way table, and conditional phrasings cannot flip you.',
      'Predicted, actual, and residual are three different numbers you never interchange.',
      'You can say exactly what a study design entitles you to conclude — and no more.',
    ],
  },

  // ───────── GEOMETRY AND TRIGONOMETRY ─────────
  {
    unit: 15,
    area: 'GEO',
    title: 'Lines, Angles, and Triangles',
    overview:
      'Angle chasing. Parallel lines cut by a transversal produce only two distinct angle measures, which collapses a page of vocabulary into one idea. Add the triangle sum and the exterior angle theorem and this unit is largely complete.',
    frequency: 'About 2 questions per section.',
    methods: [
      {
        name: 'Chase angles through parallel lines',
        steps: [
          'A transversal across parallel lines creates just two values, and they are supplementary.',
          'Angles that look equal are equal; angles that look different are supplementary.',
          'For algebraic angle expressions: congruent means set them equal, supplementary means set the sum to 180.',
        ],
      },
      {
        name: 'Use the triangle sum and its consequences',
        steps: [
          'The three interior angles total 180°.',
          'An exterior angle equals the sum of the two remote interior angles.',
          'Isosceles triangles have equal base angles — equal sides face equal angles.',
        ],
      },
      {
        name: 'Solve ratio and algebraic angle problems',
        steps: [
          'For a ratio like 1 : 2 : 3, add the parts and divide 180 among them.',
          'For expressions, sum them, set the total to 180, and solve.',
          'Compute the actual angles afterwards as a check that they sum correctly.',
        ],
      },
    ],
    examples: [
      {
        q: 'Corresponding angles measure (3x + 10)° and (5x − 30)°. Find x.',
        steps: [
          'Corresponding angles across parallel lines are congruent.',
          '3x + 10 = 5x − 30, so 40 = 2x.',
          'x = 20, and both angles measure 70° ✓',
        ],
        answer: 'x = 20',
      },
      {
        q: 'The angles of a triangle are in the ratio 1 : 2 : 3. Find the largest.',
        steps: [
          'Let them be x, 2x, 3x. Their sum is 6x = 180.',
          'x = 30, so the angles are 30°, 60°, and 90°.',
          'The largest is 90° — this is a right triangle.',
        ],
        answer: '90°',
      },
      {
        q: 'Two lines cross. One of the four angles measures 38°. Find the other three.',
        steps: [
          'Vertical angles are equal: the angle opposite is also 38°.',
          'Each adjacent angle is supplementary: 180 − 38 = 142°.',
          'So the four angles are 38, 142, 38, 142 — two numbers, as always.',
        ],
        answer: '38°, 142°, 142°',
      },
      {
        q: 'Three angles of a quadrilateral measure 85°, 95°, and 110°. Find the fourth.',
        steps: [
          'A quadrilateral\'s angles sum to (4 − 2) × 180 = 360°.',
          '85 + 95 + 110 = 290.',
          'The fourth is 360 − 290 = 70°.',
        ],
        answer: '70°',
      },
    ],
    mustKnow: [
      'Triangle angles sum to 180°. An n-gon\'s interior angles sum to (n − 2) × 180°.',
      'Supplementary = 180°; complementary = 90°.',
      'Triangle inequality: the two shorter sides must together exceed the longest.',
      'Vertical angles are equal, and a linear pair sums to 180° — the two facts that unlock every crossing-lines figure.',
    ],
    traps: [
      'Measuring the figure. Diagrams are not to scale unless stated.',
      'Assuming a right angle because it looks like one — it counts only if marked or stated.',
      'Mixing up the vertex angle and the base angles of an isosceles triangle.',
      'Assuming lines are parallel because they look it — every parallel-angle rule requires the parallel marks or a statement.',
      'Applying the 180° triangle sum to a quadrilateral; four sides means 360°.',
    ],
    desmos:
      'Rarely useful here. Redraw the figure on scratch paper and label every given directly onto your copy — that is the tool for this unit.',
    timing:
      '40-70 seconds. Algebraic angle questions take longest because of the setup, not the solving.',
    mastery: [
      'You chase angles through any parallel-line figure using just “equal or supplementary”.',
      'Triangle sum, exterior angle, and isosceles base angles are one connected toolkit you apply without prompting.',
      'You redraw and label every figure, and you never trust an unmarked right angle.',
    ],
  },
  {
    unit: 16,
    area: 'GEO',
    title: 'Area, Volume, and Similarity',
    overview:
      'Formulas plus one big idea: scaling. Most similarity questions test only that lengths scale by k, areas by k², and volumes by k³ — and the trap answer is always the one that scaled linearly.',
    frequency: 'About 2 questions per section.',
    methods: [
      {
        name: 'Volume = base area × height',
        steps: [
          'This one rule covers every prism and cylinder — only the base shape changes.',
          'Cones and pyramids take one third of that, because they taper to a point.',
          'The sphere formula is the one genuine exception, and it is on the reference sheet.',
        ],
      },
      {
        name: 'Composite area by subtraction',
        steps: [
          'Compute the whole region, then subtract the hole.',
          'This beats carving the leftover shape into pieces, every time.',
          'It is the standard move for shaded-region and leftover-area questions.',
        ],
      },
      {
        name: 'Scale by the right power',
        steps: [
          'Lengths scale by k, areas by k², volumes by k³.',
          'The exponent is just the number of dimensions being measured.',
          'For similar figures, find the scale factor from a known pair of corresponding sides first.',
        ],
      },
    ],
    examples: [
      {
        q: 'Two similar triangles have sides in the ratio 1 : 3. Find the ratio of their areas.',
        steps: [
          'Area is two-dimensional, so the factor applies twice.',
          'The area ratio is 1 : 3² = 1 : 9.',
          'Verify: a 2-by-2 triangle has area 2; scaled to 6-by-6 it has area 18, and 18/2 = 9 ✓',
        ],
        answer: '1 : 9',
      },
      {
        q: 'A cone and a cylinder share a radius and height. The cylinder holds 60 in³. Find the cone\'s volume.',
        steps: [
          'Cylinder: πr²h. Cone: ⅓πr²h.',
          'The cone is exactly one third, whatever r and h are.',
          '60 / 3 = 20 in³.',
        ],
        answer: '20 in³',
      },
      {
        q: 'A trapezoid has parallel sides 6 and 10 and height 4. Find its area.',
        steps: [
          'Trapezoid area = ½(b₁ + b₂)h — average the parallel sides, times the height.',
          '½(6 + 10) = 8, and 8 × 4 = 32.',
          'The trapezoid behaves like an 8-by-4 rectangle — that is what averaging the bases means.',
        ],
        answer: '32',
      },
      {
        q: 'A 2 × 3 × 4 box: find its volume and its surface area.',
        steps: [
          'Volume: 2 × 3 × 4 = 24 cubic units.',
          'Faces come in three pairs: 2·3, 2·4, 3·4 → 6 + 8 + 12 = 26, doubled = 52 square units.',
          'Different questions, different units — cubic for filling, square for wrapping.',
        ],
        answer: 'V = 24, SA = 52',
      },
    ],
    mustKnow: [
      'Triangle area = ½bh; circle area = πr²; circumference = 2πr.',
      'Cone, pyramid, and sphere formulas are on the reference sheet — but each lookup costs about 15 seconds.',
      'Doubling every dimension multiplies volume by 8, not by 2.',
      'Trapezoid area = ½(b₁ + b₂)h. It is on the reference sheet, but recognizing “average the parallel sides” makes it unforgettable.',
    ],
    traps: [
      'Forgetting the ½ in the triangle area formula.',
      'Confusing area (πr²) with circumference (2πr) — both appear as choices.',
      'Applying a linear scale factor to an area or volume.',
      'Using a slanted side as the height — height is always measured perpendicular to the base.',
      'Quoting a volume in square units or an area in cubic units; the units name the dimension, and wrong-dimension values appear among the choices.',
    ],
    desmos:
      'A calculator only. Keeping answers in terms of π is usually faster and matches how the choices are written.',
    timing:
      '40-75 seconds. Composite-area questions take the longest and reward a quick sketch.',
    mastery: [
      'Whole-minus-hole is your first instinct on any shaded or leftover region.',
      'The k, k², k³ scaling ladder is automatic, in both directions.',
      'You can compute area, surface area, and volume for every solid the SAT uses — and you know which the question wants from its units.',
    ],
  },
  {
    unit: 17,
    area: 'GEO',
    title: 'Right Triangles and Trigonometry',
    overview:
      'Pythagoras, the two special right triangles, SOH-CAH-TOA, and the complementary-angle identity. Recognizing a Pythagorean triple or a special triangle on sight is worth more here than any other memorization on the test.',
    frequency: 'About 2 questions per section.',
    methods: [
      {
        name: 'Recognize before you compute',
        steps: [
          'Check for a Pythagorean triple: 3-4-5, 5-12-13, 8-15-17, 7-24-25, and every multiple.',
          'Check for a special triangle: 45-45-90 (1 : 1 : √2) or 30-60-90 (1 : √3 : 2).',
          'Only reach for the theorem or the calculator when neither pattern applies.',
        ],
      },
      {
        name: 'Label the triangle before choosing a ratio',
        steps: [
          'The hypotenuse is always opposite the right angle and never changes.',
          '"Opposite" and "adjacent" swap depending on which acute angle you are using.',
          'Then apply SOH-CAH-TOA to the labelled sides.',
        ],
      },
      {
        name: 'Move between trig ratios',
        steps: [
          'Given one ratio, sketch the triangle and use Pythagoras to get the third side.',
          'Then read off whichever ratio the question wants.',
          'Or use sin²θ + cos²θ = 1 when no triangle is described.',
        ],
      },
    ],
    examples: [
      {
        q: 'cos θ = 5/13 for an acute angle θ. Find sin θ.',
        steps: [
          'Cosine gives adjacent = 5 and hypotenuse = 13.',
          'The opposite side is √(169 − 25) = 12 — a 5-12-13 triangle.',
          'sin θ = 12/13 ≈ 0.92.',
        ],
        answer: '12/13',
      },
      {
        q: 'A 20-ft ladder leans at 60° to the ground. How far up the wall does it reach?',
        steps: [
          'The ladder is the hypotenuse of a 30-60-90 triangle, so the short side is 10.',
          'The height is opposite the 60° angle: 10√3.',
          'Or directly: 20 sin 60° = 20(√3/2) = 10√3 ft.',
        ],
        answer: '10√3 ft',
      },
      {
        q: 'A ramp rises 3 feet over a 4-foot horizontal run. Find tan θ and the ramp\'s length.',
        steps: [
          'tan θ = opposite ÷ adjacent = 3/4.',
          'The ramp is the hypotenuse of a 3-4-5 triangle: 5 feet.',
          'One triple, two answers — no calculator touched.',
        ],
        answer: 'tan θ = 3/4; ramp = 5 ft',
      },
      {
        q: 'Given cos 25° = k, express sin 65° in terms of k.',
        steps: [
          '25° and 65° are complementary: 25 + 65 = 90.',
          'The cofunction identity: sin 65° = cos(90° − 65°) = cos 25°.',
          'So sin 65° = k, with no computation at all.',
        ],
        answer: 'sin 65° = k',
      },
    ],
    mustKnow: [
      'a² + b² = c², with c the hypotenuse.',
      '45-45-90 is 1 : 1 : √2; 30-60-90 is 1 : √3 : 2 with the short side opposite the 30°.',
      'sin(x) = cos(90° − x). The two acute angles of a right triangle are complementary.',
      'The exact values: sin 30° = cos 60° = 1/2, sin 60° = cos 30° = √3/2, sin 45° = cos 45° = √2/2, tan 45° = 1.',
    ],
    traps: [
      'Adding when you should subtract to find a leg — the answer must come out smaller than the hypotenuse.',
      'Using the sides labelled for one acute angle while solving for the other.',
      'Mixing up the √2 and √3 of the two special triangles.',
      'Evaluating trig in the wrong calculator mode — degrees in radian mode is a silent, plausible-looking error.',
      'Applying SOH-CAH-TOA in a triangle with no right angle; the ratios are defined for right triangles only.',
    ],
    desmos:
      'Set it to degree mode before evaluating any trig function. Recognizing the special triangle is usually faster than typing.',
    timing:
      '50-95 seconds. Recognizing a triple or a special triangle can cut a 90-second question to 20.',
    mastery: [
      'Triples and special triangles surface on sight, before any theorem is written.',
      'You label opposite and adjacent from the named angle, and switching angles switches your labels automatically.',
      'From any one trig ratio you can produce the other two by sketching the triangle.',
    ],
  },
  {
    unit: 18,
    area: 'GEO',
    title: 'Circles: Equations, Arcs, and Sectors',
    overview:
      'Standard-form circle equations (including the completing-the-square version), plus arcs and sectors — which are one idea, not two. The radian conversion appears on most tests.',
    frequency: 'About 1-2 questions per section.',
    methods: [
      {
        name: 'Read a circle from standard form',
        steps: [
          '(x − h)² + (y − k)² = r² has centre (h, k) and radius r.',
          'The centre signs are opposite how they read: (x − 3) means h = 3.',
          'The right side is r², not r — take the square root.',
        ],
      },
      {
        name: 'Complete the square twice',
        steps: [
          'Group the x terms and the y terms, with constants on the right.',
          'Complete each square, adding the same amount to BOTH sides each time.',
          'Read the centre and radius off the resulting standard form.',
        ],
      },
      {
        name: 'Arc and sector as one fraction',
        steps: [
          'Compute the fraction: central angle ÷ 360.',
          'Multiply it by the circumference for an arc length, or by the area for a sector area.',
          'In radians the arc length shortcut is s = rθ.',
        ],
      },
    ],
    examples: [
      {
        q: 'x² + y² − 6x + 4y = 12 is a circle. Find its radius.',
        steps: [
          'Group: (x² − 6x) + (y² + 4y) = 12.',
          'Complete both squares, adding 9 and 4 to each side: (x − 3)² + (y + 2)² = 25.',
          'r² = 25, so r = 5 and the centre is (3, −2).',
        ],
        answer: 'r = 5',
      },
      {
        q: 'In a circle of radius 9, an arc has length 6π. Find the central angle in degrees.',
        steps: [
          'The circumference is 2π(9) = 18π.',
          'The arc is 6π/18π = 1/3 of the circle.',
          '⅓ × 360° = 120°.',
        ],
        answer: '120°',
      },
      {
        q: 'Is the point (4, 6) on the circle (x − 1)² + (y − 2)² = 25?',
        steps: [
          'Substitute the point: (4 − 1)² + (6 − 2)² = 9 + 16 = 25.',
          'That equals the right side exactly, so the point is ON the circle.',
          'Less than 25 would mean inside; more would mean outside — one substitution answers all three.',
        ],
        answer: 'Yes — on the circle',
      },
      {
        q: 'A diameter has endpoints (−2, 3) and (6, 3). Find the circle\'s center and radius.',
        steps: [
          'The center is the midpoint: ((−2 + 6)/2, 3) = (2, 3).',
          'The diameter\'s length is 8, so the radius is 4.',
          'Equation, if wanted: (x − 2)² + (y − 3)² = 16.',
        ],
        answer: 'Center (2, 3), radius 4',
      },
    ],
    mustKnow: [
      'π radians = 180°. Multiply by π/180 or 180/π, whichever cancels the unit you are leaving.',
      'Arc length s = rθ works only when θ is in radians.',
      'The centre signs flip; the right side is the radius squared.',
      'The center is the midpoint of any diameter, and the radius is half the diameter\'s length — the distance and midpoint formulas in disguise.',
    ],
    traps: [
      'Answering 25 for the radius when the equation shows r² = 25.',
      'Getting the centre signs backwards.',
      'Completing the square without adding the same amount to the right side — twice, once per variable.',
      'Substituting the diameter into r² — halve it first.',
      'Reading the constant of an EXPANDED circle equation as r² before completing the square; the true r² appears only in standard form.',
    ],
    desmos:
      'Type the circle equation in either form and Desmos draws it, letting you read the centre and radius visually. A genuine shortcut on completing-the-square questions.',
    timing:
      '45-100 seconds. Reading standard form is 30 seconds; completing the square is the most expensive question in this unit.',
    mastery: [
      'You read center and radius from standard form instantly, sign flips and the square root included.',
      'Completing the square twice is a clean routine, adding to both sides both times.',
      'Arc and sector are one fraction to you — angle over 360 — times circumference or area as asked, and s = rθ when the angle is in radians.',
    ],
  },
];

const byUnit = new Map(SAT_PLAYBOOKS.map((p) => [p.unit, p]));

export function getPlaybook(unit: number): SatPlaybook | null {
  return byUnit.get(unit) ?? null;
}
