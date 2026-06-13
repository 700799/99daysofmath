import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// 30-second tap-to-score basketball. Each SHOOT tap fires a ball at the hoop.
// 80% of shots score by default + a small streak-of-misses sympathy bonus,
// so kids stay in flow on a phone. Goal: score TARGET baskets in 30 s.

const SESSION_SECONDS = 30;
const TARGET = 8;
const BASE_MAKE_RATE = 0.8;

type Shot = { id: number; made: boolean };

export function Shootout() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [makes, setMakes] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [shots, setShots] = useState<Shot[]>([]); // recent shot animations
  const [missStreak, setMissStreak] = useState(0);
  const shotIdRef = useRef(1);
  const tickRef = useRef<number | undefined>(undefined);
  const startedRef = useRef<number | undefined>(undefined);

  const running = !outcome && secondsLeft > 0;
  const won = makes >= TARGET;

  // 1Hz countdown — starts on first SHOOT tap so reading the screen isn't
  // counted against the kid.
  useEffect(() => {
    if (!running || startedRef.current === undefined) return;
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [running, shotsTaken === 0 ? null : 'started']);

  // Game-over when the timer hits zero.
  useEffect(() => {
    if (outcome) return;
    if (secondsLeft === 0 || won) {
      const xp = Math.max(1, Math.min(20, makes));
      // Slight bonus for the perfect-target hit.
      const bonus = won && secondsLeft > 0 ? 3 : 0;
      setOutcome(recordArcadePlay('shootout', xp + bonus));
    }
  }, [secondsLeft, won, outcome, makes, recordArcadePlay]);

  const shoot = () => {
    if (!running) return;
    if (startedRef.current === undefined) startedRef.current = Date.now();
    const makeChance = Math.min(0.95, BASE_MAKE_RATE + missStreak * 0.05);
    const made = Math.random() < makeChance;
    const id = shotIdRef.current++;
    setShots((s) => [...s.slice(-3), { id, made }]);
    setShotsTaken((n) => n + 1);
    if (made) {
      setMakes((m) => m + 1);
      setMissStreak(0);
    } else {
      setMissStreak((n) => n + 1);
    }
    // Trim animation queue after the throw finishes.
    window.setTimeout(() => {
      setShots((s) => s.filter((x) => x.id !== id));
    }, 950);
  };

  const reset = () => {
    setOutcome(null);
    setSecondsLeft(SESSION_SECONDS);
    setMakes(0);
    setShotsTaken(0);
    setShots([]);
    setMissStreak(0);
    startedRef.current = undefined;
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Shootout" emoji="🏀" />
        <ArcadeEndCard
          gameId="shootout"
          outcome={outcome}
          win={won}
          scoreLine={
            won
              ? `🔥 ${makes} baskets in ${SESSION_SECONDS - secondsLeft}s — target smashed!`
              : `${makes} of ${TARGET} baskets — try again!`
          }
          onReplay={reset}
        />
      </div>
    );
  }

  const accuracy = shotsTaken ? Math.round((makes / shotsTaken) * 100) : 0;

  return (
    <div>
      <ArcadeHeader title="Shootout · 30s" emoji="🏀" />
      <p className="text-sm text-slate-600 mb-2">
        Tap <b>SHOOT!</b> as fast as you can. Score <b>{TARGET}</b> baskets in
        30 seconds.
      </p>

      <div className="flex justify-between items-center mb-3 max-w-sm mx-auto px-1">
        <div className="text-2xl font-display font-extrabold text-orange-600 tabular-nums">
          ⏱ {secondsLeft}s
        </div>
        <div className="text-2xl font-display font-extrabold text-green-700 tabular-nums">
          🏀 {makes}/{TARGET}
        </div>
        <div className="text-xs font-display font-bold text-slate-500">
          {accuracy}%
        </div>
      </div>

      {/* court */}
      <div className="relative max-w-sm mx-auto h-52 bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl border-2 border-slate-200 overflow-hidden">
        <div className="absolute right-4 top-2 text-6xl select-none" aria-hidden="true">🥅</div>
        <div className="absolute right-6 top-[72px] w-14 h-2 bg-orange-500 rounded-full" />
        <AnimatePresence>
          {shots.map((s) => (
            <motion.div
              key={s.id}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={
                s.made
                  ? { x: [0, 130, 248], y: [0, -130, -86], rotate: 540, opacity: [1, 1, 1] }
                  : { x: [0, 130, 260], y: [0, -140, -20], rotate: 540, opacity: [1, 1, 0.6] }
              }
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="absolute bottom-3 left-8 text-4xl select-none"
              aria-hidden="true"
            >
              🏀
            </motion.div>
          ))}
        </AnimatePresence>
        {shots.some((s) => s.made) && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.85 }}
            className="absolute right-4 top-16 text-xl font-display font-extrabold text-green-600"
          >
            SWISH!
          </motion.div>
        )}
      </div>

      <div className="max-w-sm mx-auto mt-5">
        <button
          type="button"
          onClick={shoot}
          disabled={!running}
          className="w-full min-h-20 rounded-3xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-display font-extrabold text-3xl shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
        >
          SHOOT! 🏀
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          +1 XP per basket. Hit the target for a bonus.
        </p>
      </div>
    </div>
  );
}
