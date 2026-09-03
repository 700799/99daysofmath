// Screenshot pass for the header back link across every route family.
// Run with: npx tsx scripts/shots-backnav.ts
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const WIDTH = Number(process.env.W ?? 390);

const ROUTES: [string, string][] = [
  ['/unit/SAT/1', 'drill-sat'],
  ['/sat/unit/1', 'sat-unit'],
  ['/unit/6.EE/3', 'drill-ee'],
  ['/unit/PC/3', 'drill-pc'],
  ['/arcade/snake', 'arcade-game'],
  ['/finals/1', 'final-quiz'],
  ['/sat/recovery/1', 'sat-recovery'],
  ['/report', 'report'],
];

async function main() {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: 300 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  for (const [route, name] of ROUTES) {
    await page.goto(BASE + route);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `/tmp/nav-${WIDTH}-${name}.png` });
  }
  await browser.close();
  console.log('shots written to /tmp');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
