import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot } from './Mascot';
import { Confetti } from './Celebration';
import { stickerById } from '../utils/encouragement';

interface Props {
  stickerIds: string[];
  onDone: () => void;
}

// Fullscreen celebratory modal that reveals earned stickers one at a time.
export function StickerCelebration({ stickerIds, onDone }: Props) {
  const [i, setI] = useState(0);
  const defs = stickerIds.map(stickerById).filter((d): d is NonNullable<typeof d> => !!d);

  if (defs.length === 0) {
    // Nothing displayable — finish immediately.
    onDone();
    return null;
  }

  const def = defs[Math.min(i, defs.length - 1)];
  const next = () => {
    if (i + 1 < defs.length) setI(i + 1);
    else onDone();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="sticker-celebration"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-6"
        onClick={next}
        role="dialog"
        aria-label="New sticker earned"
      >
        <Confetti count={32} />
        <motion.div
          key={def.id}
          initial={{ scale: 0.6, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
          className="bg-white rounded-3xl px-8 py-8 text-center max-w-xs w-full shadow-2xl"
        >
          <div className="flex justify-center">
            <Mascot mood="proud" size={96} oneShot />
          </div>
          <div className="text-xs font-display font-extrabold uppercase tracking-wider text-pink-600 mt-2">
            New sticker!
          </div>
          <div className="text-6xl mt-3">{def.emoji}</div>
          <div className="text-xl font-display font-extrabold text-slate-900 mt-2">
            {def.label}
          </div>
          {def.hint && <div className="text-sm text-slate-500 mt-1">{def.hint}</div>}
          {defs.length > 1 && (
            <div className="text-xs text-slate-400 mt-3 font-display font-bold">
              {i + 1} / {defs.length}
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="mt-5 w-full min-h-12 px-6 py-2.5 rounded-2xl bg-duo-green hover:bg-duo-green-dark text-white font-display font-extrabold shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all"
          >
            {i + 1 < defs.length ? 'Next' : 'Awesome!'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
