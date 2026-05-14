import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import fg from 'fast-glob';

interface RawProblem {
  id: string;
  domain: string;
  answerType: string;
  primaryAnswer: string;
  choices?: { id: string; label: string; correct: boolean }[];
}

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
