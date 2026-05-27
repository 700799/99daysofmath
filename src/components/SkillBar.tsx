import type { SkillStat } from '../utils/mastery';

const LEVEL_META = {
  strong: { label: 'Strong', bar: 'bg-green-500', chip: 'bg-green-100 text-green-800' },
  'on-track': { label: 'On track', bar: 'bg-sky-500', chip: 'bg-sky-100 text-sky-800' },
  'needs-work': { label: 'Needs work', bar: 'bg-orange-500', chip: 'bg-orange-100 text-orange-800' },
  unassessed: { label: 'Not assessed', bar: 'bg-slate-300', chip: 'bg-slate-100 text-slate-500' },
} as const;

export function SkillBar({ stat }: { stat: SkillStat }) {
  const meta = LEVEL_META[stat.level];
  const pct = Math.round(stat.accuracy * 100);
  const assessed = stat.level !== 'unassessed';
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-display font-bold text-slate-800 truncate">
          {stat.label}
        </div>
        <span
          className={`shrink-0 text-[10px] font-display font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.chip}`}
        >
          {assessed ? `${pct}% · ${meta.label}` : meta.label}
        </span>
      </div>
      <div className="mt-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full ${meta.bar} rounded-full transition-all`}
          style={{ width: assessed ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  );
}
