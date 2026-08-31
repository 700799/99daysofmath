import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TIP_CATEGORIES, TIPS_BY_CATEGORY, TOTAL_SAT_TIPS, type TipCategory } from '../../data/sat/tips';
import { MathText } from '../../components/MathText';
import { useProgress } from '../../state/progress';
import { useSeo, breadcrumbJsonLd } from '../../lib/seo';

// ── /sat/tips — the strategy library ───────────────────────────────────────
// Grouped so a student can read one category before a drill rather than
// swallowing a hundred tips at once. Read state persists, so the list doubles
// as a checklist in the week before test day.

export function SatTips() {
  useSeo({
    title: 'SAT Math Strategy Tips — Pacing, Desmos, and Traps | Math10x',
    description:
      'Over 100 Digital SAT Math strategies: module timing, the built-in Desmos calculator, student-produced answer rules, backsolving, and the traps behind each content area.',
    canonicalPath: '/sat/tips',
    jsonLd: breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'SAT Math', path: '/sat' },
      { name: 'Strategy tips', path: '/sat/tips' },
    ]),
  });

  const [open, setOpen] = useState<TipCategory | null>('format');
  const read = useProgress((s) => s.satTipsRead ?? []);
  const toggleRead = useProgress((s) => s.toggleSatTipRead);

  return (
    <div>
      <div className="rounded-3xl border-2 border-line bg-surface p-5">
        <h1 className="font-display text-2xl font-extrabold text-ink">🧠 Strategy library</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {TOTAL_SAT_TIPS} tips across {TIP_CATEGORIES.length} categories. Every one is a decision rule —
          the situation that triggers it and the move to make — not a platitude.
        </p>
        <div className="mt-3 font-mono text-[11px] tabular-nums text-ink-dim">
          {read.length} of {TOTAL_SAT_TIPS} marked read
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(read.length / TOTAL_SAT_TIPS) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {TIP_CATEGORIES.map((cat) => {
          const tips = TIPS_BY_CATEGORY[cat.key];
          const isOpen = open === cat.key;
          const readCount = tips.filter((t) => read.includes(t.id)).length;
          return (
            <div key={cat.key} className="overflow-hidden rounded-3xl border-2 border-line bg-surface">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : cat.key)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-2"
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-extrabold text-ink">{cat.name}</span>
                  <span className="block text-[11px] text-ink-muted">{cat.blurb}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-dim">
                  {readCount}/{tips.length}
                </span>
                <span className={`shrink-0 text-ink-dim transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
              </button>

              {isOpen && (
                <div className="border-t border-line px-4 pb-4 pt-3">
                  <div className="space-y-2.5">
                    {tips.map((t) => {
                      const isRead = read.includes(t.id);
                      return (
                        <div
                          key={t.id}
                          className={`rounded-2xl border p-3 transition-colors ${
                            isRead ? 'border-ok/40 bg-ok-soft' : 'border-line bg-surface-2'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <button
                              type="button"
                              onClick={() => toggleRead(t.id)}
                              aria-pressed={isRead}
                              aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
                              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 text-[11px] font-black transition-colors ${
                                isRead ? 'border-ok bg-ok text-surface' : 'border-line-strong text-transparent hover:border-accent'
                              }`}
                            >
                              ✓
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="font-display text-[13px] font-extrabold text-ink">{t.title}</div>
                              <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                                <MathText text={t.body} />
                              </p>
                              {t.example && (
                                <pre className="mt-2 overflow-x-auto whitespace-pre rounded-xl bg-surface p-2.5 font-mono text-[11.5px] leading-relaxed text-ink-muted">
                                  {t.example}
                                </pre>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Link to="/sat" className="mt-6 inline-block font-display text-sm font-bold text-ink-muted hover:text-ink">
        ← Back to SAT Math
      </Link>
    </div>
  );
}
