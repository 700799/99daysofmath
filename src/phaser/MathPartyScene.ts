import Phaser from 'phaser';
import {
  makeChallenge,
  type Challenge,
  type ChallengeDifficulty,
} from '../rewards/mathChallenge';
import {
  BOARD,
  DICE_PIPS,
  PARTY_CONFIG,
  TILE_STYLES,
  makePlayers,
  rollDie,
  advancePos,
  resolveEvent,
  cpuAnswersCorrectly,
  placeOf,
  partyPayout,
  type PartyPlayer,
} from '../rewards/partyBoard';
import { MEDAL_ICONS, medalForPlace } from '../rewards/economy';
import { loadIconTextures } from '../icons/phaserTextures';

export const PARTY_WIDTH = 420;
export const PARTY_HEIGHT = 640;

export interface PartyResult {
  youStars: number;
  youCoins: number;
  rivalStars: number;
  rivalCoins: number;
  place: number;
  payout: number;
}

export interface MathPartyInit {
  difficulty: ChallengeDifficulty;
  /** Resolves true if the player answered the math tile correctly. */
  onChallenge: (c: Challenge) => Promise<boolean>;
  onGameEnd: (r: PartyResult) => void;
}

type PlayerId = PartyPlayer['id'];

const FONT = 'Nunito, system-ui, sans-serif';
const BOARD_CX = PARTY_WIDTH / 2;
const BOARD_CY = 232;
const BOARD_RX = 152;
const BOARD_RY = 158;
const TILE_R = 16;
/** DICE_PIPS offsets are on a ±10 grid; scale up for the 60px die face. */
const PIP_SCALE = 1.4;

export class MathPartyScene extends Phaser.Scene {
  private difficulty: ChallengeDifficulty = 2;
  private onChallenge!: MathPartyInit['onChallenge'];
  private onGameEnd!: MathPartyInit['onGameEnd'];

  private players: PartyPlayer[] = [];
  private activeIndex = 0;
  private round = 1;
  private busy = false;
  private canRoll = false;
  private isDead = false;
  private gameOver = false;

  private tilePos: { x: number; y: number }[] = [];
  private tokens!: Record<PlayerId, Phaser.GameObjects.Container>;
  private diceBox!: Phaser.GameObjects.Container;
  private diceFace!: Phaser.GameObjects.Graphics;
  private roundText!: Phaser.GameObjects.Text;
  private activeText!: Phaser.GameObjects.Text;
  private scoreTexts!: Record<PlayerId, { coins: Phaser.GameObjects.Text; stars: Phaser.GameObjects.Text }>;
  private hintText!: Phaser.GameObjects.Text;
  private rollBtn!: Phaser.GameObjects.Container;

  constructor() {
    super('MathParty');
  }

  init(data: MathPartyInit) {
    this.difficulty = data.difficulty;
    this.onChallenge = data.onChallenge;
    this.onGameEnd = data.onGameEnd;
  }

  async create() {
    this.isDead = false;
    this.gameOver = false;
    this.busy = false;
    this.canRoll = false;
    this.activeIndex = 0;
    this.round = 1;
    this.players = makePlayers();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => (this.isDead = true));
    this.events.once(Phaser.Scenes.Events.DESTROY, () => (this.isDead = true));

    this.cameras.main.setBackgroundColor('#F8FAFC');

    await loadIconTextures(this, [
      'owl',
      'fox',
      'star',
      'coin',
      'medal-gold',
      'medal-silver',
    ]);
    if (this.isDead) return;

    this.computeBoard();
    this.drawBoardPath();
    this.drawTiles();
    this.drawTokens();
    this.drawHud();

    this.updateHud();
    this.beginTurn();
  }

  // ---- layout ----------------------------------------------------------

  private computeBoard() {
    this.tilePos = BOARD.map((_, i) => {
      const ang = -Math.PI / 2 + (i / BOARD.length) * Math.PI * 2;
      return {
        x: BOARD_CX + BOARD_RX * Math.cos(ang),
        y: BOARD_CY + BOARD_RY * Math.sin(ang),
      };
    });
  }

  private drawBoardPath() {
    const g = this.add.graphics();
    g.lineStyle(20, 0xfde68a, 1);
    g.beginPath();
    this.tilePos.forEach((p, i) => (i === 0 ? g.moveTo(p.x, p.y) : g.lineTo(p.x, p.y)));
    g.closePath();
    g.strokePath();
    g.lineStyle(6, 0xfff7ed, 1);
    g.strokePath();
  }

  private drawTiles() {
    this.tilePos.forEach((p, i) => {
      const type = BOARD[i];
      const style = TILE_STYLES[type];
      const r = type === 'star' ? TILE_R + 3 : TILE_R;
      this.add.circle(p.x, p.y + 3, r, 0x000000, 0.12);
      this.add.circle(p.x, p.y, r, style.color, 1).setStrokeStyle(3, 0xffffff, 1);
      if (type === 'star') {
        this.add.image(p.x, p.y, 'star').setDisplaySize(22, 22);
      } else {
        this.add
          .text(p.x, p.y, style.label, {
            fontFamily: FONT,
            fontSize: '16px',
            fontStyle: '900',
            color: '#ffffff',
          })
          .setOrigin(0.5);
      }
    });

    // Mark the start tile.
    const start = this.tilePos[0];
    this.add
      .text(start.x, start.y - 26, 'START', {
        fontFamily: FONT,
        fontSize: '10px',
        fontStyle: '900',
        color: '#64748b',
      })
      .setOrigin(0.5);
  }

  private tokenOffset(id: PlayerId) {
    return id === 'you' ? { dx: -11, dy: -7 } : { dx: 11, dy: 7 };
  }

  private drawTokens() {
    this.tokens = {} as Record<PlayerId, Phaser.GameObjects.Container>;
    for (const p of this.players) {
      const off = this.tokenOffset(p.id);
      const base = this.tilePos[p.pos];
      const c = this.add.container(base.x + off.dx, base.y + off.dy).setDepth(20);
      const ring = this.add.circle(0, 0, 15, 0xffffff, 1).setStrokeStyle(3, 0x0f172a, 0.15);
      const face = this.add.image(0, 0, p.icon).setDisplaySize(24, 24);
      c.add([ring, face]);
      this.tokens[p.id] = c;
    }
  }

  /** Legend row: a colored dot + label for each tile type, centered. */
  private drawLegend(y: number) {
    const entries: { color: number; label: string }[] = [
      { color: TILE_STYLES.blue.color, label: 'coins' },
      { color: TILE_STYLES.red.color, label: 'lose' },
      { color: TILE_STYLES.star.color, label: 'star' },
      { color: TILE_STYLES.event.color, label: 'luck' },
      { color: TILE_STYLES.challenge.color, label: 'math' },
    ];
    const container = this.add.container(0, y);
    let x = 0;
    for (const e of entries) {
      const dot = this.add.circle(x + 5, 0, 5, e.color, 1);
      const label = this.add
        .text(x + 13, 0, e.label, {
          fontFamily: FONT,
          fontSize: '11px',
          fontStyle: '700',
          color: '#94a3b8',
        })
        .setOrigin(0, 0.5);
      container.add([dot, label]);
      x += 13 + label.width + 12;
    }
    container.x = (PARTY_WIDTH - (x - 12)) / 2;
  }

  /** One score row: avatar, name, coin icon + count, star icon + count. */
  private drawScoreRow(y: number, p: PartyPlayer) {
    this.add.image(86, y, p.icon).setDisplaySize(22, 22);
    this.add
      .text(102, y, p.name, {
        fontFamily: FONT,
        fontSize: '17px',
        fontStyle: '800',
        color: '#0f172a',
      })
      .setOrigin(0, 0.5);
    this.add.image(208, y, 'coin').setDisplaySize(18, 18);
    const coins = this.add
      .text(222, y, '0', {
        fontFamily: FONT,
        fontSize: '17px',
        fontStyle: '800',
        color: '#0f172a',
      })
      .setOrigin(0, 0.5);
    this.add.image(286, y, 'star').setDisplaySize(18, 18);
    const stars = this.add
      .text(300, y, '0', {
        fontFamily: FONT,
        fontSize: '17px',
        fontStyle: '800',
        color: '#0f172a',
      })
      .setOrigin(0, 0.5);
    this.scoreTexts[p.id] = { coins, stars };
  }

  private drawHud() {
    const W = PARTY_WIDTH;

    this.roundText = this.add.text(14, 12, '', {
      fontFamily: FONT,
      fontSize: '14px',
      fontStyle: '800',
      color: '#475569',
    });

    this.activeText = this.add
      .text(W - 14, 12, '', {
        fontFamily: FONT,
        fontSize: '14px',
        fontStyle: '900',
        color: '#46A302',
      })
      .setOrigin(1, 0);

    this.drawLegend(40);

    const divider = this.add.graphics();
    divider.lineStyle(2, 0xe2e8f0, 1);
    divider.lineBetween(20, 414, W - 20, 414);

    this.scoreTexts = {} as MathPartyScene['scoreTexts'];
    this.drawScoreRow(436, this.players[0]);
    this.drawScoreRow(466, this.players[1]);

    // Dice
    this.diceBox = this.add.container(98, 548).setDepth(5);
    const dg = this.add.graphics();
    dg.fillStyle(0x000000, 0.12);
    dg.fillRoundedRect(-28, -25, 60, 60, 14);
    dg.fillStyle(0xffffff, 1);
    dg.fillRoundedRect(-30, -30, 60, 60, 14);
    dg.lineStyle(3, 0xe2e8f0, 1);
    dg.strokeRoundedRect(-30, -30, 60, 60, 14);
    this.diceFace = this.add.graphics();
    this.diceBox.add([dg, this.diceFace]);
    this.drawDieFace(5);

    this.rollBtn = this.makeButton(W / 2 + 34, 548, 168, 64, 'ROLL', 0x58cc02, () => {
      if (!this.canRoll || this.busy) return;
      void this.doTurn();
    });

    this.hintText = this.add
      .text(W / 2, 604, '', {
        fontFamily: FONT,
        fontSize: '14px',
        fontStyle: '800',
        color: '#64748b',
        align: 'center',
      })
      .setOrigin(0.5);
  }

  /** Draw the pip layout for a die face inside the dice box. */
  private drawDieFace(n: number) {
    this.diceFace.clear();
    this.diceFace.fillStyle(0x7c3aed, 1);
    for (const [px, py] of DICE_PIPS[n] ?? []) {
      this.diceFace.fillCircle(px * PIP_SCALE, py * PIP_SCALE, 5);
    }
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
    const c = this.add.container(x, y).setDepth(30);
    const g = this.add.graphics();
    const darker = Phaser.Display.Color.IntegerToColor(color).darken(18).color;
    g.fillStyle(darker, 1);
    g.fillRoundedRect(-w / 2, -h / 2 + 5, w, h, 16);
    g.fillStyle(color, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
    const t = this.add
      .text(0, 0, label, { fontFamily: FONT, fontSize: '20px', fontStyle: '900', color: '#ffffff' })
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

  // ---- turn loop -------------------------------------------------------

  private beginTurn() {
    if (this.isDead || this.gameOver) return;
    if (this.round > PARTY_CONFIG.totalRounds) {
      this.endGame();
      return;
    }
    const p = this.players[this.activeIndex];
    this.setActiveIndicator(p);
    this.updateHud();

    if (p.id === 'you') {
      this.canRoll = true;
      this.rollBtn.setAlpha(1);
      this.setHint('Tap ROLL to move!');
    } else {
      this.canRoll = false;
      this.rollBtn.setAlpha(0.45);
      this.setHint(`${p.name} is thinking…`);
      void this.wait(750).then(() => {
        if (!this.isDead && !this.gameOver) void this.doTurn();
      });
    }
  }

  private async doTurn() {
    if (this.busy || this.isDead || this.gameOver) return;
    this.busy = true;
    this.canRoll = false;
    this.rollBtn.setAlpha(0.45);

    const p = this.players[this.activeIndex];
    const steps = await this.rollDice();
    if (this.dead()) return;
    this.setHint(`${p.name} rolled ${steps}!`);
    await this.moveToken(p, steps);
    if (this.dead()) return;
    await this.resolveTile(p);
    if (this.dead()) return;
    this.updateHud();
    await this.wait(450);
    if (this.dead()) return;

    this.busy = false;
    this.nextTurn();
  }

  private nextTurn() {
    if (this.isDead || this.gameOver) return;
    if (this.activeIndex === 0) {
      this.activeIndex = 1;
    } else {
      this.activeIndex = 0;
      this.round += 1;
    }
    this.beginTurn();
  }

  private async resolveTile(p: PartyPlayer) {
    const type = BOARD[p.pos];
    const tile = this.tilePos[p.pos];
    const opp = this.players[1 - this.activeIndex];

    switch (type) {
      case 'blue':
        p.coins += PARTY_CONFIG.blueGain;
        this.floatText(tile.x, tile.y, `+${PARTY_CONFIG.blueGain}`, '#1cb0f6');
        this.bounce(p);
        await this.wait(550);
        break;
      case 'red': {
        const loss = Math.min(p.coins, PARTY_CONFIG.redLoss);
        p.coins -= loss;
        this.floatText(tile.x, tile.y, `−${loss}`, '#ff4b4b');
        await this.wait(550);
        break;
      }
      case 'star':
        if (p.coins >= PARTY_CONFIG.starCost) {
          p.coins -= PARTY_CONFIG.starCost;
          p.stars += 1;
          this.floatText(tile.x, tile.y, '+1 STAR!', '#f59e0b');
          this.celebrate(p);
          await this.wait(850);
        } else {
          this.floatText(tile.x, tile.y, `Need ${PARTY_CONFIG.starCost} coins`, '#94a3b8');
          await this.wait(650);
        }
        break;
      case 'event': {
        const out = resolveEvent();
        let message = out.message;
        if (out.stealAmount > 0) {
          const taken = Math.min(opp.coins, out.stealAmount);
          opp.coins -= taken;
          p.coins += taken;
          message = `Swiped ${taken} coins!`;
        } else {
          p.coins = Math.max(0, p.coins + out.coinDelta);
        }
        if (out.starDelta > 0) {
          p.stars += out.starDelta;
          this.celebrate(p);
        }
        this.floatText(tile.x, tile.y, message, '#a855f7');
        await this.wait(750);
        break;
      }
      case 'challenge':
        await this.resolveChallenge(p);
        break;
    }
  }

  private async resolveChallenge(p: PartyPlayer) {
    const c = makeChallenge(this.difficulty);
    const tile = this.tilePos[p.pos];
    let correct: boolean;

    if (p.id === 'you') {
      this.setHint('Math tile — solve it!');
      correct = await this.onChallenge(c);
      if (this.dead()) return;
    } else {
      this.setHint(`${p.name}: ${c.prompt} = ?`);
      await this.wait(950);
      if (this.dead()) return;
      correct = cpuAnswersCorrectly();
    }

    if (correct) {
      p.coins += PARTY_CONFIG.challengeReward;
      this.floatText(tile.x, tile.y, `Correct! +${PARTY_CONFIG.challengeReward}`, '#58CC02');
      this.bounce(p);
    } else {
      const loss = Math.min(p.coins, PARTY_CONFIG.challengePenalty);
      p.coins -= loss;
      this.floatText(tile.x, tile.y, `Missed −${loss}`, '#ff4b4b');
    }
    await this.wait(700);
  }

  // ---- animation helpers ----------------------------------------------

  private rollDice(): Promise<number> {
    return new Promise((resolve) => {
      const final = rollDie();
      let flips = 0;
      const flipsTotal = 11;
      this.time.addEvent({
        delay: 55,
        repeat: flipsTotal,
        callback: () => {
          flips += 1;
          if (flips > flipsTotal) {
            this.drawDieFace(final);
            this.tweens.add({ targets: this.diceBox, scale: 1.18, duration: 110, yoyo: true });
            resolve(final);
          } else {
            this.drawDieFace(rollDie());
          }
        },
      });
    });
  }

  private async moveToken(p: PartyPlayer, steps: number) {
    const off = this.tokenOffset(p.id);
    const token = this.tokens[p.id];
    for (let s = 0; s < steps; s++) {
      if (this.dead()) return;
      p.pos = advancePos(p.pos, 1);
      const t = this.tilePos[p.pos];
      await this.tweenPromise({
        targets: token,
        x: t.x + off.dx,
        y: t.y + off.dy,
        duration: 165,
        ease: 'Sine.easeInOut',
      });
      this.tweens.add({ targets: token, scaleX: 1.2, scaleY: 1.2, duration: 80, yoyo: true });
    }
  }

  private bounce(p: PartyPlayer) {
    this.tweens.add({ targets: this.tokens[p.id], y: '-=10', duration: 130, yoyo: true, ease: 'Quad.easeOut' });
  }

  private celebrate(p: PartyPlayer) {
    const token = this.tokens[p.id];
    this.tweens.add({ targets: token, scale: 1.5, duration: 180, yoyo: true, ease: 'Back.easeOut' });
    for (let i = 0; i < 6; i++) {
      const star = this.add
        .image(token.x, token.y, 'star')
        .setDisplaySize(16, 16)
        .setDepth(40);
      const ang = (i / 6) * Math.PI * 2;
      this.tweens.add({
        targets: star,
        x: token.x + Math.cos(ang) * 46,
        y: token.y + Math.sin(ang) * 46,
        alpha: 0,
        duration: 700,
        ease: 'Cubic.easeOut',
        onComplete: () => star.destroy(),
      });
    }
  }

  private floatText(x: number, y: number, text: string, color: string) {
    const t = this.add
      .text(x, y - 18, text, { fontFamily: FONT, fontSize: '17px', fontStyle: '900', color })
      .setOrigin(0.5)
      .setDepth(50);
    t.setStroke('#ffffff', 4);
    this.tweens.add({
      targets: t,
      y: y - 58,
      alpha: 0,
      duration: 950,
      ease: 'Cubic.easeOut',
      onComplete: () => t.destroy(),
    });
  }

  private setActiveIndicator(p: PartyPlayer) {
    this.activeText.setText(p.id === 'you' ? 'YOUR TURN' : `${p.name.toUpperCase()}'S TURN`);
    this.activeText.setColor(p.id === 'you' ? '#46A302' : '#FF9600');
    this.tokens.you.setScale(p.id === 'you' ? 1.16 : 1);
    this.tokens.rival.setScale(p.id === 'rival' ? 1.16 : 1);
  }

  private updateHud() {
    for (const p of this.players) {
      this.scoreTexts[p.id].coins.setText(String(p.coins));
      this.scoreTexts[p.id].stars.setText(String(p.stars));
    }
    this.roundText.setText(`Round ${Math.min(this.round, PARTY_CONFIG.totalRounds)}/${PARTY_CONFIG.totalRounds}`);
  }

  private setHint(text: string) {
    this.hintText.setText(text);
  }

  private tweenPromise(config: Phaser.Types.Tweens.TweenBuilderConfig): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.add({ ...config, onComplete: () => resolve() });
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      this.time.delayedCall(ms, () => resolve());
    });
  }

  private dead(): boolean {
    return this.isDead || this.gameOver;
  }

  // ---- end game --------------------------------------------------------

  private endGame() {
    if (this.gameOver || this.isDead) return;
    this.gameOver = true;
    this.canRoll = false;
    this.rollBtn.setAlpha(0.3);

    const you = this.players[0];
    const rival = this.players[1];
    const place = placeOf(this.players, 'you');
    const payout = partyPayout(you, place);

    this.onGameEnd({
      youStars: you.stars,
      youCoins: you.coins,
      rivalStars: rival.stars,
      rivalCoins: rival.coins,
      place,
      payout,
    });

    this.showEndScreen(you, place, payout);
  }

  private showEndScreen(you: PartyPlayer, place: number, payout: number) {
    const W = PARTY_WIDTH;
    const H = PARTY_HEIGHT;
    const won = place === 1;

    this.add.rectangle(W / 2, H / 2, W, H, 0x0f172a, 0.74).setDepth(100);
    const panel = this.add.container(W / 2, H / 2).setDepth(101);

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.fillRoundedRect(-156, -168, 312, 336, 28);

    const title = this.add
      .text(0, -126, won ? 'You Win!' : 'So Close!', {
        fontFamily: FONT,
        fontSize: '30px',
        fontStyle: '900',
        color: won ? '#46A302' : '#FF9600',
      })
      .setOrigin(0.5);
    const medal = this.add
      .image(0, -62, MEDAL_ICONS[medalForPlace(place)])
      .setDisplaySize(72, 72);
    const score = this.add
      .text(0, 6, `${you.stars} Stars   ·   ${you.coins} Coins`, {
        fontFamily: FONT,
        fontSize: '18px',
        fontStyle: '800',
        color: '#0f172a',
      })
      .setOrigin(0.5);
    const reward = this.add
      .text(0, 48, `+${payout} coins banked!`, {
        fontFamily: FONT,
        fontSize: '20px',
        fontStyle: '900',
        color: '#46A302',
      })
      .setOrigin(0.5);

    const again = this.makeButton(0, 122, 220, 60, 'Play Again', 0xce82ff, () => {
      this.scene.restart();
    });

    // makeButton adds to the scene root; re-parent so it rides the panel's
    // transform (its 0,122 becomes relative to the panel center).
    panel.add([bg, title, medal, score, reward, again]);

    panel.setScale(0.82);
    this.tweens.add({ targets: panel, scale: 1, duration: 320, ease: 'Back.easeOut' });
  }
}
