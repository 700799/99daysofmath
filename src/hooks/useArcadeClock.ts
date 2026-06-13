import { useEffect } from 'react';
import { useProgress } from '../state/progress';

/**
 * Ticks the daily arcade-play counter while an arcade game is on screen.
 * Pauses when `paused` is true (end-card showing) or when the tab is hidden.
 */
export function useArcadeClock(paused = false): void {
  const tick = useProgress((s) => s.tickArcadeSeconds);

  useEffect(() => {
    if (paused) return;
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id != null) return;
      id = setInterval(() => tick(1), 1000);
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
  }, [paused, tick]);
}
