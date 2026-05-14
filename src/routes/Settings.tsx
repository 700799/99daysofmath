import { useState } from 'react';
import { useProgress } from '../state/progress';

export function Settings() {
  const reset = useProgress((s) => s.resetAll);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-display font-extrabold text-slate-900 mb-4">
        Settings
      </h1>
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="font-display font-bold text-slate-900">Reset progress</div>
        <div className="text-sm text-slate-600 mt-1">
          Clears all stars and unlocked units. The problem bank itself is
          unchanged.
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
            Progress reset ✅
          </div>
        )}
      </div>
    </div>
  );
}
