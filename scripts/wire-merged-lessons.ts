/**
 * Rewrite each lesson's `videos: [...]` array so the three separate
 *   { title: 'The idea',         src: '<X>-<Y>.mp4'         }
 *   { title: 'Worked examples',  src: '<X>-<Y>-examples.mp4'}
 *   { title: 'Avoid the trap',   src: '<X>-<Y>-trap.mp4'    }
 * tiles collapse to one
 *   { title: 'Watch the lesson', src: '<X>-<Y>-lesson.mp4'  }
 * tile when a merged file exists on disk. The merged player uses the
 * chapter sidecar to pause between sections so the kid still controls pace.
 *
 * Story entries are left untouched (the famous-mathematician videos stay
 * separate per user request).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const LESSONS_FILE = path.join(ROOT, 'src', 'data', 'lessons.ts');
const MERGED_DIR = path.join(ROOT, 'public', 'videos', 'lessons');

const merged = new Set(
  fs
    .readdirSync(MERGED_DIR)
    .filter((f) => f.endsWith('-lesson.mp4'))
    .map((f) => f),
);

let src = fs.readFileSync(LESSONS_FILE, 'utf-8');
let touched = 0;

// Find each `videos: [...]` line — they're on a single line in the file.
src = src.replace(/videos:\s*\[(.*?)\]/g, (whole, body) => {
  // Pull existing entries.
  const entryRe = /\{[^}]*\}/g;
  const entries: string[] = (body.match(entryRe) ?? []) as string[];
  if (entries.length === 0) return whole;

  let stem: string | null = null;
  const stories: string[] = [];
  let sawIdea = false;
  let sawExamples = false;
  let sawTrap = false;
  for (const e of entries) {
    const m = e.match(/src:\s*['"]([^'"]+)['"]/);
    if (!m) continue;
    const file = m[1];
    if (/Story[:\s]|-story\.mp4$/i.test(e) || /-story\.mp4$/.test(file)) {
      stories.push(e);
      continue;
    }
    if (/-examples\.mp4$/.test(file)) {
      sawExamples = true;
      stem = file.replace(/-examples\.mp4$/, '');
    } else if (/-trap\.mp4$/.test(file)) {
      sawTrap = true;
      stem = file.replace(/-trap\.mp4$/, '');
    } else if (/-idea\.mp4$/.test(file)) {
      // 5.F uses an explicit `-idea` suffix.
      sawIdea = true;
      stem = file.replace(/-idea\.mp4$/, '');
    } else if (/^[^/]+-\d+\.mp4$/.test(file) && !/-(examples|trap|story|lesson)\.mp4$/.test(file)) {
      // 6.x decks use the bare `<stem>.mp4` filename for the idea video.
      sawIdea = true;
      stem = file.replace(/\.mp4$/, '');
    }
  }
  if (!stem) return whole;

  const mergedFile = `${stem}-lesson.mp4`;
  if (!merged.has(mergedFile)) return whole;
  if (!(sawIdea || sawExamples || sawTrap)) return whole;

  const lessonEntry = `{ title: 'Watch the lesson', src: '${mergedFile}' }`;
  const newEntries = [lessonEntry, ...stories];
  touched += 1;
  return `videos: [${newEntries.join(', ')}]`;
});

fs.writeFileSync(LESSONS_FILE, src, 'utf-8');
console.log(`Rewrote ${touched} lessons in ${LESSONS_FILE}`);
