import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, ARCADE_UNIT_LABELS, type ArcadeUnit } from '../../state/progress';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';
import { Mascot, type MascotKind } from './Mascots';

// A full celebratory cinematic that fires on every level-up (and reward): the
// unit's champion — a mighty dragon 🐉, robot 🤖, frog 🐸, or pocket-pet 🐣 —
// gains a cute hair bow, armor, a sword, and a crown as it climbs, then withstands
// a barrage of exploding missiles behind a shield, does a cartwheel, and earns a
// medal + trophy. More armor (higher level) = survives more and becomes the champ.
// Characters are original (generic emoji, not trademarked mascots).

const CHAMPIONS: Record<ArcadeUnit, { kind: MascotKind; name: string; word: string }> = {
  '6.RP': { kind: 'frog', name: 'Hopper', word: 'frog' },
  '6.NS': { kind: 'robot', name: 'Mech', word: 'robot' },
  '6.EE': { kind: 'dragon', name: 'Drake', word: 'dragon' },
  mixed: { kind: 'pet', name: 'Pip', word: 'chick' },
};
// gear earned at levels 2, 3, 4, 5
const GEAR = ['🎀', '🛡️', '⚔️', '👑'];
const GEAR_NAME = ['a cute hair bow 🎀', 'shiny armor 🛡️', 'a mighty sword ⚔️', 'a golden crown 👑'];
const CONFETTI = ['🎉', '⭐', '✨', '🌟', '🎊', '💛', '🏆', '💎', '🎈', '🥇'];

type Cele = { unit: ArcadeUnit; level: number; kind: 'levelup' | 'reward'; key: number };

export function MasteryCelebration() {
  const levels = useProgress((s) => s.arcadeLevels);
  const celebrateTick = useProgress((s) => s.arcadeCelebrate ?? 0);
  const unit = useProgress((s) => s.arcadeUnit);
  const prevRef = useRef<Record<string, number> | null>(null);
  const prevTickRef = useRef<number | null>(null);
  const keyRef = useRef(1);
  const [queue, setQueue] = useState<Cele[]>([]);
  const [cur, setCur] = useState<Cele | null>(null);
  const [phase, setPhase] = useState<'barrage' | 'win'>('barrage');

  // Level-ups.
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = { ...levels };
    if (!prev) return;
    const ups: Cele[] = [];
    (Object.keys(levels) as ArcadeUnit[]).forEach((u) => {
      if ((levels[u] ?? 1) > (prev[u] ?? 1)) ups.push({ unit: u, level: levels[u], kind: 'levelup', key: keyRef.current++ });
    });
    if (ups.length) setQueue((q) => [...q, ...ups]);
  }, [levels]);

  // Reward pulses.
  useEffect(() => {
    const prev = prevTickRef.current;
    prevTickRef.current = celebrateTick;
    if (prev === null || celebrateTick <= prev) return;
    setQueue((q) => [...q, { unit, level: levels[unit] ?? 1, kind: 'reward', key: keyRef.current++ }]);
  }, [celebrateTick, unit, levels]);

  // Show queued celebrations one at a time, with a barrage → win sequence.
  useEffect(() => {
    if (cur || queue.length === 0) return;
    const next = queue[0];
    setQueue((q) => q.slice(1));
    setCur(next);
    setPhase('barrage');
    sfx.explode();
    haptic(HAPTIC.heavy);
    const toWin = window.setTimeout(() => { setPhase('win'); sfx.win(); haptic(HAPTIC.win); }, 1700);
    const done = window.setTimeout(() => setCur(null), 4200);
    return () => { window.clearTimeout(toWin); window.clearTimeout(done); };
  }, [cur, queue]);

  const champ = cur ? CHAMPIONS[cur.unit] : CHAMPIONS.mixed;
  const earned = cur ? GEAR.slice(0, Math.max(0, cur.level - 1)) : [];
  const newestIdx = cur ? cur.level - 2 : -1;
  const missileCount = cur ? 3 + cur.level * 2 : 6;
  const strong = (cur?.level ?? 1) >= 3;

  // Fixed missile start vectors per celebration (don't re-randomize on re-render).
  const missiles = useMemo(() => {
    void cur?.key;
    return Array.from({ length: missileCount }, (_, i) => {
      const ang = (i / missileCount) * Math.PI * 2 + 0.4;
      return { sx: Math.cos(ang) * 60, sy: Math.sin(ang) * 60, delay: 0.15 + i * 0.11 };
    });
  }, [cur?.key, missileCount]);

  return (
    <AnimatePresence>
      {cur && (
        <motion.div
          key={cur.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCur(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: 'radial-gradient(circle at 50% 45%, rgba(79,70,229,0.55), rgba(15,23,42,0.92))' }}
        >
          {/* confetti (win phase) */}
          {phase === 'win' && CONFETTI.map((e, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl select-none"
              initial={{ x: `${6 + i * 9}vw`, y: '110vh', rotate: 0, opacity: 1 }}
              animate={{ y: '-15vh', rotate: (i % 2 ? 1 : -1) * 260, opacity: [1, 1, 0] }}
              transition={{ duration: 1.7 + i * 0.1, ease: 'easeOut' }}
            >
              {e}
            </motion.div>
          ))}

          <motion.div
            // brief screen-shake while missiles land
            animate={phase === 'barrage' ? { x: [0, -6, 6, -4, 4, 0], y: [0, 4, -4, 3, 0] } : { x: 0, y: 0 }}
            transition={{ duration: 0.5, repeat: phase === 'barrage' ? 2 : 0 }}
            className="relative w-full max-w-xs rounded-3xl bg-white/95 p-6 text-center shadow-2xl"
          >
            <div className="text-xs font-display font-extrabold uppercase tracking-widest text-amber-500">
              {cur.kind === 'reward' ? '🎁 Reward!' : '⭐ Level Up! ⭐'}
            </div>

            {/* champion arena */}
            <div className="relative mx-auto mt-3 h-36 w-36">
              {/* shield bubble — pulses, blocks the missiles */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.18), rgba(56,189,248,0.06) 60%, transparent 70%)', border: '2px solid rgba(56,189,248,0.5)' }}
                animate={phase === 'barrage' ? { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] } : { scale: 1.05, opacity: 0.5 }}
                transition={{ duration: 0.45, repeat: phase === 'barrage' ? Infinity : 0 }}
              />

              {/* crown / bow on top */}
              {cur.level >= 2 && (
                <motion.div
                  initial={{ scale: 0, y: -8 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: phase === 'win' ? 0.2 : 0, type: 'spring', stiffness: 300 }}
                  className="absolute left-1/2 -top-2 -translate-x-1/2 text-3xl z-10"
                >
                  {cur.level >= 5 ? '👑' : '🎀'}
                </motion.div>
              )}

              {/* champion — cartwheels on win */}
              <motion.div
                animate={
                  phase === 'win'
                    ? { rotate: [0, 360], x: [0, -34, 34, 0], y: [0, -16, -16, 0], scale: [1, 1.05, 1.05, 1] }
                    : { y: [0, -6, 0] }
                }
                transition={phase === 'win' ? { duration: 0.9, delay: 0.15 } : { duration: 0.7, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)]"
              >
                <Mascot kind={champ.kind} size={104} />
              </motion.div>

              {/* missiles fly in + explode (barrage phase) */}
              {phase === 'barrage' && missiles.map((m, i) => (
                <div key={i} className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-2xl"
                    initial={{ x: `${m.sx}vw`, y: `${m.sy}vh`, opacity: 0, rotate: 45 }}
                    animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], rotate: 45 }}
                    transition={{ duration: 0.5, delay: m.delay, ease: 'easeIn' }}
                  >
                    🚀
                  </motion.div>
                  <motion.div
                    className="absolute text-3xl"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.4, delay: m.delay + 0.42 }}
                  >
                    💥
                  </motion.div>
                </div>
              ))}

              {/* medal + trophy pop in on win */}
              {phase === 'win' && (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 300 }} className="absolute -left-2 bottom-0 text-3xl">🏅</motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.05, type: 'spring', stiffness: 300 }} className="absolute -right-2 bottom-0 text-3xl">🏆</motion.div>
                </>
              )}
            </div>

            <div className="mt-3 font-display font-extrabold text-xl text-slate-900">{ARCADE_UNIT_LABELS[cur.unit]}</div>
            <div className="font-display font-extrabold text-3xl text-indigo-600 tabular-nums">
              {phase === 'win' && strong ? 'CHAMPION! 🏆' : `Level ${cur.level}`}
            </div>

            {cur.kind === 'levelup' && newestIdx >= 0 && newestIdx < GEAR_NAME.length && (
              <div className="mt-1 text-sm font-display font-bold text-slate-600">
                {champ.name} the {champ.word} earned {GEAR_NAME[newestIdx]}!
              </div>
            )}
            <div className="mt-1 text-xs font-display font-bold text-slate-500">
              {strong ? 'Armor held — withstood the whole barrage! 🛡️' : 'Barely survived — win more for stronger armor!'}
            </div>

            {/* earned gear row */}
            <div className="mt-3 flex justify-center gap-2">
              {earned.map((g, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: i === newestIdx ? 0 : 1 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i === newestIdx ? 1.0 : 0, type: 'spring', stiffness: 320 }}
                  className={`text-2xl ${i === newestIdx ? '' : 'opacity-70'}`}
                >
                  {g}
                </motion.span>
              ))}
            </div>

            <button type="button" onClick={() => setCur(null)} className="mt-4 w-full min-h-11 rounded-2xl bg-emerald-500 text-white font-display font-extrabold">
              Keep going ▶
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
