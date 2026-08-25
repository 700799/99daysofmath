import * as s from './shapes';
import type { Domain } from '../types/problem';

/**
 * Every icon in the app, keyed by name. Values are inner SVG markup for a
 * `0 0 64 64` viewBox — render via the React <Icon> component or load into
 * Phaser with `loadIconTextures`.
 */
export const ICONS = {
  star: s.star,
  'star-dim': s.starDim,
  coin: s.coin,
  trophy: s.trophy,
  'medal-gold': s.medalGold,
  'medal-silver': s.medalSilver,
  'medal-bronze': s.medalBronze,
  dice: s.dice,
  kart: s.kart,
  owl: s.owl,
  fox: s.fox,
  turtle: s.turtle,
  rabbit: s.rabbit,
  flag: s.flag,
  lock: s.lock,
  controller: s.controller,
  party: s.party,
  check: s.check,
  bolt: s.bolt,
  bulb: s.bulb,
  book: s.book,
  play: s.play,
  scale: s.scale,
  numberline: s.numberline,
  equation: s.equation,
  shapes: s.shapes,
  chart: s.chart,
} as const;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

/** Icon for each math domain (palettes match DOMAIN_COLORS). */
export const DOMAIN_ICONS: Record<Domain, IconName> = {
  '5.F': 'book',
  '6.RP': 'scale',
  '6.NS': 'numberline',
  '6.EE': 'equation',
  '6.G': 'shapes',
  '6.SP': 'chart',
  A1: 'equation',
  PC: 'chart',
};

/** Full standalone SVG document for an icon, rasterized at `px` square. */
export function iconSvg(name: IconName, px: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${px}" height="${px}">${ICONS[name]}</svg>`;
}

/** Data URI for an icon, e.g. for an <img> src or a Phaser texture. */
export function iconDataUri(name: IconName, px = 128): string {
  return `data:image/svg+xml,${encodeURIComponent(iconSvg(name, px))}`;
}
