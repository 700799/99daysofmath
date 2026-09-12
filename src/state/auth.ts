// Auth store. Holds the signed-in user (or null for anonymous "Math-Friend").
// Clerk owns the session; AuthBootstrap mirrors it into this store and binds
// the sign-in / sign-out actions, so the rest of the app never imports Clerk
// and keeps working — anonymously — when it is not configured.
import { create } from 'zustand';
import { clerkConfigured } from '../lib/clerk';

export interface AuthUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

type Status = 'anonymous' | 'signing-in' | 'signed-in' | 'error';

/** What the provider wires in once it has loaded. */
export interface AuthActions {
  openSignIn: () => void;
  signOut: () => Promise<void>;
}

interface AuthState {
  user: AuthUser | null;
  status: Status;
  /** Whether sign-in is even offered (Clerk key present). */
  available: boolean;
  error: string | null;
  signIn: () => void;
  signOutUser: () => Promise<void>;
  /** Internal: AuthBootstrap hands over the provider's actions. */
  _bind: (actions: AuthActions | null) => void;
  /** Internal: AuthBootstrap mirrors the provider's user here. */
  _setUser: (user: AuthUser | null) => void;
}

const UNAVAILABLE = 'Sign-in is unavailable right now — your progress is saved on this device.';

let bound: AuthActions | null = null;

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  status: 'anonymous',
  available: clerkConfigured,
  error: null,

  signIn: () => {
    if (!get().available || !bound) {
      set({ status: get().user ? 'signed-in' : 'error', error: UNAVAILABLE });
      return;
    }
    set({ status: 'signing-in', error: null });
    try {
      bound.openSignIn();
      // AuthBootstrap sets the user once the session exists. If the dialog is
      // simply closed, the mirror leaves us anonymous and we settle below.
    } catch (err) {
      console.warn('[auth] sign-in failed', err);
      set({ status: get().user ? 'signed-in' : 'error', error: "Couldn't sign in — you can keep playing as Math-Friend." });
    }
  },

  signOutUser: async () => {
    try {
      await bound?.signOut();
    } catch (err) {
      console.warn('[auth] sign-out failed', err);
    }
    // The provider's user mirror clears the store; this makes it immediate.
    set({ user: null, status: 'anonymous', error: null });
  },

  _bind: (actions) => {
    bound = actions;
  },

  _setUser: (user) =>
    set((s) => ({
      user,
      status: user ? 'signed-in' : 'anonymous',
      error: user ? null : s.error,
    })),
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
