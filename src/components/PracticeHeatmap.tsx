interface Props {
  practiceDates: string[];
  xpByDate: Record<string, number>;
  days?: number; // how many days back to show (default 99)
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function intensityClass(xp: number, practiced: boolean): string {
  if (!practiced) return 'bg-surface-2';
  if (xp >= 60) return 'bg-green-600';
  if (xp >= 30) return 'bg-green-500';
  if (xp >= 10) return 'bg-green-400';
  return 'bg-green-300';
}

// A 99-cell calendar grid (oldest → today) showing practice intensity by XP.
export function PracticeHeatmap({ practiceDates, xpByDate, days = 99 }: Props) {
  const practicedSet = new Set(practiceDates);
  // Oldest first so "today" lands at the bottom-right.
  const cells = Array.from({ length: days }, (_, i) => {
    const iso = isoDaysAgo(days - 1 - i);
    return { iso, xp: xpByDate[iso] ?? 0, practiced: practicedSet.has(iso) };
  });
  const practicedCount = cells.filter((c) => c.practiced).length;

  return (
    <div className="mt-8 bg-surface rounded-3xl border-2 border-line p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl" aria-hidden="true">📅</span>
        <div>
          <div className="font-display font-extrabold text-ink">
            Practice calendar
          </div>
          <div className="text-xs text-ink-muted">
            {practicedCount} of last {days} days
          </div>
        </div>
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(0, 1fr))', gridAutoRows: '1fr' }}
        role="img"
        aria-label={`Practiced ${practicedCount} of the last ${days} days`}
      >
        <div className="grid grid-cols-[repeat(11,minmax(0,1fr))] gap-1 w-full">
          {cells.map((c) => (
            <div
              key={c.iso}
              title={`${c.iso}${c.practiced ? ` · ${c.xp} XP` : ' · no practice'}`}
              className={`aspect-square rounded-[3px] ${intensityClass(c.xp, c.practiced)}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 justify-end text-xs text-ink-dim">
        <span>Less</span>
        <span className="w-3 h-3 rounded-[3px] bg-surface-2 inline-block" />
        <span className="w-3 h-3 rounded-[3px] bg-green-300 inline-block" />
        <span className="w-3 h-3 rounded-[3px] bg-green-400 inline-block" />
        <span className="w-3 h-3 rounded-[3px] bg-green-500 inline-block" />
        <span className="w-3 h-3 rounded-[3px] bg-green-600 inline-block" />
        <span>More</span>
      </div>
    </div>
  );
}
