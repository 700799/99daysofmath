import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LESSONS, lessonAnswerMatches, getLesson } from '../src/data/lessons';

const VIDEOS_DIR = path.resolve(__dirname, '..', 'public', 'videos', 'lessons');

describe('lessons content', () => {
  it('every lesson has a full teach-first deck', () => {
    for (const l of LESSONS) {
      expect(l.concept.length, `${l.domain}-${l.unit} concept`).toBeGreaterThanOrEqual(3);
      expect(l.examples.length, `${l.domain}-${l.unit} examples`).toBeGreaterThanOrEqual(3);
      expect(l.practice.length, `${l.domain}-${l.unit} practice`).toBeGreaterThanOrEqual(2);
      expect(l.watchOut.length, `${l.domain}-${l.unit} watchOut`).toBeGreaterThan(0);
      for (const ex of l.examples) {
        expect(ex.steps.length, `${l.domain}-${l.unit} example steps`).toBeGreaterThanOrEqual(1);
        expect(ex.answer.length).toBeGreaterThan(0);
      }
    }
  });

  it('Algebra 1 lessons meet the deepened mastery bar', () => {
    // The A1 course promises full coverage: a pro-move concept line, six or
    // more worked examples, and four or more try-it questions per unit.
    const a1 = LESSONS.filter((l) => l.domain === 'A1');
    expect(a1).toHaveLength(14);
    for (const l of a1) {
      expect(l.concept.length, `A1-${l.unit} concept`).toBeGreaterThanOrEqual(5);
      expect(l.examples.length, `A1-${l.unit} examples`).toBeGreaterThanOrEqual(6);
      expect(l.practice.length, `A1-${l.unit} practice`).toBeGreaterThanOrEqual(4);
    }
  });

  it('lesson keys are unique', () => {
    const keys = new Set(LESSONS.map((l) => `${l.domain}-${l.unit}`));
    expect(keys.size).toBe(LESSONS.length);
  });

  it('practice canonical answers accept themselves', () => {
    for (const l of LESSONS) {
      for (const p of l.practice) {
        expect(
          lessonAnswerMatches(p.answers[0], p.answers),
          `${l.domain}-${l.unit}: "${p.q}" answer "${p.answers[0]}"`,
        ).toBe(true);
      }
    }
  });

  it('every referenced video file exists on disk', () => {
    for (const l of LESSONS) {
      for (const v of l.videos ?? []) {
        expect(v.title.length, `${l.domain}-${l.unit} video title`).toBeGreaterThan(0);
        const p = path.join(VIDEOS_DIR, v.src);
        expect(fs.existsSync(p), `missing video file ${v.src} (${l.domain}-${l.unit})`).toBe(true);
      }
    }
  });

  it('units 1-6 of the original domains keep their idea video', () => {
    for (const d of ['6.RP', '6.NS', '6.EE', '6.G', '6.SP'] as const) {
      for (let u = 1; u <= 6; u++) {
        const l = getLesson(d, u);
        expect(l, `${d}-${u} lesson`).not.toBeNull();
        expect((l!.videos ?? []).length, `${d}-${u} videos`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('every 6.x unit 1-10 has a teach-first lesson', () => {
    for (const d of ['6.RP', '6.NS', '6.EE', '6.G', '6.SP'] as const) {
      for (let u = 1; u <= 10; u++) {
        const l = getLesson(d, u);
        expect(l, `${d}-${u} lesson missing`).not.toBeNull();
      }
    }
  });

  it('core units 1-10 carry real video content (a combined lesson video, or idea+examples+trap)', () => {
    // Lessons are being consolidated from separate idea/examples/trap clips into
    // a single combined `<key>-lesson.mp4`. A core unit passes if it has that one
    // combined video OR the older 2+ separate segment videos — either way it has
    // real animated content. Supplementary lessons (unit 11+) may ship text-first,
    // and the Algebra 1 + Precalculus courses ship text-first (videos are a planned follow-up).
    const missing: string[] = [];
    for (const l of LESSONS) {
      if (l.unit > 10 || l.domain === 'A1' || l.domain === 'PC') continue;
      const vids = l.videos ?? [];
      const hasCombined = vids.some((v) => v.src.endsWith('-lesson.mp4'));
      if (!hasCombined && vids.length < 2) {
        missing.push(`${l.domain}-${l.unit}: ${vids.length} video(s)`);
      }
    }
    expect(missing).toEqual([]);
  });
});
