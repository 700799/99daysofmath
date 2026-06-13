import { useCallback, useEffect, useRef, useState } from 'react';

const RATE_KEY = 'speech:rate';
const PREFERRED = ['Samantha', 'Google US English', 'Karen', 'Daniel'];

export type SpeechState = 'idle' | 'playing' | 'paused';

interface UseSpeech {
  state: SpeechState;
  isSupported: boolean;
  rate: number;
  setRate: (n: number) => void;
  speak: (text: string | string[]) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

/** Picks the best en-US voice from a list. Exported so it can be unit-tested. */
export function pickBestVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  for (const name of PREFERRED) {
    const v = voices.find((x) => x.name.includes(name));
    if (v) return v;
  }
  return voices.find((v) => v.lang?.startsWith('en')) ?? voices[0];
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  return pickBestVoice(window.speechSynthesis.getVoices());
}

/** Joins an array of strings into one TTS-friendly passage. Exported for tests. */
export function joinNarrationText(t: string | string[]): string {
  return Array.isArray(t) ? t.join('. … ') : t;
}

function joinText(t: string | string[]): string {
  return joinNarrationText(t);
}

/** Clamps a speech rate into the supported [0.5, 1.5] window. Exported for tests. */
export function clampRate(n: number): number {
  return Math.max(0.5, Math.min(1.5, n));
}

/**
 * Browser Text-to-Speech wrapper around window.speechSynthesis. Picks the best
 * available en-US voice, persists playback rate in localStorage, and cleans up
 * on unmount.
 */
export function useSpeech(): UseSpeech {
  const isSupported =
    typeof window !== 'undefined' &&
    typeof window.speechSynthesis !== 'undefined';

  const [state, setState] = useState<SpeechState>('idle');
  const [rate, setRateState] = useState<number>(() => {
    if (typeof window === 'undefined') return 0.95;
    const v = parseFloat(window.localStorage.getItem(RATE_KEY) ?? '');
    return Number.isFinite(v) && v >= 0.5 && v <= 1.5 ? v : 0.95;
  });
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!isSupported) return;
    voiceRef.current = pickVoice();
    const onChange = () => {
      voiceRef.current = pickVoice();
    };
    window.speechSynthesis.addEventListener?.('voiceschanged', onChange);
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', onChange);
    };
  }, [isSupported]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(RATE_KEY, String(rate));
    }
  }, [rate]);

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const speak = useCallback(
    (text: string | string[]) => {
      if (!isSupported) return;
      const body = joinText(text).trim();
      if (!body) return;
      window.speechSynthesis.cancel();
      const u = new window.SpeechSynthesisUtterance(body);
      u.rate = rate;
      u.pitch = 1;
      if (voiceRef.current) u.voice = voiceRef.current;
      u.onstart = () => setState('playing');
      u.onpause = () => setState('paused');
      u.onresume = () => setState('playing');
      u.onend = () => setState('idle');
      u.onerror = () => setState('idle');
      window.speechSynthesis.speak(u);
    },
    [isSupported, rate],
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setState('paused');
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setState('playing');
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setState('idle');
  }, [isSupported]);

  const setRate = useCallback((n: number) => {
    setRateState(clampRate(n));
  }, []);

  return { state, isSupported, rate, setRate, speak, pause, resume, stop };
}
