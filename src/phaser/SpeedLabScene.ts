import Phaser from 'phaser';

// Speed Lab — an "Aerospace Syllabus" driving simulator that teaches d = r × t.
// Three sequential challenges (find rate, find time, find distance) run on Arcade
// Physics: a car body is launched at a real velocity and the scene shows live
// telemetry (X position, velocity, mission clock) so the formula is tangible.

export interface SpeedLabInit {
  onComplete: (cleared: number) => void;
  onLevel?: (level: number) => void;
}

type Find = 'r' | 't' | 'd';
interface Level {
  id: number;
  name: string;
  find: Find;
  dist: number; // px
  time: number; // s
  rate: number; // px/s
  choices: number[];
  unit: string;
  formula: string; // worked solution
  prompt: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: 'FIND RATE',
    find: 'r',
    dist: 600,
    time: 4,
    rate: 150,
    choices: [100, 120, 150, 200],
    unit: 'px/s',
    formula: 'r = d ÷ t = 600 ÷ 4 = 150 px/s',
    prompt: 'Reach the checkpoint at d = 600px in exactly t = 4s. SET THE RATE.',
  },
  {
    id: 2,
    name: 'FIND TIME',
    find: 't',
    dist: 1000,
    time: 5,
    rate: 200,
    choices: [3, 4, 5, 6],
    unit: 's',
    formula: 't = d ÷ r = 1000 ÷ 200 = 5 s',
    prompt: 'Speed is fixed at r = 200px/s over d = 1000px. SET THE COUNTDOWN.',
  },
  {
    id: 3,
    name: 'FIND DISTANCE',
    find: 'd',
    dist: 960,
    time: 8,
    rate: 120,
    choices: [720, 840, 960, 1080],
    unit: 'px',
    formula: 'd = r × t = 120 × 8 = 960 px',
    prompt: 'Fuel lasts t = 8s at r = 120px/s. PICK THE WAYPOINT YOU CAN REACH.',
  },
];

const W = 820;
const H = 480;
const START_X = 96;
const TRACK_Y = 250;
const MARGIN_R = 110;
const VIEW_SCALE = (W - START_X - MARGIN_R) / 1000; // longest range (1000px) fits

// Aerospace palette
const C = {
  bg: 0x0b1220,
  panel: 0x111c2e,
  grid: 0x1e3a5f,
  cyan: 0x38bdf8,
  amber: 0xfbbf24,
  green: 0x34d399,
  red: 0xef4444,
  white: 0xe2e8f0,
  dim: 0x64748b,
};
const HEX = (n: number) => '#' + n.toString(16).padStart(6, '0');
const MONO = 'Menlo, Consolas, "Courier New", monospace';

export class SpeedLabScene extends Phaser.Scene {
  private onComplete!: (cleared: number) => void;
  private onLevel?: (level: number) => void;

  private levelIdx = 0;
  private cleared = 0;
  private phase: 'select' | 'prompt' | 'run' | 'result' = 'select';
  private clock = 0;
  private chosen = 0;
  private car!: Phaser.Physics.Arcade.Image;
  private idleTween?: Phaser.Tweens.Tween;
  private ui: Phaser.GameObjects.GameObject[] = [];
  private telemetry!: Phaser.GameObjects.Text;
  private clockText!: Phaser.GameObjects.Text;
  private gaugeNeedle!: Phaser.GameObjects.Graphics;

  constructor() {
    super('SpeedLabScene');
  }

  init(data: SpeedLabInit) {
    this.onComplete = data.onComplete;
    this.onLevel = data.onLevel;
    this.levelIdx = 0;
    this.cleared = 0;
  }

  create() {
    this.drawVehicleTextures();
    this.drawChrome();

    // the vehicle (Arcade Physics body) — texture chosen on the select screen
    this.car = this.physics.add.image(START_X, TRACK_Y, 'sl-car');
    this.car.setDepth(5).setDisplaySize(54, 32).setVisible(false);
    (this.car.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // live telemetry panel
    this.telemetry = this.add
      .text(16, 132, '', { fontFamily: MONO, fontSize: '15px', color: HEX(C.cyan), lineSpacing: 4 })
      .setDepth(20);
    this.clockText = this.add
      .text(W - 16, 132, '', { fontFamily: MONO, fontSize: '15px', color: HEX(C.amber), align: 'right' })
      .setOrigin(1, 0)
      .setDepth(20);

    this.showSelect();
  }

  // --- vehicle select --------------------------------------------------------
  private showSelect() {
    this.phase = 'select';
    this.clearUI();
    this.telemetry.setVisible(false);
    this.clockText.setVisible(false);
    const vehicles = [
      { key: 'sl-car', label: 'KEI CAR' },
      { key: 'sl-boat', label: 'BOAT' },
      { key: 'sl-rocket', label: 'ROCKET' },
      { key: 'sl-plane', label: 'JET' },
      { key: 'sl-tiger', label: 'TIGER' },
    ];
    this.ui.push(this.add.text(W / 2, 110, 'SELECT YOUR VEHICLE  乗り物をえらぶ', { fontFamily: MONO, fontSize: '18px', color: HEX(C.amber), fontStyle: 'bold' }).setOrigin(0.5).setDepth(11));
    const n = vehicles.length;
    const cw = 140;
    const gap = 16;
    const total = n * cw + (n - 1) * gap;
    let x0 = (W - total) / 2 + cw / 2;
    vehicles.forEach((v) => {
      const cx = x0;
      x0 += cw + gap;
      const rect = this.add.rectangle(cx, 250, cw, 150, C.panel, 1).setStrokeStyle(2, C.cyan).setDepth(11).setInteractive({ useHandCursor: true });
      const img = this.add.image(cx, 232, v.key).setDisplaySize(96, 58).setDepth(12);
      const lbl = this.add.text(cx, 300, v.label, { fontFamily: MONO, fontSize: '14px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);
      this.tweens.add({ targets: img, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 700, ease: 'sine.inOut' });
      rect.on('pointerover', () => rect.setStrokeStyle(3, C.amber));
      rect.on('pointerout', () => rect.setStrokeStyle(2, C.cyan));
      rect.on('pointerdown', () => {
        if (this.phase !== 'select') return;
        this.car.setTexture(v.key).setDisplaySize(54, 32).setVisible(true);
        this.idleTween?.stop();
        this.car.setAngle(0);
        this.idleTween = this.tweens.add({ targets: this.car, angle: { from: -3, to: 3 }, yoyo: true, repeat: -1, duration: 520, ease: 'sine.inOut' });
        this.startLevel();
      });
      this.ui.push(rect, img, lbl);
    });
  }

  // --- static chrome (title, telemetry frame, gauge) -------------------------
  private drawChrome() {
    this.add.rectangle(0, 0, W, H, C.bg).setOrigin(0);
    const g = this.add.graphics();
    // faint instrument grid
    g.lineStyle(1, C.grid, 0.5);
    for (let x = 0; x <= W; x += 40) g.lineBetween(x, 0, x, H);
    for (let y = 0; y <= H; y += 40) g.lineBetween(0, y, W, y);
    // header band
    g.fillStyle(C.panel, 1).fillRect(0, 0, W, 46);
    g.lineStyle(2, C.cyan, 0.7).lineBetween(0, 46, W, 46);
    // Japanese-bold accent tab
    g.fillStyle(C.red, 1).fillRect(0, 0, 10, 46);
    this.add.text(22, 12, 'SPEED LAB', { fontFamily: MONO, fontSize: '20px', color: HEX(C.white), fontStyle: 'bold' });
    this.add.text(150, 17, '// d = r × t  運動', { fontFamily: MONO, fontSize: '13px', color: HEX(C.amber) });

    // velocity gauge (bottom-right dashboard)
    const gx = W - 80;
    const gy = H - 70;
    const gg = this.add.graphics().setDepth(15);
    gg.lineStyle(6, C.grid, 1).beginPath();
    gg.arc(gx, gy, 46, Phaser.Math.DegToRad(140), Phaser.Math.DegToRad(40), false);
    gg.strokePath();
    gg.lineStyle(2, C.cyan, 0.8).beginPath();
    gg.arc(gx, gy, 46, Phaser.Math.DegToRad(140), Phaser.Math.DegToRad(40), false);
    gg.strokePath();
    this.add.text(gx, gy + 18, 'VEL', { fontFamily: MONO, fontSize: '11px', color: HEX(C.dim) }).setOrigin(0.5).setDepth(15);
    this.gaugeNeedle = this.add.graphics().setDepth(16);
  }

  // Five bold, cartoon vehicle textures (all face right, the travel direction).
  private drawVehicleTextures() {
    const ink = 0x111827;
    const mk = (key: string, w: number, h: number, draw: (g: Phaser.GameObjects.Graphics) => void) => {
      const g = this.make.graphics();
      g.lineStyle(4, ink, 1);
      draw(g);
      g.generateTexture(key, w, h);
      g.destroy();
    };

    // KEI CAR — red/white Japanese mini-car
    mk('sl-car', 68, 40, (g) => {
      g.fillStyle(0xef4444, 1); g.fillRoundedRect(4, 14, 58, 16, 6); g.strokeRoundedRect(4, 14, 58, 16, 6);
      g.fillStyle(0xffffff, 1); g.fillRoundedRect(16, 5, 30, 13, 5); g.strokeRoundedRect(16, 5, 30, 13, 5);
      g.fillStyle(0x38bdf8, 1); g.fillRect(20, 8, 9, 8); g.fillRect(33, 8, 9, 8);
      g.fillStyle(ink, 1); g.fillCircle(18, 32, 6); g.fillCircle(48, 32, 6); g.strokeCircle(18, 32, 6); g.strokeCircle(48, 32, 6);
      g.fillStyle(0xe5e7eb, 1); g.fillCircle(18, 32, 2.5); g.fillCircle(48, 32, 2.5);
      g.fillStyle(0xfbbf24, 1); g.fillCircle(61, 20, 2.5);
    });

    // BOAT — blue hull, white cabin, flag
    mk('sl-boat', 68, 40, (g) => {
      g.fillStyle(0x2563eb, 1); g.beginPath(); g.moveTo(6, 22); g.lineTo(60, 22); g.lineTo(50, 37); g.lineTo(16, 37); g.closePath(); g.fillPath(); g.strokePath();
      g.fillStyle(0xffffff, 1); g.fillRoundedRect(24, 8, 20, 14, 4); g.strokeRoundedRect(24, 8, 20, 14, 4);
      g.fillStyle(0x38bdf8, 1); g.fillCircle(34, 15, 3.5);
      g.lineBetween(52, 22, 52, 4);
      g.fillStyle(0xef4444, 1); g.beginPath(); g.moveTo(52, 4); g.lineTo(64, 9); g.lineTo(52, 13); g.closePath(); g.fillPath(); g.strokePath();
    });

    // ROCKET — nose right, flame left
    mk('sl-rocket', 74, 40, (g) => {
      g.fillStyle(0xfb923c, 1); g.beginPath(); g.moveTo(46, 8); g.lineTo(66, 20); g.lineTo(46, 32); g.closePath(); g.fillPath(); g.strokePath();
      g.fillStyle(0xe2e8f0, 1); g.fillRoundedRect(14, 11, 34, 18, 8); g.strokeRoundedRect(14, 11, 34, 18, 8);
      g.fillStyle(0xef4444, 1);
      g.beginPath(); g.moveTo(18, 11); g.lineTo(6, 2); g.lineTo(22, 12); g.closePath(); g.fillPath(); g.strokePath();
      g.beginPath(); g.moveTo(18, 29); g.lineTo(6, 38); g.lineTo(22, 28); g.closePath(); g.fillPath(); g.strokePath();
      g.fillStyle(0x38bdf8, 1); g.fillCircle(34, 20, 5); g.strokeCircle(34, 20, 5);
      g.fillStyle(0xfbbf24, 1); g.beginPath(); g.moveTo(14, 15); g.lineTo(2, 20); g.lineTo(14, 25); g.closePath(); g.fillPath();
    });

    // JET — fuselage, wings, tail
    mk('sl-plane', 74, 40, (g) => {
      g.fillStyle(0xe2e8f0, 1); g.fillRoundedRect(8, 15, 48, 12, 6); g.strokeRoundedRect(8, 15, 48, 12, 6);
      g.beginPath(); g.moveTo(56, 15); g.lineTo(70, 21); g.lineTo(56, 27); g.closePath(); g.fillPath(); g.strokePath();
      g.fillStyle(0x3b82f6, 1);
      g.beginPath(); g.moveTo(24, 16); g.lineTo(36, 2); g.lineTo(42, 16); g.closePath(); g.fillPath(); g.strokePath();
      g.beginPath(); g.moveTo(24, 26); g.lineTo(36, 38); g.lineTo(42, 26); g.closePath(); g.fillPath(); g.strokePath();
      g.beginPath(); g.moveTo(8, 16); g.lineTo(2, 6); g.lineTo(15, 16); g.closePath(); g.fillPath(); g.strokePath();
      g.fillStyle(0x38bdf8, 1); g.fillCircle(50, 21, 3); g.fillCircle(42, 21, 3);
    });

    // TIGER — orange cartoon, stripes, facing right
    mk('sl-tiger', 74, 44, (g) => {
      g.fillStyle(0xf97316, 1);
      g.fillEllipse(30, 26, 42, 22); g.strokeEllipse(30, 26, 42, 22);
      g.fillStyle(0xf97316, 1); g.fillCircle(54, 20, 13); g.strokeCircle(54, 20, 13);
      g.beginPath(); g.moveTo(46, 8); g.lineTo(49, 1); g.lineTo(53, 10); g.closePath(); g.fillPath(); g.strokePath();
      g.beginPath(); g.moveTo(62, 8); g.lineTo(59, 1); g.lineTo(55, 10); g.closePath(); g.fillPath(); g.strokePath();
      g.fillStyle(0xfff7ed, 1); g.fillCircle(57, 24, 6);
      g.fillStyle(ink, 1); g.fillCircle(62, 21, 1.8); g.fillCircle(51, 17, 1.9);
      g.lineStyle(3, 0x7c2d12, 1); g.lineBetween(18, 18, 22, 32); g.lineBetween(28, 16, 31, 32); g.lineBetween(38, 18, 41, 31);
      g.lineStyle(4, ink, 1);
      g.fillStyle(0xf97316, 1); g.fillRect(18, 34, 6, 8); g.fillRect(40, 34, 6, 8); g.strokeRect(18, 34, 6, 8); g.strokeRect(40, 34, 6, 8);
      g.lineStyle(5, 0xf97316, 1); g.lineBetween(10, 24, 2, 14);
      g.lineStyle(4, ink, 1);
    });
  }

  // --- per-level setup -------------------------------------------------------
  private clearUI() {
    this.ui.forEach((o) => o.destroy());
    this.ui = [];
  }

  private screenX(posPx: number) {
    return START_X + posPx * VIEW_SCALE;
  }

  private startLevel() {
    const lv = LEVELS[this.levelIdx];
    this.onLevel?.(lv.id);
    this.telemetry.setVisible(true);
    this.clockText.setVisible(true);
    this.phase = 'prompt';
    this.clock = 0;
    this.chosen = 0;
    this.clearUI();

    this.car.setPosition(START_X, TRACK_Y);
    (this.car.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    // track line + ruler
    const g = this.add.graphics().setDepth(2);
    g.lineStyle(4, C.dim, 1).lineBetween(START_X, TRACK_Y + 22, this.screenX(1000), TRACK_Y + 22);
    g.lineStyle(2, C.grid, 1);
    for (let d = 0; d <= 1000; d += 100) {
      const x = this.screenX(d);
      g.lineBetween(x, TRACK_Y + 16, x, TRACK_Y + 28);
      this.ui.push(
        this.add.text(x, TRACK_Y + 32, String(d), { fontFamily: MONO, fontSize: '10px', color: HEX(C.dim) }).setOrigin(0.5).setDepth(2),
      );
    }
    this.ui.push(g);

    // start flag
    this.ui.push(this.add.text(START_X, TRACK_Y - 30, '▌START', { fontFamily: MONO, fontSize: '11px', color: HEX(C.green) }).setOrigin(0, 0.5).setDepth(3));

    // targets per level
    if (lv.find === 'd') {
      // waypoint flags at each choice distance
      lv.choices.forEach((dch) => {
        const x = this.screenX(dch);
        const flag = this.add.text(x, TRACK_Y - 18, '⚑', { fontFamily: MONO, fontSize: '22px', color: HEX(dch === lv.dist ? C.amber : C.dim) }).setOrigin(0.5).setDepth(3);
        this.ui.push(flag);
        this.ui.push(this.add.text(x, TRACK_Y - 40, `${dch}`, { fontFamily: MONO, fontSize: '11px', color: HEX(C.white) }).setOrigin(0.5).setDepth(3));
      });
    } else {
      // single checkpoint/finish at the level distance
      const x = this.screenX(lv.dist);
      this.ui.push(this.add.rectangle(x, TRACK_Y, 4, 60, C.amber).setDepth(3));
      this.ui.push(this.add.text(x, TRACK_Y - 34, lv.find === 'r' ? 'CHECKPOINT' : 'FINISH', { fontFamily: MONO, fontSize: '11px', color: HEX(C.amber) }).setOrigin(0.5).setDepth(3));
      this.ui.push(this.add.text(x, TRACK_Y + 46, `${lv.dist}px`, { fontFamily: MONO, fontSize: '11px', color: HEX(C.white) }).setOrigin(0.5).setDepth(3));
    }

    // prompt card
    this.ui.push(this.add.rectangle(W / 2, 92, W - 40, 56, C.panel, 0.95).setStrokeStyle(2, C.cyan).setDepth(10));
    this.ui.push(this.add.text(W / 2, 76, `LEVEL ${lv.id} · ${lv.name}`, { fontFamily: MONO, fontSize: '15px', color: HEX(C.amber), fontStyle: 'bold' }).setOrigin(0.5).setDepth(11));
    this.ui.push(this.add.text(W / 2, 100, lv.prompt, { fontFamily: MONO, fontSize: '12px', color: HEX(C.white), align: 'center', wordWrap: { width: W - 80 } }).setOrigin(0.5).setDepth(11));

    this.drawChoices(lv);
  }

  private drawChoices(lv: Level) {
    const labelMap: Record<Find, string> = { r: 'SET RATE', t: 'SET COUNTDOWN', d: 'SELECT WAYPOINT' };
    this.ui.push(this.add.text(W / 2, H - 116, labelMap[lv.find], { fontFamily: MONO, fontSize: '12px', color: HEX(C.cyan) }).setOrigin(0.5).setDepth(11));
    const n = lv.choices.length;
    const bw = 150;
    const gap = 14;
    const total = n * bw + (n - 1) * gap;
    let x0 = (W - total) / 2 + bw / 2;
    lv.choices.forEach((val) => {
      const cx = x0;
      x0 += bw + gap;
      const rect = this.add.rectangle(cx, H - 78, bw, 46, C.panel, 1).setStrokeStyle(2, C.cyan).setDepth(11).setInteractive({ useHandCursor: true });
      const txt = this.add.text(cx, H - 78, `${val} ${lv.unit}`, { fontFamily: MONO, fontSize: '17px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);
      rect.on('pointerover', () => rect.setStrokeStyle(3, C.amber));
      rect.on('pointerout', () => rect.setStrokeStyle(2, C.cyan));
      rect.on('pointerdown', () => {
        if (this.phase !== 'prompt') return;
        this.chosen = val;
        this.launch(lv, val);
      });
      this.ui.push(rect, txt);
    });
  }

  // --- run a shot ------------------------------------------------------------
  private launch(lv: Level, val: number) {
    this.phase = 'run';
    this.clock = 0;
    this.clearUI();
    // re-draw static track bits quickly by restarting the static layer:
    // keep it simple — redraw ruler/targets via startLevel's graphics is gone, so
    // draw a minimal lane here.
    const g = this.add.graphics().setDepth(2);
    g.lineStyle(4, C.dim, 1).lineBetween(START_X, TRACK_Y + 22, this.screenX(1000), TRACK_Y + 22);
    this.ui.push(g);
    if (lv.find === 'd') {
      lv.choices.forEach((dch) => {
        const x = this.screenX(dch);
        this.ui.push(this.add.text(x, TRACK_Y - 18, '⚑', { fontFamily: MONO, fontSize: '22px', color: HEX(dch === val ? C.amber : C.dim) }).setOrigin(0.5).setDepth(3));
      });
    } else {
      const x = this.screenX(lv.dist);
      this.ui.push(this.add.rectangle(x, TRACK_Y, 4, 60, C.amber).setDepth(3));
    }

    const rate = lv.find === 'r' ? val : lv.rate;
    (this.car.body as Phaser.Physics.Arcade.Body).setVelocityX(rate * VIEW_SCALE);
    this.car.setData('rate', rate);
    this.car.setData('val', val);
  }

  private finishRun(lv: Level, val: number) {
    (this.car.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    this.phase = 'result';
    let correct = false;
    if (lv.find === 'r') correct = val === lv.rate;
    else if (lv.find === 't') correct = val === lv.time;
    else correct = val === lv.dist;

    this.showResult(lv, correct);
  }

  private showResult(lv: Level, correct: boolean) {
    const col = correct ? C.green : C.red;
    this.ui.push(this.add.rectangle(W / 2, H / 2, W - 80, 132, C.panel, 0.97).setStrokeStyle(3, col).setDepth(30));
    this.ui.push(
      this.add.text(W / 2, H / 2 - 42, correct ? '✔ LOCKED ON TARGET' : '✘ TRAJECTORY OFF', { fontFamily: MONO, fontSize: '20px', color: HEX(col), fontStyle: 'bold' }).setOrigin(0.5).setDepth(31),
    );
    this.ui.push(this.add.text(W / 2, H / 2 - 8, lv.formula, { fontFamily: MONO, fontSize: '16px', color: HEX(C.amber) }).setOrigin(0.5).setDepth(31));

    if (correct) {
      this.cleared += 1;
      this.ui.push(this.add.text(W / 2, H / 2 + 28, this.levelIdx >= LEVELS.length - 1 ? 'ALL SYSTEMS GO — tap to finish' : 'tap to continue ▶', { fontFamily: MONO, fontSize: '13px', color: HEX(C.white) }).setOrigin(0.5).setDepth(31));
      this.flashImpact(C.green);
    } else {
      this.ui.push(this.add.text(W / 2, H / 2 + 28, 'tap to recompute ▶', { fontFamily: MONO, fontSize: '13px', color: HEX(C.white) }).setOrigin(0.5).setDepth(31));
    }

    const advance = () => {
      this.input.off('pointerdown', advance);
      if (correct) {
        this.levelIdx += 1;
        if (this.levelIdx >= LEVELS.length) {
          this.onComplete(this.cleared);
          return;
        }
      }
      this.startLevel();
    };
    this.time.delayedCall(450, () => this.input.once('pointerdown', advance));
  }

  private flashImpact(color: number) {
    const burst = this.add.circle(this.car.x, this.car.y, 8, color, 0.8).setDepth(25);
    this.tweens.add({ targets: burst, radius: 70, alpha: 0, duration: 520, onComplete: () => burst.destroy() });
  }

  // --- frame loop ------------------------------------------------------------
  update(_t: number, deltaMs: number) {
    const lv = LEVELS[this.levelIdx];
    if (!lv) return;

    if (this.phase === 'run') {
      this.clock += deltaMs / 1000;
      const posPx = Math.max(0, (this.car.x - START_X) / VIEW_SCALE);

      if (lv.find === 'r' || lv.find === 'd') {
        // fixed time / fuel: stop when the clock runs out
        if (this.clock >= lv.time) {
          this.finishRun(lv, this.chosen);
        }
      } else {
        // find time: the car always crosses the finish; the countdown the player
        // set must hit zero exactly then.
        const countdownLeft = this.chosen - this.clock;
        if (posPx >= lv.dist) {
          this.finishRun(lv, this.chosen);
        } else if (countdownLeft <= 0) {
          // ran out of time before the finish
          this.finishRun(lv, this.chosen);
        }
      }
    }

    this.updateTelemetry(lv);
  }

  private updateTelemetry(lv: Level) {
    const body = this.car.body as Phaser.Physics.Arcade.Body | undefined;
    const posPx = Math.max(0, Math.round((this.car.x - START_X) / VIEW_SCALE));
    const vel = body ? Math.round(body.velocity.x / VIEW_SCALE) : 0;
    this.telemetry.setText(
      [
        `X  : ${String(posPx).padStart(4, ' ')} px`,
        `VEL: ${String(vel).padStart(4, ' ')} px/s`,
        `─────────────`,
        `d = r × t`,
      ].join('\n'),
    );

    let clockLine = `T : ${this.clock.toFixed(1)} s`;
    if (lv.find === 't' && this.phase === 'run') {
      clockLine = `COUNTDOWN: ${Math.max(0, this.chosen - this.clock).toFixed(1)} s`;
    }
    this.clockText.setText([clockLine, `LVL ${lv.id}/3`].join('\n'));

    // gauge needle
    const maxV = 220;
    const v = body ? Math.min(maxV, Math.abs(body.velocity.x / VIEW_SCALE)) : 0;
    const a = Phaser.Math.DegToRad(140 + (v / maxV) * 260);
    const gx = W - 80;
    const gy = H - 70;
    this.gaugeNeedle.clear().lineStyle(3, C.red, 1).lineBetween(gx, gy, gx + Math.cos(a) * 38, gy + Math.sin(a) * 38);
  }
}
