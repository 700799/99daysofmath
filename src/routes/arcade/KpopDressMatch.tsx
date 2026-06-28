import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// K-Pop Dress-Up — memorize the idol's outfit, then recreate it. Earn each
// clothing piece by answering a math problem, then tap the item you remember.
// Memory + dress-up + a math hook; harder each round.

const SLOTS = [
  { key: 'hair', pool: ['👩‍🦰', '👱‍♀️', '👩‍🦱', '👩‍🦳', '🧑‍🦲'] },
  { key: 'top', pool: ['👚', '👕', '🧥', '🎽', '🥼'] },
  { key: 'bottom', pool: ['👖', '👗', '🩳', '👘', '🩱'] },
  { key: 'shoes', pool: ['👟', '👠', '🥿', '🥾', '🩰'] },
];

function shuffle<T>(a: T[]): T[] {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function makeMath(level: number): { text: string; answer: number; choices: number[] } {
  const op = ['+', '−', '×'][Math.floor(Math.random() * 3)];
  const big = 4 + level * 3;
  let a = 0,
    b = 0,
    answer = 0;
  if (op === '+') {
    a = 3 + Math.floor(Math.random() * big);
    b = 3 + Math.floor(Math.random() * big);
    answer = a + b;
  } else if (op === '−') {
    a = 10 + Math.floor(Math.random() * big);
    b = 2 + Math.floor(Math.random() * (a - 2));
    answer = a - b;
  } else {
    a = 3 + Math.floor(Math.random() * (3 + level));
    b = 3 + Math.floor(Math.random() * (3 + level));
    answer = a * b;
  }
  const choices = new Set<number>([answer]);
  while (choices.size < 3) {
    const d = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5));
    if (answer + d > 0) choices.add(answer + d);
  }
  return { text: `${a} ${op} ${b}`, answer, choices: shuffle([...choices]) };
}

export function KpopDressMatch() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const config = useProgress((s) => s.arcadeConfig);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);

  const scoreRef = useRef(0);
  const livesRef = useRef(config.livesPerSession);
  const levelRef = useRef(config.startLevel);
  const servedRef = useRef(0);
  const doneRef = useRef(false);

  const [phase, setPhase] = useState<'memorize' | 'dress' | 'result'>('memorize');
  const [memLeft, setMemLeft] = useState(3);
  const [target, setTarget] = useState<string[]>([]);
  const [cands, setCands] = useState<string[][]>([]);
  const [slot, setSlot] = useState(0);
  const [mathDone, setMathDone] = useState(false);
  const [problem, setProblem] = useState(() => makeMath(config.startLevel));
  const [picks, setPicks] = useState<string[]>(['', '', '', '']);

  useArcadeClock(!!outcome);

  const optionCount = () => Math.min(5, 2 + levelRef.current);
  const memSecs = () => Math.max(3, 5 - Math.floor(levelRef.current / 2));

  const startRound = () => {
    const oc = optionCount();
    const tgt: string[] = [];
    const cs: string[][] = [];
    for (const s of SLOTS) {
      const slice = s.pool.slice(0, oc);
      tgt.push(slice[Math.floor(Math.random() * slice.length)]);
      cs.push(shuffle(slice));
    }
    setTarget(tgt);
    setCands(cs);
    setPicks(['', '', '', '']);
    setSlot(0);
    setMathDone(false);
    setProblem(makeMath(levelRef.current));
    setMemLeft(memSecs());
    setPhase('memorize');
  };

  const startedRef = useRef(false);
  if (!startedRef.current) {
    startedRef.current = true;
    startRound();
  }

  // memorize countdown
  useEffect(() => {
    if (phase !== 'memorize' || outcome) return;
    const id = setInterval(() => {
      setMemLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setPhase('dress');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, outcome]);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    addArcadePoints(scoreRef.current);
    const xp = Math.max(1, Math.min(20, Math.floor(scoreRef.current / 30) + 1));
    setOutcome(recordArcadePlay('kpop', xp));
  };

  const loseLife = () => {
    livesRef.current -= 1;
    if (livesRef.current <= 0) finish();
  };

  const answerMath = (choice: number) => {
    if (choice === problem.answer) {
      setMathDone(true);
    } else {
      loseLife();
      if (livesRef.current > 0) setProblem(makeMath(levelRef.current));
    }
  };

  const pickItem = (emoji: string) => {
    const np = [...picks];
    np[slot] = emoji;
    setPicks(np);
    if (emoji !== target[slot]) loseLife();
    if (livesRef.current <= 0) return;
    if (slot >= SLOTS.length - 1) {
      // round complete — score the outfit
      const matches = np.filter((p, i) => p === target[i]).length;
      scoreRef.current += matches * 10 + (matches === SLOTS.length ? 20 : 0);
      servedRef.current += 1;
      setPhase('result');
    } else {
      setSlot(slot + 1);
      setMathDone(false);
      setProblem(makeMath(levelRef.current));
    }
  };

  const nextRound = () => {
    levelRef.current = config.startLevel + Math.floor(servedRef.current / 2);
    startRound();
  };

  const reset = () => {
    scoreRef.current = 0;
    livesRef.current = config.livesPerSession;
    levelRef.current = config.startLevel;
    servedRef.current = 0;
    doneRef.current = false;
    setOutcome(null);
    startRound();
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="K-Pop Dress-Up" emoji="🎤" />
        <ArcadeEndCard
          gameId="kpop"
          outcome={outcome}
          win={servedRef.current >= 3}
          scoreLine={`${scoreRef.current} points · ${servedRef.current} looks`}
          onReplay={reset}
        />
      </div>
    );
  }

  const Hearts = (
    <span className="text-rose-600">
      {'❤️'.repeat(Math.max(0, livesRef.current))}
      {'🤍'.repeat(Math.max(0, config.livesPerSession - livesRef.current))}
    </span>
  );

  return (
    <div>
      <ArcadeHeader title="K-Pop Dress-Up" emoji="🎤" />
      <div className="flex justify-between items-center mb-3 max-w-sm mx-auto px-1 text-sm font-display font-extrabold">
        {Hearts}
        <span className="text-slate-700 tabular-nums">⭐ {scoreRef.current}</span>
        <span className="text-fuchsia-600">Lvl {levelRef.current}</span>
      </div>

      {phase === 'memorize' && (
        <div className="max-w-sm mx-auto text-center">
          <div className="text-sm font-display font-extrabold text-fuchsia-700">
            Memorize the look! {memLeft}s
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {target.map((e, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-2xl bg-fuchsia-50 border-2 border-fuchsia-200 flex items-center justify-center text-3xl"
              >
                {e}
              </div>
            ))}
          </div>
          <div className="mt-4 text-5xl">🧑‍🎤</div>
        </div>
      )}

      {phase === 'dress' && (
        <div className="max-w-sm mx-auto">
          {/* progress of slots */}
          <div className="flex justify-center gap-2 mb-3">
            {SLOTS.map((s, i) => (
              <div
                key={s.key}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl ${
                  i === slot ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-slate-200 bg-white'
                }`}
              >
                {picks[i] || '❓'}
              </div>
            ))}
          </div>

          {!mathDone ? (
            <div className="text-center">
              <div className="text-sm font-display font-bold text-slate-600">
                Answer to earn the {SLOTS[slot].key}!
              </div>
              <div className="mt-1 text-2xl font-display font-extrabold text-slate-900">
                {problem.text} = ?
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {problem.choices.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => answerMath(c)}
                    className="min-h-12 rounded-2xl bg-white border-2 border-slate-200 font-display font-extrabold text-lg text-slate-800 active:bg-slate-100"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-sm font-display font-bold text-slate-600">
                Pick the {SLOTS[slot].key} you saw!
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {cands[slot]?.map((e, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => pickItem(e)}
                    className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-3xl active:bg-slate-100"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {phase === 'result' && (
        <div className="max-w-sm mx-auto text-center">
          <div className="text-lg font-display font-extrabold text-slate-900">
            {picks.every((p, i) => p === target[i]) ? '✨ Perfect look! ✨' : 'Nice try!'}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-display font-bold text-slate-500 mb-1">Target</div>
              <div className="flex justify-center gap-1">
                {target.map((e, i) => (
                  <span key={i} className="text-2xl">{e}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-display font-bold text-slate-500 mb-1">You</div>
              <div className="flex justify-center gap-1">
                {picks.map((e, i) => (
                  <span key={i} className={`text-2xl ${e === target[i] ? '' : 'opacity-50 grayscale'}`}>
                    {e || '❓'}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={nextRound}
            className="mt-5 w-full min-h-12 rounded-2xl bg-fuchsia-500 px-6 font-display font-extrabold text-white shadow"
          >
            Next look →
          </button>
        </div>
      )}
    </div>
  );
}
