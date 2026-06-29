import { useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';

// Tangram-style fit puzzle: place four L-shaped tans (each a cute animal) to
// fill the 4×4 frame. Four L-tetrominoes always tile a 4×4, so it's solvable.
// Select a tan, rotate it, then tap the grid to drop it. Tap a placed tan to
// pick it back up. Geometry/spatial reasoning.

const N = 4;
const TILE = 56;
const BASE_L: [number, number][] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
];
const PIECES = [
  { color: '#f472b6', emoji: '🐱' },
  { color: '#60a5fa', emoji: '🐶' },
  { color: '#34d399', emoji: '🐰' },
  { color: '#fbbf24', emoji: '🐼' },
];

function rotate(cells: [number, number][], times: number): [number, number][] {
  let cur = cells.map(([r, c]) => [r, c] as [number, number]);
  for (let t = 0; t < ((times % 4) + 4) % 4; t++) {
    cur = cur.map(([r, c]) => [c, -r] as [number, number]);
  }
  // normalise to min 0
  const minR = Math.min(...cur.map(([r]) => r));
  const minC = Math.min(...cur.map(([, c]) => c));
  return cur.map(([r, c]) => [r - minR, c - minC] as [number, number]);
}

export function Tangram() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const [occ, setOcc] = useState<number[]>(() => new Array(N * N).fill(-1));
  const [rot, setRot] = useState<number[]>(() => [0, 0, 0, 0]);
  const [placed, setPlaced] = useState<boolean[]>(() => [false, false, false, false]);
  const [sel, setSel] = useState<number | null>(0);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const idx = (r: number, c: number) => r * N + c;

  const tapCell = (r: number, c: number) => {
    if (outcome) return;
    const here = occ[idx(r, c)];
    if (here >= 0) {
      // pick the piece back up
      const next = occ.map((v) => (v === here ? -1 : v));
      setOcc(next);
      setPlaced((p) => p.map((v, i) => (i === here ? false : v)));
      setSel(here);
      return;
    }
    if (sel == null || placed[sel]) return;
    const cells = rotate(BASE_L, rot[sel]).map(([dr, dc]) => [r + dr, c + dc] as [number, number]);
    if (cells.some(([rr, cc]) => rr < 0 || rr >= N || cc < 0 || cc >= N || occ[idx(rr, cc)] >= 0)) {
      return; // doesn't fit
    }
    const next = [...occ];
    for (const [rr, cc] of cells) next[idx(rr, cc)] = sel;
    setOcc(next);
    setPlaced((p) => p.map((v, i) => (i === sel ? true : v)));
    setSel(null);
    if (next.every((v) => v >= 0)) {
      addArcadePoints(120);
      setOutcome(recordArcadePlay('tangram', 15));
    }
  };

  const reset = () => {
    setOcc(new Array(N * N).fill(-1));
    setRot([0, 0, 0, 0]);
    setPlaced([false, false, false, false]);
    setSel(0);
    setOutcome(null);
  };

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Tangram" emoji="🧩" />
        <ArcadeEndCard gameId="tangram" outcome={outcome} win scoreLine="🎉 Frame filled!" onReplay={reset} />
      </div>
    );
  }

  // preview cells for the selected piece's current rotation
  const previewShape = sel != null && !placed[sel] ? rotate(BASE_L, rot[sel]) : [];

  return (
    <div>
      <ArcadeHeader title="Tangram" emoji="🧩" />
      <p className="text-sm text-slate-600 mb-3 max-w-sm mx-auto text-center">
        Fill the whole frame with the four animal tans. Pick one, rotate it, then tap the grid.
        Tap a placed tan to pick it up again.
      </p>

      <div
        className="mx-auto grid rounded-lg"
        style={{
          width: '100%',
          maxWidth: N * TILE,
          aspectRatio: '1 / 1',
          gridTemplateColumns: `repeat(${N}, 1fr)`,
          gap: 4,
          background: '#475569', // grid-line colour shows through the gaps
          padding: 4,
        }}
      >
        {Array.from({ length: N * N }).map((_, i) => {
          const v = occ[i];
          const empty = v < 0;
          return (
            <button
              key={i}
              type="button"
              onClick={() => tapCell(Math.floor(i / N), i % N)}
              className="flex items-center justify-center rounded-md"
              style={{
                background: empty ? '#f1f5f9' : PIECES[v].color,
                border: empty ? '2px dashed #94a3b8' : '2px solid rgba(255,255,255,0.5)',
                fontSize: 24,
              }}
            >
              {empty ? '' : PIECES[v].emoji}
            </button>
          );
        })}
      </div>

      {/* tray */}
      <div className="mt-4 max-w-sm mx-auto flex items-center justify-center gap-3">
        {PIECES.map((p, i) =>
          placed[i] ? (
            <div key={i} className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center opacity-40">
              ✓
            </div>
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: p.color, outline: sel === i ? '3px solid #0f172a' : 'none' }}
            >
              {p.emoji}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => sel != null && setRot((rr) => rr.map((v, i) => (i === sel ? v + 1 : v)))}
          className="ml-2 min-h-12 px-4 rounded-xl bg-white border-2 border-slate-200 font-display font-extrabold text-slate-700"
        >
          ↻ Rotate
        </button>
      </div>

      {/* tiny shape preview */}
      {sel != null && !placed[sel] && (
        <div className="mt-3 flex justify-center">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 14px)', gap: 2 }}>
            {Array.from({ length: 9 }).map((_, k) => {
              const r = Math.floor(k / 3);
              const c = k % 3;
              const on = previewShape.some(([pr, pc]) => pr === r && pc === c);
              return (
                <div
                  key={k}
                  style={{ width: 14, height: 14, background: on ? PIECES[sel].color : 'transparent', borderRadius: 3 }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
