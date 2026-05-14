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
  recordUnitResult: (
    domain: Domain,
    unit: number,
    stars: Stars,
    missedIds: string[],
  ) => void;
  isUnitUnlocked: (domain: Domain, unit: number) => boolean;
  starsForUnit: (domain: Domain, unit: number) => Stars;
  totalStars: () => number;
  resetAll: () => void;
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
      recordUnitResult: (domain, unit, stars, missedIds) =>
        set((state) => {
          const d = state.byDomain[domain] ?? blankDomain();
          const prevStars = d.unitStars[unit] ?? 0;
          const nextStars: Stars = (Math.max(prevStars, stars) as Stars);
          const unlocked =
            stars >= 1 ? Math.max(d.unitsUnlocked, unit + 1) : d.unitsUnlocked;
          const missedSet = new Set([...d.missedProblemIds, ...missedIds]);
          return {
            byDomain: {
              ...state.byDomain,
              [domain]: {
                unitsUnlocked: unlocked,
                unitStars: { ...d.unitStars, [unit]: nextStars },
                missedProblemIds: Array.from(missedSet),
              },
            },
          };
        }),
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
      resetAll: () => set({ byDomain: blankAll() }),
    }),
    { name: '99daysofmath:progress', version: 1 },
  ),
);
