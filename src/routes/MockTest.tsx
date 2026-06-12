import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';
import { isEquivalent } from '../data/normalize';
import { getAllProblems } from '../data/problems';
import { pickMockTestProblems, ritZone, estimateRit } from '../utils/mockTest';
import { RitTrend } from '../components/RitTrend';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { Hint } from '../components/Hint';
import { Explanation } from '../components/Explanation';
import { ProgressBar } from '../components/ProgressBar';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import { StickerCelebration } from '../components/StickerCelebration';
import { playCorrect, playWrong, playUnitComplete } from '../utils/sound';
import type { Problem, HintStep } from '../types/problem';

type Phase = 'loading' | 'problem' | 'feedback-correct' | 'feedback-wrong' | 'done';

function tiersFor(problem: { hint: string; hints?: HintStep[] }): HintStep[] {
  if (problem.hints && problem.hints.length > 0) return problem.hints;
  return [{ level: 'guide', text: problem.hint }];
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function MockTest() {
  const navigate = useNavigate();
  const soundOn = useProgress((s) => s.soundEnabled);
  const recordMock = useProgress((s) => s.recordMockTestResult);
  const recordAttempt = useProgress((s) => s.recordAttempt);

  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<Phase>('loading');
  const [correct, setCorrect] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [ritEstimate, setRitEstimate] = useState(0);
  const [newStickerIds, setNewStickerIds] = useState<string[]>([]);
  const [showExplain, setShowExplain] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const recordedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await getAllProblems();
        if (cancelled) return;
        setProblems(pickMockTestProblems(all));
        setPhase('problem');
        startedAt.current = Date.now();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Timer ticks while the test is in progress.
  useEffect(() => {
    if (phase === 'loading' || phase === 'done') return;
    const id = setInterval(() => {
      setElapsed(Math.round((Date.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-800">
        Couldn't load the test: {error.message}
      </div>
    );
  }
  if (!problems) {
    return (
      <div className="text-center py-12">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 text-slate-500 font-display font-bold">Building your mock test…</div>
      </div>
    );
  }

  const current = problems[index];
  const total = problems.length;

  const submit = () => {
    if (!current || !answer.trim()) return;
    const isCorrect = isEquivalent(answer, current);
    recordAttempt(current.id, isCorrect);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setPhase('feedback-correct');
      if (soundOn) playCorrect();
    } else {
      setPhase('feedback-wrong');
      if (soundOn) playWrong();
    }
  };

  const advance = () => {
    if (index + 1 >= problems.length) {
      const finalCorrect = correct;
      const accuracy = finalCorrect / total;
      const avgDifficulty =
        problems.reduce((sum, p) => sum + p.difficulty, 0) / total;
      const rit = estimateRit(accuracy, avgDifficulty);
      setRitEstimate(rit);
      if (!recordedRef.current) {
        recordedRef.current = true;
        const earned = recordMock(accuracy, rit);
        setNewStickerIds(earned);
      }
      if (soundOn) playUnitComplete();
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
      setAnswer('');
      setShowExplain(false);
      setPhase('problem');
    }
  };

  if (phase === 'done') {
    const accuracy = correct / total;
    const zone = ritZone(accuracy);
    const toneStyles: Record<string, string> = {
      green: 'from-green-50 to-emerald-100 border-green-300 text-green-800',
      blue: 'from-sky-50 to-blue-100 border-blue-300 text-blue-800',
      yellow: 'from-yellow-50 to-amber-100 border-amber-300 text-amber-800',
      orange: 'from-orange-50 to-orange-100 border-orange-300 text-orange-800',
    };
    return (
      <div className="relative">
        {newStickerIds.length > 0 && (
          <StickerCelebration stickerIds={newStickerIds} onDone={() => setNewStickerIds([])} />
        )}
        {accuracy >= 0.7 && <Confetti count={28} />}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex justify-center">
            <Mascot mood={accuracy >= 0.7 ? 'cheer' : 'happy'} size={120} />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 mt-2">
            Mock test done!
          </h1>
          <div className={`mt-4 mx-auto max-w-md bg-gradient-to-br border-2 rounded-3xl p-5 ${toneStyles[zone.tone]}`}>
            <div className="text-xs font-display font-extrabold uppercase tracking-wider opacity-80">
              Estimated RIT
            </div>
            <div className="text-4xl font-display font-extrabold mt-1 tabular-nums">~{ritEstimate}</div>
            <div className="text-lg font-display font-extrabold mt-1">{zone.label}</div>
            <div className="text-sm mt-2 opacity-90">{zone.blurb}</div>
            <div className="text-[10px] mt-2 opacity-70">Estimate for practice — not an official MAP score.</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 max-w-md mx-auto">
            <StatBox value={`${correct}/${total}`} label="Correct" tone="green" />
            <StatBox value={`${Math.round(accuracy * 100)}%`} label="Accuracy" tone="blue" />
            <StatBox value={fmtTime(elapsed)} label="Time" tone="yellow" />
          </div>
          <RitTrend className="mt-4 mx-auto max-w-md" />
          <div className="mt-8 flex flex-col gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => navigate('/review')}
              className="w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
            >
              Review missed problems
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
            >
              Back to home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar current={index + (phase !== 'problem' ? 1 : 0)} total={total} />
          <div className="text-xs font-display font-bold text-slate-500 mt-1">
            🎓 Mock MAP test · {current.domain}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-display font-extrabold text-slate-700 tabular-nums">
            ⏱ {fmtTime(elapsed)}
          </div>
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
                className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-slate-300 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none transition-all"
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
                <div className="font-display font-extrabold text-xl text-green-800 mt-1">Correct!</div>
                <button
                  type="button"
                  onClick={advance}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
                >
                  {index + 1 >= total ? 'See results' : 'Next'}
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
                  <div className="font-display font-extrabold text-red-800 text-lg">Not quite</div>
                  <div className="mt-1 text-slate-800">
                    <span className="font-display font-bold">Correct answer:</span>{' '}
                    <span className="font-mono font-extrabold">{current.primaryAnswer}</span>
                  </div>
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
                  Explain step by step
                </button>
              )}
              <button
                type="button"
                onClick={advance}
                className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
              >
                {index + 1 >= total ? 'See results' : 'Next'}
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
        Quit test
      </button>
    </div>
  );
}

function StatBox({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: 'green' | 'red' | 'yellow' | 'blue';
}) {
  const styles = {
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  }[tone];
  return (
    <div className={`border-2 rounded-2xl p-3 ${styles}`}>
      <div className="text-xl font-display font-extrabold tabular-nums">{value}</div>
      <div className="text-xs font-display font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}
