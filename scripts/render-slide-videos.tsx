/**
 * Render every lesson's video from its slide deck.
 *
 * The lesson videos used to be Manim clips with a cartoon mascot and long
 * stretches of plain text on black. Each lesson already has a slide deck with
 * drawings, typeset formulas, worked steps and a "why it works" box, so the
 * video is now built from that: the same blocks the lesson card shows, laid
 * out wide on a dark mission-control frame and revealed one step at a time.
 *
 * LOCAL build tool (needs Chromium + ffmpeg and a built app for its CSS):
 *   npm run build
 *   npx tsx scripts/render-slide-videos.tsx 6.RP-3            # one lesson
 *   npx tsx scripts/render-slide-videos.tsx 6.RP-3 CALC-1     # several
 *   npx tsx scripts/render-slide-videos.tsx --all             # every lesson
 *   npx tsx scripts/render-slide-videos.tsx --all --shard 0/4 # one of 4 workers
 *
 * Output: public/videos/lessons/<key>-lesson.mp4 (1280×720, 30 fps, no audio)
 * and src/data/lessonVideoKeys.json, the list of lessons that have one.
 */
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement as h, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LESSON_SLIDES } from '../src/data/lessonSlides';
import type { LessonSlide } from '../src/data/lessonSlides/types';
import { LESSONS } from '../src/data/lessons';
import { domainCourseName, type Domain } from '../src/types/problem';
import { ArtView, CompareView, FormulaView, RichText, StepsView, TableView } from '../src/components/SlideBlocks';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'videos', 'lessons');
const KEYS_FILE = path.join(ROOT, 'src', 'data', 'lessonVideoKeys.json');
const CHROME = process.env.PW_CHROME || '/opt/pw-browsers/chromium';
const W = 1280;
const H = 720;

// ── which slides make the video ─────────────────────────────────────────────
// A deck runs 12–22 slides; read aloud at a child's pace that is ten minutes,
// and the player does not let anyone skip ahead. The video keeps the spine of
// the lesson (the goal, every key idea, three worked examples, one trap, the
// summary), preferring the slides that carry a drawing.

const visual = (s: LessonSlide) => (s.art ? 3 : 0) + (s.formula ? 2 : 0) + (s.compare ? 2 : 0) + (s.table ? 2 : 0);

export function pickSlides(deck: LessonSlide[]): LessonSlide[] {
  const keep = new Set<LessonSlide>();
  const of = (k: LessonSlide['kind']) => deck.filter((s) => s.kind === k);
  of('objective').slice(0, 1).forEach((s) => keep.add(s));
  of('concept').slice(0, 4).forEach((s) => keep.add(s));
  const ex = of('example');
  if (ex.length) {
    // The three examples with the most to look at; the base case breaks a tie.
    [...ex].sort((a, b) => visual(b) - visual(a) || ex.indexOf(a) - ex.indexOf(b)).slice(0, 3).forEach((s) => keep.add(s));
  }
  const trap = of('trap').sort((a, b) => visual(b) - visual(a))[0];
  if (trap) keep.add(trap);
  of('summary').slice(0, 1).forEach((s) => keep.add(s));
  return deck.filter((s) => keep.has(s));
}

// ── timing ──────────────────────────────────────────────────────────────────
const words = (s: string) => s.replace(/\$[^$]*\$/g, ' x ').split(/\s+/).filter(Boolean).length;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const tIntro = (s: LessonSlide) => clamp(3 + words(s.head + ' ' + s.body) * 0.16 + (visual(s) ? 1.5 : 0), 4.5, 9);
const tStep = (text: string) => clamp(2.2 + words(text) * 0.17, 3.5, 7);
const tWhy = (text: string) => clamp(2.5 + words(text) * 0.15, 4, 8);
const T_ANSWER = 2.8;
const T_TITLE = 3.2;
const T_END = 3.2;
const TWEEN = [0.35, 0.7];
const T_TWEEN = 0.07;

/**
 * Where each slide starts, in seconds, on the same clock the renderer uses.
 * The player uses these for its slide markers and previous/next buttons.
 */
export function chaptersFor(key: string): { t: number; kind: string; label: string }[] {
  const picked = pickSlides(LESSON_SLIDES[key]);
  const out = [{ t: 0, kind: 'title', label: 'Start' }];
  let t = T_TITLE;
  const reveal = (d: number) => TWEEN.length * T_TWEEN + d;
  for (const s of picked) {
    out.push({ t: Math.round(t * 100) / 100, kind: s.kind, label: s.head });
    t += tIntro(s);
    for (const st of s.steps?.steps ?? []) t += reveal(tStep(st.text));
    if (s.steps?.answer) t += reveal(T_ANSWER);
    if (s.why) t += reveal(tWhy(s.why));
  }
  out.push({ t: Math.round(t * 100) / 100, kind: 'end', label: 'Now you try' });
  return out;
}

function writeChapters(key: string) {
  fs.writeFileSync(path.join(OUT_DIR, `${key}-lesson.chapters.json`), JSON.stringify({ chapters: chaptersFor(key) }) + '\n');
}

// ── the page ────────────────────────────────────────────────────────────────
const KIND: Record<LessonSlide['kind'], { label: string; tone: string }> = {
  objective: { label: 'The goal', tone: 'cyan' },
  concept: { label: 'Key idea', tone: 'cyan' },
  example: { label: 'Worked example', tone: 'lime' },
  protip: { label: 'Pro tip', tone: 'gold' },
  trap: { label: 'Watch out', tone: 'mag' },
  challenge: { label: 'Challenge', tone: 'gold' },
  summary: { label: 'Summary', tone: 'cyan' },
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = (el: ReactElement) => renderToStaticMarkup(el);

function slideHtml(s: LessonSlide, i: number, n: number, course: string, unit: number, title: string): string {
  const k = KIND[s.kind];
  const visuals = [
    s.art ? `<div class="v-panel v-art">${html(h(ArtView, { art: s.art }))}</div>` : '',
    s.formula ? `<div class="v-panel">${html(h(FormulaView, { block: s.formula }))}</div>` : '',
    s.compare ? `<div class="v-panel">${html(h(CompareView, { block: s.compare }))}</div>` : '',
    s.table ? `<div class="v-panel">${html(h(TableView, { block: s.table }))}</div>` : '',
  ].filter(Boolean);
  const steps = s.steps ? `<div class="v-steps">${html(h(StepsView, { block: s.steps }))}</div>` : '';
  const why = s.why
    ? `<div class="v-why" data-reveal="why"><div class="v-why-k">Why it works</div>${html(h(RichText, { text: s.why }))}</div>`
    : '';
  // Steps go beside the drawing when there is one; with no other visual the
  // steps ARE the picture, so they take the wide right-hand column.
  const left = `<div class="v-col v-left"><div class="v-fit">
      <h2 class="v-head">${esc(s.head)}</h2>
      <div class="v-body">${html(h(RichText, { text: s.body }))}</div>
      ${visuals.length ? steps : ''}
      ${visuals.length ? '' : why}
    </div></div>`;
  const right = `<div class="v-col v-right"><div class="v-fit">
      ${visuals.length ? visuals.join('') + why : steps}
    </div></div>`;
  const solo = !visuals.length && !steps;
  const ticks = Array.from({ length: n }, (_, j) => `<i class="${j < i ? 'done' : j === i ? 'on' : ''}"></i>`).join('');
  return `<section class="vs tone-${k.tone} ${solo ? 'solo' : ''}" data-kind="${s.kind}">
    <div class="v-sky"></div><div class="v-grid"></div><div class="v-ruler top"></div><div class="v-ruler left"></div>
    <header class="v-top">
      <span class="v-course">${esc(course)}</span><span class="v-sep">/</span>
      <span class="v-unit">Unit ${unit}</span><span class="v-sep">/</span>
      <span class="v-title">${esc(title)}</span>
      <span class="v-kind">${k.label}</span>
    </header>
    <main class="v-main">${left}${solo ? '' : right}</main>
    <footer class="v-foot"><span class="v-ticks">${ticks}</span><span class="v-brand">math10x</span></footer>
  </section>`;
}

function cardHtml(kicker: string, big: string, small: string): string {
  return `<section class="vs tone-cyan card">
    <div class="v-sky"></div><div class="v-grid"></div><div class="v-ruler top"></div><div class="v-ruler left"></div>
    <div class="v-card"><div class="v-card-k">${esc(kicker)}</div><h1>${esc(big)}</h1><p>${esc(small)}</p>
      <div class="v-card-rule"></div></div>
    <footer class="v-foot"><span class="v-ticks"></span><span class="v-brand">math10x</span></footer>
  </section>`;
}

const VIDEO_CSS = `
:root, .dark {
  /* The app's dark tokens, retuned to the Launch Bay navy so the lesson blocks
     sit on the same deep-space ground as Home. */
  --canvas: 11 16 32; --surface: 18 26 48; --surface-2: 24 34 60;
  --line: 44 62 98; --line-strong: 66 92 140;
  --ink: 232 238 252; --ink-muted: 176 188 216; --ink-dim: 141 154 192;
  --accent: 94 231 255; --accent-hover: 94 231 255; --accent-soft: 20 44 66; --on-accent: 11 16 32;
  --ok: 157 255 138; --ok-soft: 22 48 34; --warn: 255 209 102; --warn-soft: 52 42 20;
  --bad: 255 122 150; --bad-soft: 54 22 34;
}
html, body { margin: 0; height: auto; min-height: 0; background: #05070f; }
* { animation: none !important; transition: none !important; }
/* The drawings draw themselves in with CSS animations that start invisible.
   A still frame needs their finished state. */
.sa-draw { stroke-dashoffset: 0 !important; stroke-dasharray: none !important; }
.sa-fade, .sa-slide, .sa-beat { opacity: 1 !important; transform: none !important; }
body { font-family: 'Inter', 'DejaVu Sans', sans-serif; }
.font-display { font-family: 'Inter Display', 'Inter', sans-serif !important; }
.vs { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #0b1020; color: rgb(var(--ink)); display: none; }
.vs.show { display: block; }
.v-sky { position: absolute; inset: -10%; background:
  radial-gradient(60% 50% at 82% 8%, rgba(120,80,255,.22), transparent 60%),
  radial-gradient(40% 40% at 8% 92%, rgba(94,231,255,.13), transparent 60%),
  radial-gradient(30% 30% at 50% 50%, rgba(255,106,213,.06), transparent 60%); }
.v-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(94,231,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(94,231,255,.08) 1px, transparent 1px); background-size: 48px 48px; -webkit-mask-image: radial-gradient(85% 85% at 50% 50%, #000 35%, transparent 100%); }
.v-ruler { position: absolute; }
.v-ruler.top { top: 0; left: 0; right: 0; height: 12px; background: repeating-linear-gradient(90deg, rgba(94,231,255,.38) 0 1px, transparent 1px 12px) bottom/100% 4px no-repeat, repeating-linear-gradient(90deg, rgba(94,231,255,.6) 0 1px, transparent 1px 60px) bottom/100% 8px no-repeat; }
.v-ruler.left { top: 0; bottom: 0; left: 0; width: 12px; background: repeating-linear-gradient(0deg, rgba(94,231,255,.38) 0 1px, transparent 1px 12px) right/4px 100% no-repeat, repeating-linear-gradient(0deg, rgba(94,231,255,.6) 0 1px, transparent 1px 60px) right/8px 100% no-repeat; }
.tone-cyan { --tone: 94 231 255; } .tone-lime { --tone: 157 255 138; } .tone-gold { --tone: 255 209 102; } .tone-mag { --tone: 255 106 213; }

.v-top { position: absolute; left: 34px; right: 30px; top: 24px; height: 40px; display: flex; align-items: center; gap: 10px; padding: 0 14px; border: 1px solid rgba(94,231,255,.38); border-radius: 4px; background: rgba(255,255,255,.05); font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: rgb(var(--ink-dim)); white-space: nowrap; }
.v-course { color: rgb(94 231 255); font-weight: 700; }
.v-sep { opacity: .5; }
.v-title { color: rgb(var(--ink)); overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
.v-kind { color: rgb(var(--tone)); border: 1px solid rgb(var(--tone) / .7); padding: 3px 10px; border-radius: 2px; font-weight: 700; box-shadow: 0 0 14px rgb(var(--tone) / .25); }

.v-main { position: absolute; left: 34px; right: 30px; top: 80px; bottom: 50px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 22px; }
.vs.solo .v-main { grid-template-columns: minmax(0, 1fr); padding: 0 150px; }
.v-col { min-width: 0; min-height: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
.v-fit { transform-origin: top left; }
.v-head { margin: 0 0 12px; font-family: 'Inter Display', 'Inter', sans-serif; font-weight: 800; font-size: 34px; line-height: 1.12; letter-spacing: -.01em; color: #fff; border-left: 4px solid rgb(var(--tone)); padding-left: 14px; }
.v-body p { font-size: 21px !important; line-height: 1.45 !important; color: rgb(var(--ink)) !important; }
.v-body > div > div { font-size: 22px !important; }
.v-steps > div { margin-top: 14px; }
.v-steps > div > div { padding: 10px 12px !important; border-color: rgba(94,231,255,.28) !important; background: rgba(8,12,26,.72) !important; border-width: 1px !important; border-radius: 6px !important; }
.v-steps .text-\\[14px\\] { font-size: 17px !important; line-height: 1.38 !important; }
.v-steps .overflow-x-auto { font-size: 19px !important; overflow: visible !important; }
.v-steps span.rounded-full { height: 24px !important; width: 24px !important; font-size: 13px !important; }
.v-right .v-steps > div { margin-top: 0; }
.v-panel { border: 1px solid rgba(94,231,255,.38); border-radius: 6px; background: rgba(8,12,26,.6); padding: 6px 16px 14px; box-shadow: inset 0 0 0 1px rgba(94,231,255,.08), 0 0 26px rgba(94,231,255,.12); }
.v-panel + .v-panel, .v-panel + .v-why { margin-top: 12px; }
.v-panel > * { margin-top: 8px !important; }
.v-art { padding: 14px 16px; }
.v-art figure > div { max-width: none !important; }
.v-art svg { display: block; width: 100%; height: auto; max-height: 380px; }
.v-art figcaption { font-size: 16px !important; color: rgb(var(--ink-muted)) !important; }
.v-panel .text-\\[13px\\], .v-panel .text-\\[14px\\], .v-panel .text-xs, .v-panel .text-sm { font-size: 16px !important; line-height: 1.35 !important; }
.v-panel table, .v-panel table * { font-size: 19px !important; }
.v-panel th { font-size: 15px !important; letter-spacing: .08em; }
.v-why { margin-top: 14px; border: 1px dashed rgb(255 209 102 / .7); border-radius: 6px; background: rgb(52 42 20 / .55); padding: 10px 14px 12px; }
.v-why-k { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: rgb(255 209 102); font-weight: 700; margin-bottom: 4px; }
.v-why p { font-size: 17px !important; line-height: 1.4 !important; color: rgb(var(--ink)) !important; }
.vs.solo .v-head { font-size: 44px; }
.vs.solo .v-body p { font-size: 26px !important; }
.vs.solo .v-why p { font-size: 21px !important; }

.v-foot { position: absolute; left: 34px; right: 30px; bottom: 18px; height: 18px; display: flex; align-items: center; gap: 14px; }
.v-ticks { flex: 1; display: flex; gap: 5px; }
.v-ticks i { flex: 1; height: 4px; background: rgba(94,231,255,.18); }
.v-ticks i.done { background: rgba(94,231,255,.6); }
.v-ticks i.on { background: rgb(var(--tone)); box-shadow: 0 0 10px rgb(var(--tone) / .8); }
.v-brand { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: rgba(94,231,255,.7); }

.v-card { position: absolute; left: 110px; right: 110px; top: 50%; transform: translateY(-50%); }
.v-card-k { font-family: 'JetBrains Mono', monospace; font-size: 16px; letter-spacing: .26em; text-transform: uppercase; color: rgb(94 231 255); }
.v-card h1 { margin: 14px 0 12px; font-family: 'Inter Display', 'Inter', sans-serif; font-weight: 800; font-size: 68px; line-height: 1.04; letter-spacing: -.02em; color: #fff; }
.v-card p { margin: 0; font-size: 26px; line-height: 1.4; color: rgb(var(--ink-muted)); max-width: 880px; }
.v-card-rule { margin-top: 30px; height: 10px; width: 420px; background: repeating-linear-gradient(135deg, rgba(94,231,255,.6) 0 2px, transparent 2px 10px); border-top: 1px solid rgba(94,231,255,.6); }

[data-hide="1"] { visibility: hidden; }
/* A step that has not been reached yet keeps its place as a dashed, numbered
   slot, so the slide shows how much working is coming instead of a blank. */
.v-steps [data-hide="1"] { visibility: visible; border-style: dashed !important; border-color: rgba(94,231,255,.22) !important; background: transparent !important; }
.v-steps [data-hide="1"] > *:not(span.rounded-full) { visibility: hidden; }
.v-steps [data-hide="1"] > span.rounded-full { opacity: .45; }
`;

/** Runs in the page: tag what reveals, fit columns to the frame. */
const PAGE_JS = `
window.__prep = () => {
  const out = [];
  document.querySelectorAll('.vs').forEach((sec) => {
    sec.classList.add('show');
    const reveals = [];
    const steps = sec.querySelector('.v-steps > div');
    if (steps) [...steps.children].forEach((el) => { el.dataset.hide = '1'; reveals.push(el); });
    const why = sec.querySelector('.v-why');
    if (why) { why.dataset.hide = '1'; reveals.push(why); }
    sec.__reveals = reveals;
    // Shrink a column that is taller than the frame until it fits.
    sec.querySelectorAll('.v-col').forEach((col) => {
      const fit = col.querySelector('.v-fit');
      if (!fit) return;
      let z = 1;
      while (fit.scrollHeight * z > col.clientHeight && z > 0.5) { z -= 0.03; fit.style.zoom = String(z); }
    });
    out.push(reveals.map((el) => (el.classList.contains('v-why') ? 'why' : el.querySelector('span.uppercase') ? 'answer' : 'step')));
    sec.classList.remove('show');
  });
  return out;
};
window.__show = (i) => document.querySelectorAll('.vs').forEach((s, j) => s.classList.toggle('show', i === j));
window.__reveal = (i, r, op) => {
  const el = document.querySelectorAll('.vs')[i].__reveals[r];
  if (op >= 1) { delete el.dataset.hide; el.style.opacity = ''; el.style.transform = ''; }
  else { delete el.dataset.hide; el.style.opacity = String(op); }
};
`;

function findAppCss(): string {
  const dir = path.join(ROOT, 'dist', 'assets');
  const f = fs.existsSync(dir) ? fs.readdirSync(dir).find((x) => x.endsWith('.css')) : undefined;
  if (!f) throw new Error('No built CSS in dist/assets. Run `npm run build` first.');
  // KaTeX fonts are referenced relative to the stylesheet; point them at the build.
  return fs.readFileSync(path.join(dir, f), 'utf8').replace(/url\((["']?)\/?assets\//g, `url($1file://${dir}/`).replace(/url\((["']?)(KaTeX_[^)"']+)/g, `url($1file://${dir}/$2`);
}

interface Shot { file: string; dur: number }

async function renderDeck(browser: Awaited<ReturnType<typeof chromium.launch>>, key: string, appCss: string): Promise<{ seconds: number; bytes: number }> {
  const deck = LESSON_SLIDES[key];
  const [domain, unitStr] = [key.slice(0, key.lastIndexOf('-')), key.slice(key.lastIndexOf('-') + 1)];
  const unit = Number(unitStr);
  const lesson = LESSONS.find((l) => l.domain === domain && l.unit === unit);
  const title = lesson?.title ?? key;
  const course = domainCourseName(domain as Domain);
  const picked = pickSlides(deck);

  const sections = [
    cardHtml(`${course} · Unit ${unit}`, title, lesson?.objective ?? ''),
    ...picked.map((s, i) => slideHtml(s, i, picked.length, course, unit, title)),
    cardHtml('End of lesson', 'Now you try', 'Practice the problems for this unit while the idea is fresh.'),
  ];
  const doc = `<!doctype html><html class="dark"><head><meta charset="utf-8"><style>${appCss}</style><style>${VIDEO_CSS}</style></head><body>${sections.join('')}<script>${PAGE_JS}</script></body></html>`;

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `slidevid-${key}-`));
  const htmlFile = path.join(tmp, 'deck.html');
  fs.writeFileSync(htmlFile, doc);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + htmlFile);
  await page.evaluate(() => document.fonts.ready);
  const kinds: string[][] = await page.evaluate('window.__prep()');

  const shots: Shot[] = [];
  let n = 0;
  const snap = async (dur: number) => {
    const file = path.join(tmp, `f${String(n++).padStart(5, '0')}.png`);
    await page.screenshot({ path: file, type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
    shots.push({ file, dur });
  };

  for (let i = 0; i < sections.length; i++) {
    await page.evaluate(`window.__show(${i})`);
    const s = i > 0 && i <= picked.length ? picked[i - 1] : null;
    await snap(s ? tIntro(s) : i === 0 ? T_TITLE : T_END);
    if (!s) continue;
    for (let r = 0; r < kinds[i].length; r++) {
      for (const op of TWEEN) {
        await page.evaluate(`window.__reveal(${i}, ${r}, ${op})`);
        await snap(T_TWEEN);
      }
      await page.evaluate(`window.__reveal(${i}, ${r}, 1)`);
      const kind = kinds[i][r];
      const dur = kind === 'why' ? tWhy(s.why ?? '') : kind === 'answer' ? T_ANSWER : tStep(s.steps?.steps[r]?.text ?? '');
      await snap(dur);
    }
  }
  await page.close();

  // ffmpeg concat: the last file is repeated so its duration is honoured.
  const list = shots.map((s) => `file '${s.file}'\nduration ${s.dur.toFixed(3)}`).join('\n') + `\nfile '${shots[shots.length - 1].file}'\n`;
  const listFile = path.join(tmp, 'list.txt');
  fs.writeFileSync(listFile, list);
  const out = path.join(OUT_DIR, `${key}-lesson.mp4`);
  const r = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '26', '-tune', 'stillimage', '-g', '300', '-movflags', '+faststart', '-an', out], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${key}`);
  fs.rmSync(tmp, { recursive: true, force: true });
  writeChapters(key);
  return { seconds: shots.reduce((a, s) => a + s.dur, 0), bytes: fs.statSync(out).size };
}

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const shardArg = args.includes('--shard') ? args[args.indexOf('--shard') + 1] : '';
  const [shard, shards] = shardArg ? shardArg.split('/').map(Number) : [0, 1];
  let keys = all ? Object.keys(LESSON_SLIDES) : args.filter((a) => !a.startsWith('--') && a !== shardArg);
  keys = keys.filter((k) => LESSON_SLIDES[k]?.length).filter((_, i) => i % shards === shard);
  if (!keys.length && !args.includes('--chapters-only')) throw new Error('Name one or more lesson keys (e.g. 6.RP-3) or pass --all.');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (args.includes('--chapters-only')) {
    // Rewrite the slide markers and the list of lessons with a video, no rendering.
    const have = Object.keys(LESSON_SLIDES).filter((k) => fs.existsSync(path.join(OUT_DIR, `${k}-lesson.mp4`)));
    have.forEach(writeChapters);
    fs.writeFileSync(KEYS_FILE, JSON.stringify(have) + '\n');
    console.log(`chapters + key list written for ${have.length} lessons`);
    return;
  }
  const appCss = findAppCss();
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--font-render-hinting=none'] });
  let failed = 0;
  for (const key of keys) {
    try {
      const { seconds, bytes } = await renderDeck(browser, key, appCss);
      console.log(`${key}: ${Math.round(seconds)}s, ${(bytes / 1e6).toFixed(2)} MB`);
    } catch (e) {
      failed++;
      console.error(`FAIL ${key}: ${(e as Error).message}`);
    }
  }
  await browser.close();
  // The app reads this list to know which lessons have a video.
  const have = Object.keys(LESSON_SLIDES).filter((k) => fs.existsSync(path.join(OUT_DIR, `${k}-lesson.mp4`)));
  if (shards === 1 || shard === shards - 1) fs.writeFileSync(KEYS_FILE, JSON.stringify(have, null, 0) + '\n');
  if (failed) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
