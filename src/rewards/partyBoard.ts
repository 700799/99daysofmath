// Pure rules for the Math Party board game (the Mario-Party-style reward).
// The Phaser scene owns rendering and animation; everything here is plain data
// and deterministic helpers so the game logic can be unit-tested.

import type { RNG } from './mathChallenge';
import type { IconName } from '../icons/registry';

export type PartyTileType = 'blue' | 'red' | 'star' | 'event' | 'challenge';

export interface TileStyle {
  color: number; // 0xRRGGBB for Phaser
  label: string; // short glyph drawn on the tile
  name: string;
}

export const TILE_STYLES: Record<PartyTileType, TileStyle> = {
  blue: { color: 0x1cb0f6, label: '+', name: 'Coin tile' },
  red: { color: 0xff4b4b, label: '−', name: 'Bowser tile' },
  star: { color: 0xffc800, label: '★', name: 'Star tile' },
  event: { color: 0xce82ff, label: '?', name: 'Lucky tile' },
  challenge: { color: 0xff9600, label: '×', name: 'Math tile' },
};

// A 20-tile loop with two Star tiles and a balanced spread of the rest.
export const BOARD: PartyTileType[] = [
  'blue', 'blue', 'challenge', 'red', 'event',
  'star', 'blue', 'red', 'event', 'challenge',
  'blue', 'event', 'red', 'blue', 'star',
  'challenge', 'red', 'event', 'blue', 'challenge',
];

export const PARTY_CONFIG = {
  startCoins: 10,
  /** Number of rounds; each round every player rolls once. */
  totalRounds: 8,
  blueGain: 3,
  redLoss: 3,
  starCost: 10,
  challengeReward: 5,
  challengePenalty: 3,
  /** Chance the CPU rival answers a math tile correctly. */
  cpuChallengeSuccess: 0.6,
};

export interface PartyPlayer {
  id: 'you' | 'rival';
  name: string;
  icon: IconName;
  pos: number; // tile index
  coins: number;
  stars: number;
}

export function makePlayers(): PartyPlayer[] {
  return [
    { id: 'you', name: 'You', icon: 'owl', pos: 0, coins: PARTY_CONFIG.startCoins, stars: 0 },
    { id: 'rival', name: 'Foxy', icon: 'fox', pos: 0, coins: PARTY_CONFIG.startCoins, stars: 0 },
  ];
}

/**
 * Pip offsets for each die face (relative to the die center, ±10 grid).
 * Shared by the Phaser dice renderer and unit tests.
 */
export const DICE_PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-9, -9], [9, 9]],
  3: [[-10, -10], [0, 0], [10, 10]],
  4: [[-9, -9], [9, -9], [-9, 9], [9, 9]],
  5: [[-9, -9], [9, -9], [0, 0], [-9, 9], [9, 9]],
  6: [[-9, -10], [9, -10], [-9, 0], [9, 0], [-9, 10], [9, 10]],
};

/** Roll a six-sided die. */
export function rollDie(rng: RNG = Math.random): number {
  return 1 + Math.floor(rng() * 6);
}

/** Tile index reached after moving `steps` from `pos` around the loop. */
export function advancePos(pos: number, steps: number): number {
  return (pos + steps) % BOARD.length;
}

export type EventKind = 'bonus' | 'steal' | 'penalty' | 'jackpot';

export interface EventOutcome {
  kind: EventKind;
  /** Coins gained (+) or lost (−) by the active player. */
  coinDelta: number;
  /** Coins taken from the opponent (for steal); 0 otherwise. */
  stealAmount: number;
  /** Stars gained by the active player (jackpot only). */
  starDelta: number;
  message: string;
}

/** Resolve a Lucky (event) tile. Luck-based and skewed positive for fun. */
export function resolveEvent(rng: RNG = Math.random): EventOutcome {
  const r = rng();
  if (r < 0.45) {
    const gain = 2 + Math.floor(rng() * 5); // 2..6
    return { kind: 'bonus', coinDelta: gain, stealAmount: 0, starDelta: 0, message: `Lucky! +${gain} coins` };
  }
  if (r < 0.75) {
    const amt = 1 + Math.floor(rng() * 5); // 1..5
    return { kind: 'steal', coinDelta: amt, stealAmount: amt, starDelta: 0, message: `Swiped ${amt} coins!` };
  }
  if (r < 0.93) {
    const loss = 2 + Math.floor(rng() * 3); // 2..4
    return { kind: 'penalty', coinDelta: -loss, stealAmount: 0, starDelta: 0, message: `Oops, −${loss} coins` };
  }
  return { kind: 'jackpot', coinDelta: 0, stealAmount: 0, starDelta: 1, message: 'JACKPOT! +1 Star' };
}

/** Whether the CPU rival gets a math tile right this turn. */
export function cpuAnswersCorrectly(rng: RNG = Math.random): boolean {
  return rng() < PARTY_CONFIG.cpuChallengeSuccess;
}

/** Players ranked best-first: most stars, then most coins. */
export function rankPlayers(players: PartyPlayer[]): PartyPlayer[] {
  return [...players].sort((a, b) => b.stars - a.stars || b.coins - a.coins);
}

/** 1-based finishing place of `id`. Ties favor the human (kid-friendly). */
export function placeOf(players: PartyPlayer[], id: PartyPlayer['id']): number {
  const ranked = rankPlayers(players);
  // rankPlayers keeps the array order on ties; ensure "you" wins exact ties by
  // checking score equality against the leader.
  const leader = ranked[0];
  const me = players.find((p) => p.id === id);
  if (!me) return ranked.length;
  if (me.stars === leader.stars && me.coins === leader.coins) return 1;
  return ranked.findIndex((p) => p.id === id) + 1;
}

/**
 * Persistent coin payout banked after a Math Party game finishes. Rewards
 * stars collected, leftover coins, and winning.
 */
export function partyPayout(player: PartyPlayer, place: number): number {
  return player.stars * 8 + Math.floor(player.coins / 3) + (place === 1 ? 20 : 8);
}
