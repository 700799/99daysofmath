import type { SlideBank } from './types';
import { A1_SLIDES_U01_04 } from './a1_u01_04';
import { A1_SLIDES_U05_08 } from './a1_u05_08';
import { A1_SLIDES_U09_11 } from './a1_u09_11';
import { A1_SLIDES_U12_14 } from './a1_u12_14';

// A1 — Algebra 1. 14 decks keyed 'A1-1'..'A1-14', authored in four unit-block
// files and merged here.
export const A1_SLIDES: SlideBank = {
  ...A1_SLIDES_U01_04,
  ...A1_SLIDES_U05_08,
  ...A1_SLIDES_U09_11,
  ...A1_SLIDES_U12_14,
};
