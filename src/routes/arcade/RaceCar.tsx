import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { Mascot as CharMascot, type MascotExpr } from './Mascots';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Race Car — a FIRST-PERSON perspective dash. You ARE the big-helmeted racer at
// the bottom of the screen; the road rushes toward you from the horizon and
// hazards (rocks, eggs, carrots, toothy heads, snakes, spikes) come barreling in
// from the distance, growing as they approach. Swerve between the three lanes to
// dodge them and grab ⭐ for a time bonus. 45-second session.

const VIEW_W = 360;
const VIEW_H = 470;
const HORIZON_Y = 64;
const CAR_Y = VIEW_H - 74;
const LANES = [72, 180, 288]; // bottom-of-road x-centers
const VP_X = VIEW_W / 2; // vanishing point x
const CONVERGE = 0.16; // how tightly lanes pinch at the horizon
const SESSION_SECONDS = 45;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type HazKind = 'rock' | 'egg' | 'carrot' | 'head' | 'snake' | 'spike' | 'star';
const HAZARDS: { kind: HazKind; emoji: string }[] = [
  { kind: 'rock', emoji: '🪨' },
  { kind: 'egg', emoji: '🥚' },
  { kind: 'carrot', emoji: '🥕' },
  { kind: 'head', emoji: '👹' },
  { kind: 'snake', emoji: '🐍' },
  { kind: 'spike', emoji: '🔺' },
];

type Obstacle = {
  id: number;
  kind: HazKind;
  emoji: string;
  lane: 0 | 1 | 2;
  t: number; // 0 = far horizon, 1 = at the player
  hit: boolean;
};

// project a (lane, t) into a screen position + scale for the perspective road
function project(lane: 0 | 1 | 2, t: number) {
  const bx = LANES[lane];
  const tx = VP_X + (bx - VP_X) * CONVERGE;
  return {
    x: lerp(tx, bx, t),
    y: lerp(HORIZON_Y, CAR_Y, t),
    size: 14 + t * 48,
  };
}

export function RaceCar() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const laneRef = useRef<0 | 1 | 2>(1);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const distanceRef = useRef(0);
  const livesRef = useRef(3);
  const timeLeftRef = useRef(SESSION_SECONDS);
  const lastTickRef = useRef(performance.now());
  const spawnTimerRef = useRef(0);
  const idRef = useRef(1);
  const rafRef = useRef(0);
  const exprRef = useRef<MascotExpr>('happy');
  const shakeRef = useRef(0);

  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const setLane = (n: 0 | 1 | 2) => {
    if (outcome) return;
    if (n !== laneRef.current) { sfx.step(); buzz(HAPTIC.light); }
    laneRef.current = n;
    redraw();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') setLane(Math.max(0, laneRef.current - 1) as 0 | 1 | 2);
      if (e.key === 'ArrowRight' || e.key === 'd') setLane(Math.min(2, laneRef.current + 1) as 0 | 1 | 2);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (outcome) return;
    const tick = (now: number) => {
      if (pausedRef.current) {
        lastTickRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      timeLeftRef.current -= dt;
      const speed = Math.min(440, 220 + distanceRef.current * 0.05);
      distanceRef.current += speed * dt;
      if (shakeRef.current > 0) shakeRef.current = Math.max(0, shakeRef.current - dt);

      // how fast hazards travel from horizon → player (faster over time)
      const tSpeed = 0.55 + Math.min(0.6, distanceRef.current / 6000);

      // spawn
      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        const lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
        const star = Math.random() < 0.16;
        const h = HAZARDS[Math.floor(Math.random() * HAZARDS.length)];
        obstaclesRef.current.push({
          id: idRef.current++,
          kind: star ? 'star' : h.kind,
          emoji: star ? '⭐' : h.emoji,
          lane,
          t: 0,
          hit: false,
        });
        spawnTimerRef.current = 0.5 + Math.random() * 0.28;
      }

      // advance + collide near the player (t ≈ 1)
      for (const ob of obstaclesRef.current) {
        ob.t += tSpeed * dt;
        if (!ob.hit && ob.t >= 0.88 && ob.t <= 1.06 && ob.lane === laneRef.current) {
          ob.hit = true;
          if (ob.kind === 'star') {
            timeLeftRef.current = Math.min(SESSION_SECONDS + 6, timeLeftRef.current + 3);
            sfx.coin(); buzz(HAPTIC.pickup);
          } else {
            livesRef.current -= 1;
            shakeRef.current = 0.35;
            exprRef.current = 'dizzy';
            sfx.hurt(); buzz(HAPTIC.death);
            window.setTimeout(() => { exprRef.current = 'happy'; }, 500);
            if (livesRef.current <= 0) { finish(); return; }
          }
        }
      }
      obstaclesRef.current = obstaclesRef.current.filter((ob) => ob.t < 1.15);

      if (timeLeftRef.current <= 0) { finish(); return; }

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const finish = () => {
    sfx.lose();
    const xp = Math.max(1, Math.min(22, Math.floor(distanceRef.current / 200)));
    setOutcome(recordArcadePlay('racer', xp));
  };

  const reset = () => {
    laneRef.current = 1;
    obstaclesRef.current = [];
    distanceRef.current = 0;
    livesRef.current = 3;
    timeLeftRef.current = SESSION_SECONDS;
    spawnTimerRef.current = 0;
    exprRef.current = 'happy';
    shakeRef.current = 0;
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Race Car" emoji="🏎️" />
        <ArcadeEndCard
          gameId="racer"
          outcome={outcome}
          win={distanceRef.current >= 4000}
          scoreLine={`${Math.floor(distanceRef.current)}m driven · ${livesRef.current}❤️ left`}
          onReplay={reset}
        />
      </div>
    );
  }

  const shake = shakeRef.current > 0 ? (Math.random() - 0.5) * 10 : 0;
  // sort far→near so nearer hazards paint on top
  const drawList = [...obstaclesRef.current].sort((a, b) => a.t - b.t);

  return (
    <div>
      <ArcadeHeader title="Race Car · 45s" emoji="🏎️" gameId="racer" />
      <div className="mb-2 flex items-center justify-between max-w-sm mx-auto px-1">
        <div className="text-sm font-display font-extrabold text-slate-900">
          {'❤️'.repeat(livesRef.current)}
          {'🤍'.repeat(Math.max(0, 3 - livesRef.current))}
        </div>
        <div className="text-sm font-display font-bold text-slate-600 tabular-nums">
          🛣️ {Math.floor(distanceRef.current)}m · ⏱ {Math.max(0, Math.ceil(timeLeftRef.current))}s
        </div>
      </div>

      <div
        className="relative mx-auto overflow-hidden rounded-2xl border-2 border-slate-300 select-none"
        style={{ width: '100%', maxWidth: VIEW_W, height: VIEW_H, transform: `translateX(${shake}px)` }}
      >
        {/* sky */}
        <div className="absolute inset-x-0 top-0" style={{ height: HORIZON_Y, background: 'linear-gradient(180deg,#7dd3fc,#bae6fd)' }} />
        <div className="absolute" style={{ left: VP_X - 16, top: 12, fontSize: 26 }}>☀️</div>

        {/* perspective road */}
        <svg className="absolute inset-0" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" height="100%" preserveAspectRatio="none">
          <rect x="0" y={HORIZON_Y} width={VIEW_W} height={VIEW_H - HORIZON_Y} fill="#4b5563" />
          <polygon
            points={`${VP_X - 30},${HORIZON_Y} ${VP_X + 30},${HORIZON_Y} ${VIEW_W + 60},${VIEW_H} ${-60},${VIEW_H}`}
            fill="#374151"
          />
          {/* lane dividers converging to the vanishing point */}
          {[0, 1].map((i) => {
            const bx = i === 0 ? (LANES[0] + LANES[1]) / 2 : (LANES[1] + LANES[2]) / 2;
            const tx = VP_X + (bx - VP_X) * CONVERGE;
            return (
              <line key={i} x1={tx} y1={HORIZON_Y} x2={bx} y2={VIEW_H} stroke="#fbbf24" strokeWidth="3" strokeDasharray="10 14" opacity="0.85" />
            );
          })}
          {/* shoulders */}
          <line x1={VP_X - 30} y1={HORIZON_Y} x2={-60} y2={VIEW_H} stroke="#e5e7eb" strokeWidth="3" />
          <line x1={VP_X + 30} y1={HORIZON_Y} x2={VIEW_W + 60} y2={VIEW_H} stroke="#e5e7eb" strokeWidth="3" />
        </svg>

        {/* hazards rushing in */}
        {drawList.map((ob) => {
          const pr = project(ob.lane, Math.min(1, ob.t));
          return (
            <div
              key={ob.id}
              className="absolute"
              style={{ left: pr.x, top: pr.y, transform: 'translate(-50%,-50%)', fontSize: pr.size, lineHeight: 1, filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.4))' }}
              aria-hidden="true"
            >
              {ob.emoji}
            </div>
          );
        })}

        {/* YOU — the big-helmeted racer, front and center */}
        <div
          className="absolute transition-[left] duration-150 ease-out"
          style={{ left: LANES[laneRef.current], top: CAR_Y, transform: 'translate(-50%,-50%)' }}
        >
          <CharMascot kind="crewmate" size={92} expr={exprRef.current} />
        </div>
      </div>

      {/* lane buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2 max-w-sm mx-auto">
        <button
          type="button"
          onClick={() => setLane(Math.max(0, laneRef.current - 1) as 0 | 1 | 2)}
          className="min-h-16 rounded-2xl bg-white border-2 border-slate-200 font-display font-extrabold text-2xl shadow active:translate-y-0.5"
        >
          ← Left
        </button>
        <button
          type="button"
          onClick={() => setLane(Math.min(2, laneRef.current + 1) as 0 | 1 | 2)}
          className="min-h-16 rounded-2xl bg-white border-2 border-slate-200 font-display font-extrabold text-2xl shadow active:translate-y-0.5"
        >
          Right →
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Swerve to dodge 🪨🥚🥕👹🐍🔺 rushing in — grab ⭐ for time!
      </p>
    </div>
  );
}
