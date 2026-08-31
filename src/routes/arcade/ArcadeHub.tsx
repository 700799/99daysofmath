import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress, ARCADE_UNITS, ARCADE_UNIT_LABELS } from '../../state/progress';
import { ARCADE_GAMES, PREMIUM_GAMES } from './shared';
import { Mascot, type MascotKind } from './Mascots';

const UNIT_MASCOT: Record<string, MascotKind> = { '6.RP': 'frog', '6.NS': 'robot', '6.EE': 'dragon', '6.G': 'unicorn', '6.SP': 'penguin', g5: 'bunny', a1: 'dragon', pc: 'robot', mixed: 'pet' };

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
      <h1 className="text-2xl font-display font-extrabold text-ink">🕹️ Arcade</h1>
      <p className="text-sm text-ink-muted mt-1">
        Finish a <b>full math lesson</b> to unlock a game. Keep learning and
        playing balanced — aim for 50/50!
      </p>

      {/* Unit + level picker — drives every game's questions */}
      <div className="mt-4 rounded-3xl p-4 border-2 bg-surface border-line">
        <div className="font-display font-extrabold text-ink text-sm">🎯 Choose your math unit</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ARCADE_UNITS.map((u) => {
            const sel = arcadeUnit === u;
            return (
              <button
                key={u}
                type="button"
                onClick={() => setArcadeUnit(u)}
                aria-pressed={sel}
                className={`rounded-2xl border-2 px-3 py-2 text-left flex items-center gap-2 ${sel ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-accent/35'}`}
              >
                <Mascot kind={UNIT_MASCOT[u]} size={34} title={ARCADE_UNIT_LABELS[u]} />
                <span>
                  <span className="block font-display font-extrabold text-ink text-sm leading-tight">{ARCADE_UNIT_LABELS[u]}</span>
                  <span className="block text-[11px] font-display font-bold text-ink-muted">
                    Level {arcadeLevels[u]}/5 · {arcadeStreak[u]}/5 ⭐
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 h-2 rounded-full bg-surface-2 overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${(arcadeStreak[arcadeUnit] / 5) * 100}%` }} />
        </div>
        <div className="mt-1.5 text-[11px] text-ink-muted">
          All games will ask <b>{ARCADE_UNIT_LABELS[arcadeUnit]}</b> questions at <b>Level {arcadeLevels[arcadeUnit]}</b>. Get 5 right in a row to level up!
        </div>
      </div>

      {/* Learn-to-play balance card */}
      <div className="mt-4 rounded-3xl p-4 border-2 bg-accent-soft border-accent/35">
        <div className="flex items-center justify-between">
          <div className="font-display font-extrabold text-accent">📚 Lessons vs 🎮 Games</div>
          <div className="text-xs font-display font-bold text-accent tabular-nums">
            {ratioLabel}
          </div>
        </div>
        <div className="mt-2 h-3 rounded-full bg-surface-2 overflow-hidden">
          <div className="h-full bg-accent" style={{ width: `${lessonPct}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[12px] font-display font-bold">
          <span className="text-accent">📘 {mmss(lessonSecs)} learning</span>
          <span className="text-ok">🎮 {mmss(playSecs)} playing</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-display font-bold text-ink-muted">
          <span className="bg-surface rounded-full px-2.5 py-1">⭐ {points.toLocaleString()} points</span>
          <span className="bg-surface rounded-full px-2.5 py-1">📱 {mmss(appSecs)} on app</span>
        </div>
      </div>

      {/* Variety meter */}
      <div className="mt-4 rounded-3xl bg-surface border-2 border-line p-4">
        <div className="flex items-center justify-between">
          <div className="font-display font-extrabold text-ink text-sm">
            🎪 Variety bonus
          </div>
          <div className="text-xs font-display font-bold text-ink-muted tabular-nums">
            {distinct} / 5 games today
          </div>
        </div>
        <div className="mt-2 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-full ${
                i <= distinct ? 'bg-accent' : 'bg-surface-2'
              }`}
            />
          ))}
        </div>
        <div className="mt-1.5 text-[11px] text-ink-muted">
          {distinct >= 5
            ? 'Max variety! +10 and +20 XP bonuses collected. 🎉'
            : distinct >= 3
              ? `+10 XP collected — play ${5 - distinct} more different game${5 - distinct === 1 ? '' : 's'} for +20 XP.`
              : `Play ${3 - distinct} more different game${3 - distinct === 1 ? '' : 's'} for a +10 XP bonus (then +20 at 5).`}
        </div>
      </div>

      {visibleGames.length === 0 && (
        <div className="mt-4 rounded-3xl bg-warn-soft border-2 border-warn/40 p-5 text-center font-display font-bold text-warn">
          No games are turned on right now — ask a grown-up. 🧑‍🍼
        </div>
      )}

      {/* Mario-style game grid — 3 across on phones so you can see more games.
          One big icon that matches the game, chunky black borders, no subtitle. */}
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {visibleGames.map((g) => {
          const done = playedToday.includes(g.id);
          const price = PREMIUM_GAMES[g.id];
          const locked = price != null && !unlockedGames.includes(g.id);
          const tile =
            `relative flex flex-col items-center justify-start text-center rounded-2xl border-2 border-line ` +
            `bg-gradient-to-br ${g.gradient} text-white px-1.5 pt-3 pb-2 ` +
            `shadow-[0_5px_0_0_rgba(15,23,42,0.9)] transition-transform active:translate-y-1 active:shadow-[0_2px_0_0_rgba(15,23,42,0.9)]`;
          // A full lesson gates each game (handled by ArcadeGate on the route);
          // locked premium games route to the Shop to unlock with coins instead.
          return (
            <Link key={g.id} to={locked ? '/shop' : g.path} className={tile}>
              {done && !locked && (
                <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-line-strong bg-emerald-400 text-[10px] font-black text-zinc-900">✓</span>
              )}
              <span
                className="text-4xl leading-none"
                style={{ filter: 'drop-shadow(0 2px 0 rgba(0,0,0,0.35))' }}
              >
                {g.emoji}
              </span>
              <span
                className="mt-1.5 font-display text-[11px] font-extrabold leading-tight line-clamp-2"
                style={{ WebkitTextStroke: '0.4px rgba(0,0,0,0.35)' }}
              >
                {g.name}
              </span>
              {locked && (
                <div className="absolute inset-0 grid place-items-center rounded-xl bg-slate-900/60">
                  <div className="text-2xl">🔒</div>
                  <div className="rounded-full border-2 border-line-strong bg-amber-400 px-2 py-0.5 text-[10px] font-display font-black text-zinc-900">🪙{price}</div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <Link
        to="/"
        className="mt-6 inline-block text-sm font-display font-bold text-ink-muted hover:text-ink-muted"
      >
        ← Back home
      </Link>
    </div>
  );
}
