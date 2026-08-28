import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type FinalOutcome } from '../state/progress';
import { isEquivalent } from '../data/normalize';
import { getAllProblems } from '../data/problems';
import { pickFinalQuiz, FINAL_QUIZ_COUNT, FINAL_QUIZ_SIZE } from '../utils/finals';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { ProgressBar } from '../components/ProgressBar';
import { Explanation } from '../components/Explanation';
import { MathText } from '../components/MathText';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import { StickerCelebration } from '../components/StickerCelebration';
import { playUnitComplete } from '../utils/sound';
import type { Problem } from '../types/problem';

type Phase = 'loading' | 'quiz' | 'review';

// Test-style runner: NO feedback while answering — every answer is collected,
// then graded together on the review screen, with a big completion bonus.
export function FinalQuiz() {
  const { n } = useParams<{ n: string }>();
  const navigate = useNavigate();
  const quizN = parseInt(n ?? '0', 10);
  const recordFinal = useProgress((s) => s.recordFinalResult);
  const soundOn = useProgress((s) => s.soundEnabled);

  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [given, setGiven] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('loading');
  const [outcome, setOutcome] = useState<FinalOutcome | null>(null);
  const [stickerIds, setStickerIds] = useState<string[]>([]);
  const recordedRef = useRef(false);

  const valid = Number.isInteger(quizN) && quizN >= 1 && quizN <= FINAL_QUIZ_COUNT;

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    (async () => {
      try {
        const all = await getAllProblems();
        if (cancelled) return;
        setProblems(pickFinalQuiz(all, quizN));
        setPhase('quiz');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quizN, valid]);

  if (!valid) return <Navigate to="/finals" replace />;
  if (error) {
    return (
      <div className="bg-bad-soft border-2 border-bad/40 rounded-2xl p-4 text-bad">
        Couldn't load the quiz: {error.message}
      </div>
    );
  }
  if (!problems) {
    return (
      <div className="text-center py-12">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 text-ink-muted font-display font-bold">
          Building Final Quiz {quizN}…
        </div>
      </div>
    );
  }

  const current = problems[index];

  const next = () => {
    if (!answer.trim()) return;
    const updated = [...given, answer];
    setGiven(updated);
    setAnswer('');
    if (index + 1 >= problems.length) {
      const correct = problems.reduce(
        (acc, p, i) => acc + (isEquivalent(updated[i], p) ? 1 : 0),
        0,
      );
      if (!recordedRef.current) {
        recordedRef.current = true;
        const res = recordFinal(quizN, correct, problems.length);
        setOutcome(res);
        setStickerIds(res.earned);
        if (soundOn) playUnitComplete();
      }
      setPhase('review');
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (phase === 'review' && outcome) {
    const correct = problems.reduce(
      (acc, p, i) => acc + (isEquivalent(given[i], p) ? 1 : 0),
      0,
    );
    return (
      <div className="relative">
        {stickerIds.length > 0 && (
          <StickerCelebration stickerIds={stickerIds} onDone={() => setStickerIds([])} />
        )}
        {correct >= 14 && <Confetti count={28} />}
        <div className="text-center">
          <Mascot mood={correct >= 14 ? 'cheer' : 'happy'} size={110} />
          <h1 className="text-3xl font-display font-extrabold text-ink mt-2">
            {correct} / {problems.length}
          </h1>
          <div className="mt-2 inline-flex items-center gap-1 bg-warn-soft text-warn font-display font-extrabold px-4 py-2 rounded-full">
            🏆 Big bonus: +{outcome.bonus} XP
          </div>
          <p className="text-xs text-ink-muted mt-2">
            Best for this quiz: {outcome.best}/{FINAL_QUIZ_SIZE}. Now check every answer below.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {problems.map((p, i) => {
            const ok = isEquivalent(given[i], p);
            return (
              <div
                key={p.id}
                className={`rounded-2xl border-2 p-4 ${
                  ok ? 'border-ok/40 bg-ok-soft/50' : 'border-bad/40 bg-bad-soft/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg shrink-0">{ok ? '✅' : '❌'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-ink-dim">
                      Q{i + 1} · {p.domain}
                    </div>
                    <div className="text-sm text-ink mt-0.5">
                      <MathText text={p.prompt} />
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-display font-bold text-ink-muted">Your answer: </span>
                      <span className={`font-mono font-extrabold ${ok ? 'text-ok' : 'text-bad'}`}>
                        {given[i]}
                      </span>
                      {!ok && (
                        <>
                          <span className="font-display font-bold text-ink-muted"> · Correct: </span>
                          <span className="font-mono font-extrabold text-ok">{p.primaryAnswer}</span>
                        </>
                      )}
                    </div>
                    <details className="mt-2">
                      <summary className="text-xs font-display font-bold text-accent cursor-pointer">
                        Explain step by step
                      </summary>
                      <Explanation steps={p.explanation} alternatives={p.alternativeExplanations} />
                    </details>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/finals"
            className="w-full text-center min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
          >
            Back to Final Challenge
          </Link>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <ProgressBar current={index} total={problems.length} />
        <div className="mt-1 flex items-center justify-between text-xs font-display font-bold">
          <span className="text-warn">🏆 Final Quiz {quizN} · {current.domain}</span>
          <span className="text-ink-dim">Answers revealed at the end</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
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
            disabled={false}
            onSubmit={next}
          />
          <button
            type="button"
            onClick={next}
            disabled={!answer.trim()}
            className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:bg-line-strong text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none transition-all"
          >
            {index + 1 >= problems.length ? 'Finish & see answers' : `Lock it in → (${index + 1}/${FINAL_QUIZ_SIZE})`}
          </button>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => navigate('/finals')}
        className="mt-6 w-full text-sm font-display font-bold text-ink-muted hover:text-ink-muted py-2"
      >
        Quit quiz
      </button>
    </div>
  );
}
