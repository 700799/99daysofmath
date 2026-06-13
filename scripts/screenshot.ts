import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BASE = 'http://localhost:4173/99daysofmath/';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const ctx = await browser.newContext({ viewport: { width: 414, height: 896 } });
  const page = await ctx.newPage();

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/tmp/home.png' });
  console.log('Saved /tmp/home.png');

  await page.click('a[href="#/trail/6.RP"]');
  await page.waitForTimeout(2000); // let phaser load
  const canvasCount = await page.locator('canvas').count();
  console.log(`Found ${canvasCount} canvas elements on trail page`);
  await page.screenshot({ path: '/tmp/trail.png' });
  console.log('Saved /tmp/trail.png');

  await page.locator('a:has-text("Unit 1")').first().click();
  await page.waitForSelector('text=Sam drives', { timeout: 5000 });
  await page.screenshot({ path: '/tmp/problem.png' });
  console.log('Saved /tmp/problem.png');

  await page.fill('input[type="text"]', '60');
  await page.click('button:has-text("Check")');
  await page.waitForSelector('button:has-text("Continue")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/correct.png' });
  console.log('Saved /tmp/correct.png');

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
