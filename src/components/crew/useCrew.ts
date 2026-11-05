import { useCallback, useEffect, useRef } from 'react';

export type CrewAct = 'bulge' | 'nod' | 'shake' | 'brainy';

const DURATION: Record<CrewAct, number> = { bulge: 1400, nod: 1200, shake: 900, brainy: 3400 };

function reducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Drives the crew inside `root`: every 5–9 s one random visible member bulges
 * its eyes, nods, shakes its head or (rarely) grows a brain. Returns
 * `rewardNod`, which ripples a nod through the whole crew.
 */
export function useCrew(root: React.RefObject<HTMLElement | null>) {
  const timers = useRef<number[]>([]);

  const fire = useCallback((el: Element, act: CrewAct) => {
    if (el.classList.contains('busy')) return;
    el.classList.add('busy', act);
    const t = window.setTimeout(() => el.classList.remove('busy', act), DURATION[act] + 50);
    timers.current.push(t);
  }, []);

  const members = useCallback(
    () => Array.from(root.current?.querySelectorAll('.crew-mon') ?? []).filter((el) => (el as HTMLElement).offsetParent !== null),
    [root],
  );

  const rewardNod = useCallback(() => {
    if (reducedMotion()) return;
    members().forEach((el, i) => {
      const t = window.setTimeout(() => fire(el, 'nod'), i * 90);
      timers.current.push(t);
    });
  }, [fire, members]);

  useEffect(() => {
    if (reducedMotion()) return;
    let next: number;
    const tick = () => {
      const all = members();
      if (all.length && !document.hidden) {
        const r = Math.random();
        const act: CrewAct = r < 0.35 ? 'bulge' : r < 0.6 ? 'nod' : r < 0.87 ? 'shake' : 'brainy';
        fire(all[Math.floor(Math.random() * all.length)], act);
      }
      next = window.setTimeout(tick, 5000 + Math.random() * 4000);
    };
    next = window.setTimeout(tick, 2500);
    const pending = timers.current;
    return () => {
      window.clearTimeout(next);
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, [fire, members]);

  return { rewardNod };
}
