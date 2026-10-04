import type { Lesson } from '../lessons';

// 5.F — Grade-5 Foundations, Units 7-16: multi-digit multiplication and
// division, powers of ten, decimal operations, fractions as division, fraction
// word problems, expressions, patterns, measurement and volume, and the
// coordinate plane with shapes. Written for a 10-11-year-old.

export const F5_LESSONS_U07_16: Lesson[] = [
  // ---------------- 5.F Unit 7 — Multi-digit multiplication and division ----------------
  {
    domain: '5.F', unit: 7, title: 'Multiplying & dividing big numbers',
    objective: 'Multiply multi-digit numbers and divide by two-digit numbers.',
    concept: [
      'BREAK IT UP: 142 × 20 is 142 × 2, then × 10. Easy pieces, same answer.',
      'The AREA MODEL splits each number by place value: 203 × 12 = 203 × 10 + 203 × 2.',
      'DIVIDING asks "how many groups?" 960 ÷ 40: how many 40s fit in 960?',
      'ESTIMATE first with friendly numbers: 5,812 ÷ 29 is close to 6,000 ÷ 30 = 200.',
    ],
    examples: [
      { q: 'Multiply 142 × 20.', steps: ['142 × 2 = 284.', 'Then × 10: 2,840.'], answer: '2,840' },
      { q: 'Multiply 203 × 12.', steps: ['203 × 10 = 2,030.', '203 × 2 = 406.', '2,030 + 406 = 2,436.'], answer: '2,436' },
      { q: 'Divide 960 ÷ 40.', steps: ['Drop a zero from both: 96 ÷ 4.', '96 ÷ 4 = 24.'], answer: '24' },
      { q: 'Best estimate for 5,812 ÷ 29?', steps: ['Round 5,812 to 6,000 and 29 to 30.', '6,000 ÷ 30 = 200.'], answer: 'about 200' },
    ],
    practice: [
      { q: 'Multiply 35 × 40.', answers: ['1400', '1,400'], steps: ['35 × 4 = 140.', 'Then × 10: 1,400.'] },
      { q: 'Multiply 124 × 11.', answers: ['1364', '1,364'], steps: ['124 × 10 = 1,240.', '1,240 + 124 = 1,364.'] },
      { q: 'Divide 720 ÷ 24.', answers: ['30'], steps: ['24 × 3 = 72.', 'So 24 × 30 = 720.'] },
    ],
    watchOut: 'When you multiply by 20, do not forget the zero — 142 × 20 is 2,840, not 284.',
  },

  // ---------------- 5.F Unit 8 — Powers of ten ----------------
  {
    domain: '5.F', unit: 8, title: 'Powers of ten',
    objective: 'Use powers of ten to multiply and divide by 10, 100, and 1,000.',
    concept: [
      '10 to a power means multiply 10 by itself: 10³ = 10 × 10 × 10 = 1,000. The little number counts the ZEROS.',
      'Multiplying by 10 makes every digit move ONE PLACE LEFT — the number gets 10 times bigger.',
      'Dividing by 10 moves every digit ONE PLACE RIGHT. 100 is two places, 1,000 is three.',
      'With decimals, it looks like the decimal point hops: 3.6 × 100 = 360.',
    ],
    examples: [
      { q: 'Write 10⁵ as a regular number.', steps: ['The exponent 5 means five zeros.', '10⁵ = 100,000.'], answer: '100,000' },
      { q: 'What is 3.6 × 100?', steps: ['× 100 moves digits two places left.', '3.6 → 36 → 360.'], answer: '360' },
      { q: 'What is 4,500 ÷ 1,000?', steps: ['÷ 1,000 moves digits three places right.', '4,500 → 4.5.'], answer: '4.5' },
      { q: 'What is 62 × 10⁴?', steps: ['10⁴ = 10,000: four zeros.', '62 × 10,000 = 620,000.'], answer: '620,000' },
    ],
    practice: [
      { q: 'Write 10³ as a regular number.', answers: ['1000', '1,000'], steps: ['Three zeros.', '1,000.'] },
      { q: 'What is 0.7 × 100?', answers: ['70'], steps: ['Two places left.', '0.7 → 7 → 70.'] },
      { q: 'What is 250 ÷ 10?', answers: ['25'], steps: ['One place right.', '250 → 25.'] },
    ],
    watchOut: 'Dividing by 10 makes the number SMALLER — 250 ÷ 10 is 25, not 2,500.',
  },

  // ---------------- 5.F Unit 9 — Adding and subtracting decimals ----------------
  {
    domain: '5.F', unit: 9, title: 'Adding & subtracting decimals',
    objective: 'Add and subtract decimals to hundredths by lining up place value.',
    concept: [
      'LINE UP THE DECIMAL POINTS so tenths sit over tenths and hundredths over hundredths.',
      'Fill empty places with ZEROS: 7 is the same as 7.0, so 7 − 0.4 becomes 7.0 − 0.4.',
      'Regroup just like whole numbers: 10 tenths make 1 whole.',
      'Money is decimals in disguise: $2.75 + $1.40 is adding hundredths.',
    ],
    examples: [
      { q: 'Add 3.4 + 2.7.', steps: ['Tenths: 4 + 7 = 11 tenths = 1 whole and 1 tenth.', 'Wholes: 3 + 2 + 1 = 6.'], answer: '6.1' },
      { q: 'Subtract 8.6 − 3.2.', steps: ['Tenths: 6 − 2 = 4.', 'Wholes: 8 − 3 = 5.'], answer: '5.4' },
      { q: 'A pretzel is $2.75 and a juice is $1.40. Total?', steps: ['Line up: 2.75 + 1.40.', 'Hundredths 5 + 0 = 5; tenths 7 + 4 = 11 → carry 1.', 'Wholes 2 + 1 + 1 = 4: $4.15.'], answer: '$4.15' },
      { q: 'What is 7 − 0.4?', steps: ['Write 7 as 7.0.', '7.0 − 0.4 = 6.6.'], answer: '6.6' },
    ],
    practice: [
      { q: 'Add 1.25 + 0.5.', answers: ['1.75'], steps: ['Write 0.5 as 0.50.', '1.25 + 0.50 = 1.75.'] },
      { q: 'Subtract 5 − 1.3.', answers: ['3.7'], steps: ['Write 5 as 5.0.', '5.0 − 1.3 = 3.7.'] },
      { q: 'You pay $5.00 for a $3.65 snack. How much change, in dollars?', answers: ['1.35', '$1.35'], steps: ['5.00 − 3.65.', '= 1.35.'] },
    ],
    watchOut: 'Line up the DECIMAL POINTS, not the last digits — 1.25 + 0.5 is 1.75, not 1.30.',
  },

  // ---------------- 5.F Unit 10 — Multiplying and dividing decimals ----------------
  {
    domain: '5.F', unit: 10, title: 'Multiplying & dividing decimals',
    objective: 'Multiply and divide decimals using whole-number facts and place value.',
    concept: [
      'Multiply as if there were NO decimal points, then put the point back.',
      'COUNT decimal places: 0.3 × 0.4 has 1 + 1 = 2 places, so 12 becomes 0.12.',
      'Tenths times tenths make HUNDREDTHS — that is why the answer gets smaller.',
      'Dividing a decimal by a whole number: share it out, keeping the point in the same spot.',
    ],
    examples: [
      { q: 'Multiply 0.6 × 7.', steps: ['6 × 7 = 42.', 'One decimal place: 4.2.'], answer: '4.2' },
      { q: 'Multiply 0.3 × 0.4.', steps: ['3 × 4 = 12.', 'Two decimal places in all: 0.12.'], answer: '0.12' },
      { q: 'Divide 4.8 ÷ 6.', steps: ['48 ÷ 6 = 8.', '4.8 is 48 tenths, so the answer is 8 tenths: 0.8.'], answer: '0.8' },
      { q: '23 × 15 = 345. What is 2.3 × 1.5?', steps: ['Same digits, so start from 345.', 'Two decimal places in all: 3.45.'], answer: '3.45' },
    ],
    practice: [
      { q: 'Multiply 0.4 × 6.', answers: ['2.4'], steps: ['4 × 6 = 24.', 'One place: 2.4.'] },
      { q: 'Multiply 0.2 × 0.5.', answers: ['0.1', '0.10'], steps: ['2 × 5 = 10.', 'Two places: 0.10 = 0.1.'] },
      { q: 'Divide 3.6 ÷ 4.', answers: ['0.9'], steps: ['36 ÷ 4 = 9.', 'Tenths: 0.9.'] },
    ],
    watchOut: '0.3 × 0.4 is 0.12, not 1.2 — count BOTH decimal places.',
  },

  // ---------------- 5.F Unit 11 — Fractions as division ----------------
  {
    domain: '5.F', unit: 11, title: 'Fractions are division',
    objective: 'See a fraction as a division, and change improper fractions to mixed numbers.',
    concept: [
      'The fraction bar MEANS divide: 3/4 is 3 ÷ 4.',
      'Sharing: 2 pizzas among 5 kids gives each kid 2 ÷ 5 = 2/5 of a pizza.',
      'An IMPROPER fraction has a top bigger than the bottom, like 17/5. It is more than 1.',
      'To make a MIXED NUMBER, divide: 17 ÷ 5 = 3 remainder 2, so 17/5 = 3 2/5.',
    ],
    examples: [
      { q: 'Write 3 ÷ 4 as a fraction.', steps: ['The first number goes on top.', '3 ÷ 4 = 3/4.'], answer: '3/4' },
      { q: '2 pizzas shared by 5 kids. How much each?', steps: ['Share means divide: 2 ÷ 5.', 'Each kid gets 2/5 of a pizza.'], answer: '2/5' },
      { q: 'Write 17/5 as a mixed number.', steps: ['17 ÷ 5 = 3 remainder 2.', '3 wholes and 2 fifths left: 3 2/5.'], answer: '3 2/5' },
      { q: 'What division does 7/8 mean?', steps: ['Top divided by bottom.', '7 ÷ 8.'], answer: '7 ÷ 8' },
    ],
    practice: [
      { q: 'Write 5 ÷ 6 as a fraction.', answers: ['5/6'], steps: ['Top is 5, bottom is 6.', '5/6.'] },
      { q: '3 sandwiches are shared by 4 friends. What fraction does each get?', answers: ['3/4'], steps: ['3 ÷ 4.', '= 3/4.'] },
      { q: 'Write 11/4 as a mixed number.', answers: ['2 3/4', '2-3/4'], steps: ['11 ÷ 4 = 2 remainder 3.', '2 3/4.'] },
    ],
    watchOut: 'The number being shared goes on TOP — 2 pizzas for 5 kids is 2/5, not 5/2.',
  },

  // ---------------- 5.F Unit 12 — Fraction word problems ----------------
  {
    domain: '5.F', unit: 12, title: 'Fraction word problems',
    objective: 'Solve real problems that multiply with fractions, and estimate to check.',
    concept: [
      '"Of" means MULTIPLY: 2/5 of $15 is 2/5 × 15.',
      'A fraction of a number: divide by the bottom, multiply by the top. 15 ÷ 5 × 2 = 6.',
      'Repeated amounts multiply too: 3 batches of 2/3 cup is 3 × 2/3 = 2 cups.',
      'ESTIMATE with benchmarks: is each fraction close to 0, 1/2, or 1? That tells you roughly how big the answer is.',
    ],
    examples: [
      { q: 'One batch uses 2/3 cup of oats. How much for 3 batches?', steps: ['3 × 2/3 = 6/3.', '6/3 = 2 cups.'], answer: '2 cups' },
      { q: 'Jordan saves 2/5 of $15. How many dollars?', steps: ['$15 ÷ 5 = $3 per fifth.', '2 fifths: 2 × $3 = $6.'], answer: '$6' },
      { q: 'Ella ate 5/8 of one bar and 1/3 of another. More or less than 1 bar?', steps: ['5/8 is a bit more than 1/2.', '1/3 is a bit less than 1/2.', 'Together they are close to 1 — just under, since 5/8 + 1/3 = 23/24.'], answer: 'a little less than 1' },
      { q: 'A whole wall takes 6 quarts. How much for 3/4 of the wall?', steps: ['6 ÷ 4 = 1.5 quarts per quarter.', '3 quarters: 3 × 1.5 = 4.5 quarts.'], answer: '4.5 quarts' },
    ],
    practice: [
      { q: 'What is 3/4 of 20?', answers: ['15'], steps: ['20 ÷ 4 = 5.', '3 × 5 = 15.'] },
      { q: 'Each lap is 1/4 mile. How many miles is 6 laps? (as a mixed number)', answers: ['1 1/2', '1.5', '3/2'], steps: ['6 × 1/4 = 6/4.', '= 1 1/2 miles.'] },
      { q: 'What is 2/3 of 12?', answers: ['8'], steps: ['12 ÷ 3 = 4.', '2 × 4 = 8.'] },
    ],
    watchOut: 'Multiplying by a fraction less than 1 makes the answer SMALLER than the number you started with.',
  },

  // ---------------- 5.F Unit 13 — Numerical expressions ----------------
  {
    domain: '5.F', unit: 13, title: 'Writing & evaluating expressions',
    objective: 'Use parentheses and the order of operations, and turn words into expressions.',
    concept: [
      'PARENTHESES FIRST: work inside the brackets before anything else.',
      'Then multiply and divide left to right, then add and subtract left to right.',
      '"The sum of 8 and 5" is (8 + 5). "Three times" it is 3 × (8 + 5).',
      'You can COMPARE without calculating: 3 × (245 + 17) is just 3 times as big as 245 + 17.',
    ],
    examples: [
      { q: 'Evaluate 5 × (7 + 3).', steps: ['Parentheses first: 7 + 3 = 10.', '5 × 10 = 50.'], answer: '50' },
      { q: 'Evaluate (36 − 12) ÷ 4.', steps: ['Parentheses first: 36 − 12 = 24.', '24 ÷ 4 = 6.'], answer: '6' },
      { q: 'Write "three times the sum of 8 and 5."', steps: ['The sum of 8 and 5 is (8 + 5).', 'Three times it: 3 × (8 + 5).'], answer: '3 × (8 + 5)' },
      { q: 'How does 3 × (245 + 17) compare with 245 + 17?', steps: ['Same sum inside both.', 'One is multiplied by 3.', 'It is 3 times as large.'], answer: '3 times as large' },
    ],
    practice: [
      { q: 'Evaluate 4 × (6 + 2).', answers: ['32'], steps: ['6 + 2 = 8.', '4 × 8 = 32.'] },
      { q: 'Evaluate 20 − 3 × 4.', answers: ['8'], steps: ['Multiply first: 3 × 4 = 12.', '20 − 12 = 8.'] },
      { q: 'Evaluate (15 + 5) ÷ 5.', answers: ['4'], steps: ['15 + 5 = 20.', '20 ÷ 5 = 4.'] },
    ],
    watchOut: '20 − 3 × 4 is 8, not 68 — multiply before you subtract.',
  },

  // ---------------- 5.F Unit 14 — Patterns and relationships ----------------
  {
    domain: '5.F', unit: 14, title: 'Number patterns & relationships',
    objective: 'Make number patterns from rules and compare two patterns.',
    concept: [
      'A RULE like "add 3" builds a pattern: 0, 3, 6, 9, 12, ...',
      'The 6th number comes after 5 jumps: 0 + 5 × 3 = 15.',
      'Two patterns side by side make ORDERED PAIRS: (0, 0), (2, 4), (4, 8).',
      'Compare the rules: if one adds 2 and the other adds 4, the second is always TWICE the first.',
    ],
    examples: [
      { q: 'Rule "add 3" from 0. What is the 6th number?', steps: ['0, 3, 6, 9, 12, 15.', 'The 6th number is 15.'], answer: '15' },
      { q: 'Rule "add 5" from 0. First five numbers?', steps: ['Start at 0, then keep adding 5.', '0, 5, 10, 15, 20.'], answer: '0, 5, 10, 15, 20' },
      { q: 'A adds 2, B adds 4, both from 0. How do they compare?', steps: ['A: 0, 2, 4, 6. B: 0, 4, 8, 12.', 'Each B number is 2 times its A partner.'], answer: 'B is twice A' },
      { q: 'A adds 2, B adds 6. Make ordered pairs.', steps: ['Pair term by term.', '(0, 0), (2, 6), (4, 12), (6, 18).'], answer: '(2, 6), (4, 12), ...' },
    ],
    practice: [
      { q: 'Rule "add 4" from 0. What is the 5th number?', answers: ['16'], steps: ['0, 4, 8, 12, 16.', 'The 5th is 16.'] },
      { q: 'Pattern A adds 3, pattern B adds 9, both from 0. B is how many times A?', answers: ['3', '3 times'], steps: ['9 ÷ 3 = 3.', 'B is 3 times A.'] },
      { q: 'Rule "add 10" from 0. What is the 4th number?', answers: ['30'], steps: ['0, 10, 20, 30.', 'The 4th is 30.'] },
    ],
    watchOut: 'Starting at 0 counts as the 1st number — the 6th number is after 5 jumps, not 6.',
  },

  // ---------------- 5.F Unit 15 — Volume, conversions, line plots ----------------
  {
    domain: '5.F', unit: 15, title: 'Volume, unit conversions & line plots',
    objective: 'Find the volume of boxes, convert units, and read line plots with fractions.',
    concept: [
      'VOLUME counts unit cubes: length × width × height, in cubic units.',
      'One LAYER is length × width; stack as many layers as the height.',
      'Big unit to small unit: MULTIPLY. 1 L = 1,000 mL, 1 ft = 12 in, 1 m = 100 cm.',
      'On a LINE PLOT each X is one measurement. Count, add, or compare the Xs.',
    ],
    examples: [
      { q: 'A box is 6 in × 3 in × 2 in. Volume?', steps: ['One layer: 6 × 3 = 18 cubes.', '2 layers: 18 × 2 = 36.'], answer: '36 cubic inches' },
      { q: 'How many milliliters in 2.5 liters?', steps: ['1 L = 1,000 mL.', '2.5 × 1,000 = 2,500.'], answer: '2,500 mL' },
      { q: 'A shelf is 7 feet tall. How many inches?', steps: ['1 ft = 12 in.', '7 × 12 = 84.'], answer: '84 inches' },
      { q: 'A line plot has 3 Xs at 1/4 cup. Total water in those bottles?', steps: ['3 bottles × 1/4 cup.', '= 3/4 cup.'], answer: '3/4 cup' },
    ],
    practice: [
      { q: 'Volume of a 5 × 4 × 3 box, in cubic units?', answers: ['60'], steps: ['5 × 4 = 20.', '20 × 3 = 60.'] },
      { q: 'How many centimeters in 3 meters?', answers: ['300'], steps: ['1 m = 100 cm.', '3 × 100 = 300.'] },
      { q: 'How many inches in 4 feet?', answers: ['48'], steps: ['4 × 12.', '= 48.'] },
    ],
    watchOut: 'Going to a SMALLER unit gives a BIGGER number — 7 feet is 84 inches, not 7 ÷ 12.',
  },

  // ---------------- 5.F Unit 16 — Coordinate plane and shapes ----------------
  {
    domain: '5.F', unit: 16, title: 'Coordinate plane & classifying shapes',
    objective: 'Plot and read points, and sort triangles and quadrilaterals by their properties.',
    concept: [
      'A point (x, y): go ACROSS x first, then UP y, starting from the origin (0, 0).',
      'On a graph about real things, each point tells a story: (3, 12) can mean 3 hours, 12 miles.',
      'Triangles are named by ANGLES (right, acute, obtuse) and by SIDES (equilateral, isosceles, scalene).',
      'Shapes live in FAMILIES: every square is a rectangle and a rhombus, but not every rectangle is a square.',
    ],
    examples: [
      { q: 'Walk 6 right and 0 up from the origin. Which point?', steps: ['Across 6: x = 6.', 'Up 0: y = 0.', '(6, 0).'], answer: '(6, 0)' },
      { q: 'A point (3, 12) on a "hours vs. miles" graph means?', steps: ['x is hours: 3.', 'y is miles: 12.', 'After 3 hours, 12 miles walked.'], answer: '3 hours, 12 miles' },
      { q: 'A triangle has angles 90°, 45°, 45°. Best name?', steps: ['One right angle: it is a right triangle.', 'Two equal angles mean two equal sides: isosceles.'], answer: 'right isosceles' },
      { q: 'Which is true about every square?', steps: ['A square has 4 equal sides and 4 right angles.', 'So it is a rectangle AND a rhombus.'], answer: 'It is also a rectangle' },
    ],
    practice: [
      { q: 'Go right 2 and up 5 from the origin. Coordinates? (like (x,y))', answers: ['(2,5)', '(2, 5)', '2,5'], steps: ['x = 2, y = 5.', '(2, 5).'] },
      { q: 'A triangle has three equal sides. What is it called?', answers: ['equilateral'], steps: ['All sides equal.', 'Equilateral.'] },
      { q: 'How many right angles does a rectangle have?', answers: ['4', 'four'], steps: ['Every corner is a right angle.', '4.'] },
    ],
    watchOut: '(3, 12) and (12, 3) are different points — x always comes first.',
  },
];
