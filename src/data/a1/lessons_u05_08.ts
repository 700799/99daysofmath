import type { Lesson } from '../lessons';

// A1 Units 5-8: Functions, Slope & rate of change, Graphing y = mx + b,
// Writing line equations. Plain text with unicode ×, −, ² — no KaTeX here.

export const A1_LESSONS_U05_08: Lesson[] = [
  // ---------------- Unit 5 — Functions ----------------
  {
    domain: 'A1', unit: 5, title: 'Functions: the input-output machine',
    objective: 'Evaluate functions using f(x) notation.',
    concept: [
      'A FUNCTION is a MACHINE: one input goes in, exactly ONE output comes out — like a vending machine button giving one snack.',
      'f(x) is just the machine\'s NAME and its input slot: f(3) means "feed the machine a 3".',
      'To evaluate, REPLACE every x with the input number, then do the arithmetic.',
      'The DOMAIN is the set of allowed inputs; the RANGE is the set of possible outputs.',
      'If one input could give two different outputs, it is NOT a function — a vertical line through a graph must hit it only once.',
    ],
    examples: [
      {
        q: 'f(x) = 2x. Find f(7).',
        steps: ['f(7) means feed the machine a 7 — replace x with 7.', 'f(7) = 2 × 7 = 14.'],
        answer: '14',
      },
      {
        q: 'f(x) = 3x + 2. Find f(4).',
        steps: ['Replace x with 4: f(4) = 3 × 4 + 2.', 'Multiply first: 3 × 4 = 12.', 'Add: 12 + 2 = 14.'],
        answer: '14',
      },
      {
        q: 'Each quiz question is worth 4 points, so f(q) = 4q. Find f(5).',
        steps: ['The machine turns questions into points: multiply by 4.', 'f(5) = 4 × 5 = 20 points.'],
        answer: '20',
      },
      {
        q: 'g(x) = 10 − 2x. Find g(3).',
        steps: ['Replace x with 3: g(3) = 10 − 2 × 3.', 'Multiply first: 2 × 3 = 6.', 'Subtract: 10 − 6 = 4.'],
        answer: '4',
      },
    ],
    practice: [
      {
        q: 'f(x) = 5x. What is f(6)?',
        answers: ['30'],
        steps: ['Feed in a 6: f(6) = 5 × 6 = 30.'],
      },
      {
        q: 'f(x) = 2x + 1. What is f(10)?',
        answers: ['21'],
        steps: ['Replace x with 10: 2 × 10 = 20.', 'Add 1: 20 + 1 = 21.'],
      },
      {
        q: 'f(x) = 4x. If the output is 32, what was the input?',
        answers: ['8'],
        steps: ['Run the machine backward: undo "times 4".', '32 ÷ 4 = 8.'],
      },
    ],
    watchOut: 'f(3) does NOT mean f times 3 — it means "the output of machine f when the input is 3".',
  },

  // ---------------- Unit 6 — Slope & rate of change ----------------
  {
    domain: 'A1', unit: 6, title: 'Slope: the steepness number',
    objective: 'Find slope as rise over run.',
    concept: [
      'SLOPE is a STAIRCASE number: RISE over RUN — how much you go UP for each step ACROSS.',
      'From two points, slope = (y2 − y1) ÷ (x2 − x1) — change in y over change in x.',
      'Uphill lines have POSITIVE slope, downhill lines have NEGATIVE slope, and flat lines have slope 0.',
      'Slope is a real-life RATE: dollars per hour, percent per hour, centimeters per week.',
    ],
    examples: [
      {
        q: 'A ramp rises 2 ft over a run of 8 ft. Find the slope.',
        steps: ['Slope = rise over run = 2/8.', 'Simplify: divide top and bottom by 2.', 'Slope = 1/4 — a gentle ramp.'],
        answer: '1/4',
      },
      {
        q: 'Find the slope through (1, 2) and (3, 8).',
        steps: ['Rise: 8 − 2 = 6.', 'Run: 3 − 1 = 2.', 'Slope = 6 ÷ 2 = 3.'],
        answer: '3',
      },
      {
        q: 'Your phone battery drops from 80% to 56% in 2 hours. Find the rate per hour.',
        steps: ['Total drop: 80 − 56 = 24 percent.', 'Per hour: 24 ÷ 2 = 12.', 'The battery falls 12% per hour — a slope of −12 on the graph.'],
        answer: '12',
      },
      {
        q: 'Find the slope through (0, 10) and (5, 0).',
        steps: ['Rise: 0 − 10 = −10 — the line falls.', 'Run: 5 − 0 = 5.', 'Slope = −10 ÷ 5 = −2. Downhill!'],
        answer: '-2',
      },
    ],
    practice: [
      {
        q: 'A line rises 10 over a run of 5. Slope?',
        answers: ['2'],
        steps: ['10 ÷ 5 = 2.'],
      },
      {
        q: 'Find the slope through (2, 3) and (4, 11).',
        answers: ['4'],
        steps: ['Rise: 11 − 3 = 8.', 'Run: 4 − 2 = 2.', 'Slope = 8 ÷ 2 = 4.'],
      },
      {
        q: 'You earn $18 for 3 dog walks. Dollars per walk?',
        answers: ['6', '$6'],
        steps: ['18 ÷ 3 = 6 dollars per walk.'],
      },
    ],
    watchOut: 'Subtract the coordinates in the SAME order — (y2 − y1) over (x2 − x1), never mixed.',
  },

  // ---------------- Unit 7 — Graphing lines: y = mx + b ----------------
  {
    domain: 'A1', unit: 7, title: 'y = mx + b: start, then move',
    objective: 'Graph lines using slope and intercept.',
    concept: [
      'In y = mx + b, b is where you START (the y-intercept) and m is how you MOVE (the slope).',
      'To graph: plot the START (0, b) on the y-axis, then use m as RISE over RUN to step to the next point.',
      'Read m and b straight off the equation: in y = 3x − 4, m = 3 and b = −4 (the minus belongs to the 4).',
      'No x in the equation? y = 3 is a HORIZONTAL line: slope 0, always at height 3.',
    ],
    examples: [
      {
        q: 'For y = 5x + 2, name the slope and the y-intercept.',
        steps: ['Match to y = mx + b.', 'The number multiplying x is the slope: m = 5.', 'The number added at the end is the start: b = 2.'],
        answer: 'slope 5, y-intercept 2',
      },
      {
        q: 'Graph y = 3x + 2: after plotting (0, 2), you move right 1. Where do you land?',
        steps: ['Slope 3 means rise 3 over run 1: right 1, up 3.', 'Start at height 2, climb 3: 2 + 3 = 5.', 'You land on (1, 5).'],
        answer: '(1, 5)',
      },
      {
        q: 'A scooter ride costs y = 2 + 0.15m dollars for m minutes. What does a 20-minute ride cost?',
        steps: ['START: the $2 unlock fee. MOVE: $0.15 per minute.', 'Riding part: 0.15 × 20 = 3 dollars.', 'Total: 2 + 3 = $5.'],
        answer: '$5',
      },
      {
        q: 'A plant follows h = 4 + 3w (cm after w weeks). How tall at week 5?',
        steps: ['Start at 4 cm, grow 3 cm per week.', 'Growth: 3 × 5 = 15 cm.', 'Height: 4 + 15 = 19 cm.'],
        answer: '19',
      },
    ],
    practice: [
      {
        q: 'What is the y-intercept of y = 7x − 3?',
        answers: ['-3', '−3'],
        steps: ['b is the number added at the end: −3.', 'The minus sign stays with the 3.'],
      },
      {
        q: 'For y = 2x + 1, what is y when x = 4?',
        answers: ['9'],
        steps: ['2 × 4 = 8.', '8 + 1 = 9.'],
      },
      {
        q: 'Savings follow s = 15 + 5w. Dollars after 6 weeks?',
        answers: ['45', '$45'],
        steps: ['5 × 6 = 30 dollars added.', '15 + 30 = 45.'],
      },
    ],
    watchOut: 'Do not swap m and b — the slope is the number STUCK TO x, not the number standing alone.',
  },

  // ---------------- Unit 8 — Writing line equations ----------------
  {
    domain: 'A1', unit: 8, title: 'Write the equation of a line',
    objective: 'Write line equations from clues.',
    concept: [
      'Every line is a START plus a MOVE: fill the template y = mx + b with the slope m and the start b.',
      'From a TABLE: the constant JUMP in y (per step of 1 in x) is m; the value at x = 0 is b.',
      'From TWO POINTS: find m = (y2 − y1) ÷ (x2 − x1) first, then plug one point in to find b.',
      'From a STORY: the one-time amount (fee, starting height) is b; the "per hour / per month" amount is m — negative if it shrinks.',
      'Always CHECK: plug a known point into your equation and see if it works.',
    ],
    examples: [
      {
        q: 'Slope 5, y-intercept 1. Write the equation.',
        steps: ['Template: y = mx + b.', 'Drop in m = 5 and b = 1.', 'y = 5x + 1.'],
        answer: 'y = 5x + 1',
      },
      {
        q: 'A table shows x: 0, 1, 2 and y: 3, 8, 13. Write the equation.',
        steps: ['Find the jump: 8 − 3 = 5, and 13 − 8 = 5, so m = 5.', 'Find the start: at x = 0, y = 3, so b = 3.', 'y = 5x + 3. Check x = 2: 5 × 2 + 3 = 13. It works!'],
        answer: 'y = 5x + 3',
      },
      {
        q: 'A candle starts 20 cm tall and burns 2 cm per hour. Write the height equation.',
        steps: ['Start: b = 20 cm.', 'Move: it LOSES 2 cm per hour, so m = −2.', 'h = 20 − 2t.'],
        answer: 'h = 20 − 2t',
      },
      {
        q: 'A line passes through (1, 5) and (3, 11). Write the equation.',
        steps: ['Slope: (11 − 5) ÷ (3 − 1) = 6 ÷ 2 = 3.', 'Find b using (1, 5): 5 = 3 × 1 + b, so b = 2.', 'y = 3x + 2. Check (3, 11): 3 × 3 + 2 = 11. Correct.'],
        answer: 'y = 3x + 2',
      },
    ],
    practice: [
      {
        q: 'Slope 2, y-intercept 9. Write the equation.',
        answers: ['y = 2x + 9', 'y=2x+9', '2x + 9', '2x+9'],
        steps: ['Fill the template y = mx + b with m = 2 and b = 9.'],
      },
      {
        q: 'A gym charges a $25 sign-up fee plus $10 per month. Equation for total cost y after x months?',
        answers: ['y = 10x + 25', 'y=10x+25', '10x + 25', '10x+25', 'y = 25 + 10x', 'y=25+10x'],
        steps: ['One-time fee is the start: b = 25.', 'Monthly charge is the move: m = 10.', 'y = 10x + 25.'],
      },
      {
        q: 'A table shows x: 0, 1, 2 and y: 7, 10, 13. Write the equation.',
        answers: ['y = 3x + 7', 'y=3x+7', '3x + 7', '3x+7', 'y = 7 + 3x', 'y=7+3x'],
        steps: ['Jump: 10 − 7 = 3, so m = 3.', 'Start at x = 0: b = 7.', 'y = 3x + 7.'],
      },
    ],
    watchOut: 'In a story, do not swap the roles — the one-time fee is b (the start), and the per-month or per-hour amount is m (the move), not the other way around.',
  },
];
