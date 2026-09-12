import { Astronaut, type AstroExpr, type AstroProp } from '../../components/astro/Astronaut';

// The arcade crew: eight astronauts, one per role, told apart by the colour
// of their suit trim and what they carry. Every game is hosted by one of
// them, so the arcade reads as one team rather than a zoo of unrelated
// characters.

export type MascotKind =
  | 'scout'
  | 'pilot'
  | 'engineer'
  | 'navigator'
  | 'captain'
  | 'rookie'
  | 'medic'
  | 'analyst';

export type MascotExpr = 'happy' | 'surprised' | 'dizzy' | 'cheer' | 'ko';

export const MASCOT_KINDS: MascotKind[] = [
  'scout', 'pilot', 'engineer', 'navigator', 'captain', 'rookie', 'medic', 'analyst',
];

export const CREW: Record<MascotKind, { name: string; accent: string; prop: AstroProp; star?: boolean }> = {
  scout: { name: 'Scout', accent: '#2E9E5B', prop: 'pi' },
  pilot: { name: 'Pilot', accent: '#2F6FD6', prop: 'graph' },
  engineer: { name: 'Engineer', accent: '#E8862E', prop: 'calculator' },
  navigator: { name: 'Navigator', accent: '#8B5CF6', prop: 'protractor' },
  captain: { name: 'Captain', accent: '#D9A21B', prop: 'none', star: true },
  rookie: { name: 'Rookie', accent: '#14A6A6', prop: 'none' },
  medic: { name: 'Medic', accent: '#E0527A', prop: 'root' },
  analyst: { name: 'Analyst', accent: '#8A6A3F', prop: 'sigma' },
};

const EXPR: Record<MascotExpr, AstroExpr> = {
  happy: 'happy',
  surprised: 'wow',
  dizzy: 'dizzy',
  cheer: 'cheer',
  ko: 'ko',
};

export function Mascot({
  kind,
  size = 96,
  expr = 'happy',
  className,
  title,
}: {
  kind: MascotKind;
  size?: number;
  expr?: MascotExpr;
  className?: string;
  title?: string;
}) {
  const c = CREW[kind] ?? CREW.rookie;
  return (
    <Astronaut
      accent={c.accent}
      prop={expr === 'cheer' ? 'none' : c.prop}
      pose={expr === 'cheer' ? 'arms-up' : 'stand'}
      sparkle={expr === 'cheer'}
      star={c.star}
      expr={EXPR[expr]}
      square
      size={size}
      className={className}
      title={title ?? `${c.name} the astronaut`}
    />
  );
}

// Maps every ARCADE_GAMES.id → the crew member who hosts it. Used on the hub
// tiles, the start splash, and the end card. Falls back to the rookie.
export const GAME_MASCOT: Record<string, MascotKind> = {
  connect4: 'scout',
  wheel: 'captain',
  memory: 'analyst',
  shootout: 'rookie',
  runner: 'pilot',
  platformer: 'scout',
  racer: 'pilot',
  digger: 'engineer',
  tiles: 'analyst',
  snake: 'scout',
  bricks: 'engineer',
  sudoku: 'analyst',
  tetris: 'engineer',
  boba: 'medic',
  sushi: 'medic',
  tictactoe: 'rookie',
  kpop: 'captain',
  survival: 'navigator',
  fruit: 'medic',
  town: 'engineer',
  sumo: 'captain',
  monster: 'navigator',
  turbo: 'pilot',
  wordle: 'analyst',
  hero: 'captain',
  escape: 'navigator',
  asteroids: 'pilot',
  tank: 'engineer',
  rig: 'engineer',
  mathpop: 'scout',
  dress: 'medic',
  taiko: 'rookie',
  shinobi: 'navigator',
  speedlab: 'engineer',
  fraction: 'analyst',
  chess: 'analyst',
  starhop: 'pilot',
  crawler: 'scout',
  carpenter: 'engineer',
};

export function gameMascot(id: string): MascotKind {
  return GAME_MASCOT[id] ?? 'rookie';
}
