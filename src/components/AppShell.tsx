import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { LevelBadge } from './LevelBadge';
import { XpFlash } from './XpFlash';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  const dailyStreak = useProgress((s) => s.dailyStreak);
  const usedFreezeRecently = useProgress((s) => {
    if (!s.lastFreezeDate) return false;
    const today = new Date();
    const f = new Date(s.lastFreezeDate + 'T00:00:00Z');
    return Math.round((today.getTime() - f.getTime()) / 86400000) <= 7;
  });
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';

  return (
    <div
      className="flex flex-col bg-gradient-to-b from-sky-50 via-amber-50 to-white"
      style={{ minHeight: '100dvh' }}
    >
      <header
        className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b-2 border-slate-200"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {isHome ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl" aria-hidden="true">🦉</span>
              <span className="font-display font-extrabold text-lg sm:text-xl text-slate-900 truncate">
                99 Days of Math
              </span>
            </div>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 min-h-11"
            >
              <span className="text-2xl">←</span>
              <span className="font-display font-bold">Home</span>
            </Link>
          )}
          <div className="flex items-center gap-1.5">
            {dailyStreak > 0 && (
              <span
                className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 px-2 py-1 rounded-full font-display font-extrabold text-xs tabular-nums"
                aria-label={`Streak: ${dailyStreak} day${dailyStreak === 1 ? '' : 's'}`}
              >
                {usedFreezeRecently ? '🧊' : '🔥'} {dailyStreak}
              </span>
            )}
            <LevelBadge variant="header" />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">{children}</main>
      <XpFlash />
    </div>
  );
}
