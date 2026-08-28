import { useSpeech } from '../hooks/useSpeech';

interface Props {
  text: string | string[];
  label?: string;
  className?: string;
}

/**
 * "🔊 Read aloud" toggle that narrates the supplied text via the browser's
 * SpeechSynthesis API. Hides itself when the API is unavailable.
 */
export function ReadAloud({ text, label = 'Read aloud', className }: Props) {
  const { state, isSupported, speak, stop, rate, setRate } = useSpeech();

  if (!isSupported) return null;

  const playing = state === 'playing';

  return (
    <div className={'inline-flex items-center gap-2 ' + (className ?? '')}>
      <button
        type="button"
        onClick={() => (playing ? stop() : speak(text))}
        aria-pressed={playing}
        aria-label={playing ? 'Stop reading aloud' : label}
        className={
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-display font-bold shadow-sm border ' +
          (playing
            ? 'bg-bad-soft border-bad/50 text-bad'
            : 'bg-accent-soft border-accent/45 text-accent hover:bg-violet-200')
        }
      >
        <span className="text-base">{playing ? '⏹' : '🔊'}</span>
        <span>{playing ? 'Stop' : label}</span>
      </button>
      <button
        type="button"
        onClick={() => setRate(rate === 0.95 ? 0.75 : rate === 0.75 ? 1.1 : 0.95)}
        title={`Voice speed: ${rate.toFixed(2)}×`}
        className="rounded-full px-2 py-1.5 text-xs font-display font-bold bg-surface-2 border border-line text-ink-muted"
      >
        {rate.toFixed(2)}×
      </button>
    </div>
  );
}
