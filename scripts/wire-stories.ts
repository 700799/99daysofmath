/**
 * Append a "🎬 Story time" video to each chosen lesson's videos[] array.
 *
 * Each entry maps (domain, unit) -> story video title. The renderer emits
 * <domain>-<unit>-story.mp4, so we just append { title, src } to the right
 * lesson block. Idempotent: skips if the story video is already wired.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const LESSONS_FP = path.join(ROOT, 'src', 'data', 'lessons.ts');

interface Wire {
  domain: string;
  unit: number;
  title: string;
}

const STORIES: Wire[] = [
  { domain: '6.NS', unit: 7,  title: 'Story: Gauss adds 1 to 100' },
  { domain: '6.EE', unit: 1,  title: 'Story: Penny doubles every day' },
  { domain: '6.EE', unit: 6,  title: "Story: Fibonacci's rabbits" },
  { domain: '5.F',  unit: 3,  title: 'Story: The pizza size scam' },
  { domain: '6.SP', unit: 4,  title: 'Story: The birthday paradox' },
  { domain: '6.RP', unit: 5,  title: 'Story: Soccer penalty kicks' },
  { domain: '6.RP', unit: 2,  title: 'Story: Baseball batting average' },
  { domain: '6.EE', unit: 9,  title: 'Story: The handshake problem' },
  { domain: '6.G',  unit: 1,  title: 'Story: The Egyptian 3-4-5 triangle' },
  { domain: '5.F',  unit: 6,  title: 'Story: The Olympic running shortcut' },
  { domain: '6.G',  unit: 3,  title: 'Story: Archimedes & the golden crown' },
  { domain: '6.NS', unit: 5,  title: 'Story: Katherine Johnson & Apollo' },
  { domain: '6.NS', unit: 3,  title: "Story: Ramanujan's taxi number" },
  { domain: '6.RP', unit: 4,  title: "Story: Turing's secret codes" },
  { domain: '6.G',  unit: 6,  title: 'Story: Why honeycombs are hexagons' },
  { domain: '6.EE', unit: 10, title: 'Story: The chessboard rice puzzle' },
  { domain: '6.NS', unit: 4,  title: 'Story: The invention of zero' },
  { domain: '6.SP', unit: 1,  title: 'Story: Tic-tac-toe strategy' },
  // Five additional famous-mathematician stories.
  { domain: '6.G',  unit: 2,  title: 'Story: Hypatia of Alexandria' },
  { domain: '6.SP', unit: 9,  title: 'Story: Florence Nightingale' },
  { domain: '6.NS', unit: 10, title: 'Story: Descartes and the fly' },
  { domain: '6.NS', unit: 1,  title: 'Story: Benjamin Banneker' },
  { domain: '6.G',  unit: 4,  title: 'Story: Maryam Mirzakhani' },
];

function main() {
  let src = fs.readFileSync(LESSONS_FP, 'utf-8');
  let touched = 0;

  for (const w of STORIES) {
    const fileName = `${w.domain}-${w.unit}-story.mp4`;
    if (src.includes(`src: '${fileName}'`)) continue; // already wired

    // Find the lesson block. Each lesson opens with `domain: 'X', unit: N,`.
    // We then look for the next `videos: [` array on that block.
    const headerRe = new RegExp(
      `(domain: '${w.domain.replace('.', '\\.')}', unit: ${w.unit},[^\\n]*\\n[\\s\\S]*?videos: \\[)([^\\]]*)(\\])`,
    );
    const m = src.match(headerRe);
    if (!m) {
      console.warn(`✗ ${w.domain}-${w.unit}: no videos array found`);
      continue;
    }
    const existing = m[2].trim();
    // Use double quotes for the title since some include apostrophes
    // ("Fibonacci's rabbits", "Turing's codes", ...).
    const titleEscaped = w.title.replace(/"/g, '\\"');
    const newEntry = `{ title: "${titleEscaped}", src: '${fileName}' }`;
    const newArrayInner = existing ? `${m[2]}, ${newEntry}` : ` ${newEntry} `;
    src = src.replace(headerRe, `$1${newArrayInner}$3`);
    touched++;
  }

  fs.writeFileSync(LESSONS_FP, src, 'utf-8');
  console.log(`✓ Wired ${touched} story videos into lessons.ts`);
}

main();
