import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { TrailScene, TRAIL_WIDTH, TRAIL_HEIGHT } from '../phaser/TrailScene';
import { useProgress } from '../state/progress';
import type { Domain } from '../types/problem';

interface Props {
  domain: Domain;
  units: number[];
}

export function TrailMount({ domain, units }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const navigate = useNavigate();
  const dp = useProgress((s) => s.byDomain[domain]);

  useEffect(() => {
    if (!containerRef.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: TRAIL_WIDTH,
      height: TRAIL_HEIGHT,
      backgroundColor: '#F8FAFC',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [TrailScene],
      banner: false,
      // @ts-expect-error: legacy resolution option
      resolution: window.devicePixelRatio,
    });
    gameRef.current = game;
    game.scene.start('TrailScene', {
      domain,
      state: {
        unitsUnlocked: dp?.unitsUnlocked ?? 1,
        unitStars: dp?.unitStars ?? {},
      },
      onNodeSelect: (unit: number) => navigate(`/unit/${domain}/${unit}`),
    });
    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
    // Mount-once: the scene reads progress at init. Re-render not needed for first cut.
    // Progress changes after a unit completes are reflected when user returns to this route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  return (
    <div className="flex flex-col items-center">
      <div
        ref={containerRef}
        className="w-full max-w-md aspect-[2/3] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200"
        aria-hidden="true"
      />
      {/* Accessibility fallback: keyboard/screen-reader navigation */}
      <ul className="sr-only">
        {units.map((u) => (
          <li key={u}>
            <a href={`#/unit/${domain}/${u}`}>Unit {u}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
