/**
 * In-place difficulty-3 rewrites that target the nine MAP-tested standards
 * that previously had ZERO d3 problems. Patches preserve id/unit/orderInUnit
 * (so trail positions don't move) but replace prompt/answer/hints/explanation
 * with a genuinely challenging variant, attach two solution methods, and
 * tag with "MAP-practice".
 *
 * Run: `npx tsx scripts/upgrade-challenges.ts`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

type Hint = { level: 'nudge' | 'guide' | 'reveal'; text: string; title?: string };
type AltExp = { title: string; steps: string[] };

interface Patch {
  id: string;
  file: string;
  standard: string;
  prompt: string;
  answerType: 'short-text' | 'numeric' | 'multiple-choice';
  primaryAnswer: string;
  alternativeAnswers?: string[];
  choices?: { id: string; label: string; correct: boolean }[];
  acceptanceMode?: 'exact' | 'normalized' | 'numeric-tolerance';
  hint: string;
  hints: Hint[];
  explanation: string[];
  alternativeExplanations: AltExp[];
  estimatedSeconds?: number;
  extraTags?: string[];
}

const PATCHES: Patch[] = [
  // ────────────────────────────────────────────────────────────────────
  // 6.EE.A.2.a  —  Write expressions
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.EE.016',
    file: 'content/problems/6.EE/016-translate-3x.json',
    standard: '6.EE.A.2.a',
    prompt:
      'Write an expression for "**twice the sum of a number $x$ and $7$, decreased by $4$**". Use no spaces.',
    answerType: 'short-text',
    primaryAnswer: '2(x+7)-4',
    alternativeAnswers: ['2(x+7) - 4', '2*(x+7)-4', '2x+10', '2x + 10', '(x+7)*2-4'],
    acceptanceMode: 'normalized',
    hint: 'Wrap the "**sum of $x$ and $7$**" inside parentheses before you multiply by $2$.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Warm up: write "**twice the sum of $a$ and $3$**" first. Answer: $2(a+3)$. Apply the same shape here.',
      },
      {
        level: 'nudge',
        text: 'Order of words = order of operations. Build the **inside** first, multiply by $2$, then subtract $4$.',
      },
      { level: 'guide', text: 'Sum of $x$ and $7$ → $(x+7)$. Twice that → $2(x+7)$. Decreased by $4$ → $2(x+7) - 4$.' },
      { level: 'reveal', text: 'Answer: $2(x+7) - 4$ (equivalently $2x + 10$).' },
    ],
    explanation: [
      'Read in pieces: "sum of $x$ and $7$" → $(x+7)$.',
      '"Twice [that sum]" → multiply the **whole sum** by $2$: $2(x+7)$.',
      '"Decreased by $4$" → subtract $4$ from the result: $2(x+7) - 4$.',
      'Distribute to check: $2(x+7) - 4 = 2x + 14 - 4 = 2x + 10$.',
    ],
    alternativeExplanations: [
      {
        title: 'Substitute & check',
        steps: [
          'Pick $x = 3$. The words: "twice the sum of $3$ and $7$, decreased by $4$" = twice $10$, minus $4$ = $16$.',
          'Test $2(x+7) - 4$ at $x=3$: $2(10) - 4 = 16$. ✓',
          'Test $2x + 10$ at $x=3$: $6 + 10 = 16$. ✓ Both forms are equivalent.',
        ],
      },
      {
        title: 'Common trap',
        steps: [
          '"$2x + 7 - 4$" is **wrong** — that means "$7$ more than twice $x$, then subtract $4$".',
          'The word **sum** before $7$ is what forces the parentheses around $(x+7)$.',
          'Whenever you see "twice the sum…", "$3$ times the difference…", etc., the next part belongs **inside** the grouping.',
        ],
      },
    ],
    estimatedSeconds: 90,
  },
  {
    id: '6.EE.019',
    file: 'content/problems/6.EE/019-expr-from-words.json',
    standard: '6.EE.A.2.a',
    prompt:
      'Write an expression for "**$3$ times the quantity "$8$ less than $x$", increased by $x$**" and then **simplify**. Use no spaces.',
    answerType: 'short-text',
    primaryAnswer: '4x-24',
    alternativeAnswers: ['4x - 24', '-24+4x', '3(x-8)+x'],
    acceptanceMode: 'normalized',
    hint: '"$8$ less than $x$" means $x - 8$, NOT $8 - x$. The order matters!',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: '"$8$ less than $x$" is "start at $x$, subtract $8$": $x - 8$. (Think: "$8$ less than my age" — if I\'m $20$, the answer is $12$, not $-12$.)',
      },
      { level: 'nudge', text: 'Build the quantity inside parentheses first, multiply by $3$, then add $x$.' },
      { level: 'guide', text: '$3(x - 8) + x$. Distribute: $3x - 24 + x$. Combine like terms: $4x - 24$.' },
      { level: 'reveal', text: 'Simplified: $4x - 24$.' },
    ],
    explanation: [
      '"$8$ less than $x$" → $x - 8$ (the bigger thing comes first).',
      '"$3$ times the quantity" → $3(x - 8)$.',
      '"Increased by $x$" → $3(x - 8) + x$.',
      'Distribute: $3 \\cdot x - 3 \\cdot 8 + x = 3x - 24 + x$.',
      'Combine like terms: $3x + x = 4x$, so the answer is $4x - 24$.',
    ],
    alternativeExplanations: [
      {
        title: 'Check at $x=10$',
        steps: [
          'Words: "$3$ times ($8$ less than $10$), plus $10$" = $3 \\cdot 2 + 10 = 16$.',
          'Test $4x - 24$ at $x=10$: $40 - 24 = 16$. ✓',
          'Test $3(x-8) + x$ at $x=10$: $3(2) + 10 = 16$. ✓',
        ],
      },
      {
        title: 'Why "less than" flips the order',
        steps: [
          '"$8$ less than $x$" describes a number that is **$8$ smaller than $x$**.',
          'If $x = 100$, "$8$ less than $x$" must equal $92$, not $-92$. So the expression is $x - 8$.',
          'Same logic for "more than": "$5$ more than $y$" is $y + 5$, but addition is symmetric so it doesn\'t bite you. Subtraction does.',
        ],
      },
    ],
    estimatedSeconds: 105,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.EE.A.2.b  —  Parts of expressions (coefficient, term, factor…)
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.EE.017',
    file: 'content/problems/6.EE/017-parts-expr.json',
    standard: '6.EE.A.2.b',
    prompt:
      'In the expression $4(2y + 3) - 5y + 8$, what is the **coefficient of $y$** **after fully simplifying**?',
    answerType: 'numeric' as const,
    primaryAnswer: '3',
    alternativeAnswers: ['3.0'],
    acceptanceMode: 'normalized',
    hint: 'Simplify the expression first — then read off the number in front of $y$.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Warm-up: coefficient of $x$ in $2(3x) - 4x$? Distribute: $6x - 4x = 2x$. Coefficient = $2$. Same idea here.',
      },
      { level: 'nudge', text: 'You can\'t read off the coefficient until **all** like-$y$ terms are combined.' },
      { level: 'guide', text: 'Distribute: $4(2y + 3) = 8y + 12$. So the expression is $8y + 12 - 5y + 8 = 3y + 20$.' },
      { level: 'reveal', text: 'Coefficient of $y$ in $3y + 20$ is $\\boxed{3}$.' },
    ],
    explanation: [
      'A **coefficient** is the number multiplied by a variable — but you only see the **true** coefficient after combining like terms.',
      'Distribute the $4$: $4(2y + 3) = 8y + 12$.',
      'Substitute back: $8y + 12 - 5y + 8$.',
      'Group like terms: $(8y - 5y) + (12 + 8) = 3y + 20$.',
      'The coefficient of $y$ is $3$.',
    ],
    alternativeExplanations: [
      {
        title: 'Verify by plugging in',
        steps: [
          'Pick $y = 10$. Original: $4(20 + 3) - 50 + 8 = 4(23) - 42 = 92 - 42 = 50$.',
          'Check $3y + 20$ at $y = 10$: $30 + 20 = 50$. ✓ The simplified form is correct.',
          'Try $y = 0$: original = $4 \\cdot 3 + 8 = 20$. $3(0) + 20 = 20$. ✓',
        ],
      },
      {
        title: 'Coefficient vs constant',
        steps: [
          'In $3y + 20$, $3$ is the **coefficient** of $y$ (number stuck to a variable).',
          '$20$ is a **constant term** (no variable). It is NOT a coefficient.',
          'Don\'t pick the bigger number — pick the one **next to $y$**.',
        ],
      },
    ],
    estimatedSeconds: 90,
  },
  {
    id: '6.EE.063',
    file: 'content/problems/6.EE/063-variable-in-5a-2.json',
    standard: '6.EE.A.2.b',
    prompt:
      'Fully simplify $3(x + 2) + 4x - 5$. How many **terms** does the simplified expression have?',
    answerType: 'numeric' as const,
    primaryAnswer: '2',
    alternativeAnswers: ['2.0', 'two'],
    acceptanceMode: 'normalized',
    hint: 'A **term** is a number or variable expression separated by $+$ or $-$. Count after combining like terms.',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: 'Before simplifying, this expression has $4$ pieces. After combining like terms it shrinks. Do the work first.',
      },
      { level: 'nudge', text: 'Distribute the $3$, then collect $x$-terms separately from constants.' },
      { level: 'guide', text: '$3(x + 2) + 4x - 5 = 3x + 6 + 4x - 5 = (3x + 4x) + (6 - 5) = 7x + 1$.' },
      { level: 'reveal', text: '$7x + 1$ has $\\boxed{2}$ terms ($7x$ and $1$).' },
    ],
    explanation: [
      'Distribute: $3(x + 2) = 3x + 6$. So the expression becomes $3x + 6 + 4x - 5$.',
      'Group like terms: $(3x + 4x) + (6 - 5)$.',
      'Combine: $7x + 1$.',
      'Count the terms: $7x$ is one term, $+1$ is another. **Total: $2$ terms.**',
    ],
    alternativeExplanations: [
      {
        title: 'What counts as one term?',
        steps: [
          'A **term** is bounded by $+$ or $-$ signs (the sign goes with the term to its right).',
          '$7x + 1$ → terms are $7x$ and $+1$. Two terms.',
          'If the answer had been $7x + 1 - 4$, you would first combine $1 - 4 = -3$ to get $7x - 3$ — still two terms.',
        ],
      },
      {
        title: 'Why distribute first?',
        steps: [
          'Without distributing, you might count $(x + 2)$ as one term, but parentheses hide structure.',
          'After distributing, every term is visible. Then like-term combining tells you the true number of terms.',
          'Rule: **simplify completely** before counting parts of an expression.',
        ],
      },
    ],
    estimatedSeconds: 90,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.EE.B.8  —  Inequalities
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.EE.043',
    file: 'content/problems/6.EE/043-ineq-write.json',
    standard: '6.EE.B.8',
    prompt:
      'A bus seats **at most** $40$ people. Already $13$ riders are on board, and $x$ more want to board. Write an inequality in $x$ (use $≤$ or $≥$). Use no spaces; example form: $x≤27$.',
    answerType: 'short-text',
    primaryAnswer: 'x≤27',
    alternativeAnswers: ['x <= 27', 'x ≤ 27', 'x<=27'],
    acceptanceMode: 'normalized',
    hint: '"At most $40$ total" means the **sum** of riders cannot exceed $40$.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Warm-up: if a parking lot fits at most $20$ cars and $5$ are parked, how many more can come? Up to $15$. That\'s exactly this kind of problem.',
      },
      { level: 'nudge', text: 'Build the inequality in two steps: total ≤ 40, then solve for $x$.' },
      {
        level: 'guide',
        text: 'Riders on the bus = $13 + x$. "At most $40$" → $13 + x ≤ 40$. Subtract $13$: $x ≤ 27$.',
      },
      { level: 'reveal', text: 'Answer: $x ≤ 27$.' },
    ],
    explanation: [
      'Set up: total riders after boarding $= 13 + x$.',
      '"At most" $40$ means $13 + x \\le 40$.',
      'Subtract $13$ from both sides: $x \\le 27$.',
      'Sanity-check: $x = 27$ gives $40$ riders (full bus, still allowed). $x = 28$ gives $41$ — too many.',
    ],
    alternativeExplanations: [
      {
        title: 'Vocabulary check',
        steps: [
          '"**At most** $N$" → $\\le N$ (could be that much, no more).',
          '"**At least** $N$" → $\\ge N$ (could be that much, no less).',
          '"**Fewer than** $N$" → $< N$ (strictly under). "**More than** $N$" → $> N$.',
          'This problem uses "at most", so $\\le$ — and the endpoint $40$ **is** allowed.',
        ],
      },
      {
        title: 'Test values',
        steps: [
          'Try $x = 0$: bus has $13$ riders. $13 \\le 40$ ✓.',
          'Try $x = 27$: bus has $40$ riders. $40 \\le 40$ ✓ (full but legal).',
          'Try $x = 30$: bus would have $43$. $43 \\le 40$? **No.** So $x = 30$ is not a solution.',
          'The cutoff is $x = 27$, matching $x \\le 27$.',
        ],
      },
    ],
    estimatedSeconds: 105,
  },
  {
    id: '6.EE.044',
    file: 'content/problems/6.EE/044-ineq-at-least.json',
    standard: '6.EE.B.8',
    prompt:
      'A movie theater needs **at least** $\\$500$ in ticket sales tonight. Each ticket sells for $\\$8$. Let $y$ = number of tickets sold. Write an inequality in $y$. Use no spaces; example form: $8y≥500$.',
    answerType: 'short-text',
    primaryAnswer: '8y≥500',
    alternativeAnswers: ['8y >= 500', '8y ≥ 500', '8*y>=500', '8y>=500'],
    acceptanceMode: 'normalized',
    hint: 'Sales = price × number of tickets. "**At least** $\\$500$" means sales must be ≥ $500$.',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: 'You don\'t have to solve for $y$ — the question wants the **inequality**, not the minimum number of tickets.',
      },
      { level: 'nudge', text: 'Translate piece by piece: total sales = $8y$. "At least $\\$500$" → $\\ge 500$.' },
      { level: 'guide', text: 'Sales $= 8y$. They need sales $\\ge 500$, so $8y \\ge 500$.' },
      { level: 'reveal', text: 'Inequality: $8y \\ge 500$. (Solving: $y \\ge 62.5$, so they need at least $63$ tickets.)' },
    ],
    explanation: [
      'Let $y$ = number of tickets. Each costs $\\$8$, so total sales $= 8y$ dollars.',
      'Goal: sales must be **at least** $\\$500$.',
      '"At least" → $\\ge$. So $8y \\ge 500$.',
      'Bonus: divide by $8$ → $y \\ge 62.5$. Since tickets are whole, they need at least $63$ tickets.',
    ],
    alternativeExplanations: [
      {
        title: 'Why "at least" uses $\\ge$',
        steps: [
          '"At least $\\$500$" means the sales **could be exactly** $\\$500$ or **more** — but not less.',
          'The inequality $8y \\ge 500$ includes equality (the endpoint counts).',
          'Compare: "more than $\\$500$" would be $8y > 500$ (strictly above, $500$ wouldn\'t count).',
        ],
      },
      {
        title: 'Sanity-check with numbers',
        steps: [
          '$y = 60$: sales $= 8 \\cdot 60 = 480$. $480 \\ge 500$? No. Not enough.',
          '$y = 63$: sales $= 504$. $504 \\ge 500$? Yes. Enough.',
          '$y = 100$: sales $= 800$. Plenty. All values $\\ge 63$ work, matching $8y \\ge 500$.',
        ],
      },
    ],
    estimatedSeconds: 100,
  },
  {
    id: '6.EE.002',
    file: 'content/problems/6.EE/002-inequality-graph.json',
    standard: '6.EE.B.8',
    prompt:
      'Which inequality is shown on the number line below? (An **open** circle means the value itself is **not** included.)',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: '$x \\le -1$ or $x > 2$', correct: false },
      { id: 'B', label: '$-1 \\le x < 2$', correct: true },
      { id: 'C', label: '$-1 < x \\le 2$', correct: false },
      { id: 'D', label: '$-1 < x < 2$', correct: false },
    ],
    primaryAnswer: 'B',
    alternativeAnswers: [],
    acceptanceMode: 'exact',
    hint: 'There are **two** endpoints. Look at each circle (open vs filled) separately.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'For a single endpoint: filled $= \\le$ or $\\ge$; open $= <$ or $>$. Now apply that rule to **both** ends of this segment.',
      },
      { level: 'nudge', text: 'Walk the segment left to right. Each end: is the circle filled or open?' },
      {
        level: 'guide',
        text: 'Left circle is **filled** at $-1$ → $-1 \\le x$. Right circle is **open** at $2$ → $x < 2$. Combine: $-1 \\le x < 2$.',
      },
      { level: 'reveal', text: 'Answer: $-1 \\le x < 2$.' },
    ],
    explanation: [
      'The shaded segment runs from $-1$ to $2$, so $x$ is **between** these values.',
      'Left endpoint: circle at $-1$ is **closed** → $-1$ **is** included → $-1 \\le x$.',
      'Right endpoint: circle at $2$ is **open** → $2$ is **not** included → $x < 2$.',
      'Combine: $-1 \\le x < 2$.',
    ],
    alternativeExplanations: [
      {
        title: 'Test values',
        steps: [
          'Try $x = -1$: on the closed circle → **included**. So the inequality must accept $-1$ → rules out $-1 < x$.',
          'Try $x = 2$: on the open circle → **not included**. Rules out $x \\le 2$.',
          'Try $x = 0$: in the middle of the shaded segment → included ✓.',
          'Only $-1 \\le x < 2$ matches all three checks.',
        ],
      },
      {
        title: 'Compound-inequality shorthand',
        steps: [
          'A "sandwich" inequality $a \\le x < b$ packs two conditions: $a \\le x$ AND $x < b$.',
          'Always read the **inner** symbol pointing toward $x$: it tells you the relation at that side.',
          'Closed circle → $\\le$ or $\\ge$. Open → $<$ or $>$. Direction follows the shaded region.',
        ],
      },
    ],
    estimatedSeconds: 100,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.NS.B.2  —  Divide multi-digit
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.NS.012',
    file: 'content/problems/6.NS/012-long-division.json',
    standard: '6.NS.B.2',
    prompt: 'Compute $8{,}649 \\div 31$ using long division. Give your answer as a **decimal**.',
    answerType: 'numeric' as const,
    primaryAnswer: '279',
    alternativeAnswers: ['279.0', '279.00'],
    acceptanceMode: 'normalized',
    hint: '$31$ goes into $86$ about how many times? Try $2$ or $3$.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Warm-up: try $93 \\div 31$ first. $31 \\times 3 = 93$, so $93 \\div 31 = 3$. Carry that intuition forward.',
      },
      { level: 'nudge', text: 'Bring down one digit at a time. After each step, check that your remainder is **less than** $31$.' },
      {
        level: 'guide',
        text: '$31 \\times 200 = 6200$, leaving $2449$. $31 \\times 70 = 2170$, leaving $279$. $31 \\times 9 = 279$ exactly. Total: $279$.',
      },
      { level: 'reveal', text: '$8649 \\div 31 = 279$.' },
    ],
    explanation: [
      'Estimate first: $8649 \\div 31 \\approx 8649 \\div 30 \\approx 288$. Expect a 3-digit answer near $280$.',
      '$31$ into $86$: $31 \\times 2 = 62$, $31 \\times 3 = 93$ (too big). So digit = $2$. Subtract: $86 - 62 = 24$. Bring down the $4$ → $244$.',
      '$31$ into $244$: $31 \\times 7 = 217$, $31 \\times 8 = 248$ (too big). Digit = $7$. Subtract: $244 - 217 = 27$. Bring down the $9$ → $279$.',
      '$31$ into $279$: $31 \\times 9 = 279$ exactly. Digit = $9$. Remainder = $0$.',
      'Quotient digits: $2$, $7$, $9$ → $8649 \\div 31 = 279$.',
    ],
    alternativeExplanations: [
      {
        title: 'Check by multiplying back',
        steps: [
          '$279 \\times 31 = 279 \\times 30 + 279 \\times 1 = 8370 + 279 = 8649$. ✓',
          'If multiplying back doesn\'t hit the original dividend, redo the long division.',
        ],
      },
      {
        title: 'Estimate to spot mistakes',
        steps: [
          'Round: $8649 \\approx 9000$, $31 \\approx 30$. $9000 \\div 30 = 300$.',
          'So the true answer should be **close to but a little less than** $300$. $279$ fits.',
          'If you had gotten $2790$ or $28$, the estimate would have flagged the missing place value.',
        ],
      },
    ],
    estimatedSeconds: 120,
  },
  {
    id: '6.NS.016',
    file: 'content/problems/6.NS/016-mult-digit.json',
    standard: '6.NS.B.2',
    prompt:
      'A school district orders $42$ identical buses. Each bus costs $\\$87{,}315$. What is the total cost?',
    answerType: 'numeric' as const,
    primaryAnswer: '3667230',
    alternativeAnswers: ['3,667,230', '$3,667,230', '3667230.0', '3667230.00'],
    acceptanceMode: 'normalized',
    hint: 'Multiply $87315 \\times 42$. Break $42 = 40 + 2$ to keep the arithmetic clean.',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: 'Break $42$ into $40 + 2$. Multiply each piece, then add. Big multiplications get tidy this way.',
      },
      { level: 'nudge', text: 'Estimate first: $87000 \\times 42 \\approx 3{,}654{,}000$. Your real answer should be near that.' },
      {
        level: 'guide',
        text: '$87315 \\times 40 = 3{,}492{,}600$. $87315 \\times 2 = 174{,}630$. Sum: $3{,}492{,}600 + 174{,}630 = 3{,}667{,}230$.',
      },
      { level: 'reveal', text: 'Total cost = $\\$3{,}667{,}230$.' },
    ],
    explanation: [
      'Distribute $42 = 40 + 2$: $87315 \\times 42 = 87315 \\times 40 + 87315 \\times 2$.',
      '$87315 \\times 2 = 174630$.',
      '$87315 \\times 40 = 87315 \\times 4 \\times 10 = 349260 \\times 10 = 3{,}492{,}600$.',
      'Add: $3{,}492{,}600 + 174{,}630 = 3{,}667{,}230$.',
    ],
    alternativeExplanations: [
      {
        title: 'Standard algorithm',
        steps: [
          'Line up: $87315 \\times 42$.',
          'Multiply by ones: $87315 \\times 2 = 174630$ (partial product 1).',
          'Multiply by tens: $87315 \\times 4 = 349260$, shift left → $3{,}492{,}600$ (partial product 2).',
          'Sum: $174{,}630 + 3{,}492{,}600 = 3{,}667{,}230$.',
        ],
      },
      {
        title: 'Estimate to sanity-check',
        steps: [
          'Round: $87{,}315 \\approx 90{,}000$, $42 \\approx 40$. Estimate: $90{,}000 \\times 40 = 3{,}600{,}000$.',
          'Final answer should be a bit more than $3.6$ million. $3{,}667{,}230$ fits.',
          'If you had gotten $366{,}723$ or $36{,}672{,}300$, this estimate would catch the place-value slip.',
        ],
      },
    ],
    estimatedSeconds: 120,
  },
  {
    id: '6.NS.017',
    file: 'content/problems/6.NS/017-long-div-remainder.json',
    standard: '6.NS.B.2',
    prompt:
      'Compute $4{,}872 \\div 24$ using long division. Express the remainder as a **decimal**. (Continue dividing past the decimal point as needed.)',
    answerType: 'numeric' as const,
    primaryAnswer: '203',
    alternativeAnswers: ['203.0', '203.00'],
    acceptanceMode: 'normalized',
    hint: 'Estimate first: $4800 \\div 24 = 200$, so expect the answer to be near $200$.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Notice $24 \\times 2 = 48$. So $4800 \\div 24 = 200$ exactly. The "extra" $72$ tells you the rest.',
      },
      { level: 'nudge', text: 'Split: $4872 = 4800 + 72$. Divide each piece by $24$ separately.' },
      {
        level: 'guide',
        text: '$4800 \\div 24 = 200$. $72 \\div 24 = 3$. Total: $200 + 3 = 203$. (Remainder is $0$, no decimal needed.)',
      },
      { level: 'reveal', text: '$4872 \\div 24 = 203$.' },
    ],
    explanation: [
      'Use friendly chunks: $4872 = 4800 + 72$.',
      '$4800 \\div 24 = 200$ (since $24 \\times 2 = 48$, so $24 \\times 200 = 4800$).',
      '$72 \\div 24 = 3$ (since $24 \\times 3 = 72$).',
      'Sum the partial quotients: $200 + 3 = 203$. The remainder is $0$.',
    ],
    alternativeExplanations: [
      {
        title: 'Long division',
        steps: [
          '$24$ into $48$ → $2$ times ($24 \\times 2 = 48$). Subtract: $0$. Bring down $7$ → $7$.',
          '$24$ into $7$ → $0$ times. Bring down $2$ → $72$.',
          '$24$ into $72$ → $3$ times ($24 \\times 3 = 72$). Subtract: $0$. Done.',
          'Digits: $2$, $0$, $3$ → $203$, remainder $0$.',
        ],
      },
      {
        title: 'Check',
        steps: [
          'Multiply back: $203 \\times 24 = 200 \\times 24 + 3 \\times 24 = 4800 + 72 = 4872$. ✓',
          'Estimate: $4900 \\div 25 \\approx 196$. The true answer $203$ is right in the same neighborhood. ✓',
        ],
      },
    ],
    estimatedSeconds: 120,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.NS.C.6.a  —  Opposites
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.NS.032',
    file: 'content/problems/6.NS/032-integer-opposite.json',
    standard: '6.NS.C.6.a',
    prompt:
      'Let $a$ be the opposite of $-7$. Let $b$ be the opposite of $a$. What is $a - b$?',
    answerType: 'numeric' as const,
    primaryAnswer: '14',
    alternativeAnswers: ['14.0', '+14'],
    acceptanceMode: 'normalized',
    hint: 'Find $a$ first, then $b$. The opposite of a positive number is negative.',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: 'Opposites flip the sign. Two flips bring you back: $-(-(-7)) = -7$.',
      },
      { level: 'nudge', text: 'Step 1: opposite of $-7$ is $+7$, so $a = 7$. Step 2: opposite of $a$ flips it again.' },
      { level: 'guide', text: '$a = -(-7) = 7$. $b = -(a) = -7$. So $a - b = 7 - (-7) = 7 + 7 = 14$.' },
      { level: 'reveal', text: '$a - b = 14$.' },
    ],
    explanation: [
      'The **opposite** of a number $n$ is $-n$ — same distance from $0$, flipped side.',
      'Opposite of $-7$: $-(-7) = 7$. So $a = 7$.',
      'Opposite of $a = 7$: $-(7) = -7$. So $b = -7$.',
      'Compute $a - b = 7 - (-7) = 7 + 7 = 14$.',
    ],
    alternativeExplanations: [
      {
        title: 'Number-line picture',
        steps: [
          'Plot $-7$ on a number line. Its opposite is the **mirror image** across $0$: that\'s $+7$. So $a = 7$.',
          'Now plot $a = 7$ and mirror across $0$ again: back to $-7$. So $b = -7$.',
          '$a - b$ = distance from $b$ to $a$ moving right = $7 - (-7) = 14$ units.',
        ],
      },
      {
        title: 'Why two flips undo',
        steps: [
          'The opposite operation is its own inverse: opposite-of-opposite gets you home.',
          '$-(-n) = n$ for every number $n$.',
          'So whenever you see double negatives, cancel them in pairs.',
        ],
      },
    ],
    estimatedSeconds: 90,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.NS.C.6.b  —  Reflections / quadrants on the coordinate plane
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.NS.042',
    file: 'content/problems/6.NS/042-reflect-y.json',
    standard: '6.NS.C.6.b',
    prompt:
      'Start at $(5, -3)$. Reflect across the $x$-axis, then reflect that result across the $y$-axis. What are the final coordinates? Use form $(x,y)$.',
    answerType: 'short-text',
    primaryAnswer: '(-5,3)',
    alternativeAnswers: ['(-5, 3)', '-5,3', '(−5,3)'],
    acceptanceMode: 'normalized',
    hint: 'One reflection at a time. Reflecting across $x$-axis flips the **$y$-coord**; reflecting across $y$-axis flips the **$x$-coord**.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Practice with $(2, 4)$: reflect across $x$-axis → $(2, -4)$. Reflect across $y$-axis → $(-2, -4)$. Same recipe here.',
      },
      { level: 'nudge', text: 'Reflecting across the $x$-axis negates the $y$-coordinate. Reflecting across the $y$-axis negates the $x$-coordinate.' },
      {
        level: 'guide',
        text: '$(5, -3) \\to_{x\\text{-axis}} (5, 3) \\to_{y\\text{-axis}} (-5, 3)$.',
      },
      { level: 'reveal', text: 'Final point: $(-5, 3)$.' },
    ],
    explanation: [
      'Reflection across the **$x$-axis** keeps $x$, negates $y$: $(x, y) \\to (x, -y)$.',
      'Apply to $(5, -3)$: $(5, -(-3)) = (5, 3)$.',
      'Reflection across the **$y$-axis** negates $x$, keeps $y$: $(x, y) \\to (-x, y)$.',
      'Apply to $(5, 3)$: $(-5, 3)$. **Final answer.**',
    ],
    alternativeExplanations: [
      {
        title: 'Visualize on the plane',
        steps: [
          '$(5, -3)$ sits in Quadrant IV (right, below).',
          'Mirroring across the $x$-axis flips it **up** into Quadrant I: $(5, 3)$.',
          'Mirroring across the $y$-axis flips it **left** into Quadrant II: $(-5, 3)$.',
          'You moved through three quadrants — IV → I → II.',
        ],
      },
      {
        title: 'Shortcut: both axes at once',
        steps: [
          'Reflecting across BOTH axes (in either order) is the same as **negating both coordinates**.',
          '$(x, y) \\to (-x, -y)$ — equivalent to a $180°$ rotation about the origin.',
          'Apply to $(5, -3)$: $(-5, 3)$. Same answer, fewer steps.',
        ],
      },
    ],
    estimatedSeconds: 100,
  },
  {
    id: '6.NS.043',
    file: 'content/problems/6.NS/043-reflect-x.json',
    standard: '6.NS.C.6.b',
    prompt:
      'A triangle has vertices $A(-2, 5)$, $B(4, 1)$, and $C(0, -3)$. The triangle is reflected across the $x$-axis. What are the new coordinates of vertex $A$? Use form $(x,y)$.',
    answerType: 'short-text',
    primaryAnswer: '(-2,-5)',
    alternativeAnswers: ['(-2, -5)', '-2,-5', '(−2,−5)'],
    acceptanceMode: 'normalized',
    hint: 'Reflecting across the $x$-axis: keep $x$, flip the sign of $y$.',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: 'You only need to reflect vertex $A$. Ignore $B$ and $C$ — they\'re distractors. Focus on $(-2, 5)$.',
      },
      { level: 'nudge', text: 'Rule for $x$-axis reflection: $(x, y) \\to (x, -y)$.' },
      { level: 'guide', text: 'Apply to $A(-2, 5)$: $(-2, -5)$.' },
      { level: 'reveal', text: 'New $A$: $(-2, -5)$.' },
    ],
    explanation: [
      'Reflecting across the **$x$-axis** is "flip up/down": the $x$-coordinate stays, the $y$-coordinate negates.',
      'Rule: $(x, y) \\to (x, -y)$.',
      'Apply to $A(-2, 5)$: new $A$ = $(-2, -5)$.',
      '(The full reflected triangle would also have $B(4, -1)$ and $C(0, 3)$, but the question only asks about $A$.)',
    ],
    alternativeExplanations: [
      {
        title: 'Distance from the axis',
        steps: [
          '$A(-2, 5)$ is $5$ units **above** the $x$-axis.',
          'Reflection puts its image $5$ units **below** the $x$-axis, same $x$-position.',
          'That\'s $(-2, -5)$.',
        ],
      },
      {
        title: 'Compare reflection types',
        steps: [
          'Reflect across $x$-axis: $(x, y) \\to (x, -y)$ — flip the $y$.',
          'Reflect across $y$-axis: $(x, y) \\to (-x, y)$ — flip the $x$.',
          'Reflect across origin (both axes): $(x, y) \\to (-x, -y)$ — flip both.',
        ],
      },
    ],
    estimatedSeconds: 90,
  },
  {
    id: '6.NS.049',
    file: 'content/problems/6.NS/049-quadrant-mc.json',
    standard: '6.NS.C.6.b',
    prompt:
      'A point $P$ is reflected across the $y$-axis to get $P\'$. The original $P$ is in **Quadrant III**. Which quadrant contains $P\'$?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'Quadrant I', correct: false },
      { id: 'B', label: 'Quadrant II', correct: false },
      { id: 'C', label: 'Quadrant III', correct: false },
      { id: 'D', label: 'Quadrant IV', correct: true },
    ],
    primaryAnswer: 'D',
    alternativeAnswers: [],
    acceptanceMode: 'exact',
    hint: 'Quadrant III has signs $(-, -)$. Reflecting across the $y$-axis flips only the $x$-sign.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Pick a concrete point in Quadrant III, like $(-4, -2)$. Reflect across the $y$-axis. What signs does the result have?',
      },
      { level: 'nudge', text: 'Quadrant signs: I$(+,+)$, II$(-,+)$, III$(-,-)$, IV$(+,-)$. Reflection across $y$-axis flips just the $x$.' },
      {
        level: 'guide',
        text: '$P$ in III has signs $(-, -)$. Reflect across $y$-axis → flip $x$-sign: $(+, -)$. That\'s Quadrant IV.',
      },
      { level: 'reveal', text: '$P\'$ is in Quadrant IV.' },
    ],
    explanation: [
      'Quadrant III is where **both** coordinates are negative: $(-x, -y)$.',
      'Reflection across the **$y$-axis** keeps $y$, negates $x$: $(x, y) \\to (-x, y)$.',
      'Starting signs $(-, -)$ → after flip → $(+, -)$.',
      'A point with signs $(+, -)$ — positive $x$, negative $y$ — lives in **Quadrant IV**.',
    ],
    alternativeExplanations: [
      {
        title: 'Quadrant sign chart',
        steps: [
          'Quadrant I: $(+, +)$ (top-right). Quadrant II: $(-, +)$ (top-left).',
          'Quadrant III: $(-, -)$ (bottom-left). Quadrant IV: $(+, -)$ (bottom-right).',
          'Reflecting across the $y$-axis swaps left ↔ right, so the quadrant changes side: III ↔ IV, II ↔ I.',
        ],
      },
      {
        title: 'Concrete check',
        steps: [
          'Let $P = (-3, -5)$ (Quadrant III).',
          'Reflect across $y$-axis: $P\' = (3, -5)$.',
          'Positive $x$, negative $y$ → Quadrant IV. ✓',
        ],
      },
    ],
    estimatedSeconds: 90,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.NS.C.6.c  —  Coordinate plane / number line — multi-step
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.NS.047',
    file: 'content/problems/6.NS/047-identify-point.json',
    standard: '6.NS.C.6.c',
    prompt:
      'Point $M$ has coordinates $(-4, 2)$. Point $N$ has the **same $x$-coordinate** as $M$, but the **opposite $y$-coordinate**. What are the coordinates of $N$, and how many units apart are $M$ and $N$? Use form $(x,y);d$ (e.g., $(3,5);6$).',
    answerType: 'short-text',
    primaryAnswer: '(-4,-2);4',
    alternativeAnswers: ['(-4, -2); 4', '(-4,-2); 4', '(−4,−2);4'],
    acceptanceMode: 'normalized',
    hint: 'Same $x$ means $M$ and $N$ are stacked vertically. Distance is the gap between their $y$-coordinates.',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: 'Two points with the same $x$ form a **vertical segment**. The distance is $|y_1 - y_2|$ — no need for a fancy formula.',
      },
      { level: 'nudge', text: 'Opposite of $y = 2$ is $y = -2$. So $N = (-4, -2)$.' },
      {
        level: 'guide',
        text: '$M = (-4, 2)$, $N = (-4, -2)$. Vertical distance = $|2 - (-2)| = 4$ units.',
      },
      { level: 'reveal', text: '$N = (-4, -2)$; distance $= 4$.' },
    ],
    explanation: [
      '$M = (-4, 2)$. "Same $x$" → $N$\'s $x$-coordinate is also $-4$.',
      '"Opposite $y$" → $N$\'s $y$-coordinate is $-2$. So $N = (-4, -2)$.',
      'Both points lie on the vertical line $x = -4$.',
      'Distance between points with the same $x$ = $|y_M - y_N| = |2 - (-2)| = 4$ units.',
    ],
    alternativeExplanations: [
      {
        title: 'Picture on the coordinate plane',
        steps: [
          'Plot $M$ at $(-4, 2)$ (Quadrant II) and $N$ at $(-4, -2)$ (Quadrant III).',
          'Both sit on the vertical line $x = -4$, mirror images across the $x$-axis.',
          'Count grid squares: from $y = 2$ down to $y = -2$ is $4$ steps.',
        ],
      },
      {
        title: 'Why $|y_1 - y_2|$ always works',
        steps: [
          'Distance is never negative — use absolute value.',
          '$|2 - (-2)| = |4| = 4$ and $|-2 - 2| = |-4| = 4$. The order doesn\'t matter.',
          'For points on the **same vertical line**, only the $y$-gap counts; for the **same horizontal line**, only the $x$-gap.',
        ],
      },
    ],
    estimatedSeconds: 100,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.NS.C.7.b  —  Ordering signed numbers in context
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.NS.038',
    file: 'content/problems/6.NS/038-inequality-pair.json',
    standard: '6.NS.C.7.b',
    prompt:
      'Four cities reported these temperatures (°F): Anchorage $-12$, Buffalo $-5$, Chicago $-18$, Denver $4$. List them from **coldest to warmest** using just the **first letter** of each city, separated by commas (no spaces). Example: $A,B,C,D$.',
    answerType: 'short-text',
    primaryAnswer: 'C,A,B,D',
    alternativeAnswers: ['C, A, B, D', 'c,a,b,d'],
    acceptanceMode: 'normalized',
    hint: 'Coldest = **most negative** = farthest **left** on the number line. Don\'t confuse magnitude with order!',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Warm-up: $-3$ vs $-10$ — which is colder? $-10$, even though its **absolute value** is bigger. Negative numbers reverse the usual size order.',
      },
      { level: 'nudge', text: 'Plot all four temperatures on a number line. Reading left → right gives coldest → warmest.' },
      {
        level: 'guide',
        text: 'From least to greatest: $-18 < -12 < -5 < 4$. That\'s Chicago ($-18$), Anchorage ($-12$), Buffalo ($-5$), Denver ($4$).',
      },
      { level: 'reveal', text: 'Order: $C, A, B, D$.' },
    ],
    explanation: [
      'Coldest = lowest temperature = farthest **left** on a number line.',
      'On a number line: $-18$ is leftmost, then $-12$, then $-5$, then $0$, then $4$.',
      'So coldest to warmest: $-18, -12, -5, 4$ → Chicago, Anchorage, Buffalo, Denver.',
      'Answer: $C, A, B, D$.',
    ],
    alternativeExplanations: [
      {
        title: 'Watch the absolute-value trap',
        steps: [
          '$|-18| = 18$ and $|-5| = 5$. The number with the **bigger** absolute value is **smaller** (when both are negative).',
          'So $-18 < -5$, NOT the other way around — even though $18 > 5$.',
          'For negatives, bigger digits = colder.',
        ],
      },
      {
        title: 'Inequality chain',
        steps: [
          'Compare pairwise: $-18 < -12$ (deeper negative), $-12 < -5$, $-5 < 4$.',
          'Chain: $-18 < -12 < -5 < 4$.',
          'Cities in that order: Chicago, Anchorage, Buffalo, Denver.',
        ],
      },
    ],
    estimatedSeconds: 100,
  },

  // ────────────────────────────────────────────────────────────────────
  // 6.SP.A.1  —  Statistical questions (vs non-statistical)
  // ────────────────────────────────────────────────────────────────────
  {
    id: '6.SP.006',
    file: 'content/problems/6.SP/006-stat-question.json',
    standard: '6.SP.A.1',
    prompt:
      'A teacher wants data about her class. Which question is a **statistical question** (one that **anticipates variability**)?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'How old is Ms. Lee?', correct: false },
      {
        id: 'B',
        label: 'What is the school\'s start time?',
        correct: false,
      },
      {
        id: 'C',
        label: 'How many minutes does each student spend on homework per night?',
        correct: true,
      },
      { id: 'D', label: 'How many days are in February this year?', correct: false },
    ],
    primaryAnswer: 'C',
    alternativeAnswers: [],
    acceptanceMode: 'exact',
    hint: 'A statistical question can have **many different answers** across the people or things being measured.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Ask: "would different students give different answers to this?" If yes → statistical. If everyone gives the same answer → not.',
      },
      { level: 'nudge', text: 'Statistical = expects spread/variability. A single-answer question (one fact) is NOT statistical.' },
      {
        level: 'guide',
        text: 'A, B, D each have **one** answer (a fact). C will have many different answers across students. Only C is statistical.',
      },
      { level: 'reveal', text: 'Answer: C.' },
    ],
    explanation: [
      'A **statistical question** anticipates **variability** in the answers — different respondents give different numbers/responses.',
      'A: "How old is Ms. Lee?" → one answer. Not statistical.',
      'B: "What is the school\'s start time?" → one answer. Not statistical.',
      'C: "How many minutes does each student spend on homework?" → expect many different answers across students. **Statistical.**',
      'D: "How many days are in February this year?" → one answer. Not statistical.',
    ],
    alternativeExplanations: [
      {
        title: 'Quick test',
        steps: [
          'Imagine asking the question to $30$ different students.',
          'If you expect the **same answer** from all $30$ → NOT a statistical question.',
          'If you expect **different answers** that vary across the group → statistical.',
        ],
      },
      {
        title: 'Statistical-question patterns',
        steps: [
          'Often phrased about a **group** ("each student", "the class", "students in $6$th grade").',
          'Often involves measurable traits that differ from person to person: height, time, score, preference.',
          'A question about a **single** person/object with a fixed property is NOT statistical.',
        ],
      },
    ],
    estimatedSeconds: 80,
  },
  {
    id: '6.SP.063',
    file: 'content/problems/6.SP/063-stat-q-pick.json',
    standard: '6.SP.A.1',
    prompt:
      'A reporter wants to write a story about cell-phone usage. Which question is a **statistical question**?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'How much does the newest phone cost?', correct: false },
      {
        id: 'B',
        label: 'How many hours per day do $7$th graders spend on their phones?',
        correct: true,
      },
      { id: 'C', label: 'When did the first cell phone come out?', correct: false },
      { id: 'D', label: 'What is the screen size of the iPhone $15$?', correct: false },
    ],
    primaryAnswer: 'B',
    alternativeAnswers: [],
    acceptanceMode: 'exact',
    hint: 'Look for a question whose answer **varies** from person to person.',
    hints: [
      {
        level: 'nudge',
        title: '🔁 Another angle',
        text: 'Three of the four choices are about a **single fact**. The odd one out asks about a **group of people**, so answers will vary.',
      },
      { level: 'nudge', text: 'A, C, D each have one fixed answer (a price, a date, a measurement). Only one option asks about a group.' },
      {
        level: 'guide',
        text: 'B asks "how many hours per day do **$7$th graders** spend" — different students give different answers. Statistical.',
      },
      { level: 'reveal', text: 'Answer: B.' },
    ],
    explanation: [
      'A statistical question anticipates **variability** in its answers.',
      'A: "How much does the newest phone cost?" — one price → not statistical.',
      'B: "How many hours per day do $7$th graders spend?" — every student likely has a different number → **statistical**.',
      'C: "When did the first cell phone come out?" — one date → not statistical.',
      'D: "What is the screen size of the iPhone $15$?" — one measurement → not statistical.',
    ],
    alternativeExplanations: [
      {
        title: 'Spot the keyword',
        steps: [
          'Statistical questions often refer to **many subjects** at once: "$7$th graders", "the team", "students", "people".',
          'Non-statistical questions usually ask for a **single fact** about **one** specific thing or person.',
          'Phrase like "**how many hours per day**" almost always means asking each person and collecting answers.',
        ],
      },
      {
        title: 'Visualize the data',
        steps: [
          'A statistical question can be answered with a **dot plot** or **histogram** — the spread *is* the answer.',
          'Plotting $30$ students\' daily phone hours would show a range from maybe $0$ to $8+$ hours.',
          'For A, C, D you couldn\'t make a data plot — there\'s nothing to spread out.',
        ],
      },
    ],
    estimatedSeconds: 80,
  },
  {
    id: '6.SP.064',
    file: 'content/problems/6.SP/064-anticipate-variability.json',
    standard: '6.SP.A.1',
    prompt:
      'For each question, decide if it is a **statistical question** (S) or **not** (N). Combine your $4$ answers in order as a string (e.g., $SNSN$):\\n1) How tall am I?\\n2) How tall is each player on the team?\\n3) How tall is the tallest building in Dubai?\\n4) How many minutes does it take students in my class to eat lunch?',
    answerType: 'short-text',
    primaryAnswer: 'NSNS',
    alternativeAnswers: ['nsns', 'N,S,N,S', 'N S N S'],
    acceptanceMode: 'normalized',
    hint: 'Mark a question $S$ if its answer **varies** across the group; $N$ if it has one fixed answer.',
    hints: [
      {
        level: 'nudge',
        title: '🪜 Try a simpler one',
        text: 'Easy ones first: "How tall am I?" has only **one** answer — not statistical. "How tall is each player?" → different heights, so statistical.',
      },
      { level: 'nudge', text: 'Look for the giveaway "**each**", "**every**", or "**students in my class**" — those signal variability.' },
      {
        level: 'guide',
        text: '1) one fact → N. 2) many players → S. 3) one building → N. 4) many students → S. Answer: $NSNS$.',
      },
      { level: 'reveal', text: 'Answer: $NSNS$.' },
    ],
    explanation: [
      'A statistical question expects **variability**. Walk each one:',
      '1) "How tall am I?" → one specific person, one answer. **N**.',
      '2) "How tall is each player on the team?" → many players, each different height. **S**.',
      '3) "How tall is the tallest building in Dubai?" → one specific building, one answer. **N**.',
      '4) "How many minutes does it take students in my class to eat lunch?" → many students, varying times. **S**.',
      'Sequence: **$NSNS$**.',
    ],
    alternativeExplanations: [
      {
        title: 'Rule of thumb',
        steps: [
          'Singular subject + specific fact = not statistical (one answer).',
          'Group subject + measurable quantity = statistical (many answers, varying).',
          'The words "**each**", "**every**", "**students**", "**players**" almost always signal a statistical question.',
        ],
      },
      {
        title: 'Could you graph the data?',
        steps: [
          'If you imagined collecting data, would there be a spread to **plot**?',
          '1) Just one height → nothing to spread. N.',
          '2) Heights of many players → dot plot of heights. S.',
          '3) One building\'s height → no spread. N.',
          '4) Lunchtimes of many students → dot plot of times. S.',
        ],
      },
    ],
    estimatedSeconds: 100,
  },
];

function applyPatch(patch: Patch): boolean {
  const fp = path.resolve(ROOT, patch.file);
  if (!fs.existsSync(fp)) {
    console.warn(`✗ skip ${patch.id}: file not found at ${patch.file}`);
    return false;
  }
  const raw = fs.readFileSync(fp, 'utf-8');
  const data = JSON.parse(raw) as Record<string, unknown>;

  // Sanity: id must match.
  if (data.id !== patch.id) {
    console.warn(`✗ skip ${patch.id}: file id is ${data.id}`);
    return false;
  }

  data.standard = patch.standard;
  data.difficulty = 3;
  data.prompt = patch.prompt;
  data.answerType = patch.answerType;
  data.primaryAnswer = patch.primaryAnswer;
  data.alternativeAnswers = patch.alternativeAnswers ?? [];
  if (patch.choices) {
    data.choices = patch.choices;
  } else {
    delete data.choices;
  }
  data.acceptanceMode = patch.acceptanceMode ?? 'normalized';
  data.hint = patch.hint;
  data.hints = patch.hints;
  data.explanation = patch.explanation;
  data.alternativeExplanations = patch.alternativeExplanations;
  if (patch.estimatedSeconds != null) data.estimatedSeconds = patch.estimatedSeconds;

  // Tags: preserve existing, add "MAP-practice" + any extras, dedupe.
  const existingTags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  const tags = new Set([...existingTags, 'MAP-practice', ...(patch.extraTags ?? [])]);
  data.tags = Array.from(tags);

  fs.writeFileSync(fp, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  return true;
}

function main() {
  let n = 0;
  for (const p of PATCHES) if (applyPatch(p)) n++;
  console.log(`✓ Upgraded ${n}/${PATCHES.length} problems to difficulty 3 with MAP-practice tag.`);
}

main();
