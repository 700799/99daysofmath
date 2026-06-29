import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { makeAdaptive, type Challenge } from './MidGameChallenge';
import { MathBreak } from './MathBreak';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Pocket Town — a city builder split into small, phone-friendly NEIGHBORHOODS.
// Hop between districts with N/S/E/W arrows or a floating map menu. Build homes,
// shops, services and utilities, then open the City Inspector REPORT CARD: it
// grades your city with real math — population = homes × people, services by
// RATIO (1 power plant per 4 homes…), happiness/coverage as PERCENTAGES, and a
// budget-efficiency RATE — plus a disaster-resilience verdict. Original art.

const STORY_EVERY = 180; // force a fresh math story every 3 minutes of play
const STORY_MIN_READ = 10;
const ND = 6; // small per-district grid (easy to see on a phone)
const PEOPLE_PER_HOME = 8;

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
const COST: Record<string, number> = Object.fromEntries(TOOLS.map((t) => [t.key, t.cost]));
const EMOJI: Record<Cell, string> = {
  '': '', road: '🛣️', res: '🏠', com: '🏢', ind: '🏭', park: '🌳', police: '🚓', fire: '🚒', hospital: '🏥', school: '🏫',
  farm: '🌾', power: '⚡', water: '🚰', mall: '🏬', university: '🎓', stadium: '🏟️',
};

const TIERS = ['Hamlet', 'Village', 'Town', 'City', 'Metropolis', 'Megalopolis', 'Capital', 'Wonder'];
const TIER_POP = [0, 60, 180, 450, 1000, 2000, 3500, 6000];

type Dir = 'N' | 'S' | 'E' | 'W';
type District = { id: string; name: string; emoji: string };
const DISTRICTS: District[] = [
  { id: 'downtown', name: 'Downtown', emoji: '🏙️' },
  { id: 'uptown', name: 'Uptown', emoji: '🌆' },
  { id: 'harbor', name: 'Harbor', emoji: '⚓' },
  { id: 'meadows', name: 'Meadows', emoji: '🌾' },
  { id: 'westend', name: 'West End', emoji: '🌳' },
];
// Compass adjacency (a plus-shaped map centered on Downtown).
const NEIGHBORS: Record<string, Partial<Record<Dir, string>>> = {
  downtown: { N: 'uptown', S: 'meadows', E: 'harbor', W: 'westend' },
  uptown: { S: 'downtown' },
  meadows: { N: 'downtown' },
  harbor: { W: 'downtown' },
  westend: { E: 'downtown' },
};

type Counts = Record<Cell, number>;
const emptyCounts = (): Counts => ({ '': 0, road: 0, res: 0, com: 0, ind: 0, park: 0, police: 0, fire: 0, hospital: 0, school: 0, farm: 0, power: 0, water: 0, mall: 0, university: 0, stadium: 0 });

type Grids = Record<string, Cell[]>;
const freshGrids = (): Grids => Object.fromEntries(DISTRICTS.map((d) => [d.id, Array(ND * ND).fill('') as Cell[]]));

const grade = (pct: number) => (pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F');
const GRADE_COLOR: Record<string, string> = { A: 'text-emerald-600', B: 'text-lime-600', C: 'text-amber-600', D: 'text-orange-600', F: 'text-rose-600' };

type ReportRow = { label: string; math: string; pct: number };
type Report = { rows: ReportRow[]; overall: number; population: number; capacity: number; resilience: number };

export function PocketTown() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const maxTier = useProgress((s) => s.townMaxTier);
  const setMaxTier = useProgress((s) => s.setTownMaxTier);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [grids, setGrids] = useState<Grids>(freshGrids);
  const [cur, setCur] = useState('downtown');
  const [tool, setTool] = useState<Cell | 'bulldoze'>('road');
  const [money, setMoney] = useState(340);
  const [pop, setPop] = useState(0);
  const [happy, setHappy] = useState(70);
  const [tier, setTier] = useState(0);
  const [tax, setTax] = useState<{ c: Challenge; reward: number } | null>(null);
  const [taxInput, setTaxInput] = useState('');
  const [msg, setMsg] = useState('Build roads, then homes & shops. Use the arrows to visit other neighborhoods!');
  const [zoom, setZoom] = useState(1);
  const [story, setStory] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  const storyRef = useRef(false);
  const playSecRef = useRef(0);
  const moneyRef = useRef(money);
  const gridsRef = useRef(grids);
  const popRef = useRef(0);
  const happyRef = useRef(70);
  const spentRef = useRef(0);
  moneyRef.current = money;
  gridsRef.current = grids;
  popRef.current = pop;
  happyRef.current = happy;

  const allCounts = (): Counts => {
    const c = emptyCounts();
    for (const d of DISTRICTS) for (const cell of gridsRef.current[d.id]) c[cell]++;
    return c;
  };

  const punch = () => { setZoom(1.08); window.setTimeout(() => setZoom(1), 220); };

  // economy tick (aggregates every district)
  useEffect(() => {
    if (outcome) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || storyRef.current) return;
      const c = allCounts();
      const jobs = c.com * 4 + c.ind * 6 + c.mall * 9 + c.university * 2;
      const services = c.police + c.fire + c.hospital + c.school + c.university;
      const utilityCap = c.power * 14 + c.water * 14 + c.farm * 6;
      const housingCap = c.res * PEOPLE_PER_HOME + Math.min(c.res * 8, services * 6) + utilityCap;
      const target = Math.min(housingCap, jobs * 6 + (c.res > 0 ? 8 : 0));
      const p = popRef.current;
      const np = Math.round(p + Math.sign(target - p) * Math.min(14, Math.abs(target - p)));
      let hh = 66 + c.park * 4 + c.stadium * 10 + c.farm + services * 3 - c.ind * 2 - Math.max(0, np - housingCap) * 0.5;
      hh = Math.max(0, Math.min(100, hh));
      const income = Math.round(c.com * 3 + c.ind * 5 + c.mall * 8 + c.farm + c.university * 3 + np * 0.6 - services * 4 - (c.power + c.water) * 2 - c.road * 0.2);
      setPop(np);
      setHappy(Math.round(hh));
      setMoney((m) => Math.max(0, m + income));
      let tnew = 0;
      for (let i = TIER_POP.length - 1; i >= 0; i--) if (np >= TIER_POP[i]) { tnew = i; break; }
      setTier((prev) => {
        if (tnew > prev) { sfx.levelUp(); haptic(HAPTIC.levelUp); punch(); setMsg(`🎉 Your city grew into a ${TIERS[tnew]}!`); setMaxTier(Math.max(maxTier, tnew)); }
        return Math.max(prev, tnew);
      });
    }, 2500);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome]);

  // forced fresh math story every 3 minutes
  useEffect(() => {
    if (outcome) return;
    const id = window.setInterval(() => {
      if (pausedRef.current || storyRef.current || document.hidden) return;
      playSecRef.current += 1;
      if (playSecRef.current >= STORY_EVERY) { playSecRef.current = 0; storyRef.current = true; setStory(true); }
    }, 1000);
    return () => window.clearInterval(id);
  }, [outcome, pausedRef]);

  const build = (i: number) => {
    if (outcome || pausedRef.current || storyRef.current) return;
    setGrids((gs) => {
      const g = gs[cur];
      const c = g[i];
      if (tool === 'bulldoze') {
        if (!c) return gs;
        if (moneyRef.current < 2) { setMsg('Need 💰2 to clear.'); return gs; }
        setMoney((m) => m - 2);
        const ng = [...g]; ng[i] = ''; return { ...gs, [cur]: ng };
      }
      if (c === tool) return gs;
      const cost = COST[tool];
      if (moneyRef.current < cost) { setMsg(`Need 💰${cost} for that.`); sfx.hurt(); return gs; }
      setMoney((m) => m - cost);
      spentRef.current += cost;
      sfx.build(); haptic(HAPTIC.tap);
      const ng = [...g]; ng[i] = tool as Cell; return { ...gs, [cur]: ng };
    });
  };

  const go = (dir: Dir) => {
    const next = NEIGHBORS[cur]?.[dir];
    if (next) { setCur(next); sfx.step(); }
  };

  // ---- Report card math ----
  const buildReport = (): Report => {
    const c = allCounts();
    const homes = c.res;
    const capacity = homes * PEOPLE_PER_HOME;
    const need = (per: number) => Math.max(homes > 0 ? 1 : 0, Math.ceil(homes / per));
    const cover = (have: number, per: number) => (homes === 0 ? 100 : Math.min(100, Math.round((have / need(per)) * 100)));
    const rows: ReportRow[] = [
      { label: '⚡ Power', math: `${homes} homes ÷ 4 = ${need(4)} needed · have ${c.power}`, pct: cover(c.power, 4) },
      { label: '🚰 Water', math: `${homes} homes ÷ 5 = ${need(5)} needed · have ${c.water}`, pct: cover(c.water, 5) },
      { label: '🌳 Green space', math: `${homes} homes ÷ 6 = ${need(6)} parks · have ${c.park}`, pct: cover(c.park, 6) },
      { label: '🏫 Schools', math: `${homes} homes ÷ 8 = ${need(8)} needed · have ${c.school}`, pct: cover(c.school, 8) },
      { label: '🚓🚒🏥 Safety', math: `${homes} homes ÷ 6 = ${need(6)} needed · have ${c.police + c.fire + c.hospital}`, pct: cover(c.police + c.fire + c.hospital, 6) },
      { label: '😀 Happiness', math: `${happy} out of 100 = ${happy}%`, pct: happy },
    ];
    const cityValue = pop + happy + c.com * 3 + c.mall * 5;
    const spent = Math.max(1, spentRef.current);
    const effRate = cityValue / spent; // value per coin
    const effPct = Math.min(100, Math.round(effRate * 140));
    rows.push({ label: '💰 Budget efficiency', math: `${cityValue} value ÷ ${spent} coins ≈ ${effRate.toFixed(2)} value/coin`, pct: effPct });
    const resilience = Math.round((cover(c.power, 4) + cover(c.water, 5) + cover(c.police + c.fire + c.hospital, 6)) / 3);
    const overall = Math.round(rows.reduce((s, r) => s + r.pct, 0) / rows.length);
    return { rows, overall, population: pop, capacity, resilience };
  };

  const openReport = () => { setReport(buildReport()); sfx.powerup(); };

  const collectTaxes = () => {
    if (tax) return;
    const c = allCounts();
    const reward = 30 + c.com * 5 + Math.floor(pop * 0.5);
    const lvl = useProgress.getState().arcadeLevels[arcadeUnit] ?? 1;
    setTax({ c: makeAdaptive(arcadeUnit, lvl, 'medium'), reward });
    setTaxInput('');
  };
  const submitTax = () => {
    if (!tax) return;
    const n = Number(taxInput.trim());
    if (taxInput.trim() === '' || Number.isNaN(n)) return;
    recordArcadeAnswer(arcadeUnit, n === tax.c.answer);
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

  const endGame = () => {
    const xp = Math.max(2, Math.min(20, tier * 3 + Math.floor(pop / 200)));
    addArcadePoints(pop + tier * 50);
    setOutcome(recordArcadePlay('town', xp));
  };

  const reset = () => {
    setGrids(freshGrids());
    setCur('downtown'); setTool('road'); setMoney(340); setPop(0); setHappy(70); setTier(0);
    setTax(null); setTaxInput(''); setReport(null); setMapOpen(false);
    spentRef.current = 0; playSecRef.current = 0; storyRef.current = false;
    setMsg('Build roads, then homes & shops. Use the arrows to visit other neighborhoods!');
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Pocket Town" emoji="🏙️" />
        <ArcadeEndCard gameId="town" outcome={outcome} win={tier >= 3} scoreLine={`${TIERS[tier]} · 👥 ${pop} · 💰 ${money}`} onReplay={reset} />
      </div>
    );
  }

  const district = DISTRICTS.find((d) => d.id === cur)!;
  const nbr = NEIGHBORS[cur] ?? {};
  const nextPop = TIER_POP[Math.min(tier + 1, TIER_POP.length - 1)];
  const tierPct = tier >= TIERS.length - 1 ? 100 : Math.min(100, Math.round((pop / nextPop) * 100));

  return (
    <div>
      <ArcadeHeader title="Pocket Town" emoji="🏙️" />

      <div className="flex justify-between items-center mb-1 max-w-md mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-indigo-600">🏛️ {TIERS[tier]}</span>
        <span className="text-slate-700">👥 {pop.toLocaleString()}</span>
        <span className="text-amber-600">💰 {money}</span>
        <span className="text-rose-500">😀 {happy}%</span>
      </div>
      <div className="max-w-md mx-auto mb-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${tierPct}%` }} />
      </div>

      {/* neighborhood nav */}
      <div className="max-w-md mx-auto mb-2 flex items-center justify-between gap-2">
        <button type="button" onClick={() => setMapOpen(true)} className="rounded-2xl bg-white border-2 border-slate-200 px-3 py-1.5 font-display font-extrabold text-sm">🗺️ Map</button>
        <div className="font-display font-extrabold text-slate-800">{district.emoji} {district.name}</div>
        <div className="grid grid-cols-3 grid-rows-2 gap-0.5 w-24">
          <span /><CompassBtn dir="N" on={!!nbr.N} go={go} /><span />
          <CompassBtn dir="W" on={!!nbr.W} go={go} /><CompassBtn dir="E" on={!!nbr.E} go={go} /><span className="hidden" />
          <span /><CompassBtn dir="S" on={!!nbr.S} go={go} /><span />
        </div>
      </div>

      <GameStage theme="candy" className="max-w-md mx-auto p-2">
        <div
          className="grid gap-0.5 mx-auto transition-transform"
          style={{ gridTemplateColumns: `repeat(${ND}, minmax(0, 1fr))`, transform: `scale(${zoom})`, maxWidth: 360 }}
        >
          {grids[cur].map((cell, i) => (
            <button
              key={i}
              type="button"
              onClick={() => build(i)}
              className="aspect-square rounded-md bg-white/80 border border-emerald-200 flex items-center justify-center text-lg active:scale-95"
            >
              {EMOJI[cell]}
            </button>
          ))}
        </div>
      </GameStage>

      <div className="max-w-md mx-auto mt-2 rounded-xl bg-white/85 px-3 py-1.5 text-center text-xs font-display font-bold text-slate-700 min-h-8 flex items-center justify-center">
        {msg}
      </div>

      {/* tool palette */}
      <div className="max-w-md mx-auto mt-2 grid grid-cols-8 gap-1">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTool(t.key)}
            className={`rounded-lg p-1 text-center border-2 ${tool === t.key ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}
          >
            <div className="text-lg leading-none">{t.emoji}</div>
            <div className="text-[7px] font-display font-bold text-slate-500">💰{t.cost}</div>
          </button>
        ))}
      </div>

      {/* actions */}
      <div className="max-w-md mx-auto mt-2 grid grid-cols-2 gap-2">
        <button type="button" onClick={collectTaxes} className="min-h-11 rounded-2xl bg-amber-500 text-white font-display font-extrabold active:translate-y-0.5">💸 Collect taxes</button>
        <button type="button" onClick={openReport} className="min-h-11 rounded-2xl bg-indigo-600 text-white font-display font-extrabold active:translate-y-0.5">📋 Report card</button>
      </div>
      <button type="button" onClick={endGame} className="max-w-md mx-auto mt-2 block w-full min-h-10 rounded-2xl bg-slate-200 text-slate-700 font-display font-bold">Finish & score</button>

      {/* floating district map */}
      {mapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4" onClick={() => setMapOpen(false)}>
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="font-display font-extrabold text-slate-900 text-center">🗺️ Jump to a neighborhood</div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {DISTRICTS.map((d) => (
                <button key={d.id} type="button" onClick={() => { setCur(d.id); setMapOpen(false); sfx.step(); }} className={`min-h-11 rounded-2xl border-2 font-display font-extrabold ${d.id === cur ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-700'}`}>
                  {d.emoji} {d.name}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setMapOpen(false)} className="mt-3 w-full min-h-10 rounded-2xl bg-slate-200 text-slate-700 font-display font-bold">Close</button>
          </div>
        </div>
      )}

      {/* report card */}
      {report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 overflow-y-auto" onClick={() => setReport(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl my-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-xs font-display font-extrabold uppercase tracking-widest text-indigo-500">🏛️ City Inspector</div>
              <div className={`font-display font-extrabold text-5xl ${GRADE_COLOR[grade(report.overall)]}`}>{grade(report.overall)}</div>
              <div className="text-sm font-display font-bold text-slate-500">Overall {report.overall}%</div>
            </div>
            <div className="mt-2 rounded-2xl bg-indigo-50 border-2 border-indigo-200 p-2 text-center text-xs font-display font-bold text-indigo-800">
              Population: {report.population.toLocaleString()} · Housing capacity = homes × {PEOPLE_PER_HOME} = {report.capacity.toLocaleString()}
            </div>
            <div className="mt-3 space-y-2">
              {report.rows.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-[11px] font-display font-bold text-slate-700">
                    <span>{r.label}</span>
                    <span className={`tabular-nums ${GRADE_COLOR[grade(r.pct)]}`}>{grade(r.pct)} · {r.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${r.pct}%` }} />
                  </div>
                  <div className="text-[10px] font-display font-bold text-slate-400">{r.math}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-amber-50 border-2 border-amber-200 p-3 text-center">
              <div className="font-display font-extrabold text-amber-800">🌪️ Disaster resilience: {report.resilience}%</div>
              <div className="text-[11px] font-display font-bold text-amber-700 mt-0.5">
                {report.resilience >= 80 ? 'Your city can withstand a disaster! 🛡️' : report.resilience >= 50 ? 'Risky — add more power, water & safety!' : 'Danger! Build utilities & services to survive.'}
              </div>
            </div>
            <button type="button" onClick={() => setReport(null)} className="mt-4 w-full min-h-11 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">Keep building ▶</button>
          </div>
        </div>
      )}

      {/* tax math modal */}
      {tax && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="font-display font-extrabold text-slate-900">💸 Solve to collect double taxes!</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold leading-snug break-words">{tax.c.prompt}</div>
            <div className="mt-2 h-11 rounded-xl border-2 border-slate-200 flex items-center justify-center text-xl font-display font-extrabold tabular-nums">{taxInput || <span className="text-slate-300">?</span>}</div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
                <button key={k} type="button" onClick={() => setTaxInput((v) => (k === 'del' ? v.slice(0, -1) : k === '-' ? (v.startsWith('-') ? v.slice(1) : '-' + v) : v.length < 6 ? v + k : v))} className="min-h-10 rounded-lg bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-slate-800 active:translate-y-0.5">
                  {k === 'del' ? '⌫' : k}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setTax(null)} className="min-h-11 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">Skip</button>
              <button type="button" onClick={submitTax} disabled={!taxInput.trim()} className="min-h-11 rounded-2xl bg-emerald-500 disabled:bg-slate-300 text-white font-display font-extrabold">Collect ✓</button>
            </div>
          </div>
        </div>
      )}

      {story && (
        <MathBreak minSeconds={STORY_MIN_READ} onDone={() => { setStory(false); storyRef.current = false; playSecRef.current = 0; }} />
      )}
    </div>
  );
}

function CompassBtn({ dir, on, go }: { dir: Dir; on: boolean; go: (d: Dir) => void }) {
  const arrow = dir === 'N' ? '▲' : dir === 'S' ? '▼' : dir === 'E' ? '▶' : '◀';
  return (
    <button
      type="button"
      disabled={!on}
      onClick={() => go(dir)}
      className={`min-h-7 rounded-md text-xs font-display font-extrabold ${on ? 'bg-indigo-500 text-white active:translate-y-0.5' : 'bg-slate-100 text-slate-300'}`}
    >
      {arrow}
    </button>
  );
}
