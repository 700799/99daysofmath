import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, W, art, axes, bars, dot, line, numberLine, rightTriangle, text } from '../slideArt';

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
    },
    {
      kind: 'example',
      head: 'Start simple: y = 4 · 2^x at x = 3',
      body: 'Build the power first, then multiply by the start.\n2³ = 2 × 2 × 2 = 8. Now 4 × 8 = 32. Three doubling steps starting from 4 land you on 32.',
      steps: {
        steps: [
          { tex: 'y = 4 \\cdot 2^{3}', text: 'Put x = 3 into the rule.' },
          { tex: '2^{3} = 2 \\cdot 2 \\cdot 2 = 8', text: 'Build the power FIRST — three 2s multiplied.' },
          { tex: '4 \\cdot 8 = 32', text: 'Now the start joins in.' },
        ],
        answer: 'y = 32',
      },
    },
    {
      kind: 'example',
      head: 'Read the parts: y = 200 · 1.5^x',
      body: 'What is the start and what is the growth factor?\nThe number out front is the start: 200. The base being raised to the power is the growth factor: 1.5. So you begin at 200 and multiply by 1.5 each step.',
      formula: {
        tex: 'y = 200 \\cdot 1.5^{x}',
        parts: [
          { sym: '200', means: 'out front, so it is the start a', tone: 'accent' },
          { sym: '1.5', means: 'under the exponent, so it is the factor b', tone: 'ok' },
          { sym: 'b > 1', means: 'bigger than 1, so this one grows', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Bacteria doubling every hour',
      body: 'A dish holds 50 bacteria and the count doubles every hour. How many after 4 hours?\nStart 50, factor 2, four steps: y = 50 · 2⁴. Since 2⁴ = 16, you get 50 × 16 = 800 bacteria.',
      table: {
        head: ['hour', 'bacteria'],
        rows: [['0', '50'], ['1', '100'], ['2', '200'], ['3', '400'], ['4', '800']],
        mark: 4,
        note: 'Doubling four times is the same as multiplying by 2⁴ = 16 once.',
      },
      steps: {
        steps: [
          { tex: 'y = 50 \\cdot 2^{4}', text: 'Start 50, factor 2, four hours.' },
          { tex: '2^{4} = 16', text: 'Four doublings is a factor of 16.' },
          { tex: '50 \\cdot 16 = 800', text: 'Multiply the start by it.' },
        ],
        answer: '800 \\text{ bacteria}',
      },
    },
    {
      kind: 'example',
      head: 'A bigger one: a savings account',
      body: 'A savings account grows 8% a year. What do you multiply by each year?\nKeep the 100% you have and add 8%: that is 108%. Written as a decimal, the growth factor is 1.08 — so $500 becomes 500 × 1.08 = $540 after one year.',
      steps: {
        steps: [
          { tex: '100\\% + 8\\% = 108\\%', text: 'Keep what you have, then add the interest.' },
          { tex: '108\\% = 1.08', text: 'Percent to decimal: slide the point two places.' },
          { tex: '500 \\cdot 1.08 = 540', text: 'One year of growth on $500.' },
        ],
        answer: 'b = 1.08',
      },
    },
    {
      kind: 'example',
      head: 'A phone losing value',
      body: 'A $600 phone loses 25% of its value every year. What is it worth after 2 years?\nLosing 25% means KEEPING 75%, so the factor is 0.75. Year 1: 600 × 0.75 = 450. Year 2: 450 × 0.75 = 337.50.',
      steps: {
        steps: [
          { tex: '100\\% - 25\\% = 75\\%', text: 'Ask what STAYS, not what goes.' },
          { tex: 'b = 0.75', text: 'That is the decay factor.' },
          { tex: '600 \\cdot 0.75 = 450', text: 'After one year.' },
          { tex: '450 \\cdot 0.75 = 337.50', text: 'After two years.' },
        ],
        answer: '\\$337.50',
      },
    },
    {
      kind: 'example',
      head: 'Another way: build a table',
      body: 'Followers start at 200 and grow 10% a week. How many after 2 weeks?\nSkip the formula and list it: week 0 is 200, week 1 is 200 + 20 = 220, week 2 is 220 + 22 = 242. Notice week 2 added MORE than week 1 — that is exponential growth showing off.',
      table: {
        head: ['week', 'added', 'followers'],
        rows: [['0', '—', '200'], ['1', '+20', '220'], ['2', '+22', '242'], ['3', '+24.2', '266.2']],
        mark: 2,
        note: 'The ADDED column grows too. A line would add the same number every week.',
      },
    },
    {
      kind: 'example',
      head: 'Another way: count the doublings',
      body: 'A colony of 100 cells doubles every 3 hours. How many after 12 hours?\nDo not track every hour — track doublings. 12 ÷ 3 = 4 doublings, so multiply by 2 four times: 100 → 200 → 400 → 800 → 1600 cells.',
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
    },
    {
      kind: 'example',
      head: 'Medicine leaving your blood',
      body: 'Each hour, 20% of a medicine leaves your bloodstream. What factor do you multiply by?\nAsk what STAYS, not what leaves: 100% − 20% = 80%, so the factor is 0.8. Starting at 100 mg you get 80 mg, then 64 mg, then 51.2 mg.',
      table: {
        head: ['hour', 'mg left'],
        rows: [['0', '100'], ['1', '80'], ['2', '64'], ['3', '51.2'], ['4', '41.0']],
        note: 'It never reaches zero — each hour keeps 80% of a positive number.',
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
      body: 'The graph of y = 12 · (1/2)^x drops forever. Does it ever reach zero?\nHalve 12 over and over: 6, 3, 1.5, 0.75, 0.375 … Half of a positive number is still positive, so the values crowd down toward 0 without ever landing there. That invisible floor is the horizontal asymptote y = 0.',
      art: (() => {
        const ax = axes({ x: [0, 6], y: [0, 13] }, { ticks: { x: [0, 1, 2, 3, 4, 5, 6], y: [0, 3, 6, 9, 12] }, grid: true, xLabel: 'x', pad: 34 });
        let b = ax.body + ax.curve((x) => 12 * Math.pow(0.5, x), ROSE, 3);
        b += line(ax.X(0), ax.Y(0), ax.X(6), ax.Y(0), EMR, 2.4, '6 4');
        b += text(ax.X(4.1), ax.Y(2.4), 'y = 0 · never reached', { size: 12, fill: EMR });
        for (const x of [0, 1, 2, 3, 4]) b += dot(ax.X(x), ax.Y(12 * Math.pow(0.5, x)), 4, ROSE);
        b += text(W / 2, 22, 'halving 12 forever', { size: 12, op: 0.7 });
        return art('A decay curve falling toward the x-axis without ever touching it', b, 'The curve crowds the axis closer and closer — an asymptote, not a landing.');
      })(),
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
    { kind: 'objective', head: 'Logarithms: the question machine', body: 'Today you will read a logarithm as a QUESTION: what power do I raise the base to? You will evaluate logs by counting, use the three log rules, and decode real scales like Richter and decibels. Logs stop being scary once you hear the question.' },
    {
      kind: 'concept',
      head: 'A log asks for the exponent',
      body: 'Read log base 2 of 8 out loud as "2 to WHAT power gives 8?" The answer is 3, because 2³ = 8. The answer to a log is always an exponent — nothing more mysterious than that.',
      formula: {
        tex: '\\log_{b} N = x \\iff b^{x} = N',
        note: 'Read the left side as a question: "b to WHAT power gives N?"',
        parts: [
          { sym: 'b', means: 'the base — what you keep multiplying', tone: 'accent' },
          { sym: 'N', means: 'the number you are trying to reach', tone: 'warn' },
          { sym: 'x', means: 'the ANSWER — and it is always an exponent', tone: 'ok' },
        ],
      },
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
    },
    {
      kind: 'concept',
      head: 'Multiply inside becomes add outside',
      body: 'The product rule says log(A × B) = log A + log B. A hard multiplication inside the log turns into an easy addition outside it. The division version subtracts instead: log(A ÷ B) = log A − log B.',
      formula: {
        tex: '\\log(AB) = \\log A + \\log B',
        note: 'A hard multiplication inside turns into an easy addition outside. Division subtracts instead.',
      },
    },
    {
      kind: 'concept',
      head: 'An exponent slides out front',
      body: 'The power rule says log(Aⁿ) = n × log A. An exponent stuck inside the log slides out and becomes a plain multiplier. That turns a monster like log₂(8³) into a friendly 3 × log₂ 8.',
      formula: {
        tex: '\\log(A^{n}) = n \\log A',
        note: 'An exponent stuck inside the log slides out and becomes a plain multiplier.',
      },
    },
    {
      kind: 'example',
      head: 'Start simple: log base 2 of 32',
      body: 'Ask the question: 2 to what power gives 32?\nCount doublings from 1: 2, 4, 8, 16, 32 — that is five of them. So log₂ 32 = 5.',
      steps: {
        steps: [
          { tex: '\\log_{2} 32 = ?', text: 'Ask: 2 to what power gives 32?' },
          { tex: '2,\\ 4,\\ 8,\\ 16,\\ 32', text: 'Count the doublings from 1 — five of them.' },
        ],
        answer: '5',
      },
    },
    {
      kind: 'example',
      head: 'A bigger one: log base 3 of 81',
      body: 'Ask: 3 to what power gives 81?\nMultiply 3s and count: 3, 9, 27, 81 — four of them. So log₃ 81 = 4, because 3⁴ = 81.',
      table: {
        head: ['power', '3ⁿ'],
        rows: [['3¹', '3'], ['3²', '9'], ['3³', '27'], ['3⁴', '81']],
        mark: 3,
        note: 'Write the powers of the base down a column and read the answer off the row you need.',
      },
    },
    { kind: 'example', head: 'Base 10: log of 1000', body: 'Ask: 10 to what power gives 1000?\n10 × 10 × 10 = 1000, so the answer is 3. With base 10 there is a shortcut — just count the zeros.' },
    {
      kind: 'example',
      head: 'Use the product rule',
      body: 'You are told log 2 = 0.301 and log 5 = 0.699. Find log 10.\nNotice 10 = 2 × 5, and multiplying inside means adding outside. So log 10 = 0.301 + 0.699 = 1, which checks out since 10¹ = 10.',
      steps: {
        steps: [
          { tex: '10 = 2 \\cdot 5', text: 'Split the number into pieces you already know.' },
          { tex: '\\log 10 = \\log 2 + \\log 5', text: 'Multiplying inside means adding outside.' },
          { tex: '0.301 + 0.699 = 1', text: 'Add the two values you were given.' },
        ],
        answer: '\\log 10 = 1',
      },
    },
    { kind: 'example', head: 'Folding paper to 1024 layers', body: 'Each fold doubles the layers, starting from 1. How many folds reach 1024 layers?\nThis is log₂ 1024 in disguise. Double up: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 — ten folds. (Try it with real paper; it gets impossible fast.)' },
    { kind: 'example', head: 'Another way: multiply it out first', body: 'Evaluate log₂(8³) without the power rule.\n8³ = 8 × 8 × 8 = 512. Now ask: 2 to what power is 512? Count doublings — 2, 4, 8, 16, 32, 64, 128, 256, 512 — nine of them. Same answer the rule gives: 3 × 3 = 9.' },
    {
      kind: 'example',
      head: 'Another way: climb the scale one step',
      body: 'On the Richter scale, how much stronger is a magnitude 7 quake than a magnitude 4?\nInstead of a formula, walk it: 4 to 5 is 10 times, 5 to 6 is 10 times again (100), 6 to 7 is 10 times again (1000). Three steps means 1000 times more shaking.',
      art: numberLine(4, 7, [
          { at: 4, label: '×1', color: SKY },
          { at: 5, label: '×10', color: AMB },
          { at: 6, label: '×100', color: AMB },
          { at: 7, label: '×1000', color: EMR },
        ], { step: 1, title: 'Richter magnitude', caption: 'Each whole step up is another factor of 10 — three steps is 1000×.' }),
    },
    { kind: 'example', head: 'Decibels: concert versus whisper', body: 'A concert is 1,000,000 times as intense as a whisper. Decibels are 10 × log of the intensity.\nlog 1,000,000 = 6, because a million has six zeros. Then 10 × 6 = 60, so the concert is 60 decibels louder.' },
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
    { kind: 'challenge', head: 'Extra credit: lemon juice versus water', body: 'On the pH scale, each step DOWN means 10 times more acidic. Lemon juice is pH 2 and water is pH 7 — how much more acidic is the lemon?\nCount the steps: 7 − 2 = 5. Each step multiplies by 10, so it is 10⁵ = 100,000 times more acidic. That is why a squeeze of lemon tastes so sharp.' },
    {
      kind: 'summary',
      head: 'One question, three rules',
      body: 'A log asks "the base to what power?" and hands you the exponent. Multiply inside becomes add outside, divide becomes subtract, and an exponent slides out front. Richter, decibels, and pH are all logs wearing everyday clothes.',
      formula: {
        tex: '\\log(AB) = \\log A + \\log B \\quad \\log\\tfrac{A}{B} = \\log A - \\log B \\quad \\log A^{n} = n\\log A',
        parts: [
          { sym: '\\times', means: 'multiply inside becomes add outside', tone: 'ok' },
          { sym: '\\div', means: 'divide inside becomes subtract outside', tone: 'accent' },
          { sym: 'A^{n}', means: 'an exponent inside slides out front', tone: 'warn' },
        ],
      },
    },
  ],

  'PC-7': [
    { kind: 'objective', head: 'Solve for the hidden exponent', body: 'Today you will solve equations where the unknown is stuck up in an exponent or trapped inside a log. You will use the same-base trick, take logs of both sides, and rewrite logs as powers. You will also learn to throw out answers that break the log.' },
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
    },
    {
      kind: 'concept',
      head: 'Free the power first',
      body: 'A power buried under a multiplier cannot be compared yet. In 3 · 2^x = 96, divide both sides by 3 to get 2^x = 32, and only then match bases. Peel away everything around the power before you touch the exponent.',
      steps: {
        steps: [
          { tex: '3 \\cdot 2^{x} = 96', text: 'The power is not alone yet.' },
          { tex: '2^{x} = 32', text: 'Divide both sides by 3 to free it.' },
          { tex: '2^{x} = 2^{5}', text: 'Now the bases match.' },
        ],
        answer: 'x = 5',
      },
    },
    {
      kind: 'concept',
      head: 'Take the log to pull the exponent down',
      body: 'When the bases refuse to match, take the log of both sides. The power rule lets the exponent slide down in front, where it becomes an ordinary number you can divide by. That is the log\'s superpower: it reaches up and grabs the exponent.',
      formula: {
        tex: 'b^{x} = N \\ \\Rightarrow\\ x = \\dfrac{\\log N}{\\log b}',
        note: 'When the bases refuse to match, a log reaches up and grabs the exponent.',
      },
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
    },
    {
      kind: 'example',
      head: 'Start simple: 2^x = 32',
      body: 'Make the bases match.\n32 = 2⁵, so the equation reads 2^x = 2⁵. Same base means the exponents are equal, so x = 5.',
      steps: {
        steps: [
          { tex: '2^{x} = 32', text: 'Write the right side as a power of 2.' },
          { tex: '32 = 2^{5}', text: 'Count the doublings: 2, 4, 8, 16, 32.' },
        ],
        answer: 'x = 5',
      },
    },
    { kind: 'example', head: 'A bigger one: 5^x = 625', body: 'Write 625 as a power of 5.\nMultiply and count: 5, 25, 125, 625 — four fives. So 625 = 5⁴ and x = 4.' },
    {
      kind: 'example',
      head: 'A log equation: log base 4 of x = 3',
      body: 'Flip it into exponential form.\nlog₄(x) = 3 means 4³ = x. Since 4 × 4 × 4 = 64, the answer is x = 64.',
      steps: {
        steps: [
          { tex: '\\log_{4}(x) = 3', text: 'Flip it into exponential form.' },
          { tex: 'x = 4^{3}', text: 'Base to the answer.' },
        ],
        answer: 'x = 64',
      },
    },
    { kind: 'example', head: 'Free the power: 3 · 2^x = 96', body: 'The power is not alone, so fix that first.\nDivide both sides by 3: 2^x = 32. Then 32 = 2⁵, so x = 5. Check it: 3 × 32 = 96. ✓' },
    { kind: 'example', head: 'When will savings double?', body: 'Your savings double every 7 years and you have $2000. When do you reach $16,000?\nDivide first: 16,000 ÷ 2000 = 8, and 8 = 2³, so three doublings are needed. Three doublings × 7 years each = 21 years.' },
    {
      kind: 'example',
      head: 'Another way: list it out',
      body: 'One streaming plan costs $80 a month. A rival starts at $5 and doubles every month — when do they match?\nSkip the algebra and list: month 1 is $5, then $10, $20, $40, $80. They match in month 5, and the list doubles as your check.',
      table: {
        head: ['month', 'rival', 'plan'],
        rows: [['1', '$5', '$80'], ['2', '$10', '$80'], ['3', '$20', '$80'], ['4', '$40', '$80'], ['5', '$80', '$80']],
        mark: 4,
        note: 'Listing is slower than algebra but it never lies — and it doubles as your check.',
      },
    },
    {
      kind: 'example',
      head: 'Another way: count halvings on a clock',
      body: 'A 400 mg dose loses half every 4 hours. When is only 25 mg left?\nWalk the clock: hour 0 is 400, hour 4 is 200, hour 8 is 100, hour 12 is 50, hour 16 is 25. Four halvings at 4 hours each means 16 hours.',
      art: numberLine(0, 16, [
          { at: 0, label: '400', color: SKY },
          { at: 4, label: '200', color: AMB },
          { at: 8, label: '100', color: AMB },
          { at: 12, label: '50', color: AMB },
          { at: 16, label: '25', color: EMR },
        ], { step: 4, title: 'hours, half gone every 4', caption: 'Four halvings at four hours each — sixteen hours.' }),
    },
    { kind: 'example', head: 'A population passing 10,000', body: 'A town of 1250 people doubles every 10 years. When does it hit 10,000?\nDivide: 10,000 ÷ 1250 = 8 = 2³, so three doublings. Three doublings × 10 years = 30 years.' },
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
    { kind: 'challenge', head: 'Extra credit: two logs, one fake answer', body: 'Solve log₂(x) + log₂(x − 6) = 4.\nCombine: log₂(x(x − 6)) = 4, so x(x − 6) = 2⁴ = 16 and x² − 6x − 16 = 0. Factor into (x − 8)(x + 2) = 0, giving x = 8 or x = −2. But x = −2 would ask for log₂(−2), which is impossible — so the only answer is x = 8.' },
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
        tex: '\\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}} \\quad \\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}} \\quad \\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}}',
        note: 'The hypotenuse never changes, but opposite and adjacent swap if you switch angles.',
        parts: [
          { sym: '\\text{hyp}', means: 'always the long side, across from the right angle', tone: 'accent' },
          { sym: '\\text{opp}', means: 'the side across the triangle from θ', tone: 'ok' },
          { sym: '\\text{adj}', means: 'the side touching θ that is not the hypotenuse', tone: 'warn' },
        ],
      },
    },
    { kind: 'concept', head: 'SOH-CAH-TOA is the whole toolkit', body: 'Sine = Opposite ÷ Hypotenuse. Cosine = Adjacent ÷ Hypotenuse. Tangent = Opposite ÷ Adjacent. Three ratios, and every right-triangle problem is one of them in disguise.' },
    {
      kind: 'concept',
      head: 'Triangles worth memorizing',
      body: 'The 3-4-5 triangle and its double, the 6-8-10, show up everywhere. The 45-45-90 has two equal legs, so its tangent is exactly 1. The 30-60-90 has its short leg exactly HALF the hypotenuse, so sin 30° = 1/2.',
      compare: {
        cols: [
          { title: '45-45-90', tex: '1 : 1 : \\sqrt{2}', lines: ['Two equal legs', 'Half a square'], tone: 'accent' },
          { title: '30-60-90', tex: '1 : \\sqrt{3} : 2', lines: ['Short leg is half', 'Half an equilateral'], tone: 'ok' },
        ],
        note: 'Spot one of these and you can skip the calculator entirely.',
      },
    },
    {
      kind: 'concept',
      head: 'Inverse trig finds the angle',
      body: 'Sine takes an angle and gives you a ratio; INVERSE sine goes backward, taking a ratio and giving you the angle. If tan = 1, the angle is 45°. If sin = 1/2, the angle is 30°.',
      formula: {
        tex: '\\sin\\theta = 0.6 \\ \\Rightarrow\\ \\theta = \\sin^{-1}(0.6)',
        note: 'Plain trig turns an angle into a ratio; inverse trig turns a ratio back into an angle.',
      },
    },
    { kind: 'example', head: 'Start simple: name the sides', body: 'A right triangle has sides 3, 4, and 5. Which one is the hypotenuse?\nThe hypotenuse sits across from the right angle and is always the longest side. Of 3, 4, and 5, that is the 5.' },
    {
      kind: 'example',
      head: 'Sine and cosine in a 3-4-5',
      body: 'An angle has opposite 3, adjacent 4, hypotenuse 5. Find sine and cosine.\nSOH: sine = 3 ÷ 5 = 0.6. CAH: cosine = 4 ÷ 5 = 0.8. Same triangle, same angle — only the chosen sides change.',
      art: rightTriangle({ opp: '3', adj: '4', hyp: '5', angle: 'θ', shape: { opp: 3, adj: 4 }, caption: 'sin θ = 3/5 = 0.6 · cos θ = 4/5 = 0.8 · tan θ = 3/4 = 0.75' }),
      steps: {
        steps: [
          { tex: '\\sin\\theta = \\tfrac{3}{5}', text: 'Opposite over hypotenuse.' },
          { tex: '\\cos\\theta = \\tfrac{4}{5}', text: 'Adjacent over hypotenuse.' },
        ],
        answer: '0.6 \\text{ and } 0.8',
      },
    },
    { kind: 'example', head: 'A bigger one: tangent in a 6-8-10', body: 'The legs are 6 and 8. For the angle with opposite 6 and adjacent 8, find the tangent.\nTOA: tangent = 6 ÷ 8 = 0.75. The hypotenuse is not invited to this one — tangent uses only the two legs.' },
    {
      kind: 'example',
      head: 'A ladder against a wall',
      body: 'A ladder touches a wall 5 m up with its foot 5 m out. What angle does it make with the ground?\nOpposite is 5, adjacent is 5, so tan = 5 ÷ 5 = 1. The angle with tangent 1 is 45° — exactly halfway between flat and straight up.',
      steps: {
        steps: [
          { tex: '\\text{hyp} = 20,\\ \\theta = 60^{\\circ}', text: 'The ladder is the hypotenuse; the wall is opposite.' },
          { tex: '\\sin 60^{\\circ} = \\dfrac{h}{20}', text: 'Opposite over hypotenuse — so use sine.' },
          { tex: 'h = 20\\sin 60^{\\circ}', text: 'Multiply both sides by 20.' },
        ],
        answer: 'h \\approx 17.3 \\text{ ft}',
      },
    },
    { kind: 'example', head: 'A wheelchair ramp', body: 'A ramp is 10 ft along the slope and rises at 30°. How high is the top?\nThe ramp itself is the hypotenuse, and the height is opposite the 30° angle. SOH: sin 30° = height ÷ 10, and sin 30° = 1/2, so the height is 5 ft.' },
    {
      kind: 'example',
      head: 'Another way: draw the picture first',
      body: 'A tree casts a 20 ft shadow with a 45° angle of elevation to its top. How tall is the tree?\nSketch it: shadow along the ground, tree straight up, sunbeam as the slant. Two 45° angles means two equal legs, so the tree is exactly as tall as the shadow is long — 20 ft, no formula needed.',
      art: rightTriangle({ opp: 'height = ?', adj: '12 ft', angle: '35°', shape: { opp: 2, adj: 3 }, caption: 'Sketch, label, THEN choose the ratio — never the other way round.' }),
    },
    { kind: 'example', head: 'Another way: spot the special triangle', body: 'A kite flies on a 40 m string, 20 m above your hands. What angle does the string make with the ground?\nThe height is exactly half the string. The only right triangle where a leg is half the hypotenuse is the 30-60-90, so the angle is 30° — the same answer inverse sine of 1/2 gives.' },
    { kind: 'example', head: 'A slide at the park', body: 'A slide meets the ground at 55° and the post makes a right angle. What is the third angle?\nAll three angles total 180°, and the right angle already used 90°. That leaves 90° to share, so the third angle is 90 − 55 = 35°.' },
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
    { kind: 'challenge', head: 'Extra credit: the half-hypotenuse clue', body: 'A 30-60-90 triangle has a hypotenuse of 12. How long is the side opposite the 30° angle, and why?\nsin 30° = 1/2, so that side is 12 × 1/2 = 6. Here is the reason: slice an equilateral triangle with side 12 straight down the middle, and the bottom edge splits into two 6s.' },
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
