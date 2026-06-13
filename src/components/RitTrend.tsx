import { useProgress } from '../state/progress';

interface Props {
  className?: string;
}

// Compact SVG sparkline of estimated RIT across mock tests — the MAP "growth" view.
export function RitTrend({ className }: Props) {
  const history = useProgress((s) => s.ritHistory);

  if (history.length < 2) {
    return (
      <div
        className={[
          'rounded-2xl border-2 border-slate-200 bg-white p-4 text-center',
          className ?? '',
        ].join(' ')}
      >
        <div className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
          RIT growth
        </div>
        <div className="text-sm text-slate-600 mt-1">
          {history.length === 0
            ? 'Take a mock test to start tracking your growth.'
            : 'One test logged — take another to see your trend.'}
        </div>
      </div>
    );
  }

  const pts = history.slice(-12);
  const rits = pts.map((p) => p.rit);
  const latest = rits[rits.length - 1];
  const delta = latest - rits[0];

  const W = 300;
  const H = 96;
  const PAD = 10;
  const lo = Math.min(...rits) - 3;
  const hi = Math.max(...rits) + 3;
  const span = Math.max(1, hi - lo);
  const x = (i: number) =>
    PAD + (i * (W - 2 * PAD)) / Math.max(1, pts.length - 1);
  const y = (rit: number) => H - PAD - ((rit - lo) / span) * (H - 2 * PAD);
  const line = pts.map((p, i) => `${x(i)},${y(p.rit)}`).join(' ');

  return (
    <div
      className={[
        'rounded-2xl border-2 border-slate-200 bg-white p-4',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between">
        <div className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
          RIT growth
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-display font-extrabold text-slate-900 tabular-nums">
            ~{latest}
          </span>
          <span
            className={`text-xs font-display font-extrabold ${
              delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            {delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : '—'}
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full mt-2"
        role="img"
        aria-label={`RIT estimate trend, latest ${latest}`}
        preserveAspectRatio="none"
      >
        <polyline
          points={line}
          fill="none"
          stroke="#1CB0F6"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.rit)} r={3.5} fill="#1CB0F6" />
        ))}
      </svg>
      <div className="text-[10px] text-slate-400 mt-1">
        Estimate across your last {pts.length} mock tests — not an official MAP score.
      </div>
    </div>
  );
}
