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
    },
    {
      kind: 'concept',
      head: 'Backsolving: let the choices do the work',
      body: 'When the answer choices are plain numbers, you can test them instead of solving. Choices are listed in order, so start in the MIDDLE: one test tells you whether to go up or down.',
      table: { head: ['Choice', 'Plug into 3x + 7', 'Equals 22?'], rows: [['3', '16', 'too small'], ['5', '22', 'yes'], ['7', '28', 'too big']], mark: 1, note: 'One middle test, then you know which way to move.' },
    },
    {
      kind: 'example',
      head: 'Two steps: 3x + 7 = 22',
      body: 'The +7 is the outer layer, so it comes off first.\nThen divide by 3.\nCheck by plugging back in.',
      steps: { steps: [{ tex: '3x + 7 - 7 = 22 - 7', text: 'Subtract 7 from both sides.' }, { tex: '3x = 15', text: 'Now only the coefficient is left.' }, { tex: 'x = 5', text: 'Divide both sides by 3.' }], answer: 'x = 5' },
    },
    {
      kind: 'example',
      head: 'Distribute first: 4(x − 2) = 2x + 10',
      body: 'Parentheses are the outermost layer, so open them.\nThen move the x-terms to one side and the numbers to the other.\nThe answer is x = 9.',
      steps: { steps: [{ tex: '4x - 8 = 2x + 10', text: 'Distribute the 4 to both terms.' }, { tex: '2x - 8 = 10', text: 'Subtract 2x from both sides.' }, { tex: '2x = 18', text: 'Add 8 to both sides.' }], answer: 'x = 9' },
    },
    {
      kind: 'example',
      head: 'Clear the fractions: x/3 + 2 = x/2',
      body: 'Fractions slow you down, so kill them first. Multiply EVERY term by 6, the smallest number both 3 and 2 go into. Then it is an ordinary equation, and x = 12.',
      formula: { tex: '6\\cdot\\frac{x}{3} + 6\\cdot 2 = 6\\cdot\\frac{x}{2} \\;\\Rightarrow\\; 2x + 12 = 3x', note: 'Multiply every single term — the lonely 2 as well.', parts: [{ sym: '6', means: 'the least common denominator of 3 and 2', tone: 'accent' }, { sym: '2x + 12 = 3x', means: 'no fractions left, so x = 12', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: backsolve 4(x − 2) = 2x + 10',
      body: 'Say the choices are 5, 7, 9, and 11. Test the middle ones in both sides and see which side wins. At 9 both sides equal 28, so 9 is the answer — no algebra required.',
      table: { head: ['x', 'Left: 4(x − 2)', 'Right: 2x + 10'], rows: [['7', '20', '24'], ['9', '28', '28'], ['11', '36', '32']], mark: 1, note: 'At 7 the right side is bigger; at 11 the left is. The match is between them.' },
    },
    {
      kind: 'example',
      head: 'No solution: 2(3x + 1) = 6x + 5',
      body: 'Distribute and the left side is 6x + 2. Picture each side as a line: y = 6x + 2 and y = 6x + 5. Same steepness, different starting heights, so they never meet — no solution.',
      art: lineGraph([{ m: 6, b: 2, label: 'y = 6x + 2', color: SKY }, { m: 6, b: 5, label: 'y = 6x + 5', color: ROSE }], { range: { x: [-2, 2], y: [-8, 12] }, title: 'Parallel lines never cross', caption: 'Same slope, different intercepts: the two sides can never be equal.' }),
    },
    {
      kind: 'example',
      head: 'A negative answer: −3x + 4 = 19',
      body: 'Subtract 4 from both sides: −3x = 15.\nDivide by −3. Different signs give a negative.\nSo x = −5.',
      art: numberLine(-8, 2, [{ at: -5, label: 'x = −5', color: ROSE }, { at: 0, label: '0' }], { title: 'The solution lands left of zero', caption: 'Check it: −3 times −5 is 15, and 15 + 4 = 19.' }),
    },
    {
      kind: 'protip',
      head: 'Infinitely many? Match both parts',
      body: 'A question like "for what k does 5x + k = 5x + 8 have infinitely many solutions" is a matching game. The x-parts already match. Make the constants match too: k = 8.',
      formula: { tex: 'ax + b = ax + b', note: 'Same coefficient AND same constant: true for every x.', parts: [{ sym: 'ax', means: 'the x-parts must match', tone: 'accent' }, { sym: 'b', means: 'the constants must match too', tone: 'ok' }] },
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
    },
    {
      kind: 'challenge',
      head: 'Extra credit: k(x + 2) = 4x + 10',
      body: 'For what value of k does this equation have NO solution? No solution needs the same coefficient and different constants. Distribute and compare.',
      steps: { steps: [{ tex: 'kx + 2k = 4x + 10', text: 'Distribute k on the left.' }, { tex: 'k = 4', text: 'Match the coefficients so x cancels.' }, { tex: '2k = 8 \\neq 10', text: 'The constants differ, so no solution.' }], answer: 'k = 4' },
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
    },
    {
      kind: 'concept',
      head: 'A constant rate makes a steady table',
      body: 'In a linear function every step of 1 in x adds the same amount to y. Read down a table: if the jumps are all equal, it is linear, and the jump IS the slope.',
      table: { head: ['Hours', 'Cost ($)', 'Jump'], rows: [['0', '40', '—'], ['1', '105', '+65'], ['2', '170', '+65'], ['3', '235', '+65']], note: 'Equal jumps of 65: linear, with slope 65.' },
    },
    {
      kind: 'example',
      head: 'Slope from two points: (2, 5) and (6, 17)',
      body: 'Subtract the y-values, then the x-values, in the same order.\nDivide rise by run.\nThe slope is 3.',
      steps: { steps: [{ tex: '17 - 5 = 12', text: 'The rise, second point minus first.' }, { tex: '6 - 2 = 4', text: 'The run, in the same order.' }, { tex: '12 \\div 4 = 3', text: 'Rise over run.' }], answer: 'm = 3' },
    },
    {
      kind: 'example',
      head: 'Read the model: C(h) = 65h + 40',
      body: 'A plumber uses this to price a job of h hours. The 65 is charged again for every hour, and the 40 is charged once. So it is $65 per hour plus a $40 call-out fee.',
      formula: { tex: 'C(h) = 65h + 40', note: 'Rate times hours, plus a one-time fee.', parts: [{ sym: '65', means: 'dollars charged for each hour of work', tone: 'accent' }, { sym: '40', means: 'a flat fee, paid even for zero hours', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Build it: f(0) = 3 and f(4) = 11',
      body: 'f(0) is the starting value, so b = 3.\nThe slope is the change in f over the change in x.\nPut them together as f(x) = mx + b.',
      steps: { steps: [{ tex: 'b = f(0) = 3', text: 'The value at zero is the intercept.' }, { tex: 'm = \\frac{11 - 3}{4 - 0} = 2', text: 'Rise of 8 over a run of 4.' }], answer: 'f(x) = 2x + 3' },
    },
    {
      kind: 'example',
      head: 'Another way: fill in a table',
      body: 'Instead of a formula, walk from f(0) = 3 to f(4) = 11 in equal steps. Four steps cover a rise of 8, so each step is +2. The table gives the same line, f(x) = 2x + 3.',
      table: { head: ['x', 'f(x)', 'Jump'], rows: [['0', '3', '—'], ['1', '5', '+2'], ['2', '7', '+2'], ['3', '9', '+2'], ['4', '11', '+2']], mark: 4, note: 'Equal jumps of 2 each time: the slope is 2.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: a draining tank',
      body: 'A tank holds 500 liters and drains 20 liters a minute. Sketch it: the line starts at 500 and falls 20 each minute. It hits empty where V = 0, which is 500 ÷ 20 = 25 minutes.',
      art: lineGraph([{ m: -20, b: 500, label: 'V = 500 − 20t', color: SKY }], { range: { x: [0, 30], y: [0, 650] }, points: [{ x: 25, y: 0, label: 'empty', color: ROSE }], title: 'Falling 20 liters a minute', caption: 'A negative slope is a draining rate. Empty is where the line meets the axis.' }),
    },
    {
      kind: 'example',
      head: 'A negative slope: (−1, 4) and (3, −8)',
      body: 'The rise is −8 − 4 = −12, so the line falls.\nThe run is 3 − (−1) = 4.\nThe slope is −12 ÷ 4 = −3.',
      art: plotGrid([{ x: -1, y: 4, label: '(−1, 4)', color: SKY }, { x: 3, y: -8, label: '(3, −8)', color: ROSE }], { join: true, range: { x: [-3, 5], y: [-10, 6] }, title: 'Down 12, across 4', caption: 'Falling left to right means a negative slope.' }),
    },
    {
      kind: 'protip',
      head: 'Units tell you what a number means',
      body: 'Slope always carries "y-units per x-unit." If y is dollars and x is hours, the slope is dollars per hour. Say the units out loud and the interpretation question answers itself.',
      art: flow([{ label: 'Find what multiplies x', color: SKY }, { label: 'Name its units: y per x', color: AMB }, { label: 'Say it as a sentence', color: EMR }], { title: 'Interpreting a number', caption: 'Three questions turn a coefficient into a sentence.' }),
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
    },
    {
      kind: 'challenge',
      head: 'Extra credit: when do two plans cost the same?',
      body: 'Plan A costs 20 + 5x dollars and Plan B costs 35 + 2x for x months. Set them equal to find where the lines cross. After that month, Plan B is cheaper.',
      art: lineGraph([{ m: 5, b: 20, label: 'A = 20 + 5x', color: SKY }, { m: 2, b: 35, label: 'B = 35 + 2x', color: ROSE }], { range: { x: [0, 10], y: [0, 75] }, points: [{ x: 5, y: 45, label: '(5, 45)', color: VIO }], xLabel: 'months', title: 'The plans cross at month 5', caption: 'Before the crossing A is cheaper; after it, B is.' }),
      steps: { steps: [{ tex: '20 + 5x = 35 + 2x', text: 'Set the two costs equal.' }, { tex: '3x = 15', text: 'Subtract 2x and 20 from both sides.' }], answer: 'x = 5' },
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
    },
    {
      kind: 'concept',
      head: 'Intercepts: cover one letter',
      body: 'To find where 4x + 5y = 20 hits an axis, cover a variable. With x = 0, 5y = 20, so the y-intercept is (0, 4). With y = 0, 4x = 20, so the x-intercept is (5, 0).',
      formula: { tex: 'Ax + By = C \\;\\Rightarrow\\; \\left(\\tfrac{C}{A},\\,0\\right),\\ \\left(0,\\,\\tfrac{C}{B}\\right)', note: 'Divide C by the coefficient you did NOT cover.', parts: [{ sym: 'C/A', means: 'where the line crosses the x-axis', tone: 'accent' }, { sym: 'C/B', means: 'where the line crosses the y-axis', tone: 'ok' }] },
      art: plotGrid([{ x: 0, y: 4, label: '(0, 4)', color: SKY }, { x: 5, y: 0, label: '(5, 0)', color: ROSE }], { join: true, range: { x: [-1, 7], y: [-1, 6] }, title: 'Two intercepts draw the line', caption: 'Two points are all a line needs.' }),
    },
    {
      kind: 'concept',
      head: 'Parallel and perpendicular',
      body: 'Parallel lines have the SAME slope, like y = 2x + 1 and y = 2x − 3. Perpendicular slopes multiply to −1: flip the fraction and change the sign.',
      art: lineGraph([{ m: 2, b: 1, label: 'y = 2x + 1', color: SKY }, { m: 2, b: -3, label: 'y = 2x − 3', color: EMR }], { range: { x: [-3, 4], y: [-8, 8] }, title: 'Same slope, never meet', caption: 'Parallel lines rise at exactly the same rate.' }),
      formula: { tex: 'm_1 \\cdot m_2 = -1', note: 'Perpendicular slopes are negative reciprocals, like 2/3 and −3/2.', parts: [{ sym: 'm_1', means: 'the slope of the first line', tone: 'accent' }, { sym: '-1', means: 'the product of perpendicular slopes', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'The slope of 3x + 2y = 12',
      body: 'Get y alone and the slope appears.\nSubtract 3x, then divide everything by 2.\nThe slope is −3/2.',
      steps: { steps: [{ tex: '2y = -3x + 12', text: 'Move the x-term to the right side.' }, { tex: 'y = -1.5x + 6', text: 'Divide every term by 2.' }], answer: 'm = -\\tfrac{3}{2}' },
    },
    {
      kind: 'example',
      head: 'Build a line: through (2, 7), slope 4',
      body: 'Point-slope form takes the point and slope directly.\nDistribute, then add 7 to both sides.\nThe line is y = 4x − 1.',
      steps: { steps: [{ tex: 'y - 7 = 4(x - 2)', text: 'Drop the point and slope into point-slope form.' }, { tex: 'y - 7 = 4x - 8', text: 'Distribute the 4.' }], answer: 'y = 4x - 1' },
    },
    {
      kind: 'example',
      head: 'Another way: slope straight from standard form',
      body: 'For Ax + By = C, the slope is always −A/B. For 3x + 2y = 12, that is −3/2 in one step, without rearranging. Use it when all you need is the slope.',
      formula: { tex: 'Ax + By = C \\;\\Rightarrow\\; m = -\\frac{A}{B}', note: 'Minus the x-coefficient over the y-coefficient.', parts: [{ sym: 'A', means: 'the number in front of x goes on top', tone: 'accent' }, { sym: 'B', means: 'the number in front of y goes underneath', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: ticket sales',
      body: 'Adult tickets are $12, child tickets $8, and sales were $480. That is 12a + 8c = 480. Sketch it: all adults means 40 tickets, all children means 60. Every mix lies on the line between.',
      art: plotGrid([{ x: 40, y: 0, label: '(40, 0)', color: SKY }, { x: 0, y: 60, label: '(0, 60)', color: ROSE }], { join: true, range: { x: [0, 50], y: [0, 75] }, xLabel: 'adults', title: 'Every mix that makes $480', caption: 'Standard form is how a total of two kinds of things is written.' }),
    },
    {
      kind: 'example',
      head: 'Perpendicular through (0, −4)',
      body: 'The line must be perpendicular to y = (2/3)x + 1. Flip 2/3 and change the sign: the new slope is −3/2. It crosses the y-axis at −4.',
      formula: { tex: 'y = -\\tfrac{3}{2}x - 4', note: 'Negative reciprocal slope, and the given intercept.', parts: [{ sym: '-\\tfrac{3}{2}', means: 'flip 2/3 and change the sign', tone: 'accent' }, { sym: '-4', means: 'the y-intercept from the point (0, −4)', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Two points: (1, 3) and (3, −1)',
      body: 'Slope first: −1 − 3 over 3 − 1 is −4 over 2, which is −2. Then use either point in point-slope form. The line is y = −2x + 5.',
      table: { head: ['x', 'y = −2x + 5'], rows: [['1', '3'], ['2', '1'], ['3', '−1']], note: 'Both given points check out.' },
    },
    {
      kind: 'protip',
      head: 'Pick the form the question wants',
      body: 'Asked for a slope or intercept? Get y = mx + b. Asked about a total? Standard form. Given one point and a slope? Point-slope. Choosing the right form saves a whole step.',
      art: flow([{ label: 'Slope or intercept? → y = mx + b', color: SKY }, { label: 'A total? → Ax + By = C', color: AMB }, { label: 'A point and slope? → point-slope', color: EMR }], { title: 'Which form?', horizontal: false, caption: 'Let the question choose the form.' }),
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
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a parallel line through (2, 1)',
      body: 'Find the line parallel to 4x − 2y = 6 that passes through (2, 1). Parallel means the same slope. Find the slope, then build the line through the point.',
      steps: { steps: [{ tex: 'm = -\\frac{4}{-2} = 2', text: 'The slope of the given line, from −A/B.' }, { tex: 'y - 1 = 2(x - 2)', text: 'Same slope through the new point.' }, { tex: 'y = 2x - 3', text: 'Distribute and add 1.' }], answer: 'y = 2x - 3' },
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
    },
    {
      kind: 'concept',
      head: 'Elimination: cancel a letter',
      body: 'Line the equations up. If one letter has opposite coefficients, add the equations and it vanishes. If not, multiply one equation first to make them opposites.',
      formula: { tex: '\\begin{aligned} x + y &= 10 \\\\ x - y &= 4 \\\\ \\hline 2x &= 14 \\end{aligned}', note: 'Adding cancels +y against −y.', parts: [{ sym: '+y,\\ -y', means: 'opposite coefficients cancel when added', tone: 'accent' }, { sym: '2x = 14', means: 'one letter left, so x = 7', tone: 'ok' }] },
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
    },
    {
      kind: 'example',
      head: 'Substitute: y = 2x + 1 and 3x + y = 16',
      body: 'The first equation hands you y.\nReplace y in the second, then solve for x.\nUse x to find y.',
      steps: { steps: [{ tex: '3x + (2x + 1) = 16', text: 'Put 2x + 1 in place of y.' }, { tex: '5x = 15', text: 'Combine like terms and subtract 1.' }, { tex: 'y = 2(3) + 1 = 7', text: 'x = 3, then back into y = 2x + 1.' }], answer: '(3,\\,7)' },
    },
    {
      kind: 'example',
      head: 'Eliminate: 2x + 3y = 12 and 4x − 3y = 6',
      body: 'The y-terms are already opposites, +3y and −3y.\nAdd the equations and y is gone.\nThen put x back in to get y.',
      steps: { steps: [{ tex: '6x = 18', text: 'Add the two equations.' }, { tex: 'x = 3', text: 'Divide by 6.' }, { tex: '2(3) + 3y = 12', text: 'Back into the first equation: y = 2.' }], answer: '(3,\\,2)' },
    },
    {
      kind: 'example',
      head: 'Another way: graph it',
      body: 'Solve x + y = 10 and x − y = 4 by graphing. Rewrite them as y = −x + 10 and y = x − 4. Where they cross, at (7, 3), is the answer — the same as elimination gave.',
      art: lineGraph([{ m: -1, b: 10, label: 'y = −x + 10', color: SKY }, { m: 1, b: -4, label: 'y = x − 4', color: EMR }], { range: { x: [0, 11], y: [-6, 13] }, points: [{ x: 7, y: 3, label: '(7, 3)', color: VIO }], title: 'The crossing is (7, 3)', caption: 'On test day, Desmos draws both lines and names the crossing for you.' }),
    },
    {
      kind: 'example',
      head: 'No solution: y = 3x + 2 and 6x − 2y = 5',
      body: 'Rewrite the second: y = 3x − 2.5. Both lines have slope 3, but they start at different heights. Parallel lines never meet, so the system has no solution.',
      art: lineGraph([{ m: 3, b: 2, label: 'y = 3x + 2', color: SKY }, { m: 3, b: -2.5, label: 'y = 3x − 2.5', color: ROSE }], { range: { x: [-2, 3], y: [-8, 10] }, title: 'Same slope, different starts', caption: 'Parallel lines: no point lies on both.' }),
      formula: { tex: 'm_1 = m_2,\\quad b_1 \\neq b_2', note: 'Equal slopes with unequal intercepts: no solution.', parts: [{ sym: 'm_1 = m_2', means: 'the lines rise at the same rate', tone: 'accent' }, { sym: 'b_1 \\neq b_2', means: 'they start at different heights, so never meet', tone: 'bad' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: pens and notebooks',
      body: 'Pens cost $2 and notebooks $5. Ana buys 9 items for $30. Draw a bar of 9 items; if all were pens she would pay $18. Each notebook swap adds $3, and $12 more needs 4 swaps.',
      art: tape([{ label: 'pens', boxes: 5, each: '$2', color: SKY }, { label: 'notebooks', boxes: 4, each: '$5', color: AMB }], { title: '9 items, $30 in all', total: '5 × $2 + 4 × $5 = $30', caption: 'Five pens and four notebooks fill both totals.' }),
    },
    {
      kind: 'example',
      head: 'Skip to what is asked: find x',
      body: 'Given 3x + 2y = 17 and x + 2y = 9. Both have 2y, so subtract the second from the first. The 2y cancels, 2x = 8, and x = 4.',
      steps: { steps: [{ tex: '(3x + 2y) - (x + 2y) = 17 - 9', text: 'Subtract the whole second equation.' }, { tex: '2x = 8', text: 'The 2y terms cancel.' }], answer: 'x = 4' },
    },
    {
      kind: 'protip',
      head: 'Asked for x + y? Just add',
      body: 'If 2x + y = 11 and x + 2y = 7, adding gives 3x + 3y = 18, so x + y = 6. The question asked for x + y, so you never needed x and y separately.',
      formula: { tex: '3x + 3y = 18 \\;\\Rightarrow\\; x + y = 6', note: 'Look at what the question asks before you solve.', parts: [{ sym: '3x + 3y', means: 'the sum of the two equations', tone: 'accent' }, { sym: 'x + y', means: 'divide by 3 to get exactly what was asked', tone: 'ok' }] },
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
    },
    {
      kind: 'challenge',
      head: 'Extra credit: make it have no solution',
      body: 'For what k does 2x + ky = 5 and 4x + 6y = 9 have no solution? Double the first equation to line up the x-terms. Then the y-terms must match while the constants do not.',
      steps: { steps: [{ tex: '4x + 2ky = 10', text: 'Double the first equation.' }, { tex: '2k = 6', text: 'Match the y-coefficients.' }, { tex: '10 \\neq 9', text: 'Constants differ, so the lines are parallel.' }], answer: 'k = 3' },
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
    },
    {
      kind: 'concept',
      head: 'Translate the words',
      body: 'Constraint questions hide the inequality in everyday words. Learn the four phrases and the symbol almost writes itself.',
      table: { head: ['The words say', 'Symbol'], rows: [['at least, no less than', '≥'], ['at most, no more than', '≤'], ['more than', '>'], ['fewer than, less than', '<']], note: '"At most $50" means the cost is ≤ 50.' },
    },
    {
      kind: 'concept',
      head: 'On a graph, shade a side',
      body: 'The line y = x + 1 splits the plane in two. For y > x + 1, points ABOVE the line work; for y < x + 1, points below. A strict inequality draws the line dashed.',
      art: lineGraph([{ m: 1, b: 1, label: 'y = x + 1', color: SKY, dash: '6 5' }], { range: { x: [-3, 4], y: [-3, 6] }, points: [{ x: -2, y: 4, label: 'above', color: EMR }, { x: 3, y: -1, label: 'below', color: ROSE }], title: 'Above or below the boundary', caption: 'A test point tells you which side to shade.' }),
    },
    {
      kind: 'example',
      head: 'Solve 3x − 5 > 10',
      body: 'Add 5 to both sides.\nDivide by 3 — a positive number, so no flip.\nThe answer is x > 5.',
      steps: { steps: [{ tex: '3x > 15', text: 'Add 5 to both sides.' }, { tex: 'x > 5', text: 'Divide by positive 3; the sign stays.' }], answer: 'x > 5' },
    },
    {
      kind: 'example',
      head: 'Flip it: −2x + 4 ≤ 12',
      body: 'Subtract 4 to get −2x ≤ 8.\nDivide by −2, a negative, so the sign flips.\nThe answer is x ≥ −4.',
      steps: { steps: [{ tex: '-2x \\le 8', text: 'Subtract 4 from both sides.' }, { tex: 'x \\ge -4', text: 'Divide by −2 and FLIP the sign.' }], answer: 'x \\ge -4' },
    },
    {
      kind: 'example',
      head: 'Another way: test a number',
      body: 'Not sure which way the sign goes? Solve as an equation to find the boundary, x = −4. Then test x = 0 in −2x + 4 ≤ 12: 4 ≤ 12 is true, so the side holding 0 is the answer.',
      table: { head: ['Test x', '−2x + 4', '≤ 12?'], rows: [['−6', '16', 'no'], ['0', '4', 'yes'], ['2', '0', 'yes']], mark: 1, note: 'The numbers above −4 work, so x ≥ −4.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: loading a van',
      body: 'A van carries at most 1,200 lb. The driver is 180 lb and each box is 60 lb. So 180 + 60b ≤ 1200, which gives 60b ≤ 1020 and b ≤ 17. At most 17 boxes.',
      art: numberLine(0, 20, [{ at: 17, label: '17', color: ROSE }], { step: 5, span: { from: 0, to: 17, label: 'b ≤ 17' }, title: 'Boxes that fit', caption: 'Seventeen boxes is the most the van can take.' }),
    },
    {
      kind: 'example',
      head: 'Is (2, 3) a solution?',
      body: 'Check y > x and y < 2x − 2. The first holds: 3 > 2. The second asks whether 3 < 2, which is false. Failing one inequality rules the point out.',
      table: { head: ['Inequality', 'Plug in (2, 3)', 'True?'], rows: [['y > x', '3 > 2', 'yes'], ['y < 2x − 2', '3 < 2', 'no']], mark: 1, note: 'A point must pass every test.' },
    },
    {
      kind: 'example',
      head: 'A budget: $100, keep $10',
      body: 'Tickets are $15 each and you must keep $10 for the bus. Write 15t + 10 ≤ 100. Then 15t ≤ 90, so t ≤ 6. You can buy at most 6 tickets.',
      formula: { tex: '15t + 10 \\le 100', note: 'Spending plus what you keep can be at most what you have.', parts: [{ sym: '15t', means: 'the cost of t tickets at $15 each', tone: 'accent' }, { sym: '\\le 100', means: '"at most" the $100 you have', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Test points against every inequality',
      body: 'For "which point satisfies the system," plug each choice into EVERY inequality. The first one that fails is out. Start with (0, 0) when it is a choice — it is the fastest to check.',
      art: flow([{ label: 'Plug the point into inequality 1', color: SKY }, { label: 'Then inequality 2', color: AMB }, { label: 'Keep it only if all are true', color: EMR }], { title: 'Testing a point', horizontal: false, caption: 'One failure is enough to reject it.' }),
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
    },
    {
      kind: 'challenge',
      head: 'Extra credit: a phone plan limit',
      body: 'A plan costs $20 a month plus $0.10 per text. You want to spend no more than $35. Write the inequality and find the most texts you can send.',
      steps: { steps: [{ tex: '20 + 0.10t \\le 35', text: '"No more than" means at most.' }, { tex: '0.10t \\le 15', text: 'Subtract the $20 base.' }], answer: 't \\le 150' },
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
    },
    {
      kind: 'concept',
      head: 'Zero and negative exponents',
      body: 'Each step down in the exponent divides by the base again. So 2⁰ = 1, and 2⁻¹ is one half. A negative exponent means "take the reciprocal."',
      art: bars([{ name: '2ⁿ', vals: [8, 4, 2, 1, 0.5], color: SKY }], { labels: ['2³', '2²', '2¹', '2⁰', '2⁻¹'], title: 'Halving every step down', caption: 'The pattern does not stop at 1 — it keeps halving.' }),
      formula: { tex: 'x^{-n} = \\frac{1}{x^n}, \\quad x^0 = 1', note: 'Negative means reciprocal; zero gives one.', parts: [{ sym: 'x^{-n}', means: 'move it under a fraction bar', tone: 'accent' }, { sym: 'x^0', means: 'any nonzero base to the zero is 1', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Fractional exponents are roots',
      body: 'The bottom of a fractional exponent is a root and the top is a power. So x to the 1/2 is the square root of x, and 8 to the 2/3 is the cube root of 8, squared: 4.',
      formula: { tex: 'x^{\\frac{m}{n}} = \\sqrt[n]{x^m}', note: 'Denominator is the root, numerator is the power.', parts: [{ sym: 'n', means: 'the root: 2 is square root, 3 is cube root', tone: 'accent' }, { sym: 'm', means: 'the power the result is raised to', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Multiply: (2x³)(5x⁴)',
      body: 'Numbers multiply with numbers.\nPowers of x add their exponents.\nThe result is 10x⁷.',
      steps: { steps: [{ tex: '2 \\cdot 5 = 10', text: 'Multiply the coefficients.' }, { tex: 'x^3 \\cdot x^4 = x^{7}', text: 'Same base: add the exponents.' }], answer: '10x^7' },
    },
    {
      kind: 'example',
      head: 'Two rules at once: (x⁴)³ ÷ x⁵',
      body: 'Do the power of a power first: 4 times 3 is 12.\nThen divide by subtracting: 12 − 5.\nThe result is x⁷.',
      steps: { steps: [{ tex: '(x^4)^3 = x^{12}', text: 'Power of a power: multiply.' }, { tex: 'x^{12} \\div x^5 = x^{7}', text: 'Dividing: subtract.' }], answer: 'x^7' },
    },
    {
      kind: 'example',
      head: 'Factor out the GCF: 6x² + 9x',
      body: 'Both terms share a 3 and an x. Pull out 3x and see what is left in each piece: 2x and 3. Draw it as a rectangle with side 3x.',
      art: areaModel([{ label: '2x', w: 2 }, { label: '+3', w: 1.4 }], [{ label: '3x', h: 1 }], [['6x²', '9x']], { title: '3x(2x + 3) = 6x² + 9x', total: 'Area = 6x² + 9x', caption: 'Factoring reads the side lengths off the area.' }),
    },
    {
      kind: 'example',
      head: 'Difference of squares: x² − 49',
      body: 'Anything like a² − b² splits into (a − b)(a + b). Here a is x and b is 7. The middle terms, −7x and +7x, cancel — that is why nothing is left in the middle.',
      art: areaModel([{ label: 'x', w: 2 }, { label: '+7', w: 1.3 }], [{ label: 'x', h: 1.4 }, { label: '−7', h: 1 }], [['x²', '7x'], ['−7x', '−49']], { title: '(x − 7)(x + 7)', total: '7x and −7x cancel', caption: 'Only x² and −49 survive.' }),
    },
    {
      kind: 'example',
      head: 'Another way: test with x = 2',
      body: 'Not sure two expressions are equivalent? Plug in a number like x = 2. Equivalent expressions give the same value every time. (x + 3)² gives 25, x² + 9 gives 13 — not equivalent.',
      table: { head: ['Expression', 'At x = 2'], rows: [['(x + 3)²', '25'], ['x² + 6x + 9', '25'], ['x² + 9', '13']], mark: 2, note: 'Different values: that choice is out.' },
    },
    {
      kind: 'example',
      head: 'A negative exponent: 2⁻³',
      body: 'A negative exponent means reciprocal. Flip it under a fraction bar: 1 over 2³. Since 2³ = 8, the value is 1/8 — small and positive, not negative.',
      formula: { tex: '2^{-3} = \\frac{1}{2^3} = \\frac{1}{8}', note: 'The negative sign moves the power, it does not make the number negative.', parts: [{ sym: '2^{-3}', means: 'a reciprocal waiting to happen', tone: 'accent' }, { sym: '\\tfrac{1}{8}', means: 'positive, and less than 1', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Plug in a number to check',
      body: 'Choose a small number that is not 0 or 1 — those hide differences. Evaluate the original and each choice. The one that matches is equivalent. It takes seconds and avoids algebra slips.',
      art: flow([{ label: 'Pick x = 2 or 3', color: SKY }, { label: 'Evaluate the original', color: AMB }, { label: 'Keep the choice that matches', color: EMR }], { title: 'The plug-in check', caption: 'Avoid 0 and 1 — too many expressions agree there.' }),
    },
    {
      kind: 'trap',
      head: 'Squaring a sum makes a middle term',
      body: '(x + 3)² means (x + 3)(x + 3). The area model shows four pieces: x², two 3x pieces, and 9. Writing x² + 9 throws away the 6x in the middle.',
      art: areaModel([{ label: 'x', w: 2 }, { label: '+3', w: 1.1 }], [{ label: 'x', h: 1.4 }, { label: '+3', h: 0.9 }], [['x²', '3x'], ['3x', '9']], { title: '(x + 3)² = x² + 6x + 9', total: 'Not x² + 9', caption: 'The two 3x rectangles are the part people forget.' }),
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 8 to the 2/3',
      body: 'Evaluate 8^(2/3) without a calculator. The denominator 3 means cube root; the numerator 2 means square. Take the root first, while the number is small.',
      steps: { steps: [{ tex: '\\sqrt[3]{8} = 2', text: 'Cube root first: 2 × 2 × 2 = 8.' }, { tex: '2^2 = 4', text: 'Then square it.' }], answer: '8^{2/3} = 4' },
    },
    {
      kind: 'summary',
      head: 'Equivalent expressions, wrapped up',
      body: 'Same base: add exponents to multiply, subtract to divide, multiply for a power of a power. Negative exponents are reciprocals and fractional ones are roots. Factor out the GCF first, and plug in a number to check.',
      table: { head: ['Rule', 'Example'], rows: [['Multiply → add', 'x³ · x⁴ = x⁷'], ['Divide → subtract', 'x⁶ ÷ x² = x⁴'], ['Power → multiply', '(x²)³ = x⁶'], ['Negative → reciprocal', 'x⁻² = 1/x²']] },
    },
  ],
};
