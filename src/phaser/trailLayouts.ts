import type { Domain } from '../types/problem';

export interface TrailNode {
  unit: number;
  x: number;
  y: number;
}

export const TRAIL_WIDTH = 480;
export const TRAIL_HEIGHT = 600;

export function buildTrail(units: number): TrailNode[] {
  const nodes: TrailNode[] = [];
  const startY = 80;
  const endY = TRAIL_HEIGHT - 80;
  const step = (endY - startY) / Math.max(1, units - 1);
  for (let i = 0; i < units; i++) {
    const y = startY + step * i;
    const phase = i / Math.max(1, units - 1);
    const wave = Math.sin(phase * Math.PI * 2.3);
    const x = TRAIL_WIDTH / 2 + wave * 130;
    nodes.push({ unit: i + 1, x, y });
  }
  return nodes;
}

// Default fallback if a domain has no problems yet
export const TRAIL_LAYOUTS: Record<Domain, TrailNode[]> = {
  '6.RP': buildTrail(2),
  '6.NS': buildTrail(2),
  '6.EE': buildTrail(2),
  '6.G': buildTrail(2),
  '6.SP': buildTrail(2),
};
