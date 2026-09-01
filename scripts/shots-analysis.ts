// Screenshot pass for the post-test analysis surfaces. Seeds a realistic
// mock-test-1 result into localStorage, then captures the analysis page and
// the custom recovery drill. Run with: npx tsx scripts/shots-analysis.ts
import { chromium } from 'playwright-core';
import { SAT_MOCK_TESTS, allQuestions } from '../src/data/sat/tests';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';

async function main() {
  const test1 = SAT_MOCK_TESTS[0];
  const qs = allQuestions(test1);

  // The scenario: quadratics (unit 7) collapses, two easy careless slips,
  // two blanks at the end of module 2, one numeric entry miss.
  const answers: Record<string, string> = {};
  const unit7 = qs.filter((q) => q.unit === 7).map((q) => q.id);
  const easySlips = qs.filter((q) => q.difficulty === 1 && q.unit !== 7).slice(0, 2).map((q) => q.id);
  const blanks = qs.filter((q) => q.module === 2).slice(-2).map((q) => q.id);
  const numericMiss = qs.filter((q) => q.answerType === 'numeric' && q.unit !== 7).slice(0, 1).map((q) => q.id);
  const wrong = new Set([...unit7, ...easySlips, ...numericMiss]);
  const blank = new Set(blanks);
  for (const q of qs) {
    if (blank.has(q.id)) continue;
    if (wrong.has(q.id)) {
      answers[q.id] = q.answerType === 'multiple-choice' ? (q.answer === 'A' ? 'B' : 'A') : '999';
    } else {
      answers[q.id] = q.answer;
    }
  }
  const correct = qs.length - wrong.size - blank.size;

  const mkStored = (theme: 'light' | 'dark') => ({
    state: {
      satTests: {
        1: {
          correct,
          total: 44,
          scaled: 640,
          seconds: 3480,
          completedAt: new Date().toISOString(),
          answers,
        },
      },
      satBestScaled: 640,
      theme,
    },
    version: 25,
  });

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const theme of ['light', 'dark'] as const) {
    const ctx = await browser.newContext({
      viewport: { width: 480, height: 1000 },
      deviceScaleFactor: 2,
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    await page.goto(BASE);
    await page.evaluate((s) => localStorage.setItem('99daysofmath:progress', JSON.stringify(s)), mkStored(theme));

    await page.goto(`${BASE}/sat/analysis/1`);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `/tmp/analysis-top-${theme}.png` });
    await page.screenshot({ path: `/tmp/analysis-full-${theme}.png`, fullPage: true });

    await page.goto(`${BASE}/sat/recovery/1`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `/tmp/recovery-${theme}.png`, fullPage: true });

    await page.goto(`${BASE}/sat`);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/tmp/hub-${theme}.png`, fullPage: true });
    await ctx.close();
  }
  await browser.close();
  console.log('shots written to /tmp');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
