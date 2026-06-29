import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Asteroids — an original take on the classic vector shooter, built to TEACH the
// math that drives it: angles & radians (the ship's heading), trigonometry
// (thrust = [cos θ, sin θ]), vectors (velocity), velocity & acceleration
// (thrust + drag), and collision detection (circle vs circle). A live readout
// shows the heading in degrees AND radians plus the velocity vector.

const W = 360;
const H = 360;
const SHIP_R = 12;
const TURN = 3.4; // radians/sec
const THRUST = 150; // px/sec² acceleration
const DRAG = 0.6; // velocity damping per second
const MAX_SPD = 240;
const BULLET_SPD = 320;
const BULLET_LIFE = 0.9;

type Roid = { x: number; y: number; vx: number; vy: number; r: number; size: 3 | 2 | 1; spin: number; rot: number };
type Bullet = { x: number; y: number; vx: number; vy: number; life: number };

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Blast every asteroid to clear the wave. Survive as many waves as you can — they get faster!' },
  { heading: 'The math', body: 'Your ship has a heading angle θ. Thrust pushes you along [cos θ, sin θ] (trigonometry!). That adds to your velocity VECTOR, which keeps drifting (inertia) until drag slows it. Read your angle in degrees AND radians up top.' },
  { heading: 'Turn & thrust', body: 'Turn ◀ / ▶ to rotate the ship. Hold 🔥 Thrust to accelerate in the way you face. You keep gliding — plan your turns!' },
  { heading: 'Shoot', body: 'Fire bullets along your heading. Big asteroids split into two smaller ones; the smallest pop for good points.' },
  { heading: 'Collisions', body: 'If an asteroid touches your ship you lose a life (collision = circles overlapping). Lose all 3 lives and the run ends.' },
];
const CONTROLS = 'Turn ◀ ▶ · hold 🔥 Thrust · 🔫 Fire. Keyboard: ← → arrows, ↑ thrust, Space fire.';

function wrap(v: number, max: number) {
  if (v < 0) return v + max;
  if (v >= max) return v - max;
  return v;
}

function makeRoid(size: 3 | 2 | 1, x: number, y: number, speed: number): Roid {
  const ang = Math.random() * Math.PI * 2;
  const r = size === 3 ? 34 : size === 2 ? 22 : 13;
  return { x, y, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, r, size, spin: (Math.random() - 0.5) * 3, rot: 0 };
}

export function Asteroids() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'play'>('howto');

  const shipRef = useRef({ x: W / 2, y: H / 2, a: -Math.PI / 2, vx: 0, vy: 0 });
  const roidsRef = useRef<Roid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const keyRef = useRef({ left: false, right: false, thrust: false });
  const waveRef = useRef(1);
  const livesRef = useRef(Math.max(1, config.livesPerSession));
  const scoreRef = useRef(0);
  const invulnRef = useRef(1.2);
  const fireCdRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const maxLives = Math.max(1, config.livesPerSession);

  const spawnWave = (n: number) => {
    const count = 2 + n; // grows each wave
    const speed = 26 + n * 7;
    const list: Roid[] = [];
    for (let i = 0; i < count; i++) {
      // spawn at the edges, away from the centre ship
      const edge = Math.random();
      const x = edge < 0.5 ? Math.random() * W : Math.random() < 0.5 ? 0 : W;
      const y = edge < 0.5 ? (Math.random() < 0.5 ? 0 : H) : Math.random() * H;
      list.push(makeRoid(3, x, y, speed));
    }
    roidsRef.current = list;
  };

  const startGame = () => {
    shipRef.current = { x: W / 2, y: H / 2, a: -Math.PI / 2, vx: 0, vy: 0 };
    bulletsRef.current = [];
    waveRef.current = 1;
    livesRef.current = maxLives;
    scoreRef.current = 0;
    invulnRef.current = 1.2;
    fireCdRef.current = 0;
    doneRef.current = false;
    spawnWave(1);
    setPhase('play');
  };

  const fire = () => {
    if (fireCdRef.current > 0) return;
    const s = shipRef.current;
    bulletsRef.current.push({
      x: s.x + Math.cos(s.a) * SHIP_R,
      y: s.y + Math.sin(s.a) * SHIP_R,
      vx: Math.cos(s.a) * BULLET_SPD + s.vx,
      vy: Math.sin(s.a) * BULLET_SPD + s.vy,
      life: BULLET_LIFE,
    });
    fireCdRef.current = 0.22;
    sfx.shoot();
  };

  const loseLife = () => {
    livesRef.current -= 1;
    sfx.explode();
    haptic(HAPTIC.explode);
    if (livesRef.current <= 0) {
      finish();
      return;
    }
    // reset ship to centre, brief invulnerability
    shipRef.current = { x: W / 2, y: H / 2, a: -Math.PI / 2, vx: 0, vy: 0 };
    invulnRef.current = 1.4;
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(2, Math.min(20, waveRef.current * 2 + Math.floor(scoreRef.current / 200)));
    sfx.lose();
    haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('asteroids', xp));
  };

  useEffect(() => {
    if (phase !== 'play' || outcome) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      const s = shipRef.current;

      // rotate
      if (keyRef.current.left) s.a -= TURN * dt;
      if (keyRef.current.right) s.a += TURN * dt;

      // thrust: acceleration along the heading vector [cos θ, sin θ]
      if (keyRef.current.thrust) {
        s.vx += Math.cos(s.a) * THRUST * dt;
        s.vy += Math.sin(s.a) * THRUST * dt;
      }
      // drag (velocity damping) + speed clamp
      const damp = Math.max(0, 1 - DRAG * dt);
      s.vx *= damp;
      s.vy *= damp;
      const spd = Math.hypot(s.vx, s.vy);
      if (spd > MAX_SPD) { s.vx = (s.vx / spd) * MAX_SPD; s.vy = (s.vy / spd) * MAX_SPD; }
      // integrate position + screen wrap
      s.x = wrap(s.x + s.vx * dt, W);
      s.y = wrap(s.y + s.vy * dt, H);

      if (invulnRef.current > 0) invulnRef.current -= dt;
      if (fireCdRef.current > 0) fireCdRef.current -= dt;

      // asteroids drift + wrap + spin
      for (const r of roidsRef.current) {
        r.x = wrap(r.x + r.vx * dt, W);
        r.y = wrap(r.y + r.vy * dt, H);
        r.rot += r.spin * dt;
      }

      // bullets move + expire
      for (const b of bulletsRef.current) {
        b.x = wrap(b.x + b.vx * dt, W);
        b.y = wrap(b.y + b.vy * dt, H);
        b.life -= dt;
      }
      bulletsRef.current = bulletsRef.current.filter((b) => b.life > 0);

      // bullet vs asteroid collisions
      const newRoids: Roid[] = [];
      const deadBullets = new Set<Bullet>();
      for (const r of roidsRef.current) {
        let hit = false;
        for (const b of bulletsRef.current) {
          if (deadBullets.has(b)) continue;
          if (Math.hypot(b.x - r.x, b.y - r.y) < r.r) {
            hit = true;
            deadBullets.add(b);
            break;
          }
        }
        if (!hit) {
          newRoids.push(r);
          continue;
        }
        scoreRef.current += r.size === 3 ? 20 : r.size === 2 ? 50 : 100;
        sfx.hit();
        haptic(HAPTIC.hit);
        if (r.size > 1) {
          const ns = (r.size - 1) as 2 | 1;
          const sp = Math.hypot(r.vx, r.vy) * 1.2 + 12;
          newRoids.push(makeRoid(ns, r.x, r.y, sp), makeRoid(ns, r.x, r.y, sp));
        }
      }
      bulletsRef.current = bulletsRef.current.filter((b) => !deadBullets.has(b));
      roidsRef.current = newRoids;

      // ship vs asteroid collision (circle vs circle)
      if (invulnRef.current <= 0) {
        for (const r of roidsRef.current) {
          if (Math.hypot(s.x - r.x, s.y - r.y) < r.r + SHIP_R) {
            loseLife();
            break;
          }
        }
      }

      // wave cleared?
      if (roidsRef.current.length === 0 && !doneRef.current) {
        waveRef.current += 1;
        addAchievement(5);
        sfx.levelUp();
        haptic(HAPTIC.levelUp);
        invulnRef.current = 1.2;
        spawnWave(waveRef.current);
      }

      if (!doneRef.current) {
        redraw();
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, outcome]);

  // keyboard
  useEffect(() => {
    const set = (e: KeyboardEvent, v: boolean) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') keyRef.current.left = v;
      else if (k === 'arrowright' || k === 'd') keyRef.current.right = v;
      else if (k === 'arrowup' || k === 'w') keyRef.current.thrust = v;
      else if (k === ' ' || k === 'enter') { if (v) fire(); }
      else return;
      e.preventDefault();
    };
    const dn = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Asteroids" emoji="🚀" />
        <ArcadeEndCard
          gameId="asteroids"
          outcome={outcome}
          win={waveRef.current >= 5}
          scoreLine={`Reached wave ${waveRef.current} · ${scoreRef.current} pts`}
          onReplay={startGame}
        />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Asteroids" emoji="🚀" />
        <HowToPlay emoji="🚀" title="Asteroids" gradient="from-slate-700 to-indigo-900" sections={HOWTO} controls={CONTROLS} onStart={startGame} />
      </div>
    );
  }

  const s = shipRef.current;
  // heading normalised to [0, 360) for the readout
  const degRaw = (s.a * 180) / Math.PI;
  const deg = ((degRaw % 360) + 360) % 360;
  const radTau = ((s.a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const speed = Math.hypot(s.vx, s.vy);

  const hold = (key: 'left' | 'right' | 'thrust') => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); keyRef.current[key] = true; },
    onPointerUp: () => (keyRef.current[key] = false),
    onPointerLeave: () => (keyRef.current[key] = false),
    onPointerCancel: () => (keyRef.current[key] = false),
  });

  return (
    <div>
      <ArcadeHeader title="Asteroids" emoji="🚀" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}</span>
        <span className="text-slate-700">Wave {waveRef.current}</span>
        <span className="text-amber-600 tabular-nums">⭐ {scoreRef.current}</span>
      </div>

      {/* teaching readout: heading in degrees + radians, and the velocity vector */}
      <div className="max-w-sm mx-auto mb-1 grid grid-cols-2 gap-1 text-[11px] font-display font-bold">
        <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-2 py-1 text-indigo-700 tabular-nums">
          θ = {deg.toFixed(0)}° = {(radTau / Math.PI).toFixed(2)}π rad
        </div>
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-emerald-700 tabular-nums">
          v = ({s.vx.toFixed(0)}, {s.vy.toFixed(0)}) · |v|={speed.toFixed(0)}
        </div>
      </div>

      <GameStage theme="space" className="mx-auto p-2" style={{ width: 'min(100%, 60vh)' }}>
        <div className="relative mx-auto overflow-hidden rounded-xl" style={{ width: '100%', aspectRatio: '1 / 1' }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
            {/* asteroids */}
            {roidsRef.current.map((r, i) => (
              <g key={i} transform={`translate(${r.x} ${r.y}) rotate(${(r.rot * 180) / Math.PI})`}>
                <circle r={r.r} fill="#64748b" stroke="#cbd5e1" strokeWidth={2} />
                <circle r={r.r * 0.55} cx={-r.r * 0.2} cy={-r.r * 0.15} fill="#475569" />
              </g>
            ))}
            {/* bullets */}
            {bulletsRef.current.map((b, i) => (
              <circle key={`b${i}`} cx={b.x} cy={b.y} r={3} fill="#fde047" />
            ))}
            {/* ship: a triangle pointing along the heading angle */}
            <g transform={`translate(${s.x} ${s.y}) rotate(${deg})`} opacity={invulnRef.current > 0 ? 0.45 : 1}>
              <polygon points={`${SHIP_R + 4},0 ${-SHIP_R},${SHIP_R - 2} ${-SHIP_R},${-(SHIP_R - 2)}`} fill="#38bdf8" stroke="#e0f2fe" strokeWidth={2} />
              {keyRef.current.thrust && (
                <polygon points={`${-SHIP_R},4 ${-SHIP_R - 9},0 ${-SHIP_R},-4`} fill="#fb923c" />
              )}
            </g>
          </svg>
        </div>
      </GameStage>

      {/* controls */}
      <div className="max-w-sm mx-auto mt-3 flex items-center justify-between gap-2 select-none">
        <div className="flex gap-1">
          <button type="button" {...hold('left')} className="min-h-14 w-14 rounded-2xl bg-white border-2 border-slate-200 text-2xl font-display font-extrabold active:bg-slate-100">◀</button>
          <button type="button" {...hold('right')} className="min-h-14 w-14 rounded-2xl bg-white border-2 border-slate-200 text-2xl font-display font-extrabold active:bg-slate-100">▶</button>
        </div>
        <div className="flex gap-1">
          <button type="button" {...hold('thrust')} className="min-h-14 w-16 rounded-2xl bg-orange-500 text-white font-display font-extrabold">🔥</button>
          <button type="button" onPointerDown={(e) => { e.preventDefault(); fire(); }} className="min-h-14 w-16 rounded-2xl bg-rose-500 text-white font-display font-extrabold">🔫</button>
        </div>
      </div>
      <p className="text-center text-[11px] text-slate-500 mt-2">
        Thrust pushes you along [cos θ, sin θ]; you keep drifting (inertia) until drag slows you.
      </p>

      <GameInstructions emoji="🚀" title="Asteroids" sections={HOWTO} controls={CONTROLS} />
    </div>
  );
}
