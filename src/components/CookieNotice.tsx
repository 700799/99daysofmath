import { Link } from 'react-router-dom';
import { useConsent } from '../state/consent';

/**
 * The cookie notice, shown until the visitor answers it. Essential cookies
 * (sign-in, remembering this choice) need no permission; advertising cookies
 * are set only on the high-school course pages, and only after "Allow ads".
 */
export function CookieNotice() {
  const choice = useConsent((s) => s.choice);
  const allowAll = useConsent((s) => s.allowAll);
  const essentialOnly = useConsent((s) => s.essentialOnly);
  if (choice !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border-2 border-line bg-surface p-4 shadow-xl">
        <div className="font-display font-extrabold text-ink">🍪 Cookies on Math10x</div>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          Essential cookies keep you signed in and remember your settings. On the Trigonometry,
          Precalculus and SAT Math pages we also show ads from Google, which set cookies if you
          allow them. No ads appear anywhere else.{' '}
          <Link to="/privacy" className="font-bold text-accent underline">
            Privacy &amp; cookies
          </Link>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={allowAll}
            className="min-h-11 rounded-xl bg-duo-green px-4 font-display text-sm font-extrabold text-white hover:bg-duo-green-dark active:translate-y-0.5"
            data-haptic="tap"
          >
            Allow ads
          </button>
          <button
            type="button"
            onClick={essentialOnly}
            className="min-h-11 rounded-xl border-2 border-line bg-surface-2 px-4 font-display text-sm font-extrabold text-ink hover:border-accent/50"
            data-haptic="tap"
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}
