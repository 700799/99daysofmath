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
      // Dots take the theme's text colour, so they show on a light or dark panel.
      const rgb = getComputedStyle(c).color.match(/[\d.]+/g)?.slice(0, 3).join(',') ?? '134,139,147';
      for (let i = 0; i < Math.floor((w * h) / 2600); i++) {
        const s = r();
        x.fillStyle = `rgba(${rgb},${0.15 + s * 0.7})`;
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
      <SpaceArt />
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

const WARM = 'rgb(var(--lb-sun))';
const COOL = 'rgb(var(--accent))';

/** A four-point sparkle centred on (x, y). */
function Sparkle({ x, y, r, delay = 0 }: { x: number; y: number; r: number; delay?: number }) {
  const k = r * 0.22;
  return (
    <path
      className="lb-twinkle"
      style={{ animationDelay: `${delay}s`, transformOrigin: `${x}px ${y}px` }}
      d={`M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k} Z`}
    />
  );
}

/**
 * Space drawn in the theme's own colours, so it reads on a light panel as well
 * as a dark one: a sun with flares and orbits in the top corner, a ringed
 * planet in the bottom corner, and a tracked constellation in between.
 */
function SpaceArt() {
  return (
    <>
      <svg className="lb-art lb-sun" viewBox="0 0 420 420" aria-hidden="true">
        <defs>
          <radialGradient id="lb-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: WARM, stopOpacity: 0.7 }} />
            <stop offset="38%" style={{ stopColor: WARM, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: WARM, stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        {/* the sun sits in the corner, mostly off the panel */}
        <circle cx="330" cy="90" r="210" fill="url(#lb-sun-glow)" />
        <circle cx="330" cy="90" r="62" style={{ fill: WARM, fillOpacity: 0.45, stroke: WARM, strokeOpacity: 0.9 }} strokeWidth="1.5" />
        {/* flares: loops of plasma leaving and rejoining the surface */}
        <g fill="none" style={{ stroke: WARM }} strokeLinecap="round" className="lb-flares">
          <path d="M276 60 C230 20 236 96 272 108" strokeWidth="3" strokeOpacity="0.9" />
          <path d="M282 122 C232 150 270 190 304 150" strokeWidth="2.4" strokeOpacity="0.8" />
          <path d="M300 34 C268 -8 330 -6 318 30" strokeWidth="2" strokeOpacity="0.75" />
          <path d="M262 84 C214 84 206 116 244 124" strokeWidth="1" strokeOpacity="0.45" strokeDasharray="3 5" />
        </g>
        {/* rays */}
        <g style={{ stroke: WARM }} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 7">
          <path d="M252 118 L120 188" />
          <path d="M262 150 L170 262" />
          <path d="M296 166 L262 300" />
          <path d="M250 82 L96 76" />
        </g>
        {/* orbits with small worlds on them */}
        <g fill="none" style={{ stroke: COOL }}>
          <circle cx="330" cy="90" r="120" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="1 5" />
          <circle cx="330" cy="90" r="178" strokeOpacity="0.32" strokeWidth="1" />
          <circle cx="330" cy="90" r="246" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="10 8" />
        </g>
        <g className="lb-orbit" style={{ transformOrigin: '330px 90px' }}>
          <circle cx="210" cy="90" r="5" style={{ fill: COOL }} fillOpacity="0.8" />
          <circle cx="210" cy="90" r="9" fill="none" style={{ stroke: COOL }} strokeOpacity="0.4" />
        </g>
        <g className="lb-orbit slow" style={{ transformOrigin: '330px 90px' }}>
          <circle cx="204" cy="216" r="7" style={{ fill: COOL }} fillOpacity="0.55" />
        </g>
        <circle cx="118" cy="214" r="3.5" style={{ fill: COOL }} fillOpacity="0.5" />
      </svg>

      <svg className="lb-art lb-planet" viewBox="0 0 320 240" aria-hidden="true">
        <defs>
          <linearGradient id="lb-planet-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: COOL, stopOpacity: 0.34 }} />
            <stop offset="100%" style={{ stopColor: COOL, stopOpacity: 0.08 }} />
          </linearGradient>
        </defs>
        <ellipse cx="120" cy="150" rx="150" ry="34" fill="none" style={{ stroke: COOL }} strokeOpacity="0.35" strokeWidth="1" transform="rotate(-18 120 150)" />
        <circle cx="120" cy="150" r="74" fill="url(#lb-planet-fill)" style={{ stroke: COOL }} strokeOpacity="0.45" strokeWidth="1.2" />
        <g fill="none" style={{ stroke: COOL }} strokeOpacity="0.25" strokeWidth="1">
          <path d="M52 128 Q120 108 190 132" />
          <path d="M48 158 Q120 140 194 160" />
          <path d="M58 186 Q120 172 184 188" />
        </g>
        <path d="M-22 196 A150 34 -18 0 0 262 104" fill="none" style={{ stroke: COOL }} strokeOpacity="0.6" strokeWidth="2.5" />
        <circle cx="262" cy="72" r="6" style={{ fill: COOL }} fillOpacity="0.5" />
      </svg>

      <svg className="lb-art lb-track" viewBox="0 0 300 220" aria-hidden="true">
        {/* a constellation being tracked by a targeting ring */}
        <g fill="none" style={{ stroke: COOL }} strokeOpacity="0.4" strokeWidth="1">
          <path d="M24 170 L84 120 L140 138 L196 70 L262 44" />
          <path d="M140 138 L170 196" strokeDasharray="3 4" />
        </g>
        <g style={{ fill: COOL }} fillOpacity="0.75">
          <Sparkle x={24} y={170} r={7} />
          <Sparkle x={84} y={120} r={9} delay={1.2} />
          <Sparkle x={140} y={138} r={6} delay={2.1} />
          <Sparkle x={196} y={70} r={11} delay={0.6} />
          <Sparkle x={262} y={44} r={7} delay={3} />
          <Sparkle x={170} y={196} r={5} delay={1.8} />
        </g>
        <g fill="none" style={{ stroke: WARM }} strokeOpacity="0.75" strokeWidth="1.2">
          <circle cx="196" cy="70" r="24" strokeDasharray="30 8" className="lb-lock" style={{ transformOrigin: '196px 70px' }} />
          <path d="M196 34 V46 M196 94 V106 M160 70 H172 M220 70 H232" />
        </g>
        <text x="228" y="98" className="lb-readout">TRK 04 · 61.8°</text>
        <text x="20" y="196" className="lb-readout">α 14h 29m</text>
      </svg>
    </>
  );
}
