// The story-style slide format for lessons. Every lesson carries 12–22 of
// these: 1 objective · 3–5 concept · 6–7 examples climbing a ladder (base case
// with small numbers → bigger numbers → multi-step → "Another way" alternate
// approach → word problem that shows how to VISUALIZE it first) · 1–2 pro tips
// · 1–2 traps · 1 challenge ("Extra credit" stretch problem, fully worked) ·
// 1 summary. ~3 short sentences per slide, written to be read by a
// 10–12-year-old. Slides advance on button press only; each kind has a minimum
// read time before Next unlocks (see LessonCard).
//
// A slide may also carry VISUAL BLOCKS. Prose alone made every slide look the
// same and buried the formula in the middle of a paragraph; a block lifts the
// mathematics out of the sentence and frames it: the rule typeset big with
// each symbol named, two ideas held side by side, a worked run one step per
// box, a table of values, or a drawing. Blocks render under the body in the
// order listed here.

/** How a block is tinted. Every tone resolves to theme tokens, never raw hex. */
export type SlideTone = 'accent' | 'ok' | 'warn' | 'bad' | 'plain';

/** The rule itself, typeset big in its own frame, with each symbol named. */
export interface FormulaBlock {
  /** KaTeX, rendered in display mode. */
  tex: string;
  /** One line under the formula — what it says in words. */
  note?: string;
  /** What each symbol in it does; rendered as its own small box each. */
  parts?: { sym: string; means: string; tone?: SlideTone }[];
}

/** Two or three things held side by side, so the difference is the picture. */
export interface CompareBlock {
  cols: { title: string; tex?: string; lines: string[]; tone?: SlideTone }[];
  note?: string;
}

/** A worked run: one box per step, each saying the move that got you there. */
export interface StepsBlock {
  steps: { tex?: string; text: string }[];
  /** The result, in its own highlighted box at the end. */
  answer?: string;
}

/** A small table of values — for a pattern you are meant to read down a column. */
export interface TableBlock {
  head: string[];
  rows: string[][];
  /** Index of the row to highlight (the one the question is about). */
  mark?: number;
  note?: string;
}

/**
 * A drawing on a fixed 400×260 canvas. Ink is `currentColor` so the figure
 * follows the card in light and dark; accents are fixed hues that read on
 * both. Build these with the helpers in `slideArt.ts`.
 */
export interface SlideArt {
  svg: string;
  alt: string;
  caption?: string;
}

export interface LessonSlide {
  kind: 'objective' | 'concept' | 'example' | 'protip' | 'trap' | 'challenge' | 'summary';
  head: string; // big slide headline
  body: string; // ~3 short sentences; \n allowed for line breaks
  formula?: FormulaBlock;
  compare?: CompareBlock;
  steps?: StepsBlock;
  table?: TableBlock;
  art?: SlideArt;
}

export type SlideBank = Record<string, LessonSlide[]>; // key = `${domain}-${unit}`
