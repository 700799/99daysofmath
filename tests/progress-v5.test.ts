import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useProgress } from '../src/state/progress';

// Helper: set the system clock to a fixed local date.
function setToday(iso: string) {
  vi.setSystemTime(new Date(`${iso}T12:00:00`));
}

function freshState() {
  useProgress.setState({
    byDomain: {
      '6.RP': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
      '6.NS': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
      '6.EE': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
      '6.G': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
      '6.SP': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
    },
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
    mockTestsCompleted: 0,
    bestMockAccuracy: 0,
    dailyXp: 0,
    dailyGoal: 30,
    dailyXpResetDate: null,
    dailyQuestStreak: 0,
    lastGoalDate: null,
    practiceDates: [],
    xpByDate: {},
    lastFreezeDate: null,
    onboardingComplete: false,
  });
}

describe('daily XP', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('awardXP increments both xp and dailyXp', () => {
    useProgress.getState().awardXP(12);
    const s = useProgress.getState();
    expect(s.xp).toBe(12);
    expect(s.dailyXp).toBe(12);
    expect(s.xpByDate['2026-05-01']).toBe(12);
  });

  it('dailyXp resets on a new day, total xp persists', () => {
    useProgress.getState().awardXP(20);
    expect(useProgress.getState().dailyXp).toBe(20);
    setToday('2026-05-02');
    useProgress.getState().awardXP(5);
    const s = useProgress.getState();
    expect(s.dailyXp).toBe(5);   // reset for new day
    expect(s.xp).toBe(25);       // cumulative
    expect(s.todaysXp()).toBe(5);
  });

  it('hitting the daily goal awards quest-1 and starts quest streak', () => {
    const earned = useProgress.getState().awardXP(30);
    expect(useProgress.getState().dailyQuestStreak).toBe(1);
    expect(earned).toContain('quest-1');
  });

  it('quest streak increments across consecutive goal days', () => {
    useProgress.getState().awardXP(30); // day 1 goal
    setToday('2026-05-02');
    useProgress.getState().awardXP(30); // day 2 goal
    expect(useProgress.getState().dailyQuestStreak).toBe(2);
  });

  it('quest streak resets if a goal day is skipped', () => {
    useProgress.getState().awardXP(30); // day 1
    setToday('2026-05-03'); // skip day 2
    useProgress.getState().awardXP(30);
    expect(useProgress.getState().dailyQuestStreak).toBe(1);
  });
});

describe('streak freeze', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('preserves streak across a single missed day when streak >= 3', () => {
    setToday('2026-05-01');
    useProgress.setState({ dailyStreak: 5, lastPracticeDate: '2026-04-29' });
    // gap from 04-29 to 05-01 is 2 days (missed 04-30)
    const earned = useProgress.getState().touchDay();
    const s = useProgress.getState();
    expect(s.dailyStreak).toBe(6);          // streak continued
    expect(s.lastFreezeDate).toBe('2026-05-01');
    expect(earned).toContain('freeze-saved');
  });

  it('does NOT freeze when streak < 3', () => {
    setToday('2026-05-01');
    useProgress.setState({ dailyStreak: 2, lastPracticeDate: '2026-04-29' });
    useProgress.getState().touchDay();
    expect(useProgress.getState().dailyStreak).toBe(1); // reset
    expect(useProgress.getState().lastFreezeDate).toBeNull();
  });

  it('does NOT freeze twice within 7 days', () => {
    setToday('2026-05-01');
    useProgress.setState({
      dailyStreak: 5,
      lastPracticeDate: '2026-04-29',
      lastFreezeDate: '2026-04-28', // used 3 days ago
    });
    useProgress.getState().touchDay();
    expect(useProgress.getState().dailyStreak).toBe(1); // freeze unavailable → reset
  });

  it('normal consecutive day increments without using freeze', () => {
    setToday('2026-05-02');
    useProgress.setState({ dailyStreak: 4, lastPracticeDate: '2026-05-01' });
    useProgress.getState().touchDay();
    expect(useProgress.getState().dailyStreak).toBe(5);
    expect(useProgress.getState().lastFreezeDate).toBeNull();
  });

  it('records practice dates', () => {
    setToday('2026-05-02');
    useProgress.getState().touchDay();
    expect(useProgress.getState().practiceDates).toContain('2026-05-02');
  });
});

describe('mock test', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('first completion awards mock-test-1 and records accuracy', () => {
    const earned = useProgress.getState().recordMockTestResult(0.8);
    const s = useProgress.getState();
    expect(s.mockTestsCompleted).toBe(1);
    expect(s.bestMockAccuracy).toBeCloseTo(0.8);
    expect(earned).toContain('mock-test-1');
  });

  it('bestMockAccuracy only increases', () => {
    useProgress.getState().recordMockTestResult(0.9);
    useProgress.getState().recordMockTestResult(0.5);
    expect(useProgress.getState().bestMockAccuracy).toBeCloseTo(0.9);
  });

  it('does not re-award mock-test-1 on second test', () => {
    useProgress.getState().recordMockTestResult(0.7);
    const earned = useProgress.getState().recordMockTestResult(0.95);
    expect(earned).not.toContain('mock-test-1');
  });
});

describe('clearMissed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('removes a problem id from the missed list', () => {
    useProgress.setState({
      byDomain: {
        ...useProgress.getState().byDomain,
        '6.RP': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: ['6.RP.001', '6.RP.002'] },
      },
    });
    useProgress.getState().clearMissed('6.RP', '6.RP.001');
    expect(useProgress.getState().byDomain['6.RP'].missedProblemIds).toEqual(['6.RP.002']);
  });

  it('is a no-op if the id is not present', () => {
    useProgress.getState().clearMissed('6.RP', '6.RP.999');
    expect(useProgress.getState().byDomain['6.RP'].missedProblemIds).toEqual([]);
  });
});

describe('onboarding + daily goal setters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('markOnboardingDone sets the flag', () => {
    expect(useProgress.getState().onboardingComplete).toBe(false);
    useProgress.getState().markOnboardingDone();
    expect(useProgress.getState().onboardingComplete).toBe(true);
  });

  it('setDailyGoal updates the goal', () => {
    useProgress.getState().setDailyGoal(50);
    expect(useProgress.getState().dailyGoal).toBe(50);
  });
});
