import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Sumo Math — a fast-fire ×, ÷, and exponent duel. Answer each of 10 problems in
// under 5 seconds to shove your rival toward the ring's edge; miss or run out of
// time and he shoves you. Get 7+ right (in time) and you toss him clean out of
// the dohyō; otherwise he tosses you. A monkey referee 🐵 calls every round.

const TOTAL = 10;
const PER_Q = 5; // seconds per question
const STEP = 16; // shove distance per round (position is clamped to ±100)
const YOU = '🐻';
const RIVAL = '👹';

type Q = { prompt: string; answer: number };

function ri(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

const SUP: Record<number, string> = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };

function factorsOf(n: number): number[] {
  const f: number[] = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i);
  return f;
}

const FACTOR_NUMS = [8, 10, 12, 14, 15, 16, 18, 20, 21, 22, 27, 28];

function makeQ(): Q {
  const kind = ri(0, 3);
  if (kind === 0) {
    // multiplication: single-digit operands
    const a = ri(2, 9), b = ri(2, 9);
    return { prompt: `${a} × ${b}`, answer: a * b };
  }
  if (kind === 1) {
    // division: 1–2 digit dividend, single-digit divisor & answer
    const b = ri(2, 9), ans = ri(2, 9);
    return { prompt: `${b * ans} ÷ ${b}`, answer: ans };
  }
  if (kind === 2) {
    // exponent: power > 2 only when the base is 2 or 10; otherwise just squares
    const base = [2, 3, 4, 5, 6, 7, 10][ri(0, 6)];
    const exp = base === 2 ? ri(2, 6) : base === 10 ? ri(2, 3) : 2;
    return { prompt: `${base}${SUP[exp]}`, answer: Math.pow(base, exp) };
  }
  // factor: show the whole factor list with one blank — find the missing factor
  const n = FACTOR_NUMS[ri(0, FACTOR_NUMS.length - 1)];
  const fs = factorsOf(n);
  const hideAt = ri(1, fs.length - 2); // never hide 1 or n itself
  const shown = fs.map((f, i) => (i === hideAt ? '?' : String(f))).join(' · ');
  return { prompt: `Factors of ${n}: ${shown}`, answer: fs[hideAt] };
}

const PRAISE = ['Yokozuna! 🏆', 'Powerful! 💪', 'Banzai! 🎌', 'Great shove! 🙌', 'Too strong! 🔥', 'Nice one! ⭐'];
const TAUNT = ['Too slow! 🐌', 'Oof! 😵', 'He shoved you! 😆', 'Concentrate! 😤', 'Ouch! 👎', 'He laughs at you! 🙊'];

export function SumoMath() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [q, setQ] = useState<Q>(() => makeQ());
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [pos, setPos] = useState(0); // −100 (your edge) … +100 (rival's edge)
  const [timeLeft, setTimeLeft] = useState(PER_Q);
  const [ref, setRef] = useState('Hakkeyoi! Begin! 🐵');
  const [refGood, setRefGood] = useState<boolean | null>(null);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const [tossing, setTossing] = useState<null | 'win' | 'lose'>(null);
  const [zoom, setZoom] = useState(1);
  const rightsRef = useRef(0);
  const posRef = useRef(0);
  const idxRef = useRef(0);
  const lockRef = useRef(false); // prevents double-resolve within a round
  posRef.current = pos;

  // per-question countdown (paused during a mid-game challenge)
  useEffect(() => {
    if (outcome || tossing) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setTimeLeft((t) => {
        const n = Math.round((t - 0.1) * 10) / 10;
        if (n <= 0) { resolve(false); return PER_Q; }
        return n;
      });
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, tossing, idx]);

  const resolve = (success: boolean) => {
    if (lockRef.current) return;
    lockRef.current = true;
    const np = Math.max(-100, Math.min(100, posRef.current + (success ? STEP : -STEP)));
    posRef.current = np;
    setPos(np);
    setZoom(1.12);
    window.setTimeout(() => setZoom(1), 260);
    if (success) {
      rightsRef.current += 1;
      addAchievement(10);
      setRef(PRAISE[ri(0, PRAISE.length - 1)]);
      setRefGood(true);
      setFlash('good');
      sfx.coin(); haptic(HAPTIC.pickup);
    } else {
      setRef(TAUNT[ri(0, TAUNT.length - 1)]);
      setRefGood(false);
      setFlash('bad');
      sfx.hurt(); haptic(HAPTIC.heavy);
    }
    const nextIdx = idxRef.current + 1;
    window.setTimeout(() => {
      setFlash(null);
      if (nextIdx >= TOTAL) {
        finish();
        return;
      }
      idxRef.current = nextIdx;
      setIdx(nextIdx);
      setQ(makeQ());
      setValue('');
      setTimeLeft(PER_Q);
      lockRef.current = false;
    }, 650);
  };

  const finish = () => {
    const win = rightsRef.current >= 7;
    setTossing(win ? 'win' : 'lose');
    win ? sfx.win() : sfx.lose();
    haptic(win ? HAPTIC.win : HAPTIC.death);
    addArcadePoints(rightsRef.current * 20);
    const xp = Math.max(2, Math.min(20, rightsRef.current * 2));
    window.setTimeout(() => setOutcome(recordArcadePlay('sumo', xp)), 1400);
  };

  const submit = () => {
    if (lockRef.current || outcome || tossing) return;
    const n = Number(value.trim());
    if (value.trim() === '' || Number.isNaN(n)) return;
    resolve(n === q.answer && timeLeft > 0);
  };

  const press = (k: string) => {
    if (k === 'del') setValue((v) => v.slice(0, -1));
    else setValue((v) => (v.length < 5 ? v + k : v));
  };

  const reset = () => {
    rightsRef.current = 0; posRef.current = 0; idxRef.current = 0; lockRef.current = false;
    setPos(0); setIdx(0); setQ(makeQ()); setValue(''); setTimeLeft(PER_Q);
    setRef('Hakkeyoi! Begin! 🐵'); setRefGood(null); setFlash(null); setTossing(null); setOutcome(null);
  };

  if (outcome) {
    const win = rightsRef.current >= 7;
    return (
      <div>
        <ArcadeHeader title="Sumo Math" emoji="🛐" />
        <ArcadeEndCard
          gameId="sumo"
          outcome={outcome}
          win={win}
          scoreLine={win ? `🏆 You tossed him out! ${rightsRef.current}/${TOTAL} in time` : `😵 Tossed out! ${rightsRef.current}/${TOTAL} in time`}
          onReplay={reset}
        />
      </div>
    );
  }

  // visual: clash point slides with `pos`. Danger (your edge) vs winning (his edge).
  const meetPct = 50 + pos * 0.4; // 10%..90%
  const danger = pos <= -60;
  const winning = pos >= 60;

  return (
    <div>
      <ArcadeHeader title="Sumo Math" emoji="🛐" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-slate-700">Round {Math.min(idx + 1, TOTAL)}/{TOTAL}</span>
        <span className="text-emerald-600">✅ {rightsRef.current}</span>
        <span className={timeLeft <= 2 ? 'text-rose-600' : 'text-orange-600'}>⏱ {timeLeft.toFixed(1)}s</span>
      </div>

      <GameStage theme="meadow" className="max-w-sm mx-auto p-3" style={{ width: 'min(100%, 60vh)' }}>
        {/* danger / winning flash */}
        {(danger || winning) && (
          <motion.div
            animate={{ opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className={`absolute inset-0 z-20 rounded-3xl ${danger ? 'bg-rose-500' : 'bg-emerald-400'}`}
            aria-hidden
          />
        )}

        {/* dohyō ring */}
        <div
          className="relative mx-auto rounded-full bg-amber-200 border-4 border-amber-400 overflow-hidden transition-transform duration-200"
          style={{ width: '100%', aspectRatio: '2 / 1', transform: `scale(${zoom})` }}
        >
          {/* edge zones */}
          <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-rose-400/40" />
          <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-emerald-400/40" />
          {/* referee monkey */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1 text-2xl" aria-hidden>🐵</div>
          {/* sumos at the clash point */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${meetPct}% - 44px)` }}
            animate={tossing === 'win' ? {} : { x: [0, 5, 0] }}
            transition={{ duration: 0.4, repeat: tossing ? 0 : Infinity }}
            aria-hidden
          >
            <Sumo face={YOU} />
          </motion.div>
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${meetPct}% + 4px)` }}
            animate={
              tossing === 'win'
                ? { x: 240, y: -120, rotate: 540, opacity: 0 }
                : tossing === 'lose'
                  ? {}
                  : { x: [0, -5, 0] }
            }
            transition={{ duration: tossing === 'win' ? 1.2 : 0.4, repeat: tossing ? 0 : Infinity }}
            aria-hidden
          >
            <Sumo face={RIVAL} flip />
          </motion.div>
          {/* on a loss, you go flying */}
          {tossing === 'lose' && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `calc(${meetPct}% - 44px)` }}
              animate={{ x: -240, y: -120, rotate: -540, opacity: 0 }}
              transition={{ duration: 1.2 }}
              aria-hidden
            >
              <Sumo face={YOU} />
            </motion.div>
          )}
          {/* clash spark */}
          {flash && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 -translate-y-1/2 text-3xl"
              style={{ left: `calc(${meetPct}% - 12px)` }}
              aria-hidden
            >
              💥
            </motion.div>
          )}
        </div>

        {/* referee call */}
        <div className={`relative z-30 mt-2 text-center font-display font-extrabold ${refGood === true ? 'text-emerald-700' : refGood === false ? 'text-rose-700' : 'text-slate-700'}`}>
          🐵 {ref}
        </div>

        {/* problem */}
        {!tossing && (
          <div className="relative z-30 mt-2">
            <div
              className={`mx-auto max-w-[280px] rounded-2xl border-2 py-4 px-2 text-center font-display font-extrabold ${q.prompt.length > 8 ? 'text-base leading-snug' : 'text-3xl tabular-nums'} ${
                flash === 'good' ? 'border-emerald-300 bg-emerald-50' : flash === 'bad' ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white/90'
              }`}
            >
              {q.prompt}
            </div>
            <div className="mx-auto max-w-[200px] mt-2 h-11 rounded-xl border-2 border-slate-200 bg-white/90 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums">
              {value || <span className="text-slate-300">?</span>}
            </div>
          </div>
        )}
      </GameStage>

      {!tossing && (
        <div className="max-w-[220px] mx-auto mt-3 grid grid-cols-3 gap-1.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'go'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => (k === 'go' ? submit() : press(k))}
              className={`min-h-11 rounded-xl font-display font-extrabold text-lg active:translate-y-0.5 ${
                k === 'go' ? 'bg-emerald-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {k === 'del' ? '⌫' : k === 'go' ? '✓' : k}
            </button>
          ))}
        </div>
      )}
      <p className="text-center text-[11px] text-slate-500 mt-2">
        Answer ×, ÷, exponents &amp; factors in under {PER_Q}s to shove your rival! Get 7/10 to toss him out.
      </p>
    </div>
  );
}

// A little CSS sumo wrestler: a round body with a mawashi belt, stubby arms, a
// topknot, and a face emoji. `flip` mirrors it to face the other way.
function Sumo({ face, flip }: { face: string; flip?: boolean }) {
  return (
    <div className="relative" style={{ width: 56, height: 56, transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden>
      {/* body */}
      <div className="absolute left-1/2 -translate-x-1/2 rounded-[45%]" style={{ bottom: 0, width: 48, height: 40, background: '#f3c79f', boxShadow: 'inset 0 -4px 6px rgba(0,0,0,0.15)' }} />
      {/* arms */}
      <div className="absolute rounded-full" style={{ left: -2, bottom: 16, width: 14, height: 12, background: '#eab483' }} />
      <div className="absolute rounded-full" style={{ right: -2, bottom: 16, width: 14, height: 12, background: '#eab483' }} />
      {/* mawashi belt */}
      <div className="absolute left-1/2 -translate-x-1/2 rounded" style={{ bottom: 4, width: 48, height: 10, background: '#7c2d12' }} />
      {/* topknot */}
      <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 0, width: 10, height: 10, background: '#1f2937' }} />
      {/* face */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center" style={{ top: 4, width: 30, height: 30, fontSize: 22, transform: flip ? 'scaleX(-1)' : undefined }}>
        {face}
      </div>
    </div>
  );
}
