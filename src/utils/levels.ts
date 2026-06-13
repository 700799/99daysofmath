// Level curve: reaching level n+1 costs 50·n more XP than the previous level,
// so cumulative thresholds are T(n) = 50·n(n−1)/2: L2@50, L3@150, L4@300,
// L5@500, L6@750 … gentle early, steady later.

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return (50 * level * (level - 1)) / 2;
}

export interface LevelInfo {
  level: number;
  intoLevel: number; // XP earned inside the current level
  needed: number;    // XP needed to go from this level to the next
  progress: number;  // 0..1 toward the next level
}

export function levelForXp(xp: number): LevelInfo {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const needed = next - base;
  const intoLevel = xp - base;
  return { level, intoLevel, needed, progress: Math.min(1, intoLevel / needed) };
}
