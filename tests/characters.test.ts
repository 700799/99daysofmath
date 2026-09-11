import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Astronaut } from '../src/components/astro/Astronaut';
import { Mascot, type MascotMood } from '../src/components/Mascot';
import { Mascot as Crew, MASCOT_KINDS, GAME_MASCOT, CREW, type MascotExpr } from '../src/routes/arcade/Mascots';
import { ARCADE_GAMES } from '../src/routes/arcade/shared';
import { ICONS } from '../src/icons/registry';

// The app has one character family: astronauts in white suits with a navy
// visor, drawn in clean line art, holding mathematics. This replaced a
// green owl and a zoo of thirty-odd cartoon animals and blobs, and a coin
// glyph wherever the app paid out. These bars keep it that way.

const MOODS: MascotMood[] = ['happy', 'thinking', 'cheer', 'oops', 'sleep', 'helpful', 'coach', 'mentor', 'proud', 'wow'];
const EXPRS: MascotExpr[] = ['happy', 'surprised', 'dizzy', 'cheer', 'ko'];

describe('the mascot', () => {
  it('renders every mood as an astronaut, never an owl', () => {
    for (const mood of MOODS) {
      const html = renderToStaticMarkup(createElement(Mascot, { mood, oneShot: true }));
      expect(html, mood).toContain('<svg');
      expect(html.toLowerCase(), mood).not.toContain('owl');
      expect(html, mood).toContain('Astronaut');
    }
  });

  it('every mood looks different', () => {
    const seen = new Set(MOODS.map((mood) => renderToStaticMarkup(createElement(Astronaut, { ...{ expr: 'happy' }, title: mood }))));
    void seen;
    const drawings = MOODS.map((mood) => renderToStaticMarkup(createElement(Mascot, { mood, oneShot: true })).replace(/Astronaut mascot[^"]*/g, ''));
    expect(new Set(drawings).size).toBe(MOODS.length);
  });

  it('holds mathematics, not money', () => {
    const all = MOODS.map((mood) => renderToStaticMarkup(createElement(Mascot, { mood, oneShot: true }))).join('');
    expect(all).not.toMatch(/\$|💵|💰|🪙/);
    // The thinking and helpful moods carry a calculator and a π placard.
    expect(renderToStaticMarkup(createElement(Mascot, { mood: 'helpful', oneShot: true }))).toContain('π');
  });
});

describe('the arcade crew', () => {
  it('is eight astronauts with distinct trim colours', () => {
    expect(MASCOT_KINDS).toHaveLength(8);
    expect(new Set(MASCOT_KINDS.map((k) => CREW[k].accent)).size).toBe(8);
  });

  it('renders every member in every expression', () => {
    for (const kind of MASCOT_KINDS) {
      for (const expr of EXPRS) {
        const html = renderToStaticMarkup(createElement(Crew, { kind, expr }));
        expect(html, `${kind} ${expr}`).toContain('<svg');
      }
    }
  });

  it('hosts every arcade game with a crew member that exists', () => {
    for (const g of ARCADE_GAMES) {
      const kind = GAME_MASCOT[g.id];
      if (kind) expect(MASCOT_KINDS, `${g.id} → ${kind}`).toContain(kind);
    }
  });

  it('the old animals are gone from the kind list', () => {
    for (const old of ['frog', 'owl', 'dragon', 'robot', 'unicorn', 'panda', 'monkey', 'pet', 'clerk']) {
      expect(MASCOT_KINDS as string[]).not.toContain(old);
    }
  });
});

describe('icons', () => {
  it('has an astronaut where the owl was, and a π token where the coin was', () => {
    expect(ICONS).toHaveProperty('astro');
    expect(ICONS).not.toHaveProperty('owl');
    // the coin texture draws π from shapes, with no <text> so it rasterizes anywhere
    expect(ICONS.coin).not.toContain('<text');
    expect(ICONS.coin).toContain('<rect');
  });

  it('the favicon is the astronaut', () => {
    const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');
    expect(svg).toContain('visor');
    expect(svg).not.toMatch(/owl|beak/i);
  });
});

describe('no money in the interface', () => {
  // The app pays out in π. The only money left is in a budgeting game, where
  // money is the mathematics being taught.
  const ALLOWED = new Set(['src/routes/arcade/PocketTown.tsx', 'src/routes/arcade/DressToImpress.tsx', 'src/routes/arcade/MochiSurvivors.tsx']);
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const f of readdirSync(dir)) {
      const p = path.join(dir, f);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(tsx?|ts)$/.test(f)) out.push(p);
    }
    return out;
  };
  it('no coin, money-bag or owl glyphs in the app source', () => {
    const root = path.resolve(new URL('../src', import.meta.url).pathname);
    const hits: string[] = [];
    for (const f of walk(root)) {
      const rel = path.relative(path.resolve(root, '..'), f);
      if (ALLOWED.has(rel) || rel.startsWith('src/data/')) continue;
      const src = readFileSync(f, 'utf8');
      for (const g of ['🪙', '💰', '💵', '🦉']) if (src.includes(g)) hits.push(`${rel}: ${g}`);
    }
    expect(hits).toEqual([]);
  });
});
