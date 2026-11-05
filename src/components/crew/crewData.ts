// The Launch Bay crew: ten small monsters that live on the Home page and in
// the Collection. Every one shares the same body (cat ears, big eyes, a toothy
// mouth, thick outline); they differ by colour, eyes, mouth and one prop.
//
// The drawing is a static SVG string built from these fields, so a crew member
// renders identically at 28px in a bay and at 120px in the Collection.

export type CrewEyes = 'wide' | 'wink' | 'sleepy' | 'star' | 'angry' | 'happy' | 'cross';
export type CrewMouth = 'grin' | 'teeth' | 'o' | 'smile' | 'tongue' | 'gap';
export type CrewExtra = 'antenna' | 'bow' | 'helmet' | 'sign' | 'phones' | 'wave';

export interface CrewMember {
  id: string;
  name: string;
  blurb: string;
  /** Skin and shading. */
  c: string;
  c2: string;
  /** Prop colour. */
  acc?: string;
  eyes: CrewEyes;
  mouth: CrewMouth;
  extra?: CrewExtra;
  /** Stickers needed before this crew member joins the Collection. */
  unlockAt: number;
}

export const CREW: CrewMember[] = [
  { id: 'butter', name: 'Butter', blurb: 'The first one aboard. Peeks over whatever you are working on.', c: '#f5e9a8', c2: '#e9d98c', eyes: 'wide', mouth: 'grin', unlockAt: 0 },
  { id: 'pilot', name: 'Pilot', blurb: 'Flies the saucer. Never lands.', c: '#c8ff9a', c2: '#aef07a', acc: '#5ee7ff', eyes: 'wide', mouth: 'grin', extra: 'helmet', unlockAt: 1 },
  { id: 'dozer', name: 'Dozer', blurb: 'Sits on the cargo line and naps between problems.', c: '#d9c7ff', c2: '#c3adf5', eyes: 'sleepy', mouth: 'smile', unlockAt: 3 },
  { id: 'pi', name: 'Pi holder', blurb: 'Holds up the π sign so nobody forgets it.', c: '#fff4d6', c2: '#f0e4c2', acc: '#ffd166', eyes: 'wide', mouth: 'smile', extra: 'sign', unlockAt: 5 },
  { id: 'comet', name: 'Comet', blurb: 'Always amazed. The antenna picks up good answers.', c: '#9be9ff', c2: '#7fd6f2', acc: '#ff6ad5', eyes: 'wide', mouth: 'o', extra: 'antenna', unlockAt: 8 },
  { id: 'starstruck', name: 'Starstruck', blurb: 'Celebrates every finished course.', c: '#ffc2e3', c2: '#f5a8d2', acc: '#5ee7ff', eyes: 'star', mouth: 'grin', extra: 'bow', unlockAt: 12 },
  { id: 'grump', name: 'Grump', blurb: 'Guards the courses you have not started yet.', c: '#ffb37a', c2: '#f29a5c', eyes: 'angry', mouth: 'teeth', unlockAt: 16 },
  { id: 'waver', name: 'Waver', blurb: 'Says hello from the corner. Slightly cross-eyed.', c: '#bfe0ff', c2: '#a3ccf5', eyes: 'cross', mouth: 'gap', extra: 'wave', unlockAt: 20 },
  { id: 'mint', name: 'Mint wink', blurb: 'Winks when you get a streak going.', c: '#b9f5d0', c2: '#9fe6b8', acc: '#ff6ad5', eyes: 'wink', mouth: 'tongue', unlockAt: 25 },
  { id: 'dj', name: 'DJ', blurb: 'Keeps the beat while you practise.', c: '#ffd0b8', c2: '#f5b89c', acc: '#a78bfa', eyes: 'happy', mouth: 'grin', extra: 'phones', unlockAt: 30 },
];

export function crewById(id: string): CrewMember {
  const m = CREW.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown crew member: ${id}`);
  return m;
}

/** Crew members who have joined, given the number of stickers earned. */
export function crewUnlocked(stickerCount: number): CrewMember[] {
  return CREW.filter((m) => stickerCount >= m.unlockAt);
}

// ── Drawing ──────────────────────────────────────────────────────────────

function eye(cx: number, cy: number, r: number, px: number, py: number): string {
  return `<g class="crew-eye"><circle class="wht" cx="${cx}" cy="${cy}" r="${r}"/><circle class="blk nostroke" cx="${cx + px}" cy="${cy + py}" r="${r * 0.42}"/><circle class="wht nostroke" cx="${cx + px + r * 0.14}" cy="${cy + py - r * 0.16}" r="${r * 0.13}"/></g>`;
}

function eyes(k: CrewEyes): string {
  let s = '';
  switch (k) {
    case 'wide':
      s = eye(84, 78, 23, 5, 2) + eye(128, 76, 21, 4, 3);
      break;
    case 'wink':
      s = eye(84, 78, 23, 6, 2) + '<path class="thin" fill="none" d="M110 78 Q128 70 146 78"/>';
      break;
    case 'sleepy':
      s =
        eye(84, 78, 23, 0, 6) +
        eye(128, 76, 21, 0, 6) +
        '<path class="skin2 nostroke" d="M61 78 A23 23 0 0 1 107 78 Z"/><path class="skin2 nostroke" d="M107 76 A21 21 0 0 1 149 76 Z"/><path class="thin" fill="none" d="M61 78 L107 78 M107 76 L149 76"/>';
      break;
    case 'star':
      s =
        '<g class="crew-eye"><circle class="wht" cx="84" cy="78" r="23"/><path class="acc nostroke" d="M84 64l4 9 10 1-7 6 2 10-9-5-9 5 2-10-7-6 10-1z"/></g>' +
        '<g class="crew-eye"><circle class="wht" cx="128" cy="76" r="21"/><path class="acc nostroke" d="M128 63l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/></g>';
      break;
    case 'angry':
      s = eye(84, 80, 22, 3, -2) + eye(128, 78, 20, 2, -1) + '<path d="M62 56 L104 68" fill="none"/><path d="M150 54 L110 66" fill="none"/>';
      break;
    case 'happy':
      s = '<path fill="none" d="M66 82 Q84 64 102 82"/><path fill="none" d="M112 80 Q128 62 144 80"/>';
      break;
    case 'cross':
      s = eye(84, 78, 23, 8, 3) + eye(128, 76, 21, -7, 3);
      break;
  }
  return `<g class="crew-eyes">${s}</g>`;
}

const TOP_TEETH = '<path class="wht nostroke" d="M72 122 l10 16 l6-16 l10 16 l6-16 l10 16 l6-16 l10 16 l6-16 l8 16 l6-16z"/>';
const BOTTOM_TEETH = '<path class="wht nostroke" d="M76 158 l9-14 l6 14 l9-14 l6 14 l9-14 l6 14 l9-14 l6 14 l8-14 l6 14z"/>';

function mouth(k: CrewMouth): string {
  switch (k) {
    case 'grin':
      return '<ellipse class="blk" cx="106" cy="140" rx="42" ry="26"/>' + TOP_TEETH + BOTTOM_TEETH;
    case 'teeth':
      return '<ellipse class="blk" cx="106" cy="140" rx="44" ry="24"/>' + TOP_TEETH + BOTTOM_TEETH;
    case 'o':
      return '<ellipse class="blk" cx="106" cy="142" rx="24" ry="30"/><path class="wht nostroke" d="M90 118 l6 12 l5-12 l6 12 l5-12 l5 12 l5-12z"/>';
    case 'smile':
      return '<path fill="none" d="M74 134 Q106 162 138 134"/><path class="wht nostroke" d="M88 140 l6 10 l6-10z M112 140 l6 10 l6-10z"/>';
    case 'tongue':
      return '<ellipse class="blk" cx="106" cy="140" rx="40" ry="24"/>' + TOP_TEETH + '<ellipse class="acc" cx="112" cy="156" rx="13" ry="10"/>';
    case 'gap':
      return (
        '<ellipse class="blk" cx="106" cy="140" rx="42" ry="26"/><path class="wht nostroke" d="M72 122 l10 16 l6-16 l10 16 l6-16z M128 122 l10 16 l6-16 l8 16 l6-16z"/>' +
        BOTTOM_TEETH
      );
  }
}

function extra(k: CrewExtra | undefined): string {
  switch (k) {
    case 'antenna':
      return '<path fill="none" d="M106 30 Q104 8 118 6"/><circle class="acc" cx="120" cy="6" r="6"/>';
    case 'bow':
      return '<path class="acc" d="M150 22 l-14 10 14 10z M150 22 l14 10 -14 10z"/><circle class="acc" cx="150" cy="32" r="4"/>';
    case 'helmet':
      return '<ellipse cx="106" cy="86" rx="76" ry="70" fill="rgba(94,231,255,.10)" stroke="#5ee7ff" stroke-width="4"/><path d="M50 60 Q60 30 92 24" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>';
    case 'sign':
      return '<rect class="acc" x="152" y="96" width="54" height="40" rx="4"/><text x="179" y="126" text-anchor="middle" font-family="Rajdhani,sans-serif" font-weight="700" font-size="30" fill="#0d0f14" stroke="none">π</text><path d="M176 136 L176 160"/>';
    case 'phones':
      return '<path fill="none" d="M46 86 Q50 30 106 30 Q162 30 166 86"/><rect class="acc" x="36" y="80" width="18" height="30" rx="8"/><rect class="acc" x="158" y="78" width="18" height="30" rx="8"/>';
    default:
      return '';
  }
}

const BRAIN =
  '<g class="crew-brain"><path fill="#ff9ad5" stroke="#0d0f14" stroke-width="5" d="M66 30 C56 12 76 0 90 10 C96 -6 120 -6 126 10 C142 0 162 14 150 32 C150 40 140 44 132 40 L80 40 C70 44 62 40 66 30 Z"/><path fill="none" stroke="#0d0f14" stroke-width="3" d="M106 4 C104 16 110 26 106 40 M82 18 C90 24 92 30 88 38 M130 18 C122 24 120 30 124 38"/></g>';

/** The inner markup of a crew member's <svg> (viewBox "-6 -40 224 286"). */
export function crewSvgMarkup(m: CrewMember): string {
  const armR =
    m.extra === 'wave'
      ? '<g class="crew-arm"><path class="skin" d="M158 112 C190 95 196 60 172 48 L162 54 C178 66 170 90 150 104 Z"/><path class="thin" fill="none" d="M172 48 l-6-6 M166 52 l-7-5"/></g>'
      : '<rect class="skin" x="152" y="108" width="26" height="74" rx="13"/><path class="thin" fill="none" d="M160 182 v-8 M166 182 v-8 M172 182 v-7"/>';
  const armL =
    '<rect class="skin" x="26" y="104" width="26" height="74" rx="13"/><path class="thin" fill="none" d="M34 178 v-8 M40 178 v-8 M46 178 v-7"/>';
  return (
    '<g class="crew-body">' +
    BRAIN +
    '<path class="skin" d="M58 46 L40 8 L88 34 Z"/><path class="skin" d="M120 34 L162 6 L154 48 Z"/>' +
    '<path class="skin" d="M45 92 C45 48 72 30 106 30 C140 30 164 50 164 92 L164 190 C164 206 152 214 138 214 L72 214 C58 214 45 206 45 190 Z"/>' +
    '<path class="skin2 nostroke" d="M52 150 C52 190 60 206 72 208 L138 208 C150 206 158 190 158 150 L158 196 C158 204 150 208 138 208 L72 208 C60 208 52 204 52 196 Z"/>' +
    armL +
    armR +
    '<rect class="skin" x="60" y="200" width="34" height="34" rx="12"/><rect class="skin" x="116" y="200" width="34" height="34" rx="12"/>' +
    '<path class="thin" fill="none" d="M70 234 v-7 M78 234 v-7 M86 234 v-6 M126 234 v-7 M134 234 v-7 M142 234 v-6"/>' +
    eyes(m.eyes) +
    mouth(m.mouth) +
    extra(m.extra) +
    '</g>'
  );
}
