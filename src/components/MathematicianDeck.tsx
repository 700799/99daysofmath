import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';
import type { MathematicianDeck as Deck } from '../data/mathematicianDecks';
import { MathFigureView } from './MathFigure';

// Full-screen slide player for a mathematician's story and for every Math
// Story: big readable narration on one half, the slide's mathematical figure
// drawn large on the other, Continue
// ▶ / Back pills, keyboard arrows, and swipe. Advances ONLY on a button press; each
// slide has a short minimum-read gate (scaled by the admin's
// lessonScreenSeconds; 0 disables) so kids actually read before continuing.
const THEMES = {
  dark: {
    root: 'bg-slate-950 text-white',
    bar: 'border-white/10 bg-black/50',
    kicker: 'text-violet-300',
    strong: 'text-white',
    body: 'text-white drop-shadow-lg',
    sub: 'text-violet-200',
    ghost: 'bg-white/15 text-white hover:bg-white/25',
    track: 'bg-black/60',
    pane: 'bg-gradient-to-br from-indigo-950 to-violet-900 md:border-white/10',
    chip: 'border-emerald-400/60 bg-duo-green/20 text-emerald-200 hover:bg-duo-green/35',
    count: 'text-white/60',
  },
  light: {
    root: 'bg-stone-50 text-slate-900',
    bar: 'border-stone-200 bg-white/90',
    kicker: 'text-violet-700',
    strong: 'text-slate-900',
    body: 'text-slate-900',
    sub: 'text-slate-600',
    ghost: 'bg-stone-200 text-slate-800 hover:bg-stone-300',
    track: 'bg-stone-200',
    pane: 'bg-white border-stone-200 border-b md:border-b-0',
    chip: 'border-emerald-600/50 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
    count: 'text-slate-500',
  },
} as const;

export function MathematicianDeckPlayer({
  deck,
  onClose,
  kicker = '🧑‍🔬 Famous Mathematician',
  theme = 'dark',
}: {
  deck: Deck;
  onClose: () => void;
  /** The small line above the title in the header. */
  kicker?: string;
  /** 'light' is a neutral off-white player with figures recoloured to match. */
  theme?: 'dark' | 'light';
}) {
  const T = THEMES[theme];
  const [idx, setIdx] = useState(0); // 0 = title slide; 1..n = deck.slides
  const total = deck.slides.length + 1;
  const isLast = idx >= total - 1;

  // min-read gate: 4s per slide at the default setting (6 = 1×; 0 = off)
  const screenSecs = useProgress((s) => s.arcadeConfig.lessonScreenSeconds ?? 0);
  const [remain, setRemain] = useState(0);
  useEffect(() => {
    if (screenSecs <= 0) { setRemain(0); return; }
    const secs = Math.max(1, Math.round(4 * (screenSecs / 6)));
    setRemain(secs);
    const id = window.setInterval(() => setRemain((r) => (r <= 1 ? 0 : r - 1)), 1000);
    return () => window.clearInterval(id);
  }, [idx, screenSecs]);

  const next = () => { if (remain > 0) return; if (isLast) onClose(); else setIdx((i) => i + 1); };
  const back = () => setIdx((i) => Math.max(0, i - 1));

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') next();
      else if (e.key === 'ArrowLeft') back();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, remain]);

  // swipe
  const [touchX, setTouchX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx < -60) next();
    else if (dx > 60) back();
    setTouchX(null);
  };

  const slide = idx === 0 ? null : deck.slides[idx - 1];

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col ${T.root}`}
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="dialog"
      aria-label={`${deck.name} story`}
    >
      {/* header */}
      <div className={`flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur sm:px-6 ${T.bar}`}>
        <div className="min-w-0">
          <div className={`text-[10px] font-display font-extrabold uppercase tracking-wider sm:text-xs ${T.kicker}`}>
            {kicker} · {deck.era}
          </div>
          <h1 className={`font-display text-lg font-extrabold leading-tight sm:text-2xl ${T.strong}`}>
            {deck.emoji} {deck.name}
          </h1>
        </div>
        <button type="button" onClick={onClose} aria-label="Close"
          className={`h-10 w-10 shrink-0 rounded-full font-display text-lg font-extrabold ${T.ghost}`} data-haptic="tap">
          ✕
        </button>
      </div>

      {/* progress */}
      <div className={`h-1.5 shrink-0 ${T.track}`}>
        <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-[width] duration-500"
          style={{ width: `${((idx + 1) / total) * 100}%` }} />
      </div>

      {/* stage: narration left, the slide's figure right (stacks on phones) */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        className="relative flex min-h-0 w-full flex-1 select-none flex-col-reverse md:flex-row">
        <div className="relative min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-10 md:py-10">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mx-auto flex min-h-full max-w-2xl flex-col items-start justify-center gap-4 text-left md:mx-0">
              {slide ? (
                <>
                  <div className={`font-display text-lg font-extrabold uppercase tracking-wide sm:text-xl ${T.kicker}`}>
                    {slide.head}
                  </div>
                  <p className={`whitespace-pre-line font-display text-2xl font-extrabold leading-relaxed sm:text-3xl ${T.body}`}>
                    {slide.body}
                  </p>
                </>
              ) : (
                <>
                  <p className={`font-display text-3xl font-extrabold leading-snug sm:text-4xl md:text-5xl ${T.body}`}>
                    {deck.name}
                  </p>
                  <p className={`font-display text-xl font-extrabold sm:text-2xl ${T.sub}`}>{deck.tagline ?? deck.era}</p>
                  {deck.tieInTo ? (
                    <Link
                      to={deck.tieInTo}
                      onClick={onClose}
                      className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wider ${T.chip} sm:text-base`}
                      data-haptic="tap"
                    >
                      📘 Connects to: {deck.tieIn} →
                    </Link>
                  ) : (
                    <div className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wider ${T.chip} sm:text-base`}>
                      📘 Connects to: {deck.tieIn}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* illustration pane — the mathematics itself, drawn large */}
        <div className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden md:border-l ${T.pane}`}>
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.25 }}
              className="flex h-full w-full select-none items-center justify-center">
              {slide ? (
                <MathFigureView figure={slide.figure} tone={theme} />
              ) : deck.portrait ? (
                <div
                  className="overflow-hidden rounded-[2rem] border-4 border-white/20 shadow-2xl [&>svg]:h-full [&>svg]:w-full"
                  style={{ width: 'min(60vw, 18rem)', height: 'min(60vw, 18rem)' }}
                  dangerouslySetInnerHTML={{ __html: deck.portrait }}
                />
              ) : (
                <span className="leading-none" style={{ fontSize: 'min(22vw, 11rem)' }} aria-hidden="true">
                  {deck.emoji}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* nav */}
      <div className={`flex shrink-0 items-center justify-between gap-3 border-t px-4 pb-4 pt-3 sm:px-6 ${T.bar}`}>
        <button type="button" onClick={back} disabled={idx <= 0}
          className={`h-14 rounded-full px-6 font-display text-base font-extrabold shadow-lg transition active:translate-y-0.5 ${T.ghost} disabled:cursor-not-allowed disabled:opacity-30 sm:px-8 sm:text-lg`} data-haptic="tap">
          ← Back
        </button>
        <div className={`shrink-0 font-display text-sm font-bold tabular-nums ${T.count}`}>
          {idx + 1} / {total}
        </div>
        <button type="button" onClick={next} disabled={remain > 0}
          className="h-14 rounded-full bg-duo-green px-8 font-display text-lg font-extrabold text-white shadow-lg shadow-black/20 transition hover:bg-duo-green-dark active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50 disabled:shadow-none sm:px-10 sm:text-xl" data-haptic="tap">
          {remain > 0 ? `Read… ${remain}s` : isLast ? '✓ Done' : 'Continue ▶'}
        </button>
      </div>
    </div>
  );
}
