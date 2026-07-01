let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function tone(freq: number, duration: number, when = 0, type: OscillatorType = 'sine', volume = 0.15) {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration);
}

// A frequency sweep (great for lasers / power-ups / falling sounds).
export function sweep(
  from: number,
  to: number,
  duration: number,
  when = 0,
  type: OscillatorType = 'square',
  volume = 0.12,
) {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + duration);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration);
}

// A short filtered-noise burst (explosions / hits / drums).
export function noiseBurst(duration = 0.25, when = 0, volume = 0.18, cutoff = 1200) {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + when;
  const frames = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = cutoff;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(t);
  src.stop(t + duration);
}

export function playCorrect() {
  tone(523.25, 0.12, 0); // C5
  tone(659.25, 0.12, 0.08); // E5
  tone(783.99, 0.2, 0.16); // G5
}

export function playWrong() {
  tone(220, 0.08, 0, 'triangle', 0.12);
  tone(196, 0.18, 0.06, 'triangle', 0.12);
}

export function playClick() {
  tone(900, 0.04, 0, 'sine', 0.08);
}

// Energizing "advance" cue for Next / Continue / Start / Replay buttons — a
// quick rising whoosh capped with a bright ping.
export function playAdvance() {
  sweep(420, 940, 0.13, 0, 'triangle', 0.09);
  tone(1046.5, 0.1, 0.09, 'sine', 0.09); // C6 ping
}

export function playUnitComplete() {
  tone(523.25, 0.12);
  tone(659.25, 0.12, 0.1);
  tone(783.99, 0.12, 0.2);
  tone(1046.5, 0.3, 0.3);
}
