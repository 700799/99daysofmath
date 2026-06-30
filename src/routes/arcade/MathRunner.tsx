import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { Mascot as CharMascot, type MascotKind, type MascotExpr } from './Mascots';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Five-lane endless runner. A bold mascot dashes through a scene (mountain /
// city / parking lot) eating the fruit that carries the correct answer to a big,
// blinking math problem. Wrong fruit = lose a heart. Bonus fruit = free points.

const LANES = 5;
const LANE_Y = [15, 32.5, 50, 67.5, 85]; // y % within the play field
const FIELD_W = 360;
const FIELD_H = 320;
const PLAYER_X = 56;
const SESSION_SECONDS = 60;

const FRUITS = ['🍎', '🍓', '🍌', '🍉', '🍇', '🍊', '🍑', '🥝', '🍒', '🥭'] as const;

// Players pick which runner they want — all the new bold mascots.
const RUNNERS: MascotKind[] = ['ninja', 'panda', 'redpanda', 'raccoon', 'turtle', 'shark', 'capsuleR', 'capsuleB', 'capsuleP', 'capsuleM', 'fox', 'cat'];

type Scene = 'mountain' | 'city' | 'parking';
const SCENES: Scene[] = ['mountain', 'city', 'parking'];
const HAZARD: Record<Scene, string> = { mountain: '🪨', city: '🚧', parking: '🛢️' };

type Item = { value: number; lane: number; fruit: string };
type Gate = {
  id: number;
  x: number;
  question: string;
  correct: number;
  items: Item[];
  correctLane: number;
  alive: boolean;
};
type Pickup = { id: number; x: number; lane: number; fruit: string; alive: boolean };
type Hazard = { id: number; x: number; lane: number; alive: boolean };
type Burst = { id: number; x: number; y: number; kind: 'eat' | 'hit'; emoji: string; until: number };

function pick<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}
function distinctLanes(n: number): number[] {
  const all = [0, 1, 2, 3, 4];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, n);
}

function makeGate(id: number, startX: number): Gate {
  // Multiplication shows up extra often ("include mult").
  const op = pick(['+', '-', '×', '×'] as const);
  let a = 0,
    b = 0,
    correct = 0;
  if (op === '+') {
    a = 3 + Math.floor(Math.random() * 22);
    b = 3 + Math.floor(Math.random() * 22);
    correct = a + b;
  } else if (op === '-') {
    a = 8 + Math.floor(Math.random() * 28);
    b = 1 + Math.floor(Math.random() * (a - 1));
    correct = a - b;
  } else {
    a = 2 + Math.floor(Math.random() * 11);
    b = 2 + Math.floor(Math.random() * 11);
    correct = a * b;
  }
  const wrongs = new Set<number>();
  while (wrongs.size < 2) {
    const drift = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 6));
    const w = correct + drift;
    if (w !== correct && w > 0) wrongs.add(w);
  }
  const trio = [correct, ...Array.from(wrongs)];
  for (let i = trio.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trio[i], trio[j]] = [trio[j], trio[i]];
  }
  const lanes = distinctLanes(3);
  const items: Item[] = trio.map((value, i) => ({ value, lane: lanes[i], fruit: pick(FRUITS) }));
  const correctLane = items.find((it) => it.value === correct)!.lane;
  return { id, x: startX, question: `${a} ${op} ${b}`, correct, items, correctLane, alive: true };
}

// --- scene backdrops (bold cartoon SVG) ---
function SceneBg({ scene }: { scene: Scene }) {
  if (scene === 'city') {
    return (
      <svg viewBox="0 0 360 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="r-city" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="55%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
        </defs>
        <rect width="360" height="320" fill="url(#r-city)" />
        <circle cx="290" cy="60" r="30" fill="#fb923c" stroke="#1f2937" strokeWidth="3" />
        <g fill="#64748b" stroke="#1f2937" strokeWidth="3" strokeLinejoin="round">
          <rect x="6" y="150" width="48" height="150" />
          <rect x="64" y="110" width="40" height="190" />
          <rect x="116" y="170" width="54" height="130" />
          <rect x="182" y="92" width="44" height="208" />
          <rect x="240" y="150" width="46" height="150" />
          <rect x="300" y="120" width="54" height="180" />
        </g>
        <g fill="#fde68a" stroke="none">
          {[20, 74, 126, 192, 250, 312].map((bx) =>
            [0, 1, 2].map((cc) =>
              [0, 1, 2, 3].map((rr) => <rect key={`${bx}-${cc}-${rr}`} x={bx + cc * 14} y={130 + rr * 26} width="8" height="12" />),
            ),
          )}
        </g>
        <rect x="0" y="300" width="360" height="20" fill="#334155" stroke="#1f2937" strokeWidth="3" />
      </svg>
    );
  }
  if (scene === 'parking') {
    return (
      <svg viewBox="0 0 360 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect width="360" height="320" fill="#94a3b8" />
        <rect x="0" y="0" width="360" height="46" fill="#cbd5e1" stroke="#1f2937" strokeWidth="3" />
        <g fill="#fde68a" stroke="#1f2937" strokeWidth="2">
          <rect x="40" y="14" width="40" height="14" rx="3" />
          <rect x="160" y="14" width="40" height="14" rx="3" />
          <rect x="280" y="14" width="40" height="14" rx="3" />
        </g>
        {/* pillars */}
        <g fill="#64748b" stroke="#1f2937" strokeWidth="3">
          <rect x="20" y="46" width="26" height="254" />
          <rect x="314" y="46" width="26" height="254" />
        </g>
        {/* painted parking lines */}
        <g stroke="#fbbf24" strokeWidth="5" strokeLinecap="round">
          {[70, 130, 190, 250, 300].map((y) => (
            <line key={y} x1="60" y1={y} x2="120" y2={y} />
          ))}
        </g>
        <rect x="0" y="300" width="360" height="20" fill="#475569" stroke="#1f2937" strokeWidth="3" />
      </svg>
    );
  }
  // mountain (default)
  return (
    <svg viewBox="0 0 360 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#fef9c3" />
        </linearGradient>
        <linearGradient id="r-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="360" height="320" fill="url(#r-sky)" />
      <circle cx="295" cy="58" r="30" fill="#f87171" stroke="#1f2937" strokeWidth="3" />
      <g fill="#ffffff" stroke="#1f2937" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M40 70 q-3 -16 16 -14 q5 -12 18 -7 q11 -6 15 7 q14 -1 11 14 Z" />
      </g>
      <path d="M-10 250 Q90 150 180 250 T380 245 L380 320 L-10 320 Z" fill="#86efac" stroke="#1f2937" strokeWidth="3" strokeLinejoin="round" />
      <path d="M60 280 Q150 110 180 100 Q210 110 300 280 Z" fill="url(#r-mtn)" stroke="#1f2937" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M150 170 q15 -10 30 -16 q15 6 30 16 q-12 -6 -20 2 q-10 -8 -20 0 q-9 -6 -20 -2 Z" fill="#ffffff" stroke="#1f2937" strokeWidth="2" strokeLinejoin="round" />
      <rect x="0" y="300" width="360" height="20" fill="#4ade80" stroke="#1f2937" strokeWidth="3" />
    </svg>
  );
}

export function MathRunner() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const [character, setCharacter] = useState<MascotKind>('ninja');
  const [started, setStarted] = useState(false);
  const [scene, setScene] = useState<Scene>('mountain');
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const buzz = (p: number | number[]) => {
    if (hapticsOn) haptic(p);
  };

  // World state (refs; the RAF loop drives them, render via redraw tick).
  const laneRef = useRef(2);
  const gatesRef = useRef<Gate[]>([]);
  const pickupsRef = useRef<Pickup[]>([]);
  const hazardsRef = useRef<Hazard[]>([]);
  const burstsRef = useRef<Burst[]>([]);
  const heartsRef = useRef(3);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(SESSION_SECONDS);
  const speedRef = useRef(120);
  const idRef = useRef(1);
  const lastGateXRef = useRef(FIELD_W + 140);
  const lastPickupXRef = useRef(FIELD_W + 60);
  const lastHazardXRef = useRef(FIELD_W + 220);
  const lastTickRef = useRef(performance.now());
  const rafRef = useRef(0);
  const exprUntilRef = useRef(0);
  const exprRef = useRef<MascotExpr>('happy');
  const [shake, setShake] = useState(0);

  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const lane = laneRef.current;
  const gates = gatesRef.current;
  const pickups = pickupsRef.current;
  const hazards = hazardsRef.current;
  const bursts = burstsRef.current;

  const setLane = (next: number) => {
    if (outcome) return;
    laneRef.current = Math.max(0, Math.min(LANES - 1, next));
    redraw();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') setLane(laneRef.current - 1);
      if (e.key === 'ArrowDown' || e.key === 's') setLane(laneRef.current + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flashExpr = (ex: MascotExpr, ms: number) => {
    exprRef.current = ex;
    exprUntilRef.current = performance.now() + ms;
  };

  // Main loop
  useEffect(() => {
    if (outcome || !started) return;
    const tick = (now: number) => {
      if (pausedRef.current) {
        lastTickRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      timeLeftRef.current -= dt;
      if (now > exprUntilRef.current) exprRef.current = 'happy';

      const speed = (speedRef.current = Math.min(240, 120 + scoreRef.current * 2.5));

      lastGateXRef.current -= speed * dt;
      if (lastGateXRef.current < FIELD_W - 260) {
        gatesRef.current.push(makeGate(idRef.current++, FIELD_W + 70));
        lastGateXRef.current = FIELD_W + 70;
      }
      lastPickupXRef.current -= speed * dt;
      if (lastPickupXRef.current < FIELD_W - 120 && Math.random() < 0.4) {
        pickupsRef.current.push({ id: idRef.current++, x: FIELD_W + 30, lane: Math.floor(Math.random() * LANES), fruit: pick(FRUITS), alive: true });
        lastPickupXRef.current = FIELD_W + 30;
      }
      lastHazardXRef.current -= speed * dt;
      if (lastHazardXRef.current < FIELD_W - 170 && Math.random() < 0.33) {
        hazardsRef.current.push({ id: idRef.current++, x: FIELD_W + 45, lane: Math.floor(Math.random() * LANES), alive: true });
        lastHazardXRef.current = FIELD_W + 45;
      }

      for (const g of gatesRef.current) g.x -= speed * dt;
      for (const p of pickupsRef.current) p.x -= speed * dt;
      for (const h of hazardsRef.current) h.x -= speed * dt;

      const py = LANE_Y[laneRef.current];
      for (const g of gatesRef.current) {
        if (!g.alive) continue;
        if (g.x <= PLAYER_X) {
          g.alive = false;
          const hit = g.items.find((it) => it.lane === laneRef.current);
          if (hit && hit.value === g.correct) {
            scoreRef.current += 2;
            burstsRef.current.push({ id: idRef.current++, x: PLAYER_X + 6, y: py, kind: 'eat', emoji: hit.fruit, until: now + 600 });
            sfx.coin();
            buzz(HAPTIC.heavy);
            flashExpr('surprised', 500);
            setShake((s) => s + 1);
          } else if (hit) {
            heartsRef.current -= 1;
            burstsRef.current.push({ id: idRef.current++, x: PLAYER_X + 6, y: py, kind: 'hit', emoji: '💥', until: now + 600 });
            sfx.hurt();
            buzz(HAPTIC.hit);
            flashExpr('dizzy', 600);
            setShake((s) => s + 1);
          }
        }
      }
      for (const p of pickupsRef.current) {
        if (!p.alive) continue;
        if (p.x <= PLAYER_X + 10 && p.x > PLAYER_X - 34 && p.lane === laneRef.current) {
          scoreRef.current += 1;
          p.alive = false;
          burstsRef.current.push({ id: idRef.current++, x: PLAYER_X + 6, y: LANE_Y[p.lane], kind: 'eat', emoji: p.fruit, until: now + 500 });
          sfx.pickup();
          buzz(HAPTIC.pickup);
        }
        if (p.x < -40) p.alive = false;
      }
      for (const h of hazardsRef.current) {
        if (!h.alive) continue;
        if (h.x <= PLAYER_X + 10 && h.x > PLAYER_X - 34 && h.lane === laneRef.current) {
          heartsRef.current -= 1;
          h.alive = false;
          burstsRef.current.push({ id: idRef.current++, x: PLAYER_X + 6, y: LANE_Y[h.lane], kind: 'hit', emoji: '💥', until: now + 600 });
          sfx.hit();
          buzz(HAPTIC.hit);
          flashExpr('dizzy', 600);
          setShake((s) => s + 1);
        }
        if (h.x < -40) h.alive = false;
      }
      gatesRef.current = gatesRef.current.filter((g) => g.x > -120);
      pickupsRef.current = pickupsRef.current.filter((p) => p.alive || p.x > -50);
      hazardsRef.current = hazardsRef.current.filter((h) => h.alive || h.x > -50);
      burstsRef.current = burstsRef.current.filter((b) => b.until > now);

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
  }, [outcome, started]);

  const finish = () => {
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current * 0.5)));
    sfx.win();
    setOutcome(recordArcadePlay('runner', xp));
  };

  const reset = () => {
    laneRef.current = 2;
    gatesRef.current = [];
    pickupsRef.current = [];
    hazardsRef.current = [];
    burstsRef.current = [];
    heartsRef.current = 3;
    scoreRef.current = 0;
    timeLeftRef.current = SESSION_SECONDS;
    speedRef.current = 120;
    idRef.current = 1;
    lastGateXRef.current = FIELD_W + 140;
    lastPickupXRef.current = FIELD_W + 60;
    lastHazardXRef.current = FIELD_W + 220;
    lastTickRef.current = performance.now();
    exprRef.current = 'happy';
    setOutcome(null);
    setStarted(false);
  };

  const start = () => {
    setScene(pick(SCENES));
    lastTickRef.current = performance.now();
    setStarted(true);
  };

  // The big blinking problem = the nearest gate still ahead of the runner.
  // Computed every render (the loop re-renders each frame via redraw).
  let activeGate: Gate | null = null;
  for (const g of gates) if (g.alive && g.x > PLAYER_X - 20 && (!activeGate || g.x < activeGate.x)) activeGate = g;

  const onFieldPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    let nearest = 0;
    let bestD = Infinity;
    for (let i = 0; i < LANES; i++) {
      const d = Math.abs(LANE_Y[i] - yPct);
      if (d < bestD) {
        bestD = d;
        nearest = i;
      }
    }
    setLane(nearest);
  };

  if (outcome) {
    const reached = scoreRef.current;
    return (
      <div>
        <ArcadeHeader title="Math Runner" emoji="🏃" />
        <ArcadeEndCard
          gameId="runner"
          outcome={outcome}
          win={reached >= 12}
          scoreLine={`${reached} points · ${SESSION_SECONDS - Math.floor(timeLeftRef.current)}s`}
          onReplay={reset}
        />
      </div>
    );
  }

  if (!started) {
    return (
      <div>
        <ArcadeHeader title="Math Runner" emoji="🏃" />
        <div className="mx-auto max-w-sm text-center">
          <p className="mb-3 text-sm font-display font-bold text-slate-600">Pick your runner</p>
          <div className="grid grid-cols-4 gap-2">
            {RUNNERS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCharacter(c)}
                aria-pressed={character === c}
                className={`flex aspect-square items-center justify-center rounded-2xl shadow ${
                  character === c ? 'bg-emerald-500 ring-4 ring-emerald-300' : 'bg-white border-2 border-slate-200'
                }`}
              >
                <CharMascot kind={c} size={44} expr="happy" />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={start}
            className="mt-5 min-h-12 w-full rounded-2xl bg-slate-900 px-6 font-display font-extrabold text-white shadow"
          >
            Start running!
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Steer into the lane with the fruit that holds the correct answer. Grab bonus fruit and dodge the {HAZARD.mountain}.
          </p>
        </div>
      </div>
    );
  }

  const playerExpr = exprRef.current;

  return (
    <div>
      <ArcadeHeader title="Math Runner" emoji="🏃" />
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-display font-extrabold text-slate-900">
          {'❤️'.repeat(Math.max(0, heartsRef.current))}
          {'🤍'.repeat(Math.max(0, 3 - heartsRef.current))}
        </div>
        <div className="text-sm font-display font-bold text-slate-600 tabular-nums">
          🍎 {scoreRef.current} · ⏱ {Math.max(0, Math.ceil(timeLeftRef.current))}s
        </div>
      </div>

      <motion.div
        onPointerDown={onFieldPointer}
        animate={{ x: shake % 2 ? [0, -6, 6, -4, 4, 0] : [0, 6, -6, 4, -4, 0] }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto overflow-hidden rounded-2xl border-2 border-slate-300 shadow-inner"
        style={{ width: '100%', maxWidth: FIELD_W, height: FIELD_H }}
      >
        <SceneBg scene={scene} />

        {/* big blinking problem */}
        {activeGate && (
          <motion.div
            key={activeGate.id}
            animate={{ scale: [1, 1.08, 1], opacity: [1, 0.65, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="absolute left-1/2 top-2 -translate-x-1/2 rounded-2xl border-2 border-slate-900 bg-white/90 px-4 py-1 text-2xl font-display font-extrabold text-slate-900 shadow-lg"
          >
            {activeGate.question} = ?
          </motion.div>
        )}

        {/* bonus fruit */}
        {pickups
          .filter((p) => p.alive)
          .map((p) => (
            <div key={p.id} className="absolute text-2xl" style={{ left: p.x, top: `calc(${LANE_Y[p.lane]}% - 12px)` }}>
              {p.fruit}
            </div>
          ))}

        {/* hazards */}
        {hazards
          .filter((h) => h.alive)
          .map((h) => (
            <div key={h.id} className="absolute text-2xl" style={{ left: h.x, top: `calc(${LANE_Y[h.lane]}% - 12px)` }}>
              {HAZARD[scene]}
            </div>
          ))}

        {/* answer fruit */}
        {gates
          .filter((g) => g.alive)
          .map((g) =>
            g.items.map((it, i) => (
              <div
                key={`${g.id}-${i}`}
                className="absolute flex flex-col items-center"
                style={{ left: g.x, top: `calc(${LANE_Y[it.lane]}% - 20px)` }}
              >
                <span className="text-3xl leading-none drop-shadow">{it.fruit}</span>
                <span className="-mt-2 rounded-full border-2 border-slate-900 bg-white px-1.5 text-sm font-display font-extrabold text-slate-900 shadow">
                  {it.value}
                </span>
              </div>
            )),
          )}

        {/* impact bursts */}
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            initial={{ scale: 0.4, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute text-3xl"
            style={{ left: b.x, top: `calc(${b.y}% - 16px)` }}
          >
            {b.kind === 'eat' ? '✨' : '💥'}
          </motion.div>
        ))}

        {/* player */}
        <motion.div
          className="absolute"
          style={{ left: PLAYER_X - 24, top: `calc(${LANE_Y[lane]}% - 26px)`, transition: 'top 140ms ease-out' }}
          animate={{ y: [0, -7, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        >
          <CharMascot kind={character} size={52} expr={playerExpr} />
        </motion.div>
      </motion.div>

      {/* controls */}
      <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setLane(laneRef.current - 1)}
          className="min-h-14 rounded-2xl bg-white text-2xl font-display font-extrabold text-slate-700 shadow border-2 border-slate-200 active:translate-y-0.5"
        >
          ▲ Up
        </button>
        <button
          type="button"
          onClick={() => setLane(laneRef.current + 1)}
          className="min-h-14 rounded-2xl bg-white text-2xl font-display font-extrabold text-slate-700 shadow border-2 border-slate-200 active:translate-y-0.5"
        >
          ▼ Down
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">
        Tap a lane, or use ▲▼ / arrow keys. Eat the fruit with the correct answer!
      </p>
    </div>
  );
}
