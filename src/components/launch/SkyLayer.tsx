import { useEffect, useMemo, useRef } from 'react';

const EQ = [
  '∫ x² dx', 'lim h→0', 'f′(x)', 'sin²θ + cos²θ = 1', 'e^{iπ} + 1 = 0', 'Σ', '∂', '√2', 'π', '∞', 'dy/dx', 'y = mx + b',
  'a² + b² = c²', 'x = (−b ± √(b²−4ac)) / 2a', 'log₂ n', '∮', 'Δx', 'θ', 'λ', 'ƒ', '(x−h)² + (y−k)² = r²', 'P(A|B)',
  'μ = 0, σ = 1', 'tan θ = o/a', 'n!', '≈', '≠', '≤', '∴', '∇', 'x³ − 3x', '3/4 + 1/4', '7 × 8 = 56', '∑ xᵢ / n',
  'cos 60° = ½', 'y = x²', '4 : 6 = 2 : 3', '∅', 'ℝ', 'ℤ', 'α', 'β', 'φ = 1.618…',
];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Stars (canvas) plus a scatter of faint equations. Deterministic per load. */
export function SkyLayer() {
  const canvas = useRef<HTMLCanvasElement>(null);

  const glyphs = useMemo(() => {
    const r = rng(4242);
    return Array.from({ length: 34 }, (_, i) => {
      const big = r() < 0.22;
      let t = EQ[Math.floor(r() * EQ.length)];
      if (big && t.length > 6) t = EQ[Math.floor(r() * 12)];
      const size = big ? 38 + r() * 70 : 10 + r() * 12;
      const op = big ? 0.04 + r() * 0.07 : 0.1 + r() * 0.22;
      const rot = (r() - 0.5) * (big ? 40 : 14);
      const tint = r();
      return {
        key: i,
        t,
        big,
        style: {
          left: `${r() * 100}%`,
          top: `${r() * 100}%`,
          fontSize: `${size.toFixed(0)}px`,
          opacity: op,
          transform: `translate(-50%,-50%) rotate(${rot.toFixed(0)}deg)`,
          color: tint < 0.3 ? 'var(--lb-mag)' : tint < 0.5 ? 'var(--lb-ink)' : undefined,
        },
      };
    });
  }, []);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const p = c.parentElement!;
    const draw = () => {
      const w = p.clientWidth;
      const h = p.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = w * dpr;
      c.height = h * dpr;
      const x = c.getContext('2d');
      if (!x) return;
      x.scale(dpr, dpr);
      const r = rng(w * 7 + h);
      for (let i = 0; i < Math.floor((w * h) / 2600); i++) {
        const s = r();
        x.fillStyle = `rgba(232,238,252,${0.15 + s * 0.7})`;
        x.beginPath();
        x.arc(r() * w, r() * h, s < 0.9 ? 0.7 : 1.6, 0, 7);
        x.fill();
      }
    };
    draw();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(draw) : null;
    ro?.observe(p);
    return () => ro?.disconnect();
  }, []);

  return (
    <>
      <canvas ref={canvas} className="lb-stars" aria-hidden="true" />
      <div className="lb-nebula" aria-hidden="true" />
      <div className="lb-grid" aria-hidden="true" />
      <div className="lb-glyphs" aria-hidden="true">
        {glyphs.map((g) => (
          <span key={g.key} className={g.big ? 'big' : undefined} style={g.style}>
            {g.t}
          </span>
        ))}
      </div>
      <div className="lb-sweep" aria-hidden="true" />
      <div className="lb-ruler top" aria-hidden="true" />
      <div className="lb-ruler left" aria-hidden="true" />
    </>
  );
}
