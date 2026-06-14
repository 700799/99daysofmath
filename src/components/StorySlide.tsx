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
  /** Section header (constant across multi-sentence beats). */
  head: string;
  /** Single sentence to show on this slide. */
  body: string;
  /** Beat index — controls which video segment plays. */
  beatIdx: number;
  /** Slide kind for styling. */
  kind: 'title' | 'beat' | 'learned';
}

/** Split a paragraph into single sentences. Falls back to the whole text if
 *  there are no sentence breaks. */
function splitSentences(text: string): string[] {
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z"'])/);
  return parts.length > 0 ? parts.map((s) => s.trim()).filter(Boolean) : [text];
}

function buildSlides(story: Story): Slide[] {
  const slides: Slide[] = [
    { head: story.title.replace(/^Story[:\s]+/i, ''), body: story.subtitle ?? '', beatIdx: -1, kind: 'title' },
  ];
  story.beats.forEach((b, bi) => {
    const sentences = splitSentences(b.body);
    sentences.forEach((s) => {
      slides.push({ head: b.head, body: s, beatIdx: bi, kind: 'beat' });
    });
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
 * Kid-paced story player.
 * - Background: the Manim animation video, NO native controls.
 * - The video is segmented by the existing chapters.json checkpoints. Each
 *   beat plays its own segment, freezes on the last frame, then the text
 *   appears for the kid to read.
 * - Text overlays one sentence at a time. Tap "Continue" (or anywhere on the
 *   slide) to advance. Auto-play optional (6 s holds), default OFF.
 * - Cleanup pauses the video on unmount.
 */
export function StorySlide({ story, onClose }: Props) {
  const slides = buildSlides(story);

  // Use Zustand store for persistent state across component re-renders.
  // Select fields/actions individually — actions are stable references, so
  // they're safe in effect deps (selecting the whole store would return a new
  // reference on every change and cause an infinite render loop).
  const idx = useStoryPlayer((s) => s.slideIndex);
  const autoPlay = useStoryPlayer((s) => s.autoPlay);
  const animationDone = useStoryPlayer((s) => s.animationDone);
  const setStory = useStoryPlayer((s) => s.setStory);
  const setAnimationDone = useStoryPlayer((s) => s.setAnimationDone);
  const nextSlide = useStoryPlayer((s) => s.nextSlide);
  const prevSlide = useStoryPlayer((s) => s.prevSlide);
  const setAutoPlay = useStoryPlayer((s) => s.setAutoPlay);

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
  // The video segment that is currently loaded/frozen on screen. Used to avoid
  // replaying the same clip when several text slides share one beat segment.
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
        // Reset the dedup tracker and flag chapters ready so the seek effect
        // recomputes segments now that real checkpoints are available.
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

  // Map a slide index to its [start, end] in the underlying video.
  const segmentFor = (slideIdx: number): { start: number; end: number } => {
    const beat = slides[slideIdx].beatIdx;
    const ch = chaptersRef.current;
    if (!ch) {
      // No sidecar yet — let the video play from the start and the slide-deck
      // controls become a pure text reader.
      return { start: 0, end: Infinity };
    }
    if (beat < 0) {
      // Title card → play the very first segment.
      return { start: 0, end: ch.checkpoints[0] ?? ch.total };
    }
    const start = beat === 0 ? 0 : ch.checkpoints[beat - 1] ?? 0;
    const end = ch.checkpoints[beat] ?? ch.total;
    return { start, end };
  };

  // When the slide changes, seek + play the matching segment.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const seg = segmentFor(idx);
    segmentEndRef.current = seg.end;

    // If this slide maps to the SAME video segment as the slide we're already
    // showing (another sentence in the same beat, or beat 0 reusing the title
    // clip), don't replay the animation. Keep the frozen frame and just reveal
    // the new text. This stops the intro/title from re-printing on every tap.
    const last = lastSegRef.current;
    if (last && last.start === seg.start && last.end === seg.end) {
      setAnimationDone(true);
      return;
    }
    lastSegRef.current = seg;
    setAnimationDone(false);

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
      // Seek slightly before the boundary so the freeze shows the segment's
      // last interesting frame, not the next segment's first.
      try {
        v.currentTime = Math.max(0, segmentEndRef.current - 0.1);
      } catch {
        /* ignore */
      }
      setAnimationDone(true);
    }
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

  // Auto-play timer — only after animation finishes so kids actually see it.
  useEffect(() => {
    if (!autoPlay || !animationDone) return;
    const ms = slides[idx].kind === 'beat' ? 6000 : 8000;
    const id = window.setTimeout(() => {
      nextSlide();
      tapHaptic();
    }, ms);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, animationDone, idx]);

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

  // Touch swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStart;
    if (delta > 50) {
      // Swipe right → go back
      prevSlide();
      tapHaptic();
    } else if (delta < -50) {
      // Swipe left → advance
      nextSlide();
      tapHaptic();
    }
    setTouchStart(null);
  };

  const slide = slides[idx];

  return (
    <div
      className="relative w-full bg-slate-950 text-white flex flex-col"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ── Header — the story title, shown ONCE, big, at the very top. ── */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0 bg-black/50 backdrop-blur border-b border-white/10">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-violet-300">
            🌟 Math Story · {story.domain} · Unit {story.unit}
          </div>
          <h1 className="font-display font-extrabold text-white leading-tight text-lg sm:text-2xl md:text-3xl">
            {story.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAutoPlay(!autoPlay)}
            aria-pressed={autoPlay}
            className={
              'inline-flex items-center gap-1 rounded-full px-3 sm:px-4 h-9 text-xs sm:text-sm font-display font-extrabold border-2 ' +
              (autoPlay
                ? 'bg-violet-500/30 border-violet-400 text-violet-100'
                : 'bg-white/10 border-white/30 text-white/80')
            }
            data-haptic="tap"
          >
            {autoPlay ? '⏵ Auto on' : '⏵ Auto off'}
          </button>
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
      </div>

      {/* progress bar */}
      <div className="h-1.5 bg-black/60 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-[width] duration-500"
          style={{ width: `${((idx + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* ── Stage — half / half. On desktop: TEXT on the left, VIDEO on the
          right. On phones it stacks (video on top, text below) thanks to
          flex-col-reverse, so reading order stays natural. The onClick/touch
          handlers make the whole stage a giant "tap to continue" surface. ── */}
      <div
        onClick={() => {
          nextSlide();
          tapHaptic();
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 min-h-0 w-full flex flex-col-reverse md:flex-row cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label="Tap to continue"
      >
        {/* LEFT half — big, high-contrast narration that fills the space. */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center px-6 sm:px-10 py-6 md:py-8">
          <AnimatePresence mode="wait">
            {animationDone && (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-start md:items-start text-left gap-4 max-w-xl"
              >
                {slide.kind === 'learned' && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 px-4 py-1.5 text-sm sm:text-base font-display font-extrabold uppercase tracking-wider text-emerald-200">
                    ✅ What you learned
                  </div>
                )}
                {slide.kind !== 'title' && slide.kind !== 'learned' && (
                  <div className="text-base sm:text-lg font-display font-extrabold uppercase tracking-wide text-violet-300">
                    {slide.head}
                  </div>
                )}
                <p className="font-display font-extrabold text-white leading-snug drop-shadow-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  {/* The title is already in the header, so on the title slide
                      show the subtitle instead of repeating the name. */}
                  {slide.kind === 'title' ? slide.body || slide.head : slide.body}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT half — the video illustration, filling its half edge to edge. */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black md:border-l border-white/10 overflow-hidden">
          <video
            ref={videoRef}
            src={url}
            muted
            playsInline
            preload="metadata"
            // No native controls — we drive playback ourselves.
            className="w-full h-full object-contain bg-black"
            onTimeUpdate={onTimeUpdate}
          />
          {!animationDone && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none">
              <span className="rounded-full bg-black/60 px-3 py-1 text-white/70 text-xs font-display font-bold uppercase tracking-wider">
                Watching…
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Nav bar — big pill buttons. ── */}
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
            nextSlide();
            tapHaptic();
          }}
          disabled={idx >= slides.length - 1}
          className="rounded-full bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 text-white font-display font-extrabold text-lg sm:text-xl px-8 sm:px-10 h-14 shadow-lg shadow-emerald-500/30 disabled:bg-slate-600 disabled:shadow-none transition"
          data-haptic="tap"
        >
          {idx >= slides.length - 1 ? '✓ Done' : 'Continue ▶'}
        </button>
      </div>
    </div>
  );
}
