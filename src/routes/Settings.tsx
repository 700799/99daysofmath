import { useState } from 'react';
import { useProgress } from '../state/progress';

export function Settings() {
  const reset = useProgress((s) => s.resetAll);
  const soundOn = useProgress((s) => s.soundEnabled);
  const toggleSound = useProgress((s) => s.toggleSound);
  const dailyStreak = useProgress((s) => s.dailyStreak);
  const bestDailyStreak = useProgress((s) => s.bestDailyStreak);
  const bestStreak = useProgress((s) => s.bestStreak);
  const xp = useProgress((s) => s.xp);
  const stickers = useProgress((s) => s.stickers);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-extrabold text-slate-900">
        Settings
      </h1>

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="font-display font-extrabold text-slate-900">Your stats</div>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <Stat label="Daily streak" value={`${dailyStreak} 🔥`} />
          <Stat label="Best daily streak" value={`${bestDailyStreak}`} />
          <Stat label="Best in-a-row" value={`${bestStreak}`} />
          <Stat label="Total XP" value={`${xp} ⚡`} />
          <Stat label="Stickers" value={`${stickers.length}`} />
        </dl>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display font-extrabold text-slate-900">Sound effects</div>
            <div className="text-sm text-slate-600 mt-1">
              Gentle tones on correct, wrong, and unit complete.
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            className={[
              'min-h-11 px-4 rounded-full font-display font-extrabold text-sm transition-colors',
              soundOn
                ? 'bg-duo-green text-white hover:bg-duo-green-dark'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
            ].join(' ')}
          >
            {soundOn ? '🔊 On' : '🔇 Off'}
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="font-display font-extrabold text-slate-900">Reset progress</div>
        <div className="text-sm text-slate-600 mt-1">
          Clears all stars, XP, streaks, and stickers. The problem bank is unchanged.
        </div>
        {!confirming && !done && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-3 px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-800 font-display font-bold min-h-11"
          >
            Reset progress
          </button>
        )}
        {confirming && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                reset();
                setConfirming(false);
                setDone(true);
              }}
              className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-display font-bold min-h-11"
            >
              Yes, reset
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-display font-bold min-h-11"
            >
              Cancel
            </button>
          </div>
        )}
        {done && (
          <div className="mt-3 text-green-700 font-display font-bold">
            Progress reset.
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 border border-slate-200">
      <div className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className="font-display font-extrabold text-slate-900 text-base mt-0.5">
        {value}
      </div>
    </div>
  );
}
