import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tapHaptic } from '../utils/haptics';
import { useStoryPlayer } from '../state/storyPlayer';

interface Beat {
  head: string;
  body: string;
  visual?: string;
}

interface Story {
  title: string;
  subtitle?: string;
  beats: Beat[];
  learned?: string;
  domain: string;
  unit: number;
  videoSrc: string;
}

interface Chapters {
  checkpoints: number[];
  total: number;
}

interface Props {
  story: Story;
  /** Optional handler for "back to library" close button. */
  onClose?: () => void;
}

interface Slide {
  /** Section header. */
  head: string;
  /** The complete idea for this slide (a whole beat, shown in full). */
  body: string;
  /** Beat index — controls which video segment plays. */
  beatIdx: number;
  /** Slide kind for styling. */
  kind: 'title' | 'beat' | 'learned';
}

// One slide per beat: the WHOLE idea (heading + full paragraph) on a single
// screen, big and complete. No sentence-splitting, no auto-advance — the reader
// moves only when they press a button.
function buildSlides(story: Story): Slide[] {
  const slides: Slide[] = [
    { head: story.title.replace(/^Story[:\s]+/i, ''), body: story.subtitle ?? '', beatIdx: -1, kind: 'title' },
  ];
  story.beats.forEach((b, bi) => {
    slides.push({ head: b.head, body: b.body, beatIdx: bi, kind: 'beat' });
  });
  if (story.learned) {
    slides.push({
      head: 'What you learned',
      body: story.learned,
      beatIdx: story.beats.length - 1,
      kind: 'learned',
    });
  }
  return slides;
}

/**
 * Kid-paced story player — advances ONLY on a button press.
 * - Background: the Manim animation video, NO native controls. Each beat plays
 *   its own segment, then freezes on the last frame so the reader can study it.
 * - The complete idea for each beat is shown at once, large and high-contrast,
 *   in a scrollable panel so nothing is ever cut off.
 * - Move with the big Continue / Back buttons, ← → / Space keys, or a horizontal
 *   swipe. There is no timer — it never advances on its own.
 */
export function StorySlide({ story, onClose }: Props) {
  const slides = buildSlides(story);

  const idx = useStoryPlayer((s) => s.slideIndex);
  const animationDone = useStoryPlayer((s) => s.animationDone);
  const setStory = useStoryPlayer((s) => s.setStory);
  const setAnimationDone = useStoryPlayer((s) => s.setAnimationDone);
  const nextSlide = useStoryPlayer((s) => s.nextSlide);
  const prevSlide = useStoryPlayer((s) => s.prevSlide);

  // Initialize story session on mount or when story changes
  useEffect(() => {
    setStory(story.videoSrc, slides.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.videoSrc]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [chaptersLoaded, setChaptersLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chaptersRef = useRef<Chapters | null>(null);
  const segmentEndRef = useRef<number>(Infinity);
  const lastSegRef = useRef<{ start: number; end: number } | null>(null);

  const url = `${import.meta.env.BASE_URL}videos/lessons/${story.videoSrc}`;
  const chaptersUrl = url.replace(/\.mp4$/, '.chapters.json');

  // Load chapters once.
  useEffect(() => {
    let cancelled = false;
    setChaptersLoaded(false);
    fetch(chaptersUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Chapters | null) => {
        if (cancelled) return;
        if (j && Array.isArray(j.checkpoints)) {
          chaptersRef.current = j;
        }
        lastSegRef.current = null;
        setChaptersLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setChaptersLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chaptersUrl]);

  // Map a slide index to its [start, end] in the underlying video. Beats past
  // the video's rendered segments (stories now have MORE beats than the video
  // has chapters) clamp to the final segment, freezing on the last frame.
  const segmentFor = (slideIdx: number): { start: number; end: number } => {
    const beat = slides[slideIdx].beatIdx;
    const ch = chaptersRef.current;
    if (!ch) return { start: 0, end: Infinity };
    if (beat < 0) return { start: 0, end: ch.checkpoints[0] ?? ch.total };
    const b = Math.min(beat, Math.max(0, ch.checkpoints.length - 1));
    const start = ch.checkpoints[b] ?? 0;
    const end = ch.checkpoints[b + 1] ?? ch.total;
    return { start, end };
  };

  // When the slide changes, seek + play the matching segment.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const seg = segmentFor(idx);
    segmentEndRef.current = seg.end;

    const last = lastSegRef.current;
    if (last && last.start === seg.start && last.end === seg.end) {
      setAnimationDone(true);
      return;
    }
    lastSegRef.current = seg;
    setAnimationDone(true);

    const startVideo = () => {
      try {
        v.currentTime = seg.start + 0.01;
      } catch {
        /* not ready yet */
      }
      v.play().catch(() => {});
    };
    if (v.readyState >= 1) {
      startVideo();
    } else {
      v.addEventListener('loadedmetadata', startVideo, { once: true });
    }
    return () => {
      v.removeEventListener('loadedmetadata', startVideo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, chaptersLoaded]);

  // Pause when we hit the segment end → freeze on the last frame.
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime >= segmentEndRef.current - 0.05) {
      v.pause();
      try {
        v.currentTime = Math.max(0, segmentEndRef.current - 0.1);
      } catch {
        /* ignore */
      }
    }
  };

  // Re-watch the current beat's clip on demand (a button press, never a timer).
  const replayClip = () => {
    const v = videoRef.current;
    if (!v) return;
    const seg = segmentFor(idx);
    segmentEndRef.current = seg.end;
    try {
      v.currentTime = seg.start + 0.01;
    } catch {
      /* ignore */
    }
    v.play().catch(() => {});
    tapHaptic();
  };

  // Pause + release on unmount.
  useEffect(() => {
    return () => {
      try {
        videoRef.current?.pause();
      } catch {
        /* ignore */
      }
    };
  }, []);

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        nextSlide();
        tapHaptic();
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
        tapHaptic();
      }
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  // Horizontal swipe to turn pages (vertical scrolling stays free for long text).
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0]?.clientX ?? null);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStart;
    if (delta > 60) {
      prevSlide();
      tapHaptic();
    } else if (delta < -60) {
      nextSlide();
      tapHaptic();
    }
    setTouchStart(null);
  };

  const slide = slides[idx];
  const isLast = idx >= slides.length - 1;

  return (
    <div
      className="relative w-full bg-slate-950 text-white flex flex-col"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ── Header — the story title, big, at the very top. ── */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0 bg-black/50 backdrop-blur border-b border-white/10">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-violet-300">
            🌟 Math Story · {story.domain} · Unit {story.unit}
          </div>
          <h1 className="font-display font-extrabold text-white leading-tight text-lg sm:text-2xl md:text-3xl">
            {story.title}
          </h1>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white font-display font-extrabold text-lg shrink-0"
            data-haptic="tap"
          >
            ✕
          </button>
        )}
      </div>

      {/* progress bar */}
      <div className="h-1.5 bg-black/60 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-[width] duration-500"
          style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* ── Stage — text on the left (scrollable, complete), video on the right.
          Stacks on phones (video on top, text below) via flex-col-reverse so the
          reading order stays natural. No tap-to-advance: turning pages is done
          with the buttons below, the arrow keys, or a horizontal swipe — so long
          ideas can be read and scrolled without skipping. ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 min-h-0 w-full flex flex-col-reverse md:flex-row select-none"
      >
        {/* LEFT half — big, high-contrast narration; scrolls if the idea is long. */}
        <div className="relative flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 py-6 md:py-10">
          <AnimatePresence mode="wait">
            {animationDone && (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex min-h-full flex-col items-start justify-center text-left gap-4 max-w-2xl mx-auto md:mx-0"
              >
                {slide.kind === 'learned' && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 px-4 py-1.5 text-sm sm:text-base font-display font-extrabold uppercase tracking-wider text-emerald-200">
                    ✅ What you learned
                  </div>
                )}
                {slide.kind === 'beat' && (
                  <div className="text-lg sm:text-xl font-display font-extrabold uppercase tracking-wide text-violet-300">
                    {slide.head}
                  </div>
                )}
                <p
                  className={
                    'font-display font-extrabold text-white drop-shadow-lg ' +
                    (slide.kind === 'title'
                      ? 'leading-snug text-3xl sm:text-4xl md:text-5xl'
                      : 'leading-relaxed text-2xl sm:text-3xl md:text-[2.5rem]')
                  }
                >
                  {slide.kind === 'title' ? slide.body || slide.head : slide.body}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT half — the video illustration with a Replay-clip button. */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black md:border-l border-white/10 overflow-hidden">
          <video
            ref={videoRef}
            src={url}
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
            onTimeUpdate={onTimeUpdate}
          />
          <button
            type="button"
            onClick={replayClip}
            className="absolute bottom-3 right-3 rounded-full bg-white/90 hover:bg-white text-slate-900 font-display font-extrabold text-sm px-4 h-10 shadow-lg active:translate-y-0.5"
            data-haptic="tap"
          >
            ↻ Replay clip
          </button>
        </div>
      </div>

      {/* ── Nav bar — big pill buttons; the only way to turn the page. ── */}
      <div className="px-4 sm:px-6 pb-4 pt-3 shrink-0 flex items-center justify-between gap-3 bg-black/60 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            prevSlide();
            tapHaptic();
          }}
          disabled={idx <= 0}
          className="rounded-full bg-white/15 hover:bg-white/25 active:translate-y-0.5 text-white font-display font-extrabold text-base sm:text-lg px-6 sm:px-8 h-14 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition"
          data-haptic="tap"
        >
          ← Back
        </button>
        <div className="text-sm font-display font-bold text-white/60 tabular-nums shrink-0">
          {idx + 1} / {slides.length}
        </div>
        <button
          type="button"
          onClick={() => {
            if (isLast) onClose?.();
            else nextSlide();
            tapHaptic();
          }}
          className="rounded-full bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 text-white font-display font-extrabold text-lg sm:text-xl px-8 sm:px-10 h-14 shadow-lg shadow-emerald-500/30 transition"
          data-haptic="tap"
        >
          {isLast ? '✓ Done' : 'Continue ▶'}
        </button>
      </div>
    </div>
  );
}
