import { useParams, Link, Navigate } from 'react-router-dom';
import { DOMAINS, DOMAIN_LABELS, DOMAIN_EMOJI, DOMAIN_COLORS, type Domain } from '../types/problem';
import { useUnitsForDomain } from '../hooks/useProblems';
import { TrailMount } from '../components/TrailMount';
import { useProgress } from '../state/progress';

export function DomainTrail() {
  const { domain } = useParams<{ domain: string }>();
  if (!domain || !DOMAINS.includes(domain as Domain)) {
    return <Navigate to="/" replace />;
  }
  const d = domain as Domain;
  const { data: units, loading, error } = useUnitsForDomain(d);
  const dp = useProgress((s) => s.byDomain[d]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="text-4xl shrink-0">{DOMAIN_EMOJI[d]}</div>
        <div className="min-w-0">
          <div className="text-xs font-display font-extrabold uppercase tracking-wider" style={{ color: DOMAIN_COLORS[d] }}>
            {d}
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 truncate">
            {DOMAIN_LABELS[d]}
          </h1>
        </div>
      </div>

      {loading && (
        <div className="text-slate-500 text-center py-12 font-display font-bold">
          Loading trail…
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-800">
          {error.message}
        </div>
      )}
      {!loading && !error && units && units.length === 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-center text-amber-900">
          No problems in this domain yet. Check back soon!
        </div>
      )}

      {units && units.length > 0 && (
        <>
          <TrailMount domain={d} units={units} />
          <div className="mt-5">
            <div className="text-xs font-display font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
              Tap a node on the trail, or jump to a unit:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {units.map((u) => {
                const unlocked = true; // open trails — later units just pay bigger bonuses
                const stars = dp?.unitStars[u] ?? 0;
                return (
                  <Link
                    key={u}
                    to={unlocked ? `/unit/${d}/${u}` : '#'}
                    aria-disabled={!unlocked}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-2 min-h-11 border-2 font-display font-extrabold text-sm transition-all',
                      unlocked
                        ? 'bg-white border-slate-200 hover:border-duo-blue hover:shadow-sm text-slate-900'
                        : 'bg-slate-100 border-slate-200 text-slate-400 pointer-events-none',
                    ].join(' ')}
                  >
                    {`Unit ${u}`}
                    {stars > 0 && (
                      <span className="text-amber-600">
                        {'★'.repeat(stars)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
