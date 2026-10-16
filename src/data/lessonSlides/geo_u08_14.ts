import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, boxNet, composite, flow, prism, rightTriangle, shapeBox, triHeight } from '../slideArt';
import { circleAnglesFig, gridShapes, polygonFig, sectorFig, tangentFig } from './geoArt';

// Geometry slide decks, units 8-14: the Pythagorean theorem, right-triangle
// trigonometry, polygons, circles, area, surface area and volume, and
// transformations on the coordinate plane.

export const GEO_SLIDES_U08_14: SlideBank = {
  // ---------------- GEO-8 — Right triangles and the Pythagorean theorem ----------------
  'GEO-8': [
    {
      kind: 'objective',
      head: 'The square corner rule',
      body: 'A right triangle with legs 6 and 8 has a hypotenuse of exactly 10. That comes from a² + b² = c². Today you will use Pythagoras, its converse, special triangles and the distance formula.',
      art: rightTriangle({ opp: '6', adj: '8', hyp: '10', shape: { opp: 3, adj: 4 }, title: '6² + 8² = 10²', caption: '36 + 64 = 100.' }),
    },
    {
      kind: 'concept',
      head: 'The Pythagorean theorem',
      body: 'In a right triangle, the squares of the two legs add up to the square of the hypotenuse. The hypotenuse is the longest side, across from the right angle.',
      formula: { tex: 'a^2 + b^2 = c^2', note: 'c is always the hypotenuse.', parts: [{ sym: 'a,\\ b', means: 'the legs that form the right angle', tone: 'accent' }, { sym: 'c', means: 'the hypotenuse, across from the right angle', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The converse: is it a right triangle?',
      body: 'Run the theorem backwards. If a² + b² = c², the triangle has a right angle. If a² + b² > c² it is acute; if a² + b² < c² it is obtuse.',
      table: { head: ['Compare a² + b² with c²', 'Triangle'], rows: [['equal', 'right'], ['bigger', 'acute'], ['smaller', 'obtuse']] },
    },
    {
      kind: 'concept',
      head: 'The distance formula is Pythagoras',
      body: 'The distance between two points is the hypotenuse of a right triangle whose legs are the changes in x and y.',
      formula: { tex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', note: 'Legs are the run and the rise.', parts: [{ sym: 'x_2 - x_1', means: 'the horizontal leg', tone: 'accent' }, { sym: 'y_2 - y_1', means: 'the vertical leg', tone: 'ok' }] },
      art: gridShapes([{ pts: [[1, 1], [7, 1], [7, 9]], color: AMB, label: '10' }], { range: { x: [0, 9], y: [0, 10] }, title: '(1, 1) to (7, 9): legs 6 and 8', caption: 'The distance is the hypotenuse: 10.' }),
    },
    {
      kind: 'example',
      head: 'Hypotenuse: legs 9 and 12',
      body: 'Square each leg and add.\nTake the square root.\nThe hypotenuse is 15.',
      steps: { steps: [{ tex: '9^2 + 12^2 = 81 + 144', text: 'Square the legs.' }, { tex: '= 225', text: 'Add the two squares.' }, { tex: '\\sqrt{225} = 15', text: 'Square root.' }], answer: 'c = 15' },
    },
    {
      kind: 'example',
      head: 'A missing leg: hypotenuse 13, leg 5',
      body: 'When the hypotenuse is known, subtract.\n13² − 5² = 169 − 25 = 144.\nThe other leg is 12.',
      steps: { steps: [{ tex: 'b^2 = 13^2 - 5^2', text: 'Hypotenuse squared minus leg squared.' }, { tex: 'b^2 = 144', text: 'Subtract.' }], answer: 'b = 12' },
    },
    {
      kind: 'example',
      head: 'Another way: spot a triple',
      body: 'Legs 9 and 12 are 3 × 3 and 3 × 4. That is the 3-4-5 triple scaled by 3, so the hypotenuse is 15 with no squaring at all.',
      table: { head: ['Triple', 'Scaled'], rows: [['3, 4, 5', '9, 12, 15'], ['5, 12, 13', '10, 24, 26'], ['8, 15, 17', '16, 30, 34']], mark: 0, note: 'Multiply every side by the same number.' },
    },
    {
      kind: 'example',
      head: 'Special triangles: 45-45-90',
      body: 'A 45-45-90 triangle has two equal legs, and the hypotenuse is leg × √2. With legs 7, the hypotenuse is 7√2.',
      art: rightTriangle({ opp: '7', adj: '7', hyp: '7√2', shape: { opp: 1, adj: 1 }, title: 'Half a square', caption: 'Equal legs; the hypotenuse is √2 times a leg.' }),
    },
    {
      kind: 'example',
      head: 'Is 7, 24, 25 a right triangle?',
      body: 'Check the converse: 7² + 24² = 49 + 576 = 625, and 25² = 625. They match, so it is a right triangle.',
      formula: { tex: '7^2 + 24^2 = 625 = 25^2', note: 'Equal, so there is a right angle.', parts: [{ sym: '7^2 + 24^2', means: 'the two shorter sides squared', tone: 'accent' }, { sym: '25^2', means: 'the longest side squared', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a ladder',
      body: 'A 13-foot ladder leans on a wall with its foot 5 feet out. Sketch the right triangle: the ladder is the hypotenuse. The wall height is √(169 − 25) = 12 feet.',
      art: rightTriangle({ opp: 'wall ?', adj: '5 ft', hyp: '13 ft', shape: { opp: 12, adj: 5 }, title: 'The ladder is the hypotenuse', caption: '13² − 5² = 144, so the wall height is 12 ft.' }),
    },
    {
      kind: 'protip',
      head: 'Find the hypotenuse first',
      body: 'Before writing the formula, find the side across from the right angle. That one goes alone on the right. Adding when you should subtract is the most common slip.',
      art: flow([{ label: 'Find the right angle', color: SKY }, { label: 'The side across it is c', color: AMB }, { label: 'Missing c? Add. Missing a leg? Subtract.', color: EMR }], { title: 'Add or subtract?', horizontal: false, caption: 'Knowing c decides the operation.' }),
    },
    {
      kind: 'trap',
      head: 'The hypotenuse is never a leg',
      body: 'With hypotenuse 13 and leg 5, writing 5² + 13² = c² gives a "hypotenuse" longer than 13. The hypotenuse always stands alone on one side.',
      compare: { cols: [{ title: 'Wrong', tex: '5^2 + 13^2 = c^2', lines: ['Treated 13 as a leg'], tone: 'bad' }, { title: 'Right', tex: '5^2 + b^2 = 13^2', lines: ['13 is the hypotenuse'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: distance from (−2, 3) to (4, −5)',
      body: 'Find the change in x and the change in y, then use the distance formula.',
      steps: { steps: [{ tex: '\\Delta x = 6,\\ \\Delta y = -8', text: 'The legs of the right triangle.' }, { tex: 'd = \\sqrt{36 + 64}', text: 'Square and add.' }], answer: 'd = 10' },
    },
    {
      kind: 'summary',
      head: 'Pythagoras, wrapped up',
      body: 'a² + b² = c² with c the hypotenuse. The converse tests for a right angle. Learn the triples and the 45-45-90 and 30-60-90 ratios. The distance formula is Pythagoras on a grid.',
      table: { head: ['Triangle', 'Sides'], rows: [['3-4-5', '3, 4, 5'], ['45-45-90', 'x, x, x√2'], ['30-60-90', 'x, x√3, 2x']] },
    },
  ],

  // ---------------- GEO-9 — Right-triangle trigonometry ----------------
  'GEO-9': [
    {
      kind: 'objective',
      head: 'Angles that measure distance',
      body: 'From the angle and one side, sine, cosine and tangent find any other side. That is how surveyors measure a tree without climbing it. Today you will use SOH-CAH-TOA, including elevation and depression.',
      art: rightTriangle({ opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse', angle: 'θ', title: 'Sides named from the angle θ', caption: 'Opposite is across from θ; adjacent touches it.' }),
    },
    {
      kind: 'concept',
      head: 'SOH-CAH-TOA',
      body: 'Each ratio divides two sides. Sine is opposite over hypotenuse. Cosine is adjacent over hypotenuse. Tangent is opposite over adjacent.',
      formula: { tex: '\\sin\\theta = \\tfrac{\\text{opp}}{\\text{hyp}},\\ \\cos\\theta = \\tfrac{\\text{adj}}{\\text{hyp}},\\ \\tan\\theta = \\tfrac{\\text{opp}}{\\text{adj}}', note: 'SOH, CAH, TOA.', parts: [{ sym: '\\text{opp}', means: 'across from the angle', tone: 'accent' }, { sym: '\\text{adj}', means: 'the leg touching the angle', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Choosing the ratio',
      body: 'Circle the side you know and the side you want. Pick the ratio that uses exactly those two. Opposite and adjacent: tangent. Opposite and hypotenuse: sine.',
      table: { head: ['Know and want', 'Use'], rows: [['opposite & hypotenuse', 'sin'], ['adjacent & hypotenuse', 'cos'], ['opposite & adjacent', 'tan']] },
    },
    {
      kind: 'concept',
      head: 'Inverse trig finds the angle',
      body: 'When you know two sides and want the angle, use the inverse: θ = sin⁻¹(opp/hyp), and likewise for cosine and tangent.',
      formula: { tex: '\\theta = \\tan^{-1}\\!\\left(\\tfrac{\\text{opp}}{\\text{adj}}\\right)', note: 'The inverse undoes the ratio.', parts: [{ sym: '\\tan^{-1}', means: 'the angle whose tangent is this ratio', tone: 'accent' }, { sym: '\\theta', means: 'the angle you are finding', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'A side: angle 35°, hypotenuse 20, find opposite',
      body: 'Opposite and hypotenuse means sine.\nopp = 20 sin 35°.\nThat is about 11.5.',
      steps: { steps: [{ tex: '\\sin 35^\\circ = \\frac{x}{20}', text: 'SOH with the sides you have.' }, { tex: 'x = 20 \\sin 35^\\circ \\approx 11.5', text: 'Multiply both sides by 20.' }], answer: 'x \\approx 11.5' },
    },
    {
      kind: 'example',
      head: 'An angle: opposite 8, adjacent 15',
      body: 'Opposite and adjacent means tangent.\ntan θ = 8/15.\nθ = tan⁻¹(8/15) ≈ 28.1°.',
      steps: { steps: [{ tex: '\\tan\\theta = \\frac{8}{15}', text: 'TOA: opposite over adjacent.' }, { tex: '\\theta = \\tan^{-1}(0.533)', text: 'Use the inverse.' }], answer: '\\theta \\approx 28.1^\\circ' },
    },
    {
      kind: 'example',
      head: 'Angle of elevation: a 50 ft tree',
      body: 'You stand 40 ft from a tree and look up to its top. tan θ = 50/40 = 1.25, so the angle of elevation is about 51.3°.',
      art: rightTriangle({ opp: '50 ft', adj: '40 ft', angle: 'θ', shape: { opp: 5, adj: 4 }, title: 'Looking up: elevation', caption: 'The angle is measured up from the ground.' }),
    },
    {
      kind: 'example',
      head: 'Another way: use the other acute angle',
      body: 'In a right triangle the two acute angles add to 90°. If one is 35°, the other is 55°. Then the side opposite 35° is adjacent to 55°, so 20 cos 55° gives the same 11.5.',
      formula: { tex: '20 \\sin 35^\\circ = 20 \\cos 55^\\circ', note: 'Sine of an angle is cosine of its complement.', parts: [{ sym: '35^\\circ', means: 'one acute angle', tone: 'accent' }, { sym: '55^\\circ', means: 'its complement', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: angle of depression',
      body: 'From a 60 m cliff you see a boat at a 25° angle of depression. Sketch it: the depression angle from the horizontal equals the elevation angle from the boat. Distance = 60 ÷ tan 25° ≈ 129 m.',
      art: rightTriangle({ opp: '60 m', adj: 'distance ?', angle: '25°', shape: { opp: 2, adj: 4.3 }, title: 'Depression from the top = elevation from the boat', caption: 'Alternate interior angles make the two equal.' }),
    },
    {
      kind: 'example',
      head: 'Cosine: adjacent from hypotenuse',
      body: 'A 10 m ramp rises at 12°. How far along the ground does it reach? Adjacent and hypotenuse means cosine: 10 cos 12° ≈ 9.78 m.',
      table: { head: ['Know', 'Want', 'Ratio'], rows: [['hyp = 10', 'adjacent', 'cos'], ['angle = 12°', '10 cos 12°', '≈ 9.78 m']], mark: 1 },
    },
    {
      kind: 'protip',
      head: 'Check calculator mode',
      body: 'Your calculator must be in DEGREE mode for these problems. In radian mode, sin 30 gives −0.988 instead of 0.5 — a quick test that catches it.',
      formula: { tex: '\\sin 30^\\circ = 0.5', note: 'If you get anything else, switch to degrees.', parts: [{ sym: '30^\\circ', means: 'degrees, not radians', tone: 'accent' }, { sym: '0.5', means: 'the check value', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Adjacent is not the hypotenuse',
      body: 'Both touch the angle, but the hypotenuse is the long side across from the right angle. Adjacent is the other side touching the angle.',
      compare: { cols: [{ title: 'Adjacent', lines: ['Touches the angle', 'Is a leg'], tone: 'accent' }, { title: 'Hypotenuse', lines: ['Touches the angle too', 'Across from the right angle'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: two angles of elevation',
      body: 'From 100 m away the top of a tower is at 30° elevation. How tall is the tower? Then: from how far away is it at 45°?',
      steps: { steps: [{ tex: 'h = 100 \\tan 30^\\circ \\approx 57.7', text: 'TOA from 100 m.' }, { tex: 'd = \\frac{57.7}{\\tan 45^\\circ} = 57.7', text: 'At 45°, distance equals height.' }], answer: 'h \\approx 57.7 \\text{ m}' },
    },
    {
      kind: 'summary',
      head: 'Right-triangle trig, wrapped up',
      body: 'Name opposite, adjacent and hypotenuse from the angle. SOH-CAH-TOA picks the ratio; inverse trig finds an angle. Elevation is measured up from horizontal, depression down — and they are equal.',
      table: { head: ['Ratio', 'Sides'], rows: [['sin', 'opp / hyp'], ['cos', 'adj / hyp'], ['tan', 'opp / adj']] },
    },
  ],

  // ---------------- GEO-10 — Quadrilaterals and polygons ----------------
  'GEO-10': [
    {
      kind: 'objective',
      head: 'Angles of any polygon',
      body: 'A hexagon\'s angles add to 720°, so each angle of a regular hexagon is 120°. Today you will sort the special quadrilaterals and find interior and exterior angles of any polygon.',
      art: polygonFig(6, { inside: '720° in all', interior: '120° each', title: 'A regular hexagon', caption: 'Six equal angles share 720°.' }),
    },
    {
      kind: 'concept',
      head: 'Interior angle sum',
      body: 'Any polygon can be cut into triangles from one corner. An n-sided polygon makes n − 2 triangles, each worth 180°.',
      formula: { tex: 'S = (n - 2) \\times 180^\\circ', note: 'Triangles inside, times 180.', parts: [{ sym: 'n', means: 'the number of sides', tone: 'accent' }, { sym: 'n - 2', means: 'triangles you can cut it into', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Exterior angles add to 360°',
      body: 'Walk around any convex polygon and you turn one full circle. So the exterior angles always add to 360°, whatever the number of sides.',
      formula: { tex: '\\text{each exterior} = \\frac{360^\\circ}{n}', note: 'For a regular polygon.', parts: [{ sym: '360^\\circ', means: 'one full turn around the shape', tone: 'accent' }, { sym: 'n', means: 'equal turns, one per corner', tone: 'ok' }] },
      art: polygonFig(5, { exterior: '72°', title: 'A regular pentagon turns 72° at each corner', caption: '5 × 72° = 360°.' }),
    },
    {
      kind: 'concept',
      head: 'The quadrilateral family',
      body: 'A parallelogram has two pairs of parallel sides. A rectangle adds right angles; a rhombus adds equal sides; a square has both. A trapezoid has exactly one pair of parallel sides.',
      art: flow([{ label: 'parallelogram: opposite sides parallel', color: SKY }, { label: 'rectangle: + 4 right angles', color: AMB }, { label: 'rhombus: + 4 equal sides', color: EMR }, { label: 'square: both', color: ROSE }], { title: 'Each adds a property', horizontal: false, caption: 'A square inherits everything above it.' }),
    },
    {
      kind: 'example',
      head: 'Angle sum of an octagon',
      body: 'An octagon has 8 sides.\nIt splits into 8 − 2 = 6 triangles.\n6 × 180° = 1,080°.',
      steps: { steps: [{ tex: 'n - 2 = 6', text: 'Triangles inside.' }, { tex: '6 \\times 180 = 1080', text: 'Each triangle is 180°.' }], answer: '1{,}080^\\circ' },
    },
    {
      kind: 'example',
      head: 'Each angle of a regular hexagon',
      body: 'The sum is (6 − 2) × 180 = 720°.\nSix equal angles share it.\n720 ÷ 6 = 120°.',
      steps: { steps: [{ tex: '(6 - 2) \\times 180 = 720', text: 'The interior sum.' }, { tex: '720 \\div 6 = 120', text: 'Share equally.' }], answer: '120^\\circ' },
    },
    {
      kind: 'example',
      head: 'Another way: use the exterior angle',
      body: 'For a regular hexagon, each exterior angle is 360 ÷ 6 = 60°. Interior and exterior make a straight line, so each interior angle is 180 − 60 = 120°. Faster!',
      table: { head: ['Step', 'Value'], rows: [['exterior', '360 ÷ 6 = 60°'], ['interior', '180 − 60 = 120°']], mark: 1, note: 'Same answer with smaller numbers.' },
    },
    {
      kind: 'example',
      head: 'How many sides? Each exterior is 24°',
      body: 'Exterior angles add to 360°. So n = 360 ÷ 24 = 15. It is a 15-sided polygon.',
      formula: { tex: 'n = \\frac{360}{24} = 15', note: 'Divide the full turn by each turn.', parts: [{ sym: '24', means: 'each exterior angle', tone: 'accent' }, { sym: '15', means: 'the number of sides', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Parallelogram angles',
      body: 'In a parallelogram, opposite angles are equal and neighbouring angles add to 180°. If one angle is 65°, the angles are 65°, 115°, 65°, 115°.',
      art: gridShapes([{ pts: [[1, 1], [6, 1], [8, 4], [3, 4]], label: '65° + 115° = 180°' }], { range: { x: [0, 9], y: [0, 5] }, title: 'A parallelogram: 65°, 115°, 65°, 115°', caption: 'Neighbouring angles add to 180°; opposite angles match.' }),
    },
    {
      kind: 'example',
      head: 'Picture it first: a stop sign',
      body: 'A stop sign is a regular octagon. Sketch it and cut it into 6 triangles from one corner: 1,080° total, so each corner is 1,080 ÷ 8 = 135°.',
      art: polygonFig(8, { inside: '1,080°', interior: '135° each', title: 'A regular octagon', caption: 'Eight equal corners of 135°.' }),
    },
    {
      kind: 'protip',
      head: 'Exterior first, then interior',
      body: 'For regular polygons, 360 ÷ n is the easiest calculation. Get the exterior angle, then subtract from 180 for the interior. Small numbers, fewer mistakes.',
      formula: { tex: '\\text{interior} = 180^\\circ - \\frac{360^\\circ}{n}', note: 'Interior and exterior form a straight line.', parts: [{ sym: '360/n', means: 'each exterior angle', tone: 'accent' }, { sym: '180 -', means: 'turns it into the interior angle', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Every square is a rectangle, not the other way',
      body: 'A square has all the properties of a rectangle, so it IS a rectangle. But a rectangle does not need equal sides, so it is not always a square.',
      compare: { cols: [{ title: 'True', lines: ['Every square is a rectangle'], tone: 'ok' }, { title: 'False', lines: ['Every rectangle is a square'], tone: 'bad' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: interior angle 156°',
      body: 'A regular polygon has interior angles of 156°. How many sides does it have?',
      steps: { steps: [{ tex: '180 - 156 = 24', text: 'Each exterior angle.' }, { tex: '360 \\div 24 = 15', text: 'Exterior angles add to 360°.' }], answer: '15 \\text{ sides}' },
    },
    {
      kind: 'summary',
      head: 'Polygons, wrapped up',
      body: 'Interior angles sum to (n − 2) × 180°. Exterior angles always sum to 360°. Square, rectangle, rhombus and parallelogram form a family; each adds properties to the one above.',
      table: { head: ['Polygon', 'Angle sum'], rows: [['triangle', '180°'], ['quadrilateral', '360°'], ['pentagon', '540°'], ['hexagon', '720°']] },
    },
  ],

  // ---------------- GEO-11 — Circles ----------------
  'GEO-11': [
    {
      kind: 'objective',
      head: 'Angles that stand on arcs',
      body: 'A central angle equals its arc, but an inscribed angle on the same arc is only half of it. An 80° arc gives a 40° inscribed angle. Today you will relate angles, arcs, chords, tangents, and sectors.',
      art: circleAnglesFig(80, { central: '80°', inscribed: '40°', arcLabel: 'arc 80°', title: 'Central 80°, inscribed 40°', caption: 'The inscribed angle is half the arc.' }),
    },
    {
      kind: 'concept',
      head: 'Central and inscribed angles',
      body: 'A central angle has its vertex at the center and equals its arc. An inscribed angle has its vertex on the circle and is HALF its arc.',
      formula: { tex: '\\text{inscribed} = \\tfrac{1}{2}\\,\\text{arc}', note: 'The central angle equals the arc.', parts: [{ sym: '\\text{inscribed}', means: 'vertex on the circle', tone: 'accent' }, { sym: '\\tfrac{1}{2}', means: 'half the intercepted arc', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Tangents meet radii at 90°',
      body: 'A tangent touches the circle at one point. The radius to that point is perpendicular to the tangent, which gives you a right triangle to work with.',
      art: tangentFig({ title: 'Radius ⟂ tangent', caption: 'That right angle is the key to most tangent problems.' }),
    },
    {
      kind: 'concept',
      head: 'Arc length and sector area',
      body: 'An angle of θ degrees takes θ/360 of the whole circle. Take that fraction of the circumference for arc length, or of the area for sector area.',
      formula: { tex: 's = \\tfrac{\\theta}{360} \\cdot 2\\pi r, \\quad A = \\tfrac{\\theta}{360} \\cdot \\pi r^2', note: 'The same fraction, two wholes.', parts: [{ sym: '\\tfrac{\\theta}{360}', means: 'the fraction of the circle', tone: 'accent' }, { sym: '2\\pi r', means: 'the whole circumference', tone: 'ok' }] },
      art: sectorFig(60, { arcLabel: 'arc 3π', radius: 'r = 9', title: 'A 60° sector is 1/6 of the circle', caption: '1/6 of 18π is 3π.' }),
    },
    {
      kind: 'example',
      head: 'Inscribed angle on a 110° arc',
      body: 'An inscribed angle is half its arc.\nHalf of 110° is 55°.\nThe inscribed angle is 55°.',
      steps: { steps: [{ tex: '\\tfrac{1}{2} \\times 110', text: 'Half the intercepted arc.' }, { tex: '= 55', text: 'Simplify.' }], answer: '55^\\circ' },
    },
    {
      kind: 'example',
      head: 'An angle in a semicircle',
      body: 'An inscribed angle that stands on a diameter intercepts a 180° arc. Half of 180° is 90°, so it is always a right angle.',
      art: circleAnglesFig(180, { inscribed: '90°', arcLabel: 'semicircle: 180°', title: 'Standing on a diameter: 90°', caption: 'Every angle in a semicircle is a right angle.' }),
    },
    {
      kind: 'example',
      head: 'Tangent length: radius 5, center 13 away',
      body: 'The radius meets the tangent at 90°, making a right triangle with hypotenuse 13. The tangent length is √(13² − 5²) = 12.',
      steps: { steps: [{ tex: 't^2 + 5^2 = 13^2', text: 'Radius ⟂ tangent gives a right triangle.' }, { tex: 't^2 = 144', text: '169 − 25.' }], answer: 't = 12' },
    },
    {
      kind: 'example',
      head: 'Another way: arc length with radians',
      body: 'Convert 60° to π/3 radians. Then arc length is just s = rθ = 9 × π/3 = 3π. Same answer as taking 1/6 of the circumference.',
      formula: { tex: 's = r\\theta = 9 \\cdot \\tfrac{\\pi}{3} = 3\\pi', note: 'θ must be in radians.', parts: [{ sym: 'r', means: 'the radius, 9', tone: 'accent' }, { sym: '\\theta', means: '60° written as π/3 radians', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a slice of pizza',
      body: 'A 12-inch pizza (radius 6) is cut into 8 equal slices. Sketch one slice: 45° of the circle. Its area is 45/360 × 36π = 4.5π ≈ 14.1 square inches.',
      art: sectorFig(45, { arcLabel: 'crust: 1.5π', radius: 'r = 6', title: 'One of eight slices: 45°', caption: 'Area 4.5π square inches; crust 1.5π inches.' }),
    },
    {
      kind: 'example',
      head: 'Two tangents from one point',
      body: 'Two tangent segments drawn from the same outside point are equal in length. If one is 3x + 2 and the other is 17, then 3x + 2 = 17 and x = 5.',
      table: { head: ['Fact', 'Use'], rows: [['tangents from one point are equal', '3x + 2 = 17'], ['solve', 'x = 5']], mark: 1 },
    },
    {
      kind: 'protip',
      head: 'Draw the radius to the tangent point',
      body: 'Whenever a tangent appears, draw the radius to the point of contact and mark the right angle. Most tangent problems become Pythagoras.',
      art: tangentFig({ radius: 'r = 5', tangent: 'tangent = ?', far: '13', title: 'Draw the radius, then Pythagoras', caption: '5² + t² = 13², so t = 12.' }),
    },
    {
      kind: 'trap',
      head: 'Inscribed is half, central is equal',
      body: 'Do not double or halve the wrong angle. The central angle equals the arc; the inscribed angle is half. A 40° inscribed angle sits on an 80° arc, not a 20° one.',
      compare: { cols: [{ title: 'Central', tex: '\\text{angle} = \\text{arc}', lines: ['Vertex at the center'], tone: 'accent' }, { title: 'Inscribed', tex: '\\text{angle} = \\tfrac{1}{2}\\,\\text{arc}', lines: ['Vertex on the circle'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: inscribed angles on the same arc',
      body: 'Two inscribed angles stand on the same arc. One is 2x + 10 and the other is 50°. Find x and the arc.',
      steps: { steps: [{ tex: '2x + 10 = 50', text: 'Inscribed angles on one arc are equal.' }, { tex: 'x = 20', text: 'Subtract 10, divide by 2.' }, { tex: '\\text{arc} = 2 \\times 50 = 100', text: 'The arc is double.' }], answer: '100^\\circ' },
    },
    {
      kind: 'summary',
      head: 'Circles, wrapped up',
      body: 'A central angle equals its arc; an inscribed angle is half. An angle in a semicircle is 90°. A radius meets a tangent at 90°, and tangents from one point are equal. Arcs and sectors are θ/360 of the circle.',
      table: { head: ['Angle', 'Relation to arc'], rows: [['central', 'equal'], ['inscribed', 'half'], ['in a semicircle', '90°']] },
    },
  ],

  // ---------------- GEO-12 — Perimeter, area and composite figures ----------------
  'GEO-12': [
    {
      kind: 'objective',
      head: 'Break it into pieces',
      body: 'An L-shaped room is just two rectangles stuck together. Find each area and add. Today you will use the standard area formulas and split or subtract to handle any shape.',
      art: composite([[80, 60], [200, 60], [200, 140], [320, 140], [320, 220], [80, 220]], { cuts: [[200, 140, 80, 140]], pieces: [{ x: 140, y: 106, label: '6 × 4 = 24' }, { x: 200, y: 186, label: '12 × 4 = 48' }], title: 'An L-shape is two rectangles', caption: '24 + 48 = 72 square units.' }),
    },
    {
      kind: 'concept',
      head: 'The area formulas',
      body: 'Rectangle: length × width. Triangle: half of base × height. Parallelogram: base × height. Trapezoid: average of the bases × height. Circle: πr².',
      table: { head: ['Shape', 'Area'], rows: [['rectangle', 'lw'], ['triangle', '½bh'], ['parallelogram', 'bh'], ['trapezoid', '½(b₁ + b₂)h'], ['circle', 'πr²']] },
    },
    {
      kind: 'concept',
      head: 'Height is always perpendicular',
      body: 'The height of a triangle or parallelogram meets the base at a right angle. A slanted side is NOT the height.',
      art: triHeight('base 12', 'height 5', { inside: '½ · 12 · 5 = 30', title: 'Height meets the base at 90°', caption: 'The slanted sides do not count as height.' }),
    },
    {
      kind: 'concept',
      head: 'Add pieces or subtract holes',
      body: 'Split a composite shape into pieces you know and add them. Or take the big shape and subtract the part that is missing. Pick whichever is fewer steps.',
      formula: { tex: 'A = A_{\\text{whole}} - A_{\\text{hole}}', note: 'Shaded regions are often whole minus hole.', parts: [{ sym: 'A_{\\text{whole}}', means: 'the outside shape', tone: 'accent' }, { sym: 'A_{\\text{hole}}', means: 'the piece cut away', tone: 'bad' }] },
    },
    {
      kind: 'example',
      head: 'A trapezoid: bases 8 and 14, height 5',
      body: 'Average the bases: (8 + 14) ÷ 2 = 11.\nMultiply by the height.\n11 × 5 = 55.',
      steps: { steps: [{ tex: '\\tfrac{1}{2}(8 + 14) = 11', text: 'Average of the bases.' }, { tex: '11 \\times 5 = 55', text: 'Times the height.' }], answer: '55' },
    },
    {
      kind: 'example',
      head: 'A shaded ring: radii 5 and 3',
      body: 'Big circle minus small circle.\n25π − 9π = 16π.\nThat is about 50.3 square units.',
      steps: { steps: [{ tex: '\\pi(5)^2 - \\pi(3)^2', text: 'Whole minus hole.' }, { tex: '25\\pi - 9\\pi = 16\\pi', text: 'Subtract.' }], answer: '16\\pi' },
    },
    {
      kind: 'example',
      head: 'Another way: the L-shape as whole minus corner',
      body: 'Instead of adding two rectangles, take the full 12 × 8 rectangle (96) and subtract the missing 6 × 4 corner (24). 96 − 24 = 72, the same area.',
      art: composite([[80, 60], [200, 60], [200, 140], [320, 140], [320, 220], [80, 220]], { ghost: [[200, 60], [320, 60], [320, 140], [200, 140]], pieces: [{ x: 260, y: 106, label: 'missing 24', color: ROSE }, { x: 160, y: 186, label: '96 − 24 = 72' }], title: 'Fill the corner, then take it away', caption: 'Whole rectangle minus the missing corner.' }),
    },
    {
      kind: 'example',
      head: 'Perimeter of the L-shape',
      body: 'Walk around the outside and add every edge: 6 + 4 + 6 + 4 + 12 + 8 = 40. The cut line inside does not count.',
      formula: { tex: 'P = 6 + 4 + 6 + 4 + 12 + 8 = 40', note: 'Only the outside edges.', parts: [{ sym: 'P', means: 'distance around the outside', tone: 'accent' }, { sym: '40', means: 'units of length, not square units', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a window',
      body: 'A window is a 4 ft by 3 ft rectangle with a half circle of diameter 4 on top. Sketch it: rectangle 12, half circle ½ · π · 2² = 2π. Total 12 + 2π ≈ 18.3 ft².',
      table: { head: ['Piece', 'Area'], rows: [['rectangle 4 × 3', '12'], ['half circle, r = 2', '2π ≈ 6.28'], ['total', '≈ 18.3 ft²']], mark: 2 },
    },
    {
      kind: 'example',
      head: 'A parallelogram: base 10, slant 6, height 5',
      body: 'Use the base and the perpendicular height, not the slanted side. Area = 10 × 5 = 50.',
      art: shapeBox('base 10', 'height 5', { wUnits: 10, hUnits: 5, inside: '10 × 5 = 50', title: 'Same area as a 10 × 5 rectangle', caption: 'Slide the triangle off one end onto the other.' }),
    },
    {
      kind: 'protip',
      head: 'Label every piece before calculating',
      body: 'Draw the cut lines, label each piece with its dimensions, and write each area inside it. Then the total is just one addition at the end.',
      art: flow([{ label: 'Draw the cut lines', color: SKY }, { label: 'Label each piece', color: AMB }, { label: 'Add or subtract the areas', color: EMR }], { title: 'Composite figures in three steps', caption: 'Missing side lengths come from the long sides.' }),
    },
    {
      kind: 'trap',
      head: 'The slant is not the height',
      body: 'For a parallelogram with base 10 and slanted side 6, the area is NOT 60. Only the perpendicular height counts.',
      compare: { cols: [{ title: 'Used the slant', tex: '10 \\times 6 = 60', lines: ['Too big'], tone: 'bad' }, { title: 'Used the height', tex: '10 \\times 5 = 50', lines: ['Perpendicular height'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a square with a circle cut out',
      body: 'A circle of radius 4 is cut from a 10 × 10 square. Find the area left, exactly and to one decimal.',
      steps: { steps: [{ tex: '100 - 16\\pi', text: 'Square minus circle.' }, { tex: '\\approx 100 - 50.3', text: '16π ≈ 50.3.' }], answer: '\\approx 49.7' },
    },
    {
      kind: 'summary',
      head: 'Area, wrapped up',
      body: 'Know lw, ½bh, bh, ½(b₁ + b₂)h and πr². Height is always perpendicular. Split composite shapes into pieces, or subtract holes from a whole. Perimeter only counts outside edges.',
      formula: { tex: 'A_{\\text{trap}} = \\tfrac{1}{2}(b_1 + b_2)h', note: 'The formula people forget most.', parts: [{ sym: 'b_1 + b_2', means: 'the two parallel sides', tone: 'accent' }, { sym: 'h', means: 'the perpendicular height', tone: 'ok' }] },
    },
  ],

  // ---------------- GEO-13 — Surface area and volume ----------------
  'GEO-13': [
    {
      kind: 'objective',
      head: 'Wrapping versus filling',
      body: 'Surface area is the wrapping paper; volume is what fits inside. A 4 × 3 × 5 box holds 60 cubes and needs 94 square units of paper. Today you will find both for prisms, cylinders, pyramids, cones and spheres.',
      art: prism('4', '3', '5', { inside: 'V = 60', layers: 5, title: 'Five layers of 12 cubes', caption: 'Base 4 × 3 = 12, stacked 5 high.' }),
    },
    {
      kind: 'concept',
      head: 'Volume: base times height',
      body: 'Prisms and cylinders are stacks of the same base, so V = Bh. Pyramids and cones are one third of their prism. A sphere is (4/3)πr³.',
      table: { head: ['Solid', 'Volume'], rows: [['prism / cylinder', 'Bh'], ['pyramid / cone', '⅓Bh'], ['sphere', '(4/3)πr³']] },
    },
    {
      kind: 'concept',
      head: 'Surface area: unfold it',
      body: 'Unfold a solid into a flat net and add the areas of all its faces. A box has three pairs of matching rectangles.',
      art: boxNet({ top: '4 × 3', bottom: '4 × 3', front: '4 × 5', back: '4 × 5', left: '3 × 5', right: '3 × 5' }, { total: '2(12 + 20 + 15) = 94', title: 'The net of a 4 × 3 × 5 box', caption: 'Three pairs of faces.' }),
    },
    {
      kind: 'concept',
      head: 'Scaling: k, k², k³',
      body: 'Scale every length by k and surface area grows by k², while volume grows by k³. Doubling the sides makes 4 times the paper and 8 times the space.',
      formula: { tex: 'L \\times k,\\quad SA \\times k^2,\\quad V \\times k^3', note: 'One k per dimension.', parts: [{ sym: 'k^2', means: 'surface area is two-dimensional', tone: 'accent' }, { sym: 'k^3', means: 'volume is three-dimensional', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'A cylinder: r = 3, h = 10',
      body: 'The base is a circle: B = π · 3² = 9π.\nStack it 10 high.\nV = 90π ≈ 282.7.',
      steps: { steps: [{ tex: 'B = \\pi(3)^2 = 9\\pi', text: 'Area of the base.' }, { tex: 'V = 9\\pi \\times 10 = 90\\pi', text: 'Times the height.' }], answer: '90\\pi' },
    },
    {
      kind: 'example',
      head: 'A cone: r = 3, h = 4',
      body: 'A cone is a third of its cylinder.\nCylinder: 9π × 4 = 36π.\nCone: 36π ÷ 3 = 12π.',
      steps: { steps: [{ tex: '\\pi(3)^2(4) = 36\\pi', text: 'The matching cylinder.' }, { tex: '\\tfrac{1}{3} \\times 36\\pi = 12\\pi', text: 'One third of it.' }], answer: '12\\pi' },
    },
    {
      kind: 'example',
      head: 'A sphere: r = 3',
      body: 'Use (4/3)πr³. 3³ = 27, and (4/3) × 27 = 36. The volume is 36π ≈ 113.1.',
      formula: { tex: 'V = \\tfrac{4}{3}\\pi(3)^3 = 36\\pi', note: 'Cube the radius first.', parts: [{ sym: 'r^3', means: '3 × 3 × 3 = 27', tone: 'accent' }, { sym: '36\\pi', means: 'four thirds of 27π', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: surface area by pairs',
      body: 'A box has three pairs of faces. Find one of each — 4 × 3, 4 × 5, 3 × 5 — add them (12 + 20 + 15 = 47), then double: 94.',
      formula: { tex: 'SA = 2(lw + lh + wh)', note: 'One of each pair, then double.', parts: [{ sym: 'lw + lh + wh', means: 'one face from each pair', tone: 'accent' }, { sym: '2(\\dots)', means: 'every face has a twin', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a fish tank',
      body: 'A tank is 50 cm × 30 cm × 40 cm. Picture the bottom: 1,500 cm². Forty layers high: 60,000 cm³, which is 60 liters.',
      art: prism('50 cm', '30 cm', '40 cm', { inside: '60,000 cm³', title: 'Bottom area times height', caption: '1,000 cm³ is 1 liter, so the tank holds 60 L.' }),
    },
    {
      kind: 'example',
      head: 'Scaling a box by 3',
      body: 'Every length of a box is tripled. Its surface area becomes 3² = 9 times as big, and its volume 3³ = 27 times as big.',
      table: { head: ['Measure', 'Factor'], rows: [['length', '× 3'], ['surface area', '× 9'], ['volume', '× 27']] },
    },
    {
      kind: 'protip',
      head: 'Units tell you which one',
      body: 'Surface area is in square units (cm²); volume is in cubic units (cm³). If the question asks how much paint, it is surface area; how much water, volume.',
      art: flow([{ label: 'Covering it? Surface area: units²', color: SKY }, { label: 'Filling it? Volume: units³', color: AMB }, { label: 'Scaled? k² or k³', color: EMR }], { title: 'Which measure?', horizontal: false, caption: 'Paint and wrapping are surface area; water and sand are volume.' }),
    },
    {
      kind: 'trap',
      head: 'Doubling sides does not double volume',
      body: 'Doubling every length makes the volume 2³ = 8 times larger, not 2. A cube of side 2 holds 8 unit cubes.',
      compare: { cols: [{ title: 'Tempting', tex: 'V \\times 2', lines: ['Treated volume like length'], tone: 'bad' }, { title: 'Correct', tex: 'V \\times 8', lines: ['Three dimensions'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a cone in a cylinder',
      body: 'A cone fits exactly inside a cylinder with r = 5 and h = 12. Find the volume of the space around the cone.',
      steps: { steps: [{ tex: 'V_{\\text{cyl}} = 300\\pi', text: 'π × 25 × 12.' }, { tex: 'V_{\\text{cone}} = 100\\pi', text: 'One third of it.' }], answer: '200\\pi' },
    },
    {
      kind: 'summary',
      head: 'Surface area and volume, wrapped up',
      body: 'Volume of a prism or cylinder is Bh; pyramids and cones are a third of that; a sphere is (4/3)πr³. Surface area adds the faces of the net. Scaling multiplies area by k² and volume by k³.',
      table: { head: ['Solid', 'Volume'], rows: [['cylinder', 'πr²h'], ['cone', '⅓πr²h'], ['sphere', '(4/3)πr³']] },
    },
  ],

  // ---------------- GEO-14 — Transformations and coordinate geometry ----------------
  'GEO-14': [
    {
      kind: 'objective',
      head: 'Slide, flip, turn, stretch',
      body: 'A translation slides a shape, a reflection flips it, a rotation turns it, and a dilation resizes it. Each has a simple rule on the grid. Today you will apply them and use slope and distance to prove facts.',
      art: gridShapes([{ pts: [[1, 1], [4, 1], [1, 3]], label: 'A' }, { pts: [[5, 4], [8, 4], [5, 6]], label: "A'" }], { range: { x: [0, 9], y: [0, 7] }, title: 'A translation: right 4, up 3', caption: 'Every point moves the same way: (x, y) → (x + 4, y + 3).' }),
    },
    {
      kind: 'concept',
      head: 'The coordinate rules',
      body: 'Each move changes coordinates in a fixed way. Learn these four and most transformation questions are one line.',
      table: { head: ['Move', 'Rule'], rows: [['reflect over x-axis', '(x, y) → (x, −y)'], ['reflect over y-axis', '(x, y) → (−x, y)'], ['rotate 90° counterclockwise', '(x, y) → (−y, x)'], ['dilate by k from origin', '(x, y) → (kx, ky)']] },
    },
    {
      kind: 'concept',
      head: 'Rigid moves keep size',
      body: 'Translations, reflections and rotations keep lengths and angles, so the image is congruent. A dilation keeps angles but scales lengths, so the image is only similar.',
      art: gridShapes([{ pts: [[-4, 1], [-1, 1], [-4, 4]], label: 'A' }, { pts: [[4, 1], [1, 1], [4, 4]], label: "A'" }], { range: { x: [-5, 5], y: [-1, 5] }, mirror: { x: 0 }, title: 'Reflect over the y-axis', caption: '(x, y) → (−x, y): same size, flipped.' }),
    },
    {
      kind: 'concept',
      head: 'Slope, midpoint, distance',
      body: 'Equal slopes mean parallel; slopes multiplying to −1 mean perpendicular. Midpoint averages the coordinates. Distance uses Pythagoras.',
      formula: { tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}, \\quad M = \\left(\\tfrac{x_1 + x_2}{2}, \\tfrac{y_1 + y_2}{2}\\right)', note: 'The tools for coordinate proofs.', parts: [{ sym: 'm', means: 'slope: parallel or perpendicular', tone: 'accent' }, { sym: 'M', means: 'midpoint: average the coordinates', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Reflect (3, −2) over the x-axis',
      body: 'Reflecting over the x-axis keeps x and flips the sign of y.\n(3, −2) becomes (3, 2).',
      steps: { steps: [{ tex: '(x, y) \\to (x, -y)', text: 'The x-axis rule.' }, { tex: '(3, -2) \\to (3, 2)', text: 'Flip the sign of y.' }], answer: '(3,\\ 2)' },
    },
    {
      kind: 'example',
      head: 'Rotate (2, 5) by 90° counterclockwise',
      body: 'The rule is (x, y) → (−y, x).\nSwap the coordinates and negate the new first one.\n(2, 5) becomes (−5, 2).',
      steps: { steps: [{ tex: '(x, y) \\to (-y, x)', text: '90° counterclockwise.' }, { tex: '(2, 5) \\to (-5, 2)', text: 'Swap, then negate the first.' }], answer: '(-5,\\ 2)' },
    },
    {
      kind: 'example',
      head: 'Dilate by 2 from the origin',
      body: 'Multiply every coordinate by 2. A triangle at (1, 1), (3, 1), (1, 2) becomes (2, 2), (6, 2), (2, 4). Sides double; angles stay the same.',
      art: gridShapes([{ pts: [[1, 1], [3, 1], [1, 2]], label: '' }, { pts: [[2, 2], [6, 2], [2, 4]], label: '×2', dash: true }], { range: { x: [0, 7], y: [0, 5] }, title: 'Dilation by 2: twice as big', caption: 'Similar, not congruent.' }),
    },
    {
      kind: 'example',
      head: 'Another way: rotate by sketching',
      body: 'Not sure of the rule? Plot (2, 5), draw a line to the origin, and turn it a quarter turn left. It lands at (−5, 2). The picture checks the formula.',
      art: gridShapes([{ pts: [[0, 0], [2, 5], [2, 0]], label: '' }, { pts: [[0, 0], [-5, 2], [0, 2]], label: '', dash: true }], { range: { x: [-6, 4], y: [-1, 6] }, title: 'A quarter turn left about the origin', caption: '(2, 5) turns to (−5, 2).' }),
    },
    {
      kind: 'example',
      head: 'Prove it is a parallelogram',
      body: 'Quadrilateral (0, 0), (4, 1), (5, 4), (1, 3). Slopes of opposite sides: 1/4 and 1/4, then 3 and 3. Both pairs are parallel, so it is a parallelogram.',
      table: { head: ['Side', 'Slope'], rows: [['(0,0) to (4,1)', '1/4'], ['(1,3) to (5,4)', '1/4'], ['(4,1) to (5,4)', '3'], ['(0,0) to (1,3)', '3']], note: 'Opposite slopes match: both pairs parallel.' },
      formula: { tex: 'm_1 = m_2 \\;\\Rightarrow\\; \\text{parallel}', note: 'Equal slopes on both pairs of opposite sides.', parts: [{ sym: 'm_1 = m_2', means: 'the two slopes are the same', tone: 'accent' }, { sym: '\\text{parallel}', means: 'so those sides never meet', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a mirror line y = x',
      body: 'Reflecting over the line y = x swaps the coordinates. Sketch the diagonal mirror: (1, 4) lands at (4, 1).',
      art: gridShapes([{ pts: [[1, 4], [2, 4], [1, 6]], label: '' }, { pts: [[4, 1], [4, 2], [6, 1]], label: '' }], { range: { x: [0, 7], y: [0, 7] }, mirror: { diag: true }, title: 'Mirror y = x: swap x and y', caption: '(x, y) → (y, x).' }),
    },
    {
      kind: 'protip',
      head: 'Test one point',
      body: 'Not sure a rule is right? Try it on one easy point, like (1, 0), and sketch where it should go. A 90° counterclockwise turn sends (1, 0) to (0, 1).',
      formula: { tex: '(1, 0) \\to (0, 1)', note: 'A quarter turn left about the origin.', parts: [{ sym: '(1, 0)', means: 'an easy test point', tone: 'accent' }, { sym: '(0, 1)', means: 'where a 90° turn sends it', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Which coordinate flips?',
      body: 'Reflecting over the x-axis changes y, not x. The point moves up or down across the x-axis. Flipping x by mistake reflects over the y-axis instead.',
      compare: { cols: [{ title: 'Over the x-axis', tex: '(x, y) \\to (x, -y)', lines: ['Moves up or down'], tone: 'accent' }, { title: 'Over the y-axis', tex: '(x, y) \\to (-x, y)', lines: ['Moves left or right'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: two moves in a row',
      body: 'Reflect (2, 3) over the y-axis, then translate the image 5 units down. Where does it end up?',
      steps: { steps: [{ tex: '(2, 3) \\to (-2, 3)', text: 'Reflect over the y-axis.' }, { tex: '(-2, 3) \\to (-2, -2)', text: 'Move 5 down.' }], answer: '(-2,\\ -2)' },
    },
    {
      kind: 'summary',
      head: 'Transformations, wrapped up',
      body: 'Translations add, reflections flip a sign or swap, rotations swap and flip, dilations multiply. Rigid moves keep shapes congruent; dilations make them similar. Slope, midpoint and distance prove facts on the grid.',
      table: { head: ['Move', 'Keeps size?'], rows: [['translation', 'yes'], ['reflection', 'yes'], ['rotation', 'yes'], ['dilation', 'no: similar']] },
    },
  ],
};
