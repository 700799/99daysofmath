import { describe, it, expect } from 'vitest';
import { chooseGhostDir, countPellets } from '../src/routes/arcade/mazeAI';

// Open 10x10 grid: only out-of-bounds is a wall.
const openWall = (c: number, r: number) => c < 0 || c >= 10 || r < 0 || r >= 10;

describe('chooseGhostDir', () => {
  it('steps straight toward the target', () => {
    const d = chooseGhostDir(5, 5, null, { c: 5, r: 0 }, openWall, { jitter: 0 });
    expect(d).toEqual({ dx: 0, dy: -1 });
  });

  it('flees directly away from the target', () => {
    const d = chooseGhostDir(5, 5, null, { c: 5, r: 0 }, openWall, { flee: true, jitter: 0 });
    expect(d).toEqual({ dx: 0, dy: 1 });
  });

  it('never reverses unless boxed in', () => {
    // Moving right, target is to the left — reversing (left) is disallowed,
    // so it should turn up or down, not back left.
    const d = chooseGhostDir(5, 5, { dx: 1, dy: 0 }, { c: 0, r: 5 }, openWall, { jitter: 0 });
    expect(d.dx).not.toBe(-1);
  });
});

describe('countPellets', () => {
  it('counts dots and power-pellets', () => {
    expect(countPellets(['#.#', 'o.o'])).toBe(4);
  });
});
