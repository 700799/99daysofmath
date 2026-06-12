import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MathText } from './MathText';
import { Icon } from '../icons/Icon';

interface Props {
  text: string;
  onReveal?: () => void;
}

export function Hint({ text, onReveal }: Props) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    if (!open) onReveal?.();
    setOpen((v) => !v);
  };
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClick}
        className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-display font-bold text-sm transition-colors"
      >
        <Icon name="bulb" size={18} />
        <span>{open ? 'Hide hint' : 'Show hint'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="hint-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-slate-800">
              <MathText text={text} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
