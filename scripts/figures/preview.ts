/**
 * Renders a set of figures into one HTML page, light and dark side by side,
 * so a whole course's figures can be eyeballed at once.
 *
 * Run: `npx tsx scripts/figures/preview.ts <specs-module> <out.html>`
 * The specs module must export `default: Record<string, AngleFigure>`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { renderAngleFigure, type AngleFigure } from './angleFigures.js';

const [, , specPath, outPath] = process.argv;
if (!specPath || !outPath) {
  console.error('usage: preview.ts <specs-module> <out.html>');
  process.exit(1);
}

const mod = await import(path.resolve(specPath));
const specs = (mod.default ?? mod.SPECS) as Record<string, AngleFigure>;

const cards = Object.entries(specs)
  .map(([id, spec]) => {
    let r: { svg: string; alt: string };
    try {
      r = renderAngleFigure(spec);
    } catch (e) {
      return `<div class="card bad"><b>${id}</b><pre>${String(e)}</pre></div>`;
    }
    return `<div class="card"><b>${id}</b> <span class="k">${spec.kind}</span><div class="fig">${r.svg}</div><i>${r.alt}</i></div>`;
  })
  .join('\n');

const html = `<!doctype html><meta charset="utf-8"><title>figures</title>
<style>
body{margin:0;font-family:Nunito,system-ui,sans-serif;display:grid;grid-template-columns:1fr 1fr}
.pane{padding:16px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px;align-content:start}
.light{background:#fff;color:#15171b}.dark{background:#16181d;color:#e7e9ec}
.card{border:1px solid rgba(128,128,128,.35);border-radius:14px;padding:8px 10px;font-size:12px}
.card b{font-size:12px}.k{opacity:.6}.fig{width:100%;max-width:330px;margin:4px auto}.fig svg{width:100%;height:auto;display:block}
i{opacity:.65;font-size:11px}.bad{border-color:#f43f5e}pre{white-space:pre-wrap;font-size:10px}
</style>
<div class="pane light">${cards}</div><div class="pane dark">${cards}</div>`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${Object.keys(specs).length} figures)`);
