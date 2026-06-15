import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

const SEGMENTS = [5, 20, 8, 12, 40, 10, 25, 15]; // XP prizes around the wheel

interface WheelTheme {
  name: string;
  emoji: string;
  colors: string[];
  buttonColor: string;
  buttonHoverColor: string;
}

const THEMES: WheelTheme[] = [
  {
    name: 'Classic',
    emoji: '🎡',
    colors: ['#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#facc15', '#3b82f6', '#ec4899', '#14b8a6'],
    buttonColor: '#d946ef',
    buttonHoverColor: '#c026d3',
  },
  {
    name: 'Summer',
    emoji: '☀️',
    colors: ['#fbbf24', '#fcd34d', '#fef08a', '#fef3c7', '#fed7aa', '#fdba74', '#fb923c', '#f97316'],
    buttonColor: '#f59e0b',
    buttonHoverColor: '#d97706',
  },
  {
    name: 'Ocean',
    emoji: '🌊',
    colors: ['#0ea5e9', '#06b6d4', '#10b981', '#14b8a6', '#0d9488', '#0891b2', '#1e40af', '#3b82f6'],
    buttonColor: '#0284c7',
    buttonHoverColor: '#0369a1',
  },
  {
    name: 'Neon',
    emoji: '✨',
    colors: ['#ec4899', '#a855f7', '#6366f1', '#8b5cf6', '#d946ef', '#06b6d4', '#10b981', '#fbbf24'],
    buttonColor: '#7c3aed',
    buttonHoverColor: '#6d28d9',
  },
];

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

  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem('wheel_theme');
    return saved ? Math.min(parseInt(saved), THEMES.length - 1) : 0;
  });
  const [showThemeSelector, setShowThemeSelector] = useState(true);
  const theme = THEMES[themeIdx];

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [prize, setPrize] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const doneRef = useRef(false);

  const selectTheme = (idx: number) => {
    setThemeIdx(idx);
    localStorage.setItem('wheel_theme', idx.toString());
    setShowThemeSelector(false);
  };

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
        <ArcadeHeader title={`${theme.name} Wheel`} emoji={theme.emoji} />
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
      <ArcadeHeader title={`${theme.name} Wheel`} emoji={theme.emoji} />
      {showThemeSelector && (
        <div className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
          <p className="text-sm font-display font-bold text-slate-900 mb-3">Pick your wheel theme:</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectTheme(idx)}
                className={`p-3 rounded-xl text-sm font-display font-bold transition-all ${
                  themeIdx === idx
                    ? 'bg-white ring-2 ring-blue-500 shadow-lg'
                    : 'bg-white/50 hover:bg-white'
                }`}
              >
                <span className="text-2xl block mb-1">{t.emoji}</span>
                <span className="text-slate-700">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
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
                <path d={wedgePath(c, c, c - 4, a0, a1)} fill={theme.colors[i]} stroke="#fff" strokeWidth={3} />
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
          disabled={spinning || alreadySpun || showThemeSelector}
          style={{
            backgroundColor: spinning || alreadySpun || showThemeSelector ? '#d1d5db' : theme.buttonColor,
          }}
          onMouseEnter={(e) => {
            if (!spinning && !alreadySpun && !showThemeSelector) {
              e.currentTarget.style.backgroundColor = theme.buttonHoverColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!spinning && !alreadySpun && !showThemeSelector) {
              e.currentTarget.style.backgroundColor = theme.buttonColor;
            }
          }}
          className="min-h-14 px-10 py-3 rounded-2xl text-white font-display font-extrabold text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:cursor-not-allowed transition-all"
        >
          {spinning ? 'Spinning…' : alreadySpun ? 'Come back tomorrow' : 'SPIN!'}
        </button>
      </div>
    </div>
  );
}
