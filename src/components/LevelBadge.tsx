import { Link } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { levelForXp } from '../utils/levels';

interface Props {
  /** "floating" pins bottom-right (default for any orphan use).
   *  "header" renders an inline compact pill, no fixed positioning. */
  variant?: 'floating' | 'header';
}

// Always-visible level + XP badge. Two visual variants share the same data.
export function LevelBadge({ variant = 'floating' }: Props) {
  const xp = useProgress((s) => s.xp);
  const info = levelForXp(xp);

  if (variant === 'header') {
    return (
      <Link
        to="/report"
        aria-label={`Level ${info.level}, ${xp} XP. Open progress report.`}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-200 rounded-full pl-1 pr-3 py-1 hover:from-amber-200 hover:to-orange-200 transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-white font-display font-extrabold text-sm flex items-center justify-center shadow-inner shrink-0">
          {info.level}
        </span>
        <div className="leading-tight">
          <div className="text-[9px] font-display font-extrabold uppercase tracking-wider text-orange-700">
            Lv {info.level}
          </div>
          <div className="text-xs font-display font-extrabold text-orange-900 tabular-nums">
            ⚡ {xp}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/report"
      aria-label={`Level ${info.level}, ${xp} XP. Open progress report.`}
      className="fixed z-40 bottom-3 right-3 bg-white/90 backdrop-blur border-2 border-slate-200 shadow-lg rounded-2xl px-3 py-2 hover:bg-white transition-colors"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-white font-display font-extrabold text-sm flex items-center justify-center shadow-inner">
          {info.level}
        </span>
        <div className="leading-tight">
          <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-400">
            Level {info.level}
          </div>
          <div className="text-xs font-display font-extrabold text-slate-800 tabular-nums">
            ⚡ {xp} XP
          </div>
        </div>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
          style={{ width: `${Math.round(info.progress * 100)}%` }}
        />
      </div>
    </Link>
  );
}
