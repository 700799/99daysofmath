import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DOMAINS, type Domain } from '../types/problem';

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
  dailyStreak: number;  // calendar-day streak
  bestDailyStreak: number;
  lastPracticeDate: string | null; // YYYY-MM-DD
  stickers: string[];
  soundEnabled: boolean;
  recordUnitResult: (
    domain: Domain,
    unit: number,
    stars: Stars,
    missedIds: string[],
    xpEarned: number,
    sticker: string,
  ) => void;
  awardXP: (n: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  touchDay: () => void;
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

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      byDomain: blankAll(),
      xp: 0,
      streak: 0,
      bestStreak: 0,
      dailyStreak: 0,
      bestDailyStreak: 0,
      lastPracticeDate: null,
      stickers: [],
      soundEnabled: true,
      recordUnitResult: (domain, unit, stars, missedIds, xpEarned, sticker) =>
        set((state) => {
          const d = state.byDomain[domain] ?? blankDomain();
          const prevStars = d.unitStars[unit] ?? 0;
          const nextStars: Stars = Math.max(prevStars, stars) as Stars;
          const unlocked =
            stars >= 1 ? Math.max(d.unitsUnlocked, unit + 1) : d.unitsUnlocked;
          const missedSet = new Set([...d.missedProblemIds, ...missedIds]);
          const newSticker = sticker && !state.stickers.includes(sticker);
          return {
            byDomain: {
              ...state.byDomain,
              [domain]: {
                unitsUnlocked: unlocked,
                unitStars: { ...d.unitStars, [unit]: nextStars },
                missedProblemIds: Array.from(missedSet),
              },
            },
            xp: state.xp + xpEarned,
            stickers: newSticker ? [...state.stickers, sticker] : state.stickers,
          };
        }),
      awardXP: (n) => set((state) => ({ xp: state.xp + n })),
      incrementStreak: () =>
        set((state) => {
          const next = state.streak + 1;
          return {
            streak: next,
            bestStreak: Math.max(state.bestStreak, next),
          };
        }),
      resetStreak: () => set({ streak: 0 }),
      touchDay: () =>
        set((state) => {
          const today = todayISO();
          if (state.lastPracticeDate === today) return state;
          let nextStreak: number;
          if (!state.lastPracticeDate) {
            nextStreak = 1;
          } else {
            const gap = daysBetween(state.lastPracticeDate, today);
            nextStreak = gap === 1 ? state.dailyStreak + 1 : 1;
          }
          return {
            lastPracticeDate: today,
            dailyStreak: nextStreak,
            bestDailyStreak: Math.max(state.bestDailyStreak, nextStreak),
          };
        }),
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
          dailyStreak: 0,
          bestDailyStreak: 0,
          lastPracticeDate: null,
          stickers: [],
        }),
    }),
    { name: '99daysofmath:progress', version: 3 },
  ),
);
