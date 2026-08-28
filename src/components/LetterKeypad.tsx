import { motion } from 'framer-motion';

export type KeyStatus = 'correct' | 'present' | 'absent';

interface Props {
  onKey: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  statuses?: Record<string, KeyStatus>;
}

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

const base =
  'flex-1 min-h-12 rounded-lg font-display font-extrabold text-sm uppercase shadow-[0_2px_0_0_rgba(0,0,0,0.15)] active:translate-y-0.5 transition-all touch-none select-none';

function tint(s?: KeyStatus): string {
  if (s === 'correct') return 'bg-emerald-500 text-white border-emerald-600';
  if (s === 'present') return 'bg-amber-400 text-white border-amber-500';
  if (s === 'absent') return 'bg-slate-400 text-white border-slate-500';
  return 'bg-surface text-ink border-line hover:bg-surface-2';
}

// On-screen QWERTY keyboard for the Word Guess game. Keys tint by their best
// known status (green/yellow/gray) just like the board.
export function LetterKeypad({ onKey, onEnter, onBackspace, statuses = {} }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-1.5 max-w-md mx-auto">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 justify-center">
          {ri === 2 && (
            <button type="button" onClick={onEnter} className={`${base} border-2 px-2 bg-sky-500 text-white border-sky-600 grow-[1.5]`}>
              Enter
            </button>
          )}
          {row.split('').map((k) => (
            <button key={k} type="button" onClick={() => onKey(k)} className={`${base} border-2 ${tint(statuses[k])}`}>
              {k}
            </button>
          ))}
          {ri === 2 && (
            <button type="button" onClick={onBackspace} aria-label="Backspace" className={`${base} border-2 px-2 bg-warn-soft text-warn border-warn/40 grow-[1.5]`}>
              ⌫
            </button>
          )}
        </div>
      ))}
    </motion.div>
  );
}
