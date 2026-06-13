import Phaser from 'phaser';
import { buildTrail, TRAIL_WIDTH, type TrailNode } from './trailLayouts';
import { DOMAIN_COLORS, type Domain } from '../types/problem';

export interface TrailSceneState {
  unitsUnlocked: number;
  unitStars: Record<number, number>;
}

export interface TrailSceneInit {
  domain: Domain;
  state: TrailSceneState;
  onNodeSelect: (unit: number) => void;
  units?: number[];
}

export class TrailScene extends Phaser.Scene {
  private domain!: Domain;
  private layout: TrailNode[] = [];
  private state!: TrailSceneState;
  private onNodeSelect!: (unit: number) => void;

  constructor() {
    super('TrailScene');
  }

  init(data: TrailSceneInit) {
    this.domain = data.domain;
    this.state = data.state;
    this.onNodeSelect = data.onNodeSelect;
    const unitCount = data.units?.length ?? 2;
    this.layout = buildTrail(Math.max(2, unitCount));
  }

  create() {
    this.drawClouds();
    this.drawPath();
    this.drawNodes();
    this.placeCharacter();
  }

  private drawClouds() {
    // Decorative pale cloud blobs in the background.
    const cloud = (cx: number, cy: number, r: number) => {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.7);
      g.fillCircle(cx, cy, r);
      g.fillCircle(cx + r * 0.7, cy + 4, r * 0.8);
      g.fillCircle(cx - r * 0.7, cy + 4, r * 0.75);
    };
    const h = this.scale.height;
    cloud(80, 60, 24);
    cloud(TRAIL_WIDTH - 90, 120, 28);
    cloud(60, h - 100, 22);
    cloud(TRAIL_WIDTH - 60, h - 60, 26);
  }

  private drawPath() {
    const g = this.add.graphics();
    // Outer path
    g.lineStyle(20, 0xfed7aa, 1);
    g.beginPath();
    for (let i = 0; i < this.layout.length; i++) {
      const n = this.layout[i];
      if (i === 0) g.moveTo(n.x, n.y);
      else g.lineTo(n.x, n.y);
    }
    g.strokePath();
    // Dashed inner line
    g.lineStyle(4, 0xffffff, 0.9);
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
  }

  private firstIncompleteUnit(): number {
    for (const node of this.layout) {
      if ((this.state.unitStars[node.unit] ?? 0) === 0) return node.unit;
    }
    return -1;
  }

  private drawNodes() {
    const color = Phaser.Display.Color.HexStringToColor(
      DOMAIN_COLORS[this.domain],
    ).color;
    for (const node of this.layout) {
      // Open trails: every node is playable; the "current" node is simply the
      // first one without a star yet.
      const unlocked = true;
      const stars = this.state.unitStars[node.unit] ?? 0;
      const completed = stars > 0;
      const isCurrent = node.unit === this.firstIncompleteUnit() && !completed;

      const container = this.add.container(node.x, node.y);

      // Drop shadow
      const shadow = this.add.ellipse(0, 38, 64, 12, 0x000000, 0.18);
      container.add(shadow);

      // Bottom ring (darker)
      const ringBottom = this.add.circle(0, 4, 38, unlocked ? color : 0x9ca3af, 1);
      container.add(ringBottom);

      // Top ring
      const ring = this.add.circle(0, 0, 38, unlocked ? color : 0xd1d5db, 1);
      container.add(ring);

      // Inner disc
      const inner = this.add.circle(0, 0, 30, unlocked ? 0xffffff : 0xe5e7eb, 1);
      container.add(inner);

      // Label
      const labelText = completed ? '★' : String(node.unit);
      const label = this.add
        .text(0, 0, labelText, {
          fontFamily: 'Nunito, system-ui, sans-serif',
          fontSize: completed ? '34px' : '24px',
          fontStyle: '900',
          color: unlocked ? '#0F172A' : '#6B7280',
        })
        .setOrigin(0.5);
      container.add(label);

      container.setSize(80, 80);
      if (unlocked) {
        container.setInteractive({ useHandCursor: true });
        container.on('pointerover', () =>
          this.tweens.add({ targets: container, scale: 1.08, duration: 120 }),
        );
        container.on('pointerout', () =>
          this.tweens.add({ targets: container, scale: 1, duration: 120 }),
        );
        container.on('pointerdown', () =>
          this.tweens.add({
            targets: container,
            scale: 0.92,
            duration: 80,
            yoyo: true,
            onComplete: () => this.onNodeSelect(node.unit),
          }),
        );
        if (isCurrent) {
          // Pulse animation on the current node
          this.tweens.add({
            targets: ring,
            scale: { from: 1, to: 1.1 },
            yoyo: true,
            repeat: -1,
            duration: 700,
            ease: 'Sine.easeInOut',
          });
        }
      }

      // Star badge above completed nodes
      if (completed) {
        const badge = this.add.container(30, -30);
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
    }
  }

  private placeCharacter() {
    // Place a little owl character on the highest unlocked but not-completed node
    let targetNode: TrailNode | null = null;
    for (const node of this.layout) {
      const stars = this.state.unitStars[node.unit] ?? 0;
      if (stars === 0) {
        targetNode = node;
        break;
      }
    }
    if (!targetNode) return;
    const c = this.add.container(targetNode.x - 30, targetNode.y - 50);
    const body = this.add.circle(0, 0, 12, 0x58cc02, 1);
    body.setStrokeStyle(2, 0x0f172a);
    const eyeL = this.add.circle(-4, -2, 3, 0xffffff, 1);
    eyeL.setStrokeStyle(1, 0x0f172a);
    const eyeR = this.add.circle(4, -2, 3, 0xffffff, 1);
    eyeR.setStrokeStyle(1, 0x0f172a);
    const pupilL = this.add.circle(-4, -2, 1.2, 0x0f172a);
    const pupilR = this.add.circle(4, -2, 1.2, 0x0f172a);
    const beak = this.add.triangle(0, 4, 0, 0, -3, 5, 3, 5, 0xff9600);
    c.add([body, eyeL, eyeR, pupilL, pupilR, beak]);
    this.tweens.add({
      targets: c,
      y: c.y - 6,
      yoyo: true,
      repeat: -1,
      duration: 700,
      ease: 'Sine.easeInOut',
    });
  }
}

export { TRAIL_WIDTH };
