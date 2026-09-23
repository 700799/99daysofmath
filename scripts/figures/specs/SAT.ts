import type { Figure } from '../index.js';

// One figure per SAT geometry problem. Units 15–18 are the whole geometry
// and trigonometry block of the test — angles, area and volume, right
// triangles, circles — and every one of those forty questions describes a
// picture the student is expected to draw for themselves. Here it is drawn.

const SPECS: Record<string, Figure> = {
  // ── U15 · lines, angles and triangles ──
  'SAT.141': { kind: 'triangle', shape: { A: 40, B: 65, c: 10 }, labels: { A: '40°', B: '65°', C: '?' } },
  'SAT.142': { kind: 'pair', variant: 'linear', a: '118°', b: '?', deg: 118 },
  'SAT.143': { kind: 'transversal', angles: [{ at: 'U', q: 'NE', label: '115°' }, { at: 'U', q: 'NW', label: '?' }] },
  'SAT.144': { kind: 'triangle', shape: { A: 50, C: 70, b: 10 }, labels: { A: '50°', C: '70°' }, exterior: { at: 'B', label: '?' } },
  'SAT.145': { kind: 'triangle', shape: { a: 10, b: 10, C: 40 }, labels: { C: '40°', A: '?', B: '?' }, equal: ['a', 'b'] },
  'SAT.146': { kind: 'polygon', n: 5, fan: true, caption: 'the interior angles add to ?' },
  'SAT.147': { kind: 'triangle', shape: { A: 30, B: 60, c: 10 }, labels: { A: 'x°', B: '2x°', C: '3x°' } },
  'SAT.148': { kind: 'transversal', angles: [{ at: 'U', q: 'NE', label: '(3x + 10)°' }, { at: 'L', q: 'NE', label: '(5x − 30)°' }] },
  'SAT.149': { kind: 'shape', variant: 'no-triangle', labels: { a: '3', b: '4', c: '8' }, dims: { a: 3, b: 4, c: 8 } },
  'SAT.150': { kind: 'triangle', shape: { A: 60, B: 100, c: 10 }, labels: { A: '(2x)°', B: '(3x + 10)°', C: '(x − 10)°' } },

  // ── U16 · area, volume and similarity ──
  'SAT.151': { kind: 'shape', variant: 'triangle', labels: { b: '12', h: '5', area: 'area = ?' }, dims: { b: 12, h: 5 } },
  'SAT.152': { kind: 'solid', variant: 'prism', dims: { l: 6, w: 5, h: 4 }, labels: { l: '6', w: '5', h: '4', v: 'V = ?' } },
  'SAT.153': { kind: 'shape', variant: 'circle', labels: { r: '6', area: 'area = ?' } },
  'SAT.154': { kind: 'solid', variant: 'cylinder', labels: { r: '3', h: '10', v: 'V = ?' } },
  'SAT.155': { kind: 'similar', variant: 'sides', labels: { c1: '1', c2: '3', area1: 'area', area2: '?', caption: 'sides in the ratio 1 : 3' } },
  'SAT.156': { kind: 'composite', variant: 'inside', dims: { w: 20, h: 15, cw: 5, ch: 5 }, labels: { w: '20 ft', h: '15 ft', cw: '5 ft', ch: '5 ft', total: 'garden left over = ?' } },
  'SAT.157': { kind: 'solid', variant: 'sphere', labels: { r: '3', v: 'V = ?' } },
  'SAT.158': { kind: 'solid', variant: 'scale', dims: { k: 2 }, labels: { small: 'edge s', big: 'edge 2s', ask: 'every edge doubled' }, caption: 'the volume is multiplied by ?' },
  'SAT.159': { kind: 'similar', variant: 'sides', labels: { n1: 'ABC', n2: 'DEF', c1: 'AB = 6', a1: 'BC = 8', c2: 'DE = 15', a2: 'EF = ?' } },
  'SAT.160': { kind: 'solid', variant: 'cone', labels: { r: 'r', h: 'h', v: 'cone volume = ?' }, caption: 'the cylinder on the same base holds 60 in³' },

  // ── U17 · right triangles and trigonometry ──
  'SAT.161': { kind: 'right', opp: '6', adj: '8', hyp: '?', shape: { opp: 6, adj: 8 } },
  'SAT.162': { kind: 'right', opp: '3', hyp: '5', angle: 'θ', shape: { opp: 3, adj: 4 } },
  'SAT.163': { kind: 'right', opp: '7', adj: '7', hyp: '?', angle: '45°', shape: { opp: 1, adj: 1 } },
  'SAT.164': { kind: 'right', opp: '5', hyp: '?', angle: '30°', shape: { opp: 1, adj: 1.732 } },
  'SAT.165': { kind: 'right', opp: '12', adj: '5', angle: 'θ', shape: { opp: 12, adj: 5 } },
  'SAT.166': { kind: 'right', opp: '4', adj: '3', hyp: '5', names: { A: 'A', B: 'B', C: 'C' }, shape: { opp: 4, adj: 3 } },
  'SAT.167': { kind: 'right', hyp: '13', adj: '5', opp: '?', shape: { opp: 12, adj: 5 } },
  'SAT.168': { kind: 'right', adj: '5', hyp: '13', opp: '?', angle: 'θ', shape: { opp: 12, adj: 5 } },
  'SAT.169': { kind: 'right', hyp: '20 ft', opp: '?', angle: '60°', shape: { opp: 1.732, adj: 1 }, ground: true },
  'SAT.170': { kind: 'right', adj: '40 ft', opp: '?', angle: 'θ', shape: { opp: 1.5, adj: 1 }, ground: true },

  // ── U18 · circles ──
  'SAT.171': { kind: 'circle-eq', h: 3, k: -2, r: 5, labels: { eq: '(x − 3)² + (y + 2)² = 25', r: 'r = ?' } },
  'SAT.172': { kind: 'circle-eq', h: 3, k: -2, r: 5, labels: { eq: '(x − 3)² + (y + 2)² = 25', centre: 'centre = ?' } },
  'SAT.173': { kind: 'shape', variant: 'circle', labels: { r: '7', area: 'the way round = ?' } },
  'SAT.174': { kind: 'sector', deg: 90, r: '8', angle: '90°', arc: '?' },
  'SAT.175': { kind: 'sector', deg: 60, r: '6', angle: '60°', shade: true, area: '?' },
  'SAT.176': { kind: 'standard', deg: 135, label: '135° = ? rad' },
  'SAT.177': { kind: 'circle-eq', h: 3, k: -2, r: 5, labels: { eq: 'x² + y² − 6x + 4y = 12', centre: 'centre', r: 'r = ?' } },
  'SAT.178': { kind: 'sector', deg: 69, r: '5', angle: '1.2 rad', arc: '?' },
  'SAT.179': { kind: 'shape', variant: 'circle', labels: { r: 'r', area: 'circumference 20π · area = ?' } },
  'SAT.180': { kind: 'sector', deg: 120, r: '9', angle: '?', arc: '6π' },
};

export default SPECS;
