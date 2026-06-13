import type { Domain } from '../types/problem';

export interface GeniusTip {
  text: string;
  domain?: Domain; // undefined = works anywhere
}

// Short "wow" tricks and test strategies, sprinkled onto correct-answer
// cards about 1 time in 4. Domain-tagged tips are preferred when they match
// the problem being solved.
export const GENIUS_TIPS: GeniusTip[] = [
  // General mental math
  { text: 'To multiply by 5, multiply by 10 and cut it in half: 24 × 5 = 240 ÷ 2 = 120.' },
  { text: 'To multiply by 9, multiply by 10 and subtract one copy: 9 × 7 = 70 − 7 = 63.' },
  { text: 'Adding 99? Add 100, then take 1 back.' },
  { text: 'Doubling and halving keeps a product the same: 16 × 25 = 8 × 50 = 4 × 100 = 400.' },
  { text: 'A number is divisible by 3 if its digits add to a multiple of 3. 471 → 4+7+1 = 12 ✓' },
  { text: 'A number is divisible by 9 if its digits add to a multiple of 9. 243 → 9 ✓' },
  { text: 'Even number? Divisible by 2. Ends in 0 or 5? Divisible by 5.' },
  { text: 'Multiplying by 4 = doubling twice. 35 × 4 → 70 → 140.' },
  { text: 'Multiplying by 25? Multiply by 100 and divide by 4: 25 × 32 = 3200 ÷ 4 = 800.' },
  { text: 'Subtracting from 1000: subtract each digit from 9, the last from 10. 1000 − 387 = 613.' },
  { text: 'Squares end in 0,1,4,5,6, or 9 — never 2,3,7,8. Instant answer-check!' },
  { text: '11 × any two-digit number: add the digits and tuck the sum in the middle. 11 × 35 → 3(3+5)5 = 385.' },
  // Test strategy
  { text: 'MAP strategy: estimate FIRST, then compute. If your answer is far from the estimate, recheck.' },
  { text: 'MAP strategy: questions get harder when you do well — a tough question means you are winning.' },
  { text: 'On multiple choice, cross out the impossible answers first. Even removing one boosts your odds.' },
  { text: 'Read the question twice: once for the story, once for what it actually asks.' },
  { text: 'Units are a free hint: an area answer needs square units, volume needs cubic units.' },
  { text: 'Stuck? Swap in smaller, friendlier numbers, solve that, then redo it with the real numbers.' },
  { text: 'Check subtraction by adding back up; check division by multiplying back.' },
  { text: 'Draw it! A quick sketch turns most word problems into picture problems.' },
  // 5.F
  { text: 'Each place value is exactly 10× its neighbor — that is the whole place-value system in one fact.', domain: '5.F' },
  { text: 'Fractions only add when the pieces match. Different denominators? Resize the pieces first.', domain: '5.F' },
  { text: 'Dividing by a fraction? "How many fit?" 6 ÷ ½ asks how many halves fit in 6 — that is 12.', domain: '5.F' },
  { text: 'Comparing decimals: pad with zeros so they are the same length. 0.5 vs 0.45 → 0.50 vs 0.45.', domain: '5.F' },
  { text: 'A quarter (0.25) of a number is the number ÷ 4 — way faster than long multiplication.', domain: '5.F' },
  { text: 'Volume = how many unit cubes fit: one layer = length × width, then stack the layers.', domain: '5.F' },
  { text: 'Coordinates: run before you jump — across (x) first, then up (y).', domain: '5.F' },
  // 6.RP
  { text: '10% is always one decimal shift: 10% of 84 = 8.4. Build other percents from it!', domain: '6.RP' },
  { text: '5% = half of 10%. 15% = 10% + 5%. You can build ANY percent from 10% and 1%.', domain: '6.RP' },
  { text: 'Percent of a number is reversible: 8% of 25 = 25% of 8 = 2. Pick the easier one!', domain: '6.RP' },
  { text: 'Unit rates make comparisons instant: price ÷ amount, then compare per-1 values.', domain: '6.RP' },
  { text: 'A ratio table is just skip-counting both columns at once.', domain: '6.RP' },
  // 6.NS
  { text: 'Dividing decimals? Slide BOTH decimal points right until the divisor is whole. 3.6 ÷ 0.9 = 36 ÷ 9.', domain: '6.NS' },
  { text: 'Keep–Change–Flip works because dividing by a number = multiplying by its reciprocal.', domain: '6.NS' },
  { text: 'On a number line, "greater" always means "further right" — even for negatives. −2 > −7!', domain: '6.NS' },
  { text: 'Absolute value is distance, and distance is never negative.', domain: '6.NS' },
  { text: 'GCF hides in prime factors: break both numbers down and multiply the shared primes.', domain: '6.NS' },
  // 6.EE
  { text: 'A variable is just a box holding a number you have not met yet.', domain: '6.EE' },
  { text: 'Whatever you do to one side of an equation, do to the other — it is a balance scale.', domain: '6.EE' },
  { text: 'Check a "solution" by substituting it back in. If both sides match, it is right — guaranteed.', domain: '6.EE' },
  { text: '3(x + 2) means the 3 multiplies EVERYTHING inside: 3x AND 6.', domain: '6.EE' },
  { text: 'x means 1x. So x + x = 2x, and 5x − x = 4x.', domain: '6.EE' },
  // 6.G
  { text: 'Every parallelogram is a rectangle in disguise — slice a triangle off one end and slide it to the other.', domain: '6.G' },
  { text: 'A triangle is half its bounding box — that is where the ½ in ½bh comes from.', domain: '6.G' },
  { text: 'Weird shape? Cut it into rectangles and triangles, then add the pieces.', domain: '6.G' },
  { text: 'Surface area = unfold the box and add up the faces. Boxes have 3 matching PAIRS.', domain: '6.G' },
  { text: 'Same x-coordinates → vertical segment; same y-coordinates → horizontal. Just subtract the other pair.', domain: '6.G' },
  // 6.SP
  { text: 'The mean is the "fair share": pool everything, deal it out equally.', domain: '6.SP' },
  { text: 'One crazy value drags the mean but barely moves the median. Outliers? Trust the median.', domain: '6.SP' },
  { text: 'Always sort the data before finding the median — the middle of a mess is meaningless.', domain: '6.SP' },
  { text: 'Box plot speed-read: the line in the box is the median, the box holds the middle half.', domain: '6.SP' },
  { text: 'Range tells you spread, not center: max − min in one subtraction.', domain: '6.SP' },
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Deterministic per-problem: ~1 in 4 problems shows a tip (stable across
// re-renders), preferring tips tagged with the problem's domain.
export function tipForProblem(problemId: string, domain: Domain): GeniusTip | null {
  const h = hashStr(problemId);
  if (h % 4 !== 0) return null;
  const pool = [
    ...GENIUS_TIPS.filter((t) => t.domain === domain),
    ...GENIUS_TIPS.filter((t) => !t.domain),
  ];
  return pool[h % pool.length] ?? null;
}
