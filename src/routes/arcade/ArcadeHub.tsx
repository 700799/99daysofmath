import { Link } from 'react-router-dom';
import { useProgress } from '../../state/progress';
import { ARCADE_GAMES } from './shared';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

// The 6-game arcade hub. Kids pick any game; playing DIFFERENT games pays
// more, shown live by the variety meter.
export function ArcadeHub() {
  const arcadeDaily = useProgress((s) => s.arcadeDaily);
  const playedToday = arcadeDaily.date === todayISO() ? arcadeDaily.played : [];
  const distinct = playedToday.length;

  return (
    <div>
      <h1 className="text-2xl font-display font-extrabold text-slate-900">🕹️ Arcade</h1>
      <p className="text-sm text-slate-600 mt-1">
        Brain-break games that pay XP. First play of each game today = full XP;
        repeats pay half — so mix it up!
      </p>

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
          return (
            <Link
              key={g.id}
              to={g.path}
              className={`relative block rounded-3xl p-4 bg-gradient-to-br ${g.gradient} text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all`}
            >
              {done && (
                <span className="absolute top-3 right-3 bg-white/90 text-green-700 text-[10px] font-display font-extrabold px-2 py-0.5 rounded-full">
                  ✓ Played today
                </span>
              )}
              <div className="text-3xl">{g.emoji}</div>
              <div className="font-display font-extrabold text-lg mt-1">{g.name}</div>
              <div className="text-xs opacity-90 mt-0.5">{g.blurb}</div>
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
