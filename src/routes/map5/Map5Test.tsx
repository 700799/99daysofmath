import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MAP5_STRANDS,
  MAP5_TEST_SIZE,
  MAP5_ABOVE_GRADE_TARGET,
  estimateMap5Rit,
  map5Band,
  strandOf,
  isAboveGrade,
  map5Domains,
} from '../../data/map5';
import { getAllProblems } from '../../data/problems';
import { pickAdaptiveProblem, nextTarget } from '../../utils/adaptive';
import { isEquivalent } from '../../data/normalize';
import { useProgress } from '../../state/progress';
import { useMathClock } from '../../hooks/useMathClock';
import { ProblemCard } from '../../components/ProblemCard';
import { AnswerInput } from '../../components/AnswerInput';
import { Explanation } from '../../components/Explanation';
import { ProgressBar } from '../../components/ProgressBar';
import { Mascot } from '../../components/Mascot';
import { Confetti } from '../../components/Celebration';
import { MathText } from '../../components/MathText';
import { playCorrect, playWrong, playUnitComplete } from '../../utils/sound';
import { useSeo } from '../../lib/seo';
import type { Problem } from '../../types/problem';

// ── /map5/test — an adaptive 5th-grade MAP practice test ───────────────────
// Adaptive like the real thing: the next question is chosen by how the last
// one went, so the difficulty finds the student's level. Untimed, no going
// back, and no feedback until the end — all three match MAP Growth. The
// teaching lands on the review screen.

type Phase = 'loading' | 'intro' | 'question' | 'done';

interface Answered {
  problem: Problem;
  given: string;
  correct: boolean;
}

export function Map5Test() {
  useMathClock();
  const navigate = useNavigate();
  const recordMap5Test = useProgress((s) => s.recordMap5Test);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const touchDay = useProgress((s) => s.touchDay);
  const soundOn = useProgress((s) => s.soundEnabled);

  useSeo({
    title: '5th Grade MAP Math Practice Test — Free and Adaptive | Math10x',
    description:
      'A free adaptive practice test for 5th-grade NWEA MAP Growth math, with a breakdown by instructional area and worked explanations for every question.',
    canonicalPath: '/map5/test',
  });

  const poolRef = useRef<Problem[]>([]);
  const seenRef = useRef<Set<string>>(new Set());
  const targetRef = useRef(2);

  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [current, setCurrent] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'wrong' | 'all'>('wrong');
  const recordedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Both grades: the adaptive test reaches above grade level, so the
        // 6th-grade Common Core strands are part of the bank.
        const domains = map5Domains();
        const all = (await getAllProblems()).filter((p) => domains.includes(p.domain));
        if (cancelled) return;
        poolRef.current = all;
        setPhase('intro');
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
      <div className="rounded-2xl border-2 border-bad/40 bg-bad-soft p-4 text-bad">
        Couldn't load the practice test: {error.message}
      </div>
    );
  }

  const serveNext = (fromAnswered: Answered[]) => {
    const stats = useProgress.getState().problemStats;
    // Above-grade questions unlock only once the running target has climbed,
    // so the test reaches up the way the real one does rather than ambushing a
    // 5th grader with 6th-grade material on question two.
    const unlocked = targetRef.current >= MAP5_ABOVE_GRADE_TARGET;
    const pool = unlocked
      ? poolRef.current
      : poolRef.current.filter((p) => !isAboveGrade(p.domain, p.unit));
    const next = pickAdaptiveProblem(pool, seenRef.current, targetRef.current, stats);
    if (!next || fromAnswered.length >= MAP5_TEST_SIZE) {
      finish(fromAnswered);
      return;
    }
    seenRef.current.add(next.id);
    setCurrent(next);
    setAnswer('');
    setPhase('question');
  };

  const start = () => {
    seenRef.current = new Set();
    targetRef.current = 2;
    recordedRef.current = false;
    setAnswered([]);
    serveNext([]);
  };

  const finish = (all: Answered[]) => {
    const correct = all.filter((a) => a.correct).length;
    const avgDifficulty =
      all.length > 0 ? all.reduce((s, a) => s + a.problem.difficulty, 0) / all.length : 2;
    const aboveCorrect = all.filter((a) => a.correct && isAboveGrade(a.problem.domain, a.problem.unit)).length;
    const rit = estimateMap5Rit(
      all.length > 0 ? correct / all.length : 0,
      avgDifficulty,
      all.length > 0 ? aboveCorrect / all.length : 0,
    );

    const byStrand: Record<string, { correct: number; total: number }> = {};
    for (const a of all) {
      const st = strandOf(a.problem.domain, a.problem.unit);
      if (!st) continue;
      const row = byStrand[st.key] ?? { correct: 0, total: 0 };
      row.total += 1;
      if (a.correct) row.correct += 1;
      byStrand[st.key] = row;
    }

    if (!recordedRef.current && all.length > 0) {
      recordedRef.current = true;
      recordMap5Test({
        correct,
        total: all.length,
        rit,
        completedAt: new Date().toISOString(),
        byStrand,
      });
      touchDay();
    }
    if (soundOn) playUnitComplete();
    setPhase('done');
  };

  const submit = () => {
    if (!current || !answer.trim()) return;
    const ok = isEquivalent(answer, current);
    recordAttempt(current.id, ok);
    targetRef.current = nextTarget(targetRef.current, ok);
    if (soundOn) (ok ? playCorrect : playWrong)();
    const next = [...answered, { problem: current, given: answer, correct: ok }];
    setAnswered(next);
    serveNext(next);
  };

  // ── loading ──
  if (phase === 'loading') {
    return (
      <div className="py-12 text-center">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 font-display font-bold text-ink-muted">Getting your test ready…</div>
      </div>
    );
  }

  // ── intro ──
  if (phase === 'intro') {
    return (
      <div>
        <div className="rounded-3xl border-2 border-line bg-surface p-5">
          <h1 className="font-display text-2xl font-extrabold text-ink">
            5th Grade MAP practice test
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {MAP5_TEST_SIZE} questions drawn from all four instructional areas, chosen the way the
            real test does it — get one right and the next is harder, miss one and it eases off.
          </p>

          <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-4">
            <div className="font-display text-sm font-extrabold text-ink">Before you start</div>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-ink-muted">
              <li>· <b className="text-ink">There is no timer.</b> Take as long as you need — rushing is the most common way to lose points.</li>
              <li>· <b className="text-ink">You cannot go back.</b> Check your answer before you submit it.</li>
              <li>· Expect it to feel hard. The test keeps adjusting until the questions are a stretch — that means it is working.</li>
              <li>· <b className="text-ink">Do well and it reaches into 6th grade.</b> Those questions are not a mistake — getting them right is what the top of the 5th-grade range is made of.</li>
              <li>· Never leave one blank. There is no penalty for a wrong answer.</li>
              <li>· Keep scratch paper next to you.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={start}
            className="mt-4 w-full rounded-2xl bg-accent px-6 py-3.5 font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Start the test ▶
          </button>
        </div>
        <Link to="/map5" className="mt-6 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink">
          ← Back to MAP prep
        </Link>
      </div>
    );
  }

  // ── score report ──
  if (phase === 'done') {
    const correct = answered.filter((a) => a.correct).length;
    const total = Math.max(1, answered.length);
    const accuracy = correct / total;
    const avgDifficulty = answered.reduce((s, a) => s + a.problem.difficulty, 0) / total;
    const aboveCorrect = answered.filter((a) => a.correct && isAboveGrade(a.problem.domain, a.problem.unit)).length;
    const aboveSeen = answered.filter((a) => isAboveGrade(a.problem.domain, a.problem.unit)).length;
    const rit = estimateMap5Rit(accuracy, avgDifficulty, aboveCorrect / total);
    const band = map5Band(rit);
    const tone = {
      ok: 'bg-ok-soft border-ok/50 text-ok',
      accent: 'bg-accent-soft border-accent/45 text-accent',
      warn: 'bg-warn-soft border-warn/50 text-warn',
      bad: 'bg-bad-soft border-bad/50 text-bad',
    }[band.tone];

    const rows = MAP5_STRANDS.map((s) => {
      const inStrand = answered.filter((a) => strandOf(a.problem.domain, a.problem.unit)?.key === s.key);
      const got = inStrand.filter((a) => a.correct).length;
      return { s, got, total: inStrand.length, pct: inStrand.length ? got / inStrand.length : 0 };
    }).filter((r) => r.total > 0);
    const weakest = [...rows].sort((a, b) => a.pct - b.pct)[0];
    const shown = answered.filter((a) => (reviewFilter === 'all' ? true : !a.correct));

    return (
      <div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {accuracy >= 0.8 && <Confetti count={24} />}
          <div className={`rounded-3xl border-2 p-5 text-center ${tone}`}>
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-80">
              Estimated RIT
            </div>
            <div className="mt-1 font-mono text-5xl font-bold tabular-nums">{rit}</div>
            <div className="mt-1 font-display text-lg font-extrabold">{band.label}</div>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed opacity-90">{band.blurb}</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-line bg-surface p-3 text-center">
              <div className="font-mono text-xl font-bold tabular-nums text-ink">{correct}/{answered.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Correct</div>
            </div>
            <div className="rounded-2xl border-2 border-line bg-surface p-3 text-center">
              <div className="font-mono text-xl font-bold tabular-nums text-ink">{Math.round(accuracy * 100)}%</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Accuracy</div>
            </div>
            <div className="rounded-2xl border-2 border-line bg-surface p-3 text-center">
              <div className="font-mono text-xl font-bold tabular-nums text-ink">{aboveCorrect}/{aboveSeen}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">6th-grade</div>
            </div>
          </div>

          {aboveSeen > 0 && (
            <div className="mt-3 rounded-2xl border border-ok/40 bg-ok-soft p-3 text-[12.5px] leading-relaxed text-ink">
              <b className="text-ok">You reached above grade level.</b> {aboveSeen} of your questions
              came from 6th-grade Common Core, because you earned them — that reach is exactly what a
              high RIT measures on the real adaptive test.
            </div>
          )}

          {/* per-strand breakdown — the part that tells you what to do next */}
          <div className="mt-4 rounded-3xl border-2 border-line bg-surface p-5">
            <div className="font-display text-sm font-extrabold text-ink">By instructional area</div>
            <p className="mt-1 text-xs text-ink-muted">
              These are the four areas your real score report names. Work the lowest one first.
            </p>
            <div className="mt-3 space-y-2.5">
              {rows.map((r) => (
                <div key={r.s.key}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-[12.5px] font-bold text-ink">
                      {r.s.emoji} {r.s.name}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                      {r.got}/{r.total}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full transition-all" style={{ width: `${r.pct * 100}%`, background: r.s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {weakest && (
            <div className="mt-3 rounded-3xl border-2 border-accent/35 bg-accent-soft p-4">
              <div className="font-display text-[13px] font-extrabold text-accent">
                🩹 Start here: {weakest.s.name}
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink">
                Your weakest area on this test ({weakest.got}/{weakest.total}). It is about{' '}
                {Math.round(weakest.s.weight * 100)}% of the real test, so this is where the next
                points are cheapest.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {weakest.s.sources.filter((src) => !src.above).flatMap((src) => src.units).map((u: number) => (
                  <Link
                    key={u}
                    to={`/unit/5.F/${u}`}
                    className="rounded-lg border border-accent/40 bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-accent transition-colors hover:bg-accent hover:text-on-accent"
                  >
                    Unit {u}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* question review */}
          <div className="mt-5 flex items-center justify-between gap-2">
            <div className="font-display text-sm font-extrabold text-ink">Question review</div>
            <div className="flex gap-1 rounded-xl border border-line bg-surface p-1">
              {(['wrong', 'all'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setReviewFilter(f)}
                  aria-pressed={reviewFilter === f}
                  className={`rounded-lg px-3 py-1 font-display text-[11px] font-bold transition-colors ${
                    reviewFilter === f ? 'bg-accent text-on-accent' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {f === 'wrong' ? `Missed (${answered.length - correct})` : `All (${answered.length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 space-y-3">
            {shown.length === 0 && (
              <div className="rounded-3xl border-2 border-ok/40 bg-ok-soft p-5 text-center font-display font-bold text-ok">
                Nothing missed. That is a perfect run. 🎯
              </div>
            )}
            {shown.map((a) => {
              const st = strandOf(a.problem.domain, a.problem.unit);
              return (
                <div key={a.problem.id} className="rounded-3xl border-2 border-line bg-surface p-4">
                  <div className="flex items-center gap-2">
                    {st && (
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider"
                        style={{ background: `${st.color}22`, color: st.color }}
                      >
                        {st.short}
                      </span>
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-dim">
                      Unit {a.problem.unit} · {'●'.repeat(a.problem.difficulty)}
                    </span>
                    <span className={`ml-auto font-display text-[11px] font-bold ${a.correct ? 'text-ok' : 'text-bad'}`}>
                      {a.correct ? '✓ Correct' : '✕ Missed'}
                    </span>
                  </div>
                  <div className="mt-2 text-[14px] leading-relaxed text-ink">
                    <MathText text={a.problem.prompt} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
                    <span className="rounded-xl border border-ok/50 bg-ok-soft px-2.5 py-1 font-mono text-ink">
                      Answer: <b>{a.problem.primaryAnswer}</b>
                    </span>
                    <span className={`rounded-xl border px-2.5 py-1 font-mono text-ink ${a.correct ? 'border-line bg-surface-2' : 'border-bad/50 bg-bad-soft'}`}>
                      You: <b>{a.given.trim() || '—'}</b>
                    </span>
                  </div>
                  <Explanation steps={a.problem.explanation} alternatives={a.problem.alternativeExplanations} />
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/map5')}
              className="w-full rounded-2xl bg-accent px-6 py-3 font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
            >
              Back to MAP prep
            </button>
            <button
              type="button"
              onClick={start}
              className="w-full rounded-2xl border-2 border-line bg-surface px-6 py-3 font-display text-sm font-bold text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              Take another test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── the test itself ──
  if (!current) return null;
  return (
    <div>
      <div className="mb-3">
        <ProgressBar current={answered.length} total={MAP5_TEST_SIZE} />
        <div className="mt-1 flex items-center justify-between">
          <div className="text-xs font-display font-bold text-accent">
            🎓 MAP practice · Question {answered.length + 1} of {MAP5_TEST_SIZE}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-dim">No timer</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16, pointerEvents: 'none' }}
          transition={{ duration: 0.15 }}
        >
          <ProblemCard problem={current} />
          <AnswerInput
            problem={current}
            value={answer}
            onChange={setAnswer}
            disabled={false}
            onSubmit={submit}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!answer.trim()}
            className="mt-4 w-full min-h-14 rounded-2xl bg-accent px-6 py-3 font-display text-lg font-extrabold text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong"
          >
            Submit answer
          </button>
          <p className="mt-2 text-center text-[11px] text-ink-dim">
            You cannot come back to this one — check it first.
          </p>
        </motion.div>
      </AnimatePresence>

      <Link to="/map5" className="mt-6 block w-full py-2 text-center font-display text-sm font-bold text-ink-muted hover:text-ink">
        Quit the test
      </Link>
    </div>
  );
}
