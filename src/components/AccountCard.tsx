// Account card shown at the top of Settings. Three states:
//  - signed in            → avatar + name + email + Sign out + "Synced"
//  - signed out, available → Continue with Google · Continue with email
//  - unavailable           → friendly note (graceful fallback surface)
import { useAuth, displayNameFor } from '../state/auth';

export function AccountCard() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const available = useAuth((s) => s.available);
  const error = useAuth((s) => s.error);
  const signIn = useAuth((s) => s.signIn);
  const signOut = useAuth((s) => s.signOutUser);

  // Signed in
  if (user) {
    return (
      <div className="bg-surface border-2 border-line rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Avatar user={user} size={48} />
          <div className="min-w-0 flex-1">
            <div className="font-display font-extrabold text-ink truncate">
              {user.name || displayNameFor(user)}
            </div>
            {user.email && (
              <div className="text-sm text-ink-muted truncate">{user.email}</div>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-display font-extrabold text-duo-green shrink-0">
            ✓ Synced
          </span>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-4 px-4 py-2 rounded-full bg-surface-2 hover:bg-surface-2 text-ink-muted font-display font-bold min-h-11"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Signed out, Clerk not configured → fallback note, no button
  if (!available) {
    return (
      <div className="bg-surface border-2 border-line rounded-2xl p-5">
        <div className="font-display font-extrabold text-ink">Your account</div>
        <div className="text-sm text-ink-muted mt-1">
          Sign-in is unavailable right now — your progress is saved on this device.
        </div>
      </div>
    );
  }

  // Signed out, available → sign-in button
  const signingIn = status === 'signing-in';
  return (
    <div className="bg-surface border-2 border-line rounded-2xl p-5">
      <div className="font-display font-extrabold text-ink">Save your progress</div>
      <div className="text-sm text-ink-muted mt-1">
        Sign in to sync your stars, XP, and streaks across devices. Not now? Keep playing as Math-Friend.
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => signIn('google')}
          disabled={signingIn}
          className="inline-flex items-center justify-center gap-3 pl-2 pr-5 py-1.5 rounded-full bg-surface border-2 border-line hover:bg-surface-2 text-ink font-display font-extrabold min-h-12 disabled:opacity-60"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white">
            <GoogleG />
          </span>
          {signingIn ? 'Signing in…' : 'Continue with Google'}
        </button>
        <button
          type="button"
          onClick={() => signIn('email')}
          disabled={signingIn}
          className="inline-flex items-center justify-center gap-2 px-5 py-1.5 rounded-full bg-accent hover:bg-accent-hover text-on-accent font-display font-extrabold min-h-12 disabled:opacity-60"
        >
          ✉️ Continue with email
        </button>
      </div>
      <div className="mt-2 text-xs text-ink-muted">New here? Either one creates your account.</div>
      {error && <div className="mt-2 text-sm text-ink-muted">{error}</div>}
    </div>
  );
}

export function Avatar({
  user,
  size,
}: {
  user: { name: string | null; email: string | null; photoURL: string | null };
  size: number;
}) {
  const initial = (user.name || user.email || 'M').trim().charAt(0).toUpperCase();
  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className="rounded-full object-cover bg-surface-2 shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-duo-green text-white font-display font-extrabold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.34l2.58-2.58A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}
