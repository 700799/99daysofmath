export type Domain =
  | '5.F' | '6.RP' | '6.NS' | '6.EE' | '6.G' | '6.SP'
  | 'A1' | 'GEO' | 'TRIG' | 'PC' | 'SAT' | 'CALC' | 'STAT';

export const DOMAINS: Domain[] = [
  '5.F', '6.RP', '6.NS', '6.EE', '6.G', '6.SP', 'A1', 'GEO', 'TRIG', 'PC', 'SAT', 'CALC', 'STAT',
];

/**
 * Domains that have a bubble trail of units at /trail/:domain. SAT Math is
 * excluded because it has its own section at /sat — a test-prep surface with
 * playbooks, drills, and full-length mock tests rather than a star trail.
 *
 * A domain is a body of content; what a student picks on Home is a *course*
 * (see src/data/courses.ts), which may gather more than one domain.
 */
export const TRAIL_DOMAINS: Domain[] = [
  '5.F', '6.RP', '6.NS', '6.EE', '6.G', '6.SP', 'A1', 'GEO', 'TRIG', 'PC', 'CALC', 'STAT',
];

/**
 * The six grade-5/6 domains that feed the SHARED assessments (Finals, Mock
 * Test, Daily Mix, adaptive Practice). Algebra 1 is deliberately excluded so
 * MAP-prep surfaces stay grade-level; A1 is served by its own trail + Review.
 */
export const CORE_DOMAINS: Domain[] = ['5.F', '6.RP', '6.NS', '6.EE', '6.G', '6.SP'];

/** Human grade/course label for a domain (used in titles, SEO, headers). */
export function gradeLabelFor(domain: Domain): string {
  if (domain === 'A1') return 'Algebra 1';
  if (domain === 'GEO') return 'Geometry';
  if (domain === 'TRIG') return 'Trigonometry';
  if (domain === 'PC') return 'Precalculus';
  if (domain === 'SAT') return 'SAT Math';
  if (domain === 'CALC') return 'AP Calculus AB';
  if (domain === 'STAT') return 'AP Statistics';
  return domain.startsWith('5.') ? '5th grade' : '6th grade';
}

/** Full course display name for SEO/titles, e.g. "Ratios & Proportions — 6th Grade Math" or "Algebra 1 for Middle School". */
export function domainCourseName(domain: Domain): string {
  if (domain === 'A1') return 'Algebra 1 for Middle School';
  if (domain === 'GEO') return 'High School Geometry';
  if (domain === 'TRIG') return 'Trigonometry';
  if (domain === 'PC') return 'Precalculus for Middle School';
  if (domain === 'SAT') return 'Digital SAT Math Prep';
  if (domain === 'CALC') return 'AP Calculus AB';
  if (domain === 'STAT') return 'AP Statistics';
  const grade = domain.startsWith('5.') ? '5th' : '6th';
  return `${DOMAIN_LABELS[domain]} — ${grade} Grade Math`;
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  '5.F': 'Gr-5 Foundations',
  '6.RP': 'Ratios & Proportions',
  '6.NS': 'The Number System',
  '6.EE': 'Expressions & Equations',
  '6.G': 'Geometry',
  '6.SP': 'Statistics & Probability',
  A1: 'Algebra 1',
  // The course is called "Geometry"; this domain is its high-school half, and
  // 6.G above is the 6th-grade foundations half, so the labels stay distinct.
  GEO: 'High School Geometry',
  TRIG: 'Trigonometry',
  PC: 'Precalculus',
  SAT: 'SAT Math',
  CALC: 'AP Calculus AB',
  STAT: 'AP Statistics',
};

export const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  '5.F': 'Fractions, decimals, place value, measurement, volume, and the coordinate plane',
  '6.RP': 'Unit rates, percent, and ratio tables',
  '6.NS': 'Fractions, decimals, integers, and the coordinate plane',
  '6.EE': 'Variables, expressions, equations, and inequalities',
  '6.G': 'Area, surface area, volume, and polygons',
  '6.SP': 'Data displays, measures of center, and variability',
  A1: 'Equations, inequalities, functions, lines, systems, exponents, and quadratics',
  GEO: 'Proof, congruence, similarity, right triangles, circles, solids, and transformations',
  TRIG: 'Angles and radians, the unit circle, graphs of the trig functions, identities, equations, and the triangle laws',
  PC: 'Function transformations, polynomials, logarithms, trigonometry, sequences, and limits',
  SAT: 'The full Digital SAT Math blueprint: algebra, advanced math, problem-solving and data analysis, and geometry and trigonometry',
  CALC: 'Limits and continuity, derivatives and their rules, applications from related rates to optimization, Riemann sums, the Fundamental Theorem, and integrals for area and volume',
  STAT: 'Describing and collecting data, probability and random variables, sampling distributions, confidence intervals, significance tests, chi-square and inference for regression',
};

export const DOMAIN_COLORS: Record<Domain, string> = {
  // A muted, evenly-weighted family: each subject stays distinguishable while
  // sitting quietly against the graphite surfaces in both light and dark.
  '5.F': '#4C8C8C',  // slate teal
  '6.RP': '#5F8C5A', // sage
  '6.NS': '#4E7BA6', // steel blue
  '6.EE': '#7D6BA8', // muted violet
  '6.G': '#B07C4F',  // clay
  '6.SP': '#A85F5F', // brick
  A1: '#5A6E9E',     // indigo slate
  GEO: '#A8763F',    // ochre — a warmer sibling of 6.G's clay, its foundation
  TRIG: '#4C8C6E',   // pine
  PC: '#8C5F7D',     // mauve
  SAT: '#3E6B7A',    // petrol — the capstone section
  CALC: '#6B5E9E',   // plum — the AP capstone
  STAT: '#5E8A8C',   // juniper
};

export const DOMAIN_EMOJI: Record<Domain, string> = {
  '5.F': '🧱',
  '6.RP': '⚖️',
  '6.NS': '🔢',
  '6.EE': '🧮',
  '6.G': '📐',
  '6.SP': '📊',
  A1: '🚀',
  GEO: '📏',
  TRIG: '🌊',
  PC: '🎢',
  SAT: '🎯',
  CALC: '📈',
  STAT: '🧪',
};

export type AnswerType =
  | 'numeric'
  | 'fraction'
  | 'expression'
  | 'multiple-choice'
  | 'short-text';

export type AcceptanceMode = 'exact' | 'normalized' | 'numeric-tolerance';

export type Diagram =
  | { kind: 'svg-asset'; src: string; alt: string }
  | { kind: 'inline-svg'; svg: string; alt: string }
  | { kind: 'ascii'; art: string };

export interface Choice {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  correct: boolean;
}

export type HintLevel = 'nudge' | 'guide' | 'reveal';

export interface HintStep {
  level: HintLevel;
  text: string;
  title?: string; // optional label, e.g. "Another angle" / "Try a simpler one"
}

export const HINT_LEVEL_ORDER: Record<HintLevel, number> = {
  nudge: 1,
  guide: 2,
  reveal: 3,
};

export interface Problem {
  id: string;
  domain: Domain;
  unit: number;
  orderInUnit: number;
  standard: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  diagram?: Diagram;
  answerType: AnswerType;
  choices?: Choice[];
  primaryAnswer: string;
  alternativeAnswers: string[];
  acceptanceMode: AcceptanceMode;
  numericTolerance?: number;
  hint: string;
  hints?: HintStep[];
  learningObjective?: string;
  topic?: string;
  explanation: string[];
  alternativeExplanations?: { title: string; steps: string[] }[];
  tags: string[];
  estimatedSeconds: number;
}

export interface DomainSummary {
  domain: Domain;
  count: number;
  units: number;
}
