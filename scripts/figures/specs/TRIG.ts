import type { AngleFigure } from '../angleFigures.js';

// One figure per Trigonometry problem, keyed by problem id. The figure shows
// the situation the prompt describes — the angle, the triangle, the wave —
// with the thing being asked for marked "?", and never gives the answer away.

const PI = Math.PI;

const SPECS: Record<string, AngleFigure> = {
  // ── U1 · angles and angle measure ──
  'TRIG.001': { kind: 'standard', deg: 400, label: '400°' },
  'TRIG.002': { kind: 'standard', deg: 200 },
  'TRIG.003': { kind: 'compass', deg: 42.5, label: "42° 30'" },
  'TRIG.004': { kind: 'standard', deg: -50, label: '−50°' },
  'TRIG.005': { kind: 'compass', deg: 18.25, label: '18.25°' },
  'TRIG.006': { kind: 'standard', deg: 50, label: 'θ', parts: true },
  'TRIG.007': { kind: 'standard', deg: 1260, label: '3.5 turns' },
  'TRIG.008': { kind: 'clock', from: 12, to: 4 },
  'TRIG.009': { kind: 'standard', deg: 1000, label: '1000°' },
  'TRIG.010': { kind: 'standard', deg: -400, label: '−400°' },

  // ── U2 · radians and arc length ──
  'TRIG.011': { kind: 'sector', deg: 90, r: '1', angle: '90°', arc: '? rad' },
  'TRIG.012': { kind: 'sector', deg: 60, r: '1', angle: 'π/3 rad' },
  'TRIG.013': { kind: 'sector', deg: 114.6, r: '5 ft', angle: '2 rad', arc: '?' },
  'TRIG.014': { kind: 'sector', deg: 45, r: '1', angle: '45°', arc: '? rad' },
  'TRIG.015': { kind: 'sector', deg: 225, r: '1', angle: '225°' },
  'TRIG.016': { kind: 'sector', deg: 30, r: '12 in', angle: '30°', arc: '?' },
  'TRIG.017': { kind: 'sector', deg: 60, r: '6 in', angle: 'π/3', shade: true, area: '?' },
  'TRIG.018': { kind: 'sector', deg: 57.3, r: 'r', angle: '1 rad', arc: 'arc = r' },
  'TRIG.019': { kind: 'sector', deg: 120, r: '25 ft', angle: '120°', shade: true, area: '?' },
  'TRIG.020': { kind: 'sector', deg: 143.2, r: '6 cm', angle: '?', arc: '15 cm' },

  // ── U3 · right-triangle trigonometry ──
  'TRIG.021': { kind: 'right', opp: '3', adj: '4', hyp: '5', angle: 'θ' },
  'TRIG.022': { kind: 'right', opp: '3', adj: '4', hyp: '5', angle: 'θ' },
  'TRIG.023': { kind: 'right', opp: 'a', adj: 'b', hyp: 'c', angle: 'A', names: { A: 'A', B: 'B', C: 'C' } },
  'TRIG.024': { kind: 'right', hyp: '20 ft', opp: '?', angle: '30°', shape: { opp: 1, adj: 1.73 }, ground: true },
  'TRIG.025': { kind: 'right', opp: '2 ft', adj: '24 ft', angle: '?', shape: { opp: 2, adj: 24 }, ground: true },
  'TRIG.026': { kind: 'right', hyp: '18 ft', opp: '?', angle: '72°', shape: { opp: 3.08, adj: 1 }, ground: true },
  'TRIG.027': { kind: 'right', adj: '50 ft', opp: '?', angle: '38°', shape: { opp: 0.78, adj: 1 }, ground: true },
  'TRIG.028': { kind: 'right', opp: '120 ft', adj: 'd', depression: '25°', shape: { opp: 120, adj: 257 }, ground: true },
  'TRIG.029': { kind: 'right', hyp: '80 m', opp: '65 m', angle: '?', shape: { opp: 65, adj: 46.6 }, ground: true },
  'TRIG.030': { kind: 'right', adj: '200 ft', opp: '?', angle: '55°', shape: { opp: 1.43, adj: 1 }, ground: true, eye: '5 ft' },

  // ── U4 · special right triangles ──
  'TRIG.031': { kind: 'right', opp: '1', adj: '√3', hyp: '2', angle: '30°', shape: { opp: 1, adj: 1.732 } },
  'TRIG.032': { kind: 'right', opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 1, adj: 1 } },
  'TRIG.033': { kind: 'right', opp: '1', adj: '√3', hyp: '2', angle: '30°', shape: { opp: 1, adj: 1.732 } },
  'TRIG.034': { kind: 'right', opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 1, adj: 1 } },
  'TRIG.035': { kind: 'right', opp: '7 in', adj: '7 in', hyp: '?', angle: '45°', shape: { opp: 1, adj: 1 } },
  'TRIG.036': { kind: 'right', hyp: '12', opp: '?', angle: '30°', shape: { opp: 1, adj: 1.732 } },
  'TRIG.037': { kind: 'right', opp: '5 cm', adj: '?', angle: '60°', angleAt: 'B', shape: { opp: 1, adj: 1.732 } },
  'TRIG.038': { kind: 'right', opp: '√3', adj: '1', hyp: '2', angle: '60°', shape: { opp: 1.732, adj: 1 } },
  'TRIG.039': { kind: 'right', opp: '1', adj: '√3', hyp: '2', angle: '30°', shape: { opp: 1, adj: 1.732 }, names: { B: '60°' } },
  'TRIG.040': { kind: 'right', hyp: '16 ft', adj: '?', angle: '30°', shape: { opp: 1, adj: 1.732 }, ground: true },

  // ── U5 · the unit circle ──
  'TRIG.041': { kind: 'unit', angles: [{ deg: 40, label: 'θ', point: '(?, ?)' }], legs: { r: '1' } },
  'TRIG.042': { kind: 'unit', angles: [{ deg: 0, label: '0°', point: '(1, 0)' }] },
  'TRIG.043': { kind: 'unit', angles: [{ deg: 90, label: '90°', point: '(0, ?)' }] },
  'TRIG.044': { kind: 'unit', angles: [{ deg: 180, label: '180°', point: '(?, ?)' }] },
  'TRIG.045': { kind: 'unit', angles: [{ deg: 60, label: '60°', point: '(½, ?)' }], legs: { x: '½', y: '?' } },
  'TRIG.046': { kind: 'unit', angles: [{ deg: 135, label: '?', point: '(−√2/2, √2/2)' }] },
  'TRIG.047': { kind: 'unit', angles: [{ deg: 300, label: '300°' }] },
  'TRIG.048': { kind: 'unit', angles: [{ deg: 270, label: '270°', point: '(0, ?)' }] },
  'TRIG.049': { kind: 'unit', angles: [{ deg: 150, label: '150°', point: '(?, y)' }], legs: { x: 'x = ?', r: '30 m' } },
  'TRIG.050': { kind: 'unit', angles: [{ deg: 120, label: '120°' }], legs: { x: 'cos 120°', y: 'sin 120°', r: '1' } },

  // ── U6 · reference angles and signs ──
  'TRIG.051': { kind: 'standard', deg: 150, ref: true },
  'TRIG.052': { kind: 'standard', deg: 225, ref: true },
  'TRIG.053': { kind: 'quadrants' },
  'TRIG.054': { kind: 'standard', deg: 300, ref: true },
  'TRIG.055': { kind: 'unit', angles: [{ deg: 120, label: '120°' }], legs: { x: 'cos 120° = ?', y: 'sin 120°' } },
  'TRIG.056': { kind: 'unit', angles: [{ deg: 240, label: '240°' }], legs: { x: 'cos 240°', y: 'sin 240° = ?' } },
  'TRIG.057': { kind: 'quadrants' },
  'TRIG.058': { kind: 'standard', deg: -120, label: '−120°', ref: true },
  'TRIG.059': { kind: 'unit', angles: [{ deg: 315, label: '315°' }], legs: { x: 'cos 315°', y: 'sin 315°' } },
  'TRIG.060': { kind: 'unit', angles: [{ deg: 315, label: '315°' }], legs: { x: 'cos 315° = ?', y: 'sin 315°' } },

  // ── U7 · graphing sine and cosine ──
  'TRIG.061': { kind: 'wave', curves: [{ fn: 'sin', a: 4, label: 'y = 4 sin x' }], unit: 'deg', xMax: 360, amplitude: '?', midline: 'y = 0' },
  'TRIG.062': { kind: 'wave', curves: [{ fn: 'sin', label: 'y = sin x' }], unit: 'deg', xMax: 720, period: 'period = ?' },
  'TRIG.063': { kind: 'wave', curves: [{ fn: 'sin', k: 3, label: 'y = sin x + 3' }], unit: 'deg', xMax: 360, midline: 'midline = ?' },
  'TRIG.064': { kind: 'wave', curves: [{ fn: 'cos', a: 2, label: 'y = 2 cos x' }], unit: 'deg', xMax: 360, max: 'max = ?' },
  'TRIG.065': { kind: 'wave', curves: [{ fn: 'sin', a: -5, b: 3, label: 'y = −5 sin 3x' }], unit: 'deg', xMax: 360, amplitude: '?' },
  'TRIG.066': { kind: 'wave', curves: [{ fn: 'sin', b: 2, label: 'y = sin 2x' }], unit: 'rad', xMax: 2 * PI, period: 'period = ?' },
  'TRIG.067': { kind: 'wave', curves: [{ fn: 'cos', b: 4, label: 'y = cos 4x' }], unit: 'deg', xMax: 360, period: 'period = ?' },
  'TRIG.068': { kind: 'wave', curves: [{ fn: 'sin', a: 3, k: 5, b: PI / 6 }], unit: 't', xMax: 24, max: 'high tide 8 ft', min: 'low tide 2 ft', midline: 'midline', xLabel: 't (hours)' },
  'TRIG.069': { kind: 'wave', curves: [{ fn: 'sin', a: 8, k: 4, label: 'y = a sin(bx) + k' }], unit: 'deg', xMax: 360, max: 'max = 12', min: 'min = −4', midline: 'k = ?' },
  'TRIG.070': { kind: 'wave', curves: [{ fn: 'sin', a: 3, b: 0.5, label: 'y = 3 sin(bx)' }], unit: 'rad', xMax: 4 * PI, period: 'period = 4π' },

  // ── U8 · transformations and models ──
  'TRIG.071': { kind: 'wave', curves: [{ fn: 'sin', a: 3, k: 2, label: 'y = 3 sin x + 2' }], unit: 'rad', xMax: 2 * PI, midline: 'y = 2', max: 'max = ?' },
  'TRIG.072': { kind: 'wave', curves: [{ fn: 'sin', b: 2, label: 'y = sin 2x' }], unit: 'rad', xMax: 2 * PI, period: 'period = ?' },
  'TRIG.073': { kind: 'wave', curves: [{ fn: 'sin', label: 'y = sin x' }, { fn: 'sin', h: PI / 3, label: 'y = sin(x − π/3)' }], unit: 'rad', xMax: 2 * PI },
  'TRIG.074': { kind: 'wave', curves: [{ fn: 'sin', a: 18, k: 20, b: PI / 15, label: 'h(t)' }], unit: 't', xMax: 60, midline: 'centre height = ?', xLabel: 't (s)' },
  'TRIG.075': { kind: 'wave', curves: [{ fn: 'cos', a: 4, k: 1, label: 'y = ?' }], unit: 'rad', xMax: 2 * PI, midline: 'y = 1', amplitude: '4', max: 'max at x = 0' },
  'TRIG.076': { kind: 'wave', curves: [{ fn: 'sin', a: 5, k: 7, b: PI / 6 }], unit: 't', xMax: 24, max: 'high tide 12 ft', min: 'low tide 2 ft', amplitude: '?', xLabel: 't (hours)' },
  'TRIG.077': { kind: 'wave', curves: [{ fn: 'sin', a: 3, k: 12, b: (2 * PI) / 365, h: 80, label: 'L(t)' }], unit: 't', xMax: 365, xStep: 100, midline: '12 h', max: 'longest day = ?', xLabel: 'day of year' },
  'TRIG.078': { kind: 'wave', curves: [{ fn: 'cos', a: 4, k: 7, b: PI / 6, label: 'T(x)' }], unit: 't', xMax: 24, period: 'period = ?', xLabel: 'months' },
  'TRIG.079': { kind: 'ferris', diameter: 'diameter 40 m', clearance: '2 m', centre: 'centre = ?', period: 'one turn every 60 s' },
  'TRIG.080': { kind: 'wave', curves: [{ fn: 'sin', b: 2, label: 'y = sin 2x' }, { fn: 'sin', b: 2, h: PI / 4, label: 'y = sin(2x − π/2)' }], unit: 'rad', xMax: 2 * PI },

  // ── U9 · tangent and the reciprocal functions ──
  'TRIG.081': { kind: 'right', opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 1, adj: 1 } },
  'TRIG.082': { kind: 'unit', angles: [{ deg: 60, label: 'θ' }], legs: { x: 'cos θ = ½', r: '1' } },
  'TRIG.083': { kind: 'wave', curves: [{ fn: 'tan', label: 'y = tan x' }], unit: 'rad', xMin: -PI / 2, xMax: (3 * PI) / 2, asymptotes: true, yMin: -4, yMax: 4, period: 'period = ?' },
  'TRIG.084': { kind: 'unit', angles: [{ deg: -19.5, label: 'θ' }], legs: { y: 'sin θ = −⅓', r: '1' } },
  'TRIG.085': { kind: 'wave', curves: [{ fn: 'tan', label: 'y = tan x' }], unit: 'rad', xMin: -PI / 2, xMax: (3 * PI) / 2, asymptotes: true, yMin: -4, yMax: 4 },
  'TRIG.086': { kind: 'wave', curves: [{ fn: 'sec', label: 'y = sec x' }, { fn: 'cos', label: 'y = cos x', color: '#94A3B8' }], unit: 'rad', xMin: -PI / 2, xMax: (3 * PI) / 2, asymptotes: true, yMin: -4, yMax: 4 },
  'TRIG.087': { kind: 'right', opp: '1', adj: '√3', hyp: '2', angle: '30°', shape: { opp: 1, adj: 1.732 } },
  'TRIG.088': { kind: 'wave', curves: [{ fn: 'tan', label: 'y = tan θ' }], unit: 'deg', xMax: 180, asymptotes: true, yMin: -4, yMax: 4 },
  'TRIG.089': { kind: 'wave', curves: [{ fn: 'tan', b: 3, label: 'y = tan 3θ' }], unit: 'deg', xMax: 180, asymptotes: true, yMin: -4, yMax: 4, period: 'period = ?' },
  'TRIG.090': { kind: 'unit', angles: [{ deg: 240, label: 'θ' }], legs: { x: 'cos θ = −½', y: 'sin θ' } },

  // ── U10 · inverse trig ──
  'TRIG.091': { kind: 'unit', angles: [{ deg: 30, label: 'θ = ?' }], hline: { y: 0.5, label: 'y = ½' }, rangeArc: { from: -90, to: 90, label: 'arcsin answers come from this half' } },
  'TRIG.092': { kind: 'unit', angles: [{ deg: 90, label: 'θ = ?' }], vline: { x: 0, label: 'x = 0' }, rangeArc: { from: 0, to: 180, label: 'arccos answers come from this half' } },
  'TRIG.093': { kind: 'right', opp: '1 ft', adj: '1 ft', angle: '?', shape: { opp: 1, adj: 1 }, ground: true },
  'TRIG.094': { kind: 'unit', angles: [{ deg: -30, label: 'θ = ?' }], hline: { y: -0.5, label: 'y = −½' }, rangeArc: { from: -90, to: 90, label: 'arcsin answers come from this half' } },
  'TRIG.095': { kind: 'unit', angles: [{ deg: 0, label: '0°' }, { deg: 180, label: '180°' }], rangeArc: { from: 0, to: 180, label: 'the angles arccos can return' } },
  'TRIG.096': { kind: 'right', hyp: '20 ft', opp: '3 ft', angle: '?', shape: { opp: 3, adj: 19.8 }, ground: true },
  'TRIG.097': { kind: 'unit', angles: [{ deg: 120, label: 'θ = ?' }], vline: { x: -0.5, label: 'x = −½' }, rangeArc: { from: 0, to: 180, label: 'arccos answers come from this half' } },
  'TRIG.098': { kind: 'unit', angles: [{ deg: 150, label: '150°' }, { deg: 30, label: '30°' }], hline: { y: 0.5, label: 'sin = ½' }, rangeArc: { from: -90, to: 90, label: 'arcsin answers come from this half' } },
  'TRIG.099': { kind: 'right', opp: '3', hyp: '5', adj: '?', angle: 'θ = arcsin ⅗', shape: { opp: 3, adj: 4 } },
  'TRIG.100': { kind: 'right', adj: '15 m', opp: '40 m', angle: '?', shape: { opp: 40, adj: 15 }, ground: true },

  // ── U11 · identities ──
  'TRIG.101': { kind: 'unit', angles: [{ deg: 40, label: 'θ' }], legs: { x: 'cos θ', y: 'sin θ', r: '1' } },
  'TRIG.102': { kind: 'right', opp: 'opp', adj: 'adj', hyp: 'hyp', angle: 'θ' },
  'TRIG.103': { kind: 'right', opp: '3', hyp: '5', adj: '?', angle: 'θ', shape: { opp: 3, adj: 4 } },
  'TRIG.104': { kind: 'right', opp: 'opp', hyp: 'hyp', angle: 'θ' },
  'TRIG.105': { kind: 'unit', angles: [{ deg: 40, label: 'θ' }], legs: { x: 'cos θ', y: 'sin θ', r: '1' } },
  'TRIG.106': { kind: 'right', adj: '1', opp: 'tan θ', hyp: 'sec θ', angle: 'θ', shape: { opp: 0.75, adj: 1 } },
  'TRIG.107': { kind: 'right', opp: 'opp', adj: 'adj', hyp: 'hyp', angle: 'θ' },
  'TRIG.108': { kind: 'right', opp: '4', adj: '3', hyp: '?', angle: 'θ', shape: { opp: 4, adj: 3 } },
  'TRIG.109': { kind: 'right', adj: '1', opp: 'tan θ', hyp: 'sec θ', angle: 'θ', shape: { opp: 0.75, adj: 1 } },
  'TRIG.110': { kind: 'unit', angles: [{ deg: 40, label: 'θ' }], legs: { x: 'cos θ', y: 'sin θ', r: '1' } },

  // ── U12 · double- and sum-angle formulas ──
  'TRIG.111': { kind: 'unit', angles: [{ deg: 25, label: 'θ' }, { deg: 50, label: '2θ' }] },
  'TRIG.112': { kind: 'right', opp: '3', adj: '4', hyp: '5', angle: 'θ' },
  'TRIG.113': { kind: 'unit', angles: [{ deg: 30, label: 'A' }, { deg: 75, label: 'A + B' }] },
  'TRIG.114': { kind: 'unit', angles: [{ deg: 60, label: 'θ' }, { deg: 120, label: '2θ' }], legs: { x: 'cos θ = ½' } },
  'TRIG.115': { kind: 'unit', angles: [{ deg: 45, label: '45°' }, { deg: 75, label: '75°' }] },
  'TRIG.116': { kind: 'unit', angles: [{ deg: 45, label: '45°' }, { deg: 75, label: '75°' }] },
  'TRIG.117': { kind: 'unit', angles: [{ deg: 15, label: '15°' }, { deg: 30, label: '30°' }] },
  'TRIG.118': { kind: 'wave', curves: [{ fn: 'cos', b: 2, label: 'cos 2x' }, { fn: 'sin', label: 'sin x', color: '#94A3B8' }], unit: 'deg', xMax: 360 },
  'TRIG.119': { kind: 'unit', angles: [{ deg: 60, label: '60°' }, { deg: 105, label: '105°' }] },
  'TRIG.120': { kind: 'unit', angles: [{ deg: 157.4, label: 'θ' }], legs: { x: 'cos θ = ?', y: 'sin θ = 5/13', r: '1' } },

  // ── U13 · trig equations ──
  'TRIG.121': { kind: 'wave', curves: [{ fn: 'sin', label: 'y = sin x' }], unit: 'rad', xMax: 2 * PI, zeros: true },
  'TRIG.122': { kind: 'unit', angles: [{ deg: 60, label: '?' }, { deg: 300, label: '?' }], vline: { x: 0.5, label: 'cos θ = ½' } },
  'TRIG.123': { kind: 'unit', angles: [{ deg: 30, label: '?' }, { deg: 150, label: '?' }], hline: { y: 0.5, label: 'sin θ = ½' } },
  'TRIG.124': { kind: 'unit', angles: [{ deg: 45, label: '45°' }, { deg: 225, label: '?' }], diag: true },
  'TRIG.125': { kind: 'unit', angles: [{ deg: 210, label: '?' }, { deg: 330, label: '?' }], hline: { y: -0.5, label: 'sin θ = −½' } },
  'TRIG.126': { kind: 'wave', curves: [{ fn: 'cos', label: 'y = cos θ' }], unit: 'deg', xMax: 720, hline: { y: 1, label: 'cos θ = 1' } },
  'TRIG.127': { kind: 'unit', angles: [{ deg: 0, label: '' }, { deg: 120, label: '?' }, { deg: 240, label: '?' }], vline: { x: -0.5, label: 'cos θ = −½' } },
  'TRIG.128': { kind: 'wave', curves: [{ fn: 'sin', a: 4, k: 8, b: PI / 6, label: 'd(t)' }], unit: 't', xMax: 12, hline: { y: 10, label: 'depth 10 ft' }, xLabel: 't (hours)' },
  'TRIG.129': { kind: 'unit', angles: [{ deg: 30, label: '' }, { deg: 150, label: '' }, { deg: 270, label: '?' }], hline: { y: 0.5, label: 'sin x = ½' } },
  'TRIG.130': { kind: 'wave', curves: [{ fn: 'sin', b: 2, label: 'sin 2θ' }, { fn: 'cos', label: 'cos θ' }], unit: 'deg', xMax: 360 },

  // ── U14 · Laws of Sines and Cosines ──
  'TRIG.131': { kind: 'triangle', shape: { A: 30, B: 45, a: 10 }, labels: { A: '30°', B: '45°', a: '10', b: 'b = ?' } },
  'TRIG.132': { kind: 'triangle', shape: { a: 5, b: 7, C: 60 }, labels: { a: '5', b: '7', C: '60°', c: 'c = ?' } },
  'TRIG.133': { kind: 'triangle', shape: { a: 6, b: 8, C: 50 }, labels: { a: 'a', b: 'b', C: 'C', c: '?' } },
  'TRIG.134': { kind: 'triangle', shape: { a: 8, b: 10, C: 30 }, labels: { a: '8 m', b: '10 m', C: '30°' }, height: 'h' },
  'TRIG.135': { kind: 'triangle', shape: { A: 62, C: 48, b: 210 }, labels: { A: '62°', C: '48°', b: '210 m', c: 'AB = ?' } },
  'TRIG.136': { kind: 'triangle', shape: { a: 5, b: 6, c: 7 }, labels: { a: '5', b: '6', c: '7', C: '?' } },
  'TRIG.137': { kind: 'triangle', shape: { a: 30, b: 42, C: 70 }, labels: { a: '30 km', b: '42 km', C: '70°', c: '?' }, names: ['ship 1', 'ship 2', 'port'] },
  'TRIG.138': { kind: 'ssa', A: 40, a: 8, b: 10, labels: { A: '40°', a: 'a = 8', b: 'b = 10' } },
  'TRIG.139': { kind: 'ssa', A: 35, a: 7, b: 9, labels: { A: '35°', a: 'a = 7', b: 'b = 9' } },
  'TRIG.140': { kind: 'triangle', shape: { a: 8, b: 15, c: 20 }, labels: { a: '8 m', b: '15 m', c: '20 m', C: '?' } },
};

export default SPECS;
