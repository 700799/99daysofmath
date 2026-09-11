import { Link, Navigate, useParams } from 'react-router-dom';
import { useProgress } from '../state/progress';
import {
  FINAL_QUIZ_COUNT,
  FINAL_QUIZ_SIZE,
  finalKey,
  LEGACY_FINALS_COURSE,
} from '../utils/finals';
import { getCourse } from '../data/courses';
import { Mascot } from '../components/Mascot';

// One course's five Final Challenge quizzes.
export function FinalsCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const finalsResults = useProgress((s) => s.finalsResults);
  const course = getCourse(courseId ?? '');

  // Finals used to be a bare quiz number, and those links are still out there
  // (bookmarks, the old hub). Send them to the course they actually were.
  if (!course) {
    if (courseId && /^\d+$/.test(courseId)) {
      return <Navigate to={`/finals/${LEGACY_FINALS_COURSE}/${courseId}`} replace />;
    }
    return <Navigate to="/finals" replace />;
  }

  const doneCount = Array.from({ length: FINAL_QUIZ_COUNT }, (_, i) =>
    finalsResults[finalKey(course.id, i + 1)],
  ).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center gap-3">
        <Mascot mood="proud" size={64} />
        <div>
          <h1 className="text-2xl font-display font-extrabold text-ink">
            {course.emoji} {course.name} Finals
          </h1>
          <p className="text-sm text-ink-muted">
            {FINAL_QUIZ_COUNT} big quizzes · {FINAL_QUIZ_SIZE} questions each · answers
            shown only at the end · <b>+40 XP bonus +2 per correct</b>.
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        {doneCount} / {FINAL_QUIZ_COUNT} completed
        {doneCount === FINAL_QUIZ_COUNT ? ' — 👑 Champion!' : ''}
      </div>

      <div className="mt-3 space-y-3">
        {Array.from({ length: FINAL_QUIZ_COUNT }, (_, i) => i + 1).map((n) => {
          const res = finalsResults[finalKey(course.id, n)];
          return (
            <Link
              key={n}
              to={`/finals/${course.id}/${n}`}
              className="block rounded-3xl p-4 bg-surface border-2 border-line hover:border-warn/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-display font-extrabold ${
                    res ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'
                  }`}
                >
                  {res ? '✓' : n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-ink">
                    Final Quiz {n}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {res
                      ? `Best: ${res.best}/${FINAL_QUIZ_SIZE} · tap to beat it`
                      : course.strands.length > 1
                        ? `${FINAL_QUIZ_SIZE} mixed questions across ${course.strands
                            .map((s) => s.label)
                            .join(', ')}`
                        : `${FINAL_QUIZ_SIZE} mixed questions from the whole course`}
                  </div>
                </div>
                <div className="text-xl shrink-0">→</div>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        to="/finals"
        className="mt-6 inline-block text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
      >
        ← All courses
      </Link>
    </div>
  );
}
