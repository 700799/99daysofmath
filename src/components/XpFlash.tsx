import { AnimatePresence, motion } from 'framer-motion';
import { useXpFlash } from '../state/xpFlash';

/**
 * Renders the XP-flash queue from `useXpFlash`. Each item is a pill that
 * pops in (~150 ms) and fades after ~0.6 s — fast, joyful feedback without
 * blocking. Stack vertically so multiple grants don't overlap.
 */
export function XpFlash() {
  const queue = useXpFlash((s) => s.queue);

  return (
    <div
      className="fixed inset-x-0 top-20 z-[80] flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {queue.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: 12, scale: 0.7, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 480, damping: 22 }}
            className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-display font-extrabold text-base px-4 py-2 shadow-lg border-2 border-white"
          >
            ⚡ +{item.amount} XP
            {item.label && <span className="ml-1.5 opacity-90 text-sm font-bold">· {item.label}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
