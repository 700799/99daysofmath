import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useProgress } from '../src/state/progress';
import { levelForXp, xpForLevel } from '../src/utils/levels';

function setToday(iso: string) {
  vi.setSystemTime(new Date(`${iso}T12:00:00`));
}

function fresh() {
  useProgress.getState().resetAll();
  useProgress.setState({
    xp: 0,
    dailyXp: 0,
    dailyXpResetDate: null,
    dailyQuestStreak: 0,
    lastGoalDate: null,
    stickers: [],
    xpByDate: {},
  });
}

describe('recordArcadePlay — diversity economy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-06-01');
    fresh();
  });
  afterEach(() => vi.useRealTimers());

  it('first play of a game pays full XP; same-day repeat pays half', () => {
    const first = useProgress.getState().recordArcadePlay('memory', 8);
    expect(first.xpAwarded).toBe(8);
    expect(first.repeatToday).toBe(false);
    const again = useProgress.getState().recordArcadePlay('memory', 8);
    expect(again.xpAwarded).toBe(4);
    expect(again.repeatToday).toBe(true);
  });

  it('variety bonuses fire at 3 and 5 distinct games (once each)', () => {
    const s = useProgress.getState();
    expect(s.recordArcadePlay('a', 5).varietyBonus).toBe(0);
    expect(useProgress.getState().recordArcadePlay('b', 5).varietyBonus).toBe(0);
    const third = useProgress.getState().recordArcadePlay('c', 5);
    expect(third.varietyBonus).toBe(10);
    expect(useProgress.getState().recordArcadePlay('c', 5).varietyBonus).toBe(0); // repeat, no re-award
    expect(useProgress.getState().recordArcadePlay('d', 5).varietyBonus).toBe(0);
    const fifth = useProgress.getState().recordArcadePlay('e', 5);
    expect(fifth.varietyBonus).toBe(20);
    expect(fifth.distinctToday).toBe(5);
    expect(fifth.earned).toContain('arcade-variety');
  });

  it('the played-set resets on a new day', () => {
    useProgress.getState().recordArcadePlay('memory', 8);
    setToday('2026-06-02');
    const next = useProgress.getState().recordArcadePlay('memory', 8);
    expect(next.repeatToday).toBe(false);
    expect(next.xpAwarded).toBe(8);
  });

  it('connect-four win increments c4Wins and earns the sticker once', () => {
    const out = useProgress.getState().recordArcadePlay('connect4', 5, { c4Win: true });
    expect(useProgress.getState().c4Wins).toBe(1);
    expect(out.earned).toContain('arcade-c4');
    const again = useProgress.getState().recordArcadePlay('connect4', 5, { c4Win: true });
    expect(again.earned).not.toContain('arcade-c4');
  });

  it('wheel spin stamps the date and earns the wheel sticker', () => {
    const out = useProgress.getState().recordArcadePlay('wheel', 25, { wheelSpin: true });
    expect(useProgress.getState().lastWheelSpinDate).toBe('2026-06-01');
    expect(out.earned).toContain('arcade-wheel');
    expect(out.xpAwarded).toBe(25);
  });
});

describe('recordFinalResult', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-06-01');
    fresh();
  });
  afterEach(() => vi.useRealTimers());

  it('pays 40 + 2×correct and records the best score', () => {
    const out = useProgress.getState().recordFinalResult(1, 15, 20);
    expect(out.bonus).toBe(70);
    expect(out.best).toBe(15);
    expect(out.earned).toContain('finals-first');
    // lower retake keeps the best
    const retake = useProgress.getState().recordFinalResult(1, 10, 20);
    expect(retake.best).toBe(15);
  });

  it('finishing all 5 quizzes earns the crown', () => {
    for (let n = 1; n <= 4; n++) useProgress.getState().recordFinalResult(n, 12, 20);
    const last = useProgress.getState().recordFinalResult(5, 12, 20);
    expect(last.earned).toContain('finals-all');
  });
});

describe('levels', () => {
  it('thresholds follow T(n) = 50·n(n−1)/2', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(50);
    expect(xpForLevel(3)).toBe(150);
    expect(xpForLevel(4)).toBe(300);
    expect(xpForLevel(5)).toBe(500);
  });

  it('levelForXp reports level and progress', () => {
    expect(levelForXp(0).level).toBe(1);
    expect(levelForXp(49).level).toBe(1);
    expect(levelForXp(50).level).toBe(2);
    expect(levelForXp(160).level).toBe(3);
    const info = levelForXp(200);
    expect(info.level).toBe(3);
    expect(info.intoLevel).toBe(50);
    expect(info.needed).toBe(150);
  });
});
