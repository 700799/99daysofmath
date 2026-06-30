import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Tank Attack — an original artillery game that teaches angles, radians, and
// trig (SOH-CAH-TOA). The launch velocity V is the HYPOTENUSE of a right
// triangle whose legs are the horizontal speed vx = V·cosθ (adjacent) and the
// vertical speed vy = V·sinθ (opposite); tanθ = opp/adj = vy/vx. You pick a
// special acute angle (snapped, with radian labels) and a power, then a rocket
// flies a real parabola under gravity to blow up evil robots. "The math is in
// the geometry." Original art (SVG + emoji), no trademarked assets.

// ---- battlefield geometry (SVG viewBox units) ----
const W = 360;
const H = 220;
const GY = 190; // ground line
const PIV = { x: 40, y: GY - 16 }; // cannon pivot (turret center)
const ROCKET_R = 4;
const V_MIN = 45;
const V_MAX = 160;

const rad = (deg: number) => (deg * Math.PI) / 180;

// Special acute angles with their radian labels (12ths of π).
type Ang = { deg: number; rad: string };
const ANGLES: Ang[] = [
  { deg: 15, rad: 'π/12' },
  { deg: 30, rad: 'π/6' },
  { deg: 45, rad: 'π/4' },
  { deg: 60, rad: 'π/3' },
  { deg: 75, rad: '5π/12' },
];

type Pt = { x: number; y: number };
type Robot = { x: number; y: number; r: number; alive: boolean; emoji: string };
const TARGET_EMOJI = ['🤖', '🚙', '🚚', '👹', '🛻', '👾'];
type Wall = { x: number; y: number; w: number; h: number };
type Level = { robots: Pt[]; walls: Wall[]; shots: number; g: number; wind: number; hills?: Pt[] };

// Eight ramping levels: distance → height → walls to arc over → wind.
const LEVELS: Level[] = [
  { robots: [{ x: 175, y: 176 }], walls: [], shots: 4, g: 80, wind: 0 },
  { robots: [{ x: 260, y: 176 }], walls: [], shots: 4, g: 80, wind: 0 },
  { robots: [{ x: 165, y: 176 }, { x: 290, y: 176 }], walls: [], shots: 5, g: 80, wind: 0 },
  { robots: [{ x: 235, y: 128 }], walls: [], shots: 4, g: 80, wind: 0, hills: [{ x: 235, y: 176 }] },
  { robots: [{ x: 275, y: 176 }], walls: [{ x: 150, y: 118, w: 16, h: 72 }], shots: 4, g: 80, wind: 0 },
  { robots: [{ x: 205, y: 138 }, { x: 310, y: 176 }], walls: [{ x: 250, y: 108, w: 16, h: 82 }], shots: 6, g: 80, wind: 0, hills: [{ x: 205, y: 176 }] },
  { robots: [{ x: 205, y: 176 }, { x: 305, y: 150 }], walls: [], shots: 6, g: 80, wind: 20, hills: [{ x: 305, y: 176 }] },
  { robots: [{ x: 180, y: 176 }, { x: 250, y: 126 }, { x: 320, y: 176 }], walls: [{ x: 215, y: 110, w: 14, h: 80 }], shots: 7, g: 80, wind: -16, hills: [{ x: 250, y: 176 }] },
];

// Integrate a projectile path frame-by-frame (up = negative screen-y).
function trajectory(V: number, thetaDeg: number, g: number, wind: number): Pt[] {
  const th = rad(thetaDeg);
  let x = PIV.x;
  let y = PIV.y;
  let vx = V * Math.cos(th);
  let vy = -V * Math.sin(th);
  const dt = 1 / 60;
  const pts: Pt[] = [{ x, y }];
  for (let i = 0; i < 700; i++) {
    vy += g * dt;
    vx += wind * dt;
    x += vx * dt;
    y += vy * dt;
    pts.push({ x, y });
    if (y > H + 60 || x < -40 || x > W + 50) break;
  }
  return pts;
}

type Hit = { idx: number; kind: 'robot' | 'wall' | 'ground' | 'oob'; robotIdx?: number };

// Walk a path and find the first thing it strikes (wall blocks before robot).
function firstHit(pts: Pt[], robots: Robot[], walls: Wall[]): Hit {
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    for (const w of walls) {
      if (p.x >= w.x && p.x <= w.x + w.w && p.y >= w.y && p.y <= w.y + w.h) return { idx: i, kind: 'wall' };
    }
    for (let ri = 0; ri < robots.length; ri++) {
      const r = robots[ri];
      if (!r.alive) continue;
      if (Math.hypot(p.x - r.x, p.y - r.y) < r.r + ROCKET_R) return { idx: i, kind: 'robot', robotIdx: ri };
    }
    if (p.y >= GY) return { idx: i, kind: 'ground' };
    if (p.x > W + 20 || p.x < -20) return { idx: i, kind: 'oob' };
  }
  return { idx: pts.length - 1, kind: 'oob' };
}

// Inverse problem: required power V for a given angle to hit (tx,ty) — ignores
// wind (the assist is a hint; wind nudges the real shot). Picks the angle whose
// power lands in range and is closest to the 45° max-range sweet spot.
function firingSolution(robot: Pt, g: number): { angleIdx: number; V: number } | null {
  const dxh = robot.x - PIV.x;
  const dyUp = PIV.y - robot.y; // + if target is above the cannon
  let best: { angleIdx: number; V: number; score: number } | null = null;
  for (let i = 0; i < ANGLES.length; i++) {
    const th = rad(ANGLES[i].deg);
    const denom = Math.cos(th) * Math.cos(th) * (dxh * Math.tan(th) - dyUp);
    if (denom <= 0) continue;
    const V2 = (0.5 * g * dxh * dxh) / denom;
    if (V2 <= 0) continue;
    const V = Math.sqrt(V2);
    if (V < V_MIN || V > V_MAX) continue;
    const score = Math.abs(ANGLES[i].deg - 45);
    if (!best || score < best.score) best = { angleIdx: i, V, score };
  }
  return best ? { angleIdx: best.angleIdx, V: Math.round(best.V) } : null;
}

// ---- Targeting-computer trig questions (numeric answers) ----
type TrigQ = { prompt: string; answer: number; teach: string };
const TRIG_FACTORIES: (() => TrigQ)[] = [
  () => {
    const pick = [
      { deg: 30, n: 6 },
      { deg: 45, n: 4 },
      { deg: 60, n: 3 },
      { deg: 90, n: 2 },
    ][Math.floor(Math.random() * 4)];
    return { prompt: `Convert ${pick.deg}° to radians: ${pick.deg}° = π / ?`, answer: pick.n, teach: `${pick.deg}° = π/${pick.n} rad.` };
  },
  () => {
    const pow = [60, 80, 100, 120][Math.floor(Math.random() * 4)];
    return { prompt: `Power ${pow} at 60°. Horizontal speed vx = ${pow}·cos 60° = ${pow}·0.5 = ?`, answer: pow / 2, teach: `cos 60° = 0.5, so vx = ${pow / 2}.` };
  },
  () => {
    const pow = [60, 80, 100, 120][Math.floor(Math.random() * 4)];
    return { prompt: `Power ${pow} at 30°. Vertical speed vy = ${pow}·sin 30° = ${pow}·0.5 = ?`, answer: pow / 2, teach: `sin 30° = 0.5, so vy = ${pow / 2}.` };
  },
  () => {
    const s = [20, 30, 40, 50][Math.floor(Math.random() * 4)];
    return { prompt: `A wall is ${s} tall and ${s} wide. tan θ = ${s}/${s} = 1, so θ = ? degrees`, answer: 45, teach: `tan 45° = 1, so θ = 45°.` };
  },
  () => ({ prompt: `Which launch angle flies the FARTHEST? (degrees)`, answer: 45, teach: `45° gives the maximum range.` }),
  () => ({ prompt: `tan 45° = ? (opposite ÷ adjacent when they're equal)`, answer: 1, teach: `Equal legs → tan 45° = 1.` }),
];

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Blow up every evil robot 🤖 with your tank. Clear all the robots in a level to roll on to the next one.' },
  { heading: 'Pick an angle', body: 'Choose an acute launch angle — 15°, 30°, 45°, 60°, or 75°. Each one is also shown in radians (π/12, π/6, π/4, π/3, 5π/12) on the protractor.' },
  { heading: 'The right triangle (SOH-CAH-TOA)', body: 'Your power V is the HYPOTENUSE. It splits into a flat part vx = V·cosθ (adjacent → CAH) and an up part vy = V·sinθ (opposite → SOH). tanθ = opp ÷ adj = vy ÷ vx (TOA). Watch the triangle change as you aim!' },
  { heading: 'Power = hypotenuse length', body: 'Slide the power up or down. More power = a longer hypotenuse = a faster, farther rocket.' },
  { heading: 'Gravity makes the arc', body: 'The rocket curves down as it flies, so you arc OVER walls and hills to reach robots behind them. Late levels add wind that nudges the rocket sideways.' },
  { heading: 'Targeting Computer', body: 'Stuck? Tap 🎯 Firing solution and answer a trig question — get it right and the computer reveals the perfect angle + power with a dotted preview arc.' },
];
const CONTROLS = 'Tap an angle chip (or ◀▶ keys), slide the power (or ▲▼), then Fire 🚀 (or space). Tap 🎯 for a trig firing solution.';

export function TankAttack() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'aim' | 'fly'>('howto');
  const [levelIdx, setLevelIdx] = useState(0);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [hills, setHills] = useState<Pt[]>([]);
  const [shotsLeft, setShotsLeft] = useState(0);
  const [angleIdx, setAngleIdx] = useState(2);
  const [power, setPower] = useState(100);
  const [predicted, setPredicted] = useState<Pt[] | null>(null);

  const [flight, setFlight] = useState<{ pts: Pt[]; hit: Hit } | null>(null);
  const flightRef = useRef<{ pts: Pt[]; hit: Hit } | null>(null);
  const [flyIdx, setFlyIdx] = useState(0);
  const flyIdxRef = useRef(0);

  const [explosions, setExplosions] = useState<{ x: number; y: number; key: number }[]>([]);
  const exKeyRef = useRef(1);
  const [banner, setBanner] = useState<string | null>(null);
  const [solving, setSolving] = useState<{ q: TrigQ; input: string; wrong: boolean } | null>(null);
  const [shake, setShake] = useState(0); // bump to trigger a screen shake
  const [bomb, setBomb] = useState(false); // a bomb drops on you when you miss

  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const killsRef = useRef(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const lvl = LEVELS[levelIdx];

  const loadLevel = (i: number) => {
    const L = LEVELS[i];
    setLevelIdx(i);
    setRobots(L.robots.map((p, k) => ({ x: p.x, y: p.y, r: 14, alive: true, emoji: TARGET_EMOJI[(i + k) % TARGET_EMOJI.length] })));
    setWalls(L.walls.map((w) => ({ ...w })));
    setHills(L.hills ? L.hills.map((p) => ({ ...p })) : []);
    setShotsLeft(L.shots);
    setAngleIdx(2);
    setPower(100);
    setPredicted(null);
    setFlight(null);
    flightRef.current = null;
    setFlyIdx(0);
    flyIdxRef.current = 0;
    setPhase('aim');
  };

  const startGame = () => {
    setScore(0);
    setKills(0);
    killsRef.current = 0;
    setOutcome(null);
    loadLevel(0);
  };

  const addExplosion = (x: number, y: number) => {
    const key = exKeyRef.current++;
    setExplosions((prev) => [...prev, { x, y, key }]);
    window.setTimeout(() => setExplosions((prev) => prev.filter((e) => e.key !== key)), 700);
  };

  const endRun = (_win: boolean, clearedLevels: number) => {
    const xp = Math.max(2, Math.min(20, clearedLevels * 3 + killsRef.current));
    addArcadePoints(score);
    setOutcome(recordArcadePlay('tank', xp));
  };

  const fire = () => {
    if (phase !== 'aim') return;
    setPredicted(null);
    const pts = trajectory(power, ANGLES[angleIdx].deg, lvl.g, lvl.wind);
    const hit = firstHit(pts, robots, walls);
    const clipped = pts.slice(0, hit.idx + 1);
    const f = { pts: clipped, hit };
    setFlight(f);
    flightRef.current = f;
    flyIdxRef.current = 0;
    setFlyIdx(0);
    setPhase('fly');
    sfx.shoot();
    haptic(HAPTIC.tap);
  };

  // Animate the rocket along its (already-collision-clipped) path.
  useEffect(() => {
    if (phase !== 'fly' || !flight) return;
    let raf = 0;
    const step = () => {
      if (pausedRef.current) {
        raf = requestAnimationFrame(step);
        return;
      }
      flyIdxRef.current += 5;
      if (flyIdxRef.current >= flight.pts.length - 1) {
        setFlyIdx(flight.pts.length - 1);
        resolveFlight();
        return;
      }
      setFlyIdx(flyIdxRef.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, flight]);

  const resolveFlight = () => {
    const f = flightRef.current;
    if (!f) return;
    flightRef.current = null;
    let newRobots = robots;
    if (f.hit.kind === 'robot' && f.hit.robotIdx != null) {
      const r = robots[f.hit.robotIdx];
      newRobots = robots.map((rb, i) => (i === f.hit.robotIdx ? { ...rb, alive: false } : rb));
      addExplosion(r.x, r.y);
      sfx.explode();
      haptic(HAPTIC.explode);
      setShake((k) => k + 1);
      const pts = 100 + Math.round((r.x - PIV.x) / 4);
      setScore((s) => s + pts);
      killsRef.current += 1;
      setKills(killsRef.current);
    } else {
      sfx.explode();
      haptic(HAPTIC.explode);
      setShake((k) => k + 1);
      setBomb(true);
      addExplosion(PIV.x, PIV.y - 6);
      window.setTimeout(() => setBomb(false), 700);
    }
    setRobots(newRobots);
    setFlight(null);
    flyIdxRef.current = 0;
    setFlyIdx(0);

    const remaining = newRobots.filter((r) => r.alive).length;
    const shots = shotsLeft - 1;
    setShotsLeft(shots);

    if (remaining === 0) {
      setScore((s) => s + 50);
      sfx.levelUp();
      haptic(HAPTIC.levelUp);
      if (levelIdx >= LEVELS.length - 1) {
        setBanner('🏆 Victory!');
        endRun(true, LEVELS.length);
        return;
      }
      setBanner('✅ Level cleared!');
      setPhase('aim');
      window.setTimeout(() => {
        setBanner(null);
        loadLevel(levelIdx + 1);
      }, 1300);
    } else if (shots <= 0) {
      setBanner('💥 Out of rockets!');
      endRun(false, levelIdx);
    } else {
      setPhase('aim');
    }
  };

  // Targeting computer.
  const openTargeting = () => {
    if (phase !== 'aim') return;
    const q = TRIG_FACTORIES[Math.floor(Math.random() * TRIG_FACTORIES.length)]();
    setSolving({ q, input: '', wrong: false });
  };
  const submitTargeting = () => {
    if (!solving) return;
    const correct = Number(solving.input) === solving.q.answer;
    recordArcadeAnswer(arcadeUnit, correct);
    if (correct) {
      sfx.powerup();
      haptic(HAPTIC.levelUp);
      setScore((s) => s + 30);
      const target = robots.find((r) => r.alive);
      const sol = target ? firingSolution(target, lvl.g) : null;
      if (sol) {
        setAngleIdx(sol.angleIdx);
        setPower(sol.V);
        const pts = trajectory(sol.V, ANGLES[sol.angleIdx].deg, lvl.g, lvl.wind);
        const hit = firstHit(pts, robots, walls);
        setPredicted(pts.slice(0, hit.idx + 1));
      }
      setSolving(null);
    } else {
      sfx.hurt();
      haptic(HAPTIC.heavy);
      setSolving({ ...solving, wrong: true, input: '' });
    }
  };

  // Keyboard controls.
  useEffect(() => {
    if (phase !== 'aim' || solving) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') setAngleIdx((i) => Math.max(0, i - 1));
      else if (k === 'arrowright' || k === 'd') setAngleIdx((i) => Math.min(ANGLES.length - 1, i + 1));
      else if (k === 'arrowup' || k === 'w') setPower((p) => Math.min(V_MAX, p + 5));
      else if (k === 'arrowdown' || k === 's') setPower((p) => Math.max(V_MIN, p - 5));
      else if (k === ' ' || k === 'enter') {
        e.preventDefault();
        fire();
      } else return;
      setPredicted(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, solving, angleIdx, power, robots, walls]);

  // ---- screens ----
  if (outcome) {
    const won = levelIdx >= LEVELS.length - 1 && robots.every((r) => !r.alive);
    return (
      <div>
        <ArcadeHeader title="Tank Attack" emoji="🎯" />
        <ArcadeEndCard
          gameId="tank"
          outcome={outcome}
          win={won}
          scoreLine={`Cleared ${won ? LEVELS.length : levelIdx} levels · ${kills} robots blasted`}
          onReplay={startGame}
        />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Tank Attack" emoji="🎯" />
        <HowToPlay emoji="🎯" title="Tank Attack" gradient="from-stone-600 to-emerald-800" sections={HOWTO} controls={CONTROLS} onStart={startGame} />
      </div>
    );
  }

  // live trig readout for the chosen angle + power
  const deg = ANGLES[angleIdx].deg;
  const th = rad(deg);
  const adj = Math.round(power * Math.cos(th));
  const opp = Math.round(power * Math.sin(th));

  // SOH-CAH-TOA triangle geometry
  const triLen = 36 + ((power - V_MIN) / (V_MAX - V_MIN)) * 64;
  const hx = PIV.x + triLen * Math.cos(th);
  const hy = PIV.y - triLen * Math.sin(th);
  const cornerX = hx;
  const cornerY = PIV.y;
  const ra = 20; // angle-arc radius
  const PROT = 66; // protractor radius

  const rocket = flight ? flight.pts[Math.min(flyIdx, flight.pts.length - 1)] : null;
  const rocketAngle = (() => {
    if (!flight) return 0;
    const i = Math.min(flyIdx, flight.pts.length - 1);
    const a = flight.pts[Math.max(0, i - 1)];
    const b = flight.pts[i];
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  })();

  return (
    <div>
      <ArcadeHeader title="Tank Attack" emoji="🎯" />

      {/* HUD */}
      <div className="max-w-md mx-auto mb-2 flex items-center justify-between gap-2 text-[11px] font-display font-extrabold">
        <span className="rounded-full bg-slate-800 text-white px-2.5 py-1">Level {levelIdx + 1}/{LEVELS.length}</span>
        <span className="rounded-full bg-rose-100 text-rose-700 px-2.5 py-1">🚀 {shotsLeft} left</span>
        <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1">🤖 {robots.filter((r) => r.alive).length}</span>
        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 tabular-nums">⭐ {score}</span>
        {lvl.wind !== 0 && <span className="rounded-full bg-sky-100 text-sky-800 px-2.5 py-1">💨 {lvl.wind > 0 ? '→' : '←'} wind</span>}
      </div>

      {/* big angle/power readout */}
      <div className="max-w-md mx-auto mb-2 rounded-2xl bg-indigo-50 border-2 border-indigo-200 px-3 py-2 text-center">
        <div className="text-2xl font-display font-extrabold text-indigo-700 tabular-nums">
          θ = {deg}° = {ANGLES[angleIdx].rad} rad <span className="text-slate-400">·</span> power V = {power}
        </div>
      </div>

      {/* battlefield */}
      <GameStage theme="tank" className="max-w-md mx-auto">
        <motion.div key={shake} animate={shake ? { x: [0, -7, 7, -5, 5, 0], y: [0, 4, -4, 3, 0] } : undefined} transition={{ duration: 0.4 }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" style={{ aspectRatio: `${W} / ${H}` }}>
          {/* protractor (0–90°) at the cannon */}
          <path d={`M ${PIV.x + PROT} ${PIV.y} A ${PROT} ${PROT} 0 0 0 ${PIV.x} ${PIV.y - PROT}`} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
          {ANGLES.map((a) => {
            const t = rad(a.deg);
            const ix = PIV.x + Math.cos(t) * (PROT - 7);
            const iy = PIV.y - Math.sin(t) * (PROT - 7);
            const ox = PIV.x + Math.cos(t) * PROT;
            const oy = PIV.y - Math.sin(t) * PROT;
            const lx = PIV.x + Math.cos(t) * (PROT + 12);
            const ly = PIV.y - Math.sin(t) * (PROT + 12);
            const cur = a.deg === deg;
            return (
              <g key={a.deg}>
                <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={cur ? '#4f46e5' : 'rgba(255,255,255,0.6)'} strokeWidth={cur ? 3 : 1.5} />
                <text x={lx} y={ly} fontSize={7.5} fontWeight={800} fill={cur ? '#3730a3' : '#e2e8f0'} textAnchor="middle" dominantBaseline="middle">
                  {a.deg}°
                </text>
              </g>
            );
          })}

          {/* SOH-CAH-TOA right triangle (only while aiming) */}
          {phase === 'aim' && (
            <g>
              {/* adjacent (horizontal, CAH) */}
              <line x1={PIV.x} y1={PIV.y} x2={cornerX} y2={cornerY} stroke="#10b981" strokeWidth={3} strokeLinecap="round" />
              {/* opposite (vertical, SOH) */}
              <line x1={cornerX} y1={cornerY} x2={hx} y2={hy} stroke="#3b82f6" strokeWidth={3} strokeLinecap="round" />
              {/* hypotenuse (V) with arrowhead */}
              <line x1={PIV.x} y1={PIV.y} x2={hx} y2={hy} stroke="#f97316" strokeWidth={3.5} strokeLinecap="round" />
              <polygon
                points="0,-4 8,0 0,4"
                fill="#f97316"
                transform={`translate(${hx} ${hy}) rotate(${(Math.atan2(hy - PIV.y, hx - PIV.x) * 180) / Math.PI})`}
              />
              {/* right-angle square at the corner */}
              <rect x={cornerX - 7} y={cornerY - 7} width={7} height={7} fill="none" stroke="#475569" strokeWidth={1} />
              {/* angle arc */}
              <path d={`M ${PIV.x + ra} ${PIV.y} A ${ra} ${ra} 0 0 0 ${PIV.x + ra * Math.cos(th)} ${PIV.y - ra * Math.sin(th)}`} fill="none" stroke="#fde047" strokeWidth={2} />
              {/* leg labels */}
              <text x={(PIV.x + cornerX) / 2} y={PIV.y + 10} fontSize={7.5} fontWeight={800} fill="#065f46" textAnchor="middle">
                cos {deg}° = {adj}
              </text>
              <text x={cornerX + 4} y={(cornerY + hy) / 2} fontSize={7.5} fontWeight={800} fill="#1e40af">
                sin = {opp}
              </text>
            </g>
          )}

          {/* predicted (firing-solution) arc */}
          {predicted && (
            <polyline points={predicted.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth={2} strokeDasharray="3 4" opacity={0.9} />
          )}

          {/* ground */}
          <rect x={0} y={GY} width={W} height={H - GY} fill="#3f6212" />
          <rect x={0} y={GY} width={W} height={4} fill="#4d7c0f" />

          {/* hills/platforms under elevated robots */}
          {hills.map((hl, i) => (
            <rect key={i} x={hl.x - 22} y={hl.y + 12} width={44} height={GY - (hl.y + 12)} rx={6} fill="#65762e" />
          ))}

          {/* walls */}
          {walls.map((w, i) => (
            <g key={i}>
              <rect x={w.x} y={w.y} width={w.w} height={w.h} rx={2} fill="#78716c" stroke="#44403c" strokeWidth={2} />
              <line x1={w.x} y1={w.y + w.h / 3} x2={w.x + w.w} y2={w.y + w.h / 3} stroke="#44403c" strokeWidth={1} />
              <line x1={w.x} y1={w.y + (2 * w.h) / 3} x2={w.x + w.w} y2={w.y + (2 * w.h) / 3} stroke="#44403c" strokeWidth={1} />
            </g>
          ))}

          {/* robots */}
          {robots.map((r, i) =>
            r.alive ? (
              <text key={i} x={r.x} y={r.y} fontSize={26} textAnchor="middle" dominantBaseline="central">
                {r.emoji}
              </text>
            ) : null,
          )}

          {/* tank */}
          <g>
            <line x1={PIV.x} y1={PIV.y} x2={PIV.x + 22 * Math.cos(th)} y2={PIV.y - 22 * Math.sin(th)} stroke="#1f2937" strokeWidth={6} strokeLinecap="round" />
            <rect x={PIV.x - 18} y={PIV.y - 2} width={36} height={16} rx={6} fill="#3f3f46" stroke="#18181b" strokeWidth={2} />
            <circle cx={PIV.x} cy={PIV.y} r={9} fill="#52525b" stroke="#18181b" strokeWidth={2} />
            <circle cx={PIV.x - 11} cy={GY - 2} r={5} fill="#27272a" />
            <circle cx={PIV.x} cy={GY - 2} r={5} fill="#27272a" />
            <circle cx={PIV.x + 11} cy={GY - 2} r={5} fill="#27272a" />
          </g>

          {/* trajectory trail + rocket */}
          {flight && rocket && (
            <>
              <polyline points={flight.pts.slice(0, flyIdx + 1).map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(248,250,252,0.8)" strokeWidth={1.5} strokeDasharray="2 3" />
              <text x={rocket.x} y={rocket.y} fontSize={18} textAnchor="middle" dominantBaseline="central" transform={`rotate(${rocketAngle} ${rocket.x} ${rocket.y})`}>
                🚀
              </text>
            </>
          )}

          {/* explosions */}
          {explosions.map((e) => (
            <text key={e.key} x={e.x} y={e.y} fontSize={34} textAnchor="middle" dominantBaseline="central">
              💥
            </text>
          ))}
          {bomb && (
            <text x={PIV.x} y={PIV.y - 12} fontSize={28} textAnchor="middle" dominantBaseline="central">💣</text>
          )}
        </svg>
        </motion.div>

        {/* level banner */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="rounded-2xl bg-slate-900/80 text-white font-display font-extrabold text-2xl px-6 py-3 shadow-lg">{banner}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </GameStage>

      {/* SOH-CAH-TOA ratio chips */}
      <div className="max-w-md mx-auto mt-2 grid grid-cols-3 gap-1.5 text-[10.5px] font-display font-bold">
        <div className="rounded-xl bg-blue-50 border-2 border-blue-200 px-2 py-1.5 text-blue-800 text-center">
          <div className="font-extrabold">SOH</div>
          sin {deg}° = opp/hyp = {opp}/{power} ≈ {Math.sin(th).toFixed(2)}
        </div>
        <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 px-2 py-1.5 text-emerald-800 text-center">
          <div className="font-extrabold">CAH</div>
          cos {deg}° = adj/hyp = {adj}/{power} ≈ {Math.cos(th).toFixed(2)}
        </div>
        <div className="rounded-xl bg-amber-50 border-2 border-amber-200 px-2 py-1.5 text-amber-800 text-center">
          <div className="font-extrabold">TOA</div>
          tan {deg}° = opp/adj = {opp}/{adj} ≈ {Math.tan(th).toFixed(2)}
        </div>
      </div>

      {/* all special angles strip */}
      <div className="max-w-md mx-auto mt-2 flex flex-wrap justify-center gap-1">
        {ANGLES.map((a, i) => (
          <button
            key={a.deg}
            type="button"
            disabled={phase !== 'aim'}
            onClick={() => {
              setAngleIdx(i);
              setPredicted(null);
            }}
            className={`rounded-lg px-2 py-1.5 text-xs font-display font-extrabold tabular-nums border-2 transition-colors ${
              i === angleIdx ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            {a.deg}°<span className="opacity-70"> · {a.rad}</span>
          </button>
        ))}
      </div>

      {/* power slider + fire + targeting */}
      <div className="max-w-md mx-auto mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-display font-extrabold text-slate-500 w-14">Power</span>
          <input
            type="range"
            min={V_MIN}
            max={V_MAX}
            value={power}
            disabled={phase !== 'aim'}
            onChange={(e) => {
              setPower(Number(e.target.value));
              setPredicted(null);
            }}
            className="flex-1 accent-orange-500"
          />
          <span className="text-sm font-display font-extrabold text-orange-600 tabular-nums w-9 text-right">{power}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={openTargeting}
            disabled={phase !== 'aim'}
            className="min-h-12 px-3 rounded-2xl bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-display font-extrabold disabled:opacity-50"
          >
            🎯 Firing solution
          </button>
          <button
            type="button"
            onClick={fire}
            disabled={phase !== 'aim'}
            className="flex-1 min-h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all disabled:opacity-50"
          >
            🚀 Fire!
          </button>
        </div>
      </div>

      <GameInstructions emoji="🎯" title="Tank Attack" sections={HOWTO} controls={CONTROLS} />

      {/* targeting-computer modal */}
      {solving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4" onClick={() => setSolving(null)}>
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs font-display font-extrabold uppercase tracking-widest text-cyan-600">🎯 Targeting Computer</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-base font-display font-extrabold text-slate-800 min-h-16 flex items-center justify-center">
              {solving.q.prompt}
            </div>
            <div className={`mt-3 h-11 rounded-xl border-2 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums ${solving.wrong ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>
              {solving.input || (solving.wrong ? 'Try again!' : '—')}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() =>
                    setSolving((cur) =>
                      cur
                        ? {
                            ...cur,
                            wrong: false,
                            input:
                              k === 'del'
                                ? cur.input.slice(0, -1)
                                : k === '-'
                                  ? cur.input.startsWith('-')
                                    ? cur.input.slice(1)
                                    : '-' + cur.input
                                  : cur.input.length < 5
                                    ? cur.input + k
                                    : cur.input,
                          }
                        : cur,
                    )
                  }
                  className="min-h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-lg text-slate-800 active:translate-y-0.5"
                >
                  {k === 'del' ? '⌫' : k}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={submitTargeting}
              className="mt-3 w-full min-h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-display font-extrabold"
            >
              Compute solution ▶
            </button>
            <button type="button" onClick={() => setSolving(null)} className="mt-2 w-full text-xs font-display font-bold text-slate-400">
              skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
