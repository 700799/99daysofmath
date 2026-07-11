/**
 * Point every lesson at its single combined video. Rewrites each `videos: [...]`
 * array in src/data/lessons.ts to one entry — `{ title: 'Watch the lesson',
 * src: '<key>-lesson.mp4' }` — where <key> is derived from the array's first
 * src (so it works whether the idea was `6.RP-1.mp4` or `5.F-1-idea.mp4`, and is
 * idempotent for lessons already wired to `<key>-lesson.mp4`).
 *
 *   node scripts/wire-combined.mjs
 *
 * Warns if a target `<key>-lesson.mp4` is missing on disk (run
 * combine-lesson-videos.mjs --all first).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LESSONS = path.join(ROOT, 'src', 'data', 'lessons.ts');
const VIDEOS = path.join(ROOT, 'public', 'videos', 'lessons');

const keyOf = (src) => src.replace(/(-idea|-lesson|-examples|-trap|-story)?\.mp4$/, '');

let text = readFileSync(LESSONS, 'utf8');
let n = 0;
const missing = [];

text = text.replace(/videos: \[[^\]]*\]/g, (arr) => {
  const first = arr.match(/src: '([^']+)'/);
  if (!first) return arr;
  const key = keyOf(first[1]);
  const combined = `${key}-lesson.mp4`;
  if (!existsSync(path.join(VIDEOS, combined))) missing.push(combined);
  n++;
  return `videos: [{ title: 'Watch the lesson', src: '${combined}' }]`;
});

writeFileSync(LESSONS, text);
console.log(`[wire-combined] rewrote ${n} lesson video arrays`);
if (missing.length) {
  console.log(`[wire-combined] WARNING — ${missing.length} combined videos not found on disk:`);
  console.log('  ' + missing.join(', '));
} else {
  console.log('[wire-combined] all combined videos present on disk ✓');
}
