import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DOMAINS, type Domain } from '../types/problem';
import {
  coinsForUnitResult,
  medalForPlace,
  type RewardGameId,
  type Trophy,
} from '../rewards/economy';

export type Stars = 0 | 1 | 2 | 3;

interface DomainProgress {
  unitsUnlocked: number;
  unitStars: Record<number, Stars>;
  missedProblemIds: string[];
}

interface ProgressState {
  byDomain: Record<Domain, DomainProgress>;
  /** Coins earned from finishing units and won in reward games. */
  coins: number;
  /** Every trophy ever won in the reward arcade. */
  trophies: Trophy[];
  recordUnitResult: (
    domain: Domain,
    unit: number,
    stars: Stars,
    missedIds: string[],
  ) => void;
  isUnitUnlocked: (domain: Domain, unit: number) => boolean;
  starsForUnit: (domain: Domain, unit: number) => Stars;
  totalStars: () => number;
  /** Add coins (e.g. a reward-game payout). Negative values are ignored. */
  awardCoins: (amount: number) => void;
  /** Spend coins; returns false (and changes nothing) if the balance is short. */
  spendCoins: (amount: number) => boolean;
  /** Record a finished reward game: banks coins and awards a placement trophy. */
  recordGameResult: (game: RewardGameId, place: number, coinsEarned: number) => void;
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
      coins: 0,
      trophies: [],
      recordUnitResult: (domain, unit, stars, missedIds) =>
        set((state) => {
          const d = state.byDomain[domain] ?? blankDomain();
          const prevStars = d.unitStars[unit] ?? 0;
          const nextStars: Stars = (Math.max(prevStars, stars) as Stars);
          const unlocked =
            stars >= 1 ? Math.max(d.unitsUnlocked, unit + 1) : d.unitsUnlocked;
          const missedSet = new Set([...d.missedProblemIds, ...missedIds]);
          return {
            coins: state.coins + coinsForUnitResult(prevStars, stars),
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
      awardCoins: (amount) =>
        set((state) => ({ coins: state.coins + Math.max(0, Math.round(amount)) })),
      spendCoins: (amount) => {
        const cost = Math.max(0, Math.round(amount));
        if (get().coins < cost) return false;
        set((state) => ({ coins: state.coins - cost }));
        return true;
      },
      recordGameResult: (game, place, coinsEarned) =>
        set((state) => ({
          coins: state.coins + Math.max(0, Math.round(coinsEarned)),
          trophies: [
            ...state.trophies,
            { game, medal: medalForPlace(place), at: Date.now() },
          ],
        })),
      resetAll: () => set({ byDomain: blankAll(), coins: 0, trophies: [] }),
    }),
    {
      name: '99daysofmath:progress',
      version: 2,
      // v1 had no coins/trophies; backfill them so older saves keep working.
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        return {
          ...p,
          coins: p.coins ?? 0,
          trophies: p.trophies ?? [],
        } as ProgressState;
      },
    },
  ),
);
