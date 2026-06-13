import { useState, useEffect, useRef } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';

const GAME_SECONDS = 45;
const LIVES = 3;
const FIELD_H = 320;
const ZOMBIE_EMOJI = ['🧟', '🧟‍♂️', '🧟‍♀️'];

interface Zombie {
  id: number;
  lane: number; // 0..2
  y: number; // 0 (top) → FIELD_H (fence)
  speed: number; // px per second
  emoji: string;
  popped: boolean;
}

export function ZombieZapper() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [zapped, setZapped] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const nextId = useRef(1);
  const doneRef = useRef(false);
  const stateRef = useRef({ zapped: 0, lives: LIVES, timeLeft: GAME_SECONDS });
  stateRef.current = { zapped, lives, timeLeft };

  const over = lives <= 0 || timeLeft <= 0;

  // Game loop: move zombies + spawn; 1s timer.
  useEffect(() => {
    if (over || outcome) return;
    let last = performance.now();
    let spawnIn = 0.4;
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      spawnIn -= dt;
      setZombies((zs) => {
        let next = zs
          .map((z) => (z.popped ? z : { ...z, y: z.y + z.speed * dt }))
          .filter((z) => !(z.popped && z.y > -50)); // popped ones removed below via timeout-free filter
        // Any zombie reaching the fence costs a life and despawns.
        const reached = next.filter((z) => !z.popped && z.y >= FIELD_H);
        if (reached.length > 0) {
          setLives((l) => Math.max(0, l - reached.length));
          next = next.filter((z) => z.popped || z.y < FIELD_H);
        }
        if (spawnIn <= 0) {
          spawnIn = 0.8 + Math.random() * 0.9 - Math.min(0.5, (GAME_SECONDS - stateRef.current.timeLeft) * 0.01);
          next = [
            ...next,
            {
              id: nextId.current++,
              lane: Math.floor(Math.random() * 3),
              y: -30,
              speed: 42 + Math.random() * 36 + (GAME_SECONDS - stateRef.current.timeLeft) * 0.8,
              emoji: ZOMBIE_EMOJI[Math.floor(Math.random() * ZOMBIE_EMOJI.length)],
              popped: false,
            },
          ];
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [over, outcome]);

  // Finish
  useEffect(() => {
    if (over && !doneRef.current) {
      doneRef.current = true;
      const score = stateRef.current.zapped;
      const survived = stateRef.current.lives > 0;
      const baseXp = Math.max(1, Math.min(10, Math.floor(score / 3) + (survived ? 2 : 0)));
      setTimeout(() => setOutcome(recordArcadePlay('zapper', baseXp)), 400);
    }
  }, [over, recordArcadePlay]);

  const zap = (id: number) => {
    if (over || outcome) return;
    setZombies((zs) => zs.filter((z) => z.id !== id));
    setZapped((n) => n + 1);
  };

  const reset = () => {
    setZombies([]);
    setZapped(0);
    setLives(LIVES);
    setTimeLeft(GAME_SECONDS);
    setOutcome(null);
    doneRef.current = false;
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Zombie Zapper" emoji="🧟" />
        <ArcadeEndCard
          gameId="zapper"
          outcome={outcome}
          win={lives > 0}
          scoreLine={
            lives > 0 ? `You survived! ${zapped} zombies zapped! ⚡` : `${zapped} zapped — the fence fell!`
          }
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Zombie Zapper" emoji="🧟" />
      <div className="flex items-center justify-between max-w-sm mx-auto mb-2 text-sm font-display font-extrabold">
        <span className="text-slate-700 tabular-nums">⚡ {zapped}</span>
        <span className="text-slate-700 tabular-nums">⏱ {timeLeft}s</span>
        <span aria-label={`${lives} lives left`}>{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</span>
      </div>
      <div
        className="relative max-w-sm mx-auto rounded-3xl border-2 border-slate-200 bg-gradient-to-b from-lime-50 to-green-100 overflow-hidden select-none"
        style={{ height: FIELD_H + 40 }}
      >
        {/* lanes */}
        <div className="absolute inset-0 grid grid-cols-3" aria-hidden="true">
          <div className="border-r border-dashed border-green-200" />
          <div className="border-r border-dashed border-green-200" />
          <div />
        </div>
        {/* fence */}
        <div
          className="absolute left-0 right-0 text-center text-xl tracking-widest"
          style={{ top: FIELD_H }}
          aria-hidden="true"
        >
          🪵🪵🪵🪵🪵🪵🪵
        </div>
        {zombies.map((z) => (
          <button
            key={z.id}
            type="button"
            aria-label="Zap zombie"
            onPointerDown={() => zap(z.id)}
            className="absolute text-4xl -translate-x-1/2 cursor-pointer active:scale-75 transition-transform"
            style={{ left: `${z.lane * 33.33 + 16.7}%`, top: z.y }}
          >
            {z.emoji}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-2">
        Tap zombies before they reach the fence. 3 escapes and it falls!
      </p>
    </div>
  );
}
