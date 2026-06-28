import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// "Leap Frog" — a Frogger. Hop up across lanes of traffic, then ride logs and
// turtles over a river to reach the lily pads up top. Get squashed, drowned,
// carried off-screen, or time out and you do a quick math lesson and lose a
// life. Fill all the pads to advance; it gets faster every level.

const COLS = 13;
const ROWS = 13;
const TILE = 26;
const W = COLS * TILE;
const H = ROWS * TILE;

const HOME_ROW = 0;
const RIVER_ROWS = [1, 2, 3, 4];
const MEDIAN_ROW = 5;
const ROAD_ROWS = [6, 7, 8, 9, 10];
const START_ROW = 12;
const HOME_SLOTS = [2, 6, 10];

type Obj = { x: number; w: number };
type Lane = {
  row: number;
  kind: 'road' | 'river';
  dir: 1 | -1;
  speed: number;
  objs: Obj[];
  vehicle?: '🚗' | '🚚';
  turtle?: boolean; // river lane made of diving turtles
};

function buildLanes(level: number): Lane[] {
  const lanes: Lane[] = [];
  const roadBase = 2.0 + level * 0.55;
  const riverBase = 1.4 + level * 0.35;
  ROAD_ROWS.forEach((row, i) => {
    const dir: 1 | -1 = i % 2 === 0 ? -1 : 1;
    const truck = i % 2 === 1;
    const w = truck ? 2 : 1;
    const speed = roadBase + i * 0.25;
    const n = 3;
    const gap = COLS / n;
    const objs: Obj[] = [];
    for (let k = 0; k < n; k++) objs.push({ x: k * gap + (i % 2) * 1.3, w });
    lanes.push({ row, kind: 'road', dir, speed, objs, vehicle: truck ? '🚚' : '🚗' });
  });
  RIVER_ROWS.forEach((row, i) => {
    const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const turtle = i % 2 === 1;
    const w = turtle ? 2 : 3;
    const speed = riverBase + i * 0.2;
    const n = turtle ? 3 : 2;
    const gap = COLS / n;
    const objs: Obj[] = [];
    for (let k = 0; k < n; k++) objs.push({ x: k * gap + (i % 2) * 1.1, w });
    lanes.push({ row, kind: 'river', dir, speed, objs, turtle });
  });
  return lanes;
}

// A turtle lane periodically submerges (unrideable ~1s out of every 4s).
function turtleUp(elapsed: number, laneRow: number): boolean {
  const t = (elapsed + laneRow * 0.7) % 4;
  return t < 3;
}

export function LeapFrog() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const frogRef = useRef({ x: 6, r: START_ROW });
  const lanesRef = useRef<Lane[]>(buildLanes(config.startLevel));
  const filledRef = useRef<boolean[]>([false, false, false]);
  const elapsedRef = useRef(0);
  const timerRef = useRef(20);
  const scoreRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const levelRef = useRef(config.startLevel);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const resetFrog = () => {
    frogRef.current = { x: 6, r: START_ROW };
    timerRef.current = Math.max(9, 20 - levelRef.current * 1.5);
  };

  // Lose a life; if none left, end the run. Otherwise reset the frog and the
  // session keeps going (no mid-game lesson — the gate handles learning).
  const loseLife = () => {
    livesRef.current -= 1;
    if (livesRef.current <= 0) {
      finish();
      return;
    }
    resetFrog();
  };

  // hop input
  const hop = (dx: number, dy: number) => {
    if (outcome) return;
    const f = frogRef.current;
    const nr = Math.max(0, Math.min(ROWS - 1, f.r + dy));
    let nx = f.x + dx;
    nx = Math.max(0, Math.min(COLS - 1, nx));
    f.r = nr;
    f.x = nx;
    if (nr === HOME_ROW) {
      // must land on an open lily pad
      const idx = HOME_SLOTS.findIndex((c, i) => Math.abs(c - f.x) < 0.9 && !filledRef.current[i]);
      if (idx >= 0) {
        filledRef.current[idx] = true;
        scoreRef.current += 100;
        if (filledRef.current.every(Boolean)) {
          // level up
          levelRef.current += 1;
          scoreRef.current += 150;
          filledRef.current = [false, false, false];
          lanesRef.current = buildLanes(levelRef.current);
        }
        resetFrog();
      } else {
        loseLife(); // missed the pad
      }
    }
    redraw();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); hop(0, -1); }
      else if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); hop(0, 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); hop(-1, 0); }
      else if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); hop(1, 0); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;
      timerRef.current -= dt;

      // On any wipe-out: lose a life and (if still alive) keep the loop going.
      const wipeout = () => {
        loseLife();
        if (livesRef.current > 0) {
          redraw();
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      // move lane objects
      for (const lane of lanesRef.current) {
        for (const o of lane.objs) {
          o.x += lane.dir * lane.speed * dt;
          if (lane.dir > 0 && o.x > COLS) o.x = -o.w;
          if (lane.dir < 0 && o.x < -o.w) o.x = COLS;
        }
      }

      const f = frogRef.current;

      // carry on river logs/turtles; drown if not on one
      if (RIVER_ROWS.includes(f.r)) {
        const lane = lanesRef.current.find((l) => l.row === f.r);
        let onRide: Obj | null = null;
        if (lane) {
          const rideable = !lane.turtle || turtleUp(elapsedRef.current, lane.row);
          if (rideable) {
            for (const o of lane.objs) {
              if (f.x + 0.5 > o.x && f.x + 0.5 < o.x + o.w) {
                onRide = o;
                break;
              }
            }
          }
        }
        if (onRide && lane) {
          f.x += lane.dir * lane.speed * dt;
          if (f.x < -0.2 || f.x > COLS - 0.8) {
            wipeout();
            return;
          }
        } else {
          wipeout(); // drowned
          return;
        }
      }

      // road collisions
      if (ROAD_ROWS.includes(f.r)) {
        const lane = lanesRef.current.find((l) => l.row === f.r);
        if (lane) {
          for (const o of lane.objs) {
            if (f.x + 0.5 > o.x && f.x + 0.5 < o.x + o.w) {
              wipeout(); // squashed
              return;
            }
          }
        }
      }

      if (timerRef.current <= 0) {
        wipeout();
        return;
      }

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const finish = () => {
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 60) + levelRef.current * 2));
    setOutcome(recordArcadePlay('frogger', xp));
  };

  const reset = () => {
    scoreRef.current = 0;
    livesRef.current = config.livesPerSession;
    levelRef.current = config.startLevel;
    filledRef.current = [false, false, false];
    lanesRef.current = buildLanes(config.startLevel);
    elapsedRef.current = 0;
    resetFrog();
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Leap Frog" emoji="🐸" />
        <ArcadeEndCard
          gameId="frogger"
          outcome={outcome}
          win={levelRef.current >= 2}
          scoreLine={`Level ${levelRef.current} · ${scoreRef.current} points`}
          onReplay={reset}
        />
      </div>
    );
  }

  const f = frogRef.current;

  const rowBg = (r: number): string => {
    if (r === HOME_ROW) return '#15803d';
    if (RIVER_ROWS.includes(r)) return '#1d4ed8';
    if (r === MEDIAN_ROW) return '#16a34a';
    if (ROAD_ROWS.includes(r)) return '#475569';
    return '#22c55e';
  };

  return (
    <div>
      <ArcadeHeader title="Leap Frog" emoji="🐸" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-orange-600 tabular-nums">⏱ {Math.max(0, Math.ceil(timerRef.current))}s</span>
        <span className="text-indigo-600">Lvl {levelRef.current}</span>
      </div>

      <div
        className="relative mx-auto rounded-xl overflow-hidden border-2 border-slate-200"
        style={{ width: '100%', maxWidth: W, aspectRatio: `${W} / ${H}` }}
      >
        <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
          {/* row bands */}
          {Array.from({ length: ROWS }).map((_, r) => (
            <div
              key={r}
              className="absolute left-0"
              style={{ top: r * TILE, width: W, height: TILE, background: rowBg(r) }}
            />
          ))}
          {/* home lily pads */}
          {HOME_SLOTS.map((c, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{ left: c * TILE, top: HOME_ROW * TILE, width: TILE, height: TILE, fontSize: TILE - 6 }}
            >
              {filledRef.current[i] ? '🐸' : '🪷'}
            </div>
          ))}
          {/* lane objects */}
          {lanesRef.current.flatMap((lane) =>
            lane.objs.map((o, k) => {
              const submerged = lane.turtle && !turtleUp(elapsedRef.current, lane.row);
              const label =
                lane.kind === 'road'
                  ? lane.vehicle
                  : lane.turtle
                    ? submerged
                      ? '🌊'
                      : '🐢'
                    : '🪵';
              return (
                <div
                  key={`${lane.row}-${k}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: o.x * TILE,
                    top: lane.row * TILE,
                    width: o.w * TILE,
                    height: TILE,
                    fontSize: TILE - 8,
                    background:
                      lane.kind === 'river' && !lane.turtle ? 'rgba(120,72,40,0.7)' : 'transparent',
                    borderRadius: 6,
                  }}
                >
                  {lane.kind === 'river' && !lane.turtle ? '🪵'.repeat(o.w) : label}
                </div>
              );
            }),
          )}
          {/* frog */}
          <div
            className="absolute flex items-center justify-center"
            style={{ left: f.x * TILE, top: f.r * TILE, width: TILE, height: TILE, fontSize: TILE - 4 }}
          >
            🐸
          </div>
        </div>
      </div>

      {/* D-pad */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 w-40 mx-auto select-none">
        <span />
        <HopBtn label="↑" onPress={() => hop(0, -1)} />
        <span />
        <HopBtn label="←" onPress={() => hop(-1, 0)} />
        <HopBtn label="↓" onPress={() => hop(0, 1)} />
        <HopBtn label="→" onPress={() => hop(1, 0)} />
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Cross the road, ride the logs, fill all three lily pads. Beat the clock!
      </p>
    </div>
  );
}

function HopBtn({ label, onPress }: { label: string; onPress: () => void }) {
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
