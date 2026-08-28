import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';
import { useMathClock } from '../hooks/useMathClock';
import { isEquivalent } from '../data/normalize';
import { getAllProblems } from '../data/problems';
import { pickAdaptiveProblem, nextTarget, PRACTICE_SIZE } from '../utils/adaptive';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { Hint } from '../components/Hint';
import { ConceptHelp } from '../components/ConceptHelp';
import { GeniusTipCard } from '../components/GeniusTip';
import { Explanation } from '../components/Explanation';
import { ProgressBar } from '../components/ProgressBar';
import { Mascot, type MascotMood } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import { StickerCelebration } from '../components/StickerCelebration';
import { correctMessage, wrongMessage } from '../utils/encouragement';
import { playCorrect, playWrong, playUnitComplete } from '../utils/sound';
import { computeXPGain } from '../utils/hintEconomics';
import type { Problem, HintLevel, HintStep } from '../types/problem';

type Phase = 'loading' | 'problem' | 'feedback-correct' | 'feedback-wrong' | 'done';

function tiersFor(problem: { hint: string; hints?: HintStep[] }): HintStep[] {
  if (problem.hints && problem.hints.length > 0) return problem.hints;
  return [{ level: 'guide', text: problem.hint }];
}

export function Practice() {
  useMathClock();
  const navigate = useNavigate();
  const awardXP = useProgress((s) => s.awardXP);
  const incStreak = useProgress((s) => s.incrementStreak);
  const resetStreak = useProgress((s) => s.resetStreak);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const touchDay = useProgress((s) => s.touchDay);
  const soundOn = useProgress((s) => s.soundEnabled);
  const currentStreak = useProgress((s) => s.streak);

  const poolRef = useRef<Problem[]>([]);
  const seenRef = useRef<Set<string>>(new Set());
  const targetRef = useRef<number>(2);

  const [current, setCurrent] = useState<Problem | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [answer, setAnswer] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [hintLevelsThisProblem, setHintLevelsThisProblem] = useState<HintLevel[]>([]);
  const [lastHintLevel, setLastHintLevel] = useState<HintLevel | null>(null);
  const [served, setServed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [newStickerIds, setNewStickerIds] = useState<string[]>([]);
  const [showExplainOnCorrect, setShowExplainOnCorrect] = useState(false);
  const flashMessage = useRef<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Adaptive practice pools the grade-level (core) domains only — the
        // Algebra 1 and Precalculus trails have their own practice so kids
        // aren't ambushed here.
        const all = (await getAllProblems()).filter((p) => p.domain !== 'A1' && p.domain !== 'PC');
        if (cancelled) return;
        poolRef.current = all;
        const stats = useProgress.getState().problemStats;
        const first = pickAdaptiveProblem(all, seenRef.current, targetRef.current, stats);
        if (first) {
          seenRef.current.add(first.id);
          setCurrent(first);
          setServed(1);
          setPhase('problem');
        } else {
          setPhase('done');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="bg-bad-soft border-2 border-bad/40 rounded-2xl p-4 text-bad">
        Couldn't start practice: {error.message}
      </div>
    );
  }
  if (phase === 'loading' || (!current && phase !== 'done')) {
    return (
      <div className="text-center py-12">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 text-ink-muted font-display font-bold">Tuning to your level…</div>
      </div>
    );
  }

  const finish = () => {
    const earned = awardXP(xpEarned);
    touchDay();
    if (soundOn) playUnitComplete();
    setNewStickerIds(earned);
    setPhase('done');
  };

  const submit = () => {
    if (!current || !answer.trim()) return;
    const isCorrect = isEquivalent(answer, current);
    recordAttempt(current.id, isCorrect);
    targetRef.current = nextTarget(targetRef.current, isCorrect);
    if (isCorrect) {
      const earn = computeXPGain(hintLevelsThisProblem, 0);
      setXpEarned((x) => x + earn);
      setCorrect((c) => c + 1);
      incStreak();
      flashMessage.current = correctMessage(currentStreak + 1);
      setPhase('feedback-correct');
      if (soundOn) playCorrect();
    } else {
      resetStreak();
      flashMessage.current = wrongMessage();
      setPhase('feedback-wrong');
      if (soundOn) playWrong();
    }
  };

  const advance = () => {
    if (served >= PRACTICE_SIZE) {
      finish();
      return;
    }
    const stats = useProgress.getState().problemStats;
    const next = pickAdaptiveProblem(poolRef.current, seenRef.current, targetRef.current, stats);
    if (!next) {
      finish();
      return;
    }
    seenRef.current.add(next.id);
    setCurrent(next);
    setServed((n) => n + 1);
    setAnswer('');
    setHintLevelsThisProblem([]);
    setLastHintLevel(null);
    setShowExplainOnCorrect(false);
    setPhase('problem');
  };

  if (phase === 'done') {
    const answered = Math.max(1, served);
    const accuracy = correct / answered;
    return (
      <div className="relative">
        {newStickerIds.length > 0 && (
          <StickerCelebration stickerIds={newStickerIds} onDone={() => setNewStickerIds([])} />
        )}
        {accuracy >= 0.8 && <Confetti count={24} />}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="flex justify-center">
            <Mascot mood={accuracy >= 0.8 ? 'cheer' : 'happy'} size={120} />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-ink mt-2">
            Practice done!
          </h1>
          <p className="text-ink-muted mt-1">The questions adapted to your level as you went.</p>
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
            <Stat value={`${correct}/${answered}`} label="Correct" tone="green" />
            <Stat value={`${Math.round(accuracy * 100)}%`} label="Accuracy" tone="blue" />
            <Stat value={`${xpEarned}`} label="XP" tone="yellow" />
          </div>
          <div className="mt-8 flex flex-col gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => navigate('/report')}
              className="w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
            >
              See my progress report
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
            >
              Back to home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const hintMood: MascotMood | null =
    lastHintLevel === 'reveal'
      ? 'mentor'
      : lastHintLevel === 'guide'
        ? 'coach'
        : lastHintLevel === 'nudge'
          ? 'helpful'
          : null;

  if (!current) return null;

  return (
    <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar current={served - (phase === 'problem' ? 1 : 0)} total={PRACTICE_SIZE} />
          <div className="text-xs font-display font-bold text-accent mt-1">
            🧠 Adaptive practice · {current.domain} · Level {current.difficulty}
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-display font-extrabold text-accent bg-accent-soft border border-accent/35 rounded-full px-2.5 py-1 hover:bg-accent-soft transition-colors"
          >
            📖 Explain the concept
          </button>
        </div>
        <div className="shrink-0">
          <Mascot
            mood={
              phase === 'feedback-correct'
                ? 'cheer'
                : phase === 'feedback-wrong'
                  ? 'oops'
                  : hintMood ?? 'thinking'
            }
            size={48}
          />
        </div>
      </div>

      {current && (
        <ConceptHelp
          domain={current.domain}
          unit={current.unit}
          open={showHelp}
          onClose={() => setShowHelp(false)}
        />
      )}
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
                onReveal={(level) => {
                  setHintLevelsThisProblem((arr) => [...arr, level]);
                  setLastHintLevel(level);
                }}
                onExplain={() => setShowHelp(true)}
              />
              <button
                type="button"
                onClick={submit}
                disabled={!answer.trim()}
                className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-line-strong text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none transition-all"
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
                className="mt-4 bg-ok-soft border-2 border-ok/50 rounded-3xl p-5 text-center relative overflow-hidden"
              >
                <div className="text-5xl">🎉</div>
                <div className="font-display font-extrabold text-2xl text-ok mt-1">
                  {flashMessage.current}
                </div>
                <GeniusTipCard problemId={current.id} domain={current.domain} />
                {showExplainOnCorrect && (
                  <div className="text-left mt-3">
                    <Explanation steps={current.explanation} alternatives={current.alternativeExplanations} />
                  </div>
                )}
                {!showExplainOnCorrect && (
                  <button
                    type="button"
                    onClick={() => setShowExplainOnCorrect(true)}
                    className="mt-3 text-sm font-display font-bold text-ok underline underline-offset-2 hover:text-ok"
                  >
                    Explain step by step
                  </button>
                )}
                <button
                  type="button"
                  onClick={advance}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
                >
                  {served >= PRACTICE_SIZE ? 'Finish' : 'Continue'}
                </button>
              </motion.div>
            </div>
          )}

          {phase === 'feedback-wrong' && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 bg-bad-soft border-2 border-bad/50 rounded-3xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl shrink-0">🤔</div>
                <div className="flex-1">
                  <div className="font-display font-extrabold text-bad text-lg">
                    {flashMessage.current}
                  </div>
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
                className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
              >
                {served >= PRACTICE_SIZE ? 'Finish' : 'Got it'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 w-full text-sm font-display font-bold text-ink-muted hover:text-ink-muted py-2"
      >
        Quit practice
      </button>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: 'green' | 'blue' | 'yellow';
}) {
  const styles = {
    green: 'bg-ok-soft border-ok/40 text-ok',
    blue: 'bg-accent-soft border-accent/35 text-accent',
    yellow: 'bg-warn-soft border-warn/40 text-warn',
  }[tone];
  return (
    <div className={`border-2 rounded-2xl p-3 ${styles}`}>
      <div className="text-2xl font-display font-extrabold tabular-nums">{value}</div>
      <div className="text-xs font-display font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}
