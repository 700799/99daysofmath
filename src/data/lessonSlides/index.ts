import type { SlideBank } from './types';
import { F5_SLIDES } from './f5';
import { RP_SLIDES } from './rp';
import { NS_SLIDES } from './ns';
import { EE_SLIDES } from './ee';
import { G_SLIDES } from './g';
import { SP_SLIDES } from './sp';

export type { LessonSlide, SlideBank } from './types';

// One slide deck per lesson, keyed by `${domain}-${unit}` (see lessonKey).
export const LESSON_SLIDES: SlideBank = {
  ...F5_SLIDES,
  ...RP_SLIDES,
  ...NS_SLIDES,
  ...EE_SLIDES,
  ...G_SLIDES,
  ...SP_SLIDES,
};
