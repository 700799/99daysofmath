import { Link } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { FINAL_QUIZ_COUNT, FINAL_QUIZ_SIZE, finalKey } from '../utils/finals';
import { COURSES } from '../data/courses';
import { Mascot } from '../components/Mascot';

// Every course has its own Final Challenge — five quizzes of 20 questions
// drawn from that course's own strands. This picks the course; the quizzes
// themselves live at /finals/:courseId.
export function Finals() {
  const finalsResults = useProgress((s) => s.finalsResults);
  const doneTotal = Object.keys(finalsResults).length;
  const grandTotal = COURSES.length * FINAL_QUIZ_COUNT;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Mascot mood="proud" size={64} />
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink">
            🏆 Final Challenge
          </h1>
          <p className="text-sm text-ink-muted">
            Every course has {FINAL_QUIZ_COUNT} big quizzes · {FINAL_QUIZ_SIZE} questions
            each · answers shown only at the end · <b>+40 XP bonus +2 per correct</b>.
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        {doneTotal} / {grandTotal} quizzes completed
        {doneTotal === grandTotal ? ' — 👑 Grand Champion!' : ''}
      </div>

      <div className="mt-3 space-y-3">
        {COURSES.map((c) => {
          const done = Array.from({ length: FINAL_QUIZ_COUNT }, (_, i) =>
            finalsResults[finalKey(c.id, i + 1)],
          );
          const doneCount = done.filter(Boolean).length;
          const complete = doneCount === FINAL_QUIZ_COUNT;
          return (
            <Link
              key={c.id}
              to={`/finals/${c.id}`}
              className="block rounded-3xl p-4 bg-surface border-2 border-line hover:border-warn/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${c.color}22` }}
                >
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-ink">
                    {c.name} {complete ? '👑' : ''}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {doneCount === 0
                      ? `${FINAL_QUIZ_COUNT} quizzes · ${FINAL_QUIZ_SIZE} questions from ${
                          c.strands.length > 1 ? `all ${c.strands.length} strands` : 'the whole course'
                        }`
                      : `${doneCount} / ${FINAL_QUIZ_COUNT} done`}
                  </div>
                  <div className="mt-2 flex gap-1">
                    {done.map((res, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          res ? 'bg-ok' : 'bg-line-strong'
                        }`}
                      />
                    ))}
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
        className="mt-6 inline-block text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
      >
        ← Back home
      </Link>
    </div>
  );
}
