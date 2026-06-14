// Wires Firebase Auth session state into the auth store and drives cloud sync.
// Renders nothing. When Firebase isn't configured it's a complete no-op, so the
// app simply runs anonymously as "Math-Friend".
import { useEffect } from 'react';
import { firebaseConfigured, getFirebase } from '../lib/firebase';
import { useAuth } from '../state/auth';
import { startSync, stopSync } from '../state/sync';

export function AuthBootstrap() {
  useEffect(() => {
    if (!firebaseConfigured) return;
    let cancelled = false;
    let unsubscribe: () => void = () => {};

    (async () => {
      const fb = await getFirebase();
      if (!fb || cancelled) return;
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        unsubscribe = onAuthStateChanged(fb.auth, (u) => {
          if (u) {
            useAuth.getState()._setUser({
              uid: u.uid,
              name: u.displayName,
              email: u.email,
              photoURL: u.photoURL,
            });
            void startSync(u.uid);
          } else {
            useAuth.getState()._setUser(null);
            stopSync();
          }
        });
      } catch (err) {
        console.warn('[auth] could not attach auth listener; staying anonymous', err);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return null;
}
