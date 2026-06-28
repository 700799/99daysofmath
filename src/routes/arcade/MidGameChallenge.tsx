import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../state/progress';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// A quick math interruption that pops up during any game at an admin-set
// interval. The player must answer every problem correctly to resume — a wrong
// answer just shakes and lets them retry (no penalty); finishing awards a small
// point bonus. Self-contained problem generator keyed to levels 1–5 so it does
// not depend on the async problem bank (which only has difficulty 1–3).

export interface Challenge {
  prompt: string;
  answer: number;
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate one arithmetic challenge scaled by difficulty level (1–5). */
export function makeChallenge(level: number): Challenge {
  const L = Math.max(1, Math.min(5, Math.round(level)));
  if (L === 1) {
    // single-digit add / subtract (non-negative)
    const a = ri(1, 9);
    const b = ri(1, 9);
    if (Math.random() < 0.5) return { prompt: `${a} + ${b}`, answer: a + b };
    const [hi, lo] = a >= b ? [a, b] : [b, a];
    return { prompt: `${hi} − ${lo}`, answer: hi - lo };
  }
  if (L === 2) {
    // two-digit add / subtract
    const a = ri(10, 50);
    const b = ri(10, 50);
    if (Math.random() < 0.5) return { prompt: `${a} + ${b}`, answer: a + b };
    const [hi, lo] = a >= b ? [a, b] : [b, a];
    return { prompt: `${hi} − ${lo}`, answer: hi - lo };
  }
  if (L === 3) {
    // simple multiplication
    const a = ri(2, 9);
    const b = ri(2, 9);
    return { prompt: `${a} × ${b}`, answer: a * b };
  }
  if (L === 4) {
    // harder multiply / exact division
    if (Math.random() < 0.5) {
      const a = ri(11, 19);
      const b = ri(3, 9);
      return { prompt: `${a} × ${b}`, answer: a * b };
    }
    const b = ri(3, 9);
    const ans = ri(3, 12);
    return { prompt: `${b * ans} ÷ ${b}`, answer: ans };
  }
  // L === 5: two-step or fraction-of
  if (Math.random() < 0.5) {
    const a = ri(3, 9);
    const b = ri(3, 9);
    const c = ri(2, 9);
    return { prompt: `${a} × ${b} + ${c}`, answer: a * b + c };
  }
  const denom = ri(2, 6);
  const mult = ri(2, 8);
  const whole = denom * mult;
  return { prompt: `${1}/${denom} of ${whole}`, answer: mult };
}

export function MidGameChallenge({
  count,
  level,
  onDone,
}: {
  count: number;
  level: number;
  onDone: () => void;
}) {
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const problems = useMemo(
    () => Array.from({ length: Math.max(1, count) }, () => makeChallenge(level)),
    [count, level],
  );
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const current = problems[idx];

  const submit = () => {
    const n = Number(value.trim());
    if (value.trim() === '' || Number.isNaN(n)) return;
    if (n === current.answer) {
      addAchievement(10);
      sfx.coin();
      haptic(HAPTIC.pickup);
      if (idx + 1 >= problems.length) {
        addArcadePoints(5);
        sfx.levelUp();
        haptic(HAPTIC.levelUp);
        onDone();
        return;
      }
      setIdx((i) => i + 1);
      setValue('');
      setWrong(false);
    } else {
      setWrong(true);
      setShakeKey((k) => k + 1);
      sfx.hurt();
      haptic(HAPTIC.hit);
    }
  };

  const press = (d: string) => {
    setWrong(false);
    if (d === 'del') setValue((v) => v.slice(0, -1));
    else if (d === '-') setValue((v) => (v.startsWith('-') ? v.slice(1) : '-' + v));
    else setValue((v) => (v.length < 6 ? v + d : v));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div
        key={shakeKey}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={
          wrong
            ? { scale: 1, opacity: 1, x: [0, -8, 8, -6, 6, 0] }
            : { scale: 1, opacity: 1, x: 0 }
        }
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl"
      >
        <div className="text-3xl">🧠</div>
        <div className="mt-1 font-display font-extrabold text-slate-900">Quick Math Break!</div>
        <div className="mt-0.5 text-xs font-display font-bold text-slate-500">
          Answer all {problems.length} to keep playing
        </div>

        <div className="mt-3 flex justify-center gap-1.5">
          {problems.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < idx ? 'bg-emerald-500' : i === idx ? 'bg-amber-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 border-2 border-slate-200 py-5 text-3xl font-display font-extrabold text-slate-900 tabular-nums">
          {current.prompt}
        </div>
        <div
          className={`mt-3 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums ${
            wrong ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-900'
          }`}
        >
          {value || <span className="text-slate-300">?</span>}
        </div>
        {wrong && (
          <div className="mt-1 text-xs font-display font-bold text-rose-500">Try again!</div>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => press(k)}
              className="min-h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-lg text-slate-800 active:translate-y-0.5"
            >
              {k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim()}
          className="mt-3 w-full min-h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg shadow disabled:bg-slate-300 active:translate-y-0.5"
        >
          Check ✓
        </button>
      </motion.div>
    </div>
  );
}
