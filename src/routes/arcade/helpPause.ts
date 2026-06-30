import { useSyncExternalStore } from 'react';

// A tiny global "the help drawer is open, freeze the game" signal. Real-time
// games already read `useArcadePausedRef()` at the top of their loop; that hook
// ORs this flag in, so opening the shared Help drawer pauses every such game with
// no per-game wiring. (Phaser games, which run their own loop, subscribe to this
// directly to pause/resume their scene.)

let paused = false;
const subs = new Set<() => void>();

export const helpPause = {
  get: () => paused,
  set: (v: boolean) => {
    if (paused === v) return;
    paused = v;
    subs.forEach((f) => f());
  },
  subscribe: (f: () => void) => {
    subs.add(f);
    return () => subs.delete(f);
  },
};

export function useHelpPaused(): boolean {
  return useSyncExternalStore(helpPause.subscribe, helpPause.get, () => false);
}
