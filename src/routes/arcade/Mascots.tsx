// Original SVG mascots — hand-built cute vector characters (bold outline, flat
// fills + soft shading, rosy cheeks) for a "fuller" illustrated look than flat
// emoji. All original art, no trademarked designs. Used by the champion
// cinematic, the arcade hub, the start splash, the countdown, and the end card.
//
// Each character is a small <g> of SVG shapes drawn in a 100×100 viewBox. A
// shared FACE() helper draws the eyes + mouth + cheeks for a chosen expression
// so every mascot can look happy / surprised / dizzy / cheer.

export type MascotKind =
  | 'dragon'
  | 'robot'
  | 'frog'
  | 'pet'
  | 'cat'
  | 'bunny'
  | 'fox'
  | 'unicorn'
  | 'penguin'
  | 'monkey'
  | 'crewmate'
  | 'crewmate2'
  | 'crewmate3'
  | 'panda'
  | 'ninja'
  | 'clerk'
  | 'redpanda'
  | 'raccoon'
  | 'turtle'
  | 'shark'
  | 'capsuleR'
  | 'capsuleB'
  | 'capsuleP'
  | 'capsuleM'
  | 'cow'
  | 'bull'
  | 'gizmoTeal'
  | 'gizmoCoral'
  | 'gizmoViolet'
  | 'gizmoLime'
  | 'gizmoCyan';

export type MascotExpr = 'happy' | 'surprised' | 'dizzy' | 'cheer' | 'ko';

export const MASCOT_KINDS: MascotKind[] = [
  'dragon', 'robot', 'frog', 'pet', 'cat', 'bunny', 'fox',
  'unicorn', 'penguin', 'monkey', 'crewmate', 'crewmate2', 'crewmate3',
  'panda', 'ninja', 'clerk', 'redpanda', 'raccoon', 'turtle', 'shark',
  'capsuleR', 'capsuleB', 'capsuleP', 'capsuleM', 'cow', 'bull',
  'gizmoTeal', 'gizmoCoral', 'gizmoViolet', 'gizmoLime', 'gizmoCyan',
];

const OUTLINE = { stroke: '#1f2937', strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const INK = '#1f2937';

// Shared face: pass eye centers + the gap is implied by cx/cy. Renders eyes and a
// mouth that change with the expression, plus rosy cheeks under the eyes.
function Face({
  cx = 50,
  ey = 46,
  spread = 8,
  eyeR = 5.5,
  mouthY,
  expr = 'happy',
  cheek = '#fb7185',
}: {
  cx?: number;
  ey?: number;
  spread?: number;
  eyeR?: number;
  mouthY?: number;
  expr?: MascotExpr;
  cheek?: string;
}) {
  const lx = cx - spread;
  const rx = cx + spread;
  const my = mouthY ?? ey + 12;
  return (
    <g>
      {/* cheeks */}
      <circle cx={lx - eyeR - 1} cy={ey + 5} r="3" fill={cheek} stroke="none" />
      <circle cx={rx + eyeR + 1} cy={ey + 5} r="3" fill={cheek} stroke="none" />

      {/* eyes */}
      {expr === 'ko' ? (
        <g stroke={INK} strokeWidth={1.9} fill="none">
          <path d={`M${lx} ${ey - 1} q2.4 0 2.4 2.4 q0 3.4 -3.4 3.4 q-4.4 0 -4.4 -4.4 q0 -5.4 5.4 -5.4 q6.4 0 6.4 6.4`} />
          <path d={`M${rx} ${ey - 1} q2.4 0 2.4 2.4 q0 3.4 -3.4 3.4 q-4.4 0 -4.4 -4.4 q0 -5.4 5.4 -5.4 q6.4 0 6.4 6.4`} />
        </g>
      ) : expr === 'dizzy' ? (
        <g stroke={INK} strokeWidth={2.2} fill="none">
          <path d={`M${lx - 3} ${ey - 3} l6 6 M${lx + 3} ${ey - 3} l-6 6`} />
          <path d={`M${rx - 3} ${ey - 3} l6 6 M${rx + 3} ${ey - 3} l-6 6`} />
        </g>
      ) : expr === 'surprised' ? (
        <g>
          <circle cx={lx} cy={ey} r={eyeR} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={rx} cy={ey} r={eyeR} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={lx} cy={ey} r={eyeR * 0.5} fill={INK} stroke="none" />
          <circle cx={rx} cy={ey} r={eyeR * 0.5} fill={INK} stroke="none" />
        </g>
      ) : (
        <g>
          <circle cx={lx} cy={ey} r={eyeR} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={rx} cy={ey} r={eyeR} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={lx + 1} cy={ey + 1} r={eyeR * 0.45} fill={INK} stroke="none" />
          <circle cx={rx + 1} cy={ey + 1} r={eyeR * 0.45} fill={INK} stroke="none" />
          <circle cx={lx - 0.6} cy={ey - 1} r="1" fill="#fff" stroke="none" />
          <circle cx={rx - 0.6} cy={ey - 1} r="1" fill="#fff" stroke="none" />
        </g>
      )}

      {/* mouth */}
      {expr === 'cheer' ? (
        <path d={`M${cx - 7} ${my - 1} Q${cx} ${my + 9} ${cx + 7} ${my - 1} Z`} fill="#7f1d1d" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      ) : expr === 'ko' ? (
        <ellipse cx={cx} cy={my + 1} rx="4" ry="3" fill="#7f1d1d" stroke={INK} strokeWidth={2} />
      ) : expr === 'surprised' ? (
        <ellipse cx={cx} cy={my + 1} rx="3.5" ry="4.5" fill="#7f1d1d" stroke={INK} strokeWidth={2} />
      ) : (
        <path d={`M${cx - 6} ${my} Q${cx} ${my + 6} ${cx + 6} ${my}`} fill="none" stroke={INK} strokeWidth={2.4} />
      )}
    </g>
  );
}

function Dragon(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-drg" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </radialGradient>
      </defs>
      {/* wings */}
      <path d="M30 52 Q9 36 16 60 Q25 57 33 63 Z" fill="#a78bfa" />
      <path d="M70 52 Q91 36 84 60 Q75 57 67 63 Z" fill="#a78bfa" />
      {/* body + belly */}
      <ellipse cx="50" cy="63" rx="26" ry="24" fill="url(#m-drg)" />
      <ellipse cx="50" cy="69" rx="15" ry="13" fill="#d1fae5" stroke="none" />
      {/* head */}
      <circle cx="50" cy="40" r="22" fill="url(#m-drg)" />
      {/* horns */}
      <path d="M38 22 L34 9 L45 20 Z" fill="#fcd34d" />
      <path d="M62 22 L66 9 L55 20 Z" fill="#fcd34d" />
      {/* snout */}
      <ellipse cx="50" cy="48" rx="11" ry="7" fill="#6ee7b7" stroke="none" />
      <circle cx="46" cy="48" r="1.5" fill={INK} stroke="none" />
      <circle cx="54" cy="48" r="1.5" fill={INK} stroke="none" />
      <Face cx={50} ey={38} spread={8} eyeR={5} mouthY={49} expr={e} />
    </g>
  );
}

function Robot(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <linearGradient id="m-rob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      <line x1="50" y1="18" x2="50" y2="8" />
      <circle cx="50" cy="6" r="3.5" fill="#f87171" />
      <rect x="27" y="18" width="46" height="38" rx="10" fill="url(#m-rob)" />
      {/* screen face */}
      <rect x="33" y="24" width="34" height="26" rx="6" fill="#0f172a" stroke="none" />
      {e === 'dizzy' ? (
        <g stroke="#38bdf8" strokeWidth={2.6} fill="none">
          <path d="M41 34 l6 6 M47 34 l-6 6" />
          <path d="M53 34 l6 6 M59 34 l-6 6" />
        </g>
      ) : e === 'surprised' ? (
        <g fill="#38bdf8" stroke="none">
          <circle cx="44" cy="36" r="5" />
          <circle cx="56" cy="36" r="5" />
        </g>
      ) : (
        <g fill="#38bdf8" stroke="none">
          <circle cx="44" cy="36" r="4" />
          <circle cx="56" cy="36" r="4" />
          <rect x="42" y="44" width="16" height="3" rx="1.5" fill={e === 'cheer' ? '#38bdf8' : '#1e293b'} />
        </g>
      )}
      <line x1="34" y1="62" x2="23" y2="70" />
      <line x1="66" y1="62" x2="77" y2="70" />
      <rect x="34" y="56" width="32" height="30" rx="7" fill="#e2e8f0" />
      <rect x="43" y="63" width="14" height="10" rx="2" fill="#38bdf8" stroke="none" />
      <circle cx="37" cy="41" r="2.4" fill="#fb7185" stroke="none" />
      <circle cx="63" cy="41" r="2.4" fill="#fb7185" stroke="none" />
    </g>
  );
}

function Frog(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-frg" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="60" rx="30" ry="26" fill="url(#m-frg)" />
      <ellipse cx="50" cy="66" rx="18" ry="13" fill="#bbf7d0" stroke="none" />
      {/* eye bumps */}
      <circle cx="36" cy="34" r="12" fill="url(#m-frg)" />
      <circle cx="64" cy="34" r="12" fill="url(#m-frg)" />
      {e === 'dizzy' ? (
        <g stroke={INK} strokeWidth={2.4} fill="#fff">
          <circle cx="36" cy="33" r="6.5" />
          <circle cx="64" cy="33" r="6.5" />
          <path d="M33 30 l6 6 M39 30 l-6 6 M61 30 l6 6 M67 30 l-6 6" fill="none" />
        </g>
      ) : (
        <g>
          <circle cx="36" cy="33" r="6.5" fill="#fff" />
          <circle cx="64" cy="33" r="6.5" fill="#fff" />
          <circle cx={e === 'surprised' ? 36 : 37} cy="34" r="3.2" fill={INK} stroke="none" />
          <circle cx={e === 'surprised' ? 64 : 65} cy="34" r="3.2" fill={INK} stroke="none" />
        </g>
      )}
      {e === 'cheer' ? (
        <path d="M34 56 Q50 74 66 56 Z" fill="#7f1d1d" stroke={INK} strokeWidth={2.4} />
      ) : (
        <path d="M34 58 Q50 71 66 58" fill="none" stroke={INK} strokeWidth={2.6} />
      )}
      <circle cx="33" cy="56" r="3.6" fill="#fb7185" stroke="none" />
      <circle cx="67" cy="56" r="3.6" fill="#fb7185" stroke="none" />
    </g>
  );
}

function Pet(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-pet" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      <path d="M50 26 l-4 -9 M50 26 l5 -8" />
      <ellipse cx="50" cy="57" rx="26" ry="28" fill="url(#m-pet)" />
      <ellipse cx="50" cy="64" rx="15" ry="15" fill="#fef3c7" stroke="none" />
      <path d="M27 57 q-9 6 -1 15 q7 -2 9 -9 Z" fill="#fbbf24" />
      <path d="M73 57 q9 6 1 15 q-7 -2 -9 -9 Z" fill="#fbbf24" />
      <path d="M45 56 L55 56 L50 63 Z" fill="#fb923c" />
      <Face cx={50} ey={50} spread={8} eyeR={5.5} mouthY={66} expr={e} cheek="#fb7185" />
    </g>
  );
}

function Cat(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-cat" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>
      </defs>
      {/* ears */}
      <path d="M30 28 L24 10 L44 22 Z" fill="url(#m-cat)" />
      <path d="M70 28 L76 10 L56 22 Z" fill="url(#m-cat)" />
      <path d="M31 24 L29 16 L38 21 Z" fill="#fda4af" stroke="none" />
      <path d="M69 24 L71 16 L62 21 Z" fill="#fda4af" stroke="none" />
      <circle cx="50" cy="46" r="28" fill="url(#m-cat)" />
      <ellipse cx="50" cy="56" rx="14" ry="10" fill="#fff7ed" stroke="none" />
      {/* nose + whiskers */}
      <path d="M47 52 L53 52 L50 56 Z" fill="#fb7185" stroke="none" />
      <g stroke={INK} strokeWidth={1.6}>
        <path d="M30 50 h10 M30 56 h10 M70 50 h-10 M70 56 h-10" />
      </g>
      <Face cx={50} ey={44} spread={9} eyeR={5.5} mouthY={56} expr={e} />
    </g>
  );
}

function Bunny(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-bun" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="22" rx="7" ry="18" fill="url(#m-bun)" />
      <ellipse cx="60" cy="22" rx="7" ry="18" fill="url(#m-bun)" />
      <ellipse cx="40" cy="22" rx="3" ry="12" fill="#fbcfe8" stroke="none" />
      <ellipse cx="60" cy="22" rx="3" ry="12" fill="#fbcfe8" stroke="none" />
      <circle cx="50" cy="55" r="26" fill="url(#m-bun)" />
      <path d="M47 60 L53 60 L50 64 Z" fill="#fb7185" stroke="none" />
      <Face cx={50} ey={52} spread={8} eyeR={5.5} mouthY={64} expr={e} cheek="#f9a8d4" />
    </g>
  );
}

function Fox(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-fox" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      <path d="M28 30 L20 8 L46 24 Z" fill="url(#m-fox)" />
      <path d="M72 30 L80 8 L54 24 Z" fill="url(#m-fox)" />
      <path d="M30 26 L26 14 L40 23 Z" fill="#1f2937" stroke="none" />
      <path d="M70 26 L74 14 L60 23 Z" fill="#1f2937" stroke="none" />
      <circle cx="50" cy="44" r="27" fill="url(#m-fox)" />
      {/* white muzzle */}
      <path d="M50 40 Q33 48 42 66 Q50 72 58 66 Q67 48 50 40 Z" fill="#fff7ed" stroke="none" />
      <path d="M46 60 L54 60 L50 65 Z" fill={INK} stroke="none" />
      <Face cx={50} ey={42} spread={9} eyeR={5} mouthY={62} expr={e} />
    </g>
  );
}

function Unicorn(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-uni" cx="50%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </radialGradient>
      </defs>
      {/* horn */}
      <path d="M50 22 L44 6 L56 6 Z" fill="#fcd34d" />
      <path d="M48 14 h4 M47 18 h6" stroke="#f59e0b" strokeWidth="1.6" />
      {/* ears */}
      <path d="M33 30 L28 18 L42 26 Z" fill="url(#m-uni)" />
      <path d="M67 30 L72 18 L58 26 Z" fill="url(#m-uni)" />
      {/* rainbow mane */}
      <path d="M26 34 q-10 8 -4 20 q8 -2 8 -10 Z" fill="#f472b6" />
      <path d="M26 44 q-9 8 -2 18 q7 -3 7 -11 Z" fill="#a78bfa" />
      <circle cx="50" cy="50" r="27" fill="url(#m-uni)" />
      <path d="M46 58 L54 58 L50 63 Z" fill="#fb7185" stroke="none" />
      <Face cx={50} ey={48} spread={9} eyeR={5.5} mouthY={62} expr={e} cheek="#f9a8d4" />
    </g>
  );
}

function Penguin(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <linearGradient id="m-pen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="56" rx="28" ry="30" fill="url(#m-pen)" />
      <ellipse cx="50" cy="60" rx="18" ry="22" fill="#f8fafc" stroke="none" />
      {/* feet */}
      <path d="M40 84 q-6 6 2 7 q5 0 5 -5 Z" fill="#fb923c" />
      <path d="M60 84 q6 6 -2 7 q-5 0 -5 -5 Z" fill="#fb923c" />
      {/* beak */}
      <path d="M44 52 L56 52 L50 60 Z" fill="#fb923c" stroke="none" />
      <Face cx={50} ey={44} spread={7} eyeR={5} mouthY={62} expr={e} cheek="#fb7185" />
    </g>
  );
}

function Monkey(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-mky" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#b07a4f" />
          <stop offset="100%" stopColor="#8b5a2b" />
        </radialGradient>
      </defs>
      <circle cx="26" cy="44" r="9" fill="url(#m-mky)" />
      <circle cx="74" cy="44" r="9" fill="url(#m-mky)" />
      <circle cx="26" cy="44" r="4.5" fill="#e7c9a9" stroke="none" />
      <circle cx="74" cy="44" r="4.5" fill="#e7c9a9" stroke="none" />
      <circle cx="50" cy="46" r="26" fill="url(#m-mky)" />
      {/* face patch */}
      <ellipse cx="50" cy="54" rx="18" ry="16" fill="#f3dcc3" stroke="none" />
      <ellipse cx="50" cy="58" rx="6" ry="4.5" fill="#e7c9a9" stroke="none" />
      <circle cx="47" cy="58" r="1.4" fill={INK} stroke="none" />
      <circle cx="53" cy="58" r="1.4" fill={INK} stroke="none" />
      <Face cx={50} ey={48} spread={7} eyeR={5} mouthY={62} expr={e} cheek="#fda4af" />
    </g>
  );
}

// Among-Us-style "crewmate" — an original little space buddy: a rounded capsule
// suit with a glass visor, a backpack, and stubby legs. Three colorways. All
// original art (no trademarked logos or designs).
function makeCrewmate(suit: string, suitDark: string) {
  return (e: MascotExpr) => (
    <g {...OUTLINE}>
      <defs>
        <linearGradient id={`m-crw-${suit.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={suit} />
          <stop offset="100%" stopColor={suitDark} />
        </linearGradient>
      </defs>
      {/* backpack */}
      <rect x="16" y="40" width="14" height="30" rx="7" fill={suitDark} />
      {/* body capsule */}
      <path
        d="M34 40 Q34 20 54 20 Q74 20 74 40 L74 74 Q74 80 68 80 L62 80 L62 70 L54 70 L54 80 L46 80 L46 70 L40 70 L40 80 L40 80 Q34 80 34 74 Z"
        fill={`url(#m-crw-${suit.slice(1)})`}
      />
      {/* legs */}
      <path d="M40 78 L40 86 Q40 90 46 90 L46 78 Z" fill={suitDark} />
      <path d="M62 78 L62 86 Q62 90 56 90 L56 78 Z" fill={suitDark} />
      {/* visor */}
      <path d="M50 30 Q72 30 72 44 Q72 52 60 52 L50 52 Q44 52 44 44 Q44 30 50 30 Z" fill="#bae6fd" />
      <ellipse cx="55" cy="40" rx="9" ry="6" fill="#e0f2fe" stroke="none" opacity="0.9" />
      {/* visor glints / expression */}
      {e === 'dizzy' ? (
        <g stroke={INK} strokeWidth={2} fill="none">
          <path d="M52 40 l5 5 M57 40 l-5 5 M62 40 l5 5 M67 40 l-5 5" />
        </g>
      ) : e === 'surprised' ? (
        <g fill="#fff" stroke="none">
          <circle cx="56" cy="41" r="3.5" />
          <circle cx="66" cy="41" r="3" />
        </g>
      ) : (
        <g fill="#fff" stroke="none">
          <circle cx="58" cy="40" r="3" />
          <circle cx="67" cy="42" r="2" />
        </g>
      )}
    </g>
  );
}

// Panda taiko-drummer — B/W head with eye-patches, a red fighter's headband and
// two crossed drumsticks with soft drum-tips. Uses the shared Face (incl. 'ko').
function Panda(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-pan" cx="50%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </radialGradient>
      </defs>
      {/* ears */}
      <circle cx="27" cy="24" r="11" fill="#1f2937" />
      <circle cx="73" cy="24" r="11" fill="#1f2937" />
      <circle cx="27" cy="24" r="5" fill="#9ca3af" stroke="none" />
      <circle cx="73" cy="24" r="5" fill="#9ca3af" stroke="none" />
      {/* head */}
      <circle cx="50" cy="48" r="28" fill="url(#m-pan)" />
      {/* eye patches */}
      <g transform="rotate(-14 40 46)"><ellipse cx="40" cy="46" rx="7.5" ry="10" fill="#1f2937" stroke="none" /></g>
      <g transform="rotate(14 60 46)"><ellipse cx="60" cy="46" rx="7.5" ry="10" fill="#1f2937" stroke="none" /></g>
      {/* headband + knot */}
      <path d="M21 39 Q50 31 79 39 L78 46 Q50 38 22 46 Z" fill="#dc2626" />
      <path d="M76 42 q12 -1 15 7 q-7 -2 -10 1 q5 3 1 7 q-6 -5 -10 -8 Z" fill="#dc2626" />
      {/* nose */}
      <path d="M46 55 L54 55 L50 60 Z" fill="#1f2937" stroke="none" />
      <Face cx={50} ey={46} spread={10} eyeR={5} mouthY={60} expr={e} />
      {/* drumsticks + tips */}
      <g stroke="#b45309" strokeWidth={5} strokeLinecap="round">
        <line x1="28" y1="90" x2="44" y2="66" />
        <line x1="72" y1="90" x2="56" y2="66" />
      </g>
      <circle cx="44" cy="64" r="4.5" fill="#fde68a" stroke={INK} strokeWidth={2.5} />
      <circle cx="56" cy="64" r="4.5" fill="#fde68a" stroke={INK} strokeWidth={2.5} />
    </g>
  );
}

// Ninja — spiky crown, indigo headband with streaming tails, cool black shades,
// a confident smirk and a red scarf.
function Ninja(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-nin" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffe0bd" />
          <stop offset="100%" stopColor="#f1c08a" />
        </radialGradient>
      </defs>
      <path d="M24 38 L18 16 L31 30 L36 12 L44 28 L50 10 L56 28 L64 12 L69 30 L82 16 L76 38 Z" fill="#312e81" />
      <circle cx="50" cy="50" r="26" fill="url(#m-nin)" />
      <path d="M24 41 Q50 33 76 41 L76 49 Q50 41 24 49 Z" fill="#1e3a8a" />
      <path d="M74 45 q16 -2 22 7 q-8 -1 -12 2 q6 4 1 9 q-8 -7 -13 -10 Z" fill="#1e3a8a" />
      {/* shades */}
      <g fill="#0b1220" stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <path d="M33 51 L47 49 L46 59 Q40 61 35 58 Z" />
        <path d="M53 49 L67 51 L65 58 Q59 61 54 59 Z" />
      </g>
      <rect x="46" y="51" width="8" height="3" rx="1.5" fill="#0b1220" stroke="none" />
      <path d="M37 53 l4 -0.5" stroke="#93c5fd" strokeWidth={2} fill="none" />
      {/* smirk + cheeks */}
      {e === 'ko' || e === 'dizzy' ? (
        <path d="M44 67 Q52 62 61 67" fill="none" stroke={INK} strokeWidth={2.6} />
      ) : (
        <path d="M44 66 Q52 71 61 64" fill="none" stroke={INK} strokeWidth={2.6} />
      )}
      <circle cx="35" cy="62" r="3" fill="#fb7185" stroke="none" />
      <circle cx="65" cy="62" r="3" fill="#fb7185" stroke="none" />
      <path d="M30 73 Q50 83 70 73 L72 82 Q50 92 28 82 Z" fill="#dc2626" />
    </g>
  );
}

// Station clerk — peaked navy cap with a gold star badge, friendly face and a
// buttoned uniform with gold lapels.
function Clerk(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-clk" cx="50%" cy="42%" r="64%">
          <stop offset="0%" stopColor="#ffe0bd" />
          <stop offset="100%" stopColor="#f1c08a" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="24" fill="url(#m-clk)" />
      {/* cap */}
      <path d="M27 39 Q50 19 73 39 Z" fill="#1e3a8a" />
      <path d="M21 40 Q50 47 79 40 L79 45 Q50 52 21 45 Z" fill="#172554" />
      <rect x="43" y="26" width="14" height="9" rx="2" fill="#fcd34d" />
      <path d="M50 28 l1.3 2.7 3 .3 -2.2 2 .7 3 -2.8 -1.6 -2.8 1.6 .7 -3 -2.2 -2 3 -.3 Z" fill="#b45309" stroke="none" />
      <Face cx={50} ey={50} spread={8} eyeR={5} mouthY={61} expr={e} />
      {/* uniform */}
      <path d="M30 74 L42 67 L50 73 L58 67 L70 74 L70 86 Q50 93 30 86 Z" fill="#1e3a8a" />
      <path d="M42 67 L50 73 L46 80 Z" fill="#fcd34d" stroke="none" />
      <path d="M58 67 L50 73 L54 80 Z" fill="#fcd34d" stroke="none" />
      <circle cx="50" cy="83" r="1.6" fill="#fcd34d" stroke="none" />
    </g>
  );
}

// Red panda — pointed cream-tipped ears, white cheek/brow markings, dark tear
// stripes and a striped curling tail.
function RedPanda(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-rpan" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
      </defs>
      {/* striped tail */}
      <path d="M68 74 q22 4 18 -16 q-3 -11 -12 -8" fill="#9a3412" />
      <path d="M84 60 q4 5 1 10 M77 56 q4 6 1 12 M71 53 q4 6 1 12" stroke="#451a03" strokeWidth={2.4} fill="none" />
      {/* ears */}
      <path d="M28 26 L22 7 L43 22 Z" fill="url(#m-rpan)" />
      <path d="M72 26 L78 7 L57 22 Z" fill="url(#m-rpan)" />
      <path d="M30 22 L27 13 L39 21 Z" fill="#fff7ed" stroke="none" />
      <path d="M70 22 L73 13 L61 21 Z" fill="#fff7ed" stroke="none" />
      {/* head */}
      <circle cx="50" cy="48" r="27" fill="url(#m-rpan)" />
      {/* white cheek + muzzle markings */}
      <path d="M50 42 Q30 44 34 64 Q42 72 50 70 Q58 72 66 64 Q70 44 50 42 Z" fill="#fff7ed" stroke="none" />
      <ellipse cx="35" cy="37" rx="6.5" ry="4.5" fill="#fff7ed" stroke="none" />
      <ellipse cx="65" cy="37" rx="6.5" ry="4.5" fill="#fff7ed" stroke="none" />
      {/* dark tear stripes */}
      <path d="M42 50 q-3 8 -5 13 M58 50 q3 8 5 13" stroke="#7c2d12" strokeWidth={3} fill="none" />
      {/* nose */}
      <path d="M47 52 L53 52 L50 57 Z" fill="#7c2d12" stroke="none" />
      <Face cx={50} ey={46} spread={8} eyeR={5} mouthY={58} expr={e} cheek="#fb7185" />
    </g>
  );
}

// Raccoon — round grey head, dark bandit mask behind the eyes, white muzzle.
function Raccoon(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-rac" cx="50%" cy="40%" r="66%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
      </defs>
      {/* striped tail */}
      <path d="M70 76 q20 6 16 -14 q-3 -10 -11 -7" fill="#64748b" />
      <path d="M84 62 q3 5 0 10 M77 58 q3 6 0 11" stroke="#334155" strokeWidth={2.4} fill="none" />
      {/* ears */}
      <circle cx="30" cy="26" r="10" fill="url(#m-rac)" />
      <circle cx="70" cy="26" r="10" fill="url(#m-rac)" />
      <circle cx="30" cy="27" r="4.5" fill="#475569" stroke="none" />
      <circle cx="70" cy="27" r="4.5" fill="#475569" stroke="none" />
      {/* head */}
      <circle cx="50" cy="50" r="27" fill="url(#m-rac)" />
      {/* bandit mask behind eyes */}
      <path d="M28 45 Q39 38 46 44 Q50 47 54 44 Q61 38 72 45 Q70 57 60 56 Q54 53 50 54 Q46 53 40 56 Q30 57 28 45 Z" fill="#334155" stroke="none" />
      {/* white muzzle */}
      <path d="M50 52 Q37 54 41 68 Q50 74 59 68 Q63 54 50 52 Z" fill="#f8fafc" stroke="none" />
      <path d="M47 58 L53 58 L50 63 Z" fill="#1f2937" stroke="none" />
      <Face cx={50} ey={48} spread={8} eyeR={5} mouthY={63} expr={e} cheek="#fb7185" />
    </g>
  );
}

// Turtle — domed segmented shell, little feet, and a friendly head poking out.
function Turtle(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-tur" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
      </defs>
      {/* feet */}
      <ellipse cx="24" cy="70" rx="8" ry="6" fill="#34d399" />
      <ellipse cx="76" cy="70" rx="8" ry="6" fill="#34d399" />
      {/* shell */}
      <path d="M18 68 Q18 30 50 30 Q82 30 82 68 Z" fill="url(#m-tur)" />
      <path d="M50 30 V68 M30 40 Q50 52 70 40 M24 56 Q50 62 76 56" stroke="#065f46" strokeWidth={3} fill="none" />
      <path d="M44 45 L56 45 L60 55 L50 61 L40 55 Z" fill="#10b981" stroke="#065f46" strokeWidth={2.5} />
      {/* head */}
      <circle cx="50" cy="80" r="12" fill="#6ee7b7" />
      <Face cx={50} ey={78} spread={5} eyeR={3.4} mouthY={85} expr={e} cheek="#fb7185" />
    </g>
  );
}

// Shark — steel-blue body, dorsal fin, gills, white belly and a toothy grin.
function Shark(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-shk" cx="50%" cy="38%" r="68%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>
      </defs>
      {/* dorsal fin */}
      <path d="M50 6 L39 30 L60 30 Z" fill="url(#m-shk)" />
      {/* body */}
      <circle cx="50" cy="52" r="30" fill="url(#m-shk)" />
      {/* white belly */}
      <path d="M23 60 Q50 80 77 60 Q73 78 50 81 Q27 78 23 60 Z" fill="#eff6ff" stroke="none" />
      {/* gills */}
      <path d="M29 46 q3 7 0 13 M36 43 q3 8 0 15" stroke="#1e3a8a" strokeWidth={2.2} fill="none" />
      <Face cx={50} ey={44} spread={9} eyeR={5} mouthY={62} expr={e} cheek="#fb7185" />
      {/* fang accents at the mouth corners */}
      <path d="M41 60 l2.5 4 l2.5 -4 Z" fill="#fff" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M54 60 l2.5 4 l2.5 -4 Z" fill="#fff" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
    </g>
  );
}

// Capsule-toy buddy — a round yellow blob popping out of a coloured gachapon
// capsule shell, with little ear-tufts and stub arms. Four colourways. (Inspired
// by capsule-toy-store mascots; all original art.)
function makeCapsule(shell: string, shellDark: string, bow = false) {
  return (e: MascotExpr) => (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id={`m-cap-${shell.slice(1)}`} cx="50%" cy="40%" r="62%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      {/* capsule cup */}
      <path d="M19 58 Q19 92 50 92 Q81 92 81 58 Z" fill={shell} />
      {/* stub arms */}
      <ellipse cx="21" cy="60" rx="6.5" ry="4.5" fill="#fcd34d" />
      <ellipse cx="79" cy="60" rx="6.5" ry="4.5" fill="#fcd34d" />
      {/* ear tufts */}
      <path d="M39 20 L35 8 L46 16 Z" fill="#fcd34d" />
      <path d="M61 20 L65 8 L54 16 Z" fill="#fcd34d" />
      {/* body / head */}
      <circle cx="50" cy="46" r="27" fill={`url(#m-cap-${shell.slice(1)})`} />
      {/* capsule seam rim over the body */}
      <path d="M20 60 Q50 72 80 60 L81 65 Q50 78 19 65 Z" fill={shellDark} stroke="none" />
      {bow && (
        <g>
          <path d="M50 13 L41 8 L41 19 Z" fill={shell} />
          <path d="M50 13 L59 8 L59 19 Z" fill={shell} />
          <circle cx="50" cy="13.5" r="3" fill={shellDark} stroke="none" />
        </g>
      )}
      <Face cx={50} ey={44} spread={8} eyeR={5.5} mouthY={54} expr={e} cheek="#fb7185" />
    </g>
  );
}

// "Gizmo" goggle-buddies — ORIGINAL capsule creatures (NOT Minions): an upright
// pill body with a bolt antenna and a riveted goggle strap holding one or two
// metal lenses. Bright non-yellow shells and a distinct tall silhouette keep them
// clearly original.
function makeGoggle(shell: string, shellDark: string, opts: { eyes?: 1 | 2; antenna?: string } = {}) {
  const eyes = opts.eyes ?? 2;
  const ant = opts.antenna ?? shellDark;
  const gid = `m-gg-${shell.slice(1)}`;
  const my = 66; // mouth y
  const lens = (cx: number, r: number, e: MascotExpr) => (
    <g key={cx}>
      <circle cx={cx} cy={48} r={r + 2.5} fill="#cbd5e1" />
      <circle cx={cx} cy={48} r={r} fill="#fff" stroke={INK} strokeWidth={2} />
      {e === 'dizzy' ? (
        <path d={`M${cx - 3} 45 l6 6 M${cx + 3} 45 l-6 6`} stroke={INK} strokeWidth={2.2} fill="none" />
      ) : e === 'ko' ? (
        <path d={`M${cx - 3} 48 h6`} stroke={INK} strokeWidth={2.4} fill="none" />
      ) : (
        <g stroke="none">
          <circle cx={cx + 1} cy={49} r={(e === 'surprised' ? 0.62 : 0.5) * r} fill={INK} />
          <circle cx={cx - 1} cy={47} r="1.2" fill="#fff" />
        </g>
      )}
    </g>
  );
  return (e: MascotExpr) => (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="32%" r="72%">
          <stop offset="0%" stopColor={shell} />
          <stop offset="100%" stopColor={shellDark} />
        </radialGradient>
      </defs>
      {/* antenna + bolt */}
      <line x1="50" y1="22" x2="50" y2="10" />
      <circle cx="50" cy="7" r="4" fill={ant} />
      {/* feet */}
      <ellipse cx="40" cy="90" rx="7.5" ry="5" fill={shellDark} />
      <ellipse cx="60" cy="90" rx="7.5" ry="5" fill={shellDark} />
      {/* stub arms */}
      <ellipse cx="24" cy="60" rx="6" ry="9" fill={shell} />
      <ellipse cx="76" cy="60" rx="6" ry="9" fill={shell} />
      {/* pill body */}
      <rect x="26" y="22" width="48" height="66" rx="24" fill={`url(#${gid})`} />
      {/* goggle strap with rivets */}
      <rect x="20" y="40" width="60" height="16" rx="8" fill="#374151" />
      <circle cx="23" cy="48" r="3" fill="#111827" stroke="none" />
      <circle cx="77" cy="48" r="3" fill="#111827" stroke="none" />
      {/* lenses */}
      {eyes === 1 ? lens(50, 9, e) : [lens(41, 7, e), lens(59, 7, e)]}
      {/* mouth */}
      {e === 'cheer' ? (
        <path d={`M43 ${my - 1} Q50 ${my + 9} 57 ${my - 1} Z`} fill="#7f1d1d" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      ) : e === 'surprised' ? (
        <ellipse cx="50" cy={my + 1} rx="4" ry="5" fill="#7f1d1d" stroke={INK} strokeWidth={2} />
      ) : e === 'ko' ? (
        <ellipse cx="50" cy={my + 1} rx="4" ry="3" fill="#7f1d1d" stroke={INK} strokeWidth={2} />
      ) : (
        <path d={`M44 ${my} Q50 ${my + 6} 56 ${my}`} fill="none" stroke={INK} strokeWidth={2.4} />
      )}
    </g>
  );
}

// Chibi cow — tan head with pointy ears, little horns, a beige muzzle, blush and
// a colourful cheek badge. (Inspired by a cow-mascot lineage; original art.)
function Cow(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-cow" cx="50%" cy="40%" r="64%">
          <stop offset="0%" stopColor="#e8a36b" />
          <stop offset="100%" stopColor="#b9763f" />
        </radialGradient>
      </defs>
      {/* horns */}
      <path d="M40 18 Q34 5 27 6 Q33 12 36 22 Z" fill="#f5e6c8" />
      <path d="M60 18 Q66 5 73 6 Q67 12 64 22 Z" fill="#f5e6c8" />
      {/* ears */}
      <path d="M26 42 L9 33 L31 27 Z" fill="url(#m-cow)" />
      <path d="M74 42 L91 33 L69 27 Z" fill="url(#m-cow)" />
      {/* head */}
      <circle cx="50" cy="46" r="27" fill="url(#m-cow)" />
      {/* muzzle */}
      <ellipse cx="50" cy="58" rx="20" ry="14" fill="#f5e6c8" stroke="none" />
      <ellipse cx="43" cy="58" rx="2.4" ry="3.2" fill="#8a5a2b" stroke="none" />
      <ellipse cx="57" cy="58" rx="2.4" ry="3.2" fill="#8a5a2b" stroke="none" />
      {/* cheek badge */}
      <circle cx="71" cy="50" r="4.5" fill="#3b82f6" stroke={INK} strokeWidth={2} />
      <Face cx={50} ey={42} spread={8} eyeR={5} mouthY={62} expr={e} cheek="#fb7185" />
    </g>
  );
}

// Red bull — round orange head, cream horns, a dark snout and a gold nose ring.
function Bull(e: MascotExpr) {
  return (
    <g {...OUTLINE}>
      <defs>
        <radialGradient id="m-bull" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
      </defs>
      {/* horns */}
      <path d="M30 28 Q14 22 10 8 Q24 14 34 22 Z" fill="#f5e6c8" />
      <path d="M70 28 Q86 22 90 8 Q76 14 66 22 Z" fill="#f5e6c8" />
      {/* ears */}
      <ellipse cx="22" cy="44" rx="8" ry="6" fill="url(#m-bull)" />
      <ellipse cx="78" cy="44" rx="8" ry="6" fill="url(#m-bull)" />
      {/* head */}
      <circle cx="50" cy="48" r="28" fill="url(#m-bull)" />
      {/* snout */}
      <ellipse cx="50" cy="63" rx="16" ry="11" fill="#7c2d12" stroke="none" />
      <ellipse cx="43" cy="61" rx="2.6" ry="3.4" fill="#fed7aa" stroke="none" />
      <ellipse cx="57" cy="61" rx="2.6" ry="3.4" fill="#fed7aa" stroke="none" />
      {/* nose ring */}
      <circle cx="50" cy="71" r="6" fill="none" stroke="#fbbf24" strokeWidth={3} />
      <Face cx={50} ey={42} spread={9} eyeR={5} mouthY={50} expr={e} cheek="#fda4af" />
    </g>
  );
}

const PARTS: Record<MascotKind, (e: MascotExpr) => JSX.Element> = {
  dragon: Dragon,
  robot: Robot,
  frog: Frog,
  pet: Pet,
  cat: Cat,
  bunny: Bunny,
  fox: Fox,
  unicorn: Unicorn,
  penguin: Penguin,
  monkey: Monkey,
  crewmate: makeCrewmate('#ef4444', '#b91c1c'),
  crewmate2: makeCrewmate('#3b82f6', '#1d4ed8'),
  crewmate3: makeCrewmate('#22c55e', '#15803d'),
  panda: Panda,
  ninja: Ninja,
  clerk: Clerk,
  redpanda: RedPanda,
  raccoon: Raccoon,
  turtle: Turtle,
  shark: Shark,
  capsuleR: makeCapsule('#ef4444', '#b91c1c'),
  capsuleB: makeCapsule('#3b82f6', '#1d4ed8'),
  capsuleP: makeCapsule('#ec4899', '#be185d', true),
  capsuleM: makeCapsule('#10b981', '#047857'),
  cow: Cow,
  bull: Bull,
  gizmoTeal: makeGoggle('#2dd4bf', '#0f766e', { antenna: '#f59e0b' }),
  gizmoCoral: makeGoggle('#fb7185', '#be123c', { antenna: '#fcd34d' }),
  gizmoViolet: makeGoggle('#a78bfa', '#6d28d9', { antenna: '#34d399' }),
  gizmoLime: makeGoggle('#a3e635', '#4d7c0f', { antenna: '#f472b6' }),
  gizmoCyan: makeGoggle('#38bdf8', '#0369a1', { eyes: 1, antenna: '#f59e0b' }),
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
  const Body = PARTS[kind] ?? PARTS.pet;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-label={title ?? kind} style={{ overflow: 'visible' }}>
      {Body(expr)}
    </svg>
  );
}

// Maps every ARCADE_GAMES.id → a fitting character mascot. Used on the hub tiles,
// the start splash, and the end card. Falls back to 'pet' via GAME_MASCOT helper.
export const GAME_MASCOT: Record<string, MascotKind> = {
  connect4: 'frog',
  wheel: 'unicorn',
  memory: 'cat',
  shootout: 'monkey',
  runner: 'fox',
  platformer: 'frog',
  racer: 'robot',
  digger: 'raccoon',
  tiles: 'capsuleB',
  snake: 'frog',
  bricks: 'robot',
  sudoku: 'penguin',
  tetris: 'crewmate',
  boba: 'redpanda',
  sushi: 'penguin',
  tictactoe: 'capsuleP',
  kpop: 'unicorn',
  survival: 'fox',
  fruit: 'shark',
  town: 'turtle',
  sumo: 'bull',
  monster: 'dragon',
  turbo: 'cow',
  wordle: 'capsuleR',
  hero: 'crewmate2',
  escape: 'crewmate3',
  asteroids: 'crewmate',
  tank: 'crewmate2',
  rig: 'crewmate',
  mathpop: 'capsuleM',
  dress: 'unicorn',
  taiko: 'panda',
  shinobi: 'ninja',
  speedlab: 'robot',
  fraction: 'clerk',
  chess: 'robot',
  starhop: 'unicorn',
  crawler: 'fox',
};

export function gameMascot(id: string): MascotKind {
  return GAME_MASCOT[id] ?? 'pet';
}
