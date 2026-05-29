import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { isChallengeCorrect, type Challenge } from '../rewards/mathChallenge';

interface Props {
  challenge: Challenge;
  /** Called once with whether the player answered correctly (or timed out). */
  onResolve: (correct: boolean) => void;
  /** Accent color (hex) to theme the prompt + button. */
  accent: string;
  /** Optional countdown; when it elapses the answer auto-submits as wrong. */
  timeLimitMs?: number;
  /** Short label above the prompt, e.g. "Math tile!" or "Speed boost!". */
  title?: string;
}

/**
 * A focused, keyboard-friendly arithmetic prompt overlaid on a reward game.
 * Using a real HTML input (instead of drawing one in Phaser) keeps typing fast
 * and accessible on phones and with screen readers.
 */
export function ChallengeModal({
  challenge,
  onResolve,
  accent,
  timeLimitMs,
  title = 'Quick math!',
}: Props) {
  const [value, setValue] = useState('');
  const [remaining, setRemaining] = useState(timeLimitMs ?? 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedRef = useRef(false);

  const resolve = (correct: boolean) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    onResolve(correct);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!timeLimitMs) return;
    const start = Date.now();
    const id = window.setInterval(() => {
      const left = timeLimitMs - (Date.now() - start);
      if (left <= 0) {
        window.clearInterval(id);
        setRemaining(0);
        resolve(false);
      } else {
        setRemaining(left);
      }
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimitMs]);

  const submit = () => resolve(isChallengeCorrect(value, challenge));

  const pct = timeLimitMs ? Math.max(0, Math.min(100, (remaining / timeLimitMs) * 100)) : 0;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm rounded-3xl p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="w-full max-w-xs bg-white rounded-3xl shadow-xl p-5 text-center"
        role="dialog"
        aria-modal="true"
        aria-label="Math challenge"
      >
        <div
          className="text-xs font-display font-extrabold uppercase tracking-wider"
          style={{ color: accent }}
        >
          {title}
        </div>
        <div className="mt-2 text-4xl font-display font-extrabold text-slate-900 tabular-nums">
          {challenge.prompt}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="?"
            aria-label="Your answer"
            className="mt-4 w-full text-center text-2xl font-display font-extrabold rounded-2xl border-2 border-slate-300 focus:border-duo-blue outline-none py-3 tabular-nums"
          />
          <button
            type="submit"
            disabled={value.trim() === ''}
            className="mt-3 w-full min-h-12 rounded-2xl text-white font-display font-extrabold text-lg shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            style={value.trim() === '' ? undefined : { backgroundColor: accent }}
          >
            Go!
          </button>
        </form>

        {timeLimitMs ? (
          <div className="mt-4 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-100 ease-linear"
              style={{ width: `${pct}%`, backgroundColor: accent }}
            />
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
