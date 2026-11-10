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
  const n = Number(v);
  return [0.75, 1, 1.25, 1.5].includes(n) ? n : 1;
}

/**
 * Lesson-video launcher: a compact tappable tile that opens the full-screen
 * player.
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
        className="group relative w-full block rounded-2xl overflow-hidden bg-[#0b1020] border-2 border-line text-left aspect-video active:scale-[0.99] transition-transform"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <span className="rounded-full bg-white/95 shadow-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl text-zinc-900">
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

interface Chapter {
  t: number;
  kind: string;
  label: string;
}

const RATES = [0.75, 1, 1.25, 1.5];
const KIND_LABEL: Record<string, string> = {
  title: 'Start',
  objective: 'The goal',
  concept: 'Key idea',
  example: 'Worked example',
  protip: 'Pro tip',
  trap: 'Watch out',
  challenge: 'Challenge',
  summary: 'Summary',
  end: 'End',
};

function isPortraitPhone(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 640 && window.innerHeight > window.innerWidth;
}

function clock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * The full-screen playback surface, with the controls any video player has:
 * tap the picture (or Space) to pause, drag the bar to any point, jump slide
 * by slide, pick a speed, and close whenever you like. Each lesson video is a
 * run of slides, so the bar carries a tick at every slide start and the header
 * names the one on screen.
 *
 * Coins are still earned once per video, when it has genuinely been watched:
 * reaching the end only counts if most of the running time was played.
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
  const watchedRef = useRef(0); // seconds actually played, for the coin award
  const lastTickRef = useRef(0);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [rate, setRate] = useState<number>(() => getInitialRate());
  const completeVideo = useProgress((s) => s.completeVideo);
  const [coinAward, setCoinAward] = useState(0); // >0 → show the "you earned coins" toast
  // A wide video on an upright phone is a thin strip. There the whole player
  // turns a quarter so the picture fills the screen; the viewer turns the
  // phone. Their choice wins once they tap the button.
  const [portrait, setPortrait] = useState(() => isPortraitPhone());
  const [sideways, setSideways] = useState<boolean | null>(null);
  useEffect(() => {
    const on = () => setPortrait(isPortraitPhone());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const turned = portrait && (sideways ?? true);

  // Slide markers, when the video has them (older clips do not).
  useEffect(() => {
    let dead = false;
    fetch(url.replace(/\.mp4$/, '.chapters.json'))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!dead && j && Array.isArray(j.chapters)) setChapters(j.chapters as Chapter[]);
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [url]);

  // Apply + persist the playback rate.
  useEffect(() => {
    const v = ref.current;
    if (v) v.playbackRate = rate;
    try {
      window.localStorage.setItem(RATE_KEY, String(rate));
    } catch {
      /* storage blocked: the speed just is not remembered */
    }
  }, [rate]);

  // Autoplay on open; pause + release on unmount (drawer close).
  useEffect(() => {
    const v = ref.current;
    if (v) {
      v.playbackRate = rate;
      v.play().catch(() => setPaused(true));
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

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.ended) {
      v.currentTime = 0;
      setEnded(false);
    }
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  const seek = (t: number) => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, t), v.duration || t);
    lastTickRef.current = v.currentTime;
    setTime(v.currentTime);
    if (v.currentTime < (v.duration || Infinity) - 0.2) setEnded(false);
  };
  const chapterIndex = chapters.reduce((acc, c, i) => (time >= c.t - 0.05 ? i : acc), 0);
  const current = chapters[chapterIndex];
  const jump = (dir: -1 | 1) => {
    if (!chapters.length) return seek(time + dir * 10);
    // "Previous" first returns to the start of this slide, then goes back one.
    if (dir < 0 && time - chapters[chapterIndex].t > 2) return seek(chapters[chapterIndex].t);
    const next = chapters[Math.min(chapters.length - 1, Math.max(0, chapterIndex + dir))];
    seek(next.t);
  };

  // Keyboard: Space pauses, arrows move 5 s, [ and ] change slide.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'ArrowLeft') seek((ref.current?.currentTime ?? 0) - 5);
      else if (e.key === 'ArrowRight') seek((ref.current?.currentTime ?? 0) + 5);
      else if (e.key === '[') jump(-1);
      else if (e.key === ']') jump(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const slideCount = chapters.filter((c) => c.kind !== 'title' && c.kind !== 'end').length;
  const slideNo = chapters.slice(0, chapterIndex + 1).filter((c) => c.kind !== 'title' && c.kind !== 'end').length;
  const ctl =
    'h-11 min-w-11 px-3 rounded-md border border-white/20 bg-white/10 hover:bg-white/20 active:translate-y-px text-white font-display font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-40';

  return (
    <div
      className="bg-[#05070f] text-white flex flex-col"
      style={
        turned
          ? {
              position: 'fixed',
              top: 0,
              left: '100vw',
              width: '100dvh',
              height: '100vw',
              transformOrigin: 'top left',
              transform: 'rotate(90deg)',
            }
          : {
              position: 'relative',
              width: '100%',
              height: '100dvh',
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }
      }
    >
      {/* ── Header: which lesson, which slide, and a way out ── */}
      <div className={`px-4 sm:px-6 py-2.5 items-center justify-between gap-4 shrink-0 border-b border-cyan-300/25 bg-white/5 ${turned ? 'hidden' : 'flex'}`}>
        <div className="min-w-0">
          <div className="font-mono text-2xs uppercase tracking-[0.18em] text-cyan-300 truncate">
            {current && current.kind !== 'title' && current.kind !== 'end'
              ? `${KIND_LABEL[current.kind] ?? 'Slide'} · ${slideNo} of ${slideCount}`
              : 'Lesson video'}
          </div>
          <h2 className="font-display font-extrabold text-white leading-tight text-base sm:text-xl truncate">
            {current && current.kind !== 'title' && current.kind !== 'end' ? current.label : title}
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close video" className={ctl}>
          ✕ <span className="hidden sm:inline">Close</span>
        </button>
      </div>

      {/* ── Stage: tap anywhere on the picture to pause or play ── */}
      <div className="relative flex-1 min-h-0 w-full select-none bg-black">
        <video
          ref={ref}
          src={url}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-contain bg-black cursor-pointer"
          aria-label={title}
          onClick={toggle}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            // Count only time that played through, not distance jumped.
            const step = v.currentTime - lastTickRef.current;
            if (step > 0 && step < 1.5) watchedRef.current += step;
            lastTickRef.current = v.currentTime;
            setTime(v.currentTime);
          }}
          onEnded={(e) => {
            setEnded(true);
            // Coins the first time a video is watched through (most of it played).
            if (watchedRef.current >= (e.currentTarget.duration || 0) * 0.6) {
              const got = completeVideo(src);
              if (got > 0) setCoinAward(got);
            }
          }}
        />

        {coinAward > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-yellow-300 text-warn font-display font-extrabold text-sm px-4 py-1.5 shadow-lg"
          >
            +{coinAward} π coins!
          </motion.div>
        )}

        {paused && !ended && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play"
            className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-black/60 border border-cyan-300/60 text-3xl text-white flex items-center justify-center"
          >
            ▶
          </button>
        )}

        {ended && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/65">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-cyan-300 hover:bg-cyan-200 active:translate-y-0.5 text-[#0b1020] font-display font-extrabold text-lg px-8 h-14"
            >
              Done ✓
            </button>
            <button type="button" onClick={() => { seek(0); ref.current?.play().catch(() => {}); }} className={ctl}>
              ↻ Watch again
            </button>
          </div>
        )}
      </div>

      {/* ── Controls ── */}
      <div className={`shrink-0 border-t border-cyan-300/25 bg-white/5 px-3 sm:px-6 ${turned ? 'py-1.5 flex items-center gap-3' : 'pt-2 pb-3'}`}>
        <div className={`relative h-7 flex items-center ${turned ? 'order-2 flex-1 min-w-0' : ''}`}>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Position in the video"
            className="lesson-video-seek w-full"
            style={{ ['--played' as string]: `${duration ? (time / duration) * 100 : 0}%` }}
          />
          {duration > 0 &&
            chapters.slice(1).map((c) => (
              <span
                key={c.t}
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/70"
                style={{ left: `${(c.t / duration) * 100}%` }}
              />
            ))}
        </div>
        <div className={turned ? 'contents' : 'mt-1.5 flex items-center gap-2'}>
          <span className={turned ? 'order-1 flex items-center gap-2' : 'contents'}>
          <button type="button" onClick={() => jump(-1)} aria-label="Previous slide" className={ctl}>
            ⏮
          </button>
          <button type="button" onClick={toggle} aria-label={paused ? 'Play' : 'Pause'} className={`${ctl} min-w-16`}>
            {ended ? '↻' : paused ? '▶ Play' : '❚❚ Pause'}
          </button>
          <button type="button" onClick={() => jump(1)} aria-label="Next slide" className={ctl}>
            ⏭
          </button>
          <span className="ml-1 font-mono text-xs tabular-nums text-white/80 whitespace-nowrap">
            {clock(time)} / {clock(duration)}
          </span>
          </span>
          <span className={turned ? 'hidden' : 'flex-1'} />
          <span className={turned ? 'order-3 flex items-center gap-2' : 'contents'}>
          {portrait && (
            <button
              type="button"
              onClick={() => setSideways(!turned)}
              aria-label={turned ? 'Show the video upright' : 'Turn the video sideways to fill the screen'}
              className={ctl}
            >
              {turned ? '⤢ Upright' : '⤢ Sideways'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setRate((r) => RATES[(RATES.indexOf(r) + 1) % RATES.length] ?? 1)}
            aria-label={`Playback speed ${rate}×. Tap to change.`}
            className={ctl}
          >
            {rate}×
          </button>
          {turned && (
            <button type="button" onClick={onClose} aria-label="Close video" className={ctl}>
              ✕
            </button>
          )}
          </span>
        </div>
      </div>
    </div>
  );
}
