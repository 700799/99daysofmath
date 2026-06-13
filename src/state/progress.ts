import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DOMAINS, type Domain } from '../types/problem';
import { flashXp } from './xpFlash';
import { checkAllEarning, STICKER_DEFS, UNIT_COUNT_BY_DOMAIN, type EarningContext } from '../utils/encouragement';
import { scheduleAfter } from '../utils/srs';

export type Stars = 0 | 1 | 2 | 3;

// Returned by recordUnitResult: newly earned sticker ids plus the XP bonuses
// (later units pay more; finishing a whole trail / all trails pays extra).
export interface UnitResultOutcome {
  earned: string[];
  unitBonus: number;
  trailBonus: number;
  allTrailsBonus: number;
}

// Arcade rewards: full XP for the first play of each game per day, half for
// repeats, plus one-time-per-day variety bonuses for playing many DIFFERENT
// games (+10 at 3 distinct, +20 at 5).
export interface ArcadePlayOutcome {
  xpAwarded: number;      // base (possibly halved) XP actually granted
  varietyBonus: number;   // extra XP from the variety thresholds, if just crossed
  repeatToday: boolean;   // true when this game was already played today
  distinctToday: number;  // how many different games played today (incl. this one)
  earned: string[];       // newly earned sticker ids
}

export interface FinalOutcome {
  bonus: number;          // XP granted: 40 + 2 × correct
  earned: string[];
  best: number;           // best score recorded for this quiz
}

interface DomainProgress {
  unitsUnlocked: number;
  unitStars: Record<number, Stars>;
  missedProblemIds: string[];
}

// Per-problem mastery record powering adaptive practice, the skill report,
// and spaced-repetition review.
export interface ProblemStat {
  attempts: number;
  correct: number;
  lastResult: 'correct' | 'wrong';
  lastSeen: string;        // ISO date
  box: number;             // Leitner SRS box, 0..5 (scheduled only once missed)
  due: string | null;      // ISO date the next review is due (null = not scheduled / graduated)
}

export interface RitPoint {
  date: string;
  rit: number;
  accuracy: number;
}

interface ProgressState {
  byDomain: Record<Domain, DomainProgress>;
  xp: number;
  streak: number;       // consecutive-correct streak within current session
  bestStreak: number;
  bestSessionStreak: number;
  dailyStreak: number;  // calendar-day streak
  bestDailyStreak: number;
  lastPracticeDate: string | null; // YYYY-MM-DD
  stickers: string[];   // sticker IDs (stable keys from STICKER_DEFS)
  totalPerfectUnits: number;
  soundEnabled: boolean;
  // ---- v5 additions ----
  mockTestsCompleted: number;
  bestMockAccuracy: number;          // 0-1
  dailyXp: number;                   // XP earned during dailyXpResetDate
  dailyGoal: number;                 // target XP per day
  dailyXpResetDate: string | null;   // date dailyXp corresponds to
  dailyQuestStreak: number;          // consecutive days the goal was met
  lastGoalDate: string | null;       // last day the goal was hit
  practiceDates: string[];           // ISO dates with any practice
  xpByDate: Record<string, number>;  // XP earned per ISO date (heatmap intensity)
  lastFreezeDate: string | null;     // last day a streak freeze was used
  onboardingComplete: boolean;
  // ---- v6 additions ----
  problemStats: Record<string, ProblemStat>; // keyed by problem id
  ritHistory: RitPoint[];                     // appended per mock test
  lessonsViewed: string[];                    // e.g. "6.RP-1" unit lesson keys
  // ---- v7 additions ----
  trailBonusGranted: Partial<Record<Domain, boolean>>; // one-time +50 per finished trail
  allTrailsBonusGranted: boolean;                      // one-time +250 for finishing everything
  // ---- v8 additions (arcade + finals) ----
  arcadeDaily: { date: string | null; played: string[]; varietyAwarded: number[] };
  arcadeTotals: Record<string, number>; // lifetime plays per game id
  lastWheelSpinDate: string | null;     // prize wheel is once per day
  c4Wins: number;
  finalsResults: Record<number, { best: number; completedAt: string }>;
  // ---- v9 additions (daily cap + math-unlock) ----
  arcadeBudget: {
    date: string | null;
    secondsPlayed: number;
    lockedAt: string | null;
    mathSecondsTowardUnlock: number;
  };
  // ---- actions ----
  recordUnitResult: (
    domain: Domain,
    unit: number,
    stars: Stars,
    missedIds: string[],
    xpEarned: number,
    mistakesTotal: number,
  ) => UnitResultOutcome;
  awardXP: (n: number) => string[];
  recordMockTestResult: (accuracy: number, rit?: number) => string[];
  recordAttempt: (problemId: string, correct: boolean) => void;
  clearMissed: (domain: Domain, problemId: string) => void;
  markLessonViewed: (key: string) => void;
  recordArcadePlay: (
    gameId: string,
    baseXp: number,
    opts?: { c4Win?: boolean; wheelSpin?: boolean },
  ) => ArcadePlayOutcome;
  recordFinalResult: (quizN: number, correct: number, total: number) => FinalOutcome;
  tickArcadeSeconds: (n: number) => void;
  tickMathSeconds: (n: number) => void;
  isArcadeLocked: () => boolean;
  arcadeRemainingSeconds: () => number;
  mathRemainingSeconds: () => number;
  platformerMaxLevel: number;
  setPlatformerMaxLevel: (n: number) => void;
  completeLesson: (key: string) => string[];
  setDailyGoal: (n: number) => void;
  markOnboardingDone: () => void;
  incrementStreak: () => string[];
  resetStreak: () => void;
  touchDay: () => string[];
  toggleSound: () => void;
  isUnitUnlocked: (domain: Domain, unit: number) => boolean;
  starsForUnit: (domain: Domain, unit: number) => Stars;
  totalStars: () => number;
  todaysXp: () => number;
  dueReviewCount: () => number;
  resetAll: () => void;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86400000);
}

const blankDomain = (): DomainProgress => ({
  unitsUnlocked: 1,
  unitStars: {},
  missedProblemIds: [],
});

const blankAll = (): Record<Domain, DomainProgress> =>
  DOMAINS.reduce(
    (acc, d) => {
      acc[d] = blankDomain();
      return acc;
    },
    {} as Record<Domain, DomainProgress>,
  );

function unitsCompletedByDomain(
  byDomain: Record<Domain, DomainProgress>,
): Record<Domain, number> {
  const out = {} as Record<Domain, number>;
  for (const d of DOMAINS) {
    let n = 0;
    const stars = byDomain[d]?.unitStars ?? {};
    for (const s of Object.values(stars)) {
      if ((s as number) >= 2) n++;
    }
    out[d] = n;
  }
  return out;
}

// Build the standard earning context from a state snapshot, with overrides.
function earningCtx(s: ProgressState, o: Partial<EarningContext> = {}): EarningContext {
  return {
    xp: s.xp,
    dailyStreak: s.dailyStreak,
    bestSessionStreak: s.bestSessionStreak,
    totalPerfectUnits: s.totalPerfectUnits,
    byDomainUnitsCompleted: unitsCompletedByDomain(s.byDomain),
    alreadyEarned: new Set(s.stickers),
    mockTestsCompleted: s.mockTestsCompleted,
    dailyQuestStreak: s.dailyQuestStreak,
    freezeUsedEver: s.lastFreezeDate != null,
    lessonsCompleted: s.lessonsViewed.length,
    ...o,
  };
}

interface DailyXpResult {
  dailyXp: number;
  dailyXpResetDate: string;
  dailyQuestStreak: number;
  lastGoalDate: string | null;
  xpByDate: Record<string, number>;
}

// Roll daily XP forward, handling day rollover and quest-streak bookkeeping.
function rollDailyXp(s: ProgressState, xpEarned: number, today: string): DailyXpResult {
  const isNewDay = s.dailyXpResetDate !== today;
  const prevDailyXp = isNewDay ? 0 : s.dailyXp;
  const newDailyXp = prevDailyXp + xpEarned;

  let questStreak = s.dailyQuestStreak;
  let lastGoalDate = s.lastGoalDate;
  const goalNewlyHit =
    prevDailyXp < s.dailyGoal &&
    newDailyXp >= s.dailyGoal &&
    s.lastGoalDate !== today;
  if (goalNewlyHit) {
    const consecutive = s.lastGoalDate
      ? daysBetween(s.lastGoalDate, today) === 1
      : false;
    questStreak = consecutive ? s.dailyQuestStreak + 1 : 1;
    lastGoalDate = today;
  }

  const xpByDate = {
    ...s.xpByDate,
    [today]: (s.xpByDate[today] ?? 0) + xpEarned,
  };

  return {
    dailyXp: newDailyXp,
    dailyXpResetDate: today,
    dailyQuestStreak: questStreak,
    lastGoalDate,
    xpByDate,
  };
}

function freezeAvailable(s: ProgressState, today: string): boolean {
  if (!s.lastFreezeDate) return true;
  return daysBetween(s.lastFreezeDate, today) >= 7;
}

const v5Defaults = {
  mockTestsCompleted: 0,
  bestMockAccuracy: 0,
  dailyXp: 0,
  dailyGoal: 30,
  dailyXpResetDate: null as string | null,
  dailyQuestStreak: 0,
  lastGoalDate: null as string | null,
  practiceDates: [] as string[],
  xpByDate: {} as Record<string, number>,
  lastFreezeDate: null as string | null,
  onboardingComplete: false,
};

const v6Defaults = {
  problemStats: {} as Record<string, ProblemStat>,
  ritHistory: [] as RitPoint[],
  lessonsViewed: [] as string[],
};

const v7Defaults = {
  trailBonusGranted: {} as Partial<Record<Domain, boolean>>,
  allTrailsBonusGranted: false,
};

const v8Defaults = {
  arcadeDaily: { date: null as string | null, played: [] as string[], varietyAwarded: [] as number[] },
  arcadeTotals: {} as Record<string, number>,
  lastWheelSpinDate: null as string | null,
  c4Wins: 0,
  finalsResults: {} as Record<number, { best: number; completedAt: string }>,
};

const v9Defaults = {
  arcadeBudget: {
    date: null as string | null,
    secondsPlayed: 0,
    lockedAt: null as string | null,
    mathSecondsTowardUnlock: 0,
  },
};

const v10Defaults = {
  platformerMaxLevel: 0, // furthest Math Platformer level the kid has reached
};

export const ARCADE_DAILY_CAP_SECONDS = 180;     // 3 minutes per day
export const MATH_UNLOCK_SECONDS = 900;          // 15 minutes of math unlocks again

export function migrateProgress(persisted: unknown, fromVersion: number): unknown {
  if (!persisted || typeof persisted !== 'object') return persisted;
  const state = persisted as Partial<ProgressState> & { stickers?: string[] };
  if (fromVersion < 4) {
    // Map old emoji-prefixed sticker strings to new IDs (best-effort).
    const oldStickers = state.stickers ?? [];
    const labelToId = new Map<string, string>();
    for (const def of STICKER_DEFS) {
      labelToId.set(`${def.emoji} ${def.label}`, def.id);
    }
    const migratedIds = new Set<string>();
    for (const s of oldStickers) {
      const id = labelToId.get(s);
      if (id) migratedIds.add(id);
    }
    state.stickers = Array.from(migratedIds);
    let perfect = 0;
    const byDomain = state.byDomain;
    if (byDomain) {
      for (const d of DOMAINS) {
        const stars = byDomain[d]?.unitStars ?? {};
        for (const v of Object.values(stars)) {
          if ((v as number) === 3) perfect++;
        }
      }
    }
    state.totalPerfectUnits = perfect;
    state.bestSessionStreak = state.bestStreak ?? 0;
  }
  if (fromVersion < 5) {
    // Seed all v5 fields with safe defaults if missing.
    for (const [k, v] of Object.entries(v5Defaults)) {
      if ((state as Record<string, unknown>)[k] === undefined) {
        (state as Record<string, unknown>)[k] = v;
      }
    }
  }
  if (fromVersion < 6) {
    const stateAny = state as Record<string, unknown>;
    for (const [k, v] of Object.entries(v6Defaults)) {
      if (stateAny[k] === undefined) stateAny[k] = v;
    }
    // Seed the SRS queue from any pre-existing missed problems so Smart
    // Review is useful immediately for returning users.
    const today = todayISO();
    const seeded = (stateAny.problemStats as Record<string, ProblemStat>) ?? {};
    const byDomain = state.byDomain;
    if (byDomain) {
      for (const d of DOMAINS) {
        for (const id of byDomain[d]?.missedProblemIds ?? []) {
          if (!seeded[id]) {
            seeded[id] = {
              attempts: 1,
              correct: 0,
              lastResult: 'wrong',
              lastSeen: today,
              box: 0,
              due: today,
            };
          }
        }
      }
    }
    stateAny.problemStats = seeded;
  }
  if (fromVersion < 7) {
    const stateAny = state as Record<string, unknown>;
    for (const [k, v] of Object.entries(v7Defaults)) {
      if (stateAny[k] === undefined) stateAny[k] = v;
    }
  }
  if (fromVersion < 8) {
    const stateAny = state as Record<string, unknown>;
    for (const [k, v] of Object.entries(v8Defaults)) {
      if (stateAny[k] === undefined) stateAny[k] = v;
    }
  }
  if (fromVersion < 9) {
    const stateAny = state as Record<string, unknown>;
    for (const [k, v] of Object.entries(v9Defaults)) {
      if (stateAny[k] === undefined) stateAny[k] = v;
    }
  }
  if (fromVersion < 10) {
    const stateAny = state as Record<string, unknown>;
    for (const [k, v] of Object.entries(v10Defaults)) {
      if (stateAny[k] === undefined) stateAny[k] = v;
    }
  }
  return state;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      byDomain: blankAll(),
      xp: 0,
      streak: 0,
      bestStreak: 0,
      bestSessionStreak: 0,
      dailyStreak: 0,
      bestDailyStreak: 0,
      lastPracticeDate: null,
      stickers: [],
      totalPerfectUnits: 0,
      soundEnabled: true,
      ...v5Defaults,
      ...v6Defaults,
      ...v7Defaults,
      ...v8Defaults,
      ...v9Defaults,
      ...v10Defaults,
      setPlatformerMaxLevel: (n) =>
        set((s) => ({ platformerMaxLevel: Math.max(s.platformerMaxLevel, n) })),
      recordUnitResult: (domain, unit, stars, missedIds, xpEarned, mistakesTotal) => {
        const stateBefore = get();
        const today = todayISO();
        const d = stateBefore.byDomain[domain] ?? blankDomain();
        const prevStars = d.unitStars[unit] ?? 0;
        const nextStars: Stars = Math.max(prevStars, stars) as Stars;
        const unlocked =
          stars >= 1 ? Math.max(d.unitsUnlocked, unit + 1) : d.unitsUnlocked;
        const missedSet = new Set([...d.missedProblemIds, ...missedIds]);
        const nextByDomain = {
          ...stateBefore.byDomain,
          [domain]: {
            unitsUnlocked: unlocked,
            unitStars: { ...d.unitStars, [unit]: nextStars },
            missedProblemIds: Array.from(missedSet),
          },
        };
        const newPerfect = prevStars < 3 && nextStars === 3;

        // Later units pay more: +2 XP per unit number on every completion.
        const unitBonus = 2 * unit;
        // Finishing a whole trail (every unit ≥1 star) pays +50, once per trail;
        // finishing every trail pays +250, once.
        const trailDone = (dom: Domain) => {
          const stars = nextByDomain[dom]?.unitStars ?? {};
          for (let u = 1; u <= UNIT_COUNT_BY_DOMAIN[dom]; u++) {
            if (((stars as Record<number, number>)[u] ?? 0) < 1) return false;
          }
          return true;
        };
        const trailBonus =
          trailDone(domain) && !stateBefore.trailBonusGranted[domain] ? 50 : 0;
        const allDone = DOMAINS.every((dom) => trailDone(dom));
        const allTrailsBonus =
          allDone && !stateBefore.allTrailsBonusGranted ? 250 : 0;
        const totalXpAdd = xpEarned + unitBonus + trailBonus + allTrailsBonus;
        if (totalXpAdd > 0) flashXp(totalXpAdd);

        const nextXp = stateBefore.xp + totalXpAdd;
        const nextTotalPerfect = stateBefore.totalPerfectUnits + (newPerfect ? 1 : 0);
        const daily = rollDailyXp(stateBefore, totalXpAdd, today);
        const earned = checkAllEarning(
          earningCtx(stateBefore, {
            xp: nextXp,
            totalPerfectUnits: nextTotalPerfect,
            byDomainUnitsCompleted: unitsCompletedByDomain(nextByDomain),
            dailyQuestStreak: daily.dailyQuestStreak,
          }),
          { domain, unit, stars, mistakesTotal },
        );
        set({
          byDomain: nextByDomain,
          xp: nextXp,
          totalPerfectUnits: nextTotalPerfect,
          dailyXp: daily.dailyXp,
          dailyXpResetDate: daily.dailyXpResetDate,
          dailyQuestStreak: daily.dailyQuestStreak,
          lastGoalDate: daily.lastGoalDate,
          xpByDate: daily.xpByDate,
          trailBonusGranted:
            trailBonus > 0
              ? { ...stateBefore.trailBonusGranted, [domain]: true }
              : stateBefore.trailBonusGranted,
          allTrailsBonusGranted:
            stateBefore.allTrailsBonusGranted || allTrailsBonus > 0,
          stickers:
            earned.length > 0
              ? [...stateBefore.stickers, ...earned]
              : stateBefore.stickers,
        });
        return { earned, unitBonus, trailBonus, allTrailsBonus };
      },
      awardXP: (n) => {
        if (n > 0) flashXp(n);
        const before = get();
        const today = todayISO();
        const nextXp = before.xp + n;
        const daily = rollDailyXp(before, n, today);
        const earned = checkAllEarning(
          earningCtx(before, {
            xp: nextXp,
            dailyQuestStreak: daily.dailyQuestStreak,
          }),
        );
        set({
          xp: nextXp,
          dailyXp: daily.dailyXp,
          dailyXpResetDate: daily.dailyXpResetDate,
          dailyQuestStreak: daily.dailyQuestStreak,
          lastGoalDate: daily.lastGoalDate,
          xpByDate: daily.xpByDate,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return earned;
      },
      recordMockTestResult: (accuracy, rit) => {
        const before = get();
        const mockTestsCompleted = before.mockTestsCompleted + 1;
        const bestMockAccuracy = Math.max(before.bestMockAccuracy, accuracy);
        const earned = checkAllEarning(earningCtx(before, { mockTestsCompleted }));
        const ritHistory =
          rit != null
            ? [...before.ritHistory, { date: todayISO(), rit, accuracy }]
            : before.ritHistory;
        set({
          mockTestsCompleted,
          bestMockAccuracy,
          ritHistory,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return earned;
      },
      recordAttempt: (problemId, correct) =>
        set((s) => {
          const today = todayISO();
          const prev = s.problemStats[problemId];
          const prevBox = prev?.box ?? 0;
          // Schedule SRS on every miss; on a correct answer only if the problem
          // is already in the queue (so first-try-correct problems don't flood it).
          let box = prevBox;
          let due = prev?.due ?? null;
          if (!correct) {
            ({ box, due } = scheduleAfter(prevBox, false, today));
          } else if (prev?.due != null) {
            ({ box, due } = scheduleAfter(prevBox, true, today));
          }
          const stat: ProblemStat = {
            attempts: (prev?.attempts ?? 0) + 1,
            correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
            lastResult: correct ? 'correct' : 'wrong',
            lastSeen: today,
            box,
            due,
          };
          return { problemStats: { ...s.problemStats, [problemId]: stat } };
        }),
      markLessonViewed: (key) =>
        set((s) =>
          s.lessonsViewed.includes(key)
            ? s
            : { lessonsViewed: [...s.lessonsViewed, key] },
        ),
      recordArcadePlay: (gameId, baseXp, opts = {}) => {
        const before = get();
        const today = todayISO();
        const daily =
          before.arcadeDaily.date === today
            ? before.arcadeDaily
            : { date: today, played: [] as string[], varietyAwarded: [] as number[] };

        const repeatToday = daily.played.includes(gameId);
        const xpAwarded =
          baseXp <= 0 ? 0 : repeatToday ? Math.max(1, Math.floor(baseXp / 2)) : baseXp;

        const played = repeatToday ? daily.played : [...daily.played, gameId];
        const distinctToday = played.length;

        // Variety bonuses: +10 at 3 distinct games, +20 at 5 — once per day each.
        let varietyBonus = 0;
        const varietyAwarded = [...daily.varietyAwarded];
        for (const [threshold, bonus] of [
          [3, 10],
          [5, 20],
        ] as const) {
          if (distinctToday >= threshold && !varietyAwarded.includes(threshold)) {
            varietyAwarded.push(threshold);
            varietyBonus += bonus;
          }
        }

        const c4Wins = before.c4Wins + (opts.c4Win ? 1 : 0);
        const lastWheelSpinDate = opts.wheelSpin ? today : before.lastWheelSpinDate;
        const totalAdd = xpAwarded + varietyBonus;
        if (totalAdd > 0) flashXp(totalAdd);
        const nextXp = before.xp + totalAdd;
        const dailyXpRoll = rollDailyXp(before, totalAdd, today);

        const earned = checkAllEarning(
          earningCtx(before, {
            xp: nextXp,
            dailyQuestStreak: dailyXpRoll.dailyQuestStreak,
            c4Wins,
            wheelSpunEver: lastWheelSpinDate != null,
            arcadeDistinctToday: distinctToday,
          }),
        );

        set({
          arcadeDaily: { date: today, played, varietyAwarded },
          arcadeTotals: {
            ...before.arcadeTotals,
            [gameId]: (before.arcadeTotals[gameId] ?? 0) + 1,
          },
          c4Wins,
          lastWheelSpinDate,
          xp: nextXp,
          dailyXp: dailyXpRoll.dailyXp,
          dailyXpResetDate: dailyXpRoll.dailyXpResetDate,
          dailyQuestStreak: dailyXpRoll.dailyQuestStreak,
          lastGoalDate: dailyXpRoll.lastGoalDate,
          xpByDate: dailyXpRoll.xpByDate,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return { xpAwarded, varietyBonus, repeatToday, distinctToday, earned };
      },
      recordFinalResult: (quizN, correct, total) => {
        const before = get();
        const today = todayISO();
        const bonus = 40 + 2 * correct;
        const prevBest = before.finalsResults[quizN]?.best ?? -1;
        const finalsResults = {
          ...before.finalsResults,
          [quizN]: {
            best: Math.max(prevBest, correct),
            completedAt: today,
          },
        };
        const finalsCompletedCount = Object.keys(finalsResults).length;
        const nextXp = before.xp + bonus;
        const daily = rollDailyXp(before, bonus, today);
        const earned = checkAllEarning(
          earningCtx(before, {
            xp: nextXp,
            dailyQuestStreak: daily.dailyQuestStreak,
            finalsCompletedCount,
          }),
        );
        set({
          finalsResults,
          xp: nextXp,
          dailyXp: daily.dailyXp,
          dailyXpResetDate: daily.dailyXpResetDate,
          dailyQuestStreak: daily.dailyQuestStreak,
          lastGoalDate: daily.lastGoalDate,
          xpByDate: daily.xpByDate,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        void total;
        return { bonus, earned, best: finalsResults[quizN].best };
      },
      completeLesson: (key) => {
        const before = get();
        if (before.lessonsViewed.includes(key)) return [];
        const today = todayISO();
        const LESSON_XP = 8;
        const lessonsViewed = [...before.lessonsViewed, key];
        const nextXp = before.xp + LESSON_XP;
        const daily = rollDailyXp(before, LESSON_XP, today);
        const earned = checkAllEarning(
          earningCtx(before, {
            xp: nextXp,
            dailyQuestStreak: daily.dailyQuestStreak,
            lessonsCompleted: lessonsViewed.length,
          }),
        );
        set({
          lessonsViewed,
          xp: nextXp,
          dailyXp: daily.dailyXp,
          dailyXpResetDate: daily.dailyXpResetDate,
          dailyQuestStreak: daily.dailyQuestStreak,
          lastGoalDate: daily.lastGoalDate,
          xpByDate: daily.xpByDate,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return earned;
      },
      clearMissed: (domain, problemId) =>
        set((s) => {
          const dp = s.byDomain[domain];
          if (!dp || !dp.missedProblemIds.includes(problemId)) return s;
          return {
            byDomain: {
              ...s.byDomain,
              [domain]: {
                ...dp,
                missedProblemIds: dp.missedProblemIds.filter((id) => id !== problemId),
              },
            },
          };
        }),
      setDailyGoal: (n) => set({ dailyGoal: n }),
      markOnboardingDone: () => set({ onboardingComplete: true }),
      incrementStreak: () => {
        const before = get();
        const next = before.streak + 1;
        const bestSession = Math.max(before.bestSessionStreak, next);
        const earned = checkAllEarning(
          earningCtx(before, { bestSessionStreak: bestSession }),
        );
        set({
          streak: next,
          bestStreak: Math.max(before.bestStreak, next),
          bestSessionStreak: bestSession,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return earned;
      },
      resetStreak: () => set({ streak: 0 }),
      touchDay: () => {
        const before = get();
        const today = todayISO();
        if (before.lastPracticeDate === today) return [];
        let nextStreak: number;
        let lastFreezeDate = before.lastFreezeDate;
        if (!before.lastPracticeDate) {
          nextStreak = 1;
        } else {
          const gap = daysBetween(before.lastPracticeDate, today);
          if (gap === 1) {
            nextStreak = before.dailyStreak + 1;
          } else if (gap === 2 && before.dailyStreak >= 3 && freezeAvailable(before, today)) {
            // A streak freeze covers a single missed day.
            nextStreak = before.dailyStreak + 1;
            lastFreezeDate = today;
          } else {
            nextStreak = 1;
          }
        }
        const practiceDates = before.practiceDates.includes(today)
          ? before.practiceDates
          : [...before.practiceDates, today];
        const earned = checkAllEarning(
          earningCtx(before, {
            dailyStreak: nextStreak,
            freezeUsedEver: lastFreezeDate != null,
          }),
        );
        set({
          lastPracticeDate: today,
          dailyStreak: nextStreak,
          bestDailyStreak: Math.max(before.bestDailyStreak, nextStreak),
          lastFreezeDate,
          practiceDates,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return earned;
      },
      tickArcadeSeconds: (n) => {
        if (n <= 0) return;
        const before = get();
        const today = todayISO();
        const stale = before.arcadeBudget.date !== today;
        const baseSeconds = stale ? 0 : before.arcadeBudget.secondsPlayed;
        const baseMath = stale ? 0 : before.arcadeBudget.mathSecondsTowardUnlock;
        const baseLockedAt = stale ? null : before.arcadeBudget.lockedAt;
        const nextSeconds = baseSeconds + n;
        const lockedAt =
          baseLockedAt ?? (nextSeconds >= ARCADE_DAILY_CAP_SECONDS ? new Date().toISOString() : null);
        set({
          arcadeBudget: {
            date: today,
            secondsPlayed: nextSeconds,
            lockedAt,
            mathSecondsTowardUnlock: baseMath,
          },
        });
      },
      tickMathSeconds: (n) => {
        if (n <= 0) return;
        const before = get();
        const today = todayISO();
        const stale = before.arcadeBudget.date !== today;
        // Stale day → leave the v9 block alone; new arcade play will create today's block.
        if (stale) return;
        if (!before.arcadeBudget.lockedAt) return; // only credit math while locked
        const nextMath = before.arcadeBudget.mathSecondsTowardUnlock + n;
        if (nextMath >= MATH_UNLOCK_SECONDS) {
          set({
            arcadeBudget: {
              date: today,
              secondsPlayed: 0,
              lockedAt: null,
              mathSecondsTowardUnlock: 0,
            },
          });
        } else {
          set({
            arcadeBudget: {
              ...before.arcadeBudget,
              date: today,
              mathSecondsTowardUnlock: nextMath,
            },
          });
        }
      },
      isArcadeLocked: () => {
        const s = get();
        if (s.arcadeBudget.date !== todayISO()) return false;
        return !!s.arcadeBudget.lockedAt;
      },
      arcadeRemainingSeconds: () => {
        const s = get();
        if (s.arcadeBudget.date !== todayISO()) return ARCADE_DAILY_CAP_SECONDS;
        return Math.max(0, ARCADE_DAILY_CAP_SECONDS - s.arcadeBudget.secondsPlayed);
      },
      mathRemainingSeconds: () => {
        const s = get();
        if (s.arcadeBudget.date !== todayISO()) return 0;
        if (!s.arcadeBudget.lockedAt) return 0;
        return Math.max(0, MATH_UNLOCK_SECONDS - s.arcadeBudget.mathSecondsTowardUnlock);
      },
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      // Trails are open: every unit is playable. (Kept for API compatibility;
      // later units award bigger bonuses instead of being locked.)
      isUnitUnlocked: () => true,
      starsForUnit: (domain, unit) =>
        (get().byDomain[domain]?.unitStars[unit] ?? 0) as Stars,
      totalStars: () => {
        let n = 0;
        for (const d of DOMAINS) {
          const dp = get().byDomain[d];
          if (!dp) continue;
          for (const s of Object.values(dp.unitStars)) n += s as number;
        }
        return n;
      },
      todaysXp: () => {
        const s = get();
        return s.dailyXpResetDate === todayISO() ? s.dailyXp : 0;
      },
      dueReviewCount: () => {
        const today = todayISO();
        let n = 0;
        for (const st of Object.values(get().problemStats)) {
          if (st.due != null && st.due <= today) n++;
        }
        return n;
      },
      resetAll: () =>
        set({
          byDomain: blankAll(),
          xp: 0,
          streak: 0,
          bestStreak: 0,
          bestSessionStreak: 0,
          dailyStreak: 0,
          bestDailyStreak: 0,
          lastPracticeDate: null,
          stickers: [],
          totalPerfectUnits: 0,
          // reset stats but preserve preferences (soundEnabled, dailyGoal, onboardingComplete)
          mockTestsCompleted: 0,
          bestMockAccuracy: 0,
          dailyXp: 0,
          dailyXpResetDate: null,
          dailyQuestStreak: 0,
          lastGoalDate: null,
          practiceDates: [],
          xpByDate: {},
          lastFreezeDate: null,
          problemStats: {},
          ritHistory: [],
          lessonsViewed: [],
          trailBonusGranted: {},
          allTrailsBonusGranted: false,
          arcadeDaily: { date: null, played: [], varietyAwarded: [] },
          arcadeTotals: {},
          lastWheelSpinDate: null,
          c4Wins: 0,
          finalsResults: {},
          arcadeBudget: {
            date: null,
            secondsPlayed: 0,
            lockedAt: null,
            mathSecondsTowardUnlock: 0,
          },
        }),
    }),
    {
      name: '99daysofmath:progress',
      version: 10,
      migrate: migrateProgress,
    },
  ),
);
