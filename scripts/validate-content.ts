import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import fg from 'fast-glob';

interface RawProblem {
  id: string;
  domain: string;
  unit: number;
  answerType: string;
  primaryAnswer: string;
  hint?: string;
  hints?: { level: 'nudge' | 'guide' | 'reveal'; text: string }[];
  choices?: { id: string; label: string; correct: boolean }[];
}

const LEVEL_ORDER = { nudge: 1, guide: 2, reveal: 3 } as const;
const STRICT = process.argv.includes('--strict');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function main() {
  const schemaPath = path.join(ROOT, 'content', 'problems.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const files = await fg('content/problems/**/*.json', { cwd: ROOT, absolute: true });
  let errors = 0;
  const ids = new Set<string>();

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    let data: RawProblem;
    try {
      data = JSON.parse(raw) as RawProblem;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`✗ ${path.relative(ROOT, file)}: invalid JSON — ${msg}`);
      errors++;
      continue;
    }
    if (!validate(data)) {
      console.error(`✗ ${path.relative(ROOT, file)}:`);
      for (const err of validate.errors ?? []) {
        console.error(`    ${err.instancePath || '/'} ${err.message}`);
      }
      errors++;
      continue;
    }
    if (ids.has(data.id)) {
      console.error(`✗ ${path.relative(ROOT, file)}: duplicate id ${data.id}`);
      errors++;
      continue;
    }
    ids.add(data.id);

    // MC sanity: at least one correct choice, primaryAnswer matches a choice id
    if (data.answerType === 'multiple-choice') {
      if (!Array.isArray(data.choices) || data.choices.length < 2) {
        console.error(`✗ ${data.id}: multiple-choice needs ≥2 choices`);
        errors++;
        continue;
      }
      const correctOnes = data.choices.filter((c) => c.correct);
      if (correctOnes.length !== 1) {
        console.error(`✗ ${data.id}: must have exactly 1 correct choice`);
        errors++;
        continue;
      }
      if (correctOnes[0].id !== data.primaryAnswer) {
        console.error(
          `✗ ${data.id}: primaryAnswer "${data.primaryAnswer}" must equal correct choice id "${correctOnes[0].id}"`,
        );
        errors++;
        continue;
      }
    }

    // Multi-level hint sanity: strictly ascending tiers
    if (Array.isArray(data.hints) && data.hints.length > 0) {
      let lastOrder = 0;
      for (const h of data.hints) {
        const order = LEVEL_ORDER[h.level];
        // Non-descending: repeated levels are allowed (hint series), going
        // backwards is not.
        if (order < lastOrder) {
          console.error(
            `✗ ${data.id}: hints must be non-descending (nudge → guide → reveal); got ${h.level} after order ${lastOrder}`,
          );
          errors++;
          break;
        }
        lastOrder = order;
      }
    }
  }

  // Domain & unit counts
  const domainCounts = new Map<string, number>();
  const unitCounts = new Map<string, number>();
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8')) as RawProblem;
    domainCounts.set(data.domain, (domainCounts.get(data.domain) ?? 0) + 1);
    const key = `${data.domain}:${data.unit}`;
    unitCounts.set(key, (unitCounts.get(key) ?? 0) + 1);
  }
  const TARGET_BY_DOMAIN: Record<string, number> = {
    '6.RP': 100, '6.NS': 100, '6.EE': 100, '6.G': 100, '6.SP': 100, '5.F': 60,
  };
  const TARGET_PER_UNIT = 10;
  for (const [domain, count] of domainCounts) {
    const target = TARGET_BY_DOMAIN[domain] ?? 0;
    if (count !== target) {
      const msg = `${count}/${target} problems in ${domain}`;
      if (STRICT) {
        console.error(`✗ ${msg}`);
        errors++;
      } else {
        console.warn(`⚠ ${msg}`);
      }
    }
  }
  for (const [key, count] of unitCounts) {
    if (count !== TARGET_PER_UNIT) {
      const msg = `${count}/${TARGET_PER_UNIT} problems in unit ${key}`;
      if (STRICT) {
        console.error(`✗ ${msg}`);
        errors++;
      } else {
        console.warn(`⚠ ${msg}`);
      }
    }
  }

  if (errors > 0) {
    console.error(`\n✗ ${errors} problem(s) failed validation.`);
    process.exit(1);
  }
  console.log(`✓ OK, ${files.length} problems validated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
