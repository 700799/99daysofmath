import type { Domain } from '../types/problem';

export interface Lesson {
  domain: Domain;
  unit: number;
  title: string;
  objective: string;
  steps: string[];
  example: { q: string; a: string };
  watchOut: string;
}

export function lessonKey(domain: Domain, unit: number): string {
  return `${domain}-${unit}`;
}

export const LESSONS: Lesson[] = [
  // 6.RP — Ratios & Proportions
  {
    domain: '6.RP', unit: 1, title: 'What is a ratio?',
    objective: 'Compare two quantities using a ratio.',
    steps: [
      'A ratio compares two amounts, like 3 red to 2 blue. Write it 3:2 or "3 to 2".',
      'Order matters — 3:2 is not the same as 2:3.',
      'Scale a ratio by multiplying or dividing BOTH parts by the same number.',
    ],
    example: { q: 'A box has 4 apples and 6 oranges. Ratio of apples to oranges in simplest form?', a: '4:6 = 2:3 (divide both by 2).' },
    watchOut: 'Keep the order asked for: "apples to oranges" puts the apples number first.',
  },
  {
    domain: '6.RP', unit: 2, title: 'Unit rates',
    objective: 'Find how much for just one.',
    steps: [
      'A rate compares two different units, like miles and hours.',
      'A unit rate is the amount for exactly 1 (per hour, per pound).',
      'Divide to find it: total ÷ number of units.',
    ],
    example: { q: '6 muffins cost $9. Cost per muffin?', a: '$9 ÷ 6 = $1.50 per muffin.' },
    watchOut: '"Per" means divide by that quantity — cost per muffin divides money by muffins.',
  },
  {
    domain: '6.RP', unit: 3, title: 'Ratio tables',
    objective: 'Use a table to find equivalent ratios.',
    steps: [
      'Equivalent ratios make the same comparison: 1:3, 2:6, 3:9.',
      'In a ratio table, multiply both columns by the same number to move across.',
      'Find a missing value by spotting the pattern between the rows.',
    ],
    example: { q: 'If 2 → 6 and 3 → 9, what does 5 map to?', a: 'Each input ×3, so 5 × 3 = 15.' },
    watchOut: 'Whatever you multiply one column by, multiply the other by too.',
  },
  {
    domain: '6.RP', unit: 4, title: 'Part-to-part vs part-to-whole',
    objective: 'Tell different kinds of ratios apart.',
    steps: [
      'Part-to-part compares two groups (boys to girls).',
      'Part-to-whole compares one group to the total (boys to all students).',
      'If a class is 3 boys to 2 girls, the whole is 3 + 2 = 5.',
    ],
    example: { q: '3 boys and 2 girls. Ratio of boys to the whole class?', a: '3 to 5.' },
    watchOut: 'For part-to-whole, add the parts first to get the total.',
  },
  {
    domain: '6.RP', unit: 5, title: 'Percents',
    objective: "Understand percent as 'out of 100'.",
    steps: [
      'Percent means per hundred: 25% = 25 out of 100 = 0.25.',
      'To find a percent OF a number, multiply by the decimal form.',
      'Half = 50%, quarter = 25%, whole = 100%.',
    ],
    example: { q: 'What is 20% of 45?', a: '0.20 × 45 = 9.' },
    watchOut: 'Turn the percent into a decimal (move the point two places left) before multiplying.',
  },
  {
    domain: '6.RP', unit: 6, title: 'Converting with rates',
    objective: 'Switch units using a rate.',
    steps: [
      'A conversion is just a rate: 12 inches per 1 foot.',
      'Multiply by the rate so the unit you do not want cancels out.',
      'Check that the size of your answer makes sense.',
    ],
    example: { q: 'How many inches are in 3 feet?', a: '3 × 12 = 36 inches.' },
    watchOut: 'Decide multiply vs divide by thinking about which unit is bigger.',
  },

  // 6.NS — The Number System
  {
    domain: '6.NS', unit: 1, title: 'Adding & subtracting decimals',
    objective: 'Compute carefully with decimals.',
    steps: [
      'Line up the decimal points before adding or subtracting.',
      'Fill in zeros so both numbers have the same number of places.',
      'Bring the decimal point straight down into the answer.',
    ],
    example: { q: '3.4 + 1.25', a: '3.40 + 1.25 = 4.65.' },
    watchOut: "Line up the decimal points — not just the last digits.",
  },
  {
    domain: '6.NS', unit: 2, title: 'Multiplying & dividing decimals',
    objective: 'Multiply and divide decimal numbers.',
    steps: [
      'Multiply as if there were no decimals, then count total decimal places.',
      'To divide, move both decimal points right until the divisor is a whole number.',
      'Estimate first so you can place the decimal point sensibly.',
    ],
    example: { q: '0.6 × 0.4', a: '6 × 4 = 24, two decimal places → 0.24.' },
    watchOut: 'Count the decimal places in BOTH factors when multiplying.',
  },
  {
    domain: '6.NS', unit: 3, title: 'GCF, LCM & distributing',
    objective: 'Break numbers apart with common factors.',
    steps: [
      'The GCF is the biggest number that divides both.',
      'The LCM is the smallest number both divide into.',
      'Use the GCF to rewrite a sum: 18 + 24 = 6(3 + 4).',
    ],
    example: { q: 'GCF of 12 and 18?', a: '12 = 2·2·3, 18 = 2·3·3, common = 2·3 = 6.' },
    watchOut: 'GCF = what divides INTO them; LCM = what they divide into.',
  },
  {
    domain: '6.NS', unit: 4, title: 'Integers & absolute value',
    objective: 'Work with positive and negative numbers.',
    steps: [
      'Negatives are below 0 (owing money, below sea level).',
      'On a number line, bigger is always to the right.',
      'Absolute value |x| is the distance from 0 — always 0 or positive.',
    ],
    example: { q: 'What is |-7|?', a: '7 — it is 7 units from zero.' },
    watchOut: '-7 is LESS than -2, even though 7 is bigger than 2.',
  },
  {
    domain: '6.NS', unit: 5, title: 'The coordinate plane',
    objective: 'Plot and read ordered pairs.',
    steps: [
      'A point is (x, y): x is across, y is up or down.',
      'The four quadrants are set by the signs of x and y.',
      'Distance along a grid line = subtract the matching coordinates.',
    ],
    example: { q: 'Which quadrant is (-3, 5) in?', a: 'x negative, y positive → Quadrant II.' },
    watchOut: 'Always go across (x) first, then up or down (y).',
  },
  {
    domain: '6.NS', unit: 6, title: 'Dividing fractions',
    objective: 'Divide a fraction by a fraction.',
    steps: [
      "Dividing asks 'how many of these fit?'",
      'Keep the first fraction, change ÷ to ×, and flip the second (its reciprocal).',
      'Then multiply across and simplify.',
    ],
    example: { q: '1/2 ÷ 1/4', a: '1/2 × 4/1 = 4/2 = 2.' },
    watchOut: 'Flip only the SECOND fraction, not both.',
  },

  // 6.EE — Expressions & Equations
  {
    domain: '6.EE', unit: 1, title: 'Exponents',
    objective: 'Read and evaluate powers.',
    steps: [
      'An exponent counts repeated multiplication: 2³ = 2 × 2 × 2.',
      'The base is multiplied, not added to the exponent.',
      'Any number to the 1st power is itself; "squared" means the power 2.',
    ],
    example: { q: 'Evaluate 3³.', a: '3 × 3 × 3 = 27.' },
    watchOut: '2³ is 8, not 6 — do not multiply the base by the exponent.',
  },
  {
    domain: '6.EE', unit: 2, title: 'Writing & evaluating expressions',
    objective: 'Turn words into expressions and evaluate them.',
    steps: [
      'A variable is a letter that stands for a number.',
      "Translate words: 'more than' = +, 'product' = ×, 'less than' flips the order.",
      'To evaluate, substitute the value and follow order of operations.',
    ],
    example: { q: 'Evaluate 2x + 5 when x = 4.', a: '2·4 + 5 = 13.' },
    watchOut: '2x means 2 times x — multiply before you add.',
  },
  {
    domain: '6.EE', unit: 3, title: 'Equivalent expressions',
    objective: 'Rewrite expressions that mean the same thing.',
    steps: [
      'Distributive property: a(b + c) = ab + ac.',
      'Combine like terms: 3x + 2x = 5x.',
      'Equivalent expressions give the same value for every x.',
    ],
    example: { q: 'Expand 3(x + 2).', a: '3·x + 3·2 = 3x + 6.' },
    watchOut: 'Multiply the outside number by EVERY term inside the parentheses.',
  },
  {
    domain: '6.EE', unit: 4, title: 'One-step equations',
    objective: 'Solve for a variable in one move.',
    steps: [
      'An equation says two things are equal.',
      'Undo what is done to x using the opposite operation.',
      'Do the same thing to BOTH sides to keep it balanced.',
    ],
    example: { q: 'Solve x + 7 = 12.', a: 'Subtract 7 from both sides: x = 5.' },
    watchOut: 'Whatever you do to one side, do to the other side too.',
  },
  {
    domain: '6.EE', unit: 5, title: 'Inequalities',
    objective: 'Write and graph inequalities.',
    steps: [
      '< less than, > greater than, ≤ at most, ≥ at least.',
      'x > 3 means every number bigger than 3 (but not 3 itself).',
      'Number line: open circle for < or >, closed circle for ≤ or ≥.',
    ],
    example: { q: 'Graph x ≥ 2 — open or closed circle at 2?', a: 'Closed circle (it includes 2), shaded to the right.' },
    watchOut: '≤ and ≥ include the number; < and > do not.',
  },
  {
    domain: '6.EE', unit: 6, title: 'Variables that change together',
    objective: 'Relate independent and dependent variables.',
    steps: [
      'The independent variable is the one you choose (like time).',
      'The dependent variable responds to it (like distance).',
      'An equation like d = 50t lets you build a table of matching values.',
    ],
    example: { q: 'If y = 3x, what is y when x = 5?', a: 'y = 3·5 = 15.' },
    watchOut: 'The dependent variable is usually alone on one side (y = …).',
  },

  // 6.G — Geometry
  {
    domain: '6.G', unit: 1, title: 'Area of triangles & rectangles',
    objective: 'Find area with the right formula.',
    steps: [
      'Rectangle area = length × width.',
      'Triangle area = ½ × base × height.',
      'The height must be perpendicular (straight) to the base.',
    ],
    example: { q: 'Triangle with base 8 and height 5.', a: '½ × 8 × 5 = 20 square units.' },
    watchOut: 'Do not forget the ½ for triangles.',
  },
  {
    domain: '6.G', unit: 2, title: 'Polygons on the grid',
    objective: 'Use coordinates to find side lengths.',
    steps: [
      'Plot the vertices in order.',
      'Horizontal side length = difference of x-values; vertical = difference of y-values.',
      'Then use the side lengths in an area or perimeter formula.',
    ],
    example: { q: 'Length from (2, 1) to (2, 6)?', a: 'Same x, so 6 − 1 = 5 units.' },
    watchOut: 'Subtract directly only when points share an x (vertical) or y (horizontal).',
  },
  {
    domain: '6.G', unit: 3, title: 'Volume of prisms',
    objective: 'Find the volume of a rectangular prism.',
    steps: [
      'Volume = length × width × height.',
      'It works even with fraction edge lengths.',
      'Volume is measured in cubic units.',
    ],
    example: { q: 'Box 1/2 by 3 by 4.', a: '1/2 × 3 × 4 = 6 cubic units.' },
    watchOut: 'Volume uses three dimensions — the answer is in cubic units.',
  },
  {
    domain: '6.G', unit: 4, title: 'Surface area with nets',
    objective: 'Add up the faces of a 3-D shape.',
    steps: [
      'A net unfolds a solid into flat faces.',
      'Find the area of each face, then add them all up.',
      'A box has 3 pairs of matching faces.',
    ],
    example: { q: 'Cube with side 2 — surface area?', a: '6 faces × (2×2) = 6 × 4 = 24 square units.' },
    watchOut: 'Surface area is in square units; do not multiply all three sides (that is volume).',
  },
  {
    domain: '6.G', unit: 5, title: 'Composite figures',
    objective: 'Find the area of combined shapes.',
    steps: [
      'Split the figure into rectangles and triangles.',
      'Find each piece’s area.',
      'Add the pieces (or subtract a cut-out hole).',
    ],
    example: { q: 'An L-shape = a 4×2 plus a 3×2 rectangle. Total area?', a: '8 + 6 = 14 square units.' },
    watchOut: 'Do not double-count where the pieces meet.',
  },
  {
    domain: '6.G', unit: 6, title: 'Area & volume review',
    objective: 'Pick the right formula for the shape.',
    steps: [
      'Flat shape → area (square units). Solid → volume (cubic units).',
      'Triangle: ½·b·h. Rectangle: l·w. Prism: l·w·h.',
      'Underline what is asked and the units before you start.',
    ],
    example: { q: 'Rectangular prism 2×3×5 — volume?', a: '2 × 3 × 5 = 30 cubic units.' },
    watchOut: 'Square units for area, cubic units for volume.',
  },

  // 6.SP — Statistics & Probability
  {
    domain: '6.SP', unit: 1, title: 'Mean, median & mode',
    objective: 'Find the measures of center.',
    steps: [
      'Mean = add all the values, then divide by how many there are.',
      'Median = the middle value once they are sorted.',
      'Mode = the value that appears most often.',
    ],
    example: { q: 'Mean of 4, 6, 8?', a: '(4 + 6 + 8) ÷ 3 = 18 ÷ 3 = 6.' },
    watchOut: 'Sort the numbers before finding the median.',
  },
  {
    domain: '6.SP', unit: 2, title: 'Choosing a center',
    objective: 'Decide which average to use.',
    steps: [
      'The mean uses every value, so outliers pull it.',
      'The median is the middle and resists outliers.',
      'For very lopsided data, the median often describes it better.',
    ],
    example: { q: 'Data 2, 3, 4, 100 — which center is more typical?', a: 'Median (3.5); the mean (27.25) is pulled up by 100.' },
    watchOut: 'One huge or tiny value can make the mean misleading.',
  },
  {
    domain: '6.SP', unit: 3, title: 'Spread: range, IQR & MAD',
    objective: 'Measure how spread out data is.',
    steps: [
      'Range = maximum − minimum.',
      'IQR = upper quartile − lower quartile (spread of the middle half).',
      'MAD = the average distance of values from the mean.',
    ],
    example: { q: 'Range of 5, 9, 12, 20?', a: '20 − 5 = 15.' },
    watchOut: 'Spread is different from center — they answer different questions.',
  },
  {
    domain: '6.SP', unit: 4, title: 'Displaying data',
    objective: 'Read dot plots, histograms & box plots.',
    steps: [
      'Dot plot: one dot per value.',
      'Histogram: bars over equal intervals, with no gaps.',
      'Box plot: shows the median and the quartiles.',
    ],
    example: { q: 'On a box plot, what does the line inside the box show?', a: 'The median.' },
    watchOut: 'Histograms group data into ranges; bar graphs use separate categories.',
  },
  {
    domain: '6.SP', unit: 5, title: 'Describing a distribution',
    objective: 'Summarize data in context.',
    steps: [
      'Mention center (typical value), spread (variability), and shape.',
      'Note any outliers or clusters.',
      'Tie it back to the question being asked.',
    ],
    example: { q: 'Scores cluster near 80 with one 30. The 30 is a what?', a: 'An outlier.' },
    watchOut: 'A good description includes center AND spread, not just the average.',
  },
  {
    domain: '6.SP', unit: 6, title: 'Summarizing data sets',
    objective: 'Pull the key numbers from a data set.',
    steps: [
      'Count how many values there are (n).',
      'Find the center (mean or median).',
      'Find the spread (range or IQR).',
    ],
    example: { q: 'Data 3, 5, 5, 7 — what is the mode?', a: '5 (it appears twice).' },
    watchOut: 'Check whether the question wants center or spread before answering.',
  },
];

const byKey = new Map(LESSONS.map((l) => [lessonKey(l.domain, l.unit), l]));

export function getLesson(domain: Domain, unit: number): Lesson | null {
  return byKey.get(lessonKey(domain, unit)) ?? null;
}
