import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MAP5_STRANDS, MAP5_TIPS, MAP5_TEST_SIZE, type Map5StrandInfo } from '../../data/map5';
import { useProgress } from '../../state/progress';
import { useDomainSummary } from '../../hooks/useProblems';
import { map5Band } from '../../data/map5';
import { useSeo, courseJsonLd, breadcrumbJsonLd, SITE_URL } from '../../lib/seo';

// ── /map5 — the 5th-grade MAP Growth prep hub ──────────────────────────────
// The same 5.F content, re-shelved into the four instructional areas NWEA
// prints on a score report, plus a practice test and the strategy that is
// specific to an adaptive, untimed test.

function StrandRow({ strand, index }: { strand: Map5StrandInfo; index: number }) {
  const stars = useProgress((s) => {
    const dp = s.byDomain['5.F'];
    if (!dp) return 0;
    return strand.units.reduce<number>((sum, u) => sum + (dp.unitStars[u] ?? 0), 0);
  });
  const possible = strand.units.length * 3;
  const pct = possible > 0 ? stars / possible : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-3xl border-2 border-line bg-surface p-4"
      style={{ borderLeftWidth: 8, borderLeftColor: strand.color }}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{strand.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-display text-[14px] font-extrabold text-ink">{strand.name}</div>
            <div className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
              ~{Math.round(strand.weight * 100)}% of the test
            </div>
          </div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{strand.blurb}</p>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct * 100}%`, background: strand.color }}
            />
          </div>
          <div className="mt-1 font-mono text-[10.5px] text-ink-dim">
            {stars}/{possible} stars · {strand.units.length} unit{strand.units.length === 1 ? '' : 's'}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {strand.units.map((u) => (
              <Link
                key={u}
                to={`/unit/5.F/${u}`}
                className="rounded-lg border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px] font-bold text-ink-muted transition-colors hover:border-accent hover:text-ink"
              >
                U{u}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Map5Hub() {
  useSeo({
    title: '5th Grade MAP Growth Math Prep — Free Practice by Goal Strand | Math10x',
    description:
      'Free 5th-grade NWEA MAP Growth math prep: practice organised by the four instructional areas on the score report, a full practice test with a strand breakdown, and strategy for an adaptive, untimed test.',
    canonicalPath: '/map5',
    jsonLd: [
      courseJsonLd(
        '5th Grade MAP Growth Math Prep',
        'Practice for the NWEA MAP Growth Math 2-5 assessment, organised by instructional area.',
        `${SITE_URL}/map5`,
      ),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: '5th Grade MAP Prep', path: '/map5' },
      ]),
    ],
  });

  const { data: summary } = useDomainSummary();
  const best = useProgress((s) => s.map5BestRit ?? 0);
  const taken = useProgress((s) => (s.map5Tests ?? []).length);
  const counts = summary?.find((s) => s.domain === '5.F');
  const band = best > 0 ? map5Band(best) : null;

  return (
    <div>
      <div className="rounded-3xl border-2 border-line bg-surface p-5" style={{ borderLeftWidth: 10, borderLeftColor: '#4C8C8C' }}>
        <div className="flex items-start gap-4">
          <div className="text-4xl sm:text-5xl">🎓</div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold text-ink">5th Grade MAP Prep</h1>
            <div className="mt-0.5 font-display text-xs font-bold uppercase tracking-wider text-ink-muted">
              NWEA MAP Growth · Math 2-5
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              The same 5th-grade course, re-shelved into the four instructional areas your score
              report actually names — so you can see which one is costing you points and work it
              directly.
            </p>
            {counts && (
              <div className="mt-2 font-mono text-[11px] text-ink-dim">
                {counts.count} problems · {counts.units} units · 4 strands
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
            <div className="font-mono text-2xl font-bold tabular-nums text-accent">
              {best > 0 ? best : '—'}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Best estimate
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface-2 p-3 text-center">
            <div className="font-mono text-2xl font-bold tabular-nums text-ink">{taken}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Tests taken
            </div>
          </div>
        </div>

        {band && (
          <div className="mt-3 rounded-2xl border border-line bg-surface-2 p-3">
            <div className="font-display text-sm font-extrabold text-ink">{band.label}</div>
            <div className="mt-0.5 text-xs leading-relaxed text-ink-muted">{band.blurb}</div>
          </div>
        )}

        <Link
          to="/map5/test"
          className="mt-4 block w-full rounded-2xl bg-accent px-6 py-3.5 text-center font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Take a {MAP5_TEST_SIZE}-question practice test ▶
        </Link>
        <p className="mt-2 text-center text-[11px] text-ink-dim">
          Adaptive and untimed, like the real thing.
        </p>
      </div>

      {/* ── the four strands ── */}
      <div className="mb-2 mt-6 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        📚 The four instructional areas
      </div>
      <div className="space-y-3">
        {MAP5_STRANDS.map((s, i) => (
          <StrandRow key={s.key} strand={s} index={i} />
        ))}
      </div>

      {/* ── strategy ── */}
      <div className="mb-2 mt-6 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        🧠 How to take an adaptive test
      </div>
      <div className="space-y-2">
        {MAP5_TIPS.map((t) => (
          <div key={t.title} className="rounded-2xl border border-line bg-surface p-3.5">
            <div className="font-display text-[12.5px] font-bold text-ink">
              {t.emoji} {t.title}
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{t.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-3 text-[11px] leading-relaxed text-ink-muted">
        Scores here are a rough estimate for tracking progress, not a predicted RIT. The real test
        is adaptive over a calibrated bank of items, and NWEA equates it against national norms —
        use this to find weak strands and watch them improve, not to guess a number.
      </div>

      <Link to="/trail/5.F" className="mt-6 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink">
        ← Back to the 5th-grade trail
      </Link>
    </div>
  );
}
