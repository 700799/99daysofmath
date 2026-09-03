import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { useAuth } from '../state/auth';
import { Avatar } from './AccountCard';
import { LevelBadge } from './LevelBadge';
import { XpFlash } from './XpFlash';
import { MasteryCelebration } from '../routes/arcade/MasteryCelebration';
import { submitHaptic, tapHaptic, successHaptic } from '../utils/haptics';
import { playClick, playAdvance } from '../utils/sound';
import { useThemeSync } from '../hooks/useTheme';
import { parentOf } from '../utils/navHierarchy';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  useThemeSync();
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
  // Back goes one level up the app's own hierarchy — a drill to its unit, a
  // game to the arcade — rather than always dumping you on Home. Null on Home.
  const parent = parentOf(location.pathname);

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

  // Energize EVERY button, app-wide: a soft fx click + a light haptic on any
  // tap, a punchier cue for Submit/Check, and a rising "advance" whoosh for
  // Next / Continue / Start / Replay / Play again. Both channels are gated by
  // their settings (soundEnabled / hapticsEnabled). Cheap and universal — no
  // per-route or per-button edits needed. (Works under HashRouter: no path
  // check, so the fx fires everywhere, not just /arcade.)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('button, [role="button"], a[href]');
      if (!target || (target as HTMLButtonElement).disabled) return;

      let sound = true;
      let haptics = true;
      try {
        const st = useProgress.getState();
        sound = st.soundEnabled;
        haptics = st.hapticsEnabled;
      } catch {
        /* store not ready — default on */
      }

      const explicit = (target as HTMLElement).dataset.haptic;
      const txt = (target.textContent || '').trim().toLowerCase();
      const isSubmit = explicit === 'submit' || txt.startsWith('submit') || txt.startsWith('check');
      const isAdvance =
        explicit === 'advance' ||
        txt.startsWith('next') ||
        txt.startsWith('continue') ||
        txt.startsWith('replay') ||
        txt.startsWith('try again') ||
        txt.startsWith('play again') ||
        txt.startsWith('start') ||
        txt.startsWith('resume') ||
        txt.startsWith('finish') ||
        txt.startsWith('let’s go') ||
        txt.startsWith("let's go");

      if (sound) {
        try {
          if (isAdvance) playAdvance();
          else playClick();
        } catch {
          /* ignore */
        }
      }
      if (haptics) {
        if (isSubmit) submitHaptic();
        else if (isAdvance) successHaptic();
        else tapHaptic();
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div
      className="flex flex-col bg-canvas"
      style={{ minHeight: '100dvh' }}
    >
      <header
        className="sticky top-0 z-30 bg-surface/85 backdrop-blur border-b border-line"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {!parent ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-ink truncate">
                99 Days of Math
              </span>
            </div>
          ) : (
            // shrink-0: getting out of a screen matters more than the stats
            // badge keeping its full width, so the badge absorbs the squeeze.
            <div className="flex shrink-0 items-center gap-0.5">
              <Link
                to={parent.to}
                aria-label={`Back to ${parent.label}`}
                className="flex items-center gap-1 min-h-11 text-ink-muted hover:text-ink"
              >
                <span className="text-2xl shrink-0">←</span>
                <span className="font-display font-semibold whitespace-nowrap">{parent.label}</span>
              </Link>
              {/* Retargeting back one level would otherwise put Home two or
                  three taps away, so it keeps a shortcut of its own. */}
              {parent.to !== '/' && (
                <Link
                  to="/"
                  aria-label="Home"
                  title="Home"
                  className="shrink-0 inline-flex items-center justify-center min-h-11 px-1.5 text-base leading-none text-ink-dim hover:text-ink"
                >
                  🏠
                </Link>
              )}
            </div>
          )}
          <div className="flex min-w-0 items-center gap-1.5">
            <StatsBadge />
            {dailyStreak > 0 && (
              <span
                className="inline-flex items-center gap-1 bg-warn-soft text-warn px-2 py-1 rounded-full font-display font-bold text-xs tabular-nums"
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
      <MasteryCelebration />
    </div>
  );
}

function fmtDur(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}` : `${m}:${pad(sec)}`;
}

// Always-visible tracker: total study time, total game time, and the achievement
// bonus earned from correct answers — so kids are rewarded for time and accuracy.
function StatsBadge() {
  const study = useProgress((s) => s.cumLessonSeconds);
  const game = useProgress((s) => s.cumArcadeSeconds);
  const ach = useProgress((s) => s.achievementPoints);
  return (
    <div
      className="inline-flex items-center gap-1.5 bg-surface-2 border border-line rounded-full px-2 py-1 font-mono font-medium text-[11px] tabular-nums"
      aria-label={`Study ${fmtDur(study)}, game ${fmtDur(game)}, achievement bonus ${ach}`}
      title="Study time · Game time · Achievement bonus"
    >
      <span className="text-ink-muted">📚 {fmtDur(study)}</span>
      <span className="text-ink-muted">🎮 {fmtDur(game)}</span>
      <span className="text-warn">🏆 {ach}</span>
    </div>
  );
}
