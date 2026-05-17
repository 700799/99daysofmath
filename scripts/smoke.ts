import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const BASE = 'http://localhost:4173/99daysofmath/';

const errors: string[] = [];
const consoleErrors: string[] = [];

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await ctx.newPage();

  page.on('pageerror', (e) => {
    consoleErrors.push(`pageerror: ${e.message}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`);
  });

  try {
    console.log('1. Loading home...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Pick a trail', { timeout: 5000 });
    console.log('   ✓ Home rendered');

    console.log('2. Checking 5 domain cards visible...');
    const cards = await page.locator('a[href*="#/trail/"]').count();
    if (cards !== 5) throw new Error(`Expected 5 cards, got ${cards}`);
    console.log(`   ✓ Found ${cards} domain cards`);

    console.log('3. Clicking into 6.RP trail...');
    await page.click('a[href="#/trail/6.RP"]');
    await page.waitForSelector('text=Ratios', { timeout: 5000 });
    await page.waitForTimeout(800);
    console.log('   ✓ Trail loaded');

    console.log('4. Opening Unit 1 (visible chip in unit list)...');
    await page.getByRole('link', { name: /^Unit 1/ }).first().click();
    await page.waitForSelector('text=Sam drives', { timeout: 5000 });
    console.log('   ✓ First problem loaded');

    console.log('5. Submit correct answer (60)...');
    await page.fill('input[type="text"]', '60');
    await page.click('button:has-text("Check")');
    await page.waitForSelector('button:has-text("Continue")', { timeout: 3000 });
    console.log('   ✓ Got correct feedback');

    console.log('6. Continue to next problem...');
    await page.click('button:has-text("Continue")');
    await page.waitForSelector('img[alt*="Fraction bar"]', { timeout: 3000 });
    console.log('   ✓ Next problem loaded (with diagram)');

    console.log('7. Submit wrong answer first...');
    await page.fill('input[type="text"]', '1/2');
    await page.click('button:has-text("Check")');
    await page.waitForSelector('text=Correct answer:', { timeout: 3000 });
    console.log('   ✓ Wrong feedback shows correct answer');

    console.log('8. Expand an alternative explanation...');
    const altButton = page.locator('button:has-text("As a decimal")').first();
    if ((await altButton.count()) > 0) {
      await altButton.click();
      await page.waitForTimeout(300);
      console.log('   ✓ Alt explanation expanded');
    } else {
      console.log('   ⚠ No alt explanation button found');
    }

    console.log('9. Continue (after wrong answer)...');
    await page.waitForTimeout(500); // let alt-explanation animation settle
    await page.locator('button:has-text("Got it")').click({ force: true });

    console.log('10. Loop through any remaining problems until results...');
    let loops = 0;
    while (loops < 30) {
      const resultsVisible = await page.locator('text=Unit complete').isVisible().catch(() => false);
      const perfectVisible = await page.locator('text=Perfect unit').isVisible().catch(() => false);
      if (resultsVisible || perfectVisible) break;
      const continueVisible = await page.locator('button:has-text("Continue")').isVisible().catch(() => false);
      const gotItVisible = await page.locator('button:has-text("Got it")').isVisible().catch(() => false);
      if (continueVisible) {
        await page.locator('button:has-text("Continue")').first().click({ force: true });
      } else if (gotItVisible) {
        await page.locator('button:has-text("Got it")').first().click({ force: true });
      } else {
        // Submit any answer (will be wrong but advances flow)
        const input = page.locator('input[type="text"]');
        if (await input.isVisible()) {
          await input.fill('999');
          await page.click('button:has-text("Check")');
        } else {
          // Try multiple-choice — pick A
          const mcA = page.locator('button:has(span:text("A"))').first();
          if (await mcA.isVisible().catch(() => false)) {
            await mcA.click();
            await page.click('button:has-text("Check")');
          }
        }
      }
      await page.waitForTimeout(300);
      loops++;
    }
    await page.waitForSelector('text=/Unit complete|Perfect unit/', { timeout: 5000 });
    console.log(`   ✓ Reached results page after ${loops} iterations`);

    console.log('11. Back to trail...');
    await page.click('a:has-text("Back to trail")');
    await page.waitForSelector('text=Ratios', { timeout: 3000 });
    console.log('   ✓ Returned to trail');

    console.log('12. Try Daily Mix...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.click('a[href="#/mix"]');
    await page.waitForSelector('text=Daily Mix', { timeout: 5000 });
    console.log('   ✓ Daily Mix loaded');

    console.log('13. Verify sticker book sections on home...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Sticker book', { timeout: 5000 });
    for (const section of ['Units', 'Streak', 'Accuracy', 'XP', 'Mastery']) {
      const present = await page.locator(`text=${section}`).first().isVisible().catch(() => false);
      if (!present) throw new Error(`Sticker section "${section}" not visible on home`);
    }
    console.log('   ✓ All 5 sticker sections present');

    console.log('14. Verify Settings shows X / 53 sticker total...');
    await page.click('a[href="#/settings"]');
    await page.waitForSelector('text=Stickers earned', { timeout: 3000 });
    // The "/ 53" lives in a sibling div; grab the containing card and check its full text.
    const card = await page.locator('text=Stickers earned').locator('xpath=..').textContent();
    if (!card || !/\/\s*53/.test(card)) {
      throw new Error(`Settings sticker total wrong: ${card}`);
    }
    console.log(`   ✓ ${card?.trim()}`);

    console.log('15. Verify multi-tier hint on a new problem...');
    await page.goto(BASE + '#/unit/6.RP/3', { waitUntil: 'networkidle' });
    await page.waitForSelector('button:has-text("Show hint")', { timeout: 5000 });
    await page.click('button:has-text("Show hint")');
    await page.waitForTimeout(300);
    const nudgeVisible = await page.locator('text=Nudge').first().isVisible().catch(() => false);
    if (!nudgeVisible) throw new Error('Nudge tier badge not visible');
    await page.click('button:has-text("Need another hint")');
    await page.waitForTimeout(300);
    const guideVisible = await page.locator('text=Guide').first().isVisible().catch(() => false);
    if (!guideVisible) throw new Error('Guide tier badge not visible after second click');
    console.log('   ✓ Hint tiers reveal progressively');
  } catch (e) {
    errors.push(String(e instanceof Error ? e.stack ?? e.message : e));
  }

  if (consoleErrors.length) {
    console.log('\nBrowser console errors:');
    for (const err of consoleErrors) console.log(`  ${err}`);
  }
  if (errors.length) {
    console.log('\nTest failures:');
    for (const err of errors) console.log(`  ${err}`);
    process.exit(1);
  }
  console.log('\nAll smoke checks passed.');

  await browser.close();
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
