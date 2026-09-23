import type { Figure } from '../index.js';

// The 6th-grade geometry problems that had no picture. About a third of this
// course was drawn by hand when it shipped; these are the rest — the box, the
// net, the L-shaped patio, the rectangle with its corners on a grid.

const SPECS: Record<string, Figure> = {
  // ── U2 · area and the coordinate plane ──
  '6.G.005': { kind: 'solid', variant: 'cube', labels: { edge: '½ ft', v: 'V = ?' } },
  '6.G.014': { kind: 'grid', points: [{ x: 2, y: 1, label: '(2, 1)' }, { x: 2, y: 7, label: '(2, 7)' }], segments: [{ from: 0, to: 1, label: '?' }], range: { x: [0, 8], y: [0, 8] } },
  '6.G.019': { kind: 'grid', points: [{ x: 1, y: 2, label: '(1, 2)' }, { x: 1, y: 5, label: '(1, 5)' }, { x: 4, y: 5 }, { x: 4, y: 2 }], polygon: true, range: { x: [0, 6], y: [0, 7] } },

  // ── U3 · volume of a box ──
  '6.G.023': { kind: 'solid', variant: 'prism', dims: { l: 5, w: 4, h: 6 }, labels: { l: '5', w: '4', h: '?', v: 'V = 120' } },
  '6.G.024': { kind: 'solid', variant: 'prism', dims: { l: 4, w: 3, h: 2 }, labels: { l: '4 cm', w: '3 cm', h: '2 cm', v: 'V = ?' } },
  '6.G.025': { kind: 'solid', variant: 'prism', dims: { l: 2, w: 0.75, h: 0.5 }, labels: { l: '2', w: '¾', h: '½', v: 'V = ?' } },
  '6.G.026': { kind: 'solid', variant: 'prism', dims: { l: 6, w: 3, h: 4 }, labels: { l: '?', w: '3', h: '4', v: 'V = 72' } },
  '6.G.027': { kind: 'solid', variant: 'prism', dims: { l: 40, w: 20, h: 30 }, labels: { l: '40 cm', w: '20 cm', h: '30 cm', v: 'V = ?' } },
  '6.G.028': { kind: 'solid', variant: 'cube', labels: { edge: '?', v: 'the cube holds 125' } },
  '6.G.029': { kind: 'solid', variant: 'prism', dims: { l: 5, w: 3, h: 2 }, labels: { l: '5 ft', w: '3 ft', h: '2 ft', v: 'V = ?' } },
  '6.G.030': { kind: 'solid', variant: 'cubes', dims: { l: 3, h: 2, w: 4 }, labels: { v: 'each cube is ⅓ in on a side' }, caption: 'count the cubes, then size them' },

  // ── U4 · nets and surface area ──
  '6.G.034': { kind: 'net', variant: 'prism', labels: { title: 'a box, unfolded flat', sa: 'how many faces?' }, caption: 'every face of the box is here' },
  '6.G.035': { kind: 'net', variant: 'cube', labels: { title: 'a cube, unfolded', count: '? squares' } },
  '6.G.036': { kind: 'net', variant: 'prism', labels: { l: '6 cm', w: '4 cm', h: '3 cm', sa: 'SA = ?' } },
  '6.G.037': { kind: 'net', variant: 'cube', labels: { title: 'the cube, unfolded', count: '6 × (3 × 3)' }, caption: 'paper = the area of all six faces' },
  '6.G.038': { kind: 'solid', variant: 'cube', labels: { edge: '?', sa: 'all six faces come to 24' } },
  '6.G.039': { kind: 'net', variant: 'prism', labels: { l: '10', w: '5', h: '2', sa: 'SA = ?' } },
  '6.G.040': { kind: 'net', variant: 'cube', labels: { title: 'the cube, unfolded', count: 'each face 9 cm²' }, caption: 'total surface area = ?' },

  // ── U5 · composite figures ──
  '6.G.043': { kind: 'composite', variant: 'cut-out', dims: { w: 10, h: 8, cw: 2, ch: 3 }, labels: { w: '10', h: '8', cw: '2', ch: '3', total: 'area left = ?' } },
  '6.G.044': { kind: 'composite', variant: 'house', dims: { w: 8, h: 5, rh: 4 }, labels: { w: '8', h: '5', rh: '4', total: 'total area = ?' } },
  '6.G.045': { kind: 'composite', variant: 'side-by-side', dims: { w1: 20, h1: 15, w2: 5, h2: 5 }, labels: { w1: '20', h1: '15', w2: '5', h2: '5', total: 'combined area = ?' } },
  '6.G.046': { kind: 'composite', variant: 'corner-cut', dims: { w: 10, h: 6, cw: 3, ch: 2 }, labels: { w: '10', h: '6', cw: '3', ch: '2', total: 'area = ?' } },
  '6.G.047': { kind: 'composite', variant: 'corner-cut', dims: { w: 6, h: 4, cw: 2, ch: 2 }, perimeter: true, labels: { w: '6', h: '4', cw: '2', ch: '2', total: 'all the way round = ?' } },
  '6.G.050': { kind: 'composite', variant: 'inside', dims: { w: 30, h: 20, cw: 10, ch: 5 }, labels: { w: '30 ft', h: '20 ft', cw: '10 ft', ch: '5 ft', total: 'yard outside the pool = ?' } },

  // ── U6 · mixed measurement ──
  '6.G.051': { kind: 'shape', variant: 'rectangle', labels: { w: '12 ft', h: '10 ft', area: 'area = ?' }, dims: { w: 12, h: 10 } },
  '6.G.052': { kind: 'solid', variant: 'prism', dims: { l: 5, w: 4, h: 3 }, labels: { l: '5 ft', w: '4 ft', h: '3 ft', v: 'V = ?' } },
  '6.G.053': { kind: 'grid', points: [{ x: 2, y: 1, label: '(2, 1)' }, { x: 6, y: 1 }, { x: 6, y: 5, label: '(6, 5)' }, { x: 2, y: 5 }], polygon: true, range: { x: [0, 8], y: [0, 7] } },
  '6.G.054': { kind: 'shape', variant: 'rectangle', labels: { w: '15 ft', h: '10 ft', area: 'fence all the way round = ?' }, dims: { w: 15, h: 10 } },
  '6.G.056': { kind: 'shape', variant: 'triangle', labels: { b: '12 ft', h: '5 ft', area: 'area = ?' }, dims: { b: 12, h: 5 } },
  '6.G.057': { kind: 'solid', variant: 'cubes', dims: { l: 4, h: 3, w: 5 }, labels: { v: 'a 4 × 3 × 5 cm box' }, caption: 'how many 1 cm cubes fit?' },
  '6.G.058': { kind: 'polygon', n: 6, caption: 'each side 4 cm — distance round = ?' },
  '6.G.059': { kind: 'composite', variant: 'corner-cut', dims: { w: 8, h: 6, cw: 3, ch: 2 }, labels: { w: '8', h: '6', cw: '3', ch: '2', total: 'area = ?' } },
  '6.G.060': { kind: 'solid', variant: 'prism', dims: { l: 1, w: 0.5, h: 2 }, labels: { l: '1 m', w: '½ m', h: '2 m', v: 'V = ?' } },

  // ── U7 · area of composite figures ──
  '6.G.061': { kind: 'composite', variant: 'side-by-side', dims: { w1: 4, h1: 3, w2: 4, h2: 2 }, labels: { w1: '4', h1: '3', w2: '4', h2: '2', total: 'total area = ?' } },
  '6.G.062': { kind: 'composite', variant: 'cut-out', dims: { w: 6, h: 5, cw: 2, ch: 2 }, labels: { w: '6', h: '5', cw: '2', ch: '2', total: 'area left = ?' } },
  '6.G.063': { kind: 'composite', variant: 'side-by-side', dims: { w1: 5, h1: 3, w2: 4, h2: 2 }, labels: { w1: '5', h1: '3', w2: '4', h2: '2', total: 'total area = ?' } },
  '6.G.064': { kind: 'composite', variant: 'cut-out', dims: { w: 10, h: 10, cw: 4, ch: 3 }, labels: { w: '10', h: '10', cw: '4', ch: '3', total: 'area left = ?' } },
  '6.G.065': { kind: 'composite', variant: 'tee', dims: { w1: 6, h1: 2, w2: 4, h2: 3 }, labels: { w1: '6', h1: '2', w2: '4', h2: '3', total: 'total area = ?' } },
  '6.G.067': { kind: 'shape', variant: 'rectangle', labels: { w: '11 in', h: '8.5 in', area: 'area = ?' }, dims: { w: 11, h: 8.5 } },
  '6.G.068': { kind: 'composite', variant: 'corner-cut', dims: { w: 12, h: 8, cw: 4, ch: 4 }, labels: { w: '12', h: '8', cw: '4', ch: '4', total: 'area left = ?' } },
  '6.G.069': { kind: 'composite', variant: 'stacked', dims: { w1: 10, h1: 3, w2: 7, h2: 4 }, labels: { w1: '10', h1: '3', w2: '7', h2: '4', total: 'total area = ?' } },
  '6.G.070': { kind: 'composite', variant: 'inside', dims: { w: 20, h: 15, cw: 5, ch: 5 }, labels: { w: '20', h: '15', cw: '5', ch: '5', total: 'garden outside the pond = ?' } },

  // ── U8 · volume with fractional edges ──
  '6.G.071': { kind: 'solid', variant: 'prism', dims: { l: 5, w: 3, h: 1 }, labels: { l: '5', w: '3', h: '1', v: 'V = ?' } },
  '6.G.072': { kind: 'solid', variant: 'prism', dims: { l: 5, w: 4, h: 2 }, labels: { l: '5', w: '4', h: '2', v: 'V = ?' } },
  '6.G.073': { kind: 'solid', variant: 'cube', labels: { edge: '½', v: 'V = ?' } },
  '6.G.074': { kind: 'solid', variant: 'prism', dims: { l: 4, w: 0.5, h: 0.5 }, labels: { l: '4', w: '½', h: '½', v: 'V = ?' } },
  '6.G.075': { kind: 'solid', variant: 'prism', dims: { l: 6, w: 0.33, h: 3 }, labels: { l: '6', w: '⅓', h: '3', v: 'V = ?' } },
  '6.G.076': { kind: 'solid', variant: 'prism', dims: { l: 5, w: 0.67, h: 3 }, labels: { l: '5', w: '⅔', h: '3', v: 'V = ?' } },
  '6.G.078': { kind: 'solid', variant: 'prism', dims: { l: 4, w: 3, h: 0.25 }, labels: { l: '4', w: '3', h: '¼', v: 'V = ?' } },
  '6.G.079': { kind: 'solid', variant: 'cubes', dims: { l: 4, h: 4, w: 4 }, labels: { v: 'a 1-inch box, filled with ¼-inch cubes' }, caption: 'four along every edge — how many in all?' },
  '6.G.080': { kind: 'solid', variant: 'prism', dims: { l: 6, w: 0.5, h: 4 }, labels: { l: '6', w: '½', h: '4', v: 'V = ?' } },

  // ── U9 · figures on the coordinate plane ──
  '6.G.081': { kind: 'grid', points: [{ x: 1, y: 2, label: '(1, 2)' }, { x: 1, y: 5, label: '(1, 5)' }], segments: [{ from: 0, to: 1, label: '?' }], range: { x: [0, 7], y: [0, 7] } },
  '6.G.082': { kind: 'grid', points: [{ x: -3, y: 4, label: '(−3, 4)' }, { x: 2, y: 4, label: '(2, 4)' }], segments: [{ from: 0, to: 1, label: '?' }], range: { x: [-5, 4], y: [0, 6] } },
  '6.G.085': { kind: 'grid', points: [{ x: 0, y: 0, label: '(0, 0)' }, { x: 5, y: 0, label: '(5, 0)' }, { x: 5, y: 5, label: '(5, 5)' }, { x: 0, y: 5, label: '(0, 5)' }], polygon: true, segments: [{ from: 0, to: 1, label: '?' }], range: { x: [-1, 7], y: [-1, 7] } },
  '6.G.086': { kind: 'grid', points: [{ x: 0, y: 0 }, { x: 3, y: 0, label: '(3, 0)' }, { x: 0, y: 4, label: '(0, 4)' }], polygon: true, range: { x: [-1, 6], y: [-1, 6] } },
  '6.G.087': { kind: 'grid', points: [{ x: 1, y: 1, label: '(1, 1)' }, { x: 5, y: 1, label: '(5, 1)' }, { x: 5, y: 4, label: '(5, 4)' }, { x: 1, y: 4, label: '?', color: '#F43F5E' }], polygon: true, range: { x: [0, 7], y: [0, 6] } },
  '6.G.089': { kind: 'grid', points: [{ x: 0, y: 0, label: '(0, 0)' }, { x: 8, y: 0, label: '(8, 0)' }, { x: 4, y: 3, label: '(4, 3)' }], polygon: true, range: { x: [-1, 9], y: [-1, 5] } },
  '6.G.090': { kind: 'grid', points: [{ x: 0, y: 0 }, { x: 6, y: 0, label: '(6, 0)' }, { x: 6, y: 4, label: '(6, 4)' }, { x: 0, y: 4, label: '(0, 4)' }], polygon: true, range: { x: [-1, 8], y: [-1, 6] } },

  // ── U10 · surface area ──
  '6.G.092': { kind: 'net', variant: 'prism', labels: { title: 'the box, unfolded flat', sa: 'how many faces?' } },
  '6.G.093': { kind: 'net', variant: 'prism', labels: { l: '2', w: '3', h: '4', sa: 'SA = ?' } },
  '6.G.094': { kind: 'net', variant: 'cube', labels: { title: 'the cube, unfolded', count: 'six faces, 96 in all' }, caption: 'one face = ?' },
  '6.G.095': { kind: 'net', variant: 'cube', labels: { title: 'the cube, unfolded', count: 'each face 25' }, caption: 'total surface area = ?' },
  '6.G.097': { kind: 'net', variant: 'prism', labels: { l: '5', w: '3', h: '2', sa: 'SA = ?' } },
  '6.G.098': { kind: 'solid', variant: 'cube', labels: { edge: '?', v: 'the cube holds 27' }, caption: 'find the edge, then the surface area' },
  '6.G.099': { kind: 'net', variant: 'prism', labels: { l: '10 in', w: '8 in', h: '5 in', sa: 'SA = ?' } },
  '6.G.100': { kind: 'solid', variant: 'cube', labels: { edge: '?', sa: 'six faces come to 216' }, caption: 'find the edge, then the volume' },
};

export default SPECS;
