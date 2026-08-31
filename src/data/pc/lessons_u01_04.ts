import type { Lesson } from '../lessons';

// Precalculus, Units 1-4: functions & transformations, composite & inverse
// functions, polynomial functions, and rational functions.

export const PC_LESSONS_U01_04: Lesson[] = [
  // ---------------- PC Unit 1 — Functions & transformations ----------------
  {
    domain: 'PC', unit: 1, title: 'Functions & transformations',
    objective: 'Slide, stretch, and flip parent graphs.',
    concept: [
      'A graph is a STICKER on a window: you can slide it, stretch it, or flip it, but its shape stays the same.',
      'The PARENT FUNCTIONS are the plain stickers: the line y = x, the parabola y = x², the V of y = |x|, and the curve y = √x.',
      'OUTSIDE the function moves it up and down: f(x) + k slides the graph UP k units.',
      'INSIDE the function moves it left and right: f(x − h) slides the graph RIGHT h units — minus moves RIGHT, the sneaky one.',
      'A number in front STRETCHES: a·f(x) multiplies every height by a, so the graph gets taller and skinnier.',
      'A minus in front FLIPS: −f(x) turns the whole sticker upside down over the x-axis.',
    ],
    examples: [
      { q: 'The parabola y = x² becomes y = x² + 5. Which way and how far does it move?', steps: ['The +5 is OUTSIDE the square, so it changes every y-value.', 'The bottom point moves from (0, 0) to (0, 5).', 'The whole graph slides UP 5.'], answer: 'up 5' },
      { q: 'In a video game a sprite follows y = x². The code changes to y = (x − 7)². How far does the path move?', steps: ['The −7 is INSIDE the parentheses, so the move is sideways.', 'Set the inside to zero: x − 7 = 0, so x = 7.', 'The path slides RIGHT 7 units.'], answer: 'right 7' },
      { q: 'The point (1, 1) sits on y = x². Where is it on y = 4x²?', steps: ['A number in front stretches every height.', 'At x = 1, y = 4 × 1² = 4.', 'The point moves from (1, 1) to (1, 4).'], answer: '(1, 4)' },
      { q: 'A skate ramp curves like y = √x. Builders raise it 3 feet. Write the new rule.', steps: ['Raising the whole shape is a vertical slide, so the change goes OUTSIDE.', 'Add 3 to every output.', 'New rule: y = √x + 3.'], answer: 'y = √x + 3' },
      { q: 'What is the vertex of y = 2(x − 3)² + 5?', steps: ['The inside decides left-right: x − 3 = 0 gives x = 3.', 'The +5 lifts it, so y = 5.', 'Vertex: (3, 5).'], answer: '(3, 5)' },
    ],
    practice: [
      { q: 'The graph of y = |x| becomes y = |x| − 4. What is the y-coordinate of the point of the V?', answers: ['-4', '−4'], steps: ['The −4 is outside the bars, so every point drops 4.', 'The point moves from (0, 0) to (0, −4).', 'The y-coordinate is −4.'] },
      { q: 'For y = (x + 4)² − 6, what is the x-coordinate of the lowest point?', answers: ['-4', '−4'], steps: ['Set the inside to zero: x + 4 = 0.', 'A PLUS inside moves the graph LEFT.', 'x = −4.'] },
      { q: 'What is the greatest y-value the graph y = −|x| + 7 ever reaches?', answers: ['7'], steps: ['The minus in front flips the V upside down, so its tip is now the top.', 'At x = 0, y = 0 + 7 = 7.', 'The highest value is 7.'] },
    ],
    watchOut: 'f(x − 3) slides the graph RIGHT 3, not left. The minus sign inside always moves the sticker the OPPOSITE way from what the sign looks like.',
  },

  // ---------------- PC Unit 2 — Composite & inverse functions ----------------
  {
    domain: 'PC', unit: 2, title: 'Composite & inverse functions',
    objective: 'Chain functions and undo them.',
    concept: [
      'A COMPOSITE runs two MACHINES in a row: in f(g(x)), the INSIDE machine g goes first.',
      'Work INSIDE-OUT, exactly like nested boxes — open the small box before the big one.',
      'ORDER MATTERS: f(g(x)) is usually NOT the same as g(f(x)).',
      'An INVERSE is the UNDO machine: swap x and y, then solve for y.',
      'Undo the steps in REVERSE order — socks then shoes, so shoes off then socks off.',
    ],
    examples: [
      { q: 'f(x) = x + 4, g(x) = 3x. Find f(g(2)).', steps: ['Inside first: g(2) = 3 × 2 = 6.', 'Then f(6) = 6 + 4 = 10.'], answer: '10' },
      { q: 'Same functions. Find g(f(2)).', steps: ['Now f is inside: f(2) = 2 + 4 = 6.', 'Then g(6) = 3 × 6 = 18.', 'Different order, different answer.'], answer: '18' },
      { q: 'Dollars → euros is e(d) = 0.9d. Euros → yen is y(e) = 160e. Start with $50. How many yen?', steps: ['Inside machine first: 0.9 × 50 = 45 euros.', 'Feed 45 into the yen machine: 160 × 45 = 7200.'], answer: '7200 yen' },
      { q: 'f(x) = 2x + 1. Find the inverse rule.', steps: ['Write y = 2x + 1, then swap: x = 2y + 1.', 'Subtract 1: x − 1 = 2y.', 'Divide by 2: y = (x − 1) ÷ 2.'], answer: 'f⁻¹(x) = (x − 1) ÷ 2' },
      { q: 'A jacket costs $80. Take 25% off, then add 10% tax. Final price?', steps: ['Discount machine: 0.75 × 80 = $60.', 'Tax machine: 60 + 10% of 60 = 60 + 6.', 'Final: $66.'], answer: '$66' },
    ],
    practice: [
      { q: 'f(x) = 2x and g(x) = x + 1. What is f(g(3))?', answers: ['8'], steps: ['g(3) = 4.', 'f(4) = 8.'] },
      { q: 'f(x) = x + 9. What is f⁻¹(20)?', answers: ['11'], steps: ['f adds 9, so the undo machine subtracts 9.', '20 − 9 = 11.'] },
      { q: 'A store takes 20% off a price, then adds $5 shipping. You paid $45. What was the original price?', answers: ['50', '$50'], steps: ['Undo backwards: take off shipping first, 45 − 5 = 40.', '$40 is 80% of the original.', '40 ÷ 0.8 = $50.'] },
    ],
    watchOut: 'f(g(x)) is NOT g(f(x)) — the order of the machines changes the answer. And when you undo a chain, undo the LAST step first.',
  },

  // ---------------- PC Unit 3 — Polynomial functions ----------------
  {
    domain: 'PC', unit: 3, title: 'Polynomial functions',
    objective: 'Read zeros and end behavior from factors.',
    concept: [
      'The DEGREE is the biggest exponent, and the LEADING COEFFICIENT is the number in front of that term.',
      'Together they decide the END BEHAVIOR — where the two ARMS of the graph point.',
      'EVEN degree: both arms point the SAME way. ODD degree: the arms point OPPOSITE ways.',
      'A POSITIVE leading coefficient sends the right arm UP; a negative one sends the right arm DOWN.',
      'ZEROS are x-intercepts: set each factor equal to zero. A factor (x − r) hides the zero r — the sign flips.',
      'MULTIPLICITY tells you bounce or cross: an EVEN exponent makes the graph BOUNCE off the axis, an ODD one makes it CROSS.',
      'To BUILD a polynomial from zeros, turn each zero r into the factor (x − r) and multiply them together.',
    ],
    examples: [
      { q: 'What is the degree of p(x) = 4x³ − 2x + 7?', steps: ['List the powers of x: 3, 1, and 0.', 'The biggest is 3.'], answer: '3' },
      { q: 'Find the zeros of p(x) = (x − 5)(x + 2).', steps: ['Set each factor to zero.', 'x − 5 = 0 gives x = 5.', 'x + 2 = 0 gives x = −2.'], answer: 'x = 5 and x = −2' },
      { q: 'Where do the arms of p(x) = −2x⁴ + 3x point?', steps: ['Only the leading term −2x⁴ matters.', 'Degree 4 is even, so both arms match.', 'The −2 is negative, so both arms point DOWN.'], answer: 'both arms down' },
      { q: 'A roller-coaster track is h(x) = −(x − 2)(x − 8). Where does it touch the ground?', steps: ['Height is zero when a factor is zero.', 'x − 2 = 0 gives x = 2; x − 8 = 0 gives x = 8.', 'It touches down at x = 2 and x = 8.'], answer: 'x = 2 and x = 8' },
      { q: 'Build a polynomial with only the zeros 4 and −3.', steps: ['Zero 4 becomes the factor (x − 4).', 'Zero −3 becomes (x − (−3)) = (x + 3).', 'Multiply: (x − 4)(x + 3).'], answer: '(x − 4)(x + 3)' },
    ],
    practice: [
      { q: 'How many real zeros does p(x) = (x − 1)(x − 4)(x + 3) have?', answers: ['3', 'three'], steps: ['Each factor gives one zero: 1, 4, and −3.', 'All three are different, so there are 3 real zeros.'] },
      { q: 'For p(x) = (x − 3)²(x + 1), at which x does the graph BOUNCE off the x-axis?', answers: ['3', 'x = 3'], steps: ['The exponent on (x − 3) is 2, which is even.', 'Even multiplicity means the graph touches and bounces.', 'The bounce is at x = 3.'] },
      { q: 'You cut squares of side x from a 12-by-12 inch cardboard and fold up the sides, so V(x) = x(12 − 2x)². What is V(2)?', answers: ['128', '128 cubic inches'], steps: ['Inside: 12 − 2(2) = 8.', 'Square it: 8² = 64.', '2 × 64 = 128 cubic inches.'] },
    ],
    watchOut: 'A factor of (x − 5) means the zero is +5, not −5 — the sign flips when you solve. And a repeated factor is still ONE spot on the x-axis, so do not count it twice.',
  },

  // ---------------- PC Unit 4 — Rational functions ----------------
  {
    domain: 'PC', unit: 4, title: 'Rational functions',
    objective: 'Find zeros, asymptotes, and holes.',
    concept: [
      'A RATIONAL FUNCTION is just one polynomial sitting on top of another, like a big fraction.',
      'ZEROS come from the TOP: a fraction equals zero only when its numerator equals zero.',
      'VERTICAL ASYMPTOTES come from the BOTTOM: you can never divide by zero, so the graph RUNS AWAY from that line.',
      'For a HORIZONTAL ASYMPTOTE, compare degrees: bottom bigger → y = 0; degrees tied → divide the leading coefficients; top bigger → no horizontal asymptote.',
      'A HOLE appears where a factor cancels from both top and bottom — one single missing dot, not a runaway line.',
      'Always CANCEL first, then decide which bad x-values are holes and which are asymptotes.',
    ],
    examples: [
      { q: 'Find the vertical asymptote of f(x) = 1 ÷ (x − 6).', steps: ['Vertical asymptotes come from the bottom.', 'Set x − 6 = 0.', 'x = 6 is the line the graph runs away from.'], answer: 'x = 6' },
      { q: 'For f(x) = (x − 2) ÷ (x + 5), what x makes f(x) = 0?', steps: ['Zeros come from the top.', 'Set x − 2 = 0.', 'x = 2, and f(2) = 0 ÷ 7 = 0.'], answer: 'x = 2' },
      { q: 'You split a $120 pizza bill among n friends: c(n) = 120 ÷ n. What does each of 8 friends pay?', steps: ['Substitute n = 8.', '120 ÷ 8 = 15.', 'Each friend pays $15.'], answer: '$15' },
      { q: 'Find the horizontal asymptote of f(x) = (3x² + 1) ÷ (x² − 4).', steps: ['Top degree 2, bottom degree 2 — a tie.', 'On a tie, divide the leading numbers: 3 ÷ 1.', 'The asymptote is y = 3.'], answer: 'y = 3' },
      { q: 'Where is the hole in f(x) = (x − 3)(x + 1) ÷ [(x − 3)(x − 6)]?', steps: ['The factor (x − 3) is on top AND bottom, so it cancels.', 'A cancelled factor leaves a hole.', 'The hole is at x = 3.'], answer: 'x = 3' },
    ],
    practice: [
      { q: 'For the pizza cost c(n) = 120 ÷ n, what number does the cost per person get close to as n gets huge?', answers: ['0', 'zero'], steps: ['120 friends pay $1 each; 1200 friends pay 10 cents each.', 'The share keeps shrinking.', 'It heads toward 0, the horizontal asymptote.'] },
      { q: 'What is the horizontal asymptote of f(x) = (2x + 1) ÷ (x² + 5)?', answers: ['0', 'y = 0'], steps: ['Top degree 1, bottom degree 2.', 'The bottom grows faster and squashes the fraction.', 'The asymptote is y = 0.'] },
      { q: 'How many vertical asymptotes does f(x) = (x + 2) ÷ [(x − 1)(x + 2)(x − 7)] have?', answers: ['2', 'two'], steps: ['The (x + 2) cancels, so x = −2 is a hole, not an asymptote.', 'What is left on the bottom is (x − 1)(x − 7).', 'That is 2 vertical asymptotes: x = 1 and x = 7.'] },
    ],
    watchOut: 'A bottom factor that CANCELS makes a hole, not a vertical asymptote. Cancel first, then count — otherwise you will count a hole as a runaway line.',
  },
];
