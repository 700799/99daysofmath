import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMockTest, allQuestions } from '../../data/sat/tests';
import { SAT_AREA_INFO, areaOfUnit } from '../../data/sat/blueprint';
import { diagnoseTest, selectRecoveryProblems, type RecoveryPick } from '../../utils/satAnalysis';
import { getAllProblems } from '../../data/problems';
import { useProgress } from '../../state/progress';
import { useMathClock } from '../../hooks/useMathClock';
import { isEquivalent } from '../../data/normalize';
import { ProblemCard } from '../../components/ProblemCard';
import { AnswerInput } from '../../components/AnswerInput';
import { Hint } from '../../components/Hint';
import { Explanation } from '../../components/Explanation';
import { ProgressBar } from '../../components/ProgressBar';
import { Mascot } from '../../components/Mascot';
import { Confetti } from '../../components/Celebration';
import { correctMessage, wrongMessage } from '../../utils/encouragement';
import { playCorrect, playWrong, playUnitComplete } from '../../utils/sound';
import { computeXPGain } from '../../utils/hintEconomics';
import { useSeo } from '../../lib/seo';
import type { HintLevel, HintStep } from '../../types/problem';

// ── /sat/recovery/:n — the custom practice set ─────────────────────────────
// Ten problems selected by the analysis engine from this student's stored
// mock-test answers: more problems from the units that bled more points, at
// a difficulty matched to what was missed there. Unlike the mock test, this
// is a teaching surface — full hints, explanations, and XP.

type Phase = 'loading' | 'problem' | 'feedback-correct' | 'feedback-wrong' | 'done';

function tiersFor(problem: { hint: string; hints?: HintStep[] }): HintStep[] {
  if (problem.hints && problem.hints.length > 0) return problem.hints;
  return [{ level: 'guide', text: problem.hint }];
}

export function SatRecovery() {
  useMathClock();
  const { n } = useParams<{ n: string }>();
  const testN = Number(n);
  const test = getMockTest(testN);
  const result = useProgress((s) => (s.satTests ?? {})[testN]);
  const navigate = useNavigate();
  const awardXP = useProgress((s) => s.awardXP);
  const incStreak = useProgress((s) => s.incrementStreak);
  const resetStreak = useProgress((s) => s.resetStreak);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const touchDay = useProgress((s) => s.touchDay);
  const soundOn = useProgress((s) => s.soundEnabled);
  const currentStreak = useProgress((s) => s.streak);

  useSeo({
    title: test ? `${test.title} — custom recovery practice | Math10x` : 'SAT recovery practice | Math10x',
    description:
      'A practice set built from your own mock-test misses — weighted toward the units that cost you points, with full hints and explanations.',
    canonicalPath: `/sat/recovery/${testN}`,
  });

  const [picks, setPicks] = useState<RecoveryPick[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [answer, setAnswer] = useState('');
  const [hintLevelsThisProblem, setHintLevelsThisProblem] = useState<HintLevel[]>([]);
  const [correct, setCorrect] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showExplainOnCorrect, setShowExplainOnCorrect] = useState(false);
  const [flash, setFlash] = useState('');

  const diag = useMemo(() => {
    if (!test || !result) return null;
    return diagnoseTest(allQuestions(test), result.answers);
  }, [test, result]);

  useEffect(() => {
    if (!diag) return;
    let cancelled = false;
    (async () => {
      try {
        const pool = await getAllProblems();
        if (cancelled) return;
        const chosen = selectRecoveryProblems(diag, pool);
        setPicks(chosen);
        setPhase(chosen.length > 0 ? 'problem' : 'done');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [diag]);

  if (!test || !Number.isFinite(testN)) return <Navigate to="/sat" replace />;
  if (!result) return <Navigate to={`/sat/test/${testN}`} replace />;

  if (error) {
    return (
      <div className="rounded-2xl border-2 border-bad/40 bg-bad-soft p-4 text-bad">
        Couldn't build your practice set: {error.message}
      </div>
    );
  }
  if (phase === 'loading' || !picks) {
    return (
      <div className="py-12 text-center">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 font-display font-bold text-ink-muted">Building your set from your misses…</div>
      </div>
    );
  }

  const finish = () => {
    awardXP(xpEarned);
    touchDay();
    if (soundOn) playUnitComplete();
    setPhase('done');
  };

  if (phase === 'done') {
    const total = Math.max(1, picks.length);
    const accuracy = correct / total;
    return (
      <div className="relative">
        {accuracy >= 0.8 && <Confetti count={24} />}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex justify-center">
            <Mascot mood={accuracy >= 0.8 ? 'cheer' : 'happy'} size={120} />
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Recovery set done!</h1>
          <p className="mt-1 text-ink-muted">
            {correct}/{picks.length} on the units that cost you points on {test.title}.
          </p>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-ok/40 bg-ok-soft p-3">
              <div className="font-display text-2xl font-extrabold tabular-nums text-ok">{correct}/{picks.length}</div>
              <div className="text-xs font-display font-bold uppercase tracking-wider text-ok">Correct</div>
            </div>
            <div className="rounded-2xl border-2 border-accent/35 bg-accent-soft p-3">
              <div className="font-display text-2xl font-extrabold tabular-nums text-accent">{Math.round(accuracy * 100)}%</div>
              <div className="text-xs font-display font-bold uppercase tracking-wider text-accent">Accuracy</div>
            </div>
            <div className="rounded-2xl border-2 border-warn/40 bg-warn-soft p-3">
              <div className="font-display text-2xl font-extrabold tabular-nums text-warn">{xpEarned}</div>
              <div className="text-xs font-display font-bold uppercase tracking-wider text-warn">XP</div>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-md text-[13px] leading-relaxed text-ink-muted">
            {accuracy >= 0.8
              ? 'The leaks are closing. Lock each weak unit to three stars on its drill, then re-test in a few days.'
              : 'Some of these still bite — open the playbooks for the units you missed here before drilling again.'}
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate(`/sat/analysis/${testN}`)}
              className="w-full rounded-2xl bg-accent px-6 py-3 font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
            >
              Back to my analysis
            </button>
            <button
              type="button"
              onClick={() => navigate('/sat')}
              className="w-full rounded-2xl border-2 border-line bg-surface px-6 py-3 font-display text-sm font-bold text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              SAT Math home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const pick = picks[index];
  if (!pick) return null;
  const current = pick.problem;
  const area = areaOfUnit(current.unit);
  const areaInfo = area ? SAT_AREA_INFO[area] : null;

  const submit = () => {
    if (!answer.trim()) return;
    const ok = isEquivalent(answer, current);
    recordAttempt(current.id, ok);
    if (ok) {
      setXpEarned((x) => x + computeXPGain(hintLevelsThisProblem, 0));
      setCorrect((c) => c + 1);
      incStreak();
      setFlash(correctMessage(currentStreak + 1));
      setPhase('feedback-correct');
      if (soundOn) playCorrect();
    } else {
      resetStreak();
      setFlash(wrongMessage());
      setPhase('feedback-wrong');
      if (soundOn) playWrong();
    }
  };

  const advance = () => {
    if (index + 1 >= picks.length) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
    setAnswer('');
    setHintLevelsThisProblem([]);
    setShowExplainOnCorrect(false);
    setPhase('problem');
  };

  return (
    <div className="relative">
      <div className="mb-3">
        <ProgressBar current={index + (phase === 'problem' ? 0 : 1)} total={picks.length} />
        <div className="mt-1 text-xs font-display font-bold text-accent">
          🩹 Recovery set · {test.title} · {index + 1} of {picks.length}
        </div>
      </div>

      {/* why this problem is in the set — the customization made visible */}
      <div
        className="mb-3 rounded-2xl border-2 border-line bg-surface p-3"
        style={areaInfo ? { borderLeftWidth: 6, borderLeftColor: areaInfo.color } : undefined}
      >
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-dim">
          {areaInfo ? `${areaInfo.emoji} ${areaInfo.short}` : 'SAT'} · Unit {current.unit} · why it's here
        </div>
        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">{pick.reason}</p>
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
              <Hint
                tiers={tiersFor(current)}
                onReveal={(level) => setHintLevelsThisProblem((arr) => [...arr, level])}
              />
              <button
                type="button"
                onClick={submit}
                disabled={!answer.trim()}
                className="mt-4 w-full min-h-14 rounded-2xl bg-accent px-6 py-3 font-display text-lg font-extrabold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong"
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
                className="mt-4 rounded-3xl border-2 border-ok/50 bg-ok-soft p-5 text-center"
              >
                <div className="text-5xl">🎉</div>
                <div className="mt-1 font-display text-2xl font-extrabold text-ok">{flash}</div>
                {showExplainOnCorrect ? (
                  <div className="mt-3 text-left">
                    <Explanation steps={current.explanation} alternatives={current.alternativeExplanations} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowExplainOnCorrect(true)}
                    className="mt-3 font-display text-sm font-bold text-ok underline underline-offset-2"
                  >
                    Explain step by step
                  </button>
                )}
                <button
                  type="button"
                  onClick={advance}
                  className="mt-4 w-full min-h-14 rounded-2xl bg-accent px-6 py-3 font-display text-lg font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
                >
                  {index + 1 >= picks.length ? 'Finish' : 'Continue'}
                </button>
              </motion.div>
            </div>
          )}

          {phase === 'feedback-wrong' && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 rounded-3xl border-2 border-bad/50 bg-bad-soft p-5"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 text-4xl">🤔</div>
                <div className="flex-1">
                  <div className="font-display text-lg font-extrabold text-bad">{flash}</div>
                  <div className="mt-1 text-ink">
                    <span className="font-display font-bold">Correct answer:</span>{' '}
                    <span className="font-mono font-extrabold">{current.primaryAnswer}</span>
                  </div>
                </div>
              </div>
              <Explanation steps={current.explanation} alternatives={current.alternativeExplanations} />
              <button
                type="button"
                onClick={advance}
                className="mt-4 w-full min-h-14 rounded-2xl bg-accent px-6 py-3 font-display text-lg font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
              >
                {index + 1 >= picks.length ? 'Finish' : 'Got it'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <Link
        to={`/sat/analysis/${testN}`}
        className="mt-6 block w-full py-2 text-center font-display text-sm font-bold text-ink-muted hover:text-ink"
      >
        Quit to my analysis
      </Link>
    </div>
  );
}
