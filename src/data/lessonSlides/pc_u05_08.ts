import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, VIO, W, art, axes, bars, dot, flow, funcGraph, line, numberLine, rightTriangle, text } from '../slideArt';

// PC Units 5-8 — Exponential functions, Logarithms, Solving exponential & log
// equations, Right-triangle trigonometry. 17 slides per deck, ~3 short
// sentences each, written for an 11–14-year-old: objective → concepts →
// simplest-to-fuller examples (two "Another way" alternates) → pro tip → trap
// → challenge → summary. Plain text with unicode — no KaTeX here.
export const PC_SLIDES_U05_08: SlideBank = {
  'PC-5': [
    {
      kind: 'objective',
      head: 'Meet the repeat-multiply machine',
      body: 'Today you will build exponential functions of the form y = a · b^x. You will read the START and the GROWTH FACTOR straight off the rule, turn percents into factors, and count doublings. By the end, "exponential" will just mean "keep multiplying".',
      formula: {
        tex: 'y = a \\cdot b^{x}',
        note: 'Three letters, three jobs — learn these and the whole unit opens up.',
        parts: [
          { sym: 'a', means: 'the START — what you have before any steps', tone: 'accent' },
          { sym: 'b', means: 'the GROWTH FACTOR — what you multiply by each step', tone: 'ok' },
          { sym: 'x', means: 'how many steps you have taken', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Lines add, exponentials multiply',
      body: 'A line grows by ADDING the same amount every step: 5, 10, 15, 20. An exponential grows by MULTIPLYING by the same number every step: 5, 10, 20, 40. That one difference is why exponentials start slow and then explode.',
      compare: {
        cols: [
          { title: 'Line: +5 each step', tex: 'y = 5x', lines: ['5, 10, 15, 20, 25', 'Same size step every time', 'A straight climb'], tone: 'accent' },
          { title: 'Exponential: ×2 each step', tex: 'y = 5 \\cdot 2^{x}', lines: ['5, 10, 20, 40, 80', 'Each step is bigger', 'A curve that takes off'], tone: 'ok' },
        ],
        note: 'Both start at 5. By step 5 the line is at 25 and the exponential is at 160.',
      },
      art: bars(
        [
          { name: 'adds 5', vals: [5, 10, 15, 20, 25, 30], color: SKY },
          { name: 'doubles', vals: [5, 10, 20, 40, 80, 160], color: AMB },
        ],
        { labels: ['0', '1', '2', '3', '4', '5'], title: 'same start, wildly different finish', caption: 'Adding keeps the steps equal; multiplying makes every step bigger than the last.' },
      ),
      why: 'Adding the same amount means every step is the same size, so a line climbs at a constant slope. Multiplying means every step is a percent of what you already have, so a bigger amount makes a bigger step. Check: from 40, the line adds 5 to reach 45, but doubling adds 40 to reach 80. Growth that feeds on itself is what makes the curve take off.',
    },
    {
      kind: 'concept',
      head: 'a is the start, b is the factor',
      body: 'Every exponential is y = a · b^x, and each letter has one job. The number a is the START — what you have before any steps, at x = 0. The base b is the GROWTH FACTOR: what you multiply by at each step.',
      formula: {
        tex: 'y = 200 \\cdot 1.5^{x}',
        note: 'Read it left to right: begin at 200, multiply by 1.5 for every step x.',
        parts: [
          { sym: '200', means: 'the start — out front, all by itself', tone: 'accent' },
          { sym: '1.5', means: 'the factor — the number being raised to a power', tone: 'ok' },
        ],
      },
      table: {
        head: ['x', 'what you do', 'y'],
        rows: [
          ['0', 'nothing yet', '200'],
          ['1', '200 × 1.5', '300'],
          ['2', '300 × 1.5', '450'],
          ['3', '450 × 1.5', '675'],
        ],
        mark: 0,
        note: 'At x = 0 the power b⁰ is 1, so y is just a. That is why a is the start.',
      },
      why: 'Put x = 0 into the rule and you get y = a · b⁰ = a · 1 = a, so a really is where you begin. Each time x goes up by 1, one more copy of b gets multiplied in, which is why the table runs 200, then 200 · 1.5, then 200 · 1.5 · 1.5. The exponent only counts how many copies of b have been multiplied in.',
    },
    {
      kind: 'concept',
      head: 'Bigger than 1 grows, less than 1 decays',
      body: 'If b is bigger than 1, the amount GROWS — a factor of 2 doubles, 1.08 adds eight percent. If b sits between 0 and 1, the amount DECAYS — a factor of 0.8 keeps only eighty percent. The factor alone tells you which way the graph goes.',
      compare: {
        cols: [
          { title: 'b > 1 · grows', tex: 'b = 2', lines: ['Each step is bigger', 'Climbs off the page', 'e.g. 1.08, 1.5, 3'], tone: 'ok' },
          { title: '0 < b < 1 · decays', tex: 'b = 0.8', lines: ['Each step is smaller', 'Sinks toward zero', 'e.g. 0.95, 0.75, 0.5'], tone: 'bad' },
        ],
      },
      art: (() => {
        const ax = axes({ x: [0, 5], y: [0, 9] }, { ticks: { x: [0, 1, 2, 3, 4, 5], y: [0, 2, 4, 6, 8] }, grid: true, pad: 34 });
        return art(
          'Two exponential curves on one set of axes: one climbing steeply, one sinking toward the x-axis',
          ax.body +
            ax.curve((x) => 8 * Math.pow(0.6, x), ROSE, 3) +
            ax.curve((x) => 1 * Math.pow(1.6, x), EMR, 3) +
            text(ax.X(3.3), ax.Y(7.9), 'b > 1 grows', { size: 13, fill: EMR }) +
            text(ax.X(2.7), ax.Y(0.9), 'b < 1 decays', { size: 13, fill: ROSE }) +
            text(W / 2, 22, 'the factor decides the shape', { size: 12, op: 0.7 }),
          'Green multiplies by 1.6 and takes off; rose multiplies by 0.6 and fades.',
        );
      })(),
      why: 'Multiplying by a number bigger than 1 makes a quantity larger, and multiplying by a number between 0 and 1 makes it smaller: 100 × 2 = 200 but 100 × 0.8 = 80. Because the very same multiplication repeats at every step, the direction never flips. The amount keeps growing or keeps shrinking, forever.',
    },
    {
      kind: 'concept',
      head: 'Percents become factors',
      body: 'You always keep the 100% you already had, then adjust. Up 8% means 100% + 8% = 108%, so the factor is 1.08. Down 20% means 100% − 20% = 80%, so the factor is 0.80.',
      formula: {
        tex: '\\text{factor} = 1 \\pm \\frac{\\text{percent}}{100}',
        note: 'Plus for growth, minus for decay — the 1 is the 100% you already have.',
      },
      table: {
        head: ['change', 'the sum', 'factor b'],
        rows: [
          ['up 8%', '100% + 8% = 108%', '1.08'],
          ['up 50%', '100% + 50% = 150%', '1.50'],
          ['down 20%', '100% − 20% = 80%', '0.80'],
          ['down 5%', '100% − 5% = 95%', '0.95'],
        ],
        note: 'Never multiply by 0.08 for "up 8%" — that would throw away 92% of what you had.',
      },
      why: 'Up 8% means you still own your whole amount, which is 1 times it, plus an extra 0.08 times it. Together that is 1.08 times the amount, so one multiplication does both jobs at once. Check: 1.08 × 500 = 500 + 40 = 540, which is $500 plus 8% of $500.',
    },
    {
      kind: 'example',
      head: 'Start simple: y = 4 · 2^x at x = 3',
      body: 'The rule is y = 4 · 2^x. What is y when x = 3?',
      steps: {
        steps: [
          { tex: 'y = 4 \\cdot 2^{3}', text: 'Replace x with 3 everywhere x appears in the rule. The 3 is the number of steps, so this asks for the value after three doublings.' },
          { tex: '2^{3} = 2 \\cdot 2 \\cdot 2 = 8', text: 'Work out the power before anything else. An exponent says to multiply the base by itself that many times, and powers come before multiplication in the order of operations.' },
          { tex: '4 \\cdot 8 = 32', text: 'Now multiply by the start. The 4 sits out front and is not raised to the power, so it simply scales the 8 you just found.' },
        ],
        answer: 'y = 32',
      },
    },
    {
      kind: 'example',
      head: 'Read the parts: y = 200 · 1.5^x',
      body: 'In y = 200 · 1.5^x, which number is the start and which is the growth factor?',
      formula: {
        tex: 'y = 200 \\cdot 1.5^{x}',
        parts: [
          { sym: '200', means: 'out front, so it is the start a', tone: 'accent' },
          { sym: '1.5', means: 'under the exponent, so it is the factor b', tone: 'ok' },
          { sym: 'b > 1', means: 'bigger than 1, so this one grows', tone: 'warn' },
        ],
      },
      steps: {
        steps: [
          { tex: 'y = a \\cdot b^{x}', text: 'Compare the rule to the general shape a · b^x. Matching the two shapes lets you read each number\'s job instead of guessing.' },
          { tex: 'a = 200', text: 'The number out front, not touched by the exponent, is a. It is the start, the value at x = 0, because b to the zero power is 1.' },
          { tex: 'b = 1.5', text: 'The number being raised to the power x is b, the growth factor. Every step multiplies the amount by 1.5, which keeps the old amount and adds half of it.' },
          { tex: 'b > 1', text: 'Compare b with 1 to see the direction. Since 1.5 is bigger than 1, each step makes the amount larger, so this function grows instead of decaying.' },
        ],
        answer: 'a = 200 \\text{ (start)},\\ b = 1.5 \\text{ (factor)}',
      },
    },
    {
      kind: 'example',
      head: 'Bacteria doubling every hour',
      body: 'A dish holds 50 bacteria and the count doubles every hour. How many are there after 4 hours?',
      table: {
        head: ['hour', 'bacteria'],
        rows: [['0', '50'], ['1', '100'], ['2', '200'], ['3', '400'], ['4', '800']],
        mark: 4,
        note: 'Doubling four times is the same as multiplying by 2⁴ = 16 once.',
      },
      steps: {
        steps: [
          { tex: 'y = 50 \\cdot 2^{4}', text: 'Fill in y = a · b^x. The start a is 50, the factor b is 2 because doubling means times 2, and x is 4 hours.' },
          { tex: '2^{4} = 2 \\cdot 2 \\cdot 2 \\cdot 2 = 16', text: 'Do the power first. Four doublings in a row multiply by 2 four times, so the count ends up 16 times bigger than it began.' },
          { tex: '50 \\cdot 16 = 800', text: 'Multiply the start by that 16. The table shows the same result one hour at a time: 50, 100, 200, 400, 800.' },
        ],
        answer: '800 \\text{ bacteria}',
      },
    },
    {
      kind: 'example',
      head: 'A bigger one: a savings account',
      body: 'A savings account grows 8% a year. What factor do you multiply by each year, and what does $500 become after one year?',
      steps: {
        steps: [
          { tex: '100\\% + 8\\% = 108\\%', text: 'Keep the whole 100% you already have and add the 8% interest. Growth means the old amount stays and the extra is added on top.' },
          { tex: '108\\% = \\tfrac{108}{100} = 1.08', text: 'Change the percent to a decimal by dividing by 100, which slides the decimal point two places left. A percent is just a number out of 100.' },
          { tex: '500 \\cdot 1.08 = 540', text: 'Test the factor on $500. Multiplying by 1.08 gives back the $500 plus 8% of it, which is $40, so the balance is $540.' },
        ],
        answer: 'b = 1.08',
      },
    },
    {
      kind: 'example',
      head: 'A phone losing value',
      body: 'A $600 phone loses 25% of its value every year. What is it worth after 2 years?',
      steps: {
        steps: [
          { tex: '100\\% - 25\\% = 75\\%', text: 'Ask what stays, not what goes. Losing 25% of the value means 75% is kept, and the kept part is what carries into the next year.' },
          { tex: 'b = 0.75', text: 'Turn 75% into a decimal by dividing by 100. This is the decay factor, and it is less than 1, which tells you the value shrinks each year.' },
          { tex: '600 \\cdot 0.75 = 450', text: 'Apply the factor once for year 1. Multiplying by 0.75 keeps three quarters of $600, which is $450.' },
          { tex: '450 \\cdot 0.75 = 337.50', text: 'Apply the factor again for year 2, using the new value $450 as the starting amount. Three quarters of 450 is 337.50.' },
        ],
        answer: '\\$337.50',
      },
    },
    {
      kind: 'example',
      head: 'Another way: build a table',
      body: 'Followers start at 200 and grow 10% a week. How many are there after 2 weeks? Build a table instead of using the formula.',
      table: {
        head: ['week', 'added', 'followers'],
        rows: [['0', '—', '200'], ['1', '+20', '220'], ['2', '+22', '242'], ['3', '+24.2', '266.2']],
        mark: 2,
        note: 'The ADDED column grows too. A line would add the same number every week.',
      },
      steps: {
        steps: [
          { tex: '\\text{week } 0:\\ 200', text: 'Write the starting row first. Week 0 is before any growth has happened, so the count is just the 200 you began with.' },
          { tex: '10\\% \\text{ of } 200 = 20,\\quad 200 + 20 = 220', text: 'Find 10% of 200 by dividing by 10, which gives 20. Add it to 200, because growth keeps the old amount and adds the extra.' },
          { tex: '10\\% \\text{ of } 220 = 22,\\quad 220 + 22 = 242', text: 'Repeat for week 2, but take 10% of the NEW amount, 220. That is 22, a bigger raise than last week, which is exponential growth at work.' },
          { tex: '200 \\cdot 1.1 \\cdot 1.1 = 242', text: 'Check with the factor 1.1, which is 100% + 10%. Multiplying twice gives 200 × 1.21 = 242, so the table and the formula agree.' },
        ],
        answer: '242 \\text{ followers}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: count the doublings',
      body: 'A colony of 100 cells doubles every 3 hours. How many cells are there after 12 hours?',
      art: numberLine(
        0,
        12,
        [
          { at: 0, label: '100', color: SKY },
          { at: 3, label: '200', color: AMB },
          { at: 6, label: '400', color: AMB },
          { at: 9, label: '800', color: AMB },
          { at: 12, label: '1600', color: EMR },
        ],
        { step: 3, title: 'hours, one doubling every 3', caption: 'Four hops of ×2, not twelve hops of anything.' },
      ),
      steps: {
        steps: [
          { tex: '12 \\div 3 = 4', text: 'Divide the total time by the doubling time. The colony doubles once per 3-hour block, so this counts how many doublings fit in 12 hours.' },
          { tex: '100 \\cdot 2^{4}', text: 'Write the growth with that count as the exponent. Each doubling multiplies by 2, so four doublings multiply by 2 four times.' },
          { tex: '2^{4} = 16', text: 'Evaluate the power. Four doublings give 2 × 2 × 2 × 2, so there are 16 times as many cells as at the start.' },
          { tex: '100 \\cdot 16 = 1600', text: 'Multiply the start by 16. The number line shows the same hops: 100, 200, 400, 800, 1600.' },
        ],
        answer: '1600 \\text{ cells}',
      },
    },
    {
      kind: 'example',
      head: 'Medicine leaving your blood',
      body: 'Each hour, 20% of a medicine leaves your bloodstream. What factor do you multiply by, and how much is left after 3 hours if you start with 100 mg?',
      table: {
        head: ['hour', 'mg left'],
        rows: [['0', '100'], ['1', '80'], ['2', '64'], ['3', '51.2'], ['4', '41.0']],
        note: 'It never reaches zero — each hour keeps 80% of a positive number.',
      },
      steps: {
        steps: [
          { tex: '100\\% - 20\\% = 80\\%', text: 'Ask what stays. If 20% leaves each hour, then 80% remains, and the remaining part is what you carry into the next hour.' },
          { tex: 'b = 0.8', text: 'Write 80% as a decimal by dividing by 100. A factor of 0.8 is less than 1, so the amount shrinks every hour, which is decay.' },
          { tex: '100 \\cdot 0.8^{3}', text: 'For 3 hours, multiply the starting 100 mg by 0.8 three times. Repeated multiplication is exactly what the exponent 3 records.' },
          { tex: '0.8^{3} = 0.64 \\cdot 0.8 = 0.512,\\quad 100 \\cdot 0.512 = 51.2', text: 'Evaluate step by step: 0.8 × 0.8 = 0.64, then 0.64 × 0.8 = 0.512. Multiply by 100 to get 51.2 mg, matching the table.' },
        ],
        answer: '51.2 \\text{ mg}',
      },
    },
    {
      kind: 'protip',
      head: 'Always ask "what stays?"',
      body: 'For any decay problem, the useful number is the part that REMAINS, not the part that disappears. Down 30% means 0.70 stays; down 5% means 0.95 stays. Write the keep-percent above the problem before you compute anything.',
      table: {
        head: ['loses', 'keeps', 'factor b'],
        rows: [['10%', '90%', '0.90'], ['25%', '75%', '0.75'], ['30%', '70%', '0.70'], ['50%', '50%', '0.50']],
        note: 'The two columns always add to 100%. That is the whole trick.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: multiplying by the exponent',
      body: 'In y = 4 · 2³, the answer is not 4 × 3 = 12. The exponent is an instruction to multiply 2 by itself three times, giving 8, and only THEN do you multiply by the start: 4 × 8 = 32. Powers are built before the front number joins in.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '4 \\cdot 2 \\cdot 3 = 24', lines: ['Treats 3 as a multiplier', 'Ignores what a power means'], tone: 'bad' },
          { title: 'Right', tex: '4 \\cdot (2 \\cdot 2 \\cdot 2) = 32', lines: ['Builds the power first', 'Then the start joins in'], tone: 'ok' },
        ],
        note: 'Powers before products — the exponent only ever talks to the base beneath it.',
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: the floor it never touches',
      body: 'The graph of y = 12 · (1/2)^x keeps dropping. Does it ever reach zero?',
      art: (() => {
        const ax = axes({ x: [0, 6], y: [0, 13] }, { ticks: { x: [0, 1, 2, 3, 4, 5, 6], y: [0, 3, 6, 9, 12] }, grid: true, xLabel: 'x', pad: 34 });
        let b = ax.body + ax.curve((x) => 12 * Math.pow(0.5, x), ROSE, 3);
        b += line(ax.X(0), ax.Y(0), ax.X(6), ax.Y(0), EMR, 2.4, '6 4');
        b += text(ax.X(4.1), ax.Y(2.4), 'y = 0 · never reached', { size: 12, fill: EMR });
        for (const x of [0, 1, 2, 3, 4]) b += dot(ax.X(x), ax.Y(12 * Math.pow(0.5, x)), 4, ROSE);
        b += text(W / 2, 22, 'halving 12 forever', { size: 12, op: 0.7 });
        return art('A decay curve falling toward the x-axis without ever touching it', b, 'The curve crowds the axis closer and closer — an asymptote, not a landing.');
      })(),
      steps: {
        steps: [
          { tex: '12,\\ 6,\\ 3,\\ 1.5,\\ 0.75,\\ 0.375', text: 'Halve 12 again and again, which is the same as multiplying by the factor 1/2. The values shrink quickly, so you might guess they hit zero soon.' },
          { tex: '\\tfrac12 \\cdot (\\text{positive}) > 0', text: 'Notice that half of a positive number is always still positive. Multiplying by 1/2 makes a number smaller but cannot turn it into 0 or a negative.' },
          { tex: '12 \\cdot \\left(\\tfrac12\\right)^{x} > 0', text: 'So y stays above 0 for every x, because 12 and (1/2)^x are both positive. The graph can never touch the x-axis.' },
          { tex: 'y \\to 0 \\text{ as } x \\to \\infty', text: 'The values get closer to 0 as x grows, like 0.375, then 0.1875, and so on. A line a curve approaches but never reaches is a horizontal asymptote, here y = 0.' },
        ],
        answer: '\\text{No: } y \\text{ gets close to } 0 \\text{ but never reaches it}',
      },
    },
    {
      kind: 'summary',
      head: 'Start, factor, steps',
      body: 'Every exponential is y = a · b^x: a is where you START, b is what you MULTIPLY by, and x counts the steps. A factor over 1 grows, a factor between 0 and 1 decays. Turn percents into factors by keeping the 100% and adjusting.',
      formula: {
        tex: 'y = a \\cdot b^{x} \\qquad b = 1 \\pm \\tfrac{\\%}{100}',
        parts: [
          { sym: 'a', means: 'the value at x = 0', tone: 'accent' },
          { sym: 'b > 1', means: 'grows — each step is bigger', tone: 'ok' },
          { sym: '0 < b < 1', means: 'decays — each step is smaller', tone: 'bad' },
        ],
      },
    },
  ],

  'PC-6': [
    {
      kind: 'objective',
      head: 'Logarithms: the question machine',
      body: 'Today you will read a logarithm as a QUESTION: what power do I raise the base to? You will evaluate logs by counting, use the three log rules, and decode real scales like Richter and decibels. Logs stop being scary once you hear the question.',
      art: flow([{ label: 'A log asks for the exponent', color: SKY }, { label: 'Multiply inside, add outside', color: AMB }, { label: 'Powers slide out front', color: EMR }], { title: 'What a logarithm is for' }),
    },
    {
      kind: 'concept',
      head: 'A log asks for the exponent',
      body: 'Read log base 2 of 8 out loud as "2 to WHAT power gives 8?" The answer is 3, because 2³ = 8. The answer to a log is always an exponent — nothing more mysterious than that.',
      art: funcGraph([{ f: (x) => Math.log2(x) }], { range: { x: [-1, 9], y: [-4, 4] }, vAsymptotes: [{ at: 0, label: 'never reaches 0' }], points: [{ x: 8, y: 3, label: 'log₂ 8 = 3' }], title: 'The output IS the exponent', caption: 'Ask "2 to what power gives 8?" The graph answers 3.' }),
      formula: {
        tex: '\\log_{b} N = x \\iff b^{x} = N',
        note: 'Read the left side as a question: "b to WHAT power gives N?"',
        parts: [
          { sym: 'b', means: 'the base — what you keep multiplying', tone: 'accent' },
          { sym: 'N', means: 'the number you are trying to reach', tone: 'warn' },
          { sym: 'x', means: 'the ANSWER — and it is always an exponent', tone: 'ok' },
        ],
      },
      why: 'Exponentials and logs are one relationship written two ways: 2³ = 8 and log₂ 8 = 3 describe the very same fact. The log simply points at the exponent instead of at the answer. So whenever you see a log, the real question is a missing-exponent question, such as "2 multiplied by itself how many times makes 8?"',
    },
    {
      kind: 'concept',
      head: 'Logs and exponents are undo twins',
      body: 'An exponent takes a base and an exponent and builds a number. A log takes the base and the number and digs the exponent back out. They undo each other the way multiplying and dividing do.',
      compare: {
        cols: [
          { title: 'Exponent builds', tex: '2^{5} = 32', lines: ['base + exponent in', 'number out'], tone: 'accent' },
          { title: 'Log digs out', tex: '\\log_{2} 32 = 5', lines: ['base + number in', 'exponent out'], tone: 'ok' },
        ],
        note: 'Same three numbers, rearranged — like 3 × 4 = 12 and 12 ÷ 4 = 3.',
      },
      art: (() => {
        const ax = axes({ x: [-0.5, 5], y: [-2.5, 5] }, { ticks: { x: [1, 2, 3, 4], y: [-2, 0, 2, 4] }, grid: true, pad: 30 });
        let b = ax.body + ax.curve((x) => Math.pow(2, x), AMB, 2.8) + ax.curve((x) => Math.log2(x), SKY, 2.8);
        b += ax.curve((x) => x, ROSE, 1.8, '5 4');
        b += text(ax.X(2.5), ax.Y(4.4), '2ˣ', { size: 13, fill: AMB });
        b += text(ax.X(4.2), ax.Y(1.1), 'log₂ x', { size: 13, fill: SKY });
        b += text(ax.X(0.6), ax.Y(-1.7), 'y = x', { size: 11, fill: ROSE });
        return art('An exponential curve and a logarithm curve mirrored across the dashed line y equals x', b,
          'Fold the page along y = x and the two curves land on each other — that is what "undo" looks like.');
      })(),
      why: 'Doing 2⁵ turns the input 5 into the output 32, and doing log₂ turns 32 back into 5, so each one reverses the other. On a graph, inputs and outputs trade places, which flips the picture across the line y = x. That mirror image is the visual signature of any pair of functions that undo each other.',
    },
    {
      kind: 'concept',
      head: 'Multiply inside becomes add outside',
      body: 'The product rule says log(A × B) = log A + log B. A hard multiplication inside the log turns into an easy addition outside it. The division version subtracts instead: log(A ÷ B) = log A − log B.',
      art: funcGraph([{ f: (x) => Math.log2(x), label: 'y = log₂ x' }], { range: { x: [-1, 9], y: [-3, 4] }, points: [{ x: 2, y: 1, label: 'log 2 = 1' }, { x: 4, y: 2, label: 'log 4 = 2', color: SKY }, { x: 8, y: 3, label: 'log 8 = 3', color: VIO }], title: 'Doubling inside adds one outside', caption: 'Every time the input doubles, the log climbs by exactly one. Multiplication becomes addition.' }),
      formula: {
        tex: '\\log(AB) = \\log A + \\log B',
        note: 'A hard multiplication inside turns into an easy addition outside. Division subtracts instead.',
      },
      why: 'Multiplying powers of the same base adds their exponents: 2³ · 2⁴ = (2·2·2)(2·2·2·2) = 2⁷. A log reports exponents, so the log of a product is the sum of the logs, 3 + 4 = 7. Check: log₂ 8 + log₂ 16 = 3 + 4 = 7, and 8 × 16 = 128 = 2⁷.',
    },
    {
      kind: 'concept',
      head: 'An exponent slides out front',
      body: 'The power rule says log(Aⁿ) = n × log A. An exponent stuck inside the log slides out and becomes a plain multiplier. That turns a monster like log₂(8³) into a friendly 3 × log₂ 8.',
      formula: {
        tex: '\\log(A^{n}) = n \\log A',
        note: 'An exponent stuck inside the log slides out and becomes a plain multiplier.',
      },
      why: 'Raising to a power is repeated multiplication, and the product rule turns each multiplication into an addition. So log(A³) = log(A · A · A) = log A + log A + log A = 3 log A. Check: log₂(4³) = log₂ 64 = 6, and 3 × log₂ 4 = 3 × 2 = 6.',
    },
    {
      kind: 'example',
      head: 'Start simple: log base 2 of 32',
      body: 'Evaluate log base 2 of 32. Read the log as a question about an exponent.',
      steps: {
        steps: [
          { tex: '\\log_{2} 32 = x \\iff 2^{x} = 32', text: 'Turn the log into its question form. A log is an exponent, so log base 2 of 32 asks which power of 2 equals 32.' },
          { tex: '2,\\ 4,\\ 8,\\ 16,\\ 32', text: 'Start at 2 and keep doubling until you land on 32. Writing the list out beats guessing, and it shows how many doublings it takes.' },
          { tex: '2^{5} = 32', text: 'Count the numbers in your list: five. Each one is one more factor of 2, so the exponent is the count of 2s multiplied.' },
        ],
        answer: '\\log_{2} 32 = 5',
      },
    },
    {
      kind: 'example',
      head: 'A bigger one: log base 3 of 81',
      body: 'Evaluate log base 3 of 81. Use the table of powers of 3.',
      table: {
        head: ['power', '3ⁿ'],
        rows: [['3¹', '3'], ['3²', '9'], ['3³', '27'], ['3⁴', '81']],
        mark: 3,
        note: 'Write the powers of the base down a column and read the answer off the row you need.',
      },
      steps: {
        steps: [
          { tex: '\\log_{3} 81 = x \\iff 3^{x} = 81', text: 'Rewrite the log as a question: 3 to what power gives 81? The answer to a log is always an exponent.' },
          { tex: '3,\\ 9,\\ 27,\\ 81', text: 'Multiply by 3 each time and write down the results. Each new number is exactly one more factor of 3 than the one before.' },
          { tex: '3^{4} = 81', text: 'Count how many 3s it took to reach 81: four. So 3 to the fourth power is 81, and the exponent is 4.' },
          { tex: '3 \\cdot 3 \\cdot 3 \\cdot 3 = 9 \\cdot 9 = 81', text: 'Check by multiplying out. 3 × 3 is 9, and 9 × 9 is 81, so four 3s really do make 81.' },
        ],
        answer: '\\log_{3} 81 = 4',
      },
    },
    {
      kind: 'example',
      head: 'Base 10: log of 1000',
      body: 'Evaluate the log of 1000. When no base is written, the base is 10.',
      steps: {
        steps: [
          { tex: '\\log 1000 = \\log_{10} 1000', text: 'A log with no base written means base 10. So the question is: 10 to what power gives 1000?' },
          { tex: '10 \\cdot 10 \\cdot 10 = 1000', text: 'Multiply tens until you reach 1000: 10, then 100, then 1000. It takes three tens, and the exponent counts the tens.' },
          { tex: '10^{3} = 1000', text: 'Write that as a power. Three tens multiplied is 10 cubed, so the exponent, and therefore the log, is 3. Shortcut: count the zeros.' },
        ],
        answer: '\\log 1000 = 3',
      },
    },
    {
      kind: 'example',
      head: 'Use the product rule',
      body: 'You are told log 2 = 0.301 and log 5 = 0.699. Find log 10 without a calculator.',
      steps: {
        steps: [
          { tex: '10 = 2 \\cdot 5', text: 'Split 10 into factors whose logs you already know. The problem gave you log 2 and log 5, so 2 times 5 is the clue.' },
          { tex: '\\log 10 = \\log(2 \\cdot 5)', text: 'Replace 10 by 2 · 5 inside the log. This is allowed because they are the same number, so the log has the same value.' },
          { tex: '\\log(2 \\cdot 5) = \\log 2 + \\log 5', text: 'Use the product rule: the log of a product is the sum of the logs. Multiplying inside turns into adding outside.' },
          { tex: '0.301 + 0.699 = 1.000', text: 'Add the two given values. Check: 10¹ = 10, so log 10 should be exactly 1, and it is.' },
        ],
        answer: '\\log 10 = 1',
      },
    },
    {
      kind: 'example',
      head: 'Folding paper to 1024 layers',
      body: 'Each fold doubles the layers, starting from 1. How many folds reach 1024 layers?',
      steps: {
        steps: [
          { tex: '2^{n} = 1024', text: 'Write what you want. After n folds there are 2^n layers, because each fold multiplies the layers by 2. Set that equal to 1024.' },
          { tex: 'n = \\log_{2} 1024', text: 'Rewrite it as a log. Asking for the exponent n that makes 2^n equal 1024 is exactly the question log base 2 of 1024 asks.' },
          { tex: '1 \\to 2 \\to 4 \\to 8 \\to 16 \\to 32 \\to 64 \\to 128 \\to 256 \\to 512 \\to 1024', text: 'Answer it by doubling from 1 and counting. Each doubling is one fold, so the number of arrows is the number of folds.' },
          { tex: '2^{10} = 1024', text: 'The list has ten doublings, so n = 10. Check: 2 to the tenth power really is 1024.' },
        ],
        answer: '10 \\text{ folds}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: multiply it out first',
      body: 'Evaluate log base 2 of 8³ without the power rule: multiply it out first.',
      steps: {
        steps: [
          { tex: '8^{3} = 8 \\cdot 8 \\cdot 8 = 512', text: 'Work out the power inside the log first. 8 × 8 is 64 and 64 × 8 is 512, so the log is really log base 2 of 512.' },
          { tex: '\\log_{2} 512 = ?', text: 'Ask the log question: 2 to what power gives 512? Now it is a plain counting problem like the earlier ones.' },
          { tex: '2,\\ 4,\\ 8,\\ 16,\\ 32,\\ 64,\\ 128,\\ 256,\\ 512', text: 'Double from 1 and count the numbers: there are nine, so nine doublings reach 512 and the log is 9.' },
          { tex: '3 \\log_{2} 8 = 3 \\cdot 3 = 9', text: 'Compare with the power rule: log of 8³ is 3 times log 8, and log₂ 8 = 3. Both ways give 9, which confirms the rule.' },
        ],
        answer: '9',
      },
    },
    {
      kind: 'example',
      head: 'Another way: climb the scale one step',
      body: 'On the Richter scale, how much stronger is a magnitude 7 quake than a magnitude 4? Walk up the scale one step at a time.',
      art: numberLine(4, 7, [
          { at: 4, label: '×1', color: SKY },
          { at: 5, label: '×10', color: AMB },
          { at: 6, label: '×100', color: AMB },
          { at: 7, label: '×1000', color: EMR },
        ], { step: 1, title: 'Richter magnitude', caption: 'Each whole step up is another factor of 10 — three steps is 1000×.' }),
      steps: {
        steps: [
          { tex: '7 - 4 = 3', text: 'Count the whole steps between the two magnitudes. On a log scale the gap between the numbers is what matters, not the numbers themselves.' },
          { tex: '\\times 10,\\ \\times 100,\\ \\times 1000', text: 'Each whole step up multiplies the shaking by 10. After one step it is 10 times, after two 10 × 10 = 100, after three 100 × 10 = 1000.' },
          { tex: '10^{3} = 1000', text: 'Three steps of times 10 is 10 to the third power. The number of steps becomes the exponent on 10, which is how a log scale works.' },
        ],
        answer: '1000 \\text{ times stronger}',
      },
    },
    {
      kind: 'example',
      head: 'Decibels: concert versus whisper',
      body: 'A concert is 1,000,000 times as intense as a whisper. Decibels are 10 × log of the intensity ratio. How many decibels louder is the concert?',
      steps: {
        steps: [
          { tex: '\\text{dB} = 10 \\cdot \\log(1{,}000{,}000)', text: 'Put the intensity ratio into the decibel formula. The log shrinks a huge ratio into a small, easy number.' },
          { tex: '1{,}000{,}000 = 10^{6} \\Rightarrow \\log = 6', text: 'Find the log by asking 10 to what power gives a million. A million is 1 followed by six zeros, so it is 10 to the sixth.' },
          { tex: '10 \\cdot 6 = 60', text: 'Multiply by the 10 in the formula. The 10 just scales the log, so 10 × 6 gives 60.' },
        ],
        answer: '60 \\text{ decibels louder}',
      },
    },
    {
      kind: 'protip',
      head: 'Say the question out loud',
      body: 'Whenever a log appears, whisper "base to WHAT power gives this number?" That single sentence turns every log problem into a counting problem you can already do. Then count the multiplications on your fingers.',
      formula: {
        tex: '\\log_{b} N \\ \\longrightarrow\\ \\text{“} b \\text{ to what power gives } N \\text{?”}',
        note: 'That one sentence turns every log into a counting problem you can already do.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: log(A + B) is not log A + log B',
      body: 'Only MULTIPLYING inside a log becomes adding outside. Adding inside a log stays stubbornly stuck — there is no rule to split it. Check with numbers: log 100 = 2, but log 10 + log 90 is nowhere near 2.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\log(10 + 90) = \\log 10 + \\log 90', lines: ['2 ≠ 1 + 1.954', 'No such rule'], tone: 'bad' },
          { title: 'Right', tex: '\\log(10 \\cdot 90) = \\log 10 + \\log 90', lines: ['Only multiplying splits', 'Adding stays stuck'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: lemon juice versus water',
      body: 'On the pH scale, each step DOWN means 10 times more acidic. Lemon juice is pH 2 and water is pH 7. How much more acidic is the lemon?',
      steps: {
        steps: [
          { tex: '7 - 2 = 5', text: 'Subtract to count the steps down from water to lemon. The pH scale is a log scale, so the gap between the numbers is what counts.' },
          { tex: '10 \\cdot 10 \\cdot 10 \\cdot 10 \\cdot 10', text: 'Each step multiplies the acidity by 10, so five steps multiply by 10 five times in a row.' },
          { tex: '10^{5} = 100{,}000', text: 'Multiply it out: 10 × 10 = 100, then 1000, then 10,000, then 100,000. Five tens make a 1 followed by five zeros.' },
          { tex: '\\log 100{,}000 = 5', text: 'Check with logs. The log of 100,000 is 5, matching the five pH steps, so the answer fits the log-scale idea.' },
        ],
        answer: '100{,}000 \\text{ times more acidic}',
      },
    },
    {
      kind: 'summary',
      head: 'One question, three rules',
      body: 'A log asks "the base to what power?" and hands you the exponent. Multiply inside becomes add outside, divide becomes subtract, and an exponent slides out front. Richter, decibels, and pH are all logs wearing everyday clothes.',
      formula: {
        tex: '\\begin{gathered} \\log(AB) = \\log A + \\log B \\\\ \\log\\tfrac{A}{B} = \\log A - \\log B \\\\ \\log A^{n} = n\\log A \\end{gathered}',
        parts: [
          { sym: '\\times', means: 'multiply inside becomes add outside', tone: 'ok' },
          { sym: '\\div', means: 'divide inside becomes subtract outside', tone: 'accent' },
          { sym: 'A^{n}', means: 'an exponent inside slides out front', tone: 'warn' },
        ],
      },
    },
  ],

  'PC-7': [
    {
      kind: 'objective',
      head: 'Solve for the hidden exponent',
      body: 'Today you will solve equations where the unknown is stuck up in an exponent or trapped inside a log. You will use the same-base trick, take logs of both sides, and rewrite logs as powers. You will also learn to throw out answers that break the log.',
      art: flow([{ label: 'Free the power', color: SKY }, { label: 'Match bases or take a log', color: AMB }, { label: 'Check the answer is legal', color: EMR }], { title: 'Exponential equations' }),
    },
    {
      kind: 'concept',
      head: 'Same base, matching exponents',
      body: 'If you can write both sides as powers of the SAME base, the exponents must be equal. 2^x = 32 becomes 2^x = 2⁵, so x = 5 immediately. Hunt for a shared base before you reach for anything fancier.',
      formula: {
        tex: 'b^{m} = b^{n} \\ \\Rightarrow\\ m = n',
        note: 'If the bases already match, the exponents have no choice but to match too.',
      },
      art: (() => {
        const ax = axes({ x: [0, 6], y: [0, 70] }, { ticks: { x: [1, 2, 3, 4, 5], y: [16, 32, 48, 64] }, grid: true, pad: 30 });
        let b = ax.body + ax.curve((x) => Math.pow(2, x), AMB, 2.8);
        b += line(ax.X(0), ax.Y(32), ax.X(6), ax.Y(32), SKY, 2.2, '6 4');
        b += line(ax.X(5), ax.Y(0), ax.X(5), ax.Y(32), EMR, 2.2, '6 4');
        b += dot(ax.X(5), ax.Y(32), 5, ROSE);
        b += text(ax.X(1.6), ax.Y(38), 'y = 32', { size: 12, fill: SKY });
        b += text(ax.X(4.2), ax.Y(12), 'x = 5', { size: 12, fill: EMR });
        return art('A doubling curve crossed by a horizontal line at 32, meeting it above x equals 5', b,
          'Solving 2ˣ = 32 is asking where the curve crosses that line.');
      })(),
      why: 'Picture 2 raised to a power as a machine with one input. Different inputs give different outputs, because 2^x keeps climbing and never repeats a value. So if 2^m and 2^n are the same number, the machine must have been fed the same input, which means m = n.',
    },
    {
      kind: 'concept',
      head: 'Free the power first',
      body: 'A power buried under a multiplier cannot be compared yet. In 3 · 2^x = 96, divide both sides by 3 to get 2^x = 32, and only then match bases. Peel away everything around the power before you touch the exponent.',
      steps: {
        steps: [
          { tex: '3 \\cdot 2^{x} = 96', text: 'Look at what surrounds the power. The 2^x is being multiplied by 3, so it is not alone, and you cannot match bases until it is.' },
          { tex: '2^{x} = 96 \\div 3 = 32', text: 'Divide both sides by 3. Doing the same thing to both sides keeps the equation true, and 96 ÷ 3 is 32.' },
          { tex: '2^{x} = 2^{5}', text: 'Write 32 as 2^5, since five doublings from 1 reach 32. Now both sides are powers of 2, so the bases match and the exponents must match too.' },
        ],
        answer: 'x = 5',
      },
      why: 'Matching bases only works when each side is a pure power. A multiplier out front changes the value, so 3 · 2^x and 2^x cannot be compared directly. Dividing both sides by 3 treats each side the same way, so the equation stays balanced, and it leaves 2^x alone, like unwrapping a gift before you look inside.',
    },
    {
      kind: 'concept',
      head: 'Take the log to pull the exponent down',
      body: 'When the bases refuse to match, take the log of both sides. The power rule lets the exponent slide down in front, where it becomes an ordinary number you can divide by. That is the log\'s superpower: it reaches up and grabs the exponent.',
      art: flow([{ label: 'Free the power first', color: SKY }, { label: 'Take the log of both sides', color: AMB }, { label: 'The exponent slides out front', color: EMR }, { label: 'Divide to finish', color: VIO }], { title: 'Four moves for any exponent' }),
      formula: {
        tex: 'b^{x} = N \\ \\Rightarrow\\ x = \\dfrac{\\log N}{\\log b}',
        note: 'When the bases refuse to match, a log reaches up and grabs the exponent.',
      },
      why: 'Taking the log of both sides is allowed because equal numbers always have equal logs. The power rule then turns log(b^x) into x · log b, so the exponent comes down beside the log and can be divided away. Check: 2^x = 10 gives x = log 10 ÷ log 2 = 1 ÷ 0.301 ≈ 3.32, and 2^3.32 is about 10.',
    },
    {
      kind: 'concept',
      head: 'Rewrite a log as a power',
      body: 'A log equation becomes easy the moment you flip it into exponential form. log₄(x) = 3 says "4 to the 3 gives x", so x = 4³ = 64. The base stays the base, and the answer becomes the exponent.',
      formula: {
        tex: '\\log_{4}(x) = 3 \\ \\Rightarrow\\ x = 4^{3}',
        note: 'The base stays the base; the answer becomes the exponent.',
        parts: [
          { sym: '4', means: 'the base — it never moves', tone: 'accent' },
          { sym: '3', means: 'the answer to the log, so it becomes the power', tone: 'ok' },
        ],
      },
      why: 'A log and a power are the same fact in two outfits: log₄ x = 3 says that 4 raised to the 3 gives x. Rewriting only changes the outfit, so nothing is gained or lost. The log was hiding x inside, and the power form leaves x alone on one side, where you just compute 4 · 4 · 4 = 64.',
    },
    {
      kind: 'example',
      head: 'Start simple: 2^x = 32',
      body: 'Make the bases match, then compare the exponents.',
      steps: {
        steps: [
          { tex: '2^{x} = 32', text: 'You want x, and it sits in the exponent. Try to rewrite 32 as a power of the same base, 2, so the two sides can be compared.' },
          { tex: '2,\\ 4,\\ 8,\\ 16,\\ 32', text: 'Double from 1 and count: 2, 4, 8, 16, 32 takes five doublings. The count of factors of 2 is the power.' },
          { tex: '2^{x} = 2^{5}', text: 'Replace 32 by 2^5. Now both sides are powers of 2, so the equation says the same base to two exponents gives the same number.' },
          { tex: 'x = 5', text: 'Same base means the exponents must be equal, because 2 to a power never repeats a value. Check: 2⁵ = 32.' },
        ],
        answer: 'x = 5',
      },
    },
    {
      kind: 'example',
      head: 'A bigger one: 5^x = 625',
      body: 'Solve 5^x = 625 by writing 625 as a power of 5.',
      steps: {
        steps: [
          { tex: '5,\\ 25,\\ 125,\\ 625', text: 'Multiply by 5 again and again. Each product is one more factor of 5, and you stop when you land on 625.' },
          { tex: '625 = 5^{4}', text: 'You multiplied four fives, so 625 is 5 to the fourth power. The count of numbers in your list is the exponent.' },
          { tex: '5^{x} = 5^{4}', text: 'Replace 625 with 5^4 so both sides are powers of 5. Matching bases is what lets you compare exponents.' },
          { tex: 'x = 4', text: 'With equal bases the exponents must be equal. Check: 5⁴ = 25 × 25 = 625.' },
        ],
        answer: 'x = 4',
      },
    },
    {
      kind: 'example',
      head: 'A log equation: log base 4 of x = 3',
      body: 'Solve log base 4 of x = 3 by flipping it into exponential form.',
      steps: {
        steps: [
          { tex: '\\log_{4}(x) = 3', text: 'Read the log as a question: 4 to what power gives x? The equation says the answer to that question is 3.' },
          { tex: 'x = 4^{3}', text: 'Rewrite in exponential form. The base 4 stays the base, and the answer 3 becomes the exponent, so x is 4 cubed.' },
          { tex: '4^{3} = 4 \\cdot 4 \\cdot 4 = 16 \\cdot 4 = 64', text: 'Evaluate the power. 4 × 4 is 16 and 16 × 4 is 64. The log is gone, so this is plain arithmetic.' },
          { tex: '\\log_{4}(64) = 3', text: 'Check by putting 64 back in. 4 to the 3 is 64, so the log is 3 as required, and 64 is positive so the log is legal.' },
        ],
        answer: 'x = 64',
      },
    },
    {
      kind: 'example',
      head: 'Free the power: 3 · 2^x = 96',
      body: 'Solve 3 · 2^x = 96. The power has a multiplier, so deal with that first.',
      steps: {
        steps: [
          { tex: '3 \\cdot 2^{x} = 96', text: 'Notice the 3 multiplying the power. You cannot match bases while the power has company, so first get 2^x alone.' },
          { tex: '2^{x} = 96 \\div 3 = 32', text: 'Divide both sides by 3. Doing the same to both sides keeps the equation balanced, and 96 ÷ 3 = 32.' },
          { tex: '2^{x} = 2^{5}', text: 'Write 32 as 2^5, because five doublings from 1 reach 32. Now both sides have base 2, which lets you compare exponents.' },
          { tex: 'x = 5', text: 'Equal bases force equal exponents. Check it: 3 × 2⁵ = 3 × 32 = 96, which matches the original equation.' },
        ],
        answer: 'x = 5',
      },
    },
    {
      kind: 'example',
      head: 'When will savings double?',
      body: 'Your savings double every 7 years and you have $2000. When do you reach $16,000?',
      art: funcGraph([{ f: (x) => 100 * Math.pow(1.07, x), label: 'balance' }], { range: { x: [0, 14], y: [0, 260] }, hAsymptote: { at: 200, label: 'double' }, points: [{ x: 10, y: 197, label: '10 years' }], xLabel: 'years', yLabel: '$', title: '7% growth doubles in about 10 years', caption: 'Curved, not straight — each year earns interest on the interest before it.' }),
      steps: {
        steps: [
          { tex: '16{,}000 \\div 2000 = 8', text: 'Divide the target by the start to see how many times bigger the money must get. The ratio 8 does not depend on the dollar amounts.' },
          { tex: '2^{n} = 8', text: 'Each doubling multiplies by 2, so after n doublings the money is 2^n times bigger. Set that equal to the ratio 8.' },
          { tex: '8 = 2^{3} \\Rightarrow n = 3', text: 'Write 8 as 2 × 2 × 2, which is 2³. With matching bases the exponent must match, so n = 3 doublings.' },
          { tex: '3 \\cdot 7 = 21', text: 'Each doubling takes 7 years, so multiply the doublings by 7. Check: 2000, 4000, 8000, 16,000 is three doublings.' },
        ],
        answer: '21 \\text{ years}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: list it out',
      body: 'One streaming plan costs $80 a month. A rival starts at $5 and doubles every month. When do they match? List the months instead of using algebra.',
      table: {
        head: ['month', 'rival', 'plan'],
        rows: [['1', '$5', '$80'], ['2', '$10', '$80'], ['3', '$20', '$80'], ['4', '$40', '$80'], ['5', '$80', '$80']],
        mark: 4,
        note: 'Listing is slower than algebra but it never lies — and it doubles as your check.',
      },
      steps: {
        steps: [
          { tex: '\\text{month } 1:\\ \\$5', text: 'Start the list at month 1, where the rival costs $5. Listing works well when the numbers are small and the doubling is easy.' },
          { tex: '5,\\ 10,\\ 20,\\ 40,\\ 80', text: 'Double each month. Doubling means multiplying by 2, so every entry is twice the one before it.' },
          { tex: '\\text{month } 5:\\ \\$80 = \\$80', text: 'Find where the rival reaches $80, the price of the plan. The fifth number in the list is 80, so that is the month they match.' },
          { tex: '5 \\cdot 2^{4} = 5 \\cdot 16 = 80', text: 'Check with a formula. Month n costs 5 · 2^(n − 1), so month 5 gives 5 × 2⁴ = 80. The list and formula agree.' },
        ],
        answer: '\\text{month } 5',
      },
    },
    {
      kind: 'example',
      head: 'Another way: count halvings on a clock',
      body: 'A 400 mg dose loses half every 4 hours. When is only 25 mg left? Count the halvings.',
      art: numberLine(0, 16, [
          { at: 0, label: '400', color: SKY },
          { at: 4, label: '200', color: AMB },
          { at: 8, label: '100', color: AMB },
          { at: 12, label: '50', color: AMB },
          { at: 16, label: '25', color: EMR },
        ], { step: 4, title: 'hours, half gone every 4', caption: 'Four halvings at four hours each — sixteen hours.' }),
      steps: {
        steps: [
          { tex: '400 \\div 25 = 16', text: 'Divide the start by the target to see how much must disappear. The dose must shrink to one sixteenth of its size.' },
          { tex: '16 = 2^{4}', text: 'Each halving cuts the amount by a factor of 2, so 16 is 2 × 2 × 2 × 2. That means four halvings are needed.' },
          { tex: '400 \\to 200 \\to 100 \\to 50 \\to 25', text: 'Check by halving one step at a time. You count four halvings, matching 16 = 2⁴.' },
          { tex: '4 \\cdot 4 = 16', text: 'Each halving takes 4 hours, so four halvings take 4 × 4 = 16 hours.' },
        ],
        answer: '16 \\text{ hours}',
      },
    },
    {
      kind: 'example',
      head: 'A population passing 10,000',
      body: 'A town of 1250 people doubles every 10 years. When does it reach 10,000?',
      steps: {
        steps: [
          { tex: '10{,}000 \\div 1250 = 8', text: 'Divide the target by the start. The town must become 8 times as big, and the ratio ignores the exact head count.' },
          { tex: '8 = 2^{3}', text: 'Doubling multiplies by 2 each time, and 8 is 2 × 2 × 2, or 2³. So exactly three doublings are needed.' },
          { tex: '1250 \\to 2500 \\to 5000 \\to 10{,}000', text: 'Check by doubling one step at a time. You get three doublings, matching 2³.' },
          { tex: '3 \\cdot 10 = 30', text: 'Each doubling takes 10 years, so three doublings take 3 × 10 = 30 years.' },
        ],
        answer: '30 \\text{ years}',
      },
    },
    {
      kind: 'protip',
      head: 'Divide before you count',
      body: 'For every doubling story, divide the target by the start FIRST. That single division tells you how much growth is needed, and turning it into a power of 2 tells you how many doublings. Then multiply by the doubling time to get the answer in years or hours.',
      formula: {
        tex: '\\dfrac{\\text{target}}{\\text{start}} = 2^{n} \\ \\Rightarrow\\ n \\text{ doublings}',
        note: 'One division tells you how much growth is needed; writing it as a power of 2 counts the steps.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: answers that break the log',
      body: 'Solving a log equation can hand you an answer that makes the inside of a log zero or negative. No power of a positive base ever lands on a negative number, so such an answer is fake. Always put your answers back into the ORIGINAL equation and throw out the impossible ones.',
      compare: {
        cols: [
          { title: 'x = 8', tex: '\\log_{2}(8) \\ \\checkmark', lines: ['Inside is positive', 'A real answer'], tone: 'ok' },
          { title: 'x = −2', tex: '\\log_{2}(-2)\\ ?', lines: ['No power of 2 is negative', 'Throw it out'], tone: 'bad' },
        ],
        note: 'Algebra will happily hand you an answer the log cannot accept. Always substitute back.',
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: two logs, one fake answer',
      body: 'Solve log base 2 of x plus log base 2 of (x − 6) equals 4.',
      steps: {
        steps: [
          { tex: '\\log_{2}(x) + \\log_{2}(x-6) = \\log_{2}\\bigl(x(x-6)\\bigr)', text: 'Combine the logs with the product rule, since adding logs outside means multiplying inside. One single log is easy to undo.' },
          { tex: 'x(x-6) = 2^{4} = 16', text: 'Rewrite in exponential form: base 2 to the answer 4 equals the inside. 2⁴ is 16, so x times (x − 6) equals 16.' },
          { tex: 'x^{2} - 6x - 16 = 0', text: 'Multiply out x(x − 6) = x² − 6x and move the 16 to the left. A quadratic must equal zero before you can factor it.' },
          { tex: '(x-8)(x+2) = 0', text: 'Factor by finding two numbers that multiply to −16 and add to −6, namely −8 and +2. Each factor set to zero gives x = 8 or x = −2.' },
          { tex: 'x = -2 \\Rightarrow \\log_{2}(-2)', text: 'Test both in the ORIGINAL equation. For x = −2 the log is impossible, so throw it out. For x = 8: log₂ 8 + log₂ 2 = 3 + 1 = 4, which works.' },
        ],
        answer: 'x = 8',
      },
    },
    {
      kind: 'summary',
      head: 'Match, free, log, check',
      body: 'Try the same base first; if the bases match, the exponents match. Free the power from any multiplier, and take a log when nothing else works. Rewrite log equations as powers, then always CHECK for answers that break the log.',
      formula: {
        tex: '\\text{match} \\to \\text{free} \\to \\log \\to \\text{check}',
        parts: [
          { sym: '1', means: 'try to write both sides with the same base', tone: 'accent' },
          { sym: '2', means: 'divide away anything multiplying the power', tone: 'ok' },
          { sym: '3', means: 'take a log when the bases will not match', tone: 'warn' },
          { sym: '4', means: 'substitute back and throw out impossible answers', tone: 'bad' },
        ],
      },
    },
  ],

  'PC-8': [
    {
      kind: 'objective',
      head: 'Right triangles, three ratios',
      body: 'Today you will label a right triangle from an angle\'s point of view and use SOH-CAH-TOA. You will find missing sides, work backward to find missing angles, and read angles of elevation. Ladders, ramps, and kites are all the same triangle.',
      art: rightTriangle({ opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse', angle: 'θ', shape: { opp: 3, adj: 4 }, names: true, caption: 'Every name is read FROM the angle you care about.' }),
    },
    {
      kind: 'concept',
      head: 'Label first, always',
      body: 'Before any formula, pick your angle and name the sides from ITS point of view. The HYPOTENUSE is the slant across from the right angle. The OPPOSITE side is across from your angle, and the ADJACENT side is the leg that touches it.',
      formula: {
        tex: '\\begin{gathered} \\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}} \\quad \\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}} \\\\ \\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}} \\end{gathered}',
        note: 'The hypotenuse never changes, but opposite and adjacent swap if you switch angles.',
        parts: [
          { sym: '\\text{hyp}', means: 'always the long side, across from the right angle', tone: 'accent' },
          { sym: '\\text{opp}', means: 'the side across the triangle from θ', tone: 'ok' },
          { sym: '\\text{adj}', means: 'the side touching θ that is not the hypotenuse', tone: 'warn' },
        ],
      },
      why: 'The names opposite and adjacent are not fixed properties of a side. They describe where a side sits compared with the angle you chose. Switch to the other acute angle and the two legs trade names, while the hypotenuse stays the same. A ratio only means something once you say which angle you are measuring from.',
    },
    {
      kind: 'concept',
      head: 'SOH-CAH-TOA is the whole toolkit',
      body: 'Sine = Opposite ÷ Hypotenuse. Cosine = Adjacent ÷ Hypotenuse. Tangent = Opposite ÷ Adjacent. Three ratios, and every right-triangle problem is one of them in disguise.',
      why: 'A bigger or smaller right triangle with the same angle has the same shape, so its side ratios do not change. A 3-4-5 and a 6-8-10 both give opposite over hypotenuse of 0.6. Sine, cosine and tangent are names for those shape-fixed ratios, which is why one angle always gives one answer.',
    },
    {
      kind: 'concept',
      head: 'Triangles worth memorizing',
      body: 'The 3-4-5 triangle and its double, the 6-8-10, show up everywhere. The 45-45-90 has two equal legs, so its tangent is exactly 1. The 30-60-90 has its short leg exactly HALF the hypotenuse, so sin 30° = 1/2.',
      art: rightTriangle({ opp: '1', adj: '√3', hyp: '2', angle: '30°', names: false, title: 'The 30-60-90 triangle', caption: 'Sides in the ratio 1 : √3 : 2. Recognise it and the ratios need no calculator.' }),
      compare: {
        cols: [
          { title: '45-45-90', tex: '1 : 1 : \\sqrt{2}', lines: ['Two equal legs', 'Half a square'], tone: 'accent' },
          { title: '30-60-90', tex: '1 : \\sqrt{3} : 2', lines: ['Short leg is half', 'Half an equilateral'], tone: 'ok' },
        ],
        note: 'Spot one of these and you can skip the calculator entirely.',
      },
      why: 'Cut a square along its diagonal and you get two equal legs of 1, and the Pythagorean theorem makes the hypotenuse √(1 + 1) = √2. Cut an equilateral triangle of side 2 in half and the base becomes 1, with height √(4 − 1) = √3. Those two cuts are why the neat ratios exist.',
    },
    {
      kind: 'concept',
      head: 'Inverse trig finds the angle',
      body: 'Sine takes an angle and gives you a ratio; INVERSE sine goes backward, taking a ratio and giving you the angle. If tan = 1, the angle is 45°. If sin = 1/2, the angle is 30°.',
      art: rightTriangle({ opp: '3', adj: '4', hyp: '5', angle: '?', names: false, title: 'Sides known, angle wanted', caption: 'When you have the sides and want the angle, inverse trig runs the ratio backwards.' }),
      formula: {
        tex: '\\sin\\theta = 0.6 \\ \\Rightarrow\\ \\theta = \\sin^{-1}(0.6)',
        note: 'Plain trig turns an angle into a ratio; inverse trig turns a ratio back into an angle.',
      },
      why: 'Between 0° and 90° each angle gives exactly one ratio, so the process can run backward without confusion. If opposite over hypotenuse is 0.6, only one angle fits, and inverse sine finds it. It undoes sine in the same way a log undoes an exponent.',
    },
    {
      kind: 'example',
      head: 'Start simple: name the sides',
      body: 'A right triangle has sides 3, 4 and 5. Which one is the hypotenuse?',
      steps: {
        steps: [
          { tex: '\\text{right angle} \\to \\text{side across from it}', text: 'Find the right angle first. The hypotenuse is defined as the side straight across from it, so it never touches the right angle.' },
          { tex: '\\text{longest side} = \\text{hypotenuse}', text: 'The right angle is the largest angle in the triangle, and the longest side always sits across from the largest angle.' },
          { tex: '3 < 4 < 5', text: 'Compare the three lengths. The longest is 5, so 5 is the hypotenuse, and 3 and 4 are the legs.' },
          { tex: '3^{2} + 4^{2} = 9 + 16 = 25 = 5^{2}', text: 'Check with the Pythagorean theorem. The legs squared add up to the hypotenuse squared, so 5 fits perfectly.' },
        ],
        answer: '\\text{hypotenuse} = 5',
      },
    },
    {
      kind: 'example',
      head: 'Sine and cosine in a 3-4-5',
      body: 'An angle has opposite side 3, adjacent side 4 and hypotenuse 5. Find the sine and cosine.',
      art: rightTriangle({ opp: '3', adj: '4', hyp: '5', angle: 'θ', shape: { opp: 3, adj: 4 }, caption: 'sin θ = 3/5 = 0.6 · cos θ = 4/5 = 0.8 · tan θ = 3/4 = 0.75' }),
      steps: {
        steps: [
          { tex: '\\text{opp} = 3,\\ \\text{adj} = 4,\\ \\text{hyp} = 5', text: 'Label the sides from the angle θ. The 3 is across from it, the 4 touches it, and the 5 is across from the right angle.' },
          { tex: '\\sin\\theta = \\tfrac{\\text{opp}}{\\text{hyp}} = \\tfrac{3}{5} = 0.6', text: 'Use SOH: sine is opposite over hypotenuse. Put in 3 and 5 to get 3/5, which is 0.6 as a decimal.' },
          { tex: '\\cos\\theta = \\tfrac{\\text{adj}}{\\text{hyp}} = \\tfrac{4}{5} = 0.8', text: 'Use CAH: cosine is adjacent over hypotenuse. Put in 4 and 5 to get 4/5, which is 0.8 as a decimal.' },
          { tex: '0.6^{2} + 0.8^{2} = 0.36 + 0.64 = 1', text: 'Check with the Pythagorean identity. The squares of sine and cosine must add to 1, and they do, so both ratios are right.' },
        ],
        answer: '0.6 \\text{ and } 0.8',
      },
    },
    {
      kind: 'example',
      head: 'A bigger one: tangent in a 6-8-10',
      body: 'The legs are 6 and 8 and the hypotenuse is 10. For the angle with opposite side 6 and adjacent side 8, find the tangent.',
      steps: {
        steps: [
          { tex: '\\text{opp} = 6,\\ \\text{adj} = 8', text: 'Label from the chosen angle. The 6 is opposite and the 8 is adjacent, and the hypotenuse of 10 is not needed for this ratio.' },
          { tex: '\\tan\\theta = \\tfrac{\\text{opp}}{\\text{adj}}', text: 'Choose the ratio by the sides you have. Tangent is opposite over adjacent (TOA), and both legs are given, so tangent is the one to use.' },
          { tex: '\\tan\\theta = \\tfrac{6}{8} = \\tfrac{3}{4} = 0.75', text: 'Divide 6 by 8, which simplifies to 3/4 or 0.75. The hypotenuse never enters, because tangent uses only the two legs.' },
          { tex: '6\\text{-}8\\text{-}10 = 2 \\cdot (3\\text{-}4\\text{-}5)', text: 'Notice this is the 3-4-5 triangle doubled. Doubling every side leaves ratios unchanged, so the tangent matches 3/4 from the small triangle.' },
        ],
        answer: '\\tan\\theta = 0.75',
      },
    },
    {
      kind: 'example',
      head: 'A ladder against a wall',
      body: 'A ladder touches a wall 5 m up with its foot 5 m out from the wall. What angle does it make with the ground?',
      steps: {
        steps: [
          { tex: '\\text{opp} = 5,\\ \\text{adj} = 5', text: 'Sketch the triangle. The wall height 5 m is opposite the angle at the ground, and the 5 m along the ground touches that angle, so it is adjacent.' },
          { tex: '\\tan\\theta = \\tfrac{5}{5} = 1', text: 'You know opposite and adjacent, so use tangent (TOA). Dividing 5 by 5 gives a ratio of 1.' },
          { tex: '\\theta = \\tan^{-1}(1)', text: 'To go from a ratio back to an angle, use inverse tangent. The question becomes: which angle has a tangent of 1?' },
          { tex: '\\theta = 45^{\\circ}', text: 'An angle with tangent 1 is 45°, because only the 45-45-90 triangle has two equal legs. The ladder leans halfway between flat and straight up.' },
        ],
        answer: '\\theta = 45^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'A wheelchair ramp',
      body: 'A ramp is 10 ft long along the slope and rises at 30°. How high is the top?',
      art: rightTriangle({ opp: 'h = ?', adj: 'run', hyp: '10 ft ramp', angle: '30°', shape: { opp: 1, adj: 1.732 }, names: false, title: 'A 30° ramp', caption: 'The ramp is the hypotenuse, and the height is across from the 30° angle.' }),
      steps: {
        steps: [
          { tex: '\\text{hyp} = 10,\\ \\text{opp} = h', text: 'Label from the 30° angle. The ramp is the slanted side across from the right angle, so it is the hypotenuse, and the height is opposite the angle.' },
          { tex: '\\sin 30^{\\circ} = \\tfrac{h}{10}', text: 'Opposite and hypotenuse together point to sine (SOH). Write sine of the angle as the unknown height over 10.' },
          { tex: '\\sin 30^{\\circ} = \\tfrac12', text: 'Use the known value sin 30° = 1/2. It comes from the 30-60-90 triangle, where the short side is half the hypotenuse.' },
          { tex: 'h = 10 \\cdot \\tfrac12 = 5', text: 'Multiply both sides by 10 to get h alone. Whatever divides h gets cleared by multiplying, so h = 10 × 1/2 = 5.' },
        ],
        answer: 'h = 5 \\text{ ft}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: draw the picture first',
      body: 'A tree casts a 20 ft shadow, and the angle of elevation to its top is 45°. How tall is the tree?',
      art: rightTriangle({ opp: 'tree = ?', adj: 'shadow 20 ft', angle: '45°', shape: { opp: 1, adj: 1 }, caption: 'Sketch, label, THEN choose the ratio — never the other way round.' }),
      steps: {
        steps: [
          { tex: '\\text{shadow} = 20,\\ \\text{angle} = 45^{\\circ}', text: 'Sketch it: the shadow lies on the ground, the tree stands straight up, and the sunbeam is the slant. The 45° angle is at the tip of the shadow.' },
          { tex: '180^{\\circ} - 90^{\\circ} - 45^{\\circ} = 45^{\\circ}', text: 'Find the third angle, since the angles of a triangle add to 180°. It is also 45°, so two angles are equal.' },
          { tex: '\\text{height} = \\text{shadow}', text: 'Sides across from equal angles are equal, so the tree is exactly as tall as the shadow is long.' },
          { tex: '\\tan 45^{\\circ} = \\tfrac{h}{20} = 1', text: 'Check with tangent. tan 45° = 1, so h ÷ 20 = 1, and multiplying both sides by 20 gives h = 20.' },
        ],
        answer: 'h = 20 \\text{ ft}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: spot the special triangle',
      body: 'A kite flies on a 40 m string, 20 m above your hands. What angle does the string make with the ground?',
      steps: {
        steps: [
          { tex: '\\text{hyp} = 40,\\ \\text{opp} = 20', text: 'Label from the angle at the ground. The string is the hypotenuse, and the height is the side opposite that angle.' },
          { tex: '\\tfrac{20}{40} = \\tfrac12', text: 'Divide the height by the string length. The height is exactly half the string, so the ratio is 1/2.' },
          { tex: '\\sin\\theta = \\tfrac12', text: 'Opposite over hypotenuse is sine (SOH), so sin θ = 1/2. Now you need the angle whose sine is 1/2.' },
          { tex: '\\theta = 30^{\\circ}', text: 'The 30-60-90 triangle is the one with its short side half the hypotenuse, so θ = 30°. Inverse sine of 1/2 gives the same.' },
        ],
        answer: '\\theta = 30^{\\circ}',
      },
    },
    {
      kind: 'example',
      head: 'A slide at the park',
      body: 'A slide meets the ground at 55° and the post makes a right angle with the ground. What is the third angle of the triangle?',
      steps: {
        steps: [
          { tex: 'A + B + C = 180^{\\circ}', text: 'Start from the fact that the three angles of any triangle add up to 180°. This is true for every triangle, right or not.' },
          { tex: '90^{\\circ} + 55^{\\circ} + x = 180^{\\circ}', text: 'Put in the two angles you know, the right angle 90° and the 55° at the ground, and call the unknown angle x.' },
          { tex: 'x = 180^{\\circ} - 145^{\\circ} = 35^{\\circ}', text: 'Add 90 + 55 = 145, then subtract it from 180 to get 35. Check: 90 + 55 + 35 = 180.' },
        ],
        answer: '35^{\\circ}',
      },
    },
    {
      kind: 'protip',
      head: 'Circle the angle before you choose',
      body: 'Circle your angle, then write O, A, and H right on the three sides of your sketch. Look at which two sides the problem actually gives you, and let that pick the ratio for you. Opposite and hypotenuse means sine; the two legs means tangent.',
      formula: {
        tex: '\\text{SOH} \\quad \\text{CAH} \\quad \\text{TOA}',
        parts: [
          { sym: '\\text{SOH}', means: 'Sine = Opposite ÷ Hypotenuse', tone: 'accent' },
          { sym: '\\text{CAH}', means: 'Cosine = Adjacent ÷ Hypotenuse', tone: 'ok' },
          { sym: '\\text{TOA}', means: 'Tangent = Opposite ÷ Adjacent', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: opposite and adjacent swap',
      body: 'Move to the OTHER angle in the same triangle and the opposite and adjacent sides trade places — only the hypotenuse stays put. In a 3-4-5, one angle has sine 0.6 while the other has sine 0.8. Relabel for the new angle before you divide anything.',
      compare: {
        cols: [
          { title: 'From angle A', tex: '\\tan A = \\tfrac{3}{4}', lines: ['3 is opposite A', '4 touches A'], tone: 'accent' },
          { title: 'From angle B', tex: '\\tan B = \\tfrac{4}{3}', lines: ['Now 4 is opposite', 'The labels swapped'], tone: 'warn' },
        ],
        note: 'Only the hypotenuse keeps its name. Mark your angle before you name anything else.',
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: the half-hypotenuse clue',
      body: 'A 30-60-90 triangle has a hypotenuse of 12. How long is the side opposite the 30° angle, and why?',
      steps: {
        steps: [
          { tex: '\\sin 30^{\\circ} = \\tfrac{\\text{opp}}{12}', text: 'Opposite and hypotenuse point to sine (SOH). Write sine of 30° as the unknown side over 12.' },
          { tex: '\\sin 30^{\\circ} = \\tfrac12', text: 'Use the special value sin 30° = 1/2. The last step explains where this value comes from.' },
          { tex: '\\text{opp} = 12 \\cdot \\tfrac12 = 6', text: 'Multiply both sides by 12 to clear the fraction. Half of 12 is 6, so the side opposite 30° is 6.' },
          { tex: '\\text{equilateral, side } 12 \\to 6 + 6', text: 'To see why, slice an equilateral triangle of side 12 straight down the middle. The base splits into two 6s, and each half is a 30-60-90 with hypotenuse 12 and short side 6.' },
        ],
        answer: '6',
      },
    },
    {
      kind: 'summary',
      head: 'Label, choose, compute',
      body: 'Pick your angle and label opposite, adjacent, and hypotenuse from its point of view. Then choose the ratio from SOH-CAH-TOA that uses the sides you have. To go from a ratio back to an angle, use inverse trig — and remember sin 30° = 1/2 and tan 45° = 1.',
      formula: {
        tex: '\\theta \\to \\text{label} \\to \\text{SOH-CAH-TOA} \\to \\text{solve}',
        note: 'Four moves, same order every time — the labelling is where the marks are won or lost.',
      },
    },
  ],
};
