import type { SeedProblem } from './types';
import { problemsA1u01 } from './A1_u01_04.js';
import { problemsA1u05 } from './A1_u05_08.js';
import { problemsA1u09 } from './A1_u09_11.js';
import { problemsA1u12 } from './A1_u12_14.js';

// A1 — Algebra 1 for middle school. 14 units × 10 problems, authored in four
// unit-block files and concatenated here (nums 1–140, ids A1.001–A1.140).
export const problemsA1: SeedProblem[] = [
  ...problemsA1u01,
  ...problemsA1u05,
  ...problemsA1u09,
  ...problemsA1u12,
];
