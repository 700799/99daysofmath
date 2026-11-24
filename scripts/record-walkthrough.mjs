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
const CHROME = process.env.PW_CHROME || '/opt/pw-browsers/chromium';
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const PORT = 4319;
const BASE = `http://localhost:${PORT}`;
const VIEWPORT = { width: 402, height: 820 };

// Seed a lively demo state: onboarding done, a course chosen, some XP, coins
// and stars, the cookie notice answered, and the arcade open for the demo.
const SEED = {
  state: {
    xp: 1840,
    coins: 320,
    dailyStreak: 12,
    onboardingComplete: true,
    startingCourse: 'grade6',
    // Unit 1's lesson is left unseen so it opens by itself on the unit page.
    lessonsViewed: ['6.RP-2', '6.RP-3'],
    byDomain: { '6.RP': { unitStars: { 1: 3, 2: 2, 3: 1 } } },
    arcadeConfig: { unlimited: true, answerRevealSeconds: 0 },
  },
  version: 31,
};
const CONSENT = { choice: 'essential', at: 'walkthrough' };

// Each step moves inside the single-page app (so the bundle loads once), does
// whatever makes the screen worth looking at, then shows a caption and holds.
const STEPS = [
  { caption: 'Step 1: Pick your course', hold: 3200 },
  { go: '/trail/6.RP', caption: 'Step 2: See every unit in the course', hold: 3200 },
  { go: '/unit/6.RP/1', caption: 'Step 3: Learn with slides and worked examples', hold: 2200, act: 'lesson' },
  { caption: 'Step 4: Practice with hints that build up', hold: 3600, act: 'hints' },
  { go: '/videos', caption: 'Step 5: Watch a short video for any lesson', hold: 3000 },
  { go: '/arcade', caption: 'Step 6: Earn arcade time by learning', hold: 3400 },
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
      "color:#fff;font-family:'Space Grotesk',system-ui,sans-serif;font-weight:700;" +
      'font-size:19px;text-align:center;letter-spacing:-.2px;' +
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
    const t0 = Date.now();
    let leadSeconds = 0;
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      recordVideo: { dir: tmp, size: VIEWPORT },
    });
    const page = await context.newPage();

    // Seed localStorage on the origin before app scripts run.
    await page.addInitScript(({ seed, consent }) => {
      try {
        localStorage.setItem('99daysofmath:progress', JSON.stringify(seed));
        localStorage.setItem('99daysofmath:consent', JSON.stringify(consent));
      } catch {}
    }, { seed: SEED, consent: CONSENT });

    // Load the app ONCE, then move around inside it.
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.locator('.lb-frame').waitFor({ timeout: 30000 });
    await page.waitForTimeout(1600); // colour fades into the crew
    leadSeconds = (Date.now() - t0) / 1000 - 1.2;

    const clearCaption = () =>
      page.evaluate(() => document.getElementById('__wt_caption')?.remove());
    // Client-side navigation: the router listens for popstate.
    const go = (to) =>
      page.evaluate((path) => {
        history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
      }, to);
    const lesson = page.locator('[aria-label^="Lesson:"]');
    // A step that cannot be done is skipped quickly, never waited on.
    const QUICK = { timeout: 2500 };

    for (const step of STEPS) {
      if (step.go) {
        await clearCaption();
        await go(step.go);
        await page.waitForTimeout(1100); // route transition + render
      }
      if (step.act === 'hints') {
        // Leave the lesson, then open two hint tiers on the first problem.
        await clearCaption();
        await page.getByRole('button', { name: 'Maybe later' }).click(QUICK).catch(() => {});
        await page.waitForTimeout(700);
        const hint = page.getByRole('button', { name: /Show hint/ });
        await hint.scrollIntoViewIfNeeded(QUICK).catch(() => {});
        await hint.click(QUICK).catch(() => {});
        await page.waitForTimeout(900);
        await page.getByRole('button', { name: /another hint/ }).click(QUICK).catch(() => {});
        await page.waitForTimeout(500);
        await page.getByText('Guide').first().scrollIntoViewIfNeeded(QUICK).catch(() => {});
      }
      await page.evaluate(CAPTION_JS, step.caption);
      await page.waitForTimeout(step.hold);
      if (step.act === 'lesson') {
        // Jump through the lesson's sections so the slides are seen, not just
        // the cover. (Next has a reading timer; the section chips do not.)
        for (const name of [/key idea/i, /examples/i]) {
          await lesson.getByRole('button', { name }).first().click(QUICK).catch(() => {});
          await page.waitForTimeout(1600);
          await page.mouse.move(200, 400);
          await page.mouse.wheel(0, 420);
          await page.waitForTimeout(1500);
        }
      }
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

    // The recorder captures the whole context lifetime, so the start is the
    // bundle loading on a blank page. Trim up to the moment Home was ready
    // (measured above), or WT_LEAD seconds if set.
    const LEAD_TRIM = process.env.WT_LEAD || leadSeconds.toFixed(1);
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
