import { useEffect, useRef, useState } from 'react';
import type { Problem } from '../types/problem';
import { MathText } from './MathText';
import { NumberKeypad } from './NumberKeypad';

interface Props {
  problem: Problem;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  onSubmit?: () => void;
}

// Detect touch primaries — we suppress the native iOS/Android keyboard for
// these users (our NumberKeypad is the input surface) but keep it available
// on desktop so physical keyboards still work.
function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: coarse)');
    setTouch(mq.matches);
    const on = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return touch;
}

export function AnswerInput({ problem, value, onChange, disabled, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isTouch = useIsTouch();

  if (problem.answerType === 'multiple-choice' && problem.choices) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {problem.choices.map((c) => {
          const selected = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(c.id)}
              className={[
                'min-h-14 px-4 py-3 rounded-2xl border-2 text-left font-display font-bold transition-all',
                selected
                  ? 'bg-duo-blue text-white border-duo-blue shadow-[0_3px_0_0_rgba(0,0,0,0.15)]'
                  : 'bg-white border-slate-200 hover:border-duo-blue text-slate-800 shadow-[0_3px_0_0_rgba(0,0,0,0.08)]',
                disabled ? 'opacity-60 cursor-not-allowed' : '',
              ].join(' ')}
            >
              <span className="inline-block w-7 h-7 leading-7 text-center rounded-full bg-white/20 mr-2 text-sm">
                {c.id}
              </span>
              <MathText text={c.label} />
            </button>
          );
        })}
      </div>
    );
  }

  const showKeypadType =
    problem.answerType === 'numeric' || problem.answerType === 'fraction';
  // On touch devices when our on-screen keypad is showing, suppress the OS
  // keyboard via inputMode="none" — otherwise iOS opens a duplicate numpad on
  // top of ours. Desktop keeps "decimal"/"text" so physical keys work.
  const inputMode: React.HTMLAttributes<HTMLInputElement>['inputMode'] =
    isTouch && showKeypadType
      ? 'none'
      : problem.answerType === 'numeric'
        ? 'decimal'
        : 'text';
  const placeholder =
    problem.answerType === 'fraction'
      ? 'e.g. 1/2 or 0.5'
      : problem.answerType === 'expression'
        ? 'e.g. 2x+4'
        : 'Type your answer';

  const showKeypad =
    !disabled &&
    (problem.answerType === 'numeric' || problem.answerType === 'fraction');

  const append = (k: string) => {
    onChange(value + k);
    inputRef.current?.focus();
  };
  const backspace = () => {
    onChange(value.slice(0, -1));
    inputRef.current?.focus();
  };
  const clear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="mt-4">
      <input
        ref={inputRef}
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full min-h-14 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-duo-blue focus:outline-none focus:ring-4 focus:ring-blue-100 text-xl font-display font-extrabold text-slate-900 placeholder:text-slate-400 placeholder:font-normal disabled:bg-slate-100 disabled:opacity-60 transition-all"
      />
      {showKeypad && (
        <NumberKeypad
          onKey={append}
          onBackspace={backspace}
          onClear={clear}
          showFraction={problem.answerType !== 'numeric' || true}
          showNegative
        />
      )}
    </div>
  );
}
