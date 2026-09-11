import { DOMAIN_COLORS, type Domain } from '../types/problem';

// ── Courses ────────────────────────────────────────────────────────────────
// A *domain* is a body of content (`6.RP`, `A1`, …). A *course* is what a
// student actually chooses on Home, and it may gather several domains: the
// five 6th-grade Common Core strands are one course, not five, and Geometry
// runs from its 6th-grade foundations straight into the high-school material.
//
// Content keeps its domain tags, so nothing about problems, progress or the
// shared assessments moves — this layer only decides how the shelf is
// arranged.

export type CourseId =
  | 'sat'
  | 'precalc'
  | 'trig'
  | 'algebra1'
  | 'geometry'
  | 'grade6'
  | 'grade5';

export interface CourseStrand {
  domain: Domain;
  /** How this strand is named inside its course. */
  label: string;
  /**
   * True when the course draws on content whose home is another course. The
   * Geometry course opens with the 6th-grade geometry strand, but that strand
   * still belongs to 6th Grade Common Core — so back links and breadcrumbs
   * send it there rather than splitting the Common Core standards up.
   */
  borrowed?: boolean;
}

export interface Course {
  id: CourseId;
  /** Shown on the Home card and as the page title. */
  name: string;
  /** Short form for back links and breadcrumbs. */
  short: string;
  emoji: string;
  color: string;
  /** One line under the name on the Home card. */
  kicker: string;
  blurb: string;
  strands: CourseStrand[];
  /** A course with its own bespoke section UI goes there instead. */
  customPath?: string;
}

export const COURSES: Course[] = [
  {
    id: 'sat',
    name: 'SAT Math',
    short: 'SAT Math',
    emoji: '🎯',
    color: DOMAIN_COLORS.SAT,
    kicker: 'Digital SAT prep',
    blurb:
      'The full blueprint: 18 unit playbooks, 180 practice questions with worked explanations, 130 strategy tips, and 5 full-length mock tests with scoring and a recovery plan.',
    strands: [{ domain: 'SAT', label: 'SAT Math' }],
    customPath: '/sat',
  },
  {
    id: 'precalc',
    name: 'Precalculus',
    short: 'Precalculus',
    emoji: '🎢',
    color: DOMAIN_COLORS.PC,
    kicker: 'After Algebra 2',
    blurb:
      'Function transformations, polynomials and rational functions, exponentials and logarithms, trigonometry, sequences, and a first look at limits.',
    strands: [{ domain: 'PC', label: 'Precalculus' }],
  },
  {
    id: 'trig',
    name: 'Trigonometry',
    short: 'Trigonometry',
    emoji: '🌊',
    color: DOMAIN_COLORS.TRIG,
    kicker: 'Angles, waves, and triangles',
    blurb:
      'Degrees and radians, right-triangle trig, the unit circle, graphs of sine and cosine, the reciprocal and inverse functions, identities, equations, and the Laws of Sines and Cosines.',
    strands: [{ domain: 'TRIG', label: 'Trigonometry' }],
  },
  {
    id: 'algebra1',
    name: 'Algebra 1',
    short: 'Algebra 1',
    emoji: '🚀',
    color: DOMAIN_COLORS.A1,
    kicker: 'The first algebra course',
    blurb:
      'Expressions and equations, inequalities, functions, lines and slope, systems, exponents, polynomials, and quadratics — built for middle schoolers taking it early.',
    strands: [{ domain: 'A1', label: 'Algebra 1' }],
  },
  {
    id: 'geometry',
    name: 'Geometry',
    short: 'Geometry',
    emoji: '📐',
    color: DOMAIN_COLORS.GEO,
    kicker: 'Foundations through high school',
    blurb:
      'Starts with the 6th-grade foundations — area, surface area, volume, polygons on the plane — then runs the full high-school course: proof, congruence, similarity, right triangles, circles, solids, and transformations.',
    strands: [
      { domain: '6.G', label: 'Foundations', borrowed: true },
      { domain: 'GEO', label: 'High School Geometry' },
    ],
  },
  {
    id: 'grade6',
    name: '6th Grade Common Core',
    short: '6th Grade',
    emoji: '🧮',
    color: DOMAIN_COLORS['6.EE'],
    kicker: 'All five CCSS strands',
    blurb:
      'The complete 6th-grade standards: ratios and proportions, the number system, expressions and equations, geometry, and statistics and probability.',
    strands: [
      { domain: '6.RP', label: 'Ratios & Proportions' },
      { domain: '6.NS', label: 'The Number System' },
      { domain: '6.EE', label: 'Expressions & Equations' },
      { domain: '6.G', label: 'Geometry' },
      { domain: '6.SP', label: 'Statistics & Probability' },
    ],
  },
  {
    id: 'grade5',
    name: '5th Grade Common Core',
    short: '5th Grade',
    emoji: '🧱',
    color: DOMAIN_COLORS['5.F'],
    kicker: 'Standards and MAP prep',
    blurb:
      'Fractions and decimals, place value, multi-digit arithmetic, measurement and volume, and the coordinate plane — plus NWEA MAP Growth prep organised by instructional area, with an adaptive practice test.',
    strands: [{ domain: '5.F', label: '5th Grade Foundations' }],
  },
];

export function getCourse(id: string): Course | null {
  return COURSES.find((c) => c.id === id) ?? null;
}

/** The domains a course is made of. */
export function courseDomains(c: Course): Domain[] {
  return c.strands.map((s) => s.domain);
}

/**
 * Where a Home card points. A course with a bespoke section goes there; a
 * single-strand course goes straight to that trail, since a course page
 * listing one strand would just be a click in the way; anything else gets
 * the course page.
 */
export function courseHref(c: Course): string {
  if (c.customPath) return c.customPath;
  if (c.strands.length === 1) return `/trail/${c.strands[0].domain}`;
  return `/course/${c.id}`;
}

/**
 * The course a domain calls home, for back links and breadcrumbs. A domain can
 * appear in more than one course — 6.G is the Geometry course's foundations
 * and a 6th-grade Common Core strand — so a course that only borrows it is
 * skipped, and the domain answers to the course it actually belongs to.
 */
export function courseOfDomain(d: Domain): Course | null {
  const owner = COURSES.find((c) => c.strands.some((s) => s.domain === d && !s.borrowed));
  return owner ?? COURSES.find((c) => c.strands.some((s) => s.domain === d)) ?? null;
}

// ── Where a grade should start ─────────────────────────────────────────────
// Asked at the door so the shelf can point somewhere instead of leaving a
// 10-year-old to guess between SAT prep and 5th-grade fractions. It is a
// suggestion and nothing is locked: a student can open any course.

export const GRADE_LEVELS: { value: number; label: string }[] = [
  { value: 4, label: '4th or below' },
  { value: 5, label: '5th' },
  { value: 6, label: '6th' },
  { value: 7, label: '7th' },
  { value: 8, label: '8th' },
  { value: 9, label: '9th' },
  { value: 10, label: '10th' },
  { value: 11, label: '11th' },
  { value: 12, label: '12th' },
];

export const AGE_RANGE = { min: 7, max: 18 };

/** The course to suggest for a school year, following the usual US sequence. */
export function courseForGrade(grade: number): CourseId {
  if (grade <= 5) return 'grade5';
  if (grade <= 7) return 'grade6';
  if (grade <= 9) return 'algebra1';
  if (grade === 10) return 'geometry';
  return 'sat';
}

/** One line saying why that course was suggested. */
export function recommendationReason(grade: number): string {
  if (grade <= 5) return 'Your grade-level standards, and MAP Growth prep built on them.';
  if (grade <= 7) return 'The full 6th-grade Common Core standards, all five strands.';
  if (grade <= 9) return 'The first algebra course — where the next few years are decided.';
  if (grade === 10) return 'Geometry, from the foundations through the full high-school course.';
  return 'SAT Math prep: the blueprint, 5 full mock tests, and a recovery plan.';
}
