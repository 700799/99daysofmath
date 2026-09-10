import type { Lesson } from '../lessons';

// Geometry, Units 1-14: from points and lines through congruence, similarity,
// right triangles, circles, measurement, and coordinate transformations.

export const GEO_LESSONS: Lesson[] = [
  // ---------------- GEO Unit 1 — Points, lines, planes and segments ----------------
  {
    domain: 'GEO', unit: 1, title: 'Points, lines, planes and segments',
    objective: 'Name points, lines, planes and segments correctly, and find lengths and midpoints along a line.',
    concept: [
      'A POINT is a location with no size, a LINE runs forever in both directions, and a PLANE is a flat surface with no edges — a dot on a street map, a taut wire, a tabletop that never stops.',
      'NOTATION matters: line AB has arrowheads on both ends, ray AB starts at A and shoots through B forever, and segment AB is only the piece between A and B. Written plain, AB means the LENGTH — a number.',
      'SEGMENT ADDITION: if B is between A and C, then AB + BC = AC. Distances along a straight path stack up the way mile markers do.',
      'The MIDPOINT slices a segment into two equal halves. On a number line, the midpoint of a and b is (a + b)/2 — just the average — and the distance between them is |b − a|.',
      'PRO MOVE — before writing any equation, sketch the points in the ORDER the problem names them and label every known piece. Nine times out of ten a "between" problem is only AB + BC = AC with one letter missing.',
    ],
    examples: [
      { q: 'Bus stops A, B and C sit in that order along a straight road. AB = 12 m and BC = 7 m. Find AC.', steps: ['B is between A and C, so segment addition applies.', 'AC = AB + BC = 12 + 7.', 'AC = 19 m.'], answer: '19 m' },
      { q: 'On a number line, P is at −3 and Q is at 9. Find PQ.', steps: ['Distance is the absolute value of the difference.', 'PQ = |9 − (−3)| = |12|.', 'PQ = 12.'], answer: '12' },
      { q: 'On a number line, M is at −3 and N is at 11. Find the coordinate of the midpoint of segment MN.', steps: ['The midpoint on a line is the average of the two coordinates.', '(−3 + 11)/2 = 8/2.', 'The midpoint is at 4.'], answer: '4' },
      { q: 'B lies between A and C. AC = 30 cm and AB = 18 cm. Find BC.', steps: ['AB + BC = AC, so 18 + BC = 30.', 'Subtract 18 from both sides.', 'BC = 12 cm.'], answer: '12 cm' },
      { q: 'M is the midpoint of segment JK. JM = 5x and MK = 3x + 8. Find x.', steps: ['A midpoint makes the two halves equal: 5x = 3x + 8.', 'Subtract 3x from both sides: 2x = 8.', 'x = 4.'], answer: 'x = 4' },
      { q: 'Trail markers X, Y and Z stand in that order on a straight path. XY = 2.4 km and XZ = 6.1 km. Find YZ.', steps: ['XY + YZ = XZ.', 'YZ = 6.1 − 2.4.', 'YZ = 3.7 km.'], answer: '3.7 km' },
    ],
    practice: [
      { q: 'Points R, S and T lie in that order on a straight line. RS = 9 and ST = 14. What is RT?', answers: ['23', '23 units'], steps: ['S is between R and T, so RS + ST = RT.', '9 + 14 = 23.'] },
      { q: 'On a number line, A is at −6 and B is at 10. What is the coordinate of the midpoint of segment AB?', answers: ['2'], steps: ['Average the coordinates: (−6 + 10)/2.', '4/2 = 2.'] },
      { q: 'B is between A and C, with AC = 41 and BC = 17. What is AB?', answers: ['24', '24 units'], steps: ['AB + BC = AC, so AB + 17 = 41.', 'AB = 41 − 17 = 24.'] },
      { q: 'On a number line, point P is at 7 and point Q is at −5. What is PQ?', answers: ['12', '12 units'], steps: ['PQ = |7 − (−5)| = |12|.', 'PQ = 12.'] },
    ],
    watchOut: 'Segment AB is a PIECE of a figure; plain AB is its LENGTH, a number. Lengths are equal (AB = CD), segments are congruent — swapping those two ideas is the classic Unit 1 stumble.',
  },

  // ---------------- GEO Unit 2 — Angles and angle pairs ----------------
  {
    domain: 'GEO', unit: 2, title: 'Angles and angle pairs',
    objective: 'Name angles and find missing measures using angle addition, complementary, supplementary and vertical pairs.',
    concept: [
      'An ANGLE is two rays sharing an endpoint called the VERTEX. Name it with three letters and the vertex in the MIDDLE: angle ABC turns at B.',
      'Angles are measured in DEGREES: acute is under 90°, right is exactly 90°, obtuse is between 90° and 180°, and a straight angle is 180°.',
      'ANGLE ADDITION: if ray BD lies inside angle ABC, then angle ABD + angle DBC = angle ABC. Angles at a shared vertex stack like slices of pizza.',
      'COMPLEMENTARY angles add to 90°; SUPPLEMENTARY angles add to 180°. A LINEAR PAIR — two angles side by side along a straight line — is always supplementary.',
      'PRO MOVE — when two lines cross, VERTICAL angles (the ones directly opposite) are equal and neighbours add to 180°. So one measure hands you all four at once: 40°, 140°, 40°, 140°.',
    ],
    examples: [
      { q: 'Angle A measures 37°. Find its complement.', steps: ['Complementary angles add to 90°.', '90 − 37 = 53.'], answer: '53°' },
      { q: 'Two angles form a linear pair and one of them is 118°. Find the other.', steps: ['A linear pair is supplementary, adding to 180°.', '180 − 118 = 62.'], answer: '62°' },
      { q: 'Ray BD lies inside angle ABC. angle ABD = 25° and angle DBC = 48°. Find angle ABC.', steps: ['Angle addition: the parts add to the whole.', '25 + 48 = 73.'], answer: '73°' },
      { q: 'Two straight streets cross. One of the four angles at the intersection measures 65°. Find the angle directly opposite it.', steps: ['Angles directly opposite at a crossing are vertical angles.', 'Vertical angles are congruent, so it is also 65°.'], answer: '65°' },
      { q: 'At that same 65° street crossing, find the measure of an angle right next to the 65° angle.', steps: ['Neighbours at a crossing form a linear pair.', '180 − 65 = 115.'], answer: '115°' },
      { q: 'Angle 1 and angle 2 are complementary, with angle 1 = 2x and angle 2 = x + 30. Find x.', steps: ['Complementary means 2x + (x + 30) = 90.', '3x + 30 = 90, so 3x = 60.', 'x = 20.'], answer: 'x = 20' },
    ],
    practice: [
      { q: 'Angle P measures 72°. What is the measure of its supplement, in degrees?', answers: ['108', '108 degrees', '108°'], steps: ['Supplementary angles add to 180°.', '180 − 72 = 108.'] },
      { q: 'Ray QS lies inside angle PQR. angle PQS = 31° and angle PQR = 90°. What is angle SQR, in degrees?', answers: ['59', '59 degrees', '59°'], steps: ['Angle addition: 31 + angle SQR = 90.', 'angle SQR = 59.'] },
      { q: 'Two lines cross and one angle measures 143°. What is the measure of the angle vertical to it, in degrees?', answers: ['143', '143 degrees', '143°'], steps: ['Vertical angles are congruent.', 'The opposite angle is also 143°.'] },
      { q: 'An angle measures 44°. What is the measure of its complement, in degrees?', answers: ['46', '46 degrees', '46°'], steps: ['Complements add to 90°.', '90 − 44 = 46.'] },
    ],
    watchOut: 'Complementary is the 90° Corner, supplementary is the 180° Straight line — students swap those two all year. And vertical angles are EQUAL, never supplementary; it is the neighbours that add to 180°.',
  },

  // ---------------- GEO Unit 3 — Parallel lines and transversals ----------------
  {
    domain: 'GEO', unit: 3, title: 'Parallel lines and transversals',
    objective: 'Find missing angle measures when a transversal cuts a pair of parallel lines.',
    concept: [
      'A TRANSVERSAL is a line that cuts across two others — a road slicing over a set of railway tracks — creating eight angles in two matching clusters of four.',
      'CORRESPONDING angles sit in the same seat in each cluster (upper-left with upper-left). When the lines are parallel, corresponding angles are EQUAL.',
      'ALTERNATE INTERIOR angles sit between the parallels on opposite sides of the transversal (the Z shape) and are EQUAL. ALTERNATE EXTERIOR angles sit outside on opposite sides and are equal too.',
      'CO-INTERIOR angles (same-side interior, the C shape) sit between the parallels on the SAME side and are SUPPLEMENTARY — they add to 180°.',
      'PRO MOVE — with parallel lines there are only TWO angle sizes in the whole picture, and they add to 180°. Mark every acute angle x and every obtuse one 180 − x, then read your answer straight off the figure.',
    ],
    examples: [
      { q: 'Two parallel lines are cut by a transversal, and one angle measures 68°. Find its corresponding angle.', steps: ['Corresponding angles on parallel lines are equal.', 'The corresponding angle is 68°.'], answer: '68°' },
      { q: 'Parallel lines are cut by a transversal. Angle 3 measures 112°, and angle 5 is its alternate interior partner. Find angle 5.', steps: ['Alternate interior angles on parallel lines are congruent.', 'angle 5 = 112°.'], answer: '112°' },
      { q: 'Two co-interior (same-side interior) angles formed by parallel lines measure 3x and 2x. Find x.', steps: ['Co-interior angles are supplementary: 3x + 2x = 180.', '5x = 180.', 'x = 36.'], answer: 'x = 36' },
      { q: 'A ladder leans across two parallel horizontal scaffold rungs. It meets the upper rung at 63°. What angle does it make with the lower rung in the corresponding position?', steps: ['The rungs are parallel and the ladder is the transversal.', 'Corresponding angles are equal, so the angle is 63°.'], answer: '63°' },
      { q: 'Parallel lines are cut by a transversal, and an interior angle on one side measures 75°. Find the co-interior angle on that same side.', steps: ['Same-side interior angles add to 180°.', '180 − 75 = 105.'], answer: '105°' },
      { q: 'Two parallel lines are cut by a transversal so a pair of alternate interior angles measure 5x − 10 and 3x + 30. Find x.', steps: ['Alternate interior angles are equal: 5x − 10 = 3x + 30.', '2x = 40.', 'x = 20.'], answer: 'x = 20' },
    ],
    practice: [
      { q: 'Two parallel lines are cut by a transversal, and one angle is 47°. What is the measure of its alternate exterior partner, in degrees?', answers: ['47', '47 degrees', '47°'], steps: ['Alternate exterior angles on parallel lines are congruent.', 'The partner is 47°.'] },
      { q: 'Parallel lines cut by a transversal form co-interior angles of 118° and y°. What is y?', answers: ['62', '62 degrees', '62°'], steps: ['Co-interior angles are supplementary.', '180 − 118 = 62.'] },
      { q: 'Two parallel lines are cut by a transversal and one angle measures 105°. What is the measure of the corresponding angle, in degrees?', answers: ['105', '105 degrees', '105°'], steps: ['Corresponding angles are equal on parallel lines.', 'The corresponding angle is 105°.'] },
      { q: 'On a street map two parallel avenues are crossed by a diagonal boulevard. The boulevard meets the first avenue at 55°. What is the OBTUSE angle it makes with the second avenue, in degrees?', answers: ['125', '125 degrees', '125°'], steps: ['Only two sizes exist: 55° and its supplement.', '180 − 55 = 125.'] },
    ],
    watchOut: 'Every one of these rules dies if the lines are not actually PARALLEL. If the problem never says parallel and shows no arrow marks, equal corresponding angles are something to prove — not to assume.',
  },

  // ---------------- GEO Unit 4 — Reasoning and proof ----------------
  {
    domain: 'GEO', unit: 4, title: 'Reasoning and proof',
    objective: 'Write conditionals and their converse, inverse and contrapositive, disprove claims with counterexamples, and justify the steps of a two-column proof.',
    concept: [
      'A CONDITIONAL is an if-then sentence: "If a figure is a square, then it has four right angles." The if-part is the HYPOTHESIS, the then-part is the CONCLUSION.',
      'The CONVERSE swaps the parts, the INVERSE negates both, and the CONTRAPOSITIVE swaps AND negates. Only the contrapositive is guaranteed to be true whenever the original is.',
      'A COUNTEREXAMPLE is one case that meets the hypothesis but breaks the conclusion. A single counterexample kills a claim; a thousand friendly examples never prove one.',
      'A TWO-COLUMN PROOF puts Statements on the left and Reasons on the right. Every reason must be a given, a definition, a postulate, or a theorem already proved.',
      'PRO MOVE — write the GIVEN at the top and the PROVE at the bottom, then work toward the middle from both ends. The final reason is almost always the definition of the very thing you are proving.',
    ],
    examples: [
      { q: 'Write the converse of: "If it is raining, then the ground is wet."', steps: ['The converse swaps hypothesis and conclusion.', 'Converse: If the ground is wet, then it is raining.'], answer: 'If the ground is wet, then it is raining.' },
      { q: 'Write the contrapositive of: "If an angle measures 90°, then it is a right angle."', steps: ['The contrapositive swaps the parts AND negates both.', 'If an angle is not a right angle, then it does not measure 90°.'], answer: 'If an angle is not a right angle, then it does not measure 90°.' },
      { q: 'Give a counterexample to: "Every quadrilateral with four equal sides is a square."', steps: ['Hunt for a shape that fits the hypothesis but not the conclusion.', 'A tilted rhombus has four equal sides but no right angles.', 'A non-square rhombus is a counterexample.'], answer: 'a rhombus that is not a square' },
      { q: 'In a proof, the statement AB = AB is justified by which property?', steps: ['Any quantity is equal to itself.', 'That is the Reflexive Property.'], answer: 'Reflexive Property' },
      { q: 'If AB = CD and CD = EF, then AB = EF. Name the property used.', steps: ['Two equalities chain together through a shared middle value.', 'That is the Transitive Property.'], answer: 'Transitive Property' },
      { q: 'Write the inverse of: "If a polygon is a triangle, then it has 3 sides."', steps: ['The inverse negates both parts and keeps the order.', 'If a polygon is not a triangle, then it does not have 3 sides.'], answer: 'If a polygon is not a triangle, then it does not have 3 sides.' },
    ],
    practice: [
      { q: 'Swapping the hypothesis and conclusion of a conditional produces which related statement?', answers: ['converse', 'the converse'], steps: ['Swapping the two parts gives the converse.'] },
      { q: 'Which related statement always has the same truth value as the original conditional?', answers: ['contrapositive', 'the contrapositive'], steps: ['Swapping AND negating gives the contrapositive.', 'It is logically equivalent to the original.'] },
      { q: 'If angle A = angle B and angle B = angle C, then angle A = angle C. Name the property used.', answers: ['transitive', 'transitive property', 'the transitive property'], steps: ['Equalities chain through the shared angle B.', 'That is the Transitive Property.'] },
      { q: 'A single example that makes a claim false is called a ___.', answers: ['counterexample', 'a counterexample'], steps: ['One case that fits the hypothesis but breaks the conclusion.', 'That is a counterexample.'] },
    ],
    watchOut: 'The converse of a true statement is very often FALSE. "If it is a square, then it is a rectangle" is true; flipped, it is nonsense. Never quote a rule backwards without checking that it still holds.',
  },

  // ---------------- GEO Unit 5 — Triangle congruence ----------------
  {
    domain: 'GEO', unit: 5, title: 'Triangle congruence',
    objective: 'Choose the correct congruence criterion — SSS, SAS, ASA, AAS or HL — and use CPCTC to finish the argument.',
    concept: [
      'CONGRUENT triangles are identical twins: same shape, same size. The letter order in △ABC ≅ △DEF tells you exactly which sides and angles match.',
      'SSS means three pairs of equal sides. SAS means two sides and the angle BETWEEN them — the hinge angle. If the angle is not between the two sides, SAS does not apply.',
      'ASA means two angles and the side BETWEEN them; AAS means two angles and a side NOT between them. Both work, because two known angles hand you the third for free.',
      'HL is right triangles only: equal hypotenuses plus one equal leg. There is no SSA and no AAA — SSA can build two different triangles, and AAA gives only similarity.',
      'PRO MOVE — mark up the picture with tick marks on equal sides and arcs on equal angles, and never miss the FREE facts: a shared side equals itself (Reflexive) and crossing segments create equal vertical angles.',
    ],
    examples: [
      { q: 'In △ABC and △DEF, AB = DE, BC = EF and CA = FD. Which criterion proves they are congruent?', steps: ['All three pairs of sides match up.', 'That is side-side-side.'], answer: 'SSS' },
      { q: 'In △PQR and △XYZ, PQ = XY, angle Q = angle Y, and QR = YZ. Which criterion applies?', steps: ['The equal angle sits between the two equal sides.', 'An included angle means SAS.'], answer: 'SAS' },
      { q: 'In △ABC and △DEF, angle A = angle D, AB = DE, and angle B = angle E. Which criterion applies?', steps: ['The equal side lies between the two equal angles.', 'That is angle-side-angle.'], answer: 'ASA' },
      { q: 'Two right triangles in a roof truss have equal hypotenuses of 13 ft and one pair of equal legs of 5 ft. Which criterion proves them congruent?', steps: ['They are right triangles with matching hypotenuse and leg.', 'That is the Hypotenuse-Leg criterion.'], answer: 'HL' },
      { q: 'Triangles ABD and CBD share side BD. AB = CB and AD = CD. Which criterion proves △ABD ≅ △CBD?', steps: ['BD = BD by the Reflexive Property — the free third side.', 'That gives three pairs of equal sides.', 'SSS.'], answer: 'SSS' },
      { q: '△ABC ≅ △DEF and angle A = 52°. Find angle D and name the reason.', steps: ['Angle D corresponds to angle A.', 'Corresponding parts of congruent triangles are congruent.', 'angle D = 52° by CPCTC.'], answer: '52°, by CPCTC' },
    ],
    practice: [
      { q: 'Two triangles have all three pairs of sides equal. Name the congruence criterion (letters only).', answers: ['SSS', 'side side side'], steps: ['Three pairs of matching sides.', 'That is SSS.'] },
      { q: 'In △ABC and △DEF, angle A = angle D, angle C = angle F, and BC = EF, where the equal side is NOT between the equal angles. Name the criterion.', answers: ['AAS', 'angle angle side'], steps: ['Two angles plus a non-included side.', 'That is AAS.'] },
      { q: '△ABC ≅ △XYZ and BC = 9 cm. What is the length of YZ, in cm?', answers: ['9', '9 cm'], steps: ['YZ corresponds to BC in the congruence statement.', 'By CPCTC, YZ = 9 cm.'] },
      { q: 'What five-letter abbreviation states that corresponding parts of congruent triangles are congruent?', answers: ['CPCTC'], steps: ['Corresponding Parts of Congruent Triangles are Congruent.', 'CPCTC.'] },
    ],
    watchOut: 'SSA is NOT a criterion — two sides and a non-included angle can fold into two completely different triangles. Check that your angle really sits between the two sides before you write SAS.',
  },

  // ---------------- GEO Unit 6 — Triangle properties ----------------
  {
    domain: 'GEO', unit: 6, title: 'Triangle properties',
    objective: 'Use the angle sum, exterior angle, isosceles, triangle inequality and midsegment facts to find missing measures.',
    concept: [
      'The three angles of ANY triangle add to 180°. Tear the corners off a paper triangle, line them up, and they form a straight angle every single time.',
      'An ISOSCELES triangle has two equal sides, and the BASE ANGLES opposite those sides are equal. An EQUILATERAL triangle has three equal sides and three 60° angles.',
      'An EXTERIOR ANGLE equals the sum of the two REMOTE interior angles — the two it does not touch.',
      'TRIANGLE INEQUALITY: any two sides must add to MORE than the third. Sticks of 3, 4 and 9 will never close into a triangle.',
      'PRO MOVE — a MIDSEGMENT joining the midpoints of two sides is parallel to the third side and exactly HALF its length. Spotting one turns a crowded figure into a simple halving.',
    ],
    examples: [
      { q: 'In △ABC, angle A = 40° and angle B = 60°. Find angle C.', steps: ['The three angles add to 180°.', '40 + 60 = 100.', 'angle C = 180 − 100 = 80°.'], answer: '80°' },
      { q: 'A roof truss is an isosceles triangle whose two equal rafters meet at an apex angle of 40°. Find each base angle.', steps: ['The base angles are equal; call each one x.', '40 + 2x = 180, so 2x = 140.', 'x = 70°.'], answer: '70°' },
      { q: 'In △ABC, the exterior angle at C measures 125° and angle A = 55°. Find angle B.', steps: ['An exterior angle equals the sum of the two remote interior angles.', '125 = 55 + angle B.', 'angle B = 70°.'], answer: '70°' },
      { q: 'Can garden edging pieces of 5 cm, 7 cm and 13 cm form a triangle?', steps: ['Check the two shortest sides: 5 + 7 = 12.', '12 is not greater than 13, so they cannot reach.', 'No.'], answer: 'no' },
      { q: 'In △ABC, D and E are the midpoints of AB and AC. If BC = 18 cm, find DE.', steps: ['DE is a midsegment, so it is half of the third side.', '18 ÷ 2 = 9 cm.'], answer: '9 cm' },
      { q: 'An isosceles triangle has a base angle of 48°. Find its apex angle.', steps: ['Both base angles are 48°, so together they are 96°.', '180 − 96 = 84°.'], answer: '84°' },
    ],
    practice: [
      { q: 'In △ABC, angle A = 35° and angle B = 85°. What is angle C, in degrees?', answers: ['60', '60 degrees', '60°'], steps: ['35 + 85 = 120.', '180 − 120 = 60.'] },
      { q: 'A tent frame is an isosceles triangle with two equal 6 m poles meeting at a 30° apex angle. What is each base angle, in degrees?', answers: ['75', '75 degrees', '75°'], steps: ['30 + 2x = 180, so 2x = 150.', 'x = 75.'] },
      { q: 'In △PQR, M and N are the midpoints of PQ and PR, and QR = 24 cm. What is MN, in cm?', answers: ['12', '12 cm'], steps: ['MN is a midsegment, half of QR.', '24 ÷ 2 = 12 cm.'] },
      { q: 'An exterior angle of a triangle measures 130° and one remote interior angle is 45°. What is the other remote interior angle, in degrees?', answers: ['85', '85 degrees', '85°'], steps: ['The two remote interior angles add to the exterior angle.', '130 − 45 = 85.'] },
    ],
    watchOut: 'An exterior angle equals the sum of the two REMOTE interior angles — not the angle sitting right beside it. The neighbour is its supplement, a completely different number.',
  },

  // ---------------- GEO Unit 7 — Similarity and proportion ----------------
  {
    domain: 'GEO', unit: 7, title: 'Similarity and proportion',
    objective: 'Prove triangles similar using AA, SSS or SAS similarity and use the scale factor to find unknown lengths.',
    concept: [
      'SIMILAR figures have the same shape at a different size: equal angles, and sides in the same RATIO. Write △ABC ~ △DEF with the letters in matching order.',
      'The SCALE FACTOR is the number every length gets multiplied by. A scale factor of 3 triples every side; a scale factor of 1/2 halves them.',
      'AA similarity: two pairs of equal angles is enough, because the third pair follows automatically from the 180° angle sum.',
      'SSS similarity: all three pairs of sides in the same ratio. SAS similarity: two pairs of sides in ratio with the INCLUDED angles equal.',
      'PRO MOVE — INDIRECT MEASUREMENT: a person and a flagpole cast shadows at the same instant, so the two triangles are similar. Set height/shadow = height/shadow and you have measured something you could never climb.',
    ],
    examples: [
      { q: '△ABC ~ △DEF with AB = 6 and DE = 9. Find the scale factor from △ABC to △DEF.', steps: ['Divide a new length by its matching old one.', '9 ÷ 6 = 1.5.'], answer: '1.5' },
      { q: '△ABC ~ △DEF with AB = 4, BC = 6 and DE = 10. Find EF.', steps: ['Set up matching ratios: 4/10 = 6/EF.', 'Cross multiply: 4 × EF = 60.', 'EF = 15.'], answer: '15' },
      { q: 'In △ABC, angle A = 50° and angle B = 60°. In △XYZ, angle X = 50° and angle Y = 60°. Which similarity criterion applies?', steps: ['Two pairs of angles are equal.', 'That is angle-angle similarity.'], answer: 'AA' },
      { q: 'A 6 ft person casts a 4 ft shadow at the same moment a flagpole casts a 22 ft shadow. Find the height of the flagpole.', steps: ['Similar triangles: height/shadow is the same for both.', '6/4 = h/22, so h = 22 × 1.5.', 'h = 33 ft.'], answer: '33 ft' },
      { q: 'One triangle has sides 3, 4 and 5; another has sides 9, 12 and 15. Which similarity criterion proves them similar?', steps: ['Check every ratio: 9/3 = 12/4 = 15/5 = 3.', 'All three sides are in proportion.'], answer: 'SSS' },
      { q: 'A street map uses a scale of 1 cm to 2.5 km. Two towns sit 6 cm apart on the map. Find the real distance.', steps: ['Multiply the map distance by the scale factor.', '6 × 2.5 = 15 km.'], answer: '15 km' },
    ],
    practice: [
      { q: '△ABC ~ △PQR with AB = 5 and PQ = 15. What is the scale factor from △ABC to △PQR?', answers: ['3', 'x3', '3x'], steps: ['15 ÷ 5 = 3.', 'Every length triples.'] },
      { q: '△ABC ~ △DEF with AB = 8, DE = 12 and BC = 10. What is EF?', answers: ['15'], steps: ['Scale factor = 12/8 = 1.5.', 'EF = 10 × 1.5 = 15.'] },
      { q: 'Two triangles each have angles measuring 40° and 75°. Name the similarity criterion (letters only).', answers: ['AA', 'angle angle'], steps: ['Two pairs of equal angles is enough.', 'That is AA similarity.'] },
      { q: 'A 5 ft child casts a 3 ft shadow while a tree casts a 27 ft shadow. How tall is the tree, in feet?', answers: ['45', '45 ft'], steps: ['5/3 = h/27.', 'h = 27 × 5/3 = 45 ft.'] },
    ],
    watchOut: 'Similar is not congruent. Similar triangles have EQUAL angles but PROPORTIONAL sides — do not set two matching sides equal when one figure is just a scaled copy of the other.',
  },

  // ---------------- GEO Unit 8 — Right triangles and the Pythagorean theorem ----------------
  {
    domain: 'GEO', unit: 8, title: 'Right triangles and the Pythagorean theorem',
    objective: 'Apply the Pythagorean theorem and its converse, recognise triples and special right triangles, and use the distance formula.',
    concept: [
      'In a right triangle, a² + b² = c², where c is the HYPOTENUSE — the longest side, always sitting opposite the right angle.',
      'The CONVERSE is a test: if a² + b² = c² the triangle is right; if a² + b² > c² it is acute; if a² + b² < c² it is obtuse.',
      'PYTHAGOREAN TRIPLES are whole-number families worth memorising: 3-4-5, 5-12-13, 8-15-17, 7-24-25 — plus every multiple, such as 6-8-10 and 9-12-15.',
      'SPECIAL RIGHT TRIANGLES: a 45-45-90 has sides x, x, x√2. A 30-60-90 has sides x, x√3, 2x, with the SHORT leg opposite the 30°.',
      'PRO MOVE — the DISTANCE FORMULA is Pythagoras wearing a coordinate disguise: d = √((x₂ − x₁)² + (y₂ − y₁)²) is just the hypotenuse of the run and the rise. Sketch that right triangle and you can never misremember it.',
    ],
    examples: [
      { q: 'A right triangle has legs of 6 cm and 8 cm. Find the hypotenuse.', steps: ['a² + b² = c², so 36 + 64 = 100.', 'c = √100.', 'c = 10 cm.'], answer: '10 cm' },
      { q: 'A 13 ft ladder leans against a wall with its foot 5 ft from the base. How high up the wall does it reach?', steps: ['The wall and ground make the legs: 5² + h² = 13².', '25 + h² = 169, so h² = 144.', 'h = 12 ft.'], answer: '12 ft' },
      { q: 'Is a triangle with sides 9, 12 and 15 a right triangle?', steps: ['Test the converse: 9² + 12² = 81 + 144 = 225.', '15² = 225, and the two match.', 'Yes, it is a right triangle.'], answer: 'yes' },
      { q: 'A square garden gate measures 4 ft on each side. Find the length of its diagonal brace.', steps: ['The diagonal creates a 45-45-90 triangle.', 'Hypotenuse = side × √2 = 4√2.', 'About 5.66 ft.'], answer: '4√2 ft, about 5.66 ft' },
      { q: 'In a 30-60-90 triangle the short leg is 7 cm. Find the hypotenuse and the long leg.', steps: ['Hypotenuse = 2 × short leg = 14 cm.', 'Long leg = short leg × √3 = 7√3 cm.'], answer: 'hypotenuse 14 cm, long leg 7√3 cm' },
      { q: 'Find the distance between the points (1, 2) and (7, 10).', steps: ['Run = 7 − 1 = 6 and rise = 10 − 2 = 8.', 'd = √(36 + 64) = √100.', 'd = 10.'], answer: '10' },
    ],
    practice: [
      { q: 'A right triangle has legs of 9 and 12. What is the length of the hypotenuse?', answers: ['15', '15 units'], steps: ['81 + 144 = 225.', 'c = √225 = 15.'] },
      { q: 'A rectangular TV screen is 36 in wide and 15 in tall. What is the length of its diagonal, in inches?', answers: ['39', '39 in'], steps: ['36² + 15² = 1296 + 225 = 1521.', '√1521 = 39 in.'] },
      { q: 'What is the distance between the points (−2, 1) and (3, 13)?', answers: ['13', '13 units'], steps: ['Run = 5 and rise = 12.', 'd = √(25 + 144) = √169 = 13.'] },
      { q: 'Each leg of a 45-45-90 triangle is 10 cm. What is the hypotenuse? (Use √2 in your answer.)', answers: ['10√2', '10 sqrt2', '10root2', '14.14', '14.142'], steps: ['Hypotenuse = leg × √2.', '10√2 ≈ 14.14 cm.'] },
    ],
    watchOut: 'c is ALWAYS the hypotenuse, the side opposite the right angle. If the problem hands you the hypotenuse and one leg, you SUBTRACT: leg² = c² − a². Adding there is the single most common Pythagoras error.',
  },

  // ---------------- GEO Unit 9 — Right-triangle trigonometry ----------------
  {
    domain: 'GEO', unit: 9, title: 'Right-triangle trigonometry',
    objective: 'Use sine, cosine and tangent to find missing sides and angles, including angles of elevation and depression.',
    concept: [
      'Label from the angle you care about: the HYPOTENUSE faces the right angle, the OPPOSITE side faces your angle, and the ADJACENT side touches it.',
      'SOH-CAH-TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent.',
      'To find a SIDE, pick the ratio that uses the two sides involved and solve. To find an ANGLE, use the inverse keys: sin⁻¹, cos⁻¹, tan⁻¹.',
      'The ANGLE OF ELEVATION is measured UP from the horizontal; the ANGLE OF DEPRESSION is measured DOWN from the horizontal. For a single line of sight they are equal, because the two horizontals are parallel.',
      'PRO MOVE — write the ratio before you touch the calculator, then sanity-check: the hypotenuse is always the longest side, so sin and cos of an acute angle land between 0 and 1. A sine of 1.6 means the setup is upside down.',
    ],
    examples: [
      { q: 'In right triangle ABC the right angle is at C, angle A = 30°, and the hypotenuse AB = 20. Find BC, the side opposite angle A.', steps: ['Opposite and hypotenuse means sine.', 'sin 30° = BC/20, and sin 30° = 0.5.', 'BC = 20 × 0.5 = 10.'], answer: '10' },
      { q: 'A 10 m ladder leans at 65° to the ground. How high up the wall does it touch? Round to one decimal place.', steps: ['The height is opposite the 65° and the ladder is the hypotenuse, so use sine.', 'h = 10 × sin 65° ≈ 10 × 0.9063.', 'h ≈ 9.1 m.'], answer: 'about 9.1 m' },
      { q: 'In a right triangle, the side opposite an acute angle is 7 and the adjacent side is 24. Find that angle to the nearest degree.', steps: ['Opposite over adjacent means tangent.', 'tan θ = 7/24 ≈ 0.2917.', 'θ = tan⁻¹(0.2917) ≈ 16°.'], answer: 'about 16°' },
      { q: 'Standing 50 m from a flagpole, the angle of elevation to its top is 40°. Find the height of the pole to the nearest metre.', steps: ['The height is opposite and the 50 m is adjacent, so use tangent.', 'h = 50 × tan 40° ≈ 50 × 0.8391.', 'h ≈ 42 m.'], answer: 'about 42 m' },
      { q: 'A right triangle has two legs of 5 each. Find its acute angles.', steps: ['tan θ = 5/5 = 1.', 'θ = tan⁻¹(1) = 45°.', 'Both acute angles measure 45°.'], answer: '45° each' },
      { q: 'From the top of a 60 m bridge tower the angle of depression to a boat is 25°. How far is the boat from the base of the tower, to the nearest metre?', steps: ['The angle of depression equals the boat angle of elevation, 25°.', 'tan 25° = 60/d, so d = 60 ÷ tan 25° ≈ 60 ÷ 0.4663.', 'd ≈ 129 m.'], answer: 'about 129 m' },
    ],
    practice: [
      { q: 'In a right triangle the side opposite an angle is 3 and the hypotenuse is 5. What is the sine of that angle, as a decimal?', answers: ['0.6', '.6', '3/5'], steps: ['sin = opposite/hypotenuse = 3/5.', '3/5 = 0.6.'] },
      { q: 'In a right triangle the side adjacent to an angle is 8 and the hypotenuse is 17. What is the cosine of that angle, as a fraction?', answers: ['8/17', '0.4706', '0.47'], steps: ['cos = adjacent/hypotenuse.', 'cos = 8/17.'] },
      { q: 'Which ratio uses the opposite side over the adjacent side: sine, cosine or tangent?', answers: ['tangent', 'tan'], steps: ['TOA: tangent = opposite/adjacent.'] },
      { q: 'A 12 ft wheelchair ramp rises at 30° to the horizontal. How high is its top end, in feet?', answers: ['6', '6 ft'], steps: ['Height is opposite the 30°, ramp is the hypotenuse.', 'h = 12 × sin 30° = 12 × 0.5 = 6 ft.'] },
    ],
    watchOut: 'The words "opposite" and "adjacent" swap places the instant you look at the other acute angle. Re-label the triangle for the angle in the QUESTION before you choose SOH, CAH or TOA.',
  },

  // ---------------- GEO Unit 10 — Quadrilaterals and polygons ----------------
  {
    domain: 'GEO', unit: 10, title: 'Quadrilaterals and polygons',
    objective: 'Identify special quadrilaterals by their properties and compute interior and exterior angle measures of polygons.',
    concept: [
      'A PARALLELOGRAM has both pairs of opposite sides parallel. Opposite sides and opposite angles are equal, consecutive angles are supplementary, and the diagonals bisect each other.',
      'A RECTANGLE is a parallelogram with four right angles and equal diagonals. A RHOMBUS is a parallelogram with four equal sides and perpendicular diagonals. A SQUARE is both at once.',
      'A TRAPEZOID has exactly one pair of parallel sides; an ISOSCELES trapezoid has equal legs and equal base angles. Its MEDIAN (midsegment) is the AVERAGE of the two parallel sides.',
      'The interior angles of an n-sided polygon add to (n − 2) × 180°. A hexagon patch in a quilt: (6 − 2) × 180 = 720°.',
      'PRO MOVE — the EXTERIOR angles of any convex polygon always total 360°, no matter how many sides. For a REGULAR polygon each exterior angle is 360/n and each interior angle is 180 − 360/n — far faster than the (n − 2) route.',
    ],
    examples: [
      { q: 'In parallelogram ABCD, angle A = 65°. Find angle B.', steps: ['Consecutive angles of a parallelogram are supplementary.', '180 − 65 = 115°.'], answer: '115°' },
      { q: 'In that same parallelogram ABCD with angle A = 65°, find angle C.', steps: ['Opposite angles of a parallelogram are equal.', 'angle C = 65°.'], answer: '65°' },
      { q: 'Find the sum of the interior angles of an octagonal stop sign.', steps: ['Use (n − 2) × 180 with n = 8.', '6 × 180 = 1080°.'], answer: '1080°' },
      { q: 'Each exterior angle of a regular polygon on a flag design is 30°. How many sides does it have?', steps: ['Exterior angles always total 360°.', '360 ÷ 30 = 12.'], answer: '12 sides' },
      { q: 'A trapezoidal quilt panel has parallel sides of 10 cm and 16 cm. Find the length of its median.', steps: ['The median is the average of the two parallel sides.', '(10 + 16)/2 = 13 cm.'], answer: '13 cm' },
      { q: 'Find each interior angle of a regular hexagon tile.', steps: ['Each exterior angle = 360 ÷ 6 = 60°.', 'Interior = 180 − 60 = 120°.'], answer: '120°' },
    ],
    practice: [
      { q: 'What is the sum of the interior angles of a pentagon, in degrees?', answers: ['540', '540 degrees', '540°'], steps: ['(5 − 2) × 180.', '3 × 180 = 540.'] },
      { q: 'In parallelogram PQRS, angle P = 110°. What is angle Q, in degrees?', answers: ['70', '70 degrees', '70°'], steps: ['Consecutive angles are supplementary.', '180 − 110 = 70.'] },
      { q: 'A regular polygon has 9 sides. What is the measure of each exterior angle, in degrees?', answers: ['40', '40 degrees', '40°'], steps: ['Exterior angles total 360°.', '360 ÷ 9 = 40.'] },
      { q: 'A trapezoid has parallel sides of 8 in and 14 in. What is the length of its midsegment, in inches?', answers: ['11', '11 in'], steps: ['Average the parallel sides.', '(8 + 14)/2 = 11 in.'] },
    ],
    watchOut: 'The formula (n − 2) × 180 gives the TOTAL of all interior angles, not one of them. Divide by n only when the polygon is REGULAR — an irregular pentagon still totals 540° with five wildly different angles.',
  },

  // ---------------- GEO Unit 11 — Circles ----------------
  {
    domain: 'GEO', unit: 11, title: 'Circles',
    objective: 'Relate central and inscribed angles to their arcs, apply chord and tangent properties, and compute arc length and sector area.',
    concept: [
      'A CENTRAL angle has its vertex at the CENTRE, and it equals its intercepted arc: a 70° central angle cuts a 70° arc.',
      'An INSCRIBED angle has its vertex ON the circle and measures HALF its intercepted arc. So any angle inscribed in a semicircle is exactly 90°.',
      'A CHORD joins two points on the circle. A radius drawn perpendicular to a chord bisects it, and chords of equal length sit equally far from the centre.',
      'A TANGENT touches the circle at exactly one point and is PERPENDICULAR to the radius at that point — the 90° that turns tangent problems into right-triangle problems.',
      'PRO MOVE — arc length and sector area are just fractions of the whole circle: arc = (θ/360) × 2πr and sector = (θ/360) × πr². A 90° pizza slice is a quarter of the pie, so it carries a quarter of the crust and a quarter of the cheese.',
    ],
    examples: [
      { q: 'A central angle of 80° is drawn in a circle. What is the measure of its intercepted arc?', steps: ['A central angle equals its intercepted arc.', 'The arc measures 80°.'], answer: '80°' },
      { q: 'An inscribed angle intercepts an arc of 100°. Find the inscribed angle.', steps: ['An inscribed angle is half its intercepted arc.', '100 ÷ 2 = 50°.'], answer: '50°' },
      { q: 'Triangle ABC is inscribed in a circle and side AC is a diameter. Find angle B.', steps: ['Angle B is inscribed in a semicircle, so it intercepts a 180° arc.', '180 ÷ 2 = 90°.'], answer: '90°' },
      { q: 'A tangent line touches a circle at point P, and O is the centre. Find the angle between the tangent and radius OP.', steps: ['A tangent is perpendicular to the radius at the point of contact.', 'The angle is 90°.'], answer: '90°' },
      { q: 'A pizza of radius 12 in is cut into a 60° slice. Find the arc length of its crust, in terms of π.', steps: ['Arc = (60/360) × 2πr = (1/6) × 24π.', 'Arc = 4π in.'], answer: '4π in' },
      { q: 'Find the area of a 90° sector of a circle with radius 10 cm, in terms of π.', steps: ['Sector = (90/360) × πr² = (1/4) × 100π.', 'Sector = 25π cm².'], answer: '25π cm²' },
    ],
    practice: [
      { q: 'An inscribed angle in a circle measures 35°. What is the measure of its intercepted arc, in degrees?', answers: ['70', '70 degrees', '70°'], steps: ['The arc is twice the inscribed angle.', '35 × 2 = 70.'] },
      { q: 'A central angle of 120° is drawn in a circle of radius 6. What is the arc length, in terms of π?', answers: ['4π', '4pi', '4 pi'], steps: ['Arc = (120/360) × 2π(6) = (1/3) × 12π.', 'Arc = 4π.'] },
      { q: 'A tangent line touches a circle at T and O is the centre. What is the measure of the angle between the tangent and radius OT, in degrees?', answers: ['90', '90 degrees', '90°'], steps: ['Tangent and radius meet at right angles.', 'The angle is 90°.'] },
      { q: 'A sector of a circle of radius 4 cm has a central angle of 90°. What is its area, in terms of π?', answers: ['4π', '4pi', '4 pi'], steps: ['Sector = (1/4) × π(4²) = (1/4) × 16π.', 'Sector = 4π cm².'] },
    ],
    watchOut: 'A CENTRAL angle equals its arc, but an INSCRIBED angle is only HALF of it. Look at where the vertex sits — centre or rim — before you decide whether to double or to halve.',
  },

  // ---------------- GEO Unit 12 — Perimeter, area and composite figures ----------------
  {
    domain: 'GEO', unit: 12, title: 'Perimeter, area and composite figures',
    objective: 'Compute perimeter and area of standard shapes and break composite or shaded regions into pieces.',
    concept: [
      'PERIMETER is the walk around the outside (plain units); AREA is the surface covered (square units). Fencing a garden bed is perimeter; laying turf inside it is area.',
      'Triangle A = (1/2)bh, parallelogram A = bh, trapezoid A = (1/2)(b₁ + b₂)h. In every one of these the height is PERPENDICULAR to the base, never the slanted side.',
      'Circle: circumference C = 2πr and area A = πr². The radius is half the diameter — halve FIRST, then square.',
      'REGULAR POLYGON: A = (1/2) × apothem × perimeter, where the apothem runs from the centre to the middle of a side.',
      'PRO MOVE — for a SHADED region, find the big shape and subtract the hole. A round flower bed cut out of a square lawn is simply square − circle; never try to measure those leftover corners directly.',
    ],
    examples: [
      { q: 'A triangular sail has base 9 m and height 6 m. Find its area.', steps: ['A = (1/2)bh.', '(1/2) × 9 × 6 = 27.', 'Area = 27 m².'], answer: '27 m²' },
      { q: 'A parallelogram floor tile has base 12 cm and perpendicular height 5 cm. Find its area.', steps: ['A = bh for a parallelogram.', '12 × 5 = 60 cm².'], answer: '60 cm²' },
      { q: 'A trapezoidal garden bed has parallel sides of 8 ft and 12 ft with height 5 ft. Find its area.', steps: ['A = (1/2)(b₁ + b₂)h.', '(1/2) × (8 + 12) × 5 = (1/2) × 100.', 'Area = 50 ft².'], answer: '50 ft²' },
      { q: 'A pizza has diameter 16 in. Find its area in terms of π.', steps: ['Radius = 16 ÷ 2 = 8 in.', 'A = πr² = π × 64.', 'Area = 64π in².'], answer: '64π in²' },
      { q: 'A regular hexagon logo has side 6 cm and apothem 5.2 cm. Find its area.', steps: ['Perimeter = 6 × 6 = 36 cm.', 'A = (1/2) × 5.2 × 36.', 'Area ≈ 93.6 cm².'], answer: 'about 93.6 cm²' },
      { q: 'A square lawn 10 m on a side has a circular pond of radius 3 m cut out of it. Find the remaining lawn area in terms of π.', steps: ['Square area = 10 × 10 = 100 m².', 'Pond area = π × 3² = 9π m².', 'Lawn = 100 − 9π m².'], answer: '100 − 9π m²' },
    ],
    practice: [
      { q: 'A triangle has base 14 cm and height 10 cm. What is its area, in cm²?', answers: ['70', '70 cm2'], steps: ['(1/2) × 14 × 10.', 'Area = 70 cm².'] },
      { q: 'A circular tabletop has radius 5 m. What is its area, in terms of π?', answers: ['25π', '25pi', '25 pi'], steps: ['A = πr² = π × 25.', 'Area = 25π m².'] },
      { q: 'A trapezoid has parallel sides of 6 in and 10 in and a height of 4 in. What is its area, in square inches?', answers: ['32'], steps: ['(1/2)(6 + 10)(4) = (1/2)(64).', 'Area = 32 in².'] },
      { q: 'A rectangular quilt measures 8 ft by 5 ft. What is its perimeter, in feet?', answers: ['26', '26 ft'], steps: ['P = 2(8) + 2(5) = 16 + 10.', 'Perimeter = 26 ft.'] },
    ],
    watchOut: 'The height in an area formula must be PERPENDICULAR to the base. A parallelogram with a 10 cm slanted side and a 6 cm straight-up height uses the 6 — the slant is bait.',
  },

  // ---------------- GEO Unit 13 — Surface area and volume ----------------
  {
    domain: 'GEO', unit: 13, title: 'Surface area and volume',
    objective: 'Find the surface area and volume of prisms, cylinders, pyramids, cones and spheres, and predict what scaling does to each.',
    concept: [
      'VOLUME of any prism or cylinder is base area × height: V = Bh. A grain silo is a circle dragged straight upward, so V = πr²h.',
      'A PYRAMID or CONE holds exactly ONE THIRD of the prism or cylinder with the same base and height: V = (1/3)Bh and V = (1/3)πr²h.',
      'SPHERE: V = (4/3)πr³ and surface area = 4πr² — a ball wears a skin exactly four times the area of its own great circle.',
      'SURFACE AREA adds up every face: a prism is two bases plus the lateral faces, and a cylinder is 2πr² + 2πrh — two lids plus the label unrolled into a rectangle.',
      'PRO MOVE — SCALING: multiply every length by k and area grows by k², volume by k³. Double the size of a water tank and it holds EIGHT times as much, which is exactly why big containers are so efficient.',
    ],
    examples: [
      { q: 'A rectangular shipping box is 4 ft by 3 ft by 2 ft. Find its volume.', steps: ['V = length × width × height.', '4 × 3 × 2 = 24.', 'Volume = 24 ft³.'], answer: '24 ft³' },
      { q: 'A cylindrical water tank has radius 3 m and height 10 m. Find its volume in terms of π.', steps: ['V = πr²h.', 'π × 9 × 10 = 90π.', 'Volume = 90π m³.'], answer: '90π m³' },
      { q: 'A cone-shaped paper cup has radius 3 cm and height 8 cm. Find its volume in terms of π.', steps: ['V = (1/3)πr²h.', '(1/3) × π × 9 × 8 = 24π.', 'Volume = 24π cm³.'], answer: '24π cm³' },
      { q: 'A spherical balloon has radius 6 in. Find its surface area in terms of π.', steps: ['SA = 4πr².', '4 × π × 36 = 144π.', 'Surface area = 144π in².'], answer: '144π in²' },
      { q: 'A square pyramid has a base 6 m on each side and a height of 10 m. Find its volume.', steps: ['Base area B = 6 × 6 = 36 m².', 'V = (1/3) × 36 × 10 = 120.', 'Volume = 120 m³.'], answer: '120 m³' },
      { q: 'A model silo is scaled up by a factor of 3. How many times larger is its volume?', steps: ['Volume scales by the cube of the scale factor.', '3³ = 27.', 'It holds 27 times as much.'], answer: '27 times' },
    ],
    practice: [
      { q: 'A cube has an edge of 5 cm. What is its volume, in cm³?', answers: ['125', '125 cm3'], steps: ['V = 5 × 5 × 5.', 'Volume = 125 cm³.'] },
      { q: 'A cylinder has radius 2 m and height 7 m. What is its volume, in terms of π?', answers: ['28π', '28pi', '28 pi'], steps: ['V = πr²h = π × 4 × 7.', 'Volume = 28π m³.'] },
      { q: 'A cone has the same base and height as a cylinder whose volume is 60 cm³. What is the volume of the cone, in cm³?', answers: ['20', '20 cm3'], steps: ['A cone is one third of the matching cylinder.', '60 ÷ 3 = 20 cm³.'] },
      { q: 'A garden statue is enlarged so that every length doubles. Its surface area becomes how many times as large?', answers: ['4', '4 times'], steps: ['Area scales by k² with k = 2.', '2² = 4.'] },
    ],
    watchOut: 'Doubling the dimensions does NOT double the volume — it multiplies it by 8. Lengths scale by k, areas by k², volumes by k³, and forgetting the exponent is the whole unit in one mistake.',
  },

  // ---------------- GEO Unit 14 — Transformations and coordinate geometry ----------------
  {
    domain: 'GEO', unit: 14, title: 'Transformations and coordinate geometry',
    objective: 'Perform translations, reflections, rotations and dilations on the coordinate plane and use slope, midpoint and distance to prove facts about figures.',
    concept: [
      'A TRANSLATION slides a figure: (x, y) → (x + a, y + b). Translations, reflections and rotations are RIGID motions — size and shape survive, so the image is CONGRUENT to the original.',
      'REFLECTION rules: across the x-axis (x, y) → (x, −y); across the y-axis (x, y) → (−x, y); across the line y = x, (x, y) → (y, x).',
      'ROTATION about the origin: 90° counterclockwise (x, y) → (−y, x); 180° (x, y) → (−x, −y); 270° counterclockwise (x, y) → (y, −x).',
      'A DILATION centred at the origin with scale factor k sends (x, y) → (kx, ky). It is NOT rigid: the image is SIMILAR to the original, not congruent, unless k = 1.',
      'PRO MOVE — coordinate proofs run on three tools: slope m = (y₂ − y₁)/(x₂ − x₁) tests parallel (equal slopes) and perpendicular (slopes multiply to −1); the midpoint ((x₁ + x₂)/2, (y₁ + y₂)/2) tests bisection; the distance formula tests equal lengths.',
    ],
    examples: [
      { q: 'Translate the point (3, −2) four units right and five units up.', steps: ['Add 4 to x and 5 to y.', '(3 + 4, −2 + 5).', 'Image: (7, 3).'], answer: '(7, 3)' },
      { q: 'Reflect the point (5, 2) across the x-axis.', steps: ['A reflection across the x-axis negates the y-coordinate.', 'Image: (5, −2).'], answer: '(5, −2)' },
      { q: 'Rotate the point (4, 1) 90° counterclockwise about the origin.', steps: ['Rule: (x, y) → (−y, x).', 'Image: (−1, 4).'], answer: '(−1, 4)' },
      { q: 'A company logo is dilated about the origin by a scale factor of 3. Where does the point (2, −5) land?', steps: ['Multiply both coordinates by 3.', 'Image: (6, −15).'], answer: '(6, −15)' },
      { q: 'Find the slope of the line through (1, 2) and (5, 10). Is it parallel to a line of slope 2?', steps: ['m = (10 − 2)/(5 − 1) = 8/4.', 'm = 2.', 'Equal slopes, so yes, the lines are parallel.'], answer: 'slope 2, so yes, parallel' },
      { q: 'Find the midpoint of the segment joining (−4, 3) and (6, 9).', steps: ['Average the x-values: (−4 + 6)/2 = 1.', 'Average the y-values: (3 + 9)/2 = 6.', 'Midpoint: (1, 6).'], answer: '(1, 6)' },
    ],
    practice: [
      { q: 'Reflect the point (−3, 7) across the y-axis. Give the image as an ordered pair.', answers: ['(3, 7)', '(3,7)', '3, 7'], steps: ['Reflecting across the y-axis negates x.', 'Image: (3, 7).'] },
      { q: 'What is the image of (2, −6) after a 180° rotation about the origin? Give an ordered pair.', answers: ['(-2, 6)', '(-2,6)', '-2, 6'], steps: ['Rule: (x, y) → (−x, −y).', 'Image: (−2, 6).'] },
      { q: 'What is the midpoint of the segment joining (2, 5) and (8, 11)? Give an ordered pair.', answers: ['(5, 8)', '(5,8)', '5, 8'], steps: ['x: (2 + 8)/2 = 5.', 'y: (5 + 11)/2 = 8.'] },
      { q: 'A line passes through (0, 1) and (4, 9). What is its slope?', answers: ['2'], steps: ['m = (9 − 1)/(4 − 0) = 8/4.', 'Slope = 2.'] },
    ],
    watchOut: 'A dilation changes SIZE, so it is the one transformation that does not give a congruent image — it gives a similar one. And every rotation rule here runs COUNTERclockwise unless the problem says otherwise.',
  },
];
