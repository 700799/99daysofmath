// The story-style slide format for lessons. Every lesson carries 12–20 of
// these: 1 objective · 3–5 concept · 5–7 examples (simplest → fuller) ·
// 1–2 pro tips · 1–2 traps · 1 summary. ~3 short sentences per slide, written
// to be read by a 10–12-year-old. Slides advance on button press only; each
// kind has a minimum read time before Next unlocks (see LessonCard).
export interface LessonSlide {
  kind: 'objective' | 'concept' | 'example' | 'protip' | 'trap' | 'summary';
  head: string; // big slide headline
  body: string; // ~3 short sentences; \n allowed for line breaks
}

export type SlideBank = Record<string, LessonSlide[]>; // key = `${domain}-${unit}`
