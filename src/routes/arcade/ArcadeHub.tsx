import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useProgress,
  ARCADE_DAILY_CAP_SECONDS,
  MATH_UNLOCK_SECONDS,
} from '../../state/progress';
import { ARCADE_GAMES } from './shared';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function mmss(total: number): string {
  const t = Math.max(0, Math.floor(total));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Live re-render at 1Hz so the countdowns visibly tick.
function useClockTick(): void {
  const [, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
}

export function ArcadeHub() {
  useClockTick();
  const arcadeDaily = useProgress((s) => s.arcadeDaily);
  const isLocked = useProgress((s) => s.isArcadeLocked)();
  const arcadeRemaining = useProgress((s) => s.arcadeRemainingSeconds)();
  const mathRemaining = useProgress((s) => s.mathRemainingSeconds)();

  const playedToday = arcadeDaily.date === todayISO() ? arcadeDaily.played : [];
  const distinct = playedToday.length;

  const totalCap = ARCADE_DAILY_CAP_SECONDS;
  const totalUnlock = MATH_UNLOCK_SECONDS;
  const arcadePct = Math.max(0, Math.min(1, arcadeRemaining / totalCap));
  const unlockPct = Math.max(0, Math.min(1, 1 - mathRemaining / totalUnlock));

  return (
    <div>
      <h1 className="text-2xl font-display font-extrabold text-slate-900">🕹️ Arcade</h1>
      <p className="text-sm text-slate-600 mt-1">
        Brain-break games that pay XP. Three minutes a day — first play of each
        game = full XP; repeats pay half — so mix it up!
      </p>

      {/* Daily timer / lock card */}
      <div
        className={`mt-4 rounded-3xl p-4 border-2 ${
          isLocked
            ? 'bg-rose-50 border-rose-200'
            : arcadeRemaining <= 30
              ? 'bg-amber-50 border-amber-200'
              : 'bg-emerald-50 border-emerald-200'
        }`}
      >
        {isLocked ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="font-display font-extrabold text-rose-900">
                🔒 Arcade locked
              </div>
              <div className="text-xs font-display font-bold text-rose-700 tabular-nums">
                {mmss(mathRemaining)} of math to go
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-rose-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-orange-400"
                style={{ width: `${unlockPct * 100}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-rose-900 leading-snug">
              You hit today's 3-minute arcade limit. Open a unit, Practice, or
              Daily Mix — after <b>15 minutes of math</b> the arcade is back.
            </p>
            <Link
              to="/"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-rose-600 text-white font-display font-extrabold text-sm px-4 py-2"
            >
              📘 Do some math
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <div className="font-display font-extrabold text-emerald-900">
                ⏱ Today's arcade timer
              </div>
              <div className="text-xs font-display font-bold text-emerald-700 tabular-nums">
                {mmss(arcadeRemaining)} left
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-emerald-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                style={{ width: `${arcadePct * 100}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-emerald-900 leading-snug">
              3 minutes of arcade per day. After that, 15 minutes of math
              unlocks another round.
            </p>
          </div>
        )}
      </div>

      {/* Variety meter */}
      <div className="mt-4 rounded-3xl bg-white border-2 border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="font-display font-extrabold text-slate-900 text-sm">
            🎪 Variety bonus
          </div>
          <div className="text-xs font-display font-bold text-slate-500 tabular-nums">
            {distinct} / 5 games today
          </div>
        </div>
        <div className="mt-2 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-full ${
                i <= distinct ? 'bg-gradient-to-r from-purple-400 to-fuchsia-500' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
        <div className="mt-1.5 text-[11px] text-slate-500">
          {distinct >= 5
            ? 'Max variety! +10 and +20 XP bonuses collected. 🎉'
            : distinct >= 3
              ? `+10 XP collected — play ${5 - distinct} more different game${5 - distinct === 1 ? '' : 's'} for +20 XP.`
              : `Play ${3 - distinct} more different game${3 - distinct === 1 ? '' : 's'} for a +10 XP bonus (then +20 at 5).`}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ARCADE_GAMES.map((g) => {
          const done = playedToday.includes(g.id);
          const disabled = isLocked;
          const inner = (
            <>
              {done && (
                <span className="absolute top-3 right-3 bg-white/90 text-green-700 text-[10px] font-display font-extrabold px-2 py-0.5 rounded-full">
                  ✓ Played today
                </span>
              )}
              {disabled && (
                <span className="absolute top-3 right-3 text-white text-base">🔒</span>
              )}
              <div className="text-3xl">{g.emoji}</div>
              <div className="font-display font-extrabold text-lg mt-1">{g.name}</div>
              <div className="text-xs opacity-90 mt-0.5">{g.blurb}</div>
            </>
          );
          const cls = `relative block rounded-3xl p-4 bg-gradient-to-br ${g.gradient} text-white shadow-md transition-all ${
            disabled
              ? 'opacity-50 grayscale pointer-events-none'
              : 'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          }`;
          return disabled ? (
            <div key={g.id} className={cls} aria-disabled="true">
              {inner}
            </div>
          ) : (
            <Link key={g.id} to={g.path} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>

      <Link
        to="/"
        className="mt-6 inline-block text-sm font-display font-bold text-slate-500 hover:text-slate-700"
      >
        ← Back home
      </Link>
    </div>
  );
}
