/**
 * Read every manim/scenes/lesson_*_story.py file and pull out:
 *   TITLE, DOMAIN, SUBTITLE, BEATS ([{head, body, visual:funcname}]), LEARNED
 * Emit src/data/mathStories.json so the React slide-deck can use it as a
 * single source of truth without re-parsing Python at runtime.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const SCENES = path.join(ROOT, 'manim', 'scenes');
const OUT = path.join(ROOT, 'src', 'data', 'mathStories.json');

interface Beat {
  head: string;
  body: string;
  visual?: string;
}
interface Story {
  domain: string;
  unit: number;
  title: string;
  subtitle?: string;
  beats: Beat[];
  learned?: string;
  videoSrc: string;
}

function unq(s: string): string {
  return s
    .replace(/^['"]/, '')
    .replace(/['"]$/, '')
    .replace(/\\"/g, '"');
}

function extractField(src: string, name: string): string | null {
  const re = new RegExp(`${name}\\s*=\\s*("[^"]*"|'[^']*')`, 's');
  const m = src.match(re);
  return m ? unq(m[1]) : null;
}

function extractBeats(src: string): Beat[] {
  // Find the BEATS = [...] block by counting brackets.
  const start = src.indexOf('BEATS = [');
  if (start === -1) return [];
  let depth = 0;
  let end = -1;
  for (let i = src.indexOf('[', start); i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) return [];
  const block = src.slice(start, end);
  // Each beat dict opens with {"head": ... — split on that.
  const beats: Beat[] = [];
  const beatRe =
    /\{[^}]*?"head"\s*:\s*("[^"]*")[^}]*?"body"\s*:\s*("[^"]*")[^}]*?(?:"visual"\s*:\s*([A-Za-z_]\w*))?[^}]*?\}/gs;
  let m: RegExpExecArray | null;
  while ((m = beatRe.exec(block)) !== null) {
    beats.push({
      head: unq(m[1]),
      body: unq(m[2]),
      visual: m[3] || undefined,
    });
  }
  return beats;
}

function classNameToDomainUnit(file: string): { domain: string; unit: number } {
  // lesson_6_NS_7_story.py -> 6.NS, unit 7
  const m = file.match(/^lesson_(\d+)_([A-Z]+)_(\d+)_story\.py$/);
  if (!m) throw new Error(`bad story filename ${file}`);
  return { domain: `${m[1]}.${m[2]}`, unit: parseInt(m[3], 10) };
}

function main() {
  const stories: Story[] = [];
  for (const file of fs.readdirSync(SCENES)) {
    if (!file.endsWith('_story.py')) continue;
    const src = fs.readFileSync(path.join(SCENES, file), 'utf-8');
    const { domain, unit } = classNameToDomainUnit(file);
    const title = extractField(src, 'TITLE') ?? '';
    const subtitle = extractField(src, 'SUBTITLE') ?? '';
    const learned = extractField(src, 'LEARNED') ?? '';
    const beats = extractBeats(src);
    if (beats.length === 0) continue;
    stories.push({
      domain,
      unit,
      title,
      subtitle,
      beats,
      learned,
      videoSrc: `${domain}-${unit}-story.mp4`,
    });
  }
  stories.sort((a, b) =>
    a.domain === b.domain ? a.unit - b.unit : a.domain.localeCompare(b.domain),
  );
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(stories, null, 2) + '\n', 'utf-8');
  console.log(`✓ Wrote ${stories.length} stories to ${OUT}`);
}

main();
