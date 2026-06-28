import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer, useShake } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Space Blaster — an original Galaga/Invaders-style shooter. A formation of
// kawaii aliens shuffles down and dive-bombs your ship; clear them to advance,
// with a boss every 5th level. Power-ups, lives, and lots of juice.

const W = 360;
const H = 480;
const SHIP_Y = H - 40;
// Kawaii aliens + evil critters to blast — variety grows with the level.
const ALIENS = ['👾', '👽', '🛸', '🤖', '🦠', '🐙', '🦑', '🦂', '🦀', '🐲', '🦇', '🐍', '🪼', '👻'];
const BOSSES = ['🛸', '🐉', '👾', '🦖', '🐙', '🤖'];

type Bolt = { x: number; y: number };
type Alien = { x: number; y: number; bx: number; by: number; hp: number; emoji: string; diving: boolean; vx: number; vy: number };
type Bomb = { x: number; y: number };
type Power = { x: number; y: number; kind: 'spread' | 'rapid' | 'shield' | 'life' };

export function SpaceBlaster() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const maxLevel = useProgress((s) => s.spaceMaxLevel);
  const setMaxLevel = useProgress((s) => s.setSpaceMaxLevel);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();
  const { style: shakeStyle, shake } = useShake();

  const shipRef = useRef({ x: W / 2, cd: 0, rapid: 0, spread: 0, shield: 0 });
  const boltsRef = useRef<Bolt[]>([]);
  const aliensRef = useRef<Alien[]>([]);
  const bombsRef = useRef<Bomb[]>([]);
  const powersRef = useRef<Power[]>([]);
  const dirRef = useRef(1);
  const bossRef = useRef<{ x: number; y: number; hp: number; max: number; t: number; emoji: string } | null>(null);
  const levelRef = useRef(1);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const inputRef = useRef({ left: false, right: false, fire: false });
  const dragXRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const punch = () => { setZoom(1.12); window.setTimeout(() => setZoom(1), 250); };

  const buildLevel = (lv: number) => {
    boltsRef.current = []; bombsRef.current = []; powersRef.current = []; bossRef.current = null;
    dirRef.current = 1;
    if (lv % 5 === 0) {
      const hp = 60 + lv * 10;
      bossRef.current = { x: W / 2, y: 70, hp, max: hp, t: 0, emoji: BOSSES[Math.floor(lv / 5 - 1) % BOSSES.length] };
      aliensRef.current = [];
      sfx.boss(); haptic(HAPTIC.heavy); punch();
      return;
    }
    const cols = Math.min(8, 4 + Math.floor(lv / 2));
    const rows = Math.min(5, 2 + Math.floor(lv / 3));
    const aliens: Alien[] = [];
    // each level shows a different mix of kawaii aliens & evil critters
    const pal = ALIENS.slice(0, Math.min(ALIENS.length, 5 + (lv % 6)));
    const gapX = 36, gapY = 34, ox = (W - (cols - 1) * gapX) / 2, oy = 60;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const bx = ox + c * gapX, by = oy + r * gapY;
        aliens.push({ x: bx, y: by, bx, by, hp: 1 + Math.floor(lv / 4), emoji: pal[(r + lv) % pal.length], diving: false, vx: 0, vy: 0 });
      }
    aliensRef.current = aliens;
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setMaxLevel(Math.max(maxLevel, levelRef.current));
    addArcadePoints(scoreRef.current);
    const xp = Math.max(2, Math.min(20, levelRef.current * 2));
    sfx.lose(); haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('space', xp));
  };

  const fire = () => {
    const s = shipRef.current;
    if (s.spread > 0) {
      boltsRef.current.push({ x: s.x, y: SHIP_Y - 16 }, { x: s.x - 10, y: SHIP_Y - 10 }, { x: s.x + 10, y: SHIP_Y - 10 });
    } else {
      boltsRef.current.push({ x: s.x, y: SHIP_Y - 16 });
    }
    sfx.laser();
  };

  useEffect(() => {
    if (outcome) return;
    buildLevel(levelRef.current);
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (pausedRef.current) { lastRef.current = now; rafRef.current = requestAnimationFrame(tick); return; }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      const s = shipRef.current;
      const lv = levelRef.current;

      // ship movement
      const spd = 240;
      if (dragXRef.current != null) s.x += Math.sign(dragXRef.current - s.x) * Math.min(spd * dt, Math.abs(dragXRef.current - s.x));
      else { if (inputRef.current.left) s.x -= spd * dt; if (inputRef.current.right) s.x += spd * dt; }
      s.x = Math.max(18, Math.min(W - 18, s.x));
      if (s.rapid > 0) s.rapid -= dt;
      if (s.spread > 0) s.spread -= dt;
      if (s.shield > 0) s.shield -= dt;

      // auto-fire
      s.cd -= dt;
      if (s.cd <= 0) { s.cd = s.rapid > 0 ? 0.16 : 0.34; fire(); }

      // bolts
      for (const b of boltsRef.current) b.y -= 460 * dt;
      boltsRef.current = boltsRef.current.filter((b) => b.y > -10);

      // ---- boss or formation ----
      if (bossRef.current) {
        const boss = bossRef.current;
        boss.t += dt;
        boss.x = W / 2 + Math.sin(boss.t * 0.9) * (W / 2 - 50);
        if (Math.random() < 0.04 + lv * 0.002) bombsRef.current.push({ x: boss.x + ri(-20, 20), y: boss.y + 24 });
        // bolts vs boss
        for (const b of boltsRef.current) {
          if (Math.abs(b.x - boss.x) < 34 && Math.abs(b.y - boss.y) < 30) {
            boss.hp -= 1; b.y = -999;
            burst(b.x, b.y, { emoji: '✨', count: 4 });
          }
        }
        if (boss.hp <= 0) {
          burst(boss.x, boss.y, { emoji: '💥', count: 22 });
          sfx.explode(); haptic(HAPTIC.explode); shake();
          scoreRef.current += 500 * lv;
          nextLevel();
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
      } else {
        // formation shuffle
        let edge = false;
        const sp = 18 + lv * 4;
        for (const a of aliensRef.current) {
          if (a.diving) { a.x += a.vx * dt; a.y += a.vy * dt; }
          else {
            a.bx += dirRef.current * sp * dt;
            a.x = a.bx; a.y = a.by;
            if (a.bx < 16 || a.bx > W - 16) edge = true;
          }
        }
        if (edge) { dirRef.current *= -1; for (const a of aliensRef.current) if (!a.diving) a.by += 16; }
        // random dive
        if (Math.random() < 0.01 + lv * 0.002) {
          const cand = aliensRef.current.filter((a) => !a.diving);
          const a = cand[ri(0, cand.length - 1)];
          if (a) { a.diving = true; const dx = s.x - a.x; const d = Math.hypot(dx, SHIP_Y - a.y) || 1; a.vx = (dx / d) * 150; a.vy = (Math.abs(SHIP_Y - a.y) / d) * 150 + 60; }
        }
        // bombs from formation
        if (Math.random() < 0.02 + lv * 0.003 && aliensRef.current.length) {
          const a = aliensRef.current[ri(0, aliensRef.current.length - 1)];
          bombsRef.current.push({ x: a.x, y: a.y + 12 });
        }
        // bolts vs aliens
        for (const b of boltsRef.current) {
          for (const a of aliensRef.current) {
            if (a.hp > 0 && Math.abs(b.x - a.x) < 16 && Math.abs(b.y - a.y) < 16) {
              a.hp -= 1; b.y = -999;
              if (a.hp <= 0) {
                scoreRef.current += 50 * lv;
                burst(a.x, a.y, { emoji: '💥', count: 6 });
                sfx.hit();
                if (Math.random() < 0.08) powersRef.current.push({ x: a.x, y: a.y, kind: (['spread', 'rapid', 'shield', 'life'] as const)[ri(0, 3)] });
              }
              break;
            }
          }
        }
        aliensRef.current = aliensRef.current.filter((a) => a.hp > 0);
        // aliens reaching the bottom or hitting ship
        for (const a of aliensRef.current) {
          if (a.y > SHIP_Y - 6) { hitShip(); a.hp = 0; }
        }
        aliensRef.current = aliensRef.current.filter((a) => a.hp > 0);
        if (aliensRef.current.length === 0) { nextLevel(); rafRef.current = requestAnimationFrame(tick); return; }
      }

      // bombs fall
      for (const bomb of bombsRef.current) bomb.y += (120 + lv * 5) * dt;
      for (const bomb of bombsRef.current) {
        if (bomb.y > SHIP_Y - 12 && Math.abs(bomb.x - s.x) < 18) { hitShip(); bomb.y = 9999; }
      }
      bombsRef.current = bombsRef.current.filter((b) => b.y < H + 10);

      // power-ups
      for (const p of powersRef.current) p.y += 90 * dt;
      for (const p of powersRef.current) {
        if (p.y > SHIP_Y - 16 && Math.abs(p.x - s.x) < 20) {
          if (p.kind === 'spread') s.spread = 8;
          else if (p.kind === 'rapid') s.rapid = 8;
          else if (p.kind === 'shield') s.shield = 6;
          else livesRef.current += 1;
          sfx.powerup(); haptic(HAPTIC.pickup);
          p.y = 9999;
        }
      }
      powersRef.current = powersRef.current.filter((p) => p.y < H + 10);

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };

    const hitShip = () => {
      const s = shipRef.current;
      if (s.shield > 0) { s.shield = 0; sfx.hit(); haptic(HAPTIC.hit); return; }
      livesRef.current -= 1;
      sfx.hurt(); haptic(HAPTIC.heavy); shake();
      if (livesRef.current <= 0) { finish(); }
    };

    const nextLevel = () => {
      levelRef.current += 1;
      setMaxLevel(Math.max(maxLevel, levelRef.current));
      sfx.levelUp(); haptic(HAPTIC.levelUp); punch();
      buildLevel(levelRef.current);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  // keyboard
  useEffect(() => {
    const set = (e: KeyboardEvent, v: boolean) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') inputRef.current.left = v;
      else if (k === 'arrowright' || k === 'd') inputRef.current.right = v;
      else if (k === ' ') { inputRef.current.fire = v; if (v) fire(); }
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

  const reset = () => {
    shipRef.current = { x: W / 2, cd: 0, rapid: 0, spread: 0, shield: 0 };
    levelRef.current = 1; scoreRef.current = 0; livesRef.current = 3; doneRef.current = false;
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Space Blaster" emoji="🚀" />
        <ArcadeEndCard
          gameId="space"
          outcome={outcome}
          win={levelRef.current >= 5}
          scoreLine={`Reached level ${levelRef.current} · ${scoreRef.current.toLocaleString()} pts`}
          onReplay={reset}
        />
      </div>
    );
  }

  const s = shipRef.current;
  const boss = bossRef.current;

  const toX = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * W;
  };

  return (
    <div>
      <ArcadeHeader title="Space Blaster" emoji="🚀" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-rose-600">{'🚀'.repeat(Math.max(0, livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current.toLocaleString()}</span>
        <span className="text-indigo-600">{levelRef.current % 5 === 0 ? '☠️ BOSS' : `Lv ${levelRef.current}`}</span>
      </div>

      <GameStage theme="space" className="mx-auto" style={{ width: 'min(100%, 42vh)' }}>
        <div
          className="relative overflow-hidden mx-auto touch-none"
          style={{ width: '100%', aspectRatio: `${W} / ${H}`, ...shakeStyle }}
          onPointerDown={(e) => { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); dragXRef.current = toX(e.clientX, e.currentTarget); }}
          onPointerMove={(e) => { if (dragXRef.current != null) dragXRef.current = toX(e.clientX, e.currentTarget); }}
          onPointerUp={() => (dragXRef.current = null)}
          onPointerLeave={() => (dragXRef.current = null)}
        >
          <BurstLayer api={{ burst, particles }} />
          <div className="absolute inset-0 transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
            {/* aliens */}
            {aliensRef.current.map((a, i) => (
              <Spr key={`a${i}`} x={a.x} y={a.y} s={22} e={a.emoji} />
            ))}
            {/* boss */}
            {boss && (
              <>
                <Spr x={boss.x} y={boss.y} s={56} e={boss.emoji} />
                <div className="absolute" style={{ left: '10%', top: 8, width: '80%' }}>
                  <div className="h-1.5 rounded-full bg-rose-900/50 overflow-hidden">
                    <div className="h-full bg-rose-400" style={{ width: `${(boss.hp / boss.max) * 100}%` }} />
                  </div>
                </div>
              </>
            )}
            {/* bombs */}
            {bombsRef.current.map((b, i) => (<Spr key={`bo${i}`} x={b.x} y={b.y} s={16} e="💣" />))}
            {/* power-ups */}
            {powersRef.current.map((p, i) => (
              <Spr key={`p${i}`} x={p.x} y={p.y} s={18} e={p.kind === 'spread' ? '🔱' : p.kind === 'rapid' ? '⚡' : p.kind === 'shield' ? '🛡️' : '❤️'} />
            ))}
            {/* bolts */}
            {boltsRef.current.map((b, i) => (
              <div key={`bt${i}`} className="absolute rounded-full bg-cyan-300" style={{ left: `${(b.x / W) * 100}%`, top: `${(b.y / H) * 100}%`, width: 5, height: 12, transform: 'translate(-50%,-50%)', boxShadow: '0 0 6px #67e8f9' }} />
            ))}
            {/* ship */}
            <Spr x={s.x} y={SHIP_Y} s={32} e="🚀" />
            {s.shield > 0 && (
              <div className="absolute rounded-full border-2 border-cyan-300/70" style={{ left: `${(s.x / W) * 100}%`, top: `${(SHIP_Y / H) * 100}%`, width: 40, height: 40, transform: 'translate(-50%,-50%)' }} />
            )}
          </div>
        </div>
      </GameStage>

      <div className="max-w-sm mx-auto mt-3 flex gap-2 select-none">
        <Hold label="◀" on={() => (inputRef.current.left = true)} off={() => (inputRef.current.left = false)} />
        <button type="button" onPointerDown={(e) => { e.preventDefault(); fire(); }} className="flex-1 min-h-12 rounded-2xl bg-cyan-500 text-white font-display font-extrabold text-lg active:translate-y-0.5">FIRE 🔫</button>
        <Hold label="▶" on={() => (inputRef.current.right = true)} off={() => (inputRef.current.right = false)} />
      </div>
      <p className="text-center text-[11px] text-slate-500 mt-2">
        Drag or ◀ ▶ to move; auto-fires (Space too). Clear each wave — boss every 5 levels!
      </p>
    </div>
  );
}

function ri(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function Spr({ x, y, s, e }: { x: number; y: number; s: number; e: string }) {
  return (
    <div className="absolute select-none" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, transform: 'translate(-50%,-50%)', fontSize: s, lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
      {e}
    </div>
  );
}

function Hold({ label, on, off }: { label: string; on: () => void; off: () => void }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.preventDefault(); on(); }}
      onPointerUp={off}
      onPointerLeave={off}
      className="min-h-12 w-16 rounded-2xl bg-white border-2 border-slate-200 text-xl font-display font-extrabold text-slate-700 active:bg-slate-100"
    >
      {label}
    </button>
  );
}
