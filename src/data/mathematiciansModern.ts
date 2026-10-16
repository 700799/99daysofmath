// Mathematicians working today, in the same format as the historical decks:
// who they are → the big idea → how it works (worked lines a student can
// follow) → why it matters to society → the unit in this app it connects to.
// Every slide carries a figure that IS the mathematics.
import type { MathematicianDeck } from './mathematicianDecks';
import { tex, draw, label, line, INK, DIM, HI, OK, NO, SKY } from './mathFigure';
import { WOLFE_PORTRAIT } from './portraits';

/** A rounded box with a line of text centred in it. */
function box(x: number, y: number, w: number, h: number, text: string, color = INK, size = 15): string {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="${color}" stroke-width="2.5"/>` +
    label(x + w / 2, y + h / 2 + size * 0.36, text, { size, fill: color })
  );
}

/** A dot at (x, y). */
const dot = (x: number, y: number, r = 6, fill = HI) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

/** Points evenly spaced on a circle, starting at the top. */
function ring(n: number, cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)];
  });
}

export const MODERN_MATHEMATICIAN_DECKS: MathematicianDeck[] = [
  // ── Combinatorics ─────────────────────────────────────────────────────
  {
    id: 'Dr. Adam Wolfe',
    name: 'Dr. Adam Wolfe',
    era: 'Ohio · Combinatorics',
    emoji: '🎲',
    tieIn: '6.SP · Probability & counting',
    tieInTo: '/trail/6.SP',
    portrait: WOLFE_PORTRAIT,
    slides: [
      {
        head: 'A mathematician who counts',
        body: 'Dr. Adam Wolfe grew up in Ohio and studied at the University of Vermont and at Ohio State University. He works on combinatorics: the mathematics of counting, arranging and choosing. Not counting one by one, but finding how many ways something can happen when the answer is in the millions. Every question in his field comes down to one of three.',
        figure: draw(
          'Three boxes naming the questions combinatorics asks: how many ways, does one exist, which is best',
          label(200, 40, 'Combinatorics asks three questions', { size: 15, fill: HI }) +
            box(60, 70, 280, 50, 'How many ways are there?', INK) +
            box(60, 140, 280, 50, 'Does an arrangement exist?', OK) +
            box(60, 210, 280, 50, 'Which arrangement is best?', SKY) +
            label(200, 296, 'count · exist · optimise', { size: 14, fill: DIM }),
          'Counting, existence, and the best choice',
        ),
      },
      {
        head: 'Counting without counting',
        body: 'Three shirts and two pairs of pants: how many outfits? You could list them, but there is a faster way. Every shirt goes with every pair of pants, so multiply: 3 times 2 is 6. This multiplication principle is the first tool in the combinatorics toolbox.',
        figure: draw(
          'A grid of three shirt columns by two pants rows, making six outfit cells',
          label(200, 36, '3 shirts × 2 pants', { size: 17, fill: HI }) +
            ['red', 'blue', 'green'].map((s, i) => label(110 + i * 90, 78, s, { size: 14, fill: SKY })).join('') +
            ['jeans', 'shorts'].map((p, j) => label(44, 128 + j * 70, p, { size: 14, fill: OK })).join('') +
            [0, 1, 2]
              .flatMap((i) =>
                [0, 1].map(
                  (j) =>
                    `<rect x="${72 + i * 90}" y="${95 + j * 70}" width="76" height="58" rx="10" fill="none" stroke="${INK}" stroke-width="2.5"/>` +
                    label(110 + i * 90, 130 + j * 70, `${i * 2 + j + 1}`, { size: 18, fill: HI }),
                ),
              )
              .join('') +
            label(200, 272, '6 outfits, no list needed', { size: 15, fill: INK }) +
            label(200, 298, 'choices multiply', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'When order matters',
        body: 'Four runners finish a race. How many finishing orders are possible? Any of 4 can be first, then 3 are left for second, then 2, then 1. Multiply: 4 × 3 × 2 × 1 = 24. That product has a name, four factorial, written 4!, and it counts every way to line things up.',
        figure: tex(['4! = 4 \\times 3 \\times 2 \\times 1 = 24', '5! = 120', '10! = 3{,}628{,}800'], 'Factorials count orderings'),
      },
      {
        head: 'When order does not matter',
        body: 'Pick 2 toppings from 5 for a pizza. Cheese-then-olives is the same pizza as olives-then-cheese, so order does not count. Start with the ordered ways, 5 × 4 = 20, then divide by the 2 orders each pair can come in. There are 10 pizzas. This is a combination.',
        figure: tex(['\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10', '\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}'], 'Choose k from n: order thrown away'),
      },
      {
        head: 'Pascal\'s triangle',
        body: 'Write the combinations in rows and a pattern appears: every number is the sum of the two above it. Row 5 reads 1, 5, 10, 10, 5, 1, and there is the 10 from the pizza. Combinatorialists use this triangle the way musicians use scales.',
        figure: draw(
          'Six rows of Pascal’s triangle with the 10s in row five highlighted',
          label(200, 36, 'Pascal’s triangle', { size: 17, fill: HI }) +
            [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]]
              .map((row, r) =>
                row
                  .map((n, i) =>
                    label(200 + (i - (row.length - 1) / 2) * 46, 76 + r * 36, String(n), {
                      size: 16,
                      fill: r === 5 && n === 10 ? HI : INK,
                    }),
                  )
                  .join(''),
              )
              .join('') +
            // the 4 and 6 in row 4 add to the first 10 in row 5
            line(158, 228, 172, 240, HI, 2.5) +
            line(196, 228, 182, 240, HI, 2.5) +
            `<rect x="158" y="238" width="38" height="24" rx="8" fill="none" stroke="${HI}" stroke-width="2.5"/>` +
            label(200, 296, 'Each number is the sum of the two above it', { size: 13, fill: DIM }),
          'Row 5: choose 2 from 5 is 10',
        ),
      },
      {
        head: 'The pigeonhole principle',
        body: 'Put 13 people in a room. Two of them must share a birthday month, because there are only 12 months to go around. No birthdays needed: the count alone proves it. This simple idea, more items than boxes, powers surprisingly deep results.',
        figure: draw(
          'Twelve month boxes with thirteen dots, two of them landing in the same box',
          label(200, 36, '13 people, 12 months', { size: 17, fill: HI }) +
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              .map((m, i) => {
                const x = 32 + (i % 6) * 58;
                const y = 70 + Math.floor(i / 6) * 96;
                return (
                  `<rect x="${x}" y="${y}" width="50" height="76" rx="8" fill="none" stroke="${DIM}" stroke-width="2"/>` +
                  label(x + 25, y + 18, m, { size: 11, fill: DIM }) +
                  (i === 0 ? dot(x + 16, y + 48, 7, NO) + dot(x + 34, y + 48, 7, NO) : dot(x + 25, y + 48, 7, OK))
                );
              })
              .join('') +
            label(200, 290, 'Two must share a box', { size: 15, fill: NO }),
          'More pigeons than holes: two share',
        ),
      },
      {
        head: 'Why it matters: your passwords',
        body: 'A password of 8 characters, each one of 62 letters and digits, has 62 to the power 8 possibilities: over 200 trillion. Combinatorics tells security experts exactly how long a code must be to stay safe, and how many guesses an attacker would need.',
        figure: tex(['62^{8} \\approx 2.2 \\times 10^{14}', '62^{12} \\approx 3.2 \\times 10^{21}'], 'Longer codes: vastly more guesses'),
      },
      {
        head: 'Why it matters: routes and deliveries',
        body: 'A delivery van must visit 5 towns and come home. There are 12 different round trips, and with 10 towns there are 181,440. Combinatorics finds the shortest one, which is how parcels, airline crews and school buses are scheduled every day.',
        figure: draw(
          'Five towns joined by every possible road, with one round trip highlighted',
          label(200, 36, '5 towns, 12 round trips', { size: 17, fill: HI }) +
            (() => {
              const P = ring(5, 200, 170, 90);
              let s = '';
              for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) s += line(P[i][0], P[i][1], P[j][0], P[j][1], DIM, 2);
              const tour = [0, 2, 4, 1, 3, 0];
              for (let k = 0; k < 5; k++) s += line(P[tour[k]][0], P[tour[k]][1], P[tour[k + 1]][0], P[tour[k + 1]][1], HI, 4);
              const names = ['A', 'B', 'C', 'D', 'E'];
              const off: [number, number][] = [[0, -16], [18, -2], [12, 22], [-12, 22], [-18, -2]];
              P.forEach(([x, y], i) => { s += dot(x, y, 8, INK) + label(x + off[i][0], y + off[i][1] + 5, names[i], { size: 14, fill: INK }); });
              return s;
            })() +
            label(200, 300, 'the shortest tour saves fuel and time', { size: 13, fill: DIM }),
          'Which of the 12 tours is shortest?',
        ),
      },
      {
        head: 'Why it matters: DNA and medicine',
        body: 'DNA is written in four letters: A, C, G and T. A stretch of just 10 letters has 4 to the power 10 arrangements, more than a million. Counting them is how scientists design genetic tests, and how drug trials are arranged so every combination gets a fair check.',
        figure: tex(['4^{10} = 1{,}048{,}576', '4^{20} \\approx 1.1 \\times 10^{12}'], 'Ten letters, a million possible words'),
      },
      {
        head: 'Why it matters: fair games and lotteries',
        body: 'Choose 6 numbers from 49. There are 13,983,816 ways to do it, so the chance of matching all six is one in fourteen million. Combinatorics lets you see a game\'s true odds before you play, and lets regulators check that a game is honest.',
        figure: tex(['\\binom{49}{6} = 13{,}983{,}816', 'P(\\text{jackpot}) = \\frac{1}{13{,}983{,}816}'], 'Counting the ways is counting the odds'),
      },
      {
        head: 'Where it began: seven bridges',
        body: 'In 1736 the city of Königsberg had seven bridges joining two islands and two riverbanks. Could you walk across every bridge exactly once? Leonhard Euler counted how many bridges touched each piece of land and proved it was impossible. Graph theory, a huge branch of combinatorics, was born.',
        figure: draw(
          'Two banks and two islands as dots, with seven bridges drawn between them and the bridge count at each land',
          label(200, 30, 'Königsberg, 1736', { size: 16, fill: HI }) +
            (() => {
              const N: [number, number] = [200, 72], S: [number, number] = [200, 268], A: [number, number] = [110, 170], B: [number, number] = [300, 170];
              const curve = (p: [number, number], q: [number, number], bend: number) =>
                `<path d="M ${p[0]} ${p[1]} Q ${(p[0] + q[0]) / 2 + bend} ${(p[1] + q[1]) / 2} ${q[0]} ${q[1]}" fill="none" stroke="${DIM}" stroke-width="3"/>`;
              return (
                curve(N, A, -22) + curve(N, A, 22) + curve(S, A, -22) + curve(S, A, 22) +
                line(A[0], A[1], B[0], B[1], DIM, 3) + line(N[0], N[1], B[0], B[1], DIM, 3) + line(S[0], S[1], B[0], B[1], DIM, 3) +
                dot(N[0], N[1], 11, INK) + dot(S[0], S[1], 11, INK) + dot(A[0], A[1], 11, HI) + dot(B[0], B[1], 11, INK) +
                label(200, 54, 'north bank · 3', { size: 13, fill: NO }) +
                label(200, 296, 'south bank · 3', { size: 13, fill: NO }) +
                label(60, 175, 'A · 5', { size: 13, fill: NO }) +
                label(350, 175, 'B · 3', { size: 13, fill: NO })
              );
            })(),
          'Every land is odd, so no walk exists',
        ),
      },
      {
        head: 'Order hides in every crowd',
        body: 'Invite any 6 people to a party. Among them, there must be 3 who all know each other, or 3 who are all strangers. You cannot avoid it. This is Ramsey theory: with enough things, some pattern is forced to appear. Combinatorialists find exactly how many is enough.',
        figure: draw(
          'Six people as dots with every pair joined by a friend or stranger line, and one all-friends triangle highlighted',
          label(200, 36, '6 people, every pair friends or strangers', { size: 14, fill: HI }) +
            (() => {
              const P = ring(6, 200, 176, 92);
              const friends = new Set(['0-2', '2-4', '0-4', '0-1', '2-3', '4-5']);
              let s = '';
              for (let i = 0; i < 6; i++)
                for (let j = i + 1; j < 6; j++) {
                  const f = friends.has(`${i}-${j}`);
                  s += line(P[i][0], P[i][1], P[j][0], P[j][1], f ? OK : NO, f ? 2.5 : 1.5, f ? undefined : '5 5');
                }
              for (const [a, b] of [[0, 2], [2, 4], [4, 0]]) s += line(P[a][0], P[a][1], P[b][0], P[b][1], HI, 5);
              P.forEach(([x, y]) => { s += dot(x, y, 8, INK); });
              return s;
            })() +
            label(200, 300, 'three mutual friends, guaranteed', { size: 13, fill: HI }),
          'Solid = friends, dashed = strangers',
        ),
      },
      {
        head: 'Why computers need combinatorics',
        body: 'Counts grow faster than any computer. Twenty items can be ordered in about 2 quintillion ways; sixty items have more orderings than there are atoms in the universe. A computer cannot try them all. Combinatorics finds the clever shortcuts that make the impossible search possible.',
        figure: tex(['20! \\approx 2.4 \\times 10^{18}', '60! \\approx 8.3 \\times 10^{81}', '\\text{atoms in the universe} \\approx 10^{80}'], 'Brute force fails; clever counting wins'),
      },
      {
        head: 'Your turn: 6.SP',
        body: 'In this app\'s Statistics & Probability unit, every probability is favorable outcomes divided by total outcomes. Both numbers come from counting, and when the outcomes run into the thousands, the counting tools in this deck are how you find them without a list.',
        figure: tex(['P = \\frac{\\text{favorable}}{\\text{total}}', 'P(\\text{two heads in 2 flips}) = \\frac{1}{4}'], 'Count the ways, then divide'),
      },
    ],
  },
];
