import { create } from 'zustand';
import { successHaptic } from '../utils/haptics';

interface XpFlashItem {
  id: number;
  amount: number;
  label?: string;
}

interface XpFlashState {
  queue: XpFlashItem[];
  flashXp: (amount: number, label?: string) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

/**
 * Lightweight transient feedback for XP gains. Renders a "+N XP" pill that
 * pops, holds briefly, and fades — emphasizes that something rewarding just
 * happened without blocking the UI. Mounted once at the AppShell level.
 */
export const useXpFlash = create<XpFlashState>((set) => ({
  queue: [],
  flashXp: (amount, label) => {
    if (amount <= 0) return;
    successHaptic();
    const id = nextId++;
    set((s) => ({ queue: [...s.queue, { id, amount, label }] }));
    // Auto-dismiss after 1.6s so the queue self-cleans even if the component
    // unmounts before its own timer fires.
    setTimeout(() => {
      set((s) => ({ queue: s.queue.filter((x) => x.id !== id) }));
    }, 1600);
  },
  dismiss: (id) => set((s) => ({ queue: s.queue.filter((x) => x.id !== id) })),
}));

/** Imperative shortcut for non-React callsites (state actions, RAF loops). */
export function flashXp(amount: number, label?: string): void {
  useXpFlash.getState().flashXp(amount, label);
}
