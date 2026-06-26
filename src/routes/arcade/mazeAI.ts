// Pure, React-free helpers shared by the maze-style arcade games (Hungry Hippo,
// Gem Digger). Kept dependency-free so they're cheap to unit-test.

export type Dir = { dx: number; dy: number };
export const UP: Dir = { dx: 0, dy: -1 };
export const DOWN: Dir = { dx: 0, dy: 1 };
export const LEFT: Dir = { dx: -1, dy: 0 };
export const RIGHT: Dir = { dx: 1, dy: 0 };
export const DIRS: Dir[] = [UP, DOWN, LEFT, RIGHT];

export type Target = { c: number; r: number };

// Pick a pursuer's next step. Greedy toward (or, when fleeing, away from) the
// target tile, never reversing unless boxed in. `jitter` adds randomness for a
// wandering chaser. `wall(c, r)` reports whether a tile is impassable.
export function chooseGhostDir(
  c: number,
  r: number,
  dir: Dir | null,
  target: Target,
  wall: (c: number, r: number) => boolean,
  opts: { flee?: boolean; jitter?: number } = {},
  rand: () => number = Math.random,
): Dir {
  const { flee = false, jitter = 0 } = opts;
  let options = DIRS.filter(
    (d) => !wall(c + d.dx, r + d.dy) && !(dir && d.dx === -dir.dx && d.dy === -dir.dy),
  );
  if (!options.length) options = DIRS.filter((d) => !wall(c + d.dx, r + d.dy));
  if (!options.length) return dir ?? RIGHT;
  let best = options[0];
  let bestScore = Infinity;
  for (const d of options) {
    const nc = c + d.dx;
    const nr = r + d.dy;
    let s = (nc - target.c) ** 2 + (nr - target.r) ** 2;
    if (flee) s = -s;
    s += jitter * rand();
    if (s < bestScore) {
      bestScore = s;
      best = d;
    }
  }
  return best;
}

// Count the eatable cells ('.' pellets and 'o' power-pellets) in a string maze.
export function countPellets(rows: string[]): number {
  let n = 0;
  for (const row of rows) for (const ch of row) if (ch === '.' || ch === 'o') n++;
  return n;
}
