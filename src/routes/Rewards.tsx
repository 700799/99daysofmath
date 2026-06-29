import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, ARCADE_UNITS } from '../state/progress';
import { Mascot, gameMascot } from './arcade/Mascots';
import { ARCADE_GAMES } from './arcade/shared';
import { COSMETICS, BG_GRADIENT, emojiOf } from './Shop';
import { STICKER_DEFS } from '../utils/encouragement';
import { sfx } from '../utils/arcadeAV';

// My Collection — a drawer/trophy-case page. Shows a big zoomed-in kawaii avatar
// (your equipped character) plus galleries of the cool rewards & power-ups you've
// earned: champion power-ups, owned cosmetics, unlocked games, and stickers. Tap
// any item to zoom it in.

// Champion power-ups earned by leveling up arcade mastery (matches the cinematic gear).
const POWERUPS = [
  { lvl: 2, emoji: '🎀', name: 'Hair Bow', blurb: 'Reach Level 2 in any unit' },
  { lvl: 3, emoji: '🛡️', name: 'Shiny Armor', blurb: 'Reach Level 3 in any unit' },
  { lvl: 4, emoji: '⚔️', name: 'Mighty Sword', blurb: 'Reach Level 4 in any unit' },
  { lvl: 5, emoji: '👑', name: 'Champion Crown', blurb: 'Reach Level 5 in any unit' },
];

type Zoom = { emoji?: string; mascot?: boolean; name: string; blurb?: string };

export function Rewards() {
  const equipped = useProgress((s) => s.equipped);
  const owned = useProgress((s) => s.ownedCosmetics);
  const unlocked = useProgress((s) => s.unlockedGames);
  const stickers = useProgress((s) => s.stickers);
  const levels = useProgress((s) => s.arcadeLevels);
  const coins = useProgress((s) => s.coins);
  const [zoom, setZoom] = useState<Zoom | null>(null);

  const open = (z: Zoom) => { setZoom(z); sfx.pickup(); };

  const maxLevel = Math.max(1, ...ARCADE_UNITS.map((u) => levels[u] ?? 1));
  const bgGrad = (equipped.bg && BG_GRADIENT[equipped.bg]) || 'from-fuchsia-300 to-violet-400';
  const ownedCosmetics = COSMETICS.filter((c) => owned.includes(c.id));
  const unlockedGameDefs = ARCADE_GAMES.filter((g) => unlocked.includes(g.id));
  const earnedStickers = STICKER_DEFS.filter((s) => stickers.includes(s.id));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="text-2xl font-display font-extrabold text-slate-900">🏆 My Collection</h1>
        <div className="rounded-full bg-amber-100 text-amber-800 px-3 py-1.5 font-display font-extrabold tabular-nums">🪙 {coins.toLocaleString()}</div>
      </div>

      {/* zoomed-in kawaii avatar */}
      <button
        type="button"
        onClick={() => open({ mascot: true, name: 'Your Avatar', blurb: 'Tap items below to zoom in!' })}
        className={`w-full rounded-3xl p-5 bg-gradient-to-br ${bgGrad} shadow-md`}
      >
        <motion.div
          className="relative mx-auto w-44 h-44 flex items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emojiOf(equipped.hat) && <span className="absolute left-1/2 -translate-x-1/2 text-5xl" style={{ top: -6 }}>{emojiOf(equipped.hat)}</span>}
          <Mascot kind="pet" size={140} expr="cheer" />
          {emojiOf(equipped.outfit) && <span className="absolute left-1/2 -translate-x-1/2 text-4xl" style={{ bottom: 8 }}>{emojiOf(equipped.outfit)}</span>}
          {emojiOf(equipped.pet) && <span className="absolute text-5xl" style={{ right: -8, bottom: 0 }}>{emojiOf(equipped.pet)}</span>}
        </motion.div>
        <div className="mt-1 text-center text-xs font-display font-extrabold text-white/90 drop-shadow">Tap to zoom in ✨</div>
      </button>

      {/* power-ups */}
      <Section title="⚡ Power-ups" subtitle={`Champion gear · best level ${maxLevel}/5`}>
        {POWERUPS.map((p) => {
          const earned = maxLevel >= p.lvl;
          return (
            <Tile key={p.name} locked={!earned} onClick={() => earned && open({ emoji: p.emoji, name: p.name, blurb: p.blurb })}>
              <div className="text-3xl">{earned ? p.emoji : '🔒'}</div>
              <div className="text-[10px] font-display font-bold text-slate-600 truncate mt-0.5">{earned ? p.name : `Lv ${p.lvl}`}</div>
            </Tile>
          );
        })}
      </Section>

      {/* cosmetics */}
      <Section title="👗 Wardrobe" subtitle={`${ownedCosmetics.length} owned`}>
        {ownedCosmetics.length === 0 && <Empty>Buy outfits in the 🛍️ Shop!</Empty>}
        {ownedCosmetics.map((c) => (
          <Tile key={c.id} onClick={() => open({ emoji: c.emoji, name: c.name })}>
            <div className="text-3xl">{c.emoji}</div>
            <div className="text-[10px] font-display font-bold text-slate-600 truncate mt-0.5">{c.name}</div>
          </Tile>
        ))}
      </Section>

      {/* unlocked games */}
      <Section title="🎮 Unlocked games" subtitle={`${unlockedGameDefs.length} unlocked`}>
        {unlockedGameDefs.length === 0 && <Empty>Unlock premium games in the 🛍️ Shop!</Empty>}
        {unlockedGameDefs.map((g) => (
          <Tile key={g.id} onClick={() => open({ emoji: g.emoji, name: g.name, blurb: g.blurb })}>
            <Mascot kind={gameMascot(g.id)} size={34} expr="cheer" />
            <div className="text-[10px] font-display font-bold text-slate-600 truncate mt-0.5">{g.name}</div>
          </Tile>
        ))}
      </Section>

      {/* stickers */}
      <Section title="⭐ Stickers" subtitle={`${earnedStickers.length} / ${STICKER_DEFS.length}`}>
        {earnedStickers.length === 0 && <Empty>Earn stickers by learning & playing!</Empty>}
        {earnedStickers.map((s) => (
          <Tile key={s.id} onClick={() => open({ emoji: s.emoji, name: s.label })}>
            <div className="text-3xl">{s.emoji}</div>
            <div className="text-[10px] font-display font-bold text-slate-600 truncate mt-0.5">{s.label}</div>
          </Tile>
        ))}
      </Section>

      <Link to="/" className="mt-6 inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700">← Back home</Link>

      {/* zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
            style={{ background: 'radial-gradient(circle at 50% 45%, rgba(217,70,239,0.55), rgba(15,23,42,0.92))' }}
          >
            <motion.div initial={{ scale: 0.4, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 14 }} className="drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]">
              {zoom.mascot ? <Mascot kind="pet" size={220} expr="cheer" /> : <div style={{ fontSize: 150 }}>{zoom.emoji}</div>}
            </motion.div>
            <div className="mt-4 font-display font-extrabold text-3xl text-white drop-shadow text-center">{zoom.name}</div>
            {zoom.blurb && <div className="mt-1 font-display font-bold text-white/85 text-center">{zoom.blurb}</div>}
            <div className="mt-6 text-xs font-display font-bold text-white/70">tap anywhere to close</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <div className="font-display font-extrabold text-slate-900">{title}</div>
        {subtitle && <div className="text-[11px] font-display font-bold text-slate-400">{subtitle}</div>}
      </div>
      <div className="mt-2 grid grid-cols-4 sm:grid-cols-5 gap-2">{children}</div>
    </div>
  );
}

function Tile({ children, onClick, locked }: { children: React.ReactNode; onClick?: () => void; locked?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 p-2 text-center flex flex-col items-center justify-center min-h-16 ${locked ? 'border-slate-200 bg-slate-50 opacity-70' : 'border-slate-200 bg-white hover:border-fuchsia-300 active:translate-y-0.5'}`}
    >
      {children}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="col-span-4 sm:col-span-5 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 p-4 text-center text-xs font-display font-bold text-slate-400">{children}</div>;
}
