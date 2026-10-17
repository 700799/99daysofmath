import type { Lesson } from '../lessons';

// AP Statistics, units 8-14: random variables, binomial and geometric
// distributions, sampling distributions, confidence intervals, significance
// tests, two-sample and chi-square tests, and inference for regression.

export const STAT_LESSONS_U08_14: Lesson[] = [
  // ---------------- STAT Unit 8 — Random variables, expected value and variance ----------------
  {
    domain: 'STAT', unit: 8, title: 'Random variables, expected value and variance',
    objective: 'Find the mean and spread of a random variable, and combine random variables.',
    concept: [
      'A RANDOM VARIABLE X turns each outcome of a chance process into a number. A DISCRETE one has a table of values and probabilities, and the probabilities add to exactly 1.',
      'The EXPECTED VALUE μ = Σ x·P(x) is the long-run average: multiply every value by its probability and add. It does not have to be a value X can actually take.',
      'The VARIANCE σ² = Σ (x − μ)²·P(x) measures spread; the STANDARD DEVIATION σ is its square root and has the same units as X.',
      'LINEAR CHANGE: if Y = a + bX, then μ_Y = a + bμ_X and σ_Y = |b|·σ_X. Adding a constant shifts the mean but never changes the spread.',
      'COMBINING: for X + Y the means ADD; for X − Y the means SUBTRACT. If X and Y are INDEPENDENT, the variances ALWAYS add (for both sum and difference) — standard deviations never add.',
    ],
    examples: [
      { q: 'A fair four-sided die shows 1, 2, 3 or 4. Find the expected value of the roll X.', steps: ['Each value has probability 1/4.', 'μ = 1(1/4) + 2(1/4) + 3(1/4) + 4(1/4) = 10/4.', 'μ = 2.5 — not a face on the die, but the long-run average.'], answer: '2.5' },
      { q: 'For the same four-sided die, find the variance and standard deviation of X.', steps: ['Deviations from 2.5: −1.5, −0.5, 0.5, 1.5. Squared: 2.25, 0.25, 0.25, 2.25.', 'σ² = (2.25 + 0.25 + 0.25 + 2.25)/4 = 5/4 = 1.25.', 'σ = √1.25 ≈ 1.12.'], answer: 'σ² = 1.25, σ ≈ 1.12' },
      { q: 'A raffle sells 100 tickets at $2 each and one ticket wins $100. Let X be your net gain from one ticket. Find E(X).', steps: ['Win (prob 0.01): gain 100 − 2 = $98. Lose (prob 0.99): gain −$2.', 'E(X) = 98(0.01) + (−2)(0.99) = 0.98 − 1.98.', 'E(X) = −$1.00: you lose a dollar per ticket on average.'], answer: '−$1.00' },
      { q: 'Cars per household: X = 0, 1, 2, 3 with probabilities 0.10, 0.40, 0.35, 0.15. Find μ and σ.', steps: ['μ = 0(0.10) + 1(0.40) + 2(0.35) + 3(0.15) = 0 + 0.40 + 0.70 + 0.45 = 1.55.', 'σ² = (0 − 1.55)²(0.10) + (1 − 1.55)²(0.40) + (2 − 1.55)²(0.35) + (3 − 1.55)²(0.15) = 0.2403 + 0.1210 + 0.0709 + 0.3154 = 0.7475.', 'σ = √0.7475 ≈ 0.865 cars.'], answer: 'μ = 1.55, σ ≈ 0.865' },
      { q: 'A taxi ride of X miles has mean 6 and SD 2 miles. The fare is F = 3 + 2.5X dollars. Find the mean and SD of F.', steps: ['Mean: μ_F = 3 + 2.5(6) = 3 + 15 = $18.', 'SD: the +3 does nothing to spread; σ_F = 2.5(2) = $5.', 'Mean $18, SD $5.'], answer: 'μ = $18, σ = $5' },
      { q: 'A café sells X coffees in the morning (mean 40, SD 6) and Y in the afternoon (mean 50, SD 8), independently. Find the mean and SD of the daily total T = X + Y.', steps: ['Means add: μ_T = 40 + 50 = 90.', 'Variances add: σ_T² = 6² + 8² = 36 + 64 = 100.', 'σ_T = √100 = 10 coffees (NOT 6 + 8 = 14).'], answer: 'μ = 90, σ = 10' },
    ],
    practice: [
      { q: 'X takes the values 0, 1, 2 with probabilities 0.2, 0.5, 0.3. What is E(X)?', answers: ['1.1'], steps: ['μ = 0(0.2) + 1(0.5) + 2(0.3).', '= 0 + 0.5 + 0.6 = 1.1.'] },
      { q: 'X has standard deviation 3. What is the standard deviation of Y = 10 + 4X?', answers: ['12'], steps: ['Adding 10 does not change spread.', 'Multiplying by 4 multiplies the SD by 4: 4 × 3 = 12.'] },
      { q: 'X and Y are independent with σ_X = 3 and σ_Y = 4. What is the standard deviation of X + Y?', answers: ['5'], steps: ['Variances add: 9 + 16 = 25.', 'σ = √25 = 5.'] },
      { q: 'A game costs $1 to play. With probability 1/10 you win $5 (and keep nothing else). What is your expected net gain, in dollars?', answers: ['-0.5', '−0.5', '-0.50', '−0.50', '-$0.50'], steps: ['Win: net 5 − 1 = 4 with prob 0.1. Lose: net −1 with prob 0.9.', 'E = 4(0.1) + (−1)(0.9) = 0.4 − 0.9 = −0.5.', 'You lose 50 cents per play on average.'] },
    ],
    watchOut: 'Standard deviations NEVER add. Square them to variances, add the variances (even for X − Y), then take the square root — and only when X and Y are independent.',
  },

  // ---------------- STAT Unit 9 — Binomial and geometric distributions ----------------
  {
    domain: 'STAT', unit: 9, title: 'Binomial and geometric distributions',
    objective: 'Recognize binomial and geometric settings and compute their probabilities.',
    concept: [
      'A BINOMIAL setting has four conditions, BINS: Binary outcomes (success/failure), Independent trials, a fixed Number of trials n, and the Same probability p each time. X counts the successes.',
      'P(X = k) = C(n, k)·p^k·(1 − p)^(n − k): C(n, k) counts the orderings, p^k the successes, (1 − p)^(n − k) the failures.',
      'A binomial X has mean μ = np and standard deviation σ = √(np(1 − p)).',
      'A GEOMETRIC variable Y counts the trials UNTIL the first success: P(Y = k) = (1 − p)^(k − 1)·p, and its mean is 1/p.',
      'Sampling without replacement is "close enough" to independent when the sample is under 10% of the population (the 10% condition). "At least one" is best done as 1 − P(none).',
    ],
    examples: [
      { q: 'Flip a fair coin 4 times. What is the probability of exactly 2 heads?', steps: ['n = 4, p = 0.5, k = 2.', 'C(4, 2) = 6 orderings, each with probability (0.5)²(0.5)² = 1/16.', 'P(X = 2) = 6/16 = 0.375.'], answer: '0.375' },
      { q: 'A basketball player makes 80% of free throws. In 5 shots, what is the probability she makes exactly 4?', steps: ['n = 5, p = 0.8, k = 4: C(5, 4) = 5.', 'P = 5 × (0.8)⁴ × (0.2)¹ = 5 × 0.4096 × 0.2.', 'P(X = 4) = 0.4096 ≈ 0.410.'], answer: '0.4096' },
      { q: 'Same player, 5 shots. What is the probability she makes at least 4?', steps: ['At least 4 means X = 4 or X = 5.', 'P(X = 5) = (0.8)⁵ = 0.32768.', 'P(X ≥ 4) = 0.4096 + 0.32768 = 0.73728 ≈ 0.737.'], answer: '0.737' },
      { q: 'A factory line has a 10% defect rate. In a batch of 50 parts, find the mean and SD of the number of defective parts.', steps: ['μ = np = 50 × 0.1 = 5 defective parts.', 'σ² = np(1 − p) = 50 × 0.1 × 0.9 = 4.5.', 'σ = √4.5 ≈ 2.12.'], answer: 'μ = 5, σ ≈ 2.12' },
      { q: 'Roll a fair die until you get a 6. What is the probability the first 6 comes on the 3rd roll, and how many rolls do you expect to need?', steps: ['Geometric with p = 1/6: two failures then a success.', 'P(Y = 3) = (5/6)²(1/6) = 25/216 ≈ 0.116.', 'Expected rolls = 1/p = 6.'], answer: '25/216 ≈ 0.116; mean 6 rolls' },
      { q: 'A spam filter misses 20% of spam. Of 3 spam emails, what is the probability at least one gets through?', steps: ['"At least one" → use the complement: 1 − P(none get through).', 'P(none) = (0.8)³ = 0.512.', 'P(at least one) = 1 − 0.512 = 0.488.'], answer: '0.488' },
    ],
    practice: [
      { q: 'Flip a fair coin 3 times. What is P(all 3 are heads)?', answers: ['0.125', '1/8'], steps: ['n = 3, p = 0.5, k = 3: C(3, 3) = 1.', 'P = (0.5)³ = 0.125.'] },
      { q: 'A binomial variable has n = 100 and p = 0.2. What is its mean?', answers: ['20'], steps: ['μ = np.', '100 × 0.2 = 20.'] },
      { q: 'Each lottery scratch card wins with probability 0.25. On average, how many cards until your first win?', answers: ['4'], steps: ['Geometric mean = 1/p.', '1/0.25 = 4 cards.'] },
      { q: 'Flip a fair coin 6 times. What is P(exactly 2 heads)? Give it as a fraction or decimal.', answers: ['15/64', '0.234', '0.2344', '0.234375'], steps: ['C(6, 2) = 15 orderings.', 'Each has probability (0.5)⁶ = 1/64.', 'P = 15/64 ≈ 0.234.'] },
    ],
    watchOut: 'Binomial counts SUCCESSES in a fixed number of trials; geometric counts TRIALS until the first success. And "at least one" is 1 − P(none) — do not add up every case by hand.',
  },

  // ---------------- STAT Unit 10 — Sampling distributions and the Central Limit Theorem ----------------
  {
    domain: 'STAT', unit: 10, title: 'Sampling distributions and the Central Limit Theorem',
    objective: 'Describe how a sample statistic varies from sample to sample.',
    concept: [
      'A PARAMETER (p, μ) describes the population and is fixed but unknown. A STATISTIC (p̂, x̄) describes one sample and changes from sample to sample.',
      'The SAMPLING DISTRIBUTION of a statistic is the distribution of its values over ALL possible samples of size n. Its centre, spread and shape are what inference runs on.',
      'Sample proportion: p̂ has mean p and SD √(p(1 − p)/n). It is approximately normal when np ≥ 10 and n(1 − p) ≥ 10 (the Large Counts condition).',
      'Sample mean: x̄ has mean μ and SD σ/√n. If the population is normal, x̄ is normal for ANY n.',
      'The CENTRAL LIMIT THEOREM: for a large sample (n ≥ 30 is the usual rule), x̄ is approximately normal NO MATTER what shape the population has. Both statistics are UNBIASED, and their spread shrinks with √n — quadruple n to halve the SD.',
    ],
    examples: [
      { q: 'In a city, 60% of adults own a bike (p = 0.6). For random samples of 100 adults, describe the sampling distribution of p̂.', steps: ['Mean: μ_p̂ = p = 0.6.', 'SD: √(0.6 × 0.4 / 100) = √0.0024 ≈ 0.049.', 'np = 60 and n(1 − p) = 40 are both ≥ 10, so the shape is approximately normal.'], answer: 'approx. normal, mean 0.6, SD ≈ 0.049' },
      { q: 'Exam scores have μ = 70 and σ = 12. For samples of 36 students, what is the SD of the sample mean x̄?', steps: ['σ_x̄ = σ/√n.', '12/√36 = 12/6.', 'σ_x̄ = 2 points.'], answer: '2' },
      { q: 'Same exam (μ = 70, σ = 12, n = 36). What is the probability a random sample of 36 has a mean above 73?', steps: ['n = 36 ≥ 30, so by the CLT x̄ is approximately normal with mean 70 and SD 2.', 'z = (73 − 70)/2 = 1.5.', 'P(Z > 1.5) = 1 − 0.9332 = 0.0668.'], answer: '0.0668' },
      { q: 'Back to the bikes (p = 0.6, n = 100). What is the probability a sample shows p̂ ≥ 0.65?', steps: ['SD of p̂ ≈ 0.049.', 'z = (0.65 − 0.60)/0.049 ≈ 1.02.', 'P(Z > 1.02) = 1 − 0.8461 = 0.1539 ≈ 0.154.'], answer: '≈ 0.154' },
      { q: 'With n = 36 the SD of x̄ was 2. How many students would you need to sample to cut that SD to 1?', steps: ['SD = σ/√n, so halving the SD means doubling √n.', 'Doubling √n means quadrupling n.', 'n = 4 × 36 = 144 students.'], answer: '144' },
      { q: 'Waiting times at a clinic are strongly right-skewed with μ = 4 minutes and σ = 3 minutes. For 50 random patients, what is P(x̄ > 5)?', steps: ['The population is skewed, but n = 50 ≥ 30, so the CLT makes x̄ approximately normal.', 'Mean 4, SD = 3/√50 ≈ 0.424.', 'z = (5 − 4)/0.424 ≈ 2.36, and P(Z > 2.36) ≈ 0.009.'], answer: '≈ 0.009' },
    ],
    practice: [
      { q: 'A population has σ = 20. What is the standard deviation of x̄ for samples of size 25?', answers: ['4'], steps: ['σ/√n = 20/√25.', '20/5 = 4.'] },
      { q: 'p = 0.5 and n = 100. What is the standard deviation of p̂?', answers: ['0.05'], steps: ['√(0.5 × 0.5 / 100) = √0.0025.', '= 0.05.'] },
      { q: 'IQ scores are normal with μ = 100, σ = 15. For a random sample of 9 people, what is P(x̄ > 110)?', answers: ['0.0228', '0.023', '0.02'], steps: ['σ_x̄ = 15/√9 = 5.', 'z = (110 − 100)/5 = 2.', 'P(Z > 2) = 0.0228.'] },
      { q: 'A sample of 20 gives x̄ a certain SD. What sample size would cut that SD in half?', answers: ['80'], steps: ['SD shrinks with √n.', 'Halving it needs 4 times the sample: 4 × 20 = 80.'] },
    ],
    watchOut: 'The CLT is about the SAMPLE MEAN, not the population: a skewed population stays skewed, but x̄ for n ≥ 30 is approximately normal. And divide σ by √n, never by n.',
  },

  // ---------------- STAT Unit 11 — Confidence intervals for proportions and means ----------------
  {
    domain: 'STAT', unit: 11, title: 'Confidence intervals for proportions and means',
    objective: 'Build and interpret a confidence interval for a proportion or a mean.',
    concept: [
      'Every confidence interval is ESTIMATE ± MARGIN OF ERROR, and the margin of error is (critical value) × (standard error).',
      'For a proportion: p̂ ± z*·√(p̂(1 − p̂)/n). Critical values z*: 1.645 for 90%, 1.960 for 95%, 2.576 for 99%. Conditions: random sample, 10% condition, np̂ ≥ 10 and n(1 − p̂) ≥ 10.',
      'For a mean: x̄ ± t*·s/√n with df = n − 1, because s stands in for the unknown σ. Conditions: random, 10%, and normal population or n ≥ 30 (or no strong skew/outliers in a small sample).',
      'INTERPRET the interval: "We are 95% confident that the interval from __ to __ captures the true (parameter in context)." Interpret the LEVEL: "If we took many samples, about 95% of the intervals would capture the true value."',
      'Planning: for margin of error ME at level z*, solve n = (z*/ME)²·p̂(1 − p̂); with no guess for p̂, use 0.5 (the safest, biggest n). Higher confidence widens the interval; larger n narrows it.',
    ],
    examples: [
      { q: 'In a random sample of 100 adults, 60 own a bike. Give a 95% confidence interval for the proportion of all adults who own a bike.', steps: ['p̂ = 0.60. Checks: 60 ≥ 10 and 40 ≥ 10.', 'SE = √(0.6 × 0.4 / 100) = 0.049; ME = 1.96 × 0.049 = 0.096.', 'Interval: 0.60 ± 0.096 = (0.504, 0.696).'], answer: '(0.504, 0.696)' },
      { q: 'Interpret the interval (0.504, 0.696) in context, and say what "95% confidence" means.', steps: ['"We are 95% confident that the interval from 0.504 to 0.696 captures the true proportion of all adults who own a bike."', 'The level describes the method: if we repeated the sampling many times, about 95% of the intervals built this way would capture the true proportion.', 'It does NOT mean there is a 95% chance p is in THIS interval — p is fixed; the interval is what varies.'], answer: '95% confident the interval captures the true proportion of bike owners' },
      { q: 'Of 400 randomly chosen voters, 100 support a ballot measure. Give a 90% confidence interval for the true support.', steps: ['p̂ = 100/400 = 0.25; z* = 1.645.', 'SE = √(0.25 × 0.75 / 400) = √0.000469 ≈ 0.0217; ME = 1.645 × 0.0217 ≈ 0.036.', 'Interval: 0.25 ± 0.036 = (0.214, 0.286).'], answer: '(0.214, 0.286)' },
      { q: 'A random sample of 16 bags of flour has mean weight 50.0 oz and SD 8.0 oz; weights are roughly normal. Give a 95% confidence interval for the true mean weight.', steps: ['df = 15, so t* = 2.131.', 'SE = 8/√16 = 2; ME = 2.131 × 2 = 4.26.', 'Interval: 50 ± 4.26 = (45.74, 54.26) oz.'], answer: '(45.74, 54.26)' },
      { q: 'A random sample of 25 students sleeps a mean of 7.2 hours with SD 1.5 hours. Give a 95% confidence interval for the mean sleep of all students.', steps: ['df = 24, so t* = 2.064.', 'SE = 1.5/√25 = 0.30; ME = 2.064 × 0.30 ≈ 0.62.', 'Interval: 7.2 ± 0.62 = (6.58, 7.82) hours.'], answer: '(6.58, 7.82)' },
      { q: 'A pollster wants a 95% confidence interval for a proportion with margin of error at most 0.03, with no prior guess for p. How many people must be sampled?', steps: ['Use p̂ = 0.5 for the safest estimate.', 'n = (1.96/0.03)² × 0.5 × 0.5 = (65.33)² × 0.25 = 4268.4 × 0.25 ≈ 1067.1.', 'Always round UP: n = 1068.'], answer: '1068' },
    ],
    practice: [
      { q: 'p̂ = 0.5 from a random sample of n = 100. What is the margin of error of a 95% confidence interval?', answers: ['0.098', '0.1', '0.10'], steps: ['SE = √(0.5 × 0.5 / 100) = 0.05.', 'ME = 1.96 × 0.05 = 0.098.'] },
      { q: 'x̄ = 30, s = 6, n = 9 (population roughly normal). What is the margin of error for a 95% t-interval? (t* = 2.262 for df = 8.)', answers: ['4.52', '4.524', '4.5'], steps: ['SE = 6/√9 = 2.', 'ME = 2.262 × 2 = 4.524.'] },
      { q: 'A confidence interval for a proportion is (0.42, 0.50). What was the sample proportion p̂?', answers: ['0.46'], steps: ['p̂ sits in the middle of the interval.', '(0.42 + 0.50)/2 = 0.46.'] },
      { q: 'What sample size guarantees a 95% margin of error of at most 0.05 for a proportion, with no guess for p?', answers: ['385'], steps: ['n = (1.96/0.05)² × 0.25 = (39.2)² × 0.25.', '= 1536.64 × 0.25 = 384.16, rounded up to 385.'] },
    ],
    watchOut: 'An interval is about the PARAMETER, not about individuals or a future sample — and "95% confident" is about the method, never "a 95% chance that p is in here". Use t* (df = n − 1), not z*, whenever you estimate σ with s.',
  },

  // ---------------- STAT Unit 12 — Significance tests: hypotheses, p-values and errors ----------------
  {
    domain: 'STAT', unit: 12, title: 'Significance tests: hypotheses, p-values and errors',
    objective: 'Run a significance test and read its p-value correctly.',
    concept: [
      'HYPOTHESES are claims about a PARAMETER. H0 says "nothing special" with an equals sign (p = 0.5, μ = 500); Ha is what you suspect: <, > (one-sided) or ≠ (two-sided). Write them BEFORE seeing the data.',
      'The TEST STATISTIC measures how far the data sit from H0 in standard errors: z = (p̂ − p0)/√(p0(1 − p0)/n) for a proportion, t = (x̄ − μ0)/(s/√n) with df = n − 1 for a mean.',
      'The P-VALUE is the probability, IF H0 were true, of getting a statistic at least as extreme as the one observed. Two-sided tests double the one-tail area.',
      'DECIDE at a significance level α (usually 0.05): p-value ≤ α → reject H0, evidence for Ha. p-value > α → fail to reject H0 (never "accept" H0). Always conclude in context.',
      'ERRORS: Type I = rejecting a TRUE H0 (probability α). Type II = failing to reject a FALSE H0 (probability β). POWER = 1 − β, the chance of catching a real effect; it rises with larger n, larger α, or a bigger true effect.',
    ],
    examples: [
      { q: 'A coin lands heads 60 times in 100 flips. Is it fair? Test at α = 0.05.', steps: ['H0: p = 0.5, Ha: p ≠ 0.5. Checks: 50 and 50 expected ≥ 10.', 'SE = √(0.5 × 0.5 / 100) = 0.05, so z = (0.60 − 0.50)/0.05 = 2.0.', 'Two-sided p-value = 2 × P(Z > 2.0) = 2 × 0.0228 = 0.0456 < 0.05: reject H0. There is evidence the coin is not fair.'], answer: 'z = 2.0, p ≈ 0.046, reject H0' },
      { q: 'A company claims 80% of customers are satisfied. In a random sample of 200, only 150 are. Is satisfaction lower than claimed? α = 0.05.', steps: ['H0: p = 0.8, Ha: p < 0.8. p̂ = 150/200 = 0.75.', 'SE = √(0.8 × 0.2 / 200) = √0.0008 ≈ 0.0283; z = (0.75 − 0.80)/0.0283 ≈ −1.77.', 'p-value = P(Z < −1.77) = 0.0384 < 0.05: reject H0. Evidence that satisfaction is below 80%.'], answer: 'z ≈ −1.77, p ≈ 0.038, reject H0' },
      { q: 'Bags of rice are labelled 500 g. A random sample of 16 bags has mean 495 g and SD 8 g (weights roughly normal). Are bags underfilled? α = 0.05.', steps: ['H0: μ = 500, Ha: μ < 500.', 'SE = 8/√16 = 2; t = (495 − 500)/2 = −2.5 with df = 15.', 'p-value = P(t15 < −2.5) ≈ 0.012 < 0.05: reject H0. Evidence the mean weight is below 500 g.'], answer: 't = −2.5, p ≈ 0.012, reject H0' },
      { q: 'A cereal box claims 10 g of protein per serving. A random sample of 25 servings has mean 10.4 g and SD 1.5 g. Does the mean differ from 10 g? α = 0.05.', steps: ['H0: μ = 10, Ha: μ ≠ 10.', 'SE = 1.5/√25 = 0.3; t = (10.4 − 10)/0.3 ≈ 1.33 with df = 24.', 'Two-sided p-value ≈ 0.195 > 0.05: fail to reject H0. Not enough evidence that the mean protein differs from 10 g.'], answer: 't ≈ 1.33, p ≈ 0.20, fail to reject' },
      { q: 'For the coin (60 heads in 100), use a 95% confidence interval instead of a test.', steps: ['p̂ = 0.6; SE for the interval uses p̂: √(0.6 × 0.4 / 100) = 0.049.', 'Interval: 0.6 ± 1.96(0.049) = (0.504, 0.696).', 'The interval does not contain 0.5, so it agrees with the two-sided test at α = 0.05: reject p = 0.5.'], answer: '(0.504, 0.696) excludes 0.5 → reject' },
      { q: 'A smoke detector tests H0: "no fire" against Ha: "fire". Describe a Type I and a Type II error and their consequences.', steps: ['Type I: reject "no fire" when there is none — a false alarm. Consequence: annoyance, a wasted evacuation.', 'Type II: fail to reject "no fire" when there IS a fire — a missed fire. Consequence: danger to life.', 'Here a Type II error is far worse, so you would accept more false alarms (a larger α) to gain power.'], answer: 'Type I = false alarm; Type II = missed fire (worse)' },
    ],
    practice: [
      { q: 'p̂ = 0.55 from n = 100, testing H0: p = 0.5. What is the z statistic?', answers: ['1', '1.0'], steps: ['SE = √(0.5 × 0.5 / 100) = 0.05.', 'z = (0.55 − 0.50)/0.05 = 1.0.'] },
      { q: 'x̄ = 52, s = 10, n = 25, testing H0: μ = 50. What is the t statistic?', answers: ['1', '1.0'], steps: ['SE = 10/√25 = 2.', 't = (52 − 50)/2 = 1.0.'] },
      { q: 'A test gives p-value 0.03 and α = 0.05. Do you "reject" or "fail to reject" H0?', answers: ['reject', 'reject H0', 'reject the null'], steps: ['0.03 ≤ 0.05.', 'The p-value is at or below α, so reject H0.'] },
      { q: 'A test is run at α = 0.01. If H0 is true, what is the probability of a Type I error?', answers: ['0.01', '1%'], steps: ['A Type I error is rejecting a true H0.', 'That happens exactly when the p-value ≤ α, which has probability α = 0.01.'] },
    ],
    watchOut: 'The p-value is NOT the probability that H0 is true. It is the chance of data this extreme IF H0 is true. And "fail to reject" is not "accept": a big p-value means no evidence against H0, not proof of it.',
  },

  // ---------------- STAT Unit 13 — Two-sample tests and chi-square tests ----------------
  {
    domain: 'STAT', unit: 13, title: 'Two-sample tests and chi-square tests',
    objective: 'Compare two groups, and test counts against expected counts.',
    concept: [
      'TWO PROPORTIONS: to test H0: p1 = p2, pool the successes, p̂_c = (x1 + x2)/(n1 + n2), and use z = (p̂1 − p̂2)/√(p̂_c(1 − p̂_c)(1/n1 + 1/n2)).',
      'TWO MEANS: t = (x̄1 − x̄2)/√(s1²/n1 + s2²/n2). By hand, use the conservative df = the smaller of n1 − 1 and n2 − 1; technology gives a larger df.',
      'PAIRED data (before/after on the SAME subjects) are not two samples: subtract to get one list of differences and run a one-sample t-test on them.',
      'CHI-SQUARE: χ² = Σ (Observed − Expected)²/Expected adds up how far every cell is from what H0 predicts. Bigger χ² = more evidence against H0. The test is always one-sided (right tail).',
      'Goodness-of-fit: one categorical variable, expected = n × claimed proportion, df = (categories − 1). Independence/homogeneity: a two-way table, expected = (row total × column total)/grand total, df = (rows − 1)(columns − 1). Need every expected count ≥ 5. Critical values at α = 0.05: 3.841 (df 1), 5.991 (df 2), 7.815 (df 3), 9.488 (df 4), 11.070 (df 5).',
    ],
    examples: [
      { q: 'In a drug trial, 60 of 100 treated patients improved versus 45 of 100 on a placebo. Is the improvement rate higher with the drug? α = 0.05.', steps: ['H0: p1 = p2, Ha: p1 > p2. p̂1 = 0.60, p̂2 = 0.45, pooled p̂_c = 105/200 = 0.525.', 'SE = √(0.525 × 0.475 × (1/100 + 1/100)) = √0.004988 ≈ 0.0706; z = (0.60 − 0.45)/0.0706 ≈ 2.12.', 'p-value = P(Z > 2.12) = 0.017 < 0.05: reject H0. Evidence the drug raises the improvement rate.'], answer: 'z ≈ 2.12, p ≈ 0.017, reject H0' },
      { q: 'Class A (n = 25) averaged 78 with SD 10; Class B (n = 36) averaged 72 with SD 12, from independent random samples. Do the mean scores differ? α = 0.05.', steps: ['H0: μ1 = μ2, Ha: μ1 ≠ μ2.', 'SE = √(10²/25 + 12²/36) = √(4 + 4) = √8 ≈ 2.83; t = (78 − 72)/2.83 ≈ 2.12.', 'Conservative df = 24: two-sided p-value ≈ 0.044 < 0.05. Reject H0; evidence the means differ.'], answer: 't ≈ 2.12, p ≈ 0.04, reject H0' },
      { q: 'Eight students take a test before and after a tutoring program. The after − before differences have mean 3.0 and SD 4.0 points. Did scores improve? α = 0.05.', steps: ['Paired design: test H0: μ_d = 0 vs Ha: μ_d > 0 on the differences.', 'SE = 4/√8 ≈ 1.41; t = 3.0/1.41 ≈ 2.12 with df = 7.', 'p-value = P(t7 > 2.12) ≈ 0.036 < 0.05: reject H0. Evidence scores improved.'], answer: 't ≈ 2.12, p ≈ 0.036, reject H0' },
      { q: 'A die is rolled 60 times: faces 1–6 come up 8, 12, 9, 14, 7, 10 times. Is the die fair? α = 0.05.', steps: ['Goodness-of-fit: expected 60/6 = 10 for each face (all ≥ 5). H0: all six faces equally likely.', 'χ² = (8−10)²/10 + (12−10)²/10 + (9−10)²/10 + (14−10)²/10 + (7−10)²/10 + (10−10)²/10 = (4 + 4 + 1 + 16 + 9 + 0)/10 = 3.4.', 'df = 5, critical value 11.070, p-value ≈ 0.64 > 0.05: fail to reject. No evidence the die is unfair.'], answer: 'χ² = 3.4, df 5, p ≈ 0.64, fail to reject' },
      { q: 'Group A: 30 prefer dogs, 20 prefer cats. Group B: 20 dogs, 30 cats. Is preference associated with group? α = 0.05.', steps: ['Two-way table, 100 people. Every row and column total is 50, so each expected count = 50 × 50/100 = 25.', 'χ² = (30−25)²/25 + (20−25)²/25 + (20−25)²/25 + (30−25)²/25 = 1 + 1 + 1 + 1 = 4.0.', 'df = (2−1)(2−1) = 1, critical value 3.841; p-value ≈ 0.046 < 0.05. Reject H0: evidence of an association.'], answer: 'χ² = 4.0, df 1, p ≈ 0.046, reject H0' },
      { q: 'Check the dog/cat result another way: run a two-proportion z-test on "prefers dogs", p̂A = 0.6 and p̂B = 0.4.', steps: ['Pooled p̂_c = 50/100 = 0.5; SE = √(0.5 × 0.5 × (1/50 + 1/50)) = √0.01 = 0.1.', 'z = (0.6 − 0.4)/0.1 = 2.0; two-sided p-value = 2 × 0.0228 = 0.046.', 'z² = 4.0 = χ²: a 2×2 chi-square test and a two-sided two-proportion z-test are the same test.'], answer: 'z = 2.0, z² = 4.0 = χ²' },
    ],
    practice: [
      { q: 'Group 1 has 40 successes in 80; group 2 has 20 successes in 80. What is the pooled proportion p̂_c?', answers: ['0.375', '3/8'], steps: ['Pool the successes and the sizes: (40 + 20)/(80 + 80).', '60/160 = 0.375.'] },
      { q: 'A cell has observed count 30 and expected count 25. What is its contribution to χ²?', answers: ['1'], steps: ['(O − E)²/E = (30 − 25)²/25.', '25/25 = 1.'] },
      { q: 'How many degrees of freedom does a chi-square test of independence have for a 3-row by 4-column table?', answers: ['6'], steps: ['df = (rows − 1)(columns − 1).', '(3 − 1)(4 − 1) = 2 × 3 = 6.'] },
      { q: 'Two independent samples: s1 = 6, n1 = 36 and s2 = 8, n2 = 64. What is the standard error of x̄1 − x̄2?', answers: ['1.41', '1.414', '√2', 'sqrt(2)'], steps: ['SE = √(s1²/n1 + s2²/n2) = √(36/36 + 64/64).', '√(1 + 1) = √2 ≈ 1.41.'] },
    ],
    watchOut: 'Before/after on the same people is PAIRED — one sample of differences, not two samples. And in a chi-square test, use COUNTS, never percentages, and divide by the EXPECTED count in every cell.',
  },

  // ---------------- STAT Unit 14 — Inference for regression and reading the free-response ----------------
  {
    domain: 'STAT', unit: 14, title: 'Inference for regression and reading the free-response',
    objective: 'Test and estimate a regression slope, and write a complete free-response answer.',
    concept: [
      'The population model is μ_y = α + βx. The sample line ŷ = a + bx estimates it; b is the estimated slope, and SE_b says how much b would vary from sample to sample.',
      'Read computer output: the "Coef" column gives a (Constant) and b (the x-variable row); the "SE Coef" column gives SE_b; "S" is the SD of the residuals; "R-Sq" is r². The equation is ŷ = a + bx.',
      'Conditions (LINER): Linear pattern, Independent observations, Normal residuals, Equal SD of residuals across x, Random sample. Check the scatterplot and residual plot.',
      'Confidence interval for the slope: b ± t*·SE_b with df = n − 2. Test for the slope: H0: β = 0 (no linear relationship) with t = b/SE_b, df = n − 2. Most output reports this t and its two-sided p-value.',
      'FREE-RESPONSE: four steps every time. STATE the parameter and hypotheses (or the interval), PLAN the procedure and check conditions, DO the calculation (statistic, df, p-value), CONCLUDE in context at α. Interpret slope, r² and p-values in the language of the problem.',
    ],
    examples: [
      { q: 'Output for predicting exam score from study hours (n = 20): Constant Coef 12.5, SE 3.2; Hours Coef 2.40, SE 0.60; S = 4.1; R-Sq = 47.0%. Write the equation and interpret the slope.', steps: ['ŷ = 12.5 + 2.40(hours).', 'Slope: each additional hour of study is associated with a predicted increase of 2.40 points in exam score, on average.', 'r² = 47%: about 47% of the variation in scores is explained by the linear relationship with hours.'], answer: 'ŷ = 12.5 + 2.40x; +2.40 points per hour' },
      { q: 'Using the same output, test whether there is a linear relationship between hours and score, at α = 0.05.', steps: ['H0: β = 0, Ha: β ≠ 0.', 't = b/SE_b = 2.40/0.60 = 4.0 with df = n − 2 = 18.', 'Two-sided p-value ≈ 0.001 < 0.05: reject H0. Convincing evidence of a linear relationship between hours and score.'], answer: 't = 4.0, df 18, p ≈ 0.001, reject H0' },
      { q: 'Give a 95% confidence interval for the true slope β from the same output.', steps: ['df = 18, so t* = 2.101.', 'ME = 2.101 × 0.60 ≈ 1.26.', 'Interval: 2.40 ± 1.26 = (1.14, 3.66) points per hour.'], answer: '(1.14, 3.66)' },
      { q: 'Use the interval (1.14, 3.66) to reach the test conclusion without a p-value.', steps: ['H0 says β = 0.', 'The interval does not contain 0 — every plausible slope is positive.', 'So at α = 0.05 (two-sided) we reject H0, the same conclusion as the t-test.'], answer: '0 is outside the interval → reject H0' },
      { q: 'A student who studied 10 hours scored 40. What does the line predict, and what is the residual?', steps: ['ŷ = 12.5 + 2.40(10) = 12.5 + 24 = 36.5.', 'Residual = actual − predicted = 40 − 36.5.', 'Residual = +3.5: the student scored 3.5 points above the prediction.'], answer: 'ŷ = 36.5, residual 3.5' },
      { q: 'Output for predicting fuel use from car weight (n = 12): Weight Coef −0.85, SE 0.30. Give a 90% confidence interval for the slope and state what it shows.', steps: ['df = 10, so t* = 1.812; ME = 1.812 × 0.30 ≈ 0.54.', 'Interval: −0.85 ± 0.54 = (−1.39, −0.31).', 'The whole interval is negative: heavier cars are associated with lower fuel use per unit, and 0 is not a plausible slope at the 90% level.'], answer: '(−1.39, −0.31)' },
    ],
    practice: [
      { q: 'Output shows a slope of 3.0 with SE 1.5. What is the t statistic for testing H0: β = 0?', answers: ['2', '2.0'], steps: ['t = b/SE_b.', '3.0/1.5 = 2.'] },
      { q: 'A regression uses n = 22 data points. How many degrees of freedom does the slope test have?', answers: ['20'], steps: ['df = n − 2.', '22 − 2 = 20.'] },
      { q: 'b = 2.40, SE_b = 0.60 and t* = 2.101. What is the margin of error of the 95% interval for the slope?', answers: ['1.26', '1.2606', '1.261'], steps: ['ME = t* × SE_b.', '2.101 × 0.60 = 1.26.'] },
      { q: 'The line is ŷ = 12.5 + 2.4x. What score does it predict for x = 5 hours?', answers: ['24.5'], steps: ['Substitute x = 5.', '12.5 + 2.4 × 5 = 12.5 + 12 = 24.5.'] },
    ],
    watchOut: 'The slope test uses df = n − 2, not n − 1. And never say the slope "causes" anything: say "each extra unit of x is ASSOCIATED with a predicted change of b in y", and always finish with a conclusion in context.',
  },
];
