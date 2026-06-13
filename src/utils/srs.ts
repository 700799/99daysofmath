// Spaced-repetition scheduling using Leitner boxes.
// A problem enters the queue only when missed (box 0), then climbs a box on each
// correct review with widening intervals, and graduates out at the top box.

// Box 0 is due the same day (a fresh miss is reviewable immediately), then
// each successful review spaces the next one further out.
export const SRS_INTERVALS_DAYS = [0, 1, 3, 7, 15, 30];
export const SRS_MAX_BOX = 5;

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function intervalForBox(box: number): number {
  const i = Math.max(0, Math.min(box, SRS_INTERVALS_DAYS.length - 1));
  return SRS_INTERVALS_DAYS[i];
}

export interface ScheduleResult {
  box: number;
  due: string | null; // null = graduated, no longer in the review queue
}

// Compute the next box + due date from the previous box and this review's result.
export function scheduleAfter(
  prevBox: number,
  correct: boolean,
  today: string,
): ScheduleResult {
  if (!correct) {
    return { box: 0, due: addDaysISO(today, intervalForBox(0)) };
  }
  const nextBox = Math.min(prevBox + 1, SRS_MAX_BOX);
  if (nextBox >= SRS_MAX_BOX) {
    return { box: nextBox, due: null };
  }
  return { box: nextBox, due: addDaysISO(today, intervalForBox(nextBox)) };
}
