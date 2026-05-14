import { useParams, Link, Navigate } from 'react-router-dom';
import { DOMAINS, DOMAIN_LABELS, DOMAIN_EMOJI, type Domain } from '../types/problem';
import { useUnitsForDomain } from '../hooks/useProblems';
import { TrailMount } from '../components/TrailMount';
import { useProgress } from '../state/progress';
import { StarRating } from '../components/StarRating';

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
      <div className="mb-4">
        <div className="text-xs font-display font-bold text-slate-500 uppercase tracking-wider">
          {d}
        </div>
        <h1 className="text-2xl font-display font-extrabold text-slate-900 flex items-center gap-2">
          <span>{DOMAIN_EMOJI[d]}</span>
          <span>{DOMAIN_LABELS[d]}</span>
        </h1>
      </div>

      {loading && (
        <div className="text-slate-500 text-center py-12">Loading trail…</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800">
          {error.message}
        </div>
      )}
      {!loading && !error && units && units.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-900">
          No problems in this domain yet. Check back soon!
        </div>
      )}

      {units && units.length > 0 && (
        <>
          <TrailMount domain={d} units={units} />
          <div className="mt-6 space-y-2">
            <div className="text-sm font-display font-bold text-slate-700">
              Units
            </div>
            {units.map((u) => {
              const unlocked = u <= (dp?.unitsUnlocked ?? 1);
              const stars = (dp?.unitStars[u] ?? 0) as 0 | 1 | 2 | 3;
              return (
                <Link
                  key={u}
                  to={unlocked ? `/unit/${d}/${u}` : '#'}
                  className={[
                    'flex items-center justify-between rounded-2xl px-4 py-3 border-2 min-h-14',
                    unlocked
                      ? 'bg-white border-slate-200 hover:border-duo-blue'
                      : 'bg-slate-100 border-slate-200 opacity-60 pointer-events-none',
                  ].join(' ')}
                >
                  <div className="font-display font-bold text-slate-900">
                    {unlocked ? `Unit ${u}` : `🔒 Unit ${u}`}
                  </div>
                  <StarRating stars={stars} size="sm" />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
