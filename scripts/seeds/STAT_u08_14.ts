import type { SeedProblem } from './types';

// STAT — AP Statistics, units 8-14. 70 problems (10 per unit).
// U8:  Random variables, expected value and variance        STAT.PROB.B
// U9:  Binomial and geometric distributions                  STAT.PROB.C
// U10: Sampling distributions and the Central Limit Theorem  STAT.PROB.C
// U11: Confidence intervals for proportions and means        STAT.INF.A
// U12: Significance tests: hypotheses, p-values and errors   STAT.INF.B
// U13: Two-sample tests and chi-square tests                 STAT.INF.C
// U14: Inference for regression and reading the free-response STAT.INF.C
//
// Critical values (z*, t*) and any normal-table probabilities a problem needs
// are given in the prompt, so the student never needs a calculator table.

export const problemsSTATu08_14: SeedProblem[] = [
  // ---------------- UNIT 8 — Random variables, expected value and variance ----------------
  {
    domain: 'STAT', num: 71, unit: 8, order: 1, slug: 'raffle-expected-winnings',
    standard: 'STAT.PROB.B.1', difficulty: 1,
    prompt: 'A school raffle ticket pays $\\$10$ with probability $0.1$ and $\\$0$ with probability $0.9$. Let $X$ be the amount one ticket pays. What is the expected value $E(X)$, in dollars?',
    answerType: 'numeric', primaryAnswer: '1', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Expected value is a weighted average: each outcome times its probability, then add.' },
      { level: 'guide', text: '$E(X) = 10(0.1) + 0(0.9)$.' },
      { level: 'reveal', text: '$10(0.1) + 0(0.9) = 1 + 0 = 1$. The ticket is worth $\\$1$ on average.' },
    ],
    explanation: ['$E(X) = \\sum x \\cdot P(x)$, so multiply each payout by its probability.', '$10 \\times 0.1 = 1$ and $0 \\times 0.9 = 0$.', 'Add them: $E(X) = 1$. Over many tickets, the average payout is $\\$1$ per ticket.'],
    alternativeExplanations: [
      { title: 'Imagine 100 tickets', steps: ['Out of 100 tickets, about 10 pay $\\$10$ and 90 pay nothing.', 'Total paid out: $10 \\times 10 = \\$100$.', 'Spread over 100 tickets that is $\\$1$ per ticket — the expected value.'] },
    ],
    tags: ['random-variable', 'expected-value', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'STAT', num: 72, unit: 8, order: 2, slug: 'pizza-toppings-mean',
    standard: 'STAT.PROB.B.1', difficulty: 1,
    prompt: 'At a pizza shop, the number of toppings $X$ a customer orders has this distribution: $P(X = 1) = 0.2$, $P(X = 2) = 0.5$, $P(X = 3) = 0.3$. Find the mean $\\mu_X$. Round to the nearest tenth.',
    answerType: 'numeric', primaryAnswer: '2.1', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'The mean of a discrete random variable is $\\sum x \\cdot P(x)$ — value times probability, summed.' },
      { level: 'guide', text: 'Compute $1(0.2) + 2(0.5) + 3(0.3)$.' },
      { level: 'reveal', text: '$0.2 + 1.0 + 0.9 = 2.1$ toppings.' },
    ],
    explanation: ['Multiply each value by its probability: $1(0.2) = 0.2$, $2(0.5) = 1.0$, $3(0.3) = 0.9$.', 'Add: $0.2 + 1.0 + 0.9 = 2.1$.', 'So $\\mu_X = 2.1$ toppings. It need not be a whole number — it is a long-run average.'],
    alternativeExplanations: [
      { title: 'Picture 10 customers', steps: ['Among 10 typical customers, 2 order one topping, 5 order two, 3 order three.', 'Total toppings: $2 + 10 + 9 = 21$.', 'Average: $21 \\div 10 = 2.1$ toppings per customer.'] },
    ],
    tags: ['random-variable', 'expected-value', 'word-problem'], estimatedSeconds: 45,
  },
  {
    domain: 'STAT', num: 73, unit: 8, order: 3, slug: 'missing-probability',
    standard: 'STAT.PROB.B.1', difficulty: 1,
    prompt: 'A discrete random variable $X$ takes the values $0, 1, 2, 3$ with $P(0) = 0.15$, $P(1) = 0.35$, $P(2) = \\,?$, and $P(3) = 0.10$. What is $P(X = 2)$?',
    answerType: 'numeric', primaryAnswer: '0.4', alternativeAnswers: ['2/5', '40%'], acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The probabilities in a valid distribution must add up to exactly $1$.' },
      { level: 'guide', text: 'Add the three known probabilities and subtract from $1$.' },
      { level: 'reveal', text: '$0.15 + 0.35 + 0.10 = 0.60$, so $P(X = 2) = 1 - 0.60 = 0.40$.' },
    ],
    explanation: ['A probability distribution lists every possible outcome, so its probabilities sum to $1$.', 'The known ones total $0.15 + 0.35 + 0.10 = 0.60$.', 'The missing one fills the gap: $1 - 0.60 = 0.40$.'],
    alternativeExplanations: [
      { title: 'Think in percents', steps: ['The known outcomes cover $15\\% + 35\\% + 10\\% = 60\\%$ of all cases.', 'The other $40\\%$ of cases must be $X = 2$.', 'So $P(X = 2) = 0.40$.'] },
    ],
    tags: ['random-variable', 'probability-distribution'], estimatedSeconds: 35,
  },
  {
    domain: 'STAT', num: 74, unit: 8, order: 4, slug: 'soccer-goals-variance',
    standard: 'STAT.PROB.B.1', difficulty: 2,
    prompt: 'The number of goals $X$ a soccer team scores in a match has distribution $P(0) = 0.3$, $P(1) = 0.4$, $P(2) = 0.3$. Find the variance $\\sigma_X^2$. Round to the nearest tenth.',
    answerType: 'numeric', primaryAnswer: '0.6', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'First find the mean. Then variance is $\\sum (x - \\mu)^2 \\cdot P(x)$.' },
      { level: 'guide', text: 'The mean is $0(0.3) + 1(0.4) + 2(0.3) = 1$. Now square each distance from $1$ and weight by probability.' },
      { level: 'reveal', text: '$(0-1)^2(0.3) + (1-1)^2(0.4) + (2-1)^2(0.3) = 0.3 + 0 + 0.3 = 0.6$.' },
    ],
    explanation: ['Mean: $\\mu = 0(0.3) + 1(0.4) + 2(0.3) = 0 + 0.4 + 0.6 = 1$ goal.', 'Variance weights each squared distance from the mean by its probability: $(0-1)^2(0.3) = 0.3$, $(1-1)^2(0.4) = 0$, $(2-1)^2(0.3) = 0.3$.', 'Sum: $\\sigma_X^2 = 0.6$. (The standard deviation would be $\\sqrt{0.6} \\approx 0.77$ goals.)'],
    alternativeExplanations: [
      { title: 'Use symmetry', steps: ['The distribution is symmetric around $1$ (0.3 on each side), so the mean is exactly $1$ with no arithmetic.', 'Only $X = 0$ and $X = 2$ are away from the mean, each 1 unit away, each with probability $0.3$.', 'Variance $= 1^2(0.3) + 1^2(0.3) = 0.6$.'] },
    ],
    tags: ['random-variable', 'variance', 'word-problem'], estimatedSeconds: 70,
  },
  {
    domain: 'STAT', num: 75, unit: 8, order: 5, slug: 'car-wash-revenue-mean',
    standard: 'STAT.PROB.B.2', difficulty: 2,
    prompt: 'A car wash serves $X$ cars per hour, where $X$ has mean $12$ and standard deviation $3$. Each car brings in $\\$8$, and the hourly cost of running the wash is $\\$20$, so hourly profit is $Y = 8X - 20$. What is the mean of $Y$, in dollars?',
    answerType: 'numeric', primaryAnswer: '76', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'For $Y = aX + b$, the mean transforms the same way: $\\mu_Y = a\\mu_X + b$.' },
      { level: 'guide', text: 'Here $a = 8$ and $b = -20$. Plug in $\\mu_X = 12$.' },
      { level: 'reveal', text: '$\\mu_Y = 8(12) - 20 = 96 - 20 = 76$ dollars.' },
    ],
    explanation: ['Multiplying every value of $X$ by $8$ multiplies the mean by $8$: $8 \\times 12 = 96$.', 'Subtracting $20$ from every value lowers the mean by $20$: $96 - 20 = 76$.', 'So the mean hourly profit is $\\$76$. (The standard deviation $3$ was not needed for the mean.)'],
    alternativeExplanations: [
      { title: 'A typical hour', steps: ['In a typical hour, 12 cars come through.', 'Revenue: $12 \\times 8 = \\$96$. Subtract the $\\$20$ cost: $\\$76$.', 'Because the rule $8X - 20$ is linear, the "typical hour" calculation gives exactly the mean of $Y$.'] },
    ],
    tags: ['random-variable', 'linear-transformation', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'STAT', num: 76, unit: 8, order: 6, slug: 'celsius-to-fahrenheit-sd',
    standard: 'STAT.PROB.B.2', difficulty: 2,
    prompt: 'Daily high temperatures in a city, measured in Celsius, have standard deviation $2.5^\\circ$C. Converted to Fahrenheit with $F = 1.8C + 32$, what is the standard deviation of the Fahrenheit temperatures?',
    answerType: 'numeric', primaryAnswer: '4.5', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'Adding a constant shifts every value but does not change spread. Multiplying by a constant DOES scale the spread.' },
      { level: 'guide', text: 'For $Y = aX + b$, $\\sigma_Y = |a| \\cdot \\sigma_X$. The $+32$ does nothing to the SD.' },
      { level: 'reveal', text: '$\\sigma_F = 1.8 \\times 2.5 = 4.5^\\circ$F.' },
    ],
    explanation: ['Standard deviation measures how spread out values are. Adding $32$ slides all values together and leaves the spread alone.', 'Multiplying by $1.8$ stretches every gap between values by $1.8$.', 'So $\\sigma_F = 1.8(2.5) = 4.5$ degrees Fahrenheit.'],
    alternativeExplanations: [
      { title: 'Follow two days', steps: ['Suppose two days are $20^\\circ$C and $22.5^\\circ$C — one SD apart.', 'In Fahrenheit: $1.8(20) + 32 = 68$ and $1.8(22.5) + 32 = 72.5$.', 'The gap went from $2.5$ to $4.5$, so the SD did too.'] },
    ],
    tags: ['random-variable', 'linear-transformation', 'standard-deviation', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'STAT', num: 77, unit: 8, order: 7, slug: 'two-parts-total-length-sd',
    standard: 'STAT.PROB.B.2', difficulty: 2,
    prompt: 'A machine cuts rod A with mean length $10$ cm and standard deviation $0.3$ cm, and rod B with mean $15$ cm and standard deviation $0.4$ cm. The two lengths are independent. A and B are glued end to end. What is the standard deviation of the total length $T = A + B$, in cm?',
    answerType: 'numeric', primaryAnswer: '0.5', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'Standard deviations do NOT add. Variances do — when the variables are independent.' },
      { level: 'guide', text: '$\\sigma_T^2 = \\sigma_A^2 + \\sigma_B^2 = 0.3^2 + 0.4^2$. Then take the square root.' },
      { level: 'reveal', text: '$0.09 + 0.16 = 0.25$, and $\\sqrt{0.25} = 0.5$ cm.' },
    ],
    explanation: ['For independent random variables, variances add: $\\sigma_T^2 = \\sigma_A^2 + \\sigma_B^2$.', '$0.3^2 + 0.4^2 = 0.09 + 0.16 = 0.25$.', 'Convert back to a standard deviation: $\\sigma_T = \\sqrt{0.25} = 0.5$ cm. (The mean is $10 + 15 = 25$ cm, but the question asked for the SD.)'],
    alternativeExplanations: [
      { title: 'Why not just 0.7?', steps: ['Adding the SDs ($0.3 + 0.4 = 0.7$) would assume a long A always pairs with a long B.', 'Independence means a long A is just as likely to pair with a short B, which partly cancels.', 'The Pythagorean-style rule $\\sqrt{0.3^2 + 0.4^2} = 0.5$ captures that cancellation.'] },
    ],
    tags: ['random-variable', 'combining-variables', 'standard-deviation', 'word-problem'], estimatedSeconds: 60,
  },
  {
    domain: 'STAT', num: 78, unit: 8, order: 8, slug: 'insurance-expected-profit',
    standard: 'STAT.PROB.B.1', difficulty: 3,
    prompt: 'An insurance company charges $\\$500$ for a one-year policy. With probability $0.02$ the customer files a claim and the company pays out $\\$20{,}000$; otherwise it pays nothing. What is the company\'s expected profit per policy, in dollars?',
    answerType: 'numeric', primaryAnswer: '100', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Profit is what comes in minus what goes out. The $\\$500$ always comes in; the payout only sometimes goes out.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: a $\\$10$ ticket pays $\\$100$ with probability $0.05$. Expected profit for the seller is $10 - 0.05(100) = 10 - 5 = \\$5$. Same structure here.' },
      { level: 'guide', text: 'Expected payout $= 0.02 \\times 20{,}000$. Subtract that from the $\\$500$ premium.' },
      { level: 'reveal', text: '$0.02 \\times 20{,}000 = 400$, so expected profit $= 500 - 400 = \\$100$.' },
    ],
    explanation: ['Define profit $P$: with probability $0.98$ the company keeps $\\$500$; with probability $0.02$ it gets $500 - 20{,}000 = -\\$19{,}500$.', '$E(P) = 500(0.98) + (-19{,}500)(0.02) = 490 - 390 = 100$.', 'So the company expects to earn $\\$100$ per policy. On a single policy it may lose big, but averaged over thousands it earns about $\\$100$ each.'],
    alternativeExplanations: [
      { title: 'Premium minus expected payout', steps: ['The premium is certain: $\\$500$ in.', 'The payout is a random variable with expected value $0.02 \\times 20{,}000 = \\$400$ out.', 'Expected profit $= 500 - 400 = \\$100$. Linearity of expectation lets you subtract expected values directly.'] },
      { title: 'A thousand policies', steps: ['Sell 1,000 policies: income $= 1000 \\times 500 = \\$500{,}000$.', 'About $2\\%$, or 20 customers, file claims: payout $= 20 \\times 20{,}000 = \\$400{,}000$.', 'Net $\\$100{,}000$ over 1,000 policies is $\\$100$ each.'] },
    ],
    tags: ['random-variable', 'expected-value', 'multi-step', 'word-problem'], estimatedSeconds: 80,
  },
  {
    domain: 'STAT', num: 79, unit: 8, order: 9, slug: 'commute-difference-sd',
    standard: 'STAT.PROB.B.2', difficulty: 3,
    prompt: 'Nia\'s morning commute $M$ has mean $30$ minutes and standard deviation $4$ minutes; her evening commute $E$ has mean $34$ minutes and standard deviation $3$ minutes. The two are independent. Let $D = E - M$ be how much longer the evening trip takes. What is the standard deviation of $D$, in minutes?',
    answerType: 'numeric', primaryAnswer: '5', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'Subtracting random variables still ADDS their variances. Uncertainty piles up whether you add or subtract.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: if $X$ and $Y$ are independent with SDs $6$ and $8$, then $\\sigma_{X-Y} = \\sqrt{36 + 64} = 10$, not $2$. Same idea here.' },
      { level: 'guide', text: '$\\sigma_D^2 = \\sigma_E^2 + \\sigma_M^2 = 3^2 + 4^2$. Then square-root.' },
      { level: 'reveal', text: '$9 + 16 = 25$, so $\\sigma_D = 5$ minutes.' },
    ],
    explanation: ['For independent $E$ and $M$, $\\text{Var}(E - M) = \\text{Var}(E) + \\text{Var}(M)$. The minus sign does not turn into a minus for variances.', '$3^2 + 4^2 = 9 + 16 = 25$.', '$\\sigma_D = \\sqrt{25} = 5$ minutes. (The mean of $D$ is $34 - 30 = 4$ minutes — that one does subtract.)'],
    alternativeExplanations: [
      { title: 'Why the trap answer fails', steps: ['A tempting answer is $\\sqrt{9 - 16}$, which is not even a real number — a sign the method is wrong.', 'Another trap is $4 - 3 = 1$, but a difference of two uncertain things is MORE uncertain, not less.', 'Treat $E - M$ as $E + (-M)$. Flipping the sign of $M$ leaves its variance at $16$, so the total is $25$ and the SD is $5$.'] },
    ],
    tags: ['random-variable', 'combining-variables', 'standard-deviation', 'word-problem'], estimatedSeconds: 75,
  },
  {
    domain: 'STAT', num: 80, unit: 8, order: 10, slug: 'carnival-game-fairness',
    standard: 'STAT.PROB.B.1', difficulty: 3,
    prompt: 'A carnival game costs $\\$2$ to play. With probability $\\frac{1}{4}$ you win $\\$5$, with probability $\\frac{1}{4}$ you win $\\$1$, and otherwise you win nothing. Which statement correctly describes the game from the player\'s point of view?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'The game is fair: the player breaks even on average.', correct: false },
      { id: 'B', label: 'The player loses $\\$0.50$ per play on average.', correct: true },
      { id: 'C', label: 'The player gains $\\$0.50$ per play on average.', correct: false },
      { id: 'D', label: 'The player loses $\\$2$ per play on average.', correct: false },
    ],
    primaryAnswer: 'B', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'First find the expected WINNINGS, ignoring the cost. Then subtract the $\\$2$ to play.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: a $\\$1$ game pays $\\$4$ with probability $\\frac{1}{2}$. Expected winnings $= 2$, minus cost $1$, so the player gains $\\$1$ per play on average. Same steps here.' },
      { level: 'guide', text: 'Expected winnings $= 5 \\cdot \\frac{1}{4} + 1 \\cdot \\frac{1}{4} + 0 \\cdot \\frac{1}{2}$. Compare that to $\\$2$.' },
      { level: 'reveal', text: 'Expected winnings $= 1.25 + 0.25 = 1.50$. Net: $1.50 - 2 = -0.50$, a loss of $\\$0.50$ per play.' },
    ],
    explanation: ['Expected winnings: $5(0.25) + 1(0.25) + 0(0.5) = 1.25 + 0.25 + 0 = \\$1.50$.', 'Each play costs $\\$2$, so the expected net is $1.50 - 2.00 = -\\$0.50$.', 'A negative expected net means the player loses $\\$0.50$ per play on average — choice B. A fair game would have expected net $\\$0$.'],
    alternativeExplanations: [
      { title: 'Play 4 times', steps: ['In 4 typical plays you win $\\$5$ once, $\\$1$ once, and nothing twice: $\\$6$ total.', 'You paid $4 \\times 2 = \\$8$.', 'Down $\\$2$ over 4 plays is $\\$0.50$ per play — choice B.'] },
    ],
    tags: ['random-variable', 'expected-value', 'fair-game', 'word-problem'], estimatedSeconds: 75,
  },

  // ---------------- UNIT 9 — Binomial and geometric distributions ----------------
  {
    domain: 'STAT', num: 81, unit: 9, order: 1, slug: 'which-is-binomial',
    standard: 'STAT.PROB.C.1', difficulty: 1,
    prompt: 'Which random variable has a binomial distribution?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'The number of rolls of a fair die until the first 6 appears.', correct: false },
      { id: 'B', label: 'The number of 6s in 10 rolls of a fair die.', correct: true },
      { id: 'C', label: 'The number of hearts in 5 cards dealt without replacement from one deck.', correct: false },
      { id: 'D', label: 'The height, in cm, of a randomly chosen student.', correct: false },
    ],
    primaryAnswer: 'B', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Binomial needs BINS: Binary outcomes, Independent trials, a fixed Number of trials, and the Same probability each trial.' },
      { level: 'guide', text: 'Counting trials until the first success is geometric, not binomial. Dealing without replacement breaks independence. A height is not a count at all.' },
      { level: 'reveal', text: 'Only B has a fixed number of trials ($n = 10$), each independent with the same $p = \\frac{1}{6}$, and counts successes.' },
    ],
    explanation: ['A binomial variable counts successes in a FIXED number of independent trials with the same success probability.', 'A has no fixed $n$ (you roll until a 6) — that is geometric. C changes the probability after each card, so trials are not independent. D is a measurement, not a count.', 'B: 10 trials, each a 6 or not, independent, $p = \\frac{1}{6}$ every time. That is binomial.'],
    alternativeExplanations: [
      { title: 'Ask "what am I counting?"', steps: ['Binomial counts HOW MANY successes in $n$ tries. Geometric counts HOW LONG until the first success.', 'B counts how many 6s in 10 tries — binomial. A counts how long until a 6 — geometric.', 'C and D fail for other reasons (no independence; not a count).'] },
    ],
    tags: ['binomial', 'geometric', 'conditions'], estimatedSeconds: 45,
  },
  {
    domain: 'STAT', num: 82, unit: 9, order: 2, slug: 'free-throw-expected-makes',
    standard: 'STAT.PROB.C.1', difficulty: 1,
    prompt: 'A basketball player makes $80\\%$ of her free throws, independently. In a practice session she takes $25$ free throws. What is the expected number of makes?',
    answerType: 'numeric', primaryAnswer: '20', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'For a binomial variable, the mean is simply $np$.' },
      { level: 'guide', text: '$n = 25$ shots, $p = 0.8$. Multiply.' },
      { level: 'reveal', text: '$\\mu_X = 25 \\times 0.8 = 20$ makes.' },
    ],
    explanation: ['The number of makes $X$ is binomial with $n = 25$ and $p = 0.8$.', 'The mean of a binomial distribution is $\\mu_X = np$.', '$25 \\times 0.8 = 20$ expected makes.'],
    alternativeExplanations: [
      { title: 'Percent of the shots', steps: ['She makes $80\\%$ of her shots in the long run.', '$80\\%$ of 25 shots is $0.8 \\times 25 = 20$.', 'Some sessions she makes more, some fewer, but 20 is the long-run average.'] },
    ],
    tags: ['binomial', 'expected-value', 'word-problem'], estimatedSeconds: 30,
  },
  {
    domain: 'STAT', num: 83, unit: 9, order: 3, slug: 'four-coins-two-heads',
    standard: 'STAT.PROB.C.1', difficulty: 1,
    prompt: 'A fair coin is flipped $4$ times. What is the probability of getting exactly $2$ heads? Give your answer as a decimal.',
    answerType: 'numeric', primaryAnswer: '0.375', alternativeAnswers: ['3/8', '37.5%'], acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'Use the binomial formula $P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$ with $n = 4$, $k = 2$, $p = 0.5$.' },
      { level: 'guide', text: '$\\binom{4}{2} = 6$ ways to choose which 2 flips are heads. Each specific sequence has probability $(0.5)^4 = \\frac{1}{16}$.' },
      { level: 'reveal', text: '$6 \\times \\frac{1}{16} = \\frac{6}{16} = 0.375$.' },
    ],
    explanation: ['$X$, the number of heads, is binomial with $n = 4$ and $p = 0.5$.', '$P(X = 2) = \\binom{4}{2}(0.5)^2(0.5)^2 = 6 \\times 0.25 \\times 0.25$.', '$6 \\times 0.0625 = 0.375$.'],
    alternativeExplanations: [
      { title: 'List the sequences', steps: ['There are $2^4 = 16$ equally likely sequences of 4 flips.', 'The ones with exactly 2 heads: HHTT, HTHT, HTTH, THHT, THTH, TTHH — that is 6.', '$\\frac{6}{16} = 0.375$.'] },
    ],
    tags: ['binomial', 'probability'], estimatedSeconds: 45,
  },
  {
    domain: 'STAT', num: 84, unit: 9, order: 4, slug: 'seeds-exactly-three-germinate',
    standard: 'STAT.PROB.C.1', difficulty: 2,
    prompt: 'Each seed of a certain tomato variety germinates with probability $0.6$, independently. A gardener plants $5$ seeds. What is the probability that exactly $3$ germinate? Round to four decimal places.',
    answerType: 'numeric', primaryAnswer: '0.3456', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'This is binomial: $n = 5$, $p = 0.6$, and you want $P(X = 3)$.' },
      { level: 'guide', text: '$P(X = 3) = \\binom{5}{3}(0.6)^3(0.4)^2$. Note $\\binom{5}{3} = 10$.' },
      { level: 'reveal', text: '$10 \\times 0.216 \\times 0.16 = 0.3456$.' },
    ],
    explanation: ['Binomial setting: 5 independent seeds, each germinates ($p = 0.6$) or not ($0.4$).', '$P(X = 3) = \\binom{5}{3}(0.6)^3(0.4)^2 = 10 \\times 0.216 \\times 0.16$.', '$0.216 \\times 0.16 = 0.03456$, times $10$ gives $0.3456$.'],
    alternativeExplanations: [
      { title: 'One sequence, then count the arrangements', steps: ['One specific way: seeds 1, 2, 3 germinate and 4, 5 do not. Probability: $0.6 \\cdot 0.6 \\cdot 0.6 \\cdot 0.4 \\cdot 0.4 = 0.03456$.', 'But WHICH 3 germinate can happen in $\\binom{5}{3} = 10$ ways, each with that same probability.', 'Total: $10 \\times 0.03456 = 0.3456$.'] },
    ],
    tags: ['binomial', 'probability', 'word-problem'], estimatedSeconds: 70,
  },
  {
    domain: 'STAT', num: 85, unit: 9, order: 5, slug: 'coupon-users-sd',
    standard: 'STAT.PROB.C.1', difficulty: 2,
    prompt: 'At a grocery store, $30\\%$ of customers use a coupon, independently of one another. Of the next $100$ customers, let $X$ be the number who use a coupon. What is the standard deviation of $X$? Round to two decimal places.',
    answerType: 'numeric', primaryAnswer: '4.58', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'For a binomial variable, $\\sigma_X = \\sqrt{np(1-p)}$.' },
      { level: 'guide', text: 'Compute $np(1-p) = 100(0.3)(0.7)$ first, then take the square root.' },
      { level: 'reveal', text: '$100(0.3)(0.7) = 21$, and $\\sqrt{21} \\approx 4.58$.' },
    ],
    explanation: ['$X$ is binomial with $n = 100$, $p = 0.3$.', 'Variance: $np(1-p) = 100 \\times 0.3 \\times 0.7 = 21$.', 'Standard deviation: $\\sqrt{21} \\approx 4.58$ customers. The mean is $30$, so typical counts land within about $\\pm 4.6$ of 30.'],
    alternativeExplanations: [
      { title: 'Build it from one customer', steps: ['One customer is a 0/1 variable with variance $p(1-p) = 0.21$.', '100 independent customers: variances add, giving $100 \\times 0.21 = 21$.', 'SD $= \\sqrt{21} \\approx 4.58$. That is exactly where the formula $\\sqrt{np(1-p)}$ comes from.'] },
    ],
    tags: ['binomial', 'standard-deviation', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'STAT', num: 86, unit: 9, order: 6, slug: 'sales-calls-expected-until-sale',
    standard: 'STAT.PROB.C.2', difficulty: 2,
    prompt: 'A salesperson closes a sale on $20\\%$ of her calls, independently. Let $Y$ be the number of calls she makes up to and including her first sale. What is the expected value of $Y$?',
    answerType: 'numeric', primaryAnswer: '5', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '"Number of trials until the first success" is a GEOMETRIC variable.' },
      { level: 'guide', text: 'The mean of a geometric distribution is $\\frac{1}{p}$.' },
      { level: 'reveal', text: '$\\frac{1}{0.2} = 5$ calls on average.' },
    ],
    explanation: ['Each call is a trial; the first sale is the first success. $Y$ is geometric with $p = 0.2$.', 'The mean of a geometric variable is $\\mu_Y = \\frac{1}{p}$.', '$\\frac{1}{0.2} = 5$ calls.'],
    alternativeExplanations: [
      { title: 'Rate thinking', steps: ['If 1 in 5 calls is a sale, then sales happen at a rate of one per 5 calls.', 'So the typical wait for the next sale is 5 calls.', 'That matches $\\frac{1}{p} = \\frac{1}{0.2} = 5$.'] },
    ],
    tags: ['geometric', 'expected-value', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'STAT', num: 87, unit: 9, order: 7, slug: 'claw-machine-first-win-third-try',
    standard: 'STAT.PROB.C.2', difficulty: 2,
    prompt: 'A claw machine grabs a prize on each try with probability $0.25$, independently. What is the probability that a player\'s FIRST win comes on exactly the $3$rd try? Round to four decimal places.',
    answerType: 'numeric', primaryAnswer: '0.1406', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'First win on try 3 means: miss, miss, then win. Multiply the three probabilities.' },
      { level: 'guide', text: 'The geometric formula: $P(Y = k) = (1-p)^{k-1} p$. Here $k = 3$, $p = 0.25$.' },
      { level: 'reveal', text: '$(0.75)^2(0.25) = 0.5625 \\times 0.25 = 0.140625 \\approx 0.1406$.' },
    ],
    explanation: ['The first success on the 3rd trial requires two failures followed by one success.', '$P(Y = 3) = (0.75)(0.75)(0.25)$.', '$0.5625 \\times 0.25 = 0.140625$, which rounds to $0.1406$.'],
    alternativeExplanations: [
      { title: 'Shrinking chances', steps: ['Win on try 1: $0.25$.', 'Win first on try 2: $0.75 \\times 0.25 = 0.1875$.', 'Win first on try 3: another factor of $0.75$: $0.1875 \\times 0.75 = 0.140625$. Each later try is $75\\%$ as likely as the one before.'] },
    ],
    tags: ['geometric', 'probability', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'STAT', num: 88, unit: 9, order: 8, slug: 'flights-at-least-one-delayed',
    standard: 'STAT.PROB.C.1', difficulty: 3,
    prompt: 'On a certain airline, $10\\%$ of flights are delayed, independently. A consultant takes $6$ flights this month. What is the probability that at least one of them is delayed? Round to three decimal places.',
    answerType: 'numeric', primaryAnswer: '0.469', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: '"At least one" is the opposite of "none". Find $P(\\text{none delayed})$ and subtract from $1$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with 2 flights: $P(\\text{none}) = 0.9^2 = 0.81$, so $P(\\text{at least one}) = 0.19$. Same method with 6 flights.' },
      { level: 'guide', text: '$P(X = 0) = (0.9)^6$. Then $P(X \\ge 1) = 1 - (0.9)^6$.' },
      { level: 'reveal', text: '$(0.9)^6 \\approx 0.5314$, so $1 - 0.5314 = 0.4686 \\approx 0.469$.' },
    ],
    explanation: ['$X$ = number of delayed flights is binomial with $n = 6$, $p = 0.1$.', 'The complement of "at least one delayed" is "zero delayed": $P(X = 0) = \\binom{6}{0}(0.1)^0(0.9)^6 = 0.9^6 \\approx 0.5314$.', '$P(X \\ge 1) = 1 - 0.5314 = 0.4686$, which rounds to $0.469$. Nearly a coin flip, even though each flight is only $10\\%$ likely to be delayed.'],
    alternativeExplanations: [
      { title: 'Why not add six 10%s?', steps: ['$6 \\times 0.10 = 0.60$ overcounts, because months with two or three delays get counted multiple times.', 'The complement avoids all that: the only way to have NO delay is all six on time, probability $0.9^6$.', 'Everything else — one delay, two, up to six — is the $1 - 0.9^6 \\approx 0.469$ we want.'] },
    ],
    tags: ['binomial', 'complement', 'at-least-one', 'word-problem'], estimatedSeconds: 75,
  },
  {
    domain: 'STAT', num: 89, unit: 9, order: 9, slug: 'dessert-at-most-one',
    standard: 'STAT.PROB.C.1', difficulty: 3,
    prompt: 'At a restaurant, $30\\%$ of customers order dessert, independently. Of the next $5$ customers, what is the probability that at most $1$ orders dessert? Round to three decimal places.',
    answerType: 'numeric', primaryAnswer: '0.528', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: '"At most 1" means $X = 0$ or $X = 1$. Find both binomial probabilities and add.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up with 2 customers: $P(0) = 0.7^2 = 0.49$ and $P(1) = 2(0.3)(0.7) = 0.42$, so $P(X \\le 1) = 0.91$. Same method with $n = 5$.' },
      { level: 'guide', text: '$P(X = 0) = (0.7)^5$ and $P(X = 1) = \\binom{5}{1}(0.3)(0.7)^4$.' },
      { level: 'reveal', text: '$0.7^5 \\approx 0.168$ and $5(0.3)(0.7^4) = 5(0.3)(0.2401) \\approx 0.360$. Sum $\\approx 0.528$.' },
    ],
    explanation: ['$X$ is binomial with $n = 5$, $p = 0.3$. "At most 1" is $P(X = 0) + P(X = 1)$.', '$P(X = 0) = 0.7^5 = 0.16807$. $P(X = 1) = 5 \\times 0.3 \\times 0.7^4 = 5 \\times 0.3 \\times 0.2401 = 0.36015$.', 'Total: $0.16807 + 0.36015 = 0.52822 \\approx 0.528$.'],
    alternativeExplanations: [
      { title: 'Count the arrangements', steps: ['Zero desserts: one arrangement (N N N N N), probability $0.7^5 = 0.16807$.', 'Exactly one dessert: the dessert customer could be any of 5 positions, each arrangement with probability $0.3 \\times 0.7^4 = 0.07203$; total $5 \\times 0.07203 = 0.36015$.', 'Add: $0.52822 \\approx 0.528$.'] },
    ],
    tags: ['binomial', 'cumulative-probability', 'word-problem'], estimatedSeconds: 80,
  },
  {
    domain: 'STAT', num: 90, unit: 9, order: 10, slug: 'barcode-more-than-three-scans',
    standard: 'STAT.PROB.C.2', difficulty: 3,
    prompt: 'A damaged barcode scans successfully on each attempt with probability $0.3$, independently. What is the probability that it takes MORE than $3$ attempts to get the first successful scan? Round to three decimal places.',
    answerType: 'numeric', primaryAnswer: '0.343', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: '"More than 3 attempts" means the first 3 attempts all failed. Nothing else needs to happen.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: "more than 1 attempt" just means the first attempt failed: probability $0.7$. "More than 2" means the first two failed: $0.7^2 = 0.49$. Keep going.' },
      { level: 'guide', text: 'For a geometric variable, $P(Y > k) = (1 - p)^k$. Use $k = 3$, $p = 0.3$.' },
      { level: 'reveal', text: '$(0.7)^3 = 0.343$.' },
    ],
    explanation: ['Let $Y$ be the attempt number of the first success; $Y$ is geometric with $p = 0.3$.', '$Y > 3$ happens exactly when attempts 1, 2 and 3 all fail: $P(Y > 3) = 0.7 \\times 0.7 \\times 0.7$.', '$0.7^3 = 0.343$.'],
    alternativeExplanations: [
      { title: 'Add up the first three and subtract', steps: ['$P(Y = 1) = 0.3$, $P(Y = 2) = 0.7(0.3) = 0.21$, $P(Y = 3) = 0.7^2(0.3) = 0.147$.', 'So $P(Y \\le 3) = 0.3 + 0.21 + 0.147 = 0.657$.', '$P(Y > 3) = 1 - 0.657 = 0.343$. Same answer, more work — the "all failures" shortcut is faster.'] },
    ],
    tags: ['geometric', 'probability', 'complement', 'word-problem'], estimatedSeconds: 70,
  },

  // ---------------- UNIT 10 — Sampling distributions and the Central Limit Theorem ----------------
  {
    domain: 'STAT', num: 91, unit: 10, order: 1, slug: 'mean-of-sample-means',
    standard: 'STAT.PROB.C.3', difficulty: 1,
    prompt: 'Adult men in a city have a mean height of $68$ inches. A researcher plans to take a random sample of $50$ men and compute the sample mean $\\bar{x}$. What is the mean of the sampling distribution of $\\bar{x}$, in inches?',
    answerType: 'numeric', primaryAnswer: '68', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'The sample mean is an unbiased estimator: on average it hits the population mean.' },
      { level: 'guide', text: '$\\mu_{\\bar{x}} = \\mu$, no matter the sample size.' },
      { level: 'reveal', text: 'The mean of the sampling distribution is $68$ inches.' },
    ],
    explanation: ['The sampling distribution of $\\bar{x}$ is the distribution of sample means over all possible samples of size 50.', 'Its center is the population mean: $\\mu_{\\bar{x}} = \\mu = 68$.', 'Sample size changes the SPREAD of sample means, not their center.'],
    alternativeExplanations: [
      { title: 'Why it is unbiased', steps: ['Some samples will have a mean above 68, some below, just by chance.', 'There is no reason for the sample means to lean one way, so they balance out at 68.', 'That balance point is the mean of the sampling distribution: 68 inches.'] },
    ],
    tags: ['sampling-distribution', 'sample-mean', 'word-problem'], estimatedSeconds: 30,
  },
  {
    domain: 'STAT', num: 92, unit: 10, order: 2, slug: 'sd-of-sample-mean',
    standard: 'STAT.PROB.C.3', difficulty: 1,
    prompt: 'Scores on a statewide test have standard deviation $\\sigma = 12$ points. For random samples of $n = 36$ students, what is the standard deviation of the sample mean $\\bar{x}$?',
    answerType: 'numeric', primaryAnswer: '2', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Averages vary less than individuals. The formula is $\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}}$.' },
      { level: 'guide', text: '$\\sqrt{36} = 6$. Divide $12$ by $6$.' },
      { level: 'reveal', text: '$\\sigma_{\\bar{x}} = \\frac{12}{\\sqrt{36}} = \\frac{12}{6} = 2$ points.' },
    ],
    explanation: ['The standard deviation of the sample mean is $\\sigma_{\\bar{x}} = \\sigma / \\sqrt{n}$.', '$\\sqrt{36} = 6$, so $\\sigma_{\\bar{x}} = 12 / 6 = 2$.', 'Sample means of 36 students typically fall within about 2 points of the population mean — much tighter than individual scores.'],
    alternativeExplanations: [
      { title: 'Why divide by the square root?', steps: ['The mean of 36 scores is their sum divided by 36. The sum of 36 independent scores has variance $36 \\sigma^2$.', 'Dividing by 36 divides the variance by $36^2$, leaving $\\sigma^2 / 36$.', 'Square-root: SD $= \\sigma / 6 = 2$.'] },
    ],
    tags: ['sampling-distribution', 'sample-mean', 'standard-deviation', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'STAT', num: 93, unit: 10, order: 3, slug: 'what-clt-says',
    standard: 'STAT.PROB.C.3', difficulty: 1,
    prompt: 'Which statement best describes the Central Limit Theorem?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'The sample mean always equals the population mean when $n$ is large.', correct: false },
      { id: 'B', label: 'For large $n$, the sampling distribution of $\\bar{x}$ is approximately normal, whatever the shape of the population.', correct: true },
      { id: 'C', label: 'Taking a large sample makes the population itself approximately normal.', correct: false },
      { id: 'D', label: 'The standard deviation of $\\bar{x}$ grows as $n$ grows.', correct: false },
    ],
    primaryAnswer: 'B', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'The CLT is about the SHAPE of the distribution of sample means, not about the population or any single sample.' },
      { level: 'guide', text: 'Rule out A (sample means still vary), C (the population does not change), and D (the SD of $\\bar{x}$ shrinks with $n$).' },
      { level: 'reveal', text: 'B: with a large enough sample, sample means are approximately normal even from a skewed population.' },
    ],
    explanation: ['The Central Limit Theorem says that as $n$ grows, the sampling distribution of $\\bar{x}$ becomes approximately normal, regardless of the population\'s shape.', 'A is false: $\\bar{x}$ gets close to $\\mu$ but still varies. C is false: the population is what it is. D is backwards: $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$ shrinks.', 'So B is the correct description.'],
    alternativeExplanations: [
      { title: 'Three different distributions', steps: ['Population distribution: all the individuals (any shape).', 'Distribution of one sample: looks roughly like the population.', 'Sampling distribution of $\\bar{x}$: the one the CLT is about — bell-shaped for large $n$ (a common rule: $n \\ge 30$).'] },
    ],
    tags: ['central-limit-theorem', 'sampling-distribution', 'interpretation'], estimatedSeconds: 45,
  },
  {
    domain: 'STAT', num: 94, unit: 10, order: 4, slug: 'sd-of-sample-proportion',
    standard: 'STAT.PROB.C.4', difficulty: 2,
    prompt: 'In a large city, $40\\%$ of voters support a ballot measure. A pollster takes a random sample of $100$ voters and records the sample proportion $\\hat{p}$ who support it. What is the standard deviation of the sampling distribution of $\\hat{p}$? Round to three decimal places.',
    answerType: 'numeric', primaryAnswer: '0.049', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'The formula is $\\sigma_{\\hat{p}} = \\sqrt{\\frac{p(1-p)}{n}}$.' },
      { level: 'guide', text: 'Compute $\\frac{0.4 \\times 0.6}{100} = 0.0024$, then square-root.' },
      { level: 'reveal', text: '$\\sqrt{0.0024} \\approx 0.049$.' },
    ],
    explanation: ['The sampling distribution of $\\hat{p}$ has mean $p = 0.4$ and standard deviation $\\sqrt{p(1-p)/n}$.', '$p(1-p)/n = (0.4)(0.6)/100 = 0.24/100 = 0.0024$.', '$\\sqrt{0.0024} \\approx 0.049$. Sample proportions typically land within about 5 percentage points of $0.40$.'],
    alternativeExplanations: [
      { title: 'Start from the count', steps: ['The count of supporters $X$ is binomial with SD $\\sqrt{100(0.4)(0.6)} = \\sqrt{24} \\approx 4.9$ voters.', '$\\hat{p} = X/100$, so divide that SD by 100.', '$4.9 / 100 = 0.049$.'] },
    ],
    tags: ['sampling-distribution', 'sample-proportion', 'standard-deviation', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'STAT', num: 95, unit: 10, order: 5, slug: 'large-counts-minimum-n',
    standard: 'STAT.PROB.C.4', difficulty: 2,
    prompt: 'A factory\'s defect rate is $p = 0.10$. An inspector wants the sampling distribution of $\\hat{p}$ to be approximately normal, which requires the Large Counts condition: $np \\ge 10$ and $n(1-p) \\ge 10$. What is the smallest sample size $n$ that satisfies both?',
    answerType: 'numeric', primaryAnswer: '100', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'With a small $p$, the harder condition to meet is $np \\ge 10$ — you need enough expected defects.' },
      { level: 'guide', text: 'Solve $0.10n \\ge 10$. Then check $n(0.90) \\ge 10$ too.' },
      { level: 'reveal', text: '$n \\ge 100$. At $n = 100$: $np = 10$ ✓ and $n(1-p) = 90$ ✓.' },
    ],
    explanation: ['Normal approximation for $\\hat{p}$ needs at least 10 expected successes and 10 expected failures.', '$np \\ge 10$ gives $0.1n \\ge 10$, so $n \\ge 100$. $n(1-p) \\ge 10$ gives $0.9n \\ge 10$, so $n \\ge 11.1$.', 'Both must hold, so the binding one is $n \\ge 100$. The smallest sample size is $100$.'],
    alternativeExplanations: [
      { title: 'Why the condition exists', steps: ['With $n = 50$, you expect only 5 defects; the count is piled up near 0 and skewed right, not bell-shaped.', 'With 10 or more expected defects, the distribution has room to spread out symmetrically.', 'Ten expected defects at a $10\\%$ rate means 100 items.'] },
    ],
    tags: ['sampling-distribution', 'sample-proportion', 'conditions', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'STAT', num: 96, unit: 10, order: 6, slug: 'z-score-of-sample-mean',
    standard: 'STAT.PROB.C.3', difficulty: 2,
    prompt: 'Scores on a college entrance exam have mean $500$ and standard deviation $100$. A random sample of $25$ students has sample mean $\\bar{x} = 530$. What is the $z$-score of this sample mean in the sampling distribution of $\\bar{x}$?',
    answerType: 'numeric', primaryAnswer: '1.5', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'Use the SD of the sample mean, $\\sigma/\\sqrt{n}$, not the SD of individual scores.' },
      { level: 'guide', text: '$\\sigma_{\\bar{x}} = 100/\\sqrt{25} = 20$. Then $z = \\frac{530 - 500}{20}$.' },
      { level: 'reveal', text: '$z = \\frac{30}{20} = 1.5$.' },
    ],
    explanation: ['The sampling distribution of $\\bar{x}$ has mean $500$ and SD $100/\\sqrt{25} = 100/5 = 20$.', '$z = \\frac{\\bar{x} - \\mu}{\\sigma_{\\bar{x}}} = \\frac{530 - 500}{20}$.', '$z = 1.5$. A sample mean of 530 is 1.5 standard deviations above what we expect.'],
    alternativeExplanations: [
      { title: 'Compare with one student', steps: ['For a single student scoring 530, $z = (530 - 500)/100 = 0.3$ — not unusual at all.', 'But a sample MEAN of 530 from 25 students is harder to get by chance, since averages vary less.', 'Using the smaller SD of 20 gives $z = 1.5$ — the same 30-point gap is 5 times more surprising for an average.'] },
    ],
    tags: ['sampling-distribution', 'sample-mean', 'z-score', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'STAT', num: 97, unit: 10, order: 7, slug: 'quadruple-n-halve-sd',
    standard: 'STAT.PROB.C.3', difficulty: 2,
    prompt: 'A quality engineer samples $n = 50$ bottles to estimate the mean fill volume. She wants to cut the standard deviation of $\\bar{x}$ in HALF. How many bottles should she sample instead?',
    answerType: 'numeric', primaryAnswer: '200', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: '$\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$ depends on the SQUARE ROOT of $n$.' },
      { level: 'guide', text: 'To halve $\\sigma/\\sqrt{n}$ you need $\\sqrt{n}$ to double, so $n$ must be multiplied by $4$.' },
      { level: 'reveal', text: '$4 \\times 50 = 200$ bottles.' },
    ],
    explanation: ['The SD of the sample mean is $\\sigma/\\sqrt{n}$.', 'Halving it requires doubling $\\sqrt{n}$; doubling a square root means quadrupling $n$.', 'New sample size: $4 \\times 50 = 200$ bottles. Precision is expensive — twice the precision costs four times the data.'],
    alternativeExplanations: [
      { title: 'Check with numbers', steps: ['Suppose $\\sigma = 10$ mL. With $n = 50$: $\\sigma_{\\bar{x}} = 10/\\sqrt{50} \\approx 1.41$.', 'With $n = 100$: $10/10 = 1.00$ — not yet half.', 'With $n = 200$: $10/\\sqrt{200} \\approx 0.71$, exactly half of $1.41$. ✓'] },
    ],
    tags: ['sampling-distribution', 'sample-size', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'STAT', num: 98, unit: 10, order: 8, slug: 'cereal-boxes-sample-mean-probability',
    standard: 'STAT.PROB.C.3', difficulty: 3,
    prompt: 'A cereal filling machine produces boxes whose weights are normally distributed with mean $16.1$ oz and standard deviation $0.3$ oz. A random sample of $9$ boxes is weighed. What is the probability that the sample mean is less than $16.0$ oz? Use $P(Z < -0.33) = 0.3707$, $P(Z < -1) = 0.1587$, $P(Z < -3) = 0.0013$. Round to four decimal places.',
    answerType: 'numeric', primaryAnswer: '0.1587', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'Standardize the SAMPLE MEAN. Its SD is $\\sigma/\\sqrt{n}$, which is smaller than $0.3$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: if $\\sigma = 2$ and $n = 4$, then $\\sigma_{\\bar{x}} = 2/\\sqrt{4} = 1$. Here do the same with $0.3$ and $9$.' },
      { level: 'guide', text: '$\\sigma_{\\bar{x}} = 0.3/\\sqrt{9} = 0.1$. Compute $z = \\frac{16.0 - 16.1}{0.1}$ and pick the matching table value.' },
      { level: 'reveal', text: '$z = -0.1/0.1 = -1$, so $P(\\bar{x} < 16.0) = P(Z < -1) = 0.1587$.' },
    ],
    explanation: ['Because the population is normal, $\\bar{x}$ is normal for any $n$, with mean $16.1$ and SD $0.3/\\sqrt{9} = 0.1$ oz.', '$z = \\frac{16.0 - 16.1}{0.1} = -1$.', '$P(Z < -1) = 0.1587$. About a $16\\%$ chance the 9-box average comes in under 16 oz.'],
    alternativeExplanations: [
      { title: 'Spot the decoys', steps: ['Using $\\sigma = 0.3$ (one box) gives $z = -0.33$ and $0.3707$ — that answers a different question: ONE box under 16 oz.', 'Dividing by $n = 9$ instead of $\\sqrt{9}$ gives SD $0.033$, $z = -3$ and $0.0013$ — too small.', 'The sample mean uses $\\sigma/\\sqrt{n} = 0.1$, giving $z = -1$ and $0.1587$.'] },
    ],
    tags: ['sampling-distribution', 'sample-mean', 'normal-probability', 'word-problem'], estimatedSeconds: 90,
  },
  {
    domain: 'STAT', num: 99, unit: 10, order: 9, slug: 'student-jobs-sample-proportion-probability',
    standard: 'STAT.PROB.C.4', difficulty: 3,
    prompt: 'Exactly $50\\%$ of the students at a large university have part-time jobs. A random sample of $400$ students is taken. What is the probability that the sample proportion with jobs is $0.55$ or higher? Use $P(Z \\ge 0.1) = 0.4602$, $P(Z \\ge 1) = 0.1587$, $P(Z \\ge 2) = 0.0228$. Round to four decimal places.',
    answerType: 'numeric', primaryAnswer: '0.0228', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'Find the SD of $\\hat{p}$ first: $\\sqrt{p(1-p)/n}$. Then standardize $0.55$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: with $p = 0.5$ and $n = 100$, $\\sigma_{\\hat{p}} = \\sqrt{0.25/100} = 0.05$. Here $n = 400$ makes it smaller.' },
      { level: 'guide', text: '$\\sigma_{\\hat{p}} = \\sqrt{0.25/400} = 0.025$. Compute $z = \\frac{0.55 - 0.50}{0.025}$.' },
      { level: 'reveal', text: '$z = 0.05/0.025 = 2$, so $P(\\hat{p} \\ge 0.55) = P(Z \\ge 2) = 0.0228$.' },
    ],
    explanation: ['Large Counts: $np = 200$ and $n(1-p) = 200$, both $\\ge 10$, so $\\hat{p}$ is approximately normal with mean $0.5$ and SD $\\sqrt{(0.5)(0.5)/400} = \\sqrt{0.000625} = 0.025$.', '$z = \\frac{0.55 - 0.50}{0.025} = 2$.', '$P(Z \\ge 2) = 0.0228$. A sample proportion of $0.55$ or more would happen only about $2\\%$ of the time.'],
    alternativeExplanations: [
      { title: 'Think in counts', steps: ['$\\hat{p} \\ge 0.55$ means at least $0.55 \\times 400 = 220$ students with jobs.', 'The count is binomial with mean $200$ and SD $\\sqrt{400(0.5)(0.5)} = 10$.', '$220$ is $2$ SDs above $200$, so $z = 2$ and the probability is $0.0228$.'] },
    ],
    tags: ['sampling-distribution', 'sample-proportion', 'normal-probability', 'word-problem'], estimatedSeconds: 90,
  },
  {
    domain: 'STAT', num: 100, unit: 10, order: 10, slug: 'skewed-incomes-sample-mean-shape',
    standard: 'STAT.PROB.C.3', difficulty: 3,
    prompt: 'Household incomes in a county are strongly right-skewed with mean $\\mu$ and standard deviation $\\sigma$. A researcher takes a random sample of $n = 50$ households. Which statement about the sampling distribution of the sample mean $\\bar{x}$ is correct?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'It is strongly right-skewed, like the population.', correct: false },
      { id: 'B', label: 'It is approximately normal with mean $\\mu$ and standard deviation $\\sigma/\\sqrt{50}$.', correct: true },
      { id: 'C', label: 'It is approximately normal with mean $\\mu$ and standard deviation $\\sigma$.', correct: false },
      { id: 'D', label: 'Its mean is less than $\\mu$ because the sample pulls toward the typical household.', correct: false },
    ],
    primaryAnswer: 'B', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Two separate facts: the CLT handles the SHAPE, and $\\sigma/\\sqrt{n}$ handles the SPREAD.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: from ANY population, $\\mu_{\\bar{x}} = \\mu$ and $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n}$ — that rules out two choices right away. Then ask what the CLT says about shape when $n = 50$.' },
      { level: 'guide', text: 'A sample of 50 is large enough ($n \\ge 30$) for the CLT to make $\\bar{x}$ approximately normal even from a skewed population. The SD must have $\\sqrt{n}$ in it.' },
      { level: 'reveal', text: 'B: approximately normal, centered at $\\mu$, with SD $\\sigma/\\sqrt{50}$.' },
    ],
    explanation: ['Center: $\\mu_{\\bar{x}} = \\mu$ always, so D is wrong — sample means are unbiased.', 'Spread: $\\sigma_{\\bar{x}} = \\sigma/\\sqrt{n} = \\sigma/\\sqrt{50}$, so C is wrong.', 'Shape: the population is skewed, but $n = 50 \\ge 30$, so by the Central Limit Theorem $\\bar{x}$ is approximately normal. A is wrong; B is correct.'],
    alternativeExplanations: [
      { title: 'What if n were small?', steps: ['With $n = 3$, the sampling distribution of $\\bar{x}$ would still be noticeably right-skewed — the CLT needs a decent sample size.', 'Even then, its mean would be $\\mu$ and its SD would be $\\sigma/\\sqrt{3}$.', 'At $n = 50$ the skew has mostly averaged out, giving choice B.'] },
    ],
    tags: ['central-limit-theorem', 'sampling-distribution', 'interpretation', 'word-problem'], estimatedSeconds: 70,
  },

  // ---------------- UNIT 11 — Confidence intervals for proportions and means ----------------
  {
    domain: 'STAT', num: 101, unit: 11, order: 1, slug: 'poll-interval-lower-bound',
    standard: 'STAT.INF.A.1', difficulty: 1,
    prompt: 'A poll finds that $62\\%$ of a random sample of adults support a new park, with a margin of error of $4$ percentage points at $95\\%$ confidence. What is the LOWER endpoint of the confidence interval, as a decimal?',
    answerType: 'numeric', primaryAnswer: '0.58', alternativeAnswers: ['58%'], acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'A confidence interval is point estimate $\\pm$ margin of error.' },
      { level: 'guide', text: 'Lower endpoint $= 0.62 - 0.04$.' },
      { level: 'reveal', text: '$0.62 - 0.04 = 0.58$. The interval is $(0.58, 0.66)$.' },
    ],
    explanation: ['The point estimate is $\\hat{p} = 0.62$ and the margin of error is $0.04$.', 'The interval runs from $0.62 - 0.04$ to $0.62 + 0.04$.', 'Lower endpoint: $0.58$. We are $95\\%$ confident the true proportion is between $0.58$ and $0.66$.'],
    alternativeExplanations: [
      { title: 'In percentage points', steps: ['The poll says $62\\%$, give or take 4 points.', '"Give" is $66\\%$; "take" is $58\\%$.', 'So the lower end is $58\\%$, or $0.58$.'] },
    ],
    tags: ['confidence-interval', 'margin-of-error', 'word-problem'], estimatedSeconds: 30,
  },
  {
    domain: 'STAT', num: 102, unit: 11, order: 2, slug: 'z-star-for-ninety-percent',
    standard: 'STAT.INF.A.1', difficulty: 1,
    prompt: 'Which critical value $z^*$ is used for a $90\\%$ confidence interval?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: '$1.282$', correct: false },
      { id: 'B', label: '$1.645$', correct: true },
      { id: 'C', label: '$1.960$', correct: false },
      { id: 'D', label: '$2.576$', correct: false },
    ],
    primaryAnswer: 'B', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'A $90\\%$ interval leaves $10\\%$ outside, split as $5\\%$ in each tail.' },
      { level: 'guide', text: '$z^*$ is the value with $5\\%$ of the standard normal curve above it. Recall: $1.96$ cuts off $2.5\\%$, $2.576$ cuts off $0.5\\%$.' },
      { level: 'reveal', text: '$z^* = 1.645$ for $90\\%$ confidence.' },
    ],
    explanation: ['For confidence level $C$, $z^*$ is the value such that the middle $C$ of the standard normal curve lies between $-z^*$ and $z^*$.', 'For $90\\%$, each tail has $5\\%$, and $P(Z > 1.645) = 0.05$.', 'So $z^* = 1.645$. The other values belong to $80\\%$ ($1.282$), $95\\%$ ($1.960$), and $99\\%$ ($2.576$).'],
    alternativeExplanations: [
      { title: 'Order them by confidence', steps: ['More confidence needs a wider interval, so a bigger $z^*$.', '$80\\% \\to 1.282$, $90\\% \\to 1.645$, $95\\% \\to 1.960$, $99\\% \\to 2.576$.', '$90\\%$ sits second: $1.645$.'] },
    ],
    tags: ['confidence-interval', 'critical-value'], estimatedSeconds: 30,
  },
  {
    domain: 'STAT', num: 103, unit: 11, order: 3, slug: 'standard-error-of-p-hat',
    standard: 'STAT.INF.A.1', difficulty: 1,
    prompt: 'In a random sample of $100$ shoppers, $50$ say they prefer paper bags, so $\\hat{p} = 0.50$. What is the standard error of $\\hat{p}$, $\\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}$?',
    answerType: 'numeric', primaryAnswer: '0.05', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'Plug $\\hat{p} = 0.5$ and $n = 100$ into the formula.' },
      { level: 'guide', text: '$\\frac{0.5 \\times 0.5}{100} = 0.0025$. Now square-root.' },
      { level: 'reveal', text: '$\\sqrt{0.0025} = 0.05$.' },
    ],
    explanation: ['The standard error estimates how much $\\hat{p}$ varies from sample to sample, using $\\hat{p}$ in place of the unknown $p$.', '$\\hat{p}(1-\\hat{p})/n = (0.5)(0.5)/100 = 0.0025$.', '$SE = \\sqrt{0.0025} = 0.05$, or 5 percentage points.'],
    alternativeExplanations: [
      { title: 'A handy benchmark', steps: ['With $\\hat{p} = 0.5$, the SE is $0.5/\\sqrt{n}$.', '$\\sqrt{100} = 10$, so $SE = 0.5/10 = 0.05$.', 'This is the largest SE possible for a given $n$; any other $\\hat{p}$ gives a smaller one.'] },
    ],
    tags: ['confidence-interval', 'standard-error', 'word-problem'], estimatedSeconds: 35,
  },
  {
    domain: 'STAT', num: 104, unit: 11, order: 4, slug: 'margin-of-error-proportion',
    standard: 'STAT.INF.A.1', difficulty: 2,
    prompt: 'In a random sample of $400$ commuters, $160$ say they bike to work at least once a week. For a $95\\%$ confidence interval for the true proportion, using $z^* = 1.96$, what is the margin of error? Round to three decimal places.',
    answerType: 'numeric', primaryAnswer: '0.048', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.002,
    hints: [
      { level: 'nudge', text: 'Margin of error $= z^* \\times SE$, where $SE = \\sqrt{\\hat{p}(1-\\hat{p})/n}$.' },
      { level: 'guide', text: '$\\hat{p} = 160/400 = 0.40$. $SE = \\sqrt{(0.4)(0.6)/400} = \\sqrt{0.0006} \\approx 0.0245$.' },
      { level: 'reveal', text: 'ME $= 1.96 \\times 0.0245 \\approx 0.048$.' },
    ],
    explanation: ['Sample proportion: $\\hat{p} = 160/400 = 0.40$.', 'Standard error: $\\sqrt{(0.4)(0.6)/400} = \\sqrt{0.0006} \\approx 0.0245$.', 'Margin of error: $1.96 \\times 0.0245 \\approx 0.048$. The interval is about $0.40 \\pm 0.048$, or $(0.352, 0.448)$.'],
    alternativeExplanations: [
      { title: 'Check the conditions first', steps: ['Random sample ✓. Successes $160 \\ge 10$ and failures $240 \\ge 10$ ✓. 400 is surely less than $10\\%$ of all commuters ✓.', 'With conditions met, the one-proportion $z$-interval applies: $\\hat{p} \\pm z^* \\sqrt{\\hat{p}(1-\\hat{p})/n}$.', 'The $\\pm$ part is $1.96 \\times 0.0245 \\approx 0.048$.'] },
    ],
    tags: ['confidence-interval', 'margin-of-error', 'proportion', 'word-problem'], estimatedSeconds: 70,
  },
  {
    domain: 'STAT', num: 105, unit: 11, order: 5, slug: 'commute-t-interval-margin',
    standard: 'STAT.INF.A.2', difficulty: 2,
    prompt: 'A random sample of $16$ employees has a mean commute of $\\bar{x} = 25.3$ minutes with standard deviation $s = 4.2$ minutes. Commute times are approximately normal. For a $95\\%$ confidence interval for the mean commute, use $t^* = 2.131$ (df $= 15$). What is the margin of error? Round to two decimal places.',
    answerType: 'numeric', primaryAnswer: '2.24', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'For a mean with unknown $\\sigma$, ME $= t^* \\cdot \\frac{s}{\\sqrt{n}}$.' },
      { level: 'guide', text: '$\\frac{s}{\\sqrt{n}} = \\frac{4.2}{\\sqrt{16}} = \\frac{4.2}{4} = 1.05$.' },
      { level: 'reveal', text: 'ME $= 2.131 \\times 1.05 \\approx 2.24$ minutes.' },
    ],
    explanation: ['Because the population SD is unknown, we use $s$ and a $t$ critical value with $n - 1 = 15$ degrees of freedom.', 'Standard error: $s/\\sqrt{n} = 4.2/4 = 1.05$.', 'Margin of error: $t^* \\times SE = 2.131 \\times 1.05 = 2.2376 \\approx 2.24$ minutes. The interval is roughly $25.3 \\pm 2.24$, or $(23.06, 27.54)$.'],
    alternativeExplanations: [
      { title: 'Why t and not z?', steps: ['If $\\sigma$ were known we would use $z^* = 1.96$, giving ME $\\approx 2.06$.', 'We only have $s$ from 16 people, so there is extra uncertainty; $t^* = 2.131$ is a little bigger to account for it.', 'ME $= 2.131 \\times 1.05 \\approx 2.24$ — wider than the $z$ version, which is the honest answer.'] },
    ],
    tags: ['confidence-interval', 't-interval', 'margin-of-error', 'word-problem'], estimatedSeconds: 60,
  },
  {
    domain: 'STAT', num: 106, unit: 11, order: 6, slug: 'interpret-ninety-five-percent-confidence',
    standard: 'STAT.INF.A.2', difficulty: 2,
    prompt: 'A $95\\%$ confidence interval for the mean weight of apples from an orchard is $(150, 162)$ grams. Which statement correctly interprets the confidence LEVEL of $95\\%$?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: '$95\\%$ of the apples in the orchard weigh between 150 and 162 grams.', correct: false },
      { id: 'B', label: 'There is a $95\\%$ probability that the true mean weight is between 150 and 162 grams.', correct: false },
      { id: 'C', label: 'If we took many random samples and built an interval from each, about $95\\%$ of those intervals would capture the true mean weight.', correct: true },
      { id: 'D', label: '$95\\%$ of sample means would fall between 150 and 162 grams.', correct: false },
    ],
    primaryAnswer: 'C', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'The confidence level describes the METHOD over many repetitions, not this one interval or individual apples.' },
      { level: 'guide', text: 'The true mean is a fixed number: it is either in $(150, 162)$ or it is not, so "95% probability" does not apply to this specific interval. And intervals are about the mean, not single apples.' },
      { level: 'reveal', text: 'C: in the long run, $95\\%$ of intervals made this way capture the true mean.' },
    ],
    explanation: ['A is about individual apples; a confidence interval says nothing about the spread of individuals.', 'B treats the true mean as random. It is fixed; the interval is what varies from sample to sample. D confuses the interval with the sampling distribution.', 'C is the textbook meaning: the method succeeds (captures $\\mu$) in about $95\\%$ of all possible samples.'],
    alternativeExplanations: [
      { title: 'Level vs. interval', steps: ['Interpreting the INTERVAL: "We are 95% confident the true mean apple weight is between 150 and 162 g."', 'Interpreting the LEVEL: "The method captures the true mean in 95% of samples."', 'The question asks about the level, so C.'] },
    ],
    tags: ['confidence-interval', 'interpretation', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'STAT', num: 107, unit: 11, order: 7, slug: 'sample-size-for-three-point-margin',
    standard: 'STAT.INF.A.1', difficulty: 2,
    prompt: 'A polling firm wants a $95\\%$ confidence interval for a proportion with margin of error at most $0.03$. Using $z^* = 1.96$ and the conservative guess $p^* = 0.5$, what is the smallest sample size that works?',
    answerType: 'numeric', primaryAnswer: '1068', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Set $z^* \\sqrt{\\frac{p^*(1-p^*)}{n}} \\le 0.03$ and solve for $n$.' },
      { level: 'guide', text: '$n \\ge \\left(\\frac{1.96}{0.03}\\right)^2 (0.5)(0.5)$. Compute, then round UP.' },
      { level: 'reveal', text: '$(65.33)^2 \\times 0.25 \\approx 1067.1$, so $n = 1068$.' },
    ],
    explanation: ['The margin of error is $z^* \\sqrt{p^*(1-p^*)/n}$. Requiring it to be at most $0.03$ gives $n \\ge p^*(1-p^*) (z^*/0.03)^2$.', '$(1.96/0.03)^2 = (65.33)^2 \\approx 4268.4$; times $0.25$ gives $\\approx 1067.1$.', 'Sample sizes are whole numbers and we need AT LEAST this much, so round up: $n = 1068$.'],
    alternativeExplanations: [
      { title: 'Why round up and why 0.5?', steps: ['$n = 1067$ gives ME slightly more than $0.03$ — fails. $1068$ is the first that works.', '$p^* = 0.5$ makes $p^*(1-p^*)$ as large as possible ($0.25$), so the sample is big enough no matter what the true $p$ turns out to be.', 'That is why national polls so often use "about 1,000 people": it buys a $\\pm 3\\%$ margin at $95\\%$.'] },
    ],
    tags: ['confidence-interval', 'sample-size', 'proportion', 'word-problem'], estimatedSeconds: 70,
  },
  {
    domain: 'STAT', num: 108, unit: 11, order: 8, slug: 'sleep-t-interval-upper-bound',
    standard: 'STAT.INF.A.2', difficulty: 3,
    prompt: 'A random sample of $36$ college students sleeps an average of $\\bar{x} = 7.5$ hours per night with standard deviation $s = 1.2$ hours. Construct a $95\\%$ confidence interval for the mean nightly sleep of all students at the college, using $t^* = 2.030$ (df $= 35$). What is the UPPER endpoint? Round to two decimal places.',
    answerType: 'numeric', primaryAnswer: '7.91', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'Interval $= \\bar{x} \\pm t^* \\cdot \\frac{s}{\\sqrt{n}}$. The upper endpoint uses the plus.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: $\\bar{x} = 10$, $s = 2$, $n = 4$, $t^* = 3$: SE $= 2/2 = 1$, ME $= 3$, upper endpoint $13$. Same three steps here.' },
      { level: 'guide', text: '$SE = 1.2/\\sqrt{36} = 0.2$. ME $= 2.030 \\times 0.2$. Add to $7.5$.' },
      { level: 'reveal', text: 'ME $= 0.406$, so the upper endpoint is $7.5 + 0.406 = 7.906 \\approx 7.91$ hours.' },
    ],
    explanation: ['Conditions: random sample ✓; $n = 36 \\ge 30$, so the $t$ procedure is safe even without a normal population ✓.', 'Standard error: $s/\\sqrt{n} = 1.2/6 = 0.2$. Margin of error: $2.030 \\times 0.2 = 0.406$.', 'Interval: $7.5 \\pm 0.406 = (7.094, 7.906)$. The upper endpoint is $7.91$ hours.'],
    alternativeExplanations: [
      { title: 'Say what it means', steps: ['We are $95\\%$ confident the true mean sleep for all students at this college is between $7.09$ and $7.91$ hours.', 'Notice the interval is about the MEAN, not about any individual student, many of whom sleep far outside this range.', 'The upper endpoint, $7.91$, is the most the average could plausibly be given this sample.'] },
    ],
    tags: ['confidence-interval', 't-interval', 'mean', 'word-problem'], estimatedSeconds: 80,
  },
  {
    domain: 'STAT', num: 109, unit: 11, order: 9, slug: 'quadruple-sample-halve-margin',
    standard: 'STAT.INF.A.1', difficulty: 3,
    prompt: 'A survey of $200$ customers gives a $95\\%$ confidence interval for a proportion with margin of error $0.06$. The manager wants a margin of error of $0.03$ at the same confidence level, and expects $\\hat{p}$ to stay about the same. About how many customers should the new survey include?',
    answerType: 'numeric', primaryAnswer: '800', acceptanceMode: 'normalized',
    hints: [
      { level: 'nudge', text: 'Margin of error is proportional to $\\frac{1}{\\sqrt{n}}$ — not $\\frac{1}{n}$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: going from $n = 100$ to $n = 400$ doubles $\\sqrt{n}$ from 10 to 20, so the margin of error halves. Multiply $n$ by 4 to halve the margin.' },
      { level: 'guide', text: 'Halving ME needs $\\sqrt{n}$ to double, so $n$ must be multiplied by $2^2 = 4$.' },
      { level: 'reveal', text: '$4 \\times 200 = 800$ customers.' },
    ],
    explanation: ['ME $= z^* \\sqrt{\\hat{p}(1-\\hat{p})/n}$. With $z^*$ and $\\hat{p}$ fixed, ME $\\propto 1/\\sqrt{n}$.', 'To cut ME from $0.06$ to $0.03$ (half), $\\sqrt{n}$ must double, so $n$ must quadruple.', 'New sample size: $4 \\times 200 = 800$. Doubling to 400 would only shrink the margin to about $0.042$.'],
    alternativeExplanations: [
      { title: 'Plug in the ratio', steps: ['$\\frac{\\text{ME}_{\\text{new}}}{\\text{ME}_{\\text{old}}} = \\sqrt{\\frac{n_{\\text{old}}}{n_{\\text{new}}}}$, so $\\frac{0.03}{0.06} = \\sqrt{\\frac{200}{n_{\\text{new}}}}$.', 'Square both sides: $\\frac{1}{4} = \\frac{200}{n_{\\text{new}}}$.', '$n_{\\text{new}} = 800$.'] },
    ],
    tags: ['confidence-interval', 'sample-size', 'margin-of-error', 'word-problem'], estimatedSeconds: 65,
  },
  {
    domain: 'STAT', num: 110, unit: 11, order: 10, slug: 'why-z-interval-fails-small-successes',
    standard: 'STAT.INF.A.1', difficulty: 3,
    prompt: 'A student surveys a random sample of $20$ classmates and finds that $6$ own a car. She wants a one-proportion $z$-interval for the proportion of all 2,000 students at the school who own a car. Which condition for the interval is NOT met?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'The sample was not selected at random.', correct: false },
      { id: 'B', label: 'The number of successes, $6$, is less than $10$ (Large Counts).', correct: true },
      { id: 'C', label: 'The sample is more than $10\\%$ of the population.', correct: false },
      { id: 'D', label: 'The sample proportion $0.30$ is too far from $0.50$.', correct: false },
    ],
    primaryAnswer: 'B', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'The three conditions: Random, $10\\%$ (sample $< 10\\%$ of population), and Large Counts ($n\\hat{p} \\ge 10$ and $n(1-\\hat{p}) \\ge 10$).' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: a random sample of 50 with 25 successes passes everything: random ✓, $50 < 200$ ✓, $25 \\ge 10$ and $25 \\ge 10$ ✓. Now test each condition with 20 and 6.' },
      { level: 'guide', text: 'Random ✓. $20 < 10\\%$ of 2,000 $= 200$ ✓. Successes: $6$. Failures: $14$. Are both at least 10?' },
      { level: 'reveal', text: 'Only $6$ successes — fewer than 10 — so Large Counts fails. Choice B.' },
    ],
    explanation: ['Random condition: the prompt says the sample is random, so A is not the problem.', '$10\\%$ condition: $20 \\le 0.10 \\times 2000 = 200$, fine, so C is not it. D is not a real condition — $\\hat{p}$ can be anything.', 'Large Counts: $n\\hat{p} = 6 < 10$. With so few successes the sampling distribution of $\\hat{p}$ is not close to normal, so the $z$-interval is not appropriate. B.'],
    alternativeExplanations: [
      { title: 'Why it matters', steps: ['The $z$-interval borrows the normal curve to set its margin of error.', 'With only 6 successes, the possible values of $\\hat{p}$ are lumpy and skewed, so the normal curve gives a misleading margin.', 'She needs a bigger sample — at least 34 students at this rate — before the normal-based interval is trustworthy.'] },
    ],
    tags: ['confidence-interval', 'conditions', 'proportion', 'word-problem'], estimatedSeconds: 70,
  },

  // ---------------- UNIT 12 — Significance tests: hypotheses, p-values and errors ----------------
  {
    domain: 'STAT', num: 111, unit: 12, order: 1, slug: 'state-hypotheses-blood-pressure',
    standard: 'STAT.INF.B.1', difficulty: 1,
    prompt: 'A clinic claims a new program lowers the mean systolic blood pressure of its patients below the current mean of $140$. Which pair of hypotheses is correct for testing this claim?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: '$H_0: \\mu = 140$, $H_a: \\mu < 140$', correct: true },
      { id: 'B', label: '$H_0: \\mu < 140$, $H_a: \\mu = 140$', correct: false },
      { id: 'C', label: '$H_0: \\bar{x} = 140$, $H_a: \\bar{x} < 140$', correct: false },
      { id: 'D', label: '$H_0: \\mu = 140$, $H_a: \\mu \\ne 140$', correct: false },
    ],
    primaryAnswer: 'A', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'The null hypothesis is the "no change" statement with an equals sign. The alternative carries the claim.' },
      { level: 'guide', text: 'Hypotheses are about the population parameter $\\mu$, never the sample statistic $\\bar{x}$. "Lowers" means a one-sided alternative.' },
      { level: 'reveal', text: '$H_0: \\mu = 140$ versus $H_a: \\mu < 140$. Choice A.' },
    ],
    explanation: ['$H_0$ always states equality: the program makes no difference, so $\\mu = 140$.', 'The claim "lowers" points in one direction, so $H_a: \\mu < 140$ (one-sided), not $\\ne$ as in D.', 'B puts the claim in the null; C uses the sample mean $\\bar{x}$, which we already know and never hypothesize about. A is correct.'],
    alternativeExplanations: [
      { title: 'Ask two questions', steps: ['Parameter or statistic? Always the parameter $\\mu$. That kills C.', 'Which way does the claim point? "Lower" means $<$. That kills D and picks the direction.', 'The null gets the equals sign, so A.'] },
    ],
    tags: ['significance-test', 'hypotheses', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'STAT', num: 112, unit: 12, order: 2, slug: 'p-value-decision-coffee',
    standard: 'STAT.INF.B.1', difficulty: 1,
    prompt: 'A coffee shop tests whether its new machine changes the mean fill of a "12 oz" cup. The test gives a $p$-value of $0.03$. Using a significance level of $\\alpha = 0.05$, what is the correct decision?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'Reject $H_0$; there is convincing evidence the mean fill is not 12 oz.', correct: true },
      { id: 'B', label: 'Fail to reject $H_0$; there is not convincing evidence of a change.', correct: false },
      { id: 'C', label: 'Accept $H_0$; the mean fill is exactly 12 oz.', correct: false },
      { id: 'D', label: 'The test proves the mean fill is 12.03 oz.', correct: false },
    ],
    primaryAnswer: 'A', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Compare the $p$-value to $\\alpha$. Small $p$-value means the data would be unlikely if $H_0$ were true.' },
      { level: 'guide', text: '$0.03 < 0.05$. When $p \\le \\alpha$, we reject $H_0$.' },
      { level: 'reveal', text: 'Reject $H_0$: there is convincing evidence the mean fill differs from 12 oz. Choice A.' },
    ],
    explanation: ['The $p$-value $0.03$ is the probability of a sample at least this extreme if the mean really were 12 oz.', 'Since $0.03 < \\alpha = 0.05$, such a result is rare under $H_0$, so we reject $H_0$.', 'We never "accept" $H_0$ (C), and a test never proves a specific value (D). A is correct.'],
    alternativeExplanations: [
      { title: 'The courtroom picture', steps: ['$H_0$ is "innocent": the machine fills 12 oz on average.', 'A $p$-value of $0.03$ means only a $3\\%$ chance of evidence this strong against an innocent machine.', 'That is below our $5\\%$ standard of doubt, so we convict: reject $H_0$.'] },
    ],
    tags: ['significance-test', 'p-value', 'decision', 'word-problem'], estimatedSeconds: 40,
  },
  {
    domain: 'STAT', num: 113, unit: 12, order: 3, slug: 'one-proportion-z-statistic',
    standard: 'STAT.INF.B.1', difficulty: 1,
    prompt: 'A company claims half of its customers are repeat buyers. In a random sample of $100$ customers, $56$ are repeat buyers. For the test of $H_0: p = 0.5$, what is the value of the test statistic $z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}}$?',
    answerType: 'numeric', primaryAnswer: '1.2', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: 'Use $p_0 = 0.5$ (the null value) in the standard deviation, not $\\hat{p}$.' },
      { level: 'guide', text: '$\\sqrt{0.5 \\times 0.5 / 100} = 0.05$. Then $z = \\frac{0.56 - 0.50}{0.05}$.' },
      { level: 'reveal', text: '$z = 0.06 / 0.05 = 1.2$.' },
    ],
    explanation: ['$\\hat{p} = 56/100 = 0.56$ and $p_0 = 0.5$.', 'Under $H_0$, the SD of $\\hat{p}$ is $\\sqrt{(0.5)(0.5)/100} = 0.05$.', '$z = (0.56 - 0.50)/0.05 = 1.2$: the sample proportion is 1.2 standard deviations above the claimed value.'],
    alternativeExplanations: [
      { title: 'In counts', steps: ['Under $H_0$, you expect 50 repeat buyers with SD $\\sqrt{100(0.5)(0.5)} = 5$.', 'You observed 56, which is 6 above 50.', '$6/5 = 1.2$ standard deviations — the same $z$.'] },
    ],
    tags: ['significance-test', 'z-test', 'proportion', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'STAT', num: 114, unit: 12, order: 4, slug: 'cereal-one-sample-t-statistic',
    standard: 'STAT.INF.B.2', difficulty: 2,
    prompt: 'A cereal box is labeled $10$ oz. A random sample of $64$ boxes has mean $\\bar{x} = 10.4$ oz and standard deviation $s = 1.6$ oz. For the test of $H_0: \\mu = 10$, what is the value of the $t$ statistic?',
    answerType: 'numeric', primaryAnswer: '2', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: '$t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$.' },
      { level: 'guide', text: '$s/\\sqrt{n} = 1.6/\\sqrt{64} = 1.6/8 = 0.2$.' },
      { level: 'reveal', text: '$t = \\frac{10.4 - 10}{0.2} = \\frac{0.4}{0.2} = 2$.' },
    ],
    explanation: ['The standard error of the mean is $s/\\sqrt{n} = 1.6/8 = 0.2$ oz.', 'The sample mean is $0.4$ oz above the labeled value.', '$t = 0.4/0.2 = 2$, with $n - 1 = 63$ degrees of freedom. The sample mean sits 2 standard errors above 10 oz.'],
    alternativeExplanations: [
      { title: 'Build it from the gap', steps: ['Gap between data and claim: $10.4 - 10 = 0.4$ oz.', 'Typical chance gap for a sample mean of 64 boxes: $0.2$ oz.', 'Observed gap is twice the typical gap, so $t = 2$.'] },
    ],
    tags: ['significance-test', 't-test', 'mean', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'STAT', num: 115, unit: 12, order: 5, slug: 'two-sided-p-value-from-z',
    standard: 'STAT.INF.B.1', difficulty: 2,
    prompt: 'A two-sided test of $H_0: p = 0.4$ versus $H_a: p \\ne 0.4$ produces a test statistic of $z = 2.0$. Given that $P(Z > 2.0) = 0.0228$, what is the $p$-value? Round to four decimal places.',
    answerType: 'numeric', primaryAnswer: '0.0456', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.001,
    hints: [
      { level: 'nudge', text: 'A two-sided alternative counts BOTH tails: results as extreme as $2.0$ in either direction.' },
      { level: 'guide', text: '$p\\text{-value} = P(Z > 2.0) + P(Z < -2.0)$, and the normal curve is symmetric.' },
      { level: 'reveal', text: '$2 \\times 0.0228 = 0.0456$.' },
    ],
    explanation: ['The $p$-value is the probability, assuming $H_0$, of a statistic at least as extreme as the one observed.', 'For $H_a: p \\ne 0.4$, "as extreme" means $|z| \\ge 2.0$ — the upper tail AND the lower tail.', 'By symmetry each tail is $0.0228$, so the $p$-value is $0.0456$. At $\\alpha = 0.05$ this would lead to rejecting $H_0$.'],
    alternativeExplanations: [
      { title: 'One-sided vs two-sided', steps: ['If the alternative had been $p > 0.4$, the $p$-value would be just the upper tail: $0.0228$.', 'The $\\ne$ alternative was chosen BEFORE seeing the data, so it must pay for both directions.', 'Doubling gives $0.0456$ — twice as hard to reach significance.'] },
    ],
    tags: ['significance-test', 'p-value', 'two-sided', 'word-problem'], estimatedSeconds: 45,
  },
  {
    domain: 'STAT', num: 116, unit: 12, order: 6, slug: 'type-one-error-fertilizer',
    standard: 'STAT.INF.B.2', difficulty: 2,
    prompt: 'A farmer tests $H_0$: the new fertilizer does not change mean yield, against $H_a$: the new fertilizer increases mean yield. Which describes a Type I error in this context?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'Concluding the fertilizer increases yield when it really does not.', correct: true },
      { id: 'B', label: 'Concluding the fertilizer does not increase yield when it really does.', correct: false },
      { id: 'C', label: 'Using a sample that is too small to detect any change.', correct: false },
      { id: 'D', label: 'Correctly concluding the fertilizer increases yield.', correct: false },
    ],
    primaryAnswer: 'A', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Type I error: rejecting $H_0$ when $H_0$ is actually true — a "false alarm".' },
      { level: 'guide', text: 'Rejecting $H_0$ here means declaring the fertilizer works. A Type I error is doing that when it does not.' },
      { level: 'reveal', text: 'A: the farmer concludes the fertilizer increases yield, but in reality it does not.' },
    ],
    explanation: ['A Type I error happens when $H_0$ is true but we reject it. Here $H_0$ true means the fertilizer does nothing.', 'Rejecting $H_0$ means concluding the fertilizer increases yield. Doing so when it does not is the Type I error: choice A.', 'B is a Type II error (missing a real effect). C is a design weakness, not an error type. D is a correct decision.'],
    alternativeExplanations: [
      { title: 'False alarm vs. missed alarm', steps: ['Type I = false alarm: we shout "it works!" and it does not. The farmer buys useless fertilizer.', 'Type II = missed alarm: it works, but we say "no evidence." The farmer misses a real gain.', 'The question asks for the false alarm: A.'] },
    ],
    tags: ['significance-test', 'type-i-error', 'interpretation', 'word-problem'], estimatedSeconds: 50,
  },
  {
    domain: 'STAT', num: 117, unit: 12, order: 7, slug: 'what-increases-power',
    standard: 'STAT.INF.B.2', difficulty: 2,
    prompt: 'A school district will test whether a tutoring program raises mean math scores. The researchers want to increase the POWER of the test — the probability of detecting a real improvement. Which change does that?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'Increase the sample size.', correct: true },
      { id: 'B', label: 'Lower the significance level from $0.05$ to $0.01$.', correct: false },
      { id: 'C', label: 'Hope the true improvement is smaller than expected.', correct: false },
      { id: 'D', label: 'Switch from a one-sided to a two-sided alternative.', correct: false },
    ],
    primaryAnswer: 'A', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Power $= 1 - P(\\text{Type II error})$. Anything that makes a real effect easier to spot raises power.' },
      { level: 'guide', text: 'More data shrinks the standard error. A smaller $\\alpha$ makes rejecting harder. A smaller true effect is harder to see. A two-sided test splits $\\alpha$ across two tails.' },
      { level: 'reveal', text: 'Only A raises power.' },
    ],
    explanation: ['Power rises with sample size: a bigger $n$ makes $s/\\sqrt{n}$ smaller, so a real improvement produces a larger test statistic.', 'B lowers power — a stricter $\\alpha$ means fewer rejections, including correct ones. C lowers power — small effects hide in the noise. D lowers power for detecting an increase, since the rejection region in the "increase" tail shrinks.', 'A is the one change that helps.'],
    alternativeExplanations: [
      { title: 'The three levers', steps: ['Power goes UP with: larger $n$, larger $\\alpha$, larger true effect size.', 'B moves $\\alpha$ the wrong way; C moves the effect the wrong way; D is effectively a smaller $\\alpha$ in the direction that matters.', 'A moves $n$ the right way.'] },
    ],
    tags: ['significance-test', 'power', 'type-ii-error', 'word-problem'], estimatedSeconds: 55,
  },
  {
    domain: 'STAT', num: 118, unit: 12, order: 8, slug: 'recycling-proportion-z-test',
    standard: 'STAT.INF.B.1', difficulty: 3,
    prompt: 'Last year $30\\%$ of a town\'s households recycled. After a campaign, a random sample of $200$ households finds $72$ recycling. For the test of $H_0: p = 0.30$ versus $H_a: p > 0.30$, what is the value of the test statistic $z$? Round to two decimal places.',
    answerType: 'numeric', primaryAnswer: '1.85', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.02,
    hints: [
      { level: 'nudge', text: 'First find $\\hat{p}$. Then $z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}}$, using the NULL value $p_0 = 0.30$ in the denominator.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: $p_0 = 0.5$, $n = 100$, $\\hat{p} = 0.6$: $SD = \\sqrt{0.25/100} = 0.05$, $z = 0.1/0.05 = 2$. Same recipe with $0.30$, $200$ and $72/200$.' },
      { level: 'guide', text: '$\\hat{p} = 72/200 = 0.36$. $\\sqrt{(0.3)(0.7)/200} = \\sqrt{0.00105} \\approx 0.0324$.' },
      { level: 'reveal', text: '$z = \\frac{0.36 - 0.30}{0.0324} \\approx 1.85$.' },
    ],
    explanation: ['Sample proportion: $\\hat{p} = 72/200 = 0.36$.', 'Under $H_0$, the SD of $\\hat{p}$ is $\\sqrt{p_0(1-p_0)/n} = \\sqrt{(0.30)(0.70)/200} = \\sqrt{0.00105} \\approx 0.0324$.', '$z = (0.36 - 0.30)/0.0324 \\approx 1.85$. (For this one-sided test the $p$-value is about $0.032$, so at $\\alpha = 0.05$ there is convincing evidence recycling increased.)'],
    alternativeExplanations: [
      { title: 'Why p₀, not p̂, in the denominator', steps: ['A significance test asks: IF $p = 0.30$, how surprising is $\\hat{p} = 0.36$?', 'So the spread must be computed under that assumption, with $0.30$: $SD \\approx 0.0324$.', '(A confidence interval, which makes no assumption about $p$, would use $\\hat{p}$ instead.) $z \\approx 1.85$.'] },
    ],
    tags: ['significance-test', 'z-test', 'proportion', 'multi-step', 'word-problem'], estimatedSeconds: 85,
  },
  {
    domain: 'STAT', num: 119, unit: 12, order: 9, slug: 'p-value-range-from-t-table',
    standard: 'STAT.INF.B.2', difficulty: 3,
    prompt: 'A two-sided one-sample $t$-test of a battery company\'s claimed mean lifetime gives $t = 2.45$ with df $= 24$. A $t$-table row for df $= 24$ shows that $t = 2.064$ has upper-tail area $0.025$ and $t = 2.492$ has upper-tail area $0.01$. Which range contains the $p$-value?',
    answerType: 'multiple-choice',
    choices: [
      { id: 'A', label: 'Between $0.01$ and $0.025$', correct: false },
      { id: 'B', label: 'Between $0.02$ and $0.05$', correct: true },
      { id: 'C', label: 'Between $0.05$ and $0.10$', correct: false },
      { id: 'D', label: 'Less than $0.01$', correct: false },
    ],
    primaryAnswer: 'B', acceptanceMode: 'exact',
    hints: [
      { level: 'nudge', text: 'Place $2.45$ between the two table values to trap the ONE-tail area. Then remember the test is two-sided.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: if a one-sided test had $t = 2.45$, the upper-tail area would be between $0.01$ and $0.025$, since $2.064 < 2.45 < 2.492$. Now double it.' },
      { level: 'guide', text: 'One tail: between $0.01$ and $0.025$. Two-sided $p$-value doubles both ends.' },
      { level: 'reveal', text: '$2(0.01) = 0.02$ and $2(0.025) = 0.05$: the $p$-value is between $0.02$ and $0.05$. Choice B.' },
    ],
    explanation: ['Since $2.064 < 2.45 < 2.492$, the area above $t = 2.45$ is between $0.01$ and $0.025$.', 'A two-sided alternative counts both tails, so double: between $0.02$ and $0.05$.', 'A gives the one-sided range — the classic slip. The answer is B. At $\\alpha = 0.05$, reject $H_0$; at $\\alpha = 0.01$, do not.'],
    alternativeExplanations: [
      { title: 'Read the table as brackets', steps: ['Tables give a few landmark $t$ values per row; your statistic lands between two of them.', 'Bigger $t$ means smaller tail area, so $2.45$ (between the landmarks) has tail area between their areas: $0.01$ to $0.025$.', 'Two-sided: $0.02$ to $0.05$. A calculator would give $p \\approx 0.022$, inside that range.'] },
    ],
    tags: ['significance-test', 't-test', 'p-value', 'two-sided', 'word-problem'], estimatedSeconds: 75,
  },
  {
    domain: 'STAT', num: 120, unit: 12, order: 10, slug: 'body-temperature-t-statistic',
    standard: 'STAT.INF.B.2', difficulty: 3,
    prompt: 'Textbooks say normal human body temperature is $98.6^\\circ$F. A random sample of $49$ healthy adults has mean $\\bar{x} = 98.2^\\circ$F and standard deviation $s = 0.7^\\circ$F. For the test of $H_0: \\mu = 98.6$ versus $H_a: \\mu \\ne 98.6$, what is the value of the $t$ statistic?',
    answerType: 'numeric', primaryAnswer: '-4', acceptanceMode: 'numeric-tolerance', numericTolerance: 0.01,
    hints: [
      { level: 'nudge', text: '$t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}}$. Keep the sign — a sample mean below $\\mu_0$ gives a negative $t$.' },
      { level: 'nudge', title: '🪜 Try a simpler one', text: 'Warm up: $\\bar{x} = 9$, $\\mu_0 = 10$, $s = 2$, $n = 4$: $SE = 1$, $t = (9 - 10)/1 = -1$. Same steps here.' },
      { level: 'guide', text: '$SE = 0.7/\\sqrt{49} = 0.7/7 = 0.1$. Then $t = (98.2 - 98.6)/0.1$.' },
      { level: 'reveal', text: '$t = -0.4/0.1 = -4$.' },
    ],
    explanation: ['Standard error: $s/\\sqrt{n} = 0.7/7 = 0.1$ degrees.', 'Difference: $\\bar{x} - \\mu_0 = 98.2 - 98.6 = -0.4$.', '$t = -0.4/0.1 = -4$, with df $= 48$. A sample mean 4 standard errors below 98.6 is extremely unlikely if $H_0$ is true ($p$-value well under $0.001$), so there is convincing evidence the true mean is not $98.6^\\circ$F.'],
    alternativeExplanations: [
      { title: 'Why the sign matters', steps: ['$|t| = 4$ sets how surprising the result is; the sign says WHICH way the data lean.', 'Negative $t$: the sample mean is below the hypothesized $98.6$.', 'For the two-sided test the $p$-value uses both tails, but you still report $t = -4$ so a reader knows body temperatures came out lower.'] },
    ],
    tags: ['significance-test', 't-test', 'mean', 'word-problem'], estimatedSeconds: 70,
  },
