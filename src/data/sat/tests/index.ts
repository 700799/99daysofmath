import type { SatMockTest, SatTestQuestion } from './types';
import { TEST_1 } from './test1';
import { TEST_2 } from './test2';
import { TEST_3 } from './test3';
import { TEST_4 } from './test4';
import { TEST_5 } from './test5';

export type { SatMockTest, SatTestQuestion, SatTestChoice } from './types';
export { MODULE_MINUTES, MODULE_QUESTIONS } from './types';

export const SAT_MOCK_TESTS: SatMockTest[] = [TEST_1, TEST_2, TEST_3, TEST_4, TEST_5];

const byNumber = new Map(SAT_MOCK_TESTS.map((t) => [t.n, t]));

export function getMockTest(n: number): SatMockTest | null {
  return byNumber.get(n) ?? null;
}

/** Both modules in order — the sequence a student actually answers. */
export function allQuestions(test: SatMockTest): SatTestQuestion[] {
  return [...test.module1, ...test.module2];
}
