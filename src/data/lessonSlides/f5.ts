import type { SlideBank } from './types';
import { AMB, EMR, INK, ROSE, SKY, VIO, W, areaModel, art, beats, callout, dotPlot, flow, fractionBar, line, numberLine, plotGrid, shapeBox, tape, text } from '../slideArt';

// 5.F — Grade-5 Foundations. 12–14 slides per lesson, ~3 short sentences each,
// written for a 10–12-year-old: objective → concepts → simplest-to-fuller
// examples → pro tip → trap(s) → summary.
export const F5_SLIDES: SlideBank = {
  '5.F-1': [
    {
      kind: 'objective',
      head: 'Big numbers, no fear',
      body: 'Today you will read place value like a pro. Then you will multiply and divide BIG numbers by breaking them into easy chunks. No calculator needed!',
      art: flow([{ label: 'Line up by place value', color: SKY }, { label: 'Work one column at a time', color: AMB }, { label: 'Carry or borrow as needed', color: EMR }], { title: 'Big-number arithmetic' }),
    },
    {
      kind: 'concept',
      head: 'Every place is worth 10× more',
      body: 'In a number, each place is 10 times the place to its right. Ones, tens, hundreds, thousands — each step left multiplies by 10. So the 7 in 47,283 is not just 7 — it is 7 THOUSAND.',
      formula: { tex: '\\ldots,\\ 1000,\\ 100,\\ 10,\\ 1', note: 'Each step left multiplies the place value by ten.', parts: [{ sym: '\\times 10', means: 'what each step to the left is worth', tone: 'accent' }, { sym: '\\text{digit}', means: 'means nothing until you know its place', tone: 'ok' }] },
      art: tape([
          { label: 'ones', boxes: 1, each: '1', color: SKY },
          { label: 'tens', boxes: 1, each: '10', color: EMR },
          { label: 'hundreds', boxes: 1, each: '100', color: AMB },
        ], { title: 'each step left is ten times bigger', caption: 'Move one place to the left and the digit is worth ten times as much.' }),
      table: {
        head: ['place', 'worth', '4 there means'],
        rows: [['ones', '1', '4'], ['tens', '10', '40'], ['hundreds', '100', '400'], ['thousands', '1,000', '4,000']],
        mark: 2,
        note: 'The digit never changes. Only the seat it sits in changes what it is worth.',
      },
    },
    {
      kind: 'concept',
      head: 'Multiplying big? Break it apart',
      body: 'You never have to multiply a big number all at once. Split one number into tens and ones: 38 × 27 becomes 38 × 20 plus 38 × 7. Do two easy multiplications, then add the pieces.',
      formula: { tex: '24 \\times 13 = 24(10) + 24(3)', note: 'Split the awkward number into friendly pieces, then add.', parts: [{ sym: '24(10)', means: 'the easy tens piece', tone: 'accent' }, { sym: '24(3)', means: 'the leftover piece, added on', tone: 'ok' }] },
      art: areaModel(
        [{ label: '20', w: 2 }, { label: '4', w: 1 }],
        [{ label: '10', h: 2 }, { label: '3', h: 1 }],
        [['200', '40'], ['60', '12']],
        { title: '24 × 13, cut into four easy pieces', total: '200 + 40 + 60 + 12 = 312', caption: 'A hard multiplication becomes four easy ones you can do in your head.' },
      ),
    },
    {
      kind: 'concept',
      head: 'Dividing big? Peel off easy chunks',
      body: 'Division is just asking "how many fit?" Peel off friendly chunks: for 504 ÷ 8, first take 480 ÷ 8 = 60. Then the leftover 24 ÷ 8 = 3, so the answer is 63.',
      formula: { tex: '432 \\div 6 = (420 + 12) \\div 6', note: 'Peel off a chunk you can divide in your head, then handle the rest.', parts: [{ sym: '420 \\div 6 = 70', means: 'a friendly chunk taken off first', tone: 'accent' }, { sym: '12 \\div 6 = 2', means: 'the small remainder, done separately', tone: 'ok' }] },
      steps: {
        steps: [
          { tex: '432 \\div 6', text: 'Too big to know straight off.' },
          { tex: '420 \\div 6 = 70', text: 'Peel off a friendly chunk first.' },
          { tex: '12 \\div 6 = 2', text: 'Then finish what is left.' },
          { tex: '70 + 2', text: 'Add the two answers.' },
        ],
        answer: '72',
      },
    },
    {
      kind: 'example',
      head: 'Start simple: the value of a digit',
      body: 'What is the 5 worth in 4,562?\nCount the places from the right: 2 ones, 6 tens, 5 hundreds. The 5 sits in the hundreds place. So it is worth 5 × 100 = 500.',
      table: {
        head: ['digit', 'place', 'value'],
        rows: [['3', 'thousands', '3,000'], ['4', 'hundreds', '400'], ['7', 'tens', '70'], ['2', 'ones', '2'],],
        mark: 1,
        note: 'Read the seat, not just the digit — a 4 in the hundreds seat is worth 400.',
      },
    },
    {
      kind: 'example',
      head: 'One more digit: 28,514',
      body: 'What is the 8 worth in 28,514?\nPlaces from the right: 4 ones, 1 ten, 5 hundreds, 8 thousands. The 8 is in the thousands place. Its value is 8 × 1,000 = 8,000.',
      steps: { steps: [{ tex: '\\text{the } 8 \\text{ sits in thousands}', text: 'Find which place the digit occupies.' }, { tex: '8 \\times 1000 = 8000', text: 'Its value is the digit times the place.' }], answer: '8000' },
    },
    {
      kind: 'example',
      head: 'Easy multiply: 60 × 40',
      body: 'Multiply the front digits first: 6 × 4 = 24. Now attach the zeros you set aside — one from 60 and one from 40. That gives 2,400. Zeros ride along for free!',
      steps: {
        steps: [
          { tex: '6 \\times 4 = 24', text: 'Do the easy part first.' },
          { tex: '60 \\times 40', text: 'There are two zeros in total.' },
          { tex: '24 \\text{ then } 00', text: 'Stick them on the end.' },
        ],
        answer: '2400',
      },
    },
    {
      kind: 'example',
      head: 'Bigger multiply: 24 × 13',
      body: 'Break 13 into 10 + 3. First: 24 × 10 = 240. Then: 24 × 3 = 72. Add the pieces: 240 + 72 = 312.',
      steps: {
        steps: [
          { tex: '20 \\times 10 = 200', text: 'Big piece times big piece.' },
          { tex: '20 \\times 3 = 60', text: 'Big times small.' },
          { tex: '4 \\times 10 = 40', text: 'Small times big.' },
          { tex: '4 \\times 3 = 12', text: 'Small times small — now add all four.' },
        ],
        answer: '312',
      },
    },
    {
      kind: 'example',
      head: 'Divide in chunks: 432 ÷ 6',
      body: 'Look for a friendly chunk: 6 × 70 = 420, which is close to 432. The leftover is 432 − 420 = 12, and 12 ÷ 6 = 2. Stack the chunks: 70 + 2 = 72.',
      steps: { steps: [{ tex: '420 \\div 6 = 70', text: 'Peel off a friendly chunk.' }, { tex: '12 \\div 6 = 2', text: 'Divide what is left.' }, { tex: '70 + 2 = 72', text: 'Add the two pieces.' }], answer: '72' },
    },
    {
      kind: 'example',
      head: 'Another way: split the other number',
      body: 'Multiply 24 × 13 by breaking apart 24 instead of 13.\n20 × 13 = 260 and 4 × 13 = 52. Add them: 260 + 52 = 312 — same answer, different split.',
      steps: { steps: [{ tex: '13 = 10 + 3', text: 'Split the smaller factor instead.' }, { tex: '24(10) + 24(3) = 312', text: 'Multiply each piece, then add.' }], answer: '312' },
    },
    {
      kind: 'protip',
      head: 'Estimate first, always',
      body: 'Before you compute, round and guess: 24 × 13 is close to 24 × 10 = 240, so the real answer should be a bit more. If your final answer is wildly different from your estimate, you know to re-check. Great mathematicians estimate FIRST.',
      compare: {
        cols: [
          { title: 'Rough guess', tex: '25 \\times 10 = 250', lines: ['Round both numbers', 'Takes two seconds'], tone: 'accent' },
          { title: 'Real answer', tex: '312', lines: ['Close to the guess', 'So it is believable'], tone: 'ok' },
        ],
        note: 'If your answer is nowhere near your guess, you dropped a piece somewhere.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: reading the digit alone',
      body: 'The 5 in 4,562 is NOT worth 5. A digit\'s value depends on its PLACE — that 5 is worth 500. Always ask "what place is it in?" before you answer.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '4 \\text{ means } 4', lines: ['Ignores the seat', 'Off by a hundred'], tone: 'bad' },
          { title: 'Right', tex: '4 \\text{ in hundreds} = 400', lines: ['Seat decides the worth', 'Read the column'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: forgetting a piece',
      body: 'When you split 24 × 13 into 24 × 10 and 24 × 3, you must ADD BOTH pieces. Stopping at 240 is the most common mistake. Break apart, multiply each piece, then add them all.',
      compare: { cols: [{ title: 'Both pieces', tex: '240 + 72', lines: ['24×10 and 24×3', 'Total 312'], tone: 'ok' }, { title: 'One piece', tex: '240', lines: ['The 24×3 was dropped', 'Answer far too small'], tone: 'bad' }], note: 'Splitting only helps if you add every piece back.' },
    },
    { kind: 'challenge', head: 'Extra credit: fill the theater', body: 'A theater has 18 rows with 15 seats each. How many seats in all?\nBreak 15 into 10 + 5: 18 × 10 = 180 and 18 × 5 = 90. Total: 180 + 90 = 270 seats.' },
    {
      kind: 'summary',
      head: 'You\'ve got big numbers handled',
      body: 'Place value: each spot is worth 10× the one to its right. Multiply by breaking numbers into tens and ones, then adding the pieces. Divide by peeling off easy chunks. Estimate first to catch mistakes!',
      art: flow([
          { label: 'round it — guess first' },
          { label: 'break it into easy pieces' },
          { label: 'do each piece' },
          { label: 'add the pieces back up' },
        ], { title: 'the big-number routine', caption: 'The same four moves work for multiplying and for dividing.' }),
    },
  ],
  '5.F-2': [
    {
      kind: 'objective',
      head: 'Adding fractions that don\'t match',
      body: 'Today you will add and subtract fractions — even when the bottoms (denominators) are different. The whole secret is making the pieces the same size first.',
      art: flow([{ label: 'Find a common denominator', color: SKY }, { label: 'Rename both fractions', color: AMB }, { label: 'Add the numerators only', color: EMR }], { title: 'Adding unlike fractions' }),
    },
    {
      kind: 'concept',
      head: 'Only same-size pieces combine',
      body: 'You can\'t add 1 slice of a pizza cut in halves to 1 slice cut in thirds — the pieces are different sizes! Fractions work the same way. You may only add or subtract when the denominators MATCH.',
      formula: { tex: '\\tfrac{1}{2} + \\tfrac{1}{3} \\ne \\tfrac{2}{5}', note: 'Halves and thirds are different-sized pieces. Rename before adding.', parts: [{ sym: '\\text{halves}', means: 'bigger pieces, two to a whole', tone: 'accent' }, { sym: '\\text{thirds}', means: 'smaller pieces, three to a whole', tone: 'ok' }] },
      art: fractionBar(2, 1, { label: '1/2', second: { parts: 3, shaded: 1, label: '1/3' }, title: 'halves and thirds are different sizes', caption: 'You cannot add these tops — the pieces are not the same size yet.' }),
    },
    {
      kind: 'concept',
      head: 'Make a common denominator',
      body: 'Rewrite each fraction so both have the same bottom number. Pick a number both denominators divide into — often their least common multiple. For 2 and 3, that number is 6.',
      art: fractionBar(6, 3, { label: '3/6 (was 1/2)', second: { parts: 6, shaded: 2, label: '2/6 (was 1/3)' }, title: 'cut both into sixths', caption: 'Now every piece is the same size, so the tops can be added.' }),
      formula: {
        tex: '\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}',
        note: 'Rename both fractions so they share a bottom, then add the tops.',
      },
    },
    {
      kind: 'concept',
      head: 'Then add just the tops',
      body: 'Once the bottoms match, the pieces are the same size. Add or subtract ONLY the numerators — the denominator stays put. Finish by simplifying if you can.',
      formula: {
        tex: '\\frac{a}{d} + \\frac{b}{d} = \\frac{a + b}{d}',
        note: 'The bottom says what SIZE the pieces are — it does not change when you add.',
        parts: [
          { sym: 'a + b', means: 'how many pieces you end up with', tone: 'ok' },
          { sym: 'd', means: 'the size of each piece — stays exactly as it was', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Warm-up: same bottoms already',
      body: '1/4 + 1/4 = ?\nThe pieces are already the same size (fourths). Add the tops: 1 + 1 = 2, so you get 2/4. Simplify: 2/4 = 1/2.',
      steps: { steps: [{ tex: '\\tfrac{1}{5} + \\tfrac{2}{5}', text: 'The pieces are already the same size.' }, { tex: '\\tfrac{3}{5}', text: 'Add the tops, keep the bottom.' }], answer: '\\tfrac{3}{5}' },
    },
    {
      kind: 'example',
      head: 'Subtract with same bottoms',
      body: '5/8 − 1/8 = ?\nEighths minus eighths — same size, so just subtract tops: 5 − 1 = 4. That gives 4/8. Simplify by dividing top and bottom by 4: 1/2.',
      steps: { steps: [{ tex: '\\tfrac{4}{7} - \\tfrac{1}{7}', text: 'Same-size pieces, so subtract directly.' }, { tex: '\\tfrac{3}{7}', text: 'Take the tops, keep the bottom.' }], answer: '\\tfrac{3}{7}' },
    },
    {
      kind: 'example',
      head: 'Different bottoms: 1/2 + 1/3',
      body: 'Halves and thirds are different sizes, so rewrite both in sixths. 1/2 = 3/6 and 1/3 = 2/6. Now add the tops: 3/6 + 2/6 = 5/6.',
      steps: {
        steps: [
          { tex: '2 \\times 3 = 6', text: 'Find a bottom both can become.' },
          { tex: '\\frac{1}{2} = \\frac{3}{6}', text: 'Multiply top and bottom by 3.' },
          { tex: '\\frac{1}{3} = \\frac{2}{6}', text: 'Multiply top and bottom by 2.' },
          { tex: '\\frac{3}{6} + \\frac{2}{6}', text: 'Same size now — add the tops.' },
        ],
        answer: '\\frac{5}{6}',
      },
    },
    {
      kind: 'example',
      head: 'Subtract: 3/4 − 1/2',
      body: 'Rewrite 1/2 as fourths: 1/2 = 2/4. Now both are fourths: 3/4 − 2/4. Subtract tops: 3 − 2 = 1, so the answer is 1/4.',
      steps: { steps: [{ tex: '\\tfrac{1}{2} = \\tfrac{2}{4}', text: 'Rename so both are quarters.' }, { tex: '\\tfrac{3}{4} - \\tfrac{2}{4} = \\tfrac{1}{4}', text: 'Now subtract the tops.' }], answer: '\\tfrac{1}{4}' },
    },
    {
      kind: 'example',
      head: 'Answer bigger than 1: 2/3 + 3/4',
      body: 'The common denominator of 3 and 4 is 12. Rewrite: 2/3 = 8/12 and 3/4 = 9/12. Add: 8/12 + 9/12 = 17/12, which is 1 whole and 5/12 — written 1 5/12.',
      steps: {
        steps: [
          { tex: '\\frac{2}{3} = \\frac{8}{12}', text: 'Twelfths work for both.' },
          { tex: '\\frac{3}{4} = \\frac{9}{12}', text: 'Rename the second one too.' },
          { tex: '\\frac{8 + 9}{12} = \\frac{17}{12}', text: 'Add the tops.' },
          { tex: '\\frac{17}{12} = 1\\frac{5}{12}', text: 'Twelve twelfths make one whole.' },
        ],
        answer: '1\\frac{5}{12}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: list the multiples',
      body: 'Add 1/4 + 1/6 by listing multiples instead of multiplying denominators.\nMultiples of 4: 4, 8, 12; of 6: 6, 12. The first shared one is 12. So 3/12 + 2/12 = 5/12.',
      table: {
        head: ['×', '3', '4'],
        rows: [['1', '3', '4'], ['2', '6', '8'], ['3', '9', '12'], ['4', '12', '16']],
        mark: 3,
        note: 'Walk down both lists until a number appears in each — 12 is the first match.',
      },
    },
    {
      kind: 'protip',
      head: 'Multiply the bottoms in a pinch',
      body: 'Can\'t spot the least common multiple? Just multiply the two denominators — it ALWAYS works as a common denominator. For 1/2 + 1/3 that gives sixths right away. You might simplify at the end, and that\'s fine.',
      steps: { steps: [{ tex: '\\tfrac{1}{3} + \\tfrac{1}{4}', text: 'No obvious common denominator.' }, { tex: '3 \\times 4 = 12', text: 'Multiplying the bottoms always works.' }, { tex: '\\tfrac{4}{12} + \\tfrac{3}{12} = \\tfrac{7}{12}', text: 'Rename both, then add.' }], answer: '\\tfrac{7}{12}' },
    },
    {
      kind: 'trap',
      head: 'Trap: adding the bottoms',
      body: '1/2 + 1/3 is NOT 2/5! Never add denominators — they tell you the SIZE of the pieces, not how many you have. Make the sizes match first, then add only the tops.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\frac{1}{2} + \\frac{1}{3} = \\frac{2}{5}', lines: ['Adds the bottoms too', '2/5 is SMALLER than 1/2'], tone: 'bad' },
          { title: 'Right', tex: '\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}', lines: ['Bottom stays', 'Bigger than either piece'], tone: 'ok' },
        ],
        note: 'Adding two positive things must make something bigger. If it did not, check the bottom.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: three fractions', body: 'What is 1/2 + 1/3 + 1/4?\nUse 12 as the common denominator: 6/12 + 4/12 + 3/12 = 13/12. That is 1 whole and 1/12, so 1 1/12.' },
    {
      kind: 'summary',
      head: 'Same size, then combine',
      body: 'Fractions only add or subtract when the denominators match. Rewrite with a common denominator, combine the numerators, and simplify. That one habit makes every fraction problem doable.',
      art: flow([
          { label: 'are the bottoms the same?' },
          { label: 'no — rename both to match' },
          { label: 'add or subtract the tops' },
          { label: 'simplify if you can' },
        ], { title: 'the fraction routine', caption: 'Four steps, in this order, every single time.' }),
    },
  ],
  '5.F-3': [
    {
      kind: 'objective',
      head: 'Multiply & divide fractions',
      body: 'Today you will multiply fractions straight across, use "of" as multiply, and divide by asking "how many fit?". These three moves unlock a huge amount of math.',
      art: flow([{ label: 'Multiply straight across', color: SKY }, { label: 'To divide, flip the second', color: AMB }, { label: 'Simplify at the end', color: EMR }], { title: 'Fraction multiplication and division' }),
    },
    {
      kind: 'concept',
      head: 'Multiply straight across',
      body: 'To multiply two fractions, multiply the tops together and the bottoms together. 1/2 × 1/4: tops 1 × 1 = 1, bottoms 2 × 4 = 8. Then simplify if you can.',
      formula: {
        tex: '\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}',
        note: 'Tops with tops, bottoms with bottoms. No common denominator needed.',
      },
      art: areaModel(
        [{ label: '1/2 across', w: 1 }, { label: '', w: 1 }],
        [{ label: '1/4 down', h: 1 }, { label: '', h: 3 }],
        [['1/8', ''], ['', '']],
        { title: 'half of a quarter', total: '\\u00bd \\u00d7 \\u00bc = 1/8', caption: 'The shaded overlap is one piece out of eight.' },
      ),
    },
    {
      kind: 'concept',
      head: '"Of" means multiply',
      body: 'When a question says "3/5 OF 40", that word "of" means multiply: 3/5 × 40. Finding a fraction of something is always multiplication. This shows up in shopping, recipes, and games constantly.',
      formula: {
        tex: '\\tfrac{2}{3} \\text{ of } 12 = \\tfrac{2}{3} \\times 12 = 8',
        note: 'Whenever you hear "of" in a fraction question, write a times sign.',
      },
      art: tape([{ label: '12 total', boxes: 3, each: '4', color: SKY }], { title: 'split 12 into 3 equal parts, take 2', caption: 'Each third is 4, so two thirds is 8.' }),
    },
    {
      kind: 'concept',
      head: 'Dividing asks "how many fit?"',
      body: '4 ÷ 1/3 asks: how many thirds fit inside 4 wholes? Each whole holds 3 thirds, so 4 wholes hold 4 × 3 = 12. Dividing by a fraction usually makes the answer BIGGER.',
      formula: { tex: 'a \\div \\tfrac{1}{n} = a \\times n', note: 'Dividing by a small piece gives a BIG answer — how many fit inside.', parts: [{ sym: '\\tfrac{1}{n}', means: 'the small piece you are fitting in', tone: 'accent' }, { sym: '\\times n', means: 'flipping it is what makes the answer grow', tone: 'ok' }] },
      art: fractionBar(12, 12, { label: '6 wholes, each cut in half — 12 halves fit', title: '6 ÷ ½ asks how many halves fit in 6', caption: 'Dividing by a number smaller than 1 gives you MORE, not less.' }),
    },
    {
      kind: 'example',
      head: 'Simplest multiply: 1/2 × 1/4',
      body: 'Tops: 1 × 1 = 1. Bottoms: 2 × 4 = 8. Answer: 1/8 — half of a quarter is an eighth, like cutting a quarter-slice of toast in half.',
      steps: { steps: [{ tex: '\\tfrac{1 \\times 1}{2 \\times 4}', text: 'Multiply straight across.' }, { tex: '= \\tfrac{1}{8}', text: 'Tops together, bottoms together.' }], answer: '\\tfrac{1}{8}' },
    },
    {
      kind: 'example',
      head: 'Another: 1/3 × 1/2',
      body: 'Tops: 1 × 1 = 1. Bottoms: 3 × 2 = 6. So 1/3 × 1/2 = 1/6 — a third of a half is a sixth.',
      steps: { steps: [{ tex: '\\tfrac{1 \\times 1}{3 \\times 2}', text: 'Multiply across.' }, { tex: '= \\tfrac{1}{6}', text: 'A third of a half is a sixth.' }], answer: '\\tfrac{1}{6}' },
    },
    {
      kind: 'example',
      head: 'Fraction of a number: 2/3 of 12',
      body: 'First find 1/3 of 12: that\'s 12 ÷ 3 = 4. You want TWO thirds, so double it: 2 × 4 = 8. Divide by the bottom, multiply by the top!',
      steps: { steps: [{ tex: '\\text{"of"} \\to \\times', text: 'The word "of" means multiply.' }, { tex: '\\tfrac{2}{3} \\times 12 = \\tfrac{24}{3}', text: 'Multiply straight across.' }, { tex: '= 8', text: 'Simplify the result.' }], answer: '8' },
    },
    {
      kind: 'example',
      head: 'Divide: 6 ÷ 1/2',
      body: 'How many halves fit inside 6 wholes? Each whole holds 2 halves. So 6 × 2 = 12 halves fit. Notice the answer got bigger!',
      steps: {
        steps: [
          { tex: '6 \\div \\tfrac{1}{2}', text: 'Ask: how many halves fit into 6?' },
          { tex: '6 \\times \\tfrac{2}{1}', text: 'Flip the second fraction, then multiply.' },
        ],
        answer: '12',
      },
    },
    {
      kind: 'example',
      head: 'Divide: 3 ÷ 1/4',
      body: 'How many quarters fit in 3 wholes? Each whole holds 4 quarters, so 3 × 4 = 12. Twelve quarter-pieces fit inside 3 wholes.',
      steps: { steps: [{ tex: '3 \\times \\tfrac{4}{1}', text: 'Flip the second and multiply.' }, { tex: '= 12', text: 'Twelve quarters fit inside three.' }], answer: '12' },
    },
    { kind: 'example', head: 'Another way: multiply straight across', body: 'Find 2/3 of 12 without dividing first.\nMultiply the top: 2 × 12 = 24, then divide by the bottom: 24 ÷ 3 = 8. Same as 12 ÷ 3 × 2.' },
    {
      kind: 'protip',
      head: 'Flip and multiply',
      body: 'Dividing by a fraction = multiplying by its reciprocal (the flip). 6 ÷ 1/2 = 6 × 2/1 = 12. Flip the SECOND fraction only, then multiply straight across.',
      formula: {
        tex: 'a \\div \\frac{c}{d} = a \\times \\frac{d}{c}',
        note: 'Turn the second fraction upside down and the division becomes a multiplication.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: expecting division to shrink',
      body: 'With whole numbers, dividing makes things smaller — but dividing BY a fraction makes them bigger! 6 ÷ 1/2 = 12, not 3. If you\'re splitting into pieces smaller than 1, MORE pieces fit.',
      compare: {
        cols: [
          { title: 'Divide by 2', tex: '6 \\div 2 = 3', lines: ['Smaller — as expected'], tone: 'accent' },
          { title: 'Divide by ½', tex: '6 \\div \\tfrac{1}{2} = 12', lines: ['BIGGER', 'Halves are small, so many fit'], tone: 'warn' },
        ],
        note: 'Dividing only shrinks when you divide by something bigger than 1.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: how many scoops', body: 'You have 2 1/2 cups of dough and each cookie needs 1/4 cup. How many cookies?\nAsk how many quarter-cups fit: 2 1/2 ÷ 1/4 = 10. You can make 10 cookies.' },
    {
      kind: 'summary',
      head: 'Three moves to remember',
      body: 'Multiply fractions straight across (tops × tops, bottoms × bottoms). "Of" means multiply. Divide by a fraction by flipping it and multiplying — the answer grows because small pieces fit many times.',
      art: flow([
          { label: 'multiply — straight across' },
          { label: '"of" — write a times sign' },
          { label: 'divide — flip, then multiply' },
        ], { title: 'the whole unit in three lines', caption: 'Everything else this unit is one of these three moves.' }),
    },
  ],
  '5.F-4': [
    {
      kind: 'objective',
      head: 'Decimals, decoded',
      body: 'Today you will compare, add, subtract, and multiply decimals. The secret weapon: line up the decimal points and give numbers the same number of places.',
      art: flow([{ label: 'Line up the points', color: SKY }, { label: 'Pad with zeros', color: AMB }, { label: 'Count places when multiplying', color: EMR }], { title: 'Decimals without the guesswork' }),
    },
    {
      kind: 'concept',
      head: 'Line up the points',
      body: 'To add or subtract decimals, stack them with the decimal points in a straight line. 2.5 is the same as 2.50 — you can add zeros on the right for free. Then add or subtract like normal numbers.',
      formula: { tex: '\\text{align the points, not the last digits}', note: 'The decimal point is the anchor everything lines up against.', parts: [{ sym: '\\text{point}', means: 'stacked in one column, top to bottom', tone: 'accent' }, { sym: '\\text{last digit}', means: 'lining these up instead is the classic slip', tone: 'bad' }] },
      art: (() => {
        let b = text(W / 2, 30, 'stack the points, not the ends', { size: 13, fill: VIO });
        b += text(210, 90, '0.20', { size: 22, anchor: 'end', fill: SKY });
        b += text(210, 126, '0.35', { size: 22, anchor: 'end', fill: EMR });
        b += line(96, 140, 216, 140, INK, 2.4);
        b += text(210, 172, '0.55', { size: 22, anchor: 'end', fill: AMB });
        b += beats(line(174, 66, 174, 190, ROSE, 2.2, '5 4'));
        b += callout(174, 200, 'points in one column', { dir: 'down', len: 18, color: ROSE, size: 11 });
        return art('Two decimals written one above the other with their decimal points in a single column', b,
          'Every place then sits over its own kind — tenths over tenths, hundredths over hundredths.');
      })(),
    },
    {
      kind: 'concept',
      head: 'Compare with equal places',
      body: 'Which is bigger, 0.5 or 0.45? Give both two places: 0.50 vs 0.45. Now it\'s obvious: 50 hundredths beats 45 hundredths.',
      formula: { tex: '0.5 = 0.50 > 0.45', note: 'Give both the same number of places and the bigger one is obvious.', parts: [{ sym: '0.50', means: 'fifty hundredths', tone: 'accent' }, { sym: '0.45', means: 'forty-five hundredths, so smaller', tone: 'ok' }] },
      art: fractionBar(10, 3, { label: '0.3', second: { parts: 10, shaded: 4, label: '0.4 is the bigger share' }, title: 'Same-size parts, easy comparison', caption: 'Give both numbers the same number of places and the bigger one is obvious.' }),
      table: {
        head: ['number', 'padded', 'so'],
        rows: [['0.7', '0.70', 'seventy hundredths'], ['0.65', '0.65', 'sixty-five hundredths'], ['', '', '0.7 is bigger']],
        mark: 2,
        note: 'Add zeros on the end until both have the same number of places — then just compare.',
      },
    },
    {
      kind: 'concept',
      head: 'Multiplying: count the places',
      body: 'Multiply decimals as if they were whole numbers, then place the point. Count the decimal places in both factors and give the answer that many. Tenths × tenths = hundredths.',
      formula: {
        tex: '0.5 \\times 0.8 = 0.40',
        note: 'Multiply as whole numbers (5 × 8 = 40), then put back as many places as went in.',
        parts: [
          { sym: '1 + 1', means: 'one place in each number, so two places in the answer', tone: 'accent' },
          { sym: '0.40', means: 'forty hundredths — which is the same as 0.4', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Add: 0.2 + 0.35',
      body: 'Give both two places: 0.20 + 0.35. Line up the points and add: 20 + 35 = 55 hundredths. Answer: 0.55.',
      steps: {
        steps: [
          { tex: '0.20 + 0.35', text: 'Pad the shorter one with a zero.' },
          { tex: '20 + 35 = 55', text: 'Now they are both hundredths.' },
        ],
        answer: '0.55',
      },
    },
    {
      kind: 'example',
      head: 'Add: 0.3 + 0.45',
      body: 'Write 0.3 as 0.30 so both have two places. 0.30 + 0.45 = 0.75. Lining up the points keeps tenths with tenths and hundredths with hundredths.',
      steps: { steps: [{ tex: '0.30 + 0.45', text: 'Pad the short one to two places.' }, { tex: '= 0.75', text: 'Add column by column.' }], answer: '0.75' },
    },
    {
      kind: 'example',
      head: 'Subtract: 2 − 0.85',
      body: 'Count UP from 0.85 instead of borrowing. From 0.85 to 1 is 0.15. From 1 to 2 is 1 more. Total: 1.15.',
      steps: {
        steps: [
          { tex: '2.00 - 0.85', text: 'Write 2 as 2.00 so the places line up.' },
          { tex: '200 - 85 = 115', text: 'Both are hundredths now.' },
        ],
        answer: '1.15',
      },
    },
    {
      kind: 'example',
      head: 'Multiply: 0.5 × 0.8',
      body: 'Ignore the points: 5 × 8 = 40. Count decimal places: one in 0.5, one in 0.8 — two total. Place the point two spots in: 0.40, which is 0.4.',
      steps: {
        steps: [
          { tex: '5 \\times 8 = 40', text: 'Ignore the points for a moment.' },
          { tex: '1 + 1 = 2 \\text{ places}', text: 'Count the decimal places that went in.' },
          { tex: '0.40', text: 'Put two places back.' },
        ],
        answer: '0.4',
      },
    },
    {
      kind: 'example',
      head: 'Multiply: 1.5 × 4',
      body: 'Break it apart: 1 × 4 = 4, and 0.5 × 4 = 2. Add the pieces: 4 + 2 = 6. A whole-number multiplier just scales each part.',
      steps: { steps: [{ tex: '15 \\times 4 = 60', text: 'Multiply as whole numbers.' }, { tex: '\\text{one place} \\to 6.0', text: 'Only one factor had a decimal place.' }], answer: '6' },
    },
    {
      kind: 'example',
      head: 'Another way: count the decimal places',
      body: 'Multiply 1.5 × 4 by ignoring the dot first.\n15 × 4 = 60. There is one digit after the decimal in the problem, so put it back: 6.0, which is 6.',
      table: { head: ['problem', 'places in', 'answer'], rows: [['0.5 × 0.8', '1 + 1 = 2', '0.40'], ['1.5 × 4', '1 + 0 = 1', '6.0'], ['0.3 × 0.7', '1 + 1 = 2', '0.21']], mark: 0, note: 'Count the places in the factors and the answer gets the same total.' },
    },
    {
      kind: 'protip',
      head: 'Money is decimals in disguise',
      body: 'Think of decimals as dollars and cents: 0.5 is 50 cents, 0.45 is 45 cents. Comparing or adding money feels natural — use that instinct on any decimal problem.',
      steps: { steps: [{ tex: '\\$2.35 = 235 \\text{ cents}', text: 'Think of the whole amount in cents.' }, { tex: '\\text{add as whole numbers}', text: 'Then put the point back at the end.' }] },
    },
    {
      kind: 'trap',
      head: 'Trap: "longer means bigger"',
      body: '0.45 has more digits than 0.5, but it is SMALLER. Length tells you nothing — place value does. Pad to equal places (0.50 vs 0.45) and then compare.',
      art: fractionBar(10, 5, { label: '0.5', second: { parts: 100, shaded: 45, label: '0.45 is smaller' }, title: 'More digits does not mean more', caption: '0.45 has more digits than 0.5, but shade them both and 0.5 clearly wins.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '0.65 > 0.7', lines: ['More digits, so bigger?', 'No'], tone: 'bad' },
          { title: 'Right', tex: '0.70 > 0.65', lines: ['Pad to equal places', 'Then compare'], tone: 'ok' },
        ],
        note: 'With whole numbers longer IS bigger. With decimals it is not — pad first.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: making change', body: 'You buy a $2.50 drink and a $1.75 snack with a $5 bill. How much change?\nAdd the cost: 2.50 + 1.75 = 4.25. Then 5.00 − 4.25 = $0.75 change.' },
    {
      kind: 'summary',
      head: 'Points lined up, places counted',
      body: 'Add and subtract with decimal points aligned (pad with zeros). Compare by giving equal places. Multiply as whole numbers, then count decimal places to set the point. Money sense is your friend!',
      compare: {
        cols: [
          { title: 'Adding', tex: '+ \\ \\text{or} \\ -', lines: ['LINE UP the points', 'Pad with zeros'], tone: 'accent' },
          { title: 'Multiplying', tex: '\\times', lines: ['Ignore the points', 'COUNT places at the end'], tone: 'ok' },
        ],
        note: 'Two different habits — mixing them up is where almost every mistake comes from.',
      },
    },
  ],
  '5.F-5': [
    {
      kind: 'objective',
      head: 'Convert units & measure space',
      body: 'Today you will convert between units (meters ↔ centimeters, feet ↔ inches) and find the volume of boxes. One rule decides multiply-or-divide every time.',
      art: flow([{ label: 'Recall the anchor', color: SKY }, { label: 'Multiply or divide', color: AMB }, { label: 'Volume needs three lengths', color: EMR }], { title: 'Units and volume' }),
    },
    {
      kind: 'concept',
      head: 'Big → small: multiply',
      body: 'Going from a bigger unit to a smaller one means MORE pieces, so multiply. 3 meters = 3 × 100 = 300 centimeters. One big thing becomes many small things.',
      formula: { tex: '\\text{small} = \\text{big} \\times \\text{rate}', note: 'Smaller units take more of them, so the number must grow.', parts: [{ sym: '\\text{rate}', means: 'the same anchor, used the other way', tone: 'accent' }, { sym: '\\times', means: 'because the count has to come out bigger', tone: 'ok' }] },
      art: flow([
          { label: '2 m', color: SKY },
          { label: '× 100', color: VIO },
          { label: '200 cm', color: EMR },
        ], { horizontal: true, title: 'bigger unit to smaller unit', caption: 'Smaller units means MORE of them, so the number grows.' }),
    },
    {
      kind: 'concept',
      head: 'Small → big: divide',
      body: 'Going from a smaller unit to a bigger one means FEWER pieces, so divide. 400 cm = 400 ÷ 100 = 4 meters. Many small things bundle into few big things.',
      formula: { tex: '\\text{big} = \\dfrac{\\text{small}}{\\text{rate}}', note: 'Bigger units take fewer of them, so the number must shrink.', parts: [{ sym: '\\text{rate}', means: 'how many small units make one big one', tone: 'accent' }, { sym: '\\div', means: 'because the count has to come out smaller', tone: 'ok' }] },
    },
    {
      kind: 'concept',
      head: 'Memorize the anchors',
      body: 'A few conversions unlock everything: 100 cm = 1 m, 1,000 g = 1 kg, 12 in = 1 ft, 4 qt = 1 gal, 60 min = 1 hr. Learn these five and you can convert almost anything.',
      art: flow([{ label: '1 m = 100 cm', color: SKY }, { label: '1 ft = 12 in', color: AMB }, { label: '1 quart = 4 cups', color: EMR }], { title: 'Three anchors do most jobs' }),
      table: {
        head: ['from', 'to', 'do this'],
        rows: [['1 m', 'cm', '× 100'], ['1 km', 'm', '× 1000'], ['1 ft', 'in', '× 12'], ['1 kg', 'g', '× 1000']],
        note: 'Learn these four and almost every conversion question is one multiplication.',
      },
    },
    {
      kind: 'concept',
      head: 'Volume = length × width × height',
      body: 'Volume measures how much SPACE fills a box, counted in little cubes. Multiply the three edge lengths: a 3 × 2 × 4 box holds 24 unit cubes. Volume answers are in CUBIC units.',
      formula: {
        tex: 'V = l \\times w \\times h',
        note: 'Three dimensions multiplied — which is why the answer is in CUBIC units.',
        parts: [
          { sym: 'l \\times w', means: 'the area of the base — one flat layer', tone: 'accent' },
          { sym: 'h', means: 'how many of those layers are stacked up', tone: 'ok' },
        ],
      },
      art: shapeBox('length 3', 'width 2', { wUnits: 3, hUnits: 2, grid: true, inside: '6 per layer', title: 'one layer of a 3 × 2 × 4 box', caption: 'Six cubes in a layer, four layers high — 24 cubes in all.' }),
    },
    {
      kind: 'example',
      head: 'Convert: 2 m to cm',
      body: 'Meters are bigger than centimeters, so multiply. 1 m = 100 cm. 2 × 100 = 200 cm.',
      steps: {
        steps: [
          { tex: '1 \\text{ m} = 100 \\text{ cm}', text: 'Start from the anchor you know.' },
          { tex: '2 \\times 100', text: 'Going to a smaller unit, so multiply.' },
        ],
        answer: '200 \\text{ cm}',
      },
    },
    {
      kind: 'example',
      head: 'Convert: 5 ft to inches',
      body: 'Feet are bigger than inches, so multiply. 1 ft = 12 in. 5 × 12 = 60 inches.',
      steps: { steps: [{ tex: '1 \\text{ ft} = 12 \\text{ in}', text: 'Recall the anchor.' }, { tex: '5 \\times 12 = 60', text: 'Smaller unit, so multiply.' }], answer: '60 \\text{ in}' },
    },
    {
      kind: 'example',
      head: 'Convert back: 400 cm to m',
      body: 'Centimeters are smaller than meters, so divide. 100 cm make 1 m. 400 ÷ 100 = 4 meters.',
      steps: { steps: [{ tex: '100 \\text{ cm} = 1 \\text{ m}', text: 'Recall the metric anchor.' }, { tex: '400 \\div 100 = 4', text: 'Bigger unit, so divide.' }], answer: '4 \\text{ m}' },
    },
    {
      kind: 'example',
      head: 'Volume of a 3 × 2 × 4 box',
      body: 'Multiply the edges one pair at a time: 3 × 2 = 6. Then 6 × 4 = 24. The box holds 24 cubic units.',
      steps: {
        steps: [
          { tex: '3 \\times 2 = 6', text: 'The base layer holds 6 cubes.' },
          { tex: '6 \\times 4 = 24', text: 'Stack four of those layers.' },
        ],
        answer: '24 \\text{ cubic units}',
      },
    },
    {
      kind: 'example',
      head: 'Volume of a cube, edge 3',
      body: 'A cube has equal edges, so volume = 3 × 3 × 3. That\'s 9 × 3 = 27. Answer: 27 cubic units.',
      steps: { steps: [{ tex: 'V = 3 \\times 3 \\times 3', text: 'Every edge of a cube matches.' }, { tex: '= 27', text: 'Multiply all three.' }], answer: '27' },
    },
    {
      kind: 'example',
      head: 'Another way: base area times height',
      body: 'Find the volume of a 3 × 2 × 4 box using layers.\nOne layer holds 3 × 2 = 6 cubes. There are 4 layers stacked up, so 6 × 4 = 24 cubic units.',
      steps: { steps: [{ tex: '\\text{base} = 3 \\times 2 = 6', text: 'Find the floor area first.' }, { tex: '6 \\times 4 = 24', text: 'Then stack the layers.' }], answer: '24' },
    },
    {
      kind: 'protip',
      head: 'Sanity-check the direction',
      body: 'After converting, ask: should my number be bigger or smaller? Converting 2 m to cm should give a BIGGER number (200) because centimeters are tiny. If the direction feels wrong, you multiplied when you should have divided.',
      compare: {
        cols: [
          { title: 'Big → small', tex: '\\times', lines: ['More of them', 'Number grows'], tone: 'ok' },
          { title: 'Small → big', tex: '\\div', lines: ['Fewer of them', 'Number shrinks'], tone: 'accent' },
        ],
        note: 'Ask "should this be more or fewer?" before you touch the calculator.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: volume vs area',
      body: 'Area covers a FLAT surface (2 lengths multiplied, square units). Volume fills a 3-D box (3 lengths, CUBIC units). If a question says "how much fits inside", it wants volume — don\'t stop after multiplying just two edges.',
      art: flow([{ label: 'Two lengths → square units', color: SKY }, { label: 'Three lengths → cubic units', color: EMR }, { label: 'Count what you multiplied', color: VIO }], { title: 'The units come from the multiplying' }),
      compare: {
        cols: [
          { title: 'Area', tex: 'l \\times w', lines: ['Two dimensions', 'Square units'], tone: 'accent' },
          { title: 'Volume', tex: 'l \\times w \\times h', lines: ['Three dimensions', 'Cubic units'], tone: 'ok' },
        ],
        note: 'Count the dimensions in the question: a floor is flat, a box is not.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: pack the crate', body: 'A crate holds 96 cubic feet. Each small box is 12 cubic feet. How many boxes fit?\nDivide the space: 96 ÷ 12 = 8. Exactly 8 boxes fit with no room left.' },
    {
      kind: 'summary',
      head: 'Direction and dimensions',
      body: 'Big unit → small unit: multiply. Small → big: divide. Keep the five anchor conversions memorized. Volume = length × width × height in cubic units. Always sanity-check which direction your number should move!',
      compare: { cols: [{ title: 'Converting', tex: '\\times \\text{ or } \\div', lines: ['Check the direction', 'Sense-check the size'], tone: 'accent' }, { title: 'Volume', tex: 'V = lwh', lines: ['Three lengths', 'Cubic units'], tone: 'ok' }], note: 'One asks which way; the other asks how many lengths.' },
    },
  ],
  '5.F-6': [
    {
      kind: 'objective',
      head: 'Points, patterns & plots',
      body: 'Today you will plot points on the coordinate plane, extend number patterns with a rule, and read line plots. Three skills, one theme: reading math pictures.',
      art: flow([{ label: 'Across first, then up', color: SKY }, { label: 'Find the jump rule', color: AMB }, { label: 'Every X on a plot counts', color: EMR }], { title: 'Reading the picture' }),
    },
    {
      kind: 'concept',
      head: 'Run before you jump',
      body: 'A point (x, y) gives two directions from the origin: go ACROSS x first, then UP y. Remember "run before you jump". (3, 2) means run 3, jump 2.',
      art: plotGrid([{ x: 3, y: 2, label: '(3, 2)', color: ROSE }], {
        range: { x: [0, 6], y: [0, 5] }, title: 'right 3, THEN up 2',
        caption: 'The first number is always the walk across. The second is the climb.',
      }),
      formula: {
        tex: '(x,\\ y)',
        parts: [
          { sym: 'x', means: 'how far you run ACROSS from the corner', tone: 'accent' },
          { sym: 'y', means: 'how far you climb UP after that', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Patterns have a jump rule',
      body: 'In a pattern like 0, 4, 8, 12 … each term jumps by the same amount (+4). The n-th term = start + jump × (n − 1). You can leap straight to term 100 without listing them all!',
      formula: { tex: '\\text{term}_n = \\text{start} + (n - 1) \\times \\text{jump}', note: 'Find the jump between neighbours, then leap ahead without listing.', parts: [{ sym: '\\text{jump}', means: 'the constant step between terms', tone: 'accent' }, { sym: 'n - 1', means: 'how many jumps you take from the first term', tone: 'warn' }] },
      art: numberLine(5, 25, [
          { at: 5, label: '5', color: SKY },
          { at: 10, label: '10', color: AMB },
          { at: 15, label: '15', color: AMB },
          { at: 20, label: '20', color: AMB },
          { at: 25, label: '25', color: EMR },
        ], { step: 5, title: 'the same jump, every time', caption: 'Find the jump once and you can keep going for ever.' }),
    },
    {
      kind: 'concept',
      head: 'Line plots: every X counts',
      body: 'A line plot stacks an X for each data value above a number line. Two Xs above 1/2 means two things measured 1/2. To answer questions, just count Xs.',
      formula: { tex: '\\text{total} = \\text{how many X marks}', note: 'Each X stands for one data point, so counting them gives the total.', parts: [{ sym: '\\text{one X}', means: 'one value in the data set', tone: 'accent' }, { sym: '\\text{stack}', means: 'how many times that value came up', tone: 'ok' }] },
      art: dotPlot(['1/4', '1/2', '3/4', '1'], [3, 4, 2, 1], {
        title: 'cups of water left', unit: 'cups', mark: 1,
        caption: 'Ten marks, so ten bottles were measured — count the dots, not the ticks.',
      }),
    },
    {
      kind: 'example',
      head: 'Plot a point: right 3, up 2',
      body: 'Start at the origin (0, 0). Run right 3 → x = 3. Jump up 2 → y = 2. The point is (3, 2).',
      steps: {
        steps: [
          { tex: '(3,\\ 2)', text: 'Start at the corner where the two lines meet.' },
          { tex: '\\text{right } 3', text: 'Run across first.' },
          { tex: '\\text{up } 2', text: 'Then climb.' },
        ],
      },
    },
    {
      kind: 'example',
      head: 'Name the point: right 4, up 2',
      body: 'Across first: x = 4. Up second: y = 2. Write it (x, y) = (4, 2). Order matters — (4, 2) and (2, 4) are DIFFERENT points!',
      steps: { steps: [{ tex: '\\text{across first}', text: 'Read the x-value before anything else.' }, { tex: '(4, 2)', text: 'Then the y-value, in that order.' }], answer: '(4, 2)' },
    },
    {
      kind: 'example',
      head: 'Extend a pattern: 5, 10, 15, …',
      body: 'Find the jump: 10 − 5 = 5, so each term adds 5. The next term after 15 is 15 + 5 = 20.',
      steps: {
        steps: [
          { tex: '10 - 5 = 5', text: 'Subtract neighbours to find the jump.' },
          { tex: '15 + 5 = 20', text: 'Keep adding the same jump.' },
        ],
        answer: '20,\\ 25,\\ 30',
      },
    },
    {
      kind: 'example',
      head: 'Leap ahead: 0, 4, 8 … term 5?',
      body: 'Start 0, jump +4. Term 5 makes four jumps from the start: 0 + 4 × 4 = 16. The rule start + jump × (n − 1) skips the counting.',
      table: {
        head: ['term', 'jumps so far', 'value'],
        rows: [['1', '0', '0'], ['2', '1', '4'], ['3', '2', '8'], ['4', '3', '12'], ['5', '4', '16']],
        mark: 4,
        note: 'Term 5 has taken only FOUR jumps — the first term needed none.',
      },
    },
    {
      kind: 'example',
      head: 'Read a line plot',
      body: 'A line plot shows 2 Xs above 1/2. Each X is one measured item. So 2 items measured exactly 1/2.',
      steps: { steps: [{ tex: '\\text{count the X marks}', text: 'Each X is one data value.' }, { tex: '\\text{tallest stack wins}', text: 'The tallest column is the most common value.' }] },
    },
    {
      kind: 'example',
      head: 'Another way: list the terms',
      body: 'Find the 5th term of the pattern 0, 4, 8, … by listing.\nKeep adding 4: 0, 4, 8, 12, 16. The 5th number in the list is 16 — no formula needed.',
      steps: { steps: [{ tex: '0, 4, 8, 12, 16', text: 'Write the terms out one by one.' }, { tex: '\\text{term } 5 = 16', text: 'Count along to the one you want.' }], answer: '16' },
    },
    { kind: 'protip', head: 'Check the jump twice', body: 'Before extending a pattern, compute the jump from TWO different pairs: 10 − 5 and 15 − 10. If both give the same jump, your rule is solid. Patterns with changing jumps need a different rule.' },
    {
      kind: 'trap',
      head: 'Trap: jumping before you run',
      body: 'The #1 coordinate mistake is going UP first. (3, 2) means across 3 THEN up 2 — not up 3. Say "run before you jump" every time you plot.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '(3,\\ 2) \\to \\text{up 3, right 2}', lines: ['Lands on (2, 3)', 'Different spot'], tone: 'bad' },
          { title: 'Right', tex: '(3,\\ 2) \\to \\text{right 3, up 2}', lines: ['Across comes first', 'Alphabetical: x then y'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: predict far ahead', body: 'A pattern follows the rule y = 2x: (1,2), (2,4), (3,6). What is y when x = 10?\nUse the rule instead of listing: y = 2 × 10 = 20.' },
    {
      kind: 'summary',
      head: 'Pictures you can read',
      body: 'Points: run x, then jump y. Patterns: find the constant jump, then use start + jump × (n − 1). Line plots: each X is one data value — count them. Math pictures answer questions fast once you know the code!',
      compare: {
        cols: [
          { title: 'Coordinates', tex: '(x,\\ y)', lines: ['Run, then jump'], tone: 'accent' },
          { title: 'Patterns', tex: '+ d', lines: ['Same jump each time'], tone: 'ok' },
          { title: 'Line plots', tex: '\\text{count}', lines: ['One mark per thing'], tone: 'warn' },
        ],
      },
    },
  ],
};
