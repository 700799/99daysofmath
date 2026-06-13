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

    console.log('1b. Dismiss onboarding if shown...');
    const onboardingVisible = await page.locator('[role="dialog"][aria-label="Welcome tour"]').isVisible().catch(() => false);
    if (onboardingVisible) {
      // Click through all 3 onboarding cards
      for (let oi = 0; oi < 3; oi++) {
        const nextBtn = page.locator('button:has-text("Next")');
        const letsGoBtn = page.locator('button:has-text("Let\'s go!")');
        if (await letsGoBtn.isVisible().catch(() => false)) {
          await letsGoBtn.click();
          break;
        } else if (await nextBtn.isVisible().catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(300);
        } else {
          break;
        }
      }
      await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 }).catch(() => {});
      console.log('   ✓ Onboarding dismissed');
    } else {
      console.log('   ✓ No onboarding (already seen)');
    }

    console.log('2. Checking 6 domain cards visible...');
    const cards = await page.locator('a[href*="#/trail/"]').count();
    if (cards !== 6) throw new Error(`Expected 6 cards, got ${cards}`);
    console.log(`   ✓ Found ${cards} domain cards`);

    console.log('3. Clicking into 6.RP trail...');
    await page.click('a[href="#/trail/6.RP"]');
    await page.waitForSelector('text=Ratios', { timeout: 5000 });
    await page.waitForTimeout(800);
    console.log('   ✓ Trail loaded');

    console.log('4. Opening Unit 1 (visible chip in unit list)...');
    await page.getByRole('link', { name: /^Unit 1/ }).first().click();
    // Teach-first lesson is a paginated card deck — walk Next until "Finish & practice" appears.
    await page.waitForSelector('[role="dialog"][aria-label^="Lesson:"]', { timeout: 8000 });
    for (let i = 0; i < 12; i++) {
      if (
        await page.locator('button:has-text("Finish & practice")').isVisible().catch(() => false)
      )
        break;
      await page.locator('button:has-text("Next")').click();
      await page.waitForTimeout(150);
    }
    await page.locator('button:has-text("Finish & practice")').click();
    await page.waitForSelector('text=Lesson complete!', { timeout: 4000 });
    await page.locator('button:has-text("Start practice")').click();
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 }).catch(() => {});
    console.log('   ✓ Teach-first lesson: walked deck, finished, rewarded, and started practice');
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

    console.log('13. Verify sticker book sections on home (6 categories incl Challenges)...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Sticker book', { timeout: 5000 });
    for (const section of ['Units', 'Streak', 'Accuracy', 'XP', 'Mastery', 'Challenges']) {
      const present = await page.locator(`text=${section}`).first().isVisible().catch(() => false);
      if (!present) throw new Error(`Sticker section "${section}" not visible on home`);
    }
    console.log('   ✓ All 6 sticker sections present (incl. Challenges)');

    console.log('14. Verify Settings shows X / 90 sticker total...');
    await page.click('a[href="#/settings"]');
    await page.waitForSelector('text=Stickers earned', { timeout: 3000 });
    const card = await page.locator('text=Stickers earned').locator('xpath=..').textContent();
    if (!card || !/\/\s*90/.test(card)) {
      throw new Error(`Settings sticker total wrong: ${card}`);
    }
    console.log(`   ✓ ${card?.trim()}`);

    console.log('15. Verify multi-tier hint on a new problem...');
    await page.goto(BASE + '#/unit/6.RP/3', { waitUntil: 'networkidle' });
    // Dismiss the teach-first lesson modal for this fresh unit (wait for it to mount).
    await page
      .waitForSelector('[role="dialog"][aria-label^="Lesson:"]', { timeout: 6000 })
      .then(async () => {
        await page.locator('button:has-text("Maybe later")').click();
        await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 });
      })
      .catch(() => {});
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

    console.log('16. Mock test route renders with timer and first problem...');
    await page.goto(BASE + '#/test', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Mock MAP Test', { timeout: 5000 });
    const timerVisible = await page.locator('text=/\\d+:\\d{2}/').first().isVisible().catch(() => false);
    if (!timerVisible) throw new Error('Timer not visible on mock test page');
    console.log('   ✓ Mock test loaded with timer');

    console.log('17. Smart Review route loads (queue or empty state)...');
    await page.goto(BASE + '#/review', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=/Smart Review|All caught up/', { timeout: 5000 });
    console.log('   ✓ Smart Review route loaded');

    console.log('18. Daily quest ring visible in header on home...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Pick a trail', { timeout: 5000 });
    // DailyQuestRing renders an SVG circle in the header
    const ringVisible = await page.locator('header svg circle').first().isVisible().catch(() => false);
    if (!ringVisible) throw new Error('Daily quest ring SVG not found in header');
    console.log('   ✓ Daily quest ring visible in header');

    console.log('19. Practice heatmap grid visible on home...');
    // PracticeHeatmap renders 99 cells as divs inside a grid
    const heatmapTitle = await page.locator('text=Practice').first().isVisible().catch(() => false);
    if (!heatmapTitle) throw new Error('Practice heatmap section not visible on home');
    console.log('   ✓ Practice heatmap visible on home');

    console.log('20. Settings: daily goal buttons and mock test stats present...');
    await page.goto(BASE + '#/settings', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Daily XP goal', { timeout: 3000 });
    const goalBtn = await page.locator('button:has-text("30")').first().isVisible().catch(() => false);
    if (!goalBtn) throw new Error('Daily goal 30 XP button not visible in Settings');
    const mockStat = await page.locator('text=Mock tests').first().isVisible().catch(() => false);
    if (!mockStat) throw new Error('"Mock tests" stat not visible in Settings');
    console.log('   ✓ Settings: daily goal selector and mock test stats present');

    console.log('21. Onboarding shows for fresh context...');
    const freshCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const freshPage = await freshCtx.newPage();
    await freshPage.goto(BASE, { waitUntil: 'networkidle' });
    await freshPage.waitForSelector('text=Pick a trail', { timeout: 5000 });
    const freshOnboarding = await freshPage.locator('[role="dialog"][aria-label="Welcome tour"]').isVisible().catch(() => false);
    if (!freshOnboarding) throw new Error('Onboarding dialog not shown on fresh context');
    await freshPage.locator('button:has-text("Skip")').click();
    await freshPage.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 }).catch(() => {});
    const afterSkip = await freshPage.locator('[role="dialog"]').isVisible().catch(() => false);
    if (afterSkip) throw new Error('Onboarding still visible after Skip');
    await freshCtx.close();
    console.log('   ✓ Onboarding shows on fresh context and dismisses on Skip');

    console.log('22. Adaptive Practice renders a problem...');
    await page.goto(BASE + '#/practice', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Adaptive practice', { timeout: 5000 });
    const practiceReady = await page.locator('button:has-text("Check")').first().isVisible().catch(() => false);
    if (!practiceReady) throw new Error('Adaptive practice did not render a problem');
    console.log('   ✓ Adaptive practice loaded');

    console.log('23. Progress report shows skill breakdown + RIT section...');
    await page.goto(BASE + '#/report', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Progress report', { timeout: 5000 });
    // Earlier unit/mix flows recorded attempts, so the report renders skill areas.
    const byTopic = await page.locator('text=By topic area').first().isVisible().catch(() => false);
    if (!byTopic) throw new Error('Report missing "By topic area" section');
    const ritSection = await page.locator('text=RIT growth').first().isVisible().catch(() => false);
    if (!ritSection) throw new Error('Report missing RIT growth section');
    console.log('   ✓ Progress report shows skill breakdown and RIT growth');

    console.log('25. Explain-the-concept drawer opens from a problem...');
    await page.goto(BASE + '#/unit/6.RP/2', { waitUntil: 'networkidle' });
    // dismiss the auto-opened lesson deck if present
    await page
      .waitForSelector('[role="dialog"][aria-label^="Lesson:"]', { timeout: 5000 })
      .then(async () => {
        await page.locator('button:has-text("Maybe later")').click();
        await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 3000 });
      })
      .catch(() => {});
    await page.locator('button:has-text("Explain the concept")').first().click();
    await page.waitForSelector('text=The key idea', { timeout: 4000 });
    const conceptTab = await page.locator('button:has-text("Concept")').first().isVisible().catch(() => false);
    if (!conceptTab) throw new Error('Concept drawer tabs not visible');
    await page.locator('button[aria-label="Close"]').click();
    await page.waitForTimeout(300);
    console.log('   ✓ Concept drawer opens with Concept/Videos tabs');

    console.log('26. Video & lesson library renders...');
    await page.goto(BASE + '#/videos', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Video & lesson library', { timeout: 5000 });
    const unitRow = await page.locator('summary').first().isVisible().catch(() => false);
    if (!unitRow) throw new Error('No unit rows in the video library');
    console.log('   ✓ Library lists units with videos + lessons');

    console.log('27. Arcade hub renders 6 game tiles + variety meter...');
    await page.goto(BASE + '#/arcade', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Variety bonus', { timeout: 5000 });
    const tiles = await page.locator('a[href^="#/arcade/"]').count();
    if (tiles < 6) throw new Error(`Expected 6 arcade tiles, got ${tiles}`);
    console.log('   ✓ Arcade hub with 6 games');

    console.log('28. Memory Match starts and flips a card...');
    await page.goto(BASE + '#/arcade/memory', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Memory Match', { timeout: 5000 });
    await page.locator('button[aria-label="Hidden card"]').first().click();
    await page.waitForTimeout(400);
    console.log('   ✓ Memory Match playable');

    console.log('29. Level badge visible...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const badge = await page.locator('a[aria-label*="Open progress report"]').isVisible().catch(() => false);
    if (!badge) throw new Error('Level badge not visible');
    console.log('   ✓ Level badge present');

    console.log('30. Final Challenge hub lists 5 quizzes; quiz 1 starts...');
    await page.goto(BASE + '#/finals', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Final Challenge', { timeout: 5000 });
    const quizCards = await page.locator('a[href^="#/finals/"]').count();
    if (quizCards !== 5) throw new Error(`Expected 5 final quiz cards, got ${quizCards}`);
    await page.locator('a[href="#/finals/1"]').click();
    await page.waitForSelector('text=Answers revealed at the end', { timeout: 6000 });
    const lockBtn = await page.locator('button:has-text("Lock it in")').isVisible().catch(() => false);
    if (!lockBtn) throw new Error('Final quiz runner did not start');
    console.log('   ✓ Finals hub + deferred-answer runner');

    console.log('24. Home surfaces due-for-review card after a miss...');
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Pick a trail', { timeout: 5000 });
    const dueCard = await page.locator('text=/due today/').first().isVisible().catch(() => false);
    if (!dueCard) throw new Error('Expected a "due today" review card on home after missing a problem');
    console.log('   ✓ Due-for-review card present on home');

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
