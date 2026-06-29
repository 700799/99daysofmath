import { useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { GameStage, useBurst, BurstLayer, useScorePops, ScorePopLayer } from './fx';
import { makeAdaptive, type Challenge } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Forest Survival — an ultra-long, endless survival game where MATH powers every
// action. A kid and their raccoon friend must last as many days as they can:
// forage, hunt, chop wood, build fires, and rest. Each action poses a quick math
// problem (level scales with the day); a correct answer earns the full reward.
// Each turn the day clock advances; night and random events drain your stats.
// Survive as long as you can — there is no winning, only your best streak.

const TURNS_PER_DAY = 4;

type Stats = { health: number; food: number; warmth: number; wood: number };

type Action = {
  key: string;
  emoji: string;
  label: string;
  hint: string;
};

const ACTIONS: Action[] = [
  { key: 'forage', emoji: '🍎', label: 'Forage', hint: '+food' },
  { key: 'hunt', emoji: '🏹', label: 'Hunt', hint: '++food' },
  { key: 'chop', emoji: '🪵', label: 'Chop wood', hint: '+wood' },
  { key: 'fire', emoji: '🔥', label: 'Build fire', hint: '+warmth (needs wood)' },
  { key: 'rest', emoji: '😴', label: 'Rest', hint: '+health' },
];

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

export function ForestSurvival() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const { burst, particles } = useBurst();
  const { pops, pop } = useScorePops();

  const [stats, setStats] = useState<Stats>({ health: 100, food: 70, warmth: 70, wood: 1 });
  const [day, setDay] = useState(1);
  const [turn, setTurn] = useState(0); // 0..TURNS_PER_DAY-1; >= half = night
  const [log, setLog] = useState<string>('A new adventure begins. Stay alive!');
  const [pending, setPending] = useState<{ action: Action; challenge: Challenge } | null>(null);
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const daysRef = useRef(1);

  const isNight = turn >= TURNS_PER_DAY / 2;
  const challengeLevel = Math.max(1, Math.min(5, 1 + Math.floor(day / 2)));

  const startAction = (action: Action) => {
    if (outcome || pending) return;
    if (action.key === 'fire' && stats.wood <= 0) {
      setLog('No wood to burn! Chop some first. 🪵');
      return;
    }
    setPending({ action, challenge: makeAdaptive(arcadeUnit, useProgress.getState().arcadeLevels[arcadeUnit] ?? challengeLevel, 'medium') });
    setValue('');
    setWrong(false);
  };

  const finishGame = (finalDay: number) => {
    const xp = Math.max(1, Math.min(20, finalDay));
    addArcadePoints(finalDay * 20);
    setOutcome(recordArcadePlay('survival', xp));
  };

  // Apply an action's reward, then advance the world (drain + day/night + events).
  const resolve = (correct: boolean) => {
    const action = pending!.action;
    const next: Stats = { ...stats };
    let msg = '';

    const reward = (full: number, weak: number) => (correct ? full : weak);

    switch (action.key) {
      case 'forage':
        next.food = clamp(next.food + reward(30, 10));
        msg = correct ? 'You found juicy berries! 🍓' : 'Slim pickings today.';
        break;
      case 'hunt':
        next.food = clamp(next.food + reward(48, 0));
        if (!correct) next.warmth = clamp(next.warmth - 6);
        msg = correct ? 'A great catch! 🐟' : 'The prey got away…';
        break;
      case 'chop':
        next.wood += reward(3, 1);
        msg = correct ? 'Chopped a big pile of wood! 🪵' : 'Just a few twigs.';
        break;
      case 'fire':
        next.wood -= 1;
        next.warmth = clamp(next.warmth + reward(38, 14));
        msg = correct ? 'A roaring, cozy fire! 🔥' : 'A small, smoky fire.';
        break;
      case 'rest':
        next.health = clamp(next.health + reward(22, 8));
        msg = correct ? 'A deep, restful sleep. 💤' : 'A restless nap.';
        break;
    }

    if (correct) {
      addArcadePoints(5);
      burst(150, 90, { emoji: '✨', count: 12 });
      pop(120, 70, '+correct', '#16a34a');
    }

    // advance time
    let t = turn + 1;
    let d = day;
    const nightNow = t > TURNS_PER_DAY / 2;
    // base drains each turn (harsher at night)
    next.food = clamp(next.food - (nightNow ? 10 : 7));
    next.warmth = clamp(next.warmth - (nightNow ? 12 : 7));

    let dayMsg = '';
    if (t >= TURNS_PER_DAY) {
      t = 0;
      d += 1;
      // random morning event, scaling with day
      const roll = Math.random();
      if (roll < 0.25) {
        next.warmth = clamp(next.warmth - (12 + d));
        dayMsg = ' A cold storm blew through overnight. ❄️';
      } else if (roll < 0.45) {
        if (next.warmth < 40) {
          next.health = clamp(next.health - 14);
          dayMsg = ' Wolves prowled the dark camp! 🐺';
        } else {
          dayMsg = ' Wolves crept close, but your fire scared them off. 🔥🐺';
        }
      } else if (roll < 0.65) {
        next.food = clamp(next.food + 22);
        dayMsg = ' You discovered a wild berry patch! 🫐';
      } else {
        dayMsg = ' A calm, clear morning. 🌅';
      }
    }

    // starvation / freezing damage
    if (next.food <= 0) next.health = clamp(next.health - 12);
    if (next.warmth <= 0) next.health = clamp(next.health - 12);

    setStats(next);
    setTurn(t);
    setDay(d);
    daysRef.current = d;
    setLog(msg + dayMsg);
    setPending(null);

    if (next.health <= 0) {
      // survived (d-1) full days when dying on day d's first turns; report days reached
      finishGame(daysRef.current);
    }
  };

  const press = (k: string) => {
    setWrong(false);
    if (k === 'del') setValue((v) => v.slice(0, -1));
    else if (k === '-') setValue((v) => (v.startsWith('-') ? v.slice(1) : '-' + v));
    else setValue((v) => (v.length < 6 ? v + k : v));
  };

  const submit = () => {
    if (!pending) return;
    const n = Number(value.trim());
    if (value.trim() === '' || Number.isNaN(n)) return;
    const correct = n === pending.challenge.answer;
    recordArcadeAnswer(arcadeUnit, correct);
    if (correct) resolve(true);
    else resolve(false); // wrong answer still resolves, just with the weak reward
  };

  const reset = () => {
    setStats({ health: 100, food: 70, warmth: 70, wood: 1 });
    setDay(1);
    setTurn(0);
    daysRef.current = 1;
    setLog('A new adventure begins. Stay alive!');
    setPending(null);
    setValue('');
    setWrong(false);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Forest Survival" emoji="🏕️" />
        <ArcadeEndCard
          gameId="survival"
          outcome={outcome}
          win={daysRef.current >= 5}
          scoreLine={`🏕️ Survived ${daysRef.current} day${daysRef.current === 1 ? '' : 's'}!`}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Forest Survival" emoji="🏕️" />

      <div className="flex justify-between items-center mb-2 max-w-md mx-auto px-1 text-sm font-display font-extrabold">
        <span className="text-slate-700">📅 Day {day}</span>
        <span className={isNight ? 'text-indigo-600' : 'text-amber-600'}>
          {isNight ? '🌙 Night' : '☀️ Day'}
        </span>
        <span className="text-emerald-700">🪵 {stats.wood}</span>
      </div>

      <GameStage theme={isNight ? 'cave' : 'meadow'} className="max-w-md mx-auto p-4">
        <BurstLayer api={{ burst, particles }} />
        <ScorePopLayer pops={pops} />

        <div className="flex justify-center gap-3 text-5xl">
          <span>{isNight ? '🏕️' : '🧒'}</span>
          <span>🦝</span>
        </div>

        <div className="mt-3 space-y-2">
          <StatBar emoji="❤️" label="Health" value={stats.health} color="#ef4444" />
          <StatBar emoji="🍖" label="Food" value={stats.food} color="#f59e0b" />
          <StatBar emoji="🔥" label="Warmth" value={stats.warmth} color="#fb7185" />
        </div>

        <div className="mt-3 rounded-2xl bg-white/85 px-3 py-2 text-center text-sm font-display font-bold text-slate-700 min-h-10 flex items-center justify-center">
          {log}
        </div>
      </GameStage>

      {/* action chooser or the math challenge for the chosen action */}
      {!pending ? (
        <div className="max-w-md mx-auto mt-3 grid grid-cols-5 gap-2">
          {ACTIONS.map((a) => {
            const disabled = a.key === 'fire' && stats.wood <= 0;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => startAction(a)}
                disabled={disabled}
                className="rounded-2xl bg-white border-2 border-slate-200 p-2 text-center active:translate-y-0.5 disabled:opacity-40"
              >
                <div className="text-2xl">{a.emoji}</div>
                <div className="text-[11px] font-display font-extrabold text-slate-700 leading-tight mt-0.5">
                  {a.label}
                </div>
                <div className="text-[9px] font-display font-bold text-slate-400">{a.hint}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="max-w-xs mx-auto mt-3 rounded-3xl bg-white border-2 border-slate-200 p-4 text-center shadow">
          <div className="text-sm font-display font-extrabold text-slate-700">
            {pending.action.emoji} {pending.action.label} — solve to succeed!
          </div>
          <div className="mt-2 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold text-slate-900 leading-snug break-words">
            {pending.challenge.prompt}
          </div>
          <div
            className={`mt-2 h-11 rounded-xl border-2 flex items-center justify-center text-xl font-display font-extrabold tabular-nums ${
              wrong ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-900'
            }`}
          >
            {value || <span className="text-slate-300">?</span>}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => press(k)}
                className="min-h-10 rounded-lg bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-slate-800 active:translate-y-0.5"
              >
                {k === 'del' ? '⌫' : k}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className="mt-2 w-full min-h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold shadow disabled:bg-slate-300 active:translate-y-0.5"
          >
            Do it! ✓
          </button>
        </div>
      )}
      <p className="text-center text-xs text-slate-500 mt-2">
        Keep food &amp; warmth up, build fires for the night, and survive as many days as you can!
      </p>
    </div>
  );
}

function StatBar({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-xs font-display font-extrabold text-slate-700">
        {emoji} {label}
      </span>
      <div className="flex-1 h-3 rounded-full bg-white/70 overflow-hidden border border-slate-200">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="w-8 text-right text-xs font-display font-extrabold tabular-nums text-slate-600">
        {Math.round(value)}
      </span>
    </div>
  );
}
