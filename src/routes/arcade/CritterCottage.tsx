import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress, type ArcadePlayOutcome } from '../../state/progress';
import { ArcadeHeader, ArcadeEndCard } from './shared';
import { useArcadeClock } from '../../hooks/useArcadeClock';
import { Mascot as CharMascot, type MascotKind, type MascotExpr } from './Mascots';
import { MilestoneQuiz } from './MilestoneQuiz';
import { ProblemAidDrawer } from './ProblemAid';
import { useShake } from './fx';
import { sfx, haptic, HAPTIC } from '../../utils/arcadeAV';

// Critter Cottage — an 8-level carpentry builder that teaches AREA (rectangle L×W,
// square s·s, triangle ½·b·h, circle π·r²), AREA SUBTRACTION (siding = wall − window),
// and ANGLES (90/180/45/15/270). Mario-style thick borders. You measure (tap a chip),
// then SWIPE to saw the board, and the piece snaps onto the cottage. A Big Bad Wolf
// tests the build's sturdiness (Level 7), then you size a SQUARE trapdoor and spring a
// dramatic capture (Level 8) — and cute raccoons move in. Relates to the 6.G Geometry
// unit (answers recorded under '6.G').

const BUILDERS: MascotKind[] = ['raccoon', 'fox', 'bull', 'panda', 'turtle', 'cow'];
const STROKES_NEEDED = 3;
// Circle answers use a kid-friendly π ≈ 3 (real π ≈ 3.14, noted in the help drawer).

interface QA {
  prompt: string;
  answer: number;
  choices: number[];
  unit: string; // 'sq units' | '°'
  aid?: string; // prompt handed to ProblemAidDrawer (rect/triangle auto-explained)
  hint?: string; // inline hint for circle / angle / subtraction
  goldilocks?: boolean; // sizing judgment: too small / too big / just right
}
interface Phase {
  key: string;
  title: string;
  emoji: string;
  wolf?: boolean;
  trap?: boolean;
  steps: QA[];
}

const PHASES: Phase[] = [
  {
    key: 'floor', title: 'Foundation & Floor', emoji: '🪵',
    steps: [
      { prompt: 'Measure the floor: length 6, width 4.\nArea = length × width = ?', answer: 24, choices: [20, 24, 28, 32], unit: 'sq units', aid: 'A rectangle is 6 wide and 4 tall. What is its AREA?' },
    ],
  },
  {
    key: 'walls', title: 'Two-Story Walls', emoji: '🧱',
    steps: [
      { prompt: 'A tall wall is 5 wide and 8 high.\nArea = length × width = ?', answer: 40, choices: [40, 13, 35, 45], unit: 'sq units', aid: 'A rectangle is 5 wide and 8 tall. What is its AREA?' },
      { prompt: 'Every corner of the frame is a square corner.\nWhat angle is a square corner?', answer: 90, choices: [45, 90, 180, 30], unit: '°', hint: 'A square (right-angle) corner is exactly 90°.' },
    ],
  },
  {
    key: 'trim', title: 'Trim & Siding', emoji: '📐',
    steps: [
      { prompt: 'Siding covers the wall EXCEPT the window.\nWall 8×5 = 40, window 2×3 = 6.\nSiding = 40 − 6 = ?', answer: 34, choices: [34, 46, 32, 40], unit: 'sq units', hint: 'Find each area, then SUBTRACT: 40 − 6 = 34. Leftover is what you cover.' },
      { prompt: 'The window sill lies perfectly flat — a straight line.\nA straight line is what angle?', answer: 180, choices: [90, 120, 180, 270], unit: '°', hint: 'A straight line is a half turn = 180°.' },
    ],
  },
  {
    key: 'roof', title: 'Roof', emoji: '🔺',
    steps: [
      { prompt: 'The triangle roof face has base 8, height 5.\nArea = ½ × base × height = ?', answer: 20, choices: [40, 20, 13, 26], unit: 'sq units', aid: 'A triangle has base 8 and height 5. Its area = ½ × base × height = ?' },
      { prompt: 'Set the saw for the roof pitch — a nice slanted cut.\nWhich is the 45° pitch angle?', answer: 45, choices: [15, 45, 90, 180], unit: '°', hint: 'A 45° cut is halfway between flat (0°) and straight-up (90°).' },
      { prompt: 'Trim the eave with a gentle, shallow cut.\nWhich is the smallest, gentlest angle?', answer: 15, choices: [15, 45, 90, 270], unit: '°', hint: 'The smallest angle here is 15° — barely a tilt.' },
    ],
  },
  {
    key: 'chimney', title: 'Chimney & Round Window', emoji: '🪟',
    steps: [
      { prompt: 'Build the chimney: 2 wide, 6 tall.\nArea = length × width = ?', answer: 12, choices: [8, 12, 16, 10], unit: 'sq units', aid: 'A rectangle is 2 wide and 6 tall. What is its AREA?' },
      { prompt: 'Cut a ROUND window, radius 4.\nCircle area = π × r × r  (use π ≈ 3) = ?', answer: 48, choices: [24, 48, 12, 64], unit: 'sq units', hint: 'π × r × r ≈ 3 × 4 × 4 = 48. (Real π ≈ 3.14.)' },
    ],
  },
  {
    key: 'yard', title: 'Yard, Fence & Mailbox', emoji: '🏡',
    steps: [
      { prompt: 'Lay a ROUND yard, radius 6.\nCircle area = π × r × r  (use π ≈ 3) = ?', answer: 108, choices: [108, 36, 96, 120], unit: 'sq units', hint: 'π × r × r ≈ 3 × 6 × 6 = 108.' },
      { prompt: 'Spin the mailbox flag a three-quarter turn.\nHow many degrees is ¾ of a full 360° turn?', answer: 270, choices: [180, 240, 270, 300], unit: '°', hint: '¾ × 360 = 270°. (A full turn is 360°.)' },
    ],
  },
  {
    key: 'wolf', title: 'Big Bad Wolf!', emoji: '🐺', wolf: true,
    steps: [
      { prompt: 'The Big Bad Wolf huffs and puffs! 💨\nStrong walls meet at sturdy SQUARE corners.\nWhat angle makes the sturdiest corner?', answer: 90, choices: [15, 45, 90, 180], unit: '°', hint: 'Square corners (90°) brace the frame — the sturdiest build!' },
    ],
  },
  {
    key: 'trap', title: 'Set the Trap', emoji: '🕳️', trap: true,
    steps: [
      { prompt: 'To stop the wolf, dig a SQUARE trapdoor, side 5.\nA square is a rectangle with equal sides.\nArea = side × side = ?', answer: 25, choices: [10, 20, 25, 30], unit: 'sq units', aid: 'A rectangle is 5 wide and 5 tall. What is its AREA?', hint: 'A square: side × side = 5 × 5 = 25.' },
      { prompt: "The wolf's paw needs a trap of about 36 sq units.\nPick the JUST-RIGHT square trap —\nnot too small, not too big!", answer: 36, choices: [9, 25, 36, 100], unit: 'sq units', goldilocks: true, hint: 'Square areas: 3×3=9, 5×5=25, 6×6=36, 10×10=100. You want 36.' },
    ],
  },
];

// which house pieces are visible = number of fully-built phases
function House({ built, wolf, trap, caged, movedIn, hero }: { built: number; wolf: boolean; trap?: boolean; caged?: boolean; movedIn: boolean; hero: MascotKind }) {
  const S = { stroke: '#0f172a', strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const show = (n: number) => built >= n; // n = 1-based phase number
  return (
    <svg viewBox="0 0 220 210" className="w-full" style={{ overflow: 'visible' }}>
      {/* sky/ground */}
      <rect x="0" y="0" width="220" height="210" rx="10" fill="#bae6fd" />
      <rect x="0" y="176" width="220" height="34" fill="#86efac" />
      <line x1="0" y1="176" x2="220" y2="176" stroke="#16a34a" strokeWidth="3" />

      {/* yard + fence + mailbox (phase 6) */}
      {show(6) && (
        <g {...S}>
          <ellipse cx="110" cy="186" rx="98" ry="20" fill="#4ade80" />
          <ellipse cx="110" cy="186" rx="98" ry="20" fill="none" stroke="#15803d" strokeDasharray="7 6" strokeWidth="4" />
          {/* mailbox */}
          <rect x="30" y="150" width="5" height="26" fill="#92400e" />
          <rect x="22" y="140" width="20" height="13" rx="3" fill="#ef4444" />
          <rect x="40" y="143" width="5" height="7" fill="#fbbf24" />
        </g>
      )}

      {/* floor slab (phase 1) */}
      {show(1) && <rect x="66" y="150" width="88" height="26" rx="3" fill="#a16207" {...S} />}

      {/* two-storey walls (phase 2) */}
      {show(2) && (
        <g {...S}>
          <rect x="70" y="72" width="80" height="82" fill="#fde68a" />
          <line x1="70" y1="116" x2="150" y2="116" stroke="#0f172a" strokeWidth="3" />
        </g>
      )}

      {/* siding trim: door + square window opening (phase 3) */}
      {show(3) && (
        <g {...S}>
          <rect x="98" y="120" width="24" height="34" rx="2" fill="#b45309" />
          <circle cx="117" cy="138" r="1.6" fill="#fde68a" stroke="none" />
          <rect x="122" y="86" width="18" height="18" rx="2" fill="#93c5fd" />
        </g>
      )}

      {/* roof gable + rafters (phase 4) */}
      {show(4) && (
        <g {...S}>
          <path d="M60 74 L110 30 L160 74 Z" fill="#dc2626" />
          <line x1="110" y1="30" x2="85" y2="74" stroke="#7f1d1d" strokeWidth="2" />
          <line x1="110" y1="30" x2="135" y2="74" stroke="#7f1d1d" strokeWidth="2" />
        </g>
      )}

      {/* chimney + round window (phase 5) */}
      {show(5) && (
        <g {...S}>
          <rect x="128" y="34" width="12" height="24" rx="2" fill="#78716c" />
          <circle cx="110" cy="56" r="9" fill="#93c5fd" />
          <line x1="101" y1="56" x2="119" y2="56" stroke="#0f172a" strokeWidth="2" />
          <line x1="110" y1="47" x2="110" y2="65" stroke="#0f172a" strokeWidth="2" />
        </g>
      )}

      {/* circular trap pad in the front yard (phase 8) */}
      {trap && (
        <g {...S}>
          <ellipse cx="46" cy="170" rx="20" ry="9" fill="#166534" opacity="0.5" />
          <ellipse cx="46" cy="168" rx="18" ry="8" fill="#4ade80" stroke="#15803d" strokeDasharray="4 4" strokeWidth="3" />
          <text x="46" y="172" fontSize="12" textAnchor="middle">🍂</text>
        </g>
      )}

      {/* the Big Bad Wolf — huffing (phase 7) or caged in the trap (phase 8) */}
      {wolf && !movedIn && !caged && (
        <g>
          <text x="196" y="118" fontSize="30" textAnchor="middle">🐺</text>
          <text x="170" y="96" fontSize="18" textAnchor="middle">💨</text>
        </g>
      )}
      {caged && (
        <g>
          <text x="46" y="164" fontSize="22" textAnchor="middle">🐺</text>
          <g {...S} fill="none">
            <rect x="34" y="140" width="24" height="30" rx="2" stroke="#334155" strokeWidth="3" />
            <line x1="42" y1="140" x2="42" y2="170" stroke="#334155" strokeWidth="2" />
            <line x1="50" y1="140" x2="50" y2="170" stroke="#334155" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* raccoons moved in — peeking from the door/window */}
      {movedIn && (
        <>
          <g transform="translate(98,120)"><CharMascot kind="raccoon" size={26} expr="cheer" /></g>
          <g transform="translate(120,84)"><CharMascot kind={hero} size={22} expr="cheer" /></g>
          <text x="150" y="150" fontSize="16" textAnchor="middle">❤️</text>
        </>
      )}
    </svg>
  );
}

// Swipe (or tap) the plank back and forth to saw it. Each stroke rasps + buzzes;
// a few strokes cut it clean.
function SawBar({ onDone, buzz }: { onDone: () => void; buzz: (p: number | number[]) => void }) {
  const [strokes, setStrokes] = useState(0);
  const activeRef = useRef(false);
  const lastX = useRef<number | null>(null);
  const lastDir = useRef(0);
  const doneRef = useRef(false);

  const stroke = () => {
    if (doneRef.current) return;
    setStrokes((s) => {
      const n = s + 1;
      if (n >= STROKES_NEEDED) {
        doneRef.current = true;
        sfx.cut(); buzz(HAPTIC.heavy);
        window.setTimeout(onDone, 260);
      } else {
        sfx.saw(); buzz([0, 40, 15, 40]);
      }
      return n;
    });
  };

  const onMove = (x: number) => {
    if (!activeRef.current || doneRef.current) return;
    if (lastX.current == null) { lastX.current = x; return; }
    const dx = x - lastX.current;
    if (Math.abs(dx) < 14) return;
    const dir = Math.sign(dx);
    if (dir !== 0 && dir !== lastDir.current) {
      lastDir.current = dir;
      stroke();
    }
    lastX.current = x;
  };

  const pct = Math.min(100, (strokes / STROKES_NEEDED) * 100);
  return (
    <div className="mx-auto max-w-sm text-center">
      <div className="mb-2 font-display font-extrabold text-amber-800">🪚 Swipe back &amp; forth to saw the board!</div>
      <div
        className="relative mx-auto h-24 w-full select-none touch-none overflow-hidden rounded-2xl border-4 border-slate-900 bg-amber-300 shadow-[0_4px_0_0_rgba(0,0,0,0.25)]"
        onPointerDown={(e) => { activeRef.current = true; lastX.current = e.clientX; }}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerUp={() => { activeRef.current = false; lastX.current = null; }}
        onPointerLeave={() => { activeRef.current = false; lastX.current = null; }}
        onClick={stroke}
        role="button"
        aria-label="Saw the board"
      >
        {/* wood grain */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#92400e 0 2px,transparent 2px 12px)' }} />
        {/* dashed cut line */}
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 border-l-4 border-dashed border-slate-900/70" />
        {/* the saw, sliding with progress */}
        <div className="absolute top-1 text-4xl transition-[left] duration-100" style={{ left: `calc(${pct}% - 20px)` }}>🪚</div>
        <div className="absolute bottom-2 left-0 right-0 text-xs font-display font-bold text-amber-900">stroke {Math.min(strokes, STROKES_NEEDED)} / {STROKES_NEEDED}</div>
      </div>
    </div>
  );
}

// Pull-up REFERENCE + WORKSHEET drawer: the area formulas (with worked examples),
// the angle guide, and a scratchpad to work problems out. Always available.
function GuideDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [scratch, setScratch] = useState('');
  const AREAS: [string, string, string][] = [
    ['▭ Rectangle', 'Area = length × width', 'e.g. 6 × 4 = 24'],
    ['◼ Square (trap)', 'Area = side × side', 'e.g. 6 × 6 = 36'],
    ['🔺 Triangle (roof)', 'Area = ½ × base × height', 'e.g. ½ × 8 × 5 = 20'],
    ['⭕ Circle (window/yard)', 'Area = π × r × r  (π ≈ 3)', 'e.g. 3 × 4 × 4 = 48'],
    ['✂️ Trim / siding', 'SUBTRACT: wall − window', 'e.g. 40 − 6 = 34'],
  ];
  const ANGLES: [string, string][] = [
    ['15°', 'a gentle tilt — the eave trim'],
    ['45°', 'roof pitch — half of a right angle'],
    ['90°', 'a square corner (right angle)'],
    ['180°', 'a straight line — a half turn'],
    ['270°', 'a three-quarter turn'],
  ];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-slate-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] max-w-sm overflow-y-auto rounded-t-3xl border-4 border-b-0 border-slate-900 bg-amber-50 p-5 pb-8 shadow-2xl"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }} role="dialog" aria-label="Carpentry guide">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-slate-900">📐 Builder's guide</h2>
              <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-display font-bold text-slate-500">close ✕</button>
            </div>

            <div className="mt-2 text-sm font-display font-extrabold uppercase tracking-wide text-amber-700">Area formulas</div>
            <div className="mt-1 grid gap-2">
              {AREAS.map(([t, f, ex]) => (
                <div key={t} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2">
                  <div className="font-display font-extrabold text-slate-900">{t}</div>
                  <div className="font-mono text-sm font-bold text-slate-800">{f}</div>
                  <div className="font-mono text-xs text-slate-500">{ex}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm font-display font-extrabold uppercase tracking-wide text-amber-700">Angle guide</div>
            <div className="mt-1 grid gap-1.5">
              {ANGLES.map(([a, d]) => (
                <div key={a} className="flex items-center gap-2 rounded-lg bg-white border-2 border-slate-900 px-3 py-1.5">
                  <span className="w-12 shrink-0 font-mono text-base font-extrabold text-indigo-700">{a}</span>
                  <span className="text-sm text-slate-700">{d}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="mb-1 font-display text-sm font-extrabold text-slate-800">✏️ Worksheet — work it out here</div>
              <textarea value={scratch} onChange={(e) => setScratch(e.target.value)} placeholder="e.g. ½ × 8 × 5 = …" rows={3}
                className="w-full rounded-xl border-4 border-slate-900 bg-white p-2 font-mono text-base text-slate-800 focus:outline-none" />
            </div>

            <button type="button" onClick={onClose} className="mt-4 w-full rounded-2xl border-4 border-slate-900 bg-amber-400 py-3 font-display font-extrabold text-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.25)] active:translate-y-0.5">
              ▶ Back to building
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Level 8 climax: a dramatic, zoomed-in, multi-scene wolf-capture cutscene.
// The camera (a motion.div) zooms/pans per scene; the story advances on a big
// "Continue ▶" button press (never on a timer), consistent with the rest of the app.
const CUT_SCENES: { cam: { scale: number; x: number; y: number }; caged: boolean; caption: string; btn: string }[] = [
  { cam: { scale: 1, x: 0, y: 0 }, caged: false, caption: 'The Big Bad Wolf creeps back to the cottage… 🐺', btn: 'Continue ▶' },
  { cam: { scale: 1.9, x: 46, y: 8 }, caged: false, caption: 'He sniffs at the leaves — and steps toward the hidden trap… 🍂', btn: 'Continue ▶' },
  { cam: { scale: 1.9, x: 46, y: 8 }, caged: true, caption: 'SNAP! 🕸️ The square trapdoor springs — GOTCHA!', btn: 'Continue ▶' },
  { cam: { scale: 1, x: 0, y: 0 }, caged: true, caption: 'The wolf is caught and the cottage is safe! 🎉', btn: 'Let the critters move in ▶' },
];

function WolfTrapCutscene({ onDone, buzz }: { onDone: () => void; buzz: (p: number | number[]) => void }) {
  const [i, setI] = useState(0);
  const { style: shakeStyle, shake } = useShake();
  const sc = CUT_SCENES[i];
  // dramatic pan: shift the SVG toward the trap (front-left yard) as the camera zooms
  const camX = (110 - sc.cam.x) * (sc.cam.scale - 1);
  const camY = (168 - (168 + sc.cam.y)) * (sc.cam.scale - 1);

  const next = () => {
    buzz(HAPTIC.light);
    if (i >= CUT_SCENES.length - 1) { onDone(); return; }
    const to = i + 1;
    setI(to);
    if (CUT_SCENES[to].caged && !sc.caged) {
      // the SNAP scene: shake + boom
      shake(); sfx.boss(); buzz(HAPTIC.explode);
    } else if (to === 1) {
      sfx.step();
    } else if (to === CUT_SCENES.length - 1) {
      sfx.win();
    }
  };

  return (
    <div className="mx-auto mt-3 max-w-sm text-center">
      <div className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-sky-100 shadow-[0_4px_0_0_rgba(0,0,0,0.25)]" style={shakeStyle}>
        <motion.div
          animate={{ scale: sc.cam.scale, x: camX, y: camY }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ transformOrigin: 'center center' }}
        >
          <svg viewBox="0 0 220 200" className="w-full">
            {/* sky + ground */}
            <rect x="0" y="0" width="220" height="200" fill="#bae6fd" />
            <rect x="0" y="168" width="220" height="32" fill="#86efac" />
            {/* cottage silhouette on the right */}
            <g stroke="#0f172a" strokeWidth={4} strokeLinejoin="round">
              <rect x="120" y="96" width="72" height="72" fill="#fde68a" />
              <path d="M112 98 L156 58 L200 98 Z" fill="#dc2626" />
              <rect x="140" y="128" width="20" height="40" rx="2" fill="#b45309" />
              <rect x="168" y="112" width="16" height="16" rx="2" fill="#93c5fd" />
            </g>
            {/* the circular trap in the front-left yard */}
            <g stroke="#0f172a" strokeWidth={4}>
              <ellipse cx="46" cy="172" rx="22" ry="10" fill="#166534" opacity="0.55" />
              <ellipse cx="46" cy="170" rx="20" ry="9" fill="#4ade80" stroke="#15803d" strokeDasharray="5 4" strokeWidth={3} />
              {!sc.caged && <text x="46" y="175" fontSize="14" textAnchor="middle">🍂</text>}
            </g>
            {/* the wolf: approaching (scenes 0-1) or caged (2-3) */}
            {!sc.caged && <text x={i === 0 ? 92 : 60} y={i === 0 ? 150 : 160} fontSize={i === 0 ? 26 : 30} textAnchor="middle">🐺</text>}
            {sc.caged && (
              <g>
                <text x="46" y="166" fontSize="26" textAnchor="middle">🐺</text>
                <g fill="none" stroke="#334155" strokeWidth={3}>
                  <rect x="30" y="138" width="32" height="34" rx="2" />
                  <line x1="40" y1="138" x2="40" y2="172" />
                  <line x1="52" y1="138" x2="52" y2="172" />
                  <line x1="30" y1="152" x2="62" y2="152" />
                </g>
              </g>
            )}
          </svg>
        </motion.div>
      </div>
      <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mx-auto mt-3 max-w-sm whitespace-pre-line font-display text-lg font-extrabold leading-snug text-slate-800">
        {sc.caption}
      </motion.p>
      <button type="button" onClick={next}
        className="mt-3 w-full rounded-2xl border-4 border-slate-900 bg-amber-400 py-3 font-display text-lg font-extrabold text-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.25)] active:translate-y-0.5">
        {sc.btn}
      </button>
      <div className="mt-2 flex justify-center gap-1.5">
        {CUT_SCENES.map((_, k) => (
          <span key={k} className={`h-2 w-2 rounded-full ${k <= i ? 'bg-amber-500' : 'bg-slate-300'}`} />
        ))}
      </div>
    </div>
  );
}

// ── The Building Inspector's graded report, scored on first-try accuracy.
function InspectorReport({ built, total, first, miss, onCollect }: { built: number; total: number; first: number; miss: number; onCollect: () => void }) {
  const accuracy = total > 0 ? Math.round((first / total) * 100) : 100;
  const grade = accuracy >= 95 ? 'A+' : accuracy >= 90 ? 'A' : accuracy >= 80 ? 'B' : accuracy >= 70 ? 'C' : 'D';
  const comment =
    accuracy >= 95 ? 'Master carpenter! Flawless measuring.' :
    accuracy >= 90 ? 'Excellent work — sturdy and square.' :
    accuracy >= 80 ? 'Solid build. A little more care and it\'s perfect.' :
    accuracy >= 70 ? 'It stands! Keep practicing your areas.' :
    'It stands — every builder learns by re-cutting. Great effort!';
  const SKILLS = [
    'Rectangle area (length × width)',
    'Square area (side × side)',
    'Triangle roof area (½ × base × height)',
    'Circle area (π × r × r)',
    'Trim by subtracting areas',
    'Angles (15° / 45° / 90° / 180° / 270°)',
  ];
  const tiles: [string, string][] = [
    ['🏠 Rooms built', String(built)],
    ['🎯 First-try', `${first}/${total}`],
    ['🪚 Re-cuts', String(miss)],
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-3 max-w-sm rounded-2xl border-4 border-slate-900 bg-amber-50 p-4 shadow-[0_4px_0_0_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-extrabold text-slate-900">🏅 Building Inspection</h3>
        <div className="flex items-center gap-2">
          <CharMascot kind="clerk" size={34} expr="happy" />
          <span className="rounded-xl border-4 border-slate-900 bg-emerald-300 px-3 py-1 font-display text-2xl font-black tabular-nums text-slate-900">{grade}</span>
        </div>
      </div>
      <p className="mt-1 font-display text-sm font-bold text-slate-600">Inspector says: “{comment}”</p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {tiles.map(([t, v]) => (
          <div key={t} className="rounded-xl border-2 border-slate-900 bg-white px-2 py-2 text-center">
            <div className="font-display text-xl font-black tabular-nums text-slate-900">{v}</div>
            <div className="font-display text-[10px] font-bold uppercase tracking-wide text-slate-500">{t}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs font-display font-extrabold uppercase tracking-wide text-amber-700">Skills inspected</div>
      <div className="mt-1 grid gap-1">
        {SKILLS.map((s) => (
          <div key={s} className="flex items-center gap-2 rounded-lg bg-white/70 px-2 py-1 font-display text-sm font-bold text-slate-800">
            <span className="text-emerald-600">✓</span> {s}
          </div>
        ))}
      </div>

      <button type="button" onClick={onCollect}
        className="mt-4 w-full rounded-2xl border-4 border-slate-900 bg-amber-400 py-3 font-display text-lg font-extrabold text-slate-900 shadow-[0_4px_0_0_rgba(0,0,0,0.25)] active:translate-y-0.5">
        🎁 Collect house-warming bonus ▶
      </button>
    </motion.div>
  );
}

export function CritterCottage() {
  const recordArcadePlay = useProgress((s) => s.recordArcadePlay);
  const recordArcadeAnswer = useProgress((s) => s.recordArcadeAnswer);
  const addCoins = useProgress((s) => s.addCoins);
  const hapticsOn = useProgress((s) => s.hapticsEnabled);
  const buzz = (p: number | number[]) => { if (hapticsOn) haptic(p); };

  const [hero, setHero] = useState<MascotKind | null>(null);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [built, setBuilt] = useState(0); // completed phases
  const [mode, setMode] = useState<'measure' | 'saw' | 'cutscene' | 'movein'>('measure');
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [note, setNote] = useState(''); // Goldilocks sizing feedback (too small / too big)
  const [aidOpen, setAidOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [reportDone, setReportDone] = useState(false);
  const [heroExpr, setHeroExpr] = useState<MascotExpr>('happy');
  const [outcome, setOutcome] = useState<ArcadePlayOutcome | null>(null);
  useArcadeClock(!!outcome);

  // stats for the Inspector's graded report (first-try accuracy)
  const totalRef = useRef(0); // questions attempted
  const firstRef = useRef(0); // right on the first try
  const missRef = useRef(0); // total wrong taps (re-cuts)
  const missedStep = useRef(false); // did the current step get a wrong answer yet?

  const phase = PHASES[phaseIdx];
  const step = phase?.steps[stepIdx];

  const finish = () => {
    sfx.win();
    const xp = Math.max(4, Math.min(22, built * 3));
    setOutcome(recordArcadePlay('carpenter', xp));
  };

  const choose = (val: number) => {
    if (picked !== null || mode !== 'measure') return;
    setPicked(val);
    const ok = val === step.answer;
    recordArcadeAnswer('6.G', ok);
    if (ok) {
      totalRef.current += 1;
      if (!missedStep.current) firstRef.current += 1; // right on the first try
      sfx.coin(); buzz(HAPTIC.pickup);
      setNote('');
      setHeroExpr('cheer');
      window.setTimeout(() => {
        setPicked(null);
        missedStep.current = false;
        if (stepIdx < phase.steps.length - 1) {
          setStepIdx((s) => s + 1);
          setHeroExpr('happy');
        } else {
          setMode('saw'); // all questions answered → cut the board
        }
      }, 650);
    } else {
      missedStep.current = true;
      missRef.current += 1;
      sfx.hurt(); buzz(HAPTIC.death);
      setHeroExpr('dizzy');
      setWrong(true);
      // Goldilocks sizing hint: too small won't catch him, too big he'll see it
      if (step.goldilocks) setNote(val < step.answer ? 'Too small — it won\'t catch him!' : 'Too big — he\'ll see it!');
      window.setTimeout(() => { setWrong(false); setPicked(null); setHeroExpr('happy'); }, 600);
    }
  };

  const onSawDone = () => {
    sfx.build();
    const done = phaseIdx + 1;
    setBuilt(done);
    if (phase.trap) {
      // trapdoor is cut → play the dramatic wolf-capture cutscene
      setMode('cutscene');
      return;
    }
    // wolf phase (and every earlier phase) just advances to the next level
    setPhaseIdx((p) => p + 1);
    setStepIdx(0);
    setMode('measure');
    setHeroExpr('happy');
  };

  // cutscene finished → move the critters in, then the Inspector's graded report
  const onCutsceneDone = () => {
    setMode('movein');
    sfx.win(); buzz(HAPTIC.win);
  };

  const reset = () => {
    setPhaseIdx(0); setStepIdx(0); setBuilt(0); setMode('measure');
    setPicked(null); setWrong(false); setNote(''); setAidOpen(false);
    setQuizOpen(false); setReportDone(false); setHeroExpr('happy'); setOutcome(null);
    totalRef.current = 0; firstRef.current = 0; missRef.current = 0; missedStep.current = false;
  };

  // ── end card ──
  if (outcome) {
    return (
      <div>
        <ArcadeHeader title="Critter Cottage" emoji="🔨" />
        <ArcadeEndCard
          gameId="carpenter"
          outcome={outcome}
          win
          scoreLine="Cottage built — the raccoons are home! 🦝🏡"
          onReplay={() => { reset(); setHero(null); }}
        />
      </div>
    );
  }

  // ── builder picker ──
  if (!hero) {
    return (
      <div>
        <ArcadeHeader title="Critter Cottage" emoji="🔨" gameId="carpenter" />
        <p className="mx-auto mb-1 max-w-sm text-center text-sm font-display font-extrabold text-amber-800">
          📐 6.G · Geometry — Area &amp; Angles
        </p>
        <p className="mx-auto mb-3 max-w-sm text-center text-sm font-display font-bold text-slate-600">
          Pick your builder, then measure, saw and raise a cottage across 8 levels — a wolf tests it, you spring a square trap, then critters move in!
        </p>
        <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
          {BUILDERS.map((k) => (
            <button key={k} type="button" onClick={() => setHero(k)}
              className="rounded-2xl border-4 border-slate-900 bg-white p-3 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.25)] active:translate-y-0.5">
              <CharMascot kind={k} size={54} expr="happy" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const movedIn = mode === 'movein';

  return (
    <div>
      <ArcadeHeader title="Critter Cottage" emoji="🔨" gameId="carpenter" />

      {/* progress / unit banner */}
      <div className="mx-auto mb-2 flex max-w-sm items-center justify-between px-1 font-display font-extrabold">
        <span className="rounded-full border-2 border-slate-900 bg-amber-400 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-900">6.G · Geometry</span>
        <button type="button" onClick={() => setGuideOpen(true)}
          className="rounded-full border-2 border-slate-900 bg-white px-3 py-0.5 text-[12px] font-extrabold text-amber-800 active:translate-y-0.5">
          📐 Guide
        </button>
        <span className="text-slate-600 text-sm">Level {Math.min(phaseIdx + 1, PHASES.length)} / {PHASES.length}</span>
      </div>

      {/* the assembling cottage (hidden during the capture cutscene) */}
      {mode !== 'cutscene' && (
        <div className="mx-auto max-w-sm rounded-2xl border-4 border-slate-900 bg-sky-100 p-2 shadow-[0_4px_0_0_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-1 px-1 pb-1">
            <CharMascot kind={hero} size={30} expr={heroExpr} />
            <span className="font-display text-sm font-extrabold text-slate-800">{phase.emoji} {phase.title}</span>
          </div>
          <House built={built} wolf={!!phase.wolf} trap={!!phase.trap || movedIn} caged={movedIn} movedIn={movedIn} hero={hero} />
        </div>
      )}

      {/* Level 8 climax: dramatic zoom-in wolf-capture cutscene */}
      {mode === 'cutscene' && <WolfTrapCutscene onDone={onCutsceneDone} buzz={buzz} />}

      {/* move-in celebration */}
      {movedIn && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-3 max-w-sm text-center font-display text-lg font-extrabold text-emerald-700">
          🦝 The raccoons move in — home sweet home! 🏡
        </motion.p>
      )}

      {/* the Inspector's graded report, then Collect opens the bonus quiz */}
      {movedIn && !reportDone && (
        <InspectorReport
          built={built}
          total={totalRef.current}
          first={firstRef.current}
          miss={missRef.current}
          onCollect={() => { sfx.win(); buzz(HAPTIC.win); setReportDone(true); setQuizOpen(true); }}
        />
      )}

      {/* milestone bonus quiz after the report, then end */}
      {quizOpen && (
        <div className="mx-auto mt-3 max-w-sm text-center">
          <MilestoneQuiz onDone={() => { addCoins(10); finish(); }} len="word" label="🎁 House-warming bonus — solve for coins!" />
        </div>
      )}

      {/* measure step: prompt + answer chips */}
      {mode === 'measure' && step && (
        <motion.div animate={wrong ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} className="mx-auto mt-3 max-w-sm">
          <div className="rounded-2xl border-4 border-slate-900 bg-white p-3 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.25)]">
            <p className="whitespace-pre-line font-display text-base font-extrabold leading-snug text-slate-800">{step.prompt}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {step.choices.map((c) => {
              const isPick = picked === c;
              const ok = c === step.answer;
              const cls = isPick
                ? ok ? 'border-emerald-500 bg-emerald-100 text-emerald-800' : 'border-rose-500 bg-rose-100 text-rose-700'
                : 'border-slate-900 bg-white text-slate-900 active:translate-y-0.5';
              return (
                <button key={c} type="button" disabled={picked !== null} onClick={() => choose(c)}
                  className={`min-h-14 rounded-2xl border-4 font-display text-xl font-extrabold tabular-nums shadow-[0_4px_0_0_rgba(0,0,0,0.25)] ${cls}`}>
                  {c}{step.unit === '°' ? '°' : ''} <span className="text-xs font-bold opacity-60">{step.unit === '°' ? '' : step.unit}</span>
                </button>
              );
            })}
          </div>
          {note && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-2 rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-center font-display text-sm font-extrabold text-rose-600">
              {note}
            </motion.p>
          )}
          <button type="button" onClick={() => setAidOpen(true)}
            className="mt-3 min-h-10 w-full rounded-2xl border-2 border-amber-300 bg-amber-50 font-display font-extrabold text-amber-700 active:translate-y-0.5">
            📝 How to solve
          </button>
        </motion.div>
      )}

      {/* saw step */}
      {mode === 'saw' && (
        <div className="mt-3">
          <SawBar key={phaseIdx} onDone={onSawDone} buzz={buzz} />
        </div>
      )}

      <GuideDrawer open={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* rect/triangle steps get the auto step-by-step drawer */}
      <ProblemAidDrawer
        prompt={step?.aid ?? ''}
        open={aidOpen && !!step?.aid}
        onClose={() => setAidOpen(false)}
      />
      {/* inline hint fallback for circle/angle/subtraction (ProblemAid shows generic there) */}
      {aidOpen && step?.hint && !step.aid && (
        <div className="fixed inset-x-0 bottom-0 z-[60] mx-auto max-w-sm rounded-t-3xl border-4 border-b-0 border-amber-300 bg-white p-4 pb-8 shadow-2xl">
          <div className="font-display text-lg font-extrabold text-slate-900">📝 How to solve it</div>
          <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 font-mono text-sm font-bold text-slate-800">{step.hint}</p>
          <button type="button" onClick={() => setAidOpen(false)} className="mt-3 w-full rounded-2xl bg-amber-500 py-3 font-display font-extrabold text-white active:translate-y-0.5">Got it</button>
        </div>
      )}
    </div>
  );
}
