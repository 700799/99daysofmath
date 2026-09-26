/**
 * Draw the figure each problem describes, from its one-line spec, into
 * `content/problems/<domain>/*.json` as an inline SVG diagram.
 *
 * Run: `npm run figures:angles` (then `npm run build:content`).
 *
 * Specs live in scripts/figures/specs/<DOMAIN>.ts, keyed by problem id. A
 * problem with a spec gets its diagram (re)generated every run, so a change
 * to the library redraws everything; a problem without one is left alone —
 * including any hand-authored diagram it already carries.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderFigure, type Figure } from './figures/index.js';
import TRIG from './figures/specs/TRIG.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SPECS: Record<string, Record<string, Figure>> = { TRIG };

async function loadOptional(domain: string): Promise<Record<string, Figure> | null> {
  try {
    const mod = await import(`./figures/specs/${domain}.js`);
    return (mod.default ?? null) as Record<string, Figure> | null;
  } catch {
    return null;
  }
}

async function main() {
  for (const d of ['GEO', 'PC', 'SAT', '6.G', '5.F']) {
    const m = await loadOptional(d);
    if (m) SPECS[d] = m;
  }
  let written = 0;
  const missing: string[] = [];
  for (const [domain, specs] of Object.entries(SPECS)) {
    const dir = path.join(ROOT, 'content', 'problems', domain);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    const byNum = new Map(files.map((f) => [f.slice(0, 3), f]));
    for (const [id, spec] of Object.entries(specs)) {
      // ids run DOMAIN.NNN, and a domain can itself have a dot: 6.G.005
      const num = id.split('.').pop()!;
      const file = byNum.get(num);
      if (!file) {
        missing.push(id);
        continue;
      }
      const full = path.join(dir, file);
      const data = JSON.parse(fs.readFileSync(full, 'utf-8')) as Record<string, unknown>;
      const { svg, alt } = renderFigure(spec);
      data.diagram = { kind: 'inline-svg', svg, alt };
      fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf-8');
      written++;
    }
    console.log(`${domain}: ${Object.keys(specs).length} figures`);
  }
  console.log(`✓ wrote ${written} diagrams`);
  if (missing.length) {
    console.error(`✗ no problem file for: ${missing.join(', ')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
