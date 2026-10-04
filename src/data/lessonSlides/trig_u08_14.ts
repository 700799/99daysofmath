import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, VIO, flow, funcGraph, rightTriangle, triangle, unitCircle } from '../slideArt';
import { qcos, qsin, quarterTicks } from './trig_u01_07';

// Trigonometry slide decks, units 8-14: shifted graphs, tangent and the
// reciprocal functions, inverse trig, identities, sum and double-angle
// formulas, solving equations, and the Laws of Sines and Cosines.

const qtan = (u: number) => Math.tan((u * Math.PI) / 2);

export const TRIG_SLIDES_U08_14: SlideBank = {
  // ---------------- TRIG-8 — Transformations of trig graphs ----------------
  'TRIG-8': [
    {
      kind: 'objective',
      head: 'Slide the wave anywhere',
      body: 'y = sin(x − π/2) is the sine wave slid π/2 to the right. Shifts left, right, up and down follow simple rules. Today you will apply them and write an equation from a graph.',
      art: funcGraph([{ f: (u) => qsin(u - 1), label: 'y = sin(x − π/2)', color: ROSE }, { f: qsin, label: 'y = sin x', color: AMB, dash: '6 4' }], { range: { x: [0, 4], y: [-1.5, 1.5] }, xTickText: quarterTicks, title: 'Shifted π/2 to the right', caption: 'Every point slides the same distance.' }),
    },
    {
      kind: 'concept',
      head: 'The full form',
      body: 'In y = A sin(B(x − C)) + D, the C slides the wave horizontally (the phase shift) and D slides it vertically.',
      formula: { tex: 'y = A\\sin\\big(B(x - C)\\big) + D', note: 'C right, D up.', parts: [{ sym: 'C', means: 'phase shift: right if positive', tone: 'accent' }, { sym: 'D', means: 'vertical shift: the midline', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The sign inside flips',
      body: 'x − π/2 shifts RIGHT, and x + π/2 shifts LEFT. Ask: what x makes the inside zero? That is where the cycle now starts.',
      compare: { cols: [{ title: 'Minus inside', tex: '\\sin(x - \\tfrac{\\pi}{2})', lines: ['Right π/2'], tone: 'accent' }, { title: 'Plus inside', tex: '\\sin(x + \\tfrac{\\pi}{2})', lines: ['Left π/2'], tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Factor out B first',
      body: 'For sin(2x − π), factor the 2: sin(2(x − π/2)). The shift is π/2, not π, because B squeezes the shift too.',
      formula: { tex: '\\sin(2x - \\pi) = \\sin\\big(2(x - \\tfrac{\\pi}{2})\\big)', note: 'Shift = π ÷ 2.', parts: [{ sym: '2', means: 'B, factored out of the inside', tone: 'accent' }, { sym: '\\tfrac{\\pi}{2}', means: 'the true phase shift', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Describe y = 3 cos(x + π) − 1',
      body: 'Amplitude 3, period 2π.\nx + π means a shift π to the left.\n−1 lowers the midline to y = −1.',
      steps: { steps: [{ tex: 'A = 3,\\ B = 1', text: 'Amplitude 3, period 2π.' }, { tex: 'C = -\\pi,\\ D = -1', text: 'Left π, down 1.' }], answer: '\\text{left } \\pi,\\ \\text{down } 1' },
    },
    {
      kind: 'example',
      head: 'Phase shift of sin(2x − π)',
      body: 'Factor B = 2 out of the inside.\nsin(2(x − π/2)).\nThe shift is π/2 to the right.',
      steps: { steps: [{ tex: '2x - \\pi = 2(x - \\tfrac{\\pi}{2})', text: 'Factor out the 2.' }, { tex: 'C = \\tfrac{\\pi}{2}', text: 'Read the shift.' }], answer: '\\tfrac{\\pi}{2} \\text{ right}' },
    },
    {
      kind: 'example',
      head: 'Up and down: y = 2 sin x + 1',
      body: 'Amplitude 2 around a midline of y = 1. The wave runs from −1 to 3.',
      art: funcGraph([{ f: (u) => 2 * qsin(u) + 1, label: 'y = 2 sin x + 1', color: VIO }], { range: { x: [0, 4], y: [-1.5, 3.5] }, hAsymptote: { at: 1, label: 'midline y = 1' }, xTickText: quarterTicks, title: 'Amplitude 2, midline 1', caption: 'Max 3, min −1.' }),
    },
    {
      kind: 'example',
      head: 'Another way: cosine is a shifted sine',
      body: 'Slide the sine wave π/2 to the LEFT and it lands exactly on cosine. So cos x = sin(x + π/2). Any wave can be written with either function.',
      art: funcGraph([{ f: (u) => qsin(u + 1), label: 'y = sin(x + π/2)', color: EMR }, { f: qcos, label: 'y = cos x', color: SKY, dash: '3 5' }], { range: { x: [0, 4], y: [-1.5, 1.5] }, xTickText: quarterTicks, title: 'They are the same curve', caption: 'cos x = sin(x + π/2).' }),
    },
    {
      kind: 'example',
      head: 'Write the equation from a graph',
      body: 'A cosine wave peaks at 6, bottoms at 2, and repeats every π. Midline (6 + 2)/2 = 4, amplitude (6 − 2)/2 = 2, B = 2π/π = 2. So y = 2 cos(2x) + 4.',
      table: { head: ['Feature', 'From the graph', 'Value'], rows: [['midline D', '(6 + 2) ÷ 2', '4'], ['amplitude A', '(6 − 2) ÷ 2', '2'], ['B', '2π ÷ π', '2']], note: 'y = 2 cos(2x) + 4.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: tides',
      body: 'High tide is 9 m at 3 a.m. and low tide is 1 m six hours later. Sketch it: midline 5, amplitude 4, period 12 hours, peak at t = 3. So h = 4 cos(π(t − 3)/6) + 5.',
      formula: { tex: 'h = 4\\cos\\!\\big(\\tfrac{\\pi}{6}(t - 3)\\big) + 5', note: 'Cosine starts at a peak, so shift to the first high tide.', parts: [{ sym: '\\tfrac{\\pi}{6}', means: 'B = 2π ÷ 12 hours', tone: 'accent' }, { sym: 't - 3', means: 'the peak is at 3 a.m.', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Find where the cycle starts',
      body: 'Set the inside equal to zero and solve. For sine that x is a midline crossing going up; for cosine it is a peak. Start sketching from there.',
      art: flow([{ label: 'Set the inside = 0', color: SKY }, { label: 'Solve for x: the new start', color: AMB }, { label: 'Step by period ÷ 4 from there', color: EMR }], { title: 'Sketching a shifted wave', horizontal: false, caption: 'The start point plus four quarter-steps draws one cycle.' }),
    },
    {
      kind: 'trap',
      head: 'Factor B before reading the shift',
      body: 'sin(2x − π) is NOT shifted π. Factoring gives sin(2(x − π/2)), a shift of π/2. Skipping the factoring doubles the shift.',
      compare: { cols: [{ title: 'Read directly', lines: ['Shift π: wrong'], tone: 'bad' }, { title: 'Factored', lines: ['Shift π/2: right'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: all four changes',
      body: 'Describe every transformation in y = −2 sin(3x + π) + 4.',
      steps: { steps: [{ tex: '-2:\\ \\text{amplitude } 2,\\ \\text{flipped}', text: 'A negative A reflects the wave.' }, { tex: '3x + \\pi = 3(x + \\tfrac{\\pi}{3})', text: 'Period 2π/3, left π/3.' }, { tex: '+4:\\ \\text{midline } y = 4', text: 'Vertical shift up 4.' }], answer: '\\text{flip, }A = 2,\\ \\tfrac{2\\pi}{3},\\ \\text{left }\\tfrac{\\pi}{3},\\ \\text{up } 4' },
    },
    {
      kind: 'summary',
      head: 'Transformations, wrapped up',
      body: 'In y = A sin(B(x − C)) + D: A stretches, B sets the period 2π/B, C shifts right, D shifts up. Factor B out before reading C, and remember the sign inside flips.',
      table: { head: ['Part', 'Effect'], rows: [['A', 'amplitude (negative flips)'], ['B', 'period 2π/B'], ['C', 'phase shift'], ['D', 'midline']] },
    },
  ],

  // ---------------- TRIG-9 — Tangent and the reciprocal functions ----------------
  'TRIG-9': [
    {
      kind: 'objective',
      head: 'A graph that runs off the page',
      body: 'Tangent is sine over cosine, so wherever cosine is zero, tangent blows up. Its graph has vertical asymptotes at π/2 and 3π/2. Today you will evaluate and graph tan, cot, sec and csc.',
      art: funcGraph([{ f: qtan, label: 'y = tan x', color: VIO }], { range: { x: [0, 4], y: [-4, 4] }, vAsymptotes: [{ at: 1, label: 'π/2' }, { at: 3, label: '3π/2' }], xTickText: quarterTicks, title: 'Asymptotes where cos x = 0', caption: 'Tangent repeats every π.' }),
    },
    {
      kind: 'concept',
      head: 'The six trig functions',
      body: 'Tangent is sine over cosine. The reciprocal functions flip the main three: cosecant = 1/sin, secant = 1/cos, cotangent = 1/tan.',
      table: { head: ['Function', 'Definition'], rows: [['tan x', 'sin x / cos x'], ['csc x', '1 / sin x'], ['sec x', '1 / cos x'], ['cot x', 'cos x / sin x']] },
    },
    {
      kind: 'concept',
      head: 'Asymptotes come from zeros',
      body: 'A function with a denominator is undefined where the denominator is zero. tan and sec break where cos x = 0; cot and csc break where sin x = 0.',
      formula: { tex: '\\tan x = \\frac{\\sin x}{\\cos x}', note: 'Undefined when cos x = 0.', parts: [{ sym: '\\sin x', means: 'zeros of tan', tone: 'accent' }, { sym: '\\cos x', means: 'asymptotes of tan', tone: 'bad' }] },
    },
    {
      kind: 'concept',
      head: 'The period of tangent is π',
      body: 'Tangent repeats every π, not 2π: it climbs from −∞ to ∞ between each pair of asymptotes. y = tan(Bx) has period π/B.',
      formula: { tex: '\\text{period of } \\tan(Bx) = \\frac{\\pi}{B}', note: 'Half the period of sine.', parts: [{ sym: '\\pi', means: 'tangent\'s natural period', tone: 'accent' }, { sym: 'B', means: 'squeezes the graph horizontally', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Evaluate sec 60°',
      body: 'sec is 1 over cos.\ncos 60° = 1/2.\nsec 60° = 1 ÷ 1/2 = 2.',
      steps: { steps: [{ tex: '\\sec 60^\\circ = \\frac{1}{\\cos 60^\\circ}', text: 'Use the definition.' }, { tex: '= \\frac{1}{1/2} = 2', text: 'Flip the fraction.' }], answer: '2' },
    },
    {
      kind: 'example',
      head: 'Evaluate cot(π/6)',
      body: 'cot is cos over sin.\ncos(π/6) = √3/2 and sin(π/6) = 1/2.\ncot(π/6) = √3.',
      steps: { steps: [{ tex: '\\cot\\tfrac{\\pi}{6} = \\frac{\\sqrt3/2}{1/2}', text: 'cos over sin.' }, { tex: '= \\sqrt3', text: 'The halves cancel.' }], answer: '\\sqrt3' },
    },
    {
      kind: 'example',
      head: 'The cosecant graph',
      body: 'csc x = 1/sin x. Where sin x is 1, csc is 1; where sin x shrinks toward 0, csc shoots off. Its asymptotes sit at the zeros of sine: 0, π, 2π.',
      art: funcGraph([{ f: (u) => 1 / qsin(u), label: 'y = csc x', color: ROSE }, { f: qsin, label: 'y = sin x', color: AMB, dash: '6 4' }], { range: { x: [0, 4], y: [-4, 4] }, vAsymptotes: [{ at: 2, label: 'π' }], xTickText: quarterTicks, title: 'csc hugs sin at its peaks', caption: 'The U shapes touch the sine wave at ±1.' }),
    },
    {
      kind: 'example',
      head: 'Another way: use the unit circle',
      body: 'On the unit circle, tan θ = y/x. At 135°, the point is (−√2/2, √2/2), so tan 135° = −1. The circle gives sign and value at once.',
      art: unitCircle(135, { label: '135°', point: '(−√2/2, √2/2)', caption: 'tan = y ÷ x = −1.' }),
    },
    {
      kind: 'example',
      head: 'Where is sec x undefined?',
      body: 'sec x = 1/cos x, so it is undefined where cos x = 0: at x = π/2 + kπ for any whole number k.',
      formula: { tex: 'x = \\tfrac{\\pi}{2} + k\\pi', note: 'Every place cosine is zero.', parts: [{ sym: '\\tfrac{\\pi}{2}', means: 'the first zero of cosine', tone: 'accent' }, { sym: 'k\\pi', means: 'they repeat every π', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a lighthouse beam',
      body: 'A lighthouse 1 km from a straight shore turns its beam. The lit spot on the shore is tan θ km along. Picture it: as θ nears 90°, the beam runs parallel to the shore and the spot flies off — the asymptote.',
      art: rightTriangle({ opp: 'tan θ', adj: '1 km', angle: 'θ', shape: { opp: 3, adj: 1.4 }, title: 'Spot on the shore = tan θ', caption: 'Near 90°, tan θ grows without bound.' }),
    },
    {
      kind: 'protip',
      head: 'Reciprocals keep the sign',
      body: '1/x has the same sign as x. So csc has the sign of sin, sec has the sign of cos, and cot has the sign of tan in every quadrant.',
      formula: { tex: '\\operatorname{sign}(\\csc x) = \\operatorname{sign}(\\sin x)', note: 'Flipping a number does not change its sign.', parts: [{ sym: '\\csc', means: '1 over sine', tone: 'accent' }, { sym: '\\sin', means: 'sets the sign', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'sec is 1/cos, not 1/sin',
      body: 'The pairing looks backwards: secant goes with COSINE and cosecant goes with SINE. Each pair has exactly one "co".',
      compare: { cols: [{ title: 'Mixed up', tex: '\\sec x = \\tfrac{1}{\\sin x}', lines: ['Wrong partner'], tone: 'bad' }, { title: 'Correct', tex: '\\sec x = \\tfrac{1}{\\cos x}', lines: ['One "co" per pair'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: csc θ = 2, θ in Quadrant II',
      body: 'Find sin θ by flipping the cosecant, then use the quadrant to find cos θ and tan θ.',
      steps: { steps: [{ tex: '\\sin\\theta = \\tfrac12', text: 'Flip the cosecant.' }, { tex: '\\cos\\theta = -\\tfrac{\\sqrt3}{2}', text: 'Quadrant II: cosine negative.' }, { tex: '\\tan\\theta = \\tfrac{1/2}{-\\sqrt3/2}', text: 'sin over cos.' }], answer: '\\tan\\theta = -\\tfrac{\\sqrt3}{3}' },
    },
    {
      kind: 'summary',
      head: 'Tangent and reciprocals, wrapped up',
      body: 'tan = sin/cos with period π and asymptotes where cos = 0. csc = 1/sin, sec = 1/cos, cot = cos/sin. A reciprocal keeps its partner\'s sign and blows up at its partner\'s zeros.',
      table: { head: ['Function', 'Asymptotes where'], rows: [['tan, sec', 'cos x = 0'], ['cot, csc', 'sin x = 0']] },
    },
  ],

  // ---------------- TRIG-10 — Inverse trigonometric functions ----------------
  'TRIG-10': [
    {
      kind: 'objective',
      head: 'From a value back to an angle',
      body: 'sin 30° = 1/2, so arcsin(1/2) = 30°. But 150° also has sine 1/2 — so the inverse must pick one. Today you will evaluate arcsin, arccos and arctan within their restricted ranges.',
      art: unitCircle(30, { label: '30°', point: 'y = 1/2', legs: true, caption: 'arcsin(1/2) picks the angle in Quadrant I.' }),
    },
    {
      kind: 'concept',
      head: 'Why the range is restricted',
      body: 'Sine repeats, so many angles share each value. To turn arcsin into a function, we keep only the piece from −π/2 to π/2, where sine takes each value exactly once.',
      art: funcGraph([{ f: qsin, color: AMB, dash: '6 4' }, { f: (u) => (u >= -1 && u <= 1 ? qsin(u) : NaN), label: 'kept: −π/2 to π/2', color: ROSE }], { range: { x: [-2, 4], y: [-1.5, 1.5] }, xTickText: quarterTicks, title: 'One piece of sine, used once', caption: 'On this piece every value appears exactly once.' }),
    },
    {
      kind: 'concept',
      head: 'The three ranges',
      body: 'Each inverse returns an angle only from its own range. arccos uses 0 to π so it covers both positive and negative cosines.',
      table: { head: ['Function', 'Range (answers)'], rows: [['arcsin', '−π/2 to π/2'], ['arccos', '0 to π'], ['arctan', 'between −π/2 and π/2']] },
    },
    {
      kind: 'concept',
      head: 'Inverse undoes, inside the range',
      body: 'arcsin(sin(x)) = x only when x is already in arcsin\'s range. Outside it, the answer is the matching angle inside the range.',
      formula: { tex: '\\sin^{-1}(\\sin x) = x \\quad \\text{for } -\\tfrac{\\pi}{2} \\le x \\le \\tfrac{\\pi}{2}', note: 'Check the range before cancelling.', parts: [{ sym: '\\sin^{-1}', means: 'arcsin: returns an angle', tone: 'accent' }, { sym: '-\\tfrac{\\pi}{2} \\le x \\le \\tfrac{\\pi}{2}', means: 'where the cancelling is allowed', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'arcsin(√3/2)',
      body: 'Which angle from −π/2 to π/2 has sine √3/2?\nThat is π/3 (60°).\narcsin(√3/2) = π/3.',
      steps: { steps: [{ tex: '\\sin\\tfrac{\\pi}{3} = \\tfrac{\\sqrt3}{2}', text: 'A known value.' }, { tex: '\\tfrac{\\pi}{3} \\in [-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]', text: 'It is in the range.' }], answer: '\\tfrac{\\pi}{3}' },
    },
    {
      kind: 'example',
      head: 'arccos(−1/2)',
      body: 'arccos answers are from 0 to π.\nCosine is negative there in Quadrant II.\nThe angle with reference π/3 in Quadrant II is 2π/3.',
      steps: { steps: [{ tex: '\\cos\\tfrac{2\\pi}{3} = -\\tfrac12', text: 'Quadrant II, reference π/3.' }, { tex: '\\tfrac{2\\pi}{3} \\in [0, \\pi]', text: 'Inside the range.' }], answer: '\\tfrac{2\\pi}{3}' },
    },
    {
      kind: 'example',
      head: 'arctan(−1)',
      body: 'arctan answers are between −π/2 and π/2. tan(−π/4) = −1, and −π/4 is in that range, so arctan(−1) = −π/4.',
      art: unitCircle(-45, { label: '−π/4', point: 'tan = −1', caption: 'A negative answer, in Quadrant IV.' }),
    },
    {
      kind: 'example',
      head: 'Another way: picture the range on the circle',
      body: 'arcsin and arctan live on the RIGHT half of the unit circle (Quadrants IV and I). arccos lives on the TOP half (Quadrants I and II). Find the point there with the right coordinate.',
      table: { head: ['Function', 'Half of the circle', 'Matches'], rows: [['arcsin', 'right half', 'y-coordinate'], ['arccos', 'top half', 'x-coordinate'], ['arctan', 'right half', 'y ÷ x']] },
    },
    {
      kind: 'example',
      head: 'A trap question: arcsin(sin 150°)',
      body: 'sin 150° = 1/2. But arcsin(1/2) = 30°, not 150°, because 150° is outside arcsin\'s range. The answer is 30°.',
      formula: { tex: '\\sin^{-1}(\\sin 150^\\circ) = \\sin^{-1}(\\tfrac12) = 30^\\circ', note: 'Inverse picks the angle in its own range.', parts: [{ sym: '\\sin 150^\\circ', means: 'evaluates to 1/2 first', tone: 'accent' }, { sym: '30^\\circ', means: 'the range\'s angle for 1/2', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a ramp angle',
      body: 'A wheelchair ramp rises 1 m over a 12 m slope. Sketch the triangle: the angle is arcsin(1/12) ≈ 4.8°. The inverse turns a ratio back into the angle.',
      art: rightTriangle({ opp: '1 m', hyp: '12 m', angle: 'θ', shape: { opp: 1, adj: 6 }, title: 'θ = arcsin(1/12)', caption: 'About 4.8°.' }),
    },
    {
      kind: 'protip',
      head: 'Always check the range last',
      body: 'Find any angle with the right value, then move it into the inverse\'s range. If your arccos answer is negative, or your arcsin answer is past π/2, it is wrong.',
      art: flow([{ label: 'Find an angle with that value', color: SKY }, { label: 'Is it in the range?', color: AMB }, { label: 'If not, use the matching angle that is', color: EMR }], { title: 'Range check', horizontal: false, caption: 'The range is part of the answer.' }),
    },
    {
      kind: 'trap',
      head: 'arccos never gives a negative angle',
      body: 'arccos(−1/2) is 2π/3, not −π/3. Arccos answers always lie between 0 and π, even for negative inputs.',
      compare: { cols: [{ title: 'Outside the range', tex: '-\\tfrac{\\pi}{3}', lines: ['Not between 0 and π'], tone: 'bad' }, { title: 'In the range', tex: '\\tfrac{2\\pi}{3}', lines: ['Quadrant II'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: cos(arcsin(3/5))',
      body: 'Let θ = arcsin(3/5), so sin θ = 3/5 with θ in Quadrant I. Draw the triangle and read off cos θ.',
      steps: { steps: [{ tex: '\\text{opp} = 3,\\ \\text{hyp} = 5', text: 'From sin θ = 3/5.' }, { tex: '\\text{adj} = 4', text: 'The 3-4-5 triangle.' }], answer: '\\cos\\theta = \\tfrac45' },
    },
    {
      kind: 'summary',
      head: 'Inverse trig, wrapped up',
      body: 'Inverse functions turn a value back into an angle, but only within a restricted range: arcsin and arctan from −π/2 to π/2, arccos from 0 to π. Always check the range.',
      formula: { tex: '\\sin^{-1}:\\,[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}],\\quad \\cos^{-1}:\\,[0, \\pi]', note: 'arctan uses the open interval (−π/2, π/2).', parts: [{ sym: '\\sin^{-1}', means: 'answers on the right half of the circle', tone: 'accent' }, { sym: '\\cos^{-1}', means: 'answers on the top half', tone: 'ok' }] },
    },
  ],

  // ---------------- TRIG-11 — Fundamental identities ----------------
  'TRIG-11': [
    {
      kind: 'objective',
      head: 'Equations true for every angle',
      body: 'sin²θ + cos²θ = 1 for every angle — it is Pythagoras on the unit circle. Identities like it let you simplify expressions and find missing values. Today you will use the main ones.',
      art: unitCircle(40, { label: 'θ', legs: true, caption: 'Legs cos θ and sin θ, hypotenuse 1: cos²θ + sin²θ = 1.' }),
    },
    {
      kind: 'concept',
      head: 'The Pythagorean identities',
      body: 'Divide sin²θ + cos²θ = 1 by cos²θ or by sin²θ to get two more. All three are the same fact in different clothes.',
      table: { head: ['Identity', 'Comes from'], rows: [['sin²θ + cos²θ = 1', 'the unit circle'], ['1 + tan²θ = sec²θ', '÷ cos²θ'], ['1 + cot²θ = csc²θ', '÷ sin²θ']] },
    },
    {
      kind: 'concept',
      head: 'Quotient and reciprocal identities',
      body: 'tan θ = sin θ / cos θ, and the reciprocals are csc = 1/sin, sec = 1/cos, cot = 1/tan. Rewriting everything in sin and cos is the universal first move.',
      formula: { tex: '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}', note: 'Everything can be written in sin and cos.', parts: [{ sym: '\\tan\\theta', means: 'sine over cosine', tone: 'accent' }, { sym: '\\cot\\theta', means: 'cosine over sine', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Find a value from another',
      body: 'If you know sin θ and the quadrant, the Pythagorean identity gives cos θ. The quadrant decides the sign of the square root.',
      formula: { tex: '\\cos\\theta = \\pm\\sqrt{1 - \\sin^2\\theta}', note: 'The quadrant picks + or −.', parts: [{ sym: '1 - \\sin^2\\theta', means: 'from sin² + cos² = 1', tone: 'accent' }, { sym: '\\pm', means: 'chosen by the quadrant', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'sin θ = 3/5, θ in Quadrant II: find cos θ',
      body: 'cos²θ = 1 − 9/25 = 16/25.\ncos θ = ±4/5.\nIn Quadrant II cosine is negative: cos θ = −4/5.',
      steps: { steps: [{ tex: '\\cos^2\\theta = 1 - \\tfrac{9}{25} = \\tfrac{16}{25}', text: 'Pythagorean identity.' }, { tex: '\\cos\\theta = -\\tfrac45', text: 'Quadrant II: negative.' }], answer: '-\\tfrac45' },
    },
    {
      kind: 'example',
      head: 'Simplify sin θ · cot θ',
      body: 'Rewrite cot θ as cos θ / sin θ.\nThe sin θ cancels.\nsin θ · cot θ = cos θ.',
      steps: { steps: [{ tex: '\\sin\\theta \\cdot \\frac{\\cos\\theta}{\\sin\\theta}', text: 'Write cot in sin and cos.' }, { tex: '= \\cos\\theta', text: 'Cancel sin θ.' }], answer: '\\cos\\theta' },
    },
    {
      kind: 'example',
      head: 'Simplify (1 − cos²θ) / sin θ',
      body: '1 − cos²θ is sin²θ by the Pythagorean identity. So the expression is sin²θ / sin θ = sin θ.',
      formula: { tex: '\\frac{1 - \\cos^2\\theta}{\\sin\\theta} = \\frac{\\sin^2\\theta}{\\sin\\theta} = \\sin\\theta', note: 'Spot 1 − cos² and replace it.', parts: [{ sym: '1 - \\cos^2\\theta', means: 'is exactly sin²θ', tone: 'accent' }, { sym: '\\sin\\theta', means: 'what is left after cancelling', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: draw the triangle',
      body: 'For sin θ = 3/5 in Quadrant II, sketch a right triangle with opposite 3 and hypotenuse 5. The adjacent side is 4 (3-4-5). In Quadrant II, x is negative: cos θ = −4/5.',
      art: rightTriangle({ opp: '3', adj: '4', hyp: '5', angle: 'θ', shape: { opp: 3, adj: 4 }, title: 'The reference triangle', caption: 'Then attach the quadrant\'s sign.' }),
    },
    {
      kind: 'example',
      head: 'Verify: sec²θ − tan²θ = 1',
      body: 'Start from 1 + tan²θ = sec²θ and subtract tan²θ from both sides. That is exactly the statement, so it is true for every θ where both sides are defined.',
      table: { head: ['Step', 'Expression'], rows: [['start', '1 + tan²θ = sec²θ'], ['subtract tan²θ', 'sec²θ − tan²θ = 1']], mark: 1 },
    },
    {
      kind: 'example',
      head: 'Picture it first: checking with a number',
      body: 'Is (sin θ + cos θ)² = 1? Picture θ = 45°: (√2/2 + √2/2)² = (√2)² = 2. Not 1, so it is NOT an identity — one counterexample settles it.',
      art: unitCircle(45, { label: '45°', point: '(√2/2, √2/2)', caption: 'At 45°, (sin + cos)² = 2, so the claim fails.' }),
    },
    {
      kind: 'protip',
      head: 'Convert to sin and cos',
      body: 'When stuck, rewrite every function in terms of sin and cos, combine fractions, and look for sin² + cos². It works on almost every simplification.',
      art: flow([{ label: 'Rewrite in sin and cos', color: SKY }, { label: 'Combine fractions', color: AMB }, { label: 'Look for sin² + cos² = 1', color: EMR }], { title: 'The universal strategy', horizontal: false, caption: 'Three steps simplify most expressions.' }),
    },
    {
      kind: 'trap',
      head: 'sin²θ is not sin(θ²)',
      body: 'sin²θ means (sin θ)², the sine squared. It is NOT the sine of θ squared. And sin(A + B) is not sin A + sin B.',
      compare: { cols: [{ title: 'Means', tex: '\\sin^2\\theta = (\\sin\\theta)^2', lines: ['Square the sine'], tone: 'ok' }, { title: 'Does not mean', tex: '\\sin(\\theta^2)', lines: ['Sine of a square'], tone: 'bad' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: tan θ = 2, θ in Quadrant III',
      body: 'Find sec θ using 1 + tan²θ = sec²θ, then cos θ.',
      steps: { steps: [{ tex: '\\sec^2\\theta = 1 + 4 = 5', text: 'Pythagorean identity.' }, { tex: '\\sec\\theta = -\\sqrt5', text: 'Quadrant III: cosine negative.' }], answer: '\\cos\\theta = -\\tfrac{1}{\\sqrt5}' },
    },
    {
      kind: 'summary',
      head: 'Identities, wrapped up',
      body: 'sin²θ + cos²θ = 1, and dividing it gives 1 + tan²θ = sec²θ and 1 + cot²θ = csc²θ. Rewrite in sin and cos to simplify; use the quadrant to choose the sign of a root.',
      formula: { tex: '\\sin^2\\theta + \\cos^2\\theta = 1', note: 'The identity everything else comes from.', parts: [{ sym: '\\sin^2\\theta', means: 'the vertical leg squared', tone: 'accent' }, { sym: '1', means: 'the radius of the unit circle, squared', tone: 'ok' }] },
    },
  ],

  // ---------------- TRIG-12 — Sum, difference and double-angle formulas ----------------
  'TRIG-12': [
    {
      kind: 'objective',
      head: 'Build new exact values',
      body: '75° is 45° + 30°, two angles you know. The sum formulas combine them: sin 75° = (√6 + √2)/4. Today you will use sum, difference and double-angle formulas.',
      art: unitCircle(75, { label: '75°', point: '45° + 30°', caption: 'An angle built from two special angles.' }),
    },
    {
      kind: 'concept',
      head: 'Sum and difference formulas',
      body: 'The sine formula keeps the sign and mixes sin and cos. The cosine formula pairs like with like and flips the sign.',
      formula: { tex: '\\begin{gathered} \\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B \\\\ \\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B \\end{gathered}', note: 'Cosine flips the sign.', parts: [{ sym: '\\pm', means: 'sine keeps the same sign', tone: 'accent' }, { sym: '\\mp', means: 'cosine uses the opposite sign', tone: 'warn' }] },
    },
    {
      kind: 'concept',
      head: 'Double-angle formulas',
      body: 'Set B = A in the sum formulas and you get the double angles. Cosine has three versions — pick the one that fits.',
      table: { head: ['Formula', 'Value'], rows: [['sin 2A', '2 sin A cos A'], ['cos 2A', 'cos²A − sin²A'], ['cos 2A', '2cos²A − 1'], ['cos 2A', '1 − 2sin²A']] },
    },
    {
      kind: 'concept',
      head: 'Why the sum is not the sum',
      body: 'sin(30° + 60°) = sin 90° = 1, but sin 30° + sin 60° ≈ 1.37. Sine does not distribute — that is why we need the formulas.',
      compare: { cols: [{ title: 'Real value', tex: '\\sin 90^\\circ = 1', lines: ['Using the formula'], tone: 'ok' }, { title: 'Wrong shortcut', tex: '\\tfrac12 + \\tfrac{\\sqrt3}{2} \\approx 1.37', lines: ['Bigger than 1: impossible'], tone: 'bad' }] },
    },
    {
      kind: 'example',
      head: 'sin 75° exactly',
      body: 'Write 75° = 45° + 30°.\nUse the sine sum formula.\nCombine over 4.',
      steps: { steps: [{ tex: '\\sin 45\\cos 30 + \\cos 45\\sin 30', text: 'Sine of a sum.' }, { tex: '\\tfrac{\\sqrt2}{2}\\cdot\\tfrac{\\sqrt3}{2} + \\tfrac{\\sqrt2}{2}\\cdot\\tfrac12', text: 'Exact values.' }, { tex: '= \\tfrac{\\sqrt6 + \\sqrt2}{4}', text: 'Multiply and combine.' }], answer: '\\tfrac{\\sqrt6 + \\sqrt2}{4}' },
    },
    {
      kind: 'example',
      head: 'cos 15° exactly',
      body: 'Write 15° = 45° − 30°.\nCosine of a difference uses a PLUS.\ncos 15° = (√6 + √2)/4.',
      steps: { steps: [{ tex: '\\cos 45\\cos 30 + \\sin 45\\sin 30', text: 'Difference: the sign flips to +.' }, { tex: '= \\tfrac{\\sqrt6}{4} + \\tfrac{\\sqrt2}{4}', text: 'Exact values.' }], answer: '\\tfrac{\\sqrt6 + \\sqrt2}{4}' },
    },
    {
      kind: 'example',
      head: 'A double angle: sin θ = 3/5 in Quadrant I',
      body: 'First cos θ = 4/5 (3-4-5 triangle). Then sin 2θ = 2 · 3/5 · 4/5 = 24/25.',
      art: rightTriangle({ opp: '3', adj: '4', hyp: '5', angle: 'θ', shape: { opp: 3, adj: 4 }, title: 'sin θ = 3/5, cos θ = 4/5', caption: 'sin 2θ = 2 · (3/5) · (4/5) = 24/25.' }),
    },
    {
      kind: 'example',
      head: 'Another way: cos 15° is sin 75°',
      body: 'Complementary angles swap sine and cosine: cos 15° = sin(90° − 15°) = sin 75°. We already found sin 75° = (√6 + √2)/4, so no new work needed.',
      formula: { tex: '\\cos 15^\\circ = \\sin 75^\\circ', note: '15° and 75° add to 90°.', parts: [{ sym: '15^\\circ', means: 'one angle', tone: 'accent' }, { sym: '75^\\circ', means: 'its complement', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Rewrite with a double angle',
      body: 'Simplify 2 sin x cos x. It matches the double-angle formula exactly, so it equals sin 2x.',
      table: { head: ['Expression', 'Rewrite'], rows: [['2 sin x cos x', 'sin 2x'], ['cos²x − sin²x', 'cos 2x'], ['1 − 2sin²x', 'cos 2x']], mark: 0 },
    },
    {
      kind: 'example',
      head: 'Picture it first: a roof pitch',
      body: 'A roof rises at angle θ with tan θ = 3/4, and a second section is pitched at 2θ. Sketch the 3-4-5 triangle: sin θ = 3/5, cos θ = 4/5, so cos 2θ = 16/25 − 9/25 = 7/25.',
      art: unitCircle(36.87, { label: 'θ', legs: true, caption: 'tan θ = 3/4 puts θ about 36.9°.' }),
    },
    {
      kind: 'protip',
      head: 'Pick the cos 2A that matches',
      body: 'If you know only sin A, use 1 − 2sin²A. If you know only cos A, use 2cos²A − 1. That saves finding the other value.',
      formula: { tex: '\\cos 2A = 1 - 2\\sin^2 A = 2\\cos^2 A - 1', note: 'Same value, different inputs.', parts: [{ sym: '1 - 2\\sin^2 A', means: 'when you know sin A', tone: 'accent' }, { sym: '2\\cos^2 A - 1', means: 'when you know cos A', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'sin 2A is not 2 sin A',
      body: 'sin 60° = √3/2 ≈ 0.87, but 2 sin 30° = 1. Doubling the angle does not double the sine.',
      compare: { cols: [{ title: 'Wrong', tex: '\\sin 2A = 2\\sin A', lines: ['Treats sine as linear'], tone: 'bad' }, { title: 'Right', tex: '\\sin 2A = 2\\sin A\\cos A', lines: ['Needs the cosine too'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: tan 15°',
      body: 'Use tan 15° = sin 15° / cos 15°, with sin 15° = (√6 − √2)/4 and cos 15° = (√6 + √2)/4.',
      steps: { steps: [{ tex: '\\tfrac{\\sqrt6 - \\sqrt2}{\\sqrt6 + \\sqrt2}', text: 'The quarters cancel.' }, { tex: '= 2 - \\sqrt3', text: 'Rationalize the denominator.' }], answer: '2 - \\sqrt3' },
    },
    {
      kind: 'summary',
      head: 'Sum and double-angle formulas, wrapped up',
      body: 'sin(A ± B) keeps the sign; cos(A ± B) flips it. sin 2A = 2 sin A cos A, and cos 2A has three forms. Break unknown angles into 30°, 45° and 60° to get exact values.',
      table: { head: ['Angle', 'Built from'], rows: [['75°', '45° + 30°'], ['15°', '45° − 30°'], ['105°', '60° + 45°']] },
    },
  ],

  // ---------------- TRIG-13 — Solving trigonometric equations ----------------
  'TRIG-13': [
    {
      kind: 'objective',
      head: 'Where the wave hits a level',
      body: 'Solving sin x = 1/2 means finding where the sine wave crosses the line y = 1/2. In one turn that happens twice: at π/6 and 5π/6. Today you will solve trig equations on [0, 2π) and write all solutions.',
      art: funcGraph([{ f: qsin, label: 'y = sin x', color: AMB }, { f: () => 0.5, label: 'y = 1/2', color: SKY, dash: '6 4' }], { range: { x: [0, 4], y: [-1.5, 1.5] }, points: [{ x: 1 / 3, y: 0.5, label: 'π/6', color: ROSE }, { x: 5 / 3, y: 0.5, label: '5π/6', color: ROSE }], xTickText: quarterTicks, title: 'Two crossings in one turn', caption: 'Each crossing is a solution.' }),
    },
    {
      kind: 'concept',
      head: 'Isolate, then find the angles',
      body: 'Get the trig function alone, like solving for x. Then find the reference angle and every quadrant where the function has the right sign.',
      art: flow([{ label: 'Isolate sin, cos, or tan', color: SKY }, { label: 'Find the reference angle', color: AMB }, { label: 'Place it in each quadrant with the right sign', color: EMR }], { title: 'The solving routine', horizontal: false, caption: 'Algebra first, unit circle second.' }),
    },
    {
      kind: 'concept',
      head: 'General solutions',
      body: 'Because sine and cosine repeat every 2π, add 2πk to each solution to describe them all. Tangent repeats every π, so add πk.',
      formula: { tex: 'x = \\tfrac{\\pi}{6} + 2\\pi k \\ \\text{ or } \\ x = \\tfrac{5\\pi}{6} + 2\\pi k', note: 'k is any integer.', parts: [{ sym: '2\\pi k', means: 'any number of full turns', tone: 'accent' }, { sym: 'k', means: 'any whole number, positive or negative', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Factoring works here too',
      body: 'Equations like 2sin²x − sin x = 0 factor: sin x (2 sin x − 1) = 0. Then each factor gives its own set of angles.',
      formula: { tex: '\\sin x\\,(2\\sin x - 1) = 0', note: 'Zero-product rule, then the unit circle.', parts: [{ sym: '\\sin x = 0', means: 'x = 0 or π', tone: 'accent' }, { sym: '2\\sin x - 1 = 0', means: 'x = π/6 or 5π/6', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Solve 2 cos x − √3 = 0 on [0, 2π)',
      body: 'Isolate: cos x = √3/2.\nReference angle π/6; cosine is positive in I and IV.\nx = π/6 and x = 11π/6.',
      steps: { steps: [{ tex: '\\cos x = \\tfrac{\\sqrt3}{2}', text: 'Isolate cosine.' }, { tex: 'x = \\tfrac{\\pi}{6},\\ 2\\pi - \\tfrac{\\pi}{6}', text: 'Quadrants I and IV.' }], answer: 'x = \\tfrac{\\pi}{6},\\ \\tfrac{11\\pi}{6}' },
    },
    {
      kind: 'example',
      head: 'Solve tan x = −1 on [0, 2π)',
      body: 'Reference angle π/4.\nTangent is negative in II and IV.\nx = 3π/4 and x = 7π/4.',
      steps: { steps: [{ tex: '\\text{ref} = \\tfrac{\\pi}{4}', text: 'tan(π/4) = 1.' }, { tex: 'x = \\pi - \\tfrac{\\pi}{4},\\ 2\\pi - \\tfrac{\\pi}{4}', text: 'Quadrants II and IV.' }], answer: 'x = \\tfrac{3\\pi}{4},\\ \\tfrac{7\\pi}{4}' },
    },
    {
      kind: 'example',
      head: 'Factor: 2sin²x − sin x = 0',
      body: 'Factor out sin x: sin x (2 sin x − 1) = 0. So sin x = 0 gives 0 and π, and sin x = 1/2 gives π/6 and 5π/6. Four solutions in all.',
      table: { head: ['Factor', 'Solutions'], rows: [['sin x = 0', '0, π'], ['sin x = 1/2', 'π/6, 5π/6']], note: 'Never divide by sin x — you would lose 0 and π.' },
    },
    {
      kind: 'example',
      head: 'Another way: read it off the graph',
      body: 'Plot y = cos x and the line y = √3/2 and look for crossings in one turn. They sit at π/6 and 11π/6 — the same as the unit circle method.',
      art: funcGraph([{ f: qcos, label: 'y = cos x', color: SKY }, { f: () => Math.sqrt(3) / 2, label: 'y = √3/2', color: ROSE, dash: '6 4' }], { range: { x: [0, 4], y: [-1.5, 2.5] }, points: [{ x: 1 / 3, y: Math.sqrt(3) / 2, label: 'π/6', color: VIO }, { x: 11 / 3, y: Math.sqrt(3) / 2, label: '11π/6', color: VIO }], xTickText: quarterTicks, title: 'Crossings of cos x and √3/2', caption: 'One near the start, one near the end of the turn.' }),
    },
    {
      kind: 'example',
      head: 'A double angle: sin 2x = 1 on [0, 2π)',
      body: 'Let u = 2x. Then sin u = 1 means u = π/2 + 2πk. So x = π/4 + πk, giving π/4 and 5π/4 in one turn.',
      formula: { tex: '2x = \\tfrac{\\pi}{2} + 2\\pi k \\;\\Rightarrow\\; x = \\tfrac{\\pi}{4} + \\pi k', note: 'Divide everything by 2 — including the 2πk.', parts: [{ sym: '2x', means: 'the angle inside the sine', tone: 'accent' }, { sym: '\\pi k', means: 'solutions now repeat every π', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a pendulum',
      body: 'A pendulum\'s angle is 10 sin(πt) degrees. When is it at 5°? Sketch the wave against the level 5: sin(πt) = 1/2, so πt = π/6 or 5π/6, giving t = 1/6 s and 5/6 s in the first second.',
      table: { head: ['Step', 'Result'], rows: [['10 sin(πt) = 5', 'sin(πt) = 1/2'], ['πt = π/6, 5π/6', 't = 1/6, 5/6 s']], mark: 1 },
    },
    {
      kind: 'protip',
      head: 'Count solutions with the graph',
      body: 'A horizontal line strictly between −1 and 1 crosses sine or cosine twice per turn. If you only found one solution, look in the other quadrant.',
      formula: { tex: '-1 < c < 1 \\;\\Rightarrow\\; 2 \\text{ solutions per turn}', note: 'For sin x = c or cos x = c.', parts: [{ sym: 'c', means: 'the level being solved for', tone: 'accent' }, { sym: '2', means: 'crossings in each full turn', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Do not divide by a trig function',
      body: 'Dividing 2sin²x = sin x by sin x loses the solutions where sin x = 0. Factor instead and keep every solution.',
      compare: { cols: [{ title: 'Divided', lines: ['Lost x = 0 and x = π'], tone: 'bad' }, { title: 'Factored', lines: ['Keeps all four solutions'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 2cos²x + cos x − 1 = 0',
      body: 'Treat it as a quadratic in cos x and factor.',
      steps: { steps: [{ tex: '(2\\cos x - 1)(\\cos x + 1) = 0', text: 'Factor like 2u² + u − 1.' }, { tex: '\\cos x = \\tfrac12 \\text{ or } \\cos x = -1', text: 'Zero-product rule.' }], answer: 'x = \\tfrac{\\pi}{3},\\ \\pi,\\ \\tfrac{5\\pi}{3}' },
    },
    {
      kind: 'summary',
      head: 'Solving trig equations, wrapped up',
      body: 'Isolate the function, find the reference angle, and place it in every quadrant with the right sign. Add 2πk (πk for tangent) for all solutions. Factor; never divide by a trig function.',
      table: { head: ['Equation', 'Solutions on [0, 2π)'], rows: [['sin x = 1/2', 'π/6, 5π/6'], ['cos x = √3/2', 'π/6, 11π/6'], ['tan x = −1', '3π/4, 7π/4']] },
    },
  ],

  // ---------------- TRIG-14 — Law of Sines and Law of Cosines ----------------
  'TRIG-14': [
    {
      kind: 'objective',
      head: 'Triangles without a right angle',
      body: 'SOH-CAH-TOA needs a right angle. The Law of Sines and Law of Cosines work on ANY triangle. Today you will solve oblique triangles, handle the ambiguous case, and find area.',
      art: triangle({ A: 'A', B: 'B', C: 'C', a: 'a', b: 'b', c: 'c', title: 'Side a sits across from angle A', caption: 'Each side is named for the angle opposite it.' }),
    },
    {
      kind: 'concept',
      head: 'The Law of Sines',
      body: 'Each side divided by the sine of its opposite angle gives the same number. Use it when you know an angle and its opposite side.',
      formula: { tex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}', note: 'Needs a side-angle partner pair.', parts: [{ sym: 'a', means: 'the side across from angle A', tone: 'accent' }, { sym: '\\sin A', means: 'its opposite angle\'s sine', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'The Law of Cosines',
      body: 'It is Pythagoras with a correction term. Use it for two sides and the angle between them (SAS), or for three sides (SSS).',
      formula: { tex: 'c^2 = a^2 + b^2 - 2ab\\cos C', note: 'When C = 90°, the last term vanishes.', parts: [{ sym: 'a^2 + b^2', means: 'Pythagoras', tone: 'accent' }, { sym: '-2ab\\cos C', means: 'the correction for a non-right angle', tone: 'warn' }] },
    },
    {
      kind: 'concept',
      head: 'Which law to use',
      body: 'Have a matching side and angle? Law of Sines. Have SAS or SSS with no matching pair? Law of Cosines.',
      table: { head: ['You know', 'Use'], rows: [['AAS or ASA', 'Law of Sines'], ['SSA', 'Law of Sines (check the ambiguous case)'], ['SAS', 'Law of Cosines'], ['SSS', 'Law of Cosines']] },
    },
    {
      kind: 'example',
      head: 'Law of Sines: A = 40°, B = 60°, a = 10',
      body: 'a and A are a matching pair.\nb/sin 60° = 10/sin 40°.\nb = 10 sin 60° / sin 40° ≈ 13.5.',
      steps: { steps: [{ tex: '\\frac{b}{\\sin 60^\\circ} = \\frac{10}{\\sin 40^\\circ}', text: 'Set up the proportion.' }, { tex: 'b = \\frac{10\\sin 60^\\circ}{\\sin 40^\\circ} \\approx 13.5', text: 'Solve for b.' }], answer: 'b \\approx 13.5' },
    },
    {
      kind: 'example',
      head: 'Law of Cosines: a = 7, b = 9, C = 50°',
      body: 'Two sides and the angle between them: SAS.\nc² = 49 + 81 − 126 cos 50° ≈ 49.0.\nc ≈ 7.0.',
      steps: { steps: [{ tex: 'c^2 = 7^2 + 9^2 - 2(7)(9)\\cos 50^\\circ', text: 'Law of Cosines.' }, { tex: 'c^2 \\approx 130 - 81.0 = 49.0', text: 'Evaluate.' }], answer: 'c \\approx 7.0' },
    },
    {
      kind: 'example',
      head: 'Three sides: find the largest angle',
      body: 'Sides 5, 7, 10. The largest angle is opposite 10. cos C = (25 + 49 − 100)/(2 · 5 · 7) = −26/70, so C ≈ 111.8° — obtuse.',
      art: triangle({ A: 'A', B: 'B', C: 'C ≈ 112°', a: '7', b: '5', c: '10', shape: [[60, 200], [340, 200], [130, 130]], title: 'The longest side faces the largest angle', caption: 'A negative cosine means an obtuse angle.' }),
    },
    {
      kind: 'example',
      head: 'Another way: area with sine',
      body: 'For SAS you do not need the height. Area = ½ab sin C. With a = 7, b = 9, C = 50°: ½ · 7 · 9 · sin 50° ≈ 24.1.',
      formula: { tex: '\\text{Area} = \\tfrac{1}{2}ab\\sin C', note: 'b sin C is the height in disguise.', parts: [{ sym: 'a,\\ b', means: 'two sides', tone: 'accent' }, { sym: '\\sin C', means: 'the angle between them', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'The ambiguous case (SSA)',
      body: 'With A = 30°, a = 6, b = 10: sin B = 10 sin 30° / 6 = 5/6, so B ≈ 56.4° or B ≈ 123.6°. Both fit with A = 30°, so there are TWO triangles.',
      table: { head: ['Option', 'B', 'C = 180 − 30 − B'], rows: [['acute B', '56.4°', '93.6°'], ['obtuse B', '123.6°', '26.4°']], note: 'Both have positive angles, so both triangles exist.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: across a lake',
      body: 'Two points A and B are on opposite sides of a lake. From C, CA = 120 m, CB = 150 m and angle C = 70°. Sketch the triangle: SAS, so AB² = 120² + 150² − 2(120)(150)cos 70° ≈ 24,588, and AB ≈ 157 m.',
      art: triangle({ A: 'A', B: 'B', C: 'C 70°', a: '150', b: '120', c: '? ≈ 157', shape: [[70, 200], [330, 200], [170, 70]], title: 'SAS: Law of Cosines', caption: 'You can measure across without crossing the water.' }),
    },
    {
      kind: 'protip',
      head: 'Find the largest angle first',
      body: 'With three sides, use the Law of Cosines on the LARGEST angle first. If it is obtuse, the other two must be acute, so the Law of Sines is then safe for them.',
      art: flow([{ label: 'Largest side → largest angle', color: SKY }, { label: 'Law of Cosines for that angle', color: AMB }, { label: 'Then Law of Sines for the rest', color: EMR }], { title: 'Order matters with SSS', horizontal: false, caption: 'Avoids the ambiguous-case trap.' }),
    },
    {
      kind: 'trap',
      head: 'SSA can give zero, one, or two triangles',
      body: 'Law of Sines on SSA gives sin B. If sin B > 1 there is no triangle; if both B and 180° − B work, there are two. Always check.',
      compare: { cols: [{ title: 'sin B > 1', lines: ['No triangle'], tone: 'bad' }, { title: 'Both angles fit', lines: ['Two triangles'], tone: 'accent' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: area from three sides',
      body: 'Find the area of a triangle with sides 5, 7 and 10 using the angle you found earlier (C ≈ 111.8°).',
      steps: { steps: [{ tex: '\\tfrac12 \\cdot 5 \\cdot 7 \\cdot \\sin 111.8^\\circ', text: 'Area = ½ab sin C.' }, { tex: '\\approx 17.5 \\times 0.928', text: 'sin 111.8° ≈ 0.928.' }], answer: '\\approx 16.2' },
    },
    {
      kind: 'summary',
      head: 'Laws of Sines and Cosines, wrapped up',
      body: 'Law of Sines for a matching side-angle pair (watch SSA). Law of Cosines for SAS or SSS. Area of any triangle is ½ab sin C. Name each side for the angle across from it.',
      table: { head: ['Law', 'Formula'], rows: [['Sines', 'a/sin A = b/sin B'], ['Cosines', 'c² = a² + b² − 2ab cos C'], ['Area', '½ab sin C']] },
    },
  ],
};
