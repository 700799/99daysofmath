import { motion } from 'framer-motion';

interface Props {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  showFraction?: boolean;
  showNegative?: boolean;
}

const buttonClass =
  'min-h-12 rounded-2xl bg-surface hover:bg-surface-2 active:bg-surface-2 border-2 border-line shadow-[0_3px_0_0_rgba(0,0,0,0.08)] active:shadow-[0_1px_0_0_rgba(0,0,0,0.08)] active:translate-y-0.5 font-display font-extrabold text-xl text-ink transition-all touch-none select-none';

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
        className={`${buttonClass} bg-warn-soft hover:bg-warn-soft border-warn/40 text-warn`}
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
        className={`${buttonClass} ${showFraction ? 'bg-accent-soft hover:bg-accent-soft border-accent/35 text-accent' : 'opacity-30 pointer-events-none'}`}
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
        className={`${buttonClass} bg-bad-soft hover:bg-bad-soft border-bad/40 text-bad text-sm`}
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
