/**
 * Generate Manim scene files for every (domain, unit) lesson — emits two
 * scenes per unit:
 *   lesson_<D>_<U>_examples.py  → class L<D><U>Examples (worked examples)
 *   lesson_<D>_<U>_trap.py      → class L<D><U>Trap     (watchOut card)
 *
 * For 5.F (no idea video yet) it also emits:
 *   lesson_<D>_<U>_idea.py      → class L<D><U>Idea     (concept bullets)
 *
 * Existing scene files are NEVER overwritten.
 *
 * Run: `npx tsx scripts/gen-video-scenes.ts`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS, type Lesson } from '../src/data/lessons';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCENES_DIR = path.join(ROOT, 'manim', 'scenes');

// Clean LaTeX-ish lesson text into Manim-safe strings WITHOUT corrupting math.
// Multiplication must stay multiplication: \cdot / \times / * / · all become a
// middle dot "·" (mathematically standard, unambiguous next to a variable x),
// never a minus sign. Common math glyphs are kept (Pango renders them); only
// genuinely unsupported characters are dropped.
const KEEP = '\\u00b7\\u00d7\\u00f7\\u2212\\u2264\\u2265\\u2248\\u00bd\\u00bc\\u00be\\u00b0';
const STRIP_RE = new RegExp(`[^\\x20-\\x7e${KEEP}\\n]`, 'g');
const py = (s: string) =>
  '"' +
  s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/[$]/g, '')
    .replace(/\\?frac\{(\d+)\}\{(\d+)\}/g, '$1/$2')
    .replace(/\\boxed\{([^}]+)\}/g, '$1')
    .replace(/\\le\b/g, '≤')
    .replace(/\\ge\b/g, '≥')
    .replace(/\\times\b/g, '×')
    .replace(/\\div\b/g, '÷')
    .replace(/\\cdot\b/g, '·')
    .replace(/[•]/g, '·') // bullet -> middle dot (multiplication)
    .replace(/[→↦]/g, '->')
    .replace(/[←]/g, '<-')
    .replace(/[–—]/g, '-') // en/em dash -> hyphen (NOT the minus/dot)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '·') // bare asterisk means multiply
    .replace(STRIP_RE, '') +
  '"';

function classBase(domain: string, unit: number): string {
  // 5.F → Lesson5F, 6.RP → Lesson6RP
  return 'Lesson' + domain.replace('.', '');
}

function fileBase(domain: string, unit: number): string {
  return `lesson_${domain.replace('.', '_')}_${unit}`;
}

function exampleScene(l: Lesson): { file: string; src: string } {
  const cls = classBase(l.domain, l.unit) + l.unit + 'Examples';
  const ex = l.examples
    .map((e) => `        (${py(e.q)}, [${e.steps.map(py).join(', ')}], ${py(e.answer)}),`)
    .join('\n');
  const src = `"""${l.domain} Unit ${l.unit} examples — ${l.title}.
Math (verified from the lesson plan):
${l.examples.map((e, i) => `  ${i + 1}. ${e.q} -> ${e.answer}`).join('\n')}
"""
from manim import *  # noqa: F401,F403
from _helpers import ExamplesDeck


class ${cls}(ExamplesDeck):
    TITLE = ${py('Examples · ' + l.title)}
    DOMAIN = "${l.domain}"
    EXAMPLES = [
${ex}
    ]
`;
  return { file: `${fileBase(l.domain, l.unit)}_examples.py`, src };
}

function trapScene(l: Lesson): { file: string; src: string } {
  const cls = classBase(l.domain, l.unit) + l.unit + 'Trap';
  // Split the watchOut into a wrong/right pair using "—" or first ":" or just halve.
  let wrong = l.watchOut;
  let right = 'Slow down and re-read.';
  const splits: [string, string][] = [
    ['—', 'after'],
    [':', 'after'],
    ['. ', 'first'],
  ];
  for (const [sep] of splits) {
    const idx = l.watchOut.indexOf(sep);
    if (idx > 8 && idx < l.watchOut.length - 8) {
      wrong = l.watchOut.slice(0, idx).trim();
      right = l.watchOut.slice(idx + sep.length).trim();
      break;
    }
  }
  if (wrong === right || wrong.length < 5) {
    wrong = l.watchOut.slice(0, Math.min(60, l.watchOut.length));
    right = 'Use the rule from the lesson.';
  }
  const src = `"""${l.domain} Unit ${l.unit} trap — ${l.title}.
Watch-out (from the lesson):
  ${l.watchOut}
"""
from manim import *  # noqa: F401,F403
from _helpers import TrapDeck


class ${cls}(TrapDeck):
    TITLE = ${py('Avoid the trap · ' + l.title)}
    DOMAIN = "${l.domain}"
    WRONG = ${py(wrong)}
    RIGHT = ${py(right)}
`;
  return { file: `${fileBase(l.domain, l.unit)}_trap.py`, src };
}

function ideaScene(l: Lesson): { file: string; src: string } {
  const cls = classBase(l.domain, l.unit) + l.unit + 'Idea';
  const bullets = l.concept.slice(0, 4).map(py).join(', ');
  const src = `"""${l.domain} Unit ${l.unit} idea — ${l.title}.
Concept bullets (from the lesson plan):
${l.concept.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}
"""
from manim import *  # noqa: F401,F403
from _helpers import IdeaDeck


class ${cls}(IdeaDeck):
    TITLE = ${py('The idea · ' + l.title)}
    DOMAIN = "${l.domain}"
    BULLETS = [${bullets}]
`;
  return { file: `${fileBase(l.domain, l.unit)}_idea.py`, src };
}

// Pass --force to overwrite existing scene files (used to push the upgraded
// templates + symbol fixes through the whole library).
const FORCE = process.argv.includes('--force');

function main() {
  let written = 0;
  let skipped = 0;
  for (const l of LESSONS) {
    const scenes = [exampleScene(l), trapScene(l)];
    if (l.domain === '5.F') scenes.push(ideaScene(l));

    for (const s of scenes) {
      const fp = path.join(SCENES_DIR, s.file);
      if (fs.existsSync(fp) && !FORCE) {
        skipped++;
        continue;
      }
      fs.writeFileSync(fp, s.src, 'utf-8');
      written++;
    }
  }
  console.log(`✓ Wrote ${written} scene file(s) (skipped ${skipped}; force=${FORCE}).`);
}

main();
