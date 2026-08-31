import type { Lesson } from '../lessons';

// Algebra 1, Units 1-4: the language of algebra, one- & two-step equations,
// multi-step & both-sides equations, and inequalities.

export const A1_LESSONS_U01_04: Lesson[] = [
  // ---------------- A1 Unit 1 — The language of algebra ----------------
  {
    domain: 'A1', unit: 1, title: 'The language of algebra',
    objective: 'Translate words into algebraic expressions.',
    concept: [
      'A variable is a MYSTERY BOX: the letter n stands for a number you do not know yet.',
      'TRANSLATE words to symbols: "3 more than n" is n + 3, "twice n" is 2n, "5 less than twice n" is 2n − 5.',
      'To EVALUATE, open the box: replace the letter with its number, then follow order of operations.',
      'LIKE TERMS match letters: 4x and 2x combine into 6x, but 4x and 3 stay apart — apples with apples.',
      'PRO MOVE — test your translation with a real number: if n = 10, “5 less than twice n” should be 15. If your expression does not give 15, it is wearing the wrong clothes.',
    ],
    examples: [
      { q: 'Write an expression: "7 more than a number n".', steps: ['"More than" means add.', 'Start with n and add 7.', 'Expression: n + 7.'], answer: 'n + 7' },
      { q: 'In a video game you earn 50 coins per level plus a 20-coin bonus. Expression for coins after L levels?', steps: ['The repeating part: 50 coins × L levels = 50L.', 'The one-time part: + 20.', 'Expression: 50L + 20.'], answer: '50L + 20' },
      { q: 'Evaluate 3x + 4 when x = 5.', steps: ['Open the mystery box: replace x with 5.', '3 × 5 = 15.', '15 + 4 = 19.'], answer: '19' },
      { q: 'Simplify 5a + 2 + 3a.', steps: ['Like terms: 5a and 3a both have the letter a.', '5a + 3a = 8a. The 2 has no partner.', 'Simplified: 8a + 2.'], answer: '8a + 2' },
      { q: 'Write an expression: the total cost of t tickets at $9 each, plus a $6 booking fee.', steps: ['The repeating part: $9 per ticket makes 9t.', 'The one-time part: + 6.', 'Expression: 9t + 6.'], answer: '9t + 6' },
      { q: 'Evaluate 2(a + 3) when a = 7.', steps: ['Parentheses first: 7 + 3 = 10.', 'Then multiply: 2 × 10 = 20.'], answer: '20' },
    ],
    practice: [
      { q: 'Write an expression for "5 less than twice n".', answers: ['2n - 5', '2n-5', '-5 + 2n'], steps: ['"Twice n" is 2n.', '"5 less than" that means subtract 5 from it.', 'Expression: 2n − 5.'] },
      { q: 'Evaluate 10w + 15 when w = 4. What number do you get?', answers: ['55'], steps: ['Replace w with 4.', '10 × 4 = 40.', '40 + 15 = 55.'] },
      { q: 'Simplify 6x + 3 + 2x. What expression do you get?', answers: ['8x + 3', '8x+3', '3 + 8x'], steps: ['Combine the x-terms: 6x + 2x = 8x.', 'The 3 stays alone.', 'Answer: 8x + 3.'] },
      { q: 'Write an expression for the number of wheels on c cars (4 wheels each).', answers: ['4c', '4 c', 'c*4', '4*c'], steps: ['Each car brings 4 wheels.', 'c cars bring 4 × c = 4c wheels.'] },
      { q: 'Evaluate 5n − 2 when n = 6. What number do you get?', answers: ['28'], steps: ['Replace n with 6: 5 × 6 = 30.', '30 − 2 = 28.'] },
    ],
    watchOut: '"5 less than twice n" is 2n − 5, NOT 5 − 2n — the phrase flips the order, so the 5 comes off the end.',
  },

  // ---------------- A1 Unit 2 — Solving equations I ----------------
  {
    domain: 'A1', unit: 2, title: 'Solving equations: undo it',
    objective: 'Solve one- and two-step equations.',
    concept: [
      'An equation is a BALANCE SCALE: both sides weigh the same, so whatever you do to one side, do to the other.',
      'To find x, UNDO each operation with its opposite: undo +5 with −5, undo ×3 with ÷3.',
      'Two-step equations unwrap like a present, BACKWARDS: undo the + or − first, then the × or ÷.',
      'Always CHECK by plugging your answer back into the original equation.',
      'CHECKING is not extra credit: plugging your answer back in takes five seconds and catches nearly every slip before it costs you.',
    ],
    examples: [
      { q: 'Solve x + 7 = 12.', steps: ['Undo the +7: subtract 7 from both sides.', 'x = 12 − 7.', 'x = 5. Check: 5 + 7 = 12. ✓'], answer: 'x = 5' },
      { q: 'Solve 6x = 42.', steps: ['Undo "times 6": divide both sides by 6.', 'x = 42 ÷ 6.', 'x = 7. Check: 6 × 7 = 42. ✓'], answer: 'x = 7' },
      { q: 'You have $20 saved and earn $8 a week. Solve 8w + 20 = 68 for the weeks until the $68 sneakers.', steps: ['Undo the +20 first: subtract 20 from both sides → 8w = 48.', 'Undo "times 8": divide both sides by 8.', 'w = 6 weeks. Check: 8 × 6 + 20 = 68. ✓'], answer: 'w = 6' },
      { q: 'Solve x ÷ 4 = 9.', steps: ['Undo "divide by 4": multiply both sides by 4.', 'x = 9 × 4.', 'x = 36. Check: 36 ÷ 4 = 9. ✓'], answer: 'x = 36' },
      { q: 'Solve x − 9 = 15.', steps: ['Undo the −9: add 9 to both sides.', 'x = 24. Check: 24 − 9 = 15. ✓'], answer: 'x = 24' },
      { q: 'Solve 4x − 5 = 19.', steps: ['Undo the −5 first: add 5 → 4x = 24.', 'Undo ×4: divide by 4.', 'x = 6. Check: 4 × 6 − 5 = 19. ✓'], answer: 'x = 6' },
    ],
    practice: [
      { q: 'Solve 3x = 21. What is x?', answers: ['7', 'x = 7', 'x=7'], steps: ['Divide both sides by 3.', 'x = 7.'] },
      { q: 'Solve 5x + 4 = 29. What is x?', answers: ['5', 'x = 5', 'x=5'], steps: ['Subtract 4 from both sides: 5x = 25.', 'Divide both sides by 5.', 'x = 5.'] },
      { q: 'Four friends split a pizza bill equally and each pays $7. Solve b ÷ 4 = 7 for the bill b.', answers: ['28', '$28', 'b = 28'], steps: ['Undo "divide by 4": multiply both sides by 4.', 'b = 28. The bill was $28.'] },
      { q: 'Solve x − 6 = 11. What is x?', answers: ['17', 'x = 17', 'x=17'], steps: ['Add 6 to both sides.', 'x = 17.'] },
      { q: 'Solve 2x + 3 = 15. What is x?', answers: ['6', 'x = 6', 'x=6'], steps: ['Subtract 3: 2x = 12.', 'Divide by 2: x = 6.'] },
    ],
    watchOut: 'Only do an operation to ONE side and the scale tips — every move must hit both sides.',
  },

  // ---------------- A1 Unit 3 — Solving equations II ----------------
  {
    domain: 'A1', unit: 3, title: 'Multi-step equations: tidy up first',
    objective: 'Solve multi-step equations with variables everywhere.',
    concept: [
      'DISTRIBUTE first: the number outside the parentheses hands a copy to EVERYONE inside — 3(x + 2) = 3x + 6, like handing snacks to every person in the group.',
      'COMBINE like terms on each side before solving: 5x − 5 − 2x becomes 3x − 5.',
      'Variables on both sides? Get all the x-terms on ONE TEAM: add or subtract an x-term from both sides.',
      'Then finish like a two-step equation, and CHECK both sides give the same number.',
      'When x lives on BOTH sides, move the smaller x-team across first — the x-term stays positive and the usual sign slips never happen.',
    ],
    examples: [
      { q: 'Solve 3(x + 2) = 21.', steps: ['Distribute the 3 to everyone inside: 3x + 6 = 21.', 'Subtract 6 from both sides: 3x = 15.', 'Divide by 3: x = 5. Check: 3 × 7 = 21. ✓'], answer: 'x = 5' },
      { q: 'Solve 7x − 4 = 3x + 16.', steps: ['Get the x-terms on one team: subtract 3x from both sides → 4x − 4 = 16.', 'Add 4 to both sides: 4x = 20.', 'Divide by 4: x = 5. Check: both sides equal 31. ✓'], answer: 'x = 5' },
      { q: 'Plan A costs $12 plus $0.10 per minute; plan B costs $0.30 per minute. Solve 12 + 0.10m = 0.30m.', steps: ['Subtract 0.10m from both sides: 12 = 0.20m.', 'Divide both sides by 0.20.', 'm = 60 minutes — both plans cost $18 there. ✓'], answer: 'm = 60' },
      { q: 'Solve 2x + 3x + 4 = 19.', steps: ['Combine like terms first: 2x + 3x = 5x.', '5x + 4 = 19, so subtract 4: 5x = 15.', 'Divide by 5: x = 3. Check: 6 + 9 + 4 = 19. ✓'], answer: 'x = 3' },
      { q: 'Solve 2(x + 4) = 22.', steps: ['Shortcut: divide both sides by 2 first → x + 4 = 11.', 'Subtract 4: x = 7.', 'Check: 2(11) = 22. ✓'], answer: 'x = 7' },
      { q: 'Solve 5x + 3 = 3x + 15.', steps: ['Move the smaller team: subtract 3x → 2x + 3 = 15.', 'Subtract 3: 2x = 12.', 'x = 6. Check: 33 = 33. ✓'], answer: 'x = 6' },
    ],
    practice: [
      { q: 'Solve 4(x + 1) = 24. What is x?', answers: ['5', 'x = 5', 'x=5'], steps: ['Distribute: 4x + 4 = 24.', 'Subtract 4: 4x = 20.', 'Divide by 4: x = 5.'] },
      { q: 'Solve 6x = 2x + 20. What is x?', answers: ['5', 'x = 5', 'x=5'], steps: ['Subtract 2x from both sides: 4x = 20.', 'Divide by 4: x = 5.'] },
      { q: 'A party room costs $40 plus $6 per guest, and the budget is $100. Solve 40 + 6g = 100 for the guests g.', answers: ['10', 'g = 10', 'g=10'], steps: ['Subtract 40 from both sides: 6g = 60.', 'Divide by 6: g = 10 guests.'] },
      { q: 'Solve 3(x − 2) = 12. What is x?', answers: ['6', 'x = 6', 'x=6'], steps: ['Divide by 3: x − 2 = 4.', 'Add 2: x = 6.'] },
      { q: 'Solve 6x + 1 = 4x + 9. What is x?', answers: ['4', 'x = 4', 'x=4'], steps: ['Subtract 4x: 2x + 1 = 9.', 'Subtract 1, divide by 2: x = 4.'] },
    ],
    watchOut: 'When you distribute 3(x + 2), the 3 multiplies BOTH terms — writing 3x + 2 skips the second person in line.',
  },

  // ---------------- A1 Unit 4 — Inequalities ----------------
  {
    domain: 'A1', unit: 4, title: 'Inequalities and the flip rule',
    objective: 'Solve and graph one-variable inequalities.',
    concept: [
      'An inequality keeps a whole RANGE of answers: "you must be at least 13" means a ≥ 13 — 13 works, and so does every age above it.',
      'TRANSLATE the phrases: "at least" is ≥, "at most" is ≤, "more than" is >, "fewer than" is <.',
      'Solve it like an equation, with ONE twist — the FLIP RULE: multiply or divide by a negative and the sign flips, like walking backwards turns you around.',
      'GRAPH it on a number line: closed (filled) dot when the boundary counts (≤, ≥), open dot when it does not (<, >), then shade the side that works.',
      'A TEST POINT settles any doubt: try an easy number like 0 in the ORIGINAL inequality and see which side of the fence it lives on.',
    ],
    examples: [
      { q: 'Solve x + 5 > 9.', steps: ['Subtract 5 from both sides, just like an equation.', 'x > 4.', 'Graph: open dot at 4, shade right — 4 itself is not included.'], answer: 'x > 4' },
      { q: 'A bus holds at most 40 students. Write the inequality for s students.', steps: ['"At most 40" means 40 is allowed, 41 is not.', 'So s is less than or equal to 40.', 'Inequality: s ≤ 40.'], answer: 's ≤ 40' },
      { q: 'Solve −3x > 12.', steps: ['Divide both sides by −3.', 'Dividing by a NEGATIVE flips the sign: > becomes <.', 'x < −4. Check: x = −5 gives −3 × (−5) = 15 > 12. ✓'], answer: 'x < −4' },
      { q: 'You have $25 for game credits at $4 each. Solve 4c ≤ 25 for whole credits c.', steps: ['Divide both sides by 4: c ≤ 6.25.', 'Credits come whole, so round DOWN.', 'At most 6 credits: 4 × 6 = $24 fits, $28 does not.'], answer: 'c = 6 credits at most' },
      { q: 'Solve 3x − 1 ≤ 8.', steps: ['Add 1: 3x ≤ 9.', 'Divide by the positive 3 — no flip.', 'x ≤ 3.'], answer: 'x ≤ 3' },
      { q: 'Solve −2x > 10.', steps: ['Divide by −2 — negative, so FLIP.', 'x < −5.', 'Test x = −6: −2(−6) = 12 > 10. ✓'], answer: 'x < −5' },
    ],
    practice: [
      { q: 'Solve 2x + 1 < 9. Write your answer like x < 4.', answers: ['x < 4', 'x<4', '4 > x'], steps: ['Subtract 1: 2x < 8.', 'Divide by positive 2 — no flip.', 'x < 4.'] },
      { q: 'Solve −2x ≤ 10. Write your answer like x >= -5.', answers: ['x >= -5', 'x>=-5', 'x ≥ −5', 'x ≥ -5', '-5 <= x'], steps: ['Divide both sides by −2.', 'Dividing by a negative FLIPS the sign: ≤ becomes ≥.', 'x ≥ −5.'] },
      { q: 'You need at least $50 and have $18, saving $8 a week. Solve 8w + 18 ≥ 50 for the fewest whole weeks.', answers: ['4', 'w = 4', '4 weeks'], steps: ['Subtract 18: 8w ≥ 32.', 'Divide by 8: w ≥ 4.', 'The fewest whole weeks is 4.'] },
      { q: 'Solve x − 4 < 6. Answer like “x < 10”.', answers: ['x < 10', 'x<10'], steps: ['Add 4 to both sides.', 'x < 10 — no flip, we never touched a negative.'] },
      { q: 'Solve −3x ≤ 12. Answer like “x >= -4”.', answers: ['x >= -4', 'x>=-4', 'x ≥ -4', 'x≥-4'], steps: ['Divide by −3 and FLIP the sign.', 'x ≥ −4.'] },
    ],
    watchOut: 'The sign flips ONLY when you multiply or divide by a negative — adding or subtracting a negative never flips it.',
  },
];
