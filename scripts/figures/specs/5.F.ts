import type { Figure } from '../index.js';

// The 5th-grade MAP measurement and geometry problems. A conversion is two
// boxes and the factor between them; a line plot is the marks over the scale;
// a pattern is the hops along a line; a coordinate question is the grid.

const SPECS: Record<string, Figure> = {
  // ── U5 · measurement and volume ──
  '5.F.041': { kind: 'convert', from: { n: '3', unit: 'metres' }, to: { n: '?', unit: 'centimetres' }, factor: '100', dir: '×', caption: 'a metre is 100 centimetres' },
  '5.F.042': { kind: 'convert', from: { n: '48', unit: 'inches' }, to: { n: '?', unit: 'feet' }, factor: '12', dir: '÷', caption: 'a foot is 12 inches' },
  '5.F.043': { kind: 'convert', from: { n: '2.5', unit: 'kilograms' }, to: { n: '?', unit: 'grams' }, factor: '1000', dir: '×', caption: 'a kilogram is 1000 grams' },
  '5.F.044': { kind: 'convert', from: { n: '3 h 15 min', unit: 'the film' }, to: { n: '?', unit: 'minutes' }, factor: '60', dir: '×', caption: 'turn the hours into minutes, then add the 15' },
  '5.F.046': { kind: 'solid', variant: 'cube', labels: { edge: '5 in', v: 'V = ?' } },
  '5.F.047': { kind: 'convert', from: { n: '3', unit: 'gallons' }, to: { n: '?', unit: 'quarts' }, factor: '4', dir: '×', caption: 'a gallon is 4 quarts' },
  '5.F.049': { kind: 'solid', variant: 'stack', dims: { l1: 5, w1: 4, h1: 3, l2: 5, w2: 4, h2: 2 }, labels: { l1: '5', h1: '3', w1: '4', l2: '5', h2: '2' }, caption: 'two boxes glued: add the volumes' },
  '5.F.050': { kind: 'convert', variant: 'pick', thing: 'the mass of one apple', options: ['grams', 'kilograms', 'tonnes'] },

  // ── U6 · the coordinate plane and patterns ──
  '5.F.051': { kind: 'grid', points: [{ x: 0, y: 0, label: 'start' }, { x: 3, y: 4, label: '?' }], arrows: [{ from: 0, to: 1, label: 'right 3, up 4' }], range: { x: [-1, 7], y: [-1, 7] } },
  '5.F.053': { kind: 'grid', points: [{ x: 0, y: 0, label: 'O' }, { x: 7, y: 0 }, { x: 7, y: 2, label: '(7, 2)' }], arrows: [{ from: 0, to: 1, label: 'across 7' }, { from: 1, to: 2, label: 'then up 2' }], range: { x: [-1, 9], y: [-1, 5] } },
  '5.F.054': { kind: 'grid', points: [{ x: 1, y: 2, label: '(1, 2)' }, { x: 6, y: 2, label: '(6, 2)' }], segments: [{ from: 0, to: 1, label: '?' }], range: { x: [0, 8], y: [0, 5] } },
  '5.F.055': { kind: 'pattern', start: 0, step: 3, n: 8, ask: 'keep going — what is the 8th term?' },
  '5.F.056': { kind: 'pattern', start: 0, step: 2, n: 5, second: { start: 0, step: 6 }, ask: 'each B is how many times the A beside it?' },
  '5.F.059': { kind: 'grid', points: [{ x: 4, y: 1, label: 'P (4, 1)' }, { x: 6, y: 4, label: '?' }], arrows: [{ from: 0, to: 1, label: 'right 2, up 3' }], range: { x: [0, 8], y: [0, 7] } },
  '5.F.060': { kind: 'grid', points: [{ x: 5, y: 0, label: '(5, ?)' }, { x: -3, y: 0, label: '(−3, ?)' }], range: { x: [-5, 7], y: [-3, 3] } },

  // ── U15 · measurement, volume and line plots ──
  '5.F.141': { kind: 'solid', variant: 'prism', dims: { l: 6, w: 3, h: 2 }, labels: { l: '6 in', w: '3 in', h: '2 in', v: 'V = ?' } },
  '5.F.142': { kind: 'convert', from: { n: '2.5', unit: 'litres' }, to: { n: '?', unit: 'millilitres' }, factor: '1000', dir: '×', caption: 'a litre is 1000 millilitres' },
  '5.F.143': { kind: 'convert', from: { n: '7', unit: 'feet' }, to: { n: '?', unit: 'inches' }, factor: '12', dir: '×', caption: 'a foot is 12 inches' },
  '5.F.144': { kind: 'lineplot', ticks: ['¼', '½', '¾', '1'], counts: [3, 4, 2, 1], unit: 'cups of water left', caption: 'one mark for each bottle — how many bottles?' },
  '5.F.145': { kind: 'solid', variant: 'prism', dims: { l: 6, w: 5, h: 4 }, labels: { l: '6 in', w: '5 in', h: '?', v: 'the box holds 120' } },
  '5.F.146': { kind: 'lineplot', ticks: ['¼', '½', '¾'], counts: [2, 3, 1], unit: 'feet of ribbon', caption: 'add every piece — how much ribbon in all?' },
  '5.F.147': { kind: 'convert', from: { n: '250 g', unit: '× 6 loaves' }, to: { n: '?', unit: 'kilograms' }, factor: '1000', dir: '÷', caption: 'total the grams first, then step up to kilograms' },
  '5.F.148': { kind: 'solid', variant: 'stack', dims: { l1: 6, w1: 2, h1: 3, l2: 4, w2: 2, h2: 2 }, labels: { l1: '6 cm', h1: '3 cm', w1: '2 cm', l2: '4 cm', h2: '2 cm' }, caption: 'one tower on another: add the volumes' },
  '5.F.149': { kind: 'solid', variant: 'prism', dims: { l: 20, w: 10, h: 12 }, labels: { l: '20 cm', w: '10 cm', h: '12 cm', v: 'filled ¾ of the way — how much water?' } },
  '5.F.150': { kind: 'lineplot', ticks: ['⅛', '¼', '½'], counts: [2, 3, 1], unit: 'cups of juice', caption: 'pour it all together, then share it six ways' },

  // ── U16 · shapes and the coordinate plane ──
  '5.F.151': { kind: 'shapes', items: [{ shape: 'right', name: 'this triangle', mark: 'ask', angles: ['90°', '45°', '45°'] }], caption: 'which name fits it best?' },
  '5.F.152': { kind: 'grid', points: [{ x: 0, y: 0, label: 'O' }, { x: 6, y: 0, label: '?' }], arrows: [{ from: 0, to: 1, label: '6 right, 0 up' }], range: { x: [-1, 8], y: [-2, 4] } },
  '5.F.153': { kind: 'shapes', items: [{ shape: 'square', name: 'square', mark: 'ask' }, { shape: 'rectangle', name: 'rectangle' }, { shape: 'trapezoid', name: 'quadrilateral' }], caption: 'a square is all three at once' },
  '5.F.154': { kind: 'grid', points: [{ x: 0, y: 0, label: 'start' }, { x: 3, y: 12, label: '(3, ?)' }], segments: [{ from: 0, to: 1 }], range: { x: [0, 5], y: [0, 16] } },
  '5.F.155': { kind: 'shapes', items: [{ shape: 'parallelogram', name: 'parallelogram' }, { shape: 'rhombus', name: 'rhombus', mark: 'ask' }, { shape: 'trapezoid', name: 'trapezoid' }], caption: 'which one is always one of the others?' },
  '5.F.156': { kind: 'grid', points: [{ x: 2, y: 3, label: '(2, 3)' }, { x: 2, y: 9, label: '(2, 9)' }], segments: [{ from: 0, to: 1, label: '? m' }], range: { x: [0, 6], y: [0, 11] } },
  '5.F.157': { kind: 'shapes', items: [{ shape: 'trapezoid', name: '?', mark: 'ask' }], caption: 'exactly one pair of parallel sides' },
  '5.F.158': { kind: 'grid', points: [{ x: 1, y: 2, label: '(1, 2)' }, { x: 7, y: 2, label: '(7, 2)' }, { x: 7, y: 6, label: '(7, 6)' }, { x: 1, y: 6, label: '?', color: '#F43F5E' }], polygon: true, range: { x: [0, 9], y: [0, 8] } },
  '5.F.159': { kind: 'grid', points: [{ x: 2, y: 1, label: '(2, 1)' }, { x: 8, y: 1, label: '(8, 1)' }, { x: 8, y: 5, label: '(8, 5)' }, { x: 2, y: 5, label: '(2, 5)' }], polygon: true, segments: [{ from: 0, to: 1, label: '?' }], range: { x: [0, 10], y: [0, 7] } },
  '5.F.160': { kind: 'shapes', items: [{ shape: 'square', name: 'square', mark: 'ask' }, { shape: 'rhombus', name: 'rhombus' }, { shape: 'rectangle', name: 'rectangle' }], caption: 'four equal sides makes a square a rhombus too' },
};

export default SPECS;
