import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { makeChallenge, type Challenge } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Turbo Dash — an original Mode-7 / OutRun-style pseudo-3D racer. The road is
// drawn as stacked perspective bands that scroll and curve; steer the car with
// finger-drag (or ◀▶ / arrows), dodge traffic, and reach each checkpoint before
// the clock runs out. Solve a quick problem at checkpoints for a nitro boost.

const BANDS = 28;
const SCENERY = [
  { name: 'Sunny Coast', theme: 'sky', grass: '#86efac', road: '#52525b', rumble: '#ef4444' },
  { name: 'Sunset Hills', theme: 'meadow', grass: '#fca5a5', road: '#44403c', rumble: '#fb923c' },
  { name: 'Night City', theme: 'night', grass: '#1e293b', road: '#334155', rumble: '#a78bfa' },
  { name: 'Neon Rift', theme: 'space', grass: '#312e81', road: '#1f2937', rumble: '#22d3ee' },
];
const TRAFFIC = ['🚗', '🚙', '🚌', '🚜', '🚚'];

type Car = { z: number; lane: number; emoji: string };

const RACER_CONTROLS = 'Drag to steer · ◀ ▶ buttons · arrow keys. Auto-accelerates.';
function racerSections(maxStage: number): HowToSection[] {
  return [
    { heading: 'Goal', body: 'Race as far as you can! Reach each checkpoint before the timer hits zero to keep going. New scenery every stage.' },
    { heading: 'Steering', body: 'Drag your finger left/right on the road to steer (or use ◀ ▶ / arrow keys). The road curves — lean into the bend or you’ll slide onto the grass and slow down.' },
    { heading: 'Watch out', body: 'Dodge traffic 🚗🚌🚜 — bumping one slows you and costs time!' },
    { heading: 'Pit stops', body: 'Every 30 seconds you pull into a pit stop — solve a quick math problem for a nitro speed boost, then keep racing.' },
    { heading: 'Best', body: 'Furthest stage so far: ' + maxStage + '.' },
  ];
}

export function Mode7Racer() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const maxStage = useProgress((s) => s.racerMaxStage);
  const setMaxStage = useProgress((s) => s.setRacerMaxStage);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'race'>('howto');
  const carXRef = useRef(0); // -1..1 screen position
  const steerRef = useRef(0); // target from input
  const keyRef = useRef({ left: false, right: false });
  const speedRef = useRef(0); // 0..1
  const zRef = useRef(0); // distance
  const curveRef = useRef(0);
  const curveTargetRef = useRef(0);
  const segRef = useRef(0);
  const trafficRef = useRef<Car[]>([]);
  const spawnRef = useRef(1);
  const stageRef = useRef(1);
  const timeRef = useRef(30);
  const nextCpRef = useRef(600); // distance of next checkpoint
  const runRef = useRef(0); // seconds of driving elapsed
  const nextPitRef = useRef(30); // next pit-stop (math) time
  const kmRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [cInput, setCInput] = useState('');
  const challengeRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const scenery = SCENERY[Math.min(SCENERY.length - 1, Math.floor((stageRef.current - 1) % SCENERY.length))];

  const start = () => {
    carXRef.current = 0; steerRef.current = 0; speedRef.current = 0; zRef.current = 0;
    curveRef.current = 0; curveTargetRef.current = 0; segRef.current = 0;
    trafficRef.current = []; spawnRef.current = 1; stageRef.current = 1; timeRef.current = 30;
    nextCpRef.current = 600; kmRef.current = 0; doneRef.current = false; challengeRef.current = false;
    runRef.current = 0; nextPitRef.current = 30;
    setChallenge(null); setOutcome(null); setPhase('race');
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setMaxStage(Math.max(maxStage, stageRef.current));
    addArcadePoints(Math.round(kmRef.current) * 5 + stageRef.current * 40);
    const xp = Math.max(2, Math.min(20, stageRef.current * 3));
    sfx.lose(); haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('turbo', xp));
  };

  useEffect(() => {
    if (outcome || phase !== 'race') return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (pausedRef.current || challengeRef.current) { lastRef.current = now; rafRef.current = requestAnimationFrame(tick); return; }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      const stage = stageRef.current;

      // steering target from keys or drag
      let target = steerRef.current;
      if (keyRef.current.left) target = -1;
      if (keyRef.current.right) target = 1;
      carXRef.current += (target - carXRef.current) * Math.min(1, dt * 6);
      carXRef.current = Math.max(-1.2, Math.min(1.2, carXRef.current));

      // curve segments
      segRef.current -= dt;
      if (segRef.current <= 0) {
        segRef.current = 1.5 + Math.random() * 2;
        curveTargetRef.current = (Math.random() * 2 - 1) * (0.4 + stage * 0.12);
      }
      curveRef.current += (curveTargetRef.current - curveRef.current) * Math.min(1, dt * 1.5);

      // off-road check (car must stay near road center, which the curve pushes)
      const roadCenter = curveRef.current * 0.5; // -..+ in carX units
      const offRoad = Math.abs(carXRef.current - roadCenter) > 0.9;
      const maxSpeed = offRoad ? 0.35 : 1;
      speedRef.current += ((maxSpeed) - speedRef.current) * Math.min(1, dt * (offRoad ? 4 : 1.2));
      const v = speedRef.current * (160 + stage * 24);
      zRef.current += v * dt;
      kmRef.current += (v * dt) / 100;
      // the curve nudges the car outward
      carXRef.current += curveRef.current * speedRef.current * dt * 0.5;

      // timer
      timeRef.current -= dt;
      runRef.current += dt;
      if (timeRef.current <= 0) { finish(); return; }

      // checkpoint reached — advance the stage + add time (NO math here)
      if (zRef.current >= nextCpRef.current) {
        nextCpRef.current += 600 + stage * 80;
        stageRef.current = stage + 1;
        setMaxStage(Math.max(maxStage, stageRef.current));
        timeRef.current += 12;
        sfx.levelUp(); haptic(HAPTIC.levelUp);
      }

      // pit stop — a math problem only every 30 seconds of driving
      if (runRef.current >= nextPitRef.current) {
        nextPitRef.current += 30;
        challengeRef.current = true;
        setChallenge(makeChallenge(Math.min(5, 1 + Math.floor(stage / 2))));
        setCInput('');
      }

      // traffic
      spawnRef.current -= dt;
      if (spawnRef.current <= 0 && trafficRef.current.length < 6) {
        spawnRef.current = Math.max(0.5, 1.4 - stage * 0.08);
        trafficRef.current.push({ z: zRef.current + 900, lane: (Math.random() * 2 - 1) * 0.7, emoji: TRAFFIC[Math.floor(Math.random() * TRAFFIC.length)] });
      }
      for (const c of trafficRef.current) {
        const rel = c.z - zRef.current;
        if (rel < 40 && rel > -20 && Math.abs(c.lane - carXRef.current) < 0.45) {
          // crash
          speedRef.current = 0.1; timeRef.current -= 2; c.z = zRef.current - 200;
          sfx.explode(); haptic(HAPTIC.heavy);
        }
      }
      trafficRef.current = trafficRef.current.filter((c) => c.z > zRef.current - 60);

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
      if (k === 'arrowleft' || k === 'a') keyRef.current.left = v;
      else if (k === 'arrowright' || k === 'd') keyRef.current.right = v;
      else return;
      e.preventDefault();
    };
    const dn = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  const resolveChallenge = () => {
    if (!challenge) return;
    const ok = Number(cInput.trim()) === challenge.answer && cInput.trim() !== '';
    setChallenge(null);
    challengeRef.current = false;
    lastRef.current = performance.now();
    if (ok) { addAchievement(10); speedRef.current = 1.4; timeRef.current += 4; sfx.powerup(); haptic(HAPTIC.pickup); }
  };

  const steerFrom = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    steerRef.current = Math.max(-1, Math.min(1, ((clientX - r.left) / r.width - 0.5) * 2.4));
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Turbo Dash" emoji="🏎️" />
        <ArcadeEndCard gameId="turbo" outcome={outcome} win={stageRef.current >= 4}
          scoreLine={`Reached stage ${stageRef.current} · ${Math.round(kmRef.current)} km`} onReplay={start} />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Turbo Dash" emoji="🏎️" />
        <HowToPlay
          emoji="🏎️"
          title="Turbo Dash"
          gradient="from-sky-500 to-indigo-700"
          sections={racerSections(maxStage)}
          controls={RACER_CONTROLS}
          onStart={start}
        />
      </div>
    );
  }

  // --- render perspective road ---
  const bands = [];
  for (let i = 0; i < BANDS; i++) {
    const t = i / (BANDS - 1); // 0 far(top) .. 1 near(bottom)
    const widthPct = 14 + t * 84;
    const centerPct = 50 + curveRef.current * (1 - t) * (1 - t) * 55 - carXRef.current * t * 22;
    const stripe = Math.floor(zRef.current * 0.02 + i * 0.5) % 2 === 0;
    bands.push(
      <div key={i} className="absolute left-0 right-0" style={{ top: `${(i / BANDS) * 100}%`, height: `${100 / BANDS + 0.5}%`, background: scenery.grass }}>
        <div className="absolute top-0 bottom-0" style={{ left: `${centerPct - widthPct / 2}%`, width: `${widthPct}%`, background: scenery.road, borderLeft: `3px solid ${stripe ? scenery.rumble : '#fff'}`, borderRight: `3px solid ${stripe ? scenery.rumble : '#fff'}` }}>
          {t > 0.25 && <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2" style={{ width: Math.max(1, t * 5), background: stripe ? '#fde047' : 'transparent' }} />}
        </div>
      </div>,
    );
  }

  const carScreen = 50 + carXRef.current * 30;

  return (
    <div>
      <ArcadeHeader title="Turbo Dash" emoji="🏎️" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-orange-600">⏱ {Math.max(0, Math.ceil(timeRef.current))}s</span>
        <span className="text-indigo-600">Stage {stageRef.current} · {scenery.name}</span>
        <span className="text-slate-700">{Math.round(kmRef.current)} km</span>
      </div>

      <GameStage theme={scenery.theme} className="max-w-sm mx-auto" style={{ width: 'min(100%, 44vh)' }}>
        <div
          className="relative overflow-hidden mx-auto touch-none"
          style={{ width: '100%', aspectRatio: '3 / 4' }}
          onPointerDown={(e) => { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); steerFrom(e.clientX, e.currentTarget); }}
          onPointerMove={(e) => { if ((e.currentTarget as Element).hasPointerCapture?.(e.pointerId)) steerFrom(e.clientX, e.currentTarget); }}
        >
          {bands}
          {/* traffic */}
          {trafficRef.current.map((c, i) => {
            const rel = c.z - zRef.current;
            if (rel < 0 || rel > 900) return null;
            const t = 1 - rel / 900; // 0 far .. 1 near
            const size = 8 + t * t * 60;
            const centerPct = 50 + curveRef.current * (1 - t) * (1 - t) * 55 - carXRef.current * t * 22 + c.lane * t * 30;
            return (
              <div key={i} className="absolute" style={{ left: `${centerPct}%`, top: `${10 + t * 78}%`, transform: 'translate(-50%,-50%)', fontSize: size }} aria-hidden>
                {c.emoji}
              </div>
            );
          })}
          {/* player car */}
          <div className="absolute" style={{ left: `${carScreen}%`, bottom: '4%', transform: 'translateX(-50%)', fontSize: 44 }} aria-hidden>🏎️</div>
        </div>
      </GameStage>

      {/* steering buttons */}
      <div className="max-w-sm mx-auto mt-3 flex gap-2 select-none">
        <button type="button" onPointerDown={(e) => { e.preventDefault(); keyRef.current.left = true; }} onPointerUp={() => (keyRef.current.left = false)} onPointerLeave={() => (keyRef.current.left = false)}
          className="flex-1 min-h-14 rounded-2xl bg-white border-2 border-slate-200 text-2xl font-display font-extrabold active:bg-slate-100">◀</button>
        <button type="button" onPointerDown={(e) => { e.preventDefault(); keyRef.current.right = true; }} onPointerUp={() => (keyRef.current.right = false)} onPointerLeave={() => (keyRef.current.right = false)}
          className="flex-1 min-h-14 rounded-2xl bg-white border-2 border-slate-200 text-2xl font-display font-extrabold active:bg-slate-100">▶</button>
      </div>
      <p className="text-center text-[11px] text-slate-500 mt-2">Drag on the road to steer · dodge traffic · reach the checkpoint!</p>

      {challenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">🛠️</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Pit stop! Solve for NITRO 🔥</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold leading-snug break-words">{challenge.prompt}</div>
            <input autoFocus inputMode="numeric" value={cInput} onChange={(e) => setCInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && resolveChallenge()}
              className="mt-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-center text-xl font-display font-extrabold focus:border-orange-500 focus:outline-none" placeholder="?" />
            <button type="button" onClick={resolveChallenge} className="mt-3 w-full min-h-11 rounded-2xl bg-orange-500 text-white font-display font-extrabold">Go! 🏁</button>
            <button type="button" onClick={() => { setChallenge(null); challengeRef.current = false; lastRef.current = performance.now(); }} className="mt-2 w-full text-xs font-display font-bold text-slate-400">skip</button>
          </div>
        </div>
      )}

      <GameInstructions emoji="🏎️" title="Turbo Dash" sections={racerSections(maxStage)} controls={RACER_CONTROLS} />
    </div>
  );
}
