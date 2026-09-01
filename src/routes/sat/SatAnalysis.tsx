import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMockTest, allQuestions } from '../../data/sat/tests';
import { SAT_AREA_INFO } from '../../data/sat/blueprint';
import { getPlaybook } from '../../data/sat/playbooks';
import { diagnoseTest, type UnitDiagnosis } from '../../utils/satAnalysis';
import { buildPlan } from '../../utils/satAnalysis';
import { scoreBand, mmss } from '../../utils/satScore';
import { MathText } from '../../components/MathText';
import { useProgress } from '../../state/progress';
import { useSeo } from '../../lib/seo';

// ── /sat/analysis/:n — the full post-test diagnosis ────────────────────────
// The score report says how many points; this page says which units bled
// them, what kind of misses they were, and exactly what to do about it —
// a ranked recovery plan, tips picked from this student's miss patterns,
// and a practice set custom-built from the stored answers.

function WeakUnitCard({ u, rank }: { u: UnitDiagnosis; rank: number }) {
  const area = SAT_AREA_INFO[u.area];
  const pb = getPlaybook(u.unit);
  const stars = useProgress((s) => s.byDomain.SAT?.unitStars[u.unit] ?? 0);
  return (
    <div
      className="rounded-3xl border-2 border-line bg-surface p-4"
      style={{ borderLeftWidth: 8, borderLeftColor: area.color }}
    >
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-bad-soft font-mono text-[13px] font-bold text-bad">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[13.5px] font-extrabold text-ink">
            Unit {u.unit}: {u.title}
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-wider" style={{ color: area.color }}>
            {area.short} · ≈{u.perTest.toFixed(1)} questions per real test
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-lg font-bold tabular-nums text-bad">
            {u.correct}/{u.total}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-ink-dim">on this test</div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {u.missed.map((q) => (
          <span
            key={q.id}
            className="rounded-full border border-bad/40 bg-bad-soft px-2 py-0.5 font-mono text-[10px] text-bad"
          >
            M{q.module} Q{q.n} · {'●'.repeat(q.difficulty)}
          </span>
        ))}
        {u.blank > 0 && (
          <span className="rounded-full border border-warn/40 bg-warn-soft px-2 py-0.5 font-mono text-[10px] text-warn">
            {u.blank} left blank
          </span>
        )}
      </div>

      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
        {u.easyMisses > 0
          ? 'Misses include the easier tier — treat this as a content gap and rebuild from the playbook, not just harder practice.'
          : 'Only the hard tier got away — the foundation holds, so drill the top end and the traps below.'}
      </p>

      {pb && (
        <div className="mt-2 rounded-2xl border border-line bg-surface-2 p-3">
          <div className="font-display text-[10.5px] font-extrabold uppercase tracking-wider text-ink-muted">
            ⚠️ The traps this unit is built on
          </div>
          <ul className="mt-1 space-y-1">
            {pb.traps.slice(0, 2).map((t, i) => (
              <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-ink">
                <span className="shrink-0 text-bad">✕</span>
                <span><MathText text={t} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <Link
          to={`/sat/unit/${u.unit}`}
          className="flex-1 rounded-xl border-2 border-line bg-surface px-3 py-2 text-center font-display text-[12px] font-bold text-ink transition-colors hover:border-accent"
        >
          📘 Playbook
        </Link>
        <Link
          to={`/unit/SAT/${u.unit}`}
          className="flex-1 rounded-xl bg-accent px-3 py-2 text-center font-display text-[12px] font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Drill it {stars > 0 && `(${'★'.repeat(stars)})`}
        </Link>
      </div>
    </div>
  );
}

export function SatAnalysis() {
  const { n } = useParams<{ n: string }>();
  const testN = Number(n);
  const test = getMockTest(testN);
  const result = useProgress((s) => (s.satTests ?? {})[testN]);

  useSeo({
    title: test ? `${test.title} — analysis and recovery plan | Math10x` : 'SAT Math analysis | Math10x',
    description:
      'A full diagnosis of your SAT Math mock test: which units cost you points, why you missed what you missed, and a customized recovery plan with matched practice.',
    canonicalPath: `/sat/analysis/${testN}`,
  });

  const questions = useMemo(() => (test ? allQuestions(test) : []), [test]);
  const diag = useMemo(
    () => (result ? diagnoseTest(questions, result.answers) : null),
    [questions, result],
  );

  if (!test || !Number.isFinite(testN)) return <Navigate to="/sat" replace />;
  if (!result || !diag) return <Navigate to={`/sat/test/${testN}`} replace />;

  const band = scoreBand(result.scaled);
  const plan = buildPlan(diag, testN);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* ── header ── */}
        <div className="rounded-3xl border-2 border-line bg-surface p-5">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-ink-dim">
            {test.title} · Full analysis
          </div>
          <div className="mt-2 flex items-end gap-4">
            <div>
              <div className="font-mono text-4xl font-bold tabular-nums text-ink">{result.scaled}</div>
              <div className="font-display text-sm font-extrabold text-accent">{band.label}</div>
            </div>
            <div className="mb-1 flex-1 text-right font-mono text-[12px] tabular-nums text-ink-muted">
              {result.correct}/{result.total} correct · {mmss(result.seconds)}
            </div>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
            {diag.weak.length === 0
              ? 'Nothing leaked. The plan below is about holding this under pressure.'
              : `The ${result.total - result.correct} missed ${result.total - result.correct === 1 ? 'point' : 'points'} came from ${diag.weak.length} ${diag.weak.length === 1 ? 'unit' : 'units'} — ranked below by how many real-test questions ride on each. Fix them in order.`}
          </p>
        </div>

        {/* ── how you missed: the signals ── */}
        {diag.signals.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
              🔍 How the points were lost
            </div>
            <div className="space-y-2">
              {diag.signals.map((s) => (
                <div key={s.kind} className="rounded-3xl border-2 border-line bg-surface p-4">
                  <div className="font-display text-[13px] font-extrabold text-ink">
                    {s.emoji} {s.title}
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── weak units, ranked ── */}
        {diag.weak.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
              🩹 Work these, in this order
            </div>
            <div className="space-y-3">
              {diag.weak.map((u, i) => (
                <WeakUnitCard key={u.unit} u={u} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* ── strengths ── */}
        {diag.strong.length > 0 && (
          <div className="mt-5 rounded-3xl border-2 border-ok/40 bg-ok-soft p-4">
            <div className="font-display text-[13px] font-extrabold text-ok">✅ Banked — do not re-study these</div>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
              Perfect on this test. Study time spent here is taken from the units above.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {diag.strong.map((u) => (
                <span key={u.unit} className="rounded-full border border-ok/40 bg-surface px-2.5 py-1 font-display text-[11px] font-bold text-ink">
                  U{u.unit} · {u.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── the recovery plan ── */}
        <div className="mt-5">
          <div className="mb-2 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
            🗺️ Your recovery plan
          </div>
          <div className="space-y-2">
            {plan.map((step, i) => (
              <div key={i} className="rounded-3xl border-2 border-line bg-surface p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent-soft font-mono text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[13px] font-extrabold text-ink">
                      {step.emoji} {step.title}
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{step.detail}</p>
                    {step.to && step.cta && (
                      <Link
                        to={step.to}
                        className="mt-2 inline-block rounded-xl bg-accent px-4 py-2 font-display text-[12px] font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
                      >
                        {step.cta} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── personalized tips ── */}
        {diag.tips.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
              💡 Tips picked from your miss patterns
            </div>
            <div className="space-y-2">
              {diag.tips.map((t) => (
                <div key={t.id} className="rounded-2xl border border-line bg-surface p-3.5">
                  <div className="font-display text-[12.5px] font-bold text-ink">{t.title}</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
                    <MathText text={t.body} />
                  </p>
                  {t.example && (
                    <div className="mt-2 overflow-x-auto rounded-xl bg-surface-2 p-2.5 font-mono text-[11.5px] leading-relaxed text-ink">
                      <MathText text={t.example} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Link to="/sat/tips" className="mt-2 inline-block font-display text-xs font-bold text-accent hover:underline">
              The full strategy library →
            </Link>
          </div>
        )}

        {/* ── footer nav ── */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to={`/sat/recovery/${testN}`}
            className="w-full rounded-2xl bg-accent px-6 py-3.5 text-center font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Start my custom practice set ▶
          </Link>
          <Link
            to="/sat"
            className="w-full rounded-2xl border-2 border-line bg-surface px-6 py-3 text-center font-display text-sm font-bold text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            Back to SAT Math
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
