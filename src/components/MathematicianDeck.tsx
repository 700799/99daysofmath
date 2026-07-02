import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';
import type { MathematicianDeck as Deck } from '../data/mathematicianDecks';

// Full-screen slide player for a mathematician's story — the same look and
// controls as the Math Stories player (StorySlide): big readable narration on
// the left, a LARGE emoji-scene illustration on the right, Continue ▶ / Back
// pills, keyboard arrows, and swipe. Advances ONLY on a button press; each
// slide has a short minimum-read gate (scaled by the admin's
// lessonScreenSeconds; 0 disables) so kids actually read before continuing.
export function MathematicianDeckPlayer({ deck, onClose }: { deck: Deck; onClose: () => void }) {
  const [idx, setIdx] = useState(0); // 0 = title slide; 1..n = deck.slides
  const total = deck.slides.length + 1;
  const isLast = idx >= total - 1;

  // min-read gate: 4s per slide at the default setting (6 = 1×; 0 = off)
  const screenSecs = useProgress((s) => s.arcadeConfig.lessonScreenSeconds ?? 6);
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
  const visual = slide?.visual ?? deck.emoji;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-slate-950 text-white"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="dialog"
      aria-label={`${deck.name} story`}
    >
      {/* header */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black/50 px-4 py-3 backdrop-blur sm:px-6">
        <div className="min-w-0">
          <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-violet-300 sm:text-xs">
            🧑‍🔬 Famous Mathematician · {deck.era}
          </div>
          <h1 className="font-display text-lg font-extrabold leading-tight text-white sm:text-2xl">
            {deck.emoji} {deck.name}
          </h1>
        </div>
        <button type="button" onClick={onClose} aria-label="Close"
          className="h-10 w-10 shrink-0 rounded-full bg-white/15 font-display text-lg font-extrabold text-white hover:bg-white/25" data-haptic="tap">
          ✕
        </button>
      </div>

      {/* progress */}
      <div className="h-1.5 shrink-0 bg-black/60">
        <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-[width] duration-500"
          style={{ width: `${((idx + 1) / total) * 100}%` }} />
      </div>

      {/* stage: narration left, big emoji-scene illustration right (stacks on phones) */}
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
                  <div className="font-display text-lg font-extrabold uppercase tracking-wide text-violet-300 sm:text-xl">
                    {slide.head}
                  </div>
                  <p className="whitespace-pre-line font-display text-2xl font-extrabold leading-relaxed text-white drop-shadow-lg sm:text-3xl">
                    {slide.body}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl font-extrabold leading-snug text-white drop-shadow-lg sm:text-4xl md:text-5xl">
                    {deck.name}
                  </p>
                  <p className="font-display text-xl font-extrabold text-violet-200 sm:text-2xl">{deck.era}</p>
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400/60 bg-emerald-500/20 px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wider text-emerald-200 sm:text-base">
                    📘 Connects to: {deck.tieIn}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* illustration pane — the emoji scene, drawn HUGE */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 to-violet-900 md:border-l md:border-white/10">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="select-none text-center leading-none tracking-tight"
              style={{ fontSize: 'min(22vw, 11rem)' }}
              aria-hidden="true">
              {visual}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* nav */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-black/60 px-4 pb-4 pt-3 sm:px-6">
        <button type="button" onClick={back} disabled={idx <= 0}
          className="h-14 rounded-full bg-white/15 px-6 font-display text-base font-extrabold text-white shadow-lg transition hover:bg-white/25 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30 sm:px-8 sm:text-lg" data-haptic="tap">
          ← Back
        </button>
        <div className="shrink-0 font-display text-sm font-bold tabular-nums text-white/60">
          {idx + 1} / {total}
        </div>
        <button type="button" onClick={next} disabled={remain > 0}
          className="h-14 rounded-full bg-emerald-500 px-8 font-display text-lg font-extrabold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/50 disabled:shadow-none sm:px-10 sm:text-xl" data-haptic="tap">
          {remain > 0 ? `Read… ${remain}s` : isLast ? '✓ Done' : 'Continue ▶'}
        </button>
      </div>
    </div>
  );
}
