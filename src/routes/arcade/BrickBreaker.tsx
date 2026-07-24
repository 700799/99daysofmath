import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Brick Breaker — bounce the ball to clear numbered bricks. Break the brick
// matching the target number for a bonus. Catch the green drop to widen the
// paddle. Lose the ball past the paddle and you lose a life.

const W = 340;
const H = 300;
const COLS = 7;
const PADDLE_Y = H - 22;
const BALL_R = 6;
const BASE_PADDLE_W = 64;

type Brick = { x: number; y: number; w: number; h: number; val: number; alive: boolean };
type Drop = { x: number; y: number; alive: boolean };

function rectHit(bx: number, by: number, r: number, x: number, y: number, w: number, h: number) {
  const nx = Math.max(x, Math.min(bx, x + w));
  const ny = Math.max(y, Math.min(by, y + h));
  return (bx - nx) ** 2 + (by - ny) ** 2 <= r * r;
}

export function BrickBreaker() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const bricksRef = useRef<Brick[]>([]);
  const ballRef = useRef({ x: W / 2, y: PADDLE_Y - 20, vx: 150, vy: -220 });
  const paddleRef = useRef({ x: W / 2 - BASE_PADDLE_W / 2, w: BASE_PADDLE_W });
  const wideUntilRef = useRef(0);
  const dropsRef = useRef<Drop[]>([]);
  const inputRef = useRef({ left: false, right: false });
  const targetRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const levelRef = useRef(config.startLevel);
  const elapsedRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();

  const newTarget = () => {
    const alive = bricksRef.current.filter((b) => b.alive);
    targetRef.current = alive.length
      ? alive[Math.floor(Math.random() * alive.length)].val
      : 0;
  };

  const buildBricks = () => {
    const rows = Math.min(6, 2 + levelRef.current);
    const pad = 6;
    const bw = (W - pad * (COLS + 1)) / COLS;
    const bh = 16;
    const bricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < COLS; c++) {
        bricks.push({
          x: pad + c * (bw + pad),
          y: 30 + r * (bh + pad),
          w: bw,
          h: bh,
          val: 1 + Math.floor(Math.random() * 9),
          alive: true,
        });
      }
    }
    bricksRef.current = bricks;
    newTarget();
  };

  const resetBall = () => {
    paddleRef.current = { x: W / 2 - BASE_PADDLE_W / 2, w: BASE_PADDLE_W };
    wideUntilRef.current = 0;
    ballRef.current = {
      x: W / 2,
      y: PADDLE_Y - 20,
      vx: (Math.random() < 0.5 ? -1 : 1) * (140 + levelRef.current * 12),
      vy: -(200 + levelRef.current * 15),
    };
  };

  const startRef = useRef(false);
  if (!startRef.current) {
    startRef.current = true;
    buildBricks();
    resetBall();
  }

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 40) + levelRef.current));
    setOutcome(recordArcadePlay('bricks', xp));
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
      const dt = Math.min(0.04, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;

      // paddle keyboard
      const pad = paddleRef.current;
      pad.w = elapsedRef.current < wideUntilRef.current ? BASE_PADDLE_W * 1.6 : BASE_PADDLE_W;
      const pSpeed = 320;
      if (inputRef.current.left) pad.x -= pSpeed * dt;
      if (inputRef.current.right) pad.x += pSpeed * dt;
      pad.x = Math.max(0, Math.min(W - pad.w, pad.x));

      // ball
      const b = ballRef.current;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x < BALL_R) {
        b.x = BALL_R;
        b.vx = Math.abs(b.vx);
      }
      if (b.x > W - BALL_R) {
        b.x = W - BALL_R;
        b.vx = -Math.abs(b.vx);
      }
      if (b.y < BALL_R) {
        b.y = BALL_R;
        b.vy = Math.abs(b.vy);
      }
      // paddle bounce
      if (
        b.vy > 0 &&
        b.y + BALL_R >= PADDLE_Y &&
        b.y + BALL_R <= PADDLE_Y + 14 &&
        b.x >= pad.x &&
        b.x <= pad.x + pad.w
      ) {
        b.vy = -Math.abs(b.vy);
        sfx.hit();
        haptic(HAPTIC.tap);
        const hit = (b.x - (pad.x + pad.w / 2)) / (pad.w / 2); // -1..1
        const speed = Math.hypot(b.vx, b.vy);
        b.vx = hit * speed * 0.75;
        b.vy = -Math.sqrt(Math.max(40, speed * speed - b.vx * b.vx));
      }
      // after 10s the ball creeps faster, up to ~1.6x the launch speed
      if (elapsedRef.current > 10) {
        const launch = 200 + levelRef.current * 15;
        const cap = launch * 1.6;
        const sp = Math.hypot(b.vx, b.vy);
        if (sp < cap) {
          const f = Math.min(cap / sp, 1.0006);
          b.vx *= f;
          b.vy *= f;
        }
      }
      // brick collisions
      for (const br of bricksRef.current) {
        if (!br.alive) continue;
        if (rectHit(b.x, b.y, BALL_R, br.x, br.y, br.w, br.h)) {
          br.alive = false;
          scoreRef.current += br.val;
          const bx = br.x + br.w / 2;
          const by = br.y + br.h / 2;
          sfx.explode();
          burst(bx, by, { color: '#a5b4fc', count: 10 });
          if (br.val === targetRef.current) {
            scoreRef.current += 25; // target bonus
            sfx.coin();
            haptic(HAPTIC.pickup);
            burst(bx, by, { emoji: '⭐', count: 10 });
            newTarget();
          } else {
            haptic(HAPTIC.hit);
          }
          // bounce vertically (simple)
          b.vy = -b.vy;
          // chance to drop a wide-paddle power-up
          if (Math.random() < 0.12) dropsRef.current.push({ x: br.x + br.w / 2, y: br.y, alive: true });
          break;
        }
      }

      // power-up drops
      for (const d of dropsRef.current) {
        if (!d.alive) continue;
        d.y += 120 * dt;
        if (d.y >= PADDLE_Y && d.x >= pad.x && d.x <= pad.x + pad.w) {
          d.alive = false;
          wideUntilRef.current = elapsedRef.current + 8;
        } else if (d.y > H) d.alive = false;
      }
      dropsRef.current = dropsRef.current.filter((d) => d.alive);

      // ball lost
      if (b.y > H + BALL_R) {
        livesRef.current -= 1;
        sfx.hurt();
        haptic(HAPTIC.death);
        if (livesRef.current <= 0) {
          finish();
          return;
        }
        resetBall();
      }

      // level cleared
      if (bricksRef.current.every((br) => !br.alive)) {
        levelRef.current += 1;
        scoreRef.current += 50;
        sfx.win();
        haptic(HAPTIC.win);
        burst(W / 2, H / 2, { emoji: '🎉', count: 18 });
        buildBricks();
        resetBall();
      }

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const reset = () => {
    scoreRef.current = 0;
    livesRef.current = config.livesPerSession;
    levelRef.current = config.startLevel;
    elapsedRef.current = 0;
    dropsRef.current = [];
    doneRef.current = false;
    buildBricks();
    resetBall();
    setOutcome(null);
  };

  const movePaddleTo = (clientX: number, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const scale = W / rect.width;
    const x = (clientX - rect.left) * scale;
    paddleRef.current.x = Math.max(0, Math.min(W - paddleRef.current.w, x - paddleRef.current.w / 2));
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Brick Breaker" emoji="🧱" />
        <ArcadeEndCard
          gameId="bricks"
          outcome={outcome}
          win={levelRef.current >= 2}
          scoreLine={`Level ${levelRef.current} · ${scoreRef.current} points`}
          onReplay={reset}
        />
      </div>
    );
  }

  const b = ballRef.current;
  const pad = paddleRef.current;

  return (
    <div>
      <ArcadeHeader title="Brick Breaker" emoji="🧱" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-amber-600">Target <b>{targetRef.current}</b></span>
      </div>

      <GameStage theme="bricks" className="max-w-sm mx-auto p-2">
      <div
        className="relative mx-auto rounded-xl bg-slate-900/85 overflow-hidden touch-none"
        style={{ width: '100%', aspectRatio: `${W} / ${H}` }}
        onPointerMove={(e) => movePaddleTo(e.clientX, e.currentTarget)}
        onPointerDown={(e) => movePaddleTo(e.clientX, e.currentTarget)}
      >
        <BurstLayer api={{ burst, particles }} />
        <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
          {bricksRef.current.map((br, i) =>
            br.alive ? (
              <div
                key={i}
                className="absolute flex items-center justify-center rounded font-display font-extrabold text-white text-[11px]"
                style={{
                  left: br.x,
                  top: br.y,
                  width: br.w,
                  height: br.h,
                  background: br.val === targetRef.current ? '#f59e0b' : '#6366f1',
                }}
              >
                {br.val}
              </div>
            ) : null,
          )}
          {dropsRef.current.map((d, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-green-400"
              style={{ left: d.x - 7, top: d.y - 7, width: 14, height: 14 }}
            />
          ))}
          <div
            className="absolute rounded-full bg-white"
            style={{ left: b.x - BALL_R, top: b.y - BALL_R, width: BALL_R * 2, height: BALL_R * 2 }}
          />
          <div
            className="absolute rounded-full bg-emerald-400"
            style={{ left: pad.x, top: PADDLE_Y, width: pad.w, height: 10 }}
          />
        </div>
      </div>
      </GameStage>

      <div className="mt-3 grid grid-cols-2 gap-2 max-w-xs mx-auto select-none">
        <Hold label="← Left" on={() => (inputRef.current.left = true)} off={() => (inputRef.current.left = false)} />
        <Hold label="Right →" on={() => (inputRef.current.right = true)} off={() => (inputRef.current.right = false)} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Drag or use ← → to move. Smash the <b>target</b> brick for a bonus; grab 🟢 to widen.
      </p>
    </div>
  );
}

function Hold({ label, on, off }: { label: string; on: () => void; off: () => void }) {
  return (
    <button
      type="button"
      onTouchStart={(e) => {
        e.preventDefault();
        on();
      }}
      onTouchEnd={off}
      onMouseDown={on}
      onMouseUp={off}
      onMouseLeave={off}
      className="min-h-12 rounded-2xl bg-white border-2 border-slate-200 text-base font-display font-extrabold text-slate-700 active:bg-slate-100"
    >
      {label}
    </button>
  );
}
