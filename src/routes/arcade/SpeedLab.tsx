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
          const xp = Math.max(2, Math.min(22, cleared * 2));
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
        <span>STAGE {level}/10</span>
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

            <div className="mt-4 grid gap-2 font-mono text-base font-bold">
              <div className="rounded-lg bg-slate-800 px-3 py-2"><span className="text-amber-400">d</span> = r × t <span className="text-slate-400 text-sm">→ side by side, multiply</span></div>
              <div className="rounded-lg bg-slate-800 px-3 py-2"><span className="text-amber-400">r</span> = d ÷ t <span className="text-slate-400 text-sm">→ top over bottom, divide</span></div>
              <div className="rounded-lg bg-slate-800 px-3 py-2"><span className="text-amber-400">t</span> = d ÷ r <span className="text-slate-400 text-sm">→ top over bottom, divide</span></div>
            </div>

            <div className="mt-4 text-sm font-display font-extrabold uppercase tracking-wide text-cyan-300">Worked examples</div>
            <div className="mt-2 grid gap-2 font-mono text-sm leading-snug text-cyan-100">
              {[
                ['🚴', 'Biker: 3 units/s for 2 s', 'd = 3 × 2 = 6 units'],
                ['🐢', 'Turtle: 8 units at 2 units/s', 't = 8 ÷ 2 = 4 s'],
                ['👶', 'Baby: 6 units in 3 s', 'r = 6 ÷ 3 = 2 units/s'],
                ['⛵', 'Boat: 4 units/s for 2 s', 'd = 4 × 2 = 8 units'],
                ['🦖', 'Dino: 40 units at 5 units/s', 't = 40 ÷ 5 = 8 s'],
                ['🚀', 'Rocket: 10 units/s for 5 s', 'd = 10 × 5 = 50 units'],
                ['🤼', 'Sumo: 36 units in 6 s', 'r = 36 ÷ 6 = 6 units/s'],
                ['🐟', 'Fish: 60 units at 10 units/s', 't = 60 ÷ 10 = 6 s'],
                ['🏎️', 'Race car: 60 units in 5 s', 'r = 60 ÷ 5 = 12 units/s'],
                ['🚆', 'Train: 20 units/s for 4 s', 'd = 20 × 4 = 80 units'],
                ['🚗', 'Real life: 60 mph for 2 h', 'd = 60 × 2 = 120 miles'],
                ['🏃', 'Real life: 100 m in 20 s', 'r = 100 ÷ 20 = 5 m/s'],
              ].map(([e, q, a], i) => (
                <div key={i} className="rounded-lg bg-slate-800/70 px-3 py-2">
                  <div className="text-slate-300">{e} {q}</div>
                  <div className="font-bold text-white">{a}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
