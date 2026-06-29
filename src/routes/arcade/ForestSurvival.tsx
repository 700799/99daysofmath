import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Forest Survival — a top-down survival adventure (no math). Move your explorer
// around the forest, CHOP trees 🌳 with your axe for wood, HUNT animals with a
// spear for food, dodge wolves at night, eat to keep your hunger up, and build
// campfires to stay safe. Survive as many days as you can. Original art (emoji).

const FW = 320;
const FH = 220;
const PR = 9; // player radius
const SPEED = 78;
const ATTACK_RANGE = 30;
const DAY_LEN = 38;
const NIGHT_LEN = 26;
const CYCLE = DAY_LEN + NIGHT_LEN;

type Vec = { x: number; y: number };
type Tree = { id: number; x: number; y: number; hp: number };
type Animal = { id: number; x: number; y: number; kind: 'rabbit' | 'deer' | 'wolf'; hp: number; vx: number; vy: number; wob: number };
type Berry = { id: number; x: number; y: number };
type Fire = { x: number; y: number; life: number };
type Weapon = 'axe' | 'spear';

const ANIMAL_EMOJI: Record<Animal['kind'], string> = { rabbit: '🐰', deer: '🦌', wolf: '🐺' };
const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);
const clamp100 = (v: number) => Math.max(0, Math.min(100, v));
let ID = 1;

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Survive in the forest for as many days as you can! No math — just explore, gather, and stay alive.' },
  { heading: 'Move around', body: 'Use the arrow pad (or arrow keys / WASD) to walk your explorer 🧑‍🌾 around the woods.' },
  { heading: 'Chop & hunt (weapons)', body: 'Stand next to a tree 🌳 and tap ⚔️ with the 🪓 Axe to chop wood. Switch to the 🗡️ Spear to hunt animals 🐰🦌 for food. Tap the weapon button to swap.' },
  { heading: 'Eat & stay safe', body: 'Your hunger 🍗 drops over time — tap 🍖 Eat to use food. At night 🌙 wolves 🐺 appear and bite! Tap 🔥 to build a campfire (costs wood) — it heals you and scares wolves away.' },
  { heading: 'Survive', body: 'If your health ❤️ hits zero, the adventure ends. Beat your best day streak!' },
];
const CONTROLS = 'Arrow pad / arrow keys / WASD to move. ⚔️ attack, 🍖 eat, 🔥 build fire, and tap the weapon to swap axe/spear.';

export function ForestSurvival() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();

  const [phase, setPhase] = useState<'howto' | 'play'>('howto');
  const [weapon, setWeapon] = useState<Weapon>('axe');
  const weaponRef = useRef<Weapon>('axe');
  const [, setTick] = useState(0);

  const player = useRef<Vec & { face: Vec }>({ x: FW / 2, y: FH / 2, face: { x: 1, y: 0 } });
  const keys = useRef({ up: false, down: false, left: false, right: false });
  const trees = useRef<Tree[]>([]);
  const animals = useRef<Animal[]>([]);
  const berries = useRef<Berry[]>([]);
  const fires = useRef<Fire[]>([]);
  const stats = useRef({ health: 100, hunger: 80, wood: 0, food: 2 });
  const time = useRef(0);
  const attackCd = useRef(0);
  const hurtCd = useRef(0);
  const flash = useRef(0);
  const spawn = useRef({ prey: 0, wolf: 0, berry: 0, tree: 0 });
  const daysRef = useRef(1);
  const doneRef = useRef(false);
  const lastRef = useRef(0);
  const rafRef = useRef(0);

  const isNight = () => time.current % CYCLE >= DAY_LEN;

  const seed = () => {
    ID = 1;
    trees.current = Array.from({ length: 9 }, () => ({ id: ID++, x: 24 + Math.random() * (FW - 48), y: 24 + Math.random() * (FH - 48), hp: 3 }));
    animals.current = Array.from({ length: 3 }, () => spawnAnimal(Math.random() < 0.5 ? 'rabbit' : 'deer'));
    berries.current = Array.from({ length: 4 }, () => ({ id: ID++, x: 16 + Math.random() * (FW - 32), y: 16 + Math.random() * (FH - 32) }));
    fires.current = [];
    player.current = { x: FW / 2, y: FH / 2, face: { x: 1, y: 0 } };
    stats.current = { health: 100, hunger: 80, wood: 0, food: 2 };
    time.current = 0;
    attackCd.current = 0;
    hurtCd.current = 0;
    flash.current = 0;
    spawn.current = { prey: 0, wolf: 0, berry: 0, tree: 0 };
    daysRef.current = 1;
    doneRef.current = false;
  };

  function spawnAnimal(kind: Animal['kind']): Animal {
    const edge = Math.floor(Math.random() * 4);
    const x = edge === 0 ? 6 : edge === 1 ? FW - 6 : Math.random() * FW;
    const y = edge === 2 ? 6 : edge === 3 ? FH - 6 : Math.random() * FH;
    return { id: ID++, x, y, kind, hp: kind === 'deer' ? 3 : kind === 'wolf' ? 3 : 2, vx: 0, vy: 0, wob: Math.random() * 6 };
  }

  const start = () => {
    seed();
    setWeapon('axe');
    weaponRef.current = 'axe';
    setOutcome(null);
    setPhase('play');
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    const days = daysRef.current;
    addArcadePoints(days * 25 + stats.current.wood * 2 + stats.current.food * 3);
    const xp = Math.max(2, Math.min(20, days * 3));
    sfx.lose();
    haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('survival', xp));
  };

  const attack = () => {
    if (phase !== 'play' || doneRef.current || attackCd.current > 0) return;
    attackCd.current = 0.38;
    const p = player.current;
    const w = weaponRef.current;
    // nearest tree + nearest animal in range
    let bestTree: Tree | null = null;
    let dT = ATTACK_RANGE;
    for (const t of trees.current) {
      const d = dist(p.x, p.y, t.x, t.y);
      if (d < dT) { dT = d; bestTree = t; }
    }
    let bestAni: Animal | null = null;
    let dA = ATTACK_RANGE;
    for (const a of animals.current) {
      const d = dist(p.x, p.y, a.x, a.y);
      if (d < dA) { dA = d; bestAni = a; }
    }
    // axe prefers trees, spear prefers animals
    const goTree = bestTree && (w === 'axe' ? true : !bestAni);
    if (goTree && bestTree) {
      bestTree.hp -= w === 'axe' ? 2 : 1;
      sfx.hit(); haptic(HAPTIC.hit);
      burst((bestTree.x / FW) * 100, (bestTree.y / FH) * 100, { emoji: '🪵', count: 5 });
      if (bestTree.hp <= 0) {
        trees.current = trees.current.filter((t) => t !== bestTree);
        stats.current.wood += 2;
        sfx.pickup();
      }
    } else if (bestAni) {
      bestAni.hp -= w === 'spear' ? 2 : 1;
      sfx.hit(); haptic(HAPTIC.hit);
      // hit knockback
      const dx = bestAni.x - p.x, dy = bestAni.y - p.y, m = Math.hypot(dx, dy) || 1;
      bestAni.vx += (dx / m) * 30; bestAni.vy += (dy / m) * 30;
      if (bestAni.hp <= 0) {
        const kind = bestAni.kind;
        animals.current = animals.current.filter((a) => a !== bestAni);
        burst((bestAni.x / FW) * 100, (bestAni.y / FH) * 100, { emoji: '✨', count: 8 });
        if (kind === 'rabbit') stats.current.food += 2;
        else if (kind === 'deer') stats.current.food += 4;
        else stats.current.food += 1; // wolf
        sfx.coin();
      }
    }
    setTick((t) => t + 1);
  };

  const eat = () => {
    if (phase !== 'play' || doneRef.current) return;
    if (stats.current.food <= 0) return;
    stats.current.food -= 1;
    stats.current.hunger = clamp100(stats.current.hunger + 30);
    stats.current.health = clamp100(stats.current.health + 5);
    sfx.powerup(); haptic(HAPTIC.pickup);
    setTick((t) => t + 1);
  };

  const buildFire = () => {
    if (phase !== 'play' || doneRef.current) return;
    if (stats.current.wood < 3) return;
    stats.current.wood -= 3;
    fires.current.push({ x: player.current.x, y: player.current.y, life: 24 });
    sfx.build(); haptic(HAPTIC.heavy);
    setTick((t) => t + 1);
  };

  const swapWeapon = () => {
    const w: Weapon = weaponRef.current === 'axe' ? 'spear' : 'axe';
    weaponRef.current = w;
    setWeapon(w);
    sfx.step();
  };

  // game loop
  useEffect(() => {
    if (phase !== 'play' || outcome) return;
    lastRef.current = performance.now();
    const loop = (now: number) => {
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      step(dt);
      if (!doneRef.current) {
        setTick((t) => t + 1);
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, outcome]);

  const step = (dt: number) => {
    const p = player.current;
    const night = isNight();
    attackCd.current = Math.max(0, attackCd.current - dt);
    hurtCd.current = Math.max(0, hurtCd.current - dt);
    flash.current = Math.max(0, flash.current - dt);

    // move player
    let mx = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
    let my = (keys.current.down ? 1 : 0) - (keys.current.up ? 1 : 0);
    if (mx || my) {
      const m = Math.hypot(mx, my) || 1;
      mx /= m; my /= m;
      p.face = { x: mx, y: my };
      p.x = Math.max(PR, Math.min(FW - PR, p.x + mx * SPEED * dt));
      p.y = Math.max(PR, Math.min(FH - PR, p.y + my * SPEED * dt));
    }

    // berries pickup
    berries.current = berries.current.filter((b) => {
      if (dist(p.x, p.y, b.x, b.y) < PR + 7) {
        stats.current.food += 1;
        sfx.coin();
        burst((b.x / FW) * 100, (b.y / FH) * 100, { emoji: '🫐', count: 4 });
        return false;
      }
      return true;
    });

    // animals AI
    for (const a of animals.current) {
      a.wob += dt;
      if (a.kind === 'wolf') {
        // flee fire if near one, else chase player at night
        const nf = nearestFire(a.x, a.y);
        if (nf && nf.d < 52) {
          const dx = a.x - nf.f.x, dy = a.y - nf.f.y, m = Math.hypot(dx, dy) || 1;
          a.vx = (dx / m) * 50; a.vy = (dy / m) * 50;
        } else if (night) {
          const dx = p.x - a.x, dy = p.y - a.y, m = Math.hypot(dx, dy) || 1;
          a.vx = (dx / m) * 56; a.vy = (dy / m) * 56;
        } else {
          a.vx = Math.cos(a.wob) * 22; a.vy = Math.sin(a.wob * 0.8) * 22;
        }
      } else {
        // prey: flee player when close, else wander
        const dp = dist(p.x, p.y, a.x, a.y);
        const sp = a.kind === 'rabbit' ? 62 : 48;
        if (dp < 64) {
          const dx = a.x - p.x, dy = a.y - p.y, m = Math.hypot(dx, dy) || 1;
          a.vx = (dx / m) * sp; a.vy = (dy / m) * sp;
        } else {
          a.vx = Math.cos(a.wob * 1.3) * 26; a.vy = Math.sin(a.wob) * 26;
        }
      }
      a.x = Math.max(6, Math.min(FW - 6, a.x + a.vx * dt));
      a.y = Math.max(6, Math.min(FH - 6, a.y + a.vy * dt));
      // wolf bite
      if (a.kind === 'wolf' && hurtCd.current <= 0 && dist(p.x, p.y, a.x, a.y) < PR + 9) {
        stats.current.health = clamp100(stats.current.health - 12);
        hurtCd.current = 1.0;
        flash.current = 0.3;
        sfx.hurt(); haptic(HAPTIC.heavy);
        const dx = a.x - p.x, dy = a.y - p.y, m = Math.hypot(dx, dy) || 1;
        a.vx = (dx / m) * 80; a.vy = (dy / m) * 80;
      }
    }

    // fires burn down + heal nearby
    fires.current = fires.current.filter((f) => {
      f.life -= dt;
      if (dist(p.x, p.y, f.x, f.y) < 42) stats.current.health = clamp100(stats.current.health + 6 * dt);
      return f.life > 0;
    });

    // hunger drain → starvation
    stats.current.hunger = clamp100(stats.current.hunger - (night ? 2.2 : 1.5) * dt);
    if (stats.current.hunger <= 0) stats.current.health = clamp100(stats.current.health - 5 * dt);

    // spawns
    spawn.current.prey += dt;
    spawn.current.wolf += dt;
    spawn.current.berry += dt;
    spawn.current.tree += dt;
    if (spawn.current.prey > 6 && animals.current.filter((a) => a.kind !== 'wolf').length < 4) {
      spawn.current.prey = 0;
      animals.current.push(spawnAnimal(Math.random() < 0.5 ? 'rabbit' : 'deer'));
    }
    if (night && spawn.current.wolf > 4.5 && animals.current.filter((a) => a.kind === 'wolf').length < Math.min(5, 1 + daysRef.current)) {
      spawn.current.wolf = 0;
      animals.current.push(spawnAnimal('wolf'));
    }
    if (spawn.current.berry > 5 && berries.current.length < 5) {
      spawn.current.berry = 0;
      berries.current.push({ id: ID++, x: 16 + Math.random() * (FW - 32), y: 16 + Math.random() * (FH - 32) });
    }
    if (spawn.current.tree > 11 && trees.current.length < 9) {
      spawn.current.tree = 0;
      trees.current.push({ id: ID++, x: 24 + Math.random() * (FW - 48), y: 24 + Math.random() * (FH - 48), hp: 3 });
    }
    // at dawn, despawn lingering wolves
    const prevDay = daysRef.current;
    time.current += dt;
    daysRef.current = 1 + Math.floor(time.current / CYCLE);
    if (daysRef.current > prevDay) {
      animals.current = animals.current.filter((a) => a.kind !== 'wolf');
      sfx.levelUp();
    }

    if (stats.current.health <= 0) finish();
  };

  function nearestFire(x: number, y: number): { f: Fire; d: number } | null {
    let best: { f: Fire; d: number } | null = null;
    for (const f of fires.current) {
      const d = dist(x, y, f.x, f.y);
      if (!best || d < best.d) best = { f, d };
    }
    return best;
  }

  // keyboard
  useEffect(() => {
    if (phase !== 'play') return;
    const set = (e: KeyboardEvent, v: boolean) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') keys.current.up = v;
      else if (k === 'arrowdown' || k === 's') keys.current.down = v;
      else if (k === 'arrowleft' || k === 'a') keys.current.left = v;
      else if (k === 'arrowright' || k === 'd') keys.current.right = v;
      else if (v && (k === ' ' || k === 'enter')) { e.preventDefault(); attack(); }
      else return;
      if (k.startsWith('arrow')) e.preventDefault();
    };
    const dn = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const hold = (key: 'up' | 'down' | 'left' | 'right') => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); keys.current[key] = true; },
    onPointerUp: () => (keys.current[key] = false),
    onPointerLeave: () => (keys.current[key] = false),
    onPointerCancel: () => (keys.current[key] = false),
  });

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Forest Survival" emoji="🏕️" />
        <ArcadeEndCard
          gameId="survival"
          outcome={outcome}
          win={daysRef.current >= 5}
          scoreLine={`🏕️ Survived ${daysRef.current} day${daysRef.current === 1 ? '' : 's'}!`}
          onReplay={start}
        />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Forest Survival" emoji="🏕️" />
        <HowToPlay emoji="🏕️" title="Forest Survival" gradient="from-green-700 to-emerald-900" sections={HOWTO} controls={CONTROLS} onStart={start} />
      </div>
    );
  }

  const p = player.current;
  const s = stats.current;
  const night = isNight();
  const phaseTime = time.current % CYCLE;
  const left = night ? NIGHT_LEN - (phaseTime - DAY_LEN) : DAY_LEN - phaseTime;

  return (
    <div>
      <ArcadeHeader title="Forest Survival" emoji="🏕️" />

      {/* HUD */}
      <div className="max-w-md mx-auto mb-1 flex items-center justify-between gap-2 text-[11px] font-display font-extrabold">
        <span className="rounded-full bg-slate-800 text-white px-2.5 py-1">📅 Day {daysRef.current}</span>
        <span className={`rounded-full px-2.5 py-1 ${night ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'}`}>{night ? '🌙 Night' : '☀️ Day'} {Math.ceil(left)}s</span>
        <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1">🪵 {s.wood}</span>
        <span className="rounded-full bg-rose-100 text-rose-700 px-2.5 py-1">🍖 {s.food}</span>
      </div>
      <div className="max-w-md mx-auto mb-2 space-y-1">
        <Bar emoji="❤️" v={s.health} color="#ef4444" />
        <Bar emoji="🍗" v={s.hunger} color="#f59e0b" />
      </div>

      {/* field */}
      <GameStage theme={night ? 'night' : 'meadow'} className="max-w-md mx-auto">
        <div className="relative w-full" style={{ aspectRatio: `${FW} / ${FH}` }}>
          {flash.current > 0 && <div className="absolute inset-0 z-20 bg-rose-500/30 pointer-events-none" />}
          <BurstLayer api={{ burst, particles }} />
          {fires.current.map((f, i) => (
            <span key={`f${i}`} className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl" style={{ left: `${(f.x / FW) * 100}%`, top: `${(f.y / FH) * 100}%` }}>🔥</span>
          ))}
          {berries.current.map((b) => (
            <span key={b.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-lg" style={{ left: `${(b.x / FW) * 100}%`, top: `${(b.y / FH) * 100}%` }}>🫐</span>
          ))}
          {trees.current.map((t) => (
            <span key={t.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(t.x / FW) * 100}%`, top: `${(t.y / FH) * 100}%`, fontSize: 30 * (0.6 + 0.4 * (t.hp / 3)) }}>🌳</span>
          ))}
          {animals.current.map((a) => (
            <span key={a.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl" style={{ left: `${(a.x / FW) * 100}%`, top: `${(a.y / FH) * 100}%` }}>{ANIMAL_EMOJI[a.kind]}</span>
          ))}
          {/* player */}
          <span className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl z-10" style={{ left: `${(p.x / FW) * 100}%`, top: `${(p.y / FH) * 100}%` }}>
            🧑‍🌾
          </span>
          {attackCd.current > 0.25 && (
            <span className="absolute -translate-x-1/2 -translate-y-1/2 text-xl z-10" style={{ left: `${((p.x + p.face.x * 16) / FW) * 100}%`, top: `${((p.y + p.face.y * 16) / FH) * 100}%` }}>
              {weapon === 'axe' ? '🪓' : '🗡️'}
            </span>
          )}
        </div>
      </GameStage>

      {/* controls */}
      <div className="max-w-md mx-auto mt-3 flex items-end justify-between gap-2">
        {/* D-pad */}
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 select-none touch-none">
          <span />
          <button type="button" {...hold('up')} className="min-h-10 rounded-xl bg-white border-2 border-slate-200 font-display font-extrabold active:bg-emerald-100">▲</button>
          <span />
          <button type="button" {...hold('left')} className="min-h-10 rounded-xl bg-white border-2 border-slate-200 font-display font-extrabold active:bg-emerald-100">◀</button>
          <span className="flex items-center justify-center text-lg">🧭</span>
          <button type="button" {...hold('right')} className="min-h-10 rounded-xl bg-white border-2 border-slate-200 font-display font-extrabold active:bg-emerald-100">▶</button>
          <span />
          <button type="button" {...hold('down')} className="min-h-10 rounded-xl bg-white border-2 border-slate-200 font-display font-extrabold active:bg-emerald-100">▼</button>
          <span />
        </div>

        {/* action buttons */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          <button type="button" onClick={attack} className="min-h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">⚔️ Use</button>
          <button type="button" onClick={swapWeapon} className="min-h-14 rounded-2xl bg-slate-700 hover:bg-slate-800 text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">{weapon === 'axe' ? '🪓 Axe' : '🗡️ Spear'}</button>
          <button type="button" onClick={eat} disabled={s.food <= 0} className="min-h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-display font-extrabold active:translate-y-0.5">🍖 Eat</button>
          <button type="button" onClick={buildFire} disabled={s.wood < 3} className="min-h-12 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-display font-extrabold active:translate-y-0.5">🔥 Fire (3🪵)</button>
        </div>
      </div>

      <GameInstructions emoji="🏕️" title="Forest Survival" sections={HOWTO} controls={CONTROLS} />
    </div>
  );
}

function Bar({ emoji, v, color }: { emoji: string; v: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 text-center">{emoji}</span>
      <div className="flex-1 h-3 rounded-full bg-white/70 overflow-hidden border border-slate-200">
        <div className="h-full rounded-full transition-all" style={{ width: `${v}%`, background: color }} />
      </div>
      <span className="w-7 text-right text-[11px] font-display font-extrabold tabular-nums text-slate-600">{Math.round(v)}</span>
    </div>
  );
}
