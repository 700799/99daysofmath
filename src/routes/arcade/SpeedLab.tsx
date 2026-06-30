import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Speed Lab — a Phaser 3 (Arcade Physics) driving sim that teaches d = r × t.
// The React shell carries the "Aerospace Syllabus" chrome; the Phaser canvas runs
// the physics, telemetry and the three sequential challenges.

const CANVAS_W = 560;
const CANVAS_H = 780;

export function SpeedLab() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const containerRef = useRef<HTMLDivElement>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const [runId, setRunId] = useState(0);
  const [level, setLevel] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const gameRef = useRef<{ destroy: (b: boolean) => void; scene: { pause: (k: string) => void; resume: (k: string) => void } } | null>(null);
  useArcadeClock(!!outcome);

  // opening the formula drawer freezes the Phaser scene so the car/clock wait
  const openDrawer = () => { gameRef.current?.scene.pause('SpeedLabScene'); setDrawer(true); };
  const closeDrawer = () => { gameRef.current?.scene.resume('SpeedLabScene'); setDrawer(false); };

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
      gameRef.current = game as unknown as typeof gameRef.current;
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
      gameRef.current = null;
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
      <ArcadeHeader title="Speed Lab" emoji="🚀" help={false} />
      {/* aerospace-syllabus mission strip */}
      <div className="mx-auto mb-2 flex max-w-sm items-center justify-between rounded-lg border border-cyan-700/60 bg-slate-900 px-3 py-1.5 font-mono text-xs text-cyan-300">
        <span className="font-bold text-amber-400">d = r × t</span>
        <span>STAGE {level}/3</span>
        <span className="text-rose-400">● LIVE</span>
      </div>
      <div
        ref={containerRef}
        style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border-2 border-cyan-800 shadow-[0_0_30px_rgba(56,189,248,0.15)]"
        role="img"
        aria-label="Speed Lab driving simulator: solve for rate, time, and distance."
      />
      <div className="mx-auto mt-2 max-w-sm flex items-center justify-between gap-2 px-1">
        <p className="font-mono text-xs text-slate-500">
          Tap a value to launch the car. distance = rate × time.
        </p>
        <button
          type="button"
          onClick={openDrawer}
          className="shrink-0 rounded-full border border-cyan-600/60 bg-slate-900 px-3 py-1.5 font-mono text-xs font-bold text-cyan-300 active:translate-y-0.5"
        >
          📖 Formula
        </button>
      </div>

      <FormulaDrawer open={drawer} onClose={closeDrawer} />
    </div>
  );
}

// A pull-up reference the player can open mid-game: the d/r/t triangle, the three
// rearrangements, and a quick worked example — so they never have to leave the run
// to remember which way to divide.
function FormulaDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-950/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-sm rounded-t-3xl border-2 border-b-0 border-cyan-700 bg-slate-900 p-5 pb-7 text-cyan-50 shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            role="dialog"
            aria-label="Speed formula helper"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-600" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-amber-400">Speed formula 📖</h2>
              <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 font-mono text-xs font-bold text-slate-400 hover:text-white">
                resume ✕
              </button>
            </div>
            <p className="mt-0.5 font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">⏸ game paused</p>

            {/* the triangle: d on top, r · t underneath */}
            <div className="mx-auto mt-3 w-40 text-center font-mono font-extrabold">
              <div className="rounded-xl border-2 border-cyan-600 bg-slate-800 py-2 text-2xl text-white">d</div>
              <div className="mt-1 grid grid-cols-2 gap-1">
                <div className="rounded-xl border-2 border-cyan-600 bg-slate-800 py-2 text-2xl text-white">r</div>
                <div className="rounded-xl border-2 border-cyan-600 bg-slate-800 py-2 text-2xl text-white">t</div>
              </div>
              <div className="mt-1 text-[11px] font-bold text-slate-400">cover the one you want</div>
            </div>

            <div className="mt-4 grid gap-2 font-mono text-sm font-bold">
              <div className="rounded-lg bg-slate-800 px-3 py-2"><span className="text-amber-400">d</span> = r × t <span className="text-slate-500">→ side by side, multiply</span></div>
              <div className="rounded-lg bg-slate-800 px-3 py-2"><span className="text-amber-400">r</span> = d ÷ t <span className="text-slate-500">→ top over bottom, divide</span></div>
              <div className="rounded-lg bg-slate-800 px-3 py-2"><span className="text-amber-400">t</span> = d ÷ r <span className="text-slate-500">→ top over bottom, divide</span></div>
            </div>

            <div className="mt-3 rounded-lg border border-cyan-700/60 bg-slate-800/60 px-3 py-2 font-mono text-xs text-cyan-200">
              Example: 60 mph for 2 h → d = 60 × 2 = <span className="font-bold text-white">120 miles</span>.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
