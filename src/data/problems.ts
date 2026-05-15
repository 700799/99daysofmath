import type { Domain, DomainSummary, Problem } from '../types/problem';

let cachedProblems: Problem[] | null = null;

async function loadProblems(): Promise<Problem[]> {
  if (cachedProblems) return cachedProblems;
  const url = `${import.meta.env.BASE_URL}data/problems.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load problems: ${res.status} ${res.statusText}`);
  cachedProblems = (await res.json()) as Problem[];
  return cachedProblems;
}

export async function getDomainSummary(): Promise<DomainSummary[]> {
  const problems = await loadProblems();
  const map = new Map<Domain, { count: number; units: Set<number> }>();
  for (const p of problems) {
    const entry = map.get(p.domain) ?? { count: 0, units: new Set() };
    entry.count++;
    entry.units.add(p.unit);
    map.set(p.domain, entry);
  }
  return Array.from(map.entries()).map(([domain, { count, units }]) => ({
    domain,
    count,
    units: units.size,
  }));
}

export async function getUnitProblems(domain: Domain, unit: number): Promise<Problem[]> {
  const problems = await loadProblems();
  return problems
    .filter((p) => p.domain === domain && p.unit === unit)
    .sort((a, b) => a.orderInUnit - b.orderInUnit);
}

export async function getUnitsForDomain(domain: Domain): Promise<number[]> {
  const problems = await loadProblems();
  const units = new Set<number>();
  for (const p of problems) {
    if (p.domain === domain) units.add(p.unit);
  }
  return Array.from(units).sort((a, b) => a - b);
}

export async function getProblem(id: string): Promise<Problem | null> {
  const problems = await loadProblems();
  return problems.find((p) => p.id === id) ?? null;
}
