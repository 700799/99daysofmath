import { useEffect, useState } from 'react';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { GameStage } from './fx';
import { makeChallenge, type Challenge } from './MidGameChallenge';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Rogue Dungeon — an original turn-based, procedurally-generated crawler in the
// Rogue-Fable mould. Move one tile at a time; bump monsters to attack; grab loot;
// take the stairs ⬇️ ever deeper. Locked chests open by solving a math problem.
// Permadeath: every run is a fresh journey. Pick a class to vary the adventure.

const GW = 13;
const GH = 11;
const SIGHT = 4;

type Tile = 'wall' | 'floor' | 'stairs';
type Monster = { x: number; y: number; hp: number; atk: number; emoji: string; fast?: boolean; seenTurn?: boolean };
type Item = { x: number; y: number; kind: 'potion' | 'gold' | 'chest' | 'sword' | 'shield'; amt: number };
type Hero = { x: number; y: number; hp: number; max: number; atk: number; def: number; gold: number; potions: number; cls: string };

const CLASSES = [
  { id: 'knight', emoji: '🐻', name: 'Knight', hp: 34, atk: 5, def: 2, blurb: 'Tanky & tough' },
  { id: 'mage', emoji: '🐰', name: 'Mage', hp: 22, atk: 8, def: 0, blurb: 'Glass cannon' },
  { id: 'rogue', emoji: '🦊', name: 'Rogue', hp: 28, atk: 6, def: 1, blurb: 'Finds more gold' },
];

const FOES = ['🐀', '🦇', '🐍', '👹', '💀', '🦂', '🧟', '👺'];

function ri(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

type Floor = { tiles: Tile[]; monsters: Monster[]; items: Item[]; start: { x: number; y: number } };

function genFloor(depth: number): Floor {
  const tiles: Tile[] = Array(GW * GH).fill('wall');
  const rooms: { x: number; y: number; w: number; h: number }[] = [];
  const carve = (x: number, y: number) => {
    if (x > 0 && x < GW - 1 && y > 0 && y < GH - 1) tiles[y * GW + x] = 'floor';
  };
  const tries = 8;
  for (let i = 0; i < tries; i++) {
    const w = ri(3, 5), h = ri(3, 4);
    const x = ri(1, GW - w - 1), y = ri(1, GH - h - 1);
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) carve(xx, yy);
    rooms.push({ x, y, w, h });
  }
  // connect room centers with L corridors
  const cx = (r: typeof rooms[0]) => Math.floor(r.x + r.w / 2);
  const cy = (r: typeof rooms[0]) => Math.floor(r.y + r.h / 2);
  for (let i = 1; i < rooms.length; i++) {
    let x = cx(rooms[i - 1]), y = cy(rooms[i - 1]);
    const tx = cx(rooms[i]), ty = cy(rooms[i]);
    while (x !== tx) { carve(x, y); x += Math.sign(tx - x); }
    while (y !== ty) { carve(x, y); y += Math.sign(ty - y); }
  }
  const start = { x: cx(rooms[0]), y: cy(rooms[0]) };
  const last = rooms[rooms.length - 1];
  tiles[cy(last) * GW + cx(last)] = 'stairs';

  // place monsters & items on floor tiles (not in the first room)
  const floorIdx: number[] = [];
  for (let i = 0; i < tiles.length; i++) if (tiles[i] === 'floor') floorIdx.push(i);
  const farFromStart = (i: number) => Math.abs((i % GW) - start.x) + Math.abs(Math.floor(i / GW) - start.y) > 4;
  const pick = () => {
    const cands = floorIdx.filter(farFromStart);
    return cands[ri(0, cands.length - 1)] ?? floorIdx[0];
  };
  const monsters: Monster[] = [];
  const nFoes = 3 + depth;
  const foeKinds = FOES.slice(0, Math.min(FOES.length, 2 + depth));
  for (let i = 0; i < nFoes; i++) {
    const idx = pick();
    monsters.push({
      x: idx % GW, y: Math.floor(idx / GW),
      hp: 4 + depth * 2 + ri(0, 2), atk: 2 + depth, emoji: foeKinds[ri(0, foeKinds.length - 1)],
      fast: Math.random() < 0.18,
    });
  }
  const items: Item[] = [];
  const addItem = (kind: Item['kind'], amt: number) => { const idx = pick(); items.push({ x: idx % GW, y: Math.floor(idx / GW), kind, amt }); };
  addItem('potion', 8 + depth * 2);
  if (Math.random() < 0.7) addItem('gold', 8 + depth * 4);
  addItem('chest', 0);
  if (Math.random() < 0.5) addItem(Math.random() < 0.5 ? 'sword' : 'shield', 1);
  return { tiles, monsters, items, start };
}

export function RogueDelve() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const addArcadePoints = useProgress((s) => s.addArcadePoints);
  const addAchievement = useProgress((s) => s.addAchievement);
  const maxDepth = useProgress((s) => s.rogueMaxDepth);
  const setMaxDepth = useProgress((s) => s.setRogueMaxDepth);
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  const [cls, setCls] = useState<string | null>(null);
  const [depth, setDepth] = useState(1);
  const [floor, setFloor] = useState<Floor | null>(null);
  const [hero, setHero] = useState<Hero | null>(null);
  const [seen, setSeen] = useState<boolean[]>([]);
  const [log, setLog] = useState('You enter the dungeon…');
  const [chest, setChest] = useState<{ c: Challenge; item: Item } | null>(null);
  const [chestInput, setChestInput] = useState('');
  const [zoom, setZoom] = useState(1);

  const startRun = (classId: string) => {
    const c = CLASSES.find((x) => x.id === classId)!;
    const f = genFloor(1);
    const h: Hero = { x: f.start.x, y: f.start.y, hp: c.hp, max: c.hp, atk: c.atk, def: c.def, gold: 0, potions: 1, cls: c.emoji };
    setCls(classId); setDepth(1); setFloor(f); setHero(h);
    setSeen(reveal(Array(GW * GH).fill(false), h.x, h.y));
    setLog(`A brave ${c.name} ${c.emoji} descends!`);
    setOutcome(null);
  };

  const descend = (curDepth: number) => {
    const nd = curDepth + 1;
    const f = genFloor(nd);
    setDepth(nd);
    setMaxDepth(Math.max(maxDepth, nd));
    setFloor(f);
    setHero((h) => (h ? { ...h, x: f.start.x, y: f.start.y, hp: Math.min(h.max, h.hp + 4) } : h));
    setSeen(reveal(Array(GW * GH).fill(false), f.start.x, f.start.y));
    setLog(`Depth ${nd}. The air grows colder…`);
    sfx.powerup(); haptic(HAPTIC.levelUp);
    setZoom(1.12); window.setTimeout(() => setZoom(1), 260);
  };

  const die = (h: Hero) => {
    addArcadePoints(h.gold + depth * 20);
    const xp = Math.max(2, Math.min(20, depth * 2));
    sfx.lose(); haptic(HAPTIC.death);
    setOutcome(recordArcadePlay('rogue', xp));
  };

  const drinkPotion = () => {
    if (!hero || hero.potions <= 0 || outcome || chest) return;
    setHero((h) => (h ? { ...h, potions: h.potions - 1, hp: Math.min(h.max, h.hp + 14) } : h));
    setLog('You drink a potion. ❤️ +14');
    sfx.pickup(); haptic(HAPTIC.pickup);
    monsterTurn();
  };

  // Player attempts to move/attack in a direction
  const act = (dx: number, dy: number) => {
    if (!hero || !floor || outcome || chest) return;
    const nx = hero.x + dx, ny = hero.y + dy;
    if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) return;
    const tile = floor.tiles[ny * GW + nx];
    if (tile === 'wall') return;
    const m = floor.monsters.find((mm) => mm.x === nx && mm.y === ny);
    if (m) {
      // attack
      const dmg = Math.max(1, hero.atk + ri(0, 2));
      m.hp -= dmg;
      sfx.hit(); haptic(HAPTIC.hit);
      if (m.hp <= 0) {
        floor.monsters = floor.monsters.filter((x) => x !== m);
        setLog(`You defeat ${m.emoji}!`);
        sfx.explode();
      } else setLog(`You hit ${m.emoji} for ${dmg}.`);
      setFloor({ ...floor });
      monsterTurn();
      return;
    }
    // chest pickup → math gate
    const it = floor.items.find((i) => i.x === nx && i.y === ny);
    if (it && it.kind === 'chest') {
      setChest({ c: makeChallenge(Math.min(5, 1 + Math.floor(depth / 2))), item: it });
      setChestInput('');
      return;
    }
    // move
    const h2 = { ...hero, x: nx, y: ny };
    if (it) collect(it, h2, floor);
    setHero(h2);
    setSeen((s) => reveal([...s], nx, ny));
    if (floor.tiles[ny * GW + nx] === 'stairs') { descend(depth); return; }
    monsterTurn(h2);
  };

  const collect = (it: Item, h: Hero, f: Floor) => {
    f.items = f.items.filter((x) => x !== it);
    if (it.kind === 'potion') { h.potions += 1; setLog('Found a potion 🧪'); }
    else if (it.kind === 'gold') { const g = it.amt + (cls === 'rogue' ? Math.floor(it.amt * 0.5) : 0); h.gold += g; setLog(`+💰${g} gold`); }
    else if (it.kind === 'sword') { h.atk += 2; setLog('A sharper sword! ⚔️ +2 ATK'); }
    else if (it.kind === 'shield') { h.def += 1; setLog('A sturdier shield! 🛡️ +1 DEF'); }
    sfx.coin(); haptic(HAPTIC.pickup);
    setFloor({ ...f });
  };

  const openChest = () => {
    if (!chest || !hero || !floor) return;
    const n = Number(chestInput.trim());
    const good = !Number.isNaN(n) && chestInput.trim() !== '' && n === chest.c.answer;
    const f = floor;
    f.items = f.items.filter((x) => x !== chest.item);
    const h2 = { ...hero, x: chest.item.x, y: chest.item.y };
    if (good) {
      addAchievement(10);
      const roll = Math.random();
      if (roll < 0.4) { h2.atk += 3; setLog('🎁 The chest holds a mighty blade! ⚔️ +3 ATK'); }
      else if (roll < 0.7) { h2.def += 2; setLog('🎁 Enchanted armor! 🛡️ +2 DEF'); }
      else { const g = 25 + depth * 8; h2.gold += g; setLog(`🎁 Treasure! +💰${g}`); }
      sfx.powerup(); haptic(HAPTIC.levelUp);
    } else {
      setLog('🔒 The lock holds firm — the chest crumbles to dust.');
      sfx.hurt(); haptic(HAPTIC.hit);
    }
    setHero(h2);
    setSeen((s) => reveal([...s], h2.x, h2.y));
    setChest(null);
    setFloor({ ...f });
    monsterTurn(h2);
  };

  // Monsters take their turn
  const monsterTurn = (h: Hero = hero!) => {
    if (!floor) return;
    let cur = { ...h };
    const stepMonster = (m: Monster) => {
      const d = Math.abs(m.x - cur.x) + Math.abs(m.y - cur.y);
      if (d <= SIGHT + 1) m.seenTurn = true;
      if (!m.seenTurn) return;
      if (d === 1) {
        const dmg = Math.max(1, m.atk - cur.def + ri(0, 1));
        cur = { ...cur, hp: cur.hp - dmg };
        return;
      }
      // greedy step toward hero
      const opts = [
        { x: m.x + Math.sign(cur.x - m.x), y: m.y },
        { x: m.x, y: m.y + Math.sign(cur.y - m.y) },
      ].filter((o) => o.x >= 0 && o.y >= 0 && o.x < GW && o.y < GH && floor.tiles[o.y * GW + o.x] !== 'wall'
        && !floor.monsters.some((mm) => mm !== m && mm.x === o.x && mm.y === o.y)
        && !(o.x === cur.x && o.y === cur.y));
      if (opts.length) { const o = opts[ri(0, opts.length - 1)]; m.x = o.x; m.y = o.y; }
    };
    for (const m of floor.monsters) {
      stepMonster(m);
      if (m.fast) stepMonster(m);
    }
    if (cur.hp <= 0) { sfx.hurt(); haptic(HAPTIC.death); setHero(cur); die(cur); return; }
    if (cur.hp < h.hp) { sfx.hurt(); haptic(HAPTIC.hit); }
    setHero(cur);
    setFloor({ ...floor });
  };

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') { e.preventDefault(); act(0, -1); }
      else if (k === 'arrowdown' || k === 's') { e.preventDefault(); act(0, 1); }
      else if (k === 'arrowleft' || k === 'a') { e.preventDefault(); act(-1, 0); }
      else if (k === 'arrowright' || k === 'd') { e.preventDefault(); act(1, 0); }
      else if (k === ' ') { e.preventDefault(); drinkPotion(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // --- class select ---
  if (!cls || !floor || !hero) {
    return (
      <div>
        <ArcadeHeader title="Rogue Dungeon" emoji="🗡️" />
        <p className="text-sm text-slate-600 mb-3 text-center">
          A turn-based dungeon crawl. Bump monsters to fight, grab loot, take the ⬇️ stairs deeper.
          Choose your hero {maxDepth > 0 && <>· best depth <b>{maxDepth}</b></>}:
        </p>
        <div className="max-w-sm mx-auto space-y-2">
          {CLASSES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => startRun(c.id)}
              className="w-full flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 hover:border-indigo-400 text-left"
            >
              <span className="text-3xl">{c.emoji}</span>
              <span>
                <span className="font-display font-extrabold text-slate-800">{c.name}</span>
                <span className="block text-xs text-slate-500">{c.blurb} · ❤️{c.hp} ⚔️{c.atk} 🛡️{c.def}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Rogue Dungeon" emoji="🗡️" />
        <ArcadeEndCard
          gameId="rogue"
          outcome={outcome}
          win={depth >= 5}
          scoreLine={`Fell on depth ${depth} · 💰 ${hero.gold}`}
          onReplay={() => { setCls(null); setFloor(null); setHero(null); }}
        />
      </div>
    );
  }

  return (
    <div>
      <ArcadeHeader title="Rogue Dungeon" emoji="🗡️" />
      <div className="flex justify-between items-center mb-1 max-w-md mx-auto px-1 text-xs font-display font-extrabold">
        <span className="text-rose-600">❤️ {Math.max(0, hero.hp)}/{hero.max}</span>
        <span className="text-orange-600">⚔️ {hero.atk}</span>
        <span className="text-sky-600">🛡️ {hero.def}</span>
        <span className="text-amber-600">💰 {hero.gold}</span>
        <span className="text-indigo-600">⬇️ {depth}</span>
      </div>

      <GameStage theme="cave" className="max-w-md mx-auto p-2">
        <div
          className="grid mx-auto transition-transform duration-200"
          style={{ gridTemplateColumns: `repeat(${GW}, 1fr)`, gap: 1, width: '100%', transform: `scale(${zoom})` }}
        >
          {floor.tiles.map((t, i) => {
            const x = i % GW, y = Math.floor(i / GW);
            const isSeen = seen[i];
            const inFov = Math.abs(x - hero.x) <= SIGHT && Math.abs(y - hero.y) <= SIGHT;
            const m = inFov ? floor.monsters.find((mm) => mm.x === x && mm.y === y) : undefined;
            const it = isSeen ? floor.items.find((ii) => ii.x === x && ii.y === y) : undefined;
            const isHero = hero.x === x && hero.y === y;
            let content = '';
            if (isHero) content = hero.cls;
            else if (m) content = m.emoji;
            else if (t === 'stairs') content = '⬇️';
            else if (it) content = it.kind === 'potion' ? '🧪' : it.kind === 'gold' ? '💰' : it.kind === 'chest' ? '🎁' : it.kind === 'sword' ? '⚔️' : '🛡️';
            const bg = !isSeen ? '#0b0a09' : t === 'wall' ? '#3a2a1a' : inFov ? '#6b5135' : '#4a3a26';
            return (
              <div key={i} className="aspect-square flex items-center justify-center" style={{ background: bg, fontSize: 'min(4.5vw, 20px)' }}>
                {content}
              </div>
            );
          })}
        </div>
      </GameStage>

      <div className="max-w-md mx-auto mt-2 text-center text-[11px] font-display font-bold text-slate-600 min-h-4">{log}</div>

      {/* controls */}
      <div className="max-w-xs mx-auto mt-2 flex items-center justify-between">
        <div className="grid grid-cols-3 gap-1.5 w-40 select-none">
          <span />
          <DPad label="↑" onPress={() => act(0, -1)} />
          <span />
          <DPad label="←" onPress={() => act(-1, 0)} />
          <DPad label="↓" onPress={() => act(0, 1)} />
          <DPad label="→" onPress={() => act(1, 0)} />
        </div>
        <button
          type="button"
          onClick={drinkPotion}
          disabled={hero.potions <= 0}
          className="min-h-14 px-4 rounded-2xl bg-rose-500 disabled:bg-slate-300 text-white font-display font-extrabold"
        >
          🧪 {hero.potions}
        </button>
      </div>
      <p className="text-center text-[11px] text-slate-500 mt-2">
        Arrows/WASD or tap to move &amp; attack. Space drinks a potion. Reach ⬇️ to go deeper!
      </p>

      {chest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl">
            <div className="text-3xl">🎁🔒</div>
            <div className="mt-1 font-display font-extrabold text-slate-900">A runed lock — solve to open:</div>
            <div className="mt-3 rounded-2xl bg-slate-50 border-2 border-slate-200 py-4 text-2xl font-display font-extrabold tabular-nums">{chest.c.prompt}</div>
            <input
              autoFocus
              inputMode="numeric"
              value={chestInput}
              onChange={(e) => setChestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && openChest()}
              className="mt-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-center text-xl font-display font-extrabold focus:border-amber-500 focus:outline-none"
              placeholder="?"
            />
            <button type="button" onClick={openChest} className="mt-3 w-full min-h-11 rounded-2xl bg-amber-500 text-white font-display font-extrabold">
              Open 🔓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function reveal(seen: boolean[], x: number, y: number): boolean[] {
  for (let dy = -SIGHT; dy <= SIGHT; dy++)
    for (let dx = -SIGHT; dx <= SIGHT; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < GW && ny < GH) seen[ny * GW + nx] = true;
    }
  return seen;
}

function DPad({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      className="min-h-12 rounded-xl bg-white border-2 border-slate-200 text-xl font-display font-extrabold text-slate-700 active:bg-slate-100"
    >
      {label}
    </button>
  );
}
