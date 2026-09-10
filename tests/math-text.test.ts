import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { renderMathText } from '../src/utils/katex';

// Money is written "\$12" — an escaped dollar, so it isn't mistaken for a math
// delimiter. The renderer has to honour that escape in prose as well as inside
// math, and it must not pair the dollars of two separate amounts into one math
// span, which used to swallow the words between them.

/** The text a student actually sees, with markup and KaTeX spacing removed. */
function visible(text: string): string {
  return renderMathText(text)
    .replace(/<[^>]*>/g, '')
    .replace(/​/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('renderMathText — escaped dollars', () => {
  it('renders an escaped dollar in prose as a dollar sign, not a backslash', () => {
    expect(visible('Each gets \\$0.80.')).toBe('Each gets $0.80.');
  });

  it('keeps the words between two amounts', () => {
    // The regression: /\$([^$]+)\$/ paired the two escaped dollars, KaTeX-rendered
    // "13.87 book with a" as math, and the spaces collapsed.
    expect(visible('Jaylen pays for a \\$13.87 book with a \\$50 bill.')).toBe(
      'Jaylen pays for a $13.87 book with a $50 bill.',
    );
  });

  it('handles the escaped-dollar-then-math-number idiom used across the content', () => {
    expect(visible('A cab charges \\$$3$ plus \\$$2$ per mile.')).toBe(
      'A cab charges $3 plus $2 per mile.',
    );
  });

  it('renders an escaped dollar inside math as a dollar sign too', () => {
    expect(visible('The total is $\\$4.25$.')).toBe('The total is $4.25.');
  });

  it('handles three amounts in one sentence', () => {
    expect(visible('You buy items for \\$4.75, \\$3.20, and \\$1.05.')).toBe(
      'You buy items for $4.75, $3.20, and $1.05.',
    );
  });
});

describe('renderMathText — ordinary behaviour is unchanged', () => {
  it('still renders inline math', () => {
    expect(visible('Solve $2x + 5 = 17$ for $x$.')).toBe('Solve 2x+5=17 for x.');
  });

  it('still renders bold prose', () => {
    expect(renderMathText('What is the **percent off**?')).toContain('<strong>percent off</strong>');
  });

  it('still escapes HTML in prose', () => {
    expect(renderMathText('a < b & c')).toContain('&lt;');
    expect(renderMathText('a < b & c')).toContain('&amp;');
  });

  it('leaves an unpaired dollar as a literal dollar', () => {
    expect(visible('Costs $5 total')).toBe('Costs $5 total');
  });

  it('leaves text with no math untouched', () => {
    expect(visible('No math here at all.')).toBe('No math here at all.');
  });

  it('does not treat an empty $$ as math', () => {
    expect(visible('a $$ b')).toBe('a $$ b');
  });
});

describe('the shipped content renders cleanly', () => {
  function walk(dir: string, out: string[] = []): string[] {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (p.endsWith('.json')) out.push(p);
    }
    return out;
  }

  function strings(v: unknown, out: string[] = []): string[] {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
    return out;
  }

  it('no problem shows a stray backslash before a dollar sign', () => {
    const failures: string[] = [];
    for (const file of walk('content/problems')) {
      for (const s of strings(JSON.parse(readFileSync(file, 'utf8')))) {
        if (!s.includes('\\$')) continue;
        const out = visible(s);
        if (out.includes('\\$')) failures.push(`${file}: ${out.slice(0, 80)}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('no dollar amount swallows the words that follow it', () => {
    // "a \$13.87 book with a \$50 bill" must keep its spaces. If a math span
    // ever eats the prose between two amounts, the words run together.
    const failures: string[] = [];
    for (const file of walk('content/problems')) {
      for (const s of strings(JSON.parse(readFileSync(file, 'utf8')))) {
        if ((s.match(/\\\$/g) ?? []).length < 2) continue;
        // Every word of prose in the source should survive to the output.
        // Escaped dollars go first so the math-span strip can't mistake one
        // for a delimiter, and LaTeX macro names (\times) are not prose.
        const words = s
          .replace(/\\\$/g, ' ')
          .replace(/\$[^$]*\$/g, ' ')
          .replace(/\\[a-zA-Z]+/g, ' ')
          .match(/[A-Za-z]{4,}/g) ?? [];
        const out = visible(s);
        for (const w of words) {
          if (!out.includes(w)) failures.push(`${file}: lost "${w}" from ${out.slice(0, 70)}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
});
