import type { SlideBank } from './types';
import {
  AMB, EMR, ROSE, SKY, VIO,
  areaModel, balance, bars, flow, lineGraph, numberLine, plotGrid, tape,
} from '../slideArt';

// SAT Math slide decks, units 1-6: linear equations, linear functions, lines in
// two variables, systems, inequalities, and equivalent expressions.

export const SAT_SLIDES_U01_06: SlideBank = {
  // ---------------- SAT-1 — Linear equations in one variable ----------------
  'SAT-1': [
    {
      kind: 'objective',
      head: 'One equation, three possible endings',
      body: 'Most SAT equations have one answer, like x = 5 for 3x + 7 = 22. But some have NONE, and some are true for EVERY number. By the end you will solve fast and spot which ending you are in before you start.',
      art: balance('3x + 7', '22', { title: 'Keep both sides level', note: 'x = 5', caption: 'Whatever you do to one pan, do to the other, and the scale stays balanced.' }),
    },
    {
      kind: 'concept',
      head: 'Undo in reverse order',
      body: 'An equation wraps x in layers. Peel them off from the outside in: clear parentheses and fractions, gather the x-terms on one side, then divide by the coefficient.',
      art: flow([{ label: 'Clear ( ) and fractions', color: SKY }, { label: 'Gather x on one side', color: AMB }, { label: 'Divide by the coefficient', color: EMR }], { title: 'The solving order', horizontal: false, caption: 'Three moves, always in this order.' }),
      formula: { tex: 'ax + b = c \\;\\Rightarrow\\; x = \\frac{c - b}{a}', note: 'Take away the constant, then divide by the coefficient.', parts: [{ sym: 'b', means: 'the constant: undo it first', tone: 'accent' }, { sym: 'a', means: 'the coefficient: divide by it last', tone: 'ok' }] },
      why: 'An equation is a balanced scale, so anything you do to one side you must do to the other. The expression 3x + 7 was built by multiplying x by 3 and then adding 7, so you undo the LAST step first (subtract 7) and the FIRST step last (divide by 3), like taking off your shoes before your socks.',
    },
    {
      kind: 'concept',
      head: 'Count the solutions before you solve',
      body: 'Tidy both sides into ax + b and cx + d. Now compare the pieces. The COEFFICIENTS decide whether x survives; the CONSTANTS decide what is left if it does not.',
      compare: {
        cols: [
          { title: 'One solution', tex: '3x + 1 = 2x + 5', lines: ['Coefficients differ', 'x survives: x = 4'], tone: 'ok' },
          { title: 'No solution', tex: '2x + 1 = 2x + 5', lines: ['Same coefficient', 'Leaves 1 = 5, false'], tone: 'bad' },
          { title: 'Infinitely many', tex: '2x + 5 = 2x + 5', lines: ['Everything matches', 'Leaves 5 = 5, always true'], tone: 'accent' },
        ],
        note: 'x disappears in the last two — what is left decides the ending.',
      },
      why: 'Subtract the right-hand x-term from both sides and every equation of this type becomes (a − c)x = d − b. If a and c differ, you can divide and get exactly one answer. If a = c, the x-term becomes 0x, which leaves the plain statement 0 = d − b: false when the constants differ (no solution) and true when they match (every x works).',
    },
    {
      kind: 'concept',
      head: 'Backsolving: let the choices do the work',
      body: 'When the answer choices are plain numbers, you can test them instead of solving. Choices are listed in order, so start in the MIDDLE: one test tells you whether to go up or down.',
      table: { head: ['Choice', 'Plug into 3x + 7', 'Equals 22?'], rows: [['3', '16', 'too small'], ['5', '22', 'yes'], ['7', '28', 'too big']], mark: 1, note: 'One middle test, then you know which way to move.' },
      why: 'A true solution must make both sides equal, so plugging in a choice is a complete check, with no algebra to slip on. Because the choices are sorted and 3x + 7 grows as x grows, one middle test tells you the direction: too big means look at the smaller choices, too small means the larger ones.',
    },
    {
      kind: 'example',
      head: 'Two steps: 3x + 7 = 22',
      body: 'You want the number x that makes 3x + 7 equal 22. The +7 was applied last, so it comes off first, then the multiplication by 3. Finish by checking.',
      steps: { steps: [{ tex: '3x + 7 - 7 = 22 - 7', text: 'Subtract 7 from both sides. The +7 was added last, so it is undone first, and doing the same thing to both sides keeps the equation balanced.' }, { tex: '3x = 15', text: 'Simplify both sides. On the left 7 − 7 cancels to 0, and on the right 22 − 7 is 15. Now x is only multiplied by 3.' }, { tex: 'x = \\tfrac{15}{3} = 5', text: 'Divide both sides by 3. Dividing undoes the multiplication, and since both sides get the same division they stay equal.' }, { tex: '3(5) + 7 = 15 + 7 = 22', text: 'Check by putting 5 back into the ORIGINAL equation. The left side comes out to 22, which matches the right side. On test day, when the choices are numbers, test the middle choice first instead of solving.' }], answer: 'x = 5' },
    },
    {
      kind: 'example',
      head: 'Distribute first: 4(x − 2) = 2x + 10',
      body: 'Solve for x. Parentheses are the outermost layer, so open them first, then gather the x-terms on one side and the plain numbers on the other.',
      steps: { steps: [{ tex: '4x - 8 = 2x + 10', text: 'Distribute the 4. The distributive property says a number outside parentheses multiplies every term inside, so 4 times x is 4x and 4 times −2 is −8.' }, { tex: '2x - 8 = 10', text: 'Subtract 2x from both sides to collect the x-terms. On the left 4x − 2x is 2x, and on the right the 2x cancels completely.' }, { tex: '2x = 18', text: 'Add 8 to both sides. This cancels the −8 on the left, and 10 + 8 is 18 on the right, so only the x-term is left on the left side.' }, { tex: 'x = \\tfrac{18}{2} = 9', text: 'Divide both sides by 2 to undo the multiplication. If the choices are plain numbers, backsolving (the next example) is a faster test-day move.' }], answer: 'x = 9' },
    },
    {
      kind: 'example',
      head: 'Clear the fractions: x/3 + 2 = x/2',
      body: 'Solve for x. Fractions slow you down, so clear them first by multiplying the whole equation by a number that both denominators divide into.',
      formula: { tex: '6\\cdot\\frac{x}{3} + 6\\cdot 2 = 6\\cdot\\frac{x}{2} \\;\\Rightarrow\\; 2x + 12 = 3x', note: 'Multiply every single term — the lonely 2 as well.', parts: [{ sym: '6', means: 'the least common denominator of 3 and 2', tone: 'accent' }, { sym: '2x + 12 = 3x', means: 'no fractions left, so x = 12', tone: 'ok' }] },
      steps: { steps: [{ tex: '\\text{LCD}(3,2) = 6', text: 'Find the least common denominator. 6 is the smallest number that both 3 and 2 divide into evenly, so multiplying by 6 will clear both fractions.' }, { tex: '6\\cdot\\tfrac{x}{3} + 6\\cdot 2 = 6\\cdot\\tfrac{x}{2}', text: 'Multiply EVERY term by 6, including the lone 2. Multiplying both sides of an equation by the same nonzero number keeps it true, but skipping a term breaks it.' }, { tex: '2x + 12 = 3x', text: 'Simplify each term. 6 ÷ 3 is 2, so the first term is 2x. 6 times 2 is 12. 6 ÷ 2 is 3, so the right side is 3x. No fractions are left.' }, { tex: '12 = x', text: 'Subtract 2x from both sides. Moving x to the side with the bigger coefficient keeps it positive, since 3x − 2x is x.' }, { tex: '\\tfrac{12}{3} + 2 = 6 = \\tfrac{12}{2}', text: 'Check in the original. 12/3 is 4 and 4 + 2 is 6, while 12/2 is also 6, so both sides match.' }], answer: 'x = 12' },
    },
    {
      kind: 'example',
      head: 'Another way: backsolve 4(x − 2) = 2x + 10',
      body: 'Suppose the answer choices are 5, 7, 9 and 11. Instead of solving, plug choices into both sides and see which one makes them equal.',
      table: { head: ['x', 'Left: 4(x − 2)', 'Right: 2x + 10'], rows: [['7', '20', '24'], ['9', '28', '28'], ['11', '36', '32']], mark: 1, note: 'At 7 the right side is bigger; at 11 the left is. The match is between them.' },
      steps: { steps: [{ tex: 'x = 7:\\; 4(5) = 20 \\text{ vs } 2(7) + 10 = 24', text: 'Start with a middle choice. At 7 the left side is 20 and the right side is 24, so they are not equal. The right side is still bigger.' }, { tex: '\\text{Left grows 4 per step; right grows 2 per step}', text: 'Decide which way to go. The left side climbs faster as x grows, so it can catch up with the right side only if x gets larger. Try the next choice up.' }, { tex: 'x = 9:\\; 4(7) = 28 \\text{ and } 2(9) + 10 = 28', text: 'At 9 both sides equal 28, so 9 makes the equation true. Each side is a straight line in x, so they can match only once and no other choice needs testing.' }], answer: 'x = 9' },
    },
    {
      kind: 'example',
      head: 'No solution: 2(3x + 1) = 6x + 5',
      body: 'How many solutions does this have? Distribute, then compare what is left on each side. The graph of each side is a line, which shows the same story.',
      art: lineGraph([{ m: 6, b: 2, label: 'y = 6x + 2', color: SKY }, { m: 6, b: 5, label: 'y = 6x + 5', color: ROSE }], { range: { x: [-2, 2], y: [-8, 12] }, title: 'Parallel lines never cross', caption: 'Same slope, different intercepts: the two sides can never be equal.' }),
      steps: { steps: [{ tex: '2(3x + 1) = 6x + 2', text: 'Distribute the 2 to both terms in the parentheses, since multiplication spreads over addition. 2 times 3x is 6x and 2 times 1 is 2.' }, { tex: '6x + 2 = 6x + 5', text: 'Rewrite the equation with the simplified left side. Both sides now have the same x-term, 6x, but different constants.' }, { tex: '2 = 5', text: 'Subtract 6x from both sides. The x-terms cancel and leave 2 = 5, which is false no matter what x is.' }, { tex: '\\text{no value of } x \\text{ works}', text: 'A false statement means no x can make the equation true. This matches the graph: y = 6x + 2 and y = 6x + 5 are parallel, so they never meet. A test-day shortcut: after distributing, same x-coefficient and different constants means no solution, with no further work.' }], answer: '\\text{No solution}' },
    },
    {
      kind: 'example',
      head: 'A negative answer: −3x + 4 = 19',
      body: 'Solve for x. The +4 comes off first, then divide by the coefficient, which is negative this time, so watch the sign.',
      art: numberLine(-8, 2, [{ at: -5, label: 'x = −5', color: ROSE }, { at: 0, label: '0' }], { title: 'The solution lands left of zero', caption: 'Check it: −3 times −5 is 15, and 15 + 4 = 19.' }),
      steps: { steps: [{ tex: '-3x + 4 - 4 = 19 - 4', text: 'Subtract 4 from both sides. The +4 is the outer layer, so it comes off first, and the same subtraction on both sides keeps them equal.' }, { tex: '-3x = 15', text: 'Simplify. 4 − 4 cancels on the left and 19 − 4 is 15 on the right. Now x is just multiplied by −3.' }, { tex: 'x = \\tfrac{15}{-3} = -5', text: 'Divide both sides by −3. A positive number divided by a negative number is negative, so the answer lands left of zero.' }, { tex: '-3(-5) + 4 = 15 + 4 = 19', text: 'Check in the original equation. A negative times a negative is positive, so −3 times −5 is 15, and 15 + 4 is 19 as required.' }], answer: 'x = -5' },
    },
    {
      kind: 'protip',
      head: 'Infinitely many? Match both parts',
      body: 'A question like "for what k does 5x + k = 5x + 8 have infinitely many solutions" is a matching game. The x-parts already match. Make the constants match too: k = 8.',
      formula: { tex: 'ax + b = ax + b', note: 'Same coefficient AND same constant: true for every x.', parts: [{ sym: 'ax', means: 'the x-parts must match', tone: 'accent' }, { sym: 'b', means: 'the constants must match too', tone: 'ok' }] },
      why: 'For an equation to be true for every x, the two sides must be the very same expression. Here 5x already matches 5x, so only k and 8 are left to match. If k were 7 instead, subtracting 5x would leave 7 = 8, which is false, so the equation would have no solution.',
    },
    {
      kind: 'trap',
      head: 'A minus reaches every term',
      body: 'When a negative sits outside parentheses, it multiplies EVERYTHING inside. The second term flips sign too, and that is the piece people drop.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '-2(x - 3) = -2x - 6', lines: ['Only the first term was hit'], tone: 'bad' },
          { title: 'Right', tex: '-2(x - 3) = -2x + 6', lines: ['Negative times negative is positive'], tone: 'ok' },
        ],
      },
      why: 'A minus sign in front of parentheses means multiply by −1, and the distributive property says to multiply every term inside. So −2 times x is −2x, and −2 times −3 is +6 because a negative times a negative is positive. Check with x = 0: −2(0 − 3) is 6, which matches +6 and not −6.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: k(x + 2) = 4x + 10',
      body: 'For what value of k does this equation have NO solution? An equation has no solution when the x-terms cancel but the constants disagree. Distribute, then compare.',
      steps: { steps: [{ tex: 'kx + 2k = 4x + 10', text: 'Distribute k to both terms in the parentheses, using the distributive property. Now each side is written as an x-term plus a constant.' }, { tex: 'k = 4', text: 'For x to disappear, the x-coefficients must match. If k were not 4, you could divide by (k − 4) and get a solution, so k has to be 4.' }, { tex: '4x + 8 = 4x + 10', text: 'Put k = 4 back in. The left side becomes 4x + 2(4), which is 4x + 8. Both sides now have the same x-term.' }, { tex: '8 = 10', text: 'Subtract 4x from both sides. What is left is false, so no x works. The constants must differ, and 2k = 8 is not 10, so k = 4 gives no solution. Test-day shortcut: match the x-coefficients first, then check the constants differ.' }], answer: 'k = 4' },
    },
    {
      kind: 'summary',
      head: 'Linear equations, wrapped up',
      body: 'Undo in reverse: parentheses, gather x, divide. Before solving, compare the pieces to see if there is one solution, none, or infinitely many. When choices are numbers, backsolving is often faster and safer.',
      table: { head: ['After tidying', 'Ending'], rows: [['Coefficients differ', 'One solution'], ['Same coefficient, different constant', 'No solution'], ['Everything the same', 'Infinitely many']] },
    },
  ],

  // ---------------- SAT-2 — Linear functions and rate of change ----------------
  'SAT-2': [
    {
      kind: 'objective',
      head: 'Every line is a start plus a rate',
      body: 'A taxi charges $5 to get in and $3 per mile: C = 3m + 5. The 5 is where the line starts and the 3 is how fast it climbs. SAT questions ask you to read those two numbers as real things.',
      art: lineGraph([{ m: 3, b: 5, label: 'C = 3m + 5', color: SKY }], { range: { x: [0, 6], y: [0, 25] }, showIntercept: true, slopeFrom: 2, xLabel: 'miles', yLabel: 'cost', title: 'Start at 5, climb 3 per mile', caption: 'The intercept is the flat fee; the slope is the price per mile.' }),
    },
    {
      kind: 'concept',
      head: 'Slope is rise over run',
      body: 'Take any two points on a line. Slope is how much y changes divided by how much x changes. Between (2, 5) and (6, 17), y rises 12 while x runs 4, so the slope is 3.',
      formula: { tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}', note: 'Change in y over change in x — in the same order on top and bottom.', parts: [{ sym: 'y_2 - y_1', means: 'the rise: how far up or down', tone: 'accent' }, { sym: 'x_2 - x_1', means: 'the run: how far across', tone: 'ok' }] },
      art: plotGrid([{ x: 2, y: 5, label: '(2, 5)', color: SKY }, { x: 6, y: 17, label: '(6, 17)', color: ROSE }], { join: true, range: { x: [0, 8], y: [0, 20] }, title: 'Rise 12, run 4', caption: 'Twelve up for four across is three up for each one across.' }),
      why: 'On a straight line the climb for each step across is the same everywhere, so any two points give the same ratio. From (2, 5) to (6, 17), the line goes 12 up over 4 across. Cut that into four equal steps across and each one climbs 3, so the slope is 3 up for every 1 across.',
    },
    {
      kind: 'concept',
      head: 'What multiplies x is a rate',
      body: 'In a model like C(h) = 65h + 40, ask what each number is attached to. The 65 multiplies the hours, so it is dollars PER hour. The 40 stands alone, so it is a one-time amount.',
      compare: {
        cols: [
          { title: 'The rate', tex: '65h', lines: ['Multiplies the input', 'Read it as "per hour"'], tone: 'accent' },
          { title: 'The start', tex: '+40', lines: ['Stands alone', 'The value when h = 0'], tone: 'ok' },
        ],
      },
      why: 'Put h = 0 into 65h + 40 and the 65h term vanishes, leaving 40: that is the starting amount. Now go from h = 1 to h = 2 and the cost grows from 105 to 170, an increase of 65. The number attached to the input is added once per unit of input, which is exactly what a rate does.',
    },
    {
      kind: 'concept',
      head: 'A constant rate makes a steady table',
      body: 'In a linear function every step of 1 in x adds the same amount to y. Read down a table: if the jumps are all equal, it is linear, and the jump IS the slope.',
      table: { head: ['Hours', 'Cost ($)', 'Jump'], rows: [['0', '40', '—'], ['1', '105', '+65'], ['2', '170', '+65'], ['3', '235', '+65']], note: 'Equal jumps of 65: linear, with slope 65.' },
      why: 'If y = mx + b, then moving from x to x + 1 changes y by m(x + 1) + b − (mx + b), and everything cancels except m. So the jump is the same size from every starting point. If the jumps change, like 1, 4, 9, the rate itself is changing, so the graph bends and is not a line.',
    },
    {
      kind: 'example',
      head: 'Slope from two points: (2, 5) and (6, 17)',
      body: 'Find the slope of the line through these two points. Slope is how much y changes per unit of x, so subtract the y-values, subtract the x-values in the same order, and divide.',
      steps: { steps: [{ tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}', text: 'Start from the slope formula, which is change in y divided by change in x. Call (2, 5) the first point and (6, 17) the second.' }, { tex: '17 - 5 = 12', text: 'Find the rise by subtracting the y-values, second minus first. The line goes up 12, and a positive answer means it climbs from left to right.' }, { tex: '6 - 2 = 4', text: 'Find the run by subtracting the x-values in the SAME order, second minus first. Swapping the order in only one place would flip the sign of the slope.' }, { tex: '\\tfrac{12}{4} = 3', text: 'Divide rise by run. The line climbs 3 for every 1 step across. On test day you can also type both points into a Desmos table and read the slope.' }], answer: 'm = 3' },
    },
    {
      kind: 'example',
      head: 'Read the model: C(h) = 65h + 40',
      body: 'A plumber prices a job of h hours with this formula. What do the 65 and the 40 mean? Test it with a couple of small values of h.',
      formula: { tex: 'C(h) = 65h + 40', note: 'Rate times hours, plus a one-time fee.', parts: [{ sym: '65', means: 'dollars charged for each hour of work', tone: 'accent' }, { sym: '40', means: 'a flat fee, paid even for zero hours', tone: 'ok' }] },
      steps: { steps: [{ tex: 'C(0) = 65(0) + 40 = 40', text: 'Put in h = 0. With zero hours the 65h term disappears, so 40 is what you pay before any work happens. That makes it a one-time fee.' }, { tex: 'C(1) = 65(1) + 40 = 105', text: 'Now put in one hour. The cost is 105, which is 65 more than the fee alone, so the first hour added 65.' }, { tex: 'C(1) - C(0) = 105 - 40 = 65', text: 'Subtract to see the change for one extra hour. It is 65, the number multiplying h, so each hour adds 65 dollars: the rate.' }, { tex: '65 \\text{ per hour},\\; 40 \\text{ flat}', text: 'Say it in words using units. The number multiplying the input is dollars per hour and the number standing alone is a one-time amount. On the real test you can skip the arithmetic and just read it off.' }], answer: '\\$65 \\text{ per hour, plus a } \\$40 \\text{ fee}' },
    },
    {
      kind: 'example',
      head: 'Build it: f(0) = 3 and f(4) = 11',
      body: 'Write the linear function f(x) = mx + b that passes through these two facts. Find b from f(0), then find m from the change between the two points.',
      steps: { steps: [{ tex: 'f(x) = mx + b', text: 'A linear function always has this form, so the job is to find the two numbers m and b.' }, { tex: 'b = f(0) = 3', text: 'Put x = 0 into mx + b. The mx term becomes 0, so f(0) equals b. The value at zero is the starting value, 3.' }, { tex: 'm = \\frac{11 - 3}{4 - 0} = \\frac{8}{4} = 2', text: 'Use the slope formula on the points (0, 3) and (4, 11). The rise is 8 over a run of 4, so f climbs 2 for each 1 step in x.' }, { tex: 'f(4) = 2(4) + 3 = 11', text: 'Check with the other fact. Plugging x = 4 into 2x + 3 gives 11, matching the given value, so the formula is right.' }], answer: 'f(x) = 2x + 3' },
    },
    {
      kind: 'example',
      head: 'Another way: fill in a table',
      body: 'Build the same function without a formula. A linear function changes by the same amount every step, so you can split the total change into equal jumps.',
      table: { head: ['x', 'f(x)', 'Jump'], rows: [['0', '3', '—'], ['1', '5', '+2'], ['2', '7', '+2'], ['3', '9', '+2'], ['4', '11', '+2']], mark: 4, note: 'Equal jumps of 2 each time: the slope is 2.' },
      steps: { steps: [{ tex: 'x: 0 \\to 4 \\text{ is } 4 \\text{ steps}', text: 'Count the steps between the known x-values. Going from x = 0 to x = 4 takes four steps of 1, and a linear function jumps by the same amount on every step.' }, { tex: '\\tfrac{11 - 3}{4} = \\tfrac{8}{4} = 2', text: 'Split the total rise of 8 into 4 equal jumps. Each jump is +2, because equal jumps are what a constant rate means.' }, { tex: '3,\\ 5,\\ 7,\\ 9,\\ 11', text: 'Fill in the table by adding 2 each time, starting at f(0) = 3. The last entry is 11, which matches the given f(4), so the jumps are right.' }, { tex: 'f(x) = 2x + 3', text: 'Read the formula off the table. The jump per step is the slope 2, and the value at x = 0 is the intercept 3.' }], answer: 'f(x) = 2x + 3' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a draining tank',
      body: 'A tank holds 500 liters and drains 20 liters a minute. When is it empty? Sketch it first, then write the line and find where it meets the t-axis.',
      art: lineGraph([{ m: -20, b: 500, label: 'V = 500 − 20t', color: SKY }], { range: { x: [0, 30], y: [0, 650] }, points: [{ x: 25, y: 0, label: 'empty', color: ROSE }], title: 'Falling 20 liters a minute', caption: 'A negative slope is a draining rate. Empty is where the line meets the axis.' }),
      steps: { steps: [{ tex: 'V = 500 - 20t', text: 'Write the line. It starts at 500 liters, which is the intercept, and loses 20 liters each minute, so the slope is −20. The slope is negative because the amount is falling.' }, { tex: '0 = 500 - 20t', text: 'Empty means V = 0, so put 0 in for V. This is the point where the line meets the horizontal axis.' }, { tex: '20t = 500', text: 'Add 20t to both sides so the t-term becomes positive. Adding the same amount to both sides keeps the equation balanced.' }, { tex: 't = \\tfrac{500}{20} = 25', text: 'Divide both sides by 20. It matches the picture, where the line hits zero at t = 25. Check: 25 minutes times 20 liters is 500 liters, the whole tank.' }], answer: 't = 25 \\text{ minutes}' },
    },
    {
      kind: 'example',
      head: 'A negative slope: (−1, 4) and (3, −8)',
      body: 'Find the slope through these points. Be careful with the negatives: the line should fall, so expect a negative answer.',
      art: plotGrid([{ x: -1, y: 4, label: '(−1, 4)', color: SKY }, { x: 3, y: -8, label: '(3, −8)', color: ROSE }], { join: true, range: { x: [-3, 5], y: [-10, 6] }, title: 'Down 12, across 4', caption: 'Falling left to right means a negative slope.' }),
      steps: { steps: [{ tex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}', text: 'Use the slope formula. Call (−1, 4) the first point and (3, −8) the second, and keep that order on top and bottom.' }, { tex: '-8 - 4 = -12', text: 'Find the rise, second y minus first y. The answer is negative because the line goes DOWN as you move right.' }, { tex: '3 - (-1) = 3 + 1 = 4', text: 'Find the run in the same order. Subtracting a negative number is the same as adding its positive, so the run is 4, not 2.' }, { tex: '\\tfrac{-12}{4} = -3', text: 'Divide the rise by the run. A negative divided by a positive is negative, matching the falling line: down 3 for each 1 across.' }], answer: 'm = -3' },
    },
    {
      kind: 'protip',
      head: 'Units tell you what a number means',
      body: 'Slope always carries "y-units per x-unit." If y is dollars and x is hours, the slope is dollars per hour. Say the units out loud and the interpretation question answers itself.',
      art: flow([{ label: 'Find what multiplies x', color: SKY }, { label: 'Name its units: y per x', color: AMB }, { label: 'Say it as a sentence', color: EMR }], { title: 'Interpreting a number', caption: 'Three questions turn a coefficient into a sentence.' }),
      why: 'Slope is change in y divided by change in x, so its units are y-units divided by x-units, just as miles divided by hours gives miles per hour. That is why saying the units out loud tells you what the number counts, such as dollars for each hour.',
    },
    {
      kind: 'trap',
      head: 'Keep the order the same',
      body: 'If you subtract the second point from the first on top, do it on the bottom too. Mixing the orders flips the sign of the slope, and the wrong sign is always one of the choices.',
      compare: {
        cols: [
          { title: 'Mixed order', tex: '\\frac{17 - 5}{2 - 6} = -3', lines: ['Top and bottom disagree'], tone: 'bad' },
          { title: 'Same order', tex: '\\frac{17 - 5}{6 - 2} = 3', lines: ['Second minus first, both times'], tone: 'ok' },
        ],
      },
      why: 'Swapping the order on top only makes 5 − 17 = −12 instead of 12, while the bottom stays 4, so the slope flips from 3 to −3. A quick sign check catches it: the line from (2, 5) to (6, 17) climbs as you move right, so its slope must be positive.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: when do two plans cost the same?',
      body: 'Plan A costs 20 + 5x dollars and Plan B costs 35 + 2x for x months. Where do the lines cross, and which plan wins after that? Set the costs equal.',
      art: lineGraph([{ m: 5, b: 20, label: 'A = 20 + 5x', color: SKY }, { m: 2, b: 35, label: 'B = 35 + 2x', color: ROSE }], { range: { x: [0, 10], y: [0, 75] }, points: [{ x: 5, y: 45, label: '(5, 45)', color: VIO }], xLabel: 'months', title: 'The plans cross at month 5', caption: 'Before the crossing A is cheaper; after it, B is.' }),
      steps: { steps: [{ tex: '20 + 5x = 35 + 2x', text: 'Set the two costs equal. The month where the costs are the same is the crossing point of the two lines.' }, { tex: '3x + 20 = 35', text: 'Subtract 2x from both sides to gather the x-terms on one side. 5x − 2x leaves 3x and the right side keeps just 35.' }, { tex: '3x = 15', text: 'Subtract 20 from both sides to leave only the x-term. 35 − 20 is 15.' }, { tex: 'x = 5', text: 'Divide both sides by 3. The plans cost the same at month 5.' }, { tex: '20 + 5(5) = 45 = 35 + 2(5)', text: 'Check by pricing both plans at month 5. Both come to 45 dollars, so the crossing is (5, 45). After that, B is cheaper because its slope, 2, is smaller than A\'s slope, 5. On test day, Desmos shows the crossing directly.' }], answer: 'x = 5 \\text{ months}' },
    },
    {
      kind: 'summary',
      head: 'Linear functions, wrapped up',
      body: 'Slope is rise over run, with units of y per x. The intercept is the value at zero — the start. In a word problem, whatever multiplies x is a rate and whatever stands alone is a one-time amount.',
      formula: { tex: 'y = mx + b', note: 'Rate times input, plus the start.', parts: [{ sym: 'm', means: 'the rate: change in y for each 1 in x', tone: 'accent' }, { sym: 'b', means: 'the start: the value when x is zero', tone: 'ok' }] },
    },
  ],

  // ---------------- SAT-3 — Linear equations in two variables ----------------
  'SAT-3': [
    {
      kind: 'objective',
      head: 'One line, three ways to write it',
      body: 'The equation 3x + 2y = 12 and the equation y = −1.5x + 6 draw the very same line. Each form makes one thing easy to see. You will learn to switch between them and pick the form that answers the question.',
      art: lineGraph([{ m: -1.5, b: 6, label: 'y = −1.5x + 6', color: SKY }], { range: { x: [-1, 6], y: [-2, 8] }, points: [{ x: 0, y: 6, label: '(0, 6)', color: AMB }, { x: 4, y: 0, label: '(4, 0)', color: ROSE }], title: 'Same line, any form', caption: 'Both equations pass through (0, 6) and (4, 0).' }),
    },
    {
      kind: 'concept',
      head: 'Three forms, three jobs',
      body: 'Slope-intercept shows the slope and starting value. Standard form is how totals are written. Point-slope builds a line from any point you know.',
      compare: {
        cols: [
          { title: 'Slope-intercept', tex: 'y = mx + b', lines: ['Read slope and intercept'], tone: 'accent' },
          { title: 'Standard', tex: 'Ax + By = C', lines: ['Totals of two things'], tone: 'ok' },
          { title: 'Point-slope', tex: 'y - y_1 = m(x - x_1)', lines: ['Build from a point'], tone: 'warn' },
        ],
      },
      why: 'All three are the same line, just rearranged with legal algebra. Solving for y shows the slope and starting value. Ax + By = C is what you get when you add up two kinds of cost. Point-slope is the slope formula (y − y₁)/(x − x₁) = m with both sides multiplied by (x − x₁), so it builds a line from any one point.',
    },
    {
      kind: 'concept',
      head: 'Intercepts: cover one letter',
      body: 'To find where 4x + 5y = 20 hits an axis, cover a variable. With x = 0, 5y = 20, so the y-intercept is (0, 4). With y = 0, 4x = 20, so the x-intercept is (5, 0).',
      formula: { tex: 'Ax + By = C \\;\\Rightarrow\\; \\left(\\tfrac{C}{A},\\,0\\right),\\ \\left(0,\\,\\tfrac{C}{B}\\right)', note: 'Divide C by the coefficient you did NOT cover.', parts: [{ sym: 'C/A', means: 'where the line crosses the x-axis', tone: 'accent' }, { sym: 'C/B', means: 'where the line crosses the y-axis', tone: 'ok' }] },
      art: plotGrid([{ x: 0, y: 4, label: '(0, 4)', color: SKY }, { x: 5, y: 0, label: '(5, 0)', color: ROSE }], { join: true, range: { x: [-1, 7], y: [-1, 6] }, title: 'Two intercepts draw the line', caption: 'Two points are all a line needs.' }),
      why: 'A point on the y-axis has x = 0, and a point on the x-axis has y = 0. Putting 0 in for one variable kills its term, so the equation shrinks to one easy step: 5y = 20 gives y = 4, and 4x = 20 gives x = 5. That gives two points, and two points are all a line needs.',
    },
    {
      kind: 'concept',
      head: 'Parallel and perpendicular',
      body: 'Parallel lines have the SAME slope, like y = 2x + 1 and y = 2x − 3. Perpendicular slopes multiply to −1: flip the fraction and change the sign.',
      art: lineGraph([{ m: 2, b: 1, label: 'y = 2x + 1', color: SKY }, { m: 2, b: -3, label: 'y = 2x − 3', color: EMR }], { range: { x: [-3, 4], y: [-8, 8] }, title: 'Same slope, never meet', caption: 'Parallel lines rise at exactly the same rate.' }),
      formula: { tex: 'm_1 \\cdot m_2 = -1', note: 'Perpendicular slopes are negative reciprocals, like 2/3 and −3/2.', parts: [{ sym: 'm_1', means: 'the slope of the first line', tone: 'accent' }, { sym: '-1', means: 'the product of perpendicular slopes', tone: 'ok' }] },
      why: 'Equal slopes mean two lines climb at the same rate, so the gap between them never changes and they never meet. For perpendicular lines, turn a triangle with rise 2 and run 3 a quarter turn: rise and run trade places and one direction reverses, giving slope −3/2. The product (2/3)(−3/2) = −1 confirms it.',
    },
    {
      kind: 'example',
      head: 'The slope of 3x + 2y = 12',
      body: 'Find the slope of this line. The slope is easiest to read when the equation is y = mx + b, so solve for y.',
      steps: { steps: [{ tex: '2y = -3x + 12', text: 'Subtract 3x from both sides. This moves the x-term across the equals sign, and its sign changes because we subtracted it from both sides.' }, { tex: 'y = -\\tfrac{3}{2}x + 6', text: 'Divide EVERY term by 2, including the 12. Dividing only one term would break the equality, because the whole side must be divided.' }, { tex: 'y = mx + b \\Rightarrow m = -\\tfrac{3}{2}', text: 'Read the slope. In y = mx + b the slope is the number multiplying x, which is −3/2. The 6 is the y-intercept. Test-day shortcut: the slope of Ax + By = C is −A/B.' }], answer: 'm = -\\tfrac{3}{2}' },
    },
    {
      kind: 'example',
      head: 'Build a line: through (2, 7), slope 4',
      body: 'Write the equation of the line through (2, 7) with slope 4. Point-slope form takes a point and a slope directly.',
      steps: { steps: [{ tex: 'y - 7 = 4(x - 2)', text: 'Use point-slope form, y − y₁ = m(x − x₁). It comes from the slope formula (y − 7)/(x − 2) = 4 with both sides multiplied by (x − 2).' }, { tex: 'y - 7 = 4x - 8', text: 'Distribute the 4 over both terms in the parentheses, so 4 times −2 gives −8.' }, { tex: 'y = 4x - 1', text: 'Add 7 to both sides to get y alone. −8 + 7 is −1.' }, { tex: '4(2) - 1 = 7', text: 'Check that the point (2, 7) is on the line: plugging in x = 2 gives y = 7. Faster on the test: write y = 4x + b, put in (2, 7) to get 7 = 8 + b, so b = −1.' }], answer: 'y = 4x - 1' },
    },
    {
      kind: 'example',
      head: 'Another way: slope straight from standard form',
      body: 'For 3x + 2y = 12, you can get the slope in one step with a formula. Where does the formula −A/B come from? Solve the general equation once.',
      formula: { tex: 'Ax + By = C \\;\\Rightarrow\\; m = -\\frac{A}{B}', note: 'Minus the x-coefficient over the y-coefficient.', parts: [{ sym: 'A', means: 'the number in front of x goes on top', tone: 'accent' }, { sym: 'B', means: 'the number in front of y goes underneath', tone: 'ok' }] },
      steps: { steps: [{ tex: 'A = 3,\\; B = 2', text: 'In Ax + By = C, A is the number in front of x and B is the number in front of y. Here A is 3 and B is 2.' }, { tex: 'By = -Ax + C \\Rightarrow y = -\\tfrac{A}{B}x + \\tfrac{C}{B}', text: 'Solve the general equation for y once and for all: subtract Ax, then divide every term by B. The number multiplying x is now −A/B.' }, { tex: 'm = -\\tfrac{3}{2}', text: 'Put in A = 3 and B = 2. This matches the answer from solving for y by hand, so the formula saves a step. Keep the minus sign, because it comes from moving Ax across the equals sign.' }], answer: 'm = -\\tfrac{3}{2}' },
    },
    {
      kind: 'example',
      head: 'Picture it first: ticket sales',
      body: 'Adult tickets are $12, child tickets $8, and the sales total was $480. Write the equation, then sketch it by finding where it meets the axes.',
      art: plotGrid([{ x: 40, y: 0, label: '(40, 0)', color: SKY }, { x: 0, y: 60, label: '(0, 60)', color: ROSE }], { join: true, range: { x: [0, 50], y: [0, 75] }, xLabel: 'adults', title: 'Every mix that makes $480', caption: 'Standard form is how a total of two kinds of things is written.' }),
      steps: { steps: [{ tex: '12a + 8c = 480', text: 'Add up the money. 12 dollars for each of a adult tickets plus 8 dollars for each of c child tickets makes 480. That is standard form, the usual way to write a total.' }, { tex: 'a = 0:\\; 8c = 480,\\; c = 60', text: 'Find one end of the line by covering a. If no adults came, all 480 dollars came from children, so 480 ÷ 8 gives 60 child tickets. That is the point (0, 60).' }, { tex: 'c = 0:\\; 12a = 480,\\; a = 40', text: 'Cover c to find the other end. If no children came, 480 ÷ 12 gives 40 adult tickets, the point (40, 0).' }, { tex: 'a = 20:\\; 240 + 8c = 480,\\; c = 30', text: 'Every point on the line between them is a valid mix. For example, 20 adults bring in 240 dollars, leaving 240 for children, which is 30 tickets. Check: 12(20) + 8(30) = 480.' }], answer: '12a + 8c = 480' },
    },
    {
      kind: 'example',
      head: 'Perpendicular through (0, −4)',
      body: 'Find the line through (0, −4) that is perpendicular to y = (2/3)x + 1. Perpendicular lines have negative reciprocal slopes, so find the slope first.',
      formula: { tex: 'y = -\\tfrac{3}{2}x - 4', note: 'Negative reciprocal slope, and the given intercept.', parts: [{ sym: '-\\tfrac{3}{2}', means: 'flip 2/3 and change the sign', tone: 'accent' }, { sym: '-4', means: 'the y-intercept from the point (0, −4)', tone: 'ok' }] },
      steps: { steps: [{ tex: 'm_1 = \\tfrac{2}{3}', text: 'Read the slope of the given line from y = mx + b. It is the number multiplying x.' }, { tex: 'm_2 = -\\tfrac{3}{2}', text: 'Flip the fraction and change the sign. Perpendicular slopes multiply to −1, and (2/3) times (−3/2) is −1, so this slope works.' }, { tex: 'b = -4', text: 'The point (0, −4) has x = 0, so it sits on the y-axis. That means −4 is the y-intercept, with no further work.' }, { tex: 'y = -\\tfrac{3}{2}x - 4', text: 'Put the slope and the intercept into y = mx + b. Check: the point (0, −4) satisfies it, since the x-term vanishes at x = 0.' }], answer: 'y = -\\tfrac{3}{2}x - 4' },
    },
    {
      kind: 'example',
      head: 'Two points: (1, 3) and (3, −1)',
      body: 'Find the line through these two points. Get the slope first, then use one point in point-slope form and simplify.',
      table: { head: ['x', 'y = −2x + 5'], rows: [['1', '3'], ['2', '1'], ['3', '−1']], note: 'Both given points check out.' },
      steps: { steps: [{ tex: 'm = \\frac{-1 - 3}{3 - 1} = \\frac{-4}{2} = -2', text: 'Find the slope with rise over run, second point minus first on both top and bottom. The line falls 4 over a run of 2, so m is −2.' }, { tex: 'y - 3 = -2(x - 1)', text: 'Use point-slope with the first point. Either point works, because both lie on the same line.' }, { tex: 'y - 3 = -2x + 2', text: 'Distribute the −2. A negative times −1 is positive, so the last term is +2, not −2.' }, { tex: 'y = -2x + 5', text: 'Add 3 to both sides to get y alone. Check with the other point: −2(3) + 5 is −1, so (3, −1) is on the line. Faster: write y = −2x + b and put in (1, 3), giving b = 5.' }], answer: 'y = -2x + 5' },
    },
    {
      kind: 'protip',
      head: 'Pick the form the question wants',
      body: 'Asked for a slope or intercept? Get y = mx + b. Asked about a total? Standard form. Given one point and a slope? Point-slope. Choosing the right form saves a whole step.',
      art: flow([{ label: 'Slope or intercept? → y = mx + b', color: SKY }, { label: 'A total? → Ax + By = C', color: AMB }, { label: 'A point and slope? → point-slope', color: EMR }], { title: 'Which form?', horizontal: false, caption: 'Let the question choose the form.' }),
      why: 'Each form is the same line, but only one shows the number you need in plain sight. Asked for the slope, y = mx + b shows it with no work. Converting costs algebra steps and chances to slip, so only convert when the question needs the other form.',
    },
    {
      kind: 'trap',
      head: 'The slope of Ax + By = C is not A/B',
      body: 'The sign and the order both matter. For 6x + 3y = 9, the slope is −6/3 = −2. A/B gives +2 and B/A gives 1/2 — both are waiting in the choices.',
      compare: {
        cols: [
          { title: 'Tempting', tex: '\\frac{A}{B} = 2', lines: ['Lost the minus sign'], tone: 'bad' },
          { title: 'Correct', tex: '-\\frac{A}{B} = -2', lines: ['Solve for y to be sure'], tone: 'ok' },
        ],
      },
      why: 'Solve 6x + 3y = 9 for y: subtracting 6x from both sides gives 3y = −6x + 9, so y = −2x + 3. The 6x changed sign when it crossed the equals sign, which is why the slope is −6/3. A/B misses that sign change, and B/A turns the fraction upside down.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a parallel line through (1, 5)',
      body: 'Find the line parallel to 4x − 2y = 6 that passes through (1, 5). Parallel lines have the same slope, so find the slope, then build the line through the point.',
      steps: { steps: [{ tex: 'm = -\\frac{4}{-2} = 2', text: 'Find the slope of the given line with −A/B, where A = 4 and B = −2. A negative divided by a negative is positive, so the slope is 2. Check by solving for y: y = 2x − 3.' }, { tex: 'y - 5 = 2(x - 1)', text: 'Parallel lines have equal slopes, so use m = 2 with the new point (1, 5) in point-slope form.' }, { tex: 'y - 5 = 2x - 2', text: 'Distribute the 2 over both terms in the parentheses, so 2 times x is 2x and 2 times −1 is −2.' }, { tex: 'y = 2x + 3', text: 'Add 5 to both sides. This line has the same slope as y = 2x − 3 but a different intercept, so it is parallel and never meets it. Check: 2(1) + 3 = 5.' }], answer: 'y = 2x + 3' },
    },
    {
      kind: 'summary',
      head: 'Lines in two variables, wrapped up',
      body: 'Slope-intercept shows m and b; standard form holds totals and has slope −A/B; point-slope builds a line from a point. Parallel lines share a slope, and perpendicular slopes multiply to −1.',
      table: { head: ['You know', 'Use'], rows: [['Slope and intercept', 'y = mx + b'], ['A total of two things', 'Ax + By = C'], ['A point and a slope', 'y − y₁ = m(x − x₁)']] },
    },
  ],

  // ---------------- SAT-4 — Systems of two linear equations ----------------
  'SAT-4': [
    {
      kind: 'objective',
      head: 'Where two lines cross',
      body: 'A system is two equations that must BOTH be true. On a graph, y = 2x + 1 and y = −3x + 16 cross at one point, (3, 7). That point is the solution. You will find it without drawing.',
      art: lineGraph([{ m: 2, b: 1, label: 'y = 2x + 1', color: SKY }, { m: -3, b: 16, label: 'y = −3x + 16', color: ROSE }], { range: { x: [0, 6], y: [0, 18] }, points: [{ x: 3, y: 7, label: '(3, 7)', color: VIO }], title: 'The solution is the crossing', caption: 'Only one point sits on both lines.' }),
    },
    {
      kind: 'concept',
      head: 'Substitution: swap one in',
      body: 'When one equation already says y = … or x = …, drop that expression into the other equation. Now there is only one letter left, and you solve as usual.',
      art: flow([{ label: 'Find y = … (or x = …)', color: SKY }, { label: 'Replace y in the other equation', color: AMB }, { label: 'Solve, then back-substitute', color: EMR }], { title: 'Substitution', horizontal: false, caption: 'Best when a letter is already alone.' }),
      why: 'Both equations are true at the same time, so wherever the first one says y equals 2x + 1, the y in the second equation is that very same number. Swapping a quantity for something equal to it is always allowed, like trading a coin for its value, and it leaves one unknown instead of two.',
    },
    {
      kind: 'concept',
      head: 'Elimination: cancel a letter',
      body: 'Line the equations up. If one letter has opposite coefficients, add the equations and it vanishes. If not, multiply one equation first to make them opposites.',
      formula: { tex: '\\begin{aligned} x + y &= 10 \\\\ x - y &= 4 \\\\ \\hline 2x &= 14 \\end{aligned}', note: 'Adding cancels +y against −y.', parts: [{ sym: '+y,\\ -y', means: 'opposite coefficients cancel when added', tone: 'accent' }, { sym: '2x = 14', means: 'one letter left, so x = 7', tone: 'ok' }] },
      why: 'If two equations are both true, adding the left sides and adding the right sides gives another true equation, because equals added to equals are equal. Pick a pair where one letter has opposite coefficients and it cancels. Multiplying a whole equation by a number keeps it true, which is how you manufacture the opposites.',
    },
    {
      kind: 'concept',
      head: 'Count solutions from the slopes',
      body: 'Put both equations in y = mx + b form. Different slopes cross exactly once. Same slope with different intercepts never meet. Identical lines meet everywhere.',
      compare: {
        cols: [
          { title: 'One solution', lines: ['Different slopes', 'The lines cross once'], tone: 'ok' },
          { title: 'No solution', lines: ['Same slope', 'Different intercepts'], tone: 'bad' },
          { title: 'Infinitely many', lines: ['Same slope', 'Same intercept'], tone: 'accent' },
        ],
      },
      why: 'Each equation is a line, and a solution is a point on both. Lines with different slopes tilt differently, so they must cross exactly once. Lines with the same slope are parallel: if they also share an intercept they are the same line and share every point, and otherwise they never touch.',
    },
    {
      kind: 'example',
      head: 'Substitute: y = 2x + 1 and 3x + y = 16',
      body: 'Solve the system. The first equation already says what y is, so put that expression in for y in the second equation, solve for x, then find y.',
      steps: { steps: [{ tex: '3x + (2x + 1) = 16', text: 'Substitute. The first equation says y equals 2x + 1, so replace y in the second equation with that. Parentheses keep the whole expression together.' }, { tex: '5x + 1 = 16', text: 'Combine like terms. 3x + 2x is 5x, leaving one equation with only one letter in it.' }, { tex: '5x = 15 \\Rightarrow x = 3', text: 'Subtract 1 from both sides, then divide by 5. Each move undoes one layer around x.' }, { tex: 'y = 2(3) + 1 = 7', text: 'Back-substitute x = 3 into the equation where y is already alone, which is the easiest place. Check in the other: 3(3) + 7 is 16. On test day, graphing both lines in Desmos finds the crossing faster.' }], answer: '(3,\\,7)' },
    },
    {
      kind: 'example',
      head: 'Eliminate: 2x + 3y = 12 and 4x − 3y = 6',
      body: 'Solve the system. The y-terms are +3y and −3y, which are opposites, so adding the equations makes y vanish.',
      steps: { steps: [{ tex: '(2x + 3y) + (4x - 3y) = 12 + 6', text: 'Add the left sides and add the right sides. Equals added to equals stay equal, and +3y and −3y cancel because they are opposites.' }, { tex: '6x = 18', text: 'Simplify. 2x + 4x is 6x, the y-terms are gone, and 12 + 6 is 18.' }, { tex: 'x = 3', text: 'Divide both sides by 6 to undo the multiplication, since 6 is the number multiplying x.' }, { tex: '2(3) + 3y = 12 \\Rightarrow y = 2', text: 'Back-substitute x = 3 into the first equation. Then 6 + 3y = 12, so 3y = 6 and y = 2. Check in the second: 4(3) − 3(2) is 6.' }], answer: '(3,\\,2)' },
    },
    {
      kind: 'example',
      head: 'Another way: graph it',
      body: 'Solve x + y = 10 and x − y = 4 by graphing. Rewrite both as y = mx + b so they are easy to draw, then read the crossing.',
      art: lineGraph([{ m: -1, b: 10, label: 'y = −x + 10', color: SKY }, { m: 1, b: -4, label: 'y = x − 4', color: EMR }], { range: { x: [0, 11], y: [-6, 13] }, points: [{ x: 7, y: 3, label: '(7, 3)', color: VIO }], title: 'The crossing is (7, 3)', caption: 'On test day, Desmos draws both lines and names the crossing for you.' }),
      steps: { steps: [{ tex: 'y = -x + 10', text: 'Subtract x from both sides of the first equation. The line has slope −1 and y-intercept 10.' }, { tex: 'y = x - 4', text: 'Rewrite the second equation: x − y = 4 becomes −y = −x + 4, and multiplying by −1 flips every sign to give y = x − 4. It has slope 1 and y-intercept −4.' }, { tex: '\\text{crossing at } (7, 3)', text: 'The lines cross where both equations are true, so the crossing point is the solution. Read it off the graph.' }, { tex: '7 + 3 = 10,\\quad 7 - 3 = 4', text: 'Check the point in both original equations. Both hold. On test day, Desmos draws both lines and names the crossing for you, or adding the equations gives 2x = 14 directly.' }], answer: '(7,\\,3)' },
    },
    {
      kind: 'example',
      head: 'No solution: y = 3x + 2 and 6x − 2y = 5',
      body: 'How many solutions does this system have? Put the second equation in y = mx + b form and compare slopes and intercepts.',
      art: lineGraph([{ m: 3, b: 2, label: 'y = 3x + 2', color: SKY }, { m: 3, b: -2.5, label: 'y = 3x − 2.5', color: ROSE }], { range: { x: [-2, 3], y: [-8, 10] }, title: 'Same slope, different starts', caption: 'Parallel lines: no point lies on both.' }),
      formula: { tex: 'm_1 = m_2,\\quad b_1 \\neq b_2', note: 'Equal slopes with unequal intercepts: no solution.', parts: [{ sym: 'm_1 = m_2', means: 'the lines rise at the same rate', tone: 'accent' }, { sym: 'b_1 \\neq b_2', means: 'they start at different heights, so never meet', tone: 'bad' }] },
      steps: { steps: [{ tex: '-2y = -6x + 5', text: 'Subtract 6x from both sides of the second equation to start isolating y.' }, { tex: 'y = 3x - \\tfrac{5}{2}', text: 'Divide every term by −2. Both signs flip, so −6x ÷ −2 is 3x and 5 ÷ −2 is −2.5.' }, { tex: 'm = 3 \\text{ for both},\\; b = 2 \\text{ and } -2.5', text: 'Compare. The slopes are equal, so the lines tilt the same way, but the intercepts differ, so they start at different heights.' }, { tex: '\\text{parallel} \\Rightarrow \\text{no solution}', text: 'Parallel lines never meet, so no point lies on both. Test-day shortcut: scale the first equation to match 6x − 2y, which gives 6x − 2y = −4. That cannot also equal 5.' }], answer: '\\text{No solution}' },
    },
    {
      kind: 'example',
      head: 'Picture it first: pens and notebooks',
      body: 'Pens cost $2, notebooks cost $5, and Ana buys 9 items for $30. How many of each? Draw a bar of 9 items and think about swapping pens for notebooks.',
      art: tape([{ label: 'pens', boxes: 5, each: '$2', color: SKY }, { label: 'notebooks', boxes: 4, each: '$5', color: AMB }], { title: '9 items, $30 in all', total: '5 × $2 + 4 × $5 = $30', caption: 'Five pens and four notebooks fill both totals.' }),
      steps: { steps: [{ tex: 'p + n = 9,\\quad 2p + 5n = 30', text: 'Write the two facts as equations: the number of items is 9 and the money spent is 30. Both must be true at once.' }, { tex: '9 \\cdot 2 = 18', text: 'Imagine all 9 items are pens, which costs 18 dollars. The real total is 12 dollars more than that.' }, { tex: '5 - 2 = 3', text: 'Swapping one pen for a notebook raises the total by 5 − 2 = 3 dollars, because the notebook costs 3 more than the pen it replaces.' }, { tex: '\\tfrac{12}{3} = 4 \\text{ notebooks},\\; 9 - 4 = 5 \\text{ pens}', text: 'Divide the 12 dollars of extra money by 3 dollars per swap to get 4 notebooks, leaving 5 pens.' }, { tex: '5(2) + 4(5) = 10 + 20 = 30', text: 'Check both facts. 5 + 4 is 9 items, and the cost is 30 dollars. Algebra alternative: write p = 9 − n, substitute to get 18 + 3n = 30, and solve.' }], answer: '5 \\text{ pens}, 4 \\text{ notebooks}' },
    },
    {
      kind: 'example',
      head: 'Skip to what is asked: find x',
      body: 'Given 3x + 2y = 17 and x + 2y = 9, find x. Both equations contain 2y, so subtracting one from the other removes y at once.',
      steps: { steps: [{ tex: '(3x + 2y) - (x + 2y) = 17 - 9', text: 'Subtract the whole second equation from the first, left side from left side and right side from right side. Equals taken from equals stay equal.' }, { tex: '2x = 8', text: 'Simplify. 3x − x is 2x, the 2y cancels because both equations had exactly 2y, and 17 − 9 is 8.' }, { tex: 'x = 4', text: 'Divide both sides by 2. The question only asked for x, so there is no need to find y.' }, { tex: '4 + 2y = 9 \\Rightarrow y = 2.5', text: 'Optional check. Put x = 4 into the second equation to get y = 2.5, then confirm in the first: 3(4) + 2(2.5) = 17.' }], answer: 'x = 4' },
    },
    {
      kind: 'protip',
      head: 'Asked for x + y? Just add',
      body: 'If 2x + y = 11 and x + 2y = 7, adding gives 3x + 3y = 18, so x + y = 6. The question asked for x + y, so you never needed x and y separately.',
      formula: { tex: '3x + 3y = 18 \\;\\Rightarrow\\; x + y = 6', note: 'Look at what the question asks before you solve.', parts: [{ sym: '3x + 3y', means: 'the sum of the two equations', tone: 'accent' }, { sym: 'x + y', means: 'divide by 3 to get exactly what was asked', tone: 'ok' }] },
      why: 'Adding the two equations gives 3x + 3y = 18, which is three copies of x + y, so dividing by 3 gives x + y = 6. You can verify with the real solution x = 5 and y = 1: both equations hold, and 5 + 1 is 6. Solving for x and y separately would have been extra work.',
    },
    {
      kind: 'trap',
      head: 'Subtract EVERY term',
      body: 'When you subtract one equation from another, the constant on the right gets subtracted too. So does every term hiding behind a minus sign. Dropping one flips a sign in your answer.',
      compare: {
        cols: [
          { title: 'Forgot a term', tex: '2x = 17', lines: ['Did not subtract the 9'], tone: 'bad' },
          { title: 'Every term', tex: '2x = 17 - 9 = 8', lines: ['Both sides, every piece'], tone: 'ok' },
        ],
      },
      why: 'Subtracting equations means subtracting the whole left side and the whole right side, so each term gets the minus sign, including terms that already have a minus (−(−y) becomes +y). If you skip the 9 on the right, you have changed the equation into a different, false one.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: make it have no solution',
      body: 'For what k do 2x + ky = 5 and 4x + 6y = 9 have no solution? Make the x-terms match by doubling the first equation, then compare the y-terms and the constants.',
      steps: { steps: [{ tex: '4x + 2ky = 10', text: 'Multiply EVERY term of the first equation by 2, including the 5. The result is the same equation in a different form, and its x-term now matches 4x.' }, { tex: '2k = 6', text: 'For no solution the left sides must be identical. If the y-coefficients match too, one expression would have to equal two different numbers.' }, { tex: 'k = 3', text: 'Divide both sides by 2 to find k, since 2 is the number multiplying k in 2k = 6.' }, { tex: '10 \\neq 9', text: 'Check the constants differ. They do, so the lines are parallel and the system has no solution. If they had matched, there would be infinitely many. Shortcut: 2/4 = k/6 forces k = 3, and 1/2 is not 5/9.' }], answer: 'k = 3' },
    },
    {
      kind: 'summary',
      head: 'Systems, wrapped up',
      body: 'The solution is where the lines cross. Substitute when a letter is already alone; eliminate when coefficients line up. Compare slopes to count solutions, and add or subtract equations when the question asks for a combination.',
      table: { head: ['Situation', 'Best move'], rows: [['y = … already given', 'Substitution'], ['Opposite coefficients', 'Elimination'], ['Asked for x + y', 'Add the equations'], ['How many solutions?', 'Compare slopes']] },
    },
  ],

  // ---------------- SAT-5 — Linear inequalities and systems ----------------
  'SAT-5': [
    {
      kind: 'objective',
      head: 'Not one answer, but a whole range',
      body: 'An inequality like x > 5 is true for a whole stretch of numbers. SAT questions turn phrases like "at most" and "at least" into inequalities. You will solve them, graph them, and test points.',
      art: numberLine(0, 10, [{ at: 5, label: '5', color: ROSE }], { span: { from: 5, to: 10, label: 'x > 5' }, title: 'Every number past 5', caption: 'An open circle at 5, because 5 itself does not count.' }),
    },
    {
      kind: 'concept',
      head: 'Solve it like an equation — with one rule',
      body: 'Add, subtract, multiply, and divide just as with an equation. The one extra rule: multiply or divide by a NEGATIVE and the inequality sign flips.',
      formula: { tex: '-2x \\le 8 \\;\\Rightarrow\\; x \\ge -4', note: 'Dividing by −2 flips ≤ to ≥.', parts: [{ sym: '\\div(-2)', means: 'dividing by a negative reverses the order', tone: 'bad' }, { sym: '\\ge', means: 'the flipped sign', tone: 'ok' }] },
      art: numberLine(-8, 2, [{ at: -4, label: '−4', color: ROSE }, { at: 0, label: '0' }], { span: { from: -4, to: 2, label: 'x ≥ −4' }, title: 'Flipped: −4 and everything above', caption: 'A closed circle, because −4 is included.' }),
      why: 'An inequality tells you which number is bigger. Adding or subtracting the same amount slides both numbers along the number line together, so their order stays the same. Multiplying by a negative mirrors the line: 2 < 5, but −2 > −5. That reversal is exactly why the sign must flip.',
    },
    {
      kind: 'concept',
      head: 'Translate the words',
      body: 'Constraint questions hide the inequality in everyday words. Learn the four phrases and the symbol almost writes itself.',
      table: { head: ['The words say', 'Symbol'], rows: [['at least, no less than', '≥'], ['at most, no more than', '≤'], ['more than', '>'], ['fewer than, less than', '<']], note: '"At most $50" means the cost is ≤ 50.' },
      why: 'Each phrase names a limit and says which side of it is allowed. At least 5 means 5 is the floor, so 5 itself is allowed along with anything bigger, which is ≥. At most 5 is a ceiling, so ≤. More than 5 leaves out 5 itself, so it is the strict symbol >.',
    },
    {
      kind: 'concept',
      head: 'On a graph, shade a side',
      body: 'The line y = x + 1 splits the plane in two. For y > x + 1, points ABOVE the line work; for y < x + 1, points below. A strict inequality draws the line dashed.',
      art: lineGraph([{ m: 1, b: 1, label: 'y = x + 1', color: SKY, dash: '6 5' }], { range: { x: [-3, 4], y: [-3, 6] }, points: [{ x: -2, y: 4, label: 'above', color: EMR }, { x: 3, y: -1, label: 'below', color: ROSE }], title: 'Above or below the boundary', caption: 'A test point tells you which side to shade.' }),
      why: 'The line y = x + 1 holds every point where y equals x + 1. Move straight up from it and y gets bigger for the same x, so those points satisfy y > x + 1. Test (0, 0): is 0 > 1? No, so (0, 0), which is below the line, is not in the solution. A strict inequality leaves out the line itself, which is why it is dashed.',
    },
    {
      kind: 'example',
      head: 'Solve 3x − 5 > 10',
      body: 'Find every x that makes 3x − 5 greater than 10. Solve it like an equation: undo the −5, then the multiplication by 3, watching whether the divisor is negative.',
      steps: { steps: [{ tex: '3x - 5 + 5 > 10 + 5', text: 'Add 5 to both sides. Adding the same number to both sides never changes the direction of an inequality.' }, { tex: '3x > 15', text: 'Simplify. −5 + 5 cancels on the left and 10 + 5 is 15 on the right.' }, { tex: 'x > 5', text: 'Divide both sides by 3. Dividing by a POSITIVE number keeps the order, so the sign stays the same.' }, { tex: 'x = 6:\\; 3(6) - 5 = 13 > 10', text: 'Check with a number from the answer. 13 is greater than 10, so it works. Then check the boundary: x = 5 gives 10 > 10, which is false, so 5 is excluded.' }], answer: 'x > 5' },
    },
    {
      kind: 'example',
      head: 'Flip it: −2x + 4 ≤ 12',
      body: 'Solve for x. The only new danger is the division by −2, which is a negative number, so the inequality sign will have to flip.',
      steps: { steps: [{ tex: '-2x + 4 - 4 \\le 12 - 4', text: 'Subtract 4 from both sides. Adding or subtracting never changes the direction of the sign.' }, { tex: '-2x \\le 8', text: 'Simplify both sides. Now only the multiplication by −2 is left to undo.' }, { tex: 'x \\ge -4', text: 'Divide both sides by −2 and FLIP the sign. Dividing by a negative reverses the order of numbers, so ≤ becomes ≥. Also 8 ÷ (−2) is −4.' }, { tex: 'x = 0:\\; 4 \\le 12 \\text{ true};\\; x = -6:\\; 16 \\le 12 \\text{ false}', text: 'Check on both sides of −4. 0 is above −4 and works, while −6 is below and fails, so the flipped sign is right.' }], answer: 'x \\ge -4' },
    },
    {
      kind: 'example',
      head: 'Another way: test a number',
      body: 'If you are not sure which way the sign goes, you can skip the flip rule. Find the boundary as if it were an equation, then test one number on each side.',
      table: { head: ['Test x', '−2x + 4', '≤ 12?'], rows: [['−6', '16', 'no'], ['0', '4', 'yes'], ['2', '0', 'yes']], mark: 1, note: 'The numbers above −4 work, so x ≥ −4.' },
      steps: { steps: [{ tex: '-2x + 4 = 12 \\Rightarrow x = -4', text: 'Solve as an equation to find the boundary. The inequality can only change from true to false at the point where both sides are equal.' }, { tex: 'x = 0:\\; -2(0) + 4 = 4 \\le 12', text: 'Test an easy number on one side of the boundary. 4 ≤ 12 is true, so this side is in the answer.' }, { tex: 'x = -6:\\; -2(-6) + 4 = 16 \\le 12', text: 'Test a number on the other side. 16 ≤ 12 is false, so that side is out.' }, { tex: 'x \\ge -4', text: 'Keep the side that held the true test, which includes 0 and everything above −4. The boundary is included because ≤ allows equality. On test day this is often safer than remembering when to flip.' }], answer: 'x \\ge -4' },
    },
    {
      kind: 'example',
      head: 'Picture it first: loading a van',
      body: 'A van carries at most 1,200 lb. The driver weighs 180 lb and each box weighs 60 lb. How many boxes fit? Write the inequality, then solve it.',
      art: numberLine(0, 20, [{ at: 17, label: '17', color: ROSE }], { step: 5, span: { from: 0, to: 17, label: 'b ≤ 17' }, title: 'Boxes that fit', caption: 'Seventeen boxes is the most the van can take.' }),
      steps: { steps: [{ tex: '180 + 60b \\le 1200', text: 'At most means the total can be 1,200 or less, so use ≤. The total is the driver\'s weight plus 60 pounds for each of b boxes.' }, { tex: '60b \\le 1020', text: 'Subtract 180 from both sides to isolate the box weight. 1200 − 180 is 1020.' }, { tex: 'b \\le 17', text: 'Divide both sides by 60. It is positive, so the sign does not flip. 1020 ÷ 60 is 17.' }, { tex: '180 + 60(17) = 1200', text: 'Check the largest case. 17 boxes weigh 1,020 lb and with the driver the total is exactly 1,200, which is allowed. 18 boxes would be 1,260 lb, which is too heavy.' }], answer: 'b \\le 17' },
    },
    {
      kind: 'example',
      head: 'Is (2, 3) a solution?',
      body: 'Is the point (2, 3) a solution of the system y > x and y < 2x − 2? Plug x = 2 and y = 3 into each inequality and see whether each is true.',
      table: { head: ['Inequality', 'Plug in (2, 3)', 'True?'], rows: [['y > x', '3 > 2', 'yes'], ['y < 2x − 2', '3 < 2', 'no']], mark: 1, note: 'A point must pass every test.' },
      steps: { steps: [{ tex: 'y > x:\\; 3 > 2', text: 'Put x = 2 and y = 3 into the first inequality. 3 is greater than 2, so this one is true.' }, { tex: 'y < 2x - 2:\\; 3 < 2(2) - 2 = 2', text: 'Do the same for the second. First work out the right side, 2(2) − 2 = 2. Then 3 < 2 is false.' }, { tex: '\\text{one test fails} \\Rightarrow \\text{not a solution}', text: 'A solution of a system has to make EVERY inequality true at once, so a single false test rules the point out. On test day, once one test fails, stop checking that choice.' }], answer: '\\text{No, (2, 3) is not a solution}' },
    },
    {
      kind: 'example',
      head: 'A budget: $100, keep $10',
      body: 'Tickets cost $15 each, you have $100, and you must keep $10 for the bus. How many tickets can you buy? Write an inequality for the spending, then solve it.',
      formula: { tex: '15t + 10 \\le 100', note: 'Spending plus what you keep can be at most what you have.', parts: [{ sym: '15t', means: 'the cost of t tickets at $15 each', tone: 'accent' }, { sym: '\\le 100', means: '"at most" the $100 you have', tone: 'ok' }] },
      steps: { steps: [{ tex: '15t + 10 \\le 100', text: 'Spending plus the money you keep can be at most what you have. 15t is the cost of t tickets, so the sentence becomes this inequality.' }, { tex: '15t \\le 90', text: 'Subtract 10 from both sides. This takes away the bus money and leaves only the ticket cost.' }, { tex: 't \\le 6', text: 'Divide both sides by 15. It is positive, so the sign stays. 90 ÷ 15 is 6.' }, { tex: '15(6) + 10 = 100', text: 'Check the limit. 6 tickets cost 90 and adding the 10 for the bus makes exactly 100, which is allowed. 7 tickets would need 115, which is too much.' }], answer: 't \\le 6' },
    },
    {
      kind: 'protip',
      head: 'Test points against every inequality',
      body: 'For "which point satisfies the system," plug each choice into EVERY inequality. The first one that fails is out. Start with (0, 0) when it is a choice — it is the fastest to check.',
      art: flow([{ label: 'Plug the point into inequality 1', color: SKY }, { label: 'Then inequality 2', color: AMB }, { label: 'Keep it only if all are true', color: EMR }], { title: 'Testing a point', horizontal: false, caption: 'One failure is enough to reject it.' }),
      why: 'The solution of a system is the region where every shaded area overlaps, so a point is in it only if it makes all of the inequalities true at once. One false statement proves the point is outside the overlap. The point (0, 0) puts a zero in every term, which makes the arithmetic almost free.',
    },
    {
      kind: 'trap',
      head: 'Dividing by a negative flips the sign',
      body: 'This is the most common inequality mistake on the test. The wrong answer, with the sign unflipped, is always one of the choices.',
      compare: {
        cols: [
          { title: 'Forgot to flip', tex: '-3x > 12 \\Rightarrow x > -4', lines: ['Kept the old direction'], tone: 'bad' },
          { title: 'Flipped', tex: '-3x > 12 \\Rightarrow x < -4', lines: ['Test x = −5: 15 > 12 ✓'], tone: 'ok' },
        ],
      },
      why: 'Take x = −5 in −3x > 12: −3(−5) is 15, which is greater than 12, so −5 is a solution. But −5 is not greater than −4, so the unflipped answer x > −4 would wrongly exclude it. Dividing by a negative mirrors the number line, so bigger numbers become smaller and the sign must reverse.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a phone plan limit',
      body: 'A plan costs $20 a month plus $0.10 per text, and you want to spend no more than $35. Write the inequality, then find the most texts you can send.',
      steps: { steps: [{ tex: '20 + 0.10t \\le 35', text: 'No more than means at most, so use ≤. The cost is the $20 base plus $0.10 for each of t texts.' }, { tex: '0.10t \\le 15', text: 'Subtract 20 from both sides to take away the base fee. This leaves only the cost of the texts.' }, { tex: 't \\le \\tfrac{15}{0.10} = 150', text: 'Divide both sides by 0.10. It is positive, so the sign does not flip. 15 ÷ 0.10 is 150.' }, { tex: '20 + 0.10(150) = 20 + 15 = 35', text: 'Check the limit. 150 texts cost 15 dollars and the base is 20, for exactly 35. A faster mental way: 15 dollars is left after the base, and at 10 cents each that buys 150 texts.' }], answer: 't \\le 150' },
    },
    {
      kind: 'summary',
      head: 'Inequalities, wrapped up',
      body: 'Solve like an equation, but flip the sign when you multiply or divide by a negative. Translate "at least" and "at most" carefully. On a graph, shade above or below, and test points against every inequality.',
      formula: { tex: 'a < b \\;\\Rightarrow\\; -a > -b', note: 'Multiplying by −1 reverses the order.', parts: [{ sym: '<', means: 'the original direction', tone: 'accent' }, { sym: '>', means: 'reversed after multiplying by a negative', tone: 'ok' }] },
    },
  ],

  // ---------------- SAT-6 — Equivalent expressions and exponents ----------------
  'SAT-6': [
    {
      kind: 'objective',
      head: 'Same value, different outfit',
      body: 'Many SAT questions ask which expression is EQUIVALENT to another. x³ · x⁴ and x⁷ are the same thing written two ways. You will learn the exponent rules and factoring moves that rewrite expressions.',
      art: tape([{ label: 'x³', boxes: 3, each: 'x', color: SKY }, { label: 'x⁴', boxes: 4, each: 'x', color: AMB }], { title: 'Count the factors of x', total: 'x³ · x⁴ = x⁷', caption: 'Three x factors next to four makes seven in a row.' }),
    },
    {
      kind: 'concept',
      head: 'Three rules for the same base',
      body: 'When the bases match, exponents follow simple arithmetic. Multiplying adds them. Dividing subtracts them. Raising a power to a power multiplies them.',
      compare: {
        cols: [
          { title: 'Multiply', tex: 'x^a \\cdot x^b = x^{a+b}', lines: ['Add the exponents'], tone: 'accent' },
          { title: 'Divide', tex: '\\frac{x^a}{x^b} = x^{a-b}', lines: ['Subtract the exponents'], tone: 'ok' },
          { title: 'Power of a power', tex: '(x^a)^b = x^{ab}', lines: ['Multiply the exponents'], tone: 'warn' },
        ],
      },
      why: 'x³ means x·x·x and x⁴ means x·x·x·x, so written side by side there are 3 + 4 = 7 factors of x: that is why you add. Dividing cancels matching factors one at a time, so x⁵ ÷ x² leaves x·x·x = x³. And (x²)³ is three copies of x², which is 2·3 = 6 factors.',
    },
    {
      kind: 'concept',
      head: 'Zero and negative exponents',
      body: 'Each step down in the exponent divides by the base again. So 2⁰ = 1, and 2⁻¹ is one half. A negative exponent means "take the reciprocal."',
      art: bars([{ name: '2ⁿ', vals: [8, 4, 2, 1, 0.5], color: SKY }], { labels: ['2³', '2²', '2¹', '2⁰', '2⁻¹'], title: 'Halving every step down', caption: 'The pattern does not stop at 1 — it keeps halving.' }),
      formula: { tex: 'x^{-n} = \\frac{1}{x^n}, \\quad x^0 = 1', note: 'Negative means reciprocal; zero gives one.', parts: [{ sym: 'x^{-n}', means: 'move it under a fraction bar', tone: 'accent' }, { sym: 'x^0', means: 'any nonzero base to the zero is 1', tone: 'ok' }] },
      why: 'Look at the pattern 8, 4, 2, 1, then 1/2: each step down in the exponent divides by 2 again, and that pattern forces 2⁰ = 1 and 2⁻¹ = 1/2. Another check: x² ÷ x² is 1 because anything divided by itself is 1, while the subtract rule says x²⁻² = x⁰, so x⁰ must equal 1.',
    },
    {
      kind: 'concept',
      head: 'Fractional exponents are roots',
      body: 'The bottom of a fractional exponent is a root and the top is a power. So x to the 1/2 is the square root of x, and 8 to the 2/3 is the cube root of 8, squared: 4.',
      formula: { tex: 'x^{\\frac{m}{n}} = \\sqrt[n]{x^m}', note: 'Denominator is the root, numerator is the power.', parts: [{ sym: 'n', means: 'the root: 2 is square root, 3 is cube root', tone: 'accent' }, { sym: 'm', means: 'the power the result is raised to', tone: 'ok' }] },
      why: 'The exponent rules have to keep working. If x^(1/2) times itself follows the add rule, it gives x^(1/2 + 1/2) = x¹, so x^(1/2) is a number whose square is x, which is the square root. In the same way x^(1/3) cubed is x, so it is a cube root, and the top number m just raises the root to a power.',
    },
    {
      kind: 'example',
      head: 'Multiply: (2x³)(5x⁴)',
      body: 'Multiply (2x³)(5x⁴). Multiplication can be done in any order, so group the numbers together and the powers of x together.',
      steps: { steps: [{ tex: '(2 \\cdot 5)(x^3 \\cdot x^4)', text: 'Regroup the factors. Multiplication is commutative and associative, so you may reorder it freely: numbers with numbers, and x-powers with x-powers.' }, { tex: '2 \\cdot 5 = 10', text: 'Multiply the coefficients as ordinary numbers. Coefficients never get added or have exponent rules applied.' }, { tex: 'x^3 \\cdot x^4 = x^{3+4} = x^7', text: 'The bases match, so add the exponents. x³ is 3 factors of x and x⁴ is 4 more, which makes 7 factors in a row.' }, { tex: '(2 \\cdot 8)(5 \\cdot 16) = 1280 = 10 \\cdot 128', text: 'Check with x = 2. The original gives 16 times 80, which is 1280, and 10x⁷ gives 10 times 128, also 1280. On test day this plug-in check is a quick safety net.' }], answer: '10x^7' },
    },
    {
      kind: 'example',
      head: 'Two rules at once: (x⁴)³ ÷ x⁵',
      body: 'Simplify (x⁴)³ ÷ x⁵. Two rules are in play, so decide the order: handle the power of a power first, then divide.',
      steps: { steps: [{ tex: '(x^4)^3 = x^{4 \\cdot 3} = x^{12}', text: 'Power of a power: multiply the exponents. Three copies of x⁴ is 3 groups of 4 factors, which is 12 factors of x.' }, { tex: '\\frac{x^{12}}{x^5} = x^{12-5}', text: 'Divide with the same base: subtract the exponents. Five of the twelve factors on top cancel the five on the bottom.' }, { tex: 'x^{7}', text: 'Finish the subtraction, 12 − 5 = 7, so seven factors of x remain.' }, { tex: '\\frac{16^3}{32} = \\frac{4096}{32} = 128 = 2^7', text: 'Check with x = 2. 2⁴ is 16, 16³ is 4096, and 4096 ÷ 32 is 128, which equals 2⁷. The answer holds.' }], answer: 'x^7' },
    },
    {
      kind: 'example',
      head: 'Factor out the GCF: 6x² + 9x',
      body: 'Factor 6x² + 9x. Find the biggest thing that divides both terms, pull it out front, and see what is left in each term.',
      art: areaModel([{ label: '2x', w: 2 }, { label: '+3', w: 1.4 }], [{ label: '3x', h: 1 }], [['6x²', '9x']], { title: '3x(2x + 3) = 6x² + 9x', total: 'Area = 6x² + 9x', caption: 'Factoring reads the side lengths off the area.' }),
      steps: { steps: [{ tex: '\\text{GCF} = 3x', text: 'Find the greatest common factor. 6 and 9 both divide by 3, and x² and x both contain an x, so the biggest shared piece is 3x.' }, { tex: '6x^2 \\div 3x = 2x', text: 'Divide the first term by 3x to see what is left. 6 ÷ 3 is 2 and x² ÷ x is x.' }, { tex: '9x \\div 3x = 3', text: 'Divide the second term by 3x. 9 ÷ 3 is 3, and the x cancels completely.' }, { tex: '6x^2 + 9x = 3x(2x + 3)', text: 'Write the common factor outside and the leftovers inside. Check by distributing: 3x times 2x is 6x² and 3x times 3 is 9x. A test-day check at x = 2: 42 on both sides.' }], answer: '3x(2x + 3)' },
    },
    {
      kind: 'example',
      head: 'Difference of squares: x² − 49',
      body: 'Factor x² − 49. Both terms are perfect squares and there is a minus between them, which is a special pattern you can recognize.',
      art: areaModel([{ label: 'x', w: 2 }, { label: '+7', w: 1.3 }], [{ label: 'x', h: 1.4 }, { label: '−7', h: 1 }], [['x²', '7x'], ['−7x', '−49']], { title: '(x − 7)(x + 7)', total: '7x and −7x cancel', caption: 'Only x² and −49 survive.' }),
      steps: { steps: [{ tex: 'x^2 - 49 = x^2 - 7^2', text: 'Spot the pattern. x² is a perfect square and 49 is 7², with a minus between them.' }, { tex: 'a^2 - b^2 = (a - b)(a + b)', text: 'Use the difference-of-squares rule with a = x and b = 7. It works for any two squares being subtracted.' }, { tex: '(x - 7)(x + 7) = x^2 + 7x - 7x - 49', text: 'Check by multiplying out. The two middle terms, +7x and −7x, are opposites and cancel, which is why the rule only works with a minus.' }, { tex: '= x^2 - 49', text: 'Only the first and last terms survive, which matches the original. A quick test at x = 2: x² − 49 is −45 and (−5)(9) is also −45.' }], answer: '(x - 7)(x + 7)' },
    },
    {
      kind: 'example',
      head: 'Another way: test with x = 2',
      body: 'Which of these is equivalent to (x + 3)²? Instead of expanding, plug in a number and compare values. Equivalent expressions match for every x.',
      table: { head: ['Expression', 'At x = 2'], rows: [['(x + 3)²', '25'], ['x² + 6x + 9', '25'], ['x² + 9', '13']], mark: 2, note: 'Different values: that choice is out.' },
      steps: { steps: [{ tex: 'x = 2', text: 'Pick a small number that is not 0 or 1. Those two numbers make many different expressions agree by accident.' }, { tex: '(x + 3)^2 = 5^2 = 25', text: 'Evaluate the original first: 2 + 3 is 5 and 5 squared is 25. This is the target value.' }, { tex: 'x^2 + 6x + 9 = 4 + 12 + 9 = 25', text: 'Evaluate the first choice. It matches 25, so it might be equivalent.' }, { tex: 'x^2 + 9 = 4 + 9 = 13', text: 'Evaluate the second choice. 13 is not 25, so it is NOT equivalent. One mismatch proves two expressions differ, while a match only suggests they are equal.' }], answer: 'x^2 + 6x + 9' },
    },
    {
      kind: 'example',
      head: 'A negative exponent: 2⁻³',
      body: 'Evaluate 2⁻³. A negative exponent is not a negative number. It tells you to take the reciprocal of the positive power.',
      formula: { tex: '2^{-3} = \\frac{1}{2^3} = \\frac{1}{8}', note: 'The negative sign moves the power, it does not make the number negative.', parts: [{ sym: '2^{-3}', means: 'a reciprocal waiting to happen', tone: 'accent' }, { sym: '\\tfrac{1}{8}', means: 'positive, and less than 1', tone: 'ok' }] },
      steps: { steps: [{ tex: '2^{-3} = \\frac{1}{2^3}', text: 'Use the negative exponent rule: x⁻ⁿ equals 1 over xⁿ. It comes from the halving pattern 8, 4, 2, 1, 1/2, which keeps going.' }, { tex: '2^3 = 2 \\cdot 2 \\cdot 2 = 8', text: 'Work out the positive power on the bottom, which is three twos multiplied together.' }, { tex: '\\frac{1}{8}', text: 'Put 8 under the 1. The result is a small positive fraction, because the negative sign only moves the power, it does not make the number negative.' }], answer: '\\tfrac{1}{8}' },
    },
    {
      kind: 'protip',
      head: 'Plug in a number to check',
      body: 'Choose a small number that is not 0 or 1 — those hide differences. Evaluate the original and each choice. The one that matches is equivalent. It takes seconds and avoids algebra slips.',
      art: flow([{ label: 'Pick x = 2 or 3', color: SKY }, { label: 'Evaluate the original', color: AMB }, { label: 'Keep the choice that matches', color: EMR }], { title: 'The plug-in check', caption: 'Avoid 0 and 1 — too many expressions agree there.' }),
      why: 'Two expressions are equivalent only if they match for every x, so any single number should give the same value in both, and a mismatch exposes a wrong choice immediately. 0 and 1 are weak tests because 0 to any power is 0 and 1 to any power is 1, so many different powers agree there.',
    },
    {
      kind: 'trap',
      head: 'Squaring a sum makes a middle term',
      body: '(x + 3)² means (x + 3)(x + 3). The area model shows four pieces: x², two 3x pieces, and 9. Writing x² + 9 throws away the 6x in the middle.',
      art: areaModel([{ label: 'x', w: 2 }, { label: '+3', w: 1.1 }], [{ label: 'x', h: 1.4 }, { label: '+3', h: 0.9 }], [['x²', '3x'], ['3x', '9']], { title: '(x + 3)² = x² + 6x + 9', total: 'Not x² + 9', caption: 'The two 3x rectangles are the part people forget.' }),
      why: '(x + 3)² means (x + 3)(x + 3), and multiplying out takes each term of the first bracket times each term of the second: x·x, x·3, 3·x and 3·3. That is x² + 3x + 3x + 9, with two 3x pieces. Test x = 2: (2 + 3)² is 25, but x² + 9 gives only 13.',
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 8 to the 2/3',
      body: 'Evaluate 8^(2/3) without a calculator. The bottom of the exponent is a root and the top is a power. Choose the order that keeps the numbers small.',
      steps: { steps: [{ tex: '8^{2/3} = \\left(8^{1/3}\\right)^2', text: 'Split the exponent. 2/3 is 1/3 times 2, and the power of a power rule says to multiply exponents, so you can take the cube root first and then square.' }, { tex: '\\sqrt[3]{8} = 2', text: 'Find the cube root. 2 times 2 times 2 is 8. Taking the root first keeps the numbers small.' }, { tex: '2^2 = 4', text: 'Square the result of the cube root. Squaring means multiplying 2 by itself, and 2 times 2 is 4.' }, { tex: '\\sqrt[3]{8^2} = \\sqrt[3]{64} = 4', text: 'Check the other order. 8 squared is 64 and the cube root of 64 is 4, the same answer, just with bigger numbers along the way.' }], answer: '8^{2/3} = 4' },
    },
    {
      kind: 'summary',
      head: 'Equivalent expressions, wrapped up',
      body: 'Same base: add exponents to multiply, subtract to divide, multiply for a power of a power. Negative exponents are reciprocals and fractional ones are roots. Factor out the GCF first, and plug in a number to check.',
      table: { head: ['Rule', 'Example'], rows: [['Multiply → add', 'x³ · x⁴ = x⁷'], ['Divide → subtract', 'x⁶ ÷ x² = x⁴'], ['Power → multiply', '(x²)³ = x⁶'], ['Negative → reciprocal', 'x⁻² = 1/x²']] },
    },
  ],
};
