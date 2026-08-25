import type { Lesson } from '../lessons';

// PC Units 5-8: Exponential functions, Logarithms, Solving exponential & log
// equations, Right-triangle trigonometry. Plain text with unicode ×, ÷, −, ²,
// ³, √, ° — no KaTeX here.

export const PC_LESSONS_U05_08: Lesson[] = [
  // ---------------- Unit 5 — Exponential functions ----------------
  {
    domain: 'PC', unit: 5, title: 'Exponential functions: the repeat-multiply machine',
    objective: 'Build and evaluate exponential functions.',
    concept: [
      'An EXPONENTIAL function repeats a MULTIPLICATION, the way a line repeats an addition. Its shape is y = a · b^x.',
      'The number a is the START — what you have before any steps happen (that is x = 0).',
      'The base b is the GROWTH FACTOR: what you MULTIPLY by at each step.',
      'If b is bigger than 1 the amount GROWS. If b is between 0 and 1 it DECAYS (shrinks).',
      'Turn a percent into a factor: up 8% → × 1.08, down 20% → × 0.80. Keep 100%, then add or subtract.',
      'DOUBLING TIME is how long one doubling takes. Total time ÷ doubling time = how many doublings.',
      'A decaying exponential dives toward zero forever but never reaches it — that invisible floor is the HORIZONTAL ASYMPTOTE at y = 0.',
    ],
    examples: [
      {
        q: 'Evaluate y = 4 · 2^x when x = 3.',
        steps: ['Do the power first: 2³ = 2 × 2 × 2 = 8.', 'Multiply by the start: 4 × 8 = 32.'],
        answer: '32',
      },
      {
        q: 'A dish starts with 50 bacteria and doubles every hour. How many after 4 hours?',
        steps: ['Start a = 50, growth factor b = 2, steps x = 4.', '2⁴ = 16.', '50 × 16 = 800 bacteria.'],
        answer: '800',
      },
      {
        q: 'A savings account grows 8% a year. What is the growth factor?',
        steps: ['You keep all 100% and add 8% more.', '100% + 8% = 108%.', '108% written as a decimal is 1.08.'],
        answer: '1.08',
      },
      {
        q: 'A $600 phone loses 25% of its value each year. What is it worth after 2 years?',
        steps: ['Losing 25% means keeping 75%, so the decay factor is 0.75.', 'Year 1: 600 × 0.75 = 450.', 'Year 2: 450 × 0.75 = 337.50.'],
        answer: '$337.50',
      },
      {
        q: 'A colony of 100 cells doubles every 3 hours. How many cells after 12 hours?',
        steps: ['Count the doublings: 12 ÷ 3 = 4 doublings.', 'Multiply by 2 four times: 2⁴ = 16.', '100 × 16 = 1600 cells.'],
        answer: '1600',
      },
    ],
    practice: [
      {
        q: 'In y = 200 · 1.5^x, what is the growth factor?',
        answers: ['1.5'],
        steps: ['The growth factor is the base — the number raised to the power x.', 'That number is 1.5.'],
      },
      {
        q: 'Each hour, 20% of a medicine leaves your bloodstream. What decay factor do you multiply by each hour?',
        answers: ['0.8', '0.80'],
        steps: ['Ask what STAYS: 100% − 20% = 80%.', '80% as a decimal is 0.8.'],
      },
      {
        q: 'You have 200 followers and gain 10% each week. How many after 2 weeks?',
        answers: ['242'],
        steps: ['Growth factor is 1.1.', 'Week 1: 200 × 1.1 = 220.', 'Week 2: 220 × 1.1 = 242.'],
      },
      {
        q: 'The graph of y = 12 · (1/2)^x hugs one horizontal line forever. What is its y-value?',
        answers: ['0'],
        steps: ['Halving a positive number keeps it positive, so it never hits zero.', 'But the values shrink toward zero: 12, 6, 3, 1.5, 0.75 …', 'The asymptote is y = 0.'],
      },
    ],
    watchOut: 'Do not multiply the start by the exponent. In y = 4 · 2³ the answer is 4 × 8 = 32, not 4 × 3 = 12 — the power gets built FIRST, then you multiply by the start.',
  },

  // ---------------- Unit 6 — Logarithms ----------------
  {
    domain: 'PC', unit: 6, title: 'Logarithms: the question machine',
    objective: 'Read and evaluate logarithms.',
    concept: [
      'A LOGARITHM asks one question: what POWER do I raise the base to?',
      'log base 2 of 8 is 3, because 2³ = 8. The answer to a log is always an EXPONENT.',
      'Logs and exponents are UNDO TWINS: one builds the power, the other digs the exponent back out.',
      'Multiplying inside a log turns into ADDING outside: log(AB) = log A + log B.',
      'Dividing inside turns into SUBTRACTING: log(A ÷ B) = log A − log B.',
      'An exponent inside a log SLIDES OUT front: log(Aⁿ) = n × log A.',
      'Real scales are logs in disguise: Richter, decibels, and pH all mean "each step is ten times more".',
    ],
    examples: [
      {
        q: 'Evaluate log base 3 of 81.',
        steps: ['Ask: 3 to what power is 81?', '3 × 3 × 3 × 3 = 81, so the power is 4.'],
        answer: '4',
      },
      {
        q: 'Evaluate log base 10 of 1000.',
        steps: ['Ask: 10 to what power is 1000?', '10 × 10 × 10 = 1000.', 'Shortcut for base 10: count the zeros — there are 3.'],
        answer: '3',
      },
      {
        q: 'You know log 2 = 0.301 and log 5 = 0.699. Find log 10.',
        steps: ['10 = 2 × 5, and multiplying inside means adding outside.', 'log 10 = log 2 + log 5 = 0.301 + 0.699 = 1.'],
        answer: '1',
      },
      {
        q: 'Evaluate log base 2 of 8³.',
        steps: ['The exponent slides out front: log₂(8³) = 3 × log₂ 8.', 'log₂ 8 = 3, because 2³ = 8.', '3 × 3 = 9.'],
        answer: '9',
      },
      {
        q: 'On the Richter scale, how many times more shaking is a magnitude 7 quake than a magnitude 4?',
        steps: ['Count the steps: 7 − 4 = 3 steps.', 'Each step means 10 times more.', '10 × 10 × 10 = 1000 times more.'],
        answer: '1000',
      },
    ],
    practice: [
      {
        q: 'Evaluate log base 5 of 125.',
        answers: ['3'],
        steps: ['5 × 5 × 5 = 125.', 'So the power is 3.'],
      },
      {
        q: 'Every fold doubles the layers of a paper. Starting at 1 layer, how many folds reach 1024 layers?',
        answers: ['10'],
        steps: ['This asks log base 2 of 1024.', 'Double from 1: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 — ten doublings.'],
      },
      {
        q: 'Evaluate log base 2 of 96 minus log base 2 of 3.',
        answers: ['5'],
        steps: ['Subtracting logs means dividing inside: 96 ÷ 3 = 32.', 'log base 2 of 32 = 5, because 2⁵ = 32.'],
      },
      {
        q: 'Lemon juice has pH 2 and water has pH 7. How many times more acidic is lemon juice?',
        answers: ['100000', '100,000'],
        steps: ['Count the steps: 7 − 2 = 5.', 'Each step down is 10 times more acidic.', '10⁵ = 100,000.'],
      },
    ],
    watchOut: 'You can never take the log of zero or a negative number — no power of a positive base ever lands there. And log(A + B) is NOT log A + log B; only MULTIPLYING inside turns into adding.',
  },

  // ------- Unit 7 — Solving exponential & log equations -------
  {
    domain: 'PC', unit: 7, title: 'Solving exponential and log equations',
    objective: 'Solve exponential and logarithmic equations.',
    concept: [
      'SAME-BASE TRICK: make both sides powers of the same base, then the exponents must match. 2^x = 32 becomes 2^x = 2⁵, so x = 5.',
      'Get the power ALONE first. In 3 · 2^x = 96, divide by 3 before you touch the exponent.',
      'When the bases will not match, TAKE THE LOG of both sides — the exponent slides down and becomes a regular number you can solve for.',
      'To crack a log equation, REWRITE IT IN EXPONENTIAL FORM: log₄(x) = 3 becomes 4³ = x.',
      'Combine logs before rewriting: log A + log B = log(AB), and log A − log B = log(A ÷ B).',
      'ALWAYS CHECK your answers in the original equation. An answer that makes you log a zero or a negative BREAKS the log and must be thrown out.',
      'Doubling stories: divide the target by the start, count the doublings, then multiply by the doubling time.',
    ],
    examples: [
      {
        q: 'Solve 2^x = 32.',
        steps: ['Write 32 as a power of 2: 32 = 2⁵.', 'Now 2^x = 2⁵, so the exponents match.'],
        answer: 'x = 5',
      },
      {
        q: 'Solve log base 4 of x = 3.',
        steps: ['Rewrite in exponential form: 4³ = x.', '4 × 4 × 4 = 64.'],
        answer: 'x = 64',
      },
      {
        q: 'Solve 3 · 2^x = 96.',
        steps: ['Get the power alone: divide both sides by 3, giving 2^x = 32.', '32 = 2⁵, so x = 5.', 'Check: 3 × 32 = 96. ✓'],
        answer: 'x = 5',
      },
      {
        q: 'Your savings double every 7 years. You have $2000. When will you have $16,000?',
        steps: ['Divide: 16,000 ÷ 2000 = 8.', '8 = 2³, so you need 3 doublings.', '3 × 7 = 21 years.'],
        answer: '21 years',
      },
      {
        q: 'Solve log₂(x) + log₂(x − 6) = 4.',
        steps: ['Combine: log₂(x(x − 6)) = 4.', 'Rewrite as a power: x(x − 6) = 2⁴ = 16, so x² − 6x − 16 = 0.', 'Factor: (x − 8)(x + 2) = 0, giving x = 8 or x = −2.', 'Check: x = −2 makes log₂(−2), which is impossible. Throw it out.'],
        answer: 'x = 8',
      },
    ],
    practice: [
      {
        q: 'Solve 5^x = 625.',
        answers: ['4', 'x = 4'],
        steps: ['Multiply by 5 and count: 5, 25, 125, 625 — four fives.', 'So x = 4.'],
      },
      {
        q: 'Solve 2^(x + 1) = 16.',
        answers: ['3', 'x = 3'],
        steps: ['16 = 2⁴, so 2^(x+1) = 2⁴.', 'Match exponents: x + 1 = 4, so x = 3.'],
      },
      {
        q: 'A 400 mg dose loses half its amount every 4 hours. After how many hours is 25 mg left?',
        answers: ['16', '16 hours'],
        steps: ['400 → 200 → 100 → 50 → 25 is 4 halvings.', '4 halvings × 4 hours = 16 hours.'],
      },
      {
        q: 'A town of 1250 people doubles every 10 years. After how many years does it reach 10,000?',
        answers: ['30', '30 years'],
        steps: ['10,000 ÷ 1250 = 8, and 8 = 2³, so 3 doublings.', '3 × 10 = 30 years.'],
      },
    ],
    watchOut: 'Never skip the check on a log equation. Solving can hand you an answer that makes the inside of a log zero or negative — that answer is fake and has to be thrown out, even though the algebra looked perfect.',
  },

  // ------- Unit 8 — Right-triangle trigonometry -------
  {
    domain: 'PC', unit: 8, title: 'Right-triangle trig: SOH-CAH-TOA',
    objective: 'Find sides and angles in right triangles.',
    concept: [
      'LABEL FIRST, ALWAYS. Pick your angle, then name the three sides from ITS point of view.',
      'The HYPOTENUSE is the slanted side across from the right angle — always the longest, and it never changes.',
      'The OPPOSITE side is across the triangle from your angle. The ADJACENT side is the leg that TOUCHES your angle.',
      'SOH-CAH-TOA: Sine = Opposite ÷ Hypotenuse, Cosine = Adjacent ÷ Hypotenuse, Tangent = Opposite ÷ Adjacent.',
      'Two triangles are worth memorizing: the 3-4-5 (and its double 6-8-10), and the 45-45-90 where both legs match.',
      'In a 30-60-90 triangle the side opposite 30° is exactly HALF the hypotenuse, so sin 30° = 1/2.',
      'A ratio gives you the angle back through INVERSE TRIG: if tan = 1, the angle is 45°; if sin = 1/2, the angle is 30°.',
      'ANGLE OF ELEVATION is measured up from level ground; ANGLE OF DEPRESSION is measured down from level.',
    ],
    examples: [
      {
        q: 'An angle has opposite 3, adjacent 4, hypotenuse 5. Find its sine and cosine.',
        steps: ['SOH: sine = opposite ÷ hypotenuse = 3 ÷ 5 = 0.6.', 'CAH: cosine = adjacent ÷ hypotenuse = 4 ÷ 5 = 0.8.'],
        answer: 'sine 0.6, cosine 0.8',
      },
      {
        q: 'A right triangle has legs 6 and 8. For the angle with opposite 6 and adjacent 8, find the tangent.',
        steps: ['TOA: tangent = opposite ÷ adjacent = 6 ÷ 8.', '6 ÷ 8 simplifies to 3/4 = 0.75.'],
        answer: '0.75',
      },
      {
        q: 'A ladder reaches 5 m up a wall with its foot 5 m out. What angle does it make with the ground?',
        steps: ['Opposite is 5 and adjacent is 5, so use tangent: tan = 5 ÷ 5 = 1.', 'The angle whose tangent is 1 is 45°.', 'Check: both legs equal means a 45-45-90 triangle. ✓'],
        answer: '45°',
      },
      {
        q: 'A wheelchair ramp is 10 ft along the slope and rises at 30°. How high is the top?',
        steps: ['The ramp is the hypotenuse; the height is opposite the 30° angle.', 'SOH: sin 30° = height ÷ 10, and sin 30° = 1/2.', 'height = 1/2 × 10 = 5 ft.'],
        answer: '5 ft',
      },
      {
        q: 'A tree casts a 20 ft shadow and the angle of elevation to its top is 45°. How tall is the tree?',
        steps: ['The shadow is adjacent, the tree is opposite: tan 45° = height ÷ 20.', 'tan 45° = 1, so height = 20 ft.'],
        answer: '20 ft',
      },
    ],
    practice: [
      {
        q: 'In a 30-60-90 triangle the hypotenuse is 12. How long is the side opposite the 30° angle?',
        answers: ['6'],
        steps: ['The side opposite 30° is half the hypotenuse.', '12 ÷ 2 = 6.'],
      },
      {
        q: 'A right triangle has one angle of 55°. What is the third angle, in degrees?',
        answers: ['35', '35°'],
        steps: ['The right angle takes 90°, leaving 90° for the other two.', '90 − 55 = 35.'],
      },
      {
        q: 'A kite on a 40 m string flies 20 m above your hands. What angle does the string make with the ground?',
        answers: ['30', '30°'],
        steps: ['String is the hypotenuse, height is opposite: sin = 20 ÷ 40 = 1/2.', 'The angle whose sine is 1/2 is 30°.'],
      },
      {
        q: 'A right triangle has sides 3, 4, and 5. Which side is the hypotenuse?',
        answers: ['5'],
        steps: ['The hypotenuse sits across from the right angle and is always the longest side.', 'The longest of 3, 4, 5 is 5.'],
      },
    ],
    watchOut: 'Opposite and adjacent SWAP when you switch to the other angle — only the hypotenuse stays put. Relabel the triangle for the new angle before you pick sine, cosine, or tangent, or you will divide the wrong two sides.',
  },
];
