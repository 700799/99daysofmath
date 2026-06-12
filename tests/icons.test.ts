import { describe, it, expect } from 'vitest';
import {
  ICONS,
  ICON_NAMES,
  DOMAIN_ICONS,
  iconSvg,
  iconDataUri,
} from '../src/icons/registry';
import { DOMAINS } from '../src/types/problem';
import { REWARD_GAMES, MEDAL_ICONS } from '../src/rewards/economy';
import { makePlayers } from '../src/rewards/partyBoard';
import { GRAND_PRIX_CONFIG } from '../src/rewards/grandPrix';

describe('icon registry', () => {
  it('has non-empty markup for every icon', () => {
    for (const name of ICON_NAMES) {
      const body = ICONS[name];
      expect(body.length, name).toBeGreaterThan(20);
      expect(body, name).toMatch(/<(path|circle|rect|ellipse|g)\b/);
    }
  });

  it('uses no <text> elements (icons must not depend on fonts)', () => {
    for (const name of ICON_NAMES) {
      expect(ICONS[name], name).not.toContain('<text');
    }
  });

  it('contains no NaN coordinates from path math', () => {
    for (const name of ICON_NAMES) {
      expect(ICONS[name], name).not.toContain('NaN');
    }
  });

  it('builds a standalone SVG document with explicit raster size', () => {
    const svg = iconSvg('star', 128);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 64 64"');
    expect(svg).toContain('width="128"');
  });

  it('builds an encoded data URI', () => {
    const uri = iconDataUri('owl', 64);
    expect(uri.startsWith('data:image/svg+xml,')).toBe(true);
    expect(decodeURIComponent(uri)).toContain('<svg');
  });
});

describe('icon references resolve', () => {
  it('every domain has an icon', () => {
    for (const d of DOMAINS) {
      expect(ICONS[DOMAIN_ICONS[d]], d).toBeDefined();
    }
  });

  it('every reward game and medal has an icon', () => {
    for (const g of REWARD_GAMES) expect(ICONS[g.icon], g.id).toBeDefined();
    for (const icon of Object.values(MEDAL_ICONS)) expect(ICONS[icon]).toBeDefined();
  });

  it('party players and race rivals have icons', () => {
    for (const p of makePlayers()) expect(ICONS[p.icon], p.id).toBeDefined();
    for (const r of GRAND_PRIX_CONFIG.rivals) expect(ICONS[r.icon], r.name).toBeDefined();
  });
});
