import type { Problem } from '../types/problem';
import { MathText } from './MathText';

interface Props {
  problem: Problem;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function AnswerInput({ problem, value, onChange, disabled }: Props) {
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
                'min-h-14 px-4 py-3 rounded-2xl border-2 text-left font-display font-bold transition-colors',
                selected
                  ? 'bg-duo-blue text-white border-duo-blue'
                  : 'bg-white border-slate-200 hover:border-duo-blue text-slate-800',
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

  const inputMode =
    problem.answerType === 'numeric' ? 'decimal' : 'text';
  const placeholder =
    problem.answerType === 'fraction'
      ? 'e.g. 1/2'
      : problem.answerType === 'expression'
        ? 'e.g. 2x+4'
        : 'Type your answer';

  return (
    <div className="mt-4">
      <input
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-14 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-duo-blue focus:outline-none text-lg font-display font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal disabled:bg-slate-100 disabled:opacity-60"
      />
    </div>
  );
}
