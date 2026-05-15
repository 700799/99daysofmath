import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function main() {
  const files = await fg('content/problems/**/*.json', { cwd: ROOT, absolute: true });
  if (files.length === 0) {
    console.error('No problem files found under content/problems/');
    process.exit(1);
  }

  const problems: unknown[] = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8')) as unknown;
    problems.push(data);
  }

  problems.sort((a, b) => {
    const pa = a as { domain: string; unit: number; orderInUnit: number };
    const pb = b as { domain: string; unit: number; orderInUnit: number };
    if (pa.domain !== pb.domain) return pa.domain < pb.domain ? -1 : 1;
    if (pa.unit !== pb.unit) return pa.unit - pb.unit;
    return pa.orderInUnit - pb.orderInUnit;
  });

  const byDomain: Record<string, number> = {};
  for (const p of problems) {
    const { domain } = p as { domain: string };
    byDomain[domain] = (byDomain[domain] ?? 0) + 1;
  }

  const outDir = path.join(ROOT, 'public', 'data');
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'problems.json');
  fs.writeFileSync(outPath, JSON.stringify(problems));

  const metaPath = path.join(outDir, 'problems.meta.json');
  fs.writeFileSync(
    metaPath,
    JSON.stringify({ count: problems.length, byDomain, builtAt: new Date().toISOString() }, null, 2),
  );

  const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`✓ Wrote ${problems.length} problems to ${path.relative(ROOT, outPath)} (${kb} KB)`);
  console.log(`  By domain:`, byDomain);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
