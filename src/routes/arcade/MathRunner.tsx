import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Three-lane endless runner. The player picks a lane to "catch" the correct
// answer to an incoming math gate. Wrong sign = lose a heart. Coins between
// gates are free XP. Game lasts ~60 s or until hearts hit 0.

const LANES = 3;
const LANE_HEIGHTS = [40, 50, 60]; // y % within the play field
const FIELD_W = 360;
const FIELD_H = 200;
const PLAYER_X = 48;
const SESSION_SECONDS = 60;

type Gate = {
  id: number;
  x: number;
  question: string;
  answers: [number, number, number];
  correctLane: 0 | 1 | 2;
  alive: boolean;
  resolved?: 'correct' | 'wrong' | 'missed';
};

type Coin = {
  id: number;
  x: number;
  lane: 0 | 1 | 2;
  alive: boolean;
};

function makeGate(id: number, startX: number): Gate {
  // Pick a random operation, then build three answers (one correct + two near-misses).
  const op = ['+', '-', '×'][Math.floor(Math.random() * 3)] as '+' | '-' | '×';
  let a = 0,
    b = 0,
    correct = 0;
  switch (op) {
    case '+':
      a = 2 + Math.floor(Math.random() * 18);
      b = 2 + Math.floor(Math.random() * 18);
      correct = a + b;
      break;
    case '-':
      a = 5 + Math.floor(Math.random() * 25);
      b = 1 + Math.floor(Math.random() * (a - 1));
      correct = a - b;
      break;
    case '×':
      a = 2 + Math.floor(Math.random() * 9);
      b = 2 + Math.floor(Math.random() * 9);
      correct = a * b;
      break;
  }
  const wrongs = new Set<number>();
  while (wrongs.size < 2) {
    const drift = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5));
    const w = correct + drift;
    if (w !== correct && w > 0) wrongs.add(w);
  }
  const trio = [correct, ...Array.from(wrongs)] as [number, number, number];
  // Shuffle deterministically among 3 lanes.
  for (let i = trio.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trio[i], trio[j]] = [trio[j], trio[i]];
  }
  const correctLane = trio.indexOf(correct) as 0 | 1 | 2;
  return {
    id,
    x: startX,
    question: `${a} ${op} ${b}`,
    answers: trio,
    correctLane,
    alive: true,
  };
}

function makeCoin(id: number, startX: number): Coin {
  return {
    id,
    x: startX,
    lane: Math.floor(Math.random() * LANES) as 0 | 1 | 2,
    alive: true,
  };
}

export function MathRunner() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  // World state — refs because the RAF loop drives them; render is via a
  // single redraw tick.
  const laneRef = useRef<0 | 1 | 2>(1);
  const gatesRef = useRef<Gate[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const heartsRef = useRef(3);
  const scoreRef = useRef(0); // coins + correct gates
  const timeLeftRef = useRef(SESSION_SECONDS);
  const speedRef = useRef(180); // px / second
  const idRef = useRef(1);
  const lastGateXRef = useRef(FIELD_W + 120);
  const lastCoinXRef = useRef(FIELD_W + 60);
  const lastTickRef = useRef(performance.now());
  const rafRef = useRef(0);

  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const lane = laneRef.current;
  const gates = gatesRef.current;
  const coins = coinsRef.current;

  // Input
  const setLane = (next: 0 | 1 | 2) => {
    if (outcome) return;
    laneRef.current = next;
    redraw();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') setLane(Math.max(0, laneRef.current - 1) as 0 | 1 | 2);
      if (e.key === 'ArrowDown' || e.key === 's') setLane(Math.min(2, laneRef.current + 1) as 0 | 1 | 2);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Main game loop
  useEffect(() => {
    if (outcome) return;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      timeLeftRef.current -= dt;

      const speed = (speedRef.current = Math.min(360, 180 + scoreRef.current * 4));

      // Spawn gates every ~2 s based on x-distance.
      lastGateXRef.current -= speed * dt;
      if (lastGateXRef.current < FIELD_W - 240) {
        gatesRef.current.push(makeGate(idRef.current++, FIELD_W + 60));
        lastGateXRef.current = FIELD_W + 60;
      }
      // Spawn coins occasionally between gates.
      lastCoinXRef.current -= speed * dt;
      if (lastCoinXRef.current < FIELD_W - 110 && Math.random() < 0.35) {
        coinsRef.current.push(makeCoin(idRef.current++, FIELD_W + 30));
        lastCoinXRef.current = FIELD_W + 30;
      }

      // Move world leftward
      for (const g of gatesRef.current) g.x -= speed * dt;
      for (const c of coinsRef.current) c.x -= speed * dt;

      // Collisions / resolution
      for (const g of gatesRef.current) {
        if (!g.alive) continue;
        if (g.x <= PLAYER_X) {
          if (laneRef.current === g.correctLane) {
            scoreRef.current += 1;
            g.resolved = 'correct';
          } else {
            heartsRef.current -= 1;
            g.resolved = 'wrong';
          }
          g.alive = false;
        }
      }
      for (const c of coinsRef.current) {
        if (!c.alive) continue;
        if (c.x <= PLAYER_X + 8 && c.x > PLAYER_X - 36 && c.lane === laneRef.current) {
          scoreRef.current += 1;
          c.alive = false;
        }
        if (c.x < -40) c.alive = false;
      }
      gatesRef.current = gatesRef.current.filter((g) => g.x > -90);
      coinsRef.current = coinsRef.current.filter((c) => c.alive || c.x > -50);

      if (heartsRef.current <= 0 || timeLeftRef.current <= 0) {
        finish();
        return;
      }
      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const finish = () => {
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current * 0.7)));
    setOutcome(recordArcadePlay('runner', xp));
  };

  const reset = () => {
    laneRef.current = 1;
    gatesRef.current = [];
    coinsRef.current = [];
    heartsRef.current = 3;
    scoreRef.current = 0;
    timeLeftRef.current = SESSION_SECONDS;
    speedRef.current = 180;
    idRef.current = 1;
    lastGateXRef.current = FIELD_W + 120;
    lastCoinXRef.current = FIELD_W + 60;
    setOutcome(null);
  };

  const playerY = useMemo(() => `${LANE_HEIGHTS[lane]}%`, [lane]);

  if (outcome) {
    const reached = scoreRef.current;
    return (
      <div>
        <ArcadeHeader title="Math Runner" emoji="🏃" />
        <ArcadeEndCard
          gameId="runner"
          outcome={outcome}
          win={reached >= 8}
          scoreLine={`${reached} points · ${SESSION_SECONDS - Math.floor(timeLeftRef.current)}s`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Math Runner" emoji="🏃" />
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-display font-extrabold text-slate-900">
          {'❤️'.repeat(heartsRef.current)}
          {'🤍'.repeat(Math.max(0, 3 - heartsRef.current))}
        </div>
        <div className="text-sm font-display font-bold text-slate-600 tabular-nums">
          ⭐ {scoreRef.current} · ⏱ {Math.max(0, Math.ceil(timeLeftRef.current))}s
        </div>
      </div>

      <div
        className="relative mx-auto rounded-2xl bg-gradient-to-b from-emerald-100 to-amber-50 border-2 border-slate-200 overflow-hidden"
        style={{ width: '100%', maxWidth: FIELD_W, height: FIELD_H }}
      >
        {/* Lane lines */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dashed border-slate-300/70"
            style={{ top: `${LANE_HEIGHTS[i] - 2}%` }}
          />
        ))}

        {/* Coins */}
        {coins
          .filter((c) => c.alive)
          .map((c) => (
            <div
              key={c.id}
              className="absolute text-xl"
              style={{
                left: c.x,
                top: `calc(${LANE_HEIGHTS[c.lane]}% - 10px)`,
              }}
            >
              ⭐
            </div>
          ))}

        {/* Gates */}
        {gates
          .filter((g) => g.alive)
          .map((g) => (
            <div
              key={g.id}
              className="absolute"
              style={{ left: g.x, top: 0, bottom: 0, width: 64 }}
            >
              <div className="absolute -top-1 left-0 right-0 text-center text-[11px] font-display font-extrabold text-slate-700">
                {g.question}
              </div>
              {g.answers.map((a, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 flex items-center justify-center"
                  style={{ top: `calc(${LANE_HEIGHTS[i]}% - 14px)`, height: 28 }}
                >
                  <div className="px-2 rounded-full bg-white text-slate-900 font-display font-extrabold text-sm border-2 border-slate-300 shadow">
                    {a}
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Player */}
        <div
          className="absolute text-3xl transition-[top] duration-150 ease-out"
          style={{ left: PLAYER_X - 16, top: `calc(${playerY} - 18px)` }}
        >
          🏃
        </div>
      </div>

      {/* Lane buttons */}
      <div className="mt-3 grid grid-cols-3 gap-2 max-w-sm mx-auto">
        {[0, 1, 2].map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLane(l as 0 | 1 | 2)}
            className={`min-h-12 rounded-2xl font-display font-extrabold text-sm shadow ${
              lane === l
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-700 border-2 border-slate-200'
            }`}
          >
            {l === 0 ? '↑ Top' : l === 1 ? '— Middle' : '↓ Bottom'}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Steer into the lane with the correct answer. Catch ⭐ for bonus points.
      </p>
    </div>
  );
}
