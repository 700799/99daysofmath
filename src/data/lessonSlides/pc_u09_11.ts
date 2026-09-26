import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, W, art, axes, flow, funcGraph, line, rightTriangle, text, unitCircle } from '../slideArt';

// Precalculus Units 9–11 — the unit circle & radians, graphing sine and
// cosine, and trig identities & equations. 17 slides per deck: objective →
// concepts → examples (with "Another way" alternates and real-world hooks)
// → pro tip → traps → challenge → summary. Plain text + unicode only.
export const PC_SLIDES_U09_11: SlideBank = {
  'PC-9': [
    {
      kind: 'objective',
      head: 'Every angle names a point',
      body: 'Today you meet the UNIT CIRCLE — a circle of radius 1 where every angle points at one exact spot. You will read cosine as the shadow across and sine as the height up, and you will learn to measure turns in radians. By the end, a Ferris wheel seat holds no secrets.',
      art: unitCircle(50, { label: 'θ', point: '(cos θ, sin θ)', legs: true, caption: 'Walk round the circle and the point you stop at IS the pair of values.' }),
    },
    { kind: 'concept', head: 'A circle with radius exactly 1', body: 'Draw a circle centred on the origin with radius 1. Every spot on the rim is exactly 1 unit from the centre, and each angle you turn through aims at one of those spots. That one spot is written as the pair (cos θ, sin θ).' },
    {
      kind: 'concept',
      head: 'Cosine across, sine up',
      body: 'Aim a clock hand of length 1 at your angle. How far ACROSS the tip lands is the cosine — think of it as the shadow the hand casts on the floor. How far UP the tip lands is the sine. Across first, up second, exactly like (x, y).',
      formula: {
        tex: '(x,\\, y) = (\\cos\\theta,\\ \\sin\\theta)',
        note: 'Alphabetical both times: c before s, x before y.',
        parts: [
          { sym: '\\cos\\theta', means: 'the ACROSS distance — left and right', tone: 'ok' },
          { sym: '\\sin\\theta', means: 'the UP distance — the height', tone: 'accent' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Radians measure the walk',
      body: 'A radian measures an angle by ARC LENGTH — how far you walk around the rim of the unit circle. The whole rim is 2π long, so a full turn is 2π radians and half a turn is π radians. That gives the swap rule: π radians = 180°.',
      formula: {
        tex: '180^{\\circ} = \\pi \\text{ rad}',
        note: 'A radian is how far you WALK round the rim, measured in radii.',
      },
      table: {
        head: ['degrees', 'radians', 'where'],
        rows: [['0°', '0', 'right'], ['90°', 'π/2', 'top'], ['180°', 'π', 'left'], ['270°', '3π/2', 'bottom'], ['360°', '2π', 'back home']],
        note: 'Learn these five and everything else is a fraction between them.',
      },
    },
    {
      kind: 'concept',
      head: 'Four quadrants, four sign patterns',
      body: 'The circle splits into four corners, counted counter-clockwise. Q1 (0°–90°): across +, up +. Q2 (90°–180°): across −, up +. Q3 (180°–270°): both −. Q4 (270°–360°): across +, up −. Left means cosine is negative; below means sine is negative.',
      compare: {
        cols: [
          { title: 'Q1 · all +', tex: '(+,\\,+)', lines: ['right and up'], tone: 'ok' },
          { title: 'Q2 · sine +', tex: '(-,\\,+)', lines: ['left and up'], tone: 'accent' },
          { title: 'Q3 · tan +', tex: '(-,\\,-)', lines: ['left and down'], tone: 'warn' },
        ],
        note: 'The signs are just the signs of the coordinates — nothing new to memorize.',
      },
    },
    { kind: 'example', head: 'Start at zero degrees', body: 'Point the hand straight right. That is 0°, and the tip lands at (1, 0).\nAcross is 1 and up is 0.\nSo cos 0° = 1 and sin 0° = 0.' },
    {
      kind: 'example',
      head: 'A quarter turn to the top',
      body: 'Turn the hand a quarter of the way round, to 90°. The tip is now at (0, 1).\nAcross is 0 and up is 1.\nSo cos 90° = 0 and sin 90° = 1 — the biggest sine ever gets.',
      art: unitCircle(90, { label: '90°', point: '(0, 1)', caption: 'A quarter turn: no across at all, full height up.' }),
      steps: {
        steps: [
          { tex: '\\theta = 90^{\\circ}', text: 'Straight up from the centre.' },
          { tex: '(\\cos 90^{\\circ},\\ \\sin 90^{\\circ}) = (0,\\ 1)', text: 'Zero across, one up.' },
        ],
        answer: '\\cos = 0,\\ \\sin = 1',
      },
    },
    { kind: 'example', head: 'The clock hand sweep', body: 'A clock hand moves from the 12 to the 3. That is a quarter of the whole face.\nA full turn is 360°, so a quarter turn is 360 ÷ 4.\nThe hand swept 90°. Each hour mark is 360 ÷ 12 = 30°, and three marks make 90°.' },
    {
      kind: 'example',
      head: 'Swap π for 180',
      body: 'How many degrees is π/3 radians?\nWherever you see π, write 180° instead: π/3 becomes 180 ÷ 3.\n180 ÷ 3 = 60, so π/3 radians = 60°. The same trick gives π/4 = 45° and π/6 = 30°.',
      steps: {
        steps: [
          { tex: '\\dfrac{3\\pi}{4}', text: 'Replace π with 180°.' },
          { tex: '\\dfrac{3 \\cdot 180^{\\circ}}{4}', text: 'Now it is ordinary arithmetic.' },
        ],
        answer: '135^{\\circ}',
      },
    },
    { kind: 'example', head: 'The bike wheel valve', body: 'The valve on your bike wheel rolls all the way around once. How many radians is that?\nRadians are arc length, and the rim of the unit circle is 2πr = 2π long when r = 1.\nSo one full turn is 2π radians. Check in degrees: 2 × 180 = 360°.' },
    { kind: 'example', head: 'The Ferris wheel seat', body: 'A wheel of radius 15 m has its centre 20 m up. A seat starts at the far right and turns 90°.\nHeight = centre + radius × sin θ = 20 + 15 × sin 90°.\nsin 90° = 1, so the height is 20 + 15 = 35 m — the very top of the wheel.' },
    { kind: 'example', head: 'Another way: slice a triangle', body: 'Why is sin 30° exactly 1/2? Draw an equilateral triangle with every side 1 and every angle 60°.\nSlice it straight down the middle. The slice cuts one side in half, leaving a short leg of exactly 1/2 next to a 30° angle.\nThat short leg is the height at 30°, so sin 30° = 1/2 — no calculator needed.' },
    {
      kind: 'example',
      head: 'Another way: back up from a full turn',
      body: 'A game character faces 300°. Which quadrant is that?\nInstead of counting forwards, back up: 360 − 300 = 60, so the facing is 60° short of a full turn.\nSixty degrees short of due east points down and to the right — Quadrant 4, where cosine is positive and sine is negative.',
      art: unitCircle(330, { label: '330°', point: '30° short', caption: 'Going 330° forward is the same landing spot as 30° backward.' }),
    },
    { kind: 'protip', head: 'Sketch the circle before you answer', body: 'A five-second doodle beats memorising a table. Draw a circle, mark right, top, left and bottom, then put your angle roughly where it belongs. You can now SEE whether the across value is negative and whether the height is above or below the middle.' },
    {
      kind: 'trap',
      head: 'Trap: cosine is not the height',
      body: 'At 90° the point is (0, 1). Reading that as cos 90° = 1 is the most common slip in the whole unit. Cosine is the FIRST number, the shadow across, so cos 90° = 0 and sin 90° = 1. Across first, up second — every single time.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\cos\\theta = \\text{height}', lines: ['Mixes up the pair', 'Every answer flips'], tone: 'bad' },
          { title: 'Right', tex: '\\cos\\theta = \\text{across}', lines: ['x-coordinate', 'sin is the height'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 210 degrees',
      body: 'Where does 210° land, and what are the signs there?\n210 is between 180 and 270, so it is in Quadrant 3 — left of centre and below it.\nBoth the across and up numbers are negative. In fact the point is (−0.866, −0.5), so sin 210° = −1/2: the same size as sin 30°, flipped downward.',
      art: unitCircle(210, { label: '210°', legs: true, caption: 'Q3, so both cos and sin are negative — the reference angle back to the axis is 30°.' }),
    },
    {
      kind: 'summary',
      head: 'You can read the circle now',
      body: 'The unit circle has radius 1, and every angle names the point (cos θ, sin θ) — cosine across, sine up. Radians measure the turn by arc length, with π radians = 180° and a full turn 2π. The quadrant tells you the signs, and 0, 30, 45, 60 and 90 are the exact-value angles worth knowing cold.',
      formula: {
        tex: '(\\cos\\theta,\\ \\sin\\theta) \\quad\\text{on}\\quad x^{2} + y^{2} = 1',
        parts: [
          { sym: '\\cos', means: 'across — the x-coordinate', tone: 'ok' },
          { sym: '\\sin', means: 'up — the y-coordinate', tone: 'accent' },
          { sym: '\\pi', means: 'half a turn, so 180 degrees', tone: 'warn' },
        ],
      },
    },
  ],
  'PC-10': [
    {
      kind: 'objective',
      head: 'Waves you can read',
      body: 'Today you turn sine and cosine into GRAPHS. You will find the amplitude, the midline, the period and the phase shift of any wave, straight from its equation. Then you will use them on Ferris wheels, heartbeats, tides and daylight.',
      art: flow([{ label: 'Midline: the calm level', color: SKY }, { label: 'Amplitude: half the swing', color: AMB }, { label: 'Period: how long one wave takes', color: EMR }], { title: 'The four numbers of a wave' }),
    },
    {
      kind: 'concept',
      head: 'A sine graph is a wave',
      body: 'Plot sine as the angle grows and you get a smooth wave that rises, falls, and repeats forever. Picture shaking one end of a jump rope, or the trace crawling across a heartbeat monitor. Nothing is ever new — the same shape keeps coming back.',
      art: (() => {
        const ax = axes({ x: [0, 6.6], y: [-1.6, 1.6] }, { ticks: { y: [-1, 0, 1] }, grid: true, pad: 26 });
        let b = ax.body + ax.curve((x) => Math.sin(x), AMB, 3);
        b += line(ax.X(0), ax.Y(1), ax.X(6.6), ax.Y(1), EMR, 1.8, '5 4');
        b += line(ax.X(0), ax.Y(-1), ax.X(6.6), ax.Y(-1), EMR, 1.8, '5 4');
        b += text(ax.X(1.6), ax.Y(1.35), 'max 1', { size: 12, fill: EMR });
        b += text(ax.X(4.7), ax.Y(-1.3), 'min −1', { size: 12, fill: EMR });
        b += text(W / 2, 16, 'one full wave = 2π', { size: 12, op: 0.7 });
        return art('One period of a sine wave between dashed lines at plus one and minus one', b,
          'It rises, falls, and comes back — then does exactly the same thing again, for ever.');
      })(),
    },
    {
      kind: 'concept',
      head: 'Amplitude: how far it swings',
      body: 'AMPLITUDE is how far the wave swings away from the middle. It is HALF the distance from the peak down to the trough, and in y = a·sin(x) + k it is simply the number a. Bigger a means a taller wave, not a longer one.',
      formula: {
        tex: 'A = \\dfrac{\\text{max} - \\text{min}}{2}',
        note: 'Amplitude is measured from the MIDDLE to the top — half the total swing.',
      },
      art: (() => {
        const ax = axes({ x: [0, 6.6], y: [-3.6, 3.6] }, { ticks: { y: [-3, 0, 3] }, grid: true, pad: 26 });
        let b = ax.body + ax.curve((x) => 3 * Math.sin(x), AMB, 3) + ax.curve((x) => Math.sin(x), SKY, 2.4, '5 4');
        b += text(ax.X(2.6), ax.Y(3.1), 'A = 3', { size: 12, fill: AMB });
        b += text(ax.X(5.2), ax.Y(1.4), 'A = 1', { size: 12, fill: SKY });
        return art('Two sine waves on one grid, one swinging three times as far as the other', b,
          'The number in front of sin stretches the swing — it never moves the wave up or down.');
      })(),
    },
    {
      kind: 'concept',
      head: 'Midline: the calm level',
      body: 'The MIDLINE is the level the wave wiggles around — the resting line on the heart monitor. It is set by the number added at the end, so y = a·sin(x) + k has midline y = k. You can also find it by averaging the peak and the trough.',
      formula: {
        tex: 'k = \\dfrac{\\text{max} + \\text{min}}{2}',
        note: 'Average the highest and lowest and you land on the line the wave rocks about.',
      },
      art: (() => {
        const ax = axes({ x: [0, 6.6], y: [-1, 15] }, { ticks: { y: [2, 8, 14] }, grid: true, pad: 26 });
        let b = ax.body + ax.curve((x) => 8 + 6 * Math.sin(x), AMB, 3);
        b += line(ax.X(0), ax.Y(8), ax.X(6.6), ax.Y(8), EMR, 2.2, '6 4');
        b += text(ax.X(4.8), ax.Y(9.6), 'midline y = 8', { size: 12, fill: EMR });
        return art('A wave rocking about a dashed horizontal line part way up the grid', b,
          'Average the highest and lowest values and you land on the line it rocks about.');
      })(),
    },
    {
      kind: 'concept',
      head: 'Period and phase shift',
      body: 'PERIOD is how far one whole wave takes: 360° divided by the number b in front of x. A bigger b squeezes more waves into the same space. A PHASE SHIFT slides the wave sideways: y = sin(x − c) starts c degrees LATE, so it slides c degrees right.',
      formula: {
        tex: 'y = A\\sin\\big(B(x - C)\\big) + k',
        note: 'Four numbers and the whole wave is pinned down.',
        parts: [
          { sym: 'A', means: 'amplitude — how far it swings from the middle', tone: 'ok' },
          { sym: 'B', means: 'squeeze — the period is 360° ÷ B (or 2π ÷ B)', tone: 'warn' },
          { sym: 'C', means: 'phase shift — how far the wave slides sideways', tone: 'accent' },
          { sym: 'k', means: 'midline — the level it rocks about', tone: 'bad' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Amplitude at a glance',
      body: 'Find the amplitude of y = 4 sin(x).\nThe amplitude is the number multiplying the sine, so it is 4.\nPlain sine rides between −1 and 1, and multiplying by 4 stretches that to between −4 and 4.',
      steps: {
        steps: [
          { tex: 'y = 3\\sin x', text: 'The number in front of sin is the amplitude.' },
          { tex: '\\text{max} = 3,\\ \\text{min} = -3', text: 'It swings 3 above and 3 below.' },
        ],
        answer: 'A = 3',
      },
    },
    { kind: 'example', head: 'Midline at a glance', body: 'Find the midline of y = sin(x) + 7.\nThe + 7 lifts every point of the wave up by 7.\nSo the wave now wiggles around y = 7. Its peak is 8 and its trough is 6.' },
    { kind: 'example', head: 'The Ferris wheel over time', body: 'A seat follows h = 18 sin(x) + 22 metres.\nThe amplitude 18 is the radius of the wheel; the midline 22 is how high its centre sits.\nHighest = 22 + 18 = 40 m and lowest = 22 − 18 = 4 m. The equation is a picture of the ride.' },
    {
      kind: 'example',
      head: 'Period: squeeze the wave',
      body: 'Find the period of y = sin(2x), in degrees.\nPeriod = 360 ÷ b, and here b = 2, so 360 ÷ 2 = 180°.\nThe 2 makes x count double-time, packing two whole waves into one 360° stretch.',
      art: funcGraph([{ f: (x) => Math.sin(2 * x), label: 'sin 2x: two waves' }, { f: (x) => Math.sin(x), label: 'sin x: one wave', color: SKY }], { range: { x: [0, 6.5], y: [-2, 2] }, xTickText: (v) => (v === 0 ? '0' : v === 3 ? 'π' : v === 6 ? '2π' : ''), title: 'The inside number squeezes it', caption: 'Doubling the input fits two complete waves where one used to go.' }),
      formula: {
        tex: '\\text{period} = \\dfrac{2\\pi}{B}',
        note: 'A bigger B squeezes more waves into the same space, so each one is shorter.',
      },
      table: {
        head: ['B', 'period', 'waves in 2π'],
        rows: [['1', '2π', '1'], ['2', 'π', '2'], ['3', '2π/3', '3'], ['½', '4π', '½']],
        mark: 1,
        note: 'B is a count, not a length — divide 2π by it to get the length.',
      },
    },
    { kind: 'example', head: 'The heartbeat monitor', body: 'A trace is modelled by y = 3 sin(6x), with x in degrees. How wide is one beat?\nOne beat is one full wave: 360 ÷ 6 = 60°.\nThe 3 out front only says how TALL each beat is. Inside changes the width; outside changes the height.' },
    {
      kind: 'example',
      head: 'Another way: use highest and lowest',
      body: 'A harbour is 9 m deep at high tide and 3 m at low tide. No equation needed.\nMidline is the average: (9 + 3) ÷ 2 = 6 m. Amplitude is half the gap: (9 − 3) ÷ 2 = 3 m.\nSo the tide is depth = 3 sin(x) + 6. Two extremes hand you the whole model.',
      steps: {
        steps: [
          { tex: '\\text{max} = 14,\\ \\text{min} = 2', text: 'Read the two extremes off the graph.' },
          { tex: 'k = \\tfrac{14 + 2}{2} = 8', text: 'Average them for the midline.' },
          { tex: 'A = \\tfrac{14 - 2}{2} = 6', text: 'Half the difference is the amplitude.' },
        ],
        answer: 'A = 6,\\ k = 8',
      },
    },
    { kind: 'example', head: 'Another way: ask when the inside is zero', body: 'Which way does y = sin(x − 30°) slide, and how far?\nPlain sine starts its climb when the inside is 0. Here x − 30 = 0 gives x = 30.\nEverything arrives 30° LATE, and running late means sliding 30° to the right — like a tide that shows up half an hour after you expect it.' },
    {
      kind: 'protip',
      head: 'Name the four numbers first',
      body: 'Before you answer anything, label a, b, c and k out loud: amplitude, squeeze, slide, midline. Most exam questions ask for exactly one of them, and once they are labelled the question answers itself. Thirty seconds of labelling saves three minutes of panic.',
      compare: {
        cols: [
          { title: 'Outside the sin', tex: 'A \\ \\text{and} \\ k', lines: ['Height and level', 'Do what they say'], tone: 'ok' },
          { title: 'Inside the sin', tex: 'B \\ \\text{and} \\ C', lines: ['Squeeze and slide', 'Run backwards'], tone: 'warn' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: amplitude is not the full height',
      body: 'Daylight runs from 16 hours down to 8 hours, so the amplitude is NOT 8. Amplitude is half the peak-to-trough gap: (16 − 8) ÷ 2 = 4 hours, around a midline of 12. Take the gap, then halve it — always.',
      art: funcGraph([{ f: (x) => 2 * Math.sin(x), label: 'amplitude 2, height 4' }], { range: { x: [0, 6.5], y: [-3, 3] }, xTickText: (v) => (v === 0 ? '0' : v === 3 ? 'π' : v === 6 ? '2π' : ''), points: [{ x: 1.57, y: 2, label: 'top: 2' }, { x: 4.71, y: -2, label: 'bottom: −2', color: SKY }], title: 'Top to bottom is DOUBLE the amplitude', caption: 'The full swing here is 4, so the amplitude is 2. Halve the height to get it.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: 'A = \\text{max} - \\text{min}', lines: ['Counts the whole swing', 'Twice too big'], tone: 'bad' },
          { title: 'Right', tex: 'A = \\tfrac{\\text{max} - \\text{min}}{2}', lines: ['Middle to the top', 'Half the swing'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: the number inside is not the period',
      body: 'For y = 2 sin(9x) the period is not 9. The 9 says how many waves are squeezed into one turn, so the period is 360 ÷ 9 = 40°. A bigger number inside makes waves SHORTER, not longer.',
      compare: {
        cols: [
          { title: 'Wrong', tex: 'y = \\sin 4x \\Rightarrow \\text{period } 4', lines: ['Reads B as a length'], tone: 'bad' },
          { title: 'Right', tex: '\\tfrac{2\\pi}{4} = \\tfrac{\\pi}{2}', lines: ['B counts the waves', 'Divide to get length'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: build the daylight model', body: 'A town has 16 hours of daylight at midsummer and 8 at midwinter, on a 360-day cycle.\nMidline: (16 + 8) ÷ 2 = 12 hours. Amplitude: (16 − 8) ÷ 2 = 4 hours. Period 360 days means b = 360 ÷ 360 = 1.\nThe model is hours = 4 sin(x) + 12, and it peaks at exactly 16 hours. Check the trough: 12 − 4 = 8.' },
    {
      kind: 'summary',
      head: 'You read waves like sentences',
      body: 'In y = a·sin(b(x − c)) + k, a is the AMPLITUDE, k is the MIDLINE, 360 ÷ b is the PERIOD, and c is the sideways SLIDE. Amplitude is half the peak-to-trough gap and the midline is their average. Ferris wheels, heartbeats, tides and daylight all fit this one shape.',
      formula: {
        tex: 'y = A\\sin\\big(B(x - C)\\big) + k',
        parts: [
          { sym: 'A', means: 'half the distance from lowest to highest', tone: 'ok' },
          { sym: '\\tfrac{2\\pi}{B}', means: 'the length of one complete wave', tone: 'warn' },
          { sym: 'k', means: 'the average of the max and the min', tone: 'accent' },
        ],
      },
    },
  ],
  'PC-11': [
    {
      kind: 'objective',
      head: 'One identity, endless shortcuts',
      body: 'Today you meet sin²θ + cos²θ = 1 — the Pythagorean theorem wearing a trig costume. You will use it to find missing values and to simplify messy expressions. Then you will solve trig equations and learn why they usually have TWO answers.',
      art: flow([{ label: 'sin² + cos² = 1 always', color: SKY }, { label: 'Rearrange it into a tool', color: AMB }, { label: 'One turn holds two answers', color: EMR }], { title: 'The Pythagorean identity' }),
    },
    {
      kind: 'concept',
      head: 'It IS the Pythagorean theorem',
      body: 'Take the point for angle θ on the unit circle and drop a line straight down to the axis. You get a right triangle: the across leg is cos θ, the up leg is sin θ, and the slanted side is the radius, 1. So a² + b² = c² becomes cos²θ + sin²θ = 1.',
      art: unitCircle(55, { label: 'θ', legs: true, caption: 'The radius is 1 and the legs are cos θ and sin θ — so a² + b² = c² says it all.' }),
      formula: {
        tex: '\\sin^{2}\\theta + \\cos^{2}\\theta = 1',
        note: 'Not a new fact — Pythagoras, written for a triangle whose hypotenuse is 1.',
      },
    },
    {
      kind: 'concept',
      head: 'Rearrange it into a tool',
      body: 'Move things around and the identity becomes a swap kit: cos²θ = 1 − sin²θ, and sin²θ = 1 − cos²θ. Whenever you spot "1 minus a square" in an expression, trade it for the other square. That single move unlocks most simplifying questions.',
      compare: {
        cols: [
          { title: 'Know cos, want sin', tex: '\\sin^{2}\\theta = 1 - \\cos^{2}\\theta', lines: ['Subtract and square-root'], tone: 'accent' },
          { title: 'Know sin, want cos', tex: '\\cos^{2}\\theta = 1 - \\sin^{2}\\theta', lines: ['Same move, other way'], tone: 'ok' },
        ],
        note: 'Watch the sign at the end — the quadrant decides whether the root is + or −.',
      },
    },
    {
      kind: 'concept',
      head: 'Tangent is sine over cosine',
      body: 'The identity tan θ = sin θ ÷ cos θ means tangent is height up divided by shadow across. That is rise over run, so tan θ is the SLOPE of the line from the centre out to the point. At 45° you rise 1 for every 1 you run, so tan 45° = 1.',
      formula: {
        tex: '\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}',
        note: 'Up divided by across — which is exactly the slope of the radius.',
      },
      art: unitCircle(38, { label: 'θ', legs: true, caption: 'tan θ is the up-leg divided by the across-leg — the slope of the radius.' }),
    },
    {
      kind: 'concept',
      head: 'Two answers in one turn',
      body: 'A rotating platform passes each height twice per turn: once climbing and once falling. Trig equations behave the same way, so expect TWO answers between 0° and 360°. For sine the partner is 180° − θ; for tangent the partner is θ + 180°.',
      art: (() => {
        const ax = axes({ x: [0, 6.6], y: [-1.4, 1.4] }, { ticks: { y: [-1, 0, 1] }, grid: true, pad: 26 });
        let b = ax.body + ax.curve((x) => Math.sin(x), AMB, 3);
        b += line(ax.X(0), ax.Y(0.5), ax.X(6.6), ax.Y(0.5), SKY, 2, '5 4');
        b += text(ax.X(5.6), ax.Y(0.85), 'y = 0.5', { size: 12, fill: SKY });
        b += text(ax.X(0.52), ax.Y(-0.5), '30°', { size: 12, fill: ROSE });
        b += text(ax.X(2.62), ax.Y(-0.5), '150°', { size: 12, fill: ROSE });
        return art('A sine wave crossed by a horizontal line at 0.5, meeting it twice in one period', b,
          'One horizontal line, two crossings — so a sine equation usually has two answers per turn.');
      })(),
    },
    {
      kind: 'example',
      head: 'Check the identity with numbers',
      body: 'Does sin²θ + cos²θ = 1 really hold for every angle? Test θ = 30°.\nsin 30° = 0.5 and cos 30° ≈ 0.866, so 0.25 + 0.75 = 1.\nTest θ = 0°: 0² + 1² = 1. It never budges — that is why it is called an identity.',
      steps: {
        steps: [
          { tex: '\\theta = 30^{\\circ}', text: 'Pick a friendly angle.' },
          { tex: '\\sin 30^{\\circ} = 0.5,\\ \\cos 30^{\\circ} \\approx 0.866', text: 'Look the two values up.' },
          { tex: '0.25 + 0.75 = 1', text: 'Square both and add.' },
        ],
        answer: '1 \\ \\checkmark',
      },
    },
    {
      kind: 'example',
      head: 'Find the missing square',
      body: 'For some angle, sin²θ = 0.36. Find cos²θ.\nThe two squares always add to 1, so cos²θ = 1 − 0.36.\ncos²θ = 0.64. Picture a bar of length 1 split into two pieces: take 0.36 away and 0.64 is left.',
      steps: {
        steps: [
          { tex: '\\cos\\theta = 0.6', text: 'Given the across value.' },
          { tex: '\\sin^{2}\\theta = 1 - 0.36', text: 'Subtract its square from 1.' },
          { tex: '\\sin^{2}\\theta = 0.64', text: 'Now square-root it.' },
        ],
        answer: '\\sin\\theta = 0.8',
      },
    },
    { kind: 'example', head: 'The game motion check', body: 'A game stores a facing direction as cos θ = 0.6, with θ in Quadrant 1. It needs sin θ to move the sprite.\nsin²θ = 1 − 0.6² = 1 − 0.36 = 0.64, so sin θ = 0.8 or −0.8.\nQuadrant 1 is up and to the right, where sine is positive, so sin θ = 0.8. Check: 0.36 + 0.64 = 1.' },
    { kind: 'example', head: 'Simplify with the identity', body: 'Simplify (1 − sin²θ) ÷ cos θ, with cos θ not zero.\nThe top is 1 minus a square, so swap it: 1 − sin²θ = cos²θ.\nNow it is cos²θ ÷ cos θ. Two copies on top, one on the bottom, so one cancels: the answer is cos θ.' },
    {
      kind: 'example',
      head: 'Why tan 45° equals 1',
      body: 'Use tan θ = sin θ ÷ cos θ at 45°.\nAt 45° you have gone as far up as you have gone across, so sin 45° = cos 45° = √2/2 ≈ 0.707.\nDividing a number by itself gives 1, so tan 45° = 1. The ugly square roots cancel each other out.',
      art: rightTriangle({ opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 3, adj: 3 }, title: 'Equal legs, so the ratio is 1', caption: 'Tangent is opposite over adjacent. When the legs match, that ratio can only be 1.' }),
    },
    {
      kind: 'example',
      head: 'Solve sin θ = 0.5',
      body: 'Find every angle between 0° and 360° with height 0.5.\nThe exact-value angle 30° works. Its mirror across the top of the circle is 180 − 30 = 150°.\nSo θ = 30° and θ = 150°. Two answers, not one.',
      steps: {
        steps: [
          { tex: '\\sin^{-1}(0.5) = 30^{\\circ}', text: 'The calculator gives you one answer.' },
          { tex: '180^{\\circ} - 30^{\\circ} = 150^{\\circ}', text: 'Sine is also positive in Q2 — find its partner.' },
        ],
        answer: '30^{\\circ} \\text{ and } 150^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: read it off the wave',
      body: 'Same equation, different picture. Graph y = sin θ from 0° to 360°: it climbs to 1, drops to −1, and returns.\nNow draw the flat line y = 0.5 straight across the graph.\nThe wave crosses that line twice — once climbing at 30°, once falling at 150°. Counting crossings counts solutions.',
      art: funcGraph([{ f: (x) => Math.sin(x), label: 'sin' }, { f: (x) => Math.cos(x), label: 'cos', color: SKY }], { range: { x: [0, 6.5], y: [-2, 2] }, xTickText: (v) => (v === 0 ? '0' : v === 3 ? 'π' : v === 6 ? '2π' : ''), title: 'Sine and cosine, a quarter turn apart', caption: 'Cosine is sine that started early. Their squares still add to 1 at every single point.' }),
    },
    { kind: 'example', head: 'Another way: ride the rotating platform', body: 'A platform lifts a robot as it spins. It reaches your target height while rising, keeps going to the very top, then comes back down past that same height.\nThat second pass is the same distance past the top as the first was before it.\nThe only heights hit just once are the very top and the very bottom. Everything else gets hit twice.' },
    { kind: 'protip', head: 'Verify by plugging in a friendly angle', body: 'Not sure whether your simplifying step is legal? Test it at 30° or 45°, where you know the exact values. If both sides of your work give the same number, you are almost certainly right. If they disagree, you just caught your own mistake for free.' },
    {
      kind: 'trap',
      head: 'Trap: stopping after one answer',
      body: 'Solving sin θ = 0.5 and writing only θ = 30° throws away half the answer. A flat line cuts a circle in two places, so 150° counts too. Ask yourself every time: where is the partner, and did I stay inside 0° to 360°?',
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\theta = 30^{\\circ}', lines: ['Takes the calculator at its word', 'Half the answer'], tone: 'bad' },
          { title: 'Right', tex: '30^{\\circ},\\ 150^{\\circ}', lines: ['Checks the other quadrant', 'One turn, two crossings'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: verify a ramp calculation', body: 'An app solves tan θ = 1 for 0° ≤ θ < 360° and reports only 45°. What is missing?\ntan θ = sin θ ÷ cos θ, and flipping the sign of BOTH sine and cosine leaves the fraction unchanged: (−0.707) ÷ (−0.707) = 1.\nThat opposite direction is half a turn away, at 45 + 180 = 225°. The app should report 45° and 225°.' },
    {
      kind: 'summary',
      head: 'You hold the master key',
      body: 'sin²θ + cos²θ = 1 is just Pythagoras on the unit circle, and rearranging it lets you swap 1 minus a square for the other square. Tangent is sine over cosine, which is the slope out to the point. Trig equations on one full turn almost always have two answers, so always hunt for the partner.',
      formula: {
        tex: '\\sin^{2}\\theta + \\cos^{2}\\theta = 1 \\qquad \\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}',
        parts: [
          { sym: '1', means: 'the radius squared — it is Pythagoras in disguise', tone: 'accent' },
          { sym: '\\tan', means: 'up over across, which is the slope of the radius', tone: 'ok' },
          { sym: '2', means: 'expect two answers in every full turn', tone: 'warn' },
        ],
      },
    },
  ],
};
