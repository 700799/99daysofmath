import type { Lesson } from '../lessons';

// AP Calculus AB, units 8-14: implicit differentiation and related rates,
// the Mean Value Theorem and curve sketching, optimization and motion,
// Riemann sums, antiderivatives and the Fundamental Theorem, u-substitution
// and area between curves, and volumes with accumulation.

export const CALC_LESSONS_U08_14: Lesson[] = [
  // ---------------- CALC Unit 8 — Implicit differentiation and related rates ----------------
  {
    domain: 'CALC', unit: 8, title: 'Implicit differentiation and related rates',
    objective: 'Differentiate curves that are not solved for y, and link rates that change together.',
    concept: [
      'An IMPLICIT equation ties x and y together without solving for y: x² + y² = 25 is a circle, and no single formula y = … gives the whole thing.',
      'Differentiate BOTH sides with respect to x. Every time you differentiate a y-term, the chain rule tacks on a factor of dy/dx: the derivative of y² is 2y·dy/dx.',
      'Then do algebra: collect the dy/dx terms on one side, factor dy/dx out, and divide. The answer usually has both x and y in it.',
      'RELATED RATES: when x and y both change with time t, differentiate the equation with respect to t. Every variable picks up its own rate, so x² + y² = 100 becomes 2x·dx/dt + 2y·dy/dt = 0.',
      'The recipe: draw a picture, name the variables, write ONE equation linking them, differentiate with respect to t, and only THEN plug in the numbers.',
      'Units are a free check: a rate is always "something per time", like cm³/s or ft/min, and a negative rate means the quantity is shrinking.',
    ],
    examples: [
      { q: 'Find dy/dx for the circle x² + y² = 25.', steps: ['Differentiate each term with respect to x: 2x + 2y·dy/dx = 0.', 'Move the x-term over: 2y·dy/dx = −2x.', 'Divide by 2y: dy/dx = −x/y.'], answer: 'dy/dx = −x/y' },
      { q: 'What is the slope of the tangent line to x² + y² = 25 at the point (3, 4)?', steps: ['From the last example, dy/dx = −x/y.', 'Plug in x = 3 and y = 4.', 'Slope = −3/4. Check: the radius to (3, 4) has slope 4/3, and the tangent is perpendicular to it.'], answer: '−3/4' },
      { q: 'Find dy/dx for xy = 12, and evaluate it at (3, 4).', steps: ['The left side is a product, so use the product rule: (1)(y) + x·dy/dx = 0.', 'x·dy/dx = −y, so dy/dx = −y/x.', 'At (3, 4): dy/dx = −4/3.'], answer: 'dy/dx = −y/x, which is −4/3 at (3, 4)' },
      { q: 'A spherical balloon is inflated so its radius grows at 2 cm/s. How fast is the volume growing when the radius is 5 cm?', steps: ['Equation: V = (4/3)πr³.', 'Differentiate with respect to t: dV/dt = 4πr²·dr/dt.', 'Now plug in r = 5 and dr/dt = 2: dV/dt = 4π(25)(2) = 200π.', 'About 628 cm³ per second.'], answer: '200π cm³/s ≈ 628.3 cm³/s' },
      { q: 'A 10 ft ladder leans on a wall. Its base slides away from the wall at 1 ft/s. How fast is the top sliding down when the base is 6 ft from the wall?', steps: ['Let x be the distance of the base from the wall and y the height of the top: x² + y² = 100.', 'Differentiate with respect to t: 2x·dx/dt + 2y·dy/dt = 0.', 'When x = 6, y = √(100 − 36) = 8.', 'Plug in: 2(6)(1) + 2(8)·dy/dt = 0, so dy/dt = −12/16 = −3/4 ft/s.', 'The negative sign means the top is moving DOWN at 0.75 ft/s.'], answer: '−3/4 ft/s (the top drops at 0.75 ft/s)' },
      { q: 'A conical tank has height 12 ft and top radius 6 ft. Water pours in at 3 ft³/min. How fast is the water level rising when the water is 4 ft deep?', steps: ['Similar triangles: r/h = 6/12, so r = h/2 at every depth.', 'V = (1/3)πr²h = (1/3)π(h/2)²h = (π/12)h³.', 'Differentiate: dV/dt = (π/4)h²·dh/dt.', 'Plug in h = 4 and dV/dt = 3: 3 = (π/4)(16)·dh/dt = 4π·dh/dt.', 'dh/dt = 3/(4π) ≈ 0.24 ft/min.'], answer: '3/(4π) ft/min ≈ 0.24 ft/min' },
    ],
    practice: [
      { q: 'For the circle x² + y² = 169, what is dy/dx at the point (5, 12)?', answers: ['-5/12', '−5/12'], steps: ['Differentiate: 2x + 2y·dy/dx = 0, so dy/dx = −x/y.', 'At (5, 12): −5/12.'] },
      { q: 'For the curve y² = x³, what is dy/dx at the point (1, 1)?', answers: ['3/2', '1.5'], steps: ['Differentiate: 2y·dy/dx = 3x².', 'dy/dx = 3x²/(2y).', 'At (1, 1): 3/2.'] },
      { q: 'The side of a square grows at 3 cm/s. How fast is its area growing, in cm²/s, when the side is 10 cm?', answers: ['60'], steps: ['A = s², so dA/dt = 2s·ds/dt.', 'Plug in s = 10 and ds/dt = 3: 2(10)(3) = 60 cm²/s.'] },
      { q: 'A circular ripple has a radius growing at 2 in/s. When the radius is 4 in, how fast is the area growing in in²/s? Give a multiple of π, or round to the nearest tenth.', answers: ['16π', '16pi', '16 pi', '50.3', '50.27'], steps: ['A = πr², so dA/dt = 2πr·dr/dt.', 'Plug in r = 4 and dr/dt = 2: 2π(4)(2) = 16π in²/s.', 'That is about 50.3 in²/s.'] },
    ],
    watchOut: 'When you differentiate y², you get 2y·dy/dx, not 2y — the dy/dx is the whole point. And in a related-rates problem, never plug in a number before you differentiate: a quantity that changes with time must stay a variable until the derivative is done.',
  },

  // ---------------- CALC Unit 9 — Mean Value Theorem, extrema and curve sketching ----------------
  {
    domain: 'CALC', unit: 9, title: 'Mean Value Theorem, extrema and curve sketching',
    objective: 'Use the first and second derivative to find highs, lows and bends, and read a graph from its derivative.',
    concept: [
      'MEAN VALUE THEOREM: if f is continuous on [a, b] and differentiable on (a, b), some c between a and b has f′(c) = (f(b) − f(a))/(b − a). Somewhere, the instant rate equals the average rate.',
      'A CRITICAL POINT is an x in the domain where f′(x) = 0 or f′(x) does not exist. A local max or min can only happen at a critical point or an endpoint.',
      'FIRST DERIVATIVE TEST: if f′ changes from + to − at a critical point, it is a local MAX; from − to +, a local MIN; if f′ does not change sign, it is neither.',
      'The SECOND DERIVATIVE reads bending: f″ > 0 means concave up (holds water), f″ < 0 means concave down. An INFLECTION POINT is where the concavity flips.',
      'On a closed interval [a, b] the absolute max and min always exist. Find them with the CANDIDATES TEST: evaluate f at every critical point inside and at both endpoints, then pick the biggest and smallest.',
      'To sketch: find zeros and intercepts, then the sign of f′ (rising or falling), then the sign of f″ (bending up or down).',
    ],
    examples: [
      { q: 'Find the value c that the Mean Value Theorem promises for f(x) = x² on [1, 4].', steps: ['Average rate: (f(4) − f(1))/(4 − 1) = (16 − 1)/3 = 5.', 'Set the instant rate equal to it: f′(c) = 2c = 5.', 'c = 2.5, which is inside (1, 4). The tangent there is parallel to the secant.'], answer: 'c = 2.5' },
      { q: 'Find the critical points of f(x) = x³ − 3x and classify each one.', steps: ['f′(x) = 3x² − 3 = 3(x − 1)(x + 1), so the critical points are x = −1 and x = 1.', 'Sign of f′: positive for x < −1, negative between −1 and 1, positive for x > 1.', 'At x = −1, f′ goes + to −: local max, f(−1) = −1 + 3 = 2.', 'At x = 1, f′ goes − to +: local min, f(1) = 1 − 3 = −2.'], answer: 'local max (−1, 2), local min (1, −2)' },
      { q: 'Find the absolute max and min of f(x) = x³ − 3x on the interval [0, 3].', steps: ['Candidates: the critical point x = 1 (x = −1 is outside the interval) and the endpoints 0 and 3.', 'f(0) = 0, f(1) = −2, f(3) = 27 − 9 = 18.', 'Absolute max 18 at x = 3; absolute min −2 at x = 1.'], answer: 'max 18 at x = 3, min −2 at x = 1' },
      { q: 'Where is the inflection point of f(x) = x³ − 3x?', steps: ['f′(x) = 3x² − 3, so f″(x) = 6x.', 'f″ = 0 at x = 0, and it changes sign there: negative on the left, positive on the right.', 'Inflection point at (0, 0).'], answer: '(0, 0)' },
      { q: 'On what intervals is f(x) = x⁴ − 6x² concave up?', steps: ['f′(x) = 4x³ − 12x, so f″(x) = 12x² − 12 = 12(x − 1)(x + 1).', 'f″ > 0 when x < −1 or x > 1; f″ < 0 between.', 'Concave up on (−∞, −1) and (1, ∞); concave down on (−1, 1). Inflection points at x = ±1.'], answer: '(−∞, −1) and (1, ∞)' },
      { q: 'A car covers 150 miles in 2 hours on a highway with a 70 mph limit. Can the driver claim never to have exceeded the limit?', steps: ['Average speed = 150/2 = 75 mph.', 'Position is continuous and differentiable, so the Mean Value Theorem applies.', 'At some instant the speedometer read exactly 75 mph, which is over the limit. The claim fails.'], answer: 'No: at some instant the speed was exactly 75 mph' },
    ],
    practice: [
      { q: 'For f(x) = x² on [0, 6], what value of c satisfies the Mean Value Theorem?', answers: ['3', 'c = 3'], steps: ['Average rate: (36 − 0)/6 = 6.', 'f′(c) = 2c = 6, so c = 3.'] },
      { q: 'What is the critical point of f(x) = x² − 8x?', answers: ['4', 'x = 4'], steps: ['f′(x) = 2x − 8 = 0.', 'x = 4.'] },
      { q: 'What is the absolute maximum value of f(x) = −x² + 4x on [0, 5]?', answers: ['4'], steps: ['f′(x) = −2x + 4 = 0 gives x = 2.', 'Candidates: f(0) = 0, f(2) = 4, f(5) = −5.', 'The biggest is 4.'] },
      { q: 'At what x does f(x) = x³ − 6x² have its inflection point?', answers: ['2', 'x = 2'], steps: ['f′(x) = 3x² − 12x, so f″(x) = 6x − 12.', 'f″ = 0 at x = 2, and it changes sign there.'] },
    ],
    watchOut: 'f′(c) = 0 does not guarantee a max or min — y = x³ has f′(0) = 0 and just flattens for an instant. Check that the sign of f′ actually changes. And on a closed interval the biggest value is often at an ENDPOINT, where f′ is not zero at all.',
  },

  // ---------------- CALC Unit 10 — Optimization and motion ----------------
  {
    domain: 'CALC', unit: 10, title: 'Optimization and motion (position, velocity, acceleration)',
    objective: 'Find the best value of a real quantity, and read velocity and acceleration from a position function.',
    concept: [
      'OPTIMIZATION means finding the biggest or smallest value of something real: the most area, the least material, the cheapest route.',
      'The recipe: draw it, name the variables, write the quantity you want to optimize, use the CONSTRAINT to get it down to ONE variable, then set the derivative to zero.',
      'Always check the domain. A candidate with x = 0 or a negative length is not a real answer, and the best value can sit at an endpoint of the domain.',
      'MOTION on a line: position s(t), velocity v(t) = s′(t), acceleration a(t) = v′(t). Velocity has a sign; SPEED is |v|, which never does.',
      'A particle is AT REST when v = 0, moves right when v > 0, left when v < 0. It SPEEDS UP when v and a have the same sign, and slows down when their signs differ.',
      'DISPLACEMENT is s(end) − s(start). DISTANCE adds up every leg separately, so every turn-around (where v = 0) matters.',
    ],
    examples: [
      { q: 'You have 400 m of fence for a rectangular pen. What dimensions give the largest area?', steps: ['Perimeter: 2x + 2y = 400, so y = 200 − x.', 'Area in one variable: A = x(200 − x) = 200x − x².', 'A′ = 200 − 2x = 0 gives x = 100, so y = 100.', 'A″ = −2 < 0, so this is a maximum. Area = 100 × 100 = 10,000 m².'], answer: '100 m by 100 m (a square), area 10,000 m²' },
      { q: 'A pen against a river needs fence on only three sides. With 120 m of fence, what is the largest possible area?', steps: ['Fence: 2x + y = 120, so y = 120 − 2x.', 'A = x(120 − 2x) = 120x − 2x².', 'A′ = 120 − 4x = 0 gives x = 30, and then y = 60.', 'Max area = 30 × 60 = 1800 m².'], answer: '1800 m² (30 m by 60 m)' },
      { q: 'Cut equal squares of side x from the corners of a 12 in by 12 in sheet and fold up the sides. What x gives the biggest open box?', steps: ['V = x(12 − 2x)², with 0 < x < 6.', 'Product rule: V′ = (12 − 2x)² + x·2(12 − 2x)(−2) = (12 − 2x)(12 − 6x).', 'V′ = 0 at x = 6 (no box at all) or x = 2.', 'V(2) = 2 × 8² = 128 in³, the maximum.'], answer: 'x = 2 in, volume 128 in³' },
      { q: 'A particle moves along a line with s(t) = t³ − 6t² + 9t for t ≥ 0. When is it at rest?', steps: ['v(t) = s′(t) = 3t² − 12t + 9.', 'Factor: 3(t² − 4t + 3) = 3(t − 1)(t − 3).', 'v = 0 at t = 1 and t = 3.'], answer: 't = 1 and t = 3' },
      { q: 'Same particle. At t = 4, is it speeding up or slowing down?', steps: ['v(4) = 3(16) − 48 + 9 = 9, which is positive.', 'a(t) = v′(t) = 6t − 12, so a(4) = 12, also positive.', 'Same sign, so the particle is speeding up.'], answer: 'speeding up (v = 9 and a = 12 have the same sign)' },
      { q: 'Same particle. Find the total distance traveled from t = 0 to t = 4.', steps: ['It turns around at t = 1 and t = 3, so split the trip there.', 's(0) = 0, s(1) = 4, s(3) = 0, s(4) = 4.', 'Legs: |4 − 0| + |0 − 4| + |4 − 0| = 4 + 4 + 4 = 12.', 'Displacement is only s(4) − s(0) = 4, but the distance is 12.'], answer: '12 units' },
    ],
    practice: [
      { q: 'A rectangle has perimeter 200 m. What is its largest possible area, in m²?', answers: ['2500'], steps: ['y = 100 − x, so A = x(100 − x) = 100x − x².', 'A′ = 100 − 2x = 0 gives x = 50.', '50 × 50 = 2500 m².'] },
      { q: 'A particle has position s(t) = t² − 4t. At what time t is it at rest?', answers: ['2', 't = 2'], steps: ['v(t) = 2t − 4 = 0.', 't = 2.'] },
      { q: 'Two positive numbers add to 20. What is the largest their product can be?', answers: ['100'], steps: ['P = x(20 − x) = 20x − x².', 'P′ = 20 − 2x = 0 gives x = 10.', '10 × 10 = 100.'] },
      { q: 'A particle has position s(t) = t³ − 3t. What is its acceleration at t = 2?', answers: ['12'], steps: ['v(t) = 3t² − 3, so a(t) = 6t.', 'a(2) = 12.'] },
    ],
    watchOut: 'Velocity −5 is faster than velocity 3: speed is |v|. A positive acceleration does NOT mean speeding up — compare the signs of v and a. And in optimization, a derivative of zero at x = 6 that gives a box with no volume is the minimum, not your answer.',
  },

  // ---------------- CALC Unit 11 — Riemann sums and the definite integral ----------------
  {
    domain: 'CALC', unit: 11, title: 'Riemann sums and the definite integral',
    objective: 'Estimate the area under a curve with rectangles, and define the definite integral as their limit.',
    concept: [
      'The area under a curve is hard to measure directly, so chop it into n thin RECTANGLES of width Δx = (b − a)/n and add them up. That total is a RIEMANN SUM.',
      'LEFT sum: the height of each rectangle is f at its left edge. RIGHT sum: f at its right edge. MIDPOINT sum: f at the middle. For a rising curve, left underestimates and right overestimates.',
      'As n → ∞ the rectangles get skinny and the sum settles on one number: the DEFINITE INTEGRAL ∫ₐᵇ f(x) dx.',
      'The integral is SIGNED area: a region below the x-axis counts negative. The integral of x − 2 from 0 to 2 is −2, not 2.',
      'Properties: ∫ₐᵃ f = 0, swapping the limits flips the sign, constants pull out front, and ∫ₐᵇ + ∫ᵇᶜ = ∫ₐᶜ.',
      'If f is a familiar shape — a line, a half circle — compute the integral with geometry: triangles, rectangles, circles.',
    ],
    examples: [
      { q: 'Estimate the area under f(x) = x² on [0, 2] with a LEFT Riemann sum, n = 4.', steps: ['Δx = (2 − 0)/4 = 0.5. Left edges: 0, 0.5, 1, 1.5.', 'Heights: 0, 0.25, 1, 2.25. Their sum is 3.5.', 'Area ≈ 3.5 × 0.5 = 1.75. The curve rises, so this is an underestimate.'], answer: '1.75 (an underestimate)' },
      { q: 'Same curve, same four strips, but a RIGHT Riemann sum.', steps: ['Right edges: 0.5, 1, 1.5, 2.', 'Heights: 0.25, 1, 2.25, 4. Their sum is 7.5.', 'Area ≈ 7.5 × 0.5 = 3.75, an overestimate. The true area is 8/3 ≈ 2.67, in between.'], answer: '3.75 (an overestimate)' },
      { q: 'Same curve, same four strips, but a MIDPOINT sum.', steps: ['Midpoints: 0.25, 0.75, 1.25, 1.75.', 'Heights: 0.0625, 0.5625, 1.5625, 3.0625. Their sum is 5.25.', 'Area ≈ 5.25 × 0.5 = 2.625, very close to 8/3.'], answer: '2.625' },
      { q: 'Use the TRAPEZOID rule with n = 4 on the same curve.', steps: ['A trapezoid sum is the average of the left and right sums.', '(1.75 + 3.75)/2 = 2.75.', 'Directly: (Δx/2)·[f(0) + 2f(0.5) + 2f(1) + 2f(1.5) + f(2)] = 0.25 × (0 + 0.5 + 2 + 4.5 + 4) = 0.25 × 11 = 2.75.'], answer: '2.75' },
      { q: 'A car speedometer reads 10, 14, 20 and 22 m/s at t = 0, 2, 4 and 6 s. Estimate the distance traveled with a left Riemann sum.', steps: ['Δt = 2 s. Left heights: 10, 14, 20 (the last reading is never used).', 'Distance ≈ (10 + 14 + 20) × 2 = 88 m.', 'A right sum would give (14 + 20 + 22) × 2 = 112 m; the truth is between them.'], answer: '88 m' },
      { q: 'Compute the integral of (x − 1) from 0 to 3 using geometry.', steps: ['The line crosses the axis at x = 1.', 'From 0 to 1 the triangle sits below the axis: area ½·1·1 = 0.5, counted as −0.5.', 'From 1 to 3 the triangle is above: ½·2·2 = 2.', 'Total signed area: 2 − 0.5 = 1.5.'], answer: '1.5' },
    ],
    practice: [
      { q: 'What is the left Riemann sum of f(x) = x on [0, 4] with n = 4?', answers: ['6'], steps: ['Δx = 1 and the left heights are 0, 1, 2, 3.', '(0 + 1 + 2 + 3) × 1 = 6.'] },
      { q: 'What is the right Riemann sum of f(x) = x on [0, 4] with n = 4?', answers: ['10'], steps: ['The right heights are 1, 2, 3, 4.', '(1 + 2 + 3 + 4) × 1 = 10.'] },
      { q: 'Use geometry: what is the integral of 2x from 0 to 4?', answers: ['16'], steps: ['The region is a triangle with base 4 and height 8.', '½ × 4 × 8 = 16.'] },
      { q: 'Use geometry: what is the integral of (x − 2) from 0 to 2?', answers: ['-2', '−2'], steps: ['The triangle sits below the axis, with base 2 and height 2, so its area is 2.', 'Below the axis counts negative: −2.'] },
    ],
    watchOut: 'A left sum uses f at the LEFT edge of every strip — the final right-hand value never gets used. Do not forget to multiply the sum of heights by Δx at the end. And below the axis, area counts NEGATIVE.',
  },

  // ---------------- CALC Unit 12 — Antiderivatives and the Fundamental Theorem of Calculus ----------------
  {
    domain: 'CALC', unit: 12, title: 'Antiderivatives and the Fundamental Theorem of Calculus',
    objective: 'Run differentiation backwards, and evaluate definite integrals exactly with F(b) − F(a).',
    concept: [
      'An ANTIDERIVATIVE of f is any function F with F′ = f. Since the derivative of a constant is 0, there is a whole family: F(x) + C.',
      'Reverse the power rule: the antiderivative of xⁿ is xⁿ⁺¹/(n + 1) + C for n ≠ −1. Add one to the power, then divide by the new power.',
      'The special ones: 1/x gives ln|x| + C, eˣ gives eˣ + C, cos x gives sin x + C, and sin x gives −cos x + C.',
      'FUNDAMENTAL THEOREM, part 2: ∫ₐᵇ f(x) dx = F(b) − F(a). Find any antiderivative, plug in the top limit, subtract the bottom. No rectangles needed.',
      'FUNDAMENTAL THEOREM, part 1: if g(x) = ∫ₐˣ f(t) dt, then g′(x) = f(x). Accumulating and differentiating undo each other.',
      'An INITIAL CONDITION like f(1) = 4 pins down C. The integral of a RATE gives the NET CHANGE: the integral of v(t) is displacement.',
    ],
    examples: [
      { q: 'Find the antiderivative of 3x² + 2x.', steps: ['3x² becomes 3·x³/3 = x³.', '2x becomes 2·x²/2 = x².', 'Add the constant: x³ + x² + C. Check: the derivative is 3x² + 2x.'], answer: 'x³ + x² + C' },
      { q: 'Evaluate the integral of x² from 0 to 2 exactly.', steps: ['An antiderivative is x³/3.', 'F(2) − F(0) = 8/3 − 0.', '8/3 ≈ 2.667, right between the 1.75 and 3.75 Riemann estimates from Unit 11.'], answer: '8/3' },
      { q: 'Evaluate the integral of 1/x from 1 to e.', steps: ['An antiderivative is ln|x|.', 'ln e − ln 1 = 1 − 0.', 'The answer is 1.'], answer: '1' },
      { q: 'Evaluate the integral of cos x from 0 to π/2.', steps: ['An antiderivative is sin x.', 'sin(π/2) − sin 0 = 1 − 0.', 'The answer is 1.'], answer: '1' },
      { q: 'f′(x) = 2x + 1 and f(1) = 4. Find f(x).', steps: ['Antidifferentiate: f(x) = x² + x + C.', 'Use f(1) = 4: 1 + 1 + C = 4, so C = 2.', 'f(x) = x² + x + 2.'], answer: 'f(x) = x² + x + 2' },
      { q: 'Water flows into a tank at r(t) = 4t liters per minute. How much water enters during the first 5 minutes?', steps: ['Total = integral of 4t from 0 to 5.', 'An antiderivative is 2t²: 2(25) − 2(0) = 50.', '50 liters. Geometry check: a triangle with base 5 and height 20 has area 50.'], answer: '50 liters' },
    ],
    practice: [
      { q: 'What is the integral of 4x³ from 0 to 1?', answers: ['1'], steps: ['An antiderivative is x⁴.', '1 − 0 = 1.'] },
      { q: 'What is the integral of 2x from 1 to 3?', answers: ['8'], steps: ['An antiderivative is x².', '9 − 1 = 8.'] },
      { q: 'f′(x) = 3x² and f(0) = 7. What is f(2)?', answers: ['15'], steps: ['f(x) = x³ + C, and f(0) = 7 gives C = 7.', 'f(2) = 8 + 7 = 15.'] },
      { q: 'What is the integral of sin x from 0 to π?', answers: ['2'], steps: ['An antiderivative is −cos x.', '−cos π − (−cos 0) = 1 + 1 = 2.'] },
    ],
    watchOut: 'Every indefinite integral ends with + C. The antiderivative of sin x is −cos x (minus!), while the antiderivative of cos x is sin x. And it is F(top) − F(bottom), never the other way round.',
  },

  // ---------------- CALC Unit 13 — u-substitution and area between curves ----------------
  {
    domain: 'CALC', unit: 13, title: 'u-substitution and area between curves',
    objective: 'Undo the chain rule with a substitution, and measure the region trapped between two curves.',
    concept: [
      'u-SUBSTITUTION runs the chain rule backwards. Pick u = the inside function, compute du = u′(x) dx, and rewrite the whole integral in terms of u.',
      'The test: after choosing u, the leftover factor must be (a constant times) du. The integral of 2x(x² + 1)³ works because 2x dx IS du.',
      'A missing constant is fine: if du = 2x dx but you only have x dx, write x dx = du/2 and pull the 1/2 out front.',
      'For a DEFINITE integral, change the limits too: plug the old x-limits into u. Then you never have to switch back to x.',
      'AREA BETWEEN CURVES: ∫ₐᵇ (top − bottom) dx. Find where the curves cross first — those crossings are the limits.',
      'If the curves swap places, split the integral at the crossing so each piece stays top minus bottom.',
    ],
    examples: [
      { q: 'Find the antiderivative of 2x(x² + 1)³.', steps: ['u = x² + 1, so du = 2x dx.', 'The integral becomes the integral of u³ du = u⁴/4 + C.', 'Back to x: (x² + 1)⁴/4 + C.'], answer: '(x² + 1)⁴/4 + C' },
      { q: 'Find the antiderivative of x·e^(x²).', steps: ['u = x², du = 2x dx, so x dx = du/2.', 'The integral of e^u · du/2 is (1/2)e^u + C.', 'Back to x: (1/2)e^(x²) + C.'], answer: '(1/2)e^(x²) + C' },
      { q: 'Evaluate the integral of 2x(x² + 1)³ from 0 to 1.', steps: ['u = x² + 1. New limits: x = 0 gives u = 1, x = 1 gives u = 2.', 'The integral of u³ from 1 to 2 is [u⁴/4] = 16/4 − 1/4.', '= 15/4 = 3.75.'], answer: '15/4' },
      { q: 'Find the antiderivative of cos(3x).', steps: ['u = 3x, du = 3 dx, so dx = du/3.', '(1/3) × the integral of cos u du = (1/3) sin u + C.', 'Back to x: (1/3) sin(3x) + C.'], answer: '(1/3) sin(3x) + C' },
      { q: 'Find the area between y = x and y = x² on [0, 1].', steps: ['On (0, 1) the line is on top: at x = 0.5, 0.5 > 0.25.', 'Area = integral of (x − x²) from 0 to 1 = [x²/2 − x³/3].', '= 1/2 − 1/3 = 1/6.'], answer: '1/6' },
      { q: 'Find the area enclosed by y = x + 2 and y = x².', steps: ['Crossings: x² = x + 2, so x² − x − 2 = 0, (x − 2)(x + 1) = 0: x = −1 and x = 2.', 'Between them the line is on top (test x = 0: 2 > 0).', 'Area = integral of (x + 2 − x²) from −1 to 2 = [x²/2 + 2x − x³/3].', 'At 2: 2 + 4 − 8/3 = 10/3. At −1: 1/2 − 2 + 1/3 = −7/6.', '10/3 − (−7/6) = 27/6 = 9/2 = 4.5.'], answer: '9/2' },
    ],
    practice: [
      { q: 'What is the integral of 3x²(x³ + 1)² from 0 to 1?', answers: ['7/3'], steps: ['u = x³ + 1, du = 3x² dx; the limits become 1 to 2.', '[u³/3] from 1 to 2 = 8/3 − 1/3 = 7/3.'] },
      { q: 'What is the integral of cos(5x) from 0 to π/10?', answers: ['1/5', '0.2'], steps: ['An antiderivative is (1/5) sin(5x).', '(1/5) sin(π/2) − 0 = 1/5.'] },
      { q: 'What is the area between y = 4 and y = x²?', answers: ['32/3'], steps: ['Crossings at x = ±2; the line y = 4 is on top.', 'Integral of (4 − x²) from −2 to 2 = [4x − x³/3] = (8 − 8/3) − (−8 + 8/3) = 32/3.'] },
      { q: 'What is the area between y = x and y = x³ on [0, 1]?', answers: ['1/4', '0.25'], steps: ['On (0, 1), x is above x³.', 'Integral of (x − x³) from 0 to 1 = 1/2 − 1/4 = 1/4.'] },
    ],
    watchOut: 'If you change to u, change the LIMITS too — plugging x-limits into a u-antiderivative is the classic error. And the leftover factor must match du: the integral of (x² + 1)³ dx has no 2x, so u-substitution does not apply to it.',
  },

  // ---------------- CALC Unit 14 — Volumes and accumulation ----------------
  {
    domain: 'CALC', unit: 14, title: 'Volumes (discs, washers, cross-sections) and accumulation',
    objective: 'Build volumes by integrating slice areas, and use integrals of rates to track totals over time.',
    concept: [
      'Every volume formula here is the same idea: SLICE the solid into thin pieces, find the area A(x) of one slice, and add them with V = ∫ₐᵇ A(x) dx.',
      'DISCS: revolve the region under y = f(x) around the x-axis and each slice is a disc of radius f(x): V = π∫ₐᵇ [f(x)]² dx.',
      'WASHERS: if there is a gap between the region and the axis, each slice is a ring: V = π∫ₐᵇ (R² − r²) dx with R the outer radius and r the inner radius.',
      'CROSS-SECTIONS: when slices are squares, semicircles or triangles standing on a base region, A(x) comes from the length s(x) of the slice. Squares give A = s².',
      'ACCUMULATION: amount at time t = starting amount + ∫₀ᵗ rate. The integral of a rate is the net change, not the total on hand.',
      'AVERAGE VALUE of f on [a, b] is (1/(b − a))∫ₐᵇ f(x) dx — the height of the rectangle with the same area as the region under f.',
    ],
    examples: [
      { q: 'The region under y = √x from x = 0 to 4 is revolved around the x-axis. Find the volume.', steps: ['Disc radius = √x, so A(x) = π(√x)² = πx.', 'V = π × integral of x from 0 to 4 = π[x²/2] = π × 8.', '8π ≈ 25.1 cubic units.'], answer: '8π ≈ 25.13' },
      { q: 'Revolve the region under y = x on [0, 3] around the x-axis, and check the answer with the cone formula.', steps: ['V = π × integral of x² from 0 to 3 = π[x³/3] = 9π.', 'The solid is a cone with radius 3 and height 3: (1/3)π(3²)(3) = 9π. They agree.'], answer: '9π' },
      { q: 'The region between y = x and y = x² on [0, 1] is revolved around the x-axis. Find the volume.', steps: ['Outer radius R = x (the line is higher), inner radius r = x².', 'V = π × integral of (x² − x⁴) from 0 to 1 = π[x³/3 − x⁵/5].', '= π(1/3 − 1/5) = 2π/15 ≈ 0.42.'], answer: '2π/15 ≈ 0.419' },
      { q: 'A solid has as its base the region under y = √x from 0 to 4, and cross-sections perpendicular to the x-axis are squares. Find the volume.', steps: ['Each square has side s = √x, so A(x) = (√x)² = x.', 'V = integral of x from 0 to 4 = 8.', 'No π this time — the slices are squares, not discs.'], answer: '8' },
      { q: 'A tank holds 20 L at t = 0 and water flows in at r(t) = 6t L/min. How much water is in the tank at t = 3 min?', steps: ['Amount = 20 + integral of 6t from 0 to 3.', 'Integral of 6t from 0 to 3 = [3t²] = 27.', '20 + 27 = 47 L.'], answer: '47 L' },
      { q: 'Find the average value of f(x) = x² on [0, 3].', steps: ['Average = (1/(3 − 0)) × integral of x² from 0 to 3.', 'Integral of x² from 0 to 3 = 27/3 = 9.', 'Average = 9/3 = 3. Indeed f(√3) = 3, so the function hits its average inside the interval.'], answer: '3' },
    ],
    practice: [
      { q: 'The region under y = 2 on [0, 5] is revolved around the x-axis. What is the volume? Give a multiple of π, or round to the nearest hundredth.', answers: ['20π', '20pi', '20 pi', '62.83'], steps: ['Every disc has radius 2, so A = 4π.', 'V = 4π × 5 = 20π ≈ 62.83.'] },
      { q: 'The region under y = x on [0, 2] is revolved around the x-axis. What is the volume? Give a multiple of π, or round to the nearest hundredth.', answers: ['8π/3', '8pi/3', '8 pi/3', '8.38'], steps: ['V = π × integral of x² from 0 to 2 = π × 8/3.', '8π/3 ≈ 8.38.'] },
      { q: 'A solid has as its base the region under y = x from 0 to 3, with square cross-sections perpendicular to the x-axis. What is the volume?', answers: ['9'], steps: ['A(x) = x².', 'Integral of x² from 0 to 3 = 9.'] },
      { q: 'What is the average value of f(x) = 2x on [0, 4]?', answers: ['4'], steps: ['Integral of 2x from 0 to 4 = 16.', '16/4 = 4.'] },
    ],
    watchOut: 'A washer is π(R² − r²), NOT π(R − r)² — square each radius before subtracting. And accumulation starts from the initial amount: the integral gives the CHANGE, so add what was already there.',
  },
];
