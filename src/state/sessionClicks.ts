import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionClicksState {
  /** ISO date the count belongs to.  Auto-resets when a new day starts. */
  date: string | null;
  /** Clicks made on the current date. */
  count: number;
  bump: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Tiny per-day click counter — every button / link / role=button press in
 * the app bumps it.  Surfaces as the "👆 N" chip in the top header so the
 * kid (and parent) can see activity at a glance.  The user explicitly
 * asked for "Measure time on app spent at the top. Click to click counts.
 * Measure by points not time actually" — this is the points-based metric.
 */
export const useSessionClicks = create<SessionClicksState>()(
  persist(
    (set, get) => ({
      date: null,
      count: 0,
      bump: () => {
        const today = todayIso();
        const s = get();
        if (s.date !== today) {
          set({ date: today, count: 1 });
        } else {
          set({ count: s.count + 1 });
        }
      },
    }),
    {
      name: '99daysofmath:session-clicks',
      version: 1,
    },
  ),
);
