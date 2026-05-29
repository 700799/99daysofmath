import Phaser from 'phaser';
import {
  makeChallenge,
  type Challenge,
  type ChallengeDifficulty,
} from '../rewards/mathChallenge';
import { GRAND_PRIX_CONFIG, grandPrixPayout } from '../rewards/grandPrix';
import { MEDAL_EMOJI, medalForPlace } from '../rewards/economy';

export const PRIX_WIDTH = 420;
export const PRIX_HEIGHT = 460;

export interface PrixResult {
  place: number;
  payout: number;
}

export interface GrandPrixInit {
  difficulty: ChallengeDifficulty;
  onChallenge: (c: Challenge) => Promise<boolean>;
  onGameEnd: (r: PrixResult) => void;
}

const FONT = 'Nunito, system-ui, sans-serif';
const START_X = 74;
const FINISH_X = 372;

interface Kart {
  id: string;
  name: string;
  emoji: string;
  dist: number;
  speed: number;
  isPlayer: boolean;
  finished: boolean;
  place: number;
  y: number;
  node: Phaser.GameObjects.Container;
  placeText: Phaser.GameObjects.Text;
}

export class GrandPrixScene extends Phaser.Scene {
  private difficulty: ChallengeDifficulty = 2;
  private onChallenge!: GrandPrixInit['onChallenge'];
  private onGameEnd!: GrandPrixInit['onGameEnd'];

  private karts: Kart[] = [];
  private player!: Kart;
  private racing = false;
  private raceOver = false;
  private isDead = false;
  private nextPlace = 1;
  private hintText!: Phaser.GameObjects.Text;

  constructor() {
    super('GrandPrix');
  }

  init(data: GrandPrixInit) {
    this.difficulty = data.difficulty;
    this.onChallenge = data.onChallenge;
    this.onGameEnd = data.onGameEnd;
  }

  create() {
    this.isDead = false;
    this.raceOver = false;
    this.racing = false;
    this.nextPlace = 1;

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => (this.isDead = true));
    this.events.once(Phaser.Scenes.Events.DESTROY, () => (this.isDead = true));

    this.cameras.main.setBackgroundColor('#0f172a');
    this.drawTrack();
    this.buildKarts();

    this.hintText = this.add
      .text(PRIX_WIDTH / 2, PRIX_HEIGHT - 24, 'Get ready…', {
        fontFamily: FONT,
        fontSize: '15px',
        fontStyle: '900',
        color: '#e2e8f0',
      })
      .setOrigin(0.5);

    void this.countdown().then(() => {
      if (!this.dead()) this.start();
    });
  }

  // ---- setup -----------------------------------------------------------

  private laneYs(): number[] {
    return [150, 224, 298];
  }

  private drawTrack() {
    const W = PRIX_WIDTH;
    this.add
      .text(W / 2, 26, '🏁 Math Grand Prix', {
        fontFamily: FONT,
        fontSize: '20px',
        fontStyle: '900',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    const lanes = this.laneYs();
    const g = this.add.graphics();
    lanes.forEach((y, i) => {
      g.fillStyle(i % 2 === 0 ? 0x1e293b : 0x243244, 1);
      g.fillRoundedRect(40, y - 34, W - 80, 68, 14);
      // dashed center line
      g.lineStyle(3, 0x475569, 1);
      for (let x = START_X; x < FINISH_X; x += 26) {
        g.lineBetween(x, y, x + 12, y);
      }
    });

    // Start line
    const sg = this.add.graphics();
    sg.lineStyle(3, 0x94a3b8, 1);
    sg.lineBetween(START_X, 116, START_X, 332);

    // Finish line (checkered)
    const cell = 8;
    for (let r = 0; r < 27; r++) {
      for (let c = 0; c < 2; c++) {
        const black = (r + c) % 2 === 0;
        this.add
          .rectangle(FINISH_X + c * cell, 116 + r * cell, cell, cell, black ? 0x111827 : 0xffffff)
          .setOrigin(0, 0);
      }
    }
  }

  private buildKarts() {
    const lanes = this.laneYs();
    const [rivalA, rivalB] = GRAND_PRIX_CONFIG.rivals;
    const [speedA, speedB] = GRAND_PRIX_CONFIG.cpuSpeeds;

    const specs = [
      { id: 'turbo', name: rivalA.name, emoji: rivalA.emoji, isPlayer: false, speed: speedA, y: lanes[0] },
      { id: 'you', name: 'You', emoji: '🏎️', isPlayer: true, speed: 0, y: lanes[1] },
      { id: 'zoom', name: rivalB.name, emoji: rivalB.emoji, isPlayer: false, speed: speedB, y: lanes[2] },
    ];

    this.karts = specs.map((s) => {
      const node = this.add.container(START_X, s.y).setDepth(10);
      const face = this.add.text(0, 0, s.emoji, { fontFamily: FONT, fontSize: '30px' }).setOrigin(0.5);
      const tag = this.add
        .text(0, 22, s.name, {
          fontFamily: FONT,
          fontSize: '11px',
          fontStyle: '800',
          color: s.isPlayer ? '#fbbf24' : '#cbd5e1',
        })
        .setOrigin(0.5);
      node.add([face, tag]);
      const placeText = this.add
        .text(START_X, s.y - 30, '', { fontFamily: FONT, fontSize: '22px' })
        .setOrigin(0.5)
        .setDepth(11);
      return {
        ...s,
        dist: 0,
        finished: false,
        place: 0,
        node,
        placeText,
      } as Kart;
    });

    this.player = this.karts.find((k) => k.isPlayer)!;
  }

  // ---- race loop -------------------------------------------------------

  private async countdown() {
    const labels = ['3', '2', '1', 'GO!'];
    for (const l of labels) {
      if (this.dead()) return;
      const t = this.add
        .text(PRIX_WIDTH / 2, PRIX_HEIGHT / 2 - 10, l, {
          fontFamily: FONT,
          fontSize: '72px',
          fontStyle: '900',
          color: l === 'GO!' ? '#58CC02' : '#ffffff',
        })
        .setOrigin(0.5)
        .setDepth(60);
      t.setStroke('#0f172a', 8);
      this.tweens.add({
        targets: t,
        scale: { from: 0.4, to: 1.4 },
        alpha: { from: 1, to: 0 },
        duration: 640,
        ease: 'Cubic.easeOut',
        onComplete: () => t.destroy(),
      });
      await this.wait(600);
    }
  }

  private start() {
    this.racing = true;
    this.setHint('Solve to GO! ⚡');
    void this.askLoop();
  }

  update(_time: number, delta: number) {
    if (!this.racing) return;
    const dt = delta / 1000;
    for (const k of this.karts) {
      if (k.isPlayer || k.finished) continue;
      const jitter = 1 + (Math.random() * 2 - 1) * GRAND_PRIX_CONFIG.cpuJitter;
      k.dist += k.speed * dt * jitter;
      if (k.dist >= GRAND_PRIX_CONFIG.trackLength) {
        k.dist = GRAND_PRIX_CONFIG.trackLength;
        this.finishKart(k);
      }
      this.layoutKart(k);
    }
  }

  private async askLoop() {
    if (!this.racing || this.dead() || this.player.finished) return;
    const c = makeChallenge(this.difficulty);
    const ok = await this.onChallenge(c);
    if (this.dead() || !this.racing) return;

    if (ok) {
      this.player.dist = Math.min(
        GRAND_PRIX_CONFIG.trackLength,
        this.player.dist + GRAND_PRIX_CONFIG.boostPerCorrect,
      );
      this.floatText(this.player.node.x, this.player.y - 30, 'BOOST! ⚡', '#58CC02');
      this.lurch(this.player);
    } else {
      this.player.dist = Math.max(0, this.player.dist - GRAND_PRIX_CONFIG.penaltyPerWrong);
      this.floatText(this.player.node.x, this.player.y - 30, 'spin out', '#ff4b4b');
    }
    this.layoutKart(this.player);

    if (this.player.dist >= GRAND_PRIX_CONFIG.trackLength) {
      this.finishKart(this.player);
      return;
    }

    await this.wait(260);
    if (this.dead() || !this.racing) return;
    void this.askLoop();
  }

  private finishKart(k: Kart) {
    if (k.finished) return;
    k.finished = true;
    k.place = this.nextPlace++;
    k.placeText.setText(MEDAL_EMOJI[medalForPlace(k.place)]);
    this.tweens.add({ targets: k.node, scale: 1.25, duration: 200, yoyo: true });
    if (k.isPlayer) this.endRace();
  }

  // ---- helpers ---------------------------------------------------------

  private layoutKart(k: Kart) {
    const x = START_X + (k.dist / GRAND_PRIX_CONFIG.trackLength) * (FINISH_X - START_X);
    k.node.x = x;
    k.placeText.x = x;
  }

  private lurch(k: Kart) {
    this.tweens.add({ targets: k.node, x: `+=10`, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
  }

  private floatText(x: number, y: number, text: string, color: string) {
    const t = this.add
      .text(x, y, text, { fontFamily: FONT, fontSize: '16px', fontStyle: '900', color })
      .setOrigin(0.5)
      .setDepth(50);
    t.setStroke('#0f172a', 4);
    this.tweens.add({
      targets: t,
      y: y - 34,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.easeOut',
      onComplete: () => t.destroy(),
    });
  }

  private setHint(text: string) {
    this.hintText.setText(text);
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.time.delayedCall(ms, () => resolve());
    });
  }

  private dead(): boolean {
    return this.isDead || this.raceOver;
  }

  // ---- end -------------------------------------------------------------

  private endRace() {
    if (this.raceOver || this.isDead) return;
    this.raceOver = true;
    this.racing = false;

    const place = this.player.place || this.nextPlace;
    const payout = grandPrixPayout(place);
    this.onGameEnd({ place, payout });
    this.showEndScreen(place, payout);
  }

  private showEndScreen(place: number, payout: number) {
    const W = PRIX_WIDTH;
    const H = PRIX_HEIGHT;
    const won = place === 1;

    this.add.rectangle(W / 2, H / 2, W, H, 0x0f172a, 0.8).setDepth(100);
    const panel = this.add.container(W / 2, H / 2).setDepth(101);

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(-150, -140, 300, 280, 26);

    const title = this.add
      .text(0, -100, won ? 'Checkered Flag! 🏁' : `You placed P${place}`, {
        fontFamily: FONT,
        fontSize: '24px',
        fontStyle: '900',
        color: won ? '#FF9600' : '#475569',
      })
      .setOrigin(0.5);
    const medal = this.add
      .text(0, -42, MEDAL_EMOJI[medalForPlace(place)], { fontFamily: FONT, fontSize: '60px' })
      .setOrigin(0.5);
    const reward = this.add
      .text(0, 28, `+${payout} coins banked!`, {
        fontFamily: FONT,
        fontSize: '20px',
        fontStyle: '900',
        color: '#46A302',
      })
      .setOrigin(0.5);

    const again = this.makeButton(0, 96, 220, 58, '🔄 Race Again', 0xff9600, () => {
      this.scene.restart();
    });

    panel.add([bg, title, medal, reward, again]);
    panel.setScale(0.82);
    this.tweens.add({ targets: panel, scale: 1, duration: 320, ease: 'Back.easeOut' });
  }

  private makeButton(
    x: number,
    y: number,
    w: number,
    h: number,
    label: string,
    color: number,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    const darker = Phaser.Display.Color.IntegerToColor(color).darken(18).color;
    g.fillStyle(darker, 1);
    g.fillRoundedRect(-w / 2, -h / 2 + 5, w, h, 16);
    g.fillStyle(color, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
    const t = this.add
      .text(0, 0, label, { fontFamily: FONT, fontSize: '19px', fontStyle: '900', color: '#ffffff' })
      .setOrigin(0.5);
    c.add([g, t]);
    c.setSize(w, h);
    c.setInteractive({ useHandCursor: true });
    c.on('pointerover', () => this.tweens.add({ targets: c, scale: 1.05, duration: 100 }));
    c.on('pointerout', () => this.tweens.add({ targets: c, scale: 1, duration: 100 }));
    c.on('pointerdown', () =>
      this.tweens.add({ targets: c, scale: 0.94, duration: 70, yoyo: true, onComplete: onClick }),
    );
    return c;
  }
}
