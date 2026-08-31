import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMockTest, allQuestions, MODULE_MINUTES, type SatTestQuestion } from '../../data/sat/tests';
import { SAT_AREA_INFO } from '../../data/sat/blueprint';
import { scaledScore, scoreBand, breakdownByArea, mmss } from '../../utils/satScore';
import { MathText } from '../../components/MathText';
import { DiagramRenderer } from '../../components/DiagramRenderer';
import { useProgress } from '../../state/progress';
import { useSeo } from '../../lib/seo';

// ── /sat/test/:n — the timed mock-test runner ──────────────────────────────
// Three phases: an intro that sets expectations, two independently timed
// 35-minute modules with free navigation inside each, and a score report.
// There are no hints and no per-question feedback — that is the point of a
// mock test. All the teaching lands on the review screen at the end.

type Phase = 'intro' | 'module' | 'review-module' | 'done';

/** Numeric answers accept fractions, decimals, and stray formatting. */
function numericMatches(input: string, q: SatTestQuestion): boolean {
  const clean = (s: string) => s.trim().toLowerCase().replace(/[$,%\s]/g, '');
  const u = clean(input);
  if (!u) return false;
  const candidates = [q.answer, ...(q.alternativeAnswers ?? [])];
  if (candidates.some((c) => clean(c) === u)) return true;

  const value = (s: string): number | null => {
    const t = clean(s);
    const frac = t.match(/^(-?\d+)\/(\d+)$/);
    if (frac) {
      const d = Number(frac[2]);
      return d === 0 ? null : Number(frac[1]) / d;
    }
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null;
    const n = Number(t);
    return Number.isNaN(n) ? null : n;
  };
  const uv = value(input);
  if (uv === null) return false;
  const tol = q.tolerance ?? 1e-9;
  return candidates.some((c) => {
    const cv = value(c);
    return cv !== null && Math.abs(cv - uv) <= tol;
  });
}

export function isCorrect(q: SatTestQuestion, given: string | undefined): boolean {
  if (!given) return false;
  if (q.answerType === 'multiple-choice') return given.trim().toUpperCase() === q.answer.toUpperCase();
  return numericMatches(given, q);
}

export function SatTest() {
  const { n } = useParams<{ n: string }>();
  const testN = Number(n);
  const test = getMockTest(testN);
  const navigate = useNavigate();
  const recordSatTest = useProgress((s) => s.recordSatTest);
  const priorResult = useProgress((s) => (s.satTests ?? {})[testN]);

  useSeo({
    title: test ? `${test.title} — SAT Math | Math10x` : 'SAT Math mock test | Math10x',
    description: test
      ? `${test.blurb} A free full-length Digital SAT Math practice test with worked explanations for every question.`
      : 'A free full-length Digital SAT Math practice test on Math10x.',
    canonicalPath: `/sat/test/${testN}`,
  });

  const [phase, setPhase] = useState<Phase>('intro');
  const [moduleIdx, setModuleIdx] = useState<0 | 1>(0);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [remaining, setRemaining] = useState(MODULE_MINUTES * 60);
  const [elapsed, setElapsed] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong'>('wrong');
  const recordedRef = useRef(false);

  const questions = useMemo(
    () => (test ? (moduleIdx === 0 ? test.module1 : test.module2) : []),
    [test, moduleIdx],
  );

  // One countdown per module. Running out auto-submits the module.
  useEffect(() => {
    if (phase !== 'module') return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setPhase('review-module');
          return 0;
        }
        return r - 1;
      });
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  if (!test || !Number.isFinite(testN)) return <Navigate to="/sat" replace />;

  const all = allQuestions(test);
  const current = questions[index];

  // Navigation is clamped: during the exit animation the outgoing question is
  // briefly still in the DOM, so a fast double-tap on Next would otherwise push
  // the index past the end of the module and take the whole test down mid-run.
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(questions.length - 1, i)));

  const setAnswer = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  const toggleFlag = (id: string) =>
    setFlagged((f) => {
      const next = new Set(f);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const startTest = () => {
    setAnswers({});
    setFlagged(new Set());
    setModuleIdx(0);
    setIndex(0);
    setRemaining(MODULE_MINUTES * 60);
    setElapsed(0);
    recordedRef.current = false;
    setPhase('module');
  };

  const finishModule = () => {
    if (moduleIdx === 0) {
      setModuleIdx(1);
      setIndex(0);
      setRemaining(MODULE_MINUTES * 60);
      setPhase('module');
      return;
    }
    // End of the section — score it.
    const correct = all.filter((q) => isCorrect(q, answers[q.id])).length;
    const scaled = scaledScore(correct, all.length);
    if (!recordedRef.current) {
      recordedRef.current = true;
      recordSatTest(testN, {
        correct,
        total: all.length,
        scaled,
        seconds: elapsed,
        completedAt: new Date().toISOString(),
        answers,
      });
    }
    setPhase('done');
  };

  // ── intro ──
  if (phase === 'intro') {
    return (
      <div>
        <div className="rounded-3xl border-2 border-line bg-surface p-5">
          <h1 className="font-display text-2xl font-extrabold text-ink">{test.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{test.blurb}</p>

          <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-4">
            <div className="font-display text-sm font-extrabold text-ink">Before you start</div>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-ink-muted">
              <li>· <b className="text-ink">Two modules of 22 questions, {MODULE_MINUTES} minutes each.</b> Each module is timed separately, and once you submit one you cannot return to it.</li>
              <li>· You can move freely between questions inside a module, and flag any you want to revisit.</li>
              <li>· There is no penalty for a wrong answer, so never leave a blank.</li>
              <li>· A graphing calculator is allowed on every question. Have Desmos open.</li>
              <li>· No hints and no feedback until the end — that is what makes this a mock test.</li>
            </ul>
          </div>

          {priorResult && (
            <div className="mt-3 rounded-2xl border border-line bg-surface-2 p-3">
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">Your last attempt</div>
              <div className="mt-0.5 font-mono text-lg font-bold tabular-nums text-ink">
                {priorResult.scaled} · {priorResult.correct}/{priorResult.total} correct
              </div>
              <div className="text-[11px] text-ink-muted">Starting again clears it and records a fresh score.</div>
            </div>
          )}

          <button
            type="button"
            onClick={startTest}
            className="mt-4 w-full rounded-2xl bg-accent px-6 py-3.5 font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Start Module 1 ▶
          </button>
        </div>
        <Link to="/sat" className="mt-6 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink">
          ← Back to SAT Math
        </Link>
      </div>
    );
  }

  // ── end-of-module review page ──
  if (phase === 'review-module') {
    const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;
    return (
      <div>
        <div className="rounded-3xl border-2 border-line bg-surface p-5">
          <h1 className="font-display text-xl font-extrabold text-ink">
            Module {moduleIdx + 1} review
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {answeredCount} of {questions.length} answered
            {remaining > 0 ? ` · ${mmss(remaining)} left` : ' · time expired'}.
            {' '}Tap any question to go back to it.
          </p>

          <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-11">
            {questions.map((q, i) => {
              const answered = !!answers[q.id]?.trim();
              const isFlagged = flagged.has(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    if (remaining <= 0) return;
                    goTo(i);
                    setPhase('module');
                  }}
                  disabled={remaining <= 0}
                  className={`relative grid h-10 place-items-center rounded-xl border-2 font-mono text-xs font-bold transition-colors disabled:cursor-not-allowed ${
                    answered
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-line bg-surface-2 text-ink-dim'
                  }`}
                >
                  {i + 1}
                  {isFlagged && <span className="absolute -right-1 -top-1 text-[10px]">🚩</span>}
                </button>
              );
            })}
          </div>

          {answeredCount < questions.length && (
            <div className="mt-3 rounded-2xl border border-warn/40 bg-warn-soft p-3 text-[13px] text-warn">
              You have {questions.length - answeredCount} unanswered.
              A blank scores the same as a wrong answer, so guess on every one before you submit.
            </div>
          )}

          <button
            type="button"
            onClick={finishModule}
            className="mt-4 w-full rounded-2xl bg-accent px-6 py-3.5 font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
          >
            {moduleIdx === 0 ? 'Submit and start Module 2 ▶' : 'Submit and see my score ▶'}
          </button>
          {moduleIdx === 0 && (
            <p className="mt-2 text-center text-[11px] text-ink-dim">
              You cannot return to Module 1 after submitting.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── score report ──
  if (phase === 'done') {
    const correct = all.filter((q) => isCorrect(q, answers[q.id])).length;
    const scaled = scaledScore(correct, all.length);
    const band = scoreBand(scaled);
    const areas = breakdownByArea(all, (i) => isCorrect(all[i], answers[all[i].id]));
    const toneClass = {
      ok: 'bg-ok-soft border-ok/50 text-ok',
      accent: 'bg-accent-soft border-accent/45 text-accent',
      warn: 'bg-warn-soft border-warn/50 text-warn',
      bad: 'bg-bad-soft border-bad/50 text-bad',
    }[band.tone];
    const shown = all.filter((q) => (reviewFilter === 'all' ? true : !isCorrect(q, answers[q.id])));

    return (
      <div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`rounded-3xl border-2 p-5 text-center ${toneClass}`}>
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-80">
              Estimated Math score
            </div>
            <div className="mt-1 font-mono text-5xl font-bold tabular-nums">{scaled}</div>
            <div className="mt-1 font-display text-lg font-extrabold">{band.label}</div>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed opacity-90">{band.blurb}</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border-2 border-line bg-surface p-3 text-center">
              <div className="font-mono text-xl font-bold tabular-nums text-ink">{correct}/{all.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Correct</div>
            </div>
            <div className="rounded-2xl border-2 border-line bg-surface p-3 text-center">
              <div className="font-mono text-xl font-bold tabular-nums text-ink">
                {Math.round((correct / all.length) * 100)}%
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Accuracy</div>
            </div>
            <div className="rounded-2xl border-2 border-line bg-surface p-3 text-center">
              <div className="font-mono text-xl font-bold tabular-nums text-ink">{mmss(elapsed)}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Time</div>
            </div>
          </div>

          {/* per-area breakdown — the actionable part */}
          <div className="mt-4 rounded-3xl border-2 border-line bg-surface p-5">
            <div className="font-display text-sm font-extrabold text-ink">Where the points went</div>
            <p className="mt-1 text-xs text-ink-muted">
              Work your weakest area first — that is where the next 50 points are cheapest.
            </p>
            <div className="mt-3 space-y-2.5">
              {areas.map((a) => {
                const info = SAT_AREA_INFO[a.area];
                return (
                  <div key={a.area}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-[12.5px] font-bold text-ink">
                        {info.emoji} {info.name}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                        {a.correct}/{a.total} · {Math.round(a.pct * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${a.pct * 100}%`, background: info.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* question review */}
          <div className="mt-4 flex items-center justify-between gap-2">
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
                  {f === 'wrong' ? `Missed (${all.length - correct})` : `All (${all.length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 space-y-3">
            {shown.length === 0 && (
              <div className="rounded-3xl border-2 border-ok/40 bg-ok-soft p-5 text-center font-display font-bold text-ok">
                Nothing missed. That is a perfect section. 🎯
              </div>
            )}
            {shown.map((q) => {
              const given = answers[q.id];
              const ok = isCorrect(q, given);
              const info = SAT_AREA_INFO[q.area];
              return (
                <div key={q.id} className="rounded-3xl border-2 border-line bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-dim">
                      Module {q.module} · Q{q.n}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider"
                      style={{ background: `${info.color}22`, color: info.color }}
                    >
                      {info.short}
                    </span>
                    <span className={`ml-auto font-display text-[11px] font-bold ${ok ? 'text-ok' : 'text-bad'}`}>
                      {ok ? '✓ Correct' : '✕ Missed'}
                    </span>
                  </div>

                  <div className="mt-2 text-[14px] leading-relaxed text-ink">
                    <MathText text={q.prompt} />
                  </div>
                  {q.diagram && <DiagramRenderer diagram={q.diagram} />}

                  {q.answerType === 'multiple-choice' && (
                    <div className="mt-2 space-y-1">
                      {(q.choices ?? []).map((c) => {
                        const isAnswer = c.id === q.answer;
                        const isGiven = given?.toUpperCase() === c.id;
                        return (
                          <div
                            key={c.id}
                            className={`flex items-start gap-2 rounded-xl border px-2.5 py-1.5 text-[13px] ${
                              isAnswer
                                ? 'border-ok/50 bg-ok-soft text-ink'
                                : isGiven
                                  ? 'border-bad/50 bg-bad-soft text-ink'
                                  : 'border-line bg-surface-2 text-ink-muted'
                            }`}
                          >
                            <span className="font-mono font-bold">{c.id}</span>
                            <span className="min-w-0 flex-1"><MathText text={c.label} /></span>
                            {isAnswer && <span className="text-ok">✓</span>}
                            {isGiven && !isAnswer && <span className="text-bad">your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.answerType === 'numeric' && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
                      <span className="rounded-xl border border-ok/50 bg-ok-soft px-2.5 py-1 font-mono text-ink">
                        Answer: <b>{q.answer}</b>
                      </span>
                      <span
                        className={`rounded-xl border px-2.5 py-1 font-mono text-ink ${
                          ok ? 'border-line bg-surface-2' : 'border-bad/50 bg-bad-soft'
                        }`}
                      >
                        You: <b>{given?.trim() || '—'}</b>
                      </span>
                    </div>
                  )}

                  <div className="mt-3 rounded-2xl border border-line bg-surface-2 p-3">
                    <div className="font-display text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
                      Solution
                    </div>
                    <ol className="mt-1.5 space-y-1">
                      {q.explanation.map((s, i) => (
                        <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink">
                          <span className="shrink-0 font-mono text-[11px] text-ink-dim">{i + 1}.</span>
                          <span><MathText text={s} /></span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-2 rounded-2xl border border-accent/35 bg-accent-soft p-3">
                    <div className="font-display text-[11px] font-extrabold uppercase tracking-wider text-accent">
                      💡 Pro tip
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink">
                      <MathText text={q.proTip} />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/sat')}
              className="w-full rounded-2xl bg-accent px-6 py-3 font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
            >
              Back to SAT Math
            </button>
            <button
              type="button"
              onClick={startTest}
              className="w-full rounded-2xl border-2 border-line bg-surface px-6 py-3 font-display text-sm font-bold text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              Retake this test
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── the timed module ──
  if (!current) return null;
  const low = remaining <= 300;
  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 mb-3 border-b border-line bg-surface/95 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-display text-[12px] font-extrabold text-ink">
              Module {moduleIdx + 1} · Question {index + 1} of {questions.length}
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <div
            className={`shrink-0 rounded-xl px-2.5 py-1 font-mono text-sm font-bold tabular-nums ${
              low ? 'bg-bad-soft text-bad' : 'bg-surface-2 text-ink-muted'
            }`}
          >
            ⏱ {mmss(remaining)}
          </div>
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
          <div className="rounded-3xl border-2 border-line bg-surface p-5">
            <div className="text-[15px] leading-relaxed text-ink">
              <MathText text={current.prompt} />
            </div>
            {current.diagram && <DiagramRenderer diagram={current.diagram} />}

            {current.answerType === 'multiple-choice' ? (
              <div className="mt-4 space-y-2">
                {(current.choices ?? []).map((c) => {
                  const selected = answers[current.id] === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAnswer(current.id, c.id)}
                      aria-pressed={selected}
                      className={`flex w-full items-start gap-3 rounded-2xl border-2 px-3.5 py-3 text-left transition-colors ${
                        selected
                          ? 'border-accent bg-accent-soft'
                          : 'border-line bg-surface-2 hover:border-accent/40'
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold ${
                          selected ? 'bg-accent text-on-accent' : 'bg-surface text-ink-muted'
                        }`}
                      >
                        {c.id}
                      </span>
                      <span className="min-w-0 flex-1 text-[14px] text-ink">
                        <MathText text={c.label} />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4">
                <label
                  htmlFor="sat-answer"
                  className="block font-display text-[11px] font-bold uppercase tracking-wider text-ink-muted"
                >
                  Your answer
                </label>
                <input
                  id="sat-answer"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  value={answers[current.id] ?? ''}
                  onChange={(e) => setAnswer(current.id, e.target.value)}
                  placeholder="e.g. 12, -3, or 3/4"
                  className="mt-1.5 w-full rounded-2xl border-2 border-line bg-surface-2 px-4 py-3 font-mono text-lg text-ink outline-none transition-colors focus:border-accent"
                />
                <p className="mt-1.5 text-[11px] text-ink-dim">
                  No units, no commas, no percent signs. Fractions are accepted and need not be reduced.
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className="rounded-2xl border-2 border-line bg-surface px-4 py-2.5 font-display text-sm font-bold text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => toggleFlag(current.id)}
              aria-pressed={flagged.has(current.id)}
              className={`rounded-2xl border-2 px-4 py-2.5 font-display text-sm font-bold transition-colors ${
                flagged.has(current.id)
                  ? 'border-warn/50 bg-warn-soft text-warn'
                  : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              🚩 {flagged.has(current.id) ? 'Flagged' : 'Flag'}
            </button>
            {index + 1 < questions.length ? (
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex-1 rounded-2xl bg-accent px-6 py-2.5 font-display text-sm font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPhase('review-module')}
                className="flex-1 rounded-2xl bg-accent px-6 py-2.5 font-display text-sm font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
              >
                Review module →
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setPhase('review-module')}
            className="mt-3 w-full py-2 font-display text-xs font-bold text-ink-dim hover:text-ink-muted"
          >
            Jump to the module review page
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
