import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { Mascot as CharMascot, type MascotKind, type MascotExpr } from './Mascots';
import { MilestoneQuiz } from './MilestoneQuiz';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Lucky Crawl — a push-your-luck "Greedy Pig" crawler that teaches EXPECTED
// VALUE. Your hero creeps deeper into a vault: each room banks more treasure but
// the alarm gets likelier. After every room choose PUSH (go deeper, riskier) or
// BANK (lock the loot in and start fresh). A live panel shows the survival odds
// and the expected value of pushing vs banking, so the kid can SEE when the
// gamble stops being worth it. Trip the alarm and you lose the un-banked loot.

const TARGET = 50; // gold you must BANK to win
const HEROES: MascotKind[] = ['fox', 'panda', 'bunny', 'penguin', 'redpanda', 'cat'];

// reward for entering the n-th room of a run (1-based) — deeper = richer
const rewardForRoom = (n: number) => 2 + 2 * n;
// chance of surviving the n-th room — deeper = scarier (floor at 30%)
const surviveProb = (n: number) => Math.max(0.3, 0.95 - 0.1 * (n - 1));

const TILE = 76;
const GAP = 8;

export function GreedyCrawler() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };

  const [hero, setHero] = useState<MascotKind | null>(null);
  const [banked, setBanked] = useState(0);
  const [pot, setPot] = useState(0);
  const [depth, setDepth] = useState(0); // rooms entered this run
  const [rolling, setRolling] = useState(false);
  const [expr, setExpr] = useState<MascotExpr>('happy');
  const [flash, setFlash] = useState<'safe' | 'alarm' | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const nextRoom = depth + 1;
  const p = surviveProb(nextRoom);
  const nextReward = rewardForRoom(nextRoom);
  const evPush = p * (pot + nextReward);
  const pushWorthIt = evPush > pot; // expected value beats banking now
  const pct = Math.round(p * 100);

  const finish = (finalBanked: number) => {
    sfx.win();
    const xp = Math.max(2, Math.min(20, Math.round(finalBanked / 3)));
    addArcadePoints(finalBanked);
    setOutcome(recordArcadePlay('crawler', xp));
  };

  const push = () => {
    if (rolling || outcome || quizOpen) return;
    setRolling(true);
    const survived = Math.random() < p;
    // brief hop / suspense, then resolve
    window.setTimeout(() => {
      if (survived) {
        setDepth((d) => d + 1);
        setPot((g) => g + nextReward);
        setExpr('cheer');
        setFlash('safe');
        sfx.coin(); buzz(HAPTIC.pickup);
      } else {
        setPot(0);
        setDepth(0);
        setExpr('dizzy');
        setFlash('alarm');
        sfx.hurt(); buzz(HAPTIC.death);
      }
      setRolling(false);
      window.setTimeout(() => { setFlash(null); setExpr('happy'); }, 900);
    }, 520);
  };

  const bank = () => {
    if (rolling || outcome || quizOpen || pot <= 0) return;
    const total = banked + pot;
    setBanked(total);
    setPot(0);
    setDepth(0);
    setExpr('cheer');
    sfx.levelUp(); buzz(HAPTIC.win);
    if (total >= TARGET) {
      finish(total);
    } else {
      // milestone math beat before the next run
      window.setTimeout(() => setQuizOpen(true), 350);
    }
  };

  const reset = () => {
    setBanked(0);
    setPot(0);
    setDepth(0);
    setRolling(false);
    setExpr('happy');
    setFlash(null);
    setQuizOpen(false);
    setOutcome(null);
  };

  // ── end card ──
  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Lucky Crawl" emoji="🎲" />
        <ArcadeEndCard
          gameId="crawler"
          outcome={outcome}
          win={banked >= TARGET}
          scoreLine={`You banked ${banked} gold! 💰`}
          onReplay={() => { reset(); setHero(null); }}
        />
      </div>
    );
  }

  // ── hero picker ──
  if (!hero) {
    return (
      <div>
        <ArcadeHeader title="Lucky Crawl" emoji="🎲" gameId="crawler" />
        <p className="mx-auto mb-3 max-w-sm text-center text-sm font-display font-bold text-slate-600">
          Pick your treasure hunter, then push your luck deeper into the vault — but bank your gold before the alarm!
        </p>
        <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
          {HEROES.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setHero(k)}
              className="rounded-2xl border-2 border-slate-200 bg-white p-3 text-center hover:border-amber-400 active:translate-y-0.5"
            >
              <CharMascot kind={k} size={56} expr="happy" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── milestone word problem (after banking) ──
  if (quizOpen) {
    return (
      <div>
        <ArcadeHeader title="Lucky Crawl" emoji="🎲" gameId="crawler" />
        <div className="mx-auto max-w-sm text-center">
          <div className="mb-2 rounded-2xl bg-amber-50 border-2 border-amber-200 px-4 py-2 font-display font-extrabold text-amber-800">
            💰 Banked {banked} / {TARGET} gold — solve for a bonus!
          </div>
          <MilestoneQuiz onDone={() => setQuizOpen(false)} len="word" label="🧮 Vault puzzle — solve for coins!" />
        </div>
      </div>
    );
  }

  // visible room strip: entrance (0), entered rooms (1..depth), next mystery room
  const tiles: number[] = [];
  for (let i = 0; i <= depth + 1; i++) tiles.push(i);
  const shift = Math.max(0, depth - 2) * (TILE + GAP);

  return (
    <div>
      <ArcadeHeader title="Lucky Crawl" emoji="🎲" gameId="crawler" />

      {/* totals */}
      <div className="mx-auto mb-2 flex max-w-sm items-center justify-between px-1 font-display font-extrabold">
        <span className="text-amber-600">🏦 Banked {banked}/{TARGET}</span>
        <span className="text-emerald-600">💰 Pot {pot}</span>
      </div>
      {/* progress to target */}
      <div className="mx-auto mb-3 h-2 max-w-sm overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-[width] duration-500" style={{ width: `${Math.min(100, (banked / TARGET) * 100)}%` }} />
      </div>

      {/* the vault corridor */}
      <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border-2 border-slate-800 bg-gradient-to-b from-slate-800 to-slate-900 p-3">
        <div className="relative h-[120px]">
          <motion.div className="absolute left-0 top-0 flex items-end" style={{ gap: GAP }} animate={{ x: -shift }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            {tiles.map((i) => {
              const isEntrance = i === 0;
              const isNext = i === depth + 1;
              const isHere = i === depth;
              return (
                <div
                  key={i}
                  className={
                    'flex flex-col items-center justify-end rounded-xl border-2 pb-1 ' +
                    (isNext ? 'border-rose-400 bg-rose-500/10' : isHere ? 'border-amber-300 bg-amber-400/10' : 'border-slate-600 bg-slate-700/40')
                  }
                  style={{ width: TILE, height: 96 }}
                >
                  {isEntrance ? (
                    <div className="text-3xl">🚪</div>
                  ) : isNext ? (
                    <>
                      <div className="text-2xl">❓</div>
                      <div className="text-[10px] font-mono font-bold text-rose-300">{pct}% safe</div>
                      <div className="text-[10px] font-mono font-bold text-emerald-300">+{nextReward}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl">💰</div>
                      <div className="text-[10px] font-mono font-bold text-amber-200">+{rewardForRoom(i)}</div>
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* hero hops along the corridor, sitting on the current tile */}
          <motion.div
            className="absolute bottom-1"
            animate={{ left: depth * (TILE + GAP) - shift + (TILE - 52) / 2, y: rolling ? -14 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <CharMascot kind={hero} size={52} expr={expr} />
          </motion.div>

          <AnimatePresence>
            {flash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={'absolute inset-x-0 top-1 text-center font-display font-extrabold ' + (flash === 'alarm' ? 'text-rose-400' : 'text-emerald-300')}
              >
                {flash === 'alarm' ? '🚨 ALARM! Pot lost!' : '✨ Safe! Loot grabbed'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* the EV math — made visible */}
      <div className="mx-auto mt-3 max-w-sm rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-3 text-sm">
        <div className="font-display font-extrabold text-indigo-800">Should you push? Compare the math:</div>
        <div className="mt-1.5 grid grid-cols-2 gap-2 font-mono">
          <div className={'rounded-xl border-2 p-2 ' + (pushWorthIt ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white')}>
            <div className="text-[11px] font-bold text-slate-500">PUSH (expected)</div>
            <div className="text-[11px] text-slate-700">{pct}% × ({pot}+{nextReward})</div>
            <div className="text-lg font-extrabold text-slate-900">≈ {evPush.toFixed(1)}</div>
          </div>
          <div className={'rounded-xl border-2 p-2 ' + (!pushWorthIt ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white')}>
            <div className="text-[11px] font-bold text-slate-500">BANK (sure thing)</div>
            <div className="text-[11px] text-slate-700">keep the pot</div>
            <div className="text-lg font-extrabold text-slate-900">= {pot}</div>
          </div>
        </div>
        <div className="mt-1.5 text-center text-xs font-display font-bold text-indigo-600">
          {pot === 0
            ? 'Free first room — push on!'
            : pushWorthIt
              ? '➕ Expected value favors PUSHING'
              : '🏦 Expected value favors BANKING'}
        </div>
      </div>

      {/* actions */}
      <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-3">
        <button
          type="button"
          onClick={push}
          disabled={rolling}
          className="rounded-2xl bg-rose-500 py-4 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:opacity-50"
        >
          🎲 Push deeper
        </button>
        <button
          type="button"
          onClick={bank}
          disabled={rolling || pot <= 0}
          className="rounded-2xl bg-emerald-500 py-4 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 disabled:opacity-50"
        >
          🏦 Bank {pot > 0 ? pot : ''}
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-sm text-center text-xs text-slate-400">
        Bank {TARGET} gold to win. Each room deeper pays more but the alarm grows — bank before the odds turn against you!
      </p>
    </div>
  );
}
