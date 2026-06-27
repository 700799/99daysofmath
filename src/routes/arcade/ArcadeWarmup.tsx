import { useEffect, useState, type ReactNode } from 'react';
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
import { ArcadeHeader, ArcadeSessionContext } from './shared';

// The arcade "learn-to-play" gate. A full lesson + a hard difficulty-3 check
// must be completed to start a game (and to play again). One lesson unlocks one
// game session; the admin can require more than one via `lessonsPerSession`.
// Lessons are always hard, never easy. Lesson time is tracked toward the
// cumulative lesson:game balance.

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
  const [unlocked, setUnlocked] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const [lessonsDone, setLessonsDone] = useState(0);

  // Count lesson time toward the balance only while the gate is showing.
  useLessonClock(unlocked);

  const need = Math.max(1, config.lessonsPerSession);

  const onLessonComplete = () => {
    const n = lessonsDone + 1;
    if (n >= need) {
      setLessonsDone(0);
      setSessionKey((k) => k + 1);
      setUnlocked(true);
    } else {
      setLessonsDone(n);
    }
  };

  const requestReplay = () => {
    setUnlocked(false);
    setLessonsDone(0);
  };

  if (unlocked) {
    return (
      <ArcadeSessionContext.Provider value={{ requestReplay }}>
        <div key={sessionKey}>{children}</div>
      </ArcadeSessionContext.Provider>
    );
  }

  return (
    <LessonGate
      key={`${sessionKey}-${lessonsDone}`}
      title={title}
      config={config}
      index={lessonsDone}
      total={need}
      onComplete={onLessonComplete}
    />
  );
}

function LessonGate({
  title,
  config,
  index,
  total,
  onComplete,
}: {
  title: string;
  config: ArcadeConfig;
  index: number;
  total: number;
  onComplete: () => void;
}) {
  const [lesson] = useState(() => pickHardLesson(config.startLevel));
  const [phase, setPhase] = useState<'teach' | 'check'>('teach');
  const [problems, setProblems] = useState<Problem[] | null>(null);

  const count = Math.max(1, config.checkProblems);

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

  if (phase === 'teach') {
    // The full lesson (concept + worked examples + practice). It walks every
    // page each time; on finish we move to the hard check.
    return <LessonCard lesson={lesson} onClose={() => setPhase('check')} onStart={() => setPhase('check')} />;
  }

  return (
    <div>
      <ArcadeHeader title={title} emoji="🎯" />
      <HardCheck
        problems={problems}
        lessonLabel={total > 1 ? `Lesson ${index + 1} of ${total} · ` : ''}
        onPassed={onComplete}
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
    if (!ok) setShowHelp(true);
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
