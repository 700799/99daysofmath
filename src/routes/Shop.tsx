import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../state/progress';
import { ARCADE_GAMES, PREMIUM_GAMES } from './arcade/shared';
import { Mascot, gameMascot } from './arcade/Mascots';
import { makeAdaptive, pickLesson, type Challenge } from './arcade/MidGameChallenge';
import { LessonCard } from '../components/LessonCard';
import { sfx, haptic, HAPTIC } from '../utils/arcadeAV';

const EARN_PER = 15; // coins per correct word problem
const EARN_ROUND = 3; // problems per earning round

// Coin Shop — an in-app store (not a game). Spend coins (earned by playing arcade
// games) to buy avatar cosmetics (hats, outfits, pets, backgrounds) and to unlock
// premium games. All original art (emoji + SVG mascots).

export type Slot = 'hat' | 'outfit' | 'pet' | 'bg';
export type Cosmetic = { id: string; slot: Slot; emoji: string; name: string; price: number };

export const COSMETICS: Cosmetic[] = [
  // hats
  { id: 'hat_crown', slot: 'hat', emoji: '👑', name: 'Gold Crown', price: 120 },
  { id: 'hat_tophat', slot: 'hat', emoji: '🎩', name: 'Top Hat', price: 60 },
  { id: 'hat_cap', slot: 'hat', emoji: '🧢', name: 'Ball Cap', price: 30 },
  { id: 'hat_bow', slot: 'hat', emoji: '🎀', name: 'Hair Bow', price: 25 },
  { id: 'hat_party', slot: 'hat', emoji: '🥳', name: 'Party Hat', price: 40 },
  { id: 'hat_wizard', slot: 'hat', emoji: '🧙', name: 'Wizard Hat', price: 90 },
  // outfits
  { id: 'fit_cape', slot: 'outfit', emoji: '🦸', name: 'Hero Cape', price: 100 },
  { id: 'fit_lab', slot: 'outfit', emoji: '🥼', name: 'Lab Coat', price: 55 },
  { id: 'fit_jacket', slot: 'outfit', emoji: '🧥', name: 'Cozy Jacket', price: 45 },
  { id: 'fit_dress', slot: 'outfit', emoji: '👗', name: 'Fancy Dress', price: 70 },
  { id: 'fit_armor', slot: 'outfit', emoji: '🛡️', name: 'Shiny Armor', price: 110 },
  // pets
  { id: 'pet_puppy', slot: 'pet', emoji: '🐶', name: 'Puppy Pal', price: 80 },
  { id: 'pet_kitten', slot: 'pet', emoji: '🐱', name: 'Kitten', price: 80 },
  { id: 'pet_dragon', slot: 'pet', emoji: '🐉', name: 'Baby Dragon', price: 150 },
  { id: 'pet_fox', slot: 'pet', emoji: '🦊', name: 'Little Fox', price: 90 },
  { id: 'pet_penguin', slot: 'pet', emoji: '🐧', name: 'Penguin', price: 70 },
  // backgrounds
  { id: 'bg_rainbow', slot: 'bg', emoji: '🌈', name: 'Rainbow', price: 60 },
  { id: 'bg_sunset', slot: 'bg', emoji: '🌅', name: 'Sunset', price: 50 },
  { id: 'bg_galaxy', slot: 'bg', emoji: '🌌', name: 'Galaxy', price: 100 },
  { id: 'bg_ocean', slot: 'bg', emoji: '🌊', name: 'Ocean', price: 50 },
  { id: 'bg_candy', slot: 'bg', emoji: '🍭', name: 'Candy Land', price: 50 },
];

export const BG_GRADIENT: Record<string, string> = {
  bg_rainbow: 'from-rose-400 via-amber-300 to-sky-400',
  bg_sunset: 'from-orange-400 to-pink-600',
  bg_galaxy: 'from-indigo-700 to-fuchsia-800',
  bg_ocean: 'from-cyan-400 to-blue-700',
  bg_candy: 'from-pink-300 to-fuchsia-400',
};
export const emojiOf = (id?: string) => COSMETICS.find((c) => c.id === id)?.emoji;

const TABS: { key: Slot | 'games'; label: string; emoji: string }[] = [
  { key: 'hat', label: 'Hats', emoji: '🎩' },
  { key: 'outfit', label: 'Outfits', emoji: '🧥' },
  { key: 'pet', label: 'Pets', emoji: '🐾' },
  { key: 'bg', label: 'Scenes', emoji: '🌈' },
  { key: 'games', label: 'Games', emoji: '🎮' },
];

export function Shop() {
  const coins = useProgress((s) => s.coins);
  const owned = useProgress((s) => s.ownedCosmetics);
  const equipped = useProgress((s) => s.equipped);
  const unlocked = useProgress((s) => s.unlockedGames);
  const buyCosmetic = useProgress((s) => s.buyCosmetic);
  const equipCosmetic = useProgress((s) => s.equipCosmetic);
  const unlockGame = useProgress((s) => s.unlockGame);
  const addCoins = useProgress((s) => s.addCoins);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const [tab, setTab] = useState<Slot | 'games'>('hat');
  const [flash, setFlash] = useState<string | null>(null);
  const [earn, setEarn] = useState<{ c: Challenge; input: string; wrong: boolean; done: number } | null>(null);
  const [help, setHelp] = useState(false);

  const note = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash((m) => (m === msg ? null : m)), 1500);
  };

  const buy = (c: Cosmetic) => {
    if (owned.includes(c.id)) {
      equipCosmetic(c.slot, equipped[c.slot] === c.id ? null : c.id);
      sfx.pickup(); haptic(HAPTIC.pickup);
      return;
    }
    if (coins < c.price) { note('Not enough coins — play games to earn more!'); sfx.hurt(); return; }
    buyCosmetic(c.id, c.price);
    equipCosmetic(c.slot, c.id);
    sfx.coin(); haptic(HAPTIC.win);
    note(`Bought ${c.name}! 🎉`);
  };

  const premiumGames = ARCADE_GAMES.filter((g) => PREMIUM_GAMES[g.id] != null);
  const buyGame = (id: string, price: number) => {
    if (unlocked.includes(id)) return;
    if (coins < price) { note('Not enough coins — play games to earn more!'); sfx.hurt(); return; }
    unlockGame(id, price);
    sfx.powerup(); haptic(HAPTIC.win);
    note('Game unlocked! 🎮');
  };

  const startEarn = () => {
    const lvl = useProgress.getState().arcadeLevels[arcadeUnit] ?? 1;
    setEarn({ c: makeAdaptive(arcadeUnit, lvl, 'word'), input: '', wrong: false, done: 0 });
  };
  const submitEarn = () => {
    if (!earn) return;
    const n = Number(earn.input.trim());
    if (earn.input.trim() === '' || Number.isNaN(n)) return;
    const correct = n === earn.c.answer;
    recordArcadeAnswer(arcadeUnit, correct);
    if (!correct) { sfx.hurt(); haptic(HAPTIC.hit); setEarn({ ...earn, wrong: true, input: '' }); return; }
    addCoins(EARN_PER); sfx.coin(); haptic(HAPTIC.win);
    const done = earn.done + 1;
    if (done >= EARN_ROUND) { setEarn(null); note(`Earned 🪙 ${EARN_PER * done}!`); return; }
    const lvl = useProgress.getState().arcadeLevels[arcadeUnit] ?? 1;
    setEarn({ c: makeAdaptive(arcadeUnit, lvl, 'word'), input: '', wrong: false, done });
  };

  const bgGrad = (equipped.bg && BG_GRADIENT[equipped.bg]) || 'from-slate-200 to-slate-300';

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="text-2xl font-display font-extrabold text-slate-900">🛍️ Coin Shop</h1>
        <div className="rounded-full bg-amber-100 text-amber-800 px-3 py-1.5 font-display font-extrabold tabular-nums">🪙 {coins.toLocaleString()}</div>
      </div>

      {/* shopkeeper greeter */}
      <div className="mb-3 flex items-center gap-2 rounded-3xl border-2 border-sky-200 bg-sky-50 px-3 py-2">
        <Mascot kind="clerk" size={56} expr="happy" />
        <div className="relative rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 font-display text-sm font-bold text-slate-700 shadow-sm">
          Welcome to the shop! Spend your 🪙 here — play games to earn more.
        </div>
      </div>

      {/* avatar preview */}
      <div className={`rounded-3xl p-4 bg-gradient-to-br ${bgGrad} shadow-md`}>
        <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
          {emojiOf(equipped.hat) && (
            <span className="absolute left-1/2 -translate-x-1/2 text-4xl" style={{ top: 0 }}>{emojiOf(equipped.hat)}</span>
          )}
          <Mascot kind="pet" size={120} expr="cheer" />
          {emojiOf(equipped.outfit) && (
            <span className="absolute left-1/2 -translate-x-1/2 text-3xl" style={{ bottom: 6 }}>{emojiOf(equipped.outfit)}</span>
          )}
          {emojiOf(equipped.pet) && (
            <span className="absolute text-4xl" style={{ right: -6, bottom: 0 }}>{emojiOf(equipped.pet)}</span>
          )}
        </div>
        <div className="mt-1 text-center text-xs font-display font-extrabold text-white/90 drop-shadow">Your avatar</div>
      </div>

      {/* earn coins (word problems) + always-available lessons */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={startEarn} className="min-h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
          💰 Earn coins
        </button>
        <button type="button" onClick={() => setHelp(true)} className="min-h-12 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5">
          📚 How-to lessons
        </button>
      </div>

      {flash && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-2xl bg-slate-900 text-white text-center font-display font-bold text-sm px-3 py-2">
          {flash}
        </motion.div>
      )}

      {/* tabs */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-display font-extrabold border-2 ${tab === t.key ? 'bg-fuchsia-600 border-fuchsia-700 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* grid */}
      {tab === 'games' ? (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {premiumGames.map((g) => {
            const price = PREMIUM_GAMES[g.id];
            const own = unlocked.includes(g.id);
            return (
              <div key={g.id} className="rounded-2xl border-2 border-slate-200 bg-white p-3 text-center">
                <div className="flex justify-center"><Mascot kind={gameMascot(g.id)} size={46} expr="cheer" /></div>
                <div className="font-display font-extrabold text-sm text-slate-800 mt-1">{g.name}</div>
                <div className="text-[11px] text-slate-500 line-clamp-2 min-h-8">{g.blurb}</div>
                {own ? (
                  <Link to={g.path} className="mt-2 block w-full min-h-10 leading-10 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">Play ▶</Link>
                ) : (
                  <button type="button" onClick={() => buyGame(g.id, price)} disabled={coins < price} className="mt-2 w-full min-h-10 rounded-2xl bg-fuchsia-500 disabled:opacity-40 text-white font-display font-extrabold">🔓 Unlock · 🪙{price}</button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {COSMETICS.filter((c) => c.slot === tab).map((c) => {
            const own = owned.includes(c.id);
            const on = equipped[c.slot] === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => buy(c)}
                className={`rounded-2xl border-2 p-2 text-center transition-colors ${on ? 'border-emerald-500 bg-emerald-50' : own ? 'border-slate-300 bg-white' : coins < c.price ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-slate-200 bg-white hover:border-fuchsia-300'}`}
              >
                <div className="text-3xl leading-none">{c.emoji}</div>
                <div className="text-[10px] font-display font-bold text-slate-600 truncate mt-0.5">{c.name}</div>
                <div className={`mt-1 text-[10px] font-display font-extrabold rounded-full py-0.5 ${on ? 'bg-emerald-500 text-white' : own ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'}`}>
                  {on ? 'Worn ✓' : own ? 'Wear' : `🪙 ${c.price}`}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Link to="/" className="mt-6 inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700">← Back home</Link>

      {/* earn-coins word-problem round */}
      {earn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-xs font-display font-extrabold uppercase tracking-widest text-emerald-600">💰 Earn coins · {earn.done + 1}/{EARN_ROUND}</div>
            <div className="mt-2 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-base font-display font-extrabold leading-snug break-words text-slate-800">{earn.c.prompt}</div>
            <div className={`mt-3 h-11 rounded-xl border-2 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums ${earn.wrong ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-900'}`}>
              {earn.input || (earn.wrong ? 'Try again!' : '?')}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
                <button key={k} type="button" onClick={() => setEarn((e) => (e ? { ...e, wrong: false, input: k === 'del' ? e.input.slice(0, -1) : k === '-' ? (e.input.startsWith('-') ? e.input.slice(1) : '-' + e.input) : e.input.length < 6 ? e.input + k : e.input } : e))} className="min-h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-lg text-slate-800 active:translate-y-0.5">
                  {k === 'del' ? '⌫' : k}
                </button>
              ))}
            </div>
            <button type="button" onClick={submitEarn} disabled={!earn.input.trim()} className="mt-3 w-full min-h-11 rounded-2xl bg-emerald-500 disabled:bg-slate-300 text-white font-display font-extrabold">Answer (+🪙{EARN_PER})</button>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => { setEarn(null); setHelp(true); }} className="flex-1 min-h-10 rounded-2xl bg-indigo-100 text-indigo-800 font-display font-extrabold text-sm">📚 Show me how</button>
              <button type="button" onClick={() => setEarn(null)} className="flex-1 min-h-10 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold text-sm">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* always-available how-to lesson */}
      {help && (() => {
        const lesson = pickLesson(arcadeUnit);
        if (!lesson) { setHelp(false); return null; }
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
            <LessonCard lesson={lesson} onClose={() => setHelp(false)} onStart={() => setHelp(false)} />
          </div>
        );
      })()}
    </div>
  );
}
