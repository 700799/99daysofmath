import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Dress to Impress — an original theme-styling + runway game. A theme asks for a
// look; you assemble an outfit from a wardrobe before the clock runs out, then
// walk the runway for a percent score. The math is woven through four of our
// units: RATIOS (match the theme's warm:cool palette ratio), PERCENTAGES (the
// runway score % + boutique "% off" sales), BUDGET & DECIMALS (a styling budget
// with decimal prices + change at checkout), and the COUNTING PRINCIPLE (how
// many outfits can your wardrobe make?). Original art (emoji/CSS), no
// trademarked assets.

type Slot = 'hair' | 'top' | 'bottom' | 'shoes' | 'accessory';
const SLOTS: Slot[] = ['hair', 'top', 'bottom', 'shoes', 'accessory'];
const REQUIRED: Slot[] = ['hair', 'top', 'bottom', 'shoes'];
const SLOT_LABEL: Record<Slot, string> = { hair: 'Head', top: 'Top', bottom: 'Bottom', shoes: 'Shoes', accessory: 'Accessory' };

type Temp = 'warm' | 'cool' | 'neutral';
type Item = { id: string; slot: Slot; emoji: string; label: string; temp: Temp; themes: string[]; price: number; salePct?: number };
type Theme = { name: string; emoji: string; ratio: { w: number; c: number }; budget: number; blurb: string };

const THEMES: Theme[] = [
  { name: 'Beach Day', emoji: '🏖️', ratio: { w: 3, c: 1 }, budget: 20, blurb: 'Warm & sunny — mostly warm colors (3 ☀ : 1 ❄).' },
  { name: 'Royal Ball', emoji: '👑', ratio: { w: 1, c: 1 }, budget: 26, blurb: 'Elegant balance of warm & cool (1 ☀ : 1 ❄).' },
  { name: 'Winter Gala', emoji: '❄️', ratio: { w: 1, c: 3 }, budget: 24, blurb: 'Cool & frosty — mostly cool colors (1 ☀ : 3 ❄).' },
  { name: 'Neon Night', emoji: '🌃', ratio: { w: 1, c: 1 }, budget: 22, blurb: 'Bold mix — equal warm & cool (1 ☀ : 1 ❄).' },
];

const WARDROBE: Item[] = [
  // head
  { id: 'h1', slot: 'hair', emoji: '👒', label: 'Sun hat', temp: 'warm', themes: ['Beach Day'], price: 4 },
  { id: 'h2', slot: 'hair', emoji: '👑', label: 'Tiara', temp: 'cool', themes: ['Royal Ball'], price: 8, salePct: 25 },
  { id: 'h3', slot: 'hair', emoji: '🎩', label: 'Top hat', temp: 'cool', themes: ['Royal Ball', 'Neon Night'], price: 6 },
  { id: 'h4', slot: 'hair', emoji: '🎀', label: 'Big bow', temp: 'warm', themes: ['Neon Night', 'Royal Ball'], price: 3 },
  { id: 'h5', slot: 'hair', emoji: '🧢', label: 'Cap', temp: 'cool', themes: ['Beach Day', 'Neon Night'], price: 3.5 },
  // top
  { id: 't1', slot: 'top', emoji: '👙', label: 'Swim top', temp: 'warm', themes: ['Beach Day'], price: 5 },
  { id: 't2', slot: 'top', emoji: '👗', label: 'Gown', temp: 'cool', themes: ['Royal Ball'], price: 9, salePct: 20 },
  { id: 't3', slot: 'top', emoji: '🧥', label: 'Coat', temp: 'cool', themes: ['Winter Gala'], price: 8 },
  { id: 't4', slot: 'top', emoji: '👚', label: 'Blouse', temp: 'warm', themes: ['Royal Ball', 'Neon Night'], price: 6 },
  { id: 't5', slot: 'top', emoji: '🎽', label: 'Tank', temp: 'warm', themes: ['Beach Day', 'Neon Night'], price: 4 },
  // bottom
  { id: 'b1', slot: 'bottom', emoji: '🩳', label: 'Shorts', temp: 'warm', themes: ['Beach Day', 'Neon Night'], price: 4 },
  { id: 'b2', slot: 'bottom', emoji: '👖', label: 'Jeans', temp: 'cool', themes: ['Neon Night', 'Beach Day'], price: 5 },
  { id: 'b3', slot: 'bottom', emoji: '🥻', label: 'Long skirt', temp: 'cool', themes: ['Royal Ball', 'Winter Gala'], price: 6 },
  // shoes
  { id: 's1', slot: 'shoes', emoji: '🩴', label: 'Sandals', temp: 'warm', themes: ['Beach Day'], price: 3 },
  { id: 's2', slot: 'shoes', emoji: '👡', label: 'Heels', temp: 'cool', themes: ['Royal Ball'], price: 7 },
  { id: 's3', slot: 'shoes', emoji: '👟', label: 'Sneakers', temp: 'cool', themes: ['Beach Day', 'Neon Night'], price: 5, salePct: 20 },
  { id: 's4', slot: 'shoes', emoji: '🥾', label: 'Boots', temp: 'cool', themes: ['Winter Gala'], price: 6 },
  { id: 's5', slot: 'shoes', emoji: '🥿', label: 'Flats', temp: 'warm', themes: ['Royal Ball', 'Neon Night'], price: 4 },
  // accessory
  { id: 'a1', slot: 'accessory', emoji: '🕶️', label: 'Sunglasses', temp: 'warm', themes: ['Beach Day', 'Neon Night'], price: 3 },
  { id: 'a2', slot: 'accessory', emoji: '🧣', label: 'Scarf', temp: 'cool', themes: ['Winter Gala', 'Royal Ball'], price: 4 },
  { id: 'a3', slot: 'accessory', emoji: '👜', label: 'Handbag', temp: 'warm', themes: ['Royal Ball', 'Neon Night'], price: 5 },
  { id: 'a4', slot: 'accessory', emoji: '🧤', label: 'Gloves', temp: 'cool', themes: ['Winter Gala'], price: 3 },
  { id: 'a5', slot: 'accessory', emoji: '💎', label: 'Necklace', temp: 'cool', themes: ['Royal Ball'], price: 8, salePct: 30 },
];

const STYLE_SECONDS = 40;
const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => `$${n.toFixed(2)}`;
const priceOf = (it: Item) => (it.salePct ? round2(it.price * (1 - it.salePct / 100)) : it.price);
const slotCount = (s: Slot) => WARDROBE.filter((i) => i.slot === s).length;

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Each round gives you a theme (Beach Day, Royal Ball, Winter Gala, Neon Night). Style a head-to-toe outfit that fits the theme, then walk the runway for a score!' },
  { heading: 'Beat the clock', body: `You have ${STYLE_SECONDS} seconds to put together your look. Tap a wardrobe item to wear it; tap another in the same spot to swap.` },
  { heading: 'Match the palette (ratios)', body: 'Every theme wants a warm ☀ : cool ❄ color ratio — like 3 ☀ : 1 ❄ for Beach Day. The closer your outfit matches that ratio, the higher your score.' },
  { heading: 'Stay on budget (decimals)', body: 'You have a styling budget. Items have prices (some are on sale — a % off the original!). You can’t spend more than your budget, and at checkout you’ll figure out your change.' },
  { heading: 'Runway score (percent)', body: 'Your runway score is a percent built from: filling all your slots, matching the theme, and matching the palette ratio. 70%+ wins the round!' },
  { heading: 'Outfit bonus (counting)', body: 'Between looks, earn bonus style coins by counting how many different outfits your wardrobe can make: tops × bottoms × shoes!' },
];
const CONTROLS = 'Tap items to wear/swap them. Watch your budget and the warm:cool ratio. Tap “Walk the runway” when ready (or when the timer ends).';

type Equipped = Partial<Record<Slot, Item>>;

export function DressToImpress() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'style' | 'runway'>('howto');
  const [roundIdx, setRoundIdx] = useState(0);
  const [equipped, setEquipped] = useState<Equipped>({});
  const [secondsLeft, setSecondsLeft] = useState(STYLE_SECONDS);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  // runway result
  const [result, setResult] = useState<{ pct: number; completeness: number; themeFit: number; ratioMatch: number } | null>(null);
  const [checkout, setCheckout] = useState<{ input: string; done: boolean; correct: boolean }>({ input: '', done: false, correct: false });
  const [bonus, setBonus] = useState<{ input: string; done: boolean; correct: boolean } | null>(null);

  const [scores, setScores] = useState<number[]>([]);
  const scoresRef = useRef<number[]>([]);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const theme = THEMES[roundIdx];
  const total = round2(SLOTS.reduce((sum, s) => sum + (equipped[s] ? priceOf(equipped[s] as Item) : 0), 0));
  const remaining = round2(theme.budget - total);
  const warmCount = SLOTS.filter((s) => equipped[s]?.temp === 'warm').length;
  const coolCount = SLOTS.filter((s) => equipped[s]?.temp === 'cool').length;

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1600);
  };

  const loadRound = (i: number) => {
    setRoundIdx(i);
    setEquipped({});
    setSecondsLeft(STYLE_SECONDS);
    setResult(null);
    setCheckout({ input: '', done: false, correct: false });
    setBonus(null);
    setPhase('style');
  };

  const startGame = () => {
    setScores([]);
    scoresRef.current = [];
    setOutcome(null);
    loadRound(0);
  };

  // styling countdown
  useEffect(() => {
    if (phase !== 'style') return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setSecondsLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          walkRunway();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIdx]);

  const equip = (item: Item) => {
    if (phase !== 'style') return;
    const cur = equipped[item.slot];
    if (cur?.id === item.id) {
      // tap again to take it off
      setEquipped((e) => {
        const n = { ...e };
        delete n[item.slot];
        return n;
      });
      sfx.step();
      return;
    }
    const prospective = round2(total - (cur ? priceOf(cur) : 0) + priceOf(item));
    if (prospective > theme.budget) {
      showToast(`Over budget! ${money(prospective)} > ${money(theme.budget)}`);
      sfx.hurt();
      haptic(HAPTIC.heavy);
      return;
    }
    setEquipped((e) => ({ ...e, [item.slot]: item }));
    sfx.pickup();
    haptic(HAPTIC.pickup);
  };

  const walkRunway = () => {
    const filledReq = REQUIRED.filter((s) => equipped[s]).length;
    const completeness = filledReq / REQUIRED.length;
    const worn = SLOTS.map((s) => equipped[s]).filter(Boolean) as Item[];
    const themeFit = worn.length ? worn.filter((it) => it.themes.includes(theme.name)).length / worn.length : 0;
    const targetFrac = theme.ratio.w / (theme.ratio.w + theme.ratio.c);
    const actualFrac = warmCount + coolCount > 0 ? warmCount / (warmCount + coolCount) : 0;
    const ratioMatch = warmCount + coolCount > 0 ? 1 - Math.abs(targetFrac - actualFrac) : 0;
    let pct = Math.round(100 * (0.4 * completeness + 0.35 * themeFit + 0.25 * ratioMatch));
    if (equipped.accessory && equipped.accessory.themes.includes(theme.name)) pct = Math.min(100, pct + 5);
    setResult({ pct, completeness, themeFit, ratioMatch });
    setPhase('runway');
    sfx.win();
    haptic(HAPTIC.win);
  };

  const submitCheckout = () => {
    const target = round2(remaining);
    const correct = checkout.input !== '' && Math.abs(Number(checkout.input) - target) < 0.01;
    recordArcadeAnswer(arcadeUnit, correct);
    if (correct) {
      sfx.coin();
      haptic(HAPTIC.win);
    } else {
      sfx.hurt();
      haptic(HAPTIC.heavy);
    }
    setCheckout((c) => ({ ...c, done: true, correct }));
  };

  const nextLook = () => {
    const pct = result?.pct ?? 0;
    scoresRef.current = [...scoresRef.current, pct];
    setScores(scoresRef.current);
    if (roundIdx >= THEMES.length - 1) {
      endRun();
    } else {
      // counting-principle bonus before the next theme
      setBonus({ input: '', done: false, correct: false });
    }
  };

  const submitBonus = () => {
    if (!bonus) return;
    const ans = slotCount('top') * slotCount('bottom') * slotCount('shoes');
    const correct = bonus.input !== '' && Number(bonus.input) === ans;
    recordArcadeAnswer(arcadeUnit, correct);
    if (correct) {
      sfx.powerup();
      haptic(HAPTIC.levelUp);
    } else {
      sfx.hurt();
      haptic(HAPTIC.heavy);
    }
    setBonus((b) => (b ? { ...b, done: true, correct } : b));
  };

  const endRun = () => {
    const list = scoresRef.current;
    const avg = list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : 0;
    addArcadePoints(list.reduce((a, b) => a + b, 0));
    const xp = Math.max(2, Math.min(20, Math.round(avg / 5)));
    setOutcome(recordArcadePlay('dress', xp));
  };

  // ---- screens ----
  if (outcome) {
    const list = scores.length ? scores : scoresRef.current;
    const avg = list.length ? Math.round(list.reduce((a, b) => a + b, 0) / list.length) : 0;
    return (
      <div>
        <ArcadeHeader title="Dress to Impress" emoji="👗" />
        <ArcadeEndCard
          gameId="dress"
          outcome={outcome}
          win={avg >= 70}
          scoreLine={`Avg runway score ${avg}% · ${list.length} looks`}
          onReplay={startGame}
        />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Dress to Impress" emoji="👗" />
        <HowToPlay emoji="👗" title="Dress to Impress" gradient="from-fuchsia-500 to-violet-600" sections={HOWTO} controls={CONTROLS} onStart={startGame} />
      </div>
    );
  }

  // shared avatar card
  const Avatar = (
    <div className="flex flex-col items-center justify-center gap-0.5 select-none">
      <div className="text-4xl leading-none h-10 flex items-end">{equipped.hair?.emoji ?? '✨'}</div>
      <div className="text-4xl leading-none">🙂</div>
      <div className="text-4xl leading-none">{equipped.top?.emoji ?? '👕'}</div>
      <div className="text-4xl leading-none">{equipped.bottom?.emoji ?? '🩲'}</div>
      <div className="text-3xl leading-none">{equipped.shoes?.emoji ?? '🦶'}</div>
      {equipped.accessory && <div className="text-2xl leading-none">{equipped.accessory.emoji}</div>}
    </div>
  );

  if (phase === 'runway' && result) {
    const stars = result.pct >= 90 ? 3 : result.pct >= 70 ? 2 : result.pct >= 50 ? 1 : 0;
    return (
      <div>
        <ArcadeHeader title="Dress to Impress" emoji="👗" />
        <GameStage theme="dress" className="max-w-md mx-auto p-4">
          <div className="text-center">
            <div className="text-xs font-display font-extrabold uppercase tracking-widest text-white/80">{theme.emoji} {theme.name} — Runway!</div>
            <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="my-2">{Avatar}</motion.div>
            <div className="text-5xl font-display font-extrabold text-white tabular-nums drop-shadow">{result.pct}%</div>
            <div className="text-2xl">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
          </div>
        </GameStage>

        {/* score breakdown (percent) */}
        <div className="max-w-md mx-auto mt-3 space-y-1.5">
          {[
            { label: 'Complete look', v: result.completeness },
            { label: `Fits ${theme.name}`, v: result.themeFit },
            { label: `Palette ${theme.ratio.w}☀:${theme.ratio.c}❄`, v: result.ratioMatch },
          ].map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-[11px] font-display font-bold text-slate-600">
                <span>{b.label}</span>
                <span className="tabular-nums">{Math.round(b.v * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-fuchsia-500" style={{ width: `${Math.round(b.v * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* checkout (budget & decimals) */}
        <div className="max-w-md mx-auto mt-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-3">
          <div className="text-sm font-display font-extrabold text-emerald-800 text-center">
            💳 Checkout: budget {money(theme.budget)} − spent {money(total)} = change?
          </div>
          {!checkout.done ? (
            <>
              <div className="mt-2 h-10 rounded-xl border-2 border-emerald-300 bg-white flex items-center justify-center text-xl font-display font-extrabold tabular-nums text-emerald-800">
                {checkout.input ? money(Number(checkout.input)) : '—'}
              </div>
              <DecimalKeypad onKey={(k) => setCheckout((c) => ({ ...c, input: editNum(c.input, k) }))} />
              <button type="button" onClick={submitCheckout} className="mt-2 w-full min-h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold">
                Check change ▶
              </button>
            </>
          ) : (
            <div className={`mt-2 text-center font-display font-extrabold ${checkout.correct ? 'text-emerald-700' : 'text-rose-600'}`}>
              {checkout.correct ? `Correct! Change = ${money(remaining)} 🪙 +bonus` : `Change = ${money(remaining)}. Keep practicing!`}
            </div>
          )}
        </div>

        <button type="button" onClick={nextLook} className="max-w-md mx-auto mt-3 w-full min-h-12 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all">
          {roundIdx >= THEMES.length - 1 ? 'See final results 🏆' : 'Next look ▶'}
        </button>

        {/* counting-principle bonus modal */}
        {bonus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
            <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
              <div className="text-xs font-display font-extrabold uppercase tracking-widest text-violet-600">✨ Outfit Bonus</div>
              <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-base font-display font-extrabold text-slate-800">
                How many outfits can you make?
                <div className="mt-1 text-violet-700">{slotCount('top')} tops × {slotCount('bottom')} bottoms × {slotCount('shoes')} shoes = ?</div>
              </div>
              {!bonus.done ? (
                <>
                  <div className="mt-3 h-10 rounded-xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums text-slate-800">
                    {bonus.input || '—'}
                  </div>
                  <DecimalKeypad noDot onKey={(k) => setBonus((b) => (b ? { ...b, input: editNum(b.input, k) } : b))} />
                  <button type="button" onClick={submitBonus} className="mt-2 w-full min-h-11 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white font-display font-extrabold">
                    Count outfits ▶
                  </button>
                </>
              ) : (
                <>
                  <div className={`mt-3 font-display font-extrabold ${bonus.correct ? 'text-violet-700' : 'text-rose-600'}`}>
                    {bonus.correct ? 'Correct! 🪙 +style coins' : `It’s ${slotCount('top') * slotCount('bottom') * slotCount('shoes')} outfits!`}
                  </div>
                  <button type="button" onClick={() => loadRound(roundIdx + 1)} className="mt-3 w-full min-h-11 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-display font-extrabold">
                    Next theme ▶
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- styling screen ----
  return (
    <div>
      <ArcadeHeader title="Dress to Impress" emoji="👗" />

      {/* theme + HUD */}
      <div className="max-w-md mx-auto mb-2 rounded-2xl bg-fuchsia-50 border-2 border-fuchsia-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="font-display font-extrabold text-fuchsia-800">{theme.emoji} {theme.name} <span className="text-slate-400 text-xs">({roundIdx + 1}/{THEMES.length})</span></div>
          <div className={`font-display font-extrabold tabular-nums ${secondsLeft <= 10 ? 'text-rose-600' : 'text-fuchsia-700'}`}>⏱ {secondsLeft}s</div>
        </div>
        <div className="text-[11px] font-display font-bold text-slate-500 mt-0.5">{theme.blurb}</div>
      </div>

      <div className="max-w-md mx-auto mb-2 flex items-center justify-between gap-2 text-[11px] font-display font-extrabold">
        <span className={`rounded-full px-2.5 py-1 ${remaining >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>💰 {money(remaining)} left</span>
        <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-1">☀ {warmCount} : {coolCount} ❄</span>
        <span className="rounded-full bg-slate-800 text-white px-2.5 py-1">🎯 {theme.ratio.w}:{theme.ratio.c}</span>
        <span className="rounded-full bg-fuchsia-100 text-fuchsia-800 px-2.5 py-1">👗 {REQUIRED.filter((s) => equipped[s]).length}/{REQUIRED.length}</span>
      </div>

      {/* avatar + wardrobe */}
      <GameStage theme="dress" className="max-w-md mx-auto p-3">
        <div className="rounded-2xl bg-white/85 p-2">{Avatar}</div>
      </GameStage>

      <div className="max-w-md mx-auto mt-2 space-y-2">
        {SLOTS.map((s) => (
          <div key={s}>
            <div className="text-[11px] font-display font-extrabold text-slate-500 mb-0.5">{SLOT_LABEL[s]}{!REQUIRED.includes(s) && ' (optional)'}</div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {WARDROBE.filter((i) => i.slot === s).map((it) => {
                const on = equipped[s]?.id === it.id;
                const disc = priceOf(it);
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => equip(it)}
                    className={`shrink-0 w-16 rounded-xl border-2 p-1 text-center transition-colors ${on ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-slate-200 bg-white hover:border-fuchsia-300'}`}
                  >
                    <div className="text-2xl leading-none">{it.emoji}</div>
                    <div className="text-[8px] font-display font-bold text-slate-500 truncate">{it.label}</div>
                    <div className="text-[8px] font-display font-extrabold tabular-nums">
                      {it.salePct ? (
                        <span className="text-rose-600">{money(disc)}<span className="text-[7px] text-slate-400 line-through ml-0.5">{money(it.price)}</span></span>
                      ) : (
                        <span className="text-slate-700">{money(disc)}</span>
                      )}
                    </div>
                    <div className="text-[8px]">{it.temp === 'warm' ? '☀' : it.temp === 'cool' ? '❄' : '◽'}{it.salePct ? ` -${it.salePct}%` : ''}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={walkRunway}
        className="max-w-md mx-auto mt-3 w-full min-h-12 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-display font-extrabold text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
      >
        💃 Walk the runway!
      </button>

      <GameInstructions emoji="👗" title="Dress to Impress" sections={HOWTO} controls={CONTROLS} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full bg-rose-600 text-white font-display font-extrabold text-sm px-4 py-2 shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function editNum(cur: string, k: string): string {
  if (k === 'del') return cur.slice(0, -1);
  if (k === '.') return cur.includes('.') ? cur : cur === '' ? '0.' : cur + '.';
  if (cur.replace('.', '').length >= 5) return cur;
  return cur + k;
}

function DecimalKeypad({ onKey, noDot }: { onKey: (k: string) => void; noDot?: boolean }) {
  const keys = noDot ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return (
    <div className="mt-2 grid grid-cols-3 gap-1.5">
      {keys.map((k, i) =>
        k === '' ? (
          <div key={i} />
        ) : (
          <button key={i} type="button" onClick={() => onKey(k)} className="min-h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-lg text-slate-800 active:translate-y-0.5">
            {k === 'del' ? '⌫' : k}
          </button>
        ),
      )}
    </div>
  );
}
