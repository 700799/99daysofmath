import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Aim-and-power basketball. Adjust the horizontal aim and shot power with
// sliders, then tap SHOOT. The closer you are to the sweet spot, the higher
// your make %. Score TARGET baskets in SESSION_SECONDS seconds to win.

const SESSION_SECONDS = 30;
const TARGET = 8;

// Sweet-spot values: aim=0 (centre), power=72
const PERFECT_POWER = 72;
const AIM_MAX      = 15;    // ±15 slider steps
const POWER_MIN    = 30;
const POWER_MAX    = 100;

type Shot = { id: number; made: boolean; aim: number; power: number };

/** How likely the shot goes in given aim & power settings. */
function makeChance(aim: number, power: number, streak: number): number {
  const aimError   = Math.abs(aim) / AIM_MAX;            // 0 perfect → 1 worst
  const powerError = Math.abs(power - PERFECT_POWER) / (POWER_MAX - POWER_MIN);
  const base       = Math.max(0.05, 1 - aimError * 0.65 - powerError * 0.65);
  return Math.min(0.98, base + streak * 0.04);           // sympathy bonus after misses
}

/** Compute the ball trajectory anchor points for the SVG preview arc. */
function arcPath(aim: number, power: number, courtW: number, courtH: number) {
  // Ball starts lower-left; hoop is upper-right.
  const startX = 28, startY = courtH - 24;
  const hoopX  = courtW - 30, hoopY = 40;

  // Aim shifts the landing X relative to the hoop.
  const landX  = hoopX + (aim / AIM_MAX) * 60;
  // Power changes peak height.
  const peakH  = 20 + ((power - POWER_MIN) / (POWER_MAX - POWER_MIN)) * (courtH * 0.75);
  const midX   = (startX + landX) / 2;
  const midY   = courtH - peakH;

  return `M ${startX} ${startY} Q ${midX} ${midY} ${landX} ${hoopY}`;
}

// Perfect-zone colours for the sliders.
const aimColour = (aim: number) =>
  Math.abs(aim) <= 3  ? 'bg-green-400'
  : Math.abs(aim) <= 7 ? 'bg-amber-400'
  : 'bg-red-400';

const powerColour = (power: number) =>
  Math.abs(power - PERFECT_POWER) <= 8  ? 'bg-green-400'
  : Math.abs(power - PERFECT_POWER) <= 18 ? 'bg-amber-400'
  : 'bg-red-400';

export function Shootout() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const [makes, setMakes]             = useState(0);
  const [shotsTaken, setShotsTaken]   = useState(0);
  const [shots, setShots]             = useState<Shot[]>([]);
  const [missStreak, setMissStreak]   = useState(0);
  const [aim, setAim]                 = useState(0);
  const [power, setPower]             = useState(PERFECT_POWER);
  const [courtSize, setCourtSize]     = useState({ w: 320, h: 200 });

  const shotIdRef    = useRef(1);
  const tickRef      = useRef<number | undefined>(undefined);
  const startedRef   = useRef<number | undefined>(undefined);
  const courtRef     = useRef<HTMLDivElement>(null);

  const running = !outcome && secondsLeft > 0;
  const won     = makes >= TARGET;

  // Measure the court element so the SVG arc is accurate.
  useEffect(() => {
    if (!courtRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setCourtSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(courtRef.current);
    return () => ro.disconnect();
  }, []);

  // 1 Hz countdown — starts on first SHOOT tap.
  useEffect(() => {
    if (!running || startedRef.current === undefined) return;
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, shotsTaken === 0 ? null : 'started']);

  // Game over when timer or target hit.
  useEffect(() => {
    if (outcome) return;
    if (secondsLeft === 0 || won) {
      const xp    = Math.max(1, Math.min(20, makes));
      const bonus = won && secondsLeft > 0 ? 3 : 0;
      setOutcome(recordArcadePlay('shootout', xp + bonus));
    }
  }, [secondsLeft, won, outcome, makes, recordArcadePlay]);

  const shoot = () => {
    if (!running) return;
    if (startedRef.current === undefined) startedRef.current = Date.now();

    const made = Math.random() < makeChance(aim, power, missStreak);
    const id   = shotIdRef.current++;
    setShots((s) => [...s.slice(-3), { id, made, aim, power }]);
    setShotsTaken((n) => n + 1);
    if (made) {
      setMakes((m) => m + 1);
      setMissStreak(0);
    } else {
      setMissStreak((n) => n + 1);
    }
    window.setTimeout(() => setShots((s) => s.filter((x) => x.id !== id)), 900);
  };

  const reset = () => {
    setOutcome(null);
    setSecondsLeft(SESSION_SECONDS);
    setMakes(0);
    setShotsTaken(0);
    setShots([]);
    setMissStreak(0);
    setAim(0);
    setPower(PERFECT_POWER);
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
              ? `🔥 ${makes} baskets — target smashed!`
              : `${makes} of ${TARGET} baskets. Try again!`
          }
          onReplay={reset}
        />
      </div>
    );
  }

  const accuracy  = shotsTaken ? Math.round((makes / shotsTaken) * 100) : 0;
  const path      = arcPath(aim, power, courtSize.w, courtSize.h);
  const chance    = Math.round(makeChance(aim, power, missStreak) * 100);
  const aimPct    = ((aim + AIM_MAX) / (AIM_MAX * 2)) * 100;
  const powerPct  = ((power - POWER_MIN) / (POWER_MAX - POWER_MIN)) * 100;

  return (
    <div>
      <ArcadeHeader title="Shootout · 30s" emoji="🏀" />
      <p className="text-sm text-slate-600 mb-3">
        Set your <b>aim</b> and <b>power</b>, then tap <b>SHOOT!</b> Score{' '}
        <b>{TARGET}</b> baskets in 30 seconds.
      </p>

      {/* scoreboard */}
      <div className="flex justify-between items-center mb-3 max-w-sm mx-auto px-1">
        <div className="text-2xl font-display font-extrabold text-orange-600 tabular-nums">
          ⏱ {secondsLeft}s
        </div>
        <div className="text-2xl font-display font-extrabold text-green-700 tabular-nums">
          🏀 {makes}/{TARGET}
        </div>
        <div className="text-xs font-display font-bold text-slate-500">
          {accuracy}% acc
        </div>
      </div>

      {/* court */}
      <div
        ref={courtRef}
        className="relative max-w-sm mx-auto h-48 bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl border-2 border-slate-200 overflow-hidden"
      >
        {/* hoop */}
        <div className="absolute right-4 top-1 text-6xl select-none" aria-hidden="true">🥅</div>
        <div className="absolute right-6 top-[68px] w-14 h-2 bg-orange-500 rounded-full" />

        {/* aim arc SVG preview */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${courtSize.w} ${courtSize.h}`}
          preserveAspectRatio="none"
        >
          <path
            d={path}
            fill="none"
            stroke={chance >= 70 ? '#22c55e' : chance >= 40 ? '#f59e0b' : '#ef4444'}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            opacity="0.7"
          />
          {/* landing dot */}
          <circle
            cx={courtSize.w - 30 + (aim / AIM_MAX) * 60}
            cy={40}
            r="5"
            fill={chance >= 70 ? '#22c55e' : chance >= 40 ? '#f59e0b' : '#ef4444'}
            opacity="0.9"
          />
        </svg>

        {/* shot animations */}
        <AnimatePresence>
          {shots.map((s) => {
            const landX = courtSize.w - 30 + (s.aim / AIM_MAX) * 60;
            return (
              <motion.div
                key={s.id}
                initial={{ left: 28, bottom: 24, opacity: 1 }}
                animate={
                  s.made
                    ? { left: landX - 16, bottom: courtSize.h - 48, opacity: [1,1,1] }
                    : { left: landX - 16, bottom: courtSize.h - 40, opacity: [1,1,0.5] }
                }
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute text-4xl select-none"
                aria-hidden="true"
              >
                🏀
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* made flash */}
        {shots.some((s) => s.made) && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute right-3 top-14 text-xl font-display font-extrabold text-green-600"
          >
            SWISH!
          </motion.div>
        )}

        {/* make % badge */}
        <div className={`absolute top-2 left-3 text-xs font-display font-extrabold px-2 py-1 rounded-full text-white ${
          chance >= 70 ? 'bg-green-500' : chance >= 40 ? 'bg-amber-500' : 'bg-red-500'
        }`}>
          {chance}% make
        </div>
      </div>

      {/* ── controls ── */}
      <div className="max-w-sm mx-auto mt-4 space-y-4 px-1">

        {/* Aim slider */}
        <div>
          <div className="flex justify-between text-xs font-display font-bold text-slate-500 mb-1">
            <span>◀ Aim left</span>
            <span className={`font-extrabold ${aim === 0 ? 'text-green-600' : 'text-slate-700'}`}>
              {aim === 0 ? '✓ Centre' : aim > 0 ? `+${aim} right` : `${aim} left`}
            </span>
            <span>Aim right ▶</span>
          </div>
          <div className="relative h-8 flex items-center">
            {/* track */}
            <div className="w-full h-3 rounded-full bg-slate-200 relative overflow-hidden">
              {/* sweet-zone highlight */}
              <div
                className="absolute top-0 h-full bg-green-100"
                style={{ left: '44%', width: '12%' }}
              />
              {/* fill */}
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all ${aimColour(aim)}`}
                style={{ width: `${aimPct}%` }}
              />
            </div>
            <input
              type="range"
              min={-AIM_MAX}
              max={AIM_MAX}
              step={1}
              value={aim}
              onChange={e => setAim(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-8"
            />
          </div>
          {/* tick labels */}
          <div className="flex justify-between text-[9px] text-slate-400 px-0.5 mt-0.5">
            <span>◀◀</span><span>◀</span><span className="font-bold text-green-600">●</span><span>▶</span><span>▶▶</span>
          </div>
        </div>

        {/* Power slider */}
        <div>
          <div className="flex justify-between text-xs font-display font-bold text-slate-500 mb-1">
            <span>💤 Weak</span>
            <span className={`font-extrabold ${Math.abs(power - PERFECT_POWER) <= 5 ? 'text-green-600' : 'text-slate-700'}`}>
              {power}% power
              {Math.abs(power - PERFECT_POWER) <= 5 && ' ✓'}
            </span>
            <span>Too strong 🚀</span>
          </div>
          <div className="relative h-8 flex items-center">
            <div className="w-full h-3 rounded-full bg-slate-200 relative overflow-hidden">
              {/* sweet zone: ~65-80% of slider width */}
              <div
                className="absolute top-0 h-full bg-green-100"
                style={{
                  left: `${((65 - POWER_MIN) / (POWER_MAX - POWER_MIN)) * 100}%`,
                  width: `${((80 - 65) / (POWER_MAX - POWER_MIN)) * 100}%`,
                }}
              />
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all ${powerColour(power)}`}
                style={{ width: `${powerPct}%` }}
              />
            </div>
            <input
              type="range"
              min={POWER_MIN}
              max={POWER_MAX}
              step={1}
              value={power}
              onChange={e => setPower(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-8"
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 px-0.5 mt-0.5">
            <span>{POWER_MIN}%</span>
            <span className="font-bold text-green-600">sweet spot</span>
            <span>{POWER_MAX}%</span>
          </div>
        </div>

        {/* Shoot button */}
        <button
          type="button"
          onClick={shoot}
          disabled={!running}
          className="w-full min-h-16 rounded-3xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-display font-extrabold text-3xl shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
        >
          SHOOT! 🏀
        </button>

        <p className="text-center text-xs text-slate-400">
          Green arc = good shot · Keep aim centred and power near the sweet spot
        </p>
      </div>
    </div>
  );
}
