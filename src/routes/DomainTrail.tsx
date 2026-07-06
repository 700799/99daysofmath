import { useParams, Link, Navigate } from 'react-router-dom';
import { DOMAINS, DOMAIN_LABELS, DOMAIN_COLORS, type Domain } from '../types/problem';
import { useUnitsForDomain } from '../hooks/useProblems';
import { useProgress } from '../state/progress';
import { LESSONS, getLesson, lessonKey } from '../data/lessons';

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
          const col = v < 0 ? '#223052' : v >= 80 ? '#7CFF9B' : v >= 50 ? '#FFC94D' : '#FF7A6B';
          return (
            <span key={i} className="block w-[4px]"
              style={{ height: h, background: col, outline: last ? '1px solid #5EE7FF' : undefined, outlineOffset: 1 }} />
          );
        })}
      </div>
      <div className="mt-[3px] text-right font-mono text-[8px] tracking-wider text-[#8FA0C4]">
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
    <div className="mx-auto max-w-[480px] rounded-xl bg-[#0A0F1E] p-3 pb-6 text-[#E9EFFF]"
      style={{
        backgroundImage:
          'radial-gradient(1px 1px at 12% 22%, #ffffffcc 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 78% 8%, #ffffff88 50%, transparent 51%),' +
          'radial-gradient(1.5px 1.5px at 55% 45%, #9fd8ff99 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 30% 70%, #ffffff77 50%, transparent 51%),' +
          'radial-gradient(1.5px 1.5px at 8% 88%, #ffd27f88 50%, transparent 51%),' +
          'radial-gradient(1px 1px at 88% 60%, #ffffffaa 50%, transparent 51%)',
      }}>
      {/* ── telemetry strip: exact numbers first ── */}
      <div className="border border-[#223052] bg-gradient-to-b from-[#101A31] to-[#0D1527] px-3.5 py-3"
        style={{ clipPath: CUT }}>
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-[12px] font-display font-black uppercase tracking-[0.22em] text-[#5EE7FF]">
            ⟡ Mission Control
          </div>
          <Link to="/" className="font-mono text-[10px] tracking-wider text-[#8FA0C4] hover:text-[#5EE7FF]">
            ← ALL SECTORS
          </Link>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {[
            { v: xp.toLocaleString(), l: 'Total XP', c: '#5EE7FF' },
            { v: `${lessonsDone}/${lessonsTotal}`, l: 'Lessons', c: '#7CFF9B' },
            { v: `${accuracy}%`, l: 'Accuracy', c: '#FFC94D' },
            { v: `${dailyStreak}d`, l: 'Streak', c: '#E9EFFF' },
          ].map((s) => (
            <div key={s.l} className="border-l-2 border-[#223052] pl-2">
              <b className="block font-mono text-[18px] leading-tight tabular-nums" style={{ color: s.c }}>{s.v}</b>
              <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#8FA0C4]">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── the sector panel ── */}
      <div className="relative mt-3 border border-[#223052] bg-gradient-to-b from-[#101A31] to-[#0D1527] px-3 py-3"
        style={{ clipPath: CUT_BIG }}>
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="grid h-8 w-8 flex-none place-items-center font-mono text-[11px] font-bold text-[#0A0F1E]"
            style={{ clipPath: 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)', background: DOMAIN_COLORS[d] }}>
            {d.replace('6.', '').replace('5.', '')}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-display font-black uppercase tracking-[0.16em]">Sector {d}</div>
            <div className="truncate font-mono text-[10px] text-[#8FA0C4]">
              {DOMAIN_LABELS[d]} · {units?.length ?? 0} units
            </div>
          </div>
          <div className="ml-auto text-right">
            <b className="font-mono text-[16px] tabular-nums text-[#FFC94D]">{sectorAvg == null ? '—' : `${sectorAvg}%`}</b>
            <span className="block text-[8px] font-bold uppercase tracking-[0.14em] text-[#8FA0C4]">sector avg</span>
          </div>
        </div>

        {loading && <div className="py-10 text-center font-mono text-sm text-[#8FA0C4]">SCANNING SECTOR…</div>}
        {error && <div className="py-6 text-center font-mono text-xs text-[#FF7A6B]">{error.message}</div>}

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
          const nodeBg = mastered ? '#7CFF9B' : started ? '#5EE7FF' : '#3A4763';

          return (
            <Link key={u} to={`/unit/${d}/${u}`}
              className="mt-1.5 grid grid-cols-[34px_1fr_auto] items-center gap-2.5 border border-[#223052] bg-[#0B1226]/80 px-2 py-2 no-underline transition-colors hover:border-[#5EE7FF]"
              style={{ clipPath: CUT }} data-haptic="tap">
              <div className="grid h-[30px] w-[30px] place-items-center font-mono text-[13px] font-bold text-[#0A0F1E]"
                style={{ clipPath: NODE_CLIP, background: nodeBg, boxShadow: started && !mastered ? '0 0 12px #5ee7ff66' : undefined }}>
                {u}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12.5px] font-display font-extrabold text-[#E9EFFF]">
                  {lesson?.title ?? `Unit ${u}`}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold tabular-nums"
                    style={{ color: latest == null ? '#8FA0C4' : '#FFC94D' }}>
                    {latest == null ? '—' : `${latest}%`}
                  </span>
                  <span className="text-[10px] tracking-[0.1em] text-[#FFC94D]">
                    {'★'.repeat(stars)}<span className="text-[#3A4763]">{'★'.repeat(3 - stars)}</span>
                  </span>
                </div>
                {/* lesson-step sequence: strict order, locked greyed until reached */}
                <div className="mt-1 flex gap-1">
                  {steps.map((st, i) => (
                    <span key={i}
                      className="grid h-[13px] w-[13px] place-items-center border text-[8px] font-black"
                      style={
                        st.state === 'done'
                          ? { background: '#7CFF9B', borderColor: '#7CFF9B', color: '#0A0F1E' }
                          : st.state === 'cur'
                            ? { borderColor: '#5EE7FF', color: '#5EE7FF', background: '#5ee7ff22' }
                            : { borderColor: '#3A4763', color: '#3A4763', background: '#ffffff06' }
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

      <div className="mt-3 text-center font-mono text-[10px] tracking-wider text-[#8FA0C4]">
        UNITS: JUMP TO ANY · STEPS: L LESSON → P PRACTICE → Q QUIZ → M MASTERY
      </div>
    </div>
  );
}
