// The app's character: a small astronaut in a white suit with a navy visor,
// drawn in clean line art with one accent colour. One drawing serves every
// use — the mascot beside a lesson, the crew on the arcade tiles — so the
// characters read as one family. Where a mascot might hold money, this one
// holds a calculator or a piece of mathematics.

export type AstroExpr =
  | 'happy'
  | 'thinking'
  | 'cheer'
  | 'oops'
  | 'sleep'
  | 'wow'
  | 'dizzy'
  | 'ko';

export type AstroProp =
  | 'none'
  | 'calculator'
  | 'pi'
  | 'sigma'
  | 'root'
  | 'graph'
  | 'protractor'
  | 'infinity';

export type AstroPose = 'stand' | 'point' | 'arms-up' | 'wave';

export interface AstronautProps {
  accent?: string;
  expr?: AstroExpr;
  prop?: AstroProp;
  pose?: AstroPose;
  /** Round glasses drawn on the visor. */
  glasses?: boolean;
  /** A star on the chest panel. */
  star?: boolean;
  /** Sparkles around the helmet. */
  sparkle?: boolean;
  /** Riding a small rocket. */
  rocket?: boolean;
  /** Fit a square slot (a tile, an avatar) instead of the natural 6:7. */
  square?: boolean;
  size?: number;
  title?: string;
  className?: string;
}

const INK = '#2B3340';
const SUIT = '#FFFFFF';
const SUIT_SHADE = '#DDE1E8';
const VISOR = '#17335F';
const VISOR_DEEP = '#0C1E3C';
const VISOR_LIGHT = '#3D6BB3';
const FACE = '#F3F7FF';

const OUT = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** The face inside the visor: two eyes and a mouth, lit like a display. */
function Face({ expr }: { expr: AstroExpr }) {
  const lx = 51, rx = 69, ey = 47, my = 58;
  const eyes = (() => {
    switch (expr) {
      case 'sleep':
        return (
          <g fill="none" stroke={FACE} strokeWidth={2.4} strokeLinecap="round">
            <path d={`M${lx - 4} ${ey} q4 3 8 0`} />
            <path d={`M${rx - 4} ${ey} q4 3 8 0`} />
          </g>
        );
      case 'dizzy':
        return (
          <g fill="none" stroke={FACE} strokeWidth={2.4} strokeLinecap="round">
            <path d={`M${lx - 3.5} ${ey - 3.5} l7 7 M${lx + 3.5} ${ey - 3.5} l-7 7`} />
            <path d={`M${rx - 3.5} ${ey - 3.5} l7 7 M${rx + 3.5} ${ey - 3.5} l-7 7`} />
          </g>
        );
      case 'ko':
        return (
          <g fill="none" stroke={FACE} strokeWidth={2.2} strokeLinecap="round">
            <path d={`M${lx} ${ey - 1} q2.4 0 2.4 2.4 q0 3.2 -3.2 3.2 q-4.2 0 -4.2 -4.2 q0 -5 5 -5 q6 0 6 6`} />
            <path d={`M${rx} ${ey - 1} q2.4 0 2.4 2.4 q0 3.2 -3.2 3.2 q-4.2 0 -4.2 -4.2 q0 -5 5 -5 q6 0 6 6`} />
          </g>
        );
      case 'wow':
        return (
          <g>
            <circle cx={lx} cy={ey} r={5.2} fill={FACE} />
            <circle cx={rx} cy={ey} r={5.2} fill={FACE} />
            <circle cx={lx} cy={ey} r={2.4} fill={VISOR_DEEP} />
            <circle cx={rx} cy={ey} r={2.4} fill={VISOR_DEEP} />
          </g>
        );
      case 'thinking':
        return (
          <g>
            <ellipse cx={lx} cy={ey} rx={3.6} ry={4.4} fill={FACE} />
            <ellipse cx={rx} cy={ey} rx={3.6} ry={4.4} fill={FACE} />
            <circle cx={lx + 1.4} cy={ey - 1.6} r={1.8} fill={VISOR_DEEP} />
            <circle cx={rx + 1.4} cy={ey - 1.6} r={1.8} fill={VISOR_DEEP} />
          </g>
        );
      case 'cheer':
        return (
          <g fill="none" stroke={FACE} strokeWidth={2.6} strokeLinecap="round">
            <path d={`M${lx - 4} ${ey + 1} q4 -5 8 0`} />
            <path d={`M${rx - 4} ${ey + 1} q4 -5 8 0`} />
          </g>
        );
      default:
        return (
          <g>
            <ellipse cx={lx} cy={ey} rx={3.6} ry={4.4} fill={FACE} />
            <ellipse cx={rx} cy={ey} rx={3.6} ry={4.4} fill={FACE} />
            <circle cx={lx + 0.8} cy={ey + 0.6} r={1.8} fill={VISOR_DEEP} />
            <circle cx={rx + 0.8} cy={ey + 0.6} r={1.8} fill={VISOR_DEEP} />
            <circle cx={lx - 1} cy={ey - 1.6} r={0.9} fill="#fff" />
            <circle cx={rx - 1} cy={ey - 1.6} r={0.9} fill="#fff" />
          </g>
        );
    }
  })();
  const mouth = (() => {
    const s = { fill: 'none', stroke: FACE, strokeWidth: 2.4, strokeLinecap: 'round' as const };
    switch (expr) {
      case 'cheer':
        return <path d={`M53 ${my - 1} q7 9 14 0`} {...s} fill={FACE} />;
      case 'wow':
        return <ellipse cx={60} cy={my + 1} rx={3.2} ry={4.2} fill={FACE} />;
      case 'oops':
        return <path d={`M55 ${my + 2} q5 -5 10 0`} {...s} />;
      case 'ko':
        return <ellipse cx={60} cy={my + 1} rx={3.5} ry={2.5} fill={FACE} />;
      case 'dizzy':
        return <path d={`M54 ${my + 1} q3 -3 6 0 t6 0`} {...s} />;
      case 'thinking':
      case 'sleep':
        return <path d={`M55 ${my} h10`} {...s} />;
      default:
        return <path d={`M54 ${my - 1} q6 6 12 0`} {...s} />;
    }
  })();
  return (
    <g>
      {eyes}
      {mouth}
    </g>
  );
}

/** What the astronaut holds in the left hand (viewer's right). */
function Prop({ prop, accent }: { prop: AstroProp; accent: string }) {
  // anchored around (92, 92)
  switch (prop) {
    case 'calculator':
      return (
        <g transform="translate(84 60) rotate(8)">
          <rect x="0" y="0" width="24" height="32" rx="4" fill={SUIT_SHADE} {...OUT} />
          <rect x="3.5" y="3.5" width="17" height="8" rx="2" fill="#CFE9DA" stroke={INK} strokeWidth={1.4} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={3.5 + c * 6} y={14.5 + r * 5.6} width="4.6" height="4" rx="1.2" fill={r === 2 && c === 2 ? accent : '#fff'} stroke={INK} strokeWidth={1.1} />
            )),
          )}
        </g>
      );
    case 'graph':
      return (
        <g transform="translate(80 62) rotate(-6)">
          <rect x="0" y="0" width="30" height="24" rx="3.5" fill="#fff" {...OUT} />
          <path d="M5 19 H26 M5 19 V5" fill="none" stroke={INK} strokeWidth={1.4} />
          <path d="M6 17 Q14 16 18 11 T26 5" fill="none" stroke={accent} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      );
    case 'protractor':
      return (
        <g transform="translate(82 70)">
          <path d="M2 18 A13 13 0 0 1 28 18 Z" fill="#fff" {...OUT} />
          {[20, 50, 80, 110, 140, 160].map((a) => {
            const r1 = 9, r2 = 12;
            const x1 = 15 + r1 * Math.cos((a * Math.PI) / 180), y1 = 18 - r1 * Math.sin((a * Math.PI) / 180);
            const x2 = 15 + r2 * Math.cos((a * Math.PI) / 180), y2 = 18 - r2 * Math.sin((a * Math.PI) / 180);
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={1.2} />;
          })}
          <circle cx="15" cy="18" r="2" fill={accent} />
        </g>
      );
    case 'pi':
    case 'sigma':
    case 'root':
    case 'infinity': {
      const glyph = prop === 'pi' ? 'π' : prop === 'sigma' ? '∑' : prop === 'root' ? '√' : '∞';
      return (
        <g transform="translate(84 62) rotate(6)">
          <rect x="0" y="0" width="26" height="28" rx="5" fill="#fff" {...OUT} />
          <text x="13" y="21" textAnchor="middle" fontSize="20" fontWeight="800" fontFamily="Nunito, ui-rounded, system-ui, sans-serif" fill={accent}>
            {glyph}
          </text>
        </g>
      );
    }
    default:
      return null;
  }
}

export function Astronaut({
  accent = '#2E9E5B',
  expr = 'happy',
  prop = 'none',
  pose = 'stand',
  glasses = false,
  star = false,
  sparkle = false,
  rocket = false,
  square = false,
  size = 96,
  title,
  className,
}: AstronautProps) {
  const armsUp = pose === 'arms-up';
  const pointing = pose === 'point';
  const waving = pose === 'wave';
  const holding = prop !== 'none';
  const gradId = `visor-${accent.replace('#', '')}`;

  return (
    <svg
      viewBox={square ? '-10 0 140 140' : '0 0 120 140'}
      width={size}
      height={square ? size : (size * 140) / 120}
      className={className}
      role="img"
      aria-label={title ?? 'Astronaut'}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={VISOR_LIGHT} />
          <stop offset="0.55" stopColor={VISOR} />
          <stop offset="1" stopColor={VISOR_DEEP} />
        </linearGradient>
      </defs>

      {rocket && (
        <g transform="translate(6 92) rotate(-28)">
          <path d="M18 34 L10 46 L22 42 Z" fill={accent} {...OUT} />
          <path d="M62 34 L70 46 L58 42 Z" fill={accent} {...OUT} />
          <path d="M22 40 Q40 -6 58 40 Z" fill="#fff" {...OUT} />
          <path d="M28 34 Q40 8 52 34 Z" fill={accent} opacity="0.25" />
          <circle cx="40" cy="26" r="6" fill={VISOR} {...OUT} />
          <path d="M30 42 Q40 62 50 42" fill="#F59E0B" stroke={INK} strokeWidth={2} />
          <path d="M34 42 Q40 54 46 42" fill="#FCD34D" />
        </g>
      )}

      {/* backpack */}
      <rect x="34" y="66" width="52" height="40" rx="10" fill={SUIT_SHADE} {...OUT} />

      {/* legs */}
      <g>
        <rect x="42" y="102" width="14" height="22" rx="6" fill={SUIT} {...OUT} />
        <rect x="64" y="102" width="14" height="22" rx="6" fill={SUIT} {...OUT} />
        <rect x="39" y="118" width="20" height="11" rx="5" fill={accent} {...OUT} />
        <rect x="61" y="118" width="20" height="11" rx="5" fill={accent} {...OUT} />
      </g>

      {/* torso */}
      <path d="M40 72 h40 q10 0 10 10 v20 q0 8 -8 8 h-44 q-8 0 -8 -8 v-20 q0 -10 10 -10 z" fill={SUIT} {...OUT} />
      <rect x="49" y="82" width="22" height="12" rx="3" fill={SUIT_SHADE} stroke={INK} strokeWidth={1.8} />
      <circle cx="55" cy="88" r="2.2" fill={accent} />
      <circle cx="62" cy="88" r="2.2" fill={VISOR} />
      {star && (
        <path d="M67 84.5 l1.3 2.6 2.9 .4 -2.1 2 .5 2.9 -2.6 -1.4 -2.6 1.4 .5 -2.9 -2.1 -2 2.9 -.4 z" fill="#F59E0B" stroke={INK} strokeWidth={1} />
      )}

      {/* right arm (viewer's left) */}
      {armsUp ? (
        <g>
          <path d="M40 80 L26 56" stroke={INK} strokeWidth={13} strokeLinecap="round" />
          <path d="M40 80 L26 56" stroke={SUIT} strokeWidth={8.5} strokeLinecap="round" />
          <circle cx="25" cy="53" r="7" fill={accent} {...OUT} />
        </g>
      ) : pointing || waving ? (
        <g>
          <path d="M40 82 L24 62" stroke={INK} strokeWidth={13} strokeLinecap="round" />
          <path d="M40 82 L24 62" stroke={SUIT} strokeWidth={8.5} strokeLinecap="round" />
          <circle cx="23" cy="59" r="7" fill={accent} {...OUT} />
          {pointing && <rect x="20.5" y="44" width="5" height="12" rx="2.5" fill={accent} {...OUT} />}
        </g>
      ) : (
        <g>
          <path d="M38 84 L30 104" stroke={INK} strokeWidth={13} strokeLinecap="round" />
          <path d="M38 84 L30 104" stroke={SUIT} strokeWidth={8.5} strokeLinecap="round" />
          <circle cx="29" cy="107" r="7" fill={accent} {...OUT} />
        </g>
      )}

      {/* left arm (viewer's right) */}
      {armsUp ? (
        <g>
          <path d="M80 80 L94 56" stroke={INK} strokeWidth={13} strokeLinecap="round" />
          <path d="M80 80 L94 56" stroke={SUIT} strokeWidth={8.5} strokeLinecap="round" />
          <circle cx="95" cy="53" r="7" fill={accent} {...OUT} />
        </g>
      ) : holding ? (
        <g>
          <path d="M82 84 L92 96" stroke={INK} strokeWidth={13} strokeLinecap="round" />
          <path d="M82 84 L92 96" stroke={SUIT} strokeWidth={8.5} strokeLinecap="round" />
          <Prop prop={prop} accent={accent} />
          <circle cx="92" cy="98" r="7" fill={accent} {...OUT} />
        </g>
      ) : (
        <g>
          <path d="M82 84 L90 104" stroke={INK} strokeWidth={13} strokeLinecap="round" />
          <path d="M82 84 L90 104" stroke={SUIT} strokeWidth={8.5} strokeLinecap="round" />
          <circle cx="91" cy="107" r="7" fill={accent} {...OUT} />
        </g>
      )}

      {/* helmet */}
      <circle cx="60" cy="48" r="34" fill={SUIT} {...OUT} />
      <path d="M60 22 a26 26 0 0 1 0 52 a26 26 0 0 1 0 -52 z" fill={`url(#${gradId})`} stroke={INK} strokeWidth={2.4} />
      <path d="M40 40 q6 -14 20 -14" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" opacity="0.55" />
      <Face expr={expr} />
      {glasses && (
        <g fill="none" stroke={FACE} strokeWidth={1.8}>
          <circle cx="51" cy="47" r="7.5" />
          <circle cx="69" cy="47" r="7.5" />
          <path d="M58.5 47 h3" />
        </g>
      )}
      {/* helmet trim */}
      <path d="M32 58 q28 18 56 0" fill="none" stroke={accent} strokeWidth={3.2} strokeLinecap="round" />

      {expr === 'oops' && (
        <path d="M96 40 q4 6 0 9 q-4 -3 0 -9 z" fill={VISOR_LIGHT} stroke={INK} strokeWidth={1.5} />
      )}
      {expr === 'sleep' && (
        <text x="92" y="30" fontSize="12" fontWeight="800" fontFamily="Nunito, system-ui, sans-serif" fill={INK} opacity="0.7">
          z z
        </text>
      )}
      {expr === 'wow' && (
        <g fill={INK} fontSize="14" fontWeight="900" fontFamily="Nunito, system-ui, sans-serif">
          <text x="18" y="24">!</text>
          <text x="98" y="24">!</text>
        </g>
      )}
      {sparkle && (
        <g fill={accent}>
          {[[16, 26], [104, 20], [100, 62]].map(([x, y], i) => (
            <path key={i} transform={`translate(${x} ${y}) scale(${i === 1 ? 1.3 : 1})`} d="M0 -5 L1.3 -1.3 5 0 1.3 1.3 0 5 -1.3 1.3 -5 0 -1.3 -1.3 Z" />
          ))}
        </g>
      )}
    </svg>
  );
}
