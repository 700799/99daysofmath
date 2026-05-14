import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import * as arrow from 'apache-arrow';
import {
  writeParquet,
  Compression,
  WriterPropertiesBuilder,
  Table as PWTable,
} from 'parquet-wasm/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

interface ProblemRecord {
  id: string;
  domain: string;
  unit: number;
  orderInUnit: number;
  standard: string;
  difficulty: number;
  prompt: string;
  diagram_json: string | null;
  answerType: string;
  choices_json: string | null;
  primaryAnswer: string;
  alternativeAnswers_json: string;
  acceptanceMode: string;
  numericTolerance: number | null;
  hint: string;
  explanation_json: string;
  tags_json: string;
  estimatedSeconds: number;
}

function flatten(p: any): ProblemRecord {
  return {
    id: p.id,
    domain: p.domain,
    unit: p.unit,
    orderInUnit: p.orderInUnit,
    standard: p.standard,
    difficulty: p.difficulty,
    prompt: p.prompt,
    diagram_json: p.diagram ? JSON.stringify(p.diagram) : null,
    answerType: p.answerType,
    choices_json: p.choices ? JSON.stringify(p.choices) : null,
    primaryAnswer: p.primaryAnswer,
    alternativeAnswers_json: JSON.stringify(p.alternativeAnswers ?? []),
    acceptanceMode: p.acceptanceMode,
    numericTolerance: p.numericTolerance ?? null,
    hint: p.hint,
    explanation_json: JSON.stringify(p.explanation ?? []),
    tags_json: JSON.stringify(p.tags ?? []),
    estimatedSeconds: p.estimatedSeconds,
  };
}

async function main() {
  const files = await fg('content/problems/**/*.json', { cwd: ROOT, absolute: true });
  if (files.length === 0) {
    console.error('No problem files found under content/problems/');
    process.exit(1);
  }

  const records: ProblemRecord[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(raw);
    records.push(flatten(data));
  }

  records.sort((a, b) => {
    if (a.domain !== b.domain) return a.domain < b.domain ? -1 : 1;
    if (a.unit !== b.unit) return a.unit - b.unit;
    return a.orderInUnit - b.orderInUnit;
  });

  const utf8 = (vals: (string | null)[]) => arrow.vectorFromArray(vals, new arrow.Utf8());
  const i32 = (vals: number[]) => arrow.vectorFromArray(new Int32Array(vals));
  const f64 = (vals: (number | null)[]) => {
    // apache-arrow handles nulls in Float64 when passed via vectorFromArray + Float64
    return arrow.vectorFromArray(vals, new arrow.Float64());
  };

  const table = new arrow.Table({
    id: utf8(records.map((r) => r.id)),
    domain: utf8(records.map((r) => r.domain)),
    unit: i32(records.map((r) => r.unit)),
    orderInUnit: i32(records.map((r) => r.orderInUnit)),
    standard: utf8(records.map((r) => r.standard)),
    difficulty: i32(records.map((r) => r.difficulty)),
    prompt: utf8(records.map((r) => r.prompt)),
    diagram_json: utf8(records.map((r) => r.diagram_json)),
    answerType: utf8(records.map((r) => r.answerType)),
    choices_json: utf8(records.map((r) => r.choices_json)),
    primaryAnswer: utf8(records.map((r) => r.primaryAnswer)),
    alternativeAnswers_json: utf8(records.map((r) => r.alternativeAnswers_json)),
    acceptanceMode: utf8(records.map((r) => r.acceptanceMode)),
    numericTolerance: f64(records.map((r) => r.numericTolerance)),
    hint: utf8(records.map((r) => r.hint)),
    explanation_json: utf8(records.map((r) => r.explanation_json)),
    tags_json: utf8(records.map((r) => r.tags_json)),
    estimatedSeconds: i32(records.map((r) => r.estimatedSeconds)),
  });

  const ipcBytes = arrow.tableToIPC(table, 'stream');
  const pwTable = PWTable.fromIPCStream(ipcBytes);
  const writerProps = new WriterPropertiesBuilder()
    .setCompression(Compression.SNAPPY)
    .build();
  const parquetBytes = writeParquet(pwTable, writerProps);

  const outDir = path.join(ROOT, 'public', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'problems.parquet');
  fs.writeFileSync(outPath, parquetBytes);

  const byDomain: Record<string, number> = {};
  for (const r of records) byDomain[r.domain] = (byDomain[r.domain] ?? 0) + 1;
  const meta = {
    count: records.length,
    byDomain,
    builtAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(outDir, 'problems.meta.json'),
    JSON.stringify(meta, null, 2),
  );

  console.log(
    `✓ Wrote ${records.length} problems to ${path.relative(ROOT, outPath)} (${(parquetBytes.length / 1024).toFixed(1)} KB)`,
  );
  console.log(`  By domain:`, byDomain);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
