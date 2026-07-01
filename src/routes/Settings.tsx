import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../state/progress';
import { TOTAL_STICKERS } from '../utils/encouragement';
import { AccountCard } from '../components/AccountCard';
import { ARCADE_GAMES } from './arcade/shared';

const GOAL_OPTIONS = [10, 30, 50, 100];

export function Settings() {
  const reset = useProgress((s) => s.resetAll);
  const soundOn = useProgress((s) => s.soundEnabled);
  const toggleSound = useProgress((s) => s.toggleSound);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const toggleHaptics = useProgress((s) => s.toggleHaptics);
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

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display font-extrabold text-slate-900">Vibration</div>
            <div className="text-sm text-slate-600 mt-1">
              Haptic buzzes in the arcade games (where supported).
            </div>
          </div>
          <button
            type="button"
            onClick={toggleHaptics}
            aria-pressed={hapticsOn}
            className={[
              'min-h-11 px-4 rounded-full font-display font-extrabold text-sm transition-colors',
              hapticsOn
                ? 'bg-duo-green text-white hover:bg-duo-green-dark'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
            ].join(' ')}
          >
            {hapticsOn ? '📳 On' : 'Off'}
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
  const resetArcadeMastery = useProgress((s) => s.resetArcadeMastery);
  const [pin, setPin] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-5">
      <div className="font-display font-extrabold text-slate-900">Grown-ups 🔒</div>
      <div className="text-sm text-slate-600 mt-1">
        Enter the grown-ups passcode to tune the learn-to-play balance — including
        <b> Unlimited play</b>, which games show, the lesson-to-game time budget, and the
        in-game math challenges.
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
          <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
            <div>
              <div className="font-display font-extrabold text-slate-900 text-sm">Unlimited play</div>
              <div className="text-xs text-slate-600">Skip the lesson gate — play any game freely.</div>
            </div>
            <button
              type="button"
              onClick={() => setArcadeConfig({ unlimited: !config.unlimited })}
              aria-pressed={!!config.unlimited}
              className={[
                'min-h-11 px-4 rounded-full font-display font-extrabold text-sm transition-colors',
                config.unlimited
                  ? 'bg-duo-green text-white hover:bg-duo-green-dark'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
              ].join(' ')}
            >
              {config.unlimited ? '♾️ On' : 'Off'}
            </button>
          </div>
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

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Time budget — lessons earn game time
            </div>
            <AdminPick
              label="Game time per lesson minute"
              options={[
                { value: 0, label: 'Off' },
                { value: 0.5, label: '½×' },
                { value: 1, label: '1×' },
                { value: 2, label: '2×' },
              ]}
              value={config.earnRatio}
              onPick={(n) => setArcadeConfig({ earnRatio: n })}
            />
            <div className="mt-3" />
            <AdminPick
              label="Lesson time before play"
              options={[
                { value: 0, label: 'Off' },
                { value: 60, label: '1m' },
                { value: 120, label: '2m' },
                { value: 180, label: '3m' },
              ]}
              value={config.minLessonSeconds}
              onPick={(n) => setArcadeConfig({ minLessonSeconds: n })}
            />
            <div className="mt-3" />
            <AdminPick
              label="Read time per lesson screen"
              options={[
                { value: 0, label: 'Off' },
                { value: 4, label: '4s' },
                { value: 6, label: '6s' },
                { value: 8, label: '8s' },
                { value: 10, label: '10s' },
              ]}
              value={config.lessonScreenSeconds}
              onPick={(n) => setArcadeConfig({ lessonScreenSeconds: n })}
            />
            <div className="mt-3" />
            <AdminPick
              label="Hide answer in explanations for"
              options={[
                { value: 0, label: 'Off' },
                { value: 5, label: '5s' },
                { value: 10, label: '10s' },
                { value: 15, label: '15s' },
                { value: 30, label: '30s' },
                { value: 60, label: '60s' },
              ]}
              value={config.answerRevealSeconds ?? 15}
              onPick={(n) => setArcadeConfig({ answerRevealSeconds: n })}
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Adaptive difficulty
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Games are never interrupted mid-play — math happens between games, at big in-game
              milestones, and on each game’s end screen.
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-display font-bold text-slate-700">Adaptive level &amp; mastery</span>
              <button
                type="button"
                onClick={() => { if (window.confirm('Reset every unit back to Level 1 and clear mastery progress?')) resetArcadeMastery(); }}
                className="rounded-xl bg-rose-100 text-rose-700 font-display font-extrabold text-sm px-3 py-2"
              >
                Reset mastery
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <GameVisibility
              hidden={config.hiddenGames ?? []}
              onToggle={(id) => {
                const set = new Set(config.hiddenGames ?? []);
                if (set.has(id)) set.delete(id);
                else set.add(id);
                setArcadeConfig({ hiddenGames: Array.from(set) });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Numbered chooser variant that shows custom labels (for non-integer / unit values).
function AdminPick({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: { value: number; label: string }[];
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
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            aria-pressed={value === o.value}
            className={[
              'min-h-11 flex-1 rounded-xl font-display font-extrabold text-sm transition-colors',
              value === o.value ? 'bg-duo-green text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Toggle which games appear in the Arcade hub. Parent mode governs the menu.
function GameVisibility({
  hidden,
  onToggle,
}: {
  hidden: string[];
  onToggle: (id: string) => void;
}) {
  const hiddenSet = new Set(hidden);
  return (
    <div>
      <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
        Games shown in the arcade
      </div>
      <div className="flex flex-wrap gap-2">
        {ARCADE_GAMES.map((g) => {
          const on = !hiddenSet.has(g.id);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onToggle(g.id)}
              aria-pressed={on}
              className={[
                'min-h-9 px-3 rounded-full font-display font-extrabold text-xs transition-colors',
                on ? 'bg-duo-green text-white' : 'bg-slate-200 text-slate-500 line-through',
              ].join(' ')}
            >
              {g.emoji} {g.name}
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 text-[11px] text-slate-500">Tap to hide/show. Hidden games leave the kid's menu.</div>
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
