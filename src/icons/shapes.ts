// Hand-drawn SVG icon bodies (inner markup for a 0 0 64 64 viewBox).
// Design language: flat rounded shapes, 2–3 tone fills, soft highlights,
// no outlines except where a white shape needs definition, and no <text>
// elements (so icons rasterize identically everywhere, fonts or not).
//
// These strings are shared by the React <Icon> component and the Phaser
// texture loader, so every star/coin/character looks the same in both worlds.

const GREEN = '#58CC02';
const GREEN_D = '#46A302';
const GREEN_L = '#8EE000';
const BLUE = '#1CB0F6';
const BLUE_D = '#1899D6';
const PURPLE = '#CE82FF';
const VIOLET = '#7C3AED';
const ORANGE = '#FF9600';
const ORANGE_D = '#E07A00';
const RED = '#FF4B4B';
const RED_D = '#E03E3E';
const YELLOW = '#FFC800';
const YELLOW_D = '#F0A800';
const YELLOW_L = '#FFDE59';
const INK = '#0F172A';
const SLATE = '#64748B';
const SLATE_L = '#94A3B8';
const CLOUD = '#E2E8F0';
const SNOW = '#F8FAFC';
const WHITE = '#FFFFFF';

/** Five-point star path centered at (cx, cy); inner radius is 48% of outer. */
function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.48;
    pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)} ${(cy + rad * Math.sin(ang)).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
}

/** Plump star: fill + same-color round-join stroke fakes rounded points. */
function plumpStar(cx: number, cy: number, r: number, fill: string, strokeW = 6): string {
  return `<path d="${starPath(cx, cy, r)}" fill="${fill}" stroke="${fill}" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
}

export const star = `
${plumpStar(32, 33, 24, YELLOW)}
<circle cx="24" cy="24" r="3" fill="${WHITE}" opacity="0.75"/>`;

export const starDim = `
${plumpStar(32, 33, 24, CLOUD)}
<circle cx="24" cy="24" r="3" fill="${WHITE}" opacity="0.45"/>`;

export const coin = `
<circle cx="32" cy="32" r="27.5" fill="${YELLOW}"/>
<circle cx="32" cy="32" r="20.5" fill="${YELLOW_L}"/>
${plumpStar(32, 32.5, 11, YELLOW_D, 4)}
<ellipse cx="22" cy="18" rx="6" ry="3.6" fill="${WHITE}" opacity="0.55" transform="rotate(-35 22 18)"/>`;

export const trophy = `
<path d="M15 17 H7 q0 12 11 13" fill="none" stroke="${YELLOW_D}" stroke-width="5" stroke-linecap="round"/>
<path d="M49 17 h8 q0 12 -11 13" fill="none" stroke="${YELLOW_D}" stroke-width="5" stroke-linecap="round"/>
<path d="M16 14 H48 V25 q0 14 -16 14 t-16 -14 Z" fill="${YELLOW}"/>
<rect x="13" y="7" width="38" height="7" rx="3.5" fill="${YELLOW_L}"/>
${plumpStar(32, 26, 6.5, YELLOW_D, 3)}
<rect x="20.5" y="17" width="5" height="12" rx="2.5" fill="${WHITE}" opacity="0.45"/>
<rect x="28" y="38.5" width="8" height="8" rx="2" fill="${YELLOW_D}"/>
<rect x="19" y="46" width="26" height="6" rx="3" fill="${YELLOW_D}"/>
<rect x="16" y="52" width="32" height="6" rx="3" fill="#C2780A"/>`;

function medal(base: string, light: string, dark: string): string {
  return `
<path d="M21 3 H31 L29 24 L19 21 Z" fill="${RED}"/>
<path d="M33 3 H43 L45 21 L35 24 Z" fill="${BLUE_D}"/>
<circle cx="32" cy="40" r="16.5" fill="${base}"/>
<circle cx="32" cy="40" r="12" fill="${light}"/>
${plumpStar(32, 40.5, 7.5, dark, 3)}`;
}

export const medalGold = medal(YELLOW, YELLOW_L, YELLOW_D);
export const medalSilver = medal('#AFBCCB', '#E2E9F1', '#8295A9');
export const medalBronze = medal('#DD8A5B', '#F0B08A', '#B86436');

export const dice = `
<g transform="rotate(-8 32 32)">
  <rect x="8.5" y="8.5" width="47" height="47" rx="12" fill="${WHITE}" stroke="${CLOUD}" stroke-width="2.5"/>
  <circle cx="22" cy="22" r="4.6" fill="${VIOLET}"/>
  <circle cx="42" cy="22" r="4.6" fill="${VIOLET}"/>
  <circle cx="32" cy="32" r="4.6" fill="${VIOLET}"/>
  <circle cx="22" cy="42" r="4.6" fill="${VIOLET}"/>
  <circle cx="42" cy="42" r="4.6" fill="${VIOLET}"/>
</g>`;

export const kart = `
<rect x="2" y="24" width="13" height="5" rx="2.5" fill="${RED_D}"/>
<rect x="6.5" y="27" width="4.5" height="8" rx="2" fill="${RED_D}"/>
<circle cx="32" cy="27" r="8" fill="${BLUE}"/>
<circle cx="35.5" cy="26.5" r="3.2" fill="#E0F2FE"/>
<path d="M22 34 q10 -8 20 0 Z" fill="${RED_D}"/>
<rect x="4" y="32" width="56" height="12" rx="6" fill="${RED}"/>
<rect x="9" y="34.5" width="15" height="4" rx="2" fill="${WHITE}" opacity="0.4"/>
<circle cx="17" cy="46" r="8.5" fill="${INK}"/>
<circle cx="17" cy="46" r="3.6" fill="${SLATE_L}"/>
<circle cx="47" cy="46" r="8.5" fill="${INK}"/>
<circle cx="47" cy="46" r="3.6" fill="${SLATE_L}"/>`;

export const owl = `
<path d="M15 17 L21 4 L28 12 Z" fill="${GREEN_D}"/>
<path d="M49 17 L43 4 L36 12 Z" fill="${GREEN_D}"/>
<ellipse cx="32" cy="36" rx="22" ry="24" fill="${GREEN}"/>
<ellipse cx="12.5" cy="38" rx="6.5" ry="13" fill="${GREEN_D}"/>
<ellipse cx="51.5" cy="38" rx="6.5" ry="13" fill="${GREEN_D}"/>
<ellipse cx="32" cy="46" rx="12.5" ry="11" fill="#D7FFB8"/>
<circle cx="24" cy="26" r="9" fill="${WHITE}"/>
<circle cx="40" cy="26" r="9" fill="${WHITE}"/>
<circle cx="25.5" cy="27" r="4" fill="${INK}"/>
<circle cx="38.5" cy="27" r="4" fill="${INK}"/>
<circle cx="26.8" cy="25.5" r="1.4" fill="${WHITE}"/>
<circle cx="39.8" cy="25.5" r="1.4" fill="${WHITE}"/>
<path d="M32 33 L26.5 37.5 Q32 43 37.5 37.5 Z" fill="${ORANGE}"/>
<ellipse cx="25" cy="59.5" rx="4" ry="2.8" fill="${ORANGE}"/>
<ellipse cx="39" cy="59.5" rx="4" ry="2.8" fill="${ORANGE}"/>`;

export const fox = `
<path d="M8 24 L13 3 L29 13 Z" fill="${ORANGE}"/>
<path d="M12.5 20 L15.5 8.5 L24.5 14.5 Z" fill="${ORANGE_D}"/>
<path d="M56 24 L51 3 L35 13 Z" fill="${ORANGE}"/>
<path d="M51.5 20 L48.5 8.5 L39.5 14.5 Z" fill="${ORANGE_D}"/>
<ellipse cx="32" cy="36" rx="23" ry="22" fill="${ORANGE}"/>
<ellipse cx="23" cy="45" rx="11" ry="10" fill="${WHITE}"/>
<ellipse cx="41" cy="45" rx="11" ry="10" fill="${WHITE}"/>
<circle cx="21" cy="31" r="3.2" fill="${INK}"/>
<circle cx="43" cy="31" r="3.2" fill="${INK}"/>
<circle cx="22" cy="30" r="1.1" fill="${WHITE}"/>
<circle cx="44" cy="30" r="1.1" fill="${WHITE}"/>
<circle cx="32" cy="42" r="3.6" fill="${INK}"/>`;

export const turtle = `
<path d="M8 40 L2.5 44 L9 46.5 Z" fill="${GREEN_L}"/>
<rect x="16" y="42" width="9" height="11" rx="4.5" fill="${GREEN_L}"/>
<rect x="38" y="42" width="9" height="11" rx="4.5" fill="${GREEN_L}"/>
<circle cx="55.5" cy="36" r="7.5" fill="${GREEN_L}"/>
<circle cx="57.5" cy="33.8" r="1.7" fill="${INK}"/>
<path d="M11 39 a21 19 0 0 1 42 0 Z" fill="${GREEN}"/>
<circle cx="22" cy="30" r="3.8" fill="${GREEN_D}"/>
<circle cx="33" cy="24" r="4.2" fill="${GREEN_D}"/>
<circle cx="42" cy="31" r="3.5" fill="${GREEN_D}"/>
<rect x="8" y="37" width="46" height="9" rx="4.5" fill="${GREEN_D}"/>`;

export const rabbit = `
<ellipse cx="24" cy="15" rx="7" ry="14" fill="${SNOW}" stroke="${CLOUD}" stroke-width="2"/>
<ellipse cx="40" cy="15" rx="7" ry="14" fill="${SNOW}" stroke="${CLOUD}" stroke-width="2"/>
<ellipse cx="24" cy="17" rx="3.2" ry="9" fill="#FBCFE8"/>
<ellipse cx="40" cy="17" rx="3.2" ry="9" fill="#FBCFE8"/>
<circle cx="32" cy="39" r="17.5" fill="${SNOW}" stroke="${CLOUD}" stroke-width="2"/>
<circle cx="25.5" cy="37" r="2.9" fill="${INK}"/>
<circle cx="38.5" cy="37" r="2.9" fill="${INK}"/>
<circle cx="26.4" cy="36" r="1" fill="${WHITE}"/>
<circle cx="39.4" cy="36" r="1" fill="${WHITE}"/>
<path d="M29 41.5 H35 L32 45 Z" fill="#F472B6"/>
<ellipse cx="20" cy="44" rx="3.4" ry="2.2" fill="#FBCFE8"/>
<ellipse cx="44" cy="44" rx="3.4" ry="2.2" fill="#FBCFE8"/>`;

export const flag = `
<circle cx="10.2" cy="6.5" r="3" fill="${SLATE}"/>
<rect x="8" y="6" width="4.5" height="52" rx="2.25" fill="${SLATE_L}"/>
<rect x="13" y="8" width="42" height="26" rx="4" fill="${WHITE}" stroke="${CLOUD}" stroke-width="2"/>
<rect x="15" y="10" width="9.5" height="11" fill="${INK}"/>
<rect x="34" y="10" width="9.5" height="11" fill="${INK}"/>
<rect x="24.5" y="21" width="9.5" height="11" fill="${INK}"/>
<rect x="43.5" y="21" width="9.5" height="11" fill="${INK}"/>`;

export const lock = `
<path d="M22 30 V19.5 a10 10 0 0 1 20 0 V30" fill="none" stroke="${SLATE_L}" stroke-width="7" stroke-linecap="round"/>
<rect x="13.5" y="27" width="37" height="27" rx="10" fill="${YELLOW}"/>
<rect x="19" y="32" width="4.5" height="10" rx="2.25" fill="${WHITE}" opacity="0.4"/>
<circle cx="32" cy="38" r="4.2" fill="#C2780A"/>
<rect x="30" y="40.5" width="4" height="8" rx="2" fill="#C2780A"/>`;

export const controller = `
<circle cx="14" cy="41" r="9" fill="${VIOLET}"/>
<circle cx="50" cy="41" r="9" fill="${VIOLET}"/>
<rect x="5" y="21" width="54" height="23" rx="11.5" fill="${VIOLET}"/>
<rect x="12" y="28" width="16" height="5.5" rx="2.75" fill="${WHITE}"/>
<rect x="17.25" y="22.75" width="5.5" height="16" rx="2.75" fill="${WHITE}"/>
<circle cx="47" cy="25.5" r="3" fill="${YELLOW}"/>
<circle cx="52.5" cy="31" r="3" fill="${GREEN_L}"/>
<circle cx="47" cy="36.5" r="3" fill="${RED}"/>
<circle cx="41.5" cy="31" r="3" fill="${BLUE}"/>`;

export const party = `
<path d="M8 56 L24 27 L37 40 Z" fill="${ORANGE}"/>
<path d="M12 52 L23.5 31.5 L33 41 Z" fill="${YELLOW_L}"/>
<path d="M30 22 q6 -8 14 -6" fill="none" stroke="${RED}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M36 33 q9 0 13 6" fill="none" stroke="${BLUE}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="33" y="13" width="6" height="3" rx="1.5" fill="${PURPLE}" transform="rotate(25 36 14.5)"/>
<rect x="52" y="28" width="6" height="3" rx="1.5" fill="${RED}" transform="rotate(-20 55 29.5)"/>
<circle cx="45" cy="7" r="3" fill="${YELLOW}"/>
<circle cx="58" cy="14" r="2.6" fill="${GREEN_L}"/>
<circle cx="41" cy="22" r="2.6" fill="${BLUE}"/>
<circle cx="55" cy="44" r="2.6" fill="${GREEN}"/>`;

export const check = `
<circle cx="32" cy="32" r="26" fill="${GREEN}"/>
<path d="M19.5 33.5 L28.5 42 L45 23.5" fill="none" stroke="${WHITE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;

export const bolt = `
<path d="M36.5 3.5 L13.5 36 H27 L23 60.5 L50.5 25.5 H35 Z" fill="${YELLOW}" stroke="${YELLOW}" stroke-width="3" stroke-linejoin="round"/>`;

export const bulb = `
<rect x="30.5" y="1" width="3" height="8" rx="1.5" fill="${YELLOW_D}"/>
<rect x="12" y="7" width="3" height="8" rx="1.5" fill="${YELLOW_D}" transform="rotate(-40 13.5 11)"/>
<rect x="49" y="7" width="3" height="8" rx="1.5" fill="${YELLOW_D}" transform="rotate(40 50.5 11)"/>
<circle cx="32" cy="27" r="15.5" fill="${YELLOW}"/>
<circle cx="26.5" cy="21.5" r="5.5" fill="${YELLOW_L}"/>
<circle cx="26.5" cy="27" r="1.8" fill="${YELLOW_D}"/>
<circle cx="37.5" cy="27" r="1.8" fill="${YELLOW_D}"/>
<path d="M26.5 31 q5.5 5 11 0" fill="none" stroke="${YELLOW_D}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="25" y="42.5" width="14" height="4.5" rx="2.25" fill="${SLATE_L}"/>
<rect x="26.5" y="48.5" width="11" height="4" rx="2" fill="${SLATE_L}"/>
<rect x="28.5" y="54" width="7" height="3" rx="1.5" fill="${CLOUD}"/>`;

export const book = `
<path d="M7 15 Q19 10 31 15 V51 Q19 46 7 51 Z" fill="${BLUE_D}"/>
<path d="M57 15 Q45 10 33 15 V51 Q45 46 57 51 Z" fill="${BLUE_D}"/>
<path d="M10 18 Q20 14 30 18 V47 Q20 43 10 47 Z" fill="${WHITE}"/>
<path d="M54 18 Q44 14 34 18 V47 Q44 43 54 47 Z" fill="${WHITE}"/>
<rect x="30.5" y="14" width="3" height="37" rx="1.5" fill="${BLUE_D}"/>
<rect x="14" y="24" width="12" height="2.5" rx="1.25" fill="${CLOUD}"/>
<rect x="14" y="30" width="12" height="2.5" rx="1.25" fill="${CLOUD}"/>
<rect x="14" y="36" width="12" height="2.5" rx="1.25" fill="${CLOUD}"/>
<rect x="38" y="24" width="12" height="2.5" rx="1.25" fill="${CLOUD}"/>
<rect x="38" y="30" width="12" height="2.5" rx="1.25" fill="${CLOUD}"/>
<rect x="38" y="36" width="12" height="2.5" rx="1.25" fill="${CLOUD}"/>`;

export const play = `
<path d="M23 17.5 L48.5 32 L23 46.5 Z" fill="${WHITE}" stroke="${WHITE}" stroke-width="5" stroke-linejoin="round"/>`;

// ---- domain icons (palettes echo DOMAIN_COLORS) -------------------------

export const scale = `
<circle cx="32" cy="11" r="3.5" fill="${SLATE}"/>
<rect x="30" y="12" width="4" height="30" rx="2" fill="${SLATE}"/>
<rect x="10" y="13.2" width="44" height="4" rx="2" fill="${SLATE}"/>
<path d="M12 17 L7 29 M12 17 L21 29 M52 17 L47 29 M52 17 L57 29" fill="none" stroke="${SLATE_L}" stroke-width="2.2" stroke-linecap="round"/>
<path d="M3 29 a11 8 0 0 0 22 0 Z" fill="${GREEN}"/>
<path d="M39 29 a11 8 0 0 0 22 0 Z" fill="${GREEN}"/>
<rect x="22" y="42" width="20" height="5" rx="2.5" fill="${SLATE}"/>
<rect x="18" y="47" width="28" height="6" rx="3" fill="${SLATE_L}"/>`;

export const numberline = `
<rect x="4" y="30.5" width="50" height="3.5" rx="1.75" fill="${SLATE}"/>
<path d="M54 25.5 L62 32.2 L54 39 Z" fill="${SLATE}"/>
<rect x="12" y="26.5" width="3" height="12" rx="1.5" fill="${SLATE_L}"/>
<rect x="24" y="26.5" width="3" height="12" rx="1.5" fill="${SLATE_L}"/>
<rect x="36" y="26.5" width="3" height="12" rx="1.5" fill="${SLATE_L}"/>
<rect x="48" y="26.5" width="3" height="12" rx="1.5" fill="${SLATE_L}"/>
<circle cx="13.5" cy="32.2" r="5" fill="${BLUE}"/>
<circle cx="37.5" cy="32.2" r="5" fill="${YELLOW}"/>`;

export const equation = `
<rect x="8" y="10" width="48" height="44" rx="10" fill="${WHITE}" stroke="${CLOUD}" stroke-width="2.5"/>
<rect x="18.25" y="23.5" width="5.5" height="17" rx="2.75" fill="${PURPLE}" transform="rotate(45 21 32)"/>
<rect x="18.25" y="23.5" width="5.5" height="17" rx="2.75" fill="${PURPLE}" transform="rotate(-45 21 32)"/>
<rect x="30" y="26.5" width="12" height="5" rx="2.5" fill="${SLATE_L}"/>
<rect x="30" y="33.5" width="12" height="5" rx="2.5" fill="${SLATE_L}"/>
<rect x="45" y="26.5" width="10" height="11" rx="3" fill="${YELLOW}"/>`;

export const shapes = `
<path d="M19 6 L33 29 H5 Z" fill="${ORANGE}" stroke="${ORANGE}" stroke-width="4" stroke-linejoin="round"/>
<rect x="35" y="10" width="21" height="21" rx="5" fill="${BLUE}" transform="rotate(9 45.5 20.5)"/>
<circle cx="23" cy="45" r="12.5" fill="${PURPLE}"/>`;

export const chart = `
<rect x="9" y="7" width="4" height="46" rx="2" fill="${SLATE_L}"/>
<rect x="9" y="49" width="48" height="4" rx="2" fill="${SLATE_L}"/>
<rect x="17" y="33" width="9" height="16" rx="3" fill="${RED}"/>
<rect x="30" y="23" width="9" height="26" rx="3" fill="${YELLOW}"/>
<rect x="43" y="12" width="9" height="37" rx="3" fill="${GREEN}"/>`;
