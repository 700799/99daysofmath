import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { makeChallenge, type Challenge } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Jungle Blitz — an original run-and-gun platformer (Contra-style vibe, all
// original art). Run right, jump one-way platforms, shoot in 8 directions. To
// claim a weapon power-up you must open the supply drawer and solve a math
// problem — you can't close it until you do. Reach the flag to clear the stage.

const VW = 360;
const VH = 300;
const GROUND_Y = 244;
const GRAV = 1500;
const JUMP_V = -560;
const RUN = 160;
const BULLET_SPEED = 420;
const POOL = 60;

type Bullet = { active: boolean; x: number; y: number; vx: number; vy: number };
type Enemy = { x: number; y: number; hp: number; emoji: string; vx: number; w: number };
type Plat = { x: number; y: number; w: number };
type Crate = { x: number; taken: boolean };

const BLITZ_CONTROLS = '◀ ▶ move · JUMP (or Space / swipe up) · FIRE (or Z/X) · hold ⬆️/⬇️ to aim.';
const BLITZ_SECTIONS: HowToSection[] = [
  { heading: 'Goal', body: 'Run and gun to the 🏁 flag at the end of each stage. Survive the jungle of enemies!' },
  { heading: 'Move & jump', body: 'Run left/right, jump onto floating platforms (you can hop up THROUGH them and land on top).' },
  { heading: 'Shoot 8 ways', body: 'Fire in the direction you face; hold ⬆️ Up to aim upward, or ⬇️ Down while jumping to aim down — for diagonal shots.' },
  { heading: 'Supply drawers', body: 'Touch a 📦 supply crate to open the supply drawer. Solve the math problem to claim a SPREAD GUN + bonus life — you can’t close the drawer until you solve it!' },
  { heading: 'Lives', body: 'Touching an enemy costs a life. Lose all 3 and the run ends.' },
];

export function JungleBlitz() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();

  const [phase, setPhase] = useState<'howto' | 'play'>('howto');
  const player = useRef({ x: 60, y: GROUND_Y - 24, vx: 0, vy: 0, onGround: true, face: 1, weapon: 'single' as 'single' | 'spread', wt: 0 });
  const camRef = useRef(0);
  const inRef = useRef({ left: false, right: false, up: false, down: false });
  const bulletsRef = useRef<Bullet[]>(Array.from({ length: POOL }, () => ({ active: false, x: 0, y: 0, vx: 0, vy: 0 })));
  const enemiesRef = useRef<Enemy[]>([]);
  const platsRef = useRef<Plat[]>([]);
  const cratesRef = useRef<Crate[]>([]);
  const goalRef = useRef(2400);
  const spawnRef = useRef(1.2);
  const fireCdRef = useRef(0);
  const livesRef = useRef(3);
  const iframeRef = useRef(0);
  const scoreRef = useRef(0);
  const stageRef = useRef(1);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [drawer, setDrawer] = useState<Challenge | null>(null);
  const [drawerInput, setDrawerInput] = useState('');
  const drawerRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const buildStage = (st: number) => {
    const p = player.current;
    p.x = 60; p.y = GROUND_Y - 24; p.vx = 0; p.vy = 0; p.onGround = true; p.face = 1; p.weapon = 'single'; p.wt = 0;
    camRef.current = 0;
    goalRef.current = 2000 + st * 400;
    enemiesRef.current = [];
    bulletsRef.current.forEach((b) => (b.active = false));
    spawnRef.current = 1;
    // platforms
    const plats: Plat[] = [];
    for (let x = 300; x < goalRef.current - 200; x += 280 + Math.random() * 160) {
      plats.push({ x, y: GROUND_Y - 50 - Math.random() * 70, w: 70 + Math.random() * 50 });
    }
    platsRef.current = plats;
    // supply crates
    cratesRef.current = [];
    for (let x = 500; x < goalRef.current - 300; x += 700) cratesRef.current.push({ x, taken: false });
  };

  const start = () => {
    livesRef.current = 3; scoreRef.current = 0; stageRef.current = 1; doneRef.current = false;
    buildStage(1); setDrawer(null); drawerRef.current = false; setOutcome(null); setPhase('play');
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current + stageRef.current * 50);
    const xp = Math.max(2, Math.min(20, stageRef.current * 3 + Math.floor(scoreRef.current / 50)));
    sfx.lose(); haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('blitz', xp));
  };

  const fire = () => {
    const p = player.current;
    if (fireCdRef.current > 0 || drawerRef.current) return;
    fireCdRef.current = p.weapon === 'spread' ? 0.18 : 0.22;
    // aim from facing + up/down
    let ax = p.face, ay = 0;
    if (inRef.current.up) ay = -1;
    else if (inRef.current.down && !p.onGround) ay = 1;
    const norm = Math.hypot(ax, ay) || 1;
    ax /= norm; ay /= norm;
    const spawn = (dx: number, dy: number) => {
      const b = bulletsRef.current.find((q) => !q.active);
      if (!b) return;
      b.active = true; b.x = p.x + 12 * p.face; b.y = p.y - 4; b.vx = dx * BULLET_SPEED; b.vy = dy * BULLET_SPEED;
    };
    if (p.weapon === 'spread') {
      const ang = Math.atan2(ay, ax);
      for (const d of [-0.35, 0, 0.35]) spawn(Math.cos(ang + d), Math.sin(ang + d));
    } else spawn(ax, ay);
    sfx.shoot();
  };

  useEffect(() => {
    if (outcome || phase !== 'play') return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (pausedRef.current || drawerRef.current) { lastRef.current = now; rafRef.current = requestAnimationFrame(tick); return; }
      const dt = Math.min(0.04, (now - lastRef.current) / 1000);
      lastRef.current = now;
      const p = player.current;
      if (fireCdRef.current > 0) fireCdRef.current -= dt;
      if (iframeRef.current > 0) iframeRef.current -= dt;
      if (p.wt > 0) { p.wt -= dt; if (p.wt <= 0) p.weapon = 'single'; }

      // horizontal
      p.vx = (inRef.current.right ? RUN : 0) - (inRef.current.left ? RUN : 0);
      if (p.vx !== 0) p.face = p.vx > 0 ? 1 : -1;
      p.x = Math.max(20, Math.min(goalRef.current, p.x + p.vx * dt));

      // gravity + platforms (one-way)
      p.vy += GRAV * dt;
      const prevY = p.y;
      p.y += p.vy * dt;
      p.onGround = false;
      if (p.y >= GROUND_Y - 24) { p.y = GROUND_Y - 24; p.vy = 0; p.onGround = true; }
      for (const pl of platsRef.current) {
        if (p.vy > 0 && prevY - 24 <= pl.y && p.y - 0 >= pl.y - 24 && p.x > pl.x - pl.w / 2 && p.x < pl.x + pl.w / 2) {
          p.y = pl.y - 24; p.vy = 0; p.onGround = true;
        }
      }

      // camera
      camRef.current = Math.max(0, Math.min(goalRef.current - VW + 60, p.x - 100));

      // reach goal → next stage
      if (p.x >= goalRef.current - 10) {
        stageRef.current += 1;
        scoreRef.current += 100;
        sfx.levelUp(); haptic(HAPTIC.levelUp);
        buildStage(stageRef.current);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // spawn enemies ahead
      spawnRef.current -= dt;
      if (spawnRef.current <= 0 && enemiesRef.current.length < 8) {
        spawnRef.current = Math.max(0.5, 1.4 - stageRef.current * 0.08);
        const ex = camRef.current + VW + 20;
        enemiesRef.current.push({ x: ex, y: GROUND_Y - 22, hp: 1 + Math.floor(stageRef.current / 3), emoji: ['👾', '🤖', '🦂', '👹'][Math.floor(Math.random() * 4)], vx: -(40 + stageRef.current * 6), w: 22 });
      }
      // move enemies
      for (const e of enemiesRef.current) {
        e.x += e.vx * dt;
        if (Math.abs(e.x - p.x) < 18 && Math.abs(e.y - p.y) < 28 && iframeRef.current <= 0) {
          livesRef.current -= 1; iframeRef.current = 1.2; sfx.hurt(); haptic(HAPTIC.heavy);
          if (livesRef.current <= 0) { finish(); return; }
        }
      }
      enemiesRef.current = enemiesRef.current.filter((e) => e.x > camRef.current - 60);

      // bullets
      for (const b of bulletsRef.current) {
        if (!b.active) continue;
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < camRef.current - 40 || b.x > camRef.current + VW + 40 || b.y < 0 || b.y > VH) { b.active = false; continue; }
        for (const e of enemiesRef.current) {
          if (e.hp > 0 && Math.abs(b.x - e.x) < e.w && Math.abs(b.y - e.y) < 22) {
            e.hp -= 1; b.active = false;
            if (e.hp <= 0) { scoreRef.current += 10; burst(e.x - camRef.current, e.y, { emoji: '💥', count: 6 }); sfx.hit(); }
            break;
          }
        }
      }
      enemiesRef.current = enemiesRef.current.filter((e) => e.hp > 0);

      // supply crate pickup → math drawer
      for (const c of cratesRef.current) {
        if (!c.taken && Math.abs(c.x - p.x) < 22) {
          c.taken = true;
          drawerRef.current = true;
          setDrawer(makeChallenge(Math.min(5, 1 + Math.floor(stageRef.current / 2))));
          setDrawerInput('');
        }
      }

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, phase]);

  // keys
  useEffect(() => {
    const set = (e: KeyboardEvent, v: boolean) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') inRef.current.left = v;
      else if (k === 'arrowright' || k === 'd') inRef.current.right = v;
      else if (k === 'arrowup' || k === 'w') inRef.current.up = v;
      else if (k === 'arrowdown' || k === 's') inRef.current.down = v;
      else if (k === ' ') { if (v) jump(); }
      else if (k === 'z' || k === 'x' || k === 'enter') { if (v) fire(); }
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

  const jump = () => {
    const p = player.current;
    if (p.onGround && !drawerRef.current) { p.vy = JUMP_V; p.onGround = false; sfx.step(); haptic(HAPTIC.tap); }
  };

  const resolveDrawer = () => {
    if (!drawer) return;
    const ok = Number(drawerInput.trim()) === drawer.answer && drawerInput.trim() !== '';
    if (!ok) { sfx.hurt(); haptic(HAPTIC.hit); setDrawer(makeChallenge(Math.min(5, 1 + Math.floor(stageRef.current / 2)))); setDrawerInput(''); return; }
    addAchievement(10);
    const p = player.current;
    p.weapon = 'spread'; p.wt = 18;
    livesRef.current = Math.min(5, livesRef.current + 1);
    sfx.powerup(); haptic(HAPTIC.levelUp);
    setDrawer(null); drawerRef.current = false; lastRef.current = performance.now();
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Jungle Blitz" emoji="🪖" />
        <ArcadeEndCard gameId="blitz" outcome={outcome} win={stageRef.current >= 3} scoreLine={`Stage ${stageRef.current} · ${scoreRef.current} pts`} onReplay={start} />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Jungle Blitz" emoji="🪖" />
        <HowToPlay
          emoji="🪖"
          title="Jungle Blitz"
          gradient="from-green-700 to-lime-700"
          sections={BLITZ_SECTIONS}
          controls={BLITZ_CONTROLS}
          onStart={start}
        />
      </div>
    );
  }

  const cam = camRef.current;
  const p = player.current;

  return (
    <div>
      <ArcadeHeader title="Jungle Blitz" emoji="🪖" />
      <div className="flex justify-between items-center mb-1 max-w-md mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}</span>
        <span className="text-slate-700">⭐ {scoreRef.current}</span>
        <span className="text-indigo-600">Stage {stageRef.current} {p.weapon === 'spread' ? '· 🔱 Spread' : ''}</span>
      </div>

      <GameStage theme="meadow" className="max-w-md mx-auto" style={{ width: 'min(100%, 60vh)' }}>
        <div
          className="relative overflow-hidden mx-auto touch-none"
          style={{ width: '100%', aspectRatio: `${VW} / ${VH}` }}
          onPointerDown={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); if ((e.clientY - r.top) / r.height < 0.5) jump(); else fire(); }}
        >
          {/* ground */}
          <div className="absolute left-0 right-0" style={{ top: `${(GROUND_Y / VH) * 100}%`, bottom: 0, background: '#3f6212' }} />
          {/* platforms */}
          {platsRef.current.map((pl, i) => {
            const sx = pl.x - cam;
            if (sx < -120 || sx > VW + 120) return null;
            return <div key={i} className="absolute rounded" style={{ left: `${((sx - pl.w / 2) / VW) * 100}%`, top: `${(pl.y / VH) * 100}%`, width: `${(pl.w / VW) * 100}%`, height: 8, background: '#65a30d' }} />;
          })}
          {/* goal flag */}
          {goalRef.current - cam < VW + 40 && (
            <div className="absolute" style={{ left: `${((goalRef.current - cam) / VW) * 100}%`, top: `${((GROUND_Y - 30) / VH) * 100}%`, fontSize: 28 }}>🏁</div>
          )}
          {/* crates */}
          {cratesRef.current.map((c, i) => (!c.taken && Math.abs(c.x - cam) < VW + 40) ? (
            <div key={i} className="absolute" style={{ left: `${((c.x - cam) / VW) * 100}%`, top: `${((GROUND_Y - 22) / VH) * 100}%`, transform: 'translateX(-50%)', fontSize: 22 }}>📦</div>
          ) : null)}
          {/* enemies */}
          {enemiesRef.current.map((e, i) => (
            <div key={i} className="absolute" style={{ left: `${((e.x - cam) / VW) * 100}%`, top: `${(e.y / VH) * 100}%`, transform: 'translate(-50%,-50%) scaleX(-1)', fontSize: 24 }}>{e.emoji}</div>
          ))}
          {/* bullets */}
          {bulletsRef.current.map((b, i) => b.active ? (
            <div key={i} className="absolute rounded-full bg-yellow-300" style={{ left: `${((b.x - cam) / VW) * 100}%`, top: `${(b.y / VH) * 100}%`, width: 6, height: 6, transform: 'translate(-50%,-50%)', boxShadow: '0 0 5px #fde047' }} />
          ) : null)}
          {/* player */}
          <div className="absolute" style={{ left: `${((p.x - cam) / VW) * 100}%`, top: `${(p.y / VH) * 100}%`, transform: `translate(-50%,-50%) scaleX(${p.face})`, fontSize: 26, opacity: iframeRef.current > 0 ? 0.5 : 1 }}>🪖</div>
          <BurstLayer api={{ burst, particles }} />
        </div>
      </GameStage>

      {/* controls */}
      <div className="max-w-md mx-auto mt-2 flex items-center justify-between gap-2 select-none">
        <div className="flex gap-1">
          <Hold label="◀" on={() => (inRef.current.left = true)} off={() => (inRef.current.left = false)} />
          <Hold label="▶" on={() => (inRef.current.right = true)} off={() => (inRef.current.right = false)} />
        </div>
        <div className="flex gap-1">
          <Hold label="⬆️" on={() => (inRef.current.up = true)} off={() => (inRef.current.up = false)} />
          <button type="button" onPointerDown={(e) => { e.preventDefault(); jump(); }} className="min-h-12 w-14 rounded-2xl bg-sky-500 text-white font-display font-extrabold">JUMP</button>
          <button type="button" onPointerDown={(e) => { e.preventDefault(); fire(); }} className="min-h-12 w-14 rounded-2xl bg-rose-500 text-white font-display font-extrabold">FIRE</button>
        </div>
      </div>
      <p className="text-center text-[11px] text-slate-500 mt-2">Tap top half = jump, bottom half = fire. Reach the 🏁! Open 📦 and solve to get the spread gun.</p>

      {drawer && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-900/70 backdrop-blur-sm p-4 pt-6">
          <div className="mx-auto w-full max-w-sm rounded-t-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">📦</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Supply Drawer — solve to claim the 🔱 Spread Gun!</div>
            <div className="text-[11px] font-display font-bold text-rose-500">You can’t close this until you solve it.</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold leading-snug break-words">{drawer.prompt}</div>
            <input autoFocus inputMode="numeric" value={drawerInput} onChange={(e) => setDrawerInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && resolveDrawer()}
              className="mt-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-center text-xl font-display font-extrabold focus:border-emerald-500 focus:outline-none" placeholder="?" />
            <button type="button" onClick={resolveDrawer} className="mt-3 w-full min-h-11 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">Claim 🔱</button>
          </div>
        </div>
      )}

      <GameInstructions emoji="🪖" title="Jungle Blitz" sections={BLITZ_SECTIONS} controls={BLITZ_CONTROLS} />
    </div>
  );
}

function Hold({ label, on, off }: { label: string; on: () => void; off: () => void }) {
  return (
    <button type="button" onPointerDown={(e) => { e.preventDefault(); on(); }} onPointerUp={off} onPointerLeave={off}
      className="min-h-12 w-12 rounded-2xl bg-white border-2 border-slate-200 text-xl font-display font-extrabold text-slate-700 active:bg-slate-100">
      {label}
    </button>
  );
}
