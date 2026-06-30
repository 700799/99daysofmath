import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameInstructions, type HowToSection } from './HowToPlay';
import { makeAdaptive, type Challenge } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Desert Rig — an original post-apocalyptic "War Rig" defense math shooter
// (Mad-Max-Fury-Road vibe, all original art/name; the commander is our own
// character). A horde of raiders speeds across the desert toward your rig 🛻.
// The ONLY way to fire the cannon, drop a bomb, or reload is by quickly solving
// math equations — pure mental-math speed under pressure. Original emoji art.

const W = 360;
const H = 240;
const RIG_X = 46;
const LANES = [70, 110, 150, 190];

type Raider = { id: number; x: number; y: number; kind: number; hp: number; spd: number; big: boolean };
const KINDS = [
  { emoji: '🏍️', hp: 1, spd: 1.25, dmg: 8 },
  { emoji: '🚗', hp: 2, spd: 1.0, dmg: 12 },
  { emoji: '🛺', hp: 1, spd: 1.1, dmg: 9 },
  { emoji: '🦂', hp: 1, spd: 1.35, dmg: 7 },
  { emoji: '👹', hp: 2, spd: 0.9, dmg: 14 },
];
const BOSS = { emoji: '🚛', hp: 6, spd: 0.7, dmg: 30 };

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Defend your War Rig 🛻! A horde of raiders races across the desert toward you — hold the line as long as you can.' },
  { heading: 'Solve to shoot', body: 'A math problem is always on screen. Type the answer on the keypad and hit FIRE 🔫 to blast the nearest raider. Solve fast — speed is everything!' },
  { heading: 'Drop a bomb', body: 'Tap 💣 Bomb for a tougher problem. Solve it to detonate an AoE blast that clears a whole cluster of raiders at once.' },
  { heading: 'Don’t let them reach you', body: 'Every raider that reaches the rig damages it. Bosses 🚛 hit hard. The waves get faster — keep your mental math sharp!' },
  { heading: 'Math', body: 'Quick questions from your chosen unit + level. Right answers fire; wrong answers briefly jam the gun.' },
];
const CONTROLS = 'Type the answer, FIRE 🔫 to shoot the nearest raider, or 💣 Bomb to clear a cluster. Survive the waves!';

let RID = 1;

export function DesertRig() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'play'>('play');
  const [, setTick] = useState(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const raiders = useRef<Raider[]>([]);
  const hp = useRef(100);
  const wave = useRef(1);
  const kills = useRef(0);
  const score = useRef(0);
  const jam = useRef(0);
  const flash = useRef(0);
  const spawnCd = useRef(1.2);
  const explos = useRef<{ x: number; y: number; key: number; big: boolean }[]>([]);
  const exKey = useRef(1);
  const [chal, setChal] = useState<Challenge | null>(null);
  const [bombChal, setBombChal] = useState(false);
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);
  const doneRef = useRef(false);
  const lastRef = useRef(0);
  const rafRef = useRef(0);

  const newChallenge = (bomb: boolean) => {
    const lvl = useProgress.getState().arcadeLevels[arcadeUnit] ?? 1;
    setChal(makeAdaptive(arcadeUnit, lvl, bomb ? 'medium' : 'short'));
    setBombChal(bomb);
    setInput('');
    setWrong(false);
  };

  const start = () => {
    raiders.current = [];
    hp.current = 100; wave.current = 1; kills.current = 0; score.current = 0;
    jam.current = 0; flash.current = 0; spawnCd.current = 1.0; explos.current = [];
    doneRef.current = false;
    setOutcome(null);
    newChallenge(false);
    setPhase('play');
  };

  // Auto-start on mount — the arcade gate now shows the directions + countdown.
  useEffect(() => { start(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const boom = (x: number, y: number, big: boolean) => {
    const key = exKey.current++;
    explos.current.push({ x, y, key, big });
    window.setTimeout(() => { explos.current = explos.current.filter((e) => e.key !== key); }, 500);
  };

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(score.current);
    const xp = Math.max(2, Math.min(20, wave.current * 2 + Math.floor(kills.current / 3)));
    sfx.lose(); haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('rig', xp));
  };

  // game loop
  useEffect(() => {
    if (phase !== 'play' || outcome) return;
    lastRef.current = performance.now();
    const loop = (now: number) => {
      if (pausedRef.current) { lastRef.current = now; rafRef.current = requestAnimationFrame(loop); return; }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      if (jam.current > 0) jam.current = Math.max(0, jam.current - dt);
      if (flash.current > 0) flash.current = Math.max(0, flash.current - dt);

      // spawn
      spawnCd.current -= dt;
      if (spawnCd.current <= 0) {
        spawnCd.current = Math.max(0.45, 1.5 - wave.current * 0.1);
        const boss = kills.current > 0 && kills.current % 18 === 0;
        const k = Math.floor(Math.random() * KINDS.length);
        const base = boss ? BOSS : KINDS[k];
        raiders.current.push({ id: RID++, x: W + 16, y: LANES[Math.floor(Math.random() * LANES.length)], kind: boss ? -1 : k, hp: base.hp, spd: (24 + wave.current * 3) * base.spd, big: boss });
      }

      // advance raiders
      for (const r of raiders.current) r.x -= r.spd * dt;
      // reach the rig
      const reached = raiders.current.filter((r) => r.x <= RIG_X + 8);
      if (reached.length) {
        for (const r of reached) {
          const d = r.big ? BOSS.dmg : KINDS[r.kind].dmg;
          hp.current = Math.max(0, hp.current - d);
        }
        flash.current = 0.3; sfx.hurt(); haptic(HAPTIC.heavy);
        raiders.current = raiders.current.filter((r) => r.x > RIG_X + 8);
        if (hp.current <= 0) { setTick((t) => t + 1); finish(); return; }
      }

      setTick((t) => t + 1);
      if (!doneRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, outcome]);

  const killNearest = () => {
    // closest raider to the rig (smallest x)
    let best: Raider | null = null;
    for (const r of raiders.current) if (!best || r.x < best.x) best = r;
    if (!best) return;
    best.hp -= 1;
    boom(best.x, best.y, false);
    if (best.hp <= 0) {
      raiders.current = raiders.current.filter((r) => r !== best);
      kills.current += 1;
      score.current += best.big ? 50 : 10;
      if (kills.current % 6 === 0) wave.current += 1;
    }
    sfx.shoot(); haptic(HAPTIC.tap);
  };

  const bombBlast = () => {
    // clear the closest cluster (front 60% of the field), up to 5
    const sorted = [...raiders.current].sort((a, b) => a.x - b.x).slice(0, 5);
    for (const r of sorted) { boom(r.x, r.y, true); kills.current += 1; score.current += r.big ? 50 : 10; }
    raiders.current = raiders.current.filter((r) => !sorted.includes(r));
    wave.current += 1;
    sfx.explode(); haptic(HAPTIC.explode);
  };

  const submit = () => {
    if (!chal || jam.current > 0) return;
    const n = Number(input.trim());
    if (input.trim() === '' || Number.isNaN(n)) return;
    const correct = n === chal.answer;
    recordArcadeAnswer(arcadeUnit, correct);
    if (correct) {
      if (bombChal) bombBlast(); else killNearest();
      newChallenge(false);
    } else {
      jam.current = 0.7; setWrong(true); setInput(''); sfx.hurt(); haptic(HAPTIC.hit);
    }
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Desert Rig" emoji="🛻" />
        <ArcadeEndCard gameId="rig" outcome={outcome} win={wave.current >= 10} scoreLine={`Held the line to wave ${wave.current} · ${kills.current} raiders`} onReplay={start} />
      </div>
    );
  }


  return (
    <div>
      <ArcadeHeader title="Desert Rig" emoji="🛻" />
      <div className="max-w-md mx-auto mb-1 flex items-center justify-between gap-2 text-[11px] font-display font-extrabold">
        <span className="rounded-full bg-slate-800 text-white px-2.5 py-1">🌊 Wave {wave.current}</span>
        <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1">💀 {kills.current}</span>
        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 tabular-nums">⭐ {score.current}</span>
      </div>
      <div className="max-w-md mx-auto mb-2 flex items-center gap-2">
        <span className="text-xs">❤️</span>
        <div className="flex-1 h-3 rounded-full bg-white/70 overflow-hidden border border-slate-200">
          <div className="h-full rounded-full bg-rose-500 transition-all" style={{ width: `${hp.current}%` }} />
        </div>
      </div>

      {/* battlefield */}
      <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-amber-900" style={{ aspectRatio: `${W} / ${H}`, backgroundImage: 'linear-gradient(to bottom, #fcd34d 0%, #fde68a 38%, #b45309 38%, #92400e 100%)' }}>
        {flash.current > 0 && <div className="absolute inset-0 bg-rose-600/30 z-20 pointer-events-none" />}
        {/* rig */}
        <div className="absolute text-3xl z-10" style={{ left: `${(RIG_X / W) * 100 - 5}%`, top: '38%' }}>🛻</div>
        {/* raiders */}
        {raiders.current.map((r) => (
          <div key={r.id} className="absolute" style={{ left: `${(r.x / W) * 100}%`, top: `${(r.y / H) * 100}%`, fontSize: r.big ? 34 : 24, transform: 'translate(-50%,-50%) scaleX(-1)' }}>
            {r.big ? BOSS.emoji : KINDS[r.kind].emoji}
          </div>
        ))}
        {/* explosions */}
        {explos.current.map((e) => (
          <div key={e.key} className="absolute" style={{ left: `${(e.x / W) * 100}%`, top: `${(e.y / H) * 100}%`, fontSize: e.big ? 44 : 28, transform: 'translate(-50%,-50%)' }}>💥</div>
        ))}
        {jam.current > 0 && <div className="absolute left-1/2 top-2 -translate-x-1/2 z-20 rounded-full bg-rose-600 text-white text-[11px] font-display font-extrabold px-3 py-1">JAMMED!</div>}
      </div>

      {/* math gate (always on) */}
      <div className="max-w-md mx-auto mt-2 rounded-2xl bg-slate-900 text-white p-3">
        <div className="text-center text-[11px] font-display font-extrabold uppercase tracking-widest text-amber-300">{bombChal ? '💣 Bomb — solve to detonate!' : '🔫 Solve to fire!'}</div>
        <div className="mt-1 text-center text-xl font-display font-extrabold break-words">{chal?.prompt}</div>
        <div className={`mt-2 h-10 rounded-xl border-2 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums ${wrong ? 'border-rose-400 bg-rose-950 text-rose-300' : 'border-slate-600 bg-slate-800'}`}>
          {input || <span className="text-slate-500">?</span>}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
            <button key={k} type="button" onClick={() => { setWrong(false); setInput((v) => (k === 'del' ? v.slice(0, -1) : k === '-' ? (v.startsWith('-') ? v.slice(1) : '-' + v) : v.length < 6 ? v + k : v)); }} className="min-h-10 rounded-lg bg-slate-700 hover:bg-slate-600 font-display font-extrabold text-lg active:translate-y-0.5">
              {k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => newChallenge(true)} disabled={bombChal} className="min-h-11 rounded-2xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 font-display font-extrabold">💣 Bomb</button>
          <button type="button" onClick={submit} disabled={!input.trim() || jam.current > 0} className="min-h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 text-white font-display font-extrabold">{bombChal ? 'Detonate 💥' : 'Fire 🔫'}</button>
        </div>
      </div>

      <GameInstructions emoji="🛻" title="Desert Rig" sections={HOWTO} controls={CONTROLS} />
    </div>
  );
}
