import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../state/progress';
import type { Domain } from '../types/problem';

interface Props {
  domain: Domain;
  units: number[];
}

const CANVAS_W = 480;
const CANVAS_H = 600;

export function TrailMount({ domain, units }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dp = useProgress((s) => s.byDomain[domain]);

  useEffect(() => {
    if (!containerRef.current) return;
    let game: { destroy: (b: boolean) => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: Phaser }, { TrailScene }] = await Promise.all([
        import('phaser'),
        import('../phaser/TrailScene'),
      ]);
      if (cancelled || !containerRef.current) return;

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: CANVAS_W,
        height: CANVAS_H,
        backgroundColor: '#F8FAFC',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [TrailScene],
        banner: false,
      });
      (game as unknown as { scene: { start: (k: string, d: unknown) => void } }).scene.start(
        'TrailScene',
        {
          domain,
          state: {
            unitsUnlocked: dp?.unitsUnlocked ?? 1,
            unitStars: dp?.unitStars ?? {},
          },
          units,
          onNodeSelect: (unit: number) => navigate(`/unit/${domain}/${unit}`),
        },
      );
    })().catch((e) => {
      console.error('Failed to load trail scene:', e);
    });

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  return (
    <div
      ref={containerRef}
      style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
      className="w-full max-w-sm mx-auto bg-gradient-to-b from-sky-100 to-emerald-50 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-inner"
      role="img"
      aria-label={`${units.length}-unit trail for ${domain}. Use the unit list below to start a unit.`}
    />
  );
}
