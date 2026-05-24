interface Props {
  current: number;
  goal: number;
  size?: number;
  compact?: boolean;
}

// Circular progress ring showing today's XP toward the daily goal.
export function DailyQuestRing({ current, goal, size = 44, compact = false }: Props) {
  const pct = goal > 0 ? Math.min(1, current / goal) : 0;
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const done = pct >= 1;
  const offset = c * (1 - pct);

  return (
    <div className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Daily goal ${current} of ${goal} XP`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={done ? '#58CC02' : '#FF9600'}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={size * 0.32}
        >
          {done ? '✅' : '⚡'}
        </text>
      </svg>
      {!compact && (
        <div className="leading-tight">
          <div className="text-xs font-display font-bold text-slate-500 uppercase tracking-wider">
            Daily goal
          </div>
          <div className="font-display font-extrabold text-slate-800 text-sm tabular-nums">
            {current} / {goal} XP
          </div>
        </div>
      )}
    </div>
  );
}
