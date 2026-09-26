import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, areaModel, art, axes, dot, flow, funcGraph, line, numberLine, tape, text, triangle } from '../slideArt';

// PC Units 12-14 — Law of Sines & Law of Cosines, Sequences & series, and the
// doorway to calculus. 16-17 slides per deck, ~3 short sentences each, written
// for an 11-14-year-old: objective → concepts → examples (with "Another way"
// alternates) → pro tip → trap(s) → challenge → summary.
export const PC_SLIDES_U12_14: SlideBank = {
  'PC-12': [
    {
      kind: 'objective',
      head: 'Solving any triangle',
      body: 'Today you will solve triangles that have NO square corner. You get two new tools, and the real skill is picking the right one. Think of it as reaching into a toolbox.',
      art: triangle({ A: 'A', B: 'B', C: 'C', a: 'a', b: 'b', c: 'c', caption: 'Small letters are sides; capitals are the angles across from them.' }),
    },
    { kind: 'concept', head: 'Every triangle obeys rules', body: 'Right triangles were easy: Pythagoras and SOH-CAH-TOA did the job. But most triangles in the real world are crooked. These two laws work on ALL of them, square corner or not.' },
    {
      kind: 'concept',
      head: 'Law of Sines: partners across the room',
      body: 'Every side has a partner — the angle sitting ACROSS from it. The law says a ÷ sin A = b ÷ sin B = c ÷ sin C. Reach for it when you already have one complete PAIR: a side and the angle facing it.',
      formula: {
        tex: '\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}',
        note: 'Each side is paired with the angle OPPOSITE it — never the one next to it.',
        parts: [
          { sym: 'a', means: 'the side, and A is the angle facing it', tone: 'accent' },
          { sym: '=', means: 'use it when you have a matching side-and-angle pair', tone: 'ok' },
        ],
      },
      art: triangle({ A: 'A', B: 'B', C: 'C', a: 'a opposite A', b: 'b', c: 'c', caption: 'Side a faces angle A. Pair them, and the Law of Sines does the rest.' }),
    },
    {
      kind: 'concept',
      head: 'Law of Cosines: Pythagoras plus a fix',
      body: 'The rule is c² = a² + b² − 2ab × cos C. The first part is plain old Pythagoras. The last part is a CORRECTION, and it fixes the answer when the corner is not square.',
      art: triangle({ A: 'θ', B: 'B', C: 'C', a: 'a', b: 'b', c: 'c', shape: [[70, 200], [330, 200], [210, 80]], title: 'Two sides and the angle BETWEEN them', caption: 'It is a² + b² with a correction term for the angle. When that angle is 90° the correction vanishes.' }),
      formula: {
        tex: 'c^{2} = a^{2} + b^{2} - 2ab\\cos C',
        note: 'Pythagoras with a correction term. If C is 90°, cos C is 0 and the fix vanishes.',
        parts: [
          { sym: 'C', means: 'the angle BETWEEN the two known sides', tone: 'warn' },
          { sym: '-2ab\\cos C', means: 'the correction for a corner that is not square', tone: 'accent' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Pick the tool that fits',
      body: 'You would not use a hammer on a screw. If you have a matching side-angle pair, use the Law of Sines. If you have two sides and the angle between (SAS), or all three sides (SSS), use the Law of Cosines.',
      art: flow([{ label: 'Angle with its opposite side? → Sines', color: SKY }, { label: 'Two sides and the angle between? → Cosines', color: AMB }, { label: 'All three sides? → Cosines', color: EMR }], { title: 'Match the tool to what you have' }),
      compare: {
        cols: [
          { title: 'Law of Sines', tex: 'ASA \\cdot AAS \\cdot SSA', lines: ['You have a side AND', 'the angle facing it'], tone: 'ok' },
          { title: 'Law of Cosines', tex: 'SAS \\cdot SSS', lines: ['No matching pair', 'Two sides and the corner'], tone: 'accent' },
        ],
        note: 'One question decides it: do you already have a side paired with its opposite angle?',
      },
    },
    {
      kind: 'example',
      head: 'Law of Sines: find a side',
      body: 'Angle A = 30°, angle B = 90°, and side b = 10.\nSide b partners with angle B, so: a ÷ sin 30° = 10 ÷ sin 90°.\nsin 90° = 1 and sin 30° = 0.5, so a = 10 × 0.5 = 5.',
      steps: {
        steps: [
          { tex: '\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}', text: 'Write the two pairs you care about.' },
          { tex: '\\dfrac{a}{\\sin 40^{\\circ}} = \\dfrac{10}{\\sin 75^{\\circ}}', text: 'Fill in what you know.' },
          { tex: 'a = \\dfrac{10\\sin 40^{\\circ}}{\\sin 75^{\\circ}}', text: 'Cross-multiply and divide.' },
        ],
        answer: 'a \\approx 6.7',
      },
    },
    {
      kind: 'example',
      head: 'Law of Cosines: find a side',
      body: 'Sides 3 and 8 with a 60° angle squeezed between them.\nc² = 9 + 64 − 2(3)(8)(0.5) = 73 − 24 = 49.\nc = 7. The corner is narrower than 90°, so the far side got pulled IN.',
      steps: {
        steps: [
          { tex: 'a = 8,\\ b = 5,\\ C = 60^{\\circ}', text: 'Two sides and the angle between them.' },
          { tex: 'c^{2} = 64 + 25 - 2(8)(5)\\cos 60^{\\circ}', text: 'Substitute into the rule.' },
          { tex: 'c^{2} = 89 - 40 = 49', text: 'cos 60° is exactly 0.5.' },
        ],
        answer: 'c = 7',
      },
    },
    { kind: 'example', head: 'Two friends spot a drone', body: 'They stand 100 m apart. Friend A sights the drone at 30°, friend B at 60°, so the drone corner is 90°.\nThe 100 m gap faces the 90° corner — a perfect pair. The B-to-drone side faces 30°.\na ÷ sin 30° = 100 ÷ 1, so a = 50 m.' },
    { kind: 'example', head: 'The boat that turns', body: 'A boat sails 5 km, turns so the inside angle is 120°, then sails 16 km. How far from the start?\nc² = 25 + 256 − 2(5)(16)(−0.5). Subtracting a negative ADDS: c² = 281 + 80 = 361.\nc = 19 km. A wide corner pushed the ends farther apart.' },
    { kind: 'example', head: 'Across the pond you cannot walk', body: 'From one park corner, paths run 30 m and 80 m with 60° between them. How far apart are their far ends?\nc² = 900 + 6400 − 2(30)(80)(0.5) = 7300 − 2400 = 4900.\nc = 70 m. Walking around takes 110 m, so the straight cut saves 40 m.' },
    {
      kind: 'example',
      head: 'Three sides, find the angle',
      body: 'A triangle has sides 3, 5, and 7. What is the corner facing the 7?\nPut 7 in the c spot: 49 = 9 + 25 − 30 cos C, so 30 cos C = −15.\ncos C = −0.5, which means C = 120°. A negative cosine always means a wide corner.',
      formula: {
        tex: '\\cos C = \\dfrac{a^{2} + b^{2} - c^{2}}{2ab}',
        note: 'Same law, rearranged — feed it three sides and it hands back the angle.',
      },
    },
    {
      kind: 'example',
      head: 'Another way: shrink the numbers',
      body: 'A ball field corner: edges of 90 ft and 150 ft with 120° between them.\nDivide both by 30 first: 3 and 5. Then c² = 9 + 25 + 15 = 49, so the small answer is 7.\nScale back by 30: 210 ft. Same shape, much friendlier arithmetic.',
      table: {
        head: ['real', 'shrunk', 'check'],
        rows: [['840 m', '8.4', 'same shape'], ['500 m', '5.0', 'same angles'], ['answer ×100', '7.0', '700 m']],
        note: 'Angles do not care about scale, so solve the easy triangle and scale the answer back.',
      },
    },
    { kind: 'example', head: 'Another way: predict, then check', body: 'For sides 5, 12, 13, is the corner facing 13 sharp, square, or wide?\nTest with Pythagoras: 25 + 144 = 169, and 13² = 169 too. Predict exactly square.\nThe Law of Cosines agrees: 169 = 169 − 120 cos C forces cos C = 0, so C = 90°.' },
    {
      kind: 'protip',
      head: 'Label the picture before you compute',
      body: 'Sketch the triangle and write each side right across from its own angle. If two angles are known, fill in the third first — the three must total 180°, and that free angle often completes the pair you need. Then check what you have: a matching pair, SAS, or SSS. The label step tells you which tool to grab, and it takes ten seconds.',
      art: triangle({ A: '40°', B: '75°', a: '?', c: '10', caption: 'Mark every known value ON the sketch — the matching pair then jumps out.' }),
    },
    {
      kind: 'trap',
      head: 'Trap: the angle must be BETWEEN',
      body: 'In c² = a² + b² − 2ab cos C, the angle C has to sit between the two sides you squared. Grab a different corner and every number after that is wrong. Check the picture: does that angle really touch both a and b?',
      art: triangle({ A: 'θ', B: 'B', C: 'C', a: 'side 2', c: 'side 1', title: 'The angle sits where the two sides meet', caption: 'Law of Cosines only works when the known angle is the corner the two known sides form.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\cos(\\text{any angle})', lines: ['Grabs a corner at random', 'Answer is nonsense'], tone: 'bad' },
          { title: 'Right', tex: '\\cos(\\text{angle between } a,b)', lines: ['The corner the two sides make', 'Opposite the side you want'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: how much does the shortcut save?', body: 'The boat sails 5 km, turns 120°, then 16 km — that is 21 km of sailing.\nThe straight route you already found is 19 km.\n21 − 19 = 2 km saved. A gentle bend barely costs extra, which is why the saving is so small.' },
    {
      kind: 'summary',
      head: 'Two tools, one toolbox',
      body: 'Law of Sines needs a matching pair: a ÷ sin A = b ÷ sin B. Law of Cosines handles SAS and SSS: c² = a² + b² − 2ab cos C. When the corner is 90°, the correction vanishes and Pythagoras walks back in.',
      formula: {
        tex: '\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} \\qquad c^{2} = a^{2} + b^{2} - 2ab\\cos C',
        parts: [
          { sym: '\\sin', means: 'a side paired with the angle facing it', tone: 'ok' },
          { sym: '\\cos', means: 'two sides and the corner between them', tone: 'accent' },
        ],
      },
    },
  ],
  'PC-13': [
    {
      kind: 'objective',
      head: 'Sequences & series',
      body: 'Today you will find any term of a pattern without listing them all. Then you will ADD a whole list in one line. One trick from a nine-year-old does most of the work.',
      art: flow([{ label: 'Same jump: arithmetic', color: SKY }, { label: 'Same multiplier: geometric', color: AMB }, { label: 'A series adds them up', color: EMR }], { title: 'Two patterns, one sum' }),
    },
    { kind: 'concept', head: 'A list with a rule', body: 'A SEQUENCE is an ordered list where a rule makes the next item. 3, 7, 11, 15 is a sequence. Order matters — the third term is the third one, always.' },
    {
      kind: 'concept',
      head: 'Arithmetic: same jump every time',
      body: 'ARITHMETIC sequences ADD the same amount d each step. The formula is term n = first + (n − 1) × d. Picture even hops along a number line, all exactly the same size.',
      formula: {
        tex: 'a_n = a_1 + (n - 1)d',
        note: 'Start where you start, then take (n − 1) jumps — not n, because the first term needed none.',
        parts: [
          { sym: 'a_1', means: 'the first term', tone: 'accent' },
          { sym: 'd', means: 'the common difference — the same jump every time', tone: 'ok' },
          { sym: 'n - 1', means: 'how many jumps you actually take', tone: 'warn' },
        ],
      },
      art: numberLine(3, 19, [
          { at: 3, label: 'a₁', color: SKY },
          { at: 7, label: 'a₂', color: AMB },
          { at: 11, label: 'a₃', color: AMB },
          { at: 15, label: 'a₄', color: AMB },
          { at: 19, label: 'a₅', color: EMR },
        ], { step: 4, title: 'each jump is +4', caption: 'Four hops from the first term to the fifth — hence n − 1.' }),
    },
    {
      kind: 'concept',
      head: 'Geometric: same multiplier every time',
      body: 'GEOMETRIC sequences MULTIPLY by the same factor r each step. The formula is term n = first × r^(n−1). If the gaps keep growing, stop subtracting and start dividing to find r.',
      art: funcGraph([{ f: (x) => 2 * Math.pow(3, x - 1), label: '2, 6, 18, 54' }], { range: { x: [0, 5], y: [0, 60] }, points: [{ x: 1, y: 2 }, { x: 2, y: 6 }, { x: 3, y: 18 }, { x: 4, y: 54 }], xLabel: 'term', yLabel: 'value', title: 'Tripling curves upward fast', caption: 'A constant multiplier bends the dots into a curve that keeps getting steeper.' }),
      formula: {
        tex: 'a_n = a_1 \\cdot r^{\\,n-1}',
        note: 'Same shape as the arithmetic rule, but the jumps are multiplications.',
        parts: [
          { sym: 'r', means: 'the common ratio — divide any term by the one before it', tone: 'ok' },
          { sym: 'n - 1', means: 'how many times you multiply', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'A series is the SUM',
      body: 'A sequence is the list; a SERIES is the total when you add the list up. Adding one at a time works but is slow. For arithmetic lists you can PAIR THE ENDS and finish in one line.',
      art: tape([{ label: 'terms', boxes: 5, each: '+', color: SKY }, { label: 'the sum', boxes: 1, each: 'S', color: EMR }], { total: 'a series is one number, not a list', title: 'Sequence lists, series totals', caption: 'The sequence is the row of terms. The series is what you get when you add them all up.' }),
      compare: {
        cols: [
          { title: 'Sequence', tex: '3,\\ 7,\\ 11,\\ 15', lines: ['A list', 'Commas between'], tone: 'accent' },
          { title: 'Series', tex: '3 + 7 + 11 + 15', lines: ['One total', 'Plus signs between'], tone: 'ok' },
        ],
        note: 'Same numbers — the question is whether you list them or add them up.',
      },
    },
    {
      kind: 'example',
      head: 'Next term: 3, 7, 11, 15, …',
      body: 'Check the gaps: 4, 4, 4 — all the same.\nSame gap means arithmetic with d = 4.\n15 + 4 = 19. Writing the gaps under the list makes the rule jump out.',
      steps: {
        steps: [
          { tex: '7 - 3 = 4', text: 'Subtract neighbours to find the common difference.' },
          { tex: 'd = 4', text: 'The same gap appears every time.' },
          { tex: '15 + 4 = 19', text: 'Add one more jump.' },
        ],
        answer: '19',
      },
    },
    {
      kind: 'example',
      head: 'Next term: 2, 6, 18, 54, …',
      body: 'The gaps are 4, 12, 36 — not equal, so it is not arithmetic.\nDivide instead: 6 ÷ 2 = 3 and 18 ÷ 6 = 3. Geometric with r = 3.\n54 × 3 = 162.',
      steps: {
        steps: [
          { tex: '6 \\div 2 = 3', text: 'Divide neighbours to find the common ratio.' },
          { tex: 'r = 3', text: 'The same multiplier every time.' },
          { tex: '54 \\cdot 3 = 162', text: 'One more multiplication.' },
        ],
        answer: '162',
      },
    },
    { kind: 'example', head: 'Seats in the theatre', body: 'Row 1 has 12 seats and each row adds 3 more. How many in row 20?\nArithmetic: first = 12, d = 3, and row 20 has taken 19 jumps.\n12 + 19(3) = 12 + 57 = 69 seats.' },
    {
      kind: 'example',
      head: 'Gauss and the numbers 1 to 100',
      body: 'His teacher wanted quiet. Nine-year-old Carl Gauss answered in seconds.\nHe paired the ends: 1 + 100 = 101, 2 + 99 = 101, every pair the same. 100 numbers make 50 pairs.\n50 × 101 = 5050. The shortcut: sum = n × (first + last) ÷ 2.',
      formula: {
        tex: 'S_n = \\dfrac{n(a_1 + a_n)}{2}',
        note: 'Pair the first with the last, the second with the second-last — every pair has the same total.',
      },
      steps: {
        steps: [
          { tex: '1 + 100 = 101', text: 'Pair the outside numbers.' },
          { tex: '50 \\text{ pairs}', text: 'A hundred numbers make fifty pairs.' },
          { tex: '50 \\cdot 101', text: 'Multiply.' },
        ],
        answer: '5050',
      },
      art: numberLine(1, 9, [
          { at: 1, label: '1', color: SKY },
          { at: 9, label: '9', color: SKY },
          { at: 2, label: '2', color: AMB },
          { at: 8, label: '8', color: AMB },
          { at: 5, label: '5', color: EMR },
        ], { step: 1, title: 'pair the ends: every pair makes 10', caption: 'Gauss saw it at seven years old — fold the list in half and add.' }),
    },
    { kind: 'example', head: 'The pyramid of cans', body: 'Bottom row 20 cans, one fewer each row up, 1 on top.\nPair the ends just like Gauss: 20 + 1 = 21, 19 + 2 = 21. Twenty rows make ten pairs.\n10 × 21 = 210 cans.' },
    { kind: 'example', head: 'Saving 5 dollars more each week', body: 'Week 1 you save 5, week 2 saves 10, and so on for 12 weeks.\nFirst find the last week: 5 + 11(5) = 60. Now pair the ends.\nSum = 12 × (5 + 60) ÷ 2 = 6 × 65 = 390 dollars.' },
    {
      kind: 'example',
      head: 'Another way: build it from a table',
      body: 'For the theatre, do not memorize — build. Row 1: 12. Row 2: 15. Row 3: 18. Row 4: 21.\nNotice row 4 is 12 + 3 threes, and 3 is one less than 4.\nSo row 20 is 12 + 19 threes = 69. The table finds the rule; the formula makes the leap.',
      table: {
        head: ['n', 'jumps taken', 'term'],
        rows: [['1', '0', '3'], ['2', '1', '7'], ['3', '2', '11'], ['4', '3', '15']],
        mark: 0,
        note: 'The middle column is n − 1 every time. That is where the formula comes from.',
      },
    },
    {
      kind: 'example',
      head: 'Another way: two pyramids make a rectangle',
      body: 'Build a second can pyramid, flip it upside down, and push it against the first.\nEvery row now holds 20 + 1 = 21 cans, and there are 20 rows: 420 cans.\nThat is two pyramids, so one is 420 ÷ 2 = 210. This picture IS the pairing shortcut.',
      art: areaModel([{ label: 'n terms', w: 3 }], [{ label: 'two copies', h: 1 }], [['n(n + 1)']], { title: 'Two triangles form a rectangle', total: 'so one triangle is n(n + 1) ÷ 2', caption: 'Stack the pyramid beside an upside-down copy and you get a clean rectangle you can just multiply.' }),
    },
    {
      kind: 'protip',
      head: 'Subtract first, then divide',
      body: 'Not sure which kind of sequence you have? Subtract neighbouring terms. If the differences match, it is arithmetic. If they do not, divide neighbouring terms instead and look for a matching ratio. Then count jumps carefully: term 10 of "start at 5, add 4" is 5 + 9(4) = 41.',
      compare: {
        cols: [
          { title: 'Subtract works', tex: '7 - 3 = 4', lines: ['Same each time?', 'Arithmetic'], tone: 'accent' },
          { title: 'Divide works', tex: '6 \\div 2 = 3', lines: ['Same each time?', 'Geometric'], tone: 'ok' },
        ],
        note: 'Try subtracting. If the gaps are not equal, try dividing instead.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: the (n − 1), not n',
      body: 'Term 10 of "start at 5, add 4" is NOT 5 + 10(4) = 45. The first term has taken zero jumps, so term 10 has taken only nine: 5 + 9(4) = 41. Every off-by-one error in this unit comes from this one spot.',
      compare: {
        cols: [
          { title: 'Wrong', tex: 'a_n = a_1 + nd', lines: ['Overshoots by one jump', 'a₁ comes out wrong'], tone: 'bad' },
          { title: 'Right', tex: 'a_n = a_1 + (n-1)d', lines: ['First term needs no jump', 'Check with n = 1'], tone: 'ok' },
        ],
        note: 'Always test your rule on n = 1. It must give back the first term exactly.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: the bouncing ball', body: 'A ball rises 16 cm, then 8, then 4, forever. Total rise?\nWatch the running total: 16, 24, 28, 30, 31, 31.5 — each bounce closes half the gap left to 32.\nFor a shrinking geometric series, total = first ÷ (1 − r) = 16 ÷ 0.5 = 32 cm.' },
    {
      kind: 'summary',
      head: 'List it, jump to it, add it',
      body: 'Arithmetic adds d: term n = first + (n − 1)d. Geometric multiplies by r: term n = first × r^(n−1). To add an arithmetic list, pair the ends: n × (first + last) ÷ 2. And a shrinking list can add up to a finite number — which is a limit in disguise.',
      formula: {
        tex: 'a_n = a_1 + (n-1)d \\qquad a_n = a_1 r^{\\,n-1} \\qquad S_n = \\tfrac{n(a_1 + a_n)}{2}',
        parts: [
          { sym: 'd', means: 'a common difference means arithmetic', tone: 'accent' },
          { sym: 'r', means: 'a common ratio means geometric', tone: 'ok' },
          { sym: 'S_n', means: 'the sum — pair the ends and multiply', tone: 'warn' },
        ],
      },
    },
  ],
  'PC-14': [
    {
      kind: 'objective',
      head: 'Limits & rate of change',
      body: 'Today you will ask a brand-new kind of question: where is this heading? Then you will squeeze two points together until they point at one instant. This is the last stop before calculus.',
      art: flow([{ label: 'Where is the curve heading?', color: SKY }, { label: 'Smooth means substitute', color: AMB }, { label: '0 ÷ 0 means cancel first', color: EMR }], { title: 'What a limit asks' }),
    },
    {
      kind: 'concept',
      head: 'A limit asks "where is this heading?"',
      body: 'A LIMIT is the value a function approaches as the input creeps toward some number. It does not care whether the function ever LANDS there. Heading toward and arriving at are two different questions.',
      formula: {
        tex: '\\lim_{x \\to a} f(x) = L',
        note: 'Read it as: as x creeps toward a, the output heads toward L — whether or not it ever arrives.',
        parts: [
          { sym: 'x \\to a', means: 'sneak up on a, from both sides', tone: 'accent' },
          { sym: 'L', means: 'the value the outputs are heading for', tone: 'ok' },
        ],
      },
      art: (() => {
        const ax = axes({ x: [0, 6], y: [0, 9] }, { ticks: { x: [1, 2, 3, 4, 5], y: [2, 4, 6, 8] }, grid: true, pad: 30 });
        let b = ax.body + ax.curve((x) => x + 3, AMB, 2.8);
        b += line(ax.X(3), ax.Y(0), ax.X(3), ax.Y(6), SKY, 2, '5 4');
        b += line(ax.X(0), ax.Y(6), ax.X(3), ax.Y(6), SKY, 2, '5 4');
        b += `<circle cx="${ax.X(3)}" cy="${ax.Y(6)}" r="5" fill="none" stroke="${EMR}" stroke-width="2.4"/>`;
        b += text(ax.X(1.7), ax.Y(7.8), 'heading for 6', { size: 12, fill: EMR });
        b += text(ax.X(3), ax.Y(0.9), 'x → 3', { size: 12, fill: SKY });
        return art('A straight line with an open circle at the point above x equals 3, showing the value it heads toward', b,
          'The open circle says the point is missing — the limit is where it WOULD be.');
      })(),
    },
    {
      kind: 'concept',
      head: 'Smooth means just substitute',
      body: 'If the rule has no holes and no jumps nearby, walk right in and plug the number in. For 3x + 1 as x → 2, the answer is simply 3(2) + 1 = 7. Most limits really are that easy.',
      art: funcGraph([{ f: (x) => x * x, label: 'y = x²' }], { range: { x: [-3, 4], y: [-2, 10] }, points: [{ x: 2, y: 4, label: 'just plug in 2' }], title: 'No holes, no jumps, no drama', caption: 'When the curve is unbroken at that x, the limit is simply the value there.' }),
      compare: {
        cols: [
          { title: 'No break there', tex: '\\lim_{x \\to 2}(3x + 1)', lines: ['Just put 2 in', 'Answer is 7'], tone: 'ok' },
          { title: 'A break there', tex: '\\lim_{x \\to 3}\\dfrac{x^{2}-9}{x-3}', lines: ['Substitution gives 0/0', 'Factor first'], tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: '0 ÷ 0 is a signal, not an answer',
      body: 'When substituting gives 0 ÷ 0, the problem is not broken — it is telling you a factor cancels. Factor the top, cancel the shared piece, and substitute again. What you found is a HOLE in the graph.',
      art: funcGraph([{ f: (x) => x + 3, label: '(x² − 9) ÷ (x − 3)' }], { range: { x: [-1, 6], y: [0, 10] }, points: [{ x: 3, y: 6, label: 'limit is 6', hollow: true, color: ROSE }], title: 'Cancel the factor and the answer appears', caption: 'The point at x = 3 is missing, but the curve either side heads straight for 6.' }),
      steps: {
        steps: [
          { tex: '\\dfrac{0}{0}', text: 'This is not a number — it is the problem telling you to do more work.' },
          { tex: '\\text{factor and cancel}', text: 'The zero on top and the zero underneath share a factor.' },
          { tex: '\\text{then substitute}', text: 'Once it cancels, walking straight in works.' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Average rate, then the instant',
      body: 'AVERAGE RATE OF CHANGE is rise ÷ run between two points — a car\'s trip summary. Slide the two points together and the average points at the INSTANT rate, the speedometer reading right now. Zoom in far enough and any smooth curve looks like a straight line.',
      formula: {
        tex: '\\dfrac{f(b) - f(a)}{b - a}',
        note: 'Rise over run between two points. Shrink the gap and it becomes the speed at one instant.',
      },
      art: (() => {
        const ax = axes({ x: [0, 4.2], y: [0, 9] }, { ticks: { x: [1, 2, 3, 4], y: [2, 4, 6, 8] }, grid: true, pad: 30 });
        let b = ax.body + ax.curve((x) => 0.55 * x * x, AMB, 2.8);
        b += line(ax.X(1), ax.Y(0.55), ax.X(3.6), ax.Y(7.13), SKY, 2.4);
        b += dot(ax.X(1), ax.Y(0.55), 4.5, SKY) + dot(ax.X(3.6), ax.Y(7.13), 4.5, SKY);
        // a true tangent at x = 1.2: slope 1.1x, so 1.32 there
        b += line(ax.X(0.6), ax.Y(0), ax.X(2.6), ax.Y(2.64), EMR, 2.4, '5 4');
        b += dot(ax.X(1.2), ax.Y(0.792), 4.5, EMR);
        b += text(ax.X(3.15), ax.Y(4.2), 'average', { size: 12, fill: SKY });
        b += text(ax.X(1.1), ax.Y(3.1), 'instant', { size: 12, fill: EMR });
        return art('A curve with a straight line joining two of its points and a dashed line touching it at one point', b,
          'The solid line is the average between two points; slide them together and you get the dashed one.');
      })(),
    },
    {
      kind: 'example',
      head: 'Walk right in: 3x + 1 as x → 2',
      body: 'The graph is a straight line with no gaps near x = 2.\nNothing is broken, so the limit is just the value: 3(2) + 1.\nThe answer is 7. Try 1.99 and 2.01 if you want proof: 6.97 and 7.03.',
      steps: {
        steps: [
          { tex: '\\lim_{x \\to 2}(3x + 1)', text: 'The line has no break at x = 2.' },
          { tex: '3(2) + 1', text: 'So just substitute.' },
        ],
        answer: '7',
      },
    },
    { kind: 'example', head: 'A hole in the road', body: 'A function gives 3.9 at x = 1.9, 3.99 at 1.99, 4.01 at 2.01, and 4.1 at 2.1 — but nothing at x = 2.\nBoth sides are squeezing toward the same number.\nThe limit is 4, even though one brick is missing from the road.' },
    {
      kind: 'example',
      head: 'Cancel the factor: (x² − 9) ÷ (x − 3)',
      body: 'Substituting x = 3 gives 0 ÷ 0, so keep working.\nFactor the top: (x − 3)(x + 3). Cancel the shared (x − 3), leaving x + 3.\nNow substitute: 3 + 3 = 6. The graph is the line y = x + 3 with one open circle punched out.',
      steps: {
        steps: [
          { tex: '\\dfrac{x^{2} - 9}{x - 3}', text: 'Substituting 3 gives 0/0 — do not stop there.' },
          { tex: '\\dfrac{(x-3)(x+3)}{x-3}', text: 'Factor the difference of two squares.' },
          { tex: 'x + 3', text: 'Cancel the shared factor.' },
          { tex: '3 + 3', text: 'Now substitution works.' },
        ],
        answer: '6',
      },
    },
    { kind: 'example', head: 'The car\'s trip summary', body: 'A car is 30 km from home at 1 hour and 150 km at 3 hours.\nAverage speed = change in distance ÷ change in time = (150 − 30) ÷ (3 − 1) = 60 km/h.\nA runner\'s splits work the same way: 100 m at 15 s and 400 m at 75 s gives 300 ÷ 60 = 5 m/s. Subtract first, always.' },
    {
      kind: 'example',
      head: 'Zooming in on the graphing app',
      body: 'Zoom in on y = x² at x = 3 and the curve slowly straightens out.\nThe average rates from 3 to 3.1, to 3.01, to 3.001 are 6.1, 6.01, 6.001.\nThe leftovers are being squeezed to nothing, so the instant rate at x = 3 is 6.',
      table: {
        head: ['x', '(x² − 9) ÷ (x − 3)'],
        rows: [['2.9', '5.9'], ['2.99', '5.99'], ['3', 'undefined'], ['3.01', '6.01'], ['3.1', '6.1']],
        mark: 2,
        note: 'The value AT 3 does not exist, but both sides are clearly heading for 6.',
      },
    },
    {
      kind: 'example',
      head: 'Another way: do it with a step h',
      body: 'Instead of a table, take a step of size h from x = 3 on y = x².\nRate = ((3 + h)² − 9) ÷ h = (6h + h²) ÷ h = 6 + h.\nLet h shrink to 0 and only the 6 survives. The h WAS the extra bit in 6.1 and 6.01.',
      formula: {
        tex: '\\dfrac{f(a + h) - f(a)}{h}, \\quad h \\to 0',
        note: 'One point plus a tiny step h. Let h shrink to nothing and you have the instant rate.',
      },
    },
    { kind: 'example', head: 'Another way: read it off the graph', body: 'A room cools overnight: T = 18 + 6 ÷ t degrees after t hours.\nSketch it — the curve drops fast, then flattens, hugging a horizontal line without crossing it.\nThat line sits at 18, so the limit is 18 degrees. The table agrees: 19, 18.5, 18.1, 18.01.' },
    {
      kind: 'protip',
      head: 'Sneak up from both sides',
      body: 'Stuck on a limit? Build a tiny table: try inputs just below the target, then just above. If both columns close in on the same number, that number is your limit. It is slower than algebra but it never lies to you.',
      table: {
        head: ['from below', 'from above', 'heading for'],
        rows: [['1.9 → 6.7', '2.1 → 7.3', '7'], ['1.99 → 6.97', '2.01 → 7.03', '7'], ['1.999 → 6.997', '2.001 → 7.003', '7']],
        note: 'Both sides must agree. If they head for different values, the limit does not exist.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: 0 ÷ 0 does not mean zero',
      body: 'Getting 0 ÷ 0 does not mean the limit is 0, and it does not mean there is no answer. It means the top and bottom share a factor that still needs cancelling. Factor, cancel, then substitute again.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\tfrac{0}{0} = 0', lines: ['Treats it as an answer', 'Stops too early'], tone: 'bad' },
          { title: 'Right', tex: '\\tfrac{0}{0} \\to \\text{factor}', lines: ['A signal to keep going', 'Cancel, then substitute'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: average is not the same as instant',
      body: 'A 60 km/h trip average tells you nothing about any single second — you stopped at lights and sped up on the highway. Only shrinking the time window to almost nothing pins down the speedometer. Never report the trip average as the instant speed.',
      compare: {
        cols: [
          { title: 'Average', tex: '\\tfrac{\\Delta y}{\\Delta x}', lines: ['Over a whole trip', 'A line through 2 points'], tone: 'accent' },
          { title: 'Instant', tex: 'h \\to 0', lines: ['At one moment', 'The speedometer reading'], tone: 'ok' },
        ],
        note: 'A 60 mph average can hide a stop and a sprint. Only shrinking the gap gives the instant.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: what does the speedometer read?', body: 'A car\'s distance is d = 5t² meters. Over a step h from t = 2, the average is (5(2 + h)² − 20) ÷ h = 20 + 5h.\nh = 0.1 gives 20.5, and h = 0.01 gives 20.05 — exactly as predicted.\nLet h shrink to 0: the speedometer reads 20 m/s.' },
    {
      kind: 'summary',
      head: 'You are standing in the doorway',
      body: 'A limit asks where a function is heading, even if it never lands. 0 ÷ 0 means factor and cancel to find the hole. Squeeze two points together and the average slope becomes the instant slope — and that single squeeze is the whole idea calculus is built on. You just walked to the doorway. Push it open.',
      formula: {
        tex: '\\lim_{h \\to 0}\\dfrac{f(a+h) - f(a)}{h}',
        parts: [
          { sym: '\\lim', means: 'where the outputs are heading, not where they land', tone: 'accent' },
          { sym: '\\tfrac{0}{0}', means: 'a signal to factor and cancel, never an answer', tone: 'bad' },
          { sym: 'h \\to 0', means: 'shrink the gap and the average becomes the instant', tone: 'ok' },
        ],
      },
    },
  ],
};
