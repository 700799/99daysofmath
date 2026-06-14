// Account card shown at the top of Settings. Three states:
//  - signed in            → avatar + name + email + Sign out + "Synced"
//  - signed out, available → Sign in with Google
//  - unavailable           → friendly note (graceful fallback surface)
import { useAuth, displayNameFor } from '../state/auth';

export function AccountCard() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const available = useAuth((s) => s.available);
  const error = useAuth((s) => s.error);
  const signIn = useAuth((s) => s.signInWithGoogle);
  const signOut = useAuth((s) => s.signOutUser);

  // Signed in
  if (user) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Avatar user={user} size={48} />
          <div className="min-w-0 flex-1">
            <div className="font-display font-extrabold text-slate-900 truncate">
              {user.name || displayNameFor(user)}
            </div>
            {user.email && (
              <div className="text-sm text-slate-500 truncate">{user.email}</div>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-display font-extrabold text-duo-green shrink-0">
            ✓ Synced
          </span>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-4 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold min-h-11"
        >
          Sign out
        </button>
      </div>
    );
  }

  // Signed out, Firebase not configured → fallback note, no button
  if (!available) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="font-display font-extrabold text-slate-900">Your account</div>
        <div className="text-sm text-slate-600 mt-1">
          Sign-in is unavailable right now — your progress is saved on this device.
        </div>
      </div>
    );
  }

  // Signed out, available → sign-in button
  const signingIn = status === 'signing-in';
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
      <div className="font-display font-extrabold text-slate-900">Save your progress</div>
      <div className="text-sm text-slate-600 mt-1">
        Sign in to sync your stars, XP, and streaks across devices. Not now? Keep playing as Math-Friend.
      </div>
      <button
        type="button"
        onClick={() => void signIn()}
        disabled={signingIn}
        className="mt-3 inline-flex items-center gap-3 pl-1.5 pr-5 py-1.5 rounded-full bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-display font-extrabold min-h-12 disabled:opacity-60"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white">
          <GoogleG />
        </span>
        {signingIn ? 'Signing in…' : 'Sign in with Google'}
      </button>
      {error && <div className="mt-2 text-sm text-slate-500">{error}</div>}
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
        className="rounded-full object-cover bg-slate-100 shrink-0"
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
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.34l2.58-2.58A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
