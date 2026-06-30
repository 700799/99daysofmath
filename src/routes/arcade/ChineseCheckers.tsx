import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Star Hop — Chinese Checkers (2-player: you vs the computer) on the regulation
// six-point star. Board built with cube coords: the star is the union of two big
// triangles, intersecting in a radius-4 hexagon → exactly 121 holes. You hop your
// 10 pegs from the top point to the bottom point; step to an adjacent hole or
// chain jumps over neighbouring pegs. First to fill the opposite point wins.

type Cell = { key: string; x: number; y: number; z: number; px: number; py: number };
type Occ = Record<string, 'P' | 'C'>;

const DIRS: [number, number, number][] = [
  [1, -1, 0], [1, 0, -1], [0, 1, -1], [-1, 1, 0], [-1, 0, 1], [0, -1, 1],
];
const inStar = (x: number, y: number, z: number) =>
  (x <= 4 && y <= 4 && z <= 4) || (x >= -4 && y >= -4 && z >= -4);

// Build the 121-hole board once.
const CELLS: Cell[] = (() => {
  const out: Cell[] = [];
  for (let x = -8; x <= 8; x++)
    for (let y = -8; y <= 8; y++) {
      const z = -x - y;
      if (z < -8 || z > 8) continue;
      if (!inStar(x, y, z)) continue;
      out.push({ key: `${x},${y},${z}`, x, y, z, px: x + z / 2, py: z * 0.8660254 });
    }
  return out;
})();
const CELL_BY_KEY: Record<string, Cell> = Object.fromEntries(CELLS.map((c) => [c.key, c]));
const TOP_HOME = CELLS.filter((c) => c.z <= -5).map((c) => c.key); // player start
const BOTTOM_HOME = CELLS.filter((c) => c.z >= 5).map((c) => c.key); // computer start / player goal

// normalise to an SVG viewBox
const XS = CELLS.map((c) => c.px), YS = CELLS.map((c) => c.py);
const MINX = Math.min(...XS), MAXX = Math.max(...XS), MINY = Math.min(...YS), MAXY = Math.max(...YS);
const M = 16, SCALE = 30;
const VW = (MAXX - MINX) * SCALE + M * 2;
const VH = (MAXY - MINY) * SCALE + M * 2;
const sx = (c: Cell) => (c.px - MINX) * SCALE + M;
const sy = (c: Cell) => (c.py - MINY) * SCALE + M;

// All destinations reachable from `key`: single steps + recursive jump chains.
function reachable(key: string, occ: Occ): Set<string> {
  const out = new Set<string>();
  const c = CELL_BY_KEY[key];
  // steps
  for (const d of DIRS) {
    const n = CELL_BY_KEY[`${c.x + d[0]},${c.y + d[1]},${c.z + d[2]}`];
    if (n && !occ[n.key]) out.add(n.key);
  }
  // jumps (BFS)
  const seen = new Set<string>([key]);
  const stack = [key];
  while (stack.length) {
    const cur = CELL_BY_KEY[stack.pop()!];
    for (const d of DIRS) {
      const mid = CELL_BY_KEY[`${cur.x + d[0]},${cur.y + d[1]},${cur.z + d[2]}`];
      const land = CELL_BY_KEY[`${cur.x + 2 * d[0]},${cur.y + 2 * d[1]},${cur.z + 2 * d[2]}`];
      if (mid && occ[mid.key] && land && !occ[land.key] && !seen.has(land.key)) {
        seen.add(land.key);
        out.add(land.key);
        stack.push(land.key);
      }
    }
  }
  out.delete(key);
  return out;
}

const initialOcc = (): Occ => {
  const o: Occ = {};
  TOP_HOME.forEach((k) => (o[k] = 'P'));
  BOTTOM_HOME.forEach((k) => (o[k] = 'C'));
  return o;
};

export function ChineseCheckers() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };

  const [occ, setOcc] = useState<Occ>(initialOcc);
  const [sel, setSel] = useState<string | null>(null);
  const [turn, setTurn] = useState<'P' | 'C'>('P');
  const [last, setLast] = useState<[string, string] | null>(null);
  const [moves, setMoves] = useState(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);
  const aiTimer = useRef<number | null>(null);

  const dests = useMemo(() => (sel ? reachable(sel, occ) : new Set<string>()), [sel, occ]);

  const playerWon = useMemo(() => BOTTOM_HOME.every((k) => occ[k] === 'P'), [occ]);
  const compWon = useMemo(() => TOP_HOME.every((k) => occ[k] === 'C'), [occ]);

  useEffect(() => {
    if ((playerWon || compWon) && !outcome) {
      sfx[playerWon ? 'win' : 'lose']();
      const xp = playerWon ? 14 : Math.max(2, Math.min(8, Math.floor(moves / 6)));
      setOutcome(recordArcadePlay('starhop', xp));
    }
  }, [playerWon, compWon, outcome, moves, recordArcadePlay]);

  // computer move (greedy: advance toward the top, prefer big jumps)
  useEffect(() => {
    if (turn !== 'C' || outcome || playerWon || compWon) return;
    aiTimer.current = window.setTimeout(() => {
      let best: { from: string; to: string; adv: number } | null = null;
      for (const key of Object.keys(occ)) {
        if (occ[key] !== 'C') continue;
        const fromZ = CELL_BY_KEY[key].z;
        for (const to of reachable(key, occ)) {
          const adv = fromZ - CELL_BY_KEY[to].z; // moving toward smaller z (top)
          if (!best || adv > best.adv) best = { from: key, to, adv };
        }
      }
      if (best) {
        setOcc((o) => {
          const n = { ...o };
          delete n[best!.from];
          n[best!.to] = 'C';
          return n;
        });
        setLast([best.from, best.to]);
        sfx.step();
        setMoves((m) => m + 1);
      }
      setTurn('P');
    }, 520);
    return () => { if (aiTimer.current) window.clearTimeout(aiTimer.current); };
  }, [turn, occ, outcome, playerWon, compWon]);

  const tapCell = (key: string) => {
    if (turn !== 'P' || outcome) return;
    if (occ[key] === 'P') { setSel(key); sfx.pickup(); return; }
    if (sel && dests.has(key)) {
      setOcc((o) => {
        const n = { ...o };
        delete n[sel];
        n[key] = 'P';
        return n;
      });
      setLast([sel, key]);
      setSel(null);
      sfx.coin(); buzz(HAPTIC.pickup);
      setMoves((m) => m + 1);
      setTurn('C');
    } else if (sel) {
      setSel(null);
    }
  };

  const reset = () => {
    setOcc(initialOcc());
    setSel(null);
    setTurn('P');
    setLast(null);
    setMoves(0);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Star Hop" emoji="🌟" />
        <ArcadeEndCard
          gameId="starhop"
          outcome={outcome}
          win={playerWon}
          scoreLine={playerWon ? `You reached the far star in ${moves} moves! 🌟` : 'The computer got home first — rematch?'}
          onReplay={reset}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Star Hop" emoji="🌟" />
      <p className="mx-auto mb-2 max-w-md text-center text-sm font-display font-bold text-slate-600">
        Hop your <span className="text-rose-600">red</span> pegs from the top point to the bottom point. Tap a peg, then a glowing hole. Jump over pegs to chain hops!
      </p>
      <div className="mx-auto mb-2 max-w-md text-center text-xs font-display font-extrabold">
        <span className={turn === 'P' ? 'text-rose-600' : 'text-slate-400'}>● Your turn</span>
        <span className="mx-2 text-slate-300">|</span>
        <span className={turn === 'C' ? 'text-sky-600' : 'text-slate-400'}>● Computer</span>
        <span className="ml-3 text-slate-500">moves: {moves}</span>
      </div>

      <div className="mx-auto w-full max-w-[360px]">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full">
          {CELLS.map((c) => {
            const isDest = dests.has(c.key);
            const who = occ[c.key];
            const isSel = sel === c.key;
            const isLast = last && (last[0] === c.key || last[1] === c.key);
            const goalTint = c.z >= 5; // player's goal point
            return (
              <g key={c.key} onClick={() => tapCell(c.key)} style={{ cursor: 'pointer' }}>
                <circle cx={sx(c)} cy={sy(c)} r={12} fill={goalTint ? '#fde68a' : '#e2e8f0'} stroke={isLast ? '#f59e0b' : '#cbd5e1'} strokeWidth={isLast ? 3 : 1.5} />
                {isDest && <circle cx={sx(c)} cy={sy(c)} r={6} fill="#22c55e" opacity={0.7} />}
                {who && (
                  <circle
                    cx={sx(c)}
                    cy={sy(c)}
                    r={10}
                    fill={who === 'P' ? '#ef4444' : '#3b82f6'}
                    stroke={isSel ? '#fde047' : who === 'P' ? '#991b1b' : '#1e3a8a'}
                    strokeWidth={isSel ? 4 : 2}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mx-auto mt-2 max-w-md text-center text-xs text-slate-400">
        Chinese Checkers · first to fill the opposite star point wins.
      </p>
    </div>
  );
}
