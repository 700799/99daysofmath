import type { Lesson } from '../lessons';

// AP Statistics, units 1-7: describing data, center and spread, the normal
// model, regression, sampling, experiments, and probability rules.

export const STAT_LESSONS_U01_07: Lesson[] = [
  // ---------------- STAT Unit 1 — Describing categorical and quantitative data ----------------
  {
    domain: 'STAT', unit: 1, title: 'Describing categorical and quantitative data (graphs, shape)',
    objective: 'Pick the right graph for a variable and describe what it shows.',
    concept: [
      'A CATEGORICAL variable sorts individuals into groups (eye color, favorite lunch). A QUANTITATIVE variable is a number you can average (height, commute time). A number used as a label, like a jersey number or zip code, is still categorical.',
      'Categorical data lives in a FREQUENCY TABLE, a BAR GRAPH, or a PIE CHART. The RELATIVE FREQUENCY of a group is its count divided by the total: 8 of 20 students is 8/20 = 0.40 = 40%.',
      'Quantitative data lives in a DOT PLOT, a STEMPLOT, or a HISTOGRAM. A histogram groups values into equal-width bins; its bars touch because the number line is continuous.',
      'Describe a distribution with SOCS: Shape, Outliers, Center, Spread — always in context. Shape is symmetric, skewed right, or skewed left; it can be unimodal (one peak), bimodal, or uniform.',
      'The SKEW is named for the TAIL, not the peak. A long tail stretching toward high values is skewed RIGHT. In a skewed-right distribution the mean is pulled above the median.',
      'A TWO-WAY TABLE shows two categorical variables at once. MARGINAL percents come from the totals on the edges; CONDITIONAL percents are computed inside one row or one column.',
    ],
    examples: [
      { q: 'Classify each variable: number of siblings, eye color, zip code.', steps: ['Number of siblings is a count you can average: quantitative.', 'Eye color names a group: categorical.', 'A zip code is a number, but averaging zip codes means nothing — it is a label, so categorical.'], answer: 'quantitative, categorical, categorical' },
      { q: 'Favorite lunch of 20 students: pizza 8, tacos 6, salad 4, other 2. What is the relative frequency of pizza?', steps: ['Relative frequency = count ÷ total.', '8 ÷ 20 = 0.40.', 'Pizza is 40% of the class, the tallest bar on the bar graph.'], answer: '0.40 (40%)' },
      { q: 'Commute times (minutes) of 24 students, in 10-minute bins: 0–10: 9, 10–20: 7, 20–30: 4, 30–40: 3, 40–50: 1. Describe the shape.', steps: ['The tallest bar is on the left (0–10 minutes) and the bars shrink to the right.', 'The long tail points toward the high values.', 'Shape: skewed right, single peak near 0–10 minutes. Most students live close to school; a few live far away.'], answer: 'skewed right (unimodal)' },
      { q: 'Number of pets of 15 students: 0 pets: 4 students, 1 pet: 6, 2 pets: 3, 3 pets: 1, 4 pets: 1. Find the median and describe the shape.', steps: ['Sorted, the 15 values are 0,0,0,0,1,1,1,1,1,1,2,2,2,3,4.', 'The median is the 8th value. Four 0s, then the 5th through 10th values are 1s, so the 8th value is 1.', 'The peak is at 1 and the tail stretches toward 4: skewed right. Median 1 pet.'], answer: 'median 1 pet, skewed right' },
      { q: 'Two-way table of 50 students. Prefers online: 10th grade 12, 11th grade 18. Prefers in person: 10th grade 13, 11th grade 7. What percent of 11th graders prefer online?', steps: ['This is a conditional percent: stay inside the 11th-grade row.', '11th-grade total = 18 + 7 = 25.', '18 ÷ 25 = 0.72, so 72% of 11th graders prefer online (versus 12/25 = 48% of 10th graders).'], answer: '72%' },
      { q: 'Exam scores of 24 students: 50–60: 1, 60–70: 2, 70–80: 4, 80–90: 9, 90–100: 8. Describe the shape and say how the mean compares to the median.', steps: ['The tall bars are on the right (80–100) and the bars shrink to the left.', 'The tail points toward the LOW scores, so the shape is skewed left.', 'A left tail drags the mean down, so the mean is below the median.'], answer: 'skewed left; mean < median' },
    ],
    practice: [
      { q: 'Which of these is categorical: shoe size, jersey number, height, or distance to school?', answers: ['jersey number', 'jersey'], steps: ['A jersey number is a label, not a measurement.', 'You would never average jersey numbers.', 'Jersey number is categorical.'] },
      { q: 'Favorite lunch of 20 students: pizza 8, tacos 6, salad 4, other 2. What is the relative frequency of tacos, as a percent?', answers: ['30%', '30', '0.3', '0.30'], steps: ['Relative frequency = count ÷ total.', '6 ÷ 20 = 0.30.', 'Tacos are 30%.'] },
      { q: 'Goals scored in 10 games: 0, 0, 1, 1, 1, 2, 2, 3, 5, 7. Is the distribution skewed left or skewed right?', answers: ['right', 'skewed right'], steps: ['Most games cluster at 0–2 goals.', 'The tail stretches toward 5 and 7, the high values.', 'Skewed right.'] },
      { q: 'From the two-way table (10th grade: online 12, in person 13), what percent of 10th graders prefer in person?', answers: ['52%', '52', '0.52'], steps: ['10th-grade total = 12 + 13 = 25.', '13 ÷ 25 = 0.52.', '52% of 10th graders prefer in person.'] },
    ],
    watchOut: 'Skew is named for the TAIL, not the pile. A histogram with its tall bars on the right and a long tail to the left is skewed LEFT, and its mean sits below its median.',
  },

  // ---------------- STAT Unit 2 — Center, spread, boxplots and outliers ----------------
  {
    domain: 'STAT', unit: 2, title: 'Center, spread, boxplots and outliers',
    objective: 'Measure center and spread, and decide which numbers are outliers.',
    concept: [
      'The MEAN is the balance point: add the values and divide by n. The MEDIAN is the middle value once the data are sorted (average the two middles when n is even).',
      'QUARTILES cut the sorted data into quarters: Q1 is the median of the lower half, Q3 the median of the upper half (leave the overall median out when n is odd). The IQR = Q3 − Q1 measures the spread of the middle 50%.',
      'The STANDARD DEVIATION s is the typical distance of a value from the mean: square each deviation, add, divide by n − 1, and take the square root.',
      'The FIVE-NUMBER SUMMARY (min, Q1, median, Q3, max) draws a BOXPLOT. The box holds the middle half; the whiskers reach the smallest and largest values that are not outliers.',
      'The 1.5 × IQR RULE: a value is an outlier if it is below Q1 − 1.5·IQR or above Q3 + 1.5·IQR. Outliers get their own dot beyond the whisker.',
      'Median and IQR are RESISTANT: one wild value barely moves them. Mean and standard deviation are NOT — a single outlier drags them toward itself. Skewed data or outliers call for median and IQR.',
    ],
    examples: [
      { q: 'Minutes spent on homework: 4, 6, 7, 8, 10, 12, 16. Find the mean and the median.', steps: ['Mean: 4 + 6 + 7 + 8 + 10 + 12 + 16 = 63, and 63 ÷ 7 = 9.', 'The data are already sorted; with 7 values the median is the 4th: 8.', 'Mean 9, median 8. The mean is a little higher because 16 pulls it up.'], answer: 'mean 9, median 8' },
      { q: 'Same data: 4, 6, 7, 8, 10, 12, 16. Find the five-number summary and the IQR.', steps: ['Min 4, max 16, median 8.', 'Lower half 4, 6, 7 has median Q1 = 6. Upper half 10, 12, 16 has median Q3 = 12.', 'Five-number summary: 4, 6, 8, 12, 16. IQR = 12 − 6 = 6.'], answer: '4, 6, 8, 12, 16; IQR = 6' },
      { q: 'Find the standard deviation of 3, 5, 5, 8, 9.', steps: ['Mean = 30 ÷ 5 = 6.', 'Deviations: −3, −1, −1, 2, 3. Squared: 9, 1, 1, 4, 9. Sum = 24.', 'Divide by n − 1 = 4: variance 6. s = √6 ≈ 2.45.'], answer: 's ≈ 2.45' },
      { q: 'Ages at a club meeting: 12, 14, 15, 15, 16, 18, 20, 45. Is 45 an outlier?', steps: ['Median = (15 + 16)/2 = 15.5. Lower half 12, 14, 15, 15 gives Q1 = 14.5; upper half 16, 18, 20, 45 gives Q3 = 19.', 'IQR = 19 − 14.5 = 4.5, and 1.5 × 4.5 = 6.75.', 'Upper fence = 19 + 6.75 = 25.75. Since 45 > 25.75, 45 is an outlier (the lower fence 7.75 catches nothing).'], answer: 'yes, 45 > 25.75' },
      { q: 'For those ages, compare the mean and median with and without the 45.', steps: ['With 45: mean = 155 ÷ 8 = 19.4, median 15.5.', 'Without 45: mean = 110 ÷ 7 ≈ 15.7, median 15.', 'The outlier moves the mean by almost 4 years but the median by only 0.5. The median is resistant.'], answer: 'mean 19.4 → 15.7; median 15.5 → 15' },
      { q: 'Two classes took the same test. Class A: median 78, IQR 10. Class B: median 85, IQR 20. Which class scored higher typically, and which was more consistent?', steps: ['Compare centers: Class B has the higher median, 85 versus 78.', 'Compare spreads: Class A has the smaller IQR, 10 versus 20, so its middle half is packed tighter.', 'B scored higher on a typical student; A was more consistent.'], answer: 'B higher, A more consistent' },
    ],
    practice: [
      { q: 'Find the median of 3, 9, 1, 7, 5.', answers: ['5'], steps: ['Sort first: 1, 3, 5, 7, 9.', 'Five values, so the median is the 3rd.', 'Median = 5.'] },
      { q: 'Find the IQR of 2, 4, 6, 8, 10, 12, 14, 16.', answers: ['8'], steps: ['Lower half 2, 4, 6, 8 has Q1 = (4 + 6)/2 = 5.', 'Upper half 10, 12, 14, 16 has Q3 = (12 + 14)/2 = 13.', 'IQR = 13 − 5 = 8.'] },
      { q: 'A data set has Q1 = 20 and Q3 = 30. Above what value is a point an outlier?', answers: ['45'], steps: ['IQR = 30 − 20 = 10.', '1.5 × 10 = 15.', 'Upper fence = 30 + 15 = 45.'] },
      { q: 'Find the standard deviation of 1, 2, 3, 4, 5, to two decimals.', answers: ['1.58', '1.581', '1.6'], steps: ['Mean = 3. Deviations −2, −1, 0, 1, 2; squares 4, 1, 0, 1, 4; sum 10.', 'Divide by n − 1 = 4: variance 2.5.', 's = √2.5 ≈ 1.58.'] },
    ],
    watchOut: 'Sort before you find a median or a quartile, and divide by n − 1, not n, for the sample standard deviation. The IQR is Q3 MINUS Q1 — a spread, never a sum.',
  },

  // ---------------- STAT Unit 3 — The normal distribution and z-scores ----------------
  {
    domain: 'STAT', unit: 3, title: 'The normal distribution and z-scores',
    objective: 'Standardize a value and turn it into an area under the normal curve.',
    concept: [
      'A NORMAL distribution is a symmetric bell curve described by two numbers: its mean μ (the center) and its standard deviation σ (the distance from the center to where the curve changes from steep to flat). We write N(μ, σ).',
      'The EMPIRICAL RULE: about 68% of values lie within 1σ of the mean, 95% within 2σ, and 99.7% within 3σ. Halve the leftover to get a tail: beyond 2σ on one side is about 2.5%.',
      'A Z-SCORE counts standard deviations from the mean: z = (x − μ) / σ. Negative z means below the mean. Z-scores let you compare values from different distributions.',
      'The standard normal table (or normalcdf) gives the AREA TO THE LEFT of z, which is the proportion of values below x. For an area to the right, subtract from 1; for an area between, subtract two left areas.',
      'To go BACKWARDS from a percent to a value, find the z with that area to the left (invNorm), then unstandardize: x = μ + zσ.',
      'Always draw the curve, mark μ and the value, and shade the region you want before you compute. The picture catches most errors.',
    ],
    examples: [
      { q: 'Scores on a test are N(500, 100). What is the z-score of 650?', steps: ['z = (x − μ) / σ.', 'z = (650 − 500) / 100 = 150 / 100.', 'z = 1.5: the score is 1.5 standard deviations above the mean.'], answer: 'z = 1.5' },
      { q: 'For N(500, 100), use the empirical rule: what percent of scores lie between 400 and 600? Above 700?', steps: ['400 and 600 are μ − 1σ and μ + 1σ, so about 68% lie between them.', '700 is μ + 2σ. 95% lie within 2σ, leaving 5% in the two tails.', 'Half of that is in the upper tail: about 2.5% score above 700.'], answer: '68%; 2.5%' },
      { q: 'For N(500, 100), what proportion of scores are below 650?', steps: ['z = (650 − 500)/100 = 1.5.', 'The table gives the area to the left of z = 1.5 as 0.9332.', 'About 93.3% of scores are below 650 (so 6.7% are above).'], answer: '0.9332' },
      { q: 'Adult women\'s heights are N(64.5, 2.5) inches. What proportion are between 62 and 67 inches?', steps: ['z for 62: (62 − 64.5)/2.5 = −1. z for 67: (67 − 64.5)/2.5 = 1.', 'Area left of 1 is 0.8413; area left of −1 is 0.1587.', '0.8413 − 0.1587 = 0.6826, about 68%, matching the empirical rule.'], answer: '0.6826' },
      { q: 'For N(500, 100), what score puts you in the top 10%?', steps: ['Top 10% means area 0.90 to the left. The z with 0.90 to its left is about 1.28.', 'Unstandardize: x = μ + zσ = 500 + 1.28 × 100.', 'x = 628. A score of about 628 is the cutoff.'], answer: '628' },
      { q: 'Chip bags are filled N(10, 0.2) ounces. A bag under 9.7 oz gets rejected. What proportion of bags are rejected?', steps: ['z = (9.7 − 10)/0.2 = −0.3/0.2 = −1.5.', 'The area to the left of z = −1.5 is 0.0668.', 'About 6.7% of bags are rejected.'], answer: '0.0668 (about 6.7%)' },
    ],
    practice: [
      { q: 'A test has mean 60 and standard deviation 8. What is the z-score of a 72?', answers: ['1.5'], steps: ['z = (72 − 60)/8.', '12/8 = 1.5.', 'z = 1.5.'] },
      { q: 'By the empirical rule, what percent of a normal distribution lies within 2 standard deviations of the mean?', answers: ['95%', '95', '0.95'], steps: ['68–95–99.7.', 'Within 2σ is the middle number.', '95%.'] },
      { q: 'About what percent of values fall below z = −1? (Round to the nearest whole percent.)', answers: ['16%', '16', '0.16', '15.87%', '15.87', '0.1587'], steps: ['Area to the left of z = −1 is 0.1587.', 'That is about 16%.', 'Check with the empirical rule: 100% − 68% = 32% in both tails, 16% in each.'] },
      { q: 'IQ scores are N(100, 15). What score is the cutoff for the top 5%? (z = 1.645)', answers: ['125', '124.7', '124.68', '124.675'], steps: ['Top 5% means 95% to the left, so z = 1.645.', 'x = 100 + 1.645 × 15 = 100 + 24.7.', 'x ≈ 124.7, about 125.'] },
    ],
    watchOut: 'The table always gives the area to the LEFT. "Above 650" is 1 − 0.9332, not 0.9332. And unstandardize with x = μ + zσ, never μ − zσ, unless z itself is negative.',
  },

  // ---------------- STAT Unit 4 — Scatterplots, correlation and least-squares regression ----------------
  {
    domain: 'STAT', unit: 4, title: 'Scatterplots, correlation and least-squares regression',
    objective: 'Describe a relationship, fit a line to it, and use the line carefully.',
    concept: [
      'A SCATTERPLOT shows two quantitative variables: the EXPLANATORY variable x on the horizontal axis and the RESPONSE variable y on the vertical. Describe it with DIRECTION (positive or negative), FORM (linear or curved), STRENGTH, and any unusual points.',
      'The CORRELATION r measures the direction and strength of a LINEAR relationship. It is between −1 and 1, has no units, and does not change if you swap x and y or change units. r near 0 means weak, r near ±1 means strong.',
      'The LEAST-SQUARES REGRESSION LINE ŷ = a + bx minimizes the sum of squared residuals. Its slope is b = r · (s_y / s_x) and it always passes through (x̄, ȳ), so a = ȳ − b·x̄.',
      'Interpret the SLOPE as "for each extra 1 unit of x, the PREDICTED y changes by b." Interpret the INTERCEPT as the predicted y when x = 0 (only if x = 0 makes sense).',
      'A RESIDUAL is actual − predicted: y − ŷ. Positive means the point sits above the line. r² is the fraction of the variation in y explained by the linear relationship with x.',
      'Predicting outside the range of the data is EXTRAPOLATION and is unreliable. And correlation is not causation: a strong r never proves that x causes y.',
    ],
    examples: [
      { q: 'Hours studied and test score for five students: (1, 60), (2, 65), (3, 75), (4, 80), (5, 90). Describe the scatterplot.', steps: ['As hours go up, scores go up: the direction is positive.', 'The points fall close to a straight line: the form is linear and the strength is strong.', 'No unusual points. Positive, linear, strong relationship between hours and score.'], answer: 'positive, linear, strong' },
      { q: 'For the same data, x̄ = 3 and ȳ = 74. The deviations give Σ(x − x̄)(y − ȳ) = 75 and Σ(x − x̄)² = 10. Find the regression line.', steps: ['Slope b = 75 / 10 = 7.5.', 'The line passes through (x̄, ȳ) = (3, 74), so a = 74 − 7.5 × 3 = 74 − 22.5 = 51.5.', 'ŷ = 51.5 + 7.5x.'], answer: 'ŷ = 51.5 + 7.5x' },
      { q: 'Interpret the slope and intercept of ŷ = 51.5 + 7.5x (x = hours studied, y = score).', steps: ['Slope 7.5: for each additional hour studied, the predicted score rises by 7.5 points.', 'Intercept 51.5: a student who studies 0 hours is predicted to score 51.5.', 'Always say "predicted" — the line is a model, not a promise.'], answer: '+7.5 points per hour; 51.5 predicted at 0 hours' },
      { q: 'Using ŷ = 51.5 + 7.5x, predict the score for 3.5 hours, and find the residual for the student who studied 2 hours and scored 65.', steps: ['Prediction: 51.5 + 7.5 × 3.5 = 51.5 + 26.25 = 77.75.', 'For x = 2: ŷ = 51.5 + 15 = 66.5.', 'Residual = actual − predicted = 65 − 66.5 = −1.5. The point sits 1.5 below the line.'], answer: '77.75; residual −1.5' },
      { q: 'For the study data, r = 0.993. Find and interpret r².', steps: ['r² = 0.993² ≈ 0.987.', 'About 98.7% of the variation in test scores is explained by the linear relationship with hours studied.', 'The other 1.3% is scatter the line cannot account for.'], answer: 'r² ≈ 0.987 (98.7%)' },
      { q: 'A classmate uses ŷ = 51.5 + 7.5x to predict the score after 20 hours of studying. What goes wrong?', steps: ['ŷ = 51.5 + 7.5 × 20 = 201.5, an impossible score.', 'The data only covered 1 to 5 hours; 20 is far outside that range.', 'This is extrapolation. The line is not trusted beyond the data.'], answer: '201.5 — impossible; extrapolation' },
    ],
    practice: [
      { q: 'A student studied 4 hours and scored 80. The line predicts 81.5. What is the residual?', answers: ['-1.5', '−1.5'], steps: ['Residual = actual − predicted.', '80 − 81.5 = −1.5.', 'The point is 1.5 below the line.'] },
      { q: 'For the line ŷ = 10 + 2x, what is the predicted y when x = 6?', answers: ['22'], steps: ['Substitute x = 6.', '10 + 2 × 6 = 10 + 12.', 'ŷ = 22.'] },
      { q: 'Which correlation shows the stronger linear relationship: r = −0.9 or r = 0.4?', answers: ['-0.9', '−0.9', 'r = -0.9', 'r = −0.9'], steps: ['Strength depends on how close r is to ±1, not on the sign.', '|−0.9| = 0.9 is closer to 1 than 0.4.', 'r = −0.9 is stronger.'] },
      { q: 'If r = 0.8, what percent of the variation in y is explained by the linear relationship with x?', answers: ['64%', '64', '0.64'], steps: ['r² = 0.8² = 0.64.', 'That is 64%.', 'The rest, 36%, is unexplained scatter.'] },
    ],
    watchOut: 'Residual is ACTUAL minus PREDICTED, in that order. And a strong correlation says the points hug a line — it never says x causes y, and it never licenses a prediction far outside the data.',
  },

  // ---------------- STAT Unit 5 — Sampling: random samples, bias and survey design ----------------
  {
    domain: 'STAT', unit: 5, title: 'Sampling: random samples, bias and survey design',
    objective: 'Choose a sample that lets you trust what it says about the population.',
    concept: [
      'The POPULATION is everyone you want to know about; the SAMPLE is the part you actually measure. A PARAMETER describes the population (p, μ); a STATISTIC describes the sample (p̂, x̄).',
      'A SIMPLE RANDOM SAMPLE (SRS) gives every group of n individuals the same chance of being chosen. Number the population, then use a random digit table or a random number generator.',
      'STRATIFIED sampling splits the population into similar groups (strata) and takes an SRS from each. CLUSTER sampling picks whole groups at random and measures everyone in them. SYSTEMATIC sampling takes every kth person after a random start.',
      'BIAS is a design flaw that pushes results in one direction on purpose or by accident: VOLUNTARY RESPONSE (people choose themselves), CONVENIENCE (whoever is easy to reach), UNDERCOVERAGE (part of the population can never be picked), and NONRESPONSE (chosen people do not answer).',
      'RESPONSE BIAS comes from the question itself: leading wording, a sensitive topic, or an interviewer\'s tone. Random chance causes VARIABILITY, which a bigger sample shrinks; a bigger sample does NOT fix bias.',
      'Random selection lets you generalize from the sample to the population. Without it, the sample describes only itself.',
    ],
    examples: [
      { q: 'A school of 1,200 students surveys 100 of them; 62% of those surveyed want a later start time. Name the population, the sample, and say whether 62% is a parameter or a statistic.', steps: ['Population: all 1,200 students. Sample: the 100 surveyed.', '62% was computed from the sample, so it is a statistic (p̂ = 0.62).', 'The parameter is the unknown percent of all 1,200 students who want a later start.'], answer: 'statistic' },
      { q: 'Choose an SRS of 5 from 40 students using this line of random digits: 41050 92031 06449 05059.', steps: ['Label the students 01 to 40.', 'Read two digits at a time: 41, 05, 09, 20, 31, 06, 44, 90, 50, 59.', 'Skip labels over 40 and repeats. The sample is students 05, 09, 20, 31, 06.'], answer: '05, 09, 20, 31, 06' },
      { q: 'A principal wants student opinions on the cafeteria. Plan A: take an SRS of 10 from each grade, 9–12. Plan B: pick 3 homerooms at random and survey everyone in them. Name each design.', steps: ['Plan A samples inside every grade, so each grade is guaranteed a voice: stratified random sampling.', 'Plan B picks whole groups and measures everyone inside: cluster sampling.', 'Stratified groups are similar inside; clusters should each look like a mini population.'], answer: 'A stratified, B cluster' },
      { q: 'A news website asks readers to click "yes" or "no" on whether taxes are too high; 88% click yes. What kind of bias is this?', steps: ['Readers chose themselves to answer — nobody selected them.', 'People with strong feelings are the ones who bother to click.', 'Voluntary response bias; the 88% says nothing reliable about the population.'], answer: 'voluntary response bias' },
      { q: 'A survey asks: "Do you agree that overpaid athletes should be taxed more?" What is wrong?', steps: ['The word "overpaid" tells the respondent what to think.', 'Leading wording is a form of response bias.', 'Fix: "Should professional athletes pay a higher tax rate?"'], answer: 'leading wording (response bias)' },
      { q: 'A store wants a systematic sample of 50 of the 500 shoppers who enter today. Describe the method.', steps: ['k = 500 / 50 = 10.', 'Pick a random start from 1 to 10, say 7.', 'Survey shoppers 7, 17, 27, 37, ... every 10th shopper, giving 50 in all.'], answer: 'every 10th shopper after a random start from 1 to 10' },
    ],
    practice: [
      { q: 'In a sample of 100 students, 62% want a later start. Is 62% a parameter or a statistic?', answers: ['statistic', 'a statistic'], steps: ['It describes the sample, not the whole population.', 'Sample numbers are statistics.', 'Statistic.'] },
      { q: 'A reporter interviews shoppers at one mall at noon on a Tuesday. What kind of sampling is this?', answers: ['convenience', 'convenience sample', 'convenience sampling', 'convenience bias'], steps: ['The reporter picked whoever was easy to reach.', 'No randomness was used.', 'Convenience sampling, which is biased toward people free at noon on a weekday.'] },
      { q: 'Labels are 01 to 30. Reading "78034 11903" two digits at a time, what is the first label chosen?', answers: ['3', '03'], steps: ['Pairs: 78, 03, 41, 19, 03.', '78 is too big; skip it.', 'The first usable label is 03.'] },
      { q: 'A list has 2,000 names and you want a systematic sample of 100. Every kth name is chosen. What is k?', answers: ['20'], steps: ['k = population ÷ sample size.', '2000 ÷ 100 = 20.', 'Every 20th name after a random start from 1 to 20.'] },
    ],
    watchOut: 'A bigger sample does not cure bias — 10,000 self-selected clicks are still a voluntary response sample. Only the DESIGN fixes bias; only randomness lets you generalize.',
  },

  // ---------------- STAT Unit 6 — Experiments vs observational studies ----------------
  {
    domain: 'STAT', unit: 6, title: 'Experiments vs observational studies; randomization, confounding',
    objective: 'Tell an experiment from an observational study, and design one that can prove cause.',
    concept: [
      'In an OBSERVATIONAL STUDY you record what people already do. In an EXPERIMENT you IMPOSE a treatment on the subjects. Only an experiment can show cause and effect.',
      'The EXPLANATORY variable (factor) is what you change; the RESPONSE is what you measure. A TREATMENT is one combination of factor levels: 2 fertilizers × 3 watering schedules = 6 treatments.',
      'A CONFOUNDING variable is tangled up with the explanatory variable, so you cannot tell which one caused the response. Students who eat breakfast may also sleep more; breakfast and sleep are confounded.',
      'Three principles of good design: COMPARISON (a control or several treatments), RANDOM ASSIGNMENT (chance decides who gets what, which balances confounders), and REPLICATION (enough subjects in each group).',
      'A PLACEBO is a fake treatment; BLINDING keeps subjects (single-blind) or subjects and evaluators (double-blind) from knowing who got which treatment, so expectations cannot drive the response.',
      'BLOCKING groups subjects that are alike (by gender, age, starting ability) and randomizes within each block. MATCHED PAIRS is blocking with two: each pair, or each person twice, gets both treatments.',
    ],
    examples: [
      { q: 'Researchers look at hospital records and find that people who drink 3+ cups of coffee a day have less heart disease. Experiment or observational study?', steps: ['Nobody assigned coffee; people chose their own coffee habits.', 'The researchers only observed and recorded.', 'Observational study. It cannot prove coffee prevents heart disease — coffee drinkers may differ in exercise, income, or age.'], answer: 'observational study' },
      { q: 'You have 40 tomato plants and two fertilizers, A and B. Design a completely randomized experiment to compare them.', steps: ['Number the plants 1–40. Use a random number generator to pick 20 plants for fertilizer A; the other 20 get fertilizer B.', 'Grow all plants under the same conditions (light, water, soil).', 'After 8 weeks, measure each plant\'s height and compare the mean heights of the two groups.'], answer: 'randomly assign 20 plants to A and 20 to B, same conditions, compare mean height' },
      { q: 'An experiment tests fertilizer type (A, B) and watering (daily, weekly) on plant growth. Name the factors, the response, and count the treatments.', steps: ['Factors: fertilizer type (2 levels) and watering schedule (2 levels).', 'Response: plant growth (height gained).', 'Treatments = 2 × 2 = 4: A-daily, A-weekly, B-daily, B-weekly.'], answer: '2 factors, response = growth, 4 treatments' },
      { q: 'A study finds students who eat breakfast earn higher grades. Name a possible confounding variable and explain.', steps: ['Students who eat breakfast may also get more sleep, or have more support at home.', 'Sleep is tangled with breakfast: the breakfast group and the no-breakfast group differ in sleep too.', 'We cannot tell whether breakfast or sleep raised the grades, so sleep is a confounder.'], answer: 'e.g., sleep (or home support)' },
      { q: 'A company tests a new headache pill. Why give half the subjects a sugar pill, and why keep both the subjects and the doctors from knowing who got which?', steps: ['The sugar pill is a placebo: some people feel better just because they took "something."', 'Comparing pill to placebo separates the drug\'s effect from the placebo effect.', 'Double-blinding stops subjects\' hopes and doctors\' expectations from biasing the reported pain levels.'], answer: 'placebo control, double-blind' },
      { q: 'A shoe company compares two sole materials for wear. Each of 20 volunteers wears material X on one foot and material Y on the other, with the foot chosen by coin flip. What design is this and why is it better than randomly assigning 10 people to each material?', steps: ['Each person is a block of two: both treatments on the same walker.', 'This is a matched pairs design; the coin flip randomizes which foot gets X.', 'It is better because people differ hugely in how far and how hard they walk — the pairing removes that person-to-person variation from the comparison.'], answer: 'matched pairs; removes person-to-person variation' },
    ],
    practice: [
      { q: 'An experiment uses 2 fertilizers and 3 watering levels. How many treatments are there?', answers: ['6'], steps: ['Treatments are every combination of levels.', '2 × 3 = 6.', 'Six treatments.'] },
      { q: 'Which type of study can show cause and effect: an experiment or an observational study?', answers: ['experiment', 'an experiment'], steps: ['Only random assignment of treatments balances out confounders.', 'That happens in an experiment.', 'Experiment.'] },
      { q: 'Students who sign up for tutoring score higher than those who do not. Can you conclude that tutoring caused the higher scores? (yes/no)', answers: ['no'], steps: ['Students chose tutoring themselves; nothing was assigned.', 'More motivated students may have signed up — motivation is confounded with tutoring.', 'No.'] },
      { q: 'In a matched pairs design with 30 subjects where each subject tries both treatments, how many treatments does each subject receive?', answers: ['2', 'two', 'both'], steps: ['Matched pairs with one person means that person is their own pair.', 'They get both treatments, in random order.', '2.'] },
    ],
    watchOut: 'Random SAMPLING (who is in the study) and random ASSIGNMENT (who gets which treatment) are different things. Sampling lets you generalize; assignment lets you claim cause. An experiment without random assignment still proves nothing.',
  },

  // ---------------- STAT Unit 7 — Probability rules, conditional probability and independence ----------------
  {
    domain: 'STAT', unit: 7, title: 'Probability rules, conditional probability and independence',
    objective: 'Combine events with the addition and multiplication rules, and test for independence.',
    concept: [
      'A probability is a number from 0 to 1, and all the outcomes in the SAMPLE SPACE add to 1. The COMPLEMENT rule: P(not A) = 1 − P(A). "At least one" problems are usually easiest through the complement.',
      'The ADDITION RULE: P(A or B) = P(A) + P(B) − P(A and B). Subtract the overlap so it is not counted twice. If A and B are MUTUALLY EXCLUSIVE (cannot both happen), the overlap is 0.',
      'CONDITIONAL probability: P(A | B) = P(A and B) / P(B) — the chance of A once you know B happened. In a two-way table, "given B" means stay inside the B row or column.',
      'The MULTIPLICATION RULE: P(A and B) = P(A) · P(B | A). A tree diagram multiplies along a branch and adds the branches that fit the event.',
      'A and B are INDEPENDENT when knowing one changes nothing: P(A | B) = P(A), which is the same as P(A and B) = P(A) · P(B). Mutually exclusive events with positive probability are never independent.',
      'Drawing WITHOUT replacement makes the second probability depend on the first draw; drawing with replacement keeps the draws independent.',
    ],
    examples: [
      { q: 'Two dice are rolled. What is the probability of at least one six?', steps: ['The complement of "at least one six" is "no sixes."', 'P(no six on a die) = 5/6, and the dice are independent, so P(no sixes) = 5/6 × 5/6 = 25/36.', 'P(at least one six) = 1 − 25/36 = 11/36 ≈ 0.306.'], answer: '11/36' },
      { q: 'Of 100 students, 55 play a sport, 50 play music, and 30 do both. Find P(sport or music).', steps: ['P(S) = 0.55, P(M) = 0.50, P(S and M) = 0.30.', 'P(S or M) = 0.55 + 0.50 − 0.30.', '= 0.75. (Check with a Venn diagram: 25 + 30 + 20 = 75 students.)'], answer: '0.75' },
      { q: 'Same 100 students. Given that a student plays a sport, what is the probability they also play music?', steps: ['P(M | S) = P(M and S) / P(S).', '= 0.30 / 0.55 = 30/55.', '≈ 0.545. Among the 55 athletes, 30 play music.'], answer: '30/55 ≈ 0.545' },
      { q: 'Are "plays a sport" and "plays music" independent for these students?', steps: ['Independent would mean P(M | S) = P(M).', 'P(M | S) ≈ 0.545 but P(M) = 0.50.', 'Not equal, so not independent: athletes are a bit more likely to play music. (Also 0.55 × 0.50 = 0.275 ≠ 0.30.)'], answer: 'no — 0.545 ≠ 0.50' },
      { q: 'A bag has 3 red and 2 blue marbles. Two are drawn without replacement. Find P(both red) and P(one of each color).', steps: ['P(RR) = 3/5 × 2/4 = 6/20 = 3/10.', 'P(RB) = 3/5 × 2/4 = 6/20 and P(BR) = 2/5 × 3/4 = 6/20.', 'P(one of each) = 6/20 + 6/20 = 12/20 = 3/5. (And P(BB) = 2/5 × 1/4 = 1/10; the three add to 1.)'], answer: 'P(RR) = 3/10, P(one each) = 3/5' },
      { q: '10% of people have a condition. The test is positive for 90% of people who have it and for 20% of people who do not. A random person tests positive. What is the probability they actually have the condition?', steps: ['P(have and +) = 0.10 × 0.90 = 0.09. P(not have and +) = 0.90 × 0.20 = 0.18.', 'P(+) = 0.09 + 0.18 = 0.27.', 'P(have | +) = 0.09 / 0.27 = 1/3. Most positives are false positives because the condition is rare.'], answer: '1/3 ≈ 0.333' },
    ],
    practice: [
      { q: 'If P(A) = 0.35, what is P(not A)?', answers: ['0.65', '65%'], steps: ['Complement rule: 1 − P(A).', '1 − 0.35 = 0.65.', 'P(not A) = 0.65.'] },
      { q: 'P(A) = 0.4, P(B) = 0.5, P(A and B) = 0.2. Find P(A or B).', answers: ['0.7', '0.70', '70%'], steps: ['Addition rule: P(A) + P(B) − P(A and B).', '0.4 + 0.5 − 0.2.', '= 0.7.'] },
      { q: 'P(A) = 0.4, P(B) = 0.5, P(A and B) = 0.2. Are A and B independent? (yes/no)', answers: ['yes'], steps: ['Check P(A) × P(B) = 0.4 × 0.5 = 0.2.', 'That equals P(A and B) = 0.2.', 'Yes, independent.'] },
      { q: 'A bag has 3 red and 2 blue marbles. Two are drawn without replacement. What is P(both blue)?', answers: ['1/10', '0.1', '0.10', '10%'], steps: ['First blue: 2/5.', 'Second blue, with one blue gone: 1/4.', '2/5 × 1/4 = 2/20 = 1/10.'] },
    ],
    watchOut: 'Mutually exclusive is NOT independent. Disjoint events cannot both happen, so knowing one happened changes the other\'s probability to 0 — the opposite of independence. And P(A | B) is not P(B | A): the "given" event is always the denominator.',
  },
];
