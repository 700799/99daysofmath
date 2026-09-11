// ── 5th-grade MAP Growth prep ──────────────────────────────────────────────
// NWEA's MAP Growth Math 2-5 test reports four instructional areas ("goal
// strands"), which at grade 5 line up with the Common Core domains. The 5.F
// course already teaches all four; this maps its units onto the strands so a
// student can practise, and be scored, in the vocabulary their score report
// actually uses.
//
// A caution that belongs in the code rather than only in the UI: the RIT
// figures below are a DIRECTIONAL estimate. NWEA's published norm tables are
// not reproduced here, secondary sources disagree by several points, and this
// practice test is not adaptive over a calibrated item bank the way the real
// one is. Treat the number as a progress tracker, never as a predicted score.

export type Map5Strand = 'OA' | 'NO' | 'MD' | 'GEO';

export interface Map5StrandInfo {
  key: Map5Strand;
  /** The name NWEA prints on the score report. */
  name: string;
  short: string;
  emoji: string;
  color: string;
  blurb: string;
  /** 5.F units that teach this strand. */
  units: number[];
  /** Roughly how much of the grade-5 test this strand accounts for. */
  weight: number;
}

export const MAP5_STRANDS: Map5StrandInfo[] = [
  {
    key: 'NO',
    name: 'Number and Operations',
    short: 'Number',
    emoji: '🔢',
    color: '#4E7BA6',
    blurb:
      'Place value, multi-digit multiplication and division, powers of ten, decimals, and fractions — the biggest strand on the grade-5 test by some distance.',
    units: [1, 2, 3, 4, 7, 8, 9, 10, 11, 12],
    weight: 0.45,
  },
  {
    key: 'OA',
    name: 'Operations and Algebraic Thinking',
    short: 'Operations',
    emoji: '🧮',
    color: '#7D6BA8',
    blurb:
      'Writing and evaluating numerical expressions, order of operations with brackets, and generating and comparing number patterns.',
    units: [13, 14],
    weight: 0.15,
  },
  {
    key: 'MD',
    name: 'Measurement and Data',
    short: 'Measurement',
    emoji: '📏',
    color: '#5F8C5A',
    blurb:
      'Volume of rectangular prisms and composite solids, converting units inside one system, and reading line plots with fractional marks.',
    units: [5, 15],
    weight: 0.22,
  },
  {
    key: 'GEO',
    name: 'Geometry',
    short: 'Geometry',
    emoji: '📐',
    color: '#B07C4F',
    blurb:
      'Plotting and reading points in the first quadrant, and classifying triangles and quadrilaterals by their properties.',
    units: [6, 16],
    weight: 0.18,
  },
];

export const MAP5_UNIT_COUNT = 16;

/** Which strand a 5.F unit belongs to. */
export function strandOfUnit(unit: number): Map5StrandInfo | null {
  return MAP5_STRANDS.find((s) => s.units.includes(unit)) ?? null;
}

export function getStrand(key: Map5Strand): Map5StrandInfo {
  return MAP5_STRANDS.find((s) => s.key === key)!;
}

// ── Score estimate ─────────────────────────────────────────────────────────
// Grade-5 math sits around RIT 205 in the autumn and climbs roughly ten points
// across the year. The band below is deliberately wide and the label is the
// part meant to be read; see the caution at the top of this file.

export const MAP5_RIT_MIN = 180;
export const MAP5_RIT_MAX = 235;
/** Roughly the middle of the grade-5 year, used as the estimate's centre. */
export const MAP5_RIT_TYPICAL = 210;

/**
 * A directional RIT-style estimate from accuracy and how hard the served set
 * was. Monotonic in both, clamped to a grade-5 band. NOT an official score.
 */
export function estimateMap5Rit(accuracy: number, avgDifficulty: number): number {
  const a = Math.max(0, Math.min(1, accuracy));
  const diffAdj = (avgDifficulty - 2) * 5;
  const rit = 190 + a * 32 + diffAdj;
  return Math.round(Math.max(MAP5_RIT_MIN, Math.min(MAP5_RIT_MAX, rit)));
}

export interface Map5Band {
  label: string;
  tone: 'ok' | 'accent' | 'warn' | 'bad';
  blurb: string;
}

/** A plain-language read on where an estimate sits for a 5th grader. */
export function map5Band(rit: number): Map5Band {
  if (rit >= 222)
    return {
      label: 'Stretching past grade level',
      tone: 'ok',
      blurb:
        'Comfortably above where a typical 5th grader lands. On a real adaptive test this is where the questions start pulling from 6th-grade material — so the next step is Algebra 1 readiness, not more grade-5 review.',
    };
  if (rit >= 210)
    return {
      label: 'On track, upper half',
      tone: 'ok',
      blurb:
        'At or above a typical spring score for 5th grade. Keep the weakest strand below from slipping and this holds through the spring test.',
    };
  if (rit >= 198)
    return {
      label: 'On track',
      tone: 'accent',
      blurb:
        'Right around where a typical 5th grader sits during the year. The fastest gains now come from your weakest strand, not from more of what you already know.',
    };
  if (rit >= 188)
    return {
      label: 'Building',
      tone: 'warn',
      blurb:
        'The foundations are coming together. Work one strand at a time — Number and Operations first, since it is the largest part of the test.',
    };
  return {
    label: 'Getting started',
    tone: 'bad',
    blurb:
      'Start with Number and Operations: place value, multi-digit multiplication, and fractions carry more of this test than everything else combined.',
  };
}

// ── Strategy for an adaptive test ──────────────────────────────────────────
// MAP Growth is computer-adaptive and untimed, which changes how to take it.

export interface Map5Tip {
  emoji: string;
  title: string;
  body: string;
}

export const MAP5_TIPS: Map5Tip[] = [
  {
    emoji: '🎚️',
    title: 'Hard questions mean you are doing well',
    body:
      'The test picks the next question based on how you are doing. Get one right and the next is harder; miss one and it eases off. So a run of tough questions is good news, not a sign you are failing. Nobody gets them all right — the test is built so that you land around half right by the end.',
  },
  {
    emoji: '⏳',
    title: 'It is not timed, so stop rushing',
    body:
      'There is no clock. The single most common way to lose points is hurrying on a question you could have got. Read it twice, work it out on scratch paper, and only then answer.',
  },
  {
    emoji: '🔙',
    title: 'You cannot go back — so check before you click',
    body:
      'Once you answer, that question is gone. Build the habit of one last look: does the answer match what the question actually asked, and does the size of it make sense?',
  },
  {
    emoji: '📏',
    title: 'Estimate first, compute second',
    body:
      'Before working it out, decide roughly what the answer should be. If you estimate "about 40" and get 400, you caught a place-value slip before it cost you.',
  },
  {
    emoji: '✂️',
    title: 'Cross out what cannot be right',
    body:
      'On a multiple-choice question you do not always have to solve it. Rule out answers that are the wrong size, the wrong sign, or the wrong units, and a guess between the last two is worth far more than a blank.',
  },
  {
    emoji: '📝',
    title: 'Use scratch paper for every multi-step question',
    body:
      'Holding two steps in your head is where careless mistakes live. Write down the first result, then use it. This matters most on fraction and decimal problems.',
  },
  {
    emoji: '🧩',
    title: 'Answer everything',
    body:
      'There is no penalty for a wrong answer, and the test will not move on until you pick something. An informed guess is always better than freezing.',
  },
  {
    emoji: '🔁',
    title: 'Re-read the question after you solve it',
    body:
      'Questions often ask for something one step past the obvious — the change rather than the total, the perimeter rather than the area. Re-reading the last sentence catches it.',
  },
];

export const MAP5_TEST_SIZE = 25;
