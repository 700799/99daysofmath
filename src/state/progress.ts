import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DOMAINS, type Domain } from '../types/problem';
import { checkAllEarning, STICKER_DEFS } from '../utils/encouragement';

export type Stars = 0 | 1 | 2 | 3;

interface DomainProgress {
  unitsUnlocked: number;
  unitStars: Record<number, Stars>;
  missedProblemIds: string[];
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
  recordUnitResult: (
    domain: Domain,
    unit: number,
    stars: Stars,
    missedIds: string[],
    xpEarned: number,
    mistakesTotal: number,
  ) => string[]; // newly earned sticker IDs
  awardXP: (n: number) => string[];
  incrementStreak: () => string[];
  resetStreak: () => void;
  touchDay: () => string[];
  toggleSound: () => void;
  isUnitUnlocked: (domain: Domain, unit: number) => boolean;
  starsForUnit: (domain: Domain, unit: number) => Stars;
  totalStars: () => number;
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
      recordUnitResult: (domain, unit, stars, missedIds, xpEarned, mistakesTotal) => {
        const stateBefore = get();
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
        const nextXp = stateBefore.xp + xpEarned;
        const nextTotalPerfect = stateBefore.totalPerfectUnits + (newPerfect ? 1 : 0);
        const earned = checkAllEarning(
          {
            xp: nextXp,
            dailyStreak: stateBefore.dailyStreak,
            bestSessionStreak: stateBefore.bestSessionStreak,
            totalPerfectUnits: nextTotalPerfect,
            byDomainUnitsCompleted: unitsCompletedByDomain(nextByDomain),
            alreadyEarned: new Set(stateBefore.stickers),
          },
          { domain, unit, stars, mistakesTotal },
        );
        set({
          byDomain: nextByDomain,
          xp: nextXp,
          totalPerfectUnits: nextTotalPerfect,
          stickers:
            earned.length > 0
              ? [...stateBefore.stickers, ...earned]
              : stateBefore.stickers,
        });
        return earned;
      },
      awardXP: (n) => {
        const before = get();
        const nextXp = before.xp + n;
        const earned = checkAllEarning({
          xp: nextXp,
          dailyStreak: before.dailyStreak,
          bestSessionStreak: before.bestSessionStreak,
          totalPerfectUnits: before.totalPerfectUnits,
          byDomainUnitsCompleted: unitsCompletedByDomain(before.byDomain),
          alreadyEarned: new Set(before.stickers),
        });
        set({
          xp: nextXp,
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return earned;
      },
      incrementStreak: () => {
        const before = get();
        const next = before.streak + 1;
        const bestSession = Math.max(before.bestSessionStreak, next);
        const earned = checkAllEarning({
          xp: before.xp,
          dailyStreak: before.dailyStreak,
          bestSessionStreak: bestSession,
          totalPerfectUnits: before.totalPerfectUnits,
          byDomainUnitsCompleted: unitsCompletedByDomain(before.byDomain),
          alreadyEarned: new Set(before.stickers),
        });
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
        if (!before.lastPracticeDate) {
          nextStreak = 1;
        } else {
          const gap = daysBetween(before.lastPracticeDate, today);
          nextStreak = gap === 1 ? before.dailyStreak + 1 : 1;
        }
        const earned = checkAllEarning({
          xp: before.xp,
          dailyStreak: nextStreak,
          bestSessionStreak: before.bestSessionStreak,
          totalPerfectUnits: before.totalPerfectUnits,
          byDomainUnitsCompleted: unitsCompletedByDomain(before.byDomain),
          alreadyEarned: new Set(before.stickers),
        });
        set({
          lastPracticeDate: today,
          dailyStreak: nextStreak,
          bestDailyStreak: Math.max(before.bestDailyStreak, nextStreak),
          stickers:
            earned.length > 0 ? [...before.stickers, ...earned] : before.stickers,
        });
        return earned;
      },
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      isUnitUnlocked: (domain, unit) =>
        unit <= (get().byDomain[domain]?.unitsUnlocked ?? 1),
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
        }),
    }),
    {
      name: '99daysofmath:progress',
      version: 4,
      migrate: (persisted: unknown, fromVersion: number) => {
        if (!persisted || typeof persisted !== 'object') return persisted;
        const state = persisted as Partial<ProgressState> & {
          stickers?: string[];
        };
        if (fromVersion < 4) {
          // Map old emoji-prefixed sticker strings to new IDs (best-effort).
          // Old format e.g. "⭐ Starlight" → unit:* with matching label.
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
          // Recompute totalPerfectUnits from snapshot.
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
        return state;
      },
    },
  ),
);
