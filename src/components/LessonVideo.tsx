import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useProgress } from '../state/progress';

interface Props {
  src: string;
  title?: string;
  /** Browser preload hint; default 'metadata'. Unused on the launcher (no
   *  <video> mounts until the drawer opens) — kept for API compatibility. */
  preload?: 'none' | 'metadata' | 'auto';
}

const RATE_KEY = 'lesson:video-rate';
const PAUSE_KEY = 'lesson:auto-pause';

function getInitialRate(): number {
  if (typeof window === 'undefined') return 1;
  const v = window.localStorage.getItem(RATE_KEY);
  return v === '0.75' ? 0.75 : 1;
}

function getInitialAutoPause(): boolean {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(PAUSE_KEY) !== 'off';
}

interface Chapters {
  checkpoints: number[];
  total: number;
}

/**
 * Lesson-video launcher: a compact tappable tile that opens a big slide-out
 * drawer containing the actual <video> + the Continue overlay + the 🐢
 * slow-it-down toggle. The drawer fills most of the screen on phones and is a
 * centered modal on tablet/desktop, so the kid never needs native fullscreen.
 *
 * No <video> mounts (or fetches metadata) until the drawer opens — important
 * for the library page which lists 100+ videos.
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

      <VideoDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        src={src}
      />
    </>
  );
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  src: string;
}

function VideoDrawer({ open, onClose, title, src }: DrawerProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="video-drawer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-[2px] flex items-end sm:items-center sm:justify-center"
          onClick={onClose}
          role="dialog"
          aria-label={`Video: ${title}`}
        >
          <motion.div
            // Phone: full-screen (uses 100dvh so Safari's URL bar doesn't
            // overlap). Tablet/desktop: centered card capped at max-w-3xl.
            initial={{ y: '100%', opacity: 1, scale: 1 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_: unknown, info: PanInfo) => {
              if (info.offset.y > 90 || info.velocity.y > 600) onClose();
            }}
            onClick={(e) => e.stopPropagation()}
            className={[
              'relative w-full bg-black shadow-2xl flex flex-col',
              'sm:max-h-[88vh] sm:max-w-3xl sm:w-[92vw] sm:rounded-3xl sm:m-auto sm:bg-white',
            ].join(' ')}
            style={{
              height: '100dvh',
              maxHeight: '100dvh',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            {/* slim phone header — sits on the black stage with white text */}
            <div className="px-3 sm:px-5 py-2 sm:py-4 flex items-center justify-between gap-3 shrink-0 sm:bg-white">
              <div className="min-w-0">
                <div className="text-[10px] font-display font-extrabold uppercase tracking-wider text-sky-300 sm:text-sky-600">
                  Animation
                </div>
                <h2 className="text-sm sm:text-lg font-display font-extrabold text-white sm:text-slate-900 truncate">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-10 h-10 rounded-full bg-white/15 sm:bg-slate-100 hover:bg-white/25 sm:hover:bg-slate-200 text-white sm:text-slate-600 font-display font-extrabold text-lg"
              >
                ✕
              </button>
            </div>

            {/* video stage — flex-1 so the player stretches to fill the screen */}
            <div className="flex-1 min-h-0 flex items-center justify-center sm:px-5 sm:pb-5 sm:bg-white">
              <VideoPlayer src={src} title={title} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/**
 * The actual playback surface. Lives only inside the drawer — there's no
 * inline use. Keeps the existing Continue checkpoints, 🐢 slow toggle, big
 * play / replay overlays, and tries to autoplay muted on open.
 */
function VideoPlayer({ src, title }: { src: string; title: string }): ReactNode {
  const url = `${import.meta.env.BASE_URL}videos/lessons/${src}`;
  const chaptersUrl = `${import.meta.env.BASE_URL}videos/lessons/${src.replace(/\.mp4$/, '.chapters.json')}`;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [rate, setRate] = useState<number>(() => getInitialRate());
  const [autoPause, setAutoPause] = useState<boolean>(() => getInitialAutoPause());
  const completeVideo = useProgress((s) => s.completeVideo);
  const [coinAward, setCoinAward] = useState(0); // >0 → show the "you earned coins" toast

  const rawRef = useRef<Chapters | null>(null);
  const marksRef = useRef<number[]>([]);
  const nextIdxRef = useRef(0);
  const computeMarksRef = useRef<() => void>(() => {});
  const [atCheckpoint, setAtCheckpoint] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    window.localStorage.setItem(RATE_KEY, String(rate));
  }, [rate]);

  useEffect(() => {
    window.localStorage.setItem(PAUSE_KEY, autoPause ? 'on' : 'off');
  }, [autoPause]);

  // Pause + release on unmount (drawer close).
  useEffect(() => {
    return () => {
      const v = ref.current;
      if (v) {
        try {
          v.pause();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  // Try to autoplay (muted) once mounted — drawers are user-initiated so
  // browsers allow it. If autoplay is blocked, the big Play overlay still
  // shows.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener('loadedmetadata', tryPlay, { once: true });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(chaptersUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Chapters | null) => {
        if (!cancelled && j && Array.isArray(j.checkpoints)) {
          rawRef.current = j;
          const v = ref.current;
          if (v && isFinite(v.duration) && v.duration > 0) computeMarksRef.current();
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [chaptersUrl]);

  const computeMarks = useCallback(() => {
    const v = ref.current;
    if (!v || !isFinite(v.duration) || v.duration <= 0) {
      marksRef.current = [];
      return;
    }
    const raw = rawRef.current;
    if (raw && raw.total && raw.checkpoints.length) {
      const ratio = v.duration / raw.total;
      marksRef.current = raw.checkpoints
        .map((c) => c * ratio)
        .filter((t) => t > 0.5 && t < v.duration - 0.4)
        .sort((a, b) => a - b);
    } else {
      const PERIOD = 9;
      const marks: number[] = [];
      for (let t = PERIOD; t < v.duration - 1; t += PERIOD) marks.push(t);
      marksRef.current = marks;
    }
    nextIdxRef.current = 0;
  }, []);
  computeMarksRef.current = computeMarks;

  const play = () => {
    const v = ref.current;
    if (!v) return;
    setEnded(false);
    setAtCheckpoint(false);
    v.play().catch(() => {});
  };

  const pause = () => ref.current?.pause();

  const replay = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    nextIdxRef.current = 0;
    setEnded(false);
    setAtCheckpoint(false);
    setCoinAward(0);
    v.play().catch(() => {});
  };

  const onTimeUpdate = () => {
    if (!autoPause) return;
    const v = ref.current;
    const marks = marksRef.current;
    if (!v || marks.length === 0) return;
    const i = nextIdxRef.current;
    if (i < marks.length && v.currentTime >= marks[i]) {
      nextIdxRef.current = i + 1;
      v.pause();
      setAtCheckpoint(true);
    }
  };

  const continuePlayback = () => {
    setAtCheckpoint(false);
    ref.current?.play().catch(() => {});
  };

  // On phone the parent gives us a flex-1 black stage; we fill it.
  // On desktop (sm:) we use aspect-video so the video doesn't stretch the
  // centered modal too tall.
  return (
    <div className="relative w-full h-full sm:h-auto sm:aspect-video sm:rounded-2xl overflow-hidden bg-black sm:border sm:border-slate-200 flex items-center justify-center">
      <video
        ref={ref}
        src={url}
        controls
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full bg-black object-contain"
        aria-label={title}
        onLoadedMetadata={computeMarks}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onSeeked={() => {
          const v = ref.current;
          if (!v) return;
          const marks = marksRef.current;
          let i = 0;
          while (i < marks.length && marks[i] <= v.currentTime + 0.05) i++;
          nextIdxRef.current = i;
        }}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => {
          setEnded(true);
          setPlaying(false);
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

      {!playing && !ended && !atCheckpoint && (
        <button
          type="button"
          onClick={play}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center bg-black/30 active:bg-black/40 transition"
        >
          <span className="rounded-full bg-white/95 shadow-lg w-20 h-20 flex items-center justify-center text-3xl">
            ▶
          </span>
        </button>
      )}

      {atCheckpoint && (
        <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={continuePlayback}
            className="rounded-full bg-duo-green hover:bg-green-600 text-white font-display font-extrabold text-sm px-4 h-10 flex items-center gap-1.5 shadow-lg active:translate-y-0.5 transition"
          >
            Continue ▶
          </button>
          <button
            type="button"
            onClick={() => {
              setAutoPause(false);
              continuePlayback();
            }}
            className="text-white/90 text-[10px] font-display font-bold underline bg-black/40 px-2 py-0.5 rounded"
          >
            Don't pause again
          </button>
        </div>
      )}

      {playing && !atCheckpoint && (
        <button
          type="button"
          onClick={pause}
          aria-label="Pause"
          className="absolute top-2 right-2 rounded-full bg-white/90 w-12 h-12 flex items-center justify-center text-xl shadow"
        >
          ⏸
        </button>
      )}

      {ended && (
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
      )}

      <button
        type="button"
        onClick={() => setRate((r) => (r === 1 ? 0.75 : 1))}
        aria-pressed={rate < 1}
        className={
          'absolute left-2 bottom-2 rounded-full px-3 py-1 text-xs font-display font-bold shadow ' +
          (rate < 1 ? 'bg-amber-300 text-amber-900' : 'bg-white/90 text-slate-700')
        }
      >
        🐢 {rate < 1 ? '0.75×' : 'Slow it down'}
      </button>
    </div>
  );
}
