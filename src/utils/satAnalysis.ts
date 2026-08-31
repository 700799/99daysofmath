import { SAT_AREA_INFO, SAT_UNITS, type SatArea } from '../data/sat/blueprint';
import type { SatTestQuestion } from '../data/sat/tests/types';
import { TIPS_BY_CATEGORY, type SatTip, type TipCategory } from '../data/sat/tips';
import type { Problem } from '../types/problem';
import { scaledScore } from './satScore';

// ── Post-test diagnosis ────────────────────────────────────────────────────
// Everything a mock-test result can teach beyond the score: which units bled
// the points, what *kind* of misses they were (blanks, careless slips, entry
// mistakes, a wall at difficulty 3), and — from that — a recovery plan and a
// practice set built for this specific student. All pure functions over the
// stored answers, so an old result can be re-analyzed any time.

/** Numeric answers accept fractions, decimals, and stray formatting. */
export function numericMatches(input: string, q: SatTestQuestion): boolean {
  const clean = (s: string) => s.trim().toLowerCase().replace(/[$,%\s]/g, '');
  const u = clean(input);
  if (!u) return false;
  const candidates = [q.answer, ...(q.alternativeAnswers ?? [])];
  if (candidates.some((c) => clean(c) === u)) return true;

  const value = (s: string): number | null => {
    const t = clean(s);
    const frac = t.match(/^(-?\d+)\/(\d+)$/);
    if (frac) {
      const d = Number(frac[2]);
      return d === 0 ? null : Number(frac[1]) / d;
    }
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
    const n = Number(t);
    return Number.isNaN(n) ? null : n;
  };
  const uv = value(input);
  if (uv === null) return false;
  const tol = q.tolerance ?? 1e-9;
  return candidates.some((c) => {
    const cv = value(c);
    return cv !== null && Math.abs(cv - uv) <= tol;
  });
}

export function isCorrect(q: SatTestQuestion, given: string | undefined): boolean {
  if (!given) return false;
  if (q.answerType === 'multiple-choice') return given.trim().toUpperCase() === q.answer.toUpperCase();
  return numericMatches(given, q);
}

export interface UnitDiagnosis {
  unit: number;
  area: SatArea;
  title: string;
  total: number;
  correct: number;
  /** Wrong or blank, in question order. */
  missed: SatTestQuestion[];
  blank: number;
  /** Difficulty 1-2 misses — a fundamentals gap, not a stretch problem. */
  easyMisses: number;
  hardMisses: number;
  /** Expected questions from this unit on a real 44-question section. */
  perTest: number;
  /** perTest × miss rate — how many real-test points ride on fixing this. */
  pointsOnTable: number;
}

export type SignalKind = 'blanks' | 'late-module' | 'careless' | 'numeric-entry' | 'hard-wall' | 'clean';

export interface Signal {
  kind: SignalKind;
  emoji: string;
  title: string;
  /** Personalized with this student's counts and question numbers. */
  detail: string;
  /** Tip categories that treat this pattern, best first. */
  tipCategories: TipCategory[];
}

export interface TestDiagnosis {
  correct: number;
  total: number;
  scaled: number;
  units: UnitDiagnosis[];
  /** Units with at least one miss, ranked by points-on-the-table. */
  weak: UnitDiagnosis[];
  /** Units answered perfectly on 2+ questions — banked, not to re-study. */
  strong: UnitDiagnosis[];
  signals: Signal[];
  /** Tips chosen for this result's signals and weak areas. */
  tips: SatTip[];
}

const AREA_TIP_CATEGORY: Record<SatArea, TipCategory> = {
  ALG: 'algebra',
  ADV: 'advanced',
  PSDA: 'data',
  GEO: 'geometry',
};

function qRef(q: SatTestQuestion): string {
  return `M${q.module} Q${q.n}`;
}

function listRefs(qs: SatTestQuestion[], max = 4): string {
  const refs = qs.slice(0, max).map(qRef);
  const extra = qs.length - refs.length;
  return refs.join(', ') + (extra > 0 ? ` and ${extra} more` : '');
}

function detectSignals(questions: SatTestQuestion[], answers: Record<string, string>): Signal[] {
  const missed = questions.filter((q) => !isCorrect(q, answers[q.id]));
  const blanks = questions.filter((q) => !answers[q.id]?.trim());
  const answeredWrong = missed.filter((q) => !!answers[q.id]?.trim());
  const signals: Signal[] = [];

  if (blanks.length >= 2) {
    signals.push({
      kind: 'blanks',
      emoji: '⏳',
      title: `${blanks.length} questions left blank`,
      detail:
        `You left ${listRefs(blanks)} unanswered. There is no wrong-answer penalty, so every blank is a free point refused — ` +
        `a blank guess scores 25% on multiple choice, a blank scores 0%. If time ran out, the fix is pacing, not knowledge: ` +
        `bank the first fifteen questions of each module faster and never spend three minutes on one question.`,
      tipCategories: ['timing'],
    });
  }

  // Misses concentrated in each module's last five questions read as a pacing
  // or fatigue problem even when nothing was left blank.
  const late = missed.filter((q) => q.n >= 18);
  const early = missed.filter((q) => q.n < 18);
  const lateRate = late.length / (5 * 2);
  const earlyRate = early.length / (17 * 2);
  if (late.length >= 3 && lateRate >= 2 * Math.max(earlyRate, 0.05)) {
    signals.push({
      kind: 'late-module',
      emoji: '🏃',
      title: 'The end of each module is where your points went',
      detail:
        `${late.length} of your ${missed.length} misses came in the last five questions of a module (${listRefs(late)}). ` +
        `The hardest questions do sit there — but a miss rate this lopsided usually means you arrived at them rushed or drained. ` +
        `Practice a hard checkpoint: reach question 15 with at least 12 minutes on the clock.`,
      tipCategories: ['timing', 'technique'],
    });
  }

  const careless = answeredWrong.filter((q) => q.difficulty === 1);
  if (careless.length >= 2) {
    signals.push({
      kind: 'careless',
      emoji: '🎯',
      title: `${careless.length} easy questions answered wrong`,
      detail:
        `${listRefs(careless)} were difficulty-1 questions — material you almost certainly know — answered and missed. ` +
        `These are the cheapest points on the whole test to win back: they fall to a re-read of the final sentence ` +
        `("what is x + 2", not x) and a five-second check of the answer against the question.`,
      tipCategories: ['errors'],
    });
  }

  const entryMisses = answeredWrong.filter((q) => q.answerType === 'numeric');
  if (entryMisses.length >= 2) {
    signals.push({
      kind: 'numeric-entry',
      emoji: '⌨️',
      title: `${entryMisses.length} typed-answer questions missed`,
      detail:
        `On ${listRefs(entryMisses)} you typed an answer that did not match. Some of these are math; on the real test, some are ` +
        `formatting — units typed in, a rounded decimal where the exact fraction was wanted, the wrong sign surviving to the box. ` +
        `Student-produced responses have entry rules worth knowing cold.`,
      tipCategories: ['entry', 'errors'],
    });
  }

  const hardMisses = missed.filter((q) => q.difficulty === 3);
  if (missed.length >= 3 && hardMisses.length / missed.length >= 0.7) {
    signals.push({
      kind: 'hard-wall',
      emoji: '🧗',
      title: 'Your misses are almost all difficulty-3',
      detail:
        `${hardMisses.length} of your ${missed.length} misses were the hardest tier — the fundamentals are holding. ` +
        `At this stage, more content review pays less than technique: backsolving from the answer choices, plugging in ` +
        `concrete numbers, and letting Desmos graph anything with an equals sign.`,
      tipCategories: ['technique', 'desmos'],
    });
  }

  if (missed.length <= 2) {
    signals.push({
      kind: 'clean',
      emoji: '🏆',
      title: missed.length === 0 ? 'A perfect section' : 'Nearly a perfect section',
      detail:
        missed.length === 0
          ? 'Nothing to recover — the work now is keeping speed and accuracy under real-test pressure. Retake under stricter timing, or move to the next mock.'
          : `Only ${listRefs(missed)} got away. At this accuracy the enemy is variance, not knowledge: slow down on your last check of each answer and this becomes an 800-pace section.`,
      tipCategories: missed.length === 0 ? ['testday'] : ['errors', 'timing'],
    });
  }

  return signals;
}

/** Tips chosen for this student: signal categories first, then weak areas. */
function selectTips(signals: Signal[], weak: UnitDiagnosis[], cap = 8): SatTip[] {
  const categories: TipCategory[] = [];
  for (const s of signals) for (const c of s.tipCategories) if (!categories.includes(c)) categories.push(c);
  for (const u of weak.slice(0, 3)) {
    const c = AREA_TIP_CATEGORY[u.area];
    if (!categories.includes(c)) categories.push(c);
  }
  const picked: SatTip[] = [];
  const seen = new Set<string>();
  for (const c of categories) {
    for (const t of (TIPS_BY_CATEGORY[c] ?? []).slice(0, 2)) {
      if (seen.has(t.id)) continue;
      seen.add(t.id);
      picked.push(t);
      if (picked.length >= cap) return picked;
    }
  }
  return picked;
}

export function diagnoseTest(
  questions: SatTestQuestion[],
  answers: Record<string, string>,
): TestDiagnosis {
  const byUnit = new Map<number, SatTestQuestion[]>();
  for (const q of questions) {
    const list = byUnit.get(q.unit) ?? [];
    list.push(q);
    byUnit.set(q.unit, list);
  }

  const units: UnitDiagnosis[] = [];
  for (const info of SAT_UNITS) {
    const qs = byUnit.get(info.unit);
    if (!qs || qs.length === 0) continue;
    const missed = qs.filter((q) => !isCorrect(q, answers[q.id]));
    const area = SAT_AREA_INFO[info.area];
    const perTest = area.perTest / area.units.length;
    const missRate = missed.length / qs.length;
    units.push({
      unit: info.unit,
      area: info.area,
      title: info.title,
      total: qs.length,
      correct: qs.length - missed.length,
      missed,
      blank: qs.filter((q) => !answers[q.id]?.trim()).length,
      easyMisses: missed.filter((q) => q.difficulty <= 2).length,
      hardMisses: missed.filter((q) => q.difficulty === 3).length,
      perTest,
      pointsOnTable: missRate * perTest,
    });
  }

  const weak = units
    .filter((u) => u.missed.length > 0)
    .sort((a, b) => b.pointsOnTable - a.pointsOnTable || b.missed.length - a.missed.length || a.unit - b.unit);
  const strong = units.filter((u) => u.missed.length === 0 && u.total >= 2);
  const signals = detectSignals(questions, answers);
  const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length;

  return {
    correct,
    total: questions.length,
    scaled: scaledScore(correct, questions.length),
    units,
    weak,
    strong,
    signals,
    tips: selectTips(signals, weak),
  };
}

// ── The customized practice set ────────────────────────────────────────────
// Ten problems from the SAT drill bank, drawn from the units this result bled
// points in — more problems from the units that bled more — at a difficulty
// matched to what was missed there. Deterministic for a given result, so the
// set does not reshuffle on every visit.

export interface RecoveryPick {
  problem: Problem;
  /** Why this problem is in the set, in the student's own numbers. */
  reason: string;
}

export function selectRecoveryProblems(
  diag: TestDiagnosis,
  pool: Problem[],
  take = 10,
): RecoveryPick[] {
  const satPool = pool.filter((p) => p.domain === 'SAT');

  // A clean test gets a stretch set instead: hardest problems, spread wide.
  if (diag.weak.length === 0) {
    const hard = satPool
      .filter((p) => p.difficulty === 3)
      .sort((a, b) => a.unit - b.unit || a.orderInUnit - b.orderInUnit);
    const spread: RecoveryPick[] = [];
    const usedUnits = new Set<number>();
    for (const p of hard) {
      if (usedUnits.has(p.unit)) continue;
      usedUnits.add(p.unit);
      spread.push({ problem: p, reason: 'A stretch problem — you missed nothing, so the set pushes instead of repairs.' });
      if (spread.length >= take) break;
    }
    return spread;
  }

  // Quotas proportional to misses, every weak unit guaranteed at least one
  // slot while slots remain, extras to the biggest bleeders first.
  const totalMisses = diag.weak.reduce((s, u) => s + u.missed.length, 0);
  const quotas = diag.weak.map((u) => ({
    u,
    quota: Math.floor((take * u.missed.length) / totalMisses),
  }));
  for (const q of quotas) if (q.quota === 0) q.quota = 1;
  let assigned = quotas.reduce((s, q) => s + q.quota, 0);
  let i = 0;
  while (assigned < take && quotas.length > 0) {
    quotas[i % quotas.length].quota += 1;
    assigned += 1;
    i += 1;
  }
  while (assigned > take) {
    // Trim from the tail — the least-bleeding units — never below one.
    const tail = [...quotas].reverse().find((q) => q.quota > 1) ?? quotas[quotas.length - 1];
    tail.quota -= 1;
    assigned -= 1;
    if (quotas.every((q) => q.quota <= 1) && assigned > take) {
      quotas.pop();
      assigned -= 0; // popped quota was 1; recompute below
      assigned = quotas.reduce((s, q) => s + q.quota, 0);
    }
  }

  const picks: RecoveryPick[] = [];
  for (const { u, quota } of quotas) {
    const candidates = satPool.filter((p) => p.unit === u.unit);
    // Fundamentals gap → rebuild from the easy end. Only hard misses → drill
    // the medium-hard end, skipping warmups the student clearly owns.
    const rebuilding = u.easyMisses > 0;
    const ordered = [...candidates].sort((a, b) =>
      rebuilding
        ? a.difficulty - b.difficulty || a.orderInUnit - b.orderInUnit
        : b.difficulty - a.difficulty || a.orderInUnit - b.orderInUnit,
    );
    const misses = u.missed.length;
    const reason = rebuilding
      ? `You missed ${misses} of ${u.total} here, including easier ones — this rebuilds the unit from the ground up.`
      : `You missed ${misses} ${misses === 1 ? 'question' : 'questions'} here, all at the hard end — these push right at that ceiling.`;
    for (const p of ordered.slice(0, quota)) picks.push({ problem: p, reason });
  }
  return picks.slice(0, take);
}

// ── The recovery plan ──────────────────────────────────────────────────────

export interface PlanStep {
  emoji: string;
  title: string;
  detail: string;
  /** Route to the surface where this step happens. */
  to?: string;
  cta?: string;
}

export function buildPlan(diag: TestDiagnosis, testN: number): PlanStep[] {
  const steps: PlanStep[] = [];
  const [first, second] = diag.weak;

  steps.push({
    emoji: '🩹',
    title: 'Today — the custom practice set',
    detail:
      diag.weak.length > 0
        ? `Ten problems drawn from your ${diag.weak.length === 1 ? 'weak unit' : `${Math.min(diag.weak.length, 10)} weak units`}, weighted toward where you bled most, with full hints and explanations. Do it while the test is fresh.`
        : 'You missed nothing, so the set is ten stretch problems — one from each of the hardest units.',
    to: `/sat/recovery/${testN}`,
    cta: 'Start the set',
  });

  if (first) {
    steps.push({
      emoji: '📘',
      title: `This week — close Unit ${first.unit}: ${first.title}`,
      detail: `Your biggest leak (${first.correct}/${first.total} on this test). Read the playbook's methods and traps, then drill it until you hold three stars. That alone protects about ${first.perTest.toFixed(1)} questions on a real section.`,
      to: `/sat/unit/${first.unit}`,
      cta: 'Open the playbook',
    });
  }
  if (second) {
    steps.push({
      emoji: '📗',
      title: `Then — Unit ${second.unit}: ${second.title}`,
      detail: `Your second leak (${second.correct}/${second.total}). Same loop: playbook, traps, drill to three stars.`,
      to: `/sat/unit/${second.unit}`,
      cta: 'Open the playbook',
    });
  }

  const cats = diag.signals.filter((s) => s.kind !== 'clean');
  if (cats.length > 0) {
    steps.push({
      emoji: '🧠',
      title: 'In spare minutes — the tips picked for you below',
      detail:
        'They were chosen from your miss patterns on this test, not the generic list. Read them before your next timed practice, not after.',
    });
  }

  const nextTest = testN < 5 ? testN + 1 : null;
  steps.push({
    emoji: '🔁',
    title: nextTest ? `In 4-7 days — Mock Test ${nextTest}` : 'In 4-7 days — retake a mock',
    detail:
      'Re-test only after the drills, so the next score measures the fix. Compare the per-unit breakdown, not just the number: the units you worked should stop leaking.',
    to: nextTest ? `/sat/test/${nextTest}` : `/sat/test/${testN}`,
    cta: nextTest ? `Mock Test ${nextTest}` : 'Retake this test',
  });

  return steps;
}
