// Mirrors the Clerk session into the auth store and drives cloud sync.
// Renders nothing. Must sit inside <ClerkProvider> (AuthProvider does that);
// when Clerk isn't configured it is never mounted, so the app simply runs
// anonymously as "Math-Friend".
import { useEffect } from 'react';
import { useAuth as useClerkAuth, useClerk, useSignIn, useUser } from '@clerk/clerk-react';
import { useAuth } from '../state/auth';
import { startSync, stopSync } from '../state/sync';

/**
 * Clerk's Firebase integration mints a Firebase custom token from a JWT
 * template of this name, so the same user can read and write their own
 * Firestore document. Without the template the token is null and progress
 * stays on the device — sign-in itself is unaffected.
 */
const FIREBASE_TEMPLATE = 'integration_firebase';

/** Where Google sends the browser back; the route finishes the sign-in. */
export const SSO_CALLBACK_PATH = '/sso-callback';

export function AuthBootstrap() {
  const clerk = useClerk();
  const { getToken } = useClerkAuth();
  const { signIn } = useSignIn();
  const { isLoaded, isSignedIn, user } = useUser();

  // Hand the store the provider's actions for as long as we are mounted.
  useEffect(() => {
    useAuth.getState()._bind({
      // A redirect, not a popup: popups never come back to a home-screen app.
      // A Google account with no user yet is carried over to sign-up by the
      // callback route.
      signInWithGoogle: async () => {
        if (!signIn) throw new Error('Clerk has not loaded yet');
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: SSO_CALLBACK_PATH,
          redirectUrlComplete: '/settings',
        });
      },
      openSignIn: () => clerk.openSignIn({}),
      signOut: () => clerk.signOut(),
    });
    return () => useAuth.getState()._bind(null);
  }, [clerk, signIn]);

  // Mirror the session. Only identity fields are read; keyed on the user id so
  // a profile edit doesn't restart sync.
  const uid = isSignedIn && user ? user.id : null;
  const name = user?.fullName || user?.firstName || user?.username || null;
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const photoURL = user?.imageUrl ?? null;
  useEffect(() => {
    if (!isLoaded) return;
    if (uid) {
      useAuth.getState()._setUser({ uid, name, email, photoURL });
      void startSync(uid, async () => {
        try {
          return await getToken({ template: FIREBASE_TEMPLATE });
        } catch (err) {
          console.warn('[sync] no Firebase token from Clerk; progress stays on this device', err);
          return null;
        }
      });
    } else {
      useAuth.getState()._setUser(null);
      stopSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, uid]);

  return null;
}
