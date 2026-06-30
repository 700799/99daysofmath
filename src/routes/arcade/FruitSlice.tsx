import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer, useScorePops, ScorePopLayer, useShake } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Fruit Slice — a Fruit-Ninja-style slicer. Fruit arcs up from the bottom;
// swipe across it to slice for points and combos. Slice a 💣 bomb or let three
// fruits fall and it's game over. (Math is handled by the lesson gate + the
// mid-game challenges, like the other arcade games.)

const W = 340;
const H = 440;
const GRAVITY = 620; // px/s²
// Apples 🍎 and bananas 🍌 are doubled so a run almost always slices some of each
// — that powers the end-of-run "apples : bananas" ratio question.
const FRUITS = ['🍎', '🍎', '🍌', '🍌', '🍉', '🍊', '🍓', '🍇', '🥝', '🍑', '🍍', '🥭'];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// Choose your slicing weapon — each has its own blade trail, reach, and splat.
type Weapon = { id: string; name: string; emoji: string; color: string; radius: number; fx: string; width: number };
const WEAPONS: Weapon[] = [
  { id: 'katana', name: 'Katana', emoji: '🗡️', color: '#ffffff', radius: 28, fx: '✨', width: 6 },
  { id: 'laser', name: 'Laser', emoji: '🔦', color: '#67e8f9', radius: 32, fx: '⚡', width: 7 },
  { id: 'magic', name: 'Magic Wand', emoji: '✨', color: '#f0abfc', radius: 36, fx: '💫', width: 8 },
  { id: 'hammer', name: 'War Hammer', emoji: '🔨', color: '#fdba74', radius: 44, fx: '💥', width: 10 },
];

type Item = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  bomb: boolean;
  sliced: boolean;
};

export function FruitSlice() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();
  const { pops, pop } = useScorePops();
  const { style: shakeStyle, shake } = useShake();

  const itemsRef = useRef<Item[]>([]);
  const idRef = useRef(1);
  const spawnRef = useRef(0.6);
  const elapsedRef = useRef(0);
  const scoreRef = useRef(0);
  const hitsRef = useRef(0); // fruit actually sliced (count, not points)
  const missedRef = useRef(0);
  const countsRef = useRef<Record<string, number>>({}); // sliced count per fruit emoji
  const livesRef = useRef(3);
  const comboRef = useRef({ n: 0, t: 0 });
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const slicingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const weaponRef = useRef<Weapon>(WEAPONS[0]);
  const [flash, setFlash] = useState(false);
  const doneRef = useRef(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  // commit the run: bank points + XP and show the end card
  const commit = () => {
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 8) + 1));
    setOutcome(recordArcadePlay('fruit', xp));
  };

  // end the run — first show the data-driven "Stats Lab" math beat when there is
  // enough data, otherwise go straight to the end card.
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    const total = hitsRef.current + missedRef.current;
    if (total >= 4) setStatsOpen(true);
    else commit();
  };

  useEffect(() => {
    if (outcome || !weapon) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (doneRef.current) return; // run ended (stats screen / end card) — stop the loop
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;
      if (comboRef.current.t > 0) comboRef.current.t -= dt;

      // spawn — faster and bombier over time
      spawnRef.current -= dt;
      if (spawnRef.current <= 0) {
        const lvl = Math.floor(elapsedRef.current / 20);
        spawnRef.current = Math.max(0.45, 1.1 - lvl * 0.08);
        const burstN = 1 + (Math.random() < Math.min(0.5, 0.15 + lvl * 0.05) ? 1 : 0);
        for (let k = 0; k < burstN; k++) {
          const bomb = Math.random() < Math.min(0.22, 0.06 + lvl * 0.02);
          itemsRef.current.push({
            id: idRef.current++,
            x: 40 + Math.random() * (W - 80),
            y: H + 30,
            vx: (Math.random() - 0.5) * 220,
            vy: -(560 + Math.random() * 130 + lvl * 12),
            emoji: bomb ? '💣' : FRUITS[Math.floor(Math.random() * FRUITS.length)],
            bomb,
            sliced: false,
          });
        }
      }

      // physics
      for (const it of itemsRef.current) {
        it.vy += GRAVITY * dt;
        it.x += it.vx * dt;
        it.y += it.vy * dt;
      }
      // remove off-screen; a missed (un-sliced) fruit costs a life
      const kept: Item[] = [];
      for (const it of itemsRef.current) {
        if (it.y > H + 60 && it.vy > 0) {
          if (!it.sliced && !it.bomb) {
            missedRef.current += 1;
            livesRef.current -= 1;
            shake();
            if (livesRef.current <= 0) {
              itemsRef.current = [];
              finish();
              return;
            }
          }
          continue;
        }
        kept.push(it);
      }
      itemsRef.current = kept;

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, weapon]);

  // distance from point P to segment AB
  const segDist = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t * dx;
    const cy = ay + t * dy;
    return Math.hypot(px - cx, py - cy);
  };

  const sliceAt = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    if (outcome || pausedRef.current) return;
    const wp = weaponRef.current;
    for (const it of itemsRef.current) {
      if (it.sliced) continue;
      if (segDist(it.x, it.y, from.x, from.y, to.x, to.y) <= wp.radius) {
        if (it.bomb) {
          it.sliced = true;
          livesRef.current -= 1;
          shake();
          burst(it.x, it.y, { emoji: '💥', count: 26 });
          burst(it.x, it.y, { color: '#ef4444', count: 18 });
          setFlash(true);
          window.setTimeout(() => setFlash(false), 140);
          comboRef.current = { n: 0, t: 0 };
          if (livesRef.current <= 0) {
            finish();
            return;
          }
        } else {
          it.sliced = true;
          hitsRef.current += 1;
          countsRef.current[it.emoji] = (countsRef.current[it.emoji] || 0) + 1;
          // combo within 0.6s of the last slice
          const combo = comboRef.current.t > 0 ? comboRef.current.n + 1 : 1;
          comboRef.current = { n: combo, t: 0.6 };
          const gained = 1 + Math.floor((combo - 1) / 2);
          scoreRef.current += gained;
          // strong, juicy splat: weapon fx + a spray of the fruit + a flash
          burst(it.x, it.y, { emoji: it.emoji, count: 14 });
          burst(it.x, it.y, { emoji: wp.fx, count: 10 });
          if (combo >= 3) { setFlash(true); window.setTimeout(() => setFlash(false), 100); }
          pop(it.x - 10, it.y - 10, combo > 1 ? `🔥${combo}!` : `+${gained}`, '#16a34a');
        }
      }
    }
  };

  const toLocal = (e: React.PointerEvent) => {
    const r = boardRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const onDown = (e: React.PointerEvent) => {
    slicingRef.current = true;
    const p = toLocal(e);
    lastPtRef.current = p;
    setTrail([p]);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!slicingRef.current) return;
    const p = toLocal(e);
    const last = lastPtRef.current;
    if (last) sliceAt(last, p);
    lastPtRef.current = p;
    setTrail((t) => [...t.slice(-6), p]);
  };
  const onUp = () => {
    slicingRef.current = false;
    lastPtRef.current = null;
    setTrail([]);
  };

  const reset = () => {
    itemsRef.current = [];
    spawnRef.current = 0.6;
    elapsedRef.current = 0;
    scoreRef.current = 0;
    hitsRef.current = 0;
    missedRef.current = 0;
    countsRef.current = {};
    livesRef.current = 3;
    comboRef.current = { n: 0, t: 0 };
    doneRef.current = false;
    setStatsOpen(false);
    setTrail([]);
    setOutcome(null);
  };

  // data-driven math beat: questions built from THIS run's real stats
  if (statsOpen && !outcome) {
    return (
      <div>
        <ArcadeHeader title="Fruit Slice" emoji="🍉" />
        <FruitStatsLab
          hits={hitsRef.current}
          misses={missedRef.current}
          apples={countsRef.current['🍎'] || 0}
          bananas={countsRef.current['🍌'] || 0}
          onDone={commit}
        />
      </div>
    );
  }

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Fruit Slice" emoji="🍉" />
        <ArcadeEndCard
          gameId="fruit"
          outcome={outcome}
          win={scoreRef.current >= 20}
          scoreLine={`${scoreRef.current} sliced!`}
          onReplay={() => { reset(); setWeapon(null); }}
        />
      </div>
    );
  }

  // weapon picker (also the start screen)
  if (!weapon) {
    return (
      <div>
        <ArcadeHeader title="Fruit Slice" emoji="🍉" />
        <p className="text-center text-sm text-slate-600 mb-3">Pick your blade, then swipe to slice the fruit — dodge 💣!</p>
        <div className="max-w-sm mx-auto grid grid-cols-2 gap-3">
          {WEAPONS.map((wp) => (
            <button
              key={wp.id}
              type="button"
              onClick={() => { weaponRef.current = wp; setWeapon(wp); }}
              className="rounded-2xl border-2 border-slate-200 bg-white p-4 text-center hover:border-indigo-400 active:translate-y-0.5"
            >
              <div className="text-4xl">{wp.emoji}</div>
              <div className="font-display font-extrabold text-slate-800 mt-1">{wp.name}</div>
              <div className="text-[11px] text-slate-500">reach {wp.radius > 40 ? 'huge' : wp.radius > 32 ? 'big' : 'sharp'} · {wp.fx}</div>
              <div className="mt-1 mx-auto h-1.5 w-16 rounded-full" style={{ background: wp.color }} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Fruit Slice" emoji="🍉" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, 3 - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">🍉 {scoreRef.current}</span>
        {comboRef.current.t > 0 && comboRef.current.n > 1 && (
          <span className="text-orange-600">🔥 x{comboRef.current.n}</span>
        )}
      </div>
      {/* live stat strip — sliced / missed / percent made */}
      <div className="flex justify-center gap-3 mb-2 max-w-sm mx-auto px-1 text-xs font-display font-bold text-slate-500 tabular-nums">
        <span className="text-emerald-600">✅ made {hitsRef.current}</span>
        <span className="text-rose-500">❌ missed {missedRef.current}</span>
        <span className="text-indigo-600">
          {(() => { const t = hitsRef.current + missedRef.current; return t ? Math.round((hitsRef.current / t) * 100) : 0; })()}% made
        </span>
      </div>

      <GameStage theme="ocean" className="max-w-sm mx-auto">
        <div
          ref={boardRef}
          className="relative touch-none select-none mx-auto"
          style={{ width: '100%', aspectRatio: `${W} / ${H}`, ...shakeStyle }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          <BurstLayer api={{ burst, particles }} />
          <ScorePopLayer pops={pops} />
          {flash && <div className="absolute inset-0 z-20 bg-white/40 pointer-events-none" aria-hidden />}

          {/* weapon blade trail */}
          {trail.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <polyline
                points={trail.map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={weapon.color}
                strokeWidth={weapon.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${weapon.color})` }}
              />
            </svg>
          )}

          {itemsRef.current.map((it) => (
            <div
              key={it.id}
              className="absolute select-none"
              style={{
                left: `${(it.x / W) * 100}%`,
                top: `${(it.y / H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: 44,
                opacity: it.sliced ? 0.25 : 1,
                filter: it.sliced ? 'grayscale(1)' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
              }}
            >
              {it.emoji}
            </div>
          ))}
        </div>
      </GameStage>

      <p className="text-center text-xs text-slate-500 mt-2">
        Swipe to slice the fruit! Avoid 💣 bombs, and don't let fruit fall.
      </p>
    </div>
  );
}

// --- Stats Lab: data-driven percent / ratio questions from the player's run ---

type StatQ = { prompt: string; options: string[]; answer: string; explain: string };

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

const pctOptions = (ans: number): string[] => {
  const s = new Set<number>([ans]);
  for (const cand of [100 - ans, ans + 10, ans - 10, ans + 20, ans - 5, ans + 5]) {
    if (cand >= 0 && cand <= 100) s.add(cand);
  }
  let i = 1;
  while (s.size < 4) { s.add(Math.min(100, Math.max(0, ans + i * 7))); i++; }
  return shuffle([...s].slice(0, 4)).map((v) => `${v}%`);
};

const ratioOptions = (a: number, b: number): string[] => {
  const g = gcd(a, b);
  const sa = a / g, sb = b / g;
  const s = new Set<string>([`${sa}:${sb}`]);
  if (g > 1) s.add(`${a}:${b}`);
  s.add(`${sb}:${sa}`);
  s.add(`${sa + 1}:${sb}`);
  s.add(`${sa}:${sb + 1}`);
  s.add(`${a}:${a + b}`);
  return shuffle([...s].slice(0, 4));
};

function FruitStatsLab({ hits, misses, apples, bananas, onDone }: { hits: number; misses: number; apples: number; bananas: number; onDone: () => void }) {
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const addCoins = useProgress((s) => s.addCoins);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);

  const [questions] = useState<StatQ[]>(() => {
    const total = hits + misses;
    const pctMade = total ? Math.round((hits / total) * 100) : 0;
    const pctMiss = total ? Math.round((misses / total) * 100) : 0;
    const qs: StatQ[] = [
      { prompt: `You sliced ${hits} and missed ${misses} — ${total} fruit in all. What PERCENT did you make?`, answer: `${pctMade}%`, options: pctOptions(pctMade), explain: `made ÷ total = ${hits} ÷ ${total} = ${pctMade}%` },
      { prompt: `Out of the ${total} fruit, what PERCENT did you MISS?`, answer: `${pctMiss}%`, options: pctOptions(pctMiss), explain: `missed ÷ total = ${misses} ÷ ${total} = ${pctMiss}%` },
    ];
    if (apples > 0 && bananas > 0) {
      const g = gcd(apples, bananas);
      qs.push({
        prompt: `You sliced 🍎 × ${apples} and 🍌 × ${bananas}. Simplify the ratio apples : bananas.`,
        answer: `${apples / g}:${bananas / g}`,
        options: ratioOptions(apples, bananas),
        explain: g > 1 ? `${apples}:${bananas} = ${apples / g}:${bananas / g}  (divide both by ${g})` : `${apples}:${bananas} is already in simplest form`,
      });
    }
    return qs;
  });

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [right, setRight] = useState(false);

  if (questions.length === 0) { onDone(); return null; }
  const q = questions[idx];

  const choose = (opt: string) => {
    if (right) return;
    setPicked(opt);
    const ok = opt === q.answer;
    recordArcadeAnswer(arcadeUnit, ok);
    if (ok) {
      addCoins(8); addArcadePoints(8);
      sfx.coin(); haptic(HAPTIC.win);
      setRight(true);
      window.setTimeout(() => {
        if (idx + 1 < questions.length) { setIdx(idx + 1); setPicked(null); setRight(false); }
        else onDone();
      }, 1200);
    } else {
      sfx.hurt(); haptic(HAPTIC.hit);
      window.setTimeout(() => setPicked(null), 650);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-sm rounded-3xl border-2 border-indigo-200 bg-indigo-50 p-4 text-center">
      <div className="text-[11px] font-display font-extrabold uppercase tracking-widest text-indigo-500">
        📊 Stats Lab · question {idx + 1}/{questions.length}
      </div>
      <div className="mt-2 rounded-2xl bg-white border-2 border-slate-200 px-3 py-3 text-base font-display font-extrabold leading-snug text-slate-800">
        {q.prompt}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {q.options.map((opt) => {
          const isPicked = picked === opt;
          const isAnswer = opt === q.answer;
          const cls = right && isAnswer
            ? 'border-emerald-400 bg-emerald-100 text-emerald-800'
            : isPicked && !right
              ? 'border-rose-300 bg-rose-50 text-rose-600'
              : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-400';
          return (
            <button key={opt} type="button" disabled={right} onClick={() => choose(opt)}
              className={`min-h-12 rounded-xl border-2 font-display font-extrabold text-xl tabular-nums active:translate-y-0.5 ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>
      <div className="mt-3 h-6 text-sm font-display font-bold">
        {right ? <span className="text-emerald-700">✓ {q.explain} · +🪙 8</span>
          : picked ? <span className="text-rose-600">Not quite — try again!</span>
            : <span className="text-slate-400">Tap the right answer</span>}
      </div>
    </motion.div>
  );
}
