import { DOMAINS, DOMAIN_LABELS, type Domain, type Problem } from '../types/problem';
import type { ProblemStat } from '../state/progress';

// CCSS 6th-grade cluster headings, paraphrased kid-friendly. The ~10 clusters
// are granular enough to guide study without the noise of per-standard splits.
export const CLUSTER_LABELS: Record<string, string> = {
  '5.NBT.A': 'Place value (Gr 5)',
  '5.NBT.B': 'Whole-number & decimal operations (Gr 5)',
  '5.NF.A': 'Add & subtract fractions (Gr 5)',
  '5.NF.B': 'Multiply & divide fractions (Gr 5)',
  '5.MD.A': 'Measurement conversions (Gr 5)',
  '5.MD.B': 'Line plots & data (Gr 5)',
  '5.MD.C': 'Volume (Gr 5)',
  '5.G.A': 'Coordinate plane (Gr 5)',
  '5.OA.A': 'Expressions & grouping (Gr 5)',
  '5.OA.B': 'Patterns & relationships (Gr 5)',
  '6.RP.A': 'Ratios & unit rates',
  '6.NS.A': 'Dividing fractions',
  '6.NS.B': 'Decimal & multi-digit computation',
  '6.NS.C': 'Integers & the coordinate plane',
  '6.EE.A': 'Writing & evaluating expressions',
  '6.EE.B': 'One-variable equations & inequalities',
  '6.EE.C': 'Dependent & independent variables',
  '6.G.A': 'Area, surface area & volume',
  '6.SP.A': 'Understanding data & variability',
  '6.SP.B': 'Summarizing data sets',
};

export type MasteryLevel = 'strong' | 'on-track' | 'needs-work' | 'unassessed';

export interface SkillStat {
  key: string; // cluster key (e.g. "6.RP.A") or domain key (e.g. "6.RP")
  label: string;
  domain: Domain;
  attempts: number;
  correct: number;
  accuracy: number; // 0..1 (0 when unassessed)
  level: MasteryLevel;
}

const MIN_ATTEMPTS = 3;

// A standard like "6.RP.A.3.c" → cluster "6.RP.A" (domain + cluster letter).
export function clusterOf(standard: string): string {
  const parts = standard.split('.');
  if (parts.length >= 3) return `${parts[0]}.${parts[1]}.${parts[2]}`;
  return standard;
}

function levelFor(attempts: number, accuracy: number): MasteryLevel {
  if (attempts < MIN_ATTEMPTS) return 'unassessed';
  if (accuracy >= 0.8) return 'strong';
  if (accuracy >= 0.6) return 'on-track';
  return 'needs-work';
}

interface Tally {
  attempts: number;
  correct: number;
}

function emptyTally(): Tally {
  return { attempts: 0, correct: 0 };
}

export interface Breakdown {
  byCluster: SkillStat[];
  byDomain: SkillStat[];
}

// Aggregate per-problem stats up to cluster + domain level.
export function skillBreakdown(
  problemStats: Record<string, ProblemStat>,
  allProblems: Problem[],
): Breakdown {
  const clusters = new Map<string, Tally>();
  const domains = new Map<Domain, Tally>();

  for (const p of allProblems) {
    const st = problemStats[p.id];
    if (!st || st.attempts === 0) continue;
    const ck = clusterOf(p.standard);
    const ct = clusters.get(ck) ?? emptyTally();
    ct.attempts += st.attempts;
    ct.correct += st.correct;
    clusters.set(ck, ct);

    const dt = domains.get(p.domain) ?? emptyTally();
    dt.attempts += st.attempts;
    dt.correct += st.correct;
    domains.set(p.domain, dt);
  }

  // Build a stable cluster list from the known label set, ordered by domain.
  const byCluster: SkillStat[] = Object.keys(CLUSTER_LABELS)
    .sort(
      (a, b) =>
        DOMAINS.indexOf(domainOfCluster(a)) - DOMAINS.indexOf(domainOfCluster(b)) ||
        a.localeCompare(b),
    )
    .map((key) => {
      const t = clusters.get(key) ?? emptyTally();
      const accuracy = t.attempts > 0 ? t.correct / t.attempts : 0;
      return {
        key,
        label: CLUSTER_LABELS[key],
        domain: domainOfCluster(key),
        attempts: t.attempts,
        correct: t.correct,
        accuracy,
        level: levelFor(t.attempts, accuracy),
      };
    });

  const byDomain: SkillStat[] = DOMAINS.map((d) => {
    const t = domains.get(d) ?? emptyTally();
    const accuracy = t.attempts > 0 ? t.correct / t.attempts : 0;
    return {
      key: d,
      label: DOMAIN_LABELS[d],
      domain: d,
      attempts: t.attempts,
      correct: t.correct,
      accuracy,
      level: levelFor(t.attempts, accuracy),
    };
  });

  return { byCluster, byDomain };
}

function domainOfCluster(cluster: string): Domain {
  // All grade-5 standards live in the single 5.F Foundations domain.
  if (cluster.startsWith('5.')) return '5.F';
  const parts = cluster.split('.');
  return `${parts[0]}.${parts[1]}` as Domain;
}

// The assessed cluster with the lowest accuracy — what to study next.
export function recommendedFocus(byCluster: SkillStat[]): SkillStat | null {
  const assessed = byCluster.filter((c) => c.level !== 'unassessed');
  if (assessed.length === 0) return null;
  return assessed.reduce((lowest, c) => (c.accuracy < lowest.accuracy ? c : lowest));
}
