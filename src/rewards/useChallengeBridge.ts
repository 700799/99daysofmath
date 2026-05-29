import { useCallback, useEffect, useRef, useState } from 'react';
import type { Challenge } from './mathChallenge';

/**
 * Bridges a Phaser scene that needs the player to answer a math question with a
 * React modal. The scene calls `onChallenge(c)` and awaits the returned promise;
 * the UI renders `challenge` and calls `resolve(correct)` to settle it.
 */
export function useChallengeBridge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const resolver = useRef<((correct: boolean) => void) | null>(null);

  const onChallenge = useCallback(
    (c: Challenge) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setChallenge(c);
      }),
    [],
  );

  const resolve = useCallback((correct: boolean) => {
    setChallenge(null);
    const r = resolver.current;
    resolver.current = null;
    r?.(correct);
  }, []);

  // If the game tears down mid-question, settle the pending promise so the
  // scene's await never dangles.
  useEffect(
    () => () => {
      resolver.current?.(false);
      resolver.current = null;
    },
    [],
  );

  return { challenge, onChallenge, resolve };
}
