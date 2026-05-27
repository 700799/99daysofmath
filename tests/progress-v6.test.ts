import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useProgress, migrateProgress } from '../src/state/progress';

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
    problemStats: {},
    ritHistory: [],
    lessonsViewed: [],
  });
}

describe('recordAttempt — mastery tracking', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('tracks attempts/correct and last result', () => {
    const { recordAttempt } = useProgress.getState();
    recordAttempt('6.RP.001', true);
    recordAttempt('6.RP.001', false);
    const stat = useProgress.getState().problemStats['6.RP.001'];
    expect(stat.attempts).toBe(2);
    expect(stat.correct).toBe(1);
    expect(stat.lastResult).toBe('wrong');
    expect(stat.lastSeen).toBe('2026-05-01');
  });

  it('a first-try-correct problem is NOT scheduled for review', () => {
    useProgress.getState().recordAttempt('6.NS.010', true);
    const stat = useProgress.getState().problemStats['6.NS.010'];
    expect(stat.due).toBeNull();
  });

  it('a miss schedules the problem for review the same day at box 0', () => {
    useProgress.getState().recordAttempt('6.EE.005', false);
    const stat = useProgress.getState().problemStats['6.EE.005'];
    expect(stat.box).toBe(0);
    expect(stat.due).toBe('2026-05-01');
  });

  it('answering a queued problem correctly pushes its due date out', () => {
    const { recordAttempt } = useProgress.getState();
    recordAttempt('6.G.003', false); // enters queue, box 0, due today
    setToday('2026-05-02');
    recordAttempt('6.G.003', true); // reviewed correctly → box 1, +1 day
    const stat = useProgress.getState().problemStats['6.G.003'];
    expect(stat.box).toBe(1);
    expect(stat.due).toBe('2026-05-03');
  });
});

describe('dueReviewCount', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-10');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('counts only problems whose due date is today or earlier', () => {
    useProgress.setState({
      problemStats: {
        a: { attempts: 1, correct: 0, lastResult: 'wrong', lastSeen: '2026-05-09', box: 0, due: '2026-05-10' }, // due today
        b: { attempts: 1, correct: 0, lastResult: 'wrong', lastSeen: '2026-05-05', box: 0, due: '2026-05-06' }, // overdue
        c: { attempts: 2, correct: 1, lastResult: 'correct', lastSeen: '2026-05-10', box: 1, due: '2026-05-20' }, // future
        d: { attempts: 5, correct: 5, lastResult: 'correct', lastSeen: '2026-05-10', box: 5, due: null }, // graduated
      },
    });
    expect(useProgress.getState().dueReviewCount()).toBe(2);
  });
});

describe('recordMockTestResult — RIT history', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('appends a RIT point when a rit value is supplied', () => {
    useProgress.getState().recordMockTestResult(0.8, 221);
    const hist = useProgress.getState().ritHistory;
    expect(hist).toHaveLength(1);
    expect(hist[0]).toEqual({ date: '2026-05-01', rit: 221, accuracy: 0.8 });
  });

  it('does not append when rit is omitted (back-compat)', () => {
    useProgress.getState().recordMockTestResult(0.6);
    expect(useProgress.getState().ritHistory).toHaveLength(0);
  });
});

describe('markLessonViewed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
    freshState();
  });
  afterEach(() => vi.useRealTimers());

  it('records a lesson key once, idempotently', () => {
    const { markLessonViewed } = useProgress.getState();
    markLessonViewed('6.RP-1');
    markLessonViewed('6.RP-1');
    markLessonViewed('6.NS-2');
    expect(useProgress.getState().lessonsViewed).toEqual(['6.RP-1', '6.NS-2']);
  });
});

describe('v5 → v6 migration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setToday('2026-05-01');
  });
  afterEach(() => vi.useRealTimers());

  it('seeds new v6 fields and the SRS queue from legacy missedProblemIds', () => {
    const legacy = {
      byDomain: {
        '6.RP': { unitsUnlocked: 2, unitStars: { 1: 3 }, missedProblemIds: ['6.RP.001', '6.RP.002'] },
        '6.NS': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
        '6.EE': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: ['6.EE.009'] },
        '6.G': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
        '6.SP': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
      },
      xp: 100,
    };
    const migrated = migrateProgress(legacy, 5) as {
      problemStats: Record<string, { box: number; due: string | null }>;
      ritHistory: unknown[];
      lessonsViewed: unknown[];
    };
    expect(migrated.ritHistory).toEqual([]);
    expect(migrated.lessonsViewed).toEqual([]);
    expect(Object.keys(migrated.problemStats).sort()).toEqual(['6.EE.009', '6.RP.001', '6.RP.002']);
    expect(migrated.problemStats['6.RP.001']).toMatchObject({ box: 0, due: '2026-05-01' });
  });
});
