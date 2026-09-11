import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot, type MascotMood } from './Mascot';
import {
  AGE_RANGE,
  GRADE_LEVELS,
  COURSES,
  courseForGrade,
  recommendationReason,
} from '../data/courses';

interface Props {
  /** Called with the answers; both are required before this can fire. */
  onDone: (age: number, gradeLevel: number) => void;
  /** Prefilled when someone is editing rather than starting out. */
  initialAge?: number | null;
  initialGrade?: number | null;
}

const CARDS: { emoji: string; mood: MascotMood; title: string; body: string }[] = [
  {
    emoji: '⭐',
    mood: 'cheer',
    title: 'Earn stars & stickers',
    body: 'Answer without hints or mistakes to earn 3 stars. Collect stickers across streaks, accuracy, XP, and more!',
  },
  {
    emoji: '⚡',
    mood: 'proud',
    title: 'Hit your daily goal',
    body: 'Earn XP every day to fill your goal ring and build a streak. A little practice each day adds up fast.',
  },
];

const AGES = Array.from(
  { length: AGE_RANGE.max - AGE_RANGE.min + 1 },
  (_, i) => AGE_RANGE.min + i,
);

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-xl border-2 px-3 font-display text-sm font-bold transition-colors ${
        selected
          ? 'border-accent bg-accent text-on-accent'
          : 'border-line bg-surface-2 text-ink-muted hover:border-accent/50 hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}

export function Onboarding({ onDone, initialAge = null, initialGrade = null }: Props) {
  // Step 0 is the age/grade question and cannot be skipped — everything after
  // it is the usual tour.
  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | null>(initialAge);
  const [grade, setGrade] = useState<number | null>(initialGrade);

  const answered = age !== null && grade !== null;
  const suggested = grade !== null ? COURSES.find((c) => c.id === courseForGrade(grade)) : null;

  const finish = () => {
    if (age === null || grade === null) return;
    onDone(age, grade);
  };

  const card = step > 0 ? CARDS[step - 1] : null;
  const lastCard = step - 1 === CARDS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={step === 0 ? 'Tell us about you' : 'Welcome tour'}
      >
        <motion.div
          key={step}
          initial={{ scale: 0.85, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-surface px-6 py-7 shadow-2xl sm:px-7"
        >
          {step === 0 ? (
            <>
              <div className="flex justify-center">
                <Mascot mood="happy" size={72} oneShot />
              </div>
              <h2 className="mt-3 text-center font-display text-xl font-extrabold text-ink">
                First — who&apos;s learning?
              </h2>
              <p className="mt-1.5 text-center text-sm text-ink-muted">
                Two taps, and we&apos;ll point you at the right course.
              </p>

              <div className="mt-5">
                <div className="font-display text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
                  How old are you?
                </div>
                <div className="mt-2 grid grid-cols-6 gap-1.5">
                  {AGES.map((a) => (
                    <Chip
                      key={a}
                      label={a === AGE_RANGE.max ? `${a}+` : String(a)}
                      selected={age === a}
                      onClick={() => setAge(a)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="font-display text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
                  What grade are you in?
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {GRADE_LEVELS.map((g) => (
                    <Chip
                      key={g.value}
                      label={g.label}
                      selected={grade === g.value}
                      onClick={() => setGrade(g.value)}
                    />
                  ))}
                </div>
              </div>

              {suggested && grade !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl border-2 p-3"
                  style={{ borderColor: `${suggested.color}66`, background: `${suggested.color}14` }}
                >
                  <div className="font-display text-[12px] font-extrabold text-ink">
                    {suggested.emoji} We&apos;ll start you in {suggested.name}
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">
                    {recommendationReason(grade)} You can still open any course you like.
                  </p>
                </motion.div>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={!answered}
                className="mt-5 min-h-12 w-full rounded-2xl bg-duo-green px-6 py-2.5 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition-all hover:bg-duo-green-dark active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-line-strong disabled:shadow-none disabled:active:translate-y-0"
              >
                {answered ? 'Next' : 'Pick an age and a grade'}
              </button>
              <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-dim">
                This stays on your device — it only decides which course we suggest.
              </p>
            </>
          ) : (
            card && (
              <div className="text-center">
                <div className="flex justify-center">
                  <Mascot mood={card.mood} size={88} oneShot />
                </div>
                <div className="mt-2 text-5xl">{card.emoji}</div>
                <h2 className="mt-3 font-display text-xl font-extrabold text-ink">{card.title}</h2>
                <p className="mt-2 text-sm text-ink-muted">{card.body}</p>

                <div className="mt-5 flex justify-center gap-2">
                  {CARDS.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-2 w-2 rounded-full ${idx === step - 1 ? 'bg-duo-green' : 'bg-line-strong'}`}
                    />
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => (lastCard ? finish() : setStep(step + 1))}
                    className="min-h-12 w-full rounded-2xl bg-duo-green px-6 py-2.5 font-display font-extrabold text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] transition-all hover:bg-duo-green-dark active:translate-y-0.5"
                  >
                    {lastCard ? "Let's go!" : 'Next'}
                  </button>
                  {!lastCard && (
                    <button
                      type="button"
                      onClick={finish}
                      className="font-display text-sm font-bold text-ink-dim hover:text-ink-muted"
                    >
                      Skip the tour
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
