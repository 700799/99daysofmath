import { motion } from 'framer-motion';

interface Props {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  showFraction?: boolean;
  showNegative?: boolean;
}

const buttonClass =
  'min-h-12 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 border-2 border-slate-200 shadow-[0_3px_0_0_rgba(0,0,0,0.08)] active:shadow-[0_1px_0_0_rgba(0,0,0,0.08)] active:translate-y-0.5 font-display font-extrabold text-xl text-slate-900 transition-all touch-none select-none';

export function NumberKeypad({
  onKey,
  onBackspace,
  onClear,
  showFraction = true,
  showNegative = true,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 grid grid-cols-4 gap-2"
    >
      {['1', '2', '3'].map((k) => (
        <button key={k} type="button" onClick={() => onKey(k)} className={buttonClass}>
          {k}
        </button>
      ))}
      <button
        type="button"
        onClick={onBackspace}
        aria-label="Backspace"
        className={`${buttonClass} bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900`}
      >
        ⌫
      </button>

      {['4', '5', '6'].map((k) => (
        <button key={k} type="button" onClick={() => onKey(k)} className={buttonClass}>
          {k}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onKey('/')}
        className={`${buttonClass} ${showFraction ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900' : 'opacity-30 pointer-events-none'}`}
      >
        /
      </button>

      {['7', '8', '9'].map((k) => (
        <button key={k} type="button" onClick={() => onKey(k)} className={buttonClass}>
          {k}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear all"
        className={`${buttonClass} bg-red-50 hover:bg-red-100 border-red-200 text-red-900 text-sm`}
      >
        Clear
      </button>

      <button
        type="button"
        onClick={() => onKey('-')}
        className={`${buttonClass} ${showNegative ? '' : 'opacity-30 pointer-events-none'}`}
      >
        −
      </button>
      <button type="button" onClick={() => onKey('0')} className={buttonClass}>
        0
      </button>
      <button type="button" onClick={() => onKey('.')} className={buttonClass}>
        .
      </button>
      <button
        type="button"
        onClick={() => onKey(' ')}
        aria-label="Space (for mixed numbers)"
        className={`${buttonClass} text-sm`}
      >
        ␣
      </button>
    </motion.div>
  );
}
