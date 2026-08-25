import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadeUnit, ARCADE_UNIT_LABELS } from '../../state/progress';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';
import { LESSONS, type Lesson } from '../../data/lessons';
import { LessonCard } from '../../components/LessonCard';

export function pickLesson(unit: ArcadeUnit): Lesson | null {
  const usable = LESSONS.filter((l) => l.examples.length > 0);
  const pool = unit === 'mixed' ? usable : usable.filter((l) => l.domain === unit);
  const src = pool.length ? pool : usable;
  return src[Math.floor(Math.random() * src.length)] ?? null;
}

const FORMATS: { len: RoundLen; emoji: string; label: string; sub: string; count: number }[] = [
  { len: 'short', emoji: '⚡', label: 'Quick', sub: 'many short questions', count: 5 },
  { len: 'medium', emoji: '🧠', label: 'Think', sub: '1–2 medium problems', count: 2 },
  { len: 'word', emoji: '📖', label: 'Story', sub: 'one word problem', count: 1 },
];

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

function gFraction(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.5) { const d = ri(2, hard ? 8 : 5); const m = ri(2, hard ? 9 : 6); return { prompt: `What is 1/${d} of ${d * m}?`, answer: m }; }
  if (r < 0.8) { const d = ri(3, hard ? 8 : 5); const num = ri(2, d - 1); const k = ri(2, hard ? 6 : 4); return { prompt: `What is ${num}/${d} of ${d * k}?`, answer: num * k }; }
  const d = ri(2, 5); const num = ri(1, d - 1); const k = ri(2, hard ? 6 : 4);
  return { prompt: `Equivalent fraction:  ${num}/${d} = ?/${d * k}`, answer: num * k };
}

function gGeometry(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.35) {
    const w = ri(3, hard ? 14 : 9); const h = ri(2, hard ? 12 : 8);
    return { prompt: `A rectangle is ${w} wide and ${h} tall. What is its AREA?`, answer: w * h };
  }
  if (r < 0.6) {
    const w = ri(3, hard ? 14 : 9); const h = ri(2, hard ? 12 : 8);
    return { prompt: `A rectangle is ${w} by ${h}. What is its PERIMETER?`, answer: 2 * (w + h) };
  }
  if (r < 0.8) {
    const b = ri(2, hard ? 14 : 9); const h = (Math.random() < 0.5 ? 2 : ri(1, hard ? 7 : 4) * 2);
    return { prompt: `A triangle has base ${b} and height ${h}. Its area = ½ × base × height = ?`, answer: (b * h) / 2 };
  }
  const l = ri(2, hard ? 8 : 5); const w = ri(2, hard ? 6 : 4); const h = ri(2, hard ? 6 : 4);
  return { prompt: `A box is ${l} × ${w} × ${h}. What is its VOLUME?`, answer: l * w * h };
}

function gStats(hard: boolean): Challenge {
  const n = hard ? 5 : 4;
  const data = Array.from({ length: n }, () => ri(2, hard ? 20 : 12));
  const r = Math.random();
  const sum = data.reduce((a, b) => a + b, 0);
  if (r < 0.35 && sum % n === 0) {
    return { prompt: `Find the MEAN (average) of: ${data.join(', ')}`, answer: sum / n };
  }
  if (r < 0.6) {
    return { prompt: `Find the RANGE (biggest − smallest) of: ${data.join(', ')}`, answer: Math.max(...data) - Math.min(...data) };
  }
  if (r < 0.8) {
    const sorted = [...data].sort((a, b) => a - b);
    // median of an even count → make it clean by using a guaranteed-integer middle pair
    const mid = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
    if (Number.isInteger(mid)) return { prompt: `Find the MEDIAN (middle value) of: ${sorted.join(', ')}`, answer: mid };
  }
  // fallback: sum total (a clean, always-integer stat question)
  return { prompt: `What is the TOTAL of: ${data.join(', ')}?`, answer: sum };
}

function gAlgebra(hard: boolean): Challenge {
  const r = Math.random();
  if (!hard) {
    if (r < 0.35) { const x = ri(2, 12); const a = ri(3, 15); return { prompt: `Solve for x:  x + ${a} = ${x + a}`, answer: x }; }
    if (r < 0.65) { const x = ri(2, 9); const a = ri(2, 9); return { prompt: `Solve for x:  ${a}x = ${a * x}`, answer: x }; }
    const x = ri(2, 9); const a = ri(2, 6); const b = ri(1, 12);
    return { prompt: `Solve for x:  ${a}x + ${b} = ${a * x + b}`, answer: x };
  }
  if (r < 0.35) { const x = ri(2, 9); const a = ri(2, 6); const b = ri(1, 12); return { prompt: `Solve for x:  ${a}x − ${b} = ${a * x - b}`, answer: x }; }
  if (r < 0.65) {
    // variables on both sides: ax + b = cx + d, with a > c so x = (d − b)/(a − c)
    const x = ri(2, 8); const c = ri(1, 4); const a = c + ri(1, 4); const b = ri(1, 9);
    const d = (a - c) * x + b;
    return { prompt: `Solve for x:  ${a}x + ${b} = ${c}x + ${d}`, answer: x };
  }
  const x = ri(1, 8); const inner = ri(1, 6); const a = ri(2, 5);
  return { prompt: `Solve for x:  ${a}(x + ${inner}) = ${a * (x + inner)}`, answer: x };
}

function gLinear(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.3) {
    const m = ri(2, hard ? 9 : 6); const b = ri(1, hard ? 15 : 9); const x = ri(2, hard ? 9 : 6);
    return { prompt: `If y = ${m}x + ${b}, what is y when x = ${x}?`, answer: m * x + b };
  }
  if (r < 0.55) {
    const m = ri(2, hard ? 8 : 5); const k = ri(2, hard ? 9 : 6); const c = ri(1, 9);
    return { prompt: `f(x) = ${m}x − ${c}. Find f(${k}).`, answer: m * k - c };
  }
  if (r < 0.8) {
    // integer slope from two points
    const x1 = ri(0, 4); const run = ri(1, hard ? 5 : 3); const m = ri(1, hard ? 7 : 5) * (hard && Math.random() < 0.4 ? -1 : 1);
    const y1 = ri(0, 9); const x2 = x1 + run; const y2 = y1 + m * run;
    return { prompt: `Find the SLOPE through (${x1}, ${y1}) and (${x2}, ${y2}).`, answer: m };
  }
  const fee = ri(2, 6); const per = ri(2, hard ? 8 : 5); const h = ri(2, hard ? 8 : 5);
  return { prompt: `A rental costs $${fee} to start plus $${per} per hour. How much for ${h} hours?`, answer: fee + per * h };
}


// --- Precalculus generators ------------------------------------------------
// Every answer stays a clean integer so the numeric keypad still works: we pick
// from exact-value triangles, powers, and integer-friendly sequences.

function gTrig(hard: boolean): Challenge {
  const r = Math.random();
  if (!hard) {
    if (r < 0.4) {
      // 3-4-5 / 6-8-10 style right triangle: find the missing leg or hypotenuse
      const k = ri(1, 4); const [a, b, c] = [3 * k, 4 * k, 5 * k];
      return Math.random() < 0.5
        ? { prompt: `Right triangle: legs ${a} and ${b}. How long is the hypotenuse?`, answer: c }
        : { prompt: `Right triangle: leg ${a}, hypotenuse ${c}. How long is the other leg?`, answer: b };
    }
    if (r < 0.7) {
      const deg = [0, 30, 45, 60, 90][ri(0, 4)];
      const sinPct: Record<number, number> = { 0: 0, 30: 50, 45: 71, 60: 87, 90: 100 };
      return { prompt: `On the unit circle, sin(${deg}°) × 100, rounded to a whole number, is?`, answer: sinPct[deg] };
    }
    const deg = [180, 360, 90, 270][ri(0, 3)];
    return { prompt: `How many degrees is ${deg / 90} right angle(s)?`, answer: deg };
  }
  if (r < 0.35) {
    // degrees ↔ radians using multiples of π: answer is the numerator over 180
    const deg = [30, 45, 60, 90, 120, 135, 150, 180][ri(0, 7)];
    const g = gcf(deg, 180);
    return { prompt: `${deg}° = (a/b)π radians in lowest terms. What is the DENOMINATOR b?`, answer: 180 / g };
  }
  if (r < 0.7) {
    const amp = ri(2, 9); const shift = ri(1, 5);
    return { prompt: `y = ${amp}sin(x) + ${shift}. What is the MAXIMUM value?`, answer: amp + shift };
  }
  const b = ri(2, 6);
  return { prompt: `y = sin(${b}x) has period 360°/${b}. What is the period in degrees?`, answer: 360 / b };
}

function gLog(hard: boolean): Challenge {
  const r = Math.random();
  if (!hard) {
    if (r < 0.5) { const b = ri(2, 5); const e = ri(2, 3); return { prompt: `log base ${b} of ${Math.pow(b, e)} = ?`, answer: e }; }
    const e = ri(2, 4); return { prompt: `log base 10 of ${Math.pow(10, e)} = ?`, answer: e };
  }
  if (r < 0.35) { const b = ri(2, 5); const e = ri(3, 5); return { prompt: `log base ${b} of ${Math.pow(b, e)} = ?`, answer: e }; }
  if (r < 0.7) {
    const x = ri(2, 3); const y = ri(2, 3);
    return { prompt: `log(A) = ${x} and log(B) = ${y}. What is log(A × B)?`, answer: x + y };
  }
  const b = ri(2, 5); const e = ri(2, 4);
  return { prompt: `Solve for x:  ${b}^x = ${Math.pow(b, e)}`, answer: e };
}

function gSequence(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.4) {
    const a = ri(2, 9); const d = ri(2, hard ? 9 : 5); const n = ri(4, hard ? 12 : 7);
    return { prompt: `Arithmetic sequence starts at ${a} and adds ${d} each time. What is term ${n}?`, answer: a + d * (n - 1) };
  }
  if (r < 0.7) {
    const a = ri(1, 4); const rr = 2; const n = ri(4, hard ? 9 : 6);
    return { prompt: `Geometric sequence starts at ${a} and DOUBLES each time. What is term ${n}?`, answer: a * Math.pow(rr, n - 1) };
  }
  const n = ri(4, hard ? 12 : 8);
  return { prompt: `Sum of the first ${n} counting numbers (1 + 2 + … + ${n})?`, answer: (n * (n + 1)) / 2 };
}

function gFunction(hard: boolean): Challenge {
  const r = Math.random();
  if (r < 0.35) {
    const a = ri(2, hard ? 6 : 4); const b = ri(1, 9); const x = ri(2, hard ? 8 : 5);
    return { prompt: `f(x) = ${a}x + ${b}. Find f(${x}).`, answer: a * x + b };
  }
  if (r < 0.6) {
    const shift = ri(1, 7);
    return { prompt: `y = (x − ${shift})². The graph shifts RIGHT by how many units?`, answer: shift };
  }
  if (r < 0.85) {
    // composition of two simple linear machines
    const a = ri(2, 4); const b = ri(1, 6); const x = ri(1, 5);
    return { prompt: `f(x) = x + ${b} and g(x) = ${a}x. Find f(g(${x})).`, answer: a * x + b };
  }
  const a = ri(2, 6); const y = a * ri(2, 6);
  return { prompt: `f(x) = ${a}x. The inverse undoes it. Find the input that gives ${y}.`, answer: y / a };
}

export type ChallengeKind = 'word' | 'exponent' | 'factor' | 'ratio' | 'fraction' | 'geometry' | 'stats' | 'algebra' | 'linear' | 'trig' | 'log' | 'sequence' | 'function';
const GENERATORS: Record<ChallengeKind, (hard: boolean) => Challenge> = {
  word: gWord,
  exponent: gExponent,
  factor: gFactor,
  ratio: gRatio,
  fraction: gFraction,
  geometry: gGeometry,
  stats: gStats,
  algebra: gAlgebra,
  linear: gLinear,
  trig: gTrig,
  log: gLog,
  sequence: gSequence,
  function: gFunction,
};

/** Generate a challenge restricted to the given kinds, scaled by level (1–5).
 *  Lets each game choose exactly which math types it shows. */
export function makeChallengeFrom(level: number, kinds: ChallengeKind[]): Challenge {
  const L = Math.max(1, Math.min(5, Math.round(level)));
  const hard = L >= 4;
  const list = kinds.length ? kinds : (['word', 'exponent', 'ratio'] as ChallengeKind[]);
  return GENERATORS[list[ri(0, list.length - 1)]](hard);
}

// --- adaptive engine: pick questions by chosen unit + level + round length -----
export type RoundLen = 'short' | 'medium' | 'word';
const UNIT_KINDS: Record<ArcadeUnit, ChallengeKind[]> = {
  '6.RP': ['ratio'],
  '6.NS': ['fraction', 'factor'],
  '6.EE': ['exponent', 'word'],
  '6.G': ['geometry'],
  '6.SP': ['stats'],
  g5: ['word', 'fraction', 'factor'], // gentler Grade-5 review pool
  a1: ['algebra', 'linear'], // solve-for-x, slope, y = mx + b, f(x)
  pc: ['trig', 'log', 'sequence', 'function'], // triangles, unit circle, logs, sequences, transformations
  mixed: ['word', 'exponent', 'factor', 'ratio', 'fraction', 'geometry', 'stats'],
};

/** A challenge tailored to the student's chosen unit and adaptive level, in one
 *  of three length flavors: short (quick), medium (a bit harder), word (a story). */
export function makeAdaptive(unit: ArcadeUnit, level: number, len: RoundLen): Challenge {
  let kinds = UNIT_KINDS[unit] ?? UNIT_KINDS.mixed;
  if (len === 'short') {
    const noWord = kinds.filter((k) => k !== 'word');
    if (noWord.length) kinds = noWord;
  } else if (len === 'word') {
    kinds = kinds.includes('word') ? ['word'] : kinds;
  }
  const diff = len === 'medium' ? Math.min(5, level + 1) : level;
  return makeChallengeFrom(diff, kinds);
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

// The adaptive "speed round": the student picks a format (Quick / Think / Story),
// then answers questions drawn from their chosen unit at their adaptive level.
// Each answer nudges the level up (5 right in a row) or down (3 wrong in a row),
// and a "Need help?" button opens the unit's lesson + worked examples.
export function MidGameChallenge({ onDone }: { count?: number; level?: number; onDone: () => void }) {
  const unit = useProgress((s) => s.arcadeUnit);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const level0 = useProgress((s) => s.arcadeLevels[unit] ?? 1);
  const streak0 = useProgress((s) => s.arcadeStreak[unit] ?? 0);

  const [fmt, setFmt] = useState<RoundLen | null>(null);
  const [problems, setProblems] = useState<Challenge[]>([]);
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [help, setHelp] = useState(false);
  const [mastery, setMastery] = useState({ level: level0, streak: streak0 });
  const helpLesson = useMemo(() => (help ? pickLesson(unit) : null), [help, unit]);

  const startFormat = (len: RoundLen, n: number) => {
    const lvl = useProgress.getState().arcadeLevels[unit] ?? 1;
    setProblems(Array.from({ length: n }, () => makeAdaptive(unit, lvl, len)));
    setFmt(len);
    setIdx(0);
    setValue('');
    setWrong(false);
  };

  const current = problems[idx];

  const submit = () => {
    const n = Number(value.trim());
    if (value.trim() === '' || Number.isNaN(n) || !current) return;
    const correct = n === current.answer;
    const res = recordArcadeAnswer(unit, correct);
    setMastery(res);
    if (correct) {
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

  // tutor help — the unit's lesson + worked examples (answers click-to-reveal)
  if (help && helpLesson) {
    return (
      <div className="fixed inset-0 z-[60] overflow-y-auto bg-white p-3">
        <LessonCard lesson={helpLesson} onClose={() => setHelp(false)} onStart={() => setHelp(false)} />
      </div>
    );
  }

  // format chooser
  if (!fmt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
        <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
          <div className="text-3xl">🧠</div>
          <div className="mt-1 font-display font-extrabold text-slate-900">Brain Break!</div>
          <div className="mt-0.5 text-xs font-display font-bold text-slate-500">
            {ARCADE_UNIT_LABELS[unit]} · Level {mastery.level} · {mastery.streak}/5 to master
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(mastery.streak / 5) * 100}%` }} />
          </div>
          <div className="mt-3 text-sm font-display font-bold text-slate-600">Pick your round:</div>
          <div className="mt-2 space-y-2">
            {FORMATS.map((f) => (
              <button
                key={f.len}
                type="button"
                onClick={() => startFormat(f.len, f.count)}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-left hover:border-indigo-400 active:translate-y-0.5"
              >
                <span className="text-2xl mr-2">{f.emoji}</span>
                <span className="font-display font-extrabold text-slate-800">{f.label}</span>
                <span className="block text-xs text-slate-500 ml-9 -mt-1">{f.sub}</span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setHelp(true)} className="mt-3 text-sm font-display font-bold text-blue-700 hover:text-blue-800">
            🧑‍🏫 Need help? See the lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div
        key={shakeKey}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={wrong ? { scale: 1, opacity: 1, x: [0, -8, 8, -6, 6, 0] } : { scale: 1, opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl"
      >
        <div className="text-[11px] font-display font-extrabold uppercase tracking-wide text-indigo-500">
          {ARCADE_UNIT_LABELS[unit]} · Lvl {mastery.level} · {mastery.streak}/5 ⭐
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(mastery.streak / 5) * 100}%` }} />
        </div>

        <div className="mt-2 flex justify-center gap-1.5">
          {problems.map((_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i < idx ? 'bg-emerald-500' : i === idx ? 'bg-amber-400' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold text-slate-900 leading-snug break-words">
          {current?.prompt}
        </div>
        <div className={`mt-3 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums ${wrong ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-900'}`}>
          {value || <span className="text-slate-300">?</span>}
        </div>
        {wrong && <div className="mt-1 text-xs font-display font-bold text-rose-500">Try again — or get help below.</div>}

        <div className="mt-3 grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
            <button key={k} type="button" onClick={() => press(k)} className="min-h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-lg text-slate-800 active:translate-y-0.5">
              {k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>
        <button type="button" onClick={submit} disabled={!value.trim()} className="mt-3 w-full min-h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg shadow disabled:bg-slate-300 active:translate-y-0.5">
          Check ✓
        </button>
        <button type="button" onClick={() => setHelp(true)} className="mt-2 text-xs font-display font-bold text-blue-700 hover:text-blue-800">
          🧑‍🏫 Need help? See the lesson
        </button>
      </motion.div>
    </div>
  );
}
