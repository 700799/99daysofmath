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
      why: "We count in bundles of ten. Ten pennies make one dime, and ten dimes make one dollar. Numbers work the same way: ten ones make one ten, ten tens make one hundred. So each seat to the left holds bigger bundles, and the same digit is worth more there.",
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
      why: "Think of 13 bags with 24 candies in each. Ten of the bags hold 24 × 10 candies, and the other 3 bags hold 24 × 3 candies. Counting the bags in two piles changes nothing, so adding the two piles gives the same total as one big multiplication.",
    },
    {
      kind: 'concept',
      head: 'Dividing big? Peel off easy chunks',
      body: 'Division is just asking "how many fit?" Peel off friendly chunks: for 504 ÷ 8, first take 480 ÷ 8 = 60. Then the leftover 24 ÷ 8 = 3, so the answer is 63.',
      formula: { tex: '432 \\div 6 = (420 + 12) \\div 6', note: 'Peel off a chunk you can divide in your head, then handle the rest.', parts: [{ sym: '420 \\div 6 = 70', means: 'a friendly chunk taken off first', tone: 'accent' }, { sym: '12 \\div 6 = 2', means: 'the small remainder, done separately', tone: 'ok' }] },
      steps: {
        steps: [
          { tex: '432 \\div 6', text: 'This is too big to know straight away, so we will not try to do it in one jump. We will split it into easy pieces.' },
          { tex: '420 \\div 6 = 70', text: 'Peel off a friendly chunk. We know 6 × 7 = 42, so 6 × 70 = 420, and 420 divides by 6 easily.' },
          { tex: '12 \\div 6 = 2', text: 'The leftover is 432 − 420 = 12. That small piece is easy to divide, because 6 goes into 12 exactly two times.' },
          { tex: '70 + 2', text: 'Add the two answers. Seventy groups of 6 plus two more groups of 6 is the whole number of groups.' },
        ],
        answer: '72',
      },
      why: "Dividing 432 by 6 asks how many groups of 6 fit inside 432. You can count those groups in handfuls: 70 groups use up 420, and the 12 left over holds 2 more groups. All the handfuls together are the full answer, just like paying with big bills first and coins last.",
    },
    {
      kind: 'example',
      head: 'Start simple: the value of a digit',
      body: 'What is the 5 worth in 4,562? Find the seat the 5 sits in, then multiply the digit by what that seat is worth.',
      steps: {
        steps: [
          { tex: '4{,}562 \\to \\text{ones, tens, hundreds}', text: 'Count the seats from the right. The 2 is in the ones seat, the 6 is in the tens seat, and the 5 is in the hundreds seat.' },
          { tex: '\\text{hundreds seat} = 100', text: 'The hundreds seat is worth 100, because each seat to the left is worth ten times the seat before it.' },
          { tex: '5 \\times 100 = 500', text: 'Multiply the digit by the worth of its seat. Five groups of one hundred is 500, just like five 100-dollar bills.' },
        ],
        answer: '500',
      },
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
      body: 'What is the 8 worth in 28,514? Find its seat first, then use the worth of that seat.',
      steps: {
        steps: [
          { tex: '28{,}514 \\to 4,\\ 1,\\ 5,\\ 8,\\ 2', text: 'Count seats from the right: 4 is ones, 1 is tens, 5 is hundreds, and 8 is in the thousands seat.' },
          { tex: '\\text{thousands seat} = 1000', text: 'The thousands seat is worth 1,000. That is ten hundreds, and each seat to the left is ten times bigger.' },
          { tex: '8 \\times 1000 = 8000', text: 'Multiply the digit by the seat value. Eight bundles of one thousand make 8,000, so the 8 is not worth just 8.' },
        ],
        answer: '8000',
      },
    },
    {
      kind: 'example',
      head: 'Easy multiply: 60 × 40',
      body: 'How can you multiply 60 × 40 without a calculator? Pull the zeros out of the way and multiply the small numbers.',
      steps: {
        steps: [
          { tex: '60 \\times 40 = (6 \\times 10) \\times (4 \\times 10)', text: 'Write each number as a digit times ten. 60 is six tens and 40 is four tens. This hides the zeros for a moment.' },
          { tex: '6 \\times 4 = 24', text: 'Multiply the small numbers first. You already know this fact, and the order of multiplying does not change the answer.' },
          { tex: '10 \\times 10 = 100', text: 'The two tens we set aside multiply to 100. That is why two zeros are waiting to be stuck back on.' },
          { tex: '24 \\times 100 = 2400', text: 'Multiplying by 100 puts two zeros on the end of 24. So both zeros ride along and we get 2,400.' },
        ],
        answer: '2400',
      },
    },
    {
      kind: 'example',
      head: 'Bigger multiply: 24 × 13',
      body: 'Multiply 24 × 13 by cutting BOTH numbers into tens and ones, like the grid on the concept slide. Four easy pieces, then add.',
      steps: {
        steps: [
          { tex: '24 = 20 + 4,\\quad 13 = 10 + 3', text: 'Split both numbers into tens and ones. Every piece of 24 must meet every piece of 13, so there will be four small products.' },
          { tex: '20 \\times 10 = 200,\\quad 20 \\times 3 = 60', text: 'Do the two products that use the 20. Each is a friendly one: a multiple of ten times a small number.' },
          { tex: '4 \\times 10 = 40,\\quad 4 \\times 3 = 12', text: 'Now do the two products that use the 4. These are the pieces people forget, and leaving them out makes the answer too small.' },
          { tex: '200 + 60 + 40 + 12 = 312', text: 'Add all four pieces. The big rectangle was cut into four small rectangles, so the total area is their sum.' },
        ],
        answer: '312',
      },
    },
    {
      kind: 'example',
      head: 'Divide in chunks: 432 ÷ 6',
      body: 'How many 6s fit in 432? Look for a friendly chunk you know, take it off, and deal with what is left.',
      steps: {
        steps: [
          { tex: '6 \\times 70 = 420', text: 'Pick a friendly chunk close to 432. Since 6 × 7 = 42, we know 6 × 70 = 420, which is very near 432.' },
          { tex: '420 \\div 6 = 70', text: 'That chunk holds exactly 70 sixes. Taking it off first means we have already counted most of the groups.' },
          { tex: '432 - 420 = 12,\\quad 12 \\div 6 = 2', text: 'Find the leftover: 432 minus 420 is 12. Six goes into 12 exactly two times, so two more groups fit.' },
          { tex: '70 + 2 = 72', text: 'Add the groups from each piece. Seventy sixes plus two sixes is 72 sixes, so the answer is 72.' },
        ],
        answer: '72',
      },
    },
    {
      kind: 'example',
      head: 'Another way: split the other number',
      body: 'Multiply 24 × 13 again, but this time break apart 24 instead of 13. Do you get the same answer?',
      steps: {
        steps: [
          { tex: '24 = 20 + 4', text: 'Split the 24 into 20 and 4 this time. Either number can be broken apart, because the answer is the same total either way.' },
          { tex: '20 \\times 13 = 260', text: 'Multiply the 20 by the whole 13. That is 2 × 13 = 26 tens, so 260. Zeros ride along at the end.' },
          { tex: '4 \\times 13 = 52', text: 'Multiply the 4 by the whole 13. Four groups of 10 is 40 and four groups of 3 is 12, and 40 + 12 is 52.' },
          { tex: '260 + 52 = 312', text: 'Add both pieces. The result matches the first method, which is a good check that neither split lost a piece.' },
        ],
        answer: '312',
      },
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
    {
      kind: 'challenge',
      head: 'Extra credit: fill the theater',
      body: 'A theater has 18 rows with 15 seats in each row. How many seats are there in all? Pick a split that makes the math easy.',
      steps: {
        steps: [
          { tex: '18 \\times 15', text: 'Rows of seats means equal groups, so we multiply the number of rows by the seats in each row.' },
          { tex: '15 = 10 + 5', text: 'Break 15 into 10 and 5. Ten is easy to multiply by, and 5 is half of ten, so both pieces are friendly.' },
          { tex: '18 \\times 10 = 180,\\quad 18 \\times 5 = 90', text: 'Multiply 18 by each piece. Times 10 just adds a zero, and times 5 is half of that, so half of 180 is 90.' },
          { tex: '180 + 90 = 270', text: 'Add the two pieces together. Ten seats per row plus five seats per row gives all fifteen seats per row.' },
        ],
        answer: '270 \\text{ seats}',
      },
    },
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
      why: "Adding fractions means counting pieces. Two slices and one slice make three slices only if every slice is the same size. A slice from a pizza cut in halves is bigger than a slice from a pizza cut in thirds, so you must cut them the same way before you count.",
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
      why: "Cutting each piece into smaller equal pieces does not change how much pizza you have. Cut each half into 3 pieces and it is 3 sixths. Cut each third into 2 pieces and it is 2 sixths. Now both are in sixths, so they can be counted together.",
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
      why: "The bottom number only names the kind of piece, like the word dollars or cents. 3 fifths plus 2 fifths is 5 fifths, the same way 3 apples plus 2 apples is 5 apples. You count how many pieces you have, and the kind of piece stays the same.",
    },
    {
      kind: 'example',
      head: 'Warm-up: same bottoms already',
      body: 'What is 1/4 + 1/4? Check the bottoms first, then decide what to add.',
      steps: {
        steps: [
          { tex: '\\tfrac{1}{4} + \\tfrac{1}{4}', text: 'Look at the bottoms. Both are 4, so both pieces are fourths. The pieces are the same size and we can add right away.' },
          { tex: '\\tfrac{1 + 1}{4} = \\tfrac{2}{4}', text: 'Add the tops and keep the bottom. One slice plus one slice is two slices, and each slice is still a fourth.' },
          { tex: '\\tfrac{2}{4} = \\tfrac{2 \\div 2}{4 \\div 2} = \\tfrac{1}{2}', text: 'Simplify by dividing top and bottom by 2. Two slices out of four is the same amount of pizza as one half.' },
        ],
        answer: '\\tfrac{1}{2}',
      },
    },
    {
      kind: 'example',
      head: 'Subtract with same bottoms',
      body: 'What is 5/8 − 1/8? The pieces match, so think about taking slices away.',
      steps: {
        steps: [
          { tex: '\\tfrac{5}{8} - \\tfrac{1}{8}', text: 'Both fractions are eighths, so the pieces are the same size. That means we can subtract the tops right away.' },
          { tex: '\\tfrac{5 - 1}{8} = \\tfrac{4}{8}', text: 'Subtract the tops and keep the bottom. You have 5 slices and eat 1, so 4 slices are left, and they are still eighths.' },
          { tex: '\\tfrac{4}{8} = \\tfrac{4 \\div 4}{8 \\div 4} = \\tfrac{1}{2}', text: 'Simplify by dividing top and bottom by 4. Four slices out of eight is the same as half of the pizza.' },
        ],
        answer: '\\tfrac{1}{2}',
      },
    },
    {
      kind: 'example',
      head: 'Different bottoms: 1/2 + 1/3',
      body: 'Halves and thirds are different sizes. What size piece can both of them be cut into, so you can add?',
      steps: {
        steps: [
          { tex: '2 \\times 3 = 6', text: 'Find a bottom that both 2 and 3 go into. Six works, because 2 goes into 6 three times and 3 goes into 6 two times.' },
          { tex: '\\frac{1}{2} = \\frac{1 \\times 3}{2 \\times 3} = \\frac{3}{6}', text: 'Multiply the top and bottom by 3. That cuts each half into 3 pieces, so the amount stays the same but the pieces are sixths.' },
          { tex: '\\frac{1}{3} = \\frac{1 \\times 2}{3 \\times 2} = \\frac{2}{6}', text: 'Multiply the top and bottom by 2. That cuts each third into 2 pieces, so it is now 2 sixths with nothing lost.' },
          { tex: '\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}', text: 'The pieces are now the same size, so add the tops and keep the bottom. Three slices plus two slices is five sixths.' },
        ],
        answer: '\\frac{5}{6}',
      },
    },
    {
      kind: 'example',
      head: 'Subtract: 3/4 − 1/2',
      body: 'What is 3/4 − 1/2? The bottoms are different, so first find a size of piece that fits both.',
      steps: {
        steps: [
          { tex: '2 \\text{ goes into } 4', text: 'Check if one bottom fits in the other. Two goes into 4, so fourths will work as the common size for both fractions.' },
          { tex: '\\tfrac{1}{2} = \\tfrac{1 \\times 2}{2 \\times 2} = \\tfrac{2}{4}', text: 'Rename the half as fourths. Multiply top and bottom by 2, which cuts the half into two pieces without changing how much it is.' },
          { tex: '\\tfrac{3}{4} - \\tfrac{2}{4} = \\tfrac{3 - 2}{4}', text: 'Now both are fourths, so subtract the tops and keep the bottom. You have 3 slices and take away 2.' },
          { tex: '\\tfrac{1}{4}', text: 'One slice is left and each slice is a fourth. It cannot be simplified, because 1 and 4 share no factor except 1.' },
        ],
        answer: '\\tfrac{1}{4}',
      },
    },
    {
      kind: 'example',
      head: 'Answer bigger than 1: 2/3 + 3/4',
      body: 'What is 2/3 + 3/4? Find a common size of piece, add, and watch for an answer that is more than one whole.',
      steps: {
        steps: [
          { tex: '3 \\times 4 = 12', text: 'Multiply the bottoms to get a size both fit. Twelve works, because 3 goes into 12 four times and 4 goes into 12 three times.' },
          { tex: '\\frac{2}{3} = \\frac{2 \\times 4}{3 \\times 4} = \\frac{8}{12}', text: 'Multiply top and bottom by 4. Whatever you do to the bottom you must do to the top, so the amount stays the same.' },
          { tex: '\\frac{3}{4} = \\frac{3 \\times 3}{4 \\times 3} = \\frac{9}{12}', text: 'Rename the second fraction too, multiplying top and bottom by 3. Now both are in twelfths, the same size of piece.' },
          { tex: '\\frac{8 + 9}{12} = \\frac{17}{12}', text: 'Add the tops and keep the bottom. Eight slices plus nine slices is 17 slices, and each slice is a twelfth.' },
          { tex: '\\frac{17}{12} = 1\\frac{5}{12}', text: 'Twelve twelfths make one whole, so take out 12 of the 17 slices. That leaves 1 whole and 5 twelfths.' },
        ],
        answer: '1\\frac{5}{12}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: list the multiples',
      body: 'Add 1/4 + 1/6 by listing multiples of each bottom until you find one they share. That shared number is the new bottom.',
      steps: {
        steps: [
          { tex: '4,\\ 8,\\ 12 \\qquad 6,\\ 12', text: 'List the multiples of each bottom number. The first number that shows up in both lists is the smallest piece size both can use.' },
          { tex: '\\text{first match} = 12', text: 'Twelve is in both lists, so fourths and sixths can both be cut into twelfths. A smaller common size does not exist here.' },
          { tex: '\\tfrac{1}{4} = \\tfrac{3}{12},\\quad \\tfrac{1}{6} = \\tfrac{2}{12}', text: 'Rename each fraction. Fourths to twelfths means multiply by 3, and sixths to twelfths means multiply by 2, top and bottom both.' },
          { tex: '\\tfrac{3}{12} + \\tfrac{2}{12} = \\tfrac{5}{12}', text: 'Same size pieces now, so add the tops and keep the bottom. Three slices plus two slices is five twelfths.' },
        ],
        answer: '\\tfrac{5}{12}',
      },
      table: {
        head: ['count', 'multiples of 4', 'multiples of 6'],
        rows: [['1', '4', '6'], ['2', '8', '12'], ['3', '12', '18']],
        mark: 2,
        note: 'Walk down both lists until a number appears in each. 12 is in the 4 list (4 × 3) and in the 6 list (6 × 2).',
      },
    },
    {
      kind: 'protip',
      head: 'Multiply the bottoms in a pinch',
      body: 'Can\'t spot the least common multiple? Just multiply the two denominators — it ALWAYS works as a common denominator. For 1/2 + 1/3 that gives sixths right away. You might simplify at the end, and that\'s fine.',
      steps: {
        steps: [
          { tex: '\\tfrac{1}{3} + \\tfrac{1}{4}', text: 'The bottoms are 3 and 4, and neither fits inside the other, so there is no obvious common size of piece.' },
          { tex: '3 \\times 4 = 12', text: 'Multiply the bottoms. The result is always a number that both bottoms divide into, so it always works as a common size.' },
          { tex: '\\tfrac{4}{12} + \\tfrac{3}{12} = \\tfrac{7}{12}', text: 'Rename both by multiplying top and bottom by the other fraction\'s bottom, then add the tops and keep the bottom.' },
        ],
        answer: '\\tfrac{7}{12}',
      },
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
    {
      kind: 'challenge',
      head: 'Extra credit: three fractions',
      body: 'What is 1/2 + 1/3 + 1/4? You need one piece size that all three bottoms fit into.',
      steps: {
        steps: [
          { tex: '2,\\ 3,\\ 4 \\text{ all go into } 12', text: 'Find one bottom for all three fractions. Twelve works, since 2 goes into it 6 times, 3 goes 4 times, and 4 goes 3 times.' },
          { tex: '\\tfrac{1}{2} = \\tfrac{6}{12},\\quad \\tfrac{1}{3} = \\tfrac{4}{12},\\quad \\tfrac{1}{4} = \\tfrac{3}{12}', text: 'Rename each fraction by multiplying top and bottom by the same number. The amounts do not change, only the size of the pieces.' },
          { tex: '\\tfrac{6 + 4 + 3}{12} = \\tfrac{13}{12}', text: 'All the pieces are twelfths, so add the three tops and keep the bottom. That makes 13 slices, each one twelfth.' },
          { tex: '\\tfrac{13}{12} = 1\\tfrac{1}{12}', text: 'Twelve twelfths make one whole. Take 12 of the 13 slices out as a whole, and 1 twelfth is left over.' },
        ],
        answer: '1\\tfrac{1}{12}',
      },
    },
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
      why: "Picture a square cut into 2 columns and 4 rows. That makes 2 × 4 = 8 equal boxes, so the bottoms multiply to tell you the size of each box. Taking half of one quarter keeps just 1 box, which is 1 × 1 on top. So the answer is one eighth.",
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
      why: "Three groups of 4 is 3 × 4, and we say it with the word of. A fraction of a number works the same way. Two thirds of 12 means split 12 into 3 equal parts, which is 4 each, and take 2 of those parts, which is 8.",
    },
    {
      kind: 'concept',
      head: 'Dividing asks "how many fit?"',
      body: '4 ÷ 1/3 asks: how many thirds fit inside 4 wholes? Each whole holds 3 thirds, so 4 wholes hold 4 × 3 = 12. Dividing by a fraction usually makes the answer BIGGER.',
      formula: { tex: 'a \\div \\tfrac{1}{n} = a \\times n', note: 'Dividing by a small piece gives a BIG answer — how many fit inside.', parts: [{ sym: '\\tfrac{1}{n}', means: 'the small piece you are fitting in', tone: 'accent' }, { sym: '\\times n', means: 'flipping it is what makes the answer grow', tone: 'ok' }] },
      art: fractionBar(12, 12, { label: '6 wholes, each cut in half — 12 halves fit', title: '6 ÷ ½ asks how many halves fit in 6', caption: 'Dividing by a number smaller than 1 gives you MORE, not less.' }),
      why: "Every whole holds n pieces of size 1/n, like 4 quarters in one dollar. So 4 wholes hold 4 groups of n pieces, which is 4 × n. Dividing by a fraction counts how many small pieces fit, and small pieces fit many times, so the answer grows.",
    },
    {
      kind: 'example',
      head: 'Simplest multiply: 1/2 × 1/4',
      body: 'What is half of a quarter? Think of a quarter slice of toast cut in half. Use the multiply-across rule to find out how big one piece is.',
      steps: {
        steps: [
          { tex: '\\tfrac12 \\times \\tfrac14', text: 'The word "of" means multiply, so half of a quarter is written as one half times one quarter.' },
          { tex: '\\tfrac{1 \\times 1}{2 \\times 4}', text: 'Multiply tops with tops and bottoms with bottoms. The tops count the pieces you keep, and the bottoms count how many pieces the whole is cut into.' },
          { tex: '\\tfrac{1}{8}', text: 'Cutting each of 4 slices in half makes 8 equal pieces in the whole, and you keep just one of them. That is one eighth.' },
          { tex: '\\tfrac18 < \\tfrac14', text: 'Check the size. Half of a quarter must be smaller than a quarter, and one eighth is smaller, so the answer makes sense.' },
        ],
        answer: '\\tfrac{1}{8}',
      },
    },
    {
      kind: 'example',
      head: 'Another: 1/3 × 1/2',
      body: 'What is a third of a half? Use the same multiply-across rule and then check that the size makes sense.',
      steps: {
        steps: [
          { tex: '\\tfrac13 \\times \\tfrac12', text: 'A third of a half means one third times one half, because the word "of" tells us to multiply the two fractions.' },
          { tex: '\\tfrac{1 \\times 1}{3 \\times 2}', text: 'Multiply the tops together and the bottoms together. Cutting each of the 2 halves into 3 pieces makes 6 pieces in the whole.' },
          { tex: '\\tfrac16', text: 'The tops give 1 times 1, which is 1. You keep just one of the 6 equal pieces, so the answer is one sixth.' },
          { tex: '\\tfrac16 < \\tfrac12', text: 'Check the size. A third of a half should be smaller than the half you started with, and one sixth is smaller than one half.' },
        ],
        answer: '\\tfrac{1}{6}',
      },
    },
    {
      kind: 'example',
      head: 'Fraction of a number: 2/3 of 12',
      body: 'What is 2/3 of 12? Split the 12 into equal parts first, then take the number of parts you need.',
      steps: {
        steps: [
          { tex: '\\tfrac23 \\times 12', text: 'The word "of" means multiply, so two thirds of 12 is written as two thirds times 12.' },
          { tex: '12 \\div 3 = 4', text: 'The bottom 3 says to split 12 into 3 equal parts. Each part is 4, so one third of 12 is 4.' },
          { tex: '2 \\times 4 = 8', text: 'The top 2 says to take two of those parts. Two groups of 4 make 8, so two thirds of 12 is 8.' },
          { tex: '\\tfrac{2 \\times 12}{3} = \\tfrac{24}{3} = 8', text: 'Check by multiplying straight across: 24 divided by 3 is also 8, so both ways agree.' },
        ],
        answer: '8',
      },
    },
    {
      kind: 'example',
      head: 'Divide: 6 ÷ 1/2',
      body: 'How many halves fit inside 6 wholes? Think of 6 pizzas, each cut into halves. Count the half-slices.',
      steps: {
        steps: [
          { tex: '6 \\div \\tfrac{1}{2}', text: 'Dividing asks how many fit. Here we are asking how many pieces of size one half fit inside 6 wholes.' },
          { tex: '1 \\text{ whole} = 2 \\text{ halves}', text: 'Each whole pizza holds exactly 2 half-slices. Halves are small, so lots of them fit in each whole.' },
          { tex: '6 \\times 2 = 12', text: 'Six wholes with 2 halves in each makes 6 times 2 halves. This is the same as flipping one half to 2 over 1 and multiplying.' },
          { tex: '12 \\times \\tfrac12 = 6', text: 'Check by multiplying back. Twelve halves is 12 times one half, which is 6, so the answer is right and bigger than 6.' },
        ],
        answer: '12',
      },
    },
    {
      kind: 'example',
      head: 'Divide: 3 ÷ 1/4',
      body: 'How many quarters fit inside 3 wholes? Think of 3 dollars and count the quarters.',
      steps: {
        steps: [
          { tex: '3 \\div \\tfrac{1}{4}', text: 'This asks how many pieces of size one quarter fit inside 3 wholes, which is the how-many-fit meaning of division.' },
          { tex: '1 \\text{ whole} = 4 \\text{ quarters}', text: 'One whole holds 4 quarters, just like 4 quarter coins make a dollar. So each whole adds 4 pieces to the count.' },
          { tex: '3 \\times 4 = 12', text: 'Three wholes with 4 quarters each is 3 times 4. This is the same as flipping one quarter to 4 over 1 and multiplying.' },
          { tex: '12 \\times \\tfrac14 = 3', text: 'Check by multiplying back. Twelve quarters is 12 times one quarter, which is 3, so the answer 12 is right.' },
        ],
        answer: '12',
      },
    },
    {
      kind: 'example',
      head: 'Another way: multiply straight across',
      body: 'Find 2/3 of 12 again, but this time use the multiply-across rule right away, with no dividing first.',
      steps: {
        steps: [
          { tex: '12 = \\tfrac{12}{1}', text: 'Write the whole number as a fraction over 1. Dividing by 1 changes nothing, and now both numbers are fractions we can multiply across.' },
          { tex: '\\tfrac23 \\times \\tfrac{12}{1} = \\tfrac{2 \\times 12}{3 \\times 1}', text: 'Multiply the tops together and the bottoms together. This is the rule for any two fractions.' },
          { tex: '\\tfrac{24}{3} = 24 \\div 3 = 8', text: 'A fraction bar means divide, so 24 over 3 is 24 divided by 3. That is 8.' },
          { tex: '2 \\times 12 \\div 3 = 12 \\div 3 \\times 2', text: 'This matches the first way. Multiplying and dividing in a different order gives the same result, so both methods give 8.' },
        ],
        answer: '8',
      },
    },
    {
      kind: 'protip',
      head: 'Flip and multiply',
      body: 'Dividing by a fraction = multiplying by its reciprocal (the flip). 6 ÷ 1/2 = 6 × 2/1 = 12. Flip the SECOND fraction only, then multiply straight across.',
      formula: {
        tex: 'a \\div \\frac{c}{d} = a \\times \\frac{d}{c}',
        note: 'Turn the second fraction upside down and the division becomes a multiplication.',
      },
      why: 'Dividing by 1/2 asks how many halves fit, and every whole holds 2 halves, so you multiply by 2. The 2 is just 1/2 turned upside down. The same thing happens for every fraction.',
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
    {
      kind: 'challenge',
      head: 'Extra credit: how many scoops',
      body: 'You have 2 1/2 cups of dough and each cookie needs 1/4 cup. How many cookies can you make? Ask how many quarter-cups fit.',
      steps: {
        steps: [
          { tex: '2\\tfrac12 \\div \\tfrac14', text: 'Making cookies means asking how many quarter-cups fit inside 2 and a half cups, so this is a division by a fraction.' },
          { tex: '2\\tfrac12 = \\tfrac{4}{2} + \\tfrac12 = \\tfrac52', text: 'Turn the mixed number into a fraction. Two wholes are 4 halves, and one more half makes 5 halves.' },
          { tex: '\\tfrac52 \\times \\tfrac41 = \\tfrac{20}{2}', text: 'Flip the second fraction and multiply across. Each cup holds 4 quarter-cups, so we multiply by 4.' },
          { tex: '\\tfrac{20}{2} = 10', text: 'Divide 20 by 2. Check with a picture: 2 cups hold 8 quarters and the half cup holds 2 more, which is 10 cookies.' },
        ],
        answer: '10 \\text{ cookies}',
      },
    },
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
      why: "Each column in a decimal has its own size: tenths, hundredths, and so on. Only the same kind of piece can be added, just like dollars go with dollars and cents go with cents. The point marks where the ones end, so lining up the points puts like with like.",
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
      why: "Writing a zero on the end of a decimal does not change its size. 0.5 is 5 tenths, and cutting each tenth into 10 hundredths makes it 50 hundredths. Once both numbers count the same size of piece, you just compare the counts, like 50 cents against 45 cents.",
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
      why: "A decimal is a fraction with a 10, 100, and so on on the bottom. 0.5 is 5/10 and 0.8 is 8/10. Multiplying across gives 40 over 100, and the two tens made the 100. Each decimal place is one factor of ten, so two places gives hundredths.",
    },
    {
      kind: 'example',
      head: 'Add: 0.2 + 0.35',
      body: 'What is 0.2 + 0.35? The two numbers have different numbers of places, so make them match before you add.',
      steps: {
        steps: [
          { tex: '0.2 = 0.20', text: 'Add a zero on the right of 0.2. This does not change its size, because 2 tenths is the same as 20 hundredths.' },
          { tex: '\\begin{array}{r} 0.20 \\\\ +\\ 0.35 \\end{array}', text: 'Stack the numbers with the decimal points in one column so that tenths sit over tenths and hundredths over hundredths.' },
          { tex: '20 + 35 = 55', text: 'Both are counted in hundredths now, so add them like whole numbers. Twenty hundredths plus thirty-five hundredths is 55 hundredths.' },
          { tex: '0.55', text: 'Write 55 hundredths as 0.55, with the point in the same spot as above. It is like 20 cents plus 35 cents making 55 cents.' },
        ],
        answer: '0.55',
      },
    },
    {
      kind: 'example',
      head: 'Add: 0.3 + 0.45',
      body: 'What is 0.3 + 0.45? Give both numbers two places, then add one column at a time.',
      steps: {
        steps: [
          { tex: '0.3 = 0.30', text: 'Write 0.3 as 0.30 so both have two places. Three tenths and thirty hundredths are the same amount.' },
          { tex: '\\begin{array}{r} 0.30 \\\\ +\\ 0.45 \\end{array}', text: 'Line up the decimal points. Now tenths sit over tenths and hundredths over hundredths, so each column adds the same kind of piece.' },
          { tex: '30 + 45 = 75', text: 'Add the hundredths as whole numbers. Zero plus five is 5 and three plus four is 7, so you get 75 hundredths.' },
          { tex: '0.75', text: 'Write the answer with the decimal point lined up. Check with money: 30 cents plus 45 cents is 75 cents.' },
        ],
        answer: '0.75',
      },
    },
    {
      kind: 'example',
      head: 'Subtract: 2 − 0.85',
      body: 'What is 2 − 0.85? Think of paying 85 cents out of two dollars. The whole number 2 has no decimal places, so give it some.',
      steps: {
        steps: [
          { tex: '2 = 2.00', text: 'Write 2 as 2.00. A whole number has an invisible decimal point on its right, and zeros after it do not change its value.' },
          { tex: '2.00 - 0.85 \\to 200 - 85', text: 'Both numbers now count hundredths, so we can subtract them as whole numbers. 2 dollars is 200 cents.' },
          { tex: '200 - 85 = 115', text: 'Subtract: 200 minus 80 is 120, and 120 minus 5 is 115. So there are 115 hundredths left.' },
          { tex: '115 \\text{ hundredths} = 1.15', text: 'Put the decimal point back. 115 cents is 1 dollar and 15 cents, which is 1.15. Check: 0.85 + 1.15 = 2.' },
        ],
        answer: '1.15',
      },
    },
    {
      kind: 'example',
      head: 'Multiply: 0.5 × 0.8',
      body: 'What is 0.5 × 0.8? Multiply as whole numbers first, then use the number of decimal places to put the point back.',
      steps: {
        steps: [
          { tex: '5 \\times 8 = 40', text: 'Ignore the points for a moment. 0.5 is 5 tenths and 0.8 is 8 tenths, so first multiply the whole numbers 5 and 8.' },
          { tex: '1 + 1 = 2 \\text{ places}', text: 'Count the decimal places that went in. Each number has one, and tenths times tenths gives hundredths, which is two places.' },
          { tex: '40 \\to 0.40', text: 'Put the point so the answer has two decimal places. 40 hundredths is 0.40, with the point two places from the right.' },
          { tex: '0.40 = 0.4', text: 'Drop the zero on the end because it adds nothing. Check: half of 0.8 is 0.4, so the answer fits.' },
        ],
        answer: '0.4',
      },
    },
    {
      kind: 'example',
      head: 'Multiply: 1.5 × 4',
      body: 'What is 1.5 × 4? Multiply as whole numbers, then decide where the decimal point goes.',
      steps: {
        steps: [
          { tex: '15 \\times 4 = 60', text: 'Ignore the point at first. 1.5 is 15 tenths, so multiply the whole numbers 15 and 4 to get 60 tenths.' },
          { tex: '1 + 0 = 1 \\text{ place}', text: 'Count the decimal places in the factors. 1.5 has one and 4 has none, so the answer gets one decimal place.' },
          { tex: '60 \\text{ tenths} = 6.0', text: 'Put the point one place from the right. 60 tenths is 6.0, and 6.0 is the same as 6.' },
          { tex: '1.5 \\times 4 = 4 + 2', text: 'Check by splitting 1.5 into 1 and 0.5. One four is 4 and half of 4 is 2, which makes 6, so the answer fits.' },
        ],
        answer: '6',
      },
    },
    {
      kind: 'example',
      head: 'Another way: count the decimal places',
      body: 'Find 0.3 × 0.7 with the count-the-places shortcut, then check it a second way by turning the decimals into fractions.',
      steps: {
        steps: [
          { tex: '3 \\times 7 = 21', text: 'Ignore the decimal points and multiply the whole numbers 3 and 7. This is the digit part of the answer.' },
          { tex: '1 + 1 = 2 \\text{ places}', text: 'Count the decimal places in the two factors. Each has one, so the answer must have two decimal places, which are hundredths.' },
          { tex: '21 \\to 0.21', text: 'Put the point so there are two places after it. 21 hundredths is written 0.21.' },
          { tex: '\\tfrac{3}{10} \\times \\tfrac{7}{10} = \\tfrac{21}{100}', text: 'Check as fractions. Three tenths times seven tenths is 21 over 100, and 21 hundredths is 0.21, which matches the shortcut.' },
        ],
        answer: '0.21',
      },
      table: { head: ['problem', 'places in', 'answer'], rows: [['0.5 × 0.8', '1 + 1 = 2', '0.40'], ['1.5 × 4', '1 + 0 = 1', '6.0'], ['0.3 × 0.7', '1 + 1 = 2', '0.21']], mark: 2, note: 'Count the places in the factors and the answer gets the same total.' },
    },
    {
      kind: 'protip',
      head: 'Money is decimals in disguise',
      body: 'Think of decimals as dollars and cents: 0.5 is 50 cents, 0.45 is 45 cents. Comparing or adding money feels natural — use that instinct on any decimal problem.',
      steps: {
        steps: [
          { tex: '\\$2.35 = 235 \\text{ cents},\\quad \\$1.50 = 150 \\text{ cents}', text: 'Write each amount in cents. Cents are the hundredths, so this turns both decimals into plain whole numbers.' },
          { tex: '235 + 150 = 385', text: 'Add the whole numbers the way you always do. Because both are in cents, every digit is already in the right column.' },
          { tex: '385 \\text{ cents} = \\$3.85', text: 'Put the point back before the last two digits, because 100 cents make one dollar. That gives 3 dollars and 85 cents.' },
        ],
        answer: '\\$3.85',
      },
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
    {
      kind: 'challenge',
      head: 'Extra credit: making change',
      body: 'You buy a $2.50 drink and a $1.75 snack with a $5 bill. How much change do you get back? Find the total cost first.',
      steps: {
        steps: [
          { tex: '2.50 + 1.75', text: 'Find what you spend altogether. Both prices have two decimal places, so line up the points and add cents to cents.' },
          { tex: '250 + 175 = 425 \\to \\$4.25', text: 'In cents that is 250 plus 175, which makes 425. Write it back as dollars: 4 dollars and 25 cents.' },
          { tex: '5.00 - 4.25 = 500 - 425', text: 'Change is what is left from the 5 dollars. Write 5 as 5.00 so both numbers count cents, then subtract.' },
          { tex: '500 - 425 = 75 \\text{ cents}', text: 'The difference is 75 cents. Check: 4.25 plus 0.75 is 5.00, so adding the change to the cost gives the bill back.' },
        ],
        answer: '\\$0.75',
      },
    },
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
      why: "A smaller unit is a smaller piece, so you need more of them to cover the same length. One meter stick is covered by 100 little centimeter pieces, like one dollar is 100 pennies. So 3 meter sticks need 3 groups of 100 pieces, which is 3 × 100.",
    },
    {
      kind: 'concept',
      head: 'Small → big: divide',
      body: 'Going from a smaller unit to a bigger one means FEWER pieces, so divide. 400 cm = 400 ÷ 100 = 4 meters. Many small things bundle into few big things.',
      formula: { tex: '\\text{big} = \\dfrac{\\text{small}}{\\text{rate}}', note: 'Bigger units take fewer of them, so the number must shrink.', parts: [{ sym: '\\text{rate}', means: 'how many small units make one big one', tone: 'accent' }, { sym: '\\div', means: 'because the count has to come out smaller', tone: 'ok' }] },
      why: "Going the other way, you are bundling small pieces into big ones. Each big unit takes a full bundle of the small ones, like 100 pennies make one dollar. To find how many bundles you can make, you ask how many 100s fit in 400, which is 400 ÷ 100 = 4.",
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
      why: "Every conversion is built from one fact: how many small units make one big unit. Once you know that fact, the rest is just multiplying or dividing by that number. It is like knowing 4 quarters make a dollar, which tells you that 3 dollars is 12 quarters.",
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
      why: "Volume counts little cubes that each measure 1 by 1 by 1. A flat layer along the floor holds length times width cubes, like rows of eggs in a carton. Stack that layer as many times as the height says, so you multiply by the height. Each cube is a cubic unit, so the answer is in cubic units.",
    },
    {
      kind: 'example',
      head: 'Convert: 2 m to cm',
      body: 'How many centimeters are in 2 meters? Decide first whether the number should grow or shrink.',
      steps: {
        steps: [
          { tex: '1 \\text{ m} = 100 \\text{ cm}', text: 'Start from the anchor fact. One meter is as long as 100 centimeters, and every conversion between these two units uses it.' },
          { tex: '\\text{big unit} \\to \\text{small unit}', text: 'Meters are bigger than centimeters. Measuring with smaller units takes more of them, so the number should get bigger and we multiply.' },
          { tex: '2 \\times 100 = 200', text: 'Two meters is two groups of 100 centimeters. Multiply 2 by 100, which just puts two zeros on the end.' },
          { tex: '200 > 2', text: 'Sense check. The answer is a bigger number than the 2 we started with, as it should be because centimeters are tiny.' },
        ],
        answer: '200 \\text{ cm}',
      },
    },
    {
      kind: 'example',
      head: 'Convert: 5 ft to inches',
      body: 'How many inches are in 5 feet? Think about which unit is bigger and which way the number must move.',
      steps: {
        steps: [
          { tex: '1 \\text{ ft} = 12 \\text{ in}', text: 'Recall the anchor. One foot is the same length as 12 inches, so this is the rate we use to change units.' },
          { tex: '\\text{big unit} \\to \\text{small unit}', text: 'A foot is bigger than an inch. Going to the smaller unit means more pieces are needed, so the number grows and we multiply.' },
          { tex: '5 \\times 12 = 60', text: 'Five feet is five groups of 12 inches. Multiply: 5 times 10 is 50 and 5 times 2 is 10, and 50 plus 10 is 60.' },
        ],
        answer: '60 \\text{ in}',
      },
    },
    {
      kind: 'example',
      head: 'Convert back: 400 cm to m',
      body: 'How many meters are 400 centimeters? This time you go from the small unit to the big unit.',
      steps: {
        steps: [
          { tex: '100 \\text{ cm} = 1 \\text{ m}', text: 'Recall the metric anchor. A bundle of 100 centimeters makes exactly one meter, so we will count bundles.' },
          { tex: '\\text{small unit} \\to \\text{big unit}', text: 'Centimeters are smaller than meters. Big units need fewer pieces to cover the same length, so the number shrinks and we divide.' },
          { tex: '400 \\div 100 = 4', text: 'Ask how many bundles of 100 fit in 400. Dividing by 100 takes two zeros off the end, which leaves 4.' },
          { tex: '4 < 400', text: 'Sense check. The answer is a smaller number than 400, as it should be, because one meter is a long unit.' },
        ],
        answer: '4 \\text{ m}',
      },
    },
    {
      kind: 'example',
      head: 'Volume of a 3 × 2 × 4 box',
      body: 'How many unit cubes fill a box that is 3 long, 2 wide, and 4 tall? Build it one layer at a time.',
      steps: {
        steps: [
          { tex: '3 \\times 2 = 6', text: 'First fill the floor. Three cubes in a row and 2 rows means 6 cubes in the base layer, which is the length times the width.' },
          { tex: '\\text{4 layers high}', text: 'The height is 4, so we stack 4 layers that each look like the floor. Every layer holds the same 6 cubes.' },
          { tex: '6 \\times 4 = 24', text: 'Four layers with 6 cubes in each layer is 6 times 4. That is the same as multiplying all three edges.' },
          { tex: '24 \\text{ cubic units}', text: 'Write the units as cubic units, because we counted cubes that stretch in three directions, not flat squares.' },
        ],
        answer: '24 \\text{ cubic units}',
      },
    },
    {
      kind: 'example',
      head: 'Volume of a cube, edge 3',
      body: 'A cube has every edge the same length. What is the volume of a cube with edge 3?',
      steps: {
        steps: [
          { tex: 'l = w = h = 3', text: 'Every edge of a cube is the same, so the length, width and height are all 3. We can use the same volume rule as for any box.' },
          { tex: '3 \\times 3 = 9', text: 'Start with the floor layer. Three rows of 3 cubes each is 9 cubes, which is the length times the width.' },
          { tex: '9 \\times 3 = 27', text: 'The height is 3, so stack 3 layers of 9 cubes. That is 9 times 3, which is 27 cubes in all.' },
        ],
        answer: '27 \\text{ cubic units}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: base area times height',
      body: 'Find the volume of a box that is 5 long, 4 wide, and 3 tall by finding one layer first, and then stacking the layers.',
      steps: {
        steps: [
          { tex: '\\text{base} = 5 \\times 4 = 20', text: 'Find the area of the floor first. Five cubes in a row and 4 rows gives 20 cubes in one flat layer.' },
          { tex: '\\text{height} = 3 \\text{ layers}', text: 'The box is 3 tall, so it has 3 layers, and each layer is a copy of the floor with the same 20 cubes.' },
          { tex: '20 \\times 3 = 60', text: 'Multiply the base area by the number of layers. Three layers of 20 cubes is 60 cubes, so the volume is 60 cubic units.' },
          { tex: '4 \\times 3 = 12,\\quad 12 \\times 5 = 60', text: 'Check by multiplying in a different order. Order does not matter for multiplying, so we still get 60.' },
        ],
        answer: '60 \\text{ cubic units}',
      },
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
    {
      kind: 'challenge',
      head: 'Extra credit: pack the crate',
      body: 'A crate holds 96 cubic feet. Each small box takes up 12 cubic feet. How many boxes fit in the crate?',
      steps: {
        steps: [
          { tex: '96 \\text{ ft}^3 \\text{ and } 12 \\text{ ft}^3', text: 'Both numbers are volumes measured in the same cubic unit, so we can compare them directly with no conversion.' },
          { tex: '96 \\div 12', text: 'Dividing asks how many 12s fit inside 96. Each box uses up 12 of the cubic feet, so we count how many such pieces the crate holds.' },
          { tex: '96 \\div 12 = 8', text: 'Count in 12s: 12, 24, 36, 48, 60, 72, 84, 96. That takes 8 steps, so 8 boxes fit.' },
          { tex: '8 \\times 12 = 96', text: 'Check by multiplying back. Eight boxes of 12 cubic feet is exactly 96, so there is no space left over.' },
        ],
        answer: '8 \\text{ boxes}',
      },
    },
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
      why: "A coordinate plane is like a map where everyone must agree on the order, so that your friend can find the same spot. We always say how far to go across the ground first, then how far up. (3, 2) and (2, 3) are different spots, like a different street and floor.",
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
      why: "The first term is where you start, so it has taken zero jumps. The second term has taken one jump, the third has taken two, and the n-th term has taken n − 1 jumps. Check with 0, 4, 8, 12, 16: the 5th term took 4 jumps of 4, so 0 + 16 = 16.",
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
      why: "Each X is one tally mark for one thing that was measured. A tall stack means that value showed up many times, and a short stack means it showed up few times. To get the total, count every X, because every X is exactly one measurement.",
    },
    {
      kind: 'example',
      head: 'Plot a point: right 3, up 2',
      body: 'Where does the point (3, 2) go on the grid? Start at the corner and follow the directions in order: across, then up.',
      steps: {
        steps: [
          { tex: '(0,\\ 0)', text: 'Put your pencil at the corner where the two number lines meet. This spot is called the origin, and every point is measured from it.' },
          { tex: '\\text{right } 3', text: 'Run across first. The first number, x, tells how far to go along the bottom line, so move 3 steps to the right.' },
          { tex: '\\text{up } 2', text: 'Now climb. The second number, y, tells how far to go up, so move 2 steps straight up from where you stopped.' },
          { tex: '(3,\\ 2)', text: 'Mark a dot where you ended. It is written with the x number first and the y number second, so it is (3, 2).' },
        ],
        answer: '(3,\\ 2)',
      },
    },
    {
      kind: 'example',
      head: 'Name the point: right 4, up 2',
      body: 'A dot is 4 steps right and 2 steps up from the corner. What are its coordinates? Order matters here.',
      steps: {
        steps: [
          { tex: '\\text{start at } (0,\\ 0)', text: 'Begin at the origin, where the two number lines meet. We count the steps from this corner to the dot.' },
          { tex: 'x = 4', text: 'Read the steps across first. The dot is 4 steps to the right, so the x-number is 4, because x is the walk along the bottom.' },
          { tex: 'y = 2', text: 'Then read the steps up. The dot is 2 steps above the bottom line, so the y-number is 2, the climb.' },
          { tex: '(x,\\ y) = (4,\\ 2)', text: 'Write them in order, x first and y second, inside brackets. (2, 4) would be a different point, so never swap the order.' },
        ],
        answer: '(4,\\ 2)',
      },
    },
    {
      kind: 'example',
      head: 'Extend a pattern: 5, 10, 15, …',
      body: 'What are the next terms of the pattern 5, 10, 15, …? Find how much it jumps each time.',
      steps: {
        steps: [
          { tex: '10 - 5 = 5', text: 'Subtract neighbors to find the jump. The second term minus the first term tells how much each step adds.' },
          { tex: '15 - 10 = 5', text: 'Check the jump with a second pair of neighbors. It is also 5, so the jump is constant and the rule is safe to use.' },
          { tex: '15 + 5 = 20', text: 'Add the jump to the last term to get the next term. Each new term is the one before it plus 5.' },
          { tex: '20 + 5 = 25,\\quad 25 + 5 = 30', text: 'Keep adding the same jump to keep going. The pattern goes on adding 5 each time, as long as the rule stays the same.' },
        ],
        answer: '20,\\ 25,\\ 30',
      },
    },
    {
      kind: 'example',
      head: 'Leap ahead: 0, 4, 8 … term 5?',
      body: 'What is the 5th term of 0, 4, 8, …? Use the jump rule instead of listing every term.',
      steps: {
        steps: [
          { tex: 'start = 0,\\quad jump = 4 - 0 = 4', text: 'Find the starting number and the jump. The first term is 0 and each term is 4 more than the one before it.' },
          { tex: '5 - 1 = 4 \\text{ jumps}', text: 'Count the jumps. The first term needs no jump to get to, so term 5 takes only 4 jumps, not 5.' },
          { tex: '4 \\times 4 = 16', text: 'Multiply the number of jumps by the size of the jump. Four jumps of 4 add up to 16.' },
          { tex: '0 + 16 = 16', text: 'Add this to the starting number. Zero plus 16 is 16, which matches the table below, so term 5 is 16.' },
        ],
        answer: '16',
      },
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
      body: 'The plot shows the cups of water left in some bottles. How many bottles were measured in all, and which amount was the most common?',
      art: dotPlot(['1/4', '1/2', '3/4', '1'], [3, 4, 2, 1], {
        title: 'cups of water left', unit: 'cups', mark: 1,
        caption: 'Three Xs over 1/4, four over 1/2, two over 3/4, one over 1.',
      }),
      steps: {
        steps: [
          { tex: '\\text{one X} = \\text{one bottle}', text: 'Each X on a line plot stands for exactly one thing that was measured, so counting Xs counts bottles.' },
          { tex: '3 + 4 + 2 + 1 = 10', text: 'Count the Xs over each number and add them. That is the total number of bottles that were measured.' },
          { tex: '\\text{tallest stack} = 4 \\text{ over } \\tfrac12', text: 'Find the tallest stack. A taller stack means that value showed up more often, and the tallest is over 1/2 with 4 Xs.' },
          { tex: '\\text{most common} = \\tfrac12 \\text{ cup}', text: 'So the amount that happened most often is one half cup. The stack height tells how many bottles had that amount.' },
        ],
        answer: '10 \\text{ bottles; most common } \\tfrac12 \\text{ cup}',
      },
    },
    {
      kind: 'example',
      head: 'Another way: list the terms',
      body: 'Find the 5th term of the pattern 0, 4, 8, … by writing out the terms instead of using the rule.',
      steps: {
        steps: [
          { tex: '0,\\ 4,\\ 8', text: 'Write down the terms you are given. Notice that each one is 4 more than the one before it, so the jump is 4.' },
          { tex: '8 + 4 = 12,\\quad 12 + 4 = 16', text: 'Keep adding the jump to extend the list. Each new term is the last term plus 4, so the next two are 12 and 16.' },
          { tex: '0,\\ 4,\\ 8,\\ 12,\\ 16', text: 'Count along the list: first 0, second 4, third 8, fourth 12, fifth 16. The fifth number is the 5th term.' },
          { tex: '0 + 4 \\times 4 = 16', text: 'Check against the rule. Term 5 takes four jumps of 4 from the start, and 16 is what you get either way.' },
        ],
        answer: '16',
      },
    },
    {
      kind: 'protip',
      head: 'Check the jump twice',
      body: 'Before extending a pattern, compute the jump from TWO different pairs: 10 − 5 and 15 − 10. If both give the same jump, your rule is solid. Patterns with changing jumps need a different rule.',
      why: 'One pair of neighbors could match by accident. Pattern 1, 2, 4 starts with a jump of 1 and then jumps by 2, so adding 1 each time would fail. A second check catches this.',
    },
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
    {
      kind: 'challenge',
      head: 'Extra credit: predict far ahead',
      body: 'A pattern follows the rule y = 2x: (1, 2), (2, 4), (3, 6). What is y when x = 10? Use the rule instead of listing every point.',
      steps: {
        steps: [
          { tex: '2 \\times 1 = 2,\\ 2 \\times 2 = 4,\\ 2 \\times 3 = 6', text: 'First check the rule on the points you were given. Each y is exactly twice its x, so the rule really matches the pattern.' },
          { tex: 'y = 2x', text: 'The rule works for every x, so we do not need to list all the points. We can just put in the x we care about.' },
          { tex: 'y = 2 \\times 10', text: 'Replace x with 10. The rule says to double it, so y is twice 10.' },
          { tex: 'y = 20', text: 'Twice 10 is 20, so the point is (10, 20). Listing every point from 1 to 10 would have taken much longer.' },
        ],
        answer: 'y = 20',
      },
    },
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
