import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Taiko-style rhythm tap — cute characters drift into the hit zone; tap the
// drum in time. Perfect/Good score; misses cost a life. ~45 seconds.

const W = 340;
const H = 120;
const HIT_X = 56;
const PERFECT = 16;
const GOOD = 32;
const SESSION = 45;
const CUTE = ['😺', '🐶', '🐰', '🐼', '🦊', '🐯'];

type Note = { id: number; x: number; e: string; hit: boolean };

export function TaikoTap() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const notesRef = useRef<Note[]>([]);
  const idRef = useRef(1);
  const spawnRef = useRef(0.8);
  const timeRef = useRef(SESSION);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const bestComboRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const judgeRef = useRef<{ text: string; until: number } | null>(null);
  const elapsedRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  useArcadeClock(!!outcome);

  const speed = () => 150 + config.startLevel * 15 + (SESSION - timeRef.current) * 2;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 60) + 1));
    setOutcome(recordArcadePlay('taiko', xp));
  };

  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;
      timeRef.current -= dt;

      // spawn
      spawnRef.current -= dt;
      if (spawnRef.current <= 0) {
        notesRef.current.push({
          id: idRef.current++,
          x: W + 20,
          e: CUTE[Math.floor(Math.random() * CUTE.length)],
          hit: false,
        });
        spawnRef.current = 0.55 + Math.random() * 0.5;
      }

      // move + miss detection
      const sp = speed();
      for (const n of notesRef.current) {
        if (n.hit) continue;
        n.x -= sp * dt;
        if (n.x < HIT_X - GOOD) {
          n.hit = true; // missed
          comboRef.current = 0;
          judgeRef.current = { text: 'Miss', until: elapsedRef.current + 0.5 };
          livesRef.current -= 1;
          if (livesRef.current <= 0) {
            finish();
            return;
          }
        }
      }
      notesRef.current = notesRef.current.filter((n) => n.x > -30 && !(n.hit && n.x < HIT_X - GOOD - 4));

      if (timeRef.current <= 0) {
        finish();
        return;
      }
      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const hit = () => {
    if (outcome) return;
    let best: Note | null = null;
    let bestD = Infinity;
    for (const n of notesRef.current) {
      if (n.hit) continue;
      const d = Math.abs(n.x - HIT_X);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    if (best && bestD <= GOOD) {
      best.hit = true;
      notesRef.current = notesRef.current.filter((n) => n !== best);
      comboRef.current += 1;
      bestComboRef.current = Math.max(bestComboRef.current, comboRef.current);
      const perfect = bestD <= PERFECT;
      scoreRef.current += (perfect ? 10 : 5) + Math.floor(comboRef.current / 5);
      judgeRef.current = { text: perfect ? 'Perfect!' : 'Good', until: elapsedRef.current + 0.5 };
      redraw();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        hit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const reset = () => {
    notesRef.current = [];
    spawnRef.current = 0.8;
    timeRef.current = SESSION;
    scoreRef.current = 0;
    comboRef.current = 0;
    bestComboRef.current = 0;
    livesRef.current = config.livesPerSession;
    elapsedRef.current = 0;
    doneRef.current = false;
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Taiko Tap" emoji="🥁" />
        <ArcadeEndCard
          gameId="taiko"
          outcome={outcome}
          win={bestComboRef.current >= 10}
          scoreLine={`${scoreRef.current} points · best combo ${bestComboRef.current}`}
          onReplay={reset}
        />
      </div>
    );
  }

  const judge = judgeRef.current && judgeRef.current.until > elapsedRef.current ? judgeRef.current.text : '';

  return (
    <div>
      <ArcadeHeader title="Taiko Tap" emoji="🥁" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-pink-600">🔥 {comboRef.current}</span>
        <span className="text-orange-600 tabular-nums">⏱ {Math.max(0, Math.ceil(timeRef.current))}s</span>
      </div>

      <div
        className="relative mx-auto rounded-2xl bg-amber-100 border-2 border-amber-200 overflow-hidden"
        style={{ width: '100%', maxWidth: W, aspectRatio: `${W} / ${H}` }}
      >
        <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
          {/* hit zone */}
          <div
            className="absolute rounded-full border-4 border-rose-400"
            style={{ left: HIT_X - 24, top: H / 2 - 24, width: 48, height: 48 }}
          />
          {notesRef.current.map((n) => (
            <div
              key={n.id}
              className="absolute flex items-center justify-center rounded-full bg-white shadow"
              style={{ left: n.x - 18, top: H / 2 - 18, width: 36, height: 36, fontSize: 22 }}
            >
              {n.e}
            </div>
          ))}
          {judge && (
            <div
              className={`absolute font-display font-extrabold ${judge === 'Miss' ? 'text-slate-500' : judge === 'Perfect!' ? 'text-emerald-600' : 'text-amber-600'}`}
              style={{ left: HIT_X - 10, top: 8, fontSize: 16 }}
            >
              {judge}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-sm mx-auto mt-4">
        <button
          type="button"
          onPointerDown={hit}
          className="w-full min-h-20 rounded-3xl bg-rose-500 hover:bg-rose-600 text-white font-display font-extrabold text-3xl shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
        >
          DON! 🥁
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Tap the drum when a friend reaches the ring. Keep the combo alive!
      </p>
    </div>
  );
}
