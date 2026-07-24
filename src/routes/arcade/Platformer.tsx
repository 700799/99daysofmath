import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Dino Blaster — a Contra/Mario-style run-and-gun platformer. You play a cute
// Dino 🦖 who shoots fireballs 🔥 at baddies across 8 wildly different worlds
// (hills, desert, beach, cave, ice, jungle, sky, robot fortress) with unique
// backgrounds, enemies, and incoming rockets 🚀. The math NEVER interrupts the
// action on a timer: a "refuel your blaster" WORD problem only appears when you
// RUN OUT of ammo (solve to reload) or when you clear a level. No easy single-digit
// arithmetic — word problems from your chosen unit + level. All-emoji/SVG rendering.

const TILE = 28;
const VIEW_W = 360;
const VIEW_H = 232;
const GRAVITY = 1400;
const JUMP_VY = -540;
const MOVE_SPEED = 175;
const ENEMY_SPEED = 50;
const AMMO_MAX = 8;
const FIRE_SPEED = 330;
const FIRE_LIFE = 0.9;
const ROCKET_SPEED = 250;

// prettier-ignore
const LEVELS: string[][] = [
  ['..............................','..............................','...........C.................F','..............P.P.P..........F','......C.................C....F','..........TT........TT..PP...F','........G............G.......F','TTTTTTTTTTTTTT..TTTTTTTTTTTTTT'],
  ['..............................','...........C..................','.......P..........C..........F','...........PP..PP.............F','.....C.................C.....F','....G......TT.....TTTT.G.....F','..G..............G............','TTTTTTT...TTTTT...TTTTTTTTTTTT'],
  ['..............................','.....C.........C........C....F','..........P...........P......F','....PP........PPP.............','............C................F','.......G..........G..........F','.G..........G.................','TTTTT..TTTTT...TTTTT...TTTTTTT'],
  ['..............................','..C........C...........C.....F','...PPP....PP....PPP....PP....F','..............................','......C....C....C....C......F','.....PP...PP...PP...PP........','..G....G....G....G....G......F','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
  ['..............................','...........C..................','.....P............P..........F','.........C...........C......F','............PP........PP....F','...G..G.................G...F','G.......G............G.G....F','TTTTTT......TTTT......TTTTTTT'],
  ['...............C..............','...........P............P....F','.....C........C.....C.........','....PP....PP....PP....PP.....F','..G..G..G..G..G..G..G..G..G..','...G..G..G..G..G..G..G..G....','..............................','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
  ['..C..C..C..C..C..C..C..C..C..','.PP..PP..PP..PP..PP..PP..PP..F','..............................','.....C............C..........F','......PPP..........PPP........','..G......G......G......G....F','G............G.............G.','TTTT...TTTTTT....TTTTT..TTTTT'],
  ['..C..........C..........C....F','P............P............PP.F','.....C............C..........F','....PP............PP..........','....G..G......G..G......G....F','G..G..G..G..G..G..G..G..G..G..','..............................','TTT..TTT..TTT...TTT..TTT.TTTTT'],
];

export const PLATFORMER_LEVEL_COUNT = LEVELS.length;

type World = { name: string; sky: [string, string]; ground: string; brick: string; decor: string[]; foes: string[]; rocketEvery: number };
const WORLDS: World[] = [
  { name: 'Green Hills', sky: ['#7dd3fc', '#dbeafe'], ground: '#15803d', brick: '#a16207', decor: ['☁️', '🌳', '🌼'], foes: ['👾', '🐢'], rocketEvery: 0 },
  { name: 'Sandy Desert', sky: ['#fcd34d', '#fef3c7'], ground: '#b45309', brick: '#92400e', decor: ['☀️', '🌵', '🦴'], foes: ['🦂', '🐍'], rocketEvery: 0 },
  { name: 'Coral Beach', sky: ['#67e8f9', '#cffafe'], ground: '#0e7490', brick: '#155e75', decor: ['🌊', '🐚', '⛵'], foes: ['🦀', '🐙'], rocketEvery: 0 },
  { name: 'Crystal Cave', sky: ['#4338ca', '#1e1b4b'], ground: '#4c1d95', brick: '#312e81', decor: ['💎', '🦇', '🔮'], foes: ['🦇', '🕷️'], rocketEvery: 5 },
  { name: 'Frosty Peaks', sky: ['#bae6fd', '#e0f2fe'], ground: '#0369a1', brick: '#075985', decor: ['❄️', '⛄', '🏔️'], foes: ['🐧', '☃️'], rocketEvery: 7 },
  { name: 'Wild Jungle', sky: ['#86efac', '#bbf7d0'], ground: '#166534', brick: '#14532d', decor: ['🌴', '🦜', '🍌'], foes: ['🐒', '🐗'], rocketEvery: 6 },
  { name: 'Sky Kingdom', sky: ['#a5b4fc', '#e0e7ff'], ground: '#6d28d9', brick: '#5b21b6', decor: ['☁️', '🌈', '⭐'], foes: ['🦅', '🐝'], rocketEvery: 5 },
  { name: 'Robot Fortress', sky: ['#111827', '#1f2937'], ground: '#374151', brick: '#4b5563', decor: ['🛸', '🛰️', '🚀'], foes: ['🤖', '👽'], rocketEvery: 3 },
];

type Vec = { x: number; y: number };
type Player = Vec & { vx: number; vy: number; onGround: boolean; invuln: number; dir: number };
type Enemy = Vec & { vx: number; alive: boolean; emoji: string };
type Fireball = Vec & { vx: number; life: number };
type Rocket = Vec & { vx: number; alive: boolean };

function buildLevel(idx: number): { walls: { x: number; y: number; w: number; h: number }[]; enemySpawns: Vec[]; flagX: number; levelW: number } {
  const LEVEL = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, idx))];
  const levelW = LEVEL[0].length * TILE;
  const walls: { x: number; y: number; w: number; h: number }[] = [];
  const enemySpawns: Vec[] = [];
  let flagX = levelW;
  for (let row = 0; row < LEVEL.length; row++) {
    for (let col = 0; col < LEVEL[row].length; col++) {
      const ch = LEVEL[row][col];
      const x = col * TILE; const y = row * TILE;
      if (ch === 'T' || ch === 'P') walls.push({ x, y, w: TILE, h: TILE });
      if (ch === 'G') enemySpawns.push({ x, y: y - 4 });
      if (ch === 'F') flagX = Math.min(flagX, x);
    }
  }
  return { walls, enemySpawns, flagX, levelW };
}

export function Platformer() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const setPlatformerMaxLevel = useProgress((s) => s.setPlatformerMaxLevel);
  const platformerMaxLevel = useProgress((s) => s.platformerMaxLevel ?? 0);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLevel = (() => {
    const fromUrl = parseInt(searchParams.get('level') || '', 10);
    if (Number.isFinite(fromUrl) && fromUrl >= 0 && fromUrl < LEVELS.length) return fromUrl;
    return Math.min(platformerMaxLevel, LEVELS.length - 1);
  })();
  const [levelIdx, setLevelIdx] = useState(initialLevel);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const world = WORLDS[levelIdx % WORLDS.length];
  const level = useRef(buildLevel(levelIdx));
  const worldRef = useRef(world);
  worldRef.current = world;

  const playerRef = useRef<Player>({ x: TILE, y: TILE * 5, vx: 0, vy: 0, onGround: false, invuln: 0, dir: 1 });
  const enemiesRef = useRef<Enemy[]>([]);
  const fireRef = useRef<Fireball[]>([]);
  const rocketsRef = useRef<Rocket[]>([]);
  const livesRef = useRef(3);
  const ammoRef = useRef(AMMO_MAX);
  const cameraRef = useRef(0);
  const inputRef = useRef({ left: false, right: false, jump: false });
  const killsRef = useRef(0);
  const correctRef = useRef(0);
  const reachedFlagRef = useRef(false);
  const fireCdRef = useRef(0);
  const rocketCdRef = useRef(0);
  const rafRef = useRef(0);
  const lastTickRef = useRef(performance.now());

  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const initWorld = () => {
    const lv = level.current;
    const w = worldRef.current;
    playerRef.current = { x: TILE, y: TILE * 5, vx: 0, vy: 0, onGround: false, invuln: 0, dir: 1 };
    enemiesRef.current = lv.enemySpawns.map((s, i) => ({ ...s, vx: -ENEMY_SPEED, alive: true, emoji: w.foes[i % w.foes.length] }));
    fireRef.current = [];
    rocketsRef.current = [];
    livesRef.current = 3;
    ammoRef.current = AMMO_MAX;
    cameraRef.current = 0;
    killsRef.current = 0;
    correctRef.current = 0;
    reachedFlagRef.current = false;
    fireCdRef.current = 0;
    rocketCdRef.current = worldRef.current.rocketEvery;
    setOutcome(null);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => initWorld(), []);

  const shoot = () => {
    if (pausedRef.current) return;
    if (fireCdRef.current > 0) return;
    // out of ammo → auto-reload instantly and keep the action flowing (no math pause)
    if (ammoRef.current <= 0) { ammoRef.current = AMMO_MAX; sfx.powerup(); haptic(HAPTIC.levelUp); }
    const p = playerRef.current;
    ammoRef.current -= 1;
    fireCdRef.current = 0.22;
    fireRef.current.push({ x: p.x + (p.dir > 0 ? 18 : -6), y: p.y + 6, vx: p.dir * FIRE_SPEED, life: FIRE_LIFE });
    sfx.shoot(); haptic(HAPTIC.tap);
  };

  // Input
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') inputRef.current.jump = true;
      if (e.key === 'f' || e.key === 'x' || e.key === 'Enter') shoot();
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') inputRef.current.jump = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Main loop
  useEffect(() => {
    if (outcome) return;
    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      if (pausedRef.current) { rafRef.current = requestAnimationFrame(tick); return; }

      const p = playerRef.current;
      const inp = inputRef.current;
      const W = worldRef.current;


      p.vx = (inp.left ? -MOVE_SPEED : 0) + (inp.right ? MOVE_SPEED : 0);
      if (inp.left) p.dir = -1; else if (inp.right) p.dir = 1;
      if (inp.jump && p.onGround) { p.vy = JUMP_VY; p.onGround = false; }
      p.vy += GRAVITY * dt;

      p.x += p.vx * dt;
      for (const w of level.current.walls) {
        if (rectOverlap(p.x, p.y, 18, 22, w.x, w.y, w.w, w.h)) {
          if (p.vx > 0) p.x = w.x - 18; else if (p.vx < 0) p.x = w.x + w.w;
          p.vx = 0;
        }
      }
      p.y += p.vy * dt;
      p.onGround = false;
      for (const w of level.current.walls) {
        if (rectOverlap(p.x, p.y, 18, 22, w.x, w.y, w.w, w.h)) {
          if (p.vy > 0) { p.y = w.y - 22; p.vy = 0; p.onGround = true; }
          else if (p.vy < 0) { p.y = w.y + w.h; p.vy = 0; }
        }
      }
      if (p.y > VIEW_H + 32) {
        livesRef.current -= 1;
        if (livesRef.current <= 0) { finish(); return; }
        playerRef.current = { x: Math.max(TILE, cameraRef.current + 40), y: TILE * 3, vx: 0, vy: 0, onGround: false, invuln: 1.0, dir: 1 };
      }
      if (p.invuln > 0) p.invuln = Math.max(0, p.invuln - dt);
      if (fireCdRef.current > 0) fireCdRef.current = Math.max(0, fireCdRef.current - dt);

      // fireballs
      for (const f of fireRef.current) { f.x += f.vx * dt; f.life -= dt; }
      fireRef.current = fireRef.current.filter((f) => f.life > 0);

      // enemies
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        e.x += e.vx * dt;
        for (const w of level.current.walls) {
          if (rectOverlap(e.x, e.y, 22, 22, w.x, w.y, w.w, w.h)) {
            if (e.vx > 0) e.x = w.x - 22; else if (e.vx < 0) e.x = w.x + w.w;
            e.vx = -e.vx;
          }
        }
        // fireball kill
        for (const f of fireRef.current) {
          if (rectOverlap(f.x, f.y, 12, 12, e.x, e.y, 22, 22)) { e.alive = false; f.life = 0; killsRef.current += 1; sfx.hit(); haptic(HAPTIC.hit); break; }
        }
        if (!e.alive) continue;
        if (rectOverlap(p.x, p.y, 18, 22, e.x, e.y, 22, 22)) {
          if (p.vy > 80) { e.alive = false; p.vy = JUMP_VY * 0.7; killsRef.current += 1; }
          else if (p.invuln <= 0) {
            livesRef.current -= 1; p.invuln = 1.2; p.vy = JUMP_VY * 0.4;
            sfx.hurt(); haptic(HAPTIC.heavy);
            if (livesRef.current <= 0) { finish(); return; }
          }
        }
      }

      // rockets blasted from the right edge toward the player
      if (W.rocketEvery > 0) {
        rocketCdRef.current -= dt;
        if (rocketCdRef.current <= 0) {
          rocketCdRef.current = W.rocketEvery;
          rocketsRef.current.push({ x: cameraRef.current + VIEW_W + 12, y: Math.max(20, p.y - 6), vx: -ROCKET_SPEED, alive: true });
          sfx.laser();
        }
      }
      for (const r of rocketsRef.current) {
        if (!r.alive) continue;
        r.x += r.vx * dt;
        for (const f of fireRef.current) {
          if (rectOverlap(f.x, f.y, 12, 12, r.x, r.y, 22, 16)) { r.alive = false; f.life = 0; killsRef.current += 1; sfx.explode(); haptic(HAPTIC.explode); break; }
        }
        if (r.alive && p.invuln <= 0 && rectOverlap(p.x, p.y, 18, 22, r.x, r.y, 22, 16)) {
          r.alive = false; livesRef.current -= 1; p.invuln = 1.2; sfx.explode(); haptic(HAPTIC.explode);
          if (livesRef.current <= 0) { finish(); return; }
        }
      }
      rocketsRef.current = rocketsRef.current.filter((r) => r.alive && r.x > cameraRef.current - 40);

      // flag → level complete, finish straight away (no math pause)
      if (p.x >= level.current.flagX) { reachedFlagRef.current = true; finish(); return; }

      const target = p.x - VIEW_W * 0.35;
      cameraRef.current = Math.max(0, Math.min(target, level.current.levelW - VIEW_W));
      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const finish = () => {
    const reach = reachedFlagRef.current ? 8 + levelIdx * 2 : 0;
    const xp = Math.max(1, Math.min(20, livesRef.current * 2 + killsRef.current + correctRef.current * 2 + reach));
    if (reachedFlagRef.current && levelIdx >= platformerMaxLevel) setPlatformerMaxLevel(Math.min(LEVELS.length - 1, levelIdx + 1));
    setOutcome(recordArcadePlay('platformer', xp));
  };

  const advanceLevel = () => {
    const next = levelIdx + 1;
    if (next >= LEVELS.length) return;
    setLevelIdx(next);
    level.current = buildLevel(next);
    worldRef.current = WORLDS[next % WORLDS.length];
    setSearchParams({ level: String(next) }, { replace: true });
    initWorld();
  };
  const restartLevel = () => { level.current = buildLevel(levelIdx); worldRef.current = WORLDS[levelIdx % WORLDS.length]; initWorld(); };

  if (outcome) {
    const hasNext = reachedFlagRef.current && levelIdx + 1 < LEVELS.length;
    return (
      <div>
        <ArcadeHeader title={`Dino Blaster · ${world.name}`} emoji="🦖" />
        <ArcadeEndCard
          gameId="platformer"
          outcome={outcome}
          win={reachedFlagRef.current}
          scoreLine={reachedFlagRef.current ? `🚩 ${world.name} cleared! ${livesRef.current}❤️ · ${killsRef.current} blasted` : `Game over in ${world.name} — ${killsRef.current} blasted`}
          onReplay={restartLevel}
        />
        {hasNext && (
          <div className="mt-3 text-center">
            <button type="button" onClick={advanceLevel} className="inline-flex items-center gap-2 rounded-full bg-duo-green hover:bg-green-600 text-white font-display font-extrabold text-lg px-6 h-12 shadow-lg active:translate-y-0.5 transition">
              World {levelIdx + 2}: {WORLDS[(levelIdx + 1) % WORLDS.length].name} →
            </button>
          </div>
        )}
        {reachedFlagRef.current && !hasNext && <div className="mt-3 text-center text-sm font-display font-extrabold text-amber-700">🏆 You beat all 8 worlds!</div>}
      </div>
    );
  }

  const p = playerRef.current;
  const cam = cameraRef.current;

  return (
    <div>
      <ArcadeHeader title={`Dino Blaster · World ${levelIdx + 1}: ${world.name}`} emoji="🦖" />
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-display font-extrabold text-slate-900">{'❤️'.repeat(livesRef.current)}{'🤍'.repeat(Math.max(0, 3 - livesRef.current))}</div>
        <div className="text-sm font-display font-bold text-slate-600 tabular-nums">🔥 {ammoRef.current}/{AMMO_MAX} · 💥 {killsRef.current}</div>
      </div>

      <div className="relative mx-auto rounded-2xl border-2 border-slate-200 overflow-hidden select-none" style={{ width: '100%', maxWidth: VIEW_W, height: VIEW_H, backgroundImage: `linear-gradient(to bottom, ${world.sky[0]}, ${world.sky[1]})` }}>
        {/* parallax decor */}
        {world.decor.map((d, i) => (
          <div key={i} className="absolute text-3xl opacity-80" style={{ left: ((i * 130 + 40 - cam * 0.3) % (VIEW_W + 80)) - 40, top: 14 + (i % 3) * 30 }}>{d}</div>
        ))}
        {/* Walls */}
        {level.current.walls.map((w, i) => (
          <div key={i} className="absolute border" style={{ left: w.x - cam, top: w.y, width: w.w, height: w.h, background: world.ground, borderColor: world.brick }} />
        ))}
        {/* Flag */}
        <div className="absolute text-3xl" style={{ left: level.current.flagX - cam - 6, top: VIEW_H - TILE - 32 }}>🚩</div>
        {/* Enemies */}
        {enemiesRef.current.filter((e) => e.alive).map((e, i) => (
          <div key={i} className="absolute text-2xl" style={{ left: e.x - cam, top: e.y - 2 }}>{e.emoji}</div>
        ))}
        {/* Rockets */}
        {rocketsRef.current.filter((r) => r.alive).map((r, i) => (
          <div key={i} className="absolute text-xl" style={{ left: r.x - cam, top: r.y, transform: 'scaleX(-1)' }}>🚀</div>
        ))}
        {/* Fireballs */}
        {fireRef.current.map((f, i) => (
          <div key={i} className="absolute text-base" style={{ left: f.x - cam, top: f.y }}>🔥</div>
        ))}
        {/* Dino */}
        <div className="absolute text-2xl" style={{ left: p.x - cam, top: p.y - 6, opacity: p.invuln > 0 ? 0.5 : 1, transform: p.dir < 0 ? 'scaleX(-1)' : 'none' }}>🦖</div>
      </div>

      {/* controls */}
      <div className="mt-3 max-w-sm mx-auto grid grid-cols-4 gap-2">
        <CtlBtn label="←" onDown={() => (inputRef.current.left = true)} onUp={() => (inputRef.current.left = false)} />
        <CtlBtn label="JUMP" cls="bg-pink-500 text-white" onDown={() => (inputRef.current.jump = true)} onUp={() => (inputRef.current.jump = false)} />
        <CtlBtn label="🔥" cls="bg-orange-500 text-white" onDown={shoot} onUp={() => {}} />
        <CtlBtn label="→" onDown={() => (inputRef.current.right = true)} onUp={() => (inputRef.current.right = false)} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">Move &amp; jump, tap 🔥 to blast baddies and rockets. Reach the 🚩! Out of ammo? It reloads automatically.</p>
    </div>
  );
}

function CtlBtn({ label, cls = 'bg-white border-2 border-slate-200', onDown, onUp }: { label: string; cls?: string; onDown: () => void; onUp: () => void }) {
  return (
    <button
      type="button"
      onTouchStart={(e) => { e.preventDefault(); onDown(); }}
      onTouchEnd={(e) => { e.preventDefault(); onUp(); }}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      className={`min-h-14 rounded-2xl text-xl font-display font-extrabold ${cls}`}
    >
      {label}
    </button>
  );
}

function rectOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
