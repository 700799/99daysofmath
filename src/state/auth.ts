// Auth store. Holds the signed-in user (or null for anonymous "Math-Friend").
// Firebase persists the session itself; we mirror it here via onAuthStateChanged
// (wired in AuthBootstrap). Every Firebase call is guarded so failures degrade to
// anonymous mode rather than breaking the app.
import { create } from 'zustand';
import { firebaseConfigured, getFirebase } from '../lib/firebase';
import { stopSync } from './sync';

export interface AuthUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

type Status = 'anonymous' | 'signing-in' | 'signed-in' | 'error';

interface AuthState {
  user: AuthUser | null;
  status: Status;
  /** Whether sign-in is even offered (Firebase config present). */
  available: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  /** Internal: called by AuthBootstrap's onAuthStateChanged listener. */
  _setUser: (user: AuthUser | null) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  status: 'anonymous',
  available: firebaseConfigured,
  error: null,

  signInWithGoogle: async () => {
    if (!firebaseConfigured) {
      set({ error: 'Sign-in is unavailable right now.' });
      return;
    }
    set({ status: 'signing-in', error: null });
    try {
      const fb = await getFirebase();
      if (!fb) {
        set({ status: 'error', error: 'Sign-in is unavailable right now — your progress is saved on this device.' });
        return;
      }
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(fb.auth, new GoogleAuthProvider());
      // onAuthStateChanged (AuthBootstrap) sets the user and kicks off sync.
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      const canceled = code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request';
      console.warn('[auth] sign-in failed', err);
      set({
        status: get().user ? 'signed-in' : 'error',
        error: canceled
          ? 'Sign-in canceled — you can keep playing as Math-Friend.'
          : "Couldn't sign in — you can keep playing as Math-Friend.",
      });
    }
  },

  signOutUser: async () => {
    try {
      const fb = await getFirebase();
      if (fb) {
        const { signOut } = await import('firebase/auth');
        await signOut(fb.auth);
      }
    } catch (err) {
      console.warn('[auth] sign-out failed', err);
    }
    stopSync();
    set({ user: null, status: 'anonymous', error: null });
  },

  _setUser: (user) =>
    set((s) => ({ user, status: user ? 'signed-in' : 'anonymous', error: user ? null : s.error })),
}));

/** First name when signed in, else the default "Math-Friend". */
export function displayNameFor(user: AuthUser | null): string {
  const first = user?.name?.trim().split(/\s+/)[0];
  return first || 'Math-Friend';
}

/** Reactive display name for greetings. */
export function useDisplayName(): string {
  return useAuth((s) => displayNameFor(s.user));
}
