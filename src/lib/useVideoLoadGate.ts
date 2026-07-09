import { useEffect, useRef, useState, type RefObject } from 'react';
import { useProgress } from '../state/progress';

/**
 * A "watch-a-moment-before-you-advance" gate for the lesson videos and the
 * math-stories player. The Continue / Next button stays LOCKED until the
 * underlying <video> can actually play, and then for a further `ms` (default
 * 2s). This stops kids from clicking straight past a video before it has even
 * appeared.
 *
 * - `dep` re-arms the gate whenever it changes (a new slide / a fresh open).
 * - The admin's `lessonScreenSeconds <= 0` "off" switch (unlimited / passcode
 *   mode) bypasses the gate entirely, matching the rest of the app's gates.
 * - Fail-open: if the video never reports it can play within `maxWaitMs`
 *   (a stall or a failed download), we unlock anyway so a child is never
 *   permanently trapped.
 *
 * Returns `locked` — true while the button should be disabled.
 */
export function useVideoLoadGate(
  videoRef: RefObject<HTMLVideoElement | null>,
  dep: unknown,
  { ms = 2000, maxWaitMs = 8000 }: { ms?: number; maxWaitMs?: number } = {},
): boolean {
  // 0 (or less) disables every read/watch gate in the app — honor it here too.
  const gatesOff = useProgress((s) => (s.arcadeConfig.lessonScreenSeconds ?? 6) <= 0);
  const [locked, setLocked] = useState(!gatesOff);

  useEffect(() => {
    if (gatesOff) {
      setLocked(false);
      return;
    }
    setLocked(true);
    const v = videoRef.current;

    let unlockTimer: number | null = null;
    let ceilingTimer: number | null = null;
    let armed = false;

    const clearAll = () => {
      if (unlockTimer !== null) window.clearTimeout(unlockTimer);
      if (ceilingTimer !== null) window.clearTimeout(ceilingTimer);
      unlockTimer = ceilingTimer = null;
    };

    // Once the video can play (or we give up waiting), delay `ms` then unlock.
    const arm = () => {
      if (armed) return;
      armed = true;
      unlockTimer = window.setTimeout(() => setLocked(false), ms);
    };

    // Fail-open ceiling so a stalled / failed load never traps the child.
    ceilingTimer = window.setTimeout(arm, maxWaitMs);

    if (!v) {
      arm(); // no element yet — just honor the delay
      return clearAll;
    }

    // HAVE_FUTURE_DATA (3) = can play forward from here.
    if (v.readyState >= 3) {
      arm();
    } else {
      const onReady = () => arm();
      v.addEventListener('canplay', onReady);
      v.addEventListener('loadeddata', onReady);
      v.addEventListener('playing', onReady);
      return () => {
        v.removeEventListener('canplay', onReady);
        v.removeEventListener('loadeddata', onReady);
        v.removeEventListener('playing', onReady);
        clearAll();
      };
    }

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, gatesOff, ms, maxWaitMs]);

  return locked;
}
