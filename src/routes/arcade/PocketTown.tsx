import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { makeChallenge, type Challenge } from './MidGameChallenge';
import { MathBreak } from './MathBreak';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

const STORY_EVERY = 180; // force a math story every 3 minutes of play
const STORY_MIN_READ = 10; // must read for at least this many seconds

// Pocket Town — an original Pocket-City-style builder. Lay roads, zone homes,
// shops and factories, and add services to grow population, income and
// happiness. The city climbs tiers (Village → Megalopolis) and dishes out
// missions. Collect taxes with a quick math problem for a bonus.

const N = 11; // grid size (bigger map → more to build)
type Cell =
  | '' | 'road' | 'res' | 'com' | 'ind' | 'park' | 'police' | 'fire' | 'hospital' | 'school'
  | 'farm' | 'power' | 'water' | 'mall' | 'university' | 'stadium';

const TOOLS: { key: Cell | 'bulldoze'; emoji: string; label: string; cost: number }[] = [
  { key: 'road', emoji: '🛣️', label: 'Road', cost: 5 },
  { key: 'res', emoji: '🏠', label: 'Homes', cost: 20 },
  { key: 'com', emoji: '🏢', label: 'Shops', cost: 30 },
  { key: 'ind', emoji: '🏭', label: 'Factory', cost: 40 },
  { key: 'farm', emoji: '🌾', label: 'Farm', cost: 25 },
  { key: 'park', emoji: '🌳', label: 'Park', cost: 15 },
  { key: 'power', emoji: '⚡', label: 'Power', cost: 90 },
  { key: 'water', emoji: '🚰', label: 'Water', cost: 85 },
  { key: 'police', emoji: '🚓', label: 'Police', cost: 60 },
  { key: 'fire', emoji: '🚒', label: 'Fire', cost: 60 },
  { key: 'hospital', emoji: '🏥', label: 'Hospital', cost: 80 },
  { key: 'school', emoji: '🏫', label: 'School', cost: 70 },
  { key: 'mall', emoji: '🏬', label: 'Mall', cost: 100 },
  { key: 'university', emoji: '🎓', label: 'Univ.', cost: 140 },
  { key: 'stadium', emoji: '🏟️', label: 'Stadium', cost: 160 },
  { key: 'bulldoze', emoji: '🧹', label: 'Clear', cost: 2 },
];

const EMOJI: Record<Cell, string> = {
  '': '', road: '🛣️', res: '🏠', com: '🏢', ind: '🏭', park: '🌳', police: '🚓', fire: '🚒', hospital: '🏥', school: '🏫',
  farm: '🌾', power: '⚡', water: '🚰', mall: '🏬', university: '🎓', stadium: '🏟️',
};

const TIERS = ['Hamlet', 'Village', 'Town', 'City', 'Metropolis', 'Megalopolis', 'Capital', 'Wonder'];
const TIER_POP = [0, 60, 180, 450, 1000, 2000, 3500, 6000];

type Mission = { id: string; label: string; reward: number; done: boolean; check: (s: Stats) => boolean };
type Stats = { money: number; pop: number; happy: number; counts: Record<Cell, number> };

export function PocketTown() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const maxTier = useProgress((s) => s.townMaxTier);
  const setMaxTier = useProgress((s) => s.setTownMaxTier);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [grid, setGrid] = useState<Cell[]>(() => Array(N * N).fill(''));
  const [tool, setTool] = useState<Cell | 'bulldoze'>('road');
  const [money, setMoney] = useState(280);
  const [pop, setPop] = useState(0);
  const [happy, setHappy] = useState(70);
  const [tier, setTier] = useState(0);
  const [tax, setTax] = useState<{ c: Challenge; reward: number } | null>(null);
  const [taxInput, setTaxInput] = useState('');
  const [msg, setMsg] = useState('Lay roads, then zone homes & shops next to them!');
  const [zoom, setZoom] = useState(1);
  const [story, setStory] = useState(false);
  const storyRef = useRef(false);
  const playSecRef = useRef(0);
  const moneyRef = useRef(money);
  const gridRef = useRef(grid);
  const popRef = useRef(0);
  const happyRef = useRef(70);
  moneyRef.current = money;
  gridRef.current = grid;
  popRef.current = pop;
  happyRef.current = happy;

  const [missions, setMissions] = useState<Mission[]>(() => [
    { id: 'pop60', label: 'Reach 60 population', reward: 120, done: false, check: (s) => s.pop >= 60 },
    { id: 'parks', label: 'Plant 3 parks', reward: 80, done: false, check: (s) => s.counts.park >= 3 },
    { id: 'school', label: 'Build a school', reward: 100, done: false, check: (s) => s.counts.school >= 1 },
    { id: 'power', label: 'Build a power plant ⚡', reward: 120, done: false, check: (s) => s.counts.power >= 1 },
    { id: 'water', label: 'Build a water plant 🚰', reward: 120, done: false, check: (s) => s.counts.water >= 1 },
    { id: 'happy', label: 'Reach 85% happiness', reward: 150, done: false, check: (s) => s.happy >= 85 },
    { id: 'city', label: 'Grow to a City', reward: 250, done: false, check: (s) => s.pop >= TIER_POP[3] },
    { id: 'mall', label: 'Open a mall 🏬', reward: 160, done: false, check: (s) => s.counts.mall >= 1 },
    { id: 'univ', label: 'Found a university 🎓', reward: 200, done: false, check: (s) => s.counts.university >= 1 },
    { id: 'stadium', label: 'Build a stadium 🏟️', reward: 220, done: false, check: (s) => s.counts.stadium >= 1 },
    { id: 'metro', label: 'Grow to a Metropolis', reward: 400, done: false, check: (s) => s.pop >= TIER_POP[4] },
    { id: 'mega', label: 'Reach 2000 people', reward: 600, done: false, check: (s) => s.pop >= TIER_POP[5] },
  ]);

  const counts = (): Record<Cell, number> => {
    const c: Record<Cell, number> = { '': 0, road: 0, res: 0, com: 0, ind: 0, park: 0, police: 0, fire: 0, hospital: 0, school: 0, farm: 0, power: 0, water: 0, mall: 0, university: 0, stadium: 0 };
    for (const cell of gridRef.current) c[cell]++;
    return c;
  };

  const punch = () => { setZoom(1.08); window.setTimeout(() => setZoom(1), 240); };

  // economy tick
  useEffect(() => {
    if (outcome) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || storyRef.current) return;
      const c = counts();
      const jobs = c.com * 4 + c.ind * 6 + c.mall * 9 + c.university * 2;
      const services = c.police + c.fire + c.hospital + c.school + c.university;
      // utilities + farms raise how many people the town can hold
      const utilityCap = c.power * 14 + c.water * 14 + c.farm * 6;
      const housingCap = c.res * 8 + Math.min(c.res * 8, services * 6) + utilityCap;
      const target = Math.min(housingCap, jobs * 6 + (c.res > 0 ? 8 : 0));
      const p = popRef.current;
      const np = Math.round(p + Math.sign(target - p) * Math.min(12, Math.abs(target - p)));
      // happiness (parks, stadiums, farms, services up — heavy industry down)
      let hh = 66 + c.park * 4 + c.stadium * 10 + c.farm * 1 + services * 3 - c.ind * 2 - Math.max(0, np - housingCap) * 0.5;
      hh = Math.max(0, Math.min(100, hh));
      // income
      const income = Math.round(c.com * 3 + c.ind * 5 + c.mall * 8 + c.farm * 1 + c.university * 3 + np * 0.6 - services * 4 - (c.power + c.water) * 2 - c.road * 0.2);
      setPop(np);
      setHappy(Math.round(hh));
      setMoney((m) => Math.max(0, m + income));
      // tier up
      let tnew = 0;
      for (let i = TIER_POP.length - 1; i >= 0; i--) if (np >= TIER_POP[i]) { tnew = i; break; }
      setTier((prev) => {
        if (tnew > prev) { sfx.levelUp(); haptic(HAPTIC.levelUp); punch(); setMsg(`🎉 Your town grew into a ${TIERS[tnew]}!`); setMaxTier(Math.max(maxTier, tnew)); }
        return Math.max(prev, tnew);
      });
      // missions
      setMissions((ms) => ms.map((m) => {
        if (!m.done && m.check({ money: moneyRef.current, pop: np, happy: hh, counts: c })) {
          setMoney((mm) => mm + m.reward);
          sfx.coin(); haptic(HAPTIC.pickup);
          setMsg(`✅ Mission: ${m.label} (+💰${m.reward})`);
          return { ...m, done: true };
        }
        return m;
      }));
    }, 2500);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  // Force a fresh math story / mathematician every 3 minutes of play.
  useEffect(() => {
    if (outcome) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || storyRef.current || document.hidden) return;
      playSecRef.current += 1;
      if (playSecRef.current >= STORY_EVERY) {
        playSecRef.current = 0;
        storyRef.current = true;
        setStory(true);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [outcome, pausedRef]);

  const build = (i: number) => {
    if (outcome || pausedRef.current || storyRef.current) return;
    const t = TOOLS.find((x) => x.key === tool)!;
    setGrid((g) => {
      const cur = g[i];
      if (tool === 'bulldoze') {
        if (!cur) return g;
        if (moneyRef.current < 2) { setMsg('Need 💰2 to clear.'); return g; }
        setMoney((m) => m - 2);
        const ng = [...g]; ng[i] = ''; return ng;
      }
      if (cur === tool) return g; // already that
      if (moneyRef.current < t.cost) { setMsg(`Need 💰${t.cost} for ${t.label}.`); sfx.hurt(); return g; }
      setMoney((m) => m - t.cost);
      sfx.build(); haptic(HAPTIC.tap);
      const ng = [...g]; ng[i] = tool as Cell; return ng;
    });
  };

  const collectTaxes = () => {
    if (tax) return;
    const c = counts();
    const reward = 30 + c.com * 5 + Math.floor(pop * 0.5);
    setTax({ c: makeChallenge(Math.min(5, 2 + tier)), reward });
    setTaxInput('');
  };
  const submitTax = () => {
    if (!tax) return;
    const n = Number(taxInput.trim());
    if (taxInput.trim() === '' || Number.isNaN(n)) return;
    if (n === tax.c.answer) {
      setMoney((m) => m + tax.reward * 2);
      addAchievement(10);
      sfx.coin(); haptic(HAPTIC.pickup);
      setMsg(`💸 Taxes collected! +💰${tax.reward * 2}`);
    } else {
      setMoney((m) => m + Math.floor(tax.reward / 2));
      sfx.hurt(); haptic(HAPTIC.hit);
      setMsg('Hmm, the math was off — half taxes collected.');
    }
    setTax(null);
  };

  const finish = () => {
    addArcadePoints(pop * 2 + money);
    const xp = Math.max(2, Math.min(20, tier * 4 + Math.floor(pop / 50)));
    sfx.win(); haptic(HAPTIC.win);
    setOutcome(recordArcadePlay('town', xp));
  };

  const reset = () => {
    setGrid(Array(N * N).fill('')); setMoney(220); setPop(0); setHappy(70); setTier(0);
    setMissions((ms) => ms.map((m) => ({ ...m, done: false })));
    setMsg('Lay roads, then zone homes & shops next to them!');
    setStory(false); storyRef.current = false; playSecRef.current = 0;
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Pocket Town" emoji="🏙️" />
        <ArcadeEndCard
          gameId="town"
          outcome={outcome}
          win={tier >= 3}
          scoreLine={`${TIERS[tier]} · 👥 ${pop} · 💰 ${money}`}
          onReplay={reset}
        />
      </div>
    );
  }

  const nextPop = TIER_POP[Math.min(TIER_POP.length - 1, tier + 1)];
  const tierPct = tier >= TIERS.length - 1 ? 100 : Math.min(100, Math.round((pop / nextPop) * 100));

  return (
    <div>
      <ArcadeHeader title="Pocket Town" emoji="🏙️" />
      <div className="flex justify-between items-center mb-1 max-w-md mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-amber-600">💰 {money}</span>
        <span className="text-sky-700">👥 {pop}</span>
        <span className="text-emerald-600">😊 {happy}%</span>
        <span className="text-indigo-600">🏛️ {TIERS[tier]}</span>
      </div>
      <div className="max-w-md mx-auto mb-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-indigo-500" style={{ width: `${tierPct}%` }} />
      </div>

      <GameStage theme="candy" className="max-w-md mx-auto p-2">
        <div
          className="grid mx-auto transition-transform duration-200"
          style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, gap: 2, width: '100%', transform: `scale(${zoom})` }}
        >
          {grid.map((cell, i) => (
            <button
              key={i}
              type="button"
              onClick={() => build(i)}
              className="aspect-square rounded-md flex items-center justify-center bg-white/80 active:scale-95 transition-transform"
              style={{ fontSize: 'min(5vw, 22px)' }}
            >
              {EMOJI[cell]}
            </button>
          ))}
        </div>
      </GameStage>

      <div className="max-w-md mx-auto mt-2 text-center text-[11px] font-display font-bold text-slate-600 min-h-4">{msg}</div>

      {/* build palette */}
      <div className="max-w-md mx-auto mt-2 grid grid-cols-5 gap-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTool(t.key)}
            aria-pressed={tool === t.key}
            className={`rounded-xl border-2 py-1.5 text-center ${tool === t.key ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}
          >
            <div className="text-lg leading-none">{t.emoji}</div>
            <div className="text-[9px] font-display font-extrabold text-slate-600">{t.label}</div>
            <div className="text-[9px] font-display font-bold text-amber-600">{t.key === 'bulldoze' ? '💰2' : `💰${t.cost}`}</div>
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto mt-3 flex gap-2">
        <button type="button" onClick={collectTaxes} className="flex-1 min-h-11 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">
          💸 Collect taxes
        </button>
        <button type="button" onClick={finish} className="min-h-11 px-4 rounded-2xl bg-slate-800 text-white font-display font-extrabold">
          Finish 🏁
        </button>
      </div>

      {/* missions */}
      <div className="max-w-md mx-auto mt-3">
        <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-1">Missions</div>
        <div className="space-y-1">
          {missions.map((m) => (
            <div key={m.id} className={`flex justify-between rounded-lg px-3 py-1.5 text-xs font-display font-bold ${m.done ? 'bg-emerald-50 text-emerald-700' : 'bg-white border border-slate-200 text-slate-600'}`}>
              <span>{m.done ? '✅' : '⬜'} {m.label}</span>
              <span className="text-amber-600">💰{m.reward}</span>
            </div>
          ))}
        </div>
      </div>

      {tax && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">💸</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Tax time! Solve for double:</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold leading-snug break-words">{tax.c.prompt}</div>
            <input
              autoFocus
              inputMode="numeric"
              value={taxInput}
              onChange={(e) => setTaxInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitTax()}
              className="mt-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-center text-xl font-display font-extrabold focus:border-emerald-500 focus:outline-none"
              placeholder="?"
            />
            <button type="button" onClick={submitTax} className="mt-3 w-full min-h-11 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">
              Collect ✓
            </button>
          </div>
        </div>
      )}

      {story && (
        <MathBreak
          minSeconds={STORY_MIN_READ}
          onDone={() => { setStory(false); storyRef.current = false; playSecRef.current = 0; }}
        />
      )}
    </div>
  );
}
