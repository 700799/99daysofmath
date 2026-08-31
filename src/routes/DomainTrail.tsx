import { useParams, Link, Navigate } from 'react-router-dom';
import { DOMAINS, DOMAIN_LABELS, DOMAIN_DESCRIPTIONS, DOMAIN_COLORS, domainCourseName, gradeLabelFor, type Domain } from '../types/problem';
import { useUnitsForDomain } from '../hooks/useProblems';
import { useProgress } from '../state/progress';
import { LESSONS, getLesson, lessonKey } from '../data/lessons';
import { useSeo, courseJsonLd, breadcrumbJsonLd, SITE_URL } from '../lib/seo';

// ── Sector Map — spacey mission-control replacement for the bubble trail. ──
// Precise stats first (telemetry strip), then one compact angular row per
// unit: score %, stars, the lesson-step sequence (strictly in order, greyed
// until reached), and a tick-mark sparkline of the last 6 runs. Units are
// freely jumpable; only the steps INSIDE a unit are sequential.

const CUT = 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)';
const CUT_BIG = 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))';

type StepState = 'done' | 'cur' | 'lock';
interface Step { label: string; state: StepState }

function stepsFor(lessonDone: boolean, ranPractice: boolean, stars: number): Step[] {
  // The strict in-unit ladder: Lesson → Practice → Quiz (★) → Mastery (★★★).
  const s: Step[] = [];
  s.push({ label: 'L', state: lessonDone ? 'done' : 'cur' });
  s.push({ label: 'P', state: ranPractice || stars > 0 ? 'done' : lessonDone ? 'cur' : 'lock' });
  s.push({ label: 'Q', state: stars >= 1 ? 'done' : ranPractice ? 'cur' : 'lock' });
  s.push({ label: 'M', state: stars === 3 ? 'done' : stars >= 1 ? 'cur' : 'lock' });
  return s;
}

function Spark({ runs }: { runs: number[] }) {
  const bars = [...runs.slice(-6)];
  while (bars.length < 6) bars.unshift(-1); // pad left with "no run" stubs
  return (
    <div>
      <div className="flex h-[26px] items-end gap-[2px]" aria-label="Recent run scores">
        {bars.map((v, i) => {
          const last = i === bars.length - 1 && v >= 0;
          const h = v < 0 ? 3 : Math.max(4, Math.round((v / 100) * 26));
          const col = v < 0 ? 'rgb(var(--line))' : v >= 80 ? 'rgb(var(--ok))' : v >= 50 ? 'rgb(var(--warn))' : 'rgb(var(--bad))';
          return (
            <span key={i} className="block w-[4px]"
              style={{ height: h, background: col, outline: last ? '1px solid rgb(var(--accent))' : undefined, outlineOffset: 1 }} />
          );
        })}
      </div>
      <div className="mt-[3px] text-right font-mono text-[8px] tracking-wider text-ink-muted">
        {runs.length ? 'LAST RUNS' : 'NO RUNS YET'}
      </div>
    </div>
  );
}

const NODE_CLIP = 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)';

export function DomainTrail() {
  const { domain } = useParams<{ domain: string }>();
  if (!domain || !DOMAINS.includes(domain as Domain)) {
    return <Navigate to="/" replace />;
  }
  const d = domain as Domain;
  useSeo({
    title: `${domainCourseName(d)} | Math10x`,
    description: `Learn ${DOMAIN_LABELS[d]} (${d}) for ${gradeLabelFor(d)}: ${DOMAIN_DESCRIPTIONS[d]}. Free lessons, worked examples, and practice on Math10x.`,
    canonicalPath: `/trail/${d}`,
    jsonLd: [
      courseJsonLd(
        domainCourseName(d),
        DOMAIN_DESCRIPTIONS[d],
        `${SITE_URL}/trail/${d}`,
      ),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: DOMAIN_LABELS[d], path: `/trail/${d}` },
      ]),
    ],
  });
  const { data: units, loading, error } = useUnitsForDomain(d);
  const dp = useProgress((s) => s.byDomain[d]);
  const xp = useProgress((s) => s.xp);
  const dailyStreak = useProgress((s) => s.dailyStreak);
  const lessonsViewed = useProgress((s) => s.lessonsViewed);
  const problemStats = useProgress((s) => s.problemStats);
  const unitRuns = useProgress((s) => s.unitRuns ?? {});

  // Telemetry — precise, up front.
  const lessonsDone = lessonsViewed.length;
  const lessonsTotal = LESSONS.length;
  let att = 0, corr = 0;
  for (const st of Object.values(problemStats)) { att += st.attempts; corr += st.correct; }
  const accuracy = att > 0 ? Math.round((corr / att) * 100) : 0;

  // Sector average: mean of each attempted unit's latest run %.
  const sectorRuns = (units ?? [])
    .map((u) => unitRuns[lessonKey(d, u)])
    .filter((r): r is number[] => !!r && r.length > 0)
    .map((r) => r[r.length - 1]);
  const sectorAvg = sectorRuns.length
    ? Math.round(sectorRuns.reduce((a, b) => a + b, 0) / sectorRuns.length)
    : null;

  return (
    <div className="mx-auto max-w-[480px] rounded-xl bg-canvas p-3 pb-6 text-ink">
      {/* ── telemetry strip: exact numbers first ── */}
      <div className="border border-line bg-gradient-to-b from-surface to-surface-2 px-3.5 py-3"
        style={{ clipPath: CUT }}>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-[12px] font-display font-black uppercase tracking-[0.22em] text-accent">
            ⟡ Mission Control
          </div>
          <Link to="/" className="font-mono text-[10px] tracking-wider text-ink-muted hover:text-accent">
            ← ALL SECTORS
          </Link>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {[
            { v: xp.toLocaleString(), l: 'Total XP', c: 'rgb(var(--accent))' },
            { v: `${lessonsDone}/${lessonsTotal}`, l: 'Lessons', c: 'rgb(var(--ok))' },
            { v: `${accuracy}%`, l: 'Accuracy', c: 'rgb(var(--warn))' },
            { v: `${dailyStreak}d`, l: 'Streak', c: 'rgb(var(--ink))' },
          ].map((s) => (
            <div key={s.l} className="border-l-2 border-line pl-2">
              <b className="block font-mono text-[18px] leading-tight tabular-nums" style={{ color: s.c }}>{s.v}</b>
              <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── the sector panel ── */}
      <div className="relative mt-3 border border-line bg-gradient-to-b from-surface to-surface-2 px-3 py-3"
        style={{ clipPath: CUT_BIG }}>
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="grid h-8 w-8 flex-none place-items-center font-mono text-[11px] font-bold text-[color:rgb(var(--on-accent))]"
            style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)', background: DOMAIN_COLORS[d] }}>
            {d.replace('6.', '').replace('5.', '')}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-display font-black uppercase tracking-[0.16em]">Sector {d}</div>
            <div className="truncate font-mono text-[10px] text-ink-muted">
              {DOMAIN_LABELS[d]} · {units?.length ?? 0} units
            </div>
          </div>
          <div className="ml-auto text-right">
            <b className="font-mono text-[16px] tabular-nums text-warn">{sectorAvg == null ? '—' : `${sectorAvg}%`}</b>
            <span className="block text-[8px] font-bold uppercase tracking-[0.14em] text-ink-muted">sector avg</span>
          </div>
        </div>

        {loading && <div className="py-10 text-center font-mono text-sm text-ink-muted">SCANNING SECTOR…</div>}
        {error && <div className="py-6 text-center font-mono text-xs text-bad">{error.message}</div>}

        {(units ?? []).map((u) => {
          const key = lessonKey(d, u);
          const lesson = getLesson(d, u);
          const stars = dp?.unitStars[u] ?? 0;
          const runs = unitRuns[key] ?? [];
          const lessonDone = lessonsViewed.includes(key);
          const steps = stepsFor(lessonDone, runs.length > 0, stars);
          const latest = runs.length ? runs[runs.length - 1] : null;
          const mastered = stars === 3;
          const started = lessonDone || stars > 0 || runs.length > 0;
          const nodeBg = mastered ? 'rgb(var(--ok))' : started ? 'rgb(var(--accent))' : 'rgb(var(--line-strong))';

          return (
            <Link key={u} to={`/unit/${d}/${u}`}
              className="mt-1.5 grid grid-cols-[34px_1fr_auto] items-center gap-2.5 border border-line bg-surface px-2 py-2 no-underline transition-colors hover:border-accent"
              style={{ clipPath: CUT }} data-haptic="tap">
              <div className="grid h-[30px] w-[30px] place-items-center font-mono text-[13px] font-bold text-[color:rgb(var(--on-accent))]"
                style={{ clipPath: NODE_CLIP, background: nodeBg, boxShadow: undefined }}>
                {u}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12.5px] font-display font-extrabold text-ink">
                  {lesson?.title ?? `Unit ${u}`}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold tabular-nums"
                    style={{ color: latest == null ? 'rgb(var(--ink-muted))' : 'rgb(var(--warn))' }}>
                    {latest == null ? '—' : `${latest}%`}
                  </span>
                  <span className="text-[10px] tracking-[0.1em] text-warn">
                    {'★'.repeat(stars)}<span className="text-ink-dim">{'★'.repeat(3 - stars)}</span>
                  </span>
                </div>
                {/* lesson-step sequence: strict order, locked greyed until reached */}
                <div className="mt-1 flex gap-1">
                  {steps.map((st, i) => (
                    <span key={i}
                      className="grid h-[13px] w-[13px] place-items-center border text-[8px] font-black"
                      style={
                        st.state === 'done'
                          ? { background: 'rgb(var(--ok))', borderColor: 'rgb(var(--ok))', color: 'rgb(var(--surface))' }
                          : st.state === 'cur'
                            ? { borderColor: 'rgb(var(--accent))', color: 'rgb(var(--accent))', background: 'rgb(var(--accent-soft))' }
                            : { borderColor: 'rgb(var(--line-strong))', color: 'rgb(var(--ink-dim))', background: 'transparent' }
                      }>
                      {st.state === 'done' ? '✓' : st.state === 'cur' ? '▸' : '–'}
                    </span>
                  ))}
                </div>
              </div>
              <Spark runs={runs} />
            </Link>
          );
        })}
      </div>

      <div className="mt-3 text-center font-mono text-[10px] tracking-wider text-ink-muted">
        UNITS: JUMP TO ANY · STEPS: L LESSON → P PRACTICE → Q QUIZ → M MASTERY
      </div>
    </div>
  );
}
