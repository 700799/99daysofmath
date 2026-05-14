import { query, registerProblemsParquet } from './duckdb';
import type {
  Domain,
  DomainSummary,
  Problem,
  Diagram,
  Choice,
} from '../types/problem';

interface ProblemRow {
  id: string;
  domain: Domain;
  unit: number;
  orderInUnit: number;
  standard: string;
  difficulty: number;
  prompt: string;
  diagram_json: string | null;
  answerType: Problem['answerType'];
  choices_json: string | null;
  primaryAnswer: string;
  alternativeAnswers_json: string;
  acceptanceMode: Problem['acceptanceMode'];
  numericTolerance: number | null;
  hint: string;
  explanation_json: string;
  tags_json: string;
  estimatedSeconds: number;
}

function rowToProblem(r: ProblemRow): Problem {
  return {
    id: r.id,
    domain: r.domain,
    unit: Number(r.unit),
    orderInUnit: Number(r.orderInUnit),
    standard: r.standard,
    difficulty: Number(r.difficulty) as 1 | 2 | 3,
    prompt: r.prompt,
    diagram: r.diagram_json
      ? (JSON.parse(r.diagram_json) as Diagram)
      : undefined,
    answerType: r.answerType,
    choices: r.choices_json
      ? (JSON.parse(r.choices_json) as Choice[])
      : undefined,
    primaryAnswer: r.primaryAnswer,
    alternativeAnswers: JSON.parse(r.alternativeAnswers_json) as string[],
    acceptanceMode: r.acceptanceMode,
    numericTolerance:
      r.numericTolerance == null ? undefined : Number(r.numericTolerance),
    hint: r.hint,
    explanation: JSON.parse(r.explanation_json) as string[],
    tags: JSON.parse(r.tags_json) as string[],
    estimatedSeconds: Number(r.estimatedSeconds),
  };
}

export async function getDomainSummary(): Promise<DomainSummary[]> {
  const file = await registerProblemsParquet();
  const rows = await query<{
    domain: Domain;
    count: bigint | number;
    units: bigint | number;
  }>(`
    SELECT domain,
           COUNT(*) AS count,
           COUNT(DISTINCT unit) AS units
    FROM read_parquet('${file}')
    GROUP BY domain
    ORDER BY domain;
  `);
  return rows.map((r) => ({
    domain: r.domain,
    count: Number(r.count),
    units: Number(r.units),
  }));
}

export async function getUnitProblems(
  domain: Domain,
  unit: number,
): Promise<Problem[]> {
  const file = await registerProblemsParquet();
  const rows = await query<ProblemRow>(`
    SELECT * FROM read_parquet('${file}')
    WHERE domain = '${domain}' AND unit = ${unit}
    ORDER BY orderInUnit;
  `);
  return rows.map(rowToProblem);
}

export async function getUnitsForDomain(domain: Domain): Promise<number[]> {
  const file = await registerProblemsParquet();
  const rows = await query<{ unit: bigint | number }>(`
    SELECT DISTINCT unit FROM read_parquet('${file}')
    WHERE domain = '${domain}'
    ORDER BY unit;
  `);
  return rows.map((r) => Number(r.unit));
}

export async function getProblem(id: string): Promise<Problem | null> {
  const file = await registerProblemsParquet();
  const rows = await query<ProblemRow>(`
    SELECT * FROM read_parquet('${file}')
    WHERE id = '${id}' LIMIT 1;
  `);
  if (rows.length === 0) return null;
  return rowToProblem(rows[0]);
}
