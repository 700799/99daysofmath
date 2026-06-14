// Lazy, fail-safe Firebase initializer.
//
// The app works fully anonymously ("Math-Friend") without Firebase. Sign-in and
// cloud sync are *additive*: everything here degrades silently when Firebase is
// not configured, the SDK fails to load, or the network is blocked.
//
// `firebaseConfigured` is a synchronous flag (used by the UI to decide whether to
// even offer sign-in). `getFirebase()` lazily code-splits the SDK and returns
// null on any failure — callers must handle null and carry on anonymously.
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
};

/** True when all required config keys are present. Safe to read synchronously. */
export const firebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

export interface FirebaseHandles {
  auth: Auth;
  db: Firestore;
}

let cached: Promise<FirebaseHandles | null> | null = null;

/**
 * Lazily initialize Firebase (code-split so its weight stays off the critical
 * path). Returns null if unconfigured or if anything fails — never throws.
 */
export function getFirebase(): Promise<FirebaseHandles | null> {
  if (!firebaseConfigured) return Promise.resolve(null);
  if (!cached) {
    cached = (async () => {
      try {
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getAuth } = await import('firebase/auth');
        const { getFirestore } = await import('firebase/firestore');
        const app = getApps().length ? getApp() : initializeApp(config);
        return { auth: getAuth(app), db: getFirestore(app) };
      } catch (err) {
        console.warn('[firebase] initialization failed; continuing anonymously', err);
        return null;
      }
    })();
  }
  return cached;
}
