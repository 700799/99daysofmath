import Phaser from 'phaser';

// Speed Lab — an "Aerospace Syllabus" driving simulator that teaches d = r × t.
// Numbers start SINGLE-DIGIT so the idea is obvious, then step up to TWO-DIGIT.
// Distances are whole "units" shown on a clearly numbered ruler, so you can count
// the blocks and SEE d = r × t come true. Runs on Arcade Physics.
//
// Layout is PORTRAIT (560×780) so Phaser's Scale.FIT scales the canvas UP to fill
// a phone screen — making the telemetry, prompt and answer chips large and legible.

export interface SpeedLabInit {
  onComplete: (cleared: number) => void;
  onLevel?: (level: number) => void;
}

type Find = 'r' | 't' | 'd';
interface Level {
  id: number;
  name: string;
  find: Find;
  dist: number; // units
  time: number; // s
  rate: number; // units/s
  choices: number[];
  unit: string;
  formula: string; // worked solution
  prompt: string;
  max: number; // ruler max, in units
  minor: number; // minor tick step (units)
  tick: number; // labelled tick step (units)
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: 'FIND DISTANCE',
    find: 'd',
    dist: 6,
    time: 3,
    rate: 2,
    choices: [4, 6, 8, 9],
    unit: 'units',
    formula: 'd = r × t = 2 × 3 = 6',
    prompt: 'Drive r = 2 units/s for t = 3 s.\nHow FAR do you go?   d = r × t',
    max: 10,
    minor: 1,
    tick: 2,
  },
  {
    id: 2,
    name: 'FIND TIME',
    find: 't',
    dist: 8,
    time: 4,
    rate: 2,
    choices: [2, 3, 4, 5],
    unit: 's',
    formula: 't = d ÷ r = 8 ÷ 2 = 4',
    prompt: 'Travel d = 8 units at r = 2 units/s.\nHow LONG does it take?   t = d ÷ r',
    max: 10,
    minor: 1,
    tick: 2,
  },
  {
    id: 3,
    name: 'FIND RATE',
    find: 'r',
    dist: 40,
    time: 4,
    rate: 10,
    choices: [5, 8, 10, 12],
    unit: 'units/s',
    formula: 'r = d ÷ t = 40 ÷ 4 = 10',
    prompt: 'Cover d = 40 units in t = 4 s.\nHow FAST? (two-digit)   r = d ÷ t',
    max: 50,
    minor: 10,
    tick: 10,
  },
];

const W = 560;
const H = 780;
const START_X = 70;
const TRACK_Y = 372;
const MARGIN_R = 70;
const TRACK_PX = W - START_X - MARGIN_R; // pixels the ruler spans

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

// gauge position (top-right dashboard, under the header)
const GX = W - 64;
const GY = 250;
const GR = 38;

export class SpeedLabScene extends Phaser.Scene {
  private onComplete!: (cleared: number) => void;
  private onLevel?: (level: number) => void;

  private levelIdx = 0;
  private cleared = 0;
  private phase: 'select' | 'prompt' | 'run' | 'result' = 'select';
  private clock = 0;
  private chosen = 0;
  private pxPerUnit = TRACK_PX / 10;
  private gaugeMax = 5;
  private car!: Phaser.Physics.Arcade.Image;
  private idleTween?: Phaser.Tweens.Tween;
  private ui: Phaser.GameObjects.GameObject[] = [];
  private telemetry!: Phaser.GameObjects.Text;
  private clockText!: Phaser.GameObjects.Text;
  private gaugeNeedle!: Phaser.GameObjects.Graphics;
  private gaugeArc!: Phaser.GameObjects.Graphics;
  private gaugeLabel!: Phaser.GameObjects.Text;

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
    this.car.setDepth(5).setDisplaySize(66, 40).setVisible(false);
    (this.car.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // live telemetry panel (big, top-left)
    this.telemetry = this.add
      .text(18, 178, '', { fontFamily: MONO, fontSize: '22px', color: HEX(C.cyan), lineSpacing: 6, fontStyle: 'bold' })
      .setDepth(20);
    this.clockText = this.add
      .text(W - 18, 178, '', { fontFamily: MONO, fontSize: '20px', color: HEX(C.amber), align: 'right', fontStyle: 'bold' })
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
    this.gaugeNeedle.clear();
    this.gaugeArc.setVisible(false);
    this.gaugeLabel.setVisible(false);
    const vehicles = [
      { key: 'sl-car', label: 'KEI CAR' },
      { key: 'sl-boat', label: 'BOAT' },
      { key: 'sl-rocket', label: 'ROCKET' },
      { key: 'sl-plane', label: 'JET' },
      { key: 'sl-tiger', label: 'TIGER' },
    ];
    this.ui.push(
      this.add
        .text(W / 2, 100, 'SELECT YOUR VEHICLE', { fontFamily: MONO, fontSize: '22px', color: HEX(C.amber), fontStyle: 'bold' })
        .setOrigin(0.5)
        .setDepth(11),
    );
    this.ui.push(
      this.add
        .text(W / 2, 128, '乗り物をえらぶ', { fontFamily: MONO, fontSize: '14px', color: HEX(C.dim) })
        .setOrigin(0.5)
        .setDepth(11),
    );

    const n = vehicles.length;
    const cols = 3;
    const cw = 158;
    const ch = 150;
    const gap = 16;
    vehicles.forEach((v, i) => {
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, n - row * cols);
      const colIdx = i % cols;
      const rowW = inRow * cw + (inRow - 1) * gap;
      const startX = (W - rowW) / 2 + cw / 2;
      const cx = startX + colIdx * (cw + gap);
      const cy = 230 + row * (ch + 18);
      const rect = this.add.rectangle(cx, cy, cw, ch, C.panel, 1).setStrokeStyle(2, C.cyan).setDepth(11).setInteractive({ useHandCursor: true });
      const img = this.add.image(cx, cy - 22, v.key).setDisplaySize(108, 64).setDepth(12);
      const lbl = this.add.text(cx, cy + 46, v.label, { fontFamily: MONO, fontSize: '16px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);
      this.tweens.add({ targets: img, angle: { from: -4, to: 4 }, yoyo: true, repeat: -1, duration: 700, ease: 'sine.inOut' });
      rect.on('pointerover', () => rect.setStrokeStyle(3, C.amber));
      rect.on('pointerout', () => rect.setStrokeStyle(2, C.cyan));
      rect.on('pointerdown', () => {
        if (this.phase !== 'select') return;
        this.car.setTexture(v.key).setDisplaySize(66, 40).setVisible(true);
        this.idleTween?.stop();
        this.car.setAngle(0);
        this.idleTween = this.tweens.add({ targets: this.car, angle: { from: -3, to: 3 }, yoyo: true, repeat: -1, duration: 520, ease: 'sine.inOut' });
        this.startLevel();
      });
      this.ui.push(rect, img, lbl);
    });
  }

  // --- static chrome (title, header, gauge) ----------------------------------
  private drawChrome() {
    this.add.rectangle(0, 0, W, H, C.bg).setOrigin(0);
    const g = this.add.graphics();
    // faint instrument grid
    g.lineStyle(1, C.grid, 0.5);
    for (let x = 0; x <= W; x += 40) g.lineBetween(x, 0, x, H);
    for (let y = 0; y <= H; y += 40) g.lineBetween(0, y, W, y);
    // header band
    g.fillStyle(C.panel, 1).fillRect(0, 0, W, 52);
    g.lineStyle(2, C.cyan, 0.7).lineBetween(0, 52, W, 52);
    // Japanese-bold accent tab
    g.fillStyle(C.red, 1).fillRect(0, 0, 10, 52);
    this.add.text(24, 14, 'SPEED LAB', { fontFamily: MONO, fontSize: '24px', color: HEX(C.white), fontStyle: 'bold' });
    this.add.text(W - 16, 19, 'd = r × t', { fontFamily: MONO, fontSize: '16px', color: HEX(C.amber) }).setOrigin(1, 0);

    // velocity gauge (top-right dashboard) — hidden on the vehicle-select screen
    const gg = this.add.graphics().setDepth(15);
    gg.lineStyle(7, C.grid, 1).beginPath();
    gg.arc(GX, GY, GR, Phaser.Math.DegToRad(140), Phaser.Math.DegToRad(40), false);
    gg.strokePath();
    gg.lineStyle(2, C.cyan, 0.8).beginPath();
    gg.arc(GX, GY, GR, Phaser.Math.DegToRad(140), Phaser.Math.DegToRad(40), false);
    gg.strokePath();
    this.gaugeArc = gg;
    this.gaugeLabel = this.add.text(GX, GY + 20, 'VEL', { fontFamily: MONO, fontSize: '12px', color: HEX(C.dim) }).setOrigin(0.5).setDepth(15);
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

  private screenX(units: number) {
    return START_X + units * this.pxPerUnit;
  }

  private drawTrack(g: Phaser.GameObjects.Graphics, lv: Level) {
    g.lineStyle(5, C.dim, 1).lineBetween(START_X, TRACK_Y + 26, this.screenX(lv.max), TRACK_Y + 26);
    // minor unit ticks — so single units are countable
    g.lineStyle(1, C.grid, 1);
    for (let u = 0; u <= lv.max; u += lv.minor) {
      const x = this.screenX(u);
      g.lineBetween(x, TRACK_Y + 20, x, TRACK_Y + 32);
    }
    // labelled ticks (bigger) + numbers
    g.lineStyle(2, C.cyan, 0.9);
    for (let u = 0; u <= lv.max; u += lv.tick) {
      const x = this.screenX(u);
      g.lineBetween(x, TRACK_Y + 16, x, TRACK_Y + 36);
      this.ui.push(
        this.add.text(x, TRACK_Y + 42, String(u), { fontFamily: MONO, fontSize: '14px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(2),
      );
    }
    this.ui.push(this.add.text(this.screenX(lv.max / 2), TRACK_Y + 62, 'distance (units)', { fontFamily: MONO, fontSize: '12px', color: HEX(C.dim) }).setOrigin(0.5).setDepth(2));
  }

  private startLevel() {
    const lv = LEVELS[this.levelIdx];
    this.onLevel?.(lv.id);
    this.pxPerUnit = TRACK_PX / lv.max;
    this.gaugeMax = (lv.find === 'r' ? Math.max(...lv.choices) : lv.rate) * 1.3;
    this.telemetry.setVisible(true);
    this.clockText.setVisible(true);
    this.gaugeArc.setVisible(true);
    this.gaugeLabel.setVisible(true);
    this.phase = 'prompt';
    this.clock = 0;
    this.chosen = 0;
    this.clearUI();

    this.car.setPosition(START_X, TRACK_Y);
    (this.car.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

    // track line + ruler
    const g = this.add.graphics().setDepth(2);
    this.drawTrack(g, lv);
    this.ui.push(g);

    // start flag
    this.ui.push(this.add.text(START_X, TRACK_Y - 32, '▌START', { fontFamily: MONO, fontSize: '13px', color: HEX(C.green) }).setOrigin(0, 0.5).setDepth(3));

    // targets per level
    if (lv.find === 'd') {
      // waypoint flags at each choice distance
      lv.choices.forEach((dch) => {
        const x = this.screenX(dch);
        const flag = this.add.text(x, TRACK_Y - 20, '⚑', { fontFamily: MONO, fontSize: '24px', color: HEX(dch === lv.dist ? C.amber : C.dim) }).setOrigin(0.5).setDepth(3);
        this.ui.push(flag);
        this.ui.push(this.add.text(x, TRACK_Y - 44, `${dch}`, { fontFamily: MONO, fontSize: '13px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(3));
      });
    } else {
      // single checkpoint/finish at the level distance
      const x = this.screenX(lv.dist);
      this.ui.push(this.add.rectangle(x, TRACK_Y, 4, 64, C.amber).setDepth(3));
      this.ui.push(this.add.text(x, TRACK_Y - 38, lv.find === 'r' ? 'CHECKPOINT' : 'FINISH', { fontFamily: MONO, fontSize: '12px', color: HEX(C.amber) }).setOrigin(0.5).setDepth(3));
      this.ui.push(this.add.text(x, TRACK_Y - 56, `${lv.dist} units`, { fontFamily: MONO, fontSize: '13px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(3));
    }

    // prompt card (below the header, above the telemetry)
    this.ui.push(this.add.rectangle(W / 2, 96, W - 24, 80, C.panel, 0.95).setStrokeStyle(2, C.cyan).setDepth(10));
    this.ui.push(this.add.text(W / 2, 74, `LEVEL ${lv.id} · ${lv.name}`, { fontFamily: MONO, fontSize: '17px', color: HEX(C.amber), fontStyle: 'bold' }).setOrigin(0.5).setDepth(11));
    this.ui.push(this.add.text(W / 2, 104, lv.prompt, { fontFamily: MONO, fontSize: '14px', color: HEX(C.white), align: 'center', lineSpacing: 3, wordWrap: { width: W - 56 } }).setOrigin(0.5).setDepth(11));

    this.drawChoices(lv);
  }

  private drawChoices(lv: Level) {
    const labelMap: Record<Find, string> = { r: 'SET THE RATE', t: 'SET THE TIME', d: 'PICK THE DISTANCE' };
    this.ui.push(this.add.text(W / 2, 488, labelMap[lv.find], { fontFamily: MONO, fontSize: '15px', color: HEX(C.cyan), fontStyle: 'bold' }).setOrigin(0.5).setDepth(11));
    // 2×2 grid of large chips
    const cols = 2;
    const bw = 238;
    const bh = 64;
    const gapX = 18;
    const gapY = 18;
    const gridW = cols * bw + gapX;
    const x0 = (W - gridW) / 2 + bw / 2;
    const y0 = 542;
    lv.choices.forEach((val, i) => {
      const colIdx = i % cols;
      const row = Math.floor(i / cols);
      const cx = x0 + colIdx * (bw + gapX);
      const cy = y0 + row * (bh + gapY);
      const rect = this.add.rectangle(cx, cy, bw, bh, C.panel, 1).setStrokeStyle(2, C.cyan).setDepth(11).setInteractive({ useHandCursor: true });
      const txt = this.add.text(cx, cy, `${val} ${lv.unit}`, { fontFamily: MONO, fontSize: '23px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);
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
    // minimal lane + targets for the run
    const g = this.add.graphics().setDepth(2);
    this.drawTrack(g, lv);
    this.ui.push(g);
    if (lv.find === 'd') {
      lv.choices.forEach((dch) => {
        const x = this.screenX(dch);
        this.ui.push(this.add.text(x, TRACK_Y - 20, '⚑', { fontFamily: MONO, fontSize: '24px', color: HEX(dch === val ? C.amber : C.dim) }).setOrigin(0.5).setDepth(3));
      });
    } else {
      const x = this.screenX(lv.dist);
      this.ui.push(this.add.rectangle(x, TRACK_Y, 4, 64, C.amber).setDepth(3));
    }

    const rate = lv.find === 'r' ? val : lv.rate;
    (this.car.body as Phaser.Physics.Arcade.Body).setVelocityX(rate * this.pxPerUnit);
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
    this.ui.push(this.add.rectangle(W / 2, H / 2, W - 56, 150, C.panel, 0.97).setStrokeStyle(3, col).setDepth(30));
    this.ui.push(
      this.add.text(W / 2, H / 2 - 46, correct ? '✔ LOCKED ON TARGET' : '✘ TRAJECTORY OFF', { fontFamily: MONO, fontSize: '21px', color: HEX(col), fontStyle: 'bold' }).setOrigin(0.5).setDepth(31),
    );
    this.ui.push(this.add.text(W / 2, H / 2 - 6, lv.formula, { fontFamily: MONO, fontSize: '18px', color: HEX(C.amber), fontStyle: 'bold' }).setOrigin(0.5).setDepth(31));

    if (correct) {
      this.cleared += 1;
      this.ui.push(this.add.text(W / 2, H / 2 + 34, this.levelIdx >= LEVELS.length - 1 ? 'ALL SYSTEMS GO — tap to finish' : 'tap to continue ▶', { fontFamily: MONO, fontSize: '14px', color: HEX(C.white) }).setOrigin(0.5).setDepth(31));
      this.flashImpact(C.green);
    } else {
      this.ui.push(this.add.text(W / 2, H / 2 + 34, 'tap to recompute ▶', { fontFamily: MONO, fontSize: '14px', color: HEX(C.white) }).setOrigin(0.5).setDepth(31));
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
      const posUnits = Math.max(0, (this.car.x - START_X) / this.pxPerUnit);

      if (lv.find === 'r' || lv.find === 'd') {
        // fixed time / fuel: stop when the clock runs out
        if (this.clock >= lv.time) {
          this.finishRun(lv, this.chosen);
        }
      } else {
        // find time: the car always crosses the finish; the countdown the player
        // set must hit zero exactly then.
        const countdownLeft = this.chosen - this.clock;
        if (posUnits >= lv.dist) {
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
    const posUnits = Math.max(0, Math.round((this.car.x - START_X) / this.pxPerUnit));
    const velUnits = body ? Math.round(body.velocity.x / this.pxPerUnit) : 0;
    this.telemetry.setText(
      [
        `DIST:${String(posUnits).padStart(3, ' ')}`,
        `SPD :${String(velUnits).padStart(3, ' ')}/s`,
      ].join('\n'),
    );

    let clockLine = `T:${this.clock.toFixed(1)}s`;
    if (lv.find === 't' && this.phase === 'run') {
      clockLine = `⏱${Math.max(0, this.chosen - this.clock).toFixed(1)}s`;
    }
    this.clockText.setText([clockLine, `LVL ${lv.id}/3`].join('\n'));

    // gauge needle
    const v = body ? Math.min(this.gaugeMax, Math.abs(body.velocity.x / this.pxPerUnit)) : 0;
    const a = Phaser.Math.DegToRad(140 + (v / this.gaugeMax) * 260);
    this.gaugeNeedle.clear().lineStyle(3, C.red, 1).lineBetween(GX, GY, GX + Math.cos(a) * (GR - 6), GY + Math.sin(a) * (GR - 6));
  }
}
