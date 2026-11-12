import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import type { Problem, HintStep } from '../src/types/problem';
import { LESSONS } from '../src/data/lessons';

// Help should come in layers. A hint ladder that reads "$7 \times 7$." then
// "$49$." gives a stuck student nothing to think with: the first tap shows the
// sum and the second shows the answer. These bars make every rung a real
// sentence, so a nudge points at the idea, a guide sets up the work, and only
// the reveal finishes it. The same goes for the worked solution and for the
// "Try it" questions inside lessons, whose steps are uncovered one at a time.

const problems: Problem[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../public/data/problems.json'), 'utf8'),
);

/** Words of prose: anything inside $...$ is mathematics, not explanation. */
const words = (s: string) =>
  s.replace(/\$[^$]*\$/g, ' ').split(/\s+/).filter((x) => /[A-Za-z]{2,}/.test(x)).length;

const ORDER = { nudge: 1, guide: 2, reveal: 3 } as const;
const MIN_WORDS = { nudge: 8, guide: 8, reveal: 5 } as const;

function ladderFaults(hints: HintStep[]): string[] {
  const bad: string[] = [];
  let prev = 0;
  for (const h of hints) {
    if (ORDER[h.level] < prev) bad.push('tiers out of order');
    prev = ORDER[h.level];
    if (words(h.text) < MIN_WORDS[h.level]) bad.push(`${h.level} is too thin`);
  }
  const levels = hints.map((h) => h.level);
  if (!levels.includes('nudge') || !levels.includes('guide')) bad.push('needs a nudge and a guide');
  if (levels.filter((l) => l === 'reveal').length !== 1 || levels[levels.length - 1] !== 'reveal') {
    bad.push('needs exactly one reveal, last');
  }
  if (new Set(hints.map((h) => h.text.trim())).size !== hints.length) bad.push('two tiers say the same thing');
  return bad;
}

describe('layered help', () => {
  it('every practice problem has a nudge, a guide and a reveal, each a real sentence', () => {
    const bad: string[] = [];
    for (const p of problems) {
      const faults = ladderFaults(p.hints ?? []);
      if (faults.length) bad.push(`${p.id}: ${faults.join('; ')}`);
    }
    expect(bad).toEqual([]);
  });

  it('the one-line hint is the first rung of the ladder', () => {
    const bad = problems.filter((p) => !(p.hints ?? []).some((h) => h.level === 'nudge' && h.text === p.hint)).map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('every practice problem has a worked solution of 3+ explained steps', () => {
    const bad: string[] = [];
    for (const p of problems) {
      if (p.explanation.length < 3) bad.push(`${p.id}: ${p.explanation.length} step(s)`);
      else if (p.explanation.some((s) => words(s) < 6)) bad.push(`${p.id}: a step is too thin`);
    }
    expect(bad).toEqual([]);
  });

  it('every lesson "Try it" question has 3+ explained steps to uncover as hints', () => {
    const bad: string[] = [];
    for (const l of LESSONS) {
      l.practice.forEach((q, i) => {
        if (q.steps.length < 3) bad.push(`${l.domain}-${l.unit}#${i}: ${q.steps.length} step(s)`);
        else if (q.steps.some((s) => words(s) < 6)) bad.push(`${l.domain}-${l.unit}#${i}: a step is too thin`);
      });
    }
    expect(bad).toEqual([]);
  });

  it('no help text has unbalanced math delimiters', () => {
    const bad: string[] = [];
    for (const p of problems) {
      for (const s of [...(p.hints ?? []).map((h) => h.text), ...p.explanation]) {
        if ((s.match(/(?<!\\)\$/g) ?? []).length % 2) bad.push(`${p.id}: ${s}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
