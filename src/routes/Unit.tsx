import { useState, useMemo } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAINS, type Domain } from '../types/problem';
import { useUnitProblems } from '../hooks/useProblems';
import { useProgress, type Stars } from '../state/progress';
import { isEquivalent } from '../data/normalize';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { Hint } from '../components/Hint';
import { Explanation } from '../components/Explanation';
import { ProgressBar } from '../components/ProgressBar';

type Phase = 'loading' | 'problem' | 'feedback-correct' | 'feedback-wrong' | 'done';

export function Unit() {
  const { domain, unit } = useParams<{ domain: string; unit: string }>();
  const navigate = useNavigate();
  const record = useProgress((s) => s.recordUnitResult);

  if (!domain || !DOMAINS.includes(domain as Domain) || !unit) {
    return <Navigate to="/" replace />;
  }
  const d = domain as Domain;
  const u = parseInt(unit, 10);

  const { data: problems, loading, error } = useUnitProblems(d, u);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hintShown, setHintShown] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('problem');

  const phaseDerived: Phase = loading ? 'loading' : phase;
  const current = problems?.[index];
  const total = problems?.length ?? 0;

  const stars: Stars = useMemo<Stars>(() => {
    if (hintsUsed === 0 && mistakes === 0) return 3;
    if (hintsUsed + mistakes <= 1) return 2;
    return 1;
  }, [hintsUsed, mistakes]);

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Loading…</div>;
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
      setPhase('feedback-correct');
    } else {
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
      record(d, u, stars, missedIds);
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
      setAnswer('');
      setHintShown(false);
      setPhase('problem');
    }
  };

  if (phaseDerived === 'done') {
    return (
      <Navigate
        to={`/unit/${d}/${u}/results`}
        state={{ stars, missedCount: missedIds.length, total }}
        replace
      />
    );
  }

  return (
    <div>
      <div className="mb-4">
        <ProgressBar current={index + (phase !== 'problem' ? 1 : 0)} total={total} />
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
                  type="button"
                  onClick={submit}
                  disabled={!answer.trim()}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-slate-300 text-white font-display font-extrabold text-lg shadow-sm disabled:cursor-not-allowed transition-colors"
                >
                  Check
                </button>
              </>
            )}

            {phase === 'feedback-correct' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 bg-green-50 border-2 border-green-300 rounded-2xl p-4 text-center"
              >
                <div className="text-4xl">🎉</div>
                <div className="font-display font-extrabold text-green-800 mt-1">
                  Correct!
                </div>
                <button
                  type="button"
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
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😅</span>
                  <span className="font-display font-extrabold text-red-800">
                    Not quite.
                  </span>
                </div>
                <div className="mt-2 text-slate-800">
                  <span className="font-display font-bold">Correct answer:</span>{' '}
                  <span className="font-mono">{current.primaryAnswer}</span>
                </div>
                <Explanation steps={current.explanation} />
                <button
                  type="button"
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
