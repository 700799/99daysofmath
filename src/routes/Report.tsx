import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Problem } from '../types/problem';
import { useProgress } from '../state/progress';
import { getAllProblems } from '../data/problems';
import { skillBreakdown, recommendedFocus } from '../utils/mastery';
import { SkillBar } from '../components/SkillBar';
import { RitTrend } from '../components/RitTrend';
import { Mascot } from '../components/Mascot';

export function Report() {
  const problemStats = useProgress((s) => s.problemStats);
  const dailyStreak = useProgress((s) => s.dailyStreak);
  const bestDailyStreak = useProgress((s) => s.bestDailyStreak);
  const mockTestsCompleted = useProgress((s) => s.mockTestsCompleted);
  const bestMockAccuracy = useProgress((s) => s.bestMockAccuracy);
  const totalStars = useProgress((s) => s.totalStars());

  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await getAllProblems();
        if (!cancelled) setProblems(all);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="bg-bad-soft border-2 border-bad/40 rounded-2xl p-4 text-bad">
        Couldn't build report: {error.message}
      </div>
    );
  }
  if (!problems) {
    return (
      <div className="text-center py-12">
        <Mascot mood="thinking" size={80} />
        <div className="mt-3 text-ink-muted font-display font-bold">Building your report…</div>
      </div>
    );
  }

  const { byCluster, byDomain } = skillBreakdown(problemStats, problems);
  const focus = recommendedFocus(byCluster);
  const totalAttempts = Object.values(problemStats).reduce((n, s) => n + s.attempts, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-display font-extrabold text-ink">
          Progress report
        </h1>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print shrink-0 min-h-11 px-4 rounded-full bg-surface-2 hover:bg-surface-2 text-ink-muted font-display font-extrabold text-sm transition-colors"
        >
          🖨 Print
        </button>
      </div>
      <p className="text-sm text-ink-muted -mt-3">
        Strengths &amp; growth areas for 6th-grade math (NWEA MAP prep).
      </p>

      {totalAttempts === 0 ? (
        <div className="bg-surface border-2 border-line rounded-3xl p-8 text-center">
          <Mascot mood="happy" size={96} />
          <div className="font-display font-extrabold text-ink mt-3">
            No practice logged yet
          </div>
          <p className="text-sm text-ink-muted mt-1">
            Answer some problems and your strengths &amp; growth areas will show up here.
          </p>
          <Link
            to="/practice"
            className="mt-5 inline-block min-h-12 px-6 py-3 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
          >
            Start practicing
          </Link>
        </div>
      ) : (
        <>
          <RitTrend />

          {focus && (
            <div className="rounded-3xl border-2 border-warn/40 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
              <div className="text-xs font-display font-extrabold uppercase tracking-wider text-warn">
                Focus next
              </div>
              <div className="font-display font-extrabold text-lg text-ink mt-0.5">
                {focus.label}
              </div>
              <div className="text-sm text-ink-muted mt-0.5">
                {Math.round(focus.accuracy * 100)}% correct so far — the best place to grow.
              </div>
              <Link
                to="/practice"
                className="no-print mt-3 inline-block min-h-11 px-5 py-2 rounded-full bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold text-sm transition-colors"
              >
                Practice now
              </Link>
            </div>
          )}

          <section className="bg-surface border-2 border-line rounded-3xl p-5">
            <h2 className="font-display font-extrabold text-ink mb-3">By topic area</h2>
            <div className="space-y-3">
              {byDomain.map((s) => (
                <SkillBar key={s.key} stat={s} />
              ))}
            </div>
          </section>

          <section className="bg-surface border-2 border-line rounded-3xl p-5">
            <h2 className="font-display font-extrabold text-ink mb-1">Skill detail</h2>
            <p className="text-xs text-ink-muted mb-3">
              Each skill needs 3+ answers before it's scored.
            </p>
            <div className="space-y-3">
              {byCluster.map((s) => (
                <SkillBar key={s.key} stat={s} />
              ))}
            </div>
          </section>

          <section className="bg-surface border-2 border-line rounded-3xl p-5">
            <h2 className="font-display font-extrabold text-ink mb-3">Habits</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Current daily streak" value={`${dailyStreak} 🔥`} />
              <Stat label="Best daily streak" value={`${bestDailyStreak}`} />
              <Stat label="Stars earned" value={`${totalStars} ⭐`} />
              <Stat label="Mock tests taken" value={`${mockTestsCompleted}`} />
              <Stat
                label="Best mock score"
                value={mockTestsCompleted > 0 ? `${Math.round(bestMockAccuracy * 100)}%` : '—'}
              />
              <Stat label="Problems answered" value={`${totalAttempts}`} />
            </dl>
          </section>
        </>
      )}

      <Link
        to="/"
        className="no-print inline-block text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
      >
        ← Back home
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 px-3 py-2 border border-line">
      <div className="text-[10px] font-display font-bold uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div className="font-display font-extrabold text-ink text-base mt-0.5">
        {value}
      </div>
    </div>
  );
}
