import { useState } from 'react';
import { Mascot } from '../../components/Mascot';
import { LESSONS, lessonAnswerMatches, type Lesson } from '../../data/lessons';

// A short "teach then check" interlude shown when an arcade game is interrupted
// (a life lost, or a level cleared). It picks a random lesson, teaches one
// concept + a worked example, then asks a single practice question. It is
// never punitive — a wrong answer just reveals the worked solution, and the
// player can always continue. Pure-synchronous (LESSONS is a static import),
// so there's no loading flicker mid-game.

function pickLesson(): Lesson {
  const usable = LESSONS.filter((l) => l.examples.length > 0 && l.practice.length > 0);
  const pool = usable.length ? usable : LESSONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function MiniLesson({
  onDone,
  heading = 'Quick lesson',
}: {
  onDone: () => void;
  heading?: string;
}) {
  const [lesson] = useState(pickLesson);
  const [phase, setPhase] = useState<'teach' | 'check'>('teach');
  const [revealed, setRevealed] = useState(false);
  const [val, setVal] = useState('');
  const [checked, setChecked] = useState(false);

  const example = lesson.examples[0];
  const practice = lesson.practice[0];
  const correct = checked && lessonAnswerMatches(val, practice.answers);

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <Mascot mood={phase === 'teach' ? 'mentor' : 'coach'} size={56} />
        <div>
          <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-indigo-500">
            📖 {heading}
          </div>
          <h2 className="text-lg font-display font-extrabold text-slate-900 leading-tight">
            {lesson.title}
          </h2>
        </div>
      </div>

      {phase === 'teach' ? (
        <>
          <div className="rounded-2xl bg-indigo-50 border-2 border-indigo-100 p-4">
            <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-indigo-600 mb-1">
              Key idea
            </div>
            <p className="text-sm font-display font-bold text-slate-800">{lesson.concept[0]}</p>
          </div>

          <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 p-4">
            <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Worked example
            </div>
            <div className="text-base font-display font-extrabold text-slate-900">{example.q}</div>
            {revealed ? (
              <div className="mt-3">
                <ol className="space-y-1.5">
                  {example.steps.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-800">
                      <span className="text-slate-400 font-display font-bold w-4 shrink-0">{i + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-green-100 text-green-800 font-display font-extrabold text-sm rounded-full px-3 py-1">
                  ✅ Answer: {example.answer}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-3 w-full min-h-11 px-4 py-2 rounded-xl bg-white border-2 border-sky-200 text-sky-700 font-display font-extrabold text-sm hover:bg-sky-50 transition-colors"
              >
                Show step-by-step →
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPhase('check')}
            className="mt-5 w-full min-h-12 rounded-2xl bg-indigo-500 px-6 font-display font-extrabold text-white shadow"
          >
            Got it — try one →
          </button>
        </>
      ) : (
        <>
          <div className="rounded-2xl border-2 border-slate-200 p-4">
            <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Your turn
            </div>
            <div className="text-base font-display font-extrabold text-slate-900">{practice.q}</div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                inputMode="text"
                value={val}
                onChange={(e) => {
                  setVal(e.target.value);
                  setChecked(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && val.trim()) setChecked(true);
                }}
                placeholder="Your answer"
                className="flex-1 min-w-0 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-display font-bold text-slate-900 focus:border-duo-blue focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setChecked(true)}
                disabled={!val.trim()}
                className="shrink-0 px-4 rounded-xl bg-duo-blue hover:bg-blue-600 disabled:bg-slate-200 text-white font-display font-extrabold text-sm transition-colors"
              >
                Check
              </button>
            </div>
            {checked && (
              <div className="mt-3">
                <div
                  className={`text-sm font-display font-extrabold ${correct ? 'text-green-700' : 'text-red-700'}`}
                >
                  {correct ? '✅ Correct!' : '🤔 Not quite — here is how:'}
                </div>
                <ol className="mt-2 space-y-1.5">
                  {practice.steps.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-800">
                      <span className="text-slate-400 font-display font-bold w-4 shrink-0">{i + 1}.</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-green-100 text-green-800 font-display font-extrabold text-sm rounded-full px-3 py-1">
                  Answer: {practice.answers[0]}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onDone}
            className="mt-5 w-full min-h-12 rounded-2xl bg-emerald-500 px-6 font-display font-extrabold text-white shadow"
          >
            Continue playing →
          </button>
        </>
      )}
    </div>
  );
}
