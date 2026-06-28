import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Angle Shootout — a basketball game that teaches angles in DEGREES and RADIANS.
// A protractor (0°–180°) is drawn from the launch point. The hoop always sits on
// one of the labelled radian rays. The aim arrow snaps between those radian
// angles — tap LOCK when it points at the hoop, then pick the distance
// (Close / Medium / Far). Match BOTH the angle and the distance to score.

const COURT_W = 340;
const COURT_H = 300;
const LAUNCH = { x: COURT_W / 2, y: COURT_H - 26 };

// The teachable angles: degrees + their exact radian names. 0°/180° are shown on
// the protractor scale for context; hoops only spawn on the upward rays so the
// shot actually arcs to a basket.
type Ang = { deg: number; rad: string };
const SCALE: Ang[] = [
  { deg: 0, rad: '0' },
  { deg: 30, rad: 'π/6' },
  { deg: 45, rad: 'π/4' },
  { deg: 60, rad: 'π/3' },
  { deg: 90, rad: 'π/2' },
  { deg: 120, rad: '2π/3' },
  { deg: 135, rad: '3π/4' },
  { deg: 150, rad: '5π/6' },
  { deg: 180, rad: 'π' },
];
// Aimable angles (the arrow snaps to these — the upward rays).
const ANGLES: Ang[] = SCALE.filter((a) => a.deg >= 30 && a.deg <= 150);

type PowerLvl = { key: 'close' | 'medium' | 'far'; label: string; dist: number; emoji: string };
const POWERS: PowerLvl[] = [
  { key: 'close', label: 'Close', dist: 70, emoji: '🟢' },
  { key: 'medium', label: 'Medium', dist: 116, emoji: '🟡' },
  { key: 'far', label: 'Far', dist: 160, emoji: '🔴' },
];

const PROT_R = 58; // protractor radius (court units)
const ARROW_LEN = 88; // aim arrow length (px)
const STEP_MS = 650; // how fast the arrow steps between radian angles
const SESSION_SECONDS = 45;
const TARGET = 5;

type Hoop = { angleIdx: number; powerIdx: number };
type Flight = { id: number; theta: number; dist: number; made: boolean; angleRight: boolean; powerRight: boolean };

function rad(deg: number) {
  return (deg * Math.PI) / 180;
}
// court coord of a point at angle/dist from the launch (screen y grows downward)
function landing(theta: number, dist: number) {
  return { x: LAUNCH.x + Math.cos(theta) * dist, y: LAUNCH.y - Math.sin(theta) * dist };
}
const px = (v: number, total: number) => `${(v / total) * 100}%`;

function randomHoop(prev: Hoop | null): Hoop {
  for (let i = 0; i < 24; i++) {
    const angleIdx = Math.floor(Math.random() * ANGLES.length);
    const powerIdx = Math.floor(Math.random() * POWERS.length);
    if (!prev || prev.angleIdx !== angleIdx || prev.powerIdx !== powerIdx) return { angleIdx, powerIdx };
  }
  return { angleIdx: 0, powerIdx: 1 };
}

export function Shootout() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [makes, setMakes] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<'aim' | 'power' | 'fly'>('aim');
  const [hoop, setHoop] = useState<Hoop>(() => randomHoop(null));
  const [aimIdx, setAimIdx] = useState(0);
  const [lockedIdx, setLockedIdx] = useState(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [reaction, setReaction] = useState<{ kind: 'make' | 'miss'; text: string } | null>(null);

  const shotIdRef = useRef(1);

  const running = !outcome && secondsLeft > 0;
  const won = makes >= TARGET;

  // Countdown — starts on the first lock so reading the screen isn't penalised.
  useEffect(() => {
    if (!running || !started) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running, started]);

  // Step the aim arrow through the radian angles while aiming.
  useEffect(() => {
    if (!running || phase !== 'aim') return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setAimIdx((i) => (i + 1) % ANGLES.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [running, phase, pausedRef]);

  // Game-over when the timer hits zero or the target is reached.
  useEffect(() => {
    if (outcome) return;
    if (secondsLeft === 0 || won) {
      const xp = Math.max(1, Math.min(20, makes * 2));
      const bonus = won && secondsLeft > 0 ? 3 : 0;
      setOutcome(recordArcadePlay('shootout', xp + bonus));
    }
  }, [secondsLeft, won, outcome, makes, recordArcadePlay]);

  const lockAim = () => {
    if (!running) return;
    if (!started) setStarted(true);
    setLockedIdx(aimIdx);
    setPhase('power');
  };

  const fire = (powerIdx: number) => {
    if (!running || phase !== 'power') return;
    const ang = ANGLES[lockedIdx];
    const theta = rad(ang.deg);
    const dist = POWERS[powerIdx].dist;
    const angleRight = lockedIdx === hoop.angleIdx;
    const powerRight = powerIdx === hoop.powerIdx;
    setFlight({ id: shotIdRef.current++, theta, dist, made: angleRight && powerRight, angleRight, powerRight });
    setShotsTaken((n) => n + 1);
    setPhase('fly');
  };

  const onFlightDone = () => {
    const f = flight;
    setFlight(null);
    if (!f) return;
    const correct = ANGLES[hoop.angleIdx];
    if (f.made) {
      setMakes((m) => m + 1);
      setReaction({ kind: 'make', text: `SWISH! ${correct.deg}° = ${correct.rad} rad 🏀` });
      sfx.win();
      haptic(HAPTIC.win);
    } else {
      const why = !f.angleRight
        ? `The basket was at ${correct.deg}° = ${correct.rad} rad.`
        : `Right angle! Try ${POWERS[hoop.powerIdx].label} distance.`;
      setReaction({ kind: 'miss', text: why });
      sfx.lose();
      haptic(HAPTIC.heavy);
    }
    window.setTimeout(() => {
      setReaction(null);
      setHoop((h) => randomHoop(h));
      setPhase('aim');
    }, 1300);
  };

  // Space bar: lock the aim, or fire medium power.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (phase === 'aim') lockAim();
        else if (phase === 'power') fire(1);
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
    setAimIdx(0);
    setLockedIdx(0);
    setReaction(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Angle Shootout" emoji="🏀" />
        <ArcadeEndCard
          gameId="shootout"
          outcome={outcome}
          win={won}
          scoreLine={
            won
              ? `🔥 ${makes} baskets in ${SESSION_SECONDS - secondsLeft}s — angle ace!`
              : `${makes} of ${TARGET} baskets — keep reading those angles!`
          }
          onReplay={reset}
        />
      </div>
    );
  }

  const accuracy = shotsTaken ? Math.round((makes / shotsTaken) * 100) : 0;
  const shownIdx = phase === 'aim' ? aimIdx : lockedIdx;
  const shown = ANGLES[shownIdx];
  const hoopLand = landing(rad(ANGLES[hoop.angleIdx].deg), POWERS[hoop.powerIdx].dist);

  return (
    <div>
      <ArcadeHeader title="Angle Shootout · 45s" emoji="🏀" />
      <p className="text-sm text-slate-600 mb-2 max-w-sm mx-auto text-center">
        Read the angle to the hoop! The arrow snaps to each <b>radian</b>. Tap <b>LOCK</b> on the right
        angle, then pick <b>Close / Medium / Far</b>. Sink <b>{TARGET}</b> in 45s.
      </p>

      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1">
        <div className="text-2xl font-display font-extrabold text-orange-600 tabular-nums">⏱ {secondsLeft}s</div>
        <div className="text-2xl font-display font-extrabold text-green-700 tabular-nums">🏀 {makes}/{TARGET}</div>
        <div className="text-xs font-display font-bold text-slate-500">{accuracy}%</div>
      </div>

      {/* live angle readout — the teaching surface */}
      <div className="max-w-sm mx-auto mb-2 rounded-2xl bg-indigo-50 border-2 border-indigo-200 px-3 py-2 text-center">
        <span className="text-xs font-display font-bold text-indigo-500 uppercase tracking-wide">
          {phase === 'aim' ? 'Aiming' : phase === 'power' ? 'Locked — pick distance' : 'Shooting'}
        </span>
        <div className="text-2xl font-display font-extrabold text-indigo-700 tabular-nums">
          {shown.deg}° = {shown.rad} rad
        </div>
      </div>

      {/* after locking the angle: show every possible angle/radian, chosen one lit */}
      {phase !== 'aim' && (
        <div className="max-w-sm mx-auto mb-2 rounded-2xl bg-white border-2 border-slate-200 p-2">
          <div className="text-[11px] font-display font-bold text-slate-500 text-center mb-1">
            You chose <span className="text-indigo-700">{ANGLES[lockedIdx].deg}° = {ANGLES[lockedIdx].rad} rad</span> — all the angles:
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {ANGLES.map((a, i) => (
              <span
                key={a.deg}
                className={`rounded-lg px-2 py-1 text-xs font-display font-extrabold tabular-nums border-2 ${
                  i === lockedIdx ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {a.deg}°<span className="opacity-70"> · {a.rad}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* court */}
      <div
        className="relative mx-auto bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl border-2 border-slate-200 overflow-hidden"
        style={{ width: '100%', maxWidth: COURT_W, aspectRatio: `${COURT_W} / ${COURT_H}` }}
      >
        {/* protractor: arc, ticks, degree + radian labels (scales with the court) */}
        <svg viewBox={`0 0 ${COURT_W} ${COURT_H}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
          <path
            d={`M ${LAUNCH.x - PROT_R} ${LAUNCH.y} A ${PROT_R} ${PROT_R} 0 0 1 ${LAUNCH.x + PROT_R} ${LAUNCH.y}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={1.5}
          />
          {SCALE.map((a) => {
            const t = rad(a.deg);
            const ix = LAUNCH.x + Math.cos(t) * (PROT_R - 8);
            const iy = LAUNCH.y - Math.sin(t) * (PROT_R - 8);
            const ox = LAUNCH.x + Math.cos(t) * PROT_R;
            const oy = LAUNCH.y - Math.sin(t) * PROT_R;
            const lx = LAUNCH.x + Math.cos(t) * (PROT_R + 13);
            const ly = LAUNCH.y - Math.sin(t) * (PROT_R + 13);
            const rx = LAUNCH.x + Math.cos(t) * (PROT_R + 27);
            const ry = LAUNCH.y - Math.sin(t) * (PROT_R + 27);
            const isCur = phase !== 'fly' && a.deg === shown.deg;
            return (
              <g key={a.deg}>
                <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={isCur ? '#4f46e5' : '#cbd5e1'} strokeWidth={isCur ? 3 : 1.5} />
                <text x={lx} y={ly} fontSize={9} fontWeight={700} textAnchor="middle" dominantBaseline="middle" fill={isCur ? '#4f46e5' : '#64748b'}>
                  {a.deg}°
                </text>
                <text x={rx} y={ry} fontSize={8} textAnchor="middle" dominantBaseline="middle" fill={isCur ? '#7c3aed' : '#94a3b8'}>
                  {a.rad}
                </text>
              </g>
            );
          })}
        </svg>

        {/* hoop — sits exactly on one radian ray */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
          style={{ left: px(hoopLand.x, COURT_W), top: px(hoopLand.y, COURT_H) }}
          aria-hidden="true"
        >
          <div className="text-4xl leading-none">🥅</div>
          <div className="mx-auto w-10 h-1.5 bg-orange-500 rounded-full" />
        </div>

        {/* aim arrow (snaps to the current radian; freezes while choosing power) */}
        {(phase === 'aim' || phase === 'power') && running && (
          <div
            className="absolute"
            style={{
              left: px(LAUNCH.x, COURT_W),
              top: px(LAUNCH.y, COURT_H),
              transform: `rotate(${-shown.deg}deg)`,
              transformOrigin: '0 50%',
            }}
          >
            <div className="flex items-center">
              <div style={{ width: ARROW_LEN, height: 5 }} className={`rounded-full ${phase === 'power' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
              <div className={`-ml-1 leading-none ${phase === 'power' ? 'text-emerald-500' : 'text-orange-500'}`} style={{ fontSize: 20 }}>▶</div>
            </div>
          </div>
        )}

        {/* resting ball at the launch point */}
        {(phase === 'aim' || phase === 'power') && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl select-none" style={{ left: px(LAUNCH.x, COURT_W), top: px(LAUNCH.y, COURT_H) }} aria-hidden="true">
            🏀
          </div>
        )}

        {/* flying ball */}
        {flight && (
          <motion.div
            key={flight.id}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{ x: Math.cos(flight.theta) * flight.dist, y: -Math.sin(flight.theta) * flight.dist, rotate: 540 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={onFlightDone}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl select-none"
            style={{ left: px(LAUNCH.x, COURT_W), top: px(LAUNCH.y, COURT_H) }}
            aria-hidden="true"
          >
            🏀
          </motion.div>
        )}

        {/* MAKE: swish + sparkles + flipping monkey */}
        {reaction?.kind === 'make' && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 text-xl font-display font-extrabold text-green-600 text-center"
            >
              {reaction.text}
            </motion.div>
            <motion.div
              initial={{ rotate: 0, y: 0 }}
              animate={{ rotate: 360, y: [-6, -22, -6] }}
              transition={{ duration: 0.7 }}
              className="absolute text-3xl"
              style={{ right: 6, bottom: 6 }}
              aria-hidden="true"
            >
              🐵
            </motion.div>
          </>
        )}

        {/* MISS: red flash + a teaching hint + a thumbs-down monkey */}
        {reaction?.kind === 'miss' && (
          <>
            <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 bg-rose-500/40" aria-hidden="true" />
            <motion.div
              initial={{ scale: 0.7, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[90%] text-center text-sm font-display font-extrabold text-rose-700 bg-white/80 rounded-xl px-2 py-1"
            >
              {reaction.text}
            </motion.div>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -12, 12, -8, 0] }}
              transition={{ duration: 0.7 }}
              className="absolute text-3xl"
              style={{ right: 6, bottom: 6 }}
              aria-hidden="true"
            >
              🙊👎
            </motion.div>
          </>
        )}
      </div>

      {/* controls */}
      <div className="max-w-sm mx-auto mt-4">
        {phase !== 'power' ? (
          <button
            type="button"
            onClick={lockAim}
            disabled={!running || phase === 'fly'}
            className="w-full min-h-16 rounded-3xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-display font-extrabold text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
          >
            🎯 LOCK {shown.deg}° ({shown.rad})
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {POWERS.map((p, i) => (
              <button
                key={p.key}
                type="button"
                onClick={() => fire(i)}
                className="min-h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold shadow-[0_5px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
              >
                <div className="text-xl">{p.emoji}</div>
                {p.label}
              </button>
            ))}
          </div>
        )}
        <p className="text-center text-xs text-slate-400 mt-2">
          +2 XP per basket. A full circle is 360° = 2π rad; half is 180° = π rad.
        </p>
      </div>
    </div>
  );
}
