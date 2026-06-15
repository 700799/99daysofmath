import { useState, useEffect, useRef } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

const GAME_SECONDS = 60;
const POND_W = 340;
const POND_H = 260;
const HOOK_X = POND_W / 2;

interface Fish {
  id: number;
  y: number; // depth in px
  x: number;
  vx: number; // px/s, signed
  emoji: string;
  points: number;
}

interface FishingTheme {
  name: string;
  boat: string;
  waterGradient: string;
  fish: Array<{ emoji: string; points: number; speed: number }>;
}

const THEMES: FishingTheme[] = [
  {
    name: 'Pond',
    boat: '🚣',
    waterGradient: 'from-sky-200 via-cyan-300 to-cyan-600',
    fish: [
      { emoji: '🐟', points: 1, speed: 60 },
      { emoji: '🐠', points: 2, speed: 85 },
      { emoji: '🐡', points: 3, speed: 110 },
    ],
  },
  {
    name: 'Ocean',
    boat: '⛵',
    waterGradient: 'from-blue-400 via-blue-500 to-blue-700',
    fish: [
      { emoji: '🦈', points: 3, speed: 100 },
      { emoji: '🐙', points: 2, speed: 75 },
      { emoji: '🦑', points: 3, speed: 95 },
    ],
  },
  {
    name: 'River',
    boat: '🛶',
    waterGradient: 'from-emerald-200 via-emerald-400 to-emerald-600',
    fish: [
      { emoji: '🐟', points: 1, speed: 70 },
      { emoji: '🦐', points: 2, speed: 80 },
      { emoji: '🦀', points: 3, speed: 60 },
    ],
  },
  {
    name: 'Lake',
    boat: '🚤',
    waterGradient: 'from-slate-300 via-slate-400 to-slate-600',
    fish: [
      { emoji: '🐠', points: 1, speed: 65 },
      { emoji: '🐟', points: 2, speed: 85 },
      { emoji: '🦆', points: 2, speed: 100 },
    ],
  },
  {
    name: 'Swamp',
    boat: '🪵',
    waterGradient: 'from-green-700 via-green-800 to-green-900',
    fish: [
      { emoji: '🐢', points: 2, speed: 40 },
      { emoji: '🦑', points: 3, speed: 70 },
      { emoji: '🐍', points: 3, speed: 65 },
    ],
  },
];

export function Fishing() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem('fishing_theme');
    return saved ? Math.min(parseInt(saved), THEMES.length - 1) : 0;
  });
  const [showThemeSelector, setShowThemeSelector] = useState(true);
  const [fish, setFish] = useState<Fish[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [hookY, setHookY] = useState(0); // 0 = surface; animates down on cast
  const [casting, setCasting] = useState(false);
  const [splash, setSplash] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const nextId = useRef(1);
  const doneRef = useRef(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;
  const theme = THEMES[themeIdx];

  const selectTheme = (idx: number) => {
    setThemeIdx(idx);
    localStorage.setItem('fishing_theme', idx.toString());
    setShowThemeSelector(false);
  };

  const over = timeLeft <= 0;

  // Swim + spawn loop.
  useEffect(() => {
    if (over || outcome) return;
    let last = performance.now();
    let spawnIn = 0.2;
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      spawnIn -= dt;
      setFish((fs) => {
        let next = fs
          .map((f) => ({ ...f, x: f.x + f.vx * dt }))
          .filter((f) => f.x > -60 && f.x < POND_W + 60);
        if (spawnIn <= 0) {
          spawnIn = 0.9 + Math.random() * 1.1;
          const t = theme.fish[Math.floor(Math.random() * theme.fish.length)];
          const fromLeft = Math.random() < 0.5;
          next = [
            ...next,
            {
              id: nextId.current++,
              y: 50 + Math.random() * (POND_H - 90),
              x: fromLeft ? -40 : POND_W + 40,
              vx: (fromLeft ? 1 : -1) * (t.speed * (0.8 + Math.random() * 0.5)),
              emoji: t.emoji,
              points: t.points,
            },
          ];
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [over, outcome, theme.fish]);

  useEffect(() => {
    if (over && !doneRef.current) {
      doneRef.current = true;
      const baseXp = Math.max(1, Math.min(12, Math.floor(scoreRef.current / 2)));
      setTimeout(() => setOutcome(recordArcadePlay('fishing', baseXp)), 400);
    }
  }, [over, recordArcadePlay]);

  // Cast: hook drops, catches the first fish within range of its path.
  const cast = () => {
    if (casting || over || outcome || showThemeSelector) return;
    setCasting(true);
    const drop = { y: 0 };
    const start = performance.now();
    const DURATION = 700;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      drop.y = t * (POND_H - 20);
      setHookY(drop.y);
      // catch check
      let caughtOne = false;
      setFish((fs) => {
        const hit = fs.find(
          (f) => Math.abs(f.x - HOOK_X) < 28 && Math.abs(f.y - drop.y) < 24,
        );
        if (!hit) return fs;
        caughtOne = true;
        setScore((s) => s + hit.points);
        setCaught((c) => c + 1);
        setSplash(`${hit.emoji} +${hit.points}`);
        setTimeout(() => setSplash(null), 700);
        return fs.filter((f) => f.id !== hit.id);
      });
      if (caughtOne || t >= 1) {
        setTimeout(() => {
          setHookY(0);
          setCasting(false);
        }, 250);
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const reset = () => {
    setFish([]);
    setScore(0);
    setCaught(0);
    setTimeLeft(GAME_SECONDS);
    setHookY(0);
    setCasting(false);
    setOutcome(null);
    doneRef.current = false;
    setShowThemeSelector(true);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title={theme.name} emoji={theme.boat} />
        <ArcadeEndCard
          gameId="fishing"
          outcome={outcome}
          win={score >= 10}
          scoreLine={`${caught} fish, ${score} points!`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title={`${theme.name} Fishing`} emoji={theme.boat} />
      {showThemeSelector && (
        <div className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
          <p className="text-sm font-display font-bold text-slate-900 mb-3">Pick your fishing spot:</p>
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
                <span className="text-2xl block mb-1">{t.boat}</span>
                <span className="text-slate-700">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between max-w-sm mx-auto mb-2 text-sm font-display font-extrabold text-slate-700 tabular-nums">
        <span>{theme.fish[0].emoji} {caught} caught · {score} pts</span>
        <span>⏱ {timeLeft}s</span>
      </div>
      <div
        className={`relative mx-auto rounded-3xl border-2 border-slate-200 overflow-hidden select-none bg-gradient-to-b ${theme.waterGradient}`}
        style={{ width: POND_W, height: POND_H }}
      >
        {/* boat + line + hook */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-3xl" aria-hidden="true">{theme.boat}</div>
        <div
          className="absolute bg-slate-700"
          style={{ left: HOOK_X, top: 24, width: 2, height: Math.max(0, hookY - 14) }}
          aria-hidden="true"
        />
        <div
          className="absolute -translate-x-1/2 text-xl"
          style={{ left: HOOK_X + 1, top: hookY + 6 }}
          aria-hidden="true"
        >
          🪝
        </div>
        {fish.map((f) => (
          <div
            key={f.id}
            className="absolute text-3xl -translate-x-1/2 -translate-y-1/2"
            style={{ left: f.x, top: f.y, transform: `translate(-50%,-50%) scaleX(${f.vx > 0 ? 1 : -1})` }}
            aria-hidden="true"
          >
            {f.emoji}
          </div>
        ))}
        {splash && (
          <div className="absolute left-1/2 top-8 -translate-x-1/2 text-lg font-display font-extrabold text-white drop-shadow">
            {splash}
          </div>
        )}
      </div>
      <div className="max-w-sm mx-auto">
        <button
          type="button"
          onClick={cast}
          disabled={casting || showThemeSelector}
          className="mt-4 w-full min-h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white font-display font-extrabold text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
        >
          {casting ? 'Reeling…' : 'Drop the hook! 🎣'}
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          Time it so a fish swims under the boat. {theme.fish[theme.fish.length - 1].emoji} are worth {theme.fish[theme.fish.length - 1].points}!
        </p>
      </div>
    </div>
  );
}
