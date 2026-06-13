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

function tone(freq: number, duration: number, when = 0, type: OscillatorType = 'sine', volume = 0.15) {
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

export function playUnitComplete() {
  tone(523.25, 0.12);
  tone(659.25, 0.12, 0.1);
  tone(783.99, 0.12, 0.2);
  tone(1046.5, 0.3, 0.3);
}
