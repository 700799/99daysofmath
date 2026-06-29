// Original SVG mascots — hand-built cute vector characters (bold outline, flat
// fills, rosy cheeks) for a "fuller" illustrated look than flat emoji. All
// original art, no trademarked designs. Used by the champion cinematic and the
// arcade hub. Pilot set of four: dragon, robot, frog, and a pocket-pet chick.

export type MascotKind = 'dragon' | 'robot' | 'frog' | 'pet';

const OUTLINE = { stroke: '#1f2937', strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Dragon() {
  return (
    <g {...OUTLINE}>
      <path d="M30 52 Q9 36 16 60 Q25 57 33 63 Z" fill="#a78bfa" />
      <path d="M70 52 Q91 36 84 60 Q75 57 67 63 Z" fill="#a78bfa" />
      <ellipse cx="50" cy="63" rx="26" ry="24" fill="#34d399" />
      <ellipse cx="50" cy="69" rx="15" ry="13" fill="#d1fae5" stroke="none" />
      <circle cx="50" cy="40" r="22" fill="#34d399" />
      <path d="M38 22 L34 9 L45 20 Z" fill="#fcd34d" />
      <path d="M62 22 L66 9 L55 20 Z" fill="#fcd34d" />
      <ellipse cx="50" cy="46" rx="12" ry="8" fill="#6ee7b7" stroke="none" />
      <circle cx="46" cy="46" r="1.6" fill="#1f2937" stroke="none" />
      <circle cx="54" cy="46" r="1.6" fill="#1f2937" stroke="none" />
      <circle cx="42" cy="36" r="5.5" fill="#fff" />
      <circle cx="58" cy="36" r="5.5" fill="#fff" />
      <circle cx="43" cy="37" r="2.6" fill="#1f2937" stroke="none" />
      <circle cx="59" cy="37" r="2.6" fill="#1f2937" stroke="none" />
      <circle cx="35" cy="45" r="3" fill="#fb7185" stroke="none" />
      <circle cx="65" cy="45" r="3" fill="#fb7185" stroke="none" />
    </g>
  );
}

function Robot() {
  return (
    <g {...OUTLINE}>
      <line x1="50" y1="18" x2="50" y2="8" />
      <circle cx="50" cy="6" r="3.5" fill="#f87171" />
      <rect x="27" y="18" width="46" height="36" rx="9" fill="#94a3b8" />
      <rect x="34" y="25" width="32" height="20" rx="5" fill="#0f172a" stroke="none" />
      <circle cx="44" cy="35" r="4" fill="#38bdf8" stroke="none" />
      <circle cx="56" cy="35" r="4" fill="#38bdf8" stroke="none" />
      <line x1="34" y1="62" x2="23" y2="70" />
      <line x1="66" y1="62" x2="77" y2="70" />
      <rect x="34" y="56" width="32" height="30" rx="7" fill="#cbd5e1" />
      <rect x="43" y="63" width="14" height="10" rx="2" fill="#38bdf8" stroke="none" />
      <circle cx="37" cy="41" r="2.6" fill="#fb7185" stroke="none" />
      <circle cx="63" cy="41" r="2.6" fill="#fb7185" stroke="none" />
    </g>
  );
}

function Frog() {
  return (
    <g {...OUTLINE}>
      <ellipse cx="50" cy="60" rx="30" ry="26" fill="#4ade80" />
      <ellipse cx="50" cy="66" rx="18" ry="13" fill="#bbf7d0" stroke="none" />
      <circle cx="36" cy="34" r="12" fill="#4ade80" />
      <circle cx="64" cy="34" r="12" fill="#4ade80" />
      <circle cx="36" cy="32" r="6.5" fill="#fff" />
      <circle cx="64" cy="32" r="6.5" fill="#fff" />
      <circle cx="37" cy="33" r="3.2" fill="#1f2937" stroke="none" />
      <circle cx="65" cy="33" r="3.2" fill="#1f2937" stroke="none" />
      <path d="M34 58 Q50 73 66 58" fill="none" />
      <circle cx="46" cy="50" r="1.5" fill="#1f2937" stroke="none" />
      <circle cx="54" cy="50" r="1.5" fill="#1f2937" stroke="none" />
      <circle cx="33" cy="56" r="3.6" fill="#fb7185" stroke="none" />
      <circle cx="67" cy="56" r="3.6" fill="#fb7185" stroke="none" />
    </g>
  );
}

function Pet() {
  return (
    <g {...OUTLINE}>
      <path d="M50 26 l-4 -9 M50 26 l5 -8" />
      <ellipse cx="50" cy="57" rx="26" ry="28" fill="#fcd34d" />
      <path d="M27 57 q-9 6 -1 15 q7 -2 9 -9 Z" fill="#fbbf24" />
      <path d="M73 57 q9 6 1 15 q-7 -2 -9 -9 Z" fill="#fbbf24" />
      <circle cx="42" cy="50" r="5.5" fill="#fff" />
      <circle cx="58" cy="50" r="5.5" fill="#fff" />
      <circle cx="43" cy="51" r="2.6" fill="#1f2937" stroke="none" />
      <circle cx="59" cy="51" r="2.6" fill="#1f2937" stroke="none" />
      <path d="M45 58 L55 58 L50 65 Z" fill="#fb923c" />
      <circle cx="36" cy="58" r="3.2" fill="#fb7185" stroke="none" />
      <circle cx="64" cy="58" r="3.2" fill="#fb7185" stroke="none" />
    </g>
  );
}

const PARTS: Record<MascotKind, () => JSX.Element> = { dragon: Dragon, robot: Robot, frog: Frog, pet: Pet };

export function Mascot({ kind, size = 96, className, title }: { kind: MascotKind; size?: number; className?: string; title?: string }) {
  const Body = PARTS[kind];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label={title ?? kind} style={{ overflow: 'visible' }}>
      <Body />
    </svg>
  );
}
