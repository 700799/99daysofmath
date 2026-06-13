/**
 * Enrich problem hints in-place across content/problems/**\/*.json:
 *   1. Legacy problems with only `hint` (no `hints` array) get a 3-tier
 *      series synthesized from their existing hint + explanation steps.
 *   2. Every difficulty-3 problem gets a 4th titled hint prepended at
 *      the nudge level — either "🪜 Try a simpler one" or "🔁 Another
 *      angle" — chosen deterministically by id so re-runs are stable.
 *
 * Run: `npm run enrich:hints`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

interface Hint {
  level: 'nudge' | 'guide' | 'reveal';
  text: string;
  title?: string;
}

interface Problem {
  id: string;
  domain: string;
  difficulty: 1 | 2 | 3;
  hint: string;
  hints?: Hint[];
  explanation: string[];
}

// Two flavors of titled hint that work for almost any problem in the bank.
// Pool a few text variants per domain so the same kind doesn't repeat back-to-back.
const ALT_ANGLE_TEXT: Record<string, string[]> = {
  '6.RP': [
    'Try the same problem with friendlier numbers first — say "20% of 50" — then come back to this one.',
    'Picture a ratio table: write the rate in one row, then scale both columns by the same number.',
    'Sketch a tape diagram: equal blocks for each part. What does one block represent here?',
    'Convert percent ↔ fraction ↔ decimal. Sometimes the easiest form unlocks the answer.',
  ],
  '6.NS': [
    'Plot each number on a quick number line. Distances and order get obvious right away.',
    'Rewrite the numbers in matching form (all fractions OR all decimals) before you operate.',
    'Try a 10×-easier version: shrink each number by a factor of 10 and watch the structure.',
    'Use the "keep–change–flip" trick whenever you see division by a fraction.',
  ],
  '6.EE': [
    'Pick a small value for the variable and check the structure — does each side balance?',
    'Whatever operation is acting on the variable, do its OPPOSITE on both sides.',
    'Substitute a guess back into the equation. If both sides match, the guess is the answer.',
    'Translate piece-by-piece: "more than" = +, "product" = ×, "less than" flips the order.',
  ],
  '6.G': [
    'Sketch the shape and label every length. A 30-second drawing saves 5 minutes of thinking.',
    'Split or rearrange the shape into pieces whose formulas you already know.',
    'Try a similar but smaller shape (all sides ÷ 2) and look at how the formula behaves.',
    'Tag every length with its units. Area answers are square units; volume is cubic.',
  ],
  '6.SP': [
    'Sort the data from least to greatest first — many statistics get easy after that.',
    'Draw a tiny dot plot. The shape of the data tells you which statistic to use.',
    'Use a sample of 3–4 values to see how the rule works, then apply it to the real data.',
    'Mean is fair-shares; median is the middle. Pick the one the question actually asks for.',
  ],
  '5.F': [
    'Try smaller, friendlier numbers first. Solve the easy version, then plug the real ones in.',
    'Sketch a fraction bar, number line, or grid. Most 5th-grade problems shrink with one picture.',
    'Estimate the answer before computing. If your real answer is far off, recheck.',
    'When in doubt, fall back to a familiar formula: place value, area = l·w, volume = l·w·h.',
  ],
};

const ALT_ANGLE_TITLES = ['🪜 Try a simpler one', '🔁 Another angle'];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function altAngleFor(p: Problem): Hint {
  const pool = ALT_ANGLE_TEXT[p.domain] ?? ALT_ANGLE_TEXT['5.F'];
  const h = hashStr(p.id);
  return {
    level: 'nudge',
    title: ALT_ANGLE_TITLES[h % ALT_ANGLE_TITLES.length],
    text: pool[h % pool.length],
  };
}

function enrich(p: Problem): boolean {
  let changed = false;

  // 1. Legacy single-hint problems → full 3-tier series.
  if (!Array.isArray(p.hints) || p.hints.length === 0) {
    const exp = p.explanation ?? [];
    const guide = exp[0] ?? p.hint;
    const reveal = exp[exp.length - 1] ?? p.hint;
    p.hints = [
      { level: 'nudge', text: p.hint },
      { level: 'guide', text: guide },
      { level: 'reveal', text: reveal },
    ];
    changed = true;
  }

  // 2. Every difficulty-3 problem gets a titled 4th hint at the nudge level.
  //    Only add if a titled hint isn't already present (idempotent re-runs).
  if (p.difficulty === 3 && (p.hints?.length ?? 0) < 4) {
    const alreadyTitled = (p.hints ?? []).some((h) => !!h.title);
    if (!alreadyTitled) {
      p.hints = [altAngleFor(p), ...(p.hints ?? [])];
      changed = true;
    }
  }

  return changed;
}

async function main() {
  const files = await fg('content/problems/**/*.json', { cwd: ROOT, absolute: true });
  let touched = 0;
  let legacyFixed = 0;
  let d3Extended = 0;
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(raw) as Problem;
    const hadHints = Array.isArray(data.hints) && data.hints.length > 0;
    const beforeLen = data.hints?.length ?? 0;
    if (enrich(data)) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
      touched++;
      if (!hadHints) legacyFixed++;
      if (data.difficulty === 3 && (data.hints?.length ?? 0) > beforeLen && hadHints) {
        d3Extended++;
      }
    }
  }
  console.log(`✓ Enriched ${touched} file(s): ${legacyFixed} legacy → 3-tier; ${d3Extended} d3 → 4-tier.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
