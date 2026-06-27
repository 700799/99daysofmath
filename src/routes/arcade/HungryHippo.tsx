import { memo, useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { chooseGhostDir, UP, DOWN, LEFT, RIGHT, type Dir, type Target } from './mazeAI';

// "Hungry Hippo" — a Pac-Man maze. The hippo munches pellets while ghosts give
// chase with real pursuit AI. Power-pellets flip ghosts to a frightened state
// you can eat. Clearing the maze (level-up) or getting caught (eaten) pauses
// the game for a teach-then-check math lesson. Three lives, harder each level.

const COLS = 19;
const ROWS = 15;
const TILE = 18;
const W = COLS * TILE;
const H = ROWS * TILE;
const FRIGHT_SECONDS = 6;

function setCh(rows: string[], r: number, c: number, ch: string) {
  const a = rows[r].split('');
  a[c] = ch;
  rows[r] = a.join('');
}

// A "pillar" maze: solid border plus a wall at every even/even cell. Every odd
// row or column stays open, so all corridors are guaranteed connected.
function makeMazeRows(): string[] {
  const rows: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let s = '';
    for (let c = 0; c < COLS; c++) {
      const border = r === 0 || c === 0 || r === ROWS - 1 || c === COLS - 1;
      const pillar = r % 2 === 0 && c % 2 === 0;
      s += border || pillar ? '#' : '.';
    }
    rows.push(s);
  }
  setCh(rows, 1, 1, 'o');
  setCh(rows, 1, COLS - 2, 'o');
  setCh(rows, ROWS - 2, 1, 'o');
  setCh(rows, ROWS - 2, COLS - 2, 'o');
  setCh(rows, ROWS - 2, 9, 'H'); // hippo start (bottom centre)
  setCh(rows, 7, 7, 'G');
  setCh(rows, 7, 9, 'G');
  setCh(rows, 7, 11, 'G');
  setCh(rows, 5, 9, 'G');
  return rows;
}

const MAZE = makeMazeRows();

function isWall(c: number, r: number): boolean {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true;
  return MAZE[r][c] === '#';
}

type Mob = { c: number; r: number; tc: number; tr: number; prog: number; dir: Dir | null };
type Ghost = Mob & {
  home: Target;
  color: string;
  kind: 'chase' | 'ambush' | 'random';
};

function renderPos(m: Mob): { x: number; y: number } {
  return { x: m.c + (m.tc - m.c) * m.prog, y: m.r + (m.tr - m.r) * m.prog };
}

const GHOST_COLORS = ['#ef4444', '#ec4899', '#22d3ee', '#f59e0b'];
const GHOST_KINDS: Ghost['kind'][] = ['chase', 'ambush', 'random', 'chase'];

function buildLevel() {
  const pellets = new Set<string>();
  const power = new Set<string>();
  const ghostSpawns: Target[] = [];
  let hippoSpawn: Target = { c: 9, r: ROWS - 2 };
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = MAZE[r][c];
      if (ch === '.') pellets.add(`${c},${r}`);
      else if (ch === 'o') {
        pellets.add(`${c},${r}`);
        power.add(`${c},${r}`);
      } else if (ch === 'H') hippoSpawn = { c, r };
      else if (ch === 'G') ghostSpawns.push({ c, r });
    }
  }
  return { pellets, power, ghostSpawns, hippoSpawn };
}

const WallsLayer = memo(function WallsLayer() {
  const cells: { c: number; r: number }[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) if (MAZE[r][c] === '#') cells.push({ c, r });
  return (
    <>
      {cells.map(({ c, r }) => (
        <div
          key={`${c},${r}`}
          className="absolute rounded-[3px] bg-blue-700"
          style={{ left: c * TILE + 1, top: r * TILE + 1, width: TILE - 2, height: TILE - 2 }}
        />
      ))}
    </>
  );
});

const PelletsLayer = memo(function PelletsLayer({
  keys,
  power,
}: {
  keys: string[];
  power: Set<string>;
}) {
  return (
    <>
      {keys.map((k) => {
        const [c, r] = k.split(',').map(Number);
        const big = power.has(k);
        const size = big ? 9 : 4;
        return (
          <div
            key={k}
            className={`absolute rounded-full ${big ? 'bg-amber-300 animate-pulse' : 'bg-amber-200'}`}
            style={{
              left: c * TILE + (TILE - size) / 2,
              top: r * TILE + (TILE - size) / 2,
              width: size,
              height: size,
            }}
          />
        );
      })}
    </>
  );
});

export function HungryHippo() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const hippoRef = useRef<Mob>({ c: 9, r: ROWS - 2, tc: 9, tr: ROWS - 2, prog: 0, dir: null });
  const ghostsRef = useRef<Ghost[]>([]);
  const pelletsRef = useRef<Set<string>>(new Set());
  const powerRef = useRef<Set<string>>(new Set());
  const frightRef = useRef(0);
  const nextDirRef = useRef<Dir | null>(null);
  const faceRef = useRef(1); // 1 = facing right, -1 = left
  const scoreRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const levelRef = useRef(config.startLevel);
  const lastRef = useRef(0);
  const rafRef = useRef(0);

  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  // Fill the refs for the current level. No React state writes, so it's safe to
  // call during the first render to seed the board.
  function populate() {
    const { pellets, power, ghostSpawns, hippoSpawn } = buildLevel();
    pelletsRef.current = pellets;
    powerRef.current = power;
    hippoRef.current = {
      c: hippoSpawn.c,
      r: hippoSpawn.r,
      tc: hippoSpawn.c,
      tr: hippoSpawn.r,
      prog: 0,
      dir: null,
    };
    nextDirRef.current = null;
    frightRef.current = 0;
    const count = Math.min(4, 1 + levelRef.current); // 2 ghosts on L1, +1 each level
    ghostsRef.current = ghostSpawns.slice(0, count).map((sp, i) => ({
      c: sp.c,
      r: sp.r,
      tc: sp.c,
      tr: sp.r,
      prog: 0,
      dir: null,
      home: { c: sp.c, r: sp.r },
      color: GHOST_COLORS[i % GHOST_COLORS.length],
      kind: GHOST_KINDS[i % GHOST_KINDS.length],
    }));
  }

  const inited = useRef(false);
  if (!inited.current) {
    inited.current = true;
    populate();
  }
  const [pelletList, setPelletList] = useState<string[]>(() => Array.from(pelletsRef.current));

  // (Re)build the maze for the current level and refresh the rendered pellets.
  const loadLevel = () => {
    populate();
    setPelletList(Array.from(pelletsRef.current));
  };

  const respawnMobs = () => {
    const { ghostSpawns, hippoSpawn } = buildLevel();
    const hp = hippoRef.current;
    hp.c = hp.tc = hippoSpawn.c;
    hp.r = hp.tr = hippoSpawn.r;
    hp.prog = 0;
    hp.dir = null;
    nextDirRef.current = null;
    frightRef.current = 0;
    ghostsRef.current.forEach((g, i) => {
      const sp = ghostSpawns[i % ghostSpawns.length];
      g.c = g.tc = sp.c;
      g.r = g.tr = sp.r;
      g.prog = 0;
      g.dir = null;
    });
  };

  const eatAt = (c: number, r: number) => {
    const k = `${c},${r}`;
    if (!pelletsRef.current.has(k)) return;
    pelletsRef.current.delete(k);
    if (powerRef.current.has(k)) {
      scoreRef.current += 50;
      frightRef.current = FRIGHT_SECONDS;
    } else {
      scoreRef.current += 10;
    }
    setPelletList(Array.from(pelletsRef.current));
  };

  // Game loop — runs only while playing.
  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();

    const decideHippo = (m: Mob) => {
      const want = nextDirRef.current;
      if (want && !isWall(m.c + want.dx, m.r + want.dy)) {
        m.dir = want;
      }
      if (m.dir && !isWall(m.c + m.dir.dx, m.r + m.dir.dy)) {
        m.tc = m.c + m.dir.dx;
        m.tr = m.r + m.dir.dy;
        if (m.dir.dx !== 0) faceRef.current = m.dir.dx > 0 ? 1 : -1;
      } else {
        m.dir = null;
      }
    };

    const decideGhost = (g: Ghost) => {
      const hp = hippoRef.current;
      const flee = frightRef.current > 0;
      let target: Target;
      let jitter = 0;
      if (flee) {
        target = { c: hp.c, r: hp.r };
        jitter = 6;
      } else if (g.kind === 'ambush') {
        const d = hp.dir ?? { dx: faceRef.current, dy: 0 };
        target = { c: hp.c + d.dx * 3, r: hp.r + d.dy * 3 };
      } else if (g.kind === 'random') {
        target = { c: hp.c, r: hp.r };
        jitter = 9000;
      } else {
        target = { c: hp.c, r: hp.r };
      }
      const dir = chooseGhostDir(g.c, g.r, g.dir, target, isWall, { flee, jitter });
      g.dir = dir;
      g.tc = g.c + dir.dx;
      g.tr = g.r + dir.dy;
    };

    const stepMob = (m: Mob, dt: number, speed: number, decide: (m: Mob) => void, onArrive?: () => void) => {
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
        onArrive?.();
        decide(m);
        if (m.dir === null) {
          m.prog = 0;
          break;
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      if (frightRef.current > 0) frightRef.current = Math.max(0, frightRef.current - dt);

      const hp = hippoRef.current;
      const hippoSpeed = 5.2;
      stepMob(hp, dt, hippoSpeed, decideHippo, () => eatAt(hp.c, hp.r));
      eatAt(hp.c, hp.r);

      const gSpeedBase = 4.0 + (levelRef.current - 1) * 0.4;
      for (const g of ghostsRef.current) {
        const speed = frightRef.current > 0 ? 2.6 : Math.min(6, gSpeedBase);
        stepMob(g, dt, speed, () => decideGhost(g));
      }

      // collisions
      const hpp = renderPos(hp);
      for (const g of ghostsRef.current) {
        const gp = renderPos(g);
        if (Math.hypot(hpp.x - gp.x, hpp.y - gp.y) < 0.6) {
          if (frightRef.current > 0) {
            scoreRef.current += 200;
            g.c = g.tc = g.home.c;
            g.r = g.tr = g.home.r;
            g.prog = 0;
            g.dir = null;
          } else {
            livesRef.current -= 1;
            if (livesRef.current <= 0) {
              finish();
              return;
            }
            respawnMobs();
            redraw();
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
        }
      }

      if (pelletsRef.current.size === 0) {
        levelRef.current += 1;
        scoreRef.current += 100; // level-clear bonus
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

  // keyboard input
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
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 40) + levelRef.current * 2));
    setOutcome(recordArcadePlay('hippo', xp));
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
        <ArcadeHeader title="Hungry Hippo" emoji="🦛" />
        <ArcadeEndCard
          gameId="hippo"
          outcome={outcome}
          win={levelRef.current >= 2}
          scoreLine={`Level ${levelRef.current} · ${scoreRef.current} points`}
          onReplay={reset}
        />
      </div>
    );
  }

  const hp = renderPos(hippoRef.current);
  const frightened = frightRef.current > 0;

  return (
    <div>
      <ArcadeHeader title="Hungry Hippo" emoji="🦛" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-indigo-600">Lvl {levelRef.current}</span>
      </div>

      <div
        className="relative mx-auto rounded-xl bg-slate-900 overflow-hidden"
        style={{ width: '100%', maxWidth: W, aspectRatio: `${W} / ${H}` }}
      >
        {/* fixed-size inner board scaled to fit */}
        <div className="absolute top-0 left-0" style={{ width: W, height: H, transformOrigin: 'top left' }}>
          <WallsLayer />
          <PelletsLayer keys={pelletList} power={powerRef.current} />
          {ghostsRef.current.map((g, i) => {
            const gp = renderPos(g);
            return (
              <div
                key={i}
                className="absolute flex items-center justify-center"
                style={{ left: gp.x * TILE, top: gp.y * TILE, width: TILE, height: TILE, fontSize: TILE - 3 }}
              >
                <span
                  className="rounded-full leading-none"
                  style={{
                    background: frightened ? '#3b82f6' : g.color,
                    width: TILE - 2,
                    height: TILE - 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: TILE - 7,
                  }}
                >
                  {frightened ? '😨' : '👻'}
                </span>
              </div>
            );
          })}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: hp.x * TILE,
              top: hp.y * TILE,
              width: TILE,
              height: TILE,
              fontSize: TILE - 2,
              transform: `scaleX(${faceRef.current})`,
            }}
          >
            🦛
          </div>
        </div>
      </div>

      {/* D-pad */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 w-40 mx-auto select-none">
        <span />
        <DPad label="↑" onPress={() => (nextDirRef.current = UP)} />
        <span />
        <DPad label="←" onPress={() => (nextDirRef.current = LEFT)} />
        <DPad label="↓" onPress={() => (nextDirRef.current = DOWN)} />
        <DPad label="→" onPress={() => (nextDirRef.current = RIGHT)} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Munch every dot. Grab a ⭐ power-dot to chomp the ghosts. Don't get caught!
      </p>
    </div>
  );
}

function DPad({ label, onPress }: { label: string; onPress: () => void }) {
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
