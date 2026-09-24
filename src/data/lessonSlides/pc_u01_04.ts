import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, VIO, W, arrow, art, axes, dot, line, machine, text } from '../slideArt';

// Precalculus slide decks, units 1-4.

export const PC_SLIDES_U01_04: SlideBank = {
  // ---------------- PC-1 — Functions & transformations ----------------
  'PC-1': [
    {
      kind: 'objective',
      head: 'Graphs you can slide and stretch',
      body: 'Today you will take a basic shape like y = x² and move it around the screen. Every shift, stretch, and flip follows one simple rule. Once you see it, you can graph a whole family without plotting points.',
      formula: {
        tex: 'y = a \\, f(x - h) + k',
        note: 'One parent shape, four dials. Every graph this unit is this rule with numbers in it.',
        parts: [
          { sym: 'h', means: 'slides it LEFT or RIGHT (inside the function)', tone: 'accent' },
          { sym: 'k', means: 'slides it UP or DOWN (outside the function)', tone: 'ok' },
          { sym: 'a', means: 'stretches it taller, or flips it if negative', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Meet the parent functions',
      body: 'A few basic shapes do all the work: the line y = x, the parabola y = x², the V of y = |x|, and the curve y = √x. Every other graph in the family is one of these, moved. Learn the four plain shapes and the rest is just moving.',
      art: (() => {
        const ax = axes({ x: [-3, 3], y: [-3, 5] }, { ticks: { x: [-2, 0, 2], y: [-2, 0, 2, 4] }, grid: true, pad: 30 });
        return art(
          'The line y = x, the parabola y = x squared and the V of y = the absolute value of x drawn on one grid',
          ax.body +
            ax.curve((x) => x, SKY, 2.6) +
            ax.curve((x) => x * x, AMB, 2.6) +
            ax.curve((x) => Math.abs(x), EMR, 2.6) +
            text(ax.X(2.5), ax.Y(1.4), 'y = x', { size: 12, fill: SKY }) +
            text(ax.X(-1.5), ax.Y(3.6), 'y = x²', { size: 12, fill: AMB }) +
            text(ax.X(2.3), ax.Y(3.4), 'y = |x|', { size: 12, fill: EMR }) +
            text(W / 2, 18, 'three parents, three shapes', { size: 12, op: 0.7 }),
          'Learn these three shapes and every transformation is just moving one of them.',
        );
      })(),
    },
    { kind: 'concept', head: 'The graph is a sticker on a window', body: 'Picture the parent graph printed on a clear sticker. You can peel it up and press it down somewhere else, or stretch it taller, or flip it over. The shape never changes — only where it sits and how tall it is.' },
    {
      kind: 'concept',
      head: 'Outside moves it up and down',
      body: 'A number added OUTSIDE the function changes every y-value. In f(x) + k, every point rises by k, so the whole sticker slides straight up. If k is negative, the sticker slides down instead.',
      compare: {
        cols: [
          { title: 'y = x²', tex: 'k = 0', lines: ['Vertex at (0, 0)', 'The parent, untouched'], tone: 'plain' },
          { title: 'y = x² + 3', tex: 'k = 3', lines: ['Vertex at (0, 3)', 'Every point rises 3'], tone: 'ok' },
        ],
        note: 'The +3 is OUTSIDE the squaring, so it happens last — to the answer, which is the height.',
      },
      art: (() => {
        const ax = axes({ x: [-3, 3], y: [-1, 8] }, { ticks: { x: [-2, 0, 2], y: [0, 3, 6] }, grid: true, pad: 30 });
        return art(
          'A parabola and the same parabola lifted three units, with an arrow between the two vertices',
          ax.body +
            ax.curve((x) => x * x, 'currentColor', 2.4, '5 4') +
            ax.curve((x) => x * x + 3, AMB, 3) +
            arrow(ax.X(0), ax.Y(0.2), ax.X(0), ax.Y(2.8), EMR, 2.4) +
            dot(ax.X(0), ax.Y(0), 4.5, SKY) +
            dot(ax.X(0), ax.Y(3), 4.5, AMB) +
            text(ax.X(1.1), ax.Y(3.2), '+3', { size: 13, fill: EMR }) +
            text(ax.X(-1.9), ax.Y(6.4), 'y = x² + 3', { size: 12, fill: AMB }),
          'Add outside and the whole sticker slides straight up.',
        );
      })(),
      formula: {
        tex: 'f(x) \\ \\longrightarrow\\ a\\,f(x - h) + k',
        note: 'The shape never changes — only where it sits and how tall it is.',
        parts: [
          { sym: 'f', means: 'the parent shape — the sticker itself', tone: 'accent' },
          { sym: 'h,\\,k', means: 'where you stick it on the window', tone: 'ok' },
          { sym: 'a', means: 'how much you stretch it before sticking', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Inside moves it left and right',
      body: 'A number tucked INSIDE, right next to the x, moves the graph sideways. In f(x − h) the sticker slides RIGHT by h. This one feels backwards at first, so it earns its own nickname: minus moves right.',
      compare: {
        cols: [
          { title: 'y = (x − 2)²', tex: 'h = 2', lines: ['Moves RIGHT 2', 'Vertex at (2, 0)'], tone: 'ok' },
          { title: 'y = (x + 2)²', tex: 'h = −2', lines: ['Moves LEFT 2', 'Vertex at (−2, 0)'], tone: 'bad' },
        ],
        note: 'Inside the brackets everything runs backwards. Ask "what makes the bracket zero?" — that is the new vertex.',
      },
      art: (() => {
        const ax = axes({ x: [-5, 5], y: [-1, 7] }, { ticks: { x: [-4, -2, 0, 2, 4], y: [0, 2, 4, 6] }, grid: true, pad: 30 });
        return art(
          'A parabola shifted two units left and the same parabola shifted two units right',
          ax.body +
            ax.curve((x) => (x + 2) * (x + 2), ROSE, 2.8) +
            ax.curve((x) => (x - 2) * (x - 2), EMR, 2.8) +
            dot(ax.X(-2), ax.Y(0), 4.5, ROSE) +
            dot(ax.X(2), ax.Y(0), 4.5, EMR) +
            text(ax.X(-3.4), ax.Y(5.4), '(x + 2)²', { size: 12, fill: ROSE }) +
            text(ax.X(3.4), ax.Y(5.4), '(x − 2)²', { size: 12, fill: EMR }) +
            text(W / 2, 18, 'the sign inside is a liar', { size: 12, op: 0.7 }),
          'Plus inside goes left, minus inside goes right — the opposite of what it looks like.',
        );
      })(),
    },
    {
      kind: 'example',
      head: 'Start simple: y = x² + 3',
      body: 'The +3 is OUTSIDE the square, so it lifts every point.\nThe bottom of the parabola moves from (0, 0) up to (0, 3).\nAnswer: the whole graph slides UP 3.',
      steps: {
        steps: [
          { tex: 'y = x^{2} + 3', text: 'The +3 is outside the square, so it is a k.' },
          { tex: 'k = +3', text: 'Positive k means up.' },
          { tex: '(0,\\,0) \\to (0,\\,3)', text: 'The vertex rises three.' },
        ],
        answer: '\\text{up 3}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: track one point',
      body: 'Instead of the whole curve, follow the vertex.\nFor y = (x − 4)², the vertex starts at (0, 0) and lands at (4, 0).\nOne point tells you where the whole sticker went, because the shape never changes.',
      table: {
        head: ['on y = x²', 'add 3 to y', 'on y = x² + 3'],
        rows: [['(0, 0)', '0 + 3', '(0, 3)'], ['(1, 1)', '1 + 3', '(1, 4)'], ['(2, 4)', '4 + 3', '(2, 7)']],
        mark: 0,
        note: 'Move one point you know and the rest of the curve follows it.',
      },
    },
    { kind: 'example', head: 'Moving a game sprite', body: 'In a video game, a sprite follows the path y = x². A coder changes it to y = (x − 7)².\nSet the inside to zero: x − 7 = 0, so x = 7.\nThe whole path slides RIGHT 7 steps across the screen.' },
    { kind: 'example', head: 'Raising a skate ramp', body: 'A skate ramp curves like y = √x, and builders lift the whole thing 3 feet.\nLifting is a vertical move, so the change goes OUTSIDE: y = √x + 3.\nThe front edge that sat at (0, 0) is now at (0, 3).' },
    {
      kind: 'example',
      head: 'Stretching a photo taller',
      body: 'A photo app triples every height above the middle line. That is a·f(x) with a = 3.\nA point 5 units above the middle jumps to 15 units above.\nThe picture gets taller and skinnier, but nothing slides sideways.',
      compare: {
        cols: [
          { title: 'a = 3 · taller', tex: 'y = 3x^{2}', lines: ['Every height ×3', 'Narrow and steep'], tone: 'ok' },
          { title: 'a = ⅓ · flatter', tex: 'y = \\tfrac{1}{3}x^{2}', lines: ['Every height ÷3', 'Wide and lazy'], tone: 'accent' },
        ],
        note: 'a multiplies the OUTPUT, so it only ever changes how tall the graph is.',
      },
    },
    {
      kind: 'example',
      head: 'Flipping with a minus in front',
      body: 'Compare y = |x| with y = −|x|.\nEvery positive height becomes negative, so the V turns upside down.\nThe sticker got flipped over the x-axis like a pancake.',
      art: (() => {
        const ax = axes({ x: [-3, 3], y: [-6, 6] }, { ticks: { x: [-2, 0, 2], y: [-4, 0, 4] }, grid: true, pad: 30 });
        return art(
          'A parabola opening upward and its mirror image opening downward',
          ax.body +
            ax.curve((x) => x * x, AMB, 2.8) +
            ax.curve((x) => -x * x, ROSE, 2.8) +
            text(ax.X(1.9), ax.Y(4.6), 'y = x²', { size: 12, fill: AMB }) +
            text(ax.X(1.9), ax.Y(-4.6), 'y = −x²', { size: 12, fill: ROSE }) +
            text(W / 2, 18, 'a minus out front flips it', { size: 12, op: 0.7 }),
          'The minus reflects every point across the x-axis — smile becomes frown.',
        );
      })(),
    },
    {
      kind: 'example',
      head: 'Another way: build a tiny table',
      body: 'Unsure what a change does? Test three x-values.\nFor y = −|x| + 7: at x = −2 you get 5, at x = 0 you get 7, at x = 3 you get 4.\nThe numbers climb to 7 and fall again, so the peak is 7.',
      table: {
        head: ['x', 'x − 1', '(x − 1)²'],
        rows: [['0', '−1', '1'], ['1', '0', '0'], ['2', '1', '1'], ['3', '2', '4']],
        mark: 1,
        note: 'The low point lands where the bracket is zero — at x = 1, not x = −1.',
      },
    },
    { kind: 'example', head: 'Two moves at once', body: 'For y = (x + 4)² − 6, handle the moves one at a time.\nInside: x + 4 = 0 gives x = −4, so slide LEFT 4.\nOutside: −6 drops it 6. The lowest point lands at (−4, −6).' },
    {
      kind: 'protip',
      head: 'Inside or outside? Ask first',
      body: 'Before anything else, ask whether the number is glued to the x or sitting outside. Inside means a left-right slide, outside means an up-down slide. That single question sorts out almost every transformation problem in this unit.',
      compare: {
        cols: [
          { title: 'Inside the brackets', tex: 'f(x - h)', lines: ['Left / right', 'Runs backwards'], tone: 'warn' },
          { title: 'Outside the brackets', tex: 'a f(x) + k', lines: ['Up / down, taller', 'Does what it says'], tone: 'ok' },
        ],
        note: 'One question — "is it touching the x before the function acts?" — settles every transformation.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: minus moves RIGHT',
      body: 'Students see y = (x − 5)² and slide the graph LEFT, because the sign says minus. It actually slides RIGHT 5. Check it by asking where the squared part equals zero: x − 5 = 0 means x = 5, over on the right side.',
      compare: {
        cols: [
          { title: 'Looks like', tex: 'y = (x - 4)^{2}', lines: ['"minus, so left 4"', 'Wrong'], tone: 'bad' },
          { title: 'Actually', tex: 'x - 4 = 0 \\Rightarrow x = 4', lines: ['Vertex at x = 4', 'Right 4'], tone: 'ok' },
        ],
        note: 'Never read the sign. Solve for what makes the bracket zero — that is always the new x.',
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: three moves at once',
      body: 'Find the vertex of y = 2(x − 3)² + 5.\nInside first: x − 3 = 0 gives x = 3, so slide RIGHT 3.\nThe 2 stretches it taller and the +5 lifts it, so the vertex sits at (3, 5).',
      steps: {
        steps: [
          { tex: 'y = -2(x + 1)^{2} + 5', text: 'Three dials are turned at once.' },
          { tex: 'x + 1 = 0 \\Rightarrow x = -1', text: 'Inside first: the vertex slides LEFT 1.' },
          { tex: 'a = -2', text: 'Twice as tall, and the minus flips it upside down.' },
          { tex: '+5', text: 'Outside last: the whole thing lifts 5.' },
        ],
        answer: '\\text{vertex } (-1,\\,5),\\ \\text{opens down}',
      },
    },
    {
      kind: 'summary',
      head: 'One family, many positions',
      body: 'Four parent shapes cover the whole family. Outside numbers slide the sticker up and down, inside numbers slide it left and right, a number in front stretches it, and a minus in front flips it. Remember the sneaky one: minus inside moves RIGHT.',
      formula: {
        tex: 'y = a \\, f(x - h) + k',
        parts: [
          { sym: 'h', means: 'right if positive — solve x − h = 0', tone: 'accent' },
          { sym: 'k', means: 'up if positive', tone: 'ok' },
          { sym: 'a', means: 'taller if |a| > 1, flipped if negative', tone: 'warn' },
        ],
      },
    },
  ],

  // ---------------- PC-2 — Composite & inverse functions ----------------
  'PC-2': [
    {
      kind: 'objective',
      head: 'Machines in a row, and how to undo them',
      body: 'Today you feed a number through two functions, one after the other. Then you learn to run the whole thing backwards. By the end you can chase a number forward through a chain and drag it back home.',
      art: machine('x', 'f(x)', 'y', { title: 'a function is a machine', caption: 'One input goes in, the rule acts, one output comes out.' }),
    },
    {
      kind: 'concept',
      head: 'A function is a machine',
      body: 'A function takes a number in, does a job, and drops a new number out. The rule f(x) = x + 4 is a machine that adds 4 to whatever you feed it. Nothing mysterious — put a number in the hopper, catch what falls out.',
      formula: {
        tex: 'f(x) = 3x + 1',
        note: 'Whatever lands in the brackets is what x becomes — a number, a letter, another machine.',
        parts: [
          { sym: 'x', means: 'the input — what you feed it', tone: 'accent' },
          { sym: 'f', means: 'the rule — triple it, then add one', tone: 'warn' },
          { sym: 'f(x)', means: 'the output — what falls out the other end', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Composition = two machines in a row',
      body: 'In f(g(x)), the output of machine g becomes the input of machine f. The INSIDE machine always runs FIRST, just like nested boxes: you open the small box before the big one. Work inside-out, every single time.',
      art: machine('x', 'g then f', 'f(g(x))', { title: 'two machines bolted together', caption: 'The output of the first becomes the input of the second.' }),
      formula: {
        tex: 'f(g(x)) \\quad \\text{— innermost first}',
        note: 'Work from the inside out, exactly like brackets in arithmetic.',
      },
    },
    {
      kind: 'concept',
      head: 'Order changes the answer',
      body: 'f(g(x)) and g(f(x)) use the same two machines but in opposite orders, and they usually give different answers. Putting on socks then shoes is not the same as shoes then socks. Always read which function is on the inside.',
      compare: {
        cols: [
          { title: 'f(g(2))', tex: 'g \\text{ first}', lines: ['g(2) = 5', 'f(5) = 16'], tone: 'accent' },
          { title: 'g(f(2))', tex: 'f \\text{ first}', lines: ['f(2) = 7', 'g(7) = 15'], tone: 'ok' },
        ],
        note: 'Same two machines, different order, different answer — socks then shoes is not shoes then socks.',
      },
    },
    {
      kind: 'concept',
      head: 'An inverse is the UNDO machine',
      body: 'The inverse f⁻¹ takes an output and hands you back the original input. To find its rule, swap x and y and then solve for y. If f adds 9, then f⁻¹ subtracts 9 — the two machines cancel each other out.',
      art: machine('y', 'f⁻¹', 'x', { title: 'the undo machine', caption: 'The inverse runs the same steps backwards, in the opposite order.' }),
      formula: {
        tex: 'f^{-1}(f(x)) = x',
        note: 'Send a number through and straight back and you land exactly where you started.',
      },
    },
    {
      kind: 'example',
      head: 'Start simple: f(g(2))',
      body: 'Let f(x) = x + 4 and g(x) = 3x.\nInside first: g(2) = 3 × 2 = 6.\nThen f(6) = 6 + 4 = 10.',
      steps: {
        steps: [
          { tex: 'g(2)', text: 'Innermost brackets first — always.' },
          { tex: 'g(2) = 2 + 3 = 5', text: 'That 5 is now the input for f.' },
          { tex: 'f(5) = 2(5) + 1 = 11', text: 'Feed it into the outer machine.' },
        ],
        answer: '11',
      },
    },
    { kind: 'example', head: 'Flip the order: g(f(2))', body: 'Same two machines, opposite order.\nNow f runs first: f(2) = 2 + 4 = 6.\nThen g(6) = 3 × 6 = 18. Different answer, same numbers — order really matters.' },
    { kind: 'example', head: 'Dollars to euros to yen', body: 'A money app uses e(d) = 0.9d for dollars to euros, then y(e) = 160e for euros to yen.\nStart with $50: 0.9 × 50 = 45 euros.\nThen 160 × 45 = 7200 yen. Two windows, in order.' },
    {
      kind: 'example',
      head: 'Another way: draw the chain',
      body: 'Write the trip as arrows instead of nested letters.\n50 dollars → 45 euros → 7200 yen.\nEach arrow is one machine, and you follow them left to right. The nesting disappears and the order is obvious.',
      art: machine('2', '+3 → ×2', '10', { title: 'the chain, drawn', caption: 'Drawing the boxes makes the order impossible to get wrong.' }),
    },
    {
      kind: 'example',
      head: 'Discount, then tax',
      body: 'A jacket costs $80. A coupon takes 25% off, then 10% tax is added.\nDiscount machine: 0.75 × 80 = $60.\nTax machine: 10% of 60 is $6, so the final price is $66.',
      steps: {
        steps: [
          { tex: '\\$80 \\cdot 0.75 = \\$60', text: '25% off means keep 75%.' },
          { tex: '\\$60 \\cdot 1.08 = \\$64.80', text: 'Then 8% tax on the discounted price.' },
        ],
        answer: '\\$64.80',
      },
    },
    { kind: 'example', head: 'Undoing a two-step machine', body: 'Let f(x) = 2x + 1, so f doubles and then adds 1. Find f⁻¹(9).\nUndo the LAST step first: 9 − 1 = 8.\nThen undo the doubling: 8 ÷ 2 = 4. So f⁻¹(9) = 4.' },
    {
      kind: 'example',
      head: 'Another way: swap x and y',
      body: 'Write y = 2x + 1, then trade the letters: x = 2y + 1.\nSolve for y: subtract 1 to get x − 1 = 2y, then divide by 2.\nThe rule is f⁻¹(x) = (x − 1) ÷ 2, and plugging in 9 gives 4.',
      steps: {
        steps: [
          { tex: 'y = 2x + 5', text: 'Write the function with y.' },
          { tex: 'x = 2y + 5', text: 'Swap x and y — that IS the undo.' },
          { tex: 'x - 5 = 2y', text: 'Now solve for y.' },
          { tex: 'y = \\dfrac{x - 5}{2}', text: 'The inverse rule.' },
        ],
        answer: 'f^{-1}(x) = \\dfrac{x - 5}{2}',
      },
    },
    { kind: 'example', head: 'Running a chain backwards', body: 'A store takes 20% off, then adds $5 shipping. You paid $45.\nShipping went on LAST, so peel it off FIRST: 45 − 5 = 40.\nThat $40 is 80% of the original, so 40 ÷ 0.8 = $50.' },
    {
      kind: 'protip',
      head: 'Check an inverse by round trip',
      body: 'Found an inverse and not sure? Send a number through both machines. Feed 4 into f(x) = 2x + 1 and you get 9; feed 9 into your inverse and you should land back on 4. If you do not come home, the inverse is wrong.',
      formula: {
        tex: 'f(f^{-1}(x)) = x \\quad \\text{and} \\quad f^{-1}(f(x)) = x',
        note: 'If a round trip does not land back on x, one of the two rules is wrong.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: doing the outside first',
      body: 'When you see f(g(5)), it is tempting to start with f because it is written first. The inside machine g always runs first. Read composite functions from the inside out, exactly like parentheses in arithmetic.',
      compare: {
        cols: [
          { title: 'Wrong', tex: 'f \\text{ before } g', lines: ['Reads left to right', 'Ignores the brackets'], tone: 'bad' },
          { title: 'Right', tex: 'g \\text{ before } f', lines: ['Innermost brackets first', 'Then work outwards'], tone: 'ok' },
        ],
        note: 'f(g(x)) is read like an onion, from the middle out.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: compose with letters', body: 'Let f(x) = 3x and g(x) = x + 5. Find f(g(x)).\nThe inside machine hands over the whole expression x + 5.\nMachine f triples it: 3(x + 5) = 3x + 15. Check with x = 2: g(2) = 7 and f(7) = 21, and 3(2) + 15 = 21.' },
    {
      kind: 'summary',
      head: 'Forward inside-out, backward in reverse',
      body: 'A composite runs two machines in a row, and the inside one always goes first. Swapping the order usually changes the answer. An inverse undoes the machine, and when you undo a chain you take off the LAST step first.',
      compare: {
        cols: [
          { title: 'Composing', tex: 'f(g(x))', lines: ['Innermost first', 'Order matters'], tone: 'accent' },
          { title: 'Inverting', tex: 'f^{-1}', lines: ['Swap x and y', 'Solve for y'], tone: 'ok' },
        ],
      },
    },
  ],

  // ---------------- PC-3 — Polynomial functions ----------------
  'PC-3': [
    { kind: 'objective', head: 'Read a polynomial like a map', body: 'Today you look at a polynomial and predict its graph without plotting a single point. Two things tell the story: the degree and the factors. One decides where the arms point, the other decides where the graph meets the x-axis.' },
    {
      kind: 'concept',
      head: 'Degree and leading coefficient',
      body: 'The DEGREE is the biggest exponent on x. The LEADING COEFFICIENT is the number sitting in front of that biggest term. For 4x³ − 2x + 7 the degree is 3 and the leading coefficient is 4. Those two numbers run the whole show.',
      formula: {
        tex: 'p(x) = 2x^{3} - 5x + 1',
        note: 'Two numbers decide the whole shape before you plot a single point.',
        parts: [
          { sym: '3', means: 'the DEGREE — the highest power', tone: 'accent' },
          { sym: '2', means: 'the LEADING COEFFICIENT — in front of that power', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'End behavior: where the arms point',
      body: 'The two far ends of a polynomial graph are its ARMS. An EVEN degree makes both arms point the same way; an ODD degree makes them point opposite ways. A positive leading coefficient throws the right arm UP, a negative one throws it DOWN.',
      compare: {
        cols: [
          { title: 'Even degree', tex: 'x^{2},\\ x^{4}', lines: ['Both arms the same way', 'Up/up if a > 0'], tone: 'accent' },
          { title: 'Odd degree', tex: 'x^{3},\\ x^{5}', lines: ['Arms go opposite ways', 'Down/up if a > 0'], tone: 'ok' },
        ],
        note: 'A negative leading coefficient flips both arms, whatever the degree.',
      },
      art: (() => {
        const ax = axes({ x: [-2.2, 2.2], y: [-5, 5] }, { ticks: { x: [-2, 0, 2], y: [-4, 0, 4] }, grid: true, pad: 30 });
        return art(
          'An even-degree curve with both arms up beside an odd-degree curve with one arm down and one up',
          ax.body +
            ax.curve((x) => x * x, AMB, 2.8) +
            ax.curve((x) => x * x * x, SKY, 2.8) +
            text(ax.X(-1.45), ax.Y(3.6), 'x² even', { size: 12, fill: AMB }) +
            text(ax.X(1.5), ax.Y(-3.4), 'x³ odd', { size: 12, fill: SKY }),
          'Even degree: the arms agree. Odd degree: they disagree.',
        );
      })(),
    },
    {
      kind: 'concept',
      head: 'Zeros hide inside the factors',
      body: 'A product is zero only when one of its pieces is zero. So set each factor equal to zero to find the x-intercepts. Watch the sign flip: the factor (x − 5) hides the zero +5, and (x + 2) hides the zero −2.',
      formula: {
        tex: 'p(x) = (x - 2)(x + 3)',
        note: 'A product is zero only when one of its factors is zero — so set each bracket to 0.',
        parts: [
          { sym: 'x - 2', means: 'zero when x = 2 — the graph crosses at 2', tone: 'ok' },
          { sym: 'x + 3', means: 'zero when x = −3 — it crosses at −3', tone: 'accent' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Multiplicity: bounce or cross',
      body: 'MULTIPLICITY is how many times a factor shows up. An ODD number of times means the graph CROSSES the axis there. An EVEN number means it just touches and BOUNCES back, like a ball tapping the floor.',
      compare: {
        cols: [
          { title: 'Odd power · crosses', tex: '(x - 1)^{1}', lines: ['Passes straight through', 'Changes sign'], tone: 'ok' },
          { title: 'Even power · bounces', tex: '(x - 1)^{2}', lines: ['Touches and turns back', 'Keeps its sign'], tone: 'warn' },
        ],
      },
      art: (() => {
        const ax = axes({ x: [-1, 3], y: [-3, 4] }, { ticks: { x: [0, 1, 2], y: [-2, 0, 2] }, grid: true, pad: 30 });
        return art(
          'One curve crossing the x-axis at 1 and another touching it at 1 and turning back',
          ax.body +
            ax.curve((x) => 2 * (x - 1), SKY, 2.8) +
            ax.curve((x) => 2 * (x - 1) * (x - 1), ROSE, 2.8) +
            dot(ax.X(1), ax.Y(0), 5, VIO) +
            text(ax.X(2.3), ax.Y(2.7), 'crosses', { size: 12, fill: SKY }) +
            text(ax.X(0.0), ax.Y(2.7), 'bounces', { size: 12, fill: ROSE }),
          'Both are zero at x = 1 — the power decides whether it goes through or turns around.',
        );
      })(),
    },
    {
      kind: 'example',
      head: 'Start simple: find the degree',
      body: 'Look at p(x) = 4x³ − 2x + 7.\nThe powers of x are 3, 1, and 0.\nThe biggest is 3, so the degree is 3 and the graph has opposite-pointing arms.',
      steps: {
        steps: [
          { tex: 'p(x) = 4x^{3} + x^{2} - 7', text: 'Find the biggest exponent on x.' },
          { tex: '3 > 2 > 0', text: 'The x³ term wins.' },
        ],
        answer: '\\text{degree } 3',
      },
    },
    {
      kind: 'example',
      head: 'Zeros from two factors',
      body: 'Take p(x) = (x − 5)(x + 2).\nSet each factor to zero: x − 5 = 0 gives x = 5.\nAnd x + 2 = 0 gives x = −2. The graph crosses the x-axis at −2 and 5.',
      steps: {
        steps: [
          { tex: '(x - 5)(x + 2) = 0', text: 'A product is zero when a factor is zero.' },
          { tex: 'x - 5 = 0 \\Rightarrow x = 5', text: 'First bracket.' },
          { tex: 'x + 2 = 0 \\Rightarrow x = -2', text: 'Second bracket.' },
        ],
        answer: 'x = 5 \\text{ or } x = -2',
      },
    },
    { kind: 'example', head: 'Where do these arms point?', body: 'For p(x) = −2x⁴ + 3x, only the term −2x⁴ matters at the far ends.\nDegree 4 is even, so both arms match.\nThe −2 is negative, so both arms point DOWN.' },
    {
      kind: 'example',
      head: 'Another way: test giant numbers',
      body: 'Not sure about end behavior? Just plug in something huge.\nAt x = 10, −2x⁴ + 3x is about −20000. At x = −10 it is about −20000 too.\nBoth far ends dive down, which confirms both arms point DOWN.',
      table: {
        head: ['x', 'x³ − 4x', 'sign'],
        rows: [['−100', '−999,600', 'very negative'], ['−10', '−960', 'negative'], ['10', '960', 'positive'], ['100', '999,600', 'very positive']],
        note: 'Far from the origin only the leading term matters — the rest is a rounding error.',
      },
    },
    { kind: 'example', head: 'A roller-coaster track profile', body: 'A track is modeled by h(x) = −(x − 2)(x − 8), where h is height.\nThe track meets the ground where the height is zero: x = 2 and x = 8.\nBetween those two spots the height is positive — that is the hill.' },
    {
      kind: 'example',
      head: 'Bounce instead of cross',
      body: 'Look at p(x) = (x − 3)²(x + 1).\nThe factor (x − 3) appears twice, an even count, so the graph bounces at x = 3.\nThe factor (x + 1) appears once, so the graph crosses at x = −1.',
      steps: {
        steps: [
          { tex: 'p(x) = (x - 3)^{2}(x + 1)', text: 'Read the power on each bracket.' },
          { tex: '(x - 3)^{2}', text: 'Even power at x = 3 — it bounces.' },
          { tex: '(x + 1)^{1}', text: 'Odd power at x = −1 — it crosses.' },
        ],
        answer: '\\text{bounce at } 3,\\ \\text{cross at } -1',
      },
    },
    { kind: 'example', head: 'Another way: check the sign nearby', body: 'Why does a squared factor bounce? Test both sides of x = 3.\nJust left, (x − 3) is negative; squaring makes it positive.\nJust right, it is positive; squaring keeps it positive. The sign never flips, so the graph cannot pass through.' },
    { kind: 'example', head: 'A box cut from cardboard', body: 'Cut a square of side x from each corner of a 12-by-12 inch sheet and fold up the sides: V(x) = x(12 − 2x)².\nAt x = 2: inside is 12 − 4 = 8, squared is 64.\nThen 2 × 64 = 128 cubic inches.' },
    {
      kind: 'protip',
      head: 'Build polynomials backwards',
      body: 'If you know the zeros, you can write the polynomial. Turn each zero r into the factor (x − r) and multiply them together. Zeros at 4 and −3 give (x − 4)(x + 3). Test it by plugging the zeros back in — both should give 0.',
      formula: {
        tex: 'p(x) = a(x - r_1)(x - r_2)\\cdots',
        note: 'Given the zeros, you can write the polynomial straight down — one bracket per zero.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: counting a repeat twice',
      body: 'The polynomial x(x − 4)²(x − 9) looks like it has four zeros because it has four factors. But (x − 4) appears twice and still marks only ONE spot on the axis. Count DIFFERENT x-values: 0, 4, and 9 — that is three.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '(x-2)^{2} \\to x = 2, 2', lines: ['Counts two zeros', 'Two dots on the axis'], tone: 'bad' },
          { title: 'Right', tex: '(x-2)^{2} \\to x = 2', lines: ['One place on the graph', 'Multiplicity 2'], tone: 'ok' },
        ],
        note: 'A repeated factor is ONE x-intercept that behaves differently, not two intercepts.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: profit over months', body: 'A company models profit by P(m) = −(m − 2)(m − 11).\nProfit is zero at month 2 and month 11.\nThe minus in front flips the curve into an upside-down U, so profit rises after month 2, peaks in the middle, and returns to zero at month 11.' },
    {
      kind: 'summary',
      head: 'Arms outside, zeros inside',
      body: 'The degree and leading coefficient tell you where the arms point. The factors tell you where the graph meets the x-axis, with the sign flipping as you solve. Even multiplicity bounces, odd multiplicity crosses, and repeated factors are still one spot.',
      formula: {
        tex: 'p(x) = a(x - r_1)^{m_1}(x - r_2)^{m_2}',
        parts: [
          { sym: 'a', means: 'sign flips both arms; degree decides if they agree', tone: 'warn' },
          { sym: 'r', means: 'where the graph meets the x-axis', tone: 'accent' },
          { sym: 'm', means: 'even bounces, odd crosses', tone: 'ok' },
        ],
      },
    },
  ],

  // ---------------- PC-4 — Rational functions ----------------
  'PC-4': [
    { kind: 'objective', head: 'Fractions of polynomials', body: 'Today you graph functions that are one polynomial divided by another. These graphs have invisible lines they run away from and single missing dots. You will learn to spot both by looking at the top and the bottom separately.' },
    {
      kind: 'concept',
      head: 'Top and bottom do different jobs',
      body: 'A rational function is a fraction with a polynomial on top and one on the bottom. The TOP decides where the graph equals zero. The BOTTOM decides where the graph blows up. Two questions, two places to look.',
      formula: {
        tex: 'r(x) = \\dfrac{p(x)}{q(x)}',
        note: 'Two polynomials, one on top of the other — and each half answers a different question.',
        parts: [
          { sym: 'p(x)', means: 'the TOP — its zeros are where the graph meets the x-axis', tone: 'ok' },
          { sym: 'q(x)', means: 'the BOTTOM — its zeros are where the graph breaks', tone: 'bad' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'The line the graph runs away from',
      body: 'You can never divide by zero. So wherever the bottom equals zero, the graph refuses to exist and instead shoots off toward infinity beside that spot. That invisible line is a VERTICAL ASYMPTOTE — the graph gets close forever and never touches.',
      art: (() => {
        const ax = axes({ x: [-4, 4], y: [-5, 5] }, { ticks: { x: [-2, 0, 2], y: [-4, 0, 4] }, grid: true, pad: 30 });
        let b = ax.body + ax.curve((x) => 1 / (x - 1), AMB, 2.8);
        b += line(ax.X(1), ax.Y(-5), ax.X(1), ax.Y(5), ROSE, 2.4, '6 4');
        b += text(ax.X(2.6), ax.Y(3.4), 'x = 1', { size: 12, fill: ROSE });
        b += text(W / 2, 18, 'the graph never touches it', { size: 12, op: 0.7 });
        return art('A hyperbola with a dashed vertical asymptote at x equals 1 that it never crosses', b,
          'At x = 1 the bottom is zero, so the graph shoots off to infinity on both sides.');
      })(),
      formula: {
        tex: 'q(x) = 0 \\ \\Rightarrow\\ \\text{vertical asymptote}',
        note: 'Dividing by zero is the one thing arithmetic forbids — so the graph refuses to be there.',
      },
    },
    {
      kind: 'concept',
      head: 'Horizontal asymptote: compare degrees',
      body: 'Look far to the right and the graph often flattens toward a level line. If the bottom degree is bigger, that line is y = 0. If the degrees tie, divide the leading coefficients. If the top degree is bigger, there is no horizontal asymptote.',
      compare: {
        cols: [
          { title: 'Bottom wins', tex: '\\deg q > \\deg p', lines: ['y = 0', 'Fades to the axis'], tone: 'accent' },
          { title: 'A tie', tex: '\\deg q = \\deg p', lines: ['y = ratio of leads', 'Levels off'], tone: 'ok' },
          { title: 'Top wins', tex: '\\deg p > \\deg q', lines: ['No horizontal one', 'Runs away'], tone: 'warn' },
        ],
        note: 'Three cases, and you settle them by comparing two exponents — no plotting needed.',
      },
      art: (() => {
        const ax = axes({ x: [0.4, 9], y: [-0.4, 3.4] }, { ticks: { x: [2, 4, 6, 8], y: [0, 1, 2, 3] }, grid: true, pad: 30 });
        let b = ax.body + ax.curve((x) => (3 * x) / (2 * x + 1), AMB, 2.8);
        b += line(ax.X(0.4), ax.Y(1.5), ax.X(9), ax.Y(1.5), EMR, 2.2, '6 4');
        b += text(ax.X(6.4), ax.Y(2.2), 'y = 3/2', { size: 12, fill: EMR });
        return art('A curve levelling off toward a dashed horizontal line at one and a half', b,
          'Top and bottom tie in degree, so the graph settles on the ratio of the leading numbers.');
      })(),
    },
    {
      kind: 'concept',
      head: 'A hole is one missing dot',
      body: 'If the SAME factor appears on top and bottom, it cancels. That x-value is still forbidden, but the graph does not run away there — it is a normal curve with one dot lifted out. That is a HOLE, and it is easy to miss.',
      compare: {
        cols: [
          { title: 'Hole', tex: '\\dfrac{(x-2)(x+1)}{x-2}', lines: ['Factor cancels', 'One dot missing'], tone: 'warn' },
          { title: 'Asymptote', tex: '\\dfrac{x+1}{x-2}', lines: ['Nothing cancels', 'Graph flies off'], tone: 'bad' },
        ],
        note: 'Cancel FIRST. What survives on the bottom makes asymptotes; what cancelled leaves a hole.',
      },
    },
    {
      kind: 'example',
      head: 'Start simple: one asymptote',
      body: 'Take f(x) = 1 ÷ (x − 6).\nThe bottom is zero when x = 6, and dividing by zero is not allowed.\nSo x = 6 is a vertical asymptote — the graph runs away from that line.',
      steps: {
        steps: [
          { tex: 'r(x) = \\dfrac{1}{x - 3}', text: 'Set the bottom equal to zero.' },
          { tex: 'x - 3 = 0', text: 'That is the forbidden input.' },
        ],
        answer: 'x = 3',
      },
    },
    {
      kind: 'example',
      head: 'Another way: sneak up on the line',
      body: 'Watch the values as x creeps toward 6 from the right.\nAt x = 7 you get 1. At x = 6.1 you get 10. At x = 6.01 you get 100.\nThe numbers explode upward, which is exactly what running away from a line looks like.',
      table: {
        head: ['x', 'x − 3', '1 ÷ (x − 3)'],
        rows: [['3.1', '0.1', '10'], ['3.01', '0.01', '100'], ['3.001', '0.001', '1000'], ['3.0001', '0.0001', '10,000']],
        note: 'Divide by something tiny and the answer explodes. That explosion IS the asymptote.',
      },
    },
    {
      kind: 'example',
      head: 'Zeros come from the top',
      body: 'For f(x) = (x − 2) ÷ (x + 5), set the top to zero.\nx − 2 = 0 gives x = 2.\nCheck it: f(2) = 0 ÷ 7 = 0. Zero cookies split among 7 friends is still zero each.',
      steps: {
        steps: [
          { tex: 'r(x) = \\dfrac{x - 4}{x + 2}', text: 'A fraction is zero only when its TOP is zero.' },
          { tex: 'x - 4 = 0', text: 'Solve the numerator.' },
        ],
        answer: 'x = 4',
      },
    },
    { kind: 'example', head: 'Splitting a pizza bill', body: 'You split a $120 bill among n friends, so c(n) = 120 ÷ n.\nWith 8 friends: 120 ÷ 8 = $15 each.\nWith 12 friends: 120 ÷ 12 = $10 each. More friends, smaller share.' },
    {
      kind: 'example',
      head: 'Another way: watch the table shrink',
      body: 'Keep adding friends to that same $120 bill.\n120 friends pay $1 each. 1200 friends pay 10 cents each. 12000 friends pay 1 cent.\nThe share slides toward 0 but never quite gets there — the horizontal asymptote is y = 0.',
      table: {
        head: ['x', '3x ÷ (x² + 1)'],
        rows: [['10', '0.297'], ['100', '0.030'], ['1000', '0.003'], ['10,000', '0.0003']],
        note: 'The bottom grows faster, so the value crawls toward 0 — that is the horizontal asymptote y = 0.',
      },
    },
    {
      kind: 'example',
      head: 'When the degrees tie',
      body: 'Find the horizontal asymptote of f(x) = (3x² + 1) ÷ (x² − 4).\nTop degree 2, bottom degree 2 — a tie.\nDivide the leading numbers: 3 ÷ 1 = 3, so the line is y = 3.',
      steps: {
        steps: [
          { tex: 'r(x) = \\dfrac{3x^{2} + 1}{2x^{2} - 5}', text: 'Both top and bottom are degree 2 — a tie.' },
          { tex: '\\dfrac{3}{2}', text: 'Take the two leading coefficients.' },
        ],
        answer: 'y = 1.5',
      },
    },
    { kind: 'example', head: 'When the bottom wins the race', body: 'For f(x) = (2x + 1) ÷ (x² + 5), the top is degree 1 and the bottom is degree 2.\nAt x = 100 the top is about 200 and the bottom is about 10005.\nThat fraction is tiny, so the asymptote is y = 0.' },
    { kind: 'example', head: 'Medicine fading over time', body: 'Medicine in the blood is C(t) = 20t ÷ (t² + 4) mg per liter after t hours.\nAt t = 2: the top is 40 and the bottom is 8, so C = 5 mg/L.\nLater the squared bottom grows faster, so the level slides back toward 0.' },
    {
      kind: 'protip',
      head: 'Always cancel before you count',
      body: 'Factor the top and the bottom first, then cancel anything that matches. Only the leftover bottom factors make vertical asymptotes. Skipping the cancel step is how people end up counting a hole as a runaway line.',
      formula: {
        tex: '\\dfrac{(x-2)(x+3)}{(x-2)(x-5)} = \\dfrac{x+3}{x-5}',
        note: 'The cancelled (x − 2) still forbids x = 2 — but it leaves a hole, not an asymptote.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: calling a hole an asymptote',
      body: 'In f(x) = (x + 2) ÷ [(x − 1)(x + 2)(x − 7)] it looks like three vertical asymptotes. But (x + 2) cancels, so x = −2 is only a hole. The real asymptotes are x = 1 and x = 7 — just two of them.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\text{bottom} = 0 \\Rightarrow \\text{asymptote}', lines: ['Counts before cancelling', 'Invents a wall'], tone: 'bad' },
          { title: 'Right', tex: '\\text{cancel, then look}', lines: ['Survivors → asymptotes', 'Cancelled → holes'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: sort the bad x-values', body: 'For f(x) = (x − 3)(x + 1) ÷ [(x − 3)(x − 6)], list every forbidden x, then sort them.\nThe bottom is zero at x = 3 and x = 6.\nThe 3 cancels with the top, so it is a hole; the 6 does not cancel, so it is a vertical asymptote.' },
    {
      kind: 'summary',
      head: 'Top for zeros, bottom for trouble',
      body: 'Zeros come from the top of the fraction, and vertical asymptotes come from the bottom. Compare degrees to find the horizontal asymptote. Cancel first: a matching factor leaves a single hole, not a line the graph runs away from.',
      formula: {
        tex: 'r(x) = \\dfrac{p(x)}{q(x)}',
        parts: [
          { sym: 'p = 0', means: 'x-intercepts — where the graph touches the axis', tone: 'ok' },
          { sym: 'q = 0', means: 'vertical asymptotes (or holes, if it cancelled)', tone: 'bad' },
          { sym: '\\deg', means: 'compare the degrees for the horizontal asymptote', tone: 'accent' },
        ],
      },
    },
  ],
};
