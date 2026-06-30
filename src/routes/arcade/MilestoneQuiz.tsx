import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../state/progress';
import { makeAdaptive, type Challenge, type RoundLen } from './MidGameChallenge';
import { ProblemAidDrawer } from './ProblemAid';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// MilestoneQuiz — a compact, reusable "you hit a milestone, solve for a bonus!"
// math question. Drawn from the student's chosen unit + adaptive level, it awards
// coins + points on a correct answer and feeds the adaptive mastery system. Used
// on the shared end card so EVERY game poses a math question at its key milestone
// (level clear / game over), and can be dropped into any game's mid-run milestones.

const COIN_REWARD = 10;

export function MilestoneQuiz({ onDone, len = 'short', label = '🎁 Milestone bonus — solve for coins!' }: { onDone: () => void; len?: RoundLen; label?: string }) {
  const arcadeUnit = useProgress((s) => s.arcadeUnit);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const addCoins = useProgress((s) => s.addCoins);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);

  const [chal] = useState<Challenge>(() => {
    const lvl = useProgress.getState().arcadeLevels[arcadeUnit] ?? 1;
    return makeAdaptive(arcadeUnit, lvl, len);
  });
  const [input, setInput] = useState('');
  const [state, setState] = useState<'ask' | 'right' | 'wrong'>('ask');
  const [help, setHelp] = useState(false);

  const submit = () => {
    if (input.trim() === '') return;
    const correct = Number(input.trim()) === chal.answer;
    recordArcadeAnswer(arcadeUnit, correct);
    if (correct) {
      addCoins(COIN_REWARD); addArcadePoints(10);
      sfx.coin(); haptic(HAPTIC.win);
      setState('right');
      window.setTimeout(onDone, 1100);
    } else {
      sfx.hurt(); haptic(HAPTIC.hit);
      setState('wrong'); setInput('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 mx-auto max-w-xs rounded-3xl border-2 border-indigo-200 bg-indigo-50 p-4 text-center">
      <div className="text-[11px] font-display font-extrabold uppercase tracking-widest text-indigo-500">{label}</div>
      {state === 'right' ? (
        <div className="mt-2 font-display font-extrabold text-emerald-700">Correct! +🪙 {COIN_REWARD}</div>
      ) : (
        <>
          <div className="mt-2 rounded-2xl bg-white border-2 border-slate-200 px-3 py-3 text-lg font-display font-extrabold leading-snug break-words text-slate-800">{chal.prompt}</div>
          <div className={`mt-2 h-11 rounded-xl border-2 flex items-center justify-center text-2xl font-display font-extrabold tabular-nums ${state === 'wrong' ? 'border-rose-300 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-900'}`}>
            {input || (state === 'wrong' ? 'Try again!' : '?')}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del'].map((k) => (
              <button key={k} type="button" onClick={() => setInput((v) => (k === 'del' ? v.slice(0, -1) : k === '-' ? (v.startsWith('-') ? v.slice(1) : '-' + v) : v.length < 6 ? v + k : v))} className="min-h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-display font-extrabold text-slate-800 active:translate-y-0.5">
                {k === 'del' ? '⌫' : k}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setHelp(true)} aria-label="How to solve" className="min-h-10 rounded-2xl bg-white border-2 border-indigo-200 text-indigo-700 font-display font-extrabold text-sm">📝</button>
            <button type="button" onClick={submit} disabled={!input.trim()} className="col-span-2 min-h-10 rounded-2xl bg-emerald-500 disabled:bg-slate-300 text-white font-display font-extrabold text-sm">Check</button>
          </div>
        </>
      )}
      <ProblemAidDrawer prompt={chal.prompt} open={help} onClose={() => setHelp(false)} />
    </motion.div>
  );
}
