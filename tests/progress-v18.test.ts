import { describe, it, expect } from 'vitest';
import { useProgress, migrateProgress } from '../src/state/progress';

describe('migrateProgress v17 -> v18 (coin shop)', () => {
  it('seeds the shop fields', () => {
    const migrated = migrateProgress({ xp: 1 }, 17) as Record<string, any>;
    expect(migrated.coins).toBe(0);
    expect(migrated.ownedCosmetics).toEqual([]);
    expect(migrated.equipped).toEqual({});
    expect(migrated.unlockedGames).toEqual([]);
  });

  it('does not clobber an existing coin balance', () => {
    const migrated = migrateProgress({ coins: 50, ownedCosmetics: ['hat_bow'] }, 17) as Record<string, any>;
    expect(migrated.coins).toBe(50);
    expect(migrated.ownedCosmetics).toEqual(['hat_bow']);
  });

  it('buyCosmetic deducts coins, grants ownership, and rejects when broke', () => {
    const st = useProgress.getState();
    st.addCoins(100);
    const before = useProgress.getState().coins;
    const ok = st.buyCosmetic('hat_bow', 25);
    expect(ok).toBe(true);
    expect(useProgress.getState().coins).toBe(before - 25);
    expect(useProgress.getState().ownedCosmetics).toContain('hat_bow');
    // buying again is a no-op success (already owned), no extra charge
    const c2 = useProgress.getState().coins;
    expect(st.buyCosmetic('hat_bow', 25)).toBe(true);
    expect(useProgress.getState().coins).toBe(c2);
    // too expensive → rejected
    expect(st.buyCosmetic('hat_crown', 999999)).toBe(false);
  });

  it('equipCosmetic sets and clears a slot', () => {
    const st = useProgress.getState();
    st.equipCosmetic('hat', 'hat_bow');
    expect(useProgress.getState().equipped.hat).toBe('hat_bow');
    st.equipCosmetic('hat', null);
    expect(useProgress.getState().equipped.hat).toBeUndefined();
  });

  it('unlockGame deducts coins and records the unlock', () => {
    const st = useProgress.getState();
    st.addCoins(500);
    const before = useProgress.getState().coins;
    expect(st.unlockGame('tank', 120)).toBe(true);
    expect(useProgress.getState().coins).toBe(before - 120);
    expect(useProgress.getState().unlockedGames).toContain('tank');
  });
});
