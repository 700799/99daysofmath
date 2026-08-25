import type { SlideBank } from './types';
import { F5_SLIDES } from './f5';
import { RP_SLIDES } from './rp';
import { NS_SLIDES } from './ns';
import { EE_SLIDES } from './ee';
import { G_SLIDES } from './g';
import { SP_SLIDES } from './sp';
import { A1_SLIDES_U01_04 } from './a1_u01_04';
import { A1_SLIDES_U05_08 } from './a1_u05_08';
import { A1_SLIDES_U09_11 } from './a1_u09_11';
import { A1_SLIDES_U12_14 } from './a1_u12_14';

export type { LessonSlide, SlideBank } from './types';

// One slide deck per lesson, keyed by `${domain}-${unit}` (see lessonKey).
export const LESSON_SLIDES: SlideBank = {
  ...F5_SLIDES,
  ...RP_SLIDES,
  ...NS_SLIDES,
  ...EE_SLIDES,
  ...G_SLIDES,
  ...SP_SLIDES,
  ...A1_SLIDES_U01_04,
  ...A1_SLIDES_U05_08,
  ...A1_SLIDES_U09_11,
  ...A1_SLIDES_U12_14,
};
