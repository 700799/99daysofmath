// One Math Story per high-school course. These have no animation yet: every
// beat carries a figure instead, drawn the way the mathematician decks are,
// so the illustration pane still shows the mathematics being told.
import type { Story } from './stories';
import { tex, draw, label, line, arrow, arc, INK, DIM, HI, OK, NO, SKY } from './mathFigure';

/** A horizontal timeline from `a` to `b` with labelled marks. */
function timeline(a: number, b: number, marks: { at: number; text: string; hi?: boolean }[], fmt: (n: number) => string): string {
  const x = (n: number) => 40 + ((n - a) / (b - a)) * 320;
  let out = line(40, 170, 360, 170, DIM, 3);
  out += label(40, 200, fmt(a), { size: 12, fill: DIM }) + label(360, 200, fmt(b), { size: 12, fill: DIM });
  marks.forEach((m, i) => {
    const px = x(m.at);
    const up = i % 2 === 0;
    out += `<circle cx="${px.toFixed(1)}" cy="170" r="${m.hi ? 9 : 6}" fill="${m.hi ? HI : INK}"/>`;
    out += line(px, 170, px, up ? 120 : 220, m.hi ? HI : DIM, 2);
    out += label(px, up ? 108 : 244, m.text, { size: 13, fill: m.hi ? HI : INK });
  });
  return out;
}

export const HS_STORIES: Story[] = [
  // ── Algebra 1 · Unit 14 Quadratics ────────────────────────────────────
  {
    id: 'A1-14-galileo',
    domain: 'A1',
    unit: 14,
    title: 'Story: Galileo’s rolling ball',
    subtitle: 'How a ramp, a water clock and a bronze ball found the parabola',
    learned: 'Distance fallen grows with the SQUARE of the time — that is a quadratic, and its graph is a parabola.',
    beats: [
      {
        head: 'Too fast to time',
        body: 'Around 1600, in Pisa, Galileo wanted to know how things fall. Aristotle had said heavy things fall faster, and everyone believed him. But a falling stone is over in a blink, and there were no stopwatches. So Galileo slowed gravity down: he rolled a bronze ball along a smooth, gently sloped wooden ramp.',
        figure: draw(
          'A gently sloped ramp with a ball at the top and distance marks along it',
          line(40, 250, 360, 250, DIM, 3) +
            `<polygon points="40,250 360,250 360,110" fill="#fbbf2411" stroke="${HI}" stroke-width="3"/>` +
            `<circle cx="338" cy="106" r="14" fill="${OK}"/>` +
            [0.25, 0.5, 0.75].map((t) => line(360 - t * 320 - 4, 250 - t * 140 + 9, 360 - t * 320 + 4, 250 - t * 140 - 9, INK, 2.5)).join('') +
            label(200, 60, 'slow the fall down with a ramp', { size: 17, fill: HI }) +
            label(200, 290, 'same rule as falling, but you can watch it', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'A clock made of water',
        body: 'To time the ball he let water run from a big jar through a thin pipe into a cup while the ball rolled. When the ball reached a mark, he pinched the pipe. Then he weighed the water. More water meant more time. He repeated each roll a hundred times to be sure of the numbers.',
        figure: draw(
          'A tall jar draining through a pipe into a cup on a balance scale',
          `<rect x="60" y="60" width="90" height="150" rx="8" fill="none" stroke="${INK}" stroke-width="3"/>` +
            `<rect x="64" y="110" width="82" height="96" fill="${SKY}" opacity="0.5"/>` +
            line(150, 200, 230, 200, DIM, 4) + line(230, 200, 230, 235, DIM, 4) +
            `<rect x="205" y="235" width="50" height="34" rx="6" fill="none" stroke="${INK}" stroke-width="3"/>` +
            `<rect x="209" y="250" width="42" height="15" fill="${SKY}" opacity="0.6"/>` +
            line(190, 285, 380, 285, DIM, 3) +
            line(285, 285, 285, 300, DIM, 3) +
            `<rect x="330" y="255" width="40" height="30" rx="4" fill="${HI}"/>` +
            label(350, 275, '1 oz', { size: 12, fill: '#1e1b4b' }) +
            label(105, 45, 'water', { size: 13, fill: SKY }) +
            label(270, 120, 'more water = more time', { size: 14, fill: HI }) +
            label(330, 235, 'weigh the water', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'The numbers',
        body: 'The pattern was startling. In one unit of time the ball rolled one unit of distance. In two units of time it rolled four. In three, nine. In four, sixteen. Double the time and you get four times the distance, not twice. Triple the time and you get nine times. The distances were the square numbers.',
        figure: draw(
          'Bars of heights 1, 4, 9 and 16 for times 1, 2, 3 and 4',
          line(50, 260, 370, 260, DIM, 3) +
            [1, 4, 9, 16].map((d, i) => {
              const x = 90 + i * 80, h = d * 12;
              return `<rect x="${x - 25}" y="${260 - h}" width="50" height="${h}" rx="4" fill="${i === 3 ? HI : SKY}"/>` +
                label(x, 250 - h, `${d}`, { size: 15, fill: i === 3 ? HI : INK }) +
                label(x, 284, `t = ${i + 1}`, { size: 13, fill: DIM });
            }).join('') +
            label(200, 40, 'distance: 1, 4, 9, 16', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'The odd-number rule',
        body: 'Look at how much the ball gains in each new stretch of time. First stretch: 1. Second: 3 more. Third: 5 more. Fourth: 7 more. The gaps are the odd numbers, growing steadily, which means the ball is speeding up at a constant rate. Galileo had discovered acceleration.',
        figure: draw(
          'A ramp with marks spaced 1, 3, 5 and 7 units apart from the start',
          line(40, 200, 360, 200, INK, 4) +
            [0, 1, 4, 9, 16].map((d) => {
              const x = 40 + d * 20;
              return line(x, 188, x, 212, HI, 3) + label(x, 236, `${d}`, { size: 13, fill: HI });
            }).join('') +
            [[0, 1, '1'], [1, 4, '3'], [4, 9, '5'], [9, 16, '7']].map(([a, b, t]) => {
              const x1 = 40 + Number(a) * 20, x2 = 40 + Number(b) * 20;
              return `<path d="M ${x1} 170 Q ${(x1 + x2) / 2} 130 ${x2} 170" fill="none" stroke="${OK}" stroke-width="2.5"/>` + label((x1 + x2) / 2, 128, String(t), { size: 15, fill: OK });
            }).join('') +
            label(200, 60, 'gains of 1, 3, 5, 7 …', { size: 17, fill: HI }) +
            label(200, 290, 'equal time, growing distance: speeding up', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'The formula',
        body: 'Distance equals a constant times the time squared. That constant depends on how steep the ramp is; on a vertical drop it is about 4.9 metres per second squared. Because the time is squared, this is a quadratic. It was the first law of motion ever written as an equation.',
        figure: tex(['d = k\\,t^2', 'd(1) = k,\\; d(2) = 4k,\\; d(3) = 9k', 'd = 4.9\\,t^2 \\text{ (straight down, metres)}'], 'Square the time, and the distance follows'),
      },
      {
        head: 'The shape of a throw',
        body: 'Galileo then asked what happens when you throw a ball sideways. Sideways it moves steadily; downwards it follows the squared rule. Put the two together and the path is a curve the Greeks had studied for other reasons: a parabola. Every cannonball, every fountain, every jump shot.',
        figure: draw(
          'A ball thrown sideways tracing a parabolic arc, with the steady sideways motion and the squared fall marked',
          line(40, 260, 370, 260, DIM, 3) +
            `<path d="${Array.from({ length: 41 }, (_, i) => { const t = i / 40; const x = 50 + t * 300; const y = 80 + 180 * t * t; return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ')}" fill="none" stroke="${HI}" stroke-width="4"/>` +
            [0.25, 0.5, 0.75, 1].map((t) => `<circle cx="${(50 + t * 300).toFixed(1)}" cy="${(80 + 180 * t * t).toFixed(1)}" r="7" fill="${OK}"/>`).join('') +
            `<circle cx="50" cy="80" r="9" fill="${OK}"/>` +
            arrow(50, 50, 130, 50, SKY, 2.5) + label(90, 40, 'steady sideways', { size: 12, fill: SKY }) +
            arrow(360, 80, 360, 160, NO, 2.5) + label(340, 130, 'fall ∝ t²', { size: 12, fill: NO, anchor: 'end' }) +
            label(200, 300, 'the path is a parabola', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'The tower and the Moon',
        body: 'Legend says Galileo dropped two balls of different weights from the Leaning Tower and they landed together. Whether or not he did, the rule held. In 1971 an astronaut on the Moon dropped a hammer and a feather side by side, with no air to slow the feather. They hit the ground at the same instant.',
        figure: draw(
          'A hammer and a feather released from the same height, with equal-length fall lines to the ground',
          line(40, 270, 360, 270, DIM, 4) +
            `<rect x="110" y="60" width="40" height="22" rx="4" fill="${INK}"/><rect x="126" y="82" width="8" height="40" fill="${INK}"/>` +
            `<path d="M 270 62 Q 300 90 270 130 Q 240 90 270 62" fill="${HI}" opacity="0.8"/>` +
            line(130, 130, 130, 262, OK, 2.5, '6 5') + line(270, 135, 270, 262, OK, 2.5, '6 5') +
            arrow(130, 240, 130, 262, OK) + arrow(270, 240, 270, 262, OK) +
            label(130, 48, 'hammer', { size: 13 }) + label(270, 48, 'feather', { size: 13, fill: HI }) +
            label(200, 300, 'no air: same fall, same time', { size: 15, fill: OK }) +
            label(200, 190, 'Moon, 1971', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Every jump in every game',
        body: 'Four hundred years later the same equation runs inside every video game. A character’s height after a jump is a negative constant times time squared, plus the launch speed times time, plus where they started. Solve it and you know when they land. Unit 14 of Algebra 1 is that equation.',
        figure: tex(['h(t) = -4.9t^2 + 8t + 2', 'h = 0 \\text{ when the character lands}'], 'A quadratic in t, and its graph is the jump'),
      },
    ],
  },

  // ── Geometry · Unit 3 Parallel lines and transversals ─────────────────
  {
    id: 'GEO-3-eratosthenes',
    domain: 'GEO',
    unit: 3,
    title: 'Story: Eratosthenes measures the Earth',
    subtitle: 'A well, a shadow, and two parallel sunbeams',
    learned: 'Parallel lines cut by a transversal make equal alternate interior angles — enough to measure a planet.',
    beats: [
      {
        head: 'A well with no shadow',
        body: 'Around 240 BC Eratosthenes ran the great library of Alexandria. He read that far to the south, in the city of Syene, something odd happened at noon on the longest day of the year: the Sun shone straight down a deep well and lit the water at the bottom. Nothing there cast a shadow.',
        figure: draw(
          'A vertical sunbeam shining straight down a well to the water at the bottom',
          `<rect x="150" y="120" width="100" height="160" fill="none" stroke="${INK}" stroke-width="3"/>` +
            `<rect x="154" y="230" width="92" height="46" fill="${SKY}" opacity="0.6"/>` +
            line(40, 120, 150, 120, DIM, 4) + line(250, 120, 360, 120, DIM, 4) +
            arrow(200, 30, 200, 226, HI, 3) +
            label(200, 300, 'Syene, noon, midsummer', { size: 15, fill: HI }) +
            label(320, 60, 'sun straight up', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'A pole with a shadow',
        body: 'In Alexandria, on the same day at the same hour, a vertical pole did cast a shadow. Eratosthenes measured the angle between the pole and the sunbeam: about 7.2 degrees. Same Sun, same moment, different angle. The only explanation was that the ground itself was curved.',
        figure: draw(
          'A vertical pole in Alexandria casting a short shadow, with the 7.2 degree angle between pole and sunbeam marked',
          line(40, 250, 360, 250, DIM, 4) +
            line(200, 250, 200, 90, INK, 5) +
            line(200, 250, 240, 250, OK, 6) +
            line(200, 90, 240, 250, HI, 2.5, '6 5') +
            arc(200, 250, 70, 76, 14, HI, 2.5) +
            label(252, 150, '7.2°', { size: 15, fill: HI }) +
            label(220, 276, 'shadow', { size: 13, fill: OK }) +
            label(200, 70, 'pole', { size: 13 }) +
            label(200, 40, 'Alexandria, same noon', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'Sunbeams are parallel',
        body: 'The Sun is so far away that its rays reach the Earth side by side, parallel. So the beam that went down the well in Syene and the beam that made the shadow in Alexandria were parallel lines, meeting a curved surface at two different places 800 kilometres apart.',
        figure: draw(
          'Parallel sun rays arriving at a curved Earth, one straight down a well, one at an angle to a pole',
          `<path d="M 40 300 Q 200 60 360 300" fill="none" stroke="${SKY}" stroke-width="4"/>` +
            [60, 120, 180, 240, 300, 340].map((x) => arrow(x, 30, x, 150, HI, 2)).join('') +
            label(200, 20, 'rays from the Sun, all parallel', { size: 13, fill: HI }) +
            line(200, 120, 200, 160, INK, 4) +
            line(300, 160, 288, 200, INK, 4) +
            label(200, 190, 'Syene', { size: 13 }) +
            label(352, 150, 'Alexandria', { size: 13, anchor: 'end' }),
        ),
      },
      {
        head: 'The transversal',
        body: 'Extend the pole in Alexandria down through the Earth to its centre; do the same for the well. Those two lines meet at the centre. The pole’s line crosses both parallel sunbeams, so it is a transversal, and alternate interior angles are equal. The angle at the centre of the Earth is 7.2 degrees too.',
        figure: draw(
          'A cross-section of the Earth with two parallel rays, two radii meeting at the centre, and the equal 7.2 degree angles marked at the pole and at the centre',
          `<circle cx="200" cy="200" r="130" fill="none" stroke="${SKY}" stroke-width="3"/>` +
            `<circle cx="200" cy="200" r="5" fill="${INK}"/>` +
            line(200, 200, 200, 30, INK, 3) +
            line(200, 200, 216.3, 71.0, INK, 3) +
            line(216.3, 71.0, 216.3, 30, HI, 2.5, '5 4') +
            line(200, 70, 200, 30, HI, 2.5, '5 4') +
            arc(216.3, 71.0, 30, 90, 7.2 * 3, OK, 2.5) +
            arc(200, 200, 60, 82.8, 7.2 * 1, OK, 3) +
            label(255, 60, '7.2°', { size: 14, fill: OK }) +
            label(228, 150, '7.2°', { size: 14, fill: OK }) +
            label(200, 300, 'alternate interior angles are equal', { size: 13, fill: OK }) +
            label(200, 226, 'centre', { size: 12, fill: DIM }),
        ),
      },
      {
        head: 'One fiftieth of a circle',
        body: 'A full circle is 360 degrees. Divide 360 by 7.2 and you get exactly 50. So the distance from Alexandria to Syene is one fiftieth of the way around the Earth. Multiply that distance by 50 and you have the circumference of the whole planet.',
        figure: tex(['\\frac{360^\\circ}{7.2^\\circ} = 50', '\\text{so the two cities are } \\tfrac{1}{50} \\text{ of the way round}'], 'Angles at the centre share out the circle'),
      },
      {
        head: 'Pacing out 5,000 stadia',
        body: 'Professional walkers, trained to take equal steps, had paced the road from Alexandria to Syene at about 5,000 stadia. Fifty times 5,000 is 250,000 stadia. Eratosthenes had measured the Earth with a well, a stick, a shadow and a long walk.',
        figure: tex(['5{,}000 \\times 50 = 250{,}000 \\text{ stadia}'], 'One stretch of road, times fifty'),
      },
      {
        head: 'How close was he?',
        body: 'Nobody is sure exactly how long his stadion was, somewhere between 157 and 185 metres. That puts his answer between 39,000 and 46,000 kilometres. The true circumference is 40,075 kilometres. Two thousand years before satellites, he was within a few percent.',
        figure: draw(
          'Two bars comparing Eratosthenes’ estimate range with the true circumference of 40,075 km',
          line(60, 250, 360, 250, DIM, 3) +
            `<rect x="90" y="120" width="80" height="130" rx="4" fill="${HI}" opacity="0.85"/>` +
            `<rect x="90" y="96" width="80" height="24" rx="4" fill="none" stroke="${HI}" stroke-width="2.5" stroke-dasharray="5 4"/>` +
            label(130, 84, '39–46 thousand', { size: 12, fill: HI }) +
            label(130, 276, 'Eratosthenes', { size: 13 }) +
            `<rect x="230" y="116" width="80" height="134" rx="4" fill="${OK}" opacity="0.85"/>` +
            label(270, 104, '40,075 km', { size: 13, fill: OK }) +
            label(270, 276, 'true', { size: 13 }) +
            label(200, 40, 'within a few percent, in 240 BC', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'The same angles, today',
        body: 'Surveyors laying out roads, engineers checking that beams are parallel, and satellites fixing their position all rely on this: when a line crosses two parallel lines, the alternate interior angles match. Unit 3 of Geometry is that rule. Eratosthenes used it to weigh a world.',
        figure: draw(
          'Two parallel lines crossed by a transversal with a pair of equal alternate interior angles shaded',
          line(40, 110, 360, 110, INK, 3) + line(40, 210, 360, 210, INK, 3) +
            line(120, 270, 280, 50, HI, 3) +
            arc(163.6, 210, 32, 0, 54, OK, 3) +
            arc(236.4, 110, 32, 180, 54, OK, 3) +
            label(212, 196, 'a', { size: 15, fill: OK }) +
            label(188, 128, 'a', { size: 15, fill: OK }) +
            line(330, 110, 344, 104, DIM, 2) + line(330, 210, 344, 204, DIM, 2) +
            label(200, 30, 'parallel lines, one transversal', { size: 15, fill: HI }) +
            label(200, 300, 'alternate interior angles are equal', { size: 13, fill: OK }),
        ),
      },
    ],
  },

  // ── Trigonometry · Unit 14 Law of Sines and Law of Cosines ────────────
  {
    id: 'TRIG-14-everest',
    domain: 'TRIG',
    unit: 14,
    title: 'Story: The mountain measured from 100 miles away',
    subtitle: 'How surveyors found the height of Everest without setting foot on it',
    learned: 'One measured baseline, then angles: the Law of Sines gives a distance you cannot walk, and an angle of elevation turns it into a height.',
    beats: [
      {
        head: 'One baseline, measured to the inch',
        body: 'In 1802 William Lambton began the Great Trigonometrical Survey of India. His crew measured a single baseline of about 7.5 miles near Madras with a hundred-foot steel chain, correcting for temperature, and re-measured it until the two results differed by less than three inches.',
        figure: draw(
          'A baseline with two survey stations and a measuring chain laid end to end along it',
          line(50, 200, 350, 200, HI, 5) +
            [50, 350].map((x) => `<polygon points="${x - 14},200 ${x + 14},200 ${x},160" fill="${INK}"/>`).join('') +
            Array.from({ length: 10 }, (_, i) => line(50 + i * 30, 214, 50 + i * 30, 226, DIM, 2)).join('') +
            label(200, 250, 'baseline ≈ 7.5 miles', { size: 15, fill: HI }) +
            label(50, 145, 'A', { size: 15 }) + label(350, 145, 'B', { size: 15 }) +
            label(200, 60, 'measure this one length very well', { size: 15 }) +
            label(200, 290, 'error: under three inches', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'After that, only angles',
        body: 'From the two ends of the baseline they sighted a distant hill and measured the angles to it with a theodolite, a telescope on a graduated circle that weighed half a ton. Two angles and one side fix a triangle. The new side became the next baseline, and triangle by triangle they walked north across India.',
        figure: draw(
          'A chain of triangles growing from a baseline, each new side becoming the next base',
          (() => {
            const pts = [[40, 260], [130, 260], [90, 170], [200, 170], [150, 80], [270, 80], [340, 160]];
            let s = '';
            for (let i = 2; i < pts.length; i++) {
              s += line(pts[i - 2][0], pts[i - 2][1], pts[i][0], pts[i][1], i === 2 ? HI : INK, 2.5);
              s += line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], i === 2 ? HI : INK, 2.5);
            }
            s += line(40, 260, 130, 260, HI, 5);
            s += pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${OK}"/>`).join('');
            return s + label(85, 290, 'baseline', { size: 13, fill: HI }) + label(200, 40, 'triangle by triangle', { size: 17, fill: HI }) + label(300, 250, 'angles only', { size: 13, fill: DIM });
          })(),
        ),
      },
      {
        head: 'The Law of Sines',
        body: 'In any triangle, each side divided by the sine of the opposite angle gives the same number. Know one side and two angles, and the other sides follow. A 10-kilometre baseline with angles of 60 and 50 degrees at its ends gives the far side without anyone crossing the river.',
        figure: tex(['\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}', 'C = 180^\\circ - 60^\\circ - 50^\\circ = 70^\\circ', 'a = \\frac{10\\,\\sin 60^\\circ}{\\sin 70^\\circ} \\approx 9.2\\text{ km}'], 'One side, two angles, every side'),
      },
      {
        head: 'A peak on the horizon',
        body: 'By 1849 the survey reached the plains below the Himalaya. Nepal was closed to foreigners, so the mountains could only be seen from the Indian side, more than 100 miles away. From six stations the surveyors sighted a faint peak they called Peak XV and recorded its angles.',
        figure: draw(
          'A distant peak on the horizon with sight lines from several survey stations in the plains',
          line(30, 260, 370, 260, DIM, 3) +
            `<polygon points="290,260 350,260 320,70" fill="#a5b4fc33" stroke="${INK}" stroke-width="2.5"/>` +
            [50, 100, 150].map((x) => `<polygon points="${x - 10},260 ${x + 10},260 ${x},238" fill="${OK}"/>` + line(x, 238, 320, 70, HI, 1.5, '4 4')).join('') +
            label(150, 290, 'six stations, 100+ miles out', { size: 13, fill: OK }) +
            label(320, 52, 'Peak XV', { size: 15, fill: HI }) +
            label(200, 120, 'angles of elevation', { size: 13, fill: HI }),
        ),
      },
      {
        head: 'Angle up, height out',
        body: 'Once triangulation gave the distance to the peak, its height was one right triangle away. From a station at distance d, the peak rises d times the tangent of the angle of elevation above the station, and the station’s own height above the sea is added on.',
        figure: tex(['h = d \\tan\\theta + h_{\\text{station}}', 'd \\approx 108 \\text{ miles},\\; \\theta \\approx 2.9^\\circ'], 'A tiny angle on a huge distance'),
      },
      {
        head: 'The Earth is round and the air bends light',
        body: 'Over 100 miles the curve of the Earth hides thousands of feet of mountain, and the atmosphere bends the light ray downward, making the peak look higher than it is. Both effects had to be calculated and subtracted. Tiny angle errors, over that distance, meant hundreds of feet.',
        figure: draw(
          'A curved Earth between a station and a peak, with a sight line bending through the atmosphere',
          `<path d="M 30 270 Q 200 190 370 270" fill="none" stroke="${SKY}" stroke-width="4"/>` +
            `<polygon points="60,258 72,258 66,240" fill="${OK}"/>` +
            `<polygon points="330,262 350,262 340,150" fill="none" stroke="${INK}" stroke-width="2.5"/>` +
            `<path d="M 66 240 Q 200 170 340 150" fill="none" stroke="${HI}" stroke-width="2.5"/>` +
            line(66, 240, 340, 150, NO, 2, '5 4') +
            label(200, 150, 'bent ray', { size: 13, fill: HI }) +
            label(200, 232, 'straight line', { size: 12, fill: NO }) +
            label(200, 300, 'curvature hides height; air adds some back', { size: 13, fill: DIM }) +
            label(200, 40, 'two corrections', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'The chief computer',
        body: 'In 1852 Radhanath Sikdar, the survey’s chief computer, finished the arithmetic from all six stations and averaged the results. They came to 29,000 feet exactly. Legend says the survey published 29,002 so that nobody would think the number had been rounded off.',
        figure: draw(
          'Six bars of nearly equal height around 29,000 feet with their average marked',
          line(50, 250, 370, 250, DIM, 3) +
            [28990, 29005, 28998, 29010, 28995, 29002].map((v, i) => {
              const x = 75 + i * 52, h = 100 + (v - 28990) * 3;
              return `<rect x="${x - 18}" y="${250 - h}" width="36" height="${h}" rx="3" fill="${SKY}" opacity="0.8"/>` + label(x, 274, `${i + 1}`, { size: 12, fill: DIM });
            }).join('') +
            line(50, 250 - 130, 370, 250 - 130, HI, 2.5, '6 5') +
            label(200, 60, 'average ≈ 29,000 ft', { size: 15, fill: HI }) +
            label(200, 300, 'six stations, one answer', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Thirty feet out of twenty-nine thousand',
        body: 'In 2020 a Chinese–Nepali team put GPS receivers on the summit itself: 29,031.7 feet. The 1852 answer, computed from a hundred miles away with a telescope and a table of sines, was off by thirty feet, about one part in a thousand. Unit 14 of Trigonometry is the same mathematics.',
        figure: tex(['29{,}002 \\text{ ft} \\quad (1852,\\ \\text{by trigonometry})', '29{,}032 \\text{ ft} \\quad (2020,\\ \\text{by GPS})', '\\frac{30}{29{,}000} \\approx 0.1\\%'], 'A theodolite and a sine table, within a tenth of a percent'),
      },
    ],
  },

  // ── Precalculus · Unit 14 Intro to limits ─────────────────────────────
  {
    id: 'PC-14-zeno',
    domain: 'PC',
    unit: 14,
    title: 'Story: Zeno’s racing tortoise',
    subtitle: 'Achilles can never win — until you add up infinity',
    learned: 'An infinite list of steps can add up to a finite number. That number is a limit, and limits are how calculus tames infinity.',
    beats: [
      {
        head: 'A head start for the tortoise',
        body: 'Around 450 BC the philosopher Zeno of Elea set a puzzle. Achilles, the fastest runner in Greece, races a tortoise and, being sporting, gives it a 100-metre head start. Achilles runs ten times as fast as the tortoise. Surely he catches it in seconds. Zeno said: think again.',
        figure: draw(
          'A race track with Achilles at the start and a tortoise 100 metres ahead',
          line(30, 200, 370, 200, DIM, 4) +
            `<circle cx="60" cy="170" r="14" fill="${HI}"/><line x1="60" y1="184" x2="60" y2="200" stroke="${HI}" stroke-width="4"/>` +
            `<ellipse cx="300" cy="188" rx="22" ry="12" fill="${OK}"/><circle cx="326" cy="184" r="6" fill="${OK}"/>` +
            line(60, 230, 300, 230, INK, 2) + line(60, 224, 60, 236, INK, 2) + line(300, 224, 300, 236, INK, 2) +
            label(180, 256, '100 m head start', { size: 15 }) +
            label(60, 140, 'Achilles', { size: 13, fill: HI }) + label(300, 158, 'tortoise', { size: 13, fill: OK }) +
            label(200, 60, 'Achilles is 10× faster', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'Always a little behind',
        body: 'By the time Achilles runs the 100 metres, the tortoise has crawled 10 metres more. Achilles covers those 10; the tortoise has gone 1 more. He covers the 1; it has gone a tenth. Every time Achilles reaches where the tortoise was, it has moved on. So, said Zeno, he can never catch it.',
        figure: draw(
          'Shrinking gaps of 100, 10, 1 and 0.1 metres between Achilles and the tortoise',
          line(30, 200, 370, 200, DIM, 4) +
            [[40, 100, '100'], [140, 10, '10'], [250, 1, '1'], [300, 0.1, '0.1']].map(([x, , t], i) => {
              const w = [100, 60, 30, 14][i];
              return line(Number(x), 200, Number(x) + w, 200, HI, 6) + label(Number(x) + w / 2, 235, String(t), { size: 13, fill: HI }) + `<circle cx="${Number(x) + w}" cy="184" r="${9 - i * 2}" fill="${OK}"/>`;
            }).join('') +
            label(200, 60, 'gaps: 100, 10, 1, 0.1, …', { size: 17, fill: HI }) +
            label(200, 290, 'never zero — but shrinking fast', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Walking across a room',
        body: 'Zeno had a simpler version. To cross a room you must first reach the halfway point. Then half of what is left. Then half of that. There are infinitely many halfway points, and you cannot do infinitely many things, so you can never reach the far wall. Yet people cross rooms every day.',
        figure: draw(
          'A segment cut at its halfway point, then half of the rest, then half again',
          line(40, 170, 360, 170, INK, 4) +
            [[40, 200, '1/2'], [200, 280, '1/4'], [280, 320, '1/8'], [320, 340, '1/16']].map(([a, b, t], i) => {
              const c = [HI, OK, SKY, NO][i];
              return `<path d="M ${a} 150 Q ${(Number(a) + Number(b)) / 2} ${100 - i * 8} ${b} 150" fill="none" stroke="${c}" stroke-width="2.5"/>` + label((Number(a) + Number(b)) / 2, 88 - i * 8, String(t), { size: 13, fill: c });
            }).join('') +
            line(360, 150, 360, 190, INK, 4) +
            label(200, 220, 'infinitely many halves to go', { size: 15, fill: HI }) +
            label(360, 215, 'wall', { size: 12, fill: DIM }),
        ),
      },
      {
        head: 'Add up the halves',
        body: 'Draw a square and colour half of it. Then half of what is left, then half of that, forever. The coloured parts never spill outside the square, and every empty corner eventually gets filled. So one half plus one quarter plus one eighth and so on, forever, adds up to exactly one.',
        figure: draw(
          'A unit square filled by a half, a quarter, an eighth and so on',
          `<rect x="60" y="40" width="240" height="240" fill="none" stroke="${INK}" stroke-width="3"/>` +
            `<rect x="60" y="40" width="120" height="240" fill="${HI}" opacity="0.8"/>` +
            `<rect x="180" y="40" width="120" height="120" fill="${OK}" opacity="0.8"/>` +
            `<rect x="180" y="160" width="60" height="120" fill="${SKY}" opacity="0.8"/>` +
            `<rect x="240" y="160" width="60" height="60" fill="${NO}" opacity="0.8"/>` +
            `<rect x="240" y="220" width="30" height="60" fill="${HI}" opacity="0.6"/>` +
            `<rect x="270" y="220" width="30" height="30" fill="${OK}" opacity="0.6"/>` +
            label(120, 168, '1/2', { size: 22, fill: '#1e1b4b' }) +
            label(240, 108, '1/4', { size: 18, fill: '#1e1b4b' }) +
            label(210, 228, '1/8', { size: 15, fill: '#1e1b4b' }) +
            label(270, 197, '1/16', { size: 12, fill: '#1e1b4b' }) +
            label(200, 305, '1/2 + 1/4 + 1/8 + … = 1', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'Where Achilles wins',
        body: 'Add up Achilles’ stretches the same way: 100 plus 10 plus 1 plus a tenth and so on. The sum is 111.111…, which is exactly one thousand ninths. That is where he passes the tortoise, about 111 metres down the track. Infinitely many stretches, one finite place.',
        figure: tex(['100 + 10 + 1 + 0.1 + 0.01 + \\cdots', '= 111.111\\ldots = \\frac{1000}{9}\\text{ m}'], 'Infinitely many pieces, one finite sum'),
      },
      {
        head: 'The idea of a limit',
        body: 'Add the first n stretches and you get a partial sum. The partial sums get as close to one thousand ninths as you like, without ever needing an infinite step. That target is called the limit. A limit is not the last term; it is the number the terms are heading for.',
        figure: tex(['S_n = 100\\cdot\\frac{1 - 0.1^{\\,n}}{0.9}', '\\lim_{n \\to \\infty} S_n = \\frac{1000}{9}'], 'The partial sums close in on the target'),
      },
      {
        head: 'Two thousand years to settle it',
        body: 'Zeno’s puzzles bothered the Greeks, and Archimedes tiptoed around them with clever sums. Newton and Leibniz built calculus on limits in the 1660s without quite defining them. Only in the 1800s did Cauchy and Weierstrass write down what a limit precisely is, and the puzzle finally dissolved.',
        figure: draw(
          'A timeline from 500 BC to 1900 marking Zeno, Archimedes, Newton and Leibniz, and Weierstrass',
          timeline(-500, 1900, [{ at: -450, text: 'Zeno', hi: true }, { at: -250, text: 'Archimedes' }, { at: 1670, text: 'Newton, Leibniz' }, { at: 1860, text: 'Weierstrass' }], (n) => (n < 0 ? `${-n} BC` : `${n}`)) +
            label(200, 40, 'the long road to a definition', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'Speed at an instant',
        body: 'Your speedometer reads a speed at one instant, yet speed is distance over time, and at one instant no time passes. The fix is a limit: average speed over a shrinking interval, closing in on a single number. Unit 14 of Precalculus starts there, and calculus is where it leads.',
        figure: draw(
          'A curve with secant lines through two points that close in on the tangent line at one point',
          line(40, 260, 370, 260, DIM, 2) + line(40, 260, 40, 40, DIM, 2) +
            `<path d="${Array.from({ length: 41 }, (_, i) => { const t = i / 40; const x = 40 + t * 320; const y = 250 - 200 * t * t; return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ')}" fill="none" stroke="${INK}" stroke-width="3.5"/>` +
            line(150, 237.8, 340, 132.9, NO, 2, '5 4') +
            line(150, 237.8, 260, 197.5, SKY, 2, '5 4') +
            line(90, 250, 250, 170, HI, 3) +
            `<circle cx="150" cy="237.8" r="7" fill="${HI}"/>` +
            label(300, 235, 'secants', { size: 13, fill: NO, anchor: 'start' }) +
            label(200, 110, 'tangent', { size: 13, fill: HI, anchor: 'end' }) +
            label(200, 300, 'shrink the interval, find the speed', { size: 13, fill: DIM }),
        ),
      },
    ],
  },

  // ── SAT Math · Unit 11 Proportions ────────────────────────────────────
  {
    id: 'SAT-11-fermi',
    domain: 'SAT',
    unit: 11,
    title: 'Story: Fermi and the falling paper',
    subtitle: 'How a physicist measured an atomic bomb with confetti',
    learned: 'Estimate first. A rough proportional guess tells you which answers are impossible before you compute anything.',
    beats: [
      {
        head: 'Ten miles from the tower',
        body: 'On 16 July 1945, before dawn in the New Mexico desert, the first atomic bomb sat on a steel tower. Enrico Fermi, one of the physicists who built it, stood about ten miles away with a handful of torn-up paper. The instruments would take days to analyse. He wanted a number that morning.',
        figure: draw(
          'A steel tower and an observer ten miles away along a line of desert',
          line(30, 240, 370, 240, DIM, 4) +
            `<polygon points="60,240 80,240 70,120" fill="none" stroke="${NO}" stroke-width="3"/>` +
            `<circle cx="70" cy="110" r="8" fill="${NO}"/>` +
            `<circle cx="330" cy="205" r="12" fill="${HI}"/><line x1="330" y1="217" x2="330" y2="240" stroke="${HI}" stroke-width="4"/>` +
            line(80, 270, 320, 270, INK, 2) + line(80, 264, 80, 276, INK, 2) + line(320, 264, 320, 276, INK, 2) +
            label(200, 296, '10 miles', { size: 15 }) +
            label(70, 96, 'tower', { size: 13, fill: NO }) + label(330, 180, 'Fermi', { size: 13, fill: HI }) +
            label(200, 60, '5:29 am, 16 July 1945', { size: 15, fill: DIM }),
        ),
      },
      {
        head: 'Drop the paper',
        body: 'The flash came first. About forty seconds later the blast wave arrived. As it passed, Fermi let the scraps fall from shoulder height and watched them drift. They landed about two and a half metres away instead of straight down. That was his whole measurement.',
        figure: draw(
          'Scraps of paper released from shoulder height drifting sideways two and a half metres in the blast wave',
          line(40, 250, 360, 250, DIM, 4) +
            `<circle cx="100" cy="90" r="12" fill="${HI}"/><line x1="100" y1="102" x2="100" y2="250" stroke="${HI}" stroke-width="4"/>` +
            [[0, 0], [1, 0.5], [2, 1.2], [3, 2.1], [4, 3.2]].map(([i, s]) => `<rect x="${112 + Number(i) * 40}" y="${110 + Number(s) * 40}" width="12" height="9" fill="${INK}" transform="rotate(${Number(i) * 12} ${118 + Number(i) * 40} ${114 + Number(s) * 40})"/>`).join('') +
            [140, 200, 260].map((x) => arrow(x, 60, x + 40, 60, SKY, 2.5)).join('') +
            label(220, 46, 'blast wave', { size: 13, fill: SKY }) +
            line(100, 280, 290, 280, OK, 2) + line(100, 274, 100, 286, OK, 2) + line(290, 274, 290, 286, OK, 2) +
            label(195, 306, '2.5 m sideways', { size: 15, fill: OK }),
        ),
      },
      {
        head: 'Confetti to kilotons',
        body: 'Fermi reasoned in proportions. The drift of the paper told him the push of the air; the push at ten miles told him the energy of the blast. Each step was rough, but each was a ratio he could trust. He announced about ten kilotons. Instruments later said twenty-one. From confetti, within a factor of two.',
        figure: draw(
          'Two bars comparing Fermi’s estimate of 10 kilotons with the measured 21 kilotons',
          line(60, 250, 360, 250, DIM, 3) +
            `<rect x="100" y="150" width="80" height="100" rx="4" fill="${HI}" opacity="0.85"/>` +
            label(140, 136, '≈ 10 kt', { size: 15, fill: HI }) +
            label(140, 276, 'Fermi, at dawn', { size: 12 }) +
            `<rect x="230" y="40" width="80" height="210" rx="4" fill="${OK}" opacity="0.85"/>` +
            label(270, 28, '21 kt', { size: 15, fill: OK }) +
            label(270, 276, 'measured later', { size: 12 }) +
            label(200, 305, 'right size, from a handful of paper', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'How many piano tuners in Chicago?',
        body: 'Fermi liked to ask students questions with no data. Chicago has about three million people, say three per home: a million homes. Perhaps one home in twenty has a piano: fifty thousand pianos. Each tuned about once a year, and a tuner can do about a thousand a year. So roughly fifty tuners.',
        figure: draw(
          'A chain of rough numbers from three million people down to about fifty piano tuners',
          [['3,000,000 people', INK], ['÷ 3 → 1,000,000 homes', INK], ['÷ 20 → 50,000 pianos', INK], ['× 1 tuning a year', INK], ['÷ 1,000 per tuner → 50', HI]].map(([t, c], i) => {
            const y = 40 + i * 54;
            return `<rect x="50" y="${y}" width="300" height="38" rx="8" fill="none" stroke="${c}" stroke-width="2.5"/>` + label(200, y + 25, String(t), { size: 14, fill: String(c) }) + (i < 4 ? arrow(200, y + 40, 200, y + 52, DIM, 2) : '');
          }).join(''),
        ),
      },
      {
        head: 'Why rough numbers work',
        body: 'Every step might be off by two or three, but some guesses are too high and some too low, and they tend to cancel. Multiply five rough numbers and you usually land within a factor of ten of the truth. The Chicago phone book, when someone checked, listed about eighty tuners.',
        figure: tex(['3{,}000{,}000 \\times \\tfrac{1}{3} \\times \\tfrac{1}{20} \\times 1 \\times \\tfrac{1}{1000} = 50', '\\text{real answer: about } 80'], 'Rough factors, decent answer'),
      },
      {
        head: 'SAT move one: estimate first',
        body: 'What is 38 percent of 412? Before you calculate, round: 40 percent of 400 is 160. Now look at the choices. If they are 15.6, 156.6 and 1,566, two of them are impossible and you are done. Estimation is not a shortcut around the math; it is the check that catches the slip.',
        figure: tex(['0.38 \\times 412 \\approx 0.4 \\times 400 = 160', '15.6 \\;\\; \\text{or} \\;\\; 156.6 \\;\\; \\text{or} \\;\\; 1{,}566\\,?'], 'Round, estimate, then eliminate'),
      },
      {
        head: 'SAT move two: check the size',
        body: 'A car travels at 60 miles per hour for two and a half hours. Whatever the answer is, it is near 150 miles; anything like 24 or 1,500 has the wrong size or the wrong unit. Put your answer on a number line in your head before you bubble it in, every single time.',
        figure: draw(
          'A number line with wrong-sized answer choices crossed out and the estimate range highlighted around 150',
          line(40, 170, 360, 170, INK, 3) +
            [[60, '24', NO], [200, '150', OK], [340, '1,500', NO]].map(([x, t, c]) => `<circle cx="${x}" cy="170" r="9" fill="${c}"/>` + label(Number(x), x === 200 ? 222 : 210, String(t), { size: 15, fill: String(c) })).join('') +
            `<rect x="160" y="140" width="80" height="60" rx="8" fill="none" stroke="${OK}" stroke-width="2.5" stroke-dasharray="6 5"/>` +
            label(200, 120, '60 mph × 2.5 h', { size: 15, fill: HI }) +
            label(60, 240, 'too small', { size: 12, fill: NO }) + label(340, 240, 'too big', { size: 12, fill: NO }) +
            label(200, 290, 'size check before you answer', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'A Nobel prize and a habit',
        body: 'Fermi won the Nobel Prize in 1938, but the skill his students remembered was this one: break a hard question into ratios you can guess, multiply, and trust the size of the result. Unit 11 of SAT Math, proportions, is where that habit is built, one ratio at a time.',
        figure: draw(
          'Two ratio bars showing 3 parts to 12 and 7 parts to 28 in the same proportion',
          [[3, 12, 80, HI], [7, 28, 200, OK]].map(([a, b, y, c]) => {
            const w = Number(b) * 10;
            return `<rect x="40" y="${y}" width="${w}" height="40" rx="6" fill="none" stroke="${c}" stroke-width="2.5"/>` +
              `<rect x="40" y="${y}" width="${Number(a) * 10}" height="40" rx="6" fill="${c}" opacity="0.7"/>` +
              label(40 + w + 14, Number(y) + 27, `${a} : ${b}`, { size: 15, fill: String(c), anchor: 'start' });
          }).join('') +
            label(200, 50, 'same ratio, different size', { size: 17, fill: HI }) +
            label(200, 290, '3/12 = 7/28 = 1/4', { size: 15, fill: DIM }),
        ),
      },
    ],
  },
];
