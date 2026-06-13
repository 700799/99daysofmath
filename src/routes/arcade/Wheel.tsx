import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

const SEGMENTS = [5, 20, 8, 12, 40, 10, 25, 15]; // XP prizes around the wheel
const COLORS = ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#facc15', '#3b82f6', '#ec4899', '#14b8a6'];

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function wedgePath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`;
}

export function Wheel() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const lastSpin = useProgress((s) => s.lastWheelSpinDate);
  const alreadySpun = lastSpin === todayISO();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const doneRef = useRef(false);

  const spin = () => {
    if (spinning || alreadySpun || doneRef.current) return;
    const idx = Math.floor(Math.random() * SEGMENTS.length);
    const seg = 360 / SEGMENTS.length;
    // Land the chosen segment's center under the top pointer (pointer at -90°).
    const target = 360 * 5 + (270 - (idx * seg + seg / 2));
    setSpinning(true);
    setRotation(target);
    setTimeout(() => {
      doneRef.current = true;
      const won = SEGMENTS[idx];
      setPrize(won);
      setOutcome(recordArcadePlay('wheel', won, { wheelSpin: true }));
      setSpinning(false);
    }, 3600);
  };

  const size = 280;
  const c = size / 2;
  const seg = (2 * Math.PI) / SEGMENTS.length;

  if (prize != null && outcome) {
    return (
      <div>
        <ArcadeHeader title="Prize Wheel" emoji="🎡" />
        <ArcadeEndCard
          gameId="wheel"
          outcome={outcome}
          win={prize >= 20}
          scoreLine={`You won ${prize} XP! 🎉`}
          onReplay={() => {}}
        />
        <p className="text-center text-xs text-slate-400 mt-2">
          The wheel resets at midnight — come back tomorrow for another spin!
        </p>
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Prize Wheel" emoji="🎡" />
      <p className="text-sm text-slate-600 mb-4 text-center">
        {alreadySpun
          ? 'You already spun today — come back tomorrow! 🌙'
          : 'One spin per day. Tap SPIN and cross your fingers!'}
      </p>

      <div className="relative mx-auto" style={{ width: size, height: size }}>
        {/* pointer */}
        <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 text-3xl" aria-hidden="true">
          🔻
        </div>
        <motion.svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          animate={{ rotate: rotation }}
          transition={{ duration: 3.5, ease: [0.12, 0.65, 0.08, 1] }}
          style={{ originX: '50%', originY: '50%' }}
          className={alreadySpun ? 'opacity-50' : ''}
        >
          {SEGMENTS.map((xp, i) => {
            const a0 = i * seg - Math.PI / 2;
            const a1 = (i + 1) * seg - Math.PI / 2;
            const mid = (a0 + a1) / 2;
            const tx = c + c * 0.62 * Math.cos(mid);
            const ty = c + c * 0.62 * Math.sin(mid);
            return (
              <g key={i}>
                <path d={wedgePath(c, c, c - 4, a0, a1)} fill={COLORS[i]} stroke="#fff" strokeWidth={3} />
                <text
                  x={tx}
                  y={ty}
                  fontSize={18}
                  fontWeight={900}
                  fill="#fff"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${(mid * 180) / Math.PI + 90} ${tx} ${ty})`}
                >
                  {xp}
                </text>
              </g>
            );
          })}
          <circle cx={c} cy={c} r={26} fill="#fff" stroke="#0f172a" strokeWidth={3} />
          <text x={c} y={c + 6} fontSize={18} textAnchor="middle" fontWeight={900} fill="#0f172a">
            XP
          </text>
        </motion.svg>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={spin}
          disabled={spinning || alreadySpun}
          className="min-h-14 px-10 py-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-slate-300 text-white font-display font-extrabold text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:cursor-not-allowed transition-all"
        >
          {spinning ? 'Spinning…' : alreadySpun ? 'Come back tomorrow' : 'SPIN!'}
        </button>
      </div>
    </div>
  );
}
