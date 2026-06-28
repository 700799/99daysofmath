import { useEffect, useRef, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard, useArcadePausedRef } from './shared';
import { GameStage, useBurst, BurstLayer } from './fx';
import { makeChallenge, type Challenge } from './MidGameChallenge';
import { MathBreak } from './MathBreak';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

const STORY_EVERY = 60; // force a math-story break this many seconds into play

const NUKE_COST = 40;
const HEAL_COST = 25;

function mathChoices(level: number): { c: Challenge; choices: number[] } {
  const c = makeChallenge(level);
  const set = new Set<number>([c.answer]);
  while (set.size < 3) {
    const delta = Math.floor(Math.random() * 9) - 4 || 2;
    const v = c.answer + delta;
    if (v >= 0) set.add(v);
  }
  const choices = [...set].sort(() => Math.random() - 0.5);
  return { c, choices };
}

// Mochi Survivors — an original auto-battler in the Vampire-Survivors mould. You
// only move; your weapons fire on their own. Swarms of kawaii critters close in,
// drop XP gems, and every level-up lets you pick one of three upgrade cards.
// Survive each stage's timer to face a boss; clear it to unlock the next stage.

const VW = 360; // viewport (logical px)
const VH = 480;
const HERO = '🐹';

type Weapon = 'bolt' | 'aura' | 'whisk' | 'zap' | 'boomerang' | 'fire' | 'frost' | 'orbit' | 'missile';
type WState = { type: Weapon; level: number; t: number; a?: number };
type EKind = 'normal' | 'fast' | 'tank' | 'elite';
type Enemy = { x: number; y: number; hp: number; max: number; spd: number; r: number; emoji: string; dmg: number; boss?: boolean; kind: EKind; slow: number; gem: number };
type Bullet = { x: number; y: number; vx: number; vy: number; dmg: number; r: number; life: number; homing?: boolean; pierce?: number };
type Gem = { x: number; y: number; val: number };

const STAGES = [
  { name: 'Clover Meadow', theme: 'meadow', dur: 120, foes: ['🐛', '🐌', '🐜', '🐝', '🦗'], elite: '🐗', boss: '🐲' },
  { name: 'Spooky Woods', theme: 'night', dur: 150, foes: ['👻', '🦇', '🕷️', '🧟', '🦉'], elite: '🧛', boss: '👹' },
  { name: 'Frost Cavern', theme: 'cave', dur: 180, foes: ['🧊', '🐻‍❄️', '🦂', '🦟', '🪲'], elite: '🦣', boss: '🐙' },
  { name: 'Star Ocean', theme: 'ocean', dur: 200, foes: ['🐡', '🦈', '🪼', '🦑', '🦀'], elite: '🐊', boss: '🐋' },
  { name: 'Cosmic Rift', theme: 'space', dur: 240, foes: ['👾', '🛸', '☄️', '🌑', '🦾'], elite: '🛰️', boss: '🤖' },
  { name: 'Dragon Keep', theme: 'cave', dur: 260, foes: ['🦎', '🐉', '🦅', '🦬', '🐃'], elite: '🦏', boss: '👺' },
  { name: 'Candy Nebula', theme: 'candy', dur: 300, foes: ['🍬', '🍭', '🧁', '🍩', '🍪'], elite: '🎂', boss: '🍫' },
];

const WLABEL: Record<Weapon, { label: string; emoji: string }> = {
  bolt: { label: 'Star Bolt', emoji: '⭐' },
  aura: { label: 'Garlic Aura', emoji: '🧄' },
  whisk: { label: 'Whisk', emoji: '🍥' },
  zap: { label: 'Lightning', emoji: '⚡' },
  boomerang: { label: 'Boomerang', emoji: '🪃' },
  fire: { label: 'Fireball', emoji: '🔥' },
  frost: { label: 'Frost Nova', emoji: '❄️' },
  orbit: { label: 'Star Shield', emoji: '🌟' },
  missile: { label: 'Homing Missile', emoji: '🚀' },
};

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

export function MochiSurvivors() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const maxStage = useProgress((s) => s.survivorsMaxStage);
  const setMaxStage = useProgress((s) => s.setSurvivorsMaxStage);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  const [stageIdx, setStageIdx] = useState<number | null>(null);
  useArcadeClock(!!outcome || stageIdx === null);
  const pausedRef = useArcadePausedRef();
  const { burst, particles } = useBurst();

  // refs for the live game (avoid re-render churn)
  const heroRef = useRef({ x: 0, y: 0, hp: 100, max: 100, level: 1, xp: 0, xpNext: 5, speed: 95, pickup: 46, might: 1, regen: 0, cool: 1, armor: 0, crit: 0 });
  const weaponsRef = useRef<WState[]>([{ type: 'bolt', level: 1, t: 0 }]);
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const gemsRef = useRef<Gem[]>([]);
  const inputRef = useRef({ up: false, down: false, left: false, right: false });
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const elapsedRef = useRef(0);
  const spawnRef = useRef(0.8);
  const killsRef = useRef(0);
  const goldRef = useRef(0);
  const bossRef = useRef<Enemy | null>(null);
  const bossSpawnedRef = useRef(false);
  const miniSpawnedRef = useRef(false);
  const iframeRef = useRef(0);
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);
  const wonRef = useRef(false);

  const [levelUp, setLevelUp] = useState<{ choices: Upgrade[] } | null>(null);
  const levelUpRef = useRef(false);
  const [zoom, setZoom] = useState(1);
  const [math, setMath] = useState(() => mathChoices(1));
  // forced math-story break ~1 min into play
  const [story, setStory] = useState(false);
  const storyRef = useRef(false);
  const nextStoryRef = useRef(STORY_EVERY);
  // "how to move" arrow hint shown until the player first drags
  const [showHint, setShowHint] = useState(true);

  // solve math → earn cash (gold) to buy power-ups while you dodge
  const answerMath = (n: number) => {
    if (outcome) return;
    if (n === math.c.answer) {
      goldRef.current += 8 + (stageIdx ?? 0) * 2;
      sfx.coin(); haptic(HAPTIC.pickup);
      burst(VW / 2, VH - 30, { emoji: '💰', count: 6 });
    } else {
      sfx.hurt();
    }
    setMath(mathChoices(1 + (stageIdx ?? 0)));
  };

  const buyNuke = () => {
    if (outcome || goldRef.current < NUKE_COST) return;
    goldRef.current -= NUKE_COST;
    const h = heroRef.current;
    for (const e of enemiesRef.current) {
      if (!e.boss) { gemsRef.current.push({ x: e.x, y: e.y, val: e.gem }); killsRef.current += 1; }
      else e.hp -= 80;
    }
    enemiesRef.current = enemiesRef.current.filter((e) => e.boss && e.hp > 0);
    burst(VW / 2, VH / 2, { emoji: '💥', count: 24 });
    sfx.explode(); haptic(HAPTIC.explode);
    void h;
  };

  const buyHeal = () => {
    if (outcome || goldRef.current < HEAL_COST) return;
    goldRef.current -= HEAL_COST;
    const h = heroRef.current;
    h.hp = Math.min(h.max, h.hp + 35);
    sfx.powerup(); haptic(HAPTIC.pickup);
  };
  const [, force] = useState(0);
  const redraw = () => force((n) => n + 1);

  const punchZoom = () => {
    setZoom(1.18);
    window.setTimeout(() => setZoom(1), 260);
  };

  const start = (idx: number) => {
    const h = heroRef.current;
    h.x = 0; h.y = 0; h.hp = 100; h.max = 100; h.level = 1; h.xp = 0; h.xpNext = 5; h.speed = 95; h.pickup = 46; h.might = 1;
    h.regen = 0; h.cool = 1; h.armor = 0; h.crit = 0;
    weaponsRef.current = [{ type: 'bolt', level: 1, t: 0 }];
    enemiesRef.current = []; bulletsRef.current = []; gemsRef.current = [];
    elapsedRef.current = 0; spawnRef.current = 0.8; killsRef.current = 0; goldRef.current = 0;
    bossRef.current = null; bossSpawnedRef.current = false; iframeRef.current = 0;
    miniSpawnedRef.current = false;
    doneRef.current = false; wonRef.current = false; levelUpRef.current = false;
    storyRef.current = false; nextStoryRef.current = STORY_EVERY;
    setStory(false); setShowHint(true);
    setLevelUp(null); setOutcome(null); setStageIdx(idx);
  };

  const finish = (won: boolean) => {
    if (doneRef.current) return;
    doneRef.current = true;
    wonRef.current = won;
    const idx = stageIdx ?? 0;
    if (won) setMaxStage(Math.max(maxStage, idx + 1));
    addArcadePoints(goldRef.current + killsRef.current * 5);
    const xp = Math.max(2, Math.min(20, Math.floor(elapsedRef.current / 12) + (idx + 1) * 2 + (won ? 4 : 0)));
    won ? sfx.win() : sfx.lose();
    haptic(won ? HAPTIC.win : HAPTIC.death);
    setOutcome(recordArcadePlay('survivors', xp));
  };

  // game loop
  useEffect(() => {
    if (outcome || stageIdx === null) return;
    const stage = STAGES[stageIdx];
    lastRef.current = performance.now();
    const tick = (now: number) => {
      if (pausedRef.current || levelUpRef.current || storyRef.current) {
        lastRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;
      elapsedRef.current += dt;

      // forced math-story break ~every minute — must tap to continue
      if (elapsedRef.current >= nextStoryRef.current) {
        storyRef.current = true;
        setStory(true);
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (iframeRef.current > 0) iframeRef.current -= dt;
      const h = heroRef.current;

      // movement
      let mx = (inputRef.current.right ? 1 : 0) - (inputRef.current.left ? 1 : 0);
      let my = (inputRef.current.down ? 1 : 0) - (inputRef.current.up ? 1 : 0);
      if (dragRef.current) { mx = dragRef.current.dx; my = dragRef.current.dy; }
      const ml = Math.hypot(mx, my) || 1;
      h.x += (mx / ml) * h.speed * dt;
      h.y += (my / ml) * h.speed * dt;

      // passive regen
      if (h.regen > 0 && h.hp < h.max) h.hp = Math.min(h.max, h.hp + h.regen * dt);

      // spawn enemies around the viewport ring — with varied kinds
      const t = elapsedRef.current;
      spawnRef.current -= dt;
      if (spawnRef.current <= 0 && enemiesRef.current.length < 90) {
        spawnRef.current = Math.max(0.18, 0.9 - t * 0.0045);
        const n = 1 + Math.floor(t / 25);
        for (let k = 0; k < n; k++) {
          const ang = Math.random() * Math.PI * 2;
          const rad = 280 + Math.random() * 60;
          const roll = Math.random();
          let kind: EKind = 'normal';
          if (roll < 0.06 + t * 0.0004) kind = 'elite';
          else if (roll < 0.28) kind = 'fast';
          else if (roll < 0.48) kind = 'tank';
          const baseHp = 3 + Math.floor(t / 16);
          let hp = baseHp, spd = 34 + t * 0.05, r = 14, dmg = 6, gem = 1, emoji = stage.foes[Math.floor(Math.random() * stage.foes.length)];
          if (kind === 'fast') { spd *= 1.6; hp = Math.ceil(hp * 0.7); r = 12; dmg = 5; }
          else if (kind === 'tank') { hp = Math.ceil(hp * 2.4); spd *= 0.7; r = 18; dmg = 9; gem = 2; }
          else if (kind === 'elite') { hp = Math.ceil(hp * 4); spd *= 0.9; r = 22; dmg = 12; gem = 6; emoji = stage.elite; }
          enemiesRef.current.push({
            x: h.x + Math.cos(ang) * rad, y: h.y + Math.sin(ang) * rad,
            hp, max: hp, spd, r, emoji, dmg, kind, slow: 0, gem,
          });
        }
      }
      // mid-stage mini-boss
      if (!miniSpawnedRef.current && t >= stage.dur / 2) {
        miniSpawnedRef.current = true;
        const hp = 90 + stageIdx * 50;
        enemiesRef.current.push({ x: h.x + 240, y: h.y - 120, hp, max: hp, spd: 36, r: 24, emoji: stage.elite, dmg: 14, kind: 'elite', slow: 0, gem: 12 });
        sfx.boss(); haptic(HAPTIC.heavy);
      }
      // boss at the end of the stage timer
      if (!bossSpawnedRef.current && t >= stage.dur) {
        bossSpawnedRef.current = true;
        const hp = 220 + stageIdx * 120;
        const b: Enemy = { x: h.x, y: h.y - 260, hp, max: hp, spd: 30, r: 30, emoji: stage.boss, dmg: 18, boss: true, kind: 'elite', slow: 0, gem: 30 };
        bossRef.current = b; enemiesRef.current.push(b);
        sfx.boss(); haptic(HAPTIC.heavy); punchZoom();
      }

      // move enemies toward hero (frost slows them)
      for (const e of enemiesRef.current) {
        if (e.slow > 0) e.slow -= dt;
        const sp = e.slow > 0 ? e.spd * 0.45 : e.spd;
        const d = dist(e.x, e.y, h.x, h.y) || 1;
        e.x += ((h.x - e.x) / d) * sp * dt;
        e.y += ((h.y - e.y) / d) * sp * dt;
        if (d < e.r + 12 && iframeRef.current <= 0) {
          h.hp -= Math.max(1, e.dmg - h.armor); iframeRef.current = 0.6; sfx.hurt(); haptic(HAPTIC.hit);
          if (h.hp <= 0) { finish(false); return; }
        }
      }

      // weapons fire
      const crit = () => (Math.random() < h.crit ? 2 : 1);
      for (const w of weaponsRef.current) {
        const L = w.level;
        // continuous weapons (no cooldown gate)
        if (w.type === 'aura') {
          w.t -= dt;
          const R = 52 + L * 12;
          if (w.t <= 0) { w.t = 0.5; for (const e of enemiesRef.current) if (dist(e.x, e.y, h.x, h.y) < R) e.hp -= (2 + L) * h.might; }
          continue;
        }
        if (w.type === 'orbit') {
          w.a = (w.a ?? 0) + dt * 2.4;
          const cnt = 1 + L;
          const R = 64;
          for (let i = 0; i < cnt; i++) {
            const a = (w.a ?? 0) + (Math.PI * 2 * i) / cnt;
            const ox = h.x + Math.cos(a) * R, oy = h.y + Math.sin(a) * R;
            for (const e of enemiesRef.current) if (dist(e.x, e.y, ox, oy) < e.r + 12) e.hp -= (3 + L) * h.might * dt * 6;
          }
          continue;
        }
        w.t -= dt;
        if (w.t > 0) continue;
        if (w.type === 'bolt') {
          w.t = Math.max(0.2, 0.8 - L * 0.06) * h.cool;
          for (const e of nearest(enemiesRef.current, h, L)) {
            const d = dist(h.x, h.y, e.x, e.y) || 1;
            bulletsRef.current.push({ x: h.x, y: h.y, vx: ((e.x - h.x) / d) * 300, vy: ((e.y - h.y) / d) * 300, dmg: (4 + L * 2) * h.might * crit(), r: 7, life: 1.6 });
          }
          sfx.shoot();
        } else if (w.type === 'whisk') {
          w.t = Math.max(0.5, 1.4 - L * 0.1) * h.cool;
          const cnt = 2 + L;
          for (let i = 0; i < cnt; i++) { const a = (Math.PI * 2 * i) / cnt; bulletsRef.current.push({ x: h.x, y: h.y, vx: Math.cos(a) * 200, vy: Math.sin(a) * 200, dmg: (3 + L) * h.might, r: 9, life: 1.0 }); }
        } else if (w.type === 'zap') {
          w.t = Math.max(0.4, 1.2 - L * 0.08) * h.cool;
          for (const e of nearest(enemiesRef.current, h, Math.min(enemiesRef.current.length, 1 + L))) {
            e.hp -= (8 + L * 3) * h.might * crit();
            burst(e.x - h.x + VW / 2, e.y - h.y + VH / 2, { emoji: '⚡', count: 6 });
          }
        } else if (w.type === 'boomerang') {
          w.t = Math.max(0.6, 1.5 - L * 0.1) * h.cool;
          const tgt = nearest(enemiesRef.current, h, 1)[0];
          const ang = tgt ? Math.atan2(tgt.y - h.y, tgt.x - h.x) : 0;
          bulletsRef.current.push({ x: h.x, y: h.y, vx: Math.cos(ang) * 240, vy: Math.sin(ang) * 240, dmg: (5 + L * 2) * h.might, r: 12, life: 1.4, pierce: 2 + L });
        } else if (w.type === 'missile') {
          w.t = Math.max(0.6, 1.6 - L * 0.12) * h.cool;
          const cnt = Math.min(3, 1 + Math.floor(L / 2));
          for (let i = 0; i < cnt; i++) bulletsRef.current.push({ x: h.x, y: h.y, vx: (Math.random() - 0.5) * 120, vy: -140, dmg: (6 + L * 3) * h.might * crit(), r: 8, life: 2.2, homing: true });
          sfx.shoot();
        } else if (w.type === 'fire') {
          w.t = Math.max(0.8, 1.8 - L * 0.1) * h.cool;
          const tgt = nearest(enemiesRef.current, h, 1)[0];
          if (tgt) {
            const R = 40 + L * 8;
            for (const e of enemiesRef.current) if (dist(e.x, e.y, tgt.x, tgt.y) < R) e.hp -= (10 + L * 4) * h.might;
            burst(tgt.x - h.x + VW / 2, tgt.y - h.y + VH / 2, { emoji: '🔥', count: 12 });
            sfx.explode();
          }
        } else if (w.type === 'frost') {
          w.t = Math.max(0.9, 2.0 - L * 0.1) * h.cool;
          const R = 90 + L * 14;
          for (const e of enemiesRef.current) if (dist(e.x, e.y, h.x, h.y) < R) { e.hp -= (2 + L) * h.might; e.slow = 2.5; }
          burst(VW / 2, VH / 2, { emoji: '❄️', count: 10 });
        }
      }

      // bullets (with homing + pierce)
      for (const b of bulletsRef.current) {
        if (b.homing) {
          const tgt = nearest(enemiesRef.current, { x: b.x, y: b.y }, 1)[0];
          if (tgt) {
            const d = dist(b.x, b.y, tgt.x, tgt.y) || 1;
            const sp = Math.hypot(b.vx, b.vy) || 200;
            b.vx += ((tgt.x - b.x) / d) * sp * dt * 3; b.vy += ((tgt.y - b.y) / d) * sp * dt * 3;
            const ns = Math.hypot(b.vx, b.vy) || 1; b.vx = (b.vx / ns) * sp; b.vy = (b.vy / ns) * sp;
          }
        }
        b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
        for (const e of enemiesRef.current) {
          if (e.hp > 0 && dist(b.x, b.y, e.x, e.y) < e.r + b.r) {
            e.hp -= b.dmg;
            if (b.pierce && b.pierce > 0) b.pierce -= 1;
            else b.life = Math.min(b.life, 0);
            break;
          }
        }
      }
      bulletsRef.current = bulletsRef.current.filter((b) => b.life > 0);

      // dead enemies → gems
      const alive: Enemy[] = [];
      for (const e of enemiesRef.current) {
        if (e.hp <= 0) {
          killsRef.current += 1;
          gemsRef.current.push({ x: e.x, y: e.y, val: e.boss ? 30 : 1 });
          burst(e.x - h.x + VW / 2, e.y - h.y + VH / 2, { emoji: '💥', count: e.boss ? 18 : 5 });
          if (e.boss) { sfx.explode(); haptic(HAPTIC.explode); finishAfterBoss(); return; }
        } else alive.push(e);
      }
      enemiesRef.current = alive;

      // collect gems
      const keepGems: Gem[] = [];
      for (const g of gemsRef.current) {
        if (dist(g.x, g.y, h.x, h.y) < h.pickup) {
          h.xp += g.val; goldRef.current += g.val;
          if (h.xp >= h.xpNext) doLevelUp();
        } else keepGems.push(g);
      }
      gemsRef.current = keepGems;

      redraw();
      rafRef.current = requestAnimationFrame(tick);
    };

    const finishAfterBoss = () => finish(true);

    const doLevelUp = () => {
      const h = heroRef.current;
      h.xp -= h.xpNext;
      h.level += 1;
      h.xpNext = Math.floor(h.xpNext * 1.35 + 3);
      h.hp = Math.min(h.max, h.hp + 8);
      sfx.levelUp(); haptic(HAPTIC.levelUp); punchZoom();
      levelUpRef.current = true;
      setLevelUp({ choices: rollUpgrades(weaponsRef.current) });
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome, stageIdx]);

  // keyboard
  useEffect(() => {
    const set = (e: KeyboardEvent, v: boolean) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') inputRef.current.up = v;
      else if (k === 'arrowdown' || k === 's') inputRef.current.down = v;
      else if (k === 'arrowleft' || k === 'a') inputRef.current.left = v;
      else if (k === 'arrowright' || k === 'd') inputRef.current.right = v;
      else return;
      e.preventDefault();
    };
    const dn = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  const chooseUpgrade = (u: Upgrade) => {
    applyUpgrade(u, heroRef.current, weaponsRef.current);
    setLevelUp(null);
    levelUpRef.current = false;
    lastRef.current = performance.now();
  };

  const finishStory = () => {
    setStory(false);
    storyRef.current = false;
    nextStoryRef.current = elapsedRef.current + STORY_EVERY;
    lastRef.current = performance.now();
  };

  // --- stage select ---
  if (stageIdx === null && !outcome) {
    return (
      <div>
        <ArcadeHeader title="Mochi Survivors" emoji="🐹" />
        <p className="text-sm text-slate-600 mb-3 text-center">
          You auto-attack — just <b>move</b> and survive! Pick a journey:
        </p>
        <div className="max-w-sm mx-auto space-y-2">
          {STAGES.map((s, i) => {
            const locked = i > maxStage;
            return (
              <button
                key={s.name}
                type="button"
                disabled={locked}
                onClick={() => start(i)}
                className={`w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3 font-display font-extrabold ${
                  locked ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-indigo-200 text-slate-800 hover:border-indigo-400'
                }`}
              >
                <span>Stage {i + 1}: {s.name}</span>
                <span>{locked ? '🔒' : i <= maxStage ? `${s.boss}` : ''}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (outcome) {
    const idx = stageIdx ?? 0;
    return (
      <div>
        <ArcadeHeader title="Mochi Survivors" emoji="🐹" />
        <ArcadeEndCard
          gameId="survivors"
          outcome={outcome}
          win={wonRef.current}
          scoreLine={
            wonRef.current
              ? `🏆 Cleared ${STAGES[idx].name}! ${killsRef.current} foes`
              : `Survived ${fmtT(elapsedRef.current)} · Lv ${heroRef.current.level} · ${killsRef.current} foes`
          }
          onReplay={() => setStageIdx(null)}
        />
      </div>
    );
  }

  if (stageIdx === null) return null;
  const h = heroRef.current;
  const stage = STAGES[stageIdx];
  const timeLeft = Math.max(0, Math.ceil(stage.dur - elapsedRef.current));

  return (
    <div>
      <ArcadeHeader title="Mochi Survivors" emoji="🐹" />
      <div className="flex justify-between items-center mb-1 max-w-sm mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-rose-600">❤️ {Math.max(0, Math.ceil(h.hp))}/{h.max}</span>
        <span className="text-indigo-600">Lv {h.level}</span>
        <span className="text-amber-600">💰 {goldRef.current}</span>
        <span className="text-slate-600 tabular-nums">{bossRef.current ? '☠️ BOSS' : `⏱ ${timeLeft}s`}</span>
      </div>
      {/* xp bar */}
      <div className="max-w-sm mx-auto mb-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, (h.xp / h.xpNext) * 100)}%` }} />
      </div>

      <GameStage theme={stage.theme} className="mx-auto" style={{ width: 'min(100%, 42vh)' }}>
        <div
          className="relative overflow-hidden mx-auto touch-none"
          style={{ width: '100%', aspectRatio: `${VW} / ${VH}` }}
          onPointerDown={(e) => { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); setShowHint(false); updateDrag(e, dragRef); }}
          onPointerMove={(e) => { if (dragRef.current) updateDrag(e, dragRef); }}
          onPointerUp={() => (dragRef.current = null)}
          onPointerLeave={() => (dragRef.current = null)}
        >
          <BurstLayer api={{ burst, particles }} />
          <div
            className="absolute inset-0 transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: '50% 50%' }}
          >
            {/* gems */}
            {gemsRef.current.map((g, i) => (
              <Sprite key={`g${i}`} x={g.x - h.x + VW / 2} y={g.y - h.y + VH / 2} size={g.val > 5 ? 22 : 12} emoji={g.val > 5 ? '🎁' : '💎'} />
            ))}
            {/* enemies */}
            {enemiesRef.current.map((e, i) => (
              <Sprite key={`e${i}`} x={e.x - h.x + VW / 2} y={e.y - h.y + VH / 2} size={e.boss ? 52 : 26} emoji={e.emoji} />
            ))}
            {/* bullets */}
            {bulletsRef.current.map((b, i) => (
              <Sprite key={`b${i}`} x={b.x - h.x + VW / 2} y={b.y - h.y + VH / 2} size={14} emoji="✨" />
            ))}
            {/* aura ring */}
            {weaponsRef.current.some((w) => w.type === 'aura') && (
              <div
                className="absolute rounded-full border-2 border-lime-300/60 bg-lime-300/10"
                style={{
                  left: VW / 2, top: VH / 2, width: 0, height: 0,
                  transform: `translate(-50%,-50%)`,
                  boxShadow: '0 0 0 9999px transparent',
                }}
              />
            )}
            {/* hero */}
            <Sprite x={VW / 2} y={VH / 2} size={30} emoji={HERO} flash={iframeRef.current > 0} />

            {/* navigation hint — arrows around the hero until you first move */}
            {showHint && (
              <div className="pointer-events-none absolute inset-0 z-30">
                <div className="absolute left-1/2 top-[34%] -translate-x-1/2 text-2xl animate-bounce">⬆️</div>
                <div className="absolute left-1/2 top-[58%] -translate-x-1/2 text-2xl animate-bounce">⬇️</div>
                <div className="absolute top-1/2 left-[34%] -translate-y-1/2 text-2xl animate-pulse">⬅️</div>
                <div className="absolute top-1/2 left-[60%] -translate-y-1/2 text-2xl animate-pulse">➡️</div>
                <div className="absolute left-1/2 bottom-3 -translate-x-1/2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-display font-extrabold text-white">
                  👆 Drag to move!
                </div>
              </div>
            )}
          </div>

          {levelUp && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-900/70 p-3">
              <div className="text-white font-display font-extrabold mb-2">⭐ Level Up! Pick one</div>
              <div className="w-full max-w-xs space-y-2">
                {levelUp.choices.map((u, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => chooseUpgrade(u)}
                    className="w-full rounded-2xl bg-white px-4 py-3 text-left font-display font-extrabold text-slate-800 active:translate-y-0.5"
                  >
                    <span className="text-xl mr-2">{u.emoji}</span>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </GameStage>

      {/* solve math → earn 💰 cash → buy power-ups (while you keep dodging!) */}
      <div className="max-w-sm mx-auto mt-2 rounded-2xl bg-white border-2 border-slate-200 p-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-extrabold text-slate-800 tabular-nums">🧮 {math.c.prompt} =</span>
          <div className="flex gap-1">
            {math.choices.map((n, i) => (
              <button key={i} type="button" onClick={() => answerMath(n)}
                className="min-w-10 min-h-9 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-display font-extrabold text-slate-800 tabular-nums">
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={buyNuke} disabled={goldRef.current < NUKE_COST}
            className="flex-1 min-h-10 rounded-xl bg-rose-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-display font-extrabold text-sm">
            💥 Nuke (💰{NUKE_COST})
          </button>
          <button type="button" onClick={buyHeal} disabled={goldRef.current < HEAL_COST}
            className="flex-1 min-h-10 rounded-xl bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-display font-extrabold text-sm">
            ❤️ Heal (💰{HEAL_COST})
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-500 mt-2">
        Dodge with drag/WASD — weapons auto-fire. <b>Answer math to earn 💰</b> for Nukes &amp; Heals!
      </p>

      {story && <MathBreak onDone={finishStory} />}
    </div>
  );
}

// --- helpers ---

type Passive = 'hp' | 'speed' | 'pickup' | 'might' | 'regen' | 'cool' | 'armor' | 'crit';
type Upgrade = { kind: 'weapon' | 'passive'; weapon?: Weapon; passive?: Passive; label: string; emoji: string };

const PASSIVE_UPGRADES: Upgrade[] = [
  { kind: 'passive', passive: 'hp', label: '+25 Max HP', emoji: '❤️' },
  { kind: 'passive', passive: 'speed', label: '+12% Move Speed', emoji: '👟' },
  { kind: 'passive', passive: 'pickup', label: '+30% Pickup Range', emoji: '🧲' },
  { kind: 'passive', passive: 'might', label: '+20% Damage', emoji: '💪' },
  { kind: 'passive', passive: 'regen', label: '+2 HP/sec regen', emoji: '💖' },
  { kind: 'passive', passive: 'cool', label: '-12% Cooldown', emoji: '⏱️' },
  { kind: 'passive', passive: 'armor', label: '+2 Armor', emoji: '🪖' },
  { kind: 'passive', passive: 'crit', label: '+10% Crit chance', emoji: '🎯' },
];

function rollUpgrades(weapons: WState[]): Upgrade[] {
  const weaponUps: Upgrade[] = (Object.keys(WLABEL) as Weapon[])
    .filter((wp) => weapons.length < 6 || weapons.some((w) => w.type === wp && w.level < 5))
    .map((wp) => {
      const owned = weapons.find((w) => w.type === wp);
      const info = WLABEL[wp];
      return { kind: 'weapon', weapon: wp, emoji: info.emoji, label: owned ? `${info.label} ${info.emoji} → Lv ${owned.level + 1}` : `New: ${info.label} ${info.emoji}` };
    });
  const pool = [...PASSIVE_UPGRADES, ...weaponUps];
  const out: Upgrade[] = [];
  const copy = [...pool];
  for (let i = 0; i < 3 && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function applyUpgrade(
  u: Upgrade,
  h: { max: number; hp: number; speed: number; pickup: number; might: number; regen: number; cool: number; armor: number; crit: number },
  weapons: WState[],
) {
  if (u.kind === 'passive') {
    if (u.passive === 'hp') { h.max += 25; h.hp += 25; }
    else if (u.passive === 'speed') h.speed *= 1.12;
    else if (u.passive === 'pickup') h.pickup *= 1.3;
    else if (u.passive === 'might') h.might *= 1.2;
    else if (u.passive === 'regen') h.regen += 2;
    else if (u.passive === 'cool') h.cool *= 0.88;
    else if (u.passive === 'armor') h.armor += 2;
    else if (u.passive === 'crit') h.crit = Math.min(0.8, h.crit + 0.1);
  } else if (u.kind === 'weapon' && u.weapon) {
    const existing = weapons.find((w) => w.type === u.weapon);
    if (existing) existing.level = Math.min(5, existing.level + 1);
    else if (weapons.length < 6) weapons.push({ type: u.weapon, level: 1, t: 0 });
  }
}

function nearest(enemies: Enemy[], h: { x: number; y: number }, n: number): Enemy[] {
  return [...enemies].sort((a, b) => dist(a.x, a.y, h.x, h.y) - dist(b.x, b.y, h.x, h.y)).slice(0, n);
}

function updateDrag(e: React.PointerEvent, ref: React.MutableRefObject<{ dx: number; dy: number } | null>) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  ref.current = { dx: e.clientX - cx, dy: e.clientY - cy };
}

function fmtT(s: number) {
  const t = Math.floor(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

function Sprite({ x, y, size, emoji, flash }: { x: number; y: number; size: number; emoji: string; flash?: boolean }) {
  return (
    <div
      className="absolute select-none"
      style={{
        left: x, top: y, transform: 'translate(-50%,-50%)', fontSize: size, lineHeight: 1,
        opacity: flash ? 0.5 : 1,
        filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
      }}
    >
      {emoji}
    </div>
  );
}
