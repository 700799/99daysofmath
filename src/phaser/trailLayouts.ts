import type { Domain } from '../types/problem';

export interface TrailNode {
  unit: number;
  x: number;
  y: number;
}

export const TRAIL_WIDTH = 480;
export const TRAIL_HEIGHT = 720;

function snakeTrail(units: number, startY = 80, endY = TRAIL_HEIGHT - 80): TrailNode[] {
  const nodes: TrailNode[] = [];
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

export const TRAIL_LAYOUTS: Record<Domain, TrailNode[]> = {
  '6.RP': snakeTrail(6),
  '6.NS': snakeTrail(6),
  '6.EE': snakeTrail(6),
  '6.G': snakeTrail(6),
  '6.SP': snakeTrail(6),
};
