import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Speed Lab — a Phaser 3 (Arcade Physics) driving sim that teaches d = r × t.
// The React shell carries the "Aerospace Syllabus" chrome; the Phaser canvas runs
// the physics, telemetry and the three sequential challenges.

const CANVAS_W = 820;
const CANVAS_H = 480;

export function SpeedLab() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const containerRef = useRef<HTMLDivElement>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const [runId, setRunId] = useState(0);
  const [level, setLevel] = useState(1);
  useArcadeClock(!!outcome);

  useEffect(() => {
    if (outcome || !containerRef.current) return;
    let game: { destroy: (b: boolean) => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: Phaser }, { SpeedLabScene }] = await Promise.all([
        import('phaser'),
        import('../../phaser/SpeedLabScene'),
      ]);
      if (cancelled || !containerRef.current) return;

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: CANVAS_W,
        height: CANVAS_H,
        backgroundColor: '#0b1220',
        physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [SpeedLabScene],
        banner: false,
      });
      (game as unknown as { scene: { start: (k: string, d: unknown) => void } }).scene.start('SpeedLabScene', {
        onLevel: (lv: number) => setLevel(lv),
        onComplete: (cleared: number) => {
          const xp = Math.max(1, Math.min(20, cleared * 6));
          setOutcome(recordArcadePlay('speedlab', xp));
        },
      });
    })().catch((e) => console.error('Failed to load Speed Lab:', e));

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, outcome]);

  const reset = () => {
    setOutcome(null);
    setLevel(1);
    setRunId((n) => n + 1);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Speed Lab" emoji="🚀" />
        <ArcadeEndCard
          gameId="speedlab"
          outcome={outcome}
          win
          scoreLine="Mission complete — d = r × t mastered! 🛰️"
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Speed Lab" emoji="🚀" />
      {/* aerospace-syllabus mission strip */}
      <div className="mx-auto mb-2 flex max-w-3xl items-center justify-between rounded-lg border border-cyan-700/60 bg-slate-900 px-3 py-1.5 font-mono text-xs text-cyan-300">
        <span className="font-bold text-amber-400">MISSION: d = r × t</span>
        <span>STAGE {level}/3</span>
        <span className="text-rose-400">● LIVE TELEMETRY</span>
      </div>
      <div
        ref={containerRef}
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border-2 border-cyan-800 shadow-[0_0_30px_rgba(56,189,248,0.15)]"
        role="img"
        aria-label="Speed Lab driving simulator: solve for rate, time, and distance."
      />
      <p className="mx-auto mt-2 max-w-3xl text-center font-mono text-xs text-slate-500">
        Tap a value to launch the car. Watch the telemetry — distance = rate × time.
      </p>
    </div>
  );
}
