// Account card shown at the top of Settings. Three states:
//  - signed in            → avatar + name + email + Sign out + "Synced"
//  - signed out, available → Sign in (Clerk's dialog; providers set there)
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
      <button
        type="button"
        onClick={signIn}
        disabled={signingIn}
        className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent hover:bg-accent-hover text-on-accent font-display font-extrabold min-h-12 disabled:opacity-60"
      >
        🧑‍🚀 {signingIn ? 'Signing in…' : 'Sign in or create an account'}
      </button>
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
