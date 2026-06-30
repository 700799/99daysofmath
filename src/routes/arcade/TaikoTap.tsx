import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Taiko-style rhythm tap — now with THREE lanes, shifting TEMPOS, and a whole
// crowd of different objects. Each lane is its own little world (🥁 Land,
// 🌊 Sea, 🚀 Sky) with its own button — tap the lane's drum as a note reaches
// its ring. The song speeds up through tempo phases (Warm-up → Groovy → Fast →
// Frantic). Objects: normal notes, BIG (2×), ⚡ DOUBLE (tap twice), 🌀 ROLL
// (tap fast!), ⭐ GOLD bonus, ❤️ heal, and 💣 bombs you must NOT tap.

const W = 340;
const LANES = 3;
const LANE_H = 56;
const H = LANE_H * LANES; // 168
const HIT_X = 48;
const PERFECT = 18;
const GOOD = 38;
const SESSION = 48;

// Each lane: a theme, a drum label, colors, key hints, and its own emoji crowd.
const LANE_THEME = [
  {
    name: 'Land', drum: 'DON', emoji: '🥁', keys: 'D / ↑',
    note: 'bg-rose-100 border-rose-400', ring: 'border-rose-400/80',
    btn: 'bg-rose-500 hover:bg-rose-600',
    pool: ['😺', '🐶', '🐰', '🦊', '🐯', '🐷', '🐹', '🐻', '🐔', '🦁', '🐮', '🐨', '🐼', '🦓', '🐲'],
  },
  {
    name: 'Sea', drum: 'KA', emoji: '🌊', keys: 'F / →',
    note: 'bg-sky-100 border-sky-400', ring: 'border-sky-400/80',
    btn: 'bg-sky-500 hover:bg-sky-600',
    pool: ['🐧', '🐬', '🐳', '🦈', '🐟', '🐙', '🦋', '🐢', '🦕', '🐊', '🦭', '🐠', '🦀', '🦞', '🐡'],
  },
  {
    name: 'Sky', drum: 'POW', emoji: '🚀', keys: 'J / ↓',
    note: 'bg-violet-100 border-violet-400', ring: 'border-violet-400/80',
    btn: 'bg-violet-500 hover:bg-violet-600',
    pool: ['🚀', '🛸', '🪐', '🌙', '☄️', '🦅', '🦜', '🪁', '🎈', '🛩️', '🌈', '🦇', '🕊️', '🦋', '🦃'],
  },
] as const;

// The tempo timeline. Each phase scrolls faster and spawns notes more often.
const TEMPOS = [
  { name: 'Warm-up', emoji: '🐢', secs: 8, speedMul: 0.85, spawn: 0.95 },
  { name: 'Groovy', emoji: '🎵', secs: 12, speedMul: 1.05, spawn: 0.72 },
  { name: 'Fast', emoji: '⏩', secs: 14, speedMul: 1.35, spawn: 0.55 },
  { name: 'Frantic', emoji: '🔥', secs: 999, speedMul: 1.75, spawn: 0.42 },
] as const;

type NoteKind = 'normal' | 'big' | 'double' | 'roll' | 'gold' | 'heart' | 'bomb';
type Note = { id: number; lane: number; x: number; e: string; kind: NoteKind; size: number; spd: number; hp: number; maxHp: number; hit: boolean };

// notes that cost a life if you let them sail past un-cleared
const SCORING: NoteKind[] = ['normal', 'big', 'double', 'roll', 'gold'];

function pick<T>(a: readonly T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

function tempoAt(elapsed: number): number {
  let acc = 0;
  for (let i = 0; i < TEMPOS.length; i++) {
    acc += TEMPOS[i].secs;
    if (elapsed < acc) return i;
  }
  return TEMPOS.length - 1;
}

// Weighted note kind — bombs / fast notes appear more as the tempo heats up.
function rollKind(tempoIdx: number): NoteKind {
  const heat = tempoIdx / (TEMPOS.length - 1); // 0..1
  const r = Math.random();
  let p = 0;
  const table: [NoteKind, number][] = [
    ['normal', 0.5 - heat * 0.1],
    ['big', 0.1 + heat * 0.03],
    ['double', 0.07 + heat * 0.04],
    ['roll', 0.06 + heat * 0.04],
    ['gold', 0.09],
    ['heart', 0.07 - heat * 0.03],
    ['bomb', 0.06 + heat * 0.1],
  ];
  for (const [k, w] of table) {
    p += w;
    if (r <= p) return k;
  }
  return 'normal';
}

function makeNote(id: number, lane: number, tempoIdx: number): Note {
  const kind = rollKind(tempoIdx);
  const spd = 0.9 + Math.random() * 0.35;
  const base = { id, lane, x: W + 24, spd, hit: false };
  const theme = LANE_THEME[lane];
  if (kind === 'big') return { ...base, e: pick(theme.pool), kind, size: 52, hp: 1, maxHp: 1 };
  if (kind === 'double') return { ...base, e: '⚡', kind, size: 40, hp: 2, maxHp: 2 };
  if (kind === 'roll') return { ...base, e: '🌀', kind, size: 42, hp: 4, maxHp: 4 };
  if (kind === 'gold') return { ...base, e: '⭐', kind, size: 38, hp: 1, maxHp: 1 };
  if (kind === 'heart') return { ...base, e: '❤️', kind, size: 36, hp: 1, maxHp: 1 };
  if (kind === 'bomb') return { ...base, e: pick(['💣', '👾', '💀']), kind, size: 36, hp: 1, maxHp: 1 };
  return { ...base, e: pick(theme.pool), kind, size: 38, hp: 1, maxHp: 1 };
}

export function TaikoTap() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const maxLives = Math.max(1, config.livesPerSession);
  const notesRef = useRef<Note[]>([]);
  const idRef = useRef(1);
  const spawnRef = useRef(0.8);
  const timeRef = useRef(SESSION);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const bestComboRef = useRef(0);
  const livesRef = useRef(maxLives);
  const feverRef = useRef(false);
  const tempoIdxRef = useRef(0);
  const judgeRef = useRef<{ text: string; color: string; until: number } | null>(null);
  const bannerRef = useRef<{ text: string; until: number } | null>(null);
  const popRef = useRef<{ x: number; y: number; e: string; until: number }[]>([]);
  const elapsedRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const baseSpeed = () => 120 + config.startLevel * 12;
  const laneY = (lane: number) => lane * LANE_H + LANE_H / 2;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 60) + 1));
    sfx.win();
    setOutcome(recordArcadePlay('taiko', xp));
  };

  useEffect(() => {
    if (outcome) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (pausedRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;
      timeRef.current -= dt;

      // tempo phase — announce when it changes
      const ti = tempoAt(elapsedRef.current);
      if (ti !== tempoIdxRef.current) {
        tempoIdxRef.current = ti;
        const t = TEMPOS[ti];
        bannerRef.current = { text: `${t.emoji} ${t.name}!`, until: elapsedRef.current + 1.3 };
        sfx.powerup();
      }
      const tempo = TEMPOS[ti];

      // spawn into a random lane; faster tempos sometimes drop two at once
      spawnRef.current -= dt;
      if (spawnRef.current <= 0) {
        const lane = Math.floor(Math.random() * LANES);
        notesRef.current.push(makeNote(idRef.current++, lane, ti));
        if (Math.random() < 0.12 + ti * 0.06) {
          const other = (lane + 1 + Math.floor(Math.random() * (LANES - 1))) % LANES;
          notesRef.current.push(makeNote(idRef.current++, other, ti));
        }
        spawnRef.current = tempo.spawn * (0.8 + Math.random() * 0.4);
      }

      // move + miss detection
      const sp = baseSpeed() * tempo.speedMul;
      for (const n of notesRef.current) {
        if (n.hit) continue;
        n.x -= sp * n.spd * dt;
        if (n.x < HIT_X - GOOD) {
          n.hit = true; // passed the ring
          if (SCORING.includes(n.kind)) {
            comboRef.current = 0;
            feverRef.current = false;
            judgeRef.current = { text: 'Miss', color: 'text-slate-500', until: elapsedRef.current + 0.5 };
            livesRef.current -= 1;
            if (livesRef.current <= 0) {
              finish();
              return;
            }
          }
          // heart/bomb passing safely = no penalty
        }
      }
      notesRef.current = notesRef.current.filter((n) => n.x > -30 && !(n.hit && n.x < HIT_X - GOOD - 4));
      popRef.current = popRef.current.filter((p) => p.until > elapsedRef.current);

      if (timeRef.current <= 0) {
        finish();
        return;
      }
      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  const setJudge = (text: string, color: string) => {
    judgeRef.current = { text, color, until: elapsedRef.current + 0.5 };
  };
  const bumpCombo = () => {
    comboRef.current += 1;
    bestComboRef.current = Math.max(bestComboRef.current, comboRef.current);
    if (comboRef.current > 0 && comboRef.current % 10 === 0) {
      feverRef.current = true;
      setJudge('🔥 FEVER!', 'text-fuchsia-600');
    }
  };
  const addPop = (lane: number, e: string) => {
    popRef.current.push({ x: HIT_X, y: laneY(lane), e, until: elapsedRef.current + 0.5 });
  };

  // strike a single lane's drum
  const strike = (lane: number) => {
    if (outcome) return;
    let best: Note | null = null;
    let bestD = Infinity;
    for (const n of notesRef.current) {
      if (n.hit || n.lane !== lane) continue;
      const d = Math.abs(n.x - HIT_X);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    if (!best || bestD > GOOD) return; // tapped empty air in this lane — no penalty
    const n = best;
    const fever = feverRef.current ? 2 : 1;

    if (n.kind === 'bomb') {
      n.hit = true;
      notesRef.current = notesRef.current.filter((x) => x !== n);
      comboRef.current = 0;
      feverRef.current = false;
      livesRef.current -= 1;
      setJudge('💥 Oops!', 'text-rose-600');
      addPop(lane, '💥');
      sfx.explode();
      haptic(HAPTIC.explode);
      if (livesRef.current <= 0) finish();
      redraw();
      return;
    }

    if (n.kind === 'heart') {
      n.hit = true;
      notesRef.current = notesRef.current.filter((x) => x !== n);
      livesRef.current = Math.min(maxLives, livesRef.current + 1);
      scoreRef.current += 5;
      setJudge('💖 Heal!', 'text-pink-600');
      addPop(lane, '💖');
      sfx.powerup();
      haptic(HAPTIC.pickup);
      redraw();
      return;
    }

    if (n.kind === 'gold') {
      n.hit = true;
      notesRef.current = notesRef.current.filter((x) => x !== n);
      bumpCombo();
      scoreRef.current += (20 + Math.floor(comboRef.current / 5) * 3) * fever;
      setJudge('✨ GOLD!', 'text-amber-500');
      addPop(lane, '✨');
      sfx.coin();
      haptic(HAPTIC.levelUp);
      redraw();
      return;
    }

    // normal / big / double / roll — multi-tap notes chip away at hp
    n.hp -= 1;
    if (n.hp > 0) {
      // partial hit (DOUBLE / ROLL still has taps left) — small reward, keep it
      scoreRef.current += 2 * fever;
      setJudge(n.kind === 'roll' ? '🌀 Roll!' : 'Keep!', 'text-violet-600');
      addPop(lane, '✦');
      sfx.shoot();
      haptic(HAPTIC.tap);
      redraw();
      return;
    }

    // fully cleared
    n.hit = true;
    notesRef.current = notesRef.current.filter((x) => x !== n);
    bumpCombo();
    const perfect = bestD <= PERFECT;
    const base =
      (n.kind === 'big' ? 16 : n.kind === 'double' ? 14 : n.kind === 'roll' ? 12 : perfect ? 10 : 5) +
      Math.floor(comboRef.current / 5);
    scoreRef.current += base * fever;
    setJudge(perfect ? 'Perfect!' : 'Good', perfect ? 'text-emerald-600' : 'text-amber-600');
    if (perfect || n.kind === 'big') sfx.coin();
    else sfx.shoot();
    haptic(perfect ? HAPTIC.pickup : HAPTIC.tap);
    redraw();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'd' || k === 'arrowup') {
        e.preventDefault();
        strike(0);
      } else if (k === 'f' || k === 'arrowright') {
        e.preventDefault();
        strike(1);
      } else if (k === 'j' || k === 'arrowdown' || k === ' ') {
        e.preventDefault();
        strike(2);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const reset = () => {
    notesRef.current = [];
    popRef.current = [];
    spawnRef.current = 0.8;
    timeRef.current = SESSION;
    scoreRef.current = 0;
    comboRef.current = 0;
    bestComboRef.current = 0;
    livesRef.current = maxLives;
    feverRef.current = false;
    tempoIdxRef.current = 0;
    judgeRef.current = null;
    bannerRef.current = null;
    elapsedRef.current = 0;
    doneRef.current = false;
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Taiko Tap" emoji="🥁" />
        <ArcadeEndCard
          gameId="taiko"
          outcome={outcome}
          win={bestComboRef.current >= 12}
          scoreLine={`${scoreRef.current} points · best combo ${bestComboRef.current}`}
          onReplay={reset}
        />
      </div>
    );
  }

  const judge = judgeRef.current && judgeRef.current.until > elapsedRef.current ? judgeRef.current : null;
  const banner = bannerRef.current && bannerRef.current.until > elapsedRef.current ? bannerRef.current : null;
  const tempo = TEMPOS[tempoIdxRef.current];

  return (
    <div>
      <ArcadeHeader title="Taiko Tap" emoji="🥁" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, maxLives - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className={feverRef.current ? 'text-fuchsia-600' : 'text-pink-600'}>🔥 {comboRef.current}{feverRef.current ? '!' : ''}</span>
        <span className="text-indigo-600 tabular-nums">{tempo.emoji} {tempo.name}</span>
        <span className="text-orange-600 tabular-nums">⏱ {Math.max(0, Math.ceil(timeRef.current))}s</span>
      </div>

      <GameStage theme="night" className="mx-auto p-2" style={{ maxWidth: W + 16 }}>
        <div
          className="relative mx-auto rounded-2xl bg-amber-100/90 border-2 border-amber-200 overflow-hidden"
          style={{ width: '100%', aspectRatio: `${W} / ${H}` }}
        >
          <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
            {/* lane stripes + per-lane hit ring */}
            {LANE_THEME.map((th, i) => (
              <div key={i}>
                <div
                  className={`absolute left-0 ${i % 2 === 0 ? 'bg-amber-200/40' : 'bg-amber-100/20'}`}
                  style={{ top: i * LANE_H, width: W, height: LANE_H }}
                />
                <div
                  className="absolute left-1 font-display font-extrabold text-[10px] text-amber-700/70"
                  style={{ top: i * LANE_H + 3 }}
                >
                  {th.emoji}
                </div>
                <div
                  className={`absolute rounded-full border-4 ${th.ring}`}
                  style={{ left: HIT_X - 22, top: laneY(i) - 22, width: 44, height: 44 }}
                />
              </div>
            ))}
            {/* lane dividers */}
            {[1, 2].map((i) => (
              <div key={`d${i}`} className="absolute left-0 bg-amber-300/50" style={{ top: i * LANE_H, width: W, height: 2 }} />
            ))}

            {notesRef.current.map((n) => (
              <div
                key={n.id}
                className={`absolute flex items-center justify-center rounded-full border-2 shadow ${LANE_THEME[n.lane].note}`}
                style={{ left: n.x - n.size / 2, top: laneY(n.lane) - n.size / 2, width: n.size, height: n.size, fontSize: Math.round(n.size * 0.6) }}
              >
                {n.e}
                {n.maxHp > 1 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-violet-600 text-white text-[9px] font-display font-extrabold leading-none px-1 py-0.5">
                    {n.hp}
                  </span>
                )}
              </div>
            ))}
            {popRef.current.map((p, i) => (
              <div key={`p${i}`} className="absolute" style={{ left: p.x - 13, top: p.y - 13, fontSize: 24 }}>
                {p.e}
              </div>
            ))}
            {judge && (
              <div className={`absolute font-display font-extrabold ${judge.color}`} style={{ left: HIT_X - 10, top: 4, fontSize: 15 }}>
                {judge.text}
              </div>
            )}
            {banner && (
              <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 text-white font-display font-extrabold px-3 py-1 text-sm" style={{ top: H / 2 - 14 }}>
                {banner.text}
              </div>
            )}
          </div>
        </div>
      </GameStage>

      {/* legend so kids know the object variety */}
      <div className="max-w-sm mx-auto mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[11px] font-display font-bold text-slate-500">
        <span className="text-rose-700">🐘 BIG = 2×</span>
        <span className="text-violet-600">⚡ tap 2×</span>
        <span className="text-violet-600">🌀 tap fast!</span>
        <span className="text-amber-600">⭐ bonus</span>
        <span className="text-pink-600">❤️ heal</span>
        <span className="text-slate-700">💣 don't tap!</span>
      </div>

      {/* one big drum per lane, stacked to match the lanes above */}
      <div className="max-w-sm mx-auto mt-3 space-y-2">
        {LANE_THEME.map((th, i) => (
          <button
            key={i}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              strike(i);
            }}
            className={`w-full min-h-14 rounded-2xl ${th.btn} text-white font-display font-extrabold text-xl shadow-[0_5px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all flex items-center justify-center gap-2`}
          >
            <span className="text-2xl">{th.emoji}</span>
            {th.name} · {th.drum}
            <span className="text-white/70 text-xs font-bold">{th.keys}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Tap each lane's drum as its note hits the ring. Chase the tempo, dodge 💣, keep the combo for FEVER!
      </p>
    </div>
  );
}
