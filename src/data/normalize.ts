import type { Problem } from '../types/problem';

const WORD_MAP: Record<string, string> = {
  'one half': '1/2',
  'one-half': '1/2',
  'one third': '1/3',
  'one-third': '1/3',
  'two thirds': '2/3',
  'two-thirds': '2/3',
  'one quarter': '1/4',
  'one-quarter': '1/4',
  'one fourth': '1/4',
  'one-fourth': '1/4',
  'three quarters': '3/4',
  'three-quarters': '3/4',
  'three fourths': '3/4',
  'three-fourths': '3/4',
};

export function basicClean(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[−]/g, '-') // unicode minus → ASCII
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/[.,!?]+$/g, '')
    .replace(/\s+/g, ' ');
}

function applyWordMap(input: string): string {
  let out = input;
  for (const [word, sym] of Object.entries(WORD_MAP)) {
    if (out === word) return sym;
    out = out.replace(new RegExp(`\\b${word}\\b`, 'g'), sym);
  }
  return out;
}

interface ParsedNumeric {
  value: number;
  form: 'fraction' | 'mixed' | 'percent' | 'decimal';
}

export function parseNumeric(input: string): ParsedNumeric | null {
  const cleaned = applyWordMap(basicClean(input)).replace(/\s+/g, ' ').trim();

  // Mixed number: "1 1/2"
  const mixed = cleaned.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const [, sign, whole, num, den] = mixed;
    const d = parseInt(den, 10);
    if (d === 0) return null;
    const value =
      (sign === '-' ? -1 : 1) * (parseInt(whole, 10) + parseInt(num, 10) / d);
    return { value, form: 'mixed' };
  }

  // Plain fraction: "1/2"
  const frac = cleaned.match(/^(-?\d+)\/(\d+)$/);
  if (frac) {
    const d = parseInt(frac[2], 10);
    if (d === 0) return null;
    return { value: parseInt(frac[1], 10) / d, form: 'fraction' };
  }

  // Percent: "50%"
  const pct = cleaned.match(/^(-?\d+(\.\d+)?)\s*%$/);
  if (pct) {
    return { value: parseFloat(pct[1]) / 100, form: 'percent' };
  }

  // Decimal: "0.5", "-3", or ".5"
  const dec = cleaned.match(/^-?(\d+(\.\d+)?|\.\d+)$/);
  if (dec) {
    return { value: parseFloat(cleaned), form: 'decimal' };
  }

  return null;
}

function normalizeExpression(input: string): string {
  return basicClean(input)
    .replace(/\s+/g, '')
    .replace(/\*/g, '')
    .replace(/(\d)(?=[a-z])/g, '$1'); // keep implicit multiplication
}

function approxEqual(a: number, b: number, tol: number): boolean {
  return Math.abs(a - b) <= tol;
}

export function isEquivalent(userInput: string, problem: Problem): boolean {
  if (userInput == null) return false;
  const candidates = [problem.primaryAnswer, ...problem.alternativeAnswers];

  // Multiple choice: compare on choice id (A/B/C/D) directly.
  if (problem.answerType === 'multiple-choice') {
    const u = basicClean(userInput).toUpperCase();
    return candidates.some((c) => c.toUpperCase() === u);
  }

  // Exact mode: post-clean string equality.
  if (problem.acceptanceMode === 'exact') {
    const u = applyWordMap(basicClean(userInput)).replace(/\s+/g, '');
    return candidates.some(
      (c) => applyWordMap(basicClean(c)).replace(/\s+/g, '') === u,
    );
  }

  // Expression mode: structural-ish normalize.
  if (problem.answerType === 'expression') {
    const u = normalizeExpression(userInput);
    return candidates.some((c) => normalizeExpression(c) === u);
  }

  // Numeric / fraction / short-text → try numeric comparison first.
  const userParsed = parseNumeric(userInput);
  if (userParsed) {
    const tol =
      problem.acceptanceMode === 'numeric-tolerance'
        ? (problem.numericTolerance ?? 1e-6)
        : 1e-9;
    for (const c of candidates) {
      const cParsed = parseNumeric(c);
      if (cParsed && approxEqual(userParsed.value, cParsed.value, tol)) {
        return true;
      }
    }
  }

  // Fallback to cleaned string compare.
  const u = applyWordMap(basicClean(userInput));
  return candidates.some((c) => applyWordMap(basicClean(c)) === u);
}
