import type { Domain } from '../types/problem';

export interface WorkedExample {
  q: string;
  steps: string[];
  answer: string;
}

export interface PracticeQuestion {
  q: string;
  answers: string[]; // first is canonical; the rest are accepted alternatives
  steps: string[];
}

export interface VideoRef {
  title: string;
  src: string; // filename in public/videos/lessons/
}

export interface Lesson {
  domain: Domain;
  unit: number;
  title: string;
  objective: string;
  concept: string[]; // the core teaching points
  examples: WorkedExample[]; // worked examples with step-by-step solutions
  practice: PracticeQuestion[]; // try-it questions with accepted alternatives
  watchOut: string;
  videos?: VideoRef[]; // ordered Manim animations in public/videos/lessons/
}

export function lessonKey(domain: Domain, unit: number): string {
  return `${domain}-${unit}`;
}

// Tolerant answer check for in-lesson practice: matches any accepted string
// (ignoring case/spaces/$/commas) or any numerically-equal value (so 0.5,
// .50, and 1/2 all match).
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[$,\s]/g, '');
}
function numericValue(s: string): number | null {
  const t = normalize(s).replace(/%$/, '');
  const frac = t.match(/^(-?\d+)\/(\d+)$/);
  if (frac) {
    const d = parseInt(frac[2], 10);
    return d === 0 ? null : parseInt(frac[1], 10) / d;
  }
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
  const n = Number(t);
  return Number.isNaN(n) ? null : n;
}
export function lessonAnswerMatches(input: string, answers: string[]): boolean {
  if (!input.trim()) return false;
  const u = normalize(input);
  if (answers.some((a) => normalize(a) === u)) return true;
  const uv = numericValue(input);
  if (uv !== null) {
    return answers.some((a) => {
      const av = numericValue(a);
      return av !== null && Math.abs(av - uv) < 1e-9;
    });
  }
  return false;
}

export const LESSONS: Lesson[] = [
  // ---------------- 6.RP — Ratios & Proportions ----------------
  {
    domain: '6.RP', unit: 1, title: 'What is a ratio?',
    objective: 'Compare two quantities using a ratio.',
    videos: [{ title: 'The idea', src: '6.RP-1.mp4' }, { title: 'Worked examples', src: '6.RP-1-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-1-trap.mp4' }],
    concept: [
      "A ratio compares two amounts, like 3 red to 2 blue. Write it 3:2 or '3 to 2'.",
      'Order matters — 3:2 is not the same as 2:3.',
      'Scale a ratio by multiplying or dividing BOTH parts by the same number.',
    ],
    examples: [
      { q: 'A box has 4 apples and 6 oranges. Ratio of apples to oranges in simplest form?', steps: ['Apples to oranges = 4 to 6.', 'Divide both by the common factor 2.', '4÷2 : 6÷2 = 2:3.'], answer: '2:3' },
      { q: 'There are 5 cats and 10 dogs. Simplest ratio of cats to dogs?', steps: ['Cats to dogs = 5:10.', 'Divide both by 5.', '5:10 = 1:2.'], answer: '1:2' },
      { q: 'A recipe uses 2 cups flour to 3 cups milk. Ratio of milk to flour?', steps: ['Milk is asked first.', 'Milk = 3, flour = 2.', 'Ratio = 3:2.'], answer: '3:2' },
    ],
    practice: [
      { q: 'A bag has 6 blue and 9 red marbles. Ratio of blue to red in simplest form?', answers: ['2:3', '2 to 3'], steps: ['Blue to red = 6:9.', 'Divide both by 3.', '6:9 = 2:3.'] },
      { q: 'A class has 8 boys and 12 girls. Simplest ratio of boys to girls?', answers: ['2:3', '2 to 3'], steps: ['Boys to girls = 8:12.', 'Divide both by 4.', '8:12 = 2:3.'] },
    ],
    watchOut: "Keep the order asked for: 'apples to oranges' puts the apples number first.",
  },
  {
    domain: '6.RP', unit: 2, title: 'Unit rates',
    objective: 'Find how much for just one.',
    videos: [{ title: 'The idea', src: '6.RP-2.mp4' }, { title: 'Worked examples', src: '6.RP-2-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-2-trap.mp4' }],
    concept: [
      'A rate compares two different units, like miles and hours.',
      'A unit rate is the amount for exactly 1 (per hour, per pound).',
      'Divide to find it: total ÷ number of units.',
    ],
    examples: [
      { q: '6 muffins cost $9. Cost per muffin?', steps: ['Per muffin means money ÷ muffins.', '$9 ÷ 6.', '= $1.50.'], answer: '$1.50' },
      { q: 'A car goes 150 miles in 3 hours. Miles per hour?', steps: ['Per hour means miles ÷ hours.', '150 ÷ 3.', '= 50 mph.'], answer: '50' },
      { q: '4 notebooks cost $10. Price per notebook?', steps: ['Divide cost by notebooks.', '$10 ÷ 4.', '= $2.50.'], answer: '$2.50' },
    ],
    practice: [
      { q: '8 apples cost $4. Cost per apple?', answers: ['$0.50', '0.5', '50 cents'], steps: ['Divide cost by apples.', '$4 ÷ 8 = $0.50.'] },
      { q: 'A runner goes 100 meters in 20 seconds. Meters per second?', answers: ['5', '5 m/s'], steps: ['Divide meters by seconds.', '100 ÷ 20 = 5.'] },
    ],
    watchOut: "'Per' means divide by that quantity — cost per muffin divides money by muffins.",
  },
  {
    domain: '6.RP', unit: 3, title: 'Ratio tables',
    objective: 'Use a table to find equivalent ratios.',
    videos: [{ title: 'The idea', src: '6.RP-3.mp4' }, { title: 'Worked examples', src: '6.RP-3-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-3-trap.mp4' }],
    concept: [
      'Equivalent ratios make the same comparison: 1:3, 2:6, 3:9.',
      'In a ratio table, multiply both columns by the same number to move across.',
      'Find a missing value by spotting the pattern between the rows.',
    ],
    examples: [
      { q: 'If 2 → 6 and 3 → 9, what does 5 map to?', steps: ['Each input is ×3.', '5 × 3.', '= 15.'], answer: '15' },
      { q: 'A table shows 1 → 4 and 2 → 8. Output for 6?', steps: ['Pattern: output = input × 4.', '6 × 4.', '= 24.'], answer: '24' },
      { q: 'If 4 pens cost $3, what do 8 pens cost?', steps: ['8 is 4 × 2, so double the cost.', '$3 × 2.', '= $6.'], answer: '$6' },
    ],
    practice: [
      { q: 'A ratio table has 3 → 12 and 5 → 20. What output goes with 7?', answers: ['28'], steps: ['Pattern: output = input × 4.', '7 × 4 = 28.'] },
      { q: 'If 2 cups of mix make 10 cookies, how many cookies from 6 cups?', answers: ['30'], steps: ['6 is 2 × 3, so triple it.', '10 × 3 = 30.'] },
    ],
    watchOut: 'Whatever you multiply one column by, multiply the other by too.',
  },
  {
    domain: '6.RP', unit: 4, title: 'Part-to-part vs part-to-whole',
    objective: 'Tell different kinds of ratios apart.',
    videos: [{ title: 'The idea', src: '6.RP-4.mp4' }, { title: 'Worked examples', src: '6.RP-4-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-4-trap.mp4' }],
    concept: [
      'Part-to-part compares two groups (boys to girls).',
      'Part-to-whole compares one group to the total (boys to all students).',
      'If a class is 3 boys to 2 girls, the whole is 3 + 2 = 5.',
    ],
    examples: [
      { q: '3 boys and 2 girls. Ratio of boys to the whole class?', steps: ['Whole = 3 + 2 = 5.', 'Boys to whole = 3 to 5.', '= 3:5.'], answer: '3:5' },
      { q: 'A bowl has 4 apples and 6 pears. Ratio of apples to all fruit?', steps: ['Total = 4 + 6 = 10.', 'Apples to total = 4:10.', 'Simplify: 2:5.'], answer: '2:5' },
      { q: 'In a 2:3 paint mix (red:blue), what fraction is red?', steps: ['Whole = 2 + 3 = 5 parts.', 'Red = 2 of 5.', '= 2/5.'], answer: '2/5' },
    ],
    practice: [
      { q: 'A team has 7 forwards and 3 defenders. Ratio of defenders to the whole team?', answers: ['3:10', '3 to 10'], steps: ['Whole = 7 + 3 = 10.', 'Defenders to whole = 3:10.'] },
      { q: 'A bag is 5 red and 5 blue chips. What fraction are red?', answers: ['1/2', '0.5', '50%'], steps: ['Whole = 5 + 5 = 10.', 'Red = 5/10 = 1/2.'] },
    ],
    watchOut: 'For part-to-whole, add the parts first to get the total.',
  },
  {
    domain: '6.RP', unit: 5, title: 'Percents',
    objective: "Understand percent as 'out of 100'.",
    videos: [{ title: 'The idea', src: '6.RP-5.mp4' }, { title: 'Worked examples', src: '6.RP-5-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-5-trap.mp4' }],
    concept: [
      'Percent means per hundred: 25% = 25 out of 100 = 0.25.',
      'To find a percent OF a number, multiply by the decimal form.',
      'Half = 50%, quarter = 25%, whole = 100%.',
    ],
    examples: [
      { q: 'What is 20% of 45?', steps: ['20% = 0.20.', '0.20 × 45.', '= 9.'], answer: '9' },
      { q: 'What is 50% of 80?', steps: ['50% = one half.', 'Half of 80.', '= 40.'], answer: '40' },
      { q: 'Write 3/4 as a percent.', steps: ['3/4 = 0.75.', '0.75 = 75 per hundred.', '= 75%.'], answer: '75%' },
    ],
    practice: [
      { q: 'What is 10% of 250?', answers: ['25'], steps: ['10% = 0.10.', '0.10 × 250 = 25.'] },
      { q: 'What is 25% of 40?', answers: ['10'], steps: ['25% = one quarter.', '40 ÷ 4 = 10.'] },
    ],
    watchOut: 'Turn the percent into a decimal (move the point two places left) before multiplying.',
  },
  {
    domain: '6.RP', unit: 6, title: 'Converting with rates',
    objective: 'Switch units using a rate.',
    videos: [{ title: 'The idea', src: '6.RP-6.mp4' }, { title: 'Worked examples', src: '6.RP-6-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-6-trap.mp4' }],
    concept: [
      'A conversion is just a rate: 12 inches per 1 foot.',
      'Multiply by the rate so the unit you do not want cancels out.',
      'Check that the size of your answer makes sense.',
    ],
    examples: [
      { q: 'How many inches are in 3 feet?', steps: ['1 foot = 12 inches.', '3 × 12.', '= 36 inches.'], answer: '36' },
      { q: 'How many feet are in 48 inches?', steps: ['12 inches = 1 foot.', '48 ÷ 12.', '= 4 feet.'], answer: '4' },
      { q: 'A recipe needs 2 quarts. How many cups? (1 quart = 4 cups)', steps: ['1 quart = 4 cups.', '2 × 4.', '= 8 cups.'], answer: '8' },
    ],
    practice: [
      { q: 'How many inches are in 5 feet?', answers: ['60'], steps: ['1 foot = 12 inches.', '5 × 12 = 60.'] },
      { q: 'There are 100 cm in 1 meter. How many cm in 3.5 meters?', answers: ['350'], steps: ['1 m = 100 cm.', '3.5 × 100 = 350.'] },
    ],
    watchOut: 'Decide multiply vs divide by thinking about which unit is bigger.',
  },

  // ---------------- 6.NS — The Number System ----------------
  {
    domain: '6.NS', unit: 1, title: 'Adding & subtracting decimals',
    objective: 'Compute carefully with decimals.',
    videos: [{ title: 'The idea', src: '6.NS-1.mp4' }, { title: 'Worked examples', src: '6.NS-1-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-1-trap.mp4' }],
    concept: [
      'Line up the decimal points before adding or subtracting.',
      'Fill in zeros so both numbers have the same number of places.',
      'Bring the decimal point straight down into the answer.',
    ],
    examples: [
      { q: '3.4 + 1.25', steps: ['Write 3.40 to match places.', '3.40 + 1.25.', '= 4.65.'], answer: '4.65' },
      { q: '5 − 2.3', steps: ['Write 5 as 5.0.', '5.0 − 2.3.', '= 2.7.'], answer: '2.7' },
      { q: '0.75 + 0.5', steps: ['Write 0.50 to match places.', '0.75 + 0.50.', '= 1.25.'], answer: '1.25' },
    ],
    practice: [
      { q: 'Add 2.6 + 3.45', answers: ['6.05'], steps: ['Write 2.60 + 3.45.', '= 6.05.'] },
      { q: 'Subtract 4.2 − 1.75', answers: ['2.45'], steps: ['Write 4.20 − 1.75.', '= 2.45.'] },
    ],
    watchOut: 'Line up the decimal points — not just the last digits.',
  },
  {
    domain: '6.NS', unit: 2, title: 'Multiplying & dividing decimals',
    objective: 'Multiply and divide decimal numbers.',
    videos: [{ title: 'The idea', src: '6.NS-2.mp4' }, { title: 'Worked examples', src: '6.NS-2-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-2-trap.mp4' }],
    concept: [
      'Multiply as if there were no decimals, then count total decimal places.',
      'To divide, move both decimal points right until the divisor is a whole number.',
      'Estimate first so you can place the decimal point sensibly.',
    ],
    examples: [
      { q: '0.6 × 0.4', steps: ['6 × 4 = 24.', 'Two decimal places total.', '= 0.24.'], answer: '0.24' },
      { q: '1.2 × 3', steps: ['12 × 3 = 36.', 'One decimal place.', '= 3.6.'], answer: '3.6' },
      { q: '4.8 ÷ 0.6', steps: ['Move both points one place: 48 ÷ 6.', '= 8.'], answer: '8' },
    ],
    practice: [
      { q: 'Multiply 0.3 × 0.7', answers: ['0.21', '.21'], steps: ['3 × 7 = 21.', 'Two decimal places → 0.21.'] },
      { q: 'Divide 2.5 ÷ 0.5', answers: ['5'], steps: ['Move both points: 25 ÷ 5.', '= 5.'] },
    ],
    watchOut: 'Count the decimal places in BOTH factors when multiplying.',
  },
  {
    domain: '6.NS', unit: 3, title: 'GCF, LCM & distributing',
    objective: 'Break numbers apart with common factors.',
    videos: [{ title: 'The idea', src: '6.NS-3.mp4' }, { title: 'Worked examples', src: '6.NS-3-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-3-trap.mp4' }],
    concept: [
      'The GCF is the biggest number that divides both.',
      'The LCM is the smallest number both divide into.',
      'Use the GCF to rewrite a sum: 18 + 24 = 6(3 + 4).',
    ],
    examples: [
      { q: 'GCF of 12 and 18?', steps: ['12 = 2·2·3, 18 = 2·3·3.', 'Common factors 2·3.', '= 6.'], answer: '6' },
      { q: 'LCM of 4 and 6?', steps: ['Multiples of 6: 6, 12…', '12 is also a multiple of 4.', '= 12.'], answer: '12' },
      { q: 'Rewrite 18 + 24 using the GCF.', steps: ['GCF(18,24) = 6.', '18 = 6·3, 24 = 6·4.', '= 6(3 + 4).'], answer: '6(3+4)' },
    ],
    practice: [
      { q: 'GCF of 16 and 24?', answers: ['8'], steps: ['16 = 2·2·2·2, 24 = 2·2·2·3.', 'Common = 2·2·2 = 8.'] },
      { q: 'LCM of 3 and 5?', answers: ['15'], steps: ['They share no factors.', 'LCM = 3 × 5 = 15.'] },
    ],
    watchOut: 'GCF = what divides INTO them; LCM = what they divide into.',
  },
  {
    domain: '6.NS', unit: 4, title: 'Integers & absolute value',
    objective: 'Work with positive and negative numbers.',
    videos: [{ title: 'The idea', src: '6.NS-4.mp4' }, { title: 'Worked examples', src: '6.NS-4-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-4-trap.mp4' }],
    concept: [
      'Negatives are below 0 (owing money, below sea level).',
      'On a number line, bigger is always to the right.',
      'Absolute value |x| is the distance from 0 — always 0 or positive.',
    ],
    examples: [
      { q: 'What is |-7|?', steps: ['Distance of -7 from 0.', '= 7.'], answer: '7' },
      { q: 'Which is greater, -5 or -2?', steps: ['-2 is to the right of -5.', 'So -2 is greater.'], answer: '-2' },
      { q: 'A diver is at -30 ft, a kite at 12 ft. Who is farther from sea level (0)?', steps: ['|-30| = 30, |12| = 12.', '30 > 12.', 'The diver.'], answer: 'diver' },
    ],
    practice: [
      { q: 'What is |-15|?', answers: ['15'], steps: ['Distance from 0 is 15.'] },
      { q: 'Order from least to greatest: -3, 2, -8 (use commas).', answers: ['-8, -3, 2', '-8,-3,2'], steps: ['Most negative is least.', '-8 < -3 < 2.'] },
    ],
    watchOut: '-7 is LESS than -2, even though 7 is bigger than 2.',
  },
  {
    domain: '6.NS', unit: 5, title: 'The coordinate plane',
    objective: 'Plot and read ordered pairs.',
    videos: [{ title: 'The idea', src: '6.NS-5.mp4' }, { title: 'Worked examples', src: '6.NS-5-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-5-trap.mp4' }],
    concept: [
      'A point is (x, y): x is across, y is up or down.',
      'The four quadrants are set by the signs of x and y.',
      'Distance along a grid line = subtract the matching coordinates.',
    ],
    examples: [
      { q: 'Which quadrant is (-3, 5) in?', steps: ['x negative, y positive → top-left.', '= Quadrant II.'], answer: 'II' },
      { q: 'Distance from (2, 1) to (2, 6)?', steps: ['Same x → vertical.', '6 − 1.', '= 5.'], answer: '5' },
      { q: 'Reflect (4, 3) across the y-axis.', steps: ['Reflecting across the y-axis flips the sign of x.', '(4,3) → (-4, 3).'], answer: '(-4,3)' },
    ],
    practice: [
      { q: 'Which quadrant contains (6, -2)?', answers: ['IV', '4', 'quadrant iv'], steps: ['x positive, y negative → bottom-right.', '= Quadrant IV.'] },
      { q: 'Distance from (-3, 4) to (5, 4)?', answers: ['8'], steps: ['Same y → subtract x-values.', '5 − (−3) = 8.'] },
    ],
    watchOut: 'Always go across (x) first, then up or down (y).',
  },
  {
    domain: '6.NS', unit: 6, title: 'Dividing fractions',
    objective: 'Divide a fraction by a fraction.',
    videos: [{ title: 'The idea', src: '6.NS-6.mp4' }, { title: 'Worked examples', src: '6.NS-6-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-6-trap.mp4' }],
    concept: [
      "Dividing asks 'how many of these fit?'",
      'Keep the first fraction, change ÷ to ×, and flip the second (its reciprocal).',
      'Then multiply across and simplify.',
    ],
    examples: [
      { q: '1/2 ÷ 1/4', steps: ['Keep 1/2, flip 1/4 to 4/1.', '1/2 × 4/1 = 4/2.', '= 2.'], answer: '2' },
      { q: '3/4 ÷ 1/2', steps: ['Keep-change-flip: 3/4 × 2/1.', '= 6/4.', '= 3/2.'], answer: '3/2' },
      { q: '2/3 ÷ 4', steps: ['4 = 4/1; flip to 1/4.', '2/3 × 1/4 = 2/12.', '= 1/6.'], answer: '1/6' },
    ],
    practice: [
      { q: 'What is 1/3 ÷ 1/6?', answers: ['2'], steps: ['1/3 × 6/1 = 6/3.', '= 2.'] },
      { q: 'What is 5/6 ÷ 1/2?', answers: ['5/3', '1 2/3'], steps: ['5/6 × 2/1 = 10/6.', '= 5/3.'] },
    ],
    watchOut: 'Flip only the SECOND fraction, not both.',
  },

  // ---------------- 6.EE — Expressions & Equations ----------------
  {
    domain: '6.EE', unit: 1, title: 'Exponents',
    objective: 'Read and evaluate powers.',
    videos: [{ title: 'The idea', src: '6.EE-1.mp4' }, { title: 'Worked examples', src: '6.EE-1-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-1-trap.mp4' }],
    concept: [
      'An exponent counts repeated multiplication: 2³ = 2 × 2 × 2.',
      'The base is multiplied, not added to the exponent.',
      "Any number to the 1st power is itself; 'squared' means the power 2.",
    ],
    examples: [
      { q: 'Evaluate 3³.', steps: ['3 × 3 × 3.', '= 27.'], answer: '27' },
      { q: 'Evaluate 5².', steps: ['5 × 5.', '= 25.'], answer: '25' },
      { q: 'Evaluate 2⁴.', steps: ['2 × 2 × 2 × 2.', '= 16.'], answer: '16' },
    ],
    practice: [
      { q: 'What is 4²?', answers: ['16'], steps: ['4 × 4 = 16.'] },
      { q: 'What is 10³?', answers: ['1000', '1,000'], steps: ['10 × 10 × 10 = 1000.'] },
    ],
    watchOut: '2³ is 8, not 6 — do not multiply the base by the exponent.',
  },
  {
    domain: '6.EE', unit: 2, title: 'Writing & evaluating expressions',
    objective: 'Turn words into expressions and evaluate them.',
    videos: [{ title: 'The idea', src: '6.EE-2.mp4' }, { title: 'Worked examples', src: '6.EE-2-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-2-trap.mp4' }],
    concept: [
      'A variable is a letter that stands for a number.',
      "Translate words: 'more than' = +, 'product' = ×, 'less than' flips the order.",
      'To evaluate, substitute the value and follow order of operations.',
    ],
    examples: [
      { q: 'Evaluate 2x + 5 when x = 4.', steps: ['Substitute: 2·4 + 5.', '8 + 5.', '= 13.'], answer: '13' },
      { q: "Write 'six more than a number n'.", steps: ["'more than' means add.", '= n + 6.'], answer: 'n+6' },
      { q: 'Evaluate 3(a − 2) when a = 5.', steps: ['Substitute: 3(5 − 2).', '3 · 3.', '= 9.'], answer: '9' },
    ],
    practice: [
      { q: 'Evaluate 5y − 3 when y = 2.', answers: ['7'], steps: ['5·2 − 3 = 10 − 3.', '= 7.'] },
      { q: "Write 'the product of 4 and x'.", answers: ['4x', '4*x', '4·x'], steps: ["'product' means multiply.", '= 4x.'] },
    ],
    watchOut: '2x means 2 times x — multiply before you add.',
  },
  {
    domain: '6.EE', unit: 3, title: 'Equivalent expressions',
    objective: 'Rewrite expressions that mean the same thing.',
    videos: [{ title: 'The idea', src: '6.EE-3.mp4' }, { title: 'Worked examples', src: '6.EE-3-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-3-trap.mp4' }],
    concept: [
      'Distributive property: a(b + c) = ab + ac.',
      'Combine like terms: 3x + 2x = 5x.',
      'Equivalent expressions give the same value for every x.',
    ],
    examples: [
      { q: 'Expand 3(x + 2).', steps: ['Multiply 3 by each term.', '3·x + 3·2.', '= 3x + 6.'], answer: '3x+6' },
      { q: 'Combine 4x + 5x.', steps: ['Same variable, add coefficients.', '4 + 5 = 9.', '= 9x.'], answer: '9x' },
      { q: 'Simplify 2x + 3 + x.', steps: ['Combine x terms: 2x + x = 3x.', '= 3x + 3.'], answer: '3x+3' },
    ],
    practice: [
      { q: 'Expand 5(y + 3).', answers: ['5y+15', '5y + 15'], steps: ['5·y + 5·3.', '= 5y + 15.'] },
      { q: 'Combine like terms: 7a − 2a.', answers: ['5a'], steps: ['7 − 2 = 5.', '= 5a.'] },
    ],
    watchOut: 'Multiply the outside number by EVERY term inside the parentheses.',
  },
  {
    domain: '6.EE', unit: 4, title: 'One-step equations',
    objective: 'Solve for a variable in one move.',
    videos: [{ title: 'The idea', src: '6.EE-4.mp4' }, { title: 'Worked examples', src: '6.EE-4-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-4-trap.mp4' }],
    concept: [
      'An equation says two things are equal.',
      'Undo what is done to x using the opposite operation.',
      'Do the same thing to BOTH sides to keep it balanced.',
    ],
    examples: [
      { q: 'Solve x + 7 = 12.', steps: ['Subtract 7 from both sides.', 'x = 12 − 7.', 'x = 5.'], answer: '5' },
      { q: 'Solve 3x = 15.', steps: ['Divide both sides by 3.', 'x = 15 ÷ 3.', 'x = 5.'], answer: '5' },
      { q: 'Solve x − 4 = 10.', steps: ['Add 4 to both sides.', 'x = 10 + 4.', 'x = 14.'], answer: '14' },
    ],
    practice: [
      { q: 'Solve x + 9 = 20. (give x)', answers: ['11', 'x=11'], steps: ['Subtract 9 from both sides.', 'x = 11.'] },
      { q: 'Solve 4x = 28. (give x)', answers: ['7', 'x=7'], steps: ['Divide both sides by 4.', 'x = 7.'] },
    ],
    watchOut: 'Whatever you do to one side, do to the other side too.',
  },
  {
    domain: '6.EE', unit: 5, title: 'Inequalities',
    objective: 'Write and graph inequalities.',
    videos: [{ title: 'The idea', src: '6.EE-5.mp4' }, { title: 'Worked examples', src: '6.EE-5-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-5-trap.mp4' }],
    concept: [
      '< less than, > greater than, ≤ at most, ≥ at least.',
      'x > 3 means every number bigger than 3 (but not 3 itself).',
      'Number line: open circle for < or >, closed circle for ≤ or ≥.',
    ],
    examples: [
      { q: 'Graph x ≥ 2 — open or closed circle at 2?', steps: ['≥ includes the number.', 'Use a closed (filled) circle.'], answer: 'closed' },
      { q: "Write 'a number is at most 10'.", steps: ["'at most' means ≤.", '= x ≤ 10.'], answer: 'x≤10' },
      { q: 'Is x = 5 a solution to x < 5?', steps: ['5 is not less than 5.', '= no.'], answer: 'no' },
    ],
    practice: [
      { q: "Write 'n is greater than 7' as an inequality.", answers: ['n>7', 'n > 7'], steps: ["'greater than' = >.", '= n > 7.'] },
      { q: 'For x ≤ 4, is x = 4 included? (yes/no)', answers: ['yes'], steps: ["≤ means 'at most', so 4 counts.", '= yes.'] },
    ],
    watchOut: '≤ and ≥ include the number; < and > do not.',
  },
  {
    domain: '6.EE', unit: 6, title: 'Variables that change together',
    objective: 'Relate independent and dependent variables.',
    videos: [{ title: 'The idea', src: '6.EE-6.mp4' }, { title: 'Worked examples', src: '6.EE-6-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-6-trap.mp4' }],
    concept: [
      'The independent variable is the one you choose (like time).',
      'The dependent variable responds to it (like distance).',
      'An equation like d = 50t lets you build a table of matching values.',
    ],
    examples: [
      { q: 'If y = 3x, what is y when x = 5?', steps: ['Substitute x = 5.', 'y = 3·5.', '= 15.'], answer: '15' },
      { q: 'A car drives d = 60t miles. How far in 2 hours?', steps: ['t = 2.', 'd = 60·2.', '= 120 miles.'], answer: '120' },
      { q: 'If y = x + 4, what is y when x = 10?', steps: ['y = 10 + 4.', '= 14.'], answer: '14' },
    ],
    practice: [
      { q: 'If y = 2x, find y when x = 7.', answers: ['14'], steps: ['y = 2·7 = 14.'] },
      { q: 'Cost c = 5n dollars for n tickets. Cost of 4 tickets?', answers: ['20', '$20'], steps: ['c = 5·4 = 20.'] },
    ],
    watchOut: 'The dependent variable is usually alone on one side (y = …).',
  },

  // ---------------- 6.G — Geometry ----------------
  {
    domain: '6.G', unit: 1, title: 'Area of triangles & rectangles',
    objective: 'Find area with the right formula.',
    videos: [{ title: 'The idea', src: '6.G-1.mp4' }, { title: 'Worked examples', src: '6.G-1-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-1-trap.mp4' }],
    concept: [
      'Rectangle area = length × width.',
      'Triangle area = ½ × base × height.',
      'The height must be perpendicular (straight) to the base.',
    ],
    examples: [
      { q: 'Triangle with base 8 and height 5.', steps: ['Area = ½ · base · height.', '½ · 8 · 5.', '= 20 square units.'], answer: '20' },
      { q: 'Rectangle 7 by 3.', steps: ['Area = length × width.', '7 × 3.', '= 21 square units.'], answer: '21' },
      { q: 'Triangle base 10, height 4.', steps: ['½ · 10 · 4.', '= 20 square units.'], answer: '20' },
    ],
    practice: [
      { q: 'Area of a rectangle 6 by 9? (square units)', answers: ['54'], steps: ['6 × 9 = 54.'] },
      { q: 'Area of a triangle with base 12 and height 5?', answers: ['30'], steps: ['½ · 12 · 5 = 30.'] },
    ],
    watchOut: 'Do not forget the ½ for triangles.',
  },
  {
    domain: '6.G', unit: 2, title: 'Polygons on the grid',
    objective: 'Use coordinates to find side lengths.',
    videos: [{ title: 'The idea', src: '6.G-2.mp4' }, { title: 'Worked examples', src: '6.G-2-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-2-trap.mp4' }],
    concept: [
      'Plot the vertices in order.',
      'Horizontal side length = difference of x-values; vertical = difference of y-values.',
      'Then use the side lengths in an area or perimeter formula.',
    ],
    examples: [
      { q: 'Length from (2, 1) to (2, 6)?', steps: ['Same x → vertical.', '6 − 1.', '= 5.'], answer: '5' },
      { q: 'Length from (1, 3) to (7, 3)?', steps: ['Same y → horizontal.', '7 − 1.', '= 6.'], answer: '6' },
      { q: 'Rectangle with corners (0,0),(4,0),(4,2),(0,2). Area?', steps: ['Width 4, height 2.', '4 × 2.', '= 8.'], answer: '8' },
    ],
    practice: [
      { q: 'Distance from (3, -2) to (3, 5)?', answers: ['7'], steps: ['Same x → subtract y-values.', '5 − (−2) = 7.'] },
      { q: 'A square has a side from (0,0) to (5,0). Its area?', answers: ['25'], steps: ['Side = 5.', 'Area = 5 × 5 = 25.'] },
    ],
    watchOut: 'Subtract directly only when points share an x (vertical) or y (horizontal).',
  },
  {
    domain: '6.G', unit: 3, title: 'Volume of prisms',
    objective: 'Find the volume of a rectangular prism.',
    videos: [{ title: 'The idea', src: '6.G-3.mp4' }, { title: 'Worked examples', src: '6.G-3-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-3-trap.mp4' }],
    concept: [
      'Volume = length × width × height.',
      'It works even with fraction edge lengths.',
      'Volume is measured in cubic units.',
    ],
    examples: [
      { q: 'Box 1/2 by 3 by 4.', steps: ['V = l·w·h.', '½ · 3 · 4 = ½ · 12.', '= 6 cubic units.'], answer: '6' },
      { q: 'Box 2 by 3 by 5.', steps: ['2 · 3 · 5.', '= 30 cubic units.'], answer: '30' },
      { q: 'Cube with side 3.', steps: ['3 · 3 · 3.', '= 27 cubic units.'], answer: '27' },
    ],
    practice: [
      { q: 'Volume of a 4 by 2 by 3 box? (cubic units)', answers: ['24'], steps: ['4 · 2 · 3 = 24.'] },
      { q: 'Volume of a box 1/2 by 4 by 6?', answers: ['12'], steps: ['½ · 4 · 6 = ½ · 24 = 12.'] },
    ],
    watchOut: 'Volume uses three dimensions — the answer is in cubic units.',
  },
  {
    domain: '6.G', unit: 4, title: 'Surface area with nets',
    objective: 'Add up the faces of a 3-D shape.',
    videos: [{ title: 'The idea', src: '6.G-4.mp4' }, { title: 'Worked examples', src: '6.G-4-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-4-trap.mp4' }],
    concept: [
      'A net unfolds a solid into flat faces.',
      'Find the area of each face, then add them all up.',
      'A box has 3 pairs of matching faces.',
    ],
    examples: [
      { q: 'Cube with side 2 — surface area?', steps: ['One face = 2 × 2 = 4.', '6 faces.', '6 × 4 = 24.'], answer: '24' },
      { q: 'Cube with side 3 — surface area?', steps: ['One face = 9.', '6 × 9.', '= 54.'], answer: '54' },
      { q: 'A box 2×3×1: area of the 2×3 face?', steps: ['2 × 3.', '= 6 square units.'], answer: '6' },
    ],
    practice: [
      { q: 'Surface area of a cube with side 5? (square units)', answers: ['150'], steps: ['One face = 25.', '6 × 25 = 150.'] },
      { q: 'A 2×2 square face has what area?', answers: ['4'], steps: ['2 × 2 = 4.'] },
    ],
    watchOut: 'Surface area is in square units; do not multiply all three sides (that is volume).',
  },
  {
    domain: '6.G', unit: 5, title: 'Composite figures',
    objective: 'Find the area of combined shapes.',
    videos: [{ title: 'The idea', src: '6.G-5.mp4' }, { title: 'Worked examples', src: '6.G-5-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-5-trap.mp4' }],
    concept: [
      'Split the figure into rectangles and triangles.',
      'Find each piece’s area.',
      'Add the pieces (or subtract a cut-out hole).',
    ],
    examples: [
      { q: 'An L-shape = a 4×2 rectangle plus a 3×2 rectangle. Total area?', steps: ['4×2 = 8.', '3×2 = 6.', '8 + 6 = 14.'], answer: '14' },
      { q: 'A 5×5 square with a 2×2 square cut out. Area left?', steps: ['25 − 4.', '= 21.'], answer: '21' },
      { q: 'A 6×3 rectangle with a triangle (base 6, height 2) on top. Area?', steps: ['Rectangle = 18.', 'Triangle = ½·6·2 = 6.', '18 + 6 = 24.'], answer: '24' },
    ],
    practice: [
      { q: 'Two rectangles, 3×4 and 2×4. Combined area?', answers: ['20'], steps: ['12 + 8 = 20.'] },
      { q: 'A 10×10 square with a 5×5 corner removed. Area?', answers: ['75'], steps: ['100 − 25 = 75.'] },
    ],
    watchOut: 'Do not double-count where the pieces meet.',
  },
  {
    domain: '6.G', unit: 6, title: 'Area & volume review',
    objective: 'Pick the right formula for the shape.',
    videos: [{ title: 'The idea', src: '6.G-6.mp4' }, { title: 'Worked examples', src: '6.G-6-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-6-trap.mp4' }],
    concept: [
      'Flat shape → area (square units). Solid → volume (cubic units).',
      'Triangle: ½·b·h. Rectangle: l·w. Prism: l·w·h.',
      'Underline what is asked and the units before you start.',
    ],
    examples: [
      { q: 'Rectangular prism 2×3×5 — volume?', steps: ['l·w·h = 2·3·5.', '= 30 cubic units.'], answer: '30' },
      { q: 'Rectangle 8×4 — area?', steps: ['8 × 4.', '= 32 square units.'], answer: '32' },
      { q: 'Triangle base 6, height 9 — area?', steps: ['½·6·9.', '= 27 square units.'], answer: '27' },
    ],
    practice: [
      { q: 'A cube has side 4. Its volume?', answers: ['64'], steps: ['4·4·4 = 64.'] },
      { q: 'A triangle has base 10 and height 3. Its area?', answers: ['15'], steps: ['½·10·3 = 15.'] },
    ],
    watchOut: 'Square units for area, cubic units for volume.',
  },

  // ---------------- 6.SP — Statistics & Probability ----------------
  {
    domain: '6.SP', unit: 1, title: 'Mean, median & mode',
    objective: 'Find the measures of center.',
    videos: [{ title: 'The idea', src: '6.SP-1.mp4' }, { title: 'Worked examples', src: '6.SP-1-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-1-trap.mp4' }],
    concept: [
      'Mean = add all the values, then divide by how many there are.',
      'Median = the middle value once they are sorted.',
      'Mode = the value that appears most often.',
    ],
    examples: [
      { q: 'Mean of 4, 6, 8?', steps: ['Add: 4+6+8 = 18.', 'Divide by 3.', '= 6.'], answer: '6' },
      { q: 'Median of 3, 7, 5?', steps: ['Sort: 3, 5, 7.', 'Middle value.', '= 5.'], answer: '5' },
      { q: 'Mode of 2, 4, 4, 9?', steps: ['4 appears most.', '= 4.'], answer: '4' },
    ],
    practice: [
      { q: 'Mean of 10, 20, 30?', answers: ['20'], steps: ['Sum = 60.', '60 ÷ 3 = 20.'] },
      { q: 'Median of 8, 2, 5, 9, 4?', answers: ['5'], steps: ['Sort: 2,4,5,8,9.', 'Middle = 5.'] },
    ],
    watchOut: 'Sort the numbers before finding the median.',
  },
  {
    domain: '6.SP', unit: 2, title: 'Choosing a center',
    objective: 'Decide which average to use.',
    videos: [{ title: 'The idea', src: '6.SP-2.mp4' }, { title: 'Worked examples', src: '6.SP-2-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-2-trap.mp4' }],
    concept: [
      'The mean uses every value, so outliers pull it.',
      'The median is the middle and resists outliers.',
      'For very lopsided data, the median often describes it better.',
    ],
    examples: [
      { q: 'Data 2, 3, 4, 100 — which center is more typical?', steps: ['Mean = 27.25 (pulled up by 100).', 'Median = 3.5.', '= median.'], answer: 'median' },
      { q: 'Mean of 1, 2, 3, 4, 5?', steps: ['Sum = 15.', '15 ÷ 5.', '= 3.'], answer: '3' },
      { q: 'Does an outlier change the median much? (yes/no)', steps: ['The median is just the middle.', '= no.'], answer: 'no' },
    ],
    practice: [
      { q: 'Salaries 30, 32, 35, 200 (thousands). Mean or median for "typical"?', answers: ['median'], steps: ['200 is an outlier inflating the mean.', '= median.'] },
      { q: 'Median of 4, 4, 10?', answers: ['4'], steps: ['Sorted middle is 4.'] },
    ],
    watchOut: 'One huge or tiny value can make the mean misleading.',
  },
  {
    domain: '6.SP', unit: 3, title: 'Spread: range, IQR & MAD',
    objective: 'Measure how spread out data is.',
    videos: [{ title: 'The idea', src: '6.SP-3.mp4' }, { title: 'Worked examples', src: '6.SP-3-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-3-trap.mp4' }],
    concept: [
      'Range = maximum − minimum.',
      'IQR = upper quartile − lower quartile (spread of the middle half).',
      'MAD = the average distance of values from the mean.',
    ],
    examples: [
      { q: 'Range of 5, 9, 12, 20?', steps: ['Max 20, min 5.', '20 − 5.', '= 15.'], answer: '15' },
      { q: 'Range of 3, 3, 3?', steps: ['Max = min = 3.', '3 − 3.', '= 0.'], answer: '0' },
      { q: 'Mean of 2,4,6 is 4. Distance of 6 from the mean?', steps: ['|6 − 4|.', '= 2.'], answer: '2' },
    ],
    practice: [
      { q: 'Range of 14, 6, 22, 9?', answers: ['16'], steps: ['Max 22, min 6.', '22 − 6 = 16.'] },
      { q: 'Range of 7, 7, 7, 7?', answers: ['0'], steps: ['Max − min = 0.'] },
    ],
    watchOut: 'Spread is different from center — they answer different questions.',
  },
  {
    domain: '6.SP', unit: 4, title: 'Displaying data',
    objective: 'Read dot plots, histograms & box plots.',
    videos: [{ title: 'The idea', src: '6.SP-4.mp4' }, { title: 'Worked examples', src: '6.SP-4-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-4-trap.mp4' }],
    concept: [
      'Dot plot: one dot per value.',
      'Histogram: bars over equal intervals, with no gaps.',
      'Box plot: shows the median and the quartiles.',
    ],
    examples: [
      { q: 'On a box plot, what does the line inside the box show?', steps: ['The box spans the middle half.', 'The inside line is the middle.', '= the median.'], answer: 'median' },
      { q: 'A dot plot has 3 dots above 5. How many values equal 5?', steps: ['One dot = one value.', '= 3.'], answer: '3' },
      { q: 'Do histogram bars touch (no gaps)? (yes/no)', steps: ['Histograms group equal intervals.', '= yes.'], answer: 'yes' },
    ],
    practice: [
      { q: 'A dot plot has 4 dots above the value 2. How many data points are 2?', answers: ['4'], steps: ['Each dot is one value → 4.'] },
      { q: 'Which display shows the median and quartiles: box plot or bar graph?', answers: ['box plot', 'boxplot'], steps: ['Box plots show median + quartiles.'] },
    ],
    watchOut: 'Histograms group data into ranges; bar graphs use separate categories.',
  },
  {
    domain: '6.SP', unit: 5, title: 'Describing a distribution',
    objective: 'Summarize data in context.',
    videos: [{ title: 'The idea', src: '6.SP-5.mp4' }, { title: 'Worked examples', src: '6.SP-5-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-5-trap.mp4' }],
    concept: [
      'Mention center (typical value), spread (variability), and shape.',
      'Note any outliers or clusters.',
      'Tie it back to the question being asked.',
    ],
    examples: [
      { q: 'Scores cluster near 80 with one 30. The 30 is a what?', steps: ['It sits far from the rest.', '= an outlier.'], answer: 'outlier' },
      { q: 'Most values bunch left with a long right tail. The shape is…?', steps: ['Tail points right.', '= skewed right.'], answer: 'skewed right' },
      { q: 'A center plus one more thing describe a distribution. The other thing is…?', steps: ['Center plus spread.', '= spread.'], answer: 'spread' },
    ],
    practice: [
      { q: 'A value far from all the others is called an ___.', answers: ['outlier'], steps: ['Outliers sit far from the rest.'] },
      { q: 'Besides center, name one thing a good description includes.', answers: ['spread', 'variability', 'shape'], steps: ['Center AND spread (or shape).'] },
    ],
    watchOut: 'A good description includes center AND spread, not just the average.',
  },
  {
    domain: '6.SP', unit: 6, title: 'Summarizing data sets',
    objective: 'Pull the key numbers from a data set.',
    videos: [{ title: 'The idea', src: '6.SP-6.mp4' }, { title: 'Worked examples', src: '6.SP-6-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-6-trap.mp4' }],
    concept: [
      'Count how many values there are (n).',
      'Find the center (mean or median).',
      'Find the spread (range or IQR).',
    ],
    examples: [
      { q: 'Data 3, 5, 5, 7 — the mode?', steps: ['5 appears twice.', '= 5.'], answer: '5' },
      { q: 'How many values in 2, 4, 6, 8, 10? (n)', steps: ['Count them.', '= 5.'], answer: '5' },
      { q: 'Mean of 3, 5, 5, 7?', steps: ['Sum = 20.', '20 ÷ 4.', '= 5.'], answer: '5' },
    ],
    practice: [
      { q: 'Mode of 6, 6, 2, 9, 6?', answers: ['6'], steps: ['6 appears three times.'] },
      { q: 'How many data points: 11, 13, 15, 17?', answers: ['4'], steps: ['Count: 4 values.'] },
    ],
    watchOut: 'Check whether the question wants center or spread before answering.',
  },

  // ---------------- 5.F — Gr-5 Foundations ----------------
  {
    domain: '5.F', unit: 1, title: 'Place value & big operations',
    objective: 'Read place value and multiply/divide big numbers with confidence.',
    videos: [{ title: 'The idea', src: '5.F-1-idea.mp4' }, { title: 'Worked examples', src: '5.F-1-examples.mp4' }, { title: 'Avoid the trap', src: '5.F-1-trap.mp4' }],
    concept: [
      'Each place is 10 times the place to its right — the 7 in 47,283 is worth 7,000.',
      'To multiply big numbers, break them apart: 38 × 27 = 38 × 20 + 38 × 7.',
      'To divide, peel off easy chunks: 504 ÷ 8 → 480 ÷ 8 = 60, then 24 ÷ 8 = 3.',
    ],
    examples: [
      { q: 'What is the value of the 5 in 4,562?', steps: ['The 5 sits in the hundreds place.', '5 × 100 = 500.'], answer: '500' },
      { q: 'Multiply 24 × 13.', steps: ['24 × 10 = 240.', '24 × 3 = 72.', '240 + 72 = 312.'], answer: '312' },
      { q: 'Divide 432 ÷ 6.', steps: ['6 × 70 = 420.', '432 − 420 = 12, and 12 ÷ 6 = 2.', '70 + 2 = 72.'], answer: '72' },
    ],
    practice: [
      { q: 'What is the value of the 8 in 28,514?', answers: ['8000', '8,000'], steps: ['The 8 is in the thousands place.', '8 × 1000 = 8000.'] },
      { q: 'Multiply 60 × 40.', answers: ['2400', '2,400'], steps: ['6 × 4 = 24.', 'Attach the two zeros: 2400.'] },
    ],
    watchOut: 'The VALUE of a digit is not the digit itself — the 7 in 47,283 is worth 7,000, not 7.',
  },
  {
    domain: '5.F', unit: 2, title: 'Adding & subtracting fractions',
    objective: 'Combine fractions even when the denominators differ.',
    videos: [{ title: 'The idea', src: '5.F-2-idea.mp4' }, { title: 'Worked examples', src: '5.F-2-examples.mp4' }, { title: 'Avoid the trap', src: '5.F-2-trap.mp4' }],
    concept: [
      'You can only add or subtract pieces that are the SAME size — same denominator.',
      'Rewrite each fraction using a common denominator first (often the LCM).',
      'Then add or subtract just the numerators and simplify.',
    ],
    examples: [
      { q: 'Add 1/2 + 1/3.', steps: ['Common denominator: 6.', '1/2 = 3/6 and 1/3 = 2/6.', '3/6 + 2/6 = 5/6.'], answer: '5/6' },
      { q: 'Subtract 3/4 − 1/2.', steps: ['1/2 = 2/4.', '3/4 − 2/4 = 1/4.'], answer: '1/4' },
      { q: 'Add 2/3 + 3/4.', steps: ['Twelfths: 8/12 + 9/12.', '= 17/12 = 1 5/12.'], answer: '1 5/12' },
    ],
    practice: [
      { q: 'Add 1/4 + 1/4.', answers: ['1/2', '2/4', '0.5'], steps: ['Same denominator — add tops: 2/4.', 'Simplify: 1/2.'] },
      { q: 'Subtract 5/8 − 1/8.', answers: ['1/2', '4/8', '0.5'], steps: ['5 − 1 = 4 eighths.', '4/8 = 1/2.'] },
    ],
    watchOut: 'Never add the denominators! 1/2 + 1/3 is NOT 2/5 — make the pieces match first.',
  },
  {
    domain: '5.F', unit: 3, title: 'Multiplying & dividing fractions',
    objective: 'Multiply fractions straight across and divide using reciprocals.',
    videos: [{ title: 'The idea', src: '5.F-3-idea.mp4' }, { title: 'Worked examples', src: '5.F-3-examples.mp4' }, { title: 'Avoid the trap', src: '5.F-3-trap.mp4' }],
    concept: [
      'To multiply fractions: tops together, bottoms together — then simplify.',
      '"Of" means multiply: 3/5 of 40 is 3/5 × 40.',
      'Dividing asks "how many fit?": 4 ÷ 1/3 = 12 because each whole holds 3 thirds.',
    ],
    examples: [
      { q: 'Multiply 1/2 × 1/4.', steps: ['1 × 1 = 1 and 2 × 4 = 8.', 'Product: 1/8.'], answer: '1/8' },
      { q: 'Divide 6 ÷ 1/2.', steps: ['Each whole holds 2 halves.', '6 × 2 = 12.'], answer: '12' },
      { q: 'Find 2/3 of 12.', steps: ['1/3 of 12 is 4.', '2/3 is 2 × 4 = 8.'], answer: '8' },
    ],
    practice: [
      { q: 'Multiply 1/3 × 1/2.', answers: ['1/6'], steps: ['Tops: 1. Bottoms: 6.', '= 1/6.'] },
      { q: 'Divide 3 ÷ 1/4.', answers: ['12'], steps: ['Each whole holds 4 quarters.', '3 × 4 = 12.'] },
    ],
    watchOut: 'Dividing by a fraction makes the answer BIGGER, not smaller — 4 ÷ 1/3 = 12.',
  },
  {
    domain: '5.F', unit: 4, title: 'Decimals: place value & operations',
    objective: 'Compare, round, and compute with decimals.',
    videos: [{ title: 'The idea', src: '5.F-4-idea.mp4' }, { title: 'Worked examples', src: '5.F-4-examples.mp4' }, { title: 'Avoid the trap', src: '5.F-4-trap.mp4' }],
    concept: [
      'Line up the decimal points to add or subtract — 2.5 is 2.50.',
      'To compare decimals, give them the same number of places: 0.5 = 0.50 > 0.45.',
      'When multiplying, count decimal places: tenths × tenths = hundredths.',
    ],
    examples: [
      { q: 'Add 0.3 + 0.45.', steps: ['Write 0.3 as 0.30.', '0.30 + 0.45 = 0.75.'], answer: '0.75' },
      { q: 'Subtract 2 − 0.85.', steps: ['Count up: 0.85 + 0.15 = 1.', '1 + 1 = 2, so total counted = 1.15.'], answer: '1.15' },
      { q: 'Multiply 0.5 × 0.8.', steps: ['5 × 8 = 40.', 'Two decimal places → 0.40 = 0.4.'], answer: '0.4' },
    ],
    practice: [
      { q: 'Add 0.2 + 0.35.', answers: ['0.55', '.55'], steps: ['0.20 + 0.35.', '= 0.55.'] },
      { q: 'Multiply 1.5 × 4.', answers: ['6', '6.0'], steps: ['1 × 4 = 4 and 0.5 × 4 = 2.', '4 + 2 = 6.'] },
    ],
    watchOut: 'Longer is not bigger: 0.5 beats 0.45 even though 45 has more digits.',
  },
  {
    domain: '5.F', unit: 5, title: 'Measurement, conversions & volume',
    objective: 'Convert units and find the volume of boxes.',
    videos: [{ title: 'The idea', src: '5.F-5-idea.mp4' }, { title: 'Worked examples', src: '5.F-5-examples.mp4' }, { title: 'Avoid the trap', src: '5.F-5-trap.mp4' }],
    concept: [
      'Bigger unit → smaller unit: multiply (3 m = 300 cm). Smaller → bigger: divide.',
      'Memorize the anchors: 100 cm = 1 m, 1000 g = 1 kg, 12 in = 1 ft, 4 qt = 1 gal, 60 min = 1 hr.',
      'Volume of a box = length × width × height, measured in cubic units.',
    ],
    examples: [
      { q: 'Convert 2 meters to centimeters.', steps: ['1 m = 100 cm.', '2 × 100 = 200 cm.'], answer: '200' },
      { q: 'Volume of a 3 × 2 × 4 box?', steps: ['3 × 2 = 6.', '6 × 4 = 24 cubic units.'], answer: '24' },
      { q: 'Convert 5 feet to inches.', steps: ['1 ft = 12 in.', '5 × 12 = 60 inches.'], answer: '60' },
    ],
    practice: [
      { q: 'Convert 400 cm to meters.', answers: ['4', '4 m'], steps: ['100 cm = 1 m.', '400 ÷ 100 = 4 m.'] },
      { q: 'Volume of a cube with edge 3?', answers: ['27'], steps: ['3 × 3 × 3.', '= 27 cubic units.'] },
    ],
    watchOut: 'Multiply or divide? Going to a SMALLER unit means MORE of them — multiply.',
  },
  {
    domain: '5.F', unit: 6, title: 'Coordinate plane, patterns & line plots',
    objective: 'Plot points, extend patterns, and read line plots.',
    videos: [{ title: 'The idea', src: '5.F-6-idea.mp4' }, { title: 'Worked examples', src: '5.F-6-examples.mp4' }, { title: 'Avoid the trap', src: '5.F-6-trap.mp4' }],
    concept: [
      'A point is (x, y): go ACROSS x first, then UP y. "Run before you jump."',
      'A pattern with a constant jump: term n = start + jump × (n − 1).',
      'On a line plot, every X is one data value — count Xs to answer questions.',
    ],
    examples: [
      { q: 'Plot: right 3, up 2 from the origin. Coordinates?', steps: ['Across 3 → x = 3.', 'Up 2 → y = 2.', 'Point: (3, 2).'], answer: '(3,2)' },
      { q: 'Pattern 0, 4, 8, … what is the 5th term?', steps: ['Four jumps of +4 from 0.', '0 + 4 × 4 = 16.'], answer: '16' },
      { q: 'A line plot shows 2 Xs above 1/2. How many items measured 1/2?', steps: ['Each X is one item.', 'Two Xs → 2 items.'], answer: '2' },
    ],
    practice: [
      { q: 'Start at the origin, go right 4 and up 2. Coordinates? (like (x,y))', answers: ['(4,2)', '(4, 2)', '4,2'], steps: ['x = 4, y = 2.', '(4, 2).'] },
      { q: 'Pattern 5, 10, 15, … what comes next?', answers: ['20'], steps: ['The jump is +5.', '15 + 5 = 20.'] },
    ],
    watchOut: 'Do not swap the coordinates — (3, 2) and (2, 3) are different points.',
  },

  // ---------------- 6.x — Units 7–10 (advanced) ----------------
  // 6.RP
  {
    domain: '6.RP', unit: 7, title: 'Percent applications',
    objective: 'Find a percent of a number; use percent for tips, tax, and discounts.',
    videos: [{ title: 'Worked examples', src: '6.RP-7-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-7-trap.mp4' }],
    concept: [
      'A percent is a fraction out of 100. So 25% = 25/100 = 1/4.',
      'To find X% of Y: convert the percent to a decimal (move dot LEFT two places), then multiply.',
      'Discount: subtract from the original. Tax/tip: add on top.',
    ],
    examples: [
      { q: 'What is 25% of 80?', steps: ['25% = 0.25.', '0.25 × 80 = 20.'], answer: '20' },
      { q: '15% of 60?', steps: ['10% of 60 = 6. 5% of 60 = 3.', '10% + 5% = 6 + 3 = 9.'], answer: '9' },
      { q: 'A $40 shirt is 30% off. Sale price?', steps: ['30% of $40 = $12 off.', '$40 − $12 = $28.'], answer: '$28' },
    ],
    practice: [
      { q: '10% of 250?', answers: ['25'], steps: ['Move the dot one place left.', '250 → 25.'] },
      { q: '50% of 86?', answers: ['43'], steps: ['50% is half.', '86 ÷ 2 = 43.'] },
    ],
    watchOut: '"% off" means subtract; "% increase" means add. Read the question carefully.',
  },
  {
    domain: '6.RP', unit: 8, title: 'Rates & unit pricing',
    objective: 'Compute speeds, unit prices, and "better-deal" comparisons.',
    videos: [{ title: 'Worked examples', src: '6.RP-8-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-8-trap.mp4' }],
    concept: [
      'A unit rate is "per 1": miles per hour, dollars per pound, cost per item.',
      'Divide the total by the number of units to get the unit rate.',
      'To compare two deals, find the unit price of EACH and pick the smaller.',
    ],
    examples: [
      { q: '180 miles in 3 hours — what is the speed?', steps: ['Speed = miles ÷ hours.', '180 ÷ 3 = 60 mph.'], answer: '60' },
      { q: '12 cookies cost $6. Cost per cookie?', steps: ['$6 ÷ 12 cookies.', '= $0.50 per cookie.'], answer: '$0.50' },
      { q: 'Is 4 lbs for $10 or 6 lbs for $12 cheaper per lb?', steps: ['$10/4 = $2.50/lb.', '$12/6 = $2.00/lb.', 'Pick the smaller: $2.00/lb (6 for $12).'], answer: '6 for $12' },
    ],
    practice: [
      { q: 'A car drives 240 miles in 4 hours. Speed in mph?', answers: ['60'], steps: ['240 ÷ 4 = 60 mph.'] },
      { q: '8 oranges cost $4. Cost per orange?', answers: ['$0.50', '0.5', '0.50'], steps: ['$4 ÷ 8.', '= $0.50 each.'] },
    ],
    watchOut: 'Match the units: a "mph" answer always means miles ON TOP, hours on the bottom.',
  },
  {
    domain: '6.RP', unit: 9, title: 'Measurement conversions',
    objective: 'Convert between standard and metric units using ratio reasoning.',
    videos: [{ title: 'Worked examples', src: '6.RP-9-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-9-trap.mp4' }],
    concept: [
      'Use the anchor: 12 in = 1 ft, 3 ft = 1 yd, 100 cm = 1 m, 1000 m = 1 km, 16 oz = 1 lb.',
      'Going to a SMALLER unit → MORE of them → multiply by the anchor.',
      'Going to a BIGGER unit → FEWER of them → divide.',
    ],
    examples: [
      { q: 'How many inches in 2 feet?', steps: ['1 ft = 12 in.', '2 × 12 = 24 in.'], answer: '24' },
      { q: 'Convert 4 yards to feet.', steps: ['1 yd = 3 ft.', '4 × 3 = 12 ft.'], answer: '12' },
      { q: 'Convert 250 cm to meters.', steps: ['100 cm = 1 m.', '250 ÷ 100 = 2.5 m.'], answer: '2.5' },
    ],
    practice: [
      { q: 'How many feet in 36 inches?', answers: ['3'], steps: ['12 in = 1 ft.', '36 ÷ 12 = 3 ft.'] },
      { q: 'Convert 5 km to meters.', answers: ['5000'], steps: ['1 km = 1000 m.', '5 × 1000 = 5000 m.'] },
    ],
    watchOut: 'Inches → feet uses DIVISION (smaller-of-bigger fits FEWER times).',
  },
  {
    domain: '6.RP', unit: 10, title: 'Ratio & proportion problem-solving',
    objective: 'Use ratio tables and equivalent ratios to scale recipes and groups.',
    videos: [{ title: 'Worked examples', src: '6.RP-10-examples.mp4' }, { title: 'Avoid the trap', src: '6.RP-10-trap.mp4' }],
    concept: [
      'An equivalent ratio multiplies BOTH parts by the same number.',
      'A ratio table is one fast way: write the rate as a row, then scale columns.',
      'For a recipe scaled by factor k: multiply EVERY ingredient by k.',
    ],
    examples: [
      { q: '4 servings need 6 cups of flour. Flour for 6 servings?', steps: ['Scale factor = 6 ÷ 4 = 1.5.', '6 × 1.5 = 9 cups.'], answer: '9' },
      { q: 'A shelter has dogs : cats = 3 : 5, with 20 cats. How many dogs?', steps: ['Cat ratio number is 5; actual count is 20.', 'Multiplier = 20 ÷ 5 = 4.', 'Dogs = 3 × 4 = 12.'], answer: '12' },
      { q: 'Is 2:3 equivalent to 8:12?', steps: ['Multiply 2:3 by 4: 8:12. ✓', 'Yes, equivalent.'], answer: 'yes' },
    ],
    practice: [
      { q: '5 packs cost $20. Cost for 8 packs?', answers: ['$32', '32'], steps: ['Per-pack: $20 ÷ 5 = $4.', '$4 × 8 = $32.'] },
      { q: 'A recipe uses 3 eggs for 12 cookies. Eggs for 36 cookies?', answers: ['9'], steps: ['36 ÷ 12 = 3× the cookies.', '3 × 3 = 9 eggs.'] },
    ],
    watchOut: 'Scale BOTH parts of the ratio by the same factor — never just one side.',
  },

  // 6.NS
  {
    domain: '6.NS', unit: 7, title: 'Whole-number addition & subtraction',
    objective: 'Add and subtract multi-digit whole numbers fluently.',
    videos: [{ title: 'Worked examples', src: '6.NS-7-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-7-trap.mp4' }],
    concept: [
      'Stack place values: ones under ones, tens under tens.',
      'When digits add to 10 or more, carry the 1 to the next column.',
      'When a digit is too small to subtract, borrow from the next column.',
    ],
    examples: [
      { q: '425 + 376?', steps: ['5+6 = 11. Write 1, carry 1.', '2+7+1 = 10. Write 0, carry 1.', '4+3+1 = 8. Answer: 801.'], answer: '801' },
      { q: '952 − 387?', steps: ['Borrow: 2→12, ten becomes 4. 12−7 = 5.', '4→14 (borrowed), hundred becomes 8. 14−8 = 6.', '8−3 = 5. Answer: 565.'], answer: '565' },
      { q: '1003 − 247?', steps: ['Borrow across zeros carefully.', '1003 − 247 = 756.'], answer: '756' },
    ],
    practice: [
      { q: '618 + 274?', answers: ['892'], steps: ['8+4=12 (write 2 carry 1).', '1+7+1=9, 6+2=8 → 892.'] },
      { q: '500 − 173?', answers: ['327'], steps: ['Borrow across the zeros.', '500 − 173 = 327.'] },
    ],
    watchOut: 'Carrying and borrowing pass to the NEXT-LARGER column. Don\'t skip a place.',
  },
  {
    domain: '6.NS', unit: 8, title: 'Comparing & ordering signed numbers',
    objective: 'Order positive and negative numbers using a number line.',
    videos: [{ title: 'Worked examples', src: '6.NS-8-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-8-trap.mp4' }],
    concept: [
      'On a number line, RIGHT is bigger, LEFT is smaller.',
      'Any negative number is less than ANY positive number.',
      'Among negatives, the one CLOSER to zero is bigger.',
    ],
    examples: [
      { q: 'Which is greater: −3 or 1?', steps: ['1 is to the right of 0; −3 is left.', '1 > −3.'], answer: '1' },
      { q: 'Order −2, 0, −5 from least to greatest.', steps: ['−5 is leftmost.', 'Then −2, then 0.', '−5, −2, 0.'], answer: '-5,-2,0' },
      { q: 'Which is greater: −4 or −9?', steps: ['Both negative; −4 is closer to 0.', '−4 > −9.'], answer: '-4' },
    ],
    practice: [
      { q: 'Greater: −1 or −7?', answers: ['-1'], steps: ['−1 is closer to 0.', '−1 > −7.'] },
      { q: 'Order −3, 2, −5 least to greatest.', answers: ['-5,-3,2', '-5, -3, 2'], steps: ['Leftmost first.', '−5 < −3 < 2.'] },
    ],
    watchOut: 'Negative numbers reverse the size order — −10 is SMALLER than −2, not bigger.',
  },
  {
    domain: '6.NS', unit: 9, title: 'Opposites & absolute value',
    objective: 'Find opposites and compute absolute value as distance from 0.',
    videos: [{ title: 'Worked examples', src: '6.NS-9-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-9-trap.mp4' }],
    concept: [
      'The OPPOSITE of n is its mirror image across 0: opposite of 5 is −5.',
      'Absolute value |n| is the distance from 0 — always 0 or positive.',
      'Opposite of opposite returns home: −(−n) = n.',
    ],
    examples: [
      { q: 'What is the opposite of 7?', steps: ['Mirror across 0.', 'Opposite of 7 is −7.'], answer: '-7' },
      { q: 'What is |−12|?', steps: ['Distance from 0 to −12 is 12.', '|−12| = 12.'], answer: '12' },
      { q: 'Opposite of (opposite of −3)?', steps: ['Opposite of −3 = 3.', 'Opposite of 3 = −3.'], answer: '-3' },
    ],
    practice: [
      { q: 'Opposite of −15?', answers: ['15'], steps: ['Mirror across 0.', '15.'] },
      { q: '|9|?', answers: ['9'], steps: ['Distance from 0 is 9.', '|9| = 9.'] },
    ],
    watchOut: 'Absolute value bars are NOT parentheses — |−5| = 5, not −5.',
  },
  {
    domain: '6.NS', unit: 10, title: 'Coordinate plane: distance & polygons',
    objective: 'Find distances between points on a grid and side lengths of axis-aligned polygons.',
    videos: [{ title: 'Worked examples', src: '6.NS-10-examples.mp4' }, { title: 'Avoid the trap', src: '6.NS-10-trap.mp4' }],
    concept: [
      'If two points share an x-coordinate, distance = |y₁ − y₂| (vertical).',
      'If they share a y-coordinate, distance = |x₁ − x₂| (horizontal).',
      'For a rectangle from corners, count the horizontal gap and the vertical gap.',
    ],
    examples: [
      { q: 'Distance from (3, 2) to (3, 7)?', steps: ['Same x → vertical distance.', '|7 − 2| = 5 units.'], answer: '5' },
      { q: 'Distance from (−2, 4) to (5, 4)?', steps: ['Same y → horizontal.', '|5 − (−2)| = 7 units.'], answer: '7' },
      { q: 'Side lengths of the rectangle with corners (1, 1), (5, 1), (5, 4), (1, 4)?', steps: ['Width = |5 − 1| = 4.', 'Height = |4 − 1| = 3.'], answer: '4 and 3' },
    ],
    practice: [
      { q: 'Distance from (0, 0) to (0, 6)?', answers: ['6'], steps: ['Same x; vertical.', '|6 − 0| = 6.'] },
      { q: 'Distance from (−3, 1) to (4, 1)?', answers: ['7'], steps: ['Same y; horizontal.', '|4 − (−3)| = 7.'] },
    ],
    watchOut: 'Subtract carefully when one coordinate is negative: 5 − (−2) = 7, not 3.',
  },

  // 6.EE
  {
    domain: '6.EE', unit: 7, title: 'Parts of expressions',
    objective: 'Identify coefficients, terms, factors, and constants.',
    videos: [{ title: 'Worked examples', src: '6.EE-7-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-7-trap.mp4' }],
    concept: [
      'A TERM is one piece separated by + or −. In 4x + 7, the terms are 4x and 7.',
      'A COEFFICIENT is the number multiplied by a variable. In 4x, the coefficient is 4.',
      'A CONSTANT term has no variable. In 7 + 3x, the constant is 7.',
    ],
    examples: [
      { q: 'Coefficient of y in 4y?', steps: ['Number stuck to y.', '4.'], answer: '4' },
      { q: 'Constant term in 7 + 3x?', steps: ['No variable attached.', '7.'], answer: '7' },
      { q: 'How many terms in 5x − 2 + 3?', steps: ['Combine constants first: 5x − 2 + 3 = 5x + 1.', '2 terms.'], answer: '2' },
    ],
    practice: [
      { q: 'Coefficient of x in 9x?', answers: ['9'], steps: ['Number in front of x.', '9.'] },
      { q: 'Constant term in 3x + 8?', answers: ['8'], steps: ['The number with no variable.', '8.'] },
    ],
    watchOut: 'Always SIMPLIFY first before counting parts — hidden like-terms can fool you.',
  },
  {
    domain: '6.EE', unit: 8, title: 'Equivalent expressions & checking solutions',
    objective: 'Verify equivalence with substitution; test solutions to equations.',
    videos: [{ title: 'Worked examples', src: '6.EE-8-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-8-trap.mp4' }],
    concept: [
      'Two expressions are EQUIVALENT if they give the same value for every variable choice.',
      'Quick test: pick an easy value (like x = 2 or x = 10) and evaluate both.',
      'A value is a SOLUTION to an equation if substituting it makes both sides equal.',
    ],
    examples: [
      { q: 'Is 2x + 6 equivalent to 2(x + 3)?', steps: ['Distribute: 2(x + 3) = 2x + 6.', 'Same expression. Yes.'], answer: 'yes' },
      { q: 'Is x = 4 a solution to x + 5 = 9?', steps: ['Substitute: 4 + 5 = 9. ✓', 'Yes.'], answer: 'yes' },
      { q: 'Is x = 3 a solution to 2x = 8?', steps: ['Check: 2(3) = 6, not 8.', 'No.'], answer: 'no' },
    ],
    practice: [
      { q: 'Is 3(x + 2) equivalent to 3x + 6?', answers: ['yes'], steps: ['Distribute the 3.', 'Same expression.'] },
      { q: 'Is x = 5 a solution to x − 3 = 2?', answers: ['yes'], steps: ['5 − 3 = 2. ✓'] },
    ],
    watchOut: 'Two expressions can MATCH at one value but still differ — use the algebra to be sure.',
  },
  {
    domain: '6.EE', unit: 9, title: 'Writing & solving equations from words',
    objective: 'Translate word problems into equations and solve.',
    videos: [{ title: 'Worked examples', src: '6.EE-9-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-9-trap.mp4' }],
    concept: [
      'Identify the unknown and name it (let x = number of weeks, etc.).',
      'Translate each phrase: "sum of" → +, "product of" → ×, "is" → =.',
      'Solve by doing the OPPOSITE operation to both sides.',
    ],
    examples: [
      { q: 'Marcos saves $25 per week for w weeks. Expression for total?', steps: ['Total = price per week × number of weeks.', '25w.'], answer: '25w' },
      { q: 'Equation for "a number plus 6 equals 14".', steps: ['Let the number be x.', 'x + 6 = 14.'], answer: 'x+6=14' },
      { q: 'Solve x + 6 = 14.', steps: ['Subtract 6 from both sides.', 'x = 8.'], answer: '8' },
    ],
    practice: [
      { q: 'Expression for "n less than 12".', answers: ['12-n', '12 - n'], steps: ['Order matters.', '12 − n.'] },
      { q: 'Solve 3x = 21.', answers: ['7'], steps: ['Divide both sides by 3.', 'x = 7.'] },
    ],
    watchOut: '"n less than 12" is 12 − n, NOT n − 12. Order of "less than" is reversed.',
  },
  {
    domain: '6.EE', unit: 10, title: 'Tables & relationships',
    objective: 'Use equations to fill tables and describe how two variables change.',
    videos: [{ title: 'Worked examples', src: '6.EE-10-examples.mp4' }, { title: 'Avoid the trap', src: '6.EE-10-trap.mp4' }],
    concept: [
      'An equation like y = 4x gives one y for every x. Plug in to fill the table.',
      'Identify the RULE: how does y change when x grows by 1?',
      'A table lets you SEE the pattern — same change in y each step.',
    ],
    examples: [
      { q: 'For y = 4x, find y when x = 6.', steps: ['Substitute x = 6.', 'y = 4 × 6 = 24.'], answer: '24' },
      { q: 'Fill in y for y = x + 3 at x = 1, 2, 3.', steps: ['x = 1 → 4. x = 2 → 5. x = 3 → 6.'], answer: '4, 5, 6' },
      { q: 'Rule for the pairs (1, 5), (2, 10), (3, 15)?', steps: ['y is 5 times x.', 'y = 5x.'], answer: 'y=5x' },
    ],
    practice: [
      { q: 'For y = 2x + 1, find y when x = 4.', answers: ['9'], steps: ['Substitute.', '2(4) + 1 = 9.'] },
      { q: 'Rule for (1, 3), (2, 6), (3, 9)?', answers: ['y=3x', 'y = 3x'], steps: ['y is 3 times x.', 'y = 3x.'] },
    ],
    watchOut: 'Match each x to its matching y row — don\'t swap them when reading the table.',
  },

  // 6.G
  {
    domain: '6.G', unit: 7, title: 'Composite figures (area)',
    objective: 'Find the area of shapes built from rectangles and triangles.',
    videos: [{ title: 'Worked examples', src: '6.G-7-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-7-trap.mp4' }],
    concept: [
      'Break the shape into pieces whose area formulas you already know.',
      'Compute each piece, then ADD them. (For cutouts, SUBTRACT.)',
      'Label every length first — most errors come from missing or confused side lengths.',
    ],
    examples: [
      { q: 'Two rectangles side-by-side: 4 × 3 and 4 × 2. Total area?', steps: ['Piece 1: 4 × 3 = 12.', 'Piece 2: 4 × 2 = 8.', 'Total: 20.'], answer: '20' },
      { q: 'A 6 × 5 rectangle with a 2 × 2 square cut out. Area left?', steps: ['Big: 6 × 5 = 30.', 'Cutout: 2 × 2 = 4.', 'Left: 30 − 4 = 26.'], answer: '26' },
      { q: 'A "house": rectangle 8 × 5 plus triangle base 8, height 4 on top.', steps: ['Rectangle: 8 × 5 = 40.', 'Triangle: ½ × 8 × 4 = 16.', 'Total: 56.'], answer: '56' },
    ],
    practice: [
      { q: 'Two rectangles: 5 × 4 and 5 × 3 side-by-side. Total area?', answers: ['35'], steps: ['20 + 15 = 35.'] },
      { q: 'A 10 × 6 rectangle with a 3 × 2 square cut out. Area?', answers: ['54'], steps: ['60 − 6 = 54.'] },
    ],
    watchOut: 'For cutouts, SUBTRACT — for additions (like a triangular roof), ADD.',
  },
  {
    domain: '6.G', unit: 8, title: 'Volume of right rectangular prisms',
    objective: 'Compute volume as length × width × height (including fractional edges).',
    videos: [{ title: 'Worked examples', src: '6.G-8-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-8-trap.mp4' }],
    concept: [
      'Volume = l × w × h, measured in CUBIC units (in³, cm³, ft³).',
      'Multiplying fractions: numerator × numerator, denominator × denominator.',
      'A cube has all three edges equal: V = s³.',
    ],
    examples: [
      { q: 'Volume of a 1 × 3 × 5 box?', steps: ['1 × 3 × 5 = 15 cubic units.'], answer: '15' },
      { q: 'Volume of a 2 × 4 × 5 box?', steps: ['2 × 4 = 8.', '8 × 5 = 40.'], answer: '40' },
      { q: 'Volume of a ½ × ½ × 4 box?', steps: ['½ × ½ = ¼.', '¼ × 4 = 1.'], answer: '1' },
    ],
    practice: [
      { q: 'Volume of a 3 × 3 × 3 cube?', answers: ['27'], steps: ['3 × 3 × 3 = 27.'] },
      { q: 'Volume of a 1 × 2 × ½ box?', answers: ['1'], steps: ['1 × 2 = 2.', '2 × ½ = 1.'] },
    ],
    watchOut: 'Volume uses CUBIC units. An answer in plain or square units is the wrong dimension.',
  },
  {
    domain: '6.G', unit: 9, title: 'Polygons on the coordinate plane',
    objective: 'Find side lengths and areas of polygons whose vertices are on a grid.',
    videos: [{ title: 'Worked examples', src: '6.G-9-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-9-trap.mp4' }],
    concept: [
      'For a horizontal segment (same y), length = |x₂ − x₁|.',
      'For a vertical segment (same x), length = |y₂ − y₁|.',
      'For an axis-aligned rectangle, area = horizontal length × vertical length.',
    ],
    examples: [
      { q: 'Length from (2, 1) to (7, 1)?', steps: ['Same y, horizontal.', '|7 − 2| = 5.'], answer: '5' },
      { q: 'Length from (−3, 4) to (2, 4)?', steps: ['Same y, horizontal.', '|2 − (−3)| = 5.'], answer: '5' },
      { q: 'Area of rectangle with corners (0, 0), (4, 0), (4, 3), (0, 3)?', steps: ['Width = 4. Height = 3.', 'Area = 12.'], answer: '12' },
    ],
    practice: [
      { q: 'Length from (1, 2) to (1, 6)?', answers: ['4'], steps: ['Same x.', '|6 − 2| = 4.'] },
      { q: 'Area of rectangle with corners (0, 0), (5, 0), (5, 2), (0, 2)?', answers: ['10'], steps: ['Width 5 × Height 2 = 10.'] },
    ],
    watchOut: 'Subtract with the absolute value — a "negative distance" means you flipped the subtraction order.',
  },
  {
    domain: '6.G', unit: 10, title: 'Surface area & nets',
    objective: 'Compute surface area as the sum of all face areas.',
    videos: [{ title: 'Worked examples', src: '6.G-10-examples.mp4' }, { title: 'Avoid the trap', src: '6.G-10-trap.mp4' }],
    concept: [
      'A NET is the prism unfolded flat — each face becomes a rectangle on paper.',
      'Surface area = SUM of the face areas (measured in SQUARE units).',
      'A cube has 6 equal square faces: SA = 6s². A rectangular prism has 3 pairs of identical rectangles.',
    ],
    examples: [
      { q: 'Surface area of a cube with edge 3?', steps: ['Each face: 3 × 3 = 9.', '6 faces.', '6 × 9 = 54.'], answer: '54' },
      { q: 'How many faces does a rectangular prism have?', steps: ['Top, bottom, front, back, left, right.', '6 faces.'], answer: '6' },
      { q: 'SA of a 2 × 3 × 4 prism?', steps: ['Pairs: 2·3 = 6, 2·4 = 8, 3·4 = 12.', '2(6 + 8 + 12) = 2·26 = 52.'], answer: '52' },
    ],
    practice: [
      { q: 'SA of a cube with edge 5?', answers: ['150'], steps: ['Each face: 25.', '6 × 25 = 150.'] },
      { q: 'How many faces on a cube?', answers: ['6'], steps: ['All 6 are equal squares.'] },
    ],
    watchOut: 'Surface area uses SQUARE units. Volume uses cubic — don\'t mix them up.',
  },

  // 6.SP
  {
    domain: '6.SP', unit: 7, title: 'Statistical questions',
    objective: 'Distinguish statistical questions (variability expected) from fact questions.',
    videos: [{ title: 'Worked examples', src: '6.SP-7-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-7-trap.mp4' }],
    concept: [
      'A STATISTICAL question expects answers to VARY: "How tall are the kids in 6th grade?"',
      'A non-statistical question has ONE answer: "How tall am I?"',
      'Look for group words: "each", "every", "students", "players".',
    ],
    examples: [
      { q: 'Is "How tall am I?" statistical?', steps: ['One answer — about ME.', 'No.'], answer: 'no' },
      { q: 'Is "How tall are the students in my class?" statistical?', steps: ['Many students, many heights.', 'Yes.'], answer: 'yes' },
      { q: 'Is "How many days are in February 2025?" statistical?', steps: ['One fact, one answer.', 'No.'], answer: 'no' },
    ],
    practice: [
      { q: 'Is "How long does it take each student to eat lunch?" statistical?', answers: ['yes'], steps: ['Each student varies.', 'Yes.'] },
      { q: 'Is "What is the capital of California?" statistical?', answers: ['no'], steps: ['One fact.', 'No.'] },
    ],
    watchOut: 'It\'s about WHETHER answers vary — not whether the topic is mathematical.',
  },
  {
    domain: '6.SP', unit: 8, title: 'Center: mean & median in depth',
    objective: 'Compute mean and median; pick the right center for the situation.',
    videos: [{ title: 'Worked examples', src: '6.SP-8-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-8-trap.mp4' }],
    concept: [
      'MEAN = sum ÷ count. Best when data is symmetric (no outliers).',
      'MEDIAN = middle value of the SORTED data. Best when there are outliers.',
      'For an even count, the median is the average of the two middle values.',
    ],
    examples: [
      { q: 'Median of {3, 5, 7, 9, 11}?', steps: ['Sorted; 5 items.', 'Middle is the 3rd value: 7.'], answer: '7' },
      { q: 'Median of {2, 4, 6, 8}?', steps: ['4 items.', 'Middle two: 4 and 6.', 'Average: 5.'], answer: '5' },
      { q: 'Mean of {5, 5, 5, 100}?', steps: ['Sum: 115. Count: 4.', '115 ÷ 4 = 28.75.'], answer: '28.75' },
    ],
    practice: [
      { q: 'Median of {1, 3, 7, 9}?', answers: ['5'], steps: ['4 items; middle two are 3 and 7.', '(3+7)÷2 = 5.'] },
      { q: 'Mean of {6, 8, 10}?', answers: ['8'], steps: ['Sum 24, count 3.', '24÷3 = 8.'] },
    ],
    watchOut: 'Sort the data FIRST when finding the median — order is everything.',
  },
  {
    domain: '6.SP', unit: 9, title: 'Displays: dot plots, histograms & box plots',
    objective: 'Read and interpret common 6th-grade statistical displays.',
    videos: [{ title: 'Worked examples', src: '6.SP-9-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-9-trap.mp4' }],
    concept: [
      'DOT PLOT: each dot is one data value. Tall stacks = common values.',
      'HISTOGRAM: bar HEIGHTS = how many values fall in each interval.',
      'BOX PLOT: the box shows the middle 50% (Q1 to Q3); the line is the median.',
    ],
    examples: [
      { q: 'On a dot plot, each dot represents?', steps: ['One data value.', 'A single observation.'], answer: 'one data value' },
      { q: 'A histogram bar over 10–19 has height 5. How many values in 10–19?', steps: ['Bar height = count.', '5 values.'], answer: '5' },
      { q: 'On a box plot, what does the box show?', steps: ['Middle 50% of the data.', 'From Q1 to Q3.'], answer: 'middle 50%' },
    ],
    practice: [
      { q: 'A dot plot has 4 dots above the value 3. How many measurements equal 3?', answers: ['4'], steps: ['Each dot is one item.', '4.'] },
      { q: 'A histogram bar from 20–29 has height 8. How many values in that range?', answers: ['8'], steps: ['Bar height = count.', '8.'] },
    ],
    watchOut: 'Bar HEIGHT — not width — equals the count in a histogram.',
  },
  {
    domain: '6.SP', unit: 10, title: 'Summarizing data sets',
    objective: 'Compute mean and median on a dataset and report a quick summary.',
    videos: [{ title: 'Worked examples', src: '6.SP-10-examples.mp4' }, { title: 'Avoid the trap', src: '6.SP-10-trap.mp4' }],
    concept: [
      'A summary describes the shape, center, and spread.',
      'Center: mean or median. Spread: range = max − min.',
      'Pair the right center with the right context — outliers pull the MEAN, not the median.',
    ],
    examples: [
      { q: 'Mean of {10, 20, 30, 40, 50}?', steps: ['Sum: 150. Count: 5.', '150 ÷ 5 = 30.'], answer: '30' },
      { q: 'Median of {3, 7, 1, 9, 5}?', steps: ['Sort: 1, 3, 5, 7, 9.', 'Middle: 5.'], answer: '5' },
      { q: 'Range of {12, 5, 18, 7, 20}?', steps: ['Max 20, min 5.', '20 − 5 = 15.'], answer: '15' },
    ],
    practice: [
      { q: 'Mean of {2, 4, 6, 8}?', answers: ['5'], steps: ['Sum 20, count 4.', '20 ÷ 4 = 5.'] },
      { q: 'Range of {7, 2, 11, 4}?', answers: ['9'], steps: ['Max 11, min 2.', '11 − 2 = 9.'] },
    ],
    watchOut: 'SORT data before finding median or range — unsorted data hides the extremes.',
  },
];

const byKey = new Map(LESSONS.map((l) => [lessonKey(l.domain, l.unit), l]));

export function getLesson(domain: Domain, unit: number): Lesson | null {
  return byKey.get(lessonKey(domain, unit)) ?? null;
}
