import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, ARCADE_UNIT_LABELS, type ArcadeUnit } from '../../state/progress';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// A celebratory splash that pops every time the student levels up a unit: a
// mighty dragon 🐉 or robot 🤖 that gains a cute hair bow, armor, a sword, and a
// crown as the level climbs. Mounted once app-wide; it watches the per-unit
// adaptive levels and fires on every increase.

const AVATAR: Record<ArcadeUnit, string> = { '6.RP': '🐉', mixed: '🐉', '6.NS': '🤖', '6.EE': '🤖' };
// gear earned at levels 2, 3, 4, 5
const GEAR = ['🎀', '🛡️', '⚔️', '👑'];
const GEAR_NAME = ['a cute hair bow 🎀', 'shiny armor 🛡️', 'a mighty sword ⚔️', 'a golden crown 👑'];
const CONFETTI = ['🎉', '⭐', '✨', '🌟', '🎊', '💛', '🏆', '💎'];

export function MasteryCelebration() {
  const levels = useProgress((s) => s.arcadeLevels);
  const prevRef = useRef<Record<string, number> | null>(null);
  const [queue, setQueue] = useState<{ unit: ArcadeUnit; level: number }[]>([]);
  const [cur, setCur] = useState<{ unit: ArcadeUnit; level: number } | null>(null);

  // Detect level-ups (ignore the first render and any resets/decreases).
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = { ...levels };
    if (!prev) return;
    const ups: { unit: ArcadeUnit; level: number }[] = [];
    (Object.keys(levels) as ArcadeUnit[]).forEach((u) => {
      if ((levels[u] ?? 1) > (prev[u] ?? 1)) ups.push({ unit: u, level: levels[u] });
    });
    if (ups.length) setQueue((q) => [...q, ...ups]);
  }, [levels]);

  // Show queued celebrations one at a time.
  useEffect(() => {
    if (cur || queue.length === 0) return;
    setCur(queue[0]);
    setQueue((q) => q.slice(1));
    sfx.win();
    haptic(HAPTIC.win);
    const id = window.setTimeout(() => setCur(null), 3400);
    return () => window.clearTimeout(id);
  }, [cur, queue]);

  const avatar = cur ? AVATAR[cur.unit] : '🐉';
  const earned = cur ? GEAR.slice(0, Math.max(0, cur.level - 1)) : [];
  const newestIdx = cur ? cur.level - 2 : -1;

  return (
    <AnimatePresence>
      {cur && (
        <motion.div
          key={`${cur.unit}-${cur.level}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCur(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
        >
          {/* confetti */}
          {CONFETTI.map((e, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl select-none"
              initial={{ x: `${8 + i * 11}vw`, y: '110vh', rotate: 0, opacity: 1 }}
              animate={{ y: '-15vh', rotate: (i % 2 ? 1 : -1) * 240, opacity: [1, 1, 0] }}
              transition={{ duration: 1.8 + i * 0.12, ease: 'easeOut' }}
            >
              {e}
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0.7, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
            className="relative w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl"
          >
            <div className="text-xs font-display font-extrabold uppercase tracking-widest text-amber-500">
              ⭐ Level Up! ⭐
            </div>

            {/* avatar gaining gear */}
            <div className="relative mx-auto mt-3 h-28 w-28">
              {cur.level >= 2 && (
                <motion.div
                  initial={{ scale: 0, y: -6 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 300 }}
                  className="absolute left-1/2 -top-1 -translate-x-1/2 text-3xl"
                >
                  {cur.level >= 5 ? '👑' : '🎀'}
                </motion.div>
              )}
              <motion.div
                animate={{ rotate: [0, -6, 6, -3, 0], y: [0, -8, 0] }}
                transition={{ duration: 0.9 }}
                className="absolute inset-0 flex items-center justify-center text-7xl drop-shadow"
              >
                {avatar}
              </motion.div>
            </div>

            <div className="mt-3 font-display font-extrabold text-xl text-slate-900">
              {ARCADE_UNIT_LABELS[cur.unit]}
            </div>
            <div className="font-display font-extrabold text-3xl text-indigo-600 tabular-nums">Level {cur.level}</div>

            {newestIdx >= 0 && newestIdx < GEAR_NAME.length && (
              <div className="mt-1 text-sm font-display font-bold text-slate-600">
                Your {avatar === '🐉' ? 'dragon' : 'robot'} earned {GEAR_NAME[newestIdx]}!
              </div>
            )}

            {/* earned gear row */}
            <div className="mt-3 flex justify-center gap-2">
              {earned.map((g, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: i === newestIdx ? 0 : 1 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i === newestIdx ? 0.35 : 0, type: 'spring', stiffness: 320 }}
                  className={`text-2xl ${i === newestIdx ? '' : 'opacity-70'}`}
                >
                  {g}
                </motion.span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCur(null)}
              className="mt-4 w-full min-h-11 rounded-2xl bg-emerald-500 text-white font-display font-extrabold"
            >
              Keep going ▶
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
