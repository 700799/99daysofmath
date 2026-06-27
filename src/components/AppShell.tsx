import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { useAuth } from '../state/auth';
import { Avatar } from './AccountCard';
import { LevelBadge } from './LevelBadge';
import { XpFlash } from './XpFlash';
import { submitHaptic, tapHaptic } from '../utils/haptics';

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
  const user = useAuth((s) => s.user);
  const tickAppSeconds = useProgress((s) => s.tickAppSeconds);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';

  // Track lifetime time-on-app (paused while the tab is hidden).
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id == null) id = setInterval(() => tickAppSeconds(1), 1000);
    };
    const stop = () => {
      if (id != null) {
        clearInterval(id);
        id = null;
      }
    };
    if (!document.hidden) start();
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
  }, [tickAppSeconds]);

  // Wire global haptics for buttons. Opt-in via `data-haptic="tap|submit"`.
  // Also auto-detect by text — "Submit"/"Check"/"Continue"/"Next" trigger a
  // soft tap even if the markup doesn't carry the attribute. Cheap and
  // universal; no per-route edits needed.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('button, [role="button"]');
      if (!target) return;
      const explicit = (target as HTMLElement).dataset.haptic;
      if (explicit === 'submit') {
        submitHaptic();
        return;
      }
      if (explicit === 'tap') {
        tapHaptic();
        return;
      }
      const txt = (target.textContent || '').trim().toLowerCase();
      if (
        txt.startsWith('submit') ||
        txt.startsWith('check') ||
        txt === 'check answer'
      ) {
        submitHaptic();
      } else if (
        txt.startsWith('next') ||
        txt.startsWith('continue') ||
        txt.startsWith('replay') ||
        txt.startsWith('try again')
      ) {
        tapHaptic();
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

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
            {user && (
              <Link
                to="/settings"
                aria-label="Account"
                className="ml-0.5 inline-flex items-center min-h-11"
              >
                <Avatar user={user} size={32} />
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">{children}</main>
      <XpFlash />
    </div>
  );
}
