/**
 * Record the homepage "How it works" walkthrough by driving the built app with
 * the pre-installed Chromium. LOCAL-ONLY build tool — never runs on Cloudflare;
 * the committed mp4/poster are what ship.
 *
 * Prereq: `npm run build` (dist/) exists. Then:
 *   node scripts/record-walkthrough.mjs
 * Produces public/videos/how-it-works.mp4 + how-it-works-poster.jpg.
 */
import { chromium } from 'playwright-core';
import { spawn, spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'videos');
const CHROME = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const PORT = 4319;
const BASE = `http://localhost:${PORT}`;
const VIEWPORT = { width: 402, height: 820 };

// Seed a lively demo state: onboarding done, some XP/coins/stars, and admin
// "unlimited" so the arcade opens straight away for the demo.
const SEED = {
  state: {
    xp: 1840,
    coins: 320,
    dailyStreak: 12,
    onboardingComplete: true,
    lessonsViewed: ['6.RP-1', '6.RP-2', '6.RP-3'],
    byDomain: { '6.RP': { unitStars: { 1: 3, 2: 2, 3: 1 } } },
    arcadeConfig: { unlimited: true },
  },
  version: 21,
};

// Client-side navigation (click real <a> links) so the heavy SPA bundle loads
// ONCE — keeps the recording tight and authentic. Each step: click, settle,
// caption, hold.
const STEPS = [
  { caption: 'Step 1 — Pick a math trail', hold: 3000 }, // initial home view
  { click: 'a[href="/trail/6.RP"]', caption: 'Step 2 — See every lesson in the trail', hold: 3200 },
  { click: 'a[href="/unit/6.RP/1"]', caption: 'Step 3 — Learn with videos & worked examples', hold: 3400 },
  { goHome: true, click: 'a[href="/videos"]', caption: 'Step 4 — A whole library of video lessons', hold: 3200 },
  { goHome: true, click: 'a[href="/arcade"]', caption: 'Step 5 — Earn arcade time by learning!', hold: 3400 },
];

function waitPort(port) {
  return new Promise((resolve) => {
    const tryOnce = () => {
      const s = net.connect(port, 'localhost');
      s.once('connect', () => { s.destroy(); resolve(); });
      s.once('error', () => { s.destroy(); setTimeout(tryOnce, 300); });
    };
    tryOnce();
  });
}

const CAPTION_JS = (text) => {
  let el = document.getElementById('__wt_caption');
  if (!el) {
    el = document.createElement('div');
    el.id = '__wt_caption';
    el.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:99999;padding:16px 18px;' +
      'background:linear-gradient(0deg,rgba(15,23,42,.96),rgba(15,23,42,.82));' +
      "color:#fff;font-family:Nunito,system-ui,sans-serif;font-weight:900;" +
      'font-size:20px;text-align:center;letter-spacing:-.3px;' +
      'box-shadow:0 -8px 24px rgba(0,0,0,.35);';
    document.body.appendChild(el);
  }
  el.textContent = text;
};

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const tmp = path.join(ROOT, '.wt-tmp');
  await fs.rm(tmp, { recursive: true, force: true });
  await fs.mkdir(tmp, { recursive: true });

  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT, stdio: 'ignore',
  });
  try {
    await waitPort(PORT);
    const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      recordVideo: { dir: tmp, size: VIEWPORT },
    });
    const page = await context.newPage();

    // Seed localStorage on the origin before app scripts run.
    await page.addInitScript((seed) => {
      try { localStorage.setItem('99daysofmath:progress', JSON.stringify(seed)); } catch {}
    }, SEED);

    // Load the app ONCE, then navigate client-side by clicking links.
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /pick a trail/i }).waitFor({ timeout: 20000 });
    await page.waitForTimeout(600);

    const clearCaption = () =>
      page.evaluate(() => document.getElementById('__wt_caption')?.remove());

    for (const step of STEPS) {
      if (step.goHome) {
        await page.locator('a[href="/"]').first().click().catch(() => {});
        await page.getByRole('heading', { name: /pick a trail/i }).waitFor({ timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(500);
      }
      if (step.click) {
        await clearCaption();
        await page.locator(step.click).first().click();
        await page.waitForTimeout(900); // route transition + render
      }
      await page.evaluate(CAPTION_JS, step.caption);
      await page.waitForTimeout(step.hold);
    }
    await clearCaption();

    await context.close(); // finalizes the video file
    await browser.close();

    // Find the produced webm.
    const files = (await fs.readdir(tmp)).filter((f) => f.endsWith('.webm'));
    if (!files.length) throw new Error('no webm produced');
    const webm = path.join(tmp, files[0]);
    const mp4 = path.join(OUT_DIR, 'how-it-works.mp4');
    const poster = path.join(OUT_DIR, 'how-it-works-poster.jpg');

    // The recorder captures the whole context lifetime, so the first several
    // seconds are the SPA bundle/font bootstrap (a blank page). Trim that lead
    // so the clip opens on real content. LEAD_TRIM ≈ time-to-first-paint on the
    // preview server (tune via env WT_LEAD if the machine is slower/faster).
    const LEAD_TRIM = process.env.WT_LEAD || '12.8';
    const ff = spawnSync(FFMPEG, [
      '-y', '-ss', LEAD_TRIM, '-i', webm,
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryslow', '-crf', '25',
      '-movflags', '+faststart',
      mp4,
    ], { stdio: 'inherit' });
    if (ff.status !== 0) throw new Error('ffmpeg mp4 failed');

    const fp = spawnSync(FFMPEG, ['-y', '-ss', '00:00:00.5', '-i', mp4, '-frames:v', '1', poster], {
      stdio: 'inherit',
    });
    if (fp.status !== 0) throw new Error('ffmpeg poster failed');

    await fs.rm(tmp, { recursive: true, force: true });
    console.log('[record-walkthrough] wrote', mp4, '+', poster);
  } finally {
    preview.kill('SIGKILL');
  }
}

main().catch((err) => {
  console.error('[record-walkthrough] failed:', err);
  process.exit(1);
});
