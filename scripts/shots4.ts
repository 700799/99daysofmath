import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BASE = 'http://localhost:4173/99daysofmath/';
const TODAY = new Date().toISOString().slice(0, 10);

// A few real problem ids per cluster, with crafted accuracy to show a spread.
function stat(attempts: number, correct: number, due: string | null) {
  return { attempts, correct, lastResult: correct >= attempts ? 'correct' : 'wrong', lastSeen: TODAY, box: 0, due };
}
const problemStats: Record<string, unknown> = {};
const add = (ids: string[], attempts: number, correct: number, due: string | null = null) => {
  for (const id of ids) problemStats[id] = stat(attempts, correct, due);
};
// Strong
add(['6.RP.001', '6.RP.002', '6.RP.003', '6.RP.004'], 2, 2);
// On track
add(['6.NS.003', '6.NS.004', '6.NS.010', '6.NS.011'], 2, 1);
// Needs work + a couple due for review today
add(['6.G.001', '6.G.002', '6.G.003'], 2, 0, TODAY);
add(['6.EE.002', '6.EE.006'], 3, 1, TODAY);
// Statistics — mixed
add(['6.SP.001', '6.SP.002', '6.SP.003'], 2, 2);

const ritHistory = [
  { date: '2026-04-01', rit: 208, accuracy: 0.47 },
  { date: '2026-04-20', rit: 216, accuracy: 0.6 },
  { date: '2026-05-10', rit: 223, accuracy: 0.73 },
  { date: TODAY, rit: 229, accuracy: 0.8 },
];

const seedState = {
  state: {
    byDomain: {
      '6.RP': { unitsUnlocked: 4, unitStars: { 1: 3, 2: 2, 3: 2 }, missedProblemIds: [] },
      '6.NS': { unitsUnlocked: 2, unitStars: { 1: 2 }, missedProblemIds: [] },
      '6.EE': { unitsUnlocked: 2, unitStars: { 1: 1 }, missedProblemIds: [] },
      '6.G': { unitsUnlocked: 1, unitStars: {}, missedProblemIds: [] },
      '6.SP': { unitsUnlocked: 2, unitStars: { 1: 3 }, missedProblemIds: [] },
    },
    xp: 540,
    streak: 0,
    bestStreak: 9,
    bestSessionStreak: 9,
    dailyStreak: 6,
    bestDailyStreak: 11,
    lastPracticeDate: TODAY,
    stickers: ['unit-first', 'streak-5', 'mock-test-1', 'quest-1'],
    totalPerfectUnits: 2,
    soundEnabled: true,
    mockTestsCompleted: 4,
    bestMockAccuracy: 0.8,
    dailyXp: 35,
    dailyGoal: 30,
    dailyXpResetDate: TODAY,
    dailyQuestStreak: 3,
    lastGoalDate: TODAY,
    practiceDates: [TODAY],
    xpByDate: { [TODAY]: 35 },
    lastFreezeDate: null,
    onboardingComplete: true,
    problemStats,
    ritHistory,
    lessonsViewed: [],
  },
  version: 6,
};

async function shoot(page: any, path: string, label: string) {
  await page.screenshot({ path });
  console.log(`Saved ${path} (${label})`);
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const ctx = await browser.newContext({ viewport: { width: 414, height: 896 } });
  const page = await ctx.newPage();

  // Seed persisted state before the app boots.
  await page.addInitScript((seed: string) => {
    window.localStorage.setItem('99daysofmath:progress', seed);
  }, JSON.stringify(seedState));

  // Home (with due-review + adaptive + report links)
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Pick a trail', { timeout: 5000 });
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r4-home.png', 'home');

  // Progress report
  await page.goto(BASE + '#/report', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Progress report', { timeout: 5000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r4-report.png', 'report');

  // Smart review (due items exist)
  await page.goto(BASE + '#/review', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=/Smart Review|All caught up/', { timeout: 5000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r4-review.png', 'review');

  // Adaptive practice
  await page.goto(BASE + '#/practice', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Adaptive practice', { timeout: 5000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r4-practice.png', 'practice');

  // Teach-first lesson — paginated card deck (fresh unit 6.G/1 — not in lessonsViewed)
  await page.goto(BASE + '#/unit/6.G/1', { waitUntil: 'networkidle' });
  await page.waitForSelector('[role="dialog"][aria-label^="Lesson:"]', { timeout: 6000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r4-lesson-intro.png', 'lesson (intro card)');

  // Next → animation card (only present when a Manim video is wired in)
  await page.locator('button:has-text("Next")').click();
  await page.waitForTimeout(600);
  await shoot(page, '/tmp/r4-lesson-video.png', 'lesson (animation card)');

  // Next → concept card (key idea — text)
  await page.locator('button:has-text("Next")').click();
  await page.locator('text=How it works').waitFor({ timeout: 4000 });
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r4-lesson-concept.png', 'lesson (concept card)');

  // Next → example 1; reveal the step-by-step solution
  await page.locator('button:has-text("Next")').click();
  await page.locator('button:has-text("Show step-by-step")').waitFor({ timeout: 4000 });
  await page.locator('button:has-text("Show step-by-step")').click();
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r4-lesson-example.png', 'lesson (example revealed)');

  // Walk to the first practice card and check an answer
  for (let i = 0; i < 4; i++) {
    if (await page.locator('input[placeholder="Your answer"]').isVisible().catch(() => false))
      break;
    await page.locator('button:has-text("Next")').click();
    await page.waitForTimeout(300);
  }
  const dialog = page.locator('[role="dialog"][aria-label^="Lesson:"]');
  await dialog.locator('input[placeholder="Your answer"]').fill('54');
  await dialog.locator('button:has-text("Check")').click();
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r4-lesson-practice.png', 'lesson (practice checked)');

  // Walk to the final (watch-out) card and finish
  for (let i = 0; i < 5; i++) {
    if (await page.locator('button:has-text("Finish & practice")').isVisible().catch(() => false))
      break;
    await page.locator('button:has-text("Next")').click();
    await page.waitForTimeout(300);
  }
  await page.locator('text=Watch out for this').waitFor({ timeout: 4000 });
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r4-lesson-watchout.png', 'lesson (watch-out card)');

  // Finish the lesson to show the reward screen
  await page.locator('button:has-text("Finish & practice")').click();
  await page.waitForSelector('text=Lesson complete!', { timeout: 4000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r4-lesson-reward.png', 'lesson reward');

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
