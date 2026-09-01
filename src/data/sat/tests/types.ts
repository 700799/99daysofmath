import type { Diagram } from '../../../types/problem';
import type { SatArea } from '../blueprint';

// ── Mock test data model ───────────────────────────────────────────────────
// A full SAT Math section is two modules of 22 questions, 35 minutes each.
// On the real test Module 2 adapts to Module 1 performance; these mock tests
// present the harder Module 2 form to everyone, so the score estimate is
// conservative rather than flattering.
//
// Mock-test questions deliberately carry NO hint ladder. Hints during a timed
// module would defeat the purpose — the teaching happens afterwards, in the
// explanation and pro tip on the review screen.

export interface SatTestChoice {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
}

export interface SatTestQuestion {
  /** Stable id, e.g. "T1.M1.05". Answers are stored against this. */
  id: string;
  area: SatArea;
  /** The section unit (1-18) whose skill is the crux of this question. Must belong to `area`. Drives the post-test analysis. */
  unit: number;
  module: 1 | 2;
  /** Position within the module, 1-22. */
  n: number;
  difficulty: 1 | 2 | 3;
  prompt: string;
  diagram?: Diagram;
  answerType: 'multiple-choice' | 'numeric';
  choices?: SatTestChoice[];
  /** Choice id for multiple choice; the numeric value otherwise. */
  answer: string;
  /** Other accepted spellings of a numeric answer (fractions, decimals). */
  alternativeAnswers?: string[];
  /** Tolerance for numeric answers that do not land on a clean decimal. */
  tolerance?: number;
  explanation: string[];
  /** One transferable lesson — the reason this question is worth reviewing. */
  proTip: string;
}

export interface SatMockTest {
  n: number;
  title: string;
  /** What this particular test emphasizes, shown on the hub card. */
  blurb: string;
  module1: SatTestQuestion[];
  module2: SatTestQuestion[];
}

export const MODULE_MINUTES = 35;
export const MODULE_QUESTIONS = 22;
