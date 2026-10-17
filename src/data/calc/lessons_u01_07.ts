import type { Lesson } from '../lessons';

// AP Calculus AB, units 1-7: limits from graphs and tables, limit laws,
// continuity and the IVT, limits at infinity, the derivative as a limit,
// the derivative rules, and the chain rule with the trig derivatives.

export const CALC_LESSONS_U01_07: Lesson[] = [
  // ---------------- CALC Unit 1 — Limits from graphs and tables ----------------
  {
    domain: 'CALC', unit: 1, title: 'Limits from graphs and tables',
    objective: 'Read where a function is heading, not where it is.',
    concept: [
      'A LIMIT asks one question: as x creeps toward c, what height does f(x) head for? We write lim as x → c of f(x) = L.',
      'The limit ignores what happens AT c. Cover x = c with your thumb: a hole there, or a stray dot, changes nothing.',
      'ONE-SIDED limits read the approach from one side only: x → c⁻ comes in from the left, x → c⁺ comes in from the right.',
      'The limit EXISTS only when both sides agree. Left heading to 2 and right heading to 3 means the limit does not exist (DNE).',
      'A TABLE finds a limit numerically: try x = 1.9, 1.99, 1.999 and x = 2.1, 2.01, 2.001 and watch where the outputs settle.',
    ],
    examples: [
      { q: 'The graph of f(x) = (x² − 4)/(x − 2) is the line y = x + 2 with a hole at x = 2. Find the limit as x → 2.', steps: ['Trace the line toward x = 2 from both sides.', 'From the left the heights climb to 4; from the right they drop to 4.', 'The hole does not matter — the limit is 4.'], answer: '4' },
      { q: 'A graph of g heads to height 4 as x → 2, but there is a lone dot at (2, 1). What is lim g(x) as x → 2, and what is g(2)?', steps: ['The limit is about the neighbors of 2, so the limit is 4.', 'The value g(2) is the dot itself: 1.', 'A limit and a value can disagree.'], answer: 'limit 4, g(2) = 1' },
      { q: 'f(x) = x + 1 for x < 1 and f(x) = 4 − x for x > 1. Find the limit as x → 1.', steps: ['From the left use x + 1: it heads to 1 + 1 = 2.', 'From the right use 4 − x: it heads to 4 − 1 = 3.', 'Left 2, right 3 — they disagree, so the limit does not exist.'], answer: 'DNE (left 2, right 3)' },
      { q: 'Use a table to find lim of (x² − 9)/(x − 3) as x → 3.', steps: ['x = 2.9 gives 5.9; x = 2.99 gives 5.99.', 'x = 3.1 gives 6.1; x = 3.01 gives 6.01.', 'Both columns squeeze toward 6.'], answer: '6' },
      { q: 'g(x) = x² for x < 2 and g(x) = 6 − x for x ≥ 2. Does the limit as x → 2 exist?', steps: ['Left side: x² → 2² = 4.', 'Right side: 6 − x → 6 − 2 = 4.', 'Both sides agree, so the limit is 4, even though the two formulas differ.'], answer: 'yes, 4' },
      { q: 'A garage charges $3 for each hour or part of an hour. C(t) is the cost after t hours. Find lim C(t) as t → 1 from each side.', steps: ['Just under 1 hour (t → 1⁻) you are still in the first hour: $3.', 'Just over 1 hour (t → 1⁺) a second hour has started: $6.', 'Left 3, right 6 — the two-sided limit does not exist. The price jumps at t = 1.'], answer: 'left 3, right 6, limit DNE' },
    ],
    practice: [
      { q: 'f(x) = (x² − 1)/(x − 1). What is the limit as x → 1?', answers: ['2'], steps: ['Away from x = 1 the graph is the line y = x + 1 with a hole.', 'Trace toward x = 1: the heights head to 1 + 1 = 2.', 'The limit is 2.'] },
      { q: 'A table shows h(x) = 4.9, 4.99, 4.999 as x → 3 from the left and 5.1, 5.01, 5.001 from the right. What is lim h(x) as x → 3?', answers: ['5'], steps: ['The left column climbs toward 5.', 'The right column falls toward 5.', 'Both sides agree: the limit is 5.'] },
      { q: 'f(x) = 2x for x < 3 and f(x) = x + 2 for x > 3. What is the right-hand limit as x → 3⁺?', answers: ['5'], steps: ['From the right, x > 3, so use x + 2.', '3 + 2 = 5.', 'The right-hand limit is 5 (the left-hand limit is 6, so the two-sided limit does not exist).'] },
      { q: 'What is the limit of |x − 2|/(x − 2) as x → 2 from the left?', answers: ['-1', '−1'], steps: ['For x < 2, x − 2 is negative, so |x − 2| = −(x − 2).', 'The fraction is −(x − 2)/(x − 2) = −1 for every x on the left.', 'The left-hand limit is −1.'] },
    ],
    watchOut: 'The limit is about the neighbors, not the point: lim f(x) as x → c can be 4 even when f(c) = 1 or f(c) does not exist. And when the left and right sides disagree, the answer is DNE — never the average of the two.',
  },

  // ---------------- CALC Unit 2 — Limit laws and algebraic limits ----------------
  {
    domain: 'CALC', unit: 2, title: 'Limit laws and algebraic limits (factor, rationalize, squeeze)',
    objective: 'Compute limits exactly with algebra.',
    concept: [
      'LIMIT LAWS: the limit of a sum, difference, product or quotient is the sum, difference, product or quotient of the limits (a quotient needs a nonzero bottom).',
      'DIRECT SUBSTITUTION first: for polynomials, and for rational, root and trig functions where they are defined, lim f(x) as x → c is just f(c).',
      'If plugging in gives 0/0, that is an INDETERMINATE form. It means "do more algebra" — not "the answer is 0" and not "undefined".',
      'FACTOR and cancel: (x² − 9)/(x − 3) equals x + 3 for every x except 3, so its limit at 3 is 6.',
      'RATIONALIZE a square root by multiplying by its conjugate. SQUEEZE a wild function between two tame ones that share a limit.',
    ],
    examples: [
      { q: 'Find lim (2x² − x) as x → 3.', steps: ['A polynomial is continuous, so substitute.', '2(3)² − 3 = 18 − 3.', 'The limit is 15.'], answer: '15' },
      { q: 'Find lim (x² − 9)/(x − 3) as x → 3.', steps: ['Substituting gives 0/0 — keep working.', 'Factor: (x − 3)(x + 3)/(x − 3) = x + 3.', 'Now substitute: 3 + 3 = 6.'], answer: '6' },
      { q: 'Find lim (x² − 5x + 6)/(x² − 4) as x → 2.', steps: ['Substituting gives 0/0.', 'Factor: (x − 2)(x − 3) over (x − 2)(x + 2), cancel (x − 2).', 'Substitute into (x − 3)/(x + 2): (2 − 3)/(2 + 2) = −1/4.'], answer: '−1/4' },
      { q: 'Find lim (√x − 2)/(x − 4) as x → 4.', steps: ['Substituting gives 0/0, and there is nothing to factor.', 'Multiply top and bottom by the conjugate √x + 2: top becomes x − 4.', 'Cancel x − 4 to get 1/(√x + 2); substitute: 1/(2 + 2) = 1/4.'], answer: '1/4' },
      { q: 'Find lim x² sin(1/x) as x → 0.', steps: ['sin(1/x) swings between −1 and 1 forever, so substitution fails.', 'Multiply by x²: −x² ≤ x² sin(1/x) ≤ x².', 'Both fences → 0 as x → 0, so the squeezed function → 0.'], answer: '0' },
      { q: 'A dropped ball falls s(t) = 16t² feet in t seconds. Its average speed from t = 1 to time t is (16t² − 16)/(t − 1). What does the average speed approach as t → 1?', steps: ['Substituting t = 1 gives 0/0.', 'Factor: 16(t − 1)(t + 1)/(t − 1) = 16(t + 1).', 'As t → 1 this heads to 16(2) = 32 ft/s — the instantaneous speed at t = 1.'], answer: '32 ft/s' },
    ],
    practice: [
      { q: 'Find lim (x² − 25)/(x − 5) as x → 5.', answers: ['10'], steps: ['0/0, so factor: (x − 5)(x + 5)/(x − 5) = x + 5.', 'Substitute: 5 + 5 = 10.'] },
      { q: 'Find lim (√(x + 9) − 3)/x as x → 0. Give a fraction.', answers: ['1/6'], steps: ['Multiply by the conjugate √(x + 9) + 3: the top becomes (x + 9) − 9 = x.', 'Cancel the x: 1/(√(x + 9) + 3).', 'Substitute x = 0: 1/(3 + 3) = 1/6.'] },
      { q: 'Find lim (x² + 3x − 4)/(x − 1) as x → 1.', answers: ['5'], steps: ['Factor the top: (x + 4)(x − 1).', 'Cancel (x − 1) to leave x + 4.', 'Substitute: 1 + 4 = 5.'] },
      { q: 'Find lim (x² − x − 6)/(x + 2) as x → −2.', answers: ['-5', '−5'], steps: ['Factor the top: (x − 3)(x + 2).', 'Cancel (x + 2) to leave x − 3.', 'Substitute: −2 − 3 = −5.'] },
    ],
    watchOut: '0/0 means "keep working", but 5/0 means the limit is infinite or does not exist — you cannot cancel your way out of c/0. And a factor only cancels when it appears on the top AND the bottom.',
  },

  // ---------------- CALC Unit 3 — Continuity and the Intermediate Value Theorem ----------------
  {
    domain: 'CALC', unit: 3, title: 'Continuity and the Intermediate Value Theorem',
    objective: 'Test for breaks, and use unbroken graphs to guarantee solutions.',
    concept: [
      'f is CONTINUOUS at c when three things hold: f(c) exists, lim f(x) as x → c exists, and the two are equal. The pencil never lifts.',
      'Three ways to break: a HOLE (removable — the limit exists but f(c) is missing or wrong), a JUMP (the one-sided limits disagree), or an INFINITE break (a vertical asymptote).',
      'Polynomials, eˣ, sin x and cos x are continuous everywhere. Rational functions, ln x, √x and tan x are continuous wherever they are defined.',
      'For a PIECEWISE function, check the seam: the left limit, the right limit and the value there must all match. Often you solve for a constant k that makes them match.',
      'INTERMEDIATE VALUE THEOREM: if f is continuous on [a, b], it takes every value between f(a) and f(b). A sign change forces a root.',
    ],
    examples: [
      { q: 'Is f(x) = (x² − 4)/(x − 2) continuous at x = 2?', steps: ['The limit as x → 2 is 4 (factor and cancel).', 'But f(2) = 0/0 is undefined, so the first condition fails.', 'Not continuous: a removable discontinuity (a hole) at x = 2.'], answer: 'no — a hole at x = 2' },
      { q: 'f(x) = x + 1 for x < 2 and f(x) = 3x − 3 for x ≥ 2. Is f continuous at x = 2?', steps: ['Left limit: 2 + 1 = 3. Right limit: 3(2) − 3 = 3.', 'Value: f(2) uses the second piece, so f(2) = 3.', 'All three match, so f is continuous at 2.'], answer: 'yes' },
      { q: 'f(x) = kx + 1 for x < 3 and f(x) = x² for x ≥ 3. Find k so that f is continuous.', steps: ['Left limit at 3: 3k + 1. Right limit and value: 3² = 9.', 'Set them equal: 3k + 1 = 9.', 'k = 8/3.'], answer: 'k = 8/3' },
      { q: 'Classify every discontinuity of g(x) = (x − 1)/(x² − 1).', steps: ['Factor the bottom: (x − 1)(x + 1).', 'The (x − 1) cancels, so x = 1 is a hole (removable); the limit there is 1/2.', 'The (x + 1) stays, so x = −1 is a vertical asymptote (infinite discontinuity).'], answer: 'hole at x = 1, vertical asymptote at x = −1' },
      { q: 'Show that f(x) = x³ − x − 1 has a root between x = 1 and x = 2.', steps: ['f(1) = 1 − 1 − 1 = −1, which is negative.', 'f(2) = 8 − 2 − 1 = 5, which is positive.', 'f is a polynomial, so it is continuous; by the IVT it must cross 0 somewhere in (1, 2).'], answer: 'IVT: f(1) < 0 < f(2), so a root exists in (1, 2)' },
      { q: 'At 6 am it was 50°F; at noon it was 70°F. Must there have been a moment when it was exactly 60°F?', steps: ['Temperature changes continuously — it cannot skip values.', '60 sits between 50 and 70.', 'By the IVT some moment between 6 am and noon read exactly 60°F.'], answer: 'yes, by the IVT' },
    ],
    practice: [
      { q: 'f(x) = 2x + k for x < 1 and f(x) = x² + 4 for x ≥ 1. What value of k makes f continuous?', answers: ['3', 'k = 3'], steps: ['Left limit at 1: 2 + k. Right value: 1 + 4 = 5.', 'Set equal: 2 + k = 5.', 'k = 3.'] },
      { q: 'g(x) = (x² − 16)/(x − 4) has a hole at x = 4. What value should g(4) be given to fill the hole?', answers: ['8'], steps: ['Factor and cancel: g(x) = x + 4 away from 4.', 'The limit at 4 is 4 + 4 = 8.', 'Define g(4) = 8 and the function becomes continuous.'] },
      { q: 'h(x) = x² − 7 is continuous, with h(2) = −3 and h(3) = 2. The IVT guarantees a solution of h(x) = 0 between 2 and which integer?', answers: ['3'], steps: ['h changes sign between x = 2 and x = 3.', 'A continuous function cannot change sign without passing through 0.', 'There is a root between 2 and 3 (it is √7 ≈ 2.65).'] },
      { q: 'How many points of discontinuity does f(x) = (x + 3)/((x − 2)(x + 5)) have?', answers: ['2', 'two'], steps: ['Nothing cancels, so every zero of the bottom is a break.', 'The bottom is zero at x = 2 and x = −5.', 'Two vertical asymptotes, so 2 discontinuities.'] },
    ],
    watchOut: 'A limit can exist at a point where the function is NOT continuous — that is exactly what a hole is. And the IVT only applies to a continuous function: 1/x goes from −1 to 1 on [−1, 1] without ever equaling 0.',
  },

  // ---------------- CALC Unit 4 — Limits at infinity, asymptotes and infinite limits ----------------
  {
    domain: 'CALC', unit: 4, title: 'Limits at infinity, asymptotes and infinite limits',
    objective: 'Read the far ends and the blow-ups of a graph.',
    concept: [
      'lim f(x) as x → ∞ = L means the graph flattens onto the HORIZONTAL ASYMPTOTE y = L far to the right. x → −∞ checks the far left.',
      '1/x, 1/x² and 1/√x all → 0 as x → ∞. Divide the top and bottom by the highest power of x in the bottom and every small piece melts away.',
      'DEGREE RULE for a rational function: top degree smaller → limit 0; degrees equal → ratio of leading coefficients; top degree bigger → ±∞, no horizontal asymptote.',
      'An INFINITE LIMIT, lim f(x) = ∞ as x → c, means the heights blow up near x = c: a VERTICAL ASYMPTOTE. It comes from a nonzero top over a bottom heading to 0.',
      'Check each side of a vertical asymptote separately: the sign of the bottom decides whether that branch shoots up (+∞) or down (−∞).',
    ],
    examples: [
      { q: 'Find lim (3x² + 5)/(x² − 1) as x → ∞.', steps: ['Divide every term by x²: (3 + 5/x²)/(1 − 1/x²).', 'As x → ∞ the 5/x² and 1/x² pieces → 0.', 'The limit is 3/1 = 3; the horizontal asymptote is y = 3.'], answer: '3' },
      { q: 'Find lim (5x + 2)/(x² + 7) as x → ∞.', steps: ['Top degree 1, bottom degree 2 — the bottom wins.', 'Divide by x²: (5/x + 2/x²)/(1 + 7/x²) → 0/1.', 'The limit is 0.'], answer: '0' },
      { q: 'Find lim (x³ − 1)/(x + 2) as x → ∞.', steps: ['Top degree 3 beats bottom degree 1.', 'Divide by x: (x² − 1/x)/(1 + 2/x) — the top grows like x².', 'The limit is ∞: no horizontal asymptote.'], answer: '∞' },
      { q: 'Find the one-sided limits of 1/(x − 2) as x → 2.', steps: ['From the left, x − 2 is a tiny negative number, so 1/(x − 2) → −∞.', 'From the right, x − 2 is a tiny positive number, so 1/(x − 2) → +∞.', 'x = 2 is a vertical asymptote; the two branches go opposite ways.'], answer: 'left −∞, right +∞' },
      { q: 'Find lim √(4x² + 1)/(x + 3) as x → ∞.', steps: ['For large positive x, √(4x² + 1) ≈ √(4x²) = 2x.', 'Divide top and bottom by x: √(4 + 1/x²)/(1 + 3/x).', 'As x → ∞ this heads to √4/1 = 2.'], answer: '2' },
      { q: 'A fish population follows P(t) = 1000/(1 + 9e^(−t)), t in years. What population does the lake approach in the long run?', steps: ['As t → ∞, e^(−t) → 0, so 9e^(−t) → 0.', 'The bottom heads to 1 + 0 = 1.', 'P(t) → 1000/1 = 1000 fish: the horizontal asymptote is the carrying capacity.'], answer: '1000 fish' },
    ],
    practice: [
      { q: 'Find lim (7x² − x)/(2x² + 3) as x → ∞. Give a fraction.', answers: ['7/2', '3.5'], steps: ['Degrees are equal (both 2).', 'Take the ratio of leading coefficients: 7/2.'] },
      { q: 'Find lim (x + 1)/(x³ + 8) as x → ∞.', answers: ['0'], steps: ['Top degree 1, bottom degree 3.', 'The bottom grows much faster, so the fraction → 0.'] },
      { q: 'At what x does f(x) = (x + 1)/(x − 5) have a vertical asymptote?', answers: ['5', 'x = 5'], steps: ['The bottom is zero at x = 5 and the top is 6 there, not 0.', 'A nonzero top over a bottom → 0 blows up.', 'The vertical asymptote is x = 5.'] },
      { q: 'The average cost per gadget after making t thousand of them is C(t) = (40t + 5)/(t + 2) dollars. What does the cost per gadget approach as t → ∞?', answers: ['40', '$40'], steps: ['Degrees are equal (both 1).', 'Ratio of leading coefficients: 40/1 = 40.', 'The cost settles toward $40 per gadget.'] },
    ],
    watchOut: 'Equal degrees means the ratio of leading coefficients, not 1. And the x → −∞ side can differ: √(x²) is |x|, which equals −x when x is negative, so a square-root limit can change sign on the left.',
  },

  // ---------------- CALC Unit 5 — The derivative as a limit; tangent lines and rates of change ----------------
  {
    domain: 'CALC', unit: 5, title: 'The derivative as a limit; tangent lines and rates of change',
    objective: 'Turn average rates into instantaneous ones with a limit.',
    concept: [
      'AVERAGE rate of change over [a, b] is the slope of the SECANT line through two points: (f(b) − f(a))/(b − a).',
      'The DERIVATIVE f′(a) is the INSTANTANEOUS rate: the limit of secant slopes as the second point slides into the first.',
      'Definition: f′(x) = lim as h → 0 of [f(x + h) − f(x)]/h. Alternate form: f′(a) = lim as x → a of [f(x) − f(a)]/(x − a).',
      'f′(a) is the slope of the TANGENT line at x = a, so the tangent line is y = f(a) + f′(a)(x − a).',
      'The derivative fails where the graph has a corner, a cusp, a vertical tangent or a break. Differentiable implies continuous, but not the reverse.',
    ],
    examples: [
      { q: 'f(x) = x². Use the limit definition to find f′(1).', steps: ['f(1 + h) − f(1) = (1 + h)² − 1 = 2h + h².', 'Divide by h: (2h + h²)/h = 2 + h.', 'Let h → 0: f′(1) = 2.'], answer: '2' },
      { q: 'f(x) = x². Find f′(x) for every x from the definition.', steps: ['f(x + h) − f(x) = x² + 2xh + h² − x² = 2xh + h².', 'Divide by h: 2x + h.', 'Let h → 0: f′(x) = 2x.'], answer: "f′(x) = 2x" },
      { q: 'f(x) = 1/x. Find f′(x) from the definition.', steps: ['f(x + h) − f(x) = 1/(x + h) − 1/x = (x − (x + h))/(x(x + h)) = −h/(x(x + h)).', 'Divide by h: −1/(x(x + h)).', 'Let h → 0: f′(x) = −1/x².'], answer: "f′(x) = −1/x²" },
      { q: 'Write the equation of the tangent line to y = x² at x = 2.', steps: ['The point: f(2) = 4, so (2, 4).', 'The slope: f′(x) = 2x, so f′(2) = 4.', 'Point-slope: y − 4 = 4(x − 2), so y = 4x − 4.'], answer: 'y = 4x − 4' },
      { q: 'f(x) = √x. Use the alternate form to find f′(4).', steps: ['f′(4) = lim (√x − 2)/(x − 4) as x → 4 — a 0/0 form.', 'Multiply by the conjugate: 1/(√x + 2).', 'Substitute x = 4: 1/(2 + 2) = 1/4.'], answer: '1/4' },
      { q: 'A ball thrown upward has height h(t) = 64t − 16t² feet after t seconds. Find the average velocity on [1, 2] and the instantaneous velocity at t = 1.', steps: ['h(1) = 48, h(2) = 64; average velocity = (64 − 48)/(2 − 1) = 16 ft/s.', 'h(1 + k) − h(1) = 64(1 + k) − 16(1 + k)² − 48 = 32k − 16k²; divide by k: 32 − 16k.', 'Let k → 0: h′(1) = 32 ft/s. The ball is moving faster at t = 1 than its average over the whole second.'], answer: 'average 16 ft/s, instantaneous 32 ft/s' },
    ],
    practice: [
      { q: 'f(x) = x² + 3x. What is the average rate of change on [1, 3]?', answers: ['7'], steps: ['f(3) = 9 + 9 = 18 and f(1) = 1 + 3 = 4.', 'Slope of the secant: (18 − 4)/(3 − 1) = 14/2.', 'The average rate is 7.'] },
      { q: 'f(x) = x². What is f′(3)?', answers: ['6'], steps: ['From the definition f′(x) = 2x.', 'f′(3) = 2(3) = 6.'] },
      { q: 'The tangent line to y = x² at x = 3 crosses the y-axis where? Give the y-intercept.', answers: ['-9', '−9'], steps: ['Point (3, 9), slope f′(3) = 6.', 'y − 9 = 6(x − 3) gives y = 6x − 9.', 'The y-intercept is −9.'] },
      { q: 'A cart has position s(t) = 5t² meters after t seconds. What is its velocity at t = 2, in m/s?', answers: ['20', '20 m/s'], steps: ['Velocity is the derivative of position: s′(t) = 10t.', 's′(2) = 20 m/s.'] },
    ],
    watchOut: 'Average rate uses two points; instantaneous rate uses the limit as the two points merge. Do not set h = 0 before you cancel the h — that gives 0/0, which is the signal to simplify first.',
  },

  // ---------------- CALC Unit 6 — Derivative rules ----------------
  {
    domain: 'CALC', unit: 6, title: 'Derivative rules: power, product, quotient, e^x and ln x',
    objective: 'Differentiate without the limit, one rule per shape.',
    concept: [
      'POWER RULE: d/dx of xⁿ is n·xⁿ⁻¹ for any real n. Rewrite roots and reciprocals as powers first: √x = x^(1/2) and 1/x² = x⁻².',
      'Constants drop to 0, a constant multiple rides along, and sums split term by term: (3x⁴ − 2x + 7)′ = 12x³ − 2.',
      'PRODUCT RULE: (fg)′ = f′g + fg′, NOT f′g′. Each piece takes a turn being differentiated while the other waits.',
      'QUOTIENT RULE: (f/g)′ = (f′g − fg′)/g². Top-prime first, minus, all over the bottom squared.',
      'd/dx of eˣ is eˣ and d/dx of ln x is 1/x. Every exponential and logarithm rule later is built on these two facts.',
    ],
    examples: [
      { q: 'Differentiate f(x) = 3x⁴ − 2x + 7.', steps: ['Power rule on 3x⁴: 3 · 4x³ = 12x³.', 'The −2x becomes −2; the constant 7 becomes 0.', 'f′(x) = 12x³ − 2.'], answer: "f′(x) = 12x³ − 2" },
      { q: 'Differentiate √x and 1/x².', steps: ['Rewrite: √x = x^(1/2) and 1/x² = x⁻².', 'Power rule: (1/2)x^(−1/2) = 1/(2√x).', 'Power rule: −2x⁻³ = −2/x³.'], answer: '1/(2√x) and −2/x³' },
      { q: 'Differentiate y = x²eˣ.', steps: ['Product rule with f = x², g = eˣ.', 'f′g + fg′ = 2x·eˣ + x²·eˣ.', 'Factor if you like: y′ = x(x + 2)eˣ.'], answer: "y′ = 2xeˣ + x²eˣ" },
      { q: 'Differentiate y = x/(x² + 1).', steps: ['Quotient rule: top f = x, bottom g = x² + 1.', '(f′g − fg′)/g² = (1·(x² + 1) − x·2x)/(x² + 1)².', 'Simplify the top: y′ = (1 − x²)/(x² + 1)².'], answer: "y′ = (1 − x²)/(x² + 1)²" },
      { q: 'Find the tangent line to y = ln x at x = 1.', steps: ['The point: ln 1 = 0, so (1, 0).', 'The slope: y′ = 1/x, so at x = 1 the slope is 1.', 'y − 0 = 1(x − 1), so y = x − 1.'], answer: 'y = x − 1' },
      { q: 'A shop sells q(t) = 100 + 10t mugs per day at price p(t) = 20 − t dollars, t days after launch. Revenue is R = p · q. How fast is revenue changing on day 2?', steps: ['Product rule: R′ = p′q + pq′ with p′ = −1 and q′ = 10.', 'On day 2: p = 18, q = 120.', 'R′(2) = (−1)(120) + (18)(10) = −120 + 180 = 60 dollars per day.'], answer: '$60 per day' },
    ],
    practice: [
      { q: 'f(x) = 4x³ − 5x. What is f′(2)?', answers: ['43'], steps: ['f′(x) = 12x² − 5.', 'f′(2) = 48 − 5 = 43.'] },
      { q: 'g(x) = x·eˣ. What is g′(0)?', answers: ['1'], steps: ['Product rule: g′(x) = 1·eˣ + x·eˣ.', 'At x = 0: e⁰ + 0 = 1.'] },
      { q: 'h(x) = (2x + 1)/x. What is h′(1)?', answers: ['-1', '−1'], steps: ['Quotient rule: (2·x − (2x + 1)·1)/x² = −1/x².', 'At x = 1: −1.', 'Check: h(x) = 2 + 1/x, whose derivative −1/x² agrees.'] },
      { q: 'What is the slope of y = ln x at x = 4? Give a fraction.', answers: ['1/4', '0.25'], steps: ['y′ = 1/x.', 'At x = 4 the slope is 1/4.'] },
    ],
    watchOut: 'The derivative of a product is not the product of the derivatives: (x · x)′ = 2x, but 1 · 1 = 1. And in the quotient rule the order matters — f′g − fg′, with the top differentiated first.',
  },

  // ---------------- CALC Unit 7 — The chain rule and trig derivatives ----------------
  {
    domain: 'CALC', unit: 7, title: 'The chain rule and trig derivatives',
    objective: 'Differentiate a function inside a function, and the six trig functions.',
    concept: [
      'CHAIN RULE: for a function inside a function, d/dx of f(g(x)) is f′(g(x)) · g′(x). Differentiate the outside, keep the inside, then multiply by the inside\'s derivative.',
      'Spot the layers: in sin(3x) the outer layer is sin and the inner is 3x. In (2x + 1)³ the outer layer is the cube and the inner is 2x + 1.',
      'General power rule: (uⁿ)′ = n·uⁿ⁻¹·u′. General exponential: (eᵘ)′ = eᵘ·u′. General log: (ln u)′ = u′/u.',
      'TRIG derivatives (in radians): sin → cos, cos → −sin, tan → sec², sec → sec·tan, csc → −csc·cot, cot → −csc².',
      'Layers stack: sin²(3x) is three layers (square, sine, 3x), so you multiply three derivatives together, working from the outside in.',
    ],
    examples: [
      { q: 'Differentiate y = (2x + 1)³.', steps: ['Outer layer: cube. Inner: 2x + 1.', 'Outer derivative, inside kept: 3(2x + 1)².', 'Times the inner derivative 2: y′ = 6(2x + 1)².'], answer: "y′ = 6(2x + 1)²" },
      { q: 'Differentiate y = sin(3x).', steps: ['Outer: sin, whose derivative is cos. Inner: 3x.', 'cos(3x), keeping the inside.', 'Times the inner derivative 3: y′ = 3cos(3x).'], answer: "y′ = 3cos(3x)" },
      { q: 'Differentiate y = e^(x²).', steps: ['Outer: eᵘ, whose derivative is eᵘ. Inner: u = x².', 'e^(x²), keeping the inside.', 'Times u′ = 2x: y′ = 2x·e^(x²).'], answer: "y′ = 2x·e^(x²)" },
      { q: 'Differentiate y = ln(x² + 1).', steps: ['(ln u)′ = u′/u with u = x² + 1.', 'u′ = 2x.', 'y′ = 2x/(x² + 1).'], answer: "y′ = 2x/(x² + 1)" },
      { q: 'Differentiate y = cos²x.', steps: ['cos²x means (cos x)²: outer square, inner cos x.', 'Outer derivative: 2(cos x). Inner derivative: −sin x.', 'y′ = 2cos x · (−sin x) = −2 sin x cos x.'], answer: "y′ = −2 sin x cos x" },
      { q: 'A Ferris wheel seat has height h(t) = 10 + 8 sin(πt/6) meters after t minutes. How fast is it rising at t = 0?', steps: ['Chain rule: h′(t) = 8 cos(πt/6) · (π/6) = (4π/3) cos(πt/6).', 'At t = 0: cos 0 = 1.', 'h′(0) = 4π/3 ≈ 4.19 meters per minute.'], answer: '4π/3 ≈ 4.19 m/min' },
    ],
    practice: [
      { q: 'y = (x² + 3)⁴. What is y′ at x = 1?', answers: ['512'], steps: ['y′ = 4(x² + 3)³ · 2x.', 'At x = 1: 4 · 4³ · 2 = 4 · 64 · 2.', 'y′(1) = 512.'] },
      { q: 'y = sin(5x). What is y′ at x = 0?', answers: ['5'], steps: ['y′ = 5cos(5x).', 'At x = 0: 5 · cos 0 = 5.'] },
      { q: 'f(x) = e^(3x). What is f′(0)?', answers: ['3'], steps: ['f′(x) = 3e^(3x).', 'At x = 0: 3 · e⁰ = 3.'] },
      { q: 'What is the slope of y = tan x at x = π/4?', answers: ['2'], steps: ['y′ = sec²x = 1/cos²x.', 'cos(π/4) = √2/2, so cos² = 1/2.', 'sec²(π/4) = 2.'] },
    ],
    watchOut: 'The inside derivative is the one students forget: (sin 5x)′ is 5cos 5x, not cos 5x. And cos x differentiates to −sin x — the minus sign belongs to cosine, not to sine.',
  },
];
