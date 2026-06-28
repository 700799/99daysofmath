import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Boba Shop — fill each customer's order by mixing tea : milk : boba in the
// right ratio (any equivalent ratio works). Ties directly to 6.RP ratios.
// Serve correctly before the timer runs out; wrong or late costs a life.

const CUSTOMERS = ['🐼', '🐱', '🐶', '🦊', '🐰', '🐻', '🐯', '🐸', '🧒', '👧'];
const ING = [
  { key: 'tea', emoji: '🍵', label: 'Tea' },
  { key: 'milk', emoji: '🥛', label: 'Milk' },
  { key: 'boba', emoji: '🟤', label: 'Boba' },
] as const;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function makeOrder(level: number): { target: [number, number, number]; who: string } {
  const max = 2 + Math.min(4, level);
  let t = 0,
    m = 0,
    b = 0;
  // at least two non-zero parts, all small, reduced to simplest form
  do {
    t = Math.floor(Math.random() * max) + 1;
    m = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * (max + 1));
  } while (t + m + b < 3);
  const g = gcd(gcd(t, m), b);
  return {
    target: [t / g, m / g, b / g] as [number, number, number],
    who: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
  };
}

// Is cup equivalent to target ratio? Cross-multiply; 0 parts must match.
function equivalent(cup: [number, number, number], target: [number, number, number]): boolean {
  if (cup.every((v) => v === 0)) return false;
  for (let i = 0; i < 3; i++)
    for (let j = i + 1; j < 3; j++) {
      if (cup[i] * target[j] !== cup[j] * target[i]) return false;
    }
  return true;
}

export function BobaShop() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const [order, setOrder] = useState(() => makeOrder(config.startLevel));
  const [cup, setCup] = useState<[number, number, number]>([0, 0, 0]);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const scoreRef = useRef(0);
  const servedRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const levelRef = useRef(config.startLevel);
  const timeRef = useRef(15);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  useArcadeClock(!!outcome);

  const orderTime = () => Math.max(8, 16 - levelRef.current);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 30) + 1));
    setOutcome(recordArcadePlay('boba', xp));
  };

  const nextOrder = () => {
    levelRef.current = config.startLevel + Math.floor(servedRef.current / 4);
    setOrder(makeOrder(levelRef.current));
    setCup([0, 0, 0]);
    timeRef.current = orderTime();
  };

  const loseLife = () => {
    livesRef.current -= 1;
    if (livesRef.current <= 0) {
      finish();
      return;
    }
    nextOrder();
  };

  // 1Hz order timer
  useEffect(() => {
    if (outcome) return;
    const id = setInterval(() => {
      timeRef.current -= 1;
      if (timeRef.current <= 0) {
        setFlash('bad');
        loseLife();
      }
      redraw();
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const add = (i: number, d: number) => {
    if (outcome) return;
    setCup((c) => {
      const n: [number, number, number] = [...c] as [number, number, number];
      n[i] = Math.max(0, n[i] + d);
      return n;
    });
  };

  const serve = () => {
    if (outcome) return;
    if (equivalent(cup, order.target)) {
      scoreRef.current += 10 + levelRef.current * 2;
      servedRef.current += 1;
      setFlash('good');
      nextOrder();
    } else {
      setFlash('bad');
      loseLife();
    }
    setTimeout(() => setFlash(null), 500);
  };

  const reset = () => {
    scoreRef.current = 0;
    servedRef.current = 0;
    livesRef.current = config.livesPerSession;
    levelRef.current = config.startLevel;
    timeRef.current = orderTime();
    doneRef.current = false;
    setOrder(makeOrder(config.startLevel));
    setCup([0, 0, 0]);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Boba Shop" emoji="🧋" />
        <ArcadeEndCard
          gameId="boba"
          outcome={outcome}
          win={servedRef.current >= 5}
          scoreLine={`${scoreRef.current} points · ${servedRef.current} served`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Boba Shop" emoji="🧋" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-orange-600 tabular-nums">⏱ {Math.max(0, timeRef.current)}s</span>
      </div>

      <div
        className={`max-w-sm mx-auto rounded-3xl border-2 p-4 text-center transition-colors ${
          flash === 'good'
            ? 'bg-emerald-50 border-emerald-300'
            : flash === 'bad'
              ? 'bg-rose-50 border-rose-300'
              : 'bg-amber-50 border-amber-200'
        }`}
      >
        <div className="text-5xl">{order.who}</div>
        <div className="mt-1 text-sm font-display font-bold text-slate-700">wants this ratio</div>
        <div className="mt-2 flex items-center justify-center gap-2 text-xl font-display font-extrabold text-slate-900">
          {ING.map((ing, i) => (
            <span key={ing.key} className="inline-flex items-center gap-1">
              {i > 0 && <span className="text-slate-400">:</span>}
              {ing.emoji} {order.target[i]}
            </span>
          ))}
        </div>
      </div>

      {/* cup */}
      <div className="max-w-sm mx-auto mt-3 grid grid-cols-3 gap-2">
        {ING.map((ing, i) => (
          <div key={ing.key} className="rounded-2xl bg-white border-2 border-slate-200 p-2 text-center">
            <div className="text-2xl">{ing.emoji}</div>
            <div className="font-display font-extrabold text-2xl text-slate-900 tabular-nums">{cup[i]}</div>
            <div className="mt-1 flex gap-1 justify-center">
              <button
                type="button"
                onClick={() => add(i, -1)}
                className="w-9 h-9 rounded-lg bg-slate-100 font-display font-extrabold text-slate-700"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => add(i, 1)}
                className="w-9 h-9 rounded-lg bg-emerald-500 text-white font-display font-extrabold"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-sm mx-auto mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setCup([0, 0, 0])}
          className="min-h-12 px-4 rounded-2xl bg-slate-100 font-display font-extrabold text-slate-700"
        >
          🗑️ Empty
        </button>
        <button
          type="button"
          onClick={serve}
          className="flex-1 min-h-12 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-display font-extrabold text-lg shadow active:translate-y-0.5"
        >
          Serve 🧋
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Mix the same ratio — any equivalent amount works (2:1:3 = 4:2:6)!
      </p>
    </div>
  );
}
