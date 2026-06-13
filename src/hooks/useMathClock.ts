import { useEffect } from 'react';
import { useProgress } from '../state/progress';

/**
 * Ticks the "math toward unlock" counter while a math route is on screen.
 * No-ops when the arcade isn't currently locked — the counter only earns
 * credit while the player is paying down the lockout.
 */
export function useMathClock(paused = false): void {
  const tick = useProgress((s) => s.tickMathSeconds);
  const isLocked = useProgress((s) => s.isArcadeLocked);

  useEffect(() => {
    if (paused) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id != null) return;
      id = setInterval(() => {
        if (isLocked()) tick(1);
      }, 1000);
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
  }, [paused, tick, isLocked]);
}
