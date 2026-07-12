import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../state/progress';

interface Props {
  src: string;
  title?: string;
  /** Accepted for call-site compatibility but no longer shown — the player is
   *  video-only now (the lesson's key idea is summarized inside the video). */
  objective?: string;
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
export function LessonVideo({ src, title }: Props) {
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
      />
    </>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  src: string;
}

function VideoPlayerModal({ open, onClose, title, src }: ModalProps) {
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
          <StoryVideoPlayer src={src} title={title} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/**
 * The full-screen playback surface: a header, a thin progress bar, and the
 * animation filling the rest — video only (the lesson recaps its key idea in a
 * summary at the end, so no busy side panel). The kid gets a 🐢 slow toggle and
 * a ⏪10s rewind but can never fast-forward, and there's NO "continue" button
 * to bail out early — a big Done button only appears once the video has played
 * all the way through (to its built-in summary).
 */
function StoryVideoPlayer({
  src,
  title,
  onClose,
}: {
  src: string;
  title: string;
  onClose: () => void;
}) {
  const url = `${import.meta.env.BASE_URL}videos/lessons/${src}`;
  const ref = useRef<HTMLVideoElement | null>(null);
  const maxRef = useRef(0); // furthest point watched — kids can rewind, never skip ahead
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 for the top bar
  const [rate, setRate] = useState<number>(() => getInitialRate());
  const completeVideo = useProgress((s) => s.completeVideo);
  const [coinAward, setCoinAward] = useState(0); // >0 → show the "you earned coins" toast

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

  // Kids may rewind, but never fast-forward past what they've watched.
  const rewind10 = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = Math.max(0, v.currentTime - 10);
    setEnded(false);
  };
  // Snap any forward jump back to the furthest-watched point (blocks skipping).
  const guardForward = () => {
    const v = ref.current;
    if (!v) return;
    if (v.currentTime > maxRef.current + 1) v.currentTime = maxRef.current;
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

      {/* ── Stage — the animation fills the whole screen (video only). ── */}
      <div className="relative flex-1 min-h-0 w-full select-none">
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <video
            ref={ref}
            src={url}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain bg-black"
            aria-label={title}
            onSeeking={guardForward}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.currentTime > maxRef.current + 1) {
                v.currentTime = maxRef.current; // block a forward skip
                return;
              }
              maxRef.current = Math.max(maxRef.current, v.currentTime);
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

          {/* End screen — the ONLY way to finish: Done appears once the whole
              video (incl. its summary) has played. Replay is offered too. */}
          {ended ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 text-white font-display font-extrabold text-xl px-10 h-16 shadow-lg shadow-emerald-500/30 transition"
              >
                Done ✓
              </button>
              <button
                type="button"
                onClick={replay}
                className="rounded-full bg-white/95 hover:bg-white shadow px-5 h-12 flex items-center gap-2 font-display font-extrabold text-slate-900"
              >
                ↻ Watch again
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={replay}
              className="absolute bottom-3 right-3 rounded-full bg-white/90 hover:bg-white text-slate-700 font-display font-bold text-xs px-3 py-1 shadow active:translate-y-0.5"
            >
              ↻ Restart
            </button>
          )}

          {/* left controls: rewind (never fast-forward) + 🐢 slow toggle */}
          <div className="absolute left-3 bottom-3 flex items-center gap-2">
            {!ended && (
              <button
                type="button"
                onClick={rewind10}
                aria-label="Rewind 10 seconds"
                className="rounded-full bg-white/90 hover:bg-white text-slate-700 px-3 py-1 text-xs font-display font-bold shadow active:translate-y-0.5"
              >
                ⏪ 10s
              </button>
            )}
            <button
              type="button"
              onClick={() => setRate((r) => (r === 1 ? 0.75 : 1))}
              aria-pressed={rate < 1}
              className={
                'rounded-full px-3 py-1 text-xs font-display font-bold shadow ' +
                (rate < 1 ? 'bg-amber-300 text-amber-900' : 'bg-white/90 text-slate-700')
              }
            >
              🐢 {rate < 1 ? '0.75×' : 'Slow it down'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
