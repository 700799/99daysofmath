/**
 * Generate the 1200×630 social-preview image (public/og.png) by rendering a
 * branded HTML card with the pre-installed Chromium. LOCAL-ONLY build tool —
 * never runs on Cloudflare; the committed PNG is what ships.
 *
 *   node scripts/gen-og.mjs
 */
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og.png');
const CHROME =
  process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const HTML = `<!doctype html><html><head><meta charset="utf-8"/>
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    font-family: 'Nunito', system-ui, sans-serif;
    background: radial-gradient(1200px 630px at 20% 0%, #1e293b 0%, #0f172a 70%);
    color: #fff; padding: 56px 72px; display: flex; flex-direction: column;
    justify-content: space-between; position: relative; overflow: hidden;
  }
  .glow { position: absolute; border-radius: 50%; filter: blur(60px); opacity: .5; }
  .g1 { width: 420px; height: 420px; background: #58CC02; top: -140px; right: -80px; }
  .g2 { width: 360px; height: 360px; background: #1CB0F6; bottom: -160px; left: -60px; }
  .brand { display: flex; align-items: center; gap: 18px; z-index: 1; }
  .logo {
    font-size: 68px; font-weight: 900; letter-spacing: -2px;
    background: linear-gradient(90deg,#58CC02,#1CB0F6); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .badge { font-size: 27px; font-weight: 800; color: #cbd5e1; margin-top: 6px; }
  h1 { font-size: 50px; font-weight: 900; line-height: 1.08; z-index: 1; max-width: 1010px; }
  h1 .hl { color: #FFC94D; }
  .chips { display: flex; flex-wrap: wrap; gap: 12px; z-index: 1; }
  .chip {
    font-size: 24px; font-weight: 800; padding: 8px 18px; border-radius: 999px;
    background: rgba(255,255,255,.10); border: 2px solid rgba(255,255,255,.18);
  }
  .foot { font-size: 27px; font-weight: 800; color: #94a3b8; z-index: 1; }
</style></head>
<body>
  <div class="glow g1"></div><div class="glow g2"></div>
  <div>
    <div class="brand"><div class="logo">Math10x</div><div style="font-size:64px">🧮</div></div>
    <div class="badge">Free 5th &amp; 6th Grade Math</div>
  </div>
  <h1>Animated lessons, worked examples &amp; practice —<br/><span class="hl">plus an arcade kids unlock by learning.</span></h1>
  <div class="chips">
    <div class="chip">⚖️ Ratios</div>
    <div class="chip">🔢 Fractions</div>
    <div class="chip">📐 Geometry</div>
    <div class="chip">🧮 Expressions</div>
    <div class="chip">📊 Statistics</div>
  </div>
  <div class="foot">math10x.com</div>
</body></html>`;

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(HTML, { waitUntil: 'networkidle' });
await page.screenshot({ path: OUT });
await browser.close();
console.log('[gen-og] wrote', OUT);
