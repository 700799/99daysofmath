import type { SlideArt, SlideBank } from './types';
import {
  AMB, EMR, INK, ROSE, SKY, VIO, W,
  areaModel, art, bars, dotPlot, doubleLine, fades, flow, fractionBar, line, numberLine, plotGrid,
  prism, rect, tape, text, triangle,
} from '../slideArt';

// 5.F — Grade-5 Foundations decks, units 7-16. Same shape as units 1-6: a big
// idea, three key ideas, a ladder of worked examples with an "Another way",
// then a pro tip, a trap, a challenge, and a wrap-up.

/** A 10 × 10 hundredths grid with a cols × rows block shaded: tenths × tenths. */
function hundredthsGrid(cols: number, rows: number, label: string): SlideArt {
  const s = 17, x0 = (W - 10 * s) / 2, y0 = 40;
  let b = text(W / 2, 24, `${cols} tenths × ${rows} tenths`, { size: 12, fill: VIO });
  b += fades(rect(x0, y0, cols * s, rows * s, AMB, `${AMB}55`, 0, 0), 0.2);
  for (let i = 0; i <= 10; i++) {
    b += line(x0 + i * s, y0, x0 + i * s, y0 + 10 * s, INK, i % 10 === 0 ? 2 : 1, undefined, i % 10 === 0 ? 0.9 : 0.35);
    b += line(x0, y0 + i * s, x0 + 10 * s, y0 + i * s, INK, i % 10 === 0 ? 2 : 1, undefined, i % 10 === 0 ? 0.9 : 0.35);
  }
  b += text(x0 + (cols * s) / 2, y0 - 6, `0.${cols}`, { size: 12, fill: SKY });
  b += text(x0 - 8, y0 + (rows * s) / 2 + 4, `0.${rows}`, { size: 12, fill: EMR, anchor: 'end' });
  b += fades(text(W / 2, y0 + 10 * s + 22, label, { size: 14, fill: ROSE }), 0.5);
  return art(`A 10 by 10 grid of hundredths with a ${cols} by ${rows} block shaded`, b, 'Each small square is one hundredth of the whole grid.');
}

export const F5_SLIDES_U07_16: SlideBank = {
  // ---------------- 5.F-7 — Multiplying & dividing big numbers ----------------
  '5.F-7': [
    {
      kind: 'objective',
      head: 'Big numbers, small pieces',
      body: 'Multiplying 203 × 12 looks scary. But break 12 into 10 and 2, and it turns into two easy problems. Today you will multiply and divide big numbers by breaking them up.',
      art: areaModel([{ label: '200', w: 2.4 }, { label: '3', w: 0.8 }], [{ label: '10', h: 1.2 }, { label: '2', h: 0.7 }], [['2,000', '30'], ['400', '6']], { title: '203 × 12 in four boxes', total: '2,000 + 30 + 400 + 6 = 2,436', caption: 'Each box is an easy multiplication. Add them up at the end.' }),
    },
    {
      kind: 'concept',
      head: 'Break it up',
      body: 'To multiply by 20, multiply by 2 and then by 10. The answer is the same, but each step is easy. Splitting a number by its places is the trick behind all big multiplication.',
      formula: { tex: '142 \\times 20 = (142 \\times 2) \\times 10', note: 'Multiply by 2, then add a zero.', parts: [{ sym: '142 \\times 2', means: 'an easy doubling: 284', tone: 'accent' }, { sym: '\\times 10', means: 'shifts every digit one place left', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Dividing means "how many groups?"',
      body: '960 ÷ 40 asks how many 40s fit inside 960. Dividing both numbers by 10 does not change the answer. So it becomes 96 ÷ 4, which is 24.',
      formula: { tex: '960 \\div 40 = 96 \\div 4 = 24', note: 'Take a zero off both numbers first.', parts: [{ sym: '960 \\div 40', means: 'how many 40s fit in 960', tone: 'accent' }, { sym: '96 \\div 4', means: 'the same question, smaller numbers', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Estimate before you calculate',
      body: 'Round to friendly numbers to see about how big the answer should be. 5,812 ÷ 29 is close to 6,000 ÷ 30, which is 200. Now you know roughly where the answer lives.',
      art: numberLine(5500, 6500, [{ at: 5812, label: '5,812', color: SKY }, { at: 6000, label: '6,000', color: ROSE }], { step: 250, title: '5,812 rounds to 6,000', caption: 'A friendly number nearby makes the division easy to do in your head.' }),
    },
    {
      kind: 'example',
      head: 'Times 20: 142 × 20',
      body: 'Double 142 first.\nThen multiply by 10 by adding a zero.\nThe answer is 2,840.',
      steps: { steps: [{ tex: '142 \\times 2 = 284', text: 'Double it first.' }, { tex: '284 \\times 10 = 2{,}840', text: 'Then multiply by 10.' }], answer: '2{,}840' },
    },
    {
      kind: 'example',
      head: 'The area model: 203 × 12',
      body: 'Split 12 into 10 and 2.\nMultiply 203 by each part.\nAdd the two answers together.',
      steps: { steps: [{ tex: '203 \\times 10 = 2{,}030', text: 'Multiply by the tens part.' }, { tex: '203 \\times 2 = 406', text: 'Multiply by the ones part.' }, { tex: '2{,}030 + 406 = 2{,}436', text: 'Add the parts together.' }], answer: '2{,}436' },
    },
    {
      kind: 'example',
      head: 'Another way: 203 × 12 with friendly numbers',
      body: 'Instead of splitting 12, split 203 into 200 and 3. Then 200 × 12 is 2,400, and 3 × 12 is 36. Add them: 2,436. Same answer, different split.',
      art: flow([{ label: '200 × 12 = 2,400', color: SKY }, { label: '3 × 12 = 36', color: AMB }, { label: '2,400 + 36 = 2,436', color: EMR }], { title: 'Split the other number', horizontal: false, caption: 'You can split whichever number is easier.' }),
    },
    {
      kind: 'example',
      head: 'Divide: 960 ÷ 40',
      body: 'Both numbers end in zero, so cross one zero off each. Now it is 96 ÷ 4. Four 24s make 96, so the answer is 24.',
      table: { head: ['Groups of 40', 'Total'], rows: [['10', '400'], ['20', '800'], ['24', '960']], mark: 2, note: '24 groups of 40 make exactly 960.' },
    },
    {
      kind: 'example',
      head: 'Estimate: 5,812 ÷ 29',
      body: 'Round 5,812 to 6,000 and 29 to 30. Then 6,000 ÷ 30 = 200. The real answer is a little more than 200, because we rounded the 29 up.',
      formula: { tex: '5{,}812 \\div 29 \\approx 6{,}000 \\div 30 = 200', note: 'The wavy equals sign means "about".', parts: [{ sym: '\\approx', means: 'about equal, not exactly equal', tone: 'accent' }, { sym: '6{,}000 \\div 30', means: 'friendly numbers you can divide in your head', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: boxes of crayons',
      body: 'A store has 24 boxes with 36 crayons in each. Draw it as rows of boxes: 24 rows of 36. Then 20 × 36 = 720 and 4 × 36 = 144, so there are 864 crayons.',
      art: areaModel([{ label: '36', w: 2.6 }], [{ label: '20', h: 1.4 }, { label: '4', h: 0.6 }], [['720'], ['144']], { title: '24 boxes of 36 crayons', total: '720 + 144 = 864', caption: 'Split the 24 into 20 and 4, then add the two parts.' }),
    },
    {
      kind: 'protip',
      head: 'Check with the other operation',
      body: 'Division and multiplication undo each other. If 960 ÷ 40 = 24, then 24 × 40 must be 960. A quick multiply catches mistakes before they cost you points.',
      formula: { tex: '960 \\div 40 = 24 \\iff 24 \\times 40 = 960', note: 'Multiply back to check a division.', parts: [{ sym: '\\div', means: 'splits a total into equal groups', tone: 'accent' }, { sym: '\\times', means: 'puts the groups back together', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Do not lose the zero',
      body: 'When you multiply by 20, the answer needs the extra zero from the 10. 142 × 20 is 2,840 — not 284. Ask yourself if the answer is about the right size.',
      compare: { cols: [{ title: 'Lost the zero', tex: '142 \\times 20 = 284', lines: ['Only multiplied by 2'], tone: 'bad' }, { title: 'Kept the zero', tex: '142 \\times 20 = 2{,}840', lines: ['× 2, then × 10'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 125 × 32',
      body: 'Here is a trick: 125 × 8 = 1,000. Since 32 = 8 × 4, you can multiply 125 by 8 first and then by 4.',
      steps: { steps: [{ tex: '125 \\times 8 = 1{,}000', text: 'A famous friendly fact.' }, { tex: '1{,}000 \\times 4 = 4{,}000', text: 'The other part of 32.' }], answer: '4{,}000' },
    },
    {
      kind: 'summary',
      head: 'Big numbers, wrapped up',
      body: 'Break big multiplications into easy pieces with the area model. Divide by asking how many groups fit, and cross off matching zeros. Estimate first and check by multiplying back.',
      table: { head: ['Problem', 'Trick'], rows: [['× 20', '× 2, then × 10'], ['203 × 12', '203 × 10 + 203 × 2'], ['960 ÷ 40', 'cross off zeros: 96 ÷ 4'], ['5,812 ÷ 29', 'estimate: 6,000 ÷ 30']] },
    },
  ],

  // ---------------- 5.F-8 — Powers of ten ----------------
  '5.F-8': [
    {
      kind: 'objective',
      head: 'The zeros tell the story',
      body: '10³ means 10 × 10 × 10, which is 1,000 — three zeros. Multiplying by 10, 100, or 1,000 just slides digits to new places. Today you will use powers of ten like a shortcut.',
      art: doubleLine({ label: 'power', vals: ['10¹', '10²', '10³', '10⁴'] }, { label: 'number', vals: [10, 100, '1,000', '10,000'] }, { title: 'The little number counts the zeros', mark: 2, caption: '10³ has three zeros: 1,000.' }),
    },
    {
      kind: 'concept',
      head: 'What 10 to a power means',
      body: 'The small raised number is the exponent. It tells you how many 10s to multiply together. It also tells you how many zeros the answer has.',
      formula: { tex: '10^3 = 10 \\times 10 \\times 10 = 1{,}000', note: 'Three tens multiplied: three zeros.', parts: [{ sym: '10', means: 'the base: the number being multiplied', tone: 'accent' }, { sym: '^3', means: 'the exponent: how many tens to multiply', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Times 10 slides digits left',
      body: 'Every place is worth 10 times the place to its right. So multiplying by 10 moves each digit one place LEFT. Multiplying by 100 moves it two places.',
      art: flow([{ label: '3.6', color: SKY }, { label: '× 10 → 36', color: AMB }, { label: '× 10 → 360', color: EMR }], { title: '3.6 × 100: two jumps left', caption: 'Each × 10 slides every digit one place to the left.' }),
    },
    {
      kind: 'concept',
      head: 'Divide by 10 slides digits right',
      body: 'Dividing by 10 does the opposite: each digit moves one place RIGHT. The number gets 10 times smaller. Dividing by 1,000 moves digits three places.',
      formula: { tex: '4{,}500 \\div 1{,}000 = 4.5', note: 'Three places to the right.', parts: [{ sym: '\\div 1{,}000', means: 'three zeros, so three places right', tone: 'accent' }, { sym: '4.5', means: 'four and a half: much smaller', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Write 10⁵ as a number',
      body: 'The exponent is 5, so multiply five tens together.\nThat makes five zeros after the 1.\nThe answer is 100,000.',
      steps: { steps: [{ tex: '10^5 = 10 \\times 10 \\times 10 \\times 10 \\times 10', text: 'Five tens multiplied.' }, { tex: '= 100{,}000', text: 'A 1 followed by five zeros.' }], answer: '100{,}000' },
    },
    {
      kind: 'example',
      head: 'Times 100: 3.6 × 100',
      body: '100 has two zeros, so slide the digits two places left.\n3.6 becomes 36, then 360.\nThe answer is 360.',
      steps: { steps: [{ tex: '3.6 \\times 10 = 36', text: 'One place left.' }, { tex: '36 \\times 10 = 360', text: 'A second place left.' }], answer: '360' },
    },
    {
      kind: 'example',
      head: 'Divide by 1,000: 4,500 ÷ 1,000',
      body: '1,000 has three zeros, so slide three places right. 4,500 becomes 450, then 45, then 4.5. The answer is 4.5.',
      art: numberLine(0, 6, [{ at: 4.5, label: '4.5', color: ROSE }], { title: '4,500 ÷ 1,000 lands at 4.5', caption: 'Dividing by 1,000 makes the number 1,000 times smaller.' }),
    },
    {
      kind: 'example',
      head: 'Another way: count the zeros',
      body: 'For 62 × 10⁴, skip the sliding. 10⁴ has four zeros, so just write four zeros after 62. The answer is 620,000.',
      table: { head: ['Problem', 'Zeros to add', 'Answer'], rows: [['62 × 10²', '2', '6,200'], ['62 × 10³', '3', '62,000'], ['62 × 10⁴', '4', '620,000']], mark: 2, note: 'Each extra power adds one more zero.' },
    },
    {
      kind: 'example',
      head: 'Decimals: 0.7 × 100',
      body: 'Slide two places left. 0.7 becomes 7, then 70. The answer is 70 — a lot bigger than 0.7.',
      formula: { tex: '0.7 \\times 100 = 70', note: 'Two places left.', parts: [{ sym: '0.7', means: 'seven tenths', tone: 'accent' }, { sym: '70', means: 'seven tens: 100 times bigger', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: pennies to dollars',
      body: 'You have 2,500 pennies. There are 100 pennies in a dollar, so divide by 100. Slide two places right: 25 dollars. Picture 25 stacks of 100 pennies.',
      art: bars([{ name: 'value', vals: [2500, 25], color: AMB }], { labels: ['pennies', 'dollars'], title: '2,500 pennies = $25', caption: 'Dividing by 100 turns pennies into dollars.' }),
    },
    {
      kind: 'protip',
      head: 'Bigger or smaller? Ask first',
      body: 'Multiplying by 10, 100, or 1,000 always makes a number BIGGER. Dividing always makes it SMALLER. Decide which way first, then slide.',
      art: flow([{ label: 'Times? It gets bigger', color: EMR }, { label: 'Divide? It gets smaller', color: ROSE }, { label: 'Count the zeros to slide', color: SKY }], { title: 'Before you slide', horizontal: false, caption: 'Knowing the direction stops most mistakes.' }),
    },
    {
      kind: 'trap',
      head: 'Dividing makes it smaller',
      body: '250 ÷ 10 is 25, not 2,500. If your answer got bigger when you divided, you slid the wrong way.',
      compare: { cols: [{ title: 'Wrong way', tex: '250 \\div 10 = 2{,}500', lines: ['Slid left instead of right'], tone: 'bad' }, { title: 'Right way', tex: '250 \\div 10 = 25', lines: ['Divide: digits slide right'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 0.045 × 10³',
      body: '10³ is 1,000, so slide three places left. Go one step at a time so you do not lose track.',
      steps: { steps: [{ tex: '10^3 = 1{,}000', text: 'Three places to slide.' }, { tex: '0.045 \\to 0.45 \\to 4.5 \\to 45', text: 'One place left each time.' }], answer: '45' },
    },
    {
      kind: 'summary',
      head: 'Powers of ten, wrapped up',
      body: 'The exponent counts the tens, and the zeros. Times 10 slides digits left and makes a number bigger. Divide by 10 slides digits right and makes it smaller.',
      table: { head: ['Power', 'Number', 'Slide'], rows: [['10¹', '10', '1 place'], ['10²', '100', '2 places'], ['10³', '1,000', '3 places']] },
    },
  ],

  // ---------------- 5.F-9 — Adding & subtracting decimals ----------------
  '5.F-9': [
    {
      kind: 'objective',
      head: 'Line up the points',
      body: 'Adding decimals is just like adding whole numbers — if you line up the decimal points first. 3.4 + 2.7 lands at 6.1. Today you will add and subtract decimals, including money.',
      art: numberLine(0, 8, [{ at: 3.4, label: '3.4', color: SKY }, { at: 6.1, label: '6.1', color: ROSE }], { span: { from: 3.4, to: 6.1, label: '+ 2.7' }, title: 'Start at 3.4, jump 2.7', caption: 'The jump of 2.7 lands at 6.1.' }),
    },
    {
      kind: 'concept',
      head: 'Same places, same column',
      body: 'Tenths must sit over tenths, and hundredths over hundredths. Lining up the decimal points does that for you. Then add each column, right to left.',
      formula: { tex: '\\begin{array}{r} 3.4 \\\\ +\\,2.7 \\\\ \\hline 6.1 \\end{array}', note: 'Decimal points in one straight line.', parts: [{ sym: '.', means: 'the decimal points stack in one column', tone: 'accent' }, { sym: '6.1', means: 'tenths 4 + 7 = 11: carry the 1', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Fill empty places with zeros',
      body: 'A whole number has an invisible decimal point at its end. So 7 is the same as 7.0. Writing the zero makes subtraction like 7 − 0.4 easy to line up.',
      art: fractionBar(10, 6, { label: '7 − 0.4 = 6.6 (the last whole, in tenths)', title: '7.0 is 70 tenths', caption: 'Take 4 tenths away from one whole, and 6 tenths are left.' }),
    },
    {
      kind: 'concept',
      head: '10 tenths make 1 whole',
      body: 'When tenths add up to 10 or more, trade 10 tenths for 1 whole and carry it. It is the same carrying you already know, just one place to the right of the point.',
      formula: { tex: '0.4 + 0.7 = 1.1', note: '11 tenths is 1 whole and 1 tenth.', parts: [{ sym: '0.4 + 0.7', means: '4 tenths plus 7 tenths is 11 tenths', tone: 'accent' }, { sym: '1.1', means: 'trade 10 tenths for one whole', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Add: 3.4 + 2.7',
      body: 'Line up the points.\nTenths first: 4 + 7 = 11 tenths, so write 1 and carry 1.\nWholes: 3 + 2 + 1 = 6. The answer is 6.1.',
      steps: { steps: [{ tex: '0.4 + 0.7 = 1.1', text: 'Tenths: write 1, carry 1.' }, { tex: '3 + 2 + 1 = 6', text: 'Wholes, plus the carry.' }], answer: '6.1' },
    },
    {
      kind: 'example',
      head: 'Subtract: 8.6 − 3.2',
      body: 'Line up the points.\nTenths: 6 − 2 = 4. Wholes: 8 − 3 = 5.\nThe answer is 5.4.',
      steps: { steps: [{ tex: '0.6 - 0.2 = 0.4', text: 'Subtract the tenths.' }, { tex: '8 - 3 = 5', text: 'Subtract the wholes.' }], answer: '5.4' },
    },
    {
      kind: 'example',
      head: 'Money: $2.75 + $1.40',
      body: 'Money has two decimal places: dimes and pennies. Line up the points and add each column. Pennies 5 + 0 = 5, dimes 7 + 4 = 11 (carry 1), dollars 2 + 1 + 1 = 4.',
      table: { head: ['', 'Dollars', 'Dimes', 'Pennies'], rows: [['pretzel', '2', '7', '5'], ['juice', '1', '4', '0'], ['total', '4', '1', '5']], mark: 2, note: 'Total: $4.15.' },
    },
    {
      kind: 'example',
      head: 'Another way: count up for 7 − 0.4',
      body: 'Instead of borrowing, count up from 0.4 to 7. From 0.4 to 1 is 0.6, and from 1 to 7 is 6 more. So the gap is 6.6.',
      art: numberLine(0, 7, [{ at: 0.4, label: '0.4', color: SKY }, { at: 1, label: '1', color: AMB }, { at: 7, label: '7', color: ROSE }], { span: { from: 0.4, to: 7, label: '0.6 + 6 = 6.6' }, title: 'Count up from 0.4 to 7', caption: 'Small jump to a whole number, then a big jump.' }),
    },
    {
      kind: 'example',
      head: 'Different lengths: 1.25 + 0.5',
      body: 'Write 0.5 as 0.50 so both numbers have two decimal places. Now add: 1.25 + 0.50 = 1.75.',
      formula: { tex: '1.25 + 0.50 = 1.75', note: 'The extra zero keeps the columns straight.', parts: [{ sym: '0.50', means: 'five tenths, written with two places', tone: 'accent' }, { sym: '1.75', means: 'one and seventy-five hundredths', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: change from $5',
      body: 'You pay $5.00 for a $3.65 snack. Picture counting up on a number line: from $3.65 to $4.00 is $0.35, and from $4.00 to $5.00 is $1.00. Your change is $1.35.',
      art: numberLine(3, 5, [{ at: 3.65, label: '$3.65', color: SKY }, { at: 4, label: '$4', color: AMB }, { at: 5, label: '$5', color: ROSE }], { span: { from: 3.65, to: 5, label: '0.35 + 1.00 = 1.35' }, title: 'Count up from the price', caption: 'Cashiers count up to make change.' }),
    },
    {
      kind: 'protip',
      head: 'Estimate to check',
      body: 'Round to whole numbers to check your answer. 3.4 + 2.7 is about 3 + 3 = 6, so 6.1 makes sense. An answer like 61 or 0.61 would be way off.',
      art: flow([{ label: 'Round each number', color: SKY }, { label: 'Add the rounded numbers', color: AMB }, { label: 'Is your answer close?', color: EMR }], { title: 'The quick check', caption: 'If the estimate and the answer are far apart, look again.' }),
    },
    {
      kind: 'trap',
      head: 'Line up points, not last digits',
      body: 'If you line up the last digits of 1.25 and 0.5, the 5 tenths lands under the 5 hundredths. That gives 1.30, which is wrong. Line up the decimal points.',
      compare: { cols: [{ title: 'Last digits lined up', tex: '1.25 + 0.5 = 1.30', lines: ['Tenths under hundredths'], tone: 'bad' }, { title: 'Points lined up', tex: '1.25 + 0.50 = 1.75', lines: ['Tenths under tenths'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: three items',
      body: 'You buy a book for $5.49, a pen for $1.25, and a snack for $2.30. You pay with $10. How much change do you get?',
      steps: { steps: [{ tex: '5.49 + 1.25 + 2.30 = 9.04', text: 'Add the three prices.' }, { tex: '10.00 - 9.04 = 0.96', text: 'Subtract from what you paid.' }], answer: '\\$0.96' },
    },
    {
      kind: 'summary',
      head: 'Decimal adding and subtracting, wrapped up',
      body: 'Line up the decimal points, fill empty places with zeros, and add or subtract each column. Trade 10 tenths for 1 whole when you carry. Estimate with whole numbers to check.',
      table: { head: ['Problem', 'Answer'], rows: [['3.4 + 2.7', '6.1'], ['8.6 − 3.2', '5.4'], ['7 − 0.4', '6.6'], ['1.25 + 0.5', '1.75']] },
    },
  ],

  // ---------------- 5.F-10 — Multiplying & dividing decimals ----------------
  '5.F-10': [
    {
      kind: 'objective',
      head: 'Tenths times tenths',
      body: '0.3 × 0.4 is 0.12 — smaller than either number. A grid of hundredths shows why: you are taking part of a part. Today you will multiply and divide decimals using facts you already know.',
      art: hundredthsGrid(3, 4, '12 squares shaded = 0.12'),
    },
    {
      kind: 'concept',
      head: 'Multiply, then place the point',
      body: 'Ignore the decimal points and multiply the digits. Then count how many decimal places the problem had in all. Put that many places in your answer.',
      formula: { tex: '0.3 \\times 0.4 = 0.12', note: '3 × 4 = 12, with two decimal places.', parts: [{ sym: '3 \\times 4 = 12', means: 'the whole-number fact you already know', tone: 'accent' }, { sym: '0.12', means: 'one place + one place = two places', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'A part of a part is smaller',
      body: 'Multiplying by a decimal less than 1 means taking only part of something. Half of 8 is 4 — smaller than 8. So 0.3 × 0.4 being smaller than both makes sense.',
      compare: { cols: [{ title: 'Times a whole number', tex: '0.6 \\times 7 = 4.2', lines: ['Gets bigger than 0.6'], tone: 'ok' }, { title: 'Times a decimal under 1', tex: '0.3 \\times 0.4 = 0.12', lines: ['Smaller than both'], tone: 'accent' }] },
    },
    {
      kind: 'concept',
      head: 'Dividing a decimal: share it out',
      body: 'To share 4.8 among 6, think of 4.8 as 48 tenths. 48 tenths shared by 6 is 8 tenths each. So 4.8 ÷ 6 = 0.8.',
      art: tape([{ label: '4.8 shared by 6', boxes: 6, each: '0.8', color: EMR }], { title: '6 equal shares of 4.8', total: '6 × 0.8 = 4.8', caption: 'Each share gets 8 tenths.' }),
    },
    {
      kind: 'example',
      head: 'Multiply: 0.6 × 7',
      body: 'Multiply the digits: 6 × 7 = 42.\nThe problem has one decimal place.\nSo the answer is 4.2.',
      steps: { steps: [{ tex: '6 \\times 7 = 42', text: 'Multiply without the point.' }, { tex: '0.6 \\times 7 = 4.2', text: 'One decimal place in the problem.' }], answer: '4.2' },
    },
    {
      kind: 'example',
      head: 'Multiply: 0.3 × 0.4',
      body: 'Multiply the digits: 3 × 4 = 12.\nCount decimal places: one in 0.3, one in 0.4 — two in all.\nSo 12 becomes 0.12.',
      steps: { steps: [{ tex: '3 \\times 4 = 12', text: 'The whole-number fact.' }, { tex: '1 + 1 = 2 \\text{ places}', text: 'Count the decimal places.' }], answer: '0.12' },
    },
    {
      kind: 'example',
      head: 'Divide: 4.8 ÷ 6',
      body: 'Think of 4.8 as 48 tenths. 48 ÷ 6 = 8, so each share is 8 tenths. The answer is 0.8.',
      formula: { tex: '4.8 \\div 6 = 0.8', note: '48 tenths ÷ 6 = 8 tenths.', parts: [{ sym: '4.8', means: '48 tenths', tone: 'accent' }, { sym: '0.8', means: '8 tenths in each share', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: use a fact you know',
      body: 'You know 23 × 15 = 345. Then 2.3 × 1.5 uses the same digits. Count the places: one in 2.3, one in 1.5. So the answer is 3.45.',
      art: flow([{ label: '23 × 15 = 345', color: SKY }, { label: '2.3 × 1.5: 2 decimal places', color: AMB }, { label: '345 → 3.45', color: EMR }], { title: 'Reuse a whole-number fact', caption: 'Same digits, then place the point.' }),
    },
    {
      kind: 'example',
      head: 'Check with an estimate',
      body: '2.3 × 1.5 is about 2 × 1.5 = 3. Our answer 3.45 is close to 3, so the point is in the right place. 34.5 or 0.345 would be far off.',
      table: { head: ['Choice', 'Close to 3?'], rows: [['0.345', 'no — too small'], ['3.45', 'yes'], ['34.5', 'no — too big']], mark: 1, note: 'The estimate picks the right place for the point.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: ribbon pieces',
      body: 'Each ribbon is 0.6 meters long and you need 5 of them. Picture 5 pieces end to end. 6 × 5 = 30, with one decimal place: 3.0 meters of ribbon.',
      art: tape([{ label: '5 ribbons', boxes: 5, each: '0.6 m', color: ROSE }], { title: '5 pieces of 0.6 m', total: '5 × 0.6 = 3.0 m', caption: 'Repeated decimals are just multiplication.' }),
    },
    {
      kind: 'protip',
      head: 'Count places at the end',
      body: 'Do all the multiplying first, with whole numbers. Only at the very end count the decimal places and put in the point. That keeps the work simple.',
      formula: { tex: '\\begin{gathered} \\text{places in answer} = \\\\ \\text{places in first} + \\text{places in second} \\end{gathered}', note: 'Add up the decimal places.', parts: [{ sym: '\\text{places in first}', means: 'digits after the point in the first number', tone: 'accent' }, { sym: '\\text{places in answer}', means: 'how many digits go after the point', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Count both decimal places',
      body: '0.3 × 0.4 has two decimal places in all, so the answer is 0.12. Writing 1.2 counts only one place and makes the answer ten times too big.',
      compare: { cols: [{ title: 'One place counted', tex: '0.3 \\times 0.4 = 1.2', lines: ['Bigger than both — impossible'], tone: 'bad' }, { title: 'Both counted', tex: '0.3 \\times 0.4 = 0.12', lines: ['Two places in all'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 1.2 × 0.05',
      body: 'Multiply the digits, then count all the decimal places. Be careful: 0.05 has two places.',
      steps: { steps: [{ tex: '12 \\times 5 = 60', text: 'Multiply the digits.' }, { tex: '1 + 2 = 3 \\text{ places}', text: 'One in 1.2, two in 0.05.' }], answer: '0.060 = 0.06' },
    },
    {
      kind: 'summary',
      head: 'Decimal multiplying and dividing, wrapped up',
      body: 'Multiply the digits, then put in as many decimal places as the problem had in all. Tenths times tenths make hundredths. Divide by thinking in tenths, and estimate to check the point.',
      table: { head: ['Problem', 'Answer'], rows: [['0.6 × 7', '4.2'], ['0.3 × 0.4', '0.12'], ['4.8 ÷ 6', '0.8'], ['2.3 × 1.5', '3.45']] },
    },
  ],

  // ---------------- 5.F-11 — Fractions are division ----------------
  '5.F-11': [
    {
      kind: 'objective',
      head: 'The fraction bar means share',
      body: 'Two pizzas shared by 5 kids gives each kid 2/5 of a pizza. That is because a fraction IS a division: 2 ÷ 5 = 2/5. Today you will switch between fractions, division, and mixed numbers.',
      art: fractionBar(5, 2, { label: '2 ÷ 5 = 2/5 for each kid', title: 'Each kid gets 2 of 5 slices', caption: 'Cut each pizza into 5 slices; each kid gets one slice from each pizza.' }),
    },
    {
      kind: 'concept',
      head: 'Top divided by bottom',
      body: 'Every fraction is a division problem. The top number is what is being shared. The bottom number is how many shares.',
      formula: { tex: '\\frac{a}{b} = a \\div b', note: 'The fraction bar is a division sign.', parts: [{ sym: 'a', means: 'the amount being shared', tone: 'accent' }, { sym: 'b', means: 'how many equal shares', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Improper fractions are more than 1',
      body: 'When the top is bigger than the bottom, like 17/5, the fraction is more than one whole. Each 5 fifths make a whole, so 17 fifths is more than 3 wholes.',
      art: tape([{ label: 'wholes', boxes: 3, each: '5/5', color: SKY }, { label: 'left over', boxes: 1, each: '2/5', color: AMB }], { title: '17 fifths = 3 wholes and 2 fifths', total: '17/5 = 3 2/5', caption: 'Three full wholes, plus 2 extra fifths.' }),
    },
    {
      kind: 'concept',
      head: 'Mixed numbers come from dividing',
      body: 'To turn 17/5 into a mixed number, divide 17 by 5. The answer, 3, is the wholes. The remainder, 2, stays over the 5.',
      formula: { tex: '\\frac{17}{5} = 3\\tfrac{2}{5}', note: '17 ÷ 5 = 3 remainder 2.', parts: [{ sym: '3', means: 'how many whole 5s fit in 17', tone: 'accent' }, { sym: '\\tfrac{2}{5}', means: 'the remainder, still in fifths', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Write 3 ÷ 4 as a fraction',
      body: 'The number being divided goes on top.\nThe number you divide by goes on the bottom.\n3 ÷ 4 = 3/4.',
      steps: { steps: [{ tex: '3 \\div 4', text: 'Three shared into four parts.' }, { tex: '= \\frac{3}{4}', text: 'Top divided by bottom.' }], answer: '\\tfrac{3}{4}' },
    },
    {
      kind: 'example',
      head: 'Sharing: 2 pizzas, 5 kids',
      body: 'Sharing means dividing: 2 ÷ 5. As a fraction that is 2/5. Each kid gets 2/5 of a pizza — less than half, which makes sense with so many kids.',
      formula: { tex: '2 \\div 5 = \\frac{2}{5}', note: 'Pizzas on top, kids on the bottom.', parts: [{ sym: '2', means: 'the pizzas being shared', tone: 'accent' }, { sym: '5', means: 'the kids sharing them', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Mixed number: 17/5',
      body: 'Divide 17 by 5.\n5 goes into 17 three times, with 2 left over.\nSo 17/5 = 3 2/5.',
      steps: { steps: [{ tex: '17 \\div 5 = 3 \\text{ R } 2', text: 'Three fives, two left over.' }, { tex: '3\\tfrac{2}{5}', text: 'Wholes, then the remainder over 5.' }], answer: '3\\tfrac{2}{5}' },
    },
    {
      kind: 'example',
      head: 'Another way: count by fifths',
      body: 'Count up by 5s until you pass 17: 5, 10, 15. That is three wholes, using 15 fifths. Two fifths are left: 3 2/5.',
      art: numberLine(0, 4, [{ at: 3.4, label: '17/5', color: ROSE }, { at: 3, label: '3', color: SKY }], { title: '17/5 sits between 3 and 4', caption: 'Two fifths past 3.' }),
    },
    {
      kind: 'example',
      head: 'What division is 7/8?',
      body: 'Read the fraction bar as "divided by." So 7/8 means 7 ÷ 8. Since 7 is less than 8, the answer is less than 1.',
      table: { head: ['Fraction', 'Division', 'More or less than 1?'], rows: [['7/8', '7 ÷ 8', 'less'], ['8/8', '8 ÷ 8', 'exactly 1'], ['9/8', '9 ÷ 8', 'more']], mark: 0, note: 'Compare the top to the bottom.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: sandwiches',
      body: '3 sandwiches are shared by 4 friends. Draw 3 sandwiches and cut each into 4 parts. Each friend takes one part from each sandwich: 3/4 of a sandwich.',
      art: fractionBar(4, 3, { label: '3 ÷ 4 = 3/4 each', title: 'Each friend gets 3 quarters', caption: 'One quarter from each of the 3 sandwiches.' }),
    },
    {
      kind: 'protip',
      head: 'Less than 1 or more than 1?',
      body: 'Before you answer, compare the top and bottom. Top smaller means less than 1. Top bigger means more than 1, so you can write a mixed number.',
      art: flow([{ label: 'Top < bottom: less than 1', color: SKY }, { label: 'Top = bottom: exactly 1', color: AMB }, { label: 'Top > bottom: more than 1', color: EMR }], { title: 'A quick size check', horizontal: false, caption: 'This catches upside-down answers fast.' }),
    },
    {
      kind: 'trap',
      head: 'The shared amount goes on top',
      body: '2 pizzas for 5 kids is 2/5 each, not 5/2. Writing 5/2 would give each kid two and a half pizzas — more than there are!',
      compare: { cols: [{ title: 'Upside down', tex: '\\frac{5}{2}', lines: ['2.5 pizzas each: impossible'], tone: 'bad' }, { title: 'Right way up', tex: '\\frac{2}{5}', lines: ['Less than half each'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 23/6',
      body: 'Write 23/6 as a mixed number, then say which two whole numbers it sits between.',
      steps: { steps: [{ tex: '23 \\div 6 = 3 \\text{ R } 5', text: 'Three sixes make 18; 5 left.' }, { tex: '3\\tfrac{5}{6}', text: 'Between 3 and 4, close to 4.' }], answer: '3\\tfrac{5}{6}' },
    },
    {
      kind: 'summary',
      head: 'Fractions as division, wrapped up',
      body: 'A fraction is a division: top divided by bottom. When sharing, the amount shared goes on top. Divide to turn an improper fraction into a mixed number: the remainder stays as a fraction.',
      table: { head: ['Write', 'Means'], rows: [['3/4', '3 ÷ 4'], ['2 pizzas, 5 kids', '2/5 each'], ['17/5', '3 2/5']] },
    },
  ],

  // ---------------- 5.F-12 — Fraction word problems ----------------
  '5.F-12': [
    {
      kind: 'objective',
      head: '"Of" means multiply',
      body: 'Jordan saves 2/5 of a $15 allowance. Draw $15 as 5 equal boxes of $3, and 2 boxes is $6. Today you will solve real problems with fractions and check them with estimates.',
      art: tape([{ label: '$15', boxes: 5, each: '$3', color: SKY }], { title: '$15 in 5 equal parts', total: '2 parts = $6 saved', caption: 'Divide by the bottom, multiply by the top.' }),
    },
    {
      kind: 'concept',
      head: 'A fraction of a number',
      body: 'To find 2/5 of 15, split 15 into 5 equal parts (3 each). Then take 2 of those parts. Divide by the bottom, multiply by the top.',
      formula: { tex: '\\frac{2}{5} \\text{ of } 15 = 15 \\div 5 \\times 2 = 6', note: 'Bottom splits, top counts.', parts: [{ sym: '\\div 5', means: 'split into 5 equal parts', tone: 'accent' }, { sym: '\\times 2', means: 'take 2 of the parts', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Repeated fractions multiply',
      body: 'Three batches of 2/3 cup is 2/3 + 2/3 + 2/3. That is the same as 3 × 2/3 = 6/3, which is 2 whole cups.',
      art: fractionBar(3, 2, { label: '2/3 cup per batch', second: { parts: 3, shaded: 3, label: '3 batches: 6/3 = 2 cups' }, title: 'Three batches of 2/3', caption: 'Six thirds make two whole cups.' }),
    },
    {
      kind: 'concept',
      head: 'Estimate with benchmarks',
      body: 'Is each fraction close to 0, 1/2, or 1? Those are benchmarks. 5/8 is a bit more than 1/2, and 1/3 is a bit less. Together they are close to 1.',
      art: numberLine(0, 1, [{ at: 0.333, label: '1/3', color: SKY }, { at: 0.5, label: '1/2', color: INK }, { at: 0.625, label: '5/8', color: ROSE }], { title: 'Near 1/2: one a bit under, one a bit over', caption: 'Two fractions near 1/2 add to about 1.' }),
    },
    {
      kind: 'example',
      head: 'Repeated: 3 batches of 2/3 cup',
      body: 'Multiply the number of batches by the amount in each.\n3 × 2/3 = 6/3.\nSix thirds is 2 whole cups.',
      steps: { steps: [{ tex: '3 \\times \\frac{2}{3} = \\frac{6}{3}', text: 'Multiply the top by 3.' }, { tex: '\\frac{6}{3} = 2', text: 'Six thirds make two wholes.' }], answer: '2 \\text{ cups}' },
    },
    {
      kind: 'example',
      head: 'A fraction of money: 2/5 of $15',
      body: 'Split $15 into 5 equal parts: $3 each.\nTake 2 parts.\nJordan saves $6.',
      steps: { steps: [{ tex: '15 \\div 5 = 3', text: 'One fifth is $3.' }, { tex: '2 \\times 3 = 6', text: 'Two fifths is $6.' }], answer: '\\$6' },
    },
    {
      kind: 'example',
      head: 'Paint: 3/4 of 6 quarts',
      body: 'The whole wall takes 6 quarts, and Rosa paints 3/4 of it. One quarter is 6 ÷ 4 = 1.5 quarts. Three quarters is 3 × 1.5 = 4.5 quarts.',
      formula: { tex: '\\frac{3}{4} \\times 6 = 4.5', note: 'Less than 6, because she paints less than the whole wall.', parts: [{ sym: '\\frac{3}{4}', means: 'the part of the wall she paints', tone: 'accent' }, { sym: '4.5', means: 'quarts of paint she needs', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: multiply first, then divide',
      body: 'For 3/4 of 6, multiply first: 3 × 6 = 18. Then divide by 4: 18 ÷ 4 = 4.5. The order does not change the answer.',
      table: { head: ['Method', 'Steps', 'Answer'], rows: [['divide first', '6 ÷ 4 = 1.5, × 3', '4.5'], ['multiply first', '3 × 6 = 18, ÷ 4', '4.5']], note: 'Pick whichever gives easier numbers.' },
    },
    {
      kind: 'example',
      head: 'Estimate: 5/8 + 1/3',
      body: 'Ella ate 5/8 of one bar and 1/3 of another. 5/8 is a little more than 1/2; 1/3 is a little less. Together they are close to 1 — just under, since 5/8 + 1/3 = 23/24.',
      table: { head: ['Fraction', 'Benchmark'], rows: [['5/8', 'a bit more than 1/2'], ['1/3', 'a bit less than 1/2'], ['total', 'about 1']], mark: 2, note: 'Benchmarks answer "about how much?" fast.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: laps around a track',
      body: 'Each lap is 1/4 mile and you run 6 laps. Draw 6 quarter-mile boxes. Four of them make 1 mile, and 2 more make another half: 1 1/2 miles.',
      art: tape([{ label: '6 laps', boxes: 6, each: '1/4', color: EMR }], { title: '6 quarter-mile laps', total: '6/4 = 1 1/2 miles', caption: 'Four quarters make a whole mile.' }),
      formula: { tex: '6 \\times \\tfrac{1}{4} = \\tfrac{6}{4} = 1\\tfrac{1}{2}', note: 'Six quarters is one whole and two more quarters.', parts: [{ sym: '\\tfrac{6}{4}', means: 'six quarter-miles in all', tone: 'accent' }, { sym: '1\\tfrac{1}{2}', means: 'four quarters make 1, two more make a half', tone: 'ok' }] },
    },
    {
      kind: 'protip',
      head: 'Smaller or bigger than you started?',
      body: 'Multiplying by a fraction less than 1 gives a smaller answer. 3/4 of 6 must be less than 6. If your answer is bigger, something went wrong.',
      art: flow([{ label: 'Fraction < 1: answer shrinks', color: ROSE }, { label: 'Fraction = 1: answer stays', color: AMB }, { label: 'Fraction > 1: answer grows', color: EMR }], { title: 'Size check', horizontal: false, caption: 'Know the direction before you calculate.' }),
    },
    {
      kind: 'trap',
      head: 'Do not divide by the top',
      body: 'For 2/5 of 15, divide by the BOTTOM number (5), then multiply by the top (2). Dividing by 2 and multiplying by 5 gives 37.5 — more than you started with!',
      compare: { cols: [{ title: 'Backwards', tex: '15 \\div 2 \\times 5 = 37.5', lines: ['Bigger than 15: impossible'], tone: 'bad' }, { title: 'Right', tex: '15 \\div 5 \\times 2 = 6', lines: ['Bottom splits, top counts'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 2/3 of 3/4 of 24',
      body: 'Take it in two steps. First find 3/4 of 24. Then find 2/3 of that answer.',
      steps: { steps: [{ tex: '\\frac{3}{4} \\text{ of } 24 = 18', text: '24 ÷ 4 = 6, then × 3.' }, { tex: '\\frac{2}{3} \\text{ of } 18 = 12', text: '18 ÷ 3 = 6, then × 2.' }], answer: '12' },
    },
    {
      kind: 'summary',
      head: 'Fraction word problems, wrapped up',
      body: '"Of" means multiply. Divide by the bottom, multiply by the top. Repeated amounts multiply too. Estimate with 0, 1/2, and 1 to check whether your answer is the right size.',
      table: { head: ['Problem', 'Answer'], rows: [['3 × 2/3 cup', '2 cups'], ['2/5 of $15', '$6'], ['3/4 of 6 quarts', '4.5 quarts'], ['6 laps of 1/4 mile', '1 1/2 miles']] },
    },
  ],

  // ---------------- 5.F-13 — Writing & evaluating expressions ----------------
  '5.F-13': [
    {
      kind: 'objective',
      head: 'Parentheses go first',
      body: '5 × (7 + 3) is 50, but 5 × 7 + 3 is 38. The parentheses change everything. Today you will evaluate expressions in the right order and turn words into math.',
      art: flow([{ label: 'Parentheses first: 7 + 3 = 10', color: SKY }, { label: 'Then multiply: 5 × 10', color: AMB }, { label: '= 50', color: EMR }], { title: '5 × (7 + 3) step by step', horizontal: false, caption: 'Work inside the brackets before anything else.' }),
    },
    {
      kind: 'concept',
      head: 'The order of operations',
      body: 'First do what is inside parentheses. Next multiply and divide, left to right. Last, add and subtract, left to right.',
      table: { head: ['Order', 'Do this'], rows: [['1st', 'Parentheses ( )'], ['2nd', 'Multiply × and divide ÷, left to right'], ['3rd', 'Add + and subtract −, left to right']] },
    },
    {
      kind: 'concept',
      head: 'Words become expressions',
      body: '"The sum of 8 and 5" is (8 + 5). "Three times the sum" puts a 3 in front: 3 × (8 + 5). Parentheses keep the sum together as one thing.',
      formula: { tex: '3 \\times (8 + 5)', note: 'Three times the sum of 8 and 5.', parts: [{ sym: '(8 + 5)', means: '"the sum of 8 and 5" kept together', tone: 'accent' }, { sym: '3 \\times', means: '"three times" the whole sum', tone: 'ok' }] },
      art: areaModel([{ label: '8', w: 1.8 }, { label: '5', w: 1.2 }], [{ label: '3', h: 1 }], [['24', '15']], { title: '3 × (8 + 5) = 24 + 15', total: '39', caption: 'Three rows of 8 + 5 is 39 squares.' }),
    },
    {
      kind: 'concept',
      head: 'Compare without calculating',
      body: '3 × (245 + 17) is three copies of 245 + 17. You do not need the actual number to know it is 3 times as big.',
      art: tape([{ label: '245 + 17', boxes: 1, each: '262', color: SKY }, { label: '3 × (245 + 17)', boxes: 3, each: '262', color: AMB }], { title: 'Three copies of the same sum', total: '3 times as large', caption: 'The bottom bar is exactly three of the top bar.' }),
    },
    {
      kind: 'example',
      head: 'Evaluate 5 × (7 + 3)',
      body: 'Parentheses first: 7 + 3 = 10.\nThen multiply: 5 × 10.\nThe answer is 50.',
      steps: { steps: [{ tex: '7 + 3 = 10', text: 'Inside the parentheses first.' }, { tex: '5 \\times 10 = 50', text: 'Then multiply.' }], answer: '50' },
    },
    {
      kind: 'example',
      head: 'Evaluate (36 − 12) ÷ 4',
      body: 'Parentheses first: 36 − 12 = 24.\nThen divide: 24 ÷ 4.\nThe answer is 6.',
      steps: { steps: [{ tex: '36 - 12 = 24', text: 'Inside the parentheses first.' }, { tex: '24 \\div 4 = 6', text: 'Then divide.' }], answer: '6' },
    },
    {
      kind: 'example',
      head: 'No parentheses: 20 − 3 × 4',
      body: 'There are no parentheses, so multiply before subtracting. 3 × 4 = 12, then 20 − 12 = 8.',
      formula: { tex: '20 - 3 \\times 4 = 20 - 12 = 8', note: 'Multiply comes before subtract.', parts: [{ sym: '3 \\times 4', means: 'done first: multiplication', tone: 'accent' }, { sym: '20 - 12', means: 'done second: subtraction', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: 3 × (8 + 5) by sharing out',
      body: 'Instead of adding first, multiply the 3 by each number: 3 × 8 = 24 and 3 × 5 = 15. Then add: 24 + 15 = 39. Same as 3 × 13.',
      table: { head: ['Method', 'Work', 'Answer'], rows: [['add first', '3 × 13', '39'], ['share the 3', '24 + 15', '39']], note: 'Both ways give 39.' },
    },
    {
      kind: 'example',
      head: 'Write it: "three times the sum of 8 and 5"',
      body: 'Find the sum part first: (8 + 5). Then "three times" it: 3 × (8 + 5). The parentheses show the sum happens first.',
      formula: { tex: '3 \\times (8 + 5)', note: 'Do not work it out — just write it.', parts: [{ sym: '\\text{the sum}', means: 'an addition, kept in parentheses', tone: 'accent' }, { sym: '\\text{three times}', means: 'multiply the whole sum by 3', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: party bags',
      body: 'You make 4 party bags, each with 6 stickers and 2 pencils. Picture one bag: 6 + 2 = 8 things. Four bags: 4 × (6 + 2) = 32 things.',
      art: tape([{ label: '4 bags', boxes: 4, each: '6 + 2', color: VIO }], { title: '4 bags of (6 + 2)', total: '4 × 8 = 32', caption: 'The parentheses are what goes in one bag.' }),
    },
    {
      kind: 'protip',
      head: 'Underline the parentheses first',
      body: 'Before doing anything, find the parentheses and work them out. Write the result above them. Then the rest of the problem is simpler.',
      art: flow([{ label: 'Find the ( )', color: SKY }, { label: 'Work them out', color: AMB }, { label: 'Then × ÷, then + −', color: EMR }], { title: 'Three passes', caption: 'One pass for each level of the order.' }),
    },
    {
      kind: 'trap',
      head: 'Left to right is not always right',
      body: '20 − 3 × 4 is NOT 17 × 4 = 68. Multiplication comes before subtraction, even though the subtraction is written first.',
      compare: { cols: [{ title: 'Left to right', tex: '(20 - 3) \\times 4 = 68', lines: ['Subtracted too early'], tone: 'bad' }, { title: 'Order of operations', tex: '20 - 12 = 8', lines: ['Multiply first'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: 2 × (9 − 4) + 6 ÷ 3',
      body: 'Use the order: parentheses, then multiply and divide, then add.',
      steps: { steps: [{ tex: '9 - 4 = 5', text: 'Parentheses first.' }, { tex: '2 \\times 5 = 10,\\ 6 \\div 3 = 2', text: 'Multiply and divide next.' }, { tex: '10 + 2 = 12', text: 'Add last.' }], answer: '12' },
    },
    {
      kind: 'summary',
      head: 'Expressions, wrapped up',
      body: 'Parentheses first, then multiply and divide, then add and subtract. "The sum of" goes in parentheses. You can compare expressions like 3 × (245 + 17) without working them out.',
      table: { head: ['Expression', 'Value'], rows: [['5 × (7 + 3)', '50'], ['(36 − 12) ÷ 4', '6'], ['20 − 3 × 4', '8'], ['3 × (8 + 5)', '39']] },
    },
  ],

  // ---------------- 5.F-14 — Number patterns & relationships ----------------
  '5.F-14': [
    {
      kind: 'objective',
      head: 'Two rules, side by side',
      body: 'Pattern A adds 2 and pattern B adds 4. Line them up and every B number is twice its A partner. Today you will build patterns from rules and compare them.',
      art: doubleLine({ label: 'A (+2)', vals: [0, 2, 4, 6, 8] }, { label: 'B (+4)', vals: [0, 4, 8, 12, 16] }, { title: 'B is always double A', mark: 3, caption: 'Read each column as a pair: 6 and 12.' }),
    },
    {
      kind: 'concept',
      head: 'A rule makes a pattern',
      body: 'A rule like "add 3" tells you how to get the next number. Start at 0 and keep adding 3: 0, 3, 6, 9, 12, and so on.',
      formula: { tex: '0,\\ 3,\\ 6,\\ 9,\\ 12,\\ \\dots', note: 'Add 3 each time.', parts: [{ sym: '0', means: 'the starting number', tone: 'accent' }, { sym: '+3', means: 'the rule for the next number', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Count the jumps',
      body: 'The 1st number is the start. To get the 6th number, you make 5 jumps. With "add 3" from 0, that is 5 × 3 = 15.',
      art: numberLine(0, 16, [{ at: 0, label: '1st', color: SKY }, { at: 15, label: '6th', color: ROSE }], { step: 3, span: { from: 0, to: 15, label: '5 jumps of 3' }, title: 'The 6th number is 5 jumps away', caption: 'Count jumps, not numbers.' }),
    },
    {
      kind: 'concept',
      head: 'Patterns make ordered pairs',
      body: 'Pair each A number with its B number: (0, 0), (2, 4), (4, 8). Plot them and they make a straight line through the origin.',
      formula: { tex: '(0, 0),\\ (2, 4),\\ (4, 8),\\ (6, 12)', note: 'A first, B second.', parts: [{ sym: '(2, 4)', means: 'A is 2, its partner in B is 4', tone: 'accent' }, { sym: '(6, 12)', means: 'B is still double A', tone: 'ok' }] },
      art: plotGrid([{ x: 0, y: 0 }, { x: 2, y: 4, label: '(2, 4)', color: SKY }, { x: 4, y: 8, label: '(4, 8)', color: SKY }, { x: 6, y: 12, label: '(6, 12)', color: ROSE }], { join: true, range: { x: [0, 8], y: [0, 14] }, title: 'Pairs from two patterns', caption: 'The pairs line up because B is always double A.' }),
    },
    {
      kind: 'example',
      head: 'The 6th number: add 3 from 0',
      body: 'Write the numbers out: 0, 3, 6, 9, 12, 15.\nThe 6th one is 15.\nOr: 5 jumps × 3 = 15.',
      steps: { steps: [{ tex: '0, 3, 6, 9, 12, 15', text: 'Write out six numbers.' }, { tex: '5 \\times 3 = 15', text: 'Check: five jumps of three.' }], answer: '15' },
    },
    {
      kind: 'example',
      head: 'Write five numbers: add 5 from 0',
      body: 'Start at 0 and add 5 each time. 0, 5, 10, 15, 20. That is five numbers.',
      table: { head: ['Position', '1st', '2nd', '3rd', '4th', '5th'], rows: [['Number', '0', '5', '10', '15', '20'], ['Jumps', '0', '1', '2', '3', '4']], note: 'The 5th number is 4 jumps from the start.' },
    },
    {
      kind: 'example',
      head: 'Compare: A adds 2, B adds 4',
      body: 'A: 0, 2, 4, 6. B: 0, 4, 8, 12.\nCompare each pair: 4 is 2 × 2, 8 is 2 × 4.\nEvery B number is twice A.',
      steps: { steps: [{ tex: 'A: 0, 2, 4, 6', text: 'Add 2 each time.' }, { tex: 'B: 0, 4, 8, 12', text: 'Add 4 each time: twice A.' }], answer: 'B = 2 \\times A' },
    },
    {
      kind: 'example',
      head: 'Another way: compare the rules',
      body: 'You do not need to list the numbers. B adds 4 and A adds 2, and 4 ÷ 2 = 2. So B is always twice A, no matter how far you go.',
      formula: { tex: '4 \\div 2 = 2', note: 'Divide the rules to compare the patterns.', parts: [{ sym: '4', means: 'how much B adds each time', tone: 'accent' }, { sym: '2', means: 'how much A adds each time', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Make pairs: A adds 2, B adds 6',
      body: 'Line up the patterns and pair them: (0, 0), (2, 6), (4, 12), (6, 18). B is 3 times A, because 6 ÷ 2 = 3.',
      table: { head: ['A', 'B', 'Pair'], rows: [['0', '0', '(0, 0)'], ['2', '6', '(2, 6)'], ['4', '12', '(4, 12)'], ['6', '18', '(6, 18)']], mark: 2, note: 'Each B is 3 times its A.' },
    },
    {
      kind: 'example',
      head: 'Picture it first: saving money',
      body: 'Maya saves $3 a week and Leo saves $6 a week. Draw two rows of bars, week by week. Leo always has twice as much — after 4 weeks, $12 to $24.',
      art: bars([{ name: 'Maya', vals: [3, 6, 9, 12], color: SKY }, { name: 'Leo', vals: [6, 12, 18, 24], color: AMB }], { labels: ['wk 1', 'wk 2', 'wk 3', 'wk 4'], title: 'Leo always has double', caption: 'Twice the rule means twice the savings.' }),
    },
    {
      kind: 'protip',
      head: 'Jumps = position − 1',
      body: 'When a pattern starts at 0, the number in position n is the rule times (n − 1). The 10th number of "add 4" is 9 × 4 = 36.',
      formula: { tex: '\\text{nth number} = \\text{rule} \\times (n - 1)', note: 'For patterns that start at 0.', parts: [{ sym: 'n - 1', means: 'jumps from the start', tone: 'accent' }, { sym: '\\text{rule}', means: 'how much you add each jump', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'The start is the 1st number',
      body: 'With "add 3" from 0, the 6th number is 15 — five jumps. Doing 6 jumps gives 18, which is the 7th number.',
      compare: { cols: [{ title: 'One jump too many', tex: '6 \\times 3 = 18', lines: ['That is the 7th number'], tone: 'bad' }, { title: 'Right count', tex: '5 \\times 3 = 15', lines: ['Five jumps to the 6th'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: when do they meet 30?',
      body: 'Pattern A adds 3 from 0 and pattern B adds 5 from 0. Which position in each pattern is 30?',
      steps: { steps: [{ tex: '30 \\div 3 = 10 \\text{ jumps}', text: 'A reaches 30 at position 11.' }, { tex: '30 \\div 5 = 6 \\text{ jumps}', text: 'B reaches 30 at position 7.' }], answer: 'A: 11\\text{th},\\ B: 7\\text{th}' },
    },
    {
      kind: 'summary',
      head: 'Patterns, wrapped up',
      body: 'A rule builds a pattern one jump at a time. The nth number is n − 1 jumps from the start. Pair two patterns to make ordered pairs, and divide the rules to compare them.',
      table: { head: ['Rule', 'Pattern'], rows: [['add 2', '0, 2, 4, 6, 8'], ['add 4', '0, 4, 8, 12, 16'], ['add 6', '0, 6, 12, 18, 24']] },
    },
  ],

  // ---------------- 5.F-15 — Volume, unit conversions & line plots ----------------
  '5.F-15': [
    {
      kind: 'objective',
      head: 'Count the cubes',
      body: 'A box 6 inches long, 3 wide, and 2 tall holds 36 one-inch cubes. Volume is just counting cubes, layer by layer. Today you will also convert units and read line plots.',
      art: prism('6 in', '3 in', '2 in', { inside: '36 cubes', layers: 2, title: 'Two layers of 18 cubes', caption: 'One layer is 6 × 3 = 18. Two layers make 36.' }),
    },
    {
      kind: 'concept',
      head: 'Volume = length × width × height',
      body: 'Length times width counts the cubes in one layer. Height tells you how many layers to stack. Volume is measured in cubic units.',
      formula: { tex: 'V = l \\times w \\times h', note: 'Answer in cubic units.', parts: [{ sym: 'l \\times w', means: 'cubes in one layer', tone: 'accent' }, { sym: 'h', means: 'how many layers', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Big unit to small unit: multiply',
      body: 'A foot is bigger than an inch, so 7 feet is MORE inches. Multiply by 12. Going from a small unit to a big one, divide.',
      art: doubleLine({ label: 'feet', vals: [1, 2, 3, 7] }, { label: 'inches', vals: [12, 24, 36, 84] }, { title: '1 foot = 12 inches', mark: 3, caption: '7 feet is 7 × 12 = 84 inches.' }),
    },
    {
      kind: 'concept',
      head: 'Line plots: one X per measurement',
      body: 'A line plot shows how many times each measurement happened. Each X (or dot) is one thing measured. Count them to answer questions.',
      art: dotPlot(['1/4', '1/2', '3/4', '1'], [3, 2, 4, 1], { title: 'Water left in each bottle (cups)', unit: 'cups', caption: 'Three bottles had 1/4 cup left.' }),
    },
    {
      kind: 'example',
      head: 'Volume: 6 × 3 × 2',
      body: 'One layer: 6 × 3 = 18 cubes.\nTwo layers: 18 × 2 = 36.\nThe volume is 36 cubic inches.',
      steps: { steps: [{ tex: '6 \\times 3 = 18', text: 'Cubes in one layer.' }, { tex: '18 \\times 2 = 36', text: 'Stack two layers.' }], answer: '36 \\text{ in}^3' },
    },
    {
      kind: 'example',
      head: 'Liters to milliliters: 2.5 L',
      body: '1 liter is 1,000 milliliters.\nMultiply 2.5 by 1,000.\nThat is 2,500 mL.',
      steps: { steps: [{ tex: '1 \\text{ L} = 1{,}000 \\text{ mL}', text: 'Bigger unit to smaller: multiply.' }, { tex: '2.5 \\times 1{,}000 = 2{,}500', text: 'Slide three places left.' }], answer: '2{,}500 \\text{ mL}' },
    },
    {
      kind: 'example',
      head: 'Feet to inches: 7 feet',
      body: 'A foot is 12 inches, so multiply. 7 × 12 = 84. The shelf is 84 inches tall.',
      formula: { tex: '7 \\text{ ft} \\times 12 = 84 \\text{ in}', note: 'More of the smaller unit.', parts: [{ sym: '12', means: 'inches in one foot', tone: 'accent' }, { sym: '84', means: 'inches in seven feet', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Another way: volume by layers',
      body: 'Instead of one big multiplication, count layers. A 5 × 4 × 3 box has layers of 5 × 4 = 20 cubes. Three layers: 20 + 20 + 20 = 60.',
      table: { head: ['Layer', 'Cubes', 'Running total'], rows: [['1', '20', '20'], ['2', '20', '40'], ['3', '20', '60']], mark: 2, note: 'Same as 5 × 4 × 3 = 60.' },
    },
    {
      kind: 'example',
      head: 'Line plot: total water',
      body: 'The line plot has 3 Xs at 1/4 cup. Those three bottles hold 3 × 1/4 = 3/4 cup of water in all.',
      formula: { tex: '3 \\times \\frac{1}{4} = \\frac{3}{4}', note: 'Three bottles, a quarter cup each.', parts: [{ sym: '3', means: 'Xs above 1/4 on the line plot', tone: 'accent' }, { sym: '\\frac{3}{4}', means: 'cups of water in those bottles', tone: 'ok' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a fish tank',
      body: 'A fish tank is 10 cm long, 5 cm wide, and 4 cm tall. Picture the bottom layer: 10 × 5 = 50 cubes. Four layers high: 200 cubic centimeters.',
      art: prism('10 cm', '5 cm', '4 cm', { inside: '200 cm³', layers: 4, title: 'Four layers of 50', caption: 'Bottom layer first, then stack.' }),
    },
    {
      kind: 'protip',
      head: 'More or fewer of the new unit?',
      body: 'Small units are like small steps: you need more of them. Going to a smaller unit, the number gets bigger, so multiply. Going to a bigger unit, divide.',
      art: flow([{ label: 'To a smaller unit: multiply', color: EMR }, { label: 'To a bigger unit: divide', color: ROSE }, { label: 'Check: does it make sense?', color: SKY }], { title: 'Which way to convert', horizontal: false, caption: '84 inches sounds right for a tall shelf; 0.6 inches does not.' }),
    },
    {
      kind: 'trap',
      head: 'Do not divide when you should multiply',
      body: '7 feet is 84 inches, not 7 ÷ 12. Inches are smaller than feet, so you need MORE of them.',
      compare: { cols: [{ title: 'Divided', tex: '7 \\div 12 \\approx 0.6', lines: ['A shelf shorter than an inch?'], tone: 'bad' }, { title: 'Multiplied', tex: '7 \\times 12 = 84', lines: ['Many small inches'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: two boxes together',
      body: 'A big box is 4 × 3 × 2 and a small box is 2 × 2 × 2. They are glued together. What is the total volume?',
      steps: { steps: [{ tex: '4 \\times 3 \\times 2 = 24', text: 'Volume of the big box.' }, { tex: '2 \\times 2 \\times 2 = 8', text: 'Volume of the small box.' }, { tex: '24 + 8 = 32', text: 'Add them together.' }], answer: '32 \\text{ cubic units}' },
    },
    {
      kind: 'summary',
      head: 'Measurement, wrapped up',
      body: 'Volume is length × width × height: count a layer, then stack. Converting to a smaller unit means multiply. On a line plot, each X is one measurement.',
      table: { head: ['Fact', 'Use it'], rows: [['V = l × w × h', 'volume of a box'], ['1 ft = 12 in', 'feet to inches'], ['1 L = 1,000 mL', 'liters to milliliters'], ['1 m = 100 cm', 'meters to centimeters']] },
    },
  ],

  // ---------------- 5.F-16 — Coordinate plane & classifying shapes ----------------
  '5.F-16': [
    {
      kind: 'objective',
      head: 'Across, then up',
      body: 'The point (2, 5) is 2 steps across and 5 steps up from the origin. Points tell stories on graphs, and shapes belong to families. Today you will plot points and sort shapes.',
      art: plotGrid([{ x: 2, y: 5, label: '(2, 5)', color: ROSE }, { x: 6, y: 0, label: '(6, 0)', color: SKY }], { range: { x: [0, 8], y: [0, 7] }, title: 'Run across, then jump up', caption: 'The first number is always across; the second is up.' }),
    },
    {
      kind: 'concept',
      head: 'Reading a point',
      body: 'Start at the origin, (0, 0). The first number, x, tells you how far ACROSS. The second number, y, tells you how far UP.',
      formula: { tex: '(x,\\ y)', note: 'Across first, then up.', parts: [{ sym: 'x', means: 'steps across from the origin', tone: 'accent' }, { sym: 'y', means: 'steps up from the origin', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Naming triangles',
      body: 'Name a triangle by its angles: right (one 90° angle), acute (all small), or obtuse (one big angle). Name it by its sides: equilateral (3 equal), isosceles (2 equal), or scalene (none equal).',
      art: triangle({ A: '45°', B: '45°', C: '90°', shape: [[100, 210], [300, 210], [200, 110]], a: 'equal', b: 'equal', title: 'Right and isosceles', caption: 'One right angle, and two equal sides.' }),
    },
    {
      kind: 'concept',
      head: 'Shape families',
      body: 'A square has 4 equal sides AND 4 right angles. So it is a rectangle and a rhombus too. But a rectangle does not have to be a square.',
      art: flow([{ label: 'quadrilateral: 4 sides', color: SKY }, { label: 'parallelogram: 2 pairs parallel', color: AMB }, { label: 'rectangle or rhombus', color: EMR }, { label: 'square: both at once', color: ROSE }], { title: 'Each shape is a kind of the one above', horizontal: false, caption: 'A square belongs to every family above it.' }),
    },
    {
      kind: 'example',
      head: 'Walk 6 right, 0 up',
      body: 'Across 6, so x = 6.\nUp 0, so y = 0.\nThe point is (6, 0), on the x-axis.',
      steps: { steps: [{ tex: 'x = 6', text: 'Six steps across.' }, { tex: 'y = 0', text: 'No steps up.' }], answer: '(6,\\ 0)' },
    },
    {
      kind: 'example',
      head: 'A point that tells a story: (3, 12)',
      body: 'On a graph of hours (x) and miles (y), the point (3, 12) means after 3 hours, 12 miles were walked.',
      art: plotGrid([{ x: 1, y: 4 }, { x: 2, y: 8 }, { x: 3, y: 12, label: '(3, 12)', color: ROSE }], { join: true, range: { x: [0, 5], y: [0, 16] }, xLabel: 'hours', yLabel: 'miles', title: '3 hours, 12 miles', caption: 'Each point is one moment of the walk.' }),
    },
    {
      kind: 'example',
      head: 'Name it: 90°, 45°, 45°',
      body: 'One angle is 90°, so it is a right triangle.\nTwo angles are equal, so two sides are equal: isosceles.\nIt is a right isosceles triangle.',
      steps: { steps: [{ tex: '90^\\circ', text: 'One right angle: a right triangle.' }, { tex: '45^\\circ = 45^\\circ', text: 'Two equal angles: isosceles.' }], answer: '\\text{right isosceles}' },
    },
    {
      kind: 'example',
      head: 'Another way: check with a list',
      body: 'Is every square a rectangle? Check the rectangle rules: 4 sides, 4 right angles. A square has both, so yes. Is every rectangle a square? It might not have equal sides, so no.',
      table: { head: ['Rule', 'Square', 'Rectangle'], rows: [['4 right angles', 'yes', 'yes'], ['4 equal sides', 'yes', 'not always']], note: 'Squares pass every rectangle rule.' },
    },
    {
      kind: 'example',
      head: 'Order matters: (3, 12) vs (12, 3)',
      body: '(3, 12) is 3 across and 12 up. (12, 3) is 12 across and only 3 up. They are completely different points.',
      formula: { tex: '(3,\\ 12) \\neq (12,\\ 3)', note: 'Swapping the numbers moves the point.', parts: [{ sym: '(3,\\ 12)', means: 'a little across, a lot up', tone: 'accent' }, { sym: '(12,\\ 3)', means: 'a lot across, a little up', tone: 'warn' }] },
    },
    {
      kind: 'example',
      head: 'Picture it first: a treasure map',
      body: 'The treasure is 4 steps east and 3 steps north of the old tree at the origin. Draw the grid, run 4 across, jump 3 up: the treasure is at (4, 3).',
      art: plotGrid([{ x: 0, y: 0, label: 'tree', color: EMR }, { x: 4, y: 3, label: '(4, 3)', color: AMB }], { range: { x: [0, 7], y: [0, 6] }, title: 'East 4, north 3', caption: 'East is across (x); north is up (y).' }),
    },
    {
      kind: 'protip',
      head: 'Run before you jump',
      body: 'Remember: you have to RUN across before you can JUMP up. x comes first, y comes second — just like in the alphabet.',
      formula: { tex: '(\\text{run},\\ \\text{jump}) = (x,\\ y)', note: 'Alphabetical order: x before y.', parts: [{ sym: '\\text{run}', means: 'across first: x', tone: 'accent' }, { sym: '\\text{jump}', means: 'then up: y', tone: 'ok' }] },
    },
    {
      kind: 'trap',
      head: 'Do not swap the numbers',
      body: 'Plotting (2, 5) by going up 2 and across 5 lands on (5, 2) instead. Always go across first.',
      compare: { cols: [{ title: 'Up first', lines: ['Lands on (5, 2)'], tone: 'bad' }, { title: 'Across first', lines: ['Lands on (2, 5)'], tone: 'ok' }] },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: the missing corner',
      body: 'A rectangle has corners at (1, 1), (5, 1), and (5, 4). Where is the fourth corner?',
      steps: { steps: [{ tex: 'x = 1', text: 'Same across as (1, 1).' }, { tex: 'y = 4', text: 'Same up as (5, 4).' }], answer: '(1,\\ 4)' },
    },
    {
      kind: 'summary',
      head: 'Coordinates and shapes, wrapped up',
      body: 'A point (x, y) is x across, then y up from the origin. Name triangles by angles and sides. Shapes belong to families: every square is also a rectangle and a rhombus.',
      table: { head: ['Name', 'Means'], rows: [['right triangle', 'one 90° angle'], ['isosceles', 'two equal sides'], ['equilateral', 'three equal sides'], ['square', '4 equal sides, 4 right angles']] },
    },
  ],
};
