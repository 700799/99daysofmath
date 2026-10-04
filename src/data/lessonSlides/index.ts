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
import { PC_SLIDES_U01_04 } from './pc_u01_04';
import { PC_SLIDES_U05_08 } from './pc_u05_08';
import { PC_SLIDES_U09_11 } from './pc_u09_11';
import { PC_SLIDES_U12_14 } from './pc_u12_14';
import { SAT_SLIDES_U01_06 } from './sat_u01_06';
import { SAT_SLIDES_U07_12 } from './sat_u07_12';
import { SAT_SLIDES_U13_18 } from './sat_u13_18';
import { F5_SLIDES_U07_16 } from './f5_u07_16';
import { GEO_SLIDES_U01_07 } from './geo_u01_07';
import { GEO_SLIDES_U08_14 } from './geo_u08_14';
import { TRIG_SLIDES_U01_07 } from './trig_u01_07';
import { TRIG_SLIDES_U08_14 } from './trig_u08_14';

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
  ...PC_SLIDES_U01_04,
  ...PC_SLIDES_U05_08,
  ...PC_SLIDES_U09_11,
  ...PC_SLIDES_U12_14,
  ...SAT_SLIDES_U01_06,
  ...SAT_SLIDES_U07_12,
  ...SAT_SLIDES_U13_18,
  ...F5_SLIDES_U07_16,
  ...GEO_SLIDES_U01_07,
  ...GEO_SLIDES_U08_14,
  ...TRIG_SLIDES_U01_07,
  ...TRIG_SLIDES_U08_14,
};
