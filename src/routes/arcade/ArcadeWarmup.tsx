import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Problem } from '../../types/problem';
import { getAllProblems } from '../../data/problems';
import { isEquivalent } from '../../data/normalize';
import { ProblemCard } from '../../components/ProblemCard';
import { AnswerInput } from '../../components/AnswerInput';
import { Explanation } from '../../components/Explanation';
import { ArcadeHeader } from './shared';

// A short, adaptive warm-up shown before each arcade game. The player answers
// three curriculum questions — the first is hard (difficulty 3); if they miss
// it, the remaining two drop to difficulty 2 ("slightly easier"). Step-by-step
// explanations are available at any time as help. Answers never block the game:
// after three questions the wrapped game renders. Shows once per route entry.

const WARMUP_COUNT = 3;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickProblem(all: Problem[], difficulty: 1 | 2 | 3, seen: Set<string>): Problem | null {
  const tier = all.filter((p) => p.difficulty === difficulty && !seen.has(p.id));
  const pool = tier.length ? tier : all.filter((p) => !seen.has(p.id));
  return pool.length ? pickRandom(pool) : null;
}

export function ArcadeGate({ title, children }: { title: string; children: ReactNode }) {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [questions, setQuestions] = useState<Problem[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [done, setDone] = useState(false);

  const seenRef = useRef<Set<string>>(new Set());
  const firstCorrectRef = useRef<boolean | null>(null);

  // Load the problem bank once.
  useEffect(() => {
    let alive = true;
    getAllProblems()
      .then((all) => alive && setProblems(all))
      .catch(() => alive && setLoadFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  // Seed the first (hard) question once problems are available.
  useEffect(() => {
    if (!problems || questions.length) return;
    const first = pickProblem(problems, 3, seenRef.current);
    if (!first) {
      setDone(true);
      return;
    }
    seenRef.current.add(first.id);
    setQuestions([first]);
  }, [problems, questions.length]);

  // Don't let a data hiccup lock kids out of the game.
  if (loadFailed || done) return <>{children}</>;

  const current = questions[index];

  if (!problems || !current) {
    return (
      <div>
        <ArcadeHeader title={title} emoji="🎯" />
        <p className="text-center text-slate-500 font-display font-bold py-12">Loading warm-up…</p>
      </div>
    );
  }

  const submit = () => {
    if (submitted) return;
    const ok = isEquivalent(answer, current);
    setCorrect(ok);
    setSubmitted(true);
    if (index === 0) firstCorrectRef.current = ok;
    if (!ok) setShowHelp(true); // reveal the worked solution on a miss
  };

  const next = () => {
    if (index >= WARMUP_COUNT - 1) {
      setDone(true);
      return;
    }
    const difficulty: 1 | 2 | 3 = firstCorrectRef.current === false ? 2 : 3;
    const q = pickProblem(problems, difficulty, seenRef.current);
    if (!q) {
      setDone(true);
      return;
    }
    seenRef.current.add(q.id);
    setQuestions((qs) => [...qs, q]);
    setIndex((i) => i + 1);
    setAnswer('');
    setSubmitted(false);
    setCorrect(false);
    setShowHelp(false);
  };

  const isLast = index >= WARMUP_COUNT - 1;

  return (
    <div>
      <ArcadeHeader title={title} emoji="🎯" />
      <div className="max-w-xl mx-auto">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-display font-extrabold text-slate-700">
            Warm-up · Question {index + 1} of {WARMUP_COUNT}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: WARMUP_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full ${
                  i < index ? 'bg-emerald-500' : i === index ? 'bg-slate-400' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <ProblemCard problem={current} />

        <AnswerInput
          problem={current}
          value={answer}
          onChange={setAnswer}
          disabled={submitted}
          onSubmit={submit}
        />

        {submitted && (
          <div
            className={`mt-4 rounded-2xl px-4 py-3 font-display font-bold ${
              correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            {correct ? (
              'Correct! 🎉'
            ) : (
              <>
                Not quite — the answer is <strong>{current.primaryAnswer}</strong>.
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowHelp((s) => !s)}
          className="mt-4 text-sm font-display font-bold text-blue-700 hover:text-blue-800"
        >
          {showHelp ? '− Hide explanation' : '💡 Show explanation for help'}
        </button>
        {showHelp && (
          <div className="mt-2">
            <Explanation steps={current.explanation} alternatives={current.alternativeExplanations} />
          </div>
        )}

        <div className="mt-5">
          {!submitted ? (
            <button
              type="button"
              onClick={submit}
              disabled={!answer.trim()}
              className="w-full min-h-14 rounded-2xl bg-slate-900 px-6 font-display font-extrabold text-white shadow disabled:bg-slate-300"
            >
              Check
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="w-full min-h-14 rounded-2xl bg-emerald-500 px-6 font-display font-extrabold text-white shadow"
            >
              {isLast ? 'Start game →' : 'Next question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
