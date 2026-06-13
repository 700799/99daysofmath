import { useEffect, useRef, useState, useCallback } from 'react';

interface Props {
  src: string;
  title?: string;
  /** Browser preload hint; default 'metadata'. Pass 'none' in libraries with many videos. */
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
 * Reusable lesson-video player. Big prominent Play / Pause overlay, freezes on
 * the final frame (no auto-loop), a 🐢 slow-it-down toggle, and Khan-style
 * "Continue" checkpoints: if a `<src>.chapters.json` sidecar exists, the video
 * auto-pauses at each section boundary and shows a big Continue button so kids
 * set their own pace.
 */
export function LessonVideo({ src, title, preload = 'metadata' }: Props) {
  const url = `${import.meta.env.BASE_URL}videos/lessons/${src}`;
  const chaptersUrl = `${import.meta.env.BASE_URL}videos/lessons/${src.replace(/\.mp4$/, '.chapters.json')}`;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [rate, setRate] = useState<number>(() => getInitialRate());
  const [autoPause, setAutoPause] = useState<boolean>(() => getInitialAutoPause());

  // Checkpoints (scaled to real duration once metadata loads).
  const rawRef = useRef<Chapters | null>(null);
  const marksRef = useRef<number[]>([]);
  const nextIdxRef = useRef(0);
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

  // Load the chapters sidecar (graceful no-op if missing).
  useEffect(() => {
    let cancelled = false;
    fetch(chaptersUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Chapters | null) => {
        if (!cancelled && j && Array.isArray(j.checkpoints)) rawRef.current = j;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [chaptersUrl]);

  const computeMarks = useCallback(() => {
    const v = ref.current;
    const raw = rawRef.current;
    if (!v || !raw || !raw.total || !isFinite(v.duration)) {
      marksRef.current = [];
      return;
    }
    const ratio = v.duration / raw.total;
    // Scale, drop any too close to the very end, and sort.
    marksRef.current = raw.checkpoints
      .map((c) => c * ratio)
      .filter((t) => t > 0.5 && t < v.duration - 0.4)
      .sort((a, b) => a - b);
    nextIdxRef.current = 0;
  }, []);

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

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-200">
      <video
        ref={ref}
        src={url}
        controls
        muted
        playsInline
        preload={preload}
        className="w-full block"
        aria-label={title ?? 'Lesson animation'}
        onLoadedMetadata={computeMarks}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onSeeked={() => {
          // Recompute which checkpoint is next after a manual scrub.
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
        }}
      />

      {/* Big center overlay — visible until first play, fades out while playing. */}
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

      {/* Checkpoint "Continue" overlay — kid sets their own pace. */}
      {atCheckpoint && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55">
          <div className="text-white font-display font-extrabold text-lg drop-shadow">
            Take your time! 🧠
          </div>
          <button
            type="button"
            onClick={continuePlayback}
            className="rounded-full bg-duo-green hover:bg-green-600 text-white font-display font-extrabold text-xl px-8 h-16 flex items-center gap-2 shadow-lg active:translate-y-0.5 transition"
          >
            Continue ▶
          </button>
          <button
            type="button"
            onClick={() => {
              setAutoPause(false);
              continuePlayback();
            }}
            className="text-white/80 text-xs font-display font-bold underline"
          >
            Don't pause again
          </button>
        </div>
      )}

      {/* Pause button — shows briefly when playing (tap the video to surface it). */}
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

      {/* End-of-video replay pill — replaces the play overlay when the clip stops. */}
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

      {/* Slow-it-down toggle, pinned bottom-left so it doesn't compete with native controls. */}
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
