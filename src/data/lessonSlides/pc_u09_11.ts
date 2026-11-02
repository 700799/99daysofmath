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
    { kind: 'concept', head: 'A circle with radius exactly 1', body: 'Draw a circle centred on the origin with radius 1. Every spot on the rim is exactly 1 unit from the centre, and each angle you turn through aims at one of those spots. That one spot is written as the pair (cos θ, sin θ).',
      why: 'Rotate a hand of length 1 and its tip can only ever be 1 unit from the centre, so the tip traces out a circle. Because the radius never changes, the angle alone is enough to say exactly where the tip is. One input, one point, which is why the point can be named by the angle.' },
    {
      kind: 'concept',
      head: 'Cosine across, sine up',
      body: 'Aim a clock hand of length 1 at your angle. How far ACROSS the tip lands is the cosine — think of it as the shadow the hand casts on the floor. How far UP the tip lands is the sine. Across first, up second, exactly like (x, y).',
      why: 'Look at the right triangle formed by the hand, the floor and a straight drop from the tip. The hand is the slanted side of length 1, so across = 1 × cos θ and up = 1 × sin θ. Because the hand has length 1, multiplying by it changes nothing, and the sides ARE cosine and sine.',
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
      why: 'On a circle of radius r, an arc of length r makes one radian. The unit circle has r = 1, so the arc length simply equals the angle. The full rim is 2π × 1 = 2π, and half the rim is π, which is exactly why π radians matches 180 degrees.',
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
      why: 'Cosine and sine are the x and y coordinates of the tip, and coordinates follow the usual rule: right of the y-axis is positive, above the x-axis is positive. At 135° the tip is up and to the left, so across is negative and up is positive. Each quadrant is one of the four left/right, up/down combinations.',
      compare: {
        cols: [
          { title: 'Q1 · all +', tex: '(+,\\,+)', lines: ['right and up'], tone: 'ok' },
          { title: 'Q2 · sine +', tex: '(-,\\,+)', lines: ['left and up'], tone: 'accent' },
          { title: 'Q3 · tan +', tex: '(-,\\,-)', lines: ['left and down'], tone: 'warn' },
        ],
        note: 'The signs are just the signs of the coordinates — nothing new to memorize.',
      },
    },
    {
      kind: 'example',
      head: 'Start at zero degrees',
      body: 'Where does the tip of the hand land at 0°, and what are cos 0° and sin 0°? Think of the hand lying flat before you turn it at all.',
      steps: {
        steps: [
          { tex: '\\theta = 0^{\\circ}', text: 'The hand has not turned at all, so it still lies along the positive x-axis, pointing straight right. Zero degrees is where every angle measurement starts.' },
          { tex: '(x,\\ y) = (1,\\ 0)', text: 'The hand has length 1, so its tip is 1 unit right of the centre. It has not left the x-axis, so the tip is 0 units up.' },
          { tex: '(\\cos 0^{\\circ},\\ \\sin 0^{\\circ}) = (1,\\ 0)', text: 'Cosine is the across number and sine is the up number, so read them off in order. Across is 1 and up is 0.' },
        ],
        answer: '\\cos 0^{\\circ} = 1,\\ \\sin 0^{\\circ} = 0',
      },
    },
    {
      kind: 'example',
      head: 'A quarter turn to the top',
      body: 'Turn the hand a quarter of the way round, to 90°. Where is the tip now, and what do cosine and sine equal there?',
      art: unitCircle(90, { label: '90°', point: '(0, 1)', caption: 'A quarter turn: no across at all, full height up.' }),
      steps: {
        steps: [
          { tex: '\\theta = 90^{\\circ}', text: 'A quarter turn is 360° ÷ 4 = 90°, so the hand points straight up from the centre. It has swung a quarter of the way round from pointing right.' },
          { tex: 'x = 0', text: 'The hand points straight up, so the tip sits directly above the centre. It is not left or right of the y-axis at all, so the across distance is 0.' },
          { tex: 'y = 1', text: 'The hand has length 1, and all of that length now points upward. So the tip is 1 unit above the centre, and the up distance is 1.' },
          { tex: '(\\cos 90^{\\circ},\\ \\sin 90^{\\circ}) = (0,\\ 1)', text: 'Cosine is the across number and sine is the up number, so cos 90° = 0 and sin 90° = 1. Sine cannot go higher than 1.' },
        ],
        answer: '\\cos = 0,\\ \\sin = 1',
      },
    },
    {
      kind: 'example',
      head: 'The clock hand sweep',
      body: 'A clock hand moves from the 12 to the 3. How many degrees did it sweep?',
      steps: {
        steps: [
          { tex: '360^{\\circ}', text: 'One full trip round the clock face is a full turn, and a full turn is 360°. Every angle on the face is a fraction of this number.' },
          { tex: '\\dfrac{360^{\\circ}}{12} = 30^{\\circ}', text: 'The face has 12 equally spaced hour marks, so each gap is the same angle. Divide the full turn by 12 to get 30° per hour mark.' },
          { tex: '3 \\times 30^{\\circ} = 90^{\\circ}', text: 'Going from the 12 to the 3 crosses 3 hour gaps, so multiply the gap angle by 3. This also equals a quarter of 360°, which is 90°.' },
        ],
        answer: '90^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'Swap π for 180',
      body: 'How many degrees is π/3 radians? Use the fact that π radians and 180° describe the same half turn.',
      steps: {
        steps: [
          { tex: '\\pi \\text{ rad} = 180^{\\circ}', text: 'Both sides measure a half turn around the circle, one in radians and one in degrees. So anywhere you see π in an angle, you may write 180° instead.' },
          { tex: '\\dfrac{\\pi}{3} = \\dfrac{180^{\\circ}}{3}', text: 'Replace π with 180° and leave the rest of the fraction alone. The swap is allowed because the two quantities are equal, so the angle does not change size.' },
          { tex: '180 \\div 3 = 60', text: 'Now it is ordinary arithmetic: 180 split into 3 equal parts gives 60. Check: 3 × 60 = 180, so the division is right.' },
        ],
        answer: '60^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'The bike wheel valve',
      body: 'The valve on your bike wheel rolls all the way around once. How many radians is that one full turn?',
      steps: {
        steps: [
          { tex: '\\text{radians} = \\text{arc length}', text: 'On the unit circle a radian is measured by how far you walk along the rim. So a full turn is however long the whole rim is.' },
          { tex: 'C = 2\\pi r = 2\\pi(1) = 2\\pi', text: 'The distance round any circle is 2π times its radius. The unit circle has radius 1, so the whole rim is 2π long.' },
          { tex: '2\\pi \\text{ rad} = 2 \\times 180^{\\circ} = 360^{\\circ}', text: 'Check against degrees: π is 180°, so 2π is 360°. That is a full turn, so the answer agrees with what we already know.' },
        ],
        answer: '2\\pi \\text{ radians}',
      },
    },
    {
      kind: 'example',
      head: 'The Ferris wheel seat',
      body: 'A wheel of radius 15 m has its centre 20 m up. A seat starts at the far right and turns 90°. How high is the seat now?',
      steps: {
        steps: [
          { tex: '\\text{height} = 20 + 15\\sin\\theta', text: 'The sine is the up fraction on a circle of radius 1, so on a wheel of radius 15 the rise above the centre is 15 × sin θ. Add the 20 m the centre sits above the ground.' },
          { tex: '\\text{height} = 20 + 15\\sin 90^{\\circ}', text: 'The seat has turned 90° from the far right, so put θ = 90° in. The centre height 20 and the radius 15 stay the same.' },
          { tex: '\\sin 90^{\\circ} = 1', text: 'From the unit circle, the point at 90° is (0, 1), so its up value is 1. That means the seat is at the full radius above the centre.' },
          { tex: '\\text{height} = 20 + 15(1) = 35', text: 'Multiply 15 by 1 to get 15, then add 20 to get 35 metres. That is the very top of the wheel, because 20 + 15 is centre plus radius.' },
        ],
        answer: '35 \\text{ m}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: slice a triangle',
      body: 'Why is sin 30° exactly 1/2? Skip the calculator and prove it with a triangle you can draw.',
      steps: {
        steps: [
          { tex: '\\text{sides } 1,1,1;\\ \\text{angles } 60^{\\circ}', text: 'Draw an equilateral triangle with every side 1. All its angles are equal, and they must add to 180°, so each is 180° ÷ 3 = 60°.' },
          { tex: '\\text{cut down the middle}', text: 'Slice from the top corner straight down to the middle of the base. By symmetry the cut splits the top 60° angle into two 30° angles and the base into two pieces.' },
          { tex: '\\text{short leg} = \\tfrac12,\\ \\text{hypotenuse} = 1', text: 'Each half of the base is 1 ÷ 2 = 1/2, and the slanted side is still 1. The short leg is opposite the 30° angle.' },
          { tex: '\\sin 30^{\\circ} = \\dfrac{\\text{opposite}}{\\text{hypotenuse}} = \\dfrac{1/2}{1}', text: 'Sine is opposite over hypotenuse, and the hypotenuse is 1 so dividing changes nothing. The answer is exactly 1/2.' },
        ],
        answer: '\\sin 30^{\\circ} = \\tfrac12',
      },
    },
    {
      kind: 'example',
      head: 'Another way: back up from a full turn',
      body: 'A game character faces 300°. Which quadrant is that, and what are the signs of cosine and sine there?',
      art: unitCircle(300, { label: '300°', point: '60° short', caption: 'Going 300° forward is the same landing spot as 60° backward.' }),
      steps: {
        steps: [
          { tex: '360^{\\circ} - 300^{\\circ} = 60^{\\circ}', text: 'Instead of counting 300° forwards, ask how far short of a full turn it is. A full turn is 360°, so the facing is 60° short of it.' },
          { tex: '\\text{60° backwards from due east}', text: 'Going 60° backwards from pointing right is the same as going 300° forwards, since both end at the same spot. Backwards means clockwise, so the hand points below the x-axis.' },
          { tex: '\\text{right of centre, below centre}', text: 'The hand is below the axis but not past the bottom, since 60° is less than 90°. So it points down and to the right, which is Quadrant 4.' },
          { tex: '\\cos 300^{\\circ} > 0,\\ \\sin 300^{\\circ} < 0', text: 'Cosine is the across value and right of centre is positive. Sine is the up value and below centre is negative.' },
        ],
        answer: '\\text{Quadrant 4: cos positive, sin negative}',
      },
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
      body: 'Where does 210° land, what are the signs there, and what is sin 210° exactly?',
      art: unitCircle(210, { label: '210°', legs: true, caption: 'Q3, so both cos and sin are negative — the reference angle back to the axis is 30°.' }),
      steps: {
        steps: [
          { tex: '180^{\\circ} < 210^{\\circ} < 270^{\\circ}', text: 'Compare 210 with the quarter-turn marks: it is past 180° (the left) but short of 270° (the bottom). That puts it in Quadrant 3.' },
          { tex: '\\text{left of centre, below centre}', text: 'Quadrant 3 is the lower-left corner, so the tip is left of the y-axis and below the x-axis. Left makes the across value negative and below makes the up value negative.' },
          { tex: '210^{\\circ} - 180^{\\circ} = 30^{\\circ}', text: 'The reference angle is how far the hand is from the x-axis, here past the left side by 30°. It tells us the size of the values, because the picture is a mirror of the 30° picture.' },
          { tex: '\\sin 210^{\\circ} = -\\sin 30^{\\circ} = -\\tfrac12', text: 'The up distance has the same size as at 30°, which is 1/2. We attach a minus sign because the tip is below the axis. The point is (−0.866, −0.5).' },
        ],
        answer: '\\sin 210^{\\circ} = -\\tfrac12',
      },
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
      why: 'Plot the height of the tip as the hand turns. It climbs to 1 at the top, falls through 0 to −1 at the bottom, and climbs again. After a full turn 2π the hand is back where it started, so every height repeats and the graph must repeat too.',
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
      why: 'Sine alone runs between −1 and 1, so the middle sits at 0 and the top is 1 above it. Multiplying every output by a scales each distance from the middle by a. A peak 1 above the middle becomes a above the middle, so a is the amplitude, and the total height is 2a.',
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
      why: 'Adding k to the output lifts every point of the graph by the same amount k, so nothing changes shape and only the position changes. The old middle at 0 moves to k. The peak and trough sit equally far above and below it, so their average lands exactly on k.',
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
      why: 'Replacing x by Bx makes the input run B times as fast, so the wave finishes its cycle when Bx reaches 360°, which is at x = 360° ÷ B. For the slide, y = sin(x − c) shows at x what plain sine showed at x − c. The picture at x = c now looks like the old picture at 0, so everything moves right by c.',
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
      body: 'Find the amplitude of y = 4 sin(x). What does the 4 do to the wave?',
      steps: {
        steps: [
          { tex: '-1 \\le \\sin x \\le 1', text: 'Plain sine never goes above 1 or below −1, so its amplitude is 1. This is the starting size we are going to stretch.' },
          { tex: '-4 \\le 4\\sin x \\le 4', text: 'Multiply every part of the inequality by 4. Multiplying by a positive number keeps the direction of the signs and stretches every output to 4 times as big.' },
          { tex: '\\text{max} = 4,\\ \\text{min} = -4', text: 'So the highest point is 4 and the lowest is −4. The wave swings 4 above the middle and 4 below it.' },
          { tex: 'A = \\dfrac{4 - (-4)}{2} = 4', text: 'Amplitude is half of max minus min. Half of 8 is 4, which matches the number in front of the sine.' },
        ],
        answer: 'A = 4',
      },

    },
    {
      kind: 'example',
      head: 'Midline at a glance',
      body: 'Find the midline of y = sin(x) + 7. What does adding 7 do to the graph?',
      steps: {
        steps: [
          { tex: 'y = \\sin x \\ \\text{has midline } y = 0', text: 'Plain sine rocks evenly between 1 and −1, so the level it rocks about is 0. That is our starting midline.' },
          { tex: 'y = \\sin x + 7', text: 'Adding 7 to the output lifts every point of the graph straight up by exactly 7. The shape does not change, only the position.' },
          { tex: '\\text{max} = 1 + 7 = 8,\\ \\text{min} = -1 + 7 = 6', text: 'The old peak 1 becomes 8 and the old trough −1 becomes 6. Each point moved up by the same 7.' },
          { tex: 'k = \\dfrac{8 + 6}{2} = 7', text: 'Average the peak and trough to find the middle. That gives 7, which agrees with the number we added.' },
        ],
        answer: 'y = 7',
      },
    },
    {
      kind: 'example',
      head: 'The Ferris wheel over time',
      body: 'A seat follows h = 18 sin(x) + 22 metres. How high and how low does the seat get?',
      steps: {
        steps: [
          { tex: 'A = 18', text: 'The number multiplying sine is the amplitude. It is how far the seat swings above and below the middle, which on a wheel is the radius.' },
          { tex: 'k = 22', text: 'The number added at the end is the midline. It is the level the seat rocks about, which is the height of the wheel centre.' },
          { tex: '\\text{highest} = 22 + 18 = 40', text: 'At the top the seat is a full amplitude above the midline. Add the amplitude to the midline to get 40 m.' },
          { tex: '\\text{lowest} = 22 - 18 = 4', text: 'At the bottom the seat is a full amplitude below the midline, so subtract. That gives 4 m, just above the ground.' },
        ],
        answer: '\\text{from } 4 \\text{ m to } 40 \\text{ m}',
      },
    },
    {
      kind: 'example',
      head: 'Period: squeeze the wave',
      body: 'Find the period of y = sin(2x), in degrees. What does the 2 inside do to the wave?',
      steps: {
        steps: [
          { tex: 'y = \\sin(Bx),\\ B = 2', text: 'Spot the number multiplying x inside the sine. Here that number is 2, and it controls the width of one wave.' },
          { tex: '\\text{one wave: } 2x \\text{ goes from } 0 \\text{ to } 360^{\\circ}', text: 'Plain sine finishes one wave when its input has gone through 360°. The input here is 2x, so we need 2x to reach 360°.' },
          { tex: 'x = \\dfrac{360^{\\circ}}{2} = 180^{\\circ}', text: 'Divide both sides of 2x = 360° by 2. So x only has to travel 180° to finish one wave, since it counts double speed.' },
          { tex: '\\text{two waves in } 360^{\\circ}', text: 'Check: 360° ÷ 180° = 2, so two whole waves fit where plain sine fits one. That matches the picture.' },
        ],
        answer: '180^{\\circ}',
      },

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
    {
      kind: 'example',
      head: 'The heartbeat monitor',
      body: 'A trace is modelled by y = 3 sin(6x), with x in degrees. How wide is one beat?',
      steps: {
        steps: [
          { tex: 'y = 3\\sin(6x)', text: 'Split the equation into its parts. The 3 sits outside the sine and the 6 sits inside, multiplying x. They do different jobs.' },
          { tex: '\\text{one beat} = \\text{one full wave}', text: 'One beat of the trace is one complete wave, which is one period. So the width we want is the period.' },
          { tex: '\\text{period} = \\dfrac{360^{\\circ}}{6} = 60^{\\circ}', text: 'Use the period rule for degrees, 360° divided by the number multiplying x. 6 waves fit into 360°, so each takes 60°.' },
          { tex: '3 \\text{ does not change the width}', text: 'The 3 only multiplies the output, so it makes each beat taller and cannot change how wide it is. Inside changes width, outside changes height.' },
        ],
        answer: '60^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: use highest and lowest',
      body: 'A harbour is 9 m deep at high tide and 3 m at low tide. No equation needed.\nMidline is the average: (9 + 3) ÷ 2 = 6 m. Amplitude is half the gap: (9 − 3) ÷ 2 = 3 m.\nSo the tide is depth = 3 sin(x) + 6. Two extremes hand you the whole model.',
      steps: {
        steps: [
          { tex: '\\text{max} = 9,\\ \\text{min} = 3', text: 'Read the two extremes from the story. High tide is the highest depth and low tide is the lowest, so these two numbers are all we need.' },
          { tex: 'k = \\tfrac{9 + 3}{2} = 6', text: 'The midline sits exactly halfway between the peak and the trough, so average them. 12 divided by 2 is 6 metres.' },
          { tex: 'A = \\tfrac{9 - 3}{2} = 3', text: 'Amplitude is the distance from the middle to the top, which is half of the total gap. The gap is 6, and half of 6 is 3.' },
          { tex: 'd = 3\\sin(x) + 6', text: 'Put the amplitude in front of the sine and add the midline at the end. Check: the top is 6 + 3 = 9 and the bottom is 6 − 3 = 3.' },
        ],
        answer: 'A = 3,\\ k = 6',
      },
    },
    {
      kind: 'example',
      head: 'Another way: ask when the inside is zero',
      body: 'Which way does y = sin(x − 30°) slide, and how far? Instead of memorising a rule, ask when the wave starts.',
      steps: {
        steps: [
          { tex: 'y = \\sin(0) = 0 \\text{ and rising}', text: 'Plain sine starts its climb from the midline when its input is 0. That start is the landmark we will track.' },
          { tex: 'x - 30^{\\circ} = 0', text: 'Our wave starts the same climb when the inside expression is 0. Set the inside equal to zero and solve for x.' },
          { tex: 'x = 30^{\\circ}', text: 'Add 30° to both sides. The wave starts at x = 30° instead of at 0°, so it starts 30° later.' },
          { tex: '\\text{start is later} \\Rightarrow \\text{slide right}', text: 'Starting later means the whole picture moves to the right, like a tide that arrives late. So the wave slides 30° right, even though the sign is a minus.' },
        ],
        answer: '\\text{30° to the right}',
      },
    },
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
    {
      kind: 'challenge',
      head: 'Extra credit: build the daylight model',
      body: 'A town has 16 hours of daylight at midsummer and 8 at midwinter, on a 360-day cycle. Build a sine model of the hours of daylight.',
      steps: {
        steps: [
          { tex: 'k = \\dfrac{16 + 8}{2} = 12', text: 'The midline is the average of the highest and lowest values, which is the typical day length the year rocks about. Add 16 and 8, then halve to get 12 hours.' },
          { tex: 'A = \\dfrac{16 - 8}{2} = 4', text: 'Amplitude is half of the total swing, not the whole swing. The gap is 8 hours and half of that is 4 hours.' },
          { tex: 'B = \\dfrac{360}{360} = 1', text: 'The period is 360 days and the rule is period = 360 ÷ B, so B = 360 ÷ period. That gives 1, so x needs no squeezing.' },
          { tex: '\\text{hours} = 4\\sin(x) + 12', text: 'Put the amplitude in front of the sine, the squeeze inside, and the midline at the end. This is one wave per 360-day year.' },
          { tex: '\\text{max} = 12 + 4 = 16,\\ \\text{min} = 12 - 4 = 8', text: 'Check the model at both extremes: the top is the midline plus the amplitude, 16, and the bottom is the midline minus it, 8. Both match the story.' },
        ],
        answer: '\\text{hours} = 4\\sin(x) + 12',
      },
    },
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
      why: 'The tip of the hand is at (cos θ, sin θ). Drop a vertical line to the x-axis and you get a right triangle with legs cos θ and sin θ and hypotenuse 1. Pythagoras says leg² + leg² = hypotenuse², and 1² is just 1. Check at 45°: (0.707)² + (0.707)² = 0.5 + 0.5 = 1.',
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
      why: 'This is ordinary algebra on the equation sin²θ + cos²θ = 1: subtract the same thing from both sides and the equation stays true. Subtract sin²θ and you get cos²θ = 1 − sin²θ. Check at 30°: cos²30° = 0.75 and 1 − 0.5² = 0.75, so both sides match.',
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
      why: 'Slope is rise over run. The radius from the centre to the tip rises sin θ and runs cos θ, so its slope is sin θ ÷ cos θ, and that ratio is what we call tan θ. At 45° the rise and run are equal, so the slope is 1.',
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
      why: 'Sine is the height of the tip, and a tip going round once passes each height between the top and bottom twice, once on the way up and once on the way down. The two spots are mirror images across the vertical axis, which gives 180° − θ. For example, 30° and 150° both have height 0.5.',
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
      body: 'Does sin²θ + cos²θ = 1 really hold for every angle? Test it on one angle where you know the exact values.',
      steps: {
        steps: [
          { tex: '\\theta = 30^{\\circ}', text: 'Pick a friendly angle whose sine and cosine you know exactly. A test with easy numbers is simple to do by hand and shows the pattern.' },
          { tex: '\\sin 30^{\\circ} = 0.5,\\ \\cos 30^{\\circ} \\approx 0.866', text: 'Read the two values from the unit circle. The tip of the hand at 30° is at about (0.866, 0.5), with cosine across and sine up.' },
          { tex: '0.5^2 = 0.25,\\ \\ 0.866^2 \\approx 0.75', text: 'Square each value separately. Squaring happens before adding, so we get 0.25 and about 0.75.' },
          { tex: '0.25 + 0.75 = 1', text: 'Add the two squares and the total is 1, as the identity says. Try θ = 0° as well: 0² + 1² = 1 again.' },
        ],
        answer: '1 \\ \\checkmark',
      },
    },
    {
      kind: 'example',
      head: 'Find the missing square',
      body: 'For some angle, cos θ = 0.6. Find sin θ if it is positive. Picture a bar of length 1 split into two pieces, the two squares.',
      steps: {
        steps: [
          { tex: '\\cos^{2}\\theta = 0.6^2 = 0.36', text: 'We are given the across value, so square it first. The identity talks about squares, so we need cos²θ, which is 0.36.' },
          { tex: '\\sin^{2}\\theta = 1 - \\cos^{2}\\theta = 1 - 0.36', text: 'The two squares always add to 1, so subtract the known one from 1. Like a bar of length 1, if 0.36 is one piece the other is what is left.' },
          { tex: '\\sin^{2}\\theta = 0.64', text: 'Do the subtraction carefully: 1.00 minus 0.36 is 0.64. Check at the end that 0.36 + 0.64 is 1.' },
          { tex: '\\sin\\theta = \\sqrt{0.64} = 0.8', text: 'Take the square root, since 0.8 × 0.8 = 0.64. We keep the positive root because the problem says sine is positive.' },
        ],
        answer: '\\sin\\theta = 0.8',
      },
    },
    {
      kind: 'example',
      head: 'The game motion check',
      body: 'A game stores a facing direction as cos θ = 0.6, with θ in Quadrant 1. It needs sin θ to move the sprite. Which sign is right?',
      steps: {
        steps: [
          { tex: '\\sin^{2}\\theta = 1 - \\cos^{2}\\theta', text: 'Start from the Pythagorean identity and move cos²θ to the other side. This turns a known cosine into a formula for sine.' },
          { tex: '\\sin^{2}\\theta = 1 - 0.6^2 = 1 - 0.36 = 0.64', text: 'Square 0.6 first to get 0.36, and then subtract from 1. We must square before subtracting, because the identity uses squares.' },
          { tex: '\\sin\\theta = \\pm 0.8', text: 'Take the square root. Both 0.8 and −0.8 square to 0.64, so the equation alone cannot decide between them.' },
          { tex: '\\sin\\theta = 0.8', text: 'Quadrant 1 is up and to the right, so the height is positive. Choose +0.8. Check: 0.36 + 0.64 = 1.' },
        ],
        answer: '\\sin\\theta = 0.8',
      },
    },
    {
      kind: 'example',
      head: 'Simplify with the identity',
      body: 'Simplify (1 − sin²θ) ÷ cos θ, with cos θ not zero. Look for the pattern of 1 minus a square.',
      steps: {
        steps: [
          { tex: '\\dfrac{1 - \\sin^{2}\\theta}{\\cos\\theta}', text: 'Write the expression as a fraction. The top is 1 minus a square, which is the pattern the Pythagorean identity can replace.' },
          { tex: '1 - \\sin^{2}\\theta = \\cos^{2}\\theta', text: 'Rearrange sin²θ + cos²θ = 1 by subtracting sin²θ from both sides. So you may swap the top for cos²θ without changing its value.' },
          { tex: '\\dfrac{\\cos^{2}\\theta}{\\cos\\theta} = \\dfrac{\\cos\\theta\\cdot\\cos\\theta}{\\cos\\theta}', text: 'Write the square as two copies multiplied. This lets us see what can cancel.' },
          { tex: '\\cos\\theta', text: 'Cancel one copy of cos θ from top and bottom. Dividing a number by itself gives 1, and we are allowed because cos θ is not zero.' },
        ],
        answer: '\\cos\\theta',
      },
    },
    {
      kind: 'example',
      head: 'Why tan 45° equals 1',
      body: 'Use tan θ = sin θ ÷ cos θ at 45° to show why tan 45° is exactly 1.',
      steps: {
        steps: [
          { tex: '\\tan 45^{\\circ} = \\dfrac{\\sin 45^{\\circ}}{\\cos 45^{\\circ}}', text: 'Start from the definition, tangent is sine divided by cosine. It is the up value divided by the across value, the slope of the hand.' },
          { tex: '\\text{up} = \\text{across at } 45^{\\circ}', text: 'At 45° the hand is exactly halfway between pointing right and pointing up. So by symmetry it has gone as far up as it has gone across.' },
          { tex: '\\sin 45^{\\circ} = \\cos 45^{\\circ} = \\dfrac{\\sqrt2}{2} \\approx 0.707', text: 'The two legs are equal and the hypotenuse is 1, so each leg squared is 1/2. The leg is √(1/2) = √2/2, about 0.707.' },
          { tex: '\\dfrac{\\sqrt2/2}{\\sqrt2/2} = 1', text: 'Dividing any nonzero number by itself gives 1. So the ugly square roots cancel and nothing is left.' },
        ],
        answer: '\\tan 45^{\\circ} = 1',
      },

      art: rightTriangle({ opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 3, adj: 3 }, title: 'Equal legs, so the ratio is 1', caption: 'Tangent is opposite over adjacent. When the legs match, that ratio can only be 1.' }),
    },
    {
      kind: 'example',
      head: 'Solve sin θ = 0.5',
      body: 'Find every angle between 0° and 360° with height 0.5. Remember that a height on the circle is usually hit twice.',
      steps: {
        steps: [
          { tex: '\\sin\\theta = 0.5', text: 'Sine is the height of the tip, so we want every spot on the circle that is 0.5 above the centre. A flat line at height 0.5 will cross the circle.' },
          { tex: '\\sin^{-1}(0.5) = 30^{\\circ}', text: 'Use the inverse sine, or remember the exact value, to find the first angle. A calculator gives one answer only, the one in Quadrant 1.' },
          { tex: '180^{\\circ} - 30^{\\circ} = 150^{\\circ}', text: 'Sine is also positive in Quadrant 2, where the height is the same. The mirror spot across the vertical axis is 180° minus the first angle.' },
          { tex: '\\sin 150^{\\circ} = 0.5', text: 'Check the partner. 150° has reference angle 30° and the point is above the axis, so its height is +0.5. Both answers lie in 0° to 360°.' },
        ],
        answer: '30^{\\circ} \\text{ and } 150^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: read it off the wave',
      body: 'Same equation sin θ = 0.5, different picture. Solve it by crossing the wave with a flat line.',
      steps: {
        steps: [
          { tex: 'y = \\sin\\theta,\\ 0^{\\circ} \\le \\theta \\le 360^{\\circ}', text: 'Graph one full period of sine. The graph climbs to 1, falls to −1 and returns, and its height at each angle is the sine of that angle.' },
          { tex: 'y = 0.5', text: 'Draw a horizontal line at height 0.5. Any point where the wave sits on this line has sine equal to 0.5, which is what we want.' },
          { tex: '\\text{two crossings}', text: 'The wave crosses the line once while climbing and once while falling. The line is below the peak 1 and above the trough −1, so it is crossed twice.' },
          { tex: '\\theta = 30^{\\circ}\\ \\text{and}\\ 150^{\\circ}', text: 'Read the angles under the crossings. The climbing one is the calculator value 30° and the falling one is 180° − 30° = 150°.' },
        ],
        answer: '30^{\\circ}\\ \\text{and}\\ 150^{\\circ}',
      },

      art: funcGraph([{ f: (x) => Math.sin(x), label: 'sin' }, { f: (x) => Math.cos(x), label: 'cos', color: SKY }], { range: { x: [0, 6.5], y: [-2, 2] }, xTickText: (v) => (v === 0 ? '0' : v === 3 ? 'π' : v === 6 ? '2π' : ''), title: 'Sine and cosine, a quarter turn apart', caption: 'Cosine is sine that started early. Their squares still add to 1 at every single point.' }),
    },
    {
      kind: 'example',
      head: 'Another way: ride the rotating platform',
      body: 'A platform lifts a robot as it spins, and its height is sin θ. Why does the height 0.5 happen twice, and where?',
      steps: {
        steps: [
          { tex: '\\sin 30^{\\circ} = 0.5', text: 'On the way up the robot reaches height 0.5 at 30°. This first visit is the one a calculator would report.' },
          { tex: '\\text{top at } 90^{\\circ},\\ 90^{\\circ} - 30^{\\circ} = 60^{\\circ}', text: 'The first visit happens 60° before the very top at 90°. The ride is symmetric about the top, so the way down is a mirror image of the way up.' },
          { tex: '90^{\\circ} + 60^{\\circ} = 150^{\\circ}', text: 'Going down, the robot passes the same height 60° after the top. So the second visit is at 150°, which is the same as 180° − 30°.' },
          { tex: '\\text{only top and bottom are hit once}', text: 'Only the very top and the very bottom are passed once per turn, because they are the turning points. Every height in between is passed twice.' },
        ],
        answer: '30^{\\circ}\\ \\text{and}\\ 150^{\\circ}',
      },
    },
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
    {
      kind: 'challenge',
      head: 'Extra credit: verify a ramp calculation',
      body: 'An app solves tan θ = 1 for 0° ≤ θ < 360° and reports only 45°. What is missing?',
      steps: {
        steps: [
          { tex: '\\tan 45^{\\circ} = \\dfrac{0.707}{0.707} = 1', text: 'The app is right as far as it goes, because at 45° sine and cosine are both about 0.707 and a number divided by itself is 1.' },
          { tex: '\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}', text: 'Tangent is a fraction, so it only cares about the ratio. Another angle works if sine and cosine keep the same ratio.' },
          { tex: '\\dfrac{-0.707}{-0.707} = 1', text: 'If both sine and cosine flip sign, the two negatives cancel and the fraction is still 1. The hand pointing the exact opposite way does this.' },
          { tex: '45^{\\circ} + 180^{\\circ} = 225^{\\circ}', text: 'The opposite direction is half a turn away, and half a turn is 180°. 225° is in Quadrant 3, where tangent is positive.' },
        ],
        answer: '45^{\\circ}\\ \\text{and}\\ 225^{\\circ}',
      },
    },
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
