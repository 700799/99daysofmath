import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// 3-lane top-down racer. Auto-drives forward; tap left/right to swap lanes.
// Avoid obstacles, grab power-ups for time bonus. 45-second session.

const VIEW_W = 360;
const VIEW_H = 440;
const LANES = [60, 180, 300]; // pixel x-centers for each lane
const CAR_Y = VIEW_H - 90;
const SESSION_SECONDS = 45;

// Environment themes
interface RaceTheme {
  name: string;
  car: string;
  obstacle: string;
  powerup: string;
  bgGradient: string; // Tailwind classes
  laneColor: string;
  laneGradient: string;
}

const THEMES: RaceTheme[] = [
  {
    name: 'Desert',
    car: '🏎️',
    obstacle: '🪨',
    powerup: '⚡',
    bgGradient: 'from-amber-700 to-amber-900',
    laneColor: 'amber-300',
    laneGradient: 'linear-gradient(180deg, transparent 0 16px, #FBBF24 16px 36px, transparent 36px 52px)',
  },
  {
    name: 'Forest',
    car: '🚙',
    obstacle: '🌲',
    powerup: '🍎',
    bgGradient: 'from-green-700 to-green-900',
    laneColor: 'lime-300',
    laneGradient: 'linear-gradient(180deg, transparent 0 16px, #BFEF45 16px 36px, transparent 36px 52px)',
  },
  {
    name: 'City',
    car: '🚗',
    obstacle: '🚙',
    powerup: '⚡',
    bgGradient: 'from-slate-600 to-slate-800',
    laneColor: 'yellow-300',
    laneGradient: 'linear-gradient(180deg, transparent 0 16px, #FCD34D 16px 36px, transparent 36px 52px)',
  },
  {
    name: 'Space',
    car: '🚀',
    obstacle: '☄️',
    powerup: '⭐',
    bgGradient: 'from-indigo-900 to-slate-900',
    laneColor: 'cyan-300',
    laneGradient: 'linear-gradient(180deg, transparent 0 16px, #06B6D4 16px 36px, transparent 36px 52px)',
  },
];

type Obstacle = {
  id: number;
  kind: 'cone' | 'fuel';
  lane: 0 | 1 | 2;
  y: number;
};

export function RaceCar() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem('racer_theme');
    return saved ? Math.min(parseInt(saved), THEMES.length - 1) : 0;
  });
  const [showThemeSelector, setShowThemeSelector] = useState(true);
  useArcadeClock(!!outcome);

  const laneRef = useRef<0 | 1 | 2>(1);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const distanceRef = useRef(0);
  const speedRef = useRef(220);
  const livesRef = useRef(3);
  const timeLeftRef = useRef(SESSION_SECONDS);
  const lastTickRef = useRef(performance.now());
  const spawnTimerRef = useRef(0);
  const idRef = useRef(1);
  const rafRef = useRef(0);

  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  const theme = THEMES[themeIdx];

  const selectTheme = (idx: number) => {
    setThemeIdx(idx);
    localStorage.setItem('racer_theme', idx.toString());
    setShowThemeSelector(false);
  };

  const setLane = (n: 0 | 1 | 2) => {
    if (outcome) return;
    laneRef.current = n;
    redraw();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') setLane(Math.max(0, laneRef.current - 1) as 0 | 1 | 2);
      if (e.key === 'ArrowRight' || e.key === 'd') setLane(Math.min(2, laneRef.current + 1) as 0 | 1 | 2);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (outcome) return;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      timeLeftRef.current -= dt;
      const speed = (speedRef.current = Math.min(440, 220 + distanceRef.current * 0.05));
      distanceRef.current += speed * dt;

      // Spawn obstacles every ~0.55 s (faster as speed creeps up).
      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        const kind = Math.random() < 0.18 ? 'fuel' : 'cone';
        obstaclesRef.current.push({
          id: idRef.current++,
          kind,
          lane,
          y: -40,
        });
        spawnTimerRef.current = 0.45 + Math.random() * 0.25;
      }

      // Move + collide.
      for (const ob of obstaclesRef.current) {
        ob.y += speed * dt;
        if (ob.y > CAR_Y - 30 && ob.y < CAR_Y + 30 && ob.lane === laneRef.current) {
          if (ob.kind === 'cone') {
            livesRef.current -= 1;
            ob.y = VIEW_H + 100; // remove
            if (livesRef.current <= 0) {
              finish();
              return;
            }
          } else if (ob.kind === 'fuel') {
            timeLeftRef.current = Math.min(SESSION_SECONDS + 5, timeLeftRef.current + 3);
            ob.y = VIEW_H + 100;
          }
        }
      }
      obstaclesRef.current = obstaclesRef.current.filter((ob) => ob.y < VIEW_H + 80);

      if (timeLeftRef.current <= 0) {
        finish();
        return;
      }

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const finish = () => {
    const xp = Math.max(1, Math.min(22, Math.floor(distanceRef.current / 200)));
    setOutcome(recordArcadePlay('racer', xp));
  };

  const reset = () => {
    laneRef.current = 1;
    obstaclesRef.current = [];
    distanceRef.current = 0;
    speedRef.current = 220;
    livesRef.current = 3;
    timeLeftRef.current = SESSION_SECONDS;
    spawnTimerRef.current = 0;
    setOutcome(null);
    setShowThemeSelector(true);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Race Car" emoji={theme.car} />
        <ArcadeEndCard
          gameId="racer"
          outcome={outcome}
          win={distanceRef.current >= 4000}
          scoreLine={`${Math.floor(distanceRef.current)}m driven · ${livesRef.current}❤️ left`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title={`${theme.name} Race · 45s`} emoji={theme.car} />
      {showThemeSelector && (
        <div className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
          <p className="text-sm font-display font-bold text-slate-900 mb-3">Pick your track:</p>
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
                <span className="text-2xl block mb-1">{t.car}</span>
                <span className="text-slate-700">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-display font-extrabold text-slate-900">
          {'❤️'.repeat(livesRef.current)}
          {'🤍'.repeat(Math.max(0, 3 - livesRef.current))}
        </div>
        <div className="text-sm font-display font-bold text-slate-600 tabular-nums">
          🛣️ {Math.floor(distanceRef.current)}m · ⏱ {Math.max(0, Math.ceil(timeLeftRef.current))}s
        </div>
      </div>

      <div
        className={`relative mx-auto rounded-2xl bg-gradient-to-b ${theme.bgGradient} border-2 border-slate-300 overflow-hidden select-none`}
        style={{ width: '100%', maxWidth: VIEW_W, height: VIEW_H }}
      >
        {/* lane stripes — scroll using a CSS animation tied to speed */}
        <div className="absolute inset-y-0 left-1/3 w-1.5 opacity-80" style={{ backgroundImage: theme.laneGradient, backgroundSize: '100% 52px' }} />
        <div className="absolute inset-y-0 left-2/3 w-1.5 opacity-80" style={{ backgroundImage: theme.laneGradient, backgroundSize: '100% 52px' }} />

        {/* obstacles */}
        {obstaclesRef.current.map((ob) => (
          <div
            key={ob.id}
            className="absolute text-4xl"
            style={{ left: LANES[ob.lane] - 22, top: ob.y, transition: 'none' }}
            aria-hidden="true"
          >
            {ob.kind === 'cone' ? theme.obstacle : theme.powerup}
          </div>
        ))}

        {/* car */}
        <div
          className="absolute text-5xl transition-[left] duration-150 ease-out"
          style={{ left: LANES[laneRef.current] - 28, top: CAR_Y - 28 }}
          aria-hidden="true"
        >
          {theme.car}
        </div>
      </div>

      {/* lane buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setLane(Math.max(0, laneRef.current - 1) as 0 | 1 | 2)}
          disabled={showThemeSelector}
          className="min-h-16 rounded-2xl bg-white border-2 border-slate-200 font-display font-extrabold text-2xl shadow disabled:opacity-50"
        >
          ← Left
        </button>
        <button
          type="button"
          onClick={() => setLane(Math.min(2, laneRef.current + 1) as 0 | 1 | 2)}
          disabled={showThemeSelector}
          className="min-h-16 rounded-2xl bg-white border-2 border-slate-200 font-display font-extrabold text-2xl shadow disabled:opacity-50"
        >
          Right →
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Swerve around {theme.obstacle}. Grab {theme.powerup} for time bonuses!
      </p>
    </div>
  );
}
