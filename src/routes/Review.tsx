import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAINS, type Domain, type Problem, type HintStep } from '../types/problem';
import { useProgress } from '../state/progress';
import { isEquivalent } from '../data/normalize';
import { getProblemsByIds } from '../data/problems';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { Hint } from '../components/Hint';
import { Explanation } from '../components/Explanation';
import { ProgressBar } from '../components/ProgressBar';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import { playCorrect, playWrong } from '../utils/sound';

type Phase = 'loading' | 'problem' | 'feedback-correct' | 'feedback-wrong' | 'done';

function tiersFor(problem: { hint: string; hints?: HintStep[] }): HintStep[] {
  if (problem.hints && problem.hints.length > 0) return problem.hints;
  return [{ level: 'guide', text: problem.hint }];
}

export function Review() {
  const navigate = useNavigate();
  const params = useParams<{ domain?: string }>();
  const filterDomain =
    params.domain && DOMAINS.includes(params.domain as Domain)
      ? (params.domain as Domain)
      : null;

  const byDomain = useProgress((s) => s.byDomain);
  const clearMissed = useProgress((s) => s.clearMissed);
  const soundOn = useProgress((s) => s.soundEnabled);

  // Snapshot the missed IDs once on mount so the queue is stable as we clear them.
  const [queueIds] = useState<{ id: string; domain: Domain }[]>(() => {
    const out: { id: string; domain: Domain }[] = [];
    for (const d of DOMAINS) {
      if (filterDomain && d !== filterDomain) continue;
      for (const id of byDomain[d]?.missedProblemIds ?? []) {
        out.push({ id, domain: d });
      }
    }
    return out;
  });

  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<Phase>('loading');
  const [firstTry, setFirstTry] = useState(true);
  const [cleared, setCleared] = useState(0);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ids = queueIds.map((q) => q.id);
        const loaded = await getProblemsByIds(ids);
        if (cancelled) return;
        // Preserve queue order.
        const byId = new Map(loaded.map((p) => [p.id, p]));
        const ordered = queueIds.map((q) => byId.get(q.id)).filter((p): p is Problem => !!p);
        setProblems(ordered);
        setPhase(ordered.length > 0 ? 'problem' : 'done');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queueIds]);

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-800">
        Couldn't load review: {error.message}
      </div>
    );
  }

  if (!problems) {
    return (
      <div className="text-center py-12">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 text-slate-500 font-display font-bold">Loading review…</div>
      </div>
    );
  }

  // Empty state — nothing to review.
  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <Mascot mood="happy" size={120} />
        <h1 className="text-2xl font-display font-extrabold text-slate-900 mt-3">All clear!</h1>
        <p className="text-slate-600 mt-1">
          You have no missed problems to review{filterDomain ? ` in ${filterDomain}` : ''}.
        </p>
        <div className="mt-6 flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            to="/mix"
            className="w-full min-h-12 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
          >
            Try a Daily Mix
          </Link>
          <Link
            to="/test"
            className="w-full min-h-12 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
          >
            Take a Mock Test
          </Link>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="text-center py-12">
        <Confetti count={24} />
        <Mascot mood="cheer" size={120} />
        <h1 className="text-3xl font-display font-extrabold text-slate-900 mt-2">Review complete!</h1>
        <p className="text-slate-600 mt-2">
          You cleared <span className="font-display font-extrabold text-green-700">{cleared}</span> of{' '}
          {problems.length} from your review queue.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-8 inline-block w-full max-w-xs min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
        >
          Back to home
        </button>
      </div>
    );
  }

  const current = problems[index];
  const currentDomain = queueIds[index]?.domain ?? current.domain;
  const total = problems.length;

  const submit = () => {
    if (!current || !answer.trim()) return;
    if (isEquivalent(answer, current)) {
      if (firstTry) {
        clearMissed(currentDomain, current.id);
        setCleared((c) => c + 1);
      }
      setPhase('feedback-correct');
      if (soundOn) playCorrect();
    } else {
      setFirstTry(false);
      setPhase('feedback-wrong');
      if (soundOn) playWrong();
    }
  };

  const advance = () => {
    if (index + 1 >= problems.length) {
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
      setAnswer('');
      setFirstTry(true);
      setShowExplain(false);
      setPhase('problem');
    }
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar current={index + (phase !== 'problem' ? 1 : 0)} total={total} />
          <div className="text-xs font-display font-bold text-amber-700 mt-1">
            🔁 Review · {currentDomain}
          </div>
        </div>
        <div className="shrink-0">
          <Mascot
            mood={phase === 'feedback-correct' ? 'cheer' : phase === 'feedback-wrong' ? 'oops' : 'thinking'}
            size={48}
          />
        </div>
      </div>

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
            disabled={phase !== 'problem'}
            onSubmit={submit}
          />

          {phase === 'problem' && (
            <>
              <Hint tiers={tiersFor(current)} />
              <button
                type="button"
                onClick={submit}
                disabled={!answer.trim()}
                className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-slate-300 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none transition-all"
              >
                Check
              </button>
            </>
          )}

          {phase === 'feedback-correct' && (
            <div className="relative">
              <Confetti />
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className="mt-4 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-3xl p-5 text-center"
              >
                <div className="text-4xl">✅</div>
                <div className="font-display font-extrabold text-xl text-green-800 mt-1">
                  {firstTry ? 'Cleared from review! ✓' : 'Got it!'}
                </div>
                <button
                  type="button"
                  onClick={advance}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
                >
                  {index + 1 >= total ? 'Finish' : 'Next'}
                </button>
              </motion.div>
            </div>
          )}

          {phase === 'feedback-wrong' && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-3xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl shrink-0">🤔</div>
                <div className="flex-1">
                  <div className="font-display font-extrabold text-red-800 text-lg">Keep practicing</div>
                  <div className="mt-1 text-slate-800">
                    <span className="font-display font-bold">Correct answer:</span>{' '}
                    <span className="font-mono font-extrabold">{current.primaryAnswer}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Stays in your review queue.</div>
                </div>
              </div>
              {showExplain ? (
                <div className="mt-2">
                  <Explanation steps={current.explanation} alternatives={current.alternativeExplanations} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowExplain(true)}
                  className="mt-2 text-sm font-display font-bold text-red-800 underline underline-offset-2"
                >
                  Show how it works
                </button>
              )}
              <button
                type="button"
                onClick={advance}
                className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
              >
                {index + 1 >= total ? 'Finish' : 'Next'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 w-full text-sm font-display font-bold text-slate-500 hover:text-slate-700 py-2"
      >
        Quit review
      </button>
    </div>
  );
}
