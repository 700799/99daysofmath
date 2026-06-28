import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer, useScorePops, ScorePopLayer, useShake } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Fruit Slice — a Fruit-Ninja-style slicer. Fruit arcs up from the bottom;
// swipe across it to slice for points and combos. Slice a 💣 bomb or let three
// fruits fall and it's game over. (Math is handled by the lesson gate + the
// mid-game challenges, like the other arcade games.)

const W = 340;
const H = 440;
const GRAVITY = 620; // px/s²
const FRUITS = ['🍎', '🍉', '🍊', '🍓', '🍌', '🍇', '🥝', '🍑'];
const RADIUS = 26; // slice hit radius

type Item = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  bomb: boolean;
  sliced: boolean;
};

export function FruitSlice() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();
  const { pops, pop } = useScorePops();
  const { style: shakeStyle, shake } = useShake();

  const itemsRef = useRef<Item[]>([]);
  const idRef = useRef(1);
  const spawnRef = useRef(0.6);
  const elapsedRef = useRef(0);
  const scoreRef = useRef(0);
  const missedRef = useRef(0);
  const livesRef = useRef(3);
  const comboRef = useRef({ n: 0, t: 0 });
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const slicingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 8) + 1));
    setOutcome(recordArcadePlay('fruit', xp));
  };

  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;
      if (comboRef.current.t > 0) comboRef.current.t -= dt;

      // spawn — faster and bombier over time
      spawnRef.current -= dt;
      if (spawnRef.current <= 0) {
        const lvl = Math.floor(elapsedRef.current / 20);
        spawnRef.current = Math.max(0.45, 1.1 - lvl * 0.08);
        const burstN = 1 + (Math.random() < Math.min(0.5, 0.15 + lvl * 0.05) ? 1 : 0);
        for (let k = 0; k < burstN; k++) {
          const bomb = Math.random() < Math.min(0.22, 0.06 + lvl * 0.02);
          itemsRef.current.push({
            id: idRef.current++,
            x: 40 + Math.random() * (W - 80),
            y: H + 30,
            vx: (Math.random() - 0.5) * 220,
            vy: -(560 + Math.random() * 130 + lvl * 12),
            emoji: bomb ? '💣' : FRUITS[Math.floor(Math.random() * FRUITS.length)],
            bomb,
            sliced: false,
          });
        }
      }

      // physics
      for (const it of itemsRef.current) {
        it.vy += GRAVITY * dt;
        it.x += it.vx * dt;
        it.y += it.vy * dt;
      }
      // remove off-screen; a missed (un-sliced) fruit costs a life
      const kept: Item[] = [];
      for (const it of itemsRef.current) {
        if (it.y > H + 60 && it.vy > 0) {
          if (!it.sliced && !it.bomb) {
            missedRef.current += 1;
            livesRef.current -= 1;
            shake();
            if (livesRef.current <= 0) {
              itemsRef.current = [];
              finish();
              return;
            }
          }
          continue;
        }
        kept.push(it);
      }
      itemsRef.current = kept;

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  // distance from point P to segment AB
  const segDist = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t * dx;
    const cy = ay + t * dy;
    return Math.hypot(px - cx, py - cy);
  };

  const sliceAt = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    if (outcome || pausedRef.current) return;
    for (const it of itemsRef.current) {
      if (it.sliced) continue;
      if (segDist(it.x, it.y, from.x, from.y, to.x, to.y) <= RADIUS) {
        if (it.bomb) {
          it.sliced = true;
          livesRef.current -= 1;
          shake();
          burst(it.x, it.y, { emoji: '💥', count: 16 });
          comboRef.current = { n: 0, t: 0 };
          if (livesRef.current <= 0) {
            finish();
            return;
          }
        } else {
          it.sliced = true;
          // combo within 0.6s of the last slice
          const combo = comboRef.current.t > 0 ? comboRef.current.n + 1 : 1;
          comboRef.current = { n: combo, t: 0.6 };
          const gained = 1 + Math.floor((combo - 1) / 2);
          scoreRef.current += gained;
          burst(it.x, it.y, { emoji: it.emoji, count: 8 });
          pop(it.x - 10, it.y - 10, combo > 1 ? `🔥${combo}!` : `+${gained}`, '#16a34a');
        }
      }
    }
  };

  const toLocal = (e: React.PointerEvent) => {
    const r = boardRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const onDown = (e: React.PointerEvent) => {
    slicingRef.current = true;
    const p = toLocal(e);
    lastPtRef.current = p;
    setTrail([p]);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!slicingRef.current) return;
    const p = toLocal(e);
    const last = lastPtRef.current;
    if (last) sliceAt(last, p);
    lastPtRef.current = p;
    setTrail((t) => [...t.slice(-6), p]);
  };
  const onUp = () => {
    slicingRef.current = false;
    lastPtRef.current = null;
    setTrail([]);
  };

  const reset = () => {
    itemsRef.current = [];
    spawnRef.current = 0.6;
    elapsedRef.current = 0;
    scoreRef.current = 0;
    missedRef.current = 0;
    livesRef.current = 3;
    comboRef.current = { n: 0, t: 0 };
    doneRef.current = false;
    setTrail([]);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Fruit Slice" emoji="🍉" />
        <ArcadeEndCard
          gameId="fruit"
          outcome={outcome}
          win={scoreRef.current >= 20}
          scoreLine={`${scoreRef.current} sliced!`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Fruit Slice" emoji="🍉" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, 3 - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">🍉 {scoreRef.current}</span>
        {comboRef.current.t > 0 && comboRef.current.n > 1 && (
          <span className="text-orange-600">🔥 x{comboRef.current.n}</span>
        )}
      </div>

      <GameStage theme="ocean" className="max-w-sm mx-auto">
        <div
          ref={boardRef}
          className="relative touch-none select-none mx-auto"
          style={{ width: '100%', aspectRatio: `${W} / ${H}`, ...shakeStyle }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          <BurstLayer api={{ burst, particles }} />
          <ScorePopLayer pops={pops} />

          {/* swipe trail */}
          {trail.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <polyline
                points={trail.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {itemsRef.current.map((it) => (
            <div
              key={it.id}
              className="absolute select-none"
              style={{
                left: `${(it.x / W) * 100}%`,
                top: `${(it.y / H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: 44,
                opacity: it.sliced ? 0.25 : 1,
                filter: it.sliced ? 'grayscale(1)' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
              }}
            >
              {it.emoji}
            </div>
          ))}
        </div>
      </GameStage>

      <p className="text-center text-xs text-slate-500 mt-2">
        Swipe to slice the fruit! Avoid 💣 bombs, and don't let fruit fall.
      </p>
    </div>
  );
}
