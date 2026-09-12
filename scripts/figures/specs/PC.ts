import type { AngleFigure } from '../angleFigures.js';

// One figure per Precalculus trigonometry problem (units 8–12), keyed by
// problem id. The earlier units are about functions, polynomials and logs,
// which are not angle problems.

const SPECS: Record<string, AngleFigure> = {
  // ── U8 · right-triangle trigonometry ──
  'PC.071': { kind: 'right', opp: '3', adj: '4', hyp: '5' },
  'PC.072': { kind: 'right', opp: '3', adj: '4', hyp: '5', angle: 'θ' },
  'PC.073': { kind: 'right', opp: '3', adj: '4', hyp: '5', angle: 'θ' },
  'PC.074': { kind: 'right', opp: '6', adj: '8', hyp: '10', angle: 'θ' },
  'PC.075': { kind: 'right', opp: '5 m', adj: '5 m', angle: '?', shape: { opp: 1, adj: 1 }, ground: true },
  'PC.076': { kind: 'right', hyp: '12', opp: '?', angle: '30°', shape: { opp: 1, adj: 1.732 } },
  'PC.077': { kind: 'right', angle: '55°', angleAt: 'A', names: { B: '?' }, shape: { opp: 1.43, adj: 1 }, ground: true },
  'PC.078': { kind: 'right', adj: '20 ft', opp: '?', angle: '45°', shape: { opp: 1, adj: 1 }, ground: true },
  'PC.079': { kind: 'right', hyp: '10 ft', opp: '?', angle: '30°', shape: { opp: 1, adj: 1.732 }, ground: true },
  'PC.080': { kind: 'right', hyp: '40 m', opp: '20 m', angle: '?', shape: { opp: 1, adj: 1.732 }, ground: true },

  // ── U9 · the unit circle ──
  'PC.081': { kind: 'unit', angles: [{ deg: 0, label: '0°', point: '(1, 0)' }], legs: { x: 'cos 0° = ?' } },
  'PC.082': { kind: 'unit', angles: [{ deg: 90, label: '90°', point: '(0, 1)' }], legs: { y: 'sin 90° = ?' } },
  'PC.083': { kind: 'clock', from: 12, to: 3 },
  'PC.084': { kind: 'sector', deg: 180, r: '1', angle: 'π rad = ?°' },
  'PC.085': { kind: 'sector', deg: 60, r: '1', angle: 'π/3 rad' },
  'PC.086': { kind: 'sector', deg: 359.9, r: '1', angle: '360° = nπ rad' },
  'PC.087': { kind: 'quadrants' },
  'PC.088': { kind: 'unit', angles: [{ deg: 30, label: '30°' }], legs: { y: 'sin 30° = ?', r: '1' } },
  'PC.089': { kind: 'ferris', diameter: 'radius 15 m', clearance: '5 m', centre: 'centre 20 m', period: 'starts at the far right, turns 90°' },
  'PC.090': { kind: 'standard', deg: 300 },

  // ── U10 · graphs of sine and cosine ──
  'PC.091': { kind: 'wave', curves: [{ fn: 'sin', a: 4, label: 'y = 4 sin x' }], unit: 'deg', xMax: 360, amplitude: '?', midline: 'y = 0' },
  'PC.092': { kind: 'wave', curves: [{ fn: 'sin', k: 7, label: 'y = sin x + 7' }], unit: 'deg', xMax: 360, midline: 'midline = ?' },
  'PC.093': { kind: 'wave', curves: [{ fn: 'sin', a: 18, k: 22, label: 'h = 18 sin x + 22' }], unit: 'deg', xMax: 360, amplitude: '?', midline: 'y = 22' },
  'PC.094': { kind: 'wave', curves: [{ fn: 'sin', b: 2, label: 'y = sin 2x' }], unit: 'deg', xMax: 360, period: 'period = ?' },
  'PC.095': { kind: 'wave', curves: [{ fn: 'sin', label: 'y = sin x' }, { fn: 'sin', h: 30, label: 'y = sin(x − 30°)' }], unit: 'deg', xMax: 360 },
  'PC.096': { kind: 'wave', curves: [{ fn: 'sin', a: 3, b: 6, label: 'y = 3 sin 6x' }], unit: 'deg', xMax: 180, period: 'one beat = ?', xStep: 30 },
  'PC.097': { kind: 'wave', curves: [{ fn: 'sin', a: 3, k: 6, b: Math.PI / 6 }], unit: 't', xMax: 24, max: 'high tide 9 m', min: 'low tide 3 m', midline: 'midline = ?', xLabel: 't (hours)' },
  'PC.098': { kind: 'wave', curves: [{ fn: 'sin', a: 4, k: 12, b: (2 * Math.PI) / 12 }], unit: 't', xMax: 12, max: '16 h', min: '8 h', amplitude: '?', midline: 'midline', xLabel: 'month' },
  'PC.099': { kind: 'wave', curves: [{ fn: 'sin', a: 18, k: 22, label: 'h = 18 sin x + 22' }], unit: 'deg', xMax: 360, max: 'highest = ?', midline: 'y = 22' },
  'PC.100': { kind: 'wave', curves: [{ fn: 'sin', a: 2, b: 9, label: 'y = 2 sin 9x' }], unit: 'deg', xMax: 120, period: 'one wave = ?', xStep: 20 },

  // ── U11 · identities and equations ──
  'PC.101': { kind: 'unit', angles: [{ deg: 40, label: 'θ' }], legs: { x: 'cos θ', y: 'sin θ', r: '1' } },
  'PC.102': { kind: 'unit', angles: [{ deg: 40, label: 'θ' }], legs: { x: 'cos θ', y: 'sin θ', r: '1' } },
  'PC.103': { kind: 'right', opp: '1', adj: '1', hyp: '√2', angle: '45°', shape: { opp: 1, adj: 1 } },
  'PC.104': { kind: 'unit', angles: [{ deg: 36.9, label: 'θ' }], legs: { x: 'cos θ = ?', y: 'sin θ = 0.6', r: '1' } },
  'PC.105': { kind: 'right', opp: '0.6', adj: '0.8', hyp: '1', angle: 'θ', shape: { opp: 3, adj: 4 } },
  'PC.106': { kind: 'wave', curves: [{ fn: 'sin', a: 5, k: 5, label: 'h = 5 sin θ + 5' }], unit: 'deg', xMax: 360, max: 'highest at θ = ?' },
  'PC.107': { kind: 'unit', angles: [{ deg: 53.1, label: 'θ' }], legs: { x: 'cos θ = 0.6', y: 'sin θ = ?', r: '1' } },
  'PC.108': { kind: 'unit', angles: [{ deg: 30, label: '?' }, { deg: 150, label: '?' }], hline: { y: 0.5, label: 'sin θ = 0.5' } },
  'PC.109': { kind: 'unit', angles: [{ deg: 30, label: '30°' }, { deg: 150, label: '?' }], hline: { y: 0.5, label: 'sin θ = 0.5' } },
  'PC.110': { kind: 'unit', angles: [{ deg: 45, label: '45°' }, { deg: 225, label: '?' }], diag: true },

  // ── U12 · Laws of Sines and Cosines ──
  'PC.111': { kind: 'triangle', shape: { A: 40, B: 75, c: 10 }, labels: { A: '40°', B: '75°', C: '?' } },
  'PC.112': { kind: 'right', hyp: 'b = 10', opp: 'a = ?', angle: '30°', shape: { opp: 1, adj: 1.732 }, names: { A: 'A', B: 'C', C: 'B' } },
  'PC.113': { kind: 'triangle', shape: { a: 3, b: 8, C: 60 }, labels: { a: '3', b: '8', C: '60°', c: 'c = ?' } },
  'PC.114': { kind: 'right', hyp: '100 m', opp: '?', angle: '30°', shape: { opp: 1, adj: 1.732 }, names: { A: 'A', C: 'B', B: 'drone' }, ground: true },
  'PC.115': { kind: 'triangle', shape: { a: 5, b: 16, C: 120 }, labels: { a: '5 km', b: '16 km', C: '120°', c: '?' }, names: ['start', 'finish', 'turn'] },
  'PC.116': { kind: 'triangle', shape: { a: 3, b: 5, c: 7 }, labels: { a: '3', b: '5', c: '7', C: '?' } },
  'PC.117': { kind: 'triangle', shape: { a: 30, b: 80, C: 60 }, labels: { a: '30 m', b: '80 m', C: '60°', c: '?' }, names: ['P', 'Q', 'corner'] },
  'PC.118': { kind: 'triangle', shape: { a: 90, b: 150, C: 120 }, labels: { a: '90 ft', b: '150 ft', C: '120°', c: '?' }, names: ['post', 'post', 'home'] },
  'PC.119': { kind: 'triangle', shape: { a: 5, b: 12, c: 13 }, labels: { a: '5', b: '12', c: '13', C: '?' } },
  'PC.120': { kind: 'triangle', shape: { a: 5, b: 16, C: 120 }, labels: { a: '5 km', b: '16 km', C: '120°', c: 'straight route = ?' }, names: ['start', 'finish', 'turn'] },
};

export default SPECS;
