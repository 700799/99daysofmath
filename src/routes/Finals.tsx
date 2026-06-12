import { Link } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { FINAL_QUIZ_COUNT, FINAL_QUIZ_SIZE } from '../utils/finals';
import { Mascot } from '../components/Mascot';

// Hub for the five Final Challenge quizzes: 20 questions each, answers only
// revealed at the very end, with a big XP bonus.
export function Finals() {
  const finalsResults = useProgress((s) => s.finalsResults);
  const doneCount = Object.keys(finalsResults).length;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Mascot mood="proud" size={64} />
        <div>
          <h1 className="text-2xl font-display font-extrabold text-slate-900">
            🏆 Final Challenge
          </h1>
          <p className="text-sm text-slate-600">
            Five big quizzes · {FINAL_QUIZ_SIZE} questions each · answers shown only at
            the end · <b>+40 XP bonus +2 per correct</b>.
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
        {doneCount} / {FINAL_QUIZ_COUNT} completed
        {doneCount === FINAL_QUIZ_COUNT ? ' — 👑 Champion!' : ''}
      </div>

      <div className="mt-3 space-y-3">
        {Array.from({ length: FINAL_QUIZ_COUNT }, (_, i) => i + 1).map((n) => {
          const res = finalsResults[n];
          return (
            <Link
              key={n}
              to={`/finals/${n}`}
              className="block rounded-3xl p-4 bg-white border-2 border-slate-200 hover:border-amber-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-display font-extrabold ${
                    res ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {res ? '✓' : n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-slate-900">
                    Final Quiz {n}
                  </div>
                  <div className="text-xs text-slate-500">
                    {res
                      ? `Best: ${res.best}/${FINAL_QUIZ_SIZE} · tap to beat it`
                      : `${FINAL_QUIZ_SIZE} mixed questions across all six topics`}
                  </div>
                </div>
                <div className="text-xl shrink-0">→</div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        to="/"
        className="mt-6 inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
      >
        ← Back home
      </Link>
    </div>
  );
}
