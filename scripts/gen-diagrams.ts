/**
 * Generate inline-SVG diagrams for existing 6.x problems whose prompts encode
 * enough geometry/data to draw automatically. Handlers run in order; the first
 * match wins. Existing diagrams are NEVER overwritten.
 *
 * Run: `npx tsx scripts/gen-diagrams.ts`
 */
import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

interface Diagram {
  kind: 'inline-svg';
  alt: string;
  svg: string;
}

interface Problem {
  id: string;
  domain: string;
  prompt: string;
  diagram?: Diagram;
}

// ──────────────────────────── SVG builders ────────────────────────────

const COLORS = {
  ink: '#0f172a',
  ruleAxis: '#64748b',
  fill: '#FFE8B5',
  fill2: '#A7F3D0',
  fill3: '#BAE6FD',
  edge: '#F59E0B',
  edge2: '#10B981',
  edge3: '#0EA5E9',
  point: '#EF4444',
  grid: '#E2E8F0',
};

function rectangleSVG(w: number, h: number, unit = ''): string {
  const margin = 38;
  const maxPx = 220;
  const scale = Math.min(maxPx / Math.max(w, h), 36);
  const W = w * scale;
  const H = h * scale;
  const cw = W + margin * 2;
  const ch = H + margin * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" role="img"><rect x="${margin}" y="${margin}" width="${W}" height="${H}" fill="${COLORS.fill}" stroke="${COLORS.edge}" stroke-width="3"/><g font-family="Nunito, sans-serif" font-size="16" font-weight="700" fill="${COLORS.ink}" text-anchor="middle"><text x="${margin + W / 2}" y="${margin - 10}">${w}${unit}</text><text x="${margin + W / 2}" y="${margin + H + 22}">${w}${unit}</text><text x="${margin - 14}" y="${margin + H / 2 + 5}" transform="rotate(-90 ${margin - 14} ${margin + H / 2 + 5})">${h}${unit}</text><text x="${margin + W + 14}" y="${margin + H / 2 + 5}" transform="rotate(90 ${margin + W + 14} ${margin + H / 2 + 5})">${h}${unit}</text></g></svg>`;
}

function triangleSVG(b: number, h: number, unit = ''): string {
  const margin = 38;
  const maxPx = 220;
  const scale = Math.min(maxPx / Math.max(b, h), 36);
  const W = b * scale;
  const H = h * scale;
  const cw = W + margin * 2;
  const ch = H + margin * 2;
  const ax = margin;
  const ay = margin + H;
  const bx = margin + W;
  const by = margin + H;
  const cx = margin + W * 0.4;
  const cy = margin;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" role="img"><polygon points="${ax},${ay} ${bx},${by} ${cx},${cy}" fill="${COLORS.fill2}" stroke="${COLORS.edge2}" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${ay}" stroke="${COLORS.edge2}" stroke-width="2" stroke-dasharray="5 4"/><g font-family="Nunito, sans-serif" font-size="16" font-weight="700" fill="${COLORS.ink}" text-anchor="middle"><text x="${margin + W / 2}" y="${ay + 22}">b = ${b}${unit}</text><text x="${cx + W * 0.18}" y="${margin + H / 2 + 5}">h = ${h}${unit}</text></g></svg>`;
}

function prismSVG(l: number, w: number, h: number, unit = ''): string {
  const margin = 30;
  const scale = Math.min(36, 200 / Math.max(l, w, h));
  const L = l * scale;
  const W = w * scale;
  const H = h * scale;
  const dx = W * 0.55;
  const dy = -W * 0.4;
  const cw = L + Math.abs(dx) + margin * 2;
  const ch = H + Math.abs(dy) + margin * 2;
  const x = margin;
  const y = margin + Math.abs(dy);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" role="img"><g fill="none" stroke="${COLORS.edge3}" stroke-width="2.5" stroke-linejoin="round"><polygon points="${x},${y} ${x + L},${y} ${x + L},${y + H} ${x},${y + H}" fill="${COLORS.fill3}"/><polygon points="${x},${y} ${x + dx},${y + dy} ${x + L + dx},${y + dy} ${x + L},${y}" fill="${COLORS.fill3}"/><polygon points="${x + L},${y} ${x + L + dx},${y + dy} ${x + L + dx},${y + H + dy} ${x + L},${y + H}" fill="${COLORS.fill3}"/></g><g font-family="Nunito, sans-serif" font-size="14" font-weight="700" fill="${COLORS.ink}" text-anchor="middle"><text x="${x + L / 2}" y="${y + H + 22}">l = ${l}${unit}</text><text x="${x + L + dx / 2 + 14}" y="${y + dy / 2 + 4}">w = ${w}${unit}</text><text x="${x + L + dx + 24}" y="${y + dy + H / 2 + 5}">h = ${h}${unit}</text></g></svg>`;
}

function coordPlaneSVG(opts: {
  points?: { x: number; y: number; label?: string; color?: string }[];
  highlightQuadrant?: 1 | 2 | 3 | 4;
  span?: number;
}): string {
  const span = opts.span ?? 6;
  const px = 18;
  const o = px * span + 30;
  const size = px * span * 2 + 60;
  const toX = (x: number) => o + x * px;
  const toY = (y: number) => o - y * px;

  const quadFills: Record<number, string> = {
    1: `<rect x="${o}" y="${o - px * span}" width="${px * span}" height="${px * span}" fill="${COLORS.fill}" opacity="0.5"/>`,
    2: `<rect x="${o - px * span}" y="${o - px * span}" width="${px * span}" height="${px * span}" fill="${COLORS.fill}" opacity="0.5"/>`,
    3: `<rect x="${o - px * span}" y="${o}" width="${px * span}" height="${px * span}" fill="${COLORS.fill}" opacity="0.5"/>`,
    4: `<rect x="${o}" y="${o}" width="${px * span}" height="${px * span}" fill="${COLORS.fill}" opacity="0.5"/>`,
  };
  const hl = opts.highlightQuadrant ? quadFills[opts.highlightQuadrant] : '';

  let grid = '';
  for (let i = -span; i <= span; i++) {
    grid += `<line x1="${toX(i)}" y1="${o - px * span}" x2="${toX(i)}" y2="${o + px * span}" stroke="${COLORS.grid}" stroke-width="1"/>`;
    grid += `<line x1="${o - px * span}" y1="${toY(i)}" x2="${o + px * span}" y2="${toY(i)}" stroke="${COLORS.grid}" stroke-width="1"/>`;
  }

  const axes = `<line x1="${o - px * span}" y1="${o}" x2="${o + px * span}" y2="${o}" stroke="${COLORS.ink}" stroke-width="2"/><line x1="${o}" y1="${o - px * span}" x2="${o}" y2="${o + px * span}" stroke="${COLORS.ink}" stroke-width="2"/>`;

  let labels = '';
  for (let i = -span; i <= span; i += 2) {
    if (i === 0) continue;
    labels += `<text x="${toX(i)}" y="${o + 14}" font-family="Nunito" font-size="11" fill="${COLORS.ruleAxis}" text-anchor="middle">${i}</text>`;
    labels += `<text x="${o - 8}" y="${toY(i) + 4}" font-family="Nunito" font-size="11" fill="${COLORS.ruleAxis}" text-anchor="end">${i}</text>`;
  }

  let dots = '';
  for (const pt of opts.points ?? []) {
    const c = pt.color ?? COLORS.point;
    dots += `<circle cx="${toX(pt.x)}" cy="${toY(pt.y)}" r="5" fill="${c}"/>`;
    if (pt.label) {
      dots += `<text x="${toX(pt.x) + 10}" y="${toY(pt.y) - 8}" font-family="Nunito" font-size="13" font-weight="700" fill="${c}">${pt.label}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img">${hl}${grid}${axes}${labels}${dots}</svg>`;
}

function numberLineSVG(opts: {
  min: number;
  max: number;
  marks?: { value: number; label?: string; color?: string; open?: boolean }[];
}): string {
  const W = 440;
  const H = 80;
  const padL = 30;
  const padR = 30;
  const y = 40;
  const span = opts.max - opts.min;
  const toX = (v: number) => padL + ((v - opts.min) / span) * (W - padL - padR);

  let ticks = '';
  for (let v = opts.min; v <= opts.max; v++) {
    const x = toX(v);
    ticks += `<line x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}" stroke="${COLORS.ink}" stroke-width="2"/>`;
    ticks += `<text x="${x}" y="${y + 28}" font-family="Nunito" font-size="12" font-weight="700" fill="${COLORS.ink}" text-anchor="middle">${v}</text>`;
  }

  let dots = '';
  for (const m of opts.marks ?? []) {
    const x = toX(m.value);
    const c = m.color ?? COLORS.point;
    if (m.open) {
      dots += `<circle cx="${x}" cy="${y}" r="7" fill="white" stroke="${c}" stroke-width="3"/>`;
    } else {
      dots += `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`;
    }
    if (m.label) {
      dots += `<text x="${x}" y="${y - 14}" font-family="Nunito" font-size="13" font-weight="700" fill="${c}" text-anchor="middle">${m.label}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img"><line x1="${padL - 8}" y1="${y}" x2="${W - padR + 8}" y2="${y}" stroke="${COLORS.ink}" stroke-width="2"/><polygon points="${padL - 8},${y} ${padL},${y - 6} ${padL},${y + 6}" fill="${COLORS.ink}"/><polygon points="${W - padR + 8},${y} ${W - padR},${y - 6} ${W - padR},${y + 6}" fill="${COLORS.ink}"/>${ticks}${dots}</svg>`;
}

function dotPlotSVG(data: number[]): string {
  const sorted = [...data].sort((a, b) => a - b);
  const min = Math.min(...sorted) - 1;
  const max = Math.max(...sorted) + 1;
  const W = 420;
  const H = 130;
  const padL = 30;
  const padR = 30;
  const baseY = 100;
  const span = max - min;
  const toX = (v: number) => padL + ((v - min) / span) * (W - padL - padR);

  const counts = new Map<number, number>();
  for (const v of sorted) counts.set(v, (counts.get(v) ?? 0) + 1);

  let ticks = '';
  for (let v = min; v <= max; v++) {
    const x = toX(v);
    ticks += `<line x1="${x}" y1="${baseY - 4}" x2="${x}" y2="${baseY + 4}" stroke="${COLORS.ink}" stroke-width="1.5"/>`;
    ticks += `<text x="${x}" y="${baseY + 20}" font-family="Nunito" font-size="11" font-weight="700" fill="${COLORS.ink}" text-anchor="middle">${v}</text>`;
  }

  let dots = '';
  for (const [v, count] of counts.entries()) {
    const x = toX(v);
    for (let i = 0; i < count; i++) {
      const cy = baseY - 14 - i * 14;
      dots += `<circle cx="${x}" cy="${cy}" r="5" fill="${COLORS.edge3}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img"><line x1="${padL - 10}" y1="${baseY}" x2="${W - padR + 10}" y2="${baseY}" stroke="${COLORS.ink}" stroke-width="2"/>${ticks}${dots}</svg>`;
}

function lShapeSVG(a: number, b: number, c: number, d: number): string {
  // L-shape made of two rectangles: a×b and c×d, placed adjacent.
  const margin = 30;
  const scale = Math.min(28, 200 / Math.max(a + c, b, d));
  const A = a * scale;
  const B = b * scale;
  const C = c * scale;
  const D = d * scale;
  const cw = A + C + margin * 2;
  const ch = Math.max(B, D) + margin * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" role="img"><g><rect x="${margin}" y="${margin}" width="${A}" height="${B}" fill="${COLORS.fill}" stroke="${COLORS.edge}" stroke-width="3"/><rect x="${margin + A}" y="${margin}" width="${C}" height="${D}" fill="${COLORS.fill2}" stroke="${COLORS.edge2}" stroke-width="3"/></g><g font-family="Nunito" font-size="14" font-weight="700" fill="${COLORS.ink}" text-anchor="middle"><text x="${margin + A / 2}" y="${margin - 8}">${a}</text><text x="${margin - 12}" y="${margin + B / 2 + 5}">${b}</text><text x="${margin + A + C / 2}" y="${margin - 8}">${c}</text><text x="${margin + A + C + 14}" y="${margin + D / 2 + 5}">${d}</text></g></svg>`;
}

function percentGridSVG(pct: number): string {
  const cell = 18;
  const W = cell * 10 + 40;
  const H = cell * 10 + 40;
  const filled = Math.round(pct);
  let cells = '';
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      const i = r * 10 + c;
      const fill = i < filled ? COLORS.edge3 : 'white';
      cells += `<rect x="${20 + c * cell}" y="${20 + r * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="${COLORS.ink}" stroke-width="1"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">${cells}</svg>`;
}

function tapeDiagramSVG(parts: { value: number; label: string; color?: string }[]): string {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const W = 380;
  const H = 80;
  const padL = 20;
  const padR = 20;
  const barW = W - padL - padR;
  const y = 30;
  const h = 36;
  let cells = '';
  let x = padL;
  const palette = [COLORS.edge3, COLORS.edge2, COLORS.edge, COLORS.point];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const w = (p.value / total) * barW;
    const col = p.color ?? palette[i % palette.length];
    cells += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}" opacity="0.7" stroke="${COLORS.ink}" stroke-width="1"/>`;
    cells += `<text x="${x + w / 2}" y="${y + h / 2 + 5}" font-family="Nunito" font-size="14" font-weight="700" fill="white" text-anchor="middle">${p.label}</text>`;
    x += w;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img">${cells}</svg>`;
}

// ──────────────────────────── Pattern handlers ────────────────────────────

type Handler = (p: Problem) => Diagram | null;

const handlers: Handler[] = [
  // Square: "square with side $X$" or "side length $X$"
  (p) => {
    if (p.domain !== '6.G') return null;
    if (!/square/i.test(p.prompt)) return null;
    const m = p.prompt.match(/side(?:\s*length)?\s*\$?(\d+(?:\.\d+)?)\$?/i);
    if (!m) return null;
    const s = parseFloat(m[1]);
    if (!isFinite(s) || s <= 0 || s > 100) return null;
    return { kind: 'inline-svg', alt: `Square with side ${s}`, svg: rectangleSVG(s, s) };
  },

  // Cube: "cube with side X" or "cube has side length X"
  (p) => {
    if (p.domain !== '6.G') return null;
    if (!/cube/i.test(p.prompt)) return null;
    const m = p.prompt.match(/(?:side|edge)(?:\s*length)?\s*\$?(\d+(?:\.\d+)?)\$?/i);
    if (!m) return null;
    const s = parseFloat(m[1]);
    if (!isFinite(s) || s <= 0 || s > 100) return null;
    return { kind: 'inline-svg', alt: `Cube with side ${s}`, svg: prismSVG(s, s, s) };
  },

  // Rectangle area: "length X and width Y" with optional units
  (p) => {
    if (p.domain !== '6.G') return null;
    if (/triangle/i.test(p.prompt)) return null;
    const m =
      p.prompt.match(/rectangle[^]*?length\s*\$?(\d+(?:\.\d+)?)\$?[^\d]*?width\s*\$?(\d+(?:\.\d+)?)\$?/i) ||
      p.prompt.match(/(\d+)\s*[×x]\s*(\d+)\s*rectangle/i) ||
      p.prompt.match(/rectangle[^]*?(\d+)\s*[×x]\s*(\d+)/i);
    if (!m) return null;
    const w = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0 || w > 100 || h > 100) return null;
    return { kind: 'inline-svg', alt: `Rectangle ${w} by ${h}`, svg: rectangleSVG(w, h) };
  },

  // Parallelogram: "base X and height Y"
  (p) => {
    if (p.domain !== '6.G') return null;
    if (!/parallelogram/i.test(p.prompt)) return null;
    const m = p.prompt.match(/base\s*\$?(\d+(?:\.\d+)?)\$?[^\d]*?height\s*\$?(\d+(?:\.\d+)?)\$?/i);
    if (!m) return null;
    const b = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    if (!isFinite(b) || !isFinite(h)) return null;
    return { kind: 'inline-svg', alt: `Parallelogram base ${b} height ${h}`, svg: rectangleSVG(b, h) };
  },

  // Triangle: "base X and height Y" (units optional between)
  (p) => {
    if (p.domain !== '6.G') return null;
    if (!/triangle/i.test(p.prompt)) return null;
    const m = p.prompt.match(/base\s*\$?(\d+(?:\.\d+)?)\$?[^\d]*?height\s*\$?(\d+(?:\.\d+)?)\$?/i);
    if (!m) return null;
    const b = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    if (!isFinite(b) || !isFinite(h) || b <= 0 || h <= 0 || b > 100 || h > 100) return null;
    return { kind: 'inline-svg', alt: `Triangle base ${b} height ${h}`, svg: triangleSVG(b, h) };
  },

  // Right triangle from vertices: "vertices at (0,0), (X,0), (0,Y)"
  (p) => {
    if (p.domain !== '6.G') return null;
    const m = p.prompt.match(/vertices at\s*\$?\(0,\s*0\)\$?,\s*\$?\((\d+),\s*0\)\$?,\s*\$?\(0,\s*(\d+)\)/);
    if (!m) return null;
    const b = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    return { kind: 'inline-svg', alt: `Right triangle with legs ${b} and ${h}`, svg: triangleSVG(b, h) };
  },

  // Prism volume: "length X (unit?), width Y (unit?), (and) height Z (unit?)"
  (p) => {
    if (p.domain !== '6.G') return null;
    const m =
      p.prompt.match(/length\s*\$?(\d+(?:\.\d+)?)\$?[^\d]*?width\s*\$?(\d+(?:\.\d+)?)\$?[^\d]*?height\s*\$?(\d+(?:\.\d+)?)\$?/i) ||
      p.prompt.match(/prism[^]*?\$?(\d+)\$?\s*\\?times\s*\$?(\d+)\$?\s*\\?times\s*\$?(\d+)/i) ||
      p.prompt.match(/prism[^]*?(\d+)\s*[×x]\s*(\d+)\s*[×x]\s*(\d+)/i) ||
      p.prompt.match(/(\d+)\s*cm\s*[×x]\s*(\d+)\s*cm\s*[×x]\s*(\d+)\s*cm/i) ||
      p.prompt.match(/(\d+)\s*(?:cm|ft|in|m)\s*long[^]*?(\d+)\s*(?:cm|ft|in|m)\s*wide[^]*?(\d+)\s*(?:cm|ft|in|m)\s*(?:tall|high|deep)/i);
    if (!m) return null;
    const l = parseFloat(m[1]);
    const w = parseFloat(m[2]);
    const h = parseFloat(m[3]);
    if (!isFinite(l) || !isFinite(w) || !isFinite(h) || l > 100 || w > 100 || h > 100) return null;
    return { kind: 'inline-svg', alt: `Rectangular prism ${l}×${w}×${h}`, svg: prismSVG(l, w, h) };
  },

  // L-shape: "two rectangles: $A \times B$ and $C \times D$"
  (p) => {
    if (p.domain !== '6.G') return null;
    const m = p.prompt.match(/two rectangles:\s*\$(\d+)\s*\\times\s*(\d+)\$\s*and\s*\$(\d+)\s*\\times\s*(\d+)\$/);
    if (!m) return null;
    return {
      kind: 'inline-svg',
      alt: `L-shape from two rectangles`,
      svg: lShapeSVG(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseInt(m[4])),
    };
  },

  // Rectangle from 4 corners on grid
  (p) => {
    if (p.domain !== '6.G') return null;
    const m = p.prompt.match(/(?:corners|vertices) at\s*\$?\((-?\d+),\s*(-?\d+)\)\$?,?\s*\$?\((-?\d+),\s*(-?\d+)\)\$?,?\s*(?:and\s*)?\$?\((-?\d+),\s*(-?\d+)\)\$?,?\s*(?:and\s*)?\$?\((-?\d+),\s*(-?\d+)\)/);
    if (!m) return null;
    const xs = [m[1], m[3], m[5], m[7]].map(Number);
    const ys = [m[2], m[4], m[6], m[8]].map(Number);
    const points = xs.map((x, i) => ({ x, y: ys[i], label: '' }));
    return {
      kind: 'inline-svg',
      alt: 'Rectangle on the coordinate plane',
      svg: coordPlaneSVG({ points, span: Math.max(...xs.map(Math.abs), ...ys.map(Math.abs)) + 2 }),
    };
  },

  // Quadrant ID: "in which quadrant is the point $(X, Y)$"
  (p) => {
    if (p.domain !== '6.NS') return null;
    const m = p.prompt.match(/point\s*\$?\((-?\d+),\s*(-?\d+)\)/);
    if (!m) return null;
    const x = parseInt(m[1]);
    const y = parseInt(m[2]);
    if (x === 0 || y === 0) return null;
    return {
      kind: 'inline-svg',
      alt: `Coordinate plane with point (${x}, ${y}) plotted`,
      svg: coordPlaneSVG({ points: [{ x, y, label: `(${x}, ${y})` }] }),
    };
  },

  // Opposite-of: "opposite of $X$" → simple number line marking
  (p) => {
    if (p.domain !== '6.NS' || !/opposite of/i.test(p.prompt)) return null;
    const m = p.prompt.match(/opposite of\s*\$?(-?\d+)/i);
    if (!m) return null;
    const v = parseInt(m[1]);
    if (Math.abs(v) > 15) return null;
    return {
      kind: 'inline-svg',
      alt: `Number line marking ${v} and its opposite`,
      svg: numberLineSVG({
        min: -Math.max(Math.abs(v) + 2, 5),
        max: Math.max(Math.abs(v) + 2, 5),
        marks: [
          { value: v, label: `${v}`, color: COLORS.point },
          { value: -v, label: `${-v}`, color: COLORS.edge2 },
        ],
      }),
    };
  },

  // Comparing two signed values: "$-15 \ ?\ -10$" or "$-5 \;?\; -8$"
  (p) => {
    if (p.domain !== '6.NS') return null;
    const m = p.prompt.match(/\$(-?\d+)\s*\\[;\s]+\?\s*\\[;\s]+(-?\d+)\$/);
    if (!m) return null;
    const a = parseInt(m[1]);
    const b = parseInt(m[2]);
    if (Math.abs(a) > 20 || Math.abs(b) > 20) return null;
    const lo = Math.min(a, b) - 2;
    const hi = Math.max(a, b) + 2;
    return {
      kind: 'inline-svg',
      alt: `Number line showing ${a} and ${b}`,
      svg: numberLineSVG({
        min: lo,
        max: hi,
        marks: [
          { value: a, label: `${a}`, color: COLORS.point },
          { value: b, label: `${b}`, color: COLORS.edge2 },
        ],
      }),
    };
  },

  // Dot plot from explicit dataset: "\{a, b, c, ...\}"
  (p) => {
    if (p.domain !== '6.SP') return null;
    const m = p.prompt.match(/\\\{([\d,\s]+)\\\}/);
    if (!m) return null;
    const data = m[1].split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (data.length < 3 || data.length > 12) return null;
    if (data.some((d) => d < 0 || d > 30)) return null;
    return { kind: 'inline-svg', alt: `Dot plot of dataset`, svg: dotPlotSVG(data) };
  },

  // Percent: "X% of Y" or "$X\%$ of $Y$"
  (p) => {
    if (p.domain !== '6.RP') return null;
    const m = p.prompt.match(/(\d+)\s*\\?%/);
    if (!m) return null;
    const pct = parseInt(m[1]);
    if (pct < 5 || pct > 95) return null;
    return { kind: 'inline-svg', alt: `${pct} percent grid`, svg: percentGridSVG(pct) };
  },

  // Ratio: "X red marbles and Y blue marbles" or "ratio $X : Y$"
  (p) => {
    if (p.domain !== '6.RP') return null;
    let m = p.prompt.match(/\$?(\d+)\s*:\s*(\d+)\$?/);
    if (!m) m = p.prompt.match(/(\d+)\s+\w+\s+(?:and|to)\s+(\d+)\s+\w+/);
    if (!m) return null;
    const a = parseInt(m[1]);
    const b = parseInt(m[2]);
    if (!isFinite(a) || !isFinite(b) || a <= 0 || b <= 0 || a > 50 || b > 50) return null;
    return {
      kind: 'inline-svg',
      alt: `Tape diagram for ratio ${a} : ${b}`,
      svg: tapeDiagramSVG([
        { value: a, label: `${a}` },
        { value: b, label: `${b}` },
      ]),
    };
  },

  // 6.SP datasets in plain "X, Y, Z, ..." form for mean/median/mode/range
  (p) => {
    if (p.domain !== '6.SP') return null;
    if (!/(mean|median|mode|range)/i.test(p.prompt)) return null;
    // Try several common forms
    let m: RegExpMatchArray | null = null;
    m = p.prompt.match(/(?:set:|of:?|of)\s*\$?([\d,\s]+)\$?\s*[.?]/i);
    if (!m) m = p.prompt.match(/\$([\d,\s]+)\$/);
    if (!m) return null;
    const data = m[1].split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (data.length < 3 || data.length > 12) return null;
    if (data.some((d) => d < 0 || d > 50)) return null;
    return { kind: 'inline-svg', alt: `Dot plot for ${p.id}`, svg: dotPlotSVG(data) };
  },

  // Trapezoid: "parallel sides $X$ and $Y$, height $Z$"
  (p) => {
    if (p.domain !== '6.G') return null;
    if (!/trapezoid/i.test(p.prompt)) return null;
    const m = p.prompt.match(/parallel sides\s*\$?(\d+)\$?\s*and\s*\$?(\d+)\$?[^\d]*?height\s*\$?(\d+)\$?/i);
    if (!m) return null;
    const a = parseInt(m[1]);
    const b = parseInt(m[2]);
    const h = parseInt(m[3]);
    // Build a simple trapezoid SVG inline
    const margin = 30;
    const scale = Math.min(28, 200 / Math.max(a, b, h));
    const top = a * scale;
    const bot = b * scale;
    const H = h * scale;
    const cw = bot + margin * 2;
    const ch = H + margin * 2;
    const offset = (bot - top) / 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cw} ${ch}" role="img"><polygon points="${margin + offset},${margin} ${margin + offset + top},${margin} ${margin + bot},${margin + H} ${margin},${margin + H}" fill="${COLORS.fill3}" stroke="${COLORS.edge3}" stroke-width="3"/><line x1="${margin + bot / 2}" y1="${margin}" x2="${margin + bot / 2}" y2="${margin + H}" stroke="${COLORS.edge3}" stroke-width="2" stroke-dasharray="5 4"/><g font-family="Nunito" font-size="14" font-weight="700" fill="${COLORS.ink}" text-anchor="middle"><text x="${margin + bot / 2}" y="${margin - 8}">${a}</text><text x="${margin + bot / 2}" y="${margin + H + 20}">${b}</text><text x="${margin + bot / 2 + top / 2 + 14}" y="${margin + H / 2 + 5}">${h}</text></g></svg>`;
    return { kind: 'inline-svg', alt: `Trapezoid with parallel sides ${a} and ${b}, height ${h}`, svg };
  },
];

function tryAttachDiagram(p: Problem): Diagram | null {
  for (const h of handlers) {
    const d = h(p);
    if (d) return d;
  }
  return null;
}

async function main() {
  const files = await fg('content/problems/{6.RP,6.NS,6.EE,6.G,6.SP}/*.json', { cwd: ROOT, absolute: true });
  let added = 0;
  const byHandler = new Map<string, number>();
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(raw) as Problem;
    if (data.diagram) continue;
    const d = tryAttachDiagram(data);
    if (!d) continue;
    data.diagram = d;
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    added++;
    const kind = d.alt.split(' ')[0];
    byHandler.set(kind, (byHandler.get(kind) ?? 0) + 1);
  }
  console.log(`✓ Added ${added} diagrams.`);
  for (const [k, v] of [...byHandler.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
