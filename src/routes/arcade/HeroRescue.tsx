import { useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { GameStage } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { makeChallenge, type Challenge } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Hero Rescue — an original "pull the pin" logic puzzle. Chambers hold the hero,
// lava, water, treasure, and monsters, joined by pins (gates). Pull pins to let
// things flow — but ORDER matters: lava or a monster reaching the hero is game
// over; water quenches lava; treasure must reach the hero to win. Every pin pull
// is gated by a math problem (solve to act).

type Fill = 'hero' | 'lava' | 'water' | 'treasure' | 'monster' | 'empty';
type Chamber = { id: string; x: number; y: number };
type Pin = { id: string; from: string; to: string };
type Level = { name: string; chambers: Chamber[]; fills: Record<string, Fill>; pins: Pin[] };

const EMOJI: Record<Fill, string> = { hero: '🦸', lava: '🌋', water: '💧', treasure: '💰', monster: '👹', empty: '' };
const BG: Record<Fill, string> = {
  hero: 'bg-amber-100 border-amber-400',
  lava: 'bg-red-100 border-red-400',
  water: 'bg-sky-100 border-sky-400',
  treasure: 'bg-yellow-100 border-yellow-400',
  monster: 'bg-violet-100 border-violet-400',
  empty: 'bg-slate-100 border-slate-300',
};

// Levels ramp: drop treasure → avoid the lava decoy → quench lava first →
// two treasures → drop a monster into a pit → combos.
const LEVELS: Level[] = [
  {
    name: 'First Rescue',
    chambers: [{ id: 't', x: 50, y: 22 }, { id: 'h', x: 50, y: 78 }],
    fills: { t: 'treasure', h: 'hero' },
    pins: [{ id: 'a', from: 't', to: 'h' }],
  },
  {
    name: 'Mind the Lava',
    chambers: [{ id: 't', x: 26, y: 20 }, { id: 'l', x: 74, y: 20 }, { id: 'h', x: 50, y: 80 }],
    fills: { t: 'treasure', l: 'lava', h: 'hero' },
    pins: [{ id: 'a', from: 't', to: 'h' }, { id: 'b', from: 'l', to: 'h' }],
  },
  {
    name: 'Quench First',
    chambers: [{ id: 't', x: 50, y: 12 }, { id: 'x', x: 50, y: 44 }, { id: 'h', x: 50, y: 84 }, { id: 'w', x: 18, y: 44 }],
    fills: { t: 'treasure', x: 'lava', h: 'hero', w: 'water' },
    pins: [{ id: 'c', from: 'w', to: 'x' }, { id: 'a', from: 't', to: 'x' }, { id: 'b', from: 'x', to: 'h' }],
  },
  {
    name: 'Double Loot',
    chambers: [{ id: 't1', x: 24, y: 18 }, { id: 'l', x: 50, y: 18 }, { id: 't2', x: 76, y: 18 }, { id: 'h', x: 50, y: 82 }],
    fills: { t1: 'treasure', l: 'lava', t2: 'treasure', h: 'hero' },
    pins: [{ id: 'a', from: 't1', to: 'h' }, { id: 'b', from: 't2', to: 'h' }, { id: 'c', from: 'l', to: 'h' }],
  },
  {
    name: 'Into the Pit',
    chambers: [{ id: 't', x: 78, y: 14 }, { id: 'g', x: 40, y: 30 }, { id: 'p', x: 40, y: 70 }, { id: 'h', x: 78, y: 80 }],
    fills: { t: 'treasure', g: 'monster', p: 'empty', h: 'hero' },
    pins: [{ id: 'f', from: 'g', to: 'p' }, { id: 'a', from: 't', to: 'h' }, { id: 'b', from: 'g', to: 'h' }],
  },
  {
    name: 'Water & Gold',
    chambers: [
      { id: 't', x: 50, y: 10 }, { id: 'g', x: 50, y: 40 }, { id: 'h', x: 50, y: 88 },
      { id: 'w', x: 14, y: 40 }, { id: 't2', x: 86, y: 40 }, { id: 'm', x: 86, y: 12 },
    ],
    fills: { t: 'treasure', g: 'lava', h: 'hero', w: 'water', t2: 'treasure', m: 'monster' },
    pins: [
      { id: 'c', from: 'w', to: 'g' }, { id: 'a', from: 't', to: 'g' }, { id: 'b', from: 'g', to: 'h' },
      { id: 'd', from: 't2', to: 'h' }, { id: 'e', from: 'm', to: 'h' },
    ],
  },
  {
    name: 'Clear the Guard',
    chambers: [{ id: 't', x: 50, y: 8 }, { id: 'g', x: 50, y: 40 }, { id: 'h', x: 50, y: 90 }, { id: 'l', x: 14, y: 40 }, { id: 'w', x: 86, y: 40 }],
    fills: { t: 'treasure', g: 'monster', h: 'hero', l: 'lava', w: 'water' },
    pins: [
      { id: 'c', from: 'l', to: 'g' }, { id: 'd', from: 'w', to: 'g' },
      { id: 'a', from: 't', to: 'g' }, { id: 'b', from: 'g', to: 'h' },
    ],
  },
  {
    name: 'Grand Rescue',
    chambers: [
      { id: 't1', x: 20, y: 10 }, { id: 'g1', x: 20, y: 42 }, { id: 'w', x: 50, y: 42 },
      { id: 't2', x: 80, y: 10 }, { id: 'g2', x: 80, y: 42 }, { id: 'p', x: 80, y: 70 }, { id: 'h', x: 50, y: 90 },
    ],
    fills: { t1: 'treasure', g1: 'lava', w: 'water', t2: 'treasure', g2: 'monster', p: 'empty', h: 'hero' },
    pins: [
      { id: 'c', from: 'w', to: 'g1' }, { id: 'a', from: 't1', to: 'g1' }, { id: 'b', from: 'g1', to: 'h' },
      { id: 'f', from: 'g2', to: 'p' }, { id: 'd', from: 't2', to: 'g2' }, { id: 'e', from: 'g2', to: 'h' },
    ],
  },
];

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Get all the treasure 💰 to your hero 🦸. Pull the pins to let things drop — but in the right ORDER!' },
  { heading: 'Danger', body: 'If lava 🌋 or a monster 👹 reaches the hero, it’s game over. Plan before you pull!' },
  { heading: 'Tricks', body: 'Water 💧 + lava 🌋 cancel each other out (quench the lava first). Drop a monster 👹 into an empty pit to clear its chamber.' },
  { heading: 'Solve to pull', body: 'Each pin is locked with a math problem — solve it to pull that pin.' },
];
const CONTROLS = 'Tap a pin 🔩 to try to pull it (solve the math first). Use Retry if a plan goes wrong.';

function countTreasure(fills: Record<string, Fill>): number {
  return Object.values(fills).filter((f) => f === 'treasure').length;
}

// Run the flow until stable after a pin opens. Returns the new fills plus what
// happened (treasure collected, hero dead, treasure lost to lava).
function settle(fills: Record<string, Fill>, openPins: Pin[]): { fills: Record<string, Fill>; collected: number; dead: boolean; lost: boolean } {
  let collected = 0, dead = false, lost = false;
  let moved = true, guard = 0;
  while (moved && guard++ < 200) {
    moved = false;
    for (const p of openPins) {
      const s = fills[p.from];
      if (s === 'empty' || s === 'hero') continue;
      const d = fills[p.to];
      if (d === 'empty') { fills[p.to] = s; fills[p.from] = 'empty'; moved = true; continue; }
      if (d === 'hero') {
        if (s === 'lava' || s === 'monster') { dead = true; fills[p.from] = 'empty'; moved = true; }
        else if (s === 'treasure') { collected++; fills[p.from] = 'empty'; moved = true; }
        else if (s === 'water') { fills[p.from] = 'empty'; moved = true; }
        continue;
      }
      if (d === 'lava') {
        if (s === 'water') { fills[p.to] = 'empty'; fills[p.from] = 'empty'; moved = true; }
        else if (s === 'monster') { fills[p.from] = 'empty'; moved = true; }
        else if (s === 'lava') { fills[p.from] = 'empty'; moved = true; }
        else if (s === 'treasure') { fills[p.from] = 'empty'; lost = true; moved = true; }
        continue;
      }
      if (d === 'water') {
        if (s === 'lava') { fills[p.to] = 'empty'; fills[p.from] = 'empty'; moved = true; }
        else if (s === 'water') { fills[p.from] = 'empty'; moved = true; }
        continue;
      }
      if (d === 'monster') {
        if (s === 'lava') { fills[p.to] = 'lava'; fills[p.from] = 'empty'; moved = true; }
        continue;
      }
      // dest treasure or anything else → blocked
    }
  }
  return { fills, collected, dead, lost };
}

export function HeroRescue() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [phase, setPhase] = useState<'howto' | 'play'>('howto');
  const [levelIdx, setLevelIdx] = useState(0);
  const [fills, setFills] = useState<Record<string, Fill>>(() => ({ ...LEVELS[0].fills }));
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [collected, setCollected] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [pinId, setPinId] = useState<string | null>(null);
  const [chal, setChal] = useState<Challenge | null>(null);
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);

  const level = LEVELS[levelIdx];
  const required = countTreasure(level.fills);
  const chamberOf = (id: string) => level.chambers.find((c) => c.id === id)!;

  const loadLevel = (i: number) => {
    setLevelIdx(i);
    setFills({ ...LEVELS[i].fills });
    setOpen(new Set());
    setCollected(0);
    setStatus('playing');
    setPinId(null);
    setChal(null);
    setInput('');
  };

  const retry = () => loadLevel(levelIdx);

  const tapPin = (pin: Pin) => {
    if (status !== 'playing' || open.has(pin.id) || pinId) return;
    setPinId(pin.id);
    setChal(makeChallenge(Math.min(5, 2 + Math.floor(levelIdx / 2))));
    setInput('');
    setWrong(false);
  };

  const resolvePin = () => {
    if (!chal || !pinId) return;
    if (Number(input.trim()) !== chal.answer || input.trim() === '') {
      setWrong(true);
      sfx.hurt();
      haptic(HAPTIC.hit);
      return;
    }
    // correct → open the pin and run the flow
    const nextOpen = new Set(open);
    nextOpen.add(pinId);
    const openPins = level.pins.filter((p) => nextOpen.has(p.id));
    const res = settle({ ...fills }, openPins);
    setOpen(nextOpen);
    setFills(res.fills);
    setChal(null);
    setPinId(null);
    setInput('');
    addAchievement(5);

    const newCollected = collected + res.collected;
    setCollected(newCollected);
    if (res.collected > 0) { sfx.coin(); haptic(HAPTIC.pickup); }

    if (res.dead || res.lost) {
      setStatus('lost');
      sfx.explode();
      haptic(HAPTIC.explode);
      return;
    }
    if (newCollected >= required) {
      setStatus('won');
      sfx.win();
      haptic(HAPTIC.win);
      return;
    }
    // stuck: every pin opened but treasure still not all home
    if (nextOpen.size >= level.pins.length) {
      setStatus('lost');
      sfx.lose();
    }
  };

  const nextLevel = () => {
    if (levelIdx + 1 >= LEVELS.length) {
      addArcadePoints(LEVELS.length * 40);
      sfx.win();
      setOutcome(recordArcadePlay('hero', 18));
      return;
    }
    loadLevel(levelIdx + 1);
  };

  const endNow = () => {
    addArcadePoints(levelIdx * 40 + 20);
    setOutcome(recordArcadePlay('hero', Math.max(2, Math.min(18, levelIdx * 2 + 3))));
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Hero Rescue" emoji="🦸" />
        <ArcadeEndCard
          gameId="hero"
          outcome={outcome}
          win={levelIdx + 1 >= LEVELS.length && status === 'won'}
          scoreLine={`Cleared ${status === 'won' ? levelIdx + 1 : levelIdx} of ${LEVELS.length} rescues`}
          onReplay={() => { loadLevel(0); setOutcome(null); }}
        />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Hero Rescue" emoji="🦸" />
        <HowToPlay emoji="🦸" title="Hero Rescue" gradient="from-amber-500 to-rose-700" sections={HOWTO} controls={CONTROLS} onStart={() => { loadLevel(0); setPhase('play'); }} />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Hero Rescue" emoji="🦸" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-slate-700">Level {levelIdx + 1}/{LEVELS.length}</span>
        <span className="text-amber-600">💰 {collected}/{required}</span>
        <button type="button" onClick={retry} className="rounded-lg bg-slate-200 px-2 py-1 text-slate-700">↺ Retry</button>
      </div>
      <p className="text-center text-[11px] font-display font-bold text-slate-500 mb-1">{level.name}</p>

      <GameStage theme="cave" className="mx-auto p-2" style={{ width: 'min(100%, 52vh)' }}>
        <div className="relative mx-auto" style={{ width: '100%', aspectRatio: '100 / 130' }}>
          {/* pipes */}
          <svg viewBox="0 0 100 130" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {level.pins.map((p) => {
              const a = chamberOf(p.from), b = chamberOf(p.to);
              const isOpen = open.has(p.id);
              return (
                <line key={p.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isOpen ? '#86efac' : '#94a3b8'} strokeWidth={isOpen ? 2.5 : 4}
                  strokeDasharray={isOpen ? '4 3' : undefined} strokeLinecap="round" />
              );
            })}
          </svg>

          {/* chambers */}
          {level.chambers.map((c) => {
            const f = fills[c.id];
            return (
              <div key={c.id} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 flex items-center justify-center ${BG[f]}`}
                style={{ left: `${c.x}%`, top: `${c.y}%`, width: '22%', height: '17%' }}>
                <span style={{ fontSize: 'min(7vh, 30px)' }}>{EMOJI[f]}</span>
              </div>
            );
          })}

          {/* pins (tap targets at the midpoint of each pipe) */}
          {level.pins.map((p) => {
            const a = chamberOf(p.from), b = chamberOf(p.to);
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const isOpen = open.has(p.id);
            if (isOpen) return null;
            return (
              <button key={p.id} type="button" onClick={() => tapPin(p)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 border-slate-400 shadow flex items-center justify-center active:scale-90"
                style={{ left: `${mx}%`, top: `${my}%`, width: 40, height: 40, fontSize: 20 }}
                aria-label="Pull pin">
                🔩
              </button>
            );
          })}
        </div>
      </GameStage>

      <p className="text-center text-[11px] text-slate-500 mt-2">
        💰→🦸 to win · 🌋/👹→🦸 = game over · 💧 quenches 🌋 · drop 👹 into an empty pit.
      </p>

      {/* level cleared */}
      {status === 'won' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-4xl">🎉🦸</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Rescued! Level {levelIdx + 1} cleared.</div>
            <button type="button" onClick={nextLevel} className="mt-4 w-full min-h-12 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">
              {levelIdx + 1 >= LEVELS.length ? 'Finish 🏆' : 'Next level →'}
            </button>
          </div>
        </div>
      )}

      {/* level failed */}
      {status === 'lost' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-4xl">💥</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Rescue failed! Try a different order.</div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={retry} className="min-h-12 rounded-2xl bg-amber-500 text-white font-display font-extrabold">↺ Retry</button>
              <button type="button" onClick={endNow} className="min-h-12 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">End run</button>
            </div>
          </div>
        </div>
      )}

      {/* math gate to pull a pin */}
      {chal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">🔩</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Solve to pull the pin:</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold leading-snug break-words">{chal.prompt}</div>
            <input autoFocus inputMode="numeric" value={input}
              onChange={(e) => { setInput(e.target.value); setWrong(false); }}
              onKeyDown={(e) => e.key === 'Enter' && resolvePin()}
              className={`mt-3 w-full rounded-xl border-2 px-3 py-2 text-center text-xl font-display font-extrabold focus:outline-none ${wrong ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 focus:border-amber-500'}`}
              placeholder="?" />
            {wrong && <div className="mt-1 text-xs font-display font-bold text-rose-500">Try again!</div>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setChal(null); setPinId(null); }} className="min-h-11 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">Cancel</button>
              <button type="button" onClick={resolvePin} disabled={!input.trim()} className="min-h-11 rounded-2xl bg-amber-500 disabled:bg-slate-300 text-white font-display font-extrabold">Pull 🔧</button>
            </div>
          </div>
        </div>
      )}

      <GameInstructions emoji="🦸" title="Hero Rescue" sections={HOWTO} controls={CONTROLS} />
    </div>
  );
}
