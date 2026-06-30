import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { Mascot as CharMascot } from './Mascots';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Angle Cannon — a trig game. A fat cannon launches a projectile (bowling ball /
// watermelon / bananas) to knock down a stack of targets sitting on a labelled
// angle ray. While aiming you only see DEGREES; after each shot the screen zooms
// in to reveal the matching RADIAN and the SOH-CAH-TOA right triangle for that
// angle. Match the angle AND the distance to score.

const COURT_W = 380;
const COURT_H = 460;
const LAUNCH = { x: 190, y: 430 };
const PROT_R = 78;
const SESSION_SECONDS = 60;
const TARGET = 5;
const STEP_MS = 650;

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
const ANGLES: Ang[] = SCALE.filter((a) => a.deg >= 30 && a.deg <= 150);

// Exact trig facts revealed in the post-shot zoom.
const TRIG: Record<number, { sin: string; cos: string; tan: string }> = {
  30: { sin: '1/2', cos: '√3/2', tan: '1/√3' },
  45: { sin: '√2/2', cos: '√2/2', tan: '1' },
  60: { sin: '√3/2', cos: '1/2', tan: '√3' },
  90: { sin: '1', cos: '0', tan: '∞' },
  120: { sin: '√3/2', cos: '−1/2', tan: '−√3' },
  135: { sin: '√2/2', cos: '−√2/2', tan: '−1' },
  150: { sin: '1/2', cos: '−√3/2', tan: '−1/√3' },
};

type PowerLvl = { key: 'close' | 'medium' | 'far'; label: string; frac: number; emoji: string };
const POWERS: PowerLvl[] = [
  { key: 'close', label: 'Close', frac: 0.52, emoji: '🟢' },
  { key: 'medium', label: 'Medium', frac: 0.72, emoji: '🟡' },
  { key: 'far', label: 'Far', frac: 0.93, emoji: '🔴' },
];

const PROJECTILES = ['🎳', '🍉', '🍌'] as const;
const TARGETS = [
  { emoji: '🥕', name: 'carrots' },
  { emoji: '🥛', name: 'milk bottles' },
  { emoji: '🎈', name: 'water balloons' },
  { emoji: '🍶', name: 'bottles' },
] as const;

type Hoop = { angleIdx: number; powerIdx: number; target: number };
type Flight = { id: number; theta: number; dist: number; made: boolean; angleRight: boolean; powerRight: boolean; proj: string };

function rad(deg: number) {
  return (deg * Math.PI) / 180;
}
// Largest distance that keeps the landing on the court for a given angle, so even
// "Far" stays in view at the steep 30°/150° rays.
function maxDist(deg: number) {
  const t = rad(deg);
  const c = Math.abs(Math.cos(t));
  const s = Math.sin(t);
  const byW = c > 0.01 ? (COURT_W / 2 - 40) / c : Infinity;
  const byH = s > 0.01 ? (LAUNCH.y - 64) / s : Infinity;
  return Math.min(byW, byH);
}
function landing(deg: number, frac: number) {
  const t = rad(deg);
  const d = frac * maxDist(deg);
  return { x: LAUNCH.x + Math.cos(t) * d, y: LAUNCH.y - Math.sin(t) * d, d };
}
const px = (v: number, total: number) => `${(v / total) * 100}%`;

function randomHoop(prev: Hoop | null): Hoop {
  for (let i = 0; i < 24; i++) {
    const angleIdx = Math.floor(Math.random() * ANGLES.length);
    const powerIdx = Math.floor(Math.random() * POWERS.length);
    const target = Math.floor(Math.random() * TARGETS.length);
    if (!prev || prev.angleIdx !== angleIdx || prev.powerIdx !== powerIdx) return { angleIdx, powerIdx, target };
  }
  return { angleIdx: 0, powerIdx: 1, target: 0 };
}

// SOH-CAH-TOA right triangle for the chosen angle, drawn fresh each shot.
function TrigTriangle({ deg }: { deg: number }) {
  const t = rad(deg);
  const O = { x: 100, y: 132 };
  const L = 104;
  const H = { x: O.x + Math.cos(t) * L, y: O.y - Math.sin(t) * L };
  const A = { x: H.x, y: O.y }; // right-angle foot
  return (
    <svg viewBox="0 0 200 160" className="w-full" style={{ maxHeight: 150 }} aria-hidden>
      {/* adjacent */}
      <line x1={O.x} y1={O.y} x2={A.x} y2={A.y} stroke="#0ea5e9" strokeWidth={4} strokeLinecap="round" />
      {/* opposite */}
      <line x1={A.x} y1={A.y} x2={H.x} y2={H.y} stroke="#22c55e" strokeWidth={4} strokeLinecap="round" />
      {/* hypotenuse */}
      <line x1={O.x} y1={O.y} x2={H.x} y2={H.y} stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" />
      {/* right-angle marker */}
      <rect x={A.x - (H.x > O.x ? 10 : 0)} y={A.y - 10} width={10} height={10} fill="none" stroke="#94a3b8" strokeWidth={2} />
      {/* angle dot */}
      <circle cx={O.x} cy={O.y} r={4} fill="#1f2937" />
      <text x={O.x + (H.x > O.x ? 16 : -16) * 1} y={O.y - 6} fontSize={13} fontWeight={800} textAnchor="middle" fill="#1f2937">
        {deg}°
      </text>
      <text x={(O.x + A.x) / 2} y={O.y + 16} fontSize={11} fontWeight={700} textAnchor="middle" fill="#0284c7">
        adj
      </text>
      <text x={A.x + (H.x > O.x ? 14 : -14)} y={(A.y + H.y) / 2} fontSize={11} fontWeight={700} textAnchor="middle" fill="#16a34a">
        opp
      </text>
      <text x={(O.x + H.x) / 2 + (H.x > O.x ? -10 : 10)} y={(O.y + H.y) / 2 - 6} fontSize={11} fontWeight={700} textAnchor="middle" fill="#d97706">
        hyp
      </text>
    </svg>
  );
}

export function Shootout() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const buzz = (p: number | number[]) => {
    if (hapticsOn) haptic(p);
  };

  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [makes, setMakes] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<'aim' | 'power' | 'fly' | 'zoom'>('aim');
  const [hoop, setHoop] = useState<Hoop>(() => randomHoop(null));
  const [aimIdx, setAimIdx] = useState(0);
  const [lockedIdx, setLockedIdx] = useState(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [zoom, setZoom] = useState<{ made: boolean; deg: number; powerRight: boolean } | null>(null);
  const shotIdRef = useRef(1);

  const running = !outcome && secondsLeft > 0;
  const won = makes >= TARGET;

  useEffect(() => {
    if (!running || !started || phase === 'zoom') return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running, started, phase]);

  useEffect(() => {
    if (!running || phase !== 'aim') return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setAimIdx((i) => (i + 1) % ANGLES.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [running, phase, pausedRef]);

  useEffect(() => {
    if (outcome) return;
    if (secondsLeft === 0 || won) {
      const xp = Math.max(1, Math.min(20, makes * 2));
      const bonus = won && secondsLeft > 0 ? 3 : 0;
      setOutcome(recordArcadePlay('shootout', xp + bonus));
    }
  }, [secondsLeft, won, outcome, makes, recordArcadePlay]);

  const lockAim = () => {
    if (!running || phase !== 'aim') return;
    if (!started) setStarted(true);
    setLockedIdx(aimIdx);
    setPhase('power');
  };

  const fire = (powerIdx: number) => {
    if (!running || phase !== 'power') return;
    const ang = ANGLES[lockedIdx];
    const angleRight = lockedIdx === hoop.angleIdx;
    const powerRight = powerIdx === hoop.powerIdx;
    const land = landing(ang.deg, POWERS[powerIdx].frac);
    setFlight({
      id: shotIdRef.current++,
      theta: rad(ang.deg),
      dist: land.d,
      made: angleRight && powerRight,
      angleRight,
      powerRight,
      proj: PROJECTILES[Math.floor(Math.random() * PROJECTILES.length)],
    });
    setShotsTaken((n) => n + 1);
    setPhase('fly');
  };

  const onFlightDone = () => {
    const f = flight;
    if (!f) return;
    if (f.made) {
      setMakes((m) => m + 1);
      sfx.explode();
      buzz(HAPTIC.explode);
    } else {
      sfx.lose();
      buzz(HAPTIC.heavy);
    }
    setZoom({ made: f.made, deg: ANGLES[lockedIdx].deg, powerRight: f.powerRight });
    setPhase('zoom');
  };

  const nextRound = () => {
    setFlight(null);
    setZoom(null);
    setHoop((h) => randomHoop(h));
    setPhase('aim');
  };

  useEffect(() => {
    if (phase !== 'zoom') return;
    const id = window.setTimeout(nextRound, 3200);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (phase === 'aim') lockAim();
        else if (phase === 'power') fire(1);
        else if (phase === 'zoom') nextRound();
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
    setZoom(null);
    setAimIdx(0);
    setLockedIdx(0);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Angle Cannon" emoji="💥" />
        <ArcadeEndCard
          gameId="shootout"
          outcome={outcome}
          win={won}
          scoreLine={won ? `🔥 ${makes} direct hits — angle ace!` : `${makes} of ${TARGET} hits — keep reading those angles!`}
          onReplay={reset}
        />
      </div>
    );
  }

  const accuracy = shotsTaken ? Math.round((makes / shotsTaken) * 100) : 0;
  const shown = ANGLES[phase === 'aim' ? aimIdx : lockedIdx];
  const hoopLand = landing(ANGLES[hoop.angleIdx].deg, POWERS[hoop.powerIdx].frac);
  const targetEmoji = TARGETS[hoop.target].emoji;
  const aimDeg = shown.deg;

  return (
    <div>
      <ArcadeHeader title="Angle Cannon" emoji="💥" />

      <div className="mx-auto mb-2 flex max-w-md items-center justify-between px-1">
        <div className="text-2xl font-display font-extrabold text-orange-600 tabular-nums">⏱ {secondsLeft}s</div>
        <div className="text-2xl font-display font-extrabold text-green-700 tabular-nums">💥 {makes}/{TARGET}</div>
        <div className="text-xs font-display font-bold text-slate-500">{accuracy}%</div>
      </div>

      {/* DEGREES-ONLY readout while aiming/locked */}
      <div className="mx-auto mb-2 max-w-md rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-center">
        <span className="text-xs font-display font-bold uppercase tracking-wide text-indigo-500">
          {phase === 'aim' ? 'Aim the cannon' : phase === 'power' ? 'Locked — pick distance' : phase === 'fly' ? 'Fire!' : 'Direct hit?'}
        </span>
        <div className="text-3xl font-display font-extrabold tabular-nums text-indigo-700">{aimDeg}°</div>
      </div>

      {/* court */}
      <div
        className="relative mx-auto overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-b from-sky-200 to-amber-50"
        style={{ width: '100%', maxWidth: 460, aspectRatio: `${COURT_W} / ${COURT_H}` }}
      >
        <svg viewBox={`0 0 ${COURT_W} ${COURT_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {/* ground */}
          <rect x={0} y={LAUNCH.y + 8} width={COURT_W} height={COURT_H - LAUNCH.y} fill="#86efac" />
          {/* protractor arc + DEGREE ticks only */}
          <path d={`M ${LAUNCH.x - PROT_R} ${LAUNCH.y} A ${PROT_R} ${PROT_R} 0 0 1 ${LAUNCH.x + PROT_R} ${LAUNCH.y}`} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
          {SCALE.map((a) => {
            const t = rad(a.deg);
            const ix = LAUNCH.x + Math.cos(t) * (PROT_R - 9);
            const iy = LAUNCH.y - Math.sin(t) * (PROT_R - 9);
            const ox = LAUNCH.x + Math.cos(t) * PROT_R;
            const oy = LAUNCH.y - Math.sin(t) * PROT_R;
            const lx = LAUNCH.x + Math.cos(t) * (PROT_R + 16);
            const ly = LAUNCH.y - Math.sin(t) * (PROT_R + 16);
            const isCur = (phase === 'aim' || phase === 'power') && a.deg === aimDeg;
            return (
              <g key={a.deg}>
                <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={isCur ? '#4f46e5' : '#cbd5e1'} strokeWidth={isCur ? 3.5 : 1.5} />
                <text x={lx} y={ly} fontSize={12} fontWeight={800} textAnchor="middle" dominantBaseline="middle" fill={isCur ? '#4f46e5' : '#64748b'}>
                  {a.deg}°
                </text>
              </g>
            );
          })}
          {/* dashed aim ray */}
          {(phase === 'aim' || phase === 'power') && (
            <line
              x1={LAUNCH.x}
              y1={LAUNCH.y}
              x2={LAUNCH.x + Math.cos(rad(aimDeg)) * (maxDist(aimDeg) * 0.95)}
              y2={LAUNCH.y - Math.sin(rad(aimDeg)) * (maxDist(aimDeg) * 0.95)}
              stroke={phase === 'power' ? '#10b981' : '#f97316'}
              strokeWidth={2.5}
              strokeDasharray="6 6"
            />
          )}
        </svg>

        {/* target stack */}
        {phase !== 'zoom' && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 select-none" style={{ left: px(hoopLand.x, COURT_W), top: px(hoopLand.y, COURT_H) }}>
            <motion.div
              animate={flight && flight.made ? { x: [0, 14, 40], y: [0, -18, 30], rotate: [0, 60, 200], opacity: [1, 1, 0] } : { rotate: [0, -3, 3, 0] }}
              transition={flight && flight.made ? { duration: 0.5, delay: 0.5 } : { duration: 1.4, repeat: Infinity }}
              className="flex gap-0 text-2xl"
            >
              <span>{targetEmoji}</span>
              <span className="-ml-1">{targetEmoji}</span>
              <span className="-ml-1">{targetEmoji}</span>
            </motion.div>
          </div>
        )}

        {/* cannon */}
        {phase !== 'zoom' && (
          <div className="absolute" style={{ left: px(LAUNCH.x, COURT_W), top: px(LAUNCH.y, COURT_H) }}>
            <div style={{ transform: `translate(-14px,-14px) rotate(${-aimDeg}deg)`, transformOrigin: '14px 14px' }}>
              <svg width="64" height="34" viewBox="0 0 64 34" style={{ overflow: 'visible' }}>
                <g stroke="#1f2937" strokeWidth={3} strokeLinejoin="round">
                  <rect x="10" y="6" width="42" height="16" rx="8" fill="#475569" />
                  <rect x="48" y="3" width="8" height="22" rx="3" fill="#334155" />
                  <circle cx="14" cy="22" r="12" fill="#64748b" />
                  <circle cx="14" cy="22" r="4" fill="#1f2937" stroke="none" />
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* resting projectile */}
        {(phase === 'aim' || phase === 'power') && (
          <div className="absolute -translate-x-1/2 -translate-y-1/2 select-none text-2xl" style={{ left: px(LAUNCH.x, COURT_W), top: px(LAUNCH.y - 6, COURT_H) }}>
            🎳
          </div>
        )}

        {/* flying projectile */}
        {flight && phase === 'fly' && (
          <motion.div
            key={flight.id}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{ x: Math.cos(flight.theta) * flight.dist, y: -Math.sin(flight.theta) * flight.dist, rotate: 720 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={onFlightDone}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none text-3xl"
            style={{ left: px(LAUNCH.x, COURT_W), top: px(LAUNCH.y, COURT_H) }}
          >
            {flight.proj}
          </motion.div>
        )}

        {/* impact burst at the target */}
        {flight && phase === 'fly' && flight.made && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.4], opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-5xl"
            style={{ left: px(hoopLand.x, COURT_W), top: px(hoopLand.y, COURT_H) }}
          >
            💥
          </motion.div>
        )}

        {/* ZOOM: radian + SOH-CAH-TOA + reaction mascot */}
        {phase === 'zoom' && zoom && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={nextRound}
            className="absolute inset-0 flex flex-col items-center justify-start gap-1 bg-white/95 p-3 text-center"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={zoom.made ? { scale: [1, 1.25, 1] } : { rotate: [0, -10, 10, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <CharMascot kind={zoom.made ? 'panda' : 'monkey'} size={64} expr={zoom.made ? 'surprised' : 'cheer'} />
              </motion.div>
              <div>
                <div className={`text-2xl font-display font-extrabold ${zoom.made ? 'text-green-600' : 'text-rose-600'}`}>
                  {zoom.made ? 'DIRECT HIT! 💥' : zoom.powerRight ? 'So close! 😹' : 'Hahaha, missed! 😹'}
                </div>
                <div className="text-3xl font-display font-extrabold tabular-nums text-indigo-700">
                  {zoom.deg}° = {SCALE.find((a) => a.deg === zoom.deg)?.rad} rad
                </div>
              </div>
            </div>
            <TrigTriangle deg={zoom.deg} />
            <div className="grid w-full max-w-xs grid-cols-3 gap-1 text-xs font-display font-extrabold">
              <div className="rounded-lg bg-green-50 px-1 py-1 text-green-700">sin = opp/hyp<br />= {TRIG[zoom.deg]?.sin}</div>
              <div className="rounded-lg bg-sky-50 px-1 py-1 text-sky-700">cos = adj/hyp<br />= {TRIG[zoom.deg]?.cos}</div>
              <div className="rounded-lg bg-amber-50 px-1 py-1 text-amber-700">tan = opp/adj<br />= {TRIG[zoom.deg]?.tan}</div>
            </div>
            <div className="text-[11px] font-display font-bold text-slate-400">tap to continue</div>
          </motion.div>
        )}
      </div>

      {/* controls */}
      <div className="mx-auto mt-4 max-w-md">
        {phase === 'aim' || phase === 'fly' ? (
          <button
            type="button"
            onClick={lockAim}
            disabled={!running || phase === 'fly'}
            className="min-h-16 w-full rounded-3xl bg-orange-500 px-6 text-2xl font-display font-extrabold text-white shadow-[0_6px_0_0_rgba(0,0,0,0.18)] transition-all hover:bg-orange-600 active:translate-y-1 disabled:bg-slate-300"
          >
            🎯 LOCK {aimDeg}°
          </button>
        ) : phase === 'power' ? (
          <div className="grid grid-cols-3 gap-2">
            {POWERS.map((p, i) => (
              <button
                key={p.key}
                type="button"
                onClick={() => fire(i)}
                className="min-h-16 rounded-2xl bg-emerald-500 font-display font-extrabold text-white shadow-[0_5px_0_0_rgba(0,0,0,0.18)] transition-all hover:bg-emerald-600 active:translate-y-1"
              >
                <div className="text-xl">{p.emoji}</div>
                {p.label}
              </button>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={nextRound}
            className="min-h-16 w-full rounded-3xl bg-indigo-500 px-6 text-xl font-display font-extrabold text-white shadow-[0_6px_0_0_rgba(0,0,0,0.18)] transition-all hover:bg-indigo-600 active:translate-y-1"
          >
            ▶ Next shot
          </button>
        )}
        <p className="mt-2 text-center text-xs text-slate-400">
          Aim in degrees, knock down the {TARGETS[hoop.target].name}! After each shot see the radian + SOH-CAH-TOA. Hit {TARGET} to win.
        </p>
      </div>
    </div>
  );
}
