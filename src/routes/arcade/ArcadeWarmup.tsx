import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Problem } from '../../types/problem';
import { getAllProblems } from '../../data/problems';
import { isEquivalent } from '../../data/normalize';
import { ProblemCard } from '../../components/ProblemCard';
import { AnswerInput } from '../../components/AnswerInput';
import { Explanation } from '../../components/Explanation';
import { LessonCard } from '../../components/LessonCard';
import { LESSONS, type Lesson } from '../../data/lessons';
import { useProgress, type ArcadeConfig } from '../../state/progress';
import { useLessonClock } from '../../hooks/useLessonClock';
import { ArcadeHeader, ArcadeSessionContext, ARCADE_GAMES } from './shared';
import { MidGameChallenge } from './MidGameChallenge';
import { HeroSplash, Countdown } from './HeroSplash';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// The arcade "learn-to-play" gate. A full lesson + a hard difficulty-3 check
// must be completed to start a game (and to play again). One lesson unlocks one
// game session; the admin can require more than one via `lessonsPerSession`.
// Lessons are always hard, never easy. Lesson time is tracked toward the
// cumulative lesson:game balance, and (via `earnRatio`) earns game time.
// While unlocked, a mid-game math challenge can interrupt play at an interval.

function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function sampleN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function pickHardLesson(startLevel: number): Lesson {
  const usable = LESSONS.filter((l) => l.examples.length > 0 && l.practice.length > 0);
  const hard = usable.filter((l) => l.unit >= startLevel);
  return pick(hard.length ? hard : usable.length ? usable : LESSONS);
}

export function ArcadeGate({ title, children }: { title: string; children: ReactNode }) {
  const config = useProgress((s) => s.arcadeConfig);
  const cumArcade = useProgress((s) => s.cumArcadeSeconds);
  const cumLesson = useProgress((s) => s.cumLessonSeconds);
  const [unlocked, setUnlocked] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [lessonsDone, setLessonsDone] = useState(0);
  const [challengeActive, setChallengeActive] = useState(false);
  const [showSplash, setShowSplash] = useState(config.unlimited);
  const [counting, setCounting] = useState(config.unlimited);
  const playSecRef = useRef(0);

  // Count lesson time toward the balance only while the gate is showing.
  useLessonClock(unlocked);

  const need = Math.max(1, config.lessonsPerSession);
  const game = ARCADE_GAMES.find((g) => g.name === title);

  // Time budget: you can't play more game time than your lessons have earned.
  const overBudget = config.earnRatio > 0 && cumArcade >= cumLesson * config.earnRatio;
  useEffect(() => {
    if (unlocked && !config.unlimited && overBudget) {
      setUnlocked(false);
      setLessonsDone(0);
      setChallengeActive(false);
    }
  }, [unlocked, overBudget, config.unlimited]);

  // Mid-game challenge timer — counts active play seconds while a game is up.
  useEffect(() => {
    if (!unlocked || challengeActive || config.challengeInterval <= 0) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      playSecRef.current += 1;
      if (playSecRef.current >= config.challengeInterval) {
        playSecRef.current = 0;
        setChallengeActive(true);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [unlocked, challengeActive, config.challengeInterval]);

  const enterPlay = () => {
    setLessonsDone(0);
    setSessionKey((k) => k + 1);
    playSecRef.current = 0;
    setChallengeActive(false);
    setShowSplash(true);
    setCounting(true);
    setUnlocked(true);
  };

  const onLessonComplete = () => {
    const n = lessonsDone + 1;
    if (n >= need) enterPlay();
    else setLessonsDone(n);
  };

  const requestReplay = () => {
    if (config.unlimited) {
      setSessionKey((k) => k + 1); // unlimited: just restart, no lesson
      playSecRef.current = 0;
      setChallengeActive(false);
      setShowSplash(true);
      setCounting(true);
      return;
    }
    setUnlocked(false);
    setLessonsDone(0);
    setChallengeActive(false);
  };

  const playArea = (
    <ArcadeSessionContext.Provider value={{ requestReplay, paused: challengeActive || counting }}>
      <div key={sessionKey}>{children}</div>
      {challengeActive && config.challengeInterval > 0 && (
        <MidGameChallenge
          count={config.challengeCount}
          level={config.challengeLevel}
          onDone={() => {
            setChallengeActive(false);
            playSecRef.current = 0;
          }}
        />
      )}
      {showSplash && game ? (
        <HeroSplash
          emoji={game.emoji}
          name={game.name}
          subtitle="Let's play!"
          gradient={game.gradient}
          duration={900}
          onDone={() => setShowSplash(false)}
        />
      ) : (
        counting && <Countdown onDone={() => setCounting(false)} />
      )}
    </ArcadeSessionContext.Provider>
  );

  if (config.unlimited || unlocked) return playArea;

  return (
    <LessonGate
      key={`${sessionKey}-${lessonsDone}`}
      title={title}
      emoji={game?.emoji ?? '🎯'}
      config={config}
      index={lessonsDone}
      total={need}
      onComplete={onLessonComplete}
    />
  );
}

function LessonGate({
  title,
  emoji,
  config,
  index,
  total,
  onComplete,
}: {
  title: string;
  emoji: string;
  config: ArcadeConfig;
  index: number;
  total: number;
  onComplete: () => void;
}) {
  const [lesson] = useState(() => pickHardLesson(config.startLevel));
  const [phase, setPhase] = useState<'teach' | 'check' | 'wait'>('teach');
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [splash, setSplash] = useState(index === 0);
  const [gateSecs, setGateSecs] = useState(0);

  const count = Math.max(1, config.checkProblems);
  const floor = Math.max(0, config.minLessonSeconds);

  // Track time spent in this lesson visit (for the min-lesson-time floor).
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setGateSecs((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== 'check' || problems) return;
    let alive = true;
    getAllProblems()
      .then((all) => {
        if (!alive) return;
        const hard = all.filter((p) => p.difficulty === 3);
        const dom = hard.filter((p) => p.domain === lesson.domain);
        const base = dom.length >= count ? dom : hard.length ? hard : all;
        setProblems(sampleN(base, count));
      })
      .catch(() => alive && setProblems([]));
    return () => {
      alive = false;
    };
  }, [phase, problems, lesson.domain, count]);

  // When the hard check passes, only unlock once the lesson-time floor is met.
  const onPassed = () => {
    if (gateSecs >= floor) onComplete();
    else setPhase('wait');
  };

  useEffect(() => {
    if (phase === 'wait' && gateSecs >= floor) onComplete();
  }, [phase, gateSecs, floor, onComplete]);

  if (splash) {
    return (
      <HeroSplash
        emoji="📚"
        name="Warm-up!"
        subtitle={title}
        gradient="from-indigo-500 to-violet-600"
        onDone={() => setSplash(false)}
      />
    );
  }

  if (phase === 'teach') {
    // The full lesson (concept + worked examples + practice). It walks every
    // page each time; on finish we move to the hard check.
    return <LessonCard lesson={lesson} onClose={() => setPhase('check')} onStart={() => setPhase('check')} />;
  }

  if (phase === 'wait') {
    const left = Math.max(0, floor - gateSecs);
    return (
      <div>
        <ArcadeHeader title={title} emoji={emoji} />
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-5xl">⏳</div>
          <h2 className="mt-3 text-xl font-display font-extrabold text-slate-900">
            Keep learning!
          </h2>
          <p className="mt-2 text-slate-600 font-display font-bold">
            A little more practice time before you play — {left}s to go.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title={title} emoji={emoji} />
      <HardCheck
        problems={problems}
        lessonLabel={total > 1 ? `Lesson ${index + 1} of ${total} · ` : ''}
        onPassed={onPassed}
      />
    </div>
  );
}

function HardCheck({
  problems,
  lessonLabel,
  onPassed,
}: {
  problems: Problem[] | null;
  lessonLabel: string;
  onPassed: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const addAchievement = useProgress((s) => s.addAchievement);

  if (!problems) {
    return <p className="text-center text-slate-500 font-display font-bold py-12">Loading check…</p>;
  }
  if (!problems.length) {
    // No hard problems available — don't trap the player.
    onPassed();
    return null;
  }

  const current = problems[idx];
  const isLast = idx >= problems.length - 1;

  const submit = () => {
    if (submitted && correct) return;
    const ok = isEquivalent(answer, current);
    setCorrect(ok);
    setSubmitted(true);
    if (ok) {
      addAchievement(15);
      sfx.levelUp();
      haptic(HAPTIC.levelUp);
    } else {
      setShowHelp(true);
      sfx.hurt();
      haptic(HAPTIC.hit);
    }
  };

  const next = () => {
    if (isLast) {
      onPassed();
      return;
    }
    setIdx((i) => i + 1);
    setAnswer('');
    setSubmitted(false);
    setCorrect(false);
    setShowHelp(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-display font-extrabold text-slate-700">
          {lessonLabel}Check {idx + 1} of {problems.length}
        </span>
        <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-rose-500">
          Hard · get it right to play
        </span>
      </div>

      <ProblemCard problem={current} />

      <AnswerInput
        problem={current}
        value={answer}
        onChange={setAnswer}
        disabled={submitted && correct}
        onSubmit={submit}
      />

      {submitted && (
        <div
          className={`mt-4 rounded-2xl px-4 py-3 font-display font-bold ${
            correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}
        >
          {correct ? 'Correct! 🎉' : 'Not quite — check the steps, then try again.'}
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowHelp((s) => !s)}
        className="mt-4 text-sm font-display font-bold text-blue-700 hover:text-blue-800"
      >
        {showHelp ? '− Hide explanation' : '💡 Show explanation'}
      </button>
      {showHelp && (
        <div className="mt-2">
          <Explanation steps={current.explanation} alternatives={current.alternativeExplanations} />
        </div>
      )}

      <div className="mt-5">
        {correct ? (
          <button
            type="button"
            onClick={next}
            className="w-full min-h-14 rounded-2xl bg-emerald-500 px-6 font-display font-extrabold text-white shadow"
          >
            {isLast ? 'Start game →' : 'Next →'}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!answer.trim()}
            className="w-full min-h-14 rounded-2xl bg-slate-900 px-6 font-display font-extrabold text-white shadow disabled:bg-slate-300"
          >
            {submitted ? 'Try again' : 'Check'}
          </button>
        )}
      </div>
    </div>
  );
}
