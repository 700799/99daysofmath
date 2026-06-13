import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BASE = 'http://localhost:4173/99daysofmath/';
const TODAY = new Date().toISOString().slice(0, 10);

const seedState = {
  state: {
    byDomain: {
      '5.F': { unitsUnlocked: 6, unitStars: { 1: 3, 2: 2 }, missedProblemIds: [] },
      '6.RP': { unitsUnlocked: 10, unitStars: { 1: 3, 2: 3, 3: 2 }, missedProblemIds: [] },
      '6.NS': { unitsUnlocked: 10, unitStars: { 1: 2 }, missedProblemIds: [] },
      '6.EE': { unitsUnlocked: 10, unitStars: {}, missedProblemIds: [] },
      '6.G': { unitsUnlocked: 10, unitStars: { 1: 3 }, missedProblemIds: [] },
      '6.SP': { unitsUnlocked: 10, unitStars: {}, missedProblemIds: [] },
    },
    xp: 385, streak: 0, bestStreak: 9, bestSessionStreak: 9,
    dailyStreak: 4, bestDailyStreak: 11, lastPracticeDate: TODAY,
    stickers: ['streak-3', 'mock-test-1', 'quest-1'],
    totalPerfectUnits: 3, soundEnabled: true,
    mockTestsCompleted: 2, bestMockAccuracy: 0.78,
    dailyXp: 34, dailyGoal: 30, dailyXpResetDate: TODAY,
    dailyQuestStreak: 2, lastGoalDate: TODAY,
    practiceDates: [TODAY], xpByDate: { [TODAY]: 34 }, lastFreezeDate: null,
    onboardingComplete: true,
    problemStats: {}, ritHistory: [], lessonsViewed: ['5.F-1'],
    trailBonusGranted: {}, allTrailsBonusGranted: false,
    arcadeDaily: { date: TODAY, played: ['memory', 'wheel'], varietyAwarded: [] },
    arcadeTotals: { memory: 3, wheel: 1 },
    lastWheelSpinDate: null, c4Wins: 0,
    finalsResults: { 1: { best: 16, completedAt: TODAY } },
  },
  version: 8,
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
  const ctx = await browser.newContext({ viewport: { width: 414, height: 1180 } });
  const page = await ctx.newPage();
  await page.addInitScript((seed: string) => {
    window.localStorage.setItem('99daysofmath:progress', seed);
  }, JSON.stringify(seedState));

  // Home with 6 domains + Play grid + arcade + finals cards + level badge
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Pick a trail', { timeout: 6000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r6-home.png', 'home');

  // Arcade hub
  await page.goto(BASE + '#/arcade', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Variety bonus', { timeout: 5000 });
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r6-arcade.png', 'arcade hub');

  // Connect Four mid-game
  await page.goto(BASE + '#/arcade/connect4', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Connect Four', { timeout: 5000 });
  await page.locator('button[aria-label="Drop in column 4"]').click();
  await page.waitForTimeout(900);
  await page.locator('button[aria-label="Drop in column 3"]').click();
  await page.waitForTimeout(900);
  await shoot(page, '/tmp/r6-connect4.png', 'connect four');

  // Prize wheel
  await page.goto(BASE + '#/arcade/wheel', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Prize Wheel', { timeout: 5000 });
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r6-wheel.png', 'prize wheel');

  // Finals hub + runner
  await page.goto(BASE + '#/finals', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Final Challenge', { timeout: 5000 });
  await page.waitForTimeout(400);
  await shoot(page, '/tmp/r6-finals.png', 'finals hub');

  await page.goto(BASE + '#/finals/2', { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Answers revealed at the end', { timeout: 6000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r6-final-quiz.png', 'final quiz runner');

  // 5.F problem with diagram + concept drawer
  await page.goto(BASE + '#/unit/5.F/2', { waitUntil: 'networkidle' });
  await page
    .waitForSelector('[role="dialog"][aria-label^="Lesson:"]', { timeout: 6000 })
    .then(async () => {
      await page.locator('button:has-text("Maybe later")').click();
      await page.waitForTimeout(300);
    })
    .catch(() => {});
  await page.waitForTimeout(600);
  await shoot(page, '/tmp/r6-5f-problem.png', '5.F fraction problem with diagram');

  await page.locator('button:has-text("Explain the concept")').first().click();
  await page.waitForSelector('text=The key idea', { timeout: 4000 });
  await page.waitForTimeout(500);
  await shoot(page, '/tmp/r6-drawer.png', 'concept drawer');

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
