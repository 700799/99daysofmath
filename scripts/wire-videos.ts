/**
 * After renders finish, update src/data/lessons.ts so each lesson's `videos: []`
 * lists every video file that exists on disk for that (domain, unit).
 *
 * Naming convention enforced by scripts/render-manim.sh:
 *   <D>-<U>.mp4          → "The idea"        (legacy unsuffixed)
 *   <D>-<U>-idea.mp4     → "The idea"        (new 5.F)
 *   <D>-<U>-examples.mp4 → "Worked examples"
 *   <D>-<U>-trap.mp4     → "Avoid the trap"
 *
 * Run: `npx tsx scripts/wire-videos.ts`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const VIDEOS_DIR = path.join(ROOT, 'public', 'videos', 'lessons');
const LESSONS_FP = path.join(ROOT, 'src', 'data', 'lessons.ts');

const TITLE_FOR: Record<string, string> = {
  '': 'The idea',
  idea: 'The idea',
  examples: 'Worked examples',
  trap: 'Avoid the trap',
};

interface Slot {
  domain: string;
  unit: number;
  parts: { part: string; src: string }[];
}

function collect(): Slot[] {
  const byKey = new Map<string, Slot>();
  if (!fs.existsSync(VIDEOS_DIR)) return [];
  for (const f of fs.readdirSync(VIDEOS_DIR)) {
    const m = f.match(/^(5\.F|6\.[A-Z]+)-(\d+)(?:-(idea|examples|trap))?\.mp4$/);
    if (!m) continue;
    const [, domain, unitStr, part] = m;
    const unit = parseInt(unitStr, 10);
    const key = `${domain}-${unit}`;
    if (!byKey.has(key)) byKey.set(key, { domain, unit, parts: [] });
    byKey.get(key)!.parts.push({ part: part ?? '', src: f });
  }
  // Sort each slot in playback order: idea, examples, trap.
  const order: Record<string, number> = { '': 0, idea: 0, examples: 1, trap: 2 };
  for (const s of byKey.values()) {
    s.parts.sort((a, b) => order[a.part] - order[b.part]);
  }
  return [...byKey.values()];
}

function buildVideosArray(slot: Slot): string {
  const items = slot.parts.map((p) => `{ title: '${TITLE_FOR[p.part]}', src: '${p.src}' }`);
  return `[${items.join(', ')}]`;
}

function main() {
  const slots = collect();
  const src = fs.readFileSync(LESSONS_FP, 'utf-8');
  let next = src;
  let touched = 0;
  for (const slot of slots) {
    const lessonHeaderRe = new RegExp(
      `(domain: '${slot.domain.replace('.', '\\.')}', unit: ${slot.unit},[\\s\\S]*?)(videos\\?:\\s*\\[[^\\]]*\\]|videos:\\s*\\[[^\\]]*\\])?`,
    );
    const newVideos = `videos: ${buildVideosArray(slot)}`;
    // Match a lesson block start: "domain: 'X', unit: N, title: '...'\n    objective: '...'"
    // and rewrite/insert a `videos: [...]` line right after the `objective:` line.
    const blockRe = new RegExp(
      `(domain: '${slot.domain.replace('.', '\\.')}', unit: ${slot.unit},[^\\n]*\\n\\s*objective:[^\\n]*\\n)(\\s*videos:\\s*\\[[^\\]]*\\],\\n)?`,
    );
    const m = next.match(blockRe);
    if (!m) continue;
    const replacement = `${m[1]}    ${newVideos},\n`;
    next = next.replace(blockRe, replacement);
    touched++;
  }
  fs.writeFileSync(LESSONS_FP, next, 'utf-8');
  console.log(`✓ Wired videos into ${touched} lesson(s) (${slots.length} slot(s) on disk).`);
}

main();
