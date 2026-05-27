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

export interface Lesson {
  domain: Domain;
  unit: number;
  title: string;
  objective: string;
  concept: string[]; // the core teaching points
  examples: WorkedExample[]; // worked examples with step-by-step solutions
  practice: PracticeQuestion[]; // try-it questions with accepted alternatives
  watchOut: string;
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
];

const byKey = new Map(LESSONS.map((l) => [lessonKey(l.domain, l.unit), l]));

export function getLesson(domain: Domain, unit: number): Lesson | null {
  return byKey.get(lessonKey(domain, unit)) ?? null;
}
