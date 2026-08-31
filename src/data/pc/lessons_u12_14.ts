import type { Lesson } from '../lessons';

// PC Units 12-14 — the finale: Law of Sines & Law of Cosines, Sequences &
// series, and the doorway to calculus (limits & rate of change).
export const PC_LESSONS_U12_14: Lesson[] = [
  {
    domain: 'PC', unit: 12, title: 'Law of Sines & Law of Cosines',
    objective: 'Solve triangles that are not right triangles.',
    concept: [
      'Not every triangle has a square corner, but EVERY triangle still obeys rules. Think of these two laws as a TOOLBOX: you pick the tool that fits what you were handed.',
      'The LAW OF SINES pairs each side with the angle ACROSS from it: a ÷ sin A = b ÷ sin B. Reach for it when you have a matching side-and-angle PAIR.',
      'The LAW OF COSINES is the Pythagorean theorem with a CORRECTION TERM: c² = a² + b² − 2ab × cos C. Reach for it for SAS (two sides and the angle between) or SSS (all three sides).',
      'When C = 90°, cos C = 0 and the correction vanishes — Pythagoras is just the Law of Cosines on its best day. A corner narrower than 90° pulls the far side IN; a wider corner pushes it OUT.',
    ],
    examples: [
      {
        q: 'In triangle ABC, angle A = 30°, angle B = 90°, and side b = 10. Find side a.',
        steps: [
          'You have a matching pair: side b sits across from angle B. Reach for the Law of Sines.',
          'a ÷ sin 30° = 10 ÷ sin 90°.',
          'sin 90° = 1, so the right side is just 10. And sin 30° = 0.5.',
          'a = 10 × 0.5.',
        ],
        answer: 'a = 5',
      },
      {
        q: 'A triangle has sides a = 3 and b = 8 with a 60° angle between them. Find side c.',
        steps: [
          'Two sides and the angle squeezed between them is SAS — that is the Law of Cosines.',
          'c² = 3² + 8² − 2 × 3 × 8 × cos 60°.',
          'Pythagoras part: 9 + 64 = 73. Correction: 2 × 3 × 8 × 0.5 = 24.',
          'c² = 73 − 24 = 49, so c = √49.',
        ],
        answer: 'c = 7',
      },
      {
        q: 'A triangle has sides 3, 5, and 7. Find the angle across from the side of length 7.',
        steps: [
          'All three sides, no angles: SSS means Law of Cosines, solved for the angle.',
          'Put 7 in the c spot: 49 = 9 + 25 − 2 × 3 × 5 × cos C.',
          '49 = 34 − 30 cos C, so 30 cos C = 34 − 49 = −15.',
          'cos C = −0.5, and a negative cosine means an obtuse angle.',
        ],
        answer: 'C = 120°',
      },
      {
        q: 'Two friends stand 100 m apart and both look at a drone. Friend A sights it at 30°, friend B at 60°, so the drone corner is 90°. How far is the drone from friend B?',
        steps: [
          'The 100 m gap sits across the 90° drone angle — that is your matching pair.',
          'The B-to-drone side sits across from angle A = 30°.',
          'a ÷ sin 30° = 100 ÷ sin 90° = 100.',
          'a = 100 × 0.5. Check: the smallest side should face the smallest angle, and it does.',
        ],
        answer: '50 m',
      },
    ],
    practice: [
      {
        q: 'A boat sails 5 km, turns so the inside angle is 120°, then sails 16 km. How far is it from the start, in km?',
        answers: ['19', '19 km'],
        steps: ['SAS, so Law of Cosines: c² = 25 + 256 − 2(5)(16)cos 120°.', 'cos 120° = −0.5, and subtracting a negative ADDS: c² = 281 + 80 = 361.', 'c = √361 = 19 km.'],
      },
      {
        q: 'A triangle has sides 5, 12, and 13. What is the angle across from the 13, in degrees?',
        answers: ['90', '90°', '90 degrees'],
        steps: ['169 = 25 + 144 − 2(5)(12)cos C, which is 169 = 169 − 120 cos C.', 'So 120 cos C = 0 and cos C = 0.', 'The angle with cosine 0 is 90° — the correction term vanished, so it is a right triangle.'],
      },
      {
        q: 'Two paths leave one corner of a park, 30 m and 80 m long, with 60° between them. How far apart are their far ends, in meters?',
        answers: ['70', '70 m'],
        steps: ['c² = 900 + 6400 − 2(30)(80)(0.5) = 7300 − 2400.', 'c² = 4900.', 'c = 70 m.'],
      },
    ],
    watchOut: 'In the Law of Cosines the angle you use must be the one BETWEEN the two sides you squared — pairing it with the wrong corner is the mistake that ruins the answer.',
  },
  {
    domain: 'PC', unit: 13, title: 'Sequences & series',
    objective: 'Find terms and sums of sequences.',
    concept: [
      'A SEQUENCE is an ordered list with a rule; a SERIES is what you get when you ADD that list up.',
      'ARITHMETIC sequences ADD the same amount each step: term n = first + (n − 1) × d.',
      'GEOMETRIC sequences MULTIPLY by the same factor each step: term n = first × r^(n−1).',
      'To add an arithmetic list fast, PAIR THE ENDS — the trick young Gauss used: sum = n × (first + last) ÷ 2. And a SHRINKING geometric series creeps toward a limit instead of running away.',
    ],
    examples: [
      {
        q: 'Find the next term of 3, 7, 11, 15, …',
        steps: [
          'Check the gaps: 7 − 3 = 4, 11 − 7 = 4, 15 − 11 = 4.',
          'Same gap every time, so the list is ARITHMETIC with d = 4.',
          'Keep the rule going: 15 + 4.',
        ],
        answer: '19',
      },
      {
        q: 'An arithmetic sequence starts at 5 and adds 4 each step. Find term 10.',
        steps: [
          'Use term n = first + (n − 1) × d.',
          'To reach term 10 you take 10 − 1 = 9 jumps, not 10 — term 1 has taken zero jumps.',
          '5 + 9 × 4 = 5 + 36.',
        ],
        answer: '41',
      },
      {
        q: 'Cans are stacked with 20 in the bottom row, one fewer in each row up, and 1 on top. How many cans in all?',
        steps: [
          'The rows are 20, 19, 18, …, 1 — arithmetic, so PAIR THE ENDS.',
          '20 + 1 = 21, 19 + 2 = 21, 18 + 3 = 21 — every pair makes 21.',
          '20 rows make 10 pairs: 10 × 21. The shortcut says the same: 20 × (20 + 1) ÷ 2.',
        ],
        answer: '210 cans',
      },
      {
        q: 'A ball rises 16 cm, then 8, then 4, and so on forever. What is the total rise?',
        steps: [
          'Geometric with first = 16 and r = 0.5 — the terms SHRINK.',
          'Watch the running total: 16, 24, 28, 30, 31, 31.5 — each bounce closes half the remaining gap.',
          'For a shrinking series the total is first ÷ (1 − r) = 16 ÷ 0.5.',
        ],
        answer: '32 cm',
      },
    ],
    practice: [
      {
        q: 'Row 1 of a theatre has 12 seats and each row after has 3 more. How many seats are in row 20?',
        answers: ['69', '69 seats'],
        steps: ['Arithmetic with first = 12 and d = 3.', 'Row 20 has taken 19 jumps: 19 × 3 = 57.', '12 + 57 = 69 seats.'],
      },
      {
        q: 'Add every whole number from 1 to 100.',
        answers: ['5050', '5,050'],
        steps: ['Pair the ends: 1 + 100 = 101, 2 + 99 = 101, and so on.', '100 numbers make 50 pairs.', '50 × 101 = 5050.'],
      },
      {
        q: 'A geometric sequence starts at 3 with r = 2. What is term 8?',
        answers: ['384'],
        steps: ['term n = 3 × 2^(n−1), and term 8 uses the exponent 7.', '2^7 = 128.', '3 × 128 = 384.'],
      },
    ],
    watchOut: 'Term n uses (n − 1) jumps, not n — the first term has taken zero jumps, so never multiply by n itself.',
  },
  {
    domain: 'PC', unit: 14, title: 'Intro to limits & rate of change',
    objective: 'Find limits and rates of change.',
    concept: [
      'A LIMIT asks one question: WHERE IS THIS HEADING? It is the value a function approaches, even if it never actually lands there.',
      'If the rule is smooth and unbroken, just SUBSTITUTE. If you get 0 ÷ 0, that is a signal to keep working: FACTOR and cancel, which reveals a HOLE in the graph.',
      'AVERAGE RATE OF CHANGE is the slope between two points: rise ÷ run. It is the trip summary — like a car\'s average speed.',
      'SQUEEZE the two points together and the average points at the INSTANT rate — the speedometer reading right now. Zoom in far enough and any smooth curve looks like a straight line. That squeeze is the doorway to calculus.',
    ],
    examples: [
      {
        q: 'As x → 2, what does 3x + 1 approach?',
        steps: [
          'The rule is a straight line — no holes, no breaks near x = 2.',
          'When nothing is broken, the limit is just the value. Walk right in and substitute.',
          '3(2) + 1 = 6 + 1.',
        ],
        answer: '7',
      },
      {
        q: 'Find the limit of (x² − 9) ÷ (x − 3) as x → 3.',
        steps: [
          'Substituting gives 0 ÷ 0 — a signal, not an answer.',
          'Factor the top as a difference of squares: (x − 3)(x + 3).',
          'Cancel the shared (x − 3), leaving x + 3 everywhere except at the hole.',
          'Now substitute: 3 + 3.',
        ],
        answer: '6',
      },
      {
        q: 'A car is 30 km from home at 1 hour and 150 km at 3 hours. Find its average speed.',
        steps: [
          'Average rate of change = change in distance ÷ change in time.',
          'Distance changed by 150 − 30 = 120 km.',
          'Time changed by 3 − 1 = 2 hours.',
          '120 ÷ 2. This is the trip summary, not the speedometer.',
        ],
        answer: '60 km per hour',
      },
      {
        q: 'For f(x) = x², the average rates from x = 3 to 3.1, 3.01, and 3.001 are 6.1, 6.01, 6.001. What is the instant rate at x = 3?',
        steps: [
          'Each time the second point slides ten times closer, the leftover shrinks ten times.',
          'The leftovers 0.1, 0.01, 0.001 are being squeezed to nothing.',
          'Check with algebra: over a step h the rate is ((3 + h)² − 9) ÷ h = 6 + h, and h → 0.',
        ],
        answer: '6',
      },
    ],
    practice: [
      {
        q: 'Find the limit of (x² − 7x + 10) ÷ (x − 2) as x → 2.',
        answers: ['-3', '−3'],
        steps: ['Substituting gives 0 ÷ 0, so factor: (x − 2)(x − 5).', 'Cancel (x − 2), leaving x − 5.', 'Substitute: 2 − 5 = −3.'],
      },
      {
        q: 'A room\'s temperature after t hours is T = 18 + 6 ÷ t. What is it settling toward as t grows huge?',
        answers: ['18', '18°', '18 degrees'],
        steps: ['A fixed top over a growing bottom fades: 6 ÷ 60 = 0.1, then 6 ÷ 600 = 0.01.', 'That piece heads to 0.', 'So T heads to 18 + 0 = 18 degrees.'],
      },
      {
        q: 'For f(x) = x², find the average rate of change from x = 1 to x = 4.',
        answers: ['5'],
        steps: ['f(1) = 1 and f(4) = 16.', 'Rise = 16 − 1 = 15, run = 4 − 1 = 3.', '15 ÷ 3 = 5.'],
      },
    ],
    watchOut: 'Getting 0 ÷ 0 does not mean the limit is 0 or that there is no answer — it means a factor still needs cancelling.',
  },
];
