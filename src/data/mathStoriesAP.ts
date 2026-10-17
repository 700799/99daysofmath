// One Math Story for each AP course, illustrated the way the high-school
// stories are: a drawn figure on every beat, no video.
import type { Story } from './stories';
import { tex, draw, label, line, arrow, arc, INK, DIM, HI, OK, NO, SKY } from './mathFigure';

const DARK = '#1e1b4b'; // text on a bright fill

// ── Archimedes: the parabola y = x² with the chord from (−1, 1) to (1, 1) ──
// Canvas mapping shared by every parabola figure so they line up beat to beat.
const PX = (x: number) => 200 + 120 * x;
const PY = (y: number) => 270 - 180 * y;
/** Points of y = x² from x = a to x = b as an SVG path fragment (no M). */
function paraPts(a: number, b: number, n = 40): string {
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = a + ((b - a) * i) / n;
    return `${PX(x).toFixed(1)} ${PY(x * x).toFixed(1)}`;
  }).join(' L ');
}
const PARABOLA = `<path d="M ${paraPts(-1.05, 1.05)}" fill="none" stroke="${INK}" stroke-width="3.5"/>`;
const CHORD = line(PX(-1), PY(1), PX(1), PY(1), INK, 3);
/** The segment between the chord and the curve, filled. */
const SEGMENT = (fill: string, opacity: number) => `<path d="M ${PX(-1)} ${PY(1)} L ${PX(1)} ${PY(1)} L ${paraPts(1, -1)} Z" fill="${fill}" opacity="${opacity}"/>`;
const tri = (pts: [number, number][], fill: string, opacity = 0.8, stroke = 'none') =>
  `<polygon points="${pts.map(([x, y]) => `${PX(x).toFixed(1)},${PY(y).toFixed(1)}`).join(' ')}" fill="${fill}" opacity="${opacity}" stroke="${stroke}" stroke-width="1.5"/>`;
// Stage 1: the big triangle. Stage 2: one in each sliver (area 1/8 each).
// Stage 3: four more (1/64 each). Vertices sit where the tangent is parallel to the chord.
const T1: [number, number][] = [[-1, 1], [0, 0], [1, 1]];
const T2: [number, number][][] = [[[-1, 1], [-0.5, 0.25], [0, 0]], [[1, 1], [0.5, 0.25], [0, 0]]];
const T3: [number, number][][] = [
  [[-1, 1], [-0.75, 0.5625], [-0.5, 0.25]], [[-0.5, 0.25], [-0.25, 0.0625], [0, 0]],
  [[1, 1], [0.75, 0.5625], [0.5, 0.25]], [[0.5, 0.25], [0.25, 0.0625], [0, 0]],
];

/** A small parabolic segment (chord on top) centred at cx with the chord at y. */
function miniSegment(cx: number, y: number, hw: number, depth: number, fill: string, opacity = 0.8): string {
  const pts = Array.from({ length: 25 }, (_, i) => {
    const t = -1 + i / 12;
    return `${(cx + hw * t).toFixed(1)} ${(y + depth * (1 - t * t)).toFixed(1)}`;
  }).join(' L ');
  return `<path d="M ${cx - hw} ${y} L ${cx + hw} ${y} L ${pts} Z" fill="${fill}" opacity="${opacity}"/>`;
}

/** A horizontal timeline from `a` to `b` with labelled marks and named ends. */
function timeline(a: number, b: number, ends: [string, string], marks: { at: number; text: string; hi?: boolean }[]): string {
  const x = (n: number) => 40 + ((n - a) / (b - a)) * 320;
  let out = line(40, 170, 360, 170, DIM, 3);
  out += label(40, 200, ends[0], { size: 12, fill: DIM }) + label(360, 200, ends[1], { size: 12, fill: DIM });
  marks.forEach((m, i) => {
    const px = x(m.at);
    const up = i % 2 === 0;
    out += `<circle cx="${px.toFixed(1)}" cy="170" r="${m.hi ? 9 : 6}" fill="${m.hi ? HI : INK}"/>`;
    out += line(px, 170, px, up ? 120 : 220, m.hi ? HI : DIM, 2);
    out += label(px, up ? 108 : 244, m.text, { size: 13, fill: m.hi ? HI : INK });
  });
  return out;
}

// ── Lady tasting tea: teacups ────────────────────────────────────────────
/** A teacup on a saucer, body `w` wide and `h` tall with its rim at `top`. */
function cup(x: number, top: number, w: number, h: number, fill: string, text?: string, textFill = DARK): string {
  const r = h / 4, l = x - w / 2, rt = x + w / 2, k = w * 0.18, b = top + h;
  return (
    `<path d="M ${l} ${top} L ${rt} ${top} L ${rt - k} ${b - 5} Q ${x} ${b + 4} ${l + k} ${b - 5} Z" fill="${fill}"/>` +
    arc(rt, top + h / 2, r, -90, 180, INK, 3) +
    line(l - 6, b + 7, rt + 6, b + 7, DIM, 3) +
    (text ? label(x, top + h / 2 + 5, text, { size: Math.max(11, Math.round(h * 0.45)), fill: textFill }) : '')
  );
}
const MILK = INK; // milk poured first: a paler cup
const TEA = HI; // tea poured first
/** A die showing five, for "settled by chance". */
function die(x: number, y: number, s = 40): string {
  const d = s / 4;
  return (
    `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s / 5}" fill="${INK}"/>` +
    [[d, d], [3 * d, d], [2 * d, 2 * d], [d, 3 * d], [3 * d, 3 * d]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${s / 11}" fill="${DARK}"/>`).join('')
  );
}
/** A tick mark centred at (x, y). */
const tick = (x: number, y: number, stroke = OK) => `<path d="M ${x - 8} ${y} L ${x - 2} ${y + 6} L ${x + 9} ${y - 7}" fill="none" stroke="${stroke}" stroke-width="3.5"/>`;

export const AP_STORIES: Story[] = [
  // ── AP Calculus AB · Unit 11 Riemann sums and the definite integral ───
  {
    id: 'CALC-11-archimedes',
    domain: 'CALC',
    unit: 11,
    title: 'Story: Archimedes fills a curve with triangles',
    subtitle: 'How a sum of ever-smaller triangles found the area under a parabola, 2,000 years before calculus',
    learned: 'Fill a curved region with pieces you can measure, add them up, and let the pieces shrink. The segment is 4/3 of its triangle, and the Riemann sum is the same idea with rectangles.',
    learnedFigure: draw(
      'A parabolic segment equals four thirds of the triangle inscribed in it',
      miniSegment(95, 130, 55, 70, HI) +
        label(182, 175, '=', { size: 26 }) +
        label(235, 175, '4/3 ×', { size: 22, fill: OK }) +
        `<polygon points="280,130 335,200 390,130" fill="${OK}" opacity="0.8"/>` +
        label(95, 230, 'segment', { size: 13, fill: HI }) +
        label(335, 230, 'triangle', { size: 13, fill: OK }) +
        label(200, 60, 'what Archimedes proved', { size: 17, fill: HI }) +
        label(200, 290, 'the first area found by adding up pieces', { size: 13, fill: DIM }),
    ),
    beats: [
      {
        head: 'A shape with a curved edge',
        body: 'Around 250 BC, in Syracuse on the island of Sicily, Archimedes took on a problem the Greeks had never cracked. They could find the area of any shape with straight sides by cutting it into triangles. But a region with a curved edge, like the one between a parabola and a straight chord, had no formula at all.',
        figure: draw(
          'A parabola with a chord across it and the region between them shaded, marked area = ?',
          SEGMENT(HI, 0.35) + PARABOLA + CHORD +
            label(200, 200, 'area = ?', { size: 22, fill: HI }) +
            label(200, 76, 'chord', { size: 13, fill: DIM }) +
            label(330, 210, 'parabola', { size: 13, fill: DIM }) +
            label(200, 36, 'a shape with a curved edge', { size: 15, fill: HI }) +
            label(200, 305, 'straight sides: triangles. curved side: ?', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'The biggest triangle that fits',
        body: 'Archimedes started with the largest triangle the region can hold: the chord as its base, and its third corner at the point where the parabola is farthest from the chord. Take the parabola y = x² with the chord from (−1, 1) to (1, 1). The far point is the origin, so the triangle has base 2, height 1 and area 1.',
        figure: draw(
          'The inscribed triangle with vertices (−1, 1), (0, 0) and (1, 1), base 2 and height 1, area 1',
          SEGMENT(HI, 0.15) + tri(T1, OK, 0.55) + PARABOLA + CHORD +
            line(200, PY(1), 200, PY(0), INK, 2, '6 5') +
            `<circle cx="200" cy="270" r="6" fill="${HI}"/>` +
            label(200, 76, 'base = 2', { size: 13 }) +
            label(56, 112, '(−1, 1)', { size: 12, fill: DIM, anchor: 'end' }) + label(344, 112, '(1, 1)', { size: 12, fill: DIM, anchor: 'start' }) +
            label(212, 130, 'height = 1', { size: 13, anchor: 'start' }) +
            label(230, 280, 'vertex (0, 0)', { size: 12, fill: DIM, anchor: 'start' }) +
            label(200, 36, 'the biggest triangle that fits', { size: 15, fill: HI }) +
            label(200, 305, 'area = ½ · 2 · 1 = 1', { size: 15, fill: OK }),
        ),
      },
      {
        head: 'Two slivers, two more triangles',
        body: 'The triangle does not fill the region. Two thin slivers are left over, one on each side, and each is itself a parabolic segment with its own chord. So Archimedes did the same thing again: he fitted the biggest triangle into each sliver. Then he proved a beautiful fact about parabolas. Each new triangle has exactly one eighth the area of the big one.',
        figure: draw(
          'The big triangle of area 1 with a smaller triangle of area 1/8 fitted into each leftover sliver',
          SEGMENT(HI, 0.15) + tri(T1, DIM, 0.3) + T2.map((t) => tri(t, HI, 0.85)).join('') + PARABOLA + CHORD +
            label(200, 200, '1', { size: 20, fill: DIM }) +
            label(96, 180, '1/8', { size: 14, fill: HI }) + label(304, 180, '1/8', { size: 14, fill: HI }) +
            label(128, 246, '(−½, ¼)', { size: 12, fill: DIM, anchor: 'end' }) +
            label(272, 246, '(½, ¼)', { size: 12, fill: DIM, anchor: 'start' }) +
            label(200, 36, 'two slivers, two more triangles', { size: 15, fill: HI }) +
            label(200, 305, '1 + 1/8 + 1/8 = 1 + 1/4', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'Then four more, then eight',
        body: 'Two triangles of one eighth each add one quarter. They leave four slivers, and the four triangles that fill those add one sixteenth. Eight more add one sixty-fourth. Every stage adds exactly a quarter of the stage before it, and every stage leaves slivers thinner than the last. Archimedes could keep going for as long as he liked.',
        figure: draw(
          'Three stages of triangles filling the parabolic segment: one of area 1, two of 1/8, four of 1/64',
          SEGMENT(HI, 0.1) + tri(T1, DIM, 0.3) + T2.map((t) => tri(t, HI, 0.7)).join('') + T3.map((t) => tri(t, NO, 0.95)).join('') + PARABOLA + CHORD +
            label(200, 30, 'then four more, then eight …', { size: 15, fill: HI }) +
            label(200, 60, 'each new triangle: 1/8 of the one before', { size: 13, fill: DIM }) +
            label(90, 300, '1', { size: 15 }) +
            label(140, 300, '+ 1/4', { size: 15, fill: HI }) +
            label(205, 300, '+ 1/16', { size: 15, fill: NO }) +
            label(300, 300, '+ 1/64 + …', { size: 15, fill: DIM }),
        ),
      },
      {
        head: 'The sum that never spills over',
        body: 'Add up the pieces: 1 + 1/4 + 1/16 + 1/64 and so on. Archimedes showed that however many terms you take, the sum plus one third of the last term is always exactly 4/3. For example, 1/4 + 1/16 plus a third of 1/16 is 1/3. So the triangles never add up to more than four thirds of the first one, and they get as close to it as you like.',
        figure: tex(
          ['T\\left(1 + \\tfrac{1}{4} + \\tfrac{1}{16} + \\tfrac{1}{64} + \\cdots\\right)', '\\tfrac{1}{4} + \\tfrac{1}{16} + \\tfrac{1}{3}\\cdot\\tfrac{1}{16} = \\tfrac{1}{3}', '\\text{segment} = \\tfrac{4}{3}\\,T'],
          'Archimedes’ sum: four thirds of the first triangle',
        ),
      },
      {
        head: 'Squeezed from both sides',
        body: 'The Greeks did not trust infinite sums; Zeno’s paradoxes had taught them caution. So Archimedes argued in two halves. If the area were more than four thirds, the slivers shrink until the triangles alone pass four thirds, which they never do. If it were less, the triangles inside the region would eventually outgrow it. The only number left is exactly four thirds. This is the method of exhaustion.',
        figure: draw(
          'A staircase of partial sums 1, 1.25, 1.3125, 1.328, 1.332 climbing toward a dashed line at 4/3 T without crossing it',
          (() => {
            const vals = [1, 1.25, 1.3125, 1.328125, 1.33203125];
            const xs = [90, 150, 210, 270, 330];
            const y = (v: number) => 250 - (v - 1) * 480;
            let out = line(40, 90, 360, 90, NO, 2.5, '7 5') + label(352, 78, '4/3 T', { size: 14, fill: NO, anchor: 'end' });
            out += line(90, 92, 90, 250, DIM, 2, '4 4') + label(82, 170, 'gap = 1/3', { size: 12, fill: DIM, anchor: 'end' });
            vals.forEach((v, i) => {
              if (i < vals.length - 1) out += line(xs[i], y(v), xs[i + 1], y(v), HI, 3) + line(xs[i + 1], y(v), xs[i + 1], y(vals[i + 1]), HI, 3);
              out += `<circle cx="${xs[i]}" cy="${y(v).toFixed(1)}" r="7" fill="${OK}"/>`;
              out += label(xs[i], 275, ['1', '1.25', '1.3125', '1.328', '1.332'][i], { size: 12, fill: OK });
            });
            return out;
          })() +
            label(200, 36, 'never past 4/3 T, never short of it', { size: 15, fill: HI }) +
            label(200, 300, 'each stage cuts the gap by 4', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Weigh it first, prove it later',
        body: 'How did he guess four thirds in the first place? In a letter to Eratosthenes, the man who measured the Earth, Archimedes confessed his secret. He imagined slicing the segment into thin strips and hanging them on one arm of a lever, where they balanced against a triangle. The balance told him the area. Then he found a proof that would satisfy a geometer.',
        figure: draw(
          'A lever on a fulcrum with a parabolic segment hanging from one arm balancing a triangle hanging from the other',
          line(50, 170, 350, 170, INK, 5) +
            `<polygon points="200,170 182,212 218,212" fill="${DIM}"/>` +
            line(100, 170, 100, 200, DIM, 2) + line(300, 170, 300, 200, DIM, 2) +
            miniSegment(100, 200, 40, 50, HI) +
            `<polygon points="265,200 300,250 335,200" fill="${OK}" opacity="0.8"/>` +
            label(100, 275, 'segment', { size: 13, fill: HI }) +
            label(300, 275, 'triangle', { size: 13, fill: OK }) +
            label(200, 232, 'fulcrum', { size: 12, fill: DIM }) +
            label(200, 40, 'weigh it first, prove it later', { size: 15, fill: HI }) +
            label(200, 305, 'the lever gave the answer; the proof came after', { size: 12, fill: DIM }),
        ),
      },
      {
        head: 'The lost letter',
        body: 'That letter vanished for centuries. A monk copied it onto parchment around the year 975. In 1229 another monk scraped the parchment clean and wrote a prayer book over it. In 1906 a Danish scholar, Johan Heiberg, spotted the faint mathematics underneath. The book sold at auction in 1998 for two million dollars, and by 2008 X-rays had read even the pages the eye could not.',
        figure: draw(
          'A timeline from 250 BC to today marking the letter written, copied, scraped off, found again and read by X-ray',
          timeline(-300, 2050, ['c. 250 BC', 'now'], [
            { at: -250, text: 'written' },
            { at: 975, text: 'copied' },
            { at: 1229, text: 'scraped off' },
            { at: 1906, text: 'found' },
            { at: 2008, text: 'X-rayed', hi: true },
          ]) +
            label(200, 44, 'the lost letter: the Archimedes Palimpsest', { size: 13, fill: HI }),
        ),
      },
      {
        head: 'Rectangles instead of triangles',
        body: 'Calculus arrived in the 1660s with Newton and Leibniz, and in 1854 Bernhard Riemann gave the area under a curve its modern definition. Cut the region into n thin rectangles, add their areas, and let n grow without limit. Eight rectangles under our parabola give 1.344. Sixteen give 1.336. The limit is exactly four thirds, the number Archimedes found with triangles.',
        figure: draw(
          'Eight midpoint rectangles filling the parabolic segment, their total 1.344 beside the exact area 4/3',
          Array.from({ length: 8 }, (_, k) => {
            const x = -0.875 + 0.25 * k;
            const top = PY(1), bottom = PY(x * x);
            return `<rect x="${(PX(x) - 15).toFixed(1)}" y="${top}" width="30" height="${(bottom - top).toFixed(1)}" fill="${SKY}" opacity="0.45" stroke="${INK}" stroke-width="1.5"/>`;
          }).join('') + PARABOLA + CHORD +
            label(200, 36, 'rectangles instead of triangles', { size: 15, fill: HI }) +
            label(342, 236, 'Riemann, 1854', { size: 12, fill: DIM }) +
            label(110, 300, '8 rectangles ≈ 1.344', { size: 13, fill: SKY }) +
            label(290, 300, 'exact: 4/3 = 1.333…', { size: 13, fill: OK }),
        ),
      },
      {
        head: 'Unit 11, two thousand years early',
        body: 'That is the Riemann sum, and the limit it closes in on is the definite integral. Unit 11 of this course is where you build it: left sums, right sums, midpoint sums, then the integral sign that stands for the limit of all of them. Archimedes got there first, two thousand years early, with nothing but triangles and a stubborn refusal to be fooled by infinity.',
        figure: tex(
          ['\\text{Area} = \\lim_{n \\to \\infty} \\sum_{k=1}^{n} f(x_k)\\,\\Delta x = \\int_a^b f(x)\\,dx', '\\int_{-1}^{1} (1 - x^2)\\,dx = \\tfrac{4}{3}'],
          'Unit 11: Riemann sums and the definite integral',
        ),
      },
    ],
  },

  // ── AP Statistics · Unit 6 Experiments, randomization, confounding ────
  {
    id: 'STAT-6-lady-tasting-tea',
    domain: 'STAT',
    unit: 6,
    title: 'Story: The lady tasting tea',
    subtitle: 'Eight cups, a shuffled order, and the one-in-seventy chance that started the significance test',
    learned: 'Randomize the experiment, assume the effect is not real, and ask how rare the result would be by luck alone. One in seventy is rare enough to believe her.',
    learnedFigure: tex(
      ['\\binom{8}{4} = 70, \\qquad P(\\text{perfect by luck}) = \\tfrac{1}{70} \\approx 0.014', '0.014 < 0.05 \\;\\Rightarrow\\; \\text{not luck: she can tell}'],
      'Randomize, then ask how much luck it would take',
    ),
    beats: [
      {
        head: 'Tea at Rothamsted',
        body: 'In the late 1920s, at the Rothamsted agricultural research station in England, the scientists took tea together each afternoon. One day Ronald Fisher handed a cup to Dr Muriel Bristol, an algae specialist, and she declined it: he had poured the milk in after the tea, and she preferred it the other way. She could taste the difference, she said. Fisher did not believe her.',
        figure: draw(
          'Two teacups side by side, one with milk poured first and one with tea poured first, and a question mark between them',
          cup(110, 120, 80, 64, MILK) + cup(290, 120, 80, 64, TEA) +
            label(200, 165, '?', { size: 30, fill: HI }) +
            label(110, 230, 'milk first', { size: 14, fill: INK }) +
            label(290, 230, 'tea first', { size: 14, fill: HI }) +
            label(200, 40, 'can she taste the difference?', { size: 15, fill: HI }) +
            label(200, 290, 'Rothamsted, England, late 1920s', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'How many cups?',
        body: 'A colleague, William Roach, said: let us test her. But how? Give her one cup and a lucky guess is right half the time. Give her two cups, one of each kind, and a guess is still right half the time. Fisher wanted a test that a guesser would almost surely fail, but that a real taster could pass. More cups meant less room for luck.',
        figure: draw(
          'Horizontal bars showing the chance of a perfect score by guessing: 1 in 2 with one or two cups, 1 in 6 with four, 1 in 20 with six, 1 in 70 with eight',
          [['1 cup', 1 / 2, '1 in 2'], ['2 cups', 1 / 2, '1 in 2'], ['4 cups', 1 / 6, '1 in 6'], ['6 cups', 1 / 20, '1 in 20'], ['8 cups', 1 / 70, '1 in 70']]
            .map(([name, p, txt], i) => {
              const y = 80 + i * 45, w = Math.max(5, Number(p) * 440);
              const c = i === 4 ? OK : SKY;
              return `<rect x="110" y="${y}" width="${w.toFixed(1)}" height="28" rx="4" fill="${c}"/>` +
                label(100, y + 19, String(name), { size: 13, anchor: 'end' }) +
                label(118 + w, y + 19, String(txt), { size: 13, fill: c, anchor: 'start' });
            }).join('') +
            label(200, 40, 'chance of a perfect score by luck', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'Eight cups, four of each',
        body: 'Fisher settled on eight cups: four with the milk poured first, four with the tea poured first, made as alike as possible in every other way. He told her the split, four and four, and asked her to sort them into two groups. That one decision, four of each kind, is what makes the arithmetic that follows come out so cleanly.',
        figure: draw(
          'Eight teacups in two groups of four: four milk-first cups and four tea-first cups',
          [44, 87, 130, 173].map((x) => cup(x, 140, 30, 26, MILK, 'M')).join('') +
            [227, 270, 313, 356].map((x) => cup(x, 140, 30, 26, TEA, 'T')).join('') +
            label(108, 205, 'milk first', { size: 13, fill: INK }) +
            label(282, 205, 'tea first', { size: 13, fill: HI }) +
            label(200, 50, 'eight cups, four of each kind', { size: 15, fill: HI }) +
            label(200, 255, 'her task: pick out the 4 milk-first cups', { size: 13, fill: DIM }) +
            label(200, 290, 'same tea, same cups, same milk', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'The order is chosen by chance',
        body: 'Then came the crucial step. The cups were presented in random order, settled by a genuine chance device, not by whatever order felt fair. If the milk-first cups had all come first they would have cooled a little longer, and she might sense the temperature, not the milk. Randomizing removes every such clue. Nothing but her palate, or luck, can now produce a right answer.',
        figure: draw(
          'A die above eight identical cups in a row numbered 1 to 8, each marked with a question mark: the order was chosen by chance',
          die(180, 56) +
            Array.from({ length: 8 }, (_, i) => cup(50 + i * 43, 150, 30, 26, DIM, '?', INK) + label(50 + i * 43, 206, `${i + 1}`, { size: 12, fill: DIM })).join('') +
            label(200, 36, 'the order is chosen by chance', { size: 15, fill: HI }) +
            label(200, 255, 'no pattern to spot: only tasting, or luck', { size: 13, fill: DIM }) +
            label(200, 290, 'randomize, so nothing else can differ', { size: 13, fill: OK }),
        ),
      },
      {
        head: 'Seventy ways to choose',
        body: 'Now count. She must name four cups as milk-first out of eight. The number of ways to choose four things from eight is 8 times 7 times 6 times 5, divided by 4 times 3 times 2 times 1, which is 70. Exactly one of those seventy choices is completely right. So a pure guesser gets a perfect score with probability one in seventy, about 1.4 percent.',
        figure: tex(
          ['\\binom{8}{4} = \\frac{8 \\cdot 7 \\cdot 6 \\cdot 5}{4 \\cdot 3 \\cdot 2 \\cdot 1} = 70', 'P(\\text{all 4 right by luck}) = \\tfrac{1}{70} \\approx 1.4\\%'],
          'Seventy ways to pick four cups; one of them is right',
        ),
      },
      {
        head: 'What about three right?',
        body: 'Should three out of four count as a pass? Count the ways: pick three of the four real milk-first cups, four ways, and one of the four tea-first cups by mistake, four ways, so sixteen choices score three. Add the one perfect choice and seventeen of the seventy ways get three or more right. That is 24 percent, nearly one guesser in four. Fisher ruled it out: only a perfect eight would do.',
        figure: draw(
          'A bar chart of the 70 ways to choose, by how many of the four milk-first cups they get right: 1, 16, 36, 16 and 1',
          line(40, 250, 360, 250, DIM, 3) +
            [1, 16, 36, 16, 1].map((n, k) => {
              const x = 70 + k * 65, h = n * 5;
              const c = k === 4 ? OK : k === 3 ? HI : SKY;
              return `<rect x="${x - 22}" y="${250 - h}" width="44" height="${h}" rx="4" fill="${c}"/>` +
                label(x, 242 - h, `${n}`, { size: 14, fill: c }) +
                label(x, 272, `${k}`, { size: 13 });
            }).join('') +
            label(330, 215, 'perfect', { size: 12, fill: OK }) +
            label(200, 298, 'milk-first cups named right (out of 4)', { size: 13, fill: DIM }) +
            label(200, 36, 'the 70 ways, by how many she gets right', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'A line in the sand',
        body: 'Here is Fisher’s logic, and it runs every significance test since. Start by assuming she cannot tell; call that the null hypothesis. Work out how likely her result would be under that assumption. A perfect score is one in seventy, about 1.4 percent, so rare that the assumption looks wrong. Three right, at 24 percent, is nothing special. Fisher drew the line at one in twenty: five percent.',
        figure: draw(
          'A probability scale from 0 to 30 percent with a dashed line at 5 percent, a dot at 1.4 percent for all four right and a dot at 24 percent for three or more right',
          `<rect x="50" y="165" width="50" height="30" fill="${OK}" opacity="0.25"/>` +
            line(50, 180, 350, 180, DIM, 3) +
            [0, 10, 20, 30].map((p) => line(50 + p * 10, 172, 50 + p * 10, 188, DIM, 2) + label(50 + p * 10, 212, `${p}%`, { size: 12, fill: DIM })).join('') +
            line(100, 90, 100, 235, INK, 2, '6 5') + label(100, 80, '5% line', { size: 13 }) +
            `<circle cx="64" cy="180" r="8" fill="${OK}"/>` +
            label(64, 130, 'all 4 right', { size: 13, fill: OK }) + label(64, 150, '1 in 70 ≈ 1.4%', { size: 13, fill: OK }) +
            `<circle cx="290" cy="180" r="8" fill="${NO}"/>` +
            label(290, 130, '3 or more right', { size: 13, fill: NO }) + label(290, 150, '17 in 70 ≈ 24%', { size: 13, fill: NO }) +
            label(200, 40, 'how rare, if she is only guessing?', { size: 15, fill: HI }) +
            label(200, 290, 'below 5%: convincing. above: could be luck', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'The story goes: all eight right',
        body: 'Fisher told the tale in his 1935 book The Design of Experiments, and he never recorded what happened. Those who were in the room said she sorted every cup correctly. If so, either she really could taste the milk, or a one-in-seventy fluke had just happened at the tea table. Fisher’s whole point was that you decide what counts as convincing before the first sip.',
        figure: draw(
          'Eight cups in a shuffled order with their true kind revealed and a tick above every one: all eight sorted right',
          ['T', 'M', 'M', 'T', 'M', 'T', 'T', 'M'].map((k, i) => cup(50 + i * 43, 150, 30, 26, k === 'M' ? MILK : TEA, k) + tick(50 + i * 43, 125)).join('') +
            label(200, 40, 'the story goes: all eight right', { size: 15, fill: HI }) +
            label(200, 215, 'her sorting, cup by cup', { size: 12, fill: DIM }) +
            label(200, 255, '1 chance in 70 to do that by luck', { size: 13, fill: OK }) +
            label(200, 290, 'Fisher’s book never records the outcome', { size: 12, fill: DIM }),
        ),
      },
      {
        head: 'From teacups to wheat fields',
        body: 'Fisher’s real job at Rothamsted was crop trials, and the teacups were a field experiment in miniature. Which fertiliser grows more wheat? Split the field into plots, assign the fertilisers to plots at random, and repeat each treatment on several plots. Random assignment means soil, drainage and sunshine cannot quietly favour one side. Afterwards, compare the yields against what chance alone could produce.',
        figure: draw(
          'A field divided into a four by four grid of plots, each labelled A or B for its fertiliser in a random arrangement',
          ['ABBA', 'BBAA', 'AABA', 'BABB'].map((row, r) => [...row].map((t, c) => {
            const x = 100 + c * 50, y = 80 + r * 40;
            return `<rect x="${x}" y="${y}" width="50" height="40" fill="${t === 'A' ? OK : SKY}" stroke="${DARK}" stroke-width="2"/>` + label(x + 25, y + 25, t, { size: 14, fill: DARK });
          }).join('')).join('') +
            label(200, 46, 'fertiliser A or B, plot by plot, at random', { size: 13, fill: HI }) +
            label(200, 268, 'Rothamsted wheat plots', { size: 13, fill: DIM }) +
            label(200, 298, 'randomize, replicate, compare', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'Every clinical trial since',
        body: 'That recipe runs every modern drug trial: volunteers assigned to treatment or placebo by chance, then a p-value that asks how much luck the result would take. An observational study cannot do this; people who choose tea may differ in a dozen other ways, and those differences, called confounders, hide inside the result. Unit 6 of this course is exactly that line: experiments versus observational studies, randomization versus confounding.',
        figure: draw(
          'A randomized experiment: a box of volunteers, an arrow to a coin flip, then arrows to a treatment group and a placebo group to be compared',
          `<rect x="40" y="140" width="100" height="40" rx="6" fill="none" stroke="${INK}" stroke-width="3"/>` +
            label(90, 165, 'volunteers', { size: 13 }) +
            arrow(142, 160, 176, 160, DIM, 2.5) +
            `<circle cx="200" cy="160" r="22" fill="${HI}"/>` + label(200, 165, 'flip', { size: 12, fill: DARK }) +
            arrow(216, 146, 262, 112, DIM, 2.5) + arrow(216, 174, 262, 208, DIM, 2.5) +
            `<rect x="262" y="90" width="108" height="38" rx="6" fill="${OK}" opacity="0.85"/>` + label(316, 114, 'treatment', { size: 13, fill: DARK }) +
            `<rect x="262" y="192" width="108" height="38" rx="6" fill="${SKY}" opacity="0.85"/>` + label(316, 216, 'placebo', { size: 13, fill: DARK }) +
            label(200, 40, 'a randomized experiment', { size: 15, fill: HI }) +
            label(200, 262, 'then compare the two groups', { size: 13, fill: DIM }) +
            label(200, 295, 'chance is the only other explanation', { size: 13, fill: HI }),
        ),
      },
    ],
  },
];
