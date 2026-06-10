import type { ChallengeDifficulty } from '../rewards/mathChallenge';

const OPTIONS: { value: ChallengeDifficulty; label: string; dot: string }[] = [
  { value: 1, label: 'Easy', dot: '#58CC02' },
  { value: 2, label: 'Medium', dot: '#FFC800' },
  { value: 3, label: 'Hard', dot: '#FF4B4B' },
];

interface Props {
  value: ChallengeDifficulty;
  onChange: (v: ChallengeDifficulty) => void;
  accent: string;
}

/** A row of Easy / Medium / Hard chips that set the math challenge difficulty. */
export function DifficultyChips({ value, onChange, accent }: Props) {
  return (
    <div className="flex items-center justify-center gap-2" role="group" aria-label="Difficulty">
      {OPTIONS.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={[
              'inline-flex items-center gap-2 px-4 py-2 rounded-full font-display font-extrabold text-sm border-2 transition-colors min-h-11',
              active ? 'text-white' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
            ].join(' ')}
            style={active ? { backgroundColor: accent, borderColor: accent } : undefined}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: o.dot }}
              aria-hidden="true"
            />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
