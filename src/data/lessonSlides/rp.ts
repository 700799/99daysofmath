import type { SlideBank } from './types';
import { AMB, EMR, ROSE, SKY, VIO, bars, doubleLine, flow, numberLine, pie, tape } from '../slideArt';

// 6.RP — Ratios & Proportions. 12–14 slides per lesson, ~3 short sentences
// each, written for a 10–12-year-old: objective → concepts → simplest-to-fuller
// examples → pro tip → trap(s) → summary.
export const RP_SLIDES: SlideBank = {
  '6.RP-1': [
    {
      kind: 'objective',
      head: 'Meet the ratio',
      body: 'Today you will compare two amounts using a ratio — a super-useful math tool. You will write ratios, put them in the right order, and shrink them to their simplest form. By the end, ratios will feel like a secret code you can read.',
      art: flow([{ label: 'A ratio compares two amounts', color: SKY }, { label: 'Write it as a : b', color: AMB }, { label: 'Scale both sides together', color: EMR }], { title: 'What a ratio is, in three lines', caption: 'A ratio is a comparison you can grow or shrink without changing what it says.' }),
    },
    {
      kind: 'concept',
      head: 'A ratio compares two amounts',
      body: 'A ratio says how two amounts stack up, like 3 red marbles to 2 blue ones. You can write it three ways: 3:2, "3 to 2", or as the fraction 3/2. All three mean the exact same comparison.',
      art: tape([
          { label: 'cats', boxes: 3, color: AMB },
          { label: 'dogs', boxes: 4, color: SKY },
        ], { title: '3 cats to 4 dogs', caption: 'One box each — the picture shows the comparison, not the total.' }),
      formula: { tex: '3 : 4 \\quad\\text{or}\\quad \\tfrac{3}{4} \\quad\\text{or}\\quad 3 \\text{ to } 4', note: 'Three ways to write the same comparison. The colon is the quickest.' },
    },
    {
      kind: 'concept',
      head: 'Order matters — a lot',
      body: '3:2 and 2:3 are NOT the same ratio. The first number always matches the first thing named. If a question asks for "apples to oranges", the apple count goes first, no matter which number is bigger.',
      compare: {
        cols: [
          { title: '3 : 4 cats to dogs', tex: '3 : 4', lines: ['Cats named first', 'Fewer cats'], tone: 'accent' },
          { title: '4 : 3 dogs to cats', tex: '4 : 3', lines: ['Dogs named first', 'A different claim'], tone: 'bad' },
        ],
        note: 'Whatever is said FIRST in the sentence is written first in the ratio.',
      },
    },
    {
      kind: 'concept',
      head: 'Scale it up or down together',
      body: 'Multiply or divide BOTH parts of a ratio by the same number and the comparison stays the same. 2:3 becomes 4:6 (both × 2) or 20:30 (both × 10). Dividing both parts by a common factor is called simplifying.',
      table: {
        head: ['cats', 'dogs', 'same ratio?'],
        rows: [['3', '4', 'yes — the original'], ['6', '8', 'yes — both doubled'], ['9', '12', 'yes — both tripled'], ['6', '4', 'no — only one doubled']],
        mark: 3,
        note: 'Whatever you do to one side you must do to the other, or it is a different comparison.',
      },
    },
    {
      kind: 'concept',
      head: 'Simplest form = smallest whole numbers',
      body: 'A ratio is in simplest form when no number divides evenly into both parts anymore. 4:6 simplifies to 2:3 because both divide by 2. 2:3 is done — nothing bigger than 1 goes into both 2 and 3.',
      steps: {
        steps: [
          { tex: '4 : 6', text: 'What divides into both?' },
          { tex: '4 \\div 2 = 2,\\ 6 \\div 2 = 3', text: 'Divide both by 2.' },
        ],
        answer: '2 : 3',
      },
    },
    { kind: 'example', head: 'Write a ratio: 3 cats, 4 dogs', body: 'What is the ratio of cats to dogs?\nCats are named first, so their number goes first: 3. Dogs come second: 4. The ratio is 3:4 — no simplifying needed, since nothing divides both.' },
    {
      kind: 'example',
      head: 'Simplify: 4 apples to 6 oranges',
      body: 'Apples to oranges = 4:6.\nBoth numbers divide by 2: 4 ÷ 2 = 2 and 6 ÷ 2 = 3. Simplest form: 2:3.',
      art: tape([
          { label: 'apples', boxes: 2, color: AMB },
          { label: 'oranges', boxes: 3, color: EMR },
        ], { title: '4 : 6 is really 2 : 3', caption: 'Group them in twos and the same comparison needs fewer boxes.' }),
    },
    { kind: 'example', head: 'Simplify: 5 cats to 10 dogs', body: 'Cats to dogs = 5:10.\nBoth divide by 5: 5 ÷ 5 = 1 and 10 ÷ 5 = 2. Simplest form: 1:2 — one cat for every two dogs.' },
    { kind: 'example', head: 'Watch the order: milk to flour', body: 'A recipe uses 2 cups flour and 3 cups milk. Ratio of MILK to flour?\nMilk is asked first, so milk\'s number leads: 3. Flour follows: 2. Answer: 3:2 — not 2:3!' },
    { kind: 'example', head: 'Simplify: 6 blue to 9 red', body: 'Blue to red = 6:9.\nFind the common factor: both divide by 3. 6 ÷ 3 = 2 and 9 ÷ 3 = 3. Simplest form: 2:3.' },
    { kind: 'example', head: 'Bigger numbers: 8 boys to 12 girls', body: 'Boys to girls = 8:12.\nBoth divide by 4: 8 ÷ 4 = 2 and 12 ÷ 4 = 3. Simplest form: 2:3 — for every 2 boys there are 3 girls.' },
    { kind: 'example', head: 'Another way: divide by the biggest factor', body: 'Simplify 8:12 in ONE step.\nInstead of halving twice (8:12 → 4:6 → 2:3), find the biggest number that divides both — 4. Then 8 ÷ 4 = 2 and 12 ÷ 4 = 3, giving 2:3 right away.' },
    {
      kind: 'protip',
      head: 'Hunt for the BIGGEST common factor',
      body: 'You can simplify in small steps, but hunting the biggest common factor is faster. For 8:12, dividing by 4 finishes in one move; dividing by 2 twice also works. Either way, keep dividing until nothing fits both numbers.',
      compare: {
        cols: [
          { title: 'Divide by 2', tex: '8 : 12 \\to 4 : 6', lines: ['Still shrinkable', 'Not done yet'], tone: 'warn' },
          { title: 'Divide by 4', tex: '8 : 12 \\to 2 : 3', lines: ['Nothing left to divide', 'Simplest form'], tone: 'ok' },
        ],
      },
    },
    {
      kind: 'trap',
      head: 'Trap: flipping the order',
      body: 'The #1 ratio mistake: writing the numbers in the order they appear in the story instead of the order the QUESTION asks. "Milk to flour" puts milk first even if flour was mentioned first. Always re-read which word comes first in the question.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\text{“milk to flour”} \\to 3 : 2', lines: ['Wrote flour first', 'Recipe ruined'], tone: 'bad' },
          { title: 'Right', tex: '\\text{“milk to flour”} \\to 2 : 3', lines: ['Milk is named first', 'So milk goes first'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: mystery total', body: 'A shelf has red and blue books in the ratio 3:5, and 24 books in all. How many are red?\nAdd the parts: 3 + 5 = 8 parts = 24 books, so 1 part = 24 ÷ 8 = 3 books. Red is 3 parts: 3 × 3 = 9 red books.' },
    {
      kind: 'summary',
      head: 'Ratios in three moves',
      body: 'A ratio compares two amounts: write it 3:2 or "3 to 2". Match the order to the words in the question — first named, first written. Simplify by dividing both parts by the same number until you can\'t anymore.',
      art: flow([
          { label: 'read the order from the words' },
          { label: 'write it as a : b' },
          { label: 'divide both by the biggest factor' },
        ], { title: 'the ratio routine', caption: 'Three moves and any ratio question is set up correctly.' }),
    },
  ],
  '6.RP-2': [
    {
      kind: 'objective',
      head: 'How much for just ONE?',
      body: 'Today you will find unit rates — the amount for exactly one item, one hour, or one pound. It is the trick behind price tags, speed limits, and batting averages. One division unlocks it all.',
      art: flow([{ label: 'Take the total', color: SKY }, { label: 'Divide by how many', color: AMB }, { label: 'Read the "per one" answer', color: EMR }], { title: 'Finding a unit rate' }),
    },
    {
      kind: 'concept',
      head: 'A rate compares different units',
      body: 'A rate is a ratio between two DIFFERENT kinds of things, like miles and hours, or dollars and muffins. "150 miles in 3 hours" is a rate. Rates describe how one thing changes with another.',
      art: doubleLine(
        { label: 'stickers', vals: [0, 2, 4, 6, 8, 10] },
        { label: 'packs', vals: [0, 1, 2, 3, 4, 5] },
        { title: '10 stickers in 5 packs', mark: 1, caption: 'Line the two counts up and the "for one" answer is the second tick.' },
      ),
    },
    {
      kind: 'concept',
      head: 'A unit rate is the amount for 1',
      body: 'A unit rate tells you the amount for exactly ONE unit: dollars per 1 muffin, miles per 1 hour. That little word "per" means "for each one". Unit rates make everything easy to compare.',
      art: doubleLine({ label: 'hours', vals: [0, 1, 2, 3] }, { label: 'miles', vals: [0, 50, 100, 150] }, { title: '50 miles for a single hour', caption: 'Slide down to one on the top line and read across. That reading is the unit rate.' }),
      formula: {
        tex: '\\text{unit rate} = \\frac{\\text{total}}{\\text{number of units}}',
        note: 'One division, and the answer always ends "per one".',
        parts: [
          { sym: '\\text{total}', means: 'the whole amount you were given', tone: 'accent' },
          { sym: '\\text{units}', means: 'how many things that amount was shared over', tone: 'ok' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Divide to find it',
      body: 'To get a unit rate, divide the total by the number of units. Cost per muffin = total money ÷ number of muffins. Miles per hour = total miles ÷ number of hours. The thing after "per" is what you divide BY.',
      art: flow([{ label: 'Total ÷ how many', color: SKY }, { label: 'Answer is "per one"', color: AMB }, { label: 'Write the unit down', color: EMR }], { title: 'One division, always' }),
      steps: {
        steps: [
          { tex: '150 \\text{ miles in } 3 \\text{ hours}', text: 'Write down what you are given.' },
          { tex: '150 \\div 3', text: 'Divide by the number you want ONE of.' },
        ],
        answer: '50 \\text{ miles per hour}',
      },
    },
    { kind: 'example', head: 'Warm-up: 10 stickers, 5 packs', body: 'How many stickers per pack?\nPer pack means divide by packs: 10 ÷ 5 = 2. Each pack holds 2 stickers.' },
    { kind: 'example', head: 'Speed: 150 miles in 3 hours', body: 'Miles per hour means miles ÷ hours.\n150 ÷ 3 = 50. The car travels 50 miles each hour — that\'s 50 mph.' },
    {
      kind: 'example',
      head: 'Price: 6 muffins cost $9',
      body: 'Cost per muffin means money ÷ muffins.\n$9 ÷ 6: since 6 × 1 = 6 with $3 left, and $3 ÷ 6 = $0.50, the answer is $1.50. Each muffin costs $1.50.',
      steps: {
        steps: [
          { tex: '\\$9 \\div 6', text: 'You want the price for ONE muffin, so divide by 6.' },
          { tex: '= 1.5', text: 'Nine dollars shared over six muffins.' },
        ],
        answer: '\\$1.50 \\text{ per muffin}',
      },
    },
    { kind: 'example', head: 'Price: 4 notebooks cost $10', body: 'Divide cost by notebooks: $10 ÷ 4.\n4 × 2 = 8, leaving $2. Then $2 ÷ 4 = $0.50. Each notebook costs $2.50.' },
    { kind: 'example', head: 'Small answer: 8 apples cost $4', body: 'Cost per apple = $4 ÷ 8.\nFour split among eight is less than a dollar each: 4 ÷ 8 = 0.50. Each apple costs $0.50 — fifty cents.' },
    { kind: 'example', head: 'Running rate: 100 m in 20 s', body: 'Meters per second means meters ÷ seconds.\n100 ÷ 20 = 5. The runner covers 5 meters every second.' },
    {
      kind: 'example',
      head: 'Another way: scale the table down to 1',
      body: 'Find the cost per muffin when 6 muffins cost $9 using a table.\n6 muffins → $9, halve to 3 → $4.50, then thirds to 1 → $1.50. Each muffin is $1.50, same as 9 ÷ 6.',
      table: {
        head: ['muffins', 'cost'],
        rows: [['6', '$9'], ['3', '$4.50'], ['1', '$1.50']],
        mark: 2,
        note: 'Halve, then divide by 3 — you arrive at the same per-one price by smaller steps.',
      },
    },
    {
      kind: 'protip',
      head: '"Per" points at the divider',
      body: 'Whatever comes right after "per" is the number you divide BY. Dollars per POUND? Divide by pounds. Miles per HOUR? Divide by hours. Spot the "per" word and the setup writes itself.',
      compare: {
        cols: [
          { title: 'miles PER hour', tex: '\\text{miles} \\div \\text{hours}', lines: ['Hours is the divider'], tone: 'accent' },
          { title: 'cost PER muffin', tex: '\\text{cost} \\div \\text{muffins}', lines: ['Muffins is the divider'], tone: 'ok' },
        ],
        note: 'Whatever word comes AFTER "per" is the number you divide by.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: dividing the wrong way',
      body: 'For "cost per muffin", kids often compute muffins ÷ money and get a weird answer. The money goes ON TOP, and you divide by muffins. Check with common sense: 6 muffins for $9 should cost between $1 and $2 each — not 0.67!',
      art: flow([{ label: 'Want price per muffin?', color: SKY }, { label: 'Dollars ÷ muffins', color: EMR }, { label: 'Muffins ÷ dollars answers something else', color: ROSE }], { title: 'The word "per" names the divider' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '6 \\div 9 = 0.67', lines: ['Muffins per dollar', 'Not what was asked'], tone: 'bad' },
          { title: 'Right', tex: '9 \\div 6 = 1.50', lines: ['Dollars per muffin', 'Matches the question'], tone: 'ok' },
        ],
        note: 'Both divisions are "correct" arithmetic — only one answers the question.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: how far in 5 hours', body: 'A car goes 150 miles in 3 hours. How far in 5 hours at the same speed?\nUnit rate: 150 ÷ 3 = 50 mph. Then 50 × 5 = 250 miles.' },
    { kind: 'summary', head: 'One division does it', body: 'A rate compares two different units; a unit rate is the amount for exactly 1. Divide the total by the number of units — "per" tells you what to divide by. Then sanity-check that the size of your answer makes sense.' },
  ],
  '6.RP-3': [
    {
      kind: 'objective',
      head: 'Ratio tables: pattern machines',
      body: 'Today you will use ratio tables to find equivalent ratios fast. Spot the pattern in a table, and you can predict any missing value. It is like having a machine that scales recipes, prices, and more.',
      art: flow([{ label: 'Write the pair in a table', color: SKY }, { label: 'Multiply both rows alike', color: AMB }, { label: 'Read off any row you need', color: EMR }], { title: 'How a ratio table works' }),
    },
    { kind: 'concept', head: 'Equivalent ratios, same comparison', body: 'Equivalent ratios make the exact same comparison with different numbers: 1:3, 2:6, and 3:9 all say "three times as much". You build them by multiplying or dividing both parts by the same number.' },
    {
      kind: 'concept',
      head: 'A table keeps the pairs organized',
      body: 'A ratio table lines up matching pairs in rows or columns: 2 cups → 10 cookies, 4 cups → 20 cookies. Every row is an equivalent ratio. Reading down or across, the pattern stays steady.',
      art: doubleLine({ label: 'pens', vals: [0, 4, 8, 12] }, { label: 'dollars', vals: [0, 3, 6, 9] }, { title: 'Every column is the same ratio', caption: 'A ratio table is just this double line written down in rows.' }),
      table: {
        head: ['pens', 'cost'],
        rows: [['4', '$3'], ['8', '$6'], ['12', '$9'], ['16', '$12']],
        note: 'Each row is the same deal, just a bigger order. Read down a column to spot the pattern.',
      },
    },
    {
      kind: 'concept',
      head: 'Move with the same multiplier',
      body: 'To go from one row to another, multiply BOTH numbers by the same amount. If cups double, cookies double too. Whatever you do to one column, you must do to the other — that\'s the golden rule of ratio tables.',
      art: tape([{ label: '×2 the top', boxes: 4, each: '2', color: SKY }, { label: '×2 the bottom', boxes: 4, each: '3', color: EMR }], { total: 'both rows scale together', title: 'Whatever you do to one row…', caption: 'Scaling both rows by the same number keeps the comparison identical.' }),
      compare: {
        cols: [
          { title: 'Both × 2', tex: '2 : 6 \\to 4 : 12', lines: ['Same comparison', 'Bigger numbers'], tone: 'ok' },
          { title: 'Only one × 2', tex: '2 : 6 \\to 4 : 6', lines: ['Different comparison', 'Broken'], tone: 'bad' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Or find the "times what?" rule',
      body: 'Many tables hide a rule connecting input to output, like "output = input × 3". Test it on a row you know: does 2 × 3 = 6? Yes! Once the rule checks out, use it on ANY input — even huge ones.',
      formula: {
        tex: '\\text{second} = \\text{first} \\times k',
        note: 'One multiplier turns any left-hand number into its partner on the right.',
        parts: [{ sym: 'k', means: 'divide any pair to find it — it is the same for every row', tone: 'accent' }],
      },
    },
    { kind: 'example', head: 'Find the rule: 2 → 6, 3 → 9', body: 'What does 5 map to?\nCheck the rule: 2 × 3 = 6 and 3 × 3 = 9, so output = input × 3. Then 5 × 3 = 15. Answer: 15.' },
    { kind: 'example', head: 'Another rule: 1 → 4, 2 → 8', body: 'What is the output for 6?\nThe rule: 1 × 4 = 4 and 2 × 4 = 8, so output = input × 4. Then 6 × 4 = 24. Answer: 24.' },
    { kind: 'example', head: 'Doubling: 4 pens cost $3', body: 'What do 8 pens cost?\n8 is exactly 4 × 2, so the price doubles too. $3 × 2 = $6. Eight pens cost $6.' },
    { kind: 'example', head: 'Tripling: 2 cups make 10 cookies', body: 'How many cookies from 6 cups?\n6 is 2 × 3, so triple the cookies. 10 × 3 = 30. Six cups make 30 cookies.' },
    {
      kind: 'example',
      head: 'Rule first: 3 → 12, 5 → 20, 7 → ?',
      body: 'Test the rule: 3 × 4 = 12 and 5 × 4 = 20, so output = input × 4.\nApply it: 7 × 4 = 28. The missing value is 28.',
      steps: {
        steps: [
          { tex: '12 \\div 3 = 4', text: 'Find the rule from a row you already have.' },
          { tex: '20 \\div 5 = 4', text: 'Check it on a second row.' },
          { tex: '7 \\times 4', text: 'Now use it on the row you want.' },
        ],
        answer: '28',
      },
    },
    { kind: 'example', head: 'Scaling down: 10 → 40, so 5 → ?', body: 'You can divide too! 5 is 10 ÷ 2, so divide the output by 2 as well.\n40 ÷ 2 = 20. The row reads 5 → 20.' },
    { kind: 'example', head: 'Another way: find the per-one amount', body: '2 cups make 10 cookies. How many cookies from 6 cups, using a unit rate?\nPer 1 cup: 10 ÷ 2 = 5 cookies. Then 6 × 5 = 30 cookies — same as tripling the row.' },
    {
      kind: 'protip',
      head: 'Check the rule on TWO rows',
      body: 'Before trusting a pattern, test it on two different rows. If 2 → 6 and 3 → 9 both fit "× 3", the rule is solid. One row can fool you; two rows almost never lie.',
      table: {
        head: ['in', 'out', 'out ÷ in'],
        rows: [['3', '12', '4'], ['5', '20', '4'], ['7', '28', '4']],
        mark: 2,
        note: 'If the last column is not the same every time, it is not a ratio table.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: scaling only one column',
      body: 'The classic table mistake: doubling the cups but forgetting to double the cookies. Whatever you multiply one column by, multiply the other by too. A ratio table only works when both sides move together.',
      art: flow([{ label: 'Doubled the pens only?', color: ROSE }, { label: 'The price no longer fits', color: ROSE }, { label: 'Scale both, every time', color: EMR }], { title: 'One-sided scaling breaks the ratio' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '4 \\text{ pens } \\$3 \\to 8 \\text{ pens } \\$3', lines: ['Doubled the pens only', 'Free pens!'], tone: 'bad' },
          { title: 'Right', tex: '4 \\to 8 \\text{ and } \\$3 \\to \\$6', lines: ['Both doubled', 'Same deal'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: work backward', body: '4 cups make 20 cookies. How many cups make 50 cookies?\nEach cup makes 20 ÷ 4 = 5 cookies. So 50 ÷ 5 = 10 cups.' },
    {
      kind: 'summary',
      head: 'Tables tame ratios',
      body: 'Equivalent ratios multiply BOTH parts by the same number. In a table, move between rows with one multiplier, or find the input → output rule and test it twice. Both columns always move together!',
      art: flow([
          { label: 'write the pairs in two columns' },
          { label: 'find out ÷ in on one row' },
          { label: 'check it on a second row' },
          { label: 'use it on the row you want' },
        ], { title: 'the ratio-table routine', caption: 'The check on row two is what stops a wrong rule spreading.' }),
    },
  ],
  '6.RP-4': [
    {
      kind: 'objective',
      head: 'Two flavors of ratio',
      body: 'Today you will learn to tell apart part-to-part ratios (boys to girls) and part-to-whole ratios (boys to the whole class). One tiny word — "whole" or "all" — changes the entire answer. You will spot it every time.',
      art: flow([{ label: 'Part to part: reds vs blues', color: SKY }, { label: 'Part to whole: reds vs all', color: AMB }, { label: 'Read the question carefully', color: EMR }], { title: 'Two ratios, one bag of marbles' }),
    },
    {
      kind: 'concept',
      head: 'Part-to-part: group vs group',
      body: 'A part-to-part ratio compares two groups directly, like boys to girls or red paint to blue paint. Neither number is the total. "3 boys to 2 girls" is part-to-part: 3:2.',
      art: tape([
          { label: 'boys', boxes: 3, color: SKY },
          { label: 'girls', boxes: 2, color: ROSE },
        ], { title: 'part to part — 3 : 2', caption: 'Two groups compared with each other. Nothing here mentions the total.' }),
    },
    {
      kind: 'concept',
      head: 'Part-to-whole: group vs everything',
      body: 'A part-to-whole ratio compares one group to the TOTAL, like boys to all students. Words like "whole", "all", "total", or "out of" are your signal. This kind can also be written as a fraction of the whole.',
      art: tape([
          { label: 'boys', boxes: 3, color: SKY },
          { label: 'everyone', boxes: 5, color: VIO },
        ], { title: 'part to whole — 3 : 5', total: '5 children in all', caption: 'Now the second number is the WHOLE class, not the other group.' }),
    },
    {
      kind: 'concept',
      head: 'Add the parts to build the whole',
      body: 'The whole usually is not given — you build it by ADDING the parts. If a class has 3 boys to 2 girls, the whole is 3 + 2 = 5 parts. Then boys to the whole class is 3:5, and boys are 3/5 of the class.',
      formula: {
        tex: '\\text{whole} = \\text{part} + \\text{part}',
        note: '3 boys and 2 girls means 5 children — you must add before you can compare to the whole.',
      },
    },
    { kind: 'example', head: 'Warm-up: 3 boys, 2 girls', body: 'Ratio of boys to the whole class?\nBuild the whole: 3 + 2 = 5. Boys to whole = 3 to 5. Answer: 3:5.' },
    {
      kind: 'example',
      head: 'Fruit bowl: 4 apples, 6 pears',
      body: 'Ratio of apples to ALL the fruit?\nTotal fruit = 4 + 6 = 10, so apples to total = 4:10. Both divide by 2: answer 2:5.',
      steps: {
        steps: [
          { tex: '4 : 6 \\to 2 : 3', text: 'Part to part, simplified.' },
          { tex: '4 + 6 = 10', text: 'Add for the whole bowl.' },
          { tex: '4 : 10 \\to 2 : 5', text: 'Apples to ALL the fruit.' },
        ],
        answer: '2 : 3 \\text{ and } 2 : 5',
      },
    },
    { kind: 'example', head: 'Paint mix: 2 red to 3 blue', body: 'What FRACTION of the mix is red?\nWhole = 2 + 3 = 5 parts. Red is 2 of those 5 parts. Answer: 2/5 of the paint is red.' },
    { kind: 'example', head: 'Team: 7 forwards, 3 defenders', body: 'Ratio of defenders to the whole team?\nWhole team = 7 + 3 = 10 players. Defenders to whole = 3 to 10. Answer: 3:10.' },
    { kind: 'example', head: 'Chips: 5 red, 5 blue', body: 'What fraction of the chips are red?\nWhole = 5 + 5 = 10 chips. Red = 5 out of 10 = 5/10. Simplify: 1/2 — half the chips are red.' },
    { kind: 'example', head: 'Both flavors, same story', body: 'A garden has 6 roses and 9 tulips.\nPart-to-part, roses to tulips: 6:9 = 2:3. Part-to-whole, roses to all flowers: whole = 6 + 9 = 15, so 6:15 = 2:5. Same garden, two different ratios!' },
    { kind: 'example', head: 'Another way: simplify the parts first', body: 'A bowl has 4 apples and 6 pears. Apples to all fruit?\nSimplify the groups first: 4:6 = 2:3, so 2 + 3 = 5 parts. Apples to whole = 2:5 — same as 4:10.' },
    {
      kind: 'protip',
      head: 'Underline the second word',
      body: 'Read the question and underline what comes after "to": is it another GROUP or the WHOLE? "Boys to girls" = part-to-part. "Boys to students" or "boys to the class" = part-to-whole — add first! That one underline prevents most mistakes.',
      compare: {
        cols: [
          { title: '"red to blue"', tex: '\\text{part} : \\text{part}', lines: ['Two groups', 'Do not add'], tone: 'accent' },
          { title: '"red to all"', tex: '\\text{part} : \\text{whole}', lines: ['Group vs total', 'Add first'], tone: 'ok' },
        ],
        note: 'The word after "to" tells you whether you need to add the parts up.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: skipping the addition',
      body: 'For "3 boys to 2 girls, what fraction are boys?", the answer is NOT 3/2. You must add the parts first: 3 + 2 = 5, so boys are 3/5. Whenever the question mentions the whole, the total, or a fraction — ADD before you answer.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '3 \\text{ boys} : 2 \\text{ total}', lines: ['Used the other group', 'More boys than people'], tone: 'bad' },
          { title: 'Right', tex: '3 \\text{ boys} : 5 \\text{ total}', lines: ['Added 3 + 2 first'], tone: 'ok' },
        ],
      },
    },
    { kind: 'trap', head: 'Trap: treating a ratio number as a count', body: 'A 2:3 ratio does not mean there are exactly 2 and 3 things — there might be 20 and 30! Ratio numbers show the pattern, not the real counts. Only add ratio parts to find the whole IN PARTS: 2 + 3 = 5 parts.' },
    { kind: 'challenge', head: 'Extra credit: find the girls', body: 'A class has boys to girls 3:2 and 30 students. How many girls?\nParts: 3 + 2 = 5 = 30 students, so 1 part = 6. Girls are 2 parts: 2 × 6 = 12 girls.' },
    {
      kind: 'summary',
      head: 'Part or whole? Check, then add',
      body: 'Part-to-part compares two groups; part-to-whole compares one group to the total. Build the whole by adding the parts first. Signal words like "all", "total", and "fraction" mean the whole is involved!',
      art: flow([
          { label: 'read what the second word names' },
          { label: 'another group? part to part' },
          { label: 'the total? add the parts first' },
          { label: 'then simplify' },
        ], { title: 'which kind of ratio is it?', caption: 'One question decides everything that follows.' }),
    },
  ],
  '6.RP-5': [
    {
      kind: 'objective',
      head: 'Percent: out of 100',
      body: 'Today you will crack percents — they are just "out of 100" in disguise. You will turn percents into decimals, find a percent OF a number, and use shortcuts like "50% means half". Discounts and game stats, here you come.',
      art: flow([{ label: 'Percent means per hundred', color: SKY }, { label: 'Turn it into a decimal', color: AMB }, { label: '"Of" means multiply', color: EMR }], { title: 'Percent, from words to numbers' }),
    },
    {
      kind: 'concept',
      head: 'Percent means per hundred',
      body: 'The word percent literally means "per hundred". 25% is 25 out of every 100 — the same as 25/100 or the decimal 0.25. If 25% of students walk to school, that\'s 25 out of every 100 students.',
      art: pie([{ label: 'this', part: 25 }, { label: 'the rest', part: 75 }], {
        title: '25% is 25 out of every 100', caption: 'A quarter of the circle — percent is just a fraction with 100 underneath.',
      }),
      formula: { tex: '25\\% = \\frac{25}{100} = 0.25', note: 'Three ways to write the same amount. Use whichever is easiest to compute with.' },
    },
    { kind: 'concept', head: '"Of" means multiply', body: 'To find a percent OF a number, turn the percent into a decimal and multiply. Move the decimal point two places LEFT: 20% becomes 0.20. Then 20% of 45 is just 0.20 × 45.' },
    {
      kind: 'concept',
      head: 'Know the friendly benchmarks',
      body: 'Some percents are instant: 100% is the whole thing, 50% is half, 25% is a quarter, and 10% moves the decimal one place left. Memorize these four and tons of problems become mental math.',
      art: pie([{ label: 'quarter', part: 25 }, { label: 'half', part: 50 }, { label: 'the rest', part: 25 }], { title: '25%, 50%, 75% at a glance', caption: 'A few benchmarks let you estimate almost any percent in your head.' }),
      table: {
        head: ['percent', 'fraction', 'shortcut'],
        rows: [['50%', '½', 'halve it'], ['25%', '¼', 'halve, halve again'], ['10%', '1/10', 'move the point one'], ['1%', '1/100', 'move the point two']],
        note: 'Almost every percent question can be built out of these four.',
      },
    },
    { kind: 'example', head: 'Easiest: 50% of 80', body: '50% means one half.\nHalf of 80 = 80 ÷ 2 = 40. Answer: 40.' },
    {
      kind: 'example',
      head: 'Quick trick: 10% of 250',
      body: '10% moves the decimal point one place left.\n250 becomes 25.0. Answer: 10% of 250 = 25.',
      steps: {
        steps: [
          { tex: '10\\% = \\tfrac{1}{10}', text: 'One tenth of the number.' },
          { tex: '250 \\to 25.0', text: 'Slide the decimal point one place left.' },
        ],
        answer: '25',
      },
    },
    { kind: 'example', head: 'Quarter power: 25% of 40', body: '25% means one quarter, so divide by 4.\n40 ÷ 4 = 10. Answer: 25% of 40 = 10.' },
    { kind: 'example', head: 'Decimal method: 20% of 45', body: 'Turn 20% into a decimal: 0.20.\nMultiply: 0.20 × 45. Since 0.2 × 45 = 45 ÷ 5 = 9, the answer is 9.' },
    { kind: 'example', head: 'Fraction to percent: 3/4', body: 'Write 3/4 as a percent.\n3 ÷ 4 = 0.75, and 0.75 means 75 per hundred. Answer: 75%.' },
    {
      kind: 'example',
      head: 'Build from 10%: 30% of 60',
      body: 'First find 10% of 60: move the point — 6.\n30% is three of those: 3 × 6 = 18. Answer: 30% of 60 = 18.',
      steps: {
        steps: [
          { tex: '10\\% \\text{ of } 60 = 6', text: 'Find the easy one first.' },
          { tex: '30\\% = 3 \\times 10\\%', text: 'Three lots of it.' },
          { tex: '3 \\times 6', text: 'Multiply.' },
        ],
        answer: '18',
      },
    },
    { kind: 'example', head: 'Another way: use the fraction', body: 'Find 20% of 45 without decimals.\n20% is the fraction 1/5. So 45 ÷ 5 = 9. That matches 0.20 × 45 = 9.' },
    {
      kind: 'protip',
      head: '10% is your master key',
      body: 'Almost any percent can be built from 10% chunks. 10% of 60 is 6, so 20% is 12, 30% is 18, and 5% is half a chunk — 3. Find 10% first, then stack the chunks you need.',
      table: {
        head: ['want', 'from 10%', 'of 60'],
        rows: [['5%', 'half of 10%', '3'], ['20%', 'double 10%', '12'], ['30%', 'triple 10%', '18'], ['15%', '10% + 5%', '9']],
        note: 'Find 10% once, then add and halve your way to anything else.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: multiplying by the raw percent',
      body: '20% of 45 is NOT 20 × 45 = 900 — way too big! Convert the percent to a decimal first: move the point two places left, so 20% = 0.20. Then multiply. Ask yourself: 20% is a small slice, so the answer must be SMALLER than 45.',
      art: flow([{ label: '20% of 45', color: SKY }, { label: 'Use 0.20, not 20', color: EMR }, { label: '20 × 45 = 900 — far too big', color: ROSE }], { title: 'Turn the percent into a decimal first' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '20 \\times 45 = 900', lines: ['Used 20, not 0.20', 'Absurdly big'], tone: 'bad' },
          { title: 'Right', tex: '0.20 \\times 45 = 9', lines: ['Percent to decimal first', 'Smaller than 45'], tone: 'ok' },
        ],
        note: 'A percent under 100 must make the number SMALLER. If it grew, you forgot to convert.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: bigger percent', body: 'What is 45% of 80?\nFind 10% first: 8. Then 40% = 4 × 8 = 32, and 5% = half of 8 = 4. Add: 32 + 4 = 36.' },
    { kind: 'summary', head: 'Percents, decoded', body: 'Percent means per hundred: 25% = 25/100 = 0.25. To find a percent OF a number, convert to a decimal and multiply. Use benchmarks — 50% is half, 25% is a quarter, 10% shifts the point — to make it mental math.' },
  ],
  '6.RP-6': [
    {
      kind: 'objective',
      head: 'Switch units with a rate',
      body: 'Today you will convert units — feet to inches, meters to centimeters, quarts to cups — using rates. Every conversion is just a ratio like "12 inches per 1 foot". Pick multiply or divide, and the units fall into place.',
      art: flow([{ label: 'Name the conversion rate', color: SKY }, { label: 'Decide multiply or divide', color: AMB }, { label: 'Sense-check the size', color: EMR }], { title: 'Converting units, every time' }),
    },
    {
      kind: 'concept',
      head: 'A conversion IS a rate',
      body: 'Conversion facts are rates in disguise: 12 inches per 1 foot, 100 cm per 1 meter, 4 cups per 1 quart. Each one says how many small units fit inside one big unit. Treat them exactly like the unit rates you already know.',
      art: doubleLine(
        { label: 'feet', vals: [0, 1, 2, 3] },
        { label: 'inches', vals: [0, 12, 24, 36] },
        { title: '12 inches per foot', mark: 1, caption: 'Every conversion is just a rate you already know by heart.' },
      ),
    },
    {
      kind: 'concept',
      head: 'Big unit → small unit: multiply',
      body: 'Going from a bigger unit to a smaller one means you\'ll have MORE of them, so multiply. 3 feet becomes 3 × 12 = 36 inches. One big thing splits into many small pieces.',
      art: tape([{ label: '1 foot', boxes: 1, each: 'ft', color: EMR }, { label: '12 inches', boxes: 12, color: SKY }], { total: 'smaller pieces, more of them', title: 'Smaller units need bigger counts' }),
      compare: {
        cols: [
          { title: 'feet → inches', tex: '\\times 12', lines: ['Inches are smaller', 'So you need more'], tone: 'ok' },
          { title: 'inches → feet', tex: '\\div 12', lines: ['Feet are bigger', 'So you need fewer'], tone: 'accent' },
        ],
        note: 'Smaller unit means a BIGGER number. Picture the answer before you compute it.',
      },
    },
    { kind: 'concept', head: 'Small unit → big unit: divide', body: 'Going from a smaller unit to a bigger one means FEWER of them, so divide. 48 inches becomes 48 ÷ 12 = 4 feet. Many small pieces bundle up into a few big ones.' },
    {
      kind: 'concept',
      head: 'Always sense-check the size',
      body: 'After converting, ask: should my number be bigger or smaller than what I started with? Inches are tiny, so 3 feet should give a BIGGER number of inches. If the direction feels backwards, you picked the wrong operation.',
      art: flow([{ label: 'Moving to smaller units?', color: SKY }, { label: 'The number must GROW', color: EMR }, { label: 'If it shrank, you divided by mistake', color: ROSE }], { title: 'Check the direction before the arithmetic' }),
    },
    {
      kind: 'example',
      head: 'Feet to inches: 3 feet',
      body: 'Rate: 1 foot = 12 inches. Feet are bigger, so multiply.\n3 × 12 = 36. Answer: 36 inches.',
      steps: {
        steps: [
          { tex: '1 \\text{ ft} = 12 \\text{ in}', text: 'Start from the rate.' },
          { tex: '3 \\times 12', text: 'Going to a smaller unit, so multiply.' },
        ],
        answer: '36 \\text{ inches}',
      },
    },
    {
      kind: 'example',
      head: 'Inches to feet: 48 inches',
      body: 'Rate: 12 inches = 1 foot. Inches are smaller, so divide.\n48 ÷ 12 = 4. Answer: 4 feet.',
      steps: {
        steps: [
          { tex: '1 \\text{ ft} = 12 \\text{ in}', text: 'Recall the anchor.' },
          { tex: '48 \\div 12', text: 'Going to a bigger unit, so divide.' },
        ],
        answer: '4 \\text{ feet}',
      },
    },
    { kind: 'example', head: 'Quarts to cups: 2 quarts', body: 'Rate: 1 quart = 4 cups. Quarts are bigger, so multiply.\n2 × 4 = 8. Answer: 8 cups.' },
    { kind: 'example', head: 'Feet to inches: 5 feet', body: 'Rate: 1 foot = 12 inches. Multiply: 5 × 12.\n5 × 10 = 50 and 5 × 2 = 10, so 50 + 10 = 60. Answer: 60 inches.' },
    { kind: 'example', head: 'Meters to cm: 3.5 meters', body: 'Rate: 1 m = 100 cm. Meters are bigger, so multiply.\n3.5 × 100 = 350 — the decimal point slides two places right. Answer: 350 cm.' },
    { kind: 'example', head: 'Cups to quarts: 12 cups', body: 'Rate: 4 cups = 1 quart. Cups are smaller, so divide.\n12 ÷ 4 = 3. Answer: 3 quarts.' },
    { kind: 'example', head: 'Another way: split the number', body: 'Change 3.5 m to centimeters (1 m = 100 cm).\nSplit it: 3 m = 300 cm and 0.5 m = 50 cm. Add: 300 + 50 = 350 cm.' },
    { kind: 'protip', head: 'Say the rate out loud first', body: 'Before touching numbers, say the conversion as a sentence: "12 inches PER foot." Then ask which unit you are heading toward — smaller means multiply, bigger means divide. Two seconds of talking saves the whole problem.' },
    {
      kind: 'trap',
      head: 'Trap: multiplying both directions',
      body: 'Kids often multiply no matter what: 48 inches × 12 = 576 "feet" — but a person is not 576 feet tall! Going to a BIGGER unit needs division: 48 ÷ 12 = 4 feet. Always check whether your answer should grow or shrink.',
      compare: {
        cols: [
          { title: 'Wrong', tex: '48 \\text{ in} \\times 12', lines: ['576 feet', 'Longer than a street'], tone: 'bad' },
          { title: 'Right', tex: '48 \\text{ in} \\div 12', lines: ['4 feet', 'About your height'], tone: 'ok' },
        ],
        note: 'Sense-check the size. If the answer is silly, you went the wrong way.',
      },
    },
    { kind: 'challenge', head: 'Extra credit: yards to inches', body: 'How many inches are in 2 yards? (1 yard = 36 inches.)\nMultiply: 2 × 36 = 72 inches.' },
    {
      kind: 'summary',
      head: 'Rates run the conversion',
      body: 'Every conversion is a rate like 12 inches per 1 foot. Heading to a smaller unit? Multiply. Heading to a bigger unit? Divide. Finish with a sense-check: did the number move in the direction it should?',
      art: flow([
          { label: 'write the rate you know' },
          { label: 'which unit is smaller?' },
          { label: 'to smaller: multiply · to bigger: divide' },
          { label: 'sense-check the size' },
        ], { title: 'the conversion routine', caption: 'The last step catches almost every mistake.' }),
    },
  ],
  '6.RP-7': [
    {
      kind: 'objective',
      head: 'Percents in the real world',
      body: 'Today you will use percents where they actually live: tips at restaurants, tax at the store, and discounts on sale tags. You will find a percent of a number fast, then decide — add it on, or take it off?',
      art: flow([{ label: 'Find the percent amount', color: SKY }, { label: 'Discount subtracts, tax adds', color: AMB }, { label: 'Answer what was asked', color: EMR }], { title: 'Sale prices, tips and tax' }),
    },
    {
      kind: 'concept',
      head: 'Percent of a number, refreshed',
      body: 'A percent is a fraction out of 100, so 25% = 25/100 = 1/4. To find X% of Y, slide the decimal point two places LEFT to get a decimal, then multiply. 25% of 80 is 0.25 × 80.',
      art: pie([{ label: 'the 25%', part: 25 }, { label: 'the other 75%', part: 75 }], { title: '25% of 80 is 20', caption: 'A percent is a slice of the whole. A quarter of 80 is 20.' }),
    },
    {
      kind: 'concept',
      head: 'Build percents from 10% and 5%',
      body: 'For odd percents like 15%, use chunks. 10% of 60 is 6 (move the point). 5% is half of that: 3. So 15% of 60 = 6 + 3 = 9. Chunks turn scary percents into easy addition.',
      art: flow([{ label: '10% = slide the point once', color: SKY }, { label: '5% = half of the 10%', color: AMB }, { label: '15% = add the two', color: EMR }], { title: 'Build any percent from pieces', caption: 'Ten percent is free, five percent is half of that, and everything else is addition.' }),
      table: {
        head: ['want', 'built from', 'of 60'],
        rows: [['10%', 'slide the point', '6'], ['5%', 'half of 10%', '3'], ['15%', '10% + 5%', '9'], ['20%', '10% doubled', '12']],
        mark: 2,
        note: 'Two building blocks — 10% and 5% — cover almost every tip and discount you will meet.',
      },
    },
    {
      kind: 'concept',
      head: 'Discount subtracts, tax and tip add',
      body: 'A discount ("30% off") comes OFF the price — subtract it. Tax and tips go ON TOP — add them. Same percent math either way; the story tells you whether the final price goes down or up.',
      art: doubleLine({ label: 'price', vals: [0, 10, 20, 30, 40] }, { label: '30% off', vals: [0, 7, 14, 21, 28] }, { title: 'A 30% discount keeps 70%', caption: 'Line the two up and the sale price is always seventy cents on the dollar.' }),
      compare: {
        cols: [
          { title: 'Discount', tex: '100\\% - 30\\% = 70\\%', lines: ['You pay LESS', 'Multiply by 0.70'], tone: 'accent' },
          { title: 'Tax or tip', tex: '100\\% + 8\\% = 108\\%', lines: ['You pay MORE', 'Multiply by 1.08'], tone: 'warn' },
        ],
        note: 'Both start from the 100% you already have — one takes away, one adds on.',
      },
    },
    { kind: 'example', head: 'Straight percent: 25% of 80', body: '25% = 0.25, or just "one quarter".\n80 ÷ 4 = 20, or 0.25 × 80 = 20. Answer: 20.' },
    { kind: 'example', head: 'Point slide: 10% of 250', body: '10% moves the decimal point one place left.\n250 → 25. Answer: 25.' },
    { kind: 'example', head: 'Chunks: 15% of 60', body: '10% of 60 = 6. 5% is half of 10%, so 5% of 60 = 3.\nAdd the chunks: 6 + 3 = 9. Answer: 15% of 60 = 9.' },
    { kind: 'example', head: 'Half off-ish: 50% of 86', body: '50% is exactly half.\n86 ÷ 2 = 43. Answer: 43.' },
    {
      kind: 'example',
      head: 'Discount: $40 shirt, 30% off',
      body: 'First find the discount: 10% of $40 = $4, so 30% = 3 × $4 = $12 off.\nSubtract from the original: $40 − $12 = $28. Sale price: $28.',
      art: pie([{ label: 'you pay', part: 70 }, { label: 'you save', part: 30 }], { title: '$28 paid, $12 saved', caption: 'Thirty percent off means you still pay seventy percent — $28 of the $40.' }),
      steps: {
        steps: [
          { tex: '10\\% \\text{ of } 40 = 4', text: 'Find the easy block first.' },
          { tex: '30\\% = 3 \\times 4 = 12', text: 'That is the money OFF.' },
          { tex: '40 - 12', text: 'Subtract to get what you pay.' },
        ],
        answer: '\\$28',
      },
    },
    {
      kind: 'example',
      head: 'Tip: 20% on a $35 meal',
      body: 'Find the tip: 10% of $35 = $3.50, so 20% = 2 × $3.50 = $7.\nTips ADD on: $35 + $7 = $42. Total paid: $42.',
      art: tape([{ label: 'meal', boxes: 5, each: '$7', color: SKY }, { label: 'tip', boxes: 1, each: '$7', color: EMR }], { total: '$35 + $7 = $42 in total', title: '20% is one fifth', caption: 'Split the bill into five equal parts. One of them is the tip.' }),
      steps: {
        steps: [
          { tex: '10\\% \\text{ of } 35 = 3.50', text: 'Slide the point.' },
          { tex: '20\\% = 2 \\times 3.50 = 7', text: 'Double it for the tip.' },
          { tex: '35 + 7', text: 'A tip is added on.' },
        ],
        answer: '\\$42',
      },
    },
    {
      kind: 'example',
      head: 'Another way: pay the leftover percent',
      body: 'A $40 shirt is 30% off. Find the price by paying 70%.\nInstead of subtracting the discount, pay 100% − 30% = 70%. 0.70 × 40 = $28.',
      steps: {
        steps: [
          { tex: '100\\% - 30\\% = 70\\%', text: 'Ask what you still PAY.' },
          { tex: '0.70 \\times 40', text: 'One multiplication, no subtraction.' },
        ],
        answer: '\\$28',
      },
    },
    { kind: 'protip', head: 'Ask: up or down?', body: 'Before computing, decide which way the price moves. "Off", "discount", "sale" → price goes DOWN. "Tax", "tip", "increase" → price goes UP. Write a little arrow next to the problem so you don\'t forget at the end.' },
    {
      kind: 'trap',
      head: 'Trap: stopping at the percent amount',
      body: 'For the $40 shirt at 30% off, $12 is NOT the answer — that\'s just the discount! The question wants the SALE PRICE: $40 − $12 = $28. Always re-read what the question asks: the change, or the final price?',
      art: flow([{ label: 'You found the discount: $12', color: SKY }, { label: 'The question asked the PRICE', color: ROSE }, { label: 'Subtract: $40 − $12 = $28', color: EMR }], { title: 'Finish the question you were asked' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\$12', lines: ['That is the discount', 'Not the price'], tone: 'bad' },
          { title: 'Right', tex: '\\$40 - \\$12 = \\$28', lines: ['Finish the sentence', 'That is what you pay'], tone: 'ok' },
        ],
      },
    },
    { kind: 'trap', head: 'Trap: subtracting when you should add', body: '"% off" means subtract, but "% tax" and "% tip" mean ADD. Kids who subtract tax get a store that pays THEM — nice try! Match the operation to the story before you finish.' },
    { kind: 'challenge', head: 'Extra credit: sale then tax', body: 'A $50 game is 20% off, then 10% tax is added. Final price?\nSale: 50 × 0.80 = $40. Tax: 40 × 1.10 = $44 total.' },
    { kind: 'summary', head: 'Percent power, applied', body: 'Convert the percent to a decimal (point two places left) and multiply — or build it from 10% chunks. Discounts subtract from the price; tax and tips add on. And always finish the problem: give the final price, not just the percent amount.' },
  ],
  '6.RP-8': [
    {
      kind: 'objective',
      head: 'Speed, prices & the better deal',
      body: 'Today you will compute speeds, unit prices, and — the superpower — which deal is actually cheaper. Stores count on people not checking the price per pound. After today, they can\'t fool you.',
      art: flow([{ label: 'Divide to get "per one"', color: SKY }, { label: 'Label the unit', color: AMB }, { label: 'Compare like with like', color: EMR }], { title: 'Which deal actually wins' }),
    },
    {
      kind: 'concept',
      head: 'Unit rate = amount per 1',
      body: 'A unit rate is "per one": miles per 1 hour, dollars per 1 pound, cost per 1 cookie. It squishes any rate down to a single, comparable number. That\'s what "mph" and "price per lb" tags really are.',
      art: doubleLine(
        { label: 'cookies', vals: [0, 4, 8, 12] },
        { label: 'dollars', vals: [0, 2, 4, 6] },
        { title: '12 cookies for $6', mark: 1, caption: 'Slide down to one of something and you can compare any two deals.' },
      ),
    },
    {
      kind: 'concept',
      head: 'Divide total by units',
      body: 'To find a unit rate, divide the total by the number of units. 180 miles in 3 hours → 180 ÷ 3 = 60 mph. The unit named ON TOP (miles) gets divided by the unit on the bottom (hours).',
      art: flow([{ label: 'Total ÷ how many units', color: SKY }, { label: 'The answer is "per one"', color: AMB }, { label: 'Always write the unit down', color: EMR }], { title: 'One division, one label' }),
    },
    {
      kind: 'concept',
      head: 'Compare deals with unit prices',
      body: 'To pick the better deal, find the unit price of EACH option, then choose the smaller one. You cannot compare "4 lbs for $10" and "6 lbs for $12" directly — but $2.50/lb vs $2.00/lb is instant.',
      art: bars([{ name: 'deal A: 50c each', vals: [50], color: SKY }, { name: 'deal B: 55c each', vals: [55], color: AMB }], { labels: ['cents per cookie'], title: 'Same units, easy comparison', caption: 'Totals cannot be compared when the sizes differ. Price per one always can.' }),
      table: {
        head: ['deal', 'maths', 'per item'],
        rows: [['12 for $6', '6 ÷ 12', '$0.50'], ['8 for $4.80', '4.80 ÷ 8', '$0.60'], ['', '', '12-pack wins']],
        mark: 0,
        note: 'The cheapest TOTAL is often not the cheapest deal. Only the per-one price settles it.',
      },
    },
    {
      kind: 'example',
      head: 'Speed: 180 miles in 3 hours',
      body: 'Speed = miles ÷ hours.\n180 ÷ 3 = 60. The speed is 60 mph.',
      steps: {
        steps: [
          { tex: '180 \\text{ miles},\\ 3 \\text{ hours}', text: 'The word "per" points at hours.' },
          { tex: '180 \\div 3', text: 'So hours is the number you divide by.' },
        ],
        answer: '60 \\text{ mph}',
      },
    },
    { kind: 'example', head: 'Speed: 240 miles in 4 hours', body: 'Miles ÷ hours: 240 ÷ 4.\n24 ÷ 4 = 6, so 240 ÷ 4 = 60. Speed: 60 mph.' },
    {
      kind: 'example',
      head: 'Unit price: 12 cookies for $6',
      body: 'Cost per cookie = $6 ÷ 12.\nSix split among twelve is half a dollar each: 6 ÷ 12 = 0.50. Each cookie costs $0.50.',
      art: doubleLine({ label: 'cookies', vals: [0, 4, 8, 12] }, { label: 'dollars', vals: [0, 2, 4, 6] }, { title: '50 cents per cookie', caption: 'Twelve cookies for six dollars comes down to one cookie for fifty cents.' }),
    },
    { kind: 'example', head: 'Unit price: 8 oranges for $4', body: 'Cost per orange = $4 ÷ 8.\n4 ÷ 8 = 0.50. Each orange costs $0.50 — fifty cents.' },
    { kind: 'example', head: 'Better deal: apples by the pound', body: 'Deal A: 4 lbs for $10. Deal B: 6 lbs for $12. Which is cheaper per pound?\nA: $10 ÷ 4 = $2.50 per lb. B: $12 ÷ 6 = $2.00 per lb.\nSmaller wins: Deal B, 6 lbs for $12.' },
    {
      kind: 'example',
      head: 'Better deal: juice boxes',
      body: 'Deal A: 5 boxes for $5. Deal B: 8 boxes for $6.\nA: $5 ÷ 5 = $1.00 per box. B: $6 ÷ 8 = $0.75 per box.\n$0.75 beats $1.00 — Deal B is the better buy.',
      steps: {
        steps: [
          { tex: '\\$3.00 \\div 6 = \\$0.50', text: 'Pack A, per box.' },
          { tex: '\\$4.40 \\div 10 = \\$0.44', text: 'Pack B, per box.' },
          { tex: '0.44 < 0.50', text: 'Lower per-box price wins.' },
        ],
        answer: '\\text{pack B}',
      },
    },
    { kind: 'example', head: 'Another way: compare per dollar', body: 'Which is the better buy: 6 pens for $3 or 8 pens for $5?\nPens per dollar: 6 ÷ 3 = 2 pens, and 8 ÷ 5 = 1.6 pens. More per dollar wins, so 6 for $3 is better.' },
    { kind: 'protip', head: 'Label every unit rate', body: 'Always write the unit next to your answer: $2.50/lb, 60 mph, $0.75 per box. Labels stop you from comparing dollars-per-pound to pounds-per-dollar by accident. A number without a label is a guess; a number with a label is an answer.' },
    {
      kind: 'trap',
      head: 'Trap: judging deals by the total',
      body: '"$12 is more than $10, so $10 is cheaper" — nope! The $12 deal gives you MORE pounds. Only the price PER POUND tells the truth: $2.00/lb beats $2.50/lb. Never compare totals; always compare unit prices.',
      art: bars([{ name: '$6 for 12', vals: [50], color: EMR }, { name: '$4 for 7', vals: [57], color: ROSE }], { labels: ['cents each'], title: 'The cheaper total is not the better deal', caption: 'Four dollars looks cheaper than six, but per cookie it costs more.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '\\$3 < \\$4.40', lines: ['Cheaper to buy', 'But fewer boxes'], tone: 'bad' },
          { title: 'Right', tex: '\\$0.44 < \\$0.50', lines: ['Compare per box', 'Bigger pack is better value'], tone: 'ok' },
        ],
      },
    },
    { kind: 'trap', head: 'Trap: flipping the division', body: 'A "mph" answer means miles go ON TOP: miles ÷ hours. Computing 3 ÷ 180 gives a tiny nonsense speed. Match the order of the units in the answer — the first-named unit is the one you divide.' },
    { kind: 'challenge', head: 'Extra credit: how much cheaper', body: 'Store A: 4 bars for $6. Store B: 6 bars for $6. How much cheaper per bar is B?\nA: 6 ÷ 4 = $1.50 each. B: 6 ÷ 6 = $1.00 each. B saves $0.50 per bar.' },
    {
      kind: 'summary',
      head: 'Divide, label, compare',
      body: 'Unit rate = total ÷ number of units, with the "per" unit on the bottom. Label every answer (mph, $/lb) so units never flip. For deals, find each unit price and pick the smaller — totals lie, unit prices don\'t.',
      art: flow([
          { label: 'divide total by the count' },
          { label: 'write the label: per what?' },
          { label: 'compare the per-one prices' },
        ], { title: 'the better-deal routine', caption: 'The label is what stops you comparing dollars-per-box with boxes-per-dollar.' }),
    },
  ],
  '6.RP-9': [
    {
      kind: 'objective',
      head: 'Convert like a pro',
      body: 'Today you will convert measurements — inches to feet, centimeters to meters, kilometers to meters — using ratio thinking. Learn five anchor facts and one direction rule, and every conversion becomes two steps.',
      art: flow([{ label: 'Recall the anchor', color: SKY }, { label: 'Bigger unit? Divide', color: AMB }, { label: 'Smaller unit? Multiply', color: EMR }], { title: 'Unit conversion in three moves' }),
    },
    {
      kind: 'concept',
      head: 'Memorize the anchors',
      body: 'A few facts unlock everything: 12 in = 1 ft, 3 ft = 1 yd, 100 cm = 1 m, 1000 m = 1 km, and 16 oz = 1 lb. Each anchor says how many small units make one big unit. Keep them in your back pocket.',
      art: flow([{ label: '1 foot = 12 inches', color: SKY }, { label: '1 yard = 3 feet', color: AMB }, { label: '1 pound = 16 ounces', color: EMR }, { label: '1 metre = 100 cm', color: VIO }], { title: 'Four anchors do most of the work' }),
      table: {
        head: ['1 of these', 'is', 'to convert'],
        rows: [['1 foot', '12 inches', '× 12'], ['1 yard', '3 feet', '× 3'], ['1 pound', '16 ounces', '× 16'], ['1 metre', '100 cm', '× 100']],
        note: 'Learn the right column and every conversion in the unit is one multiply or one divide.',
      },
    },
    {
      kind: 'concept',
      head: 'To a smaller unit: multiply',
      body: 'Converting to a SMALLER unit means you\'ll count MORE of them, so multiply by the anchor. 2 feet becomes 2 × 12 = 24 inches. Small pieces are plentiful.',
      art: doubleLine({ label: 'feet', vals: [0, 1, 2, 3] }, { label: 'inches', vals: [0, 12, 24, 36] }, { title: 'Smaller units, bigger count', caption: 'Inches are smaller than feet, so it takes more of them — multiply.' }),
    },
    {
      kind: 'concept',
      head: 'To a bigger unit: divide',
      body: 'Converting to a BIGGER unit means FEWER of them, so divide by the anchor. 36 inches becomes 36 ÷ 12 = 3 feet. Big units gobble up many small ones.',
      art: doubleLine({ label: 'inches', vals: [0, 12, 24, 36] }, { label: 'feet', vals: [0, 1, 2, 3] }, { title: 'Bigger units, smaller count', caption: 'Feet are bigger than inches, so you need fewer of them — divide.' }),
    },
    {
      kind: 'concept',
      head: 'Metric moves the decimal point',
      body: 'Metric anchors are powers of ten, so converting is just sliding the decimal point. Meters to centimeters: slide 2 places right (× 100). Meters to kilometers: slide 3 places left (÷ 1000). No long math needed!',
      art: numberLine(0, 5, [
          { at: 0, label: '0 m', color: SKY },
          { at: 1, label: '100 cm', color: AMB },
          { at: 2, label: '200 cm', color: AMB },
          { at: 5, label: '500 cm', color: EMR },
        ], { step: 1, title: 'metres along the top, centimetres below', caption: 'Metric anchors are all powers of ten, so the digits never change — only the point moves.' }),
    },
    { kind: 'example', head: 'Feet to inches: 2 feet', body: 'Anchor: 1 ft = 12 in. Inches are smaller, so multiply.\n2 × 12 = 24. Answer: 24 inches.' },
    { kind: 'example', head: 'Yards to feet: 4 yards', body: 'Anchor: 1 yd = 3 ft. Feet are smaller, so multiply.\n4 × 3 = 12. Answer: 12 feet.' },
    {
      kind: 'example',
      head: 'Inches to feet: 36 inches',
      body: 'Anchor: 12 in = 1 ft. Feet are bigger, so divide.\n36 ÷ 12 = 3. Answer: 3 feet.',
      steps: {
        steps: [
          { tex: '1 \\text{ ft} = 12 \\text{ in}', text: 'Recall the anchor.' },
          { tex: '36 \\div 12', text: 'Feet are bigger, so divide.' },
        ],
        answer: '3 \\text{ feet}',
      },
    },
    {
      kind: 'example',
      head: 'Cm to meters: 250 cm',
      body: 'Anchor: 100 cm = 1 m. Meters are bigger, so divide.\n250 ÷ 100 = 2.5 — the decimal point slides two places left. Answer: 2.5 meters.',
      steps: {
        steps: [
          { tex: '250 \\div 100', text: 'Metres are bigger than centimetres.' },
          { tex: '250 \\to 2.50', text: 'Slide the point two places.' },
        ],
        answer: '2.5 \\text{ m}',
      },
    },
    { kind: 'example', head: 'Km to meters: 5 km', body: 'Anchor: 1 km = 1000 m. Meters are smaller, so multiply.\n5 × 1000 = 5000 — three zeros hop on. Answer: 5000 meters.' },
    { kind: 'example', head: 'Ounces to pounds: 48 oz', body: 'Anchor: 16 oz = 1 lb. Pounds are bigger, so divide.\n48 ÷ 16 = 3, since 16 × 3 = 48. Answer: 3 pounds.' },
    { kind: 'example', head: 'Another way: count up in 16s', body: 'Change 48 ounces to pounds (1 lb = 16 oz).\nCount up: 16, 32, 48 — that is three 16s. So 48 oz = 3 pounds.' },
    { kind: 'protip', head: 'Guess the size before you compute', body: 'Before converting, estimate: 250 cm is about the height of a door, so it should be "2-and-a-bit" meters — and 2.5 fits! If your computed answer is 25,000 meters, the estimate catches it instantly. Estimate first, compute second.' },
    {
      kind: 'trap',
      head: 'Trap: multiplying inches into feet',
      body: 'Inches → feet trips everyone up: kids multiply and get 36 in = 432 "feet". But feet are BIGGER, so 36 inches fits FEWER times: 36 ÷ 12 = 3 feet. Smaller-to-bigger always means divide.',
      art: flow([{ label: 'Going to a BIGGER unit?', color: SKY }, { label: 'The number must get SMALLER', color: EMR }, { label: 'If it grew, you multiplied by mistake', color: ROSE }], { title: 'Sanity-check the size' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '36 \\times 12 = 432', lines: ['432 feet of desk', 'Nonsense'], tone: 'bad' },
          { title: 'Right', tex: '36 \\div 12 = 3', lines: ['3 feet', 'Believable'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: kilometers to centimeters', body: 'How many centimeters are in 2 km? (1 km = 1000 m, 1 m = 100 cm.)\n2 km = 2000 m, and 2000 × 100 = 200,000 cm.' },
    {
      kind: 'summary',
      head: 'Anchors + direction = done',
      body: 'Know the anchors: 12 in/ft, 3 ft/yd, 100 cm/m, 1000 m/km, 16 oz/lb. To a smaller unit, multiply; to a bigger unit, divide. Estimate the size first so a wrong direction can never sneak past you.',
      art: flow([
          { label: 'recall the anchor' },
          { label: 'smaller unit? multiply' },
          { label: 'bigger unit? divide' },
        ], { horizontal: true, title: 'two things to remember', caption: 'The anchor and the direction — nothing else.' }),
    },
  ],
  '6.RP-10': [
    {
      kind: 'objective',
      head: 'Scale anything with ratios',
      body: 'Today you put ratios to work: scaling recipes up, figuring out real counts from a ratio, and checking whether two ratios match. One idea — the scale factor — solves them all.',
      art: flow([{ label: 'Find the scale factor', color: SKY }, { label: 'Apply it to BOTH sides', color: AMB }, { label: 'Check one pair', color: EMR }], { title: 'Scaling a ratio safely' }),
    },
    {
      kind: 'concept',
      head: 'Equivalent ratios share a multiplier',
      body: 'Two ratios are equivalent when one is the other with BOTH parts multiplied by the same number. 2:3 × 4 gives 8:12, so 2:3 and 8:12 are equivalent. That shared multiplier is called the scale factor.',
      art: doubleLine({ label: '2 : 3 →', vals: [2, 4, 6, 8] }, { label: 'pairs with', vals: [3, 6, 9, 12] }, { title: '2:3, 4:6, 6:9, 8:12', caption: 'Every column is the same ratio wearing bigger numbers.' }),
      table: {
        head: ['ratio', '× what', 'equivalent?'],
        rows: [['2 : 3', '× 4', '8 : 12 ✓'], ['2 : 3', '× 5', '10 : 15 ✓'], ['2 : 3', '?', '8 : 15 ✗']],
        mark: 2,
        note: 'Both numbers must be multiplied by the SAME thing, or the comparison changes.',
      },
    },
    {
      kind: 'concept',
      head: 'Find the scale factor by dividing',
      body: 'To scale from 4 servings to 6 servings, divide: 6 ÷ 4 = 1.5. That 1.5 is your scale factor — multiply EVERY ingredient by it. Recipes, teams, paint mixes: same move every time.',
      art: flow([{ label: 'New ÷ old = the factor', color: SKY }, { label: 'Apply it to BOTH sides', color: AMB }, { label: 'Check one pair to be sure', color: EMR }], { title: 'One number scales everything' }),
      formula: {
        tex: 'k = \\frac{\\text{new}}{\\text{old}}',
        note: 'Divide a new number by its old partner and you have the factor for everything else.',
      },
    },
    { kind: 'concept', head: 'From ratio to real counts', body: 'A ratio like dogs:cats = 3:5 shows the pattern, not the real numbers. If there are actually 20 cats, find the multiplier: 20 ÷ 5 = 4. Then every ratio number gets × 4 — so dogs = 3 × 4 = 12.' },
    {
      kind: 'concept',
      head: 'Ratio tables organize the scaling',
      body: 'Write the known pair as a row — 4 servings | 6 cups — then scale to a new row. Multiply both entries by the same factor and the table stays truthful. It\'s the same golden rule: both sides move together.',
      art: doubleLine({ label: 'servings', vals: [2, 4, 6, 8] }, { label: 'cups', vals: [3, 6, 9, 12] }, { title: 'A ratio table, drawn out', caption: 'Each step right multiplies both rows by the same thing, so the ratio never changes.' }),
    },
    { kind: 'example', head: 'Check equivalence: 2:3 and 8:12', body: 'Is 2:3 equivalent to 8:12?\nTry a multiplier: 2 × 4 = 8 and 3 × 4 = 12. Both parts use × 4, so YES — they are equivalent.' },
    {
      kind: 'example',
      head: 'Scale a recipe: 4 servings → 6',
      body: '4 servings need 6 cups of flour. How much flour for 6 servings?\nScale factor = 6 ÷ 4 = 1.5. Flour = 6 × 1.5 = 9. Answer: 9 cups.',
      steps: {
        steps: [
          { tex: '6 \\div 4 = 1.5', text: 'Find the factor from the servings.' },
          { tex: '\\text{every ingredient} \\times 1.5', text: 'Apply it to all of them.' },
        ],
        answer: 'k = 1.5',
      },
    },
    { kind: 'example', head: 'Triple batch: 3 eggs per 12 cookies', body: 'How many eggs for 36 cookies?\n36 ÷ 12 = 3, so you\'re making 3 times the cookies. Eggs = 3 × 3 = 9. Answer: 9 eggs.' },
    { kind: 'example', head: 'Real counts: dogs to cats 3:5', body: 'A shelter\'s dogs:cats ratio is 3:5, and there are 20 cats. How many dogs?\nMultiplier = 20 ÷ 5 = 4. Dogs = 3 × 4 = 12. Answer: 12 dogs.' },
    { kind: 'example', head: 'Unit-rate route: 5 packs cost $20', body: 'What do 8 packs cost?\nFirst find the price per pack: $20 ÷ 5 = $4. Then scale up: $4 × 8 = $32. Answer: $32.' },
    {
      kind: 'example',
      head: 'Mix it: juice 2:5 with 10 cups juice',
      body: 'A punch uses juice:soda = 2:5. With 10 cups of juice, how much soda?\nMultiplier = 10 ÷ 2 = 5. Soda = 5 × 5 = 25. Answer: 25 cups of soda.',
      art: tape([
          { label: 'juice', boxes: 2, each: '5', color: AMB },
          { label: 'water', boxes: 5, each: '5', color: SKY },
        ], { title: 'each box is 5 cups', total: '10 cups juice, 25 cups water', caption: 'Ten cups over two boxes means five per box — now fill the other row.' }),
    },
    { kind: 'example', head: 'Another way: one scale factor', body: '3 packs cost $6. Find the cost of 8 packs with a single multiplier.\nUnit rate: 6 ÷ 3 = $2 per pack. Then 8 × 2 = $16.' },
    {
      kind: 'protip',
      head: 'Two roads: scale factor or unit rate',
      body: 'Stuck on a scaling problem? You have two roads. Road 1: find the scale factor (new ÷ old) and multiply everything. Road 2: drop to the unit rate (per 1) and build back up. If one road looks muddy, take the other!',
      compare: {
        cols: [
          { title: 'Scale factor', tex: '\\times k', lines: ['Jump straight across', 'Fast when k is neat'], tone: 'accent' },
          { title: 'Unit rate', tex: '\\div \\text{then} \\times', lines: ['Go via one', 'Always works'], tone: 'ok' },
        ],
        note: 'Same answer either way. Pick whichever gives you whole numbers.',
      },
    },
    {
      kind: 'trap',
      head: 'Trap: scaling only one side',
      body: 'The classic blunder: doubling the flour but not the eggs, or multiplying just one ratio part. BOTH parts of a ratio — and EVERY ingredient in a recipe — get the same scale factor. One-sided scaling breaks the ratio completely.',
      art: tape([{ label: 'juice', boxes: 2, each: '5', color: SKY }, { label: 'water', boxes: 5, each: '2', color: ROSE }], { total: 'both rows must scale together', title: 'Scale both, or ruin the mix', caption: 'Doubling the juice without doubling the water changes the recipe entirely.' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '2 : 3 \\to 8 : 3', lines: ['Only the left grew', 'Different ratio'], tone: 'bad' },
          { title: 'Right', tex: '2 : 3 \\to 8 : 12', lines: ['Both × 4'], tone: 'ok' },
        ],
      },
    },
    { kind: 'challenge', head: 'Extra credit: scale the recipe', body: 'A recipe for 4 people uses 6 eggs. How many eggs for 10 people?\nPer person: 6 ÷ 4 = 1.5 eggs. Then 10 × 1.5 = 15 eggs.' },
    { kind: 'summary', head: 'One factor rules them all', body: 'Equivalent ratios multiply both parts by one scale factor. Find that factor by dividing new by old, then multiply everything by it. When you have a real count, divide it by its ratio number to get the multiplier — then scale the rest.' },
  ],
  '6.RP-11': [
    {
      kind: 'objective',
      head: 'Distance = rate × time',
      body: 'Today you will master the speed formula d = r × t, the equation behind every road trip. You will find distance, speed, OR time — whichever is missing — and learn why the units must match before you touch the numbers.',
      art: flow([{ label: 'Match the units first', color: SKY }, { label: 'Cover the missing one', color: AMB }, { label: 'Multiply or divide', color: EMR }], { title: 'The distance triangle' }),
    },
    {
      kind: 'concept',
      head: 'Speed is a rate',
      body: 'Speed tells you distance per unit of time: miles per hour, kilometers per hour, meters per second. A car at 60 mph covers 60 miles EACH hour. Speed is just a unit rate wearing a racing helmet.',
      art: doubleLine(
        { label: 'hours', vals: [0, 1, 2, 3] },
        { label: 'miles', vals: [0, 12, 24, 36] },
        { title: '12 miles every hour', mark: 1, caption: 'A speed is just a rate with time on one of the lines.' },
      ),
    },
    {
      kind: 'concept',
      head: 'The triangle: d over r · t',
      body: 'Distance, rate, and time link up as d = r × t. Picture a triangle with d on top and r and t on the bottom. Cover the one you want: d = r × t, r = d ÷ t, t = d ÷ r. One picture, three formulas.',
      art: flow([{ label: 'Cover d → d = r × t', color: SKY }, { label: 'Cover r → r = d ÷ t', color: AMB }, { label: 'Cover t → t = d ÷ r', color: EMR }], { title: 'One triangle, three formulas', caption: 'Hide the thing you want and the triangle shows you what to do with the other two.' }),
      formula: {
        tex: 'd = r \\times t \\qquad r = \\frac{d}{t} \\qquad t = \\frac{d}{r}',
        note: 'Cover the letter you want and the triangle shows you what to do with the other two.',
        parts: [
          { sym: 'd', means: 'distance — how far you went', tone: 'accent' },
          { sym: 'r', means: 'rate — how fast, per one unit of time', tone: 'ok' },
          { sym: 't', means: 'time — how long it took', tone: 'warn' },
        ],
      },
    },
    {
      kind: 'concept',
      head: 'Units must match FIRST',
      body: '"Miles per HOUR" only works with time in HOURS. If the time is in minutes, convert before computing: minutes ÷ 60 = hours, so 30 minutes = 0.5 hour. Mismatched units give confident wrong answers.',
      art: flow([{ label: 'Speed in miles per HOUR?', color: SKY }, { label: 'Then time must be in hours', color: AMB }, { label: '30 minutes = 0.5 hours', color: EMR }], { title: 'Convert before you multiply' }),
      compare: {
        cols: [
          { title: 'Wrong', tex: '60 \\text{ mph} \\times 30', lines: ['30 is minutes', '1800 miles!'], tone: 'bad' },
          { title: 'Right', tex: '60 \\times 0.5', lines: ['30 min = 0.5 hours', '30 miles'], tone: 'ok' },
        ],
        note: 'If the rate says "per hour", the time must be in hours before you multiply.',
      },
    },
    {
      kind: 'example',
      head: 'Find distance: 12 mph for 3 hours',
      body: 'A cyclist rides at 12 mph for 3 hours. How far?\nWant distance: d = r × t = 12 × 3.\n12 × 3 = 36. Answer: 36 miles.',
      art: doubleLine({ label: 'hours', vals: [0, 1, 2, 3] }, { label: 'miles', vals: [0, 12, 24, 36] }, { title: 'Three hours reaches 36 miles' }),
    },
    { kind: 'example', head: 'Find speed: 240 km in 4 hours', body: 'A train covers 240 km in 4 hours. What is its speed?\nWant rate: r = d ÷ t = 240 ÷ 4.\n24 ÷ 4 = 6, so 240 ÷ 4 = 60. Answer: 60 km/h.' },
    {
      kind: 'example',
      head: 'Find time: 150 miles at 50 mph',
      body: 'How long does 150 miles take at 50 mph?\nWant time: t = d ÷ r = 150 ÷ 50.\n50 × 3 = 150, so t = 3. Answer: 3 hours.',
      steps: {
        steps: [
          { tex: 't = \\frac{d}{r}', text: 'Cover t in the triangle.' },
          { tex: '150 \\div 50', text: 'Distance over rate.' },
        ],
        answer: '3 \\text{ hours}',
      },
    },
    { kind: 'example', head: 'Convert first: 60 mph for 30 min', body: 'A car drives 60 mph. How far in 30 minutes?\nUnits clash — convert: 30 ÷ 60 = 0.5 hour.\nd = r × t = 60 × 0.5 = 30. Answer: 30 miles.' },
    { kind: 'example', head: 'Sailing: 20 km/h for 2 hours', body: 'A boat sails at 20 km/h for 2 hours. How far?\nd = r × t = 20 × 2 = 40. Answer: 40 km.' },
    {
      kind: 'example',
      head: 'Sprinting: 5 m/s for 1 minute',
      body: 'A runner moves 5 meters per second. How far in 1 minute?\nMatch units: 1 minute = 60 seconds.\nd = r × t = 5 × 60 = 300. Answer: 300 meters.',
      steps: {
        steps: [
          { tex: '1 \\text{ min} = 60 \\text{ s}', text: 'The rate is per SECOND, so convert first.' },
          { tex: '5 \\times 60', text: 'Now the units match.' },
        ],
        answer: '300 \\text{ m}',
      },
    },
    { kind: 'example', head: 'Another way: miles per minute', body: 'A car goes 60 mph. How far in 30 minutes?\nUse miles per minute: 60 ÷ 60 = 1 mile each minute. In 30 minutes: 30 × 1 = 30 miles.' },
    { kind: 'protip', head: 'Circle what\'s missing', body: 'Read the problem and circle which of the three — distance, rate, time — is missing. The other two are given. Missing d? Multiply. Missing r or t? Divide the distance by the one you have. The circle picks the formula for you.' },
    {
      kind: 'trap',
      head: 'Trap: minutes pretending to be hours',
      body: 'At 60 mph for 30 minutes, computing 60 × 30 = 1800 miles is wildly wrong — that\'s New York to way past Denver! MPH needs HOURS: 30 minutes = 0.5 hour, so the real distance is 60 × 0.5 = 30 miles. Convert time before you multiply.',
      art: flow([{ label: '60 mph for 30 minutes', color: SKY }, { label: '30 is NOT the time to use', color: ROSE }, { label: 'Use 0.5 hours → 30 miles', color: EMR }], { title: 'Minutes need converting first' }),
    },
    { kind: 'trap', head: 'Trap: dividing the wrong pair', body: 'When finding speed, distance goes ON TOP: r = d ÷ t. Computing 4 ÷ 240 for the train gives a crawl of 0.0167 — obviously silly for a train. If your speed looks absurd, flip the division and check again.' },
    { kind: 'challenge', head: 'Extra credit: two-leg trip', body: 'A cyclist rides 12 mph for 2 hours, then 18 mph for 1 hour. Total distance?\nLeg 1: 12 × 2 = 24 miles. Leg 2: 18 × 1 = 18 miles. Total: 24 + 18 = 42 miles.' },
    {
      kind: 'summary',
      head: 'Three friends, one triangle',
      body: 'd = r × t connects distance, rate, and time — cover the missing one in the triangle to pick your formula. Multiply for distance; divide the distance for rate or time. And ALWAYS match the units first: minutes become hours (÷ 60) before mph math.',
      art: flow([
          { label: 'circle what is missing' },
          { label: 'check the units match' },
          { label: 'cover it in the triangle' },
          { label: 'multiply or divide the other two' },
        ], { title: 'the distance-rate-time routine', caption: 'The units check is step two for a reason.' }),
    },
  ],
};
