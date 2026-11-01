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
    { kind: 'concept', head: 'Every triangle obeys rules', body: 'Right triangles were easy: Pythagoras and SOH-CAH-TOA did the job. But most triangles in the real world are crooked. These two laws work on ALL of them, square corner or not.',
      why: 'SOH-CAH-TOA only works because a square corner lets you compare sides to a right angle. Any triangle can be cut by a straight line from one corner down to the opposite side, which makes two right triangles. The two new laws come from doing SOH-CAH-TOA on both halves and combining the results, so they hold for every shape.' },
    {
      kind: 'concept',
      head: 'Law of Sines: partners across the room',
      body: 'Every side has a partner — the angle sitting ACROSS from it. The law says a ÷ sin A = b ÷ sin B = c ÷ sin C. Reach for it when you already have one complete PAIR: a side and the angle facing it.',
      why: 'Draw a straight line from corner C down to side c, meeting it at a right angle, with height h. In the two right triangles h = b sin A and also h = a sin B. Setting these equal gives b sin A = a sin B, which rearranges to a ÷ sin A = b ÷ sin B. Bigger angles face bigger sides, and the sine ratio is the exact scale linking them.',
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
      why: 'Test the correction on sides 3 and 8. With a right angle the far side is the square root of 73, about 8.5. With 60° the correction subtracts 24 and the side shrinks to 7. With 120° the cosine is negative, so subtracting adds 24 and the side grows to the square root of 97, about 9.8. The cosine term measures how far the corner is open.',
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
      why: 'Each law needs one piece of information to start. The Law of Sines needs a complete side-and-opposite-angle pair, because that pair gives you a known ratio to compare against. With SAS or SSS there is no such pair, so the sines law would have two unknowns in one equation. The Law of Cosines uses only sides plus the single angle between them, and SAS and SSS supply exactly that.',
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
      body: 'Angle A = 30°, angle B = 90°, and the side facing B is b = 10. Find side a, the side facing A. Which pair is complete, and how do you use it?',
      steps: {
        steps: [
          { tex: '\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B}', text: 'Start with the Law of Sines. It says each side divided by the sine of its opposite angle gives the same number, so we can set two of these ratios equal.' },
          { tex: '\\dfrac{a}{\\sin 30^{\\circ}} = \\dfrac{10}{\\sin 90^{\\circ}}', text: 'Put in what you know. Side 10 faces the 90° angle, so that is the complete pair. Side a faces 30°, so it goes with sin 30°.' },
          { tex: '\\dfrac{a}{0.5} = \\dfrac{10}{1}', text: 'Replace the sines with their exact values, sin 30° = 0.5 and sin 90° = 1. The right side becomes 10, so the equation reads a ÷ 0.5 = 10.' },
          { tex: 'a = 10 \\times 0.5 = 5', text: 'Multiply both sides by 0.5 to undo the division. That isolates a and keeps the equation balanced, so a = 5.' },
        ],
        answer: 'a = 5',
      },
    },
    {
      kind: 'example',
      head: 'Law of Cosines: find a side',
      body: 'Two sides are 3 and 8, with a 60° angle squeezed between them. Find the third side c, the one facing that angle. What does a narrow corner do to the answer?',
      steps: {
        steps: [
          { tex: 'c^{2} = a^{2} + b^{2} - 2ab\\cos C', text: 'We know two sides and the angle between them (SAS), so use the Law of Cosines. The angle C must sit between a and b, and c is the side across from C.' },
          { tex: 'c^{2} = 3^{2} + 8^{2} - 2(3)(8)\\cos 60^{\\circ}', text: 'Substitute a = 3, b = 8 and C = 60°. Keep the minus sign in front of 2ab cos C, because it is part of the rule.' },
          { tex: 'c^{2} = 9 + 64 - 48(0.5)', text: 'Square each side: 3² is 9 and 8² is 64. Then 2ab is 2 × 3 × 8 = 48, and cos 60° is exactly 0.5.' },
          { tex: 'c^{2} = 73 - 24 = 49', text: 'Multiply before you subtract: 48 × 0.5 = 24. Then 9 + 64 = 73, and 73 − 24 = 49.' },
          { tex: 'c = 7', text: 'Take the positive square root, because a length cannot be negative. The answer 7 is shorter than the right-angle value (about 8.5), since a corner narrower than 90° pulls the far side in.' },
        ],
        answer: 'c = 7',
      },
    },
    {
      kind: 'example',
      head: 'Two friends spot a drone',
      body: 'Two friends stand 100 m apart. Friend A sights a drone at 30° and friend B sights it at 60°, so the angle at the drone is 90°. How far is the drone from friend B?',
      steps: {
        steps: [
          { tex: '180^{\\circ} - 30^{\\circ} - 60^{\\circ} = 90^{\\circ}', text: 'First find the angle at the drone. The three angles of any triangle add to 180°, so the drone corner is 180 − 30 − 60 = 90°.' },
          { tex: '\\text{100 faces } 90^{\\circ},\\quad a \\text{ faces } 30^{\\circ}', text: 'Match each side with the angle across from it. The 100 m gap faces the drone corner (90°), so that is a complete pair. The side from B to the drone faces friend A\'s 30° angle.' },
          { tex: '\\dfrac{a}{\\sin 30^{\\circ}} = \\dfrac{100}{\\sin 90^{\\circ}}', text: 'Write the Law of Sines with that pair. The unknown side a goes with sin 30°, and the known 100 goes with sin 90°.' },
          { tex: '\\dfrac{a}{0.5} = 100', text: 'Use sin 90° = 1 and sin 30° = 0.5. The right side is just 100, so the equation says a ÷ 0.5 = 100.' },
          { tex: 'a = 100 \\times 0.5 = 50', text: 'Multiply both sides by 0.5 to undo the division. This matches the 30-60-90 shortcut: the side facing 30° is half the long side.' },
        ],
        answer: 'a = 50 \\text{ m}',
      },
    },
    {
      kind: 'example',
      head: 'The boat that turns',
      body: 'A boat sails 5 km, turns so the inside angle of its path is 120°, then sails 16 km. How far is it from the start? You know two sides and the angle between them, so which law fits?',
      steps: {
        steps: [
          { tex: 'c^{2} = a^{2} + b^{2} - 2ab\\cos C', text: 'Two sides and the angle between them is SAS, so the Law of Cosines fits. The unknown c is the straight-line distance, across from the 120° corner.' },
          { tex: 'c^{2} = 5^{2} + 16^{2} - 2(5)(16)\\cos 120^{\\circ}', text: 'Substitute a = 5, b = 16 and C = 120°. The legs of the trip are the two sides that form the corner.' },
          { tex: '\\cos 120^{\\circ} = -0.5', text: 'A 120° angle is wider than 90°, so its cosine is negative, and the exact value is −0.5. Keep that sign, because dropping it changes the answer.' },
          { tex: 'c^{2} = 25 + 256 - 160(-0.5) = 281 + 80', text: 'Here 2ab = 2 × 5 × 16 = 160. Subtracting a negative ADDS, so −160 × (−0.5) becomes +80, and 25 + 256 = 281.' },
          { tex: 'c^{2} = 361, \\quad c = 19', text: 'Add 281 + 80 to get 361, then take the square root: 19 × 19 = 361. The wide corner pushed the ends farther apart than a right angle would (about 16.8).' },
        ],
        answer: 'c = 19 \\text{ km}',
      },
    },
    {
      kind: 'example',
      head: 'Across the pond you cannot walk',
      body: 'From one corner of a park, paths run 30 m and 80 m with 60° between them. How far apart are their far ends in a straight line across the pond?',
      steps: {
        steps: [
          { tex: 'c^{2} = a^{2} + b^{2} - 2ab\\cos C', text: 'The two paths are sides and the 60° corner is between them (SAS), so use the Law of Cosines. The straight cut across the pond is c, opposite that corner.' },
          { tex: 'c^{2} = 30^{2} + 80^{2} - 2(30)(80)\\cos 60^{\\circ}', text: 'Substitute a = 30, b = 80 and C = 60°. Squares come first: 30² is 900 and 80² is 6400.' },
          { tex: 'c^{2} = 900 + 6400 - 4800(0.5)', text: 'Work out 2ab: 2 × 30 × 80 = 4800. Then cos 60° is exactly 0.5, so the correction is 4800 × 0.5 = 2400.' },
          { tex: 'c^{2} = 7300 - 2400 = 4900', text: 'Add the squares, 900 + 6400 = 7300, then subtract the correction. That leaves 4900.' },
          { tex: 'c = 70, \\quad 30 + 80 - 70 = 40', text: 'The square root of 4900 is 70. Walking around the corner is 30 + 80 = 110 m, so the straight cut saves 110 − 70 = 40 m.' },
        ],
        answer: 'c = 70 \\text{ m}',
      },
    },
    {
      kind: 'example',
      head: 'Three sides, find the angle',
      body: 'A triangle has sides 3, 5 and 7. What is the corner facing the 7? With all three sides known and no matching pair, which law helps, and which side goes in the c spot?',
      formula: {
        tex: '\\cos C = \\dfrac{a^{2} + b^{2} - c^{2}}{2ab}',
        note: 'Same law, rearranged — feed it three sides and it hands back the angle.',
      },
      steps: {
        steps: [
          { tex: 'c^{2} = a^{2} + b^{2} - 2ab\\cos C', text: 'All three sides (SSS) means there is no side-angle pair, so use the Law of Cosines. The side across from the wanted angle must be c, so c = 7, a = 3 and b = 5.' },
          { tex: '7^{2} = 3^{2} + 5^{2} - 2(3)(5)\\cos C', text: 'Substitute the sides. That gives 49 = 9 + 25 − 30 cos C, since 2ab = 2 × 3 × 5 = 30.' },
          { tex: '49 = 34 - 30\\cos C \\;\\Rightarrow\\; 30\\cos C = -15', text: 'Add 9 + 25 to get 34. Then add 30 cos C to both sides and subtract 49 from both sides, so 30 cos C = 34 − 49 = −15.' },
          { tex: '\\cos C = \\dfrac{-15}{30} = -0.5', text: 'Divide both sides by 30 to get cos C by itself. The result is −0.5.' },
          { tex: 'C = 120^{\\circ}', text: 'Cosine is −0.5 at 120°, and a triangle angle lies between 0° and 180°. A negative cosine always means a wide corner, which fits the long side 7.' },
        ],
        answer: 'C = 120^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: shrink the numbers',
      body: 'A ball field corner has edges of 90 ft and 150 ft with 120° between them. How far apart are the ends? The numbers are big, so shrink them first.',
      table: {
        head: ['real', 'shrunk', 'scale'],
        rows: [['90 ft', '3', '÷ 30'], ['150 ft', '5', '÷ 30'], ['answer × 30', '7', '210 ft']],
        note: 'Angles do not care about scale, so solve the easy triangle and scale the answer back.',
      },
      steps: {
        steps: [
          { tex: '\\tfrac{90}{30} = 3, \\quad \\tfrac{150}{30} = 5', text: 'Divide both sides by 30, because 30 goes evenly into both. Every length shrinks by the same factor, so the triangle keeps its shape and its angles.' },
          { tex: 'c^{2} = 3^{2} + 5^{2} - 2(3)(5)\\cos 120^{\\circ}', text: 'Solve the small triangle with the Law of Cosines. The 120° angle sits between the two sides, as the rule requires.' },
          { tex: 'c^{2} = 9 + 25 - 30(-0.5) = 9 + 25 + 15 = 49', text: 'The cosine of 120° is −0.5, and subtracting a negative adds, so the correction is +15. That makes c² = 49.' },
          { tex: 'c = 7', text: 'The positive square root of 49 is 7. This is the answer for the small triangle, so it still needs scaling back.' },
          { tex: '7 \\times 30 = 210', text: 'We divided every length by 30, so multiply the answer by 30 to return to feet. Same shape, much friendlier arithmetic.' },
        ],
        answer: 'c = 210 \\text{ ft}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: predict, then check',
      body: 'For sides 5, 12 and 13, is the corner facing 13 sharp, square or wide? Predict with Pythagoras first, then confirm with the Law of Cosines.',
      steps: {
        steps: [
          { tex: '5^{2} + 12^{2} = 25 + 144 = 169', text: 'Compare the two short sides squared with the long side squared. Pythagoras says the corner is square exactly when they match.' },
          { tex: '13^{2} = 169', text: 'Since 13 × 13 = 169, the two totals match. So predict the corner facing 13 is exactly square.' },
          { tex: '169 = 25 + 144 - 2(5)(12)\\cos C = 169 - 120\\cos C', text: 'Now check with the Law of Cosines, putting 13 in the c spot. The 25 and 144 add to 169, and 2ab = 2 × 5 × 12 = 120.' },
          { tex: '0 = -120\\cos C \\;\\Rightarrow\\; \\cos C = 0', text: 'Subtract 169 from both sides, which leaves 0 = −120 cos C. Dividing by −120 gives cos C = 0.' },
          { tex: 'C = 90^{\\circ}', text: 'The only angle in a triangle whose cosine is 0 is 90°. The Law of Cosines agrees with the Pythagoras prediction.' },
        ],
        answer: 'C = 90^{\\circ}',
      },
    },
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
    {
      kind: 'challenge',
      head: 'Extra credit: how much does the shortcut save?',
      body: 'The boat sails 5 km, turns 120°, then sails 16 km. How much shorter is the straight route home than the trip it actually sailed?',
      steps: {
        steps: [
          { tex: '5 + 16 = 21', text: 'Add the two legs to find the distance the boat actually sailed. Both legs count, since it travelled along each one.' },
          { tex: 'c^{2} = 361 \\;\\Rightarrow\\; c = 19', text: 'Reuse the Law of Cosines result from the boat example: c² = 25 + 256 + 80 = 361, so the straight route is 19 km.' },
          { tex: '21 - 19 = 2', text: 'Subtract the straight route from the sailed route. Saving is the longer total minus the shorter one.' },
          { tex: '2 \\text{ km saved}', text: 'Any side of a triangle is shorter than the other two added together, so the saving is always positive. It is small here because the path bends only a little: a straight path would be 180° inside.' },
        ],
        answer: '2 \\text{ km}',
      },
    },
    {
      kind: 'summary',
      head: 'Two tools, one toolbox',
      body: 'Law of Sines needs a matching pair: a ÷ sin A = b ÷ sin B. Law of Cosines handles SAS and SSS: c² = a² + b² − 2ab cos C. When the corner is 90°, the correction vanishes and Pythagoras walks back in.',
      formula: {
        tex: '\\begin{gathered} \\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} \\\\ c^{2} = a^{2} + b^{2} - 2ab\\cos C \\end{gathered}',
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
    { kind: 'concept', head: 'A list with a rule', body: 'A SEQUENCE is an ordered list where a rule makes the next item. 3, 7, 11, 15 is a sequence. Order matters — the third term is the third one, always.',
      why: 'A rule is what lets you skip ahead. If you know 3, 7, 11, 15 grows by 4 each time, you can find the 100th term without writing out the first 99. Without a rule it is just a list of numbers, and the next one could be anything.' },
    {
      kind: 'concept',
      head: 'Arithmetic: same jump every time',
      body: 'ARITHMETIC sequences ADD the same amount d each step. The formula is term n = first + (n − 1) × d. Picture even hops along a number line, all exactly the same size.',
      why: 'Start at the first term. After one hop you are at a₁ + d, after two hops at a₁ + 2d, and so on. The nth term has taken n − 1 hops because the first term took none. Check with 3, 7, 11: the third term is 3 + 2(4) = 11, which is two hops.',
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
      why: 'Multiplying works like hopping, just with times instead of plus. After one step you have a₁r, after two steps a₁r², so the nth term has been multiplied n − 1 times. Check with 2, 6, 18: the third term is 2 · 3² = 18. Repeated multiplying grows faster than repeated adding, which is why the curve bends upward.',
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
      why: 'In an arithmetic list, the first and last terms, the second and second-last, and so on all have the same total, because one end goes up by d exactly as the other goes down by d. Equal pair totals mean a long addition collapses into one multiplication: the number of pairs times the pair total.',
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
      body: 'Every term comes from the one before it by some rule. Find the rule from the gaps, then use it to get the next term of 3, 7, 11, 15.',
      steps: {
        steps: [
          { tex: '7 - 3 = 4, \\quad 11 - 7 = 4, \\quad 15 - 11 = 4', text: 'Subtract each term from the one after it. Checking every gap, not just one, makes sure the pattern is really steady.' },
          { tex: 'd = 4', text: 'All the gaps are equal, so this is an arithmetic sequence. The common difference d is 4, the amount added each step.' },
          { tex: '15 + 4 = 19', text: 'The next term is the last term plus one more jump of d. So 15 + 4 = 19.' },
          { tex: 'a_5 = 3 + (5-1)(4) = 19', text: 'Double-check with the formula a_n = a₁ + (n − 1)d. The fifth term takes 4 jumps from 3, and 3 + 16 = 19, which matches.' },
        ],
        answer: '19',
      },
    },
    {
      kind: 'example',
      head: 'Next term: 2, 6, 18, 54, …',
      body: 'Find the next term of 2, 6, 18, 54. Check whether the gaps are equal first, and if they are not, try a different kind of comparison.',
      steps: {
        steps: [
          { tex: '6 - 2 = 4, \\quad 18 - 6 = 12, \\quad 54 - 18 = 36', text: 'Try subtracting first. The gaps 4, 12 and 36 are not equal, so this is not an arithmetic sequence.' },
          { tex: '\\tfrac{6}{2} = 3, \\quad \\tfrac{18}{6} = 3, \\quad \\tfrac{54}{18} = 3', text: 'Divide each term by the one before it. When the gaps keep growing, a multiplier is the likely rule, and all three answers are 3.' },
          { tex: 'r = 3', text: 'Equal ratios mean a geometric sequence with common ratio r = 3. Each term is 3 times the one before.' },
          { tex: '54 \\cdot 3 = 162', text: 'Multiply the last term by r to get the next one. 54 × 3 = 162.' },
        ],
        answer: '162',
      },
    },
    {
      kind: 'example',
      head: 'Seats in the theatre',
      body: 'Row 1 has 12 seats and each row adds 3 more. How many seats are in row 20? Decide what kind of sequence this is, and how many jumps row 20 needs.',
      steps: {
        steps: [
          { tex: 'a_1 = 12, \\quad d = 3', text: 'The same number is added each row, so this is arithmetic. The first term is 12 and the common difference is 3.' },
          { tex: 'n - 1 = 20 - 1 = 19', text: 'Row 20 is the 20th term, but row 1 needs no jump at all. So row 20 has taken 19 jumps, not 20.' },
          { tex: 'a_{20} = 12 + 19(3)', text: 'Put the numbers into a_n = a₁ + (n − 1)d: the first term plus 19 jumps of 3.' },
          { tex: 'a_{20} = 12 + 57 = 69', text: 'Multiply before adding: 19 × 3 = 57. Then 12 + 57 = 69.' },
        ],
        answer: '69 \\text{ seats}',
      },
    },
    {
      kind: 'example',
      head: 'Gauss and the numbers 1 to 100',
      body: 'His teacher wanted quiet, so she told the class to add 1 + 2 + 3 + … + 100. Nine-year-old Carl Gauss answered in seconds. What did he notice?',
      formula: {
        tex: 'S_n = \\dfrac{n(a_1 + a_n)}{2}',
        note: 'Pair the first with the last, the second with the second-last — every pair has the same total.',
      },
      art: numberLine(1, 9, [
          { at: 1, label: '1', color: SKY },
          { at: 9, label: '9', color: SKY },
          { at: 2, label: '2', color: AMB },
          { at: 8, label: '8', color: AMB },
          { at: 5, label: '5', color: EMR },
        ], { step: 1, title: 'pair the ends: every pair makes 10', caption: 'Gauss was only nine years old — fold the list in half and add.' }),
      steps: {
        steps: [
          { tex: '1 + 100 = 2 + 99 = 3 + 98 = 101', text: 'Pair the first number with the last, the second with the second-last, and so on. Every pair totals 101, because one number goes up by 1 exactly as the other goes down by 1.' },
          { tex: '100 \\div 2 = 50 \\text{ pairs}', text: 'There are 100 numbers and each pair uses two of them, so there are 50 pairs. The count is even, so nothing is left over.' },
          { tex: '50 \\cdot 101', text: 'Every pair has the same total, so instead of adding 50 separate pairs, multiply the number of pairs by the pair total.' },
          { tex: '50 \\cdot 101 = 5050', text: 'Work it out as 50 × 100 + 50 × 1 = 5000 + 50. That is the whole sum.' },
          { tex: 'S_n = \\dfrac{100(1 + 100)}{2}', text: 'Written as a formula, this is n × (first + last) ÷ 2. The ÷ 2 is there because pairing uses up two numbers at a time.' },
        ],
        answer: '5050',
      },
    },
    {
      kind: 'example',
      head: 'The pyramid of cans',
      body: 'A pyramid of cans has 20 cans in the bottom row, one fewer in each row going up, and 1 on top. How many cans are there in all? It is Gauss again, in a different outfit.',
      steps: {
        steps: [
          { tex: '20, 19, 18, \\ldots, 2, 1', text: 'The row counts drop by 1 each time, so they form an arithmetic list. Finding the total of the list is a series problem.' },
          { tex: '20 + 1 = 21, \\quad 19 + 2 = 21', text: 'Pair the biggest row with the smallest, like Gauss. Every pair totals 21, because one row count goes down by 1 as the other goes up by 1.' },
          { tex: '20 \\div 2 = 10 \\text{ pairs}', text: 'There are 20 rows and each pair uses two of them, so there are 10 pairs.' },
          { tex: '10 \\times 21 = 210', text: 'Multiply the number of pairs by the pair total. As a formula check, n(first + last) ÷ 2 = 20(21) ÷ 2 = 210.' },
        ],
        answer: '210 \\text{ cans}',
      },
    },
    {
      kind: 'example',
      head: 'Saving 5 dollars more each week',
      body: 'Week 1 you save 5 dollars, week 2 you save 10, and so on, 5 more each week, for 12 weeks. What is the total saved? You need the last week first.',
      steps: {
        steps: [
          { tex: 'a_1 = 5, \\quad d = 5, \\quad n = 12', text: 'The savings rise by the same 5 each week, so this is arithmetic. The total of the whole list is a series.' },
          { tex: 'a_{12} = 5 + 11(5) = 60', text: 'Pairing needs the last term, so find it first. Week 12 has taken 11 jumps of 5, and 5 + 55 = 60.' },
          { tex: 'S_{12} = \\dfrac{12(5 + 60)}{2}', text: 'Pair the ends: every pair totals 5 + 60 = 65, and 12 weeks make 12 ÷ 2 = 6 pairs.' },
          { tex: 'S_{12} = 6 \\times 65 = 390', text: 'Multiply the 6 pairs by 65: 6 × 60 = 360 and 6 × 5 = 30, which makes 390.' },
        ],
        answer: '390 \\text{ dollars}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: build it from a table',
      body: 'For the theatre, do not memorize a formula. Build a small table of the first few rows, spot the pattern, then leap to row 20.',
      table: {
        head: ['n', 'jumps taken', 'term'],
        rows: [['1', '0', '12'], ['2', '1', '15'], ['3', '2', '18'], ['4', '3', '21']],
        mark: 0,
        note: 'The middle column is n − 1 every time. That is where the formula comes from.',
      },
      steps: {
        steps: [
          { tex: '12,\\ 15,\\ 18,\\ 21', text: 'List the first rows by adding 3 each time. A table lets you see the pattern before you trust any formula.' },
          { tex: '21 = 12 + 3 \\cdot 3', text: 'Row 4 is 12 plus three jumps of 3, and 3 is one less than 4. Row 3 has two jumps and row 2 has one.' },
          { tex: '\\text{row } n = 12 + (n-1)\\cdot 3', text: 'The number of jumps is always one less than the row number, because row 1 starts with none. That is exactly the formula a₁ + (n − 1)d.' },
          { tex: '12 + 19 \\cdot 3 = 12 + 57 = 69', text: 'Put in n = 20: that is 19 jumps of 3. Multiply 19 × 3 = 57 first, then add 12.' },
        ],
        answer: '69 \\text{ seats}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: two pyramids make a rectangle',
      body: 'Build a second can pyramid, flip it upside down, and push it against the first. How many cans are in the rectangle, and what does that say about one pyramid?',
      art: areaModel([{ label: 'n terms', w: 3 }], [{ label: 'two copies', h: 1 }], [['n(n + 1)']], { title: 'Two triangles form a rectangle', total: 'so one triangle is n(n + 1) ÷ 2', caption: 'Stack the pyramid beside an upside-down copy and you get a clean rectangle you can just multiply.' }),
      steps: {
        steps: [
          { tex: '20 + 1 = 21', text: 'Look at one row of the joined shape: the bottom row of 20 meets the flipped top row of 1. Every other row also totals 21, because one pyramid gains a can as the other loses one.' },
          { tex: '20 \\times 21 = 420', text: 'There are 20 rows and each is 21 cans wide, so the rectangle holds rows times width, which is 420 cans.' },
          { tex: '420 \\div 2 = 210', text: 'The rectangle is made of two identical pyramids, so one pyramid is half of it. That is 210 cans.' },
          { tex: '\\dfrac{n(n+1)}{2}', text: 'With n rows the rectangle is n by (n + 1), and one pyramid is half. This picture IS the pairing shortcut.' },
        ],
        answer: '210 \\text{ cans}',
      },
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
    {
      kind: 'challenge',
      head: 'Extra credit: the bouncing ball',
      body: 'A ball rises 16 cm, then 8, then 4, and keeps halving forever. What total height does it climb? The running total never passes a certain number. Which one?',
      steps: {
        steps: [
          { tex: '16,\\ 24,\\ 28,\\ 30,\\ 31,\\ 31.5', text: 'Add one bounce at a time. Each new rise is half the one before, so the amounts added get tiny and the total creeps up slowly.' },
          { tex: '32 - 16 = 16, \\quad 32 - 24 = 8, \\quad 32 - 28 = 4', text: 'Compare each total with 32. The shortfalls are 16, 8, 4 and so on, halving each time, so the total keeps closing half the gap to 32.' },
          { tex: 'a_1 = 16, \\quad r = \\tfrac12', text: 'The rises form a geometric sequence with first term 16 and ratio one half. Because r is smaller than 1 in size, the terms shrink toward 0 and the total can settle.' },
          { tex: 'S = 16 + \\tfrac{S}{2}', text: 'Let S be the whole total. Everything after the first rise is the same pattern halved, so it equals S ÷ 2. That gives S = 16 + S ÷ 2.' },
          { tex: '\\tfrac{S}{2} = 16 \\;\\Rightarrow\\; S = 32', text: 'Subtract S ÷ 2 from both sides to get S ÷ 2 = 16, then double. This agrees with the rule total = first ÷ (1 − r) = 16 ÷ 0.5 = 32.' },
        ],
        answer: '32 \\text{ cm}',
      },
    },
    {
      kind: 'summary',
      head: 'List it, jump to it, add it',
      body: 'Arithmetic adds d: term n = first + (n − 1)d. Geometric multiplies by r: term n = first × r^(n−1). To add an arithmetic list, pair the ends: n × (first + last) ÷ 2. And a shrinking list can add up to a finite number — which is a limit in disguise.',
      formula: {
        tex: '\\begin{gathered} a_n = a_1 + (n-1)d \\\\ a_n = a_1 r^{\\,n-1} \\\\ S_n = \\tfrac{n(a_1 + a_n)}{2} \\end{gathered}',
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
      why: 'Picture walking toward a door and asking where your feet are heading, not whether you step through. For a function that equals x + 3 everywhere except a hole at x = 3, the inputs 2.9, 2.99 and 2.999 give 5.9, 5.99 and 5.999. The outputs close in on 6 whether or not x = 3 itself is allowed.',
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
      why: 'If the graph has no break at a point, nearby inputs give nearby outputs, so the outputs heading for the answer must land exactly on the value there. Nothing can hide in a gap that is not there. Check with 3x + 1: at x = 1.99 and 2.01 the outputs are 6.97 and 7.03, both close to 3(2) + 1 = 7.',
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
      why: 'The fraction 0 ÷ 0 could mean anything, because 0 = 0 × any number. Both parts vanish at x = 3 only because both contain the factor (x − 3). For every x near 3 but not equal to 3, that factor divides to 1, so the fraction equals the simpler x + 3, which you can evaluate at 3.',
      art: funcGraph([{ f: (x) => x + 3, label: '(x² − 9) ÷ (x − 3)' }], { range: { x: [-1, 6], y: [0, 10] }, points: [{ x: 3, y: 6, label: 'limit is 6', hollow: true, color: ROSE }], title: 'Cancel the factor and the answer appears', caption: 'The point at x = 3 is missing, but the curve either side heads straight for 6.' }),
      steps: {
        steps: [
          { tex: '\\dfrac{0}{0}', text: 'This is not a number. It is the problem telling you that top and bottom both vanish for the same reason, so more work is needed.' },
          { tex: '\\text{factor and cancel}', text: 'The zero on top and the zero underneath come from a shared factor, so factor both and cancel it, which removes the zero from each.' },
          { tex: '\\text{then substitute}', text: 'Once the shared factor is cancelled, the expression is smooth near the target, so you can walk straight in and substitute the number.' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Average rate, then the instant',
      body: 'AVERAGE RATE OF CHANGE is rise ÷ run between two points — a car\'s trip summary. Slide the two points together and the average points at the INSTANT rate, the speedometer reading right now. Zoom in far enough and any smooth curve looks like a straight line.',
      why: 'A line through two points has slope rise over run. As the second point slides toward the first, that line pivots and settles onto the line that just touches the curve at one point, and its slope is the instant rate. For y = x² the average from 3 to 3 + h is 6 + h, which heads for 6 as h shrinks.',
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
      body: 'What does 3x + 1 head toward as x gets close to 2? The graph is a straight line, so ask whether there is any break near x = 2.',
      steps: {
        steps: [
          { tex: 'y = 3x + 1', text: 'Look at the graph first. A straight line has no holes and no jumps, so nothing can go wrong near x = 2.' },
          { tex: '\\lim_{x \\to 2}(3x + 1) = 3(2) + 1', text: 'Because the function is smooth there, the limit equals the value at the point. So just substitute x = 2.' },
          { tex: '3(2) + 1 = 6 + 1 = 7', text: 'Multiply first, then add: 3 × 2 = 6, and 6 + 1 = 7.' },
          { tex: 'f(1.99) = 6.97, \\quad f(2.01) = 7.03', text: 'Check by sneaking up from both sides. Both outputs sit close to 7, which agrees with the answer.' },
        ],
        answer: '7',
      },
    },
    {
      kind: 'example',
      head: 'A hole in the road',
      body: 'A function gives 3.9 at x = 1.9, 3.99 at 1.99, 4.01 at 2.01 and 4.1 at 2.1, but has no value at x = 2. What is the limit as x → 2?',
      steps: {
        steps: [
          { tex: 'f(1.9) = 3.9, \\quad f(1.99) = 3.99', text: 'Read the inputs just below 2. As they get closer to 2, the outputs climb toward 4 from below.' },
          { tex: 'f(2.1) = 4.1, \\quad f(2.01) = 4.01', text: 'Now read the inputs just above 2. As they get closer to 2, the outputs sink toward 4 from above.' },
          { tex: '\\text{both sides} \\to 4', text: 'A limit exists only when both sides head for the same number. Here both sides squeeze toward 4.' },
          { tex: '\\lim_{x \\to 2} f(x) = 4', text: 'The missing value at x = 2 does not matter, because a limit asks where the outputs are heading, not what happens at 2 itself.' },
        ],
        answer: '4',
      },
    },
    {
      kind: 'example',
      head: 'Cancel the factor: (x² − 9) ÷ (x − 3)',
      body: 'Find the limit of (x² − 9) ÷ (x − 3) as x → 3. First try plugging in, and see what happens.',
      steps: {
        steps: [
          { tex: '\\dfrac{3^{2} - 9}{3 - 3} = \\dfrac{0}{0}', text: 'Substitute x = 3. The top is 9 − 9 = 0 and the bottom is 3 − 3 = 0. The result 0/0 is not a number; it signals a shared factor, so do not stop here.' },
          { tex: 'x^{2} - 9 = (x-3)(x+3)', text: 'The top is a difference of two squares, x² − 3². The rule a² − b² = (a − b)(a + b) factors it into (x − 3)(x + 3).' },
          { tex: '\\dfrac{(x-3)(x+3)}{x-3} = x + 3', text: 'Cancel the shared (x − 3). This is allowed because the limit only looks at x near 3, not at 3, so x − 3 is not zero and divides to 1.' },
          { tex: '\\lim_{x \\to 3}(x + 3) = 3 + 3', text: 'What is left is smooth near 3, so substitute x = 3 straight in.' },
          { tex: '3 + 3 = 6', text: 'Add to finish. The graph is the line y = x + 3 with one open circle punched out at (3, 6).' },
        ],
        answer: '6',
      },
    },
    {
      kind: 'example',
      head: 'The car\'s trip summary',
      body: 'A car is 30 km from home at 1 hour and 150 km at 3 hours. What is its average speed? Then try a runner: 100 m at 15 s and 400 m at 75 s.',
      steps: {
        steps: [
          { tex: '150 - 30 = 120 \\text{ km}', text: 'Average rate is the change in distance over the change in time. Subtract the two distances first to see how far the car actually moved.' },
          { tex: '3 - 1 = 2 \\text{ h}', text: 'Subtract the times the same way, later minus earlier, to get the time that passed.' },
          { tex: '\\dfrac{120}{2} = 60 \\text{ km/h}', text: 'Divide distance by time. That tells you how far the car went in each single hour, on average.' },
          { tex: '\\dfrac{400 - 100}{75 - 15} = \\dfrac{300}{60} = 5 \\text{ m/s}', text: 'The runner works the same way. Subtract before dividing, since the rate depends on the differences between readings, not on the raw numbers.' },
        ],
        answer: '60 \\text{ km/h and } 5 \\text{ m/s}',
      },
    },
    {
      kind: 'example',
      head: 'Zooming in on the graphing app',
      body: 'Zoom in on y = x² at x = 3 and the curve slowly straightens out. What are the average rates from 3 to 3.1, 3.01 and 3.001, and where are they heading?',
      table: {
        head: ['x', '(x² − 9) ÷ (x − 3)'],
        rows: [['2.9', '5.9'], ['2.99', '5.99'], ['3', 'undefined'], ['3.01', '6.01'], ['3.1', '6.1']],
        mark: 2,
        note: 'The value AT 3 does not exist, but both sides are clearly heading for 6.',
      },
      steps: {
        steps: [
          { tex: '\\dfrac{x^{2} - 9}{x - 3}', text: 'The average rate from 3 to x is rise over run. The rise is x² − 3² = x² − 9 and the run is x − 3.' },
          { tex: '\\dfrac{3.1^{2} - 9}{0.1} = \\dfrac{0.61}{0.1} = 6.1', text: 'Try x = 3.1. Since 3.1² = 9.61, the rise is 0.61 over a run of 0.1, which is 6.1.' },
          { tex: '\\dfrac{0.0601}{0.01} = 6.01, \\quad \\dfrac{0.006001}{0.001} = 6.001', text: 'Repeat with 3.01 (3.01² = 9.0601) and 3.001 (3.001² = 9.006001). The extra bits after the 6 shrink by a factor of ten each time.' },
          { tex: '5.9,\\ 5.99 \\;\\nearrow\\; 6 \\;\\swarrow\\; 6.01,\\ 6.1', text: 'Check from below as well. The table shows both sides heading for 6, even though the value AT 3 does not exist.' },
        ],
        answer: '6',
      },
    },
    {
      kind: 'example',
      head: 'Another way: do it with a step h',
      body: 'Instead of a table, take a step of size h from x = 3 on y = x². Find the average rate over that step, then let h shrink.',
      formula: {
        tex: '\\dfrac{f(a + h) - f(a)}{h}, \\quad h \\to 0',
        note: 'One point plus a tiny step h. Let h shrink to nothing and you have the instant rate.',
      },
      steps: {
        steps: [
          { tex: '\\dfrac{(3+h)^{2} - 9}{h}', text: 'Rise over run from x = 3 to x = 3 + h. The rise is f(3 + h) − f(3), where f(3) = 9, and the run is h.' },
          { tex: '(3+h)^{2} = 9 + 6h + h^{2}', text: 'Expand the square with (a + b)² = a² + 2ab + b², using a = 3 and b = h. That gives 9 + 6h + h².' },
          { tex: '\\dfrac{6h + h^{2}}{h} = 6 + h', text: 'The 9 cancels with the −9, leaving 6h + h². Both terms contain h, and a real step has h ≠ 0, so divide it out.' },
          { tex: 'h \\to 0: \\; 6 + h \\to 6', text: 'Let h shrink toward 0. The h term fades away and the 6 stays. That h WAS the extra bit in 6.1 and 6.01.' },
        ],
        answer: '6',
      },
    },
    {
      kind: 'example',
      head: 'Another way: read it off the graph',
      body: 'A room cools overnight: T = 18 + 6 ÷ t degrees, t hours after the heating stops. What temperature is it heading toward as t gets very large? Sketch it first.',
      steps: {
        steps: [
          { tex: 'T(6) = 19, \\; T(12) = 18.5, \\; T(60) = 18.1, \\; T(600) = 18.01', text: 'Try bigger and bigger t. Each time the temperature drops a little less and stays just above 18.' },
          { tex: '\\dfrac{6}{t} \\to 0 \\text{ as } t \\to \\infty', text: 'When t is huge, dividing 6 by it gives something tiny. It is positive, so it never quite reaches 0, and T never quite reaches 18.' },
          { tex: 'T = 18 \\text{ is a flat line the curve hugs}', text: 'On the sketch, the curve drops fast and then flattens, hugging a horizontal line without crossing it. That line is the height the outputs head for.' },
          { tex: '\\lim_{t \\to \\infty}\\left(18 + \\tfrac{6}{t}\\right) = 18 + 0', text: 'Add the pieces: 18 stays, and 6 ÷ t heads for 0, so the limit is 18.' },
        ],
        answer: '18 \\text{ degrees}',
      },
    },
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
    {
      kind: 'challenge',
      head: 'Extra credit: what does the speedometer read?',
      body: 'A car travels d = 5t² meters in t seconds. Find its speed at exactly t = 2 s. Average over a step h first, then let h shrink.',
      steps: {
        steps: [
          { tex: 'd(2) = 20, \\quad d(2+h) = 5(2+h)^{2}', text: 'At t = 2 the car is 5 × 4 = 20 m from the start. After h more seconds it is 5(2 + h)² meters from the start.' },
          { tex: '5(4 + 4h + h^{2}) - 20 = 20h + 5h^{2}', text: 'Expand (2 + h)² = 4 + 4h + h². Multiply by 5 to get 20 + 20h + 5h², then subtract the 20 to get the distance covered during the step.' },
          { tex: '\\dfrac{20h + 5h^{2}}{h} = 20 + 5h', text: 'Average speed is distance divided by time, so divide by h. Both terms contain h and h ≠ 0, so it cancels.' },
          { tex: 'h = 0.1: 20.5, \\quad h = 0.01: 20.05', text: 'Check with real steps. The averages 20.5 and 20.05 sit just above 20, and they get closer as h gets smaller.' },
          { tex: '20 + 5h \\to 20', text: 'Let h shrink to 0. The 5h part vanishes and 20 remains, so the speedometer reads 20 m/s at t = 2.' },
        ],
        answer: '20 \\text{ m/s}',
      },
    },
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
