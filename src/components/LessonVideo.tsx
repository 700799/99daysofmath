import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';
import { useVideoLoadGate } from '../lib/useVideoLoadGate';

interface Props {
  src: string;
  title?: string;
  /** Lesson objective — shown as the lead line in the read panel. */
  objective?: string;
  /** The lesson's key-idea bullets — shown numbered in the read panel. */
  points?: string[];
  /** Browser preload hint; default 'metadata'. Unused on the launcher (no
   *  <video> mounts until the drawer opens) — kept for API compatibility. */
  preload?: 'none' | 'metadata' | 'auto';
}

const RATE_KEY = 'lesson:video-rate';

function getInitialRate(): number {
  if (typeof window === 'undefined') return 1;
  const v = window.localStorage.getItem(RATE_KEY);
  return v === '0.75' ? 0.75 : 1;
}

/**
 * Lesson-video launcher: a compact tappable tile that opens a big full-screen
 * player laid out like the Math Stories reader — a split panel with the
 * lesson's key idea on one side and the animation on the other, plus a clean
 * Continue bar. The player fills the screen (no letterboxed video floating in a
 * black void) and drops the native control bar for a story-style look.
 *
 * No <video> mounts (or fetches) until the drawer opens — important for the
 * library page which lists 100+ videos.
 */
export function LessonVideo({ src, title, objective, points }: Props) {
  const [open, setOpen] = useState(false);
  const label = title ?? 'Lesson animation';

  // Close on Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open video: ${label}`}
        className="group relative w-full block rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200 text-left aspect-video active:scale-[0.99] transition-transform"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <span className="rounded-full bg-white/95 shadow-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl text-slate-900">
            ▶
          </span>
          <span className="px-3 text-center font-display font-extrabold text-sm sm:text-base text-white drop-shadow line-clamp-2">
            {label}
          </span>
          <span className="text-[10px] sm:text-xs font-display font-bold text-white/80 uppercase tracking-wider">
            Tap to watch
          </span>
        </div>
      </button>

      <VideoPlayerModal
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        src={src}
        objective={objective}
        points={points}
      />
    </>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  src: string;
  objective?: string;
  points?: string[];
}

function VideoPlayerModal({ open, onClose, title, src, objective, points }: ModalProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="video-player"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-label={`Video: ${title}`}
        >
          <StoryVideoPlayer
            src={src}
            title={title}
            objective={objective}
            points={points}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/**
 * The full-screen playback surface, styled after the Math Stories reader
 * (StorySlide): a header, a thin video-progress bar, a split stage (key-idea
 * text | animation), and a bottom Continue bar. The animation plays STRAIGHT
 * THROUGH (no chapter pauses); the kid gets a Replay button, a 🐢 slow toggle,
 * and a Continue button that stays locked until the video has loaded + 2s.
 */
function StoryVideoPlayer({
  src,
  title,
  objective,
  points,
  onClose,
}: {
  src: string;
  title: string;
  objective?: string;
  points?: string[];
  onClose: () => void;
}) {
  const url = `${import.meta.env.BASE_URL}videos/lessons/${src}`;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 for the top bar
  const [rate, setRate] = useState<number>(() => getInitialRate());
  const completeVideo = useProgress((s) => s.completeVideo);
  const [coinAward, setCoinAward] = useState(0); // >0 → show the "you earned coins" toast

  // Lock Continue until the animation has loaded + 2s (admin "off" bypasses).
  const locked = useVideoLoadGate(ref, src);

  const hasText = !!objective || (points?.length ?? 0) > 0;

  // Apply + persist the playback rate.
  useEffect(() => {
    const v = ref.current;
    if (v) v.playbackRate = rate;
  }, [rate]);
  useEffect(() => {
    window.localStorage.setItem(RATE_KEY, String(rate));
  }, [rate]);

  // Autoplay on open; pause + release on unmount (drawer close).
  useEffect(() => {
    const v = ref.current;
    if (v) {
      v.playbackRate = rate;
      v.play().catch(() => {});
    }
    return () => {
      try {
        v?.pause();
      } catch {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replay = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    setCoinAward(0);
    v.play().catch(() => {});
  };

  return (
    <div
      className="relative w-full bg-slate-950 text-white flex flex-col"
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ── Header ── */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shrink-0 bg-black/50 backdrop-blur border-b border-white/10">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-sky-300">
            🎬 Animation
          </div>
          <h2 className="font-display font-extrabold text-white leading-tight text-lg sm:text-2xl truncate">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white font-display font-extrabold text-lg shrink-0"
        >
          ✕
        </button>
      </div>

      {/* video-progress bar (fills as it plays) */}
      <div className="h-1.5 bg-black/60 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-[width] duration-200"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* ── Stage — key idea (left/below) | animation (right/above). Stacks on
          phones (video on top) via flex-col-reverse. ── */}
      <div className="relative flex-1 min-h-0 w-full flex flex-col-reverse md:flex-row select-none">
        {/* READ panel — the lesson's key idea. Hidden entirely when there's no
            text so a text-less library video simply gives the animation more room. */}
        {hasText && (
          <div className="relative flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 py-6 md:py-10">
            <div className="flex min-h-full flex-col items-start justify-center text-left gap-4 max-w-2xl mx-auto md:mx-0">
              <div className="text-sm sm:text-base font-display font-extrabold uppercase tracking-wide text-sky-300">
                The key idea
              </div>
              {objective && (
                <p className="font-display font-extrabold text-white leading-snug text-2xl sm:text-3xl md:text-[2.25rem] drop-shadow-lg">
                  {objective}
                </p>
              )}
              {(points?.length ?? 0) > 0 && (
                <ol className="mt-1 space-y-3 w-full">
                  {points!.map((p, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-sky-500/25 text-sky-200 font-display font-extrabold text-base flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-lg sm:text-xl leading-snug text-white/90 font-display font-bold">
                        {p}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}

        {/* VIDEO panel */}
        <div
          className={
            'relative flex-1 min-h-0 flex items-center justify-center bg-black overflow-hidden ' +
            (hasText ? 'md:border-l border-white/10' : '')
          }
        >
          <video
            ref={ref}
            src={url}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain bg-black"
            aria-label={title}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration > 0) setProgress(v.currentTime / v.duration);
            }}
            onEnded={() => {
              setEnded(true);
              // Reward coins the first time each math video is watched to the end.
              const got = completeVideo(src);
              if (got > 0) setCoinAward(got);
            }}
          />

          {coinAward > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-yellow-300 text-yellow-900 font-display font-extrabold text-sm px-4 py-1.5 shadow-lg"
            >
              🪙 +{coinAward} coins!
            </motion.div>
          )}

          {/* Replay — always available; big when the video has ended. */}
          {ended ? (
            <button
              type="button"
              onClick={replay}
              aria-label="Replay"
              className="absolute inset-0 flex items-center justify-center bg-black/40"
            >
              <span className="rounded-full bg-white/95 shadow-lg px-5 h-14 flex items-center gap-2 font-display font-extrabold text-slate-900">
                ↻ Replay
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={replay}
              className="absolute bottom-3 right-3 rounded-full bg-white/90 hover:bg-white text-slate-900 font-display font-extrabold text-sm px-4 h-10 shadow-lg active:translate-y-0.5"
            >
              ↻ Replay
            </button>
          )}

          {/* 🐢 slow-it-down toggle */}
          <button
            type="button"
            onClick={() => setRate((r) => (r === 1 ? 0.75 : 1))}
            aria-pressed={rate < 1}
            className={
              'absolute left-3 bottom-3 rounded-full px-3 py-1 text-xs font-display font-bold shadow ' +
              (rate < 1 ? 'bg-amber-300 text-amber-900' : 'bg-white/90 text-slate-700')
            }
          >
            🐢 {rate < 1 ? '0.75×' : 'Slow it down'}
          </button>
        </div>
      </div>

      {/* ── Bottom bar — one big Continue, locked until loaded + 2s. The ✕ in
          the header is always an escape hatch, so a kid is never trapped. ── */}
      <div className="px-4 sm:px-6 pb-4 pt-3 shrink-0 flex items-center justify-end gap-3 bg-black/60 border-t border-white/10">
        <button
          type="button"
          onClick={onClose}
          disabled={locked}
          className="rounded-full bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 text-white font-display font-extrabold text-lg sm:text-xl px-8 sm:px-10 h-14 shadow-lg shadow-emerald-500/30 transition disabled:bg-white/15 disabled:text-white/50 disabled:shadow-none disabled:active:translate-y-0 disabled:cursor-not-allowed"
        >
          {locked ? 'Watch a moment…' : 'Got it ✓'}
        </button>
      </div>
    </div>
  );
}
