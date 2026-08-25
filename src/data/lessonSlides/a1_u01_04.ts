import type { SlideBank } from './types';

// Algebra 1 slide decks, units 1-4.

export const A1_SLIDES_U01_04: SlideBank = {
  // ---------------- A1-1 — The language of algebra ----------------
  'A1-1': [
    { kind: 'objective', head: 'Algebra: math with mystery boxes', body: 'Today you learn to read and write algebra. A letter like n is a MYSTERY BOX holding a number you do not know yet. You will translate everyday words into expressions and open the box to find their value.' },
    { kind: 'concept', head: 'A variable is a mystery box', body: 'When you write n, you are saying "some number lives here, and I do not know which one yet." A bag holding b marbles is a perfect mystery box: the bag is real, the count is hidden. Algebra lets you work with the box before you ever peek inside.' },
    { kind: 'concept', head: 'Words become symbols', body: 'Every math phrase has a symbol twin. "3 more than n" is n + 3. "Twice n" is 2n — a number glued to a letter means multiply. Once you know the twins, any sentence can turn into an expression.' },
    { kind: 'concept', head: 'Careful with "less than"', body: 'The phrase "5 less than twice n" builds 2n first, THEN takes 5 away: 2n − 5. The words say the 5 first, but the math puts it last. "Less than" always flips the order.' },
    { kind: 'concept', head: 'Evaluate = open the box', body: 'To EVALUATE an expression, replace the letter with its number and compute. If n = 7, then n + 5 becomes 7 + 5 = 12. Substitute first, then follow order of operations like always.' },
    { kind: 'example', head: 'The marble bag', body: 'A bag holds b marbles and you drop in 3 more.\nStart with the mystery box: b.\nAdd 3: the total is b + 3 — an expression that works no matter what b turns out to be.' },
    { kind: 'example', head: 'Game coins: 50 per level', body: 'A video game pays 50 coins per level plus a one-time 20-coin bonus.\nThe repeating part: 50 × L levels = 50L.\nThe one-time part: + 20. Total coins: 50L + 20.' },
    { kind: 'example', head: 'Cash in the coins', body: 'You beat 4 levels. How many coins does 50L + 20 give?\nSubstitute L = 4: 50 × 4 = 200.\nAdd the bonus: 200 + 20 = 220 coins.' },
    { kind: 'example', head: 'Another way: build a table', body: 'Not sure an expression is right? Make a table.\nLevel 1 → 70 coins. Level 2 → 120. Level 3 → 170.\nEach row jumps by exactly 50, and every row matches 50L + 20 — the expression checks out.' },
    { kind: 'example', head: 'Your allowance, as algebra', body: 'You have $15 and get $10 allowance each week: that is 10w + 15.\nAfter 6 weeks, substitute w = 6.\n10 × 6 = 60, then 60 + 15 = $75.' },
    { kind: 'example', head: 'Combine like terms', body: 'Simplify 4x + 3 + 2x.\nThe x-terms are teammates: 4x + 2x = 6x.\nThe 3 has no letter, so it stands alone: 6x + 3.' },
    { kind: 'example', head: 'Another way: sort the fruit', body: 'Think of 4x + 3 + 2x as 4 apples, 3 oranges, and 2 apples.\nSort them into baskets: 6 apples and 3 oranges.\nThat is 6x + 3 — you combine matching things, never apples with oranges.' },
    { kind: 'protip', head: 'Test expressions with easy numbers', body: 'Unsure between 2n − 5 and 5 − 2n? Plug in a friendly number like n = 10 and act out the words. "5 less than twice 10" is 15, and only 2n − 5 gives 15. A ten-second test beats a guess every time.' },
    { kind: 'trap', head: 'Trap: 2n − 5 is not 5 − 2n', body: 'Subtraction order matters — the two expressions give different answers for almost every n. "5 less than twice n" means twice n comes FIRST, then 5 comes off: 2n − 5. Read "less than" as a flip signal.' },
    { kind: 'challenge', head: 'Extra credit: two mystery boxes', body: 'If x = 3 and y = 4, evaluate x² + 2y.\nSubstitute both: 3² + 2 × 4.\nExponent first: 9. Then 2 × 4 = 8. Total: 9 + 8 = 17.' },
    { kind: 'summary', head: 'You speak algebra now', body: 'A variable is a mystery box for an unknown number. Words translate to symbols — and "less than" flips the order. To evaluate, substitute the number and compute; to simplify, combine only matching terms.' },
  ],

  // ---------------- A1-2 — Solving equations I: one- & two-step ----------------
  'A1-2': [
    { kind: 'objective', head: 'Crack equations by undoing them', body: 'Today you solve equations like x + 9 = 15 and 8w + 20 = 68. The big idea is a balance scale: both sides weigh the same. You will undo operations, in reverse, until the mystery number stands alone.' },
    { kind: 'concept', head: 'An equation is a balance scale', body: 'The equals sign says both sides weigh exactly the same. Whatever you do to one side, you MUST do to the other, or the scale tips and the equation breaks. That one rule powers everything in this unit.' },
    { kind: 'concept', head: 'Undo with opposites', body: 'Every operation has an undo button. Addition undoes subtraction, and division undoes multiplication. If x + 9 = 15, subtract 9 from both sides and x stands alone.' },
    { kind: 'concept', head: 'Two steps? Unwrap backwards', body: 'In 8w + 20 = 68, the w got wrapped twice: first times 8, then plus 20. Unwrap like a present, backwards: peel off the +20 first, then the ×8. Last operation on gets undone first.' },
    { kind: 'concept', head: 'Always check your answer', body: 'Plug your answer back into the ORIGINAL equation. If both sides come out equal, you are right — guaranteed. Checking takes ten seconds and catches almost every slip.' },
    { kind: 'example', head: 'One step: x + 9 = 15', body: 'The +9 is the only wrapper.\nSubtract 9 from both sides: x = 15 − 9.\nx = 6. Check: 6 + 9 = 15. ✓' },
    { kind: 'example', head: 'One step: 4x = 28', body: '4x means 4 times x, so undo with division.\nDivide both sides by 4: x = 28 ÷ 4.\nx = 7. Check: 4 × 7 = 28. ✓' },
    { kind: 'example', head: 'The sneaker fund', body: 'You have $20 saved and earn $8 a week; the sneakers cost $68: 8w + 20 = 68.\nSubtract 20 from both sides: 8w = 48.\nDivide by 8: w = 6 weeks. Check: 8 × 6 + 20 = 68. ✓' },
    { kind: 'example', head: 'Another way: picture the scale', body: 'For 8w + 20 = 68, load a scale: 8 mystery boxes and a 20-gram weight balance 68 grams.\nLift 20 grams off EACH pan: 8 boxes balance 48 grams.\nSplit each pan into 8 equal shares: one box weighs 6.' },
    { kind: 'example', head: 'Splitting the pizza bill', body: 'Four friends split a pizza bill equally and each pays $7: b ÷ 4 = 7.\nUndo "divide by 4" by multiplying both sides by 4.\nb = 28 — the whole bill was $28.' },
    { kind: 'example', head: 'Concert tickets plus fees', body: 'Two tickets plus a $6 fee cost $96: 2t + 6 = 96.\nSubtract the fee: 2t = 90.\nDivide by 2: t = $45 per ticket. Check: 2 × 45 + 6 = 96. ✓' },
    { kind: 'example', head: 'Another way: rewind the story', body: 'Solve 2t + 6 = 96 by playing the movie backwards.\nThe story went: double the ticket, then add $6, and land on $96.\nRewind it: take away 6 (get 90), then un-double (get 45). Same moves, told as a story.' },
    { kind: 'protip', head: 'Write both sides every line', body: 'Do one move per line and write BOTH sides each time: 8w + 20 = 68, then 8w = 48, then w = 6. Neat lines make mistakes easy to spot — and easy to fix before they snowball.' },
    { kind: 'trap', head: 'Trap: undoing in the wrong order', body: 'In 3x + 5 = 20, dividing by 3 first forces you to divide the 5 too — messy fractions. Undo the +5 first: 3x = 15, then x = 5. Peel the OUTSIDE wrapper first, always.' },
    { kind: 'challenge', head: 'Extra credit: a backwards two-step', body: 'Solve x ÷ 3 − 2 = 4.\nAdd 2 to both sides first: x ÷ 3 = 6.\nThen multiply by 3: x = 18. Check: 18 ÷ 3 − 2 = 4. ✓' },
    { kind: 'summary', head: 'Balance, undo, check', body: 'An equation is a balance scale, so every move hits both sides. Undo operations in reverse order: plus and minus first, then times and divide. Finish by checking your answer in the original equation.' },
  ],

  // ---------------- A1-3 — Solving equations II: multi-step & both sides ----------------
  'A1-3': [
    { kind: 'objective', head: 'Bigger equations, same balance', body: 'Today you tackle equations with parentheses, extra terms, and x on BOTH sides. Nothing new is scary here: you tidy each side first, then use the same balance-scale moves you already know.' },
    { kind: 'concept', head: 'Distribute: snacks for everyone', body: 'In 3(x + 2), the 3 is handing out snacks: EVERYONE inside the parentheses gets one. So 3(x + 2) = 3x + 6. Skip someone inside and the whole equation goes wrong.' },
    { kind: 'concept', head: 'Tidy each side first', body: 'Before solving, combine like terms on each side. 5x − 5 − 2x is really 3x − 5. A tidy equation is a short equation — clean up first and the solving part gets easy.' },
    { kind: 'concept', head: 'Get the x terms on one team', body: 'When x appears on both sides, like 5x = 2x + 12, move all the x-terms to one side. Subtract 2x from both sides: 3x = 12. One team of x on the left, plain numbers on the right.' },
    { kind: 'concept', head: 'Then finish like before', body: 'After distributing, tidying, and teaming up the x-terms, you are left with a plain two-step equation. Undo the plus or minus, then the times or divide. Same balance scale, same moves.' },
    { kind: 'example', head: 'Distribute first: 3(x + 2) = 21', body: 'Hand the 3 to everyone inside: 3x + 6 = 21.\nSubtract 6 from both sides: 3x = 15.\nDivide by 3: x = 5. Check: 3 × (5 + 2) = 21. ✓' },
    { kind: 'example', head: 'Another way: divide first', body: 'For 3(x + 2) = 21, you can skip distributing.\nBoth whole sides divide by 3: x + 2 = 7.\nSubtract 2: x = 5. When the outside number divides evenly, this road is shorter.' },
    { kind: 'example', head: 'Both sides: 7x − 4 = 3x + 16', body: 'Get the x-terms on one team: subtract 3x from both sides.\n4x − 4 = 16. Add 4: 4x = 20.\nDivide by 4: x = 5. Check: both sides equal 31. ✓' },
    { kind: 'example', head: 'The phone plan showdown', body: 'Plan A: $12 plus $0.10 a minute. Plan B: $0.30 a minute. When do they cost the same?\n12 + 0.10m = 0.30m. Subtract 0.10m: 12 = 0.20m.\nDivide by 0.20: m = 60 minutes — both plans cost $18 there.' },
    { kind: 'example', head: 'Another way: race with a head start', body: 'See the phone plans as a race. Plan B charges 20 cents more each minute, but plan A starts $12 ahead.\nEach minute closes the gap by 20 cents.\nA $12 gap is 1200 cents: 1200 ÷ 20 = 60 minutes to catch up.' },
    { kind: 'example', head: 'Party planning on a budget', body: 'A party room costs $40 plus $6 per guest, and your budget is $100: 40 + 6g = 100.\nSubtract the room fee: 6g = 60.\nDivide by 6: g = 10 guests. Check: 40 + 60 = 100. ✓' },
    { kind: 'example', head: 'The full cleanup: 5(x − 1) − 2x = 2x + 7', body: 'Distribute: 5x − 5 − 2x = 2x + 7.\nCombine like terms on the left: 3x − 5 = 2x + 7.\nSubtract 2x from both sides: x − 5 = 7, so x = 12.' },
    { kind: 'protip', head: 'Move the smaller x-term', body: 'With x on both sides, subtract the SMALLER x-term — in 7x − 4 = 3x + 16, subtract 3x, not 7x. Your x-team stays positive, and positive coefficients mean fewer sign slips.' },
    { kind: 'trap', head: 'Trap: the forgotten snack', body: 'The #1 distributing mistake: turning 3(x + 2) into 3x + 2. The 3 must multiply BOTH terms inside — the x AND the 2 — giving 3x + 6. Nobody in the parentheses goes hungry.' },
    { kind: 'challenge', head: 'Extra credit: parentheses on both sides', body: 'Solve 4(x − 2) = 2(x + 3).\nDistribute both: 4x − 8 = 2x + 6.\nSubtract 2x: 2x − 8 = 6. Add 8: 2x = 14, so x = 7.' },
    { kind: 'summary', head: 'Tidy, team up, solve', body: 'Distribute so everyone inside the parentheses gets their share, and combine like terms on each side. Move all the x-terms to one team. What remains is a two-step equation you already know how to crack.' },
  ],

  // ---------------- A1-4 — Inequalities ----------------
  'A1-4': [
    { kind: 'objective', head: 'Inequalities: a range of answers', body: 'Today you solve inequalities — math sentences like x > 4 with a whole RANGE of answers. You will translate "at least" and "at most", solve with balance moves, learn the one flip rule, and graph on a number line.' },
    { kind: 'concept', head: 'Not one answer — a whole crowd', body: 'An equation like x + 5 = 9 has one answer. An inequality like x + 5 > 9 has a crowd: 5 works, 6 works, 4.001 works. "You must be at least 13 to sign up" is an inequality — a ≥ 13 — and every age from 13 up gets in.' },
    { kind: 'concept', head: 'Translate the boundary words', body: '"At least 13" means 13 or more: a ≥ 13. "At most 40" means 40 or fewer: s ≤ 40. "More than" is a bare >, and "fewer than" is a bare < — no equals bar, so the boundary itself is out.' },
    { kind: 'concept', head: 'Solve like an equation… almost', body: 'Add, subtract, multiply, or divide both sides, exactly like the balance scale. One exception, ever: multiply or divide by a NEGATIVE and the inequality sign flips. Everything else works just like equations.' },
    { kind: 'concept', head: 'Why negatives flip the sign', body: 'Start with a true fact: 2 < 6. Multiply both sides by −1 and you get −2 and −6 — but −2 is the BIGGER one now, so −2 > −6. Negatives mirror the number line, like walking backwards turns you around, so the sign must flip to stay true.' },
    { kind: 'example', head: 'No flip needed: x + 5 > 9', body: 'Subtract 5 from both sides, just like an equation.\nx > 4. The sign stays put — you only subtracted.\nCheck: x = 5 gives 10 > 9. ✓' },
    { kind: 'example', head: 'The bus rule: at most 40', body: 'A school bus holds at most 40 students.\n"At most" means 40 is fine, but 41 is not.\nInequality: s ≤ 40 — the equals bar keeps 40 itself allowed.' },
    { kind: 'example', head: 'The flip in action: −3x > 12', body: 'Divide both sides by −3 to free the x.\nDividing by a negative FLIPS the sign: > becomes <.\nx < −4. Check: x = −5 gives −3 × (−5) = 15 > 12. ✓' },
    { kind: 'example', head: 'Another way: dodge the flip', body: 'Hate flipping? Solve 5 − 2x ≤ 11 without it.\nAdd 2x to BOTH sides: 5 ≤ 11 + 2x. Subtract 11: −6 ≤ 2x.\nDivide by positive 2: −3 ≤ x. Same answer, x ≥ −3, and no negative division anywhere.' },
    { kind: 'example', head: 'Game credits on a budget', body: 'You have $25 and game credits cost $4 each: 4c ≤ 25.\nDivide by 4: c ≤ 6.25.\nCredits come whole, so round DOWN: at most 6 credits — $24 fits, $28 busts the budget.' },
    { kind: 'example', head: 'Saving for the class trip', body: 'You need at least $50, have $18, and save $8 a week: 8w + 18 ≥ 50.\nSubtract 18: 8w ≥ 32. Divide by 8: w ≥ 4.\nThe fewest whole weeks is 4 — week 4 lands you exactly on $50, and "at least" allows it.' },
    { kind: 'example', head: 'Another way: check the boundary number', body: 'To graph x > 2 versus x ≥ 2, test the boundary itself.\nDoes 2 satisfy x > 2? No — 2 > 2 is false, so draw an OPEN dot at 2.\nDoes 2 satisfy x ≥ 2? Yes — so that one gets a CLOSED, filled dot. Then shade toward the numbers that work.' },
    { kind: 'protip', head: 'Test one number at the end', body: 'After solving, pick an easy number from your shaded side and try it in the ORIGINAL inequality. If it works, your answer and your flip decision are both confirmed. One test, total confidence.' },
    { kind: 'trap', head: 'Trap: flipping at the wrong time', body: 'The sign flips ONLY when you multiply or divide by a negative number. Subtracting 5, or even subtracting 5x, never flips it. Solving x − 7 < 2 needs no flip at all: x < 9.' },
    { kind: 'challenge', head: 'Extra credit: two-step with a flip', body: 'Solve −4x + 3 < 23.\nSubtract 3: −4x < 20. Divide by −4 and FLIP: x > −5.\nCheck: x = 0 gives 3 < 23 ✓, and the boundary −5 gives exactly 23, which is not < 23 — open dot at −5.' },
    { kind: 'summary', head: 'You rule the number line', body: 'Inequalities keep a whole range of answers: "at least" is ≥ and "at most" is ≤. Solve with the same balance moves, flipping the sign only when you multiply or divide by a negative. Closed dot when the boundary counts, open when it does not.' },
  ],
};
