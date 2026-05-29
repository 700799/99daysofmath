import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';

interface Props {
  /**
   * Builds and starts the Phaser game inside `parent`. Must be stable across
   * renders (wrap in useCallback) — the game is created once on mount and
   * destroyed on unmount.
   */
  boot: (parent: HTMLDivElement) => Phaser.Game;
  /** Sizing/appearance classes for the wrapper (give it width + aspect). */
  className?: string;
  /** Overlay UI (e.g. a challenge modal) rendered on top of the canvas. */
  children?: React.ReactNode;
}

/**
 * Hosts a Phaser game and overlays optional React UI on top of it. The canvas
 * fills the wrapper; overlay children are positioned by their own classes.
 */
export function GameCanvas({ boot, className = '', children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const game = boot(host);
    return () => {
      try {
        game.destroy(true);
      } catch {
        // Phaser occasionally throws while tearing down a WebGL context; the
        // container is being unmounted anyway, so swallow it.
      }
    };
    // boot is expected to be stable; intentionally mount-once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={hostRef}
        className="w-full h-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
