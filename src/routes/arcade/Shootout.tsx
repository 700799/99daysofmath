import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Skill-based basketball. The hoop jumps to a new spot every shot. A direction
// arrow sweeps back and forth from the launch point — tap SHOOT to fire at the
// current angle. You only score if the arrow is aimed within a tight tolerance
// of the hoop. One shot at a time: the ball flies, resolves, then the hoop
// moves again. No freebies — pure aim.

const COURT_W = 340;
const COURT_H = 240;
const LAUNCH = { x: COURT_W / 2, y: COURT_H - 22 };
const AIM_MIN = -170; // degrees (pointing up-left)
const AIM_MAX = -10; //  degrees (pointing up-right)
const SWEEP_SPEED = 165; // degrees per second — fast = hard
const TOLERANCE = 7; // degrees of aim error allowed for a make
const ARROW_LEN = 70;

const SESSION_SECONDS = 45;
const TARGET = 5;

type Hoop = { x: number; y: number };
type Flight = { id: number; dx: number; dy: number; dist: number; made: boolean };

function angleDelta(a: number, b: number): number {
  return (((a - b) % 360) + 540) % 360 - 180;
}

function randomHoop(prev: Hoop | null): Hoop {
  for (let i = 0; i < 24; i++) {
    const x = 40 + Math.random() * (COURT_W - 80);
    const y = 24 + Math.random() * (COURT_H * 0.45);
    if (!prev || Math.hypot(x - prev.x, y - prev.y) > 90) return { x, y };
  }
  return { x: 40 + Math.random() * (COURT_W - 80), y: 24 + Math.random() * (COURT_H * 0.45) };
}

export function Shootout() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [makes, setMakes] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<'aim' | 'fly'>('aim');
  const [hoop, setHoop] = useState<Hoop>(() => randomHoop(null));
  const [arrowAngle, setArrowAngle] = useState(AIM_MIN);
  const [flight, setFlight] = useState<Flight | null>(null);

  const angleRef = useRef(AIM_MIN);
  const dirRef = useRef(1);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const shotIdRef = useRef(1);

  const running = !outcome && secondsLeft > 0;
  const won = makes >= TARGET;

  // Countdown — starts on the first shot so reading the screen isn't penalised.
  useEffect(() => {
    if (!running || !started) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running, started]);

  // Sweep the aim arrow while aiming.
  useEffect(() => {
    if (!running || phase !== 'aim') return;
    lastRef.current = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      let a = angleRef.current + dirRef.current * SWEEP_SPEED * dt;
      if (a >= AIM_MAX) {
        a = AIM_MAX;
        dirRef.current = -1;
      } else if (a <= AIM_MIN) {
        a = AIM_MIN;
        dirRef.current = 1;
      }
      angleRef.current = a;
      setArrowAngle(a);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, phase]);

  // Game-over when the timer hits zero or the target is reached.
  useEffect(() => {
    if (outcome) return;
    if (secondsLeft === 0 || won) {
      const xp = Math.max(1, Math.min(20, makes * 2));
      const bonus = won && secondsLeft > 0 ? 3 : 0;
      setOutcome(recordArcadePlay('shootout', xp + bonus));
    }
  }, [secondsLeft, won, outcome, makes, recordArcadePlay]);

  const shoot = () => {
    if (!running || phase !== 'aim') return;
    if (!started) setStarted(true);
    const a = angleRef.current;
    const trueAngle = (Math.atan2(hoop.y - LAUNCH.y, hoop.x - LAUNCH.x) * 180) / Math.PI;
    const made = Math.abs(angleDelta(a, trueAngle)) <= TOLERANCE;
    const rad = (a * Math.PI) / 180;
    const dist = made
      ? Math.hypot(hoop.x - LAUNCH.x, hoop.y - LAUNCH.y)
      : Math.hypot(COURT_W, COURT_H);
    setFlight({ id: shotIdRef.current++, dx: Math.cos(rad), dy: Math.sin(rad), dist, made });
    setShotsTaken((n) => n + 1);
    setPhase('fly');
  };

  const onFlightDone = () => {
    const made = flight?.made;
    setFlight(null);
    if (made) setMakes((m) => m + 1);
    setHoop((h) => randomHoop(h));
    angleRef.current = AIM_MIN;
    dirRef.current = 1;
    setArrowAngle(AIM_MIN);
    setPhase('aim');
  };

  // Space bar shoots, too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        shoot();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const reset = () => {
    setOutcome(null);
    setSecondsLeft(SESSION_SECONDS);
    setMakes(0);
    setShotsTaken(0);
    setStarted(false);
    setPhase('aim');
    setHoop(randomHoop(null));
    setFlight(null);
    angleRef.current = AIM_MIN;
    dirRef.current = 1;
    setArrowAngle(AIM_MIN);
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
              ? `🔥 ${makes} baskets in ${SESSION_SECONDS - secondsLeft}s — sharpshooter!`
              : `${makes} of ${TARGET} baskets — keep practising your aim!`
          }
          onReplay={reset}
        />
      </div>
    );
  }

  const accuracy = shotsTaken ? Math.round((makes / shotsTaken) * 100) : 0;

  return (
    <div>
      <ArcadeHeader title="Shootout · 45s" emoji="🏀" />
      <p className="text-sm text-slate-600 mb-2">
        Time your tap! The arrow sweeps — fire it at the hoop. The hoop <b>moves every shot</b>.
        Sink <b>{TARGET}</b> in 45 seconds.
      </p>

      <div className="flex justify-between items-center mb-3 max-w-sm mx-auto px-1">
        <div className="text-2xl font-display font-extrabold text-orange-600 tabular-nums">
          ⏱ {secondsLeft}s
        </div>
        <div className="text-2xl font-display font-extrabold text-green-700 tabular-nums">
          🏀 {makes}/{TARGET}
        </div>
        <div className="text-xs font-display font-bold text-slate-500">{accuracy}%</div>
      </div>

      {/* court */}
      <div
        className="relative mx-auto bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl border-2 border-slate-200 overflow-hidden"
        style={{ width: '100%', maxWidth: COURT_W, height: COURT_H }}
      >
        {/* hoop */}
        <div
          className="absolute select-none"
          style={{ left: hoop.x - 24, top: hoop.y - 26 }}
          aria-hidden="true"
        >
          <div className="text-5xl leading-none">🥅</div>
          <div className="mx-auto w-12 h-1.5 bg-orange-500 rounded-full" />
        </div>

        {/* aim arrow */}
        {phase === 'aim' && running && (
          <div
            className="absolute"
            style={{
              left: LAUNCH.x,
              top: LAUNCH.y,
              transform: `rotate(${arrowAngle}deg)`,
              transformOrigin: '0 50%',
            }}
          >
            <div className="flex items-center">
              <div style={{ width: ARROW_LEN, height: 5 }} className="bg-orange-500 rounded-full" />
              <div className="text-orange-500 -ml-1 leading-none" style={{ fontSize: 20 }}>
                ▶
              </div>
            </div>
          </div>
        )}

        {/* resting ball at the launch point while aiming */}
        {phase === 'aim' && (
          <div
            className="absolute text-3xl select-none"
            style={{ left: LAUNCH.x - 16, top: LAUNCH.y - 16 }}
            aria-hidden="true"
          >
            🏀
          </div>
        )}

        {/* flying ball */}
        {flight && (
          <motion.div
            key={flight.id}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{ x: flight.dx * flight.dist, y: flight.dy * flight.dist, rotate: 540 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={onFlightDone}
            className="absolute text-3xl select-none"
            style={{ left: LAUNCH.x - 16, top: LAUNCH.y - 16 }}
            aria-hidden="true"
          >
            🏀
          </motion.div>
        )}

        {flight?.made && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute text-xl font-display font-extrabold text-green-600"
            style={{ left: hoop.x - 24, top: hoop.y - 28 }}
          >
            SWISH!
          </motion.div>
        )}
      </div>

      <div className="max-w-sm mx-auto mt-5">
        <button
          type="button"
          onClick={shoot}
          disabled={!running || phase !== 'aim'}
          className="w-full min-h-20 rounded-3xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-display font-extrabold text-3xl shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
        >
          SHOOT! 🏀
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          +2 XP per basket. Sink the target for a bonus.
        </p>
      </div>
    </div>
  );
}
