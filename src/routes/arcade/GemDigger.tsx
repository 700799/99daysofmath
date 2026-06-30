import { memo, useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';
import { chooseGhostDir, DIRS, UP, DOWN, LEFT, RIGHT, type Dir } from './mazeAI';

// "Gem Digger" — a Dig Dug. Tunnel through the dirt to collect every gem while
// monsters pursue you through the tunnels (and dig after you once they wake up).
// Loosen a boulder by digging beneath it to crush a chaser. Caught or crushed
// and you do a quick math lesson and lose a life. Clear the gems to advance.

const COLS = 7;
const ROWS = 7;
const TILE = 52;
const W = COLS * TILE;
const H = ROWS * TILE;
const FALL_SPEED = 6; // tiles / sec

type Mob = { c: number; r: number; tc: number; tr: number; prog: number; dir: Dir | null };
type Monster = Mob & { home: { c: number; r: number }; canDig: boolean };
type Rock = { c: number; y: number; stop: number; falling: boolean; dead: boolean };

const GEM_EMOJI = ['💎', '💍', '👑', '🔶', '🔷', '🟣', '🔴', '🟢', '🟡', '🪙', '💠', '🟠'];
const GEM_CELLS = [
  [1, 1], [4, 1], [2, 2], [5, 2], [3, 4], [5, 4], [2, 6], [4, 6],
];
const ROCK_CELLS = [
  [3, 2], [1, 3], [5, 3],
];
const MONSTER_SPAWNS = [
  { c: COLS - 2, r: 1 },
  { c: COLS - 2, r: ROWS - 2 },
  { c: 3, r: 1 },
];

function renderPos(m: Mob): { x: number; y: number } {
  return { x: m.c + (m.tc - m.c) * m.prog, y: m.r + (m.tr - m.r) * m.prog };
}

const DirtLayer = memo(function DirtLayer({ dirt }: { dirt: boolean[][]; version: number }) {
  const cells: { c: number; r: number }[] = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (dirt[r][c]) cells.push({ c, r });
  return (
    <>
      {cells.map(({ c, r }) => (
        <div
          key={`${c},${r}`}
          className="absolute"
          style={{
            left: c * TILE,
            top: r * TILE,
            width: TILE,
            height: TILE,
            background: (c + r) % 2 === 0 ? '#92400e' : '#7c360b',
          }}
        />
      ))}
    </>
  );
});

export function GemDigger() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const dirtRef = useRef<boolean[][]>([]);
  const gemsRef = useRef<Map<string, string>>(new Map());
  const rocksRef = useRef<Rock[]>([]);
  const playerRef = useRef<Mob>({ c: 1, r: ROWS - 2, tc: 1, tr: ROWS - 2, prog: 0, dir: null });
  const monstersRef = useRef<Monster[]>([]);
  const nextDirRef = useRef<Dir | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const faceRef = useRef(1);
  const elapsedRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const levelRef = useRef(config.startLevel);
  const lastRef = useRef(0);
  const rafRef = useRef(0);

  const [dirtVersion, setDirtVersion] = useState(0);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  // Fill the refs for the current level. No React state writes, so it's safe to
  // call during the first render to seed the cave.
  function populate() {
    const dirt: boolean[][] = [];
    for (let r = 0; r < ROWS; r++) {
      dirt[r] = [];
      for (let c = 0; c < COLS; c++) dirt[r][c] = true;
    }
    // carve player start + monster pockets
    dirt[ROWS - 2][1] = false;
    const count = Math.min(3, 1 + levelRef.current);
    const spawns = MONSTER_SPAWNS.slice(0, count);
    spawns.forEach((s) => (dirt[s.r][s.c] = false));
    dirtRef.current = dirt;

    const gems = new Map<string, string>();
    GEM_CELLS.forEach(([c, r]) => {
      if (dirt[r]?.[c] !== undefined && !(c === 1 && r === ROWS - 2))
        gems.set(`${c},${r}`, GEM_EMOJI[Math.floor(Math.random() * GEM_EMOJI.length)]);
    });
    gemsRef.current = gems;

    rocksRef.current = ROCK_CELLS.map(([c, r]) => ({ c, y: r, stop: r, falling: false, dead: false }));

    playerRef.current = { c: 1, r: ROWS - 2, tc: 1, tr: ROWS - 2, prog: 0, dir: null };
    nextDirRef.current = null;
    monstersRef.current = spawns.map((s) => ({
      c: s.c,
      r: s.r,
      tc: s.c,
      tr: s.r,
      prog: 0,
      dir: null,
      home: { c: s.c, r: s.r },
      canDig: false,
    }));
  }

  const loadLevel = () => {
    populate();
    setDirtVersion((v) => v + 1);
  };

  const respawn = () => {
    const p = playerRef.current;
    p.c = p.tc = 1;
    p.r = p.tr = ROWS - 2;
    p.prog = 0;
    p.dir = null;
    nextDirRef.current = null;
    monstersRef.current.forEach((m) => {
      m.c = m.tc = m.home.c;
      m.r = m.tr = m.home.r;
      m.prog = 0;
      m.dir = null;
      m.canDig = false;
    });
    elapsedRef.current = 0;
  };

  const inited = useRef(false);
  if (!inited.current) {
    inited.current = true;
    populate();
  }

  const rockAt = (c: number, r: number, except?: Rock): boolean =>
    rocksRef.current.some((rk) => !rk.dead && rk !== except && rk.c === c && Math.round(rk.y) === r);

  const dig = (c: number, r: number) => {
    if (dirtRef.current[r]?.[c]) {
      dirtRef.current[r][c] = false;
      setDirtVersion((v) => v + 1);
    }
    const k = `${c},${r}`;
    if (gemsRef.current.has(k)) {
      gemsRef.current.delete(k);
      scoreRef.current += 100;
      sfx.coin(); buzz(HAPTIC.pickup);
    }
  };

  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();

    const playerWall = (c: number, r: number) =>
      c < 0 || c >= COLS || r < 0 || r >= ROWS || rockAt(c, r);

    const monsterWall = (canDig: boolean) => (c: number, r: number) => {
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return true;
      if (rockAt(c, r)) return true;
      if (!canDig && dirtRef.current[r][c]) return true;
      return false;
    };

    const decidePlayer = (m: Mob) => {
      const want = nextDirRef.current;
      if (want && !playerWall(m.c + want.dx, m.r + want.dy)) m.dir = want;
      if (m.dir && !playerWall(m.c + m.dir.dx, m.r + m.dir.dy)) {
        m.tc = m.c + m.dir.dx;
        m.tr = m.r + m.dir.dy;
        if (m.dir.dx !== 0) faceRef.current = m.dir.dx > 0 ? 1 : -1;
      } else {
        m.dir = null;
      }
    };

    const decideMonster = (mon: Monster) => {
      const wall = monsterWall(mon.canDig);
      const passable = DIRS.filter((d) => !wall(mon.c + d.dx, mon.r + d.dy));
      if (!passable.length) {
        mon.dir = null;
        return;
      }
      const p = playerRef.current;
      const dir = chooseGhostDir(mon.c, mon.r, mon.dir, { c: p.c, r: p.r }, wall, { jitter: 0.3 });
      mon.dir = dir;
      mon.tc = mon.c + dir.dx;
      mon.tr = mon.r + dir.dy;
    };

    const stepMob = (
      m: Mob,
      dt: number,
      speed: number,
      decide: (m: Mob) => void,
      onArrive: () => void,
    ) => {
      if (m.dir === null) {
        decide(m);
        if (m.dir === null) return;
      }
      m.prog += speed * dt;
      let guard = 0;
      while (m.prog >= 1 && guard++ < 4) {
        m.prog -= 1;
        m.c = m.tc;
        m.r = m.tr;
        onArrive();
        decide(m);
        if (m.dir === null) {
          m.prog = 0;
          break;
        }
      }
    };

    // Lose a life on being caught/crushed; if any remain, respawn and keep the
    // loop running (no mid-game lesson — the gate handles learning).
    const wipeout = () => {
      livesRef.current -= 1;
      sfx.hurt(); buzz(HAPTIC.death);
      if (livesRef.current <= 0) {
        finish();
        return;
      }
      respawn();
      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };

    const tick = (now: number) => {
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;

      const p = playerRef.current;
      stepMob(p, dt, 3.8, decidePlayer, () => dig(p.c, p.r));

      // monsters wake / gain digging with time (sooner on higher levels)
      const digDelay = Math.max(2.5, 6 - levelRef.current);
      const mSpeed = Math.min(4.8, 2.1 + (levelRef.current - 1) * 0.24);
      for (const mon of monstersRef.current) {
        if (!mon.canDig && elapsedRef.current > digDelay) mon.canDig = true;
        stepMob(mon, dt, mon.canDig ? mSpeed * 0.85 : mSpeed, () => decideMonster(mon), () => {
          if (mon.canDig && dirtRef.current[mon.r]?.[mon.c]) {
            dirtRef.current[mon.r][mon.c] = false;
            setDirtVersion((v) => v + 1);
          }
        });
      }

      // boulders
      for (const rk of rocksRef.current) {
        if (rk.dead) continue;
        if (!rk.falling) {
          const below = Math.round(rk.y) + 1;
          const supported =
            below >= ROWS || dirtRef.current[below][rk.c] || rockAt(rk.c, below, rk);
          if (!supported) {
            let stop = Math.round(rk.y);
            while (stop + 1 < ROWS && !dirtRef.current[stop + 1][rk.c] && !rockAt(rk.c, stop + 1, rk))
              stop++;
            rk.stop = stop;
            rk.falling = true;
          }
        } else {
          rk.y = Math.min(rk.stop, rk.y + FALL_SPEED * dt);
          const cell = Math.round(rk.y);
          // crush monsters in the rock's cell
          for (const mon of monstersRef.current) {
            if (mon.c === rk.c && Math.round(renderPos(mon).y) === cell) {
              scoreRef.current += 300;
              sfx.pickup(); buzz(HAPTIC.heavy);
              mon.c = mon.tc = mon.home.c;
              mon.r = mon.tr = mon.home.r;
              mon.prog = 0;
              mon.dir = null;
              mon.canDig = false;
            }
          }
          const pp = renderPos(p);
          if (rk.c === p.c && Math.abs(pp.y - rk.y) < 0.6 && rk.y > p.r - 0.6) {
            wipeout();
            return;
          }
          if (rk.y >= rk.stop) rk.falling = false;
        }
      }

      // player/monster collision
      const pp = renderPos(p);
      for (const mon of monstersRef.current) {
        const mp = renderPos(mon);
        if (Math.hypot(pp.x - mp.x, pp.y - mp.y) < 0.6) {
          wipeout();
          return;
        }
      }

      if (gemsRef.current.size === 0) {
        levelRef.current += 1;
        scoreRef.current += 200; // cave-clear bonus
        sfx.levelUp(); buzz(HAPTIC.levelUp);
        loadLevel();
        redraw();
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      let d: Dir | null = null;
      if (e.key === 'ArrowUp' || e.key === 'w') d = UP;
      else if (e.key === 'ArrowDown' || e.key === 's') d = DOWN;
      else if (e.key === 'ArrowLeft' || e.key === 'a') d = LEFT;
      else if (e.key === 'ArrowRight' || e.key === 'd') d = RIGHT;
      if (d) {
        e.preventDefault();
        nextDirRef.current = d;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const finish = () => {
    addArcadePoints(scoreRef.current);
    sfx.lose();
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 60) + levelRef.current * 2));
    setOutcome(recordArcadePlay('digger', xp));
  };

  const reset = () => {
    scoreRef.current = 0;
    livesRef.current = config.livesPerSession;
    levelRef.current = config.startLevel;
    loadLevel();
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Gem Digger" emoji="⛏️" />
        <ArcadeEndCard
          gameId="digger"
          outcome={outcome}
          win={levelRef.current >= 2}
          scoreLine={`Level ${levelRef.current} · ${scoreRef.current} points`}
          onReplay={reset}
        />
      </div>
    );
  }


  const pp = renderPos(playerRef.current);
  // Munch while tunnelling between tiles (the loop re-renders every frame).
  const pMoving = playerRef.current.prog > 0.02 && playerRef.current.prog < 0.98;
  const chomp = pMoving && Math.floor(performance.now() / 110) % 2 === 0;

  return (
    <div>
      <ArcadeHeader title="Gem Digger" emoji="⛏️" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-cyan-600 tabular-nums">💎 {gemsRef.current.size}</span>
        <span className="text-indigo-600">Lvl {levelRef.current}</span>
      </div>

      <GameStage theme="digger" className="mx-auto p-2" style={{ width: 'min(100%, 52vh)' }}>
      <div
        className="relative mx-auto rounded-xl overflow-hidden border-2 border-amber-900 touch-none"
        style={{ width: '100%', aspectRatio: `${W} / ${H}`, background: '#1c1206' }}
        onPointerDown={(e) => { swipeRef.current = { x: e.clientX, y: e.clientY }; }}
        onPointerUp={(e) => {
          const s = swipeRef.current; swipeRef.current = null;
          if (!s) return;
          const dx = e.clientX - s.x, dy = e.clientY - s.y;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
          nextDirRef.current = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? RIGHT : LEFT) : (dy > 0 ? DOWN : UP);
        }}
      >
        <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
          <DirtLayer dirt={dirtRef.current} version={dirtVersion} />
          {/* gems */}
          {Array.from(gemsRef.current.entries()).map(([k, gem]) => {
            const [c, r] = k.split(',').map(Number);
            return (
              <div
                key={k}
                className="absolute flex items-center justify-center"
                style={{ left: c * TILE, top: r * TILE, width: TILE, height: TILE, fontSize: TILE - 12 }}
              >
                {gem}
              </div>
            );
          })}
          {/* rocks */}
          {rocksRef.current.map((rk, i) =>
            rk.dead ? null : (
              <div
                key={i}
                className="absolute flex items-center justify-center"
                style={{ left: rk.c * TILE, top: rk.y * TILE, width: TILE, height: TILE, fontSize: TILE - 6 }}
              >
                🪨
              </div>
            ),
          )}
          {/* monsters */}
          {monstersRef.current.map((mon, i) => {
            const mp = renderPos(mon);
            return (
              <div
                key={i}
                className="absolute flex items-center justify-center"
                style={{ left: mp.x * TILE, top: mp.y * TILE, width: TILE, height: TILE, fontSize: TILE - 5 }}
              >
                👾
              </div>
            );
          })}
          {/* player */}
          <div
            className="absolute flex items-center justify-center"
            style={{ left: pp.x * TILE, top: pp.y * TILE, width: TILE, height: TILE, transform: `scaleX(${faceRef.current})` }}
          >
            <div style={{ width: TILE - 6, height: TILE - 6 }}>
              <DiggerHero chomp={chomp} />
            </div>
          </div>
        </div>
      </div>
      </GameStage>

      {/* D-pad */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 w-40 mx-auto select-none">
        <span />
        <DigBtn label="↑" onPress={() => (nextDirRef.current = UP)} />
        <span />
        <DigBtn label="←" onPress={() => (nextDirRef.current = LEFT)} />
        <DigBtn label="↓" onPress={() => (nextDirRef.current = DOWN)} />
        <DigBtn label="→" onPress={() => (nextDirRef.current = RIGHT)} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Dig out all the gems 💎. Drop a 🪨 on a 👾 to squash it. Don't get cornered!
      </p>
    </div>
  );
}

// The digger hero: a round, angry critter with big chomping teeth. `chomp`
// alternates the open/closed mouth while it's tunnelling so it looks like it's
// munching through the dirt.
function DiggerHero({ chomp }: { chomp: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }} aria-hidden>
      <g stroke="#7c2d12" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        <circle cx="50" cy="50" r="40" fill="#fb923c" />
        {/* angry brows */}
        <path d="M22 33 L43 41" strokeWidth={6} />
        <path d="M78 33 L57 41" strokeWidth={6} />
        {/* eyes */}
        <circle cx="38" cy="45" r="6.5" fill="#fff" strokeWidth={3} />
        <circle cx="62" cy="45" r="6.5" fill="#fff" strokeWidth={3} />
        <circle cx="39" cy="46" r="3" fill="#1f2937" stroke="none" />
        <circle cx="61" cy="46" r="3" fill="#1f2937" stroke="none" />
        {chomp ? (
          <g>
            {/* open maw */}
            <path d="M26 60 Q50 66 74 60 L74 80 Q50 94 26 80 Z" fill="#7f1d1d" strokeWidth={4} />
            {/* big upper + lower teeth */}
            <path d="M28 61 L36 72 L44 61 L52 72 L60 61 L68 72 L74 61 Z" fill="#ffffff" strokeWidth={2} />
            <path d="M30 82 L38 73 L46 82 L54 73 L62 82 L70 73 L72 82 Z" fill="#ffffff" strokeWidth={2} />
          </g>
        ) : (
          <g>
            {/* gritted teeth */}
            <path d="M28 64 Q50 74 72 64 L72 73 Q50 82 28 73 Z" fill="#ffffff" strokeWidth={3} />
            <path d="M37 66 L37 78 M46 67 L46 80 M55 67 L55 80 M64 66 L64 78" strokeWidth={2.4} />
          </g>
        )}
      </g>
    </svg>
  );
}

function DigBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      onTouchStart={(e) => {
        e.preventDefault();
        onPress();
      }}
      onMouseDown={onPress}
      className="min-h-11 rounded-xl bg-white border-2 border-slate-200 text-xl font-display font-extrabold text-slate-700 active:bg-slate-100"
    >
      {label}
    </button>
  );
}
