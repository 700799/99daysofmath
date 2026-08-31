import type { Lesson } from '../lessons';

// Precalculus — Units 9–11: the unit circle & radians, graphing sine and
// cosine, and trig identities & equations. Plain text with unicode math
// (×, −, ², √, π, °, θ, ≈); no KaTeX in lessons.
export const PC_LESSONS_U09_11: Lesson[] = [
  {
    domain: 'PC', unit: 9, title: 'The unit circle & radians',
    objective: 'Read points and radians on the circle.',
    concept: [
      'The UNIT CIRCLE is a circle of radius 1 sitting at the centre of the grid. Every angle points at one spot on the rim, and that spot is the pair (cos θ, sin θ).',
      'COSINE is the SHADOW ACROSS and SINE is the HEIGHT UP. Aim a clock hand of length 1 at your angle: how far across the tip lands is the cosine, how far up is the sine.',
      'RADIANS measure an angle by ARC LENGTH — how far you walk around the rim. Half a turn is π radians = 180°, and a full turn is 2π radians = 360°.',
      'The four QUADRANTS tell you the signs. Q1 (0°–90°): both positive. Q2 (90°–180°): across negative, up positive. Q3 (180°–270°): both negative. Q4 (270°–360°): across positive, up negative.',
    ],
    examples: [
      {
        q: 'What is cos 0°, and what is sin 90°?',
        steps: [
          'At 0° the clock hand points straight right, so the tip is at (1, 0).',
          'Cosine reads the across number: cos 0° = 1. Sine reads the up number: sin 0° = 0.',
          'At 90° the hand points straight up, so the tip is at (0, 1).',
          'So sin 90° = 1 and cos 90° = 0.',
        ],
        answer: 'cos 0° = 1 and sin 90° = 1',
      },
      {
        q: 'How many degrees is π/3 radians?',
        steps: [
          'Start from the swap rule: π radians = 180°.',
          'π/3 means π cut into 3 equal pieces, so cut 180° into 3 equal pieces.',
          '180 ÷ 3 = 60.',
          'So π/3 radians = 60°, one of the exact-value angles.',
        ],
        answer: '60°',
      },
      {
        q: 'A Ferris wheel has radius 15 m and its centre is 20 m above the ground. A seat starts at the far right and turns 90°. How high is it now?',
        steps: [
          'Height above ground = centre height + radius × sin θ.',
          'That is 20 + 15 × sin 90°.',
          'sin 90° = 1, so the height is 20 + 15 × 1.',
          '20 + 15 = 35 m. A quarter turn from the side puts the seat at the very top.',
        ],
        answer: '35 metres',
      },
      {
        q: 'A game character faces 300°. Which quadrant is that, and what are the signs of cos and sin?',
        steps: [
          '300° sits between 270° and 360°, so it is in Quadrant 4.',
          'Quadrant 4 is the bottom-right slice: right of centre and below it.',
          'Right of centre means the across number is positive, so cos θ > 0.',
          'Below centre means the up number is negative, so sin θ < 0.',
        ],
        answer: 'Quadrant 4: cos positive, sin negative',
      },
    ],
    practice: [
      {
        q: 'How many degrees is π/2 radians?',
        answers: ['90', '90°', '90 degrees'],
        steps: ['Use π radians = 180°.', 'Half of 180° is 90°, so π/2 radians = 90°.'],
      },
      {
        q: 'sin 30° = 1/n. What is n?',
        answers: ['2', 'n = 2', 'n=2'],
        steps: ['Slice an equilateral triangle with side 1 down the middle: the short leg is exactly 1/2.', 'That short leg is the height at 30°, so sin 30° = 1/2 and n = 2.'],
      },
      {
        q: 'In which quadrant are BOTH cos θ and sin θ negative? Give the quadrant number.',
        answers: ['3', 'Q3', 'quadrant 3'],
        steps: ['Negative across means left of centre; negative up means below centre.', 'Left and below is the bottom-left slice, which is Quadrant 3 (180°–270°).'],
      },
    ],
    watchOut: 'Do not swap them: cosine is the ACROSS number (x) and sine is the UP number (y) — reading the point (0, 1) at 90° as cos 90° = 1 is the classic mix-up.',
  },
  {
    domain: 'PC', unit: 10, title: 'Graphing sine & cosine',
    objective: 'Read amplitude, period, and midline.',
    concept: [
      'A sine graph is a WAVE: it rises, falls, and repeats forever — like a jump rope you keep shaking, or the trace on a heartbeat monitor.',
      'AMPLITUDE is how far the wave swings from the middle — HALF the distance from peak to trough. It is the number multiplying the sine.',
      'The MIDLINE is the calm level the wave wiggles around, set by the number added at the end. In y = a·sin(x) + k, the midline is y = k.',
      'PERIOD is how far one full wave takes: 360° divided by the number in front of x. A PHASE SHIFT slides the whole wave sideways: y = sin(x − c) slides it c degrees RIGHT.',
    ],
    examples: [
      {
        q: 'A Ferris wheel seat follows h = 18 sin(x) + 22 metres. Find the amplitude, the midline, and the highest point.',
        steps: [
          'Compare to h = a·sin(x) + k. Here a = 18 and k = 22.',
          'The amplitude is 18 m — that is the radius of the wheel.',
          'The midline is 22 m — that is how high the centre of the wheel sits.',
          'Highest = midline + amplitude = 22 + 18 = 40 m. Lowest = 22 − 18 = 4 m.',
        ],
        answer: 'amplitude 18 m, midline 22 m, highest 40 m',
      },
      {
        q: 'What is the period of y = sin(2x), in degrees?',
        steps: [
          'Period = 360° ÷ b, where b is the number in front of x inside the sine.',
          'Here b = 2, so period = 360 ÷ 2.',
          'That gives 180°.',
          'Check the idea: b = 2 packs two whole waves into 360°, so each is 180° wide.',
        ],
        answer: '180°',
      },
      {
        q: 'A harbour is 9 m deep at high tide and 3 m deep at low tide. Find the midline and the amplitude.',
        steps: [
          'The midline is the average of the extremes: (9 + 3) ÷ 2 = 6 m.',
          'The amplitude is HALF the gap: (9 − 3) ÷ 2 = 3 m.',
          'Check: 6 + 3 = 9 (high) and 6 − 3 = 3 (low).',
          'So the tide model is depth = 3 sin(x) + 6.',
        ],
        answer: 'midline 6 m, amplitude 3 m',
      },
      {
        q: 'A heart monitor traces y = 3 sin(6x), with x in degrees. How wide is one beat, and how tall is it?',
        steps: [
          'One beat is one full wave, which is the period.',
          'Period = 360 ÷ 6 = 60°, so each beat is 60° wide.',
          'The 3 in front is the amplitude, so the trace rises 3 above and drops 3 below the flat line.',
          'A bigger number inside squeezes the beats closer; a bigger number outside makes them taller.',
        ],
        answer: '60° wide, amplitude 3',
      },
    ],
    practice: [
      {
        q: 'What is the amplitude of y = 7 sin(x) + 2?',
        answers: ['7', 'a = 7', '7 units'],
        steps: ['The amplitude is the number multiplying the sine.', 'That number is 7, so the wave swings 7 above and 7 below the midline y = 2.'],
      },
      {
        q: 'What is the period of y = cos(4x), in degrees?',
        answers: ['90', '90°', '90 degrees'],
        steps: ['Period = 360° ÷ b, and here b = 4.', '360 ÷ 4 = 90, so one full wave takes 90°.'],
      },
      {
        q: 'The longest day has 16 hours of daylight and the shortest has 8. What is the amplitude, in hours?',
        answers: ['4', '4 hours', '4 h'],
        steps: ['The gap from longest to shortest is 16 − 8 = 8 hours.', 'Amplitude is half that gap: 8 ÷ 2 = 4 hours (around a midline of 12 hours).'],
      },
    ],
    watchOut: 'The amplitude is HALF the distance from the highest point to the lowest — not the whole distance.',
  },
  {
    domain: 'PC', unit: 11, title: 'Trig identities & equations',
    objective: 'Use identities to simplify and solve.',
    concept: [
      'The PYTHAGOREAN IDENTITY says sin²θ + cos²θ = 1 for EVERY angle. It IS the Pythagorean theorem drawn on the unit circle: the across leg is cos θ, the up leg is sin θ, and the slanted side is the radius 1.',
      'Rearranged, it becomes a simplifying tool: cos²θ = 1 − sin²θ and sin²θ = 1 − cos²θ. Whenever you see 1 minus a square, swap in the other square.',
      'TANGENT is just sine over cosine: tan θ = sin θ ÷ cos θ. It is the SLOPE of the line from the centre out to the point — rise over run.',
      'A basic trig equation usually has TWO answers in one turn (0° to 360°), like a rotating platform passing the same height once going up and once coming down. For sine, the partner is 180° − θ; for tangent, it is θ + 180°.',
    ],
    examples: [
      {
        q: 'For some angle, sin²θ = 0.36. What is cos²θ?',
        steps: [
          'The identity says sin²θ + cos²θ = 1.',
          'Substitute the known piece: 0.36 + cos²θ = 1.',
          'Subtract 0.36 from both sides.',
          'cos²θ = 0.64. (So cos θ = 0.8 or −0.8, depending on the quadrant.)',
        ],
        answer: 'cos²θ = 0.64',
      },
      {
        q: 'A game stores cos θ = 0.6 with θ in Quadrant 1. What is sin θ?',
        steps: [
          'Use sin²θ + cos²θ = 1, so sin²θ = 1 − 0.6².',
          '0.6² = 0.36, so sin²θ = 1 − 0.36 = 0.64.',
          'Take the square root: sin θ = 0.8 or −0.8.',
          'Quadrant 1 is up-and-right, where sine is positive, so sin θ = 0.8.',
        ],
        answer: 'sin θ = 0.8',
      },
      {
        q: 'Solve sin θ = 0.5 for 0° ≤ θ < 360°.',
        steps: [
          'Draw a flat line at height 0.5 across the unit circle — it cuts the rim in TWO places.',
          'The first crossing is the exact-value angle 30°.',
          'The partner is its mirror across the top: 180 − 30 = 150°.',
          'So θ = 30° and θ = 150°. Two answers in one turn.',
        ],
        answer: 'θ = 30° and θ = 150°',
      },
      {
        q: 'Simplify (1 − sin²θ) ÷ cos θ, assuming cos θ is not 0.',
        steps: [
          'The top is 1 − sin²θ, which the identity turns into cos²θ.',
          'So the whole thing is cos²θ ÷ cos θ.',
          'Two copies of cos θ on top, one on the bottom — one cancels.',
          'The answer is cos θ.',
        ],
        answer: 'cos θ',
      },
    ],
    practice: [
      {
        q: 'sin θ = 0.6 and cos θ = 0.8. What is tan θ?',
        answers: ['0.75', '3/4', '.75'],
        steps: ['tan θ = sin θ ÷ cos θ = 0.6 ÷ 0.8.', 'That is the same as 6/8 = 3/4 = 0.75.'],
      },
      {
        q: 'How many angles between 0° and 360° make sin θ = 0.5 true?',
        answers: ['2', 'two', '2 answers'],
        steps: ['A flat line at height 0.5 cuts the unit circle in two places: one going up, one coming down.', 'So there are 2 solutions, at 30° and 150°.'],
      },
      {
        q: 'tan θ = 1 has one answer at 45°. What is the other answer between 0° and 360°?',
        answers: ['225', '225°', '225 degrees'],
        steps: ['Flipping the sign of BOTH sin θ and cos θ leaves the fraction sin ÷ cos unchanged.', 'That opposite direction is half a turn away: 45 + 180 = 225°.'],
      },
    ],
    watchOut: 'A trig equation on 0°–360° almost always has TWO answers — stopping at the first one you find is the mistake that loses the most marks.',
  },
];
