import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, VIO, W, arrow, art, axes, dot, flow, funcGraph, line, machine, text } from '../slideArt';

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
      why: 'Each parent is just a rule that turns x into a height. For y = x the height equals x, for y = x² it is x times x, for y = |x| it is the distance from zero, and for y = √x it is the number that squares to x. Different rules make different shapes, and every other graph in the family is one of these rules slightly changed.',
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
    { kind: 'concept', head: 'The graph is a sticker on a window', body: 'Picture the parent graph printed on a clear sticker. You can peel it up and press it down somewhere else, or stretch it taller, or flip it over. The shape never changes — only where it sits and how tall it is.', why: 'Moving a graph only changes the coordinates of its points, not how the points sit relative to each other. If you add 3 to every height, every point rises by the same 3 together, so the distances between points stay exactly the same. That is why a transformed graph is the same shape in a new place, never a bent or squashed version.' },
    {
      kind: 'concept',
      head: 'Outside moves it up and down',
      body: 'A number added OUTSIDE the function changes every y-value. In f(x) + k, every point rises by k, so the whole sticker slides straight up. If k is negative, the sticker slides down instead.',
      why: 'A graph is the set of points (x, f(x)). Writing f(x) + 3 keeps each x the same but makes its height 3 bigger, so a point like (2, 4) on y = x² becomes (2, 7). Every point climbs by 3 at the same moment, and that is exactly the whole graph sliding up.',
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
      why: 'In f(x − 2), the new graph gives the height the old graph gave when its input was 2 smaller. To see the old height from x = 0, you now have to plug in x = 2, because 2 − 2 = 0. Every feature of the old graph arrives 2 steps later, so the picture sits 2 units to the right.',
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
      body: 'Look at where the +3 sits in y = x² + 3. What does it do to the parabola?',
      steps: {
        steps: [
          { tex: 'y = x^{2} + 3', text: 'Ask where the 3 sits. It is added after the squaring is finished, outside the function, so it changes the output height. That makes it the k dial.' },
          { tex: '(2,\\,4) \\to (2,\\,4 + 3) = (2,\\,7)', text: 'Test one point. (2, 4) is on y = x², and the new rule adds 3 to its height, so it lands at (2, 7). The x stays the same.' },
          { tex: '(0,\\,0) \\to (0,\\,3)', text: 'Follow the vertex too. Its height 0 becomes 0 + 3 = 3 while x stays 0. The vertex is the lowest point, so it shows where the whole parabola went.' },
          { tex: 'k = +3 \\Rightarrow \\text{up}', text: 'Every point rises by the same 3, and a positive k always means up. So the shape is unchanged and simply sits 3 higher.' },
        ],
        answer: '\\text{up 3}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: track one point',
      body: 'Instead of the whole curve, follow one point. Where does the vertex of y = (x − 4)² end up, and what does that tell you about the whole graph?',
      steps: {
        steps: [
          { tex: 'x - 4 = 0 \\Rightarrow x = 4', text: 'The vertex of a parabola is where the squared part equals zero, since a square cannot go lower than 0. Here x − 4 = 0 happens at x = 4.' },
          { tex: '(4 - 4)^{2} = 0', text: 'Put x = 4 into the rule to get the height. The bracket is 0 and 0² = 0, so the vertex is at (4, 0).' },
          { tex: '(0,\\,0) \\to (4,\\,0)', text: 'The parent vertex was (0, 0), so it moved 4 steps right and 0 steps up. The height did not change, so the slide is purely sideways.' },
          { tex: '\\text{right } 4', text: 'The graph is a rigid sticker, so every other point moved the same way. One point tells you where the whole graph went.' },
        ],
        answer: '\\text{vertex } (4,\\,0),\\ \\text{slid right } 4',
      },
      table: {
        head: ['on y = x²', 'add 4 to x', 'on y = (x − 4)²'],
        rows: [['(0, 0)', '0 + 4', '(4, 0)'], ['(1, 1)', '1 + 4', '(5, 1)'], ['(2, 4)', '2 + 4', '(6, 4)']],
        mark: 0,
        note: 'Move one point you know and the rest of the curve follows it.',
      },
    },
    {
      kind: 'example',
      head: 'Moving a game sprite',
      body: 'In a video game, a sprite follows the path y = x². A coder changes it to y = (x − 7)². Which way does the path move, and how far?',
      steps: {
        steps: [
          { tex: 'y = (x - 7)^{2}', text: 'The 7 is inside the brackets, touching x before the squaring happens. Inside numbers change the x-direction, so this is a left-right slide.' },
          { tex: 'x - 7 = 0 \\Rightarrow x = 7', text: 'Find where the bracket is zero, because that is where the lowest point of the path sits. x − 7 = 0 gives x = 7.' },
          { tex: '(0,\\,0) \\to (7,\\,0)', text: 'Check with the old low point. At x = 7 the height is (7 − 7)² = 0, so (0, 0) has moved to (7, 0). The height did not change.' },
          { tex: '\\text{right } 7', text: 'Bigger x is to the right, so the path slid right. The minus sign inside is misleading, which is why we solve for the zero instead of reading the sign.' },
        ],
        answer: '\\text{right 7 steps}',
      },
    },
    {
      kind: 'example',
      head: 'Raising a skate ramp',
      body: 'A skate ramp curves like y = √x, and builders lift the whole thing 3 feet. What is the new rule, and where does the front edge go?',
      steps: {
        steps: [
          { tex: '\\text{lift} = \\text{change the heights}', text: 'Lifting changes how high each point is, not where it sits left to right. Heights are the outputs, so the change must act on the output.' },
          { tex: 'y = \\sqrt{x} + 3', text: 'Add 3 AFTER the square root is taken. If the 3 went inside, as in √(x + 3), it would slide the ramp sideways instead of lifting it.' },
          { tex: '\\sqrt{0} + 3 = 3', text: 'Check the front edge. At x = 0 the square root is 0, so the new height is 0 + 3 = 3.' },
          { tex: '(0,\\,0) \\to (0,\\,3)', text: 'The front edge moves from (0, 0) to (0, 3), straight up 3 feet with x unchanged. That matches a pure lift.' },
        ],
        answer: 'y = \\sqrt{x} + 3',
      },
    },
    {
      kind: 'example',
      head: 'Stretching a photo taller',
      body: 'A photo app triples every height above the middle line. What rule is that, and what happens to a point that sits 5 units above the middle?',
      steps: {
        steps: [
          { tex: 'y = a \\cdot f(x),\\ a = 3', text: 'Tripling every height means multiplying each output by 3. A number multiplied in front of the function is the a dial, so here a = 3.' },
          { tex: '5 \\to 3 \\cdot 5 = 15', text: 'Test the point 5 units up. Its height 5 is multiplied by 3, so it jumps to 15 units above the middle line.' },
          { tex: '3 \\cdot 0 = 0', text: 'A point right on the middle line has height 0, and 3 times 0 is still 0. So points on the axis stay put while the others stretch away from it.' },
          { tex: 'x \\text{ unchanged}', text: 'Only the output was multiplied, never the x-value, so nothing slides sideways. Taller heights with the same x-positions make the picture taller and skinnier.' },
        ],
        answer: 'y = 3f(x):\\ \\text{every height} \\times 3',
      },
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
      body: 'Compare y = x² with y = −x². What does the minus in front do to the graph?',
      steps: {
        steps: [
          { tex: 'y = -x^{2} = -1 \\cdot x^{2}', text: 'A minus sign out front is the same as multiplying the output by −1. So this is the a dial with a = −1.' },
          { tex: 'x = 2:\\ \\ 4 \\to -4', text: 'Test x = 2. The parent gives height 4, and multiplying by −1 gives −4. A positive height turns into a negative one of the same size.' },
          { tex: '-1 \\cdot 0 = 0', text: 'At x = 0 the height is 0, and −1 times 0 is still 0. So the point on the x-axis does not move, like a hinge.' },
          { tex: '(2,\\,4) \\to (2,\\,-4)', text: 'Every point lands as far below the axis as it was above it, with the same x. That is a reflection over the x-axis, so the smile becomes a frown.' },
        ],
        answer: '\\text{flipped over the } x\\text{-axis}',
      },
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
      body: 'Unsure what a change does? Build a small table. For y = (x − 1)², which x gives the lowest point?',
      steps: {
        steps: [
          { tex: 'x - 1 = -1,\\ 0,\\ 1,\\ 2', text: 'Pick x = 0, 1, 2, 3 and subtract 1 from each. That is what the rule does inside the brackets before it squares anything.' },
          { tex: '(x - 1)^{2} = 1,\\ 0,\\ 1,\\ 4', text: 'Now square each result. Squaring turns −1 into 1, so the heights are 1, 0, 1, and 4.' },
          { tex: '(1,\\,0)', text: 'The smallest height is 0, and it happens at x = 1. That is exactly where the bracket x − 1 is zero, so the low point is at x = 1, not x = −1.' },
          { tex: '\\text{vertex moved } (0,0) \\to (1,0)', text: 'The parent y = x² has its low point at x = 0, so the graph slid right 1. The table confirms that a minus inside moves right.' },
        ],
        answer: '\\text{lowest point at } x = 1\\ (\\text{right } 1)',
      },
      table: {
        head: ['x', 'x − 1', '(x − 1)²'],
        rows: [['0', '−1', '1'], ['1', '0', '0'], ['2', '1', '1'], ['3', '2', '4']],
        mark: 1,
        note: 'The low point lands where the bracket is zero — at x = 1, not x = −1.',
      },
    },
    {
      kind: 'example',
      head: 'Two moves at once',
      body: 'Find the lowest point of y = (x + 4)² − 6. Handle the two numbers one at a time.',
      steps: {
        steps: [
          { tex: 'y = (x + 4)^{2} - 6', text: 'Sort the numbers first. The +4 touches x inside the brackets, so it moves left or right. The −6 is outside the square, so it moves up or down.' },
          { tex: 'x + 4 = 0 \\Rightarrow x = -4', text: 'Inside: find where the bracket is zero. x + 4 = 0 gives x = −4, so the graph slides LEFT 4. The plus sign is misleading, so we never read it directly.' },
          { tex: '(-4 + 4)^{2} - 6 = 0 - 6 = -6', text: 'Outside: put x = −4 into the rule. The square is 0, and the −6 is added to every height, so the lowest height is −6.' },
          { tex: '(0,\\,0) \\to (-4,\\,0) \\to (-4,\\,-6)', text: 'Put the moves together. The old low point slides left 4, then drops 6, and it lands on (−4, −6).' },
        ],
        answer: '(-4,\\,-6)',
      },
    },
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
      body: 'Find the vertex of y = 2(x − 3)² + 5, and say which way it opens. Three dials are turned at once, so take them one at a time.',
      steps: {
        steps: [
          { tex: 'y = 2(x - 3)^{2} + 5', text: 'Name the three dials. The −3 is inside, the 2 is a multiplier in front, and the +5 is outside. Each one does its own job.' },
          { tex: 'x - 3 = 0 \\Rightarrow x = 3', text: 'Inside first: the bracket is zero at x = 3, so the vertex slides RIGHT 3. Minus inside means right.' },
          { tex: 'a = 2 \\Rightarrow 2 \\cdot 0 = 0', text: 'The 2 multiplies every height, so the parabola gets narrower and steeper. The vertex height is 0 and 2 times 0 is 0, so the stretch does not move the vertex.' },
          { tex: '(3,\\,0) \\to (3,\\,0 + 5)', text: 'The +5 is outside, so every height rises 5. The vertex goes from (3, 0) to (3, 5).' },
          { tex: 'a = 2 > 0 \\Rightarrow \\text{opens up}', text: 'The 2 is positive, so there is no flip. The arms point up, which makes the vertex the lowest point.' },
        ],
        answer: '\\text{vertex } (3,\\,5),\\ \\text{opens up}',
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
      why: 'A function must give exactly one output for each input, or it would not be a reliable machine. With f(x) = x + 4, putting in 3 always gives 7 and never anything else. That reliability is what lets us chain machines together and run them backwards later.',
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
      why: 'The output of g is just a number, and f is ready to accept any number, so g\'s answer can be dropped straight into f. But f cannot start until it has its input, which is g\'s answer. So g must finish first. Check with g(x) = x + 1 and f(x) = 2x: g(3) = 4, then f(4) = 8.',
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
      why: 'Take f(x) = 3x + 1 and g(x) = 2x + 1, the pair behind the numbers above. Running g first gives f(g(x)) = 3(2x + 1) + 1 = 6x + 4, but running f first gives g(f(x)) = 2(3x + 1) + 1 = 6x + 3. The extra +1 gets multiplied by a different number depending on the order, so the two answers differ.',
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
      why: 'If f turns an input x into an output y, the inverse has to turn that same y back into x, so it is the steps of f done in reverse. Swapping x and y in the equation is exactly that role reversal. Check: f(x) = x + 9 sends 5 to 14, and the inverse subtracts 9 to send 14 back to 5.',
      art: machine('y', 'f⁻¹', 'x', { title: 'the undo machine', caption: 'The inverse runs the same steps backwards, in the opposite order.' }),
      formula: {
        tex: 'f^{-1}(f(x)) = x',
        note: 'Send a number through and straight back and you land exactly where you started.',
      },
    },
    {
      kind: 'example',
      head: 'Start simple: f(g(2))',
      body: 'Let f(x) = x + 4 and g(x) = 3x. Find f(g(2)). Which machine runs first?',
      steps: {
        steps: [
          { tex: 'f(g(2))\\ \\to\\ g(2)\\ \\text{first}', text: 'Look for the innermost brackets. g(2) sits inside f, so g must run first, because f cannot start until it has an input.' },
          { tex: 'g(2) = 3 \\cdot 2 = 6', text: 'Run machine g: its rule is "multiply by 3", so the input 2 becomes 6.' },
          { tex: 'f(6) = 6 + 4', text: 'That 6 is now the input for f. Put it where x was in f(x) = x + 4, which gives 6 + 4.' },
          { tex: 'f(6) = 10', text: 'Add to finish. Two machines in a row turned 2 into 10, with g going first.' },
        ],
        answer: '10',
      },
    },
    {
      kind: 'example',
      head: 'Flip the order: g(f(2))',
      body: 'Use the same machines, f(x) = x + 4 and g(x) = 3x, but in the opposite order. Find g(f(2)) and compare it with the last answer.',
      steps: {
        steps: [
          { tex: 'g(f(2))\\ \\to\\ f(2)\\ \\text{first}', text: 'Now f is the inside machine, because f(2) sits in the brackets of g. So f runs first this time.' },
          { tex: 'f(2) = 2 + 4 = 6', text: 'Run f: its rule adds 4, so the input 2 becomes 6.' },
          { tex: 'g(6) = 3 \\cdot 6 = 18', text: 'Feed the 6 into g, whose rule is "multiply by 3". That gives 18.' },
          { tex: '18 \\ne 10', text: 'The earlier order gave 10, so the order matters. Adding 4 before tripling also triples the 4, while adding after does not.' },
        ],
        answer: '18',
      },
    },
    {
      kind: 'example',
      head: 'Dollars to euros to yen',
      body: 'A money app uses e(d) = 0.9d to turn dollars into euros, then y(e) = 160e to turn euros into yen. How many yen is $50?',
      steps: {
        steps: [
          { tex: 'y(e(50))', text: 'Write the trip as a composite. The dollars go through the euro window first, so e is the inside machine and y is outside.' },
          { tex: 'e(50) = 0.9 \\cdot 50 = 45', text: 'Run the first machine. Each dollar is worth 0.9 euros, so multiply by 0.9 to get 45 euros.' },
          { tex: 'y(45) = 160 \\cdot 45', text: 'The 45 euros is the input to the yen machine. Each euro is worth 160 yen, so we multiply 45 by 160.' },
          { tex: '160 \\cdot 45 = 7200', text: 'Compute: 160 × 45 is 160 × 40 = 6400 plus 160 × 5 = 800, which is 7200. Order mattered, since euros had to exist before they could become yen.' },
        ],
        answer: '7200 \\text{ yen}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: draw the chain',
      body: 'Instead of nested letters, draw the machines as boxes in a row. Start with 2, add 3, then double. What comes out?',
      steps: {
        steps: [
          { tex: '2 \\xrightarrow{+3} \\square \\xrightarrow{\\times 2} \\square', text: 'Draw one arrow per machine, left to right, in the order they run. Reading along the arrows replaces hunting for the innermost brackets.' },
          { tex: '2 + 3 = 5', text: 'First box: add 3 to the input 2. This is the inside machine, so it goes first and gives 5.' },
          { tex: '5 \\times 2 = 10', text: 'Second box: take the 5 that came out and double it. The output of box one is the input of box two.' },
          { tex: '2 \\to 5 \\to 10', text: 'The whole trip is 2 to 5 to 10. Swapping the boxes would give (2 × 2) + 3 = 7, so the drawn order is what fixes the answer.' },
        ],
        answer: '10',
      },
      art: machine('2', '+3 → ×2', '10', { title: 'the chain, drawn', caption: 'Drawing the boxes makes the order impossible to get wrong.' }),
    },
    {
      kind: 'example',
      head: 'Discount, then tax',
      body: 'A jacket costs $80. A coupon takes 25% off, then 10% tax is added. What is the final price?',
      steps: {
        steps: [
          { tex: '\\text{price} \\to \\text{discount} \\to \\text{tax}', text: 'Treat each step as a machine and run them in the order the store does. The discount comes first, and the tax is charged on whatever is left.' },
          { tex: '80 \\cdot 0.75 = 60', text: 'Taking 25% off means you keep 75%, so multiply by 0.75. That makes the price $60.' },
          { tex: '60 \\cdot 1.10 = 66', text: 'Adding 10% tax means paying 110% of the price, so multiply by 1.10. The tax is $6, so the total is $66.' },
          { tex: '0.75 \\cdot 1.10 = 0.825', text: 'As a check, the two machines combine to one factor of 0.825, and 80 × 0.825 = 66. Tax on the smaller price is smaller, so the order matters.' },
        ],
        answer: '\\$66',
      },
    },
    {
      kind: 'example',
      head: 'Undoing a two-step machine',
      body: 'Let f(x) = 2x + 1, so f doubles and then adds 1. Find f⁻¹(9), the input that makes the output 9.',
      steps: {
        steps: [
          { tex: 'x \\xrightarrow{\\times 2} \\square \\xrightarrow{+1} 9', text: 'List what f does in order: double, then add 1. The inverse must undo those steps in the opposite order, like taking off shoes before socks.' },
          { tex: '9 - 1 = 8', text: 'The LAST step was adding 1, so undo it FIRST by subtracting 1. Subtraction cancels addition, so 9 becomes 8.' },
          { tex: '8 \\div 2 = 4', text: 'Now undo the doubling by dividing by 2, since division cancels multiplication. That gives 4.' },
          { tex: 'f(4) = 2 \\cdot 4 + 1 = 9', text: 'Check by running f forward. Doubling 4 gives 8, and adding 1 gives 9, so the input 4 really does produce 9.' },
        ],
        answer: 'f^{-1}(9) = 4',
      },
    },
    {
      kind: 'example',
      head: 'Another way: swap x and y',
      body: 'Find the rule for the inverse of f(x) = 2x + 1 by swapping x and y, then check it with the input 9.',
      steps: {
        steps: [
          { tex: 'y = 2x + 1', text: 'Write the function with y in place of f(x). Now x is the input and y is the output, which makes it easy to trade their roles.' },
          { tex: 'x = 2y + 1', text: 'Swap x and y. The inverse takes the old output as its input and gives back the old input, so the two letters trade jobs.' },
          { tex: 'x - 1 = 2y', text: 'Solve for y. First subtract 1 from both sides to get the 2y alone. Doing the same thing to both sides keeps the equation true.' },
          { tex: 'y = \\dfrac{x - 1}{2}', text: 'Divide both sides by 2 to isolate y. This is the inverse rule, and it undoes the doubling and the adding in reverse order.' },
          { tex: 'f^{-1}(9) = \\dfrac{9 - 1}{2} = 4', text: 'Check it with 9. Subtract 1 to get 8, then halve to get 4, which matches the answer from the other method.' },
        ],
        answer: 'f^{-1}(x) = \\dfrac{x - 1}{2}',
      },
    },
    {
      kind: 'example',
      head: 'Running a chain backwards',
      body: 'A store takes 20% off, then adds $5 shipping. You paid $45. What was the original price?',
      steps: {
        steps: [
          { tex: '\\text{price} \\xrightarrow{\\times 0.8} \\square \\xrightarrow{+5} 45', text: 'Write the chain in the order it happened: first 20% off (keep 80%), then add $5 shipping. To go backwards, undo the steps in reverse order.' },
          { tex: '45 - 5 = 40', text: 'Shipping was added LAST, so peel it off FIRST. Subtracting 5 undoes adding 5 and leaves the discounted price of $40.' },
          { tex: '40 \\div 0.8 = 50', text: 'The discount kept 80% of the price, so undo it by dividing by 0.8. Dividing cancels multiplying, and 40 ÷ 0.8 is 50.' },
          { tex: '50 \\cdot 0.8 + 5 = 45', text: 'Check by running forward. 80% of 50 is 40, and adding 5 gives 45, exactly what you paid.' },
        ],
        answer: '\\$50',
      },
    },
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
    {
      kind: 'challenge',
      head: 'Extra credit: compose with letters',
      body: 'Let f(x) = 3x and g(x) = x + 5. Find a single rule for f(g(x)), using the letter x instead of a number.',
      steps: {
        steps: [
          { tex: 'f(g(x)) = f(x + 5)', text: 'The inside machine runs first. With a letter input it hands over the whole expression x + 5, just as it would hand over a number.' },
          { tex: 'f(\\square) = 3 \\cdot \\square', text: 'Recall the rule for f: whatever sits in the brackets gets multiplied by 3. So the box will hold x + 5.' },
          { tex: 'f(x + 5) = 3(x + 5)', text: 'Put the entire expression x + 5 into f. Keep it in brackets so the 3 multiplies both parts.' },
          { tex: '3(x + 5) = 3x + 15', text: 'Use the distributive property: 3 times x is 3x and 3 times 5 is 15. Skipping the brackets would give 3x + 5, which is wrong.' },
          { tex: 'x = 2:\\ g(2) = 7,\\ f(7) = 21 = 3(2) + 15', text: 'Check with x = 2. Running the machines gives g(2) = 7 and f(7) = 21, and the formula gives 3(2) + 15 = 21, so they agree.' },
        ],
        answer: 'f(g(x)) = 3x + 15',
      },
    },
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
    {
      kind: 'objective',
      head: 'Read a polynomial like a map',
      body: 'Today you look at a polynomial and predict its graph without plotting a single point. Two things tell the story: the degree and the factors. One decides where the arms point, the other decides where the graph meets the x-axis.',
      art: flow([{ label: 'Degree sets the end behaviour', color: SKY }, { label: 'Factors give the zeros', color: AMB }, { label: 'Multiplicity says bounce or cross', color: EMR }], { title: 'What a polynomial graph tells you' }),
    },
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
      art: funcGraph([{ f: (x) => (x + 2) * (x - 1) }], { range: { x: [-4, 3], y: [-5, 6] }, zeros: [{ at: -2, label: 'x = −2' }, { at: 1, label: 'x = 1' }], title: '(x + 2)(x − 1) crosses twice', caption: 'Each factor set to zero gives one crossing. The factors ARE the zeros.' }),
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
    {
      kind: 'objective',
      head: 'Fractions of polynomials',
      body: 'Today you graph functions that are one polynomial divided by another. These graphs have invisible lines they run away from and single missing dots. You will learn to spot both by looking at the top and the bottom separately.',
      art: flow([{ label: 'Cancel shared factors first', color: SKY }, { label: 'Bottom zero: asymptote or hole', color: AMB }, { label: 'Compare degrees for the level', color: EMR }], { title: 'Reading a rational function' }),
    },
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
      art: funcGraph([{ f: (x) => x + 3 }], { range: { x: [-5, 4], y: [-3, 7] }, points: [{ x: 2, y: 5, label: 'hole at x = 2', hollow: true, color: ROSE }], title: 'A cancelled factor leaves a gap', caption: 'The curve is a perfectly ordinary line with exactly one point missing.' }),
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
