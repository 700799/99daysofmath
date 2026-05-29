import type { ChallengeDifficulty } from '../rewards/mathChallenge';

const OPTIONS: { value: ChallengeDifficulty; label: string; emoji: string }[] = [
  { value: 1, label: 'Easy', emoji: '🟢' },
  { value: 2, label: 'Medium', emoji: '🟡' },
  { value: 3, label: 'Hard', emoji: '🔴' },
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
              'px-4 py-2 rounded-full font-display font-extrabold text-sm border-2 transition-colors min-h-11',
              active ? 'text-white' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
            ].join(' ')}
            style={active ? { backgroundColor: accent, borderColor: accent } : undefined}
          >
            {o.emoji} {o.label}
          </button>
        );
      })}
    </div>
  );
}
