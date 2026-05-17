export type Domain = '6.RP' | '6.NS' | '6.EE' | '6.G' | '6.SP';

export const DOMAINS: Domain[] = ['6.RP', '6.NS', '6.EE', '6.G', '6.SP'];

export const DOMAIN_LABELS: Record<Domain, string> = {
  '6.RP': 'Ratios & Proportions',
  '6.NS': 'The Number System',
  '6.EE': 'Expressions & Equations',
  '6.G': 'Geometry',
  '6.SP': 'Statistics & Probability',
};

export const DOMAIN_DESCRIPTIONS: Record<Domain, string> = {
  '6.RP': 'Unit rates, percent, and ratio tables',
  '6.NS': 'Fractions, decimals, integers, and the coordinate plane',
  '6.EE': 'Variables, expressions, equations, and inequalities',
  '6.G': 'Area, surface area, volume, and polygons',
  '6.SP': 'Data displays, measures of center, and variability',
};

export const DOMAIN_COLORS: Record<Domain, string> = {
  '6.RP': '#58CC02',
  '6.NS': '#1CB0F6',
  '6.EE': '#CE82FF',
  '6.G': '#FF9600',
  '6.SP': '#FF4B4B',
};

export const DOMAIN_EMOJI: Record<Domain, string> = {
  '6.RP': '⚖️',
  '6.NS': '🔢',
  '6.EE': '🧮',
  '6.G': '📐',
  '6.SP': '📊',
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
