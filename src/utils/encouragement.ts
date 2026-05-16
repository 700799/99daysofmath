const CORRECT = [
  'Great job!',
  'You got it!',
  'Awesome!',
  'Math wizard!',
  'Excellent!',
  'Brilliant!',
  'Way to go!',
  'Nice work!',
  'On fire!',
  'Mathlete!',
  'Crushing it!',
  'You rock!',
];

const STREAK = [
  'Two in a row!',
  'Hot streak!',
  'Unstoppable!',
  'Power up!',
  'Combo!',
];

const WRONG = [
  "Almost — you've got this!",
  'Good try! Let\'s look together.',
  'No worries — math is hard, you\'re tougher.',
  'Close one! Try again next time.',
  'Stay with it — you\'re learning.',
];

const STICKERS = [
  '⭐ Starlight',
  '🚀 Rocketeer',
  '🦄 Unicorn',
  '🐉 Dragon',
  '🏆 Champion',
  '🌈 Rainbow',
  '🎯 Sharpshooter',
  '🐙 Octopus',
  '🦊 Foxy',
  '🌟 Supernova',
  '🦉 Wise Owl',
  '🍕 Pizza Pro',
  '🦖 Mathasaurus',
  '🎈 High Flier',
  '🪐 Planet Hopper',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function correctMessage(streak: number): string {
  if (streak >= 3) return pick(STREAK);
  return pick(CORRECT);
}

export function wrongMessage(): string {
  return pick(WRONG);
}

export function stickerForUnit(domain: string, unit: number): string {
  // Stable per (domain, unit) so the kid sees a consistent reward.
  const key = `${domain}:${unit}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return STICKERS[Math.abs(hash) % STICKERS.length];
}
