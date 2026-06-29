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
function gcf(a: number, b: number): number {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}
const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sup = (n: number) => String(n).split('').map((d) => SUP[d] ?? d).join('');

// --- challenge generators (every answer is numeric) ---------------------------
// No trivial one-digit add/subtract anywhere: every game's mid-play math is a
// word problem, exponent, factor/divisibility, or ratio/proportion question.

function gExponent(hard: boolean): Challenge {
  const r = Math.random();
  if (!hard) {
    if (r < 0.6) { const b = ri(2, 9); return { prompt: `${b}${sup(2)}  (${b} squared)`, answer: b * b }; }
    const b = ri(2, 5); return { prompt: `${b}${sup(3)}  (${b} cubed)`, answer: b * b * b };
  }
  if (r < 0.4) { const b = ri(6, 15); return { prompt: `${b}${sup(2)}`, answer: b * b }; }
  if (r < 0.7) { const b = ri(2, 6); return { prompt: `${b}${sup(3)}`, answer: b * b * b }; }
  const base = Math.random() < 0.5 ? 2 : 3; const e = ri(3, 5);
  return { prompt: `${base}${sup(e)}  (${base} to the ${e})`, answer: Math.pow(base, e) };
}

function gFactor(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.4) {
    const k = ri(2, 9);
    const yes = Math.random() < 0.5;
    const n = yes ? k * ri(3, hard ? 14 : 9) : k * ri(2, hard ? 14 : 9) + ri(1, k - 1);
    return { prompt: `Is ${n} divisible by ${k}?  (1 = yes, 0 = no)`, answer: n % k === 0 ? 1 : 0 };
  }
  if (r < 0.7) {
    const a = ri(3, hard ? 12 : 9); const b = ri(3, hard ? 12 : 9);
    return { prompt: `Missing factor:  ${a} × ? = ${a * b}`, answer: b };
  }
  const g = ri(2, hard ? 9 : 6); const x = g * ri(2, 6); const y = g * ri(2, 6);
  return { prompt: `Greatest common factor of ${x} and ${y}?`, answer: gcf(x, y) };
}

function gRatio(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.4) {
    const a = ri(2, 6); const b = ri(2, 6); const k = ri(2, hard ? 8 : 4);
    return { prompt: `Solve the proportion:  ${a}/${b} = ?/${b * k}`, answer: a * k };
  }
  if (r < 0.7) {
    const per = ri(2, 9); const q1 = ri(2, 4); const q2 = q1 + ri(2, hard ? 6 : 3);
    return { prompt: `${q1} pens cost $${per * q1}. How much for ${q2} pens?`, answer: per * q2 };
  }
  const cups = ri(2, 4); const batch = ri(2, 4); const times = ri(2, hard ? 5 : 3);
  return { prompt: `A recipe uses ${cups} cups for ${batch} cakes. How many cups for ${batch * times} cakes?`, answer: cups * times };
}

function gWord(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.4) {
    const box = ri(4, hard ? 12 : 8); const n = ri(3, hard ? 9 : 7);
    return { prompt: `A box holds ${box} crayons. How many crayons are in ${n} boxes?`, answer: box * n };
  }
  if (r < 0.7) {
    const per = ri(3, hard ? 9 : 7); const groups = ri(3, hard ? 9 : 6);
    return { prompt: `${per * groups} stickers are shared equally among ${groups} kids. How many each?`, answer: per };
  }
  // multi-step word problem
  const a = ri(2, hard ? 7 : 5); const b = ri(3, hard ? 9 : 6); const c = ri(2, 9);
  return { prompt: `There are ${a} packs of ${b} markers, plus ${c} loose markers. How many markers in all?`, answer: a * b + c };
}

/** Generate one challenge scaled by difficulty level (1–5). Never an easy
 *  one-digit add/subtract — always a word problem, exponent, factor, or ratio. */
export function makeChallenge(level: number): Challenge {
  const L = Math.max(1, Math.min(5, Math.round(level)));
  const hard = L >= 4;
  const pool: ((h: boolean) => Challenge)[] = [gExponent, gWord, gRatio];
  if (L >= 2) pool.push(gFactor);
  if (L >= 3) pool.push(gRatio, gWord); // weight the applied problems more
  if (L >= 4) pool.push(gFactor, gExponent);
  return pool[ri(0, pool.length - 1)](hard);
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

        <div className="mt-4 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold text-slate-900 leading-snug break-words">
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
