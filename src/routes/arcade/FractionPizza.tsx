import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { Mascot as CharMascot } from './Mascots';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Fraction Pizzeria — serve each customer the fraction they ordered by shading
// that many slices of a freshly-cut pizza. Teaches fractions (numerator over
// denominator) with a tangible "parts of a whole" pizza.

const SESSION = 75;
const TARGET = 8; // orders to clear for a win
const TOPPINGS = ['🍅', '🫑', '🍄', '🧀', '🌶️'] as const;

type Order = { num: number; den: number; topping: string };

function makeOrder(served: number): Order {
  // Denominators grow as the player serves more orders.
  const pool = served < 2 ? [2, 3, 4] : served < 5 ? [3, 4, 5, 6] : [4, 5, 6, 8];
  const den = pool[Math.floor(Math.random() * pool.length)];
  const num = 1 + Math.floor(Math.random() * (den - 1));
  return { num, den, topping: TOPPINGS[Math.floor(Math.random() * TOPPINGS.length)] };
}

// SVG wedge path for one pizza slice.
function wedge(cx: number, cy: number, r: number, a0: number, a1: number) {
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

export function FractionPizza() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const pausedRef = useArcadePausedRef();
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };

  const [order, setOrder] = useState<Order>(() => makeOrder(0));
  const [shaded, setShaded] = useState<Set<number>>(new Set());
  const [served, setServed] = useState(0);
  const [left, setLeft] = useState(SESSION);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const doneRef = useRef(false);

  // countdown
  useEffect(() => {
    if (outcome) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [outcome, pausedRef]);

  useEffect(() => {
    if (left === 0 && !doneRef.current) {
      doneRef.current = true;
      const xp = Math.max(1, Math.min(20, served * 2));
      setOutcome(recordArcadePlay('fraction', xp));
    }
  }, [left, served, recordArcadePlay]);

  const C = order.num; // slices needed
  const D = order.den;

  const tapSlice = (i: number) => {
    if (outcome || pausedRef.current) return;
    setShaded((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else n.add(i);
      sfx.step();
      return n;
    });
  };

  const serve = () => {
    if (outcome) return;
    if (shaded.size === C) {
      const next = served + 1;
      setServed(next);
      recordArcadeAnswer(arcadeUnit, true);
      setFlash('good'); window.setTimeout(() => setFlash((f) => (f === 'good' ? null : f)), 400);
      sfx.coin(); buzz(HAPTIC.win);
      if (next >= TARGET && !doneRef.current) {
        doneRef.current = true;
        const xp = Math.max(2, Math.min(20, next * 2));
        window.setTimeout(() => setOutcome(recordArcadePlay('fraction', xp)), 450);
        return;
      }
      setOrder(makeOrder(next));
      setShaded(new Set());
    } else {
      recordArcadeAnswer(arcadeUnit, false);
      setFlash('bad'); window.setTimeout(() => setFlash((f) => (f === 'bad' ? null : f)), 400);
      sfx.hurt(); buzz(HAPTIC.hit);
    }
  };

  const reset = () => {
    doneRef.current = false;
    setServed(0); setLeft(SESSION); setFlash(null); setShaded(new Set());
    setOrder(makeOrder(0)); setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Fraction Pizzeria" emoji="🍕" />
        <ArcadeEndCard
          gameId="fraction"
          outcome={outcome}
          win={served >= TARGET}
          scoreLine={`${served} order${served === 1 ? '' : 's'} served!`}
          onReplay={reset}
        />
      </div>
    );
  }

  const cx = 150, cy = 150, r = 120;
  const slices = Array.from({ length: D }, (_, i) => i);

  return (
    <div>
      <ArcadeHeader title="Fraction Pizzeria" emoji="🍕" />

      <div className="mx-auto mb-2 flex max-w-md items-center justify-between px-1 text-sm font-display font-extrabold">
        <span className="tabular-nums text-orange-600">⏱ {left}s</span>
        <span className="tabular-nums text-emerald-700">🍕 {served}/{TARGET}</span>
      </div>

      {/* the order ticket */}
      <div className="mx-auto mb-3 flex max-w-md items-center justify-center gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-2">
        <CharMascot kind="clerk" size={48} expr={flash === 'good' ? 'cheer' : flash === 'bad' ? 'dizzy' : 'happy'} />
        <div className="text-slate-700">
          <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-amber-600">Order {order.topping}</div>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold">Serve</span>
            <span className="inline-flex flex-col items-center leading-none">
              <span className="text-2xl font-display font-black tabular-nums text-rose-600">{C}</span>
              <span className="my-0.5 h-[3px] w-7 rounded bg-rose-600" />
              <span className="text-2xl font-display font-black tabular-nums text-rose-600">{D}</span>
            </span>
            <span className="font-display text-sm font-bold">of the pizza</span>
          </div>
        </div>
      </div>

      {/* pizza */}
      <div className="relative mx-auto max-w-[320px]">
        <svg viewBox="0 0 300 300" className="w-full">
          <circle cx={cx} cy={cy} r={r + 8} fill="#d97706" />
          <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="#92400e" strokeWidth={4} />
          {slices.map((i) => {
            const a0 = -Math.PI / 2 + (i / D) * Math.PI * 2;
            const a1 = -Math.PI / 2 + ((i + 1) / D) * Math.PI * 2;
            const on = shaded.has(i);
            const mid = (a0 + a1) / 2;
            return (
              <g key={i} onClick={() => tapSlice(i)} style={{ cursor: 'pointer' }}>
                <path d={wedge(cx, cy, r, a0, a1)} fill={on ? '#fbbf24' : '#fff7ed'} stroke="#92400e" strokeWidth={3} strokeLinejoin="round" />
                {on && (
                  <text x={cx + Math.cos(mid) * r * 0.6} y={cy + Math.sin(mid) * r * 0.6} fontSize={22} textAnchor="middle" dominantBaseline="central">
                    {order.topping}
                  </text>
                )}
              </g>
            );
          })}
          {flash && (
            <circle cx={cx} cy={cy} r={r + 8} fill={flash === 'good' ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.22)'} />
          )}
        </svg>
        <div className="mt-1 text-center font-display text-sm font-extrabold text-slate-600 tabular-nums">
          Shaded: {shaded.size}/{D}
        </div>
      </div>

      <div className="mx-auto mt-3 max-w-md">
        <motion.button
          type="button"
          onClick={serve}
          whileTap={{ scale: 0.97 }}
          className="min-h-14 w-full rounded-2xl bg-emerald-500 text-xl font-display font-extrabold text-white shadow-[0_5px_0_0_rgba(0,0,0,0.18)] active:translate-y-1"
        >
          🍽️ Serve it!
        </motion.button>
        <p className="mt-2 text-center text-xs text-slate-500">
          Tap slices to shade the numerator (top number) out of {D} equal slices, then serve.
        </p>
      </div>
    </div>
  );
}
