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
        className="inline-flex items-center gap-2 bg-surface-2 border border-line rounded-full pl-1 pr-3 py-1 hover:border-line-strong transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-accent text-on-accent font-display font-extrabold text-sm flex items-center justify-center shadow-inner shrink-0">
          {info.level}
        </span>
        <div className="leading-tight">
          <div className="text-[9px] font-display font-extrabold uppercase tracking-wider text-warn">
            Lv {info.level}
          </div>
          <div className="text-xs font-display font-extrabold text-warn tabular-nums">
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
      className="fixed z-40 bottom-3 right-3 bg-surface/90 backdrop-blur border-2 border-line shadow-lg rounded-2xl px-3 py-2 hover:bg-surface transition-colors"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-accent text-on-accent font-display font-extrabold text-sm flex items-center justify-center shadow-inner">
          {info.level}
        </span>
        <div className="leading-tight">
          <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-ink-dim">
            Level {info.level}
          </div>
          <div className="text-xs font-display font-extrabold text-ink tabular-nums">
            ⚡ {xp} XP
          </div>
        </div>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-surface-2 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${Math.round(info.progress * 100)}%` }}
        />
      </div>
    </Link>
  );
}
