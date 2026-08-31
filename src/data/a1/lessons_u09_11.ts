import type { Lesson } from '../lessons';

// Algebra 1 — Units 9–11: systems of equations, exponent rules, and
// exponential vs. linear growth. Plain text with unicode math (×, −, ², ³);
// no KaTeX in lessons.
export const A1_LESSONS_U09_11: Lesson[] = [
  {
    domain: 'A1', unit: 9, title: 'Systems: where two rules cross',
    objective: 'Solve systems by substitution and elimination.',
    concept: [
      'A SYSTEM is two rules that must BOTH be true at once. On a graph, each rule is a line — the answer is the point where the lines CROSS, like two roads meeting at one intersection.',
      'SUBSTITUTION means "swap in what y equals." If y = x + 1, then everywhere you see y, you may drop in x + 1 instead — same value, new outfit.',
      'ELIMINATION means "stack and cancel." Stack the equations and add or subtract so one letter vanishes: +y on top and −y below cancel like a matched pair.',
      'Word problems hide two rules: a TOTAL rule (cats + dogs = 12) and a COMPARE rule (4 more cats than dogs). Write both, then solve.',
    ],
    examples: [
      {
        q: 'Solve: y = x + 1 and x + y = 9. What is x?',
        steps: [
          'The first rule says y IS x + 1, so swap that in for y in the second rule.',
          'x + (x + 1) = 9 becomes 2x + 1 = 9.',
          'Subtract 1: 2x = 8. Divide by 2: x = 4.',
          'Check: y = 5 and 4 + 5 = 9. Both rules happy.',
        ],
        answer: 'x = 4',
      },
      {
        q: 'Solve: x + y = 10 and x − y = 4. What is x?',
        steps: [
          'Stack and add. The +y and −y cancel each other out.',
          'x + x = 2x and 10 + 4 = 14, so 2x = 14.',
          'Divide by 2: x = 7. Then y = 10 − 7 = 3.',
          'Check: 7 − 3 = 4. Both rules happy.',
        ],
        answer: 'x = 7',
      },
      {
        q: 'Plan A costs $20 plus $5 per month. Plan B costs $10 plus $7 per month. After how many months do they cost the same?',
        steps: [
          'Same cost means the two rules meet: 20 + 5m = 10 + 7m.',
          'Subtract 5m from both sides: 20 = 10 + 2m.',
          'Subtract 10: 10 = 2m, so m = 5.',
          'Check: both plans cost $45 at 5 months.',
        ],
        answer: '5 months',
      },
      {
        q: 'A shelter has 12 pets, and there are 4 more cats than dogs. How many cats?',
        steps: [
          'Two rules: c + d = 12 and c = d + 4.',
          'Swap in d + 4 for c: (d + 4) + d = 12, so 2d + 4 = 12.',
          '2d = 8, so d = 4 dogs.',
          'Cats: c = 4 + 4 = 8.',
        ],
        answer: '8 cats',
      },
    ],
    practice: [
      {
        q: 'Solve: y = 2x and y = x + 6. What is x?',
        answers: ['6', 'x = 6', 'x=6'],
        steps: ['Both equal y, so set them equal: 2x = x + 6.', 'Subtract x from both sides: x = 6.'],
      },
      {
        q: 'Solve: x + y = 12 and x − y = 2. What is x?',
        answers: ['7', 'x = 7', 'x=7'],
        steps: ['Stack and add — the y terms cancel: 2x = 14.', 'Divide by 2: x = 7 (and y = 5).'],
      },
      {
        q: '3 adult and 2 kid tickets cost $41. 1 adult and 2 kid tickets cost $23. How many dollars is one adult ticket?',
        answers: ['9', '$9', '9 dollars'],
        steps: ['Both orders share the same 2 kid tickets, so subtract the receipts: 41 − 23 = 18.', 'That $18 pays for the 2 extra adult tickets: 18 ÷ 2 = 9.'],
      },
    ],
    watchOut: 'When you substitute y = 2x − 1 into 3x + y = 14, wrap in the WHOLE thing — writing 3x + 2x − 1 is right, but forgetting the −1 (or dropping a minus sign) is the mistake that wrecks most systems.',
  },
  {
    domain: 'A1', unit: 10, title: 'Exponent rules: count the copies',
    objective: 'Use the product, quotient & power rules.',
    concept: [
      'An exponent COUNTS THE COPIES you multiply: x³ means x × x × x. Think of powers as boxes of identical tiles.',
      'PRODUCT rule — multiplying powers ADDS exponents: x³ · x⁴ is 3 copies times 4 more copies, SEVEN copies total: x⁷.',
      'QUOTIENT rule — dividing CANCELS copies: x⁵ ÷ x² wipes out 2 copies, leaving x³. Subtract the exponents.',
      'POWER rule — a power of a power MULTIPLIES exponents: (x²)³ is 3 groups of 2 copies = x⁶. And anything to the 0 power is 1 — zero copies of multiplying leaves the do-nothing number.',
      'A NEGATIVE exponent means "flip it under 1": 2⁻³ = 1 ÷ 2³ = 1/8. It is small, not negative.',
    ],
    examples: [
      {
        q: 'Simplify x³ · x⁴.',
        steps: [
          'x³ is 3 copies of x; x⁴ is 4 more copies, all multiplied.',
          'Combine the copies: 3 + 4 = 7 copies.',
          'So x³ · x⁴ = x⁷. Multiplying powers ADDS exponents.',
        ],
        answer: 'x⁷',
      },
      {
        q: 'Simplify x⁸ ÷ x³.',
        steps: [
          'Picture 8 copies of x on top and 3 on the bottom of a fraction.',
          'Each bottom copy cancels one top copy — three cancels.',
          '8 − 3 = 5 copies survive: x⁵.',
        ],
        answer: 'x⁵',
      },
      {
        q: 'Simplify (x²)⁴.',
        steps: [
          '(x²)⁴ means four groups, each holding 2 copies of x.',
          'Count all the copies: 2 × 4 = 8.',
          'So (x²)⁴ = x⁸. A power of a power MULTIPLIES exponents.',
        ],
        answer: 'x⁸',
      },
      {
        q: 'You fold a sheet of paper 6 times, and each fold doubles the layers. How many layers?',
        steps: [
          'Six folds means 2⁶ layers — six copies of 2 multiplied.',
          'Double step by step: 2, 4, 8, 16, 32, 64.',
          'After 6 folds: 64 layers.',
        ],
        answer: '64 layers',
      },
    ],
    practice: [
      {
        q: 'Simplify x² · x⁵.',
        answers: ['x^7', 'x⁷', 'x7'],
        steps: ['2 copies times 5 copies is 7 copies total.', 'x² · x⁵ = x⁷ — add the exponents.'],
      },
      {
        q: 'Evaluate 6⁰.',
        answers: ['1'],
        steps: ['Zero copies of multiplying leaves the do-nothing number.', 'Any nonzero number to the 0 power is 1.'],
      },
      {
        q: 'Evaluate 2⁻². Write it as a fraction.',
        answers: ['1/4', '0.25', '.25'],
        steps: ['A negative exponent flips the power under 1: 2⁻² = 1 ÷ 2².', '2² = 4, so 2⁻² = 1/4.'],
      },
    ],
    watchOut: 'x³ · x⁴ is x⁷, not x¹² — multiplying powers ADDS the exponents, it never multiplies them.',
  },
  {
    domain: 'A1', unit: 11, title: 'Adding vs. multiplying: growth showdown',
    objective: 'Tell linear from exponential growth.',
    concept: [
      'LINEAR growth ADDS the same amount each step — like an allowance of +$5 every week. Its graph is a straight ramp.',
      'EXPONENTIAL growth MULTIPLIES by the same factor each step — like a penny that DOUBLES every day. Its graph curves up like a rocket launch: slow start, huge finish.',
      'The rule is y = a · bˣ: START times FACTOR, applied x times. a is where you begin; b is what you multiply by each step.',
      'Get the factor from a percent: up 10% means keep 100% and gain 10%, so ×1.10. Down 20% means keep 80%, so ×0.80.',
      'In any race, exponential EVENTUALLY beats linear — the adder takes the same step forever, but the multiplier takes bigger steps every single round.',
    ],
    examples: [
      {
        q: 'A dish starts with 5 bacteria and the count doubles every hour. How many after 3 hours?',
        steps: [
          'Doubling means multiply by 2 each hour: y = 5 · 2ˣ.',
          'Step it out: 5 → 10 → 20 → 40.',
          'After 3 hours there are 40 bacteria.',
        ],
        answer: '40 bacteria',
      },
      {
        q: 'Your $500 phone loses 20% of its value each year. What is it worth after 2 years?',
        steps: [
          'Losing 20% means keeping 80%: the factor is 0.80.',
          'Year 1: 500 × 0.80 = 400.',
          'Year 2: 400 × 0.80 = 320. It loses fewer dollars each year, because 20% of a smaller number is smaller.',
        ],
        answer: '$320',
      },
      {
        q: 'For y = 3 · 2ˣ, find y when x = 4.',
        steps: [
          'Power first: 2⁴ = 16.',
          'Then multiply by the start: y = 3 × 16 = 48.',
          'Never merge the 3 into the base — 6⁴ = 1296 would be way off.',
        ],
        answer: 'y = 48',
      },
      {
        q: 'Penny showdown: +$5 a day, or a penny that doubles daily — which is worth more after 10 doublings?',
        steps: [
          'Adding: 5 × 10 = $50. Steady, same step every day.',
          'Doubling: 1 cent × 2¹⁰ = 1024 cents ≈ $10.24. Still behind!',
          'But by day 20 the penny is over $10,000 — the multiplier always wins in the long run.',
        ],
        answer: 'The +$5 plan after 10 days; the penny soon after',
      },
    ],
    practice: [
      {
        q: 'A quantity grows 10% per year. What factor do you multiply by each year?',
        answers: ['1.10', '1.1'],
        steps: ['Keep 100% and gain 10%: 110% in all.', 'As a decimal that is 1.10.'],
      },
      {
        q: 'An account starts with 200 followers and gains 100 each week. How many after 3 weeks?',
        answers: ['500', '500 followers'],
        steps: ['Linear: add 100 three times, 3 × 100 = 300.', '200 + 300 = 500 followers.'],
      },
      {
        q: 'A pattern goes 4, 12, 36, 108, ... What is the growth factor?',
        answers: ['3', 'x3', '×3'],
        steps: ['Divide neighbors: 12 ÷ 4 = 3 and 36 ÷ 12 = 3.', 'Each step multiplies by 3.'],
      },
    ],
    watchOut: 'For "down 20% each year," multiply by 0.80 (what you KEEP) — multiplying $500 by 0.20 gives $100, the part you lost, not the phone\'s value.',
  },
];
