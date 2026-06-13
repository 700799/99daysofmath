import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAINS, type Domain, type Problem, type HintStep } from '../types/problem';
import { useProgress } from '../state/progress';
import { useMathClock } from '../hooks/useMathClock';
import { isEquivalent } from '../data/normalize';
import { getProblemsByIds } from '../data/problems';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { Hint } from '../components/Hint';
import { ConceptHelp } from '../components/ConceptHelp';
import { Explanation } from '../components/Explanation';
import { ProgressBar } from '../components/ProgressBar';
import { Mascot } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import { StickerCelebration } from '../components/StickerCelebration';
import { playCorrect, playWrong } from '../utils/sound';

type Phase = 'loading' | 'problem' | 'feedback-correct' | 'feedback-wrong' | 'done';

function tiersFor(problem: { hint: string; hints?: HintStep[] }): HintStep[] {
  if (problem.hints && problem.hints.length > 0) return problem.hints;
  return [{ level: 'guide', text: problem.hint }];
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function daysUntil(iso: string): number {
  const a = new Date(todayISO() + 'T00:00:00Z').getTime();
  const b = new Date(iso + 'T00:00:00Z').getTime();
  return Math.round((b - a) / 86400000);
}

export function Review() {
  useMathClock();
  const navigate = useNavigate();
  const params = useParams<{ domain?: string }>();
  const filterDomain =
    params.domain && DOMAINS.includes(params.domain as Domain)
      ? (params.domain as Domain)
      : null;

  const recordAttempt = useProgress((s) => s.recordAttempt);
  const awardXP = useProgress((s) => s.awardXP);
  const touchDay = useProgress((s) => s.touchDay);
  const soundOn = useProgress((s) => s.soundEnabled);

  // Snapshot the due problem ids once on mount, most-overdue first, so the
  // queue stays stable as we reschedule each one.
  const [dueIds] = useState<string[]>(() => {
    const today = todayISO();
    const stats = useProgress.getState().problemStats;
    return Object.entries(stats)
      .filter(([, st]) => st.due != null && st.due <= today)
      .sort((a, b) => (a[1].due! < b[1].due! ? -1 : 1))
      .map(([id]) => id);
  });

  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [phase, setPhase] = useState<Phase>('loading');
  const [advanced, setAdvanced] = useState(0);
  const [rescheduleMsg, setRescheduleMsg] = useState('');
  const [showExplain, setShowExplain] = useState(false);
  const [reviewXp, setReviewXp] = useState(0);
  const [newStickerIds, setNewStickerIds] = useState<string[]>([]);
  const rewardedRef = useState({ done: false })[0];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await getProblemsByIds(dueIds);
        if (cancelled) return;
        const byId = new Map(loaded.map((p) => [p.id, p]));
        let ordered = dueIds
          .map((id) => byId.get(id))
          .filter((p): p is Problem => !!p);
        if (filterDomain) ordered = ordered.filter((p) => p.domain === filterDomain);
        setProblems(ordered);
        setPhase('problem');
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dueIds, filterDomain]);

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

  // Empty state — nothing scheduled for review right now.
  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <Mascot mood="happy" size={120} />
        <h1 className="text-2xl font-display font-extrabold text-slate-900 mt-3">
          All caught up!
        </h1>
        <p className="text-slate-600 mt-1">
          No reviews are due{filterDomain ? ` in ${filterDomain}` : ''} right now. Missed
          problems come back here on the best day to remember them.
        </p>
        <div className="mt-6 flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            to="/practice"
            className="w-full min-h-12 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
          >
            Adaptive practice
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
        {newStickerIds.length > 0 && (
          <StickerCelebration stickerIds={newStickerIds} onDone={() => setNewStickerIds([])} />
        )}
        <Confetti count={24} />
        <Mascot mood="cheer" size={120} />
        <h1 className="text-3xl font-display font-extrabold text-slate-900 mt-2">
          Review complete!
        </h1>
        <p className="text-slate-600 mt-2">
          You reviewed {problems.length}{' '}
          {problems.length === 1 ? 'problem' : 'problems'} —{' '}
          <span className="font-display font-extrabold text-green-700">{advanced}</span> moved
          forward.
        </p>
        {reviewXp > 0 && (
          <div className="mt-3 inline-flex items-center gap-1 bg-yellow-100 text-yellow-900 font-display font-extrabold text-sm px-3 py-1.5 rounded-full">
            ⚡ +{reviewXp} XP for reviewing
          </div>
        )}
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
  const total = problems.length;

  const submit = () => {
    if (!current || !answer.trim()) return;
    const correct = isEquivalent(answer, current);
    recordAttempt(current.id, correct);
    if (correct) {
      setAdvanced((n) => n + 1);
      const stat = useProgress.getState().problemStats[current.id];
      if (!stat || stat.due == null) {
        setRescheduleMsg('Mastered — graduated from review! 🎓');
      } else {
        const n = daysUntil(stat.due);
        setRescheduleMsg(n <= 1 ? 'Nice! Back tomorrow.' : `Nice! Back in ${n} days.`);
      }
      setPhase('feedback-correct');
      if (soundOn) playCorrect();
    } else {
      setRescheduleMsg('No worries — back tomorrow to try again.');
      setPhase('feedback-wrong');
      if (soundOn) playWrong();
    }
  };

  const advance = () => {
    if (index + 1 >= problems.length) {
      // Reviews now pay: +2 XP per problem moved forward, plus streak credit.
      if (!rewardedRef.done) {
        rewardedRef.done = true;
        const xp = advanced * 2;
        setReviewXp(xp);
        const earnedStickers = xp > 0 ? awardXP(xp) : [];
        const dayStickers = touchDay();
        setNewStickerIds([...earnedStickers, ...dayStickers]);
      }
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
      setAnswer('');
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
            🔁 Smart Review · {current.domain}
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-display font-extrabold text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-2.5 py-1 hover:bg-violet-100 transition-colors"
          >
            📖 Explain the concept
          </button>
        </div>
        <div className="shrink-0">
          <Mascot
            mood={phase === 'feedback-correct' ? 'cheer' : phase === 'feedback-wrong' ? 'oops' : 'thinking'}
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
              <Hint tiers={tiersFor(current)} onExplain={() => setShowHelp(true)} />
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
                  {rescheduleMsg}
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
                  <div className="text-xs text-slate-500 mt-1">{rescheduleMsg}</div>
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
