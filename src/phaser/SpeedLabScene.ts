import Phaser from 'phaser';

// Speed Lab — a d = r × t driving lab with TEN themed scenarios (a biker, a
// turtle to its lettuce, a baby to a rattle, a boat to an island, a mama dino to
// her baby, a rocket to the Moon, a sumo to the sushi, a fish to a worm, a race
// car, a train). Numbers start SINGLE-DIGIT so the idea is obvious, then climb to
// TWO-DIGIT. Distances are whole "units" on a clearly numbered ruler, so the kid
// can count the blocks and SEE the formula come true.
//
// Layout is PORTRAIT (560×780) so Phaser's Scale.FIT scales the canvas UP to fill
// a phone screen — keeping the prompt, telemetry and answer chips large.

export interface SpeedLabInit {
  onComplete: (cleared: number) => void;
  onLevel?: (level: number) => void;
}

type Find = 'r' | 't' | 'd';
interface Level {
  id: number;
  name: string;
  hero: string; // emoji traveler
  goal: string; // emoji destination
  find: Find;
  dist: number; // units
  time: number; // s
  rate: number; // units/s
  choices: number[];
  unit: string;
  formula: string;
  prompt: string;
  max: number; // ruler max, in units
  minor: number; // minor tick step
  tick: number; // labelled tick step
}

const LEVELS: Level[] = [
  { id: 1, name: 'BIKER · FIND DISTANCE', hero: '🚴', goal: '🏁', find: 'd', dist: 6, time: 2, rate: 3, choices: [4, 6, 8, 9], unit: 'units', formula: 'd = r × t = 3 × 2 = 6', prompt: '🚴 A biker rides r = 3 units/s for t = 2 s.\nHow FAR to the finish?   d = r × t', max: 10, minor: 1, tick: 2 },
  { id: 2, name: 'TURTLE · FIND TIME', hero: '🐢', goal: '🥬', find: 't', dist: 8, time: 4, rate: 2, choices: [2, 3, 4, 5], unit: 's', formula: 't = d ÷ r = 8 ÷ 2 = 4', prompt: '🐢 The turtle crawls r = 2 units/s to lettuce d = 8 units away.\nHow LONG?   t = d ÷ r', max: 10, minor: 1, tick: 2 },
  { id: 3, name: 'BABY · FIND RATE', hero: '👶', goal: '🪇', find: 'r', dist: 6, time: 3, rate: 2, choices: [1, 2, 3, 4], unit: 'units/s', formula: 'r = d ÷ t = 6 ÷ 3 = 2', prompt: '👶 Baby scoots d = 6 units in t = 3 s to the rattle.\nHow FAST?   r = d ÷ t', max: 10, minor: 1, tick: 2 },
  { id: 4, name: 'BOAT · FIND DISTANCE', hero: '⛵', goal: '🏝️', find: 'd', dist: 8, time: 2, rate: 4, choices: [6, 8, 10, 12], unit: 'units', formula: 'd = r × t = 4 × 2 = 8', prompt: '⛵ A boat sails r = 4 units/s for t = 2 s.\nHow FAR to the island?   d = r × t', max: 12, minor: 2, tick: 4 },
  { id: 5, name: 'DINO MOM · FIND TIME', hero: '🦖', goal: '🦕', find: 't', dist: 40, time: 8, rate: 5, choices: [6, 7, 8, 9], unit: 's', formula: 't = d ÷ r = 40 ÷ 5 = 8', prompt: '🦖 Mama dino runs r = 5 units/s to her baby d = 40 units away.\nHow LONG?   t = d ÷ r', max: 50, minor: 10, tick: 10 },
  { id: 6, name: 'ROCKET · FIND DISTANCE', hero: '🚀', goal: '🌙', find: 'd', dist: 50, time: 5, rate: 10, choices: [30, 40, 50, 60], unit: 'units', formula: 'd = r × t = 10 × 5 = 50', prompt: '🚀 The rocket flies r = 10 units/s for t = 5 s.\nHow FAR to the Moon?   d = r × t', max: 60, minor: 10, tick: 20 },
  { id: 7, name: 'SUMO · FIND RATE', hero: '🤼', goal: '🍣', find: 'r', dist: 36, time: 6, rate: 6, choices: [4, 5, 6, 8], unit: 'units/s', formula: 'r = d ÷ t = 36 ÷ 6 = 6', prompt: '🤼 The sumo charges d = 36 units in t = 6 s to the sushi.\nHow FAST?   r = d ÷ t', max: 40, minor: 10, tick: 10 },
  { id: 8, name: 'FISH · FIND TIME', hero: '🐟', goal: '🪱', find: 't', dist: 60, time: 6, rate: 10, choices: [4, 5, 6, 8], unit: 's', formula: 't = d ÷ r = 60 ÷ 10 = 6', prompt: '🐟 The fish swims r = 10 units/s to a worm d = 60 units away.\nHow LONG?   t = d ÷ r', max: 60, minor: 10, tick: 20 },
  { id: 9, name: 'RACE CAR · FIND RATE', hero: '🏎️', goal: '🏁', find: 'r', dist: 60, time: 5, rate: 12, choices: [10, 12, 15, 20], unit: 'units/s', formula: 'r = d ÷ t = 60 ÷ 5 = 12', prompt: '🏎️ The race car covers d = 60 units in t = 5 s.\nHow FAST?   r = d ÷ t', max: 60, minor: 10, tick: 20 },
  { id: 10, name: 'TRAIN · FIND DISTANCE', hero: '🚆', goal: '🚉', find: 'd', dist: 80, time: 4, rate: 20, choices: [60, 70, 80, 90], unit: 'units', formula: 'd = r × t = 20 × 4 = 80', prompt: '🚆 A train travels r = 20 units/s for t = 4 s.\nHow FAR to the station?   d = r × t', max: 90, minor: 10, tick: 30 },
];

const W = 560;
const H = 780;
const START_X = 70;
const TRACK_Y = 384;
const MARGIN_R = 70;
const TRACK_PX = W - START_X - MARGIN_R;

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

const GX = W - 64;
const GY = 250;
const GR = 38;

export class SpeedLabScene extends Phaser.Scene {
  private onComplete!: (cleared: number) => void;
  private onLevel?: (level: number) => void;

  private levelIdx = 0;
  private cleared = 0;
  private phase: 'prompt' | 'run' | 'result' = 'prompt';
  private clock = 0;
  private chosen = 0;
  private heroUnits = 0;
  private runRate = 0;
  private pxPerUnit = TRACK_PX / 10;
  private gaugeMax = 5;
  private hero!: Phaser.GameObjects.Text;
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
    this.drawChrome();

    this.hero = this.add.text(START_X, TRACK_Y, '🚴', { fontSize: '42px' }).setOrigin(0.5).setDepth(6);
    this.telemetry = this.add.text(18, 188, '', { fontFamily: MONO, fontSize: '22px', color: HEX(C.cyan), lineSpacing: 6, fontStyle: 'bold' }).setDepth(20);
    this.clockText = this.add.text(W - 18, 188, '', { fontFamily: MONO, fontSize: '20px', color: HEX(C.amber), align: 'right', fontStyle: 'bold' }).setOrigin(1, 0).setDepth(20);

    this.startLevel();
  }

  private drawChrome() {
    this.add.rectangle(0, 0, W, H, C.bg).setOrigin(0);
    const g = this.add.graphics();
    g.lineStyle(1, C.grid, 0.5);
    for (let x = 0; x <= W; x += 40) g.lineBetween(x, 0, x, H);
    for (let y = 0; y <= H; y += 40) g.lineBetween(0, y, W, y);
    g.fillStyle(C.panel, 1).fillRect(0, 0, W, 52);
    g.lineStyle(2, C.cyan, 0.7).lineBetween(0, 52, W, 52);
    g.fillStyle(C.red, 1).fillRect(0, 0, 10, 52);
    this.add.text(24, 14, 'SPEED LAB', { fontFamily: MONO, fontSize: '24px', color: HEX(C.white), fontStyle: 'bold' });
    this.add.text(W - 16, 19, 'd = r × t', { fontFamily: MONO, fontSize: '16px', color: HEX(C.amber) }).setOrigin(1, 0);

    const gg = this.add.graphics().setDepth(15);
    gg.lineStyle(7, C.grid, 1).beginPath();
    gg.arc(GX, GY, GR, Phaser.Math.DegToRad(140), Phaser.Math.DegToRad(40), false);
    gg.strokePath();
    gg.lineStyle(2, C.cyan, 0.8).beginPath();
    gg.arc(GX, GY, GR, Phaser.Math.DegToRad(140), Phaser.Math.DegToRad(40), false);
    gg.strokePath();
    this.add.text(GX, GY + 20, 'VEL', { fontFamily: MONO, fontSize: '12px', color: HEX(C.dim) }).setOrigin(0.5).setDepth(15);
    this.gaugeNeedle = this.add.graphics().setDepth(16);
  }

  private clearUI() {
    this.ui.forEach((o) => o.destroy());
    this.ui = [];
  }

  private screenX(units: number) {
    return START_X + units * this.pxPerUnit;
  }

  private drawTrack(g: Phaser.GameObjects.Graphics, lv: Level) {
    g.lineStyle(5, C.dim, 1).lineBetween(START_X, TRACK_Y + 26, this.screenX(lv.max), TRACK_Y + 26);
    g.lineStyle(1, C.grid, 1);
    for (let u = 0; u <= lv.max; u += lv.minor) {
      const x = this.screenX(u);
      g.lineBetween(x, TRACK_Y + 20, x, TRACK_Y + 32);
    }
    g.lineStyle(2, C.cyan, 0.9);
    for (let u = 0; u <= lv.max; u += lv.tick) {
      const x = this.screenX(u);
      g.lineBetween(x, TRACK_Y + 16, x, TRACK_Y + 36);
      this.ui.push(this.add.text(x, TRACK_Y + 42, String(u), { fontFamily: MONO, fontSize: '14px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(2));
    }
    this.ui.push(this.add.text(this.screenX(lv.max / 2), TRACK_Y + 62, 'distance (units)', { fontFamily: MONO, fontSize: '12px', color: HEX(C.dim) }).setOrigin(0.5).setDepth(2));
  }

  private drawTargets(lv: Level, chosenVal?: number) {
    if (lv.find === 'd') {
      // waypoint flags at each choice distance (answer is the distance, so the
      // destination emoji stays in the prompt, not on the track)
      lv.choices.forEach((dch) => {
        const x = this.screenX(dch);
        const lit = chosenVal === undefined ? dch === lv.dist : dch === chosenVal;
        this.ui.push(this.add.text(x, TRACK_Y - 20, '⚑', { fontFamily: MONO, fontSize: '24px', color: HEX(lit ? C.amber : C.dim) }).setOrigin(0.5).setDepth(3));
        this.ui.push(this.add.text(x, TRACK_Y - 44, `${dch}`, { fontFamily: MONO, fontSize: '13px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(3));
      });
    } else {
      const x = this.screenX(lv.dist);
      this.ui.push(this.add.text(x, TRACK_Y - 18, lv.goal, { fontSize: '30px' }).setOrigin(0.5).setDepth(3));
      this.ui.push(this.add.text(x, TRACK_Y - 44, `${lv.dist} units`, { fontFamily: MONO, fontSize: '13px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(3));
    }
  }

  private startLevel() {
    const lv = LEVELS[this.levelIdx];
    this.onLevel?.(lv.id);
    this.pxPerUnit = TRACK_PX / lv.max;
    this.gaugeMax = (lv.find === 'r' ? Math.max(...lv.choices) : lv.rate) * 1.3;
    this.phase = 'prompt';
    this.clock = 0;
    this.chosen = 0;
    this.heroUnits = 0;
    this.runRate = 0;
    this.clearUI();

    this.hero.setText(lv.hero).setPosition(START_X, TRACK_Y);

    const g = this.add.graphics().setDepth(2);
    this.drawTrack(g, lv);
    this.ui.push(g);
    this.ui.push(this.add.text(START_X, TRACK_Y - 32, '▌START', { fontFamily: MONO, fontSize: '13px', color: HEX(C.green) }).setOrigin(0, 0.5).setDepth(3));
    this.drawTargets(lv);

    // prompt card
    this.ui.push(this.add.rectangle(W / 2, 96, W - 24, 84, C.panel, 0.95).setStrokeStyle(2, C.cyan).setDepth(10));
    this.ui.push(this.add.text(W / 2, 72, `LEVEL ${lv.id}/10 · ${lv.name}`, { fontFamily: MONO, fontSize: '15px', color: HEX(C.amber), fontStyle: 'bold' }).setOrigin(0.5).setDepth(11));
    this.ui.push(this.add.text(W / 2, 104, lv.prompt, { fontFamily: MONO, fontSize: '14px', color: HEX(C.white), align: 'center', lineSpacing: 3, wordWrap: { width: W - 56 } }).setOrigin(0.5).setDepth(11));

    this.drawChoices(lv);
  }

  private drawChoices(lv: Level) {
    const labelMap: Record<Find, string> = { r: 'SET THE RATE', t: 'SET THE TIME', d: 'PICK THE DISTANCE' };
    this.ui.push(this.add.text(W / 2, 498, labelMap[lv.find], { fontFamily: MONO, fontSize: '15px', color: HEX(C.cyan), fontStyle: 'bold' }).setOrigin(0.5).setDepth(11));
    const cols = 2;
    const bw = 238;
    const bh = 62;
    const gapX = 18;
    const gapY = 16;
    const gridW = cols * bw + gapX;
    const x0 = (W - gridW) / 2 + bw / 2;
    const y0 = 548;
    lv.choices.forEach((val, i) => {
      const colIdx = i % cols;
      const row = Math.floor(i / cols);
      const cx = x0 + colIdx * (bw + gapX);
      const cy = y0 + row * (bh + gapY);
      const rect = this.add.rectangle(cx, cy, bw, bh, C.panel, 1).setStrokeStyle(2, C.cyan).setDepth(11).setInteractive({ useHandCursor: true });
      const txt = this.add.text(cx, cy, `${val} ${lv.unit}`, { fontFamily: MONO, fontSize: '22px', color: HEX(C.white), fontStyle: 'bold' }).setOrigin(0.5).setDepth(12);
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

  private launch(lv: Level, val: number) {
    this.phase = 'run';
    this.clock = 0;
    this.heroUnits = 0;
    this.runRate = lv.find === 'r' ? val : lv.rate;
    this.clearUI();
    const g = this.add.graphics().setDepth(2);
    this.drawTrack(g, lv);
    this.ui.push(g);
    this.drawTargets(lv, val);
    this.hero.setPosition(START_X, TRACK_Y);
  }

  private finishRun(lv: Level, val: number) {
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
    this.ui.push(this.add.text(W / 2, H / 2 - 46, correct ? `✔ ${lv.hero} REACHED ${lv.goal}` : '✘ TRAJECTORY OFF', { fontFamily: MONO, fontSize: '19px', color: HEX(col), fontStyle: 'bold' }).setOrigin(0.5).setDepth(31));
    this.ui.push(this.add.text(W / 2, H / 2 - 6, lv.formula, { fontFamily: MONO, fontSize: '18px', color: HEX(C.amber), fontStyle: 'bold' }).setOrigin(0.5).setDepth(31));
    const last = this.levelIdx >= LEVELS.length - 1;
    if (correct) {
      this.cleared += 1;
      this.ui.push(this.add.text(W / 2, H / 2 + 34, last ? 'ALL 10 CLEARED — tap to finish' : 'tap to continue ▶', { fontFamily: MONO, fontSize: '14px', color: HEX(C.white) }).setOrigin(0.5).setDepth(31));
      this.flashImpact(C.green);
    } else {
      this.ui.push(this.add.text(W / 2, H / 2 + 34, 'tap to recompute ▶', { fontFamily: MONO, fontSize: '14px', color: HEX(C.white) }).setOrigin(0.5).setDepth(31));
    }
    const advance = () => {
      this.input.off('pointerdown', advance);
      if (correct) {
        this.levelIdx += 1;
        if (this.levelIdx >= LEVELS.length) { this.onComplete(this.cleared); return; }
      }
      this.startLevel();
    };
    this.time.delayedCall(450, () => this.input.once('pointerdown', advance));
  }

  private flashImpact(color: number) {
    const burst = this.add.circle(this.hero.x, this.hero.y, 8, color, 0.8).setDepth(25);
    this.tweens.add({ targets: burst, radius: 70, alpha: 0, duration: 520, onComplete: () => burst.destroy() });
  }

  update(_t: number, deltaMs: number) {
    const lv = LEVELS[this.levelIdx];
    if (!lv) return;

    if (this.phase === 'run') {
      const dt = deltaMs / 1000;
      this.clock += dt;
      this.heroUnits = Math.min(lv.max, this.heroUnits + this.runRate * dt);
      this.hero.setX(this.screenX(this.heroUnits));
      this.hero.setY(TRACK_Y + Math.sin(this.clock * 12) * 2); // little bob

      if (lv.find === 'r' || lv.find === 'd') {
        if (this.clock >= lv.time) this.finishRun(lv, this.chosen);
      } else {
        const countdownLeft = this.chosen - this.clock;
        if (this.heroUnits >= lv.dist || countdownLeft <= 0) this.finishRun(lv, this.chosen);
      }
    }

    this.updateTelemetry(lv);
  }

  private updateTelemetry(lv: Level) {
    const posUnits = Math.round(this.heroUnits);
    const velUnits = this.phase === 'run' ? Math.round(this.runRate) : 0;
    this.telemetry.setText([`DIST:${String(posUnits).padStart(3, ' ')}`, `SPD :${String(velUnits).padStart(3, ' ')}/s`].join('\n'));

    let clockLine = `T:${this.clock.toFixed(1)}s`;
    if (lv.find === 't' && this.phase === 'run') clockLine = `⏱${Math.max(0, this.chosen - this.clock).toFixed(1)}s`;
    this.clockText.setText([clockLine, `LVL ${lv.id}/10`].join('\n'));

    const v = Math.min(this.gaugeMax, Math.abs(velUnits));
    const a = Phaser.Math.DegToRad(140 + (v / this.gaugeMax) * 260);
    this.gaugeNeedle.clear().lineStyle(3, C.red, 1).lineBetween(GX, GY, GX + Math.cos(a) * (GR - 6), GY + Math.sin(a) * (GR - 6));
  }
}
