import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress, ARCADE_UNITS, ARCADE_UNIT_LABELS } from '../../state/progress';
import { ARCADE_GAMES, PREMIUM_GAMES } from './shared';
import { Mascot, gameMascot, type MascotKind } from './Mascots';

const UNIT_MASCOT: Record<string, MascotKind> = { '6.RP': 'frog', '6.NS': 'robot', '6.EE': 'dragon', '6.G': 'unicorn', '6.SP': 'penguin', g5: 'bunny', mixed: 'pet' };

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
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const setArcadeUnit = useProgress((s) => s.setArcadeUnit);
  const arcadeLevels = useProgress((s) => s.arcadeLevels);
  const arcadeStreak = useProgress((s) => s.arcadeStreak);
  const hiddenGames = useProgress((s) => s.arcadeConfig.hiddenGames);
  const unlockedGames = useProgress((s) => s.unlockedGames);
  const points = useProgress((s) => s.cumArcadePoints);
  const playSecs = useProgress((s) => s.cumArcadeSeconds);
  const lessonSecs = useProgress((s) => s.cumLessonSeconds);
  const appSecs = useProgress((s) => s.cumAppSeconds);

  const playedToday = arcadeDaily.date === todayISO() ? arcadeDaily.played : [];
  const distinct = playedToday.length;
  // A grown-up may turn off individual games in parent mode.
  const hidden = new Set(hiddenGames ?? []);
  const visibleGames = ARCADE_GAMES.filter((g) => !hidden.has(g.id));

  const ratio = playSecs > 0 ? lessonSecs / playSecs : lessonSecs > 0 ? Infinity : 0;
  const ratioLabel = playSecs === 0 && lessonSecs === 0 ? '—' : `${ratio.toFixed(1)} : 1`;
  const total = playSecs + lessonSecs;
  const lessonPct = total > 0 ? Math.round((lessonSecs / total) * 100) : 50;

  return (
    <div>
      <h1 className="text-2xl font-display font-extrabold text-slate-900">🕹️ Arcade</h1>
      <p className="text-sm text-slate-600 mt-1">
        Finish a <b>full math lesson</b> to unlock a game. Keep learning and
        playing balanced — aim for 50/50!
      </p>

      {/* Unit + level picker — drives every game's questions */}
      <div className="mt-4 rounded-3xl p-4 border-2 bg-white border-slate-200">
        <div className="font-display font-extrabold text-slate-900 text-sm">🎯 Choose your math unit</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ARCADE_UNITS.map((u) => {
            const sel = arcadeUnit === u;
            return (
              <button
                key={u}
                type="button"
                onClick={() => setArcadeUnit(u)}
                aria-pressed={sel}
                className={`rounded-2xl border-2 px-3 py-2 text-left flex items-center gap-2 ${sel ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
              >
                <Mascot kind={UNIT_MASCOT[u]} size={34} title={ARCADE_UNIT_LABELS[u]} />
                <span>
                  <span className="block font-display font-extrabold text-slate-800 text-sm leading-tight">{ARCADE_UNIT_LABELS[u]}</span>
                  <span className="block text-[11px] font-display font-bold text-slate-500">
                    Level {arcadeLevels[u]}/5 · {arcadeStreak[u]}/5 ⭐
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(arcadeStreak[arcadeUnit] / 5) * 100}%` }} />
        </div>
        <div className="mt-1.5 text-[11px] text-slate-500">
          All games will ask <b>{ARCADE_UNIT_LABELS[arcadeUnit]}</b> questions at <b>Level {arcadeLevels[arcadeUnit]}</b>. Get 5 right in a row to level up!
        </div>
      </div>

      {/* Learn-to-play balance card */}
      <div className="mt-4 rounded-3xl p-4 border-2 bg-indigo-50 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="font-display font-extrabold text-indigo-900">📚 Lessons vs 🎮 Games</div>
          <div className="text-xs font-display font-bold text-indigo-700 tabular-nums">
            {ratioLabel}
          </div>
        </div>
        <div className="mt-2 h-3 rounded-full bg-emerald-200 overflow-hidden">
          <div className="h-full bg-indigo-500" style={{ width: `${lessonPct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[12px] font-display font-bold">
          <span className="text-indigo-800">📘 {mmss(lessonSecs)} learning</span>
          <span className="text-emerald-800">🎮 {mmss(playSecs)} playing</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-display font-bold text-slate-600">
          <span className="bg-white rounded-full px-2.5 py-1">⭐ {points.toLocaleString()} points</span>
          <span className="bg-white rounded-full px-2.5 py-1">📱 {mmss(appSecs)} on app</span>
        </div>
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

      {visibleGames.length === 0 && (
        <div className="mt-4 rounded-3xl bg-amber-50 border-2 border-amber-200 p-5 text-center font-display font-bold text-amber-800">
          No games are turned on right now — ask a grown-up. 🧑‍🍼
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleGames.map((g) => {
          const done = playedToday.includes(g.id);
          const price = PREMIUM_GAMES[g.id];
          const locked = price != null && !unlockedGames.includes(g.id);
          // A full lesson gates each game (handled by ArcadeGate on the route),
          // so every unlocked tile stays clickable here. Locked premium games
          // route to the Shop to unlock with coins instead.
          if (locked) {
            return (
              <Link
                key={g.id}
                to="/shop"
                className={`relative block rounded-3xl p-4 bg-gradient-to-br ${g.gradient} text-white shadow-md transition-all hover:shadow-lg`}
              >
                <div className="absolute inset-0 rounded-3xl bg-slate-900/55 flex flex-col items-center justify-center">
                  <div className="text-3xl">🔒</div>
                  <div className="mt-1 rounded-full bg-amber-400 text-amber-900 text-xs font-display font-extrabold px-3 py-1">Unlock · 🪙{price}</div>
                </div>
                <div className="text-3xl opacity-40">{g.emoji}</div>
                <div className="font-display font-extrabold text-lg mt-1 opacity-40">{g.name}</div>
                <div className="text-xs opacity-30 mt-0.5 line-clamp-2">{g.blurb}</div>
              </Link>
            );
          }
          return (
            <Link
              key={g.id}
              to={g.path}
              className={`relative block rounded-3xl p-4 bg-gradient-to-br ${g.gradient} text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`}
            >
              {done && (
                <span className="absolute top-3 right-3 bg-white/90 text-green-700 text-[10px] font-display font-extrabold px-2 py-0.5 rounded-full">
                  ✓ Played today
                </span>
              )}
              <span className="absolute top-3 left-3 bg-black/20 text-white text-[10px] font-display font-extrabold px-2 py-0.5 rounded-full">
                📚 Lesson first
              </span>
              <div className="flex items-center gap-1.5">
                <span className="rounded-2xl bg-white/25 p-1">
                  <Mascot kind={gameMascot(g.id)} size={40} expr="cheer" />
                </span>
                <span className="text-2xl">{g.emoji}</span>
              </div>
              <div className="font-display font-extrabold text-lg mt-1">{g.name}</div>
              <div className="text-xs opacity-90 mt-0.5 line-clamp-2">{g.blurb}</div>
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
