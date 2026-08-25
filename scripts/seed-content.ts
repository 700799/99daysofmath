/**
 * Materializes problem JSON files from compact in-source seed data.
 *
 * Run: `npm run seed:content`
 *
 * Behavior:
 *   - Each seed object describes one problem.
 *   - Writes `content/problems/<domain>/<NNN>-<slug>.json` (3-digit zero-padded).
 *   - If the target file already exists, SKIP (never overwrite hand-authored files).
 *   - Validates each problem against the schema before writing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import { problems6RP } from './seeds/6.RP.js';
import { problems6NS } from './seeds/6.NS.js';
import { problems6EE } from './seeds/6.EE.js';
import { problems6G } from './seeds/6.G.js';
import { problems6SP } from './seeds/6.SP.js';
import { problems5F } from './seeds/5.F.js';
import { problemsA1u01 } from './seeds/A1_u01_04.js';
import { problemsA1u05 } from './seeds/A1_u05_08.js';
import { problemsA1u09 } from './seeds/A1_u09_11.js';
import { problemsA1u12 } from './seeds/A1_u12_14.js';
import { problemsPCu01 } from './seeds/PC_u01_04.js';
import { problemsPCu05 } from './seeds/PC_u05_08.js';
import { problemsPCu09 } from './seeds/PC_u09_11.js';
import { problemsPCu12 } from './seeds/PC_u12_14.js';
import type { SeedProblem } from './seeds/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function padId(n: number): string {
  return String(n).padStart(3, '0');
}

function materialize(p: SeedProblem) {
  const out: Record<string, unknown> = {
    id: `${p.domain}.${padId(p.num)}`,
    domain: p.domain,
    unit: p.unit,
    orderInUnit: p.order,
    standard: p.standard,
    difficulty: p.difficulty,
    prompt: p.prompt,
  };
  if (p.diagram) out.diagram = p.diagram;
  out.answerType = p.answerType;
  if (p.choices) out.choices = p.choices;
  out.primaryAnswer = p.primaryAnswer;
  out.alternativeAnswers = p.alternativeAnswers ?? [];
  out.acceptanceMode = p.acceptanceMode;
  if (p.numericTolerance != null) out.numericTolerance = p.numericTolerance;
  out.hint = p.hints[0].text; // legacy mirror of tier 1
  out.hints = p.hints;
  if (p.learningObjective) out.learningObjective = p.learningObjective;
  if (p.topic) out.topic = p.topic;
  out.explanation = p.explanation;
  if (p.alternativeExplanations) out.alternativeExplanations = p.alternativeExplanations;
  out.tags = p.tags;
  out.estimatedSeconds = p.estimatedSeconds;
  return out;
}

async function main() {
  const schemaPath = path.join(ROOT, 'content', 'problems.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const all: SeedProblem[] = [
    ...problems6RP,
    ...problems6NS,
    ...problems6EE,
    ...problems6G,
    ...problems6SP,
    ...problems5F,
    ...problemsA1u01,
    ...problemsA1u05,
    ...problemsA1u09,
    ...problemsA1u12,
    ...problemsPCu01,
    ...problemsPCu05,
    ...problemsPCu09,
    ...problemsPCu12,
  ];

  let created = 0;
  let skipped = 0;
  let errors = 0;
  const seenIds = new Set<string>();
  const fsIds = new Set<string>();

  // First, read existing files and collect their IDs to detect collisions.
  const existing = fs
    .readdirSync(path.join(ROOT, 'content', 'problems'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      fs
        .readdirSync(path.join(ROOT, 'content', 'problems', d.name))
        .map((f) => path.join(ROOT, 'content', 'problems', d.name, f)),
    );
  for (const f of existing) {
    if (!f.endsWith('.json')) continue;
    try {
      const json = JSON.parse(fs.readFileSync(f, 'utf-8'));
      if (json.id) fsIds.add(json.id);
    } catch {
      // ignore — validator will catch it
    }
  }

  for (const seed of all) {
    const id = `${seed.domain}.${padId(seed.num)}`;
    if (seenIds.has(id)) {
      console.error(`✗ Duplicate seed id ${id}`);
      errors++;
      continue;
    }
    seenIds.add(id);

    if (fsIds.has(id)) {
      // ID already exists on disk — skip (don't overwrite hand-authored file).
      skipped++;
      continue;
    }

    const data = materialize(seed);
    if (!validate(data)) {
      console.error(`✗ ${id} failed schema:`);
      for (const e of validate.errors ?? []) {
        console.error(`    ${e.instancePath || '/'} ${e.message}`);
      }
      errors++;
      continue;
    }

    const outPath = path.join(
      ROOT,
      'content',
      'problems',
      seed.domain,
      `${padId(seed.num)}-${seed.slug}.json`,
    );
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    created++;
  }

  if (errors > 0) {
    console.error(`\n✗ ${errors} seed problem(s) failed.`);
    process.exit(1);
  }
  console.log(
    `✓ Seeded ${created} new problem(s); skipped ${skipped} existing file(s).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
