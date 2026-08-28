// ── The Digital SAT Math blueprint ─────────────────────────────────────────
// The College Board organizes SAT Math into four content areas with fixed
// weighting. Every unit, drill, and mock-test question in this section is
// tagged to one of them, so a student's score report reads in the same
// vocabulary the official score report uses.

export type SatArea = 'ALG' | 'ADV' | 'PSDA' | 'GEO';

export const SAT_AREAS: SatArea[] = ['ALG', 'ADV', 'PSDA', 'GEO'];

export interface SatAreaInfo {
  key: SatArea;
  name: string;
  short: string;
  /** Share of the 44 scored math questions, per the College Board blueprint. */
  weight: number;
  /** Questions out of 44 on a full math section. */
  perTest: number;
  color: string;
  emoji: string;
  blurb: string;
  /** Units in this section that belong to the area. */
  units: number[];
}

export const SAT_AREA_INFO: Record<SatArea, SatAreaInfo> = {
  ALG: {
    key: 'ALG',
    name: 'Algebra',
    short: 'Algebra',
    weight: 0.35,
    perTest: 14,
    color: '#4E7BA6',
    emoji: '⚖️',
    blurb:
      'Linear equations, linear functions, systems, and inequalities. The largest area and the most predictable — these points are the foundation of a good score.',
    units: [1, 2, 3, 4, 5],
  },
  ADV: {
    key: 'ADV',
    name: 'Advanced Math',
    short: 'Advanced',
    weight: 0.35,
    perTest: 15,
    color: '#7D6BA8',
    emoji: '🧩',
    blurb:
      'Equivalent expressions, quadratics, nonlinear systems, polynomials, and exponential models. This is where the hardest questions live — and where scores separate.',
    units: [6, 7, 8, 9, 10],
  },
  PSDA: {
    key: 'PSDA',
    name: 'Problem-Solving and Data Analysis',
    short: 'Data',
    weight: 0.15,
    perTest: 8,
    color: '#5F8C5A',
    emoji: '📊',
    blurb:
      'Ratios, rates, percentages, one- and two-variable data, probability, and inference. Heavy on reading — most mistakes here are comprehension mistakes, not math mistakes.',
    units: [11, 12, 13, 14],
  },
  GEO: {
    key: 'GEO',
    name: 'Geometry and Trigonometry',
    short: 'Geometry',
    weight: 0.15,
    perTest: 7,
    color: '#B07C4F',
    emoji: '📐',
    blurb:
      'Lines, angles, triangles, area and volume, right-triangle trig, and circles. The smallest area, but it rewards memorized formulas more directly than any other.',
    units: [15, 16, 17, 18],
  },
};

/** Ordered list of the 18 units, each tagged to its blueprint area. */
export interface SatUnitInfo {
  unit: number;
  area: SatArea;
  title: string;
  /** One line on what the College Board actually asks here. */
  tested: string;
  standard: string;
}

export const SAT_UNITS: SatUnitInfo[] = [
  // ── Algebra ──
  { unit: 1, area: 'ALG', title: 'Linear Equations in One Variable', standard: 'SAT.ALG.1', tested: 'Solve, and recognize when an equation has no solution or infinitely many.' },
  { unit: 2, area: 'ALG', title: 'Linear Functions and Rate of Change', standard: 'SAT.ALG.2', tested: 'Read slope and intercept as real quantities with units attached.' },
  { unit: 3, area: 'ALG', title: 'Linear Equations in Two Variables', standard: 'SAT.ALG.3', tested: 'Move between slope-intercept, standard, and point-slope form; build a line from a description.' },
  { unit: 4, area: 'ALG', title: 'Systems of Two Linear Equations', standard: 'SAT.ALG.4', tested: 'Solve by substitution or elimination, and count solutions without solving.' },
  { unit: 5, area: 'ALG', title: 'Linear Inequalities and Systems', standard: 'SAT.ALG.5', tested: 'Translate constraint language into inequalities and test candidate points.' },
  // ── Advanced Math ──
  { unit: 6, area: 'ADV', title: 'Equivalent Expressions and Exponents', standard: 'SAT.ADV.1', tested: 'Rewrite expressions: exponent rules, radicals, factoring, and rational expressions.' },
  { unit: 7, area: 'ADV', title: 'Quadratic Equations and the Discriminant', standard: 'SAT.ADV.2', tested: 'Solve by factoring, completing the square, or formula; count real solutions.' },
  { unit: 8, area: 'ADV', title: 'Quadratic Graphs: Forms and Features', standard: 'SAT.ADV.3', tested: 'Pull the vertex, zeros, and y-intercept straight out of the right form.' },
  { unit: 9, area: 'ADV', title: 'Nonlinear Systems, Polynomials, and Rational Equations', standard: 'SAT.ADV.4', tested: 'Intersections of curves, the Factor Theorem, and equations with variables in denominators.' },
  { unit: 10, area: 'ADV', title: 'Exponential Functions, Growth, and Decay', standard: 'SAT.ADV.5', tested: 'Build and interpret a·b^x models, including per-period rates.' },
  // ── Problem-Solving and Data Analysis ──
  { unit: 11, area: 'PSDA', title: 'Ratios, Rates, Proportions, and Units', standard: 'SAT.PSDA.1', tested: 'Set up proportions and chain unit conversions without losing the units.' },
  { unit: 12, area: 'PSDA', title: 'Percentages, Percent Change, and Interest', standard: 'SAT.PSDA.2', tested: 'Percent of, percent change, reverse percent, and successive multipliers.' },
  { unit: 13, area: 'PSDA', title: 'One-Variable Data: Center, Spread, and Shape', standard: 'SAT.PSDA.3', tested: 'Mean vs. median under skew, standard deviation by inspection, and outlier effects.' },
  { unit: 14, area: 'PSDA', title: 'Two-Variable Data, Probability, and Inference', standard: 'SAT.PSDA.4', tested: 'Scatterplots and lines of best fit, two-way tables, and what a sample can justify.' },
  // ── Geometry and Trigonometry ──
  { unit: 15, area: 'GEO', title: 'Lines, Angles, and Triangles', standard: 'SAT.GEO.1', tested: 'Parallel-line angle pairs, the triangle sum, and the exterior angle theorem.' },
  { unit: 16, area: 'GEO', title: 'Area, Volume, and Similarity', standard: 'SAT.GEO.2', tested: 'Composite areas, the volume formulas, and how scaling changes area and volume.' },
  { unit: 17, area: 'GEO', title: 'Right Triangles and Trigonometry', standard: 'SAT.GEO.3', tested: 'Pythagoras, special right triangles, SOH-CAH-TOA, and complementary-angle identities.' },
  { unit: 18, area: 'GEO', title: 'Circles: Equations, Arcs, and Sectors', standard: 'SAT.GEO.4', tested: 'Standard-form circle equations, completing the square, arc length, sector area, and radians.' },
];

export const SAT_UNIT_COUNT = SAT_UNITS.length;

export function satUnit(n: number): SatUnitInfo | null {
  return SAT_UNITS.find((u) => u.unit === n) ?? null;
}

export function areaOfUnit(n: number): SatArea | null {
  return satUnit(n)?.area ?? null;
}
