// The visitor's cookie choice. Kept on this device only (never synced), since
// consent belongs to the person at the keyboard, not the account.
import { create } from 'zustand';

export type ConsentChoice = 'all' | 'essential';

const KEY = '99daysofmath:consent';

interface Stored {
  choice: ConsentChoice;
  at: string;
}

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<Stored>;
    return v.choice === 'all' || v.choice === 'essential' ? { choice: v.choice, at: v.at ?? '' } : null;
  } catch {
    return null;
  }
}

function write(v: Stored | null) {
  try {
    if (v) localStorage.setItem(KEY, JSON.stringify(v));
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode or blocked storage: the choice lasts this visit only */
  }
}

interface ConsentState {
  /** null until the visitor has answered the notice. */
  choice: ConsentChoice | null;
  /** When they answered, ISO date. */
  decidedAt: string | null;
  /** Allow advertising cookies (ads may load on the ad pages). */
  allowAll: () => void;
  /** Essential cookies only: no ads anywhere. */
  essentialOnly: () => void;
  /** Forget the choice so the notice asks again. */
  reset: () => void;
}

export const useConsent = create<ConsentState>((set) => {
  const initial = read();
  const decide = (choice: ConsentChoice) => {
    const at = new Date().toISOString();
    write({ choice, at });
    set({ choice, decidedAt: at });
  };
  return {
    choice: initial?.choice ?? null,
    decidedAt: initial?.at || null,
    allowAll: () => decide('all'),
    essentialOnly: () => decide('essential'),
    reset: () => {
      write(null);
      set({ choice: null, decidedAt: null });
    },
  };
});

/** True when ads may load: the visitor chose to allow all cookies. */
export function adsConsented(choice: ConsentChoice | null): boolean {
  return choice === 'all';
}
