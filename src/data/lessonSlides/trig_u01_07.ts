import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, VIO, flow, funcGraph, rightTriangle, unitCircle } from '../slideArt';
import { sectorFig } from './geoArt';

// Trigonometry slide decks, units 1-7: angle measure, radians, right-triangle
// trig, special triangles, the unit circle, reference angles, and the sine and
// cosine waves.

/** Tick labels for graphs whose x-axis counts quarter turns (π/2 each). */
export const quarterTicks = (v: number) =>
  ({ '-4': '−2π', '-3': '−3π/2', '-2': '−π', '-1': '−π/2', 0: '0', 1: 'π/2', 2: 'π', 3: '3π/2', 4: '2π', 5: '5π/2', 6: '3π', 7: '7π/2', 8: '4π' } as Record<string, string>)[String(v)] ?? '';
/** sin and cos with x measured in quarter turns. */
export const qsin = (u: number) => Math.sin((u * Math.PI) / 2);
export const qcos = (u: number) => Math.cos((u * Math.PI) / 2);

export const TRIG_SLIDES_U01_07: SlideBank = {
  // ---------------- TRIG-1 — Angles and angle measure ----------------
  'TRIG-1': [
    {
      kind: 'objective',
      head: 'Angles that keep turning',
      body: 'In trigonometry an angle can turn past 180°, past 360°, and even backwards. 135° ends in Quadrant II. Today you will draw angles in standard position, name their quadrant, and find coterminal angles.',
      art: unitCircle(135, { label: '135°', caption: 'Start on the positive x-axis and turn counterclockwise.' }),
    },
    {
      kind: 'concept',
      head: 'Standard position',
      body: 'An angle in standard position starts on the positive x-axis (the initial side) and turns to the terminal side. Counterclockwise is positive; clockwise is negative.',
      why: 'Everyone has to start measuring from the same place and agree on a turning direction, or "135°" could mean different things to different people. The positive x-axis is the natural start, and counterclockwise is positive because it is the way the quadrants are already numbered. A negative angle simply turns the other way, like the hands of a clock.',
      art: unitCircle(-60, { label: '−60°', caption: 'A negative angle turns clockwise.' }),
    },
    {
      kind: 'concept',
      head: 'Quadrants',
      body: 'The axes split the plane into four quadrants, numbered counterclockwise from the upper right. The quadrant is wherever the terminal side lands.',
      why: 'The two axes cut the plane at 0°, 90°, 180° and 270°, so each quadrant is exactly one quarter turn wide. The quadrant number is just which block of 90° the angle falls in. For example 245° uses two whole quarter turns (180°) plus 65° more, so it lands in the third block.',
      table: { head: ['Quadrant', 'Angles between'], rows: [['I', '0° and 90°'], ['II', '90° and 180°'], ['III', '180° and 270°'], ['IV', '270° and 360°']] },
    },
    {
      kind: 'concept',
      head: 'Coterminal angles',
      body: 'Angles that end on the same terminal side are coterminal. Add or subtract full turns of 360° to find them.',
      why: 'A full turn is 360°, and after a full turn the terminal side is back exactly where it began. So adding or subtracting 360° any number of times cannot move the terminal side. For example 30°, 390° and −330° all point the same way, and each pair differs by a multiple of 360°.',
      formula: { tex: '\\theta \\pm 360^\\circ k', note: 'k is any whole number of full turns.', parts: [{ sym: '360^\\circ', means: 'one full turn', tone: 'accent' }, { sym: 'k', means: 'how many turns you add or remove', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Which quadrant is 245°?',
      body: 'You are given an angle and asked where its terminal side lands. How do you pick one of the four quadrants without drawing anything?',
      steps: { steps: [
        { tex: '0^\\circ < 245^\\circ < 360^\\circ', text: 'First check that the angle is already between 0° and 360°. It is, so no full turns need to be added or removed before you name the quadrant.' },
        { tex: '180^\\circ < 245^\\circ < 270^\\circ', text: 'Compare with the axis angles 90°, 180° and 270°. 245° is more than 180° but less than 270°, so it sits between the negative x-axis and the negative y-axis.' },
        { tex: '\\text{Quadrant III}', text: 'Quadrants are numbered counterclockwise: I is 0° to 90°, II is 90° to 180°, III is 180° to 270°. Our angle is in the third range, which points down and to the left.' },
      ], answer: '\\text{Quadrant III}' },
    },
    {
      kind: 'example',
      head: 'A positive coterminal angle for −60°',
      body: 'A negative angle turns clockwise. Which positive angle ends on the very same terminal side?',
      steps: { steps: [
        { tex: '\\theta + 360^\\circ k', text: 'Coterminal angles differ by whole turns. One full turn is 360°, and turning all the way around lands you on the same terminal side, so adding it changes nothing about where the angle points.' },
        { tex: '-60^\\circ + 360^\\circ', text: 'Add one full turn to −60°. We add, rather than subtract, because we want a larger, positive angle, and one turn is enough to cross zero.' },
        { tex: '-60 + 360 = 300', text: 'Do the arithmetic: 360 minus 60 is 300. The result is positive, so we can stop adding turns.' },
        { tex: '300^\\circ \\text{ is in Quadrant IV}', text: 'Check by picture: turning 60° clockwise lands just below the x-axis, and 300° is 60° short of a full turn, so both end in Quadrant IV.' },
      ], answer: '300^\\circ' },
    },
    {
      kind: 'example',
      head: 'A big angle: 780°',
      body: 'The angle 780° is more than two full turns. Where does its terminal side end, and in which quadrant? The plan is to take off full turns until the angle is between 0° and 360°.',
      steps: { steps: [
        { tex: '780 - 360 = 420', text: 'Remove one full turn of 360°. A full turn brings you back to the same spot, so taking one off does not move the terminal side.' },
        { tex: '420 - 360 = 60', text: '420° is still bigger than 360°, so take off another full turn. Now the angle is in the range 0° to 360° and we can stop subtracting.' },
        { tex: '780^\\circ \\text{ is coterminal with } 60^\\circ', text: '780° and 60° differ by exactly two full turns, which is 720°, so they end on the same terminal side.' },
        { tex: '0^\\circ < 60^\\circ < 90^\\circ', text: 'Name the quadrant using the reduced angle. 60° is between 0° and 90°, so the terminal side is in Quadrant I.' },
      ], answer: '60^\\circ,\\ \\text{Quadrant I}' },
      art: unitCircle(60, { label: '60°', caption: '780° is two full turns, then 60° more.' }),
    },
    {
      kind: 'example',
      head: 'Another way: divide by 360',
      body: 'Subtracting 360° again and again is slow for a big angle. Can one division do all the removing at once?',
      steps: { steps: [
        { tex: '780 \\div 360 \\approx 2.17', text: 'Divide the angle by 360 to count how many full turns fit inside it. The whole-number part, 2, says two complete turns fit in 780°.' },
        { tex: '2 \\times 360 = 720', text: 'Multiply the number of whole turns by 360 to see how many degrees those turns use up. Two turns use 720°.' },
        { tex: '780 - 720 = 60', text: 'Subtract that from the angle. What is left over is the part of a turn that is not complete, and that leftover decides where the terminal side points.' },
        { tex: '780 = 2(360) + 60', text: 'Write the result as turns plus remainder. The remainder 60° is between 0° and 360°, so it is the coterminal angle we wanted.' },
      ], answer: '60^\\circ' },
      formula: { tex: '780 = 2(360) + 60', note: 'The remainder is the angle that matters.', parts: [{ sym: '2(360)', means: 'two full turns', tone: 'accent' }, { sym: '60', means: 'where it actually ends', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Negative and big: −500°',
      body: 'This angle is negative and larger than one full turn. How many turns must you add to get a positive angle in range, and where does it end?',
      steps: { steps: [
        { tex: '-500 + 360 = -140', text: 'Add one full turn. Adding 360° does not move the terminal side, and we add because the angle is negative and we want to climb toward zero.' },
        { tex: '-140 + 360 = 220', text: '−140° is still negative, so add another full turn. Now the angle is positive and below 360°, which is the range we want.' },
        { tex: '-500 + 2(360) = 220', text: 'Check the total: two full turns is 720°, and −500 plus 720 is 220. So −500° and 220° end on the same side.' },
        { tex: '180^\\circ < 220^\\circ < 270^\\circ', text: 'Compare 220° with the axis angles. It is between 180° and 270°, which is the range for Quadrant III.' },
      ], answer: '220^\\circ,\\ \\text{Quadrant III}' },
      table: { head: ['Step', 'Angle'], rows: [['start', '−500°'], ['+ 360°', '−140°'], ['+ 360°', '220°']], mark: 2, note: '220° is in Quadrant III.' },
      formula: { tex: '-500 + 2(360) = 220', note: 'Two full turns bring it into range.', parts: [{ sym: '2(360)', means: 'two full counterclockwise turns', tone: 'accent' }, { sym: '220', means: 'the coterminal angle, Quadrant III', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a Ferris wheel',
      body: 'A Ferris wheel car starts at the 3 o\'clock position and turns 450° counterclockwise. Where does it stop? Sketch it first: how many full turns, and how much is left over?',
      steps: { steps: [
        { tex: '450 - 360 = 90', text: 'Take off one full turn. A full turn puts the car back at 3 o\'clock, so only the leftover 90° decides where it actually stops.' },
        { tex: '450^\\circ \\text{ is coterminal with } 90^\\circ', text: 'So 450° and 90° share a terminal side. Picture it: the car goes all the way around once, then keeps going a quarter of the way around the wheel.' },
        { tex: '90^\\circ \\text{ points straight up}', text: 'A quarter turn counterclockwise from the positive x-axis ends on the positive y-axis, which is the 12 o\'clock position at the top of the wheel.' },
      ], answer: '\\text{top of the wheel, at } 90^\\circ' },
      art: unitCircle(90, { label: '90°', point: 'top', caption: '450° is one full turn, then a quarter turn to the top.' }),
    },
    {
      kind: 'protip',
      head: 'Reduce first, then decide',
      body: 'Always bring the angle into 0° to 360° before naming its quadrant. Then compare with 90°, 180° and 270°.',
      art: flow([{ label: 'Add or subtract 360° until 0°–360°', color: SKY }, { label: 'Compare with 90°, 180°, 270°', color: AMB }, { label: 'Name the quadrant', color: EMR }], { title: 'Any angle, any size', horizontal: false, caption: 'Coterminal angles share a quadrant.' }),
    },
    {
      kind: 'trap',
      head: 'Negative angles turn clockwise',
      body: '−60° does not point into Quadrant II. It turns clockwise from the positive x-axis into Quadrant IV, the same as 300°.',
      compare: { cols: [{ title: 'Wrong turn', lines: ['Counterclockwise: Quadrant II'], tone: 'bad' }, { title: 'Right turn', lines: ['Clockwise: Quadrant IV'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: coterminal angles between −360° and 720°',
      body: 'List every angle coterminal with 100° that lies between −360° and 720°. The plan: keep adding or subtracting 360° while the result stays in the range.',
      steps: { steps: [
        { tex: '100 - 360 = -260', text: 'Subtract one full turn from 100°. The result −260° is at least −360°, so it is inside the allowed range and counts.' },
        { tex: '-260 - 360 = -620', text: 'Try going back once more. −620° is below −360°, so it is outside the range, and we stop going backward here.' },
        { tex: '100 + 360 = 460', text: 'Now add one full turn to 100°. The result 460° is below 720°, so it is allowed.' },
        { tex: '460 + 360 = 820', text: 'Add another full turn. 820° is above 720°, outside the range, so we stop going forward and the list is complete.' },
      ], answer: '-260^\\circ,\\ 100^\\circ,\\ 460^\\circ' },
    },
    {
      kind: 'summary',
      head: 'Angle measure, wrapped up',
      body: 'Standard position starts on the positive x-axis; counterclockwise is positive. The terminal side names the quadrant. Coterminal angles differ by full turns of 360°.',
      table: { head: ['Angle', 'Coterminal in 0°–360°', 'Quadrant'], rows: [['−60°', '300°', 'IV'], ['780°', '60°', 'I'], ['−500°', '220°', 'III']] },
    },
  ],

  // ---------------- TRIG-2 — Radians and arc length ----------------
  'TRIG-2': [
    {
      kind: 'objective',
      head: 'Measuring angles with the radius',
      body: 'One radian is the angle that sweeps an arc as long as the radius. Half a turn is π radians. Today you will switch between degrees and radians and use s = rθ and A = ½r²θ.',
      art: unitCircle(57.3, { label: '1 rad', caption: 'The arc is one radius long: about 57.3°.' }),
    },
    {
      kind: 'concept',
      head: '180° = π radians',
      body: 'A full turn is 2π radians, so half a turn is π. Use that as the bridge between the two units.',
      why: 'The circumference of a circle is 2πr, so going all the way around sweeps 2π radius-lengths of arc. A full turn is therefore 2π radians, and it is also 360°. Cutting both in half gives π radians = 180°, which is why this single fact can convert any angle.',
      formula: { tex: '180^\\circ = \\pi \\text{ rad}', note: 'Multiply by π/180 or 180/π.', parts: [{ sym: '\\times \\tfrac{\\pi}{180}', means: 'degrees to radians', tone: 'accent' }, { sym: '\\times \\tfrac{180}{\\pi}', means: 'radians to degrees', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Arc length: s = rθ',
      body: 'In radians, an arc is simply radius times angle. That is why mathematicians prefer radians: the formula has no 360 in it.',
      why: 'One radian is defined as the angle whose arc is exactly one radius long. So an angle of θ radians holds θ of those radius-length pieces, and the arc is r times θ. Check with a half turn: θ = π gives s = πr, which is exactly half of the circumference 2πr.',
      formula: { tex: 's = r\\theta', note: 'θ must be in radians.', parts: [{ sym: 'r', means: 'the radius', tone: 'accent' }, { sym: '\\theta', means: 'the angle in radians', tone: 'ok' }] },
      art: sectorFig(90, { arcLabel: 's = 5π/2', radius: 'r = 5', title: 'A quarter turn: θ = π/2', caption: 's = 5 × π/2 = 5π/2.' }),
    },
    {
      kind: 'concept',
      head: 'Sector area: A = ½r²θ',
      body: 'A sector is a slice of the circle. In radians its area is half of r² times θ.',
      why: 'A sector is a fraction of the whole circle, and that fraction is θ divided by 2π. The whole circle has area πr², so the sector has (θ/2π) × πr². The π cancels and leaves ½r²θ. Check: θ = 2π gives ½r²(2π) = πr², the full circle.',
      formula: { tex: 'A = \\tfrac{1}{2}r^2\\theta', note: 'Also needs θ in radians.', parts: [{ sym: 'r^2', means: 'the radius squared', tone: 'accent' }, { sym: '\\tfrac{1}{2}\\theta', means: 'the fraction of the circle, in radians', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Degrees to radians: 135°',
      body: 'Convert 135° to radians. The bridge is 180° = π radians, so the plan is to multiply by a fraction that equals 1.',
      steps: { steps: [
        { tex: '180^\\circ = \\pi\\ \\text{rad}', text: 'Start from the fact that half a turn is 180° and also π radians. This lets you build the conversion fraction π/180, which equals 1, so multiplying by it changes the unit but not the angle.' },
        { tex: '135 \\times \\tfrac{\\pi}{180} = \\tfrac{135\\pi}{180}', text: 'Multiply 135 by π/180. We put 180 on the bottom so the degree units cancel, which leaves the answer in radians.' },
        { tex: '\\tfrac{135\\pi}{180} = \\tfrac{3\\pi}{4}', text: 'Simplify by dividing top and bottom by 45, the biggest number that goes into both, since 135 = 3 × 45 and 180 = 4 × 45. Dividing both by the same number keeps the fraction equal.' },
      ], answer: '\\tfrac{3\\pi}{4}' },
    },
    {
      kind: 'example',
      head: 'Radians to degrees: 5π/6',
      body: 'Convert 5π/6 radians to degrees. Use the same bridge, flipped so that the π cancels.',
      steps: { steps: [
        { tex: '\\tfrac{5\\pi}{6} \\times \\tfrac{180^\\circ}{\\pi}', text: 'Multiply by 180°/π. This fraction equals 1, and putting π on the bottom lets the π in the angle cancel, which leaves degrees.' },
        { tex: '\\tfrac{5 \\times 180^\\circ}{6}', text: 'Cancel the π on top and bottom. What remains is 5 times 180° divided by 6.' },
        { tex: '\\tfrac{180}{6} = 30,\\quad 5 \\times 30 = 150', text: 'Divide first, because 180 splits evenly by 6 and that keeps the numbers small. Then multiply by 5 to finish.' },
      ], answer: '150^\\circ' },
    },
    {
      kind: 'example',
      head: 'Arc length: r = 8, θ = 2.5',
      body: 'A circle has radius 8 and the angle is 2.5 radians. How long is the arc? The angle is already in radians, so s = rθ applies straight away.',
      steps: { steps: [
        { tex: 's = r\\theta', text: 'Use the arc length formula. It works only when θ is in radians, and 2.5 has no degree sign, so it already is.' },
        { tex: 's = 8 \\times 2.5', text: 'Substitute r = 8 and θ = 2.5. The formula says the arc is the radius repeated θ times, because one radian is an arc exactly one radius long.' },
        { tex: '8 \\times 2.5 = 20', text: 'Multiply: 8 times 2 is 16 and 8 times 0.5 is 4, and 16 + 4 = 20. Radians carry no unit of their own, so the answer is in the same unit as the radius.' },
      ], answer: 's = 20' },
      formula: { tex: 's = 8 \\times 2.5 = 20', note: 'No conversion needed.', parts: [{ sym: '8', means: 'the radius', tone: 'accent' }, { sym: '2.5', means: 'the angle in radians', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: think in fractions of π',
      body: 'Instead of multiplying by π/180, can you convert 135° by seeing it as a multiple of an angle you already know?',
      steps: { steps: [
        { tex: '45^\\circ = \\tfrac{\\pi}{4}', text: 'Remember the anchor angles. 45° is one eighth of a full turn, and one eighth of 2π is π/4, so 45° = π/4.' },
        { tex: '135 = 3 \\times 45', text: 'Write 135° as a multiple of 45°. Three times 45 is 135, so 135° is exactly three of those 45° pieces.' },
        { tex: '3 \\times \\tfrac{\\pi}{4} = \\tfrac{3\\pi}{4}', text: 'If one piece is π/4 radians, three equal pieces are three times that. Multiplying the radian size by 3 matches multiplying the degrees by 3.' },
      ], answer: '\\tfrac{3\\pi}{4}' },
      table: { head: ['Degrees', 'Radians'], rows: [['30°', 'π/6'], ['45°', 'π/4'], ['60°', 'π/3'], ['90°', 'π/2'], ['135°', '3π/4']], mark: 4 },
    },
    {
      kind: 'example',
      head: 'Sector area: r = 6, θ = π/3',
      body: 'A sector has radius 6 and angle π/3. Find its area, then check it a second way.',
      steps: { steps: [
        { tex: 'A = \\tfrac12 r^2 \\theta', text: 'Use the sector area formula, which needs θ in radians. π/3 is already in radians, so we can put it in directly.' },
        { tex: 'A = \\tfrac12 \\cdot 36 \\cdot \\tfrac{\\pi}{3}', text: 'Substitute r = 6 and θ = π/3. Square the radius first: 6² is 36, because squaring means 6 times 6, not 6 times 2.' },
        { tex: 'A = 18 \\cdot \\tfrac{\\pi}{3} = 6\\pi \\approx 18.85', text: 'Half of 36 is 18, and 18 divided by 3 is 6, so A = 6π. Multiplying by 3.1416 gives about 18.85.' },
        { tex: '\\tfrac{\\pi/3}{2\\pi} = \\tfrac16,\\quad \\tfrac16 \\cdot 36\\pi = 6\\pi', text: 'Check: the angle π/3 is one sixth of a full turn 2π, so the sector should be one sixth of the whole circle area πr² = 36π. One sixth of 36π is also 6π.' },
      ], answer: 'A = 6\\pi \\approx 18.85' },
      art: sectorFig(60, { arcLabel: 'area 6π', radius: 'r = 6', title: 'θ = π/3 is 1/6 of the circle', caption: '½ · 36 · π/3 = 6π.' }),
    },
    {
      kind: 'example',
      head: 'Picture it first: a bicycle wheel',
      body: 'A wheel of radius 0.35 m turns through 10 radians. How far does the bike roll? Picture the tire peeling off onto the road like a ribbon.',
      steps: { steps: [
        { tex: '\\text{distance rolled} = \\text{arc length}', text: 'Picture the tire unrolling onto the ground. The length of road it covers equals the length of tire that touched it, which is the arc length.' },
        { tex: 's = r\\theta', text: 'Use s = rθ. The 10 is given in radians, so there is no conversion to do first.' },
        { tex: 's = 0.35 \\times 10', text: 'Substitute r = 0.35 m and θ = 10. Multiplying by 10 just moves the decimal point one place to the right.' },
        { tex: 's = 3.5\\ \\text{m}', text: 'The result is 3.5. The radius was in meters, so the arc length is in meters, because radians carry no unit of their own.' },
      ], answer: 's = 3.5\\ \\text{m}' },
      formula: { tex: 's = 0.35 \\times 10 = 3.5 \\text{ m}', note: 'Distance rolled is the arc length.', parts: [{ sym: '0.35', means: 'the wheel radius in meters', tone: 'accent' }, { sym: '10', means: 'radians turned', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Units cancel the right way',
      body: 'Write the conversion as a fraction and make the old unit cancel. Degrees on the bottom to get rid of degrees; π on the bottom to get rid of radians.',
      art: flow([{ label: 'Degrees → radians: × π/180', color: SKY }, { label: 'Radians → degrees: × 180/π', color: AMB }, { label: 'The old unit cancels', color: EMR }], { title: 'Which fraction?', horizontal: false, caption: 'If the old unit does not cancel, flip the fraction.' }),
    },
    {
      kind: 'trap',
      head: 's = rθ needs radians',
      body: 'Using degrees in s = rθ gives a wildly wrong answer. A 60° arc on radius 9 is 3π ≈ 9.4, not 540.',
      compare: { cols: [{ title: 'Degrees plugged in', tex: '9 \\times 60 = 540', lines: ['Nonsense'], tone: 'bad' }, { title: 'Radians plugged in', tex: '9 \\times \\tfrac{\\pi}{3} = 3\\pi', lines: ['About 9.4'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: find the angle from the arc',
      body: 'An arc of length 12 sits on a circle of radius 4. Find the angle in radians, then in degrees. The plan: rearrange s = rθ to solve for θ.',
      steps: { steps: [
        { tex: 's = r\\theta', text: 'Start with the arc length formula, which links the arc, the radius and the angle in radians. We know s and r, so θ is the unknown.' },
        { tex: '\\theta = \\tfrac{s}{r}', text: 'Divide both sides by r to get θ alone. Dividing both sides by the same nonzero number keeps the equation balanced.' },
        { tex: '\\theta = \\tfrac{12}{4} = 3\\ \\text{rad}', text: 'Substitute s = 12 and r = 4. The angle is 3 radians, which is a bit less than half a turn, since π is about 3.14.' },
        { tex: '3 \\times \\tfrac{180}{\\pi} \\approx 171.9^\\circ', text: 'To get degrees, multiply by 180/π so the radian unit cancels. 540 divided by 3.14159 is about 171.9, a bit under 180°, matching the check above.' },
      ], answer: '\\theta = 3 \\text{ rad} \\approx 171.9^\\circ' },
    },
    {
      kind: 'summary',
      head: 'Radians, wrapped up',
      body: 'π radians = 180°. Multiply by π/180 to get radians, 180/π to get degrees. With θ in radians, arc length is rθ and sector area is ½r²θ.',
      table: { head: ['Formula', 'Gives'], rows: [['× π/180', 'radians'], ['s = rθ', 'arc length'], ['A = ½r²θ', 'sector area']] },
    },
  ],

  // ---------------- TRIG-3 — Right-triangle trigonometry ----------------
  'TRIG-3': [
    {
      kind: 'objective',
      head: 'Three ratios, any triangle',
      body: 'With one angle and one side of a right triangle, you can find every other side. Today you will use SOH-CAH-TOA, inverse trig, and angles of elevation and depression.',
      art: rightTriangle({ opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse', angle: 'θ', title: 'Names come from θ', caption: 'Opposite faces θ; adjacent touches it.' }),
    },
    {
      kind: 'concept',
      head: 'SOH-CAH-TOA',
      body: 'Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, and tangent is opposite over adjacent.',
      why: 'Every right triangle with the same acute angle is just a bigger or smaller copy of the same shape, so the ratios of its sides never change. That is why sine, cosine and tangent depend only on the angle. For example a 30° angle always gives opposite over hypotenuse equal to 1/2, whether the triangle is 1 cm or 1 km long.',
      formula: { tex: '\\sin\\theta = \\tfrac{\\text{opp}}{\\text{hyp}},\\ \\cos\\theta = \\tfrac{\\text{adj}}{\\text{hyp}},\\ \\tan\\theta = \\tfrac{\\text{opp}}{\\text{adj}}', note: 'SOH, CAH, TOA.', parts: [{ sym: '\\text{opp}', means: 'the side across from θ', tone: 'accent' }, { sym: '\\text{hyp}', means: 'the longest side', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Pick the ratio from what you have',
      body: 'Circle the side you know and the side you want. The ratio that uses exactly those two is the one to use.',
      why: 'Each ratio is a fraction made from exactly two sides, so it can only help when those two sides are the ones you know and want. If the hypotenuse is not involved, for instance, only tangent can work, because sine and cosine both need the hypotenuse. Listing the known and wanted sides picks the ratio for you.',
      table: { head: ['Known & wanted', 'Ratio'], rows: [['opp & hyp', 'sin'], ['adj & hyp', 'cos'], ['opp & adj', 'tan']] },
    },
    {
      kind: 'concept',
      head: 'Inverse trig gives the angle',
      body: 'When two sides are known, the inverse function returns the angle. sin⁻¹, cos⁻¹ and tan⁻¹ undo the ratios.',
      why: 'Sine takes an angle and gives a ratio. To go backwards, from a ratio to an angle, you need the function that undoes it, just as division undoes multiplication. For acute angles each ratio comes from exactly one angle, so the inverse gives one clear answer. Check: sin 30° = 0.5, and sin⁻¹(0.5) = 30°.',
      formula: { tex: '\\theta = \\sin^{-1}\\!\\left(\\tfrac{\\text{opp}}{\\text{hyp}}\\right)', note: 'The angle whose sine is this ratio.', parts: [{ sym: '\\sin^{-1}', means: 'undoes sine', tone: 'accent' }, { sym: '\\theta', means: 'the angle', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Find the hypotenuse: 40°, opposite 12',
      body: 'A right triangle has a 40° angle, and the side opposite it is 12. Find the hypotenuse h. Which ratio uses the opposite side and the hypotenuse?',
      steps: { steps: [
        { tex: '\\text{opp} = 12,\\ \\text{hyp} = h', text: 'Label the sides from the 40° angle. The side across from it is the opposite (12), and the longest side, across from the right angle, is the hypotenuse h.' },
        { tex: '\\sin 40^\\circ = \\tfrac{12}{h}', text: 'Opposite and hypotenuse go together in sine (SOH), so write sine equals opposite over hypotenuse. It is the only ratio that uses exactly those two sides.' },
        { tex: 'h = \\tfrac{12}{\\sin 40^\\circ}', text: 'Solve for h. Multiply both sides by h, then divide both sides by sin 40°, which leaves h alone on one side.' },
        { tex: 'h \\approx \\tfrac{12}{0.6428} \\approx 18.7', text: 'Use a calculator in degree mode: sin 40° is about 0.6428. Dividing 12 by it gives about 18.7, which is longer than 12, as a hypotenuse must be.' },
      ], answer: 'h \\approx 18.7' },
    },
    {
      kind: 'example',
      head: 'Find the angle: adjacent 7, hypotenuse 10',
      body: 'Two sides are known and the angle is unknown: the adjacent side is 7 and the hypotenuse is 10. Which ratio fits, and how do you get the angle out of it?',
      steps: { steps: [
        { tex: '\\cos\\theta = \\tfrac{7}{10}', text: 'Pick the ratio. Adjacent and hypotenuse are the two sides we know, and cosine is adjacent over hypotenuse (CAH), so cosine is the one to use.' },
        { tex: '\\cos\\theta = 0.7', text: 'Divide 7 by 10 to turn the fraction into a decimal. A cosine of an acute angle is between 0 and 1, so 0.7 is a sensible value.' },
        { tex: '\\theta = \\cos^{-1}(0.7)', text: 'Apply the inverse cosine to both sides. cos⁻¹ undoes cosine, so it returns the angle whose cosine is 0.7 instead of the ratio.' },
        { tex: '\\theta \\approx 45.6^\\circ', text: 'Enter cos⁻¹(0.7) in degree mode. It gives about 45.57°, which rounds to 45.6°. This fits, since cos 45° is about 0.71.' },
      ], answer: '\\theta \\approx 45.6^\\circ' },
    },
    {
      kind: 'example',
      head: 'Elevation: a kite string',
      body: 'A 100 m kite string makes a 35° angle with the ground. How high is the kite? The string is the hypotenuse and the height is opposite the 35° angle.',
      steps: { steps: [
        { tex: '\\text{hyp} = 100,\\ \\text{opp} = h', text: 'Name the sides from the 35° angle at the ground. The string is the longest side, the hypotenuse, and the height is across from the angle, so it is the opposite.' },
        { tex: '\\sin 35^\\circ = \\tfrac{h}{100}', text: 'We know the hypotenuse and want the opposite, so use sine (SOH). Write sine equals opposite over hypotenuse.' },
        { tex: 'h = 100 \\sin 35^\\circ', text: 'Multiply both sides by 100 to get h alone. The unknown is on top here, so no division is needed at the end.' },
        { tex: 'h \\approx 100 \\times 0.5736 \\approx 57.4\\ \\text{m}', text: 'sin 35° is about 0.5736 on a calculator in degree mode. Times 100 gives 57.4 m, which is less than the 100 m string, as it should be.' },
      ], answer: 'h \\approx 57.4\\ \\text{m}' },
      art: rightTriangle({ opp: 'height ?', hyp: '100 m', angle: '35°', shape: { opp: 2.8, adj: 4 }, title: 'The string is the hypotenuse', caption: 'Opposite and hypotenuse: sine.' }),
    },
    {
      kind: 'example',
      head: 'Another way: Pythagoras for the last side',
      body: 'You found the hypotenuse 18.7 from an opposite side of 12. The adjacent side is still unknown. Do you need trig again?',
      steps: { steps: [
        { tex: 'a^2 + b^2 = c^2', text: 'Two sides of a right triangle are known, so the Pythagorean theorem applies. Trig is only needed when one of the known pieces is an angle.' },
        { tex: '12^2 + a^2 = 18.7^2', text: 'Put the hypotenuse 18.7 in as c and the opposite side 12 as one leg. The hypotenuse always sits alone on its own side of the equation.' },
        { tex: 'a^2 = 349.69 - 144 = 205.69', text: 'Square each number, since 18.7² is 349.69 and 12² is 144, and subtract 144 from both sides to isolate a².' },
        { tex: 'a = \\sqrt{205.69} \\approx 14.3', text: 'Take the square root to undo the squaring. We keep only the positive root because a length cannot be negative.' },
      ], answer: 'a \\approx 14.3' },
      formula: { tex: 'a = \\sqrt{18.7^2 - 12^2} \\approx 14.3', note: 'Pythagoras finishes the triangle.', parts: [{ sym: '18.7', means: 'the hypotenuse found with trig', tone: 'accent' }, { sym: '12', means: 'the known opposite side', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: angle of depression',
      body: 'A lighthouse keeper 30 m up sees a boat at 12° below horizontal. How far is the boat from the base of the lighthouse? Sketch it first, then find the angle inside the triangle.',
      steps: { steps: [
        { tex: '\\text{angle at the boat} = 12^\\circ', text: 'The horizontal line from the keeper is parallel to the sea. So the angle of depression and the angle at the boat are alternate interior angles, and they are equal.' },
        { tex: '\\tan 12^\\circ = \\tfrac{30}{d}', text: 'The height 30 is opposite the 12° angle and the distance d is adjacent, so use tangent, opposite over adjacent (TOA).' },
        { tex: 'd = \\tfrac{30}{\\tan 12^\\circ}', text: 'Solve for d by multiplying both sides by d and dividing both sides by tan 12°. The unknown was on the bottom, so it ends up as a division.' },
        { tex: 'd \\approx \\tfrac{30}{0.2126} \\approx 141\\ \\text{m}', text: 'tan 12° is about 0.2126 in degree mode. Dividing 30 by this small number gives a big distance, about 141 m, which makes sense for such a shallow angle.' },
      ], answer: 'd \\approx 141\\ \\text{m}' },
      art: rightTriangle({ opp: '30 m', adj: 'distance ?', angle: '12°', shape: { opp: 1.4, adj: 6 }, title: 'Depression angle = elevation angle', caption: 'Alternate interior angles are equal.' }),
    },
    {
      kind: 'example',
      head: 'Tangent: a ramp',
      body: 'A ramp rises 1.2 m over 10 m of flat ground. What angle does it make with the ground? The rise and the run are the opposite and adjacent sides.',
      steps: { steps: [
        { tex: '\\text{opp} = 1.2,\\ \\text{adj} = 10', text: 'Name the sides from the angle at the bottom of the ramp. The rise is across from it (opposite) and the ground distance touches it (adjacent).' },
        { tex: '\\tan\\theta = \\tfrac{1.2}{10} = 0.12', text: 'Opposite and adjacent go together in tangent (TOA). Divide 1.2 by 10 to get 0.12, which is the slope of the ramp.' },
        { tex: '\\theta = \\tan^{-1}(0.12)', text: 'We want the angle, not the ratio, so apply the inverse tangent to both sides. It undoes tangent.' },
        { tex: '\\theta \\approx 6.8^\\circ', text: 'On a calculator in degree mode, tan⁻¹(0.12) is about 6.84°. A gentle slope should give a small angle, so 6.8° is sensible.' },
      ], answer: '\\theta \\approx 6.8^\\circ' },
      table: { head: ['Step', 'Value'], rows: [['tan θ = rise ÷ run', '1.2 ÷ 10 = 0.12'], ['θ = tan⁻¹(0.12)', '≈ 6.8°']], mark: 1, note: 'Opposite over adjacent is the slope.' },
    },
    {
      kind: 'protip',
      head: 'Degree mode check',
      body: 'Before you start, check sin 30 = 0.5 on your calculator. If not, switch to degree mode — radian mode gives wrong answers with no warning.',
      formula: { tex: '\\sin 30^\\circ = 0.5', note: 'A two-second calculator check.', parts: [{ sym: '30^\\circ', means: 'a known angle', tone: 'accent' }, { sym: '0.5', means: 'the value you should see', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Opposite depends on the angle',
      body: '"Opposite" means across from the angle you are using. Switch to the other acute angle and opposite and adjacent swap places.',
      compare: { cols: [{ title: 'From angle A', lines: ['Opposite = side a'], tone: 'accent' }, { title: 'From angle B', lines: ['Side a is now adjacent'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: two observers',
      body: 'A tower is seen at 40° elevation from 50 m away. How tall is it? Then what is the elevation angle from 80 m away? The tower does not change, so find its height first.',
      steps: { steps: [
        { tex: '\\tan 40^\\circ = \\tfrac{h}{50}', text: 'The height is opposite the 40° angle and the 50 m distance is adjacent, so tangent is the right ratio (TOA).' },
        { tex: 'h = 50\\tan 40^\\circ \\approx 50 \\times 0.8391 \\approx 42.0\\ \\text{m}', text: 'Multiply both sides by 50 to isolate h. tan 40° is about 0.8391, so the tower is about 42.0 m tall.' },
        { tex: '\\tan\\theta = \\tfrac{42.0}{80} = 0.525', text: 'From 80 m away, the tower height is still the opposite side, since the tower did not change, but the adjacent side is now 80. Divide to get the tangent.' },
        { tex: '\\theta = \\tan^{-1}(0.525) \\approx 27.7^\\circ', text: 'Apply the inverse tangent to get the angle. It is smaller than 40°, which makes sense because standing farther away means looking up less steeply.' },
      ], answer: '\\text{height} \\approx 42.0\\ \\text{m},\\ \\theta \\approx 27.7^\\circ' },
    },
    {
      kind: 'summary',
      head: 'Right-triangle trig, wrapped up',
      body: 'Name the sides from the angle, pick the ratio that links known and wanted, and use inverse trig to find an angle. Depression and elevation angles are equal.',
      table: { head: ['Ratio', 'Sides'], rows: [['sin', 'opp/hyp'], ['cos', 'adj/hyp'], ['tan', 'opp/adj']] },
    },
  ],

  // ---------------- TRIG-4 — Special right triangles ----------------
  'TRIG-4': [
    {
      kind: 'objective',
      head: 'Exact values without a calculator',
      body: 'sin 30° is exactly 1/2 and cos 45° is exactly √2/2. Those come from two special triangles. Today you will use the 45-45-90 and 30-60-90 triangles to write exact values.',
      art: rightTriangle({ opp: '1', adj: '√3', hyp: '2', angle: '30°', shape: { opp: 1, adj: 1.732 }, title: 'The 30-60-90 triangle', caption: 'sin 30° = 1/2 straight from the sides.' }),
    },
    {
      kind: 'concept',
      head: 'The 45-45-90 triangle',
      body: 'Cut a square along its diagonal. The two legs are equal, and the hypotenuse is leg × √2.',
      why: 'Take a square with side 1 and cut along a diagonal. You get two identical right triangles with two equal legs of 1 and two equal 45° angles. The Pythagorean theorem gives the diagonal as √(1² + 1²) = √2, so the sides are always in the ratio 1 : 1 : √2.',
      formula: { tex: '1 : 1 : \\sqrt{2}', note: 'Leg, leg, hypotenuse.', parts: [{ sym: '1 : 1', means: 'two equal legs', tone: 'accent' }, { sym: '\\sqrt{2}', means: 'the hypotenuse', tone: 'ok' }] },
      art: rightTriangle({ opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 1, adj: 1 }, title: 'Half a square', caption: 'sin 45° = cos 45° = 1/√2 = √2/2.' }),
    },
    {
      kind: 'concept',
      head: 'The 30-60-90 triangle',
      body: 'Cut an equilateral triangle in half. The short leg is 1, the hypotenuse is 2, and the long leg is √3.',
      why: 'Take an equilateral triangle with side 2 and draw a straight line from the top corner to the middle of the base. It splits into two 30-60-90 triangles with hypotenuse 2 and short leg 1, half the base. The Pythagorean theorem gives the long leg as √(4 − 1) = √3.',
      formula: { tex: '1 : \\sqrt{3} : 2', note: 'Short leg, long leg, hypotenuse.', parts: [{ sym: '1', means: 'across from 30°', tone: 'accent' }, { sym: '\\sqrt{3}', means: 'across from 60°', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The exact-value table',
      body: 'Read SOH-CAH-TOA straight off the two triangles. Notice that the sines climb 1/2, √2/2, √3/2 while the cosines fall.',
      why: 'Each entry is just a ratio of sides, read from the triangles 1 : 1 : √2 and 1 : √3 : 2. For example in the 45° triangle sin 45° = 1/√2, which is rewritten as √2/2. Sine climbs as the angle grows because the opposite side gets longer, while cosine falls because the adjacent side gets shorter.',
      table: { head: ['θ', 'sin θ', 'cos θ', 'tan θ'], rows: [['30°', '1/2', '√3/2', '√3/3'], ['45°', '√2/2', '√2/2', '1'], ['60°', '√3/2', '1/2', '√3']] },
    },
    {
      kind: 'example',
      head: 'Exact value of sin 60°',
      body: 'Find sin 60° exactly, with no calculator. Which triangle has a 60° angle and nice side lengths?',
      steps: { steps: [
        { tex: '1 : \\sqrt3 : 2', text: 'Use the 30-60-90 triangle, made by cutting an equilateral triangle of side 2 in half. Its sides are 1, √3 and 2, with the short leg across from 30°.' },
        { tex: '\\text{opp} = \\sqrt3,\\ \\text{hyp} = 2', text: 'Stand at the 60° corner. The side across from it is the long leg √3, because the bigger acute angle faces the longer leg, and the hypotenuse is 2.' },
        { tex: '\\sin 60^\\circ = \\tfrac{\\text{opp}}{\\text{hyp}}', text: 'Write sine as opposite over hypotenuse (SOH). This is the definition of sine in a right triangle.' },
        { tex: '\\sin 60^\\circ = \\tfrac{\\sqrt3}{2}', text: 'Substitute the sides. The answer stays exact as a fraction with a square root, and it is about 0.866, which a calculator confirms.' },
      ], answer: '\\tfrac{\\sqrt{3}}{2}' },
    },
    {
      kind: 'example',
      head: 'A 45-45-90 with hypotenuse 10',
      body: 'A 45-45-90 triangle has hypotenuse 10. How long is each leg? The pattern 1 : 1 : √2 says the hypotenuse is a leg times √2.',
      steps: { steps: [
        { tex: '\\text{hyp} = \\text{leg} \\times \\sqrt2', text: 'In a 45-45-90 triangle the legs are equal, and the hypotenuse is a leg times √2, because the diagonal of a square is its side times √2.' },
        { tex: '10 = \\text{leg} \\times \\sqrt2', text: 'Put in the hypotenuse 10. Now the leg is the only unknown, and it is multiplied by √2.' },
        { tex: '\\text{leg} = \\tfrac{10}{\\sqrt2}', text: 'Divide both sides by √2 to undo the multiplication and get the leg alone.' },
        { tex: '\\tfrac{10}{\\sqrt2} \\cdot \\tfrac{\\sqrt2}{\\sqrt2} = \\tfrac{10\\sqrt2}{2}', text: 'Rationalize by multiplying top and bottom by √2. This is multiplying by 1, so the value is unchanged, but the root leaves the denominator.' },
        { tex: '\\tfrac{10\\sqrt2}{2} = 5\\sqrt2 \\approx 7.07', text: 'Divide 10 by 2 to simplify. Check: 5 times 1.414 is about 7.07, and 7.07 times √2 is about 10.' },
      ], answer: '5\\sqrt{2}' },
    },
    {
      kind: 'example',
      head: 'A 30-60-90 with long leg 9',
      body: 'A 30-60-90 triangle has a long leg of 9. Find the short leg and the hypotenuse. In the pattern 1 : √3 : 2, the long leg is √3 times the short leg.',
      steps: { steps: [
        { tex: 'x : x\\sqrt3 : 2x', text: 'Call the short leg x. Every 30-60-90 triangle is a scaled copy of 1 : √3 : 2, so its sides are x, x√3 and 2x.' },
        { tex: 'x\\sqrt3 = 9', text: 'The long leg is given as 9, so set it equal to x√3. This equation has only x unknown.' },
        { tex: 'x = \\tfrac{9}{\\sqrt3} = \\tfrac{9\\sqrt3}{3} = 3\\sqrt3', text: 'Divide by √3, then multiply top and bottom by √3 to remove the root from the denominator. Finally 9 divided by 3 is 3.' },
        { tex: '2x = 2 \\cdot 3\\sqrt3 = 6\\sqrt3', text: 'The hypotenuse is twice the short leg in this triangle, so double 3√3 to get 6√3, which is about 10.4.' },
      ], answer: '\\text{short leg } 3\\sqrt3,\\ \\text{hypotenuse } 6\\sqrt3' },
      art: rightTriangle({ opp: '3√3', adj: '9', hyp: '6√3', angle: '30°', shape: { opp: 1, adj: 1.732 }, title: 'Scale the 1 : √3 : 2 pattern', caption: 'Short leg 3√3, hypotenuse 6√3.' }),
    },
    {
      kind: 'example',
      head: 'Another way: the hand trick',
      body: 'Is there a way to rebuild the sine values without drawing triangles? Look for a pattern in the numbers under the square root.',
      steps: { steps: [
        { tex: '0^\\circ,\\ 30^\\circ,\\ 45^\\circ,\\ 60^\\circ,\\ 90^\\circ', text: 'Write the five common angles in order. They climb from 0° to 90°, so their sines climb from 0 to 1.' },
        { tex: '\\tfrac{\\sqrt0}{2},\\ \\tfrac{\\sqrt1}{2},\\ \\tfrac{\\sqrt2}{2},\\ \\tfrac{\\sqrt3}{2},\\ \\tfrac{\\sqrt4}{2}', text: 'Put the counting numbers 0, 1, 2, 3, 4 under square roots, all over 2, one for each angle in order. It is just a counting pattern.' },
        { tex: '\\tfrac{\\sqrt0}{2} = 0,\\quad \\tfrac{\\sqrt1}{2} = \\tfrac12,\\quad \\tfrac{\\sqrt4}{2} = 1', text: 'Simplify the roots that are perfect squares. These match the known values sin 0° = 0, sin 30° = 1/2 and sin 90° = 1, so the pattern can be trusted.' },
        { tex: '\\cos\\theta = \\sin(90^\\circ - \\theta)', text: 'Get cosine by reading the same list backward. The cosine of an angle equals the sine of its complement, so cos 60° = sin 30° = 1/2.' },
      ], answer: '0,\\ \\tfrac12,\\ \\tfrac{\\sqrt2}{2},\\ \\tfrac{\\sqrt3}{2},\\ 1' },
      table: { head: ['θ', 'sin θ'], rows: [['0°', '√0/2 = 0'], ['30°', '√1/2 = 1/2'], ['45°', '√2/2'], ['60°', '√3/2'], ['90°', '√4/2 = 1']], note: 'Cosine is the same column read upward.' },
    },
    {
      kind: 'example',
      head: 'tan 30° exactly',
      body: 'Find tan 30° exactly. Which sides of the 30-60-90 triangle are opposite and adjacent to the 30° angle?',
      steps: { steps: [
        { tex: '1 : \\sqrt3 : 2', text: 'Start with the 30-60-90 triangle. Its sides are 1, √3 and 2, with the shortest side across from the smallest angle, 30°.' },
        { tex: '\\text{opp} = 1,\\ \\text{adj} = \\sqrt3', text: 'Stand at the 30° corner. The side across from it is 1, and the leg touching the angle, other than the hypotenuse, is √3.' },
        { tex: '\\tan 30^\\circ = \\tfrac{1}{\\sqrt3}', text: 'Tangent is opposite over adjacent (TOA), because it compares the two legs, so divide 1 by √3.' },
        { tex: '\\tfrac{1}{\\sqrt3}\\cdot\\tfrac{\\sqrt3}{\\sqrt3} = \\tfrac{\\sqrt3}{3}', text: 'Rationalize by multiplying top and bottom by √3. This equals multiplying by 1, so the value is unchanged, but the square root leaves the denominator.' },
      ], answer: '\\tfrac{\\sqrt3}{3}' },
      formula: { tex: '\\tan 30^\\circ = \\tfrac{1}{\\sqrt{3}} = \\tfrac{\\sqrt{3}}{3}', note: 'Multiply top and bottom by √3.', parts: [{ sym: '1', means: 'opposite 30°', tone: 'accent' }, { sym: '\\sqrt{3}', means: 'adjacent to 30°', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a 60° ladder',
      body: 'A 6 m ladder leans at 60° to the ground. How far is the base from the wall, and how high does the ladder reach? Sketch the ladder as the hypotenuse of a 30-60-90 triangle.',
      steps: { steps: [
        { tex: '\\text{hyp} = 6', text: 'The ladder is the hypotenuse, since it is the side across from the right angle where the wall meets the ground.' },
        { tex: '\\text{short leg} = \\tfrac{6}{2} = 3', text: 'In a 30-60-90 triangle the hypotenuse is twice the short leg, so halve 6. The short leg is across from 30°, which is the base along the ground.' },
        { tex: '\\text{height} = 3\\sqrt3', text: 'The long leg is √3 times the short leg, so the height up the wall is 3√3. It is across from the 60° angle.' },
        { tex: '3\\sqrt3 \\approx 3 \\times 1.732 \\approx 5.2\\ \\text{m}', text: 'Multiply by 1.732 for a decimal. 5.2 m is a little less than the 6 m ladder, as a leg of a right triangle must be.' },
      ], answer: '\\text{base } 3\\ \\text{m},\\ \\text{height } 3\\sqrt3 \\approx 5.2\\ \\text{m}' },
      art: rightTriangle({ opp: '3√3', adj: '3', hyp: '6', angle: '60°', shape: { opp: 1.732, adj: 1 }, title: 'Hypotenuse 6 → short leg 3', caption: 'Height = 3√3 ≈ 5.2 m.' }),
    },
    {
      kind: 'protip',
      head: 'Find the short leg first',
      body: 'In a 30-60-90, everything is built from the short leg. Get it first, then double for the hypotenuse or multiply by √3 for the long leg.',
      art: flow([{ label: 'Find the short leg', color: SKY }, { label: '× 2 for the hypotenuse', color: AMB }, { label: '× √3 for the long leg', color: EMR }], { title: 'Short leg is the key', horizontal: false, caption: 'Work out from the smallest side.' }),
    },
    {
      kind: 'trap',
      head: '√3 goes with 60°, not 30°',
      body: 'The long leg √3 sits across from the 60° angle. Swapping them makes sin 30° = √3/2, which is wrong — sin 30° is 1/2.',
      compare: { cols: [{ title: 'Swapped', tex: '\\sin 30^\\circ = \\tfrac{\\sqrt{3}}{2}', lines: ['Long leg used for 30°'], tone: 'bad' }, { title: 'Correct', tex: '\\sin 30^\\circ = \\tfrac{1}{2}', lines: ['Short leg across from 30°'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: sin² 45° + cos² 45°',
      body: 'Use exact values to evaluate sin² 45° + cos² 45°, and notice what you get.',
      steps: { steps: [
        { tex: '\\sin 45^\\circ = \\cos 45^\\circ = \\tfrac{\\sqrt2}{2}', text: 'Recall the exact values from the 45-45-90 triangle. Both legs are equal, so sine and cosine of 45° are the same number, √2/2.' },
        { tex: '\\left(\\tfrac{\\sqrt2}{2}\\right)^2 = \\tfrac{(\\sqrt2)^2}{2^2} = \\tfrac24', text: 'Square the whole fraction by squaring the top and the bottom separately. (√2)² is 2 because squaring undoes a square root, and 2² is 4.' },
        { tex: '\\tfrac24 = \\tfrac12', text: 'Simplify 2/4 by dividing top and bottom by 2. So sin² 45° is 1/2, and cos² 45° is also 1/2.' },
        { tex: '\\tfrac12 + \\tfrac12 = 1', text: 'Add the two halves. The total is 1, which is no accident: sin²θ + cos²θ = 1 for every angle, because of the Pythagorean theorem on the unit circle.' },
      ], answer: '1' },
    },
    {
      kind: 'summary',
      head: 'Special triangles, wrapped up',
      body: '45-45-90 sides are 1 : 1 : √2; 30-60-90 sides are 1 : √3 : 2 with the short leg across from 30°. Read exact sin, cos and tan values straight from them.',
      formula: { tex: '\\sin 30^\\circ = \\tfrac12,\\ \\sin 45^\\circ = \\tfrac{\\sqrt2}{2},\\ \\sin 60^\\circ = \\tfrac{\\sqrt3}{2}', note: 'The three values to know cold.', parts: [{ sym: '\\tfrac12', means: 'sin 30° and cos 60°', tone: 'accent' }, { sym: '\\tfrac{\\sqrt3}{2}', means: 'sin 60° and cos 30°', tone: 'ok' }] },
    },
  ],

  // ---------------- TRIG-5 — The unit circle ----------------
  'TRIG-5': [
    {
      kind: 'objective',
      head: 'Every angle, one circle',
      body: 'On a circle of radius 1, the point at angle θ is exactly (cos θ, sin θ). At 60° that is (1/2, √3/2). Today you will read exact values all the way around the circle.',
      art: unitCircle(60, { label: '60°', point: '(1/2, √3/2)', legs: true, caption: 'The legs of the triangle are cos θ and sin θ.' }),
    },
    {
      kind: 'concept',
      head: 'x is cosine, y is sine',
      body: 'Drop a line from the point to the x-axis. The triangle has hypotenuse 1, so its horizontal leg is cos θ and its vertical leg is sin θ.',
      formula: { tex: '(x, y) = (\\cos\\theta,\\ \\sin\\theta)', note: 'On the unit circle only.', parts: [{ sym: 'x', means: 'cos θ: how far across', tone: 'accent' }, { sym: 'y', means: 'sin θ: how far up', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The quadrantal angles',
      body: 'At the axes the point is easy: 0° is (1, 0), 90° is (0, 1), 180° is (−1, 0), 270° is (0, −1).',
      table: { head: ['θ', 'Point', 'cos θ', 'sin θ'], rows: [['0°', '(1, 0)', '1', '0'], ['90°', '(0, 1)', '0', '1'], ['180°', '(−1, 0)', '−1', '0'], ['270°', '(0, −1)', '0', '−1']] },
    },
    {
      kind: 'concept',
      head: 'Symmetry gives the rest',
      body: 'Every angle in another quadrant mirrors one in Quadrant I. 150° is 30° reflected across the y-axis, so its point is (−√3/2, 1/2).',
      art: unitCircle(150, { label: '150°', point: '(−√3/2, 1/2)', legs: true, caption: 'Same triangle as 30°, flipped to the left.' }),
    },
    {
      kind: 'example',
      head: 'cos 120° and sin 120°',
      body: '120° is 60° short of 180°, in Quadrant II.\nIts triangle matches 60°: (1/2, √3/2).\nIn Quadrant II x is negative: (−1/2, √3/2).',
      steps: { steps: [{ tex: '180 - 120 = 60', text: 'The matching Quadrant I angle.' }, { tex: '(\\cos, \\sin) = \\left(-\\tfrac12, \\tfrac{\\sqrt3}{2}\\right)', text: 'x negative in Quadrant II.' }], answer: '\\cos 120^\\circ = -\\tfrac12' },
    },
    {
      kind: 'example',
      head: 'sin(7π/6)',
      body: '7π/6 is π + π/6, just past 180°, in Quadrant III.\nIts triangle matches π/6 (30°).\nIn Quadrant III y is negative: sin(7π/6) = −1/2.',
      steps: { steps: [{ tex: '\\tfrac{7\\pi}{6} = \\pi + \\tfrac{\\pi}{6}', text: 'Just past half a turn.' }, { tex: '\\sin\\tfrac{7\\pi}{6} = -\\tfrac12', text: 'y is negative in Quadrant III.' }], answer: '-\\tfrac12' },
    },
    {
      kind: 'example',
      head: 'cos 315°',
      body: '315° is 45° short of 360°, in Quadrant IV. The 45° point is (√2/2, √2/2). In Quadrant IV x is positive, so cos 315° = √2/2.',
      art: unitCircle(315, { label: '315°', point: '(√2/2, −√2/2)', caption: 'Quadrant IV: x positive, y negative.' }),
    },
    {
      kind: 'example',
      head: 'Another way: the radian denominators',
      body: 'In radians, the denominator tells you the triangle: /6 means 30°, /4 means 45°, /3 means 60°. So 5π/4 uses the 45° triangle, in Quadrant III: (−√2/2, −√2/2).',
      table: { head: ['Denominator', 'Triangle', 'Coordinates use'], rows: [['/6', '30°', '√3/2 and 1/2'], ['/4', '45°', '√2/2 both'], ['/3', '60°', '1/2 and √3/2']] },
    },
    {
      kind: 'example',
      head: 'tan θ from the point',
      body: 'tan θ = sin θ ÷ cos θ = y ÷ x. At 60°, tan = (√3/2) ÷ (1/2) = √3. At 90°, x = 0, so tan 90° is undefined.',
      formula: { tex: '\\tan\\theta = \\frac{y}{x} = \\frac{\\sin\\theta}{\\cos\\theta}', note: 'Undefined wherever x = 0.', parts: [{ sym: 'y/x', means: 'the slope of the radius', tone: 'accent' }, { sym: 'x = 0', means: 'at 90° and 270°: no tangent', tone: 'bad' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a clock hand',
      body: 'The tip of a 1-unit hand starts at 3 o\'clock and turns 240°. Picture it: past 180° by 60°, in Quadrant III. The tip is at (−1/2, −√3/2).',
      art: unitCircle(240, { label: '240°', point: '(−1/2, −√3/2)', legs: true, caption: 'The 60° triangle, in Quadrant III.' }),
    },
    {
      kind: 'protip',
      head: 'Only three numbers to remember',
      body: 'Every coordinate on the standard unit circle is 0, ±1/2, ±√2/2, ±√3/2 or ±1. Know which goes where in Quadrant I, then fix the signs.',
      formula: { tex: '\\tfrac12,\\quad \\tfrac{\\sqrt2}{2},\\quad \\tfrac{\\sqrt3}{2}', note: 'Plus 0 and 1 at the axes.', parts: [{ sym: '\\tfrac12', means: 'the short leg of the 30-60-90', tone: 'accent' }, { sym: '\\tfrac{\\sqrt3}{2}', means: 'the long leg of the 30-60-90', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'x is cos, not sin',
      body: 'The first coordinate is cosine, the second is sine — alphabetical: c before s, x before y. Swapping them gives sin 60° = 1/2, which is wrong.',
      compare: { cols: [{ title: 'Swapped', tex: '(\\sin\\theta, \\cos\\theta)', lines: ['Wrong order'], tone: 'bad' }, { title: 'Correct', tex: '(\\cos\\theta, \\sin\\theta)', lines: ['c before s, x before y'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: all angles with sin θ = 1/2',
      body: 'Find every angle between 0 and 2π whose sine is 1/2.',
      steps: { steps: [{ tex: '\\theta = \\tfrac{\\pi}{6}', text: 'Quadrant I.' }, { tex: '\\theta = \\pi - \\tfrac{\\pi}{6} = \\tfrac{5\\pi}{6}', text: 'Quadrant II: y is also positive.' }], answer: '\\tfrac{\\pi}{6},\\ \\tfrac{5\\pi}{6}' },
    },
    {
      kind: 'summary',
      head: 'The unit circle, wrapped up',
      body: 'The point at angle θ is (cos θ, sin θ). Know Quadrant I using the 30°, 45° and 60° triangles; reflect to the other quadrants and fix the signs. tan θ is y/x.',
      table: { head: ['θ', 'Point'], rows: [['30°', '(√3/2, 1/2)'], ['45°', '(√2/2, √2/2)'], ['60°', '(1/2, √3/2)'], ['90°', '(0, 1)']] },
    },
  ],

  // ---------------- TRIG-6 — Reference angles and signs ----------------
  'TRIG-6': [
    {
      kind: 'objective',
      head: 'Every angle has a twin in Quadrant I',
      body: 'sin 210° has the same size as sin 30°, just negative. The 30° is the reference angle. Today you will find reference angles and the right sign in every quadrant.',
      art: unitCircle(210, { label: '210°', point: 'reference 30°', caption: 'The triangle at 210° is the 30° triangle, flipped.' }),
    },
    {
      kind: 'concept',
      head: 'The reference angle',
      body: 'The reference angle is the acute angle between the terminal side and the x-axis. It is always between 0° and 90°.',
      table: { head: ['Quadrant', 'Reference angle'], rows: [['I', 'θ'], ['II', '180° − θ'], ['III', 'θ − 180°'], ['IV', '360° − θ']] },
    },
    {
      kind: 'concept',
      head: 'All Students Take Calculus',
      body: 'In Quadrant I All are positive; in II only Sine; in III only Tangent; in IV only Cosine. The first letters spell A-S-T-C, counterclockwise.',
      compare: {
        cols: [
          { title: 'Quadrants I, II', lines: ['I: all positive', 'II: sin positive'], tone: 'ok' },
          { title: 'Quadrants III, IV', lines: ['III: tan positive', 'IV: cos positive'], tone: 'accent' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Value = sign × reference value',
      body: 'Find the trig value of the reference angle, then attach the sign for the quadrant. Two small steps instead of one hard one.',
      formula: { tex: '\\sin\\theta = \\pm\\sin(\\text{ref})', note: 'The quadrant decides the sign.', parts: [{ sym: '\\pm', means: 'from A-S-T-C', tone: 'accent' }, { sym: '\\text{ref}', means: 'the acute reference angle', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'sin 210°',
      body: 'Quadrant III: reference angle 210 − 180 = 30°.\nsin 30° = 1/2.\nSine is negative in III: sin 210° = −1/2.',
      steps: { steps: [{ tex: '210 - 180 = 30', text: 'Reference angle in Quadrant III.' }, { tex: '\\sin 210^\\circ = -\\sin 30^\\circ', text: 'Only tangent is positive in III.' }], answer: '-\\tfrac12' },
    },
    {
      kind: 'example',
      head: 'cos 135°',
      body: 'Quadrant II: reference angle 180 − 135 = 45°.\ncos 45° = √2/2.\nCosine is negative in II: cos 135° = −√2/2.',
      steps: { steps: [{ tex: '180 - 135 = 45', text: 'Reference angle in Quadrant II.' }, { tex: '\\cos 135^\\circ = -\\cos 45^\\circ', text: 'Only sine is positive in II.' }], answer: '-\\tfrac{\\sqrt2}{2}' },
    },
    {
      kind: 'example',
      head: 'tan 300°',
      body: 'Quadrant IV: reference angle 360 − 300 = 60°. tan 60° = √3. Tangent is negative in IV, so tan 300° = −√3.',
      art: unitCircle(300, { label: '300°', point: 'ref 60°', caption: 'Quadrant IV: only cosine is positive.' }),
      formula: { tex: '\\tan 300^\\circ = -\\tan 60^\\circ = -\\sqrt{3}', note: 'Reference value, with the Quadrant IV sign.', parts: [{ sym: '-', means: 'tangent is negative in Quadrant IV', tone: 'bad' }, { sym: '\\tan 60^\\circ', means: 'the reference value, √3', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: read it off the unit circle',
      body: 'Instead of a formula, sketch the angle and the triangle to the x-axis. The triangle tells you the size; the direction of the legs tells you the signs.',
      art: unitCircle(135, { label: '135°', point: '(−√2/2, √2/2)', legs: true, caption: 'The cos leg points left: negative.' }),
    },
    {
      kind: 'example',
      head: 'Radians: cos(5π/3)',
      body: '5π/3 is 2π − π/3, in Quadrant IV, with reference angle π/3. cos(π/3) = 1/2, and cosine is positive in IV, so cos(5π/3) = 1/2.',
      formula: { tex: '\\cos\\tfrac{5\\pi}{3} = +\\cos\\tfrac{\\pi}{3} = \\tfrac12', note: 'Quadrant IV keeps cosine positive.', parts: [{ sym: '\\tfrac{\\pi}{3}', means: 'the reference angle', tone: 'accent' }, { sym: '+', means: 'cosine is positive in IV', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: which quadrant?',
      body: 'sin θ < 0 and tan θ > 0. Sketch the A-S-T-C circle: sine is negative in III and IV, tangent is positive in I and III. Both conditions hold only in Quadrant III.',
      table: { head: ['Quadrant', 'sin', 'tan'], rows: [['I', '+', '+'], ['II', '+', '−'], ['III', '−', '+'], ['IV', '−', '−']], mark: 2 },
    },
    {
      kind: 'protip',
      head: 'Reference angles use the x-axis',
      body: 'Always measure to the nearest part of the x-axis, never the y-axis. That keeps the reference angle matching the 30°, 45°, 60° triangles.',
      art: flow([{ label: 'Find the quadrant', color: SKY }, { label: 'Measure to the x-axis', color: AMB }, { label: 'Attach the A-S-T-C sign', color: EMR }], { title: 'Any angle in three steps', horizontal: false, caption: 'Size from the reference angle, sign from the quadrant.' }),
    },
    {
      kind: 'trap',
      head: 'Do not measure to the y-axis',
      body: 'For 120°, the reference angle is 60° (to the negative x-axis), not 30° (to the y-axis). Using 30° gives the wrong value.',
      compare: { cols: [{ title: 'To the y-axis', tex: '120 - 90 = 30', lines: ['Wrong reference'], tone: 'bad' }, { title: 'To the x-axis', tex: '180 - 120 = 60', lines: ['Right reference'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: sin(−225°)',
      body: 'First find a coterminal angle between 0° and 360°, then use the reference angle and sign.',
      steps: { steps: [{ tex: '-225 + 360 = 135', text: 'Coterminal angle.' }, { tex: '\\sin 135^\\circ = +\\sin 45^\\circ', text: 'Quadrant II: sine positive.' }], answer: '\\tfrac{\\sqrt2}{2}' },
    },
    {
      kind: 'summary',
      head: 'Reference angles, wrapped up',
      body: 'The reference angle is the acute angle to the x-axis. A-S-T-C gives the signs: All, Sine, Tangent, Cosine. The value is the reference value with the quadrant\'s sign.',
      table: { head: ['Angle', 'Reference', 'Value'], rows: [['sin 210°', '30°', '−1/2'], ['cos 135°', '45°', '−√2/2'], ['tan 300°', '60°', '−√3']] },
    },
  ],

  // ---------------- TRIG-7 — Graphing sine and cosine ----------------
  'TRIG-7': [
    {
      kind: 'objective',
      head: 'The circle, unrolled',
      body: 'Walk around the unit circle and plot the height at each angle: you get the sine wave. It rises to 1, falls to −1, and repeats every 2π. Today you will read amplitude, period and midline.',
      art: funcGraph([{ f: qsin, label: 'y = sin x', color: AMB }, { f: qcos, label: 'y = cos x', color: SKY, dash: '6 4' }], { range: { x: [0, 4], y: [-1.5, 1.5] }, xTickText: quarterTicks, title: 'Sine starts at 0; cosine starts at 1', caption: 'Both repeat every 2π.' }),
    },
    {
      kind: 'concept',
      head: 'Amplitude, period, midline',
      body: 'For y = A sin(Bx) + D: the amplitude |A| is the height above the midline, the period is 2π/B, and the midline is y = D.',
      formula: { tex: 'y = A\\sin(Bx) + D', note: 'Period 2π/B.', parts: [{ sym: '|A|', means: 'amplitude: distance from midline to peak', tone: 'accent' }, { sym: '\\tfrac{2\\pi}{B}', means: 'period: length of one cycle', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Five key points',
      body: 'One cycle of y = sin x passes through 0, peak, 0, trough, 0 at the quarter points 0, π/2, π, 3π/2, 2π. Plot those five and connect smoothly.',
      table: { head: ['x', '0', 'π/2', 'π', '3π/2', '2π'], rows: [['sin x', '0', '1', '0', '−1', '0'], ['cos x', '1', '0', '−1', '0', '1']] },
    },
    {
      kind: 'concept',
      head: 'Changing the amplitude',
      body: 'Multiply sine by 3 and every height triples: the wave reaches 3 and −3. The period does not change.',
      art: funcGraph([{ f: (u) => 3 * qsin(u), label: 'y = 3 sin x', color: ROSE }, { f: qsin, label: 'y = sin x', color: AMB, dash: '6 4' }], { range: { x: [0, 4], y: [-3.5, 3.5] }, xTickText: quarterTicks, title: 'Amplitude 3', caption: 'Taller, same period.' }),
    },
    {
      kind: 'example',
      head: 'y = 4 cos x: amplitude and period',
      body: 'A = 4, so the amplitude is 4.\nB = 1, so the period is 2π.\nThe wave runs from −4 to 4.',
      steps: { steps: [{ tex: '|A| = 4', text: 'The amplitude.' }, { tex: '\\tfrac{2\\pi}{1} = 2\\pi', text: 'The period.' }], answer: '4,\\ 2\\pi' },
    },
    {
      kind: 'example',
      head: 'y = sin(2x): period',
      body: 'B = 2.\nThe period is 2π/2 = π.\nThe wave fits two full cycles into 2π.',
      steps: { steps: [{ tex: 'B = 2', text: 'The number multiplying x.' }, { tex: '\\tfrac{2\\pi}{2} = \\pi', text: 'Period is 2π/B.' }], answer: '\\pi' },
    },
    {
      kind: 'example',
      head: 'See the faster wave',
      body: 'y = sin(2x) completes a cycle by π, while sin x needs 2π. A bigger B squeezes the wave horizontally.',
      art: funcGraph([{ f: (u) => qsin(2 * u), label: 'y = sin 2x', color: EMR }, { f: qsin, label: 'y = sin x', color: AMB, dash: '6 4' }], { range: { x: [0, 4], y: [-1.5, 1.5] }, xTickText: quarterTicks, title: 'Period π: twice as fast', caption: 'Two cycles in the space of one.' }),
    },
    {
      kind: 'example',
      head: 'Another way: read the graph',
      body: 'Given a wave with peak 5 and trough 1, the midline is halfway: (5 + 1)/2 = 3, and the amplitude is half the height: (5 − 1)/2 = 2.',
      formula: { tex: 'D = \\tfrac{\\max + \\min}{2}, \\quad A = \\tfrac{\\max - \\min}{2}', note: 'Read the midline and amplitude off the peaks.', parts: [{ sym: 'D', means: 'midline: the average of max and min', tone: 'accent' }, { sym: 'A', means: 'amplitude: half the distance', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'A midline shift: y = sin x + 2',
      body: 'Adding 2 lifts the whole wave. The midline is y = 2, and the wave runs from 1 to 3.',
      art: funcGraph([{ f: (u) => qsin(u) + 2, label: 'y = sin x + 2', color: VIO }], { range: { x: [0, 4], y: [-0.5, 3.5] }, hAsymptote: { at: 2, label: 'midline y = 2' }, xTickText: quarterTicks, title: 'Midline moved up to 2', caption: 'Peak 3, trough 1.' }),
    },
    {
      kind: 'example',
      head: 'Picture it first: a Ferris wheel ride',
      body: 'A wheel of radius 20 m has its center 25 m up and turns once every 2 minutes. Sketch the height: midline 25, amplitude 20, period 2. It runs from 5 m to 45 m.',
      table: { head: ['Feature', 'Value'], rows: [['midline', '25 m (center)'], ['amplitude', '20 m (radius)'], ['period', '2 minutes'], ['range', '5 m to 45 m']] },
    },
    {
      kind: 'protip',
      head: 'Divide the period into quarters',
      body: 'Find the period, divide it by 4, and mark those x-values. The five key points always sit at the quarter marks.',
      formula: { tex: '\\text{step} = \\tfrac{\\text{period}}{4}', note: 'Four equal steps per cycle.', parts: [{ sym: '\\text{period}', means: 'the length of one full cycle', tone: 'accent' }, { sym: '\\tfrac{1}{4}', means: 'spacing between key points', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Period is 2π ÷ B, not 2π × B',
      body: 'A bigger B makes the wave FASTER, so the period gets SMALLER. y = sin(3x) has period 2π/3, not 6π.',
      compare: { cols: [{ title: 'Multiplied', tex: '2\\pi \\times 3 = 6\\pi', lines: ['Wave would be slower'], tone: 'bad' }, { title: 'Divided', tex: '\\tfrac{2\\pi}{3}', lines: ['Faster wave, shorter period'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: write the equation',
      body: 'A sine wave starts on its midline at x = 0, rises to a max of 7, falls to a min of 1, and repeats every π. Write it.',
      steps: { steps: [{ tex: 'D = 4,\\ A = 3', text: 'Midline and amplitude from max and min.' }, { tex: 'B = \\tfrac{2\\pi}{\\pi} = 2', text: 'From the period.' }], answer: 'y = 3\\sin(2x) + 4' },
    },
    {
      kind: 'summary',
      head: 'Sine and cosine graphs, wrapped up',
      body: 'Sine starts at 0, cosine at 1; both repeat every 2π. In y = A sin(Bx) + D, |A| is the amplitude, 2π/B the period, and y = D the midline. Plot five key points per cycle.',
      table: { head: ['Part', 'Effect'], rows: [['A', 'height (amplitude)'], ['B', 'speed (period 2π/B)'], ['D', 'lifts the midline']] },
    },
  ],
};
