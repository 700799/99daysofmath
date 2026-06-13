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
  /** Beat index — controls which video segment plays. Title card is -1. */
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
    {
      head: story.title.replace(/^Story[:\s]+/i, ''),
      body: story.subtitle ?? '',
      beatIdx: -1,
      kind: 'title',
    },
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
 * - Top: the Manim animation video (graphics-only — no baked-in text).
 * - Bottom: a solid white card with the head + body sentence for THIS slide.
 *   Back / Continue buttons are dog-mascot pills, big and thumb-friendly.
 * - Each beat's video segment is bounded by the chapters.json sidecar.
 *   The slide deck plays the segment ONCE when we enter a new beat, then
 *   freezes on the last frame. Advancing to another sentence of the SAME beat
 *   leaves the video alone — no rewind, no "reset" feel.
 * - The kid drives every transition (no auto-advance timer).
 */
export function StorySlide({ story, onClose }: Props) {
  const slides = buildSlides(story);
  const totalSlides = slides.length;

  const [idx, setIdx] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chaptersRef = useRef<Chapters | null>(null);
  const segmentEndRef = useRef<number>(Infinity);
  /** The beatIdx whose segment is currently loaded in the video. -2 means
   *  "nothing loaded yet" so the very first slide always triggers a seek. */
  const lastBeatRef = useRef<number>(-2);

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
      return { start: 0, end: Infinity };
    }
    if (beat < 0) {
      // Title card → play the very first segment (intro / subtitle area).
      return { start: 0, end: ch.checkpoints[0] ?? ch.total };
    }
    // Beat i runs from checkpoint[i] to checkpoint[i+1]. We have one
    // checkpoint at the start (from the subtitle break) so beat 0's start is
    // checkpoint[0], beat 1's start is checkpoint[1], etc.
    const start = ch.checkpoints[beat] ?? 0;
    const end = ch.checkpoints[beat + 1] ?? ch.total;
    return { start, end };
  };

  // Slide change: only touch the video when we're moving to a NEW beat.
  // Same-beat advances (e.g. sentence 1 → sentence 2) leave the video frozen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const beatIdx = slides[idx].beatIdx;
    if (lastBeatRef.current === beatIdx) {
      // Same segment — text changed but the visual stays put.
      return;
    }
    lastBeatRef.current = beatIdx;

    const startVideo = () => {
      const seg = segmentFor(idx);
      segmentEndRef.current = seg.end;
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
      return () => v.removeEventListener('loadedmetadata', startVideo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Pause at the segment end → freeze on the last frame.
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
  const atStart = idx <= 0;
  const atEnd = idx >= totalSlides - 1;

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
      <div className="h-1 bg-black/60 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-[width] duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* video stage — graphics fill the top half */}
      <button
        type="button"
        onClick={advance}
        className="relative flex-1 min-h-0 w-full text-left bg-black"
        aria-label="Tap to continue"
      >
        <video
          ref={videoRef}
          src={url}
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-contain bg-black"
          onTimeUpdate={onTimeUpdate}
        />
      </button>

      {/* big solid text card — always visible, holds the current sentence */}
      <div
        className="shrink-0 bg-white text-slate-900 rounded-t-3xl px-5 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-6 shadow-[0_-12px_30px_rgba(0,0,0,0.4)]"
        style={{ minHeight: '42vh' }}
      >
        <div className="flex flex-col h-full min-h-[36vh]">
          {/* head pill */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {slide.kind === 'beat' && (
              <div className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-violet-600">
                {slide.head}
              </div>
            )}
            {slide.kind === 'title' && (
              <div className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-amber-600">
                Math Story · {story.domain}
              </div>
            )}
            {slide.kind === 'learned' && (
              <div className="text-xs sm:text-sm font-display font-extrabold uppercase tracking-wider text-emerald-600">
                🎓 What you learned
              </div>
            )}
            <div className="text-[11px] sm:text-xs font-display font-bold text-slate-400 tabular-nums shrink-0">
              {idx + 1} / {totalSlides}
            </div>
          </div>

          {/* body sentence — big and readable */}
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className={
                slide.kind === 'title'
                  ? 'font-display font-extrabold text-3xl sm:text-5xl text-slate-900 leading-tight'
                  : slide.kind === 'learned'
                    ? 'font-display font-extrabold text-2xl sm:text-3xl text-emerald-800 leading-snug'
                    : 'font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-snug'
              }
            >
              {slide.body || (slide.kind === 'title' ? story.title.replace(/^Story[:\s]+/i, '') : '')}
            </motion.p>
          </AnimatePresence>

          <div className="flex-1" />

          {/* mascot-dog nav buttons */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={back}
              disabled={atStart}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full h-14 px-5 sm:px-7 bg-slate-200 hover:bg-slate-300 active:-translate-x-1 text-slate-800 font-display font-extrabold text-base sm:text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-transform"
              data-haptic="tap"
              aria-label="Back"
            >
              <span aria-hidden="true" className="inline-block scale-x-[-1] text-xl">🐕</span>
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={advance}
              disabled={atEnd}
              className="flex-[2] sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full h-14 px-6 sm:px-8 bg-emerald-500 hover:bg-emerald-600 active:translate-x-1 text-white font-display font-extrabold text-lg sm:text-xl shadow-lg shadow-emerald-500/30 disabled:bg-slate-400 disabled:shadow-none transition-transform"
              data-haptic="tap"
              aria-label={atEnd ? 'Done' : 'Continue'}
            >
              <span>{atEnd ? '✓ Done' : 'Continue'}</span>
              {!atEnd && (
                <span aria-hidden="true" className="inline-block text-xl">🐕</span>
              )}
              {!atEnd && <span aria-hidden="true" className="text-base">🐾</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
