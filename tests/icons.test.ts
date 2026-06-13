import { describe, it, expect } from 'vitest';
import {
  ICONS,
  ICON_NAMES,
  DOMAIN_ICONS,
  iconSvg,
  iconDataUri,
} from '../src/icons/registry';
import { DOMAINS } from '../src/types/problem';

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
});
