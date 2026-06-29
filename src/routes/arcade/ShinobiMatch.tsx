import { useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { GameStage } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { makeChallenge, type Challenge } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Shinobi Match — an original tactical match puzzler. Match runes to strike,
// shuriken, guard, heal, and charge your chi. Each move is a turn; foes advance
// down three lanes toward your shinobi. Fill the chi meter and solve a problem to
// unleash a screen-clearing ninjutsu. Survive the waves!

const C = 6;
const R = 6;
const LANE_LEN = 4;
// rune kinds: 0 strike, 1 guard, 2 chi, 3 shuriken, 4 heal
const RUNES = ['⚔️', '🛡️', '⚡', '🌀', '💚'];
const FOES = ['👺', '🦂', '🐍', '👹'];

function newGrid(): number[] {
  // fill avoiding immediate 3-in-a-rows for a fair start
  const g: number[] = [];
  for (let i = 0; i < R * C; i++) {
    let v: number;
    let tries = 0;
    do {
      v = Math.floor(Math.random() * RUNES.length);
      tries++;
    } while (
      tries < 20 &&
      ((i % C >= 2 && g[i - 1] === v && g[i - 2] === v) ||
        (i >= 2 * C && g[i - C] === v && g[i - 2 * C] === v))
    );
    g.push(v);
  }
  return g;
}

type Foe = { lane: number; pos: number; hp: number; emoji: string };

const SHINOBI_CONTROLS = 'Tap a rune then a neighbour to swap — or swipe a rune toward its neighbour.';
function shinobiSections(maxLevel: number): HowToSection[] {
  return [
    { heading: 'Goal', body: 'Match runes to fight off foes that creep down 3 lanes toward your shinobi. Survive as many levels as you can!' },
    { heading: 'Match-3', body: 'Swap two neighbouring runes to line up 3 or more of a kind. Each successful swap is one turn — then every foe steps closer.' },
    { heading: 'What runes do', body: '⚔️ Strike the front foe · 🌀 Shuriken hits a whole lane · 🛡️ Guard adds block · 💚 Heal restores HP · ⚡ Chi charges your ultimate.' },
    { heading: 'Ninjutsu', body: 'When the ⚡ chi meter is full, tap Ninjutsu and solve a math problem to clear the whole screen!' },
    { heading: 'Danger', body: 'If a foe reaches your shinobi it hurts you (block absorbs some). Lose all HP and the run ends. Best level: ' + maxLevel + '.' },
  ];
}

export function ShinobiMatch() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const maxLevel = useProgress((s) => s.shinobiMaxLevel);
  const setMaxLevel = useProgress((s) => s.setShinobiMaxLevel);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [phase, setPhase] = useState<'howto' | 'play'>('howto');
  const [grid, setGrid] = useState<number[]>(newGrid);
  const [sel, setSel] = useState<number | null>(null);
  const [foes, setFoes] = useState<Foe[]>([]);
  const [hp, setHp] = useState(20);
  const [block, setBlock] = useState(0);
  const [chi, setChi] = useState(0);
  const [level, setLevel] = useState(1);
  const [cleared, setCleared] = useState(0);
  const [log, setLog] = useState('Match runes to fight!');
  const [ult, setUlt] = useState<Challenge | null>(null);
  const [ultInput, setUltInput] = useState('');
  const downRef = useState<{ i: number; x: number; y: number } | null>(null);
  const [down, setDown] = downRef;

  const start = () => {
    setGrid(newGrid()); setFoes(spawnWave(1)); setHp(20); setBlock(0); setChi(0);
    setLevel(1); setCleared(0); setSel(null); setLog('Match runes to fight!'); setOutcome(null);
    setPhase('play');
  };

  function spawnWave(lv: number): Foe[] {
    const n = Math.min(6, 2 + lv);
    const out: Foe[] = [];
    for (let i = 0; i < n; i++) {
      const boss = lv % 4 === 0 && i === 0;
      out.push({ lane: Math.floor(Math.random() * 3), pos: -Math.floor(Math.random() * 3), hp: boss ? 6 + lv : 1 + Math.floor(lv / 3), emoji: boss ? '👹' : FOES[Math.floor(Math.random() * 3)] });
    }
    return out;
  }

  // resolve all cascades from a grid; returns new grid + counts per rune
  function resolveBoard(start: number[]): { grid: number[]; counts: number[] } {
    const g = [...start];
    const counts = [0, 0, 0, 0, 0];
    for (let guard = 0; guard < 20; guard++) {
      const matched = new Array(R * C).fill(false);
      // rows
      for (let r = 0; r < R; r++)
        for (let c = 0; c < C - 2; c++) {
          const v = g[r * C + c];
          if (v >= 0 && v === g[r * C + c + 1] && v === g[r * C + c + 2]) {
            matched[r * C + c] = matched[r * C + c + 1] = matched[r * C + c + 2] = true;
          }
        }
      // cols
      for (let c = 0; c < C; c++)
        for (let r = 0; r < R - 2; r++) {
          const v = g[r * C + c];
          if (v >= 0 && v === g[(r + 1) * C + c] && v === g[(r + 2) * C + c]) {
            matched[r * C + c] = matched[(r + 1) * C + c] = matched[(r + 2) * C + c] = true;
          }
        }
      let any = false;
      for (let i = 0; i < g.length; i++) if (matched[i]) { counts[g[i]]++; g[i] = -1; any = true; }
      if (!any) break;
      // gravity per column
      for (let c = 0; c < C; c++) {
        const col: number[] = [];
        for (let r = R - 1; r >= 0; r--) if (g[r * C + c] >= 0) col.push(g[r * C + c]);
        for (let r = R - 1; r >= 0; r--) g[r * C + c] = col[R - 1 - r] ?? Math.floor(Math.random() * RUNES.length);
      }
    }
    return { grid: g, counts };
  }

  const advanceFoes = (lv: number, curFoes: Foe[], curHp: number, curBlock: number) => {
    let nb = curBlock;
    let nh = curHp;
    const moved = curFoes.map((f) => ({ ...f, pos: f.pos + 1 }));
    const survivors: Foe[] = [];
    for (const f of moved) {
      if (f.pos >= LANE_LEN) {
        const dmg = Math.max(0, (1 + Math.floor(lv / 3)) - nb);
        nb = Math.max(0, nb - (1 + Math.floor(lv / 3)));
        nh -= dmg;
        sfx.hit(); haptic(HAPTIC.hit);
      } else survivors.push(f);
    }
    // occasional reinforcement
    if (Math.random() < 0.3 + lv * 0.03 && survivors.length < 8) {
      survivors.push({ lane: Math.floor(Math.random() * 3), pos: -1, hp: 1 + Math.floor(lv / 3), emoji: FOES[Math.floor(Math.random() * 3)] });
    }
    setBlock(nb);
    setHp(nh);
    if (nh <= 0) { endRun(); return survivors; }
    return survivors;
  };

  const applyEffects = (counts: number[], curFoes: Foe[]) => {
    let fs = curFoes.map((f) => ({ ...f }));
    const visible = fs.filter((f) => f.pos >= 0);
    const front = visible.slice().sort((a, b) => b.pos - a.pos)[0];
    // strike → front foe
    if (counts[0] > 0 && front) front.hp -= counts[0] * 2;
    // shuriken → whole lane of the front foe
    if (counts[3] > 0 && front) for (const f of fs) if (f.lane === front.lane) f.hp -= counts[3] * 2;
    if (counts[1] > 0) setBlock((b) => Math.min(12, b + counts[1]));
    if (counts[4] > 0) setHp((h) => Math.min(20, h + counts[4]));
    if (counts[2] > 0) setChi((c) => Math.min(100, c + counts[2] * 8));
    const killed = fs.filter((f) => f.hp <= 0).length;
    fs = fs.filter((f) => f.hp > 0);
    if (killed > 0) { sfx.explode(); setCleared((k) => k + killed); }
    return fs;
  };

  const turn = (i: number, j: number) => {
    if (outcome || ult) return;
    const g = [...grid];
    [g[i], g[j]] = [g[j], g[i]];
    const { grid: ng, counts } = resolveBoard(g);
    const total = counts.reduce((a, b) => a + b, 0);
    if (total === 0) { setSel(null); return; } // no match → ignore swap
    sfx.coin(); haptic(HAPTIC.pickup);
    setGrid(ng);
    setSel(null);
    let fs = applyEffects(counts, foes);
    fs = advanceFoes(level, fs, hp, block);
    setFoes(fs);
    // level clear: survived a wave's worth of kills
    setCleared((k) => {
      if (k >= level * 4) {
        const nl = level + 1;
        setLevel(nl);
        setMaxLevel(Math.max(maxLevel, nl));
        setFoes((cur) => [...cur, ...spawnWave(nl)]);
        setLog(`Level ${nl}! Keep going, shinobi!`);
        sfx.levelUp(); haptic(HAPTIC.levelUp);
        return 0;
      }
      return k;
    });
  };

  const adjacent = (a: number, b: number) =>
    (Math.floor(a / C) === Math.floor(b / C) && Math.abs(a - b) === 1) || Math.abs(a - b) === C;

  const tapTile = (i: number) => {
    if (sel === null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    if (adjacent(sel, i)) turn(sel, i);
    else setSel(i);
  };

  const onTileDown = (i: number, e: React.PointerEvent) => setDown({ i, x: e.clientX, y: e.clientY });
  const onTileUp = (e: React.PointerEvent) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    const i = down.i;
    setDown(null);
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) { tapTile(i); return; }
    const r = Math.floor(i / C), c = i % C;
    let j = -1;
    if (Math.abs(dx) > Math.abs(dy)) j = dx > 0 ? (c < C - 1 ? i + 1 : -1) : c > 0 ? i - 1 : -1;
    else j = dy > 0 ? (r < R - 1 ? i + C : -1) : r > 0 ? i - C : -1;
    if (j >= 0) turn(i, j);
  };

  const unleash = () => {
    if (chi < 100 || ult) return;
    setUlt(makeChallenge(Math.min(5, 1 + Math.floor(level / 2))));
    setUltInput('');
  };
  const resolveUlt = () => {
    if (!ult) return;
    const ok = Number(ultInput.trim()) === ult.answer && ultInput.trim() !== '';
    setUlt(null);
    setChi(0);
    if (ok) {
      addAchievement(10);
      setFoes([]);
      setLog('🌟 NINJUTSU! The screen is cleared!');
      sfx.powerup(); haptic(HAPTIC.win);
    } else {
      setFoes((fs) => fs.filter((_, idx) => idx % 2 === 0));
      setLog('The jutsu half-fizzled…');
      sfx.hurt();
    }
  };

  const endRun = () => {
    addArcadePoints(level * 40 + cleared * 5);
    const xp = Math.max(2, Math.min(20, level * 2));
    sfx.lose(); haptic(HAPTIC.death);
    window.setTimeout(() => setOutcome(recordArcadePlay('shinobi', xp)), 500);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Shinobi Match" emoji="🥷" />
        <ArcadeEndCard gameId="shinobi" outcome={outcome} win={level >= 4} scoreLine={`Level ${level} · ${cleared + (level - 1) * 4} foes felled`} onReplay={start} />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Shinobi Match" emoji="🥷" />
        <HowToPlay
          emoji="🥷"
          title="Shinobi Match"
          gradient="from-slate-700 to-rose-700"
          sections={shinobiSections(maxLevel)}
          controls={SHINOBI_CONTROLS}
          onStart={start}
        />
      </div>
    );
  }

  // lane view: map foes to a 3×LANE_LEN grid (closest at the bottom)
  return (
    <div>
      <ArcadeHeader title="Shinobi Match" emoji="🥷" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-rose-600">❤️ {Math.max(0, hp)}</span>
        <span className="text-sky-600">🛡️ {block}</span>
        <span className="text-slate-700">Lv {level}</span>
        <span className="text-violet-600">⚡ {chi}%</span>
      </div>

      <GameStage theme="night" className="max-w-sm mx-auto p-2">
        {/* lanes */}
        <div className="relative z-10 grid grid-cols-3 gap-1 mb-1">
          {[0, 1, 2].map((lane) => (
            <div key={lane} className="rounded-lg bg-white/10 p-0.5 flex flex-col gap-0.5">
              {Array.from({ length: LANE_LEN }).map((_, row) => {
                // row 0 = far, LANE_LEN-1 = nearest
                const pos = row;
                const f = foes.find((x) => x.lane === lane && x.pos === pos);
                return (
                  <div key={row} className="h-7 rounded flex items-center justify-center text-lg" style={{ background: row === LANE_LEN - 1 ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.06)' }}>
                    {f ? f.emoji : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center text-2xl">🥷</div>
      </GameStage>

      <div className="max-w-sm mx-auto mt-1 text-center text-[11px] font-display font-bold text-slate-600 min-h-4">{log}</div>

      {/* rune board */}
      <div className="max-w-[300px] mx-auto mt-2 grid touch-none" style={{ gridTemplateColumns: `repeat(${C}, 1fr)`, gap: 4 }}>
        {grid.map((v, i) => (
          <button
            key={i}
            type="button"
            onPointerDown={(e) => onTileDown(i, e)}
            onPointerUp={onTileUp}
            className={`aspect-square rounded-lg flex items-center justify-center text-xl ${sel === i ? 'ring-2 ring-amber-400 bg-amber-50' : 'bg-white'} active:scale-95 transition-transform`}
          >
            {RUNES[v] ?? ''}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={unleash}
        disabled={chi < 100}
        className="max-w-[300px] mx-auto mt-3 block w-full min-h-12 rounded-2xl bg-violet-500 disabled:bg-slate-300 text-white font-display font-extrabold"
      >
        🌟 Ninjutsu {chi < 100 ? `(${chi}%)` : 'READY!'}
      </button>
      <p className="text-center text-[11px] text-slate-500 mt-2">Tap a rune then a neighbour, or swipe to swap.</p>

      {ult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">🌟</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Ninjutsu! Solve to unleash:</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold leading-snug break-words">{ult.prompt}</div>
            <input autoFocus inputMode="numeric" value={ultInput} onChange={(e) => setUltInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && resolveUlt()}
              className="mt-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-center text-xl font-display font-extrabold focus:border-violet-500 focus:outline-none" placeholder="?" />
            <button type="button" onClick={resolveUlt} className="mt-3 w-full min-h-11 rounded-2xl bg-violet-500 text-white font-display font-extrabold">Unleash 🌟</button>
          </div>
        </div>
      )}

      <GameInstructions emoji="🥷" title="Shinobi Match" sections={shinobiSections(maxLevel)} controls={SHINOBI_CONTROLS} />
    </div>
  );
}
