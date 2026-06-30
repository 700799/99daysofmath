import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { GameInstructions, type HowToSection } from './HowToPlay';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Math Pop — a casual "Candy-Crush-meets-a-calculator" bubble game. Numbered
// bubbles float up the screen; you're given a TARGET number and pop a combination
// of bubbles that adds up to it before the screen fills with stuck bubbles. Quick
// addition + number composition. Original emoji/SVG art.

const W = 360;
const H = 320;
const R = 19;           // bubble radius
const TOP = 30;         // ceiling where bubbles stick
const MAX_STUCK = 12;   // screen "full" → game over

type Bubble = { id: number; x: number; y: number; n: number; vy: number; sel: boolean; stuck: boolean };
let BID = 1;

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Numbered bubbles float up the screen. Pop a group of bubbles that ADDS UP to the target number 🎯!' },
  { heading: 'How to pop', body: 'Tap bubbles to select them — the running total shows at the top. When your selected bubbles add up to the target, they POP for points.' },
  { heading: 'Watch the top', body: 'Bubbles that reach the top get stuck. If too many pile up, the screen fills and it’s game over — so keep popping!' },
  { heading: 'Math', body: 'Quick addition and number composition: there are many ways to make a number. Go too high? Your selection clears — try again.' },
];
const CONTROLS = 'Tap bubbles to add them to your total. Hit the target to pop. Tap a selected bubble again to deselect.';

export function MathPop() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'play'>('play');
  const [, setTick] = useState(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const bubbles = useRef<Bubble[]>([]);
  const target = useRef(10);
  const score = useRef(0);
  const pops = useRef(0);
  const spawnCd = useRef(1.0);
  const rise = useRef(26); // upward speed (grows over time)
  const flash = useRef<'good' | 'bad' | null>(null);
  const doneRef = useRef(false);
  const lastRef = useRef(0);
  const rafRef = useRef(0);

  const newTarget = () => { target.current = 8 + Math.floor(Math.random() * 13); }; // 8..20

  const start = () => {
    bubbles.current = [];
    score.current = 0; pops.current = 0; spawnCd.current = 0.6; rise.current = 26;
    flash.current = null; doneRef.current = false;
    newTarget();
    // seed a few bubbles
    for (let i = 0; i < 5; i++) bubbles.current.push(mk(H - 30 - i * 36));
    setOutcome(null);
    setPhase('play');
  };

  // Auto-start on mount — the arcade gate now shows the directions + countdown.
  useEffect(() => { start(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function mk(y: number): Bubble {
    return { id: BID++, x: 26 + Math.random() * (W - 52), y, n: 1 + Math.floor(Math.random() * 9), vy: rise.current, sel: false, stuck: false };
  }

  const selSum = () => bubbles.current.filter((b) => b.sel).reduce((s, b) => s + b.n, 0);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(score.current);
    const xp = Math.max(2, Math.min(20, Math.floor(score.current / 25) + pops.current));
    sfx.lose(); haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('mathpop', xp));
  };

  // game loop
  useEffect(() => {
    if (phase !== 'play' || outcome) return;
    lastRef.current = performance.now();
    const loop = (now: number) => {
      if (pausedRef.current) { lastRef.current = now; rafRef.current = requestAnimationFrame(loop); return; }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      rise.current = Math.min(70, rise.current + dt * 1.5);

      // rise + stick
      for (const b of bubbles.current) {
        if (b.stuck) continue;
        b.y -= b.vy * dt;
        if (b.y <= TOP + R) { b.y = TOP + R; b.stuck = true; }
      }
      // spawn
      spawnCd.current -= dt;
      if (spawnCd.current <= 0) {
        spawnCd.current = Math.max(0.5, 1.4 - pops.current * 0.03);
        bubbles.current.push(mk(H + R));
      }
      // overflow → lose
      const stuck = bubbles.current.filter((b) => b.stuck).length;
      if (stuck >= MAX_STUCK) { setTick((t) => t + 1); finish(); return; }

      setTick((t) => t + 1);
      if (!doneRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, outcome]);

  const tapBubble = (id: number) => {
    if (doneRef.current || pausedRef.current) return;
    const b = bubbles.current.find((x) => x.id === id);
    if (!b) return;
    b.sel = !b.sel;
    const sum = selSum();
    if (sum === target.current) {
      // pop!
      const popped = bubbles.current.filter((x) => x.sel);
      bubbles.current = bubbles.current.filter((x) => !x.sel);
      score.current += 10 * popped.length + 20;
      pops.current += 1;
      recordArcadeAnswer(arcadeUnit, true);
      flash.current = 'good';
      window.setTimeout(() => { if (flash.current === 'good') flash.current = null; }, 350);
      sfx.coin(); haptic(HAPTIC.win);
      newTarget();
    } else if (sum > target.current) {
      // overshoot: clear selection, gentle penalty
      bubbles.current.forEach((x) => (x.sel = false));
      recordArcadeAnswer(arcadeUnit, false);
      flash.current = 'bad';
      window.setTimeout(() => { if (flash.current === 'bad') flash.current = null; }, 350);
      sfx.hurt(); haptic(HAPTIC.hit);
    } else {
      sfx.step();
    }
    setTick((t) => t + 1);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Math Pop" emoji="🫧" />
        <ArcadeEndCard gameId="mathpop" outcome={outcome} win={pops.current >= 12} scoreLine={`${score.current} pts · ${pops.current} pops`} onReplay={start} />
      </div>
    );
  }

  const sum = selSum();
  const stuck = bubbles.current.filter((b) => b.stuck).length;

  return (
    <div>
      <ArcadeHeader title="Math Pop" emoji="🫧" />
      <div className="max-w-md mx-auto mb-2 flex items-center justify-between gap-2 text-sm font-display font-extrabold">
        <span className="rounded-full bg-cyan-100 text-cyan-800 px-3 py-1">🎯 Target {target.current}</span>
        <span className={`rounded-full px-3 py-1 tabular-nums ${sum > target.current ? 'bg-rose-100 text-rose-700' : sum === target.current ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>Σ {sum}</span>
        <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 tabular-nums">⭐ {score.current}</span>
      </div>
      {/* danger meter */}
      <div className="max-w-md mx-auto mb-2 h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all" style={{ width: `${(stuck / MAX_STUCK) * 100}%` }} />
      </div>

      <GameStage theme="ocean" className="max-w-md mx-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" style={{ aspectRatio: `${W} / ${H}` }}>
          {/* danger line */}
          <line x1={0} y1={TOP + R * 2} x2={W} y2={TOP + R * 2} stroke="rgba(244,63,94,0.5)" strokeWidth={1.5} strokeDasharray="4 4" />
          {flash.current && <rect x={0} y={0} width={W} height={H} fill={flash.current === 'good' ? 'rgba(16,185,129,0.18)' : 'rgba(244,63,94,0.18)'} />}
          {bubbles.current.map((b) => (
            <g key={b.id} onClick={() => tapBubble(b.id)} style={{ cursor: 'pointer' }}>
              <circle cx={b.x} cy={b.y} r={R} fill={b.sel ? '#34d399' : b.stuck ? '#fca5a5' : '#7dd3fc'} stroke={b.sel ? '#059669' : '#0284c7'} strokeWidth={b.sel ? 3 : 2} opacity={0.95} />
              <circle cx={b.x - 6} cy={b.y - 7} r={4} fill="rgba(255,255,255,0.6)" />
              <text x={b.x} y={b.y} fontSize={17} fontWeight={800} fill="#0c4a6e" textAnchor="middle" dominantBaseline="central">{b.n}</text>
            </g>
          ))}
        </svg>
      </GameStage>

      <p className="text-center text-xs text-slate-500 mt-2">Tap bubbles that add up to <b>{target.current}</b>. Don’t let the screen fill up!</p>

      <GameInstructions emoji="🫧" title="Math Pop" sections={HOWTO} controls={CONTROLS} />
    </div>
  );
}
