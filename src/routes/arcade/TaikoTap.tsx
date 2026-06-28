import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Taiko-style rhythm tap with LOTS of variety. Two drum tones — DON (red) and
// KA (blue) — each with their own crowd of cute characters. Mixed in: BIG notes
// (worth double), GOLD star notes (bonus), HEART notes (heal a life), and BOMB
// notes you must NOT tap. Tap the matching drum as each note reaches the ring.

const W = 340;
const H = 130;
const HIT_X = 56;
const PERFECT = 16;
const GOOD = 34;
const SESSION = 45;

// Big, varied emoji pools so notes rarely repeat.
const DON_EMOJI = ['😺', '🐶', '🐰', '🦊', '🐯', '🐷', '🐹', '🐻', '🐔', '🦁', '🐲', '🍓', '🍅', '🌶️', '🎈', '🦀', '🐞', '🦜', '🐥', '🦩'];
const KA_EMOJI = ['🐧', '🐬', '🐳', '🦈', '🐟', '🐙', '🦋', '🐢', '🦕', '🐊', '💧', '❄️', '🫐', '🌀', '🐺', '🦉', '🐳', '🧊', '🐳', '🐉'];
const BIG_EMOJI = ['🐘', '🦏', '🦛', '🐮', '🐲', '🦬'];

type NoteKind = 'don' | 'ka' | 'big' | 'gold' | 'heart' | 'bomb';
type Note = { id: number; x: number; e: string; kind: NoteKind; size: number; spd: number; hit: boolean };

function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

// Weighted note kind — more bombs/big notes appear as the song heats up.
function rollKind(t: number): NoteKind {
  const heat = Math.min(1, t / 40);
  const r = Math.random();
  let p = 0;
  const table: [NoteKind, number][] = [
    ['don', 0.34 - heat * 0.06],
    ['ka', 0.28 - heat * 0.04],
    ['big', 0.1 + heat * 0.04],
    ['gold', 0.09],
    ['heart', 0.07 - heat * 0.02],
    ['bomb', 0.06 + heat * 0.08],
  ];
  for (const [k, w] of table) {
    p += w;
    if (r <= p) return k;
  }
  return 'don';
}

function makeNote(id: number, t: number): Note {
  const kind = rollKind(t);
  if (kind === 'big') return { id, x: W + 24, e: pick(BIG_EMOJI), kind, size: 54, spd: 0.85, hit: false };
  if (kind === 'gold') return { id, x: W + 24, e: '⭐', kind, size: 40, spd: 1.25, hit: false };
  if (kind === 'heart') return { id, x: W + 24, e: '❤️', kind, size: 38, spd: 1.0, hit: false };
  if (kind === 'bomb') return { id, x: W + 24, e: pick(['💣', '👹', '👾', '💀']), kind, size: 38, spd: 1.15, hit: false };
  const e = kind === 'don' ? pick(DON_EMOJI) : pick(KA_EMOJI);
  return { id, x: W + 24, e, kind, size: 36, spd: 0.9 + Math.random() * 0.45, hit: false };
}

// scoring notes that cost a life if you let them sail past
const SCORING: NoteKind[] = ['don', 'ka', 'big', 'gold'];

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
  const judgeRef = useRef<{ text: string; color: string; until: number } | null>(null);
  const popRef = useRef<{ x: number; e: string; until: number }[]>([]);
  const elapsedRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const speed = () => 150 + config.startLevel * 15 + (SESSION - timeRef.current) * 2;

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

      // spawn — sometimes a quick double to mix up the rhythm
      spawnRef.current -= dt;
      if (spawnRef.current <= 0) {
        notesRef.current.push(makeNote(idRef.current++, elapsedRef.current));
        if (Math.random() < 0.18) notesRef.current.push(makeNote(idRef.current++, elapsedRef.current));
        spawnRef.current = 0.5 + Math.random() * 0.5;
      }

      // move + miss detection
      const sp = speed();
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

  // tone = which drum was struck
  const strike = (tone: 'don' | 'ka') => {
    if (outcome) return;
    let best: Note | null = null;
    let bestD = Infinity;
    for (const n of notesRef.current) {
      if (n.hit) continue;
      const d = Math.abs(n.x - HIT_X);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    if (!best || bestD > GOOD) return; // tapped empty air — no penalty
    const n = best;

    if (n.kind === 'bomb') {
      n.hit = true;
      notesRef.current = notesRef.current.filter((x) => x !== n);
      comboRef.current = 0;
      feverRef.current = false;
      livesRef.current -= 1;
      setJudge('💥 Oops!', 'text-rose-600');
      popRef.current.push({ x: HIT_X, e: '💥', until: elapsedRef.current + 0.5 });
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
      popRef.current.push({ x: HIT_X, e: '💖', until: elapsedRef.current + 0.5 });
      sfx.powerup();
      haptic(HAPTIC.pickup);
      redraw();
      return;
    }

    if (n.kind === 'gold') {
      n.hit = true;
      notesRef.current = notesRef.current.filter((x) => x !== n);
      bumpCombo();
      scoreRef.current += (20 + Math.floor(comboRef.current / 5) * 3) * (feverRef.current ? 2 : 1);
      setJudge('✨ GOLD!', 'text-amber-500');
      popRef.current.push({ x: HIT_X, e: '✨', until: elapsedRef.current + 0.5 });
      sfx.coin();
      haptic(HAPTIC.levelUp);
      redraw();
      return;
    }

    // don / big need the DON drum; ka needs the KA drum
    const wantsDon = n.kind === 'don' || n.kind === 'big';
    const correctTone = wantsDon ? tone === 'don' : tone === 'ka';
    if (!correctTone) {
      n.hit = true;
      notesRef.current = notesRef.current.filter((x) => x !== n);
      comboRef.current = 0;
      feverRef.current = false;
      setJudge('Wrong drum!', 'text-orange-600');
      sfx.hurt();
      haptic(HAPTIC.hit);
      redraw();
      return;
    }
    n.hit = true;
    notesRef.current = notesRef.current.filter((x) => x !== n);
    bumpCombo();
    const perfect = bestD <= PERFECT;
    const base = (n.kind === 'big' ? 16 : perfect ? 10 : 5) + Math.floor(comboRef.current / 5);
    scoreRef.current += base * (feverRef.current ? 2 : 1);
    setJudge(perfect ? 'Perfect!' : 'Good', perfect ? 'text-emerald-600' : 'text-amber-600');
    if (perfect) { sfx.coin(); } else { sfx.shoot(); }
    haptic(perfect ? HAPTIC.pickup : HAPTIC.tap);
    redraw();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'f' || k === 'j' || k === ' ' || k === 'arrowdown') {
        e.preventDefault();
        strike('don');
      } else if (k === 'd' || k === 'k' || k === 'arrowup') {
        e.preventDefault();
        strike('ka');
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
    judgeRef.current = null;
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
  const ringColor = (k: NoteKind) =>
    k === 'don' || k === 'big' ? 'bg-rose-100 border-rose-400'
      : k === 'ka' ? 'bg-sky-100 border-sky-400'
        : k === 'gold' ? 'bg-amber-100 border-amber-400'
          : k === 'heart' ? 'bg-pink-100 border-pink-400'
            : 'bg-slate-200 border-slate-500';

  return (
    <div>
      <ArcadeHeader title="Taiko Tap" emoji="🥁" />
      <div className="flex justify-between items-center mb-2 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-rose-600">{'❤️'.repeat(Math.max(0, livesRef.current))}{'🤍'.repeat(Math.max(0, maxLives - livesRef.current))}</span>
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className={feverRef.current ? 'text-fuchsia-600' : 'text-pink-600'}>🔥 {comboRef.current}{feverRef.current ? ' FEVER' : ''}</span>
        <span className="text-orange-600 tabular-nums">⏱ {Math.max(0, Math.ceil(timeRef.current))}s</span>
      </div>

      <GameStage theme="night" className="mx-auto p-2" style={{ maxWidth: W + 16 }}>
        <div
          className="relative mx-auto rounded-2xl bg-amber-100/90 border-2 border-amber-200 overflow-hidden"
          style={{ width: '100%', aspectRatio: `${W} / ${H}` }}
        >
          <div className="absolute top-0 left-0" style={{ width: W, height: H }}>
            {/* hit zone */}
            <div className="absolute rounded-full border-4 border-rose-400/80" style={{ left: HIT_X - 26, top: H / 2 - 26, width: 52, height: 52 }} />
            {notesRef.current.map((n) => (
              <div
                key={n.id}
                className={`absolute flex items-center justify-center rounded-full border-2 shadow ${ringColor(n.kind)}`}
                style={{ left: n.x - n.size / 2, top: H / 2 - n.size / 2, width: n.size, height: n.size, fontSize: Math.round(n.size * 0.6) }}
              >
                {n.e}
              </div>
            ))}
            {popRef.current.map((p, i) => (
              <div key={`p${i}`} className="absolute" style={{ left: p.x - 14, top: H / 2 - 28, fontSize: 26 }}>
                {p.e}
              </div>
            ))}
            {judge && (
              <div className={`absolute font-display font-extrabold ${judge.color}`} style={{ left: HIT_X - 10, top: 8, fontSize: 16 }}>
                {judge.text}
              </div>
            )}
          </div>
        </div>
      </GameStage>

      {/* legend so kids know the note variety */}
      <div className="max-w-sm mx-auto mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-[11px] font-display font-bold text-slate-500">
        <span className="text-rose-600">🥁 red → DON</span>
        <span className="text-sky-600">👏 blue → KA</span>
        <span className="text-rose-700">🐘 BIG = 2×</span>
        <span className="text-amber-600">⭐ bonus</span>
        <span className="text-pink-600">❤️ heal</span>
        <span className="text-slate-700">💣 don't tap!</span>
      </div>

      <div className="max-w-sm mx-auto mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onPointerDown={() => strike('ka')}
          className="min-h-20 rounded-3xl bg-sky-500 hover:bg-sky-600 text-white font-display font-extrabold text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
        >
          KA 👏
        </button>
        <button
          type="button"
          onPointerDown={() => strike('don')}
          className="min-h-20 rounded-3xl bg-rose-500 hover:bg-rose-600 text-white font-display font-extrabold text-3xl shadow-[0_6px_0_0_rgba(0,0,0,0.18)] active:translate-y-1 transition-all"
        >
          DON 🥁
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mt-2">
        Red note → tap <b>DON</b>. Blue note → tap <b>KA</b>. Grab ⭐ &amp; ❤️, dodge 💣. Keep the combo for FEVER!
      </p>
    </div>
  );
}
