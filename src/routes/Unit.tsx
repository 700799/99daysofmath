import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAINS, type Domain } from '../types/problem';
import { useUnitProblems } from '../hooks/useProblems';
import { useProgress, type Stars } from '../state/progress';
import { coinsForUnitResult } from '../rewards/economy';
import { isEquivalent } from '../data/normalize';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { Hint } from '../components/Hint';
import { Explanation } from '../components/Explanation';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingSplash } from '../components/LoadingSplash';
import { Icon } from '../icons/Icon';

type Phase = 'problem' | 'feedback-correct' | 'feedback-wrong' | 'done';

const PRAISE = ['Correct!', 'Nice work!', 'You got it!', 'Brilliant!', 'Way to go!'];

export function Unit() {
  const { domain, unit } = useParams<{ domain: string; unit: string }>();
  const navigate = useNavigate();
  const record = useProgress((s) => s.recordUnitResult);

  // Hooks must run on every render, so validate first and redirect after.
  const valid = !!domain && DOMAINS.includes(domain as Domain) && !!unit;
  const d = (valid ? domain : DOMAINS[0]) as Domain;
  const u = valid ? parseInt(unit, 10) : 1;

  const { data: problems, loading, error } = useUnitProblems(d, u);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hintShown, setHintShown] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [phase, setPhase] = useState<Phase>('problem');

  const current = problems?.[index];
  const total = problems?.length ?? 0;

  const stars: Stars =
    hintsUsed === 0 && mistakes === 0 ? 3 : hintsUsed + mistakes <= 1 ? 2 : 1;

  if (!valid) {
    return <Navigate to="/" replace />;
  }
  if (loading) {
    return <LoadingSplash text="Sharpening pencils…" />;
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800">
        {error.message}
      </div>
    );
  }
  if (!problems || problems.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-900">
        This unit has no problems yet.
      </div>
    );
  }

  const submit = () => {
    if (!current || !answer.trim()) return;
    if (isEquivalent(answer, current)) {
      setStreak((s) => s + 1);
      setPhase('feedback-correct');
    } else {
      setStreak(0);
      setMistakes((m) => m + 1);
      setMissedIds((ids) =>
        ids.includes(current.id) ? ids : [...ids, current.id],
      );
      setPhase('feedback-wrong');
    }
  };

  const advance = () => {
    if (!problems) return;
    if (index + 1 >= problems.length) {
      // Coins depend on the previous best, so compute before recording.
      const prevBest = useProgress.getState().starsForUnit(d, u);
      setCoinsEarned(coinsForUnitResult(prevBest, stars));
      record(d, u, stars, missedIds);
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
      setAnswer('');
      setHintShown(false);
      setPhase('problem');
    }
  };

  if (phase === 'done') {
    return (
      <Navigate
        to={`/unit/${d}/${u}/results`}
        state={{ stars, missedCount: missedIds.length, total, coinsEarned }}
        replace
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar current={index + (phase !== 'problem' ? 1 : 0)} total={total} />
        </div>
        <AnimatePresence>
          {streak >= 2 && (
            <motion.div
              key="streak"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-full"
              aria-label={`${streak} correct in a row`}
            >
              <Icon name="bolt" size={16} />
              <span className="font-display font-extrabold text-amber-900 text-sm tabular-nums">
                ×{streak}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {current && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.id}-${phase}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ProblemCard problem={current} />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (phase === 'problem') submit();
              }}
            >
              <AnswerInput
                problem={current}
                value={answer}
                onChange={setAnswer}
                disabled={phase === 'feedback-correct' || phase === 'feedback-wrong'}
              />

              {phase === 'problem' && (
                <>
                  <Hint
                    text={current.hint}
                    onReveal={() => {
                      if (!hintShown) {
                        setHintShown(true);
                        setHintsUsed((h) => h + 1);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!answer.trim()}
                    className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-slate-300 text-white font-display font-extrabold text-lg shadow-sm disabled:cursor-not-allowed transition-colors"
                  >
                    Check
                  </button>
                </>
              )}
            </form>

            {phase === 'feedback-correct' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 bg-green-50 border-2 border-green-300 rounded-2xl p-4 text-center"
              >
                <div className="flex justify-center">
                  <Icon name="check" size={44} />
                </div>
                <div className="font-display font-extrabold text-green-800 mt-2">
                  {PRAISE[index % PRAISE.length]}
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={advance}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-sm"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {phase === 'feedback-wrong' && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 bg-red-50 border-2 border-red-300 rounded-2xl p-4"
              >
                <div className="font-display font-extrabold text-red-800">
                  Almost! Let's see how it works.
                </div>
                <div className="mt-2 text-slate-800">
                  <span className="font-display font-bold">Correct answer:</span>{' '}
                  <span className="font-mono">{current.primaryAnswer}</span>
                </div>
                <Explanation steps={current.explanation} />
                <button
                  type="button"
                  autoFocus
                  onClick={advance}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold text-lg shadow-sm"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <button
        type="button"
        onClick={() => navigate(`/trail/${d}`)}
        className="mt-6 w-full text-sm font-display font-bold text-slate-500 hover:text-slate-700 py-2"
      >
        Quit to trail
      </button>
    </div>
  );
}
