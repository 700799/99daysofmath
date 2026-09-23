import type { Figure } from '../index.js';

// One figure per Geometry problem that describes a picture: the angle pairs,
// the transversal, the triangle, the circle, the shape, the beam with three
// marks on it, the claim and the one example that breaks it, the box. Keyed
// by problem id; every one of the 140 problems has one.

const SPECS: Record<string, Figure> = {
  // ── U1 · points, lines and segments ──
  'GEO.001': { kind: 'segment', variant: 'between', points: ['A', 'B', 'C'], parts: ['7 m', '5 m'], whole: '?' },
  'GEO.002': { kind: 'segment', variant: 'notation', caption: 'three ways to name a piece of a line' },
  'GEO.003': { kind: 'segment', variant: 'numberline', range: [0, 14], at: [{ x: 3, label: 'anchor' }, { x: 11, label: 'anchor' }], midLabel: '?' },
  'GEO.004': { kind: 'segment', variant: 'numberline', range: [-6, 8], at: [{ x: -4, label: 'marker' }, { x: 6, label: 'marker' }], span: '? units' },
  'GEO.005': { kind: 'segment', variant: 'between', points: ['A', 'B', 'C'], parts: ['2x', 'x + 5'], whole: '20' },
  'GEO.006': { kind: 'segment', variant: 'numberline', range: [0, 18], at: [{ x: 2, label: 'anchor' }, { x: 9, label: 'midpoint', color: '#10B981' }], caption: 'where is the other anchor?' },
  'GEO.007': { kind: 'segment', variant: 'between', points: ['P', 'Q', 'R'], caption: 'three stakes on one straight line' },
  'GEO.008': { kind: 'segment', variant: 'rays', caption: 'same endpoint, opposite directions' },
  'GEO.009': { kind: 'segment', variant: 'between', points: ['A', 'M', 'B'], parts: ['3x − 1', 'x + 9'], mid: true, whole: '?' },
  'GEO.010': { kind: 'segment', variant: 'between', points: ['P', 'Q', 'R'], parts: ['2x + 1', 'x − 3'], whole: '25 m' },


  // ── U2 · angle pairs ──
  'GEO.011': { kind: 'pair', variant: 'complementary', a: '35°', b: '?', deg: 35 },
  'GEO.012': { kind: 'pair', variant: 'linear', a: '?', b: '110°', deg: 70 },
  'GEO.013': { kind: 'pair', variant: 'named' },
  'GEO.014': { kind: 'pair', variant: 'vertical', a: '65°', b: '?', deg: 65 },
  'GEO.015': { kind: 'pair', variant: 'adjacent', a: '32°', b: '41°', total: '?', deg: 32 },
  'GEO.016': { kind: 'pair', variant: 'linear', a: '(3x)°', b: '(2x + 10)°', deg: 102 },
  'GEO.017': { kind: 'pair', variant: 'vertical', a: '1', b: '2', deg: 55 },
  'GEO.018': { kind: 'pair', variant: 'complementary', a: '62°', b: '?', deg: 62 },
  'GEO.019': { kind: 'pair', variant: 'supp-comp', deg: 40 },
  'GEO.020': { kind: 'pair', variant: 'bisector', a: '(4x + 2)°', b: '(6x − 8)°', total: '?', deg: 22 },

  // ── U3 · parallel lines and transversals ──
  'GEO.021': { kind: 'transversal', angles: [{ at: 'U', q: 'NE', label: '72°' }, { at: 'L', q: 'NE', label: '?' }] },
  'GEO.022': { kind: 'transversal', angles: [{ at: 'U', q: 'SW', label: '105°' }, { at: 'L', q: 'NW', label: '?' }] },
  'GEO.023': { kind: 'transversal', angles: [{ at: 'U', q: 'SE', label: '1' }, { at: 'L', q: 'NW', label: '2' }], caption: 'between the lines, on opposite sides' },
  'GEO.024': { kind: 'transversal', angles: [{ at: 'U', q: 'NW', label: '118°' }, { at: 'L', q: 'SE', label: '?' }] },
  'GEO.025': { kind: 'transversal', angles: [{ at: 'U', q: 'NE', label: '(5x − 20)°' }, { at: 'L', q: 'NE', label: '(3x + 10)°' }] },
  'GEO.026': { kind: 'transversal', angles: [{ at: 'U', q: 'SE', label: '(2x + 10)°' }, { at: 'L', q: 'NE', label: '(3x + 20)°' }] },
  'GEO.027': { kind: 'transversal', angles: [{ at: 'U', q: 'SE', label: '63°' }, { at: 'L', q: 'NW', label: '63°' }], parallel: false },
  'GEO.028': { kind: 'transversal', angles: [{ at: 'U', q: 'SE', label: '1' }, { at: 'L', q: 'NE', label: '2' }], caption: 'between the lines, same side, adding to 180°' },
  'GEO.029': { kind: 'transversal', angles: [{ at: 'U', q: 'SE', label: '(3x + 15)°' }, { at: 'L', q: 'NE', label: '(2x + 25)°' }] },
  'GEO.030': { kind: 'transversal', angles: [{ at: 'U', q: 'SE', label: '78°' }, { at: 'L', q: 'NE', label: '78°' }], parallel: false },

  // ── U4 · reasoning and proof ──
  'GEO.031': { kind: 'logic', variant: 'conditional', p: 'it rains on Saturday', q: 'the inspection is postponed', mark: 'p' },
  'GEO.032': { kind: 'logic', variant: 'converse', p: 'a figure is a square', q: 'it is a rectangle' },
  'GEO.033': { kind: 'shapes', items: [{ shape: 'square', name: 'square', mark: 'yes' }, { shape: 'rhombus', name: 'rhombus', mark: 'no' }], caption: 'both have four equal sides — only one is a square' },
  'GEO.034': { kind: 'logic', variant: 'counterexample', claim: 'if a number divides by 3, it divides by 6', items: ['?'] },
  'GEO.035': { kind: 'logic', variant: 'contrapositive', p: 'a shape is a square', q: 'it has four sides' },
  'GEO.036': { kind: 'congruence', variant: 'shared', caption: 'the two triangles share side BD' },
  'GEO.037': { kind: 'logic', variant: 'chain', items: ['AB', 'CD', 'EF'], caption: 'so the first equals the last' },
  'GEO.038': { kind: 'logic', variant: 'steps', items: ['given: 3x − 7 = 20', 'add 7 to both sides: 3x = 27', 'divide both sides by 3: x = ?'] },
  'GEO.039': { kind: 'logic', variant: 'inverse', p: 'a road is icy', q: 'the bridge is closed' },
  'GEO.040': { kind: 'logic', variant: 'counterexample', claim: 'if x² = 36, then x = 6', items: ['x = ?'] },

  // ── U5 · triangle congruence ──
  'GEO.041': { kind: 'congruence', variant: 'sas', labels: { left: 'patch 1', right: 'patch 2' }, caption: 'two sides and the angle between them' },
  'GEO.042': { kind: 'congruence', variant: 'sss', labels: { left: 'truss 1', right: 'truss 2' }, caption: 'all three sides match' },
  'GEO.043': { kind: 'congruence', variant: 'asa', labels: { left: 'plot 1', right: 'plot 2' }, caption: 'two angles and the side between them' },
  'GEO.044': { kind: 'congruence', variant: 'hl', labels: { left: 'ramp 1', right: 'ramp 2' }, caption: 'right angle, hypotenuse, one leg' },
  'GEO.045': { kind: 'congruence', variant: 'aaa', ok: false, caption: 'same three angles, but any size at all' },
  'GEO.046': { kind: 'congruence', variant: 'aas', labels: { left: 'panel 1', right: 'panel 2' }, caption: 'the side is not between the two angles' },
  'GEO.047': { kind: 'congruence', variant: 'cpctc', labels: { b: 'AC', e: 'DF' }, caption: 'congruent by SAS — so what about AC and DF?' },
  'GEO.048': { kind: 'congruence', variant: 'angles', labels: { A: '55°', B: '65°', F: '?', left: '△ABC', right: '△DEF' } },
  'GEO.049': { kind: 'congruence', variant: 'shared', caption: 'AB = CB, AD = CD, and BD is in both' },
  'GEO.050': { kind: 'congruence', variant: 'ssa', ok: false, caption: 'the angle is not between the two sides' },

  // ── U6 · triangle angles ──
  'GEO.051': { kind: 'triangle', shape: { A: 40, B: 75, c: 10 }, labels: { A: '40°', B: '75°', C: '?' } },
  'GEO.052': { kind: 'triangle', shape: { a: 10, b: 10, C: 40 }, labels: { C: '40°', A: '?', B: '?' }, equal: ['a', 'b'] },
  'GEO.053': { kind: 'triangle', shape: { a: 10, b: 10, c: 10 }, labels: { A: '?' }, equal: ['a', 'b', 'c'] },
  'GEO.054': { kind: 'triangle', shape: { A: 50, C: 60, b: 10 }, labels: { A: '50°', C: '60°' }, exterior: { at: 'B', label: '?' } },
  'GEO.055': { kind: 'triangle', shape: { A: 52, B: 52, c: 10 }, labels: { A: '52°', B: '52°', C: '?' }, equal: ['a', 'b'] },
  'GEO.056': { kind: 'triangle', shape: { a: 14, b: 12, c: 18 }, labels: { c: '?' }, midsegment: '9 in' },
  'GEO.057': { kind: 'shape', variant: 'no-triangle', labels: { a: '4', b: '5', c: '9' }, dims: { a: 4, b: 5, c: 9 } },
  'GEO.058': { kind: 'triangle', shape: { A: 50, C: 50, b: 10 }, labels: { A: '(2x + 10)°', C: '(x + 30)°' }, exterior: { at: 'B', label: '(5x)°' } },
  'GEO.059': { kind: 'triangle', shape: { a: 7, b: 12, C: 80 }, labels: { a: '7 ft', b: '12 ft', c: '?' } },
  'GEO.060': { kind: 'triangle', shape: { a: 10, c: 10, B: 70 }, labels: { A: '?' }, equal: ['b', 'c'], exterior: { at: 'B', label: '125°' } },

  // ── U7 · similarity ──
  'GEO.061': { kind: 'similar', variant: 'angles', labels: { caption: 'two pairs of matching angles' } },
  'GEO.062': { kind: 'similar', variant: 'sides', labels: { a1: '3', b1: '4', c1: '5', a2: '9', b2: '12', c2: '15', caption: 'scale factor = ?' } },
  'GEO.063': { kind: 'similar', variant: 'sides', labels: { n1: 'ABC', n2: 'DEF', c1: 'AB = 4', a1: 'BC = 6', c2: 'DE = 10', a2: 'EF = ?' } },
  'GEO.064': { kind: 'similar', variant: 'angles', labels: { n1: 'blueprint', n2: 'the real truss' } },
  'GEO.065': { kind: 'similar', variant: 'shadow', labels: { h1: '6 ft', s1: '4 ft', h2: '?', s2: '24 ft' } },
  'GEO.066': { kind: 'similar', variant: 'shadow', labels: { h1: '5 ft', s1: '3 ft', h2: '?', s2: '27 ft' } },
  'GEO.067': { kind: 'similar', variant: 'sas', labels: { c1: '4', b1: '6', c2: '6', b2: '9', caption: 'the marked angles are equal' } },
  'GEO.068': { kind: 'shape', variant: 'scale', labels: { map: '3.5 in on the map', scale: '1 in = 40 ft', real: 'real length = ?' } },
  'GEO.069': { kind: 'similar', variant: 'inside', labels: { AD: '4', DB: '6', AE: '6', EC: '?' } },
  'GEO.070': { kind: 'similar', variant: 'sides', labels: { c1: '2', c2: '3', area1: '20 in²', area2: '?', caption: 'sides in the ratio 2 : 3' } },

  // ── U8 · right triangles ──
  'GEO.071': { kind: 'right', opp: '6 ft', adj: '8 ft', hyp: '?', shape: { opp: 6, adj: 8 }, ground: true },
  'GEO.072': { kind: 'right', hyp: '13 ft', adj: '5 ft', opp: '?', shape: { opp: 12, adj: 5 }, ground: true },
  'GEO.073': { kind: 'right', opp: 'a', adj: 'b', hyp: 'c', names: { C: '' } },
  'GEO.074': { kind: 'grid', points: [{ x: 2, y: 3, label: 'fountain (2, 3)' }, { x: 6, y: 6, label: 'oak (6, 6)' }], segments: [{ from: 0, to: 1, label: '?' }], range: { x: [0, 8], y: [0, 8] } },
  'GEO.075': { kind: 'shape', variant: 'square', labels: { side: '8 in', diag: '?' } },
  'GEO.076': { kind: 'right', hyp: '12', adj: '?', angle: '30°', shape: { opp: 1, adj: 1.732 } },
  'GEO.077': { kind: 'shape', variant: 'rectangle', labels: { w: '12 in', h: '9 in', diag: '?' }, dims: { w: 12, h: 9 } },
  'GEO.078': { kind: 'right', hyp: '20 ft', opp: '?', angle: '30°', shape: { opp: 1, adj: 1.732 }, ground: true },
  'GEO.079': { kind: 'triangle', shape: { a: 13, b: 13, c: 10 }, labels: { a: '13 ft', b: '13 ft', c: '10 ft' }, height: '?' },
  'GEO.080': { kind: 'grid', points: [{ x: -3, y: 2, label: '(−3, 2)' }, { x: 5, y: -4, label: '(5, −4)' }], segments: [{ from: 0, to: 1, label: '?' }] },

  // ── U9 · right-triangle trig ──
  'GEO.081': { kind: 'right', opp: '3', hyp: '5', angle: 'A', names: { A: 'A', B: 'B', C: 'C' }, shape: { opp: 3, adj: 4 } },
  'GEO.082': { kind: 'right', adj: '24', hyp: '25', angle: 'P', shape: { opp: 7, adj: 24 } },
  'GEO.083': { kind: 'right', hyp: 'hyp', adj: '?', angle: 'θ' },
  'GEO.084': { kind: 'right', hyp: '15 ft', opp: '?', angle: '20°', shape: { opp: 0.364, adj: 1 }, ground: true },
  'GEO.085': { kind: 'right', opp: '30 ft', adj: '40 ft', angle: '?', shape: { opp: 3, adj: 4 }, ground: true },
  'GEO.086': { kind: 'right', opp: '120 ft', adj: '?', depression: '25°', shape: { opp: 120, adj: 257 }, ground: true },
  'GEO.087': { kind: 'right', hyp: '80 ft', opp: '?', angle: '40°', shape: { opp: 0.84, adj: 1 }, ground: true },
  'GEO.088': { kind: 'right', opp: '12 ft', hyp: '?', angle: '65°', shape: { opp: 2.14, adj: 1 }, ground: true },
  'GEO.089': { kind: 'right', adj: '150 ft', opp: '?', angle: '32°', shape: { opp: 0.625, adj: 1 }, ground: true, eye: '5 ft' },
  'GEO.090': { kind: 'right', opp: '2 ft', adj: '24 ft', angle: '?', shape: { opp: 2, adj: 24 }, ground: true },

  // ── U10 · polygons and quadrilaterals ──
  'GEO.091': { kind: 'quad', variant: 'parallelogram', labels: { A: '68°', B: '?' } },
  'GEO.092': { kind: 'polygon', n: 6, fan: true, caption: 'sum of the interior angles = ?' },
  'GEO.093': { kind: 'quad', variant: 'rect-rhombus' },
  'GEO.094': { kind: 'polygon', n: 12, exterior: '?' },
  'GEO.095': { kind: 'polygon', n: 8, interior: '?' },
  'GEO.096': { kind: 'polygon', n: 12, partial: true, interior: '150°', caption: 'how many sides?' },
  'GEO.097': { kind: 'quad', variant: 'trapezoid', labels: { top: '14 ft', bottom: '22 ft', mid: '?' } },
  'GEO.098': { kind: 'quad', variant: 'parallelogram', labels: { AB: '3x + 2', CD: '17' } },
  'GEO.099': { kind: 'polygon', n: 10, partial: true, caption: 'angles add to 1440° · sides = ?' },
  'GEO.100': { kind: 'quad', variant: 'rhombus-diagonals' },

  // ── U11 · circles ──
  'GEO.101': { kind: 'circle', variant: 'slices', n: 8, labels: { angle: '?' } },
  'GEO.102': { kind: 'circle', variant: 'central-inscribed', labels: { central: '80°', inscribed: '?' } },
  'GEO.103': { kind: 'circle', variant: 'semicircle', labels: { angle: '?' } },
  'GEO.104': { kind: 'sector', deg: 90, r: '10 ft', angle: '90°', arc: '?' },
  'GEO.105': { kind: 'sector', deg: 120, r: '6 in', angle: '120°', shade: true, area: '?' },
  'GEO.106': { kind: 'circle', variant: 'chord', labels: { r: '13 cm', chord: '24 cm', dist: '?' } },
  'GEO.107': { kind: 'circle', variant: 'tangent', labels: { r: '8', op: '17', pt: '?' } },
  'GEO.108': { kind: 'circle', variant: 'cyclic', labels: { W: '95°', Y: '?' } },
  'GEO.109': { kind: 'sector', deg: 140, r: '15 ft', angle: '140°', shade: true, area: '?' },
  'GEO.110': { kind: 'sector', deg: 40, r: '9 in', angle: '40°', arc: '?', shade: true },

  // ── U12 · area ──
  'GEO.111': { kind: 'shape', variant: 'triangle', labels: { b: '14 in', h: '9 in', area: 'area = ?' }, dims: { b: 14, h: 9 } },
  'GEO.112': { kind: 'shape', variant: 'parallelogram', labels: { b: '12 cm', h: '7 cm', area: 'area = ?' }, dims: { b: 12, h: 7 } },
  'GEO.113': { kind: 'shape', variant: 'circle', labels: { r: '5 in', area: 'area = ?' } },
  'GEO.114': { kind: 'shape', variant: 'trapezoid', labels: { top: '6 ft', bottom: '10 ft', h: '5 ft', area: 'area = ?' }, dims: { top: 6, bottom: 10, h: 5 } },
  'GEO.115': { kind: 'shape', variant: 'lshape', labels: { w: '10 ft', h: '6 ft', cw: '4 ft', ch: '3 ft' }, dims: { w: 10, h: 6, cw: 4, ch: 3 } },
  'GEO.116': { kind: 'shape', variant: 'pentagon', labels: { side: '8 in', apothem: '5.5 in' } },
  'GEO.117': { kind: 'shape', variant: 'square-circle', labels: { side: '10 cm', d: '10 cm' } },
  'GEO.118': { kind: 'shape', variant: 'circle', labels: { d: '14 in', area: 'area = ?' } },
  'GEO.119': { kind: 'shape', variant: 'rect-semicircle', labels: { w: '3 ft', h: '4 ft' } },
  'GEO.120': { kind: 'shape', variant: 'square-quarter', labels: { side: '12 in' } },

  // ── U13 · surface area and volume ──
  'GEO.121': { kind: 'solid', variant: 'prism', dims: { l: 5, w: 4, h: 3 }, labels: { l: '5 ft', w: '4 ft', h: '3 ft', v: 'V = ?' } },
  'GEO.122': { kind: 'solid', variant: 'cylinder', labels: { r: '3 in', h: '10 in', v: 'V = ?' } },
  'GEO.123': { kind: 'net', variant: 'cube', labels: { title: 'the gift box, unfolded', count: '6 × (4 × 4)' }, caption: 'paper = the area of all six faces' },
  'GEO.124': { kind: 'solid', variant: 'cone', labels: { r: '3 in', h: '8 in', v: 'V = ?' } },
  'GEO.125': { kind: 'solid', variant: 'sphere', labels: { r: '6 in', v: 'V = ?' } },
  'GEO.126': { kind: 'solid', variant: 'cylinder', labels: { r: '4 ft', h: '10 ft', v: 'V = ?' } },
  'GEO.127': { kind: 'solid', variant: 'scale', dims: { k: 3 }, labels: { small: 'edge s', big: 'edge 3s', ask: 'every edge × 3' }, caption: 'surface area × ?' },
  'GEO.128': { kind: 'solid', variant: 'pyramid', labels: { s: '6 cm', h: '10 cm', v: 'V = ?' } },
  'GEO.129': { kind: 'solid', variant: 'cone-hemisphere', labels: { r: '3 in', h: '10 in', v: 'total volume = ?' } },
  'GEO.130': { kind: 'solid', variant: 'two-cylinders', dims: { h1: 3, h2: 5 }, labels: { small: '3 in tall', big: '5 in tall', ask: 'small volume : large volume = ?' } },

  // ── U14 · transformations on the coordinate plane ──
  'GEO.131': { kind: 'grid', points: [{ x: 2, y: 5, label: '(2, 5)' }, { x: 5, y: 1, label: '?' }], arrows: [{ from: 0, to: 1, label: 'right 3, down 4' }], range: { x: [-1, 7], y: [-1, 7] } },
  'GEO.132': { kind: 'grid', points: [{ x: 4, y: -3, label: '(4, −3)' }, { x: 4, y: 3, label: '?' }], arrows: [{ from: 0, to: 1, label: 'reflect over the x-axis' }], range: { x: [-1, 7], y: [-5, 5] } },
  'GEO.133': { kind: 'grid', points: [{ x: 3, y: 1, label: '(3, 1)' }, { x: -1, y: 3, label: '?' }], arcs: [{ from: 0, to: 1, label: '90°' }], range: { x: [-4, 4], y: [-2, 5] } },
  'GEO.134': { kind: 'grid', points: [{ x: 0, y: 0 }, { x: 3, y: 2 }, { x: 2, y: -3, color: '#F43F5E' }], lines: [{ from: 0, to: 1, label: 'beam, slope 2/3' }, { from: 0, to: 2, color: '#F43F5E', dashed: true, label: 'brace, slope ?' }], range: { x: [-4, 5], y: [-4, 4] } },
  'GEO.135': { kind: 'grid', points: [{ x: 6, y: -4, label: '(6, −4)' }, { x: 3, y: -2, label: '?' }, { x: 0, y: 0, label: 'O', color: '#8B5CF6' }], lines: [{ from: 2, to: 0, dashed: true, color: '#8B5CF6' }], arrows: [{ from: 0, to: 1, label: 'scale factor ½' }], range: { x: [-1, 8], y: [-6, 2] } },
  'GEO.136': { kind: 'grid', points: [{ x: 1, y: 2, label: 'library (1, 2)' }, { x: 7, y: 10, label: 'pool (7, 10)' }], segments: [{ from: 0, to: 1, label: '?' }], range: { x: [0, 10], y: [0, 12] } },
  'GEO.137': { kind: 'grid', points: [{ x: 0, y: 1 }, { x: 4, y: 3, label: 'j' }, { x: 1, y: 5, color: '#F43F5E' }, { x: 2, y: 3, label: 'k', color: '#F43F5E' }], lines: [{ from: 0, to: 1 }, { from: 2, to: 3, color: '#F43F5E' }], range: { x: [-2, 6], y: [-1, 7] } },
  'GEO.138': { kind: 'polygon', n: 8, caption: 'how many lines of symmetry?' },
  'GEO.139': { kind: 'grid', points: [{ x: 3, y: -2, label: '(3, −2)' }, { x: -3, y: -2, color: '#8B5CF6' }, { x: -3, y: 2, label: '?' }], arrows: [{ from: 0, to: 1, label: 'over the y-axis' }, { from: 1, to: 2, label: 'up 4' }], range: { x: [-5, 5], y: [-4, 4] } },
  'GEO.140': { kind: 'grid', points: [{ x: 1, y: 1, label: 'A' }, { x: 5, y: 3, label: 'B' }, { x: 4, y: 5, label: 'C' }, { x: 0, y: 3, label: 'D' }], polygon: true, range: { x: [-1, 7], y: [-1, 7] } },
};

export default SPECS;
