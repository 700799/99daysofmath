import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { HowToPlay, GameInstructions, type HowToSection } from './HowToPlay';
import { LetterKeypad, type KeyStatus } from '../../components/LetterKeypad';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';
import { ANSWERS, ALLOWED, randomAnswer } from '../../data/words';

// Word Guess — an original Wordle-style 5-letter, 6-guess game. Green = right
// spot, yellow = in the word wrong spot, gray = not in the word (duplicate
// letters handled with the standard two-pass count algorithm).

const ROWS = 6;
const COLS = 5;

const HOWTO: HowToSection[] = [
  { heading: 'Goal', body: 'Guess the hidden 5-letter word in 6 tries.' },
  { heading: 'Clues', body: 'After each guess: 🟩 green = right letter, right spot · 🟨 yellow = right letter, wrong spot · ⬜ gray = letter not in the word.' },
  { heading: 'Tips', body: 'Start with a word full of common letters. Use the clues to narrow it down. Each guess must be a real 5-letter word.' },
];
const CONTROLS = 'Tap the on-screen keys (or use your keyboard). Enter to submit, ⌫ to delete.';

function evaluate(guess: string, answer: string): KeyStatus[] {
  const marks: KeyStatus[] = Array(COLS).fill('absent');
  const counts: Record<string, number> = {};
  for (const ch of answer) counts[ch] = (counts[ch] ?? 0) + 1;
  // pass 1: greens
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === answer[i]) {
      marks[i] = 'correct';
      counts[guess[i]]--;
    }
  }
  // pass 2: yellows limited by remaining counts
  for (let i = 0; i < COLS; i++) {
    if (marks[i] === 'correct') continue;
    const ch = guess[i];
    if (counts[ch] > 0) {
      marks[i] = 'present';
      counts[ch]--;
    }
  }
  return marks;
}

const RANK: Record<KeyStatus, number> = { absent: 0, present: 1, correct: 2 };

export function Wordle() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [phase, setPhase] = useState<'howto' | 'play'>('howto');
  const [answer, setAnswer] = useState(() => randomAnswer());
  const [guesses, setGuesses] = useState<{ word: string; marks: KeyStatus[] }[]>([]);
  const [current, setCurrent] = useState('');
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState('');

  const solved = guesses.some((g) => g.word === answer);
  const done = solved || guesses.length >= ROWS;

  // best-known status per letter, for the keyboard tint
  const keyStatuses = useMemo(() => {
    const map: Record<string, KeyStatus> = {};
    for (const g of guesses) {
      for (let i = 0; i < COLS; i++) {
        const ch = g.word[i];
        const m = g.marks[i];
        if (!map[ch] || RANK[m] > RANK[map[ch]]) map[ch] = m;
      }
    }
    return map;
  }, [guesses]);

  const showToast = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(''), 1400);
  };

  const submit = () => {
    if (done) return;
    if (current.length !== COLS) {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    if (!ALLOWED.has(current)) {
      showToast('Not in word list');
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      sfx.hurt();
      haptic(HAPTIC.hit);
      return;
    }
    const marks = evaluate(current, answer);
    const next = [...guesses, { word: current, marks }];
    setGuesses(next);
    setCurrent('');
    const win = current === answer;
    if (win) {
      sfx.win();
      haptic(HAPTIC.win);
      addAchievement(15);
      const xp = Math.max(5, 16 - next.length * 2);
      addArcadePoints(120 - (next.length - 1) * 12);
      window.setTimeout(() => setOutcome(recordArcadePlay('wordle', xp)), 700);
    } else {
      if (marks.includes('correct')) sfx.coin();
      else sfx.shoot();
      haptic(HAPTIC.tap);
      if (next.length >= ROWS) {
        sfx.lose();
        haptic(HAPTIC.death);
        window.setTimeout(() => setOutcome(recordArcadePlay('wordle', 3)), 700);
      }
    }
  };

  const addLetter = (ch: string) => {
    if (done || current.length >= COLS) return;
    setCurrent((c) => c + ch);
  };
  const backspace = () => setCurrent((c) => c.slice(0, -1));

  // physical keyboard
  useEffect(() => {
    if (phase !== 'play' || done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); submit(); }
      else if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
      else if (/^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); addLetter(e.key.toUpperCase()); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, done, current, guesses, answer]);

  const reset = () => {
    setAnswer(randomAnswer());
    setGuesses([]);
    setCurrent('');
    setShake(false);
    setToast('');
    setOutcome(null);
    setPhase('play');
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Word Guess" emoji="🟩" />
        <ArcadeEndCard
          gameId="wordle"
          outcome={outcome}
          win={solved}
          scoreLine={solved ? `🎉 Solved in ${guesses.length}/${ROWS}!` : `The word was ${answer}`}
          onReplay={reset}
        />
      </div>
    );
  }

  if (phase === 'howto') {
    return (
      <div>
        <ArcadeHeader title="Word Guess" emoji="🟩" />
        <HowToPlay emoji="🟩" title="Word Guess" gradient="from-green-500 to-emerald-700" sections={HOWTO} controls={CONTROLS} onStart={() => setPhase('play')} />
      </div>
    );
  }

  const tileColor = (m: KeyStatus) =>
    m === 'correct' ? 'bg-emerald-500 text-white border-emerald-600'
      : m === 'present' ? 'bg-amber-400 text-white border-amber-500'
        : 'bg-slate-400 text-white border-slate-500';

  return (
    <div>
      <ArcadeHeader title="Word Guess" emoji="🟩" />
      <p className="text-center text-sm text-slate-600 mb-2">Guess {guesses.length + (done ? 0 : 1)} of {ROWS}</p>

      <div className="max-w-[300px] mx-auto grid gap-1.5" style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
        {Array.from({ length: ROWS }).map((_, r) => {
          const g = guesses[r];
          const isCurrent = r === guesses.length && !done;
          return (
            <motion.div
              key={r}
              animate={isCurrent && shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-5 gap-1.5"
            >
              {Array.from({ length: COLS }).map((_, c) => {
                const letter = g ? g.word[c] : isCurrent ? current[c] ?? '' : '';
                const filledStyle = g
                  ? tileColor(g.marks[c])
                  : letter
                    ? 'bg-white border-slate-400 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-900';
                return (
                  <motion.div
                    key={c}
                    initial={false}
                    animate={g ? { rotateX: [90, 0] } : {}}
                    transition={{ delay: g ? c * 0.12 : 0, duration: 0.3 }}
                    className={`flex items-center justify-center rounded-md border-2 font-display font-extrabold uppercase ${filledStyle}`}
                    style={{ aspectRatio: '1 / 1', fontSize: 26 }}
                  >
                    {letter}
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {toast && (
        <div className="mt-3 text-center">
          <span className="inline-block rounded-full bg-slate-900 text-white text-sm font-display font-bold px-4 py-1.5">{toast}</span>
        </div>
      )}

      <LetterKeypad onKey={addLetter} onEnter={submit} onBackspace={backspace} statuses={keyStatuses} />

      <p className="text-center text-[11px] text-slate-500 mt-2">
        🟩 right spot · 🟨 in the word · ⬜ not in the word. {ANSWERS.length} possible words.
      </p>

      <GameInstructions emoji="🟩" title="Word Guess" sections={HOWTO} controls={CONTROLS} />
    </div>
  );
}
