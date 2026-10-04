import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, flow, numberLine, triangle } from '../slideArt';
import { angleFig, crossingFig, exteriorFig, parallelFig, segmentFig, twinTriangles } from './geoArt';

// Geometry slide decks, units 1-7: points and segments, angles, parallel lines,
// reasoning and proof, congruence, triangle properties, and similarity.

export const GEO_SLIDES_U01_07: SlideBank = {
  // ---------------- GEO-1 — Points, lines, planes and segments ----------------
  'GEO-1': [
    {
      kind: 'objective',
      head: 'Distances that stack',
      body: 'Bus stops A, B and C sit in a row with AB = 12 and BC = 7. The whole trip AC is 19. Today you will name the basic pieces of geometry and find lengths and midpoints along a line.',
      art: segmentFig([{ at: 0, label: 'A' }, { at: 12, label: 'B' }, { at: 19, label: 'C' }], [{ from: 0, to: 12, label: 'AB = 12' }, { from: 0, to: 19, label: 'AC = 12 + 7 = 19' }], { title: 'The parts add to the whole', caption: 'B sits between A and C, so AB + BC = AC.' }),
    },
    {
      kind: 'concept',
      head: 'Point, line, plane',
      body: 'A point is a location with no size. A line runs forever both ways. A plane is a flat surface with no edges. Ray AB starts at A and runs through B forever; segment AB stops at both ends.',
      compare: {
        cols: [
          { title: 'Line AB', tex: '\\overleftrightarrow{AB}', lines: ['Endless both ways'], tone: 'accent' },
          { title: 'Ray AB', tex: '\\overrightarrow{AB}', lines: ['Starts at A, endless past B'], tone: 'ok' },
          { title: 'Segment AB', tex: '\\overline{AB}', lines: ['Just the piece from A to B'], tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Segment addition',
      body: 'If B lies between A and C, the two short pieces add up to the long one. Distances along a straight path stack like mile markers.',
      formula: { tex: 'AB + BC = AC', note: 'Only when B is between A and C.', parts: [{ sym: 'AB,\\ BC', means: 'the two short pieces', tone: 'accent' }, { sym: 'AC', means: 'the whole segment', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Distance and midpoint on a line',
      body: 'On a number line, the distance between a and b is |b − a|. The midpoint is their average, (a + b)/2 — the point exactly halfway.',
      formula: { tex: 'd = |b - a|, \\qquad M = \\frac{a + b}{2}', note: 'Distance subtracts; midpoint averages.', parts: [{ sym: '|b - a|', means: 'how far apart, always positive', tone: 'accent' }, { sym: '\\tfrac{a + b}{2}', means: 'the halfway point', tone: 'ok' }] },
      art: numberLine(-4, 12, [{ at: -3, label: 'M = −3', color: SKY }, { at: 4, label: 'midpoint 4', color: ROSE }, { at: 11, label: 'N = 11', color: SKY }], { step: 2, span: { from: -3, to: 11, label: 'MN = 14' }, title: 'Halfway between −3 and 11', caption: '(−3 + 11) ÷ 2 = 4, and each half is 7 long.' }),
    },
    {
      kind: 'example',
      head: 'Add the pieces: AB = 12, BC = 7',
      body: 'B is between A and C, so use segment addition.\nAdd the two pieces.\nAC = 19.',
      steps: { steps: [{ tex: 'AC = AB + BC', text: 'B is between, so the parts add.' }, { tex: 'AC = 12 + 7 = 19', text: 'Substitute and add.' }], answer: 'AC = 19' },
    },
    {
      kind: 'example',
      head: 'Distance across zero: P at −3, Q at 9',
      body: 'Subtract and take the absolute value.\n9 − (−3) = 12.\nPQ = 12.',
      steps: { steps: [{ tex: 'PQ = |9 - (-3)|', text: 'Distance is the absolute difference.' }, { tex: '= |12| = 12', text: 'Subtracting a negative adds.' }], answer: 'PQ = 12' },
    },
    {
      kind: 'example',
      head: 'Find a missing piece: AC = 30, AB = 18',
      body: 'B is between A and C, so 18 + BC = 30. Subtract 18 from both sides. BC = 12.',
      art: segmentFig([{ at: 0, label: 'A' }, { at: 18, label: 'B' }, { at: 30, label: 'C' }], [{ from: 0, to: 18, label: 'AB = 18' }, { from: 18, to: 30, label: 'BC = 30 − 18 = 12', color: ROSE }], { title: 'Whole minus part', caption: 'The missing piece is what is left of the whole.' }),
    },
    {
      kind: 'example',
      head: 'Midpoint algebra: JM = 5x, MK = 3x + 8',
      body: 'A midpoint makes two equal halves, so set them equal. 5x = 3x + 8, so 2x = 8 and x = 4. Each half is 20.',
      formula: { tex: '5x = 3x + 8 \\;\\Rightarrow\\; x = 4', note: 'Equal halves give the equation.', parts: [{ sym: '5x', means: 'the length JM', tone: 'accent' }, { sym: '3x + 8', means: 'the length MK, equal to JM', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: count the distance',
      body: 'For the midpoint of −3 and 11, find the distance first: 14. Half of 14 is 7. Walk 7 from −3 and you land on 4 — the same as averaging.',
      table: { head: ['Step', 'Value'], rows: [['distance', '11 − (−3) = 14'], ['half of it', '7'], ['−3 + 7', '4']], mark: 2, note: 'Walking half the distance from one end gives the midpoint.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: trail markers',
      body: 'X, Y and Z stand in order on a straight trail. XY = 2.4 km and XZ = 6.1 km. Sketch them in order first: the gap YZ is what is left, 6.1 − 2.4 = 3.7 km.',
      art: segmentFig([{ at: 0, label: 'X' }, { at: 2.4, label: 'Y' }, { at: 6.1, label: 'Z' }], [{ from: 0, to: 2.4, label: '2.4 km' }, { from: 2.4, to: 6.1, label: 'YZ = 3.7 km', color: ROSE }], { title: 'Sketch in order, then subtract', caption: 'Drawing the order first tells you which pieces add.' }),
    },
    {
      kind: 'protip',
      head: 'Sketch the order before any equation',
      body: 'Draw the points in the order the problem names them and label every known length. Most "between" problems are just AB + BC = AC with one value missing.',
      art: flow([{ label: 'Draw the points in order', color: SKY }, { label: 'Label every known length', color: AMB }, { label: 'Write AB + BC = AC', color: EMR }], { title: 'Three moves for any segment problem', caption: 'The sketch tells you what adds to what.' }),
    },
    {
      kind: 'trap',
      head: 'A segment is not a number',
      body: 'Segment AB is a piece of the figure; plain AB is its length, a number. We say lengths are EQUAL (AB = CD) but segments are CONGRUENT.',
      compare: { cols: [{ title: 'Lengths', tex: 'AB = CD', lines: ['Numbers are equal'], tone: 'ok' }, { title: 'Segments', tex: '\\overline{AB} \\cong \\overline{CD}', lines: ['Figures are congruent'], tone: 'accent' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: AB = 2x + 1, BC = x + 5, AC = 21',
      body: 'B is between A and C. Find x, then each length.',
      steps: { steps: [{ tex: '(2x + 1) + (x + 5) = 21', text: 'Segment addition.' }, { tex: '3x + 6 = 21', text: 'Combine like terms.' }, { tex: 'x = 5', text: 'So AB = 11 and BC = 10.' }], answer: 'x = 5' },
    },
    {
      kind: 'summary',
      head: 'Points and segments, wrapped up',
      body: 'Lines are endless, rays have one end, segments have two. If B is between A and C, AB + BC = AC. On a number line, distance is |b − a| and the midpoint is the average.',
      table: { head: ['Idea', 'Rule'], rows: [['segment addition', 'AB + BC = AC'], ['distance', '|b − a|'], ['midpoint', '(a + b) ÷ 2']] },
    },
  ],

  // ---------------- GEO-2 — Angles and angle pairs ----------------
  'GEO-2': [
    {
      kind: 'objective',
      head: 'One angle tells you four',
      body: 'Two streets cross and one angle is 65°. Then the opposite angle is 65° and the neighbours are 115°. Today you will name angles and find missing ones with angle pairs.',
      art: crossingFig(65, { title: 'Opposite angles match', caption: 'Vertical angles are equal; neighbours add to 180°.' }),
    },
    {
      kind: 'concept',
      head: 'Naming and sorting angles',
      body: 'An angle is two rays sharing an endpoint, the vertex. Name it with the vertex in the middle: angle ABC turns at B. Acute is under 90°, right is 90°, obtuse is between 90° and 180°.',
      art: angleFig(130, { label: '130°: obtuse', names: ['A', 'B', 'C'], title: 'Angle ABC turns at B', caption: 'The vertex letter always goes in the middle.' }),
    },
    {
      kind: 'concept',
      head: 'Angle addition',
      body: 'If ray BD lies inside angle ABC, the two smaller angles add up to the big one. Angles at a shared vertex stack like slices of pizza.',
      formula: { tex: '\\angle ABD + \\angle DBC = \\angle ABC', note: 'The parts add to the whole.', parts: [{ sym: '\\angle ABD', means: 'the first slice', tone: 'accent' }, { sym: '\\angle ABC', means: 'the whole angle', tone: 'ok' }] },
      art: angleFig(73, { label: '25° + 48° = 73°', split: { at: 25, a: '25°', b: '48°' }, title: 'Two slices make the whole', caption: 'Ray BD splits angle ABC into two parts.' }),
    },
    {
      kind: 'concept',
      head: 'Complementary and supplementary',
      body: 'Complementary angles add to 90° — a Corner. Supplementary angles add to 180° — a Straight line. Two angles side by side on a line, a linear pair, are always supplementary.',
      compare: { cols: [{ title: 'Complementary', tex: 'a + b = 90^\\circ', lines: ['Makes a right angle'], tone: 'accent' }, { title: 'Supplementary', tex: 'a + b = 180^\\circ', lines: ['Makes a straight line'], tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'A complement: 37°',
      body: 'Complements add to 90°.\nSubtract 37 from 90.\nThe complement is 53°.',
      steps: { steps: [{ tex: 'x + 37 = 90', text: 'Complementary angles make 90°.' }, { tex: 'x = 53', text: 'Subtract 37.' }], answer: '53^\\circ' },
    },
    {
      kind: 'example',
      head: 'A linear pair: 118°',
      body: 'A linear pair makes a straight line, so the angles add to 180°.\n180 − 118 = 62.\nThe other angle is 62°.',
      steps: { steps: [{ tex: 'x + 118 = 180', text: 'Linear pairs are supplementary.' }, { tex: 'x = 62', text: 'Subtract 118.' }], answer: '62^\\circ' },
    },
    {
      kind: 'example',
      head: 'Vertical angles at a 65° crossing',
      body: 'The angle directly opposite is a vertical angle, so it is also 65°. The angle next to it forms a linear pair, so it is 180 − 65 = 115°.',
      table: { head: ['Angle', 'Relationship', 'Measure'], rows: [['opposite', 'vertical: equal', '65°'], ['neighbour', 'linear pair: adds to 180°', '115°']], note: 'One measure gives all four.' },
    },
    {
      kind: 'example',
      head: 'Algebra: 2x and x + 30 are complementary',
      body: 'Complementary means they add to 90°. So 2x + x + 30 = 90, which gives 3x = 60 and x = 20. The angles are 40° and 50°.',
      formula: { tex: '2x + (x + 30) = 90', note: 'Set the sum equal to 90°.', parts: [{ sym: '2x', means: 'the first angle', tone: 'accent' }, { sym: '90', means: 'complementary angles make a right angle', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: picture the corner',
      body: 'For the complement of 37°, picture a right angle. The 37° slice fills part of the corner; the rest of the corner is the complement, 90 − 37 = 53°. The drawing does the subtraction.',
      art: angleFig(90, { label: '37° + 53° = 90°', split: { at: 37, a: '37°', b: '53°' }, title: 'The complement fills the corner', caption: 'What is left of the 90° corner is the complement.' }),
    },
    {
      kind: 'example',
      head: 'Picture it first: a pizza slice',
      body: 'A pizza is cut through the middle by one straight cut, and a second cut makes a 40° slice on one side. Sketch the straight cut: the angle next to the slice is 180 − 40 = 140°.',
      art: crossingFig(40, { title: 'A straight cut is 180°', labels: ['40°', '140°'], caption: 'The slice and its neighbour sit on one straight line.' }),
    },
    {
      kind: 'protip',
      head: 'C for corner, S for straight',
      body: 'Complementary starts with C, like Corner: 90°. Supplementary starts with S, like Straight: 180°. That one memory trick ends the most common mix-up.',
      formula: { tex: '\\text{C} \\to 90^\\circ, \\quad \\text{S} \\to 180^\\circ', note: 'Corner and Straight.', parts: [{ sym: '\\text{C}', means: 'complementary, a corner, 90°', tone: 'accent' }, { sym: '\\text{S}', means: 'supplementary, a straight line, 180°', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Vertical angles are equal, not supplementary',
      body: 'When lines cross, the OPPOSITE angles are equal. It is the NEIGHBOURS that add to 180°. Mixing them up gives 115° when the answer is 65°.',
      compare: { cols: [{ title: 'Opposite', lines: ['Equal: 65° and 65°'], tone: 'ok' }, { title: 'Side by side', lines: ['Add to 180°: 65° and 115°'], tone: 'accent' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: vertical angles 4x − 10 and 2x + 30',
      body: 'Vertical angles are equal, so set the expressions equal. Then find the angle.',
      steps: { steps: [{ tex: '4x - 10 = 2x + 30', text: 'Vertical angles are congruent.' }, { tex: '2x = 40', text: 'Gather x on one side.' }, { tex: 'x = 20', text: 'Each angle is 70°.' }], answer: '70^\\circ' },
    },
    {
      kind: 'summary',
      head: 'Angles, wrapped up',
      body: 'Name an angle with the vertex in the middle. Parts of an angle add to the whole. Complementary is 90°, supplementary is 180°. Vertical angles are equal; neighbours add to 180°.',
      table: { head: ['Pair', 'Rule'], rows: [['complementary', 'add to 90°'], ['supplementary', 'add to 180°'], ['linear pair', 'add to 180°'], ['vertical', 'equal']] },
    },
  ],

  // ---------------- GEO-3 — Parallel lines and transversals ----------------
  'GEO-3': [
    {
      kind: 'objective',
      head: 'Only two angle sizes',
      body: 'When a line cuts across two parallel lines, eight angles appear — but only two sizes, like 68° and 112°. Today you will name the angle pairs and find any angle from one.',
      art: parallelFig(68, { title: 'Two sizes, adding to 180°', caption: 'Every acute angle is 68°; every obtuse angle is 112°.' }),
    },
    {
      kind: 'concept',
      head: 'Corresponding angles are equal',
      body: 'Corresponding angles sit in the same seat at each crossing — upper right with upper right. When the lines are parallel, they are equal.',
      formula: { tex: '\\text{corresponding angles} \\Rightarrow \\text{equal}', note: 'Same position at each crossing.', parts: [{ sym: '\\text{corresponding}', means: 'same seat in each cluster of four', tone: 'accent' }, { sym: '\\text{equal}', means: 'only when the lines are parallel', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Alternate interior angles: the Z',
      body: 'Alternate interior angles sit between the parallel lines, on opposite sides of the transversal. Trace a Z through them. They are equal.',
      art: parallelFig(55, { mode: 'alt', title: 'The Z shape: equal angles', caption: 'Between the lines, on opposite sides: 55° and 55°.' }),
    },
    {
      kind: 'concept',
      head: 'Co-interior angles: the C',
      body: 'Co-interior angles sit between the parallels on the SAME side of the transversal. Trace a C through them. They add to 180°.',
      formula: { tex: 'a + b = 180^\\circ', note: 'Same side, between the lines.', parts: [{ sym: 'a', means: 'the acute co-interior angle', tone: 'accent' }, { sym: 'b', means: 'its partner: 180° minus a', tone: 'ok' }] },
      art: parallelFig(75, { mode: 'co', title: 'The C shape: 75° + 105° = 180°', caption: 'Between the lines, on the same side.' }),
    },
    {
      kind: 'example',
      head: 'Corresponding: one angle is 68°',
      body: 'Corresponding angles on parallel lines are equal.\nSo its corresponding partner is 68°.\nNo calculation needed.',
      steps: { steps: [{ tex: '\\text{lines parallel}', text: 'Check the lines are marked parallel.' }, { tex: '68^\\circ = 68^\\circ', text: 'Corresponding angles are equal.' }], answer: '68^\\circ' },
    },
    {
      kind: 'example',
      head: 'Co-interior algebra: 3x and 2x',
      body: 'Co-interior angles are supplementary.\nSo 3x + 2x = 180, which is 5x = 180.\nx = 36, making the angles 108° and 72°.',
      steps: { steps: [{ tex: '3x + 2x = 180', text: 'Co-interior angles add to 180°.' }, { tex: '5x = 180', text: 'Combine like terms.' }], answer: 'x = 36' },
    },
    {
      kind: 'example',
      head: 'Alternate interior algebra: 5x − 10 and 3x + 30',
      body: 'Alternate interior angles are equal. So 5x − 10 = 3x + 30, giving 2x = 40 and x = 20. Each angle is 90°.',
      formula: { tex: '5x - 10 = 3x + 30 \\;\\Rightarrow\\; x = 20', note: 'Equal angles give the equation.', parts: [{ sym: '5x - 10', means: 'one alternate interior angle', tone: 'accent' }, { sym: '3x + 30', means: 'its equal partner', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: label everything x or 180 − x',
      body: 'Mark every acute angle x and every obtuse angle 180 − x. Now any question is just reading the figure. If x = 47°, every obtuse angle is 133°.',
      table: { head: ['Angle type', 'Size'], rows: [['every acute angle', 'x = 47°'], ['every obtuse angle', '180 − x = 133°']], note: 'Two labels cover all eight angles.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a ladder on scaffolding',
      body: 'A ladder leans across two parallel scaffold rungs and meets the upper rung at 63°. Sketch it: the rungs are the parallels and the ladder is the transversal. The corresponding angle on the lower rung is also 63°.',
      art: parallelFig(63, { title: 'Ladder across two rungs', caption: 'Parallel rungs make the corresponding angles equal.' }),
    },
    {
      kind: 'example',
      head: 'An obtuse partner: 55° street',
      body: 'A boulevard meets one avenue at 55°. With parallel avenues, only two sizes exist: 55° and its supplement. The obtuse angle at the other avenue is 180 − 55 = 125°.',
      formula: { tex: '180 - 55 = 125', note: 'The obtuse size is the supplement of the acute size.', parts: [{ sym: '55', means: 'the acute angle', tone: 'accent' }, { sym: '125', means: 'every obtuse angle in the figure', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Only two sizes',
      body: 'With parallel lines, every angle in the picture is one of two sizes, and they add to 180°. Decide whether the angle you want looks acute or obtuse, and you are done.',
      art: flow([{ label: 'Is it acute or obtuse?', color: SKY }, { label: 'Acute: same as the known acute', color: AMB }, { label: 'Obtuse: 180° minus it', color: EMR }], { title: 'The two-size shortcut', horizontal: false, caption: 'Works for every angle pair at once.' }),
    },
    {
      kind: 'trap',
      head: 'The rules need parallel lines',
      body: 'Every rule in this unit fails if the lines are not parallel. If there are no arrow marks and the problem does not say parallel, equal angles are something to prove, not assume.',
      compare: { cols: [{ title: 'Marked parallel', lines: ['Corresponding angles equal'], tone: 'ok' }, { title: 'Not marked', lines: ['No angle rule applies'], tone: 'bad' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: corresponding 6x + 4 and 8x − 20',
      body: 'Corresponding angles on parallel lines are equal. Find x, then the obtuse angle in the figure.',
      steps: { steps: [{ tex: '6x + 4 = 8x - 20', text: 'Corresponding angles are equal.' }, { tex: 'x = 12', text: 'The angle is 76°.' }, { tex: '180 - 76 = 104', text: 'The obtuse size.' }], answer: '104^\\circ' },
    },
    {
      kind: 'summary',
      head: 'Parallel lines, wrapped up',
      body: 'A transversal across parallel lines makes only two angle sizes that add to 180°. Corresponding and alternate angles are equal; co-interior angles add to 180°. None of it works without parallel lines.',
      table: { head: ['Pair', 'Shape', 'Rule'], rows: [['corresponding', 'F', 'equal'], ['alternate interior', 'Z', 'equal'], ['co-interior', 'C', 'add to 180°']] },
    },
  ],

  // ---------------- GEO-4 — Reasoning and proof ----------------
  'GEO-4': [
    {
      kind: 'objective',
      head: 'If, then — and what follows',
      body: '"If a figure is a square, then it is a rectangle" is true. Flip it and it is false. Today you will write related statements, break claims with counterexamples, and justify proof steps.',
      art: flow([{ label: 'Original: if square, then rectangle', color: EMR }, { label: 'Converse: if rectangle, then square', color: ROSE }, { label: 'Contrapositive: if not rectangle, then not square', color: SKY }], { title: 'One statement, three relatives', horizontal: false, caption: 'Only the contrapositive is guaranteed to match the original.' }),
    },
    {
      kind: 'concept',
      head: 'Hypothesis and conclusion',
      body: 'A conditional is an if-then sentence. The part after "if" is the hypothesis, p. The part after "then" is the conclusion, q.',
      formula: { tex: 'p \\Rightarrow q', note: 'Read "if p, then q".', parts: [{ sym: 'p', means: 'the hypothesis: what is assumed', tone: 'accent' }, { sym: 'q', means: 'the conclusion: what follows', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Converse, inverse, contrapositive',
      body: 'The converse swaps the parts. The inverse negates both. The contrapositive swaps AND negates — and it is the only one always true when the original is.',
      table: { head: ['Name', 'Form', 'Always true?'], rows: [['original', 'p → q', '—'], ['converse', 'q → p', 'no'], ['inverse', 'not p → not q', 'no'], ['contrapositive', 'not q → not p', 'yes']], mark: 3 },
    },
    {
      kind: 'concept',
      head: 'Counterexamples and proofs',
      body: 'A counterexample meets the hypothesis but breaks the conclusion. One is enough to kill a claim. A proof lists statements on the left and a reason for each on the right.',
      compare: { cols: [{ title: 'To disprove', lines: ['Find one counterexample'], tone: 'bad' }, { title: 'To prove', lines: ['Give a reason for every step'], tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Write the converse',
      body: '"If it is raining, then the ground is wet." The converse swaps the parts: "If the ground is wet, then it is raining." That is not always true — a sprinkler can wet the ground.',
      formula: { tex: 'q \\Rightarrow p', note: 'Swap hypothesis and conclusion.', parts: [{ sym: 'q', means: 'the ground is wet', tone: 'accent' }, { sym: 'p', means: 'it is raining', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Write the contrapositive',
      body: '"If an angle measures 90°, then it is a right angle." Swap and negate both parts.\n"If an angle is not a right angle, then it does not measure 90°."',
      steps: { steps: [{ tex: 'p:\\ 90^\\circ,\\quad q:\\ \\text{right angle}', text: 'Name the two parts.' }, { tex: '\\neg q \\Rightarrow \\neg p', text: 'Swap them and negate both.' }], answer: '\\text{not right} \\Rightarrow \\text{not } 90^\\circ' },
    },
    {
      kind: 'example',
      head: 'A counterexample',
      body: 'Claim: "Every quadrilateral with four equal sides is a square." A tilted rhombus has four equal sides but no right angles. One rhombus breaks the claim.',
      art: flow([{ label: 'Meets the hypothesis: 4 equal sides', color: EMR }, { label: 'Breaks the conclusion: no right angles', color: ROSE }, { label: 'So the claim is false', color: SKY }], { title: 'What a counterexample must do', caption: 'Fit the "if" part, break the "then" part.' }),
    },
    {
      kind: 'example',
      head: 'Name the property: AB = AB',
      body: 'Anything is equal to itself. In a proof that is the Reflexive Property. It often justifies a shared side between two triangles.',
      table: { head: ['Property', 'Says'], rows: [['Reflexive', 'AB = AB'], ['Symmetric', 'if AB = CD, then CD = AB'], ['Transitive', 'if AB = CD and CD = EF, then AB = EF']], mark: 0 },
    },
    {
      kind: 'example',
      head: 'Another way: test the converse with a counterexample',
      body: 'To check a converse fast, look for a counterexample to it. "If a figure is a rectangle, it is a square": a 2 × 5 rectangle is not a square. So the converse is false.',
      steps: { steps: [{ tex: 'q \\Rightarrow p', text: 'Write the converse.' }, { tex: '2 \\times 5 \\text{ rectangle}', text: 'A rectangle that is not a square.' }], answer: '\\text{converse false}' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a two-column proof',
      body: 'Given AB = CD, prove AC = BD for points A, B, C, D in order. Sketch the line: AC = AB + BC and BD = BC + CD. Add BC to both sides of AB = CD.',
      table: { head: ['Statement', 'Reason'], rows: [['AB = CD', 'Given'], ['AB + BC = BC + CD', 'Addition Property'], ['AC = BD', 'Segment Addition']], mark: 2, note: 'Every line has a reason.' },
    },
    {
      kind: 'protip',
      head: 'Work from both ends',
      body: 'Write the Given at the top and the Prove at the bottom. Then work toward the middle from both ends. The last reason is often the definition of what you are proving.',
      art: flow([{ label: 'Given at the top', color: SKY }, { label: 'Prove at the bottom', color: AMB }, { label: 'Fill the middle from both ends', color: EMR }], { title: 'Planning a proof', horizontal: false, caption: 'Knowing the destination shows the route.' }),
    },
    {
      kind: 'trap',
      head: 'The converse is often false',
      body: '"If it is a square, then it is a rectangle" is true. Its converse, "if it is a rectangle, then it is a square," is false. Never quote a rule backwards without checking.',
      compare: { cols: [{ title: 'Original', tex: '\\text{square} \\Rightarrow \\text{rectangle}', lines: ['True'], tone: 'ok' }, { title: 'Converse', tex: '\\text{rectangle} \\Rightarrow \\text{square}', lines: ['False'], tone: 'bad' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: is the inverse true?',
      body: 'Original: "If a number is divisible by 4, then it is even." Write the inverse and decide whether it is true.',
      steps: { steps: [{ tex: '\\neg p \\Rightarrow \\neg q', text: 'If not divisible by 4, then not even.' }, { tex: '6', text: '6 is not divisible by 4, but it is even.' }], answer: '\\text{inverse false}' },
    },
    {
      kind: 'summary',
      head: 'Reasoning, wrapped up',
      body: 'A conditional is p → q. The converse swaps, the inverse negates, the contrapositive does both and always matches the original. One counterexample disproves a claim. Every proof step needs a reason.',
      table: { head: ['Statement', 'Form'], rows: [['converse', 'q → p'], ['inverse', 'not p → not q'], ['contrapositive', 'not q → not p']] },
      formula: { tex: '(p \\Rightarrow q) \\equiv (\\neg q \\Rightarrow \\neg p)', note: 'A statement and its contrapositive stand or fall together.', parts: [{ sym: '\\neg', means: 'not: the negation of a statement', tone: 'accent' }, { sym: '\\equiv', means: 'always has the same truth value', tone: 'ok' }] },
    },
  ],

  // ---------------- GEO-5 — Triangle congruence ----------------
  'GEO-5': [
    {
      kind: 'objective',
      head: 'Same shape, same size',
      body: 'Two triangles with all three sides matching must be identical — that is SSS. You do not need all six parts. Today you will pick the right shortcut and finish with CPCTC.',
      art: twinTriangles({ ticks: [1, 2, 3], title: 'SSS: three pairs of sides', caption: 'Matching tick marks show which sides are equal.' }),
    },
    {
      kind: 'concept',
      head: 'Five shortcuts that work',
      body: 'SSS, SAS, ASA and AAS prove triangles congruent. HL works only for right triangles: hypotenuse and one leg. In SAS the angle must sit BETWEEN the two sides.',
      table: { head: ['Shortcut', 'You need'], rows: [['SSS', 'three sides'], ['SAS', 'two sides and the angle between'], ['ASA', 'two angles and the side between'], ['AAS', 'two angles and a side not between'], ['HL', 'right triangles: hypotenuse and leg']] },
    },
    {
      kind: 'concept',
      head: 'SAS: the angle must be included',
      body: 'For SAS, the marked angle has to be the one formed by the two marked sides. An angle elsewhere gives SSA, which does not prove anything.',
      art: twinTriangles({ ticks: [1, 0, 2], arcs: [1, 0, 0], title: 'SAS: the angle between the sides', caption: 'The arc sits where the two ticked sides meet.' }),
    },
    {
      kind: 'concept',
      head: 'CPCTC',
      body: 'Once triangles are proved congruent, every matching part is equal. "Corresponding Parts of Congruent Triangles are Congruent" — CPCTC — is the reason you write.',
      formula: { tex: '\\triangle ABC \\cong \\triangle DEF \\Rightarrow \\overline{AB} \\cong \\overline{DE}', note: 'The order of letters tells you which parts match.', parts: [{ sym: '\\triangle ABC \\cong \\triangle DEF', means: 'A matches D, B matches E, C matches F', tone: 'accent' }, { sym: '\\overline{AB} \\cong \\overline{DE}', means: 'a matching part, by CPCTC', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Three sides marked: which shortcut?',
      body: 'All three pairs of sides are marked equal. No angles are needed. The shortcut is SSS.',
      formula: { tex: '\\text{S} + \\text{S} + \\text{S} \\Rightarrow \\text{SSS}', note: 'Three sides fix the triangle.', parts: [{ sym: '\\text{S}', means: 'one pair of equal sides', tone: 'accent' }, { sym: '\\text{SSS}', means: 'enough to prove congruence', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Two angles and the side between',
      body: 'Two angles are marked equal, and the side joining them is marked equal too. The side is between the angles, so the shortcut is ASA.',
      art: twinTriangles({ ticks: [1, 0, 0], arcs: [1, 2, 0], title: 'ASA: the side between the angles', caption: 'The ticked side joins the two marked angles.' }),
    },
    {
      kind: 'example',
      head: 'Right triangles: hypotenuse and leg',
      body: 'Two right triangles have equal hypotenuses and one pair of equal legs. That is HL. It only works because both triangles have a right angle.',
      art: twinTriangles({ right: true, ticks: [1, 2, 0], title: 'HL: hypotenuse and a leg', caption: 'The square corner makes HL allowed.' }),
    },
    {
      kind: 'example',
      head: 'Another way: count what you have',
      body: 'List the marks in order around the triangle: side, angle, side. That spells SAS. If it spells SSA or AAA, there is no shortcut.',
      table: { head: ['Marks in order', 'Proves congruence?'], rows: [['S A S', 'yes: SAS'], ['A S A', 'yes: ASA'], ['S S A', 'no'], ['A A A', 'no: only similar']], note: 'Spell the order around the triangle.' },
    },
    {
      kind: 'example',
      head: 'Use CPCTC to find a length',
      body: 'Triangle ABC ≅ triangle DEF, with AB = 3x + 1 and DE = 13. AB and DE match, so 3x + 1 = 13, and x = 4.',
      steps: { steps: [{ tex: 'AB = DE', text: 'Corresponding parts are congruent.' }, { tex: '3x + 1 = 13', text: 'Set them equal.' }], answer: 'x = 4' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a kite',
      body: 'A kite ABCD has AB = AD and CB = CD. Draw the diagonal AC. It is shared, so AC = AC. Now both triangles have three equal sides: SSS.',
      steps: { steps: [{ tex: 'AB = AD,\\ CB = CD', text: 'Given sides.' }, { tex: 'AC = AC', text: 'Reflexive Property: the shared side.' }], answer: '\\text{SSS}' },
    },
    {
      kind: 'protip',
      head: 'Look for a shared side',
      body: 'When two triangles touch, the side they share is equal to itself. That free side, by the Reflexive Property, is often the missing piece of the shortcut.',
      formula: { tex: '\\overline{AC} \\cong \\overline{AC}', note: 'Reflexive Property.', parts: [{ sym: '\\overline{AC}', means: 'the side both triangles share', tone: 'accent' }, { sym: '\\cong', means: 'always congruent to itself', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'SSA and AAA do not work',
      body: 'Two sides and an angle NOT between them can make two different triangles. Three equal angles can make triangles of different sizes. Neither proves congruence.',
      compare: { cols: [{ title: 'Not a shortcut', lines: ['SSA', 'AAA'], tone: 'bad' }, { title: 'Real shortcuts', lines: ['SSS, SAS, ASA', 'AAS, HL'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: vertical angles in a bowtie',
      body: 'Segments AD and BE cross at C, with AC = DC and BC = EC. Prove the two triangles congruent.',
      steps: { steps: [{ tex: 'AC = DC,\\ BC = EC', text: 'Given sides.' }, { tex: '\\angle ACB = \\angle DCE', text: 'Vertical angles, between the sides.' }], answer: '\\text{SAS}' },
    },
    {
      kind: 'summary',
      head: 'Congruence, wrapped up',
      body: 'SSS, SAS, ASA, AAS and HL prove triangles congruent; SSA and AAA do not. In SAS the angle is between the sides. After proving, CPCTC gives every matching part.',
      table: { head: ['Shortcut', 'Key condition'], rows: [['SAS', 'angle between the sides'], ['ASA', 'side between the angles'], ['HL', 'right triangles only']] },
    },
  ],

  // ---------------- GEO-6 — Triangle properties ----------------
  'GEO-6': [
    {
      kind: 'objective',
      head: 'Rules every triangle obeys',
      body: 'Every triangle\'s angles add to 180°, and an outside angle equals the two far inside ones. Today you will use those, plus isosceles, triangle inequality and midsegment facts.',
      art: exteriorFig(55, 75, { title: 'Exterior = the two far interiors', caption: '55° + 75° = 130°.' }),
    },
    {
      kind: 'concept',
      head: 'Angle sum and exterior angle',
      body: 'The three interior angles add to 180°. An exterior angle equals the sum of the two interior angles that are not next to it.',
      formula: { tex: 'A + B + C = 180^\\circ, \\quad \\text{ext} = A + C', note: 'The exterior skips its neighbour.', parts: [{ sym: 'A + B + C', means: 'the three interior angles', tone: 'accent' }, { sym: '\\text{ext}', means: 'the outside angle at B', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Isosceles and the triangle inequality',
      body: 'In an isosceles triangle, the angles opposite the equal sides are equal. And any two sides must add to MORE than the third, or the triangle cannot close.',
      art: triangle({ A: 'b', B: 'b', C: '40°', shape: [[110, 210], [290, 210], [200, 60]], a: 'equal', b: 'equal', title: 'Equal sides, equal base angles', caption: 'Base angles: (180 − 40) ÷ 2 = 70° each.' }),
    },
    {
      kind: 'concept',
      head: 'The midsegment',
      body: 'A segment joining the midpoints of two sides is parallel to the third side and exactly half as long.',
      formula: { tex: '\\text{midsegment} = \\tfrac{1}{2}\\,\\text{third side}', note: 'Parallel to it, too.', parts: [{ sym: '\\text{midsegment}', means: 'joins two midpoints', tone: 'accent' }, { sym: '\\tfrac{1}{2}', means: 'half the side it is parallel to', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Third angle: 48° and 67°',
      body: 'The angles add to 180°.\nAdd the two known angles: 115°.\nThe third angle is 65°.',
      art: triangle({ A: '48°', B: '67°', C: '65°', title: '48° + 67° + 65° = 180°', caption: 'Whatever the shape, the three angles total 180°.' }),
      steps: { steps: [{ tex: '48 + 67 = 115', text: 'The two known angles.' }, { tex: '180 - 115 = 65', text: 'What is left.' }], answer: '65^\\circ' },
    },
    {
      kind: 'example',
      head: 'Exterior angle: 130° with one far angle 55°',
      body: 'The exterior angle equals the two far interior angles.\nSo 130 = 55 + x.\nThe other far angle is 75°.',
      steps: { steps: [{ tex: '130 = 55 + x', text: 'Exterior angle theorem.' }, { tex: 'x = 75', text: 'Subtract 55.' }], answer: '75^\\circ' },
    },
    {
      kind: 'example',
      head: 'Can 4, 6 and 11 make a triangle?',
      body: 'Check the two shortest sides: 4 + 6 = 10. That is LESS than 11, so the sides cannot meet. No triangle.',
      formula: { tex: '4 + 6 = 10 < 11', note: 'The two short sides must add to more than the long one.', parts: [{ sym: '4 + 6', means: 'the two shortest sides', tone: 'accent' }, { sym: '< 11', means: 'too short to reach: no triangle', tone: 'bad' }] },
    },
    {
      kind: 'example',
      head: 'Another way: the exterior angle by the straight line',
      body: 'Skip the theorem. The angle beside the 130° exterior is 180 − 130 = 50°. Then 180 − 55 − 50 = 75°. Same answer, using only the angle sum.',
      table: { head: ['Step', 'Value'], rows: [['inside neighbour', '180 − 130 = 50°'], ['third angle', '180 − 55 − 50 = 75°']], mark: 1, note: 'The theorem is a shortcut for these two steps.' },
    },
    {
      kind: 'example',
      head: 'Midsegment: third side 18',
      body: 'A midsegment joins the midpoints of two sides. It is parallel to the third side and half as long. Half of 18 is 9.',
      formula: { tex: '\\tfrac{1}{2} \\times 18 = 9', note: 'Half the side it runs parallel to.', parts: [{ sym: '18', means: 'the third side of the triangle', tone: 'accent' }, { sym: '9', means: 'the midsegment', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: an isosceles roof',
      body: 'A roof is an isosceles triangle with a 40° peak. Sketch it with equal sloping sides. The two base angles are equal: (180 − 40) ÷ 2 = 70° each.',
      steps: { steps: [{ tex: '2b + 40 = 180', text: 'Two equal base angles plus the peak.' }, { tex: '2b = 140', text: 'Subtract 40.' }], answer: 'b = 70^\\circ' },
    },
    {
      kind: 'protip',
      head: 'Check the two smallest sides',
      body: 'For the triangle inequality, you only need one check: do the two shortest sides add to more than the longest? If yes, all the other checks pass automatically.',
      art: flow([{ label: 'Find the longest side', color: SKY }, { label: 'Add the other two', color: AMB }, { label: 'Bigger than the longest? Triangle!', color: EMR }], { title: 'One check is enough', caption: 'The other two comparisons always pass.' }),
    },
    {
      kind: 'trap',
      head: 'The exterior angle skips its neighbour',
      body: 'An exterior angle equals the two FAR interior angles. The interior angle right beside it is its supplement. Adding the wrong pair gives the wrong answer.',
      compare: { cols: [{ title: 'Wrong pair', lines: ['Uses the neighbouring angle'], tone: 'bad' }, { title: 'Right pair', lines: ['Uses the two far angles'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: possible third sides',
      body: 'Two sides of a triangle are 5 and 9. What range of lengths can the third side have?',
      steps: { steps: [{ tex: '9 - 5 = 4', text: 'It must be longer than the difference.' }, { tex: '9 + 5 = 14', text: 'And shorter than the sum.' }], answer: '4 < x < 14' },
    },
    {
      kind: 'summary',
      head: 'Triangle properties, wrapped up',
      body: 'Angles add to 180°; an exterior angle equals the two far interior angles. Isosceles base angles are equal. Two sides must add to more than the third. A midsegment is half the parallel side.',
      table: { head: ['Fact', 'Rule'], rows: [['angle sum', '180°'], ['exterior angle', 'sum of the far angles'], ['triangle inequality', 'a + b > c'], ['midsegment', 'half the third side']] },
    },
  ],

  // ---------------- GEO-7 — Similarity and proportion ----------------
  'GEO-7': [
    {
      kind: 'objective',
      head: 'Same shape, different size',
      body: 'Two triangles with the same angles are similar: one is a scaled copy of the other. If the scale factor is 1.5, every side is 1.5 times as long. Today you will prove similarity and find missing sides.',
      art: twinTriangles({ scale: 1.5, arcs: [1, 2, 0], sides: ['4', '', ''], sides2: ['6', '', ''], title: 'AA: two matching angles', caption: 'Same angles, sides scaled by 1.5.' }),
    },
    {
      kind: 'concept',
      head: 'Three ways to prove similarity',
      body: 'AA: two pairs of equal angles. SSS similarity: all three side ratios equal. SAS similarity: two side ratios equal and the angle between them equal.',
      compare: {
        cols: [
          { title: 'AA test', lines: ['Two equal angles'], tone: 'accent' },
          { title: 'SSS ~', lines: ['All side ratios equal'], tone: 'ok' },
          { title: 'SAS ~', lines: ['Two ratios, included angle'], tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'The scale factor',
      body: 'The scale factor is a new side divided by its matching old side. Every pair of matching sides has the same ratio.',
      formula: { tex: 'k = \\frac{\\text{new side}}{\\text{matching old side}}', note: 'Big over small enlarges; small over big shrinks.', parts: [{ sym: 'k', means: 'the scale factor', tone: 'accent' }, { sym: '\\text{matching}', means: 'sides in the same position', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Set up one proportion',
      body: 'To find a missing side, write one proportion with matching sides in the same positions. Then cross-multiply.',
      formula: { tex: '\\frac{6}{4} = \\frac{x}{10} \\;\\Rightarrow\\; x = 15', note: 'Big over small on both sides.', parts: [{ sym: '6/4', means: 'a known pair of matching sides', tone: 'accent' }, { sym: 'x/10', means: 'the unknown and its partner', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Scale factor: sides 4 and 6',
      body: 'Matching sides are 4 and 6.\nDivide the new by the old.\nThe scale factor is 1.5.',
      steps: { steps: [{ tex: 'k = \\frac{6}{4}', text: 'New side over old side.' }, { tex: 'k = 1.5', text: 'Simplify.' }], answer: 'k = 1.5' },
    },
    {
      kind: 'example',
      head: 'Find a missing side',
      body: 'The small triangle has a side of 10 matching the unknown x. With scale factor 1.5, multiply: x = 15.\nOr set up 6/4 = x/10 and cross-multiply.',
      art: twinTriangles({ scale: 1.5, sides: ['10', '', ''], sides2: ['x', '', ''], title: 'Scale the matching side by 1.5', caption: 'The side of 10 grows to 15 in the bigger triangle.' }),
      steps: { steps: [{ tex: '\\frac{6}{4} = \\frac{x}{10}', text: 'Matching sides in matching positions.' }, { tex: '4x = 60', text: 'Cross-multiply.' }], answer: 'x = 15' },
    },
    {
      kind: 'example',
      head: 'Prove it: AA',
      body: 'Two triangles each have a 40° angle and a 75° angle. Two pairs of equal angles is enough: the triangles are similar by AA. (The third angles are 65° in both.)',
      art: twinTriangles({ scale: 1.3, arcs: [1, 2, 0], title: 'Two equal angles: AA similarity', caption: 'The third angles must match too.' }),
    },
    {
      kind: 'example',
      head: 'Another way: use the scale factor directly',
      body: 'Instead of a proportion, find k once: 6 ÷ 4 = 1.5. Then every big side is 1.5 times its small partner, so 10 becomes 15 and 8 becomes 12.',
      table: { head: ['Small side', '× 1.5', 'Big side'], rows: [['4', '× 1.5', '6'], ['8', '× 1.5', '12'], ['10', '× 1.5', '15']], note: 'One scale factor works for every pair.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a tree\'s shadow',
      body: 'A 6 ft person casts a 4 ft shadow while a tree casts a 20 ft shadow. Sketch two triangles: the sun makes the angles equal (AA). So 6/4 = h/20, and h = 30 ft.',
      formula: { tex: '\\frac{6}{4} = \\frac{h}{20} \\;\\Rightarrow\\; h = 30', note: 'Height over shadow, both triangles.', parts: [{ sym: '6/4', means: 'the person: height over shadow', tone: 'accent' }, { sym: 'h/20', means: 'the tree: height over shadow', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Similar or not? Sides 3, 4, 5 and 6, 8, 11',
      body: 'Check every ratio: 6/3 = 2, 8/4 = 2, 11/5 = 2.2. The ratios are not all equal, so the triangles are not similar.',
      table: { head: ['Pair', 'Ratio'], rows: [['6 / 3', '2'], ['8 / 4', '2'], ['11 / 5', '2.2']], mark: 2, note: 'One ratio is off, so no SSS similarity.' },
    },
    {
      kind: 'protip',
      head: 'Match by angle, not by position on the page',
      body: 'Triangles may be flipped or turned. Match sides by the angles they sit across from, not by where they appear. The similarity statement order tells you the matches.',
      formula: { tex: '\\triangle ABC \\sim \\triangle DEF', note: 'A matches D, B matches E, C matches F.', parts: [{ sym: '\\sim', means: 'is similar to', tone: 'accent' }, { sym: '\\text{letter order}', means: 'tells you which parts match', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Keep the proportion consistent',
      body: 'Big over small on one side means big over small on the other. Writing 6/4 = 10/x flips one ratio and gives x ≈ 6.7 instead of 15.',
      compare: { cols: [{ title: 'Flipped', tex: '\\frac{6}{4} = \\frac{10}{x}', lines: ['Mixes big/small with small/big'], tone: 'bad' }, { title: 'Consistent', tex: '\\frac{6}{4} = \\frac{x}{10}', lines: ['Big over small, twice'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a triangle inside a triangle',
      body: 'A line parallel to one side cuts a triangle, making a small triangle with sides 3 and 5 inside a big one whose matching side is 12 for the 3. Find the big side matching 5.',
      steps: { steps: [{ tex: 'k = \\frac{12}{3} = 4', text: 'Parallel line gives AA similarity.' }, { tex: '5 \\times 4 = 20', text: 'Scale the matching side.' }], answer: '20' },
    },
    {
      kind: 'summary',
      head: 'Similarity, wrapped up',
      body: 'Similar triangles have equal angles and proportional sides. Prove it with AA, SSS similarity or SAS similarity. Find k as new over old, and solve one consistent proportion.',
      table: { head: ['Test', 'Needs'], rows: [['AA', 'two equal angles'], ['SSS ~', 'all side ratios equal'], ['SAS ~', 'two ratios and the included angle']] },
    },
  ],
};
