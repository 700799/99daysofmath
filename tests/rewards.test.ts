import { describe, it, expect } from 'vitest';
import {
  coinsForUnit,
  coinsForUnitResult,
  medalForPlace,
  isGameUnlocked,
  starsUntilUnlock,
  tallyTrophies,
  PRACTICE_BONUS_COINS,
  type Trophy,
} from '../src/rewards/economy';
import {
  makeChallenge,
  isChallengeCorrect,
  type ChallengeDifficulty,
} from '../src/rewards/mathChallenge';
import {
  BOARD,
  rollDie,
  advancePos,
  resolveEvent,
  rankPlayers,
  placeOf,
  partyPayout,
  makePlayers,
  type PartyPlayer,
} from '../src/rewards/partyBoard';
import { grandPrixPayout } from '../src/rewards/grandPrix';

// Deterministic RNG for repeatable tests.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Evaluate a generated prompt left-to-right (ops never mix precedence here).
function evalPrompt(prompt: string): number {
  const parts = prompt
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .split(' ');
  let acc = Number(parts[0]);
  for (let i = 1; i < parts.length; i += 2) {
    const op = parts[i];
    const n = Number(parts[i + 1]);
    if (op === '+') acc += n;
    else if (op === '-') acc -= n;
    else if (op === '*') acc *= n;
    else if (op === '/') acc /= n;
  }
  return acc;
}

describe('coinsForUnit', () => {
  it('scales with stars', () => {
    expect(coinsForUnit(0)).toBe(5);
    expect(coinsForUnit(1)).toBe(10);
    expect(coinsForUnit(2)).toBe(15);
    expect(coinsForUnit(3)).toBe(20);
  });
  it('clamps out-of-range stars', () => {
    expect(coinsForUnit(9)).toBe(20);
    expect(coinsForUnit(-4)).toBe(5);
  });
});

describe('coinsForUnitResult', () => {
  it('pays full coins on a first clear', () => {
    expect(coinsForUnitResult(0, 2)).toBe(coinsForUnit(2));
  });
  it('pays full coins when improving', () => {
    expect(coinsForUnitResult(1, 3)).toBe(coinsForUnit(3));
  });
  it('pays only the practice bonus on a non-improving replay', () => {
    expect(coinsForUnitResult(3, 2)).toBe(PRACTICE_BONUS_COINS);
    expect(coinsForUnitResult(2, 2)).toBe(PRACTICE_BONUS_COINS);
  });
});

describe('medals + unlocks', () => {
  it('maps place to medal', () => {
    expect(medalForPlace(1)).toBe('gold');
    expect(medalForPlace(2)).toBe('silver');
    expect(medalForPlace(3)).toBe('bronze');
    expect(medalForPlace(7)).toBe('bronze');
  });
  it('gates games by total stars', () => {
    expect(isGameUnlocked(0, 'math-party')).toBe(false);
    expect(isGameUnlocked(1, 'math-party')).toBe(true);
    expect(isGameUnlocked(5, 'grand-prix')).toBe(false);
    expect(isGameUnlocked(6, 'grand-prix')).toBe(true);
  });
  it('reports stars still needed', () => {
    expect(starsUntilUnlock(0, 'math-party')).toBe(1);
    expect(starsUntilUnlock(4, 'grand-prix')).toBe(2);
    expect(starsUntilUnlock(99, 'grand-prix')).toBe(0);
  });
});

describe('tallyTrophies', () => {
  it('counts medals by kind', () => {
    const trophies: Trophy[] = [
      { game: 'math-party', medal: 'gold', at: 1 },
      { game: 'grand-prix', medal: 'silver', at: 2 },
      { game: 'math-party', medal: 'gold', at: 3 },
      { game: 'grand-prix', medal: 'bronze', at: 4 },
    ];
    expect(tallyTrophies(trophies)).toEqual({ gold: 2, silver: 1, bronze: 1, total: 4 });
  });
  it('handles an empty case', () => {
    expect(tallyTrophies([])).toEqual({ gold: 0, silver: 0, bronze: 0, total: 0 });
  });
});

describe('makeChallenge', () => {
  const difficulties: ChallengeDifficulty[] = [1, 2, 3];
  for (const d of difficulties) {
    it(`difficulty ${d}: answer is a non-negative integer matching the prompt`, () => {
      const rng = mulberry32(d * 1000 + 7);
      for (let i = 0; i < 400; i++) {
        const c = makeChallenge(d, rng);
        expect(Number.isInteger(c.answer)).toBe(true);
        expect(c.answer).toBeGreaterThanOrEqual(0);
        expect(evalPrompt(c.prompt)).toBe(c.answer);
      }
    });
  }
});

describe('isChallengeCorrect', () => {
  const c = { prompt: '6 × 7', answer: 42 };
  it('accepts the exact integer', () => {
    expect(isChallengeCorrect('42', c)).toBe(true);
    expect(isChallengeCorrect('  42 ', c)).toBe(true);
  });
  it('rejects wrong or empty input', () => {
    expect(isChallengeCorrect('41', c)).toBe(false);
    expect(isChallengeCorrect('', c)).toBe(false);
    expect(isChallengeCorrect('abc', c)).toBe(false);
  });
  it('handles a unicode minus in negative answers', () => {
    expect(isChallengeCorrect('−3', { prompt: 't', answer: -3 })).toBe(true);
  });
});

describe('partyBoard basics', () => {
  it('rolls within 1..6', () => {
    expect(rollDie(() => 0)).toBe(1);
    expect(rollDie(() => 0.9999)).toBe(6);
    const rng = mulberry32(99);
    for (let i = 0; i < 200; i++) {
      const r = rollDie(rng);
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(6);
    }
  });
  it('wraps around the loop', () => {
    expect(advancePos(BOARD.length - 2, 5)).toBe(3);
    expect(advancePos(0, BOARD.length)).toBe(0);
  });
  it('has exactly two star tiles', () => {
    expect(BOARD.filter((t) => t === 'star')).toHaveLength(2);
  });
});

describe('resolveEvent', () => {
  it('gives a coin bonus on a low roll', () => {
    const e = resolveEvent(() => 0.1);
    expect(e.kind).toBe('bonus');
    expect(e.coinDelta).toBeGreaterThan(0);
  });
  it('steals on a mid roll', () => {
    const e = resolveEvent(() => 0.5);
    expect(e.kind).toBe('steal');
    expect(e.stealAmount).toBeGreaterThan(0);
  });
  it('penalizes on a high roll', () => {
    const e = resolveEvent(() => 0.85);
    expect(e.kind).toBe('penalty');
    expect(e.coinDelta).toBeLessThan(0);
  });
  it('jackpots a star on the top roll', () => {
    const e = resolveEvent(() => 0.99);
    expect(e.kind).toBe('jackpot');
    expect(e.starDelta).toBe(1);
  });
});

describe('ranking + payout', () => {
  const players: PartyPlayer[] = [
    { id: 'you', name: 'You', emoji: '🦉', pos: 0, coins: 8, stars: 2 },
    { id: 'rival', name: 'Foxy', emoji: '🦊', pos: 0, coins: 30, stars: 2 },
  ];
  it('ranks by stars then coins', () => {
    const ranked = rankPlayers(players);
    expect(ranked[0].id).toBe('rival'); // same stars, more coins
  });
  it('gives a place to each player', () => {
    expect(placeOf(players, 'rival')).toBe(1);
    expect(placeOf(players, 'you')).toBe(2);
  });
  it('breaks exact ties in the human player favor', () => {
    const tied: PartyPlayer[] = [
      { id: 'you', name: 'You', emoji: '🦉', pos: 0, coins: 5, stars: 1 },
      { id: 'rival', name: 'Foxy', emoji: '🦊', pos: 0, coins: 5, stars: 1 },
    ];
    expect(placeOf(tied, 'you')).toBe(1);
  });
  it('pays more for winning', () => {
    const winner: PartyPlayer = { id: 'you', name: 'You', emoji: '🦉', pos: 0, coins: 12, stars: 3 };
    expect(partyPayout(winner, 1)).toBeGreaterThan(partyPayout(winner, 2));
  });
  it('starts both players with the configured coins', () => {
    const ps = makePlayers();
    expect(ps).toHaveLength(2);
    expect(ps[0].coins).toBe(ps[1].coins);
  });
});

describe('grandPrixPayout', () => {
  it('rewards better finishes more', () => {
    expect(grandPrixPayout(1)).toBeGreaterThan(grandPrixPayout(2));
    expect(grandPrixPayout(2)).toBeGreaterThan(grandPrixPayout(3));
    expect(grandPrixPayout(9)).toBe(grandPrixPayout(3));
  });
});
