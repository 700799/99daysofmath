import { describe, it, expect } from 'vitest';
import { isEquivalent, parseNumeric, basicClean } from '../src/data/normalize';
import type { Problem } from '../src/types/problem';

function makeProblem(over: Partial<Problem>): Problem {
  return {
    id: 'TEST.001',
    domain: '6.RP',
    unit: 1,
    orderInUnit: 1,
    standard: '6.RP.A.1',
    difficulty: 1,
    prompt: 'test',
    answerType: 'numeric',
    primaryAnswer: '0',
    alternativeAnswers: [],
    acceptanceMode: 'normalized',
    hint: 'h',
    explanation: ['e'],
    tags: [],
    estimatedSeconds: 30,
    ...over,
  };
}

describe('basicClean', () => {
  it('trims and lowercases', () => {
    expect(basicClean('  Hello!  ')).toBe('hello');
  });
  it('converts unicode minus to ascii', () => {
    expect(basicClean('−5')).toBe('-5');
  });
});

describe('parseNumeric', () => {
  it('parses plain integers', () => {
    expect(parseNumeric('42')?.value).toBe(42);
  });
  it('parses negatives', () => {
    expect(parseNumeric('-3')?.value).toBe(-3);
    expect(parseNumeric('−3')?.value).toBe(-3);
  });
  it('parses decimals', () => {
    expect(parseNumeric('0.5')?.value).toBe(0.5);
  });
  it('parses fractions', () => {
    expect(parseNumeric('1/2')?.value).toBe(0.5);
    expect(parseNumeric('-3/4')?.value).toBe(-0.75);
  });
  it('parses mixed numbers', () => {
    expect(parseNumeric('1 1/2')?.value).toBe(1.5);
  });
  it('parses percent', () => {
    expect(parseNumeric('50%')?.value).toBe(0.5);
  });
  it('parses spelled fractions', () => {
    expect(parseNumeric('one half')?.value).toBe(0.5);
    expect(parseNumeric('three fourths')?.value).toBe(0.75);
  });
  it('rejects gibberish', () => {
    expect(parseNumeric('banana')).toBeNull();
  });
  it('rejects divide by zero', () => {
    expect(parseNumeric('1/0')).toBeNull();
  });
});

describe('isEquivalent numeric', () => {
  const p = makeProblem({ primaryAnswer: '0.5', alternativeAnswers: ['1/2'] });
  it('accepts the primary', () => {
    expect(isEquivalent('0.5', p)).toBe(true);
  });
  it('accepts alternative form', () => {
    expect(isEquivalent('1/2', p)).toBe(true);
  });
  it('accepts equivalent decimal', () => {
    expect(isEquivalent('.5', p)).toBe(true);
  });
  it('accepts equivalent fraction not listed', () => {
    expect(isEquivalent('2/4', p)).toBe(true);
  });
  it('accepts spelled form', () => {
    expect(isEquivalent('one half', p)).toBe(true);
  });
  it('rejects wrong value', () => {
    expect(isEquivalent('0.4', p)).toBe(false);
  });
  it('rejects garbage', () => {
    expect(isEquivalent('xyzzy', p)).toBe(false);
  });
});

describe('isEquivalent percent vs decimal — express-as-percent guard', () => {
  const p = makeProblem({
    primaryAnswer: '50%',
    alternativeAnswers: ['50 %'],
    acceptanceMode: 'exact',
  });
  it('accepts the percent form', () => {
    expect(isEquivalent('50%', p)).toBe(true);
  });
  it('rejects bare decimal when exact percent is required', () => {
    expect(isEquivalent('0.5', p)).toBe(false);
  });
  it('rejects bare fraction when exact percent is required', () => {
    expect(isEquivalent('1/2', p)).toBe(false);
  });
});

describe('isEquivalent multiple-choice', () => {
  const p = makeProblem({
    answerType: 'multiple-choice',
    primaryAnswer: 'B',
    alternativeAnswers: [],
    choices: [
      { id: 'A', label: '1', correct: false },
      { id: 'B', label: '2', correct: true },
      { id: 'C', label: '3', correct: false },
      { id: 'D', label: '4', correct: false },
    ],
  });
  it('accepts the correct choice id', () => {
    expect(isEquivalent('B', p)).toBe(true);
    expect(isEquivalent('b', p)).toBe(true);
  });
  it('rejects other choices', () => {
    expect(isEquivalent('A', p)).toBe(false);
  });
});

describe('isEquivalent expression', () => {
  const p = makeProblem({
    answerType: 'expression',
    primaryAnswer: '2x+4',
    alternativeAnswers: ['4+2x'],
  });
  it('accepts the same expression', () => {
    expect(isEquivalent('2x+4', p)).toBe(true);
  });
  it('accepts spaces', () => {
    expect(isEquivalent('2x + 4', p)).toBe(true);
  });
  it('accepts the alternative ordering listed', () => {
    expect(isEquivalent('4+2x', p)).toBe(true);
  });
  it('rejects different expression', () => {
    expect(isEquivalent('2x+5', p)).toBe(false);
  });
});

describe('isEquivalent numeric-tolerance', () => {
  const p = makeProblem({
    primaryAnswer: '3.14159',
    alternativeAnswers: [],
    acceptanceMode: 'numeric-tolerance',
    numericTolerance: 0.01,
  });
  it('accepts within tolerance', () => {
    expect(isEquivalent('3.14', p)).toBe(true);
    expect(isEquivalent('3.15', p)).toBe(true);
  });
  it('rejects outside tolerance', () => {
    expect(isEquivalent('3.2', p)).toBe(false);
  });
});

describe('isEquivalent edge cases', () => {
  const p = makeProblem({ primaryAnswer: '0', alternativeAnswers: [] });
  it('handles trailing punctuation', () => {
    expect(isEquivalent('0.', p)).toBe(true);
  });
  it('handles whitespace', () => {
    expect(isEquivalent('  0  ', p)).toBe(true);
  });
});
