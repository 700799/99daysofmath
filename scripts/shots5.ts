import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BASE = 'http://localhost:4173/99daysofmath/';

// Seed a state with many units unlocked so the trail and a unit-7+ problem render.
const TODAY = new Date().toISOString().slice(0, 10);
const seedState = {
  state: {
    byDomain: {
      '6.RP': { unitsUnlocked: 8, unitStars: { 1: 3, 2: 3, 3: 2, 4: 2, 5: 3, 6: 2, 7: 1 }, missedProblemIds: [] },
      '6.NS': { unitsUnlocked: 6, unitStars: { 1: 3, 2: 2, 3: 2 }, missedProblemIds: [] },
      '6.EE': { unitsUnlocked: 4, unitStars: { 1: 2 }, missedProblemIds: [] },
      '6.G':  { unitsUnlocked: 3, unitStars: { 1: 3, 2: 2 }, missedProblemIds: [] },
      '6.SP': { unitsUnlocked: 5, unitStars: { 1: 3, 2: 3, 3: 2 }, missedProblemIds: [] },
    },
    xp: 640, streak: 0, bestStreak: 9, bestSessionStreak: 9,
    dailyStreak: 6, bestDailyStreak: 11, lastPracticeDate: TODAY,
    stickers: ['streak-3', 'mock-test-1', 'quest-1', 'acc-perfect-1'],
    totalPerfectUnits: 5, soundEnabled: true,
    mockTestsCompleted: 3, bestMockAccuracy: 0.8,
    dailyXp: 40, dailyGoal: 30, dailyXpResetDate: TODAY,
    dailyQuestStreak: 3, lastGoalDate: TODAY,
    practiceDates: [TODAY], xpByDate: { [TODAY]: 40 }, lastFreezeDate: null,
    onboardingComplete: true,
    problemStats: {}, ritHistory: [], lessonsViewed: [],
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
  const ctx = await browser.newContext({ viewport: { width: 414, height: 1100 } });
  const page = await ctx.newPage();

  await page.addInitScript((seed: string) => {
    window.localStorage.setItem('99daysofmath:progress', seed);
  }, JSON.stringify(seedState));

  // Home
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Pick a trail', { timeout: 5000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r5-home.png', 'home');

  // 6.RP trail — should show 10 unit nodes
  await page.click('a[href="#/trail/6.RP"]');
  await page.waitForSelector('text=Ratios', { timeout: 5000 });
  await page.waitForTimeout(2000); // let phaser render
  await shoot(page, '/tmp/r5-trail-rp.png', '6.RP trail (10 units)');

  // 6.NS trail too
  await page.goto(BASE + '#/trail/6.NS', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await shoot(page, '/tmp/r5-trail-ns.png', '6.NS trail (10 units)');

  // Unit 7 (challenge unit) for 6.RP
  await page.goto(BASE + '#/unit/6.RP/7', { waitUntil: 'networkidle' });
  await page.waitForSelector('button:has-text("Check"),button:has-text("Show hint")', { timeout: 8000 });
  await page.waitForTimeout(800);
  await shoot(page, '/tmp/r5-unit7-rp.png', '6.RP unit 7 problem');

  // Show a hint, then expose the explanation by submitting a wrong answer
  await page.locator('button:has-text("Show hint")').click().catch(() => {});
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r5-unit7-hint.png', '6.RP unit 7 with hint');

  // Submit a clearly wrong answer to reveal the explanation
  const input = page.locator('input[type="text"]').first();
  if (await input.isVisible().catch(() => false)) {
    await input.fill('999');
    await page.locator('button:has-text("Check")').click();
    await page.waitForSelector('text=Correct answer:', { timeout: 5000 });
    // Click "As a fraction" or whatever alt-explanation chip is present to show
    // the alternative-solution method
    const altBtn = page.getByRole('button').filter({ hasText: /^(As |Using |Try |Method|Alternate|Another)/ }).first();
    if (await altBtn.isVisible().catch(() => false)) await altBtn.click();
    await page.waitForTimeout(500);
    await shoot(page, '/tmp/r5-unit7-explain.png', '6.RP unit 7 explanation + alt method');
  }

  // Settings — sticker total should be 78
  await page.goto(BASE + '#/settings', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Stickers earned', { timeout: 5000 });
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r5-settings.png', 'Settings (78 stickers)');

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
