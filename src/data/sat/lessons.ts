import type { Lesson } from '../lessons';

// SAT Math, Units 1-18: the teach-first lesson a student sees before the drill.
// The unit playbook (playbooks.ts) is the briefing for a student who already
// knows the topic; this is the lesson for one who does not yet.

export const SAT_LESSONS: Lesson[] = [
  // ---------------- SAT Unit 1 — Linear equations in one variable ----------------
  {
    domain: 'SAT', unit: 1, title: 'Linear equations in one variable',
    objective: 'Solve a linear equation, and tell when it has one, none, or infinitely many solutions.',
    concept: [
      'An equation is a BALANCE: whatever you do to one side, do to the other, and it stays true.',
      'UNDO in reverse order: clear parentheses and fractions, gather x on one side, then divide by its coefficient.',
      'Simplify both sides to ax + b = cx + d. Different coefficients (a ≠ c) give EXACTLY ONE solution.',
      'Same coefficient, different constants gives NO SOLUTION. Same coefficient and same constant gives INFINITELY MANY.',
      'PRO MOVE — when the choices are numbers, BACKSOLVE: plug a choice in instead of solving forward. It is immune to sign slips.',
    ],
    examples: [
      { q: 'Solve 3x + 7 = 22.', steps: ['Subtract 7 from both sides: 3x = 15.', 'Divide both sides by 3: x = 5.', 'Check: 3(5) + 7 = 22. ✓'], answer: 'x = 5' },
      { q: 'Solve 4(x − 2) = 2x + 10.', steps: ['Distribute: 4x − 8 = 2x + 10.', 'Subtract 2x: 2x − 8 = 10.', 'Add 8, then divide by 2: x = 9.'], answer: 'x = 9' },
      { q: 'Solve x/3 + 2 = x/2.', steps: ['Multiply every term by 6 to clear fractions: 2x + 12 = 3x.', 'Subtract 2x: 12 = x.'], answer: 'x = 12' },
      { q: 'How many solutions does 2(3x + 1) = 6x + 5 have?', steps: ['Left side: 6x + 2.', 'Both sides have 6x, but the constants 2 and 5 differ.', 'No value of x can make 2 equal 5.'], answer: 'No solution' },
      { q: 'In 5x + k = 5x + 8, what value of k gives infinitely many solutions?', steps: ['The x-coefficients already match (5 and 5).', 'Infinitely many needs the constants to match too.', 'So k = 8.'], answer: 'k = 8' },
      { q: 'Solve −3x + 4 = 19.', steps: ['Subtract 4: −3x = 15.', 'Divide by −3: x = −5.', 'Check: −3(−5) + 4 = 19. ✓'], answer: 'x = −5' },
    ],
    practice: [
      { q: 'Solve 7x − 5 = 30. What is x?', answers: ['5', 'x = 5', 'x=5'], steps: ['Add 5: 7x = 35.', 'Divide by 7: x = 5.'] },
      { q: 'Solve 3(x + 4) = x + 20. What is x?', answers: ['4', 'x = 4', 'x=4'], steps: ['Distribute: 3x + 12 = x + 20.', 'Subtract x and 12: 2x = 8.', 'x = 4.'] },
      { q: 'In ax + 3 = 4x + 3, what value of a gives infinitely many solutions?', answers: ['4', 'a = 4', 'a=4'], steps: ['The constants already match (3 and 3).', 'The coefficients must match too, so a = 4.'] },
      { q: 'Solve 2x + 9 = −1. What is x?', answers: ['-5', 'x = -5', 'x=-5'], steps: ['Subtract 9: 2x = −10.', 'Divide by 2: x = −5.'] },
    ],
    watchOut: 'When you distribute a minus, it reaches EVERY term: −2(x − 3) is −2x + 6, not −2x − 6.',
  },

  // ---------------- SAT Unit 2 — Linear functions and rate of change ----------------
  {
    domain: 'SAT', unit: 2, title: 'Linear functions and rate of change',
    objective: 'Read the slope and intercept of a linear function as real quantities with units.',
    concept: [
      'A linear function has a CONSTANT RATE: every step of 1 in x changes y by the same amount, the slope m.',
      'SLOPE = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁). Its unit is "y-units per x-unit".',
      'In f(x) = mx + b, the INTERCEPT b is the value when x = 0 — the starting amount.',
      'In a word problem, m is "per" something (dollars per hour) and b is the one-time or starting part (a flat fee).',
      'PRO MOVE — to interpret a number in a model, ask "what does it multiply?" Whatever multiplies x is a rate; whatever stands alone is a start.',
    ],
    examples: [
      { q: 'Find the slope through (2, 5) and (6, 17).', steps: ['Rise: 17 − 5 = 12.', 'Run: 6 − 2 = 4.', 'Slope = 12 ÷ 4 = 3.'], answer: '3' },
      { q: 'A plumber charges C(h) = 65h + 40. What does 65 mean?', steps: ['65 multiplies h, the hours.', 'So it is a rate: dollars per hour.', 'The plumber charges $65 for each hour of work.'], answer: '$65 per hour' },
      { q: 'In C(h) = 65h + 40, what does 40 mean?', steps: ['40 stands alone — it is the value when h = 0.', 'That is a one-time charge before any work.', 'It is a $40 call-out fee.'], answer: '$40 flat fee' },
      { q: 'f is linear with f(0) = 3 and f(4) = 11. Write f(x).', steps: ['b = f(0) = 3.', 'Slope = (11 − 3) ÷ (4 − 0) = 2.', 'f(x) = 2x + 3.'], answer: 'f(x) = 2x + 3' },
      { q: 'A tank holds 500 L and drains at 20 L per minute. After how many minutes is it empty?', steps: ['Model: V(t) = 500 − 20t.', 'Empty means V = 0: 500 − 20t = 0.', 't = 25 minutes.'], answer: '25' },
      { q: 'Find the slope through (−1, 4) and (3, −8).', steps: ['Rise: −8 − 4 = −12.', 'Run: 3 − (−1) = 4.', 'Slope = −12 ÷ 4 = −3.'], answer: '−3' },
    ],
    practice: [
      { q: 'What is the slope through (1, 2) and (5, 14)?', answers: ['3'], steps: ['Rise 14 − 2 = 12, run 5 − 1 = 4.', '12 ÷ 4 = 3.'] },
      { q: 'A gym charges M(n) = 30n + 50 for n months. What is the one-time sign-up fee in dollars?', answers: ['50', '$50'], steps: ['The standalone number is the starting charge.', 'The fee is $50.'] },
      { q: 'f is linear, f(0) = −2, and the slope is 5. What is f(3)?', answers: ['13'], steps: ['f(x) = 5x − 2.', 'f(3) = 15 − 2 = 13.'] },
      { q: 'A candle is 30 cm tall and burns 1.5 cm per hour. After how many hours is it 18 cm tall?', answers: ['8'], steps: ['30 − 1.5t = 18.', '1.5t = 12, so t = 8.'] },
    ],
    watchOut: 'Keep the subtraction in the same order top and bottom: (y₂ − y₁) ÷ (x₂ − x₁). Mixing the order flips the sign.',
  },

  // ---------------- SAT Unit 3 — Linear equations in two variables ----------------
  {
    domain: 'SAT', unit: 3, title: 'Linear equations in two variables',
    objective: 'Move between the forms of a line and build a line from a description.',
    concept: [
      'SLOPE-INTERCEPT y = mx + b hands you the slope and the y-intercept directly.',
      'STANDARD Ax + By = C: the slope is −A/B. It is the natural form for "x of one thing plus y of another" totals.',
      'POINT-SLOPE y − y₁ = m(x − x₁) builds a line from any point and a slope.',
      'PARALLEL lines share a slope. PERPENDICULAR slopes multiply to −1: flip the fraction and change the sign.',
      'PRO MOVE — to find an intercept of Ax + By = C, cover one variable: set x = 0 to get the y-intercept, y = 0 for the x-intercept.',
    ],
    examples: [
      { q: 'What is the slope of 3x + 2y = 12?', steps: ['Solve for y: 2y = −3x + 12.', 'y = −1.5x + 6.', 'Slope = −3/2.'], answer: '−3/2' },
      { q: 'Write the line through (2, 7) with slope 4.', steps: ['Point-slope: y − 7 = 4(x − 2).', 'Distribute: y − 7 = 4x − 8.', 'y = 4x − 1.'], answer: 'y = 4x − 1' },
      { q: 'Find both intercepts of 4x + 5y = 20.', steps: ['x = 0: 5y = 20, y = 4 → (0, 4).', 'y = 0: 4x = 20, x = 5 → (5, 0).'], answer: '(0, 4) and (5, 0)' },
      { q: 'A line is perpendicular to y = (2/3)x + 1 and passes through (0, −4). Its equation?', steps: ['Perpendicular slope: flip 2/3 to 3/2, change sign → −3/2.', 'It passes through (0, −4), so b = −4.', 'y = −(3/2)x − 4.'], answer: 'y = −(3/2)x − 4' },
      { q: 'Adult tickets cost $12 and child tickets $8. Total sales were $480. Write the equation.', steps: ['a adult tickets bring 12a dollars.', 'c child tickets bring 8c dollars.', '12a + 8c = 480.'], answer: '12a + 8c = 480' },
      { q: 'Find the line through (1, 3) and (3, −1).', steps: ['Slope = (−1 − 3) ÷ (3 − 1) = −2.', 'y − 3 = −2(x − 1) → y = −2x + 5.'], answer: 'y = −2x + 5' },
    ],
    practice: [
      { q: 'What is the slope of 6x + 3y = 9?', answers: ['-2'], steps: ['3y = −6x + 9.', 'y = −2x + 3, so the slope is −2.'] },
      { q: 'What is the y-intercept of 2x + 4y = 16?', answers: ['4'], steps: ['Set x = 0: 4y = 16.', 'y = 4.'] },
      { q: 'A line is parallel to y = 5x − 2 and passes through (0, 7). What is its slope?', answers: ['5'], steps: ['Parallel lines share a slope.', 'The slope is 5.'] },
      { q: 'A line is perpendicular to y = −4x + 1. What is its slope?', answers: ['1/4', '0.25'], steps: ['Flip −4/1 to −1/4.', 'Change the sign: 1/4.'] },
    ],
    watchOut: 'The slope of Ax + By = C is −A/B, not A/B and not −B/A — solve for y if you are not sure.',
  },

  // ---------------- SAT Unit 4 — Systems of two linear equations ----------------
  {
    domain: 'SAT', unit: 4, title: 'Systems of two linear equations',
    objective: 'Solve a system by substitution or elimination, and count its solutions without solving.',
    concept: [
      'The SOLUTION of a system is the point that makes BOTH equations true — where the two lines cross.',
      'SUBSTITUTION: when one equation already says y = … or x = …, drop it into the other.',
      'ELIMINATION: scale the equations so one variable has opposite coefficients, then add to cancel it.',
      'COUNT SOLUTIONS by slope: different slopes cross once; same slope and different intercept never meet (no solution); the same line is infinitely many.',
      'PRO MOVE — if the question asks for x + y or 2x − y, add or subtract the equations directly. You may never need x and y separately.',
    ],
    examples: [
      { q: 'Solve y = 2x + 1 and 3x + y = 16.', steps: ['Substitute: 3x + (2x + 1) = 16.', '5x + 1 = 16, so x = 3.', 'y = 2(3) + 1 = 7.'], answer: '(3, 7)' },
      { q: 'Solve x + y = 10 and x − y = 4.', steps: ['Add the equations: 2x = 14, so x = 7.', 'Then 7 + y = 10, so y = 3.'], answer: '(7, 3)' },
      { q: 'Solve 2x + 3y = 12 and 4x − 3y = 6.', steps: ['The 3y and −3y are opposites — add.', '6x = 18, so x = 3.', '2(3) + 3y = 12 → y = 2.'], answer: '(3, 2)' },
      { q: 'How many solutions: y = 3x + 2 and 6x − 2y = 5?', steps: ['Second: −2y = −6x + 5 → y = 3x − 2.5.', 'Same slope 3, different intercepts.', 'Parallel lines never meet.'], answer: 'No solution' },
      { q: 'If 3x + 2y = 17 and x + 2y = 9, what is x?', steps: ['Subtract the second from the first.', '2x = 8.', 'x = 4.'], answer: '4' },
      { q: 'Pens cost $2 and notebooks $5. Ana buys 9 items for $30. How many notebooks?', steps: ['p + n = 9 and 2p + 5n = 30.', 'p = 9 − n: 2(9 − n) + 5n = 30.', '18 + 3n = 30, so n = 4.'], answer: '4' },
    ],
    practice: [
      { q: 'Solve y = x + 2 and 2x + y = 11. What is x?', answers: ['3', 'x = 3'], steps: ['2x + x + 2 = 11.', '3x = 9, x = 3.'] },
      { q: 'If x + y = 12 and x − y = 2, what is y?', answers: ['5', 'y = 5'], steps: ['Add: 2x = 14, x = 7.', 'y = 12 − 7 = 5.'] },
      { q: 'If 2x + y = 11 and x + 2y = 7, what is x + y?', answers: ['6'], steps: ['Add the equations: 3x + 3y = 18.', 'Divide by 3: x + y = 6.'] },
      { q: 'For what k does 2x + ky = 5 and 4x + 6y = 9 have no solution?', answers: ['3', 'k = 3'], steps: ['Double the first: 4x + 2ky = 10.', 'No solution needs matching x and y parts with different constants.', '2k = 6, so k = 3.'] },
    ],
    watchOut: 'When you subtract one equation from another, subtract EVERY term — including the constant on the right.',
  },

  // ---------------- SAT Unit 5 — Linear inequalities and systems ----------------
  {
    domain: 'SAT', unit: 5, title: 'Linear inequalities and systems',
    objective: 'Translate constraint language into inequalities, solve them, and test points.',
    concept: [
      'Solve an inequality like an equation, with ONE EXTRA RULE: multiply or divide by a negative and the sign FLIPS.',
      'TRANSLATE carefully: "at least" is ≥, "at most" / "no more than" is ≤, "more than" is >, "fewer than" is <.',
      'On a graph, y > mx + b shades ABOVE the line; y < mx + b shades BELOW. Strict inequalities draw a dashed line.',
      'A SYSTEM of inequalities is solved by the overlap — the region every inequality shades.',
      'PRO MOVE — to check whether a point is a solution, plug it into EVERY inequality. One failure rules it out.',
    ],
    examples: [
      { q: 'Solve 3x − 5 > 10.', steps: ['Add 5: 3x > 15.', 'Divide by positive 3 — no flip.', 'x > 5.'], answer: 'x > 5' },
      { q: 'Solve −2x + 4 ≤ 12.', steps: ['Subtract 4: −2x ≤ 8.', 'Divide by −2 and FLIP the sign.', 'x ≥ −4.'], answer: 'x ≥ −4' },
      { q: 'A van holds at most 1,200 lb. The driver weighs 180 lb; each box weighs 60 lb. Most boxes?', steps: ['180 + 60b ≤ 1200.', '60b ≤ 1020.', 'b ≤ 17, so at most 17 boxes.'], answer: '17' },
      { q: 'Is (2, 3) a solution of y > x and y < 2x − 2?', steps: ['First: 3 > 2 ✓.', 'Second: 3 < 2(2) − 2 = 2? No.', 'It fails one, so it is not a solution.'], answer: 'No' },
      { q: 'Which side does y ≥ −x + 3 shade?', steps: ['y is greater-than-or-equal.', 'Greater y means higher on the graph.', 'Shade above a solid line.'], answer: 'Above, solid line' },
      { q: 'Tickets are $15. You have $100 and must keep $10 for the bus. Most tickets?', steps: ['15t + 10 ≤ 100.', '15t ≤ 90.', 't ≤ 6.'], answer: '6' },
    ],
    practice: [
      { q: 'Solve 4x + 1 < 21. What is the largest whole number x can be?', answers: ['4'], steps: ['4x < 20, so x < 5.', 'The largest whole number below 5 is 4.'] },
      { q: 'Solve −3x > 12. x is less than what number?', answers: ['-4'], steps: ['Divide by −3 and flip.', 'x < −4.'] },
      { q: 'A phone plan is $20 plus $0.10 per text, and you spend at most $35. What is the most texts?', answers: ['150'], steps: ['20 + 0.10t ≤ 35.', '0.10t ≤ 15, t ≤ 150.'] },
      { q: 'Is (0, 0) a solution of y < 2x + 1? Answer yes or no.', answers: ['yes', 'y'], steps: ['0 < 2(0) + 1 = 1.', 'True, so yes.'] },
    ],
    watchOut: 'Dividing by a negative flips the sign — the single most common inequality mistake on the test.',
  },

  // ---------------- SAT Unit 6 — Equivalent expressions and exponents ----------------
  {
    domain: 'SAT', unit: 6, title: 'Equivalent expressions and exponents',
    objective: 'Rewrite expressions with exponent rules, factoring, and radicals.',
    concept: [
      'Same base: MULTIPLY → ADD exponents (x³ · x⁴ = x⁷). DIVIDE → SUBTRACT (x⁶ ÷ x² = x⁴). POWER of a power → MULTIPLY ((x²)³ = x⁶).',
      'A NEGATIVE exponent means reciprocal: x⁻² = 1/x². A zero exponent gives 1.',
      'A FRACTIONAL exponent is a root: x^(1/2) = √x and x^(3/2) = (√x)³.',
      'FACTORING undoes distributing: pull out the greatest common factor first, then look for patterns like a² − b² = (a − b)(a + b).',
      'PRO MOVE — to check two expressions are equivalent, plug in a test number like x = 2 into both. Different values means not equivalent.',
    ],
    examples: [
      { q: 'Simplify (2x³)(5x⁴).', steps: ['Multiply the numbers: 2 · 5 = 10.', 'Add the exponents: 3 + 4 = 7.', '10x⁷.'], answer: '10x⁷' },
      { q: 'Simplify (x⁴)³ ÷ x⁵.', steps: ['Power of a power: x¹².', 'Divide, subtract exponents: 12 − 5 = 7.', 'x⁷.'], answer: 'x⁷' },
      { q: 'Write x^(3/2) with a radical.', steps: ['Denominator 2 is the root: square root.', 'Numerator 3 is the power.', 'x^(3/2) = √(x³) = x√x.'], answer: '√(x³)' },
      { q: 'Factor 6x² + 9x.', steps: ['GCF of 6x² and 9x is 3x.', '6x² ÷ 3x = 2x; 9x ÷ 3x = 3.', '3x(2x + 3).'], answer: '3x(2x + 3)' },
      { q: 'Factor x² − 49.', steps: ['A difference of squares: x² − 7².', 'a² − b² = (a − b)(a + b).', '(x − 7)(x + 7).'], answer: '(x − 7)(x + 7)' },
      { q: 'Simplify 2⁻³.', steps: ['A negative exponent is a reciprocal.', '2⁻³ = 1 ÷ 2³.', '= 1/8.'], answer: '1/8' },
    ],
    practice: [
      { q: 'Simplify x⁵ · x³ as x to what power?', answers: ['8', 'x^8'], steps: ['Same base, multiply: add exponents.', '5 + 3 = 8.'] },
      { q: 'What is 16^(1/2)?', answers: ['4'], steps: ['A 1/2 power is a square root.', '√16 = 4.'] },
      { q: 'What is 5⁻²? Give a fraction.', answers: ['1/25', '0.04'], steps: ['Reciprocal of 5².', '1/25.'] },
      { q: 'Factor x² − 25 as (x − a)(x + a). What is a?', answers: ['5'], steps: ['x² − 25 = x² − 5².', 'a = 5.'] },
    ],
    watchOut: '(x + 3)² is x² + 6x + 9, NOT x² + 9 — squaring a sum makes a middle term.',
  },

  // ---------------- SAT Unit 7 — Quadratic equations and the discriminant ----------------
  {
    domain: 'SAT', unit: 7, title: 'Quadratic equations and the discriminant',
    objective: 'Solve quadratics by factoring or formula, and count real solutions with the discriminant.',
    concept: [
      'Set the quadratic EQUAL TO ZERO first: ax² + bx + c = 0.',
      'FACTOR when you can: find two numbers that multiply to c and add to b. Then each factor = 0 (zero-product rule).',
      'The QUADRATIC FORMULA always works: x = (−b ± √(b² − 4ac)) ÷ 2a.',
      'The DISCRIMINANT b² − 4ac counts real solutions: positive → two, zero → one, negative → none.',
      'PRO MOVE — the sum of the solutions is −b/a and the product is c/a. A "sum of solutions" question needs no solving at all.',
    ],
    examples: [
      { q: 'Solve x² − 5x + 6 = 0.', steps: ['Two numbers multiplying to 6 and adding to −5: −2 and −3.', '(x − 2)(x − 3) = 0.', 'x = 2 or x = 3.'], answer: 'x = 2 or 3' },
      { q: 'Solve x² + 2x − 15 = 0.', steps: ['Multiply to −15, add to 2: 5 and −3.', '(x + 5)(x − 3) = 0.', 'x = −5 or x = 3.'], answer: 'x = −5 or 3' },
      { q: 'Solve x² − 4x − 1 = 0 with the formula.', steps: ['a = 1, b = −4, c = −1.', 'b² − 4ac = 16 + 4 = 20.', 'x = (4 ± √20) ÷ 2 = 2 ± √5.'], answer: '2 ± √5' },
      { q: 'How many real solutions does 2x² + 3x + 5 = 0 have?', steps: ['Discriminant: 3² − 4(2)(5) = 9 − 40.', '= −31, which is negative.', 'No real solutions.'], answer: '0' },
      { q: 'For what c does x² + 6x + c = 0 have exactly one solution?', steps: ['One solution needs b² − 4ac = 0.', '36 − 4c = 0.', 'c = 9.'], answer: 'c = 9' },
      { q: 'What is the sum of the solutions of 3x² − 12x + 7 = 0?', steps: ['Sum = −b/a.', '= −(−12)/3.', '= 4.'], answer: '4' },
    ],
    practice: [
      { q: 'Solve x² − 7x + 12 = 0. What is the larger solution?', answers: ['4'], steps: ['(x − 3)(x − 4) = 0.', 'x = 3 or 4; the larger is 4.'] },
      { q: 'Solve x² = 49. What is the negative solution?', answers: ['-7'], steps: ['x = ±7.', 'The negative one is −7.'] },
      { q: 'What is the discriminant of x² + 4x + 1?', answers: ['12'], steps: ['b² − 4ac = 16 − 4.', '= 12.'] },
      { q: 'What is the product of the solutions of 2x² + 5x − 8 = 0?', answers: ['-4'], steps: ['Product = c/a.', '−8 ÷ 2 = −4.'] },
    ],
    watchOut: 'x² = 16 has TWO solutions, 4 and −4. Taking a square root means ±.',
  },

  // ---------------- SAT Unit 8 — Quadratic graphs ----------------
  {
    domain: 'SAT', unit: 8, title: 'Quadratic graphs: forms and features',
    objective: 'Read the vertex, zeros, and y-intercept of a parabola straight from the right form.',
    concept: [
      'STANDARD form y = ax² + bx + c shows the y-INTERCEPT: it is c.',
      'VERTEX form y = a(x − h)² + k shows the VERTEX (h, k) — watch the sign on h.',
      'FACTORED form y = a(x − r)(x − s) shows the ZEROS: x = r and x = s.',
      'The sign of a sets the direction: a > 0 opens UP (a minimum), a < 0 opens DOWN (a maximum).',
      'PRO MOVE — the vertex sits halfway between the zeros, at x = −b/2a. Find x first, then plug in for y.',
    ],
    examples: [
      { q: 'What is the vertex of y = (x − 3)² + 5?', steps: ['Vertex form: a(x − h)² + k.', 'h = 3 (the sign flips), k = 5.', 'Vertex (3, 5).'], answer: '(3, 5)' },
      { q: 'What are the zeros of y = (x + 2)(x − 6)?', steps: ['Set each factor to zero.', 'x + 2 = 0 → x = −2.', 'x − 6 = 0 → x = 6.'], answer: 'x = −2 and 6' },
      { q: 'Find the vertex of y = x² − 8x + 10.', steps: ['x = −b/2a = 8/2 = 4.', 'y = 16 − 32 + 10 = −6.', 'Vertex (4, −6).'], answer: '(4, −6)' },
      { q: 'What is the y-intercept of y = 2x² − 3x + 7?', steps: ['Set x = 0.', 'Every x-term vanishes.', 'y = 7.'], answer: '7' },
      { q: 'A ball follows h(t) = −16t² + 64t. What is its greatest height?', steps: ['a < 0, so the vertex is a maximum.', 't = −64 ÷ (2 · −16) = 2.', 'h(2) = −64 + 128 = 64 feet.'], answer: '64' },
      { q: 'Write y = x² + 6x + 5 in vertex form.', steps: ['Complete the square: x² + 6x + 9 − 9 + 5.', '(x + 3)² − 4.', 'Vertex (−3, −4).'], answer: 'y = (x + 3)² − 4' },
    ],
    practice: [
      { q: 'What is the y-intercept of y = x² + 4x − 9?', answers: ['-9'], steps: ['Set x = 0.', 'y = −9.'] },
      { q: 'y = (x − 1)(x − 7). What x-value is the vertex at?', answers: ['4'], steps: ['Halfway between the zeros 1 and 7.', '(1 + 7) ÷ 2 = 4.'] },
      { q: 'What is the minimum value of y = (x + 5)² − 3?', answers: ['-3'], steps: ['Vertex (−5, −3), opens up.', 'Minimum y = −3.'] },
      { q: 'y = x² − 10x + 1. What is the x-coordinate of the vertex?', answers: ['5'], steps: ['x = −b/2a = 10/2.', '= 5.'] },
    ],
    watchOut: 'In y = (x − 3)² + 5 the vertex is at x = +3; in y = (x + 3)² + 5 it is at x = −3. The sign inside flips.',
  },

  // ---------------- SAT Unit 9 — Nonlinear systems, polynomials, rational equations ----------------
  {
    domain: 'SAT', unit: 9, title: 'Nonlinear systems, polynomials, and rational equations',
    objective: 'Find where a line meets a curve, use the Factor Theorem, and solve equations with x in a denominator.',
    concept: [
      'A LINE AND A PARABOLA can meet 0, 1, or 2 times. Set the two expressions equal and solve the quadratic.',
      'FACTOR THEOREM: if p(a) = 0, then (x − a) is a factor of p(x) — and a zero of the graph.',
      'REMAINDER THEOREM: dividing p(x) by (x − a) leaves remainder p(a).',
      'RATIONAL EQUATIONS: multiply every term by the common denominator to clear fractions — then CHECK for values that make a denominator zero.',
      'PRO MOVE — a factor (x − 3) means a zero at x = 3, and a zero at x = −2 means a factor (x + 2). Read one straight off the other.',
    ],
    examples: [
      { q: 'Where do y = x² and y = x + 6 meet?', steps: ['Set equal: x² = x + 6.', 'x² − x − 6 = 0 → (x − 3)(x + 2) = 0.', 'Points (3, 9) and (−2, 4).'], answer: '(3, 9) and (−2, 4)' },
      { q: 'p(x) = x³ − 4x² + x + 6. Is (x − 2) a factor?', steps: ['Test p(2) = 8 − 16 + 2 + 6.', '= 0.', 'Yes, (x − 2) is a factor.'], answer: 'Yes' },
      { q: 'What is the remainder when x² + 3x − 5 is divided by x − 2?', steps: ['Remainder = p(2).', '4 + 6 − 5.', '= 5.'], answer: '5' },
      { q: 'Solve 6/x = 3/(x − 2).', steps: ['Cross-multiply: 6(x − 2) = 3x.', '6x − 12 = 3x → 3x = 12.', 'x = 4 (not 0 or 2, so it is allowed).'], answer: 'x = 4' },
      { q: 'A polynomial has zeros −1, 2, 5. Name its factors.', steps: ['Zero at a means a factor (x − a).', '−1 gives (x + 1).', '(x + 1)(x − 2)(x − 5).'], answer: '(x + 1)(x − 2)(x − 5)' },
      { q: 'Solve x/(x − 3) = 3/(x − 3) + 2.', steps: ['Multiply by (x − 3): x = 3 + 2(x − 3).', 'x = 2x − 3, so x = 3.', 'x = 3 zeroes the denominator — no solution.'], answer: 'No solution' },
    ],
    practice: [
      { q: 'p(x) = x² − 9. What is p(3)?', answers: ['0'], steps: ['9 − 9 = 0.', 'So (x − 3) is a factor.'] },
      { q: 'What is the remainder when x² + 1 is divided by x − 3?', answers: ['10'], steps: ['p(3) = 9 + 1.', '= 10.'] },
      { q: 'Solve 8/x = 2. What is x?', answers: ['4'], steps: ['8 = 2x.', 'x = 4.'] },
      { q: 'y = x² and y = 4 meet at two points. What is the positive x-value?', answers: ['2'], steps: ['x² = 4.', 'x = ±2; positive is 2.'] },
    ],
    watchOut: 'An answer that makes a denominator zero is NOT a solution — always check it against the original equation.',
  },

  // ---------------- SAT Unit 10 — Exponential functions ----------------
  {
    domain: 'SAT', unit: 10, title: 'Exponential functions, growth, and decay',
    objective: 'Build and read a·bˣ models, including growth and decay by a percent.',
    concept: [
      'LINEAR grows by ADDING the same amount each step; EXPONENTIAL grows by MULTIPLYING by the same factor.',
      'In y = a · bˣ, a is the STARTING value and b is the GROWTH FACTOR per step.',
      'GROWTH by r%: b = 1 + r (5% up → 1.05). DECAY by r%: b = 1 − r (5% down → 0.95).',
      'b > 1 means growth; 0 < b < 1 means decay. The graph never touches zero.',
      'PRO MOVE — "doubles every 3 years" is a · 2^(t/3). The exponent counts HOW MANY doublings have happened.',
    ],
    examples: [
      { q: 'A town of 2,000 grows 3% a year. Write the model.', steps: ['Start a = 2000.', 'Growth factor b = 1 + 0.03 = 1.03.', 'P(t) = 2000(1.03)ᵗ.'], answer: 'P = 2000(1.03)ᵗ' },
      { q: 'A $900 phone loses 20% of its value a year. Value after 2 years?', steps: ['Decay factor 1 − 0.20 = 0.8.', '900 · 0.8² = 900 · 0.64.', '= $576.'], answer: '$576' },
      { q: 'Bacteria double every 4 hours from 100. How many after 12 hours?', steps: ['12 ÷ 4 = 3 doublings.', '100 · 2³.', '= 800.'], answer: '800' },
      { q: 'In f(t) = 50(0.9)ᵗ, what is the percent change per step?', steps: ['b = 0.9 is below 1: decay.', '1 − 0.9 = 0.1.', 'A 10% decrease each step.'], answer: '10% decrease' },
      { q: 'Is the table 3, 6, 12, 24 linear or exponential?', steps: ['Differences: 3, 6, 12 — not constant.', 'Ratios: 2, 2, 2 — constant.', 'Exponential, factor 2.'], answer: 'Exponential' },
      { q: 'A $1,000 deposit earns 6% yearly. Balance after 2 years?', steps: ['Factor 1.06.', '1000 · 1.06² = 1000 · 1.1236.', '= $1,123.60.'], answer: '$1,123.60' },
    ],
    practice: [
      { q: 'y = 400(1.25)ˣ. What is the starting value?', answers: ['400'], steps: ['a is the value at x = 0.', 'a = 400.'] },
      { q: 'A population grows 8% a year. What is the growth factor b?', answers: ['1.08'], steps: ['b = 1 + 0.08.', '= 1.08.'] },
      { q: 'A culture of 50 triples every day. How many after 2 days?', answers: ['450'], steps: ['50 · 3².', '= 450.'] },
      { q: 'y = 200(0.75)ˣ. By what percent does y decrease each step?', answers: ['25', '25%'], steps: ['1 − 0.75 = 0.25.', 'A 25% decrease.'] },
    ],
    watchOut: 'A 20% decrease uses 0.8, not 0.2. The factor is what REMAINS, not what was lost.',
  },

  // ---------------- SAT Unit 11 — Ratios, rates, proportions, units ----------------
  {
    domain: 'SAT', unit: 11, title: 'Ratios, rates, proportions, and units',
    objective: 'Set up proportions and chain unit conversions without losing track of the units.',
    concept: [
      'A RATIO compares amounts; a RATE compares different units (miles per hour). A UNIT RATE is per one.',
      'A PROPORTION sets two ratios equal. Keep the same units in the same positions, then cross-multiply.',
      'CONVERT with fractions equal to 1: multiply by (12 in / 1 ft) so the unit you do not want cancels.',
      'A ratio a : b splits a total into a + b PARTS. Find one part first.',
      'PRO MOVE — write the units on every number. If they do not cancel to the unit you want, the setup is wrong.',
    ],
    examples: [
      { q: 'A car goes 210 miles on 6 gallons. How far on 10 gallons?', steps: ['Unit rate: 210 ÷ 6 = 35 miles per gallon.', '35 · 10.', '= 350 miles.'], answer: '350 miles' },
      { q: 'Solve 3/8 = x/56.', steps: ['Cross-multiply: 8x = 168.', 'x = 21.'], answer: '21' },
      { q: 'Convert 90 km/h to meters per second.', steps: ['90 km/h · (1000 m / 1 km).', '· (1 h / 3600 s).', '90,000 ÷ 3600 = 25 m/s.'], answer: '25 m/s' },
      { q: 'A class has boys to girls 4 : 5 and 36 students. How many girls?', steps: ['4 + 5 = 9 parts.', 'One part: 36 ÷ 9 = 4.', 'Girls: 5 · 4 = 20.'], answer: '20' },
      { q: 'A map uses 1 inch : 25 miles. Two towns are 3.2 inches apart. Real distance?', steps: ['3.2 · 25.', '= 80 miles.'], answer: '80 miles' },
      { q: 'How many seconds are in 2.5 hours?', steps: ['2.5 h · 60 min/h = 150 min.', '150 min · 60 s/min.', '= 9,000 s.'], answer: '9,000' },
    ],
    practice: [
      { q: '5 pounds of apples cost $8. What do 15 pounds cost, in dollars?', answers: ['24', '$24'], steps: ['15 is 3 × 5.', '3 × $8 = $24.'] },
      { q: 'Solve 4/7 = x/35. What is x?', answers: ['20'], steps: ['7x = 140.', 'x = 20.'] },
      { q: 'Red to blue marbles is 2 : 3, with 40 marbles in all. How many blue?', answers: ['24'], steps: ['5 parts; one part is 8.', 'Blue: 3 × 8 = 24.'] },
      { q: 'How many inches are in 3.5 feet?', answers: ['42'], steps: ['3.5 × 12.', '= 42.'] },
    ],
    watchOut: 'In a proportion, the SAME unit goes in the same spot on both sides — miles over gallons equals miles over gallons.',
  },

  // ---------------- SAT Unit 12 — Percentages ----------------
  {
    domain: 'SAT', unit: 12, title: 'Percentages, percent change, and interest',
    objective: 'Find percents of, percent change, reverse percents, and chained changes.',
    concept: [
      'PERCENT means per hundred: 35% = 0.35. "Percent OF" means multiply.',
      'A percent change is a MULTIPLIER: up 15% → × 1.15, down 15% → × 0.85.',
      'PERCENT CHANGE = (new − old) ÷ old. Always divide by the ORIGINAL.',
      'SUCCESSIVE changes multiply: up 10% then down 10% is × 1.1 × 0.9 = 0.99 — a 1% loss, not zero.',
      'PRO MOVE — for a reverse percent ("after a 20% discount it costs $64"), DIVIDE by the multiplier: 64 ÷ 0.8 = 80.',
    ],
    examples: [
      { q: 'What is 35% of 240?', steps: ['0.35 · 240.', '= 84.'], answer: '84' },
      { q: 'A price rises from $50 to $62. Percent increase?', steps: ['Change: 62 − 50 = 12.', '12 ÷ 50 = 0.24.', '24% increase.'], answer: '24%' },
      { q: 'After a 25% discount a jacket costs $90. Original price?', steps: ['A 25% discount leaves 0.75 of the price.', '0.75p = 90.', 'p = 120.'], answer: '$120' },
      { q: 'A stock rises 20% then falls 20%. Net change?', steps: ['1.2 · 0.8 = 0.96.', 'It keeps 96% of its value.', 'A 4% loss.'], answer: '4% decrease' },
      { q: '18 is what percent of 72?', steps: ['18 ÷ 72 = 0.25.', '= 25%.'], answer: '25%' },
      { q: 'A $60 meal with 8% tax and then a 20% tip on the taxed total?', steps: ['60 · 1.08 = 64.80.', '64.80 · 1.20.', '= $77.76.'], answer: '$77.76' },
    ],
    practice: [
      { q: 'What is 15% of 80?', answers: ['12'], steps: ['0.15 × 80.', '= 12.'] },
      { q: 'A price falls from $80 to $60. By what percent did it fall?', answers: ['25', '25%'], steps: ['Change 20.', '20 ÷ 80 = 25%.'] },
      { q: 'After a 10% raise, a salary is $55,000. What was it before, in dollars?', answers: ['50000', '$50,000', '50,000'], steps: ['1.1s = 55000.', 's = 50,000.'] },
      { q: 'What single multiplier is a 30% increase?', answers: ['1.3', '1.30'], steps: ['1 + 0.30.', '= 1.3.'] },
    ],
    watchOut: 'Percent change divides by the ORIGINAL value. From 50 to 62 is 12 ÷ 50, not 12 ÷ 62.',
  },

  // ---------------- SAT Unit 13 — One-variable data ----------------
  {
    domain: 'SAT', unit: 13, title: 'One-variable data: center, spread, and shape',
    objective: 'Compare mean and median, judge spread by eye, and predict what an outlier does.',
    concept: [
      'MEAN = sum ÷ count. MEDIAN = the middle value once SORTED (average the two middles if the count is even).',
      'An OUTLIER drags the mean toward it; the median barely moves. That is why median describes skewed data better.',
      'SKEW: a long tail to the right pulls mean ABOVE median. A tail to the left pulls mean below.',
      'STANDARD DEVIATION measures typical distance from the mean. Tightly bunched data → small; spread out → large.',
      'PRO MOVE — for "the new mean" questions, work with SUMS: new mean = (old sum + new value) ÷ new count.',
    ],
    examples: [
      { q: 'Find the mean and median of 3, 7, 8, 10, 22.', steps: ['Sum = 50, count 5 → mean 10.', 'Sorted, the middle value is 8.', 'Mean 10, median 8.'], answer: 'Mean 10, median 8' },
      { q: 'The 22 above is changed to 12. What happens to mean and median?', steps: ['The sum drops by 10 → mean 8.', 'The middle value is still 8.', 'Mean falls; median stays.'], answer: 'Mean 8, median 8' },
      { q: 'Four tests average 85. What must the fifth score be to average 88?', steps: ['Needed sum: 5 · 88 = 440.', 'Current sum: 4 · 85 = 340.', '440 − 340 = 100.'], answer: '100' },
      { q: 'Set A: 48, 50, 52. Set B: 20, 50, 80. Which has the larger standard deviation?', steps: ['Both have mean 50.', 'B sits much farther from 50.', 'B has the larger SD.'], answer: 'Set B' },
      { q: 'Median of 4, 9, 1, 7, 12, 6?', steps: ['Sort: 1, 4, 6, 7, 9, 12.', 'Two middles: 6 and 7.', 'Median = 6.5.'], answer: '6.5' },
      { q: 'Household incomes are right-skewed. Which is larger, mean or median?', steps: ['A right tail holds a few very large values.', 'They pull the mean up.', 'Mean > median.'], answer: 'Mean' },
    ],
    practice: [
      { q: 'What is the mean of 6, 8, 10, 16?', answers: ['10'], steps: ['Sum 40, count 4.', '40 ÷ 4 = 10.'] },
      { q: 'What is the median of 9, 2, 5, 11, 3?', answers: ['5'], steps: ['Sort: 2, 3, 5, 9, 11.', 'Middle is 5.'] },
      { q: 'Three numbers average 12. A fourth, 20, is added. What is the new mean?', answers: ['14'], steps: ['Old sum 36; new sum 56.', '56 ÷ 4 = 14.'] },
      { q: 'What is the range of 15, 4, 22, 9?', answers: ['18'], steps: ['Max 22, min 4.', '22 − 4 = 18.'] },
    ],
    watchOut: 'SORT before finding a median. The middle of an unsorted list is just a random value.',
  },

  // ---------------- SAT Unit 14 — Two-variable data, probability, inference ----------------
  {
    domain: 'SAT', unit: 14, title: 'Two-variable data, probability, and inference',
    objective: 'Read scatterplots and two-way tables, find probabilities, and judge what a sample can justify.',
    concept: [
      'A LINE OF BEST FIT predicts: plug in x to estimate y. Its SLOPE is the predicted change in y per 1 unit of x.',
      'PROBABILITY = favorable ÷ total. In a two-way table, the question\'s wording picks the TOTAL (the row, the column, or everything).',
      'CONDITIONAL: "given that they are juniors" means divide by the number of juniors only.',
      'A RANDOM sample lets you generalize to the population it was drawn from — and ONLY that population. Cause needs random ASSIGNMENT.',
      'PRO MOVE — a margin of error gives a range: an estimate of 40% ± 3% means the true value is plausibly 37% to 43%.',
    ],
    examples: [
      { q: 'Best fit y = 2.5x + 10. Predict y at x = 8.', steps: ['2.5 · 8 = 20.', '20 + 10.', '= 30.'], answer: '30' },
      { q: 'In the fit y = 2.5x + 10, what does 2.5 mean?', steps: ['It is the slope.', 'Each 1-unit increase in x predicts…', '…a 2.5-unit increase in y.'], answer: '+2.5 y per x' },
      { q: '60 of 200 students are juniors; 24 juniors play a sport. P(sport | junior)?', steps: ['Given junior: total is 60.', '24 ÷ 60.', '= 0.4.'], answer: '0.4' },
      { q: 'A bag has 5 red and 3 blue. P(red)?', steps: ['Total 8.', 'Red 5.', '5/8.'], answer: '5/8' },
      { q: 'A random survey of a school\'s 9th graders found most like pizza. Can we say most students in the SCHOOL do?', steps: ['The sample came only from 9th graders.', 'It generalizes to 9th graders only.', 'No.'], answer: 'No' },
      { q: 'A poll estimates 52% ± 4%. What range is plausible?', steps: ['52 − 4 = 48.', '52 + 4 = 56.', '48% to 56%.'], answer: '48% to 56%' },
    ],
    practice: [
      { q: 'Best fit y = 3x − 4. Predict y when x = 10.', answers: ['26'], steps: ['30 − 4.', '= 26.'] },
      { q: 'A spinner has 4 equal parts, 1 of them red. P(red)? Give a decimal.', answers: ['0.25', '1/4'], steps: ['1 ÷ 4.', '= 0.25.'] },
      { q: 'Of 80 seniors, 20 walk to school. P(walk | senior)? Give a decimal.', answers: ['0.25', '1/4'], steps: ['Given senior: total 80.', '20 ÷ 80 = 0.25.'] },
      { q: 'An estimate is 30% with margin of error 5%. What is the largest plausible value, in percent?', answers: ['35', '35%'], steps: ['30 + 5.', '= 35%.'] },
    ],
    watchOut: 'Read the "given" carefully — it sets the denominator. P(junior | sport) and P(sport | junior) use different totals.',
  },

  // ---------------- SAT Unit 15 — Lines, angles, triangles ----------------
  {
    domain: 'SAT', unit: 15, title: 'Lines, angles, and triangles',
    objective: 'Use angle pairs, the triangle sum, and the exterior angle theorem to find missing angles.',
    concept: [
      'A straight line is 180°. Angles that make a line are SUPPLEMENTARY; vertical angles are EQUAL.',
      'PARALLEL lines cut by a transversal: every angle is one of TWO sizes, and the two sizes add to 180°.',
      'The angles of a triangle add to 180°.',
      'EXTERIOR ANGLE: an outside angle of a triangle equals the sum of the two FAR inside angles.',
      'PRO MOVE — isosceles means two equal sides AND two equal base angles. Spot equal sides, then mark equal angles.',
    ],
    examples: [
      { q: 'Two angles form a straight line; one is 115°. The other?', steps: ['They add to 180°.', '180 − 115.', '= 65°.'], answer: '65°' },
      { q: 'A triangle has angles 48° and 67°. The third?', steps: ['The three add to 180°.', '180 − 48 − 67.', '= 65°.'], answer: '65°' },
      { q: 'An exterior angle is 130°; one far inside angle is 55°. The other far angle?', steps: ['Exterior = sum of the two far angles.', '130 = 55 + x.', 'x = 75°.'], answer: '75°' },
      { q: 'Parallel lines, transversal: one angle is 72°. Its co-interior partner?', steps: ['Co-interior angles are supplementary.', '180 − 72.', '= 108°.'], answer: '108°' },
      { q: 'An isosceles triangle has a 40° vertex angle. Each base angle?', steps: ['Base angles are equal: 2b + 40 = 180.', '2b = 140.', 'b = 70°.'], answer: '70°' },
      { q: 'Angles of a triangle are x, 2x, and 3x. Find x.', steps: ['x + 2x + 3x = 180.', '6x = 180.', 'x = 30°.'], answer: '30°' },
    ],
    practice: [
      { q: 'Two angles are supplementary and one is 38°. What is the other, in degrees?', answers: ['142'], steps: ['180 − 38.', '= 142.'] },
      { q: 'A triangle has angles 90° and 35°. What is the third, in degrees?', answers: ['55'], steps: ['180 − 90 − 35.', '= 55.'] },
      { q: 'Vertical angles: one is 3x and the other 75°. What is x?', answers: ['25'], steps: ['Vertical angles are equal: 3x = 75.', 'x = 25.'] },
      { q: 'An exterior angle of a triangle is 110°; the far angles are equal. What is each, in degrees?', answers: ['55'], steps: ['2a = 110.', 'a = 55.'] },
    ],
    watchOut: 'The exterior angle equals the two FAR interior angles — not the one right beside it, which is its supplement.',
  },

  // ---------------- SAT Unit 16 — Area, volume, similarity ----------------
  {
    domain: 'SAT', unit: 16, title: 'Area, volume, and similarity',
    objective: 'Find composite areas and volumes, and scale them correctly for similar figures.',
    concept: [
      'AREA: rectangle lw, triangle ½bh, circle πr². The reference sheet has these — know where they are.',
      'VOLUME: prism = base area × height; cylinder πr²h; cone and pyramid are ⅓ of their prism.',
      'COMPOSITE shapes: split into pieces you know, then add — or take the big shape and SUBTRACT the hole.',
      'SIMILAR figures with scale factor k: lengths ×k, AREAS ×k², VOLUMES ×k³.',
      'PRO MOVE — similar triangles give proportional sides: match corresponding sides and set up a single proportion.',
    ],
    examples: [
      { q: 'A cylinder has r = 3 and h = 10. Volume?', steps: ['V = πr²h.', 'π · 9 · 10.', '= 90π.'], answer: '90π' },
      { q: 'A 10 × 8 rectangle has a 4 × 3 hole cut out. Area left?', steps: ['Whole: 80.', 'Hole: 12.', '80 − 12 = 68.'], answer: '68' },
      { q: 'Two similar triangles have scale factor 3. The small one has area 5. The big one?', steps: ['Areas scale by k².', '3² = 9.', '5 · 9 = 45.'], answer: '45' },
      { q: 'A cube\'s edges double. What happens to its volume?', steps: ['Volume scales by k³.', '2³ = 8.', 'It becomes 8 times as large.'], answer: '×8' },
      { q: 'Similar triangles: sides 4 and 6 correspond; the small triangle has a side 10. Its partner?', steps: ['Scale factor 6/4 = 1.5.', '10 · 1.5.', '= 15.'], answer: '15' },
      { q: 'A cone has r = 3 and h = 4. Volume?', steps: ['V = ⅓πr²h.', '⅓ · π · 9 · 4.', '= 12π.'], answer: '12π' },
    ],
    practice: [
      { q: 'A triangle has base 12 and height 5. What is its area?', answers: ['30'], steps: ['½ × 12 × 5.', '= 30.'] },
      { q: 'A box is 3 × 4 × 5. What is its volume?', answers: ['60'], steps: ['3 × 4 × 5.', '= 60.'] },
      { q: 'Lengths scale by 4. By what factor does area scale?', answers: ['16'], steps: ['Area scales by k².', '4² = 16.'] },
      { q: 'A circle has radius 5. Its area is kπ. What is k?', answers: ['25'], steps: ['πr² = 25π.', 'k = 25.'] },
    ],
    watchOut: 'Doubling the sides does NOT double the area — it quadruples it (2²), and multiplies volume by 8 (2³).',
  },

  // ---------------- SAT Unit 17 — Right triangles and trigonometry ----------------
  {
    domain: 'SAT', unit: 17, title: 'Right triangles and trigonometry',
    objective: 'Use Pythagoras, special right triangles, and SOH-CAH-TOA to find missing sides.',
    concept: [
      'PYTHAGORAS: a² + b² = c², where c is the HYPOTENUSE — the side across from the right angle.',
      'Common triples save time: 3-4-5, 5-12-13, 8-15-17, and their multiples (6-8-10).',
      'SPECIAL TRIANGLES: 45-45-90 has sides x, x, x√2. 30-60-90 has sides x, x√3, 2x.',
      'SOH-CAH-TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent.',
      'PRO MOVE — complementary angles swap: sin(x°) = cos(90° − x°). If sin 30° = cos A, then A = 60°.',
    ],
    examples: [
      { q: 'Legs 9 and 12. Hypotenuse?', steps: ['9² + 12² = 81 + 144 = 225.', '√225.', '= 15.'], answer: '15' },
      { q: 'Hypotenuse 13, one leg 5. Other leg?', steps: ['13² − 5² = 169 − 25 = 144.', '√144.', '= 12.'], answer: '12' },
      { q: 'A 45-45-90 triangle has legs 7. Hypotenuse?', steps: ['Hypotenuse = leg · √2.', '7√2.'], answer: '7√2' },
      { q: 'A 30-60-90 has hypotenuse 10. Shorter leg? Longer leg?', steps: ['Hypotenuse = 2x, so x = 5.', 'Shorter leg 5.', 'Longer leg 5√3.'], answer: '5 and 5√3' },
      { q: 'Right triangle: opposite 8, hypotenuse 17. sin of the angle?', steps: ['SOH: opposite ÷ hypotenuse.', '8/17.'], answer: '8/17' },
      { q: 'If sin x° = cos 25°, and x is acute, find x.', steps: ['sin x = cos(90 − x).', '90 − x = 25.', 'x = 65.'], answer: '65' },
    ],
    practice: [
      { q: 'Legs 6 and 8. What is the hypotenuse?', answers: ['10'], steps: ['36 + 64 = 100.', '√100 = 10.'] },
      { q: 'A 30-60-90 triangle has shorter leg 4. What is its hypotenuse?', answers: ['8'], steps: ['Hypotenuse = 2x.', '= 8.'] },
      { q: 'Opposite 3, adjacent 4. What is tan of the angle? Give a decimal.', answers: ['0.75', '3/4'], steps: ['TOA: 3 ÷ 4.', '= 0.75.'] },
      { q: 'sin 40° = cos A. What is A, in degrees?', answers: ['50'], steps: ['Complementary: A = 90 − 40.', '= 50.'] },
    ],
    watchOut: 'The hypotenuse is always the LONGEST side and sits across from the right angle — c in a² + b² = c² is never a leg.',
  },

  // ---------------- SAT Unit 18 — Circles ----------------
  {
    domain: 'SAT', unit: 18, title: 'Circles: equations, arcs, and sectors',
    objective: 'Read a circle\'s center and radius from its equation, and find arc lengths and sector areas.',
    concept: [
      'STANDARD FORM: (x − h)² + (y − k)² = r². The center is (h, k); the radius is √(right side).',
      'If the equation is expanded, COMPLETE THE SQUARE in x and in y to get back to standard form.',
      'A central angle of θ° takes θ/360 of the circle: ARC = (θ/360) · 2πr and SECTOR = (θ/360) · πr².',
      'RADIANS: 180° = π. Arc length in radians is simply s = rθ.',
      'PRO MOVE — a radius drawn to a point of tangency is PERPENDICULAR to the tangent line, which hands you a right triangle.',
    ],
    examples: [
      { q: 'Center and radius of (x − 2)² + (y + 5)² = 36?', steps: ['h = 2, k = −5 (signs flip).', 'r² = 36, so r = 6.', 'Center (2, −5), radius 6.'], answer: '(2, −5), r = 6' },
      { q: 'Find the radius of x² + 6x + y² − 4y = 12.', steps: ['x² + 6x + 9 and y² − 4y + 4: add 13 to both sides.', '(x + 3)² + (y − 2)² = 25.', 'r = 5.'], answer: '5' },
      { q: 'Arc length for 60° in a circle of radius 9?', steps: ['60/360 = 1/6.', 'Circumference 18π.', '18π ÷ 6 = 3π.'], answer: '3π' },
      { q: 'Sector area for 90° in a circle of radius 4?', steps: ['90/360 = 1/4.', 'Area 16π.', '16π ÷ 4 = 4π.'], answer: '4π' },
      { q: 'Convert 135° to radians.', steps: ['Multiply by π/180.', '135π/180.', '= 3π/4.'], answer: '3π/4' },
      { q: 'Radius 5, central angle 2 radians. Arc length?', steps: ['s = rθ.', '5 · 2.', '= 10.'], answer: '10' },
    ],
    practice: [
      { q: '(x + 1)² + (y − 3)² = 49. What is the radius?', answers: ['7'], steps: ['r² = 49.', 'r = 7.'] },
      { q: 'A circle has radius 6. The arc of a 120° angle is kπ. What is k?', answers: ['4'], steps: ['120/360 = 1/3.', '12π ÷ 3 = 4π.'] },
      { q: 'Convert π/3 radians to degrees.', answers: ['60'], steps: ['π = 180°.', '180 ÷ 3 = 60.'] },
      { q: 'A circle has radius 10. A 36° sector has area kπ. What is k?', answers: ['10'], steps: ['36/360 = 1/10.', '100π ÷ 10 = 10π.'] },
    ],
    watchOut: 'In (x − h)² + (y − k)² = r², the right side is r SQUARED. If it says 36, the radius is 6, not 36.',
  },
];
