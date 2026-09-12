// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { useAuth, displayNameFor } from '../src/state/auth';
import { clerkConfigured } from '../src/lib/clerk';
import { AccountCard } from '../src/components/AccountCard';

// Sign-in is Clerk's. The store in front of it is what the app talks to, and
// it must behave the same whether Clerk is configured, loading, or absent:
// anonymous "Math-Friend" until a session exists, never an error the student
// has to deal with.

const jo = { uid: 'user_1', name: 'Jo Mathis', email: 'jo@example.com', photoURL: null };

// A client render, not a server one: zustand hands server renders the store's
// *initial* state, so a static render could never see setState above.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
function renderCard(): string {
  const host = document.createElement('div');
  const root = createRoot(host);
  act(() => root.render(createElement(AccountCard)));
  const html = host.innerHTML;
  act(() => root.unmount());
  return html;
}

beforeEach(() => {
  useAuth.setState({ user: null, status: 'anonymous', available: clerkConfigured, error: null });
  useAuth.getState()._bind(null);
});

describe('the auth store', () => {
  it('starts anonymous, and offers sign-in only when Clerk is configured', () => {
    expect(useAuth.getState().user).toBeNull();
    expect(useAuth.getState().status).toBe('anonymous');
    // No key in the test environment → not offered.
    expect(clerkConfigured).toBe(false);
    expect(useAuth.getState().available).toBe(false);
  });

  it('signing in without a provider explains, rather than throwing', () => {
    useAuth.getState().signIn('email');
    expect(useAuth.getState().status).toBe('error');
    expect(useAuth.getState().error).toMatch(/saved on this device/);
  });

  it('email opens the provider dialog once it is bound', () => {
    let opened = 0;
    useAuth.setState({ available: true });
    useAuth.getState()._bind({ signInWithGoogle: async () => undefined, openSignIn: () => void opened++, signOut: async () => undefined });
    useAuth.getState().signIn('email');
    expect(opened).toBe(1);
    expect(useAuth.getState().status).toBe('signing-in');
    // The dialog closed without a session → back to anonymous, no error.
    useAuth.getState()._setUser(null);
    expect(useAuth.getState().status).toBe('anonymous');
    expect(useAuth.getState().error).toBeNull();
  });

  it('Google starts the redirect, and a failed start is explained', async () => {
    let started = 0;
    useAuth.setState({ available: true });
    useAuth.getState()._bind({ signInWithGoogle: async () => void started++, openSignIn: () => undefined, signOut: async () => undefined });
    useAuth.getState().signIn('google');
    expect(started).toBe(1);
    expect(useAuth.getState().status).toBe('signing-in');
    // e.g. Clerk not loaded yet, or the network is down
    useAuth.getState()._bind({ signInWithGoogle: async () => { throw new Error('offline'); }, openSignIn: () => undefined, signOut: async () => undefined });
    useAuth.getState().signIn('google');
    await new Promise((r) => setTimeout(r, 0));
    expect(useAuth.getState().status).toBe('error');
    expect(useAuth.getState().error).toMatch(/keep playing as Math-Friend/);
  });

  it('mirrors the provider user and signs out through it', async () => {
    let signedOut = 0;
    useAuth.setState({ available: true });
    useAuth.getState()._bind({ signInWithGoogle: async () => undefined, openSignIn: () => undefined, signOut: async () => void signedOut++ });
    useAuth.getState()._setUser(jo);
    expect(useAuth.getState().status).toBe('signed-in');
    expect(displayNameFor(useAuth.getState().user)).toBe('Jo');
    await useAuth.getState().signOutUser();
    expect(signedOut).toBe(1);
    expect(useAuth.getState().user).toBeNull();
    expect(useAuth.getState().status).toBe('anonymous');
  });

  it('greets Math-Friend when anonymous', () => {
    expect(displayNameFor(null)).toBe('Math-Friend');
    expect(displayNameFor({ ...jo, name: '   ' })).toBe('Math-Friend');
  });
});

describe('the account card', () => {
  it('says sign-in is unavailable, with no button, when Clerk is absent', () => {
    const html = renderCard();
    expect(html).toContain('unavailable');
    expect(html).not.toContain('<button');
  });

  it('offers Google and email, and nothing else, when Clerk is present', () => {
    useAuth.setState({ available: true });
    const html = renderCard();
    expect(html).toContain('Continue with Google');
    expect(html).toContain('Continue with email');
    expect(html.match(/<button/g)).toHaveLength(2);
    // creating an account is not a third path
    expect(html).toContain('Either one creates your account');
  });

  it('shows the person and a sign-out when signed in', () => {
    useAuth.setState({ user: jo, status: 'signed-in', available: true });
    const html = renderCard();
    expect(html).toContain('Jo Mathis');
    expect(html).toContain('jo@example.com');
    expect(html).toContain('Sign out');
  });
});

describe('Firebase is only the sync store', () => {
  // Sign-in moved to Clerk. Firebase Auth's own sign-in flows must not creep
  // back in beside it: two sign-ins is how a student ends up with two accounts.
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const f of readdirSync(dir)) {
      const p = path.join(dir, f);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.tsx?$/.test(f)) out.push(p);
    }
    return out;
  };
  it('no Firebase sign-in provider or popup in the app source', () => {
    const root = path.resolve(process.cwd(), 'src'); // happy-dom swaps URL, so no import.meta.url here
    const hits: string[] = [];
    for (const f of walk(root)) {
      const src = readFileSync(f, 'utf8');
      for (const bad of ['signInWithPopup', 'signInWithRedirect', 'GoogleAuthProvider', 'onAuthStateChanged']) {
        if (src.includes(bad)) hits.push(`${path.relative(root, f)}: ${bad}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
