import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tapHaptic } from '../utils/haptics';

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

const AUTOPLAY_KEY = 'story:autoplay';

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
  const totalSlides = slides.length;

  const [idx, setIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(AUTOPLAY_KEY) === 'on';
  });
  const [animationDone, setAnimationDone] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chaptersRef = useRef<Chapters | null>(null);
  const segmentEndRef = useRef<number>(Infinity);

  const url = `${import.meta.env.BASE_URL}videos/lessons/${story.videoSrc}`;
  const chaptersUrl = url.replace(/\.mp4$/, '.chapters.json');

  // Load chapters once.
  useEffect(() => {
    let cancelled = false;
    fetch(chaptersUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Chapters | null) => {
        if (!cancelled && j && Array.isArray(j.checkpoints)) {
          chaptersRef.current = j;
        }
      })
      .catch(() => {});
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
    setAnimationDone(false);

    const seg = segmentFor(idx);
    segmentEndRef.current = seg.end;
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
  }, [idx]);

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
    const id = window.setTimeout(() => advance(), ms);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, animationDone, idx]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTOPLAY_KEY, autoPlay ? 'on' : 'off');
    }
  }, [autoPlay]);

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') advance();
      if (e.key === 'ArrowLeft') back();
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, onClose]);

  const advance = () => {
    if (idx >= totalSlides - 1) return;
    tapHaptic();
    setIdx((n) => Math.min(totalSlides - 1, n + 1));
  };
  const back = () => {
    if (idx <= 0) return;
    tapHaptic();
    setIdx((n) => Math.max(0, n - 1));
  };

  const slide = slides[idx];
  const progressPct = ((idx + 1) / totalSlides) * 100;

  return (
    <div
      className="relative w-full bg-black text-white flex flex-col"
      style={{
        minHeight: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* slim header */}
      <div className="px-4 py-2 flex items-center justify-between gap-3 shrink-0 bg-black/40 backdrop-blur">
        <div className="min-w-0">
          <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-violet-300">
            🌟 Math Story · {story.domain} · Unit {story.unit}
          </div>
          <div className="text-sm font-display font-extrabold text-white truncate">
            {story.title.replace(/^Story[:\s]+/i, '')}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAutoPlay((v) => !v)}
            aria-pressed={autoPlay}
            className={
              'inline-flex items-center gap-1 rounded-full px-3 h-8 text-xs font-display font-extrabold border-2 ' +
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
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white font-display font-extrabold text-lg"
              data-haptic="tap"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* progress bar */}
      <div className="h-1 bg-black/60 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-[width] duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* video stage — animation fills the upper portion */}
      <button
        type="button"
        onClick={advance}
        className="relative flex-1 min-h-0 w-full text-left"
        aria-label="Tap to continue"
      >
        <video
          ref={videoRef}
          src={url}
          muted
          playsInline
          preload="metadata"
          // No native controls — we drive playback ourselves.
          className="absolute inset-0 w-full h-full object-contain bg-black"
          onTimeUpdate={onTimeUpdate}
        />

        {/* dimming gradient at the bottom so the text overlay reads cleanly */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/50 to-transparent pointer-events-none" />

        {/* text overlay — appears AFTER the animation finishes its segment */}
        <AnimatePresence mode="wait">
          {animationDone && (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="absolute left-0 right-0 bottom-3 sm:bottom-6 px-5 sm:px-10 flex flex-col items-center text-center"
            >
              {slide.kind === 'beat' && (
                <div className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-violet-300 mb-2">
                  {slide.head}
                </div>
              )}
              <p
                className={
                  slide.kind === 'title'
                    ? 'font-display font-extrabold text-3xl sm:text-5xl text-white leading-tight drop-shadow-lg max-w-2xl'
                    : slide.kind === 'learned'
                      ? 'font-display font-extrabold text-xl sm:text-3xl text-emerald-200 leading-snug drop-shadow-lg max-w-2xl'
                      : 'font-display font-extrabold text-xl sm:text-3xl text-white leading-snug drop-shadow-lg max-w-2xl'
                }
              >
                {slide.body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* watching-the-animation hint */}
        {!animationDone && (
          <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
            <span className="text-white/60 text-xs font-display font-bold uppercase tracking-wider">
              Watching…
            </span>
          </div>
        )}
      </button>

      {/* nav bar */}
      <div className="px-4 pb-4 pt-2 shrink-0 flex items-center justify-between gap-2 bg-black/60 border-t border-white/10">
        <button
          type="button"
          onClick={back}
          disabled={idx <= 0}
          className="rounded-full bg-white/15 hover:bg-white/25 text-white font-display font-extrabold text-base px-5 h-12 disabled:opacity-30 disabled:cursor-not-allowed"
          data-haptic="tap"
        >
          ← Back
        </button>
        <div className="text-xs font-display font-bold text-white/60 tabular-nums">
          {idx + 1} / {totalSlides}
        </div>
        <button
          type="button"
          onClick={advance}
          disabled={idx >= totalSlides - 1}
          className="rounded-full bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 text-white font-display font-extrabold text-lg px-7 h-14 shadow-lg shadow-emerald-500/30 disabled:bg-slate-600 disabled:shadow-none transition"
          data-haptic="tap"
        >
          {idx >= totalSlides - 1 ? '✓ Done' : 'Continue ▶'}
        </button>
      </div>
    </div>
  );
}
