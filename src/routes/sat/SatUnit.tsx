import { useParams, Link, Navigate } from 'react-router-dom';
import { getPlaybook } from '../../data/sat/playbooks';
import { SAT_AREA_INFO, SAT_UNITS } from '../../data/sat/blueprint';
import { tipsForArea } from '../../data/sat/tips';
import { MathText } from '../../components/MathText';
import { useProgress } from '../../state/progress';
import { useSeo, breadcrumbJsonLd } from '../../lib/seo';

// ── /sat/unit/:n — one unit playbook ───────────────────────────────────────
// A briefing, not a story: what is asked, the methods in the order to reach
// for them, worked examples, the facts to memorize, the traps, Desmos, and
// timing. The drill itself reuses the standard /unit/SAT/:n runner.

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-3xl border-2 border-line bg-surface p-5">
      <div className="font-display text-sm font-extrabold text-ink">
        {emoji} {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function SatUnit() {
  const { n } = useParams<{ n: string }>();
  const unit = Number(n);
  const pb = getPlaybook(unit);
  const info = SAT_UNITS.find((u) => u.unit === unit);
  const stars = useProgress((s) => s.byDomain.SAT?.unitStars[unit] ?? 0);

  useSeo({
    title: pb ? `${pb.title} — SAT Math | Math10x` : 'SAT Math | Math10x',
    description: pb
      ? `${pb.overview} Free SAT Math practice with worked explanations on Math10x.`
      : 'SAT Math practice on Math10x.',
    canonicalPath: `/sat/unit/${unit}`,
    jsonLd: breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'SAT Math', path: '/sat' },
      { name: pb?.title ?? `Unit ${unit}`, path: `/sat/unit/${unit}` },
    ]),
  });

  if (!pb || !info) return <Navigate to="/sat" replace />;
  const area = SAT_AREA_INFO[pb.area];
  const areaTips = tipsForArea(pb.area);

  return (
    <div>
      {/* ── header ── */}
      <div className="rounded-3xl border-2 border-line bg-surface p-5" style={{ borderLeftWidth: 10, borderLeftColor: area.color }}>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: area.color }}>
            {area.name} · Unit {pb.unit}
          </span>
        </div>
        <h1 className="mt-1 font-display text-xl font-extrabold text-ink">{pb.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{pb.overview}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[10px] text-ink-muted">
            {pb.frequency}
          </span>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] tracking-tight text-warn">
            {'★'.repeat(stars)}
            <span className="text-ink-dim">{'★'.repeat(3 - stars)}</span>
          </span>
        </div>
        <Link
          to={`/unit/SAT/${pb.unit}`}
          className="mt-4 block w-full rounded-2xl bg-accent px-6 py-3 text-center font-display text-base font-extrabold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Practice this unit — 10 questions ▶
        </Link>
      </div>

      {/* ── methods ── */}
      <Section title="Methods, in the order to reach for them" emoji="🛠️">
        <div className="space-y-3">
          {pb.methods.map((m, i) => (
            <div key={i} className="rounded-2xl border border-line bg-surface-2 p-3">
              <div className="font-display text-[13px] font-extrabold text-ink">
                {i + 1}. {m.name}
              </div>
              <ul className="mt-1.5 space-y-1">
                {m.steps.map((s, j) => (
                  <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-ink-muted">
                    <span className="shrink-0 text-ink-dim">·</span>
                    <span><MathText text={s} /></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── worked examples ── */}
      <Section title="Worked examples" emoji="✏️">
        <div className="space-y-3">
          {pb.examples.map((ex, i) => (
            <div key={i} className="rounded-2xl border border-line bg-surface-2 p-3">
              <div className="font-display text-[13px] font-bold text-ink">
                <MathText text={ex.q} />
              </div>
              <ol className="mt-2 space-y-1">
                {ex.steps.map((s, j) => (
                  <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-ink-muted">
                    <span className="shrink-0 font-mono text-[11px] text-ink-dim">{j + 1}.</span>
                    <span><MathText text={s} /></span>
                  </li>
                ))}
              </ol>
              <div className="mt-2 inline-block rounded-full bg-ok-soft px-3 py-1 font-mono text-[12px] font-bold text-ok">
                <MathText text={ex.answer} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── must know ── */}
      <Section title="Have these cold" emoji="🧠">
        <ul className="space-y-1.5">
          {pb.mustKnow.map((k, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink">
              <span className="shrink-0 text-ok">✓</span>
              <span><MathText text={k} /></span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── traps ── */}
      <div className="mt-4 rounded-3xl border-2 border-bad/40 bg-bad-soft p-5">
        <div className="font-display text-sm font-extrabold text-bad">⚠️ Traps this unit is built on</div>
        <ul className="mt-2 space-y-1.5">
          {pb.traps.map((t, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink">
              <span className="shrink-0 text-bad">✕</span>
              <span><MathText text={t} /></span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── desmos + timing ── */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border-2 border-line bg-surface p-4">
          <div className="font-display text-sm font-extrabold text-ink">🖩 Desmos here</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{pb.desmos}</p>
        </div>
        <div className="rounded-3xl border-2 border-line bg-surface p-4">
          <div className="font-display text-sm font-extrabold text-ink">⏱ What it should cost</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{pb.timing}</p>
        </div>
      </div>

      {/* ── area tips ── */}
      {areaTips.length > 0 && (
        <Section title={`More ${area.short} tips`} emoji="💡">
          <div className="space-y-2">
            {areaTips.slice(0, 4).map((t) => (
              <div key={t.id} className="rounded-2xl border border-line bg-surface-2 p-3">
                <div className="font-display text-[12.5px] font-bold text-ink">{t.title}</div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
                  <MathText text={t.body} />
                </p>
              </div>
            ))}
          </div>
          <Link to="/sat/tips" className="mt-3 inline-block font-display text-xs font-bold text-accent hover:underline">
            See the full strategy library →
          </Link>
        </Section>
      )}

      {/* ── nav ── */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {pb.unit > 1 ? (
          <Link to={`/sat/unit/${pb.unit - 1}`} className="font-display text-sm font-bold text-ink-muted hover:text-ink">
            ← Unit {pb.unit - 1}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/sat" className="font-display text-sm font-bold text-ink-muted hover:text-ink">
          All units
        </Link>
        {pb.unit < 18 ? (
          <Link to={`/sat/unit/${pb.unit + 1}`} className="font-display text-sm font-bold text-ink-muted hover:text-ink">
            Unit {pb.unit + 1} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
