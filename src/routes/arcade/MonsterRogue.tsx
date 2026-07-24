import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { GameStage } from './fx';
import { GameInstructions, type HowToSection } from './HowToPlay';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';
import type { Problem } from '../../types/problem';
import { getAllProblems } from '../../data/problems';
import { isEquivalent } from '../../data/normalize';
import { ProblemCard } from '../../components/ProblemCard';
import { AnswerInput } from '../../components/AnswerInput';
import { Explanation } from '../../components/Explanation';

// The Special attack is powered by a real, medium-to-difficult math problem —
// either an exponent challenge or a word problem pulled from the lesson bank
// (difficulty 2–3). No more trivial one-digit add/sub.
const SUP: Record<number, string> = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
function sup(n: number): string {
  return String(n).split('').map((d) => SUP[Number(d)] ?? d).join('');
}

let expId = 1;
// Build a synthetic exponent Problem so it renders through the same
// ProblemCard / AnswerInput / isEquivalent path as the lesson bank.
function makeExponentProblem(wave: number): Problem {
  const hard = wave >= 6;
  const kind = Math.floor(Math.random() * (hard ? 4 : 3));
  let prompt = '';
  let val = 0;
  if (kind === 0) {
    // square
    const b = 4 + Math.floor(Math.random() * (hard ? 12 : 8)); // 4..15 (or 4..11)
    prompt = `Evaluate ${b}${sup(2)}.`;
    val = b * b;
  } else if (kind === 1) {
    // cube
    const b = 2 + Math.floor(Math.random() * (hard ? 6 : 4)); // 2..7 (or 2..5)
    prompt = `Evaluate ${b}${sup(3)}.`;
    val = b * b * b;
  } else if (kind === 2) {
    // power of two/three
    const b = Math.random() < 0.5 ? 2 : 3;
    const e = (hard ? 4 : 3) + Math.floor(Math.random() * 2); // 3–5
    prompt = `Evaluate ${b}${sup(e)}.`;
    val = Math.pow(b, e);
  } else {
    // two-square word problem
    const s = 6 + Math.floor(Math.random() * 9); // 6..14
    prompt = `A square arena has sides of ${s} steps. What is its area (${s}${sup(2)})?`;
    val = s * s;
  }
  return {
    id: `rogue-exp-${expId++}`,
    domain: '6.EE',
    unit: 0,
    orderInUnit: 0,
    standard: 'Exponents',
    difficulty: hard ? 3 : 2,
    prompt,
    answerType: 'numeric',
    primaryAnswer: String(val),
    alternativeAnswers: [],
    acceptanceMode: 'numeric-tolerance',
    numericTolerance: 1e-6,
    hint: 'An exponent means repeated multiplication.',
    explanation: [`${prompt.replace(/^Evaluate |\?.*$/g, '')} = ${val}.`],
    tags: [],
    estimatedSeconds: 25,
  };
}

// Monster Rogue — an original creature-collecting roguelike battler. Pick a
// starter, then climb an endless gauntlet of turn-based battles across biomes.
// Type matchups matter; "Special" attacks are powered by a quick math problem;
// catch wild critters to fill your party. Party wipe ends the run.

type Element = 'ember' | 'aqua' | 'leaf' | 'spark' | 'stone' | 'frost';
const ELEM_EMOJI: Record<Element, string> = { ember: '🔥', aqua: '💧', leaf: '🍃', spark: '⚡', stone: '🪨', frost: '❄️' };
// "a beats b" → ×1.5 (and reverse ×0.66).
const BEATS: [Element, Element][] = [
  ['ember', 'leaf'], ['leaf', 'aqua'], ['aqua', 'ember'],
  ['spark', 'aqua'], ['stone', 'spark'], ['frost', 'leaf'],
];
function typeMult(a: Element, d: Element): number {
  if (BEATS.some(([x, y]) => x === a && y === d)) return 1.5;
  if (BEATS.some(([x, y]) => x === d && y === a)) return 0.66;
  return 1;
}

type Species = { emoji: string; name: string; el: Element; hp: number; atk: number; evo?: string };
const SPECIES: Species[] = [
  { emoji: '🐲', name: 'Draglet', el: 'ember', hp: 24, atk: 7, evo: '🐉' },
  { emoji: '🦊', name: 'Pyrofox', el: 'ember', hp: 20, atk: 8 },
  { emoji: '🐸', name: 'Bublet', el: 'aqua', hp: 26, atk: 6, evo: '🐊' },
  { emoji: '🐙', name: 'Inkling', el: 'aqua', hp: 22, atk: 7 },
  { emoji: '🐢', name: 'Leafshell', el: 'leaf', hp: 30, atk: 5, evo: '🦕' },
  { emoji: '🐝', name: 'Buzzbud', el: 'leaf', hp: 18, atk: 8 },
  { emoji: '🐤', name: 'Zaptweet', el: 'spark', hp: 19, atk: 8, evo: '🦅' },
  { emoji: '🦇', name: 'Voltbat', el: 'spark', hp: 21, atk: 7 },
  { emoji: '🦔', name: 'Rockpine', el: 'stone', hp: 32, atk: 5, evo: '🦏' },
  { emoji: '🦎', name: 'Gravliz', el: 'stone', hp: 28, atk: 6 },
  { emoji: '🐧', name: 'Snowbo', el: 'frost', hp: 25, atk: 6, evo: '🐻‍❄️' },
  { emoji: '🦂', name: 'Frostpin', el: 'frost', hp: 23, atk: 7 },
];

const BIOMES = ['meadow', 'ocean', 'cave', 'night', 'space', 'candy'] as const;

const HOWTO_CONTROLS = 'Tap the action buttons. Special problems use the on-screen keypad — scroll the problem if it is long.';
function howtoSections(maxWave: number): HowToSection[] {
  return [
    { heading: 'Goal', body: 'Pick a starter critter and climb an endless gauntlet of turn-based battles. Survive as many waves as you can!' },
    { heading: 'Elements', body: '🔥Ember 💧Aqua 🍃Leaf ⚡Spark 🪨Stone ❄️Frost. Some beat others (×1.5) and are weak to others (×0.66) — match types to hit hard!' },
    { heading: 'Your turn', body: 'Attack = normal hit. Special = a CRITICAL (×2) hit, but you must solve a real math problem (an exponent or a word problem from the lesson — medium to hard). Get it right to crit, or Fizzle for a weak hit. Catch = add a weakened wild critter to your party (up to 4). Swap = change your active critter.' },
    { heading: 'Leveling', body: 'Win a battle and your active critter levels up (and may evolve!). A boss appears every 5th wave.' },
    { heading: 'Game over', body: 'If your whole party faints, the run ends. Best wave so far: ' + maxWave + '.' },
  ];
}

type Mon = { key: number; emoji: string; name: string; el: Element; level: number; hp: number; max: number; atk: number; evo?: string };

let keyer = 1;
function mk(sp: Species, level: number, hpScale = 1): Mon {
  const max = Math.round((sp.hp + level * 4) * hpScale);
  return { key: keyer++, emoji: sp.emoji, name: sp.name, el: sp.el, level, hp: max, max, atk: sp.atk + level * 2, evo: sp.evo };
}

export function MonsterRogue() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const maxWave = useProgress((s) => s.monsterMaxWave);
  const setMaxWave = useProgress((s) => s.setMonsterMaxWave);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [phase, setPhase] = useState<'howto' | 'starter' | 'battle'>('starter');
  const [starters] = useState(() => shuffle(SPECIES).slice(0, 3));
  const [party, setParty] = useState<Mon[]>([]);
  const [active, setActive] = useState(0);
  const [foe, setFoe] = useState<Mon | null>(null);
  const [wave, setWave] = useState(1);
  const [caught, setCaught] = useState(0);
  const [log, setLog] = useState('A wild critter appears!');
  const [busy, setBusy] = useState(false);
  const [special, setSpecial] = useState<Problem | null>(null);
  const [specialInput, setSpecialInput] = useState('');
  const [specialResult, setSpecialResult] = useState<null | boolean>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  // Medium-to-difficult word problems from the lesson bank, loaded once.
  const bankRef = useRef<Problem[]>([]);
  useEffect(() => {
    let alive = true;
    getAllProblems()
      .then((all) => {
        if (!alive) return;
        bankRef.current = all.filter((p) => p.difficulty >= 2);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const biome = BIOMES[Math.min(BIOMES.length - 1, Math.floor((wave - 1) / 5))];
  const isBoss = wave % 5 === 0;

  const spawnFoe = (w: number): Mon => {
    const sp = SPECIES[Math.floor(Math.random() * SPECIES.length)];
    const lvl = 1 + Math.floor(w * 0.8);
    return mk(sp, lvl, w % 5 === 0 ? 2.2 : 1);
  };

  const begin = (sp: Species) => {
    const starter = mk(sp, 2);
    setParty([starter]);
    setActive(0);
    setFoe(spawnFoe(1));
    setWave(1);
    setCaught(0);
    setLog(`Go, ${starter.name}!`);
    setPhase('battle');
  };

  // foe takes its turn against the active critter; returns updated party (faint handling outside)
  const foeStrike = (p: Mon[], act: number, f: Mon, why: string) => {
    const a = p[act];
    const dmg = Math.max(1, Math.round(f.atk * typeMult(f.el, a.el) * (0.85 + Math.random() * 0.3)));
    const np = p.slice();
    np[act] = { ...a, hp: Math.max(0, a.hp - dmg) };
    sfx.hit(); haptic(HAPTIC.hit);
    if (np[act].hp <= 0) {
      const alive = np.findIndex((m) => m.hp > 0);
      if (alive < 0) {
        setParty(np);
        setLog(`${a.name} fainted! ${why}`);
        endRun(np);
        return;
      }
      setActive(alive);
      setLog(`${a.name} fainted! Go, ${np[alive].name}!`);
    } else {
      setLog(`${why} ${f.emoji} hits ${a.name} for ${dmg}.`);
    }
    setParty(np);
    setBusy(false);
  };

  const winBattle = (p: Mon[], act: number) => {
    // active gains a level; small heal to all; next wave
    const np = p.map((m, i) => {
      if (i !== act) return { ...m, hp: Math.min(m.max, m.hp + 4) };
      const level = m.level + 1;
      const max = m.max + 5;
      const emoji = m.evo && level >= 6 ? m.evo : m.emoji;
      return { ...m, level, max, hp: Math.min(max, m.hp + 8), atk: m.atk + 2, emoji, evo: emoji === m.evo ? undefined : m.evo };
    });
    const nw = wave + 1;
    setMaxWave(Math.max(maxWave, nw));
    setParty(np);
    setWave(nw);
    setFoe(spawnFoe(nw));
    setLog(`Victory! Wave ${nw}.`);
    sfx.levelUp(); haptic(HAPTIC.levelUp);
    setBusy(false);
  };

  const hurtFoe = (dmg: number, note: string) => {
    if (!foe || busy) return;
    setBusy(true);
    const nf = { ...foe, hp: Math.max(0, foe.hp - dmg) };
    if (nf.hp <= 0) {
      setFoe(nf);
      setLog(`${note} You defeated ${foe.emoji} ${foe.name}!`);
      sfx.explode();
      window.setTimeout(() => winBattle(party, active), 700);
    } else {
      setFoe(nf);
      setLog(note);
      window.setTimeout(() => foeStrike(party, active, nf, ''), 600);
    }
  };

  const attack = () => {
    if (!foe || busy) return;
    const a = party[active];
    const dmg = Math.max(1, Math.round(a.atk * typeMult(a.el, foe.el) * (0.85 + Math.random() * 0.3)));
    const eff = typeMult(a.el, foe.el);
    sfx.shoot();
    hurtFoe(dmg, `${a.name} attacks${eff > 1 ? ' — super effective!' : eff < 1 ? ' (not very effective)' : ''}`);
  };

  const doSpecial = () => {
    if (!foe || busy) return;
    // Bias toward word problems from the lesson bank; otherwise an exponent
    // challenge. Difficulty scales harder with deeper waves.
    const bank = bankRef.current;
    const wantHard = wave >= 6;
    const pool = bank.filter((p) => (wantHard ? p.difficulty >= 2 : true));
    let prob: Problem | null = null;
    if (pool.length && Math.random() < 0.6) {
      // prefer difficulty 3 on deep waves
      const tough = pool.filter((p) => p.difficulty === 3);
      const src = wantHard && tough.length ? tough : pool;
      prob = src[Math.floor(Math.random() * src.length)];
    }
    if (!prob) prob = makeExponentProblem(wave);
    setSpecial(prob);
    setSpecialInput('');
    setSpecialResult(null);
    setShowHelp(false);
  };
  const resolveSpecial = () => {
    if (!special || !foe) return;
    const ok = isEquivalent(specialInput, special);
    if (!ok) {
      // Let them see it's wrong + the explanation before it resolves.
      setSpecialResult(false);
      setShowHelp(true);
      sfx.hurt();
      haptic(HAPTIC.hit);
      return;
    }
    setSpecial(null);
    setSpecialResult(null);
    const a = party[active];
    const base = a.atk * typeMult(a.el, foe.el);
    addAchievement(10);
    hurtFoe(Math.round(base * 2 + 4), `💥 Critical Special by ${a.name}!`);
  };
  // Give up on the problem — the Special fizzles for weak damage.
  const fizzleSpecial = () => {
    if (!special || !foe) return;
    setSpecial(null);
    setSpecialResult(null);
    const a = party[active];
    const base = a.atk * typeMult(a.el, foe.el);
    hurtFoe(Math.max(1, Math.round(base * 0.5)), `${a.name}'s Special fizzled…`);
  };

  const tryCatch = () => {
    if (!foe || busy) return;
    if (party.length >= 4) { setLog('Your party is full (4)!'); return; }
    setBusy(true);
    const chance = 0.25 + (1 - foe.hp / foe.max) * 0.6; // weaker foe = easier
    if (Math.random() < chance) {
      const caughtMon = { ...foe, key: keyer++, hp: Math.max(1, Math.round(foe.max * 0.4)) };
      const np = [...party, caughtMon];
      setParty(np);
      setCaught((c) => c + 1);
      setLog(`Gotcha! ${foe.name} joined your party! 🎉`);
      sfx.coin(); haptic(HAPTIC.pickup);
      window.setTimeout(() => winBattle(np, active), 700);
    } else {
      setLog(`${foe.name} broke free!`);
      window.setTimeout(() => foeStrike(party, active, foe, 'It dodged!'), 500);
    }
  };

  const swapTo = (i: number) => {
    if (busy || i === active || party[i].hp <= 0) return;
    setSwapOpen(false);
    setActive(i);
    setBusy(true);
    setLog(`Go, ${party[i].name}!`);
    window.setTimeout(() => foe && foeStrike(party, i, foe, 'While swapping,'), 500);
  };

  const endRun = (p: Mon[]) => {
    addArcadePoints(wave * 30 + caught * 20);
    const xp = Math.max(2, Math.min(20, wave + caught));
    sfx.lose(); haptic(HAPTIC.death);
    void p;
    window.setTimeout(() => setOutcome(recordArcadePlay('monster', xp)), 600);
  };

  const reset = () => {
    setParty([]); setActive(0); setFoe(null); setWave(1); setCaught(0);
    setBusy(false); setSpecial(null); setSpecialResult(null); setShowHelp(false);
    setSwapOpen(false); setOutcome(null);
    setPhase('starter');
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Monster Rogue" emoji="🐲" />
        <ArcadeEndCard
          gameId="monster"
          outcome={outcome}
          win={wave >= 10}
          scoreLine={`Reached wave ${wave} · caught ${caught}`}
          onReplay={reset}
        />
      </div>
    );
  }


  if (phase === 'starter') {
    return (
      <div>
        <ArcadeHeader title="Monster Rogue" emoji="🐲" />
        <p className="text-center text-sm text-slate-600 mb-3">Choose your starter critter:</p>
        <div className="max-w-sm mx-auto space-y-2">
          {starters.map((sp) => (
            <button
              key={sp.name}
              type="button"
              onClick={() => begin(sp)}
              className="w-full flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 hover:border-indigo-400 text-left"
            >
              <span className="text-4xl">{sp.emoji}</span>
              <span>
                <span className="font-display font-extrabold text-slate-800">{sp.name} {ELEM_EMOJI[sp.el]}</span>
                <span className="block text-xs text-slate-500">{sp.el} · ❤️{sp.hp} ⚔️{sp.atk}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const a = party[active];

  return (
    <div>
      <ArcadeHeader title="Monster Rogue" emoji="🐲" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-slate-700">Wave {wave}{isBoss ? ' ☠️BOSS' : ''}</span>
        <span className="text-indigo-600 capitalize">{biome}</span>
        <span className="text-amber-600">🎒 {caught} caught</span>
      </div>

      <GameStage theme={biome} className="max-w-sm mx-auto p-3">
        {/* foe */}
        {foe && (
          <div className="relative z-10 rounded-2xl bg-white/85 p-2 text-center">
            <div className="text-xs font-display font-extrabold text-slate-700">
              {foe.name} {ELEM_EMOJI[foe.el]} Lv{foe.level} {isBoss ? '👑' : ''}
            </div>
            <div className="text-5xl my-1">{foe.emoji}</div>
            <Bar hp={foe.hp} max={foe.max} color="#ef4444" />
          </div>
        )}
        {/* active */}
        <div className="relative z-10 mt-3 rounded-2xl bg-white/85 p-2 text-center">
          <div className="text-5xl my-1">{a.emoji}</div>
          <div className="text-xs font-display font-extrabold text-slate-700">
            {a.name} {ELEM_EMOJI[a.el]} Lv{a.level}
          </div>
          <Bar hp={a.hp} max={a.max} color="#22c55e" />
        </div>
      </GameStage>

      <div className="max-w-sm mx-auto mt-2 text-center text-[11px] font-display font-bold text-slate-600 min-h-4">{log}</div>

      {/* party row */}
      <div className="max-w-sm mx-auto mt-2 flex justify-center gap-2">
        {party.map((m, i) => (
          <div key={m.key} className={`rounded-xl border-2 px-2 py-1 text-center ${i === active ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'} ${m.hp <= 0 ? 'opacity-40' : ''}`}>
            <div className="text-xl">{m.emoji}</div>
            <div className="w-8"><Bar hp={m.hp} max={m.max} color="#22c55e" thin /></div>
          </div>
        ))}
      </div>

      {/* actions */}
      <div className="max-w-sm mx-auto mt-3 grid grid-cols-2 gap-2">
        <button type="button" disabled={busy} onClick={attack} className="min-h-12 rounded-2xl bg-rose-500 disabled:bg-slate-300 text-white font-display font-extrabold">⚔️ Attack</button>
        <button type="button" disabled={busy} onClick={doSpecial} className="min-h-12 rounded-2xl bg-violet-500 disabled:bg-slate-300 text-white font-display font-extrabold">✨ Special</button>
        <button type="button" disabled={busy} onClick={tryCatch} className="min-h-12 rounded-2xl bg-amber-500 disabled:bg-slate-300 text-white font-display font-extrabold">🎁 Catch</button>
        <button type="button" disabled={busy || party.length < 2} onClick={() => setSwapOpen((v) => !v)} className="min-h-12 rounded-2xl bg-sky-500 disabled:bg-slate-300 text-white font-display font-extrabold">🔄 Swap</button>
      </div>

      {swapOpen && (
        <div className="max-w-sm mx-auto mt-2 flex flex-wrap justify-center gap-2">
          {party.map((m, i) => (
            <button key={m.key} type="button" disabled={i === active || m.hp <= 0} onClick={() => swapTo(i)}
              className="rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 font-display font-bold text-sm disabled:opacity-40">
              {m.emoji} {m.name}
            </button>
          ))}
        </div>
      )}

      {special && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 p-4">
          <div className="w-full max-w-md my-auto rounded-3xl bg-white p-5 shadow-2xl">
            <div className="text-center text-3xl">✨</div>
            <div className="mt-1 text-center font-display font-extrabold text-slate-900">Special! Solve for a CRITICAL hit (×2):</div>

            <div className="mt-3">
              <ProblemCard problem={special} />
            </div>

            <AnswerInput
              problem={special}
              value={specialInput}
              onChange={(v) => { setSpecialInput(v); if (specialResult === false) setSpecialResult(null); }}
              onSubmit={resolveSpecial}
            />

            {specialResult === false && (
              <div className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-display font-bold text-rose-800">
                Not quite — check the steps and try again, or fizzle for a weak hit.
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowHelp((s) => !s)}
              className="mt-3 text-sm font-display font-bold text-violet-700 hover:text-violet-800"
            >
              {showHelp ? '− Hide explanation' : '💡 Show explanation'}
            </button>
            {showHelp && (
              <div className="mt-2">
                <Explanation steps={special.explanation} alternatives={special.alternativeExplanations} />
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={fizzleSpecial} className="min-h-11 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">Fizzle 💨</button>
              <button type="button" disabled={!specialInput.trim()} onClick={resolveSpecial} className="min-h-11 rounded-2xl bg-violet-500 disabled:bg-slate-300 text-white font-display font-extrabold">Unleash ✨</button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll down during play to re-read the rules. */}
      <GameInstructions emoji="🐲" title="Monster Rogue" sections={howtoSections(maxWave)} controls={HOWTO_CONTROLS} />
    </div>
  );
}

function Bar({ hp, max, color, thin }: { hp: number; max: number; color: string; thin?: boolean }) {
  return (
    <div className={`mx-auto ${thin ? 'h-1' : 'h-2'} rounded-full bg-slate-200 overflow-hidden`} style={{ width: thin ? '100%' : '70%' }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, (hp / max) * 100)}%`, background: color }} />
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
