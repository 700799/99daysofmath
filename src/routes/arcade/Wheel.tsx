import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { GameStage, useBurst, BurstLayer, useScorePops, ScorePopLayer } from './fx';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// A 12-slice wheel whose prizes repeat so each prize has TIDY odds:
//   5 XP ×4 = 4/12 = 1/3 · 10 XP ×3 = 3/12 = 1/4 · 20 XP ×2 = 1/6 ·
//   30 XP ×2 = 1/6 · 50 XP ×1 = 1/12. Slices are interleaved for variety.
const SEGMENTS = [5, 10, 20, 5, 30, 10, 5, 20, 30, 5, 10, 50];
const VALUE_COLOR: Record<number, string> = {
  5: '#f59e0b', 10: '#3b82f6', 20: '#10b981', 30: '#ec4899', 50: '#facc15',
};

function gcd(a: number, b: number): number { while (b) { [a, b] = [b, a % b]; } return a; }
function fraction(count: number, total: number): string {
  const g = gcd(count, total) || 1;
  return `${count / g}/${total / g}`;
}
// Each distinct prize with its probability as a reduced fraction, richest first.
function oddsLegend(): { xp: number; frac: string; color: string }[] {
  const total = SEGMENTS.length;
  const counts = new Map<number, number>();
  for (const v of SEGMENTS) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([xp, count]) => ({ xp, frac: fraction(count, total), color: VALUE_COLOR[xp] }));
}

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
  const celebrate = useProgress((s) => s.celebrate);
  const lastSpin = useProgress((s) => s.lastWheelSpinDate);
  const alreadySpun = lastSpin === todayISO();

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const doneRef = useRef(false);

  // Juice layers.
  const { burst, particles } = useBurst();
  const { pops, pop } = useScorePops();

  const size = 280;

  const spin = () => {
    if (spinning || alreadySpun || doneRef.current) return;
    const idx = Math.floor(Math.random() * SEGMENTS.length);
    const seg = 360 / SEGMENTS.length;
    // Land the chosen segment's center under the top pointer (pointer at -90°).
    const target = 360 * 5 + (270 - (idx * seg + seg / 2));
    setSpinning(true);
    setRotation(target);
    // Rising tension: a laser whoosh at launch, then quickening ticks.
    sfx.laser();
    haptic(HAPTIC.tap);
    [700, 1500, 2300, 2900, 3300].forEach((t) =>
      setTimeout(() => {
        if (!doneRef.current) sfx.step();
      }, t),
    );
    setTimeout(() => {
      doneRef.current = true;
      const won = SEGMENTS[idx];
      setPrize(won);
      setOutcome(recordArcadePlay('wheel', won, { wheelSpin: true }));
      setSpinning(false);
      // Landing payoff at the pointer.
      if (won >= 20) sfx.win();
      else sfx.coin();
      haptic(HAPTIC.win);
      burst(size / 2, 10, { emoji: '🎉', count: 16 });
      burst(size / 2, 10, { color: VALUE_COLOR[won] ?? '#facc15', count: 16 });
      pop(size / 2 - 26, 20, `+${won} XP`, VALUE_COLOR[won] ?? '#facc15');
      celebrate(); // champion cinematic for the reward
    }, 3600);
  };

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

      <GameStage theme="wheel" className="w-fit mx-auto p-5">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <BurstLayer api={{ burst, particles }} />
        <ScorePopLayer pops={pops} />
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
                <path d={wedgePath(c, c, c - 4, a0, a1)} fill={VALUE_COLOR[xp]} stroke="#fff" strokeWidth={3} />
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
      </GameStage>

      {/* exact odds for each prize, as reduced fractions */}
      <div className="mt-4 max-w-sm mx-auto rounded-2xl bg-white border-2 border-slate-200 p-3">
        <div className="text-xs font-display font-extrabold uppercase tracking-wide text-slate-500 text-center mb-2">
          Your chances (12 slices)
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {oddsLegend().map((o) => (
            <div key={o.xp} className="flex items-center gap-2 text-sm font-display font-bold text-slate-700">
              <span className="inline-block w-4 h-4 rounded-sm" style={{ background: o.color }} />
              <span className="tabular-nums">{o.xp} XP</span>
              <span className="ml-auto tabular-nums text-indigo-600">{o.frac}</span>
            </div>
          ))}
        </div>
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
