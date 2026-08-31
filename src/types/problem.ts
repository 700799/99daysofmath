export type Domain = '5.F' | '6.RP' | '6.NS' | '6.EE' | '6.G' | '6.SP' | 'A1' | 'PC' | 'SAT';

export const DOMAINS: Domain[] = ['5.F', '6.RP', '6.NS', '6.EE', '6.G', '6.SP', 'A1', 'PC', 'SAT'];

/**
 * Domains that appear as a bubble trail on Home. SAT Math is excluded because
 * it has its own section at /sat — a test-prep surface with playbooks, drills,
 * and full-length mock tests rather than a star trail.
 */
export const TRAIL_DOMAINS: Domain[] = ['5.F', '6.RP', '6.NS', '6.EE', '6.G', '6.SP', 'A1', 'PC'];

/**
 * The six grade-5/6 domains that feed the SHARED assessments (Finals, Mock
 * Test, Daily Mix, adaptive Practice). Algebra 1 is deliberately excluded so
 * MAP-prep surfaces stay grade-level; A1 is served by its own trail + Review.
 */
export const CORE_DOMAINS: Domain[] = ['5.F', '6.RP', '6.NS', '6.EE', '6.G', '6.SP'];

/** Human grade/course label for a domain (used in titles, SEO, headers). */
export function gradeLabelFor(domain: Domain): string {
  if (domain === 'A1') return 'Algebra 1';
  if (domain === 'PC') return 'Precalculus';
  if (domain === 'SAT') return 'SAT Math';
  return domain.startsWith('5.') ? '5th grade' : '6th grade';
}

/** Full course display name for SEO/titles, e.g. "Ratios & Proportions — 6th Grade Math" or "Algebra 1 for Middle School". */
export function domainCourseName(domain: Domain): string {
  if (domain === 'A1') return 'Algebra 1 for Middle School';
  if (domain === 'PC') return 'Precalculus for Middle School';
  if (domain === 'SAT') return 'Digital SAT Math Prep';
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
  PC: 'Precalculus',
  SAT: 'SAT Math',
};

export const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  '5.F': 'Fractions, decimals, place value, measurement, volume, and the coordinate plane',
  '6.RP': 'Unit rates, percent, and ratio tables',
  '6.NS': 'Fractions, decimals, integers, and the coordinate plane',
  '6.EE': 'Variables, expressions, equations, and inequalities',
  '6.G': 'Area, surface area, volume, and polygons',
  '6.SP': 'Data displays, measures of center, and variability',
  A1: 'Equations, inequalities, functions, lines, systems, exponents, and quadratics',
  PC: 'Function transformations, polynomials, logarithms, trigonometry, sequences, and limits',
  SAT: 'The full Digital SAT Math blueprint: algebra, advanced math, problem-solving and data analysis, and geometry and trigonometry',
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
  PC: '#8C5F7D',     // mauve
  SAT: '#3E6B7A',    // petrol — the capstone section
};

export const DOMAIN_EMOJI: Record<Domain, string> = {
  '5.F': '🧱',
  '6.RP': '⚖️',
  '6.NS': '🔢',
  '6.EE': '🧮',
  '6.G': '📐',
  '6.SP': '📊',
  A1: '🚀',
  PC: '🎢',
  SAT: '🎯',
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
