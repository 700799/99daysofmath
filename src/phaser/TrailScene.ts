import Phaser from 'phaser';
import {
  TRAIL_LAYOUTS,
  TRAIL_WIDTH,
  TRAIL_HEIGHT,
  type TrailNode,
} from './trailLayouts';
import { DOMAIN_COLORS, type Domain } from '../types/problem';

export interface TrailSceneState {
  unitsUnlocked: number;
  unitStars: Record<number, number>;
}

export interface TrailSceneInit {
  domain: Domain;
  state: TrailSceneState;
  onNodeSelect: (unit: number) => void;
}

export class TrailScene extends Phaser.Scene {
  private domain!: Domain;
  private layout: TrailNode[] = [];
  private state!: TrailSceneState;
  private onNodeSelect!: (unit: number) => void;
  private nodeContainers: Map<number, Phaser.GameObjects.Container> = new Map();
  private pathGraphics?: Phaser.GameObjects.Graphics;

  constructor() {
    super('TrailScene');
  }

  init(data: TrailSceneInit) {
    this.domain = data.domain;
    this.state = data.state;
    this.onNodeSelect = data.onNodeSelect;
    this.layout = TRAIL_LAYOUTS[data.domain] ?? [];
  }

  create() {
    this.cameras.main.setBackgroundColor('#F8FAFC');
    this.drawPath();
    this.drawNodes();
  }

  private drawPath() {
    if (this.pathGraphics) this.pathGraphics.destroy();
    const g = this.add.graphics();
    g.lineStyle(18, 0xfed7aa, 1);
    g.beginPath();
    for (let i = 0; i < this.layout.length; i++) {
      const n = this.layout[i];
      if (i === 0) g.moveTo(n.x, n.y);
      else g.lineTo(n.x, n.y);
    }
    g.strokePath();
    // Dashed inner line.
    g.lineStyle(4, 0xffffff, 1);
    for (let i = 0; i < this.layout.length - 1; i++) {
      const a = this.layout[i];
      const b = this.layout[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      const ux = dx / len;
      const uy = dy / len;
      const dashLen = 10;
      const gapLen = 8;
      let dist = 0;
      while (dist < len) {
        const sx = a.x + ux * dist;
        const sy = a.y + uy * dist;
        const ex = a.x + ux * Math.min(dist + dashLen, len);
        const ey = a.y + uy * Math.min(dist + dashLen, len);
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(ex, ey);
        g.strokePath();
        dist += dashLen + gapLen;
      }
    }
    this.pathGraphics = g;
  }

  private drawNodes() {
    const color = Phaser.Display.Color.HexStringToColor(
      DOMAIN_COLORS[this.domain],
    ).color;
    for (const node of this.layout) {
      const unlocked = node.unit <= this.state.unitsUnlocked;
      const stars = this.state.unitStars[node.unit] ?? 0;
      const completed = stars > 0;

      const container = this.add.container(node.x, node.y);
      const shadow = this.add.circle(0, 6, 36, 0x000000, 0.12);
      const ring = this.add.circle(
        0,
        0,
        38,
        unlocked ? color : 0xd1d5db,
        1,
      );
      const inner = this.add.circle(
        0,
        0,
        30,
        unlocked ? 0xffffff : 0xe5e7eb,
        1,
      );
      const label = this.add
        .text(
          0,
          0,
          completed ? '★' : unlocked ? String(node.unit) : '🔒',
          {
            fontFamily: 'Nunito, system-ui, sans-serif',
            fontSize: completed ? '32px' : '24px',
            fontStyle: '900',
            color: unlocked ? '#0F172A' : '#6B7280',
          },
        )
        .setOrigin(0.5);

      container.add([shadow, ring, inner, label]);
      container.setSize(76, 76);
      container.setInteractive({ useHandCursor: unlocked });

      if (unlocked) {
        container.on('pointerover', () => this.tweens.add({
          targets: container,
          scale: 1.08,
          duration: 120,
        }));
        container.on('pointerout', () => this.tweens.add({
          targets: container,
          scale: 1,
          duration: 120,
        }));
        container.on('pointerdown', () => this.tweens.add({
          targets: container,
          scale: 0.92,
          duration: 80,
          yoyo: true,
          onComplete: () => this.onNodeSelect(node.unit),
        }));
      }

      // Star badge above completed nodes
      if (completed) {
        const badge = this.add.container(28, -28);
        const badgeBg = this.add.circle(0, 0, 14, 0xfbbf24, 1);
        const badgeText = this.add
          .text(0, 0, `${stars}`, {
            fontFamily: 'Nunito, system-ui, sans-serif',
            fontSize: '14px',
            fontStyle: '900',
            color: '#0F172A',
          })
          .setOrigin(0.5);
        badge.add([badgeBg, badgeText]);
        container.add(badge);
      }

      this.nodeContainers.set(node.unit, container);
    }
  }
}

export { TRAIL_WIDTH, TRAIL_HEIGHT };
