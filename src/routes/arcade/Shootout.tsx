import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';

const SHOTS = 5;
// The power bar oscillates; tapping inside the green zone scores.
const ZONE_START = 0.38;
const ZONE_END = 0.62;

type ShotResult = 'made' | 'missed';

export function Shootout() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [power, setPower] = useState(0);
  const [shots, setShots] = useState<ShotResult[]>([]);
  const [ballFlight, setBallFlight] = useState<ShotResult | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const dirRef = useRef(1);
  const rafRef = useRef(0);
  const doneRef = useRef(false);

  const running = shots.length < SHOTS && !ballFlight && !outcome;

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPower((p) => {
        let next = p + dirRef.current * dt * 1.4;
        if (next >= 1) {
          next = 1;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const shoot = () => {
    if (!running) return;
    const made = power >= ZONE_START && power <= ZONE_END;
    setBallFlight(made ? 'made' : 'missed');
    setTimeout(() => {
      const next = [...shots, made ? ('made' as const) : ('missed' as const)];
      setShots(next);
      setBallFlight(null);
      if (next.length === SHOTS && !doneRef.current) {
        doneRef.current = true;
        const makes = next.filter((s) => s === 'made').length;
        const baseXp = makes + (makes === SHOTS ? 3 : 0); // perfect round bonus
        setOutcome(recordArcadePlay('shootout', Math.max(1, baseXp)));
      }
    }, 900);
  };

  const reset = () => {
    setShots([]);
    setBallFlight(null);
    setOutcome(null);
    setPower(0);
    dirRef.current = 1;
    doneRef.current = false;
  };

  const makes = shots.filter((s) => s === 'made').length;

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Shootout" emoji="🏀" />
        <ArcadeEndCard
          gameId="shootout"
          outcome={outcome}
          win={makes >= 4}
          scoreLine={`${makes} / ${SHOTS} buckets!${makes === SHOTS ? ' PERFECT! 🔥' : ''}`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Shootout" emoji="🏀" />
      <p className="text-sm text-slate-600 mb-2">
        Tap <b>SHOOT</b> when the slider is in the green zone. {SHOTS} shots!
      </p>

      {/* scoreboard */}
      <div className="flex justify-center gap-1.5 mb-4">
        {Array.from({ length: SHOTS }).map((_, i) => (
          <span key={i} className="text-2xl">
            {i < shots.length ? (shots[i] === 'made' ? '✅' : '❌') : '⚪'}
          </span>
        ))}
      </div>

      {/* court */}
      <div className="relative max-w-sm mx-auto h-44 bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl border-2 border-slate-200 overflow-hidden">
        <div className="absolute right-6 top-4 text-4xl" aria-hidden="true">🏀🥅</div>
        <div className="absolute right-7 top-12 w-10 h-1.5 bg-orange-500 rounded-full" />
        <motion.div
          key={`${shots.length}-${ballFlight ?? 'idle'}`}
          className="absolute bottom-3 left-8 text-4xl"
          animate={
            ballFlight === 'made'
              ? { x: [0, 110, 215], y: [0, -120, -78], rotate: 360 }
              : ballFlight === 'missed'
                ? { x: [0, 110, 230], y: [0, -130, -20], rotate: 360 }
                : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ duration: 0.85, ease: 'easeOut' }}
          aria-hidden="true"
        >
          🏀
        </motion.div>
        {ballFlight === 'made' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-16 text-lg font-display font-extrabold text-green-600"
          >
            SWISH!
          </motion.div>
        )}
      </div>

      {/* power bar */}
      <div className="max-w-sm mx-auto mt-4">
        <div className="relative h-7 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden">
          <div
            className="absolute top-0 bottom-0 bg-green-200"
            style={{ left: `${ZONE_START * 100}%`, width: `${(ZONE_END - ZONE_START) * 100}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-slate-900 rounded-full"
            style={{ left: `calc(${power * 100}% - 3px)` }}
          />
        </div>
        <button
          type="button"
          onClick={shoot}
          disabled={!running}
          className="mt-4 w-full min-h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-display font-extrabold text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
        >
          SHOOT! 🏀
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          +1 XP per bucket, +3 bonus for a perfect 5/5.
        </p>
      </div>
    </div>
  );
}
