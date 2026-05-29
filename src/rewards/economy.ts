// Reward economy: coins earned from math, reward-game unlocks, and trophies.
// Pure functions only so they can be unit-tested without React or Phaser.

export type RewardGameId = 'math-party' | 'grand-prix';

export interface RewardGameMeta {
  id: RewardGameId;
  name: string;
  tagline: string;
  emoji: string;
  /** Accent color (hex) used for the arcade card and in-game theming. */
  accent: string;
  /** Total stars across all trails required before the game unlocks. */
  unlockStars: number;
  /** Featured games are shown larger at the top of the arcade. */
  featured?: boolean;
}

// Math Party is the headline reward — a Mario-Party-style board game — so it is
// featured and unlocks early. Grand Prix is the second-tier reward.
export const REWARD_GAMES: RewardGameMeta[] = [
  {
    id: 'math-party',
    name: 'Math Party',
    tagline: 'Roll the dice, race a rival, and grab Stars on the party board!',
    emoji: '🎲',
    accent: '#CE82FF',
    unlockStars: 1,
    featured: true,
  },
  {
    id: 'grand-prix',
    name: 'Math Grand Prix',
    tagline: 'Answer fast, boost your kart, and take the checkered flag!',
    emoji: '🏎️',
    accent: '#FF9600',
    unlockStars: 6,
  },
];

export function gameMeta(id: RewardGameId): RewardGameMeta {
  const meta = REWARD_GAMES.find((g) => g.id === id);
  if (!meta) throw new Error(`Unknown reward game: ${id}`);
  return meta;
}

export function isGameUnlocked(totalStars: number, id: RewardGameId): boolean {
  return totalStars >= gameMeta(id).unlockStars;
}

export function starsUntilUnlock(totalStars: number, id: RewardGameId): number {
  return Math.max(0, gameMeta(id).unlockStars - totalStars);
}

/**
 * Coins awarded for finishing a unit at the given star level. A first clear or
 * a star improvement pays the full amount; replays pay a small practice bonus
 * (see `coinsForUnitResult`).
 */
export function coinsForUnit(stars: number): number {
  const s = Math.max(0, Math.min(3, Math.round(stars)));
  return 5 + s * 5; // 0★→5, 1★→10, 2★→15, 3★→20
}

export const PRACTICE_BONUS_COINS = 3;

/**
 * Coin payout for a unit result given the previous best star count for that
 * unit. Full payout on a new clear or improvement, small practice bonus when
 * replaying without beating the prior score — so grinding stays gentle but
 * progress always pays off.
 */
export function coinsForUnitResult(prevStars: number, newStars: number): number {
  return newStars > prevStars ? coinsForUnit(newStars) : PRACTICE_BONUS_COINS;
}

export type Medal = 'gold' | 'silver' | 'bronze';

export const MEDAL_EMOJI: Record<Medal, string> = {
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
};

export const MEDAL_LABEL: Record<Medal, string> = {
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export interface Trophy {
  game: RewardGameId;
  medal: Medal;
  /** Epoch milliseconds the trophy was won. */
  at: number;
}

/** 1-based finishing place → medal. 1st = gold, 2nd = silver, 3rd+ = bronze. */
export function medalForPlace(place: number): Medal {
  if (place <= 1) return 'gold';
  if (place === 2) return 'silver';
  return 'bronze';
}

export interface MedalTally {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export function tallyTrophies(trophies: Trophy[]): MedalTally {
  const tally: MedalTally = { gold: 0, silver: 0, bronze: 0, total: trophies.length };
  for (const t of trophies) tally[t.medal] += 1;
  return tally;
}
