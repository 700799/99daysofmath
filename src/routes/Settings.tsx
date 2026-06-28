import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { TOTAL_STICKERS } from '../utils/encouragement';
import { AccountCard } from '../components/AccountCard';

const GOAL_OPTIONS = [10, 30, 50, 100];

export function Settings() {
  const reset = useProgress((s) => s.resetAll);
  const soundOn = useProgress((s) => s.soundEnabled);
  const toggleSound = useProgress((s) => s.toggleSound);
  const dailyStreak = useProgress((s) => s.dailyStreak);
  const bestDailyStreak = useProgress((s) => s.bestDailyStreak);
  const bestStreak = useProgress((s) => s.bestStreak);
  const xp = useProgress((s) => s.xp);
  const stickers = useProgress((s) => s.stickers);
  const dailyGoal = useProgress((s) => s.dailyGoal);
  const setDailyGoal = useProgress((s) => s.setDailyGoal);
  const mockTestsCompleted = useProgress((s) => s.mockTestsCompleted);
  const bestMockAccuracy = useProgress((s) => s.bestMockAccuracy);
  const dailyQuestStreak = useProgress((s) => s.dailyQuestStreak);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-display font-extrabold text-slate-900">
        Settings
      </h1>

      <AccountCard />

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="font-display font-extrabold text-slate-900">Your stats</div>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <Stat label="Daily streak" value={`${dailyStreak} 🔥`} />
          <Stat label="Best daily streak" value={`${bestDailyStreak}`} />
          <Stat label="Best in-a-row" value={`${bestStreak}`} />
          <Stat label="Daily-goal streak" value={`${dailyQuestStreak} 🎯`} />
          <Stat label="Total XP" value={`${xp} ⚡`} />
          <Stat label="Stickers earned" value={`${stickers.length} / ${TOTAL_STICKERS}`} />
          <Stat label="Mock tests" value={`${mockTestsCompleted}`} />
          <Stat
            label="Best mock score"
            value={mockTestsCompleted > 0 ? `${Math.round(bestMockAccuracy * 100)}%` : '—'}
          />
        </dl>
        <Link
          to="/report"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-display font-extrabold text-duo-blue hover:text-blue-700"
        >
          📊 View full progress report →
        </Link>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="font-display font-extrabold text-slate-900">Daily XP goal</div>
        <div className="text-sm text-slate-600 mt-1">
          How much XP to aim for each day.
        </div>
        <div className="mt-3 flex gap-2">
          {GOAL_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setDailyGoal(g)}
              aria-pressed={dailyGoal === g}
              className={[
                'min-h-11 flex-1 rounded-xl font-display font-extrabold text-sm transition-colors',
                dailyGoal === g
                  ? 'bg-duo-green text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ].join(' ')}
            >
              {g}
            </button>
          ))}
        </div>
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

      <AdminPanel />

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

// Parent/admin controls for the arcade learn-to-play balance. PIN-gated so kids
// don't change the ratio or difficulty themselves.
function AdminPanel() {
  const config = useProgress((s) => s.arcadeConfig);
  const setArcadeConfig = useProgress((s) => s.setArcadeConfig);
  const [pin, setPin] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
      <div className="font-display font-extrabold text-slate-900">Grown-ups 🔒</div>
      <div className="text-sm text-slate-600 mt-1">
        Tune the learn-to-play balance: how many full lessons unlock a game, the
        starting level, lives per game, and how many hard problems each lesson check has.
      </div>

      {!open ? (
        <div className="mt-3 flex gap-2">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="flex-1 min-w-0 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-display font-bold text-slate-900 focus:border-duo-blue focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(pin === config.adminPin)}
            className="shrink-0 px-4 rounded-xl bg-slate-900 text-white font-display font-extrabold text-sm"
          >
            Unlock
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <AdminChoice
            label="Lessons per game (ratio)"
            options={[1, 2, 3]}
            value={config.lessonsPerSession}
            onPick={(n) => setArcadeConfig({ lessonsPerSession: n })}
          />
          <AdminChoice
            label="Start level"
            options={[1, 2, 3, 4, 5]}
            value={config.startLevel}
            onPick={(n) => setArcadeConfig({ startLevel: n })}
          />
          <AdminChoice
            label="Lives per game"
            options={[1, 2, 3, 5]}
            value={config.livesPerSession}
            onPick={(n) => setArcadeConfig({ livesPerSession: n })}
          />
          <AdminChoice
            label="Hard problems per check"
            options={[1, 2, 3]}
            value={config.checkProblems}
            onPick={(n) => setArcadeConfig({ checkProblems: n })}
          />
        </div>
      )}
    </div>
  );
}

function AdminChoice({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: number[];
  value: number;
  onPick: (n: number) => void;
}) {
  return (
    <div>
      <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
        {label}
      </div>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onPick(o)}
            aria-pressed={value === o}
            className={[
              'min-h-11 flex-1 rounded-xl font-display font-extrabold text-sm transition-colors',
              value === o ? 'bg-duo-green text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            {o}
          </button>
        ))}
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
