import type { MathFigure } from '../mathFigure';
import { STORY_FIGURES_G1 } from './g1';
import { STORY_FIGURES_G2 } from './g2';
import { STORY_FIGURES_G3 } from './g3';
import { STORY_FIGURES_G4 } from './g4';

/** story id → one figure per beat, then one for "What you learned". */
export const STORY_FIGURES: Record<string, MathFigure[]> = {
  ...STORY_FIGURES_G1,
  ...STORY_FIGURES_G2,
  ...STORY_FIGURES_G3,
  ...STORY_FIGURES_G4,
};
