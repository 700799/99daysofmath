/**
 * Combine a lesson's separate Manim clips (idea → worked examples → avoid the
 * trap) into ONE structured video with a real introduction and section
 * dividers, so nothing "zaps" onto the screen unexplained.
 *
 * LOCAL-ONLY build tool (needs Chromium + ffmpeg). Never runs on Cloudflare —
 * the committed <key>-lesson.mp4 files are what ship.
 *
 * Run with tsx so it can import the app's lesson data:
 *   npx tsx scripts/combine-lesson-videos.mjs 6.RP-1            # one lesson
 *   npx tsx scripts/combine-lesson-videos.mjs 6.RP-1 6.RP-2 …   # several
 *   npx tsx scripts/combine-lesson-videos.mjs --all             # every lesson
 *
 * Output: public/videos/lessons/<key>-lesson.mp4 (the original segment files
 * are left untouched — they still back the Stories feature and rollback).
 */
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS, getLesson } from '../src/data/lessons';
import { DOMAIN_LABELS } from '../src/types/problem';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'videos', 'lessons');
const CHROME = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FFMPEG = process.env.FFMPEG || '/usr/bin/ffmpeg';
const W = 1280, H = 720, FPS = 30;

// ── friendly guides (introduce "the people") — stable pick per lesson ──
const GUIDES = [
  { name: 'Fox', line: "Hi, I'm Fox — let's figure this out together!", svg: foxSVG() },
  { name: 'Owl', line: "Hoot! I'm Owl. Ready to get smart with me?", svg: owlSVG() },
  { name: 'Cat', line: "Hey, I'm Cat. This one's going to click — watch!", svg: catSVG() },
];
function seed(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff; return h; }

function foxSVG() {
  return `<svg viewBox="0 0 120 120" width="150" height="150">
    <polygon points="18,20 44,44 20,52" fill="#E8833A"/><polygon points="102,20 76,44 100,52" fill="#E8833A"/>
    <circle cx="60" cy="66" r="40" fill="#F0913F"/>
    <path d="M60 106 C40 106 28 92 30 72 L60 84 L90 72 C92 92 80 106 60 106Z" fill="#fff"/>
    <circle cx="46" cy="60" r="6" fill="#1b2237"/><circle cx="74" cy="60" r="6" fill="#1b2237"/>
    <polygon points="60,74 54,68 66,68" fill="#1b2237"/></svg>`;
}
function owlSVG() {
  return `<svg viewBox="0 0 120 120" width="150" height="150">
    <ellipse cx="60" cy="64" rx="42" ry="44" fill="#8A6BD1"/>
    <circle cx="45" cy="56" r="17" fill="#fff"/><circle cx="75" cy="56" r="17" fill="#fff"/>
    <circle cx="45" cy="56" r="8" fill="#1b2237"/><circle cx="75" cy="56" r="8" fill="#1b2237"/>
    <polygon points="60,64 52,72 68,72" fill="#FFC94D"/>
    <polygon points="24,26 44,40 26,44" fill="#8A6BD1"/><polygon points="96,26 76,40 94,44" fill="#8A6BD1"/></svg>`;
}
function catSVG() {
  return `<svg viewBox="0 0 120 120" width="150" height="150">
    <polygon points="24,22 46,46 22,50" fill="#5AB0E0"/><polygon points="96,22 74,46 98,50" fill="#5AB0E0"/>
    <circle cx="60" cy="66" r="40" fill="#6EC1EC"/>
    <circle cx="46" cy="62" r="6" fill="#1b2237"/><circle cx="74" cy="62" r="6" fill="#1b2237"/>
    <polygon points="60,72 55,67 65,67" fill="#1b2237"/>
    <line x1="30" y1="72" x2="10" y2="68" stroke="#fff" stroke-width="3"/><line x1="30" y1="78" x2="10" y2="80" stroke="#fff" stroke-width="3"/>
    <line x1="90" y1="72" x2="110" y2="68" stroke="#fff" stroke-width="3"/><line x1="90" y1="78" x2="110" y2="80" stroke="#fff" stroke-width="3"/></svg>`;
}

const CARD_CSS = `
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; }
  body {
    font-family: 'Nunito', system-ui, -apple-system, sans-serif;
    background: radial-gradient(1200px 700px at 30% 0%, #17203a 0%, #0a0e1a 72%);
    color: #fff; overflow: hidden; position: relative;
    display: flex; flex-direction: column; justify-content: center;
    padding: 72px 96px;
  }
  .glow { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .38; }
  .g1 { width: 460px; height: 460px; background: #1CB0F6; top: -160px; right: -90px; }
  .g2 { width: 420px; height: 420px; background: #58CC02; bottom: -180px; left: -80px; }
  .eyebrow { font-size: 30px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: #7dd3fc; z-index: 1; }
  h1 { font-size: 72px; font-weight: 900; line-height: 1.05; z-index: 1; margin-top: 10px; }
  .obj { font-size: 40px; font-weight: 800; color: #FFC94D; margin-top: 22px; z-index: 1; max-width: 1000px; line-height: 1.2; }
  .guide { display: flex; align-items: center; gap: 22px; margin-top: 30px; z-index: 1; }
  .guide .bubble { background: rgba(255,255,255,.10); border: 2px solid rgba(255,255,255,.18); border-radius: 22px; padding: 16px 24px; font-size: 30px; font-weight: 800; }
  .roadmap { display: flex; gap: 18px; margin-top: 34px; z-index: 1; flex-wrap: wrap; }
  .chip { font-size: 27px; font-weight: 800; padding: 12px 24px; border-radius: 999px; background: rgba(255,255,255,.08); border: 2px solid rgba(255,255,255,.16); }
  .diveye { font-size: 34px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; color: #7dd3fc; z-index: 1; }
  .divttl { font-size: 96px; font-weight: 900; z-index: 1; margin-top: 8px; }
  .divsub { font-size: 40px; font-weight: 800; color: #cbd5e1; margin-top: 16px; z-index: 1; }
  .center { align-items: center; text-align: center; }
  .sumlist { list-style: none; margin-top: 30px; z-index: 1; display: flex; flex-direction: column; gap: 22px; max-width: 1040px; }
  .sumlist li { display: flex; align-items: flex-start; gap: 18px; font-size: 34px; font-weight: 800; line-height: 1.25; }
  .sumlist .tick { flex: 0 0 auto; width: 46px; height: 46px; border-radius: 50%; background: #58CC02; color: #06210a; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .problem { font-size: 44px; font-weight: 800; color: #fff; background: rgba(88,204,2,.12); border: 2px solid rgba(88,204,2,.42); border-radius: 26px; padding: 30px 36px; margin-top: 24px; line-height: 1.28; max-width: 1060px; z-index: 1; }
`;

const wrap = (inner, extraBodyClass = '') =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${CARD_CSS}</style></head>` +
  `<body class="${extraBodyClass}"><div class="glow g1"></div><div class="glow g2"></div>${inner}</body></html>`;

const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥'];

function introHTML(lesson, guide, labels) {
  const dom = DOMAIN_LABELS[lesson.domain] ?? lesson.domain;
  const chips = labels.map((l, i) => `<div class="chip">${CIRCLED[i] ?? '•'} ${esc(l)}</div>`).join('');
  return wrap(`
    <div class="eyebrow">${esc(dom)} · Lesson</div>
    <h1>${esc(lesson.title)}</h1>
    <div class="obj">🎯 ${esc(lesson.objective)}</div>
    <div class="guide">${guide.svg}<div class="bubble">${esc(guide.line)}</div></div>
    <div class="roadmap">${chips}</div>`);
}
function dividerHTML(n, title, sub) {
  return wrap(`<div class="diveye">Part ${n}</div><div class="divttl">${esc(title)}</div><div class="divsub">${esc(sub)}</div>`, 'center');
}
// A concrete problem posed at the idea stage, so kids know what they're
// solving. Uses the lesson's first worked example (or practice) question.
function problemHTML(lesson) {
  const q = lesson.examples?.[0]?.q ?? lesson.practice?.[0]?.q ?? '';
  return wrap(`
    <div class="eyebrow">Our challenge</div>
    <h1 style="font-size:56px">Can you solve this?</h1>
    <div class="problem">🤔 ${esc(q)}</div>
    <div class="divsub" style="margin-top:26px">Watch how the idea cracks it →</div>`);
}
// A real "summary clip": the key take-aways from the lesson's concept bullets.
function summaryHTML(lesson) {
  const bullets = (lesson.concept ?? []).slice(0, 4)
    .map((c) => `<li><span class="tick">✓</span><span>${esc(c)}</span></li>`).join('');
  return wrap(`
    <div class="eyebrow">In a nutshell</div>
    <h1 style="font-size:60px">Key take-aways</h1>
    <ul class="sumlist">${bullets}</ul>`);
}
function recapHTML(lesson, guide) {
  return wrap(`
    <div class="guide center" style="flex-direction:column;gap:18px">${guide.svg}
      <div class="divttl" style="font-size:80px">You've got it! 🎉</div></div>
    <div class="obj center" style="align-self:center;text-align:center">${esc(lesson.objective)}</div>
    <div class="divsub center" style="align-self:center">Now try the practice questions →</div>`, 'center');
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The teaching segments, by filename convention (NOT the lesson.videos array —
// that gets collapsed to the single combined file once a lesson is wired). Each
// section's clip is the first candidate that exists on disk. `-story`/`-lesson`
// are deliberately excluded.
const SECTIONS = [
  // Prefer `<key>-idea.mp4` (the smooth TeachingDeck idea, used by 5.F) over the
  // bare `<key>.mp4` — for 5.F the bare file is an old all-in-one CombinedDeck.
  { name: 'The Idea', sub: 'The big concept, built step by step', suffixes: ['-idea', ''] },
  { name: 'Worked Examples', sub: "Let's solve a few together", suffixes: ['-examples'] },
  { name: 'Avoid the Trap', sub: 'The mistake to watch out for', suffixes: ['-trap'] },
];

async function shotPNG(page, html, file) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({ path: file });
}

function png2mp4(png, mp4, dur) {
  const fadeOut = Math.max(0, dur - 0.4);
  const r = spawnSync(FFMPEG, [
    '-y', '-loop', '1', '-t', String(dur), '-i', png,
    '-vf', `scale=${W}:${H},fps=${FPS},format=yuv420p,fade=t=in:st=0:d=0.4,fade=t=out:st=${fadeOut}:d=0.4`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-crf', '20', mp4,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('png2mp4 failed: ' + png);
}

// Slow the teaching segments to 80% speed (user: "20% slower") by stretching
// their presentation timestamps. Cards keep their authored length.
const SLOW = 1.25; // 1 / 0.8

// Concatenate clips (cards + segments) with per-input normalization so the
// 480p trap and the 720p clips join seamlessly. `slow[i]` stretches clip i.
function concatClips(clips, slow, out) {
  const inputs = clips.flatMap((c) => ['-i', c]);
  const norm = clips.map((_, i) =>
    `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,` +
    `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,fps=${FPS},format=yuv420p` +
    (slow[i] ? `,setpts=${SLOW}*PTS` : '') + `[v${i}]`
  ).join(';');
  const chain = clips.map((_, i) => `[v${i}]`).join('') + `concat=n=${clips.length}:v=1:a=0[out]`;
  const r = spawnSync(FFMPEG, [
    '-y', ...inputs,
    '-filter_complex', `${norm};${chain}`,
    '-map', '[out]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-preset', process.env.X264_PRESET || 'medium', '-crf', process.env.X264_CRF || '24',
    '-movflags', '+faststart', out,
  ], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('concat failed: ' + out);
}

function keyToLesson(key) {
  const i = key.lastIndexOf('-');
  const domain = key.slice(0, i);
  const unit = Number(key.slice(i + 1));
  return getLesson(domain, unit);
}

async function buildOne(page, key, tmp) {
  const lesson = keyToLesson(key);
  if (!lesson || !lesson.videos?.length) { console.log(`skip ${key}: no lesson/videos`); return null; }
  // Resolve teaching segments by filename convention (idea → examples → trap).
  const segs = [];
  for (const sec of SECTIONS) {
    for (const suf of sec.suffixes) {
      const src = path.join(OUT_DIR, `${key}${suf}.mp4`);
      try { await fs.access(src); segs.push({ sec, src }); break; } catch { /* try next */ }
    }
  }
  if (!segs.length) { console.log(`skip ${key}: no segment videos on disk`); return null; }
  const guide = GUIDES[seed(key) % GUIDES.length];

  const clips = [];  // clip file paths
  const slow = [];   // parallel: stretch this clip 20% slower?
  const add = (file, isSlow) => { clips.push(file); slow.push(isSlow); };

  // intro card — dynamic roadmap listing each section + Summary
  const labels = [...segs.map(({ sec }) => sec.name), 'Summary'];
  const introMp4 = path.join(tmp, `${key}-intro.mp4`);
  await shotPNG(page, introHTML(lesson, guide, labels), path.join(tmp, `${key}-intro.png`));
  png2mp4(path.join(tmp, `${key}-intro.png`), introMp4, 4.5);
  add(introMp4, false);

  // each teaching section: a labeled divider, then the (20%-slower) segment
  let n = 1;
  for (const { sec, src } of segs) {
    const dMp4 = path.join(tmp, `${key}-d${n}.mp4`);
    await shotPNG(page, dividerHTML(n, sec.name, sec.sub), path.join(tmp, `${key}-d${n}.png`));
    png2mp4(path.join(tmp, `${key}-d${n}.png`), dMp4, 2.2);
    add(dMp4, false);
    // At the idea stage, pose the concrete problem the idea will solve.
    if (sec.name === 'The Idea' && (lesson.examples?.length || lesson.practice?.length)) {
      const pMp4 = path.join(tmp, `${key}-prob.mp4`);
      await shotPNG(page, problemHTML(lesson), path.join(tmp, `${key}-prob.png`));
      png2mp4(path.join(tmp, `${key}-prob.png`), pMp4, 5.5);
      add(pMp4, false);
    }
    add(src, true);
    n++;
  }

  // summary clip — a divider + the key take-aways
  const sDivMp4 = path.join(tmp, `${key}-sdiv.mp4`);
  await shotPNG(page, dividerHTML(n, 'Summary', 'The key things to remember'), path.join(tmp, `${key}-sdiv.png`));
  png2mp4(path.join(tmp, `${key}-sdiv.png`), sDivMp4, 2.2);
  add(sDivMp4, false);
  const sumMp4 = path.join(tmp, `${key}-sum.mp4`);
  await shotPNG(page, summaryHTML(lesson), path.join(tmp, `${key}-sum.png`));
  png2mp4(path.join(tmp, `${key}-sum.png`), sumMp4, 8.0);
  add(sumMp4, false);

  // recap card
  const rMp4 = path.join(tmp, `${key}-recap.mp4`);
  await shotPNG(page, recapHTML(lesson, guide), path.join(tmp, `${key}-recap.png`));
  png2mp4(path.join(tmp, `${key}-recap.png`), rMp4, 3.6);
  add(rMp4, false);

  const out = path.join(OUT_DIR, `${key}-lesson.mp4`);
  concatClips(clips, slow, out);
  console.log(`✓ ${key} → ${path.basename(out)} (${clips.length} clips)`);
  return out;
}

async function main() {
  let args = process.argv.slice(2);
  if (args.includes('--all')) {
    args = LESSONS.map((l) => `${l.domain}-${l.unit}`);
  }
  if (!args.length) { console.error('usage: combine-lesson-videos.mjs <key…> | --all'); process.exit(1); }

  const tmp = path.join(ROOT, '.combine-tmp');
  await fs.rm(tmp, { recursive: true, force: true });
  await fs.mkdir(tmp, { recursive: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  try {
    for (const key of args) await buildOne(page, key, tmp);
  } finally {
    await browser.close();
    await fs.rm(tmp, { recursive: true, force: true });
  }
  console.log('[combine] done');
}

main().catch((e) => { console.error('[combine] failed:', e); process.exit(1); });
