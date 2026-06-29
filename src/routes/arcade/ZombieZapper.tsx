import { useState, useEffect, useRef } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { DivisibilityQuiz } from './DivisibilityQuiz';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

const WIN_TARGET = 100; // tag 100 zombies to win
const LIVES = 5;
const FIELD_H = 340;
const LANES = 3;

// 10 zombie kinds. Big ones are slower + take two taps; "heads" are small + fast.
type Kind = { emoji: string; size: number; hp: number; spd: number };
const KINDS: Kind[] = [
  { emoji: '🧟', size: 38, hp: 1, spd: 1 },
  { emoji: '🧟‍♂️', size: 38, hp: 1, spd: 1 },
  { emoji: '🧟‍♀️', size: 38, hp: 1, spd: 1 },
  { emoji: '🧛', size: 38, hp: 1, spd: 1.05 },
  { emoji: '👽', size: 36, hp: 1, spd: 1.15 },
  { emoji: '👺', size: 40, hp: 1, spd: 0.95 },
  { emoji: '👹', size: 56, hp: 2, spd: 0.7 }, // big, tough
  { emoji: '🧞', size: 56, hp: 2, spd: 0.7 }, // big, tough
  { emoji: '💀', size: 26, hp: 1, spd: 1.6 }, // head, fast
  { emoji: '☠️', size: 26, hp: 1, spd: 1.7 }, // head, fast
];

// Composite milestones with several small factors — good teaching moments.
const TEACH = new Set([12, 18, 24, 30, 36, 48, 60, 72, 84, 96]);

interface Zombie { id: number; lane: number; y: number; speed: number; emoji: string; size: number; hp: number; }

export function ZombieZapper() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [zapped, setZapped] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [quiz, setQuiz] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const quizRef = useRef(false);
  const nextId = useRef(1);
  const doneRef = useRef(false);
  const lastQuizRef = useRef(0);
  const elapsedRef = useRef(0);
  const stateRef = useRef({ zapped: 0, lives: LIVES });
  stateRef.current = { zapped, lives };

  const won = zapped >= WIN_TARGET;
  const over = lives <= 0 || won;

  // Game loop: zombies fall ~4× faster than the old version.
  useEffect(() => {
    if (over || outcome) return;
    let last = performance.now();
    let spawnIn = 0.5;
    let raf = 0;
    const tick = (now: number) => {
      if (pausedRef.current || quizRef.current) { last = now; raf = requestAnimationFrame(tick); return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsedRef.current += dt;
      spawnIn -= dt;
      setZombies((zs) => {
        let next = zs.map((z) => ({ ...z, y: z.y + z.speed * dt }));
        const reached = next.filter((z) => z.y >= FIELD_H);
        if (reached.length > 0) {
          setLives((l) => Math.max(0, l - reached.length));
          sfx.hurt(); haptic(HAPTIC.hit);
          next = next.filter((z) => z.y < FIELD_H);
        }
        if (spawnIn <= 0) {
          spawnIn = Math.max(0.32, 0.75 - elapsedRef.current * 0.008);
          const k = KINDS[Math.floor(Math.random() * KINDS.length)];
          // base ~4× the old 42–78 px/s, scaling up over time
          const base = (150 + Math.random() * 90 + elapsedRef.current * 2.5) * k.spd;
          next = [...next, { id: nextId.current++, lane: Math.floor(Math.random() * LANES), y: -30, speed: base, emoji: k.emoji, size: k.size, hp: k.hp }];
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [over, outcome]);

  // Factor checkpoint at teachable milestones.
  useEffect(() => {
    if (over || outcome || quiz != null) return;
    if (TEACH.has(zapped) && lastQuizRef.current !== zapped) {
      lastQuizRef.current = zapped;
      quizRef.current = true;
      setQuiz(zapped);
    }
  }, [zapped, over, outcome, quiz]);

  // Finish
  useEffect(() => {
    if (over && !doneRef.current) {
      doneRef.current = true;
      const score = stateRef.current.zapped;
      const baseXp = Math.max(2, Math.min(20, Math.floor(score / 8) + (won ? 6 : 0)));
      setTimeout(() => { won ? sfx.win() : sfx.lose(); setOutcome(recordArcadePlay('zapper', baseXp)); }, 400);
    }
  }, [over, recordArcadePlay, won]);

  const zap = (id: number) => {
    if (over || outcome || quizRef.current) return;
    setZombies((zs) => {
      const z = zs.find((x) => x.id === id);
      if (!z) return zs;
      if (z.hp > 1) {
        sfx.hit(); haptic(HAPTIC.tap);
        return zs.map((x) => (x.id === id ? { ...x, hp: x.hp - 1, size: x.size * 0.85 } : x));
      }
      sfx.shoot(); haptic(HAPTIC.tap);
      setZapped((n) => n + 1);
      return zs.filter((x) => x.id !== id);
    });
  };

  const reset = () => {
    setZombies([]); setZapped(0); setLives(LIVES); setQuiz(null); setOutcome(null);
    doneRef.current = false; quizRef.current = false; lastQuizRef.current = 0; elapsedRef.current = 0;
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Zombie Zapper" emoji="🧟" />
        <ArcadeEndCard
          gameId="zapper"
          outcome={outcome}
          win={won}
          scoreLine={won ? `🏆 100 zombies tagged — you saved the town!` : `${zapped} zapped — the fence fell!`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Zombie Zapper" emoji="🧟" />
      <div className="flex items-center justify-between max-w-sm mx-auto mb-2 text-sm font-display font-extrabold">
        <span className="text-slate-700 tabular-nums">⚡ {zapped}/{WIN_TARGET}</span>
        <span aria-label={`${lives} lives left`}>{'❤️'.repeat(lives)}{'🖤'.repeat(LIVES - lives)}</span>
      </div>
      {/* progress to 100 */}
      <div className="max-w-sm mx-auto mb-2 h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-lime-500 transition-all" style={{ width: `${Math.min(100, zapped)}%` }} />
      </div>
      <div
        className="relative max-w-sm mx-auto rounded-3xl border-2 border-slate-200 bg-gradient-to-b from-lime-50 to-green-100 overflow-hidden select-none"
        style={{ height: FIELD_H + 40 }}
      >
        <div className="absolute inset-0 grid grid-cols-3" aria-hidden="true">
          <div className="border-r border-dashed border-green-200" />
          <div className="border-r border-dashed border-green-200" />
          <div />
        </div>
        <div className="absolute left-0 right-0 text-center text-xl tracking-widest" style={{ top: FIELD_H }} aria-hidden="true">
          🪵🪵🪵🪵🪵🪵🪵
        </div>
        {zombies.map((z) => (
          <button
            key={z.id}
            type="button"
            aria-label="Zap zombie"
            onPointerDown={() => zap(z.id)}
            className="absolute -translate-x-1/2 cursor-pointer active:scale-75 transition-transform"
            style={{ left: `${z.lane * 33.33 + 16.7}%`, top: z.y, fontSize: z.size }}
          >
            {z.emoji}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-2">
        Tap zombies before they reach the fence! Big 👹 take two taps. Reach 100 to win.
      </p>

      {quiz != null && (
        <DivisibilityQuiz
          total={quiz}
          token="🧟"
          onDone={() => { setQuiz(null); quizRef.current = false; }}
        />
      )}
    </div>
  );
}
