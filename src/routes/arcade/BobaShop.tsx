import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer, useScorePops, ScorePopLayer } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Boba Shop — the shop gives a small base recipe (in grams) and a required
// multiplier; you must SCALE IT UP exactly. e.g. base 1:2:6 with ×5 means pour
// 5:10:30 g. Only an exact scaled match serves. Ties to 6.RP ratio reasoning.
// The multiplier (biased to ×5/×7) and base size grow with level.

const CUSTOMERS = ['🐼', '🐱', '🐶', '🦊', '🐰', '🐻', '🐯', '🐸', '🧒', '👧'];
const ING = [
  { key: 'tea', emoji: '🍵', label: 'Tea' },
  { key: 'milk', emoji: '🥛', label: 'Milk' },
  { key: 'boba', emoji: '🟤', label: 'Boba' },
] as const;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

type Order = {
  base: [number, number, number];
  mult: number;
  target: [number, number, number];
  who: string;
};

function makeOrder(level: number): Order {
  const max = 2 + Math.min(3, Math.floor(level / 2));
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
  const base: [number, number, number] = [t / g, m / g, b / g];
  // multiplier ramps with level and leans on ×5 / ×7
  const choices =
    level <= 1 ? [2, 3, 4]
      : level === 2 ? [4, 5, 6]
        : level === 3 ? [5, 6, 7]
          : level <= 5 ? [6, 7, 8, 9]
            : [7, 8, 9, 11, 12];
  const mult = choices[Math.floor(Math.random() * choices.length)];
  const target: [number, number, number] = [base[0] * mult, base[1] * mult, base[2] * mult];
  return { base, mult, target, who: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)] };
}

export function BobaShop() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();
  const { pops, pop } = useScorePops();

  const [order, setOrder] = useState(() => makeOrder(config.startLevel));
  const [cup, setCup] = useState<[number, number, number]>([0, 0, 0]);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const scoreRef = useRef(0);
  const servedRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const levelRef = useRef(config.startLevel);
  const timeRef = useRef(15);
  const comboRef = useRef(0);
  const doneRef = useRef(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  useArcadeClock(!!outcome);

  const orderTime = () => Math.max(8, 18 - levelRef.current * 1.5);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 30) + 1));
    setOutcome(recordArcadePlay('boba', xp));
  };

  const nextOrder = () => {
    levelRef.current = config.startLevel + Math.floor(servedRef.current / 3);
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

  // 1Hz order timer (frozen while a mid-game challenge overlay is up)
  useEffect(() => {
    if (outcome) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      timeRef.current -= 1;
      if (timeRef.current <= 0) {
        comboRef.current = 0;
        setFlash('bad');
        setReaction('😖');
        sfx.hurt();
        haptic(HAPTIC.hit);
        window.setTimeout(() => setReaction(null), 600);
        loseLife();
      }
      redraw();
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const add = (i: number, d: number) => {
    if (outcome) return;
    sfx.build();
    haptic(HAPTIC.light);
    setCup((c) => {
      const n: [number, number, number] = [...c] as [number, number, number];
      n[i] = Math.max(0, n[i] + d);
      return n;
    });
  };

  const serve = () => {
    if (outcome) return;
    const exact = cup.every((v, i) => v === order.target[i]);
    if (exact) {
      const oldMult = comboRef.current >= 1 ? 1 + Math.floor((comboRef.current - 1) / 3) : 1;
      comboRef.current += 1;
      const mult = 1 + Math.floor((comboRef.current - 1) / 3); // x1, then x2 after 3 in a row, ...
      const speedBonus = Math.max(0, Math.ceil(timeRef.current)); // quick service tips!
      const gained = (10 + levelRef.current * 2) * mult + speedBonus;
      scoreRef.current += gained;
      servedRef.current += 1;
      setFlash('good');
      setReaction('😋');
      burst(150, 120, { emoji: '✨', count: 14 });
      pop(120, 90, `+${gained}${speedBonus ? ` (⚡${speedBonus})` : ''}`, '#16a34a');
      sfx.coin();
      sfx.pickup();
      haptic(HAPTIC.pickup);
      if (mult > oldMult) {
        sfx.powerup();
        haptic(HAPTIC.levelUp);
      }
      nextOrder();
    } else {
      comboRef.current = 0;
      setFlash('bad');
      setReaction('😖');
      sfx.hurt();
      haptic(HAPTIC.hit);
      loseLife();
    }
    setTimeout(() => {
      setFlash(null);
      setReaction(null);
    }, 600);
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
        <span className="text-rose-600">
          {'❤️'.repeat(Math.max(0, livesRef.current))}
          {'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}
        </span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        {comboRef.current > 1 && (
          <span className="text-pink-600">🔥 x{1 + Math.floor((comboRef.current - 1) / 3)}</span>
        )}
        <span className="text-orange-600 tabular-nums">⏱ {Math.max(0, Math.ceil(timeRef.current))}s</span>
      </div>

      <GameStage theme="boba" className="max-w-sm mx-auto p-4">
        <BurstLayer api={{ burst, particles }} />
        <ScorePopLayer pops={pops} />
        <div
          className={`rounded-3xl border-2 p-4 text-center transition-colors ${
            flash === 'good'
              ? 'bg-emerald-50/95 border-emerald-300'
              : flash === 'bad'
                ? 'bg-rose-50/95 border-rose-300'
                : 'bg-white/90 border-amber-200'
          }`}
        >
          <div className="text-5xl relative inline-block">
            {order.who}
            {reaction && <span className="absolute -right-7 -top-1 text-3xl">{reaction}</span>}
          </div>
          <div className="mt-1 text-sm font-display font-bold text-slate-700">
            wants this recipe — scale it up!
          </div>
          {/* base recipe + required multiplier */}
          <div className="mt-2 flex items-center justify-center gap-2 text-lg font-display font-extrabold text-slate-900">
            {ING.map((ing, i) => (
              <span key={ing.key} className="inline-flex items-center gap-1">
                {i > 0 && <span className="text-slate-400">:</span>}
                {ing.emoji} {order.base[i]}
              </span>
            ))}
            <span className="ml-1 rounded-full bg-pink-500 text-white px-2.5 py-0.5 text-base">
              ×{order.mult}
            </span>
            <span className="text-xs text-slate-400">g</span>
          </div>
          <div className="mt-1 text-xs font-display font-bold text-pink-600">
            Make {order.target[0]}:{order.target[1]}:{order.target[2]} g
          </div>
        </div>

        {/* layered cup — see the ratio build up */}
        <div className="mt-3 flex justify-center">
          <div className="relative w-16 h-24 rounded-b-2xl rounded-t-md border-2 border-slate-300 bg-white/80 overflow-hidden flex flex-col-reverse">
            <div style={{ flexGrow: cup[0], background: '#b45309' }} title="tea" />
            <div style={{ flexGrow: cup[1], background: '#fde68a' }} title="milk" />
            <div style={{ flexGrow: cup[2], background: '#3f2d23' }} title="boba" />
            {cup[0] + cup[1] + cup[2] === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-display font-bold">
                empty
              </div>
            )}
          </div>
        </div>
      </GameStage>

      {/* cup controls */}
      <div className="max-w-sm mx-auto mt-3 grid grid-cols-3 gap-2">
        {ING.map((ing, i) => (
          <div key={ing.key} className="rounded-2xl bg-white border-2 border-slate-200 p-2 text-center">
            <div className="text-2xl">{ing.emoji}</div>
            <div className="font-display font-extrabold text-2xl text-slate-900 tabular-nums">{cup[i]} g</div>
            <div className="mt-1 flex gap-1 justify-center">
              <button
                type="button"
                onClick={() => add(i, -1)}
                className="w-8 h-9 rounded-lg bg-slate-100 font-display font-extrabold text-slate-700"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => add(i, 1)}
                className="w-8 h-9 rounded-lg bg-emerald-500 text-white font-display font-extrabold"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => add(i, 5)}
                className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-display font-extrabold text-xs"
              >
                +5
              </button>
              <button
                type="button"
                onClick={() => add(i, 10)}
                className="w-9 h-9 rounded-lg bg-emerald-700 text-white font-display font-extrabold text-xs"
              >
                +10
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
        Scale the recipe up — multiply every part by the ×number!
      </p>
    </div>
  );
}
