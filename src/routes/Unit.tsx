import { useState, useMemo, useRef } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAINS, DOMAIN_LABELS, type Domain, type HintLevel, type HintStep } from '../types/problem';
import { useSeo, courseJsonLd, breadcrumbJsonLd, SITE_URL } from '../lib/seo';
import { useUnitProblems } from '../hooks/useProblems';
import { useProgress } from '../state/progress';
import { useMathClock } from '../hooks/useMathClock';
import { isEquivalent } from '../data/normalize';
import { ProblemCard } from '../components/ProblemCard';
import { AnswerInput } from '../components/AnswerInput';
import { Hint } from '../components/Hint';
import { Explanation } from '../components/Explanation';
import { ProgressBar } from '../components/ProgressBar';
import { Mascot, type MascotMood } from '../components/Mascot';
import { Confetti } from '../components/Celebration';
import { LessonCard } from '../components/LessonCard';
import { ConceptHelp } from '../components/ConceptHelp';
import { GeniusTipCard } from '../components/GeniusTip';
import { getLesson, lessonKey } from '../data/lessons';
import { correctMessage, wrongMessage, stickerForUnit } from '../utils/encouragement';
import { playCorrect, playWrong, playUnitComplete } from '../utils/sound';
import { computeStars, computeXPGain } from '../utils/hintEconomics';

function tiersFor(problem: { hint: string; hints?: HintStep[] }): HintStep[] {
  if (problem.hints && problem.hints.length > 0) return problem.hints;
  return [{ level: 'guide', text: problem.hint }];
}

type Phase = 'problem' | 'feedback-correct' | 'feedback-wrong';

export function Unit() {
  useMathClock();
  const { domain, unit } = useParams<{ domain: string; unit: string }>();
  const navigate = useNavigate();
  const record = useProgress((s) => s.recordUnitResult);
  const incStreak = useProgress((s) => s.incrementStreak);
  const resetStreak = useProgress((s) => s.resetStreak);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const touchDay = useProgress((s) => s.touchDay);
  const soundOn = useProgress((s) => s.soundEnabled);
  const currentStreak = useProgress((s) => s.streak);

  if (!domain || !DOMAINS.includes(domain as Domain) || !unit) {
    return <Navigate to="/" replace />;
  }
  const d = domain as Domain;
  const u = parseInt(unit, 10);

  const seoLesson = getLesson(d, u);
  const courseName: Partial<Record<Domain, string>> = { A1: 'Algebra 1', PC: 'Precalculus' };
  const seoCourse = courseName[d] ?? `${d.startsWith('5.') ? '5th' : '6th'} Grade Math`;
  const seoCourseProse = courseName[d] ?? `${d.startsWith('5.') ? '5th' : '6th'}-grade math`;
  useSeo({
    title: seoLesson
      ? `${seoLesson.title} — ${seoCourse}${courseName[d] ? '' : ` (${DOMAIN_LABELS[d]})`} | Math10x`
      : `${DOMAIN_LABELS[d]} lesson | Math10x`,
    description: seoLesson
      ? `${seoLesson.objective ?? seoLesson.title}. A free ${seoCourseProse} lesson with ${courseName[d] ? 'clear worked examples' : 'an animated video, worked examples,'} and practice on Math10x.`
      : `A free ${seoCourseProse} lesson on Math10x.`,
    canonicalPath: `/unit/${d}/${u}`,
    jsonLd: seoLesson
      ? [
          courseJsonLd(
            `${seoLesson.title} — ${seoCourse}`,
            seoLesson.objective ?? seoLesson.title,
            `${SITE_URL}/unit/${d}/${u}`,
          ),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: DOMAIN_LABELS[d], path: `/trail/${d}` },
            { name: seoLesson.title, path: `/unit/${d}/${u}` },
          ]),
        ]
      : undefined,
  });

  const { data: problems, loading, error } = useUnitProblems(d, u);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [hintLevelsThisProblem, setHintLevelsThisProblem] = useState<HintLevel[]>([]);
  const [tierTotals, setTierTotals] = useState({ nudge: 0, guide: 0, reveal: 0 });
  const [mistakesThisProblem, setMistakesThisProblem] = useState(0);
  const [mistakesTotal, setMistakesTotal] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [phase, setPhase] = useState<Phase>('problem');
  const [lastHintLevel, setLastHintLevel] = useState<HintLevel | null>(null);
  const [showExplainOnCorrect, setShowExplainOnCorrect] = useState(false);
  const flashMessage = useRef<string>('');

  const lesson = getLesson(d, u);
  const [showHelp, setShowHelp] = useState(false);
  const [showLesson, setShowLesson] = useState<boolean>(
    () => !!lesson && !useProgress.getState().lessonsViewed.includes(lessonKey(d, u)),
  );

  const current = problems?.[index];
  const total = problems?.length ?? 0;

  const finalStars = useMemo(
    () => computeStars(tierTotals, mistakesTotal, total),
    [tierTotals, mistakesTotal, total],
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 text-ink-muted font-display font-bold">Loading…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-bad-soft border-2 border-bad/40 rounded-2xl p-4 text-bad">
        {error.message}
      </div>
    );
  }
  if (!problems || problems.length === 0) {
    return (
      <div className="bg-warn-soft border-2 border-warn/40 rounded-2xl p-6 text-center text-warn">
        This unit has no problems yet.
      </div>
    );
  }

  const submit = () => {
    if (!current || !answer.trim()) return;
    const correct = isEquivalent(answer, current);
    recordAttempt(current.id, correct);
    if (correct) {
      const earn = computeXPGain(hintLevelsThisProblem, mistakesThisProblem);
      setXpEarned((x) => x + earn);
      incStreak();
      flashMessage.current = correctMessage(currentStreak + 1);
      setPhase('feedback-correct');
      if (soundOn) playCorrect();
    } else {
      setMistakesTotal((m) => m + 1);
      setMistakesThisProblem((m) => m + 1);
      resetStreak();
      setMissedIds((ids) =>
        ids.includes(current.id) ? ids : [...ids, current.id],
      );
      flashMessage.current = wrongMessage();
      setPhase('feedback-wrong');
      if (soundOn) playWrong();
    }
  };

  const advance = () => {
    if (!problems) return;
    if (index + 1 >= problems.length) {
      const outcome = record(d, u, finalStars, missedIds, xpEarned, mistakesTotal, total);
      const dailyStickers = touchDay();
      if (soundOn) playUnitComplete();
      const allNew = [...outcome.earned, ...dailyStickers];
      const primarySticker = finalStars === 3 ? stickerForUnit(d, u) : null;
      navigate(`/unit/${d}/${u}/results`, {
        state: {
          stars: finalStars,
          missedCount: missedIds.length,
          total,
          xpEarned,
          unitBonus: outcome.unitBonus,
          trailBonus: outcome.trailBonus,
          allTrailsBonus: outcome.allTrailsBonus,
          sticker: primarySticker ? `${primarySticker.emoji} ${primarySticker.label}` : '',
          newStickerIds: allNew,
        },
        replace: true,
      });
    } else {
      setIndex((i) => i + 1);
      setAnswer('');
      setHintLevelsThisProblem([]);
      setLastHintLevel(null);
      setMistakesThisProblem(0);
      setShowExplainOnCorrect(false);
      setPhase('problem');
    }
  };

  const hintMood: MascotMood | null =
    lastHintLevel === 'reveal'
      ? 'mentor'
      : lastHintLevel === 'guide'
        ? 'coach'
        : lastHintLevel === 'nudge'
          ? 'helpful'
          : null;

  return (
    <div className="relative">
      {lesson && showLesson && (
        <LessonCard
          lesson={lesson}
          onClose={() => setShowLesson(false)}
          onStart={() => setShowLesson(false)}
        />
      )}
      <ConceptHelp
        domain={d}
        unit={u}
        open={showHelp}
        onClose={() => setShowHelp(false)}
        onOpenLesson={() => {
          setShowHelp(false);
          setShowLesson(true);
        }}
      />
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar
            current={index + (phase !== 'problem' ? 1 : 0)}
            total={total}
          />
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

      <div className="mb-3 flex flex-wrap gap-2">
        {lesson && (
          <button
            type="button"
            onClick={() => setShowLesson(true)}
            className="inline-flex items-center gap-1.5 text-xs font-display font-extrabold text-accent bg-accent-soft border border-accent/35 rounded-full px-3 py-1.5 hover:bg-accent-soft transition-colors"
          >
            📘 Review the lesson
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="inline-flex items-center gap-1.5 text-xs font-display font-extrabold text-accent bg-accent-soft border border-accent/35 rounded-full px-3 py-1.5 hover:bg-accent-soft transition-colors"
        >
          📖 Explain the concept
        </button>
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
              disabled={phase !== 'problem'}
              onSubmit={submit}
            />

            {phase === 'problem' && (
              <>
                <Hint
                  tiers={tiersFor(current)}
                  onReveal={(level) => {
                    setHintLevelsThisProblem((arr) => [...arr, level]);
                    setTierTotals((t) => ({ ...t, [level]: t[level] + 1 }));
                    setLastHintLevel(level);
                  }}
                  onExplain={() => setShowHelp(true)}
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={!answer.trim()}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark disabled:bg-line-strong text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:cursor-not-allowed disabled:shadow-none disabled:active:translate-y-0 transition-all"
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
                  className="mt-4 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-ok/50 rounded-3xl p-5 text-center relative overflow-hidden"
                >
                  <div className="text-5xl">🎉</div>
                  <div className="font-display font-extrabold text-2xl text-ok mt-1">
                    {flashMessage.current}
                  </div>
                  <GeniusTipCard problemId={current.id} domain={current.domain} />
                  {currentStreak >= 2 && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-warn-soft px-3 py-1 rounded-full">
                      <span>🔥</span>
                      <span className="font-display font-extrabold text-warn text-sm">
                        {currentStreak} in a row!
                      </span>
                    </div>
                  )}
                  {showExplainOnCorrect && (
                    <div className="text-left mt-3">
                      <Explanation
                        steps={current.explanation}
                        alternatives={current.alternativeExplanations}
                      />
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
                    className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
                  >
                    Continue
                  </button>
                </motion.div>
              </div>
            )}

            {phase === 'feedback-wrong' && (
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-bad/50 rounded-3xl p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl shrink-0">🤔</div>
                  <div className="flex-1">
                    <div className="font-display font-extrabold text-bad text-lg">
                      {flashMessage.current}
                    </div>
                    <div className="mt-1 text-ink">
                      <span className="font-display font-bold">Correct answer:</span>{' '}
                      <span className="font-mono font-extrabold">
                        {current.primaryAnswer}
                      </span>
                    </div>
                  </div>
                </div>
                <Explanation
                  steps={current.explanation}
                  alternatives={current.alternativeExplanations}
                />
                <button
                  type="button"
                  onClick={advance}
                  className="mt-4 w-full min-h-14 px-6 py-3 rounded-2xl bg-duo-blue hover:bg-blue-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
                >
                  Got it
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <button
        type="button"
        onClick={() => navigate(`/trail/${d}`)}
        className="mt-6 w-full text-sm font-display font-bold text-ink-muted hover:text-ink-muted py-2"
      >
        Quit to trail
      </button>
    </div>
  );
}
