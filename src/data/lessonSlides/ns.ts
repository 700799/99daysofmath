import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, VIO, areaModel, flow, fractionBar, numberLine, plotGrid, tape } from '../slideArt';

// 6.NS — The Number System. 12–14 slides per lesson, ~3 short sentences each,
// written for a 10–12-year-old: objective → concepts → simplest-to-fuller
// examples → pro tip → trap(s) → summary.
export const NS_SLIDES: SlideBank = {
  '6.NS-1': [
    {
      kind: 'objective',
      head: 'Decimals that behave',
      body: 'Today you will add and subtract decimals without a single slip. The whole game is lining up the decimal points. Do that, and decimals act just like whole numbers.',
      art: flow([{ label: 'Stack the decimal points', color: SKY }, { label: 'Pad with zeros', color: AMB }, { label: 'Bring the point down', color: EMR }], { title: 'Adding and subtracting decimals' }),
    },
    {
      kind: 'concept',
      head: 'Line up the points, always',
      body: 'Before you add or subtract, stack the numbers so the decimal points sit in one straight column. That keeps tenths with tenths and hundredths with hundredths. Lining up the LAST digits instead is how answers go wrong.',
      formula: { tex: '\\text{align the decimal points, not the digits}', note: 'Almost every decimal mistake is a lining-up mistake.', parts: [{ sym: '\\text{point}', means: 'the anchor everything else lines up against', tone: 'accent' }, { sym: '\\text{last digit}', means: 'lining these up instead is the classic slip', tone: 'bad' }] },
      art: flow([{ label: 'Stack the decimal points' }, { label: 'Pad the short one with zeros' }, { label: 'Bring the point straight down' }], { title: 'Three moves, zero mistakes', caption: 'Almost every decimal mistake is a lining-up mistake, not an arithmetic one.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\begin{matrix} 3.5 \\\\ 0.42 \\end{matrix}', lines: ['Lined up the ends', 'Tenths over hundredths'], tone: 'bad' },
          { title: 'Right', tex: '\\begin{matrix} 3.50 \\\\ 0.42 \\end{matrix}', lines: ['Points in one column', 'Like over like'], tone: 'ok' },
        ],
        note: 'The decimal point is the anchor. Everything else lines up from there.',
      },
      why: 'A digit is worth different amounts in different places. The 4 in 3.4 means four tenths, but the 5 in 1.25 means five hundredths. You can only add or subtract things of the same size, like dollars with dollars and dimes with dimes. Lining up the points puts same-size places in the same column.',
    },
    {
      kind: 'concept',
      head: 'Zeros on the right are free',
      body: 'You can add zeros to the right end of a decimal without changing it: 3.4 is exactly the same as 3.40. Pad both numbers to the same number of places. Now every column has a digit and nothing gets skipped.',
      formula: { tex: '0.4 = 0.40 = 0.400', note: 'Cutting the same amount into finer parts does not change how much there is.', parts: [{ sym: '0.4', means: 'four tenths of the whole', tone: 'accent' }, { sym: '0.40', means: 'forty hundredths, which is the same amount', tone: 'ok' }] },
      art: fractionBar(10, 4, { label: '0.4', second: { parts: 100, shaded: 40, label: '0.40 — the same shading' }, title: '0.4 and 0.40 are the same amount', caption: 'Cutting the same shaded piece into finer parts does not change how much there is.' }),
      table: {
        head: ['number', 'padded', 'same value?'],
        rows: [['0.5', '0.50', 'yes'], ['3', '3.00', 'yes'], ['0.05', '0.050', 'yes'], ['0.5', '0.05', 'NO']],
        mark: 3,
        note: 'Zeros AFTER the last digit change nothing. A zero between the point and a digit changes everything.',
      },
      why: 'Think about money: $3.4 and $3.40 are the same amount, 3 dollars and 4 dimes, with zero extra pennies. A zero on the right only says "none of this smaller size", so the amount stays the same. A zero between the point and a digit is different, because it pushes that digit into a smaller place.',
    },
    {
      kind: 'concept',
      head: 'Bring the point straight down',
      body: 'Once the points are lined up, add or subtract like normal whole numbers. Carry and borrow the usual way. Then drop the decimal point STRAIGHT down into your answer — it never wanders.',
      formula: { tex: '\\text{point in} \\to \\text{point out, same column}', note: 'Once the points are stacked, the answer point sits right below them.', parts: [{ sym: '\\text{same column}', means: 'the point never moves left or right', tone: 'accent' }, { sym: '\\text{straight down}', means: 'is the whole rule for adding decimals', tone: 'ok' }] },
      art: flow([
          { label: 'stack with points aligned' },
          { label: 'pad with zeros' },
          { label: 'add or subtract as usual' },
          { label: 'drop the point straight down' },
        ], { title: 'the decimal column routine', caption: 'The point never moves sideways — it falls straight into the answer.' }),
      why: 'The decimal point marks the spot where whole amounts end and parts begin. Adding never changes the size of a place: tenths plus tenths are still tenths. So the line between the ones and the tenths stays where it is, and the answer\'s point goes right below the others.',
    },
    {
      kind: 'example',
      head: 'Warm-up: 0.3 + 0.4',
      body: 'Both numbers have one decimal place, and the points already line up. What is 3 tenths plus 4 tenths?',
      steps: {
      steps: [
        { tex: '0.3 + 0.4', text: 'Both numbers only have a tenths place, so the points already line up. Nothing needs padding, and we can add right away.' },
        { tex: '3 + 4 = 7', text: 'Add the digits in the tenths column. Three tenths plus four tenths is seven tenths, just like 3 apples plus 4 apples is 7 apples.' },
        { tex: '0.7', text: 'Put the 7 in the tenths place, with the decimal point right in front of it. Seven tenths is written 0.7.' },
      ], answer: '0.7',
    },
    },
    {
      kind: 'example',
      head: 'Pad a zero: 3.4 + 1.25',
      body: 'The two numbers have different numbers of decimal places. How do you line them up and add them?',
      steps: {
      steps: [
        { tex: '3.40 + 1.25', text: 'Write 3.4 as 3.40. A zero on the right does not change the amount, and now both numbers have a hundredths column.' },
        { tex: '0 + 5 = 5', text: 'Add the hundredths first, on the right: 0 + 5 = 5. We start at the smallest place so any carry can move left to the next place.' },
        { tex: '4 + 2 = 6', text: 'Add the tenths: 4 + 2 = 6. Nothing is over 9, so there is nothing to carry and the 6 stays in the tenths place.' },
        { tex: '3 + 1 = 4', text: 'Add the ones: 3 + 1 = 4. Bring the decimal point straight down between the ones and the tenths, so every digit stays in its own place.' },
      ], answer: '4.65',
    },
    },
    {
      kind: 'example',
      head: 'Add with a carry: 0.75 + 0.5',
      body: 'One number has two decimal places and the other has one. Pad it, add, and watch for a column that goes over 9.',
      steps: {
      steps: [
        { tex: '0.75 + 0.50', text: 'Write 0.5 as 0.50 so both numbers have a hundredths column. Zeros on the right never change the value.' },
        { tex: '5 + 0 = 5', text: 'Add the hundredths: 5 + 0 = 5. Nothing is over 9 here, so there is nothing to carry yet.' },
        { tex: '7 + 5 = 12', text: 'Add the tenths: 7 + 5 = 12. A column holds one digit, so write the 2 and carry the 1, because 10 tenths make one whole.' },
        { tex: '0 + 0 + 1 = 1', text: 'Add the ones: 0 + 0 + the carried 1 = 1. Twelve tenths is one whole plus two tenths, so the answer is 1.25.' },
      ], answer: '1.25',
    },
    },
    {
      kind: 'example',
      head: 'A hidden point: 5 − 2.3',
      body: 'The 5 has no decimal point written. How do you line it up with 2.3 and subtract?',
      steps: {
      steps: [
        { tex: '5 = 5.0', text: 'A whole number has a hidden point right after its last digit. Write 5 as 5.0 so it has a tenths column that lines up with 2.3.' },
        { tex: '10 - 3 = 7', text: 'Tenths: 0 − 3 will not work, so borrow 1 from the ones. That 1 is worth 10 tenths, so we get 10 − 3 = 7 tenths.' },
        { tex: '4 - 2 = 2', text: 'Ones: the 5 gave one away, so it is now 4, and 4 − 2 = 2. Forgetting to lower the 5 to a 4 is a very common slip.' },
        { tex: '2.7', text: 'Drop the decimal point straight down between the 2 and the 7. Check by adding back: 2.7 + 2.3 = 5.0, which matches.' },
      ], answer: '2.7',
    },
    },
    {
      kind: 'example',
      head: 'Two carries: 2.6 + 3.45',
      body: 'This sum has a carry in more than one column. Where do the carries happen, and where do they go?',
      steps: {
      steps: [
        { tex: '2.60 + 3.45', text: 'Pad 2.6 to 2.60 so both numbers have a hundredths column. Now every column has a digit to add.' },
        { tex: '0 + 5 = 5', text: 'Add the hundredths: 0 + 5 = 5. The sum is under 10, so nothing carries and we move left.' },
        { tex: '6 + 4 = 10', text: 'Add the tenths: 6 + 4 = 10. Ten tenths make one whole, so write 0 in the tenths place and carry the 1 to the ones.' },
        { tex: '2 + 3 + 1 = 6', text: 'Add the ones: 2 + 3 + the carried 1 = 6. The point drops straight down, so the answer is 6.05.' },
      ], answer: '6.05',
    },
    },
    {
      kind: 'example',
      head: 'Borrow twice: 4.2 − 1.75',
      body: 'After padding, the top digit is too small in two different columns. Where do you borrow, and what happens to the neighbor?',
      steps: {
      steps: [
        { tex: '4.20 - 1.75', text: 'Pad 4.2 to 4.20 so both numbers have a hundredths column. Now each column has a top digit to subtract from.' },
        { tex: '10 - 5 = 5', text: 'Hundredths: 0 − 5 will not work, so borrow 1 tenth from the 2. That tenth is worth 10 hundredths, so 10 − 5 = 5.' },
        { tex: '11 - 7 = 4', text: 'Tenths: the 2 gave one away and is now 1, and 1 − 7 will not work. Borrow 1 from the ones to make 11 tenths, then 11 − 7 = 4.' },
        { tex: '3 - 1 = 2', text: 'Ones: the 4 gave one away and is now 3, so 3 − 1 = 2. Check by adding back: 2.45 + 1.75 = 4.20.' },
      ], answer: '2.45',
    },
    },
    {
      kind: 'example',
      head: 'Another way: think in cents',
      body: 'Money makes decimals easy. Can you turn $5.00 − $2.30 into whole numbers of cents and subtract those?',
      steps: {
      steps: [
        { tex: '\\$5.00 = 500\\text{ cents},\\ \\$2.30 = 230\\text{ cents}', text: 'Dollars with decimals are really a count of cents. Because 100 cents make a dollar, we can write both amounts as whole numbers of cents.' },
        { tex: '500 - 230 = 270', text: 'Subtract the whole numbers. Both amounts are counted in the same unit, cents, so we can subtract them like ordinary numbers.' },
        { tex: '270\\text{ cents} = \\$2.70', text: 'Change back to dollars by putting the point two places from the right, because 100 cents make one dollar. 270 cents is $2.70.' },
      ], answer: '\\$2.70',
    },
    },
    { kind: 'protip', head: 'Estimate before you compute', body: 'Round first: 3.4 + 1.25 is about 3 + 1 = 4, so the answer should be a little over 4. If you get 45.65 or 0.465, the decimal point slipped. A ten-second estimate catches almost every point mistake.' },
    {
      kind: 'trap',
      head: 'Trap: lining up the last digits',
      body: 'Stacking 3.4 over 1.25 by their LAST digits adds tenths to hundredths — total nonsense. Always line up the decimal POINTS, not the ends of the numbers. Pad with zeros so every column matches.',
      art: flow([{ label: '3.4 + 1.25', color: SKY }, { label: 'Points align, not the ends', color: EMR }, { label: 'Write 3.40, then add', color: VIO }], { title: 'The point is the anchor' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '1.25 + 0.34 = 1.59', lines: ['Lined up the ends', 'Read 3.4 as 0.34'], tone: 'bad' },
          { title: 'Right', tex: '3.40 + 1.25 = 4.65', lines: ['Points in one column', 'Padded with a zero'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: forgetting the hidden point',
      body: 'In 5 − 2.3, the 5 is really 5.0 — the point hides after the ones digit. If you skip that, you might write 5 − 2.3 = 2.3 or worse. Give whole numbers their decimal point and a zero before you subtract.',
      compare: { cols: [{ title: 'Written 5', tex: '5.0', lines: ['Point after the 5', 'Columns line up'], tone: 'ok' }, { title: 'Treated as 5', tex: '5\\ \\ \\ ', lines: ['No point to anchor', 'Columns drift'], tone: 'bad' }], note: 'Every whole number has a decimal point; it is just not written.' },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: drink and refill',
      body: 'A bottle holds 2.0 L. You pour out 0.75 L, then add back 0.3 L. How much is in it now? Do it in two parts.',
      steps: {
      steps: [
        { tex: '2.00 - 0.75', text: 'Pouring water out means subtracting. Pad 2.0 to 2.00 so the hundredths line up with 0.75.' },
        { tex: '2.00 - 0.75 = 1.25', text: 'Borrow across the zeros: 200 hundredths minus 75 hundredths is 125 hundredths, which is 1.25. Check: 1.25 + 0.75 = 2.00.' },
        { tex: '1.25 + 0.30', text: 'Adding water back means adding. Pad 0.3 to 0.30 so the hundredths line up with 1.25.' },
        { tex: '1.25 + 0.30 = 1.55', text: 'Add column by column: 5 + 0 = 5, 2 + 3 = 5, 1 + 0 = 1, with the point straight down. The bottle holds 1.55 L.' },
      ], answer: '1.55\\text{ L}',
    },
    },
    { kind: 'summary', head: 'Three moves, zero mistakes', body: 'Line up the decimal points in a straight column. Pad with zeros so both numbers have the same places. Compute like whole numbers and bring the point straight down. Estimate first to catch any slip!' },
  ],
  '6.NS-2': [
    {
      kind: 'objective',
      head: 'Multiply & divide decimals',
      body: 'Today you will multiply and divide decimals like a pro. The trick: work with whole numbers first, then put the decimal point where it belongs. Counting places does all the hard thinking for you.',
      art: flow([{ label: 'Multiply as whole numbers', color: SKY }, { label: 'Count the decimal places', color: AMB }, { label: 'Place the point', color: EMR }], { title: 'Digits first, point second' }),
    },
    {
      kind: 'concept',
      head: 'Multiply first, point later',
      body: 'To multiply decimals, ignore the points and multiply the whole numbers. Then count the decimal places in BOTH factors and add them up. Your answer gets exactly that many decimal places.',
      art: flow([{ label: 'Ignore the points and multiply' }, { label: 'Count decimal places in BOTH factors' }, { label: 'Put that many into the answer' }], { title: 'Digits first, point second' }),
      formula: {
        tex: '0.4 \\times 0.3 = 0.12',
        note: 'Do 4 × 3 = 12 first, then put back as many decimal places as went in.',
        parts: [
          { sym: '1 + 1', means: 'one place in each factor, so two places out', tone: 'accent' },
          { sym: '0.12', means: 'twelve hundredths — smaller than either factor', tone: 'ok' },
        ],
      },
      why: 'Every decimal is a whole number divided by 10, 100 and so on. So 0.4 × 0.3 is (4 ÷ 10) × (3 ÷ 10), which is 12 ÷ 100. You multiply the whole numbers first, then divide by one 10 for each decimal place. Counting places is just keeping track of those tens.',
    },
    {
      kind: 'concept',
      head: 'Why counting places works',
      body: 'A number like 0.6 is really 6 tenths, and 0.4 is 4 tenths. Tenths times tenths makes hundredths — that\'s two places. Every decimal place in a factor shifts the answer one more place.',
      formula: { tex: '0.6 \\times 0.4 = 0.24', note: 'Tenths times tenths gives hundredths. That is the whole rule.', parts: [{ sym: '\\text{one place}', means: 'each factor contributes its own places', tone: 'accent' }, { sym: '\\text{two places}', means: 'the answer carries the total of both', tone: 'ok' }] },
      art: areaModel(
        [{ label: '0.4', w: 4 }, { label: '', w: 6 }],
        [{ label: '0.3', h: 3 }, { label: '', h: 7 }],
        [['0.12', ''], ['', '']],
        { title: 'a unit square cut into hundredths', total: '12 little squares out of 100', caption: 'Tenths across times tenths down makes hundredths — that is where the places come from.' },
      ),
      why: 'Picture a square cut into 10 strips one way and 10 strips the other way, giving 100 little squares. A rectangle 0.4 wide and 0.3 tall covers 4 × 3 = 12 of them. Each little square is one hundredth, so the area is 12 hundredths, or 0.12.',
    },
    {
      kind: 'concept',
      head: 'Dividing? Slide both points',
      body: 'You\'re not allowed to be confused by a decimal divisor — so get rid of it! Move the decimal point right until the divisor is a whole number, and move the dividend\'s point the SAME number of spots. 4.8 ÷ 0.6 becomes 48 ÷ 6, which is easy.',
      art: flow([{ label: 'Move the divisor\'s point to the end', color: SKY }, { label: 'Slide the other one the same way', color: AMB }, { label: 'Now divide as usual', color: EMR }], { title: 'Both points move together' }),
      steps: {
      steps: [
        { tex: '1.44 \\div 0.4', text: 'Dividing by a decimal is awkward. We will turn this into an easier problem that has exactly the same answer.' },
        { tex: '14.4 \\div 4', text: 'Slide BOTH points one place right. That multiplies both numbers by 10, and scaling both the same way keeps the answer unchanged.' },
        { tex: '14.4 \\div 4 = 3.6', text: 'Divide as usual: 14 ÷ 4 is 3 with 2 left over, then 24 tenths ÷ 4 is 6 tenths. Keep the point straight above in the answer.' },
      ], answer: '3.6',
    },
      why: 'Multiplying both numbers in a division by 10 does not change the answer, just like 6 ÷ 3 and 60 ÷ 30 are both 2. Sliding a point one place right is the same as multiplying by 10. Doing it to both numbers makes the divisor whole and keeps the answer the same.',
    },
    {
      kind: 'concept',
      head: 'Estimate to place the point',
      body: 'Before computing, round and guess: 1.2 × 3 is about 1 × 3 = 3, so expect an answer near 3. Estimates tell you whether the answer should be 0.36, 3.6, or 36. The digits come from multiplying; the point comes from thinking.',
      formula: { tex: '0.6 \\times 0.4 \\approx \\text{less than } 0.6', note: 'Multiplying by less than one always makes the answer smaller.', parts: [{ sym: '< 1', means: 'a factor below one shrinks the other number', tone: 'accent' }, { sym: '\\text{estimate}', means: 'tells you roughly where the point belongs', tone: 'ok' }] },
      why: 'Rounding gives you a rough size to check against. The digits from multiplying can be perfect while the point is in the wrong spot. For 1.2 × 3, the digits are 36, and the estimate 1 × 3 = 3 tells you the answer is near 3, so it must be 3.6 and not 0.36 or 36.',
    },
    {
      kind: 'example',
      head: 'Warm-up: 0.3 × 0.7',
      body: 'Both numbers are less than 1. What do you do with the digits, and where does the decimal point go?',
      steps: {
      steps: [
        { tex: '3 \\times 7 = 21', text: 'Ignore the points for now and multiply 3 × 7. Whole-number facts are easy, and we fix the point afterwards.' },
        { tex: '1 + 1 = 2\\text{ places}', text: 'Count decimal places: 0.3 has one and 0.7 has one, so the answer needs two. Tenths times tenths make hundredths.' },
        { tex: '0.21', text: 'Start at the right end of 21 and move the point two places left. The answer, 21 hundredths, is smaller than both factors, as it should be.' },
      ], answer: '0.21',
    },
    },
    {
      kind: 'example',
      head: 'Multiply: 0.6 × 0.4',
      body: 'Multiply two tenths. How do you find the digits, and how many decimal places does the answer get?',
      steps: {
      steps: [
        { tex: '6 \\times 4 = 24', text: 'Ignore the points and multiply the whole numbers. 6 × 4 is a basic fact, so the digits are 24.' },
        { tex: '1 + 1 = 2\\text{ places}', text: 'Count the decimal places in both factors: one in 0.6 and one in 0.4. Add them to get two places in the answer.' },
        { tex: '0.24', text: 'Move the point two places in from the right end of 24. Check the size: 0.24 is smaller than 0.6 and 0.4, as a fraction of a fraction should be.' },
      ], answer: '0.24',
    },
    },
    {
      kind: 'example',
      head: 'One decimal factor: 1.2 × 3',
      body: 'Only one of the two factors has a decimal point. How many places does the answer get?',
      steps: {
      steps: [
        { tex: '12 \\times 3 = 36', text: 'Ignore the point and multiply the whole numbers 12 and 3. That gives the digits 36.' },
        { tex: '1 + 0 = 1\\text{ place}', text: 'Count the decimal places: 1.2 has one and 3 has none, so the answer gets one place. Only the places that are really there count.' },
        { tex: '3.6', text: 'Put the point one place from the right end of 36. Estimate to check: 1 × 3 = 3, and 3.6 is close to that.' },
      ], answer: '3.6',
    },
    },
    {
      kind: 'example',
      head: 'Divide: 2.5 ÷ 0.5',
      body: 'The divisor 0.5 is a decimal. How can you turn it into a whole number without changing the answer?',
      steps: {
      steps: [
        { tex: '2.5 \\div 0.5 = 25 \\div 5', text: 'Slide both points one place right. This multiplies both numbers by 10, which keeps the answer the same and makes the divisor whole.' },
        { tex: '25 \\div 5 = 5', text: 'Now divide the whole numbers: 25 ÷ 5 = 5. Dividing by a whole number is the kind of division you already know.' },
        { tex: '5 \\text{ halves}', text: 'Check with a picture: 2.5 is five halves because each whole holds two halves and there is one more half. So five halves fit.' },
      ], answer: '5',
    },
    },
    {
      kind: 'example',
      head: 'Divide: 4.8 ÷ 0.6',
      body: 'Make the divisor 0.6 a whole number first. What happens to the other number?',
      steps: {
      steps: [
        { tex: '4.8 \\div 0.6 = 48 \\div 6', text: 'Slide both points one place right. Both numbers are multiplied by 10, so the answer does not change.' },
        { tex: '48 \\div 6 = 8', text: 'Divide the whole numbers: 6 × 8 = 48, so 48 ÷ 6 = 8. Sliding the points made this an easy fact.' },
        { tex: '8 \\times 0.6 = 4.8', text: 'Check by multiplying back: 8 × 0.6 is 8 × 6 = 48 with one place, which is 4.8. That matches the start, so 8 is right.' },
      ], answer: '8',
    },
    },
    {
      kind: 'example',
      head: 'Trailing zero: 0.5 × 0.8',
      body: 'The digits multiply to something ending in zero. When do you drop that zero, and when must you not?',
      steps: {
      steps: [
        { tex: '5 \\times 8 = 40', text: 'Ignore the points and multiply 5 × 8. The digits are 40, and the zero is part of them for now.' },
        { tex: '1 + 1 = 2\\text{ places}', text: 'Count the decimal places first: one in 0.5 and one in 0.8, so two places. Place the point BEFORE you drop any zero.' },
        { tex: '0.40 = 0.4', text: 'Two places in from the right of 40 gives 0.40. A zero on the right of a decimal is free to drop, so forty hundredths is the same as four tenths.' },
      ], answer: '0.4',
    },
    },
    {
      kind: 'example',
      head: 'Another way: use fractions',
      body: 'Write each decimal as a fraction, multiply the fractions, then turn the answer back into a decimal.',
      steps: {
      steps: [
        { tex: '0.6 = \\tfrac{6}{10},\\ 0.4 = \\tfrac{4}{10}', text: 'A decimal with one place is that many tenths. So 0.6 is six tenths and 0.4 is four tenths.' },
        { tex: '\\tfrac{6}{10} \\times \\tfrac{4}{10} = \\tfrac{24}{100}', text: 'Multiply tops and bottoms. 6 × 4 = 24 on top and 10 × 10 = 100 on the bottom, which is why two decimal places appear.' },
        { tex: '\\tfrac{24}{100} = 0.24', text: 'Twenty-four hundredths is written 0.24. This matches the counting-places method, which is the proof that the rule works.' },
      ], answer: '0.24',
    },
    },
    { kind: 'protip', head: 'The answer can shrink', body: 'Multiplying by a number smaller than 1 makes things SMALLER: 0.6 × 0.4 = 0.24, less than both factors. That\'s not a mistake — you\'re taking a fraction of a fraction. Use it as a check: decimal × decimal under 1 should shrink.' },
    {
      kind: 'trap',
      head: 'Trap: counting only one factor',
      body: 'In 0.6 × 0.4, some kids count one decimal place and write 2.4 — ten times too big! Count the places in BOTH factors and add them: 1 + 1 = 2 places, so 0.24. Both factors always vote.',
      art: flow([{ label: '0.5 × 0.8', color: SKY }, { label: 'Two decimal places, not one', color: EMR }, { label: 'Answer is 0.40, not 4.0', color: ROSE }], { title: 'Count every factor' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '0.4 \\times 0.3 = 1.2', lines: ['Counted one place', 'Bigger than both'], tone: 'bad' },
          { title: 'Right', tex: '0.4 \\times 0.3 = 0.12', lines: ['Counted both', 'Smaller than both'], tone: 'ok' },
        ],
        note: 'Two numbers under 1 must make something smaller than either. That is your check.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: moving only one point',
      body: 'When dividing, if you shift the divisor\'s point you MUST shift the dividend\'s point the same amount. Turning 4.8 ÷ 0.6 into 4.8 ÷ 6 changes the problem completely. Both points slide together, always.',
      compare: { cols: [{ title: 'Both points', tex: '4.8 \\div 0.6 \\to 48 \\div 6', lines: ['Same ratio', 'Answer is 8'], tone: 'ok' }, { title: 'One point', tex: '4.8 \\div 6', lines: ['Ratio changed', 'Answer is 0.8'], tone: 'bad' }], note: 'Sliding both points keeps the division exactly the same.' },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: bag the rice',
      body: 'A 12 kg sack of rice fills bags of 0.8 kg each. How many bags can you fill?',
      steps: {
      steps: [
        { tex: '12 \\div 0.8', text: 'The question asks how many 0.8 kg bags fit in 12 kg, so it is a division. Write it as 12 ÷ 0.8.' },
        { tex: '12 \\div 0.8 = 120 \\div 8', text: 'Slide both points one place right. 12 is the same as 12.0, so it becomes 120, and 0.8 becomes 8. The answer stays the same.' },
        { tex: '120 \\div 8 = 15', text: 'Divide the whole numbers: 8 × 15 = 120, so the answer is 15. Check: 15 bags × 0.8 kg = 12 kg.' },
      ], answer: '15\\text{ bags}',
    },
    },
    {
      kind: 'summary',
      head: 'Digits first, point second',
      body: 'Multiply as whole numbers, then count decimal places in both factors to set the point. Divide by sliding BOTH points until the divisor is whole. Estimate first so the point lands in a sensible spot!',
      compare: {
        cols: [
          { title: 'Multiplying', tex: '\\times', lines: ['Ignore points', 'Count places at the end'], tone: 'accent' },
          { title: 'Dividing', tex: '\\div', lines: ['Slide BOTH points', 'Until the divider is whole'], tone: 'ok' },
        ],
      },
    },
  ],
  '6.NS-3': [
    {
      kind: 'objective',
      head: 'GCF, LCM & distributing',
      body: 'Today you will find the greatest common factor and least common multiple of two numbers. Then you\'ll use the GCF to rewrite sums in a slick factored form. These tools make big numbers break apart nicely.',
      art: flow([{ label: 'GCF: the biggest shared splitter', color: SKY }, { label: 'LCM: the first shared landing', color: AMB }, { label: 'Use the GCF to factor', color: EMR }], { title: 'Two factors, opposite jobs' }),
    },
    {
      kind: 'concept',
      head: 'GCF: the biggest shared divider',
      body: 'The Greatest Common Factor is the LARGEST number that divides evenly into both numbers. Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18 — the biggest one on both lists is 6.',
      formula: { tex: '\\gcd(a, b) = \\text{largest number dividing both}', note: 'The biggest block size that fits into both numbers exactly.', parts: [{ sym: '\\text{largest}', means: 'not just any common factor, the biggest one', tone: 'accent' }, { sym: '\\text{both}', means: 'it has to divide each number with no remainder', tone: 'ok' }] },
      art: tape([{ label: '12', boxes: 3, each: '4', color: SKY }, { label: '18', boxes: 3, each: '6', color: EMR }], { total: 'both split into 6s: GCF is 6', title: 'The largest piece that fits both', caption: 'A GCF is the biggest block size that divides both numbers with nothing left over.' }),
      table: {
        head: ['', 'factors', 'shared'],
        rows: [['12', '1, 2, 3, 4, 6, 12', ''], ['18', '1, 2, 3, 6, 9, 18', ''], ['GCF', '', '6']],
        mark: 2,
        note: 'List both sets, circle what appears in each, take the biggest one.',
      },
      why: 'A common factor is a block size that fits into both numbers with nothing left over. 12 can be built from blocks of 1, 2, 3, 4, 6 or 12, and 18 from blocks of 1, 2, 3, 6, 9 or 18. Both lists share 1, 2, 3 and 6, and the biggest of those is the largest block that builds both.',
    },
    {
      kind: 'concept',
      head: 'LCM: the smallest shared target',
      body: 'The Least Common Multiple is the SMALLEST number that both numbers divide into. List multiples of the bigger number and stop at the first one the smaller number also hits. For 4 and 6: multiples of 6 are 6, 12 … and 12 works for 4 too.',
      formula: { tex: '\\text{lcm}(a, b) = \\text{first number both reach}', note: 'Skip-count by each and the first place they meet is the LCM.', parts: [{ sym: '\\text{first}', means: 'the smallest number both counts land on', tone: 'accent' }, { sym: '\\text{both reach}', means: 'it must be a multiple of each number', tone: 'ok' }] },
      art: numberLine(0, 24, [{ at: 4, label: '4s', color: SKY }, { at: 8, color: SKY }, { at: 12, label: 'both!', color: VIO }, { at: 6, label: '6s', color: EMR }, { at: 18, color: EMR }], { title: 'The first place two skip-counts meet', caption: 'Count by fours and by sixes. Twelve is the first number both land on.' }),
      table: {
        head: ['', 'multiples', 'first match'],
        rows: [['4', '4, 8, 12, 16, 20', ''], ['6', '6, 12, 18, 24', ''], ['LCM', '', '12']],
        mark: 2,
        note: 'Count up in each number until the same value appears in both lists.',
      },
      why: 'Counting by 4s lists the numbers 4 can reach, and counting by 6s lists the numbers 6 can reach. A number in both lists is a spot where both counters land together, like two kids with different step sizes. The first spot they share, 12, is the least common multiple.',
    },
    {
      kind: 'concept',
      head: 'Which way does it point?',
      body: 'GCF divides INTO your numbers, so it\'s always smaller than (or equal to) them. LCM is what your numbers divide INTO, so it\'s always bigger than (or equal to) them. If your "GCF of 4 and 6" comes out as 12, you found the LCM instead.',
      art: flow([{ label: 'GCF: smaller, splits things up', color: SKY }, { label: 'LCM: bigger, lines things up', color: EMR }, { label: 'Ask: am I cutting or repeating?', color: VIO }], { title: 'Two tools, opposite directions' }),
      compare: {
        cols: [
          { title: 'GCF — divides IN', tex: '\\le \\text{both}', lines: ['Never bigger than either', 'Splitting into groups'], tone: 'accent' },
          { title: 'LCM — multiplies OUT', tex: '\\ge \\text{both}', lines: ['Never smaller than either', 'Events lining up'], tone: 'ok' },
        ],
        note: 'GCF shrinks, LCM grows. If your answer went the wrong way, you used the wrong one.',
      },
      why: 'A factor is a part of a number, so it can never be bigger than the number it divides. A multiple is the number times something, so it can never be smaller. That is why a GCF is at most the smaller number, and an LCM is at least the bigger number.',
    },
    {
      kind: 'concept',
      head: 'Distribute with the GCF',
      body: 'You can pull the GCF out of a sum like a common ingredient. Since 18 = 6 × 3 and 24 = 6 × 4, you can write 18 + 24 = 6(3 + 4). That\'s the distributive property running in reverse — factoring!',
      formula: { tex: '18 + 24 = 6(3 + 4)', note: 'Pull the shared factor out front and the sum becomes a product.', parts: [{ sym: '6', means: 'the greatest common factor of both numbers', tone: 'accent' }, { sym: '(3 + 4)', means: 'what is left when each is divided by six', tone: 'ok' }] },
      art: areaModel([{ label: '3', w: 2 }, { label: '4', w: 2 }], [{ label: '6', h: 1 }], [['18', '24']], { title: '18 + 24 = 6(3 + 4)', total: 'Pull the shared 6 out front', caption: 'Both numbers are built from sixes, so the six becomes the height of one wide box.' }),
      steps: {
      steps: [
        { tex: '12 + 18', text: 'Look for the biggest number that divides both terms. Pulling out the greatest one leaves the smallest numbers inside the brackets.' },
        { tex: '\\text{GCF} = 6', text: 'Six divides 12 (6 × 2) and 18 (6 × 3), and no bigger number divides both. So the greatest common factor is 6.' },
        { tex: '6(2) + 6(3)', text: 'Rewrite each number as 6 times something. This does not change any value, it only shows the shared 6.' },
        { tex: '6(2 + 3)', text: 'Pull the 6 outside the brackets, using the distributive property backwards. Check: 6 × 5 = 30 and 12 + 18 = 30.' },
      ], answer: '6(2 + 3)',
    },
      why: 'Multiplying spreads over adding: 6(3 + 4) means 6 groups of 3 plus 6 groups of 4, which is 18 + 24. Factoring just runs that backwards. Picture a rectangle 6 tall made of a part 3 wide and a part 4 wide; its area is the same however you count it.',
    },
    {
      kind: 'example',
      head: 'Warm-up: GCF of 8 and 12',
      body: 'Find the biggest number that divides both 8 and 12 with nothing left over. Start by listing the factors of each.',
      steps: {
      steps: [
        { tex: '8: 1, 2, 4, 8', text: 'List every factor of 8, the numbers that divide it exactly. They come in pairs: 1 × 8 and 2 × 4.' },
        { tex: '12: 1, 2, 3, 4, 6, 12', text: 'List every factor of 12 the same way. The pairs are 1 × 12, 2 × 6 and 3 × 4.' },
        { tex: '\\text{shared}: 1, 2, 4', text: 'Circle the numbers that appear on both lists. A shared factor divides 8 and 12 both, so only these three qualify.' },
        { tex: '\\text{GCF} = 4', text: 'The greatest means the biggest of the shared ones, which is 4. Check: 8 ÷ 4 = 2 and 12 ÷ 4 = 3 with nothing left over.' },
      ], answer: '4',
    },
    },
    {
      kind: 'example',
      head: 'GCF of 12 and 18',
      body: 'Use prime factors this time. Break each number into primes, then see which primes they share.',
      steps: {
      steps: [
        { tex: '12 = 2 \\times 2 \\times 3', text: 'Break 12 into prime numbers, which cannot be split any more. Primes are the basic building blocks of every number.' },
        { tex: '18 = 2 \\times 3 \\times 3', text: 'Break 18 into primes the same way. Now both numbers are written with the same kinds of blocks.' },
        { tex: '\\text{shared: } 2 \\text{ and } 3', text: 'Match them up. Both have one 2 and at least one 3, so the shared primes are a 2 and a 3.' },
        { tex: '2 \\times 3 = 6', text: 'Multiply the shared primes. They are the pieces both numbers are built from, so their product is the biggest number that divides both: GCF = 6.' },
      ], answer: '6',
    },
    },
    {
      kind: 'example',
      head: 'LCM of 4 and 6',
      body: 'Find the smallest number that both 4 and 6 divide into. List multiples until the lists meet.',
      steps: {
      steps: [
        { tex: '4, 8, 12, 16', text: 'Skip-count by 4 to list its multiples. A multiple is a number you reach by repeatedly adding 4.' },
        { tex: '6, 12, 18', text: 'Skip-count by 6 to list its multiples. We stop when we find a number that is also on the list for 4.' },
        { tex: '\\text{first match} = 12', text: 'Twelve is the first number on both lists, so both 4 and 6 divide it. 4 × 3 = 12 and 6 × 2 = 12. LCM = 12.' },
      ], answer: '12',
    },
    },
    {
      kind: 'example',
      head: 'LCM of 3 and 5',
      body: 'These numbers share no factors except 1. Does that give a shortcut for finding the LCM?',
      steps: {
      steps: [
        { tex: '3, 6, 9, 12, 15', text: 'Skip-count by 3 to list its multiples. We keep going until we know where the two lists must meet.' },
        { tex: '5, 10, 15', text: 'Skip-count by 5. The first number on both lists is 15, so 15 is the least common multiple.' },
        { tex: '3 \\times 5 = 15', text: 'There is a shortcut. Since 3 and 5 share no factors, no smaller number can be a multiple of both, so multiplying them gives the LCM right away.' },
      ], answer: '15',
    },
    },
    {
      kind: 'example',
      head: 'GCF of 16 and 24',
      body: 'Break 16 and 24 into primes, then multiply the primes that both numbers share.',
      steps: {
      steps: [
        { tex: '16 = 2 \\times 2 \\times 2 \\times 2', text: 'Break 16 into primes. It is four 2s multiplied together, since 2 × 2 = 4, 4 × 2 = 8 and 8 × 2 = 16.' },
        { tex: '24 = 2 \\times 2 \\times 2 \\times 3', text: 'Break 24 into primes the same way: three 2s and one 3. Check: 8 × 3 = 24.' },
        { tex: '\\text{shared: three } 2\\text{s}', text: 'Compare them. Both numbers have at least three 2s, but only 24 has a 3, so the shared primes are three 2s.' },
        { tex: '2 \\times 2 \\times 2 = 8', text: 'Multiply the shared primes to get the GCF. Check: 16 ÷ 8 = 2 and 24 ÷ 8 = 3, both exact, and no bigger number works.' },
      ], answer: '8',
    },
    },
    {
      kind: 'example',
      head: 'Rewrite 18 + 24 with the GCF',
      body: 'Pull the greatest common factor out of the sum 18 + 24, so it is written as a product.',
      steps: {
      steps: [
        { tex: '\\text{GCF}(18, 24) = 6', text: 'List the factors: 18 has 1, 2, 3, 6, 9, 18 and 24 has 1, 2, 3, 4, 6, 8, 12, 24. The biggest shared one is 6.' },
        { tex: '18 = 6 \\times 3,\\ 24 = 6 \\times 4', text: 'Write each number as 6 times something. The 6 is the shared factor, and the 3 and 4 are what is left over.' },
        { tex: '6(3 + 4)', text: 'Pull the 6 out front using the distributive property backwards. The leftovers 3 and 4 stay inside the brackets, still added.' },
        { tex: '6 \\times 7 = 42 = 18 + 24', text: 'Check by multiplying out: 6 × 7 = 42, and 18 + 24 is also 42. Both forms have the same value.' },
      ], answer: '6(3 + 4)',
    },
    },
    {
      kind: 'example',
      head: 'Another way: use prime factors',
      body: 'Find the LCM of 4 and 6 using primes instead of listing multiples.',
      steps: {
      steps: [
        { tex: '4 = 2 \\times 2,\\ 6 = 2 \\times 3', text: 'Break both numbers into primes. 4 has two 2s, and 6 has one 2 and one 3.' },
        { tex: '\\text{most of each prime}', text: 'Take each prime the greatest number of times it appears in either number: two 2s from the 4 and one 3 from the 6.' },
        { tex: '2 \\times 2 \\times 3 = 12', text: 'Multiply them. This number contains everything 4 needs and everything 6 needs, and nothing extra, so it is the least common multiple.' },
      ], answer: '12',
    },
    },
    { kind: 'protip', head: 'Primes make it automatic', body: 'Break both numbers into prime factors. GCF = multiply the primes they SHARE. LCM = multiply the shared primes once, plus every leftover prime. One factor tree answers both questions.' },
    {
      kind: 'trap',
      head: 'Trap: swapping GCF and LCM',
      body: 'The classic mix-up: answering 12 for "GCF of 4 and 6". Remember — GCF divides into the numbers (small), LCM is what they divide into (big). Say the direction out loud before you answer.',
      compare: {
        cols: [
          { title: 'GCF of 4 and 6', tex: '2', lines: ['SMALLER than both'], tone: 'accent' },
          { title: 'LCM of 4 and 6', tex: '12', lines: ['BIGGER than both'], tone: 'ok' },
        ],
        note: 'Check the size of your answer against the two numbers before you write it down.',
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: cut the ropes',
      body: 'Ropes of 24 m and 36 m are cut into equal pieces, as long as possible, with none left over. How long is each piece?',
      steps: {
      steps: [
        { tex: '\\text{GCF}(24, 36)', text: 'Equal pieces that leave nothing over must divide both lengths. The longest such piece is the greatest common factor.' },
        { tex: '24 = 2^3 \\times 3,\\ 36 = 2^2 \\times 3^2', text: 'Break both numbers into primes so we can see what they share. 24 is 2 × 2 × 2 × 3 and 36 is 2 × 2 × 3 × 3.' },
        { tex: '2 \\times 2 \\times 3 = 12', text: 'They share two 2s and one 3. Multiply them to get the GCF, which is 12.' },
        { tex: '24 \\div 12 = 2,\\ 36 \\div 12 = 3', text: 'Check: the first rope makes 2 pieces and the second makes 3, with nothing left over. A longer piece would not divide both.' },
      ], answer: '12\\text{ m}',
    },
    },
    { kind: 'summary', head: 'Divide in, multiply out', body: 'GCF: the biggest number dividing into both — find it with shared prime factors. LCM: the smallest number both divide into — scan multiples of the larger number. Pull the GCF out of a sum to write it as GCF × (sum): 18 + 24 = 6(3 + 4).' },
  ],
  '6.NS-4': [
    {
      kind: 'objective',
      head: 'Meet the negative numbers',
      body: 'Today you will work with integers — positive AND negative whole numbers. You\'ll compare them on a number line and measure their distance from zero with absolute value. Below zero is a real place, and you\'re about to map it.',
      art: flow([{ label: 'Zero is the middle', color: SKY }, { label: 'Further right is bigger', color: AMB }, { label: 'Absolute value measures distance', color: EMR }], { title: 'Life below zero' }),
    },
    {
      kind: 'concept',
      head: 'Negatives live below zero',
      body: 'Negative numbers describe things below a starting point: owing $5 is −5 dollars, a submarine 30 feet down is at −30 feet, and 4 degrees below freezing is −4°C. The minus sign means "on the other side of zero". Zero itself is neither positive nor negative.',
      formula: { tex: '-n < 0 < n \\ \\text{for } n > 0', note: 'Zero is the middle of the line, not the end of it.', parts: [{ sym: '-n', means: 'the mirror of n, sitting left of zero', tone: 'accent' }, { sym: '0', means: 'neither positive nor negative, the dividing point', tone: 'ok' }] },
      art: numberLine(-5, 5, [
          { at: -3, label: '−3', color: ROSE },
          { at: 0, label: '0', color: VIO },
          { at: 2, label: '2', color: EMR },
        ], { step: 1, title: 'one line, both directions', caption: 'Zero is the middle. Left of it is owing; right of it is having.' }),
      why: 'Counting numbers only go one way from the start, but life also goes the other way: owing money, going below freezing, diving under the sea. So the number line has to continue past zero. Each negative number is a mirror of a positive one, so −3 is as far left of zero as 3 is to the right.',
    },
    {
      kind: 'concept',
      head: 'Right is always bigger',
      body: 'On a number line, numbers grow as you move right and shrink as you move left. So 2 > −5 because 2 sits to the right. This rule never breaks — even deep in negative territory, −2 beats −7 because it\'s further right.',
      formula: { tex: 'a < b \\iff a \\text{ lies left of } b', note: 'One rule covers the whole line, signs included.', parts: [{ sym: '\\text{left}', means: 'means smaller, whatever the digits look like', tone: 'accent' }, { sym: '\\text{right}', means: 'means bigger, all the way along', tone: 'ok' }] },
      art: numberLine(-8, 4, [{ at: -5, label: '−5 is left', color: SKY }, { at: -2, label: '−2 is right', color: EMR }], { title: 'Further right always wins', caption: 'On a number line, bigger means further right — and −2 sits to the right of −5.' }),
      compare: {
        cols: [
          { title: '−7 and −2', tex: '-7 < -2', lines: ['−7 is further left', 'So it is smaller'], tone: 'accent' },
          { title: '7 and 2', tex: '7 > 2', lines: ['7 is further right', 'So it is bigger'], tone: 'ok' },
        ],
        note: 'Forget the digits. Whichever sits further right on the line is the bigger number.',
      },
      why: 'Each step to the right on a number line adds 1. So the further right you are, the more you have, even past zero: −2 is one step right of −3, so it is one bigger. A thermometer works the same way. Higher is warmer, and −2° is warmer than −7°.',
    },
    {
      kind: 'concept',
      head: 'Absolute value = distance from 0',
      body: 'The absolute value |x| asks one question: how FAR is x from zero? Distance is never negative, so |−7| = 7 and |7| = 7 too. The bars strip away the direction and keep only the distance.',
      art: numberLine(-8, 8, [{ at: -7, label: '−7', color: SKY }, { at: 7, label: '7', color: EMR }], { span: { from: -7, to: 0, label: '|−7| = 7 steps' }, title: 'Distance has no sign', caption: 'Both −7 and 7 are seven steps from zero, so both have absolute value 7.' }),
      formula: {
        tex: '|-7| = 7 \\qquad |7| = 7',
        note: 'Distance is never negative — it does not care which side of zero you started.',
        parts: [
          { sym: '|\\ |', means: 'how FAR from zero, ignoring direction', tone: 'accent' },
          { sym: '-7', means: 'position: seven steps to the LEFT', tone: 'warn' },
        ],
      },
      why: 'Imagine walking to zero. From −7 you take 7 steps, and from 7 you also take 7 steps. Steps are just a count, so they are never negative. The bars ask "how many steps from zero?" and not "which direction?", which is why the answer is never below 0.',
    },
    {
      kind: 'example',
      head: 'Warm-up: |−7|',
      body: 'Absolute value asks how far a number is from zero. How far is −7?',
      steps: {
      steps: [
        { tex: '-7 \\to 0', text: 'Picture the number line and count the steps from −7 back to 0. Walking 1, 2, 3, 4, 5, 6, 7 takes seven steps.' },
        { tex: '|-7| = 7', text: 'The bars ask only for the distance, not the direction. A distance is a count of steps, so it is positive: 7.' },
        { tex: '|7| = 7', text: 'Check with the mirror number. 7 is also seven steps from zero, but on the other side, so both numbers share the answer 7.' },
      ], answer: '7',
    },
    },
    {
      kind: 'example',
      head: 'Compare: −5 or −2?',
      body: 'Which is greater, −5 or −2? Picture the number line, and remember that right means bigger.',
      steps: {
      steps: [
        { tex: '-5\\ \\ -2\\ \\ 0', text: 'Picture the line. −5 is five steps left of zero and −2 is only two steps left, so −5 is further left.' },
        { tex: '-5 < -2', text: 'Left means smaller on a number line, so −5 is the smaller number and −2 is the greater one.' },
        { tex: '\\text{owing } \\$5 \\text{ vs } \\$2', text: 'Check with money. Owing 5 dollars is worse than owing 2 dollars, so −2 leaves you better off. That agrees: −2 > −5.' },
      ], answer: '-2 > -5',
    },
    },
    {
      kind: 'example',
      head: 'Compute: |−15|',
      body: 'The bars ask for distance from zero. How far from zero is −15?',
      steps: {
      steps: [
        { tex: '-15 \\to 0', text: 'Count the distance from −15 back to zero on the number line. It is fifteen steps to the right.' },
        { tex: '|-15| = 15', text: 'The bars report the distance and throw away the direction. A distance is never negative, so the answer is 15.' },
        { tex: '|15| = 15', text: 'Check: 15 sits fifteen steps on the other side of zero, so it has the same absolute value. Opposites always do.' },
      ], answer: '15',
    },
    },
    {
      kind: 'example',
      head: 'Order −3, 2, −8',
      body: 'Put −3, 2 and −8 in order from least to greatest. A quick number line makes this easy.',
      steps: {
      steps: [
        { tex: '-8\\ \\ -3\\ \\ 0\\ \\ 2', text: 'Mark each number on the line. −8 is eight steps left of zero, −3 is three steps left, and 2 is two steps right.' },
        { tex: '\\text{left} \\to \\text{right}', text: 'Read the dots from left to right. On a number line, the further left, the smaller the number, so this reads least to greatest.' },
        { tex: '-8 < -3 < 2', text: 'Write the order with less-than signs. Check: both negatives are below zero and 2 is above it, so 2 is greatest.' },
      ], answer: '-8 < -3 < 2',
    },
      art: numberLine(-10, 4, [{ at: -8, label: '−8', color: SKY }, { at: -3, label: '−3', color: AMB }, { at: 2, label: '2', color: EMR }], { title: 'Read them left to right', caption: 'Plot all three, then read off the order: −8, then −3, then 2.' }),
    },
    {
      kind: 'example',
      head: 'Diver vs kite',
      body: 'A diver is at −30 ft and a kite at 12 ft. Who is farther from sea level, which is 0? Compare the distances, not the numbers.',
      steps: {
      steps: [
        { tex: '|-30| = 30', text: 'Distance from sea level is the absolute value. The diver is 30 feet from zero, because 30 steps separate −30 from 0.' },
        { tex: '|12| = 12', text: 'The kite is 12 feet from zero. Distances count steps no matter which side of zero you are on.' },
        { tex: '30 > 12', text: 'Since 30 is bigger than 12, the diver is farther from sea level, even though −30 is the smaller NUMBER.' },
      ], answer: '\\text{the diver}',
    },
    },
    {
      kind: 'example',
      head: 'Another way: compare by distance',
      body: 'Which is greater, −5 or −2? This time, skip the picture and compare how far each is from zero.',
      steps: {
      steps: [
        { tex: '|-5| = 5,\\ |-2| = 2', text: 'Measure each number from zero. −5 is five steps out and −2 is only two steps out.' },
        { tex: '\\text{further out} \\to \\text{smaller}', text: 'For negative numbers, being further from zero means being further left. Further left means smaller, like a bigger debt.' },
        { tex: '-2 > -5', text: 'So −2, which is closer to zero, is the greater number. This agrees with the picture and with money: owing less is better.' },
      ], answer: '-2 > -5',
    },
    },
    { kind: 'protip', head: 'Tell a story with the sign', body: 'Stuck comparing negatives? Turn them into money: −5 means owing $5, −2 means owing $2. Owing less means you\'re better off, so −2 > −5. Real-life stories make signed numbers obvious.' },
    {
      kind: 'trap',
      head: 'Trap: "7 is bigger than 2"',
      body: 'It\'s true for positives, but −7 is LESS than −2! A bigger digit after a minus sign means further below zero — deeper in debt. Always compare positions on the line, not the bare digits.',
      art: numberLine(-10, 2, [{ at: -7, label: '−7', color: ROSE }, { at: -2, label: '−2 wins', color: EMR }], { title: 'Big digit, small number', caption: 'Seven is a bigger digit, but −7 sits further left, so −7 is the smaller number.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '-7 > -2', lines: ['Compared the digits', 'Ignored the sign'], tone: 'bad' },
          { title: 'Right', tex: '-7 < -2', lines: ['−7 is further left', 'Owing more is worse'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: bars that flip signs',
      body: 'Absolute value bars are not sign-flippers or parentheses. |−7| = 7 because distance is positive — but |7| is still 7, not −7. The bars never make a number negative.',
      compare: { cols: [{ title: '|-8|', tex: '= 8', lines: ['A distance', 'Always positive'], tone: 'ok' }, { title: '-|8|', tex: '= -8', lines: ['Minus outside the bars', 'Stays negative'], tone: 'bad' }], note: 'The bars measure; a minus outside them still applies afterwards.' },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: temperature swing',
      body: 'It is −3°C. The temperature drops 4°, then rises 5°. What is the final temperature?',
      steps: {
      steps: [
        { tex: '-3 - 4 = -7', text: 'A drop of 4 degrees means moving 4 steps down the thermometer. Starting below zero at −3, going down 4 puts you at −7.' },
        { tex: '-7 + 5 = -2', text: 'A rise of 5 degrees means moving 5 steps up: −6, −5, −4, −3, −2. You end below zero, because 5 is not enough to climb past 7.' },
        { tex: '-4 + 5 = +1', text: 'Check another way. The two changes together are −4 and +5, which is a net rise of 1 degree.' },
        { tex: '-3 + 1 = -2', text: 'Starting at −3 and rising 1 gives −2, which matches. The final temperature is −2°C.' },
      ], answer: '-2^\\circ\\text{C}',
    },
    },
    {
      kind: 'summary',
      head: 'Position and distance',
      body: 'Negatives sit below zero and describe debt, depth, and cold. Bigger always means further RIGHT on the number line, so −2 > −5. Absolute value is distance from zero — always positive. Two ideas, whole new number world!',
      compare: {
        cols: [
          { title: 'The number', tex: '-7', lines: ['WHERE it sits', 'Can be negative'], tone: 'accent' },
          { title: 'Its size', tex: '|-7| = 7', lines: ['HOW FAR from zero', 'Never negative'], tone: 'ok' },
        ],
      },
    },
  ],
  '6.NS-5': [
    {
      kind: 'objective',
      head: 'Master the coordinate plane',
      body: 'Today you will plot points in all four quadrants, not just the top-right corner. You\'ll name quadrants by their signs, measure distances along grid lines, and reflect points across the axes. The full map is yours now.',
      art: plotGrid([{ x: -2, y: 3, label: '(−2, 3)' }, { x: 4, y: 2, label: '(4, 2)' }, { x: -3, y: -2, label: '(−3, −2)' }, { x: 3, y: -3, label: '(3, −3)' }], { range: { x: [-5, 5], y: [-5, 5] }, title: 'One point in every quadrant', caption: 'The two axes cut the plane into four quadrants, and the pair of signs tells you which one.' }),
    },
    {
      kind: 'concept',
      head: '(x, y): across, then up or down',
      body: 'An ordered pair (x, y) is a set of directions from the origin (0, 0). The first number x says how far to go ACROSS — right if positive, left if negative. The second number y says how far up (positive) or down (negative).',
      formula: { tex: '(x,\\ y) = (\\text{across},\\ \\text{up})', note: 'Across first, always. Swap them and you land somewhere else.', parts: [{ sym: 'x', means: 'how far left or right of the origin', tone: 'accent' }, { sym: 'y', means: 'how far up or down from the origin', tone: 'ok' }] },
      art: plotGrid([
          { x: 3, y: 2, label: '(3, 2)', color: EMR },
          { x: -3, y: 2, label: '(−3, 2)', color: SKY },
          { x: -3, y: -2, label: '(−3, −2)', color: ROSE },
          { x: 3, y: -2, label: '(3, −2)', color: AMB },
        ], { range: { x: [-4, 4], y: [-3, 3] }, title: 'one point in each quadrant', caption: 'The signs alone tell you which quarter of the plane you are in.' }),
      why: 'Think of a street map: first you walk along the street, then you go up or down the stairs. Everyone agrees to do the across trip first, so each pair names exactly one spot. (3, 2) and (2, 3) are different spots, because the two trips happen in a different order.',
    },
    {
      kind: 'concept',
      head: 'Four quadrants, four sign combos',
      body: 'The axes slice the plane into four quadrants, numbered I, II, III, IV counterclockwise from the top-right. Quadrant I is (+, +), II is (−, +), III is (−, −), and IV is (+, −). Read a point\'s two signs and you instantly know its quadrant.',
      formula: { tex: '(+,+)\\ (-,+)\\ (-,-)\\ (+,-)', note: 'The pair of signs tells you which quadrant without plotting anything.', parts: [{ sym: '(+,+)', means: 'quadrant I, up and to the right', tone: 'accent' }, { sym: '(-,+)', means: 'quadrant II, up and to the left', tone: 'ok' }] },
      table: {
        head: ['quadrant', 'x', 'y'],
        rows: [['I (top right)', '+', '+'], ['II (top left)', '−', '+'], ['III (bottom left)', '−', '−'], ['IV (bottom right)', '+', '−']],
        note: 'Number them anticlockwise starting top right — that order never changes.',
      },
      why: 'Right of the y-axis, x is positive, and left of it x is negative. Above the x-axis, y is positive, and below it y is negative. Each quadrant is one choice of left or right plus one choice of up or down, so two signs name the quadrant without any plotting.',
    },
    {
      kind: 'concept',
      head: 'Distance along a grid line',
      body: 'If two points share an x-coordinate, they sit on the same vertical line — subtract the y-values for the distance. Share a y? Subtract the x-values. Distance is always positive, so take the absolute value of the difference.',
      art: plotGrid([{ x: 2, y: 1, label: '(2, 1)', color: SKY }, { x: 2, y: 6, label: '(2, 6)', color: EMR }], { join: true, range: { x: [0, 8], y: [0, 7] }, title: 'Matching x, so count the y', caption: 'Both points sit on x = 2, so the distance is simply 6 − 1 = 5.' }),
      steps: {
      steps: [
        { tex: '(2,\\ 1) \\text{ to } (2,\\ 7)', text: 'Both points have x = 2, so they stand on the same vertical line. The whole trip goes straight up.' },
        { tex: '7 - 1 = 6', text: 'Subtract the smaller y from the bigger y. This counts the steps between the two heights.' },
        { tex: '1 \\to 7: 6 \\text{ jumps}', text: 'Check by counting up the grid: from y = 1 to 2, 3, 4, 5, 6, 7 is six jumps. That agrees with the subtraction.' },
      ], answer: '6 \\text{ units}',
    },
      why: 'Same x means neither point is left or right of the other, so the whole trip is straight up or down. Counting steps between two heights is subtraction: from 1 up to 7 is 7 − 1 = 6. The absolute value just keeps the answer positive whichever point you name first.',
    },
    {
      kind: 'concept',
      head: 'Reflections flip one sign',
      body: 'Reflecting across the y-axis flips the point left-right, so the x-coordinate changes sign: (4, 3) → (−4, 3). Reflecting across the x-axis flips up-down, so y changes sign: (4, 3) → (4, −3). One mirror, one sign flip.',
      formula: { tex: '(a,\\ b) \\to (-a,\\ b) \\ \\text{across the } y\\text{-axis}', note: 'Mirror across an axis and exactly one coordinate changes sign.', parts: [{ sym: '-a', means: 'the x-sign flips when mirroring across y', tone: 'accent' }, { sym: 'b', means: 'the y-value is untouched by that mirror', tone: 'ok' }] },
      art: plotGrid([{ x: 4, y: 3, label: '(4, 3)', color: SKY }, { x: -4, y: 3, label: '(−4, 3)', color: EMR }], { range: { x: [-6, 6], y: [-2, 6] }, title: 'Mirror across the y-axis', caption: 'Reflecting across the y-axis flips the x-sign and leaves y exactly where it was.' }),
      compare: {
        cols: [
          { title: 'Over the x-axis', tex: '(3,\\ 2) \\to (3,\\ -2)', lines: ['y flips', 'x stays'], tone: 'accent' },
          { title: 'Over the y-axis', tex: '(3,\\ 2) \\to (-3,\\ 2)', lines: ['x flips', 'y stays'], tone: 'ok' },
        ],
        note: 'You cross an axis, so the coordinate measured AGAINST that axis changes sign.',
      },
      why: 'A mirror keeps the distance from the mirror the same but swaps the side. The y-axis mirror keeps your height but swaps left and right, so x changes sign. The x-axis mirror swaps above and below, so y changes sign. The coordinate you do not cross stays the same.',
    },
    {
      kind: 'example',
      head: 'Warm-up: plot (−2, 3)',
      body: 'Plot the point (−2, 3) by following its directions from the origin. Which region does it land in?',
      steps: {
      steps: [
        { tex: '(0,\\ 0)', text: 'Start at the origin, the point where the two axes cross. Every ordered pair is a set of directions from here.' },
        { tex: 'x = -2:\\ \\text{left } 2', text: 'The first number is x, and it comes first: across. It is negative, so go 2 steps LEFT of the origin.' },
        { tex: 'y = 3:\\ \\text{up } 3', text: 'The second number is y: up or down. It is positive, so go 3 steps UP from where you stopped.' },
        { tex: '\\text{left and up}', text: 'Left of the y-axis and above the x-axis is the top-left region. That is Quadrant II.' },
      ], answer: '\\text{Quadrant II}',
    },
    },
    {
      kind: 'example',
      head: 'Name the quadrant: (−3, 5)',
      body: 'You can name the quadrant just by reading the signs of x and y.',
      steps: {
      steps: [
        { tex: 'x = -3 < 0', text: 'The first coordinate is negative. Negative x means the point is left of the y-axis.' },
        { tex: 'y = 5 > 0', text: 'The second coordinate is positive. Positive y means the point is above the x-axis.' },
        { tex: '\\text{left and up}', text: 'Left and up is the top-left corner of the plane. The quadrants are numbered counterclockwise from top right, so this is Quadrant II.' },
      ], answer: '\\text{II}',
    },
    },
    {
      kind: 'example',
      head: 'Name the quadrant: (6, −2)',
      body: 'Read the two signs in (6, −2) to find which quadrant the point is in.',
      steps: {
      steps: [
        { tex: 'x = 6 > 0', text: 'The first coordinate is positive. Positive x means the point is to the right of the y-axis.' },
        { tex: 'y = -2 < 0', text: 'The second coordinate is negative. Negative y means the point is below the x-axis.' },
        { tex: '\\text{right and down}', text: 'Right and down is the bottom-right region. Counting counterclockwise from the top right, that is Quadrant IV.' },
      ], answer: '\\text{IV}',
    },
    },
    {
      kind: 'example',
      head: 'Vertical distance: (2, 1) to (2, 6)',
      body: 'Two points share the same x. How far apart are they?',
      steps: {
      steps: [
        { tex: 'x: 2 = 2', text: 'Both points have x = 2, so they are on the same vertical line. All of the distance is in the y-values.' },
        { tex: '6 - 1 = 5', text: 'Subtract the y-values, the bigger minus the smaller. This counts the steps from height 1 up to height 6.' },
        { tex: '1 \\to 6: 5 \\text{ jumps}', text: 'Check by counting up: 2, 3, 4, 5, 6 is five jumps. The two points are 5 units apart.' },
      ], answer: '5 \\text{ units}',
    },
    },
    {
      kind: 'example',
      head: 'Across the axis: (−3, 4) to (5, 4)',
      body: 'The two points are on opposite sides of the y-axis. How far apart are they?',
      steps: {
      steps: [
        { tex: 'y: 4 = 4', text: 'Both points have y = 4, so they sit on the same horizontal line. The distance is in the x-values.' },
        { tex: '5 - (-3) = 5 + 3 = 8', text: 'Subtract the x-values, the bigger minus the smaller. Subtracting a negative adds, because taking away a debt of 3 makes you 3 better off.' },
        { tex: '3 + 5 = 8', text: 'Check by counting on the grid: 3 steps from −3 to the y-axis, then 5 more steps to x = 5. That is 8 units.' },
      ], answer: '8 \\text{ units}',
    },
    },
    {
      kind: 'example',
      head: 'Reflect (4, 3) across the y-axis',
      body: 'Reflect the point (4, 3) across the y-axis. Which coordinate changes?',
      steps: {
      steps: [
        { tex: '\\text{mirror: the } y\\text{-axis}', text: 'The y-axis is a vertical line, so it works like a mirror that swaps left and right. Up and down do not change.' },
        { tex: 'x: 4 \\to -4', text: 'The point is 4 steps right of the mirror, so its image is 4 steps left. That is the same distance on the other side, so x flips sign.' },
        { tex: 'y = 3', text: 'The y-value stays 3, because the point is reflected sideways and stays at the same height.' },
        { tex: '(-4,\\ 3)', text: 'Put them together to get the image. Both points are 4 from the y-axis, so the mirror line sits exactly halfway between them.' },
      ], answer: '(-4,\\ 3)',
    },
    },
    {
      kind: 'example',
      head: 'Another way: count to the mirror line',
      body: 'Reflect (3, 2) across the y-axis by counting steps to the mirror instead of using a sign rule.',
      steps: {
      steps: [
        { tex: '3 \\text{ right of the axis}', text: 'Count how far the point is from the y-axis, the mirror line. It is 3 steps to the right.' },
        { tex: '3 \\text{ left of the axis}', text: 'A mirror image is the same distance from the mirror, on the other side. So go 3 steps left of the axis.' },
        { tex: '(-3,\\ 2)', text: 'Stay at the same height, y = 2, because the mirror only swaps left and right. The image is (−3, 2), the same answer the sign rule gives.' },
      ], answer: '(-3,\\ 2)',
    },
    },
    { kind: 'protip', head: 'Signs are a GPS', body: 'Before plotting, read the signs like directions: (+, +) means right-up, (−, +) left-up, (−, −) left-down, (+, −) right-down. You\'ll know the quadrant before your pencil moves. It also catches plotting mistakes instantly.' },
    {
      kind: 'trap',
      head: 'Trap: going up before across',
      body: 'The order in (x, y) is not optional: across FIRST, then up or down. Plotting (−3, 5) by going up 5 then left 3 might feel the same, but swapping the numbers gives (5, −3) — a completely different point. Run before you jump, even with negatives.',
      art: plotGrid([{ x: 3, y: 5, label: '(3, 5) correct', color: EMR }, { x: 5, y: 3, label: '(5, 3) swapped', color: ROSE }], { range: { x: [0, 7], y: [0, 7] }, title: 'Order matters in a pair', caption: 'Swap the two numbers and you land somewhere else entirely. x always goes first.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '(3,\\ 2) \\to \\text{up 3, right 2}', lines: ['Lands on (2, 3)'], tone: 'bad' },
          { title: 'Right', tex: '(3,\\ 2) \\to \\text{right 3, up 2}', lines: ['x is always first'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: line length',
      body: 'A vertical segment runs from (2, 5) to (2, −1). It crosses the x-axis. How long is it?',
      steps: {
      steps: [
        { tex: 'x: 2 = 2', text: 'Both points have x = 2, so the segment is vertical and its length is found from the y-values.' },
        { tex: '5 - (-1) = 5 + 1 = 6', text: 'Subtract the y-values, bigger minus smaller. Subtracting a negative adds, because the segment crosses the x-axis.' },
        { tex: '5 + 1 = 6', text: 'Check by counting: 5 units down from y = 5 to the x-axis, then 1 more unit down to y = −1. That is 6 units in all.' },
      ], answer: '6 \\text{ units}',
    },
    },
    { kind: 'summary', head: 'The whole plane, unlocked', body: 'Plot (x, y) by going across first, then up or down — signs give the direction. Quadrants I–IV are named by the sign pair. Grid-line distance: subtract the coordinates that differ and take absolute value. Reflections flip exactly one sign.' },
  ],
  '6.NS-6': [
    {
      kind: 'objective',
      head: 'Divide fractions with a flip',
      body: 'Today you will divide a fraction by a fraction — the boss level of fraction skills. The move is called Keep-Change-Flip, and it turns every division into a multiplication. You\'ll also see WHY it works.',
      art: flow([{ label: 'Keep the first fraction', color: SKY }, { label: 'Change ÷ into ×', color: AMB }, { label: 'Flip the second one', color: EMR }], { title: 'Keep, Change, Flip' }),
    },
    {
      kind: 'concept',
      head: 'Division asks "how many fit?"',
      body: 'The problem 1/2 ÷ 1/4 asks: how many quarter-pieces fit inside one half? Picture a half sandwich cut into quarters — two of them fit. That\'s why dividing by a small fraction gives a BIG answer.',
      formula: { tex: 'a \\div \\tfrac{1}{n} = a \\times n', note: 'Dividing by a small piece gives a big answer — how many fit inside.', parts: [{ sym: '\\tfrac{1}{n}', means: 'the small piece you are fitting in', tone: 'accent' }, { sym: '\\times n', means: 'flipping it is what makes the answer grow', tone: 'ok' }] },
      art: fractionBar(8, 8, { label: '8 quarters fit in 2 wholes', title: '2 ÷ ¼ — how many quarters?', caption: 'Dividing by a small piece gives a BIG answer, because many of them fit.' }),
      why: 'Division is about fitting: 6 ÷ 2 asks how many 2s fit into 6. With fractions it is the same question. Quarters are small pieces, so many of them fit into a bigger piece: two quarters make a half. Small pieces give a bigger count.',
    },
    {
      kind: 'concept',
      head: 'Keep, Change, Flip',
      body: 'KEEP the first fraction exactly as it is. CHANGE the ÷ sign to ×. FLIP the second fraction upside-down — its reciprocal. So 3/4 ÷ 1/2 becomes 3/4 × 2/1.',
      art: flow([{ label: 'Keep the first fraction', color: SKY }, { label: 'Change ÷ into ×', color: AMB }, { label: 'Flip the second fraction', color: EMR }, { label: 'Multiply straight across', color: VIO }], { title: 'Four moves, no thinking required' }),
      formula: {
        tex: '\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}',
        note: 'Keep the first, change the sign to times, flip the second.',
        parts: [
          { sym: '\\text{Keep}', means: 'the first fraction does not move', tone: 'accent' },
          { sym: '\\text{Change}', means: 'divide becomes multiply', tone: 'ok' },
          { sym: '\\text{Flip}', means: 'the SECOND fraction turns upside down', tone: 'warn' },
        ],
      },
      why: 'Dividing by 1/4 asks how many quarters fit in each whole, and the answer is 4, so dividing by 1/4 is the same as multiplying by 4. The flipped fraction 4/1 is exactly that "how many fit in one whole" number. Keep-Change-Flip is this one fact used on every fraction.',
    },
    {
      kind: 'concept',
      head: 'Why flipping works',
      body: 'Dividing by 1/2 means asking how many halves fit — and 2 halves fit in every whole, so it\'s the same as multiplying by 2. The reciprocal 2/1 IS that "how many fit per whole" number. Flipping isn\'t a magic trick; it\'s the fitting rate.',
      art: fractionBar(2, 1, { label: '1 ÷ ½ asks how many halves', second: { parts: 2, shaded: 2, label: 'the answer is 2' }, title: 'Dividing by a half doubles', caption: 'Dividing by a number smaller than one makes the answer BIGGER — flipping is what captures that.' }),
      steps: {
      steps: [
        { tex: '1 \\div \\tfrac{1}{4}', text: 'This asks how many quarter-pieces fit inside one whole. Think of cutting a pizza into quarters.' },
        { tex: '4', text: 'Four quarters make one whole, so four pieces fit. That is the count the division is looking for.' },
        { tex: '1 \\times \\tfrac{4}{1} = 4', text: 'Multiplying by the flipped fraction 4/1 gives the same 4. So flipping is just a shortcut for the number of pieces per whole.' },
      ],
    },
      why: 'One whole holds 4 quarters, so dividing by 1/4 is the same as multiplying by 4. The same works for 3/4: one whole holds 4/3 pieces of size 3/4, because 3/4 × 4/3 = 1. The flipped fraction is always how many times the piece fits in one whole.',
    },
    {
      kind: 'concept',
      head: 'Then multiply straight across',
      body: 'After the flip, it\'s a multiplication you already know: tops times tops, bottoms times bottoms. Finish by simplifying — divide top and bottom by their GCF. An answer like 6/4 should leave home as 3/2.',
      formula: { tex: '\\dfrac{a}{b} \\times \\dfrac{d}{c} = \\dfrac{ad}{bc}', note: 'Tops multiply with tops, bottoms with bottoms.', parts: [{ sym: 'ad', means: 'the two numerators multiplied', tone: 'accent' }, { sym: 'bc', means: 'the two denominators multiplied', tone: 'ok' }] },
      why: 'Multiplying fractions means taking a fraction of a fraction. Half of a half is a quarter: tops 1 × 1 = 1 and bottoms 2 × 2 = 4. Cutting a whole into b parts and then each part into c parts makes b × c parts, so the bottoms multiply and the tops count how many you keep.',
    },
    {
      kind: 'example',
      head: 'Warm-up: 1/2 ÷ 1/4',
      body: 'How many quarters fit inside one half? Use Keep-Change-Flip to find out, then see if it makes sense.',
      steps: {
      steps: [
        { tex: '\\tfrac{1}{2} \\times \\tfrac{4}{1}', text: 'Keep 1/2, change ÷ to ×, and flip 1/4 to 4/1. Dividing by a fraction is the same as multiplying by its flip.' },
        { tex: '\\tfrac{1 \\times 4}{2 \\times 1} = \\tfrac{4}{2}', text: 'Multiply the tops, 1 × 4 = 4, and multiply the bottoms, 2 × 1 = 2. That gives four halves.' },
        { tex: '\\tfrac{4}{2} = 2', text: 'Simplify by dividing top and bottom by 2. Four halves is the same as 2, so two quarters fit in a half, just like the picture shows.' },
      ], answer: '2',
    },
    },
    {
      kind: 'example',
      head: 'Check it with a picture',
      body: '1/3 ÷ 1/6 asks how many sixths fit inside one third. Use a picture first, then see if Keep-Change-Flip agrees.',
      steps: {
      steps: [
        { tex: '\\tfrac{1}{3} = \\tfrac{2}{6}', text: 'Cut a pizza slice that is one third in half. Each piece is a sixth of the whole pizza, so one third is two sixths.' },
        { tex: '\\text{two sixths fit}', text: 'The question asks how many sixths fit in a third. We just saw that the answer is 2.' },
        { tex: '\\tfrac{1}{3} \\times \\tfrac{6}{1} = \\tfrac{6}{3} = 2', text: 'Now do Keep-Change-Flip: keep 1/3, change to ×, flip 1/6 to 6/1. Six thirds simplifies to 2, so the picture and the rule agree.' },
      ], answer: '2',
    },
    },
    {
      kind: 'example',
      head: 'Bigger than 1: 3/4 ÷ 1/2',
      body: 'How many halves fit in three quarters? Use Keep-Change-Flip, then simplify.',
      steps: {
      steps: [
        { tex: '\\tfrac{3}{4} \\times \\tfrac{2}{1}', text: 'Keep 3/4, change ÷ to ×, and flip the second fraction 1/2 into 2/1. Only the fraction you divide BY gets flipped.' },
        { tex: '\\tfrac{3 \\times 2}{4 \\times 1} = \\tfrac{6}{4}', text: 'Multiply the tops, 3 × 2 = 6, and the bottoms, 4 × 1 = 4. The result is six quarters.' },
        { tex: '\\tfrac{6}{4} = \\tfrac{3}{2}', text: 'Simplify by dividing the top and bottom by their GCF, 2. The answer is 3/2, which is 1 and a half.' },
        { tex: '\\tfrac{3}{2} > \\tfrac{3}{4}', text: 'Sense check: halves are bigger than quarters, so we expect to fit a bit more than one half into three quarters. 3/2 is bigger than 1, so it makes sense.' },
      ], answer: '\\tfrac{3}{2}',
    },
    },
    {
      kind: 'example',
      head: 'Divide BY a whole number: 2/3 ÷ 4',
      body: 'Share 2/3 equally among 4 people. Turn the whole number into a fraction, then use Keep-Change-Flip.',
      steps: {
      steps: [
        { tex: '4 = \\tfrac{4}{1}', text: 'A whole number can be written as a fraction over 1 without changing its value. Now we can divide by it like any other fraction.' },
        { tex: '\\tfrac{2}{3} \\times \\tfrac{1}{4}', text: 'Keep 2/3, change ÷ to ×, and flip 4/1 to 1/4. Dividing by 4 is the same as taking one quarter of the amount.' },
        { tex: '\\tfrac{2}{12}', text: 'Multiply the tops, 2 × 1 = 2, and the bottoms, 3 × 4 = 12. This is the amount each person gets, before simplifying.' },
        { tex: '\\tfrac{2}{12} = \\tfrac{1}{6}', text: 'Divide top and bottom by 2. Check: 4 people with 1/6 each is 4/6, which simplifies to 2/3, the amount we started with.' },
      ], answer: '\\tfrac{1}{6}',
    },
    },
    {
      kind: 'example',
      head: 'Full workout: 5/6 ÷ 1/2',
      body: 'Keep, change, flip, multiply, then simplify. Watch which fraction gets flipped.',
      steps: {
      steps: [
        { tex: '\\tfrac{5}{6} \\times \\tfrac{2}{1}', text: 'Keep 5/6, change ÷ to ×, and flip 1/2 into 2/1. The first fraction stays exactly as it is.' },
        { tex: '\\tfrac{5 \\times 2}{6 \\times 1} = \\tfrac{10}{6}', text: 'Multiply the tops, 5 × 2 = 10, and the bottoms, 6 × 1 = 6. That gives ten sixths.' },
        { tex: '\\tfrac{10}{6} = \\tfrac{5}{3}', text: 'Simplify by dividing top and bottom by their GCF, 2. The answer 5/3 is 1 and two thirds.' },
        { tex: '\\tfrac{5}{3} > \\tfrac{5}{6}', text: 'Sense check: we divided by a number under 1, so the answer should be bigger than 5/6. And 5/3 is bigger, so it passes.' },
      ], answer: '\\tfrac{5}{3}',
    },
    },
    {
      kind: 'example',
      head: 'Another way: use common denominators',
      body: 'Divide 3/4 ÷ 1/2 by renaming both fractions so they have the same bottom. Then what is left to divide?',
      steps: {
      steps: [
        { tex: '\\tfrac{1}{2} = \\tfrac{2}{4}', text: 'Rename 1/2 as 2/4 by multiplying the top and bottom by 2. The value stays the same, but now both fractions are measured in quarters.' },
        { tex: '\\tfrac{3}{4} \\div \\tfrac{2}{4}', text: 'The problem is now 3 quarters divided by 2 quarters. Pieces of the same size can simply be counted.' },
        { tex: '3 \\div 2 = \\tfrac{3}{2}', text: 'Divide the tops: 3 pieces divided into groups of 2 pieces is 3/2. The size of the piece no longer matters, so it matches Keep-Change-Flip.' },
      ], answer: '\\tfrac{3}{2}',
    },
    },
    {
      kind: 'protip',
      head: 'Predict big or small first',
      body: 'Before computing, ask: is the divisor smaller than 1? Then lots of pieces fit, so expect an answer BIGGER than the first fraction. Dividing by a number bigger than 1 shrinks things. This one prediction catches flipped-the-wrong-fraction errors instantly.',
      steps: {
      steps: [
        { tex: '\\text{divisor} < 1', text: 'Look at the number you are dividing BY. If it is under 1, it is a small piece, so lots of pieces will fit.' },
        { tex: '\\text{answer grows}', text: 'So the answer must be bigger than the number you started with. Example: 3/4 ÷ 1/2 = 3/2, which is bigger than 3/4.' },
        { tex: '\\text{divisor} > 1', text: 'If you divide by something bigger than 1, the answer shrinks instead, because a big piece fits fewer times.' },
      ],
    },
    },
    {
      kind: 'trap',
      head: 'Trap: flipping both fractions',
      body: 'Only the SECOND fraction gets flipped — the one you\'re dividing by. Flipping both turns 1/2 ÷ 1/4 into 2/1 × 4/1 = 8, instead of the true answer 2. Keep the first, flip the second, never both.',
      art: flow([{ label: 'Flip ONLY the second one', color: EMR }, { label: 'Flipping both changes the answer', color: ROSE }], { title: 'One flip, not two', caption: 'The first fraction is kept exactly as it is. Only the divisor turns upside down.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\tfrac{2}{3} \\div \\tfrac{1}{4} = \\tfrac{3}{2} \\times \\tfrac{4}{1}', lines: ['Flipped both', 'Answer is wrong'], tone: 'bad' },
          { title: 'Right', tex: '\\tfrac{2}{3} \\times \\tfrac{4}{1} = \\tfrac{8}{3}', lines: ['Only the second flips'], tone: 'ok' },
        ],
      },
    },
    { kind: 'trap', head: 'Trap: flipping before changing the sign', body: 'Some kids flip the second fraction but keep the ÷ sign — then divide again and tie themselves in knots. The three moves come as a set: keep, CHANGE ÷ to ×, flip. Say all three out loud every time.' },
    {
      kind: 'challenge',
      head: 'Extra credit: how many batches',
      body: 'You have 3 cups of flour and each batch needs 3/4 cup. How many batches can you make?',
      steps: {
      steps: [
        { tex: '3 \\div \\tfrac{3}{4}', text: 'The question asks how many 3/4-cup scoops fit in 3 cups, so it is a division. Write 3 as 3/1.' },
        { tex: '3 \\times \\tfrac{4}{3} = \\tfrac{12}{3}', text: 'Keep 3, change ÷ to ×, and flip 3/4 to 4/3. Multiply the tops, 3 × 4 = 12, and keep the bottom 3.' },
        { tex: '\\tfrac{12}{3} = 4', text: 'Divide 12 by 3 to get 4 batches. Sense check: each cup holds a little more than one batch, so three cups should give about four.' },
        { tex: '4 \\times \\tfrac{3}{4} = 3', text: 'Check by multiplying back: 4 batches at 3/4 cup each uses 12/4 = 3 cups, exactly the flour we have.' },
      ], answer: '4 \\text{ batches}',
    },
    },
    {
      kind: 'summary',
      head: 'Keep-Change-Flip forever',
      body: 'Division asks how many of the second fraction fit in the first. Keep the first fraction, change ÷ to ×, flip the second. Multiply straight across and simplify. Dividing by a fraction under 1 makes the answer grow!',
      art: flow([
          { label: 'Keep the first fraction' },
          { label: 'Change ÷ into ×' },
          { label: 'Flip the second fraction' },
          { label: 'Multiply straight across' },
        ], { title: 'four words, every time', caption: 'Say them in order and fraction division stops being scary.' }),
    },
  ],
  '6.NS-7': [
    {
      kind: 'objective',
      head: 'Big adds & subtracts, nailed',
      body: 'Today you will add and subtract multi-digit numbers quickly and correctly. Carrying and borrowing become automatic when you treat each column like its own mini-problem. Stack, solve, done.',
      art: flow([{ label: 'Line up by place value', color: SKY }, { label: 'Carry when ten spills over', color: AMB }, { label: 'Borrow when you run short', color: EMR }], { title: 'Column arithmetic, mastered' }),
    },
    {
      kind: 'concept',
      head: 'Stack by place value',
      body: 'Write the numbers on top of each other with ones under ones, tens under tens, hundreds under hundreds. Straight columns are half the battle. Then work column by column, starting from the ones on the right.',
      formula: { tex: '\\text{ones under ones, tens under tens}', note: 'Line up by place value, then work right to left.', parts: [{ sym: '\\text{place value}', means: 'what makes the columns line up correctly', tone: 'accent' }, { sym: '\\text{right to left}', means: 'so carries and borrows flow the right way', tone: 'ok' }] },
      art: flow([{ label: 'Line up ones under ones' }, { label: 'Tens under tens' }, { label: 'Then work right to left' }], { title: 'Columns before arithmetic', caption: 'Almost every stacking mistake is really a lining-up mistake.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\begin{matrix} 482 \\\\ 37 \\end{matrix}', lines: ['Left-aligned', 'Tens under hundreds'], tone: 'bad' },
          { title: 'Right', tex: '\\begin{matrix} 482 \\\\ \\ 37 \\end{matrix}', lines: ['Right-aligned', 'Ones under ones'], tone: 'ok' },
        ],
      },
      why: 'A digit is worth different amounts in different columns: the 8 in 482 is 8 tens, and the 3 in 37 is 3 tens. We can only add or subtract amounts of the same size, ones with ones and tens with tens. Straight columns make that happen. Start on the right, because carries and borrows move left.',
    },
    {
      kind: 'concept',
      head: 'Carrying: ten spills over',
      body: 'When a column adds to 10 or more, it overflows. Write the ones digit of the sum and carry the 1 into the NEXT column to the left. That carry is a real ten (or hundred) changing places — don\'t drop it.',
      formula: { tex: '10 \\text{ ones} = 1 \\text{ ten}', note: 'A column can only hold nine. The tenth moves next door.', parts: [{ sym: '10', means: 'the moment a column overflows', tone: 'accent' }, { sym: '1 \\text{ ten}', means: 'what carries into the next column left', tone: 'ok' }] },
      art: tape([{ label: 'ones', boxes: 10, each: '1', color: SKY }, { label: 'becomes', boxes: 1, each: '10', color: EMR }], { total: 'ten ones trade for one ten', title: 'Ten of anything trades up', caption: 'A column can only hold nine. The tenth one moves next door as a single carry.' }),
      steps: {
      steps: [
        { tex: '8 + 7 = 15', text: 'Add the ones column. Fifteen is too big for one column, because a column only holds the digits 0 to 9.' },
        { tex: '\\text{write } 5', text: 'Fifteen ones is 1 ten and 5 ones. Write the 5 ones in the ones column, where they belong.' },
        { tex: '\\text{carry } 1', text: 'Pass the ten to the tens column as a small 1. That ten is a real amount, so if you drop it your answer will be 10 too small.' },
      ],
    },
      why: 'Each column can only hold the digits 0 to 9, because ten of one place is the same as one of the next place up, like ten pennies trading for a dime. If a column adds up to 15, that is 1 ten and 5 ones. Write the 5 and pass the ten to the next column.',
    },
    {
      kind: 'concept',
      head: 'Borrowing: trade from a neighbor',
      body: 'When the top digit is too small to subtract from, borrow from the column to its left. The neighbor gives up 1 (worth ten of yours), so 2 − 7 becomes 12 − 7. The neighbor\'s digit drops by 1 — write it down so you don\'t forget.',
      formula: { tex: '1 \\text{ ten} = 10 \\text{ ones}', note: 'Break a ten into ten ones so the column has enough to subtract from.', parts: [{ sym: '1 \\text{ ten}', means: 'taken from the neighbour on the left', tone: 'accent' }, { sym: '10 \\text{ ones}', means: 'added to the column that ran short', tone: 'ok' }] },
      art: tape([{ label: 'one ten', boxes: 1, each: '10', color: EMR }, { label: 'becomes', boxes: 10, each: '1', color: SKY }], { total: 'borrow once, gain ten ones', title: 'Borrowing is trading down', caption: 'You break a ten into ten ones so the column above has enough to subtract from.' }),
      steps: {
      steps: [
        { tex: '4 - 7', text: 'The top digit 4 is smaller than 7, so we cannot take 7 away from it. We need more ones to work with.' },
        { tex: '\\text{take } 1 \\text{ ten} = 10 \\text{ ones}', text: 'Borrow 1 ten from the tens column and trade it for 10 ones. The value is the same, and the tens digit goes down by 1.' },
        { tex: '14 - 7 = 7', text: 'Now the ones column has 4 + 10 = 14, which is plenty. Subtract: 14 − 7 = 7.' },
      ],
    },
      why: 'Borrowing is making change. If you owe 7 pennies but only have 4, you trade one dime for 10 pennies and now have 14. Your money is the same, just in smaller coins. That is why the tens digit drops by 1 while the ones digit gains 10.',
    },
    {
      kind: 'example',
      head: 'Warm-up: 34 + 25',
      body: 'Stack 34 and 25 by place value and add column by column, starting on the right.',
      steps: {
      steps: [
        { tex: '\\begin{matrix} 34 \\\\ +25 \\end{matrix}', text: 'Stack the numbers with ones under ones and tens under tens. Then we add from the right, in case something has to carry.' },
        { tex: '4 + 5 = 9', text: 'Add the ones: 4 + 5 = 9. That is a single digit, so nothing carries into the tens.' },
        { tex: '3 + 2 = 5', text: 'Add the tens: 3 + 2 = 5. Put the 5 in the tens place to make the answer 59.' },
      ], answer: '59',
    },
    },
    {
      kind: 'example',
      head: 'One carry: 618 + 274',
      body: 'Add 618 and 274 column by column. One column goes over 9, so a carry is needed.',
      steps: {
      steps: [
        { tex: '8 + 4 = 12', text: 'Add the ones column first. Twelve is over 9, so it has to be split into 1 ten and 2 ones.' },
        { tex: '\\text{write } 2,\\ \\text{carry } 1', text: 'Write the 2 ones in the answer and carry the 1 ten to the tens column. The carry is a real ten, so it must be added.' },
        { tex: '1 + 7 + 1 = 9', text: 'Add the tens: the 1 from 618, the 7 from 274 and the carried 1. That makes 9, which is under 10, so nothing carries.' },
        { tex: '6 + 2 = 8', text: 'Add the hundreds: 6 + 2 = 8. Reading the columns left to right gives 892.' },
      ], answer: '892',
    },
    },
    {
      kind: 'example',
      head: 'Carry twice: 425 + 376',
      body: 'Add 425 and 376. Watch for carries in two columns, and do not drop either one.',
      steps: {
      steps: [
        { tex: '5 + 6 = 11', text: 'Add the ones: 5 + 6 = 11. That is 1 ten and 1 one, so write 1 and carry the 1 ten.' },
        { tex: '2 + 7 + 1 = 10', text: 'Add the tens: 2 + 7 plus the carried 1 makes 10. Ten tens is a hundred, so write 0 and carry 1 to the hundreds.' },
        { tex: '4 + 3 + 1 = 8', text: 'Add the hundreds: 4 + 3 plus the carried 1 makes 8, with nothing left to carry. The answer is 801.' },
      ], answer: '801',
    },
    },
    {
      kind: 'example',
      head: 'Borrow twice: 952 − 387',
      body: 'Subtract 387 from 952. The top digit is too small in two different columns, so you must borrow twice.',
      steps: {
      steps: [
        { tex: '12 - 7 = 5', text: 'Ones: 2 is smaller than 7, so borrow 1 ten, which is worth 10 ones. Now we have 12 − 7 = 5, and the 5 tens become 4.' },
        { tex: '14 - 8 = 6', text: 'Tens: the 4 tens are smaller than 8, so borrow 1 hundred, which is worth 10 tens. Now we have 14 − 8 = 6, and the 9 hundreds become 8.' },
        { tex: '8 - 3 = 5', text: 'Hundreds: after lending, 8 − 3 = 5. Reading the columns gives 565.' },
        { tex: '565 + 387 = 952', text: 'Check by adding back: subtraction and addition undo each other, so 565 + 387 should return 952, and it does.' },
      ], answer: '565',
    },
    },
    {
      kind: 'example',
      head: 'Across the zeros: 500 − 173',
      body: 'The top number has zeros in the ones and tens, so there is nothing to borrow from nearby. Where does the borrow come from?',
      steps: {
      steps: [
        { tex: '0 - 3', text: 'The ones column cannot subtract 3 from 0, and the tens digit is 0, so it has nothing to lend either. We must go to the hundreds.' },
        { tex: '5 \\text{ hundreds} \\to 4 \\text{ hundreds} + 10 \\text{ tens}', text: 'Borrow 1 hundred from the 5, which is worth 10 tens. Now the tens column has 10 to work with.' },
        { tex: '10 \\text{ tens} \\to 9 \\text{ tens} + 10 \\text{ ones}', text: 'Now lend 1 ten to the ones column, which is worth 10 ones. The tens become 9, and the ones become 10.' },
        { tex: '10 - 3 = 7,\\ 9 - 7 = 2,\\ 4 - 1 = 3', text: 'Subtract each column: ones 10 − 3 = 7, tens 9 − 7 = 2, and hundreds 4 − 1 = 3. Check: 327 + 173 = 500.' },
      ], answer: '327',
    },
    },
    {
      kind: 'example',
      head: 'Boss level: 1003 − 247',
      body: 'Borrow has to travel across two zeros to reach the thousands. Take it one column at a time.',
      steps: {
      steps: [
        { tex: '1003 = 9 \\text{ hundreds},\\ 9 \\text{ tens},\\ 13 \\text{ ones}', text: 'The ones and tens cannot lend, so borrow from the thousand. One thousand is 10 hundreds, and passing the borrow along gives 9 hundreds, 9 tens and 13 ones.' },
        { tex: '13 - 7 = 6', text: 'Ones: 13 − 7 = 6. The 13 came from keeping 3 ones and getting 10 more from a ten.' },
        { tex: '9 - 4 = 5,\\ 9 - 2 = 7', text: 'Tens: 9 − 4 = 5. Hundreds: 9 − 2 = 7. The thousands column has nothing left, so the answer is three digits.' },
        { tex: '756 + 247 = 1003', text: 'Check by adding back: 756 + 247 = 1003. It works, so 756 is right.' },
      ], answer: '756',
    },
    },
    {
      kind: 'example',
      head: 'Another way: count up to subtract',
      body: 'Find 1250 − 187 without borrowing. Count up from 187 to 1250 in friendly jumps, and add up the jumps.',
      art: numberLine(150, 1300, [{ at: 187, label: '187', color: SKY }, { at: 1250, label: '1250', color: EMR }], { span: { from: 187, to: 1250, label: 'the gap is 1063' }, title: 'Subtraction is the gap', caption: 'Instead of borrowing, count up from the smaller number. The distance you travel is the answer.' }),
      steps: {
      steps: [
        { tex: '187 + 13 = 200', text: 'Jump from 187 up to the next hundred, 200. That jump is 13, and landing on a round number makes the next jumps easy.' },
        { tex: '200 + 1000 = 1200', text: 'Jump from 200 up by 1000 to land on 1200. Big round jumps are easy to do in your head.' },
        { tex: '1200 + 50 = 1250', text: 'Finish with a jump of 50 to reach 1250, the number we are counting up to.' },
        { tex: '13 + 1000 + 50 = 1063', text: 'The answer to the subtraction is the total distance travelled, the sum of the jumps. Check: 187 + 1063 = 1250.' },
      ], answer: '1063',
    },
    },
    {
      kind: 'protip',
      head: 'Check subtraction by adding back',
      body: 'Subtraction and addition undo each other. After computing 952 − 387 = 565, add back: 565 + 387 should return 952 — and it does. This check catches borrowing slips in seconds.',
      steps: {
      steps: [
        { tex: '952 - 387 = 565', text: 'Do the subtraction first and get your answer, which is the amount left after taking 387 away.' },
        { tex: '565 + 387 = 952', text: 'Now add the answer to the amount you took away. If you did it right, you must land back on the number you started with.' },
      ],
    },
      formula: {
        tex: 'a - b = c \\ \\Longrightarrow\\ c + b = a',
        note: 'Add your answer to what you took away. If you do not land back on the start, try again.',
      },
    },
    { kind: 'trap', head: 'Trap: the vanishing carry', body: 'The most common error: computing 2 + 7 = 9 in the tens of 425 + 376 and FORGETTING the carried 1 from the ones. Write every carry as a small 1 above the next column. Carries and borrows always move to the next-larger place — never skip one.' },
    { kind: 'trap', head: 'Trap: subtracting upside-down', body: 'In 952 − 387, the ones column shows 2 − 7. You cannot sneakily flip it to 7 − 2 = 5 — that changes the problem! When the top digit is smaller, you must BORROW, not swap.' },
    {
      kind: 'challenge',
      head: 'Extra credit: library count',
      body: 'A library has 1250 books, loans out 187, then buys 340 more. How many books does it have now?',
      steps: {
      steps: [
        { tex: '1250 - 187', text: 'Loaning books out takes books away, so subtract. Borrow across the zero in the tens by taking from the hundreds first.' },
        { tex: '1250 - 187 = 1063', text: 'The subtraction gives 1063. Check by adding back: 1063 + 187 = 1250.' },
        { tex: '1063 + 340', text: 'Buying books adds to what the library has, so now we add. Stack by place value: ones under ones.' },
        { tex: '1063 + 340 = 1403', text: 'Ones: 3 + 0 = 3. Tens: 6 + 4 = 10, so write 0 and carry 1. Hundreds: 0 + 3 + 1 = 4. Thousands: 1. The answer is 1403 books.' },
      ], answer: '1403 \\text{ books}',
    },
    },
    { kind: 'summary', head: 'Column by column wins', body: 'Stack numbers by place value and work right to left. Sums of 10+ carry a 1 to the next column; too-small digits borrow 10 from the left neighbor. Zeros pass the borrow along. Add back to check every subtraction!' },
  ],
  '6.NS-8': [
    {
      kind: 'objective',
      head: 'Line up signed numbers',
      body: 'Today you will compare and order numbers with signs — positives, negatives, and zero. One picture solves everything: the number line. Left is smaller, right is bigger, no exceptions.',
      art: flow([{ label: 'Picture the number line', color: SKY }, { label: 'Further right always wins', color: AMB }, { label: 'Negatives lose to positives', color: EMR }], { title: 'Comparing signed numbers' }),
    },
    {
      kind: 'concept',
      head: 'Right is bigger. Always.',
      body: 'On the number line, values grow as you travel right and shrink as you travel left. This works everywhere on the line — positive side, negative side, and across zero. To compare two numbers, just ask which one sits further right.',
      formula: { tex: 'a < b \\iff a \\text{ is further left}', note: 'One rule for the whole line, no special cases for signs.', parts: [{ sym: '\\text{further left}', means: 'is always the smaller number', tone: 'accent' }, { sym: '\\text{digits}', means: 'never decide it — only position does', tone: 'bad' }] },
      art: numberLine(-9, 3, [
          { at: -9, label: '−9', color: ROSE },
          { at: -4, label: '−4', color: AMB },
          { at: 0, label: '0', color: VIO },
          { at: 1, label: '1', color: EMR },
        ], { step: 3, title: 'smallest on the left, biggest on the right', caption: 'Ordering signed numbers is just reading the line from left to right.' }),
      why: 'Each step to the right on the number line adds 1. Starting at −9 and walking right you reach −8, −7, and so on, each one bigger than the last, then zero, then the positives. A thermometer works the same way: higher is warmer, so being further up or right always means bigger.',
    },
    {
      kind: 'concept',
      head: 'Every negative loses to every positive',
      body: 'All negatives live left of zero and all positives live right of it. So ANY positive beats ANY negative: even tiny 1 is greater than mighty-looking −100. Zero sits in the middle — bigger than every negative, smaller than every positive.',
      formula: { tex: 'a < 0 < b \\implies a < b', note: 'Zero is the dividing line, and it settles every mixed comparison.', parts: [{ sym: 'a < 0', means: 'anything left of zero', tone: 'accent' }, { sym: '0 < b', means: 'anything right of zero, which always wins', tone: 'ok' }] },
      art: numberLine(-8, 8, [{ at: -4, label: 'negatives', color: ROSE }, { at: 0, label: '0', color: VIO }, { at: 4, label: 'positives', color: EMR }], { title: 'Zero is the dividing line', caption: 'Everything left of zero is smaller than everything right of it, no matter the digits.' }),
      why: 'Negative numbers are below zero, positive numbers are above zero, and zero sits between them. Think of money: owing 100 dollars can never leave you with more than having 1 dollar. Anything below zero is always below anything above zero, whatever the digits look like.',
    },
    {
      kind: 'concept',
      head: 'Among negatives, closer to zero wins',
      body: 'Between two negatives, the one CLOSER to zero is greater, because it\'s further right. So −4 > −9, even though 9 is a bigger digit than 4. Think temperature: −4° is warmer than −9°.',
      formula: { tex: '-1 > -9', note: 'Among negatives, the smaller distance from zero is the bigger number.', parts: [{ sym: '-1', means: 'only one step from zero, so further right', tone: 'accent' }, { sym: '-9', means: 'nine steps out, so further left and smaller', tone: 'ok' }] },
      art: numberLine(-10, 2, [{ at: -9, label: '−9 loses', color: ROSE }, { at: -1, label: '−1 wins', color: EMR }], { span: { from: -9, to: -1, label: '−1 is 8 steps further right' }, title: 'Closer to zero is bigger' }),
      compare: {
        cols: [
          { title: '−4 vs −9', tex: '-4 > -9', lines: ['−4 is nearer zero', 'Owing less'], tone: 'ok' },
          { title: '4 vs 9', tex: '4 < 9', lines: ['Further from zero', 'Having more'], tone: 'accent' },
        ],
        note: 'With negatives the bigger digit means the SMALLER number. That flip is the whole lesson.',
      },
      why: 'Owing less is better. −4 means owing 4 dollars and −9 means owing 9 dollars, so −4 leaves you with more. On a thermometer, −4° is only 4 below freezing, which is warmer than −9°. A bigger digit after the minus sign means a bigger debt, so a smaller number.',
    },
    {
      kind: 'example',
      head: 'Warm-up: −3 or 1?',
      body: 'Which is greater, −3 or 1? One is negative and one is positive.',
      steps: {
      steps: [
        { tex: '1 > 0', text: '1 is positive, so it sits to the right of zero. Every positive number is on the right side of the line.' },
        { tex: '-3 < 0', text: '−3 is negative, so it sits to the left of zero. Every negative number is on the left side of the line.' },
        { tex: '1 > -3', text: 'Right beats left, so 1 is greater. Check with money: owing 3 dollars is worse than having 1 dollar.' },
      ], answer: '1 > -3',
    },
    },
    {
      kind: 'example',
      head: 'Two negatives: −4 or −9?',
      body: 'Both numbers are negative, so the digits can fool you. Which is greater, −4 or −9?',
      steps: {
      steps: [
        { tex: '|-4| = 4,\\ |-9| = 9', text: 'Both numbers are left of zero. −4 is only 4 steps out and −9 is 9 steps out.' },
        { tex: '-9 \\text{ lies left of } -4', text: 'Picture them on the line. The one further from zero is further left, so −9 is to the left of −4.' },
        { tex: '-4 > -9', text: 'Further right means bigger, so −4 is greater. Check with money: owing 4 dollars is better than owing 9.' },
      ], answer: '-4 > -9',
    },
    },
    {
      kind: 'example',
      head: 'And again: −1 or −7?',
      body: 'Another pair of negatives. Which is greater, −1 or −7?',
      steps: {
      steps: [
        { tex: '|-1| = 1,\\ |-7| = 7', text: 'Measure how far each is from zero. −1 is one step out and −7 is seven steps out.' },
        { tex: '\\text{closer to } 0 \\to \\text{further right}', text: 'Among negatives, the number closer to zero is further right on the line. Further right means bigger.' },
        { tex: '-1 > -7', text: 'So −1 is the greater number. Check with temperature: −1° is much warmer than −7°.' },
      ], answer: '-1 > -7',
    },
    },
    {
      kind: 'example',
      head: 'Order −2, 0, −5',
      body: 'Put −2, 0 and −5 in order from least to greatest. Start with the most negative.',
      steps: {
      steps: [
        { tex: '-5 \\text{ is furthest left}', text: 'The most negative number is the one furthest from zero on the left. That is −5, five steps out, so it is the least.' },
        { tex: '-2 \\text{ next}', text: '−2 is only two steps left of zero, so it is closer to zero than −5. That puts it to the right of −5.' },
        { tex: '0 \\text{ last}', text: 'Zero beats every negative number because it is further right. Nothing here is positive, so zero is the greatest.' },
      ], answer: '-5 < -2 < 0',
    },
    },
    {
      kind: 'example',
      head: 'Order −3, 2, −5',
      body: 'Put −3, 2 and −5 in order from least to greatest. Sketch a quick number line.',
      steps: {
      steps: [
        { tex: '-5\\ \\ -3\\ \\ 0\\ \\ 2', text: 'Mark each number on the line. −5 is five steps left of zero, −3 is three steps left, and 2 is two steps right.' },
        { tex: '\\text{read left to right}', text: 'Reading left to right goes from smallest to biggest. The negatives come first, with −5 further left than −3.' },
        { tex: '-5 < -3 < 2', text: 'Write the order with less-than signs. The positive number 2 is last, because every positive beats every negative.' },
      ], answer: '-5 < -3 < 2',
    },
    },
    {
      kind: 'example',
      head: 'Real life: coldest city',
      body: 'Overnight temperatures: Oslo −8°, Denver 3°, Chicago −2°. Which city is coldest? Colder means smaller.',
      art: numberLine(-10, 5, [{ at: -8, label: 'Oslo', color: SKY }, { at: -2, label: 'Chicago', color: AMB }, { at: 3, label: 'Denver', color: EMR }], { title: 'Temperatures on the same line', caption: 'The coldest reading is the one furthest left, which is Oslo at −8.' }),
      steps: {
      steps: [
        { tex: '\\text{colder} = \\text{smaller}', text: 'On a thermometer, colder means lower, and lower means further left on the number line. So we are looking for the smallest number.' },
        { tex: '-8 < -2 < 3', text: 'Compare them: 3 is positive so it is the greatest. Among −8 and −2, the one nearer zero is bigger, so −2 > −8.' },
        { tex: '\\text{Oslo} = -8', text: 'The smallest is −8, so Oslo is coldest and Denver, at 3°, is warmest. Eight degrees below zero is colder than two below.' },
      ], answer: '\\text{Oslo}',
    },
    },
    {
      kind: 'example',
      head: 'Another way: use distance from zero',
      body: 'Order −5, −8 and −2 from least to greatest by comparing how far each is from zero.',
      steps: {
      steps: [
        { tex: '|-5| = 5,\\ |-8| = 8,\\ |-2| = 2', text: 'Measure each number from zero. Since all three are negative, the distances show how deep each one goes.' },
        { tex: '\\text{farthest from } 0 \\to \\text{smallest}', text: 'Among negatives, the one farthest from zero is the smallest, like the biggest debt. So −8 is the least and −2 is the greatest.' },
        { tex: '-8 < -5 < -2', text: 'Write the order from least to greatest. Check with debts: owing 8 is worse than owing 5, which is worse than owing 2.' },
      ], answer: '-8 < -5 < -2',
    },
    },
    { kind: 'protip', head: 'Sketch a mini number line', body: 'For any ordering question, draw a quick line, mark 0 in the middle, and drop a dot for each number. Then just read the dots left to right — the ordering does itself. Ten seconds of sketching beats a minute of second-guessing.' },
    {
      kind: 'trap',
      head: 'Trap: big digit, small number',
      body: 'Kids see −10 and −2 and think −10 is bigger because 10 beats 2. Backwards! A bigger digit after a minus means further LEFT, so −10 < −2. Negative numbers reverse the size order of their digits.',
      art: numberLine(-10, 2, [{ at: -8, label: '−8', color: ROSE }, { at: -2, label: '−2 is bigger', color: EMR }], { title: 'Ignore the digit, watch the position', caption: 'Eight beats two as a digit, but −8 sits further left, so it is the smaller number.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '-9 > -4', lines: ['9 beats 4?', 'Not with a minus'], tone: 'bad' },
          { title: 'Right', tex: '-9 < -4', lines: ['Nine steps left', 'Further from zero'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'challenge',
      head: 'Extra credit: rank the divers',
      body: 'Divers are at −5, −8, −12 and −20 m. List them from lowest to highest.',
      steps: {
      steps: [
        { tex: '|-5|, |-8|, |-12|, |-20|', text: 'All four depths are negative, so compare how far each is from sea level. The distances are 5, 8, 12 and 20 meters.' },
        { tex: '\\text{deepest} = \\text{lowest}', text: 'The diver furthest below sea level is the lowest, and the lowest number is the furthest left. So −20 is lowest.' },
        { tex: '-20 < -12 < -8 < -5', text: 'Keep going in order of how deep they are. As the depths get smaller, the numbers get bigger, because they get closer to zero.' },
        { tex: '\\text{lowest to highest}', text: 'Read the list from left to right: −20, −12, −8, −5. The diver at −5 is the highest, only 5 meters down.' },
      ], answer: '-20,\\ -12,\\ -8,\\ -5',
    },
    },
    { kind: 'summary', head: 'One line rules them all', body: 'Right is bigger, left is smaller — everywhere on the number line. Every positive beats every negative, with zero in between. Among negatives, closer to zero is greater. Sketch the line and read your answer!' },
  ],
  '6.NS-9': [
    {
      kind: 'objective',
      head: 'Opposites & absolute value',
      body: 'Today you will flip numbers to their opposites and measure distance from zero with absolute value. Two simple ideas — a mirror and a ruler — that power all of integer math. You\'ll even stack them together.',
      art: flow([{ label: 'Opposite: mirror across zero', color: SKY }, { label: 'Absolute value: distance from zero', color: AMB }, { label: 'One flips, one measures', color: EMR }], { title: 'Mirror or ruler?' }),
    },
    {
      kind: 'concept',
      head: 'Opposites: the mirror across zero',
      body: 'The opposite of a number is its mirror image on the other side of 0, the same distance away. The opposite of 5 is −5; the opposite of −5 is 5. Zero is its own opposite — it\'s standing on the mirror.',
      formula: { tex: '\\text{opposite of } a = -a', note: 'Same distance from zero, other side. A mirror, not a minus button.', parts: [{ sym: '-a', means: 'the reflection of a across zero', tone: 'accent' }, { sym: '\\text{same distance}', means: 'the mirror never changes how far out it is', tone: 'ok' }] },
      art: numberLine(-8, 8, [
          { at: -7, label: '−7', color: ROSE },
          { at: 0, label: '0', color: VIO },
          { at: 7, label: '7', color: EMR },
        ], { step: 2, title: 'same distance, other side', caption: 'Opposites are the same number of steps from zero, just in opposite directions.' }),
      why: 'A mirror shows your reflection the same distance behind it as you are in front. Here zero is the mirror. 5 is five steps right of zero, so its opposite is five steps left: −5. Zero is standing on the mirror, so it is its own opposite.',
    },
    {
      kind: 'concept',
      head: 'Opposite of an opposite goes home',
      body: 'Flip a number twice and you\'re back where you started: −(−n) = n. The opposite of the opposite of 3 is… 3. Every extra minus sign is one more flip across zero.',
      formula: {
        tex: '-(-3) = 3',
        note: 'Flip across zero, then flip back — you land exactly where you started.',
      },
      why: 'Each opposite is one flip across zero. One flip sends 3 to −3, and a second flip sends −3 back to 3. It is like turning a light switch off and then on again, or turning around twice: after two flips you are facing the way you started.',
    },
    {
      kind: 'concept',
      head: 'Absolute value: the distance ruler',
      body: 'The bars |n| measure how far n is from zero — nothing more. Distance can\'t be negative, so |n| is always 0 or positive. Opposites like 6 and −6 have the SAME absolute value, because they\'re the same distance out.',
      formula: { tex: '|a| \\ge 0 \\ \\text{always}', note: 'A ruler reports how far, never which way.', parts: [{ sym: '|\\ |', means: 'measures distance from zero', tone: 'accent' }, { sym: '\\ge 0', means: 'you cannot walk a negative number of steps', tone: 'ok' }] },
      art: numberLine(-14, 14, [{ at: -12, label: '−12', color: SKY }], { span: { from: -12, to: 0, label: '|−12| = 12' }, title: 'Measure, do not judge', caption: 'Absolute value only measures how far from zero you are. It never reports which way.' }),
      compare: {
        cols: [
          { title: 'Opposite', tex: '-(-3) = 3', lines: ['A mirror', 'Can give a negative'], tone: 'accent' },
          { title: 'Absolute value', tex: '|-3| = 3', lines: ['A ruler', 'Never negative'], tone: 'ok' },
        ],
        note: 'One asks "which side?", the other asks "how far?".',
      },
      why: 'Absolute value is a distance, and distance counts steps, not directions. 6 and −6 are both 6 steps from zero, so they share the same absolute value. You cannot walk a negative number of steps, so the result is never below 0.',
    },
    {
      kind: 'example',
      head: 'Warm-up: opposite of 7',
      body: 'The opposite of a number is its mirror image across zero. What is the opposite of 7?',
      steps: {
      steps: [
        { tex: '7 \\text{ is 7 right of } 0', text: 'Find where 7 sits. It is seven steps to the right of zero on the number line.' },
        { tex: '\\text{mirror: 7 left of } 0', text: 'An opposite is the same distance from zero on the other side, like a reflection. So go seven steps to the left.' },
        { tex: '-7', text: 'Seven steps left of zero is −7, so the opposite of 7 is −7. The two numbers are the same distance from zero.' },
      ], answer: '-7',
    },
    },
    {
      kind: 'example',
      head: 'Opposite of −15',
      body: 'What is the opposite of −15? Find where it sits, then flip it across zero.',
      steps: {
      steps: [
        { tex: '-15 \\text{ is 15 left of } 0', text: 'Find where −15 sits. It is fifteen steps to the left of zero on the number line.' },
        { tex: '\\text{mirror: 15 right of } 0', text: 'The opposite is the same distance from zero on the other side, so go fifteen steps to the right.' },
        { tex: '-(-15) = 15', text: 'Fifteen steps right of zero is 15. The opposite of a negative number is positive, because it jumps to the other side.' },
      ], answer: '15',
    },
    },
    {
      kind: 'example',
      head: 'Absolute value: |−12|',
      body: 'Absolute value is a ruler. How far is −12 from zero?',
      steps: {
      steps: [
        { tex: '-12 \\to 0', text: 'Think of walking from −12 back to zero along the number line. Count the steps you take.' },
        { tex: '12 \\text{ steps}', text: 'You take twelve steps. A ruler reports only how far, never which way, so direction does not matter.' },
        { tex: '|-12| = 12', text: 'Write the distance as the answer. A distance is a count of steps, so it is positive: 12.' },
      ], answer: '12',
    },
    },
    {
      kind: 'example',
      head: 'Careful now: |9|',
      body: 'The bars do not flip anything, they just measure. What is |9|?',
      steps: {
      steps: [
        { tex: '9 \\to 0', text: 'Measure how far 9 is from zero. It is nine steps to the left, back to zero.' },
        { tex: '9 \\text{ steps}', text: 'The distance is nine steps. The bars only report the distance, so they leave a positive number alone.' },
        { tex: '|9| = 9', text: 'The answer is 9, not −9. Absolute value never makes a number negative, and a positive number stays the same.' },
      ], answer: '9',
    },
    },
    {
      kind: 'example',
      head: 'Double flip: −(−3)',
      body: 'What is −(−3)? Read it from the inside out: the number inside is −3, and the minus sign outside asks for its opposite.',
      steps: {
      steps: [
        { tex: '-3 \\text{ is 3 left of } 0', text: 'Start with the inside. The number in the brackets is −3, which sits three steps to the left of zero.' },
        { tex: '\\text{the outer minus: flip}', text: 'The minus sign outside the brackets means "take the opposite". That flips the number to the other side of zero.' },
        { tex: '-(-3) = 3', text: 'The opposite of −3 is 3, three steps to the right. Two minus signs in a row cancel, like turning around twice.' },
      ], answer: '3',
    },
      art: numberLine(-6, 6, [{ at: -3, label: 'start at −3', color: SKY }, { at: 3, label: 'flip to 3', color: EMR }], { title: 'Flip twice and you are home', caption: 'Take the opposite of −3 and you land on 3 — one mirror across zero.' }),
    },
    {
      kind: 'example',
      head: 'Mix them: |−8| vs the opposite of 8',
      body: 'Two things that look alike: the absolute value of −8, and the opposite of 8. Do they give the same answer?',
      steps: {
      steps: [
        { tex: '|-8| = 8', text: 'Absolute value is a ruler, and −8 is eight steps from zero. The bars report the distance, which is 8.' },
        { tex: '\\text{opposite of } 8 = -8', text: 'The opposite is a mirror. It flips 8 to the other side of zero, which is −8.' },
        { tex: '8 \\ne -8', text: 'The answers are different. Bars measure and give a positive distance, while the opposite flips the sign.' },
      ], answer: '|-8| = 8,\\ \\text{ but the opposite of } 8 \\text{ is } -8',
    },
    },
    {
      kind: 'example',
      head: 'Another way: find the positive twin',
      body: 'What is |−6|? Use the idea that a number and its opposite are twins at the same distance from zero.',
      steps: {
      steps: [
        { tex: '-6 \\text{ and } 6', text: 'The number −6 has an opposite twin, 6, on the other side of zero. Both are the same distance from zero.' },
        { tex: '\\text{distance is positive}', text: 'Absolute value is that distance, and a distance is never negative. So the answer must be the positive twin.' },
        { tex: '|-6| = 6', text: 'The positive twin of −6 is 6, so |−6| = 6. Check by counting: six steps from −6 to 0.' },
      ], answer: '6',
    },
    },
    {
      kind: 'protip',
      head: 'Mirror or ruler?',
      body: 'When you see a problem, ask which tool it wants. "Opposite" = mirror: flip the sign. "Absolute value" = ruler: report the distance, always 0 or positive. Naming the tool first stops sign confusion cold.',
      table: {
        head: ['written', 'means', 'answer'],
        rows: [['−(5)', 'opposite of 5', '−5'], ['−(−5)', 'opposite of −5', '5'], ['|−5|', 'distance of −5', '5'], ['−|−5|', 'opposite of the distance', '−5']],
        mark: 3,
        note: 'Work from the inside out, exactly like brackets.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: treating bars like parentheses',
      body: 'Absolute value bars are NOT parentheses: |−5| = 5, not −5. The bars erase direction and keep only distance. If your absolute value ever comes out negative, the ruler is broken — recheck.',
      art: numberLine(-10, 10, [{ at: -8, label: '−8 goes in', color: SKY }, { at: 8, label: '8 comes out', color: EMR }], { title: 'Bars measure, they do not group', caption: 'The bars are a ruler, not brackets. Whatever goes in, a distance comes out.' }),
    },
    { kind: 'trap', head: 'Trap: "opposite" means make it negative', body: 'The opposite isn\'t always negative — it\'s the OTHER side of zero. The opposite of −15 is positive 15. Flip the sign the number already has; don\'t just slap on a minus.' },
    {
      kind: 'challenge',
      head: 'Extra credit: combine the signs',
      body: 'Compute |−6| + (−(−4)) − |3|. Work out each piece first, from the inside out.',
      steps: {
      steps: [
        { tex: '|-6| = 6', text: 'The bars measure how far −6 is from zero. That is 6 steps, so this piece is 6.' },
        { tex: '-(-4) = 4', text: 'The inner number is −4 and the outer minus takes its opposite. The opposite of −4 is 4.' },
        { tex: '|3| = 3', text: 'The bars on a positive number change nothing, because 3 is already three steps from zero.' },
        { tex: '6 + 4 - 3 = 7', text: 'Put the pieces together: 6 + 4 = 10, then take away 3. The answer is 7.' },
      ], answer: '7',
    },
    },
    { kind: 'summary', head: 'Flip and measure', body: 'Opposite = mirror across zero: flip the sign, and two flips return home (−(−n) = n). Absolute value = distance from zero: always 0 or positive, and opposites share it. Ask "mirror or ruler?" and the answer follows.' },
  ],
  '6.NS-10': [
    {
      kind: 'objective',
      head: 'Grid distances & shape sides',
      body: 'Today you will find the distance between points on the coordinate plane — no ruler needed. When points line up on a grid line, one subtraction gives the distance. Then you\'ll use it to measure the sides of rectangles drawn from corner points.',
      art: plotGrid([{ x: 1, y: 1 }, { x: 6, y: 1 }, { x: 6, y: 4 }, { x: 1, y: 4 }], { shape: true, range: { x: [0, 8], y: [0, 6] }, title: 'Every side is a subtraction', caption: 'Corners on a grid hand you the side lengths directly — no measuring needed.' }),
    },
    {
      kind: 'concept',
      head: 'Same x? Measure vertically',
      body: 'If two points share an x-coordinate, they sit on the same vertical line — one directly above the other. The distance is just how far apart the y-values are: |y₁ − y₂|. The absolute value keeps distance positive no matter which point you name first.',
      formula: { tex: 'x_1 = x_2 \\implies d = |y_2 - y_1|', note: 'Matching x means the whole distance lives in the y-values.', parts: [{ sym: 'x_1 = x_2', means: 'both points sit on the same vertical line', tone: 'accent' }, { sym: '|y_2 - y_1|', means: 'subtract the y-values for the length', tone: 'ok' }] },
      art: plotGrid([{ x: 3, y: 2, label: '(3, 2)', color: SKY }, { x: 3, y: 7, label: '(3, 7)', color: EMR }], { join: true, range: { x: [0, 8], y: [0, 8] }, title: 'Length = 7 − 2 = 5', caption: 'The x-values match, so all the distance lives in the y-values.' }),
      why: 'Same x means neither point is left or right of the other, so they are stacked in a straight line up and down. The distance is then just the number of grid steps between their heights, and counting steps between two numbers is subtraction. The absolute value keeps it positive.',
    },
    {
      kind: 'concept',
      head: 'Same y? Measure horizontally',
      body: 'If two points share a y-coordinate, they line up side by side on a horizontal line. Distance = |x₁ − x₂|. Spot which coordinate MATCHES, then subtract the pair that differs.',
      formula: { tex: 'y_1 = y_2 \\implies d = |x_2 - x_1|', note: 'Matching y means the whole distance lives in the x-values.', parts: [{ sym: 'y_1 = y_2', means: 'both points sit on the same horizontal line', tone: 'accent' }, { sym: '|x_2 - x_1|', means: 'subtract the x-values for the length', tone: 'ok' }] },
      art: plotGrid([{ x: 1, y: 4, label: '(1, 4)', color: SKY }, { x: 6, y: 4, label: '(6, 4)', color: EMR }], { join: true, range: { x: [0, 8], y: [0, 7] }, title: 'Length = 6 − 1 = 5', caption: 'The y-values match, so all the distance lives in the x-values.' }),
      why: 'Same y means neither point is above or below the other, so they sit side by side on a straight line across. The distance is just the number of grid steps between their x-values, which is found by subtracting. The absolute value keeps the answer positive.',
    },
    {
      kind: 'concept',
      head: 'Crossing zero adds distances',
      body: 'When one coordinate is negative and the other positive, the path crosses zero. From −2 to 5 is 2 steps to reach zero plus 5 more: 7 total. The subtraction agrees: 5 − (−2) = 5 + 2 = 7 — subtracting a negative adds.',
      formula: { tex: '|a| + |b| \\ \\text{when the signs differ}', note: 'Count in to zero, then out again. The two legs add.', parts: [{ sym: '|a|', means: 'how far the first point is from zero', tone: 'accent' }, { sym: '|b|', means: 'how far the second is, on the other side', tone: 'ok' }] },
      art: numberLine(-5, 7, [{ at: -2, label: '−2', color: SKY }, { at: 5, label: '5', color: EMR }], { span: { from: -2, to: 5, label: '2 + 5 = 7' }, title: 'Count to zero, then onward', caption: 'Two steps to reach zero, then five more. The total distance is seven.' }),
      why: 'From −2 to 5 you cannot jump over zero. You walk 2 steps to reach it, then 5 more, so 7 steps in all. The subtraction 5 − (−2) says the same thing: taking away a debt of 2 is like gaining 2, so subtracting a negative adds.',
    },
    {
      kind: 'concept',
      head: 'Rectangles from corners',
      body: 'Given a rectangle\'s corner points, its sides run along grid lines. Width = the gap between the x-values; height = the gap between the y-values. Two subtractions and you know every side.',
      art: plotGrid([{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 3 }, { x: 0, y: 3 }], { shape: true, range: { x: [0, 7], y: [0, 5] }, title: 'Sides 5 and 3 → area 15', caption: 'Read one horizontal side and one vertical side, then multiply.' }),
      why: 'A rectangle\'s sides run along the grid lines, so each side is a same-x or same-y distance. Opposite sides are equal, so one horizontal gap and one vertical gap give every side length. Then perimeter is 2 times the sum of the two, and area is width times height.',
    },
    {
      kind: 'example',
      head: 'Warm-up: (0, 0) to (0, 6)',
      body: 'The two points are on the y-axis. How far apart are they?',
      steps: {
      steps: [
        { tex: 'x: 0 = 0', text: 'Both points have x = 0, so they are on the same vertical line. That means the distance is found from the y-values.' },
        { tex: '|6 - 0| = 6', text: 'Subtract the y-values and take the absolute value, so the answer is positive. 6 − 0 = 6.' },
        { tex: '0 \\to 6: 6 \\text{ jumps}', text: 'Check by counting up the y-axis from 0 to 6. That is six jumps, so the distance is 6 units.' },
      ], answer: '6 \\text{ units}',
    },
    },
    {
      kind: 'example',
      head: 'Vertical: (3, 2) to (3, 7)',
      body: 'Find the distance between (3, 2) and (3, 7).',
      steps: {
      steps: [
        { tex: 'x: 3 = 3', text: 'The x-values match, so both points are on the same vertical line. The trip is straight up.' },
        { tex: '|7 - 2| = 5', text: 'Subtract the y-values: the bigger minus the smaller. The absolute value makes sure the answer is a positive distance.' },
        { tex: '2 \\to 7: 5 \\text{ jumps}', text: 'Check by counting up the grid from 2 to 7. That is five jumps, so the points are 5 units apart.' },
      ], answer: '5 \\text{ units}',
    },
    },
    {
      kind: 'example',
      head: 'Horizontal: (1, 4) to (6, 4)',
      body: 'Find the distance between (1, 4) and (6, 4).',
      steps: {
      steps: [
        { tex: 'y: 4 = 4', text: 'The y-values match, so both points are on the same horizontal line. The trip is straight across.' },
        { tex: '|6 - 1| = 5', text: 'Subtract the x-values. The distance is found from the part that is different, so the matching y does not matter.' },
        { tex: '1 \\to 6: 5 \\text{ jumps}', text: 'Check by counting along the grid from x = 1 to x = 6. That is five jumps, so the distance is 5 units.' },
      ], answer: '5 \\text{ units}',
    },
    },
    {
      kind: 'example',
      head: 'Across zero: (−2, 4) to (5, 4)',
      body: 'The two points are on opposite sides of the y-axis. How far apart are they?',
      steps: {
      steps: [
        { tex: 'y: 4 = 4', text: 'The y-values match, so the points are on a horizontal line and the distance is found from the x-values.' },
        { tex: '|5 - (-2)| = |5 + 2|', text: 'Subtract the x-values. Subtracting a negative adds, because taking away a debt of 2 is like gaining 2.' },
        { tex: '5 + 2 = 7', text: 'Add to get 7. Check on the grid: 2 steps from −2 to the y-axis, then 5 more steps to x = 5. That is 7 units.' },
      ], answer: '7 \\text{ units}',
    },
    },
    {
      kind: 'example',
      head: 'Another crossing: (−3, 1) to (4, 1)',
      body: 'Find the distance between (−3, 1) and (4, 1). The path crosses the y-axis.',
      steps: {
      steps: [
        { tex: 'y: 1 = 1', text: 'The y-values match, so the path is horizontal. The distance comes from the x-values.' },
        { tex: '|4 - (-3)| = |4 + 3|', text: 'Subtract the x-values. Subtracting a negative turns into adding, because the path crosses zero and both parts count.' },
        { tex: '4 + 3 = 7', text: 'The sum is 7. Check by counting: 3 steps from −3 to 0, then 4 more steps to 4, which makes 7 units.' },
      ], answer: '7 \\text{ units}',
    },
    },
    {
      kind: 'example',
      head: 'Rectangle sides from corners',
      body: 'A rectangle has corners (1, 1), (5, 1), (5, 4) and (1, 4). Find its side lengths, perimeter and area.',
      steps: {
      steps: [
        { tex: '\\text{width} = |5 - 1| = 4', text: 'The bottom side runs from (1, 1) to (5, 1). The y-values match, so subtract the x-values to get a width of 4.' },
        { tex: '\\text{height} = |4 - 1| = 3', text: 'The right side runs from (5, 1) to (5, 4). The x-values match, so subtract the y-values to get a height of 3.' },
        { tex: 'P = 2(4 + 3) = 14', text: 'Opposite sides of a rectangle are equal, so the perimeter is two widths plus two heights, which is 14 units.' },
        { tex: 'A = 4 \\times 3 = 12', text: 'Area is the number of unit squares inside, which is width times height. That gives 12 square units.' },
      ], answer: 'P = 14\\ \\text{units},\\ A = 12\\ \\text{square units}',
    },
    },
    {
      kind: 'example',
      head: 'Another way: count the steps',
      body: 'Find the distance from (1, 2) to (1, 7) by counting steps, without using a formula.',
      steps: {
      steps: [
        { tex: 'x: 1 = 1', text: 'Both points have x = 1, so they are on a vertical line. We only need to count the steps up.' },
        { tex: '2 \\to 3 \\to 4 \\to 5 \\to 6 \\to 7', text: 'Count up the grid one square at a time from y = 2 to y = 7. Each move is one unit.' },
        { tex: '5 \\text{ steps} = 7 - 2', text: 'There are five moves, and that matches the subtraction 7 − 2 = 5. So the distance is 5 units.' },
      ], answer: '5 \\text{ units}',
    },
    },
    { kind: 'protip', head: 'Match first, subtract second', body: 'Start every problem by asking: which coordinate is the SAME in both points? That tells you the direction (same x → vertical, same y → horizontal). Then subtract the coordinates that differ and take the absolute value. Match, subtract, done.' },
    {
      kind: 'trap',
      head: 'Trap: 5 − (−2) is not 3',
      body: 'When a coordinate is negative, watch the subtraction: 5 − (−2) = 5 + 2 = 7, NOT 3. The two minus signs team up into a plus, because you\'re crossing zero. If you get 3, you dropped a sign — count the steps on the line to confirm 7.',
      art: numberLine(-5, 7, [{ at: -2, label: '−2', color: ROSE }, { at: 5, label: '5', color: EMR }], { span: { from: -2, to: 5, label: 'really 7 apart' }, title: 'Subtracting a negative adds', caption: 'The gap on the line is seven. Treating −2 as +2 would shrink it to three.' }),
    },
    {
      kind: 'challenge',
      head: 'Extra credit: rectangle on a grid',
      body: 'A rectangle has corners (0, 0), (5, 0), (5, 4) and (0, 4). Find its perimeter and area.',
      steps: {
      steps: [
        { tex: '\\text{width} = |5 - 0| = 5', text: 'The bottom side runs from (0, 0) to (5, 0). The y-values match, so subtract the x-values: the width is 5.' },
        { tex: '\\text{height} = |4 - 0| = 4', text: 'The left side runs from (0, 0) to (0, 4). The x-values match, so subtract the y-values: the height is 4.' },
        { tex: 'P = 2(5 + 4) = 18', text: 'Opposite sides are equal, so the perimeter adds two widths and two heights: 5 + 4 + 5 + 4 = 18 units.' },
        { tex: 'A = 5 \\times 4 = 20', text: 'Area counts the unit squares inside, which is width times height. That is 20 square units.' },
      ], answer: 'P = 18\\ \\text{units},\\ A = 20\\ \\text{square units}',
    },
    },
    { kind: 'summary', head: 'One subtraction, real distance', body: 'Same x means vertical: distance = |y₁ − y₂|. Same y means horizontal: distance = |x₁ − x₂|. Crossing zero? Subtracting a negative ADDS the distances. For rectangles, the x-gap is the width and the y-gap is the height.' },
  ],
};
