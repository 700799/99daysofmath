import { DOMAINS, type Domain } from '../types/problem';

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

const UNIT_STICKER_EMOJI = [
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

export type StickerCategory = 'unit' | 'streak' | 'accuracy' | 'xp' | 'mastery';

export interface StickerDef {
  id: string;
  emoji: string;
  label: string;
  category: StickerCategory;
  hint?: string;
}

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

function hashKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function unitStickerFor(domain: string, unit: number): StickerDef {
  const key = `${domain}:${unit}`;
  const slot = hashKey(key) % UNIT_STICKER_EMOJI.length;
  const raw = UNIT_STICKER_EMOJI[slot];
  const [emoji, ...rest] = raw.split(' ');
  return {
    id: `unit:${domain}:${unit}`,
    emoji,
    label: rest.join(' '),
    category: 'unit',
  };
}

const STREAK_STICKERS: StickerDef[] = [
  { id: 'streak-3', emoji: '🔥', label: 'Warming Up', category: 'streak', hint: '3-day streak' },
  { id: 'streak-7', emoji: '🔥🔥', label: 'One Week Strong', category: 'streak', hint: '7-day streak' },
  { id: 'streak-14', emoji: '🌋', label: 'Volcano', category: 'streak', hint: '14-day streak' },
  { id: 'streak-30', emoji: '🌟', label: 'One Month!', category: 'streak', hint: '30-day streak' },
  { id: 'streak-50', emoji: '🏔️', label: 'Mountain Climber', category: 'streak', hint: '50-day streak' },
  { id: 'streak-99', emoji: '🏆', label: '99 Days of Math', category: 'streak', hint: '99-day streak' },
  { id: 'combo-10', emoji: '⚡', label: 'Combo x10', category: 'streak', hint: '10 correct in a row' },
  { id: 'combo-25', emoji: '🚀', label: 'Combo x25', category: 'streak', hint: '25 correct in a row' },
];

const ACCURACY_STICKERS: StickerDef[] = [
  { id: 'acc-perfect-1', emoji: '🎯', label: 'Bullseye', category: 'accuracy', hint: 'First perfect (3-star) unit' },
  { id: 'acc-perfect-5', emoji: '🦸', label: 'Sharpshooter', category: 'accuracy', hint: 'Five perfect units' },
  { id: 'acc-perfect-20', emoji: '🌠', label: 'Pinpoint', category: 'accuracy', hint: 'Twenty perfect units' },
  { id: 'acc-no-mistakes-unit', emoji: '💎', label: 'Diamond Round', category: 'accuracy', hint: 'Complete a unit with no mistakes' },
];

const XP_STICKERS: StickerDef[] = [
  { id: 'xp-100', emoji: '🌱', label: 'Sapling', category: 'xp', hint: 'Earn 100 XP' },
  { id: 'xp-250', emoji: '🌳', label: 'Sturdy Tree', category: 'xp', hint: 'Earn 250 XP' },
  { id: 'xp-500', emoji: '🌲', label: 'Forest', category: 'xp', hint: 'Earn 500 XP' },
  { id: 'xp-1000', emoji: '🌌', label: 'Galaxy', category: 'xp', hint: 'Earn 1,000 XP' },
  { id: 'xp-2500', emoji: '🌈', label: 'Rainbow Bridge', category: 'xp', hint: 'Earn 2,500 XP' },
];

const MASTERY_STICKERS: StickerDef[] = [
  { id: 'mastery-6.RP', emoji: '⚖️', label: 'Ratio Ruler', category: 'mastery', hint: 'Finish all 6.RP units' },
  { id: 'mastery-6.NS', emoji: '🔢', label: 'Number Navigator', category: 'mastery', hint: 'Finish all 6.NS units' },
  { id: 'mastery-6.EE', emoji: '🧮', label: 'Expression Expert', category: 'mastery', hint: 'Finish all 6.EE units' },
  { id: 'mastery-6.G', emoji: '📐', label: 'Geometry Guru', category: 'mastery', hint: 'Finish all 6.G units' },
  { id: 'mastery-6.SP', emoji: '📊', label: 'Stats Star', category: 'mastery', hint: 'Finish all 6.SP units' },
  { id: 'mastery-grand', emoji: '🏅', label: '6th-Grade Champion', category: 'mastery', hint: 'Master every domain' },
];

const ALL_UNIT_STICKERS: StickerDef[] = (() => {
  const out: StickerDef[] = [];
  for (const d of DOMAINS) {
    for (let unit = 1; unit <= 6; unit++) {
      out.push(unitStickerFor(d, unit));
    }
  }
  return out;
})();

export const STICKER_DEFS: StickerDef[] = [
  ...ALL_UNIT_STICKERS,
  ...STREAK_STICKERS,
  ...ACCURACY_STICKERS,
  ...XP_STICKERS,
  ...MASTERY_STICKERS,
];

export const TOTAL_STICKERS = STICKER_DEFS.length;

const STICKER_BY_ID = new Map(STICKER_DEFS.map((s) => [s.id, s]));

export function stickerById(id: string): StickerDef | undefined {
  return STICKER_BY_ID.get(id);
}

export function stickerForUnit(domain: string, unit: number): StickerDef {
  return unitStickerFor(domain, unit);
}

// ----- Earning logic -----

export interface EarningContext {
  xp: number;
  dailyStreak: number;
  bestSessionStreak: number;
  totalPerfectUnits: number;
  byDomainUnitsCompleted: Record<Domain, number>; // ≥2 stars units count
  alreadyEarned: Set<string>;
}

export interface UnitDoneEvent {
  domain: Domain;
  unit: number;
  stars: 0 | 1 | 2 | 3;
  mistakesTotal: number;
}

const STREAK_THRESHOLDS: { id: string; min: number }[] = [
  { id: 'streak-3', min: 3 },
  { id: 'streak-7', min: 7 },
  { id: 'streak-14', min: 14 },
  { id: 'streak-30', min: 30 },
  { id: 'streak-50', min: 50 },
  { id: 'streak-99', min: 99 },
];

const COMBO_THRESHOLDS: { id: string; min: number }[] = [
  { id: 'combo-10', min: 10 },
  { id: 'combo-25', min: 25 },
];

const XP_THRESHOLDS: { id: string; min: number }[] = [
  { id: 'xp-100', min: 100 },
  { id: 'xp-250', min: 250 },
  { id: 'xp-500', min: 500 },
  { id: 'xp-1000', min: 1000 },
  { id: 'xp-2500', min: 2500 },
];

export function checkAllEarning(
  ctx: EarningContext,
  unitDone?: UnitDoneEvent,
): string[] {
  const earned: string[] = [];
  const add = (id: string) => {
    if (!ctx.alreadyEarned.has(id) && !earned.includes(id)) earned.push(id);
  };

  // Streak (daily)
  for (const t of STREAK_THRESHOLDS) {
    if (ctx.dailyStreak >= t.min) add(t.id);
  }
  // Combo (session-streak)
  for (const t of COMBO_THRESHOLDS) {
    if (ctx.bestSessionStreak >= t.min) add(t.id);
  }
  // XP
  for (const t of XP_THRESHOLDS) {
    if (ctx.xp >= t.min) add(t.id);
  }
  // Accuracy (perfect-units lifetime)
  if (ctx.totalPerfectUnits >= 1) add('acc-perfect-1');
  if (ctx.totalPerfectUnits >= 5) add('acc-perfect-5');
  if (ctx.totalPerfectUnits >= 20) add('acc-perfect-20');
  // Accuracy (diamond round — current event)
  if (unitDone && unitDone.mistakesTotal === 0) add('acc-no-mistakes-unit');

  // Unit completion sticker
  if (unitDone && unitDone.stars === 3) {
    add(`unit:${unitDone.domain}:${unitDone.unit}`);
  }

  // Mastery (domain): all 6 units in domain have ≥2 stars
  for (const d of DOMAINS) {
    const completed = ctx.byDomainUnitsCompleted[d] ?? 0;
    if (completed >= 6) add(`mastery-${d}`);
  }

  // Grand mastery: every domain mastered
  const grandReady = DOMAINS.every((d) => (ctx.byDomainUnitsCompleted[d] ?? 0) >= 6);
  if (grandReady) add('mastery-grand');

  return earned;
}
