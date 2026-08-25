import type { SeedProblem } from './types';

// PC — Precalculus, Units 1-4. 40 problems (10 per unit).
// U1: Functions & transformations · U2: Composite & inverse functions
// U3: Polynomial functions · U4: Rational functions

export const problemsPCu01: SeedProblem[] = [
  // ---------------- UNIT 1 — Functions & transformations ----------------
  {
    domain: 'PC', num: 1, unit: 1, order: 1, slug: 'parabola-slides-up',
    standard: 'PC.FUN.A.1', difficulty: 1,
    prompt: 'The parent parabola $y = x^2$ is changed to $y = x^2 + 5$. How many units UP does the graph slide?',
    answerType: 'numeric', primaryAnswer: '5', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The $+5$ sits OUTSIDE the square, so it changes the $y$-value of every point.' },
      { level: 'guide', text: 'Adding $5$ to every output lifts the whole sticker straight up the window.' },
      { level: 'reveal', text: 'The graph slides UP $5$ units.' },
    ],
    explanation: ['In $f(x) + k$, the $k$ is added AFTER the function does its job.', 'Every $y$-value grows by $5$.', 'So the whole graph slides UP $5$ units.'],
    alternativeExplanations: [
      { title: 'Follow one point', steps: ['On $y = x^2$ the bottom point is $(0, 0)$.', 'On $y = x^2 + 5$, plug in $x = 0$: $y = 0 + 5 = 5$.', 'That bottom point moved from $(0, 0)$ to $(0, 5)$ — up 5.'] },
    ],
    tags: ['transformations', 'vertical-shift'], estimatedSeconds: 30,
  },
  {
    domain: 'PC', num: 2, unit: 1, order: 2, slug: 'minus-moves-right',
    standard: 'PC.FUN.A.1', difficulty: 1,
    prompt: 'The graph of $y = x^2$ is changed to $y = (x - 6)^2$. How many units RIGHT does the graph slide?',
    answerType: 'numeric', primaryAnswer: '6', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The $-6$ is INSIDE the parentheses, next to the $x$. Inside changes move the graph sideways.' },
      { level: 'guide', text: 'Minus moves RIGHT — the sneaky one. A $-6$ inside pushes the sticker to the right, not the left.' },
      { level: 'reveal', text: 'The graph slides RIGHT $6$ units.' },
    ],
    explanation: ['In $f(x - h)$, the graph slides sideways by $h$.', 'Here $h = 6$, and a MINUS inside moves the graph RIGHT.', 'So the parabola slides RIGHT $6$ units.'],
    alternativeExplanations: [
      { title: 'Ask where the bottom lands', steps: ['The bottom of a parabola happens where the squared part equals $0$.', 'For $y = (x - 6)^2$ that needs $x - 6 = 0$, so $x = 6$.', 'The bottom moved from $x = 0$ to $x = 6$ — that is 6 units to the RIGHT.'] },
    ],
    tags: ['transformations', 'horizontal-shift'], estimatedSeconds: 35,
  },
  {
    domain: 'PC', num: 3, unit: 1, order: 3, slug: 'abs-value-vertex-drops',
    standard: 'PC.FUN.A.1', difficulty: 1,
    prompt: 'The V-shaped graph $y = |x|$ becomes $y = |x| - 4$. What is the $y$-coordinate of the point of the V?',
    answerType: 'numeric', primaryAnswer: '-4', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The point of the parent V sits at $(0, 0)$.' },
      { level: 'guide', text: 'The $-4$ is outside the bars, so every point drops $4$.' },
      { level: 'reveal', text: 'The point of the V moves from $0$ down to $-4$.' },
    ],
    explanation: ['$|0| = 0$, so the parent V has its point at $(0, 0)$.', 'Subtracting $4$ outside lowers every $y$-value by $4$.', 'The new point of the V is at $(0, -4)$, so the $y$-coordinate is $-4$.'],
    alternativeExplanations: [
      { title: 'Picture the sticker sliding', steps: ['Imagine the V is a sticker on your window.', 'Subtracting 4 outside means you peel it off and press it back down 4 units lower.', 'The tip of the V lands at $-4$ on the $y$-axis.'] },
    ],
    tags: ['transformations', 'absolute-value', 'vertical-shift'], estimatedSeconds: 30,
  },
  {
    domain: 'PC', num: 4, unit: 1, order: 4, slug: 'game-sprite-slides-right',
    standard: 'PC.FUN.A.1', difficulty: 2,
    prompt: 'In a video game, a character sprite follows the path $y = x^2$. A coder changes the path to $y = (x - 7)^2$. How many units RIGHT does the sprite path move?',
    answerType: 'numeric', primaryAnswer: '7', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Look inside the parentheses. Changes glued to $x$ move the path sideways.' },
      { level: 'guide', text: 'Remember the sneaky rule: a MINUS inside moves the graph RIGHT by that number.' },
      { level: 'reveal', text: 'The sprite path slides RIGHT $7$ units.' },
    ],
    explanation: ['The change is inside the parentheses, so it is a sideways slide.', '$f(x - h)$ moves the graph RIGHT by $h$.', 'Here $h = 7$, so the sprite path moves RIGHT $7$ units.'],
    alternativeExplanations: [
      { title: 'Track the lowest pixel', steps: ['On $y = x^2$ the sprite dips lowest at $x = 0$.', 'On $y = (x - 7)^2$ it dips lowest when $x - 7 = 0$, so $x = 7$.', 'The dip moved 7 steps to the right across the screen.'] },
    ],
    tags: ['transformations', 'horizontal-shift', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'PC', num: 5, unit: 1, order: 5, slug: 'ramp-raised-three-feet',
    standard: 'PC.FUN.A.1', difficulty: 2,
    prompt: 'A skate ramp curves like $y = \\sqrt{x}$. Builders lift the WHOLE ramp $3$ feet higher, giving a new rule $y = \\sqrt{x} + k$. What is $k$?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Lifting the whole shape is a vertical slide, and vertical slides happen OUTSIDE the function.' },
      { level: 'guide', text: 'To move a graph up $3$, you add $3$ to every output.' },
      { level: 'reveal', text: '$k = 3$, so the new ramp is $y = \\sqrt{x} + 3$.' },
    ],
    explanation: ['Raising the ramp does not change how steep it is, only how high it sits.', 'That is $f(x) + k$ — a vertical slide.', 'Up $3$ feet means $k = 3$.'],
    alternativeExplanations: [
      { title: 'Check the front edge', steps: ['The old ramp starts on the ground at $(0, 0)$.', 'After the lift, that same front edge is 3 feet in the air: $(0, 3)$.', 'Plugging $x = 0$ into $y = \\sqrt{x} + k$ gives $y = k$, so $k$ must be 3.'] },
    ],
    tags: ['transformations', 'vertical-shift', 'square-root', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'PC', num: 6, unit: 1, order: 6, slug: 'stretch-parabola-by-four',
    standard: 'PC.FUN.A.1', difficulty: 2,
    prompt: 'The point $(1, 1)$ sits on $y = x^2$. The graph is stretched to $y = 4x^2$. On the new graph, what is the $y$-value when $x = 1$?',
    answerType: 'numeric', primaryAnswer: '4', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'A number multiplying the whole function stretches the graph taller.' },
      { level: 'guide', text: 'Find $x^2$ first when $x = 1$, then multiply that answer by $4$.' },
      { level: 'reveal', text: '$1^2 = 1$, and $4 \\times 1 = 4$.' },
    ],
    explanation: ['In $a \\cdot f(x)$, every $y$-value is multiplied by $a$.', 'Here $a = 4$, so heights become $4$ times bigger.', 'The point $(1, 1)$ becomes $(1, 4)$.'],
    alternativeExplanations: [
      { title: 'A table of heights', steps: ['On $y = x^2$: $x = 1 \\to y = 1$, $x = 2 \\to y = 4$.', 'On $y = 4x^2$: $x = 1 \\to y = 4$, $x = 2 \\to y = 16$.', 'Every height is exactly 4 times taller — the sticker got stretched, not slid.'] },
    ],
    tags: ['transformations', 'vertical-stretch'], estimatedSeconds: 40,
  },
  {
    domain: 'PC', num: 7, unit: 1, order: 7, slug: 'photo-stretched-taller',
    standard: 'PC.FUN.A.1', difficulty: 2,
    prompt: 'A photo app stretches a picture taller by TRIPLING every height above the middle line. One point on the picture was $5$ units above the middle line. How many units above the middle line is it now?',
    answerType: 'numeric', primaryAnswer: '15', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Stretching taller is the same as $3 \\cdot f(x)$: every height gets multiplied.' },
      { level: 'guide', text: 'Multiply the old height $5$ by $3$.' },
      { level: 'reveal', text: '$3 \\times 5 = 15$ units above the middle line.' },
    ],
    explanation: ['A vertical stretch multiplies every $y$-value by the same number.', 'Tripling means multiply by $3$.', '$3 \\times 5 = 15$.'],
    alternativeExplanations: [
      { title: 'Two points, one rule', steps: ['A point 1 unit up moves to 3 units up.', 'A point 2 units up moves to 6 units up.', 'The pattern is "times 3" every time, so 5 units up becomes 15 units up.'] },
    ],
    tags: ['transformations', 'vertical-stretch', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'PC', num: 8, unit: 1, order: 8, slug: 'combined-vertex-x-value',
    standard: 'PC.FUN.A.1', difficulty: 3,
    prompt: 'The graph of $y = 2(x - 3)^2 + 5$ is a moved and stretched parabola. What is the $x$-coordinate of its vertex?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Only the part INSIDE the parentheses decides the left-right position. Ignore the $2$ and the $+5$ for now.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $y = (x - 1)^2$. The vertex is where $x - 1 = 0$, so $x = 1$. Same method: set the inside equal to zero.' },
      { level: 'guide', text: 'Set the inside to zero: $x - 3 = 0$. Solve for $x$.' },
      { level: 'reveal', text: '$x - 3 = 0$ gives $x = 3$, so the vertex sits at $x = 3$.' },
    ],
    explanation: ['A parabola turns around where the squared part equals zero.', 'Set $x - 3 = 0$, so $x = 3$.', 'The $2$ stretches it and the $+5$ lifts it, but neither moves it left or right. The vertex is at $x = 3$.'],
    alternativeExplanations: [
      { title: 'Three moves, in order', steps: ['Start with the sticker $y = x^2$, vertex at $(0, 0)$.', 'Slide RIGHT 3 (minus moves right): vertex now at $(3, 0)$.', 'Stretch by 2 and lift 5: the vertex rises to $(3, 5)$, but its $x$-value stays 3.'] },
    ],
    tags: ['transformations', 'vertex', 'multi-step'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 9, unit: 1, order: 9, slug: 'game-hill-low-point',
    standard: 'PC.FUN.A.1', difficulty: 3,
    prompt: 'In a video game, a hill is drawn with $y = x^2$. The designer changes it to $y = (x + 4)^2 - 6$. What is the $x$-coordinate of the new lowest point of the hill?',
    answerType: 'numeric', primaryAnswer: '-4', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The inside part $(x + 4)$ controls the left-right slide. A PLUS inside moves the graph LEFT.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $y = (x + 1)^2$. Set $x + 1 = 0$ to get $x = -1$ — one step LEFT. Same method with a bigger number here.' },
      { level: 'guide', text: 'Set the inside equal to zero: $x + 4 = 0$.' },
      { level: 'reveal', text: '$x + 4 = 0$ gives $x = -4$. The lowest point is at $x = -4$.' },
    ],
    explanation: ['The lowest point happens where the squared part is zero.', 'Solve $x + 4 = 0$ to get $x = -4$.', 'The $-6$ drops the hill 6 units, but does not change the $x$-coordinate.'],
    alternativeExplanations: [
      { title: 'Test two screen positions', steps: ['Try $x = 0$: $y = (0 + 4)^2 - 6 = 16 - 6 = 10$. That is high up.', 'Try $x = -4$: $y = (0)^2 - 6 = -6$. That is much lower.', 'The dip in the hill is at $x = -4$ — the sprite path slid LEFT.'] },
    ],
    tags: ['transformations', 'horizontal-shift', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 10, unit: 1, order: 10, slug: 'flip-and-lift-max',
    standard: 'PC.FUN.A.1', difficulty: 3,
    prompt: 'The graph $y = -|x| + 7$ is a flipped, lifted V. What is the greatest $y$-value the graph ever reaches?',
    answerType: 'numeric', primaryAnswer: '7', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The minus sign in front FLIPS the V upside down, so its point becomes the HIGHEST spot.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $y = -|x| + 1$. At $x = 0$ you get $y = 1$, and every other $x$ gives less. The top is 1. Same method here.' },
      { level: 'guide', text: '$|x|$ is never negative, so $-|x|$ is never above zero. The biggest it can be is $0$, when $x = 0$.' },
      { level: 'reveal', text: 'At $x = 0$: $y = -0 + 7 = 7$. That is the highest point.' },
    ],
    explanation: ['$-f(x)$ flips the graph upside down over the $x$-axis, turning the V into an upside-down V.', 'The $+7$ lifts the whole flipped shape up 7.', 'The tip is now the top: at $x = 0$, $y = 7$.'],
    alternativeExplanations: [
      { title: 'Try numbers on both sides', steps: ['At $x = -2$: $y = -2 + 7 = 5$.', 'At $x = 0$: $y = 0 + 7 = 7$.', 'At $x = 3$: $y = -3 + 7 = 4$. The values climb to 7 and then fall — 7 is the peak.'] },
    ],
    tags: ['transformations', 'reflection', 'maximum'], estimatedSeconds: 55,
  },

  // ---------------- UNIT 2 — Composite & inverse functions ----------------
  {
    domain: 'PC', num: 11, unit: 2, order: 1, slug: 'composite-two-machines',
    standard: 'PC.FUN.A.2', difficulty: 1,
    prompt: 'Let $f(x) = x + 4$ and $g(x) = 3x$. Find $f(g(2))$.',
    answerType: 'numeric', primaryAnswer: '10', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Work INSIDE first: what does $g$ do to $2$?' },
      { level: 'guide', text: '$g(2) = 3 \\times 2 = 6$. Now feed that $6$ into $f$.' },
      { level: 'reveal', text: '$f(6) = 6 + 4 = 10$.' },
    ],
    explanation: ['Composition runs inside-out.', '$g(2) = 6$.', '$f(6) = 6 + 4 = 10$.'],
    alternativeExplanations: [
      { title: 'As two machines in a row', steps: ['Machine g triples what you feed it: 2 goes in, 6 comes out.', 'That 6 drops straight into machine f, which adds 4 — giving 10.'] },
    ],
    tags: ['composite-function'], estimatedSeconds: 40,
  },
  {
    domain: 'PC', num: 12, unit: 2, order: 2, slug: 'composite-order-flipped',
    standard: 'PC.FUN.A.2', difficulty: 1,
    prompt: 'Using the same $f(x) = x + 4$ and $g(x) = 3x$, find $g(f(2))$.',
    answerType: 'numeric', primaryAnswer: '18', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'This time $f$ is on the inside, so $f$ runs FIRST.' },
      { level: 'guide', text: '$f(2) = 2 + 4 = 6$. Now put that $6$ into $g$.' },
      { level: 'reveal', text: '$g(6) = 3 \\times 6 = 18$.' },
    ],
    explanation: ['The inside machine always goes first. Here that is $f$.', '$f(2) = 6$.', '$g(6) = 18$. Notice this is NOT the same as $f(g(2)) = 10$ — order matters.'],
    alternativeExplanations: [
      { title: 'Swap the machines on the belt', steps: ['Put the "add 4" machine first: 2 goes in, 6 comes out.', 'Then the "triple it" machine: 6 goes in, 18 comes out.', 'Same two machines, different order, different answer.'] },
    ],
    tags: ['composite-function', 'order-matters'], estimatedSeconds: 40,
  },
  {
    domain: 'PC', num: 13, unit: 2, order: 3, slug: 'inverse-undo-add-nine',
    standard: 'PC.FUN.A.2', difficulty: 1,
    prompt: 'Let $f(x) = x + 9$. What is $f^{-1}(20)$?',
    answerType: 'numeric', primaryAnswer: '11', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$f^{-1}$ is the UNDO machine. If $f$ adds 9, what does the undo machine do?' },
      { level: 'guide', text: 'The undo machine subtracts 9. Apply it to 20.' },
      { level: 'reveal', text: '$20 - 9 = 11$.' },
    ],
    explanation: ['$f$ adds $9$, so $f^{-1}$ subtracts $9$.', '$f^{-1}(20) = 20 - 9 = 11$.', 'Check: $f(11) = 11 + 9 = 20$. It really does undo.'],
    alternativeExplanations: [
      { title: 'Ask the backwards question', steps: ['Instead of "what comes out of 20?", ask "what number goes IN to get 20 out?"', 'You need $x + 9 = 20$.', 'Solve: $x = 11$.'] },
    ],
    tags: ['inverse-function'], estimatedSeconds: 35,
  },
  {
    domain: 'PC', num: 14, unit: 2, order: 4, slug: 'dollars-euros-yen-chain',
    standard: 'PC.FUN.A.2', difficulty: 2,
    prompt: 'A money app turns dollars into euros with $e(d) = 0.9d$, then turns euros into yen with $y(e) = 160e$. You start with $\\$50$. How many yen do you end with?',
    answerType: 'numeric', primaryAnswer: '7200', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Two machines in a row. Dollars must become euros FIRST.' },
      { level: 'guide', text: '$e(50) = 0.9 \\times 50 = 45$ euros. Now feed 45 into the yen machine.' },
      { level: 'reveal', text: '$y(45) = 160 \\times 45 = 7200$ yen.' },
    ],
    explanation: ['This is a composition: $y(e(50))$.', 'Inside first: $0.9 \\times 50 = 45$ euros.', 'Then $160 \\times 45 = 7200$ yen.'],
    alternativeExplanations: [
      { title: 'Follow the money on a trip', steps: ['You hand over $\\$50$ at the first window and walk out with 45 euros.', 'You carry those 45 euros to the second window.', 'Each euro is swapped for 160 yen, so you leave with $45 \\times 160 = 7200$ yen.'] },
    ],
    tags: ['composite-function', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 15, unit: 2, order: 5, slug: 'composite-square-outside',
    standard: 'PC.FUN.A.2', difficulty: 2,
    prompt: 'Let $f(x) = x^2$ and $g(x) = x - 1$. Find $f(g(5))$.',
    answerType: 'numeric', primaryAnswer: '16', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Nested boxes: open the INSIDE box $g(5)$ first.' },
      { level: 'guide', text: '$g(5) = 5 - 1 = 4$. Now square that.' },
      { level: 'reveal', text: '$f(4) = 4^2 = 16$.' },
    ],
    explanation: ['Inside first: $g(5) = 4$.', 'Then the outside machine squares it: $4^2 = 16$.', 'Careful — squaring 5 first would give 25, which is the wrong order.'],
    alternativeExplanations: [
      { title: 'A quick table', steps: ['Input 5 goes into machine g: output 4.', 'Output 4 becomes the input for machine f: output 16.', 'Written as a chain: $5 \\to 4 \\to 16$.'] },
    ],
    tags: ['composite-function'], estimatedSeconds: 45,
  },
  {
    domain: 'PC', num: 16, unit: 2, order: 6, slug: 'discount-then-tax',
    standard: 'PC.FUN.A.2', difficulty: 2,
    prompt: 'A jacket costs $\\$80$. First a coupon takes $25\\%$ off. Then $10\\%$ tax is added to the new price. What is the final price in dollars?',
    answerType: 'numeric', primaryAnswer: '66', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Two machines in a row: the discount machine runs FIRST, then the tax machine.' },
      { level: 'guide', text: '$25\\%$ off means you pay $75\\%$: $0.75 \\times 80 = 60$. Now add $10\\%$ tax to $\\$60$.' },
      { level: 'reveal', text: 'Tax: $1.1 \\times 60 = 66$, so the final price is $\\$66$.' },
    ],
    explanation: ['Discount machine: paying $75\\%$ of $\\$80$ gives $\\$60$.', 'Tax machine: $10\\%$ of $\\$60$ is $\\$6$.', '$60 + 6 = \\$66$.'],
    alternativeExplanations: [
      { title: 'One receipt at a time', steps: ['Sticker price: $\\$80$. The coupon takes off $\\$20$ (a quarter of 80).', 'New price on the register: $\\$60$.', 'The tax line adds $\\$6$, so the total you hand over is $\\$66$.'] },
    ],
    tags: ['composite-function', 'percent', 'word-problem'], estimatedSeconds: 60,
  },
  {
    domain: 'PC', num: 17, unit: 2, order: 7, slug: 'inverse-of-two-x-plus-one',
    standard: 'PC.FUN.A.2', difficulty: 2,
    prompt: 'Let $f(x) = 2x + 1$. What is $f^{-1}(9)$?',
    answerType: 'numeric', primaryAnswer: '4', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$f$ does two steps: double, then add 1. The undo machine reverses them in REVERSE order.' },
      { level: 'guide', text: 'Undo the $+1$ first: $9 - 1 = 8$. Then undo the doubling.' },
      { level: 'reveal', text: '$8 \\div 2 = 4$, so $f^{-1}(9) = 4$.' },
    ],
    explanation: ['Forward: double, then add 1.', 'Backward: subtract 1, then halve.', '$9 - 1 = 8$, and $8 \\div 2 = 4$. Check: $f(4) = 9$.'],
    alternativeExplanations: [
      { title: 'Swap x and y', steps: ['Write $y = 2x + 1$, then swap the letters: $x = 2y + 1$.', 'Solve for $y$: $y = \\frac{x - 1}{2}$.', 'Now plug in $x = 9$: $y = \\frac{8}{2} = 4$.'] },
    ],
    tags: ['inverse-function', 'two-step'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 18, unit: 2, order: 8, slug: 'currency-chain-backwards',
    standard: 'PC.FUN.A.2', difficulty: 3,
    prompt: 'A money app turns dollars into euros with $e(d) = 0.8d$, then euros into yen with $y(e) = 150e$. Your friend ended up with $12000$ yen. How many dollars did you start with?',
    answerType: 'numeric', primaryAnswer: '100', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'You are running the chain BACKWARDS, so undo the LAST machine first — socks then shoes means shoes off first.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: a machine doubles, then adds 3, giving 11. Undo backwards: $11 - 3 = 8$, then $8 \\div 2 = 4$. Same idea — undo the last step first.' },
      { level: 'guide', text: 'Undo the yen machine: $12000 \\div 150 = 80$ euros. Now undo the euro machine.' },
      { level: 'reveal', text: '$80 \\div 0.8 = 100$, so you started with $\\$100$.' },
    ],
    explanation: ['Forward the order is dollars $\\to$ euros $\\to$ yen.', 'Backward you undo in reverse: yen $\\to$ euros first.', '$12000 \\div 150 = 80$ euros, then $80 \\div 0.8 = 100$ dollars.'],
    alternativeExplanations: [
      { title: 'Guess and check forward', steps: ['Try $\\$100$: $0.8 \\times 100 = 80$ euros.', 'Then $150 \\times 80 = 12000$ yen — exactly the amount your friend has.', 'So the starting amount was $\\$100$.'] },
    ],
    tags: ['inverse-function', 'composite-function', 'word-problem'], estimatedSeconds: 75,
  },
  {
    domain: 'PC', num: 19, unit: 2, order: 9, slug: 'composite-expression-3x-plus-15',
    standard: 'PC.FUN.A.2', difficulty: 3,
    prompt: 'Let $f(x) = 3x$ and $g(x) = x + 5$. Write $f(g(x))$ as a simplified expression.',
    answerType: 'expression', primaryAnswer: '3x + 15', acceptanceMode: 'normalized',
    alternativeAnswers: ['3x+15', '15 + 3x', '15+3x', '3(x + 5)', '3(x+5)'],
    hints: [
      { level: 'nudge', text: 'Instead of a number, the inside machine now hands over a whole expression: $g(x) = x + 5$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $f(x) = 2x$ and $g(x) = x + 1$. Then $f(g(x)) = 2(x + 1) = 2x + 2$. Same method: drop the inside expression into $f$, then distribute.' },
      { level: 'guide', text: 'Feed $x + 5$ into $f$: you get $3(x + 5)$. Now distribute the 3.' },
      { level: 'reveal', text: '$3(x + 5) = 3x + 15$.' },
    ],
    explanation: ['The inside machine gives $x + 5$.', 'The outside machine triples whatever it gets: $3(x + 5)$.', 'Distribute: $3x + 15$.'],
    alternativeExplanations: [
      { title: 'Check with a number', steps: ['Pick $x = 2$. Then $g(2) = 7$ and $f(7) = 21$.', 'Now test the expression: $3(2) + 15 = 21$. It matches.', 'Testing one number is a fast way to catch a mistake in the distributing.'] },
    ],
    tags: ['composite-function', 'expression'], estimatedSeconds: 70,
  },
  {
    domain: 'PC', num: 20, unit: 2, order: 10, slug: 'undo-discount-and-shipping',
    standard: 'PC.FUN.A.2', difficulty: 3,
    prompt: 'A store takes $20\\%$ off a price, then adds a flat $\\$5$ shipping charge. You paid $\\$45$ in the end. What was the original price in dollars?',
    answerType: 'numeric', primaryAnswer: '50', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Undo the machines in REVERSE order. Shipping was added LAST, so take it off FIRST.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: a price is halved, then $\\$2$ is added, ending at $\\$7$. Undo backwards: $7 - 2 = 5$, then $5 \\times 2 = 10$. Same order of undoing here.' },
      { level: 'guide', text: '$45 - 5 = 40$. That $\\$40$ is the discounted price, which is $80\\%$ of the original.' },
      { level: 'reveal', text: '$40 \\div 0.8 = 50$, so the original price was $\\$50$.' },
    ],
    explanation: ['Take off the shipping first: $45 - 5 = 40$.', 'A $20\\%$ discount means you paid $80\\%$ of the original.', '$40 \\div 0.8 = 50$. The original price was $\\$50$.'],
    alternativeExplanations: [
      { title: 'Run it forward to check', steps: ['Start at $\\$50$. Take $20\\%$ off: that is $\\$10$ off, leaving $\\$40$.', 'Add the $\\$5$ shipping: $\\$45$.', 'That matches what you paid, so $\\$50$ is right.'] },
    ],
    tags: ['inverse-function', 'percent', 'word-problem'], estimatedSeconds: 75,
  },

  // ---------------- UNIT 3 — Polynomial functions ----------------
  {
    domain: 'PC', num: 21, unit: 3, order: 1, slug: 'degree-of-polynomial',
    standard: 'PC.POLY.A.1', difficulty: 1,
    prompt: 'What is the degree of $p(x) = 4x^3 - 2x + 7$?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The degree is the BIGGEST exponent on $x$.' },
      { level: 'guide', text: 'The exponents here are $3$, $1$, and $0$. Which is largest?' },
      { level: 'reveal', text: 'The degree is $3$.' },
    ],
    explanation: ['Look at every power of $x$: $x^3$, $x$, and the plain number $7$.', 'The highest power is $3$.', 'So the degree is $3$.'],
    alternativeExplanations: [
      { title: 'Why the biggest one wins', steps: ['Plug in a huge number like $x = 100$.', '$4x^3$ is 4 million, while $-2x$ is only $-200$.', 'The biggest exponent bosses the whole graph around, so it names the degree.'] },
    ],
    tags: ['polynomials', 'degree'], estimatedSeconds: 30,
  },
  {
    domain: 'PC', num: 22, unit: 3, order: 2, slug: 'largest-zero-from-factors',
    standard: 'PC.POLY.A.1', difficulty: 1,
    prompt: 'The polynomial $p(x) = (x - 5)(x + 2)$ crosses the $x$-axis twice. What is the LARGER of the two zeros?',
    answerType: 'numeric', primaryAnswer: '5', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'A product is zero when one of its factors is zero.' },
      { level: 'guide', text: 'Set each factor to zero: $x - 5 = 0$ gives $x = 5$, and $x + 2 = 0$ gives $x = -2$.' },
      { level: 'reveal', text: 'The zeros are $5$ and $-2$, so the larger is $5$.' },
    ],
    explanation: ['Zeros are the $x$-values that make $p(x) = 0$.', '$x - 5 = 0 \\to x = 5$ and $x + 2 = 0 \\to x = -2$.', 'The larger zero is $5$.'],
    alternativeExplanations: [
      { title: 'Read the sign backwards', steps: ['A factor $(x - 5)$ hides the zero $+5$ — the sign flips.', 'A factor $(x + 2)$ hides the zero $-2$.', 'On a number line those sit at $-2$ and $5$, and 5 is farther right.'] },
    ],
    tags: ['polynomials', 'zeros'], estimatedSeconds: 35,
  },
  {
    domain: 'PC', num: 23, unit: 3, order: 3, slug: 'count-real-zeros-three-factors',
    standard: 'PC.POLY.A.1', difficulty: 1,
    prompt: 'How many real zeros does $p(x) = (x - 1)(x - 4)(x + 3)$ have?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Each factor hides one zero. Count the factors.' },
      { level: 'guide', text: 'The zeros are $x = 1$, $x = 4$, and $x = -3$ — all different.' },
      { level: 'reveal', text: 'There are $3$ real zeros.' },
    ],
    explanation: ['Set each factor equal to zero one at a time.', '$x = 1$, $x = 4$, and $x = -3$.', 'That is $3$ different zeros, so the graph crosses the $x$-axis 3 times.'],
    alternativeExplanations: [
      { title: 'Picture the crossings', steps: ['Imagine a wiggly track drawn across a number line.', 'It dives through the axis at $-3$, then at 1, then at 4.', 'Three dives means three real zeros.'] },
    ],
    tags: ['polynomials', 'zeros'], estimatedSeconds: 35,
  },
  {
    domain: 'PC', num: 24, unit: 3, order: 4, slug: 'coaster-touches-ground',
    standard: 'PC.POLY.A.1', difficulty: 2,
    prompt: 'A roller-coaster track profile is modeled by $h(x) = -(x - 2)(x - 8)$, where $h$ is height. The track touches the ground where $h = 0$. What is the LARGER $x$-value where it touches the ground?',
    answerType: 'numeric', primaryAnswer: '8', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Height is zero when the product is zero. The minus out front does not create new zeros.' },
      { level: 'guide', text: 'Set each factor to zero: $x - 2 = 0$ and $x - 8 = 0$.' },
      { level: 'reveal', text: 'The touch-down points are $x = 2$ and $x = 8$. The larger is $8$.' },
    ],
    explanation: ['A product equals zero only when a factor equals zero.', '$x = 2$ and $x = 8$ are the ground points.', 'The larger is $x = 8$, where the ride comes back down.'],
    alternativeExplanations: [
      { title: 'Ride the track', steps: ['At $x = 2$ the coaster leaves the ground.', 'Between 2 and 8 the height is positive — that is the hill.', 'At $x = 8$ it lands again, so the later ground point is 8.'] },
    ],
    tags: ['polynomials', 'zeros', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'PC', num: 25, unit: 3, order: 5, slug: 'arms-pointing-up-count',
    standard: 'PC.POLY.A.1', difficulty: 2,
    prompt: 'A polynomial graph has two ends, called its ARMS. For $p(x) = -2x^4 + 3x$, how many of the two arms point UP?',
    answerType: 'numeric', primaryAnswer: '0', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Only the leading term $-2x^4$ decides where the arms point.' },
      { level: 'guide', text: 'The degree $4$ is EVEN, so both arms point the same way. The leading coefficient $-2$ is negative.' },
      { level: 'reveal', text: 'Even degree plus a negative leader means both arms point DOWN, so $0$ arms point up.' },
    ],
    explanation: ['Even degree: both arms go the same direction.', 'Negative leading coefficient: that direction is DOWN.', 'So neither arm points up — the answer is $0$.'],
    alternativeExplanations: [
      { title: 'Test giant numbers', steps: ['At $x = 10$: $-2(10000) + 30 = -19970$. Way below zero.', 'At $x = -10$: $-2(10000) - 30 = -20030$. Also way below zero.', 'Both far ends dive down, so no arm points up.'] },
    ],
    tags: ['polynomials', 'end-behavior'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 26, unit: 3, order: 6, slug: 'multiplicity-bounce-point',
    standard: 'PC.POLY.A.1', difficulty: 2,
    prompt: 'For $p(x) = (x - 3)^2(x + 1)$, at which $x$-value does the graph BOUNCE off the $x$-axis instead of crossing it?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Look at the exponents on the factors. One of them is squared.' },
      { level: 'guide', text: 'An EVEN exponent means the graph touches and bounces. An odd exponent means it crosses.' },
      { level: 'reveal', text: '$(x - 3)^2$ has exponent 2, so the graph bounces at $x = 3$.' },
    ],
    explanation: ['Multiplicity is how many times a factor appears.', '$(x - 3)$ appears twice — even multiplicity — so the graph bounces at $x = 3$.', '$(x + 1)$ appears once — odd — so the graph crosses at $x = -1$.'],
    alternativeExplanations: [
      { title: 'Watch the sign around the point', steps: ['Just left of 3, $(x - 3)$ is negative; squaring it makes it positive.', 'Just right of 3, it is positive; squaring keeps it positive.', 'The sign never flips, so the graph cannot pass through — it kisses the axis and bounces.'] },
    ],
    tags: ['polynomials', 'multiplicity'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 27, unit: 3, order: 7, slug: 'profit-curve-later-month',
    standard: 'PC.POLY.A.1', difficulty: 2,
    prompt: 'A company models profit in thousands of dollars over months by $P(m) = -(m - 2)(m - 11)$. Profit is exactly zero in two months. What is the LATER of those two months?',
    answerType: 'numeric', primaryAnswer: '11', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Zero profit means $P(m) = 0$, so one of the factors must be zero.' },
      { level: 'guide', text: '$m - 2 = 0$ gives month 2, and $m - 11 = 0$ gives month 11.' },
      { level: 'reveal', text: 'The later zero-profit month is month $11$.' },
    ],
    explanation: ['Set each factor to zero.', 'Month $2$ and month $11$ both give zero profit.', 'The later one is month $11$.'],
    alternativeExplanations: [
      { title: 'Sketch the profit story', steps: ['Because of the minus sign out front, the curve is an upside-down U.', 'It starts at zero in month 2, rises to a peak, then falls.', 'It hits zero again in month 11 — that is when the good stretch ends.'] },
    ],
    tags: ['polynomials', 'zeros', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 28, unit: 3, order: 8, slug: 'open-box-volume-at-two',
    standard: 'PC.POLY.A.1', difficulty: 3,
    prompt: 'You cut a square of side $x$ inches from each corner of a $12$-inch by $12$-inch piece of cardboard and fold up the sides. The volume is $V(x) = x(12 - 2x)^2$. What is the volume in cubic inches when $x = 2$?',
    answerType: 'numeric', primaryAnswer: '128', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Substitute $x = 2$ everywhere, then follow the order of operations — the parentheses first.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $V(x) = x(6 - 2x)^2$ at $x = 1$: inside is $6 - 2 = 4$, squared is 16, times 1 is 16. Same three steps here.' },
      { level: 'guide', text: 'Inside: $12 - 2(2) = 8$. Square it: $8^2 = 64$. Now multiply by $x = 2$.' },
      { level: 'reveal', text: '$2 \\times 64 = 128$ cubic inches.' },
    ],
    explanation: ['Substitute $x = 2$: $V = 2(12 - 4)^2$.', 'Inside the parentheses: $12 - 4 = 8$.', 'Square it: $64$. Then $2 \\times 64 = 128$ cubic inches.'],
    alternativeExplanations: [
      { title: 'Build the box in your head', steps: ['Cutting 2 inches off BOTH ends of a 12-inch side leaves a base of $12 - 4 = 8$ inches.', 'The folded-up walls are 2 inches tall.', 'Volume = length × width × height = $8 \\times 8 \\times 2 = 128$ cubic inches.'] },
    ],
    tags: ['polynomials', 'evaluate', 'word-problem'], estimatedSeconds: 70,
  },
  {
    domain: 'PC', num: 29, unit: 3, order: 9, slug: 'build-polynomial-from-roots',
    standard: 'PC.POLY.A.1', difficulty: 3,
    prompt: 'Write a polynomial in FACTORED form whose only zeros are $4$ and $-3$, with leading coefficient $1$.',
    answerType: 'expression', primaryAnswer: '(x - 4)(x + 3)', acceptanceMode: 'normalized',
    alternativeAnswers: ['(x-4)(x+3)', '(x + 3)(x - 4)', '(x+3)(x-4)'],
    hints: [
      { level: 'nudge', text: 'Every zero comes from a factor. A zero at $r$ comes from the factor $(x - r)$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: zeros at 2 and 5 give $(x - 2)(x - 5)$. Notice the sign flips from the zero to the factor. Same rule with a negative zero.' },
      { level: 'guide', text: 'The zero $4$ gives $(x - 4)$. The zero $-3$ gives $(x - (-3))$, which is $(x + 3)$.' },
      { level: 'reveal', text: 'The polynomial is $(x - 4)(x + 3)$.' },
    ],
    explanation: ['A zero at $r$ always comes from the factor $(x - r)$.', 'Zero $4$ gives $(x - 4)$; zero $-3$ gives $(x + 3)$.', 'Multiply them together: $(x - 4)(x + 3)$.'],
    alternativeExplanations: [
      { title: 'Test your answer', steps: ['Plug in $x = 4$: $(4 - 4)(4 + 3) = 0 \\times 7 = 0$. Good.', 'Plug in $x = -3$: $(-3 - 4)(-3 + 3) = -7 \\times 0 = 0$. Good.', 'Both zeros work, and no other $x$ makes it zero.'] },
    ],
    tags: ['polynomials', 'zeros', 'factored-form'], estimatedSeconds: 70,
  },
  {
    domain: 'PC', num: 30, unit: 3, order: 10, slug: 'coaster-distinct-ground-points',
    standard: 'PC.POLY.A.1', difficulty: 3,
    prompt: 'A roller-coaster track is modeled by $h(x) = x(x - 4)^2(x - 9)$. At how many DIFFERENT $x$-values does the track touch or cross the ground?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Find every $x$ that makes a factor zero — but count repeats only ONCE.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $x(x - 1)^2$. The zeros are 0 and 1, and 1 shows up twice. That is still only 2 DIFFERENT places. Same counting rule here.' },
      { level: 'guide', text: 'The factors give $x = 0$, $x = 4$ (twice), and $x = 9$.' },
      { level: 'reveal', text: 'The different ground points are $0$, $4$, and $9$ — that is $3$ places.' },
    ],
    explanation: ['Set each factor to zero: $x = 0$, $x = 4$, $x = 9$.', 'The factor $(x - 4)$ appears twice, but $4$ is still one single spot on the track.', 'So the track meets the ground at $3$ different $x$-values.'],
    alternativeExplanations: [
      { title: 'Walk the track', steps: ['At $x = 0$ the ride starts on the ground and crosses.', 'At $x = 4$ it dips down, just kisses the ground, and bounces back up — one spot, not two.', 'At $x = 9$ it crosses again. Three spots total.'] },
    ],
    tags: ['polynomials', 'zeros', 'multiplicity', 'word-problem'], estimatedSeconds: 75,
  },

  // ---------------- UNIT 4 — Rational functions ----------------
  {
    domain: 'PC', num: 31, unit: 4, order: 1, slug: 'vertical-asymptote-simple',
    standard: 'PC.RAT.A.1', difficulty: 1,
    prompt: 'The function $f(x) = \\frac{1}{x - 6}$ has one vertical asymptote. What is its $x$-value?',
    answerType: 'numeric', primaryAnswer: '6', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'You can never divide by zero. Find the $x$ that makes the BOTTOM zero.' },
      { level: 'guide', text: 'Set $x - 6 = 0$ and solve.' },
      { level: 'reveal', text: '$x = 6$ is the vertical asymptote.' },
    ],
    explanation: ['Vertical asymptotes come from the BOTTOM of the fraction.', 'The bottom is zero when $x = 6$.', 'The graph runs away from the line $x = 6$ and never touches it.'],
    alternativeExplanations: [
      { title: 'Sneak up on 6', steps: ['At $x = 7$: $\\frac{1}{1} = 1$.', 'At $x = 6.1$: $\\frac{1}{0.1} = 10$.', 'At $x = 6.01$: $\\frac{1}{0.01} = 100$. The values blast upward — the graph is fleeing the line $x = 6$.'] },
    ],
    tags: ['rational-functions', 'vertical-asymptote'], estimatedSeconds: 35,
  },
  {
    domain: 'PC', num: 32, unit: 4, order: 2, slug: 'zero-comes-from-top',
    standard: 'PC.RAT.A.1', difficulty: 1,
    prompt: 'For $f(x) = \\frac{x - 2}{x + 5}$, what value of $x$ makes $f(x) = 0$?',
    answerType: 'numeric', primaryAnswer: '2', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'A fraction equals zero only when its TOP equals zero.' },
      { level: 'guide', text: 'Set $x - 2 = 0$ and solve.' },
      { level: 'reveal', text: '$x = 2$ makes the top zero, so $f(2) = \\frac{0}{7} = 0$.' },
    ],
    explanation: ['Zeros come from the TOP of the fraction.', '$x - 2 = 0$ gives $x = 2$.', 'Check: $f(2) = \\frac{0}{7} = 0$.'],
    alternativeExplanations: [
      { title: 'Think about sharing zero cookies', steps: ['If you split 0 cookies among 7 friends, everyone gets 0.', 'A fraction with 0 on top is 0, no matter what the bottom is (as long as it is not 0).', 'So you only need the top to be zero: $x = 2$.'] },
    ],
    tags: ['rational-functions', 'zeros'], estimatedSeconds: 35,
  },
  {
    domain: 'PC', num: 33, unit: 4, order: 3, slug: 'pizza-bill-eight-friends',
    standard: 'PC.RAT.A.1', difficulty: 1,
    prompt: 'You split a $\\$120$ pizza bill evenly among $n$ friends, so each person pays $c(n) = \\frac{120}{n}$ dollars. With $8$ friends, how many dollars does each person pay?',
    answerType: 'numeric', primaryAnswer: '15', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Put $8$ in for $n$.' },
      { level: 'guide', text: 'Compute $120 \\div 8$.' },
      { level: 'reveal', text: '$120 \\div 8 = 15$, so each person pays $\\$15$.' },
    ],
    explanation: ['Substitute $n = 8$ into $c(n) = \\frac{120}{n}$.', '$c(8) = \\frac{120}{8}$.', '$120 \\div 8 = 15$ dollars each.'],
    alternativeExplanations: [
      { title: 'Deal out the dollars', steps: ['Give everyone $\\$10$ first: that uses $\\$80$ and leaves $\\$40$.', 'Give everyone $\\$5$ more: that uses the last $\\$40$.', 'Each friend paid $10 + 5 = \\$15$.'] },
    ],
    tags: ['rational-functions', 'evaluate', 'word-problem'], estimatedSeconds: 35,
  },
  {
    domain: 'PC', num: 34, unit: 4, order: 4, slug: 'pizza-bill-approaches-zero',
    standard: 'PC.RAT.A.1', difficulty: 2,
    prompt: 'For the pizza-splitting cost $c(n) = \\frac{120}{n}$, imagine more and more friends joining. As $n$ gets huge, the cost per person gets closer and closer to what number?',
    answerType: 'numeric', primaryAnswer: '0', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Try some big numbers for $n$ and watch what happens to the cost.' },
      { level: 'guide', text: '$c(120) = 1$ dollar. $c(1200) = 0.1$ dollars. The costs keep shrinking.' },
      { level: 'reveal', text: 'The cost heads toward $0$ — that is the horizontal asymptote $y = 0$.' },
    ],
    explanation: ['Splitting a fixed bill among more people means smaller shares.', 'As $n \\to \\infty$, $\\frac{120}{n}$ shrinks toward $0$.', 'The line $y = 0$ is a horizontal asymptote: the cost gets tiny but never actually reaches zero.'],
    alternativeExplanations: [
      { title: 'A shrinking table', steps: ['12 friends: $\\$10$ each. 120 friends: $\\$1$ each.', '1200 friends: 10 cents each. 12000 friends: 1 cent each.', 'The share keeps halving and halving toward 0, but someone always pays a little.'] },
    ],
    tags: ['rational-functions', 'horizontal-asymptote', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'PC', num: 35, unit: 4, order: 5, slug: 'horizontal-asymptote-same-degree',
    standard: 'PC.RAT.A.1', difficulty: 2,
    prompt: 'What is the $y$-value of the horizontal asymptote of $f(x) = \\frac{3x^2 + 1}{x^2 - 4}$?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Compare the DEGREES of the top and bottom. Both are $2$ here.' },
      { level: 'guide', text: 'When the degrees match, divide the leading coefficients: top $3$, bottom $1$.' },
      { level: 'reveal', text: '$\\frac{3}{1} = 3$, so the horizontal asymptote is $y = 3$.' },
    ],
    explanation: ['Top degree $2$, bottom degree $2$ — a tie.', 'On a tie, the asymptote is the leading coefficient of the top over that of the bottom.', '$\\frac{3}{1} = 3$, so $y = 3$.'],
    alternativeExplanations: [
      { title: 'Plug in a giant number', steps: ['Try $x = 100$: top is $30001$, bottom is $9996$.', 'Divide: about $3.0$.', 'Try $x = 1000$ and it is even closer to 3. The graph flattens out toward the line $y = 3$.'] },
    ],
    tags: ['rational-functions', 'horizontal-asymptote'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 36, unit: 4, order: 6, slug: 'horizontal-asymptote-bottom-heavy',
    standard: 'PC.RAT.A.1', difficulty: 2,
    prompt: 'What is the $y$-value of the horizontal asymptote of $f(x) = \\frac{2x + 1}{x^2 + 5}$?',
    answerType: 'numeric', primaryAnswer: '0', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Compare degrees: the top is degree $1$ and the bottom is degree $2$.' },
      { level: 'guide', text: 'When the BOTTOM is bigger, the bottom grows faster and squashes the fraction.' },
      { level: 'reveal', text: 'The horizontal asymptote is $y = 0$.' },
    ],
    explanation: ['Top degree $1$ is smaller than bottom degree $2$.', 'A fast-growing bottom makes the whole fraction tiny.', 'So the graph flattens toward $y = 0$.'],
    alternativeExplanations: [
      { title: 'Race the top against the bottom', steps: ['At $x = 100$: top is about 200, bottom is about 10005.', 'That fraction is about 0.02 — already close to zero.', 'The bottom is winning the race, so the value keeps sliding toward 0.'] },
    ],
    tags: ['rational-functions', 'horizontal-asymptote'], estimatedSeconds: 55,
  },
  {
    domain: 'PC', num: 37, unit: 4, order: 7, slug: 'average-speed-five-hours',
    standard: 'PC.RAT.A.1', difficulty: 2,
    prompt: 'A trip is $300$ miles long. Your average speed in miles per hour is $s(t) = \\frac{300}{t}$, where $t$ is the number of hours the trip takes. If the trip takes $5$ hours, what is your average speed?',
    answerType: 'numeric', primaryAnswer: '60', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Substitute $t = 5$ into the rule.' },
      { level: 'guide', text: 'Compute $300 \\div 5$.' },
      { level: 'reveal', text: '$300 \\div 5 = 60$ miles per hour.' },
    ],
    explanation: ['Speed is distance divided by time.', '$s(5) = \\frac{300}{5}$.', '$300 \\div 5 = 60$ miles per hour.'],
    alternativeExplanations: [
      { title: 'Split the trip into hours', steps: ['Five equal hours must share the 300 miles.', 'Each hour carries the same chunk of road.', '$300$ miles $\\div$ 5 chunks $= 60$ miles in each hour.'] },
    ],
    tags: ['rational-functions', 'evaluate', 'word-problem'], estimatedSeconds: 45,
  },
  {
    domain: 'PC', num: 38, unit: 4, order: 8, slug: 'hole-from-cancelled-factor',
    standard: 'PC.RAT.A.1', difficulty: 3,
    prompt: 'In $f(x) = \\frac{(x - 3)(x + 1)}{(x - 3)(x - 6)}$, one factor cancels. At what $x$-value does the graph have a HOLE?',
    answerType: 'numeric', primaryAnswer: '3', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Look for the factor that appears on BOTH the top and the bottom.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $\\frac{(x - 1)(x + 5)}{(x - 1)(x - 2)}$. The matching factor is $(x - 1)$, so the hole is at $x = 1$. Same method here.' },
      { level: 'guide', text: '$(x - 3)$ is on top and bottom, so it cancels. Set $x - 3 = 0$.' },
      { level: 'reveal', text: 'The hole is at $x = 3$.' },
    ],
    explanation: ['A factor that cancels leaves a HOLE, not an asymptote.', '$(x - 3)$ cancels, so the hole is where $x - 3 = 0$, giving $x = 3$.', 'The leftover factor $(x - 6)$ on the bottom still makes a vertical asymptote at $x = 6$.'],
    alternativeExplanations: [
      { title: 'A missing pixel in the curve', steps: ['Everywhere except $x = 3$, the function simplifies to $\\frac{x + 1}{x - 6}$ — a normal smooth curve.', 'But at exactly $x = 3$ the original fraction is $\\frac{0}{0}$, which is not allowed.', 'So the curve is drawn perfectly except for one missing dot at $x = 3$.'] },
    ],
    tags: ['rational-functions', 'holes'], estimatedSeconds: 70,
  },
  {
    domain: 'PC', num: 39, unit: 4, order: 9, slug: 'medicine-concentration-two-hours',
    standard: 'PC.RAT.A.1', difficulty: 3,
    prompt: 'The amount of medicine in the blood is $C(t) = \\frac{20t}{t^2 + 4}$ milligrams per liter after $t$ hours. What is $C(2)$?',
    answerType: 'numeric', primaryAnswer: '5', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Substitute $t = 2$ into the top AND the bottom separately.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $\\frac{10t}{t^2 + 1}$ at $t = 3$: top is 30, bottom is $9 + 1 = 10$, so the answer is 3. Same three steps here.' },
      { level: 'guide', text: 'Top: $20 \\times 2 = 40$. Bottom: $2^2 + 4 = 8$.' },
      { level: 'reveal', text: '$\\frac{40}{8} = 5$ milligrams per liter.' },
    ],
    explanation: ['Top: $20t = 20 \\times 2 = 40$.', 'Bottom: $t^2 + 4 = 4 + 4 = 8$.', '$\\frac{40}{8} = 5$ mg per liter.'],
    alternativeExplanations: [
      { title: 'Watch the medicine fade', steps: ['At $t = 1$: $\\frac{20}{5} = 4$ mg/L, climbing.', 'At $t = 2$: $\\frac{40}{8} = 5$ mg/L — the peak.', 'At $t = 6$: $\\frac{120}{40} = 3$ mg/L, fading. The bottom eventually grows faster, so the level slides back toward 0.'] },
    ],
    tags: ['rational-functions', 'evaluate', 'word-problem'], estimatedSeconds: 70,
  },
  {
    domain: 'PC', num: 40, unit: 4, order: 10, slug: 'count-vertical-asymptotes',
    standard: 'PC.RAT.A.1', difficulty: 3,
    prompt: 'How many VERTICAL ASYMPTOTES does $f(x) = \\frac{x + 2}{(x - 1)(x + 2)(x - 7)}$ have?',
    answerType: 'numeric', primaryAnswer: '2', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Before counting the bottom factors, check whether any of them cancels with the top.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with $\\frac{x - 5}{(x - 5)(x - 8)}$. The $(x - 5)$ cancels into a hole, so only $x = 8$ is an asymptote — that is 1. Same check here.' },
      { level: 'guide', text: '$(x + 2)$ cancels, so $x = -2$ is a HOLE, not an asymptote. What bottom factors are left?' },
      { level: 'reveal', text: '$(x - 1)$ and $(x - 7)$ remain, giving asymptotes at $x = 1$ and $x = 7$ — that is $2$.' },
    ],
    explanation: ['First cancel: $(x + 2)$ appears on top and bottom, so $x = -2$ is a hole.', 'What is left on the bottom is $(x - 1)(x - 7)$.', 'Those give vertical asymptotes at $x = 1$ and $x = 7$, so there are $2$.'],
    alternativeExplanations: [
      { title: 'Sort the bad x-values into two piles', steps: ['Bad $x$-values from the bottom: $1$, $-2$, and $7$.', 'Pile 1 — cancels with the top: $-2$. That is a hole.', 'Pile 2 — does not cancel: $1$ and $7$. Those are the runaway lines, so the count is 2.'] },
    ],
    tags: ['rational-functions', 'vertical-asymptote', 'holes'], estimatedSeconds: 75,
  },
];
