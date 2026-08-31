import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SAT_AREAS, SAT_AREA_INFO, SAT_UNITS, type SatArea } from '../../data/sat/blueprint';
import { SAT_MOCK_TESTS } from '../../data/sat/tests';
import { TOTAL_SAT_TIPS } from '../../data/sat/tips';
import { useProgress } from '../../state/progress';
import { scoreBand, mmss } from '../../utils/satScore';
import { useSeo, courseJsonLd, breadcrumbJsonLd, SITE_URL } from '../../lib/seo';

// ── /sat — the section hub ─────────────────────────────────────────────────
// Score first, then the blueprint (so a student knows where the points are),
// then the 18 unit playbooks grouped by area, then the five mock tests.

function AreaBar({ area }: { area: SatArea }) {
  const info = SAT_AREA_INFO[area];
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 shrink-0 text-[11px] font-display font-bold text-ink-muted">{info.short}</div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full" style={{ width: `${info.weight * 100}%`, background: info.color }} />
      </div>
      <div className="w-16 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink-muted">
        {info.perTest} of 44
      </div>
    </div>
  );
}

export function SatHub() {
  useSeo({
    title: 'Digital SAT Math Prep — Practice, Playbooks, and 5 Full Mock Tests | Math10x',
    description:
      'Free Digital SAT Math prep: 180 practice questions with worked explanations, 18 unit playbooks, 100+ strategy tips, and five full-length mock tests with scoring.',
    canonicalPath: '/sat',
    jsonLd: [
      courseJsonLd(
        'Digital SAT Math Prep',
        'Complete SAT Math preparation covering algebra, advanced math, problem-solving and data analysis, and geometry and trigonometry.',
        `${SITE_URL}/sat`,
      ),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'SAT Math', path: '/sat' },
      ]),
    ],
  });

  const satTests = useProgress((s) => s.satTests ?? {});
  const best = useProgress((s) => s.satBestScaled ?? 0);
  const dp = useProgress((s) => s.byDomain.SAT);
  const band = scoreBand(best || 200);

  const taken = Object.keys(satTests).length;
  const unitsStarted = Object.keys(dp?.unitStars ?? {}).length;

  return (
    <div>
      {/* ── headline ── */}
      <div className="rounded-3xl border-2 border-line bg-surface p-5">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎯</div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold text-ink">SAT Math</h1>
            <p className="mt-1 text-sm text-ink-muted">
              The full Digital SAT Math blueprint — 18 unit playbooks, 180 practice questions,
              5 full-length mock tests, and {TOTAL_SAT_TIPS} strategy tips.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
            <div className="font-mono text-2xl font-bold tabular-nums text-accent">
              {best > 0 ? best : '—'}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Best score</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
            <div className="font-mono text-2xl font-bold tabular-nums text-ink">{taken}/5</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Tests taken</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
            <div className="font-mono text-2xl font-bold tabular-nums text-ink">{unitsStarted}/18</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Units started</div>
          </div>
        </div>

        {best > 0 && (
          <div className="mt-3 rounded-2xl border border-line bg-surface-2 p-3">
            <div className="font-display text-sm font-extrabold text-ink">{band.label}</div>
            <div className="mt-0.5 text-xs text-ink-muted">{band.blurb}</div>
          </div>
        )}
      </div>

      {/* ── blueprint ── */}
      <div className="mt-4 rounded-3xl border-2 border-line bg-surface p-5">
        <div className="font-display text-sm font-extrabold text-ink">📐 What the test actually asks</div>
        <p className="mt-1 text-xs text-ink-muted">
          Two modules of 22 questions, 35 minutes each. The four content areas are weighted like this —
          which is why an even split of your study time over-invests in geometry by about a factor of two.
        </p>
        <div className="mt-3 space-y-2">
          {SAT_AREAS.map((a) => (
            <AreaBar key={a} area={a} />
          ))}
        </div>
      </div>

      {/* ── strategy library ── */}
      <Link
        to="/sat/tips"
        className="mt-4 flex items-center gap-3 rounded-3xl border-2 border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
      >
        <div className="text-3xl">🧠</div>
        <div className="min-w-0 flex-1">
          <div className="font-display font-extrabold text-ink">Strategy library</div>
          <div className="text-xs text-ink-muted">
            {TOTAL_SAT_TIPS} tips across 12 categories — pacing, the built-in Desmos calculator,
            answer-entry rules, and the traps each area is built on.
          </div>
        </div>
        <div className="shrink-0 text-ink-dim">→</div>
      </Link>

      {/* ── unit playbooks ── */}
      <div className="mt-6 mb-2 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        📘 Unit playbooks
      </div>
      {SAT_AREAS.map((area) => {
        const info = SAT_AREA_INFO[area];
        const units = SAT_UNITS.filter((u) => u.area === area);
        return (
          <div key={area} className="mb-4">
            <div className="mb-1.5 flex items-baseline gap-2">
              <span className="text-base">{info.emoji}</span>
              <span className="font-display text-sm font-extrabold text-ink">{info.name}</span>
              <span className="font-mono text-[10px] tabular-nums text-ink-dim">
                {Math.round(info.weight * 100)}% of the test
              </span>
            </div>
            <p className="mb-2 text-xs text-ink-muted">{info.blurb}</p>
            <div className="space-y-1.5">
              {units.map((u) => {
                const stars = dp?.unitStars[u.unit] ?? 0;
                return (
                  <Link
                    key={u.unit}
                    to={`/sat/unit/${u.unit}`}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-2.5 transition-colors hover:border-accent"
                    style={{ borderLeftWidth: 4, borderLeftColor: info.color }}
                  >
                    <div className="w-6 shrink-0 text-center font-mono text-xs font-bold text-ink-dim">
                      {u.unit}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[13px] font-bold text-ink">{u.title}</div>
                      <div className="truncate text-[11px] text-ink-muted">{u.tested}</div>
                    </div>
                    <div className="shrink-0 text-[11px] tracking-tight text-warn">
                      {'★'.repeat(stars)}
                      <span className="text-ink-dim">{'★'.repeat(3 - stars)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── mock tests ── */}
      <div className="mt-6 mb-2 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        ⏱ Full-length mock tests
      </div>
      <div className="space-y-2">
        {SAT_MOCK_TESTS.map((t, i) => {
          const result = satTests[t.n];
          return (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/sat/test/${t.n}`}
                className="block rounded-2xl border-2 border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-extrabold text-ink">{t.title}</div>
                    <div className="mt-0.5 text-xs text-ink-muted">{t.blurb}</div>
                    <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
                      44 questions · 2 modules · 70 minutes
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {result ? (
                      <>
                        <div className="font-mono text-xl font-bold tabular-nums text-ok">{result.scaled}</div>
                        <div className="font-mono text-[10px] tabular-nums text-ink-dim">
                          {result.correct}/{result.total} · {mmss(result.seconds)}
                        </div>
                      </>
                    ) : (
                      <div className="rounded-full bg-accent-soft px-3 py-1 font-display text-[11px] font-bold text-accent">
                        Start
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              {result && (
                <Link
                  to={`/sat/analysis/${t.n}`}
                  className="mt-1 flex items-center justify-between rounded-xl border border-accent/35 bg-accent-soft px-3 py-2 font-display text-[12px] font-bold text-accent transition-colors hover:bg-accent-soft/70"
                >
                  <span>📋 Full analysis and recovery plan</span>
                  <span>→</span>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-3 text-[11px] leading-relaxed text-ink-muted">
        Scores are estimates from a representative conversion curve, not official College Board scores.
        The real test equates each administration separately and its second module adapts to your first —
        use these to track progress and pace yourself, not to predict a number.
      </div>

      <Link
        to="/"
        className="mt-6 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink"
      >
        ← Back home
      </Link>
    </div>
  );
}
