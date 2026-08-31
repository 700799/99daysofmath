import type { SatArea } from './blueprint';

// ── The SAT Math strategy library ──────────────────────────────────────────
// Everything here is a decision rule, not a platitude. Each tip names the
// situation that triggers it, the move to make, and — where it helps — a worked
// micro-example. Tips are grouped so a student can read one category before a
// drill rather than swallowing the whole library at once.

export type TipCategory =
  | 'format'
  | 'timing'
  | 'desmos'
  | 'entry'
  | 'technique'
  | 'algebra'
  | 'advanced'
  | 'data'
  | 'geometry'
  | 'errors'
  | 'reference'
  | 'testday';

export interface TipCategoryInfo {
  key: TipCategory;
  name: string;
  emoji: string;
  blurb: string;
}

export const TIP_CATEGORIES: TipCategoryInfo[] = [
  { key: 'format', name: 'How the test works', emoji: '🗺️', blurb: 'The rules of the game — module structure, adaptivity, and what actually gets scored.' },
  { key: 'timing', name: 'Timing and pacing', emoji: '⏱️', blurb: 'Where your minutes go, and how to stop one question from eating three.' },
  { key: 'desmos', name: 'The built-in Desmos calculator', emoji: '🖩', blurb: 'The single biggest scoring edge on the digital test, and most students underuse it.' },
  { key: 'entry', name: 'Entering answers', emoji: '⌨️', blurb: 'Student-produced response rules. Points are lost here for formatting, not for math.' },
  { key: 'technique', name: 'Universal techniques', emoji: '🛠️', blurb: 'Backsolving, plugging in, and the other moves that work regardless of topic.' },
  { key: 'algebra', name: 'Algebra', emoji: '⚖️', blurb: '35% of the section. The most learnable points on the test.' },
  { key: 'advanced', name: 'Advanced Math', emoji: '🧩', blurb: '35% of the section. Where 600 becomes 700.' },
  { key: 'data', name: 'Problem-Solving and Data', emoji: '📊', blurb: '15% of the section. Mostly a reading test wearing a math costume.' },
  { key: 'geometry', name: 'Geometry and Trigonometry', emoji: '📐', blurb: '15% of the section. Formula recall pays off faster here than anywhere else.' },
  { key: 'errors', name: 'Killing careless errors', emoji: '🎯', blurb: 'At every level above 600, most missed points are known material.' },
  { key: 'reference', name: 'Facts worth memorizing', emoji: '🧠', blurb: 'The reference sheet is provided. These are the things that are not.' },
  { key: 'testday', name: 'Test day', emoji: '📋', blurb: 'Logistics and mindset, decided in advance so you are not deciding them at 8am.' },
];

export interface SatTip {
  id: string;
  category: TipCategory;
  title: string;
  body: string;
  /** A concrete worked illustration; rendered in a mono block. */
  example?: string;
  /** Tips that belong to a blueprint area surface on that unit's playbook. */
  area?: SatArea;
}

export const SAT_TIPS: SatTip[] = [
  // ───────────────────────── format ─────────────────────────
  {
    id: 'fmt-modules',
    category: 'format',
    title: 'Math is two modules of 22 questions, 35 minutes each',
    body:
      'That is 44 scored questions in 70 minutes, or about 95 seconds per question. Each module is its own timed block — you can move freely within a module, but once you submit one you cannot return to it. Plan your pacing per module, never across the whole section.',
  },
  {
    id: 'fmt-adaptive',
    category: 'format',
    title: 'Module 2 adapts to how you did on Module 1',
    body:
      'Do well on the first module and the second one arrives harder — and unlocks the upper score range. Do poorly and the second module is easier but caps your ceiling. The practical consequence: Module 1 matters more than its question count suggests. Never rush it to save time for later.',
  },
  {
    id: 'fmt-harder-is-good',
    category: 'format',
    title: 'A brutal Module 2 is good news',
    body:
      'If the second module feels noticeably harder than the first, you earned the harder form. Students routinely walk out demoralized by exactly the test that gave them their best score. Do not let the difficulty spike rattle you mid-section.',
  },
  {
    id: 'fmt-no-penalty',
    category: 'format',
    title: 'There is no wrong-answer penalty — never leave a blank',
    body:
      'A blank and a wrong answer score identically. With four choices, a pure guess is worth 25%; eliminating one choice makes it 33%. In the last minute of a module, fill every remaining bubble with the same letter and move on.',
  },
  {
    id: 'fmt-order',
    category: 'format',
    title: 'Questions climb in difficulty within a module — roughly',
    body:
      'Early questions in a module are generally the most straightforward and late ones the hardest, but the ramp is not strict. Do not assume question 3 is easy or that question 20 is impossible. Judge each question on sight, not on its position.',
  },
  {
    id: 'fmt-mix',
    category: 'format',
    title: 'Know the blueprint weighting cold',
    body:
      'Algebra is about 13-15 questions, Advanced Math 13-15, Problem-Solving and Data Analysis 5-7, and Geometry and Trigonometry 5-7. If your study time is split evenly across those four areas, you are over-investing in geometry by roughly a factor of two.',
  },
  {
    id: 'fmt-flag',
    category: 'format',
    title: 'Use the flag tool, and trust it',
    body:
      'Flag anything you did not answer with confidence, then use the review page at the end of the module to return. The flag exists so you can leave a hard question without the nagging feeling that you will forget it. That feeling is what makes students overspend.',
  },
  {
    id: 'fmt-annotate',
    category: 'format',
    title: 'The annotation tool is for questions, not for math',
    body:
      'Highlighting a clause like "no more than" or "in terms of x" is worth the two seconds. Do not try to do arithmetic in the annotation box — use the scratch paper you are given for that.',
  },

  // ───────────────────────── timing ─────────────────────────
  {
    id: 'tim-95',
    category: 'timing',
    title: 'The 95-second budget is an average, not a rule',
    body:
      'Easy questions should take 30-45 seconds, which buys you two-and-a-half minutes for a hard one. The goal is not to spend 95 seconds on each; it is to bank time early so the hard questions get the time they need.',
  },
  {
    id: 'tim-checkpoint',
    category: 'timing',
    title: 'Set two checkpoints per module',
    body:
      'At 17 minutes you should be around question 11; at 28 minutes around question 19. Two glances at the clock per module is enough. Checking after every question costs more time than it saves and raises your heart rate for no reason.',
  },
  {
    id: 'tim-two-pass',
    category: 'timing',
    title: 'Work the module in two passes',
    body:
      'Pass one: answer everything you can do cleanly, flag the rest, never linger. Pass two: spend what remains on flagged questions, hardest last. This guarantees you never lose an easy question at the end of the module to a hard one at the middle.',
  },
  {
    id: 'tim-30sec',
    category: 'timing',
    title: 'The 30-second rule for starting',
    body:
      'If 30 seconds in you still do not know what the first step is, flag it and go. Not knowing the approach is different from grinding through a long calculation. The first is a signal to leave; the second is a signal to finish.',
  },
  {
    id: 'tim-sunk',
    category: 'timing',
    title: 'Two minutes in is not a reason to stay — it is a reason to leave',
    body:
      'Time already spent is gone whether or not you keep going. The only question that matters is whether the next minute is better spent here or on the two unanswered questions at the end. It almost never is.',
  },
  {
    id: 'tim-guess-first',
    category: 'timing',
    title: 'Answer before you flag, every time',
    body:
      'Put your best guess in before flagging a question. If you run out of time, the guess is already banked. If you get back to it, you overwrite it. There is no scenario where flagging a blank beats flagging a guess.',
  },
  {
    id: 'tim-long-word',
    category: 'timing',
    title: 'Long word problems are often the easy ones',
    body:
      'A five-line setup usually hides one linear equation. A one-line question like "which expression is equivalent" can hide three steps of factoring. Length measures reading, not difficulty — do not skip a question just because it is wordy.',
  },
  {
    id: 'tim-last-minute',
    category: 'timing',
    title: 'Reserve the last 60 seconds for sweeping blanks',
    body:
      'When one minute remains, stop solving. Open the review page and fill every empty answer. Four random guesses are worth about one point on average, and that is one point more than four blanks.',
  },

  // ───────────────────────── desmos ─────────────────────────
  {
    id: 'des-always',
    category: 'desmos',
    title: 'Desmos is built in, on every question, for the whole section',
    body:
      'There is no no-calculator module on the digital SAT. The graphing calculator is available for all 44 questions, and it is the single largest edge available to a prepared student. Treat fluency with it as content knowledge.',
  },
  {
    id: 'des-solve-graph',
    category: 'desmos',
    title: 'Any single-variable equation can be solved by graphing',
    body:
      'Type the left side as y₁ and the right side as y₂, then click the intersection. This works when the algebra is ugly, when you are unsure of your factoring, and as a check when you are sure.',
    example: 'Solve 2(x−3)² = 5x + 4\n  y₁ = 2(x−3)^2\n  y₂ = 5x + 4\nClick both intersection points: x ≈ 0.72 and x ≈ 5.53',
  },
  {
    id: 'des-systems',
    category: 'desmos',
    title: 'Systems: type both equations, click the intersection',
    body:
      'Desmos accepts equations in any form — you do not need to solve for y first. Enter 3x + 2y = 12 exactly as written. For a system, enter both and click where the curves cross; the coordinates appear as a labelled point.',
  },
  {
    id: 'des-regression',
    category: 'desmos',
    title: 'Line of best fit in one line of syntax',
    body:
      'Put the data in a table, then type y₁ ~ mx₁ + b. Desmos returns m and b for the least-squares line. For an exponential model use y₁ ~ ab^x₁. This turns a scatterplot question into a typing exercise.',
    example: 'Table columns x₁ and y₁, then a new line:\n  y₁ ~ mx₁ + b\nDesmos reports m = 2.4, b = 11.3',
  },
  {
    id: 'des-slider',
    category: 'desmos',
    title: 'Let a slider find the constant',
    body:
      'When a question asks for the value of k that makes something true, type the equation with k in it and click "add slider". Drag until the condition holds — one solution, tangency, a specific intercept. Faster than the discriminant when you only need the number.',
  },
  {
    id: 'des-vertex',
    category: 'desmos',
    title: 'Graph a parabola to read the vertex instead of completing the square',
    body:
      'Type the quadratic, then click the turning point. Desmos labels it exactly. Completing the square is still worth knowing for "which form displays the vertex" questions, but for a numeric answer, graph it.',
  },
  {
    id: 'des-table-check',
    category: 'desmos',
    title: 'Verify a claimed solution instead of deriving it',
    body:
      'Multiple choice hands you four candidate answers. Testing them in Desmos is often faster than solving forward, and it is immune to algebra slips. This is especially strong on "which of the following is a solution" phrasing.',
  },
  {
    id: 'des-inequality',
    category: 'desmos',
    title: 'Desmos shades inequalities',
    body:
      'Type y ≥ 2x − 1 and it shades the region. Enter a whole system and the overlap is where the shading is darkest — then test whether a given point lands inside. Systems-of-inequalities questions become visual.',
  },
  {
    id: 'des-stats',
    category: 'desmos',
    title: 'Desmos computes mean, median, and standard deviation directly',
    body:
      'With a list L = [4, 7, 7, 9, 13], type mean(L), median(L), stdev(L). Useful on one-variable data questions where the arithmetic is the only obstacle.',
  },
  {
    id: 'des-limits',
    category: 'desmos',
    title: 'Know when Desmos is the slow option',
    body:
      'For "which expression is equivalent", for questions about a parameter in general form, and for anything where the answer is an expression rather than a number, algebra is faster. Reaching for the calculator reflexively costs time on roughly a third of questions.',
  },

  // ───────────────────────── entry ─────────────────────────
  {
    id: 'ent-any',
    category: 'entry',
    title: 'If multiple answers are valid, enter only one',
    body:
      'Some student-produced response questions have more than one correct answer — a quadratic with two roots, for instance. Enter exactly one. Entering both is marked wrong.',
  },
  {
    id: 'ent-negative',
    category: 'entry',
    title: 'Negatives are allowed; percent signs and commas are not',
    body:
      'You may enter a minus sign. You may not enter %, $, or a comma. An answer of 2,500 dollars is entered as 2500. An answer of 45% is entered as 45 if the question asks for a percent, or 0.45 if it asks for a decimal — read which.',
  },
  {
    id: 'ent-fraction',
    category: 'entry',
    title: 'Fractions are fine and do not need reducing',
    body:
      'Enter 8/12 or 2/3 — both are accepted. Do not waste time simplifying. Mixed numbers are not accepted: 2½ must be entered as 5/2 or 2.5, and entering 21/2 will be read as twenty-one halves.',
  },
  {
    id: 'ent-decimal',
    category: 'entry',
    title: 'Decimals: fill the box, truncate or round, never round early',
    body:
      'The answer field holds five characters for a positive value, six with a minus sign. For a repeating decimal like 2/3, enter .6666 or .6667 — both are accepted. Entering .67 is not. When in doubt, enter the fraction instead.',
  },
  {
    id: 'ent-no-units',
    category: 'entry',
    title: 'Never type units or variable names',
    body:
      'If the answer is 12 meters, enter 12. If the question asks for the value of x and you found x = 7, enter 7, not x=7. The grid is numeric only.',
  },
  {
    id: 'ent-preview',
    category: 'entry',
    title: 'Read the answer preview before moving on',
    body:
      'The digital interface shows how it interpreted what you typed. Glance at it. This is the two-second check that catches a missing minus sign or a fraction bar in the wrong place.',
  },

  // ───────────────────────── technique ─────────────────────────
  {
    id: 'tec-backsolve',
    category: 'technique',
    title: 'Backsolve from the middle',
    body:
      'When the choices are plain numbers and the algebra looks unpleasant, test a choice instead of solving. Start with B or C — since choices are ordered, one test often tells you which direction to go and eliminates two more.',
    example: 'If 3(x−2) + 4 = 2x + 9, test C = 11:\n  3(9) + 4 = 31 and 2(11) + 9 = 31 ✓ — done, no algebra.',
  },
  {
    id: 'tec-plugin',
    category: 'technique',
    title: 'Plug in your own numbers when the answers contain variables',
    body:
      'If every choice is an expression in x, pick a value for x — something small and unfriendly to coincidence, like 3 or 5 — compute the target, then test each choice. Avoid 0, 1, and any number already in the problem.',
    example: 'Which equals (x+2)(x−3)? Let x = 4:\n  target = 6·1 = 6. Test each choice at x = 4; keep only the one giving 6.',
  },
  {
    id: 'tec-two-values',
    category: 'technique',
    title: 'If two choices survive, plug in a second number',
    body:
      'Picking numbers occasionally leaves a tie. Rather than restarting with algebra, run one more value — a negative or a fraction usually breaks it. Two data points kill almost every impostor.',
  },
  {
    id: 'tec-what-asked',
    category: 'technique',
    title: 'Underline what is actually being asked before you solve',
    body:
      'The SAT routinely solves for x and then asks for 3x − 1, or gives you the price per item and asks for the total. The most common wrong answer on the test is the correct value of the wrong quantity — and it is always one of the choices.',
  },
  {
    id: 'tec-translate',
    category: 'technique',
    title: 'Translate word by word, in order',
    body:
      '"is" becomes =, "of" becomes ×, "per" becomes ÷, "less than" reverses the order of subtraction. Write the equation in the same order the sentence gives it, then simplify. Do not try to hold the translation in your head.',
    example: '"5 less than twice a number is 17" → 2n − 5 = 17 (not 5 − 2n).',
  },
  {
    id: 'tec-estimate',
    category: 'technique',
    title: 'Estimate first on anything with messy numbers',
    body:
      'A rough answer takes five seconds and immediately eliminates the choices that are off by an order of magnitude or the wrong sign. It also catches your own arithmetic slips before you commit to them.',
  },
  {
    id: 'tec-simplify-first',
    category: 'technique',
    title: 'Simplify before you substitute, not after',
    body:
      'Distributing a messy constant into a long expression multiplies your chances of an error. Combine like terms, cancel common factors, and only then put the numbers in.',
  },
  {
    id: 'tec-draw',
    category: 'technique',
    title: 'Redraw every geometry figure on scratch paper',
    body:
      'Copy it, then write every given directly onto your copy — lengths, angle marks, right angles. Figures on screen are not drawn to scale unless stated, and the act of labelling usually reveals the relationship the question is built on.',
  },
  {
    id: 'tec-hidden',
    category: 'technique',
    title: 'The SAT rarely asks for a variable in isolation',
    body:
      'Questions often want an expression like x + y or 2a − b. Look for a route that gets the whole expression at once — adding two equations, for instance — instead of solving for each variable separately. It is usually much faster.',
    example: 'If x + 3y = 10 and 3x + y = 14, then adding gives 4x + 4y = 24, so x + y = 6 — without ever finding x or y.',
  },
  {
    id: 'tec-answer-shape',
    category: 'technique',
    title: 'Let the answer choices tell you the method',
    body:
      'Choices in factored form suggest factoring. Choices with radicals suggest the quadratic formula. Choices that are all integers suggest a clean setup and warn you off a messy route. The answers are data about the problem.',
  },

  // ───────────────────────── algebra ─────────────────────────
  {
    id: 'alg-nosol',
    category: 'algebra',
    area: 'ALG',
    title: 'No solution means parallel; infinitely many means identical',
    body:
      'For ax + b = cx + d: if a = c and b ≠ d there is no solution; if a = c and b = d every number works; otherwise exactly one. The same logic runs the systems questions — compare slopes first, and only then compare intercepts.',
    example: '4x + 7 = 4x + 9 → no solution (7 ≠ 9).\n4x + 7 = 4x + 7 → infinitely many.',
  },
  {
    id: 'alg-slope-units',
    category: 'algebra',
    area: 'ALG',
    title: 'Slope always carries units: y-units per x-unit',
    body:
      'In a context question, slope is a rate and the intercept is a starting amount. Naming their units out loud answers most interpretation questions before you do any math.',
    example: 'C = 45t + 120 for a repair: 45 dollars per hour, 120 dollars before any hours are worked.',
  },
  {
    id: 'alg-parallel-perp',
    category: 'algebra',
    area: 'ALG',
    title: 'Parallel: equal slopes. Perpendicular: negative reciprocal',
    body:
      'A line perpendicular to one with slope 3/4 has slope −4/3. Flip and negate — students reliably remember one half of that and lose the point to a sign.',
  },
  {
    id: 'alg-system-count',
    category: 'algebra',
    area: 'ALG',
    title: 'Count solutions without solving',
    body:
      'Put both equations in slope-intercept form. Different slopes means one solution. Same slope and different intercepts means none. Same slope and same intercept means infinitely many. This answers a whole class of questions in about fifteen seconds.',
  },
  {
    id: 'alg-elimination',
    category: 'algebra',
    area: 'ALG',
    title: 'Choose elimination when a variable already lines up',
    body:
      'If one variable has coefficients that are equal or opposite, add or subtract immediately. Use substitution only when a variable is already isolated, or is trivially isolatable. Picking the wrong method costs a minute you cannot recover.',
  },
  {
    id: 'alg-flip',
    category: 'algebra',
    area: 'ALG',
    title: 'Multiplying an inequality by a negative flips the sign',
    body:
      'This is the single most common algebra error on the test. If you divide by −2, reverse the direction. Dividing by a positive changes nothing.',
    example: '−3x > 12 → x < −4  (not x > −4)',
  },
  {
    id: 'alg-constraint-words',
    category: 'algebra',
    area: 'ALG',
    title: 'Constraint language maps to symbols exactly',
    body:
      '"At least" and "no less than" are ≥. "At most" and "no more than" are ≤. "More than" and "exceeds" are strict >. "Minimum of" is ≥. Translate the phrase before you build the inequality, not while.',
  },
  {
    id: 'alg-isolate',
    category: 'algebra',
    area: 'ALG',
    title: 'Solving for a variable "in terms of" others is the same algebra',
    body:
      'Treat every other letter as if it were a number and isolate the one you want. Students freeze at literal equations for no reason — the steps are identical to a numeric solve.',
    example: 'Solve A = ½bh for h: multiply by 2 → 2A = bh, divide by b → h = 2A/b.',
  },
  {
    id: 'alg-word-linear',
    category: 'algebra',
    area: 'ALG',
    title: 'A "flat fee plus a rate" story is always y = mx + b',
    body:
      'Membership plus per-visit, deposit plus monthly, base salary plus commission — same equation every time. Identify which number is the one-time amount and which is the repeated one, and the setup writes itself.',
  },

  // ───────────────────────── advanced ─────────────────────────
  {
    id: 'adv-forms',
    category: 'advanced',
    area: 'ADV',
    title: 'Each quadratic form displays exactly one feature',
    body:
      'Standard form ax² + bx + c hands you the y-intercept c. Factored form a(x−p)(x−q) hands you the zeros p and q. Vertex form a(x−h)² + k hands you the vertex (h, k). When a question asks which form "displays" something, it is asking you to recognize this, not to compute.',
  },
  {
    id: 'adv-discriminant',
    category: 'advanced',
    area: 'ADV',
    title: 'The discriminant counts real solutions',
    body:
      'b² − 4ac positive means two real solutions, zero means exactly one (the parabola is tangent to the x-axis), negative means none. Questions asking for the k that gives "exactly one solution" are discriminant-equals-zero questions in disguise.',
  },
  {
    id: 'adv-vertex-x',
    category: 'advanced',
    area: 'ADV',
    title: 'The vertex sits at x = −b/2a, always',
    body:
      'It is also the average of the two zeros, which is often faster when the quadratic is already factored. Maximum-height and minimum-cost questions are asking for the vertex.',
  },
  {
    id: 'adv-exponent-rules',
    category: 'advanced',
    area: 'ADV',
    title: 'Three exponent rules cover nearly every question',
    body:
      'Same base multiplied: add exponents. Divided: subtract. Power of a power: multiply. A negative exponent is a reciprocal, and a fractional exponent is a root: x^(3/2) is the square root of x cubed.',
  },
  {
    id: 'adv-factor-first',
    category: 'advanced',
    area: 'ADV',
    title: 'Try factoring before the quadratic formula',
    body:
      'SAT quadratics are usually built to factor. Look for the difference of squares, a perfect square trinomial, or a pair of integers multiplying to ac and adding to b. Reach for the formula when the factoring does not appear within about fifteen seconds.',
  },
  {
    id: 'adv-exp-model',
    category: 'advanced',
    area: 'ADV',
    title: 'Growth and decay: a·b^x, where b tells the whole story',
    body:
      'b > 1 is growth, 0 < b < 1 is decay. A 7% annual increase makes b = 1.07; a 7% decrease makes b = 0.93. When the rate is per period and x counts periods, the exponent needs no adjustment — check what x counts before you write it.',
    example: '$400 growing 6% per year for t years: A = 400(1.06)^t.\nHalving every 3 hours: A = A₀(0.5)^(t/3).',
  },
  {
    id: 'adv-linear-vs-exp',
    category: 'advanced',
    area: 'ADV',
    title: 'Linear adds the same amount; exponential multiplies by the same factor',
    body:
      'Given a table, take differences. Constant differences mean linear. Constant ratios mean exponential. This one check answers every "which model fits" question.',
  },
  {
    id: 'adv-factor-theorem',
    category: 'advanced',
    area: 'ADV',
    title: 'If p(a) = 0, then (x − a) is a factor',
    body:
      'And the converse. Questions phrased as "the graph passes through (3, 0)" or "x − 3 divides p(x)" or "3 is a zero" are all the same statement. Recognizing the equivalence is most of the work.',
  },
  {
    id: 'adv-rational-domain',
    category: 'advanced',
    area: 'ADV',
    title: 'Check for extraneous solutions on rational and radical equations',
    body:
      'Multiplying out a denominator or squaring both sides can invent a solution that does not satisfy the original equation. Always substitute back. Any value that makes a denominator zero is disqualified regardless of the algebra.',
  },
  {
    id: 'adv-nonlinear-system',
    category: 'advanced',
    area: 'ADV',
    title: 'Nonlinear systems: substitute the line into the curve',
    body:
      'Set them equal and you get a quadratic; its discriminant tells you whether they meet twice, once (tangent), or not at all. Or just graph both in Desmos and click the intersections.',
  },
  {
    id: 'adv-completing',
    category: 'advanced',
    area: 'ADV',
    title: 'Completing the square: halve b, square it, add and subtract',
    body:
      'For x² + bx, add (b/2)² to build the square and subtract it again to keep the value. Worth knowing even with Desmos available, because "rewrite in a form that displays the vertex" asks for the expression, not the number.',
    example: 'x² + 6x + 1 = (x² + 6x + 9) − 9 + 1 = (x + 3)² − 8 → vertex (−3, −8).',
  },

  // ───────────────────────── data ─────────────────────────
  {
    id: 'dat-mean-median',
    category: 'data',
    area: 'PSDA',
    title: 'Outliers drag the mean and leave the median alone',
    body:
      'In a right-skewed set the mean exceeds the median; in a left-skewed set it is below. Questions about adding an extreme value to a data set are testing exactly this asymmetry.',
  },
  {
    id: 'dat-sd-intuition',
    category: 'data',
    area: 'PSDA',
    title: 'You never compute standard deviation — you compare spread',
    body:
      'The SAT asks which of two sets has a larger standard deviation. The answer is the one whose values sit farther from their own mean. Clustered data means small deviation; spread-out data means large.',
  },
  {
    id: 'dat-percent-change',
    category: 'data',
    area: 'PSDA',
    title: 'Percent change divides by the original, always',
    body:
      'Change over original, not over the new value. Going from 40 to 50 is a 25% increase; going from 50 back to 40 is a 20% decrease. The same absolute change gives different percentages depending on the starting point.',
  },
  {
    id: 'dat-multiplier',
    category: 'data',
    area: 'PSDA',
    title: 'Chain percent changes by multiplying, never by adding',
    body:
      'Up 20% then down 20% is 1.20 × 0.80 = 0.96 — a 4% net loss, not a wash. Successive-discount and successive-increase questions are built on the assumption you will add them.',
  },
  {
    id: 'dat-reverse-percent',
    category: 'data',
    area: 'PSDA',
    title: 'Reverse percent: divide by the multiplier',
    body:
      'If a price after a 25% discount is $60, the original satisfies 0.75p = 60, so p = 80. Do not add 25% back to $60 — that gives $75 and is one of the choices.',
  },
  {
    id: 'dat-two-way',
    category: 'data',
    area: 'PSDA',
    title: 'On a two-way table, find the denominator first',
    body:
      '"Of those who chose A" restricts you to that row or column; "of all participants" uses the grand total. Circle the denominator in the table before you read off the numerator, and this entire question type becomes routine.',
  },
  {
    id: 'dat-sample',
    category: 'data',
    area: 'PSDA',
    title: 'A conclusion may only extend to the population sampled',
    body:
      'If the sample came from one school, the claim covers that school. Random selection permits generalizing to the population sampled from; random assignment permits claiming cause. Neither one licenses both.',
  },
  {
    id: 'dat-margin',
    category: 'data',
    area: 'PSDA',
    title: 'A larger sample narrows the margin of error',
    body:
      'The interval is the estimate plus or minus the margin. Any plausible value in that interval is consistent with the data — questions asking what is "supported" mean "inside the interval".',
  },
  {
    id: 'dat-best-fit',
    category: 'data',
    area: 'PSDA',
    title: 'A line of best fit predicts, it does not report',
    body:
      'When a question asks for the predicted value, read the line. When it asks for the actual value, read the data point. The difference between them is the residual, and asking for it is a standard question.',
  },
  {
    id: 'dat-units-chain',
    category: 'data',
    area: 'PSDA',
    title: 'Write unit conversions as fractions and cancel',
    body:
      'Stack conversion factors so unwanted units cancel diagonally. If the units come out right, the arithmetic is almost certainly right too — and if they do not, you have found the error before computing.',
    example: '60 mi/hr × (5280 ft/mi) × (1 hr/3600 s) = 88 ft/s',
  },

  // ───────────────────────── geometry ─────────────────────────
  {
    id: 'geo-special',
    category: 'geometry',
    area: 'GEO',
    title: 'The two special right triangles appear constantly',
    body:
      '30-60-90 has sides in the ratio 1 : √3 : 2, with the shortest opposite the 30°. 45-45-90 has 1 : 1 : √2. They are on the reference sheet, but recognizing one on sight saves far more time than looking it up.',
  },
  {
    id: 'geo-triples',
    category: 'geometry',
    area: 'GEO',
    title: 'Memorize the common Pythagorean triples',
    body:
      '3-4-5, 5-12-13, 8-15-17, 7-24-25, and every multiple of those. Spotting 6-8-10 as a scaled 3-4-5 turns a square-root computation into instant recall.',
  },
  {
    id: 'geo-sohcahtoa',
    category: 'geometry',
    area: 'GEO',
    title: 'SOH-CAH-TOA, then check which side is the hypotenuse',
    body:
      'Sine is opposite over hypotenuse, cosine adjacent over hypotenuse, tangent opposite over adjacent. Label the triangle relative to the angle named in the question before choosing the ratio — the opposite side changes when the angle does.',
  },
  {
    id: 'geo-cofunction',
    category: 'geometry',
    area: 'GEO',
    title: 'sin(x) = cos(90° − x)',
    body:
      'The sine of an angle equals the cosine of its complement. Questions giving sin(a) and asking for cos(b) where a + b = 90 are testing this identity and nothing else.',
  },
  {
    id: 'geo-similar',
    category: 'geometry',
    area: 'GEO',
    title: 'Scaling by k multiplies area by k² and volume by k³',
    body:
      'Double every length and area quadruples while volume becomes eight times larger. A large share of similarity questions test only this, and the trap answer is always the one that scaled linearly.',
  },
  {
    id: 'geo-circle-eq',
    category: 'geometry',
    area: 'GEO',
    title: 'Circle equations: (x−h)² + (y−k)² = r²',
    body:
      'The centre signs are opposite what they look like — (x−3)² means h = 3. The right side is r², not r, so a right side of 25 means radius 5. Both are standard trap points.',
  },
  {
    id: 'geo-complete-circle',
    category: 'geometry',
    area: 'GEO',
    title: 'An expanded circle equation needs completing the square — twice',
    body:
      'Group the x terms and the y terms, complete each square, and move the constants. Once in standard form the centre and radius are readable.',
    example: 'x² + y² − 6x + 4y = 12\n(x² − 6x + 9) + (y² + 4y + 4) = 12 + 9 + 4\n(x − 3)² + (y + 2)² = 25 → centre (3, −2), r = 5',
  },
  {
    id: 'geo-arc',
    category: 'geometry',
    area: 'GEO',
    title: 'Arc and sector are both fractions of the whole circle',
    body:
      'The fraction is the central angle over 360°. Multiply it by the circumference for arc length, or by the area for sector area. One idea, two formulas — do not memorize them separately.',
  },
  {
    id: 'geo-radians',
    category: 'geometry',
    area: 'GEO',
    title: 'π radians is 180 degrees',
    body:
      'Convert by multiplying by π/180 or 180/π — pick whichever cancels the unit you are leaving. Arc length also has the compact form s = rθ when θ is in radians.',
  },
  {
    id: 'geo-not-to-scale',
    category: 'geometry',
    area: 'GEO',
    title: 'Never measure the figure',
    body:
      'Diagrams are not drawn to scale unless the question says so. An angle that looks like 90° is 90° only if it is marked or stated. Work from the givens, not the picture.',
  },
  {
    id: 'geo-formula-sheet',
    category: 'geometry',
    area: 'GEO',
    title: 'The reference sheet has the formulas — but looking them up costs time',
    body:
      'Areas, volumes, the special triangles, and the 360°/2π facts are all provided. Knowing them cold is still worth it: each lookup costs about fifteen seconds, and geometry questions cluster near the end of a module where you have the least time.',
  },

  // ───────────────────────── errors ─────────────────────────
  {
    id: 'err-log',
    category: 'errors',
    title: 'Keep an error log, sorted by cause and not by topic',
    body:
      'For every missed question write one of: did not know it, misread it, or slipped. Most students discover that the second and third categories outnumber the first — and those are fixed by process changes, not by more studying.',
  },
  {
    id: 'err-sign',
    category: 'errors',
    title: 'Sign errors are the number one careless mistake',
    body:
      'They cluster in three places: distributing a negative, moving a term across the equals sign, and multiplying an inequality by a negative. Slow down by one beat at each of those three moments.',
  },
  {
    id: 'err-reread',
    category: 'errors',
    title: 'Re-read the question stem after you get a number',
    body:
      'Two seconds, every question. It catches solving for the wrong variable, giving a total when a per-unit was asked, and answering in the wrong units. This is the highest-return habit in all of SAT math.',
  },
  {
    id: 'err-trap-choice',
    category: 'errors',
    title: 'The wrong answers are engineered from your likely mistakes',
    body:
      'One choice is the value before the last step. One is the right value with a flipped sign. One answers a different question in the stem. Landing exactly on a choice is not confirmation that you were right.',
  },
  {
    id: 'err-scratch',
    category: 'errors',
    title: 'Write the steps down even when you can do them in your head',
    body:
      'Mental arithmetic under time pressure is where slips happen, and untraceable work cannot be checked. Numbering your steps also makes reviewing the question afterward much faster.',
  },
  {
    id: 'err-transcribe',
    category: 'errors',
    title: 'Copy the problem down correctly, then check the copy',
    body:
      'Transcription errors — a 6 becoming an 8, a minus dropped — produce a clean, confident, wrong answer. Glance back at the screen once after copying.',
  },
  {
    id: 'err-fatigue',
    category: 'errors',
    title: 'Expect an accuracy dip in the last third of a module',
    body:
      'It is fatigue, not difficulty. Take a deliberate three-second reset — hands off the keyboard, one breath — at question 15. Practice tests should be taken in full timed blocks so this dip shows up before test day.',
  },

  // ───────────────────────── reference ─────────────────────────
  {
    id: 'ref-slope',
    category: 'reference',
    title: 'Slope = (y₂ − y₁)/(x₂ − x₁)',
    body:
      'Rise over run, and the order of the points does not matter as long as you keep it consistent in both the numerator and the denominator. Subtracting in opposite orders is a common source of a sign flip.',
  },
  {
    id: 'ref-quadratic',
    category: 'reference',
    title: 'x = (−b ± √(b² − 4ac)) / 2a',
    body:
      'Not on the reference sheet — memorize it. The whole numerator sits over 2a, which is the detail most often written wrong under time pressure.',
  },
  {
    id: 'ref-averages',
    category: 'reference',
    title: 'Sum = average × count',
    body:
      'Rearranging the average formula this way solves nearly every average question, including "what score is needed on the last test" problems. Work with the total, not the average.',
  },
  {
    id: 'ref-distance',
    category: 'reference',
    title: 'Distance between points is the Pythagorean theorem',
    body:
      '√((x₂−x₁)² + (y₂−y₁)²). The midpoint is just the two averages: ((x₁+x₂)/2, (y₁+y₂)/2). Neither is on the reference sheet.',
  },
  {
    id: 'ref-percent-formula',
    category: 'reference',
    title: 'part = percent × whole',
    body:
      'Every percent question is this equation with one of the three unknown. Identify which one the question is missing before writing anything else.',
  },
  {
    id: 'ref-probability',
    category: 'reference',
    title: 'Probability = favorable / total',
    body:
      'On the SAT this is almost always read straight off a two-way table. The difficulty is never the formula — it is choosing the correct total.',
  },
  {
    id: 'ref-exp-forms',
    category: 'reference',
    title: 'Growth: A = a(1 + r)^t. Decay: A = a(1 − r)^t',
    body:
      'When the rate is compounded n times per year, it becomes A = a(1 + r/n)^(nt). Read carefully whether the exponent counts years or compounding periods.',
  },
  {
    id: 'ref-vertex-form',
    category: 'reference',
    title: 'y = a(x − h)² + k has vertex (h, k)',
    body:
      'The sign of a opens the parabola up or down and its size stretches it. A vertical shift changes k; a horizontal shift changes h in the opposite direction from how it reads.',
  },

  // ───────────────────────── test day ─────────────────────────
  {
    id: 'day-practice-real',
    category: 'testday',
    title: 'Take practice tests under real conditions',
    body:
      'Full 35-minute modules, no pausing, no phone, at the time of day the real test starts. A practice test taken in three sittings measures your knowledge; a test taken in one measures your score.',
  },
  {
    id: 'day-device',
    category: 'testday',
    title: 'Charge the device and install the app the week before',
    body:
      'Bring a charger anyway. Get the exam app updated and complete the readiness check early — the morning of is not the moment to discover a required update.',
  },
  {
    id: 'day-scratch',
    category: 'testday',
    title: 'Scratch paper is provided — use all of it',
    body:
      'Keep it organized by question number rather than filling the sheet at random. Organized work is checkable work, and checking is where points come back.',
  },
  {
    id: 'day-review-order',
    category: 'testday',
    title: 'Review your practice tests the same day, while the reasoning is fresh',
    body:
      'For every miss, write the sentence that explains why. A test you take and do not review teaches you almost nothing — the review is where the score improvement actually happens.',
  },
  {
    id: 'day-first-question',
    category: 'testday',
    title: 'Nerves peak at question one — plan for it',
    body:
      'Read the first question twice on purpose. Starting deliberately settles your pace for the whole module, and the opening questions are usually the most gettable points on the test.',
  },
  {
    id: 'day-dont-cram',
    category: 'testday',
    title: 'Do not learn new content the night before',
    body:
      'Re-read your error log and the formula list, then stop. Sleep does more for a math score than a late session ever has, and fatigue shows up first in exactly the careless errors you have been working to eliminate.',
  },
];

export const TIPS_BY_CATEGORY: Record<TipCategory, SatTip[]> = TIP_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.key] = SAT_TIPS.filter((t) => t.category === c.key);
    return acc;
  },
  {} as Record<TipCategory, SatTip[]>,
);

/** Tips tagged to a blueprint area, surfaced on that area's unit playbooks. */
export function tipsForArea(area: SatArea): SatTip[] {
  return SAT_TIPS.filter((t) => t.area === area);
}

export const TOTAL_SAT_TIPS = SAT_TIPS.length;
