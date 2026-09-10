import type { Lesson } from '../lessons';

// Trigonometry, Units 1-14: angles and radians, right-triangle and unit-circle
// trig, graphing, inverses, identities, equations, and oblique triangles.

export const TRIG_LESSONS: Lesson[] = [
  // ---------------- TRIG Unit 1 — Angles and angle measure ----------------
  {
    domain: 'TRIG', unit: 1, title: 'Angles and angle measure',
    objective: 'Place an angle in standard position, name its quadrant, and find coterminal angles.',
    concept: [
      'An angle in STANDARD POSITION has its vertex at the origin and its initial side lying along the positive x-axis. The TERMINAL SIDE is where the turn stops.',
      'Positive angles turn COUNTERCLOCKWISE; negative angles turn CLOCKWISE. A clock hand runs the negative way — that is the one exception you have been staring at your whole life.',
      'QUADRANTS split the turn into four: 0° to 90° is QI, 90° to 180° is QII, 180° to 270° is QIII, 270° to 360° is QIV. An angle landing exactly on an axis is called QUADRANTAL.',
      'COTERMINAL angles share a terminal side. Add or subtract 360° as often as you like: 30°, 390° and −330° all point in exactly the same direction.',
      'PRO MOVE — to place a huge angle instantly, divide by 360 and keep only the remainder. 1000° leaves 280°, so it sits in QIV. The whole turns are just laps that changed nothing.',
    ],
    examples: [
      { q: 'In which quadrant does 210° lie?', steps: ['210° is past 180° but not yet 270°.', 'That is the third block of the turn.', 'Quadrant III.'], answer: 'Quadrant III' },
      { q: 'Find a positive angle coterminal with −50°.', steps: ['Add one full turn of 360°.', '−50° + 360° = 310°.'], answer: '310°' },
      { q: 'Find a negative angle coterminal with 100°.', steps: ['Subtract one full turn of 360°.', '100° − 360° = −260°.'], answer: '−260°' },
      { q: 'A Ferris wheel car boards at the 3 oclock position and rotates 450° counterclockwise. Where does it stop?', steps: ['450° − 360° = 90°.', 'That is one full lap plus a quarter turn.', 'It stops at the top of the wheel, at 90°.'], answer: '90°, the top' },
      { q: 'Which quadrant contains 1000°?', steps: ['1000 − 360 = 640, and 640 − 360 = 280.', '280° is between 270° and 360°.', 'Quadrant IV.'], answer: 'Quadrant IV' },
      { q: 'The minute hand of a clock sweeps from 12 to 4. Through what angle has it turned?', steps: ['A full circle of 360° takes 60 minutes, so one minute is 6°.', '12 to 4 is 20 minutes.', '20 × 6° = 120°.'], answer: '120°' },
    ],
    practice: [
      { q: 'Which quadrant contains 315°? Answer I, II, III or IV.', answers: ['IV', '4', 'quadrant iv', 'quadrant 4'], steps: ['315° is past 270° and short of 360°.', 'That is the last block of the turn: Quadrant IV.'] },
      { q: 'Find the angle between 0° and 360° that is coterminal with 800°. (Number only.)', answers: ['80', '80°', '80 degrees'], steps: ['Subtract full turns: 800 − 360 = 440.', '440 − 360 = 80.', 'The answer is 80°.'] },
      { q: 'Find the positive angle between 0° and 360° coterminal with −120°.', answers: ['240', '240°', '240 degrees'], steps: ['Add a full turn: −120 + 360.', '= 240°.'] },
      { q: 'How many degrees does a clock minute hand turn in one minute?', answers: ['6', '6°', '6 degrees'], steps: ['One full turn is 360° in 60 minutes.', '360 ÷ 60 = 6°.'] },
    ],
    watchOut: 'Coterminal is not the same as equal: 30° and 390° point the same way but are different rotations — strip off 360° only until you land in the range the question actually asked for.',
  },

  // ---------------- TRIG Unit 2 — Radians and arc length ----------------
  {
    domain: 'TRIG', unit: 2, title: 'Radians and arc length',
    objective: 'Convert between degrees and radians and use s = rθ and A = ½r²θ.',
    concept: [
      'A RADIAN is the angle you get by laying one radius-length of string along the circle. A full turn takes 2π of them, so 360° = 2π radians and 180° = π radians.',
      'Degrees to radians: multiply by π/180. Radians to degrees: multiply by 180/π. Set it up so the unit you do not want cancels.',
      'ARC LENGTH is s = rθ with θ in RADIANS. A radius of 3 metres swept through 2 radians traces 6 metres of arc — the formula really is that plain.',
      'SECTOR AREA is A = ½r²θ, again in radians. It is the pizza-slice version of the full circle area πr².',
      'PRO MOVE — memorise four anchors and build everything else: 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2. Then 150° is just five sixths of π, no arithmetic required.',
    ],
    examples: [
      { q: 'Convert 135° to radians.', steps: ['Multiply by π/180: 135π/180.', 'Divide top and bottom by 45.', '= 3π/4.'], answer: '3π/4' },
      { q: 'Convert 5π/6 radians to degrees.', steps: ['Multiply by 180/π: (5π/6)(180/π).', 'The π cancels: 5 × 180 ÷ 6.', '= 150°.'], answer: '150°' },
      { q: 'A circle has radius 8 cm. Find the arc length cut off by a central angle of 2.5 radians.', steps: ['Use s = rθ with θ already in radians.', 's = 8 × 2.5.', '= 20 cm.'], answer: '20 cm' },
      { q: 'A lawn sprinkler throws water 10 m and sweeps through 1.2 radians. What area does it water?', steps: ['Use A = ½r²θ.', 'A = ½ × 100 × 1.2.', '= 60 square metres.'], answer: '60 m²' },
      { q: 'About how many degrees is 1 radian?', steps: ['Multiply by 180/π.', '180 ÷ 3.14159 ≈ 57.3.'], answer: '≈ 57.3°' },
      { q: 'A bike wheel of radius 0.35 m rolls through 4 radians. How far does the bike travel?', steps: ['Rolling distance equals arc length: s = rθ.', 's = 0.35 × 4.', '= 1.4 m.'], answer: '1.4 m' },
    ],
    practice: [
      { q: 'Convert 60° to radians. Write it as a multiple of π.', answers: ['π/3', 'pi/3', '1π/3', 'π /3'], steps: ['Multiply by π/180: 60π/180.', 'Simplify by 60: π/3.'] },
      { q: 'Convert π/4 radians to degrees. (Number only.)', answers: ['45', '45°', '45 degrees'], steps: ['Multiply by 180/π.', '180 ÷ 4 = 45°.'] },
      { q: 'A circle has radius 6 m. Find the arc length for a central angle of 3 radians.', answers: ['18', '18 m', '18 metres', '18 meters'], steps: ['s = rθ = 6 × 3.', '= 18 m.'] },
      { q: 'Find the area of a sector with radius 4 and central angle 0.5 radians.', answers: ['4', '4 square units'], steps: ['A = ½r²θ = ½ × 16 × 0.5.', '= 4.'] },
    ],
    watchOut: 's = rθ and A = ½r²θ work ONLY when θ is in radians. Feeding them degrees is the single most common wrong answer in this unit — convert first, every time.',
  },

  // ---------------- TRIG Unit 3 — Right-triangle trigonometry ----------------
  {
    domain: 'TRIG', unit: 3, title: 'Right-triangle trigonometry',
    objective: 'Use SOH-CAH-TOA to find missing sides and angles, including elevation and depression problems.',
    concept: [
      'Label the sides from the angle you are working with: the HYPOTENUSE is always across from the right angle, the OPPOSITE side faces your angle, and the ADJACENT side touches it.',
      'SOH-CAH-TOA: sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent.',
      'To find a SIDE, choose the ratio that contains the side you want and a side you know, then solve it like any ordinary equation.',
      'To find an ANGLE, use the inverse: θ = tan⁻¹(opposite/adjacent), and likewise sin⁻¹ and cos⁻¹ when the hypotenuse is involved.',
      'PRO MOVE — sin and cos are always between 0 and 1 in a right triangle, because a leg is never longer than the hypotenuse. If you get 1.6, you flipped the fraction. And the longest side must face the biggest angle: one glance catches most slips.',
    ],
    examples: [
      { q: 'A 10 ft ladder leans against a wall at 65° to the ground. How high up the wall does it reach?', steps: ['The height is OPPOSITE the 65° angle and the ladder is the hypotenuse.', 'sin 65° = h/10, so h = 10 sin 65°.', 'h ≈ 9.1 ft.'], answer: '≈ 9.1 ft' },
      { q: 'In a right triangle the side adjacent to θ is 12 and the hypotenuse is 13. Find cos θ.', steps: ['Adjacent over hypotenuse is cosine.', 'cos θ = 12/13.'], answer: '12/13' },
      { q: 'A wheelchair ramp rises 2 ft over a horizontal run of 15 ft. Find the angle of elevation.', steps: ['Rise is opposite, run is adjacent, so use tangent.', 'tan θ = 2/15 ≈ 0.1333.', 'θ = tan⁻¹(0.1333) ≈ 7.6°.'], answer: '≈ 7.6°' },
      { q: 'From a window 40 m up, the angle of depression to a parked car is 25°. How far is the car from the base of the building?', steps: ['The angle of depression equals the angle of elevation from the car.', 'tan 25° = 40/d, so d = 40/tan 25°.', 'd ≈ 85.8 m.'], answer: '≈ 85.8 m' },
      { q: 'A right triangle has a 30° angle and a hypotenuse of 20. Find the side opposite the 30°.', steps: ['sin 30° = x/20.', 'x = 20 × 0.5.', 'x = 10.'], answer: '10' },
      { q: 'A person 6 ft tall casts a 4 ft shadow. Find the angle of elevation of the sun.', steps: ['Height is opposite, shadow is adjacent: tan θ = 6/4 = 1.5.', 'θ = tan⁻¹(1.5).', 'θ ≈ 56.3°.'], answer: '≈ 56.3°' },
    ],
    practice: [
      { q: 'In a right triangle, the side opposite θ is 3 and the hypotenuse is 5. What is sin θ?', answers: ['3/5', '0.6', '.6'], steps: ['Opposite over hypotenuse.', 'sin θ = 3/5 = 0.6.'] },
      { q: 'A 13 m ladder rests with its foot 5 m from the wall. What is the cosine of the angle at the ground? (Give a fraction.)', answers: ['5/13'], steps: ['The 5 m is adjacent, the ladder is the hypotenuse.', 'cos θ = 5/13.'] },
      { q: 'A ramp rises 3 ft over a run of 3 ft. What is its angle of elevation in degrees?', answers: ['45', '45°', '45 degrees'], steps: ['tan θ = 3/3 = 1.', 'θ = tan⁻¹(1) = 45°.'] },
      { q: 'Solve for x: sin 30° = x/12.', answers: ['6', 'x = 6', 'x=6'], steps: ['sin 30° = 0.5.', 'x = 12 × 0.5 = 6.'] },
    ],
    watchOut: 'Label the sides from the angle you are actually using, not from the picture in general — the moment you switch to the other acute angle, opposite and adjacent trade places.',
  },

  // ---------------- TRIG Unit 4 — Special right triangles ----------------
  {
    domain: 'TRIG', unit: 4, title: 'Special right triangles',
    objective: 'Use the 45-45-90 and 30-60-90 triangles to write exact trig values for 30°, 45° and 60°.',
    concept: [
      'The 45-45-90 triangle is half a square cut along its diagonal. Its sides run 1 : 1 : √2, with the √2 on the hypotenuse.',
      'The 30-60-90 triangle is half an equilateral triangle. Its sides run 1 : √3 : 2 — short leg opposite 30°, long leg opposite 60°, hypotenuse 2.',
      'Read the exact values straight off those two pictures: sin 30° = 1/2, cos 30° = √3/2, sin 45° = cos 45° = √2/2, sin 60° = √3/2, cos 60° = 1/2.',
      'The tangents follow for free: tan 30° = 1/√3 = √3/3, tan 45° = 1, tan 60° = √3.',
      'PRO MOVE — instead of memorising a table, order the three numbers by size: 1/2 ≈ 0.5, √2/2 ≈ 0.71, √3/2 ≈ 0.87. Sine grows as the angle grows from 0° to 90°, so sin 60° has to be the biggest. That one fact rebuilds the table any time you blank.',
    ],
    examples: [
      { q: 'A square has side 5. How long is its diagonal, exactly?', steps: ['The diagonal is the hypotenuse of a 45-45-90 triangle.', 'Hypotenuse = leg × √2.', '= 5√2.'], answer: '5√2' },
      { q: 'In a 30-60-90 triangle the hypotenuse is 12. Find the side opposite the 30° angle.', steps: ['The hypotenuse is twice the SHORT leg.', 'Short leg = 12 ÷ 2.', '= 6.'], answer: '6' },
      { q: 'In a 30-60-90 triangle the short leg is 7. Find the long leg exactly.', steps: ['The long leg is the short leg times √3.', '= 7√3.'], answer: '7√3' },
      { q: 'Give the exact value of cos 45°.', steps: ['In a 45-45-90 triangle, adjacent = 1 and hypotenuse = √2.', 'cos 45° = 1/√2.', 'Rationalise: = √2/2.'], answer: '√2/2' },
      { q: 'A loading ramp meets the ground at 30° and its sloped surface is 40 ft long. How high is the top end?', steps: ['Height is opposite the 30°, ramp is the hypotenuse.', 'h = 40 sin 30° = 40 × 1/2.', 'h = 20 ft.'], answer: '20 ft' },
      { q: 'Find the exact value of tan 60°.', steps: ['tan 60° = opposite/adjacent = √3/1.', '= √3.'], answer: '√3' },
    ],
    practice: [
      { q: 'What is sin 30° exactly?', answers: ['1/2', '0.5', '.5'], steps: ['The side opposite 30° is 1 and the hypotenuse is 2.', 'sin 30° = 1/2.'] },
      { q: 'What is tan 45°?', answers: ['1'], steps: ['Both legs of a 45-45-90 triangle are equal.', 'tan 45° = 1/1 = 1.'] },
      { q: 'A 45-45-90 triangle has legs of 9. Give the exact hypotenuse.', answers: ['9√2', '9sqrt2', '9sqrt(2)', '9*sqrt(2)', '9 root 2'], steps: ['Hypotenuse = leg × √2.', '= 9√2.'] },
      { q: 'In a 30-60-90 triangle the hypotenuse is 20. How long is the side opposite the 30° angle?', answers: ['10'], steps: ['The short leg is half the hypotenuse.', '20 ÷ 2 = 10.'] },
    ],
    watchOut: 'The hypotenuse of a 30-60-90 is twice the SHORT leg, never twice the long leg. Match each side to the angle it faces before you multiply anything.',
  },

  // ---------------- TRIG Unit 5 — The unit circle ----------------
  {
    domain: 'TRIG', unit: 5, title: 'The unit circle',
    objective: 'Read (cos θ, sin θ) off the unit circle and give exact values all the way around.',
    concept: [
      'The UNIT CIRCLE has radius 1 and sits centred at the origin. The point at angle θ has coordinates (cos θ, sin θ) — cosine is the x, sine is the y.',
      'Because the radius is 1, sin θ and cos θ can never leave the range −1 to 1. That is the whole reason a trig wave has a ceiling and a floor.',
      'The QUADRANTAL angles are the free ones: (1, 0) at 0, (0, 1) at π/2, (−1, 0) at π, and (0, −1) at 3π/2.',
      'Every common angle is built from just three numbers: 1/2, √2/2 and √3/2. Going around the circle only changes their signs and their order.',
      'PRO MOVE — picture the first quadrant as a staircase. At 30°, 45°, 60° the sines are √1/2, √2/2, √3/2, and the cosines are that same list read backwards. Learn one quadrant and reference angles handle the other three.',
    ],
    examples: [
      { q: 'Give the coordinates of the point on the unit circle at θ = π/3.', steps: ['π/3 is 60°, in QI.', 'x = cos 60° = 1/2 and y = sin 60° = √3/2.'], answer: '(1/2, √3/2)' },
      { q: 'Find sin(3π/2).', steps: ['3π/2 points straight down.', 'That point is (0, −1) and sine is the y-coordinate.', 'sin(3π/2) = −1.'], answer: '−1' },
      { q: 'Find cos(π).', steps: ['π points to the left along the x-axis.', 'That point is (−1, 0) and cosine is the x-coordinate.'], answer: '−1' },
      { q: 'Find the exact value of sin(5π/6).', steps: ['5π/6 is in QII with reference angle π/6.', 'sin(π/6) = 1/2, and sine is positive in QII.'], answer: '1/2' },
      { q: 'Find cos(7π/4).', steps: ['7π/4 is in QIV with reference angle π/4.', 'cos(π/4) = √2/2, and cosine is positive in QIV.'], answer: '√2/2' },
      { q: 'On a Ferris wheel of radius 1, your car sits at angle 2π/3. How far above the centre are you?', steps: ['Height above centre is the y-coordinate, which is sin(2π/3).', 'Reference angle π/3, sine positive in QII.', '= √3/2 ≈ 0.87 of a radius.'], answer: '√3/2' },
    ],
    practice: [
      { q: 'What is cos(π/3)?', answers: ['1/2', '0.5', '.5'], steps: ['π/3 is 60° and cosine is the x-coordinate.', 'cos 60° = 1/2.'] },
      { q: 'What is sin(π/2)?', answers: ['1'], steps: ['π/2 is the top of the circle, the point (0, 1).', 'Sine is the y-coordinate: 1.'] },
      { q: 'What is sin(π)?', answers: ['0'], steps: ['π is the point (−1, 0).', 'The y-coordinate is 0.'] },
      { q: 'Give the exact value of cos(3π/4).', answers: ['-√2/2', '−√2/2', '-sqrt2/2', '-sqrt(2)/2', '−sqrt2/2'], steps: ['3π/4 is in QII with reference angle π/4.', 'cos(π/4) = √2/2, and cosine is negative in QII.', '= −√2/2.'] },
    ],
    watchOut: 'Cosine is the x-coordinate and sine is the y — swap those two and every value in the bottom half of the circle comes out with the wrong sign.',
  },

  // ---------------- TRIG Unit 6 — Reference angles and signs ----------------
  {
    domain: 'TRIG', unit: 6, title: 'Reference angles and signs',
    objective: 'Find the reference angle for any angle and attach the correct sign in each quadrant.',
    concept: [
      'The REFERENCE ANGLE is the acute angle between the terminal side and the X-AXIS. It is never measured to the y-axis and never larger than 90°.',
      'By quadrant: QI use θ itself, QII use 180° − θ, QIII use θ − 180°, QIV use 360° − θ. In radians, swap 180° for π and 360° for 2π.',
      'ALL STUDENTS TAKE CALCULUS tells you what stays positive: All in QI, Sine in QII, Tangent in QIII, Cosine in QIV. Each reciprocal follows its partner.',
      'So the whole recipe is two steps: evaluate the function at the reference angle, then attach the sign the quadrant demands.',
      'PRO MOVE — you never have to trust the mnemonic, because the signs come from the coordinates. In QIII both x and y are negative, so cos and sin are negative and their quotient tan comes out positive. Derive it in three seconds instead of recalling it.',
    ],
    examples: [
      { q: 'Find the reference angle for 210°.', steps: ['210° is in QIII.', 'Reference = θ − 180° = 210 − 180.', '= 30°.'], answer: '30°' },
      { q: 'Find the reference angle for 300°.', steps: ['300° is in QIV.', 'Reference = 360° − θ = 360 − 300.', '= 60°.'], answer: '60°' },
      { q: 'Find the reference angle for 5π/6.', steps: ['5π/6 is in QII.', 'Reference = π − 5π/6.', '= π/6.'], answer: 'π/6' },
      { q: 'Find sin 210° exactly.', steps: ['Reference angle is 30°, so the size is sin 30° = 1/2.', '210° is in QIII, where sine is negative.', 'sin 210° = −1/2.'], answer: '−1/2' },
      { q: 'Find cos 300° exactly.', steps: ['Reference angle is 60°, so the size is cos 60° = 1/2.', '300° is in QIV, where cosine is positive.', 'cos 300° = 1/2.'], answer: '1/2' },
      { q: 'θ lies in QII and sin θ = 3/5. Find cos θ.', steps: ['A 3-4-5 triangle gives a cosine of size 4/5.', 'In QII cosine is negative.', 'cos θ = −4/5.'], answer: '−4/5' },
    ],
    practice: [
      { q: 'What is the reference angle for 135°? (Degrees, number only.)', answers: ['45', '45°', '45 degrees'], steps: ['135° is in QII.', '180 − 135 = 45°.'] },
      { q: 'What is the reference angle for 240°?', answers: ['60', '60°', '60 degrees'], steps: ['240° is in QIII.', '240 − 180 = 60°.'] },
      { q: 'Is tan 200° positive or negative?', answers: ['positive', 'pos', '+'], steps: ['200° is in QIII, where sine and cosine are both negative.', 'Negative divided by negative is positive, so tan is positive.'] },
      { q: 'Find cos 120° exactly.', answers: ['-1/2', '−1/2', '-0.5', '−0.5'], steps: ['Reference angle is 60°, so the size is 1/2.', '120° is in QII, where cosine is negative.', 'cos 120° = −1/2.'] },
    ],
    watchOut: 'The reference angle is always measured to the X-axis. For 300° that gives 60°, not the 30° you would get by measuring across to the y-axis.',
  },

  // ---------------- TRIG Unit 7 — Graphing sine and cosine ----------------
  {
    domain: 'TRIG', unit: 7, title: 'Graphing sine and cosine',
    objective: 'Graph sine and cosine waves by reading amplitude, period and midline.',
    concept: [
      'For y = a sin(bx) + d: |a| is the AMPLITUDE, d is the MIDLINE, and the PERIOD is 2π/b (or 360°/b if you are working in degrees).',
      'Sine starts on the midline heading up; cosine starts at the top. That single difference is the whole difference in shape.',
      'A negative a flips the wave upside down. It does not change the amplitude, which is a distance and so is always positive.',
      'To sketch one cycle, mark five points: start, quarter, half, three-quarter, end. The quarter marks sit period ÷ 4 apart.',
      'PRO MOVE — pull amplitude and midline out of the numbers you can actually see: midline = (max + min)/2 and amplitude = (max − min)/2. That works on a tide table or a daylight chart where no equation is given at all.',
    ],
    examples: [
      { q: 'State the amplitude and period of y = 3 sin(2x).', steps: ['Amplitude is |a| = 3.', 'Period is 2π/b = 2π/2.', 'Amplitude 3, period π.'], answer: 'amplitude 3, period π' },
      { q: 'State the amplitude and period of y = −4 cos(x/2).', steps: ['Amplitude is |−4| = 4; the minus only flips the graph.', 'b = 1/2, so period = 2π ÷ (1/2) = 4π.'], answer: 'amplitude 4, period 4π' },
      { q: 'A tide rises to 12 ft and falls to 2 ft. Find the midline and amplitude.', steps: ['Midline = (12 + 2)/2 = 7.', 'Amplitude = (12 − 2)/2 = 5.'], answer: 'midline 7 ft, amplitude 5 ft' },
      { q: 'Find the maximum and minimum of y = 2 sin x + 5.', steps: ['The midline is 5 and the amplitude is 2.', 'Max = 5 + 2 = 7, min = 5 − 2 = 3.'], answer: 'max 7, min 3' },
      { q: 'A Ferris wheel makes one full turn every 40 seconds. Find the period and the value of b, with t in seconds.', steps: ['One cycle takes 40 seconds, so the period is 40.', 'b = 2π/period = 2π/40.', 'b = π/20.'], answer: 'period 40 s, b = π/20' },
      { q: 'Find the period of y = cos(3x) in degrees.', steps: ['Period = 360°/b.', '360 ÷ 3 = 120°.'], answer: '120°' },
    ],
    practice: [
      { q: 'What is the amplitude of y = 5 sin(4x)?', answers: ['5'], steps: ['Amplitude is the size of the number in front.', '|5| = 5.'] },
      { q: 'What is the period of y = sin(4x)? Write it as a multiple of π.', answers: ['π/2', 'pi/2', '0.5π'], steps: ['Period = 2π/b = 2π/4.', '= π/2.'] },
      { q: 'What is the midline value of y = 3 cos x − 2? (Number only.)', answers: ['-2', '−2', 'y = -2', 'y=-2'], steps: ['The midline is the vertical shift d.', 'Here d = −2.'] },
      { q: 'Daylight peaks at 15 hours and bottoms out at 9 hours. What is the amplitude?', answers: ['3', '3 hours'], steps: ['Amplitude = (max − min)/2.', '(15 − 9)/2 = 3 hours.'] },
    ],
    watchOut: 'Amplitude is HALF the total height of the wave, not the full climb from trough to crest — a tide running from 2 ft to 12 ft has amplitude 5, not 10.',
  },

  // ---------------- TRIG Unit 8 — Transformations of trig graphs ----------------
  {
    domain: 'TRIG', unit: 8, title: 'Transformations of trig graphs',
    objective: 'Apply phase and vertical shifts, and write an equation from a given wave.',
    concept: [
      'The full form is y = a sin(b(x − c)) + d: a stretches vertically, b squeezes horizontally, c slides sideways (the PHASE SHIFT), and d slides up or down.',
      'Factor the b out before you read c. In y = sin(2x − π), rewrite it as sin(2(x − π/2)) — the shift is π/2, not π.',
      'A positive c shifts the graph RIGHT and a negative c shifts it LEFT. It feels backwards, which is exactly why it is worth saying out loud each time.',
      'To write an equation from a picture: get d from the midline, a from the amplitude, b from 2π ÷ period, and c from where a cycle begins.',
      'PRO MOVE — sine and cosine are the same wave a quarter-period apart, so any cosine graph can be written as a shifted sine and vice versa. If your phase shift comes out ugly, switch functions and it usually turns clean.',
    ],
    examples: [
      { q: 'Find the phase shift of y = sin(x − π/4).', steps: ['Compare with sin(b(x − c)): here c = π/4.', 'A positive c shifts right.'], answer: 'π/4 to the right' },
      { q: 'Find the phase shift of y = cos(2x + π).', steps: ['Factor the 2 out: cos(2(x + π/2)).', 'So c = −π/2.', 'Shift is π/2 to the left.'], answer: 'π/2 to the left' },
      { q: 'Describe y = 3 sin x + 4 compared with y = sin x.', steps: ['a = 3 stretches the wave to amplitude 3.', 'd = 4 lifts the midline to y = 4.', 'It now runs between 1 and 7.'], answer: 'amplitude 3, midline y = 4' },
      { q: 'A wave has maximum 10, minimum 4, period 8, and starts at its maximum when x = 0. Write a cosine equation.', steps: ['d = (10 + 4)/2 = 7 and a = (10 − 4)/2 = 3.', 'b = 2π/8 = π/4.', 'Starting at the max means no shift: y = 3 cos(πx/4) + 7.'], answer: 'y = 3 cos(πx/4) + 7' },
      { q: 'Find the midline of y = −2 cos x − 5.', steps: ['The vertical shift is d = −5.', 'The midline is the line y = −5.'], answer: 'y = −5' },
      { q: 'A Ferris wheel of radius 20 m has its centre 25 m up and turns once every 60 s. Riders board at the bottom at t = 0. Write a height equation.', steps: ['Midline d = 25 and amplitude a = 20.', 'b = 2π/60 = π/30.', 'Starting at the bottom means a flipped cosine: h = −20 cos(πt/30) + 25.'], answer: 'h = −20 cos(πt/30) + 25' },
    ],
    practice: [
      { q: 'What is the phase shift of y = sin(x − π/3)? Give the amount as a multiple of π.', answers: ['π/3', 'pi/3', 'π/3 right', 'pi/3 right'], steps: ['c = π/3 and it is positive.', 'The graph slides π/3 to the right.'] },
      { q: 'What is the vertical shift of y = cos x + 6?', answers: ['6', 'up 6', '+6'], steps: ['The added constant is d = 6.', 'The whole wave rises 6 units.'] },
      { q: 'Find b for a wave whose period is 4π.', answers: ['1/2', '0.5', '.5'], steps: ['b = 2π ÷ period.', '2π ÷ 4π = 1/2.'] },
      { q: 'A wave has maximum 9 and minimum 1. What is d, the midline?', answers: ['5'], steps: ['d = (max + min)/2.', '(9 + 1)/2 = 5.'] },
    ],
    watchOut: 'In y = sin(2x − π) the shift is π/2, not π. Factor the b out of the parentheses BEFORE you read the phase shift, or you will overshoot every time.',
  },

  // ---------------- TRIG Unit 9 — Tangent and the reciprocal functions ----------------
  {
    domain: 'TRIG', unit: 9, title: 'Tangent and the reciprocal functions',
    objective: 'Evaluate and graph tan, cot, sec and csc, and locate their asymptotes.',
    concept: [
      'The definitions: tan θ = sin θ/cos θ, cot θ = cos θ/sin θ, sec θ = 1/cos θ, csc θ = 1/sin θ. Notice that sec pairs with COSINE and csc pairs with SINE — the names are deliberately crossed.',
      'A function blows up where its denominator hits zero. tan and sec have VERTICAL ASYMPTOTES wherever cos θ = 0 (π/2, 3π/2, …); cot and csc have them wherever sin θ = 0 (0, π, 2π, …).',
      'The period of tan and cot is π, half that of sine and cosine. Their graphs repeat twice as fast.',
      'RANGE: tan and cot reach every real number, while sec and csc never land strictly between −1 and 1 — flipping a number no bigger than 1 always gives something at least 1.',
      'PRO MOVE — never memorise a separate table for sec and csc. Find the cosine or sine first, then flip it: cos 60° = 1/2, so sec 60° = 2. One table serves all six functions.',
    ],
    examples: [
      { q: 'Find tan(π/4).', steps: ['sin(π/4) = √2/2 and cos(π/4) = √2/2.', 'tan = (√2/2) ÷ (√2/2).', '= 1.'], answer: '1' },
      { q: 'Find sec 60°.', steps: ['sec is the reciprocal of cosine.', 'cos 60° = 1/2.', 'sec 60° = 2.'], answer: '2' },
      { q: 'Find csc(π/6).', steps: ['csc is the reciprocal of sine.', 'sin(π/6) = 1/2.', 'csc(π/6) = 2.'], answer: '2' },
      { q: 'Where is the first positive vertical asymptote of y = tan x?', steps: ['tan x = sin x/cos x blows up where cos x = 0.', 'The first positive such value is x = π/2.'], answer: 'x = π/2' },
      { q: 'Find cot(π/3).', steps: ['cot = cos/sin = (1/2) ÷ (√3/2).', '= 1/√3.', 'Rationalise: = √3/3.'], answer: '√3/3' },
      { q: 'Find tan 180°.', steps: ['sin 180° = 0 and cos 180° = −1.', 'tan = 0 ÷ (−1).', '= 0.'], answer: '0' },
    ],
    practice: [
      { q: 'What is tan 45°?', answers: ['1'], steps: ['sin 45° and cos 45° are equal.', 'Their quotient is 1.'] },
      { q: 'What is sec 0°?', answers: ['1'], steps: ['cos 0° = 1.', 'sec 0° = 1/1 = 1.'] },
      { q: 'Find csc(π/2).', answers: ['1'], steps: ['sin(π/2) = 1.', 'csc(π/2) = 1/1 = 1.'] },
      { q: 'What is the period of y = tan x? Write it as a multiple of π.', answers: ['π', 'pi', '1π', '180°', '180 degrees'], steps: ['Tangent repeats every half turn.', 'The period is π.'] },
    ],
    watchOut: 'sec goes with COS and csc goes with SIN — the first letters mislead almost everyone. Check the third letter instead: se-C and c-S-c.',
  },

  // ---------------- TRIG Unit 10 — Inverse trigonometric functions ----------------
  {
    domain: 'TRIG', unit: 10, title: 'Inverse trigonometric functions',
    objective: 'Evaluate arcsin, arccos and arctan while respecting their restricted ranges.',
    concept: [
      'An inverse trig function answers the question "which angle gives this value?" So arcsin(1/2) is the angle whose sine is 1/2.',
      'Sine repeats forever, so we RESTRICT it to make the inverse a genuine function. arcsin returns angles in [−90°, 90°], arctan returns (−90°, 90°), and arccos returns [0°, 180°].',
      'That means arcsin and arctan hand back QI or QIV angles, while arccos hands back QI or QII angles. They will never give you anything else.',
      'sin⁻¹x means the INVERSE FUNCTION, not 1/sin x. The reciprocal of sine is csc, and mixing the two is a genuine disaster.',
      'PRO MOVE — a calculator only reports the principal value, so a real-world angle in QII or QIII is yours to fix by hand. If sin θ = 0.6 and you know θ is obtuse, the answer is 180° − 36.87° = 143.13°, not the 36.87° on the screen.',
    ],
    examples: [
      { q: 'Find arcsin(1/2) in degrees.', steps: ['We want the angle in [−90°, 90°] whose sine is 1/2.', 'sin 30° = 1/2.'], answer: '30°' },
      { q: 'Find arccos(−1/2) in degrees.', steps: ['arccos returns an angle in [0°, 180°].', 'The reference angle is 60° and cosine is negative in QII.', '180° − 60° = 120°.'], answer: '120°' },
      { q: 'Find arctan(1) in degrees.', steps: ['We want the angle in (−90°, 90°) whose tangent is 1.', 'tan 45° = 1.'], answer: '45°' },
      { q: 'Find arcsin(−√2/2) in degrees.', steps: ['The reference angle is 45° because sin 45° = √2/2.', 'arcsin must return an angle in [−90°, 90°], and the value is negative.', '= −45°.'], answer: '−45°' },
      { q: 'A ramp rises 1 m over 8 m of run. Find its angle with the ground.', steps: ['tan θ = 1/8 = 0.125.', 'θ = arctan(0.125).', 'θ ≈ 7.1°.'], answer: '≈ 7.1°' },
      { q: 'Evaluate arccos(0) in degrees.', steps: ['We want the angle in [0°, 180°] whose cosine is 0.', 'cos 90° = 0.'], answer: '90°' },
    ],
    practice: [
      { q: 'Find arcsin(1/2) in degrees. (Number only.)', answers: ['30', '30°', '30 degrees'], steps: ['sin 30° = 1/2 and 30° is inside the range.', 'Answer: 30°.'] },
      { q: 'Find arccos(1/2) in degrees.', answers: ['60', '60°', '60 degrees'], steps: ['cos 60° = 1/2 and 60° is inside [0°, 180°].', 'Answer: 60°.'] },
      { q: 'Find arctan(1) in degrees.', answers: ['45', '45°', '45 degrees'], steps: ['tan 45° = 1.', 'Answer: 45°.'] },
      { q: 'Find arcsin(−1) in degrees.', answers: ['-90', '−90', '-90°', '−90°'], steps: ['sin(−90°) = −1.', '−90° is the endpoint of the arcsin range, so it is allowed.'] },
    ],
    watchOut: 'sin⁻¹x is the inverse function, NOT 1/sin x. And your calculator returns only one angle — the second angle in the full turn is yours to find by hand.',
  },

  // ---------------- TRIG Unit 11 — Fundamental identities ----------------
  {
    domain: 'TRIG', unit: 11, title: 'Fundamental identities',
    objective: 'Use the Pythagorean, reciprocal and quotient identities to simplify expressions and find missing values.',
    concept: [
      'The PYTHAGOREAN IDENTITY sin²θ + cos²θ = 1 is nothing more exotic than a² + b² = c² drawn on the unit circle, where c = 1.',
      'Divide that identity by cos²θ to get 1 + tan²θ = sec²θ, or by sin²θ to get 1 + cot²θ = csc²θ. Two more identities for no extra memorising.',
      'RECIPROCAL identities: csc θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.',
      'QUOTIENT identities: tan θ = sin θ/cos θ and cot θ = cos θ/sin θ. Rewriting everything in sines and cosines is the dependable opening move.',
      'PRO MOVE — when a simplification stalls, convert every function to sin and cos, put it over a common denominator, and hunt for sin²θ + cos²θ hiding in the numerator. That plod beats clever tricks far more often than anyone admits.',
    ],
    examples: [
      { q: 'Simplify sin²θ + cos²θ + 1.', steps: ['sin²θ + cos²θ = 1.', '1 + 1 = 2.'], answer: '2' },
      { q: 'If sin θ = 3/5 and θ is in QI, find cos θ.', steps: ['cos²θ = 1 − sin²θ = 1 − 9/25 = 16/25.', 'cos θ = ±4/5.', 'In QI cosine is positive: 4/5.'], answer: '4/5' },
      { q: 'Simplify tan θ · cos θ.', steps: ['Write tan θ as sin θ/cos θ.', '(sin θ/cos θ) · cos θ, and the cos θ cancels.', '= sin θ.'], answer: 'sin θ' },
      { q: 'Simplify (1 − cos²θ)/sin θ.', steps: ['1 − cos²θ = sin²θ.', 'sin²θ/sin θ.', '= sin θ.'], answer: 'sin θ' },
      { q: 'If sec θ = 2 and θ is in QI, find tan θ.', steps: ['cos θ = 1/2, so sin θ = √3/2 in QI.', 'tan θ = sin θ/cos θ = (√3/2) ÷ (1/2).', '= √3.'], answer: '√3' },
      { q: 'Simplify sin θ · csc θ.', steps: ['csc θ is 1/sin θ.', 'sin θ × 1/sin θ.', '= 1.'], answer: '1' },
    ],
    practice: [
      { q: 'Simplify sin²θ + cos²θ.', answers: ['1'], steps: ['This is the Pythagorean identity itself.', '= 1.'] },
      { q: 'Simplify cos θ · sec θ.', answers: ['1'], steps: ['sec θ = 1/cos θ.', 'The product is 1.'] },
      { q: 'If cos θ = 3/5 and θ is in QI, what is sin θ?', answers: ['4/5', '0.8', '.8'], steps: ['sin²θ = 1 − 9/25 = 16/25.', 'In QI sine is positive: 4/5.'] },
      { q: 'Simplify sin θ / cos θ.', answers: ['tan θ', 'tanθ', 'tan(θ)', 'tan theta', 'tan x', 'tan'], steps: ['This is the quotient identity.', '= tan θ.'] },
    ],
    watchOut: 'sin²θ means (sin θ)², never sin(θ²). And sin²θ + cos²θ = 1 holds only when BOTH functions carry the same angle — sin²A + cos²B is just a mess.',
  },

  // ---------------- TRIG Unit 12 — Sum, difference and double-angle formulas ----------------
  {
    domain: 'TRIG', unit: 12, title: 'Sum, difference and double-angle formulas',
    objective: 'Use sum, difference and double-angle formulas to build exact values and rewrite expressions.',
    concept: [
      'sin(A + B) = sin A cos B + cos A sin B, and sin(A − B) = sin A cos B − cos A sin B. Sine keeps whatever sign you were handed.',
      'cos(A + B) = cos A cos B − sin A sin B, and cos(A − B) = cos A cos B + sin A sin B. Cosine FLIPS the sign in the middle — the classic trap.',
      'Build unfamiliar exact values out of familiar ones: 75° = 45° + 30°, 15° = 45° − 30°, 105° = 60° + 45°.',
      'DOUBLE ANGLES: sin 2θ = 2 sin θ cos θ, and cos 2θ = cos²θ − sin²θ = 1 − 2sin²θ = 2cos²θ − 1. Choose whichever cosine version matches the piece you already know.',
      'PRO MOVE — check every exact value against a decimal. sin 75° should be roughly 0.966, so (√6 + √2)/4 landing on 0.966 confirms it. Anything above 1 is impossible and tells you a sign went the wrong way.',
    ],
    examples: [
      { q: 'Find sin 75° exactly.', steps: ['Write 75° as 45° + 30°.', 'sin 45° cos 30° + cos 45° sin 30° = (√2/2)(√3/2) + (√2/2)(1/2).', '= (√6 + √2)/4 ≈ 0.966.'], answer: '(√6 + √2)/4' },
      { q: 'Find cos 15° exactly.', steps: ['Write 15° as 45° − 30°.', 'cos 45° cos 30° + sin 45° sin 30° = (√2/2)(√3/2) + (√2/2)(1/2).', '= (√6 + √2)/4 ≈ 0.966.'], answer: '(√6 + √2)/4' },
      { q: 'If sin θ = 3/5 and θ is in QI, find sin 2θ.', steps: ['In QI, cos θ = 4/5.', 'sin 2θ = 2 sin θ cos θ = 2(3/5)(4/5).', '= 24/25.'], answer: '24/25' },
      { q: 'If cos θ = 3/5 and θ is in QI, find cos 2θ.', steps: ['Use cos 2θ = 2cos²θ − 1.', '2(9/25) − 1 = 18/25 − 25/25.', '= −7/25.'], answer: '−7/25' },
      { q: 'Simplify 2 sin 15° cos 15°.', steps: ['That matches sin 2θ = 2 sin θ cos θ with θ = 15°.', '= sin 30°.', '= 1/2.'], answer: '1/2' },
      { q: 'Find cos 75° exactly.', steps: ['Write 75° as 45° + 30°.', 'cos 45° cos 30° − sin 45° sin 30° = (√2/2)(√3/2) − (√2/2)(1/2).', '= (√6 − √2)/4 ≈ 0.259.'], answer: '(√6 − √2)/4' },
    ],
    practice: [
      { q: 'Simplify 2 sin 30° cos 30° and give the exact value.', answers: ['√3/2', 'sqrt3/2', 'sqrt(3)/2', 'root3/2'], steps: ['This is sin 2θ with θ = 30°, so it equals sin 60°.', 'sin 60° = √3/2.'] },
      { q: 'If sin θ = 4/5 and cos θ = 3/5, find sin 2θ. (Fraction or decimal.)', answers: ['24/25', '0.96', '.96'], steps: ['sin 2θ = 2 sin θ cos θ = 2(4/5)(3/5).', '= 24/25.'] },
      { q: 'Use cos 2θ = 1 − 2sin²θ. If sin θ = 1/2, what is cos 2θ?', answers: ['1/2', '0.5', '.5'], steps: ['sin²θ = 1/4.', '1 − 2(1/4) = 1 − 1/2 = 1/2.'] },
      { q: 'Simplify cos 40° cos 10° + sin 40° sin 10° and give its exact value.', answers: ['√3/2', 'sqrt3/2', 'sqrt(3)/2', 'root3/2'], steps: ['The plus sign means this is cos(A − B) with A = 40° and B = 10°.', '= cos 30° = √3/2.'] },
    ],
    watchOut: 'cos(A + B) is NOT cos A + cos B — and the cosine formula flips the sign in the middle: cos A cos B MINUS sin A sin B, even though the angles were added.',
  },

  // ---------------- TRIG Unit 13 — Solving trigonometric equations ----------------
  {
    domain: 'TRIG', unit: 13, title: 'Solving trigonometric equations',
    objective: 'Solve trigonometric equations on [0, 2π) and write general solutions.',
    concept: [
      'Isolate the trig function first, exactly as you would isolate x. Treat sin θ as a single object right up until the last step.',
      'Then ask where on the unit circle that value actually occurs — usually TWO places in one full turn, not one. Half of all lost marks live in this sentence.',
      'Get the reference angle from the inverse function, then place it in both quadrants where the sign fits.',
      'For the GENERAL SOLUTION, add 2πn to each answer for sine and cosine (period 2π), and πn for tangent (period π), where n is any integer.',
      'PRO MOVE — if the equation contains both sin θ and sin²θ, factor it like a quadratic and never divide by sin θ. Dividing quietly deletes every solution where sin θ = 0.',
    ],
    examples: [
      { q: 'Solve sin θ = 1/2 on [0, 2π).', steps: ['Reference angle is π/6.', 'Sine is positive in QI and QII.', 'θ = π/6 and 5π/6.'], answer: 'π/6, 5π/6' },
      { q: 'Solve 2 cos θ + 1 = 0 on [0, 2π).', steps: ['Isolate: cos θ = −1/2.', 'Reference angle π/3, cosine negative in QII and QIII.', 'θ = 2π/3 and 4π/3.'], answer: '2π/3, 4π/3' },
      { q: 'Solve tan θ = 1 on [0, 2π).', steps: ['Reference angle is π/4.', 'Tangent is positive in QI and QIII.', 'θ = π/4 and 5π/4.'], answer: 'π/4, 5π/4' },
      { q: 'Write the general solution of cos θ = 1.', steps: ['On one turn, cos θ = 1 only at θ = 0.', 'Cosine has period 2π, so add 2πn.', 'θ = 2πn for any integer n.'], answer: 'θ = 2πn' },
      { q: 'Solve sin²θ = sin θ on [0, 2π).', steps: ['Move everything over: sin²θ − sin θ = 0.', 'Factor: sin θ(sin θ − 1) = 0.', 'sin θ = 0 gives 0 and π; sin θ = 1 gives π/2.'], answer: '0, π/2, π' },
      { q: 'Solve 2 sin θ − √3 = 0 on [0, 2π).', steps: ['Isolate: sin θ = √3/2.', 'Reference angle π/3, sine positive in QI and QII.', 'θ = π/3 and 2π/3.'], answer: 'π/3, 2π/3' },
    ],
    practice: [
      { q: 'Solve sin θ = 0 on [0, 2π). List the solutions separated by a comma.', answers: ['0, π', '0, pi', '0,π', '0,pi'], steps: ['Sine is the y-coordinate, which is 0 on the x-axis.', 'That happens at θ = 0 and θ = π.'] },
      { q: 'Solve cos θ = 1 on [0, 2π).', answers: ['0'], steps: ['Cosine is the x-coordinate, and it reaches 1 only at the point (1, 0).', 'θ = 0.'] },
      { q: 'How many solutions does sin θ = 0.4 have on [0, 2π)?', answers: ['2', 'two'], steps: ['A positive sine happens in QI and QII.', 'That is 2 solutions in one full turn.'] },
      { q: 'Solve 2 sin θ = 1 for θ between 0° and 90°. Give the answer in degrees.', answers: ['30', '30°', '30 degrees'], steps: ['sin θ = 1/2.', 'In that range, θ = 30°.'] },
    ],
    watchOut: 'Never divide both sides by sin θ — you erase every solution where sin θ = 0. Factor instead, and count how many places on the circle carry your value before you stop.',
  },

  // ---------------- TRIG Unit 14 — Law of Sines and Law of Cosines ----------------
  {
    domain: 'TRIG', unit: 14, title: 'Law of Sines and Law of Cosines',
    objective: 'Solve oblique triangles with the Law of Sines and Law of Cosines, handle the ambiguous case, and find area.',
    concept: [
      'LAW OF SINES: a/sin A = b/sin B = c/sin C. Reach for it whenever you already have a matching side-and-angle PAIR (ASA, AAS or SSA).',
      'LAW OF COSINES: c² = a² + b² − 2ab cos C. Reach for it for SAS or SSS, when no pair exists. Set C = 90° and the last term vanishes, leaving a² + b² = c² — it is the Pythagorean theorem with a correction term.',
      'THE AMBIGUOUS CASE (SSA): the given side can swing into two different positions, so there may be 0, 1 or 2 triangles. Always test whether 180° minus your calculator angle also fits.',
      'AREA from two sides and the angle between them: Area = ½ab sin C. No height needed, which is why surveyors love it.',
      'PRO MOVE — the largest angle always sits opposite the longest side. Find that angle first with the Law of Cosines (a negative cosine tells you outright that it is obtuse), then finish with the Law of Sines and no ambiguity can bite you.',
    ],
    examples: [
      { q: 'In triangle ABC, A = 40°, B = 60° and a = 10. Find b.', steps: ['Law of Sines: b/sin B = a/sin A.', 'b = 10 sin 60° / sin 40° = 10(0.866)/(0.643).', 'b ≈ 13.5.'], answer: '≈ 13.5' },
      { q: 'In triangle ABC, a = 7, b = 9 and C = 50°. Find c.', steps: ['Law of Cosines: c² = 49 + 81 − 2(7)(9)cos 50°.', 'c² = 130 − 126(0.643) ≈ 49.0.', 'c ≈ 7.0.'], answer: '≈ 7.0' },
      { q: 'Find the area of a triangle with sides 8 and 11 and an included angle of 30°.', steps: ['Area = ½ab sin C = ½(8)(11)(sin 30°).', '= 44 × 0.5.', '= 22 square units.'], answer: '22' },
      { q: 'A triangle has sides a = 5, b = 6, c = 7. Find angle C.', steps: ['cos C = (a² + b² − c²)/(2ab) = (25 + 36 − 49)/60.', 'cos C = 12/60 = 0.2.', 'C = arccos(0.2) ≈ 78.5°.'], answer: '≈ 78.5°' },
      { q: 'A boat sails 30 km, turns so the interior angle at the turn is 120°, then sails 40 km. How far is it from the start?', steps: ['Law of Cosines: d² = 900 + 1600 − 2(30)(40)cos 120°.', 'cos 120° = −0.5, so d² = 2500 + 1200 = 3700.', 'd ≈ 60.8 km.'], answer: '≈ 60.8 km' },
      { q: 'A surveyor has A = 35°, a = 6 and b = 9. How many triangles are possible?', steps: ['sin B = b sin A / a = 9(0.574)/6 ≈ 0.860.', 'B ≈ 59.4°, but 180° − 59.4° = 120.6° also works.', 'Both leave room under 180° with A = 35°, so there are 2 triangles.'], answer: '2 triangles' },
    ],
    practice: [
      { q: 'In triangle ABC, A = 30°, a = 5 and B = 90°. Find b.', answers: ['10', 'b = 10', 'b=10'], steps: ['b = a sin B / sin A = 5(1)/0.5.', 'b = 10.'] },
      { q: 'Find the area of a triangle with sides 10 and 12 and an included angle of 30°.', answers: ['30', '30 square units'], steps: ['Area = ½(10)(12)sin 30° = 60 × 0.5.', '= 30.'] },
      { q: 'Use the Law of Cosines with a = 3, b = 4 and C = 90° to find c.', answers: ['5', 'c = 5', 'c=5'], steps: ['c² = 9 + 16 − 2(3)(4)cos 90°, and cos 90° = 0.', 'c² = 25, so c = 5.'] },
      { q: 'With a = 5, b = 8 and c = 7, find cos C. (Fraction or decimal.)', answers: ['1/2', '0.5', '.5'], steps: ['cos C = (25 + 64 − 49)/(2 × 5 × 8).', '= 40/80 = 1/2.'] },
    ],
    watchOut: 'In the ambiguous case, trusting only the angle your calculator prints can lose an entire second triangle — always check whether 180° minus that angle still fits inside the triangle.',
  },
];
