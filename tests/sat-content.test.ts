import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Problem } from '../src/types/problem';
import { SAT_UNITS, SAT_AREAS, SAT_AREA_INFO, areaOfUnit } from '../src/data/sat/blueprint';
import { SAT_PLAYBOOKS, getPlaybook } from '../src/data/sat/playbooks';
import { SAT_TIPS, TIP_CATEGORIES, TIPS_BY_CATEGORY } from '../src/data/sat/tips';
import { scaledScore, scoreBand, breakdownByArea } from '../src/utils/satScore';

// The SAT section's quality bar. These lock in the promises the section makes
// on Home and on its hub: full blueprint coverage, a strategy route on every
// problem, a complete playbook per unit, and a scoring model that behaves.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROBLEMS: Problem[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'public', 'data', 'problems.json'), 'utf-8'),
);
const SAT = PROBLEMS.filter((p) => p.domain === 'SAT');

describe('SAT problem bank', () => {
  it('has 180 problems across 18 units, 10 per unit', () => {
    expect(SAT).toHaveLength(180);
    for (let u = 1; u <= 18; u++) {
      expect(SAT.filter((p) => p.unit === u), `unit ${u}`).toHaveLength(10);
    }
  });

  it('every problem is tagged to a real blueprint standard', () => {
    for (const p of SAT) {
      const area = areaOfUnit(p.unit);
      expect(area, `unit ${p.unit} has no area`).toBeTruthy();
      expect(p.standard, p.id).toBe(SAT_UNITS.find((u) => u.unit === p.unit)!.standard);
    }
  });

  it('covers all four content areas in the published proportions', () => {
    const counts = new Map<string, number>();
    for (const p of SAT) {
      const a = areaOfUnit(p.unit)!;
      counts.set(a, (counts.get(a) ?? 0) + 1);
    }
    // 5 units of Algebra and Advanced Math, 4 each of Data and Geometry.
    expect(counts.get('ALG')).toBe(50);
    expect(counts.get('ADV')).toBe(50);
    expect(counts.get('PSDA')).toBe(40);
    expect(counts.get('GEO')).toBe(40);
  });

  it('every problem carries a 3-tier hint ladder', () => {
    for (const p of SAT) {
      expect((p.hints ?? []).length, p.id).toBeGreaterThanOrEqual(3);
      const levels = new Set((p.hints ?? []).map((h) => h.level));
      for (const lvl of ['nudge', 'guide', 'reveal'] as const) {
        expect(levels.has(lvl), `${p.id} missing a ${lvl} hint`).toBe(true);
      }
    }
  });

  it('every hardest problem carries a named pitfall walkthrough', () => {
    // Difficulty-3 problems get a second alternate explanation that names the
    // engineered wrong answer and walks the escape.
    for (const p of SAT.filter((q) => q.difficulty === 3)) {
      const alts = p.alternativeExplanations ?? [];
      expect(alts.length, p.id).toBeGreaterThanOrEqual(2);
      expect(
        alts.some((a) => a.title.includes('trap')),
        `${p.id} has no trap-titled walkthrough`,
      ).toBe(true);
    }
  });

  it('every hardest problem adds the "Try a simpler one" scaffold', () => {
    for (const p of SAT.filter((q) => q.difficulty === 3)) {
      expect((p.hints ?? []).length, p.id).toBe(4);
      expect((p.hints ?? []).some((h) => !!h.title), `${p.id} has no titled hint`).toBe(true);
    }
  });

  it('every problem teaches a test-taking route as its alternate explanation', () => {
    for (const p of SAT) {
      expect((p.alternativeExplanations ?? []).length, `${p.id} has no alternate explanation`)
        .toBeGreaterThanOrEqual(1);
      for (const alt of p.alternativeExplanations ?? []) {
        expect(alt.title.length, p.id).toBeGreaterThan(0);
        expect(alt.steps.length, `${p.id}: "${alt.title}"`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('every problem has a stepped explanation and an objective', () => {
    for (const p of SAT) {
      expect(p.explanation.length, p.id).toBeGreaterThanOrEqual(2);
      expect(p.learningObjective, p.id).toBeTruthy();
      expect(p.topic, p.id).toBeTruthy();
    }
  });

  it('multiple-choice problems name a real choice as the answer', () => {
    for (const p of SAT.filter((q) => q.answerType === 'multiple-choice')) {
      const ids = (p.choices ?? []).map((c) => c.id);
      expect(ids.length, p.id).toBeGreaterThanOrEqual(3);
      expect(ids, p.id).toContain(p.primaryAnswer);
      expect((p.choices ?? []).filter((c) => c.correct).length, `${p.id} correct-flag count`).toBe(1);
      const flagged = (p.choices ?? []).find((c) => c.correct)!;
      expect(flagged.id, `${p.id} primaryAnswer disagrees with the flagged choice`).toBe(p.primaryAnswer);
    }
  });

  it('difficulty climbs within every unit', () => {
    for (let u = 1; u <= 18; u++) {
      const inUnit = SAT.filter((p) => p.unit === u).sort((a, b) => a.orderInUnit - b.orderInUnit);
      expect(inUnit[0].difficulty, `unit ${u} opens too hard`).toBeLessThanOrEqual(2);
      expect(inUnit[inUnit.length - 1].difficulty, `unit ${u} ends too easy`).toBe(3);
    }
  });
});

describe('SAT blueprint', () => {
  it('describes 18 units, each assigned to one area', () => {
    expect(SAT_UNITS).toHaveLength(18);
    const nums = SAT_UNITS.map((u) => u.unit);
    expect(new Set(nums).size).toBe(18);
    for (const u of SAT_UNITS) expect(SAT_AREAS).toContain(u.area);
  });

  it('area weights sum to 1 and per-test counts sum to 44', () => {
    const weight = SAT_AREAS.reduce((s, a) => s + SAT_AREA_INFO[a].weight, 0);
    expect(weight).toBeCloseTo(1, 5);
    const perTest = SAT_AREAS.reduce((s, a) => s + SAT_AREA_INFO[a].perTest, 0);
    expect(perTest).toBe(44);
  });

  it('each area lists exactly the units assigned to it', () => {
    for (const a of SAT_AREAS) {
      const declared = SAT_AREA_INFO[a].units;
      const actual = SAT_UNITS.filter((u) => u.area === a).map((u) => u.unit);
      expect(declared, a).toEqual(actual);
    }
  });
});

describe('SAT unit playbooks', () => {
  it('there is a complete playbook for every unit', () => {
    expect(SAT_PLAYBOOKS).toHaveLength(18);
    for (const u of SAT_UNITS) {
      const pb = getPlaybook(u.unit);
      expect(pb, `unit ${u.unit} has no playbook`).toBeTruthy();
      expect(pb!.area, `unit ${u.unit} area mismatch`).toBe(u.area);
      expect(pb!.title).toBe(u.title);
    }
  });

  it('every playbook carries methods, examples, facts, traps, Desmos and timing', () => {
    for (const pb of SAT_PLAYBOOKS) {
      const at = `unit ${pb.unit}`;
      expect(pb.overview.length, at).toBeGreaterThan(80);
      expect(pb.frequency.length, at).toBeGreaterThan(10);
      expect(pb.methods.length, at).toBeGreaterThanOrEqual(3);
      expect(pb.examples.length, at).toBeGreaterThanOrEqual(4);
      expect(pb.mustKnow.length, at).toBeGreaterThanOrEqual(4);
      expect(pb.traps.length, at).toBeGreaterThanOrEqual(5);
      expect(pb.mastery.length, at).toBeGreaterThanOrEqual(3);
      for (const m of pb.mastery) expect(m.length, at).toBeGreaterThan(40);
      expect(pb.desmos.length, at).toBeGreaterThan(60);
      expect(pb.timing.length, at).toBeGreaterThan(40);
      for (const m of pb.methods) {
        expect(m.name.length, at).toBeGreaterThan(0);
        expect(m.steps.length, `${at}: "${m.name}"`).toBeGreaterThanOrEqual(3);
      }
      for (const ex of pb.examples) {
        expect(ex.steps.length, `${at}: "${ex.q}"`).toBeGreaterThanOrEqual(2);
        expect(ex.answer.length, at).toBeGreaterThan(0);
      }
    }
  });
});

describe('SAT strategy tips', () => {
  it('has 100+ tips with unique ids', () => {
    expect(SAT_TIPS.length).toBeGreaterThanOrEqual(128);
    expect(new Set(SAT_TIPS.map((t) => t.id)).size).toBe(SAT_TIPS.length);
  });

  it('every category is populated and every tip belongs to a real one', () => {
    const keys = new Set(TIP_CATEGORIES.map((c) => c.key));
    for (const t of SAT_TIPS) {
      expect(keys.has(t.category), `${t.id} has an unknown category`).toBe(true);
      expect(t.title.length, t.id).toBeGreaterThan(0);
      expect(t.body.length, t.id).toBeGreaterThan(60);
    }
    for (const c of TIP_CATEGORIES) {
      expect(TIPS_BY_CATEGORY[c.key].length, `category ${c.key} is empty`).toBeGreaterThanOrEqual(4);
    }
  });

  it('every content area has tips tagged to it for its unit playbooks', () => {
    for (const a of SAT_AREAS) {
      expect(SAT_TIPS.filter((t) => t.area === a).length, a).toBeGreaterThanOrEqual(12);
    }
  });
});

describe('SAT scoring', () => {
  it('maps raw scores into the 200-800 band, monotonically', () => {
    expect(scaledScore(0, 44)).toBe(200);
    expect(scaledScore(44, 44)).toBe(800);
    let prev = -1;
    for (let c = 0; c <= 44; c++) {
      const s = scaledScore(c, 44);
      expect(s, `raw ${c}`).toBeGreaterThanOrEqual(prev);
      expect(s).toBeGreaterThanOrEqual(200);
      expect(s).toBeLessThanOrEqual(800);
      prev = s;
    }
  });

  it('scales a short test up to the 44-question basis', () => {
    // Half the questions right on a 22-question module reads like 22/44.
    expect(scaledScore(11, 22)).toBe(scaledScore(22, 44));
  });

  it('never divides by zero on an empty test', () => {
    expect(scaledScore(0, 0)).toBe(200);
  });

  it('gives every score a band', () => {
    for (let s = 200; s <= 800; s += 10) {
      expect(scoreBand(s).label.length).toBeGreaterThan(0);
      expect(scoreBand(s).blurb.length).toBeGreaterThan(40);
    }
  });

  it('breaks results down by area without losing questions', () => {
    const qs = [{ area: 'ALG' as const }, { area: 'ALG' as const }, { area: 'GEO' as const }];
    const rows = breakdownByArea(qs, (i) => i === 0);
    const total = rows.reduce((s, r) => s + r.total, 0);
    expect(total).toBe(3);
    expect(rows.find((r) => r.area === 'ALG')!.correct).toBe(1);
    expect(rows.find((r) => r.area === 'ALG')!.pct).toBeCloseTo(0.5, 5);
    expect(rows.find((r) => r.area === 'PSDA')!.total).toBe(0);
    expect(rows.find((r) => r.area === 'PSDA')!.pct).toBe(0);
  });
});
