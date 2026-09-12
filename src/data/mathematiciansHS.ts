// One mathematician per high-school course, in the same format as the
// 6th-grade decks: their life → the big idea → how it works (worked lines a
// student can follow) → why it matters today → the unit in this app it
// connects to. Every slide carries a figure that IS the mathematics.
import type { MathematicianDeck } from './mathematicianDecks';
import { tex, draw, label, line, arrow, arc, rightAngle, INK, DIM, HI, OK, NO, SKY } from './mathFigure';

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

export const HS_MATHEMATICIAN_DECKS: MathematicianDeck[] = [
  // ── Algebra 1 ─────────────────────────────────────────────────────────
  {
    id: 'Al-Khwarizmi',
    name: 'Al-Khwarizmi',
    era: 'c. 780–850',
    emoji: '⚖️',
    tieIn: 'Algebra 1 · Solving equations',
    tieInTo: '/trail/A1',
    slides: [
      {
        head: 'The House of Wisdom',
        body: 'Muhammad ibn Musa al-Khwarizmi worked in Baghdad around the year 820, at a great library called the House of Wisdom. Scholars there translated Greek and Indian books, studied the stars, and drew maps of the known world. He was one of its brightest minds.',
        figure: draw(
          'A timeline from 750 to 900 marking the House of Wisdom and al-Khwarizmi’s life',
          timeline(750, 900, [{ at: 780, text: 'born c. 780' }, { at: 820, text: 'House of Wisdom', hi: true }, { at: 850, text: 'dies c. 850' }], (n) => `${n} AD`) +
            label(200, 40, 'Baghdad, the world’s biggest city', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'Where the word "algebra" comes from',
        body: 'He wrote a book whose title includes the words al-jabr, which means "restoring" or "completing". Copied into Latin, al-jabr became algebra. So every algebra class on Earth is named after one chapter of one book from Baghdad.',
        figure: draw(
          'A two-pan balance with al-jabr labelled as adding the same weight to both pans',
          line(200, 80, 200, 250, DIM, 5) +
            line(70, 110, 330, 110, INK, 5) +
            `<rect x="40" y="110" width="60" height="16" rx="4" fill="${DIM}"/><rect x="300" y="110" width="60" height="16" rx="4" fill="${DIM}"/>` +
            `<rect x="52" y="82" width="36" height="28" rx="6" fill="${HI}"/>` +
            `<rect x="312" y="82" width="36" height="28" rx="6" fill="${HI}"/>` +
            `<rect x="150" y="250" width="100" height="14" rx="5" fill="${DIM}"/>` +
            label(70, 101, '+7', { size: 15, fill: '#1e1b4b' }) +
            label(330, 101, '+7', { size: 15, fill: '#1e1b4b' }) +
            label(200, 40, 'al-jabr = restore both sides', { size: 17, fill: HI }) +
            label(200, 300, 'what you add to one pan, add to the other', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Al-jabr in action',
        body: 'Suppose a thing minus 7 equals 12. Something was taken away from the thing, so restore it: add 7 to both sides. The minus 7 disappears and the thing is 19. That single move, done on both sides at once, is al-jabr.',
        figure: tex(['x - 7 = 12', 'x - 7 + 7 = 12 + 7', 'x = 19'], 'Restore what was taken, on both sides'),
      },
      {
        head: 'Al-muqabala: balancing',
        body: 'The second word in his title, al-muqabala, means "balancing". If the same kind of thing sits on both sides, cancel it from both. Three things plus 4 equals one thing plus 10? Take one thing from each side, and it is simpler already.',
        figure: tex(['3x + 4 = x + 10', '2x + 4 = 10', '2x = 6', 'x = 3'], 'Cancel a thing from both sides, then restore'),
      },
      {
        head: 'Words instead of symbols',
        body: 'There were no x’s or plus signs yet. He wrote everything in sentences: the unknown was "a thing" (shay), its square was "wealth" (mal), and plain numbers were "dirhams", the coins of the day. Reading his book is like reading a puzzle out loud.',
        figure: draw(
          'Three word-boxes translated to modern symbols: thing to x, wealth to x squared, dirhams to a number',
          [['shay — a thing', 'x'], ['mal — wealth', 'x²'], ['dirhams — coins', '5']]
            .map(([w, sym], i) => {
              const y = 70 + i * 80;
              return (
                `<rect x="30" y="${y}" width="190" height="50" rx="10" fill="none" stroke="${DIM}" stroke-width="2.5"/>` +
                label(125, y + 31, w, { size: 15 }) +
                arrow(230, y + 25, 285, y + 25, HI) +
                `<rect x="295" y="${y}" width="75" height="50" rx="10" fill="none" stroke="${HI}" stroke-width="3"/>` +
                label(332, y + 33, sym, { size: 22, fill: HI })
              );
            })
            .join(''),
        ),
      },
      {
        head: 'Math for real life',
        body: 'His book was written for merchants, surveyors and judges. How do you divide an inheritance fairly among heirs? How do you split a field? Every chapter ends with practical problems, because algebra was invented to settle real arguments.',
        figure: draw(
          'A field divided into shares of one half, one third and one sixth',
          `<rect x="40" y="90" width="320" height="160" rx="6" fill="none" stroke="${INK}" stroke-width="3"/>` +
            `<rect x="40" y="90" width="160" height="160" fill="#fbbf2433"/>` +
            `<rect x="200" y="90" width="107" height="160" fill="#34d39933"/>` +
            `<rect x="307" y="90" width="53" height="160" fill="#60a5fa33"/>` +
            line(200, 90, 200, 250, INK, 2) +
            line(307, 90, 307, 250, INK, 2) +
            label(120, 178, '1/2', { size: 24, fill: HI }) +
            label(253, 178, '1/3', { size: 22, fill: OK }) +
            label(333, 178, '1/6', { size: 18, fill: SKY }) +
            label(200, 50, 'one field, three heirs', { size: 17 }) +
            label(200, 290, '1/2 + 1/3 + 1/6 = 1  — nothing left over', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Completing the square',
        body: 'His most famous problem: a square plus ten roots equals 39. Draw it! A square of side x, plus two strips of 5 by x. The picture is missing one corner: a 5 by 5 square, area 25. Add it to both sides and the shape becomes a perfect square.',
        figure: draw(
          'A square of side x with two strips of width 5 attached, and a missing 5 by 5 corner',
          `<rect x="60" y="60" width="150" height="150" fill="#fbbf2433" stroke="${HI}" stroke-width="3"/>` +
            `<rect x="210" y="60" width="75" height="150" fill="#34d39933" stroke="${OK}" stroke-width="3"/>` +
            `<rect x="60" y="210" width="150" height="75" fill="#34d39933" stroke="${OK}" stroke-width="3"/>` +
            `<rect x="210" y="210" width="75" height="75" fill="none" stroke="${NO}" stroke-width="3" stroke-dasharray="7 6"/>` +
            label(135, 142, 'x²', { size: 26, fill: HI }) +
            label(247, 142, '5x', { size: 20, fill: OK }) +
            label(135, 255, '5x', { size: 20, fill: OK }) +
            label(247, 255, '25', { size: 20, fill: NO }) +
            label(135, 44, 'x', { size: 15 }) +
            label(247, 44, '5', { size: 15 }) +
            label(44, 142, 'x', { size: 15 }) +
            label(44, 255, '5', { size: 15 }) +
            label(340, 142, 'x² + 10x', { size: 14, fill: DIM }) +
            label(340, 255, '= 39', { size: 14, fill: DIM }),
        ),
      },
      {
        head: 'And the answer falls out',
        body: 'With the corner filled, the whole square has area 39 plus 25, which is 64. A square of area 64 has side 8. But the side is also x plus 5. So x plus 5 is 8, and the thing is 3. Check it: 9 plus 30 is 39. Perfect.',
        figure: tex(['x^2 + 10x + 25 = 39 + 25', '(x + 5)^2 = 64', 'x + 5 = 8', 'x = 3'], 'The missing corner makes a perfect square'),
      },
      {
        head: 'Six kinds of equations',
        body: 'Because he never used negative numbers, he sorted every problem into six shapes, and gave a recipe for each. Squares equal roots. Squares equal numbers. Roots equal numbers. And three mixed kinds. Today one formula covers them all, but his six recipes came first.',
        figure: tex(
          ['ax^2 = bx \\qquad ax^2 = c \\qquad bx = c', 'ax^2 + bx = c', 'ax^2 + c = bx', 'bx + c = ax^2'],
          'His six types, every term kept positive',
        ),
      },
      {
        head: 'The digits you use every day',
        body: 'He also wrote a book explaining the Indian way of writing numbers with ten digits and a zero. Europe learned it from Latin copies of his work. His name, written Algoritmi in Latin, became the word algorithm: a step-by-step recipe.',
        figure: draw(
          'The ten digits with an arrow from the name Algoritmi to the word algorithm',
          '0123456789'.split('').map((d, i) => `<rect x="${28 + i * 35}" y="70" width="30" height="42" rx="6" fill="none" stroke="${DIM}" stroke-width="2"/>` + label(43 + i * 35, 100, d, { size: 22, fill: HI })).join('') +
            label(200, 48, 'ten digits, and a zero', { size: 15 }) +
            `<rect x="40" y="180" width="130" height="46" rx="10" fill="none" stroke="${INK}" stroke-width="2.5"/>` +
            label(105, 210, 'Algoritmi', { size: 17 }) +
            arrow(180, 203, 230, 203, HI) +
            `<rect x="240" y="180" width="130" height="46" rx="10" fill="none" stroke="${HI}" stroke-width="3"/>` +
            label(305, 210, 'algorithm', { size: 17, fill: HI }) +
            label(200, 270, 'his Latin name became the word', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Algorithms run the world',
        body: 'An algorithm is a list of steps that always works: undo the adding, then undo the multiplying, then check. Your phone follows billions of such recipes a second, for maps, photos and games. The name on all of them traces back to Baghdad.',
        figure: draw(
          'A flowchart: read the equation, undo add or subtract, undo multiply or divide, check the answer',
          ['read the equation', 'undo + or −', 'undo × or ÷', 'check it'].map((t, i) => {
            const y = 40 + i * 62;
            return (
              `<rect x="95" y="${y}" width="210" height="44" rx="10" fill="none" stroke="${i === 3 ? OK : INK}" stroke-width="2.5"/>` +
              label(200, y + 28, t, { size: 15, fill: i === 3 ? OK : INK }) +
              (i < 3 ? arrow(200, y + 46, 200, y + 60, HI) : '')
            );
          }).join('') +
            label(200, 300, 'the same steps, every time', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Your turn: Algebra 1',
        body: 'Units 2 and 3 of Algebra 1 are al-jabr and al-muqabala with modern symbols: restore what was taken, cancel what appears on both sides, and undo one operation at a time. When you solve for x, you are following a 1,200-year-old recipe.',
        figure: tex(['3x + 4 = 19', '3x = 15', 'x = 5'], 'Undo the +4, then undo the ×3'),
      },
    ],
  },

  // ── Geometry ──────────────────────────────────────────────────────────
  {
    id: 'Thales of Miletus',
    name: 'Thales of Miletus',
    era: 'c. 624–546 BC',
    emoji: '🔺',
    tieIn: 'Geometry · Similarity & circles',
    tieInTo: '/trail/GEO',
    slides: [
      {
        head: 'The first mathematician',
        body: 'Thales lived in Miletus, a Greek trading city on the coast of what is now Turkey, about 2,600 years ago. He sailed to Egypt, learned how their surveyors measured land, and came home asking a new question: not just how, but why.',
        figure: draw(
          'A timeline from 650 BC to 500 BC marking Thales’ life and the eclipse of 585 BC',
          timeline(650, 500, [{ at: 624, text: 'born c. 624 BC' }, { at: 585, text: 'eclipse 585 BC', hi: true }, { at: 546, text: 'dies c. 546 BC' }], (n) => `${n} BC`) +
            label(200, 40, 'Miletus, on the Aegean coast', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'Measuring a pyramid with a shadow',
        body: 'In Egypt he was asked how tall the Great Pyramid was. He planted a stick and waited until its shadow was exactly as long as the stick. At that moment, he said, the pyramid’s shadow must equal the pyramid’s height too. No climbing needed.',
        figure: draw(
          'Sun rays at 45 degrees: a stick with a shadow its own length, and a pyramid with a shadow its own height',
          line(60, 250, 370, 250, DIM, 3) +
            `<polygon points="170,250 290,250 230,130" fill="#fbbf2433" stroke="${HI}" stroke-width="3"/>` +
            line(230, 130, 230, 250, HI, 2, '5 5') +
            line(290, 250, 350, 250, OK, 5) +
            line(80, 200, 80, 250, INK, 4) +
            line(80, 250, 130, 250, OK, 5) +
            line(230, 130, 350, 250, DIM, 2, '4 4') +
            line(80, 200, 130, 250, DIM, 2, '4 4') +
            label(80, 188, 'stick', { size: 13 }) +
            label(105, 275, 'shadow', { size: 13, fill: OK }) +
            label(320, 275, 'shadow', { size: 13, fill: OK }) +
            label(200, 190, 'H', { size: 17, fill: HI }) +
            label(200, 50, 'when stick = its shadow,', { size: 15 }) +
            label(200, 74, 'pyramid = its shadow', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'The rule behind the trick',
        body: 'The stick and its shadow make a small right triangle; the pyramid and its shadow make a big one. The sun makes the same angle in both, so the triangles are similar: same shape, different size. Their sides are in the same ratio, at any time of day.',
        figure: tex(['\\frac{H}{S} = \\frac{h}{s}', 'H = \\frac{h}{s} \\times S', '\\frac{2}{3} \\times 219 = 146\\text{ m}'], 'A 2 m stick, a 3 m shadow, a 219 m pyramid shadow'),
      },
      {
        head: 'How far is that ship?',
        body: 'Thales also found the distance to a ship at sea from a tower. Line up the ship with a mark on the ground, note the angle, and build the same small triangle on land where you can pace it out. Similar triangles turn a distance you can’t walk into one you can.',
        figure: draw(
          'A tower on shore, a sight line to a ship, and a small similar triangle on land',
          line(30, 230, 370, 230, DIM, 3) +
            `<rect x="60" y="120" width="26" height="110" fill="none" stroke="${INK}" stroke-width="3"/>` +
            line(73, 120, 340, 230, HI, 2.5) +
            `<polygon points="330,222 352,222 341,206" fill="${SKY}"/>` +
            line(341, 206, 341, 190, SKY, 3) +
            label(341, 255, 'ship', { size: 13, fill: SKY }) +
            line(73, 120, 150, 230, OK, 3) +
            line(73, 230, 150, 230, OK, 5) +
            label(112, 255, 'paced on land', { size: 13, fill: OK }) +
            arc(73, 120, 40, 270, 55, HI, 2.5) +
            label(200, 60, 'same angle, same shape', { size: 17, fill: HI }) +
            label(200, 290, 'distance = tower ÷ small height × small base', { size: 12, fill: DIM }),
        ),
      },
      {
        head: 'Thales’ theorem',
        body: 'His most famous discovery is about circles. Draw a diameter, then pick any point on the circle and join it to both ends. The angle at that point is always a right angle, exactly 90 degrees, wherever you put the point. Try three points; it never fails.',
        figure: draw(
          'A circle with a diameter and a point on the circle joined to both ends, forming a right angle',
          `<circle cx="200" cy="175" r="110" fill="none" stroke="${DIM}" stroke-width="2.5"/>` +
            line(90, 175, 310, 175, INK, 3) +
            `<circle cx="200" cy="175" r="5" fill="${DIM}"/>` +
            line(90, 175, 145, 80, HI, 3.5) +
            line(310, 175, 145, 80, HI, 3.5) +
            `<circle cx="145" cy="80" r="7" fill="${OK}"/>` +
            `<path d="M 155.2 97.7 L 172.8 87.5 L 162.5 69.8" fill="none" stroke="${OK}" stroke-width="2.5"/>` +
            label(145, 62, 'C', { size: 15, fill: OK }) +
            label(76, 180, 'A', { size: 15 }) +
            label(324, 180, 'B', { size: 15 }) +
            label(200, 40, 'angle ACB = 90°', { size: 17, fill: HI }) +
            label(200, 305, 'any point C on the circle', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Why it must be true',
        body: 'Draw the radius to the point. Now there are two triangles, each with two equal sides, because every radius is the same length. Equal sides give equal base angles: call them a and b. The whole triangle has a plus a plus b plus b, which is 180. So a plus b is 90.',
        figure: draw(
          'The same circle with the radius to C drawn, splitting the triangle into two isosceles triangles with angles a and b',
          `<circle cx="200" cy="175" r="110" fill="none" stroke="${DIM}" stroke-width="2.5"/>` +
            line(90, 175, 310, 175, INK, 3) +
            line(90, 175, 145, 80, INK, 3) +
            line(310, 175, 145, 80, INK, 3) +
            line(200, 175, 145, 80, HI, 3, '6 5') +
            `<circle cx="200" cy="175" r="5" fill="${HI}"/>` +
            label(118, 165, 'a', { size: 15, fill: OK }) +
            label(150, 104, 'a', { size: 15, fill: OK }) +
            label(280, 165, 'b', { size: 15, fill: SKY }) +
            label(178, 90, 'b', { size: 15, fill: SKY }) +
            label(200, 40, 'a + a + b + b = 180°', { size: 17, fill: HI }) +
            label(200, 305, 'so a + b = 90°', { size: 15, fill: OK }),
        ),
      },
      {
        head: 'Five things Thales proved',
        body: 'Ancient writers credit him with five results: a diameter cuts a circle in half; the base angles of an isosceles triangle are equal; crossing lines make equal opposite angles; two angles and the side between them fix a triangle; and the angle in a semicircle is right.',
        figure: draw(
          'Small diagrams: a diameter halving a circle, an isosceles triangle, and equal vertical angles at crossing lines',
          `<circle cx="80" cy="150" r="55" fill="none" stroke="${DIM}" stroke-width="2.5"/>` +
            `<path d="M 25 150 A 55 55 0 0 1 135 150 Z" fill="#fbbf2433" stroke="${HI}" stroke-width="2.5"/>` +
            label(80, 240, 'halves', { size: 13 }) +
            `<polygon points="160,200 260,200 210,95" fill="none" stroke="${INK}" stroke-width="3"/>` +
            line(180, 148, 190, 152, OK, 3) +
            line(240, 148, 230, 152, OK, 3) +
            arc(160, 200, 24, 0, 64, OK, 2.5) +
            arc(260, 200, 24, 116, 64, OK, 2.5) +
            label(210, 240, 'equal base angles', { size: 13 }) +
            line(290, 100, 380, 200, INK, 3) +
            line(380, 100, 290, 200, INK, 3) +
            arc(335, 150, 20, 45, 90, HI, 2.5) +
            arc(335, 150, 20, 225, 90, HI, 2.5) +
            label(335, 240, 'vertical', { size: 13 }) +
            label(200, 40, 'the first proofs in history', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'The eclipse that stopped a war',
        body: 'The historian Herodotus tells that Thales predicted a solar eclipse. On 28 May 585 BC, in the middle of a battle between the Lydians and the Medes, day turned to night. Both armies dropped their weapons and made peace. Geometry of the sky, on a battlefield.',
        figure: draw(
          'The Moon’s disc sliding across the Sun’s disc, with the overlap shaded',
          `<circle cx="215" cy="160" r="85" fill="#fbbf2433" stroke="${HI}" stroke-width="3"/>` +
            `<circle cx="160" cy="160" r="85" fill="#1e1b4b" stroke="${DIM}" stroke-width="2.5"/>` +
            label(300, 60, 'Sun', { size: 15, fill: HI }) +
            label(90, 60, 'Moon', { size: 15, fill: DIM }) +
            arrow(60, 270, 140, 270, DIM, 2.5) +
            label(200, 300, '28 May 585 BC — the sky went dark', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Ratios in the marketplace',
        body: 'Thales was a merchant, and his proportions worked for trade too. If 3 jars of oil cost 12 coins, what do 7 jars cost? Set up the same ratio and cross-multiply. The geometry of similar triangles and the arithmetic of fair prices are the same idea.',
        figure: tex(['\\frac{3}{12} = \\frac{7}{x}', '3x = 84', 'x = 28\\text{ coins}'], 'Same ratio, bigger amount'),
      },
      {
        head: 'From Thales to Euclid',
        body: 'Thales taught that a claim needs a reason. His student Pythagoras carried the idea on, and three centuries later Euclid gathered it all into the Elements. The whole tradition of proof, the thing that makes math different from opinion, starts with him.',
        figure: draw(
          'A timeline from 650 BC to 250 BC marking Thales, Pythagoras and Euclid',
          timeline(650, 250, [{ at: 600, text: 'Thales', hi: true }, { at: 530, text: 'Pythagoras' }, { at: 300, text: 'Euclid' }], (n) => `${n} BC`) +
            label(200, 40, 'the chain of proof', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'Similar shapes today',
        body: 'Every map is a similar copy of the land, shrunk by a scale factor. Every photo is a similar copy of the scene. Architects work from scale models, and your phone’s camera focuses by the very ratios Thales used. Same shape, different size, everywhere.',
        figure: draw(
          'Two similar right triangles, one with sides 3, 4, 5 and a larger one with sides 6, 8, 10',
          `<polygon points="40,250 130,250 130,182" fill="none" stroke="${INK}" stroke-width="3"/>` +
            rightAngle(130, 250, -1, -1, 12, DIM) +
            label(85, 275, '4', { size: 15 }) +
            label(150, 222, '3', { size: 15 }) +
            label(72, 208, '5', { size: 15, fill: HI }) +
            `<polygon points="190,250 370,250 370,114" fill="none" stroke="${OK}" stroke-width="3"/>` +
            rightAngle(370, 250, -1, -1, 14, DIM) +
            label(280, 275, '8', { size: 15, fill: OK }) +
            label(388, 188, '6', { size: 15, fill: OK }) +
            label(262, 170, '10', { size: 15, fill: HI }) +
            arrow(140, 150, 200, 150, HI, 2.5) +
            label(170, 136, '×2', { size: 15, fill: HI }) +
            label(200, 50, 'scale factor 2', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'Your turn: Geometry',
        body: 'Unit 7 of Geometry is Thales’ shadow trick made general: similar triangles and proportions. Unit 11 is his circle theorem and its cousins. When a problem hands you two triangles with the same angles, set up the ratio and cross-multiply, exactly as he did.',
        figure: tex(['\\frac{x}{12} = \\frac{5}{8}', '8x = 60', 'x = 7.5'], 'Matching sides of similar triangles'),
      },
    ],
  },

  // ── Trigonometry ──────────────────────────────────────────────────────
  {
    id: 'Hipparchus',
    name: 'Hipparchus',
    era: 'c. 190–120 BC',
    emoji: '🔭',
    tieIn: 'Trigonometry · Angles, the unit circle & the laws',
    tieInTo: '/trail/TRIG',
    slides: [
      {
        head: 'The astronomer of Rhodes',
        body: 'Hipparchus was born in Nicaea, in what is now Turkey, and spent most of his life on the island of Rhodes, watching the sky. He is called the father of trigonometry because he built the first tool for turning angles into lengths, and used it on the stars.',
        figure: draw(
          'A timeline from 200 BC to 100 BC marking Hipparchus’ life and his star catalogue',
          timeline(200, 100, [{ at: 190, text: 'born c. 190 BC' }, { at: 135, text: 'star catalogue', hi: true }, { at: 120, text: 'dies c. 120 BC' }], (n) => `${n} BC`) +
            label(200, 40, 'Rhodes — an island observatory', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'A table of chords',
        body: 'Take a circle and a central angle. The straight line joining the two ends of the arc is the chord. Hipparchus computed the chord for every angle, in steps, and wrote them in a table. Look up an angle, read off a length: the first trig table ever made.',
        figure: draw(
          'A circle with a central angle and its chord highlighted',
          `<circle cx="200" cy="170" r="110" fill="none" stroke="${DIM}" stroke-width="2.5"/>` +
            `<circle cx="200" cy="170" r="5" fill="${INK}"/>` +
            line(200, 170, 310, 170, INK, 3) +
            line(200, 170, 255, 74.7, INK, 3) +
            line(310, 170, 255, 74.7, HI, 5) +
            arc(200, 170, 34, 0, 60, OK, 3) +
            label(246, 152, '60°', { size: 14, fill: OK }) +
            label(305, 118, 'chord', { size: 15, fill: HI }) +
            label(240, 190, 'R', { size: 14, fill: DIM }) +
            label(200, 40, 'crd(60°) = R', { size: 17, fill: HI }) +
            label(200, 305, 'for 60°, the chord is one radius', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Chords are sines in disguise',
        body: 'Split the chord in half with a line from the center and you get a right triangle. Half the chord, divided by the radius, is the sine of half the angle. So his chord table is a sine table, just labelled differently. Every trig class still runs on it.',
        figure: tex(['\\text{crd}(\\theta) = 2R\\sin\\!\\left(\\tfrac{\\theta}{2}\\right)', '\\text{crd}(60^\\circ) = 2R\\sin 30^\\circ = R'], 'Half the chord over the radius is a sine'),
      },
      {
        head: 'Why a circle has 360 degrees',
        body: 'Hipparchus borrowed the Babylonian habit of counting in sixties and cut the circle into 360 degrees, each degree into 60 minutes. He put the same grid on the Earth as latitude and longitude. Your clock, your compass and your GPS all keep his numbers.',
        figure: draw(
          'A circle marked every 30 degrees from 0 to 330',
          `<circle cx="200" cy="170" r="105" fill="none" stroke="${DIM}" stroke-width="2.5"/>` +
            Array.from({ length: 12 }, (_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x1 = 200 + 95 * Math.cos(a), y1 = 170 - 95 * Math.sin(a);
              const x2 = 200 + 105 * Math.cos(a), y2 = 170 - 105 * Math.sin(a);
              const lx = 200 + 128 * Math.cos(a), ly = 170 - 128 * Math.sin(a) + 5;
              return line(x1, y1, x2, y2, INK, 3) + label(Math.round(lx), Math.round(ly), `${i * 30}`, { size: 12, fill: i % 3 === 0 ? HI : DIM });
            }).join('') +
            label(200, 30, '360° = 6 × 60', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'How far away is the Moon?',
        body: 'During one solar eclipse the Sun was fully covered near the Hellespont but only four-fifths covered in Alexandria. Two places, two views: the Moon seemed to shift against the Sun. From that tiny shift and the distance between the cities, he found the Moon’s distance.',
        figure: draw(
          'The Earth with two observers, the Moon, and the small parallax angle between their two sight lines',
          `<circle cx="80" cy="170" r="50" fill="none" stroke="${SKY}" stroke-width="3"/>` +
            `<circle cx="340" cy="170" r="18" fill="${DIM}"/>` +
            `<circle cx="80" cy="128" r="5" fill="${HI}"/><circle cx="80" cy="212" r="5" fill="${HI}"/>` +
            line(80, 128, 340, 170, HI, 2) +
            line(80, 212, 340, 170, HI, 2) +
            line(80, 128, 80, 212, OK, 3) +
            arc(340, 170, 60, 171, 18, NO, 2.5) +
            label(300, 150, 'p', { size: 15, fill: NO }) +
            label(52, 175, 'b', { size: 15, fill: OK }) +
            label(80, 60, 'Earth', { size: 15, fill: SKY }) +
            label(340, 130, 'Moon', { size: 15 }) +
            label(200, 300, 'two cities see the Moon shifted by angle p', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'The math of the shift',
        body: 'The two sight lines and the baseline between the cities make a long thin triangle. Knowing the baseline and the tiny angle, the far side follows from the tangent. His answer was about 60 to 67 Earth radii. The true figure is 60. He was right to within a few percent.',
        figure: tex(['d = \\frac{b}{\\tan p}', 'd \\approx 60\\text{ Earth radii}'], 'A short baseline and a tiny angle give a huge distance'),
      },
      {
        head: 'A catalogue of 850 stars',
        body: 'A new star appeared in 134 BC, and to make sure nobody would miss the next one he recorded the position of about 850 stars. He also sorted them by brightness into six classes, first magnitude for the brightest, sixth for the faintest. Astronomers still use his scale.',
        figure: draw(
          'Six stars of decreasing size labelled magnitude 1 to 6',
          [1, 2, 3, 4, 5, 6].map((m, i) => {
            const x = 55 + i * 58, r = 22 - m * 3;
            return `<circle cx="${x}" cy="150" r="${r}" fill="${m === 1 ? HI : INK}"/>` + label(x, 215, `${m}`, { size: 15, fill: m === 1 ? HI : INK });
          }).join('') +
            label(200, 250, 'magnitude', { size: 13, fill: DIM }) +
            label(200, 50, 'brightest = 1, faintest = 6', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'The Earth wobbles',
        body: 'Comparing his star positions with records 150 years older, he saw that every star had drifted by about a degree per century. The whole sky was slowly turning. The cause is a wobble of the Earth’s axis, like a spinning top, that takes 26,000 years to go around.',
        figure: draw(
          'A tilted spinning globe whose axis traces a circle above it',
          `<circle cx="200" cy="200" r="70" fill="none" stroke="${SKY}" stroke-width="3"/>` +
            `<ellipse cx="200" cy="200" rx="70" ry="22" fill="none" stroke="${DIM}" stroke-width="2"/>` +
            line(160, 275, 240, 125, HI, 4) +
            `<ellipse cx="200" cy="90" rx="60" ry="18" fill="none" stroke="${HI}" stroke-width="2.5" stroke-dasharray="6 5"/>` +
            `<circle cx="240" cy="102" r="6" fill="${HI}"/>` +
            arrow(150, 80, 168, 76, HI, 2.5) +
            label(200, 40, '1° per century', { size: 17, fill: HI }) +
            label(200, 300, 'one full wobble ≈ 26,000 years', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Coordinates for a round world',
        body: 'To say where a star or a city is, you need two numbers. Hipparchus used latitude, the angle north or south of the equator, and longitude, the angle east or west of a starting line. Any point on a sphere, pinned down by two angles.',
        figure: draw(
          'A globe with latitude and longitude lines and one point marked by two angles',
          `<circle cx="200" cy="170" r="110" fill="none" stroke="${SKY}" stroke-width="3"/>` +
            `<ellipse cx="200" cy="170" rx="110" ry="30" fill="none" stroke="${DIM}" stroke-width="2"/>` +
            `<ellipse cx="200" cy="120" rx="98" ry="26" fill="none" stroke="${DIM}" stroke-width="1.5"/>` +
            `<ellipse cx="200" cy="220" rx="98" ry="26" fill="none" stroke="${DIM}" stroke-width="1.5"/>` +
            `<ellipse cx="200" cy="170" rx="40" ry="110" fill="none" stroke="${DIM}" stroke-width="1.5"/>` +
            line(200, 60, 200, 280, DIM, 2) +
            `<circle cx="252" cy="124" r="7" fill="${HI}"/>` +
            label(285, 118, '(lat, long)', { size: 14, fill: HI }) +
            label(200, 30, 'two angles fix any point', { size: 17, fill: HI }) +
            label(322, 176, 'equator', { size: 12, fill: DIM }),
        ),
      },
      {
        head: 'Passed from hand to hand',
        body: 'Ptolemy built his great book, the Almagest, on Hipparchus’ tables 270 years later. Indian astronomers such as Aryabhata replaced chords with half-chords, our sine. Arab scholars added tangent and the rest. Trig is a relay race that Hipparchus started.',
        figure: draw(
          'A timeline from 200 BC to 1000 AD marking Hipparchus, Ptolemy, Aryabhata and Al-Battani',
          timeline(-200, 1000, [{ at: -140, text: 'Hipparchus', hi: true }, { at: 150, text: 'Ptolemy' }, { at: 499, text: 'Aryabhata' }, { at: 900, text: 'Al-Battani' }], (n) => (n < 0 ? `${-n} BC` : `${n} AD`)) +
            label(200, 40, 'chord → sine → tangent', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'Trigonometry today',
        body: 'GPS finds your position from angles to satellites. Every sound you hear is a sine wave, and every game engine turns the world by sines and cosines dozens of times a second. The chord table was the first draft of all of it.',
        figure: draw(
          'One period of a sine wave with its period and amplitude marked',
          line(30, 170, 370, 170, DIM, 2) +
            `<path d="${Array.from({ length: 61 }, (_, i) => {
              const x = 40 + i * 5.33;
              const y = 170 - 80 * Math.sin(((i * 5.33) / 320) * 2 * Math.PI);
              return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            }).join(' ')}" fill="none" stroke="${HI}" stroke-width="4"/>` +
            line(40, 240, 360, 240, OK, 2.5) +
            line(40, 232, 40, 248, OK, 2.5) + line(360, 232, 360, 248, OK, 2.5) +
            label(200, 268, 'one period = 360°', { size: 15, fill: OK }) +
            line(120, 170, 120, 90, SKY, 2.5, '5 4') +
            label(128, 78, 'amplitude', { size: 13, fill: SKY, anchor: 'start' }) +
            label(200, 40, 'y = sin x', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'Your turn: Trigonometry',
        body: 'Units 1 to 6 of Trigonometry are Hipparchus’ circle: degrees and radians, the unit circle, and the sine and cosine read straight off it. Unit 14 finishes what his triangles began, with the Law of Sines and the Law of Cosines for any triangle at all.',
        figure: tex(['\\sin 30^\\circ = \\tfrac{1}{2} \\qquad \\cos 60^\\circ = \\tfrac{1}{2}', '\\frac{a}{\\sin A} = \\frac{b}{\\sin B}'], 'Read off the unit circle, then solve any triangle'),
      },
    ],
  },

  // ── Precalculus ───────────────────────────────────────────────────────
  {
    id: 'John Napier',
    name: 'John Napier',
    era: '1550–1617',
    emoji: '🧮',
    tieIn: 'Precalculus · Exponentials & logarithms',
    tieInTo: '/trail/PC',
    slides: [
      {
        head: 'The laird of Merchiston',
        body: 'John Napier was a Scottish landowner who lived in a castle near Edinburgh. Neighbours whispered that he was a magician, partly because he kept a black rooster and partly because he spent twenty years alone with columns of numbers. He was building a machine made of arithmetic.',
        figure: draw(
          'A timeline from 1540 to 1630 marking Napier’s life and his books of 1614 and 1617',
          timeline(1540, 1630, [{ at: 1550, text: 'born 1550' }, { at: 1614, text: 'logarithms 1614', hi: true }, { at: 1617, text: 'dies 1617' }], (n) => `${n}`) +
            label(200, 40, 'Merchiston Castle, Edinburgh', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'The problem: too much multiplying',
        body: 'Astronomers such as Tycho Brahe and Kepler had to multiply seven-digit numbers, by hand, thousands of times. One product could take an hour and one slip ruined it all. Napier wanted to turn every multiplication into an addition, which is fast and hard to get wrong.',
        figure: draw(
          'A 7 by 7 grid of partial products beside a single column of addition',
          Array.from({ length: 49 }, (_, i) => `<rect x="${40 + (i % 7) * 24}" y="${80 + Math.floor(i / 7) * 24}" width="22" height="22" fill="none" stroke="${NO}" stroke-width="1.5"/>`).join('') +
            label(124, 60, '49 little products', { size: 14, fill: NO }) +
            label(124, 280, '× by hand', { size: 15, fill: NO }) +
            Array.from({ length: 2 }, (_, i) => `<rect x="280" y="${120 + i * 40}" width="80" height="34" rx="6" fill="none" stroke="${OK}" stroke-width="2.5"/>`).join('') +
            line(280, 206, 360, 206, OK, 3) +
            `<rect x="280" y="214" width="80" height="34" rx="6" fill="#34d39933" stroke="${OK}" stroke-width="2.5"/>` +
            label(320, 60, 'one sum', { size: 14, fill: OK }) +
            label(320, 280, '+ instead', { size: 15, fill: OK }),
        ),
      },
      {
        head: 'The key: exponents add',
        body: 'Here is the trick he built on. Two cubed times two to the fourth is two to the seventh, because you are lining up three copies of two and then four more. Multiplying the powers means adding the exponents. If every number were a power of something, multiplying would become adding.',
        figure: tex(['2^3 \\times 2^4 = 2^{3+4} = 2^7', '8 \\times 16 = 128'], 'Multiply the powers, add the exponents'),
      },
      {
        head: 'A table of powers',
        body: 'Write the exponents in one row and the powers underneath. To multiply 8 by 16, find them in the bottom row, look up to get 3 and 4, add to get 7, and look down again: 128. You never multiplied at all. Napier’s tables did this for every number, not just powers of two.',
        figure: draw(
          'Two rows: exponents 0 to 8 above powers of two 1 to 256, with 3 plus 4 jumping to 7',
          Array.from({ length: 9 }, (_, i) => {
            const x = 36 + i * 41;
            const hi = i === 3 || i === 4 || i === 7;
            return (
              `<rect x="${x - 18}" y="100" width="36" height="34" rx="5" fill="none" stroke="${hi ? HI : DIM}" stroke-width="2"/>` +
              label(x, 124, `${i}`, { size: 15, fill: hi ? HI : INK }) +
              `<rect x="${x - 18}" y="170" width="36" height="34" rx="5" fill="none" stroke="${hi ? OK : DIM}" stroke-width="2"/>` +
              label(x, 194, `${2 ** i}`, { size: i > 6 ? 11 : 13, fill: hi ? OK : INK })
            );
          }).join('') +
            label(200, 70, 'exponent', { size: 13, fill: DIM }) +
            label(200, 240, 'power of 2', { size: 13, fill: DIM }) +
            `<path d="M 159 96 Q 241 40 323 96" fill="none" stroke="${HI}" stroke-width="2.5" stroke-dasharray="6 5"/>` +
            label(241, 38, '3 + 4 = 7', { size: 15, fill: HI }) +
            label(200, 290, '8 × 16 = 128 with no multiplying', { size: 13, fill: OK }),
        ),
      },
      {
        head: 'A logarithm is just the exponent',
        body: 'Napier named the exponent a logarithm, from Greek words for "ratio number". The logarithm of 8, base 2, is 3, because two cubed is 8. The logarithm of 1000, base 10, is 3, because ten cubed is 1000. Ask "what power?", and the answer is the log.',
        figure: tex(['\\log_2 8 = 3 \\quad\\text{because}\\quad 2^3 = 8', '\\log_{10} 1000 = 3', '\\log_{10} 2 \\approx 0.301'], 'The log answers: what exponent gets me there?'),
      },
      {
        head: 'Multiply by adding',
        body: 'To multiply 2 by 1000, look up their logs: about 0.301 and exactly 3. Add them: 3.301. Then look up which number has log 3.301. It is 2000. Three lookups and one addition replaced the multiplication, and it works for any two numbers in the table.',
        figure: tex(['\\log 2 + \\log 1000 = 0.301 + 3 = 3.301', '10^{3.301} = 2000'], 'Look up, add, look back'),
      },
      {
        head: 'Napier’s bones',
        body: 'He also invented a pocket calculator: a set of rods, later called Napier’s bones, each carrying one times table with the digits split by a diagonal. Lay rods side by side and read the products along the diagonals. Sailors and merchants carried them for two centuries.',
        figure: draw(
          'Three of Napier’s rods for 7, 3 and 5, each cell split by a diagonal with the tens and units digits',
          [7, 3, 5].map((d, c) => {
            const x = 110 + c * 64;
            return (
              `<rect x="${x}" y="40" width="56" height="40" rx="4" fill="#fbbf2433" stroke="${HI}" stroke-width="2"/>` +
              label(x + 28, 68, `${d}`, { size: 20, fill: HI }) +
              [2, 3, 4, 5].map((m, r) => {
                const y = 80 + r * 46;
                const p = d * m;
                return (
                  `<rect x="${x}" y="${y}" width="56" height="46" fill="none" stroke="${DIM}" stroke-width="1.5"/>` +
                  line(x, y + 46, x + 56, y, DIM, 1.2) +
                  label(x + 14, y + 20, `${Math.floor(p / 10)}`, { size: 12, fill: INK }) +
                  label(x + 42, y + 40, `${p % 10}`, { size: 12, fill: INK })
                );
              }).join('')
            );
          }).join('') +
            [2, 3, 4, 5].map((m, r) => label(80, 80 + r * 46 + 30, `×${m}`, { size: 13, fill: DIM })).join('') +
            label(200, 300, 'read 735 × 4 along the diagonals', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Briggs and base 10',
        body: 'When the London professor Henry Briggs read Napier’s book, he travelled to Edinburgh, and the two men sat in silence for a quarter of an hour in admiration before speaking. They agreed logs should use base 10, and Briggs spent years computing 30,000 of them by hand.',
        figure: draw(
          'A timeline from 1610 to 1630 marking the Descriptio, the bones, Briggs’ visit and his table',
          timeline(1612, 1626, [{ at: 1614, text: 'Descriptio', hi: true }, { at: 1615, text: 'Briggs visits' }, { at: 1617, text: 'bones' }, { at: 1624, text: '30,000 logs' }], (n) => `${n}`) +
            label(200, 40, 'base 10, the one on your calculator', { size: 15, fill: HI }),
        ),
      },
      {
        head: 'The slide rule',
        body: 'Within a decade William Oughtred put log scales on two rulers that slide past each other. Line up 1 with 2, look above 3, and read 6: the sliding adds the logs. Engineers designed bridges, aircraft and the Apollo rockets on slide rules until the 1970s.',
        figure: draw(
          'Two logarithmic rulers offset so that 2 on the lower lines up with 1 on the upper, showing 2 times 3 equals 6',
          (() => {
            const scale = (y: number, x0: number, color: string) =>
              `<rect x="${x0}" y="${y}" width="${x0 + 300 > 400 ? 400 - x0 : 300}" height="44" rx="6" fill="none" stroke="${color}" stroke-width="2.5"/>` +
              [1, 2, 3, 4, 5, 6, 8, 10].map((n) => {
                const x = x0 + (Math.log10(n) * 300);
                if (x > 396) return '';
                return line(x, y + 30, x, y + 44, color, 2) + label(Math.round(x), y + 22, `${n}`, { size: 12, fill: color });
              }).join('');
            return scale(110, 30 + Math.log10(2) * 300, HI) + scale(170, 30, INK) +
              line(30 + Math.log10(6) * 300, 100, 30 + Math.log10(6) * 300, 224, OK, 2.5, '5 4') +
              label(200, 60, 'slide 1 over 2, read 6 above 3', { size: 15, fill: HI }) +
              label(200, 262, 'log 2 + log 3 = log 6', { size: 15, fill: OK });
          })(),
        ),
      },
      {
        head: 'Log scales all around you',
        body: 'Some things grow so fast that a plain ruler is useless, so we measure their logs. Each step on the Richter scale is ten times the shaking. Each ten decibels is ten times the sound energy. Each unit of pH is ten times the acid. Napier’s idea, hiding in the news every day.',
        figure: draw(
          'Three bars of heights 1, 10 and 100 labelled with Richter magnitudes 5, 6 and 7',
          [1, 10, 100].map((h, i) => {
            const x = 80 + i * 110, bh = 4 + h * 1.75;
            return `<rect x="${x - 30}" y="${250 - bh}" width="60" height="${bh}" rx="4" fill="${i === 2 ? HI : DIM}"/>` +
              label(x, 275, `M ${5 + i}`, { size: 15, fill: i === 2 ? HI : INK }) +
              label(x, 240 - bh, `×${h}`, { size: 13, fill: OK });
          }).join('') +
            label(200, 40, 'one step up = ten times the shaking', { size: 15, fill: HI }) +
            label(200, 305, 'so the scale counts the exponent', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'The natural one',
        body: 'Napier’s own logs were, without his knowing it, nearly the logs of a special number close to 2.718. Euler later named it e. It is the base that growth chooses for itself: money with continuous interest, cooling coffee, spreading rumours. Its log is called the natural log.',
        figure: tex(['e \\approx 2.71828', '\\ln e = 1', 'y = e^{x}'], 'The base that growth picks on its own'),
      },
      {
        head: 'Your turn: Precalculus',
        body: 'Units 5, 6 and 7 of Precalculus are Napier’s machine with modern names: exponential functions, logarithms as the question "what power?", and solving equations by taking a log of both sides. Every time you undo an exponent, you are using his tables.',
        figure: tex(['\\log_3 81 = 4 \\quad\\text{since}\\quad 3^4 = 81', '2^{x} = 32 \\;\\Rightarrow\\; x = \\log_2 32 = 5'], 'Ask what power, and the exponent answers'),
      },
    ],
  },

  // ── SAT Math ──────────────────────────────────────────────────────────
  {
    id: 'George Pólya',
    name: 'George Pólya',
    era: '1887–1985',
    emoji: '🧭',
    tieIn: 'SAT Math · How to solve any problem',
    tieInTo: '/sat',
    slides: [
      {
        head: 'From Budapest to Stanford',
        body: 'George Pólya was born in Budapest, taught in Zürich, and fled Europe for Stanford in 1940. He was a fine mathematician, but his most famous book is only 250 pages and has no hard theorems: How to Solve It, a guide to thinking, has sold over a million copies.',
        figure: draw(
          'A timeline from 1880 to 1990 marking Pólya’s birth, Zürich, Stanford and How to Solve It',
          timeline(1880, 1990, [{ at: 1887, text: 'born 1887' }, { at: 1914, text: 'Zürich' }, { at: 1945, text: 'How to Solve It', hi: true }, { at: 1985, text: 'dies 1985' }], (n) => `${n}`) +
            label(200, 40, 'a book about thinking', { size: 17, fill: HI }),
        ),
      },
      {
        head: 'Four steps',
        body: 'His method fits on one line. Understand the problem. Make a plan. Carry out the plan. Look back. Most mistakes come from skipping the first step or the last one: solving the wrong problem fast, or solving the right one and never checking.',
        figure: draw(
          'Four boxes in a cycle: understand, plan, carry out, look back',
          [['Understand', 60, 80], ['Plan', 300, 80], ['Carry out', 300, 230], ['Look back', 60, 230]].map(([t, x, y]) =>
            `<rect x="${Number(x) - 55}" y="${Number(y) - 22}" width="110" height="44" rx="10" fill="none" stroke="${HI}" stroke-width="3"/>` + label(Number(x), Number(y) + 6, String(t), { size: 15, fill: HI }),
          ).join('') +
            arrow(120, 80, 240, 80, INK) +
            arrow(300, 106, 300, 204, INK) +
            arrow(240, 230, 120, 230, INK) +
            arrow(60, 204, 60, 106, DIM, 2.5) +
            label(180, 165, '1 → 2 → 3 → 4', { size: 15, fill: DIM }) +
            label(200, 295, 'and looking back starts the next problem', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Step 1: understand',
        body: 'What is the unknown? What are you given? What connects them? Say the problem in your own words before touching a pencil. A rectangle has perimeter 30 and its length is twice its width; find the area. Unknown: area. Given: perimeter, a ratio. Connection: the perimeter formula.',
        figure: draw(
          'A problem card with three labelled parts: unknown, given and condition',
          [['UNKNOWN', 'the area', OK], ['GIVEN', 'perimeter 30, length = 2 × width', SKY], ['CONDITION', 'P = 2(length + width)', HI]].map(([k, v, c], i) => {
            const y = 60 + i * 80;
            return `<rect x="30" y="${y}" width="340" height="60" rx="10" fill="none" stroke="${c}" stroke-width="2.5"/>` +
              label(50, y + 24, String(k), { size: 12, fill: String(c), anchor: 'start' }) +
              label(50, y + 48, String(v), { size: 15, anchor: 'start' });
          }).join(''),
        ),
      },
      {
        head: 'Step 2: plan',
        body: 'Have you seen a problem like it? Can you draw it? Can you name the unknown with a letter? Call the width w; then the length is 2w. Sketch the rectangle and write the perimeter around it. Now the plan is obvious: one equation in w, then multiply for the area.',
        figure: draw(
          'A rectangle with width w and length 2w labelled, and the perimeter equation beneath',
          `<rect x="80" y="80" width="240" height="120" rx="4" fill="#fbbf2433" stroke="${HI}" stroke-width="3"/>` +
            label(200, 62, '2w', { size: 20, fill: HI }) +
            label(200, 230, '2w', { size: 20, fill: HI }) +
            label(56, 146, 'w', { size: 20, fill: OK }) +
            label(344, 146, 'w', { size: 20, fill: OK }) +
            label(200, 285, '2w + w + 2w + w = 30', { size: 17 }),
        ),
      },
      {
        head: 'Step 3: carry out',
        body: 'Do the plan, one line at a time, and write each line down. Six w equals 30, so w is 5. The length is 10. The area is 5 times 10, which is 50. Neat lines are not for the grader; they are so you can find your own mistake in step 4.',
        figure: tex(['2(w + 2w) = 30', '6w = 30 \\;\\Rightarrow\\; w = 5', 'A = 5 \\times 10 = 50'], 'One line at a time'),
      },
      {
        head: 'Step 4: look back',
        body: 'Does the answer fit? Put the numbers back: 5 plus 10 plus 5 plus 10 is 30. Yes. Is the length twice the width? Yes. Now the important question: could this method solve a different problem? That is how one solved problem becomes ten.',
        figure: tex(['5 + 10 + 5 + 10 = 30 \\;\\checkmark', '10 = 2 \\times 5 \\;\\checkmark'], 'Check it against every given'),
      },
      {
        head: 'Try small cases',
        body: 'How many diagonals does a 20-sided polygon have? Do not start with 20. A square has 2, a pentagon 5, a hexagon 9. Each corner reaches all but three others, and every diagonal gets counted twice. So n times n minus 3, over 2. For 20 sides: 170.',
        figure: draw(
          'A square, a pentagon and a hexagon with their diagonals drawn and counted, and the formula',
          (() => {
            const poly = (cx: number, n: number, r: number, color: string) => {
              const pts = Array.from({ length: n }, (_, i) => {
                const a = (Math.PI / 2) + (i * 2 * Math.PI) / n;
                return [cx + r * Math.cos(a), 150 - r * Math.sin(a)] as const;
              });
              let s = `<polygon points="${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="2.5"/>`;
              for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) s += line(pts[i][0], pts[i][1], pts[j][0], pts[j][1], color, 1.5);
              return s;
            };
            return poly(75, 4, 45, HI) + poly(200, 5, 48, HI) + poly(325, 6, 50, HI) +
              label(75, 230, '2', { size: 17, fill: OK }) + label(200, 230, '5', { size: 17, fill: OK }) + label(325, 230, '9', { size: 17, fill: OK }) +
              label(200, 60, 'diagonals: 2, 5, 9, …', { size: 15 }) +
              label(200, 290, 'n(n − 3) ÷ 2   →   20 sides: 170', { size: 15, fill: HI });
          })(),
        ),
      },
      {
        head: 'Work backwards',
        body: 'I doubled a number, added 5, and got 21. What was the number? Start from the end and undo each step in reverse order. Take away 5: 16. Halve it: 8. Working backwards turns a puzzle into a walk home, and it is the fastest route on many test questions.',
        figure: draw(
          'A chain of arrows: 8 doubled to 16, plus 5 to 21, then reversed underneath',
          [['8', 60], ['16', 200], ['21', 340]].map(([t, x]) => `<circle cx="${x}" cy="110" r="30" fill="none" stroke="${INK}" stroke-width="3"/>` + label(Number(x), 118, String(t), { size: 20 })).join('') +
            arrow(95, 110, 165, 110, DIM) + label(130, 96, '×2', { size: 13, fill: DIM }) +
            arrow(235, 110, 305, 110, DIM) + label(270, 96, '+5', { size: 13, fill: DIM }) +
            [['?', 60], ['16', 200], ['21', 340]].map(([t, x]) => `<circle cx="${x}" cy="230" r="30" fill="none" stroke="${HI}" stroke-width="3"/>` + label(Number(x), 238, String(t), { size: 20, fill: HI })).join('') +
            arrow(305, 230, 235, 230, OK) + label(270, 216, '−5', { size: 13, fill: OK }) +
            arrow(165, 230, 95, 230, OK) + label(130, 216, '÷2', { size: 13, fill: OK }) +
            label(200, 40, 'forwards, then undo it backwards', { size: 15, fill: HI }) +
            label(200, 295, 'so ? = 8', { size: 15, fill: OK }),
        ),
      },
      {
        head: 'Draw a figure',
        body: 'A 13-foot ladder leans against a wall with its foot 5 feet out. How high does it reach? No picture is given, so draw one: the ground, the wall and the ladder make a right triangle. Once it is drawn, the Pythagorean theorem is staring at you. Never solve a shape in your head.',
        figure: draw(
          'A right triangle of wall, ground and ladder with sides 5, 12 and 13',
          line(60, 260, 340, 260, DIM, 4) +
            line(300, 60, 300, 260, DIM, 4) +
            line(140, 260, 300, 76, HI, 5) +
            rightAngle(300, 260, -1, -1, 16, OK) +
            label(220, 285, '5 ft', { size: 15 }) +
            label(330, 170, '?', { size: 22, fill: OK }) +
            label(190, 150, '13 ft', { size: 15, fill: HI }) +
            label(200, 40, 'draw it, and it is a triangle', { size: 15, fill: HI }) +
            label(200, 310, '5² + ?² = 13²  →  ? = 12', { size: 14, fill: DIM }),
        ),
      },
      {
        head: 'Use the answer choices',
        body: 'On a multiple-choice test the answers are part of the problem. Three x plus 2 equals 17, and the choices are 3, 4, 5 and 6? Plug in 5: fifteen plus two is seventeen. Done, no algebra. Pólya called it guess and check; test-takers call it the fastest tool they have.',
        figure: draw(
          'Four answer choices A to D for 3x + 2 = 17 with C, 5, checked and the rest crossed out',
          label(200, 50, '3x + 2 = 17', { size: 20, fill: HI }) +
            [['A', '3', 11], ['B', '4', 14], ['C', '5', 17], ['D', '6', 20]].map(([l, v, r], i) => {
              const y = 90 + i * 50;
              const ok = v === '5';
              return `<rect x="40" y="${y}" width="330" height="40" rx="8" fill="${ok ? '#34d39933' : 'none'}" stroke="${ok ? OK : DIM}" stroke-width="2.5"/>` +
                label(62, y + 27, `${l}`, { size: 15, fill: ok ? OK : DIM }) +
                label(122, y + 27, `x = ${v}`, { size: 15, fill: ok ? OK : INK }) +
                label(240, y + 27, `3(${v}) + 2 = ${r}`, { size: 14, fill: ok ? OK : NO }) +
                (ok ? `<path d="M 332 ${y + 22} L 340 ${y + 30} L 354 ${y + 12}" fill="none" stroke="${OK}" stroke-width="3.5"/>` : line(334, y + 12, 350, y + 28, NO, 3) + line(350, y + 12, 334, y + 28, NO, 3));
            }).join(''),
        ),
      },
      {
        head: 'The drunk man and the drunk bird',
        body: 'Pólya proved something strange about random wandering. A person taking random steps on flat ground will, sooner or later, always come back to where they started. A bird taking random steps in the air might never return. Two dimensions come home; three can get lost forever.',
        figure: draw(
          'A random walk on a grid that wanders and returns to its starting point',
          Array.from({ length: 8 }, (_, i) => line(40 + i * 45, 40, 40 + i * 45, 290, DIM, 1)).join('') +
            Array.from({ length: 6 }, (_, i) => line(40, 40 + i * 50, 355, 40 + i * 50, DIM, 1)).join('') +
            `<path d="M 175 190 L 220 190 L 220 140 L 265 140 L 265 90 L 220 90 L 175 90 L 175 140 L 130 140 L 130 190 L 175 190" fill="none" stroke="${HI}" stroke-width="4"/>` +
            `<circle cx="175" cy="190" r="8" fill="${OK}"/>` +
            label(175, 216, 'start = end', { size: 13, fill: OK }) +
            label(200, 310, 'on a flat grid, every walk comes home', { size: 13, fill: DIM }),
        ),
      },
      {
        head: 'Your turn: SAT Math',
        body: 'Each SAT question gives you about 90 seconds. Spend the first 15 understanding, 10 planning, most of the rest carrying out, and the last 10 looking back. The strategy tips in the SAT section are Pólya’s four steps, tuned for a clock.',
        figure: draw(
          'A 90-second bar split into understand, plan, carry out and look back',
          (() => {
            const parts = [['understand', 15, SKY], ['plan', 10, HI], ['carry out', 55, OK], ['look back', 10, NO]] as const;
            let x = 40, out = '';
            parts.forEach(([t, s, c]) => {
              const w = (s / 90) * 320;
              out += `<rect x="${x.toFixed(1)}" y="120" width="${w.toFixed(1)}" height="60" fill="${c}" opacity="0.85"/>`;
              out += s >= 40 ? label(Math.round(x + w / 2), 156, `${t} ${s}s`, { size: 13, fill: '#1e1b4b' }) : label(Math.round(x + w / 2), 106, `${s}s`, { size: 13, fill: c });
              x += w;
            });
            return out + label(200, 60, '90 seconds per question', { size: 17, fill: HI }) +
              label(66, 210, 'understand', { size: 12, fill: SKY }) +
              label(111, 232, 'plan', { size: 12, fill: HI }) +
              label(320, 210, 'look back', { size: 12, fill: NO }) +
              label(200, 270, 'plan for ten seconds before you calculate', { size: 13, fill: DIM });
          })(),
        ),
      },
    ],
  },
];
