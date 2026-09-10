import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourse, courseHref, type Course as CourseType } from '../data/courses';
import { DOMAIN_COLORS, DOMAIN_DESCRIPTIONS, DOMAIN_EMOJI, type Domain } from '../types/problem';
import { useProgress } from '../state/progress';
import { useDomainSummary } from '../hooks/useProblems';
import { useSeo, courseJsonLd, breadcrumbJsonLd, SITE_URL } from '../lib/seo';

// ── /course/:id — a course made of more than one strand ────────────────────
// Single-strand courses go straight to their trail; this page exists for the
// ones that gather several, so "6th Grade Common Core" is one thing a student
// picks rather than five, and Geometry can run from its 6th-grade foundations
// into the high-school material without becoming two separate sections.

function StrandCard({
  domain,
  label,
  index,
  counts,
}: {
  domain: Domain;
  label: string;
  index: number;
  counts?: { count: number; units: number };
}) {
  const stars = useProgress((s) => {
    const dp = s.byDomain[domain];
    return dp ? Object.values(dp.unitStars).reduce<number>((a, b) => a + (b as number), 0) : 0;
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/trail/${domain}`}
        className="block rounded-3xl border-2 border-line bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        style={{ borderLeftWidth: 8, borderLeftColor: DOMAIN_COLORS[domain] }}
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl sm:text-4xl">{DOMAIN_EMOJI[domain]}</div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-[15px] font-extrabold text-ink">{label}</div>
            <div className="mt-1 text-[13px] leading-relaxed text-ink-muted">
              {DOMAIN_DESCRIPTIONS[domain]}
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-ink-dim">
              {counts
                ? `${counts.count} problems · ${counts.units} unit${counts.units === 1 ? '' : 's'}`
                : 'Coming soon'}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1 rounded-full bg-warn-soft px-2.5 py-1">
              <span aria-hidden="true">⭐</span>
              <span className="font-display text-sm font-extrabold tabular-nums text-warn">{stars}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function Course() {
  const { id } = useParams<{ id: string }>();
  const course = getCourse(id ?? '');
  const { data: summary } = useDomainSummary();

  useSeo({
    title: course ? `${course.name} — Free Practice and Lessons | Math10x` : 'Math10x',
    description: course?.blurb ?? 'Free math practice on Math10x.',
    canonicalPath: `/course/${id}`,
    jsonLd: course
      ? [
          courseJsonLd(course.name, course.blurb, `${SITE_URL}/course/${course.id}`),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: course.name, path: `/course/${course.id}` },
          ]),
        ]
      : undefined,
  });

  if (!course) return <Navigate to="/" replace />;
  // A course with one strand has nothing extra to show — send it to the trail.
  const href = courseHref(course as CourseType);
  if (href !== `/course/${course.id}`) return <Navigate to={href} replace />;

  const totals = summary
    ? course.strands.reduce(
        (acc, s) => {
          const row = summary.find((x) => x.domain === s.domain);
          return row ? { count: acc.count + row.count, units: acc.units + row.units } : acc;
        },
        { count: 0, units: 0 },
      )
    : null;

  return (
    <div>
      <div
        className="rounded-3xl border-2 border-line bg-surface p-5"
        style={{ borderLeftWidth: 10, borderLeftColor: course.color }}
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl sm:text-5xl">{course.emoji}</div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold text-ink">{course.name}</h1>
            <div className="mt-0.5 font-display text-xs font-bold uppercase tracking-wider text-ink-muted">
              {course.kicker}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{course.blurb}</p>
            {totals && totals.count > 0 && (
              <div className="mt-2 font-mono text-[11px] text-ink-dim">
                {totals.count} problems · {totals.units} units · {course.strands.length} strands
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-2 mt-6 text-xs font-display font-extrabold uppercase tracking-wider text-ink-muted">
        📚 Strands
      </div>
      <div className="space-y-3">
        {course.strands.map((s, i) => (
          <StrandCard
            key={s.domain}
            domain={s.domain}
            label={s.label}
            index={i}
            counts={summary?.find((x) => x.domain === s.domain)}
          />
        ))}
      </div>

      <Link to="/" className="mt-6 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink">
        ← Back home
      </Link>
    </div>
  );
}
