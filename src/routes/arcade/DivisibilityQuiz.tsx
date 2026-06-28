import { useMemo, useState } from 'react';
import { useProgress } from '../../state/progress';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// A reusable "is N divisible by…?" teaching overlay. Shows N tokens, asks which of
// 2–9 divide N, marks the answer, then visually regroups the tokens into equal
// groups for each true divisor so kids SEE why it divides.
export function DivisibilityQuiz({
  total,
  token = '🔢',
  onDone,
}: {
  total: number;
  token?: string;
  onDone: () => void;
}) {
  const addAchievement = useProgress((s) => s.addAchievement);
  const divisors = useMemo(() => [2, 3, 4, 5, 6, 7, 8, 9].filter((d) => total % d === 0), [total]);
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState(false);
  const [revealIdx, setRevealIdx] = useState(0); // which divisor we're showing groups for
  const tokens = useMemo(() => Array.from({ length: Math.min(total, 60) }, (_, i) => i), [total]);

  const toggle = (d: number) => {
    if (checked) return;
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(d)) n.delete(d); else n.add(d);
      return n;
    });
  };

  const check = () => {
    const correct = divisors.length === picked.size && divisors.every((d) => picked.has(d));
    setChecked(true);
    if (correct) { addAchievement(10); sfx.levelUp(); haptic(HAPTIC.levelUp); }
    else { sfx.hurt(); haptic(HAPTIC.hit); }
  };

  const curDiv = checked && revealIdx < divisors.length ? divisors[revealIdx] : null;
  const groups = curDiv ? total / curDiv : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-xs font-display font-extrabold uppercase tracking-wider text-indigo-500">Factor Check</div>
        <div className="mt-1 font-display font-extrabold text-lg text-slate-900">You have {total}! What divides {total} evenly?</div>

        {/* token grid (regrouped during reveal) */}
        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
          {curDiv ? (
            Array.from({ length: groups }).map((_, g) => (
              <div key={g} className="flex gap-0.5 rounded-lg bg-indigo-50 px-1 py-0.5">
                {Array.from({ length: curDiv }).map((_, k) => (
                  <span key={k} style={{ fontSize: 14 }}>{token}</span>
                ))}
              </div>
            ))
          ) : (
            tokens.map((i) => <span key={i} style={{ fontSize: 14 }}>{token}</span>)
          )}
          {total > 60 && !curDiv && <span className="text-xs text-slate-400">…</span>}
        </div>

        {!checked ? (
          <>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggle(d)}
                  aria-pressed={picked.has(d)}
                  className={`min-h-11 rounded-xl font-display font-extrabold ${picked.has(d) ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button type="button" onClick={check} className="mt-4 w-full min-h-12 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">Check ✓</button>
          </>
        ) : (
          <>
            {/* mark each chip */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
                const isDiv = total % d === 0;
                const got = picked.has(d) === isDiv;
                return (
                  <div key={d} className={`min-h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-sm ${isDiv ? 'bg-emerald-100 text-emerald-700' : got ? 'bg-slate-100 text-slate-400' : 'bg-rose-100 text-rose-700'}`}>
                    {d} {isDiv ? '✓' : '✗'}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 p-2 text-sm font-display font-bold text-slate-700">
              {curDiv
                ? `${total} ÷ ${curDiv} = ${groups} equal groups — so ${total} IS divisible by ${curDiv}.`
                : divisors.length
                  ? `${total} is divisible by: ${divisors.join(', ')}.`
                  : `${total} is prime-ish here — only 1 and ${total} divide it!`}
            </div>
            <button
              type="button"
              onClick={() => {
                if (revealIdx + 1 <= divisors.length - 1) setRevealIdx((i) => i + 1);
                else if (revealIdx < divisors.length) setRevealIdx(divisors.length);
                else onDone();
              }}
              className="mt-3 w-full min-h-12 rounded-2xl bg-indigo-500 text-white font-display font-extrabold"
            >
              {curDiv ? (revealIdx < divisors.length - 1 ? `Show ÷ ${divisors[revealIdx + 1]} →` : 'Got it!') : divisors.length ? `Show ÷ ${divisors[0]} →` : 'Keep going ▶'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
