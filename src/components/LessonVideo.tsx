import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  title?: string;
  /** Browser preload hint; default 'metadata'. Pass 'none' in libraries with many videos. */
  preload?: 'none' | 'metadata' | 'auto';
}

const RATE_KEY = 'lesson:video-rate';

function getInitialRate(): number {
  if (typeof window === 'undefined') return 1;
  const v = window.localStorage.getItem(RATE_KEY);
  return v === '0.75' ? 0.75 : 1;
}

/**
 * Reusable lesson-video player. Big prominent Play / Pause overlay, freezes
 * on the final frame (no auto-loop), and offers a 🐢 slow-it-down toggle.
 * The native browser controls bar is still available for fine seeking.
 */
export function LessonVideo({ src, title, preload = 'metadata' }: Props) {
  const url = `${import.meta.env.BASE_URL}videos/lessons/${src}`;
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [rate, setRate] = useState<number>(() => getInitialRate());

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    window.localStorage.setItem(RATE_KEY, String(rate));
  }, [rate]);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    setEnded(false);
    v.play().catch(() => {});
  };

  const pause = () => ref.current?.pause();

  const replay = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    v.play().catch(() => {});
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
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setEnded(true);
          setPlaying(false);
        }}
      />

      {/* Big center overlay — visible until first play, fades out while playing. */}
      {!playing && !ended && (
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

      {/* Pause button — shows briefly when playing (tap the video to surface it). */}
      {playing && (
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
