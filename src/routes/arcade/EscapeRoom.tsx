import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage } from './fx';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { makeAdaptive, type Challenge, type RoundLen } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Math Escape — a timed escape room. Each room has several locks; solve a math
// puzzle (from your chosen unit + adaptive level) to open each lock and reveal a
// clue digit. Enter all the digits on the door keypad to escape to the next room
// before the clock runs out. Five escalating themed rooms.

const PROP_EMOJI = ['🧰', '🖼️', '📦', '🗄️', '🛢️', '🕰️', '📚', '🔮', '🗃️', '🧳', '🪆', '⚱️'];

type Room = { name: string; theme: string; props: number; seconds: number };
const ROOMS: Room[] = [
  { name: 'Dungeon Cell', theme: 'cave', props: 3, seconds: 90 },
  { name: 'Midnight Library', theme: 'night', props: 3, seconds: 85 },
  { name: 'Space Lab', theme: 'space', props: 4, seconds: 85 },
  { name: 'Jungle Temple', theme: 'meadow', props: 4, seconds: 75 },
  { name: 'Candy Vault', theme: 'candy', props: 5, seconds: 75 },
];

type Prop = { emoji: string; digit: number; open: boolean };

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Escape each room before the timer runs out — then escape all 5 rooms to win!' },
  { heading: 'Locks', body: 'Tap a lock 🔒 to face a math problem. Solve it to open the lock and reveal a secret clue digit.' },
  { heading: 'The door', body: 'Open every lock, then type the clue digits (in order, left to right) on the 🚪 door keypad to escape.' },
  { heading: 'Clock', body: 'Each room is timed. The clock pauses for brain breaks. Beat the clock for a bonus!' },
];
const CONTROLS = 'Tap a lock to solve it. Type answers and the door code on the on-screen keypad.';

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
function makeProps(n: number): Prop[] {
  return shuffle(PROP_EMOJI).slice(0, n).map((emoji) => ({ emoji, digit: 1 + Math.floor(Math.random() * 9), open: false }));
}

export function EscapeRoom() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const pausedRef = useArcadePausedRef();

  const [phase, setPhase] = useState<'howto' | 'play'>('howto');
  const [roomIdx, setRoomIdx] = useState(0);
  const [props, setProps] = useState<Prop[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [active, setActive] = useState<number | null>(null); // which lock's puzzle is open
  const [chal, setChal] = useState<Challenge | null>(null);
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);
  const [door, setDoor] = useState(false); // door keypad open
  const [code, setCode] = useState('');
  const [codeWrong, setCodeWrong] = useState(false);
  const wonRef = useRef(false);
  const doneRef = useRef(false);

  const room = ROOMS[roomIdx];
  const allOpen = props.length > 0 && props.every((p) => p.open);
  const answer = props.map((p) => p.digit).join('');

  const loadRoom = (i: number) => {
    setRoomIdx(i);
    setProps(makeProps(ROOMS[i].props));
    setTimeLeft(ROOMS[i].seconds);
    setActive(null); setChal(null); setInput(''); setWrong(false);
    setDoor(false); setCode(''); setCodeWrong(false);
  };

  const start = () => { wonRef.current = false; doneRef.current = false; setOutcome(null); loadRoom(0); setPhase('play'); };

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
    if (phase === 'play' && !outcome && timeLeft === 0 && props.length > 0) finish(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, outcome]);

  const tapProp = (i: number) => {
    if (outcome || props[i].open || active != null || door) return;
    setActive(i);
    const lvl = useProgress.getState().arcadeLevels[arcadeUnit] ?? 1;
    const len: RoundLen = i % 2 === 0 ? 'short' : 'medium';
    setChal(makeAdaptive(arcadeUnit, lvl, len));
    setInput(''); setWrong(false);
  };

  const resolve = () => {
    if (!chal || active == null || input.trim() === '') return;
    const correct = Number(input.trim()) === chal.answer;
    recordArcadeAnswer(arcadeUnit, correct);
    if (correct) {
      sfx.coin(); haptic(HAPTIC.pickup);
      setProps((ps) => ps.map((p, i) => (i === active ? { ...p, open: true } : p)));
      setActive(null); setChal(null); setInput('');
    } else {
      sfx.hurt(); haptic(HAPTIC.hit); setWrong(true);
    }
  };

  const submitCode = () => {
    if (code === answer) {
      sfx.win(); haptic(HAPTIC.win);
      if (roomIdx + 1 >= ROOMS.length) finish(true);
      else loadRoom(roomIdx + 1);
    } else {
      sfx.hurt(); haptic(HAPTIC.hit); setCodeWrong(true);
    }
  };

  const reset = () => { setOutcome(null); setPhase('howto'); };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Math Escape" emoji="🔐" />
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

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Math Escape" emoji="🔐" />
        <HowToPlay emoji="🔐" title="Math Escape" gradient="from-slate-700 to-amber-700" sections={HOWTO} controls={CONTROLS} onStart={start} />
      </div>
    );
  }

  const lowTime = timeLeft <= 10;

  return (
    <div>
      <ArcadeHeader title="Math Escape" emoji="🔐" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-slate-700">Room {roomIdx + 1}/{ROOMS.length} · {room.name}</span>
        <span className={`tabular-nums ${lowTime ? 'text-rose-600 animate-pulse' : 'text-amber-600'}`}>⏱ {timeLeft}s</span>
      </div>

      <GameStage theme={room.theme} className="max-w-sm mx-auto p-3">
        {/* locks */}
        <div className="relative z-10 grid grid-cols-3 gap-2">
          {props.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => tapProp(i)}
              className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center ${p.open ? 'bg-emerald-50 border-emerald-300' : 'bg-white/85 border-slate-300 active:scale-95'}`}
            >
              <span className="text-3xl leading-none">{p.emoji}</span>
              {p.open ? (
                <span className="mt-1 text-lg font-display font-extrabold text-emerald-700">{p.digit}</span>
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
            {allOpen ? 'All locks open — enter the code to escape!' : `Open all ${props.length} locks to reveal the door code.`}
          </div>
          <div className="mt-1 font-display font-extrabold text-2xl tracking-[0.3em] tabular-nums text-slate-800">
            {props.map((p) => (p.open ? p.digit : '_')).join(' ')}
          </div>
          {allOpen && (
            <button type="button" onClick={() => { setDoor(true); setCode(''); setCodeWrong(false); }} className="mt-2 min-h-10 px-5 rounded-2xl bg-amber-500 text-white font-display font-extrabold">
              🔑 Enter code
            </button>
          )}
        </div>
      </GameStage>

      <GameInstructions emoji="🔐" title="Math Escape" sections={HOWTO} controls={CONTROLS} />

      {/* lock puzzle modal */}
      {chal && active != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">{props[active].emoji}🔒</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Solve to open the lock:</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 px-3 py-4 text-xl font-display font-extrabold leading-snug break-words">{chal.prompt}</div>
            <div className={`mt-3 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums ${wrong ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-900'}`}>
              {input || <span className="text-slate-300">?</span>}
            </div>
            {wrong && <div className="mt-1 text-xs font-display font-bold text-rose-500">Try again!</div>}
            <Keypad onKey={(k) => { setWrong(false); setInput((v) => (k === 'del' ? v.slice(0, -1) : k === '-' ? (v.startsWith('-') ? v.slice(1) : '-' + v) : v.length < 6 ? v + k : v)); }} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setActive(null); setChal(null); }} className="min-h-11 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">Back</button>
              <button type="button" onClick={resolve} disabled={!input.trim()} className="min-h-11 rounded-2xl bg-emerald-500 disabled:bg-slate-300 text-white font-display font-extrabold">Open 🔓</button>
            </div>
          </div>
        </div>
      )}

      {/* door code modal */}
      {door && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">🚪🔑</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">Enter the {props.length}-digit code</div>
            <div className="mt-1 text-xs font-display font-bold text-slate-500">Read the clue digits left → right.</div>
            <div className={`mt-3 h-12 rounded-xl border-2 flex items-center justify-center text-2xl tracking-[0.3em] font-display font-extrabold tabular-nums ${codeWrong ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-900'}`}>
              {code || <span className="text-slate-300">{'•'.repeat(props.length)}</span>}
            </div>
            {codeWrong && <div className="mt-1 text-xs font-display font-bold text-rose-500">Wrong code — check the clues!</div>}
            <Keypad onKey={(k) => { setCodeWrong(false); setCode((v) => (k === 'del' ? v.slice(0, -1) : k === '-' ? v : v.length < props.length ? v + k : v)); }} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setDoor(false)} className="min-h-11 rounded-2xl bg-slate-200 text-slate-700 font-display font-extrabold">Back</button>
              <button type="button" onClick={submitCode} disabled={code.length !== props.length} className="min-h-11 rounded-2xl bg-amber-500 disabled:bg-slate-300 text-white font-display font-extrabold">Escape 🚪</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Keypad({ onKey }: { onKey: (k: string) => void }) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
        <button key={k} type="button" onClick={() => onKey(k)} className="min-h-11 rounded-xl bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-lg text-slate-800 active:translate-y-0.5">
          {k === 'del' ? '⌫' : k}
        </button>
      ))}
    </div>
  );
}
