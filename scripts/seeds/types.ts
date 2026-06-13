import type { Diagram, HintStep, Choice, AnswerType, AcceptanceMode, Domain } from '../../src/types/problem';

export interface SeedProblem {
  domain: Domain;
  num: number;
  unit: number;
  order: number;
  slug: string;
  standard: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  diagram?: Diagram;
  answerType: AnswerType;
  choices?: Choice[];
  primaryAnswer: string;
  alternativeAnswers?: string[];
  acceptanceMode: AcceptanceMode;
  numericTolerance?: number;
  hints: HintStep[]; // 1-3 tiers
  learningObjective?: string;
  topic?: string;
  explanation: string[];
  alternativeExplanations?: { title: string; steps: string[] }[];
  tags: string[];
  estimatedSeconds: number;
}
