import { describe, it, expect } from 'vitest';
import { pickBestVoice, joinNarrationText, clampRate } from '../src/hooks/useSpeech';

function fakeVoice(name: string, lang = 'en-US'): SpeechSynthesisVoice {
  return {
    name,
    lang,
    default: false,
    localService: true,
    voiceURI: name,
  } as SpeechSynthesisVoice;
}

describe('pickBestVoice', () => {
  it('returns null for an empty voice list', () => {
    expect(pickBestVoice([])).toBeNull();
  });

  it('prefers Samantha first, then Google US English', () => {
    const voices = [
      fakeVoice('Daniel', 'en-GB'),
      fakeVoice('Google US English'),
      fakeVoice('Samantha'),
    ];
    expect(pickBestVoice(voices)?.name).toBe('Samantha');
  });

  it('falls back to Google US English when Samantha is missing', () => {
    const voices = [fakeVoice('Daniel', 'en-GB'), fakeVoice('Google US English')];
    expect(pickBestVoice(voices)?.name).toBe('Google US English');
  });

  it('falls back to the first en-* voice when no preferred voice exists', () => {
    const voices = [fakeVoice('Anna', 'de-DE'), fakeVoice('Karen', 'en-AU')];
    expect(pickBestVoice(voices)?.name).toBe('Karen');
  });

  it('falls back to the first voice in the list when nothing is en-*', () => {
    const voices = [fakeVoice('Anna', 'de-DE'), fakeVoice('Yuki', 'ja-JP')];
    expect(pickBestVoice(voices)?.name).toBe('Anna');
  });
});

describe('joinNarrationText', () => {
  it('returns a single string unchanged', () => {
    expect(joinNarrationText('hello world')).toBe('hello world');
  });

  it('joins arrays with a long-pause separator', () => {
    expect(joinNarrationText(['one', 'two', 'three'])).toBe('one. … two. … three');
  });

  it('handles a one-element array', () => {
    expect(joinNarrationText(['solo'])).toBe('solo');
  });
});

describe('clampRate', () => {
  it('clamps above the supported max', () => {
    expect(clampRate(2.5)).toBe(1.5);
  });
  it('clamps below the supported min', () => {
    expect(clampRate(0.1)).toBe(0.5);
  });
  it('passes through valid rates unchanged', () => {
    expect(clampRate(0.95)).toBe(0.95);
    expect(clampRate(1.0)).toBe(1.0);
  });
});
