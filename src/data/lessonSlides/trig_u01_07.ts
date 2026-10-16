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
      art: unitCircle(-60, { label: '−60°', caption: 'A negative angle turns clockwise.' }),
    },
    {
      kind: 'concept',
      head: 'Quadrants',
      body: 'The axes split the plane into four quadrants, numbered counterclockwise from the upper right. The quadrant is wherever the terminal side lands.',
      table: { head: ['Quadrant', 'Angles between'], rows: [['I', '0° and 90°'], ['II', '90° and 180°'], ['III', '180° and 270°'], ['IV', '270° and 360°']] },
    },
    {
      kind: 'concept',
      head: 'Coterminal angles',
      body: 'Angles that end on the same terminal side are coterminal. Add or subtract full turns of 360° to find them.',
      formula: { tex: '\\theta \\pm 360^\\circ k', note: 'k is any whole number of full turns.', parts: [{ sym: '360^\\circ', means: 'one full turn', tone: 'accent' }, { sym: 'k', means: 'how many turns you add or remove', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Which quadrant is 245°?',
      body: '245° is past 180° but not yet 270°.\nThat is the third quadrant.\nThe terminal side points down and left.',
      steps: { steps: [{ tex: '180 < 245 < 270', text: 'Between the two axes.' }, { tex: '\\text{Quadrant III}', text: 'Counting counterclockwise.' }], answer: '\\text{III}' },
    },
    {
      kind: 'example',
      head: 'A positive coterminal angle for −60°',
      body: 'Add one full turn.\n−60 + 360 = 300.\n300° ends on the same side as −60°.',
      steps: { steps: [{ tex: '-60 + 360', text: 'Add a full turn.' }, { tex: '= 300', text: 'A positive angle on the same side.' }], answer: '300^\\circ' },
    },
    {
      kind: 'example',
      head: 'A big angle: 780°',
      body: 'Remove full turns until you are between 0° and 360°. 780 − 360 = 420, and 420 − 360 = 60. So 780° is coterminal with 60°, in Quadrant I.',
      art: unitCircle(60, { label: '60°', caption: '780° is two full turns, then 60° more.' }),
    },
    {
      kind: 'example',
      head: 'Another way: divide by 360',
      body: 'For 780°, divide by 360: 780 = 2 × 360 + 60. The remainder, 60°, is the coterminal angle between 0° and 360°. One division instead of repeated subtraction.',
      formula: { tex: '780 = 2(360) + 60', note: 'The remainder is the angle that matters.', parts: [{ sym: '2(360)', means: 'two full turns', tone: 'accent' }, { sym: '60', means: 'where it actually ends', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Negative and big: −500°',
      body: 'Add 360° until the angle is positive: −500 + 360 = −140, then −140 + 360 = 220. So −500° ends in Quadrant III, like 220°.',
      table: { head: ['Step', 'Angle'], rows: [['start', '−500°'], ['+ 360°', '−140°'], ['+ 360°', '220°']], mark: 2, note: '220° is in Quadrant III.' },
      formula: { tex: '-500 + 2(360) = 220', note: 'Two full turns bring it into range.', parts: [{ sym: '2(360)', means: 'two full counterclockwise turns', tone: 'accent' }, { sym: '220', means: 'the coterminal angle, Quadrant III', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a Ferris wheel',
      body: 'A Ferris wheel car starts at the 3 o\'clock position and turns 450° counterclockwise. Sketch it: one full turn brings it back, then 90° more puts it at the top.',
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
      body: 'List every angle coterminal with 100° between −360° and 720°.',
      steps: { steps: [{ tex: '100 - 360 = -260', text: 'One turn backward.' }, { tex: '100 + 360 = 460', text: 'One turn forward.' }], answer: '-260^\\circ,\\ 100^\\circ,\\ 460^\\circ' },
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
      formula: { tex: '180^\\circ = \\pi \\text{ rad}', note: 'Multiply by π/180 or 180/π.', parts: [{ sym: '\\times \\tfrac{\\pi}{180}', means: 'degrees to radians', tone: 'accent' }, { sym: '\\times \\tfrac{180}{\\pi}', means: 'radians to degrees', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Arc length: s = rθ',
      body: 'In radians, an arc is simply radius times angle. That is why mathematicians prefer radians: the formula has no 360 in it.',
      formula: { tex: 's = r\\theta', note: 'θ must be in radians.', parts: [{ sym: 'r', means: 'the radius', tone: 'accent' }, { sym: '\\theta', means: 'the angle in radians', tone: 'ok' }] },
      art: sectorFig(90, { arcLabel: 's = 5π/2', radius: 'r = 5', title: 'A quarter turn: θ = π/2', caption: 's = 5 × π/2 = 5π/2.' }),
    },
    {
      kind: 'concept',
      head: 'Sector area: A = ½r²θ',
      body: 'A sector is a slice of the circle. In radians its area is half of r² times θ.',
      formula: { tex: 'A = \\tfrac{1}{2}r^2\\theta', note: 'Also needs θ in radians.', parts: [{ sym: 'r^2', means: 'the radius squared', tone: 'accent' }, { sym: '\\tfrac{1}{2}\\theta', means: 'the fraction of the circle, in radians', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Degrees to radians: 135°',
      body: 'Multiply by π/180.\n135π/180 simplifies by 45.\n135° = 3π/4.',
      steps: { steps: [{ tex: '135 \\times \\tfrac{\\pi}{180}', text: 'Degrees to radians.' }, { tex: '= \\tfrac{135\\pi}{180} = \\tfrac{3\\pi}{4}', text: 'Divide top and bottom by 45.' }], answer: '\\tfrac{3\\pi}{4}' },
    },
    {
      kind: 'example',
      head: 'Radians to degrees: 5π/6',
      body: 'Multiply by 180/π.\nThe π cancels.\n5 × 180 ÷ 6 = 150°.',
      steps: { steps: [{ tex: '\\tfrac{5\\pi}{6} \\times \\tfrac{180}{\\pi}', text: 'Radians to degrees.' }, { tex: '= \\tfrac{900}{6} = 150', text: 'The π cancels.' }], answer: '150^\\circ' },
    },
    {
      kind: 'example',
      head: 'Arc length: r = 8, θ = 2.5',
      body: 'The angle is already in radians, so s = rθ = 8 × 2.5 = 20.',
      formula: { tex: 's = 8 \\times 2.5 = 20', note: 'No conversion needed.', parts: [{ sym: '8', means: 'the radius', tone: 'accent' }, { sym: '2.5', means: 'the angle in radians', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: think in fractions of π',
      body: 'Know a few anchors: 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2. Then 135° is 3 × 45°, so 3π/4 — no multiplying needed.',
      table: { head: ['Degrees', 'Radians'], rows: [['30°', 'π/6'], ['45°', 'π/4'], ['60°', 'π/3'], ['90°', 'π/2'], ['135°', '3π/4']], mark: 4 },
    },
    {
      kind: 'example',
      head: 'Sector area: r = 6, θ = π/3',
      body: 'A = ½ × 36 × π/3 = 6π ≈ 18.85. The sector is one sixth of the circle, and the whole circle is 36π — the same answer.',
      art: sectorFig(60, { arcLabel: 'area 6π', radius: 'r = 6', title: 'θ = π/3 is 1/6 of the circle', caption: '½ · 36 · π/3 = 6π.' }),
    },
    {
      kind: 'example',
      head: 'Picture it first: a bicycle wheel',
      body: 'A wheel of radius 0.35 m turns 10 radians. Picture a point on the tire rolling out a path. The bike moves s = 0.35 × 10 = 3.5 m.',
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
      body: 'An arc of length 12 sits on a circle of radius 4. Find the angle in radians, then in degrees.',
      steps: { steps: [{ tex: '\\theta = \\tfrac{s}{r} = \\tfrac{12}{4} = 3', text: 'Rearrange s = rθ.' }, { tex: '3 \\times \\tfrac{180}{\\pi} \\approx 171.9', text: 'Convert to degrees.' }], answer: '\\theta = 3 \\text{ rad} \\approx 171.9^\\circ' },
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
      formula: { tex: '\\sin\\theta = \\tfrac{\\text{opp}}{\\text{hyp}},\\ \\cos\\theta = \\tfrac{\\text{adj}}{\\text{hyp}},\\ \\tan\\theta = \\tfrac{\\text{opp}}{\\text{adj}}', note: 'SOH, CAH, TOA.', parts: [{ sym: '\\text{opp}', means: 'the side across from θ', tone: 'accent' }, { sym: '\\text{hyp}', means: 'the longest side', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Pick the ratio from what you have',
      body: 'Circle the side you know and the side you want. The ratio that uses exactly those two is the one to use.',
      table: { head: ['Known & wanted', 'Ratio'], rows: [['opp & hyp', 'sin'], ['adj & hyp', 'cos'], ['opp & adj', 'tan']] },
    },
    {
      kind: 'concept',
      head: 'Inverse trig gives the angle',
      body: 'When two sides are known, the inverse function returns the angle. sin⁻¹, cos⁻¹ and tan⁻¹ undo the ratios.',
      formula: { tex: '\\theta = \\sin^{-1}\\!\\left(\\tfrac{\\text{opp}}{\\text{hyp}}\\right)', note: 'The angle whose sine is this ratio.', parts: [{ sym: '\\sin^{-1}', means: 'undoes sine', tone: 'accent' }, { sym: '\\theta', means: 'the angle', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Find the hypotenuse: 40°, opposite 12',
      body: 'Opposite and hypotenuse: sine.\nsin 40° = 12/h, so h = 12/sin 40°.\nh ≈ 18.7.',
      steps: { steps: [{ tex: '\\sin 40^\\circ = \\frac{12}{h}', text: 'SOH: opposite over hypotenuse.' }, { tex: 'h = \\frac{12}{\\sin 40^\\circ} \\approx 18.7', text: 'Solve for h.' }], answer: 'h \\approx 18.7' },
    },
    {
      kind: 'example',
      head: 'Find the angle: adjacent 7, hypotenuse 10',
      body: 'Adjacent and hypotenuse: cosine.\ncos θ = 0.7.\nθ = cos⁻¹(0.7) ≈ 45.6°.',
      steps: { steps: [{ tex: '\\cos\\theta = \\frac{7}{10}', text: 'CAH: adjacent over hypotenuse.' }, { tex: '\\theta = \\cos^{-1}(0.7)', text: 'Use the inverse.' }], answer: '\\theta \\approx 45.6^\\circ' },
    },
    {
      kind: 'example',
      head: 'Elevation: a kite string',
      body: 'A 100 m kite string makes a 35° angle with the ground. Height = 100 sin 35° ≈ 57.4 m.',
      art: rightTriangle({ opp: 'height ?', hyp: '100 m', angle: '35°', shape: { opp: 2.8, adj: 4 }, title: 'The string is the hypotenuse', caption: 'Opposite and hypotenuse: sine.' }),
    },
    {
      kind: 'example',
      head: 'Another way: Pythagoras for the last side',
      body: 'Once two sides are known, the third does not need trig. With opposite 12 and hypotenuse 18.7, the adjacent side is √(18.7² − 12²) ≈ 14.3.',
      formula: { tex: 'a = \\sqrt{18.7^2 - 12^2} \\approx 14.3', note: 'Pythagoras finishes the triangle.', parts: [{ sym: '18.7', means: 'the hypotenuse found with trig', tone: 'accent' }, { sym: '12', means: 'the known opposite side', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: angle of depression',
      body: 'A lighthouse keeper 30 m up sees a boat at 12° below horizontal. Sketch it: the angle at the boat is also 12°. Distance = 30 ÷ tan 12° ≈ 141 m.',
      art: rightTriangle({ opp: '30 m', adj: 'distance ?', angle: '12°', shape: { opp: 1.4, adj: 6 }, title: 'Depression angle = elevation angle', caption: 'Alternate interior angles are equal.' }),
    },
    {
      kind: 'example',
      head: 'Tangent: a ramp',
      body: 'A ramp rises 1.2 m over 10 m of ground. The angle is tan⁻¹(1.2/10) = tan⁻¹(0.12) ≈ 6.8°.',
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
      body: 'A tower is seen at 40° elevation from 50 m away. How tall is it, and what is the elevation angle from 80 m away?',
      steps: { steps: [{ tex: 'h = 50 \\tan 40^\\circ \\approx 42.0', text: 'Height from 50 m.' }, { tex: '\\tan^{-1}(42.0/80) \\approx 27.7^\\circ', text: 'Angle from 80 m.' }], answer: '\\approx 27.7^\\circ' },
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
      formula: { tex: '1 : 1 : \\sqrt{2}', note: 'Leg, leg, hypotenuse.', parts: [{ sym: '1 : 1', means: 'two equal legs', tone: 'accent' }, { sym: '\\sqrt{2}', means: 'the hypotenuse', tone: 'ok' }] },
      art: rightTriangle({ opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 1, adj: 1 }, title: 'Half a square', caption: 'sin 45° = cos 45° = 1/√2 = √2/2.' }),
    },
    {
      kind: 'concept',
      head: 'The 30-60-90 triangle',
      body: 'Cut an equilateral triangle in half. The short leg is 1, the hypotenuse is 2, and the long leg is √3.',
      formula: { tex: '1 : \\sqrt{3} : 2', note: 'Short leg, long leg, hypotenuse.', parts: [{ sym: '1', means: 'across from 30°', tone: 'accent' }, { sym: '\\sqrt{3}', means: 'across from 60°', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The exact-value table',
      body: 'Read SOH-CAH-TOA straight off the two triangles. Notice that the sines climb 1/2, √2/2, √3/2 while the cosines fall.',
      table: { head: ['θ', 'sin θ', 'cos θ', 'tan θ'], rows: [['30°', '1/2', '√3/2', '√3/3'], ['45°', '√2/2', '√2/2', '1'], ['60°', '√3/2', '1/2', '√3']] },
    },
    {
      kind: 'example',
      head: 'Exact value of sin 60°',
      body: 'Use the 30-60-90 triangle.\nFrom 60°, opposite is √3 and hypotenuse is 2.\nsin 60° = √3/2.',
      steps: { steps: [{ tex: '\\text{opp} = \\sqrt{3},\\ \\text{hyp} = 2', text: 'Read from the triangle.' }, { tex: '\\sin 60^\\circ = \\tfrac{\\sqrt{3}}{2}', text: 'SOH: opposite over hypotenuse.' }], answer: '\\tfrac{\\sqrt{3}}{2}' },
    },
    {
      kind: 'example',
      head: 'A 45-45-90 with hypotenuse 10',
      body: 'Divide the hypotenuse by √2.\n10/√2 = 10√2/2 = 5√2.\nEach leg is 5√2.',
      steps: { steps: [{ tex: '\\text{leg} = \\tfrac{10}{\\sqrt{2}}', text: 'Hypotenuse ÷ √2.' }, { tex: '= 5\\sqrt{2}', text: 'Rationalize the denominator.' }], answer: '5\\sqrt{2}' },
    },
    {
      kind: 'example',
      head: 'A 30-60-90 with long leg 9',
      body: 'The long leg is √3 times the short leg, so short = 9/√3 = 3√3. The hypotenuse is twice the short leg: 6√3.',
      art: rightTriangle({ opp: '3√3', adj: '9', hyp: '6√3', angle: '30°', shape: { opp: 1, adj: 1.732 }, title: 'Scale the 1 : √3 : 2 pattern', caption: 'Short leg 3√3, hypotenuse 6√3.' }),
    },
    {
      kind: 'example',
      head: 'Another way: the hand trick',
      body: 'Sines of 0°, 30°, 45°, 60°, 90° are √0/2, √1/2, √2/2, √3/2, √4/2. That pattern rebuilds the whole table in seconds.',
      table: { head: ['θ', 'sin θ'], rows: [['0°', '√0/2 = 0'], ['30°', '√1/2 = 1/2'], ['45°', '√2/2'], ['60°', '√3/2'], ['90°', '√4/2 = 1']], note: 'Cosine is the same column read upward.' },
    },
    {
      kind: 'example',
      head: 'tan 30° exactly',
      body: 'From 30°, opposite is 1 and adjacent is √3. tan 30° = 1/√3 = √3/3 after rationalizing.',
      formula: { tex: '\\tan 30^\\circ = \\tfrac{1}{\\sqrt{3}} = \\tfrac{\\sqrt{3}}{3}', note: 'Multiply top and bottom by √3.', parts: [{ sym: '1', means: 'opposite 30°', tone: 'accent' }, { sym: '\\sqrt{3}', means: 'adjacent to 30°', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a 60° ladder',
      body: 'A 6 m ladder leans at 60° to the ground. Sketch the 30-60-90: the hypotenuse is 6, so the short leg (the base) is 3 and the height is 3√3 ≈ 5.2 m.',
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
      body: 'Use exact values to evaluate, and notice what you get.',
      steps: { steps: [{ tex: '\\left(\\tfrac{\\sqrt{2}}{2}\\right)^2 = \\tfrac{1}{2}', text: 'Square each value.' }, { tex: '\\tfrac{1}{2} + \\tfrac{1}{2} = 1', text: 'They add to 1 — a preview of an identity.' }], answer: '1' },
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
