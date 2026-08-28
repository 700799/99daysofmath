import { SAT_AREAS, type SatArea } from '../data/sat/blueprint';

// ── Raw → scaled conversion for the SAT Math section ───────────────────────
// The College Board does not publish a single fixed table; each administration
// is equated separately, and the adaptive second module means two students with
// the same raw score can receive different scaled scores. What follows is a
// representative curve built from released practice-test conversion tables: it
// is accurate enough to be useful for pacing and goal-setting, and it is
// labelled as an estimate everywhere it is shown.
//
// Index = raw correct out of 44. Values are the 200-800 section score.
const SCALE: number[] = [
  200, 200, 200, 210, 230, 250, 270, 290, 310, 330, // 0-9
  350, 370, 390, 400, 420, 430, 450, 460, 470, 490, // 10-19
  500, 510, 520, 530, 540, 550, 570, 580, 590, 600, // 20-29
  610, 620, 630, 650, 660, 670, 690, 700, 720, 730, // 30-39
  750, 770, 780, 800,                               // 40-43
];
const MAX_SCALED = 800;

export const SAT_MATH_QUESTIONS = 44;

/**
 * Convert a raw count of correct answers to an estimated 200-800 Math score.
 * Handles short tests (a single module, say) by scaling the raw count up to
 * the 44-question basis first, so a 22-question module still reports a
 * meaningful estimate.
 */
export function scaledScore(correct: number, total: number = SAT_MATH_QUESTIONS): number {
  if (total <= 0) return 200;
  const onFullBasis = Math.round((correct / total) * SAT_MATH_QUESTIONS);
  const idx = Math.max(0, Math.min(SAT_MATH_QUESTIONS, onFullBasis));
  return idx >= SCALE.length ? MAX_SCALED : SCALE[idx];
}

export interface ScoreBand {
  label: string;
  blurb: string;
  tone: 'ok' | 'accent' | 'warn' | 'bad';
}

/** A plain-language read on where a scaled score sits. */
export function scoreBand(scaled: number): ScoreBand {
  if (scaled >= 750)
    return {
      label: 'Elite',
      tone: 'ok',
      blurb:
        'Top-1% territory. At this level the remaining points are almost always careless errors, not knowledge gaps — slow down on the last five questions of each module.',
    };
  if (scaled >= 700)
    return {
      label: 'Highly competitive',
      tone: 'ok',
      blurb:
        'Strong enough for most selective programs. Push higher by hunting your two weakest units rather than doing more mixed practice.',
    };
  if (scaled >= 600)
    return {
      label: 'Solid',
      tone: 'accent',
      blurb:
        'You have the core content. The next 100 points usually come from timing and from Advanced Math — the area that separates 600 from 700.',
    };
  if (scaled >= 500)
    return {
      label: 'Developing',
      tone: 'warn',
      blurb:
        'Around the national average. Focus on Algebra first: it is 35% of the test and the most learnable area on it.',
    };
  if (scaled >= 400)
    return {
      label: 'Building',
      tone: 'warn',
      blurb:
        'Work the unit playbooks in order rather than taking more full tests. Volume of practice matters less than closing one unit at a time.',
    };
  return {
    label: 'Getting started',
    tone: 'bad',
    blurb:
      'Start with Units 1-5. Linear equations and functions alone are worth about a third of the whole section.',
  };
}

export interface AreaBreakdown {
  area: SatArea;
  correct: number;
  total: number;
  pct: number;
}

/** Per-blueprint-area accuracy, used by the score report and the hub. */
export function breakdownByArea(
  questions: { area: SatArea }[],
  isCorrect: (i: number) => boolean,
): AreaBreakdown[] {
  const acc = new Map<SatArea, { correct: number; total: number }>();
  for (const a of SAT_AREAS) acc.set(a, { correct: 0, total: 0 });
  questions.forEach((q, i) => {
    const bucket = acc.get(q.area);
    if (!bucket) return;
    bucket.total += 1;
    if (isCorrect(i)) bucket.correct += 1;
  });
  return SAT_AREAS.map((area) => {
    const b = acc.get(area)!;
    return { area, correct: b.correct, total: b.total, pct: b.total ? b.correct / b.total : 0 };
  });
}

/** Formats seconds as m:ss, used by every timer surface in the section. */
export function mmss(total: number): string {
  const t = Math.max(0, Math.floor(total));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}
