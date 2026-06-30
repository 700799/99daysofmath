import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { GameInstructions, type HowToSection } from './HowToPlay';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Logic Escape — a timed escape room with NO math, only logic. Each room has
// several locks; each lock is an indirect logic puzzle — a riddle, a pattern, an
// analogy, or an odd-one-out — that you crack by reasoning, not arithmetic. Open
// every lock, then solve the door's deduction puzzle to escape to the next room
// before the clock runs out. Five escalating themed rooms.

type Puzzle = { kind: string; q: string; choices: string[]; a: number };

// Lock puzzles: riddles, patterns, analogies, odd-one-out. All indirect — the
// answer is reasoned from the clue, never calculated.
const LOCK_PUZZLES: Puzzle[] = [
  { kind: 'Riddle', q: 'I have hands but cannot clap, and a face but never smile. What am I?', choices: ['🕰️', '🧤', '🪞', '🎭'], a: 0 },
  { kind: 'Riddle', q: 'I fall from the sky but never get hurt. I am white and cold. What am I?', choices: ['🔥', '❄️', '🍦', '🪨'], a: 1 },
  { kind: 'Riddle', q: 'I shine at night and pull the ocean tides. What am I?', choices: ['☀️', '🌙', '💡', '⚡'], a: 1 },
  { kind: 'Riddle', q: 'I buzz, I make honey, and I live in a hive. What am I?', choices: ['🦋', '🐝', '🐞', '🪰'], a: 1 },
  { kind: 'Riddle', q: 'I have a trunk, but I am not a tree. What am I?', choices: ['🌳', '🐘', '🚗', '🧳'], a: 1 },
  { kind: 'Riddle', q: 'I am full of holes but I still hold water. What am I?', choices: ['🧽', '🪣', '🍉', '☂️'], a: 0 },
  { kind: 'Riddle', q: 'I run all day but never walk, and have a bed but never sleep. What am I?', choices: ['🛏️', '🏃', '🌊', '🚪'], a: 2 },
  { kind: 'Riddle', q: 'The more you take from me, the bigger I get. What am I?', choices: ['🕳️', '🎈', '🍰', '📦'], a: 0 },
  { kind: 'Odd one out', q: 'Which one does NOT belong?', choices: ['🍎', '🍌', '🔨', '🍇'], a: 2 },
  { kind: 'Odd one out', q: 'Which is NOT an animal?', choices: ['🐶', '🐱', '🌵', '🐰'], a: 2 },
  { kind: 'Odd one out', q: 'Which one canNOT fly?', choices: ['🦅', '🦋', '🐧', '🛩️'], a: 2 },
  { kind: 'Odd one out', q: 'Which is NOT a fruit?', choices: ['🍓', '🥕', '🍑', '🍍'], a: 1 },
  { kind: 'Pattern', q: 'What comes next?  🔺 🔵 🔺 🔵 🔺 __', choices: ['🔺', '🔵', '🟢', '⭐'], a: 1 },
  { kind: 'Pattern', q: 'What comes next?  🌑 🌒 🌓 🌔 __', choices: ['🌕', '🌑', '⭐', '☀️'], a: 0 },
  { kind: 'Pattern', q: 'Finish the pattern:  🍎 🍎 🍌 🍎 🍎 🍌 🍎 🍎 __', choices: ['🍌', '🍎', '🍇', '🍒'], a: 0 },
  { kind: 'Pattern', q: 'What comes next?  ⬆️ ➡️ ⬇️ ⬅️ ⬆️ ➡️ __', choices: ['⬇️', '⬆️', '⬅️', '➡️'], a: 0 },
  { kind: 'Analogy', q: 'Day is to ☀️ as Night is to __', choices: ['🌙', '🔥', '🌧️', '🍂'], a: 0 },
  { kind: 'Analogy', q: 'Cow is to 🥛 as Bee is to __', choices: ['🍯', '🥚', '🧀', '🍷'], a: 0 },
  { kind: 'Analogy', q: 'Fish is to 🌊 as Bird is to __', choices: ['☁️', '🌳', '🪺', '🐛'], a: 0 },
  { kind: 'Analogy', q: 'Hot is to 🔥 as Cold is to __', choices: ['❄️', '💧', '🌙', '🍦'], a: 0 },
  { kind: 'Analogy', q: 'Puppy is to 🐶 as Kitten is to __', choices: ['🐱', '🐭', '🦊', '🐹'], a: 0 },
];

// Door puzzles: harder deduction / ordering. Still pure logic.
const DOOR_PUZZLES: Puzzle[] = [
  { kind: 'Deduction', q: 'The escape key is round, NOT yellow, and NOT a square. Which is it?', choices: ['🟡', '🟦', '🔴', '🟩'], a: 2 },
  { kind: 'Deduction', q: 'One box hides the key. It is NOT the starred box and NOT the locked box. Which box?', choices: ['⭐📦', '🔒📦', '📦', '🎀📦'], a: 2 },
  { kind: 'Logic', q: 'Anya is taller than Bo. Bo is taller than Cy. Who is the SHORTEST?', choices: ['Anya', 'Bo', 'Cy', 'Same'], a: 2 },
  { kind: 'Logic', q: 'All keys on the wall are gold. The door key is on the wall. So the door key is…', choices: ['Silver', 'Gold', 'Broken', 'Hidden'], a: 1 },
  { kind: 'Logic', q: 'The exit is right of the plant and left of the lamp. 🪴 ? 💡 — what is between them?', choices: ['🚪', '🪟', '🖼️', '🔒'], a: 0 },
  { kind: 'Deduction', q: 'Three colored doors. The exit is NOT blue, NOT green, and not on either end. Which?', choices: ['🟦', '🟥', '🟩', '🟨'], a: 1 },
  { kind: 'Logic', q: 'If it is raining, the floor is wet. The floor is dry. So it is…', choices: ['Raining', 'NOT raining', 'Snowing', 'Foggy'], a: 1 },
];

const PROP_EMOJI = ['🧰', '🖼️', '📦', '🗄️', '🛢️', '🕰️', '📚', '🔮', '🗃️', '🧳', '🪆', '⚱️'];

type Room = { name: string; theme: string; props: number; seconds: number };
const ROOMS: Room[] = [
  { name: 'Dungeon Cell', theme: 'cave', props: 3, seconds: 90 },
  { name: 'Midnight Library', theme: 'night', props: 3, seconds: 85 },
  { name: 'Space Lab', theme: 'space', props: 4, seconds: 85 },
  { name: 'Jungle Temple', theme: 'meadow', props: 4, seconds: 80 },
  { name: 'Candy Vault', theme: 'candy', props: 5, seconds: 80 },
];

type Lock = { emoji: string; puzzle: Puzzle; open: boolean };

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Escape each room before the timer runs out — escape all 5 rooms to win! No math here, just clever thinking.' },
  { heading: 'Locks', body: 'Tap a lock 🔒 to face a logic puzzle — a riddle, a pattern, an analogy, or an odd-one-out. Pick the right answer to pop the lock open.' },
  { heading: 'Think it through', body: 'The clues are indirect — the puzzle never gives the answer away. Reason it out: what fits the riddle? what comes next? what does NOT belong?' },
  { heading: 'The door', body: 'Open every lock, then crack the door’s deduction puzzle to escape to the next room.' },
  { heading: 'Clock', body: 'Each room is timed and pauses for brain breaks. Beat the clock for a bonus!' },
];
const CONTROLS = 'Tap a lock, then tap the answer you reason out. Solve the door puzzle to escape.';

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
function makeLocks(n: number): Lock[] {
  const emojis = shuffle(PROP_EMOJI).slice(0, n);
  const puzzles = shuffle(LOCK_PUZZLES).slice(0, n);
  return emojis.map((emoji, i) => ({ emoji, puzzle: puzzles[i], open: false }));
}
function pickDoor(): Puzzle {
  return DOOR_PUZZLES[Math.floor(Math.random() * DOOR_PUZZLES.length)];
}

export function EscapeRoom() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'play'>('play');
  const [roomIdx, setRoomIdx] = useState(0);
  const [locks, setLocks] = useState<Lock[]>([]);
  const [doorPuzzle, setDoorPuzzle] = useState<Puzzle>(DOOR_PUZZLES[0]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [active, setActive] = useState<number | null>(null); // which lock's puzzle is open
  const [wrong, setWrong] = useState(false);
  const [door, setDoor] = useState(false); // door puzzle open
  const [doorWrong, setDoorWrong] = useState(false);
  const wonRef = useRef(false);
  const doneRef = useRef(false);

  const room = ROOMS[roomIdx];
  const allOpen = locks.length > 0 && locks.every((p) => p.open);

  const loadRoom = (i: number) => {
    setRoomIdx(i);
    setLocks(makeLocks(ROOMS[i].props));
    setDoorPuzzle(pickDoor());
    setTimeLeft(ROOMS[i].seconds);
    setActive(null); setWrong(false);
    setDoor(false); setDoorWrong(false);
  };

  const start = () => { wonRef.current = false; doneRef.current = false; setOutcome(null); loadRoom(0); setPhase('play'); };

  // Auto-start on mount — the arcade gate now shows the directions + countdown.
  useEffect(() => { start(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finish = (won: boolean) => {
    if (doneRef.current) return;
    doneRef.current = true;
    wonRef.current = won;
    const roomsEscaped = won ? ROOMS.length : roomIdx;
    addArcadePoints(roomsEscaped * 40 + (won ? Math.max(0, timeLeft) : 0));
    const xp = Math.max(2, Math.min(20, roomsEscaped * 3 + (won ? 3 : 0)));
    won ? sfx.win() : sfx.lose();
    haptic(won ? HAPTIC.win : HAPTIC.death);
    setOutcome(recordArcadePlay('escape', xp));
  };

  // 1 Hz countdown — frozen during brain breaks / story overlays.
  useEffect(() => {
    if (phase !== 'play' || outcome) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, outcome, pausedRef, roomIdx]);

  useEffect(() => {
    if (phase === 'play' && !outcome && timeLeft === 0 && locks.length > 0) finish(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, outcome]);

  const tapLock = (i: number) => {
    if (outcome || locks[i].open || active != null || door) return;
    setActive(i);
    setWrong(false);
  };

  const answerLock = (choice: number) => {
    if (active == null) return;
    const correct = choice === locks[active].puzzle.a;
    if (correct) {
      sfx.coin(); haptic(HAPTIC.pickup);
      setLocks((ps) => ps.map((p, i) => (i === active ? { ...p, open: true } : p)));
      setActive(null); setWrong(false);
    } else {
      sfx.hurt(); haptic(HAPTIC.hit); setWrong(true);
    }
  };

  const answerDoor = (choice: number) => {
    if (choice === doorPuzzle.a) {
      sfx.win(); haptic(HAPTIC.win);
      if (roomIdx + 1 >= ROOMS.length) finish(true);
      else loadRoom(roomIdx + 1);
    } else {
      sfx.hurt(); haptic(HAPTIC.hit); setDoorWrong(true);
    }
  };

  const reset = () => { start(); };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Logic Escape" emoji="🔐" />
        <ArcadeEndCard
          gameId="escape"
          outcome={outcome}
          win={wonRef.current}
          scoreLine={wonRef.current ? `🏆 Escaped all ${ROOMS.length} rooms!` : `Escaped ${roomIdx} of ${ROOMS.length} rooms`}
          onReplay={reset}
        />
      </div>
    );
  }


  const lowTime = timeLeft <= 10;

  return (
    <div>
      <ArcadeHeader title="Logic Escape" emoji="🔐" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-slate-700">Room {roomIdx + 1}/{ROOMS.length} · {room.name}</span>
        <span className={`tabular-nums ${lowTime ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`}>⏱ {timeLeft}s</span>
      </div>

      <GameStage theme={room.theme} className="max-w-sm mx-auto p-3">
        {/* locks */}
        <div className="relative z-10 grid grid-cols-3 gap-2">
          {locks.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => tapLock(i)}
              className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center ${p.open ? 'bg-emerald-50 border-emerald-300' : 'bg-white/85 border-slate-300 active:scale-95'}`}
            >
              <span className="text-3xl leading-none">{p.emoji}</span>
              {p.open ? (
                <span className="mt-1 text-lg font-display font-extrabold text-emerald-700">✓</span>
              ) : (
                <span className="mt-1 text-sm">🔒</span>
              )}
            </button>
          ))}
        </div>

        {/* door */}
        <div className="relative z-10 mt-3 rounded-2xl bg-white/85 p-3 text-center">
          <div className="text-4xl">🚪</div>
          <div className="mt-1 text-xs font-display font-bold text-slate-600">
            {allOpen ? 'All locks open — solve the door puzzle to escape!' : `Open all ${locks.length} locks to reach the door.`}
          </div>
          <div className="mt-1 font-display font-extrabold text-2xl tracking-[0.3em] text-slate-800">
            {locks.map((p) => (p.open ? '🔓' : '🔒')).join(' ')}
          </div>
          {allOpen && (
            <button type="button" onClick={() => { setDoor(true); setDoorWrong(false); }} className="mt-2 min-h-10 px-5 rounded-2xl bg-amber-500 text-white font-display font-extrabold">
              🔑 Try the door
            </button>
          )}
        </div>
      </GameStage>

      <GameInstructions emoji="🔐" title="Logic Escape" sections={HOWTO} controls={CONTROLS} />

      {/* lock puzzle modal */}
      {active != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">{locks[active].emoji}🔒</div>
            <div className="mt-1 text-[11px] font-display font-extrabold uppercase tracking-widest text-amber-500">{locks[active].puzzle.kind}</div>
            <div className="mt-2 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-base font-display font-extrabold leading-snug break-words text-slate-800">{locks[active].puzzle.q}</div>
            {wrong && <div className="mt-2 text-xs font-display font-bold text-rose-500">Not quite — think again!</div>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {locks[active].puzzle.choices.map((c, ci) => (
                <button key={ci} type="button" onClick={() => answerLock(ci)} className="min-h-14 rounded-2xl bg-slate-100 hover:bg-amber-100 border-2 border-slate-200 font-display font-extrabold text-2xl text-slate-800 active:translate-y-0.5">
                  {c}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => { setActive(null); setWrong(false); }} className="mt-3 w-full min-h-11 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">Back</button>
          </div>
        </div>
      )}

      {/* door puzzle modal */}
      {door && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">🚪🔑</div>
            <div className="mt-1 text-[11px] font-display font-extrabold uppercase tracking-widest text-amber-500">Door · {doorPuzzle.kind}</div>
            <div className="mt-2 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-base font-display font-extrabold leading-snug break-words text-slate-800">{doorPuzzle.q}</div>
            {doorWrong && <div className="mt-2 text-xs font-display font-bold text-rose-500">Wrong — reason it through again!</div>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {doorPuzzle.choices.map((c, ci) => (
                <button key={ci} type="button" onClick={() => answerDoor(ci)} className="min-h-14 rounded-2xl bg-slate-100 hover:bg-amber-100 border-2 border-slate-200 font-display font-extrabold text-xl text-slate-800 active:translate-y-0.5">
                  {c}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setDoor(false)} className="mt-3 w-full min-h-11 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
